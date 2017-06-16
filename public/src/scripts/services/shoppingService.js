(function() {
    'use strict';

    function shoppingService(notifier, $http, constants, $log, $q, $rootScope, localStorage) {

        var baseURL = constants.APP_SERVER;
        var CART_DATA = 'cart_data';
        var cart = [];

        function showError(message) {
            notifier.error(message.data.err);
        }

        function addToCart(product) {
            cart.push(product);
            localStorage.remove(CART_DATA);
            localStorage.storeObject(CART_DATA, cart);
            $rootScope.$broadcast('user:addToCart');
            notifier.success(product.name + ' added to cart');
        }

        function restoreCart(localStorageData) {
            cart = localStorageData;
            $rootScope.$broadcast('user:restoreCart');
        }


        function getCart() {
            return cart;
        }

        return {
            addToCart: addToCart,
            getCart: getCart,
            restoreCart: restoreCart
        };
    }

    angular.module('sande')
        .factory('shoppingService', ['notifier', '$http', 'constants', '$log', '$q', '$rootScope', 'localStorage', shoppingService]);

}());