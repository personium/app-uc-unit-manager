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
function uBox(){}

var objBox = new uBox();

//Global variable
var maxRows = 10;
var MAX_ROWS= 50;
var totalRecordsize;
var boxName = sessionStorage.boxName;
var sbSuccessful = '';
var sbConflict = '';
var selectedBoxes = '';
var totalNoOfBoxes = 0;
var arrDeletedConflictCount = [];
var etagValue  = '';
var objboxMgr = null;
var isDeleted = false;

/**
 * Following method retrives data for a particular range.
 * @param lowerLimit lower limit.
 * @param upperLimit upper limit.
 * @returns json.
 */
uBox.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objboxMgr = createBoxManager();
	var uri = objboxMgr.getUrl();
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to retrieve total box
 * record count.
 * 
 * @param pobjboxMgr
 * @returns
 */
uBox.prototype.retrieveRecordCount = function(pobjboxMgr) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var uri = pobjboxMgr.getUrl();
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * The purpose of this function is to call the createTable function
 * for displaying box list
 */
$(document).ready(function() {
	$.ajaxSetup({ cache : false });
	objCommon.creatEntityHoverEffect();
	objCommon.sortByDateHoverEffect();
	if (sessionStorage.tabName == "Box") {
		createBoxTable();
	}
	objCommon.checkCellContainerVisibility();
	showDefaultCursor("#btnBrowse");
	/*//Click Install Box radio button.
	$("#rdInstallBox").click(function() {
		$("#trSchemaURL").addClass('displayNone');
		$("#trSchemaURLMessage").addClass('displayNone');
		$("#trBoxDisplayName").addClass('displayNone');
		$("#trBoxProfile").addClass('displayNone');
		$('#trBoxDisplayName').addClass('displayNone');
		$('#trBoxDescription').addClass('displayNone');
		$('#trBoxImage').addClass('displayNone');
		$('#trBarFileInstallation').removeClass('displayNone');
	});
	// Click Create Box radio button.
	$("#rdCreateBox").click(function() {
		$('#trSchemaURL').removeClass('displayNone');
		$('#trSchemaURLMessage').removeClass('displayNone');
		$('#trBoxProfile').removeClass('displayNone');
		$('#trBarFileInstallation').addClass('displayNone');
		if ($('#chkCreateProfileBox').is(':checked')) {
			objBoxProfile.toggleProfileMode();
		}
	});*/
	setDynamicGridHeight();
	$('#sectionRHSMainElements :input').attr('disabled', true);
	showBoxMenuOptions();
});

/**
 * The purpose of this function is to maintain the slight color 
 * differences in alternate rows.
 */
$(function() {
	if(sessionStorage.tabName == "Box"){
		$(".selectProfileRow").css("background-color", "#dfdfdf");
	}
});

/**
 * The purpose of this function is to close modal popup.
 */
function closePopup() {
	$('#modalbox').hide();
	$('#modalbox-flyout').hide();
	$('#modalbox-close').hide();
	$('#modalbox-close12').hide();
	return false;
};

/**
 * The purpose of this function is to close the box modal popup.
 */
function closeCreateBox() {
	fileName = null;
	$('#rdCreateBox').click();
	uCellProfile.resetFileInput('#idBarFileInstallation', 'popupBarFileInstallationMsg');
	$('.popupContent').find('input:text').val('');
	$('.popupContent').find('textarea').val('');
	$('.popupAlertmsg').html('');
	$('#chkCreateProfileBox').attr('checked', false);
	$('#trBoxDisplayName').addClass('displayNone');
	$('#trBoxDescription').addClass('displayNone');
	$('#trBoxImage').addClass('displayNone');
	$('#createBoxModal, .window').hide(0);
	
}

/**
 * The purpose of this function is to check all the check boxes.
 * 
 * @param cBox
 */
function checkAll(cBox) {
	var buttonId = '#btnDeleteBox';
	objCommon.checkBoxSelect(cBox, buttonId,'#btnEditBox');
	objCommon.showSelectedRow(document.getElementById("chkSelectall"),"row","rowid");
	$('#chkCreateProfileBox').attr('checked', false);
	$("#btnEditBoxIcon").removeClass();
	$("#btnEditBoxIcon").addClass('editIconDisabled');
	$("#btnEditBoxIcon").attr("disabled", true);
	var noOfRecords = $("#mainBoxTable > tbody > tr").length;
	if ($("#chkSelectall").is(':checked')) {
		if (noOfRecords == 2) {
			$("#btnEditBoxIcon").removeClass();
			$("#btnEditBoxIcon").addClass('editIconEnabled');
			$('#btnEditBoxIcon').removeAttr("disabled");
		}
	}
}

/**
 * The purpose of this function is to check validations and ensures that the 
 * correct values are entered in box name and schema URL. 
 * 
 * @param boxName
 * @param schemaURL
 * @param boxSpan
 * @param schemaSpan
 */
function validate(boxName,schemaURL,boxSpan,schemaSpan, displayName, descriptionDetails,txtSchemaURLID) {
	if(validateBoxName(boxName,boxSpan)) {
		document.getElementById(boxSpan).innerHTML = "";
		if(objBox.validateSchemaURL(schemaURL, schemaSpan,txtSchemaURLID)) {
			document.getElementById(schemaSpan).innerHTML = "";
			if ($('#chkCreateProfileBox').is(':checked')) {
					//uCellProfile.spinner = showSpinnerForUploadFile();
						if (validateBoxProfile(displayName, descriptionDetails,"boxDisplayNameErrorMsg", "boxDescriptionErrorMsg")) {
							//uCellProfile.spinner.stop();
							return true;
						}
						//uCellProfile.spinner.stop();
			} else {
				return true;
			}
		}
	}
	return false;
}

/**
 * The purpose of this function is to validate the schema URL.
 * 
 * @param schemaURL
 * @param schemaSpan
 */
