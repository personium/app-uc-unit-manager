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
//* @class Relationのアクセスクラス.
//* @constructor
//* @augments _pc.AbstractODataContext
//*/
/**
 * It creates a new object _pc.Relation.
 * @class This class represents Relation object.
 * @constructor
 * @augments _pc.AbstractODataContext
 * @param {_pc.Accessor} Accessor
 * @param {Object} json
 */
_pc.Relation = function(as, json) {
  this.initializeProperties(this, as, json);
};
_pc.PersoniumClass.extend(_pc.Relation, _pc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {_pc.Relation} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Relation} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} json JSON object
 */
_pc.Relation.prototype.initializeProperties = function(self, as, json) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** クラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "Relation";

///** Relation名. */
  /** Relation Name. */
  self.name = null;
  /** _box.name. */
  self.boxname = null;

///** Roleとのリンクマネージャ. */
  /** Link manager with Role. */
  self.role = null;
///** ExtCellとのリンクマネージャ. */
  /** Link manager with ExtCell. */
  self.extCell = null;

  if (json !== null) {
    self.rawData = json;
    self.name = json.Name;
    self.boxname = json["_Box.Name"];
  }
  if (as !== undefined) {
    self.role = new _pc.LinkManager(as, this, "Role");
    self.extCell = new _pc.LinkManager(as, this, "ExtCell");
  }
};

///**
//* Relation名の設定.
//* @param {String} value Relation名
//*/
/**
 * This method sets the Relation name.
 * @param {String} value Relation name
 */
_pc.Relation.prototype.setName = function(value) {
  this.name = value;
};

///**
//* Relation名の取得.
//* @return {String} Relation名
//*/
/**
 * This method gets the Relation name.
 * @return {String} Relation name
 */
_pc.Relation.prototype.getName = function() {
  return this.name;
};

///**
//* _box.name値の設定.
//* @param {String} value _box.name値
//*/
/**
 * This method sets the box name.
 * @param {String} value _box.name value
 */
_pc.Relation.prototype.setBoxName = function(value) {
  this.boxname = value;
};

///**
//* _box.name値の取得.
//* @return {String} _box.name値
//*/
/**
 * This method gets the box name.
 * @return {String} _box.name value
 */
_pc.Relation.prototype.getBoxName = function() {
  return this.boxname;
};

///**
//* Relationオブジェクトのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the key for Relation.
 * @return {String} Key information
 */
_pc.Relation.prototype.getKey = function() {
  if (this.boxname !== null) {
    return "(_Box.Name='" + this.boxname + "',Name='" + this.name + "')";
  } else {
    return "(_Box.Name=null,Name='" + this.name + "')";
  }
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method returns the class name.
 * @return {String} Class name
 */
_pc.Relation.prototype.getClassName = function() {
  return this.CLASSNAME;
};

