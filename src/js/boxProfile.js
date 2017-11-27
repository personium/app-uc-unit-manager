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
function boxProfile () {
}
var objBoxProfile = new boxProfile();
//var imgBinaryFile = null;
boxProfile.prototype.SOURCE = "Box";
boxProfile.prototype.DESTINATION = "Role";
boxProfile.prototype.profileFileName = "profile.json";
boxProfile.prototype.imgBinaryFile = null;
boxProfile.prototype.profileImage = null;
var ERRORSTATUSCODE = 404;
var SUCCESSSTATUSCODE = 200;
var isBoxProfileFileValid = true;

/**
 * The purpose of this function is to implement alternate row color 
 * in table.
 */
boxProfile.prototype.alternateRowColor = function () {
	$(".profileTable tr:odd").css("background-color", "#F4F4F4");
	$(".selectProfileRow").css("background-color", "#dfdfdf");
};

/**
 * The purpose of this function is to create role table for the grid.
 */
boxProfile.prototype.boxProfileRoleTable = function () {
	var url =  getClientStore().baseURL; 
	var cellName = sessionStorage.selectedcell.toString();
	var boxName = sessionStorage.boxName;
	$(".dynamicBoxProfileRow").remove();
	var accessor = objCommon.initializeAccessor(url, cellName);
	var objAbstractDataContext =  new _pc.AbstractODataContext(accessor);
	var objLinkManager = new _pc.LinkManager(accessor, objAbstractDataContext);
	var response =  objLinkManager.retrieveBoxProfileLinks(objAbstractDataContext,objBoxProfile.SOURCE, objBoxProfile.DESTINATION, boxName);
	var responseBody = response.bodyAsJson();
	var json = responseBody.d.results;
	var len = json.length;
	dynamicTable = "<form name = 'ftable'>";
	dynamicTable += '<table id = "mainTable" cellpadding = "0" cellspacing = "0" border = "0" class = "profileTable">';
	for(var count = 0; count < len; count++) {
		var obj = json[count];
		var roleName = objCommon.getRoleNameFromURI(obj.uri);
		var shorterRoleName = roleName;//objCommon.getShorterEntityName(roleName);
		roleName = "'"+roleName+"'";
		dynamicTable += "<tr id= 'row_"+count+"' class = 'dynamicBoxProfileRow' onclick = 'objBoxProfile.highlightRow("+count+");'>";
		dynamicTable += '<td name = "acc" title = '+roleName+' style="max-width: 250px; width = 90%"><div class = "mainTableEllipsis">'+shorterRoleName+'</div></td>';
		dynamicTable += '<td ><a href = "#" class = "profileDeleteIcon" onclick = "objBoxProfile.openBoxProfileRoleDeleteWindow('+roleName+');"></a></td>';
		dynamicTable += "</tr>";
	}
	dynamicTable += "</table>";
	dynamicTable += "</form>";
	document.getElementById("roleDiv").innerHTML = dynamicTable;
	objBoxProfile.alternateRowColor();
};

/**
 * The purpose of this function is to highlight particular row of 
 * role table.
 */
boxProfile.prototype.highlightRow = function (count) {
	var rowId = '#row_'+count;
	$('#relationRow_'+count).siblings().removeClass('selectRow');
	$(rowId).siblings().removeClass('selectProfileRow');
	$(rowId).siblings().removeClass('selectRow');
	$(rowId).addClass('selectProfileRow');
	$(rowId).addClass('selectRow');
	};

/**
 * The purpose of this function is to open model pop up window
 * for role delete.
 * @param roleName
 */
boxProfile.prototype.openBoxProfileRoleDeleteWindow = function (roleName) {
	roleName = roleName.split(' ').join('');
	sessionStorage.BoxProfileRoleName = roleName;
	openCreateEntityModal("#boxProfileRoleDeleteModalWindow", "#boxProfileRoleDeleteDialogBox");
};


/**
 * The purpose of this function is to implement role delete functionality
 */
