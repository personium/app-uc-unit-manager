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
//* @class RuleのCRUDのためのクラス.
//* @constructor
//* @augments _pc.ODataManager
//*/
/**
 * It creates a new object _pc.RuleManager.
 * @class This class performs CRUD operations for Rule object.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 */
_pc.RuleManager = function(as) {
  this.initializeProperties(this, as);
};
_pc.PersoniumClass.extend(_pc.RuleManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//* @param {_pc.Accessor} self
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Accessor} self
 * @param {_pc.Accessor} as Accessor
 */
_pc.RuleManager.prototype.initializeProperties = function(self, as) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* RuleのリクエストURLを取得する.
//* @returns {String} URL
//*/
/**
 * This method gets the URL for Rule operations.
 * @returns {String} URL
 */
_pc.RuleManager.prototype.getUrl = function() {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.cellName,"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.cellName);
  sb += "__ctl/Rule";
  return sb;
};

///**
//* Ruleを作成.
//* @param {_pc.Rule} obj Ruleオブジェクト
//* @return {_pc.Rule} Ruleオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method creates a Rule.
 * @param {_pc.Rule} obj Rule object
 * @return {_pc.Rule} Rule object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RuleManager.prototype.create = function(obj) {
  var json = null;
  var responseJson = null;
  if (obj.getClassName !== undefined && obj.getClassName() === "Rule") {
    console.log("true:" + obj.getClassName());
    var body = {};
    body.Name = obj.getName();
    body["_Box.Name"] = obj.getBoxName();
    body.EventType = obj.getEventType();
    body.EventSubject = obj.getEventSubject();
    body.EventObject = obj.getEventObject();
    body.EventInfo = obj.getEventInfo();
    body.EventExternal = obj.getEventExternal();
    body.Action = obj.getAction();
    body.TargetUrl = obj.getTargetUrl();
    json = this.internalCreate(JSON.stringify(body));
    responseJson = json.bodyAsJson().d.results;
    obj.initializeProperties(obj, this.accessor, responseJson);
    return obj;
  } else {
    console.log("false");
    var requestBody = JSON.stringify(obj);
    json = this.internalCreate(requestBody);
    if(json.getStatusCode() >= 400){
      var response = json.bodyAsJson();
      throw new _pc.DaoException(response.message.value, response.code);
    }
    return new _pc.Rule(this.accessor, json.bodyAsJson().d.results);
  }
};

///**
//* Ruleを取得(複合キー).
//* @param {String} ruleName 取得対象のRule名
//* @param {String}boxName 取得対象のBox名
//* @return {_pc.Rule} 取得したしたRuleオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method retrieves a Rule object.
 * @param {String} ruleName Rule Name
 * @param {String}boxName Box name
 * @return {_pc.Rule} Rule object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RuleManager.prototype.retrieve = function(ruleName, boxName) {
  var json = null;
  if (typeof boxName === "undefined") {
    json = this.internalRetrieve(ruleName);

    //rule doesn't exist and can be created.
    if (json === true) {
      return json;
    } else {
      return new _pc.Rule(this.accessor, json);
    }
  }
  var key = "Name='" + ruleName + "',_Box.Name='" + boxName + "'";
  json = this.internalRetrieveMultikey(key);
  //rule doesn't exist and can be created.
 /* if (json === true) {
    return json;
  } else {*/
    return new _pc.Rule(this.accessor, json);
  //}
};

/**
 * The purpose of this function is to update rule details
 * @param {String} ruleName
 * @param {String} boxName
 * @param {Object} body
 * @param {String} etag
 * @return {Object} response PersoniumHttpClient
 */
_pc.RuleManager.prototype.update = function(ruleName, boxName, body, etag) {
  var response = null;
  if (boxName !== undefined && boxName !== null) {
    var key = "Name='" + ruleName + "',_Box.Name='" + boxName + "'";
    response = this.internalUpdateMultiKey(key, body, etag);
  } else {
    response = this.internalUpdate(ruleName, body, etag);
  }
  return response;
};

///**
//* Ruleを削除.
//* @param {String} ruleName 削除対象のRule名
//* @param {String} boxName 削除対象のBox名
//* @return response promise
//* @throws {DaoException} DAO例外
//*/
/**
 * This method deletes a Rule.
 * @param {String} ruleName Rule Name
 * @param {String} boxName Box Name
 * @return {Object} response
 * @throws {_pc.DaoException} DAO exception
 */
_pc.RuleManager.prototype.del = function(ruleName, boxName) {
  var key = "Name='" + ruleName + "'";
  if (boxName !== undefined && boxName !== null && boxName !=="undefined") {
    key += ",_Box.Name='" + boxName + "'";
  }
  var response = this.internalDelMultiKey(key, "*");
  return response;
};
