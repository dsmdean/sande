(function() {
    'use strict';

    function UserMessagesController($scope, authService, notifier, messageService, $state, $rootScope) {

        $scope.currentUser = authService.getCurrentUser();
        $scope.loading = true;
        $scope.conversations = [];
        $scope.currentConversation = undefined;
        // $scope.messages = [];

        // $('.conversation-inner').slimScroll({
        //     height: '405px',
        //     wheelStep: 35,
        // });

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
        }

        messageService.getUserMessages()
            .then(function(response) {
                $scope.conversations = response;
                $scope.loading = false;
                // console.log($scope.conversations);

                if ($rootScope.newMessage) {
                    $scope.newConversation = true;
                    $scope.company = $rootScope.company;
                    $scope.conversations.push({ company: $scope.company, user: $scope.currentUser._id, message: "I don't think they tried to market it to the billionaire, spelunking, base-jumping crowd." });
                    // console.log($scope.conversations);
                }
            })
            .catch(showError);

        $rootScope.$on('refresh messages', function() {
            var newMessage = { createdAt: Date.now(), body: $rootScope.newMessage.composedMessage, user: $rootScope.newMessage.user, company: $rootScope.newMessage.company, conversationId: $rootScope.newMessage.conversationId };
            // console.log(newMessage);
            if ($scope.currentConversation !== undefined && $rootScope.newMessage.conversationId === $scope.currentConversation._id) {
                $rootScope.$apply(function() {
                    $scope.messages.push(newMessage);
                    // console.log($scope.messages);

                    messageService.notificationsFalse($scope.currentConversation._id, { user: true, company: false })
                        .then(function(response) {
                            $scope.currentConversation.userNotifications.new = false;
                            $scope.currentConversation.userNotifications.total = 0;
                        })
                        .catch(showError);
                });
            } else {
                $scope.conversations.forEach(function(conversation) {
                    if (conversation._id === $rootScope.newMessage.conversationId) {
                        $rootScope.$apply(function() {
                            conversation.message.body = $rootScope.newMessage.composedMessage;
                            conversation.userNotifications.new = true;
                            conversation.userNotifications.total++;
                        });
                    }
                });
            }
        });

        $scope.startConversation = function() {
            var data = {
                user: $scope.currentUser._id,
                company: $scope.company._id,
                composedMessage: $scope.composedMessage,
                author: {
                    user: true,
                    company: false
                }
            };

            messageService.newConversation(data)
                .then(function(response) {
                    $scope.messages.push(response.newMessage);
                    $scope.composedMessage = '';
                    console.log(response);
                })
                .catch(showError);
        };

        $scope.selectConversation = function(conversation) {
            $scope.currentConversation = conversation;

            messageService.getConversation(conversation._id)
                .then(function(response) {
                    $scope.messages = response;
                    // console.log(response);

                    if ($scope.currentConversation.userNotifications.new) {
                        messageService.notificationsFalse(conversation._id, { user: true, company: false })
                            .then(function(response) {
                                $scope.currentConversation.userNotifications.new = false;
                                $scope.currentConversation.userNotifications.total = 0;
                            })
                            .catch(showError);
                    }
                })
                .catch(showError);
        };

        $scope.sendMessage = function() {
            var message = {
                user: true,
                company: false,
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
    }

    angular.module('sande')
        .controller('UserMessagesController', ['$scope', 'authService', 'notifier', 'messageService', '$state', '$rootScope', UserMessagesController]);

}());