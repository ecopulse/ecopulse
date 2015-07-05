'use strict';

/**
 * @ngdoc function
 * @name ecopulse.services:Combine
 * @description
 * # Combine
 * Service of ecopulse
 */

angular.module('ecopulse')
  .service('Combine', function() {

    this.heartbeat = function(datasets) {
      var interpolatedData = [];
      _.each(datasets, function(dataset) {
        if(dataset.frequency == 'Q') {
          interpolatedData.push([dataset.data]);
        }
      })
    }
});
