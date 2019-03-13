var app = angular.module('app.controllers', ['ionic-timepicker', 'ionic', 'ngCordova', 'app.routes', 'app.services', 'app.directives', 'firebase']);

// colorPicker start ---------
app.controller('colorPickerCtrl', function ($scope, $interval, $rootScope, dataService) {
    // Topic init

    $scope.ledTest_1 = "McLighting01/in";
    $scope.ledTest_2 = "McLighting02/in";
    $scope.ledTest_3 = "McLighting03/in";
    $scope.ledTest_4 = "McLighting04/in";

    $scope.effect = [];

    var effect_name = ["Blink", "Breath", "Color_Wipe", "Color_Wipe_Inverse", "Color_Wipe_Reverse", "Color_Wipe_Reverse_Inverse",
        "Color_Wipe_Random", "Random_Color", "Single_Dynamic", "Multi_Dynamic", "Rainbow", "Rainbow_Cycle",
        "Scan", "Dual_Scan", "Fade", "Theater_Chase", "Theater_Chase_Rainbow", "Running_Lights", "Twinkle",
        "Twinkle_Random", "Twinkle_Fade", "Twinkle_Fade_Random", "Sparkle", "Flash_Sparkle", "Hyper_Sparkle",
        "Strobe", "Strobe_Rainbow", "Multi_Strobe", "Blink_Rainbow", "Chase_White", "Chase_Color", "Chase_Random",
        "Chase_Rainbow", "Chase_Flash", "Chase_Flash_Random", "Chase_Rainbow_White", "Chase_Blackout",
        "Chase_Blackout_Rainbow", "Color_Sweep_Random", "Running_Color", "Running_Red_Blue",
        "Running_Random", "Larson_Scanner", "Comet", "Fireworks", "Fireworks_Random", "Merry_Chrismas",
        "Fire_Flicker", "Fire_Flicker(Soft)", "Fire_Flicker(intense)", "Circus_Combustus", "Halloween",
        "Bicolor_Chase", "Tricolor_Chase", "ICU"
    ];

    for (var i = 0; i < effect_name.length; i++) {
        $scope.effect.push({effectName: effect_name[i], value: i + 1})
    }

    $scope.show_Effect = function (value, value2) {

        var effect_value = "/" + value;
        var topic_name = value2;

        console.log("effect : " + effect_value + "  topic : " + topic_name);

        const payload = new Paho.MQTT.Message(effect_value);
        payload.destinationName = topic_name;
        client.send(payload);

    }


    // On/Off Switch
    $scope.switch_change = function (topic_name, switch_check) {

        var payload_code = "=off";

        if (switch_check) {
            payload_code = "/0";
        }

        const payload = new Paho.MQTT.Message(payload_code);
        payload.destinationName = topic_name;
        client.send(payload);

    }


    // realtime toggle check
    $scope.refresh = function () {
        $interval(function () {
            console.log("color picker ctrl check");
        }, 500, 1);
    }
});

// colorPicker end ---------


// side menu Controller start -------
//'dataService', '$scope', '$ionicModal', '$interval',
// app.controller('side_test', ['dataService', '$scope', '$ionicModal', '$interval', '$rootScope', 'sharedUtils','$rootScope','$ionicHistory', function (dataService, $scope, $ionicModal,
//                                                                                                                          $interval, $rootScope, $ionicSideMenuDelegate, sharedUtils, $rootScope, $ionicHistory) {

