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
function externalRoleToRoleMapping() { 
}

var uExternalRoleToRoleMapping =  new externalRoleToRoleMapping();
externalRoleToRoleMapping.prototype.SOURCE="Role";
externalRoleToRoleMapping.prototype.DESTINATION = "ExtRole";
externalRoleToRoleMapping.prototype.roleCount = parseInt(sessionStorage.ExternalRoleToRoleCount);
externalRoleToRoleMapping.prototype.bindRoleBoxDropdown = function () {
	uExternalRoleToRoleMapping.bindRoleBoxDropDown();
};
var sbSuccessfulExtRoleToRoleCount = 0;

var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;


/**
 * The purpose of this method is to get access values. 
 * @returns
 */
externalRoleToRoleMapping.prototype.getAccessor  = function() {
	var cellName = sessionStorage.selectedcell;	
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	return accessor;
};

externalRoleToRoleMapping.prototype.refreshRoleBoxDropDown  = function() {
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
externalRoleToRoleMapping.prototype.getRoleBox  = function() {
	var accessor = uExternalRoleToRoleMapping.getAccessor();
	var objRoleManager = new _pc.RoleManager(accessor);
	var count = retrieveRoleRecordCount();
	//var objAccountMgr = createAccountManager();
	var uri = objRoleManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
	
	/*var json = objRoleManager.retrieve("");
	var jsonString = json.rawData;
	jsonString = sortByKey(jsonString, '__published');
	return jsonString;*/
};

externalRoleToRoleMapping.prototype.bindRoleBoxDropDown  = function() { 
	uExternalRoleToRoleMapping.refreshRoleBoxDropDown();
	var jsonString = uExternalRoleToRoleMapping.getRoleBox();
	var select = document.getElementById("ddlRoleBox");
	var mainBox = getUiProps().MSG0039;
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
		var tooltipRoleBoxName = objCommon.getShorterName(option.innerHTML,17);
		option.text = tooltipRoleBoxName ;
		select.appendChild(option);
	}
};

/**
 * The purpose of this method is to fetch the values of selected role and box .
 * 
 */
externalRoleToRoleMapping.prototype.getSelectedRole = function() { 
	var arrRole = false;
	if (document.getElementById("ddlRoleBox").selectedIndex > 0 ) {
		var selectedRole = document.getElementById("ddlRoleBox").value;
		arrRole = selectedRole.split(objCommon.startBracket);
	}
	return arrRole;
};


/**
 * The purpose of this method is to create an object of jAbstractODataContext.
 * This method is accepting accessor as an input parameter.
 */
externalRoleToRoleMapping.prototype.initializeAbstractDataContext = function() { 
	var accessor = uExternalRoleToRoleMapping.getAccessor();
	var objAbstractDataContext =  new _pc.AbstractODataContext(accessor);
	return objAbstractDataContext;
};

/**
 * The purpose of this method is to create an object of jLinkManager.
 * 
 **/
externalRoleToRoleMapping.prototype.initializeLinkManager = function(context) {
	var accessor = uExternalRoleToRoleMapping.getAccessor();
	var objLinkMgr = new _pc.LinkManager(accessor, context);
	return objLinkMgr;
};

/**
 * The purpose of following method is to assign role to an external cell.
 */
