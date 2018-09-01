angular.module('eth-sussex-iot')


.service('homeService', function(){

    var x = "OFF";
    var y = "OFF";


    this.getX = function(){
        console.log("this is x", x);
        return x;
    }

    this.setX = function(_x){
    
    x = _x;
    console.log("passed param", x);
    }

    this.getY = function(){
        console.log("this is y", y);
        return y;
    }

    this.setY = function(_y){    
    y = _y;
    console.log("passed param", y);
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