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
function linkEntities() {
}

var uLinkEntity = new linkEntities();

linkEntities.prototype.retrieveLinks = function(cx, source,
		 destination, key, boxname, rolename) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);	
	var context = objCommon.initializeAbstractDataContext();
	var objLinkManager = new _pc.LinkManager(accessor, context);
	 var restAdapter = _pc.RestAdapterFactory.create(accessor);
	 var response = "";
	 var uri = "";
	 if (boxname === "" || rolename === "") {
		 uri = objLinkManager.getLinkUrlWithKey(cx, source, destination,key);
		 response = restAdapter.get(uri, "application/json");
	 } else {
		 uri = objLinkManager.getLinkUrlWithKey(cx, source, destination,key);
		 var roleuri = objLinkManager.getRoleUri(cx, source, destination,boxname, rolename);
		 response = restAdapter.get(uri, "application/json", roleuri);
	 }
	 return response;
};