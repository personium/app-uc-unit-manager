/*
 * Copyright 2012-2013 Fujitsu Limited all rights reserved.
 */
/*global _pc:false */

///**
//* @class ACLのCRUDを行うためのクラス.
//* @constructor
//*/
/**
 * It creates a new object _pc.AclManager.
 * @class This class performs the CRUD operations for ACL.
 * @constructor
 * @param {_pc.Accessor} Accessor
 * @param {_pc.DavCollection} dav
 */
_pc.AclManager = function(as, dav) {
  this.initializeProperties(this, as, dav);
};

///**
//* プロパティを初期化する.
//* @param {_pc.AclManager} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {?} dav
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.AclManager} self
 * @param {_pc.Accessor} as Accessor
 * @param {_pc.PersoniumCollection} dav
 */
_pc.AclManager.prototype.initializeProperties = function(self, as, dav) {
  self.accessor = as;
///** DAVコレクション. */
  /** DAV Collection */
  self.collection = dav;
};


///**
//* ACLを登録する.
//* @param {Object} body リクエストボディ(XML形式)
//* @throws {DaoException} DAO例外
//*/
/**
 * This method registers the ACL.
 * @param {Object} body Request body (XML format)
 * @throws {_pc.DaoException} DAO exception
 */
_pc.AclManager.prototype.set = function(body) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  restAdapter.acl(this.getUrl(), body);
};

///**
//* ACLオブジェクトとしてACLをセットする.
//* @param {_pc.Acl} obj Aclオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method sets the ACL object.
 * @param {_pc.Acl} obj Acl object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.AclManager.prototype.setAsAcl = function(obj) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.acl(this.getUrl(), obj.toXmlString());
  return response;
};


///**
//* ACL情報をAclオブジェクトとして取得.
//* @return {_pc.Acl} Aclオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method gets ACL information.
 * @return {_pc.Acl} Acl object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.AclManager.prototype.get = function() {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  restAdapter.propfind(this.getUrl());
  return _pc.Acl.parse(restAdapter.bodyAsString());
};

///**
//* URLを生成.
//* @return {?} 現在のコレクションへのURL
//*/
/**
 * This method returns the URL.
 * @return {String} URL of current collection
 */
_pc.AclManager.prototype.getUrl = function() {
  return this.collection.getPath();
};