uBox.prototype.validateSchemaURL= function(schemaURL, schemaSpan, txtID) {
	var isHttp = schemaURL.substring(0, 5);
	var isHttps = schemaURL.substring(0, 6);
	var minURLLength = schemaURL.length;
	var validMessage = getUiProps().MSG0014;
	var letters = /^[0-9a-zA-Z-_.\/]+$/;
	var startHyphenUnderscore = /^[-_!@#$%^&*()=+]/;
	var urlLength = schemaURL.length;
	var schemaSplit = schemaURL.split("/");
	var isDot = -1;
	if(schemaURL.split("/").length > 2) {
		if (schemaSplit[2].length>0) {
			isDot = schemaSplit[2].indexOf(".");
		}
	}
	var domainName = schemaURL.substring(8, urlLength);
	if (schemaURL == "" || schemaURL == null || schemaURL == undefined) {
		removeStatusIcons(txtID);
		return true;
	} else if ((isHttp != "http:" && isHttps != "https:")
			|| (minURLLength <= 8)) {
		document.getElementById(schemaSpan).innerHTML = validMessage;
		showErrorIcon(txtID);
		return false;
	} else if (urlLength > 1024) {
		document.getElementById(schemaSpan).innerHTML = getUiProps().MSG0057;
		showErrorIcon(txtID);
		return false;
	} else if (domainName.match(startHyphenUnderscore)) {
		document.getElementById(schemaSpan).innerHTML = getUiProps().MSG0301;
		showErrorIcon(txtID);
		return false;
	} else if (!(domainName.match(letters))) {
		document.getElementById(schemaSpan).innerHTML = getUiProps().MSG0300;
		showErrorIcon(txtID);
		return false;
	} else if (isDot == -1) {
		document.getElementById(schemaSpan).innerHTML = validMessage;
		showErrorIcon(txtID);
		return false;
	} else if ((domainName.indexOf(".."))>-1 || (domainName.indexOf("//"))>-1) {
		document.getElementById(schemaSpan).innerHTML = validMessage;
		showErrorIcon(txtID);
		return false;
	}
	showValidValueIcon(txtID);
	document.getElementById(schemaSpan).innerHTML = "";
	return true;
};

/**
 * The purpose of this function is to validate the box name.
 * 
 * @param boxName
 * @param boxSpan
 */
function validateBoxName(boxName,boxSpan) {
	var minLengthMessage = getUiProps().MSG0008;
	var maxLengthMessage = getUiProps().MSG0009;
	var specialCharacterMessage = getUiProps().MSG0011;
	var alphaNumericMessage = getUiProps().MSG0023;
	//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(upper case).
	var letters = /^[0-9a-zA-Z-_]+$/;
	//The following regex finds under score(_) and hyphen(-).
	var specialchar = /^[-_]*$/;
	var lenBoxName = boxName.length;
	if(lenBoxName < 1 || boxName == undefined || boxName == null || boxName == "") {
		document.getElementById(boxSpan).innerHTML = minLengthMessage;
		showErrorIcon('#txtBoxName');
		return false;
	} else if (lenBoxName > 128) {
		document.getElementById(boxSpan).innerHTML = maxLengthMessage;
		showErrorIcon('#txtBoxName');
		return false;
	} else if (lenBoxName != 0 && ! (boxName.match(letters))){
		document.getElementById(boxSpan).innerHTML = alphaNumericMessage;
		showErrorIcon('#txtBoxName');
		return false;
	} else if(lenBoxName != 0 && (specialchar.toString().indexOf(boxName.substring(0,1)) >= 0)){
		document.getElementById(boxSpan).innerHTML = specialCharacterMessage;
		showErrorIcon('#txtBoxName');
		return false;
	}
	showValidValueIcon('#txtBoxName');
	document.getElementById(boxSpan).innerHTML = "";
	return true;
}

/**
 * The purpose of this function is to check whether an entity already exists or not.
 * If it's an unique name,it creates a box.
 * 
 * @param check
 * @param accessor
 * @param objJBox
 * @param objJBoxManager
 */
function isBoxExist(check, accessor, objJBox, objJBoxManager, fileData) {
	var existSchemaMessage = getUiProps().MSG0026;
	if (check === true) {
		try {
			objJBoxManager.create(objJBox);
			showValidValueIcon('#txtBoxName');
			return true;
		} catch (exception) {
			$('.popupAlertmsg').html('');
			popupSchemaErrorMsg.innerHTML = existSchemaMessage;
			showErrorIcon("#txtSchemaURL");
			return false;
		}
	}
}

/**
 * The purpose of this function is to create box.
 */
function createNewBox() {
	var objBoxProfile = new boxProfile();
	showSpinner("modalSpinnerBox");
	document.getElementById("popupBoxErrorMsg").innerHTML = "";
	var boxName = document.getElementById("txtBoxName").value;
	var cellName = sessionStorage.selectedcell;
	var schemaURL = document.getElementById("txtSchemaURL").value;
	var displayName = $("#txtDisplayNameBox").val();
	var descriptionDetails = document.getElementById("txtDescriptionBox").value;		
	var baseUrl = getClientStore().baseURL;
	var fileData = null;
	var check;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, schemaURL, boxName);
	accessor.setCurrentCell(new _pc.Cell(accessor, cellName));
	var objJBox = new _pc.Box(accessor);
	var objJBoxManager = new _pc.BoxManager(accessor);
	try {
		objJBoxManager.retrieve(boxName);
		check = false;
	} catch (exception) {
		check = true;
	}
	if (check == false) {
		if (boxName.length > 0) {
			var existBoxMessage = getUiProps().MSG0012;
			showErrorIcon('#txtBoxName');
			removeSpinner("modalSpinnerBox");
			popupBoxErrorMsg.innerHTML = existBoxMessage;
			return false;
		}
	}
	 var profileImageName = $('#lblNoFileSelected').text();
	if (validate(boxName, schemaURL,"popupBoxErrorMsg","popupSchemaErrorMsg", displayName, descriptionDetails,"#txtSchemaURL")) {
		var success = isBoxExist(check, accessor, objJBox, objJBoxManager, fileData);
		if (success) {
			if (($('#chkCreateProfileBox').is(':checked'))) {
				var imageBinaryData = imgBinaryFile;
				fileData = {
						"DisplayName" : displayName,
						"Description" : descriptionDetails,
						"Image" : imageBinaryData,
						"ProfileImageName" : profileImageName
						
					};
				var response = objBoxProfile.createBoxProfile(boxName, fileData);
				var statusCode = objCommon.getStatusCode(response);
				if (statusCode === 201 || statusCode === 204) {
					displayBoxCreateMessage (boxName);
				}
			} else {
				displayBoxCreateMessage (boxName);
			}
		}
	}
	removeSpinner("modalSpinnerBox");
}

