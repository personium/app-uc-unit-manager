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
//* @class EntityTypeのCRUDのためのクラス.
//* @constructor
//* @augments jEntitySet 
//*/
/**
 * It creates a new object _pc.EntityManager.
 * @class This class is used for performing CRUD operations for Entity.
 * @constructor
 * @augments jEntitySet
 * @param {_pc.Accessor} Accessor
 * @param {_pc.PersoniumCollection} collection
 */
_pc.EntityManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
_pc.PersoniumClass.extend(_pc.EntityManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 * @param {Object} self
 * @param {_pc.Accessor} Accessor
 * @param {_pc.PersoniumCollection} collection object
 */
_pc.EntityManager.prototype.initializeProperties = function(self, as, collection) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

/**
 * This method creates and returns the URL for performing Entity related operations.
 * @return {String} URL
 */
_pc.EntityManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.collection.getPath();
  return sb;
};

///**
//* Entityを作成.
//* @param jsonData Entityオブジェクト
//* @return {_pc.PersoniumHttpClient} response
//*/
/**
 * This method creates an Entity for the data.
 * @param {Object} jsonData Entity object
 * @return {_pc.PersoniumHttpClient} response
 */
_pc.EntityManager.prototype.create = function(jsonData) {
  var response = this.internalCreate(JSON.stringify(jsonData));
  return response;
};

/**
 * This method retrieves the entity list.
 * return {Object} JSON response
 */
_pc.EntityManager.prototype.retrieve = function(id) {
	var json = this.internalRetrieve(id);
	return json;
};

/**
 * The purpose of this method is to update entity
 * @param {String} entityName entity Name
 * @param {Object} body data
 * @param {String} etag value
 * @return {_pc.PersoniumHttpClient} response
 */
_pc.EntityManager.prototype.update = function(entityName, body, etag) {
  var response = null;
  response = this.internalUpdate(entityName, body, etag);
  return response;
};
/**
 * The purpose of the following method is to delete an entity.
 * @param {String} entityTypeName
 * @param {String} etag
 * @return {_pc.Promise} promise
 */

_pc.EntityManager.prototype.del = function(entityTypeName, etag) {
  var key = encodeURIComponent("'" + entityTypeName + "'");
  var response = this.internalDelMultiKey(key, etag);
  return response;
};
