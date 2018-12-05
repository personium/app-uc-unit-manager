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
//* @class ユニット昇格後のAccessor.
//* @constructor
//* @augments _pc.Accessor
//*/
/**
 * It creates a new object _pc.OwnerAccessor.
 * @class This class represents Accessor of the unit after promotion.
 * @constructor
 * @augments _pc.Accessor
 * @param {_pc.PersoniumContext} personiumContext
 * @param {_pc.Accessor} Accessor
 */
_pc.OwnerAccessor = function(personiumContext, as) {
  this.initializeProperties(this, personiumContext, as);
};
_pc.PersoniumClass.extend(_pc.OwnerAccessor, _pc.Accessor);

///**
//* プロパティを初期化する.
//* @param {_pc.OwnerAccessor} self
//* @param {?} personiumContext コンテキスト
//* @param {_pc.Accessor} as アクセス主体
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.OwnerAccessor} self
 * @param {_pc.PersoniumContext} personiumContext Context
 * @param {_pc.Accessor} as Accessor
 */
_pc.OwnerAccessor.prototype.initializeProperties = function(self, personiumContext, as) {
  this.uber = _pc.Accessor.prototype;
  this.uber.initializeProperties(self, personiumContext);

  if (as !== undefined) {
    self.setAccessToken(as.getAccessToken());
    self.setAccessType(as.getAccessType());
    self.setCellName(as.getCellName());
    self.setUserId(as.getUserId());
    self.setPassword(as.getPassword());
    self.setSchema(as.getSchema());
    self.setSchemaUserId(as.getSchemaUserId());
    self.setSchemaPassword(as.getSchemaPassword());
    self.setTargetCellName(as.getTargetCellName());
    self.setTransCellToken(as.getTransCellToken());
    self.setTransCellRefreshToken(as.getTransCellRefreshToken());
    self.setBoxSchema(as.getBoxSchema());
    self.setBoxName(as.getBoxName());
    self.setBaseUrl(as.getBaseUrl());
    self.setContext(as.getContext());
    self.setCurrentCell(as.getCurrentCell());
    self.setDefaultHeaders(as.getDefaultHeaders());
  }

  // Unit昇格
  /** Unit promotion. */
  self.owner = true;

  if (personiumContext !== undefined && as !== undefined) {
    self.authenticate();
    self.unit = new _pc.UnitManager(this);
  }
};

