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

    angular.module('sande')
        .factory('cacheService', ['$cacheFactory', '$rootScope', 'constants', cacheService]);

}());

// (function() {
//     'use strict';

//     function myDate() {
//         var s = 1000;
//         var m = s * 60;
//         var h = m * 60;
//         return function(date) {
//             var d = date.getTime() - Date.now();
//             if (d > h)
//                 return '' + d / h + ' hours ago';
//             if (d > m)
//                 return '' + d / m + ' minutes ago';
//             if (d > s)
//                 return '' + d / s + ' seconds ago';
//             return '' + d + ' ms ago';;
//         }
//     }

//     angular.module('sande')
//         .filter('myDate', [myDate]);

// }());