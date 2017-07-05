(function() {
    'use strict';

    angular.module('sande')
        .constant('constants', {
            APP_SERVER: 'https://sande-test.herokuapp.com/api',
            APP_SOCKET: 'https://sande-test.herokuapp.com',
            // APP_SERVER: 'http://localhost:3000/api',
            // APP_SOCKET: 'http://localhost:3000'
        });
}());