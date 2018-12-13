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
function relationToRoleMapping() {
}

var uRelationToRoleMapping = new relationToRoleMapping();

// Constants
relationToRoleMapping.prototype.SOURCE = "Relation";
relationToRoleMapping.prototype.DESTINATION = "Role";
relationToRoleMapping.prototype.totalRecordsize = "";

var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;
/**
 *  The purpose of this function is to initialize AbstractODataContext.js
 */
relationToRoleMapping.prototype.initializeAbstractDataContext = function(
		accessor) {
	return new _pc.AbstractODataContext(accessor);
};

/**
 * The purpose of this function is to initialize LinkManager.js
 */
relationToRoleMapping.prototype.initializeLinkManager = function(accessor,
		context) {
	return new _pc.LinkManager(accessor, context);
};

/********* Start - Mapping Feature *********/

/**
 * The purpose of this method is to retrieve total count of linked role 
 * @returns
 */
relationToRoleMapping.prototype.retrieveLinkedRoleCount = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelationManager = new _pc.RelationManager(accessor);
	var uri = objRelationManager.getUrl();
	var key="";
	var relationName = sessionStorage.relationName;
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	key = "(Name='"+relationName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+relationName+"',_Box.Name='"+boxName+"')";
	}
	uri += key + "/"+"_Role";
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};
/**
 * The purpose of this function is to retrieve chunked data from API.
 * 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
relationToRoleMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelationManager = new _pc.RelationManager(accessor);
	var uri = objRelationManager.getUrl();
	var key="";
	var relationName = sessionStorage.relationName;
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	key = "(Name='"+relationName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+relationName+"',_Box.Name='"+boxName+"')";
	}
	uri += key + "/"+"_Role";
	uri = uri + "?$orderby=__updated desc &$skip=" + lowerLimit + "&$top="
			+ upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};


/**
 *  The purpose of this function is to map relation to role and box.
 */
relationToRoleMapping.prototype.mapRelationToRole = function() {
	//document.getElementById("selectExternalCellDDMsg").innerHTML = "";
	//document.getElementById("selectRelationDDMsg").innerHTML = "";
	var roleDropdownMessage = getUiProps().MSG0055;
	var objRelationToRoleMapping = new relationToRoleMapping();
	showSpinner("modalSpinnerRelationMappingLink");
	var multiKey = null;
	var mainBoxValue = getUiProps().MSG0039;
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var boxName = sessionStorage.boxName;
	var relationName = sessionStorage.relationName;
	multiKey = "(Name='" + relationName + "')";
	if (boxName != null && boxName != mainBoxValue) {
		multiKey = "(Name='" + relationName + "',_Box.Name='" + boxName + "')";
	}
	var roleBoxPair = objRelationToRoleMapping.getSelectedRoleBoxPair();
	if (multiKey != null) {
		//document.getElementById("selectRelationDDMsg").innerHTML = "";
		if (roleBoxPair == false) {
			//document.getElementById("selectRelationDDMsg").innerHTML = roleDropdownMessage;
			removeSpinner("modalSpinnerRelationMappingLink");
			return false;
		}
		var selectedRoleName = roleBoxPair[0].split(' ').join('');
		var selectedBoxName = roleBoxPair[1].split(' ').join('');
		selectedBoxName = objCommon.getBoxSubstring(selectedBoxName);
		selectedRoleName = selectedRoleName.trim();
		if (selectedBoxName == mainBoxValue) {
			selectedBoxName = null;
		}
		var objLinkManager = objCommon.initializeLinkManager(accessor, context);
		var response = objLinkManager.establishLink(context,
				objRelationToRoleMapping.SOURCE,
				objRelationToRoleMapping.DESTINATION, multiKey,
				selectedBoxName, selectedRoleName, true);
		if (response.getStatusCode() == 204) {
			objRelationToRoleMapping.reloadPanel();
			objRelationToRoleMapping.createTable();
		} else if (response.getStatusCode() == 409) {
			addErrorClass('#relationToRoleMessageIcon');
			//inlineMessageBlock(172,'#relationToRoleMessageBlock');
			$("#relationToRoleMessageBlock").css("display", 'table');
			$("#relationToRoleMessageBlock").css("width", "0px");
			document.getElementById("relationToRoleSuccessmsg").innerHTML = getUiProps().MSG0036;
			$("#roleBoxDropDown").val(getUiProps().MSG0225);
			$("#btnAssignRelationToRole").attr('disabled', 'disabled');
			$("#btnAssignRelationToRole").addClass('assignBtnDisabled');
			objCommon.centerAlignRibbonMessage("#relationToRoleMessageBlock");
			objCommon.autoHideAssignRibbonMessage("relationToRoleMessageBlock");
		}
	}
	removeSpinner("modalSpinnerRelationMappingLink");
};

