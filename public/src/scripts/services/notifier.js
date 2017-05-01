(function() {
    'use strict';

    function notifier() {

        toastr.options = {
            "showDuration": "5000",
            "timeOut": "5000"
        };

        function success(message) {
            toastr.success(message);
        }

        function error(message) {
            toastr.error(message);
        }

        return {
            success: success,
            error: error
        };
    }

    angular.module('sande')
        .factory('notifier', notifier);

}());