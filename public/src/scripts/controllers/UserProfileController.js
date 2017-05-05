(function() {
    'use strict';

    function UserProfileController($scope, authService, userService, notifier, $log) {

        $scope.currentUser = authService.getCurrentUser();

        function showError(message) {
            notifier.error(message);
        }

        $scope.deleteAccount = function() {
            authService.logout()
                .then(function(response) {
                    $log.debug(response);
                    $(".modal-backdrop").hide();

                    userService.deleteUserById($scope.currentUser._id)
                        .then(function(response) {
                            notifier.success(response.status);
                        })
                        .catch(showError);
                })
                .catch(showError);
        }
    }

    angular.module('sande')
        .controller('UserProfileController', ['$scope', 'authService', 'userService', 'notifier', '$log', UserProfileController]);

}());