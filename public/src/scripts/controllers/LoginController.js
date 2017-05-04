(function() {
    'use strict';

    function LoginController($scope, authService, notifier, $rootScope, $state) {

        $scope.user = {};

        function showError(message) {
            notifier.error(message);
        }

        $scope.login = function() {
            authService.login($scope.user)
                .then(function(response) {
                    notifier.success('Logged in successful!');
                })
                .catch(showError);
        };

        $rootScope.$on('login:Successful', function() {
            $scope.loggedIn = true;
            $scope.currentUser = authService.getCurrentUser();

            if (authService.isAdmin()) {
                $scope.isAdmin = true;
            }

            $state.go("user");
        });
    }

    angular.module('sande')
        .controller('LoginController', ['$scope', 'authService', 'notifier', '$rootScope', '$state', LoginController]);

}());