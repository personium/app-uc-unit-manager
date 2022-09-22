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

/**
 * It creates a new object _pc.ODataManager.
 * @class This is the abstract class for generating / deleting the OData related functions and serves
 * as middle layer in API calls for CRUD operations.
 * @constructor
 * @param {_pc.Accessor} Accessor
 * @param {Object} col
 * @param {String} name
 */
_pc.ODataManager = function(as, col, name) {
  this.initializeProperties(this, as, col, name);
};

///**
//* プロパティを初期化する.
//* @param {_pc.AbstractODataContext} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {_pc.PersoniumCollection} col
//* @param name entitySetName
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.AbstractODataContext} self
 * @param {_pc.Accessor} as Accessor
 * @param {_pc.PersoniumCollection} col
 * @param name entitySetName
 */
_pc.ODataManager.prototype.initializeProperties = function(self, as, col, name) {
  if (typeof as !== "undefined") {
//  /** アクセス主体. */
    /** Accessor. */
    self.accessor = as.clone();
  }

///** DAVコレクション. */
  /** DAV Collection. */
  self.collection = null;
  if (typeof col !== "undefined") {
    self.collection = col;
  }

///** EntitySet名. */
  /** EntitySetName. */
  self.entitySetName = null;
  if (typeof name !== "undefined") {
    self.entitySetName = name;
  }

  /** EntityID. */
  self.keyPredicate = null;

  /** NavigationProperty. */
  self.naviProperty = null;
};

///**
//* IDをEntitySet指定する.
//* @param {String} key keyPredicate
//* @return {_pc.ODataManager} EntitySetオブジェクト
//*/
/**
 * This method sets key for EntityID.
 * @param {String} key keyPredicate
 * @return {_pc.ODataManager} EntitySet object
 */
_pc.ODataManager.prototype.key = function(key) {
  if (typeof key !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.keyPredicate = key;
  return this;
};

///**
//* navigationPropertyをEntitySet指定する.
//* @param {String} navProp NavigationProperty
//* @return {_pc.ODataManager} EntitySetオブジェクト
//*/
/**
 * This method specifies the EntitySet navigationProperty.
 * @param {String} navProp NavigationProperty
 * @return {_pc.ODataManager} EntitySet object
 */
_pc.ODataManager.prototype.nav = function(navProp) {
  if (typeof navProp !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.naviProperty = navProp;
  return this;
};

///**
//* ベースURL取得.
//* @return {String} ベースURL
//*/
/**
 * This method returns the Base URL for making a connection.
 * @return {String} Base URL
 */
_pc.ODataManager.prototype.getBaseUrl = function() {
  return this.accessor.getContext().getBaseUrl();
};

///**
//* ODataデータを作成.
//* @private
//* @param {Object} body POSTするリクエストボディ
//* @param {String} headers POSTするリクエストヘッダー
//* @param callback object optional
//* @return {Ob} 対象となるODataContextを抽象クラスとして返却
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs create operation.
 * @private
 * @param {Object} body POST Request Body
 * @param {String} headers POST Request Header
 * @param {Object} callback object optional
 * @return {Object} Response
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.internalCreate = function(body, headers, callback) {
  var url = this.getUrl();
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);

  if (callback !== undefined) {
//  restAdapter.post(url, body, "application/json", headers, function(resp) {
//  var json = {};
//  var responseBody = resp.bodyAsJson();
//  if (responseBody.d !== undefined && responseBody.d.results !== undefined) {
//  json = responseBody.d.results;
//  }
//  callback(json);
//  });
    restAdapter.post(url, body, "application/json", headers, callback);
  } else {
    var response = restAdapter.post(url, body, "application/json", headers);
    /* if (response.getStatusCode() === 409 || response.getStatusCode() === 400) {
            return response;
            }
        var json = response.bodyAsJson().d.results;
        return json;*/
    return response;
  }
};

///**
//* ODataデータを取得.
//* @private
//* @param {String} id 対象となるID値
//* @param callback object optional
//* @return {?} １件取得した結果のオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs retrieve operation. It internally calls internalRetrieveMultikey.
 * @private
 * @param {String} id ID value
 * @param {Object} callback object optional
 * @return {Object} Object of the result
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.internalRetrieve = function(id, callback) {
  return this.internalRetrieveMultikey("'" + encodeURIComponent(id) + "'", callback);
};

///**
//* ODataデータを取得(複合キー).
//* @private
//* @param {String} id 対象となる複合キー urlエンコードが必要
//* @param callback object optional
//* @return １件取得した結果のオブジェクト response as json
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs retrieve operation.
 * @private
 * @param {String} id composite key url encoding the target
 * @param {Object} callback object optional
 * @return {Object} response as json
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.internalRetrieveMultikey = function(id, callback) {
  var url=null;
  if(id === undefined || id === "''"){
    url = this.getUrl();
  }
  else{
    url = this.getUrl() + "(" + id + ")";
  }

  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
//  restAdapter.get(url, "application/json", "*", function(resp) {
//  var responseBody = resp.bodyAsJson();
//  var json = responseBody.d.results;
//  callback(json);
//  })
    restAdapter.get(url, "application/json", "*", callback);
  } else {
    var response = restAdapter.get(url, "application/json", "*" );
    /*if(response.getStatusCode() != undefined) {
			if (response.getStatusCode() === 404){ // Added status check to return boolean value
				return true;
			}
			else{
				var json = response.bodyAsJson().d.results;
				return json;
			}
		}*/
	if (response.bodyAsJson().d !== undefined) {
		return response.bodyAsJson().d.results;
	} else {
		throw new _pc.DaoException(response.bodyAsJson().message.value, response.bodyAsJson().code);
	}

  }
};

