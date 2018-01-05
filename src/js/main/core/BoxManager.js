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
//* @class BoxのCRUDのためのクラス.
//* @constructor
//* @augments _pc.ODataManager
//*/
/**
 * It creates a new object _pc.BoxManager.
 * @class This class performs CRUD operations for Box.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 */
_pc.BoxManager = function(as) {
  this.initializeProperties(this, as);
};
_pc.PersoniumClass.extend(_pc.BoxManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//* @param {_pc.BoxManager} self
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.BoxManager} self
 * @param {_pc.Accessor} as Accessor
 */
_pc.BoxManager.prototype.initializeProperties = function(self, as) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* BoxのURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method generates the URL for performing operations on Box.
 * @returns {String} URL
 */
_pc.BoxManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.cellName;
  sb += "/__ctl/Box";
  return sb;
};

///**
//* Boxを作成.
//* @param {_pc.Box} obj Boxオブジェクト
//* @return responseJson
//* @throws {DaoException} DAO例外
//*/
/**
 * This method creates a new Box.
 * @param {_pc.Box} obj Box object
 * @return {Object} responseJson
 * @throws {_pc.DaoException} DAO exception
 */
_pc.BoxManager.prototype.create = function(obj) {
  var body = {};
  body.Name = obj.accessor.boxName;
  //var boxName = body.Name;
  var schema = obj.accessor.boxSchema;
  var schemaLen = schema.length;
  if(schemaLen !== 0) {
    body.Schema = schema;
  }
  var requestBody = JSON.stringify(body);
  var response = this.internalCreate(requestBody);
  var responseJson = null;
  if (response.getStatusCode() >= 400) {
    responseJson = response.bodyAsJson();
    throw new _pc.DaoException(responseJson.message.value,responseJson.code);
  }
  responseJson = response.bodyAsJson().d.results;
  return responseJson;
  /*if(json !== undefined && json.response === undefined) {
		var objCommon = new common();
		addSuccessClass();
		inlineMessageBlock();
		boxTableRefresh();
		var shorterBoxName = objCommon.getShorterEntityName(boxName);
		document.getElementById("successmsg").innerHTML = "Box "+shorterBoxName+" created successfully!";
		document.getElementById("successmsg").title = boxName;
		$('#createBoxModal, .window').hide();
		autoHideMessage();
	}*/
  /*if(json.response !== undefined) {
		return json;
	}*/
  /*var path = _pc.UrlUtils.append(accessor.getCurrentCell().getUrl(), body.Name);
	obj.initialize(this.accessor, json, path);
	return obj;*/
//var body = {};
//body.Name = obj.getName();
//body.Schema = obj.getSchema();
//var json = this.internalCreate(body);
//var path = _pc.UrlUtils.append(accessor.getCurrentCell().getUrl(), body.Name);
//obj.initialize(this.accessor, json, path);
//return obj;
//var requestBody = JSON.stringify(obj);
//var json = this.internalCreate(requestBody);
//return new _pc.Box(this.accessor, json, _pc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), obj.Name));
};

///**
//* The purpose of this function is to refresh the boxList.
//*/
/*function boxTableRefresh() {
	var contextRoot = sessionStorage.contextRoot;
	$("#mainContent").html('');
	$("#mainContent").load(contextRoot+'/htmls/boxListView.html', function() {
		if(navigator.userAgent.indexOf("Firefox") != -1) {
			createBoxTable();
		}
	});
}*/

///**
//* Boxを作成.
//* @param {Object} body リクエストボディ
//* @return {_pc.Box} 作成したBoxオブジェクト
//* @throws {DaoException} DAO例外
//*/
//_pc.BoxManager.prototype.createAsMap = function(body) {
//var requestBody = JSON.stringify(body);
//var json = this.internalCreate(requestBody);
//return new _pc.Box(this.accessor, json, _pc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), body.Name));
//};

///**
//* Boxを取得.
//* @param {String} name 取得対象のbox名
//* @return {_pc.Box} 取得したしたBoxオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method fetches the box details.
 * @param {String} name Box name
 * @return {_pc.Box} Box object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.BoxManager.prototype.retrieve = function(name) {
  var json = this.internalRetrieve(name);
  //box doesn't exist and can be created.
  /*if(json === true){
    return true;
  }else{*/
    //return new _pc.Box(this.accessor, json);
    return new _pc.Box(this.accessor, json,_pc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), name));
  //}
  //var json = this.internalRetrieve(name);
  //return new _pc.Box(this.accessor, json, _pc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), name));
};

/**
 * The purpose of this function is to return array of boxes.
 * @param {String} name
 * @returns {Object] json
 */
_pc.BoxManager.prototype.getBoxes = function(name) {
  var json = this.internalRetrieve(name);
  return json;
};

/**
 * This method deletes a BOx against a cellName and etag.
 * @param {String} cellName
 * @param {String} etag
 * @returns {Object} json
 */
_pc.BoxManager.prototype.del = function(cellName, etag) {
  var key = "Name='" + cellName + "'";
  var response = this.internalDelMultiKey(key, etag);
  return response;
};

/**
 * This method gets Etag of the Box.
 * @param {String} name
 * @return {String} Etag
 */
_pc.BoxManager.prototype.getEtag = function(name) {
  var json = this.internalRetrieve(name);
  return json.__metadata.etag;
};

/**
 * This method update the box details.
 * @param {String} boxName name
 * @param {Object} request body
 * @param {String} etag value
 * @return {_pc.ODataResponse} response
 */
_pc.BoxManager.prototype.update = function(boxName, body, etag) {
  var response = this.internalUpdate(boxName, body, etag);
  return response;
};

/**
 * RECURSIVE DELETE FUNCTION FOR BOX.
 * @param {String} boxName Name of box to delete.
 * @param {String} etag: ETag of target.
 * @returns {Object} response(sync) or promise(async) (TODO not implemented) depending on the sync/async model.
 */
_pc.BoxManager.prototype.recursiveDelete = function(boxName, etag) {
  var url = this.getBaseUrl() + this.accessor.cellName + "/" + boxName;
console.log(url);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var options = {};
  options.headers = {};
  options.headers["X-Personium-Recursive"] = true;
  options.headers["If-Match"] = etag;
  var response = restAdapter.del(url, options);
  return response;
};