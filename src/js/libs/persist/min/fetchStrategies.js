/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(["./persistenceManager","./persistenceUtils","./impl/defaultCacheHandler","./impl/logger"],function(a,b,c,d){"use strict";function e(d){d=d||{};var e=d.serverResponseCallback;return e||(e=function(a,b){return Promise.resolve(b)}),function(d,f){if(e)var g=function(d,g){var h=b.buildEndpointKey(d);c.registerEndpointOptions(h,f);var i={};return b._cloneResponse(g).then(function(a){return e(d,a)}).then(function(b){return i.resolvedResponse=b,a.getCache().hasMatch(d,{ignoreSearch:!0})}).then(function(e){return new Promise(function(c,f){var g=i.resolvedResponse.clone();if(e){if(!(null==i.resolvedResponse||b.isCachedResponse(i.resolvedResponse)||"GET"!=d.method&&"HEAD"!=d.method))return a.getCache().put(d,i.resolvedResponse).then(function(){c(g)});c(g)}else c(g)}).then(function(a){return c.unregisterEndpointOptions(h),Promise.resolve(a)})})};return i(d,f,g)}}function f(){return function(c,e){return a.isOnline()?new Promise(function(f,h){a.browserFetch(c).then(function(a){if(!a.ok)return g(c,a,e);b._cloneResponse(a).then(function(a){f(a)})},function(a){d.log(a),i(c,e).then(function(a){f(a)},function(a){h(a)})}).then(function(a){a&&f(a)}).catch(function(a){h(a)})}):i(c,e)}}function g(a,b,c){return new Promise(function(d,e){b.status<500?d(b):i(a,c).then(function(a){d(a)},function(a){e(a)})})}function h(b){return a.getCache().match(b,{ignoreSearch:!0})}function i(b,c,d){return new Promise(function(e,f){k(b,c).then(function(c){c?(e(c.clone()),j(b,d)):h(b).then(function(c){c?(e(c),j(b,d)):a.browserFetch(b).then(function(a){var c=a.clone();e(c),d&&d(b,a)},function(a){var b={status:503,statusText:"No cached response exists"};e(new Response(null,b))})})})})}function j(c,d){d&&a.browserFetch(c).then(function(a){b._cloneResponse(a).then(function(a){d(c,a)})})}function k(a,b){var c=l(b);return null==c?Promise.resolve():c(a,b)}function l(a){var b=null;return null!=a.queryHandler&&(b=a.queryHandler),b}return{getCacheFirstStrategy:e,getCacheIfOfflineStrategy:f}});
//# sourceMappingURL=fetchStrategies.js.map