///**
//* ODataデータを更新.
//* @private
//* @param {String} id 対象となるID値
//* @param {Object} body PUTするリクエストボディ
//* @param {String} etag ETag値
//* @param headers
//* @param callback object optional
//* @return response PersoniumHttpClient
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs update operation. It internally calls internalUpdateMultiKey.
 * @private
 * @param {String} id ID value
 * @param {Object} body PUT Request Body
 * @param {String} etag ETag value
 * @param {Object} headers
 * @param {Object} callback object optional
 * @return {Object} response PersoniumHttpClient
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.internalUpdate = function(id, body, etag, headers, callback) {
  var response = this.internalUpdateMultiKey("'" + encodeURIComponent(id) + "'", body, etag, headers, callback);
  return response;
};

///**
//* ODataデータを更新.
//* @param id 対象となるID値
//* @param body PUTするリクエストボディ
//* @param etag ETag値
//* @param headers PUTするリクエストヘッダー
//* @throws DaoException DAO例外
//*/
////void internalUpdate(String id, JSONObject body, String etag, HashMap<String, String> headers) throws DaoException {
//_pc.ODataManager.prototype.internalUpdate = function() {
//var url = this.getUrl() + "('" + id + "')";
//var factory = new _pc.RestAdapterFactory();
//var restAdapter = factory.create(this.accessor);
//restAdapter.put(url, body.toJSONString(), etag, headers, RestAdapter.CONTENT_TYPE_JSON);
//};

///**
//* ODataデータを更新(複合キー).
//* @private
//* @param {String} multiKey 対象となる複合キー<br> urlエンコードが必要
//* @param {Object} body PUTするリクエストボディ
//* @param {String} etag ETag値
//* @param callback object optional
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs update operation.
 * @private
 * @param {String} multiKey composite key url encoding the target
 * @param {Object} body PUT Request Body
 * @param {String} etag ETag value
 * @param {Object} callback object optional
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.internalUpdateMultiKey = function(multiKey, body, etag, headers, callback) {
  var url = this.getUrl() + "(" + multiKey + ")";
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = "";
  if (callback !== undefined) {
    response = restAdapter.put(url, JSON.stringify(body), etag, "application/json", headers, callback);
  } else {
    response = restAdapter.put(url, JSON.stringify(body), etag, "application/json", headers);
  }
  return response;
};

