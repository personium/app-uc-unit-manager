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
//* @class ServiceのCURDのためのクラス.
//* @constructor
//* @augments _pc.PersoniumCollection
//*/
/**
 * It creates a new object _pc.ServiceCollection.
 * @class This class performs CRUD operations for ServiceCollection.
 * @constructor
 * @augments _pc.PersoniumCollection
 * @param {_pc.Accessor} Accessor
 * @param {String} path
 */
_pc.ServiceCollection = function(as, path) {
  this.initializeProperties(this, as, path);
};
_pc.PersoniumClass.extend(_pc.ServiceCollection, _pc.PersoniumCollection);

///**
//* プロパティを初期化する.
//* @param {_pc.ServiceCollection} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {?} path
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.ServiceCollection} self
 * @param {_pc.Accessor} as Accessor
 * @param {String} path
 */
_pc.ServiceCollection.prototype.initializeProperties = function(self, as, path) {
  this.uber = _pc.PersoniumCollection.prototype;
  this.uber.initializeProperties(self, as, path);
};

///**
//* サービスの設定.
//* @param {String} key プロパティ名
//* @param {String} value プロパティの値
//* @param {String} subject サービスサブジェクトの値
//* @throws {DaoException} DAO例外
//*/
/**
 * This method configures a set of services.
 * @param {String} key Property Name
 * @param {String} value Property values
 * @param {String} subject Value of the service subject
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ServiceCollection.prototype.configure = function(key, value, subject) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.setService(this.getPath(), key, value, subject);
  return response;
};

/**
 * The purpose of this method is to perform service configure operation for multiple service
 * in one API call. 
 * @param arrServiceNameAndSrcFile service list in combination of service name and source file
 * @param subject Service
 * @param callback (deprecated) for backward compatibility.
 * @throws {DaoException}
 */
_pc.ServiceCollection.prototype.multipleServiceConfigure = function(arrServiceNameAndSrcFile, subject, callback) {
	var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
	var response = restAdapter.setMultipleService(this.getPath(), arrServiceNameAndSrcFile, subject, callback);
	return response;
};

/**
 * This method contains common call back logic.
 * @param {Object} resp response received
 * @param {Object} callback callback parameter
 * @private
 */
_pc.ServiceCollection.prototype.processCallback = function(resp, callback) {
  if (resp.getStatusCode() >= 300) {
    if (callback.error !== undefined) {
      callback.error(resp);
    }
  } else {
    if (callback.success !== undefined) {
      callback.success(resp);
    }
  }
  if (callback.complete !== undefined) {
    callback.complete(resp);
  }
};

///**
//* Method is responsible for deciding which implementation of call is to be used.
//* decision will be taken based on the type of bodyOrHeader parameter
//* @param method メソッド
//* @param name 実行するサービス名
//* @param bodyOrOptions can contain either options or body
//* @param callback contains call back, not required if options is specified
//* @return PersoniumResponseオブジェクト
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is responsible for deciding which implementation of call is to be used.
 * Decision will be taken based on the type of bodyOrHeader parameter
 * @param {String} method Method
 * @param {String} name Service name to be executed
 * @param {Object} bodyOrOptions can contain either options or body
 * @param {Object} callback contains call back, not required if options is specified
 * @return {_pc.PersoniumResponse} PersoniumResponse object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ServiceCollection.prototype.call = function(method, name, bodyOrOptions,
    callback) {
  var response = null;
  if (bodyOrOptions !== null && typeof bodyOrOptions === "object") {
    //callback, header and body all specified in options parameter
    response = this._callWithOptions(method, name, bodyOrOptions);
  } else {
    response = this._callWithNoOptions(method, name, bodyOrOptions,
        callback);
  }
  return response;
};

///**
//* サービスの実行.
//* @param method メソッド
//* @param name 実行するサービス名
//* @param body リクエストボディ
//* @return PersoniumResponseオブジェクト
//* @throws {DaoException} DAO例外
//* @private
//*/
/**
 * Method _callWithNOOptions - an overloaded version with option containing only body.
 * @param {String} method Method
 * @param {String} name Service name to be executed
 * @param {Object} body Request Body
 * @return {_pc.PersoniumResponse} PersoniumResponse object
 * @throws {_pc.DaoException} DAO exception
 * @private
 */
_pc.ServiceCollection.prototype._callWithNoOptions = function(method, name,
    body, callback) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var url = _pc.UrlUtils.append(this.getPath(), name);
  var defaultContentType = "text/plain";
  var response = null;
  var self = this;
  if (method === "GET") {
    if (callback !== undefined) {
      restAdapter.get(url, defaultContentType, null, function(resp) {
        self.processCallback(resp, callback);
      });
    } else {
      response = restAdapter.get(url, defaultContentType);
      return response;
    }
  }
  if (method === "POST") {
    if (callback !== undefined) {
      restAdapter.post(url, body, defaultContentType, {}, function(resp) {
        self.processCallback(resp, callback);
      });
    } else {
      response = restAdapter.post(url, body, defaultContentType, {});
      return response;
    }
  }
  if (method === "PUT") {
    if (callback !== undefined) {
      restAdapter.put(url, body, "*", defaultContentType, {}, function(
          resp) {
        self.processCallback(resp, callback);
      });
    } else {
      response = restAdapter.put(url, body, "*", defaultContentType, {});
      return response;
    }
  }
  if (method === "DELETE") {
    if (callback !== undefined) {
      restAdapter.del(url, "*", function(resp) {
        self.processCallback(resp, callback);
      });
    } else {
      response = restAdapter.del(url, "*");
      return response;
    }
  }
};