/**
 * The purpose of this function is to display success message notification
 * on successful box create
 * @param boxName
 */
function displayBoxCreateMessage (boxName) {
	displaySuccessMessage('#createBoxPopUpModalWindow','boxMessageBlock');
	createBoxTable();
	//boxListData();
};

/**
 * The purpose of this function is to close the single delete box modal popup.
 */
function closeBox() {
	$('#deleteModalWindow, .window').hide(0);
}

/**
 * The purpose of this function is to get multiple boxes.
 */
function getMultipleBoxes() { 
	var elementsLength = document.fBoxtable.elements.length;
	var count = 0;
	var boxName = null;	
	for (count = 0; count < elementsLength; count++) {
		if (document.fBoxtable.elements[count].name == "case") {
			if (document.fBoxtable.elements[count].checked) {
				var formBoxName = document.fBoxtable.elements[count].value;
				
				if (boxName == null) {
					boxName = formBoxName;
				} else {
					boxName = boxName + ',' + formBoxName;
				}
			}
		}
	}
	selectedBoxes = boxName;
}



/**
 * The purpose of this function is to delete multiple boxes.
 */
function deleteMultipleBoxes() {
	var etagIDOfPreviousRecord = "txtHiddenEtagId";
	var arrEtag = [];
	var etagValue = '';
	var tableID = $('#mainBoxTable');
	var idCheckAllChkBox = "#chkSelectall";
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord,
				arrEtag, "#chkBox0");
	}
	var boxes = selectedBoxes;
	var arrBoxes = boxes.split(',');
	arrDeletedConflictCount = [];
	for ( var count = 0; count < arrBoxes.length; count++) {
		deleteBox(arrBoxes[count], count);
	}
	displayMessage();
	var type = "Box";
	var recordCount = getBoxTotalRecordCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, objBox, isDeleted);
}

/**
 * The purpose of this function is to delete the selected box.
 * 
 * @param boxName
 */
function deleteBox(boxName,count) {
	if (boxName.length == 0 ) { //For single delete.
	 boxName = sessionStorage.boxName;
	}
	cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objBoxManager = new _pc.BoxManager(accessor);
	var etag = objBoxManager.getEtag(boxName);
	var response = objBoxManager.del(boxName, etag);
	var statusCode = objCommon.getStatusCode(response);
	if (statusCode === 204) {
		sbSuccessful += boxName + ",";
	} else {
		arrDeletedConflictCount.push(count);
		sbConflict += boxName + ",";
		sbConflict.replace(/, $/, "");
	}
}

/**
 * The purpose of this function is to open popup.
 * 
 * @param idDialogBox
 * @param idModalWindow
 */
function openPopUpWindow(idDialogBox, idModalWindow) {
	if (idDialogBox === '#singleDeleteDialogBox') {
		getMultipleBoxes();
	}
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$('#btnCloseBoxCreate').focus();
}


/**
 * The purpose of this function is to display messages after delete operation.
 */
function displayMessage() {
	sbSuccessful = sbSuccessful.substring(0, sbSuccessful.length - 1);
	sbConflict = sbConflict.substring(0, sbConflict.length - 1);
	$('#deleteModalWindow, .window').hide(0);
	$("#boxMessageBlock").hide();
	if (sbSuccessful.length > 0 && sbConflict.length < 1) {
		isDeleted = true;
		addSuccessClass("#deleteBoxIcon");
		document.getElementById("deleteBoxSuccessmsg").innerHTML = entityCount(sbSuccessful)
				+ " " + getUiProps().MSG0324;
	} else if (sbSuccessful.length < 1 && sbConflict.length > 0) {
		isDeleted = false;
		addErrorClass("#deleteBoxIcon");
		document.getElementById("deleteBoxSuccessmsg").innerHTML = entityCount(sbConflict)
				+ " " + getUiProps().MSG0325;
	} else if (sbSuccessful.length > 0 && sbConflict.length > 0) {
		isDeleted = true;
		addErrorClass("#deleteBoxIcon");
		document.getElementById("deleteBoxSuccessmsg").innerHTML = entityCount(sbSuccessful)+" " + getUiProps().MSG0323 +" "+
		+(entityCount(sbConflict)+entityCount(sbSuccessful))+" " + getUiProps().MSG0324;
	}
	$("#deleteBoxMessageBlock").css("display", 'table');
	/*$("#mainContent").load(contextRoot + '/htmls/boxListView.html',  function() {
		if(navigator.userAgent.indexOf("Firefox") != -1) {
			createBoxTable();
		}
	});*/
	sbSuccessful = '';
	sbConflict = '';
	//createBoxTable();
	objCommon.centerAlignRibbonMessage("#deleteBoxMessageBlock");
	objCommon.autoHideAssignRibbonMessage('deleteBoxMessageBlock');

}

/**
 * The purpose of this function is to get the information for editing box
 * 
 * @param boxName
 * @param schemaUrl
 */