boxProfile.prototype.deleteBoxProfileRole = function () {
	var baseUrl =  getClientStore().baseURL; 
	var cellName = sessionStorage.selectedcell.toString();
	var boxName = sessionStorage.boxName;
	var roleName = sessionStorage.BoxProfileRoleName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var response = objRoleManager.del(roleName, boxName);
	var statusCode = objCommon.getStatusCode(response);
	if (statusCode == 204) {
		objCommon.displaySuccessfulMessage("Role", roleName, "deleted", "#boxProfileRoleDeleteModalWindow");
	} else if (statusCode == 409) {
		objCommon.displayConflictMessage("Role", roleName,"#boxProfileRoleDeleteModalWindow");
	}
};

/**
 * The purpose of this function is to implement relation delete functionality
 */
boxProfile.prototype.deleteBoxProfileRelation = function () {
	var baseUrl =  getClientStore().baseURL; 
	var cellName = sessionStorage.selectedcell.toString();
	var boxName = sessionStorage.boxName;
	var relationName = sessionStorage.BoxProfileRelationName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelManager = new _pc.RelationManager(accessor);
	var response = objRelManager.del(relationName, boxName);
	var statusCode = objCommon.getStatusCode(response);
	if (statusCode === 204) {
		objCommon.displaySuccessfulMessage("Relation", relationName, "deleted", "#boxProfileRelationDeleteModalWindow");
	} else if (statusCode === 409) {
		objCommon.displayConflictMessage("Relation", relationName, "#boxProfileRelationDeleteModalWindow");
	}
};

/**
 * The purpose of this function is to create role form box profile tab.
 */
boxProfile.prototype.createRoleFromBoxProfile = function () {
	var roleName = document.getElementById("roleNamePopup").value;
	var json = null;
	var baseUrl =  getClientStore().baseURL; 
	var cellName = sessionStorage.selectedcell.toString();
	var boxName = sessionStorage.boxName;
	json = {"Name" : roleName,"_Box.Name" : boxName};
	if (objBoxProfile.validateRoleName(roleName,"roleBoxPopupErrorMsg")) {
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var objRole = new _pc.Role(accessor, json);
		var objRoleManager = new _pc.RoleManager(accessor);
		var check =false;
		try {
			objRoleManager.retrieve(roleName,boxName);
		} catch(exception) {
			check = true;
		}
		var success = objBoxProfile.isRoleExist(check, accessor, objRole, objRoleManager);
		if (success) {
			objCommon.displaySuccessfulMessage("Role", roleName, "created", "#linkRoleWithBoxModal");
		}
	}
};

/**
 * The purpose of this function is to check existence of role and box combination before 
 * before creating the same.
 */
boxProfile.prototype.isRoleExist = function (check, accessor, objRole, objRoleManager) {
	if (check === true) {
		objRoleManager.create(objRole);
		return true;
	}
	var existMessage = getUiProps().MSG0007;
	document.getElementById("roleBoxPopupErrorMsg").innerHTML = existMessage;
	return false;
};

/**
 * The purpose of this function is to validate role name.
 */
boxProfile.prototype.validateRoleName = function (roleName, errorSpanID) {
	//The following regex finds under score(_) and hyphen(-).
	var specialCharacter = /^[-_]*$/;
	//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(upper case).
	var letter = /^[0-9a-zA-Z-_]+$/;
	var minLengthMessage = getUiProps().MSG0003;
	var maxLengthMessage = getUiProps().MSG0004;
	var charMessage = getUiProps().MSG0005;
	var specialCharMessage = getUiProps().MSG0006;
	var lenRoleName = roleName.length;
	if((lenRoleName < 1)) {
		document.getElementById(errorSpanID).innerHTML = minLengthMessage;
		return false;
	} else if((lenRoleName > 128)) {
		document.getElementById(errorSpanID).innerHTML = maxLengthMessage;
		return false;
	} else if(lenRoleName != 0 && !(roleName.match(letter))) {
		document.getElementById(errorSpanID).innerHTML = charMessage;
		return false;
	} else if(lenRoleName != 0 && (specialCharacter.toString().indexOf(roleName.substring(0, 1)) >= 0)) {
		document.getElementById(errorSpanID).innerHTML = specialCharMessage;
		return false;
	} else {
		return true;
	}
		return true;
};

