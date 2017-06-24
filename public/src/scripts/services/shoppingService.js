(function() {
    'use strict';

    function shoppingService(notifier, $http, constants, $log, $q, $rootScope, localStorage) {

        var baseURL = constants.APP_SERVER;
        var CART_DATA = 'cart_data';
        var cart = {};
        var cartTotalQTY = 0;
        var cartProducts = [];

        // function showError(message) {
        //     notifier.error(message.data.err);
        // }

        function addToCart(product) {
            if (Array.isArray(cart[product.companyId])) {
                cart[product.companyId].push(product);
            } else {
                cart[product.companyId] = [];
                cart[product.companyId].push(product);
            }

            // console.log(cart[product.companyId]);
            // cart.push(product);
            localStorage.remove(CART_DATA);
            localStorage.storeObject(CART_DATA, cart);
            cartTotalQTY += product.qty;
            cartProducts.push(product);

            $rootScope.$broadcast('user:addToCart');
            notifier.success(product.name + ' added to cart');
        }

        function restoreCart(localStorageData) {
            cart = localStorageData;

            for (var companyId in cart) {
                // console.log('Company ID: ' + companyId);
                var companyProducts = cart[companyId];
                // console.log('Company Products: ' + companyProducts);
                for (var i = 0; i < companyProducts.length; i++) {
                    // console.log(companyProducts[i].qty);
                    cartTotalQTY += companyProducts[i].qty;
                    cartProducts.push(companyProducts[i]);
                }
            }
            // console.log(cartTotalQTY);
            $rootScope.$broadcast('user:restoreCart');
        }

        function orderProducts(cartData) {
            return $http.post(baseURL + '/invoices', cartData)
                .then(function(response) {
                    localStorage.remove(CART_DATA);
                    cartTotalQTY = 0;
                    cartProducts = [];
                    $rootScope.$broadcast('user:restoreCart');
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error posting invoices: ' + response.statusText);
                    return $q.reject('Error posting invoices.');
                });
        }

        function getUserInvoices(userId) {
            return $http.get(baseURL + '/invoices/user/' + userId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error getting invoices: ' + response.statusText);
                    return $q.reject('Error getting invoices.');
                });
        }

        function getCompanyInvoices(companyId) {
            return $http.get(baseURL + '/invoices/company/' + companyId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error getting invoices: ' + response.statusText);
                    return $q.reject('Error getting invoices.');
                });
        }

        function getInvoiceById(invoiceId) {
            return $http.get(baseURL + '/invoices/' + invoiceId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error getting invoice: ' + response.statusText);
                    return $q.reject('Error getting invoice.');
                });
        }

        function updateInvoice(invoiceData) {
            return $http.put(baseURL + '/invoices/' + invoiceData._id, invoiceData)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error updating the invoice: ' + response.statusText);
                    return $q.reject('Error updating the invoice.');
                });
        }

        function saveCart(cart, qty) {
            localStorage.remove(CART_DATA);
            localStorage.storeObject(CART_DATA, cart);
            cartTotalQTY = qty;
            $rootScope.$broadcast('user:restoreCart');
        }

        function getCart() {
            return cart;
        }

        function getCartTotalQTY() {
            return cartTotalQTY;
        }

        function getCartProducts() {
            return cartProducts;
        }

        return {
            addToCart: addToCart,
            restoreCart: restoreCart,
            orderProducts: orderProducts,
            getUserInvoices: getUserInvoices,
            getCompanyInvoices: getCompanyInvoices,
            getInvoiceById: getInvoiceById,
            updateInvoice: updateInvoice,
            saveCart: saveCart,
            getCart: getCart,
            getCartTotalQTY: getCartTotalQTY,
            getCartProducts: getCartProducts,

        };
    }

    angular.module('sande')
        .factory('shoppingService', ['notifier', '$http', 'constants', '$log', '$q', '$rootScope', 'localStorage', shoppingService]);

}());