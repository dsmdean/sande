(function() {
    'use strict';

    function cacheService($cacheFactory, $rootScope, constants) {

        var baseURL = constants.APP_SERVER;

        function deleteAllCompanyCategories() {
            var httpCache = $cacheFactory.get('$http');
            httpCache.remove(baseURL + '/company-categories');
        }

        function deleteCompanyCategoryById() {
            var httpCache = $cacheFactory.get('$http');
            httpCache.remove(baseURL + '/company-categories/' + $rootScope.companyCategoryId);
        }

        return {
            deleteAllCompanyCategories: deleteAllCompanyCategories,
            deleteCompanyCategoryById: deleteCompanyCategoryById
        };
    }

    angular.module('app')
        .factory('cacheService', ['$cacheFactory', '$rootScope', 'constants', cacheService]);

}());