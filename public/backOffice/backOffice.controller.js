/**
 * Created by guy on 12/08/2016.
 */
var backOfficeModule = angular.module('backOffice', []);

backOfficeModule.controller('backOfficeController', backOfficeController);

function backOfficeController($scope, $http) {
    $scope.usersList = [];
    $scope.totalPurchases = 0;
    $scope.totalSum = 0;

    $scope.init = function () {
        $scope.getUsersList();
    };

    $scope.getUsersList = function () {
        $http({
            method: 'GET',
            url: '/getUsersList'
        }).then(function successCallback(response) {
            response.data.forEach(function (user) {
                if (user) {
                    var parsedUser = JSON.parse(user);
                    if (parsedUser.paid === 'Yes') {
                        $scope.totalPurchases++;
                        $scope.totalSum = $scope.totalSum + 5;
                    }
                    $scope.usersList.push(parsedUser);
                }
            })
        }, function errorCallback(response) {
            console.log(response);
        });
    };
};
