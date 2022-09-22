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
 * It creates a new object _pc.ExtRoleManager.
 * @class This class performs CRUD operations for External Role.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 */
_pc.ExtRoleManager = function(as) {
  this.initializeProperties(this, as);
};
_pc.PersoniumClass.extend(_pc.ExtRoleManager, _pc.ODataManager);

/**
 * This method initializes the properties of this class.
 * @param {_pc.ExtRoleManager} self
 * @param {_pc.Accessor} as
 */
_pc.ExtRoleManager.prototype.initializeProperties = function(self, as) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};


/**
 * The purpose of this function is to make request URL for
 * creating External Role.
 * @return {String} URL
 */
_pc.ExtRoleManager.prototype.getUrl = function() {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.cellName,"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.cellName);
  sb += "__ctl/ExtRole";
  return sb;
};

/**
 * The purpose of this function is to create External Role.
 * @param {String} extCellName
 * @param {String} extRoleName
 * @return {_pc.PersoniumHttpClient} response
 * @throws {_pc.DaoException} Exception thrown
 */
_pc.ExtRoleManager.prototype.create = function(obj) {
  var body = {};
  body.ExtRole = obj.ExtRoleURL;
  body["_Relation.Name"] = obj.RelationName;
  body["_Relation._Box.Name"] = obj.RelationBoxName;
  var requestBody = JSON.stringify(body);
  var json = this.internalCreate(requestBody);
  if (json.getStatusCode() >= 400) {
	var response = json.bodyAsJson();// throw exception with code
	throw new _pc.DaoException(response.message.value, response.code);
  }
  return json;
};


/**
 * The purpose of this function is to retrieve External Role.
 * @param {String} id
 * @return {Object} JSON response
 */
_pc.ExtRoleManager.prototype.retrieve = function(id) {
  var json = this.internalRetrieve(id);
  return json;
};

/**
* The purpose of this function is to delete external role on the basis of key.
* @param {String} key
* @param {String} etag
* @returns {_pc.Promise} response
*/
_pc.ExtRoleManager.prototype.del = function(key,etag) {
	var response = this.internalDelMultiKey(key, etag);
	return response;
};

/**
 * The purpose of this function is to return etag value of
 * particular external role
 * @param {String} key
 * @returns {String} etag
 */
_pc.ExtRoleManager.prototype.getEtag = function(key) {
	var json = this.internalRetrieveMultikey(key);
	return json.__metadata.etag;
};

/**
 * The purpose of this function is to update External Role.
 * @param {String} extCellName
 * @param {String} extRoleName
 * @return {_pc.PersoniumHttpClient} response
 * @throws {_pc.DaoException} Exception thrown
 */
_pc.ExtRoleManager.prototype.update = function(key, obj) {
  var body = {};
  body.ExtRole = obj.ExtRoleURL;
  body["_Relation.Name"] = obj.RelationName;
  body["_Relation._Box.Name"] = obj.RelationBoxName;
  var etag = this.getEtag(key);
  var headers = {};
  headers["Accept"] = "application/json";
  var response = this.internalUpdateMultiKey(key, body, etag, headers);
  return response;
};