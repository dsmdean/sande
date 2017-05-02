(function() {
    'use strict';

    function LoginController($scope, $state) {

        $scope.Oauth = function() {
            //
        };
    }

    angular.module('sande')
        .controller('LoginController', ['$scope', '$state', LoginController]);

}());