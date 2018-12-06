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


/**
 * @namespace Namespace enclosing the Personium client library classes.
 */
//var _pc = {};

/**
 * It creates a new object _pc.PersoniumContext.
 * @class This class is the Data cloud context used as the package for all the files.
 * @constructor
 * @param {String} Base URL
 * @param {String} Cell Name
 * @param {String} Box DataSchemaURI
 * @param {String} Box Name
 */
_pc.PersoniumContext = function(url, name, boxSchema, bName) {
  this.initializeProperties(this, url, name, boxSchema, bName);
};

if (typeof exports === "undefined") {
  exports = {};
}
exports.PersoniumContext = _pc.PersoniumContext;

///**
//* バージョン情報を指定するヘッダ.
//*/
/** Header that specifies the version information. */
var PERSONIUM_VERSION = "X-Personium-Version";

///**
//* プロパティを初期化する.
//* @param {_pc.PersoniumContext} self
//* @param {?} url
//* @param {?} name
//* @param {?} boxSchema
//* @param {?} bName
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.PersoniumContext} self
 * @param {String} url
 * @param {String} name
 * @param {String} boxSchema
 * @param {String} bName
 */
_pc.PersoniumContext.prototype.initializeProperties = function(self, url, name, boxSchema, bName) {
///** 基底URL. */
  /** {String} Base URL. */
  self.baseUrl = url;
  if (self.baseUrl === undefined || self.baseUrl === null) {
    self.baseUrl = "";
  }
  if (self.baseUrl !== "" && !self.baseUrl.endsWith("/")) {
    self.baseUrl += "/";
  }

///** 現在のCellName. */
  /** {String} Current cell name. */
  self.cellName = name;
  if (self.cellName === undefined || self.cellName === null) {
    self.cellName = "";
  }

///** 現在のBoxのDataSchemaURI. */
  /** {String} DataSchemaURI of current Box. */
  self.schema = boxSchema;
  if (self.schema === undefined || self.schema === null) {
    self.schema = "";
  }

///** 現在のBoxName. */
  /** {String} Current box name. */
  self.boxName = bName;
  if (self.boxName === undefined || self.boxName === null) {
    self.boxName = "";
  }

///** クライアントトークン. */
  /** {String} Client token. */
  self.clientToken = "";

///** デフォルトリクエストヘッダ. */
  /** {Object} Default request header. */
//HashMap<String, String> defaultHeaders = new HashMap<String, String>();
  self.defaultHeaders = {};

///** 動作対象プラットフォーム. */
  /** {String} Operating platforms. */
  self.platform = "insecure";

///** カスタマイズ可能な情報を管理するオブジェクト. */
  /** {_pc.DaoConfig} Object that manages a customizable information. */
  self.config = new _pc.DaoConfig();

///** キャッシュ用クラス. */
//this.cacheMap = new CacheMap();
};

///**
//* 基底URLの取得.
//* @return {String} URL文字列 (string)
//*/
/**
 * This method gets the base URL.
 * @return {String} Base URL (string)
 */
_pc.PersoniumContext.prototype.getBaseUrl = function() {
  return this.baseUrl;
};

///**
//* 基底URLを設定する.
//* @param {String} URL文字列 (string)
//*/
/**
 * This method sets the base URL.
 * @param {String} Base URL (string)
 */
_pc.PersoniumContext.prototype.setBaseUrl = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.baseUrl = value;
};

///**
//* CellのIDを取得.
//* @return {String} CellのID値 (string)
//*/
/**
 * This method gets the ID/name of the Cell.
 * @return {String} Cell name(string)
 */
_pc.PersoniumContext.prototype.getCellName = function() {
  return this.cellName;
};

///**
//* CellのIDを設定.
//* @param {String} value CellのID値 (string)
//*/
/**
 * This method sets the ID/name of the Cell.
 * @param {String} value Cell name (string)
 */
_pc.PersoniumContext.prototype.setCellName = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.cellName = value;
};

///**
//* BoxのDataSchemaURIの取得.
//* @return {String} BoxのDataSchemaURI値 (string)
//*/
/**
 * This method gets the Box DataSchemaURI.
 * @return {String} Box DataSchemaURI (string)
 */