/*function getEditBox(boxName, schemaUrl) {
	var defaultSchemaURL = getUiProps().MSG0038;
	editPopupBoxorMsg.innerHTML = "";
	editPopupSchemaErrorMsg.innerHTML = "";
	$('#editSchemaId').find('input:text').val('');
	sessionStorage.existBoxName = boxName;
	$('#editBoxId').find('input:text').val(boxName);
	if (schemaUrl != defaultSchemaURL) {
	$('#editSchemaId').find('input:text').val(schemaUrl);
	}
	openCreateEntityModal('#boxEditModalWindow', '#boxEditDialogBox');
	
}
*/
/**
 * The purpose of this function is to check validation for 
 * editing box and call editbox method
 */
function updateBox() {
	showSpinner("modalSpinnerBox");
	var boxName = sessionStorage.existBoxName;
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var body = null;
	var newBoxName = $('#editBoxId').find('input:text').val();
	var newschemaUrl = $('#editSchemaId').find('input:text').val();
	if(newschemaUrl.length !=0){
	 body = {"Name" : newBoxName,"Schema" : newschemaUrl};
	} else {
		body = {"Name" : newBoxName};
	}
	if (validate(newBoxName, newschemaUrl,"editPopupBoxErrorMsg","editPopupSchemaErrorMsg","#txtEditBoxSchema")) {
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objBoxManager=new _pc.BoxManager(accessor);
	var etag = objBoxManager.getEtag(boxName);
		if(boxName === newBoxName) {
			editBox(boxName, body, etag,objBoxManager);
		} else {
			try {
				objBoxManager.retrieve(newBoxName);
				isBoxNotExist =false;
			} catch(exception) {
				isBoxNotExist = true;
			}
			if (isBoxNotExist ===  true) {
				isBoxNotExist = null;
				editBox(boxName, body, etag,objBoxManager);
			} else {
				editPopupSchemaErrorMsg.innerHTML = "";
				var existMessage = getUiProps().MSG0012;
				editPopupBoxErrorMsg.innerHTML=existMessage;
			}
		}
	}
	removeSpinner("modalSpinnerBox");
}

/**
 * The purpose of this function is to perfom edit operation for box
 * 
 * @param boxName
 * @param body
 * @param etag
 * @param objBoxManager
 */
function editBox(boxName, body, etag, objBoxManager) {
	var response = objBoxManager.update(boxName, body, etag);
	var statusCode = objCommon.getStatusCode(response);

	if(statusCode == 204) {
		displayEditSuccessMessage(boxName);
	} else if (statusCode == 409) {
		editPopupBoxErrorMsg.innerHTML= "";
		var existSchemaMessage = getUiProps().MSG0026;
		editPopupSchemaErrorMsg.innerHTML = existSchemaMessage;
	} else if (statusCode == 400) {
		editPopupBoxErrorMsg.innerHTML= "";
		var validMessage = getUiProps().MSG0014;
		editPopupSchemaErrorMsg.innerHTML = validMessage;
	}
}

/**
 * The purpose of this function is to display success method for edit box
 * 
 * @param boxName
 */
function displayEditSuccessMessage(boxName) {
	$("#deleteBoxMessageBlock").hide();
	addSuccessClass();
	inlineMessageBlock();
	createBoxTable();
	//var shorterBoxName = objCommon.getShorterEntityName(boxName);
	document.getElementById("boxMessageBlock").style.display = "table";
	document.getElementById("successmsg").innerHTML = getUiProps().MSG0326;
	document.getElementById("successmsg").title = boxName;
	$('#boxEditModalWindow, .window').hide(0);
	objCommon.centerAlignRibbonMessage("#boxMessageBlock");
	objCommon.autoHideAssignRibbonMessage('boxMessageBlock');
}

/**
 * The purpose of this function is to refresh the bos list after successful edit
 */
function boxRefresh() { 
	var contextRoot = sessionStorage.contextRoot;
	//$("#mainContent").html('');		
	$("#mainContent").load(contextRoot+'/htmls/'+sessionStorage.selectedLanguage+'/boxListView.html',  function() {
		if(navigator.userAgent.indexOf("Firefox") != -1) {
			createBoxTable();
		}
	});	
}

/**
 * The purpose of this method is to create and initialize Box Manager.
 * @returns {jBoxManager}
 */
function createBoxManager(){
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objboxMgr = new _pc.BoxManager(accessor);
	return objboxMgr;
}

/**
 * The purpose of this method is to create default box row for Box table.
 * @param dynamicTable
 * @returns
 */
