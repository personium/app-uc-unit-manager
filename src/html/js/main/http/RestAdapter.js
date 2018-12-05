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

/*global _pc:false */

///**
//* @class RESTアクセスのためのクラス.
//* @param as ACCESSOR object
//* @constructor
//*/
/**
 * It creates a new object _pc.RestAdapter.
 * @class This class is used for REST access.
 * @param {_pc.Accessor} as ACCESSOR object
 * @constructor
 * @param {_pc.Accessor} Accessor
 */
_pc.RestAdapter = function(as) {
  this.initializeProperties(as);
};

if (typeof exports === "undefined") {
  exports = {};
}
exports.RestAdapter = _pc.RestAdapter;

///**
//* プロパティを初期化する.
//* @param as ACCESSOR object
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Accessor} as ACCESSOR object
 */
_pc.RestAdapter.prototype.initializeProperties = function(as) {
///** アクセス主体. */
  /** Accessor object. */
  this.accessor = as;

  /** HTTPClient. */
  var config = as.getDaoConfig();
  this.httpConnectionTimeout = config.getConnectionTimeout();

  this.httpClient = this.createHttpClient();
};

///**
//* HTTPクライアントのインスタンスを返す.
//* @return {object} HTTPクライアントオブジェクト
//*/
/**
 * This method returns an instance of the HTTP client.
 * @return {_pc.PersoniumHttpClient} HTTP Client object
 */
_pc.RestAdapter.prototype.createHttpClient = function() {
  // TODO ファクトリクラス化する
  return new _pc.PersoniumHttpClient();
};

