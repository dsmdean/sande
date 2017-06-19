(function() {
    'use strict';

    function CompanyInvoiceDetailsController($scope, authService, notifier, shoppingService, $state) {

        $scope.currentCompany = authService.getCurrentCompany();
        $scope.loading = false;

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        shoppingService.getInvoiceById($state.params.invoiceId)
            .then(function(response) {
                $scope.invoice = response;

                for (var i = 0; i < $scope.invoice.company.products.length; i++) {
                    for (var j = 0; j < $scope.invoice.products.length; j++) {
                        if ($scope.invoice.company.products[i]._id == $scope.invoice.products[j].product) {
                            $scope.invoice.products[j].product = $scope.invoice.company.products[i];
                            break;
                        }
                    }
                }
            })
            .catch(showError);

        // if ($scope.currentCompany.name === undefined) {
        //     // GET COMPANY DATA
        //     companyService.getCompanyByName($state.params.name)
        //         .then(function(response) {
        //             $scope.company = response;
        //             authService.setCurrentCompany(response);
        //         })
        //         .catch(showError);

        //     $rootScope.$on('company:setCompanyAdmin', function() {
        //         $scope.isCompanyAdmin = authService.isCompanyAdmin();
        //     });
        // }
    }

    angular.module('sande')
        .controller('CompanyInvoiceDetailsController', ['$scope', 'authService', 'notifier', 'shoppingService', '$state', CompanyInvoiceDetailsController]);

}());