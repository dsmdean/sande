(function() {
    'use strict';

    function UserProfileController($scope, authService, userService, notifier, $log, constants, Upload, $timeout) {

        var baseURL = constants.APP_SERVER;
        $scope.currentUser = authService.getCurrentUser();
        $scope.loading = false;
        $scope.picture = {};
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

            userService.uploadPicture($scope.currentUser._id, $scope.picture)
                .then(function(response) {
                    if (response.success) {
                        notifier.success(response.status);
                    } else {
                        notifier.error(response.status);
                    }

                    $scope.uploading = false;
                    $scope.picture = {};
                })
                .catch(showError);
        };

        // $scope.uploadPic = function(file) {
        //     $log.debug(file);
        //     file.upload = Upload.upload({
        //         url: baseURL + '/users/' + $scope.currentUser._id + '/uploadPicture',
        //         data: { file: file },
        //     });

        //     file.upload.then(function(response) {
        //         $timeout(function() {
        //             file.result = response.data;
        //         });
        //     }, function(response) {
        //         if (response.status > 0)
        //             $scope.errorMsg = response.status + ': ' + response.data;
        //     }, function(evt) {
        //         // Math.min is to fix IE which reports 200% sometimes
        //         file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        //     });
        // }

        // $("input[name='file']").change(function() {
        //     var fd = new FormData();
        //     //Take the first selected file
        //     fd.append("file", $scope.profilePicture[0]);
        //     // var file = $('#choose-image').files[0];
        //     $log.debug($scope.profilePicture);
        //     $log.debug(fd);

        //     userService.uploadPicture($scope.currentUser._id, $scope.profilePicture)
        //         .then(function(response) {
        //             notifier.success(response.status);
        //         })
        //         .catch(showError);
        // });

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
        .controller('UserProfileController', ['$scope', 'authService', 'userService', 'notifier', '$log', 'constants', 'Upload', '$timeout', UserProfileController]);

}());