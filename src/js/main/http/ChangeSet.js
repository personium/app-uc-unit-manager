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
//* $Batchの複数ChangeSetをまとめる.
//* @class Represents ChangeSet.
//*/
/**
 * It creates a new object _pc.ChangeSet.
 * @class This class puts together a multiple ChangeSet of $ Batch.
 * @constructor
 * @param {String} value
 * @param {String} batchBoundary
 */
_pc.ChangeSet = function(value, batchBoundary) {
  this.initializeProperties(this, value, batchBoundary);
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
 * @param {String} as ChangeSetBoundary
 * @param {String} BatchBoundary
 */
_pc.ChangeSet.prototype.initializeProperties = function(self, value, batchBoundary) {
  self.changesetBoundary = value;
  self.body = null;
  self.batchBoundary = batchBoundary;
};

/**
 * This method appends the value to ChangeSetBoundary.
 * @param {String} value
 */
_pc.ChangeSet.prototype.append = function(value) {
  if (this.body === null) {
    this.body = "";
  } else {
    this.body += "\r\n";
  }
  /** ChangeSetHeader. */
  this.body += ("--" + this.changesetBoundary + "\r\n");
  this.body += ("Content-Type: application/http" + "\r\n");
  this.body += ("Content-Transfer-Encoding: binary" + "\r\n");
  this.body += "\r\n";

  this.body += value;
};

/**
 * This method retuns the ChangeSet data.
 * @returns {String} sb.
 */
_pc.ChangeSet.prototype.get = function(){
  this.body += "\r\n";
  var sb = "";
  var changeSetFooter = "--" + this.changesetBoundary + "--";
  sb += ("--" + this.batchBoundary + "\r\n");
  sb += ("Content-Type: multipart/mixed; boundary=" + this.changesetBoundary + "\r\n");
  // Content-Length
  try {
    sb += ("Content-Length: " + this.body.length + changeSetFooter.length + "\r\n");
  } catch (e) {
    throw _pc.DaoException(e.getMessage());
  }
  sb += "\r\n";
  // ChangeSetBody
  sb += this.body;
  sb += (changeSetFooter + "\r\n");
  return sb;
};
