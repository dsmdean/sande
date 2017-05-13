(function() {
    'use strict';

    function companyCategoriesService(notifier, $http, constants, $log, $q) {

        var baseURL = constants.APP_SERVER;

        function showError(message) {
            notifier.error(message.data.err);
        }

        function getAllCategories() {
            return $http.get(baseURL + '/company-categories')
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error retrieving company categories: ' + response.statusText);
                    return $q.reject('Error retrieving company categories.');
                });
        }

        function getCategoryById(categoryId) {
            return $http.get(baseURL + '/company-categories/' + categoryId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error retrieving company category: ' + response.statusText);
                    return $q.reject('Error retrieving company category.');
                });
        }

        return {
            getAllCategories: getAllCategories,
            getCategoryById: getCategoryById
        };
    }

    angular.module('sande')
        .factory('companyCategoriesService', ['notifier', '$http', 'constants', '$log', '$q', companyCategoriesService]);

}());