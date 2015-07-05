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

    var numValue = function(number) { return number; };

    var percentValue = function(number) { return number.toFixed(2) + '%'; };

    var items = {};

    items['CPI'] = {
        name: 'CPI Annual Change',
        dynamic: true,
        description: "Info about the consumer price index",
        icon: 'tag',
        units: 'Percent',
        formatter: percentValue,
        source: 'ABS.Stat',
        dataset: 'CPI',
        frequency: 'Q',
        weighting: 0.25,
        transform: 'ABS.Stat.Q',
        params: {
          'FREQUENCY': 'Q', // Quarterly data
          'TSEST': '20', // Seasonally Adjusted
          'REGION': '50', // Weighted average of eight capital cities
          'MEASURE': '3', // Percentage Change from Corresponding Quarter of the Previous Year
          'INDEX' : '999901' // All groups CPI, seasonally adjusted
        }
      }

      items['UE'] = {
          name: 'Unemployment Rate',
          dynamic: true,
          description: "Info about the unemployment rate",
          icon: 'user',
          units: 'Percent',
        formatter: percentValue,
          source: 'ABS.Stat',
          dataset: 'LF',
          frequency: 'M',
          weighting: 0.25,
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
        items['WG'] = {
            name: 'Wages Annual Change',
            dynamic: true,
            description: "Info about wage growth",
            icon: 'usd',
            units: 'Percent',
            formatter: percentValue,
            source: 'ABS.Stat',
            dataset: 'LABOUR_PRICE_INDEX',
            frequency: 'Q',
            weighting: 0.25,
            transform: 'ABS.Stat.Q',
            params: {
              'FREQUENCY': 'Q', // Quarterly data
              'TSEST': '20', // Seasonally Adjusted
              'INDEX': 'THRPEB', // Total hourly rates of pay excluding bonuses
              'SECTOR': '7', // All Sectors
              'MEASURE' : '3', // Percentage Change from Corresponding Quarter of the Previous Year
              'REGION': '0', // Australia wide
              'INDUSTRY': '-' // All industries
            }
        }
        items['CHARITY'] = {
            name: 'Charity',
            dynamic: false,
            description: "Info about charity",
            icon: 'thumbs-up',
            units: 'Percent',
            formatter: percentValue,
            source: 'TBA',
            dataset: '/data/charity.json',
            frequency: 'A',
            weighting: 0.25,
            transform: 'static'
        }
});
