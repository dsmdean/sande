(function() {
    'use strict';

    function FooterController($scope) {

        $scope.date = new Date();
    }

    angular.module('sande')
        .controller('FooterController', ['$scope', FooterController]);

}());