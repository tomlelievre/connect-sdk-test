# connect-sdk-test

A demonstration project to learn how to use [ConnectSDK](http://connectsdk.com/) with [Ionic](http://ionicframework.com/) in order to communicate with Chromecasts™.

## Make it works

*You must have Ionic, Android 5.1.1 (API 22) and Android SDK Build-tools 22.0.1 installed.*

Just a `cd connect-sdk-test; ionic state reset` will do the job!

In this project there is two examples:
 - How to beam a media ([www/js/app_beam_media.js](https://github.com/tomlelievre/connect-sdk-test/blob/master/www/js/app_beam_media.js))
 - How to beam a web app ([www/js/app_beam_webapp.js](https://github.com/tomlelievre/connect-sdk-test/blob/master/www/js/app_beam_webapp.js))
 
In order to switch the example, you have to change it in [www/index.html](https://github.com/tomlelievre/connect-sdk-test/blob/master/www/index.html) line 23.

If you choose the web app example, you need to inform your web app id to make it works with your custom receiver web app ([www/js/app_beam_webapp.js](https://github.com/tomlelievre/connect-sdk-test/blob/master/www/js/app_beam_webapp.js) line 47).
