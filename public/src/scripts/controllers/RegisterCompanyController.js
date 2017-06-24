(function() {
    'use strict';

    function RegisterCompanyController($scope, authService, notifier, $rootScope, $state, companyCategoriesService, companyService) {

        $scope.user = {};
        $scope.loading = false;
        $scope.categoryColors = ['emerald-bg', 'blue-bg', 'red-bg', 'purple-bg'];
        $scope.company = {};
        $scope.categoryTab = 'active';
        $scope.infoTab = '';

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        companyCategoriesService.getAllCompanyCategories()
            .then(function(response) {
                var j = 0;
                for (var i = 0; i < response.length; i++) {
                    if (j > 3) {
                        j = 0;
                    }
                    response[i].color = $scope.categoryColors[j];
                    j++;
                }
                $scope.companyCategories = response;
            })
            .catch(showError);

        $scope.createCompany = function() {
            $scope.loading = true;
            companyService.createCompany($scope.company)
                .then(function(response) {
                    if (response.success) {
                        notifier.success(response.status);
                        $state.reload();
                    } else {
                        notifier.error(response.status);
                    }
                    $scope.loading = false;
                })
                .catch(showError);
        };

        $scope.next = function() {
            $scope.categoryTab = '';
            $scope.infoTab = 'active';
        };

        $scope.previous = function() {
            $scope.categoryTab = 'active';
            $scope.infoTab = '';
        };
    }

    angular.module('sande')
        .controller('RegisterCompanyController', ['$scope', 'authService', 'notifier', '$rootScope', '$state', 'companyCategoriesService', 'companyService', RegisterCompanyController]);

}());