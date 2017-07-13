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
//* @class OData関連の各機能を生成/削除するためのクラスの抽象クラス.
//* @constructor
//*/
/**
 * It creates a new object _pc.ODataLinkManager.
 * @class This is the abstract class for generating / deleting the OData related functions.
 * @constructor
 * @param {_pc.Accessor} Accessor
 * @param {_pc.AbstractODataContext} cx
 * @param {String} classname
 */
_pc.ODataLinkManager = function(as, cx, className) {
  this.initializeProperties(this, as, cx, className);
};
_pc.PersoniumClass.extend(_pc.ODataLinkManager, _pc.LinkManager);

///**
//* プロパティを初期化する.
//* @param {_pc.ODataLinkManager} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {?} cx ターゲットオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.ODataLinkManager} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} cx Target object
 */
_pc.ODataLinkManager.prototype.initializeProperties = function(self, as, cx, className) {
  this.uber = _pc.LinkManager.prototype;
  this.uber.initializeProperties(self, as, cx, className);
};

///**
//* リンクを削除.
//* @param {?} cx リンク削除するターゲットオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to remove a link.
 * @param {Object} cx Target object for removing the link
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataLinkManager.prototype.unlink = function(cx) {
  var uri = this.getLinkUrl(cx);

  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  restAdapter.del(uri + cx.getKey());
};
