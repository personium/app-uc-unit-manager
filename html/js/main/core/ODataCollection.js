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
//* @class ODataへアクセスするためのクラス.
//* @constructor
//* @augments _pc.PersoniumCollection
//*/
/**
 * It creates a new object _pc.ODataCollection.
 * @class This class represents the OData collections for performing OData related operations.
 * @constructor
 * @augments _pc.PersoniumCollection
 * @param {_pc.Accessor} Accessor
 * @param {String} name
 */
_pc.ODataCollection = function(as, name) {
  this.initializeProperties(this, as, name);
};
_pc.PersoniumClass.extend(_pc.ODataCollection, _pc.PersoniumCollection);

///**
//* プロパティを初期化する.
//* @param {_pc.ODataCollection} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {String} name コレクション名
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.ODataCollection} self
 * @param {_pc.Accessor} as Accessor
 * @param {String} name URL for path
 */
_pc.ODataCollection.prototype.initializeProperties = function(self, as, name) {
  this.uber = _pc.PersoniumCollection.prototype;
  this.uber.initializeProperties(self, as, name);

  if (as !== undefined) {
//  /** EntitySetアクセスするためのクラス. */
    /** Manager to access EntityType. */
    self.entityType = new _pc.EntityTypeManager(as, this);
//  /** assosiationendアクセスのためのクラス. */
    /** Manager to access AssociationEnd. */
    self.associationEnd = new _pc.AssociationEndManager(as, this);
  }
};

///**
//* EntitySetの指定.
//* @param {String} name EntitySet名
//* @return {_pc.EntitySet} 生成したEntitySetオブジェクト
//*/
/**
 * This method returns an EntitySet.
 * @param {String} name EntitySet Name
 * @return {_pc.EntitySet} EntitySet object
 */
_pc.ODataCollection.prototype.entitySet = function(name) {
  return new _pc.EntitySet(this.accessor, this, name);
};

///**
//* Batch生成.
//* @return {_pc.ODataBatch} 生成したODataBatchオブジェクト
//*/
/**
 * This method generates the ODataBatch.
 * @return {_pc.ODataBatch} ODataBatch object
 */
_pc.ODataCollection.prototype.makeODataBatch = function() {
  return new _pc.ODataBatch(this.accessor, this.getPath());
};

