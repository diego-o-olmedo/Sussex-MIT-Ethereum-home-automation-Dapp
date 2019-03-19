angular.module('BSconvert')
.controller('calculatorCtrl', $scope=>{
  // $scope.custom = true;
  $scope.custom=false;
  $scope.toggleCustom = ()=>
  {

    var temp = $scope.output;
    var arrayNum = [];
    arrayNum.push(temp);
    tempN=arrayNum.join('')*1;
    // console.log(tempN);
    document.getElementById('test').value = tempN;
    // $scope.input=tempN;
    $scope.custom = $scope.custom === false ? true: false;
    $scope.converter(temp);
    // $scope.output=temp;
    if(!$scope.custom)
    {
      $scope.uniti="mg/dL";
      $scope.unito="mmol/L";

    }
    else{
      $scope.unito="mg/dL";
      $scope.uniti="mmol/L";
    }
  }
  $scope.title = 'BSconvert';
  $scope.input="";
  $scope.output="";
  $scope.unito="mmol/L";
  $scope.uniti="mg/dL";
  var input="";
  var output="";
  $scope.converter=n=>{
    $scope.input1=""
    var arrayNum = [];
    // var unit="";
    // var unito="mmol/L";
    // var uniti="mg/dL";
    arrayNum.push(n);
    input=arrayNum.join('')*1;
    if(!$scope.custom)
    {
      output=input/18;
      output=output.toFixed(1);
      // unito="mg/dL";
      // uniti="mmol/L";
    }
    else{
      output=input*18;
      output=output.toFixed(1);
    }
    $scope.output=output+" ";
    // $scope.unito=unito;
    // $scope.uniti=uniti;

  };
});
