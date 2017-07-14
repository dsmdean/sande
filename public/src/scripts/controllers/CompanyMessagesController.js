(function() {
    'use strict';

    function CompanyMessagesController($scope, authService, notifier, messageService, $state, $rootScope) {

        $scope.currentCompany = authService.getCurrentCompany();
        $scope.loading = true;
        $scope.conversations = [];
        $scope.currentConversation = undefined;
        $rootScope.currentConversation = undefined;
        // $scope.messages = [];

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        messageService.getCompanyMessages($scope.currentCompany._id)
            .then(function(response) {
                $scope.conversations = response;
                $scope.loading = false;
                // console.log($scope.conversations);
            })
            .catch(showError);

        $rootScope.$on('refresh messages', function() {
            var newMessage = { createdAt: Date.now(), body: $rootScope.newMessage.composedMessage, user: $rootScope.newMessage.user, company: $rootScope.newMessage.company, conversationId: $rootScope.newMessage.conversationId };
            // console.log(newMessage);
            if ($scope.currentConversation !== undefined && $rootScope.newMessage.conversationId === $scope.currentConversation._id) {
                $rootScope.$apply(function() {
                    $scope.messages.push(newMessage);
                    // console.log($scope.messages);
                    $scope.currentConversation.message.body = $rootScope.newMessage.composedMessage;

                    messageService.notificationsFalse($scope.currentConversation._id, { company: true, user: false })
                        .then(function(response) {
                            $scope.currentConversation.companyNotifications.new = false;
                            $scope.currentConversation.companyNotifications.total = 0;
                        })
                        .catch(showError);
                });
            } else {
                $scope.conversations.forEach(function(conversation) {
                    if (conversation._id === $rootScope.newMessage.conversationId) {
                        $rootScope.$apply(function() {
                            conversation.message.body = $rootScope.newMessage.composedMessage;
                            conversation.companyNotifications.new = true;
                            conversation.companyNotifications.total++;
                        });
                    }
                });
            }

            // $rootScope.newMessage = undefined;
        });

        $scope.selectConversation = function(conversation) {
            $scope.currentConversation = conversation;
            $rootScope.currentConversation = conversation._id;

            messageService.getConversation(conversation._id)
                .then(function(response) {
                    $scope.messages = response;
                    // console.log(response);

                    if ($scope.currentConversation.companyNotifications === undefined) {
                        $scope.currentConversation.companyNotifications = {
                            new: false,
                            total: 0
                        };
                    }

                    if ($scope.currentConversation.companyNotifications.new) {
                        messageService.notificationsFalse(conversation._id, { company: true, user: false })
                            .then(function(response) {
                                $rootScope.messageTotal = $scope.currentConversation.companyNotifications.total;
                                $rootScope.$broadcast('company:Message opened');

                                $scope.currentConversation.companyNotifications.new = false;
                                $scope.currentConversation.companyNotifications.total = 0;
                            })
                            .catch(showError);
                    }

                    if ($scope.currentConversation.message === undefined) {
                        $scope.currentConversation.message = {
                            body: ''
                        };
                    }
                })
                .catch(showError);
        };

        $scope.sendMessage = function() {
            var message = {
                user: false,
                company: true,
                composedMessage: $scope.composedMessage,
                conversationId: $scope.currentConversation._id
            };

            messageService.sendMessage($scope.currentConversation._id, message)
                .then(function(response) {
                    $scope.composedMessage = '';
                    // $scope.messages.push(response.reply);
                    $scope.currentConversation.message.body = response.reply.body;
                    // console.log(response.reply);
                })
                .catch(showError);
        };

        if ($rootScope.currentConversation !== undefined) {
            $scope.conversations.push($rootScope.currentConversation);
            $scope.selectConversation($rootScope.currentConversation);
        }
    }

    angular.module('sande')
        .controller('CompanyMessagesController', ['$scope', 'authService', 'notifier', 'messageService', '$state', '$rootScope', CompanyMessagesController]);

}());