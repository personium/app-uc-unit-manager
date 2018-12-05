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
function roleToRelationMapping() {
}

roleToRelationMapping.prototype.roleName = sessionStorage.roleName;
roleToRelationMapping.prototype.boxName = sessionStorage.boxName;
roleToRelationMapping.prototype.updatedOn = sessionStorage.updatedOn;
roleToRelationMapping.prototype.cellName = sessionStorage.selectedcell;
roleToRelationMapping.prototype.mappingCount = 0;
roleToRelationMapping.prototype.SOURCE = "Role";
roleToRelationMapping.prototype.DESTINATION = "Relation";
roleToRelationMapping.prototype.isAvailable = false;
roleToRelationMapping.prototype.sbSuccessfulRelation = '';
roleToRelationMapping.prototype.sbConflictRelation = '';
roleToRelationMapping.prototype.relationMappedConflictMessage = getUiProps().MSG0036;
roleToRelationMapping.prototype.relationMappedSuccessMessage = getUiProps().MSG0082;
roleToRelationMapping.prototype.ddValidationMessage = getUiProps().MSG0083;
var objRoleToRelationMapping = new roleToRelationMapping();
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
roleToRelationMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
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
	
	uri += key + "/"+"_Relation";
	uri = uri + "?$orderby=__updated desc&$skip=" + lowerLimit + "&$top="
			+ upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to retrieve count of assigned relations
 * to role.
 */
