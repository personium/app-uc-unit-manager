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
 * @class EntityLink
 * @constructor
 * @augments AbstractODataContext
 */
_pc.EntityLink = function(as, path) {
    this.initializeProperties(this, as, path);
};
_pc.PersoniumClass.extend(_pc.EntityLink, _pc.AbstractODataContext);

/**
 * プロパティを初期化する.
 */
_pc.EntityLink.prototype.initializeProperties = function(self, as, path) {
    this.uber = _pc.AbstractODataContext.prototype;
    this.uber.initializeProperties(self, as);

    if (as !== undefined) {
        self.accessor = as.clone();
    }

    /** キャメル方で表現したクラス名. */
    self.CLASSNAME = "";
    /** コレクションのパス. */
    self.url = path;

};

/**
 * URLを取得.
 * @return URL文字列
 */
_pc.EntityLink.prototype.getPath = function() {
    return this.url;
};

/**
 * ODataのキーを取得する.
 * @return ODataのキー情報
 */
_pc.EntityLink.prototype.getKey = function() {
    return "";
};

/**
 * クラス名をキャメル型で取得する.
 * @return ODataのキー情報
 */
_pc.EntityLink.prototype.getClassName = function() {
    return this.CLASSNAME;
};

