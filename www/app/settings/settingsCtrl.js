angular.module('eth-sussex-iot')


  .controller("settingsController", function ($scope, $stateParams, $q, $state, $rootScope, settingsService, connectionsService) {
    console.log("hello from controller of settings");

    $scope.connection = {
        name: '',
        host:'',
        username :'',
        password :'',
        port : '',
        topic: ''
    }

    

    $scope.backHome = function(){
        $state.go("home", { reload: true });
       
    }

  
      $scope.addMqttConnection = function(){
          // add connection to the connectionsService array
        connectionsService.addConnection($scope.connection);
      }


  });


    
