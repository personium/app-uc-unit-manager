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

/*global _pc:false
 */

///**
//* リクエストオブジェクトを生成するBuilderクラス.
//* @class Represents PersoniumRequestHeaderBuilder. 
//*/
/**
 * It creates a new object _pc.PersoniumHttpClient.
 * @class This is a builder class that generates a request header object.
 * @constructor
 */
_pc.PersoniumRequestHeaderBuilder = function() {
  this.initializeProperties();
};

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 */
_pc.PersoniumRequestHeaderBuilder.prototype.initializeProperties = function() {
///** ContentType値. */
  /** ContentType value. */
  this.contentTypeHeaderValue = null;
///** Accept値. */
  /** Accept value. */
  this.acceptHeaderValue = null;
///** IF-MATCHヘッダ値. */
  /** IF-MATCH header value. */
  this.ifMatchValue = null;
///** IF-NONE-MATCH値. */
  /** IF-NONE-MATCH header value. */
  this.ifNoneMatchValue = null;
///** ETag値. */
  /** ETag value. */
  this.etagHeaderValue = null;
///** Token値. */
  /** Token value. */
  this.tokenValue = null;
///** Depth値. */
  /** Depth value. */
  this.depthValue = null;
///** AcceptEncoding値. */
  /** AcceptEncoding value. */
  this.encodingValue = null;
///** デフォルトヘッダ. */
  /** Default header. */
  this.defaultHeadersValue = null;
  /** X-Personium-Recursive */
  this.xdcRecursiveValue = null;
};

///**
//* Acceptをセットする.
//* @param value Acceptヘッダ値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets AcceptHeader value.
 * @param {String} AcceptHeader value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.accept = function(value) {
  this.acceptHeaderValue = value;
  return this;
};

///**
//* ContentTypeをセットする.
//* @param value ContentType値.
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets ContentType value.
 * @param {String} ContentType value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.contentType = function(value) {
  this.contentTypeHeaderValue = value;
  return this;
};

///**
//* ETagをセットする.
//* @param value ETag値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets ETag value.
 * @param {String} ETag value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.etag = function(value) {
  this.etagHeaderValue = value;
  return this;
};

///**
//* Tokenをセットする.
//* @param value Token値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets Token value.
 * @param {String} Token value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.token = function(value) {
  this.tokenValue = value;
  return this;
};

///**
//* AcceptEncodingをセットする.
//* @param value AcceptEncoding値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets AcceptEncoding value.
 * @param {String} AcceptEncoding value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.acceptEncoding = function(value) {
  this.encodingValue = value;
  return this;
};

///**
//* IF-MATCHをセットする.
//* @param value IF-MATCH値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets IF-MATCH value.
 * @param {Boolean} IF-MATCH value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.ifMatch = function(value) {
  this.ifMatchValue = value;
  return this;
};

///**
//* IF-NONE-MATCHをセットする.
//* @param value IF-NONE-MATCH値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets IF-NONE-MATCH value.
 * @param {Boolean} IF-NONE-MATCH value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.ifNoneMatch = function(value) {
  this.ifNoneMatchValue = value;
  return this;
};

///**
//* Depthをセットする.
//* @param value Depth値
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets Depth value.
 * @param {String} Depth value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.depth = function(value) {
  this.depthValue = value;
  return this;
};

