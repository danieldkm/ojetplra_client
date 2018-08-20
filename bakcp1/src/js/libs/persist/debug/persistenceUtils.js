/**
 * @license
 * Copyright (c) 2014, 2018, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/**
 * Copyright (c) 2018, Oracle and/or its affiliates.
 * All rights reserved.
 */

define([], function () {
  'use strict';
  
  /**
   * @class persistenceUtils
   * @classdesc Provide various utilities for converting Request/Response objects
   * to JSON.
   * @export
   */
  
  /**
   * Return whether the Response is a cached Response
   * @method
   * @name isCachedResponse
   * @memberof! persistenceUtils
   * @instance
   * @param {Response} response Response object
   * @return {boolean} Returns whether it's a cached Response
   */
  function isCachedResponse(response) {
    return response.headers.has('x-oracle-jscpt-cache-expiration-date');
  };
  
  /**
   * Return whether the Response has a generated ETag
   * @method
   * @name isGeneratedEtagResponse
   * @memberof! persistenceUtils
   * @instance
   * @param {Response} response Response object
   * @return {boolean} Returns whether it has a generated ETag
   */
  function isGeneratedEtagResponse(response) {
    return response.headers.has('x-oracle-jscpt-etag-generated');
  };
  
  function _isTextPayload(headers) {

    var contentType = headers.get('Content-Type');

    if (contentType &&
      (contentType.indexOf('text/') !== -1 ||
       contentType.indexOf('application/json') !== -1)) {
      return true;
    }
    return false;
  };
  
  function _isMultipartPayload(headers) {

    var contentType = headers.get('Content-Type');

    return (contentType &&
            contentType.indexOf('multipart/') !== -1);
  };

  /**
   * Return a JSON object representing the Request object
   * @method
   * @name requestToJSON
   * @memberof! persistenceUtils
   * @instance
   * @param {Request} request Request object
   * @return {Promise} Returns a Promise which resolves to the JSON object
   * representing the Request
   */
  function requestToJSON(request, options) {
    if (!options || !options._noClone) {
      request = request.clone();
    }
    var requestObject = {};
    _copyProperties(request, requestObject, ['body', 'headers', 'signal']);
    requestObject['headers'] = _getHeaderValues(request.headers);
    return _copyPayload(request, requestObject);
  };
  
  function _copyProperties(sourceObj, targetObj, ignoreProps) {
    for (var k in sourceObj) {
      if (typeof (sourceObj[k]) !== 'function' &&
        !_isPrivateProperty(k) &&
        ignoreProps.indexOf(k) === -1) {
        // we check for underscore too because the fetch polyfill uses
        // underscores for private props.
        targetObj[k] = sourceObj[k];
      }
    }
  };
  
  function _isPrivateProperty(property) {
    return property.indexOf('_') === 0;
  };
  
  function _getHeaderValues(headers) {
    var headersData = {};
    if (headers.entries) {
      var headerEntriesIter = headers.entries();
      var headerEntry;
      var headerName;
      var headerValue;

      do {
        headerEntry = headerEntriesIter.next();

        if (headerEntry['value']) {
          headerName = headerEntry['value'][0];
          headerValue = headerEntry['value'][1];
          headersData[headerName] = headerValue;
        }
      } while (!headerEntry['done']);
    } else if (headers.forEach) {
      // Edge uses forEach
      headers.forEach(function (headerValue, headerName) {
        headersData[headerName] = headerValue;
      })
    }
    _addDateHeaderIfNull(headersData);
 
    return headersData;
  };
  
  function _addDateHeaderIfNull(headersData) {
    // Date is not exposed for CORS request/response
    var date = headersData['date'];

    if (!date) {
      date = (new Date()).toUTCString();
      headersData['date'] = date;
    }
  };

  function _copyPayload(source, targetObj) {
    targetObj.body = {};
    
    if ((source instanceof Request) &&
        _isMultipartPayload(source.headers)) {
      return _copyMultipartPayload(source, targetObj);
    }

    if ((source instanceof Request) ||
        _isTextPayload(source.headers)) {
      return new Promise(function (resolve, reject) {
        source.text().then(function (text) {
          targetObj.body.text = text;
          resolve(targetObj);
        });
      });
    }

    if (!(source instanceof Request) && 
        typeof(source.arrayBuffer) === 'function') {
      return new Promise(function (resolve, reject) {
        source.arrayBuffer().then(function (aBuffer) {
          if (aBuffer.length > 0) {
            targetObj.body.arrayBuffer = aBuffer;
          }
          resolve(targetObj);
        }).catch(function (abError) {
          reject(abError);
        });
      });
    }

    return Promise.reject(new Error({message: 'payload body type is not supported'}));
  };
  
  function _copyMultipartPayload(request, targetObj) {
    if (typeof(request.formData) === 'function') {
      return new Promise(function (resolve, reject) {
        request.formData().then(function (formData) {
          var formDataPairObject = {};
          var formDataIter = formData.entries();
          var formDataEntry;
          var formDataEntryValue;
          var formDataName;
          var formDataValue;

          do {
            formDataEntry = formDataIter.next();
            formDataEntryValue = formDataEntry['value'];

            if (formDataEntryValue) {
              formDataName = formDataEntryValue[0];
              formDataValue = formDataEntryValue[1];
              formDataPairObject[formDataName] = formDataValue;
            }
          } while (!formDataEntry['done']);
          
          targetObj.body.formData = formDataPairObject;
          resolve(targetObj);
        }).catch(function (err) {
          reject(err);
        });
      });
    } else {
      var contentType = request.headers.get('Content-Type');
      return new Promise(function (resolve, reject) {
        request.text().then(function (text) {
          var parts = parseMultipartFormData(text, contentType);
          var formDataPairObject = {};
          for (var index = 0; index < parts.length; index++) {
            formDataPairObject[parts[index].headers.name] = parts[index].data;
          }
          targetObj.body.formData = formDataPairObject;
          resolve(targetObj);
        }).catch(function (err) {
          reject(err);
        });
      });
    }
  };

  /**
   * Return a JSON object representing the Response object
   * @method
   * @name responseToJSON
   * @memberof! persistenceUtils
   * @instance
   * @param {Response} response Response object
   * @param {{excludeBody: boolean}=} options Options
   * <ul>
   * <li>options.excludeBody Whether to exclude body from generating the JSON object or not.</li>
   * </ul>
   * @return {Promise} Returns a Promise which resolves to the JSON object
   * representing the Response
   */
  function responseToJSON(response, options) {
    if (!options || !options._noClone) {
      response = response.clone();
    }
    var responseObject = {};
    _copyProperties(response, responseObject, ['body', 'headers']);
    responseObject['headers'] = _getHeaderValues(response.headers);
    if (options && options.excludeBody) {
      return Promise.resolve(responseObject);
    } else {
      return _copyPayload(response, responseObject);
    }
  };

  /**
   * Return a Request object constructed from the JSON object returned by 
   * requestToJSON
   * @method
   * @name requestFromJSON
   * @memberof! persistenceUtils
   * @instance
   * @param {Object} data JSON object returned by requestToJSON
   * @return {Promise} Returns a Promise which resolves to the Request
   */
  function requestFromJSON(data) {
    var initFromData = {};
    _copyProperties(data, initFromData, ['headers', 'body', 'signal']);
    var skipContentType = _copyPayloadFromJsonObj(data, initFromData);
    initFromData.headers = _createHeadersFromJsonObj(data, skipContentType);

    return _createRequestFromJsonObj(data, initFromData);
  };
  
  function _copyPayloadFromJsonObj(data, targetObj) {
    var skipContentType = false;
    var body = data.body;
    
    if (body.text && body.text.length > 0) {
      targetObj.body = body.text;
    } else if (body.arrayBuffer) {
      targetObj.body = body.arrayBuffer;
    } else if (body.formData) {
      skipContentType = true;
      var formData = new FormData();
      var formPairs = body.formData;
      Object.keys(formPairs).forEach(function (pairkey) {
        formData.append(pairkey, formPairs[pairkey]);
      });
      targetObj.body = formData;
    }

    return skipContentType;
  };
  
  function _createHeadersFromJsonObj(data, skipContentType) {
    var headers = new Headers();
    Object.keys(data.headers).forEach(function (key) {
      if (key !== 'content-type' ||
        (!skipContentType && key === 'content-type')) {
        headers.append(key, data.headers[key]);
      }
    });

    return headers;
  };
  
  function _createRequestFromJsonObj(data, initFromData) {
    return Promise.resolve(new Request(data.url, initFromData));
  };

  /**
   * Return a Response object constructed from the JSON object returned by
   * responseToJSON
   * @method
   * @name responseFromJSON
   * @memberof! persistenceUtils
   * @instance
   * @param {Object} data JSON object returned by responseToJSON
   * @return {Promise} Returns a Promise which resolves to the Response
   */
  function responseFromJSON(data) {
    var initFromData = {};
    _copyProperties(data, initFromData, ['headers', 'body']);
    initFromData.headers = _createHeadersFromJsonObj(data, false);

    return _createResponseFromJsonObj(data, initFromData);
  };
  
  function _createResponseFromJsonObj(data, initFromData) {
    var response;
    var body = data.body;

    if (body && body.text) {
      response = new Response(body.text, initFromData);
    } else if (body && body.arrayBuffer) {
      initFromData.responseType = 'blob';
      response = new Response(body.arrayBuffer, initFromData);
    } else {
      response = new Response(null, initFromData);
    }

    return Promise.resolve(response);
  };

  /**
   * Update the Response object with the provided payload. The existing payload 
   * will be replaced
   * @method
   * @name setResponsePayload
   * @memberof! persistenceUtils
   * @instance
   * @param {Response} response Response object
   * @param {Object} payload JSON payload data
   * @return {Promise} Returns a Promise which resolves to the updated Response object 
   */
  function setResponsePayload(response, payload) {
    return responseToJSON(response).then(function (responseObject) {
      var body = responseObject.body;

      if (body.arrayBuffer) {
        if (payload instanceof ArrayBuffer) {
          body.arrayBuffer = payload;
        } else {
          throw new Error({message: 'unexpected payload'});
        }
      } else {
        body.text = JSON.stringify(payload);
      }
      return responseFromJSON(responseObject);
    });
  };

  function parseMultipartFormData(origbody, contentType) {
    var contentTypePrased = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
    if (!contentTypePrased) {
      throw new Error("not a valid multipart form data value.");
    }

    var parseHeader = function (headerpart) {
      var parsedHeaders = {};
      var headers = {};
      var headerparts = headerpart.split('\r\n');
      for (var hearderpartindex = 0; hearderpartindex < headerparts.length; hearderpartindex++) {
        var headersubpart = headerparts[hearderpartindex];
        if (headersubpart.length === 0) {
          continue;
        } else {
          var hearderitems = headersubpart.split(';');
          if (hearderitems.length === 1 && hearderitems[0].indexOf('Content-Type') === 0) {
            parsedHeaders.contentType = hearderitems[0].split(':')[1].trim();
          } else {
            for (var itemindex = 0; itemindex < hearderitems.length; itemindex++) {
              if (hearderitems[itemindex].indexOf('=') === -1) {
                continue;
              } else {
                var itempair = hearderitems[itemindex].split('=');
                headers[itempair[0].trim()] = itempair[1].substring(1, itempair[1].length - 1);
              }
            }
          }
        }
      }
      parsedHeaders.headers = headers;
      return parsedHeaders;
    };

    var parseData = function (datapart, contentType) {
      var dataparts = datapart.split('\r\n');
      if (contentType && contentType.indexOf('image') >= 0) {
        return textToBlob([dataparts[0], dataparts[1]].join('\r\n'), contentType);
      } else {
        return dataparts[0];
      }
    };

    var textToBlob = function (text, contentType) {
      var arrayBuffer = new ArrayBuffer(text.length);
      var bytes = new Uint8Array(arrayBuffer);
      for (var index = 0; index < text.length; index++) {
        bytes[index] = text.charCodeAt(index);
      }
      var blob = new Blob([arrayBuffer], {type: contentType});
      return blob;
    };

    var boundaryText = contentTypePrased[1] || contentTypePrased[2];

    var isText = typeof (origbody) === 'string';
    var bodyText;

    if (isText) {
      bodyText = origbody;
    } else {
      var view = new Uint8Array(origbody);
      bodyText = String.fromCharCode.apply(null, view);
    }
    var parts = bodyText.split(new RegExp(boundaryText));
    var partsPairArray = [];

    // first part and last part are markers
    for (var partIndex = 1; partIndex < parts.length - 1; partIndex++) {
      var partPair = {};
      var part = parts[partIndex];
      var subparts = part.split('\r\n\r\n');
      var headerpart = subparts[0];
      var datapart = subparts[1];
      var parsedHeader = parseHeader(headerpart);
      partPair.headers = parsedHeader.headers;
      partPair.data = parseData(datapart, parsedHeader.contentType);
      partsPairArray.push(partPair);
    }

    return partsPairArray;
  };

  // helper function to build endpoint key to register options under.
  // The option contains shredder/unshredder needed for cache to shred/unshredd
  // responses. Ideally, we would like cache to be able to look up such
  // information in the framework based on scope, but there is no central place
  // for such information to reside, considering the facts that the framework
  // should work in service worker case. So the solution is for cache to
  // lookup the information based on request.url, thus we require
  // (1) responseProxy needs to register/unregister the options so during which
  //     time period cache is able to look up shredder/unshredder
  // (2) because of asynchronous nature, there could be multiple fetch events
  //     going on from the same url, while we don't want the registered 
  //     shredder/unshredder to grow out of control, we create a unique key
  //     so we can use the same key to unreigster the shredder/unshredder
  // (3) any cache operations needs to happen within defaultResponseProxy
  //     processRequest scope.
  function buildEndpointKey (request) {
    var endPointKeyObj = {
      url: request.url,
      id : Math.random().toString(36).replace(/[^a-z]+/g, '')
    };
    return JSON.stringify(endPointKeyObj);
  };
  
  function _cloneRequest(request) {
    return requestToJSON(request, {_noClone: true}).then(function (requestJson) {
      return requestFromJSON(requestJson).then(function (requestClone) {
        return requestClone;
      });
    });
  };
  
  function _cloneResponse(response) {
    return responseToJSON(response, {_noClone: true}).then(function (responseJson) {
      return responseFromJSON(responseJson).then(function (responseClone) {
        return responseClone;
      });
    });
  };

  return {
    requestToJSON: requestToJSON,
    requestFromJSON: requestFromJSON,
    responseToJSON: responseToJSON,
    responseFromJSON: responseFromJSON,
    setResponsePayload: setResponsePayload,
    parseMultipartFormData: parseMultipartFormData,
    isCachedResponse: isCachedResponse,
    isGeneratedEtagResponse: isGeneratedEtagResponse,
    _isTextPayload: _isTextPayload,
    buildEndpointKey: buildEndpointKey,
    _cloneRequest: _cloneRequest,
    _cloneResponse: _cloneResponse,
  };
});