function createMainBox(dynamicTable){
var cellDate = sessionStorage.selectedcelldate;
var cellName = sessionStorage.selectedcell;
var baseUrl = getClientStore().baseURL;
var cellURL = baseUrl;
var epoc1 ="''" ;
var epoc2="''" ;
cellURL += cellName;
if (!cellURL.endsWith("/")) {
       cellURL += "/";
}
cellDate = cellDate.replace(/'/g, "");
var infoUpdatedat = "'"+ cellDate +"'" ;
var infoSchema = "'"+ cellURL +"'" ;
var mainBoxValue = getUiProps().MSG0039;
var mainBox = "'"+mainBoxValue+"'" ;
var mainBoxDate = cellDate;
dynamicTable += "<tr name='allrows' id='rowid'+count+'>";
dynamicTable += '<td></td>';

dynamicTable += '<td name = "acc"><div class = "mainTableEllipsis"><a id="boxNameLink" href = "#"  onclick = "uBoxDetail.openBoxDetail('+mainBox+','+epoc1+','+epoc2+','+infoUpdatedat+', '+infoUpdatedat+','+infoSchema+');" title= "'+mainBoxValue+'" tabindex="-1" style="outline: none;" class="mainBoxSelector">'+mainBoxValue+'</a></div></td>';
dynamicTable += "<td name = 'acc' style='max-width: 200px'><div class = 'mainTableEllipsis'><label title= '"+cellURL+"' class='cursorPointer'>"+cellURL+"</label></div></td>";
dynamicTable += "<td>"+mainBoxDate+"</td>";
dynamicTable += '<td></td>';
dynamicTable += "</tr>";
return dynamicTable;
}

/**
 * The purpose of this method is to create tabular view of box page as per pagination.
 */
function createChunkedBoxTable(json, recordSize){
$('#chkSelectall').attr('checked', false);
objCommon.disableButton('#btnDeleteBox');
$("#btnEditBoxIcon").removeClass('editIconEnabled');
$("#btnEditBoxIcon").addClass('editIconDisabled');
$("#btnEditBoxIcon").attr("disabled", true);
	var dynamicTable = "";
	var counter = 0;
	var boxName = new Array();
	var schema = new Array();
	var etag = new Array();
	var updatedDate = new Array();
	var createdDate = new Array();
	var mainBoxValue = getUiProps().MSG0039;
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS+recordSize) < (jsonLength) ? (objCommon.MAXROWS+recordSize) : jsonLength;
	var boxRowCount = 0;
	for (var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		etag[count] = obj.__metadata.etag;
		boxName[count] = obj.Name;
		schema[count] = obj.Schema;
		if(schema[count] == null) {
			var defaultSchemaURL = getUiProps().MSG0038;
			schema[count] = defaultSchemaURL;
		}
		updatedDate[count] = obj.__updated;
		createdDate[count] = obj.__published;
		// Epoch Date Conversion
		var date = objCommon.convertEpochDateToReadableFormat(""+ updatedDate[count]+"");
		var cDate = objCommon.convertEpochDateToReadableFormat(""+ createdDate[count]+"");
		var boxname = "'"+ boxName[count]+"'" ;
		var arrEtag = etag[count].split("/");
		var test = "'"+ arrEtag[0] +"'" ;
		var test1 =  arrEtag[1].replace(/["]/g,"");
		var test2 = "'"+ test1 +"'" ;
		var infoCreatedat = "'"+ cDate +"'" ;
		var infoUpdatedat = "'"+ date +"'" ;
		var infoSchema = "'"+ schema[count] +"'" ;
		dynamicTable += '<tr name = "allrows" id = "rowid'+boxRowCount+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteBox'" +','+ "'chkSelectall'" +','+ boxRowCount +',' + totalNoOfBoxes + ','+ "'btnEditBox'" + ','+"''"+','+"''"+','+"''"+','+"'mainBoxTable'"+');">';
		dynamicTable += '<td style="width:1%"><input id =  "txtHiddenEtagId'+boxRowCount+'" value='+obj.__metadata.etag+' type = "hidden" /><input title="'+boxRowCount+'" id = "chkBox'+boxRowCount+'" type = "checkbox" class = "case cursorHand regular-checkbox big-checkbox" name = "case" value = "'+boxName[count]+'" /><label for="chkBox'+boxRowCount+'" class="customChkbox checkBoxLabel"></label></td>';
		//dynamicTable += '<td style="width:1%"><input id = "chkBox'+count+'" type = "checkbox" class = "case cursorHand regular-checkbox big-checkbox" name = "case" value = "'+boxName[count]+'" /><label for="chkBox'+count+'" class="checkBoxLabel"></label></td>';
		dynamicTable += '<td name = "acc" style="width:29%;max-width: 200px"><div class = "mainTableEllipsis"><a id="boxNameLink" href = "#" onclick = "uBoxDetail.openBoxDetail('+boxname+','+test+','+test2+','+infoCreatedat+', '+infoUpdatedat+','+infoSchema+');" title= "'+boxName[count]+'" tabindex="-1" style="outline: none;">'+boxName[count]+'</a></div></td>';
		dynamicTable += "<td name = 'acc' style='width:40%;max-width: 200px'><div class = 'mainTableEllipsis'><label title= '"+schema[count]+"' class='cursorPointer'>"+schema[count]+"</label></div></td>";
		dynamicTable += "<td style='width:15%'>"+date+"</td>";
		dynamicTable += '<td  style="width:15%"><label class="showInstallationIcon" onclick="uInstallBox.openInstallationStatusPopUp('+boxname+',true);"></label></td>';//onclick="uInstallBox.openInstallationStatusPopUp('+boxname+');"
		//<span class = "boxInstallIcon" title="Installation Status"></span> Installation status span
		dynamicTable += "</tr>";
		counter++;
		boxRowCount++;
	}
	if(counter != objCommon.MAXROWS){
		dynamicTable = createMainBox(dynamicTable);
	}
	if (jsonLength >0) {
		$("#mainBoxTable thead tr").addClass('mainTableHeaderRow');
		$("#mainBoxTable tbody").addClass('mainTableTbody');
	}
	$("#mainBoxTable tbody").html(dynamicTable);
	if($("#mainBoxTable tbody tr").length == 1 && $(".mainBoxSelector").text() == mainBoxValue) {
		$("#chkSelectall").attr('checked', false);
		$("#chkSelectall").attr('disabled', true);
		$("#mainBoxTable thead tr").removeClass("mainTableHeaderRow");
		$("#mainBoxTable tbody").removeClass("mainTableTbody");
		$("#mainBoxTable tbody").addClass("emptyBoxTable");
	}
	setTimeout(function() {
		applyScrollCssOnBoxGrid(); 
	}, 300);
}


/**
 * The purpose of this function is to create dynamic table
 * on the basis of response returned by API.
 */
function createBoxTable() {
	var objboxMgr = createBoxManager();
	var totalRecordCount = objBox.retrieveRecordCount(objboxMgr);
	totalNoOfBoxes = totalRecordCount;
	if (totalNoOfBoxes == 0) {
		$("#chkSelectall").attr('checked', false);
		$("#chkSelectall").attr('disabled', true);
		objCommon.disableButton("#btnDeleteBox");
		var recordCount = "1 - 1 " + getUiProps().MSG0323 + " 1";
		$("#recordCount_Box").text(recordCount);
		$("#btnEditBoxIcon").removeClass('editIconEnabled');
		$("#btnEditBoxIcon").addClass('editIconDisabled');
		$("#btnEditBoxIcon").attr("disabled", true);
		$("#mainBoxTable thead tr").removeClass("mainTableHeaderRow");
		$("#mainBoxTable tbody").removeClass("mainTableTbody");
		$("#mainBoxTable tbody").addClass("emptyBoxTable");
		$('#mainBoxTable tbody').empty();
		var dynamicTable = "";
		dynamicTable = createMainBox(dynamicTable);
		$("#mainBoxTable tbody").html(dynamicTable);
	} else {
		$("#chkSelectall").attr('disabled', false);
		$("#mainBoxTable thead tr").addClass("mainTableHeaderRow");
		$("#mainBoxTable tbody").removeClass("emptyBoxTable");
		$("#mainBoxTable tbody").addClass("mainTableTbody");
		totalRecordCount = parseInt(totalRecordCount) + 1;
		var json = objBox.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
		var recordSize = 0;
		createChunkedBoxTable(json, recordSize);
		var tableID = $('#mainBoxTable');
		objCommon.createPaginationView(totalRecordCount, objCommon.MAXROWS, tableID, objBox, json, createChunkedBoxTable, "Box");
		objCommon.checkCellContainerVisibility();
	}
}

function getSelectedBoxDetails() {
	var selectedBoxName = objCommon.getMultipleSelections('mainBoxTable', 'input', 'case');
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objbox = new _pc.BoxManager(accessor);
	var json = objbox.getBoxes(selectedBoxName);	
	var jsonData = JSON.stringify(json);
	var JSONstring = JSON.parse(jsonData);
	var selectedSchemaURL = JSONstring.Schema;
	var defaultSchemaURL = getUiProps().MSG0038;
	editPopupBoxErrorMsg.innerHTML = "";
	editPopupSchemaErrorMsg.innerHTML = "";
	$('#editSchemaId').find('input:text').val('');
	sessionStorage.existBoxName = selectedBoxName;
	$('#editBoxId').find('input:text').val(selectedBoxName);
	if (selectedSchemaURL != defaultSchemaURL) {
		$('#editSchemaId').find('input:text').val(selectedSchemaURL);
	}
	openCreateEntityModal('#boxEditModalWindow', '#boxEditDialogBox', 'txtEditBoxName');
}

/**
 * The purpose of this function is to create spinner object for
 * box profile create
 */
function showSpinnerForUploadFile () {
	var target = document.getElementById('spinner');
	objOdata.spinner = new Spinner(opts).spin(target);
	return objOdata.spinner;
}

/**
 * The purpose of this function is to check scroll bar presence in box grid
 * apply css as per condition.
 */
function applyScrollCssOnBoxGrid() {
	var tbodyObject = document.getElementById("entityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainBoxTable td:eq(2)").css("width", '40.16%');
	}
}

