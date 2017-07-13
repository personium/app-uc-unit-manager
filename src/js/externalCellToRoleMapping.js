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
function externalCellToRoleMapping() { 
	
}
var objExternalCellToRoleMapping = new externalCellToRoleMapping();
externalCellToRoleMapping.prototype.baseUrl = getClientStore().baseURL;
externalCellToRoleMapping.prototype.context = null;
externalCellToRoleMapping.prototype.SOURCE="ExtCell";
externalCellToRoleMapping.prototype.DESTINATION = "Role";
externalCellToRoleMapping.prototype.roleBoxCombination = "";
externalCellToRoleMapping.prototype.sbSuccessful = '';

var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

/**
 * The purpose of this method is to retrieve total count of linked role 
 * @returns
 */
externalCellToRoleMapping.prototype.retrieveLinkedRoleCount = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	var extCellUrl = sessionStorage.extCellURL;
	var key="";
	key = "('"+encodeURIComponent(extCellUrl)+"')";
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
externalCellToRoleMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	var extCellUrl = sessionStorage.extCellURL;
	var key="";
	key = "('"+encodeURIComponent(extCellUrl)+"')";
	uri += key + "/"+"_Role";
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this method is to refresh (Role Box) drop down.
 */
externalCellToRoleMapping.prototype.refreshDropDown = function() { 
var select = document.getElementById("ddlRoleBox");
select.options.length = 0;
var newOption = document.createElement('option');
newOption.value = 0;
newOption.innerHTML = getUiProps().MSG0225;
select.insertBefore(newOption, select.options[-1]);
};


/**
* The purpose of this method is to establish a link between an Account and a role.
* 
*/
externalCellToRoleMapping.prototype.getRoleBox = function() { 
externalCellToRoleMapping.prototype.cellName = sessionStorage.selectedcell;	
var objExternalCellToRoleMapping =  new externalCellToRoleMapping();
var accessor = objCommon.initializeAccessor(objExternalCellToRoleMapping.baseUrl, objExternalCellToRoleMapping.cellName, "", "");
var objRoleManager = new _pc.RoleManager(accessor);
var count = retrieveRoleRecordCount();
var uri = objRoleManager.getUrl();
uri = uri + "?$orderby=__updated desc &$top=" + count;
var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
var response = restAdapter.get(uri, "application/json");
var json = response.bodyAsJson().d.results;
/*var json = objRoleManager.retrieve("");
var jsonString = json.rawData;
jsonString = objCommon.sortByKey(jsonString, '__published');*/
return json;
};


/**
 * The purpose of this method is to populate Role Box drop down with data.
 */
externalCellToRoleMapping.prototype.bindRoleBoxDropDown = function() { 
var objExternalCellToRoleMapping =  new externalCellToRoleMapping();
objExternalCellToRoleMapping.refreshDropDown();
var mainBox = getUiProps().MSG0039;
var jsonString = objExternalCellToRoleMapping.getRoleBox();
var select = document.getElementById("ddlRoleBox");
for ( var count = 0; count < jsonString.length; count++) {
var option = document.createElement("option");
var objRole = jsonString[count];
option.id = objRole.__metadata.etag;
var boxName = objRole['_Box.Name'];
option.innerHTML = objRole.Name + objCommon.startBracket + boxName + objCommon.endBracket;
if (boxName == null) {
option.innerHTML = objRole.Name + objCommon.startBracket + mainBox + objCommon.endBracket;
}
option.title = option.innerHTML;
option.value = option.innerHTML;
var tooltipRoleBoxName = objCommon.getShorterName(option.innerHTML, 17);//objCommon.getShorterEntityName(option.innerHTML);
option.text = tooltipRoleBoxName ;
select.appendChild(option);
}
};


/**
* The purpose of this method is to fetch the values of selected role and box .
* 
*/
externalCellToRoleMapping.prototype.getSelectedRole = function() { 
var arrRole = false;
if (document.getElementById("ddlRoleBox").selectedIndex > 0 ) {
var selectedRole = document.getElementById("ddlRoleBox").value;
arrRole = selectedRole.split(objCommon.startBracket);
}
return arrRole;
};

/**
 * The purpose of this method is to get accessor values. 
 * @returns
 */
externalCellToRoleMapping.prototype.getAccessor  = function() {
var objExternalCellToRoleMapping =  new externalCellToRoleMapping();
externalCellToRoleMapping.prototype.cellName = sessionStorage.selectedcell;	
var accessor = objCommon.initializeAccessor(objExternalCellToRoleMapping.baseUrl, objExternalCellToRoleMapping.cellName, "", "");
return accessor;
};

