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
//* @class AssociationEndのアクセスクラス.
//* @constructor
//* @augments _pc.AbstractODataContext
//*/
/**
 * It creates a new object _pc.AssociationEnd.
 * @class This is the access class of Association End.
 * @constructor
 * @augments _pc.AbstractODataContext
 * @param {_pc.Accessor} Accessor
 * @param {Object} json
 * @param {String} path
 */
_pc.AssociationEnd = function(as, json, path) {
  this.initializeProperties(this, as, json, path);
};
_pc.PersoniumClass.extend(_pc.AssociationEnd, _pc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {_pc.AbstractODataContext} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.AbstractODataContext} self
 * @param {_pc.Accessor} as accessor
 * @param {Object} json JSON object
 */
_pc.AssociationEnd.prototype.initializeProperties = function(self, as, json, path) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** キャメル型で表現したクラス名. */
  /** Class name */
  this.CLASSNAME = "AssociationEnd";
///** EntityType名. */
  /** EntityType name */
  self.entityTypeName = null;
///** AssociationEnd名. */
  /** AssociationEnd name */
  self.name = null;
///** 多重度. */
  /** Multiplicity */
  self.multiplicity = null;
///** コレクションのパス. */
  /** URL */
  self.url = path;

  /** Link manager of the Account. */
  self.associationEnd = null;
  self.associationEnd = new _pc.MetadataLinkManager(as, this);

  if (json !== undefined && json !== null) {
    self.rawData = json;
    self.name = json.Name;
    self.entityTypeName = json["_EntityType.Name"];
    self.multiplicity = json.Multiplicity;
  }
};

///**
//* AssociationEnd名の設定.
//* @param {String} value AssociationEnd名
//*/
/**
 * This method sets the name for AssociationEnd.
 * @param {String} value AssociationEnd name
 */
_pc.AssociationEnd.prototype.setName = function(value) {
  this.name = value;
};

///**
//* AssociationEnd名の取得.
//* @return {String} AssociationEnd名
//*/
/**
 * This method gets the name of AssociationEnd.
 * @return {String} AssociationEnd name
 */
_pc.AssociationEnd.prototype.getName = function() {
  return this.name;
};

///**
//* EntityType名の設定.
//* @param {String} value EntityType名
//*/
/**
 * This method sets the EntityType name.
 * @param {String} value EntityType name
 */
_pc.AssociationEnd.prototype.setEntityTypeName = function(value) {
  this.entityTypeName = value;
};

///**
//* EntityType名の取得.
//* @return {String} EntityType名
//*/
/**
 * This method gets the EntityType name.
 * @return {String} EntityType name
 */
_pc.AssociationEnd.prototype.getEntityTypeName = function() {
  return this.entityTypeName;
};

///**
//* multiplicityの設定.
//* @param {String} value 多重度
//*/
/**
 * This method sets the multiplicity.
 * @param {String} value multiplicity
 */
_pc.AssociationEnd.prototype.setMultiplicity = function(value) {
  this.multiplicity = value;
};

///**
//* multiplicityの取得.
//* @return {String} 多重度
//*/
/**
 * This method gets the multiplicity.
 * @return {String} multiplicity
 */
_pc.AssociationEnd.prototype.getMultiplicity = function() {
  return this.multiplicity;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the Odata key.
 * @return {String} OData key
 */
//public String getKey() {
_pc.AssociationEnd.prototype.getKey = function() {
  return "(Name='" + this.name + "',_EntityType.Name='" + this.entityTypeName + "')";
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} OData class name
 */
_pc.AssociationEnd.prototype.getClassName = function() {
  return this.CLASSNAME;
};

///**
//* URLを取得.
//* @return URL文字列
//*/
/**
 * This method gets the URL.
 * @return {String} URL value.
 */
_pc.AssociationEnd.prototype.getPath = function() {
  return this.url;
};
