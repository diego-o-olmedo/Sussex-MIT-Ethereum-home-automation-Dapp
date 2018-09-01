angular.module('eth-sussex-iot')


  .controller("homeController", function ($scope, $stateParams, $q, $state, $rootScope, homeService, connectionsService, settingsService) {


    console.log("hello from controller of home");


    $scope.connections= connectionsService.getConnections();

    $scope.reverse_state = "ON";
    $scope.reverse_state_y = "ON";
    $scope.state_of_lamp = homeService.getX();
    $scope.state_of_fan = homeService.getY();
    $scope.connect_text = "";

    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
      console.log("web3 already exists somewhere")
    } else {
      console.log("using localhost ====")
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    web3.eth.defaultAccount = web3.eth.accounts[0];
    var lampTestContract = web3.eth.contract(
      [{
          "constant": true,
          "inputs": [],
          "name": "getStatus_",
          "outputs": [{
              "name": "",
              "type": "string"
            },
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [{
              "name": "_state",
              "type": "string"
            },
            {
              "name": "_ts",
              "type": "string"
            }
          ],
          "name": "setStatus_",
          "outputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [{
              "indexed": false,
              "name": "lampState",
              "type": "string"
            },
            {
              "indexed": false,
              "name": "ts",
              "type": "string"
            }
          ],
          "name": "Status_",
          "type": "event"
        }
      ]
    );
    var _lamp = lampTestContract.at('0x26ef2c455c5e8d1c4480de0d6fb8daf6bb661589');
    console.log(_lamp);

    var isConnected = settingsService.isConnected();
    $scope.connect_status = isConnected;
    var _mqtt = settingsService.getMqttInstance();
    var connect_string = settingsService.getConnectionString();


    console.log("connection status, coming from settings", isConnected)
    console.log("connection string, coming from settings", connect_string.host)
    var mqtt;
    var reconnectTimeout = 2000;
    var host = "m11.cloudmqtt.com";
    var port = 36886

    /*
    use this to connect through service
     if (connect_string.host != "") {
          console.log("we are in if");
         var host = settingsService.getConnectionString().host;
          var port = parseInt(settingsService.getConnectionString().port, 10); 
          MQTTconnect();
        } else {
          console.log("else == ");

        }
    */


    // connecting to MQTT before page loads


    //MQTTconnect();
    //console.log("state of lamp after exec", $scope.state_of_lamp);


    $scope.toggleConnection = function(_id){
      console.log("switching connection id : ", _id);
      var connection = connectionsService.getConnectionById(_id);
      console.log("connection from service: ", connection[0].host);
      var host = connection[0].host;
      var port = connection[0].port;
      var username = connection[0].username;
      var password = connection[0].password;
      var pub = connection[0].publish_topic;
      var sub = connection[0].subscribe_topic; 
      $rootScope.pub_topic = pub;
      $rootScope.sub_topic = sub;
      MQTTconnect(host, port, username, password);    
    }

    $scope.goToSettings = function () {
      $state.go("settings");
    }

    $scope.toggleFan = function () {
      console.log("mqtt instance ", mqtt);
      message = new Paho.MQTT.Message("toggle");
      message.destinationName = "cmnd/house/temp/power";
      message.qos = 2;
      mqtt.send(message);
      console.log("message sent!");
      mqtt.onMessageArrived = onMessageArrived
      // }

    }

    $scope.toggleLamp = function () {
      console.log("mqtt instance ", mqtt);
      message = new Paho.MQTT.Message("toggle");
      message.destinationName = "cmnd/house/lamp/power";
      message.qos = 2;
      mqtt.send(message);
      console.log("message sent!");
      mqtt.onMessageArrived = onMessageArrived    

    }


  $scope.toggleDevice = function(_id){
      console.log("mqtt instance ", mqtt);
      var subscribe_topic = connectionsService.getConnectionById(_id)[0].subscribe_topic;
      var publish_topic = connectionsService.getConnectionById(_id)[0].publish_topic;
      mqtt.subscribe(subscribe_topic);
      message = new Paho.MQTT.Message("toggle");
      message.destinationName = publish_topic;
      message.qos = 2;
      mqtt.send(message);
      console.log("message sent!");
      mqtt.onMessageArrived = onMessageArrived
  }
  



    function MQTTconnect(_host, _port, _user, _password) {
      console.log("connectiong to host and port");
      mqtt = new Paho.MQTT.Client(_host, _port, "clientjsId");
      
      var options = {
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailureToConnect,        
        userName: _user,
        password: _password,
        useSSL: true
      };

      mqtt.connect(options);      

    }


    function onConnect() {
      console.log("connected", $rootScope.pub_topic);      
      $scope.connect_status = "connected";
            

    }

    function onFailureToConnect() {
      console.log("failed to connect!");
    }


    // called when a message arrives
    function onMessageArrived(message) {
      var send_packet = {
        state: '',
        timestamp: ''
      };
      console.log("onMessageArrived:" + message.payloadString);
      console.log("Message Arrived: " + message.payloadString);
      console.log("Topic:" + message.destinationName);
      console.log("QoS:" + message.qos);
      console.log("Retained:" + message.retained);

      $scope.$apply(function () {
        $scope.state_of_lamp = message.payloadString;
        $scope.reverse_state = homeService.returnReverse(message.payloadString);
      })

/*
      var _status = message.payloadString;
      if(message.destinationName == "stat/house/temp/POWER"){
        homeService.setX(_status);
      } else if(message.destinationName == "stat/house/lamp/POWER"){
        homeService.setY(_status);
      }
      
      // send_packet.state = _status;
      // send_packet.timestamp = new Date();
      var date = new Date().getTime().toString();
      // console.log("the date ", date);
      // console.log("we sending to the contract :", send_packet);
      //_lamp.setStatus_("hi", "231");
      console.log(_lamp);
      $scope.$apply(function () {
        $scope.state_of_lamp = homeService.getX();
        $scope.state_of_fan = homeService.getY();
        $scope.reverse_state = homeService.returnReverse($scope.state_of_lamp);
        $scope.reverse_state_y = homeService.returnReverse($scope.state_of_fan);

      })
      console.log("===== status of lamp", _status);
     /* _lamp.setStatus_(_status, date, function (err, res) {
        if (!err) {
          console.log(res);
        } else {
          console.log(err);
        }*/
   //   });

      // $scope.state_of_lamp = _status;
      //  $scope.$spply(); 
      // var th = homeService.getX();




    }




    //   var subscribeOptions = {
    //     qos: 2,  // QoS
    //     onSuccess: onSubscribe,
    //     onFailure: onFailureToSubscribe,
    //     timeout: 10
    // };










  });