/********************************Box Profile Relation Panel Start****************************************/

/**
 * The purpose of this function is to create relation table for box profile grid.
 */
boxProfile.prototype.boxProfileRelationTable = function () {
	var url =  getClientStore().baseURL; 
	var cellName = sessionStorage.selectedcell.toString();
	var boxName = sessionStorage.boxName;
	$(".dynamicBoxRelationRow").remove();
	var accessor = objCommon.initializeAccessor(url, cellName);
	var objAbstractDataContext =  new _pc.AbstractODataContext(accessor);
	var objLinkManager = new _pc.LinkManager(accessor, objAbstractDataContext);
	var response =  objLinkManager.retrieveBoxProfileLinks(objAbstractDataContext,objBoxProfile.SOURCE, "Relation", boxName);
	var responseBody = response.bodyAsJson();
	var json = responseBody.d.results;
	var len = json.length;
	dynamicTable = "<form name = 'ftable'>";
	dynamicTable += '<table id = "mainTable" cellpadding = "0" cellspacing = "0" border = "0" class = "profileTable boxProfileRelation">';
	for(var count = 0; count < len; count++) {
		var obj = json[count];
		var relationName = objCommon.getRelationNameFromURI(obj.uri);
		var shorterRelationName = relationName;//objCommon.getShorterEntityName(relationName);
		relationName = "'"+relationName+"'";
		dynamicTable += "<tr id= 'relationRow_"+count+"' class = 'dynamicBoxRelationRow' onclick = 'objBoxProfile.highlightRelationRow("+count+");'>";
		dynamicTable += '<td name = "acc" title = '+relationName+' style="max-width: 250px; width = 90%"><div class = "mainTableEllipsis">'+shorterRelationName+'</div></td>';
		dynamicTable += '<td ><a href = "#" class = "profileDeleteIcon" onclick = "objBoxProfile.openBoxProfileRelationDeleteWindow('+relationName+');"></a></td>';
		dynamicTable += "</tr>";
	}
	dynamicTable += "</table>";
	dynamicTable += "</form>";
	document.getElementById("relationDiv").innerHTML = dynamicTable;
	$(".boxProfileRelation tr:odd").css("background-color", "#F4F4F4");
	//objBoxProfile.alternateRowColor();
};

/**
 * The purpose of this function is to highlight particular relation table row.
 */
boxProfile.prototype.highlightRelationRow = function (count) {
	var rowId = '#relationRow_'+count;
	$('#row_'+count).siblings().removeClass('selectRow');
	$(rowId).siblings().removeClass('selectProfileRow');
	$(rowId).siblings().removeClass('selectRow');
	$(rowId).addClass('selectProfileRow');
	$(rowId).addClass('selectRow');
};

/**
 * The purpose of this function is to create relation form box profile tab.
 */
boxProfile.prototype.createRelationFromBoxProfile = function () {
	var relationName = document.getElementById("relationNamePopup").value;
	var json = null;
	var baseUrl =  getClientStore().baseURL; 
	var cellName = sessionStorage.selectedcell.toString();
	var boxName = sessionStorage.boxName;
	json = {"Name" : relationName,"_Box.Name" : boxName};
	if (objBoxProfile.validateRelationName(relationName)){
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var objRelation = new _pc.Relation(accessor, json);
		var objRelationManager = new _pc.RelationManager(accessor);
		var check = false;
		try {
			objRelationManager.retrieve(relationName, boxName);
		} catch(exception) {
			check = true;
		}
		var success = objBoxProfile.isRelationExist(check, accessor, objRelation, objRelationManager);
		if (success) {
			objCommon.displaySuccessfulMessage("Relation", relationName, "created", "#linkRelationWithBoxModal");
		}
	}
};

/**
 * The purpose of this function is to check existence of relation and box comination 
 * before creating the same.
 */
