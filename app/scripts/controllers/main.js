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

    /* Hard-code some datasets for now */
    $scope.datasets = [
      {
        id: 'established-houses-index',
        name: 'Established Houses (index)',
        description: "Some information about Established Houses (index)",
        icon: 'home',
        data: [['2015-06', 90]]
      },
      {
        id: 'established-houses-change-quarter',
        name: 'Established Houses - change since previous quarter',
        description: "Some information about Established Houses - change since previous quarter",
        icon: 'home',
        data: [['2015-06', 90]]
      },
      {
        id: 'established-houses-change-year',
        name: 'Established Houses - change since previous year',
        description: "Some information about Established Houses - change since previous year",
        icon: 'home',
        data: [['2015-06', 90]]
      }
    ];

    $scope.getData = function () {
      $scope.highchartsNG.loading = true;

      Query.process($scope.dataset, $scope.prop_type, $scope.measure, $scope.start_date).then(function(result) {
        $scope.highchartsNG.loading = false;
        $scope.updateChart(Transform.convert('stat.ABS', result.data));
      });
    };

    $scope.updateChart = function(vals) {
      $scope.highchartsNG.series.push({
        data: vals,
        name: prop_type_strings[$scope.prop_type] + ' ' + measure_strings[$scope.measure]
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
