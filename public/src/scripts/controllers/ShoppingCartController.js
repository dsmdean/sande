(function() {
    'use strict';

    function ShoppingCartController($scope, shoppingService, notifier, $state) {

        $scope.cart = shoppingService.getCart();
        $scope.cartTotalQTY = shoppingService.getCartTotalQTY();
        $scope.companies = [];
        $scope.total = 0;
        $scope.subTotal = [];
        $scope.date = Date.now();

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        function checkIfCartEmpty(companyId) {
            if ($scope.cart[companyId].length === 0) {
                for (var j = 0; $scope.companies.length; j++) {
                    if ($scope.companies[j]._id === companyId) {
                        $scope.companies.splice(j, 1);
                        break;
                    }
                }
            }
        }

        for (var companyId in $scope.cart) {
            var subTotal = 0;
            $scope.companies.push({ _id: $scope.cart[companyId][0].companyId, name: $scope.cart[companyId][0].companyName, products: $scope.cart[companyId] });

            for (var i = 0; i < $scope.cart[companyId].length; i++) {
                subTotal += $scope.cart[companyId][i].qty * $scope.cart[companyId][i].price;
            }
            // $scope.subTotal.push(subTotal);
            $scope.total += subTotal;
        }

        $scope.orderProducts = function() {
            shoppingService.orderProducts($scope.cart)
                .then(function(response) {
                    notifier.success(response.status);

                    $scope.cart = shoppingService.getCart();
                    $scope.companies = [];
                    $scope.total = 0;
                    $scope.subTotal = [];

                    $state.go('user-invoices');
                })
                .catch(showError);
        };

        $scope.addToQty = function(product) {
            product.qty++;
            // $scope.subTotal += product.price;
            $scope.total += product.price;
            $scope.cartTotalQTY++;
            checkIfCartEmpty(product.companyId);
            shoppingService.saveCart($scope.cart, $scope.cartTotalQTY);
        };

        $scope.subtractFromQty = function(product) {
            product.qty--;
            // $scope.subTotal -= product.price;
            $scope.total -= product.price;
            $scope.cartTotalQTY--;
            checkIfCartEmpty(product.companyId);
            shoppingService.saveCart($scope.cart, $scope.cartTotalQTY);
        };

        $scope.deleteFromCart = function(companyId, productId) {
            for (var i = 0; i < $scope.cart[companyId].length; i++) {
                if ($scope.cart[companyId][i]._id === productId) {
                    $scope.cartTotalQTY -= $scope.cart[companyId][i].qty;
                    $scope.cart[companyId].splice(i, 1);

                    checkIfCartEmpty(companyId);
                    break;
                }
            }

            shoppingService.saveCart($scope.cart, $scope.cartTotalQTY);
        };
    }

    angular.module('sande')
        .controller('ShoppingCartController', ['$scope', 'shoppingService', 'notifier', '$state', ShoppingCartController]);

}());