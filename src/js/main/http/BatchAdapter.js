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
//* ＄Batchアクセスのためのリクエストを作成するクラス..
//* @class Represents BatchAdapter.
//*/
/**
 * It creates a new object _pc.BatchAdapter.
 * @class This class is used to create a request for $ Batch access .
 * @constructor
 * @param {_pc.Accessor} Accessor
 */
_pc.BatchAdapter = function(as) {
  this.initializeProperties(this, as);
};

///**
//* プロパティを初期化する.
//*/
/**
 * This method initializes the properties of this class.
 * @param {Object} self
 * @param {_pc.Accessor} as Accessor
 */
_pc.BatchAdapter.prototype.initializeProperties = function(self, as) {
  this.accessor = as;
  this.batchBoundary = "batch_" + this.getUUID();
  this.changeSet = null;
  this.batch = new _pc.Batch(this.batchBoundary);
};

/**
 * This method returns the reference to the accessor.
 * @return {_pc.Accessor} the accessor
 */
_pc.BatchAdapter.prototype.getAccessor = function() {
  return this.accessor;
};

/**
 * This method returns the batch boundary.
 * @return {String} the batchBoundary
 */
_pc.BatchAdapter.prototype.getBatchBoundary = function() {
  return this.batchBoundary;
};

/**
 * This method appends the value to existing or new ChangeSet.
 * @param {String} value
 * @returns {String} value
 */
_pc.BatchAdapter.prototype.appendChangeSet = function(value) {
  if (null === this.changeSet) {
    this.changeSet = new _pc.ChangeSet("changeset_" + this.getUUID(), this.batchBoundary);
  }
  this.changeSet.append(value);
};

/**
 * This method appends value of ChangeSet to Batch and overwrites ChangeSet. 
 */
_pc.BatchAdapter.prototype.writeChangeSet = function() {
  if ( (null !== this.changeSet) && (undefined !== this.changeSet)) {
    this.batch.append(this.changeSet.get());
    this.changeSet = null;
  }
};

///**
//* BatchBoundaryを挿入する.
//* @throws DaoException Dao例外
//*/
/**
 * This method inserts the BatchBoundary.
 * @throws {_pc.DaoException} Dao exception
 */
_pc.BatchAdapter.prototype.insertBoundary = function() {
  this.writeChangeSet();
};

/**
 * This method appends the ChangeSet and returns BatchResponse.
 * @param {String} url
 * @param {String} accept
 * @param {String} etag
 * @returns {_pc.PersoniumBatchResponse} Response
 */
_pc.BatchAdapter.prototype.get = function(url, accept, etag) {
  // 溜めたChangeSetを吐き出す
  /** Update ChangeSet. */
  this.writeChangeSet();
  var cmd = new _pc.Command(this.batchBoundary);
  cmd.method = "GET";
  cmd.url = url;
//cmd.addHeader("Accept-Encoding", "gzip");
  cmd.addHeader("Accept", accept);
  cmd.etag = etag;
  this.batch.append(cmd.get());
  return new _pc.PersoniumBatchResponse();
};

/**
 * This method retrieves the ChangeSet.
 * @param {String} url
 * @returns {_pc.PersoniumBatchResponse} Response
 */
_pc.BatchAdapter.prototype.head = function(url) {
  // 溜めたChangeSetを吐き出す
  this.writeChangeSet();
  return this.get(url, "application/json", null);
};

/**
 * This method updates the ChangeSet.
 * @param {String} url
 * @param {String} data
 * @param {String} etag
 * @param {String} contentType
 * @param {Array} map
 * @returns {_pc.PersoniumBatchResponse} response
 */
_pc.BatchAdapter.prototype.put = function(url, data, etag, contentType, map) {
  var cmd = new _pc.Command();
  cmd.method = "PUT";
  cmd.url = url;
  cmd.addHeader("Content-Type", contentType);
  cmd.etag = etag;
  cmd.setBody(data);
  if( (map !== undefined) && (map !== null)){
    for (var entry in map) {
      cmd.addHeader(entry, map[entry]);
    }
  }
  this.appendChangeSet(cmd.get());
  return new _pc.PersoniumBatchResponse();
};

/**
 * This method creates a ChangeSet.
 * @param {String} url
 * @param {String} data
 * @param {String} contentType
 * @param {Array} map
 * @returns {_pc.PersoniumBatchResponse} response
 */
_pc.BatchAdapter.prototype.post = function(url, data, contentType, map) {
  var cmd = new _pc.Command();
  cmd.method = "POST";
  cmd.url = url;
  cmd.addHeader("Content-Type", contentType);
  cmd.setBody(data);
  if( (map !== undefined) && (map !== null)){
    for (var entry in map) {
      cmd.addHeader(entry, map[entry]);
    }
  }
  this.appendChangeSet(cmd.get());
  return new _pc.PersoniumBatchResponse();
};

/**
 * This method deletes the ChangeSet.
 * @param {String} url
 * @param {String} etag
 */
_pc.BatchAdapter.prototype.del = function(url, etag) {
  var cmd = new _pc.Command();
  cmd.method = "DELETE";
  cmd.url = url;
  cmd.etag = etag;
  this.appendChangeSet(cmd.get());
};

///**
//* $Batchのボディ情報を取得する.
//* @return Batch登録するボディ.
//* @throws DaoException DAO例外
//*/
/**
 * This method gets the body of information $ Batch.
 * @return {_pc.PersoniumBatchResponse} Body to Batch registration.
 * @throws {_pc.DaoException} DAO exception
 */
_pc.BatchAdapter.prototype.getBody = function() {
  // 溜めたChangeSetを吐き出す
  /** Update ChangeSet. */
  this.writeChangeSet();
  return this.batch.get();
};

///**
//* レスポンスボディを受けるMERGEメソッド.
//* @param url リクエスト対象URL
//* @param data 書き込むデータ
//* @param etag ETag
//* @param contentType CONTENT-TYPE値
//* @return PersoniumResponseオブジェクト
//* @throws DaoException DAO例外
//*/
//_pc.BatchAdapter.prototype.merge = function(url, data, etag, contentType) {
////TODO バッチ経由のMERGEメソッドの処理を実装する
//var res = null;
//return res;
//};

///**
//* UUIDを返却する
//* @returns {String}
//*/
/**
 * This method returns the UUID.
 * @returns {String} UUID
 */
_pc.BatchAdapter.prototype.getUUID = function() {
  var S4 = function() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4() +S4());
};

///**
//* レスポンスボディをJSONで取得.
//* @return JSONオブジェクト
//* @throws DaoException DAO例外
//*/
/**
 * This method returns response body in JSON format.
 * @return {Object} JSON object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.BatchAdapter.prototype.bodyAsJson = function() {
  return {"d":{"results":[]}};
};