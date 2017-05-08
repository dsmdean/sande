(function() {
    'use strict';

    function RegistrationController($scope, $state, notifier, authService) {

        $scope.user = {};
        $scope.loading = false;

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        $scope.register = function() {
            if ($scope.user.password !== $scope.user.confirmpassword) {
                notifier.error('Passwords do not match');
            } else {
                $scope.loading = true;
                authService.register($scope.user)
                    .then(function(message) {
                        notifier.success(message);
                        $scope.user = {};
                        $state.go('login');
                        $scope.loading = false;
                    })
                    .catch(showError);
            }
        };

    }

    angular.module('sande')
        .controller('RegistrationController', ['$scope', '$state', 'notifier', 'authService', RegistrationController]);

}());