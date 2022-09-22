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
//* @class CellのCRUDを行うクラス.
//* @constructor
//* @augments _pc.ODataManager
//*/
/**
 * It creates a new object _pc.CellManager.
 * @class This class performs CRUD operations for Cell.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 */
_pc.CellManager = function(as) {
  this.initializeProperties(this, as);
};
_pc.PersoniumClass.extend(_pc.CellManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//* @param {_pc.CellManager} self
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.CellManager} self
 * @param {_pc.Accessor} as Accessor
 */
_pc.CellManager.prototype.initializeProperties = function(self, as) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* URLを生成する.
//* @return {String} URL文字列
//*/
/**
 * This method gets the URL for performing cell related operations.
 * @return {String} URL for Cell
 */
_pc.CellManager.prototype.getUrl = function() {
  return this.getBaseUrl() + "__ctl/Cell";
};

///**
//* Cellを作成.
//* @param {Object} body リクエストボディ
//* @param {_pc.Cell} cell
//* @param callback object
//* @return {_pc.Cell} 作成したCellオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs create operation for Cell.
 * @param {Object} body Request body
 * @param {_pc.Cell} cell
 * @param {Object} callback object
 * @return {_pc.Cell} Cell object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.CellManager.prototype.create = function(body, cell, callback) {
  var json = null;
  if (typeof cell !== "undefined") {
    var newBody = {};

    newBody.Name = cell.accessor.cellName;
    json = this.cellCreate(newBody);
    //cell.initialize(this.accessor, json);
	cell.initializeProperties(cell, this.accessor, json.Name);
    return cell;
  }
  if (callback !== undefined) {
    json = this.cellCreate(body, function(resp) {

      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        var responseBody = resp.bodyAsJson();
        var json = responseBody.d.results;
        var newCell = new _pc.Cell(this.accessor, json.Name);
        if (callback.success !== undefined) {
          callback.success(newCell);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
      return;
    });
  } else {
    json = this.cellCreate(body);
    return new _pc.Cell(this.accessor, json.Name);
  }
};

///**
//* Cellを作成.
//* @param {Object} body リクエストボディ
//* @param callback object
//* @return response JSON object
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs Create operation for cell.
 * @param {Object} body Request body
 * @param {Object} callback object
 * @return {Object} response JSON object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.CellManager.prototype.cellCreate = function(body, callback) {
  var url = this.getUrl();
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var headers = {};
  var requestBody = JSON.stringify(body);
  if(callback !== undefined){
    restAdapter.post(url, requestBody, "application/json", headers, callback);
  }else{
    var response = restAdapter.post(url, requestBody, "application/json",headers);
    var responseBody = response.bodyAsJson();
    if(responseBody.d === undefined){
      throw new _pc.DaoException(responseBody.message.value,responseBody.code);
    }
    var json = responseBody.d.results;
    return json;
  }
};

///**
//* retrieve cell.
//* @param {String} id 取得対象のID
//* @return {_pc.Cell} 取得したしたCellオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs the retrieve operation for cell.
 * @param {String} id ID of cell
 * @return {_pc.Cell} Cell object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.CellManager.prototype.retrieve = function(id) {
  if (typeof id !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  var json = this.internalRetrieve(id);
  //TODO-HCL
  if(json === true){  //Cell doesn't exist and can be created.
    return true;
  }
  else{
    //returns response in JSON format.
    this.accessor.cellName = json.Name;
    return new _pc.Cell(this.accessor, json.Name);
  }
  //return new Cell(this.accessor, json.Name);
};

/**
 * Delete Cell.
 * @param {String} cellName
 * @param {String} etag value
 * @return {_pc.Promise} response
 */
_pc.CellManager.prototype.del = function(cellName, etag) {
  var key = "Name='" + cellName + "'";
  var response =  this.internalDelMultiKey(key, etag);
  return response;
};

/**
 * This method gets the unique Etag.
 * @param {String} name
 * @return {String} etag
 */
_pc.CellManager.prototype.getEtag = function(name) {
  var json = this.internalRetrieve(name);
  return json.__metadata.etag;
};

/**
 * The purpose of this method is to get response code.
 * @param cellName
 * @returns {String} responseCode
 */
_pc.CellManager.prototype.getHttpResponseCode = function(cellName) {
  var responseCode = this.exists(cellName);
  return responseCode;
};

/**
 * RECURSIVE DELETE FUNCTION FOR CELL.
 * @param {String} cellName Name of cell to delete.
 * @param {Object} options arbitrary options to call this method.
 * @param {Function} options.success Callback function for successful result.
 * @param {Function} options.error Callback function for error response.
 * @param {Function} options.complete Callback function for any response,  either successful or error.
 * @param {Object} options.headers any extra HTTP request headers to send.
 * @returns {Object} response(sync) or promise(async) (TODO not implemented) depending on the sync/async model.
 */
_pc.CellManager.prototype.recursiveDelete = function(cellName, options) {
  var url = this.getCellUrl(cellName);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if(!options){
    options = {};
  }
  if(!options.headers){
    options.headers = {};
  }
  options.headers["X-Personium-Recursive"] = "true";
  var response = restAdapter.del(url, options);
  return response;
};

/*
 * IMPORT FUNCTION FOR CELL.
 * @param {String} cellName Name of cell to import.
 * @param {Object} body Request body
 * @returns {Object} response JSON object
 */
_pc.CellManager.prototype.cellImport = function(cellName, body) {
  var url = this.getCellUrl(cellName) + "__import";
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var header = {};
  header.Accept = "application/json";
  var requestBody = JSON.stringify(body);

  var response = restAdapter.post(url, requestBody, null, header);
  return response;
};

/*
 * EXPORT FUNCTION FOR CELL.
 * @param {String} cellName Name of cell to export.
 * @param {Object} body Request body
 * @returns {Object} response JSON object
 */
_pc.CellManager.prototype.cellExport = function(cellName, body) {
  var url = this.getCellUrl(cellName) + "__export";
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var header = {};
  header.Accept = "application/json";
  var requestBody = JSON.stringify(body);

  var response = restAdapter.post(url, requestBody, null, header);
  return response;
};

/*
 * ABILITY TO ACQUIRE THE SNAPSHOT FILE SAVED IN THE CELL.
 * @param {String} cellName Name of the cell from which the snapshot is taken.
 * @param {String} filename Snapshot file name
 * @returns {Object} response JSON object
 */
_pc.CellManager.prototype.getSnapshotFile = function(cellName, filename) {
  var url = this.getCellUrl(cellName) + "__snapshot/" + filename + ".zip";
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var header = {};
  header.Accept = "application/json";

  var response = restAdapter.get(url, "application/json");
  return response;
};

_pc.CellManager.prototype.get = function(cellName) {
  var url = this.getCellUrl(cellName);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var accept = "application/json";

  var response = restAdapter.get(url, accept);
  return response.bodyAsJson();
};

_pc.CellManager.prototype.getCellUrl = function(cellName) {
  var cellUrl = "";
  if (!sessionStorage.pathBasedCellUrlEnabled || sessionStorage.pathBasedCellUrlEnabled == "true") {
    cellUrl = this.getBaseUrl() + cellName + "/";
  } else {
    var baseSplit = this.getBaseUrl().split("/");
    baseSplit[2] = cellName + "." + baseSplit[2];
    cellUrl = baseSplit.join("/");
  }
  
  return cellUrl;
};