(function() {
    'use strict';

    function authService(notifier, $http, constants, $q, localStorage, $rootScope, $log, $cacheFactory, shoppingService) {

        // LOGIN
        var TOKEN_KEY = 'Token';
        var baseURL = constants.APP_SERVER;
        var loggedIn = false;
        var currentUser = {};
        var admin = false;
        var authToken;
        // COMPANY
        var COMPANY_DATA = 'company_data';
        var company = false;
        var companyAdmin = false;
        var currentCompany = {};
        // CART
        var CART_DATA = 'cart_data';

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

            var companyData = localStorage.getObject(COMPANY_DATA, '{}');
            if (companyData.name !== undefined) {
                // company = true;
                companyAdmin = true;
                currentCompany = companyData;
                $rootScope.$broadcast('company:setCompanyAdmin');
            }

            var cartData = localStorage.getObject(CART_DATA, '{}');
            if (Array.isArray(cartData)) {
                shoppingService.restoreCart(cartData);
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
            // company = false;
            companyAdmin = false;
            $http.defaults.headers.common['x-access-token'] = authToken;
            localStorage.remove(TOKEN_KEY);
            localStorage.remove(COMPANY_DATA);
            localStorage.remove(CART_DATA);
            var httpCache = $cacheFactory.get('$http');
            httpCache.removeAll();
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

        function setCompany() {
            company = true;
        }

        function isCompany() {
            return company;
        }

        function isCompanyAdmin() {
            return companyAdmin;
        }

        function setCurrentCompany(company) {
            currentCompany = company;

            for (var i = 0; i < company.users.length; i++) {
                if (company.users[i].user._id === currentUser._id) {
                    companyAdmin = true;
                    localStorage.remove(COMPANY_DATA);
                    localStorage.storeObject(COMPANY_DATA, company);
                    $rootScope.$broadcast('company:setCompanyAdmin');
                }
            }

            // $rootScope.$broadcast('company:setCurrent');
        }

        function removeCurrentCompany() {
            // company = false;
            companyAdmin = false;
            currentCompany = {};
            localStorage.remove(COMPANY_DATA);
            $rootScope.$broadcast('company:removeCurrent');
        }

        function getCurrentCompany() {
            return currentCompany;
        }

        loadUserCredentials();

        return {
            register: register,
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            isAdmin: isAdmin,
            getCurrentUser: getCurrentUser,
            updateCurrentUser: updateCurrentUser,
            setCompany: setCompany,
            isCompany: isCompany,
            isCompanyAdmin: isCompanyAdmin,
            setCurrentCompany: setCurrentCompany,
            removeCurrentCompany: removeCurrentCompany,
            getCurrentCompany: getCurrentCompany
        };
    }

    angular.module('sande')
        .factory('authService', ['notifier', '$http', 'constants', '$q', 'localStorage', '$rootScope', '$log', '$cacheFactory', 'shoppingService', authService]);

}());