angular.module('eth-sussex-iot')


.service('settingsService', function(){

    var connection_string = {host:'', username :'', password :'', port : ''}
    var connected = "disconnected";
    var mqttInstance;


    this.getConnectionString = function(){
        console.log("this is the connection string", connection_string);
        return connection_string;
    }

    this.setConnectionString = function(_x){    
    connection_string = _x;
    console.log("passed param", _x);
    }

    this.setConnectionStatus = function(_status){
        connected = _status;
    }

    this.getConnectionStatus = function(){
        return connected;
    }

    this.isConnected = function(){
        return connected;
    }

    this.setMqttInstance = function(_mqtt){
        mqttInstance = _mqtt;
    }

    this.getMqttInstance = function(){
        return mqttInstance;
    }

   

});