roleToRelationMapping.prototype.retrieveRoleRelationAssignRecordCount = function () {
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
	
	uri += key + "/"+"_Relation";
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * The purpose of this function is to create an object of jAbstractODataContext,
 * and accepts accessor as an input parameter.
 * 
 * @param accessor
 */
roleToRelationMapping.prototype.initializeAbstractDataContext = function(
		accessor) {
	return new _pc.AbstractODataContext(accessor);
};

/**
 * The purpose of this function is to create an object of jLinkManager.
 * @param accessor
 * @param context
 */
roleToRelationMapping.prototype.initializeLinkManager = function(accessor,
		context) {
	return new _pc.LinkManager(accessor, context);
};

/**
 * The purpose of this function is to check if a relation already exists or not.
 */
roleToRelationMapping.prototype.isRoleBoxExist = function() {
  var selectedRelationName = objCommon.getSelectedEntity("ddlRelation"); 
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = uRelRoleMapping.initializeAbstractDataContext(accessor);
	var objLinkManager = uRelRoleMapping.initializeLinkManager(accessor, context);
	var mainBoxValue = getUiProps().MSG0039;
	if (uRelRoleMapping.boxName == mainBoxValue) {
		uRelRoleMapping.boxName = null;
	}
	var response = objLinkManager.retrieveAccountRoleLinks(context, uRelRoleMapping.SOURCE,
			uRelRoleMapping.DESTINATION, selectedRelationName, uRelRoleMapping.boxName, uRelRoleMapping.roleName);
	if (response.getStatusCode() == 200) {
		var responseBody = response.bodyAsJson();
		var json = responseBody.d.results;
		for ( var count = 0; count < json.length; count++) {
			var jsonBody = json[count];
			var listRoleName = objCommon.getRoleNameFromURI(jsonBody.uri);
			var listBoxName = objCommon.getBoxNameFromURI(jsonBody.uri);
			if (listBoxName == "null") {
				listBoxName = null;
			}
			if (roleName == listRoleName && boxName == listBoxName) {
				uRelRoleMapping.isAvailable = true;
				return false;
			}
		}
	}
};

/**
 * The purpose of this function is to reload the top most panel.
 */
roleToRelationMapping.prototype.reloadPanel = function() {
	addSuccessClass('#roleToRelationMessageIcon');
	//inlineMessageBlock(212,'#roleToRelationMessageBlock');
	$("#roleToRelationMessageBlock").css("display", 'table');
	document.getElementById("roleToRelationSuccessmsg").innerHTML = uRelRoleMapping.relationMappedSuccessMessage; 
	objCommon.resetAssignationDropDown("#ddlRelation", "#assignRelationBtn", getUiProps().MSG0084);
	objCommon.centerAlignRibbonMessage("#roleToRelationMessageBlock");
	objCommon.autoHideAssignRibbonMessage("roleToRelationMessageBlock");
};

/**
 * The purpose of this function is to establish a link between a role and an
 * relation.
 */
roleToRelationMapping.prototype.linkRoleAndRelation = function() {
	var multiKey = null;
	var mainBoxValue = getUiProps().MSG0039;
if (objCommon.getSelectedEntity("ddlRelation") == false) {
		/*document.getElementById("selectRelationDDMsg").innerHTML = uRelRoleMapping.ddValidationMessage;
		return false;*/
	}else{
		//document.getElementById("selectRelationDDMsg").innerHTML="";
	}
	showSpinner("modalSpinnerRoleRelationLink");
	var arrSelectedRelationBox = objCommon.getSelectedEntity("ddlRelation");
	var selectedRelationName = arrSelectedRelationBox[0].split(' ').join('');
	selectedRelationName = selectedRelationName.trim();
	var selectedBoxName = null;
	selectedBoxName = arrSelectedRelationBox[1].split(' ').join('');
	selectedBoxName = objCommon.getBoxSubstring(selectedBoxName);
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = uRelRoleMapping.initializeAbstractDataContext(accessor);
	if (selectedRelationName != null) {
	  if (selectedBoxName == mainBoxValue) {
	    selectedBoxName = null;
	  }
	  multiKey = "(Name='" + uRelRoleMapping.roleName + "')";
	  if (uRelRoleMapping.boxName != null && uRelRoleMapping.boxName != mainBoxValue) {
	   multiKey = "(Name='" + uRelRoleMapping.roleName + "',_Box.Name='" + uRelRoleMapping.boxName + "')";
	  }
			var objLinkManager = uRelRoleMapping.initializeLinkManager(accessor, context);
			var response = objLinkManager.establishLink(context, uRelRoleMapping.SOURCE,
					uRelRoleMapping.DESTINATION, multiKey, selectedBoxName,
					selectedRelationName, true);
			if (response.getStatusCode() == 204) {
				uRelRoleMapping.reloadPanel();
				uRelRoleMapping.createRelationMappedToRole();
			} else if (response.getStatusCode() == 409) {
				uRelRoleMapping.isAvailable = false;
				addErrorClass('#roleToRelationMessageIcon');
				//inlineMessageBlock(176,'#roleToRelationMessageBlock');
				$("#roleToRelationMessageBlock").css("display", 'table');
				document.getElementById("roleToRelationSuccessmsg").innerHTML = uRelRoleMapping.relationMappedConflictMessage; 
				objCommon.resetAssignationDropDown("#ddlRelation", "#assignRelationBtn", getUiProps().MSG0084);
				objCommon.centerAlignRibbonMessage("#roleToRelationMessageBlock");
				objCommon.autoHideAssignRibbonMessage("roleToRelationMessageBlock");
			}
	}
	removeSpinner("modalSpinnerRoleRelationLink");
};

/**
 * The purpose of this function is to prevent drop down from loading values
 * again on page reload.
 */
roleToRelationMapping.prototype.refreshDropDown = function() {
	var select = document.getElementById("ddlRelation");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0084;
	select.insertBefore(newOption, select.options[-1]);
};

/**
 * The purpose of this function is to get relation details.
 */
roleToRelationMapping.prototype.getRelationDetails = function() {
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelationManager = new _pc.RelationManager(accessor);
	var count = retrieveRelationRecordCount();
	var uri = objRelationManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to bind the relation drop down.
 */
roleToRelationMapping.prototype.bindRelationDropDown = function() {
	uRelRoleMapping.refreshDropDown();
	var jsonString = uRelRoleMapping.getRelationDetails();
	var select = document.getElementById("ddlRelation");
	var mainBoxValue = getUiProps().MSG0039;
	for ( var i = 0; i < jsonString.length; i++) {
		var option = document.createElement("option");
		var objRelation = jsonString[i];
		option.id = objRelation.__metadata.etag;
		var uri = objRelation._Box.__deferred.uri;
		var searchBoxNameString = uri.search("_Box.Name");
		var searchBoxString = uri.search("/_Box");
		var boxName = uri.substring(searchBoxNameString + 10,
				searchBoxString - 1);
		boxName = boxName.replace(/'/g, " ");
		boxName = boxName.trim();
		var shorterRelationName = objCommon.getShorterName(objRelation.Name, 14);
		shorterBoxName = objCommon.getShorterName(boxName, 13);
		option.innerHTML = objRelation.Name + objCommon.startBracket + boxName + objCommon.endBracket;
		var innerHTML = option.innerHTML; 
		option.innerHTML = shorterRelationName + objCommon.startBracket + shorterBoxName + objCommon.endBracket;
		option.value = innerHTML;
		option.title = innerHTML;
		if (boxName == "null") {
			option.innerHTML = shorterRelationName + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
			option.value = objRelation.Name + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
			option.title = objRelation.Name + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
		}
		select.appendChild(option);
	}
};

/**
 * The purpose of this function is to create header for RoleRelationLinkTable
 * table.
 * @param dynamicTable
 */
roleToRelationMapping.prototype.createHeaderForRoleRelationLinkTable = function(
		dynamicTable) {
	// Headers Start.
	dynamicTable += "<tr>";
	dynamicTable += "<th class='col1' width='20'><input type='checkbox'  id='checkAll' onclick='uRelRoleMapping.checkAllSelect(this)' class='checkBox'/>";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col2' width='150'>Relation Name";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col3' width='150'>Box Name";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col3' width='300'>Updated";
	dynamicTable += "</th>";
	dynamicTable += "</tr>";
	// Headers End.
	return dynamicTable;
};

/**
 * The purpose of this function is to create row for RoleRelationLink Table .
 */
roleToRelationMapping.prototype.createRowForRoleRelationLinkTable = function(
		dynamicRoleRelationLinkTable, count, relationName,  boxName, roleRelationLinkCount,etag) {
	var itemVal = relationName + objCommon.startBracket + boxName + objCommon.endBracket;
	dynamicRoleRelationLinkTable += '<td style="width:1%;"><input id =  "txtRoleToRelationMappingEtagId'+roleRelationLinkCount+'" value='+etag+' type = "hidden" /><input title="'+roleRelationLinkCount+'" id="chkBoxRoleRelationAssign' + roleRelationLinkCount + '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="' + itemVal+'"'  + '"/><label for="chkBoxRoleRelationAssign' + roleRelationLinkCount + '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicRoleRelationLinkTable += "<td style='max-width: 238px;width:48.8%;'><div class = 'mainTableEllipsis'><label title= '" + relationName + "' class='cursorPointer'>" + relationName + "</label></div></td>";
	dynamicRoleRelationLinkTable += "<td style='max-width: 180px;width:49%;'><div class = 'mainTableEllipsis'><label title= '" + boxName + "' class='cursorPointer'>" + boxName + "</label></div></td>";
	dynamicRoleRelationLinkTable += "<td></td>";
	//dynamicTable += '<td><div onclick = "uRelRoleMapping.openMappingPopUp(false' +",'"+roleName+"'" +",'"+boxName+"'"+ ');" id="row' + count + '" style="display:none" ><a href="#" class="modalBox deleteIcon" rel="375,208" title="Delete Mapping">Delete</a></div></td>'; 
	dynamicRoleRelationLinkTable += "</tr>";
	return dynamicRoleRelationLinkTable;
};

/**
 * The purpose of this function is to create dynamic table.
 */
roleToRelationMapping.prototype.createRelationMappedToRole = function() {
	$("#assignEntityGridTbody").empty();
	$('#checkAllRoleRelationAssign').attr('checked', false);
	objCommon.disableButton("#btnDeleteAssignRoleRelation");
	var totalRecordsize =  objRoleToRelationMapping.retrieveRoleRelationAssignRecordCount();
	if (totalRecordsize == 0) {
		objCommon.displayEmptyMessageInAssignGrid(getUiProps().MSG0240, "assignRoleTab", "checkAllRoleRelationAssign");
	} else {
		$("#checkAllRoleRelationAssign").removeAttr("disabled");
		document.getElementById("dvemptyAssignTableMessage").style.display = "none";
		var recordSize = 0;
		var json = objRoleToRelationMapping.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		objRoleToRelationMapping.createRoleToRelationMappingTableChunked(json, recordSize);
		var tableID = $('#mainRoleRelationLinkTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, objRoleToRelationMapping, json, objRoleToRelationMapping.createRoleToRelationMappingTableChunked,
				"assignRoleTab");
		objCommon.checkCellContainerVisibility();
	}
};

/**
 * The purpose of this function is to create tabular view of assigned
 * relations page as per pagination.
 */
roleToRelationMapping.prototype.createRoleToRelationMappingTableChunked = function (json, recordSize) {
	$('#checkAllRoleRelationAssign').attr('checked', false);
	objCommon.disableButton('#btnDeleteAssignRoleRelation');
	var dynamicRoleRelationLinkTable = "";
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
	var roleRelationLinkCount = 0;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var relationName = obj["Name"];
		var boxName = obj["_Box.Name"];
		var etag = obj.__metadata.etag;
		if (boxName === null) {
			boxName = mainBoxValue;
		}
		dynamicRoleRelationLinkTable += '<tr name="allrows" id="rowidRoleRelationLink'+ roleRelationLinkCount + '" onclick="objCommon.rowSelect(this,'+ "'rowidRoleRelationLink'" + ','+ "'chkBoxRoleRelationAssign'"+ ','+ "'row'"+ ',' + "'btnDeleteAssignRoleRelation'"+ ','+ "'checkAllRoleRelationAssign'"+ ','+ roleRelationLinkCount + ','+ totalRecordsize +  ',' + "''" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainRoleRelationLinkTable'" + ');">';
		dynamicRoleRelationLinkTable = uRelRoleMapping.createRowForRoleRelationLinkTable(dynamicRoleRelationLinkTable, count, relationName,  boxName, roleRelationLinkCount,etag);
		roleRelationLinkCount++;
	}
	if (jsonLength > 0) {
		$("#mainRoleRelationLinkTable thead tr").addClass('mainTableHeaderRow');
		$("#mainRoleRelationLinkTable tbody").addClass('mainTableTbody');
	}
	$("#mainRoleRelationLinkTable tbody").html(dynamicRoleRelationLinkTable);
	setTimeout(function() {
		uRelRoleMapping.applyScrollCssAssignRoleToRelationGrid();
	}, 300);
};

/**
 * The purpose of this method is to select all checkboxes on click of header
 * checkbox.
 */
roleToRelationMapping.prototype.checkAllSelect = function(cBox) {
	var buttonId = '#btnDeleteAssignRoleRelation';
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxRoleRelationAssign', 49, document.getElementById("checkAllRoleRelationAssign"));
	objCommon.showSelectedRow(document.getElementById("checkAllRoleRelationAssign"), "row", "rowidRoleRelationLink");
};

/**
 * The purpose of this function is to display popup window for single or
 * multiple delete
 */
roleToRelationMapping.prototype.openMappingPopUp = function() {
	var response = objCommon.getMultipleSelections('mainRoleRelationLinkTable', 'input', 'case');
	sessionStorage.relationNames = response;
	$('#roleRelationMultipleDeleteModalWindow').fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$('#roleRelationMultipleDeleteDialogBox').css('top', windowHeight / 2 - $('#roleRelationMultipleDeleteDialogBox').height() / 2);
	$('#roleRelationMultipleDeleteDialogBox').css('left', windowWidth / 2 - $('#roleRelationMultipleDeleteDialogBox').width() / 2);
	$("#btnCancelRoleToRelationAssign").focus();
};

/**
 * handle single/multiple mapping delete operation
 * @param multiple
 */
roleToRelationMapping.prototype.delRoleRelationMapping = function() {
	// showSpinner("modalSpinnerRoleAccountLink");
	var mappings = sessionStorage.relationNames;
	var arrMappings = mappings.split(',');
	var etagIDOfPreviousRecord = "txtRoleToRelationMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#mainRoleRelationLinkTable');
	var mappingType = "RoleToRelation";
	var type = "assignRoleTab";
	var idCheckAllChkBox = "#checkAllRoleRelationAssign";	
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBoxRoleRelationAssign0","#assignEntityGridTbody");
	}
	for ( var count = 0; count < arrMappings.length; count++) {
		var arrItem = arrMappings[count].split("'").join('').split(objCommon.startBracket);
		var box = objCommon.getBoxSubstring(arrItem[1]);
		sessionStorage.mappedBoxName = box;
		var role = arrItem[0].trim();
		var response = uRelRoleMapping.deleteMapping(role, true);
		if (response.resolvedValue.status == 204) {
			uRelRoleMapping.sbSuccessfulRelation += role + ",";
		} else if (objCommon.getStatusCode() == 409) {
			arrDeletedConflictCount.push(count);
			uRelRoleMapping.sbConflictRelation += role + ",";
			uRelRoleMapping.sbConflictRelation.replace(/, $/, "");
		}
	}
	uRelRoleMapping.showDelStatusOnRibbon(
			'#roleRelationMultipleDeleteModalWindow', '',
			'/templates/'+sessionStorage.selectedLanguage+'/roleToRelationMapping.html');
	var recordCount = objRoleToRelationMapping.retrieveRoleRelationAssignRecordCount();
		objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			mappingType, recordCount, objRoleToRelationMapping, isDeleted);
	
};

