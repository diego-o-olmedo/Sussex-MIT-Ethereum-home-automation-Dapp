angular.module('eth-sussex-iot')


  .controller("homeController", function ($scope, $stateParams, $q, $state, $rootScope, homeService, connectionsService, settingsService) {


    console.log("hello from controller of home");


    $scope.connections = connectionsService.getConnections();

    $scope.reverse_state = "ON";
    $scope.reverse_state_y = "ON";
    $scope.state_of_lamp = homeService.getX();
    $scope.state_of_fan = homeService.getY();
    $scope.connect_text = "";

    /* Connect to Web3js */
    if (typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
      console.log("web3 already exists somewhere")
    } else {
      console.log("using localhost ====")
      web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    /* set web3 ethereum default account */
    web3.eth.defaultAccount = web3.eth.accounts[0];
    /* integrate the contract ABI */
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
    /* get contract by address */
    var _appContract = lampTestContract.at('0x26ef2c455c5e8d1c4480de0d6fb8daf6bb661589');

    console.log(_appContract);

    var isConnected = settingsService.isConnected();
    $scope.connect_status = isConnected;
    var _mqtt = settingsService.getMqttInstance();
    var connect_string = settingsService.getConnectionString();



    var mqtt;
    var reconnectTimeout = 2000;
    var host = "m11.cloudmqtt.com";
    var port = 36886


    $scope.toggleConnection = function (_id) {
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

    /* handle user click event, switch device ON and OFF */
    $scope.toggleDevice = function (_id) {
      /* Fetching the publish/subscribe topics entered by the user when adding the device */
      var subscribe_topic = connectionsService.getConnectionById(_id)[0].subscribe_topic;
      var publish_topic = connectionsService.getConnectionById(_id)[0].publish_topic;
      /* subscribing to the subscription topic */
      mqtt.subscribe(subscribe_topic);

      message = new Paho.MQTT.Message("toggle");
      message.destinationName = publish_topic;
      /* specifying the Quality of Service */
      message.qos = 2;

      /* publishing a message to the publication topic */
      mqtt.send(message);

      /* Handling receiving a message from the topic subscribed to */
      mqtt.onMessageArrived = onMessageArrived
    }




    function MQTTconnect(_host, _port, _user, _password) {
      /* creating a new MQTT instance */
      mqtt = new Paho.MQTT.Client(_host, _port, "clientjsId");
      /* Specifying the connection options */
      var options = {
        timeout: 3,
        onSuccess: onConnect,
        onFailure: onFailureToConnect,
        userName: _user,
        password: _password,
        useSSL: true
      };
      /* Connecting to CloudMQTT */
      mqtt.connect(options);
    }


    function onConnect() {
      console.log("connected", $rootScope.pub_topic);
      $scope.connect_status = "connected";


    }

    function onFailureToConnect() {
      console.log("failed to connect!");
    }


    /** called when a message arrives to the topic we subscribed to */
    function onMessageArrived(message) {
      /* storing status of the device in a variable */
      var _status = message.payloadString;
      /* storing the status of the device and a timestamp on the smart contract */
       _appContract.setStatus_(_status, new Date().getDate().toString(), function (err, res) {
        if (!err) {
          console.log("successfully stored on the blockchain!", res);
        } else {
          console.log("an error occured", err);
        }
      });
      console.log("done!");

      $scope.$apply(function () {
        $scope.state_of_lamp = message.payloadString;
        $scope.reverse_state = homeService.returnReverse(message.payloadString);
      });

    }













  });