/**
 *  The purpose of this function is to bind role box drop down.
 */
relationToRoleMapping.prototype.bindRoleBoxDropDown = function() {
	var shorterRoleName = null; 
	var shorterBoxName = null;
	var objRelationToRoleMapping = new relationToRoleMapping();
	var mainBoxValue = getUiProps().MSG0039;
	objRelationToRoleMapping.refreshDropDown();
	var jsonString = objRelationToRoleMapping.getAllRoleBoxPair();
	var select = document.getElementById("roleBoxDropDown");
	for (var count = 0; count < jsonString.length; count++) {
		var option = document.createElement("option");
		var objRole = jsonString[count];
		option.id = objRole.__metadata.etag;
		var uri = objRole._Box.__deferred.uri;
		var searchBoxNameString = uri.search("_Box.Name");
		var searchBoxString = uri.search("/_Box");
		var boxName = uri.substring(searchBoxNameString + 10, searchBoxString - 1);
		boxName = boxName.replace(/'/g, " ");
		shorterRoleName = objCommon.getShorterName(objRole.Name, 8);//objCommon.getShorterEntityName(objRole.Name);
		shorterBoxName = objCommon.getShorterName(boxName, 8);//objCommon.getShorterEntityName(boxName);
		option.text = shorterRoleName + objCommon.startBracket + shorterBoxName + objCommon.endBracket;
		option.value = objRole.Name +objCommon.startBracket + boxName + objCommon.endBracket;
		option.title = objRole.Name + objCommon.startBracket + boxName + objCommon.endBracket;
		if (boxName == "null") {
			option.text = shorterRoleName + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
			option.value = objRole.Name + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
			option.title = objRole.Name + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
		}
		select.appendChild(option);
	}
};

/**
 * The purpose of this function is to retrieve all the role box pair against a
 * selected cell.
 */
relationToRoleMapping.prototype.getAllRoleBoxPair = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var count = retrieveRoleRecordCount();
	var uri = objRoleManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	/*var json = objRoleManager.retrieve("");
	var jsonString = json.rawData;
	jsonString = sortByKey(jsonString, '__published');*/
	return json;
};

/**
 * The purpose of this function is to get selected role and box pair from the
 * drop down.
 */
relationToRoleMapping.prototype.getSelectedRoleBoxPair = function() {
	var roleBoxPair = false;
	var dropDownID = document.getElementById("roleBoxDropDown");
	if (dropDownID.selectedIndex > 0) {
		var selectedRole = dropDownID.value;
		if (selectedRole != null) {
			roleBoxPair = selectedRole.split(objCommon.startBracket);
		}
	}
	return roleBoxPair;
};

/**
 * The purpose of this function is to refresh the drop down.
 */
relationToRoleMapping.prototype.refreshDropDown = function() {
	var select = document.getElementById("roleBoxDropDown");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0225;
	select.insertBefore(newOption, select.options[-1]);
};

/**
 *  The purpose of this function is to reload the content after successful
 * mapping.
 */
