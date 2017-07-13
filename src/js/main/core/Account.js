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
//* @class Accountのアクセスクラス.
//* @constructor
//* @augments _pc.AbstractODataContext
//*/
/**
 * It creates a new object _pc.Account.
 * @class This class creates an Account as cell control object.
 * @constructor
 * @augments _pc.AbstractODataContext
 * @param {_pc.Accessor} Accessor
 * @param {Object} body 
 */
_pc.Account = function(as, body) {
  this.initializeProperties(this, as, body);
};
_pc.PersoniumClass.extend(_pc.Account, _pc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {_pc.Account} self
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Account} self
 * @param {_pc.Accessor} as accessor
 */
_pc.Account.prototype.initializeProperties = function(self, as, json) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** クラス名. */
  /** Class name. */
  self.CLASSNAME = "Account";

  if (json !== undefined && json !== null) {
    self.rawData = json;
//  /** Account名. */
    /** account name. */
    self.name = json.Name;
  }
  if (typeof self.name === "undefined") {
    self.name = "";
  }
///** パスワード.オブジェクト渡しでAccountを作成する時にだけ利用できる.その後は削除する. */
  /** It is available only when you create the Account. */
  self.setPassword("");
};

///**
//* Account名の設定.
//* @param {String} value
//*/
/**
 * This method sets the account name.
 * @param {String} value
 */
_pc.Account.prototype.setName = function(value) {
  this.name = value;
};

///**
//* Account名の取得.
//* @return {String} Account名
//*/
/**
 * This method gets the account name.
 * @return {String} Account name
 */
_pc.Account.prototype.getName = function() {
  return this.name;
};

///**
//* パスワードの設定.
//* @param {String} value パスワード文字列
//*/
/**
 * This method sets the password.
 * @param {String} value password
 */
_pc.Account.prototype.setPassword = function(value) {
  this.password = value;
};

///**
//* パスワードの取得.
//* @return {String} パスワード文字列
//*/
/**
 * This method gets the password.
 * @return {String} password value
 */
_pc.Account.prototype.getPassword = function() {
  return this.password;
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the Odata key.
 * @return {String} OData key information
 */
_pc.Account.prototype.getKey = function() {
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
_pc.Account.prototype.getClassName = function() {
  return this.CLASSNAME;
};

