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
         ==========================
         PICK DEVICE AND CAST MEDIA
         ==========================
         */

        var vm = this;
        var myLaunchSession, myMediaControl = null;

        vm.cast = function () {
            ConnectSDK.discoveryManager.pickDevice()
                .success(function (device) {

                    if (!device.hasService(ConnectSDK.Services.Chromecast)) {
                        console.log('No Chromecast found in the surrounding area!');
                        return;
                    }

                    if (!device.isReady()) {
                        console.log('Device not yet ready!');
                        device.on('ready', launchVideo(device));
                        device.connect();
                    } else {
                        launchVideo(device)
                    }
                })
                .error(function (err) {
                    console.log("Chromecast pick error!");
                    console.log(JSON.stringify(err));
                });
        };

        function launchVideo(device) {
            var videoUrl = 'http://media.w3.org/2010/05/bunny/trailer.mp4';
            var videoMimeType = 'video/mp4';

            device.getMediaPlayer().playMedia(videoUrl, videoMimeType)
                .success(function (launchSession, mediaControl) {
                    console.log("Video successfully launched.");

                    myLaunchSession = launchSession && launchSession.acquire();
                    myMediaControl = mediaControl && mediaControl.acquire();
                })
                .error(function (err) {
                    console.log('Video launch error!');
                    console.log(JSON.stringify(err));
                });
        }

        /*
         =============
         CONTROL MEDIA
         =============
         */

        vm.disconnect = function () {
            if (myLaunchSession) {
                myLaunchSession.close();
                console.log('Disconnection of the Chromecast.');
            }
        };

        vm.play = function () {
            if (myMediaControl) {
                myMediaControl.play();
                console.log('Video launched.');
            }
        };

        vm.pause = function () {
            if (myMediaControl) {
                myMediaControl.pause();
                console.log('Video paused.');
            }
        };

        vm.seek = function () {
            if (myMediaControl) {
                myMediaControl.seek(10);
                console.log('Video seeked to 10 sec.');
            }
        };
    });
