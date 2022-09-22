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
 * It creates a new object _pc.MessageManager.
 * @class This class is used for sending and receiving messages.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 */
_pc.MessageManager = function(as) {
  this.initializeProperties(this, as);
};
_pc.PersoniumClass.extend(_pc.MessageManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//* @param {_pc.MessageManager} self
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.MessageManager} self
 * @param {_pc.Accessor} as Accessor
 */
_pc.MessageManager.prototype.initializeProperties = function(self, as) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);

///** 送信メッセージのマネージャクラス. */
  /** Manager class of outgoing messages. */
  self.sent = null;
///** 受信メッセージのマネージャクラス. */
  /** Manager class of incoming messages. */
  self.received = null;

  if (as !== undefined) {
    self.sent = new _pc.SentMessageManager(as, this);
    self.received = new _pc.ReceivedMessageManager(as);
  }
};

///**
//* URLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL for sending messages.
 * @returns {String} URL
 */
_pc.MessageManager.prototype.getUrl = function() {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.getCurrentCell().getName(),"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.getCurrentCell().getName());
  sb += "__message/send";
  return sb;
};

///**
//* 送信メッセージオブジェクトを作成.
//* @param {object} json Jsonオブジェクト
//* @return {_pc.Message} メッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
//_pc.MessageManager.prototype.sendMail = function(json) {

////String boxBound
////,String inReplyTo
////,String to
////,String toRelation
////,String title
////,String body
////,int priority

//return new _pc.Message(this.accessor, json);
//};

///**
//* メッセージを送信する.
//* @param {_pc.Message} message 送信するメッセージオブジェクト
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to send a message.
 * @param {_pc.Message} message Message object to be sent
 * @return {_pc.Message} Message object received
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageManager.prototype.send = function(message) {
  var responseJson = {};
  var requestBody = JSON.stringify(message);
  var json = this.internalCreate(requestBody);
  var responseBody = json.bodyAsJson();
  if (responseBody.d !== undefined && responseBody.d.results !== undefined) {
    responseJson = responseBody.d.results;
  }
  return new _pc.Message(this.accessor, responseJson);
};

///**
//* メッセージを既読にする.
//* @param {String} messageId メッセージID
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to read a message.
 * @param {String} messageId messageID
 * @return {_pc.Message} Message object obtained
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageManager.prototype.changeMailStatusForRead = function(messageId) {
  var statusManager = new _pc.MessageStatusManager(this.accessor, messageId);
  return statusManager.changeMailStatusForRead();
};

///**
//* メッセージを未読にする.
//* @param {String} messageId メッセージID
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to unread a message.
 * @param {String} messageId messageID
 * @return {_pc.Message} Message object obtained
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageManager.prototype.changeMailStatusForUnRead = function(messageId) {
  var statusManager = new _pc.MessageStatusManager(this.accessor, messageId);
  return statusManager.changeMailStatusForUnRead();
};

///**
//* メッセージを承認する.
//* @param {String} messageId メッセージID
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to approve a message.
 * @param {String} messageId messageID
 * @return {_pc.Message} Message object obtained
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageManager.prototype.approveConnect = function(messageId) {
  var statusManager = new _pc.MessageStatusManager(this.accessor, messageId);
  return statusManager.approveConnect();
};

///**
//* メッセージを拒否する.
//* @param {String} messageId メッセージID
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to reject a message.
 * @param {String} messageId messageID
 * @return {_pc.Message} Message object obtained
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageManager.prototype.rejectConnect = function(messageId) {
  var statusManager = new _pc.MessageStatusManager(this.accessor, messageId);
  return statusManager.rejectConnect();
};
