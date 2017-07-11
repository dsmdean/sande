(function() {
    'use strict';

    function FBLoginCallbackController($scope, userService, authService, notifier, $rootScope, $state, $location) {

        $scope.loading = true;

        function showError(message) {
            notifier.error(message);
            $scope.loading = false;
            $state.go("login");
        }

        userService.getUserById($location.search().user)
            .then(function(response) {
                $scope.user = response;
                $scope.user.token = $location.search().token;
                authService.fbLogin($scope.user);
                // $scope.loading = false;
            })
            .catch(showError);

        $rootScope.$on('login:Successful', function() {
            // $scope.loading = false;
            $scope.loggedIn = true;
            $scope.currentUser = authService.getCurrentUser();

            if (authService.isAdmin()) {
                $scope.isAdmin = true;
            }

            $state.go("user");
        });
    }

    angular.module('sande')
        .controller('FBLoginCallbackController', ['$scope', 'userService', 'authService', 'notifier', '$rootScope', '$state', '$location', FBLoginCallbackController]);

}());