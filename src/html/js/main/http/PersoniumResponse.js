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
 * It creates a new object _pc.PersoniumResponse.
 * @class This class is used to handle DAV Response.
 * @param {Object} response object
 * @constructor
 * @param {Object} resObj
 */
_pc.PersoniumResponse = function(resObj) {
  this.initializeProperties(resObj);
};

///**
//* プロパティを初期化する.
//* @param resObj response object
//*/
/**
 * This method initializes the properties of this class.
 * @param {Object} response object
 */
_pc.PersoniumResponse.prototype.initializeProperties = function(resObj) {
  this.response = resObj;
  this.debugHttpResponse(resObj);
};

/**
 * This method returns the HTTP Status Code.
 * @return {String} HTTP Status Code
 */
_pc.PersoniumResponse.prototype.getStatusCode = function() {
  return this.response.status;
};

/**
 * The purpose of this method is to generate header
 * @param {String} key
 * @returns {String} header
 */
_pc.PersoniumResponse.prototype.getHeader = function(key) {
  var header = this.response.getResponseHeader(key);
  if (header === null) {
    header = "";
  }
  return header;
};

//jPersoniumResponse.prototype.bodyAsStream = function() {
//InputStream is = null;
//try {
//is = this.getResponseBodyInputStream(response);
//} catch (IOException e) {
//throw new RuntimeException(e);
//}
//return is;
//};

/**
 * The purpose of this method is to return the body in string form.
 * @returns {String} responseText
 */
_pc.PersoniumResponse.prototype.bodyAsString = function() {
  return this.response.responseText;
//if (typeof enc == "undefined") {
//enc = "utf-8";
//}
//InputStream is = null;
//InputStreamReader isr = null;
//BufferedReader reader = null;
//try {
//is = this.getResponseBodyInputStream(response);
//if (is == null) {
//return "";
//}
//isr = new InputStreamReader(is, enc);
//reader = new BufferedReader(isr);
//StringBuffer sb = new StringBuffer();
//int chr;
//while ((chr = reader.read()) != -1) {
//sb.append((char) chr);
//}
//return sb.toString();
//} catch (IOException e) {
//throw DaoException.create("io exception", 0);
//} finally {
//try {
//if (is != null) {
//is.close();
//}
//if (isr != null) {
//isr.close();
//}
//if (reader != null) {
//reader.close();
//}
//} catch (Exception e) {
//throw DaoException.create("io exception", 0);
//} finally {
//try {
//if (isr != null) {
//isr.close();
//}
//if (reader != null) {
//reader.close();
//}
//} catch (Exception e2) {
//throw DaoException.create("io exception", 0);
//} finally {
//try {
//if (reader != null) {
//reader.close();
//}
//} catch (Exception e3) {
//throw DaoException.create("io exception", 0);
//}
//}
//}
//}
};

/**
 * This method retrieves and parses the response body with a JSON format.
 * @return {Object} parsed response JSON object.
 * @throws {_pc.DaoException} Client Exception
 */
_pc.PersoniumResponse.prototype.bodyAsJson = function() {
  try {
    //this.response.bodyAsString
    return JSON.parse(this.response.responseText);

  } catch (e) {
    throw new _pc.DaoException("parse exception: " + e.message, 0);
  }
};

/**
 * This method retrieves and parses the response body with an XML format.
 * @return {String} XML parsed response body as XML DOM.
 */
_pc.PersoniumResponse.prototype.bodyAsXml = function() {
  return this.response.responseXML;
};



//jPersoniumResponse.prototype.getResponseBodyInputStream = function(res) {
//Header[] contentEncodingHeaders = res.getHeaders("Content-Encoding");
//if (contentEncodingHeaders.length > 0 && "gzip".equalsIgnoreCase(contentEncodingHeaders[0].getValue())) {
//return new GZIPInputStream(res.getEntity().getContent());
//} else {
//HttpEntity he = res.getEntity();
//if (he != null) {
//return he.getContent();
//} else {
//return null;
//}
//}
//};

/**
 * The purpose of this method is to perform logging operations while debugging
 * @param {_pc.PersoniumHttpClient} httpResponse
 */
_pc.PersoniumResponse.prototype.debugHttpResponse = function(res) {
  if (res !== null) {
    console.log("(Response) ResponseCode: " + res.statusText + "(" + res.status + ")");
    var headers = res.getAllResponseHeaders();
    var array = headers.split("\n");
    for (var i = 0; i < array.length; i++) {
      var keyValue = array[i].split(": ");
      console.log("ResponseHeader[" + keyValue[0] + "] : " + keyValue[1]);
    }
  }
};