/**
 * The purpose of this method is to create an object of jAbstractODataContext.
 * This method is accepting accessor as an input parameter.
 */
externalCellToRoleMapping.prototype.initializeAbstractDataContext = function() { 
var objExternalCellToRoleMapping =  new externalCellToRoleMapping();
var accessor = objExternalCellToRoleMapping.getAccessor();
var objAbstractDataContext =  new _pc.AbstractODataContext(accessor);
return objAbstractDataContext;
};

/**
* The purpose of this method is to create an object of jLinkManager.
* 
**/
externalCellToRoleMapping.prototype.initializeLinkManager = function(context) {
var objExternalCellToRoleMapping =  new externalCellToRoleMapping();
var accessor = objExternalCellToRoleMapping.getAccessor();
var objLinkMgr = new _pc.LinkManager(accessor, context);
return objLinkMgr;
};
/**
* The purpose of this method is to check if records pertaining to a account are there are not.
*
*/
externalCellToRoleMapping.prototype.isRecordExist = function(recordSize) { 
if (recordSize > 0) {
document.getElementById("dvExtCellemptyTableMessage").style.display = "none";
}
else {
//If record size is empty then a div displaying No roles mapped yet.
document.getElementById("dvExtCellemptyTableMessage").style.display = "block";
}
};

externalCellToRoleMapping.prototype.checkAll = function(cBox) {
var buttonId = '#btnDeleteExtCellToRoleMapping';
//objCommon.checkBoxSelect(cBox, buttonId);
objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxExtCellRoleAssign', 49, document.getElementById("checkAllExtCellRoleAssign"));
objCommon.showSelectedRow(document.getElementById("checkAllExtCellRoleAssign"),"row","rowidExtCellRoleLink");
};

/**
 * The purpose of this method is to close the pop up window.
 * @returns {Boolean}
 */
externalCellToRoleMapping.prototype.closePopup = function () {
$('#multipleDeleteExtCellToRoleModalWindow').hide();
return false;
};

/**The purpose of this method is to create rows.
 * 
 */
externalCellToRoleMapping.prototype.createRows = function(dynamicTable, count,
roleName, boxName, strBoxName, strRoleName, trimmedBoxName,
trimmedRoleName,recordSize, extCellRoleLinkCount,etag) {
var roleBoxName = strBoxName + objCommon.startBracket + strRoleName + objCommon.endBracket;
dynamicTable += '<td style="width:1%"><input id = "txtExtCellToRoleMappingEtagId'+extCellRoleLinkCount+'" value='+etag+' type = "hidden" /><input title="'+extCellRoleLinkCount+'" id="chkBoxExtCellRoleAssign' + extCellRoleLinkCount
			+ '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'
			+ roleBoxName + '""/><label for="chkBoxExtCellRoleAssign' + extCellRoleLinkCount + '" class="customChkbox checkBoxLabel"></label></td>';
dynamicTable += "<td name = 'acc' style='max-width: 400px;width:49%'><div class = 'mainTableEllipsis'><label title='"+roleName+"' class='cursorPointer'>"
			+ roleName + "</label></div></td>";
dynamicTable += "<td name= 'acc' style='max-width: 400px;width:50%'><div class = 'mainTableEllipsis'><label title='"+boxName+"' class='cursorPointer'>" + boxName + "</label></div></td>";
dynamicTable += "</tr>";
return dynamicTable;
};

/**
 * The purpose of this method is to display total role count.
 * @param recordSize
 */
externalCellToRoleMapping.prototype.setTotalRoleCount = function(recordSize) { 
document.getElementById("dvExternalCellMappingCount").innerHTML = "";
document.getElementById("dvExternalCellMappingCount").innerHTML =  recordSize + " Role(s) Assigned ";
}; 

/**
 * The purpose of this method is to create data table.
 * @returns {String}
 */
