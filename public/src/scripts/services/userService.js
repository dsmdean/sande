(function() {
    'use strict';

    function userService(notifier, $http, constants) {

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

        return {
            getUserById: getUserById,
            activateUser: activateUser
        };
    }

    angular.module('sande')
        .factory('userService', ['notifier', '$http', 'constants', userService]);

}());