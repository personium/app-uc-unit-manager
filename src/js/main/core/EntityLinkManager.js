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
 * Prototype Constructor of EntityLinkManager
 * extends EntitySet
 * */
_pc.EntityLinkManager = function(as, collection) {
    this.initializeProperties(this, as, collection);
};
_pc.PersoniumClass.extend(_pc.EntityLinkManager, _pc.EntitySet);

/**Initialize properties
 * */
_pc.EntityLinkManager.prototype.initializeProperties = function(self, as, collection) {
    this.uber = _pc.EntitySet.prototype;
    this.uber.initializeProperties(self, as, collection);
};

/**
 * Create link between entities-property
 * */
_pc.EntityLinkManager.prototype.create = function(uri,targetURI) {
	var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
	var response = restAdapter.post(uri, JSON.stringify(targetURI), "application/json");
	return response;
};

/**
 * retrieve link between entities-property
 * */
_pc.EntityLinkManager.prototype.get = function(uri) {
	var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
	var response = restAdapter.get(uri, "", "application/json");
	return response;
};

/**
 * The purpose of this method is to create url for entity link operations
 * @param entityIDLink
 * @returns {String}
 */
_pc.EntityLinkManager.prototype.getUrl = function(entityLinkID) {
    var sb = "";
    sb += this.collection.getPath() + "('" + entityLinkID + "')";
    return sb;
};

/**
 * The purpose of the following method is to delete an entity link.
 * @param entityLinkID
 * @param etag
 * @returns
 */
_pc.EntityLinkManager.prototype.del = function(entityLinkID, etag) {
	if (typeof etag == undefined) {
		etag = "*";
	}
	var url = this.getUrl(entityLinkID);
	var restAdapter = _pc.RestAdapterFactory.create(this.accessor);
	var response = restAdapter.del(url, etag,"");
	return response;
};
