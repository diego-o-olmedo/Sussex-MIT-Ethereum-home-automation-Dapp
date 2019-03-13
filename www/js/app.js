// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ionic-color-picker', 'ionic-timepicker', 'angular-svg-round-progress','firebase'])

    .config(function($ionicConfigProvider) {
        //added config
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.tabs.position('bottom');
    })

// 시작시 실행
    .run(function ($ionicPlatform, dataService,$rootScope,$ionicSideMenuDelegate,$ionicModal) {

        // not used
        $rootScope.extras = false;
        // not Worked
        $ionicSideMenuDelegate.canDragContent(false);

        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)

            // init ConnectValue
            var defaultConnectValue = 0;
            dataService.setConnectValue(defaultConnectValue);

            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                // added
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        })
    })

.controller('',['$scope',function($scope){



}]);
