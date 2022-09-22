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
//* @class Roleのアクセスクラス.
//* @constructor
//* @augments _pc.AbstractODataContext
//*/
/**
 * It creates a new object _pc.Role.
 * @class This class represents Role object.
 * @constructor
 * @augments _pc.AbstractODataContext
 * @param {_pc.Accessor} Accessor
 * @param {Object} json
 */
_pc.Role = function(as, json) {
  this.initializeProperties(this, as, json);
};
_pc.PersoniumClass.extend(_pc.Role, _pc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {_pc.Role} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Role} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} json JSON object
 */
_pc.Role.prototype.initializeProperties = function(self, as, json) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** クラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "Role";


///** Role名. */
  /** Role name. */
  self.name = null;
  /** _box.name. */
  self.boxname = null;

///** Accountとのリンクマネージャ. */
  /** Link with an Account Manager. */
  self.account = null;
///** Relationとのリンクマネージャ. */
  /** Link with an Relation Manager. */
  self.relation = null;
///** ExtCellとのリンクマネージャ. */
  /** Link with an External Cell Manager. */
  self.extCell = null;

  if (json !== undefined && json !== null) {
    self.rawData = json;
    self.name = json.Name;
    self.boxname = json["_Box.Name"];
  }
  if (as !== undefined) {
    self.account = new _pc.LinkManager(as, this, "Account");
    self.relation = new _pc.LinkManager(as, this, "Relation");
    self.extCell = new _pc.LinkManager(as, this, "ExtCell");
  }
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} Class name
 */
_pc.Role.prototype.getClassName = function() {
  return this.CLASSNAME;
};

///**
//* Role名の設定.
//* @param {String} value Role名
//*/
/**
 * This method sets Role name.
 * @param {String} value Role name
 */
_pc.Role.prototype.setName = function(value) {
  this.name = value;
};

///**
//* Role名の取得.
//* @return {String} Role名
//*/
/**
 * This method gets Role Name.
 * @return {String} Role name
 */
_pc.Role.prototype.getName = function() {
  return this.name;
};

///**
//* _box.name値の設定.
//* @param {String} value _box.name値
//*/
/**
 * This method sets Box Name.
 * @param {String} value _box.name value
 */
_pc.Role.prototype.setBoxName = function(value) {
  this.boxname = value;
};

///**
//* _box.name値の取得.
//* @return {String} _box.name値
//*/
/**
 * This method gets Box Name.
 * @return {String} _box.name value
 */
_pc.Role.prototype.getBoxName = function() {
  return this.boxname;
};

///**
//* Roleオブジェクトのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method generates key for Role operations.
 * @return {String} Key
 */
_pc.Role.prototype.getKey = function() {
  if (this.boxname !== null) {
    return "(_Box.Name='" + this.boxname + "',Name='" + this.name + "')";
  } else {
    return "(_Box.Name=null,Name='" + this.name + "')";
  }
};

///**
//* RoleResourceのURLを取得.
//* @return {String} RoleResouceURL
//*/
/**
 * This method gets the URL of the RoleResource.
 * @return {String} RoleResouceURL
 */
_pc.Role.prototype.getResourceBaseUrl = function() {
  var sb = "";
  sb += this.accessor.getCurrentCell().getUrl();
  sb += "__role/";
  if (this.boxname !== null) {
    sb += this.boxname;
  } else {
    sb += "__";
  }
  sb += "/";
  return sb;
};
