(function() {
    'use strict';

    angular.module('sande')
        .directive("fileParse", ['$parse', function($parse) {
            return {
                restrict: 'A',
                link: function(scope, element, attributes) {
                    var parsedFile = $parse(attributes.fileParse);
                    var parsedFileSetter = parsedFile.assign;

                    element.bind('change', function() {
                        scope.$apply(function() {
                            parsedFileSetter(scope, element[0].files[0]);
                        });
                    });
                }
            }
        }]);
}());