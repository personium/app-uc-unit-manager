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
//* @class AssociationEndのCRUDのためのクラス.
//* @constructor
//* @augments _pc.ODataManager
//*/
/**
 * It creates a new object _pc.AssociationEndManager.
 * @class This class performs the CRUD operations for Association End.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 * @param {_pc.PersoniumCollection} col
 */
_pc.AssociationEndManager = function(as, col) {
  this.initializeProperties(this, as, col);
};
_pc.PersoniumClass.extend(_pc.AssociationEndManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//* @param {_pc.AssociationEndManager} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {?} col ?
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.AssociationEndManager} self
 * @param {_pc.Accessor} as accessor
 * @param {_pc.DavCollection} col 
 */
_pc.AssociationEndManager.prototype.initializeProperties = function(self, as, col) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as, col);
};

///**
//* AssociationEndのURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL.
 * @returns {String} URL
 */
_pc.AssociationEndManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/AssociationEnd";
  return sb;
};

///**
//* AssociationEndを作成.
//* @param {_pc.AssociationEnd} obj AssociationEndオブジェクト
//* @return {_pc.AssociationEnd} AssociationEndオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method creates an AssociationEnd.
 * @param {_pc.AssociationEnd} obj AssociationEnd object
 * @return {_pc.AssociationEnd} AssociationEnd object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.AssociationEndManager.prototype.create = function(obj) {
  var json = null;
  var responseJson = null;
  if (obj.getClassName !== undefined && obj.getClassName() === "AssociationEnd") {
    var body = {};
    body.Name = obj.getName();
    body["_EntityType.Name"] = obj.getEntityTypeName();
    body.Multiplicity = obj.getMultiplicity();
    json = this.internalCreate(JSON.stringify(body));
    obj.initializeProperties(obj, this.accessor, json);
    return obj;
  } else {
    if (!("Name" in obj)) {
      throw new _pc.DaoException("Name is required.", "PR400-OD-0009");
    }
    if (!("Multiplicity" in obj)) {
      throw new _pc.DaoException("Multiplicity is required.",
      "PR400-OD-0009");
    }
    if (!("_EntityType.Name" in obj)) {
      throw new _pc.DaoException("_EntityType.Name is required.",
      "PR400-OD-0009");
    }
    var requestBody = JSON.stringify(obj);
    json = this.internalCreate(requestBody);
    if (json.getStatusCode() >= 400) {
      var response = json.bodyAsJson();
      throw new _pc.DaoException(response.message.value, response.code);
    }
    responseJson = json.bodyAsJson().d.results;
    return new _pc.AssociationEnd(this.accessor, responseJson);
  }
};

///**
//* AssociationEndを取得.
//* @param {String} name 取得対象のAssociation名
//* @param {String} entityTypeName EntityType名
//* @return {_pc.AssociationEnd} 取得したしたAssociationEndオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method fetches the AssociationEnd.
 * @param {String} AssociationEnd name
 * @param {String} entityTypeName EntityType name
 * @return {_pc.AssociationEnd} AssociationEnd object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.AssociationEndManager.prototype.retrieve = function(name, entityTypeName) {
  var key = "Name='" + name + "',_EntityType.Name='" + entityTypeName + "'";
  var json = this.internalRetrieveMultikey(key);
  return new _pc.AssociationEnd(this.accessor, json);
};

/**
 * To create url for assocend_navpro_list
 * @param {String} ascName
 * @param {String} entityTypeName
 * @returns {String} URL
 */
_pc.AssociationEndManager.prototype.getNavProListUrl = function(ascName,
    entityTypeName, associationEndView) {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/AssociationEnd";
  sb += "(Name='" + ascName + "',_EntityType.Name='" + entityTypeName + "')/";
  if (associationEndView === true) {
    sb += "$links/";
    associationEndView = false;
  }
  sb += "_AssociationEnd";
  return sb;
};

///**
//* AssociationEndを削除.
//* @param {String} name 取得対象のAssociation名
//* @param {String} entityTypeName EntityType名
//* @return {_pc.Promise} promise
//* @throws {DaoException} DAO例外
//*/
/**
 * This method deletes the AssociationEnd.
 * @param {String} AssociationEnd name
 * @param {String} entityTypeName EntityType name
 * @return {_pc.Promise} promise
 * @throws {_pc.DaoException} DAO exception
 */
_pc.AssociationEndManager.prototype.del = function(name, entityTypeName) {
  var key = "Name='" + name + "',_EntityType.Name='" + entityTypeName + "'";
  var response = this.internalDelMultiKey(key, "*");
  return response;
};

/**
 * To create assocend_navpro_list
 * @param {_pc.AssociationEnd} obj
 * @param {String} fromEntityTypeName
 * @param {String} fromAssEnd
 * @return {_pc.PersoniumHttpClient} response
 */
_pc.AssociationEndManager.prototype.createNavProList = function(obj, fromEntityTypeName, fromAssEnd) {
  if (obj.getClassName !== undefined && obj.getClassName() === "AssociationEnd") {
    var body = {};
    body.Name = obj.getName();
    body.Multiplicity = obj.getMultiplicity();
    body["_EntityType.Name"] = obj.getEntityTypeName();
    var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
    var url = this.getNavProListUrl(fromAssEnd, fromEntityTypeName);
    var response = restAdapter.post(url, JSON.stringify(body), "application/json");
    return response;
  }
};

/**
 * The purpose of this function is to create association URI 
 * for particular entityType.
 * @param {String} entityTypeName
 * @return {String} URL
 */
_pc.AssociationEndManager.prototype.getAssociationUri = function (entityTypeName) {
  var sb = "";
  sb += this.collection.getPath();
  sb += "/$metadata/EntityType(";
  sb += "'"+entityTypeName+"'";
  sb += ")/_AssociationEnd";
  return sb;
};

/**
 * The purpose of this function is to retrieve association
 * list against one entity type.
 * @param {String} entityTypeName 
 * @param {String} associationEndName
 * @return {Object} JSON
 */
_pc.AssociationEndManager.prototype.retrieveAssociationList = function (entityTypeName, associationEndName) {
  var uri = null;
  if(entityTypeName !== null && entityTypeName !== undefined) {
    uri = this.getAssociationUri(entityTypeName);
    if (associationEndName !== undefined && associationEndName !== null){
      uri = this.getNavProListUrl(associationEndName, entityTypeName, true);
    }
  }
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.get(uri, "application/json");
  var json = response.bodyAsJson().d.results;
  return json;
};

/**
 * The purpose of this function is to delete association link
 * @param {String} fromAssociationName
 * @param {String} fromEntityTypeName
 * @param {String} toAssociationName
 * @param {String} toEntityTypeName
 * @return {_pc.Promise} promise
 */
_pc.AssociationEndManager.prototype.delAssociationLink = function(fromAssociationName, fromEntityTypeName, toAssociationName, toEntityTypeName) {
  var uri = this.getNavProListUrl(fromAssociationName, fromEntityTypeName, true);
  uri += "(Name='" + toAssociationName + "'";
  uri += ",_EntityType.Name='" + toEntityTypeName + "')";
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.del(uri, "*","");
  return response;
};