relationToRoleMapping.prototype.reloadPanel = function() {
	addSuccessClass('#relationToRoleMessageIcon');
	inlineMessageBlock(188,'#relationToRoleMessageBlock');
	$("#relationToRoleMessageBlock").css("display", 'table');
	$("#relationToRoleMessageBlock").css("width", "0px");
	document.getElementById("relationToRoleSuccessmsg").innerHTML = getUiProps().MSG0044; 
	$("#roleBoxDropDown").val(getUiProps().MSG0225);
	$("#btnAssignRelationToRole").attr('disabled', 'disabled');
	$("#btnAssignRelationToRole").addClass('assignBtnDisabled');
	objCommon.centerAlignRibbonMessage("#relationToRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("relationToRoleMessageBlock");
};

/**
 *  The purpose of this function is to maintain the slight color
 * differences in alternate rows.
 */
relationToRoleMapping.prototype.alternateRowColor = function () {
	$(".mainTable tr:odd").css("background-color", "#F4F4F4");
	$(".selectProfileRow").css("background-color", "#dfdfdf");
};

/**
 * The purpose of this function is to select all checkboxes on click of header checkbox.
 */
relationToRoleMapping.prototype.checkAll = function(cBox){
	var buttonId = '#btnDeleteRelationToRoleMapping';
	//objCommon.checkBoxSelect(document.getElementById("checkAll"), buttonId);
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxRelationRoleAssign', 49, document.getElementById("checkAllRelationRoleAssign"));
	objCommon.showSelectedRow(document.getElementById("checkAllRelationRoleAssign"),"row","rowidRelationRoleLink");
};

/**
 * The purpose of this function is to create data table.
 * @returns {String}
 */
relationToRoleMapping.prototype.createTable = function() {
	$('#assignEntityGridTbody').empty();
	$('#checkAllRelationRoleAssign').attr('checked', false);
	$("#btnDeleteRelationToRoleMapping").attr('disabled', true);
	$("#btnDeleteRelationToRoleMapping").removeClass('deleteIconEnabled');
	$("#btnDeleteRelationToRoleMapping").addClass('deleteIconDisabled');
	totalRecordsize =  uRelationToRoleMapping.retrieveLinkedRoleCount();
	if (totalRecordsize == 0) {
		var emptyMessage = getUiProps().MSG0241;
		objCommon.displayEmptyMessageInAssignGrid(emptyMessage, "assignRelationTab", "checkAllRelationRoleAssign");
		if (sessionStorage.selectedLanguage == 'ja') {
			$('.accountEmptyTableMessageWidth').css('width', '250px');
		}
	} else {
		$('#checkAllRelationRoleAssign').removeAttr("disabled");
		document.getElementById("dvemptyAssignTableMessage").style.display = "none";
		var recordSize = 0;
		var json = uRelationToRoleMapping.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		uRelationToRoleMapping.createChunkedRelationToRoleMappingTable(json, recordSize);
		var tableID = $('#mainRelationRoleLinkTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, uRelationToRoleMapping, json, uRelationToRoleMapping.createChunkedRelationToRoleMappingTable,
				"assignRelationTab");
		objCommon.checkCellContainerVisibility();
	}	
};

/**
 * The purpose of this function is to create mapping table in chunked on basis of
 * json data and record size.
 * @param json
 * @param recordSize
 */
relationToRoleMapping.prototype.createChunkedRelationToRoleMappingTable = function(json, recordSize) {
	$('#checkAllRelationRoleAssign').attr('checked', false);
	objCommon.disableButton('#btnDeleteRelationToRoleMapping');
	var dynamicRelationRoleLinkTable = "";
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS + recordSize) < (jsonLength) ? (objCommon.MAXROWS + recordSize)
			: jsonLength;
	var totalRecordsize = jsonLength;
	var relationRoleLinkCount = 0;
	for ( var count = recordSize; count < maxLimit; count++) {
	var obj = json[count];
	var roleName = obj["Name"];
	var boxName = obj["_Box.Name"];
	var etag = obj.__metadata.etag;
	if (boxName == null) {
	boxName = getUiProps().MSG0039;
	trimmedBoxName = getUiProps().MSG0039;
	}
	dynamicRelationRoleLinkTable += '<tr class="dynamicRelationToRoleMappingRow" name="allrows" id="rowidRelationRoleLink'+relationRoleLinkCount+'" onclick="objCommon.rowSelect(this,'+ "'rowidRelationRoleLink'" +','+ "'chkBoxRelationRoleAssign'"+','+ "'row'" +','+ "'btnDeleteRelationToRoleMapping'" +','+ "'checkAllRelationRoleAssign'" +','+ relationRoleLinkCount +',' + totalRecordsize +  ',' + "''" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainRelationRoleLinkTable'" + ');">';
	dynamicRelationRoleLinkTable = uRelationToRoleMapping.createRowsForRoleBoxMappedToRelation(dynamicRelationRoleLinkTable, roleName, boxName, count, relationRoleLinkCount,etag);
	relationRoleLinkCount++;
	}
	$("#mainRelationRoleLinkTable tbody").html(dynamicRelationRoleLinkTable);
	if (jsonLength > 0) {
		$("#mainRelationRoleLinkTable thead tr").addClass('mainTableHeaderRow');
		$("#mainRelationRoleLinkTable tbody").addClass('mainTableTbody');
	}
	setTimeout(function() {
		uRelationToRoleMapping.applyScrollCssOnRelationRoleLinkGrid();
	}, 300);
};

