(function() {
    'use strict';

    function userService(notifier, $http, constants, $log, $q) {

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

        return {
            getUserById: getUserById,
            activateUser: activateUser,
            recoverPassword: recoverPassword,
            setNewPassword: setNewPassword
        };
    }

    angular.module('sande')
        .factory('userService', ['notifier', '$http', 'constants', '$log', '$q', userService]);

}());