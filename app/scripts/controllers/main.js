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

    $scope.getData = function () {
      $scope.highchartsNG.loading = true;

      $scope.datasets = [];

      _.each([1,2,3], function(prop_type) {
        _.each([1,2,3], function(measure) {
          Query.process($scope.dataset, prop_type, measure, $scope.start_date).then(function(result) {
            console.debug(result);
            result = Transform.convert('stat.ABS', result.data);

            $scope.datasets.push({
              id: 'dataset-' + (prop_type*10 + measure),
              name: prop_type_strings[prop_type] + ' ' + measure_strings[measure],
              description: "Some information about " + prop_type_strings[prop_type] + ' ' + measure_strings[measure],
              icon: 'home',
              data: result
            });

            $scope.updateChart(
              result,
              prop_type_strings[prop_type] + ' ' + measure_strings[measure]
            );
          });
        });
      });

      $scope.highchartsNG.loading = false;
    };

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
        text: $scope.dataset
      },
      loading: false
    }
  });
