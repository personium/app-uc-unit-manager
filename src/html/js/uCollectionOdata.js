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
function uCollectionOdata() {
}
var objCollectionOdata = new uCollectionOdata();
$(document).ready(function() {
	$.ajaxSetup({
		cache : false
	});
});

/********************* CREATE Folder : START *********************/
/**
 * The purpose of this function is to create Folder.
 */
uCollectionOdata.prototype.createFolder = function() {
	var baseUrl = getClientStore().baseURL;
	var folderSuccessMessage = getUiProps().MSG0243;
	var response = null;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var folderName = $("#txtFolderName").val();
	if (objCollectionOdata.validateFolderName(folderName)) {
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var objJDavCollection = new _pc.DavCollection(accessor,
				objOdata.currentCollectionPath);
		try {
			response = objJDavCollection.mkCol(folderName);
			if (response.httpClient.status == 201)
				objCollectionOdata.displayNotificationMessageForCollection(
						folderSuccessMessage, '#createFolderModal',
						'#txtFolderName');
		} catch (exception) {
			if (exception.code == getUiProps().MSG0249
					|| exception.code == getUiProps().MSG0250) {
				document.getElementById("popupFolderErrorMsg").innerHTML = getUiProps().MSG0066;
				objCommon.showErrorIcon('#txtFolderName');
			}
		}
	}
};

/**
 * The purpose of this function is to validate the folder name.
 * 
 * @param odataName
 */
uCollectionOdata.prototype.validateFolderName = function(folderName) {
	//var letters = /^[0-9a-zA-Z-_.]+$/;
	var letters = new RegExp("^[^" + objCommon.getValidateBlackList() + "]+$");
	var lenFolderName = folderName.length;
	if (lenFolderName < 1 || folderName == undefined || folderName == null
			|| folderName == "") {
		document.getElementById("popupFolderErrorMsg").innerHTML = getUiProps().MSG0063;
		objCommon.showErrorIcon('#txtFolderName');
		return false;
	} else if (lenFolderName > 256) {
		document.getElementById("popupFolderErrorMsg").innerHTML = getUiProps().MSG0064;
		objCommon.showErrorIcon('#txtFolderName');
		return false;
	} else if (lenFolderName != 0 && !(folderName.match(letters))) {
		document.getElementById("popupFolderErrorMsg").innerHTML = getUiProps().MSG0429;
		objCommon.showErrorIcon('#txtFolderName');
		return false;
	}
	objCommon.showValidValueIcon('#txtFolderName');
	return true;
};

/**
 * The purpose of the following method is to invoke click event of button -
 * btnCreateFolder to create Folder after pressing ENTER key.
 */
uCollectionOdata.prototype.createFolderOnEnterKeyPress = function() {
	var event = window.event;
	var keycode = (event.keyCode ? event.keyCode : event.which);
	//ENTER KEY
	if (keycode == '13') {
		$("#btnCreateFolder").click();
	}
};
/********************* CREATE Folder : END *********************/
/********************* CREATE O-DATA : START *********************/

/**
 * The purpose of this function is to create O-Data collection.
 */
uCollectionOdata.prototype.createOdataCollection = function() {
	var baseUrl = getClientStore().baseURL;
	var oDataSuccessMessage = getUiProps().MSG0251;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var odataName = document.getElementById("txtOdataName").value;
	if (objCollectionOdata.validateOdataName(odataName)) {
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var objJDavCollection = new _pc.DavCollection(accessor,
				objOdata.currentCollectionPath);
		try {
			response = objJDavCollection.mkOData(odataName);
			if (response.httpClient.status == 201)
				objCollectionOdata.displayNotificationMessageForCollection(
						oDataSuccessMessage, "#createODataModal",
						"#txtOdataName");
		} catch (exception) {
			if (exception.code == getUiProps().MSG0249
					|| exception.code == getUiProps().MSG0250) {
				document.getElementById("popupOdataErrorMsg").innerHTML = getUiProps().MSG0059;
				objCommon.showErrorIcon('#txtOdataName');
			}
		}
	}
};

