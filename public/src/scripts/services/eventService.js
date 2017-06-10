(function() {
    'use strict';

    function eventService(notifier, $http, constants, $log, $q, authService, $rootScope) {

        var baseURL = constants.APP_SERVER;

        function showError(message) {
            notifier.error(message.data.err);
        }

        function addEvent(eventData) {
            return $http.post(baseURL + '/events', eventData)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error posting a event: ' + response.statusText);
                    return $q.reject('Error posting a event.');
                });
        }

        function getCompanyEvents(companyId) {
            return $http.get(baseURL + '/events/company/' + companyId)
                .then(function(response) {
                    return response.data;
                })
                .catch(function(response) {
                    $log.error('Error getting company events: ' + response.statusText);
                    return $q.reject('Error getting company events.');
                });
        }

        return {
            addEvent: addEvent,
            getCompanyEvents: getCompanyEvents
        };
    }

    angular.module('sande')
        .factory('eventService', ['notifier', '$http', 'constants', '$log', '$q', 'authService', '$rootScope', eventService]);

}());