angular.module('eth-sussex-iot')


  .controller("settingsController", function ($scope, $stateParams, $q, $state, $rootScope, settingsService) {
    console.log("hello from controller of settings");

    $scope.connection = {
        host:'',
        username :'',
        password :'',
        port : '',
        topic: ''
    }

    $scope.connection_status = settingsService.getConnectionStatus();

    var mqtt;
    var reconnectTimeout = 2000;
    var host = "m11.cloudmqtt.com";
    port = 36886;

    $scope.connectMqtt = function(){
        console.log("attempting to connect ", $scope.connection);        
        MQTTconnect();
    }

    $scope.backHome = function(){
        $state.go("home", { reload: true });
       
    }

    function MQTTconnect() {
        console.log("connectiong to host and port");
        mqtt = new Paho.MQTT.Client($scope.connection.host, parseInt($scope.connection.port, 10), "clientjsId");
  
        var options = {
          timeout: 3,
          onSuccess: onConnect,
          onFailure: onFailureToConnect,
          userName: $scope.connection.username,
          password: $scope.connection.password,
          useSSL: true
        };
  
        mqtt.connect(options);
  
      }


      function onConnect(){
          console.log ("connected from settings!");
          $scope.connection_status = "connected";          
          settingsService.setConnectionString($scope.connection);
          settingsService.setMqttInstance(mqtt);
          settingsService.setConnectionStatus("connected");
          $scope.$apply();
      }

      function onFailureToConnect(){
          console.log("failed to connect from settings");
          settingsService.setConnectionStatus("disconnected");
          $scope.connection_status = "disonnected";
          $scope.$apply();
      }


  });


    
