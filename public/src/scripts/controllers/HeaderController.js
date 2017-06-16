(function() {
    'use strict';

    function HeaderController($scope, $rootScope, $state, authService, notifier, $log, shoppingService) {

        $scope.loggedIn = false;
        $scope.isAdmin = false;
        $scope.currentUser = {};
        $scope.cart = shoppingService.getCart();

        function showError(message) {
            notifier.error(message);
        }

        $scope.doit = function() {
            $('#page-wrapper').toggleClass('nav-small');
        };

        $scope.mobileSearch = function() {
            $('.mobile-search').addClass('active');
            $('.mobile-search form input.form-control').focus();
        };

        $scope.searchCompanies = function() {
            $state.go('company-search', { search: $scope.search });
        };

        $rootScope.$on('user:addToCart', function() {
            $scope.cart = shoppingService.getCart();
        });

        $rootScope.$on('user:restoreCart', function() {
            $scope.cart = shoppingService.getCart();
        });

        // $('.mobile-search').on('click', function(e) {
        //     e.preventDefault();

        //     $('.mobile-search').addClass('active');
        //     $('.mobile-search form input.form-control').focus();
        // });

        if (authService.isAuthenticated()) {
            $scope.loggedIn = true;
            $scope.currentUser = authService.getCurrentUser();

            if (authService.isAdmin()) {
                $scope.isAdmin = true;
            }

            // $state.go("page.user");
        }

        $rootScope.$on('logout:Successful', function() {
            $scope.loggedIn = false;
            $scope.isAdmin = false;

            // notifier.success('Logout successful!');
            $state.go('login');
        });

        $scope.logout = function() {
            authService.logout()
                .then(function(response) {
                    $log.debug(response);
                })
                .catch(showError);
        };
    }

    angular.module('sande')
        .controller('HeaderController', ['$scope', '$rootScope', '$state', 'authService', 'notifier', '$log', 'shoppingService', HeaderController]);

}());