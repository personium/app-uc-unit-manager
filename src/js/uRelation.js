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

function uRelation() {
}

// Global variable
var objRelation  = new uRelation();
uRelation.prototype.sbSuccessfulRelation = '';
uRelation.prototype.sbConflictRelation = '';
var cellName = sessionStorage.selectedcell;
var maxRows = 10;
var totalRecordsize = 0;
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

/**
 * The purpose of this function is to load relation page.
 */
uRelation.prototype.loadRelationPage = function() {
	if(sessionStorage.tabName == "Relation"){
		objCommon.checkCellContainerVisibility();
		createRelationTable();
	}
	//function for delete operation
	$("#btnDeleteRelation").click(function() {
		objRelation.openRelationPopUpWindow('#multipleDeleteDialogBox','#multipleDeleteModalWindow');
	});
};

/**
 * The purpose of this function is to empty create relation popup fields.
 */
uRelation.prototype.emptyCreateRelationPopupFields = function () {
	$("#popupRelErrorMsg").text("");
	$("#ddRoleBoxErrorMsg").text("");
	$("#ddlErrorMsg").text("");
	$("#txtRelName").val("");
	$('#chkBoxAssignRoleToRelation').attr('checked', false);
	$("#dropDownRoleAssignToRelation").attr('disabled', true);
	$('#dropDownRoleAssignToRelation').addClass("customSlectDDDisabled");
	objCommon.bindRoleBoxDropDown("dropDownRoleAssignToRelation");
	objCommon.removePopUpStatusIcons('#txtRelName');
};

/**
 * The purpose of this method is to fetch the required records as per pagination. 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
uRelation.prototype.retrieveChunkedData = function (lowerLimit, upperLimit) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelationManager = new _pc.RelationManager(accessor);
	var uri = objRelationManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit + "&$expand=_Box";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to retrieve list of assigned roles for
 * every relation.
 * @param relationName
 * @param boxName
 * @returns {Array}
 */
uRelation.prototype.retrieveAssignedRolesListForRelation = function(relationName, boxName) {
	var rolesMappedList = new Array();
	boxName = boxName.split(' ').join('');
	var cellName = sessionStorage.selectedcell;
	var multiKey = null;
	var mainBoxValue = getUiProps().MSG0039;
	var baseUrl = getClientStore().baseURL;
	var objRelationToRoleMapping = new relationToRoleMapping();
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var objLinkManager = objRelationToRoleMapping.initializeLinkManager(accessor, context);
	multiKey = "(Name='"+relationName+"')";
	if (boxName != mainBoxValue) {
		multiKey = "(Name='"+relationName+"',_Box.Name='"+boxName+"')";
	}	
	var response = objLinkManager.retrieveRoleAccountLinks(context, objRelationToRoleMapping.SOURCE,
			objRelationToRoleMapping.DESTINATION, multiKey);
	var responseBody = response.bodyAsJson();
	var jsonLink = responseBody.d.results;
	var lenJsonLink = jsonLink.length;
	if (response.getStatusCode() == 200) {
		for ( var index = 0; index < lenJsonLink; index++) {
			var obj = jsonLink[index];
			role = objCommon.getRoleNameFromURI((obj.uri));
			rolesMappedList.push(" " + role);
		}
	}
	return rolesMappedList;
};

/**
 * The purpose of this function is to create relation.
 */
