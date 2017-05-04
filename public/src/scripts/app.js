(function() {
    'use strict';

    var app = angular.module('sande', ['ui.router']);

    app.config(['$logProvider', '$stateProvider', '$urlRouterProvider', function($logProvider, $stateProvider, $urlRouterProvider) {

        $logProvider.debugEnabled(true);

        $urlRouterProvider.otherwise('/404');

        $stateProvider
            .state('login', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'templates/login.html'
            })
            .state('register', {
                url: '/register',
                controller: 'RegistrationController',
                templateUrl: 'templates/registration.html'
            })
            .state('dashboard', {
                templateUrl: 'templates/dashboard.html'
            })
            .state('page', {
                parent: 'dashboard',
                views: {
                    'header@dashboard': {
                        controller: 'HeaderController',
                        templateUrl: 'templates/header.html'
                    },
                    'sidebar@dashboard': {
                        controller: 'SidebarController',
                        templateUrl: 'templates/sidebar.html'
                    },
                    'footer@dashboard': {
                        controller: 'FooterController',
                        templateUrl: 'templates/footer.html'
                    }
                }
            })
            .state('error404', {
                parent: 'page',
                url: '/404',
                views: {
                    'content@dashboard': {
                        templateUrl: 'templates/error-404.html'
                    }
                }
            })
            .state('user', {
                parent: 'page',
                url: '/user',
                views: {
                    'content@dashboard': {
                        templateUrl: 'templates/user-profile.html'
                    }
                }
            });

    }]);

    app.run(['$rootScope', '$log', '$state', function($rootScope, $log, $state) {

        // $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {

        //     $log.debug('successfully changed route');

        //     $log.debug('event', event);
        //     $log.debug('toState', toState);
        //     $log.debug('toParams', toParams);
        //     $log.debug('fromState', fromState);
        //     $log.debug('fromParams', fromParams);

        // });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            // $log.debug('State changed - Auth: ' + authentication.isAuthenticated());

            // if (!authentication.isAuthenticated() && toState.name != 'login') {
            //     event.preventDefault();
            //     $state.go('login');
            // } else if (authentication.isAuthenticated() && toState.name == 'login') {
            //     $state.go('home');
            // }

        });

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {

            $log.error('The requested state was not found: ', unfoundState);

        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

            $log.error('An error occured while changing states: ', error);

            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);

        });
    }]);

}());