'use strict';
define(['ojs/ojcore', 'knockout', 'jquery', 'appController',
        'ojs/ojrouter',
        'ojs/ojknockout',
        'ojs/ojcheckboxset',
        'ojs/ojinputtext',
        'ojs/ojbutton',
        'ojs/ojanimation'], function(oj, ko, $, app) {
  function loginViewModel() {
    var self = this;

    self.handleTransitionCompleted = function(info) {
      var animateOptions = { 'delay': 0, 'duration': '1s', 'timingFunction': 'ease-out' };
      oj.AnimationUtils['fadeIn']($('.demo-signin-bg')[0], animateOptions);
    }

    // Replace with state save logic for rememberUserName
    self.userName = ko.observable('daniel');
    self.passWord = ko.observable('123');
    self.rememberUserName = ko.observable(['remember']);

    // Replace with sign in authentication
    self.signIn = function() {      
      app.pushClient.registerForNotifications(self.userName(), self.passWord());
    };

  }
  return loginViewModel;
});