/**
 * The purpose of this function is to create rows for role and box
 * mapped to a relation .
 */
relationToRoleMapping.prototype.createRowsForRoleBoxMappedToRelation = function (dynamicTable, roleName, boxName, count, relationRoleLinkCount,etag) {
	var val = roleName + objCommon.startBracket + boxName + objCommon.endBracket;
	dynamicTable += '<td style="width:1%"><input id = "txtRelationToRoleMappingEtagId'+relationRoleLinkCount+'" value='+etag+' type = "hidden" /><input title="'+relationRoleLinkCount+'" id="chkBoxRelationRoleAssign' + relationRoleLinkCount
				+ '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'
				+ val + '""/><label for="chkBoxRelationRoleAssign' + relationRoleLinkCount + '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += "<td name = 'acc' style='max-width: 400px;width:49%'><div class = 'mainTableEllipsis'><label title='"+roleName+"' class='cursorPointer'>"
				+ roleName + "</label></div></td>";
	dynamicTable += "<td name = 'acc' style='max-width: 400px;width:50%'><div class = 'mainTableEllipsis'><label title='"+boxName+"' class='cursorPointer'>" + boxName + "</label></div></td>";
	dynamicTable += "</tr>";
	return dynamicTable;
};

/**
 * The purpose of this function is to refresh table.
 */
relationToRoleMapping.prototype.refreshTable = function() {
	$(".dynamicRoleBoxRow").remove();
	$(".pagination").remove();
};

/**
 *  The purpose of this function is to load the elements and values when the page
 * is loaded.
 */
relationToRoleMapping.prototype.loadRelationToRoleMappingPage = function () {
	var objRelationToRoleMapping = new relationToRoleMapping();
	if(sessionStorage.tabName == "Relation"){
		//objRelationToRoleMapping.bindRoleBoxDropDown();
		objRelationToRoleMapping.createTable();
	}
	$("#btnAssignRelationToRole").click(function() {
		objRelationToRoleMapping.mapRelationToRole();
	});
	
	//add listener to delete link button
	/*$("#btnDeleteRelationToRoleMapping").click(function() {
		uRelationToRoleMapping.openRelationPopUpWindow('#multipleDeleteRelationToRoleDialogBox','#multipleDeleteRelationToRoleModalWindow');
	});*/
};