/**Box Create Pop Up Starts**/

/**
 * The purpose of the following method is to show menu options on hovering the Create Box button.
 */
function showBoxMenuOptions() {
	$("#createEntityWrapper").hover(function(){
		$(".createBoxSubMenu").css("display","block");
	}, function(){
		$(".createBoxSubMenu").css("display","none");
	});
	$(".createBoxSubMenu").hover(function(){
		$(".createBoxSubMenu").css("display","block");
	}, function(){
		$(".createBoxSubMenu").css("display","none");
	});
}

/**
 * Followig method performs checkBox click operation.
 */
$("#chkCreateProfileBox").click(function() {
	if ($('#chkCreateProfileBox').is(':checked')) {
		$('#sectionRHSMainElements :input').removeAttr('disabled');
		enableBrowseButton("#btnBrowse","#idImgFileBox");
	} else {
		$('#sectionRHSMainElements :input').attr('disabled', true);
		$("#idImgFileBox").css("cursor", "default");
		clearBoxProfileSection('#idImgFileBox', 'popupBoxImageErrorMsg','#btnBrowse','#figBoxProfile','#imgBoxProfile','#lblNoFileSelected');
	}
});

$("#btnCreateInstallBox").click(function() { 
	createNewBox();
}); 

/**
 * Following method displays success message.
 * @param modalId
 * @param dvMessageID
 */
function displaySuccessMessage(modalId,dvMessageID) {
	$("#deleteBoxMessageBlock").hide();
	closeCreateBoxPopUp(modalId);
	document.getElementById("successmsg").innerHTML = getUiProps().MSG0327;
	document.getElementById(dvMessageID).style.display = "table";
	//$("#boxMessageBlock").css("width","175px");
	objCommon.centerAlignRibbonMessage("#boxMessageBlock");
	objCommon.autoHideAssignRibbonMessage('boxMessageBlock');
};

/**
 * The purpose of this function is to validate display name.
 * 
 * @param displayName
 * @param displayNameSpan
 * @returns {Boolean}
 */
function validateDisplayName(displayName, displayNameSpan,txtDisplayName) {
	var MINLENGTH = 1;
	var MAXLENGTH = 128;
	var letters = /^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9a-zA-Z-_]+$/;
	var specialchar = /^[-_]*$/;
	var allowedLetters = /^[0-9a-zA-Z-_]+$/;
	var lenDisplayName = displayName.length;
	if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
		//showErrorIcon('#txtDisplayNameBox');
		showErrorIcon(txtDisplayName);
		document.getElementById(displayNameSpan).innerHTML =  getUiProps().MSG0103;
		return false;
	} else if (lenDisplayName > MAXLENGTH) {
		document.getElementById(displayNameSpan).innerHTML = getUiProps().MSG0104;
		//showErrorIcon('#txtDisplayNameBox');
		showErrorIcon(txtDisplayName);
		return false;
	} else if (lenDisplayName != 0 && ! (displayName.match(letters))) {
		document.getElementById(displayNameSpan).innerHTML = getUiProps().MSG0023;
		//showErrorIcon('#txtDisplayNameBox');
		showErrorIcon(txtDisplayName);
		return false;
	} else if (lenDisplayName != 0 && !(displayName.match(allowedLetters))) {
		document.getElementById(displayNameSpan).innerHTML = getUiProps().MSG0023;
		// showErrorIcon('#txtDisplayNameBox');
		showErrorIcon(txtDisplayName);
		return false;
	} else if(lenDisplayName != 0 && (specialchar.toString().indexOf(displayName.substring(0,1)) >= 0)) {
		document.getElementById(displayNameSpan).innerHTML = getUiProps().MSG0106;
		//showErrorIcon('#txtDisplayNameBox');
		showErrorIcon(txtDisplayName);
		return false;
	}
	//showValidValueIcon('#txtDisplayNameBox');
	showValidValueIcon(txtDisplayName);
	document.getElementById(displayNameSpan).innerHTML = "";
	return true;
}