/**
 * core mapping delete operation
 * 
 * @param multiple
 * @param relationName
 */
roleToRelationMapping.prototype.deleteMapping = function(relationName, multiple) {
	var roleName = sessionStorage.roleName;
	var boxName = sessionStorage.boxName; 
	var mappedBoxName= sessionStorage.mappedBoxName;
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objLinkManager = new _pc.LinkManager(accessor);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var mainBoxValue = getUiProps().MSG0039;
	var key = "(Name='" + roleName + "'";
	if (boxName == mainBoxValue) {
		boxName = null;
	}
	if (boxName !== undefined && boxName !== null && boxName !== mainBoxValue) {
		key += ",_Box.Name='" + boxName + "'";
	}
	key += ")";
	var relationKey = "(Name='" + relationName + "'";
	if (mappedBoxName == mainBoxValue) {
		mappedBoxName = null;
	}
	if (mappedBoxName !== undefined && mappedBoxName !== null && mappedBoxName !== mainBoxValue) {
		relationKey += ",_Box.Name='" + mappedBoxName + "'";
	}
	relationKey += ")";
	return objLinkManager.delLink(context, "Role", "Relation", key, relationKey);
};

/**
 * @param id
 * @param statusCode
 * @param url
 * @param multiple
 * show delete operation status - single or multiple
 */