app.controller('side_test', function (dataService, $scope, $ionicModal, $interval,
                                      $rootScope, $ionicSideMenuDelegate, sharedUtils,
                                      $ionicHistory, $state, $ionicPopup, listStorage) {

    var sm = this;
    sm.connectValue = 0;

    $scope.dataService = dataService;


    // var req = {
    //     method : 'get',
    //     url :
    // }

    //weather side
    // setting Form modal
    $ionicModal.fromTemplateUrl('settingsForm', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    })

    $rootScope.test = function () {
        sm.connectValue = 1;
        dataService.setConnectValue(sm.connectValue);
    }


    $scope.goLoginPage = function () {
        $ionicSideMenuDelegate.toggleLeft(false);
    }

    // Connect
    $rootScope.connect = function () {

        const client_id = "hoya" + Math.floor((Math.random()) * 100000) + 1;

        console.log("client id + " + client_id);
        client = new Paho.MQTT.Client("m15.cloudmqtt.com", 33738, client_id);

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        // mqtt server info(userName, password)
        var options = {
            timeout: 3,
            useSSL: true,
            onSuccess: onConnect,
            userName: "crzllkoq",
            onFailure: doFail,
            password: "We1xV6kFGes7",
            keepAliveInterval: 600,
        };
        // console.log("TXSS",options);
        client.connect(options);

        function onConnect() {
            var message = new Paho.MQTT.Message("Mqtt success");
            message.destinationName = "mqtt/test";
            client.send(message);
            client.subscribe("McLighting01/cout");
            client.subscribe("McLighting02/cout");
            client.subscribe("McLighting03/cout");
            client.subscribe("McLighting04/cout");
            sm.connectValue = 1;
            dataService.setConnectValue(sm.connectValue);
            alert("login Success");
        }

        function doFail(responseObject) {
            const alertPopup = $ionicPopup.alert({
                title: 'error',
                template: responseObject.errorMessage
            })
        }

        function onConnectionLost(responseObject) {
            console.log("진입");
            if (responseObject.errorCode !== 0) {

                sharedUtils.showLoading();

                const alertPopup = $ionicPopup.alert({
                    title: 'Disconnect Success',
                    template: 'Client disconnected'
                });

                firebase.auth().signOut().then(function () {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $rootScope.extras = false;
                    sm.connectValue = 0;
                    dataService.setConnectValue(sm.connectValue);
                    sharedUtils.hideLoading();
                    $state.go('tabsController.login', {});
                    $scope.refresh();
                })
            }

        }

        function onMessageArrived(message) {
            $rootScope.confirmMessage = message.payloadString;
            console.log(" ArrivedMessage  : " + $rootScope.confirmMessage);
        }

        $scope.refresh();
    }

    // DisConnect
    $scope.disconnect = function () {
        client.disconnect();
        sm.connectValue = 0;
        dataService.setConnectValue(sm.connectValue);

        const alertPopup = $ionicPopup.alert({
            title: 'Disconnect Success',
            template: 'Client disconnected'
        });
        $scope.refresh();
    };

    //logout
    $scope.logoutEmail = function () {
        sharedUtils.showLoading();

        firebase.auth().signOut().then(function () {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $rootScope.extras = false;
                $scope.disconnect();
                sharedUtils.hideLoading();
                $state.go('tabsController.login', {});
            }, function (error) {
                sharedUtils.showAlert("error", "Logout Failed")
            }
        )
    }

    // realtime connection check
    $scope.refresh = function () {
        $interval(function () {
            console.log("side test check");
        }, 500, 1);
    }

    $scope.test_ng = function () {
        // listStorage._setToLocalStorage(null);
        listStorage._setToLocalStorage("list_data", null);
    }
});


