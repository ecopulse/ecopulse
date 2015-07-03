'use strict';

/**
 * @ngdoc overview
 * @name ecopulse
 * @description
 * # ecopulse
 *
 * Main module of the application.
 */
angular
  .module('ecopulse', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'highcharts-ng'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