uRelation.prototype.createRelation = function () {
	showSpinner("modalSpinnerRel");
	var json = null;
	var createAllowed = false;
	var relationName = $("#txtRelName").val();
	var dropDown = document.getElementById("dropDownBox");
	var boxName = null;
	if (dropDown.selectedIndex > 0) {
		boxName = dropDown.options[dropDown.selectedIndex].title;
	}
	var objRelation = new uRelation();
	if (objRelation.validateRelationName() && objRelation.validateBoxDropDown()) {
		if ($("#chkBoxAssignRoleToRelation").is(':checked')) {
			var isValidValue = objCommon.validateDropDownValue("dropDownRoleAssignToRelation", "#ddRoleBoxErrorMsg", getUiProps().MSG0279);
			if (isValidValue == false) {
				removeSpinner("modalSpinnerRel");
				return;
			}
		}
		var accessor = objRelation.initializeAccessor();
		if (boxName == null || boxName == "" || boxName == 0) {
			boxName = undefined;
		}
		json = {
			"Name" : relationName,
			"_Box.Name" : boxName
		};
		var objpRelation = new _pc.Relation(accessor, json);
		var objRelationManager = new _pc.RelationManager(accessor);
		var success = false;
		try {
			objRelationManager.retrieve(relationName, boxName);
		} catch (exception) {
			if (exception.getCode() == "PR404-OD-0002")
				createAllowed = true;
		}
		if (createAllowed) {
			var createRelationResponse = objRelationManager.create(objpRelation);
			if (createRelationResponse instanceof _pc.Relation) {
				success = true;
			}
		} else {
			cellpopup.showErrorIcon('#txtRelName');
			$("#popupRelErrorMsg").text(getUiProps().MSG0031);
		}
		removeSpinner("modalSpinnerRel");
		if (success) {
			var response = null; 
			if ($("#chkBoxAssignRoleToRelation").is(':checked')) {
				var mainBoxValue = getUiProps().MSG0039;
				var multiKey = "(Name='" + relationName + "')";
				if (boxName != null && boxName != mainBoxValue) {
					multiKey = "(Name='" + relationName + "',_Box.Name='" + boxName + "')";
				}
				response = objCommon.assignEntity("dropDownRoleAssignToRelation", "Relation", "Role", multiKey, true);
				if (response.getStatusCode() == 204) {
					objRelation.displaySuccessRelationCreateMsg();
				}
			} else {
				objRelation.displaySuccessRelationCreateMsg();
			}
		}
	}
	removeSpinner("modalSpinnerRel");
};

/**
 * The purpose of this function is to display success message for
 * relation create operation.
 */
uRelation.prototype.displaySuccessRelationCreateMsg = function () {
	$('#modalCreateRel, .window').hide();
	addSuccessClass('#relationMessageIcon');
	$("#relationMessageBlock").css("display", 'table');
	$("#relationMessageBlock").css("width", "0px");
	document.getElementById("relationSuccessmsg").innerHTML = getUiProps().MSG0278;
	createRelationTable();
	objCommon.centerAlignRibbonMessage("#relationMessageBlock");
	objCommon.autoHideAssignRibbonMessage("relationMessageBlock");
};

/**
 * This method ensures that the first index is never selected.
 * @returns {Boolean}
 */
uRelation.prototype.validateBoxDropDown = function() {
	var dropDown = document.getElementById("dropDownBox");
	if (dropDown.selectedIndex  == 0) {
		//$("#popupRelErrorMsg").text('');
		$("#ddlErrorMsg").text(getUiProps().MSG0222);
		return false;
	}
	$("#ddlErrorMsg").text('');
	return true;
};

/**
 * To validate the Relation name based on various conditions
 */
uRelation.prototype.validateRelationName = function() {
	var relationName = $("#txtRelName").val();
	//The following regex finds under score(_),colon(:) and hyphen(-).
	var specialCharacter = /^[-_+:]*$/;
	//The following regex finds characters in the range of 0-9,a-z(lower case),plus(+)under score(_),colon(:) and A-Z(upper case).
	var letter = /^[0-9a-zA-Z-_+:]+$/;
	var lenRelName = relationName.length;
	 //$("#ddlErrorMsg").text('');
	 if ((lenRelName < 1)) {
		$("#popupRelErrorMsg").text(getUiProps().MSG0027);
		cellpopup.showErrorIcon('#txtRelName');
		return false;
	} else if ((lenRelName > 128)) {
		$("#popupRelErrorMsg").text(getUiProps().MSG0028);
		cellpopup.showErrorIcon('#txtRelName');
		return false;
	} else if (lenRelName != 0 && !(relationName.match(letter))) {
		$("#popupRelErrorMsg").text(getUiProps().MSG0029);
		cellpopup.showErrorIcon('#txtRelName');
		return false;
	} else if (lenRelName != 0
			&& (specialCharacter.toString().indexOf(
					relationName.substring(0, 1)) >= 0)) {
		$("#popupRelErrorMsg").text(getUiProps().MSG0030);
		cellpopup.showErrorIcon('#txtRelName');
		return false;
	} else {
		cellpopup.showValidValueIcon('#txtRelName');
		document.getElementById("popupRelErrorMsg").innerHTML = "";
		return true;
	}
	cellpopup.showValidValueIcon('#txtRelName');
	return true;
};

/**
 * The purpose of this function is to initialize accessor.
 */
