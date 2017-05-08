(function() {
    'use strict';

    function userService(notifier, $http, constants, $log, $q, authService) {

        var baseURL = constants.APP_SERVER;

        function showError(message) {
            notifier.error(message.data.err);
        }

        function getUserById(userID) {
            return $http.get(baseURL + '/users/' + userID)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error retrieving user: ' + response.statusText);
                    return $q.reject('Error retrieving user.');
                });
        }

        function activateUser(userID) {
            return $http.put(baseURL + '/users/' + userID + '/activate')
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error activating user: ' + response.statusText);
                    return $q.reject('Error activating user.');
                });
        }

        function recoverPassword(email) {
            return $http.post(baseURL + '/users/recoverPassword', email)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error sending recovery email: ' + response.statusText);
                    return $q.reject('Error sending recovery email.');
                });
        }

        function setNewPassword(userID, passwords) {
            return $http.post(baseURL + '/users/' + userID + '/setNewPassword', passwords)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error setting a new password: ' + response.statusText);
                    return $q.reject('Error setting a new password.');
                });
        }

        function deleteUserById(userID) {
            return $http.delete(baseURL + '/users/' + userID)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error deleting user: ' + response.statusText);
                    return $q.reject('Error deleting user.');
                });
        }

        function updateProfile(updatedData) {
            return $http.put(baseURL + '/users/' + updatedData._id, updatedData)
                .then(function(response) {
                    authService.updateCurrentUser(response.data.user);
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error updating user: ' + response.statusText);
                    return $q.reject('Error updating user.');
                });
        }

        function updatePassword(userID, passwords) {
            return $http.put(baseURL + '/users/' + userID + '/setPassword', passwords)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error setting a new password: ' + response.statusText);
                    return $q.reject('Error setting a new password. Check if old password is correct!');
                });
        }

        function uploadPicture(user, picture) {
            var fd = new FormData();
            fd.append('picture', picture.upload);

            return $http.post(baseURL + '/users/' + user._id + '/uploadPicture', fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                })
                .then(function(response) {
                    user.image = user._id + '.jpg';
                    authService.updateCurrentUser(user);
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error uploading picture: ' + response.statusText);
                    return $q.reject('Error uploading picture.');
                });
        }

        return {
            getUserById: getUserById,
            activateUser: activateUser,
            recoverPassword: recoverPassword,
            setNewPassword: setNewPassword,
            deleteUserById: deleteUserById,
            updateProfile: updateProfile,
            updatePassword: updatePassword,
            uploadPicture: uploadPicture
        };
    }

    angular.module('sande')
        .factory('userService', ['notifier', '$http', 'constants', '$log', '$q', 'authService', userService]);

}());