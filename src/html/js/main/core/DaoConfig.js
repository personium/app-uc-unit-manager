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

/**
 * @namespace Namespace enclosing the Personium client library classes.
 */
var _pc = {};

///**
//* @class JS-DAOの動作設定情報を保持するオブジェクト.
//* @constructor
//*/
/**
 * It creates a new object _pc.DaoConfig.
 * @class This class is used for holding the operation setting information of JS-DAO.
 * @constructor
 */
_pc.DaoConfig = function() {
  this.initializeProperties();
};

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 */
_pc.DaoConfig.prototype.initializeProperties = function() {
///** HTTPタイムアウト値 (number). */
  /** HTTP time-out value (number). */
  this.connectionTimeout = 0;

///** PUT/POST時にChunked指定をするかどうか (boolean). */
  /** Whether Chunked is specified at PUT / POST (boolean).*/
  this.chunked = true;

///** 通信を非同期で行うかどうか (boolean). */
  /** Whether is asynchronous communication (boolean). */
  // 現時点ではLogの書き込みのみ対応
  this.async = false;

///** HttpClientクラス. */
  /** HttpClient class. */
  this.httpClient = null;

///** テスト時に実通信を抑止するためのモッククラス. */
//this.mockRestAdapter = null;
};


///**
//* HTTPタイムアウト値を取得する.
//* @return {Number} タイムアウト値(ms)
//*/
/**
 * This method is used to get the HTTP time-out value.
 * @return {Number} Time-out value (ms)
 */
_pc.DaoConfig.prototype.getConnectionTimeout = function() {
  return this.connectionTimeout;
};

///**
//* HTTPタイムアウト値を設定する.
//* number型以外を指定した場合は例外をスローする.
//* @param {Number} value タイムアウト値(ms)
//*/
/**
 * This method is used to set the HTTP time-out value.
 * It throws an exception if a non-type is specified.
 * @param {Number} value Time-out value (ms)
 */
_pc.DaoConfig.prototype.setConnectionTimeout = function(value) {
  if (typeof value !== "number") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.connectionTimeout = value;
};

///**
//* Chunked指定の有無を取得する.
//* @return {boolean} Chunked値
//*/
/**
 * This method gets the Chunked attribute as specified.
 * @return {boolean} Chunked value
 */
_pc.DaoConfig.prototype.getChunked = function() {
  return this.chunked;
};

///**
//* Chunked指定の有無を設定する.
//* boolean型以外を指定した場合は例外をスローする.
//* @param {boolean} value Chunked値
//*/
/**
 * This method sets the Chunked attribute.
 * It throws an exception if a non-boolean type is specified.
 * @param {boolean} value Chunked value
 */
_pc.DaoConfig.prototype.setChunked = function(value) {
  if (typeof value !== "boolean") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.chunked = value;
};

///**
//* 非同期通信を行うかどうかを取得する.
//* @return {?} 非同期フラグ
//*/
/**
 * This method gets the asynchronous attribute as specified.
 * You will be prompted to asynchronous communication.
 * @return {Boolean} Asynchronous flag
 */
_pc.DaoConfig.prototype.getAsync = function() {
  return this.async;
};

///**
//* 非同期通信を行うか否かを設定する.
//* boolean型以外を指定した場合は例外をスローする.
//* @param {?} value 非同期フラグ
//*/
/**
 * This method sets the asynchronous attribute.
 * It throws an exception if a non-boolean type is specified.
 * @param {Boolean} value Asynchronous flag
 */
_pc.DaoConfig.prototype.setAsync = function(value) {
  if (typeof value !== "boolean") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.async = value;
};

///**
//* HttpClientオブジェクト取得.
//* @return {?} HttpClientオブジェクト
//*/
/**
 * This method acquires HttpClient object.
 * @return {_pc.PersoniumHttpClient} HttpClient object
 */
_pc.DaoConfig.prototype.getHttpClient = function() {
  return this.httpClient;
};

///**
//* HttpClientオブジェクト設定.
//* @param {?} value HttpClientオブジェクト
//*/
/**
 * This method sets HttpClient object.
 * @param {_pc.PersoniumHttpClient} value HttpClient object
 */
_pc.DaoConfig.prototype.setHttpClient = function(value) {
  this.httpClient = value;
};

///**
//* RestAdapterのモッククラスを取得.
//* @return RestAdapterモッククラス
//*/
////public final RestAdapter getMockRestAdapter() {
//_pc.DaoConfig.prototype.getMockRestAdapter = function() {
//return mockRestAdapter;
//};

///**
//* RestAdapterのモッククラスを設定.
//* @param value RestAdapterモッククラス
//*/
////public final void setMockRestAdapter(final RestAdapter value) {
//_pc.DaoConfig.prototype.setMockRestAdapter = function() {
//this.mockRestAdapter = value;
//};

