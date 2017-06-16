(function() {
    'use strict';

    function CompaniesController($scope, authService, notifier, companyCategoriesService, companyService, $state) {

        $scope.loading = false;
        $scope.selectedCategory = "";
        $scope.boxColors = ['blue-bg', 'emerald-bg', 'purple-bg', 'red-bg', 'gray-bg', 'yellow-bg'];

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        companyCategoriesService.getAllCompanyCategories()
            .then(function(response) {
                $scope.companyCategories = response;
            })
            .catch(showError);

        companyService.getAllCompanies()
            .then(function(response) {
                var j = 0;
                for (var i = 0; i < response.length; i++) {
                    if (j > 5) {
                        j = 0
                    }
                    response[i].color = $scope.boxColors[j];
                    j++;
                }

                $scope.companies = response;
            })
            .catch(showError);

        $scope.print = function() {
            $scope.selectedCategory;
        };

        $scope.categoryFilter = function(company) {
            if ($scope.selectedCategory !== "") {
                return company.category._id == $scope.selectedCategory;
            } else {
                return company;
            }
        };
    }

    angular.module('sande')
        .controller('CompaniesController', ['$scope', 'authService', 'notifier', 'companyCategoriesService', 'companyService', '$state', CompaniesController]);

}());