externalCellToRoleMapping.prototype.createTable = function() {
	$('#assignEntityGridTbody').empty();
	$('#checkAllExtCellRoleAssign').attr('checked', false);
	$("#btnDeleteExtCellToRoleMapping").attr('disabled', true);
	$("#btnDeleteExtCellToRoleMapping").removeClass('deleteIconEnabled');
	$("#btnDeleteExtCellToRoleMapping").addClass('deleteIconDisabled');
	var totalRecordsize =  objExternalCellToRoleMapping.retrieveLinkedRoleCount();
	if (totalRecordsize == 0) {
		var emptyMessage = getUiProps().MSG0241;
		objCommon.displayEmptyMessageInAssignGrid(emptyMessage, "assignExtCellTab", "checkAllExtCellRoleAssign");
		if(sessionStorage.selectedLanguage === "jp"){
			$('.accountEmptyTableMessageWidth').css('width', '235px');
		}
	} else {
		$('#checkAllExtCellRoleAssign').removeAttr("disabled");
		document.getElementById("dvemptyAssignTableMessage").style.display = "none";
		var recordSize = 0;
		var json = objExternalCellToRoleMapping.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		objExternalCellToRoleMapping.createChunkedExtCellToRoleMappingTable(json, recordSize);
		var tableID = $('#mainExternalCellRoleLinkTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, objExternalCellToRoleMapping, json, objExternalCellToRoleMapping.createChunkedExtCellToRoleMappingTable,
				"assignExtCellTab");
		objCommon.checkCellContainerVisibility();
	}	
};

externalCellToRoleMapping.prototype.createChunkedExtCellToRoleMappingTable = function(json, recordSize) {
	$('#checkAllExtCellRoleAssign').attr('checked', false);
	objCommon.disableButton('#btnDeleteExtCellToRoleMapping');
	var dynamicExtCellRoleLinkTable = "";
	//refreshRoleToAccountMappingTable();
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
	var extCellRoleLinkCount = 0;
	for ( var count = recordSize; count < maxLimit; count++) {
	var obj = json[count];
	var roleName = obj["Name"];
	var boxName = obj["_Box.Name"];
	var etag = obj.__metadata.etag;
	var trimmedBoxName = objCommon.getShorterEntityName(boxName);
	var trimmedRoleName = objCommon.getShorterEntityName(roleName);
	var strBoxName = "'" + boxName + "'";
	var strRoleName = "'" + roleName + "'";
	if (boxName == null) {
	boxName = getUiProps().MSG0039;
	trimmedBoxName = getUiProps().MSG0039;
	}
	dynamicExtCellRoleLinkTable += '<tr class="dynamicExtCellToRoleMappingRow" name="allrows" id="rowidExtCellRoleLink'+extCellRoleLinkCount+'" onclick="objCommon.rowSelect(this,'+ "'rowidExtCellRoleLink'" +','+ "'chkBoxExtCellRoleAssign'"+','+ "'row'" +','+ "'btnDeleteExtCellToRoleMapping'" +','+ "'checkAllExtCellRoleAssign'" +','+ extCellRoleLinkCount +',' + totalRecordsize +  ',' + "''" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainExternalCellRoleLinkTable'" + ');">';
	dynamicExtCellRoleLinkTable = objExternalCellToRoleMapping.createRows(
			dynamicExtCellRoleLinkTable, count, roleName, boxName, strBoxName,
	strRoleName, trimmedBoxName, trimmedRoleName,recordSize, extCellRoleLinkCount,etag);
	extCellRoleLinkCount++;
	}
	$("#mainExternalCellRoleLinkTable tbody").html(dynamicExtCellRoleLinkTable);
	if (jsonLength > 0) {
		$("#mainExternalCellRoleLinkTable thead tr").addClass('mainTableHeaderRow');
		$("#mainExternalCellRoleLinkTable tbody").addClass('mainTableTbody');
	}
	setTimeout(function() {
		objExternalCellToRoleMapping.applyScrollCssOnExtCellRoleLinkGrid();
	}, 300);
};

/**
 * The purpose of following method is to assign role to an external cell.
 */
externalCellToRoleMapping.prototype.assignRole = function() { 
showSpinner("modalSpinnerExternalRelationRoleMapping");
var objExternalCellToRoleMapping = new externalCellToRoleMapping();
var arrRole = objExternalCellToRoleMapping.getSelectedRole();
var role = arrRole[0].split(' ').join('');
var box = arrRole[1].split(' ').join('');
box = objCommon.getBoxSubstring(box);
var externalCellURI = encodeURIComponent(sessionStorage.externalCellURI);
var context = objExternalCellToRoleMapping.initializeAbstractDataContext();
var objLinkManager = objExternalCellToRoleMapping.initializeLinkManager(context);
var mainBoxValue = getUiProps().MSG0039;
if (box == mainBoxValue) {
box = null;
}
	var response = objLinkManager.establishLink(context,
			externalCellToRoleMapping.prototype.SOURCE,
			externalCellToRoleMapping.prototype.DESTINATION, externalCellURI,
			box, role);
	// 204 is returned when the link has been successfully created.
	if (response.getStatusCode() == 204) {
		// Loading grid with updated values.
		objExternalCellToRoleMapping.createTable();
		addSuccessClass('#extCellToRoleMessageIcon');
		inlineMessageBlock(225,'#extCellToRoleMessageBlock');
		document.getElementById("extCellToRoleSuccessmsg").innerHTML = getUiProps().MSG0044; 
		objCommon.resetAssignationDropDown("#ddlRoleBox", "#btnAssignExtCellToRole", getUiProps().MSG0225);
		objCommon.centerAlignRibbonMessage("#extCellToRoleMessageBlock");
		objCommon.autoHideAssignRibbonMessage("extCellToRoleMessageBlock");
	} else if (response.getStatusCode() == 409) {
		addErrorClass('#extCellToRoleMessageIcon');
		inlineMessageBlock(205,'#extCellToRoleMessageBlock');
		document.getElementById("extCellToRoleSuccessmsg").innerHTML = getUiProps().MSG0036;
		objCommon.resetAssignationDropDown("#ddlRoleBox", "#btnAssignExtCellToRole", getUiProps().MSG0225);
		objCommon.centerAlignRibbonMessage("#extCellToRoleMessageBlock");
		objCommon.autoHideAssignRibbonMessage("extCellToRoleMessageBlock");
	}
	removeSpinner("modalSpinnerExternalRelationRoleMapping");
};

