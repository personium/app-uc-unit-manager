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
//* @class メッセージの送受信のためのクラス.
//* @constructor
//* @augments _pc.ODataManager
//*/
/**
 * It creates a new object _pc.ReceivedMessageManager.
 * @class This class is used for sending and receiving messages.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 * @param {String} message
 */
_pc.ReceivedMessageManager = function(as, message) {
  this.initializeProperties(this, as, message);
};
_pc.PersoniumClass.extend(_pc.ReceivedMessageManager, _pc.ODataManager);

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} OData Class name
 */
_pc.ReceivedMessageManager.prototype.getClassName = function() {
  return this.CLASSNAME;
};

///**
//* ReceivedMessageManagerオブジェクトのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method returns the key.
 * @return {String} OData Key
 */
_pc.ReceivedMessageManager.prototype.getKey = function() {
  return "('" + this.message.messageId + "')";
};


///**
//* プロパティを初期化する.
//* @param {_pc.ReceivedMessageManager} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {_pc.Message} メッセージオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.ReceivedMessageManager} self
 * @param {_pc.Accessor} as Accessor
 * @param {_pc.Message} Message object
 */
_pc.ReceivedMessageManager.prototype.initializeProperties = function(self, as, message) {

///** クラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "ReceivedMessage";


  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
  this.message = message;
};

///**
//* URLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL.
 * @returns {String} URL
 */
_pc.ReceivedMessageManager.prototype.getUrl = function() {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.getCurrentCell().getName(),"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.getCurrentCell().getName());
  sb += "__ctl/ReceivedMessage";
  return sb;
};

///**
//* 受信メッセージを取得.
//* @param {String} messageId メッセージID
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method gets the received message.
 * @param {String} messageId MessageID
 * @return {_pc.Message} Message object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ReceivedMessageManager.prototype.retrieve = function(messageId) {
  var json = this.internalRetrieve(messageId);
  return new _pc.Message(this.accessor, json);
};

///**
//* ReceivedMessageManager Accountに紐づく受信メッセージ一覧または受信メッセージに紐付くAccount一覧.
//* @param {_pc.Account} account メッセージを取得するAccount
//* accountがundefinedの場合は受信メッセージに紐付くAccount一覧を取得
//* @return {_pc.ODataResponse} 一覧取得のレスポンス
//* @throws {DaoException} DAO例外
//*/
/**
 * Account list associated with their incoming messages or incoming message
 * list brute string to ReceivedMessageManager Account.
 * @param {_pc.Account} account Message Account
 * Get the Account list tied with the received message if account is undefined
 * @return {_pc.ODataResponse} Response List
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ReceivedMessageManager.prototype.listOfReadStatus = function(account) {
  var linkManager;
  if(account === undefined){
    linkManager = new _pc.LinkManager(this.accessor, this, "AccountRead");
  }else{
    linkManager = new _pc.LinkManager(account.accessor, account, "ReceivedMessageRead");
  }

  // $linksのinlinecountは取得できない(coreで対応していないため)
  var res = linkManager.query().inlinecount("allpages").runAsResponse();
  return res;
};

///**
//* changeMailStatusForRead Account毎の既読.
//* @param {_pc.Account} account 既読にするAccount
//* @throws {DaoException} DAO例外
//*/
/**
 * This method reads each of changeMailStatusForRead Account.
 * @param {_pc.Account} account Account object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ReceivedMessageManager.prototype.changeMailStatusForRead = function(account) {
  var linkManager = new _pc.LinkManager(this.accessor, this, "AccountRead");
  linkManager.link(account);
};

///**
//* changeMailStatusForUnRead Account毎の未読.
//* @param {_pc.Account} account 既読にするAccount
//* @throws {DaoException} DAO例外
//*/
/**
 * This method unreads each of changeMailStatusForRead Account.
 * @param {_pc.Account} account Account object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ReceivedMessageManager.prototype.changeMailStatusForUnRead = function(account) {
  var linkManager = new _pc.LinkManager(this.accessor, this, "AccountRead");
  linkManager.unlink(account);
};

/**
 * This method delete message on the basis of messageID.
 * @param {String} MessageID
 * @param {String} etag
 * @returns {_pc.Promise} response
 */
_pc.ReceivedMessageManager.prototype.del = function(messageId, etag) {
	var key = "'" + messageId + "'";
	var response = this.internalDelMultiKey(key, etag);
	return response;
};
