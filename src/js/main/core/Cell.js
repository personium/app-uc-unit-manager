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
//* @class Cellへアクセスするためのクラス.
//* @constructor
//* @augments _pc.AbstractODataContext
//*/
/**
 * It creates a new object _pc.Cell.
 * @class This class represents Cell object to perform cell related operations.
 * @constructor
 * @augments _pc.AbstractODataContext
 * @param {_pc.Accessor} Accessor
 * @param {String} key
 */
_pc.Cell = function(as, key) {
  this.initializeProperties(this, as, key);
};
_pc.PersoniumClass.extend(_pc.Cell, _pc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {_pc.Cell} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} body
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Cell} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} body
 */
_pc.Cell.prototype.initializeProperties = function(self, as, body) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** キャメル方で表現したクラス名. */
  /** Class name for Cell. */
  self.CLASSNAME = "Cell";

///** Cell名 (string). */
  /** Cell name (string). */
  self.name = "";
  if (typeof body === "string") {
    self.name = body;
  }
  if (typeof body === "undefined" && self.accessor !== undefined) {
    self.name = self.accessor.getCellName();
  }

  /** location. */
  self.location = null;

///** CellレベルACLへアクセスするためのクラス. */
  /** To access cell level ACL. */
  self.acl = null;
///** メンバーへアクセスするためのクラスインスタンス。cell().accountでアクセス. */
  /** Class instance to access Account. */
  self.account = null;
///** BoxのCRUDを行うマネージャクラス. */
  /** Manager class to perform CRUD of Box. */
  self.box = null;
///** メッセージ送受信を行うマネージャクラス. */
  /** Manager classes for sending and receiving messages. */
  self.message = null;
///** Relation へアクセスするためのクラス. */
  /** Class to access the Relation. */
  self.relation = null;
///** Role へアクセスするためのクラス. */
  /** Class to access the Role. */
  self.role = null;
///** ExtRole へアクセスするためのクラス. */
  /** Class to access the External Role. */
  self.extRole = null;
///** ExtCell へアクセスするためのクラス. */
  /** Class to access the External Cell. */
  self.extCell = null;
///** Event へアクセスするためのクラス. */
  /** Class to access the Event. */
  self.event = null;

//if (this.json !== null) {
//this.rawData = this.json;
//this.name = this.json.Name;
//this.location = this.json.__metadata.uri;
//}

  if (self.accessor !== undefined) {
    self.accessor.setCurrentCell(this);
    self.relation = new _pc.RelationManager(self.accessor);
    self.role = new _pc.RoleManager(self.accessor);
    self.message = new _pc.MessageManager(self.accessor);
//  this.acl = new AclManager(this.accessor);
    self.account = new _pc.AccountManager(self.accessor);
    self.box = new _pc.BoxManager(self.accessor);
//  this.extRole = new ExtRoleManager(this.accessor);
    self.extCell = new _pc.ExtCellManager(self.accessor);
    self.event = new _pc.EventManager(self.accessor);
  }
};

///**
//* Cell名を取得.
//* @return {String} Cell名
//*/
/**
 * This method gets the Cell name.
 * @return {String} Cell name
 */
_pc.Cell.prototype.getName = function() {
  return this.name;
};

///**
//* Cell名を設定.
//* @param {String} value Cell名
//*/
/**
 * This method sets the Cell name.
 * @param {String} value Cell name
 */
_pc.Cell.prototype.setName = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.name = value;
};


///**
//* CellのURLを取得する.
//* @return {String} 取得した CellのURL
//*/
/**
 * This method gets the URL for performing cell related operations.
 * @return {String} URL of the cell
 */
