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
function roleToExtRoleMapping() {
}

roleToExtRoleMapping.prototype.roleName = sessionStorage.roleName;
roleToExtRoleMapping.prototype.boxName = sessionStorage.boxName;
roleToExtRoleMapping.prototype.updatedOn = sessionStorage.updatedOn;
roleToExtRoleMapping.prototype.cellName = sessionStorage.selectedcell;
roleToExtRoleMapping.prototype.mappingCount = 0;
roleToExtRoleMapping.prototype.SOURCE = "Role";
roleToExtRoleMapping.prototype.DESTINATION = "ExtRole";
roleToExtRoleMapping.prototype.isAvailable = false;
roleToExtRoleMapping.prototype.sbSuccessfulRelation = '';
roleToExtRoleMapping.prototype.sbConflictRelation = '';
roleToExtRoleMapping.prototype.relationMappedConflictMessage = getUiProps().MSG0036;
roleToExtRoleMapping.prototype.relationMappedSuccessMessage = getUiProps().MSG0113;
roleToExtRoleMapping.prototype.ddValidationMessage = getUiProps().MSG0109;
var sbSuccessfulDeleteCount = 0;
var sbConflictDeleteCount = 0;
var objRoleToExtRoleMapping = new roleToExtRoleMapping();
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

/**
 * The purpose of this function is to retrieve chunked data from API.
 * 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
roleToExtRoleMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var uri = objRoleManager.getUrl();
	var mainBoxValue = getUiProps().MSG0039;
	var key="";
	key = "(Name='"+roleName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+roleName+"',_Box.Name='"+boxName+"')";
	}
	
	uri += key + "/"+"_ExtRole";
	uri = uri + "?$orderby=__updated desc&$skip=" + lowerLimit + "&$top="
			+ upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to retrieve count of assigned external
 * roles to role.
 */
roleToExtRoleMapping.prototype.retrieveRoleExtRoleAssignRecordCount = function () {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var uri = objRoleManager.getUrl();
	var mainBoxValue = getUiProps().MSG0039;
	var key="";
	key = "(Name='"+roleName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+roleName+"',_Box.Name='"+boxName+"')";
	}
	
	uri += key + "/"+"_ExtRole";
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * The purpose of this function is to reload the top most panel.
 */
