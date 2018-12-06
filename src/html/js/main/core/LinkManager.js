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
 * It creates a new object _pc.LinkManager.
 * @class This class performs CRUD operations on link between two cell control objects.
 * @constructor
 * @param {_pc.Accessor} Accessor
 * @param {_pc.AbstractODataContext} cx
 * @param {String} classname
 */
_pc.LinkManager = function(as, cx, className) {
  this.initializeProperties(this, as, cx, className);
};

///**
//* プロパティを初期化する.
//* @param {_pc.LinkManager} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {_pc.PersoniumContext} cx ターゲットオブジェクト
//* @param className
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.LinkManager} self
 * @param {_pc.Accessor} as Accessor
 * @param {_pc.PersoniumContext} cx Target object
 * @param {String} className
 */
_pc.LinkManager.prototype.initializeProperties = function(self, as, cx, className) {
///** アクセス主体. */
  /** Accessor object. */
  self.accessor = as;

///** リンク主体. */
  /** Link subject. */
  self.context = cx;

///** リンク先名. */
  /** Class name in camel case. */
  self.className = className;
};

///**
//* リンクを作成.
//* @param {?} cx リンクさせるターゲットオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method creates a link between two cell control objects.
 * @param {Object} cx Target object to be linked
 * @throws {_pc.DaoException} DAO exception
 */
_pc.LinkManager.prototype.link = function(cx) {
  var uri = this.getLinkUrl(cx);

  var body = {};
  body.uri = cx.getODataLink();

  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  restAdapter.post(uri, JSON.stringify(body), "application/json");
};


///**
//* リンクを削除unlink.
//* @param {?} cx リンク削除するターゲットオブジェクト
//* @param callback parameter
//* @throws {DaoException} DAO例外
//*/
/**
 * This method deletes the link between two cell control objects.
 * @param {Object} cx Target object for which link is to be deleted
 * @param {Object} callback parameter
 * @throws {_pc.DaoException} DAO exception
 */
_pc.LinkManager.prototype.unlink = function(cx,callback) {
  var uri = this.getLinkUrl(cx);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var optionsOrEtag = null;
  restAdapter.del(uri + cx.getKey(),optionsOrEtag,callback);
};

/**
 * This method performs Query search by appending query string to URL and
 * returns object.
 * @param {_pc.PersoniumQuery} query
 * @param {Object} callback object
 * @return {Object} json object
 */
_pc.LinkManager.prototype.doSearch = function(query, callback) {
  var url = this.getLinkUrl();
  var qry = query.makeQueryString();
  if ((qry !== null) && (qry !== "")) {
    url += "?" + qry;
  }
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "application/json", "*", function(resp) {
      var responseBody = resp.bodyAsJson();
      var json = responseBody.d.results;
      callback(json);
    });
  } else {
    restAdapter.get(url, "application/json", "*" );
    var json = restAdapter.bodyAsJson().d.results;
    return json;
  }
};

/**
 * This method performs Query search by appending query string to URL and
 * returns ODataResponse.
 * @param {_pc.PersoniumQuery} query
 * @return {_pc.ODataResponse} Response
 */
_pc.LinkManager.prototype.doSearchAsResponse = function(query, callback) {
  var url = this.getLinkUrl();
  var qry = query.makeQueryString();
  if ((qry !== null) && (qry !== "")) {
    url += "?" + qry;
  }
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "application/json", "*", function(resp) {
      var responseBody = resp.bodyAsJson();
      callback(new _pc.ODataResponse(this.accessor, "", responseBody));
    });
  } else {
    restAdapter.get(url, "application/json", "*" );
    return new _pc.ODataResponse(this.accessor, "", restAdapter.bodyAsJson());
  }
};

/**
 * This method generates a query.
 * @return {_pc.PersoniumQuery} Query object
 */
_pc.LinkManager.prototype.query = function() {
  return new _pc.PersoniumQuery(this);
};