_pc.Cell.prototype.getUrl = function() {
  let sb = "";
  let cellname = encodeURI(this.name);
  var accessor = objCommon.initializeAccessor(this.accessor.getBaseUrl(), cellname,"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(cellname);
  return sb;
};

///**
//* アクセストークンを取得.
//* @return {?} アクセストークン
//* @throws {DaoException} DAO例外
//*/
/**
 * This method gets the access token.
 * @return {String} Access Token
 * @throws {_pc.DaoException} DAO exception
 */
_pc.Cell.prototype.getAccessToken = function() {
  if (this.accessor.getAccessToken() !== null) {
    return this.accessor.getAccessToken();
  } else {
    throw new _pc.DaoException.create("Unauthorized");
  }
};

///**
//* アクセストークンの有効期限を取得.
//* @return {?} アクセストークンの有効期限
//*/
/**
 * This method gets the expiration date of the access token.
 * @return {String} expiration date of the access token
 */
_pc.Cell.prototype.getExpiresIn = function() {
  return this.accessor.getExpiresIn();
};

///**
//* アクセストークンのタイプを取得.
//* @return {?} アクセストークンのタイプ
//*/
/**
 * This method gets the access token type.
 * @return {String} access token type
 */
_pc.Cell.prototype.getTokenType = function() {
  return this.accessor.getTokenType();
};

///**
//* リフレッシュトークンを取得.
//* @return {?} リフレッシュトークン
//* @throws DaoException DAO例外
//*/
/**
 * This method gets the refresh token.
 * @return {String} Refreash token
 * @throws {_pc.DaoException} DAO exception
 */
_pc.Cell.prototype.getRefreshToken = function() {
  if (this.accessor.getRefreshToken() !== null) {
    return this.accessor.getRefreshToken();
  } else {
    throw new _pc.DaoException("Unauthorized");
  }
};

///**
//* リフレッシュの有効期限を取得.
//* @return {?} リフレッシュトークンの有効期限
//*/
/**
 * This method gets the expiration date of the refresh token.
 * @return {String} expiration date of the refresh token
 */
_pc.Cell.prototype.getRefreshExpiresIn = function() {
  return this.accessor.getRefreshExpiresIn();
};

/**
 * This method returns the location.
 * @return {String} location
 */
_pc.Cell.prototype.getLocation = function() {
  return this.location;
};

///**
//* CellのownerRepresentativeAccountsを設定.
//* @param user アカウント名
//* @throws DaoException DAO例外
//*/
//_pc.Cell.prototype.setOwnerRepresentativeAccounts = function(user) {
//var value = "<p:account>" + user + "</p:account>";
//RestAdapter rest = (RestAdapter) RestAdapterFactory.create(this.accessor);
//rest.proppatch(this.getUrl(), "p:ownerRepresentativeAccounts", value);
//};

///**
//* CellのownerRepresentativeAccountsを設定(複数アカウント登録).
//* @param accountName アカウント名の配列
//* @throws DaoException DAO例外
//*/
//public void setOwnerRepresentativeAccounts(String[] accountName) throws DaoException {
//_pc.Cell.prototype.setOwnerRepresentativeAccounts = function(accountName) {
//StringBuilder sb = new StringBuilder();
//for (Object an : accountName) {
//sb.append("<p:account>");
//sb.append(an);
//sb.append("</p:account>");
//}
//RestAdapter rest = (RestAdapter) RestAdapterFactory.create(this.accessor);
//rest.proppatch(this.getUrl(), "p:ownerRepresentativeAccounts", sb.toString());
//};

///**
//* Boxへアクセスするためのクラスを生成.
//* @param {?} boxName Box Name
//* @param {?} schemaValue スキーマ名
//* @return {_pc.Box} 生成したBoxインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates classes to access the Box.
 * @param {String} boxName Box Name
 * @param {String} schemaValue Schema value
 * @return {_pc.Box} Box object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.Cell.prototype.boxCtl = function(boxName, schemaValue) {
  this.accessor.setBoxName(boxName);
  var url = _pc.UrlUtils.append(this.accessor.getCurrentCell().getUrl(), this.accessor.getBoxName());
  return new _pc.Box(this.accessor, {"Name":boxName, "Schema":schemaValue}, url);
};

///**
//* BaseUrl を取得.
//* @return {String} baseUrl 基底URL文字列
//*/
/**
 * This method gets the Base URL.
 * @return {String} baseUrl Base URL
 */
_pc.Cell.prototype.getBaseUrlString = function() {
  return this.accessor.getBaseUrl();
};

///**
//* ODataのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method gets the key of OData.
 * @return {String} OData key
 */
_pc.Cell.prototype.getKey = function() {
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
_pc.Cell.prototype.getClassName = function() {
  return this.CLASSNAME;
};

/**
 * Get the cookie peer key.
 * @returns {String} Cookie Peer key
 */
_pc.Cell.prototype.getCookiePeer = function(){
  return this.accessor.getCookiePeer();
};