boxProfile.prototype.isRelationExist = function(check, accessor, objRelation, objRelationManager) {
	if (check === true) {
		objRelationManager.create(objRelation);
		return true;
	} else {
		$("#relationBoxpopupErrorMsg").text(getUiProps().MSG0031);
		return false;
	}
};
/**
 * The purpose of this function is to validate the Relation name.
 */
boxProfile.prototype.validateRelationName = function(relationName) {
	//The following regex finds under characters score(_),additon(+),colon(:) and hyphen(-).
	var specialCharacter = /^[-_+:]*$/;
	//The following regex finds characters in the range of 0-9,a-z(lower case),additon(+),colon(:) and A-Z(upper case).
	var letter = /^[0-9a-zA-Z-_+:]+$/;
	var lenRelationName = relationName.length;
	if ((lenRelationName < 1)) {
		$("#relationBoxpopupErrorMsg").text(getUiProps().MSG0027);
		return false;
	} else if ((lenRelationName > 128)) {
		$("#relationBoxpopupErrorMsg").text(getUiProps().MSG0028);
		return false;
	} else if (lenRelationName != 0 && !(relationName.match(letter))) {
		$("#relationBoxpopupErrorMsg").text(getUiProps().MSG0029);
		return false;
	} else if (lenRelationName != 0	&& (specialCharacter.toString().indexOf(relationName.substring(0, 1)) >= 0)) {
		$("#relationBoxpopupErrorMsg").text(getUiProps().MSG0030);
		return false;
	} else {
		return true;
	}
	return true;
};

/**
 * The purpose of this function is to open model pop up window
 * for role delete.
 * @param roleName
 */
boxProfile.prototype.openBoxProfileRelationDeleteWindow = function (relationName) {
	relationName = relationName.split(' ').join('');
	sessionStorage.BoxProfileRelationName = relationName;
	openCreateEntityModal("#boxProfileRelationDeleteModalWindow", "#boxProfileRelationDeleteDialogBox");
};


/********************************Box Profile Relation Panel End****************************************/


/********************************EDIT BOX PROFILE - START**********************************************/

/**
 * The purpose of this method is to pre populate edit box profile popup with existing data.
 */
boxProfile.prototype.populateEditBoxProfilePopUp = function(displayName,description,binaryImage,profileImage) {
	if (displayName != undefined && displayName != null && displayName != '-') {
		document.getElementById("editBPDisplayName").value = displayName;
	}
	if (description != undefined && description != null && description != '-') {
		document.getElementById("editBPDescription").value = description;
	}
	objCommon.showProfileImage(binaryImage,'#idBPImgFile','#figEditBoxProfile',profileImage, "#lblEditNoFileSelected");
};

/**
 * The purpose of this method is to perform validations on display name
 * @param displayName
 * @returns {Boolean}
 */
boxProfile.prototype.validateDisplayName = function(displayName){
	var MINLENGTH = 1;
	var MAXLENGTH = 128;
	var letters = /^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9a-zA-Z-_]+$/;
	var specialchar = /^[-_]*$/;
	var lenDisplayName = displayName.length;
	var isValidDisplayName = true;
	if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
	document.getElementById("popupEditBPDisplayNameErrorMsg").innerHTML =  getUiProps().MSG0103;
	isValidDisplayName = false;
	} else if (lenDisplayName > MAXLENGTH) {
	document.getElementById("popupEditBPDisplayNameErrorMsg").innerHTML = getUiProps().MSG0104;
	isValidDisplayName = false;
	} else if (lenDisplayName != 0 && ! (displayName.match(letters))) {
	document.getElementById("popupEditBPDisplayNameErrorMsg").innerHTML = getUiProps().MSG0105;
	isValidDisplayName = false;
	} else if(lenDisplayName != 0 && (specialchar.toString().indexOf(displayName.substring(0,1)) >= 0)) {
	document.getElementById("popupEditBPDisplayNameErrorMsg").innerHTML = getUiProps().MSG0106;
	isValidDisplayName = false;
	}
	return isValidDisplayName;
};

/**
 * The purpose of this method is to perform validations on description
 * @param description
 * @returns {Boolean}
 */
