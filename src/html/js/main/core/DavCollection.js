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
//* @class DAVコレクションへアクセスするクラス.
//* @constructor
//* @augments _pc.PersoniumCollection
//*/
/**
 * It creates a new object _pc.DavCollection.
 * @class This class is used to access the DAV collection for Odata operations.
 * @constructor
 * @augments _pc.PersoniumCollection
 * @param {_pc.Accessor} Accessor
 * @param {String} path
 */
_pc.DavCollection = function(as, path) {
  this.initializeProperties(this, as, path);
};
_pc.PersoniumClass.extend(_pc.DavCollection, _pc.PersoniumCollection);

///**
//* プロパティを初期化する.
//* @param {_pc.DavCollection} self
//* @param {_pc.Accessor} as アクセス主体
//* @param {?} pathValue
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.DavCollection} self
 * @param {_pc.Accessor} as Accessor
 * @param {String} pathValue
 */
_pc.DavCollection.prototype.initializeProperties = function(self, as, pathValue) {
  this.uber = _pc.PersoniumCollection.prototype;
  this.uber.initializeProperties(self, as, pathValue);

  if (as !== undefined) {
//  /** boxレベルACLへアクセスするためのクラス. */
    /** class to access the box level ACL. */
    self.acl = new _pc.AclManager(as, this);
  }
};

///**
//* コレクションの生成.
//* @param {?} name 生成するCollection名
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to create a collection.
 * @param {String} name Collection name
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.mkCol = function(name) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.mkcol(_pc.UrlUtils.append(this.getPath(), name));
  if (response.getStatusCode() >= 400) {
    var responseJSON = response.bodyAsJson();
    throw new _pc.DaoException(responseJSON.message.value,
        responseJSON.code);
  }
  return response;
};

///**
//* ODataコレクションの生成.
//* @param name 生成するODataCollection名
//* @throws DaoException DAO例外
//*/
/**
 * This method is used to create a odata collection.
 * @param {String} name ODataCollection name
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.mkOData = function(name) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.mkOData(_pc.UrlUtils
      .append(this.getPath(), name));
  if (response.getStatusCode() >= 400) {
    var responseJSON = response.bodyAsJson();
    throw new _pc.DaoException(responseJSON.message.value,
        responseJSON.code);
  }
  return response;
};

///**
//* Serviceコレクションの生成.
//* @param name 生成するServiceCollection名
//* @throws DaoException DAO例外
//*/
/**
 * This method is used to create a service collection.
 * @param {String} name ServiceCollection name
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.mkService = function(name) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.mkService(_pc.UrlUtils.append(this.getPath(), name));
  if (response.getStatusCode() >= 400) {
    var responseJSON = response.bodyAsJson();
    throw new _pc.DaoException(responseJSON.message.value,
        responseJSON.code);
  }
  return response;
};

///**
//* Calendarコレクションの生成.
//* @param name 生成するCalendarCollectoin名
//* @throws DaoException DAO例外
//*/
/**
 * This method is used to create a Calendar.
 * @param {String[]} name CalendarCollection name
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.mkCalendar = function(name) {
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  restAdapter.mkCalendar(_pc.UrlUtils.append(this.getPath(), name), "");
};

///**
//* コレクション内のリソースの一覧を取得する.
//* @return リソースの一覧
//* @throws DaoException DAO例外
//*/
/**
 * This method gets the list of resources in the collection.
 * @return {String[]} List of resources
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.getFileList = function() {
  return this.getResourceList();
};

///**
//* コレクション内のサブコレクションの一覧を取得する.
//* @return サブコレクションの一覧
//* @throws DaoException DAO例外
//*/
/**
 * This method gets a list of sub-collection in the collection.
 * @return {String} List of resources
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.getColList = function() {
  return this.getResourceList();
};

///**
//* コレクション内のリソースまたはサブコレクションの一覧を取得する.
//* @return {?} リソースまたはサブコレクションの一覧
//* @throws {DaoException} DAO例外
//*/
/**
 * This method calls propfind API to fetch the list of resources.
 * @return {String[]} List of sub-collection or resource
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.getResourceList = function() {
  var folderList = [];
  var type = "";
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.propfind(this.url);
  var doc = response.bodyAsXml();
  if (doc) {
    var nl = doc.getElementsByTagName("response");
    var name = "";
    for ( var i = 1; i < nl.length; i++) {
      var elm = nl[i];
      var href = elm.getElementsByTagName("href")[0];
      var lastmodified = elm.getElementsByTagName("getlastmodified")[0];
      if (lastmodified) {
        var lastModifiedDate = lastmodified.textContent;
        var resourceType = elm.getElementsByTagName("resourcetype")[0];
        if (resourceType.textContent !== "") {
          var collectionType = elm.getElementsByTagName("resourcetype")[0].firstElementChild.tagName;
          var temp = elm.getElementsByTagName("resourcetype")[0].firstElementChild;
          if (collectionType === "collection") {
            if (elm.getElementsByTagName("resourcetype")[0].firstElementChild.nextElementSibling !== null) {
              type = temp.nextElementSibling.nodeName;
            } else {
              type = "folder";
            }
          }
        } else {
          type = "file";
        }
        var epochDateTime = new Date(lastModifiedDate).getTime();
        epochDateTime = "/Date(" + epochDateTime + ")/";
        name = {
            "Name" : href.firstChild.nodeValue,
            "Date" : epochDateTime,
            "Type" : type
        };
        if (type == "file"){
            var contentLength = elm.getElementsByTagName("getcontentlength")[0].textContent;
                name = {
                    "Name" : href.firstChild.nodeValue,
                    "Date" : epochDateTime,
                    "Type" : type,
                    "ContentLength" : contentLength
                };
        }
        if (name === this.url) {
          continue;
        }
        var col = elm.getElementsByTagName("collection");
        if (col.length > 0 || type === "file") {
          folderList.push(name);
        }
      }
    }
  }
  return folderList;
};

///**
//* コレクションにプロパティをセットする.
//* @param key プロパティ名
//* @param value プロパティの値
//*/
//_pc.DavCollection.prototype.setProp = function(key, value) {
//};
///**
//* コレクションからプロパティを取得する.
//* @param key プロパティ名
//* @return 取得したプロパティ値
//*/
//_pc.DavCollection.prototype.getProp = function(key) {
//return "";
//};
///**
//* サブコレクションを指定.
//* @param name コレクション名
//* @return {_pc.DavCollection} 指定したコレクション名のDavCollectionオブジェクト
//*/
/**
 * This method specifies and retrieves the collection.
 * @param {String} name Collection name
 * @return {_pc.DavCollection} DavCollection object
 */