externalRoleToRoleMapping.prototype.assignRole = function() { 
	showSpinner("modalSpinnerExtRoleToRoleMap");
	var arrRole = uExternalRoleToRoleMapping.getSelectedRole();
	var role = arrRole[0].split(' ').join('');
	var box = arrRole[1].split(' ').join('');
	box = objCommon.getBoxSubstring(box);
	var multiKey = null;
	var selRelationName = sessionStorage.ExtRoleRelationName ;
	var selBoxName = sessionStorage.ExtRoleBoxName;
	var mainBoxValue = getUiProps().MSG0039;
	if (selBoxName == mainBoxValue) {
		selBoxName =null;
	}
	var selExtRoleURL = sessionStorage.ExtRoleName;
	var context = uExternalRoleToRoleMapping.initializeAbstractDataContext();
	var objLinkManager = uExternalRoleToRoleMapping.initializeLinkManager(context);
	multiKey = "(Name='"+ role+ "')";
	if (box!= mainBoxValue) {
		multiKey = "(Name='"+ role+ "',_Box.Name='"	+ box+ "')";
	}
	if (box == mainBoxValue) {
		box = 'null';
	}
	
	try {
		response = objLinkManager.establishLink(context,
				uExternalRoleToRoleMapping.SOURCE,
				uExternalRoleToRoleMapping.DESTINATION, multiKey,
				selRelationName+","+selBoxName, selExtRoleURL, true);
		if (response.getStatusCode() == 204) {
//			Loading grid with updated values.
			//uExternalRoleToRoleMapping.bindRoleBoxDropdown();
			uExternalRoleToRoleMapping.createTable();
			addSuccessClass('#extRoleToRoleMessageIcon');
			inlineMessageBlock(190,'#extRoleToRoleMessageBlock');
			//$("#extRoleToRoleMessageBlock").css("margin-left", "16%");
			document.getElementById("extRoleToRoleSuccessmsg").innerHTML = getUiProps().MSG0044; 
			objCommon.resetAssignationDropDown("#ddlRoleBox", "#btnMapToExtenalRole", getUiProps().MSG0225);
			objCommon.centerAlignRibbonMessage("#extRoleToRoleMessageBlock");
			objCommon.autoHideAssignRibbonMessage("extRoleToRoleMessageBlock");
		} else if (response.getStatusCode() == 409) { 
			addErrorClass('#extRoleToRoleMessageIcon');
			inlineMessageBlock(176,'#extRoleToRoleMessageBlock');
			//$("#extRoleToRoleMessageBlock").css("margin-left", "16%");
			document.getElementById("extRoleToRoleSuccessmsg").innerHTML = getUiProps().MSG0036; 
			objCommon.resetAssignationDropDown("#ddlRoleBox", "#btnMapToExtenalRole", getUiProps().MSG0225);
			objCommon.centerAlignRibbonMessage("#extRoleToRoleMessageBlock");
			objCommon.autoHideAssignRibbonMessage("extRoleToRoleMessageBlock");
		}
	} 
	catch (exception) {
		addErrorClass('#extRoleToRoleMessageIcon');
		inlineMessageBlock(353,'#extRoleToRoleMessageBlock');
		//$("#extRoleToRoleMessageBlock").css("margin-left", "10%");
		document.getElementById("extRoleToRoleSuccessmsg").innerHTML = getUiProps().MSG0194;
		objCommon.centerAlignRibbonMessage("#extRoleToRoleMessageBlock");
		objCommon.autoHideAssignRibbonMessage("extRoleToRoleMessageBlock");
	}
	
	removeSpinner("modalSpinnerExtRoleToRoleMap");
};

externalRoleToRoleMapping.prototype.showDetails = function() { 
	var dvExtRoleName = document.getElementById("extRoleName");
	var dvExtRelationName = document.getElementById("extRelationName");
	var dvExtBoxName = document.getElementById("extBoxName");
	var dvExtUpdatedDate = document.getElementById("extUpdatedDate");
	var extUpdatedDate = objCommon.getShorterEntityName(sessionStorage.ExtRoleUpdatedDate);
	$("#extRoleName").text("External Role : "+sessionStorage.ExtRoleName);
	dvExtRoleName.title= sessionStorage.ExtRoleName;
	$("#extRelationName").text("Relation: "+sessionStorage.ExtRoleRelationName);
	dvExtRelationName.title= sessionStorage.ExtRoleRelationName;
	$("#extBoxName").text("Box Name : "+sessionStorage.ExtRoleBoxName);
	dvExtBoxName.title= sessionStorage.ExtRoleBoxName;
	$("#extUpdatedDate").text("Date : "+extUpdatedDate);
	dvExtUpdatedDate.title= sessionStorage.ExtRoleUpdatedDate;
};

/**
 * The purpose of this method is to display total role count.
 * @param recordSize
 */
externalRoleToRoleMapping.prototype.setTotalRoleCount = function(recordSize) { 
	document.getElementById("dvRolesMapped").innerHTML = "";
	document.getElementById("dvRolesMapped").innerHTML =  recordSize + " Role(s) Assigned ";
}; 

/**
 * Following method fetch ext role count.
 * @returns count
 */
