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

/*global _pc:false
 */

///**
//* コマンドを$Batchフォーマットに生成する.
//*/
/**
 * It creates a new object _pc.Batch.
 * @class This class generates the $ Batch format command.
 * @constructor
 * @param {String} batchBoundary
 */
_pc.Batch = function(batchBoundary) {
  this.initializeProperties(this, batchBoundary);
};

///**
//* オブジェクトを初期化.
//* @param {_pc.EntityType} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json サーバーから返却されたJSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.EntityType} self
 * @param {String} as BatchBoundary
 */
_pc.Batch.prototype.initializeProperties = function(self, batchBoundary) {
  self.batch = "";
  self.batchBoundary = batchBoundary;
};

/**
 * This method appends the value to the Batch body.
 * @param {String} body to set.
 */
_pc.Batch.prototype.append = function(value) {
  if (this.batch.length > 0) {
    this.batch += "\r\n";
  }
  this.batch += value;
};

/**
 * This method gets the Batch in specified format.
 * @returns {String} Batch
 */
_pc.Batch.prototype.get = function() {
  this.batch += "\r\n";
  this.batch += ("--" + this.batchBoundary + "--");
  return this.batch;
};
