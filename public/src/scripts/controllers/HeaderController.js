(function() {
    'use strict';

    function HeaderController($scope, $rootScope, $state, authService, notifier) {

        $scope.loggedIn = false;
        $scope.isAdmin = false;
        $scope.currentUser = {};

        function showError(message) {
            notifier.error(message);
        }

        $scope.doit = function() {
            $('#page-wrapper').toggleClass('nav-small');
        };

        if (authService.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.currentUser = authService.getCurrentUser();

            if (authService.isAdmin()) {
                $scope.isAdmin = true;
            }

            $state.go("user");
        }

        $scope.logout = function() {
            authService.logout()
                .then(function(response) {
                    $scope.loggedIn = false;
                    $scope.isAdmin = false;

                    notifier.success('Logout successful!');
                    $state.go('login');
                })
                .catch(showError);
        };
    }

    angular.module('sande')
        .controller('HeaderController', ['$scope', '$rootScope', '$state', 'authService', 'notifier', HeaderController]);

}());