app.controller("dashboardCtrl", function ($scope, listStorage, $ionicPopup, $ionicModal, $rootScope, dataService, $firebaseArray, $firebaseObject, $ionicHistory, $ionicSideMenuDelegate, sharedUtils, $state, $timeout) {

// control room refresh
    firebase.auth().onAuthStateChanged(function (user) {
            console.log("user : " + user.uid);
            if (user) {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $ionicSideMenuDelegate.canDragContent(false);
                $rootScope.extras = true;
                dataService.setUserInfo(user);
                sharedUtils.hideLoading();
                $state.go('tabsController.colorPicker', {});
                // var user = dataService.getUserInfo();


                var ref = firebase.database().ref(user.uid + '/ LED Control Room');
                $scope.list = $firebaseArray(ref);

                // data read (cloud -> local)
                $scope.list.$loaded().then(function () {
                    var local_list = [];
                    for (var i = 0; i < $scope.list.length; i++) {
                        var insertList = {
                            title: $scope.list[i]["title"],
                            href_link: $scope.list[i]["href_link"]
                        };
                        local_list.push(insertList);
                    }
                    listStorage._setToLocalStorage("list_data", local_list);
                })

            } else {
                dataService.setUserInfo(null);
            }
        }
    );


    $scope.addList = function (href_value) {
        // need arrangement
        const check_obj = document.getElementById("list");
        const titleNames = check_obj[0].value.trim();
        const hex_code = "#da3f3a";
        const effect_number = "/0";

        const local_Lists = listStorage.get("list_data");
        var duplication_check = true;

        for (var i = 0; i < local_Lists.length; i++) {
            if (href_value === local_Lists[i]["href_link"]) {
                duplication_check = false;
            }
        }

        if (titleNames.length !== 0) { // titleName null check
            if ($scope.list.length < 4) { // control room full check
                if (duplication_check) { // duplication topic check
                    var insertList = {
                        title: titleNames,
                        href_link: href_value,
                        // subtitle: "go"
                    };
                    local_Lists.push(insertList);

                    let topic_name;

                    switch (insertList.href_link) {
                        case 'Control Room 01' :
                            topic_name = 'McLighting01/in';
                            break;
                        case 'Control Room 02' :
                            topic_name = 'McLighting02/in';
                            break;
                        case 'Control Room 03' :
                            topic_name = 'McLighting03/in';
                            break;
                        default :
                            topic_name = 'McLighting04/in';
                    }

                    $scope.list.$add({
                        title: insertList.title,
                        href_link: insertList.href_link,
                        light_name: hex_code,
                        effect_code: effect_number,
                        topic: topic_name,
                        brightness: 152,
                        speed: 152
                    }).then(function (ref) {
                        var id = ref.key;
                        console.log(id);
                        $scope.list.$indexFor(id);


                    });

                    listStorage._setToLocalStorage("list_data", local_Lists);

                } else {
                    alert("already topic checked");
                }
            } else {
                alert("stack is full");
            }
        } else {
            alert("text is empty.");
        }
        $scope.modal.listTitle = "";
        $scope.modal.hide();
    };


    $scope.goControlRoom = function (link) {


        // Sensor Test
        // You can't entry into control room, if not connected Led sensor.

        // $rootScope.confirmMessage = null;
        // try {
        //     const payload = new Paho.MQTT.Message("/0");
        //     // payload.destinationName = "McLighting01/in";
        //     payload.destinationName = "McLighting01/in";
        //     client.send(payload);
        // } catch (e) {
        //     console.log("failed : " + e.message);
        // }
        //
        // $timeout(function () {
        //     console.log("Time out : " + $rootScope.confirmMessage)
        //     if ($rootScope.confirmMessage === null) {
        //         var alert = $ionicPopup.alert({
        //             title: "LED Sensor Error",
        //             template: "Led Sensor Off. Please turn of LED light"
        //         });
        //     } else {
        //         $rootScope.tabshide();
        //         window.location.href = link;
        //     }
        // }, 700);

        // test -> href link
        // Direct Control room (Non condition)
        $rootScope.tabshide();
        window.location.href = link;

    }

    $scope.remove = function (list) {


        const list_id = $scope.list.$keyAt(list);
        const list_number = $scope.list.$indexFor(list_id);
        var local_list = listStorage.get("list_data");
        //
        // console.log("$scope.list : " + $scope.list);
        // console.log("bring list : " + list);
        // console.log("list_id : " + list_id);
        // console.log("list_number : " + list_number);

        // return;
        $scope.list.$remove(list)
            .then(function (ref) {
                // localStorage section
                local_list.splice(list_number, 1);
                listStorage._setToLocalStorage("list_data", local_list);
            });
    };

    // room create modal
    $ionicModal.fromTemplateUrl('createForm', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;

    });

});

app.controller('loginCtrl', function ($scope, $rootScope, $ionicHistory, $state, sharedUtils, $ionicSideMenuDelegate, dataService) {


    // var client = new Paho.MQTT.Client("m15.cloudmqtt.com", 33798,"baosight");
    var client;

    $scope.$on('$ionicView.enter', function (ev) {
        if (ev.targetScope !== $scope) {
            $ionicHistory.clearHistory();
            $ionicHistory.clearCache();
        }
    })

    // session check (login section)
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
            $ionicSideMenuDelegate.canDragContent(false);
            // show Loading image
            // sharedUtils.showLoading();
            $rootScope.extras = true;
            // connect
            $rootScope.connect();
            dataService.setUserInfo(user);
            $state.go('tabsController.colorPicker', {});
            // hide Loading image
            // sharedUtils.hideLoading();
        } else {
            dataService.setUserInfo("test");
        }
    });

    //login check ( additional -> connect function)
    $scope.loginsEmail = function (formName, cred) {

        if (formName.$valid) {
            //login --> connect
            // 1.login
            sharedUtils.showLoading();
            firebase.auth().signInWithEmailAndPassword(cred.email, cred.password).then(function (result) {
                    $ionicHistory.nextViewOptions({
                        historyRoot: true
                    });
                    $rootScope.extras = true;
                    $
                    // 2. connect
                    // $rootScope.connect();
                    sharedUtils.hideLoading();
                    $state.go('tabsController.colorPicker', {});
                },
                function (error) {
                    sharedUtils.hideLoading();
                    sharedUtils.showAlert("check", "Authientication Error");
                }
            )
        } else {
            alert("error");
        }
    }


})


