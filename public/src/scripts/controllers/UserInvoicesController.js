(function() {
    'use strict';

    function UserInvoicesController($scope, authService, notifier, shoppingService, $state) {

        $scope.currentUser = authService.getCurrentUser();
        $scope.loading = false;

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        shoppingService.getUserInvoices($scope.currentUser._id)
            .then(function(response) {
                $scope.invoices = response;
            })
            .catch(showError);
    }

    angular.module('sande')
        .controller('UserInvoicesController', ['$scope', 'authService', 'notifier', 'shoppingService', '$state', UserInvoicesController]);

}());