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
      var heartbeatDataset = {
        name: 'Economic heartbeat',
        description: 'description',
        icon: 'usd',
        source: 'N/A'
      };
      var heartbeatData = [];
      var standardisedDatasets = [];
      var aggregateDataset = {};
      _.each(datasets, function(dataset) {
        if (dataset.frequency === 'Q') {
          standardisedDatasets.push(dataset);
        }
        else if (dataset.frequency === 'M') {
          aggregateDataset = {
            name: dataset.name,
            description: dataset.description,
            icon: dataset.icon,
            source: dataset.source,
            weight: dataset.weight,
            data: _.clone(dataset.data)
          };
          var aggregateData = [];
          var firstPointFound = false;
          var points = [];
          _.each(dataset.data, function(point) {
            var utcDate = new Date(point[0]);
            var month = utcDate.getUTCMonth();
            if(month == 0 && !firstPointFound) {
              firstPointFound = true;
              points.push(point);
            }
            else if (firstPointFound && !isNaN(month)) {
              if(points.length == 3) {
                var firstDate = new Date(points[0][0]);
                var x = Date.UTC(parseInt(firstDate.getUTCFullYear()), firstDate.getUTCMonth()-1, 1);
                var y = (points[0][1] + points[1][1] + points[2][1])/3;
                aggregateData.push([x, y]);
                points = [];
              }
              else {
                points.push(point);
              }
            }
          })
          aggregateDataset.data = aggregateData;
          standardisedDatasets.push(aggregateDataset);
        }
      })
      var startValue = -Infinity;
      _.each(standardisedDatasets, function(dataset) {
        if(dataset.data[0][0] >= startValue)
          startValue = dataset.data[0][0];
      })
      _.each(standardisedDatasets, function(dataset) {
        dataset.data = _.filter(dataset.data, function(point) {
          if(point[0] >= startValue)
            return true;
          else
            return false;
        })
      })
      var minLength = Infinity;
      _.each(standardisedDatasets, function(dataset) {
        if(dataset.data.length < minLength+1)
          minLength = dataset.data.length;
      })
      for(var i = 0; i < minLength; i++ ) {
        var point = 0;
        for(var j = 0; j < standardisedDatasets.length; j++) {
            point += standardisedDatasets[j].data[i][1];
        }
        heartbeatData.push([standardisedDatasets[0].data[i][0], point]);
      }
      heartbeatDataset.data = heartbeatData;

      return heartbeatDataset;
    }
});
