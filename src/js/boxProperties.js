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
function boxProperties() {
}

var uBoxProperty = new boxProperties();
var existingProptachList = [];
var setProptachList = [];
var isPropertyNodeExist = false;

/**
 * The purpose of this function is to get selected collection/Box property detail
 * using PROPFIND command
 */
boxProperties.prototype.getXmlData = function () {
	document.getElementById("popupXmlTextAreaError").innerHTML = "";
	this.toggleSaveButton();
	var path = this.getPath();
	var cellName = sessionStorage.selectedcell;
	var boxName = collectionPath;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.propfind(path);
	var xmlContent = response.httpClient.responseText;
	if (response.httpClient.status == 207) {
		//$("#textXmlView").val(xmlContent);
		$("#textXmlView").val(decodeURIComponent(xmlContent));
		openCreateEntityModal('#xmlViewPopUpModalWindow', '#xmlViewDialogBox', 'textXmlView');
		$("#textXmlView").scrollTop(0);
		$("#textXmlView").scrollLeft(0);
	} else if (response.httpClient.status == 401) {
		var contextRoot = sessionStorage.contextRoot;
		window.location.href = contextRoot;
	}
};

/**
 * The purpose of this function is to edit XML data.
 */
boxProperties.prototype.editXmlData = function () {
	if(document.getElementById("btnXmlViewEdit").value == "Edit"){
		$('#textXmlView').removeAttr('readonly');
		this.toggleEditButton();
		var existingText = $("#textXmlView").val();
		var existingXml = this.StringtoXML(existingText);
		existingProptachList = this.getPropertyList(existingXml);
	} else if(document.getElementById("btnXmlViewEdit").value == "Save"){
		var newText = $("#textXmlView").val();
		if (newText.length > 0) {
			var newXml = this.StringtoXML(newText);
			if (this.validateNonEditableProperty(newXml)) {
			setProptachList = this.getPropertyList(newXml);
			var removedPropertyList = [];
			if (setProptachList.length > 0){
				removedPropertyList = 	this.getRemovedProperty(setProptachList, existingProptachList);
			} else {
				removedPropertyList = existingProptachList;
			}
			var response = this.setPropatch(setProptachList, removedPropertyList);
			if (response.httpClient.status == 207) {
				setProptachList.length = 0;
				existingProptachList.length = 0;
				$('#textXmlView').attr('readonly','readonly');
				this.getXmlData();
				this.toggleSaveButton();
			} else if (response.httpClient.status == 400) {
				var badRequest = getUiProps().MSG0146;
				document.getElementById("popupXmlTextAreaError").innerHTML = badRequest;
			}
		} 
		}else {
			var emptyMessage = getUiProps().MSG0147;
			document.getElementById("popupXmlTextAreaError").innerHTML = emptyMessage;
		}
	}
};

/**
 * The purpose of this function is to get list of properties
 * to be removed from XML.
 * 
 * @param setProptachList
 * @param existingProptachList
 * @returns {Array}
 */
boxProperties.prototype.getRemovedProperty = function (setProptachList, existingProptachList){
	var removedPropList = [];
	removedPropList.length = 0;
	var propertyPair = "";
	for (var i = 0; i<existingProptachList.length; i++) {
		propertyPair = {"propName" : existingProptachList[i].propName,"propValue" : existingProptachList[i].propValue};
		var test = this.isPropertyNodeExist(existingProptachList[i].propName);
		if (test == false) {
			removedPropList.push(propertyPair);
		} else {
		//		
		}
	}
	return removedPropList;
};

/**
 * The purpose of this function is to check existence of property
 * name in existing XML.
 * 
 * @param existingNodeName
 * @returns {Boolean}
 */
boxProperties.prototype.isPropertyNodeExist = function (existingNodeName) { 
	for (var i = 0; i<setProptachList.length; i++) {
		var propertyName = setProptachList[i].propName;
		if(propertyName == existingNodeName) {
			isPropertyNodeExist = true;	
			break;
		} else {
			isPropertyNodeExist = false;
		}
	}
	return isPropertyNodeExist;
};

/**
 * The purpose of this function is to set property.
 * 
 * @param setProptachList
 * @param removedPropertyList
 * @returns
 */
boxProperties.prototype.setPropatch = function (setProptachList, removedPropertyList){
	var path = this.getPath();
	var cellName = sessionStorage.selectedcell;
	var boxName = collectionPath;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.multiProppatch(path, setProptachList, removedPropertyList);
	return response;
};

/**
 * The purpose of this function is to get path of selected collection.
 * 
 * @returns {String}
 */
