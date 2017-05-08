(function() {
    'use strict';

    function authService(notifier, $http, constants, $q, localStorage, $rootScope, $log) {

        var TOKEN_KEY = 'Token';
        var baseURL = constants.APP_SERVER;
        var loggedIn = false;
        var currentUser = {};
        var admin = false;
        var authToken;
        // var tokenExpiration;

        // function stopInterval() {
        //     $interval.cancel(interval);
        // }

        function useCredentials(credentials) {
            loggedIn = true;
            currentUser = credentials;
            authToken = credentials.token;

            if (credentials.admin) {
                admin = true;
            }

            // Date.prototype.addHours = function(h) {
            //     this.setTime(this.getTime() + (h * 60 * 60 * 1000));
            //     return this;
            // };

            // tokenExpiration = localStorage.getObject('tokenExpiration', '{}');
            // if (tokenExpiration.date === undefined) {
            //     tokenExpiration = { date: new Date().addHours(23.75) };
            //     localStorage.storeObject('tokenExpiration', tokenExpiration);
            // }

            // $log.debug('Token expiration: ' + Date.parse(tokenExpiration.date));

            // interval = $interval(function() {
            //     if (new Date() >= Date.parse(tokenExpiration.date)) {
            //         $log.debug('Time is up');
            //         // vm.logout();

            //         notifier.error("Your token has ended. You have been logged out!");
            //     } else {
            //         // $log.debug('Still some time left');
            //     }
            // }, 60000);

            // Set the token as header for your requests!
            $http.defaults.headers.common['x-access-token'] = authToken;
            $rootScope.$broadcast('login:Successful');
        }

        function loadUserCredentials() {
            var credentials = localStorage.getObject(TOKEN_KEY, '{}');
            if (credentials.username !== undefined) {
                useCredentials(credentials);
            }
        }

        function storeUserCredentials(credentials) {
            delete credentials['hash'];
            delete credentials['salt'];

            localStorage.storeObject(TOKEN_KEY, credentials);
            useCredentials(credentials);
        }

        function destroyUserCredentials() {
            authToken = undefined;
            currentUser = {};
            loggedIn = false;
            admin = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            localStorage.remove(TOKEN_KEY);
            // localStorage.remove('tokenExpiration');
            // stopInterval();
        }

        function login(loginData) {
            return $http.post(baseURL + '/users/login', loginData)
                .then(function(response) {
                    response.data.user.token = response.data.token;
                    storeUserCredentials(response.data.user);

                    return 'User logged in: ' + response.data.user.username;
                })
                .catch(function(response) {
                    $log.error(response);
                    return $q.reject('Error logging in user. (HTTP status: ' + response.status + ')');
                });
        }

        function register(user) {
            return $http.post(baseURL + '/users/register', user)
                .then(function(response) {
                    var loginData = { username: user.username, password: user.password };
                    login(loginData);

                    return 'User registered: ' + response.config.data.username;
                })
                .catch(function(response) {
                    $log.error(response);
                    return $q.reject('Error registering user. (HTTP status: ' + response.status + ')');
                });
        }

        function logout() {
            return $http.get(baseURL + '/users/logout')
                .then(function(response) {
                    destroyUserCredentials();
                    $rootScope.$broadcast('logout:Successful');

                    return 'Logged out - ' + response.data.status;
                })
                .catch(function(response) {
                    $log.error(response);
                    return $q.reject('Error logging out. (HTTP status: ' + response.status + ')');
                });
        }

        function isAuthenticated() {
            return loggedIn;
        }

        function isAdmin() {
            return admin;
        }

        function getCurrentUser() {
            return currentUser;
        }

        function updateCurrentUser(updatedData) {
            updatedData.token = authToken;
            localStorage.remove(TOKEN_KEY);
            storeUserCredentials(updatedData);
        }

        loadUserCredentials();

        return {
            register: register,
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            isAdmin: isAdmin,
            getCurrentUser: getCurrentUser,
            updateCurrentUser: updateCurrentUser
        };
    }

    angular.module('sande')
        .factory('authService', ['notifier', '$http', 'constants', '$q', 'localStorage', '$rootScope', '$log', authService]);

}());