(function() {
    'use strict';

    function RegistrationController($scope, $state, notifier, authService) {

        $scope.user = {};

        function showError(message) {
            notifier.error(message);
        }

        $scope.register = function() {
            if ($scope.user.password !== $scope.user.confirmpassword) {
                notifier.error('Passwords do not match');
            } else {
                authService.register($scope.user)
                    .then(function(message) {
                        notifier.success(message);
                        $state.go('login');
                    })
                    .catch(showError);
            }
        };

    }

    angular.module('sande')
        .controller('RegistrationController', ['$scope', '$state', 'notifier', 'authService', RegistrationController]);

}());