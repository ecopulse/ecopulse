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

    $scope.start_date = '2003';
    $scope.end_date = '2010';
    $scope.datasets = [];

    var redrawTargetLine = function(chart, yPoint) {
      // Get rid of the old target line
      if ($scope.targetLine) { $scope.targetLine.destroy(); }

      // Draw the new target line
      $scope.targetLine = chart.renderer
        .path(['M', yPoint, chart.plotTop, 'V', chart.plotSizeY + chart.plotTop])
        .attr({
          'stroke-width': 1,
          stroke: 'silver',
          dashstyle: 'dash'
      });

      // Draw the new line on the chart object
      $scope.targetLine.add();
    }

    $scope.updateTargetDate = function(ev) {
      // Current scope is the chart
      redrawTargetLine(this, ev.chartX);

      // Update the global target date
      $scope.targetDate = this.xAxis[0].toValue(ev.chartX);
    };

    $scope.getData = function () {
      $scope.highchartsNG.loading = true;

      /* Reset datasets */
      $scope.datasets = [];
      $scope.targetDate = Date.now();

      _.each(Datasets.getIds(), function(id) {
        var datasetInfo = Datasets.getItem(id)
        if(datasetInfo.dynamic) {
          Query.dynamic(id, $scope.start_date, $scope.end_date).then(function(result) {
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
        }
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
      legend: {
        text: 'Data'
      },
      loading: false
    }
  });