externalRoleToRoleMapping.prototype.retrieveLinkedExtRoleCount = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleManager = new _pc.ExtRoleManager(accessor);
	var uri = objExtRoleManager.getUrl();
	var encodedExternalRoleURI = encodeURIComponent(sessionStorage.ExtRoleName);
	relationName = "'"+sessionStorage.ExtRoleRelationName+"'";
	encodedExternalRoleURI = "'"+encodedExternalRoleURI+"'";
	relationBoxName = "'"+sessionStorage.ExtRoleBoxName+"'";
	var key = "(ExtRole="+encodedExternalRoleURI+",_Relation.Name="+relationName+",_Relation._Box.Name="+relationBoxName+")";
	if (sessionStorage.ExtRoleBoxName == getUiProps().MSG0039) {
		key = "(ExtRole="+encodedExternalRoleURI+",_Relation.Name="+relationName+")";
	}
	uri += key + "/"+"_Role";
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = 0;
	if (json != undefined) {
		count = json.__count;
	}
	return count;
};

/**
 * The purpose of this function is to retrieve chunked data from API.
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
externalRoleToRoleMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleManager = new _pc.ExtRoleManager(accessor);
	var uri = objExtRoleManager.getUrl();
	var encodedExternalRoleURI = encodeURIComponent(sessionStorage.ExtRoleName);
	relationName = "'"+sessionStorage.ExtRoleRelationName+"'";
	encodedExternalRoleURI = "'"+encodedExternalRoleURI+"'";
	relationBoxName = "'"+sessionStorage.ExtRoleBoxName+"'";
	var key = "(ExtRole="+encodedExternalRoleURI+",_Relation.Name="+relationName+",_Relation._Box.Name="+relationBoxName+")";
	if (sessionStorage.ExtRoleBoxName == getUiProps().MSG0039) {
		key = "(ExtRole="+encodedExternalRoleURI+",_Relation.Name="+relationName+")";
	}
	uri += key + "/"+"_Role";
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to apply dynamic css on grid in
 * presence of scrollbar.
 */
externalRoleToRoleMapping.prototype.applyScrollCssOnAccountRoleLinkGrid = function() {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#extRoleToRoleMappingTable td:eq(1)").css("width", '49.1%');
	}
};

/**
 * Following method populates table with data.
 * @param json
 * @param recordSize
 */
externalRoleToRoleMapping.prototype.createChunkedExtRoleToRoleMappingTable = function(json, recordSize) {
	$('#chkSelectAllExtRoleMappingRecords').attr('checked', false);
	objCommon.disableButton('#btnDeleteAssignExtRoleToRole');
	var dynamicExtRoleLinkTable = "";
	if (typeof json === "string") {
		json = JSON.parse(json);
		if (typeof json === "string") {
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS + recordSize) < (jsonLength)
			? (objCommon.MAXROWS + recordSize)
			: jsonLength;
	var totalRecordsize = jsonLength;
	var extRoleLinkCount = 0;
	//dynamicExtRoleLinkTable = createHeaders(dynamicExtRoleLinkTable);
	for ( var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var roleName = obj["Name"];
		var boxName = obj["_Box.Name"];
		var etag = obj.__metadata.etag;
		if (boxName == null) {
			boxName = getUiProps().MSG0039;
			trimmedBoxName = getUiProps().MSG0039;
		}
		dynamicExtRoleLinkTable += '<tr class="dynamicExtCellToRoleMappingRow" name="allrows" id="rowidExtRoleLink'
				+ extRoleLinkCount
				+ '" onclick="objCommon.rowSelect(this,'
				+ "'rowidExtRoleLink'"
				+ ','
				+ "'chkExtRoleToRoleAssign'"
				+ ','
				+ "'row'"
				+ ','
				+ "'btnDeleteAssignExtRoleToRole'"
				+ ','
				+ "'chkSelectAllExtRoleMappingRecords'"
				+ ','
				+ extRoleLinkCount
				+ ','
				+ totalRecordsize
				+ ','
				+ "''"
				+ ','
				+ "''"
				+ ','
				+ "''"
				+ ','
				+ "''"
				+ ','
				+ "'extRoleToRoleMappingTable'" + ');">';
		dynamicExtRoleLinkTable = uExternalRoleToRoleMapping.createRows(
				dynamicExtRoleLinkTable, count, roleName, boxName,
								recordSize, extRoleLinkCount,etag);
		extRoleLinkCount++;
	} 
	$("#extRoleToRoleMappingTable tbody").html(dynamicExtRoleLinkTable);
	if (jsonLength > 0) {
		$("#extRoleToRoleMappingTable thead tr").addClass('mainTableHeaderRow');
		$("#extRoleToRoleMappingTable tbody").addClass('mainTableTbody');
	}
	setTimeout(function() {
		uExternalRoleToRoleMapping.applyScrollCssOnAccountRoleLinkGrid();	
		}, 300);
	
};

/**
 * The purpose of the following method is to create table for displaying Role Box Information.
 * @returns
 */
externalRoleToRoleMapping.prototype.createTable = function() {
	$("#assignEntityGridTbody").empty();
	$('#chkSelectAllExtRoleMappingRecords').attr('checked', false);
	objCommon.disableButton("#btnDeleteAssignExtRoleToRole");
	var totalRecordsize = uExternalRoleToRoleMapping.retrieveLinkedExtRoleCount();
		if (totalRecordsize == 0) {
			objCommon.displayEmptyMessageInAssignGrid(getUiProps().MSG0241, "assignExtRoleTab", "chkSelectAllExtRoleMappingRecords");
		} else {
			$("#chkSelectAllExtRoleMappingRecords").removeAttr("disabled");
			document.getElementById("dvemptyAssignTableMessage").style.display = "none";
			var recordSize = 0;
			var json = uExternalRoleToRoleMapping.retrieveChunkedData(objCommon.minRecordInterval,
					objCommon.noOfRecordsToBeFetched);
			uExternalRoleToRoleMapping.createChunkedExtRoleToRoleMappingTable(json,recordSize);
			var tableID = $('#extRoleToRoleMappingTable');
			objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
					tableID, uExternalRoleToRoleMapping, json,uExternalRoleToRoleMapping.createChunkedExtRoleToRoleMappingTable,
					"assignExtRoleTab");
			objCommon.checkCellContainerVisibility();
	}	
};

