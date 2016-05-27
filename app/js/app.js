'use strict';

var angular = require('angular');

    require('angular-route');
    require('angular-animate');
    require('angular-resource');

angular
  .module('mobPolApp', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'mobPolAppControllers',
    'mobPolAppDirectives',
    'thirdPartyLibs'
  ])

  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/view1', {
          templateUrl: 'views/view1/view1.html',
          controller: 'View1Ctrl',
          controllerAs: 'mob'
        })
        .otherwise({redirectTo: '/view1'});
  }]);

require('./controllers/controllers');
require('./directives/directives');
require('./services/thirdPartyLibs');