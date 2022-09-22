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
//* @class デタクラの各機能を現したクラスの抽象クラス.
//* @constructor
//* @param as アクセス主体
//*/
/**
 * It creates a new object _pc.AbstractODataContext.
 * @class This is the super class inherited by other cell control classes 
 * showing function of each entity.
 * @constructor
 * @param {_pc.Accessor} as Accessor
 */
_pc.AbstractODataContext = function(as) {
  this.initializeProperties(this, as);
};

///**
//* プロパティを初期化する.
//* @param {_pc.AbstractODataContext} self
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.AbstractODataContext} self
 * @param {_pc.Accessor} as Accessor
 */
_pc.AbstractODataContext.prototype.initializeProperties = function(self, as) {
///** アクセス主体. */
  /** {_pc.Accessor} Accessor */
  if (as !== undefined) {
    self.accessor = as.clone();
  }

///** 登録した時のJSONデータ . */
  /** {Object} JSON data at the time of the registration */
  self.rawData = null;
};

///**
//* アクセス主体を設定する.
//* @param {_pc.Accessor}　as アクセス主体
//*/
/**
 * THis method sets the Accessor object.
 * @param {_pc.Accessor}　as Accessor
 */
_pc.AbstractODataContext.prototype.setAccessor = function(as) {
  this.accessor = as;
};

///**
//* アクセス主体を取得する.
//* @return {_pc.Accessor} アクセス主体
//*/
/**
 * This method fetches the Accessor object.
 * @return {_pc.Accessor} Accessor
 */
_pc.AbstractODataContext.prototype.getAccessor = function() {
  return this.accessor;
};

///**
//* 登録した時のJSONデータ を取得する.
//* @return {Object} 登録した時のJSONデータ
//*/
/**
 * This method gets the JSON data while registration.
 * @return {Object} JSON data at the time of the registration
 */
_pc.AbstractODataContext.prototype.getRawData = function() {
  return this.rawData;
};

///**
//* 登録した時のJSONデータを設定する.
//* @param {Object} json 登録した時のJSONデータ
//*/
/**
 * This method sets the JSON data while registration.
 * @param {Object} JSON data at the time of the registration
 */
_pc.AbstractODataContext.prototype.setRawData = function(json) {
  this.rawData = json;
};

///**
//* JSON文字列を返却.
//* @return {String} JSON文字列
//*/
/**
 * This method converts JSON to string.
 * @return {String} JSON String
 */
_pc.AbstractODataContext.prototype.toJSONString = function() {
  return this.rawData.toJSONString();
};

///**
//* ODataへのリンクを取得する.
//* @return {String} ODataへのリンク
//*/
/**
 * This method returns the Odata link URI.
 * @return {String} OData Link URI
 */
_pc.AbstractODataContext.prototype.getODataLink = function() {
  return this.rawData.__metadata.uri;
};

///**
//* ODataのキーを取得する.
//* @return ODataのキー情報
//*/
//public abstract String getKey();

///**
//* クラス名をキャメル型で取得する.
//* @return ODataのキー情報
//*/
//public abstract String getClassName();

///**
//* 引数で指定されたヘッダの値を取得.
//* @param headerKey 取得するヘッダのキー
//* @return ヘッダの値
//*/
/**
 * This method gets the value of the header which is specified in the argument.
 * @param {String} headerKey HeaderKey
 * @return {String} headerValue
 */
_pc.AbstractODataContext.prototype.getHeaderValue = function(headerKey) {
  var headerValue = this.accessor.getResHeaders()[headerKey];
  if (headerKey === "ETag" && this.body !== null && this.body !== "") {
    headerValue = this.body.__metadata.etag;
  }
  return headerValue;
};