/**
 * The purpose of this method is to create headers.
 * @param dynamicTable
 * @returns
 */
externalRoleToRoleMapping.prototype.createHeaders = function(dynamicTable) {
	//Headers Start. 
	dynamicTable += "<tr>";
	dynamicTable += "<th class='col1'><input type='checkbox'  id='chkSelectall' onclick='uExternalRoleToRoleMapping.checkAllSelect(this)' class='checkBox cursorHand'/>";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col2'>Role Name";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col3'>Box Name";
	dynamicTable += "</th>";
	dynamicTable += "<th  class='col4'>Updated";
	dynamicTable += "</th>";
	dynamicTable += "</tr>"; 
	//Headers End.
	return dynamicTable;
};

/**
 * Following method is for creating rows of the table.
 */
externalRoleToRoleMapping.prototype.createRows = function (dynamicTable, count, roleName, boxName,  recordSize,
		extRoleLinkCount,etag) {
	var roleBoxName = boxName + objCommon.startBracket + roleName + objCommon.endBracket;
	dynamicTable += '<td style="width:1%"><input id = "txtExtRoleToRoleMappingEtagId'+extRoleLinkCount+'" value='+etag+' type = "hidden" /><input title="'+extRoleLinkCount+'" id="chkExtRoleToRoleAssign'
			+ extRoleLinkCount
			+ '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'
			+ roleBoxName + '""/><label for="chkExtRoleToRoleAssign'
			+ extRoleLinkCount
			+ '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += "<td title="
			+ roleName
			+ " name = 'acc' style='max-width: 285px;width:49%' id='roleName_"+extRoleLinkCount+"'><div class = 'mainTableEllipsis'>"
			+ roleName + "</div></td>";
	dynamicTable += "<td title="
			+ boxName
			+ " style='max-width: 285px;width:50%' id='boxName_"+extRoleLinkCount+"'><div class = 'mainTableEllipsis'>"
			+ boxName + "</div></td>";
	dynamicTable += "</tr>";

	return dynamicTable;
};


/**
 * The purpose of this function is to return seleted row value for delete operation.
 * @returns {Array}
 */
