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
        description: 'Indicates health of the Australian economy',
        icon: 'heart',
        source: 'N/A'
      };
      var heartbeatData = [];
      var standardisedDatasets = [];
      var aggregateDataset = {};
      var interpolatedDataset = {};
      _.each(datasets, function(dataset) {
        /* Interpolate quarterly points from annual data */
        if (dataset.frequency === 'A') {
          interpolatedDataset = {
            name: dataset.name,
            description: dataset.description,
            icon: dataset.icon,
            source: dataset.source,
            weight: dataset.weight,
            data: _.clone(dataset.data)
          };
          var interpolatedData = [];
          var curDate = new Date(dataset.data[0][0]);
          var year = curDate.getUTCFullYear();
          for (var i = 0; i < dataset.data.length-1; i++) {
            var thisVal = dataset.data[i][1];
            var nextVal = dataset.data[i+1][1];
            var diff = nextVal - thisVal;
            for(var j = 0; j < 4; j++) {
              interpolatedData.push([Date.UTC(year, j*3, 1),thisVal+diff*j/4]);
            }
            year++;
          }
          interpolatedDataset.data = interpolatedData;
          standardisedDatasets.push(interpolatedDataset);
        }
        /* Quarterly data remains the same */
        if (dataset.frequency === 'Q') {
          standardisedDatasets.push(dataset);
        }
        /* Aggregate monthly data to form quarterly */
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
            if(month == 0 && !firstPointFound) { // Start data in January
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
      /* Find data with most recent start date */
      var startDate = -Infinity;
      _.each(standardisedDatasets, function(dataset) {
        if(dataset.data[0][0] >= startDate)
          startDate = dataset.data[0][0];
      })
      /* Remove data from other datasets before startDate */
      _.each(standardisedDatasets, function(dataset) {
        dataset.data = _.filter(dataset.data, function(point) {
          if(point[0] >= startDate)
            return true;
          else
            return false;
        })
      })
      /* Find smallest dataset */
      var minLength = Infinity;
      _.each(standardisedDatasets, function(dataset) {
        if(dataset.data.length < minLength+1)
          minLength = dataset.data.length;
      })
      /* Create economic heartbeat from aligned datasets */
      for (var i = 0; i < minLength; i++ ) {
        var point = 0;
        for (var j = 0; j < standardisedDatasets.length; j++) {
          var val = standardisedDatasets[j].data[i][1];
          var weight = standardisedDatasets[j].weight;
          var measure = 0;
          if (standardisedDatasets[j].scale === 'CPI') {
            if(val > 2 && val < 3)
              measure = 100;
            else
              measure = (100 - 25*abs(val-2)^2);
          }
          else if (standardisedDatasets[j].scale === 'UE') {
            measure = (100 - 6*abs(5-val));
          }
          else {
            measure = (30 + 12.5*val);
          }
          if (measure < 0)
            measure = 0;
          else if (measure > 100)
            measure = 100;
          point += measure*weight;
        }
        heartbeatData.push([standardisedDatasets[0].data[i][0], point]);
      }
      heartbeatDataset.data = heartbeatData;

      return heartbeatDataset;
    }
});
