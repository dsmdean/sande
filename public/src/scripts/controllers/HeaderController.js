(function() {
    'use strict';

    function HeaderController($scope, $rootScope, $state, authService, notifier, $log, shoppingService, companyService) {

        $scope.loggedIn = false;
        $scope.isAdmin = false;
        $scope.currentUser = {};

        function addRestoreCart() {
            $scope.cart = shoppingService.getCart();
            $scope.cartTotalQTY = shoppingService.getCartTotalQTY();
            $scope.cartProducts = shoppingService.getCartProducts();
        };

        addRestoreCart();

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
            addRestoreCart();
        });

        $rootScope.$on('user:restoreCart', function() {
            addRestoreCart();
        });

        function refreshNotifications() {
            $scope.notificationsAmount = 0;
            $scope.notifications = [];
            $scope.currentUser = authService.getCurrentUser();

            for (var i = 0; i < $scope.currentUser.companies.length; i++) {
                if ($scope.currentUser.companies[i].notification) {
                    $scope.notificationsAmount++;
                    $scope.notifications.push($scope.currentUser.companies[i].name);
                }
            }
        }

        // $('.mobile-search').on('click', function(e) {
        //     e.preventDefault();

        //     $('.mobile-search').addClass('active');
        //     $('.mobile-search form input.form-control').focus();
        // });

        if (authService.isAuthenticated()) {
            $scope.loggedIn = true;

            if (authService.isAdmin()) {
                $scope.isAdmin = true;
            }

            refreshNotifications();
            // $scope.currentUser = authService.getCurrentUser();
            // for (var i = 0; i < $scope.currentUser.companies.length; i++) {
            //     if ($scope.currentUser.companies[i].notification) {
            //         $scope.notificationsAmount++;
            //         $scope.notifications.push($scope.currentUser.companies[i].name);
            //     }
            // }
            // console.log($scope.notifications);

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

        $scope.removeNotification = function(companyName, index) {
            companyService.updateCompanyNotificationToFalse(companyName)
                .then(function(response) {
                    // console.log(response);
                    // $scope.notificationsAmount--;
                    // $scope.notifications.splice(index, 1);
                    refreshNotifications();
                })
                .catch(showError);
        };
    }

    angular.module('sande')
        .controller('HeaderController', ['$scope', '$rootScope', '$state', 'authService', 'notifier', '$log', 'shoppingService', 'companyService', HeaderController]);

}());