///**
//* デフォルトヘッダをセットする.
//* @param value デフォルトヘッダ
//* @return 自分自身のオブジェクト
//*/
/**
 * This method sets Default Headers. 
 * @param {String} DefaultHeader value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.defaultHeaders = function(value) {
  this.defaultHeadersValue = value;
  return this;
};

/**
 * This method sets X-Personium-Recursive.
 * @param {Boolean} X-Personium-Recursive value
 * @return {Object} Its own object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.xdcRecursive = function(value) {
  this.xdcRecursiveValue = value;
  return this;
};

///**
//* ContentTypeの取得.
//* @return ContentType値
//*/
/**
 * This method returns ContentType value.
 * @return {String} ContentType value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getContentType = function() {
  return this.contentTypeHeaderValue;
};

///**
//* Acceptの取得.
//* @return Accept値
//*/
/**
 * This method returns AcceptHeader value.
 * @return {String} AcceptHeader value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getAccept = function() {
  return this.acceptHeaderValue;
};

///**
//* ETagの取得.
//* @return ETaq値
//*/
/**
 * This method returns ETag value.
 * @return {String} ETaq value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getETag = function() {
  return this.etagHeaderValue;
};

///**
//* Tokenの取得.
//* @return Token値
//*/
/**
 * This method returns Token value.
 * @return {String} Token value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getToken = function() {
  return this.tokenValue;
};

///**
//* AcceptEncodingを取得.
//* @return AcceptEncoding値
//*/
/**
 * This method returns AcceptEncoding value.
 * @return {String} AcceptEncoding value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getAcceptEncoding = function() {
  return this.encodingValue;
};

///**
//* Depth値を取得.
//* @return Depth値
//*/
/**
 * This method returns Depth value.
 * @return {String} Depth value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getDepth = function() {
  return this.depthValue;
};

///**
//* IF-MATCH値を取得.
//* @return IF-MATCH値
//*/
/**
 * This method returns IF-MATCH value.
 * @return {Boolean} IF-MATCH value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getIfMatch = function() {
  return this.ifMatchValue;
};

///**
//* IF-NONE-MATCH値を取得.
//* @return IF-NONE-MATCH値
//*/
/**
 * This method returns IF-NONE-MATCH value.
 * @return {Boolean} IF-NONE-MATCH value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getIfNoneMatch = function() {
  return this.ifNoneMatchValue;
};

/**
 * This method returns X-Personium-Recursive value.
 * @return {Boolean} X-Personium-Recursive value
 */
_pc.PersoniumRequestHeaderBuilder.prototype.getXdcRecursive = function() {
  return this.xdcRecursiveValue;
};

///**
//* ヘッダを設定する.
//* @param req リクエストオブジェクト
//* @param headers header parameters
//* @return リクエストオブジェクト
//*/
/**
 * This method sets the parameters in the request header.
 * @param {_pc.PersoniumHttpClient} Request object
 * @param {Object} header parameters
 * @return {_pc.PersoniumHttpClient} Request object
 */
_pc.PersoniumRequestHeaderBuilder.prototype.build = function(req, headers) {
  if (this.tokenValue !== null) {
    req.setRequestHeader("Authorization", "Bearer " + this.tokenValue);
  }
  if (this.acceptHeaderValue !== null) {
    req.setRequestHeader("Accept", this.acceptHeaderValue);
  }
  if (this.contentTypeHeaderValue !== null) {
    req.setRequestHeader("Content-Type", this.contentTypeHeaderValue);
  }
  if (this.etagHeaderValue !== null) {
    req.setRequestHeader("If-Match", this.etagHeaderValue);
  }
  if (this.encodingValue !== null) {
    req.setRequestHeader("Accept-Encoding", this.encodingValue);
  }
  if (this.ifMatchValue !== null) {
    req.setRequestHeader("If-Match", this.ifMatchValue);
  }
  if (this.ifNoneMatchValue !== null) {
    req.setRequestHeader("If-None-Match", this.ifNoneMatchValue);
  }
  if (this.depthValue !== null) {
    req.setRequestHeader("Depth", this.depthValue);
  }
  if (this.xdcRecursiveValue !== null) {
    req.setRequestHeader("X-Personium-Recursive", this.xdcRecursiveValue);
  }

  // デフォルトヘッダがセットされていれば、それらを設定。
  /** If default header is set, then configure it. */
  // 最初にセットしない理由は、リクエストヘッダは、同名ヘッダが複数登録されてしまうため
  /** The reason you do not want to set for the first time, since the request header,
	    would have been more than one registration is the same name header. */
  if (this.defaultHeadersValue !== null) {
    for (var defaultHeaderKey in this.defaultHeadersValue) {
      req.setRequestHeader(defaultHeaderKey, this.defaultHeadersValue[defaultHeaderKey]);
    }
  }

  if (typeof headers === "object") {
    for (var key in headers) {
      req.setRequestHeader(key, headers[key]);
    }
  }
  return req;
};
