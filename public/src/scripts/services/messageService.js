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
            return $http.post(baseURL + '/messenger/new', data)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error starting new conversation: ' + response.statusText);
                    return $q.reject('Error starting conversation.');
                });
        }

        function notificationsFalse(conversationId, data) {
            // Websocket.sendMessage(message);
            return $http.put(baseURL + '/messenger/' + conversationId, data)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error setting notification to false: ' + response.statusText);
                    console.log(response);
                    return $q.reject('Error setting notification to false.');
                });
        }

        function getAllUserConversations() {
            return $http.get(baseURL + '/messenger/userconversations')
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error getting conversations: ' + response.statusText);
                    return $q.reject('Error getting conversations.');
                });
        }

        function getAllCompanyConversations(companyId) {
            return $http.get(baseURL + '/messenger/companyconversations/' + companyId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error getting conversations: ' + response.statusText);
                    return $q.reject('Error getting conversations.');
                });
        }

        function userCompanyconversation(companyId) {
            return $http.get(baseURL + '/messenger/userCompanyconversation/' + companyId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    console.log('Error getting conversation: ' + response.statusText);
                    return $q.reject('Error getting conversation.');
                });
        }

        return {
            getUserMessages: getUserMessages,
            getCompanyMessages: getCompanyMessages,
            getConversation: getConversation,
            sendMessage: sendMessage,
            newConversation: newConversation,
            notificationsFalse: notificationsFalse,
            getAllUserConversations: getAllUserConversations,
            getAllCompanyConversations: getAllCompanyConversations,
            userCompanyconversation: userCompanyconversation
        };
    }

    angular.module('sande')
        .factory('messageService', ['notifier', '$http', 'constants', '$q', 'Websocket', messageService]);
}());