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
//* @class アクセサクラス. データクラウドへアクセスするＡＰＩを呼び出す際のアクセス主体となります。
//* @constructor
//* @property {number} expiresIn トークンの有効期限.
//*/
/**
 * It creates a new object _pc.Accessor.
 * @class This is the base class for setting the access parameters to access Cloud data.
 * @constructor
 * @property {number} expiresIn Expiration date of the token.
 * @param {_pc.PersoniumContext} pContext
 */
_pc.Accessor = function(pContext) {
  this.initializeProperties(this, pContext);
};

///** asメソッドに利用する type. */
/** as accessor key type. *
//var ACCESSOR_KEY_SELF = "self";
///** asメソッドに利用する type. */
/** as accessor key client type. */
//var ACCESSOR_KEY_CLIENT = "client";
///** asメソッドに利用する type. */
/** @param {String} accessor token */
_pc.Accessor.ACCESSOR_KEY_TOKEN = "token";

///**
//* プロパティを初期化する.
//* @param {_pc.Accessor} self
//* @param　{?} pContext Personiumコンテキスト
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.Accessor} self
 * @param　{_pc.PersoniumContext} PersoniumContext
 */
_pc.Accessor.prototype.initializeProperties = function(self, pContext) {

///** トークンの有効期限. */
  /** Expiration date of the token. */
  self.expiresIn = 0;
///** アクセストークン. */
  /** access token. */
  self.accessToken = null;
///** リフレッシュトークンの有効期限. */
  /** Expiration date of the refresh token. */
  self.refreshExpiresIn = 0;
///** リフレッシュトークン. */
  /** refresh token. */
  self.refreshToken = null;
///** トークンタイプ. */
  /** token type. */
  self.tokenType = null;

  self.schemaAuth = {};

///** アクセス種別. */
  /** access type. */
  self.accessType = "";

///** Cellの名前. */
  /** cell name. */
  self.cellName = "";

///** 認証ID. */
  /** user id. */
  self.userId = "";
///** 認証パスワード. */
  /** @param {String} password. */
  self.password = "";

///** スキーマ. */
  /** schema. */
  self.schema = "";
///** スキーマ認証ID. */
  /** schema user id. */
  self.schemaUserId = "";
///** スキーマ認証パスワード. */
  /** schema password. */
  self.schemaPassword = "";

///** 対象Cellの名前. */
  /** target cell name. */
  self.targetCellName = "";

///** トランスセルトークン. */
  /** Transformer cell token. */
  self.transCellToken = "";
///** トランスセルリフレッシュトークン. */
  /** Transformer cell refresh token.. */
  self.transCellRefreshToken = "";

///** オーナー. */
  /** owner. */
  self.owner = false;

///** 基底URL. */
  /** base url. */
  self.baseUrl = "";
///** 現在のBox Schema. */
  /** Current box schema. */
  self.boxSchema = "";
///** 現在のBox Name. */
  /** current box name. */
  self.boxName = "";

  /** PersoniumContext. */
  self.context = null;
  /** Cell. */
  self.currentCell = "";

///** バッチモード. */
  /** batch moode. */
  self.batch = false;

  /** BatchAdapter. */
  self.batchAdapter = null;

///** デフォルトヘッダ. */
  /** default header. */
  self.defaultHeaders = "";

///** サーバーのレスポンスから取得したレスポンスヘッダ. */
  /** Response headers that are retrieved from the server response. */
  self.resHeaders = {};

  /** Variable to hold p_cookie_peer key */
  self.cookiePeer = "";

  if (pContext !== undefined) {
    self.context = pContext;
    self.baseUrl = pContext.getBaseUrl();
    self.cellName = pContext.getCellName();
    self.boxSchema = pContext.getBoxSchema();
    self.boxName = pContext.getBoxName();
  }
};

///**
//* Accessorのクローンを生成する.
//* @return {?} コピーしたAccessorオブジェクト
//*/
/**
 * This method generates the clone of Accessor.
 * @return {Object} Copied accessor object
 */
_pc.Accessor.prototype.clone = function() {
  var dest = {};
  for (var prop in this) {
    dest[prop] = this[prop];
  }
  return dest;
};

