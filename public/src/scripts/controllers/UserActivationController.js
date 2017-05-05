(function() {
    'use strict';

    function UserActivationController($scope, $state, $stateParams, userService) {

        function showError(message) {
            notifier.error(message);
        }

        userService.getUserById($stateParams.userID)
            .then(function(response) {
                $scope.user = response;
                // console.log(response);

                if ($scope.user.activated) {
                    $scope.message = 'This account is already activated!';
                } else {
                    userService.activateUser($stateParams.userID)
                        .then(function(response) {
                            $scope.message = response.message;
                            // console.log(response);
                        })
                        .catch(showError);
                }
            })
            .catch(showError);
    }

    angular.module('sande')
        .controller('UserActivationController', ['$scope', '$state', '$stateParams', 'userService', UserActivationController]);

}());