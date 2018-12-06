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
//* @class EntityTypeのアクセスクラス.
//* @constructor
//* @augments _pc.AbstractODataContext
//*/
/**
 * It creates a new object _pc.EntityType.
 * @class This class represents the EntityType object.
 * @constructor
 * @augments _pc.AbstractODataContext
 * @param {_pc.Accessor} Accessor
 * @param {Object} body
 */
_pc.EntityType = function(as, body) {
  this.initializeProperties(this, as, body);
};
_pc.PersoniumClass.extend(_pc.EntityType, _pc.AbstractODataContext);

///**
//* オブジェクトを初期化.
//* @param {_pc.EntityType} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json サーバーから返却されたJSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.EntityType} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} json JSON object returned from server
 */
_pc.EntityType.prototype.initializeProperties = function(self, as, json) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** キャメル方で表現したクラス名. */
  /** Class name in camel case. */
  this.CLASSNAME = "EntityType";

///** EntityType名. */
  /** EntityType name. */
  self.name = "";

  if (json !== undefined && json !== null) {
    self.rawData = json;
    self.name = json.Name;
  }
};

///**
//* EntityType名の設定.
//* @param {String} value EntityType名
//*/
/**
 * This method sets the EntityType name.
 * @param {String} value EntityType name
 */
_pc.EntityType.prototype.setName = function(value) {
  this.name = value;
};

///**
//* EntityType名の取得.
//* @return {String} EntityType名
//*/
/**
 * This method gets the EntityType name.
 * @return {String} EntityType name
 */
_pc.EntityType.prototype.getName = function() {
  return this.name;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the Odata key.
 * @return {String} OData key
 */
_pc.EntityType.prototype.getKey = function() {
  return "('" + this.name + "')";
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} OData class name
 */
_pc.EntityType.prototype.getClassName = function() {
  return this.CLASSNAME;
};

