(function() {
    'use strict';

    function CompanySearchController($scope, authService, notifier, companyService, $state) {

        $scope.searched = $state.params.search;

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        companyService.searchCompaniesByName($state.params.search)
            .then(function(response) {
                $scope.companies = response;
                console.log($scope.companies);
            })
            .catch(showError);
    }

    angular.module('sande')
        .controller('CompanySearchController', ['$scope', 'authService', 'notifier', 'companyService', '$state', CompanySearchController]);

}());