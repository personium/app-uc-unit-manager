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
 * It creates a new object _pc.MessageStatusManager.
 * @class This class is used for sending and receiving messages.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 * @param {String} messageId
 */
_pc.MessageStatusManager = function(as, messageId) {
  this.initializeProperties(this, as, messageId);
};
_pc.PersoniumClass.extend(_pc.MessageStatusManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//* @param {_pc.MessageStatusManager} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {string} messageId メッセージID
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.MessageStatusManager} self
 * @param {_pc.Accessor} as Accessor
 * @param {string} messageId messageID
 */
_pc.MessageStatusManager.prototype.initializeProperties = function(self, as, messageId) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);

  self.messageId = messageId;
};

///**
//* URLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL for receiving messages.
 * @returns {String} URL
 */
_pc.MessageStatusManager.prototype.getUrl = function() {
  var sb = "";
  sb += this.getBaseUrl();
  sb += this.accessor.getCurrentCell().getName();
  sb += "/__message/received/";
  sb += this.messageId;
  return sb;
};

///**
//* メッセージを既読にする.
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to read a message.
 * @return {_pc.Message} Message object obtained
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageStatusManager.prototype.changeMailStatusForRead = function() {
  var requestBody = {"Command" : "read"};
  var json = this.internalCreate(JSON.stringify(requestBody));
  return new _pc.Message(this.accessor, json);
};

///**
//* メッセージを未読にする.
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to unread a message.
 * @return {_pc.Message} Message object obtained
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageStatusManager.prototype.changeMailStatusForUnRead = function() {
  var requestBody = {"Command" : "unread"};
  var json = this.internalCreate(JSON.stringify(requestBody));
  return new _pc.Message(this.accessor, json);
};

///**
//* メッセージを承認する.
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to approve a message.
 * @return {_pc.Message} Message object obtained
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageStatusManager.prototype.approveConnect = function() {
  var requestBody = {"Command" : "approved"};
  var json = this.internalCreate(JSON.stringify(requestBody));
  return new _pc.Message(this.accessor, json);
};

///**
//* メッセージを拒否する.
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to reject a message.
 * @return {_pc.Message} Message object obtained
 * @throws {_pc.DaoException} DAO exception
 */
_pc.MessageStatusManager.prototype.rejectConnect = function() {
  var requestBody = {"Command" : "rejected"};
  var json = this.internalCreate(JSON.stringify(requestBody));
  return new _pc.Message(this.accessor, json);
};
