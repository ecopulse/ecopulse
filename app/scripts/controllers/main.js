'use strict';

/**
 * @ngdoc function
 * @name ecopulse.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of ecopulse
 */
angular.module('ecopulse')
  .controller('MainCtrl', function ($scope, $http, Query, Transform) {

    $scope.dataset = 'RES_PROP_INDEX';
    $scope.start_date = '2003';
    var prop_type_strings = ["","Attached dwellings","Established houses","Residential property"];
    var measure_strings = ["","Index number","% change from previous quarter","% change from same quarter of previous year"];

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

      /* Clear chart */
      $scope.highchartsNG.series = [];

      _.each([1,2,3], function(prop_type) {
        _.each([1,2,3], function(measure) {
          Query.process($scope.dataset, prop_type, measure, $scope.start_date).then(function(result) {
            result = Transform.convert('stat.ABS', result.data);

            $scope.datasets.push({
              id: 'dataset-' + (prop_type*10 + measure),
              name: prop_type_strings[prop_type] + ' ' + measure_strings[measure],
              description: "Some information about " + prop_type_strings[prop_type] + ' ' + measure_strings[measure],
              icon: 'home',
              data: result
            });
            //
            // $scope.updateChart(
            //   result,
            //   prop_type_strings[prop_type] + ' ' + measure_strings[measure]
            // );
          });
        });
      });

      $scope.highchartsNG.loading = false;
    };

    $scope.chartSeries = function(datasetId) {
      /* Clear chart */
      $scope.highchartsNG.series = [];

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
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
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
        enabled: false
      },
      loading: false
    }
  });