_pc.DavCollection.prototype.col = function(name) {
  return new _pc.DavCollection(this.accessor, _pc.UrlUtils.append(this
      .getPath(), name));
};

///**
//* ODataコレクションを指定.
//* @param name ODataコレクション名
//* @return {_pc.ODataCollection} 取得したODataCollectionオブジェクト
//*/
/**
 * This method specifies and retrieves the odata collection.
 * @param {String} name Odata Collection name
 * @return {_pc.ODataCollection} ODataCollection object
 */
_pc.DavCollection.prototype.odata = function(name) {
  return new _pc.ODataCollection(this.accessor, _pc.UrlUtils.append(this
      .getPath(), name));
};

///**
//* Serviceコレクションを指定.
//* @param name Serviceコレクション名
//* @return {_pc.ServiceCollection} 取得したSerivceコレクションオブジェクト
//*/
/**
 * This method specifies and retrieves the service collection.
 * @param {String} name Service Collection name
 * @return {_pc.ServiceCollection} SerivceCollection object
 */
_pc.DavCollection.prototype.service = function(name) {
  return new _pc.ServiceCollection(this.accessor, _pc.UrlUtils.append(this
      .getPath(), name));
};

///**
//* DAVに対するGETメソッドをリクエストする.
//* @param {String} pathValue 取得するパス
//* @param {String} charset 文字コード
//* @param {string} etag Used for if-none-match condition
//* @return {String} GETした文字列
//* @throws {DaoException} DAO例外
//*/
/**
 * This method returns the DAV collection details in string format.
 * @param {String} pathValue Path
 * @param {String} charset Character code
 * @param {String} etag Used for if-none-match condition
 * @return {String} GET String
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.getString = function(pathValue, charset, callback,
    etag) {
  if (charset === undefined) {
    charset = "utf-8";
  }
  var url = _pc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "text/plain", etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var body = resp.bodyAsString(charset);
          callback.success(body);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    restAdapter.get(url, "text/plain", etag);
    var body = restAdapter.bodyAsString(charset);
    return body;
  }
};

///**
//* バイナリデータのGETメソッドをリクエストする.
//* @param {String} pathValue 取得するパス
//* @param {String} callback コールバックメソッド
//* @param {string} etag Used for if-none-match condition
//* @return {String} GETしたバイナリデータ
//* @throws {DaoException} DAO例外
//*/
/**
 * This method returns the DAV collection details in binary format.
 * @param {String} pathValue Path
 * @param {String} callback Character code
 * @param {String} etag Used for if-none-match condition
 * @return {String} GET Binary data
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.getBinary = function(pathValue, callback, etag) {
  var url = _pc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.getBinary(url, etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var body = resp.bodyAsBinary();
          callback.success(body);
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    var httpclient = restAdapter.getBinary(url, etag);
    return httpclient.bodyAsBinary();
  }
};

///**
//* バイナリデータのGETメソッドを実行しレスポンスボディをBase64エンコードして返却する.
//* @param {String} pathValue 取得するパス
//* @param {String} contentType 取得するバイナリデータのContent-Type
//* @param {String} callback コールバックメソッド
//* @param {string} etag Used for if-none-match condition
//* @return {String} GETしたバイナリデータ
//* @throws {DaoException} DAO例外
//*/
/**
 * This method return the DAV collection details in binary format encoded with Base64.
 * @param {String} pathValue Path
 * @param {String} contentType Content-Type value
 * @param {String} callback Callback method
 * @param {String} etag Used for if-none-match condition
 * @return {String} GET Binary data
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.getBinaryAsBase64 = function(pathValue,
    contentType, callback, etag) {
  var body = this.getBinary(pathValue, callback, etag);
  return "data:" + contentType + ";base64," + this.base64encoder(body);
};

_pc.DavCollection.prototype.base64encoder = function(s) {
  var base64list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var t = "", p = -6, a = 0, i = 0, v = 0, c;

  while ((i < s.length) || (p > -6)) {
    if (p < 0) {
      if (i < s.length) {
        c = s.charCodeAt(i++);
        v += 8;
      } else {
        c = 0;
      }
      a = ((a & 255) << 8) | (c & 255);
      p += 8;
    }
    t += base64list.charAt((v > 0) ? (a >> p) & 63 : 64);
    p -= 6;
    v -= 6;
  }
  return t;
};

///**
//* DAVに対するGETメソッドをリクエストする.
//* @param {String} pathValue 取得するパス
//* @param {String} charset 文字コード
//* @param {string} etag Used for if-none-match condition
//* @return {_pc.DavResponse} GETした文字列を保持するレスポンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method returns the DAV collection data in response format.
 * @param {String} pathValue Path
 * @param {String} charset Character code
 * @param {String} etag Used for if-none-match condition
 * @return {_pc.DavResponse} GET Response holding string
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.getAsResponse = function(pathValue, charset,
    callback, etag) {
  if (charset === undefined) {
    charset = "utf-8";
  }
  var url = _pc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  if (callback !== undefined) {
    restAdapter.get(url, "text/plain", etag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          var body = resp.bodyAsString(charset);
          callback.success(new _pc.DavResponse(resp.accessor, body));
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    restAdapter.get(url, "text/plain", etag);
    var body = restAdapter.bodyAsString(charset);
    return new _pc.DavResponse(this.accessor, body);
  }
};

///**
//* DAVに対するGETメソッドをリクエストする.
//* @param pathValue 取得するパス
//* @return GETしたストリーム
//* @throws DaoException DAO例外
//*/
//_pc.DavCollection.prototype.getStream = function(pathValue) {
//String url = _pc.UrlUtils.append(this.getPath(), pathValue);
//// リクエスト
//PersoniumResponse res = RestAdapterFactory.create(this.accessor).get(url,
//"application/octet-stream");
//// レスポンスボディをストリームとして返却
//return res.bodyAsStream();
//};