roleToRelationMapping.prototype.showDelStatusOnRibbon = function(id,
		statusCode, url) {
		var conflictRelnDeleteLength = 0;
		var successfulRelnDeleteLength = 0;
		uRelRoleMapping.sbSuccessfulRelation = uRelRoleMapping.sbSuccessfulRelation.substring(0,
				uRelRoleMapping.sbSuccessfulRelation.length - 1);
		uRelRoleMapping.sbConflictRelation = uRelRoleMapping.sbConflictRelation.substring(0,
				uRelRoleMapping.sbConflictRelation.length - 1);
		$('#roleRelationMultipleDeleteModalWindow, .window').hide();
		conflictRelnDeleteLength = entityCount(uRelRoleMapping.sbConflictRelation);
		successfulRelnDeleteLength = entityCount(uRelRoleMapping.sbSuccessfulRelation);
		if (conflictRelnDeleteLength < 1 && successfulRelnDeleteLength > 0) {
			isDeleted = true;
			addSuccessClass('#roleToRelationMessageIcon');
			uRelRoleMapping.sbSuccessfulRelation = '';
			uRelRoleMapping.sbConflictRelation = '';
			document.getElementById("roleToRelationSuccessmsg").innerHTML = successfulRelnDeleteLength
			+ " " + getUiProps().MSG0352;
		} else if (successfulRelnDeleteLength < 1
				&& conflictRelnDeleteLength > 0) {
			isDeleted = false;
			addErrorClass();
			document.getElementById("roleToRelationSuccessmsg").innerHTML = conflictRelnDeleteLength
			+ " " + getUiProps().MSG0356;
			uRelRoleMapping.sbSuccessfulRelation = '';
			uRelRoleMapping.sbConflictRelation = '';
		} else if (conflictRelnDeleteLength > 0
				&& successfulRelnDeleteLength > 0) {
			isDeleted = true;
			addPartialSuccessClass();
			document.getElementById("roleToRelationSuccessmsg").innerHTML = successfulRelnDeleteLength
			+ " " + getUiProps().MSG0323;
			+ (conflictRelnDeleteLength + successfulRelnDeleteLength)
			+ " " + getUiProps().MSG0352;
			uRelRoleMapping.sbSuccessfulRelation = '';
			uRelRoleMapping.sbConflictRelation = '';
		}
		$("#roleToRelationMessageBlock").css("display", 'table');
		 $("#assignRelationBtn").attr('disabled', 'disabled');
		 $("#assignRelationBtn").addClass('assignBtnDisabled');
		 //uRelRoleMapping.createRelationMappedToRole();
		$("#ddlRelation").val(getUiProps().MSG0084);
		objCommon.centerAlignRibbonMessage("#roleToRelationMessageBlock");
		objCommon.autoHideAssignRibbonMessage("roleToRelationMessageBlock");
};