///**
//* 他のCellを指定します.
//* @param {_pc.Cell} 接続先Cell URL
//* @param {Object} opts object with useCookie
//* @return {_pc.Cell} CellへアクセスするためのCellインスタンス
//* @throws DaoException DAO例外
//*/
/**
 * This method specifies the cell through accessor.
 * @param {_pc.Cell} Destination Cell URL
 * @param {Object} opts object with useCookie
 * @return {_pc.Cell} Cell Instance
 * @throws {_pc.DaoException} DAO exception
 */
_pc.Accessor.prototype.cell = function(cell, opts) {
  if (opts === undefined){
    opts = {};
  }
  var useCookie = opts.useCookie === undefined ? false : opts.useCookie;

  if (typeof cell === "undefined") {
    this.authenticate(useCookie);
    return new _pc.Cell(this);
  }

  if (this.cellName !== cell) {
    this.targetCellName = cell;
  }
  // Unit昇格時はこのタイミングで認証を行わない
  /** Perform authentication */
  if (!this.owner) {
    this.authenticate(useCookie);
  }
  this.cellName = cell;
  return new _pc.Cell(this, cell);
};

///**
//* パスワード変更.
//* @param newPassword 変更するパスワード
//* @throws DaoException DAO例外
//*/
/**
 * This method changes the current password.
 * @param {String} newPassword New Password
 * @throws {_pc.DaoException} DAO exception
 */
_pc.Accessor.prototype.changePassword = function(newPassword) {
  if (this.accessToken === null) {
    // accessTokenが無かったら自分で認証する
    /** if access token is not present then authenticate. */
    this.authenticate();
  }

  // パスワード変更
  /** Password change. */
  var headers = {};
  headers["X-Personium-Credential"] = newPassword;

  // パスワード変更のURLを作成
  /** Create the URL for password change. */
  var url = _pc.UrlUtils.append(this.getBaseUrl(), this.getCellName() + "/__mypassword");

  var rest = _pc.RestAdapterFactory.create(this);
  rest.put(url, "", "*", "application/json", headers);
  // password変更でエラーの場合は例外がthrowされるので例外で無い場合は、
  // Accessorのpasswordを新しいのに変えておく
  /** Password is set to new password. */
  this.password = newPassword;
};

///**
//* $Batchモードの取得.
//* @return {?} batchモード
//*/
/**
 * This method is used for Acquisition of $ Batch mode.
 * @return {Boolean} batch mode
 */
_pc.Accessor.prototype.isBatchMode = function() {
  return this.batch;
};

///**
//* $Batchモードの設定.
//* @param {?} batch $Batchモード
//*/
/**
 * THis method is used to set $ Batch mode.
 * @param {Boolean} batch $Batch mode
 */
_pc.Accessor.prototype.setBatch = function(batch) {
  if (typeof batch !== "boolean") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.batchAdapter = new _pc.BatchAdapter(this);
  this.batch = batch;
};

///**
//* BatchAdaptrの取得. インスタンスが生成されていない場合生成する
//* @return {_pc.BatchAdapter} BatchAdapterオブジェクト
//*/
/**
 * This method creates an instance to batch adapter if it does not exists.
 * @return {_pc.BatchAdapter} BatchAdapter object
 */
_pc.Accessor.prototype.getBatchAdapter = function() {
  if (this.batchAdapter === null) {
    this.batchAdapter = new _pc.BatchAdapter(this);
  }
  return this.batchAdapter;
};

///**
//* Unit昇格.
//* @return {?} 昇格後のAccessor(OwnerAccessor)
//* @throws {DaoException} DAO例外
//*/
/**
 * This method returns instance of OwnerAccessor with default headers.
 * @return {_pc.OwnerAccesssor} Accessor after promotions(OwnerAccessor)
 * @throws {_pc.DaoException} DAO exception
 */
_pc.Accessor.prototype.asCellOwner = function() {
  var ownerAccessor = new _pc.OwnerAccessor(this.context, this);
  ownerAccessor.defaultHeaders = this.defaultHeaders;
  return ownerAccessor;
};

///**
//* グローバルトークンの取得.
//* @return {_pc.DaoException} グローバルトークン
//*/
/**
 * It returns the access token.
 * @return {_pc.DaoException} access token
 */
_pc.Accessor.prototype.getAccessToken = function() {
  return this.accessToken;
};

///**
//* デフォルトヘッダを設定.
//* @param {Object} value デフォルトヘッダ
//*/
/**
 * This method sets the default headers.
 * @param {Object} default header value
 */
