/**
 * Personium
 * Copyright 2016 FUJITSU LIMITED
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*global _pc:false, XMLHttpRequest:false*/

/**
 * It creates a new object _pc.PersoniumHttpClient.
 * @class This class is the abstraction Layer of HTTP Client.
 * @param {Boolean} async
 */
_pc.PersoniumHttpClient = function(async) {
  this.requestHeaders = [];
  this.httpClient = new XMLHttpRequest();
  this.overrideMimeType = "";
  /** default execution mode is synchronous. */
  this.async = false;
  if(async){
    /** mark the execution as asynchronous. */
    this.async = async;
  }
};

/**
 * This method sets the HTTP Request Header.
 * @param {String} header key
 * @param {String} header value
 */
_pc.PersoniumHttpClient.prototype.setRequestHeader = function(key, value) {
  var header = {};
  header[key] = value;
  this.requestHeaders.push(header);
};

/**
 * This method sets overrideMimeType.
 * @param {String} MimeType value
 */
_pc.PersoniumHttpClient.prototype.setOverrideMimeType = function(value) {
  this.overrideMimeType = value;
};

/**
 * This method is the getter for HTTP Status Code.
 * @returns {String} HTTP Status Code
 */
_pc.PersoniumHttpClient.prototype.getStatusCode = function() {
  return this.httpClient.status;
};

/**
 * Thi smethod gets the specified response header value.
 * @param {String} header name
 * @returns {String} header value
 */
_pc.PersoniumHttpClient.prototype.getResponseHeader = function(key) {
  var header = this.httpClient.getResponseHeader(key);
  if (header === null) {
    header = "";
  }
  return header;
};

/**
 * This method gets all the response headers.
 * @returns {Object} response header
 */
_pc.PersoniumHttpClient.prototype.getAllResponseHeaders = function() {
  var headersStr = this.httpClient.getAllResponseHeaders();
  var headers = {};
  var headersArray = headersStr.split("\n");
  for (var i = 0; i < headersArray.length; i++) {
    var arr = headersArray[i].split(":");
    var headerName = arr.shift();
    if (headerName === "") {
      continue;
    }
    var headerValue = arr.join(":");
    headerValue = headerValue.replace(/(^\s+)|(\s+$)/g, "");
    headers[headerName] = headerValue;
  }
  return headers;
};

/**
 * This method retrieves the response body in the form of string.
 * @returns {String} responseText
 */
_pc.PersoniumHttpClient.prototype.bodyAsString = function() {
  return this.httpClient.responseText;
};

/**
 * This method retrieves the response body in the form of binary.
 * @returns {Object} response object
 */
_pc.PersoniumHttpClient.prototype.bodyAsBinary = function() {
  return this.httpClient.response;
};

/**
 * This method retrieves the response body in the form of JSON object.
 * @returns {Object} responseText JSON format
 */
_pc.PersoniumHttpClient.prototype.bodyAsJson = function() {
  try {
    if (this.httpClient.responseText === "") {
      return {};
    }
    return JSON.parse(this.httpClient.responseText);
  } catch (e) {
    throw new Error("json parse exception: " + e.message);
  }
};

/**
 * This method retrieves the response body in the form of XML.
 * @return {String} XML DOM Object
 */
_pc.PersoniumHttpClient.prototype.bodyAsXml = function() {
  return this.httpClient.responseXML;
};

/**
 * Execute method is used to send an HTTP Request.
 * @private
 * @param {String} method
 * @param {String} requestUrl
 * @param {Object} requestBody
 * @param {Object} callback
 * @returns {_pc.Promise} Promise object
 */
_pc.PersoniumHttpClient.prototype._execute = function(method, requestUrl, requestBody, callback) {
  var self = this;
  var xhr = this.httpClient;
  var promise = new _pc.Promise();

  if (callback !== undefined) {
    xhr.open(method, requestUrl, true);
    xhr.requestUrl = method + ":" + requestUrl;
  } else {
    xhr.open(method, requestUrl, false);
  }

  if (this.overrideMimeType !== "") {
    xhr.overrideMimeType(this.overrideMimeType);
  }
  for (var index in this.requestHeaders) {
    var header = this.requestHeaders[index];
    for (var key in header) {
      xhr.setRequestHeader(key, header[key]);
    }
  }
  xhr.onload = function () {
    //if(xhr.responseText !== ""){
    //var results = xhr.responseText;//JSON.parse(xhr.responseText);
    if (200 <= xhr.status && xhr.status < 300) {
      promise.resolve(xhr);
    }else{
      promise.reject(xhr);
    }
    if (callback !== undefined) {
      callback(self);
    }
    //}
  };
  xhr.onerror = function (e) {
    promise.reject(e.target.status);
  };
  xhr.send(requestBody);
  return promise;
};

/**
 * Execute method is used to send an HTTP Request, 
 * decides request mode based on this.async.
 * @private
 * @param {String} method GET, POST, PUT,DELETE
 * @param {String} requestUrl
 * @param {Object} options contains body and callback success, error and complete
 * @param {accessor} to set response header
 * @returns {_pc.Promise} Promise object
 */
_pc.PersoniumHttpClient.prototype._execute2 = function(method, requestUrl, options, accessor) {
  var self = this;
  var xhr = this.httpClient;
  var promise = new _pc.Promise();
  var requestBody = "";

  xhr.open(method, requestUrl, this.async);
  if(options.body !== undefined && options.body !== null){
    requestBody = options.body;
  }
  if(this.async){
    xhr.requestUrl = method + ":" + requestUrl;
  }
  if (this.overrideMimeType !== "") {
    xhr.overrideMimeType(this.overrideMimeType);
  }
  for (var index in this.requestHeaders) {
    var header = this.requestHeaders[index];
    for (var key in header) {
      xhr.setRequestHeader(key, header[key]);
    }
  }
  xhr.onload = function () {
    /** handle the promise based on status code. */
    if (200 <= xhr.status && xhr.status < 300) {
      promise.resolve(xhr);
    }else{
      promise.reject(xhr);
    }
    //set the response headers
    accessor.setResHeaders(xhr.getAllResponseHeaders());
    /** handle the callback based on status code. */
    if(options!== null && options !== undefined){
      /** if status code is between 200 to 300, execute success callback. */
      if(200 <= xhr.status && xhr.status < 300){
        if(options.success){
          options.success(self);
        }
      }else{
        /** execute error callback. */
        if(options.error){
          options.error(self);
        }
      }
      /** execute complete callback. */
      if(options.complete){
        options.complete(self);
      }
    }
    /*if (callback !== undefined) {
			callback(self);
		}*/
  };
  xhr.onerror = function (e) {
    promise.reject(e.target.status);
  };
  xhr.send(requestBody);
  return promise;
};

/**
 * This method sets Asynchronous mode.
 * @param {Boolean} async true to set mode as asynchronous
 */
_pc.PersoniumHttpClient.prototype.setAsync = function(async){
  this.async = async;
};