$(function() {
	if(sessionStorage.tabName == "Relation"){
		uRelationToRoleMapping.bindRoleBoxDropDown();
	}
	uRelationToRoleMapping.loadRelationToRoleMappingPage();
	objCommon.sortByDateHoverEffect();
	setDynamicAssignGridHeight();
	objCommon.assignBackBtnHoverEffect();
	objCommon.setDynamicAssignEntityMaxwidth();
	$(window).resize(function () {
		objCommon.setDynamicAssignEntityMaxwidth();
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
});

/********* End - Mapping Feature *********/

/********* Start - Delete Feature *********/

/**
 * The purpose of this function is to display pop up control for delete Relation.
 */
relationToRoleMapping.prototype.deleteRelation = function (relationName, boxName){
	sessionStorage.mappingBoxName = boxName;
	sessionStorage.mappingRoleName = relationName;
	uRelationToRoleMapping.openRelationPopUpWindow('#singleDeleteDialogBox', '#singleDeleteModalWindow');
};

/**
 * The purpose of the following method is to delete single Relation.
 */
relationToRoleMapping.prototype.deleteSingleRelation=function(isSingleDelete,count) {
	showSpinner("modalSpinnerRelationMappingLink");
	var relationName = sessionStorage.relationName;
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	var mappingBoxName = sessionStorage.mappingBoxName;
	var mappingRoleName =sessionStorage.mappingRoleName;
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objLinkManager = new _pc.LinkManager(accessor);
	var key="(Name='"+relationName+"'";
	if (boxName !== undefined && boxName !== null && boxName !== mainBoxValue) {
		key+=",_Box.Name='" + boxName + "'";
	}
	key+=")";
	if(mappingBoxName==mainBoxValue){
		mappingBoxName = 'null';
	}
	var response = objLinkManager.delLink(null, 'Relation',
			'Role',key, mappingBoxName, mappingRoleName);
	if(isSingleDelete){
		uRelationToRoleMapping.displayResponseOnRibbon('#singleDeleteModalWindow',
				response.resolvedValue.status, '/templates/relationToRoleMapping.html');
	}
	else {
		if (response.resolvedValue.status == 204) {
			uRelationToRoleMapping.sbSuccessfulRelation += mappingRoleName + ",";
		} else if (response.resolvedValue.status == 409) {
			arrDeletedConflictCount.push(count);
			uRelationToRoleMapping.sbConflictRelation += mappingRoleName + ",";
			uRelationToRoleMapping.sbConflictRelation.replace(/, $/, "");
		}
	}
	removeSpinner("modalSpinnerRelationMappingLink");
};

/**
 * The purpose of this method is to display successful messages for Edit and
 * single delete operation.(for response code : 204) It is accepting id of the
 * modal window as an input parameter.
 * @param id
 * @param statusCode
 * @param url
 */
relationToRoleMapping.prototype.displayResponseOnRibbon = function(id, statusCode, url) {
	if (statusCode == 409) {
		$('#singleDeleteModalWindow, .window').hide();
		addErrorClass();
		inlineMessageBlock();
		document.getElementById("successmsg").innerHTML = getUiProps().MSG0192;
		objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
		objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
	} else if (statusCode == 204) {
		$("#mainContent").load(contextRoot + url, function () {
			if (navigator.userAgent.indexOf("Firefox") != -1) {
				var objRelationToExternalCellMapping = new relationToExternalCellMapping();
				objRelationToExternalCellMapping.loadRelationToExtCellMappingPage();
				var objRelationToRoleMapping = new relationToRoleMapping();
				objRelationToRoleMapping.loadRelationToRoleMappingPage();
			}
		});
		addSuccessClass();
		inlineMessageBlock();
		if (id === '#singleDeleteModalWindow') {
			$('#singleDeleteModalWindow, .window').hide();
			var displayLabel = sessionStorage.mappingRoleName;
			var shorterDisplayLabel = objCommon.getShorterEntityName(displayLabel);
			document.getElementById("successmsg").innerHTML = "Role assignation "
				+ shorterDisplayLabel + " is deleted successfully!";
			document.getElementById("successmsg").title = displayLabel;
		}
		objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
		objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
	}
};

/**
 * The purpose of this method is to close Relation Delete popup.
 */
relationToRoleMapping.prototype.closeRelation = function() {
	//$('#singleDeleteModalWindow, .window').hide();
	$('#multipleDeleteRelationToRoleModalWindow, .window').hide();
};

/**
 * The purpose of this method is to open pop up window.
 * 
 * @param idDialogBox
 * @param idModalWindow
 */
relationToRoleMapping.prototype.openRelationPopUpWindow = function(idDialogBox, idModalWindow) {
	if (idDialogBox === '#multipleDeleteRelationToRoleDialogBox') {
		var response = objCommon.getMultipleSelections('mainRelationRoleLinkTable','input','case');
		sessionStorage.selLinks = response;
	}
	$(idModalWindow).fadeIn(1000);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$('#btnCancelRelationToRole').focus();
};

/**
 * The purpose of the following method is to delete multiple Links.
 */
relationToRoleMapping.prototype.deleteMultipleLinks = function() {
	showSpinner("modalSpinnerRelationMappingLink");
	var assignations = sessionStorage.selLinks;
	var arrAssignations = assignations.split(',');
	var etagIDOfPreviousRecord = "txtRelationToRoleMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#mainRelationRoleLinkTable');
	var idCheckAllChkBox = "#checkAllRelationRoleAssign";
	var mappingType = "RelationToRole";
	var type = "assignRelationTab";

	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon
				.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,
						"#chkBoxRelationRoleAssign0", "#assignEntityGridTbody");
	}

	for ( var count = 0; count < arrAssignations.length; count++) {
		var val = arrAssignations[count].split(objCommon.startBracket);
		var role = val[0].trim();
		var box = val[1];
		box = objCommon.getBoxSubstring(box);
		sessionStorage.mappingRoleName = role;
		sessionStorage.mappingBoxName = box;
		uRelationToRoleMapping.deleteSingleRelation(false, count);
	}
	uRelationToRoleMapping.displayMultipleLinkConflictMessage();
	removeSpinner("modalSpinnerRelationMappingLink");
	var recordCount = uRelationToRoleMapping.retrieveLinkedRoleCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			mappingType, recordCount, uRelationToRoleMapping, isDeleted);

};

