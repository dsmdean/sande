(function() {
    'use strict';

    function Websocket($rootScope, constants) {
        var baseURL = constants.APP_SOCKET;
        // var baseURL = 'http://localhost:3000';
        var socket = io.connect(baseURL);

        socket.on('connect', function() {
            console.log("WEBSOCKET connected with session id", socket.io.engine.id);

            socket.on('refresh messages', function(message) {
                // console.log(data);
                $rootScope.newMessage = message;
                $rootScope.$broadcast('refresh messages');
            });
        });

        function sendMessage(message) {
            socket.emit('new message', message);
            // console.log(message);
        }

        return {
            sendMessage: sendMessage
        };
    }

    angular.module('sande')
        .factory('Websocket', ['$rootScope', 'constants', Websocket]);

}());