roleToExtRoleMapping.prototype.reloadPanel = function() {
	addSuccessClass('#roleToExtRoleMessageIcon');
	//inlineMessageBlock(235,'#roleToExtRoleMessageBlock');
	$("#roleToExtRoleMessageBlock").css("display", 'table');
	document.getElementById("roleToExtRoleSuccessmsg").innerHTML = uRoleExtRoleMapping.relationMappedSuccessMessage; 
	objCommon.resetAssignationDropDown("#ExtRoleDropDown", "#assignExtRoleBtn", getUiProps().MSG0108);
	objCommon.centerAlignRibbonMessage("#roleToExtRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("roleToExtRoleMessageBlock");
};

roleToExtRoleMapping.prototype.setDomElemValue = function(key, value) {
	document.getElementById(key).innerHTML = value;
};

/**
 * The purpose of this function is to establish a link between a role and an
 * external role.
 */
roleToExtRoleMapping.prototype.linkRoleAndERole = function() {
	var multiKey = null;
	var mainBoxValue = getUiProps().MSG0039;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var objLinkManager = objCommon.initializeLinkManager(accessor,
			context);
	
	if (uRoleExtRoleMapping.getSelectedExtRole()== false) {
		/*uRoleExtRoleMapping.setDomElemValue("selectExtRoleDDMsg",
				uRoleExtRoleMapping.ddValidationMessage);
		return false;*/
	} else {
		//uRoleExtRoleMapping.setDomElemValue("selectExtRoleDDMsg", "");
	}
	var selExtRole = uRoleExtRoleMapping.getSelectedExtRole().split(objCommon.startBracket);
	if(selExtRole != null){//&& selExtRole.length == 3
		var selExtRoleURL = selExtRole[0].split(' ').join('');
		selExtRoleURL = selExtRoleURL.trim();
		//var selBoxName = selExtRole[2].split(' ').join('');
		var selRelationBoxName = selExtRole[1].split(' ').join('');
		selRelationBoxName = objCommon.getBoxSubstring(selRelationBoxName);
		var test = selRelationBoxName.split("|");
		selRelationName = test[0];
		selBoxName = test[1];
		multiKey = "(Name='"+ uRoleExtRoleMapping.roleName+ "')";
		if (sessionStorage.boxName!= null
				&& sessionStorage.boxName!= mainBoxValue) {
			multiKey = "(Name='"+ sessionStorage.roleName+ "',_Box.Name='"
					+ sessionStorage.boxName+ "')";
		}
		var response = objLinkManager.establishLink(context,
				uRoleExtRoleMapping.SOURCE,
				uRoleExtRoleMapping.DESTINATION, multiKey,
				selRelationName+","+selBoxName, selExtRoleURL, true);
		
		if (response.getStatusCode() == 204) {
			uRoleExtRoleMapping.reloadPanel();
			uRoleExtRoleMapping.createTable();
		}else if(response.getStatusCode() == 409){
			uRoleExtRoleMapping.isAvailable = false;
			addErrorClass('#roleToExtRoleMessageIcon');
			//inlineMessageBlock(176,'#roleToExtRoleMessageBlock');
			$("#roleToExtRoleMessageBlock").css("display", 'table');
			document.getElementById("roleToExtRoleSuccessmsg").innerHTML = uRoleExtRoleMapping.relationMappedConflictMessage; 
			objCommon.resetAssignationDropDown("#ExtRoleDropDown", "#assignExtRoleBtn", getUiProps().MSG0108);
			objCommon.centerAlignRibbonMessage("#roleToExtRoleMessageBlock");
			objCommon.autoHideAssignRibbonMessage("roleToExtRoleMessageBlock");
		} 
		else {
		}
	}
	if ($("#mainRoleExtRoleLinkTable input:checkbox:checked").length == 0) {
		objCommon.disableButton("#btnDeleteAssignRoleExtRole");
	}
	removeSpinner("modalSpinnerRoleERoleLink");
};

/**
 * The purpose of this function is to prevent drop down from loading values
 * again on page reload.
 */
roleToExtRoleMapping.prototype.refreshDropDown = function() {
	var select = document.getElementById("ExtRoleDropDown");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0108;
	select.insertBefore(newOption, select.options[-1]);
};

/**
 * The purpose of this function is to fetch the values of selected external
 * cell.
 */
roleToExtRoleMapping.prototype.getSelectedExtRole = function() {
	var selectedRelation = false;
	var dropDown = document.getElementById("ExtRoleDropDown");
	if(typeof dropDown != 'undefined' && dropDown!=null){
		if (dropDown.selectedIndex > 0) {
			selectedRelation = dropDown.options[dropDown.selectedIndex].title;
		}
	}else{
		//do nothing
	}
	return selectedRelation;
};

/**
 * The purpose of this function is to bind the relation drop down.
 */
roleToExtRoleMapping.prototype.bindExtRoleDropDown = function() {
	uRoleExtRoleMapping.refreshDropDown();
	var jsonString = uRoleExtRoleMapping.getExternalRoleList();
	var select = document.getElementById("ExtRoleDropDown");
	jsonString =  jsonString.split(",");
	var len = jsonString.length;
	for ( var count = 0; count< len; count++) {
		var option = document.createElement("option");
		if(jsonString[count].length  >  0){
		option.innerHTML = jsonString[count];
		option.title = jsonString[count];
		var tooltipExternalRoleName = objCommon.getShorterName(option.innerHTML, 19);
		option.text = tooltipExternalRoleName ;
		select.appendChild(option);
		}
	}
};

/**
 * The purpose of this function to get external role detail against selected
 * cell.
 */
roleToExtRoleMapping.prototype.getExternalRoleList = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRole = new _pc.ExtRoleManager(accessor);
	var objExternalRole = new externalRole();
	var extRoleCount = objExternalRole.retrieveRecordCount();
	var uri = objExtRole.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + extRoleCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	var response = "";
	if((typeof(json) !== undefined) && (json !== null) && (json.length > 0 )){
	var JSONstring = json;
	var sortJSONString = objCommon.sortByKey(JSONstring, '__updated');
	var recordSize = sortJSONString.length;
	var uExternalRole  = new externalRole();
	if (recordSize > 0) {
		var pipeSeparator = getUiProps().MSG0292;
		for (var count = 0; count < recordSize; count++) {
			var obj = sortJSONString[count];
			var uri = obj.__metadata.uri;
			var extRoleName = obj.ExtRole;
			var relationName = uExternalRole.getRelationNameFromURI(uri);
			var boxName = uExternalRole.getBoxNameFromURI(uri);
			if (boxName === 'null') {
				boxName = mainBoxValue;
			}
			response+=extRoleName+objCommon.startBracket+relationName+pipeSeparator+boxName+objCommon.endBracket;
			if(count<(recordSize-1)){
				response+=",";
			}
		}
	}
	}else{
		//empty or invalid response
	}
	return response;
};