/**
 * The purpose of this function is to validate description.
 * 
 * @param descriptionDetails
 * @param descriptionSpan
 * @returns {Boolean}
 */

function validateDescription(descriptionDetails,descriptionSpan) {
	var isValidDescription = true;
	var lenDescription = descriptionDetails.length;
	if (lenDescription > 51200) {
		isValidDescription = false;
		document.getElementById(descriptionSpan).innerHTML = getUiProps().MSG0107;
	}
	return isValidDescription;
}

/**
 * This method validates box profile.
 * @param displayName Display Name
 * @param descriptionDetails Description
 * @param displayNameSpan Display Name Span ID
 * @param descriptionSpan Description Span ID
 * @returns {Boolean}
 */
function validateBoxProfile (displayName, descriptionDetails, displayNameSpan, descriptionSpan) {
	if (validateDisplayName(displayName, displayNameSpan,'#txtDisplayNameBox')) {
		document.getElementById(displayNameSpan).innerHTML = "";
		return validateDescription(descriptionDetails, descriptionSpan);
	}
	return false;
}

/**
 * Following function displays image in the image section.
 */
function displayImage(profileFigureID,imgID,binaryImage,imgWidth,imgHeight,fileName){
	$(profileFigureID).removeClass("boxProfileImage");
	$(imgID).css("display", "block");
	$(imgID).attr('src', binaryImage).width(imgWidth).height(imgHeight);
}

/**
 * Following function checks the dimensions of the image and based on that displays image.
 * @param imgID Image ID
 * @param profileFigureID figurr ID.
 * @param minHeight minimum height.
 * @param minWidth minimum width.
 * @param imgHeight image height.
 * @param imgWidth image width.
 * @param binaryImage binary image.
 */
function checkImageDimensions(imgID, profileFigureID,
		minHeight, minWidth, imgHeight, imgWidth, binaryImage) {
	// Case 1 - when width and height both are smaller than 70 and 71
	// respectively.
	if (imgHeight <= minHeight && imgWidth <= minWidth) {
		displayImage(profileFigureID,imgID,binaryImage,imgWidth,imgHeight);
	}
	// when either width or height is greater than minHeight/minWidth.
	else if (imgHeight > minHeight || imgWidth > minWidth) {
		var aspectRatio = calculateAspectRatio(imgHeight, imgWidth); //
		// Case 2 - when Width is greater than or equal to height.
		if (imgWidth >= imgHeight) {
			imgWidth = minWidth;
			imgHeight = imgWidth / aspectRatio;
			displayImage(profileFigureID,imgID,binaryImage,imgWidth,imgHeight);
		} else {
			// Case 3 - when Height is greater than width.
			imgHeight = minHeight;
			imgWidth = aspectRatio * minHeight;
			displayImage(profileFigureID,imgID,binaryImage,imgWidth,imgHeight);
		}
	}
}

/**
 * The purpose of the following method is to select file.
 */
function selectFile(input, popupBoxImageErrorMsg, idImgFileBox, imgID,
		lblNoFileSelected, figBoxProfile) {
	uCellProfile.attachFile(popupBoxImageErrorMsg, idImgFileBox);
	if (input.files && input.files[0]) {
		var minHeight = 71;
		var minWidth  = 70;
		var imgHeight = 0;
		var imgWidth = 0;
		var fileName = input.files[0].name;
		var reader = new FileReader();
		$(lblNoFileSelected).html(fileName);
		reader.onload = function(e) {
			var img = new Image;
			img.onload = function() {
				imgHeight = img.height;
				imgWidth = img.width;
				if (isFileValid) {
					var isImageValid = isImageDimensionsValid(imgHeight,
							imgWidth,popupBoxImageErrorMsg);
					if (isImageValid) {
						checkImageDimensions(imgID, 
								figBoxProfile, minHeight, minWidth, imgHeight,
								imgWidth,e.target.result);
					}
				}
			};
			img.src = reader.result;
			$(imgID).css("display", "none");
			$(figBoxProfile).addClass("boxProfileImage");
			//$('#lblNoFileSelected').html('No file selected');
		};
		reader.readAsDataURL(input.files[0]);
	}
	input.value = null;
}

/**
 * Following method validates dimensions of the image.
 * @param height image height
 * @param width image width
 * @returns {Boolean} true/false
 */
function isImageDimensionsValid(height, width,popupBoxImageErrorMsg) {
	if (height > getUiProps().MSG0237 || width > getUiProps().MSG0237) {
		document.getElementById(popupBoxImageErrorMsg).innerHTML = getUiProps().MSG0236;
		isFileValid = false;
		imgBinaryFile = null;
		return false;
	}
	return true;
}

/**
 * Following method calculates aspect ratio. 
 * @param height image height
 * @param width image width
 * @returns {Number} aspect ratio
 */
function calculateAspectRatio(height,width) {
	var aspectRatio = width/height;
	return aspectRatio;
}

/**
 * Following method closes the box operations and also brings controls to their default state.
 * @param modelId
 */
function closeCreateBoxPopUp(modelId) {
	$(modelId).hide(0);
	uCellProfile.resetFileInput('#idImgFileBox', 'popupBoxImageErrorMsg');
	imgBinaryFile = null;
	disableBrowseButton("#btnBrowse");
	$("#figBoxProfile").addClass("boxProfileImage");
	$('#sectionRHSMainElements :input').attr('disabled', true);
	$("#imgBoxProfile").css("display", "none");
	$('#lblNoFileSelected').html('No file selected');
	$('.popupContent').find('input:text').val('');
	$('.popupContent').find('textarea').val('');
	$('.popupAlertmsg').html('');
	$('#chkCreateProfileBox').attr('checked', false);
	$('.popupContent').find('input:text').removeClass( "errorIcon validValueIcon" );
}
/**
 * Following method clear the values that comes under box profile section. 
 */
