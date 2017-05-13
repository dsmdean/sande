(function() {
    'use strict';

    function companyService(notifier, $http, constants, $log, $q, authService) {

        var baseURL = constants.APP_SERVER;

        function showError(message) {
            notifier.error(message.data.err);
        }

        function createCompany(companyData) {
            return $http.post(baseURL + '/companies', companyData)
                .then(function(response) {
                    authService.updateCurrentUser(response.data.user);
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error creating a company: ' + response.statusText);
                    return $q.reject('Error creating a company.');
                });
        }

        return {
            createCompany: createCompany
        };
    }

    angular.module('sande')
        .factory('companyService', ['notifier', '$http', 'constants', '$log', '$q', 'authService', companyService]);

}());