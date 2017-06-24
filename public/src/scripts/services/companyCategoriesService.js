(function() {
    'use strict';

    function companyCategoriesService(notifier, $http, constants, $log, $q, $rootScope) {

        var baseURL = constants.APP_SERVER;

        // function showError(message) {
        //     notifier.error(message.data.err);
        // }

        function getAllCompanyCategories() {
            return $http.get(baseURL + '/company-categories', {
                    cache: true
                })
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error retrieving company categories: ' + response.statusText);
                    return $q.reject('Error retrieving company categories.');
                });
        }

        function getCompanyCategoryById(companyCategoryId) {
            $rootScope.companyCategoryId = companyCategoryId;
            return $http.get(baseURL + '/company-categories/' + companyCategoryId, {
                    cache: true
                })
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error retrieving company category: ' + response.statusText);
                    return $q.reject('Error retrieving company category.');
                });
        }

        return {
            getAllCompanyCategories: getAllCompanyCategories,
            getCompanyCategoryById: getCompanyCategoryById
        };
    }

    angular.module('sande')
        .factory('companyCategoriesService', ['notifier', '$http', 'constants', '$log', '$q', '$rootScope', companyCategoriesService]);

}());