app.controller('signupCtrl', function ($scope, $rootScope, sharedUtils, $ionicHistory, $ionicSideMenuDelegate, $state) {


    $scope.signupEmail = function (formName, cred) {
        if (formName.$valid) {
            if (cred.password === cred.re_password) {
                sharedUtils.showLoading();
                firebase.auth().createUserWithEmailAndPassword(cred.email, cred.password).then(function (result) {
                        $ionicHistory.nextViewOptions({
                            historyRoot: true
                        });
                        $ionicSideMenuDelegate.canDragContent(false);
                        $rootScope.extras = true;
                        sharedUtils.hideLoading();
                        $state.go('tabsController.colorPicker', {});
                    }, function (error) {
                        sharedUtils.hideLoading();
                        sharedUtils.showAlert('sing up error');
                    }
                )
            } else {
                sharedUtils.showAlert('invalid password');
            }
        } else {
            sharedUtils.showAlert('value error');
        }
    }
})

app.controller('remoteCtrl', function ($scope, $ionicPopup, listStorage) {

    // 다시 테스트

    // const remote_control_value = 4;
    // $scope.re = [];
    //
    // for (var i = 1; i < remote_control_value ; i++){
    //     var list = {
    //         toggle_name : 'switch0' + i,
    //         model_name : "remote_swtich0" + i,
    //         value : "0"+i
    //     }
    //     $scope.re.push(list);
    // }


    // 갯수만큼 가져오게 x
    // disabled
    // $scope.list = listStorage.get();


    $scope.remote_Switch = function (switch_value) {

        const front_name = "McLighting0";
        const last_name = "/in";
        const hex_code = "#FFFFFF";

        var payload_code = "=off";

        if (switch_value) {
            payload_code = "/0";
        }


        // var payload = new Paho.MQTT.Message("=rainbow");
        // payload.destinationName = "McLighting01/in";
        // client.send(payload);


        // need changed logic
        for (var i = 0; i < $scope.list.length; i++) {
            cordova.plugins.CordovaMqTTPlugin.publish({
                topic: front_name + (i + 1) + last_name,
                payload: payload_code,
                qos: 0,
                retain: false,
                success: function (s) {
                },
                error: function (e) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'error occurred',
                        template: 'Remote Switch Error  Error code : 409'
                    });
                }
            })
        }

        // white change
        if (payload_code === "/0") {
            for (var i = 0; i < $scope.list.length; i++) {
                cordova.plugins.CordovaMqTTPlugin.publish({
                    topic: front_name + (i + 1) + last_name,
                    payload: hex_code,
                    qos: 0,
                    retain: false,
                    success: function (s) {
                    },
                    error: function (e) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'error occurred',
                            template: 'Remote Switch Error Error code : 410'
                        })
                    }
                })
            }
        }
    }


})

// tabs loginCheck
app.controller('tabsCtrl', function ($scope, $rootScope) {

    $scope.login_check = function (test) {
        if ($rootScope.extras) {
            window.location.href = test;
        } else {
            alert("Please login in Firebase")
        }
    }


    // Hide tab (Root)
    $rootScope.tabshide = function () {
        const test = angular.element(document.querySelector('ion-tabs'));
        test.addClass('tabs-item-hide');
    }

    $rootScope.tabsShow = function () {
        const show_tab = angular.element(document.querySelector('ion-tabs'));
        show_tab.removeClass('tabs-item-hide');
    }

})


