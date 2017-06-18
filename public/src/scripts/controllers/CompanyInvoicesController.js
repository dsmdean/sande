(function() {
    'use strict';

    function CompanyInvoicesController($scope, authService, notifier, shoppingService, $state) {

        $scope.currentCompany = authService.getCurrentCompany();
        $scope.loading = false;

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        shoppingService.getCompanyInvoices($scope.currentCompany._id)
            .then(function(response) {
                $scope.invoices = response;
            })
            .catch(showError);
    }

    angular.module('sande')
        .controller('CompanyInvoicesController', ['$scope', 'authService', 'notifier', 'shoppingService', '$state', CompanyInvoicesController]);

}());