/**
 * The purpose of this function is to create header for RoleRelationLinkTable
 * table.
 * 
 * @param dynamicTable
 */
roleToExtRoleMapping.prototype.createTableHeader = function(
		dynamicTable) {
	// Headers Start.
	dynamicTable += "<tr>";
	dynamicTable += "<th class='col1' width='20'><input type='checkbox'  id='checkAll' onclick='uRoleExtRoleMapping.checkAllSelect(this)' class='checkBox'/>";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col2' width='200'>External Role Name";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col3' width='200'>Relation Name";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col4' width='150'>Box Name";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col5' width='150'>Updated";
	// Headers End.
	return dynamicTable;
};

/**
 * The purpose of this function is to create row for Role External Role Link Table .
 */
roleToExtRoleMapping.prototype.createRowForRoleExtRoleLinkTable = function(dynamicRoleExtRoleLinkTable, count, externalRoleURL, relation,  box, roleExtRoleLinkCount,etag) {
	var pipeSeparator = getUiProps().MSG0292;
	var itemVal = externalRoleURL + objCommon.startBracket + relation + pipeSeparator +box + objCommon.endBracket;
	dynamicRoleExtRoleLinkTable += '<td style="width:2%;"><input id =  "txtRoleToExtRoleMappingEtagId'+roleExtRoleLinkCount+'" value='+etag+' type = "hidden" /><input title="'+roleExtRoleLinkCount+'" id="chkBoxRoleExtRoleAssign'+ roleExtRoleLinkCount + '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'+ itemVal + '"'+ '"/><label for="chkBoxRoleExtRoleAssign' + roleExtRoleLinkCount + '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicRoleExtRoleLinkTable += "<td id='tdExtrernalRoleURI_"+roleExtRoleLinkCount+"' style='max-width: 165px;width:48.99%;'><div class = 'mainTableEllipsis'><label title= '"+ externalRoleURL+ "' class='cursorPointer' id='lblExtrernalRoleURI_"+roleExtRoleLinkCount+"'>" + externalRoleURL + "</label></div></td>";
	dynamicRoleExtRoleLinkTable += "<td id='tdRelation_"+roleExtRoleLinkCount+"' style='max-width: 100px;width:25%;'><div class = 'mainTableEllipsis'><label title= '"+ relation+ "' class='cursorPointer' id='lblRelation_"+roleExtRoleLinkCount+"'>" + relation+ "</label></div></td>";
	dynamicRoleExtRoleLinkTable += "<td id='tdRelationBox_"+roleExtRoleLinkCount+"' style='max-width: 100px;width:25%;'><div class = 'mainTableEllipsis'><label title= '"+ box+ "' class='cursorPointer' id='lblRelationBox_"+roleExtRoleLinkCount+"'>" + box+ "</label></div></td>";
	dynamicRoleExtRoleLinkTable += "<td></td>";
	dynamicRoleExtRoleLinkTable += "</tr>";
	return dynamicRoleExtRoleLinkTable;
};

/**
 * The purpose of this function is to create tabular view of assigned
 * external roles page as per pagination.
 */
roleToExtRoleMapping.prototype.createRoleToExtRoleMappingTableChunked = function (json, recordSize) {
	$('#checkAllRoleExtRoleAssign').attr('checked', false);
	objCommon.disableButton('#btnDeleteAssignRoleExtRole');
	var dynamicRoleExtRoleLinkTable = "";
	var mainBoxValue = getUiProps().MSG0039;
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
	var roleExtRoleLinkCount = 0;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var externalRoleURL = obj["ExtRole"];
		var relation = obj["_Relation.Name"];
		var box = obj["_Relation._Box.Name"];
		var etag = obj.__metadata.etag;
		if (box === null) {
			box = mainBoxValue;
		}
		dynamicRoleExtRoleLinkTable += '<tr name="allrows" id="rowidRoleExtRoleLink'+ roleExtRoleLinkCount + '" onclick="objCommon.rowSelect(this,'+ "'rowidRoleExtRoleLink'" + ','+ "'chkBoxRoleExtRoleAssign'"+ ','+ "'row'"+ ',' + "'btnDeleteAssignRoleExtRole'"+ ','+ "'checkAllRoleExtRoleAssign'"+ ','+ roleExtRoleLinkCount + ','+ totalRecordsize +  ',' + "''" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainRoleExtRoleLinkTable'" + ');">';
		dynamicRoleExtRoleLinkTable = uRoleExtRoleMapping.createRowForRoleExtRoleLinkTable(dynamicRoleExtRoleLinkTable, count, externalRoleURL, relation,  box, roleExtRoleLinkCount,etag);
		roleExtRoleLinkCount++;
	}
	if (jsonLength > 0) {
		$("#mainRoleExtRoleLinkTable thead tr").addClass('mainTableHeaderRow');
		$("#mainRoleExtRoleLinkTable tbody").addClass('mainTableTbody');
	}
	$("#mainRoleExtRoleLinkTable tbody").html(dynamicRoleExtRoleLinkTable);
	setTimeout(function() {
		uRoleExtRoleMapping.applyScrollCssAssignRoleToExtRoleGrid();
	}, 300);
};


