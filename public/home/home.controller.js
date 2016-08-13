/**
 * Created by guy on 11/08/2016.
 */
var angular = require('angular');

var app = angular.module('app', ['home', 'payment', 'backOffice']);

var homeModule = angular.module('home', []);

homeModule.controller('homeController', homeController);

function homeController($scope) {
    $scope.message = 'Home page';
};