// START - Delete Functionality.

/**
* The purpose of this function is to get role box information.
*/
externalCellToRoleMapping.prototype.getMultipleRoleNames = function() { 
var elementsLength = document.ftable.elements.length;
var count = 0;
var roleName = null;
for (count = 0; count < elementsLength; count++) {
if (document.ftable.elements[count].name == "case") {
if (document.ftable.elements[count].checked) {
var formRoleName = document.ftable.elements[count].value;
if (roleName == null) {
roleName = formRoleName;
} else {
roleName = roleName + ',' + formRoleName;
			}
		}
	}
}
sessionStorage.ExternalCellMappedRoles = roleName;

};
/**
 * The purpose of the following method is to open pop up window.
 * @param idDialogBox
 * @param idModalWindow
 */
externalCellToRoleMapping.prototype.openPopUpWindow = function(idDialogBox, idModalWindow) {  
	var response = objCommon.getMultipleSelections('mainExternalCellRoleLinkTable','input','case');
	sessionStorage.ExternalCellMappedRoles = response;
	//objExternalCellToRoleMapping.getMultipleRoleNames();
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$("#btnCancelExCellToRoleAssign").focus();
};

/**
 * The purpose of the following method is to fetch Box name.
 * @param roleName
 * @returns
 */
externalCellToRoleMapping.prototype.getBoxNameForDelete = function(roleName) {  
var arrRoleBoxNames = roleName.split(objCommon.startBracket);
var boxName = arrRoleBoxNames[0];
return boxName; 
};

/**
 * The purpose of the following method is to fetch role name.
 * @param roleName
 * @returns
 */
externalCellToRoleMapping.prototype.getRoleNameForDelete = function(roleName) { 
var arrRoleBoxNames = roleName.split(objCommon.startBracket);
var roleName = arrRoleBoxNames[1];
roleName = objCommon.getBoxSubstring(roleName);
return roleName; 
};

/**
 * The purpose of the following method is to delete a role name.
 * @param roleName
 */