_pc.PersoniumContext.prototype.getBoxSchema = function() {
  return this.schema;
};

///**
//* BoxのDataSchemaURIの設定.
//* @param {String} value BoxのDataSchemaURI値 (string)
//*/
/**
 * This method sets the Box DataSchemaURI.
 * @param {String} value Box DataSchemaURI (string)
 */
_pc.PersoniumContext.prototype.setBoxSchema = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.schema = value;
};

///**
//* Box Nameの取得.
//* @return {String} Box Nmae (string)
//*/
/**
 * This method gets the Box Name.
 * @return {String} Box Nmae (string)
 */
_pc.PersoniumContext.prototype.getBoxName = function() {
  return this.boxName;
};

///**
//* Box Nameの設定.
//* @param {String} value Box Name (string)
//*/
/**
 * This method sets the Box Name.
 * @param {String} value Box Name (string)
 */
_pc.PersoniumContext.prototype.setBoxName = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.boxName = value;
};

///**
//* CellのURLを取得.
//* @return {String} CellのURL
//*/
/**
 * This method gets the Cell URL.
 * @return {String} Cell URL
 */
_pc.PersoniumContext.prototype.getCellUrl = function() {
  return this.baseUrl + this.cellName + "/";
};

///**
//* クライアントトークンを取得する.
//* @return {String} クライアントトークン (string)
//*/
/**
 * This method acquires the client access token.
 * @return {String} access token (string)
 */
_pc.PersoniumContext.prototype.getClientToken = function() {
  return this.clientToken;
};

///**
//* クライアントトークンを設定する.
//* @param {String} value クライアントトークン (string)
//*/
/**
 * This method sets the client access token.
 * @param {String} value access token (string)
 */
_pc.PersoniumContext.prototype.setClientToken = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.clientToken = value;
  if (this.clientToken === null) {
    this.clientToken = "";
  }
};

///**
//* リクエストを行う際に付加するリクエストヘッダのデフォルト値をセット.
//* @param {String} key ヘッダ名
//* @param {String} value 値
//*/
/**
 * This method sets the default value of the request header to
 *  be added when making the request.
 * @param {String} key Header name
 * @param {String} value value
 */
//public final void setDefaultHeader(String key, String value) {
_pc.PersoniumContext.prototype.setDefaultHeader = function(key, value) {
  this.defaultHeaders[key] = value;
};

///**
//* リクエストを行う際に付加するリクエストヘッダのデフォルト値を削除.
//* @param {String} key ヘッダ名
//*/
/**
 * This method removes the default value of the request
 *  header to be added when making the request.
 * @param {String} key Header name
 */
//public final void removeDefaultHeader(String key) {
_pc.PersoniumContext.prototype.removeDefaultHeader = function(key) {
  delete this.defaultHeaders[key];
};

///**
//* DCの利用バージョンを設定.
//* @param {?} value バージョン
//*/
/**
 * This method sets the Personium Version.
 * @param {String} value Version
 */
//public final void setPersoniumVersion(final String value) {
_pc.PersoniumContext.prototype.setPersoniumVersion = function(value) {
  this.defaultHeaders.put(PESONIUM_VERSION, value);
};

///**
//* Personiumの利用バージョンを取得.
//* @return {?} データクラウドバージョン
//*/
/**
 * This method gets the Personium Version.
 * @return {String} value Version
 */
//public final String getPersoniumVersion() {
_pc.PersoniumContext.prototype.getPersoniumVersion = function() {
  return this.defaultHeaders.get(PESONIUM_VERSION);
};

///**
//* 動作対象プラットフォームを取得.
//* @return {String} プラットフォーム名 (string)
//*/
/**
 * This method gets the operating platforms.
 * @return {String} Platform name (string)
 */
_pc.PersoniumContext.prototype.getPlatform = function() {
  return this.platform;
};

///**
//* 動作対象プラットフォームをセット.
//* @param {String} value プラットフォーム名 (string)
//*/
/**
 * This method sets the operating platforms.
 * @param {String} value Platform name (string)
 */