/**
 * The purpose of this function is to validate the O-Data name.
 * 
 * @param odataName
 */
uCollectionOdata.prototype.validateOdataName = function(odataName) {
	var minLengthMessage = getUiProps().MSG0045;
	var maxLengthMessage = getUiProps().MSG0046;
	var specialCharacterMessage = getUiProps().MSG0429;
	var letters = new RegExp("^[^" + objCommon.getValidateBlackList() + "]+$");
	var lenOdataName = odataName.length;
	if (lenOdataName < 1 || odataName == undefined || odataName == null
			|| odataName == "") {
		document.getElementById("popupOdataErrorMsg").innerHTML = minLengthMessage;
		objCommon.showErrorIcon('#txtOdataName');
		return false;
	} else if (lenOdataName > 256) {
		document.getElementById("popupOdataErrorMsg").innerHTML = maxLengthMessage;
		objCommon.showErrorIcon('#txtOdataName');
		return false;
	} else if (lenOdataName != 0 && !(odataName.match(letters))) {
		document.getElementById("popupOdataErrorMsg").innerHTML = specialCharacterMessage;
		objCommon.showErrorIcon('#txtOdataName');
		return false;
	}
	objCommon.showValidValueIcon('#txtOdataName');
	return true;
};

/**
 * The purpose of the following method is to invoke click event of button -
 *  btnCreateOdata to create Odata after pressing ENTER key.
 */
uCollectionOdata.prototype.createOdataOnEnterKeyPress = function() {
	var event = window.event;
	var keycode = (event.keyCode ? event.keyCode : event.which);
	//ENTER KEY
	if (keycode == '13') {
		$("#btnCreateOdata").click();
	}
};

/********************* CREATE O-DATA : END *********************/

/********************* CREATE Plugin : START *********************/
/**
 * The purpose of this function is to create Engine Service.
 */
uCollectionOdata.prototype.createEngineService = function () {
	var baseUrl = getClientStore().baseURL;
	var successMessage = getUiProps().MSG0252;
	var response = null;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var engineServiceName = $("#txtEngineServiceName").val();
	if (objCollectionOdata.validateEngineServiceName(engineServiceName)) {
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var objJDavCollection = new _pc.DavCollection(accessor,objOdata.currentCollectionPath);
		try {
			response =  objJDavCollection.mkService(engineServiceName);
			if (response.httpClient.status == 201)
				objCollectionOdata.displayNotificationMessageForCollection(successMessage,'#createEngineServiceModal','#txtEngineServiceName');
		} catch (exception) {
			if (exception.code == getUiProps().MSG0249 || exception.code ==  getUiProps().MSG0250) {
				document.getElementById("popupEngineServiceErrorMsg").innerHTML =  getUiProps().MSG0253;
				objCommon.showErrorIcon('#txtEngineServiceName');
			}
		}
	}
};

/**
 * The purpose of this function is to validate the folder name.
 * 
 * @param odataName
 */
uCollectionOdata.prototype.validateEngineServiceName = function(engineServiceName) {
    var MAXLENGTH = 256;
    var letters = new RegExp("^[^" + objCommon.getValidateBlackList() + "]+$");
    var lenEngineServiceName = engineServiceName.length;
    if (lenEngineServiceName < 1 || engineServiceName == undefined || engineServiceName == null
            || engineServiceName == "") {
        document.getElementById("popupEngineServiceErrorMsg").innerHTML = getUiProps().MSG0135;
        objCommon.showErrorIcon('#txtEngineServiceName');
        return false;
    } else if (lenEngineServiceName > MAXLENGTH) {
        document.getElementById("popupEngineServiceErrorMsg").innerHTML = getUiProps().MSG0136;
        objCommon.showErrorIcon('#txtEngineServiceName');
        return false;
    } else if (lenEngineServiceName != 0 && !(engineServiceName.match(letters))) {
        document.getElementById("popupEngineServiceErrorMsg").innerHTML = getUiProps().MSG0429;
        objCommon.showErrorIcon('#txtEngineServiceName');
        return false;
    } 
    objCommon.showValidValueIcon('#txtEngineServiceName');
    return true;
};
/**
 * The purpose of the following method is to invoke click event of button -
 * btnCreateEngineService to create Engine Service after pressing ENTER key.
 * 
 */
