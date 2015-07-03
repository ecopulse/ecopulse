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

    return {
      convert: function(data) {
        var vals = _.map(data.series[0].observations, function(ob) {
          var val = [];
          var dateTimeArr = ob.Time.split("-");
          val.push(Date.UTC(parseInt(dateTimeArr[0]), parseInt(dateTimeArr[1][1])*3, 1));
          val.push(parseFloat(ob.Value));
          return val;
        });
        return vals;
      }
    }
});
