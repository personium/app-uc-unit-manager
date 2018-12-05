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
//* @class ComplexTypeのCRUDのためのクラス.
//* @constructor
//* @augments jEntitySet
//*/
/**
 * It creates a new object _pc.ComplexTypeManager.
 * @class This class performs CRUD operations for CmplexType.
 * @constructor
 * @augments jEntitySet
 * @param {_pc.Accessor} Accessor
 * @param {_pc.PersoniumCollection} collection
 */
_pc.ComplexTypeManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
_pc.PersoniumClass.extend(_pc.ComplexTypeManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 * @param {Object} self
 * @param {_pc.Accessor} Accessor
 * @param {_pc.PersoniumCollection} collection object
 */
_pc.ComplexTypeManager.prototype.initializeProperties = function(self, as, collection) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

/**
 * This method gets the URL. 
 * @return {String} URL
 */
_pc.ComplexTypeManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/ComplexType";
  return sb;
};

///**
//* EntityTypeを作成.
//* @param obj EntityTypeオブジェクト
//* @return EntityTypeオブジェクト
//* @throws DaoException DAO例外
//*/
/**
 * This method performs create operation for ComplexType.
 * @param {Object} obj ComplexType object
 * @return {Object} ComplexType object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ComplexTypeManager.prototype.create = function(obj) {
  var json = null;
  json = this.internalCreate(JSON.stringify(obj));
  return json;
};

///**
//* Boxを取得.
//* @param name 取得対象のbox名
//* @return {_pc.EntityType} object
//* @throws DaoException DAO例外
//*/
/**
 * This method performs retrieve operation for ComplexType.
 * @param {String} name ComplexType name
 * @return {_pc.EntityType} object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ComplexTypeManager.prototype.retrieve = function(name) {
  var json = this.internalRetrieve(name);
  return new _pc.EntityType(this.accessor, json);
};

/**
 * The purpose of this method is to create URL for delete operation.
 * @param {String} path
 * @param {String} complexType
 * @returns {String} URL
 */
_pc.ComplexTypeManager.prototype.getPath = function(path, complexType){
  var url = path + "/$metadata/ComplexType('" + complexType + "')";
  return url;
};

///**
//* 指定PathのデータをDeleteします(ETag指定).
//* @param pathValue DAVのパス
//* @param etagValue PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @return {_pc.Promise} promise
//* @throws DaoException DAO例外
//*/
/**
 * This method performs delete operation for ComplexType.
 * @param {String} pathValue DAV path
 * @param {String} etagValue ETag of PUT target. Specify "*" for forcing new or updated
 * @return {_pc.Promise} promise
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ComplexTypeManager.prototype.del = function(path, complexType, etagValue) {
  if (typeof etagValue === undefined) {
    etagValue = "*";
  }
  var url = this.getPath(path, complexType);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.del(url, etagValue,"");
  return response;
};