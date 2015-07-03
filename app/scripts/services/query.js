'use strict';

/**
 * @ngdoc function
 * @name ecopulse.services:Query
 * @description
 * # Query
 * Service of ecopulse
 */

angular.module('ecopulse')
  .service('Query', function($http) {

    var baseUrl = 'http://stat.abs.gov.au/itt/query.jsp?method=GetGenericData&datasetid=';

    return {
      process: function(dataset,prop_type,measure,start_date) {
        return $http.jsonp(baseUrl + dataset + '&and=PROP_TYPE.' + prop_type + ',ASGS_2011.100,MEASURE.' + measure + '&start=' + start_date + '&callback=JSON_CALLBACK')
          .success(function(result) {
            return result.data;
          })
          .error(function (result) {
            console.log("Request failed");
          });
      }
    }
});
