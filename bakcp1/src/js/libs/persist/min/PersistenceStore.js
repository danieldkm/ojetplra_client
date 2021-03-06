/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define([],function(){"use strict";var a=function(a){this._name=a};return a.prototype={},a.prototype.getName=function(){return this._name},a.prototype.getVersion=function(){return this._version},a.prototype.Init=function(a){return a&&a.version?this._version=a.version:this._version="0",Promise.resolve()},a.prototype.upsert=function(a,b,c,d){throw TypeError("failed in abstract function")},a.prototype.upsertAll=function(a){throw TypeError("failed in abstract function")},a.prototype.find=function(a){throw TypeError("failed in abstract function")},a.prototype.findByKey=function(a){throw TypeError("failed in abstract function")},a.prototype.removeByKey=function(a){throw TypeError("failed in abstract function")},a.prototype.delete=function(a){throw TypeError("failed in abstract function")},a.prototype.keys=function(){throw TypeError("failed in abstract function")},a});
//# sourceMappingURL=PersistenceStore.js.map