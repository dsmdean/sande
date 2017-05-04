(function() {
    'use strict';

    function SidebarController($scope, $location, authService) {

        $scope.getClass = function(path) {
            return $location.path().substr(0, path.length) === path ? 'active' : '';
        }

        $scope.currentUser = authService.getCurrentUser();
    }

    angular.module('sande')
        .controller('SidebarController', ['$scope', '$location', 'authService', SidebarController]);

}());