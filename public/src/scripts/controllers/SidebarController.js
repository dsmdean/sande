(function() {
    'use strict';

    function SidebarController($scope, $location, authService, $rootScope, shoppingService, notifier, messageService) {

        $scope.getClass = function(path) {
            // console.log(path);
            return $location.path().substr(0, path.length) === path ? 'active' : '';
        };

        $scope.currentUser = authService.getCurrentUser();
        // $scope.isCompany = authService.isCompany();
        $scope.isCompanyAdmin = authService.isCompanyAdmin();
        $scope.currentCompany = authService.getCurrentCompany();
        $scope.userMessagesTotal = 0;
        $scope.companyMessagesTotal = 0;

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

        function getUserMessages() {
            messageService.getAllUserConversations()
                .then(function(response) {
                    $scope.conversations = response;
                    response.forEach(function(conversation) {
                        $scope.userMessagesTotal += conversation.userNotifications.total;
                    });
                })
                .catch(showError);
        }

        function getCompanyMessages() {
            messageService.getAllCompanyConversations($scope.currentCompany._id)
                .then(function(response) {
                    $scope.conversations = response;
                    response.forEach(function(conversation) {
                        $scope.companyMessagesTotal += conversation.userNotifications.total;
                    });
                })
                .catch(showError);
        }

        if ($scope.currentCompany._id !== undefined) {
            getCompanyInvoices();
            getCompanyMessages();
        } else {
            getUserMessages();
        }

        addRestoreCart();

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

        $rootScope.$on('refresh messages', function() {
            // var newMessage = { createdAt: Date.now(), body: $rootScope.newMessage.composedMessage, user: $rootScope.newMessage.user, company: $rootScope.newMessage.company, conversationId: $rootScope.newMessage.conversationId };
            // console.log(newMessage);
            $scope.conversations.forEach(function(conversation) {
                if (conversation._id === $rootScope.newMessage.conversationId) {
                    $rootScope.$apply(function() {
                        if ($rootScope.newMessage.company) {
                            $scope.userMessagesTotal++;
                        } else if ($rootScope.newMessage.user) {
                            $scope.companyMessagesTotal++;
                        }
                    });
                }
            });
        });

        $rootScope.$on('user:Message opened', function() {
            $scope.userMessagesTotal -= $rootScope.messageTotal;
        });

        $rootScope.$on('company:Message opened', function() {
            $scope.companyMessagesTotal -= $rootScope.messageTotal;
        });
    }

    angular.module('sande')
        .controller('SidebarController', ['$scope', '$location', 'authService', '$rootScope', 'shoppingService', 'notifier', 'messageService', SidebarController]);

}());