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

    var transforms = [];

    /* stat.ABS quarterly*/
    transforms['ABS.Stat.Q'] = function(dataset) {
      return _.map(dataset.series[0].observations, function(ob) {
        var dateTimeArr = ob.Time.split("-");
        /* Convert 2015-Qx into a datetime object */
        var x = Date.UTC(parseInt(dateTimeArr[0]), parseInt(dateTimeArr[1][1])*3, 1);
        /* Convert string into a float object */
        var y = parseFloat(ob.Value);
        /* Return the coordinates for this point */
        return [x, y];
      });
    }

    transforms['ABS.Stat.M'] = function(dataset) {
      return _.map(dataset.series[0].observations, function(ob) {
        var dateTimeArr = ob.Time.split("-");
        /* Convert 2015-xx into a datetime object */
        var x = Date.UTC(parseInt(dateTimeArr[0]), parseInt(dateTimeArr[1]), 1);
        /* Convert string into a float object */
        var y = parseFloat(ob.Value);
        /* Return the coordinates for this point */
        return [x, y];
      });
    }

    transforms['static'] = function(dataset) {
      return _.map(dataset, function(ob) {
        /* Return the coordinates for this point */
        return [ob.Time, ob.Value];
      });
    }

    this.process = function(id, data) {
        return transforms[id](data);
    }
});