uRelation.prototype.initializeAccessor = function() {
	var token = getClientStore().token;
	var url = getClientStore().baseURL;
	var objJPersoniumContext = new _pc.PersoniumContext(url, cellName, "", "");
	var accessor = objJPersoniumContext.withToken(token);
	return accessor;
};

/**
 * The purpose of this function is to bind the drop down with box data against
 * selected cell name
 */
uRelation.prototype.bindBoxDropDown = function(JSONstring) {
	var len = JSONstring.length;
	var select = document.getElementById("dropDownBox");
	var defaultOption = document.createElement('option');
	var mainBoxValue = getUiProps().MSG0039;
	defaultOption.value = 0;
	defaultOption.innerHTML = getUiProps().MSG0400;
	select.insertBefore(defaultOption, select.options[0]);
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = mainBoxValue;
	select.appendChild(newOption);
	for ( var count = 0; count < len; count++) {
		var option = document.createElement("option");
		option.id = null;
		option.innerHTML = null;
		var obj = JSONstring[count];
		var tooltipRelationName = objCommon.getShorterName(obj.Name,17);
		option.id = obj.__metadata.etag;
		option.innerHTML = obj.Name;
		option.text = tooltipRelationName;
		option.title = obj.Name;
		select.appendChild(option);
	}
};

/**
 * The purpose of this function is to retrieve the box list against a cell name
 */
uRelation.prototype.retrieveBox = function(isEditRelation) {
	var accessor = objRelation.initializeAccessor();
	var objBoxManager = new _pc.BoxManager(accessor);
	var totalRecordCount = objBox.retrieveRecordCount(objBoxManager);
	var dataUri = objBoxManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	var select = document.getElementById("dropDownBox");
	select.options.length = 0;
	if (isEditRelation) {
		bindBoxDropDown(dataJson, "ddlBoxList",
				sessionStorage.currentRelationBoxName);
	} else {
		objRelation.bindBoxDropDown(dataJson);
	}
};

/**
 * The purpose of this method is to create relation data view as per pagination.
 */
