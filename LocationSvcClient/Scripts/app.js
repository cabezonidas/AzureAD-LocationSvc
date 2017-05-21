/// <reference path="lib/angular.js" />

// Creation of Angular Module that matches the tag ng-app on index.html
// We are going to rely on service AdalAngular
// I can reference AdalAngular, because it's included in the project
var locationApp = angular.module('locationApp', ['AdalAngular']);

locationApp.config(['$httpProvider','adalAuthenticationServiceProvider', function ($httpProvider, adalProvider) {
    var endpoints = {
        // Here I have to map the location of a request to an API to the identifier of the associated resource
        "https://localhost:44300" : "https://cabe365.onmicrosoft.com/LocationSvc"
    }

    // ADAL has to inject HTTP interceptor to make sure that
    // if the request that is going to the server, receives a 401,
    // then it will automatically redirect me to Azure AD. 
    // If I am authenticated, after a successful authentication, it
    // will save local resources like cookies and the hidden iFrame.
    // And with every subsequent request, so with every $http.get or 
    // post or whatever, it will automatically include the access token.
    adalProvider.init({
        instance: 'https://login.microsoftonline.com/',
        tenant: 'cabe365.onmicrosoft.com',
        clientId: 'daee2d05-ad90-45a0-b471-cc3448c46d41',
        endpoints: endpoints
    }, $httpProvider);
}]);

// $scope and $http are the services that the controller depends on
var locationController = locationApp.controller("locationController", [
    '$scope', '$http', 'adalAuthenticationService',
    function ($scope, $http, adalService) {
        $scope.getLocation = function () {
            $http.get("https://localhost:44300/api/location?cityName=dc").success(function (location) {
                $scope.city = location;
            });
        }
        $scope.login = function () {
            adalService.login();
        };

        $scope.logout = function () {
            adalService.logout();
        };
}]);