/**
 * The purpose of this method is to create URL for calling link API's.
 * @param {Object} cx
 * @return {String} URL
 */_pc.LinkManager.prototype.getLinkUrl = function(cx) {
   var accessor = objCommon.initializeAccessor(this.accessor.getBaseUrl(), this.accessor.getCurrentCell().getName(),"","");
   var objCellManager = new _pc.CellManager(accessor);
   var sb = objCellManager.getCellUrl(this.accessor.getCurrentCell().getName());
   var classNameForURL = null;
   sb += "__ctl/";
   sb += this.context.getClassName();
   sb += this.context.getKey();
   sb += "/$links/";

   if (cx !== undefined) {
     classNameForURL = cx.getClassName();//check style fix
   } /*else {
		sb += "_" + this.className;
	}*/
   classNameForURL = this.className;
   sb += "_" + classNameForURL;
   return sb;
 };

 /**
  * The purpose of this method is to retrieve link between two entities
  * for box profile page.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @return {Object} response
  */
 _pc.LinkManager.prototype.retrieveBoxProfileLinks = function(cx, source,destination,key) {
   var uri = this.getLinkUrlWithKey(cx, source, destination, key);
   var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
   var response = restAdapter.get(uri, "", "application/json");
   return response;
 };

 /**
  * The purpose of this method is to create link url between two entities..
  * @param {String} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @return {String} URL
  */
 _pc.LinkManager.prototype.getLinkUrlWithKey = function(cx, source, destination, key) {
   var accessor = objCommon.initializeAccessor(this.accessor.getBaseUrl(), this.accessor.cellName,"","");
   var objCellManager = new _pc.CellManager(accessor);
   var sb = objCellManager.getCellUrl(this.accessor.cellName);
   sb += "__ctl/";
   sb += source;
   sb += "('" + key + "')"; // account name
   sb += "/$links/";
   sb += "_" + destination;
   return sb;
 };

 /**
  * The purpose of the following method is to create Role URI.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} boxName
  * @param {String} rolename
  * @return {String} role URI
  */
 _pc.LinkManager.prototype.getRoleUri = function(cx, source, destination,
     boxname, rolename) {
   var cBoxName = boxname;
   if (cBoxName !== null) {
     cBoxName = "'" + cBoxName + "'";
   }
   rolename = "'" + rolename + "'";
   var key = "(Name=" + rolename + ",_Box.Name=" + cBoxName + ")";
   key = key.split(" ").join("");
   var accessor = objCommon.initializeAccessor(this.accessor.getBaseUrl(), this.accessor.cellName,"","");
   var objCellManager = new _pc.CellManager(accessor);
   var sb = objCellManager.getCellUrl(this.accessor.cellName);
   sb += "__ctl/";
   sb += destination;
   if(destination === "ExtCell"){
     key = "("+rolename+ ")";
   }
   if(destination === "ExtRole"){
     var relation_box_pair = boxname.split(",");
     key = "(ExtRole=" + rolename + ",_Relation.Name='" + relation_box_pair[0].split(" ").join("") + "',_Relation._Box.Name='"+ relation_box_pair[1].split(" ").join("")+"')";
   }
   sb += key;
	//var roleuri = "{\"uri\":" + "'" + sb;
	var roleuri = "{\"uri\":" + '"' + sb;
	//var roleuri = '{\"uri\":' + '"' + sb;
	roleuri += '"}';
    // roleuri += "'}";
   return roleuri;
 };

 /**
  * The purpose of the following method is to establish link between role and account.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @param {String} boxName
  * @param {String} rolename
  * @param {Boolean} isMultiKey
  * @return {Object} response
  */
 _pc.LinkManager.prototype.establishLink = function(cx, source,
     destination, key, boxname, rolename, isMultiKey) {
   var uri = this.getLinkUrlWithKey(cx, source, destination, key);
   if (isMultiKey === true) {
     uri = this.getLinkUrlWithMultiKey(cx, source, destination, key);
     isMultiKey = false;
   }
   var roleuri = this.getRoleUri(cx, source, destination, boxname,
       rolename);
   var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
   var response = restAdapter.post(uri, roleuri, "application/json");
   return response;
 };

 /**
  * The purpose of the following method is to fetch the linkages between an account and roles.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @param {String} boxName
  * @param {String} rolename
  * @return {Object} response
  */
 _pc.LinkManager.prototype.retrieveAccountRoleLinks = function(cx, source,
     destination, key, boxname, rolename) {
   var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
   var response = "";
   var uri = "";
   if (boxname === "" || rolename === "") {
     uri = this.getLinkUrlWithKey(cx, source, destination,key);
     response = restAdapter.get(uri, "application/json");
   } else {
     uri = this.getLinkUrlWithKey(cx, source, destination,key);
     var roleuri = this.getRoleUri(cx, source, destination,boxname, rolename);
	 response = restAdapter.get(uri, "application/json", roleuri);
   }
   return response;
 };

 /**
  * The purpose of the following method is to fetch the linkages between an role and account.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @return {Object} response
  */
 _pc.LinkManager.prototype.retrieveRoleAccountLinks = function(cx, source,destination, key) {
   var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
   var response;
   var uri = this.getLinkUrlWithMultiKey(cx, source, destination,key);
   response = restAdapter.get(uri, "", "application/json");
   return response;
 };

 /**
  * The purpose of the following method is to make the uri for retrieve account linkage.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @return {String} link URL
  */
 _pc.LinkManager.prototype.getLinkUrlWithMultiKey = function(cx, source, destination, key) {
   var accessor = objCommon.initializeAccessor(this.accessor.getBaseUrl(), this.accessor.cellName,"","");
   var objCellManager = new _pc.CellManager(accessor);
   var sb = objCellManager.getCellUrl(this.accessor.cellName);
   sb += "__ctl/";
   sb += source;
   sb += key ; // Combination of role and box name
   sb += "/$links/";
   sb += "_" + destination;
   return sb;
 };


 /**
  * The purpose of the following method is to unlink two entities.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} key
  * @param {String} boxName
  * @param {String} roleName
  * @return {Object} response
  */
 _pc.LinkManager.prototype.delLink = function(cx, source,
		 destination,key, boxName, roleName) {
	 var uri = null;
	 var response = "";
	 var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
	 if(source == "Relation" || source == "ExtRole"){
		uri = this.getLinkUrlWithMultiKey(cx, source, destination, key);
		 if (destination == "ExtCell"){
			uri += "(Url='" + boxName  + "')";
			response = restAdapter.del(uri, "*","");
			return response;
		}
		} else if (source == "Role") {
			uri = this.getLinkUrlWithMultiKey(cx, source, destination, key, boxName);
			//Role-Relation delete scenario
			if(destination == "Relation"){
				uri += boxName  ;
				response = restAdapter.del(uri, "*","");
				return response;
			}
			if(destination == "ExtCell"){
				uri += "(Url='" + boxName  + "')";
				response = restAdapter.del(uri, "*","");
				return response;
			}
			uri += "(Name='" + boxName  + "')";
			response = restAdapter.del(uri, "*","");
			return response;
		} else{
			uri = this.getLinkUrlWithKey(cx, source, destination,key);
		}
		
		uri += "(Name='" + roleName + "'";
		if (boxName == 'null') {
			uri += ",_Box.Name=" + boxName + ")";
		}
		else {
			uri += ",_Box.Name='" + boxName + "')";	
		}
		response = restAdapter.del(uri, "*","");
		return response;
 };

 /**
  * The purpose of this method is to generate url for creating a link between external cell and relation.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} extCellURL
  * @return {String} URL
  */
 _pc.LinkManager.prototype.getLinkUrlForExtCell = function(cx, source, destination, extCellURL) {
   var accessor = objCommon.initializeAccessor(this.accessor.getBaseUrl(), this.accessor.cellName,"","");
   var objCellManager = new _pc.CellManager(accessor);
   var sb = objCellManager.getCellUrl(this.accessor.cellName);
   sb += "__ctl/";
   sb += source;
   var key = "'"+ extCellURL +"'";
   sb +=  "(" + encodeURIComponent( key) + ")";
   sb += "/$links/";
   sb += "_" + destination;
   return sb;
 };

 /**
  * The purpose of the following method is to establish link between role and account.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} extCellURL
  * @param {String} boxName
  * @param {String} relName
  * @return {_pc.PersoniumHttpClient} response
  */
 _pc.LinkManager.prototype.externalCellRelationlink = function(cx, source,
     destination, extCellURL, boxName, relName) {
   var uri = this
   .getLinkUrlForExtCell(cx, source, destination, extCellURL, relName, boxName);
   var externalCellURI = this.getRoleUri(cx, source, destination, boxName, relName);
   var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
   var response = restAdapter.post(uri, externalCellURI, "application/json");
   return response;
 };

 /**
  * The purpose of the following method is to fetch the linkages between an external cell and relation.
  * @param {Object} cx
  * @param {String} source
  * @param {String} destination
  * @param {String} extCellURL
  * @param {String} boxName
  * @param {String] relName
  * @return {_pc.PersoniumHttpClient} response
  */
 _pc.LinkManager.prototype.retrieveExtCellRelLinks = function(cx, source,
     destination, extCellURL, boxName, relName) {
   var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
   var response;
   var uri = this.getLinkUrlForExtCell(cx, source, destination, extCellURL, relName, boxName);
   response = restAdapter.get(uri, "", "application/json");
   return response;
 };