'use strict';

/**
 * @ngdoc function
 * @name ecopulse.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of ecopulse
 */
angular.module('ecopulse')
  .controller('MainCtrl', function ($scope, $http, Query, Datasets, Transform, Combine) {

    $scope.start_date = '2000';
    $scope.datasets = [];

    $scope.getData = function () {
      $scope.highchartsNG.loading = true;

      /* Reset datasets */
      $scope.datasets = [];
      $scope.targetDate = Date.now();
      $scope.queriesRunning = Datasets.getIds();

      _.each(Datasets.getIds(), function(id) {
        var dataset = Datasets.getItem(id)
        Query.process(dataset, $scope.start_date, $scope.end_date).then(function(result) {
          // Import the data from the data source
          dataset.data = Transform.process(dataset.transform,result.data);

          // Show the data label on the last point
          var lastIndex = dataset.data.length - 1;
          dataset.data[lastIndex] = {
            x: dataset.data[lastIndex][0],
            y: dataset.data[lastIndex][1],
            dataLabels: { enabled: true }
          }

          // Set the ID for later use
          dataset.id = id;

          // Plot this on the second y axis
          dataset.yAxis = 1;

          // Format the latest value for output in the table
          dataset.latest = dataset.formatter(dataset.data[dataset.data.length - 1].y);

          $scope.datasets.push(dataset);

          $scope.queriesRunning = _.without($scope.queriesRunning, id);
          if($scope.queriesRunning.length <= 0)
            Combine.heartbeat($scope.datasets);
        });
      })
    }

    $scope.chartSeries = function(datasetId) {
      $scope.highchartsNG.loading = true;

      /* Clear chart */
      if ($scope.highchartsNG.series.length > 1)
        $scope.highchartsNG.series.pop();

      /* Find the dataset */
      $scope.currentGraphedDataset = _.find($scope.datasets, function(set) {
        return set.id == datasetId;
      });

      $scope.highchartsNG.title.text = $scope.currentGraphedDataset.name;
      $scope.highchartsNG.options.yAxis[1].title.text = $scope.currentGraphedDataset.units;
      $scope.highchartsNG.series.push($scope.currentGraphedDataset);

      $scope.highchartsNG.loading = false;
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
        yAxis: [
          {
            title: {
              text: 'Hearbeat Index'
            }
          },
          {
            title: {
              text: ''
            },
            opposite: true
          }
        ],
        plotOptions: {
          line: {
            dataLabels: {
              formatter: function() {
                return this.y.toFixed(2);
              }
            },
            tooltip: {
              pointFormatter: function() {
                return '<span style="color:{point.color}">\u25CF</span>' +
                  this.series.name +
                  ': <b>' +
                  this.y.toFixed(2) +
                  '</b><br/>';
              }
            }
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
