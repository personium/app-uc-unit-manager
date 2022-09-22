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
//* @class RelationのCRUDのためのクラス.
//* @constructor
//* @augments _pc.ODataManager
//*/
/**
 * It creates a new object _pc.RelationManager.
 * @class This class performs CRUD operations for Relation object.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 */
_pc.RelationManager = function(as) {
  this.initializeProperties(this, as);
};
_pc.PersoniumClass.extend(_pc.RelationManager, _pc.ODataManager);

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
_pc.RelationManager.prototype.initializeProperties = function(self, as) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* RelationのURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method generates the URL for relation operations.
 * @returns {String} URL
 */
_pc.RelationManager.prototype.getUrl = function() {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.cellName,"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.cellName);
  sb += "__ctl/Relation";
  return sb;
};

///**
//* Relationを作成.
//* @param {_pc.Relation} obj Relationオブジェクト
//* @return {_pc.Relation} Relationオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs create operation.
 * @param {_pc.Relation} obj Relation object
 * @return {_pc.Relation} Relation object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RelationManager.prototype.create = function(obj) {
  var json = null;
  if (obj.getClassName !== undefined && obj.getClassName() === "Relation") {
    var body = {};
    body.Name = obj.getName();
    body["_Box.Name"] = obj.getBoxName();
    json = this.internalCreate(JSON.stringify(body));
    obj.initializeProperties(obj, this.accessor, json);
    return obj;
  } else {
    var requestBody = JSON.stringify(obj);
    json = this.internalCreate(requestBody);
    if (json.getStatusCode() >= 400) {
      var response = json.bodyAsJson();// throw exception with code
      throw new _pc.DaoException(response.message.value, response.code);
    }
    return new _pc.Relation(this.accessor, json.bodyAsJson().d.results);
  }
};

///**
//* Relationを作成.
//* @param {Object} body リクエストボディ
//* @return {_pc.Relation} 作成したRelationオブジェクト
//* @throws {DaoException} DAO例外
//*/
//_pc.RelationManager.prototype.createAsMap = function(body) {
//var json = internalCreate(body);
//return new _pc.Relation(accessor, json);
//};

///**
//* Relationを取得(複合キー).
//* @param {String} relationName 取得対象のRelation名
//* @param {String}boxName 取得対象のBox名
//* @return {_pc.Relation} 取得したRelationオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs retrieve operation.
 * @param {String} relationName Relation name
 * @param {String} boxName Box name
 * @return {_pc.Relation} Relation object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RelationManager.prototype.retrieve = function(relationName, boxName) {
  var json = null;
  if (typeof boxName === "undefined") {
    json = this.internalRetrieve(relationName);
    //relation doesn't exist and can be created.
    if (json === true) {
      return json;
    } else {
      return new _pc.Relation(this.accessor, json);
    }
  }
  var key = "Name='" + relationName + "',_Box.Name='" + boxName + "'";
  json = this.internalRetrieveMultikey(key);
  //relation doesn't exist and can be created.
  if (json === true) {
    return json;
  } else {
    return new _pc.Relation(this.accessor, json);
  }
};

///**
//* Relation update.
//* @param {String} relationName 削除対象のRelation名
//* @param {String} boxName 削除対象のBox名
//* @param body
//* @param etag
//* @return promise
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs update operation.
 * @param {String} relationName Relation name
 * @param {String} boxName Box name
 * @param {Object} body
 * @param {String} etag
 * @return {_pc.Promise} promise
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RelationManager.prototype.update = function(relationName, boxName, body, etag) {
     var response = null;
     if (boxName !== undefined && boxName !== null) {
      var key = "Name='" + relationName + "',_Box.Name='" + boxName + "'";
     response = this.internalUpdateMultiKey(key, body, etag);
    } else {
       response = this.internalUpdate(relationName, body, etag);
   }
  return response;
};

///**
//* Relationを削除(複合キー).
//* @param {String} relationName 削除対象のRelation名
//* @param {String} boxName 削除対象のBox名
//* @return promise
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs delete operation.
 * @param {String} relationName Relation name
 * @param {String} boxName Box name
 * @return {_pc.Promise} promise
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RelationManager.prototype.del = function(relationName, boxName) {
  var key = "Name='"+relationName+"'";
  if (boxName !== undefined && boxName !== null && boxName !== "__") {
    key += ",_Box.Name='"+boxName+"'";
  }
  var response = this.internalDelMultiKey(key, "*");
  return response;
};

