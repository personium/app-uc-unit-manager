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
 * It creates a new object _pc.SentMessageManager.
 * @class This class performs CRUD for SEnt Messages.
 * @constructor
 * @augments _pc.ODataManager
 * @param {_pc.Accessor} Accessor
 */
_pc.SentMessageManager = function(as) {
  this.initializeProperties(this, as);
};
_pc.PersoniumClass.extend(_pc.SentMessageManager, _pc.ODataManager);

///**
//* プロパティを初期化する.
//* @param {_pc.SentMessageManager} self
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.SentMessageManager} self
 * @param {_pc.Accessor} as Accessor
 */
_pc.SentMessageManager.prototype.initializeProperties = function(self, as) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as);
};

///**
//* URLを取得する.
//* @returns {String} URL
//*/
/**
 * This method returns the URL.
 * @returns {String} URL
 */
_pc.SentMessageManager.prototype.getUrl = function() {
  var sb = "";
  var accessor = objCommon.initializeAccessor(this.getBaseUrl(), this.accessor.getCurrentCell().getName(),"","");
  var objCellManager = new _pc.CellManager(accessor);
  sb = objCellManager.getCellUrl(this.accessor.getCurrentCell().getName());
  sb += "__ctl/SentMessage";
  return sb;
};

///**
//* 送信メッセージを取得.
//* @param {String} messageId メッセージID
//* @return {_pc.Message} 取得したメッセージオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method gets the outgoing messages.
 * @param {String} messageId MessageID
 * @return {_pc.Message} Message object 
 * @throws {_pc.DaoException} DAO exception
 */
_pc.SentMessageManager.prototype.retrieve = function(messageId) {
  var json = this.internalRetrieve(messageId);
  return new _pc.Message(this.accessor, json);
};

/**
 * This method delete message on the basis of messageID
 * @param {String} messageId
 * @param {String} etag
 * @returns {_pc.Promise} response
 */
_pc.SentMessageManager.prototype.del = function(messageId, etag) {
	var key = "'" + messageId + "'";
	var response = this.internalDelMultiKey(key, etag);
	return response;
};
