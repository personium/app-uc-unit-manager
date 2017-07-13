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
//* コマンドを$Batchフォーマットに生成する.
//* @class Represents ODataBatch.
//*/
/**
 * This class is used to generate the $ Batch format command.
 * @class Represents ODataBatch.
 * @param {_pc.Accessor} Accessor
 * @param {String} name
 */
_pc.ODataBatch = function(as, name) {
  this.initializeProperties(this, as, name);
};
_pc.PersoniumClass.extend(_pc.ODataBatch, _pc.ODataCollection);

///**
//* オブジェクトを初期化.
//* @param {_pc.EntityType} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json サーバーから返却されたJSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.EntityType} self
 * @param {_pc.Accessor} as Accessor
 * @param {String} name Path to URL
 */
_pc.ODataBatch.prototype.initializeProperties = function(self, as, name) {
  this.uber = _pc.ODataCollection.prototype;
  this.uber.initializeProperties(self, as, name);
  this.accessor.setBatch(true);

  self.odataResponses = [];
};

///**
//* Batchコマンドの実行.
//* @throws DaoException DAO例外
//*/
/**
 * This method is responsible for Batch execution of commands.
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataBatch.prototype.send = function() {
  var url = _pc.UrlUtils.append(this.getPath(), "$batch");
  var boundary = this.accessor.getBatchAdapter().getBatchBoundary();
  var contentType = "multipart/mixed; boundary=" + boundary;

  var rest = new _pc.RestAdapter(this.accessor);
  var res = rest.post(url, this.accessor.getBatchAdapter().getBody(), contentType);

  var parser = new _pc.ODataBatchResponseParser();

  this.odataResponses = parser.parse(res.bodyAsString(), boundary);
};

///**
//* BatchBoundaryを挿入する.
//* @throws DaoException Dao例外
//*/
/**
 * This method is responsible for inserting the BatchBoundary.
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataBatch.prototype.insertBoundary = function() {
  this.accessor.getBatchAdapter().insertBoundary();
};

///**
//* batch実行結果の取得.
//* @return batch実行結果オブジェクト
//*/
/**
 * This method acquires batch execution result.
 * @return {Object} batch execution result object
 */
_pc.ODataBatch.prototype.getBatchResponses = function() {
  return this.odataResponses;
};

/**
 * Batch $links Generate link.
 * @param {String} name EntitySet Name
 * @param {String} id Of User data __id
 * @returns {_pc.BatchLinksEntity} BatchLinksEntity
 */
_pc.ODataBatch.prototype.batchLinksEntity = function(name, id) {
  return new _pc.BatchLinksEntity(name, id, this.accessor, this.getPath());
};

///**
//* Batchの$links登録用リンクターゲットオブジェクトを生成する.
//* @param name EntitySet名
//* @param id ユーザデータの __id
//* @return 生成したリンクターゲットオブジェクト
//*/
/**
 * This method generates a Batch of $ links registration link target object.
 * @param {String} name EntitySet name
 * @param {String} id __id Of user data
 * @return {Object} Generated Link target object
 */
_pc.ODataBatch.prototype.batchLinksTarget = function(name, id) {
  return new _pc.BatchLinksEntity(name, id);
};