// -------------- color control start  ----------------

    .controller('ColorCtrl', ['$ionicPopup', '$scope', 'dataService', '$rootScope', '$ionicPlatform', '$cordovaBluetoothSerial', '$ionicModal', '$firebaseArray', '$timeout',
        function ($ionicPopup, $scope, dataService, $rootScope, $ionicPlatform, $cordovaBluetoothSerial, $ionicModal, $firebaseArray, $timeout) {

            var vm = this;
            vm.testColors = '';
            vm.title = 'Light';

            var red = 0;
            var green = 0;
            var blue = 0;
            var color = document.getElementById('color-temp');


            // Html Show Control value
            $scope.rgb_Slider = true; // RGB Slider (Modal)
            $scope.color_Picker = false; // Color Picker Control (Modal)
            $scope.temperature = false; // temperature
            $scope.options = false; // brightness , speed
            $scope.effects = false; // effects
            $scope.onOff = false; // On / Off switch ( /static , /off )

            // effect name init
            $scope.effect_name = "Basic";

            // main tab hide ( 필요없을듯 -> html 들어올때 hide 시킴 ) test
            $rootScope.tabshide();

            // brightness, speed initialize
            if (dataService.getBrightness() == null) {
                $scope.bright_value = 152;
            } else {
                $scope.bright_value = dataService.getBrightness();
            }
            $scope.bright_percent = Math.ceil($scope.bright_value * 0.393);

            if (dataService.getSpeed() == null) {
                $scope.speed_value = 152;
            } else {
                $scope.speed_value = dataService.getSpeed();
            }
            $scope.speed_percent = Math.ceil($scope.speed_value * 0.393);

            // tabs Control (Main , Light, Effect, Options)
            $scope.go_Main = function () {
                $rootScope.tabsShow();
                window.location.href = "/#/page1/page2";
            }

            $scope.show_Light = function () {
                $scope.rgb_Slider = true;
                $scope.effects = false;
                $scope.options = false;
                vm.title = 'Light';
            }

            $scope.show_Effect = function () {
                $scope.rgb_Slider = false;
                $scope.effects = true;
                $scope.options = false;
                vm.title = 'Effect';
            }

            $scope.show_Options = function () {
                $scope.rgb_Slider = false;
                $scope.effects = false;
                $scope.options = true;
                vm.title = 'Options';
            }

// bright control function...
            $scope.brightdrag = function (topic_name, bright_value) {

                var brightness_value = "%" + bright_value;

                console.log("bright : " + brightness_value + "   topic : " + topic_name);

                var payload = new Paho.MQTT.Message(brightness_value);
                payload.destinationName = topic_name;
                client.send(payload);

                //send service.js
                dataService.setBrightness(bright_value);
                //
                $scope.bright_percent = Math.floor(bright_value * 0.393);

                console.log($scope.bright_percent);

            };

// speed Control function...
            $scope.speed_check = function (topic_name, speed_value) {

                var speed_values = "?" + speed_value;

                console.log("speed : " + speed_value + "topic : " + topic_name);


                var payload = new Paho.MQTT.Message(speed_values);
                payload.destinationName = topic_name;
                client.send(payload);

                $scope.speed_percent = Math.floor(speed_value * 0.393);
            };


            $scope.lightTest = function (topic_name, hexCode) {
                var payload = new Paho.MQTT.Message(hexCode);
                payload.destinationName = topic_name;
                client.send(payload);
            }

            $scope.led_Light = function (topic_name, hex_code, css_code) {

                const absolute_Effect = ['Running', 'Christmas', 'Rainbow', 'Halloween', 'Wipe'];
                var flag = true;

                for (var i = 0; i < absolute_Effect.length; i++) {
                    if ($scope.effect_name === absolute_Effect[i]) {
                        flag = false;
                    }
                }

                // effect check
                if (flag) {
                    $scope.opacity_check = hex_code;
                    const white_hex = '#ffffff';
                    // bulb color change
                    const css_var = angular.element(document.querySelector(css_code));
                    css_var.css('text-shadow', '0 0 10px' + white_hex + ',' + '0 0 30px' + white_hex + ',' + '0 0 50px' + hex_code
                        + ',' + '0 0 90px' + hex_code + ',' + '0 0 150px' + hex_code);
                    // 통합 할 것!
                    try {
                        var payload = new Paho.MQTT.Message(hex_code);
                        payload.destinationName = topic_name;
                        client.send(payload);

                        // firebase control (delay)

                        var user = firebase.auth().currentUser;
                        var ref = firebase.database().ref(user.uid + '/ LED Control Room');
                        $scope.effect_list = $firebaseArray(ref);


                        $scope.effect_list.$loaded().then(function () {
                            var item = $scope.effect_list.$keyAt($scope.effect_list[0]);
                            var item_number = $scope.effect_list.$indexFor(item);
                            console.log("item : " + item);
                            console.log("item_number : " + item_number);
                            console.log("topic : " + topic_name);
                            console.log(" ------------- test start ------------");

                            for (let i = 0 ; i < $scope.effect_list.length - 1; i++){
                                console.log($scope.effect_list.$keyAt($scope.effect_list[i]));
                            }



                        })



                    } catch (e) {
                        console.log("error message : " + e.message);
                    }
                } else {
                    var ionicAlert = $ionicPopup.alert({
                        title: "error",
                        template: "Please check effect. You can choose only relative effect."
                    });
                }
            }

            $scope.test_bulb = function(){

                const user = firebase.auth().currentUser;
                const ref = firebase.database().ref(user.uid + '/ LED Control Room');
                const var_ref = $firebaseArray(ref);

                var_ref.$loaded(function(){
                    console.log("ref : " + var_ref[0]['title']);
                    var_ref[0]['title'] = "test1";
                    var_ref.$save(0);

                })







            }

            // LED EFFECT
            $scope.led_effect = function (topic_name, effect_code) {

                console.log(" t : " + topic_name + " e : " + effect_code);

                switch (effect_code) {
                    case "/0":
                        $scope.effect_name = "Basic";
                        break;
                    case "/1":
                        $scope.effect_name = "Blink";
                        break;
                    case "/2":
                        $scope.effect_name = "Breath";
                        break;
                    case "/7":
                        $scope.effect_name = "Wipe";
                        break;
                    case "/11":
                        $scope.effect_name = "Rainbow";
                        break;
                    case "/42":
                        $scope.effect_name = "Running";
                        break;
                    case "/43":
                        $scope.effect_name = "Chase";
                        break;
                    case "/47":
                        $scope.effect_name = "Christmas";
                        break;
                    case "/52":
                        $scope.effect_name = "Halloween";
                        break;
                    case "/54":
                        $scope.effect_name = "TriColor";
                        break;
                    default :
                        $scope.effect_name = "default";
                }


                var payload = new Paho.MQTT.Message(effect_code);
                payload.destinationName = topic_name;
                client.send(payload);

            }


// rgb Color ConnectCheck

            // $scope.connectCheck = function () {
            //
            //     var connectValue = dataService.getConnectValue();
            //     console.log(" connection value : " + connectValue);
            //     var flag = true;
            //
            //     if (connectValue !== 1) {
            //         flag = false;
            //     }
            //     return flag;
            // }

            // Color Picker Modal function
            // $ionicModal.fromTemplateUrl('colorPalette', {
            //     scope: $scope
            // }).then(function (modal) {
            //     $scope.modal = modal;
            // });

            // Color Picker function...

            // $scope.palette_color = function (hexCode, value) {
            //
            //     // bright 255 fix
            //     var brightness_value = "%255";
            //     // topic name var
            //     var topic_name = value;
            //     console.log("hex : " + hexCode);
            //     console.log("bright : " + brightness_value + "topic : " + topic_name);
            //
            //     var arrayload = [hexCode, brightness_value];
            //
            //     for (var i = 0; i < arrayload.length; i++) {
            //         var payload = new Paho.MQTT.Message(arrayload[i]);
            //         payload.destinationName = topic_name;
            //         client.send(payload);
            //     }
            // };

// static , blink
//             $scope.color_change_test = function (value, value2) {
//
//                 var color_value = "/" + value;
//                 var topic_name = value2;
//
//                 console.log("color : " + color_value + "topic : " + topic_name);
//
//                 const payload = new Paho.MQTT.Message(color_value);
//                 payload.destinationName = topic_name;
//                 client.send(payload);
//
//             }


            // rgb Color Control

            // $scope.set = function (value) {
            //
            //     var topic_name = value;
            //
            //     console.log("topic : " + topic_name);
            //
            //     // Convert to HEXcode
            //     // if ($scope.connectCheck()) {
            //
            //     var rgbArray = [vm.testColors.r, vm.testColors.g, vm.testColors.b];
            //     vm.hexCode = "#";
            //
            //
            //     for (var i = 0; i < rgbArray.length; i++) {
            //         if (rgbArray[i] < 16) {
            //             vm.hexCode += "0" + rgbArray[i].toString(16);
            //         } else {
            //             vm.hexCode += (rgbArray[i]).toString(16);
            //         }
            //     }
            //     dataService.setColor(vm.hexCode);
            //
            //     var payload = new Paho.MQTT.Message(vm.hexCode);
            //     payload.destinationName = topic_name;
            //     client.send(payload);
            //
            //     // } else {
            //     //     alert("Check your network connection status error code : 404");
            //     // }
            //
            // };


            // // temperature rgb
            // $scope.drag = function (value, value2) {
            //
            //     $scope.rangeValue = value;
            //
            //     // ColorTemperature to RGB
            //     var temperature = value / 100.0;
            //     var red, green, blue;
            //
            //     if (temperature < 66.0) {
            //         red = 255;
            //     } else {
            //         red = temperature - 55.0;
            //         red = 351.97690566805693 + 0.114206453784165 * red - 40.25366309332127 * Math.log(red);
            //         if (red < 0) red = 0;
            //         if (red > 255) red = 255;
            //     }
            //
            //     /* Calculate green */
            //
            //     if (temperature < 66.0) {
            //         green = temperature - 2;
            //         if (green < 0) {
            //             green = 0;
            //         }
            //         green = -155.25485562709179 - 0.44596950469579133 * green + 104.49216199393888 * Math.log(green);
            //
            //         if (green < 0) {
            //             green = 0;
            //         }
            //         if (green > 255) {
            //             green = 255;
            //         }
            //
            //     } else {
            //         green = temperature - 50.0;
            //         green = 325.4494125711974 + 0.07943456536662342 * green - 28.0852963507957 * Math.log(green);
            //         if (green < 0) green = 0;
            //         if (green > 255) green = 255;
            //
            //     }
            //
            //     /* Calculate blue */
            //
            //     if (temperature >= 66.0) {
            //         blue = 255;
            //     } else {
            //
            //         if (temperature <= 20.0) {
            //             blue = 0;
            //         } else {
            //             blue = temperature - 10;
            //             blue = -254.76935184120902 + 0.8274096064007395 * blue + 115.67994401066147 * Math.log(blue);
            //             if (blue < 0) blue = 0;
            //             if (blue > 255) blue = 255;
            //         }
            //     }
            //
            //     $scope.rgb = {r: Math.round(red), g: Math.round(green), b: Math.round(blue)};
            //     dataService.setColor($scope.rgb);
            //     vm.testColors = $scope.rgb;
            //
            //     var rgb_array = [$scope.rgb.r, $scope.rgb.g, $scope.rgb.b];
            //     var hexcode = "#";
            //     var topic_name = value2;
            //
            //
            //     //console.log
            //     console.log("range : " + $scope.rangeValue + "  topic : " + topic_name);
            //
            //     for (var i = 0; i < rgb_array.length; i++) {
            //         if (rgb_array[i] < 16) {
            //             hexcode += 0 + rgb_array[i].toString(16);
            //         } else {
            //             hexcode += rgb_array[i].toString(16);
            //         }
            //     }
            //     Cordova_connect(hexcode, topic_name);
            // }
            //
            //
            // function Cordova_connect(hex_code, topic_name) {
            //     const payload = new Paho.MQTT.Message(hex_code);
            //     payload.destinationName = payload;
            //     client.send(payload);
            // };

        }]);