uCollectionOdata.prototype.createEngineServiceOnEnterKeyPress = function() {
    var event = window.event;
    var keycode = (event.keyCode ? event.keyCode : event.which);
    //ENTER KEY
    if (keycode == '13') {
        $("#btnCreateEngineService").click();
    }
};
/********************* CREATE Plugin : END *********************/

/**
 * The purpose of this function is to display success message notification
 */
uCollectionOdata.prototype.displayErrorMessage = function(message,width) {
	document.getElementById('collectionErrorMsg').innerHTML = message;
	document.getElementById('collectionMessageSuccessBlock').style.display = "none";
	document.getElementById('collectionMessageErrorBlock').style.display = "table";
	var timeOut = getUiProps().MSG0037;
	objCommon.centerAlignRibbonMessage("#collectionMessageErrorBlock");
	objCommon.autoHideAssignRibbonMessage("collectionMessageErrorBlock");
	//window.setTimeout("$('#collectionMessageErrorBlock').hide()", timeOut);
	if (width!=undefined || width!= null){
		$("#collectionMessageErrorBlock").css("width", width);
	}
};
/**
 * The purpose of this function is to display success message notification
 */
uCollectionOdata.prototype.displaySuccessMessage = function(message,width) {
	document.getElementById('collectionSuccessMsg').innerHTML = message;
	document.getElementById('collectionMessageErrorBlock').style.display = "none";
	document.getElementById('collectionMessageSuccessBlock').style.display = "table";
	var timeOut = getUiProps().MSG0037;
	objCommon.centerAlignRibbonMessage("#collectionMessageSuccessBlock");
	objCommon.autoHideAssignRibbonMessage("collectionMessageSuccessBlock");
	//window.setTimeout("$('#collectionMessageSuccessBlock').hide()", timeOut);
	if (width!=undefined || width!= null){
		$("#collectionMessageSuccessBlock").css("width", width);
	}
};
/**
 * The purpose of this function is to display ribbon message after success of create folder.
 */
uCollectionOdata.prototype.displayNotificationMessageForCollection = function(
		message, idModalWindow, txtID) {
	closeEntityModal(idModalWindow);
	objOdata.createTable(objOdata.currentCollectionPath);
	var folderName = $("#currentDirectoryName").text();
	uBoxDetail.populatePropertiesList(objOdata.currentCollectionPath, objOdata.currentCollectionPath, folderName, false, "folder");
	uBoxAcl.getAclSetting(objOdata.currentCollectionPath, sessionStorage.boxName);
	$("#webDavDetailBody").show();
	$("#webDavDetailMessageBody").hide();
	objCollectionOdata.displaySuccessMessage(message,0);
	objCommon.removeStatusIcons(txtID);
};
/**
 * Following method closes pop up. 
 * @param modelId Modal window ID
 * @param txtID Folder input box
 */
uCollectionOdata.prototype.closePopUp = function(modalId, txtID) {
	objCommon.removeStatusIcons(txtID);
	$(modalId).hide(0);
};

/**
 * The purpose of this function is to validate create folder on blur event.
 */

uCollectionOdata.prototype.validateFolderNameOnBlur = function() {
	var folderName = $("#txtFolderName").val();
	objCollectionOdata.validateFolderName(folderName);
};

/**
 * The purpose of this function is to validate create Odata on blur event.
 */
uCollectionOdata.prototype.validateOdataNameOnBlur = function() {
	var odataName = document.getElementById("txtOdataName").value;
	objCollectionOdata.validateOdataName(odataName);
};

/**
 * The purpose of this function is to validate create service on blur event.
 */
uCollectionOdata.prototype.validateEngineServiceNameOnBlur = function() {
	var engineServiceName = $("#txtEngineServiceName").val();
	objCollectionOdata.validateEngineServiceName(engineServiceName);
};