/**
 * The purpose of this function is to create dynamic table.
 */
roleToExtRoleMapping.prototype.createTable = function() {
	$("#assignEntityGridTbody").empty();
	$('#checkAllRoleExtRoleAssign').attr('checked', false);
	objCommon.disableButton("#btnDeleteAssignRoleExtRole");
	var totalRecordsize =  objRoleToExtRoleMapping.retrieveRoleExtRoleAssignRecordCount();
	if (totalRecordsize == 0) {
		objCommon.displayEmptyMessageInAssignGrid(getUiProps().MSG0244, "assignRoleTab", "checkAllRoleExtRoleAssign");
	} else {
		document.getElementById("dvemptyAssignTableMessage").style.display = "none";
		$("#checkAllRoleExtRoleAssign").removeAttr("disabled");
		var recordSize = 0;
		var json = objRoleToExtRoleMapping.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		objRoleToExtRoleMapping.createRoleToExtRoleMappingTableChunked(json, recordSize);
		var tableID = $('#mainRoleExtRoleLinkTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, objRoleToExtRoleMapping, json, objRoleToExtRoleMapping.createRoleToExtRoleMappingTableChunked,
				"assignRoleTab");
		objCommon.checkCellContainerVisibility();
	}
};

/**
 * The purpose of this method is to select all check box on click of header
 * check box.
 */
roleToExtRoleMapping.prototype.checkAllSelect = function(cBox) {
	var buttonId = '#btnDeleteAssignRoleExtRole';
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxRoleExtRoleAssign', 49, document.getElementById("checkAllRoleExtRoleAssign"));
	objCommon.showSelectedRow(document.getElementById("checkAllRoleExtRoleAssign"), "row",
			"rowidRoleExtRoleLink");
};

var uRoleExtRoleMapping = new roleToExtRoleMapping();

//DELETE MAPPING - Role and ExtRole. START

/**
 * This method is used to open up pop up window for delete.
 * @param idDialogBox
 * @param idModalWindow
 */
roleToExtRoleMapping.prototype.openPopUpWindow = function(idDialogBox, idModalWindow) {
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$("#btnCancelRoleToExtRoleAssign").focus();
};

/**
 * This method is used to delete role to external role mapping.
 */
roleToExtRoleMapping.prototype.deleteRoleToExtRoleMapping = function() { 
	var totalRecords = $("#mainRoleExtRoleLinkTable tr").length - 1;
	
	var etagIDOfPreviousRecord = "txtRoleToExtRoleMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#mainRoleExtRoleLinkTable');
	var idCheckAllChkBox = "#checkAllRoleExtRoleAssign";
	var mappingType = "RoleToExtRole";
	var type = "assignRoleTab";
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBoxRoleExtRoleAssign0","#assignEntityGridTbody");
	}
	for (var count = 0; count < totalRecords; count++) {
	if($("#chkBoxRoleExtRoleAssign"+count).is(":checked")){ 
		var extRoleName = document.getElementById("lblExtrernalRoleURI_" + count).title;
		var relationName = document.getElementById("lblRelation_" + count).title;
		var relationBoxName = document.getElementById("lblRelationBox_" + count).title;
		uRoleExtRoleMapping.deleteMapping(extRoleName, relationName, relationBoxName,count);
		}
	}
	removeSpinner("modalSpinnerExtRole");
	uRoleExtRoleMapping.displayStatusMessage();
	var recordCount = objRoleToExtRoleMapping.retrieveRoleExtRoleAssignRecordCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
	arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
	mappingType, recordCount, objRoleToExtRoleMapping, isDeleted);
};

/**
 * Performs deletion of role to extrole mapping.
 * @param extRoleName
 * @param relationName
 * @param relationBoxName
 * @returns
 */
