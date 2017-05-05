(function() {
    'use strict';

    function ForgotPasswordController($scope, userService, notifier, $state) {

        $scope.user = {};

        function showError(message) {
            notifier.error(message);
        }

        $scope.recoverPassword = function() {
            userService.recoverPassword($scope.user)
                .then(function(response) {
                    notifier.success(response.message);
                    $scope.user = {};
                    $state.go('login');
                })
                .catch(showError);
        };
    }

    angular.module('sande')
        .controller('ForgotPasswordController', ['$scope', 'userService', 'notifier', '$state', ForgotPasswordController]);

}());