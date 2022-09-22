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
 * It creates a new object _pc.ComplexTypePropertyManager.
 * @class This class is used for performing CRUD operations on ComplexTypeProperty.
 * @constructor
 * @augments jEntitySet
 * @param {_pc.Accessor} Accessor
 * @param {_pc.PersoniumCollection} Collection
 */
_pc.ComplexTypePropertyManager = function(as, collection) {
  this.initializeProperties(this, as, collection);
};
_pc.PersoniumClass.extend(_pc.ComplexTypePropertyManager, _pc.ODataManager);

/** The purpose of this function is to initialize properties.
 * @param {Object} self
 * @param {_pc.Accessor} as
 * @param {_pc.PersoniumCollection} collection
 */
_pc.ComplexTypePropertyManager.prototype.initializeProperties = function(self, as,
    collection) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as, collection);
};

/**
 * The purpose of this function is to create URL.
 * @return {String} URL
 */
_pc.ComplexTypePropertyManager.prototype.getUrl = function() {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.cellName,"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.cellName);
  sb += this.accessor.boxName;
  sb +="/";
  sb += this.collection;
  sb += "/$metadata/ComplexTypeProperty";
  return sb;
};

/**
 * The purpose of this function is to get complex type URI.
 * @param {String} complexTypeName
 * @return {String} URL
 */
_pc.ComplexTypePropertyManager.prototype.getComplexTypeUri = function (complexTypeName) {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.cellName,"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.cellName);
  sb += this.accessor.boxName;
  sb +="/";
  sb += this.collection;
  sb += "/$metadata/ComplexType(";
  sb += "'"+complexTypeName+"'";
  //sb += escape("'"+complextypeName+"'");
  sb += ")/_ComplexTypeProperty";
  return sb;
};

/**
 * The purpose of this function is to create ComplexTypeProperty.
 * @param {Object} obj
 * @return {Object} JSON
 */
_pc.ComplexTypePropertyManager.prototype.create = function (obj) {
  var json = null;
  json = this.internalCreate(obj);
  return json;
};

/**
 * The purpose of this function is to retrieve ComplexTypeProperty.
 * @param {String} complextypeName
 * @param {String} complexTypePropertyName
 * @return {Object} JSON
 */
_pc.ComplexTypePropertyManager.prototype.retrieve = function (complextypeName, complexTypePropertyName) {
  var json = null;
  var key = null;
  key = "Name='"+complexTypePropertyName+"',_ComplexType.Name='"+complextypeName+"'";
  if (complexTypePropertyName !== undefined && complextypeName !== undefined) {
    json = this.internalRetrieveMultikey(key);
  }
  return json;
};

/**
 * The purpose of this function is to retrieve ComplexTypePropertyList.
 * @param {String} complextypeName
 * @return {Object} JSON
 */
_pc.ComplexTypePropertyManager.prototype.retrieveComplexTypePropertyList = function (complextypeName) {
  if(complextypeName !== null || complextypeName !== undefined) {
    var uri = this.getComplexTypeUri(complextypeName);
    var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
    var response = restAdapter.get(uri, "application/json");
    var json = response.bodyAsJson().d.results;
    return json;
  }
};

/**
 * The purpose of this function is to delete ComplexTypeProperty
 * @param {String} key
 * @param {String} etag
 * @returns {_pc.Promise} response
 */
_pc.ComplexTypePropertyManager.prototype.del = function(key, etag) {
  if (typeof etag === "undefined") {
    etag = "*";
  }
  var response = this.internalDelMultiKey(key, etag);
  return response;
};