///**
//* 指定pathに任意のInputStreamの内容をPUTします.
//指定IDのオブジェクトが既に存在すればそれを書き換え、存在しない場合はあらたに作成する.
//* @param pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param enc 文字コード(使用しない)
//* @param is InputStream
//* @param etag ETag値
//* @throws DaoException DAO例外
//*/
////public void put(String pathValue, String contentType, String enc,
//InputStream is, String etag) throws DaoException {
//_pc.DavCollection.prototype.initializeProperties = function() {
//// ストリームの場合はエンコーディング指定は使用しない
//put(pathValue, contentType, is, etag);
//};

///**
//* 指定pathに任意のInputStreamの内容をPUTします.
//指定IDのオブジェクトが既に存在すればそれを書き換え、存在しない場合はあらたに作成する.
//* @param pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param is InputStream
//* @param etagValue ETag値
//* @throws DaoException DAO例外
//*/
////public void put(String pathValue, String contentType, InputStream is,
//String etagValue) throws DaoException {
//_pc.DavCollection.prototype.put = function() {
//String url = _pc.UrlUtils.append(this.getPath(), pathValue);
//((RestAdapter) RestAdapterFactory.create(this.accessor)).putStream(url,
//contentType, is, etagValue);
//};

///**
//* 指定Pathに任意の文字列データをPUTします.
//* @param {String} pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param data PUTするデータ
//* @param etagValue PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to update the DAV collection.
 * @param {String} pathValue DAV Path
 * @param {String} contentType Character code
 * @param {String} data PUT data
 * @param {String} etagValue ETag of PUT target. Specify "*" for forcing new or updated
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.put = function(pathValue, contentType, data, etag,
    callback) {
  var url = _pc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = "";
  if (callback !== undefined) {
    response = restAdapter.put(url, data, etag, contentType, {}, function(
        resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          callback.success(new _pc.DavResponse(resp.accessor, ""));
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    response = restAdapter.put(url, data, etag, contentType);
    return new _pc.DavResponse(this.accessor, response);
  }
  return response;
};

///**
//* 指定Pathに任意の文字列データをPUTします.
//* @param pathValue DAVのパス
//* @param contentType メディアタイプ
//* @param enc 文字コード
//* @param data PUTするデータ
//* @param etag PUT対象のETag。新規または強制更新の場合は "*" を指定する
//* @throws DaoException DAO例外
//*/
//_pc.DavCollection.prototype.put = function(pathValue, contentType, enc, data,
//etag) {
//byte[] bs;
//try {
//if (!enc.isEmpty()) {
//bs = data.getBytes(enc);
//} else {
//bs = data.getBytes("UTF-8");
//}
//} catch (UnsupportedEncodingException e) {
//throw new DaoException("UnsupportedEncodingException", e);
//}
//InputStream is = new ByteArrayInputStream(bs);
//String url = _pc.UrlUtils.append(this.getPath(), pathValue);
//((RestAdapter) RestAdapterFactory.create(this.accessor)).putStream(url,
//contentType, is, etag);
//};
///**
//* 指定PathのデータをDeleteします(ETag指定).
//* @param {String} pathValue DAVのパス
//* @param {String/Object} optionsOrEtag 必須ではないオプション。 文字列が送信された場合、後方互換性のためにIf-Matchヘッダー値として送信されます。
//* @throws {DaoException} DAO例外
//*/
/**
 * This method is used to delete the data in the specified Path (ETag specified).
 * @param {String} pathValue DAV Path
 * @param {String/Object} optionsOrEtag non-mandatory options. If a string is sent it will be sent as If-Match header value for backward compatibility.
 * @throws {_pc.DaoException} DAO exception
 */
_pc.DavCollection.prototype.del = function(pathValue, optionsOrEtag, callback) {
  if (!optionsOrEtag || typeof optionsOrEtag === "undefined") {
    optionsOrEtag = "*";
  }
  var url = _pc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  //var response = "";
  if (callback !== undefined) {
    restAdapter.del(url, optionsOrEtag, function(resp) {
      if (resp.getStatusCode() >= 300) {
        if (callback.error !== undefined) {
          callback.error(resp);
        }
      } else {
        if (callback.success !== undefined) {
          callback.success(new _pc.DavResponse(resp.accessor, ""));
        }
      }
      if (callback.complete !== undefined) {
        callback.complete(resp);
      }
    });
  } else {
    var response = restAdapter.del(url, optionsOrEtag);
    return new _pc.DavResponse(this.accessor, response);
  }

  //Commented out response since both conditions either call callback or return DavResponse
  //return response;
};

///**
//* 引数で指定されたヘッダの値を取得.
//* @param headerKey 取得するヘッダのキー
//* @return ヘッダの値
//*/
/**
 * This method is used to get the value of the header that is specified in the argument.
 * @param {String} headerKey Key of the header
 * @return {String} value of the header
 */
_pc.DavCollection.prototype.getHeaderValue = function(headerKey) {
  return this.accessor.getResHeaders()[headerKey];
};

/**
 * The purpose of this function is to get JSON of cell profile information.
 * @param {String} pathValue
 * @param {string} etag Used for if-none-match condition
 * @returns
 */
_pc.DavCollection.prototype.getJSON = function(pathValue, etag) {
  var url = _pc.UrlUtils.append(this.getPath(), pathValue);
  var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
  var response = restAdapter.get(url, "application/json", etag);
  return response;
};