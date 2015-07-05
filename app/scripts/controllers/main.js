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

    var chartHeartbeat = function() {
      $scope.highchartsNG.loading = true;

      // Reset the chart series. This ensures the heartbeat is first!
      $scope.highchartsNG.series = []

      // Hax
      var dataset = $scope.datasets[0]

      // Make some random data representing the heartbeat for now
      var randomData = _.compact(_.map(dataset.data, function(pair) {
        // Ignore data before the year 2000
        if (pair[0] <= 946684800000) {
          return undefined;
        } else {
          return [pair[0], pair[1] + Math.random()*50];
        }
      }));

      var chartData = {
        name: "Australia's Economic Heartbeat",
        yAxis: 0, // Plot this on the first y axis
        data: randomData
      };

      // Show the data label on the last point
      var lastIndex = chartData.data.length - 1;
      chartData.data[lastIndex] = {
        x: chartData.data[lastIndex][0],
        y: chartData.data[lastIndex][1],
        dataLabels: { enabled: true }
      }

      $scope.highchartsNG.series.push(chartData);

      $scope.highchartsNG.loading = false;
    }

    $scope.getData = function () {
      $scope.highchartsNG.loading = true;

      /* Reset datasets */
      $scope.datasets = [];
      $scope.targetDate = Date.now();
      $scope.queriesRunning = Datasets.getIds();

      _.each(Datasets.getIds(), function(id) {
        var dataset = Datasets.getItem(id)
        Query.process(dataset, $scope.start_date, $scope.end_date).then(function(result) {
          // Set the ID for later use
          dataset.id = id;

          // Import the data from the data source
          dataset.data = Transform.process(dataset.transform,result.data);

          // Format the latest value for output in the table
          dataset.latest = dataset.formatter(dataset.data[dataset.data.length - 1][1]);

          $scope.datasets.push(dataset);

          $scope.queriesRunning = _.without($scope.queriesRunning, id);
          if($scope.queriesRunning.length <= 0) {
            Combine.heartbeat($scope.datasets);
            chartHeartbeat();
          }
        });
      })
    }

    $scope.chartSeries = function(datasetId) {
      // Don't try to chart the current chart
      if (!_.isUndefined($scope.currentChartDataset) && datasetId == $scope.currentChartDataset.id) {
        return;
      }

      $scope.highchartsNG.loading = true;

      /* Clear chart */
      if ($scope.highchartsNG.series.length > 1)
        $scope.highchartsNG.series.pop();

      /* Find the dataset */
      var dataset = _.find($scope.datasets, function(set) {
        return set.id == datasetId;
      });

      var chartData = {
        name: dataset.name,
        yAxis: 1, // Plot this on the second y axis
        data: _.clone(dataset.data)
      };

      // Show the data label on the last point
      var lastIndex = chartData.data.length - 1;
      chartData.data[lastIndex] = {
        x: chartData.data[lastIndex][0],
        y: chartData.data[lastIndex][1],
        dataLabels: { enabled: true }
      }

      $scope.highchartsNG.title.text = dataset.name;
      $scope.highchartsNG.options.yAxis[1].title.text = dataset.units;
      $scope.highchartsNG.series.push(chartData);

      $scope.currentChartDataset = dataset;

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
        text: "Australia's Economic Heartbeat"
      },
      loading: true
    }
  });