function createChunkedRelationTable(json, recordSize, spinnerCallback){
	$('#chkSelectall').attr('checked', false);
	$("#chkSelectall").attr('disabled', false);
	objCommon.disableButton('#btnDeleteRelation');
	//$("#btnDeleteRelation").attr('disabled', true);
	$("#entityGridTbody").scrollTop(0);
	var name = new Array();
	var etag = new Array();
	var updatedDate = new Array();
	var arrPublishedDate = new Array();
	var box = new Array();
	var dynamicTable = "";
	var mainBoxValue = getUiProps().MSG0039;
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS+recordSize) < (jsonLength) ? (objCommon.MAXROWS+recordSize) : jsonLength;
	var relationRowCount = 0;
	for ( var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		etag[count] = obj.__metadata.etag;
		name[count] = obj.Name;
		updatedDate[count] = obj.__updated;
		arrPublishedDate[count] = obj.__published;
		box[count] = obj["_Box.Name"];
		if (obj["_Box.Name"] == null) {
		box[count] = mainBoxValue;
		} 
		var date			= objCommon.convertEpochDateToReadableFormat("" + updatedDate[count] + "");
		var publishedDate	= objCommon.convertEpochDateToReadableFormat("" + arrPublishedDate[count]	+ "");
		var roleName		= "'" + name[count] + "'";
		var boxName			= "'" + box[count] + "'";
		var roleBoxPair		= roleName + boxName;
		var pPublishedDate	= "'"+publishedDate+"'";
		var arrEtag			= etag[count].split("/");
		var arrEtag0		= "'"+ arrEtag[0] +"'" ;
		var arrEtag1		= "'"+ arrEtag[1].replace(/["]/g,"") + "'";
		var boxObj=obj._Box;
		var infoSchema = objCommon.getObjectSchemaUrl(boxObj);
		var rolesMappedList	= objRelation.retrieveAssignedRolesListForRelation(name[count],box[count]);
		relationDate		= "'"+date+"'";
		// Rows Start
			dynamicTable += '<tr class="dynamicRow mainTable" name="allrows" id="rowid_'
					+ relationRowCount + '" onclick="objCommon.rowSelect(this,'+ "'rowid_'" +','+ "'chkBox_'"+','+ "'row'" +','+ "'btnDeleteRelation'" +','+ "'chkSelectall'" +','+ relationRowCount +',' + totalRecordsize + ',' + "'editRelaionBtn'" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainRelationTable'" + ');">';
			dynamicTable += '<td style="width:1%;"><input id =  "txtHiddenEtagId'+relationRowCount+'" value='+etag[count]+' type = "hidden" /><input  title="'+relationRowCount+'" id="chkBox_' + relationRowCount
					+ '" type="checkbox" class="case cursorHand regular-checkbox big-checkbox" name="case" value = "'
					+ roleBoxPair + '" /><label for="chkBox_' + relationRowCount
					+ '" class="customChkbox checkBoxLabel"></label></td>';
			dynamicTable += '<td style="max-width: 100px;width:22.1%;"><div class ="mainTableEllipsis"><a id= "relationNameLink" href = "#"  onclick = "openRelationToRoleMappingPage('+roleName+','+boxName+','+arrEtag0+','+arrEtag1+','+pPublishedDate+','+relationDate+','+infoSchema+');" title= "'+name[count]+'" tabindex ="-1" style="outline:none">'+name[count]+'</a></div></td>';
			dynamicTable += "<td style='max-width: 90px;width:23%;'><div class ='mainTableEllipsis'><label title= '"+box[count]+"' class='cursorPointer'>" + box[count] + "</label></div></td>";
			dynamicTable += "<td style='width:15%;'>" + publishedDate + "</td>";
			dynamicTable += "<td style='width:15%;'>" + date + "</td>";
			dynamicTable += "<td style='width:24%;max-width: 100px;'><div class = 'mainTableEllipsis'><label title= '"+ rolesMappedList + "' class='cursorPointer'>" + rolesMappedList + "</label></div></td>";
			dynamicTable += "</tr>";
			// Rows End
			relationRowCount++;
	}
	if (dynamicTable != "") {
		if (jsonLength > 0) {
			$("#mainRelationTable thead tr").addClass('mainTableHeaderRow');
			$("#mainRelationTable tbody").addClass('mainTableTbody');
		}
		$("#mainRelationTable tbody").html(dynamicTable);
		setTimeout(function() {
			applyScrollCssRelationGrid();
		}, 300);
	}
	if (spinnerCallback != undefined) {
		spinnerCallback();
	}
}

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
function retrieveRelationRecordCount() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelationManager = new _pc.RelationManager(accessor);
	var uri = objRelationManager.getUrl();
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * This function is used to generate the dynamic table for the fetched relations.
 */
function createRelationTable() {
	var token = getClientStore().token;
	sessionStorage.token = token;
	totalRecordsize = retrieveRelationRecordCount();
	if (totalRecordsize == 0) {
		objCommon.displayEmptyMessageInGrid(getUiProps().MSG0233, "Relation");
		objCommon.disableButton('#btnDeleteRelation');
		$('#chkSelectall').attr('checked', false);
		$("#mainRelationTable tbody").empty();
	} else {
		$("#dvemptyTableMessage").hide();
		var json =  objRelation.retrieveChunkedData(objCommon.minRecordInterval, objCommon.noOfRecordsToBeFetched);
		var recordSize = 0;
		createChunkedRelationTable(json, recordSize);
		var tableID = $('#mainRelationTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
						tableID, objRelation, json, createChunkedRelationTable,
						"Relation");
		objCommon.checkCellContainerVisibility();
	}
}

/**
 * The purpose of this method is to select all checkboxes on click of header checkbox.
 */
uRelation.prototype.checkAllSelect = function (){
	var buttonId = '#btnDeleteRelation';
	objCommon.checkBoxSelect(document.getElementById("chkSelectall"), buttonId);
	objCommon.showSelectedRow(document.getElementById("chkSelectall"),"row","rowid_");
};

/**
 * The purpose of this function is to delete Relation.
 */
uRelation.prototype.deleteRelation = function (relationName, boxName){
	sessionStorage.boxName = boxName.split(' ').join('');
	sessionStorage.relationName = relationName;
	objRelation.openRelationPopUpWindow('#singleDeleteDialogBox', '#singleDeleteModalWindow');
};

/**
 * The purpose of this method is to open pop up window.
 * 
 * @param idDialogBox
 * @param idModalWindow
 */

