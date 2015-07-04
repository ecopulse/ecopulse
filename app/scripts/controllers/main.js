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

    $scope.availableDatasets = ['CPI','UE'];
    $scope.start_date = '2003';
    $scope.end_date = '2010';
    $scope.datasets = [];

    $scope.getData = function () {
      $scope.highchartsNG.loading = true;

      _.each($scope.availableDatasets, function(dataset) {
        var datasetInfo = Datasets.getItem(dataset)
        if(datasetInfo.dynamic) {
          Query.dynamic(dataset, $scope.start_date, $scope.end_date).then(function(result) {
            var processedData = Transform.process(datasetInfo.transform,result.data);
            var newDataset = datasetInfo;
            newDataset['data'] = processedData;
            $scope.datasets.push(newDataset);
            $scope.updateChart(
              processedData,
              newDataset.name
            );
            $scope.highchartsNG.loading = false;
          });
        }
      })
    }

    $scope.updateChart = function(vals, title) {
      $scope.highchartsNG.series.push({
        data: vals,
        name: title
      })
    }

    $scope.clearChart = function () {
      $scope.highchartsNG.series = [];
    }

    $scope.highchartsNG = {
      options: {
        chart: {
          type: 'line'
        },
        tooltip: {
          formatter: function() {
            var quarter = Math.ceil((new Date(this.x).getMonth() + 1) / 3);
            var s = '<b>' + Highcharts.dateFormat('Q' + quarter + ' %Y' , this.x) + '</b>';
            s += '<br/>' + this.series.name + ': ' + this.y;
            return s;
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
        text: 'Data'
      },
      loading: false
    }
  });
