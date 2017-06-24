(function() {
    'use strict';

    function UserProfileController($scope, authService, userService, notifier, $log, $state, $timeout) {

        $scope.currentUser = authService.getCurrentUser();
        $scope.loading = false;
        $scope.picture = {};
        $scope.thumbnail = {
            available: false
        };
        $scope.account = {
            username: $scope.currentUser.username,
            password: '',
            newPassword: '',
            confirmNewPassword: ''
        };

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        $scope.getImage = function() {
            $('#choose-image').click();
        };

        $scope.uploadPicture = function() {
            $scope.uploading = true;

            userService.uploadPicture($scope.currentUser, $scope.picture)
                .then(function(response) {
                    if (response.success) {
                        notifier.success(response.status);
                        // console.log(response.user);
                        $state.reload();
                    } else {
                        notifier.error(response.status);
                    }

                    $scope.uploading = false;
                    $scope.picture = {};
                })
                .catch(showError);
        };

        $scope.photoChanged = function(files) {
            // console.log(files);
            if (files.length > 0 && files[0].name.match(/\.(png|jpeg|jpg)$/)) {
                $scope.uploading = true;
                var file = files[0];
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file);
                fileReader.onload = function(e) {
                    $timeout(function() {
                        $scope.thumbnail.available = true;
                        $scope.thumbnail.dataUrl = e.target.result;
                        $scope.uploading = false;
                    });
                };
            } else {
                $scope.thumbnail = {
                    available: false
                };
            }
        };

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
        };

        $scope.updateProfile = function() {
            $scope.loading = true;
            userService.updateProfile($scope.currentUser)
                .then(function(response) {
                    notifier.success(response.status);
                    $scope.loading = false;
                })
                .catch(showError);
        };

        $scope.updatePassword = function() {
            if ($scope.account.newPassword !== $scope.account.confirmNewPassword) {
                notifier.error('Passwords do not match!');
            } else {
                $scope.loading = true;
                userService.updatePassword($scope.currentUser._id, $scope.account)
                    .then(function(response) {
                        notifier.success(response.status);
                        $scope.loading = false;
                        $scope.account = {
                            username: $scope.currentUser.username,
                            password: '',
                            newPassword: '',
                            confirmNewPassword: ''
                        };
                    })
                    .catch(showError);
            }
        };
    }

    angular.module('sande')
        .controller('UserProfileController', ['$scope', 'authService', 'userService', 'notifier', '$log', '$state', '$timeout', UserProfileController]);

}());