/**
 * The purpose of this function is to apply scroll css on
 * assigned relation list grid.
 */
roleToRelationMapping.prototype.applyScrollCssAssignRoleToRelationGrid = function () {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRoleRelationLinkTable td:eq(1)").css("width", '49.08%');
	}
};

var uRelRoleMapping = new roleToRelationMapping();

roleToRelationMapping.prototype.loadRoleToRelationMappingPage = function () {
	if (sessionStorage.tabName == "Role") {
		uRelRoleMapping.createRelationMappedToRole();
	}
};

roleToRelationMapping.prototype.enableDisableAssignBtn = function () {
	var selectedRelationName = objCommon.getSelectedEntity("ddlRelation");
	 $("#assignRelationBtn").attr('disabled', 'disabled');
	 $("#assignRelationBtn").addClass('assignBtnDisabled');
	if (selectedRelationName != false) {
		 $("#assignRelationBtn").removeAttr("disabled");
		 $("#assignRelationBtn").removeClass('assignBtnDisabled');
	}
};

/**
 * Following method fetches all role to relation mapping data.
 * @returns json.
 */
roleToRelationMapping.prototype.retrieveAllRoleToRelationJsonData = function () {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var totalRecordCount = objRoleToRelationMapping.retrieveRoleRelationAssignRecordCount();
	var uri = objRoleManager.getUrl();
	var mainBoxValue = getUiProps().MSG0039;
	var key="";
	key = "(Name='"+roleName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+roleName+"',_Box.Name='"+boxName+"')";
	}
	uri += key + "/"+"_Relation";
	uri = uri + "?$orderby=__updated desc &$top="
			+ totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};


$(function() {
	uRelRoleMapping.bindRelationDropDown();
	uRelRoleMapping.loadRoleToRelationMappingPage();
	$(window).resize(function () {
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
	setDynamicAssignGridHeight();
	objCommon.assignBackBtnHoverEffect();
	objCommon.sortByDateHoverEffect();
});