boxProperties.prototype.getPath = function (){
	var boxName = boxHeirarchyPath;
	var mainBoxValue = getUiProps().MSG0039;
	var path = sessionStorage.selectedcellUrl + boxName;
	var colName= objOdata.getSelectedCollectionName();
	if (colName.length == 0) {
		colName = uFileDownload.getSelectedFileInsideServiceCollection();//sessionStorage.serviceFileName;
	}
	if (!path.endsWith("/")) {
		path += "/";
	}
	if (sessionStorage.resourcetype == 'p:service') {
		//path += sessionStorage.rowSelectCollectionName;
		path += "__src/";
	}
	path += colName;
	uFileDownload.clearServiceCollectionData();
	path = path.replace(mainBoxValue, getUiProps().MSG0293);
	return path;
};

/**
 * The purpose of this function is to get property list of
 * selected collection.
 * 
 * @param xmlData
 * @returns {Array}
 */
boxProperties.prototype.getPropertyList = function (xmlData){
	var nl = xmlData.getElementsByTagName("response");
	var elm = nl[0];
	var propList = [];
	var name="";
	var propChildNodes = elm.getElementsByTagName("prop")[0].childNodes;
	for ( var i = 0; i < propChildNodes.length; i++) {
		if (propChildNodes[i].nodeName!= "#text" && propChildNodes[i].nodeName!= "acl" && propChildNodes[i].nodeName!= "resourcetype" 
			&& propChildNodes[i].nodeName!="creationdate" && propChildNodes[i].nodeName!="getlastmodified" && propChildNodes[i].nodeName!='getcontentlength' 
				&& propChildNodes[i].nodeName!='getcontenttype'){
			name = {"id" : i,"propName" :  propChildNodes[i].nodeName,"propValue" : propChildNodes[i].textContent};
			propList.push(name);
		}
	}
	return propList;
};

/**
 * The purpose of this function is to convert string to XML.
 * 
 * @param text
 * @returns {___doc0}
 */
boxProperties.prototype.StringtoXML = function (text){
	 var doc = null;
	if (window.ActiveXObject) {
		doc = new ActiveXObject('Microsoft.XMLDOM');
		doc.async = 'false';
		doc.loadXML(text);
	} else {
		var parser = new DOMParser();
		doc = parser.parseFromString(text, 'text/xml');
	}
	return doc;
};

/**
 * The purpose of this function is to close xml popup and refresh 
 * property table
 * @param modelId
 */
boxProperties.prototype.closeXmlPopup = function(modelId){
	$(modelId).hide();
	//objOdata.populatePropertiesList();
};
/**
 * The purpose of this function is  toggle save button.
 */
boxProperties.prototype.toggleSaveButton = function(){
	if(document.getElementById("btnXmlViewEdit").value == "Save"){
		$('#textXmlView').attr('readonly','readonly');
		document.getElementById("btnXmlViewEdit").value = "Edit";
		document.getElementById("btnXmlViewEdit").title = "Edit";
	}
};

/**
 * The purpose of this function is  toggle edit button.
 */
boxProperties.prototype.toggleEditButton = function(){
	if(document.getElementById("btnXmlViewEdit").value == "Edit"){
		document.getElementById("btnXmlViewEdit").value = "Save";
		document.getElementById("btnXmlViewEdit").title = "Save";
	} 
};

/**
 * The purpose of this function is to validate non editable property
 * @param xmlData 
 * @returns {Boolean}
 */
boxProperties.prototype.validateNonEditableProperty = function(xmlData){
	var nl = xmlData.getElementsByTagName("response");
	var elm = nl[0];
	var creationdate = elm.getElementsByTagName("creationdate")[0];
	var getlastmodified = elm.getElementsByTagName("getlastmodified")[0];
	var resourceType = elm.getElementsByTagName("resourcetype")[0];
	var getcontentlength = elm.getElementsByTagName("getcontentlength")[0];
	var getcontenttype = elm.getElementsByTagName("getcontenttype")[0];
	var collectionName = objOdata.getSelectedCollectionName();
	var fileType = objOdata.getFileType();
	var defaultPropertyMsg = getUiProps().MSG0148;
	if (creationdate == undefined) {
		document.getElementById("popupXmlTextAreaError").innerHTML = defaultPropertyMsg;
		return false;
	} else if (getlastmodified == undefined) {
		document.getElementById("popupXmlTextAreaError").innerHTML = defaultPropertyMsg;
		return false;
	} else if (resourceType == undefined) {
		document.getElementById("popupXmlTextAreaError").innerHTML = defaultPropertyMsg;
		return false;
	} else if (getcontentlength == undefined && collectionName.length != 0 && fileType == 'file') {
		document.getElementById("popupXmlTextAreaError").innerHTML = defaultPropertyMsg;
		return false;
	} else if (getcontenttype == undefined && collectionName.length != 0 && fileType == 'file') {
		document.getElementById("popupXmlTextAreaError").innerHTML = defaultPropertyMsg;
		return false;
	}
	return true;
	
};

$(document).ready(function() {
	$.ajaxSetup({ cache : false });
	if(sessionStorage.tabName == "Box"){
		/*$("#btnXmlView").click(function() {
			
			uBoxProperty.getXmlData();
		});*/
		$("#btnXmlViewEdit").click(function() {
			//uBoxProperty.editXmlData();
		});
	}

});