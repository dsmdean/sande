(function() {
    'use strict';

    function HeaderController($scope) {

        $scope.doit = function() {
            $('#page-wrapper').toggleClass('nav-small');
        };
    }

    angular.module('sande')
        .controller('HeaderController', ['$scope', HeaderController]);

}());