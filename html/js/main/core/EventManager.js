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
//* @class EventのCRUDためのクラス.
//* @constructor
//*/
/**
 * It creates a new object _pc.EventManager.
 * @class This class performs the CRUD operations for Event object.
 * @constructor
 * @param {_pc.Accessor} Accessor
 */
_pc.EventManager = function(as) {
  this.initializeProperties(this, as);
};

///**
//* プロパティを初期化する.
//* @param {_pc.EventManager} self
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.EventManager} self
 * @param {_pc.Accessor} as Accessor
 */
_pc.EventManager.prototype.initializeProperties = function(self, as) {
  if (as !== undefined) {
//  /** アクセス主体. */
    /** Access subject. */
    self.accessor = as.clone();
  }
};

///**
//* イベントを登録します.
//* @param {Object} body 登録するJSONオブジェクト
//* @param {String} requestKey RequestKeyフィールド
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to register the event.
 * @param {Object} body JSON object to be registered
 * @param {String} requestKey RequestKey object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.EventManager.prototype.post = function(body, requestKey) {
  var url = this.getUrl();
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if ((requestKey === undefined) || (requestKey === null)) {
    restAdapter.post(url, JSON.stringify(body), "application/json");
  } else {
    restAdapter.post(url, JSON.stringify(body), "application/json", {"X-Personium-RequestKey": requestKey});
  }
};

///**
//* イベントのURLを取得する.
//* @return {String} URL
//*/
/**
 * This method generates the URL for performing Event related operations.
 * @return {String} URL
 */
_pc.EventManager.prototype.getUrl = function() {
  var sb = this.accessor.getCurrentCell().getUrl();
  sb += "__event";
  return sb;
};

