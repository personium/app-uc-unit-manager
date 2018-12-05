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
//* @class ExtCellのアクセスクラス.
//* @constructor
//* @augments _pc.AbstractODataContext
//*/
/**
 * It creates a new object _pc.ExtCell.
 * @class This class represents External Cell to access its related fields.
 * @constructor
 * @augments _pc.AbstractODataContext
 * @param {_pc.Accessor} Accessor
 * @param {Object} body
 */
_pc.ExtCell = function(as, body) {
  this.initializeProperties(this, as, body);
};
_pc.PersoniumClass.extend(_pc.ExtCell, _pc.AbstractODataContext);

///**
//* コンストラクタ.
//*/
//public ExtCell() {
//super();
//}

///**
//* コンストラクタ.
//* @param as アクセス主体
//*/
//public ExtCell(final Accessor as) {
//this.initialize(as, null);
//}

///**
//* コンストラクタ.
//* @param as アクセス主体
//* @param body 生成するExtCellのJson
//*/
//public ExtCell(final Accessor as, JSONObject body) {
//this.initialize(as, body);
//}

///**
//* オブジェクトを初期化.
//* @param as アクセス主体
//* @param json サーバーから返却されたJSONオブジェクト
//*/
//public void initialize(Accessor as, JSONObject json) {

///**
//* プロパティを初期化する.
//* @param {_pc.ExtCell} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {?} json
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.ExtCell} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} json
 */
_pc.ExtCell.prototype.initializeProperties = function(self, as, json) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

  /** クラス名. */
  self.CLASSNAME = "ExtCell";

  /** url. */
  self.url = null;

  /** Roleとのリンクマネージャ. */
  self.role = null;
  /** Relationとのリンクマネージャ. */
  self.relation = null;

  if (json !== null) {
    self.rawData = json;
    self.url = json.Url;
  }
  if (as !== undefined) {
    self.role = new _pc.LinkManager(as, this, "Role");
    self.relation = new _pc.LinkManager(as, this, "Relation");
  }
};

///**
//* urlの設定.
//* @param {String} value URL値
//*/
/**
 * This method sets the URL to perform operations on External Cell.
 * @param {String} value URL value
 */
_pc.ExtCell.prototype.setUrl = function(value) {
  this.url = value;
};

///**
//* urlの取得.
//* @return {String} Role名
//*/
/**
 * This method gets the URL to perform operations on External Cell.
 * @return {String} URL value
 */
_pc.ExtCell.prototype.getUrl = function() {
  return this.url;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method returns the Odata key.
 * @return {String} Key information of OData
 */
_pc.ExtCell.prototype.getKey = function() {
  return "('" + encodeURIComponent(this.url) +"')";
};

///**
//* クラス名をキャメル型で取得する.
//* @return ODataのキー情報
//*/
/**
 * This method returns the class name.
 * @return {String} OData class name
 */
_pc.ExtCell.prototype.getClassName = function() {
  return this.CLASSNAME;
};

