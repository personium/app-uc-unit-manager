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
//* @class ExtCellのアクセスクラス.
//* @constructor
//*/
/**
 * It creates a new object _pc.Event.
 * @class This class represents Event object.
 * @constructor
 */
_pc.Event = function() {
  this.initializeProperties(this);
};

///**
//* プロパティを初期化する.
//* @param {_pc.Event} self
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Event} self
 */
_pc.Event.prototype.initializeProperties = function(self) {
  self.action = "";
  self.level = "";
  self.object = "";
  self.result = "";
};

///**
//* action値の取得.
//* @return {String} action値
//*/
/**
 * This method gets Action.
 * @return {String} action value
 */
_pc.Event.prototype.getAction = function() {
  return this.action;
};

///**
//* action値の設定.
//* @param {String} value action値
//*/
/**
 * This method sets Action.
 * @param {String} value action value
 */
_pc.Event.prototype.setAction = function(value) {
  this.action = value;
};

///**
//* level値の取得.
//* @return {String} level値
//*/
/**
 * This method gets Level.
 * @return {String} level value
 */
_pc.Event.prototype.getLevel = function() {
  return this.level;
};

///**
//* level値の設定.
//* @param {String} value level値
//*/
/**
 * This method sets Level.
 * @param {String} value level value
 */
_pc.Event.prototype.setLevel = function(value) {
  this.level = value;
};

///**
//* object値の取得.
//* @return {String} object値
//*/
/**
 * This method gets Object.
 * @return {String} object value
 */
_pc.Event.prototype.getObject = function() {
  return this.object;
};

///**
//* object値の設定.
//* @param {String} value object値
//*/
/**
 * This method sets Object.
 * @param {String} value object value
 */
_pc.Event.prototype.setObject = function(value) {
  this.object = value;
};

///**
//* result値の取得.
//* @return {String} result値
//*/
/**
 * This method gets Result.
 * @return {String} result value
 */
_pc.Event.prototype.getResult = function() {
  return this.result;
};

///**
//* result値のセット.
//* @param {String} value result値
//*/
/**
 * This method sets Result.
 * @param {String} value result value
 */
_pc.Event.prototype.setResult = function(value) {
  this.result = value;
};

///**
//* JSON文字列化.
//* @return {?} JSON文字列
//*/
/**
 * This method creates JSON of Event values.
 * @return {Object} JSON object
 */
_pc.Event.prototype.toJSON = function() {
  var json = {};
  json.action = this.action;
  json.level = this.level;
  json.object = this.object;
  json.result = this.result;
  return json;
};
