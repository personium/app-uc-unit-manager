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
 * It creates a new object _pc.EntitySet.
 * @class This is the abstract class for performing the merge functions.
 * @param {_pc.Accessor} Accessor
 * @param {_pc.PersoniumCollection} collection
 * @param {String} name
 */
_pc.EntitySet = function(as, col, name) {
  this.initializeProperties(this, as, col, name);
};
_pc.PersoniumClass.extend(_pc.EntitySet, _pc.ODataManager);

///**
//* プロパティを初期化する.
//* @param {_pc.AbstractODataContext} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {?} col
//* @param {?} name
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.AbstractODataContext} self
 * @param {_pc.Accessor} as Accessor
 * @param {_pc.PersoniumCollection} col
 * @param {String} name
 */
_pc.EntitySet.prototype.initializeProperties = function(self, as, col, name) {
  this.uber = _pc.ODataManager.prototype;
  this.uber.initializeProperties(self, as, col, name);
};

///**
//* Odataデータを部分更新.
//* @param {String} id 部分更新するOdataデータのID値
//* @param {Object} body 部分更新するリクエストボディ
//* @param {String} etag Etag値
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs the partial update of the Odata data.
 * @param {String} id ID value of the data
 * @param {Object} body Request body
 * @param {String} etag Etag value
 * @throws {_pc.DaoException} DAO exception
 */
_pc.EntitySet.prototype.internalMerge = function(id, body, etag, callback) {
  var url = this.getUrl() + "('" + id + "')";
  var rest = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    rest.merge(url, JSON.stringify(body), etag, "application/json", function(resp) {
      callback(resp);
    });
  } else {
    return rest.merge(url, JSON.stringify(body), etag, "application/json");
  }
};

///**
//* Odataデータを部分更新.
//* @param {String} id 対象となるID値
//* @param {Object} body PUTするリクエストボディ
//* @param {String} etag ETag値
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is exposed to perform the partial update of the Odata data.
 * @param {String} id ID value of the data
 * @param {Object} body Request body
 * @param {String} etag ETag value
 * @throws {_pc.DaoException} DAO exception
 */
_pc.EntitySet.prototype.merge = function(id, body, etag, callback) {
  if (callback !== undefined) {
    this.internalMerge(id, body, etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        var odataResponse = new _pc.ODataResponse(resp.accessor, "");
        if (callback.success !== undefined) {
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    this.internalMerge(id, body, etag);
    return new _pc.ODataResponse(this.accessor, "");
  }
};

///**
//* Odataデータを取得.
//* @param {String} id 対象となるID値
//* @throws {DaoException} DAO例外
//*/
/**
 * This method gets Odata as response.
 * @param {String} id ID value
 * @throws {_pc.DaoException} DAO exception
 */
_pc.EntitySet.prototype.retrieveAsResponse = function(id, callback) {
  if (callback !== undefined) {
    this.internalRetrieve(id, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        var responseBody = resp.bodyAsJson();
        var json = responseBody.d.results;
        var odataResponse = new _pc.ODataResponse(resp.accessor, json);
        if (callback.success !== undefined) {
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    var body = this.internalRetrieve(id);
    return new _pc.ODataResponse(this.accessor, body);
  }
};
