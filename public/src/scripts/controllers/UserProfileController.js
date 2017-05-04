(function() {
    'use strict';

    function UserProfileController($scope, authService) {

        $scope.currentUser = authService.getCurrentUser();
    }

    angular.module('sande')
        .controller('UserProfileController', ['$scope', 'authService', UserProfileController]);

}());