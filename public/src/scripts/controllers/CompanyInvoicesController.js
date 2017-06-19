(function() {
    'use strict';

    function CompanyInvoicesController($scope, authService, notifier, shoppingService, $state, $rootScope) {

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

        $scope.setInvoiceToOld = function(invoiceId) {
            shoppingService.updateInvoice({ _id: invoiceId, new: false })
                .then(function(response) {
                    $rootScope.$broadcast('company:invoiceToOld');
                })
                .catch(showError);
        };
    }

    angular.module('sande')
        .controller('CompanyInvoicesController', ['$scope', 'authService', 'notifier', 'shoppingService', '$state', '$rootScope', CompanyInvoicesController]);

}());