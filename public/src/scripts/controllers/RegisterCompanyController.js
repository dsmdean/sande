(function() {
    'use strict';

    function RegisterCompanyController($scope, authService, notifier, $rootScope, $state, companyCategoriesService, companyService) {

        $scope.user = {};
        $scope.loading = false;
        $scope.categoryColors = ['emerald-bg', 'blue-bg', 'red-bg', 'purple-bg'];
        $scope.company = {};

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        companyCategoriesService.getAllCategories()
            .then(function(response) {
                var j = 0;
                for (var i = 0; i < response.length; i++) {
                    if (j > 3) {
                        j = 0
                    }
                    response[i].color = $scope.categoryColors[j];
                    j++;
                }
                $scope.companyCategories = response;
            })
            .catch(showError);

        $scope.createCompany = function() {
            companyService.createCompany($scope.company)
                .then(function(response) {
                    notifier.success(response.status);
                })
                .catch(showError);
        };
    }

    angular.module('sande')
        .controller('RegisterCompanyController', ['$scope', 'authService', 'notifier', '$rootScope', '$state', 'companyCategoriesService', 'companyService', RegisterCompanyController]);

}());