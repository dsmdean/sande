(function() {
    'use strict';

    function notifier() {

        toastr.options = {
            "showDuration": "3000",
            "timeOut": "3000"
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