uRelation.prototype.openRelationPopUpWindow = function(idDialogBox, idModalWindow) {
	if (idDialogBox === '#multipleDeleteDialogBox') {
		var response = objCommon.getMultipleSelections('mainRelationTable','input','case');
		sessionStorage.relationNames = response;
	}
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$('#btnCancelDeleteRelation').focus();
};

/**
 * The purpose of this method is to close Relation Delete popup.
 */
uRelation.prototype.closeRelation = function() {
	$('#singleDeleteModalWindow, .window').hide(0);
	$('#multipleDeleteModalWindow, .window').hide(0);
};

/**
 * The purpose of the following method is to delete multiple relations.
 */
uRelation.prototype.deleteMultipleRelations = function() {
	showSpinner("modalSpinnerRel");
	
	var etagIDOfPreviousRecord = "txtHiddenEtagId";
	var arrEtag = [];
	var etagValue = '';
	var tableID = $('#mainRelationTable');
		var idCheckAllChkBox = "#chkSelectall";
		//if (!$("#chkSelectall").is(':checked')) {
		if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBox0");
	}
	var relations = sessionStorage.relationNames;
	var objRelation = new uRelation();
	var arrRelations = relations.split(',');
	for ( var count = 0; count < arrRelations.length; count++) {
		var val = arrRelations[count].split("''");
		var rel = val[0].split("'").join("");
		var box = val[1].split("'").join("");
		if (box == getUiProps().MSG0039) {
			box = getUiProps().MSG0293;
		}
		objRelation.removeRelation(rel,box,count);
	}
	objRelation.displayMultipleRelationConflictMessage();
	removeSpinner("modalSpinnerRel");
	var type="Relation";
	 var recordCount = retrieveRelationRecordCount();
		objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, objRelation, isDeleted);
};

/**
 * The purpose of the following method is to delete relation.
 * @param 
 */
uRelation.prototype.removeRelation = function(relationName,boxName,count) { 
	boxName = boxName.split(' ').join('');
	var accessor = objRelation.initializeAccessor();
	var objRelationManager = new _pc.RelationManager(accessor);
	var promise = objRelationManager.del(relationName, boxName);
	try {
		if (promise.resolvedValue.status == 204) {
			objRelation.sbSuccessfulRelation += relationName + ",";
		}
	} catch (exception) {
		arrDeletedConflictCount.push(count);
		objRelation.sbConflictRelation += relationName + ",";
		objRelation.sbConflictRelation.replace(/, $/, "");
	}
};

/**
 * The purpose of this method is to show pertinent messages when multiple relations are deleted. 
 */
uRelation.prototype.displayMultipleRelationConflictMessage = function() {
	var conflictRelnDeleteLength = 0;
	var successfulRelnDeleteLength = 0;
	objRelation.sbSuccessfulRelation = objRelation.sbSuccessfulRelation.substring(0, objRelation.sbSuccessfulRelation.length - 1);
	objRelation.sbConflictRelation = objRelation.sbConflictRelation.substring(0, objRelation.sbConflictRelation.length - 1);
	$('#multipleDeleteModalWindow, .window').hide(0);
	conflictRelnDeleteLength = entityCount(objRelation.sbConflictRelation);
	successfulRelnDeleteLength = entityCount(objRelation.sbSuccessfulRelation);
	if(conflictRelnDeleteLength < 1 && successfulRelnDeleteLength > 0) {
		isDeleted = true;
		addSuccessClass('#relationMessageIcon');
		document.getElementById("relationSuccessmsg").innerHTML = successfulRelnDeleteLength+" "+getUiProps().MSG0338;
	} else if(successfulRelnDeleteLength < 1 && conflictRelnDeleteLength > 0) {
		isDeleted = false;
		addErrorClass('#relationMessageIcon');
		document.getElementById("relationSuccessmsg").innerHTML = conflictRelnDeleteLength+" "+getUiProps().MSG0339;
	} else if(conflictRelnDeleteLength > 0 && successfulRelnDeleteLength > 0 ) {
		isDeleted = true;
		addErrorClass('#relationMessageIcon');
		document.getElementById("relationSuccessmsg").innerHTML = successfulRelnDeleteLength+" of "+(conflictRelnDeleteLength + successfulRelnDeleteLength)+" "+getUiProps().MSG0338;
	}	
	objRelation.sbSuccessfulRelation = '';
	objRelation.sbConflictRelation = '';
	$("#relationMessageBlock").css("display", 'table');
	//createRelationTable();
	objCommon.centerAlignRibbonMessage("#relationMessageBlock");
	objCommon.autoHideAssignRibbonMessage("relationMessageBlock");
};
/**
 * Following method fetches relation details to pre-populate the edit relation pop up.
 */