_pc.PersoniumContext.prototype.setPlatform = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.platform = value;
};

///**
//* キャッシュ用オブジェクト(CacheMap)の設定.
//* @param value CacheMapオブジェクト
//*/
////public final void setCacheMap(final CacheMap value) {
//_pc.PersoniumContext.prototype.setCacheMap = function() {
//this.cacheMap = value;
//};

///**
//* キャッシュ用オブジェクト(CacheMap)の取得.
//* @return CacheMapオブジェクト
//*/
////public final CacheMap getCacheMap() {
//_pc.PersoniumContext.prototype.getCacheMap = function() {
//return this.cacheMap;
//};

///**
//* DaoConfigオブジェクトの取得.
//* @return {_pc.DaoConfig} DaoConfigオブジェクト
//*/
/**
 * This method acquires the DaoConfig object.
 * @return {_pc.DaoConfig} DaoConfig object
 */
//public final DaoConfig getDaoConfig() {
_pc.PersoniumContext.prototype.getDaoConfig = function() {
  return this.config;
};

///**
//* HTTPのタイムアウト値を設定.
//* @param {Number} value タイムアウト値
//*/
/**
 * This method sets the timeout value for HTTP.
 * @param {Number} value Time-out value
 */
//public final void setConnectionTimeout(final int value) {
_pc.PersoniumContext.prototype.setConnectionTimeout = function(value) {
  this.config.setConnectionTimeout(value);
};

///**
//* Chunked値を設定.
//* @param {boolean} value Chunked値
//*/
/**
 * This method sets the Chunked value.
 * @param {boolean} value Chunked value
 */
//public final void setChunked(final Boolean value) {
_pc.PersoniumContext.prototype.setChunked = function(value) {
  this.config.setChunked(value);
};

///**
//* 非同期通信フラグを設定.
//* @param {?} value 非同期フラグ
//*/
/**
 * This method sets the asynchronous communication flag.
 * @param {Boolean} value Asynchronous flag
 */
//public final void setThreadable(final Boolean value) {
_pc.PersoniumContext.prototype.setAsync = function(value) {
  this.config.setAsync(value);
};

///**
//* 非同期通信フラグを取得.
//* @return {?} 非同期通信フラグ
//*/
/**
 * This method gets the asynchronous communication flag.
 * @return {Boolean} value Asynchronous flag
 */
//public final Boolean getThreadable() {
_pc.PersoniumContext.prototype.getAsync = function() {
  return this.config.getAsync();
};

