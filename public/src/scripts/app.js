(function() {
    'use strict';

    var app = angular.module('sande', ['ui.router', 'ngFileUpload', 'ui.calendar']);

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
            .state('activate', {
                url: '/activate/:userID',
                controller: 'UserActivationController',
                templateUrl: 'templates/user-activation.html'
            })
            .state('forgot-password', {
                url: '/forgot-password',
                controller: 'ForgotPasswordController',
                templateUrl: 'templates/forgot-password.html'
            })
            .state('recover', {
                url: '/recover/:userID',
                controller: 'RecoverPasswordController',
                templateUrl: 'templates/recover-password.html'
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
                url: '/user/profile',
                views: {
                    'content@dashboard': {
                        controller: 'UserProfileController',
                        templateUrl: 'templates/user-profile.html'
                    }
                }
            })
            .state('company-create', {
                parent: 'page',
                url: '/create-company',
                views: {
                    'content@dashboard': {
                        controller: 'RegisterCompanyController',
                        templateUrl: 'templates/create-company.html'
                    }
                }
            })
            .state('companies', {
                parent: 'page',
                url: '/company',
                views: {
                    'content@dashboard': {
                        controller: 'CompaniesController',
                        templateUrl: 'templates/companies.html'
                    }
                }
            })
            .state('company-profile', {
                parent: 'page',
                url: '/company/:name',
                views: {
                    'content@dashboard': {
                        controller: 'CompanyProfileController',
                        templateUrl: 'templates/company-profile.html'
                    }
                }
            })
            .state('company-calendar', {
                parent: 'page',
                url: '/company/calendar/:name',
                views: {
                    'content@dashboard': {
                        controller: 'CompanyCalendarController',
                        templateUrl: 'templates/company-calendar.html'
                    }
                }
            })
            .state('company-search', {
                parent: 'page',
                url: '/search/company/:search',
                views: {
                    'content@dashboard': {
                        controller: 'CompanySearchController',
                        templateUrl: 'templates/company-search.html'
                    }
                }
            })
            .state('shopping-cart', {
                parent: 'page',
                url: '/user/cart/:name',
                views: {
                    'content@dashboard': {
                        controller: 'ShoppingCartController',
                        templateUrl: 'templates/shopping-cart.html'
                    }
                }
            })
            .state('user-invoices', {
                parent: 'page',
                url: '/user/invoices',
                views: {
                    'content@dashboard': {
                        controller: 'UserInvoicesController',
                        templateUrl: 'templates/user-invoices.html'
                    }
                }
            })
            .state('user-invoice-details', {
                parent: 'page',
                url: '/user/invoices/:invoiceId',
                views: {
                    'content@dashboard': {
                        controller: 'UserInvoiceDetailsController',
                        templateUrl: 'templates/user-invoice-details.html'
                    }
                }
            });

    }]);

    app.run(['$rootScope', '$log', '$state', 'authService', function($rootScope, $log, $state, authService) {

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

            if (!authService.isAuthenticated() && toState.name != 'login' && toState.name != 'register' && toState.name != 'forgot-password' && toState.name != 'activate' && toState.name != 'recover') {
                event.preventDefault();
                $state.go('login');
            } else if (authService.isAuthenticated() && (toState.name == 'login' || toState.name == 'register')) {
                event.preventDefault();
                $state.go('user');
            }

            if (toState.name === 'user') {
                authService.removeCurrentCompany();
            }

            // if (toState.name === 'company-profile') {
            //     authService.setCompany();
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