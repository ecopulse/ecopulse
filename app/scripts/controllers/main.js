'use strict';

/**
 * @ngdoc function
 * @name ecopulse.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of ecopulse
 */
angular.module('ecopulse')
  .controller('MainCtrl', function ($scope, $http, Query, Datasets, Transform) {

    $scope.start_date = '2000';
    $scope.datasets = [];

    $scope.getData = function () {
      $scope.highchartsNG.loading = true;

      /* Reset datasets */
      $scope.datasets = [];
      $scope.targetDate = Date.now();

      _.each(Datasets.getIds(), function(id) {
        var datasetInfo = Datasets.getItem(id)
        Query.process(datasetInfo, $scope.start_date, $scope.end_date).then(function(result) {
          // Import the data from the data source
          datasetInfo.data = Transform.process(datasetInfo.transform,result.data);

          var lastIndex = datasetInfo.data.length - 1;
          datasetInfo.data[lastIndex] = {
            x: datasetInfo.data[lastIndex][0],
            y: datasetInfo.data[lastIndex][1],
            dataLabels: { enabled: true }
          }

          // Set the ID for later use
          datasetInfo.id = id;

          $scope.datasets.push(datasetInfo);

          $scope.highchartsNG.loading = false;
        });
      })
    }

    $scope.chartSeries = function(datasetId) {
      /* Clear chart */
      $scope.highchartsNG.series = [];

      /* Find the dataset */
      $scope.currentGraphedDataset = _.find($scope.datasets, function(set) {
        return set.id == datasetId;
      });

      $scope.highchartsNG.title.text = $scope.currentGraphedDataset.name;
      $scope.highchartsNG.series.push($scope.currentGraphedDataset);
    }

    $scope.highchartsNG = {
      options: {
        chart: {
          type: 'line',
          events:{
            click: $scope.updateTargetDate
          }
        },
        xAxis: {
          type: 'datetime',
          title: {
            text: 'Date'
          },
          labels: {
            formatter: function() {
              var quarter = Math.ceil((new Date(this.value).getMonth() + 1) / 3);
              return Highcharts.dateFormat('Q' + quarter + ' %Y' , this.value);
            }
          }
        },
        yAxis: {
          title: {
            text: 'Value'
          }
        }
      },
      series: [],
      title: {
        text: "Our Economic Heartbeat"
      },
      loading: true
    }
  });
