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
//* @class Class for CRUD of Property.
//* @constructor
//* @augments jEntitySet
//*/
/**
 * It creates a new object _pc.PropertyManager.
 * @class This Class is used for performing CRUD operations of Property.
 * @constructor
 * @augments jEntitySet
 * @param {_pc.Accessor} Accessor
 * @param {_pc.PersoniumCollection} collection
 */
_pc.PropertyManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
_pc.PersoniumClass.extend(_pc.PropertyManager, _pc.ODataManager);

/** The purpose of this function is to initialize properties.
 * @param {Object} self
 * @param {_pc.Accessor} as
 * @param {_pc.PersoniumCollection} collection
 */
_pc.PropertyManager.prototype.initializeProperties = function(self, as, collection) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

/**
 * The purpose of this function is to create URL.
 * @returns {String} URL
 */
_pc.PropertyManager.prototype.getUrl = function() {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.cellName,"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.cellName);
  sb += this.accessor.boxName;
  sb +="/";
  sb += this.collection;
  sb += "/$metadata/Property";
  return sb;
};

/**
 * The purpose of this function is to create Property URI.
 * @param {String} entityTypeName
 * @returns {String} URL
 */
_pc.PropertyManager.prototype.getPropertyUri = function (entityTypeName) {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.cellName,"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.cellName);
  sb += this.accessor.boxName;
  sb +="/";
  sb += this.collection;
  sb += "/$metadata/EntityType(";
  sb += "'"+entityTypeName+"'";
//sb += escape("'"+entityTypeName+"'");
  sb += ")/_Property";
  return sb;
};

/**
 * The purpose of this function is to create Property.
 * @param {Object} obj
 * @return {Object} json PersoniumHttpClient
 */
_pc.PropertyManager.prototype.create = function (obj) {
  var json = null;
  json = this.internalCreate(obj);
  if (json.response !== undefined) {
    if (json.response.status === 409 || json.response.status === 400) {
      return json.response.status;
    }
  }
  return json;
};

/**
 * The purpose of this function is to retrieve Property.
 * @param {String} propertyName
 * @param {String} entityTypeName
 * @return {Object} JSON response
 */
_pc.PropertyManager.prototype.retrieve = function (propertyName, entityTypeName) {
  var json = null;
  var key = null;
  key = "Name='"+propertyName+"',_EntityType.Name='"+entityTypeName+"'";
  if (propertyName !== undefined && entityTypeName !== undefined) {
    json = this.internalRetrieveMultikey(key);
  }
  return json;
};

/**
 * The purpose of this function is to retrieve Property List.
 * @param {String} entityTypeName
 * @return {Object} JSON response
 */
_pc.PropertyManager.prototype.retrievePropertyList = function (entityTypeName) {
  if(entityTypeName !== null || entityTypeName !== undefined) {
    var uri = this.getPropertyUri(entityTypeName);
    var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
    var response = restAdapter.get(uri, "application/json");
    var json = response.bodyAsJson().d.results;
    return json;
  }
};

/**
 * The purpose of this function is to delete Property.
 * @param {String} key
 * @param {String} etag
 * @returns {Object} response
 */
_pc.PropertyManager.prototype.del = function(key, etag) {
  if (typeof etag === "undefined") {
    etag = "*";
  }
  var response = this.internalDelMultiKey(key, etag);
  return response;
};
