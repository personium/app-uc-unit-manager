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
//* @class Entityへアクセスするためのクラス.
//* @constructor
//* @augments _pc.DavCollection
//*/
/**
 * It creates a new object _pc.ODataResponse.
 * @class This class represents Response object.
 * @constructor
 * @augments _pc.DavCollection
 * @param {_pc.Accessor} Accessor
 * @param {Object} json
 * @param {Object} odataJson
 */
_pc.ODataResponse = function(as, json, odataJson) {
  this.initializeProperties(this, as, json, odataJson);
};
_pc.PersoniumClass.extend(_pc.ODataResponse, _pc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {_pc.ODataResponse} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.ODataResponse} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} json JSON object
 * @param {Object} odataJson
 */
_pc.ODataResponse.prototype.initializeProperties = function(self, as, json, odataJson) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

  if ((odataJson !== undefined) && (odataJson !== null)) {
    self.odataJson = odataJson;
    self.body =  null;
  } else {
    if (json !== undefined) {
      self.body = json;
      self.odataJson = null;
    }
  }
};

///**
//* ボディを取得.
//* @return {?} ボディ
//*/
/**
 * This method gets the response body.
 * @return {Object} Body
 */
_pc.ODataResponse.prototype.getBody = function() {
  if (this.body !== null) {
    return this.body;
  }
  return this.odataJson.d.results;
};

///**
//* レスポンスボディ全体を取得.
//* @return {?} ボディ
//*/
/**
 * This method gets the whole body response.
 * @return {Object} Body
 */
_pc.ODataResponse.prototype.getOData = function() {
  return this.odataJson;
};

