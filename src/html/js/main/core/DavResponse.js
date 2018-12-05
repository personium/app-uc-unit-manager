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
//* @class DAVリソースへアクセスするためのクラス.
//* @constructor
//* @augments _pc.DavCollection
//*/
/**
 * It creates a new object _pc.DavResponse.
 * @class This class is used to access the DAV resource.
 * @constructor
 * @augments _pc.DavCollection
 * @param {_pc.Accessor} Accessor
 * @param {Object} json
 */
_pc.DavResponse = function(as, json) {
  this.initializeProperties(this, as, json);
};
_pc.PersoniumClass.extend(_pc.DavResponse, _pc.DavCollection);

///**
//* プロパティを初期化する.
//* @param {_pc.DavResponse} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.DavResponse} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} json JSON object
 * @param {String} path
 */
_pc.DavResponse.prototype.initializeProperties = function(self, as, body) {
  this.uber = _pc.DavCollection.prototype;
  this.uber.initializeProperties(self, as);

  if (body !== undefined) {
    self.body = body;
  }
};

///**
//* ボディを取得.
//* @return {?} ボディ
//*/
/**
 * This method is used to return the body.
 * @return {Object} Body
 */
_pc.DavResponse.prototype.getBody = function() {
  return this.body;
};
