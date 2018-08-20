'use strict';

define(['jquery'
        ,'dataService'
        ,'appConfig'
        ,'jsencrypt'
        ,'node-rsa'], function ($, data, appConfig, JSEncrypt, rrrr) {

  function PushClient(app) {
    var self = this;
    // var t = new NodeRSA;
    console.log('nodersa', rrrr);
    var platforms = navigator.userAgent.match(/(iPhone|iPad|iPod|Android|MSAppHost)/i);
    self.platform = platforms ? platforms[0] : null;
    if(self.platform ) {
      if(self.platform.substring(0,1) == 'i'){
        self.platform = "IOS"
      } else if(self.platform && self.platform.substring(0,1) == 'A'){
        self.platform = "ANDROID"
      } else if(self.platform && self.platform.substring(0,1) == 'M'){
        self.platform = "WINDOWS"
      }
    }

    self.providers = {
      'IOS': 'APNS',
      'ANDROID': 'GCM',
      'WINDOWS': 'WNS',
      'WEB': 'SYNIVERSE'
    }

    _initPush();


    function _initPush() {
      // get notificationToken from serviceWorker registration
      if('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(function(registration) {
          registration.pushManager.subscribe({userVisibleOnly: true})
            .then(function (subscription) {
              self.notificationToken = subscription.endpoint.split('/').pop();
              // servicework uses GCM so set android as platform
              self.platform = 'ANDROID';
            })
            .catch(function (e) {
              if(Notification.permission === 'denied') {
                console.log('notification permission denied')
              } else {
                console.error(e);
              }
            })
        })
      }

      // initialise PushNotification plugin
      if(window.PushNotification) {
        self.push = PushNotification.init({
            "android": {
              senderID: appConfig.senderID,
              clearBadge: "true"
            },
            "browser": {
              pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            },
            "ios": {
              clearBadge: "true",
              alert: "true",
              badge: "true",
              sound: "true"
            },
            "windows": {}
          });
        self.push.on('registration', function (data) {
          // update regId
          self.notificationToken = data.registrationId;
        });
        self.push.on('notification', function (data) {
          // TODO go to incidents list on click

          // Set badge in nav drawer
          app.unreadIncidentsNum(data.count);

          // Set badge on app icon
          self.push.setApplicationIconBadgeNumber(function() {
          }, function() {
              console.error('Setting Badge Number Error');
          }, data.count);
        });
      }
    }

    // register notification with MCS backend
    self.registerForNotifications = function (user, pass) {

      // TODO verify whether authentication is needed

      var registration = {
        'notificationToken': self.notificationToken,
        'mobileClient': {
          'id': appConfig.appId,
          'version': appConfig.appVersion,
          'platform': self.platform
        },
        'notificationProvider': self.providers[self.platform]
      }

      var send = {
        userName: user,
        passWord: pass
      }
      console.log('user', send)

      // uncomment the following after setting up the MCS backend and senderID in appConfigExternal.js
      data.registerForNotifications(send).then(function (response) {
        console.log('Registering Notifications Success: ', response);
        if(response.success){
          localStorage.token = response.token;
          localStorage.isAuthenticated = true;
          oj.Router.rootInstance.go('initialize/QRCode');
        }
      }).fail(function (response) {
        localStorage.isAuthenticated = false;
        console.error('Registering Notifications Fail: ', response);
      })

      

//       var crypt = new JSEncrypt.JSEncrypt();
//       $.get('mykey/rsa_1024_pub.pem', function(key) {
          
//           // const rsa = new NodeRSA(key);
//           // console.log('rsa', rsa);
// //sign.sign($('#input').val(), CryptoJS.SHA256, "sha256")
//           window.crypto.subtle.encrypt(
//               {
//                   name: "RSA-OAEP",
//                   //label: Uint8Array([...]) //optional
//               },
//               key, //from generateKey or importKey above
//               pass //ArrayBuffer of data you want to encrypt
//           )
//           .then(function(encrypted){
//               //returns an ArrayBuffer containing the encrypted data
//               console.log(new Uint8Array(encrypted));

//               var send = {
//                 userName: user,
//                 passWord: pass,
//                 teste: encrypted
//               }
//               console.log('user', send)

//               // uncomment the following after setting up the MCS backend and senderID in appConfigExternal.js
//               data.registerForNotifications(send).then(function (response) {
//                 console.log('Registering Notifications Success: ', response);
//                 if(response.success){
//                   localStorage.token = response.token;
//                   localStorage.isAuthenticated = true;
//                   oj.Router.rootInstance.go('initialize/QRCode');
//                 }
//               }).fail(function (response) {
//                 localStorage.isAuthenticated = false;
//                 console.error('Registering Notifications Fail: ', response);
//               })

//           })
//           .catch(function(err){
//               console.error(err);
//           });
//       });
      
    }

  }

  return PushClient;
})