///**
//* ODataデータを削除.
//* @private
//* @param {String} id 削除するODataデータのID値
//* @param {String} etag ETag値
//* @param callback object optional
//* @return promise
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs delete operation. It internally calls internalDelMultiKey.
 * @private
 * @param {String} id ID value
 * @param {String} etag ETag value
 * @param {Object} callback object optional
 * @return {_pc.Promise} promise
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.internalDel = function(id, etag, callback) {
  var response = this.internalDelMultiKey("'" + encodeURIComponent(id) + "'", etag, callback);
  return response;
};

///**
//* ODataデータを削除(複合キー).
//* @private
//* @param {String} id 削除するODataデータの複合キー<br> urlエンコードが必要
//* @param {String} etag ETag値
//* @param callback object optional
//* @return promise
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs delete operation.
 * @private
 * @param {String} id composite key url encoding the target
 * @param {String} etag ETag value
 * @param {Object} callback object optional
 * @return {_pc.Promise} promise
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.internalDelMultiKey = function(id, etag, callback) {
  var url = this.getUrl() + "(" + id + ")";
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.del(url, etag, callback);
  return response;
};

///**
//* ODataデータを登録.
//* @param {Object} body 登録するJSONオブジェクト
//* @param callback object optional
//* @return {?} 登録結果のレスポンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method registers the OData data and returns in JSON form.
 * @param {Object} body JSON object
 * @param {Object} callback object optional
 * @return {Object} Response of the registration result
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.createAsJson = function(body, callback) {
  if (typeof body !== "object") {
    throw new _pc.DaoException("InvalidParameter");
  }
  if (callback !== undefined) {
    this.internalCreate(JSON.stringify(body), {}, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var responseBody = resp.bodyAsJson();
          var json = responseBody.d.results;
          callback.success(json);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    var responseJson ={};
    var response = this.internalCreate(JSON.stringify(body));
    var responseBody = response.bodyAsJson();
    if (responseBody.d !== undefined && responseBody.d.results !== undefined) {
      responseJson = responseBody.d.results;
    }
    return responseJson;
    // return this.internalCreate(JSON.stringify(body));
  }
};

///**
//* ODataデータを登録 createAsResponse.
//* @param {Object} json 登録するJSONオブジェクト
//* @param callback object optional
//* @return {?} 登録結果のレスポンス _pc.ODataResponse
//* @throws {DaoException} DAO例外
//*/
/**
 * This method registers the OData data and returns in ODataResponse form.
 * @param {Object} json JSON object
 * @param {Object} callback object optional
 * @return {_pc.ODataResponse} Response of the registration result
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.createAsResponse = function(body, callback) {
  if (typeof body !== "object") {
    throw new _pc.DaoException("InvalidParameter");
  }
  if (callback !== undefined) {
    this.internalCreate(JSON.stringify(body), {}, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var responseBody = resp.bodyAsJson();
          var json = responseBody.d.results;
          var odataResponse = new _pc.ODataResponse(this.accessor, json);
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    //var resJson = this.internalCreate(JSON.stringify(body));
    var responseJson ={};
    var response = this.internalCreate(JSON.stringify(body));
    var responseBody = response.bodyAsJson();
    if (responseBody.d !== undefined && responseBody.d.results !== undefined) {
      responseJson = responseBody.d.results;
    }
    return new _pc.ODataResponse(this.accessor, responseJson);
  }
};

///**
//* ODataデータを取得.
//* @param {String} id 取得するID値
//* @param callback object optional
//* @return {Object} 取得したJSONオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method retrieves data in JSON form.
 * @param {String} id ID value
 * @param {Object} callback object optional
 * @return {Object} JSON object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.retrieveAsJson = function(id, callback) {
  if (typeof id !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  if (callback !== undefined) {
    this.internalRetrieve(id, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var responseBody = resp.bodyAsJson();
          var json = responseBody.d.results;
          callback.success(json);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    return this.internalRetrieve(id, callback);
  }
};

///**
//* ODataデータを更新.
//* @param {String} id 対象となるID値
//* @param {Object} body PUTするリクエストボディ
//* @param {String} etag ETag値
//* @param callback object optional
//* @return _pc.ODataResponse
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs update operation.
 * @param {String} id ID value
 * @param {Object} body PUT Request Body
 * @param {String} etag ETag value
 * @param {Object} callback object optional
 * @return {_pc.ODataResponse} Response
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.update = function(id, body, etag, callback) {
  if (typeof id !== "string" || typeof etag !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  if (callback !== undefined) {
    this.internalUpdate(id, body, etag, {}, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var odataResponse = new _pc.ODataResponse(resp.accessor, "");
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    this.internalUpdate(id, body, etag);
    return new _pc.ODataResponse(this.accessor, "");
  }
};

///**
//* ODataデータを削除.
//* @param {String} id 削除するODataデータのID値
//* @param {String} etag ETag値
//* @param callback object optional
//* @return promise
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs delete operation.
 * @param {String} id ID value
 * @param {String} etag ETag value
 * @param {Object} callback object optional
 * @return {_pc.Promise} promise
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ODataManager.prototype.del = function(id, etag, callback) {
  if (typeof id !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  if (typeof etag === "undefined") {
    etag = "*";
  }
  if (callback !== undefined) {
    this.internalDel(id, etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var odataResponse = new _pc.ODataResponse(resp.accessor, "");
          callback.success(odataResponse);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    this.internalDel(id, etag);
  }
};

/**
 * This method appends query string to execute Query for Search.
 * @param {_pc.PersoniumQuery} query
 * @param {Object} callback object optional
 * @return {Object} JSON response
 */
_pc.ODataManager.prototype.doSearch = function(query, callback) {
  var url = this.getUrl();
  var qry = query.makeQueryString();
  if ((qry !== null) && (qry !== "")) {
    url += "?" + qry;
  }
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "application/json", "*", callback);
  } else {
    restAdapter.get(url, "application/json", "*" );
    var json = restAdapter.bodyAsJson().d.results;
    return json;
  }
};