boxProfile.prototype.validateDescription = function (description,errorMessageBlock) {
	var isValidDescription = true;
	var MAXLENGTH = 51200;
	var lenDescription = description.length;
	if (lenDescription > MAXLENGTH) {
	isValidDescription = false;
		document.getElementById(errorMessageBlock).innerHTML = getUiProps().MSG0138;
	}
	return isValidDescription;
};

/**
* The purpose of this method is to perform attach file operation
*/
/*boxProfile.prototype.attachFile = function () { 
	var file = document.getElementById('idBPImgFile').files[0];
	var fileName = document.getElementById("idBPImgFile").value;
	if(file) {
		var imageFileSize = file.size/1024;
		if (objBoxProfile.validateFileType(fileName,imageFileSize)) {	
			objBoxProfile.getAsBinaryString(file);
		}
	}
};*/

/**
* The purpose of this method is to get file content as text
* @param readFile
*/
/*boxProfile.prototype.getAsBinaryString = function(readFile) {
	try {
		var reader = new FileReader();
	} catch (e) {
		return;
	}
	reader.readAsDataURL(readFile, "UTF-8");
	reader.onload = objBoxProfile.loaded;
	reader.onerror = objBoxProfile.errorHandler;
};*/

/**
* The purpose of this method is to read file data
* @param evt
*/
/*boxProfile.prototype.loaded = function(evt) {
	objBoxProfile.imgBinaryFile = null;
	objBoxProfile.imgBinaryFile = evt.target.result;
};*/

/**
* The purpose of this method is to perform error handling for file read. 
* @param evt
*/
/*boxProfile.prototype.errorHandler = function(evt) {
	if (evt.target.error.code == evt.target.error.NOT_READABLE_ERR) {
	//uCellProfile.spinner.stop();
	alert("Error reading file...");
}
};*/

/**
* This method ensures that only image file is added.
* @param filePath
* @returns {Boolean}
*/
/*boxProfile.prototype.validateFileType = function(filePath, imageSize) {
	var fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
		.toLowerCase();
	if (fileExtension.toLowerCase() == "jpg"
		|| fileExtension.toLowerCase() == "png"
		|| fileExtension.toLowerCase() == "bmp"
		|| fileExtension.toLowerCase() == "jpeg"
		|| fileExtension.toLowerCase() == "tiff"
		|| fileExtension.toLowerCase() == "gif") {
	
	if (imageSize > getUiProps().MSG0117) { //1000KB
		document.getElementById("popupEditBoxProfilePhotoErrorMsg").innerHTML = "";
		document.getElementById("popupEditBoxProfilePhotoErrorMsg").innerHTML = getUiProps().MSG0199;
		isBoxProfileFileValid = false;
		return isBoxProfileFileValid;
	} else {
		document.getElementById("popupEditBoxProfilePhotoErrorMsg").innerHTML = "";
		isBoxProfileFileValid = true;
		return isBoxProfileFileValid;
	}
	} else {
	document.getElementById("popupEditBoxProfilePhotoErrorMsg").innerHTML = "";
	document.getElementById("popupEditBoxProfilePhotoErrorMsg").innerHTML = getUiProps().MSG0116;
	isBoxProfileFileValid = false;
	return isBoxProfileFileValid;
	}
};*/

/**
 * The purpose of this method is to reset file input box during editing box profile
 */
/*boxProfile.prototype.resetFileInput = function() { 
	var input = $('#idBPImgFile');
	var clone = input.clone(); // We create a clone of the original element
	input.replaceWith(clone); // And substitute the original with the clone
	$('#idBPImgFile').replaceWith($('#idBPImgFile').clone());
	document.getElementById("popupEditBoxProfilePhotoErrorMsg").innerHTML = "";
};*/

/**
 * The purpose of this method is to perform edit operation on box profile
 * @param json
 * @returns
 */