function getSelectedRelationDetails() {
	var existingRoleName = sessionStorage.relationName;
	var existingBoxName = sessionStorage.boxName;
	sessionStorage.currentRelationName = existingRoleName;
	sessionStorage.currentRelationBoxName = existingBoxName;
	this.retrieveBox("ddlBoxList", existingBoxName,true);
	$('#txtEditRelationName').val(existingRoleName);
}

/**
 * Following method closed edit relation pop up.
 */
uRelation.prototype.closeEditRelationPopUp = function() {
	document.getElementById("txtEditRelationName").value='';
	$("#txtEditRelationName").removeClass("errorIcon");
	$("#txtEditRelationName").removeClass("validValueIcon");
	document.getElementById("editPopupRelationErrorMsg").innerHTML = "";
	$('#relationEditModalWindow, .window').hide(0);
	sessionStorage.currentRelationBoxName = '';
	sessionStorage.currentRelationBoxName = '';
};

/**
 * The purpose of this function is to display success message notification
 * on successful edit.
 */
uRelation.prototype.displayEditRoleSuccessMessage = function() {
	this.closeEditRelationPopUp();
	$("#relationLinkMessageBlock").css("display", 'table');
	document.getElementById("relationLinkSuccessmsg").innerHTML = getUiProps().MSG0386;
	addSuccessClass('#relationLinkMessageIcon');
	createRelationTable();
	objCommon.centerAlignRibbonMessage("#relationLinkMessageBlock");
	objCommon.autoHideAssignRibbonMessage('relationLinkMessageBlock');
};

/**
 * Following method edits relation.
 * @param oldRelationName old relation name
 * @param oldBoxName old box name
 * @param body body having new values
 * @param objJRelationManager relation manager object
 */
uRelation.prototype.editRelation = function(oldRelationName, oldBoxName, body, objJRelationManager) {
	var response = objJRelationManager.update(oldRelationName, oldBoxName, body, "*");
		if(response.getStatusCode() == 204) {
		this.displayEditRoleSuccessMessage();
	} else if (response.getStatusCode() == 409) {
		document.getElementById("editPopupRelationErrorMsg").innerHTML = getUiProps().MSG0031;
		$("#txtEditRelationName").addClass("errorIcon");
	}
};

/**
 * Client side validation for relation name.
 * 
 * @param roleName
 * @param errorSpanID
 */
  uRelation.prototype.relationValidation = function(relationName, errorSpanID) {
		//The following regex finds undersscore(_) and hyphen(-).	
		var specialCharacter = /^[-_]*$/;
		//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(uppercase).
		var letter = /^[0-9a-zA-Z-_]+$/;
		var minLengthMessage = getUiProps().MSG0027;
		var maxLengthMessage = getUiProps().MSG0028;
		var charMessage =  getUiProps().MSG0023;
		var specialCharMessage = getUiProps().MSG0030;
		var lenRelationName = relationName.length;
		if((lenRelationName < 1)) {
			document.getElementById(errorSpanID).innerHTML = minLengthMessage;
			return false;
		} else if((lenRelationName > 128)) {
			document.getElementById(errorSpanID).innerHTML = maxLengthMessage;
			return false;
		} else if(lenRelationName != 0 && !(relationName.match(letter))) {
			document.getElementById(errorSpanID).innerHTML = charMessage;
			return false;
		} else if(lenRelationName != 0 && (specialCharacter.toString().indexOf(relationName.substring(0, 1)) >= 0)) {
			document.getElementById(errorSpanID).innerHTML = specialCharMessage;
			return false;
		} else {
			return true;
		}
			return true;
	};

/**
 * Following method updates a relation.
 */