///**
//* レスポンスボディを受け取るGETメソッド(If-None-Macth指定).
//* @param requestUrl リクエスト対象URL
//* @param accept Acceptヘッダ値
//* @param etag 取得するEtag
//* @param callback object
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * GET method to receive the response body (If-None-Macth specified).
 * @param {String} requestUrl
 * @param {String} accept
 * @param {String} etag
 * @param {Object} callback object
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.get = function(requestUrl, accept, etag, callback) {
  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.accept(accept);
  builder.token(this.accessor.accessToken);
  builder.ifNoneMatch(etag);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "GET", requestUrl, "", builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* レスポンスボディをバイナリ型式で受け取るGETメソッド(If-None-Macth指定).
//* @param requestUrl リクエスト対象URL
//* @param etag 取得するEtag
//* @param callback object
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * GET method that takes a binary model in the request body (If-None-Macth specified).
 * @param {String} requestUrl
 * @param {String} etag
 * @param {Object} callback object
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.getBinary = function(requestUrl, etag, callback) {
  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.token(this.accessor.accessToken);
  builder.ifNoneMatch(etag);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  xhr.setOverrideMimeType("text/plain; charset=x-user-defined");
  this.request(xhr, "GET", requestUrl, "", builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* HEADメソッド.
//* @param requestUrl リクエスト対象URL
//* @param {string} etag Used for if-none-match condition
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * This method uses default headers to fetch the data.
 * @param {String} requestUrl
 * @param {string} etag Used for if-none-match condition
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.head = function(requestUrl, etag) {
  return this.get(requestUrl, "application/json", etag);
};

///**
//* レスポンスボディを受ける PUTメソッド.
//* @param requestUrl リクエスト対象URL
//* @param requestBody data 書き込むデータ
//* @param etag ETag
//* @param contentType CONTENT-TYPE値
//* @param headers header object
//* @param callback object
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * PUT method to receive the response body.
 * @param {String} requestUrl
 * @param {Object} requestBody data
 * @param {String} ETag value
 * @param {String} CONTENT-TYPE value
 * @param {Object} header object
 * @param {Object} callback object
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.put = function(requestUrl, requestBody, etag, contentType, headers, callback) {
  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType(contentType);
  builder.ifMatch(etag);
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "PUT", requestUrl, requestBody, builder, headers, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* リクエストボディを受け取る POSTメソッド.
//* @param requestUrl リクエスト対象URL
//* @param requestBody data 書き込むデータ
//* @param contentType CONTENT-TYPE値
//* @param headers header object
//* @param callback object
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * POST method that receives the request body.
 * @param {String} requestUrl
 * @param {Object} requestBody data
 * @param {String} CONTENT-TYPE value
 * @param {Object} header object
 * @param {Object} callback object
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exceptionn
 */
_pc.RestAdapter.prototype.post = function(requestUrl, requestBody, contentType, headers, callback) {
  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType(contentType);
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "POST", requestUrl, requestBody, builder, headers, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* レスポンスボディを受けるMERGEメソッド.
//* @param requestUrl リクエスト対象URL
//* @param requestBody data 書き込むデータ
//* @param etag ETag
//* @param contentType CONTENT-TYPE値
//* @param callback object
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * MERGE method to receive the response body.
 * @param {String} requestUrl
 * @param {Object} requestBody data
 * @param {String} ETag
 * @param {String} CONTENT-TYPE value
 * @param {Object} callback object
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.merge = function(requestUrl, requestBody, etag, contentType, callback) {
  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType(contentType);
  builder.ifMatch(etag);
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "MERGE", requestUrl, requestBody, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

/**
 * This method issues DELETE HTTP request.
 * @param {String} requestUrl target URL to issue DELETE method.
 * @param {String/Object} optionsOrEtag non-mandatory options. If a string is sent it will be sent as If-Match header value for backward compatibility.
 * @param {Object} options.headers Any Extra HTTP request headers to send.
 * @param {Function} options.success Callback function for successful result.
 * @param {Function} options.error Callback function for error response.
 * @param {Function} options.complete Callback function for any response, either successful or error.
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {_pc.Promise} Promise
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.del = function(requestUrl, optionsOrEtag, callback) {
  var options = {};
  if(!optionsOrEtag){
    optionsOrEtag = {};
  }
  if(!optionsOrEtag.headers){
    optionsOrEtag.headers = {};
  }
  /** backward compatibility. */
  if(typeof optionsOrEtag === "string"){
    /**  If a string comes, it will be sent as If-Match header. */
    options.headers = {};
    options.headers["If-Match"] = optionsOrEtag;
  }else{
    options = optionsOrEtag;
  }
  
  /** backward compatibility. */
  if (callback){
    options.success = callback.success;
    options.error = callback.error;
    options.complete = callback.complete;
  }
  /** use the new version of internal request method. */
  return this._request(this.httpClient, "DELETE", requestUrl, options);
};

///**
//* ACLメソッド.
//* @param requestUrl リクエスト対象URL
//* @param requestBody リクエストボディ
//* @param callback (deprecated) for backward compatibility.
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * ACL method to retrieve ACL settings.
 * @param {String} requestUrl
 * @param {Object} requestBody
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.acl = function(requestUrl, requestBody, callback) {
  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "ACL", requestUrl, requestBody, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* MKCOLメソッド.
//* @param requestUrl リクエスト対象URL
//* @param callback (deprecated) for backward compatibility.
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * MKCOL method for creating collections.
 * @param {String} requestUrl
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.mkcol = function(requestUrl, callback) {
  /** MKCol用リクエストボディ. */
  var REQUEST_BODY_MKCOL_XML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<D:mkcol xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\"><D:set><D:prop><D:resourcetype><D:collection/>" +
  "</D:resourcetype></D:prop></D:set></D:mkcol>";

  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "MKCOL", requestUrl, REQUEST_BODY_MKCOL_XML, builder, {}, callback);

  if (callback === undefined || callback === "") {
    return this.httpClient;
  }
};

///**
//* MKCOL拡張メソッド(ODataコレクション作成).
//* @param requestUrl リクエスト対象URL
//* @param callback (deprecated) for backward compatibility.
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * MKCOL method for creating odata collections.
 * @param {String} requestUrl
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.mkOData = function(requestUrl, callback) {
  /** MKOData用リクエストボディ. */
  var REQUEST_BODYMKODATA_XML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<D:mkcol xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\"><D:set><D:prop><D:resourcetype><D:collection/>" +
  "<p:odata/></D:resourcetype></D:prop></D:set></D:mkcol>";

  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "MKCOL", requestUrl, REQUEST_BODYMKODATA_XML, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* MKCOL拡張メソッド(Serviceコレクション作成).
//* @param requestUrl リクエスト対象URL
//* @param callback (deprecated) for backward compatibility.
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * MKCOL method for creating service collections.
 * @param {String} requestUrl
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.mkService = function(requestUrl, callback) {
  /** サービスコレクション用リクエストボディ. */
  var REQUEST_BODY_SERVICE_XML = "<?xml version=\"1.0\" encoding=\"utf-8\"?>" +
  "<D:mkcol xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\"><D:set><D:prop><D:resourcetype>" +
  "<D:collection/><p:service/></D:resourcetype></D:prop></D:set></D:mkcol>";

  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "MKCOL", requestUrl, REQUEST_BODY_SERVICE_XML, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* サービス登録専用PROPPATCHメソッド.
//* @param requestUrl リクエスト対象URL
//* @param key プロパティ名
//* @param value プロパティの値
//* @param subject サービスサブジェクトの値
//* @param callback (deprecated) for backward compatibility.
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * Service registration only PROPPATCH method.
 * @param {String} requestUrl
 * @param {String} key
 * @param {String} value
 * @param {String} subject
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.setService = function(requestUrl, key, value, subject, callback) {
  var sb = "";
  sb += "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
  sb += "<D:propertyupdate xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\" xmlns:Z=\"http://www.w3.com/standards/z39.50/\"><D:set><D:prop>";
  sb += "<p:service language=\"JavaScript\" subject=\"" + subject + "\">";
  sb += "<p:path name=\"" + key + "\" src=\"" + value + "\"/>";
  sb += "</p:service></D:prop></D:set></D:propertyupdate>";

  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "PROPPATCH", requestUrl, sb, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

/**
 * The purpose of this method is to set multiple service in one API call
 * through PROPATCH  
 * @param requestUrl target URL
 * @param arrServiceNameAndSrcFile service list in combination of service name and source file
 * @param subject Service
 * @param callback (deprecated) for backward compatibility.
 * @return PersoniumHttpClient
 * @throws DaoException DAO
 */
_pc.RestAdapter.prototype.setMultipleService = function(requestUrl, arrServiceNameAndSrcFile, subject, callback) {
	var key = null;
	var value = null;
	var sb = "";
	sb += "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
	sb += "<D:propertyupdate xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\" xmlns:Z=\"http://www.w3.com/standards/z39.50/\"><D:set><D:prop>";
	sb += "<p:service language=\"JavaScript\" subject=\"" + subject + "\">";
	var len = arrServiceNameAndSrcFile.length;
	for (var i = 0; i < len; i++) {
		key = arrServiceNameAndSrcFile[i].serviceName;
		value = arrServiceNameAndSrcFile[i].sourceFileName;
		sb += "<p:path name=\"" + key + "\" src=\"" + value + "\"/>";
	}
	sb += "</p:service></D:prop></D:set></D:propertyupdate>";
	var builder = new _pc.PersoniumRequestHeaderBuilder();
	builder.contentType("application/xml");
	builder.accept("application/xml");
	builder.token(this.accessor.accessToken);
	builder.defaultHeaders(this.accessor.getDefaultHeaders());

	var xhr = this.httpClient;
	this.request(xhr, "PROPPATCH", requestUrl, sb, builder, {}, callback);

	if (callback === undefined) {
		return this.httpClient;
	}
};

///**
//* PROPPATCHメソッド.
//* @param requestUrl リクエスト対象URL
//* @param key プロパティ名
//* @param value プロパティの値
//* @param callback (deprecated) for backward compatibility.
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * PROPPATCH method.
 * @param {String} requestUrl
 * @param {String} key
 * @param {String} value
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.proppatch = function(requestUrl, key, value, callback) {
  var sb = "";
  sb += "<D:propertyupdate xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\"><D:set><D:prop>";
  sb += "<" + key + ">";
  sb += value;
  sb += "</" + key + ">";
  sb += "</D:prop></D:set></D:propertyupdate>";

  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "PROPPATCH", requestUrl, sb, builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

/**
 * The purpose of this method is to perform multiple set and remove property operation
 * in one API call through PROPPATCH
 * @param requestUrl
 * @param setPropertyList Property List in the form of key and value
 * @param removedPropertyList Property List in the form of key and value
 * @param callback (deprecated) for backward compatibility.
 * @return PersoniumHttpClient
 * @throws DaoException DAO??
 */
_pc.RestAdapter.prototype.multiProppatch = function(requestUrl, setPropertyList, removedPropertyList, callback) {
	var sb = "";
	var key = null;
	var value = null;
	sb += "<D:propertyupdate xmlns:D=\"DAV:\" xmlns:p=\"urn:x-personium:xmlns\" xmlns:Z=\"http://www.w3.com/standards/z39.50/\"><D:set><D:prop>";
	for ( var i = 0; i < setPropertyList.length; i++) {
		key = setPropertyList[i].propName;
		value = setPropertyList[i].propValue;
		sb += "<" + key + ">";
		sb += value;
		sb += "</" + key + ">";
	}
	sb += "</D:prop></D:set><D:remove><D:prop>";
	for ( var i = 0; i < removedPropertyList.length; i++) {
		key = removedPropertyList[i].propName;
		value = removedPropertyList[i].propValue;
		sb += "<" + key + ">";
		sb += value;
		sb += "</" + key + ">";
	}
	sb += "</D:prop></D:remove></D:propertyupdate>";
	var builder = new _pc.PersoniumRequestHeaderBuilder();
	builder.contentType("application/xml");
	builder.accept("application/xml");
	builder.token(this.accessor.accessToken);
	builder.defaultHeaders(this.accessor.getDefaultHeaders());

	var xhr = this.httpClient;
	this.request(xhr, "PROPPATCH", requestUrl, sb, builder, {}, callback);

	if (callback === undefined) {
		return this.httpClient;
	}
};

///**
//* PROPFINDメソッド.
//* @param requestUrl リクエスト対象URL
//* @param callback (deprecated) for backward compatibility.
//* @return PersoniumHttpClient
//* @throws DaoException DAO例外
//*/
/**
 * PROPFind method.
 * @param {String} requestUrl
 * @param {Object} callback (deprecated) for backward compatibility.
 * @return {_pc.PersoniumHttpClient} PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.propfind = function(requestUrl, callback) {
  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.contentType("application/xml");
  builder.accept("application/xml");
  builder.token(this.accessor.accessToken);
  builder.depth("1");
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  var xhr = this.httpClient;
  this.request(xhr, "PROPFIND", requestUrl, "", builder, {}, callback);

  if (callback === undefined) {
    return this.httpClient;
  }
};

///**
//* Responseボディを受ける場合のHTTPリクエストを行う.
//* @param xhr
//* @param method Http request method
//* @param requestUrl リクエスト対象URL
//* @param requestBody data request body
//* @param builder PersoniumRequestHeaderBuilder
//* @param headers headers parameters for request
//* @param callback (deprecated) for backward compatibility.
//* @throws DaoException DAO例外
//*/
/**
 * This method is used to make HTTP requests may be subject to Response body.
 * @param {_pc.PersoniumHttpClient} xhr
 * @param {String} Http request method
 * @param {String} requestUrl
 * @param {Object} data request body
 * @param {_pc.PersoniumRequestHeadreBuilder} builder PersoniumRequestHeaderBuilder
 * @param {Object} headers parameters for request
 * @param {Object} callback (deprecated) for backward compatibility.
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RestAdapter.prototype.request = function(xhr, method, requestUrl, requestBody, builder, headers, callback) {
  var self = this;
  builder.build(xhr, headers);

  // check added for empty callback

  if (callback !== undefined && callback !== "") {
    xhr._execute(method, requestUrl, requestBody, function() {
      self.accessor.setResHeaders(xhr.getAllResponseHeaders());
      callback(self);
    });
  } else {
    xhr._execute(method, requestUrl, requestBody);
    this.accessor.setResHeaders(xhr.getAllResponseHeaders());
	if (xhr.getStatusCode() >= 300 && xhr.getStatusCode() <= 400) {
      var response = JSON.parse(xhr.bodyAsString());
      if(xhr.getStatusCode() === 401){
        //authentication error case,when response does not contain response.message instead contains response.error
        throw new _pc.DaoException(response.error, response.error_description);
      }else{
        throw new _pc.DaoException(response.message.value, response.code);
      }
    }
  }
};

/**
 * This is the new version of internal request method to send HTTP request.
 * @private
 * @param {_pc.PersoniumHttpClient} http client.
 * @param {String} HTTP request method.
 * @param {String} HTTP request url.
 * @param {Object} options
 * @param {Object} options.headers Request headers
 * @param {Object} options.body Request body
 * @param {Function} options.success Callback function for successful result.
 * @param {Function} options.error Callback function for error response.
 * @param {Function} options.complete Callback function for any response, either successful or error.
 * @return {_pc.Promise} response or promise
 * @throws {_pc.DaoException} ClientException
 */
_pc.RestAdapter.prototype._request = function(client, method, requestUrl, options) {
  var self = this;
  var builder = new _pc.PersoniumRequestHeaderBuilder();
  builder.token(this.accessor.accessToken);
  builder.defaultHeaders(this.accessor.getDefaultHeaders());

  /** put all req headers to client. */
  builder.build(client, options.headers);

  /** sync/async mode detection. */
  client.setAsync(this.accessor.getContext().getAsync());

  //if (this.accessor.getContext().getSync()) {

  /** check if valid option is present with any/all callback present. */
  if (options !== undefined &&
      options !== null &&
      (options.success !== undefined || options.error !== undefined ||
          options.complete !== undefined)) {
    var promise = client._execute2(method, requestUrl, options, self.accessor);
    //self.accessor.setResHeaders(client.getAllResponseHeaders());
    return promise;
  } else {
    var res = client._execute2(method, requestUrl, "", self.accessor);
    //self.accessor.setResHeaders(client.getAllResponseHeaders());
    if (400 > client.getStatusCode() >= 300) {
      var response = JSON.parse(client.bodyAsString());
      throw new _pc.DaoException(response.message.value, response.code);
    }
    return res;
  }
};

///**
//* HTTPステータスコードを返却する.
//* return status code
//*/
/**
 * This method returns HHTP status code.
 * @returns {String} status code
 */
_pc.RestAdapter.prototype.getStatusCode = function() {
  return this.httpClient.getStatusCode();
};

///**
//* 指定したレスポンスヘッダの値を返却する.
//* return responseHeader against the key
//*/
/**
 * This method returns response headers.
 * @param {String} key
 * @returns {String} responseHeader against the key
 */
_pc.RestAdapter.prototype.getResponseHeader = function(key) {
  return this.httpClient.getResponseHeader(key);
};

///**
//* レスポンスボディを文字列で返却する.
//* @return bodyAsString
//*/
/**
 * This method returns the response body in string format.
 * @return {String} bodyAsString
 */
_pc.RestAdapter.prototype.bodyAsString = function() {
  return this.httpClient.bodyAsString();
};

///**
//* レスポンスボディをJSONオブジェクトで返却する.
//* @return bodyAsJson
//*/
/**
 * This method returns the response body in JSON format.
 * @return {Object} bodyAsJson
 */
_pc.RestAdapter.prototype.bodyAsJson = function() {
  return this.httpClient.bodyAsJson();
};

///**
//* レスポンスボディをXMLで取得.
//* @return XML DOMオブジェクト
//*/
/**
 * This method returns the response body in XML format.
 * @returns {String} XML response
 */
_pc.RestAdapter.prototype.bodyAsXml = function() {
  return this.httpClient.bodyAsXml();
};