externalRoleToRoleMapping.prototype.getMultipleExtRoleNames = function() { 
	var noOfExtRoles = $("#extRoleToRoleMappingTable tr").length - 1;
	var extRoleRelBoxArray = [];
	for (var index = 0; index < noOfExtRoles; index++) {
		var body = {};
		if($("#chkExtRoleToRoleAssign"+index).is(":checked")){
			body["RoleName"] = document.getElementById("roleName_" + index).title;
			body["BoxName"] = document.getElementById("boxName_" + index).title;
			extRoleRelBoxArray.push(body);	
		}
	}
	return extRoleRelBoxArray;
};

/**
 * The purpose of this fucntion is perform checkbox functionality for all(parent) checkbox selection.
 * @param cBox
 */
externalRoleToRoleMapping.prototype.checkAllSelect = function (cBox){
	var buttonId = '#btnDeleteAssignExtRoleToRole';
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkExtRoleToRoleAssign', 49, document.getElementById("chkSelectAllExtRoleMappingRecords"));
	objCommon.showSelectedRow(document.getElementById("chkSelectAllExtRoleMappingRecords"), "row",
			"rowidExtRoleLink");
};

/**
 * The purpose of this function is to delete mapping on the basis of external role.
 * @param extRoleName external role name
 * @param extRelationName external relation name
 * @param extBoxName external box name
 * @param roleName role name
 * @param boxName box name
 */
externalRoleToRoleMapping.prototype.deleteMapping = function (extRoleName, extRelationName, extBoxName, roleName, boxName,count) {
	var key = "(ExtRole='" + encodeURIComponent(extRoleName) + "',_Relation.Name='" + extRelationName + "',_Relation._Box.Name='" + extBoxName + "')";
	if (extBoxName == getUiProps().MSG0293) {
		key = "(ExtRole='" + encodeURIComponent(extRoleName) + "',_Relation.Name='" + extRelationName + "')";
	}
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var objLinkManager = new _pc.LinkManager(accessor);
	var response = objLinkManager.delLink(context, "ExtRole", "Role", key, boxName, roleName);
	if (response.resolvedValue.status == 204) {
		isDeleted = true;
		sbSuccessfulExtRoleToRoleCount ++;	
	} else {
		arrDeletedConflictCount.push(count);
	} 
};

/**
 * The purpose of this function to perform multiple delete functionality.
 */
externalRoleToRoleMapping.prototype.deleteMultipleMapping = function(){
	showSpinner("modalSpinnerExtRoleToRoleMap");	
	var extRoleName = sessionStorage.ExtRoleName;
	var extRelationName = sessionStorage.ExtRoleRelationName;
	var extBoxName = sessionStorage.ExtRoleBoxName;
	var paramArray = uExternalRoleToRoleMapping.getMultipleExtRoleNames();
	var noOfRecords = paramArray.length;
	var mainBoxValue = getUiProps().MSG0039;
	
	var etagIDOfPreviousRecord = "txtExtRoleToRoleMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#extRoleToRoleMappingTable');
	var idCheckAllChkBox = "#chkSelectAllExtRoleMappingRecords";
	var mappingType = "ExtRoleToRole";
	var type = "assignExtRoleTab";
	
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkExtRoleToRoleAssign0","#assignEntityGridTbody");
	}
	for(var index = 0; index < noOfRecords; index++){
		var roleName = paramArray[index]["RoleName"];
		var boxName = paramArray[index]["BoxName"];
		if (boxName == mainBoxValue) {
			boxName = 'null';
		}
		uExternalRoleToRoleMapping.deleteMapping(extRoleName, extRelationName, extBoxName, roleName, boxName);
	}
	uExternalRoleToRoleMapping.displayMappingMessage();
	removeSpinner("modalSpinnerExtRoleToRoleMap");
	 var recordCount = uExternalRoleToRoleMapping.retrieveLinkedExtRoleCount();
		objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			mappingType, recordCount, uExternalRoleToRoleMapping, isDeleted);
};

/**
 * The purpose of this function is to display ribbon message for
 * mapping delete functionality on the basis of response
 */