uRelation.prototype.updateRelation = function() {
	var mainBoxValue = getUiProps().MSG0039;
	var body = null;
	var newBoxSelected = null;
	var newRelationName = null;
	var oldRelationName = sessionStorage.currentRelationName.trim();
	var oldBoxName = sessionStorage.currentRelationBoxName.trim();
	if (oldBoxName == mainBoxValue) {
		oldBoxName = null;
	}
	newRelationName = document.getElementById("txtEditRelationName").value;
	var dropDown = document.getElementById("ddlBoxList");
	if (dropDown.selectedIndex == 0) {
		newBoxSelected = oldBoxName;
	} else if (dropDown.selectedIndex > 0) {
		newBoxSelected = dropDown.options[dropDown.selectedIndex].title;
	}
	if (this.relationValidation(newRelationName, "editPopupRelationErrorMsg")) {
		body = {
			"Name" : newRelationName,
			"_Box.Name" : newBoxSelected
		};
		if (newBoxSelected == undefined || newBoxSelected == null
				|| newBoxSelected == "" || newBoxSelected == mainBoxValue) {
			body = {
				"Name" : newRelationName
			};
		}
		var baseUrl = getClientStore().baseURL;
		var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
		var objJRelationManager = new _pc.RelationManager(accessor);
		this.editRelation(oldRelationName, oldBoxName, body,
					objJRelationManager);

		updateRelationInfo(newRelationName, newBoxSelected);
	}
	 else {
		$("#txtEditRelationName").addClass("errorIcon");
	}
	removeSpinner("modalSpinnerRole");
};
function updateRelationInfo(relName, boxName) {
	sessionStorage.ccname = relName;
	sessionStorage.relationName = relName;
	sessionStorage.currentRelationName = relName;
	sessionStorage.boxName = boxName;
	sessionStorage.currentRelationBoxName = boxName;
	var accessor = objRelation.initializeAccessor();
	var objRelationManager = new _pc.RelationManager(accessor);
	var newBoxName = boxName;
	if (newBoxName == null || newBoxName == "" || newBoxName == 0 || newBoxName == getUiProps().MSG0039) {
		newBoxName = undefined;
	}
	var res = objRelationManager.retrieve(relName, newBoxName);
	sessionStorage.ccurl = res.rawData.__metadata.uri;
	$('#assignRelationName').text(relName);
    $("#assignRelationName").attr('title', relName);
    $("#assignBoxName").text(boxName);
	uBoxDetail.displayBoxInfoDetails();
}

/**
 * The purpose of this function is to apply scroll css on
 * relation grid.
 */
function applyScrollCssRelationGrid() {
	var tbodyObject = document.getElementById("entityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRelationTable td:eq(2)").css("width", '23.3%');
		$("#mainRelationTable td:eq(4)").css("width", '15.05%');
	}
}
/**
 * Following method checks relation name validations on blur event.
 */
$("#txtRelName").blur(function() {
	var objRelation = new uRelation();
	objRelation.validateRelationName();
});

/**
 * Following method checks dropdown validations on blur event.
 */
$("#dropDownBox").blur(function() {
	var objRelation = new uRelation();
	objRelation.validateBoxDropDown();
	
});
/**
 * Following method checks dropdown (assignation) validations on blur event.
 */
$("#dropDownRoleAssignToRelation").blur(function() {
	objCommon.validateDropDownValue("dropDownRoleAssignToRelation", "#ddRoleBoxErrorMsg", getUiProps().MSG0279);
});

/**
 * Following method checks edit relation name validations on blur event.
 */
$("#txtEditRelationName").blur(function() {
	var newRelationName = document.getElementById("txtEditRelationName").value;
	if (objRelation.relationValidation(newRelationName, "editPopupRelationErrorMsg")) {
		$("#txtEditRelationName").removeClass('errorIcon');
		$("#txtEditRelationName").addClass("validValueIcon");
		$("#editPopupRelationErrorMsg").text(''); 
	} else {
		$("#txtEditRelationName").addClass("errorIcon");
	}
});

function checkboxFocusOnrelation() {
	$("#lblAssignCreateRelation").css("outline","-webkit-focus-ring-color auto 5px");
}

function checkboxBlurOnRelation() {
	$("#lblAssignCreateRelation").css("outline","none");
}

/**
 * Following method fetches all relation data.
 * @returns json.
 */
uRelation.prototype.retrieveAllRelationData = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var totalRecordCount = retrieveRelationRecordCount();
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelationManager = new _pc.RelationManager(accessor);
	var uri = objRelationManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top="+ totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

$(function() {
	objRelation.loadRelationPage();
	objCommon.creatEntityHoverEffect();
	objCommon.sortByDateHoverEffect();
	setDynamicGridHeight();
	$(window).resize(function () {
		if ($('#dvemptyTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfEmptyMessage();
		}
	});
});