roleToExtRoleMapping.prototype.deleteMapping = function(extRoleName, relationName, relationBoxName,count) {
	var source="ExtRole";
	var destination ="Role";
	var extRoleName = encodeURIComponent(extRoleName);
	var roleName = sessionStorage.roleName;
	var boxName = sessionStorage.boxName;
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objLinkManager = new _pc.LinkManager(accessor);
	var mainBoxValue = getUiProps().MSG0039;
	
	var context = objCommon.initializeAbstractDataContext(accessor);
	var key = "(ExtRole='" +extRoleName + "',_Relation.Name='" + relationName + "',_Relation._Box.Name='" + relationBoxName + "')";
	if (relationBoxName == mainBoxValue) {
		key = "(ExtRole='" + extRoleName + "',_Relation.Name='" + relationName + "')";
	}
	if(boxName == mainBoxValue) {
		boxName = 'null';
	}
	var response = objLinkManager.delLink(context, source, destination, key, boxName, roleName);
	if (response.resolvedValue.status == 204) {
		sbSuccessfulDeleteCount ++;
	} else if (response.getStatusCode() == 409) {
		arrDeletedConflictCount.push(count);
		sbConflictDeleteCount ++;
}
	return response;
};

/**
 * This method hides the pop up window.
 */
roleToExtRoleMapping.prototype.closeDeleteRolePopup = function() {
$('#extRoleDeleteModalWindow, .window').hide();
};

/**
 * This method displays message.
 */
roleToExtRoleMapping.prototype.displayStatusMessage = function () {
	uRoleExtRoleMapping.closeDeleteRolePopup();
	 objCommon.disableButton("#btnDeleteAssignRoleExtRole");
	var successfulRoleDeleteLength = 0;
	conflictRoleDeleteLength = sbConflictDeleteCount;
	successfulRoleDeleteLength = sbSuccessfulDeleteCount;
	if(successfulRoleDeleteLength > 0) {
		isDeleted = true;
		addSuccessClass('#roleToExtRoleMessageIcon');
		document.getElementById("roleToExtRoleSuccessmsg").innerHTML = successfulRoleDeleteLength+" " + getUiProps().MSG0357;
	}
	$("#roleToExtRoleMessageBlock").css("display", 'table');
	$("#assignExtRoleBtn").attr('disabled', 'disabled');
	$("#assignExtRoleBtn").addClass('assignBtnDisabled');
	//uRoleExtRoleMapping.createTable();
	$("#ExtRoleDropDown").val(getUiProps().MSG0108);
	objCommon.centerAlignRibbonMessage("#roleToExtRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("roleToExtRoleMessageBlock");
	sbSuccessfulDeleteCount = 0;
	sbConflictDeleteCount = 0;
};
// DELETE MAPPING - Role and ExtRole. ENDS

/**
 * The purpose of this function is to apply scroll css on
 * assigned external role list grid.
 */
roleToExtRoleMapping.prototype.applyScrollCssAssignRoleToExtRoleGrid = function () {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRoleExtRoleLinkTable td:eq(2)").css("width", '25.2%');
	}
};

roleToExtRoleMapping.prototype.enableDisableAssignBtn = function () {
	var selectedExtRoleName = uRoleExtRoleMapping.getSelectedExtRole();
	$("#assignExtRoleBtn").attr('disabled', 'disabled');
	$("#assignExtRoleBtn").addClass('assignBtnDisabled');
	if (selectedExtRoleName != false) {
		$("#assignExtRoleBtn").removeAttr("disabled");
		$("#assignExtRoleBtn").removeClass('assignBtnDisabled');
	}
};

/**
 * Following method fetches all role to ect role mapping data.
 * @returns json
 */
roleToExtRoleMapping.prototype.retrieveAllRoleToExtRoleJsonData = function () {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var uri = objRoleManager.getUrl();
	var mainBoxValue = getUiProps().MSG0039;
	var totalRecordCount = objRoleToExtRoleMapping.retrieveRoleExtRoleAssignRecordCount();
	var key="";
	key = "(Name='"+roleName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+roleName+"',_Box.Name='"+boxName+"')";
	}
	uri += key + "/"+"_ExtRole";
	uri = uri + "?$orderby=__updated desc&$top="
			+ totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

$(function() {
	if (sessionStorage.tabName== "Role") {
		uRoleExtRoleMapping.bindExtRoleDropDown();
		uRoleExtRoleMapping.createTable();
		$(window).resize(function () {
			if ($('#dvemptyAssignTableMessage').is(':visible')) {
				objCommon.setDynamicPositionOfAssignEmptyMessage();
			}
		});
		setDynamicAssignGridHeight();
		objCommon.assignBackBtnHoverEffect();
		objCommon.sortByDateHoverEffect();
	}
});
