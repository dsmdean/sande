(function() {
    'use strict';

    function messageService(notifier, $http, constants, $q, Websocket) {
        var baseURL = constants.APP_SERVER;

        function getUserMessages() {
            return $http.get(baseURL + '/messenger/user/')
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error getting messages: ' + response.statusText);
                    return $q.reject('Error getting messages.');
                });
        }

        function getCompanyMessages(companyId) {
            return $http.get(baseURL + '/messenger/company/' + companyId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error getting messages: ' + response.statusText);
                    return $q.reject('Error getting messages.');
                });
        }

        function getConversation(conversationId) {
            return $http.get(baseURL + '/messenger/' + conversationId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error getting conversation: ' + response.statusText);
                    return $q.reject('Error getting conversation.');
                });
        }

        function sendMessage(conversationId, message) {
            Websocket.sendMessage(message);
            return $http.post(baseURL + '/messenger/' + conversationId, message)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error sending reply: ' + response.statusText);
                    return $q.reject('Error sending reply.');
                });
        }

        function newConversation(data) {
            // Websocket.sendMessage(message);
            return $http.post(baseURL + '/messenger/new/', data)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error starting new conversation: ' + response.statusText);
                    return $q.reject('Error starting conversation.');
                });
        }

        return {
            getUserMessages: getUserMessages,
            getCompanyMessages: getCompanyMessages,
            getConversation: getConversation,
            sendMessage: sendMessage,
            newConversation: newConversation
        };
    }

    angular.module('sande')
        .factory('messageService', ['notifier', '$http', 'constants', '$q', 'Websocket', messageService]);
}());