///**
//* HttpClientオブジェクトを設定.
//* @param value HttpClientオブジェクト
//*/
////public final void setHttpClient(final HttpClient value) {
//_pc.PersoniumContext.prototype.setHttpClient = function() {
//this.config.setHttpClient(value);
//};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell (string)
//* @param {String} userId ユーザID (string)
//* @param {String} password ユーザパスワード (string)
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor and utilizes token of the request header.
 * @param {String} cellUrl Cell URL (string)
 * @param {String} userId UserID (string)
 * @param {String} password Password (string)
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.PersoniumContext.prototype.asAccount = function(cellUrl, userId, password) {
  return this.getAccessorWithAccount(cellUrl, userId, password);
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell (string)
//* @param {String} userId ユーザID (string)
//* @param {String} password ユーザパスワード (string)
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor and utilizes token of the request header.
 * @param {String} cellUrl Cell URL (string)
 * @param {String} userId UserID (string)
 * @param {String} password Password (string)
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.PersoniumContext.prototype.getAccessorWithAccount = function(cellUrl, userId, password) {
  var as = new _pc.Accessor(this);
  as.setCellName(cellUrl);
  as.setUserId(userId);
  as.setPassword(password);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} token トランスセルアクセストークン
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor and utilizes transformer
 * cell token of the request header.
 * @param {String} cellUrl Cell URL
 * @param {String} token Transformer cell access token
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.PersoniumContext.prototype.getAccessorWithTransCellToken = function(cellUrl, token) {
  var as = new _pc.Accessor(this);
  as.setCellName(cellUrl);
  as.setTransCellToken(token);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} token トークン
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor and utilizes token of the request header.
 * @param {String} token Token value
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.PersoniumContext.prototype.withToken = function(token) {
  var as = new _pc.Accessor(this);
  as.setAccessType(_pc.Accessor.ACCESSOR_KEY_TOKEN);
  as.setAccessToken(token);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} token リフレッシュトークン
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor and utilizes refresh token of the request header.
 * @param {String} cellUrl Cell URL
 * @param {String} token Refresh token
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.PersoniumContext.prototype.getAccessorWithRefreshToken = function(cellUrl, token) {
  var as = new _pc.Accessor(this);
  as.setCellName(cellUrl);
  as.setTransCellRefreshToken(token);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} userId ユーザID
//* @param {String} password ユーザパスワード
//* @param {String} schemaUrl スキーマセルurl
//* @param {String} schemaUserId スキーマセルユーザID
//* @param {String} schemaPassword スキーマセルユーザパスワード
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor with schema authentication.
 * @param {String} cellUrl Cell URL
 * @param {String} userId UserID
 * @param {String} password Password
 * @param {String} schemaUrl Schema url
 * @param {String} schemaUserId Schema UserID
 * @param {String} schemaPassword Schema password
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.PersoniumContext.prototype.asAccountWithSchemaAuthn = function(cellUrl, userId, password, schemaUrl, schemaUserId, schemaPassword) {
  return this.getAccessorWithAccountAndSchemaAuthn(cellUrl, userId, password, schemaUrl, schemaUserId,
      schemaPassword);
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} userId ユーザID
//* @param {String} password ユーザパスワード
//* @param {String} schemaUrl スキーマセルurl
//* @param {String} schemaUserId スキーマセルユーザID
//* @param {String} schemaPassword スキーマセルユーザパスワード
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor with account and schema authentication.
 * @param {String} cellUrl Cell URL
 * @param {String} userId userid
 * @param {String} password Password
 * @param {String} schemaUrl Schema url
 * @param {String} schemaUserId Schema User ID
 * @param {String} schemaPassword Schema Password
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.PersoniumContext.prototype.getAccessorWithAccountAndSchemaAuthn = function(cellUrl, userId, password, schemaUrl, schemaUserId, schemaPassword) {
  var as = new _pc.Accessor(this);
  as.setCellName(cellUrl);
  as.setUserId(userId);
  as.setPassword(password);
  as.setSchema(schemaUrl);
  as.setSchemaUserId(schemaUserId);
  as.setSchemaPassword(schemaPassword);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @param {String} cellUrl 認証先Cell
//* @param {String} token トランスセルトークン
//* @param {String} schemaUrl スキーマセルurl
//* @param {String} schemaUserId スキーマセルユーザID
//* @param {String} schemaPassword スキーマセルユーザパスワード
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor with transformer cell access token
 * and schema authentication.
 * @param {String} cellUrl Cell URL
 * @param {String} token Transformer cell token
 * @param {String} schemaUrl Schema url
 * @param {String} schemaUserId Schema userid
 * @param {String} schemaPassword Schema Password
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
_pc.PersoniumContext.prototype.getAccessorWithTransCellTokenAndSchemaAuthn = function(cellUrl, token, schemaUrl, schemaUserId, schemaPassword) {
  var as = new _pc.Accessor(this);
  as.setCellName(cellUrl);
  as.setTransCellToken(token);
  as.setSchema(schemaUrl);
  as.setSchemaUserId(schemaUserId);
  as.setSchemaPassword(schemaPassword);
  as.setDefaultHeaders(this.defaultHeaders);
  return as;
};

///**
//* JSONObjectオブジェクトを生成.
//* @return {?} 生成したJSONObjectオブジェクト
//*/
/**
 * This method generates JSONObject object.
 * @return {Object} JSONObject object
 */
//public final JSONObject newJson() {
_pc.PersoniumContext.prototype.newJson = function() {
  return {};
};

///**
//* JSON文字列から、JSONObjectオブジェクトを生成.
//* @param {String} jsonStr JSON文字列
//* @return {?} 変換後のJSONObject
//* @throws org.json.simple.parser.ParseException JSONパース例外
//*/
/**
 * This method generates JSONObject object from JSON string. 
 * @param {String} jsonStr JSON string
 * @return {Object} JSONObject
 * @throws org.json.simple.parser.ParseException JSON object
 */
//public final JSONObject newJson(final String jsonStr) throws org.json.simple.parser.ParseException {
_pc.PersoniumContext.prototype.newJson = function(jsonStr) {
  return JSON.parse(jsonStr);
};

///**
//* TODO Java DAO の本来の機能ではないため、別のクラスに移動する必要がある.
//* @param str デコード対象の文字列
//* @param charset 文字コード
//* @return デコード後の文字列
//* @throws UnsupportedEncodingException 例外
//* @throws DecoderException 例外
//*/
////public final String decodeURI(final String str, final String charset) throws UnsupportedEncodingException,
////DecoderException {
//_pc.PersoniumContext.prototype.decodeURI = function() {
//URLCodec codec = new URLCodec();
//return codec.decode(str, charset);
//};

///**
//* TODO Java DAO の本来の機能ではないため、別のクラスに移動する必要がある.
//* @param str デコード対象の文字列
//* @return デコード後の文字列
//* @throws UnsupportedEncodingException 例外
//* @throws DecoderException 例外
//*/
////public final String decodeURI(final String str) throws UnsupportedEncodingException, DecoderException {
//_pc.PersoniumContext.prototype.decodeURI = function() {
//URLCodec codec = new URLCodec();
//return codec.decode(str, "utf-8");
//};


//private String serviceSubject;

///**
//* サービスサブジェクトのsetter.
//* @param serviceSubject サービスサブジェクト
//*/
//public void setServiceSubject(String serviceSubject) {
//this.serviceSubject = serviceSubject;
//}

//private String schemaUrl;

///**
//* ボックスのスキーマURLのsetter.
//* @param schemaUrl ボックススキーマURL
//*/
//public void setSchemaUrl(String schemaUrl) {
//this.schemaUrl = schemaUrl;
//}

///**
//* コンストラクタ.
//* @param url 基底URL
//* @param name Cell Name
//* @param boxSchema Box DataSchemaURI
//* @param bName Box-Name
//*/
//public PersoniumEngineDao(final String url, final String name, final String boxSchema, final String bName) {
//super(url, name, boxSchema, bName);
//}

///**
//* アクセッサを生成します. マスタトークンを利用し、アクセッサを生成します。（正式実装は セルフトークンを利用する）
//* @return 生成したAccessorインスタンス
//* @throws DaoException DAO例外
//*/
//public final Accessor asServiceSubject() throws DaoException {
////サービスサブジェクト設定が未設定
//if ("".equals(this.serviceSubject)) {
//throw DaoException.create("ServiceSubject undefined.", 0);
//}

////設定されたアカウントが、存在することをチェックする。

////トークン生成
//long issuedAt = new Date().getTime();
//AccountAccessToken localToken = new AccountAccessToken(
//issuedAt,
//AccountAccessToken.ACCESS_TOKEN_EXPIRES_HOUR * AccountAccessToken.MILLISECS_IN_AN_HOUR,
//this.getCellUrl(),
//this.serviceSubject,
//this.schemaUrl);

//Accessor as = this.withToken(localToken.toTokenString());
//as.setAccessType(Accessor.KEY_SELF);
//return as;
//}

///**
//* アクセッサを生成します. リクエストヘッダのトークンを利用し、アクセッサを生成します。
//* @return {_pc.Accessor} 生成したAccessorインスタンス
//* @throws {DaoException} DAO例外
//*/
/**
 * This method generates accessor using client access token of request header.
 * @return {_pc.Accessor} Accessor object
 * @throws {_pc.DaoException} DAO exception
 */
//public final Accessor withClientToken() throws DaoException {
_pc.PersoniumContext.prototype.withClientToken = function() {
  return this.withToken(this.getClientToken());
};