boxProfile.prototype.editBoxProfile = function(json){
	var baseUrl = getClientStore().baseURL;
	var response = null;
	if (!baseUrl.endsWith("/")) {
	baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;

	if (boxName == getUiProps().MSG0039) {
		boxName = getUiProps().MSG0293;
	}
	var path = baseUrl + cellName + "/" + boxName + "/";
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objJDavCollection = new _pc.DavCollection(accessor, path);
	response = objJDavCollection.put(objBoxProfile.profileFileName, "application/json", JSON.stringify(json), "*");
	return response;
	};
	
/**
 * The purpose of this method is to fetch box profile data
 * @param profileFileName
 * @returns
 */
boxProfile.prototype.retrieveCollectionAPIResponse = function(profileFileName){
	var baseUrl = getClientStore().baseURL;
	var response = null;
	if (!baseUrl.endsWith("/")) {
	baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	if (boxName == getUiProps().MSG0039) {
		boxName = getUiProps().MSG0293;
	}
	var path = baseUrl+cellName+"/" + boxName + "/";
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objJDavCollection = new _pc.DavCollection(accessor, path);
	response = objJDavCollection.getJSON(profileFileName);
	return response;
};

/**
* The purpose of the following method is to convert binary data into a image.
* @param binaryFormatImage
*/
/*boxProfile.prototype.convertBinaryDataToImage = function (binaryFormatImage) { 
	document.getElementById('ProfilePhoto').innerHTML = "";
	var img = document.createElement('img');
	img.id="imgUserPhoto";
	img.src = binaryFormatImage;
	img.width="71";
	img.height="67";
	$("#ProfilePhoto").removeClass('imgBorder');
	document.getElementById('ProfilePhoto').appendChild(img);
	};*/
	
/**
 * The purpose of this method is to create more/less link functionality
 */
/*boxProfile.prototype.clickMoreLink = function(){
	if($("#expandCollapse").text() == "more"){
		//$("#bpDescription").removeClass("expandDesc");
		$("#bpDescription").removeClass("descWithMoreLink");
		$("#bpDescription").addClass("expanded");
		$("#expandCollapse").text("less");
	}else if($("#expandCollapse").text() == "less"){
		$("#bpDescription").removeClass("expanded");
		$("#bpDescription").addClass("descWithMoreLink");
		$("#bpDescription").scrollTop(0);
		$("#expandCollapse").text("more");
	}
};*/

/**
 * This method checks the length of description and shows more link accordingly
 */
boxProfile.prototype.checkDesciptionLength = function(){
	var descLength = $("#bpDescription").text().length;
	var allowedLength = 600;
	if (descLength > allowedLength){
		document.getElementById("expandCollapse").style.display = "block";
		/*$("#bpDescription").removeClass("expandDesc");
		$("#bpDescription").addClass("descWithMoreLink");*/
	}else{
		document.getElementById("expandCollapse").style.display = "none";
	}
};

/**
 * The purpose of this method is to fetch profile details from response
 * @param response
 */
boxProfile.prototype.retrieveProfileInfoFromResponse = function (response) {
	response = response.bodyAsJson();
	var resDisplayName = objCommon.replaceNullValues(response.DisplayName,getUiProps().MSG0275);
	var resDescription = objCommon.replaceNullValues(response.Description,getUiProps().MSG0275);
	objBoxProfile.imgBinaryFile = response.Image;
	$("#dvdisplayName").text(resDisplayName);
	$("#dvdisplayDesc").text(resDescription);
	objCommon.showProfileImage(objBoxProfile.imgBinaryFile,'#imgBoxViewProfile','#figboxProfileImage');
};

/**
 * The purpose of this method is to display profile details
 */
boxProfile.prototype.displayProfileDetails = function () {
	var target = document.getElementById('spinner');
	var spinner = new Spinner(objCommon.opts).spin(target);
	var response = objBoxProfile.retrieveCollectionAPIResponse(objBoxProfile.profileFileName);
	var statusCode = objCommon.getStatusCode(response);
	if(statusCode == SUCCESSSTATUSCODE) {
		objBoxProfile.retrieveProfileInfoFromResponse(response);
	}
	spinner.stop();
};

/**
 * Following method shows box profile information.
 */
boxProfile.prototype.showBoxProfileInformation = function() {
	var response = objBoxProfile
			.retrieveCollectionAPIResponse(objBoxProfile.profileFileName);
	var statusCode = objCommon.getStatusCode(response);
	if (statusCode == SUCCESSSTATUSCODE) {
		objBoxProfile.retrieveProfileInfoFromResponse(response);
	}
	response = response.bodyAsJson();
	var displayName = objCommon.replaceNullValues(response.DisplayName,getUiProps().MSG0275);
	var description = objCommon.replaceNullValues(response.Description,getUiProps().MSG0275);
	imgBinaryFile = response.Image;
	var profileImage = response.ProfileImageName;
	this.populateEditBoxProfilePopUp(displayName,description,imgBinaryFile,profileImage);
};

/**
 * Following method closes edit box window.
 * @param modelId
 */
boxProfile.prototype.closeEditBoxProfilePopUp = function(modelId){
	$(modelId).hide();
	uCellProfile.clearErrorMessages("#figEditBoxProfile","#lblEditNoFileSelected","#editBPDisplayName","#idBPImgFile");
};

/**
 * The purpose of this method is to perform operation after profile updation
 */
boxProfile.prototype.performSuccessOperationsAfterProfileUpdate = function(){
	uBoxDetail.loadBoxProfileTab();
	this.closeEditBoxProfilePopUp('#editBoxProfileModalWindow');
};

/**
 * The purpose of this method is to update box profile.
 */
boxProfile.prototype.clickEditBoxProfile = function(){
	//showDynamicSpinner("modalSpinnerBoxProfile",720,300);
	var displayName = document.getElementById("editBPDisplayName").value;
	var description = document.getElementById("editBPDescription").value;
	var fileData = null;
	// The file to be uploaded in binary format.
	var profileBoxImageName = $('#lblEditNoFileSelected').text();
	var validDisplayName = validateDisplayName(displayName, "popupEditBPDisplayNameErrorMsg",'#editBPDisplayName');
	if(validDisplayName){
		$('#popupEditBPDisplayNameErrorMsg').html('');
		var validDesciption = objBoxProfile.validateDescription(description,"popupEditBPDescriptionErrorMsg");
		if (validDesciption){
			fileData = {
					"DisplayName" : displayName,
					"Description" : description,
					"Image" : imgBinaryFile,
					"ProfileImageName" : profileBoxImageName
				};
				var response = objBoxProfile.editBoxProfile(fileData);
				var statusCode = objCommon.getStatusCode(response);
				if (statusCode === 201 || statusCode === 204) {
					objBoxProfile.performSuccessOperationsAfterProfileUpdate();
				}
		}
	}
	removeSpinner("modalSpinnerBoxProfile");
};

/***********************************EDIT BOX PROFILE - END*******************************************/

/***********************************CREATE BOX PROFILE - START*******************************************/

/**
 * The purpose of this method is to toggle profile mode scenario
 * in box create popup on check of profile check box.
 */
boxProfile.prototype.toggleProfileMode = function () {
	//var winH = $(window).height();
	if ($('#chkCreateProfileBox').is(':checked')) {
		//$('#createBoxDialog').css('top', winH / 2 - 444/ 2);
		$('#trBoxDisplayName').removeClass('displayNone');
		$('#trBoxDescription').removeClass('displayNone');
		$('#trBoxImage').removeClass('displayNone');
		$('#trBarFileInstallation').addClass('displayNone');
		
	} else {
		//$('#createBoxDialog').css('top', winH / 2 - $('#createBoxDialog').height() / 2);
		$('#trBoxDisplayName').addClass('displayNone');
		$('#trBoxDescription').addClass('displayNone');
		$('#trBoxImage').addClass('displayNone');
		$('#trBarFileInstallation').addClass('displayNone');
		$('#trBoxDisplayName').find('input:text').val('');
		$('.popupContent').find('textarea').val('');
		$('.popupAlertmsg').html('');
		uCellProfile.resetFileInput('#idBPImgFile', 'popupBoxImageErrorMsg');
	}
};

/**
 * The purpose of this method is to implement upload profile.json
 * functionality for box.
 */
boxProfile.prototype.createBoxProfile = function (boxName, fileData) {
	var baseUrl = getClientStore().baseURL;
	var response = null;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var path = baseUrl+cellName+"/"+boxName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objJDavCollection = new _pc.DavCollection(accessor, path);
	response = objJDavCollection.put(objBoxProfile.profileFileName, "application/json", JSON.stringify(fileData), "*");
	return response;
};

/***********************************CREATE BOX PROFILE - END*******************************************/
/**
 * The purpose of this function is to load the elements and values when the page is loaded for the first time.
 */
boxProfile.prototype.loadBoxProfilePage = function () {
	/*$("#btnEditBoxProfile").click(function(){
		objBoxProfile.clickEditBoxProfile();
	});*/
	
	if(sessionStorage.tabName == "Box"){
		objBoxProfile.displayProfileDetails();
		objBoxProfile.boxProfileRoleTable();
		objBoxProfile.boxProfileRelationTable();
	}	
	$("#boxProfileRoleDeleteId").click(function() {
		objBoxProfile.deleteBoxProfileRole();
	});
	$("#boxProfileRelationDeleteId").click(function() {
		objBoxProfile.deleteBoxProfileRelation();
	});
	$("#btnLinkRoleToBox").click(function() {
		objBoxProfile.createRoleFromBoxProfile();
	});
	$("#btnLinkRelationToBox").click(function() {
		objBoxProfile.createRelationFromBoxProfile();
	});
};

/**
 * Following method validates display name on the blur event.
 */
boxProfile.prototype.displayNameBlurEvent = function () {
	var displayName = document.getElementById("editBPDisplayName").value;
	var displayNameSpan = "popupEditBPDisplayNameErrorMsg";
	var txtDisplayName = "#editBPDisplayName";
	validateDisplayName(displayName, displayNameSpan,txtDisplayName);
};

/**
 * Following method validates description name on the blur event.
 */
boxProfile.prototype.descriptionBlurEvent = function () {
	document.getElementById("popupEditBPDescriptionErrorMsg").innerHTML = "";
	var descriptionDetails = document.getElementById("editBPDescription").value;
	var descriptionSpan =  "popupEditBPDescriptionErrorMsg";
	validateDescription(descriptionDetails,descriptionSpan);
};

function divOnFocusBrowseOnBoxProfile() {
	$(".browseEditBoxProfile").css("outline","-webkit-focus-ring-color auto 5px");
}

function divOnBlurBrowseOnBoxProfile() {
	$(".browseEditBoxProfile").css("outline","none");
}
$(document).ready(function() {
	$.ajaxSetup({ cache : false });
	objBoxProfile.loadBoxProfilePage();
	var strSubHeading = "Internal Roles and Relations for "+sessionStorage.boxName;
	$('#lblBoxProfileSubHeading').html(strSubHeading);
	if (strSubHeading.length > 135) {
	$('#lblBoxProfileSubHeading').attr('title',strSubHeading);
	}
	//overflow: hidden;text-overflow: ellipsis;white-space: nowrap
	/*if(sessionStorage.tabName == "Box"){
		var boxNameDiv = document.getElementById("boxNameDiv");
		var boxName = sessionStorage.boxName;
		var displayProfileBoxName = objCommon.getShorterEntityName(boxName);
		boxNameDiv.innerHTML= displayProfileBoxName;
		boxNameDiv.title = boxName;
		objBoxProfile.boxProfileRoleTable();
		objBoxProfile.boxProfileRelationTable();
	}	
	$("#boxProfileRoleDeleteId").click(function() {
		objBoxProfile.deleteBoxProfileRole();
	});
	$("#boxProfileRelationDeleteId").click(function() {
		objBoxProfile.deleteBoxProfileRelation();
	});
	$("#btnLinkRoleToBox").click(function() {
		objBoxProfile.createRoleFromBoxProfile();
	});
	$("#btnLinkRelationToBox").click(function() {
		objBoxProfile.createRelationFromBoxProfile();
	});*/
});