_pc.Accessor.prototype.setDefaultHeaders = function(value) {
  if (typeof value !== "object") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.defaultHeaders = value;
};

///**
//* デフォルトヘッダを取得.
//* @return {Object} デフォルトヘッダ
//*/
/**
 * This method returns the default headers.
 * @return {Object} default header value
 */
_pc.Accessor.prototype.getDefaultHeaders = function() {
  return this.defaultHeaders;
};

///**
//* グローバルトークンの設定.
//* @param {String} token グローバルトークン
//*/
/**
 * This method sets the access token value.
 * @param {String} token access token
 */
_pc.Accessor.prototype.setAccessToken = function(token) {
  if (typeof token !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.accessToken = token;
};

///**
//* DaoConfigオブジェクトを取得.
//* @return {_pc.DaoConfig} DaoConfigオブジェクト
//*/
/**
 * This method gets the DaoConfig object.
 * @return {_pc.DaoConfig} DaoConfig object
 */
_pc.Accessor.prototype.getDaoConfig = function() {
  return this.context.getDaoConfig();
};

/**
 * This method acquires the PersoniumContext.
 * @return {_pc.PersoniumContext} PersoniumContext
 */
_pc.Accessor.prototype.getContext = function() {
  return this.context;
};

/**
 * This method sets the PersoniumContext.
 * @param {Object} pContext pContext
 */
_pc.Accessor.prototype.setContext = function(pContext) {
  if (typeof pContext !== "object") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.context = pContext;
};

///**
//* 現在アクセス中のCell取得.
//* @return {?} Cellクラスインスタンス
//*/
/**
 * This method returns the cell currently being accessed.
 * @return {_pc.Cell} Cell instance
 */
_pc.Accessor.prototype.getCurrentCell = function() {
  return this.currentCell;
};

///**
//* 現在アクセス中のCell設定.
//* @param {?} cell Cellクラスインスタンス
//*/
/**
 * This method sets the current cell.
 * @param {_pc.Cell} Cell instance
 */
_pc.Accessor.prototype.setCurrentCell = function(cell) {
  this.currentCell = cell;
};

///**
//* トークンの有効期限の取得.
//* @return {?} トークンの有効期限
//*/
/**
 * This method returns the expiration value of token.
 * @return {String} token expiration value
 */
_pc.Accessor.prototype.getExpiresIn = function() {
  return this.expiresIn;
};

///**
//* リフレッシュトークンの設定.
//* @return {?} リフレッシュトークン
//*/
/**
 * This method returns the refresh token.
 * @return {String} refresh token
 */
_pc.Accessor.prototype.getRefreshToken = function() {
  return this.refreshToken;
};

///**
//* リフレッシュトークンの設定.
//* @return {?} リフレッシュトークン
//*/
/**
 * This method returns the token type.
 * @return {String} token type
 */
_pc.Accessor.prototype.getTokenType = function() {
  return this.tokenType;
};

///**
//* リフレッシュトークンの有効期限の取得.
//* @return {?} リフレッシュトークンの有効期限
//*/
/**
 * This method gets the refresh token expiration value.
 * @return {String} refresh token expiration value
 */
_pc.Accessor.prototype.getRefreshExpiresIn = function() {
  return this.refreshExpiresIn;
};

///**
//* CellName値の取得.
//* @return {String} CellName値
//*/
/**
 * This method gets the cell name.
 * @return {String} CellName value
 */
_pc.Accessor.prototype.getCellName = function() {
  return this.cellName;
};

///**
//* CellName値の設定.
//* @param {String} name CellName値
//*/
/**
 * This method sets the cell name.
 * @param {String} name CellName value
 */
_pc.Accessor.prototype.setCellName = function(name) {
  if (typeof name !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.cellName = name;
};

///**
//* Box Schemaの取得.
//* @return {String} Schema名
//*/
/**
 * This method gets the box schema value.
 * @return {String} Box Schema value
 */
_pc.Accessor.prototype.getBoxSchema = function() {
  return this.boxSchema;
};

///**
//* Box Schemaの設定.
//* @param {String} uri Box Schema名
//*/
/**
 * This method sets the box schema value.
 * @param {String} uri Box Schema value
 */
_pc.Accessor.prototype.setBoxSchema = function(uri) {
  if (typeof uri !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.boxSchema = uri;
};

///**
//* Box Nameを取得.
//* @return {String} Box Name
//*/
/**
 * This method returns the box name.
 * @return {String} Box Name
 */
_pc.Accessor.prototype.getBoxName = function() {
  return this.boxName;
};

///**
//* Box Nameの設定.
//* @param {String} value Box Name
//*/
/**
 * This method sets the box name.
 * @param {String} value Box Name
 */
_pc.Accessor.prototype.setBoxName = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.boxName = value;
};

///**
//* 基底URLを設定.
//* @return {String} URL文字列
//*/
/**
 * This method returns the base url value.
 * @return {String} Base URL value
 */
_pc.Accessor.prototype.getBaseUrl = function() {
  return this.baseUrl;
};

///**
//* 基底URLを取得.
//* @param {String} value URL文字列
//*/
/**
 * This method sets the base url value.
 * @param {String} value base URL value
 */
_pc.Accessor.prototype.setBaseUrl = function(value) {
  if (typeof value !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.baseUrl = value;
};

///**
//* ユーザIDを取得する.
//* @return {String} the userId
//*/
/**
 * This method returns the user id.
 * @return {String} the userId
 */
_pc.Accessor.prototype.getUserId = function() {
  return this.userId;
};

///**
//* ユーザIDを設定する.
//* @param {String} userId the userId to set
//*/
/**
 * This method sets the user id.
 * @param {String} userId the userId to set
 */
_pc.Accessor.prototype.setUserId = function(userId) {
  if (typeof userId !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.userId = userId;
};

///**
//* パスワードを取得する.
//* @return {String} the password
//*/
/**
 * This method gets the password.
 * @return {String} the password
 */
_pc.Accessor.prototype.getPassword = function() {
  return this.password;
};

///**
//* パスワードを設定する.
//* @param {String} password the password to set
//*/
/**
 * This method sets the password.
 * @param {String} password the password to set
 */
_pc.Accessor.prototype.setPassword = function(password) {
  if (typeof password !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.password = password;
};

///**
//* Schemaを取得する.
//* @return {String} the schema
//*/
/**
 * This method gets the schema.
 * @return {String} the schema
 */
_pc.Accessor.prototype.getSchema = function() {
  return this.schema;
};

///**
//* Schemaを設定する.
//* @param {String} schema the schema to set
//*/
/**
 * This method sets the schema.
 * @param {String} schema the schema to set
 */
_pc.Accessor.prototype.setSchema = function(schema) {
  if (typeof schema !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.schema = schema;
};

///**
//* 外部Cellを取得する.
//* @return {String} the targetCellName
//*/
/**
 * This method returns the target cell name.
 * @return {String} the targetCellName
 */
_pc.Accessor.prototype.getTargetCellName = function() {
  return this.targetCellName;
};

///**
//* 外部Cellを設定する.
//* @param {String} targetCellName the targetCellName to set
//*/
/**
 * This method returns the target cell name.
 * @param {String} targetCellName the targetCellName to set
 */
_pc.Accessor.prototype.setTargetCellName = function(targetCellName) {
  if (typeof targetCellName !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.targetCellName = targetCellName;
};

///**
//* "self","client"等のタイプを設定する.
//* @param {String} accessType the accessType to set
//*/
/**
 * This method sets the type of client.
 * @param {String} accessType the accessType to set
 */
_pc.Accessor.prototype.setAccessType = function(accessType) {
  if (typeof accessType !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.accessType = accessType;
};

///**
//* "self","client"等のタイプを返却.
//* @return {String} タイプ
//*/
/**
 * This method gets the type of client.
 * @return {String} タイプ
 */
_pc.Accessor.prototype.getAccessType = function() {
  return this.accessType;
};

///**
//* トランスセルを設定する.
//* @param {String} transCellToken the trancCellToken to set
//*/
/**
 * This method sets the transformer cell token value.
 * @param {String} transCellToken the trancCellToken to set
 */
_pc.Accessor.prototype.setTransCellToken = function(trancCellToken) {
  if (typeof trancCellToken !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.transCellToken = trancCellToken;
};

///**
//* トランスセルを取得する.
//* @returns {String} the transCellToken
//*/
/**
 * This method gets the transformer cell token value.
 * @returns {String} the transCellToken
 */
_pc.Accessor.prototype.getTransCellToken = function() {
  return this.transCellToken;
};

///**
//* トランスセルリフレッシュトークンを設定する.
//* @param {String} trancCellRefreshToken the trancCellRefreshToken to set
//*/
/**
 * This method sets the transformer cell refresh token value.
 * @param {String} trancCellRefreshToken the trancCellRefreshToken to set
 */
_pc.Accessor.prototype.setTransCellRefreshToken = function(trancCellRefreshToken) {
  if (typeof trancCellRefreshToken !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.transCellRefreshToken = trancCellRefreshToken;
};

///**
//* トランスセルリフレッシュトークンを取得する.
//* @returns {String} the trancCellRefreshToken
//*/
/**
 * This method gets the transformer cell refresh token value.
 * @returns {String} the trancCellRefreshToken
 */
_pc.Accessor.prototype.getTransCellRefreshToken = function() {
  return this.transCellRefreshToken;
};

///**
//* スキーマユーザIDを設定する.
//* @param {String} schemaUserId the schemaUserId to set
//*/
/**
 * This method sets the schema user ID.
 * @param {String} schemaUserId the schemaUserId to set
 */
_pc.Accessor.prototype.setSchemaUserId = function(schemaUserId) {
  if (typeof schemaUserId !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.schemaUserId = schemaUserId;
};

///**
//* スキーマユーザIDを取得する.
//* @returns {String} the schemaUserId
//*/
/**
 * This method gets the schema user ID.
 * @returns {String} the schemaUserId
 */
_pc.Accessor.prototype.getSchemaUserId = function() {
  return this.schemaUserId;
};

///**
//* スキーマユーザパスワードを設定する.
//* @param {String} schemaPassword the schemaPassword to set
//*/
/**
 * This method sets the schema password.
 * @param {String} schemaPassword the schemaPassword to set
 */
_pc.Accessor.prototype.setSchemaPassword = function(schemaPassword) {
  if (typeof schemaPassword !== "string") {
    throw new _pc.DaoException("InvalidParameter");
  }
  this.schemaPassword = schemaPassword;
};

///**
//* スキーマユーザパスワードを取得する.
//* @returns {String} the schemaPassword
//*/
/**
 * This method gets the schema password.
 * @returns {String} the schemaPassword
 */
_pc.Accessor.prototype.getSchemaPassword = function() {
  return this.schemaPassword;
};

///**
//* サーバーのレスポンスから取得したレスポンスヘッダを設定.
//* @param headers 設定するヘッダ
//*/
/**
 * This method sets the response header acquired from the server response.
 * @param {Object} headers response headers
 */
_pc.Accessor.prototype.setResHeaders = function(headers) {
  this.resHeaders = headers;
};

///**
//* レスポンスヘッダの取得.
//* @return レスポンスヘッダの一覧
//*/
/**
 * This method gets the response header acquired from the server response.
 * @return {Object} response headers
 */
_pc.Accessor.prototype.getResHeaders = function() {
  return this.resHeaders;
};

/**
 * Get the cookie peer key.
 * @return {String} Cookie Peer Key
 */
_pc.Accessor.prototype.getCookiePeer = function() {
  return this.cookiePeer;
};

///**
//* 認証を行う.
//* @param {Boolean} useCookie to check p_cookie
//* @throws {DaoException} DAO例外
//*/
/**
 * This method performs authentication of current user based on token etc.
 * @param {Boolean} useCookie to check p_cookie
 * @throws {_pc.DaoException} DAO exception
 */
_pc.Accessor.prototype.authenticate = function(useCookie) {
  if (this.accessType === "token") {
    return;
  }
  var restAdapter = null;

  // 認証するurlを作成する
  /** Create URL for authentication */
  var authUrl = this.createCertificatUrl();

  // 認証するためのリクエストボディを作る
  /** Create request body for authentication */
  var requestBody = "";
  if (this.transCellToken !== null  && this.transCellToken !== "") {
    // トランスセルトークン認証
    /** Transformer cell token authentication */
    requestBody += "grant_type=urn:ietf:params:oauth:grant-type:saml2-bearer&assertion=";
    requestBody += this.transCellToken;
  } else if (this.transCellRefreshToken !== null && this.transCellRefreshToken !== "") {
    // リフレッシュトークン認証
    /** Refresh token authentication */
    requestBody += "grant_type=refresh_token&refresh_token=";
    requestBody += this.transCellRefreshToken;
  } else if (this.userId !== null && this.userId !== "") {
    // パスワード認証
    /** Password authentication */
    requestBody = "grant_type=password";
    requestBody += "&username=" + this.userId;
    requestBody += "&password=" + this.password;
  }

  // targetのURLを作る
  /** Create target URL */
  if (this.targetCellName !== null && this.targetCellName !== "") {
    requestBody += "&p_target=";
    if (_pc.UrlUtils.isUrl(this.targetCellName)) {
      requestBody += this.targetCellName;
    } else {
      requestBody += _pc.UrlUtils.append(this.baseUrl, this.targetCellName);
    }
  }

  // スキーマ付き認証のためにスキーマ情報を付加する
  /** Add schema information */
  if ((this.schemaUserId !== null && this.schemaUserId !== "") &&
      (this.schemaPassword !== null && this.schemaPassword !== "")) {
    // スキーマ認証
    /** Authentication schema */
    var schemaRequestBody = "";
    schemaRequestBody += "grant_type=password&username=";
    schemaRequestBody += this.schemaUserId;
    schemaRequestBody += "&password=";
    schemaRequestBody += this.schemaPassword;
    schemaRequestBody += "&p_target=";
    schemaRequestBody += authUrl;
    // Urlでない場合は、BaseURLにスキーマ名を足す
    /** If this is not the Url, and add the schema name to BaseURL */
    if (!_pc.UrlUtils.isUrl(this.schema)) {
      this.schema = _pc.UrlUtils.append(this.baseUrl, this.schema);
    }

    if (!this.schema.endsWith("/")) {
      this.schema += "/";
    }
    restAdapter = _pc.RestAdapterFactory.create(this);
    restAdapter.post(_pc.UrlUtils.append(this.schema, "__token"), schemaRequestBody,"application/x-www-form-urlencoded");
    this.schemaAuth = restAdapter.bodyAsJson();

    requestBody += "&client_id=";
    requestBody += this.schema;
    requestBody += "&client_secret=";
    requestBody += this.schemaAuth.access_token;
  }

  //if cookie is set and p_target is not specified
  if(useCookie !== undefined){
    if(useCookie && (this.targetCellName === null || this.targetCellName === "")){
      requestBody += "&p_cookie=true";
    }
  }

  if (this.owner) {
    requestBody += "&p_owner=true";
  }

  // 認証してトークンを保持する
  /** To hold the token to authenticate */
  var requestUrl = _pc.UrlUtils.append(authUrl, "__auth");
  restAdapter = _pc.RestAdapterFactory.create(this);
  restAdapter.post(requestUrl, requestBody,"application/x-www-form-urlencoded");

  var responseJson = restAdapter.bodyAsJson();
  if(restAdapter.getStatusCode() >= 400){
    //invalid grant - authentication failed
    throw new _pc.DaoException(responseJson.error, restAdapter.getStatusCode());
  }
  this.accessToken = responseJson.access_token;
  this.expiresIn = responseJson.expires_in;
  this.refreshToken = responseJson.refresh_token;
  this.refreshExpiresIn = responseJson.refresh_token_expires_in;
  this.tokenType = responseJson.token_type;

  //if p_cookie_peer value is received in response
  if(responseJson.p_cookie_peer !== undefined && responseJson.p_cookie_peer !== "" && responseJson.p_cookie_peer !== null){
    this.cookiePeer = responseJson.p_cookie_peer;
  }
};

///**
//* 認証先Cellのburlを作成する.
//* @return {String} 認証先Cellのurl
//* @throws {DaoException} DAO例外
//*/
/**
 * This method creates certification URL.
 * @return {String} Url of authentication destination Cell
 * @throws {_pc.DaoException} DAOexception
 */
_pc.Accessor.prototype.createCertificatUrl = function() {
  var authUrl = "";
  if (_pc.UrlUtils.isUrl(this.cellName)) {
    authUrl = this.cellName;
  } else {
    authUrl = _pc.UrlUtils.append(this.baseUrl, this.cellName);
  }
  return authUrl;
};

///**
//* Cellへのグローバルトークンを取得する.
//* @return トークン
//*/
/**
 * This method returns the global token of the cell.
 * @return {String} global token
 */
_pc.Accessor.prototype.loadGlobalToken = function() {
  return "";
};

///**
//* Boxへのローカルトークンを取得する.
//* @return トークン
//*/
/**
 * This method returns the local token of Box.
 * @return {String} local token
 */
_pc.Accessor.prototype.loadClientToken = function() {
  return "";
};

