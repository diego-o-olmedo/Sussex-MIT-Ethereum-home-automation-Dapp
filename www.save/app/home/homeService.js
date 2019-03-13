angular.module('eth-sussex-iot')


.service('homeService', function(){

    var x = "OFF";
    var y = "OFF";


    this.getX = function(){
        
        return x;
    }

    this.setX = function(_x){
    
    x = _x;
    
    }

    this.getY = function(){
        
        return y;
    }

    this.setY = function(_y){    
    y = _y;

    }

    this.returnReverse = function(_c){
        console.log("from reverse", _c)
        if(_c === "ON")
        return "OFF"
        else if(_c === "OFF")
        return "ON"
        else
        return "N/A"
    }


    

});