externalCellToRoleMapping.prototype.deleteMapping = function(roleName) {
	var box = objExternalCellToRoleMapping.getBoxNameForDelete(roleName);
	box = box.replace(/'/g, " ").split(' ').join('');
	var mainBoxValue = getUiProps().MSG0039;
	if (box == mainBoxValue) {
		box = 'null';
	}
	var role = objExternalCellToRoleMapping.getRoleNameForDelete(roleName);
	role = role.replace(/'/g, " ").split(' ').join('');
	var externalCellURI = encodeURIComponent(sessionStorage.externalCellURI);
	var context = objExternalCellToRoleMapping.initializeAbstractDataContext();
	var objLinkManager = objExternalCellToRoleMapping
			.initializeLinkManager(context);
	var response = objLinkManager.delLink(context,
			externalCellToRoleMapping.prototype.SOURCE,
			externalCellToRoleMapping.prototype.DESTINATION, externalCellURI,
			box, role);
	if (response.resolvedValue.status == 204) {
		isDeleted = true;
		externalCellToRoleMapping.prototype.roleBoxCombination = role
				+ objCommon.startBracket + box;
		externalCellToRoleMapping.prototype.sbSuccessful += externalCellToRoleMapping.prototype.roleBoxCombination
				+ ",";
	}
};

/**
 * The purpose of this method is to delete multiple mappings.
 */
externalCellToRoleMapping.prototype.deleteMultipleMappings = function() {
	externalCellToRoleMapping.prototype.sbSuccessful = '';
	showSpinner("modalSpinnerExternalRelationRoleMapping");
	var successfulRoleBoxLength = 0;
	var roleBoxNames = sessionStorage.ExternalCellMappedRoles;
	var arrRoleBoxNames = roleBoxNames.split(',');
	
	var etagIDOfPreviousRecord = "txtExtCellToRoleMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#mainExternalCellRoleLinkTable');
	var idCheckAllChkBox = "#checkAllExtCellRoleAssign";
	var mappingType = "ExtCelltoRole";
	var type = "assignExtCellTab";
	
	if (!$("#checkAllExtCellRoleAssign").is(':checked')) { 
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBoxExtCellRoleAssign0","#assignEntityGridTbody");
	}
	
	for ( var count = 0; count < arrRoleBoxNames.length; count++) {
		objExternalCellToRoleMapping.deleteMapping(arrRoleBoxNames[count]);
	}
	successfulRoleBoxLength = entityCount(externalCellToRoleMapping.prototype.sbSuccessful);
	var successMessage = successfulRoleBoxLength - 1 + getUiProps().MSG0100;
	addSuccessClass('#extCellToRoleMessageIcon');
	$('#extCellToRoleMessageBlock').css("display", 'table');
	//inlineMessageBlock(276,'#extCellToRoleMessageBlock');
	document.getElementById("extCellToRoleSuccessmsg").innerHTML = successMessage;
	//objExternalCellToRoleMapping.createTable();
	$("#ddlRoleBox").val(getUiProps().MSG0225);
	$("#btnAssignExtCellToRole").attr('disabled', 'disabled');
	$("#btnAssignExtCellToRole").addClass('assignBtnDisabled');
	$('#multipleDeleteExtCellToRoleModalWindow').hide(0);
	objCommon.centerAlignRibbonMessage("#extCellToRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("extCellToRoleMessageBlock");
	removeSpinner("modalSpinnerExternalRelationRoleMapping");
	 var recordCount = objExternalCellToRoleMapping.retrieveLinkedRoleCount();
		objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			mappingType, recordCount, objExternalCellToRoleMapping, isDeleted);
};

// END - Delete Functionality.
/**
 * The purpose of this method is to load the elements and values when the page is loaded for the first time.
 */
externalCellToRoleMapping.prototype.loadExtCellToRolesMappingPage = function() {
	var objExternalCellToRoleMapping = new externalCellToRoleMapping();
	if(sessionStorage.tabName == "External Cell"){
		//objExternalCellToRoleMapping.bindRoleBoxDropDown();
		objExternalCellToRoleMapping.createTable();
	}
	/*$("#btnAssignExtCellToRole").click(function() {
	if (objCommon.validateDropDownValue("ddlRoleBox","#asideRoleBoxErrorMessage",getUiProps().MSG0056)) {
	objExternalCellToRoleMapping.assignRole();
	}
	});*/
};

/**
 * The purpose of this function is to apply dynamic css on grid in
 * presence of scrollbar.
 */
externalCellToRoleMapping.prototype.applyScrollCssOnExtCellRoleLinkGrid = function() {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainExternalCellRoleLinkTable td:eq(1)").css("width", '49.1%');
	}
};

externalCellToRoleMapping.prototype.enableDisableAssignExtCellToRoleBtn = function() {
	var selectedRoleName = objExternalCellToRoleMapping.getSelectedRole("ddlRoleBox");
	 $("#btnAssignExtCellToRole").attr('disabled', 'disabled');
	 $("#btnAssignExtCellToRole").addClass('assignBtnDisabled');
	if (selectedRoleName != false) {
		 $("#btnAssignExtCellToRole").removeAttr("disabled");
		 $("#btnAssignExtCellToRole").removeClass('assignBtnDisabled');
	}
};

/**
 * Following method fetches all the externalcell to role data.
 * @returns json
 */
externalCellToRoleMapping.prototype.retrieveAllExtCellToRoleJsonData = function () {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	var extCellUrl = sessionStorage.extCellURL;
	var totalRecordCount = objExternalCellToRoleMapping.retrieveLinkedRoleCount();
	var key="";
	key = "('"+encodeURIComponent(extCellUrl)+"')";
	uri += key + "/"+"_Role";
	uri = uri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};


$(document).ready(function() {
	var objExternalCellToRoleMapping = new externalCellToRoleMapping();
	objExternalCellToRoleMapping.bindRoleBoxDropDown();
	objExternalCellToRoleMapping.loadExtCellToRolesMappingPage();
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