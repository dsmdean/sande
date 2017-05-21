(function() {
    'use strict';

    function SidebarController($scope, $location, authService) {

        $scope.getClass = function(path) {
            return $location.path().substr(0, path.length) === path ? 'active' : '';
        }

        $scope.currentUser = authService.getCurrentUser();

        // $scope.submenu = function() {
        //     // e.preventDefault();

        //     var $item = $('.dropdown-toggle').parent();

        //     if (!$item.hasClass('open')) {
        //         $item.parent().find('.open .submenu').slideUp('fast');
        //         $item.parent().find('.open').toggleClass('open');
        //     }

        //     $item.toggleClass('open');

        //     if ($item.hasClass('open')) {
        //         $item.children('.submenu').slideDown('fast');
        //     } else {
        //         $item.children('.submenu').slideUp('fast');
        //     }
        // };
    }

    angular.module('sande')
        .controller('SidebarController', ['$scope', '$location', 'authService', SidebarController]);

}());