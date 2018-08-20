/**
  Copyright (c) 2015, 2018, Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/

'use strict';

module.exports = function (configObj) {
	configObj.platform = "android";
	console.log('configObj::', configObj);
  return new Promise((resolve, reject) => {
  	console.log("Running before_serve hook.");
  	resolve();
  });
};
