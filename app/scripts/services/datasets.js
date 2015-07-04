'use strict';

/**
 * @ngdoc function
 * @name ecopulse.services:Datasets
 * @description
 * # Datasets
 * Service of ecopulse
 */

angular.module('ecopulse')
  .service('Datasets', function() {

    this.getIds = function() {
        return _.map(items, function(v, i){
          return i;
        });
    }
    this.getItem = function(id) {
        return items[id];
    }

    var items = {};

    items['CPI'] = {
        name: 'CPI Annual Change',
        dynamic: true,
        description: "Info about the consumer price index",
        icon: 'home',
        source: 'ABS.Stat',
        dataset: 'CPI',
        transform: 'ABS.Stat.Q',
        params: {
          'FREQUENCY': 'Q', // Quarterly data
          'TSEST': '20', // Seasonally Adjusted
          'REGION': '50', // Weighted average of eight capital cities
          'MEASURE': '3', // Percentage Change from Corresponding Quarter of the Previous Year'
          'INDEX' : '999901' // All groups CPI, seasonally adjusted
        }
      }

      items['UE'] = {
          name: 'Unemployment Rate',
          dynamic: true,
          description: "Info about the unemployment rate",
          icon: 'home',
          source: 'ABS.Stat',
          dataset: 'LF',
          transform: 'ABS.Stat.M',
          params: {
            'FREQUENCY': 'M', // Monthly data
            'TSEST': '20', // Seasonally Adjusted
            'SEX_ABS': '3', // All persons
            'AGE': '1599', // All ages
            'ITEM' : '14', // Unemployment rate
            'ASGC_2010': '0' // Australia wide
          }
        }
});