app.controller('guideCtrl', function ($scope, $ionicModal, guideCheck, $timeout, $ionicSlideBoxDelegate, listStorage) {
    $ionicModal.fromTemplateUrl('guideForm', {
        scope: $scope
    }).then(function (modal) {
        $scope.modal = modal;
    })

    $scope.$on('skipChecked', function () {

        var check = listStorage._getFromLocalStorage("show_data");

        console.log("show value check : " + check);

        if (check.length === 0) {
            check = false;
        }

        check = false; // guide ui check test

        if (check) {
            $scope.modal.hide();
        } else {
            $scope.modal.show();
        }
    })

    $timeout(function () {
        guideCheck.openModal();
    }, 500);

    $scope.swiperOptions = { /* Whatever options */
        effect: 'slide',
        initialSlide: 0, /* Initialize a scope variable with the swiper */
        onInit: function (swiper) {
            $scope.swiper = swiper;
        },
        onSlideChangeEnd: function (swiper) {
            console.log('The active index is ' + swiper.activeIndex);
        }
    };

    // intro modal show check
    $scope.showCheck = function (checked) {
        listStorage._setToLocalStorage("show_data", checked);
    }


})

app.controller('settings', function ($scope, $ionicPopup, $firebaseObject, $firebaseArray, listStorage, dataService, $interval) {

    // Password Change

    $scope.dataService = dataService;

    $scope.pwChange = function () {

        var user = firebase.auth().currentUser;

        var confirmPopup = $ionicPopup.confirm({
            title: 'Password change',
            template: 'Are you sure you want to change your password?'
        });

        confirmPopup.then(function (res) {
            if (res) {
                $scope.users = {};

                var showPopup = $ionicPopup.show({
                    template: '<input type = "password" placeholder="Current Password" ng-model = "users.oldPassword"> <br/> ' + ' <input type = "password" placeholder="New Password" ng-model = "users.newPassword">',
                    title: "insert to your account password and New Password",
                    scope: $scope,
                    buttons: [
                        {text: 'cancel'},
                        {
                            text: 'Change',
                            // type :
                            onTap: function (e) {
                                console.log("oPw : " + $scope.users.oldPassword);
                                if (!$scope.users.oldPassword && !$scope.users.newPassword) {
                                    alert("Empty Password Text");
                                } else {
                                    return $scope.users;
                                }
                            }

                        }
                    ]
                })

                showPopup.then(function (users) {
                    var credential = firebase.auth.EmailAuthProvider.credential(user.email, users.oldPassword);

                    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                        user.updatePassword(users.newPassword).then(function () {
                            alert("Password change Success");
                        }).catch(function (error) {
                            alert(error.message);
                        })
                    })
                })
            }
        })
    }

    // Account Delete
    $scope.delAccount = function () {
        var user = firebase.auth().currentUser;

        var confirmPopup = $ionicPopup.confirm({
            title: 'Warning',
            template: 'Are you sure you want to delete your account?'
        });

        // confirm check
        confirmPopup.then(function (res) {
            if (res) {
                $scope.user = {};
                // insert password
                var showPopup = $ionicPopup.show({
                    template: '<input type="password" ng-model="user.password">',
                    title: "insert to your account password",
                    scope: $scope,
                    buttons: [
                        {text: 'cancel'},
                        {
                            text: '<b>Delete</b>',
                            // type : 'button-',
                            onTap: function (e) {
                                if (!$scope.user.password) {
                                    alert("Empty Password");
                                } else {
                                    return $scope.user.password;
                                }
                            }
                        }
                    ]
                });

                showPopup.then(function (password) {

                    var credential = firebase.auth.EmailAuthProvider.credential(user.email, password)

                    user.reauthenticateAndRetrieveDataWithCredential(credential).then(function () {
                        user.delete().then(function () {

                            var ref = firebase.database().ref('LED Control List / ' + user.uid);
                            var lists = $firebaseArray(ref);

                            lists.$loaded().then(function () {
                                for (var i = 0; i < lists.length; i++) {
                                    lists.$remove(lists[i]).then(function (ref) {

                                        const list_id = lists.$keyAt(lists[0]);
                                        const list_number = lists.$indexFor(list_id);
                                        const local_list = listStorage.get("list_data");
                                        local_list.splice(list_number, 1);
                                        listStorage._setToLocalStorage("list_data", local_list);

                                    })
                                }
                                dataService.setConnectValue(0);
                                window.location.href = '#/page1/page10';
                            });
                            alert("Delete Complete");
                            $scope.refresh();
                        }).catch(function (error) {
                            alert(error.message);
                        })
                    }).catch(function (error) {
                        alert(error.message);
                    });
                })
            } else {
            }
        })
    }

    $scope.test1 = function () {


    }

    $scope.refresh = function () {
        $interval(function () {
            console.log("account test");
        }, 500, 1);
    }
})

//
// lists.$remove(item)
//     .then(function (ref) {
//         // localStorage section
//         // local_list.splice(list_number, 1);
//         // listStorage._setToLocalStorage("list_data", local_list);
//     });





