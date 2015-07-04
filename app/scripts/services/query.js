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

    function statAbsQuery(id, start, end) {
      var item = Datasets.getItem(id);
      return baseUrl + '&datasetid=' + item.dataset + '&and=' +
      _.map(
      _.pairs(item.params),
      function(pair) {
        return pair.join('.');
      }).join(',') + '&start=' + start + '&callback=JSON_CALLBACK';
    }

    return {
      dynamic: function(id, start, end) {
        return $http.jsonp(statAbsQuery(id, start, end))
        .success(function(result) {
        })
        .error(function (result) {
          console.log("Request failed");
        });
      }
    }
});