externalRoleToRoleMapping.prototype.displayMappingMessage = function () {
	var successfulRoleBoxLength = 0;
	$('#extRoleToRoleDeleteModalWindow, .window').hide();
	successfulRoleBoxLength = sbSuccessfulExtRoleToRoleCount;
	if(successfulRoleBoxLength > 0) {
		addSuccessClass('#extRoleToRoleMessageIcon');
		$("#extRoleToRoleMessageBlock").css("display", 'table');
		document.getElementById("extRoleToRoleSuccessmsg").innerHTML = successfulRoleBoxLength+" "+getUiProps().MSG0344;
		objCommon.resetAssignationDropDown("#ddlRoleBox", "#btnMapToExtenalRole", getUiProps().MSG0225);
		objCommon.centerAlignRibbonMessage("#extRoleToRoleMessageBlock");
		objCommon.autoHideAssignRibbonMessage("extRoleToRoleMessageBlock");
		//uExternalRoleToRoleMapping.createTable();
	} 
	sbSuccessfulExtRoleToRoleCount = 0;
};

externalRoleToRoleMapping.prototype.enableDisableAssignBtn = function () {
	var selectedRoleName = uExternalRoleToRoleMapping.getSelectedRole();
	 $("#btnMapToExtenalRole").attr('disabled', 'disabled');
	 $("#btnMapToExtenalRole").addClass('assignBtnDisabled');
	if (selectedRoleName != false) {
		 $("#btnMapToExtenalRole").removeAttr("disabled");
		 $("#btnMapToExtenalRole").removeClass('assignBtnDisabled');
	}
};

/**
 * The purpose of the following method is to fetch all the ext role mapping data.
 * @returns json dataset.
 */
externalRoleToRoleMapping.prototype.retrieveAllExtRoleToRoleJsonData = function () {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleManager = new _pc.ExtRoleManager(accessor);
	var uri = objExtRoleManager.getUrl();
	var encodedExternalRoleURI = encodeURIComponent(sessionStorage.ExtRoleName);
	var totalRecordCount = uExternalRoleToRoleMapping.retrieveLinkedExtRoleCount();
	relationName = "'"+sessionStorage.ExtRoleRelationName+"'";
	encodedExternalRoleURI = "'"+encodedExternalRoleURI+"'";
	relationBoxName = "'"+sessionStorage.ExtRoleBoxName+"'";
	var key = "(ExtRole="+encodedExternalRoleURI+",_Relation.Name="+relationName+",_Relation._Box.Name="+relationBoxName+")";
	if (sessionStorage.ExtRoleBoxName == getUiProps().MSG0039) {
		key = "(ExtRole="+encodedExternalRoleURI+",_Relation.Name="+relationName+")";
	}
	uri += key + "/"+"_Role";
	uri = uri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

$(document).ready(function() {
	setDynamicAssignGridHeight();
	objCommon.setDynamicAssignEntityMaxwidth();
	$(window).resize(function() {
		objCommon.setDynamicAssignEntityMaxwidth();
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
	$("#lblExtRoleName").html(sessionStorage.ExtRoleName);
	$("#lblExtRoleName").attr('title', sessionStorage.ExtRoleName);
	$("#lblExtRoleRelationName").html(sessionStorage.ExtRoleRelationName);
	$("#lblExtRoleBoxName").html(sessionStorage.ExtRoleBoxName);
	$("#txtAssignExtRoleBoxName").attr("placeholder", getUiProps().MSG0242);
	uExternalRole.initEditExternalRole();
	uExternalRoleToRoleMapping.bindRoleBoxDropdown();
	uExternalRoleToRoleMapping.createTable();
	objCommon.assignBackBtnHoverEffect();
	objCommon.sortByDateHoverEffect();
	$("#btnMapToExtenalRole").click(function() {
		if (objCommon.validateDropDownValue("ddlRoleBox","#selectRoleBoxDropDownErrorMsg",getUiProps().MSG0056)) {
			uExternalRoleToRoleMapping.assignRole();
		}
	});
	/*uExternalRoleToRoleMapping.bindRoleBoxDropdown();
	uExternalRoleToRoleMapping.showDetails();
	uExternalRoleToRoleMapping.createTable();
	$("#btnMapToExtenalRole").click(function() {
		if (objCommon.validateDropDownValue("ddlRoleBox","#selectRoleBoxDropDownErrorMsg",getUiProps().MSG0056)) {
			uExternalRoleToRoleMapping.assignRole();
		}
	});
	$("#btnDeleteMapping").click(function() {
		openCreateEntityModal('#extRoleToRoleDeleteModalWindow', '#extRoleToRoleDeleteDialogBox');
	});
	$("#btnExtRoleToRoleDelete").click(function() {
		uExternalRoleToRoleMapping.deleteMultipleMapping();
	});*/
});

