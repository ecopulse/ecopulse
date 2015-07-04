'use strict';

/**
 * @ngdoc function
 * @name ecopulse.services:Query
 * @description
 * # Query
 * Service of ecopulse
 */

angular.module('ecopulse')
  .service('Query', function($http, Datasets, Transform) {

    var baseUrl = 'http://stat.abs.gov.au/itt/query.jsp?method=GetGenericData';

    function statAbsQuery(datasetInfo, start, end) {
      return baseUrl + '&datasetid=' + datasetInfo.dataset + '&and=' +
      _.map(
      _.pairs(datasetInfo.params),
      function(pair) {
        return pair.join('.');
      }).join(',') + '&start=' + start + '&callback=JSON_CALLBACK';
    }

    return {
      process: function(datasetInfo, start, end) {
        if(datasetInfo.dynamic) {
          return $http.jsonp(statAbsQuery(datasetInfo, start, end))
          .success(function(result) {
          })
          .error(function (result) {
            console.log("Request failed");
          });
        }
        else {
          return $http.get(datasetInfo.dataset)
          .success(function(result) {
          })
          .error(function (result) {
            console.log("Request failed");
          });
        }
      }
    }
});
