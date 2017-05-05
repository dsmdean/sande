(function() {
    'use strict';

    function RecoverPasswordController($scope, userService, notifier, $state, $stateParams) {

        $scope.user = {};

        function showError(message) {
            notifier.error(message);
        }

        $scope.setNewPassword = function() {
            if ($scope.user.newPassword !== $scope.user.confirmNewPassword) {
                notifier.error('Passwords do not match');
            } else {
                userService.getUserById($stateParams.userID)
                    .then(function(response) {
                        userService.setNewPassword($stateParams.userID, $scope.user)
                            .then(function(response) {
                                notifier.success(response.status);
                                $scope.user = {};
                                $state.go('login');
                            })
                            .catch(showError);
                    })
                    .catch(showError);
            }
        };
    }

    angular.module('sande')
        .controller('RecoverPasswordController', ['$scope', 'userService', 'notifier', '$state', '$stateParams', RecoverPasswordController]);

}());