function clearBoxProfileSection(idImgFileBox,popUpErrorMsg,btnBrowse,figProfile,imgProfile,lblMessage) {
	uCellProfile.resetFileInput(idImgFileBox, popUpErrorMsg);
	$(idImgFileCell).css("cursor", "default");
	imgBinaryFile = null;
	disableBrowseButton(btnBrowse);
	$(figProfile).addClass("boxProfileImage");
	$(imgProfile).css("display", "none");
	$('.RHSAlertMsg').html('');
	$(lblMessage).html('No file selected');
	$('.RHSElements').find('input:text').val('');
	$('.RHSElements').find('textarea').val('');
	$('.RHSElements').find('input:text').removeClass(
			"errorIcon validValueIcon");
	showDefaultCursor(btnBrowse);
}
/**
 * Following method is used to display error Icon.
 * @param txtID
 */
function showErrorIcon(txtID) {
	$(txtID).removeClass("validValueIcon");
	$(txtID).addClass("errorIcon");	
}
/**
 * Following method is used for displaying valid value icon.
 * @param txtID
 */
function showValidValueIcon(txtID){
	$(txtID).removeClass("errorIcon");	
	$(txtID).addClass("validValueIcon");
	
}

/**
 * Following method is used to remove icons from the textboxes.
 * @param txtID
 */
function removeStatusIcons(txtID) {
	$(txtID).removeClass("errorIcon");	
	$(txtID).removeClass("validValueIcon");
}

/**
 * Following method disables browse button.
 */
function disableBrowseButton(id){
	$(id).removeClass('btnClose');
	$(id).addClass('btnDisabled');
}

/**
 * Following method enables browse button;
 */
function enableBrowseButton(id,idImgFile){
	$(idImgFile).css("cursor", "pointer");
	$(id).removeClass('btnDisabled');
	$(id).addClass('btnClose');
	showPointerCursor(id);
}
/**
 * Following method shows pointer cursor.
 */
function showPointerCursor(id) {
	$(id).css('cursor', 'pointer');
	$(id).css('cursor', 'pointer');
}

/**
 * Following method shows defaults cursor.
 */
function showDefaultCursor(id) {
	$(id).css('cursor', 'default');
	$(id).css('cursor', 'default');	
}

/**
 * Following method validates Box Name on blur event. 
 */
$("#txtBoxName").blur(function() {
	var boxName = $('#txtBoxName').val(); //"popupBoxErrorMsg";
	var boxSpan = "popupBoxErrorMsg";
	validateBoxName(boxName,boxSpan);
});

/**
 * Following method validates schemas URL on blur event.
 */
$("#txtSchemaURL").blur(function() {
	var schemaSpan =  "popupSchemaErrorMsg";
	var schemaURL = $("#txtSchemaURL").val();
	document.getElementById("popupSchemaErrorMsg").innerHTML = "";
	objBox.validateSchemaURL(schemaURL, schemaSpan,"#txtSchemaURL");
});

/**
 * Following method validates Display Name on blur event.
 */
$("#txtDisplayNameBox").blur(function() {
	var displayName = $("#txtDisplayNameBox").val();
	var displayNameSpan = "boxDisplayNameErrorMsg";
	validateDisplayName(displayName, displayNameSpan,'#txtDisplayNameBox');
});

/**
 * Following method validates Description on blur event.
 */
$("#txtDescriptionBox").blur(function() {
	document.getElementById("boxDescriptionErrorMsg").innerHTML = "";
	var descriptionDetails = document.getElementById("txtDescriptionBox").value;
	var descriptionSpan =  "boxDescriptionErrorMsg";
	validateDescription(descriptionDetails,descriptionSpan);
});

/**
 * Following method validates Edit Box Name on blur event.
 */
$("#txtEditBoxName").blur(function() {
	var displayName = $("#txtEditBoxName").val();
	var displayNameSpan = "editPopupBoxErrorMsg";
	validateDisplayName(displayName, displayNameSpan,'#txtEditBoxName');
});

/**
 * Following method validates Edit Box - Schema URL on blur event.
 */
$("#txtEditBoxSchema").blur(function() {
	var schemaSpan =  "editPopupSchemaErrorMsg";
	var schemaURL = $("#txtEditBoxSchema").val();
	document.getElementById("editPopupSchemaErrorMsg").innerHTML = "";
	objBox.validateSchemaURL(schemaURL, schemaSpan,"#txtEditBoxSchema");
});

/**
 * Following method displays cursor pointer on Browse button.
 */
$("#btnBrowse").hover(function() {
	showPointerCursor("#btnBrowse");
});
/** Box Create Pop Up Ends* */

function checkboxFocus() {
	$("#customLblChkBox").css("outline","-webkit-focus-ring-color auto 5px");
}

function checkboxBlur() {
	$("#customLblChkBox").css("outline","none");
}

function divOnFocusBrowse() {
	$("#dvBrowse").css("outline","-webkit-focus-ring-color auto 5px");
}

function divOnBlurBrowse() {
	$("#dvBrowse").css("outline","none");
}

/**
 * Following method fetches total record count.
 * @returns total record count.
 */
function getBoxTotalRecordCount() {
	var objboxMgr = createBoxManager();
	var totalRecordCount = objBox.retrieveRecordCount(objboxMgr);
	totalRecordCount = parseInt(totalRecordCount) + 1;
	return totalRecordCount;
}

/**
 * Following fetches all json data.
 * @returns json.
 */
function retrieveAllJsonData() {
	var objboxMgr = createBoxManager();
	var totalRecordCount = objBox.retrieveRecordCount(objboxMgr);
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var uri = objboxMgr.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
}
