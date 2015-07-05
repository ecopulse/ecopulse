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
      description: "This data set contains the percentage change of the Consumer Price Index for all groups after a year. It is seasonally adjusted data released quarterly on stat.ABS.",
      icon: 'tag',
      units: 'Percent',
      formatter: percentValue,
      seriesColour: '#7cb5ec',
      source: 'ABS.Stat',
      dataset: 'CPI',
      frequency: 'Q',
      weight: 0.1,
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
      description: "This data set contains the Australia wide unemployment rate for all persons of all ages. It is seasonally adjusted data released monthly on stat.ABS.",
      icon: 'user',
      units: 'Percent',
      formatter: percentValue,
      seriesColour: '#434348',
      source: 'ABS.Stat',
      dataset: 'LF',
      frequency: 'M',
      weight: 0.1,
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
      seriesColour: '#90ed7d',
      source: 'ABS.Stat',
      dataset: 'LABOUR_PRICE_INDEX',
      frequency: 'Q',
      weight: 0.1,
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
      description: "Annual growth in registered charities (%)",
      icon: 'thumbs-up',
      units: 'Percent',
      formatter: percentValue,
      seriesColour: '#f7a35c',
      source: 'ACNC',
      dataset: '/data/charity.json',
      frequency: 'A',
      weight: 0.1,
      transform: 'static'
    }
    items['income20'] = {
      name: 'Income for less advantaged',
      dynamic: false,
      description: "Annual growth in household income (equivalised income, real dollars) at 20th percentile of income distribution  "  ,
      icon: 'piggy-bank',
      units: 'Percent',
      formatter: percentValue,
      seriesColour: '#8085e9',
      source: 'Household Income and Income Distribution, ABS 6523.0',
      dataset: '/data/income20.json',
      frequency: 'A',
      weight: 0.1,
      transform: 'static'
    }
    items['commodity'] = {
      name: 'Commodity prices',
      dynamic: false,
      description: "Annual growth in commodity prices; All items; A$",
      icon: 'shopping-cart',
      units: 'Percent',
      formatter: percentValue,
      seriesColour: '#f15c80',
      source: ' http://www.rba.gov.au/statistics/frequency/commodity-prices.html',
      dataset: '/data/commodity.json',
      frequency: 'M',
      weight: 0.1,
      transform: 'static'
    }

    items['innovation'] = {
      name: 'Innovation',
      dynamic: false,
      description: "Annual growth in patent applications"  ,
      icon: 'filter',
      units: 'Percent',
      formatter: percentValue,
      seriesColour: '#e4d354',
      source: 'IPGOD',
      dataset: '/data/innovation.json',
      frequency: 'A',
      weight: 0.1,
      transform: 'static'
    }
    items['GDP'] = {
      name: 'GDP',
      dynamic: false,
      description: "Annual GDP growth (%), seasonally adjusted, expenditure method"  ,
      icon: 'globe',
      units: 'Percent',
      formatter: percentValue,
      seriesColour: '#2b908f',
      source: 'ABS',
      dataset: '/data/gdp.json',
      frequency: 'Q',
      weight: 0.1,
      transform: 'static'
    }
    items['profit'] = {
      name: 'Company Profits',
      dynamic: false,
      description: "Annual growth (%) in company profits"  ,
      icon: 'briefcase',
      units: 'Percent',
      formatter: percentValue,
      seriesColour: '#f45b5b',
      source: 'ABS, APRA',
      dataset: '/data/profits.json',
      frequency: 'Q',
      weight: 0.1,
      transform: 'static'
    }
  });
