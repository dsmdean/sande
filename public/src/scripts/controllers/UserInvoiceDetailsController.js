(function() {
    'use strict';

    function UserInvoiceDetailsController($scope, authService, notifier, shoppingService, $state) {

        $scope.currentUser = authService.getCurrentUser();
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
                        if ($scope.invoice.company.products[i]._id === $scope.invoice.products[j].product) {
                            $scope.invoice.products[j].product = $scope.invoice.company.products[i];
                            break;
                        }
                    }
                }
            })
            .catch(showError);
    }

    angular.module('sande')
        .controller('UserInvoiceDetailsController', ['$scope', 'authService', 'notifier', 'shoppingService', '$state', UserInvoiceDetailsController]);

}());