///**
//* Method _callWithOptions - an overloaded version with option containing header,body and callback.
//* @param method メソッド
//* @param name 実行するサービス名
//* @param options containing header,body and success, error, complete callback
//* @return PersoniumResponseオブジェクト
//* @throws {DaoException} DAO例外
//* @private
//*/
/**
 * Method _callWithOptions - an overloaded version with option containing header,body and callback.
 * @param {String} method method
 * @param {String} name Service to be executed
 * @param {Object} options containing header,body and success, error, complete callback
 * @return {_pc.PersoniumResponse} PersoniumResponse object
 * @throws {_pc.DaoException} DAO exception
 * @private
 */
_pc.ServiceCollection.prototype._callWithOptions = function(method, name,
    options) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var url = _pc.UrlUtils.append(this.getPath(), name);
  var response = null;
  var acceptHeader = "text/plain";
  var contentTypeHeader = "text/plain";
  var self = this;

  if ((options.headers !== undefined)	&& (options.headers.Accept !== undefined)) {
    acceptHeader = options.headers.Accept;
  }
  if ((options.headers !== undefined)	&& (options.headers.ContentType !== undefined)) {
    contentTypeHeader = options.headers.ContentType;
  }
  if (method === "GET") {
    if (options.success !== undefined || options.error !== undefined || options.complete !== undefined) {
      restAdapter.get(url, acceptHeader, null, function(resp) {
        self.processCallback(resp, options);
      });
    } else {
      //no callback is specified, simply return the response
      response = restAdapter.get(url, acceptHeader);
      return response;
    }
  }
  if (method === "POST") {
    if (options.success !== undefined || options.error !== undefined || options.complete !== undefined) {
      restAdapter.post(url, options.body, contentTypeHeader, {},
          function(resp) {
        self.processCallback(resp, options);
      });
    } else {
      //no callback is specified, simply return the response
      if (options.headers !== undefined) {
        response = restAdapter.post(url, options.body,
            contentTypeHeader, options.headers);
      } else {
        response = restAdapter.post(url, options.body,
            contentTypeHeader, {});
      }
      return response;
    }
  }
  if (method === "PUT") {
    if (options.success !== undefined || options.error !== undefined || options.complete !== undefined) {
      restAdapter.put(url, options.body, "*", contentTypeHeader, {},
          function(resp) {
        self.processCallback(resp, options);
      });
    } else {
      //no callback is specified, simply return the response
      if (options.headers !== undefined) {
        response = restAdapter.put(url, options.body, "*",
            contentTypeHeader, options.headers);
      } else {
        response = restAdapter.put(url, options.body, "*",
            contentTypeHeader, {});
      }
      return response;
    }
  }
  if (method === "DELETE") {
    if (options.success !== undefined || options.error !== undefined || options.complete !== undefined) {
      restAdapter.del(url, "*", function(resp) {
        self.processCallback(resp, options);
      });
    } else {
      //no callback is specified, simply return the response
      response = restAdapter.del(url, "*");
      return response;
    }
  }
};

///**
//* 指定Pathに任意の文字列データをPUTします.
//* @param pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param data PUTするデータ
//* @param etagValue PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to upload a file or update a string of data.
 * @param {String} pathValue Path of DAV
 * @param {String} contentType Content Type
 * @param {String} data PUT Data
 * @param {String} etagValue ETag of PUT target. Specify "*" for forcing new or updated
 * @returns {_pc.PersoniumHttpClient} response
 * @throws {_pc.DaoException} DAO exception
 */
//public void put(String pathValue, String contentType, String data, String etagValue) throws DaoException {
_pc.ServiceCollection.prototype.put = function(pathValue, contentType, data,
    etag) {
  //    byte[] bs;
  //    try {
  //        bs = data.getBytes("UTF-8");
  //    } catch (UnsupportedEncodingException e) {
  //        throw new DaoException("UnsupportedEncodingException", e);
  //    }
  //    InputStream is = new ByteArrayInputStream(bs);
  //    this.put(pathValue, contentType, is, etagValue);
  var url = _pc.UrlUtils.append(this.getPath(), "__src/" + pathValue);
  var response = _pc.RestAdapterFactory.create(this.accessor).put(url, data, etag,
      contentType);
  return response;
};

///**
//* 指定pathに任意のInputStreamの内容をPUTします. 指定IDのオブジェクトが既に存在すればそれを書き換え、存在しない場合はあらたに作成する.
//* @throws {DaoException} DAO例外
//*/
//public void put(String pathValue, String contentType, InputStream is, String etagValue) throws DaoException {
//_pc.ServiceCollection.prototype.put = function() {
//var url = _pc.UrlUtils.append(this.getPath(), "__src/" + pathValue);
//var restAdapter = new _pc.RestAdapterFactory().create(this.accessor);
//restAdapter.putStream(url, contentType, is, etagValue);
//};
///**
//* 指定PathのデータをDeleteします.
//* @param {String} pathValue DAVのパス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method deletes the data in the path specified.
 * @param {String} pathValue DAV Path
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ServiceCollection.prototype.del = function(pathValue) {
  var url = _pc.UrlUtils.append(this.getPath(), "__src/" + pathValue);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  restAdapter.del(url, "*");
};

/**
 * This method calls PROPFIND API for specified path to get 
 * registered service file detail. 
 * @returns {_pc.PersoniumHttpClient} response.
 * @throws {_pc.DaoException} DAO exception
 */
_pc.ServiceCollection.prototype.propfind = function () {
	var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
	var response = restAdapter.propfind(this.url);
	return response;
};
