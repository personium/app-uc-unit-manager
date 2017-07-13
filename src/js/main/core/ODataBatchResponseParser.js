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
//* $Batchのレスポンスを解析するクラス.
//* @class Represents ODataBatchResponseParser.
//*/
/**
 * This class is used to analyze the response of $ Batch.
 * @class Represents ODataBatchResponseParser.
 */
_pc.ODataBatchResponseParser = function() {
  this.initializeProperties(this);
};

/** Variable BOUNDARY_KEY. */
_pc.ODataBatchResponseParser.BOUNDARY_KEY = "--batch_";
/** Variable CHARSET_KEY. */
_pc.ODataBatchResponseParser.CHARSET_KEY = "--changeset_";
/** Variable HTTP. */
_pc.ODataBatchResponseParser.HTTP = "HTTP/1.1";
/** Variable CRLF. */
_pc.ODataBatchResponseParser.CRLF = "\n";
/** Variable BLANK_LINE. */
_pc.ODataBatchResponseParser.BLANK_LINE = "\n\n";
/** Variable CONTENTTYPE_HTTP. */
_pc.ODataBatchResponseParser.CONTENTTYPE_HTTP = "application/http";
/** Variable CONTENTTYPE_MULTIPART. */
_pc.ODataBatchResponseParser.CONTENTTYPE_MULTIPART = "application/http";

///**
//* オブジェクトを初期化.
//* @param {_pc.ODataBatchResponseParser} self
//*/
/**
 * This method initializes the properties of this class.
 * @param {_pc.ODataBatchResponseParser} self
 */
_pc.ODataBatchResponseParser.prototype.initializeProperties = function(self) {
//  /** レスポンス情報の一覧. */
    /** List of response information. */
  self.resList = [];
};

///**
//* レスポンス解析.
//* @param reader レスポンスボディReader
//* @return ODataResponseの配列
//*/
/**
 * This method performs analysis on response.
 * @param {String} reader Reader response body
 * @return {Array} Array of ODataResponse
 */
_pc.ODataBatchResponseParser.prototype.parse = function(reader) {
  this.parseBoundary(reader, _pc.ODataBatchResponseParser.BOUNDARY_KEY);
  return this.resList;
};

/**
 * This method parses the boundary.
 * @param {String} reader
 * @param {String} boudaryKey
 */
_pc.ODataBatchResponseParser.prototype.parseBoundary = function(reader, boudaryKey) {
  var br = reader.split(_pc.ODataBatchResponseParser.CRLF);
  var lineCnt = 0;
  var sb = "";
  try {
    var str = br[lineCnt++];
    while ((str !== null) && (typeof str !== "undefined")) {
      if (str.startsWith(boudaryKey)) {
        if (sb.length > 0) {
          this.parseBodyBlock(sb);
          sb = "";
        }
        str = br[lineCnt++];
        continue;
      }
      sb += str;
      sb += _pc.ODataBatchResponseParser.CRLF;
      str = br[lineCnt++];
    }
  } catch (e) {
    throw e;
  }
};

/**
 * This method parses the body.
 * @param {String} body
 */
_pc.ODataBatchResponseParser.prototype.parseBodyBlock = function(body) {
  // 空行で分割する
  /** Splitting it by a blank line. */
  var blocks = body.split(_pc.ODataBatchResponseParser.BLANK_LINE);

  // ブロックが2個以上存在しなければHttpレスポンス型ではない
  /** It is not a Http response type block unless there are two or more. */
  if (blocks.length < 2) {
    return;
  }

  // ブロックのヘッダ部を取得
  /** Get the header portion of the block. */
  var boundaryHeaders = this.parseHeaders(blocks[0]);

  // ブロックヘッダのContent-Typeを取得
  /** Get the Content-Type header of the block. */
  var contentType = boundaryHeaders["Content-Type"];

  if ((contentType !== null) && (typeof contentType !== "undefined")) {
    if (contentType.startsWith(_pc.ODataBatchResponseParser.CONTENTTYPE_HTTP)) {
      // application/http ならば １つのリクエスト
      /** one request if application / http. */
      var responseBody = "";
      // ボディ内に空行がふくまれている場合、２個目以降を連結する
      /** If there is a blank line in the body, then connect second and subsequent lines. */
      for (var i = 2; i < blocks.length; i++) {
        responseBody += blocks[i];
      }
      this.resList.push(new _pc.ODataBatchResponse(blocks[1], responseBody));
    } else {
      // multipart/mixed ばらばマルチパート(複数のブロックで構成)
      /** (consist of blocks) multipart / mixed multipart Barabbas. */
      this.parseBoundary(body, _pc.ODataBatchResponseParser.CHARSET_KEY);
    }
  }
};

///**
//* 複数行の塊となっているレスポンスヘッダーを分解してハッシュマップにセットする.
//* @param value レスポンスヘッダ文字列
//* @return １つ１つに分解されたハッシュマップ
//*/
/**
 * This method parses the headers to return values in Array format.
 * @param {String} value Response header string
 * @return {Array} map
 */
_pc.ODataBatchResponseParser.prototype.parseHeaders = function(value) {
  // 改行コードで分解する
  /** Decompose with a new line code. */
  var lines = value.split(_pc.ODataBatchResponseParser.CRLF);
  var map = [];
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var key = line.split(":");
    if (key.length > 1) {
      // 前後に空白が含まれている可能性があるため、トリムしてからセットする
      /** Because there is a possibility of spaces in front and rear, so sets it after trim. */
      map[key[0].trim()] = key[1].trim();
    }
  }
  return map;
};
