(function() {
    'use strict';

    function authService(notifier, $http, constants, $q) {

        function register(user) {
            return $http.post(constants.APP_SERVER + '/users/register', user)
                .then(function(response) {
                    // login
                    return 'User registered: ' + response.config.data.username;
                })
                .catch(function(response) {
                    console.log(response);
                    return $q.reject('Error registering user. (HTTP status: ' + response.status + ')');
                });
        }

        return {
            register: register
        };
    }

    angular.module('sande')
        .factory('authService', ['notifier', '$http', 'constants', '$q', authService]);

}());