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
//* @class Ruleのアクセスクラス.
//* @constructor
//* @augments _pc.AbstractODataContext
//*/
/**
 * It creates a new object _pc.Rule.
 * @class This class represents Rule object.
 * @constructor
 * @augments _pc.AbstractODataContext
 * @param {_pc.Accessor} Accessor
 * @param {Object} json
 */
_pc.Rule = function(as, json) {
  this.initializeProperties(this, as, json);
};
_pc.PersoniumClass.extend(_pc.Rule, _pc.AbstractODataContext);

///**
//* プロパティを初期化する.
//* @param {_pc.Rule} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {Object} json JSONオブジェクト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Rule} self
 * @param {_pc.Accessor} as Accessor
 * @param {Object} json JSON object
 */
_pc.Rule.prototype.initializeProperties = function(self, as, json) {
  this.uber = _pc.AbstractODataContext.prototype;
  this.uber.initializeProperties(self, as);

///** クラス名. */
  /** Class name in camel case. */
  self.CLASSNAME = "Rule";


///** Rule名. */
  /** Rule name. */
  self.name = null;
  /** _box.name. */
  self.boxname = null;
  /** event type */
  self.eventtype = null;
  /** event subject */
  self.eventsubject = null;
  /** event object */
  self.eventobject = null;
  /** event info */
  self.eventinfo = null;
  /** event external */
  self.eventexternal = null;
  /** action */
  self.action = null;
  /** target url */
  self.targeturl = null;

  if (json !== undefined && json !== null) {
    self.rawData = json;
    self.name = json.Name;
    self.boxname = json["_Box.Name"];
    self.eventtype = json.EventType;
    self.eventsubject = json.EventSubject;
    self.eventobject = json.EventObject;
    self.eventinfo = json.EventInfo;
    self.eventexternal = json.EventExternal;
    self.action = json.Action;
    self.targeturl = json.TargetUrl;
  }
};

///**
//* クラス名をキャメル型で取得する.
//* @return {?} ODataのキー情報
//*/
/**
 * This method gets the class name.
 * @return {String} Class name
 */
_pc.Rule.prototype.getClassName = function() {
  return this.CLASSNAME;
};

///**
//* Rule名の設定.
//* @param {String} value Rule名
//*/
/**
 * This method sets Rule name.
 * @param {String} value Rule name
 */
_pc.Rule.prototype.setName = function(value) {
  this.name = value;
};

///**
//* Rule名の取得.
//* @return {String} Rule名
//*/
/**
 * This method gets Rule Name.
 * @return {String} Rule name
 */
_pc.Rule.prototype.getName = function() {
  return this.name;
};

///**
//* _box.name値の設定.
//* @param {String} value _box.name値
//*/
/**
 * This method sets Box Name.
 * @param {String} value _box.name value
 */
_pc.Rule.prototype.setBoxName = function(value) {
  this.boxname = value;
};

///**
//* _box.name値の取得.
//* @return {String} _box.name値
//*/
/**
 * This method gets Box Name.
 * @return {String} _box.name value
 */
_pc.Rule.prototype.getBoxName = function() {
  return this.boxname;
};

///**
//* EventTypeの設定.
//* @param {String} value EventType
//*/
/**
 * This method sets Event Type.
 * @param {String} value Event Type
 */
_pc.Rule.prototype.setEventType = function(value) {
  this.eventtype = value;
};

///**
//* EventTypeの取得.
//* @return {String} EventType
//*/
/**
 * This method gets Event Type.
 * @return {String} Event Type
 */
_pc.Rule.prototype.getEventType = function() {
  return this.eventtype;
};

///**
//* EventSubjectの設定.
//* @param {String} value EventSubject
//*/
/**
 * This method sets Event Subject.
 * @param {String} value Event Subject
 */
_pc.Rule.prototype.setEventSubject = function(value) {
  this.eventsubject = value;
};

///**
//* EventSubjectの取得.
//* @return {String} EventSubject
//*/
/**
 * This method gets Event Subject.
 * @return {String} Event Subject
 */
_pc.Rule.prototype.getEventSubject = function() {
  return this.eventsubject;
};

///**
//* EventObjectの設定.
//* @param {String} value EventObject
//*/
/**
 * This method sets Event Object.
 * @param {String} value Event Object
 */
_pc.Rule.prototype.setEventObject = function(value) {
  this.eventobject = value;
};

///**
//* EventObjectの取得.
//* @return {String} EventObject
//*/
/**
 * This method gets Event Object.
 * @return {String} Event Object
 */
_pc.Rule.prototype.getEventObject = function() {
  return this.eventobject;
};

///**
//* EventInfoの設定.
//* @param {String} value EventInfo
//*/
/**
 * This method sets Event Info.
 * @param {String} value Event Info
 */
_pc.Rule.prototype.setEventInfo = function(value) {
  this.eventinfo = value;
};

///**
//* EventInfoの取得.
//* @return {String} EventInfo
//*/
/**
 * This method gets Event Info.
 * @return {String} Event Info
 */
_pc.Rule.prototype.getEventInfo = function() {
  return this.eventinfo;
};

///**
//* EventExternalの設定.
//* @param {String} value EventExternal
//*/
/**
 * This method sets Event External.
 * @param {String} value Event External
 */
_pc.Rule.prototype.setEventExternal = function(value) {
  this.eventexternal = value;
};

///**
//* EventExternalの取得.
//* @return {String} EventExternal
//*/
/**
 * This method gets Event External.
 * @return {String} Event External
 */
_pc.Rule.prototype.getEventExternal = function() {
  return this.eventexternal;
};

///**
//* Actionの設定.
//* @param {String} value Action
//*/
/**
 * This method sets Action.
 * @param {String} value Action
 */
_pc.Rule.prototype.setAction = function(value) {
  this.action = value;
};

///**
//* Actionの取得.
//* @return {String} Action
//*/
/**
 * This method gets Action.
 * @return {String} Action
 */
_pc.Rule.prototype.getAction = function() {
  return this.action;
};

///**
//* TargetUrlの設定.
//* @param {String} value TargetUrl
//*/
/**
 * This method sets TargetUrl.
 * @param {String} value TargetUrl
 */
_pc.Rule.prototype.setTargetUrl = function(value) {
  this.targeturl = value;
};

///**
//* TargetUrlの取得.
//* @return {String} TargetUrl
//*/
/**
 * This method gets TargetUrl.
 * @return {String} TargetUrl
 */
_pc.Rule.prototype.getTargetUrl = function() {
  return this.targeturl;
};

///**
//* Ruleオブジェクトのキーを取得する.
//* @return {String} ODataのキー情報
//*/
/**
 * This method generates key for Rule operations.
 * @return {String} Key
 */
_pc.Rule.prototype.getKey = function() {
  if (this.boxname !== null) {
    return "(_Box.Name='" + this.boxname + "',Name='" + this.name + "')";
  } else {
    return "(_Box.Name=null,Name='" + this.name + "')";
  }
};

///**
//* RuleResourceのURLを取得.
//* @return {String} RuleResouceURL
//*/
/**
 * This method gets the URL of the RuleResource.
 * @return {String} RuleResouceURL
 */
_pc.Rule.prototype.getResourceBaseUrl = function() {
  var sb = "";
  sb += this.accessor.getCurrentCell().getUrl();
  sb += "__rule/";
  if (this.boxname !== null) {
    sb += this.boxname;
  } else {
    sb += "__";
  }
  sb += "/";
  return sb;
};
