(function() {
    'use strict';

    function SidebarController($scope, $location, authService, $rootScope, shoppingService, notifier) {

        $scope.getClass = function(path) {
            // console.log(path);
            return $location.path().substr(0, path.length) === path ? 'active' : '';
        };

        $scope.currentUser = authService.getCurrentUser();
        // $scope.isCompany = authService.isCompany();
        $scope.isCompanyAdmin = authService.isCompanyAdmin();
        $scope.currentCompany = authService.getCurrentCompany();

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        function addRestoreCart() {
            $scope.cart = shoppingService.getCart();
            $scope.cartTotalQTY = shoppingService.getCartTotalQTY();
        }

        function getCompanyInvoices() {
            shoppingService.getCompanyInvoices($scope.currentCompany._id)
                .then(function(response) {
                    $scope.invoices = response;
                    $scope.newInvoices = 0;

                    for (var i = 0; i < $scope.invoices.length; i++) {
                        if ($scope.invoices[i].new) {
                            $scope.newInvoices++;
                        }
                    }
                })
                .catch(showError);
        }

        addRestoreCart();
        getCompanyInvoices();

        $rootScope.$on('company:setCompanyAdmin', function() {
            // $scope.isCompany = authService.isCompany();
            $scope.isCompanyAdmin = authService.isCompanyAdmin();
            $scope.currentCompany = authService.getCurrentCompany();

            getCompanyInvoices();
        });

        $rootScope.$on('company:removeCurrent', function() {
            // $scope.isCompany = false;
            $scope.isCompanyAdmin = false;
            $scope.currentCompany = {};
        });

        $rootScope.$on('user:addToCart', function() {
            addRestoreCart();
        });

        $rootScope.$on('user:restoreCart', function() {
            addRestoreCart();
        });

        $rootScope.$on('company:invoiceToOld', function() {
            $scope.newInvoices--;
        });

        // $scope.submenu = function() {
        //     // e.preventDefault();

        //     var $item = $('.dropdown-toggle').parent();

        //     if (!$item.hasClass('open')) {
        //         $item.parent().find('.open .submenu').slideUp('fast');
        //         $item.parent().find('.open').toggleClass('open');
        //     }

        //     $item.toggleClass('open');

        //     if ($item.hasClass('open')) {
        //         $item.children('.submenu').slideDown('fast');
        //     } else {
        //         $item.children('.submenu').slideUp('fast');
        //     }
        // };
    }

    angular.module('sande')
        .controller('SidebarController', ['$scope', '$location', 'authService', '$rootScope', 'shoppingService', 'notifier', SidebarController]);

}());