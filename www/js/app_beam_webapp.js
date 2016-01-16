// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                // for form inputs)
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

                // Don't remove this line unless you know what you are doing. It stops the viewport
                // from snapping when text inputs are focused. Ionic handles this internally for
                // a much nicer keyboard experience.
                cordova.plugins.Keyboard.disableScroll(true);
            }

            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            /*
             ===========================
             START THE DISCOVERY MANAGER
             ===========================
             */

            if (window.ConnectSDK && window.ConnectSDK.discoveryManager) {
                ConnectSDK.discoveryManager.startDiscovery();
            }
        });
    })
    .controller('DefaultCtrl', function () {

        /*
         ========================
         LAUNCH WEB APP ON DEVICE
         ========================
         */

        var vm = this;
        var myWebAppSession = null;
        // Custom Receiver Application ID
        var webAppId = 'XXXXXXXX';

        vm.cast = function () {
            ConnectSDK.discoveryManager.pickDevice()
                .success(function (device) {

                    if (!device.hasService(ConnectSDK.Services.Chromecast)) {
                        console.log('No Chromecast found in the surrounding area!');
                        return;
                    }

                    if (!device.isReady()) {
                        console.log('Device not yet ready!');
                        device.on('ready', launchReceiverApp(device));
                        device.connect();
                    } else {
                        launchReceiverApp(device);
                    }
                })
                .error(function (err) {
                    console.log("An error occured during the Chromecast picking!");
                    console.log(JSON.stringify(err));
                });
        };

        function launchReceiverApp(device) {
            device.getWebAppLauncher().launchWebApp(webAppId)
                .success(function (webAppSession) {
                    myWebAppSession = webAppSession.acquire();

                    myWebAppSession.connect()
                        .success(function () {
                            console.log('Web app connect success.');
                        })
                        .error(function (err) {
                            console.log('Web app connect error!');
                            console.log(JSON.stringify(err));
                        });

                    myWebAppSession.on('message', function (message) {
                        console.log('Received message from web app:' + JSON.stringify(message));
                    });

                    myWebAppSession.on('disconnect', function () {
                        myWebAppSession.release();
                        myWebAppSession = null;
                    });
                })
                .error(function (err) {
                    console.log('Web app launch error!');
                    console.log(JSON.stringify(err));
                });
        }

        /*
         ================================
         SEND MESSAGE TO RECEIVER WEB APP
         ================================
         */

        vm.sendMessage = function () {
            if (myWebAppSession) {
                myWebAppSession.sendText(vm.message);
                //myWebAppSession.sendJSON({message: vm.message});
                console.log('Message "' + vm.message + '" sended!');
            }
        };

        /*
         ================================
         DISCONNECT FROM RECEIVER WEB APP
         ================================
         */

        vm.disconnect = function () {
            if (myWebAppSession) {
                myWebAppSession.disconnect();
                myWebAppSession.close();
                console.log('Web app exited.');
            }
        };
    });
