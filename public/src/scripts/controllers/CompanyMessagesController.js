(function() {
    'use strict';

    function CompanyMessagesController($scope, authService, notifier, messageService, $state, $rootScope) {

        $scope.currentCompany = authService.getCurrentCompany();
        $scope.loading = true;
        $scope.conversations = [];
        $scope.currentConversation = undefined;
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
            $rootScope.$apply(function() {
                if ($rootScope.newMessage.conversationId === $scope.currentConversation._id) {
                    $scope.messages.push(newMessage);
                    // console.log($scope.messages);
                }
            });
        });

        $scope.selectConversation = function(conversation) {
            $scope.currentConversation = conversation;

            messageService.getConversation(conversation._id)
                .then(function(response) {
                    $scope.messages = response;
                    // console.log(response);
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
    }

    angular.module('sande')
        .controller('CompanyMessagesController', ['$scope', 'authService', 'notifier', 'messageService', '$state', '$rootScope', CompanyMessagesController]);

}());