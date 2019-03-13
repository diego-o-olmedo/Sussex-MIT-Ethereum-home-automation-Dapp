angular.module('app.routes', [])

    .config(function ($stateProvider, $urlRouterProvider,$ionicConfigProvider) {


        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('tabsController.colorPicker', {
                url: '/page2',
                views: {
                    'tab1': {
                        templateUrl: 'templates/dashboard.html',

                    }
                }
            })
            .state('tabsController.ledTest1', {
                url: '/Control Room 01',
                views: {
                    'tab4': {
                        templateUrl: 'templates/LED_1.html',
                        controller: 'colorPickerCtrl'
                    }
                }
            })

            .state('tabsController.ledTest2', {
                url: '/Control Room 02',
                views: {
                    'tab5': {
                        templateUrl: 'templates/LED_2.html',
                        controller: 'colorPickerCtrl'
                    }
                }
            })

            .state('tabsController.ledTest3', {
                url: '/Control Room 03',
                views: {
                    'tab6': {
                        templateUrl: 'templates/LED_3.html',
                        controller: 'colorPickerCtrl'
                    }
                }
            })

            .state('tabsController.ledTest4', {
                url: '/Control Room 04',
                views: {
                    'tab7': {
                        templateUrl: 'templates/LED_4.html',
                        controller: 'colorPickerCtrl'
                    }
                }
            })

            .state('tabsController.remote',{
                url: '/page9',
                views : {
                    'tab8' : {
                        templateUrl: 'templates/Remote_Control.html',
                        controller : 'remoteCtrl'
                    }
                }
            })
            .state('tabsController.login', {
                url: '/page10',
                views: {
                    'tab9': {
                        templateUrl: 'templates/login.html',
                        controller: 'loginCtrl'
                    }
                }
            })

            .state('tabsController.sign_up', {
                url: '/page11',
                views: {
                    'tab10': {
                        templateUrl: 'templates/sign_up.html',
                        controller: 'signupCtrl'
                    }
                }
            })

            .state('tabsController.settings', {
                url : '/page12',
                views : {
                    'tab11' :{
                        templateUrl : 'templates/settings.html'
                    }
                }
            })

            .state('tabsController', {
                url: '/page1',
                templateUrl: 'templates/tabsController.html',
                abstract: true
            })


        // switch : default
        $urlRouterProvider.otherwise('/page1/page10')
    });