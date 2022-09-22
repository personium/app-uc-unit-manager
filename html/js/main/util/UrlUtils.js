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

/*global _pc:false
 */

///**
//* URL文字列を操作するクラス.
//* @constructor
//*/
/**
 * Class to manipulate the URL string.
 * @constructor
 */
_pc.UrlUtils = function() {
};

///**
//* URLにパスを追加する.
//* @static
//* @param baseUrl URL文字列
//* @param path 追加するパス
//* @return 生成したURL文字列
//*/
/**
 * This method appends the path to BaseURL.
 * @static
 * @param {String} baseUrl BaseURL
 * @param {String} path Path
 * @return {String} Complete URL
 */
_pc.UrlUtils.append = function(baseUrl, path) {
  var url = baseUrl;
  if (!baseUrl.endsWith("/")) {
    url += "/";
  }
  url += path;
  return url;
};

///**
//* 対象urlが有効かチェックを行う.
//* @static
//* @param url チェック対象url文字列
//* @return true： 有効/false：無効
//*/
/**
 * This method checks whether the target URL is valid or not.
 * @static
 * @param {String} url Target URL
 * @return {Boolean} true： Enable/false: Disable
 */
_pc.UrlUtils.isUrl = function(url) {
  if (url.match(/^(http|https):\/\//i)) {
    return true;
  }
  return false;
};

