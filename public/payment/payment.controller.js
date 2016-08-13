/**
 * Created by guy on 11/08/2016.
 */
var paymentModule = angular.module('payment', []);

paymentModule.controller('paymentController', paymentController);

function paymentController($scope, $http) {

    $scope.userDeatails = {
        firstName: '',
        lastName: '',
        email: '',
        country: ''
    };

    var disableButton = false; // Avoid multiple purchases
    $scope.redirecting = false; //Indication after submit

    $scope.makePurchase = function () {
        if (!disableButton) {
            $scope.err = '';
            if ($scope.userDeatails.firstName.length == 0 || $scope.userDeatails.lastName.length == 0 || $scope.userDeatails.email.length == 0 || $scope.userDeatails.country.length == 0) {
                $scope.err = "Please don't leave empty fields";
            } else if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test($scope.userDeatails.email)) {
                $scope.err = "Please enter valid email pattern (test@example.com)";
            } else {
                $scope.redirecting = true;
                $http({
                    method: 'POST',
                    url: '/makePurchase',
                    data: $scope.userDeatails
                }).then(function successCallback(response) {
                    window.location.href = response.data;
                    $scope.redirecting = false;
                }, function errorCallback(response) {
                    $scope.redirecting = false;
                    console.log(response);
                });
                disableButton = true;
            }
        }
    };
};
