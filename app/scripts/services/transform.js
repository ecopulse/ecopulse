'use strict';

/**
 * @ngdoc function
 * @name ecopulse.services:Transform
 * @description
 * # Transform
 * Service of ecopulse
 */

angular.module('ecopulse')
  .service('Transform', function() {

    var transformationFunctions = [];

    /* stat.ABS */
    transformationFunctions['stat.ABS'] = function(dataset) {
      return _.map(dataset.series[0].observations, function(ob) {
        var dateTimeArr = ob.Time.split("-");

        /* Convert 2015-Q2 into a datetime object */
        var x = Date.UTC(parseInt(dateTimeArr[0]), parseInt(dateTimeArr[1][1])*3, 1);
        /* Convert string into a float object */
        var y = parseFloat(ob.Value);

        /* Return the coordinates for this point */
        return [x, y];
      });
    }

    return {
      convert: function(dataSource, dataset) {
        return transformationFunctions[dataSource](dataset);
      }
    }
});