/**
 * The purpose of this method is to show pertinent messages when multiple accounts are deleted. 
 */
relationToRoleMapping.prototype.displayMultipleLinkConflictMessage = function() {
	var conflictRelnDeleteLength = 0;
	var successfulRelnDeleteLength = 0;
	uRelationToRoleMapping.sbSuccessfulRelation = uRelationToRoleMapping.sbSuccessfulRelation.substring(0, uRelationToRoleMapping.sbSuccessfulRelation.length - 1);
	uRelationToRoleMapping.sbConflictRelation = uRelationToRoleMapping.sbConflictRelation.substring(0, uRelationToRoleMapping.sbConflictRelation.length - 1);
	$('#multipleDeleteModalWindow, .window').hide();
	conflictRelnDeleteLength = entityCount(uRelationToRoleMapping.sbConflictRelation);
	successfulRelnDeleteLength = entityCount(uRelationToRoleMapping.sbSuccessfulRelation);
	
	addSuccessClass('#relationToRoleMessageIcon');
	$('#relationToRoleMessageBlock').css("display", 'table');
	//inlineMessageBlock(275,'#relationToRoleMessageBlock');
	document.getElementById("relationToRoleSuccessmsg").innerHTML = successfulRelnDeleteLength + getUiProps().MSG0100;
	isDeleted = true;
	//uRelationToRoleMapping.createTable();
	$("#roleBoxDropDown").val(getUiProps().MSG0225);
	$("#btnAssignRelationToRole").attr('disabled', 'disabled');
	$("#btnAssignRelationToRole").addClass('assignBtnDisabled');
	$('#multipleDeleteRelationToRoleModalWindow, .window').hide();
	objCommon.centerAlignRibbonMessage("#relationToRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("relationToRoleMessageBlock");
	
	uRelationToRoleMapping.sbSuccessfulRelation='';
	uRelationToRoleMapping.sbConflictRelation='';
};
relationToRoleMapping.prototype.sbSuccessfulRelation = ''; 
relationToRoleMapping.prototype.sbConflictRelation = '';
/********* End - Delete Feature *********/

/**
 * The purpose of this function is to apply dynamic css on grid in
 * presence of scrollbar.
 */
relationToRoleMapping.prototype.applyScrollCssOnRelationRoleLinkGrid = function() {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRelationRoleLinkTable td:eq(1)").css("width", '49.1%');
	}
};

relationToRoleMapping.prototype.enableDisableAssignRelationToRoleBtn = function() {
	var selectedRoleName = uRelationToRoleMapping.getSelectedRoleBoxPair();
	 $("#btnAssignRelationToRole").attr('disabled', 'disabled');
	 $("#btnAssignRelationToRole").addClass('assignBtnDisabled');
	if (selectedRoleName != false) {
		 $("#btnAssignRelationToRole").removeAttr("disabled");
		 $("#btnAssignRelationToRole").removeClass('assignBtnDisabled');
	}
};

/**
 * Following method fetches all relation to role data.
 * @returns json
 */
relationToRoleMapping.prototype.retrieveAllRelationToRoleJsonData = function () {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelationManager = new _pc.RelationManager(accessor);
	var totalRecordCount = uRelationToRoleMapping.retrieveLinkedRoleCount(); 
	var uri = objRelationManager.getUrl();
	var key="";
	var relationName = sessionStorage.relationName;
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	key = "(Name='"+relationName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+relationName+"',_Box.Name='"+boxName+"')";
	}
	uri += key + "/"+"_Role";
	uri = uri + "?$orderby=__updated desc &$top="
			+ totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};