/**
 * This method appends query string to execute Query for Search.
 * @param {_pc.PersoniumQuery} query
 * @param {Object} callback object optional
 * @return {_pc.ODataResponse} response
 */
_pc.ODataManager.prototype.doSearchAsResponse = function(query, callback) {
  var url = this.getUrl();
  var qry = query.makeQueryString();
  if ((qry !== null) && (qry !== "")) {
    url += "?" + qry;
  }
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "application/json", "*", callback);
  } else {
    restAdapter.get(url, "application/json", "*" );
    return new _pc.ODataResponse(this.accessor, "", restAdapter.bodyAsJson());
  }
};

///**
//* クエリを生成.
//* @return {_pc.PersoniumQuery} 生成したQueryオブジェクト
//*/
/**
 * This method executes Query.
 * @return {_pc.PersoniumQuery} Query object generated
 */
_pc.ODataManager.prototype.query = function() {
  return new _pc.PersoniumQuery(this);
};

///**
//* ODataデータの生存確認.
//* @param {String} id 対象となるODataデータのID
//* @return {boolean} true:生存、false:不在
//*/
/**
 * This method checks whether the specified Odata exists.
 * @param {String} id ID value
 * @return {boolean} true:Survival false:Absence */
_pc.ODataManager.prototype.exists = function(id) {
  var status = true;
  if (typeof id !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }

  var url = this.getUrl() + "('" + id + "')";
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  try {
    var response = restAdapter.head(url);
    if(response.getStatusCode() === 404){
      status = false;
    }
  } catch (e) {
    status = false;
  }
  return status;
};

///**
//* URLを取得する.
//* @returns {String}　URL
//*/
/**
 * This method generates the URL for executing API calls.
 * @returns {String}　URL
 */
_pc.ODataManager.prototype.getUrl = function() {
  var sb = "";
  // $Batchモードの場合は、相対パス
  /** In the case of $ Batch mode, the relative path . */
  if (!this.accessor.isBatchMode()) {
    sb += this.collection.getPath() + "/";
  }
  sb += this.entitySetName;
  // key()によりKeyPredicateとnav()によりnaviPropertyが指定されていたら
  /** naviProperty if it has been specified by the nav and KeyPredicate. */
  if ((this.keyPredicate !== null && this.keyPredicate !== "") &&
      (this.naviProperty !== null && this.naviProperty !== "")) {
    sb += "('" + this.keyPredicate + "')/_" + this.naviProperty;
  }
  return sb;
};
