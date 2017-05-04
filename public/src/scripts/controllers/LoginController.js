(function() {
    'use strict';

    function LoginController($scope) {

        $scope.Oauth = function() {
            //
        };
    }

    angular.module('sande')
        .controller('LoginController', ['$scope', LoginController]);

}());