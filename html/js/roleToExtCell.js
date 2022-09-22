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
function roleToExtCellMapping() {
}

roleToExtCellMapping.prototype.roleName = sessionStorage.roleName;
roleToExtCellMapping.prototype.boxName = sessionStorage.boxName;
roleToExtCellMapping.prototype.updatedOn = sessionStorage.updatedOn;
roleToExtCellMapping.prototype.cellName = sessionStorage.selectedcell;
roleToExtCellMapping.prototype.mappingCount = 0;
roleToExtCellMapping.prototype.SOURCE = "Role";
roleToExtCellMapping.prototype.DESTINATION = "ExtCell";
roleToExtCellMapping.prototype.isAvailable = false;
roleToExtCellMapping.prototype.sbSuccessfulRelation = '';
roleToExtCellMapping.prototype.sbConflictRelation = '';
roleToExtCellMapping.prototype.relationMappedConflictMessage = getUiProps().MSG0036;
roleToExtCellMapping.prototype.relationMappedSuccessMessage = getUiProps().MSG0099;
roleToExtCellMapping.prototype.ddValidationMessage = getUiProps().MSG0054;
var objRoleToExtCellMapping = new roleToExtCellMapping();

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
roleToExtCellMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
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
	
	uri += key + "/"+"_ExtCell";
	uri = uri + "?$orderby=__updated desc&$skip=" + lowerLimit + "&$top="
			+ upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to retrieve count of assigned external
 * cells to role.
 */
roleToExtCellMapping.prototype.retrieveRoleExtCellAssignRecordCount = function () {
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
	
	uri += key + "/"+"_ExtCell";
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
roleToExtCellMapping.prototype.reloadPanel = function() {
	addSuccessClass('#roleToExtCellMessageIcon');
	$("#roleToExtCellMessageBlock").css("display", 'table');
	//inlineMessageBlock(232,'#roleToExtCellMessageBlock');
	document.getElementById("roleToExtCellSuccessmsg").innerHTML = uRoleExtCellMapping.relationMappedSuccessMessage; 
	objCommon.resetAssignationDropDown("#ExtCellDropDown", "#assignExtCellBtn", getUiProps().MSG0098);
	objCommon.centerAlignRibbonMessage("#roleToExtCellMessageBlock");
	objCommon.autoHideAssignRibbonMessage("roleToExtCellMessageBlock");
};

roleToExtCellMapping.prototype.setDomElemValue = function(key, value) {
	document.getElementById(key).innerHTML = value;
};

/**
 * The purpose of this function is to establish a link between a role and an
 * external cell.
 */
roleToExtCellMapping.prototype.linkRoleAndECell = function() {
	var multiKey = null;
	var mainBoxValue = getUiProps().MSG0039;
	showSpinner("modalSpinnerRoleECellLink");
	var selExtCell = uRoleExtCellMapping.getSelectedExtCell().split(' ').join('');
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = objCommon.initializeAbstractDataContext(accessor);
	if (selExtCell!= null) {
		multiKey = "(Name='"+ uRoleExtCellMapping.roleName+ "')";
		if (sessionStorage.boxName!= null
				&& sessionStorage.boxName!= mainBoxValue) {
			multiKey = "(Name='"+ sessionStorage.roleName+ "',_Box.Name='"
					+ sessionStorage.boxName+ "')";
		}
			var objLinkManager = objCommon.initializeLinkManager(accessor,
					context);
			var response = objLinkManager.establishLink(context,
					uRoleExtCellMapping.SOURCE,
					uRoleExtCellMapping.DESTINATION, multiKey,
					uRoleExtCellMapping.boxName, selExtCell, true);
			if (response.getStatusCode() == 204) {
				uRoleExtCellMapping.reloadPanel();
				uRoleExtCellMapping.createExtCellMappedToRole();
			} else if (response.getStatusCode() == 409) {
				uRoleExtCellMapping.isAvailable = false;
				addErrorClass('#roleToExtCellMessageIcon');
				//inlineMessageBlock(176,'#roleToExtCellMessageBlock');
				$("#roleToExtCellMessageBlock").css("display", 'table');
				document.getElementById("roleToExtCellSuccessmsg").innerHTML = uRoleExtCellMapping.relationMappedConflictMessage; 
				objCommon.resetAssignationDropDown("#ExtCellDropDown", "#assignExtCellBtn", getUiProps().MSG0098);
				objCommon.centerAlignRibbonMessage("#roleToExtCellMessageBlock");
				objCommon.autoHideAssignRibbonMessage("roleToExtCellMessageBlock");
			}
	}
	removeSpinner("modalSpinnerRoleECellLink");
};

/**
 * The purpose of this function is to prevent drop down from loading values
 * again on page reload.
 */
roleToExtCellMapping.prototype.refreshDropDown = function() {
	var select = document.getElementById("ExtCellDropDown");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0098;
	select.insertBefore(newOption, select.options[-1]);
};

/**
 * The purpose of this function is to fetch the values of selected external
 * cell.
 */
roleToExtCellMapping.prototype.getSelectedExtCell = function() {
	var selectedRelation = false;
	var dropDown = document.getElementById("ExtCellDropDown");
	if (dropDown.selectedIndex > 0) {
		selectedRelation = dropDown.options[dropDown.selectedIndex].title;
	}
	return selectedRelation;
};

/**
 * The purpose of this function is to bind the relation drop down.
 */
roleToExtCellMapping.prototype.bindExtCellDropDown = function() {
	uRoleExtCellMapping.refreshDropDown();
	var jsonString = uRoleExtCellMapping.getExternalCellList();
	var len = jsonString.length;
	for ( var count = 0; count< len; count++) {
		var objExterrnalCell = jsonString[count];
		var externalCellURI = objExterrnalCell.Url;
		this.appendChildDropDown(externalCellURI);
	}
};

roleToExtCellMapping.prototype.appendChildDropDown = function(url) {
	var externalCellName = ""
	objCommon.getCell(url).done(function(cellObj) {
        externalCellName = cellObj.cell.name;
    }).fail(function(xmlObj) {
       externalCellName = objExtCell.getExternalCellName(url);
    }).always(function() {
		var tooltipExternalCellName = objCommon.getShorterName(externalCellName, 17);
		var option = document.createElement("option");
		option.innerHTML = url;
		option.text = tooltipExternalCellName;
		option.title = url;
		var select = document.getElementById("ExtCellDropDown");
		select.appendChild(option);
    });
}

/**
 * The purpose of this function to get external cell detail against selected
 * cell.
 */
roleToExtCellMapping.prototype.getExternalCellList = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var count = objExtCell.retrieveRecordCount();
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to create header for RoleRelationLinkTable
 * table.
 * 
 * @param dynamicTable
 */
roleToExtCellMapping.prototype.createHeaderForRoleExtCellLinkTable = function(
		dynamicTable) {
	// Headers Start.
	dynamicTable += "<tr>";
	dynamicTable += "<th class='col1' width='20' style='border-top: none;'><input type='checkbox'  id='checkAll' onclick='uRoleExtCellMapping.checkAllSelect(this)' class='checkBox'/>";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col2' width='150' style='border-top: none;'>External Cell Name";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col3' width='300' style='border-top: none;'>External Cell URL";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col4' width='150' style='border-top: none;'>Updated";
	dynamicTable += "</th>";
	dynamicTable += "</tr>";
	// Headers End.
	return dynamicTable;
};

/**
 * The purpose of this function is to create row for RoleRelationLink Table .
 */
roleToExtCellMapping.prototype.createRowForRoleExtCellLinkTable = function(
		count, extCellURL, roleExtCellLinkCount, etag, totalRecordsize) {
	var extCellName = "";
	objCommon.getCell(extCellURL).done(function(cellObj) {
        extCellName = cellObj.cell.name;
    }).fail(function(xmlObj) {
    	extCellName = objExtCell.getExternalCellName(extCellURL);
    }).always(function() {
    	var itemVal = extCellName+ objCommon.startBracket + extCellURL + objCommon.endBracket;
		var dispExtCellURL = objCommon.changeLocalUnitToUnitUrl(extCellURL);
		var dynamicRoleExtCellLinkTable = '<tr name="allrows" id="rowidRoleExtCellLink'+ roleExtCellLinkCount + '" onclick="objCommon.rowSelect(this,'+ "'rowidRoleExtCellLink'" + ','+ "'chkBoxRoleExtCellAssign'"+ ','+ "'row'"+ ',' + "'btnDeleteAssignRoleExtCell'"+ ','+ "'checkAllRoleExtCellAssign'"+ ','+ roleExtCellLinkCount + ','+ totalRecordsize +  ',' + "''" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainRoleExtCellLinkTable'" + ');">'
		dynamicRoleExtCellLinkTable += '<td style="width:1%"><input id =  "txtRoleToExtRoleMappingEtagId'+roleExtCellLinkCount+'" value='+etag+' type = "hidden" /><input title="'+roleExtCellLinkCount+'" id="chkBoxRoleExtCellAssign'+ roleExtCellLinkCount + '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'+ itemVal + '"'+ '"/><label for="chkBoxRoleExtCellAssign' + roleExtCellLinkCount + '" class="customChkbox checkBoxLabel"></label></td>';
		dynamicRoleExtCellLinkTable += "<td style='max-width: 172px;width:40%;'><div class = 'mainTableEllipsis'><label title= '"+ extCellName+ "' class='cursorPointer'>" + extCellName+ "</label></div></td>";
		dynamicRoleExtCellLinkTable += "<td style='max-width: 300px;width:59%;'><div class ='mainTableEllipsis'><label title= '"+ dispExtCellURL+ "' class='cursorPointer'>" + dispExtCellURL + "</label></div></td>";
		dynamicRoleExtCellLinkTable += "</tr>";
		$("#mainRoleExtCellLinkTable tbody").append(dynamicRoleExtCellLinkTable); 
    });
};

/**
 * The purpose of this function is to create tabular view of assigned
 * external cells page as per pagination.
 */
roleToExtCellMapping.prototype.createRoleToExtCellMappingTableChunked = function (json, recordSize) {
	$('#checkAllRoleExtCellAssign').attr('checked', false);
	$("#mainRoleExtCellLinkTable tbody").empty();
	objCommon.disableButton('#btnDeleteAssignRoleExtCell');
	var dynamicRoleExtCellLinkTable = "";
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
	var roleExtCellLinkCount = 0;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var etag = obj.__metadata.etag;
		var extCellURL = obj["Url"];
		uRoleExtCellMapping.createRowForRoleExtCellLinkTable(count, extCellURL, roleExtCellLinkCount, etag, totalRecordsize);
		roleExtCellLinkCount++;
	}
	if (jsonLength > 0) {
		$("#mainRoleExtCellLinkTable thead tr").addClass('mainTableHeaderRow');
		$("#mainRoleExtCellLinkTable tbody").addClass('mainTableTbody');
	}
	setTimeout(function() {
		objRoleToExtCellMapping.applyScrollCssAssignRoleToExtCellGrid();
	}, 300);
};

/**
 * The purpose of this function is to create dynamic table.
 */
roleToExtCellMapping.prototype.createExtCellMappedToRole = function() {
	$("#assignEntityGridTbody").empty();
	$('#checkAllRoleExtCellAssign').attr('checked', false);
	objCommon.disableButton("#btnDeleteAssignRoleExtCell");
	var totalRecordsize =  objRoleToExtCellMapping.retrieveRoleExtCellAssignRecordCount();
	if (totalRecordsize == 0) {
		objCommon.displayEmptyMessageInAssignGrid(getUiProps().MSG0239, "assignRoleTab", "checkAllRoleExtCellAssign");
	} else {
		$("#checkAllRoleExtCellAssign").removeAttr("disabled");
		document.getElementById("dvemptyAssignTableMessage").style.display = "none";
		var recordSize = 0;
		var json = objRoleToExtCellMapping.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		objRoleToExtCellMapping.createRoleToExtCellMappingTableChunked(json, recordSize);
		var tableID = $('#mainRoleExtCellLinkTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, objRoleToExtCellMapping, json, objRoleToExtCellMapping.createRoleToExtCellMappingTableChunked,
				"assignRoleTab");
		objCommon.checkCellContainerVisibility();
	}
};

/**
 * The purpose of this method is to select all check box on click of header
 * check box.
 */
roleToExtCellMapping.prototype.checkAllSelect = function(cBox) {
	var buttonId = '#btnDeleteAssignRoleExtCell';
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxRoleExtCellAssign', 49, document.getElementById("checkAllRoleExtCellAssign"));
	objCommon.showSelectedRow(document.getElementById("checkAllRoleExtCellAssign"), "row",
			"rowidRoleExtCellLink");
};

/**
 * @param mdlWinId
 * @param dlgBxId
 * @param multi
 * @param extCellName
 * @param extCellURL
 * @param tableId
 * @returns
 */
roleToExtCellMapping.prototype.openMappingPopUp = function(mdlWinId, dlgBxId,
		extCellName, extCellURL, tableId) {
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	var response = extCellName;
	$(mdlWinId).fadeIn(0);
	$(dlgBxId).css('top', windowHeight / 2 - $(dlgBxId).height() / 2);
	$(dlgBxId).css('left', windowWidth / 2 - $(dlgBxId).width() / 2);
	// if (multi) {
	response = objCommon.getMultipleSelections(tableId, 'input', 'case');
	// }
	$("#btnCancelDeleteRoleToExtCellAssign").focus();
	return response;
};


/**
 * The purpose of this function is to display popup window for single or
 * multiple delete
 */
roleToExtCellMapping.prototype.showRoleExtCellMapPopUp = function() {
		var response = uRoleExtCellMapping.openMappingPopUp('#roleExtCellMultipleDeleteModalWindow',
				'#roleExtCellMultipleDeleteDialogBox', "", "",
				'mainRoleExtCellLinkTable');
		sessionStorage.extCellNames = response;
};

/**
 * handle single/multiple mapping delete operation
 */
roleToExtCellMapping.prototype.delRoleExtCellMapping = function() {
	showSpinner("modalSpinnerRoleECellLink");
	var etagIDOfPreviousRecord = "txtRoleToExtRoleMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#mainRoleExtCellLinkTable');
	var idCheckAllChkBox = "#checkAllRoleExtCellAssign";
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord,
				arrEtag, "#chkBoxRoleExtCellAssign0", "#assignEntityGridTbody");
	}
	var cellNameURLMappings = sessionStorage.extCellNames;
	var arrCellNameURLMappings = cellNameURLMappings.split(',');
	var len = arrCellNameURLMappings.length;
	for ( var count = 0; count < len; count++) {
		var nameURLItem = arrCellNameURLMappings[count].split("'").join('')
				.split(objCommon.startBracket);
		var extCellName = objCommon.getBoxSubstring(nameURLItem[0]);
		sessionStorage.extCellName = extCellName;
		var extCellURL = objCommon.getBoxSubstring(nameURLItem[1]);
		sessionStorage.extCellURLName = encodeURIComponent(extCellURL);
		var response = uRoleExtCellMapping.deleteMapping(
				sessionStorage.extCellURLName, true);
		if (response.resolvedValue.status == 204) {
			uRoleExtCellMapping.sbSuccessfulRelation += extCellName + ",";
		} else if (response.getStatusCode() == 409) {
			arrDeletedConflictCount.push(count);
			uRoleExtCellMapping.sbConflictRelation += extCellName + ",";
			uRoleExtCellMapping.sbConflictRelation.replace(/, $/, "");
		}
	}
	objRoleToExtCellMapping.showDelStatusOnRibbon(
			'#roleExtCellMultipleDeleteModalWindow', '',
			uRoleExtCellMapping.sbSuccessfulRelation,
			uRoleExtCellMapping.sbConflictRelation, getUiProps().MSG0355);
	removeSpinner("modalSpinnerRoleECellLink");
	var type = "assignRoleTab";
	var mappingType = "RoleToExtCell";
	var recordCount = objRoleToExtCellMapping
			.retrieveRoleExtCellAssignRecordCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			mappingType, recordCount, objRoleToExtCellMapping, isDeleted);

};

/**
 * @param id {of delete modal window}
 * @param statusCode {reponse code}
 * @param deleteSuccess {concatenated success items}
 * @param deleteConflict {concatenated conflicted items}
 * @param reloadURL {relative to context URL the page should be reloaded to}
 * @param multiple single or multiple
 * @param keyText {Mapping, Relation etc}
 */
roleToExtCellMapping.prototype.showDelStatusOnRibbon = function(id, statusCode,
		deleteSuccess, deleteConflict, keyText) {
	var ribbonDiv = document.getElementById("roleToExtCellSuccessmsg");
	keyText += '(s)';
	var delCountConflict = 0;
	var delCountSuccess = 0;
	deleteSuccess = deleteSuccess.substring(0, deleteSuccess.length - 1);
	deleteConflict = deleteConflict.substring(0, deleteConflict.length - 1);
	$(id).hide();
	delCountConflict = entityCount(deleteConflict);
	delCountSuccess = entityCount(deleteSuccess);
	if (delCountConflict < 1 && delCountSuccess > 0) {
		isDeleted = true;
		addSuccessClass('#roleToExtCellMessageIcon');
		ribbonDiv.innerHTML = delCountSuccess + " " + keyText + " " + getUiProps().MSG0353;
		uRoleExtCellMapping.sbSuccessfulRelation = '';
		uRoleExtCellMapping.sbConflictRelation = '';
	} else if (delCountSuccess < 1 && delCountConflict > 0) {
		isDeleted = false;
		addErrorClass('#roleToExtCellMessageIcon');
		ribbonDiv.innerHTML = delCountConflict + " " + keyText + " " + getUiProps().MSG0354;
		uRoleExtCellMapping.sbSuccessfulRelation = '';
		uRoleExtCellMapping.sbConflictRelation = '';
	} else if (delCountConflict > 0 && delCountSuccess > 0) {
		isDeleted = true;
		addErrorClass('#roleToExtCellMessageIcon');
		ribbonDiv.innerHTML = delCountSuccess + " " + getUiProps().MSG0323 + " " + (delCountConflict + delCountSuccess) + " " + keyText + " " + getUiProps().MSG0353;
		uRoleExtCellMapping.sbSuccessfulRelation = '';
		uRoleExtCellMapping.sbConflictRelation = '';
	}
	$("#roleToExtCellMessageBlock").css("display", 'table');
	$("#assignExtCellBtn").attr('disabled', 'disabled');
	$("#assignExtCellBtn").addClass('assignBtnDisabled');
	//uRoleExtCellMapping.createExtCellMappedToRole();
	$("#ExtCellDropDown").val(getUiProps().MSG0098);
	objCommon.centerAlignRibbonMessage("#roleToExtCellMessageBlock");
	objCommon.autoHideAssignRibbonMessage("roleToExtCellMessageBlock");
};

/**
 * core mapping delete operation
 * 
 * @param multiple
 * @param extCellName
 */
roleToExtCellMapping.prototype.deleteMapping = function(extCellName, multiple) {
	var roleName = sessionStorage.roleName;
	var boxName = sessionStorage.boxName;
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objLinkManager = new _pc.LinkManager(accessor);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var mainBoxValue = getUiProps().MSG0039;
	var key = "(Name='"+ roleName+ "'";
	if (boxName == mainBoxValue) {
		boxName = null;
	}
	if (boxName!== undefined&& boxName!== null&& boxName!== mainBoxValue) {
		key += ",_Box.Name='"+ boxName+ "'";
	}
	key += ")";
	return objLinkManager.delLink(context, "Role", "ExtCell", key, extCellName);
};

var uRoleExtCellMapping = new roleToExtCellMapping();

roleToExtCellMapping.prototype.loadRoleToExtCellLinkPage = function() {
	if (sessionStorage.tabName== "Role") {
		uRoleExtCellMapping.createExtCellMappedToRole();
	}
};

/**
 * The purpose of this function is to apply css on
 * assigned external cell list grid.
 */
roleToExtCellMapping.prototype.applyScrollCssAssignRoleToExtCellGrid = function () {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRoleExtCellLinkTable td:eq(1)").css("width", '40.1%');
	}
};

roleToExtCellMapping.prototype.enableDisableAssignExtCellBtn = function () {
	var selectedExtCellName = uRoleExtCellMapping.getSelectedExtCell();
	$("#assignExtCellBtn").attr('disabled', 'disabled');
	$("#assignExtCellBtn").addClass('assignBtnDisabled');
	if (selectedExtCellName != false) {
		 $("#assignExtCellBtn").removeAttr("disabled");
		 $("#assignExtCellBtn").removeClass('assignBtnDisabled');
	}
};

/**
 * Following method fetches all data for role to ext cel mapping. 
 * @returns json
 */
roleToExtCellMapping.prototype.retrieveAllRoleToExtCellJsonData = function () {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var totalRecordCount = objRoleToExtCellMapping.retrieveRoleExtCellAssignRecordCount();
	var uri = objRoleManager.getUrl();
	var mainBoxValue = getUiProps().MSG0039;
	var key="";
	key = "(Name='"+roleName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+roleName+"',_Box.Name='"+boxName+"')";
	}
	uri += key + "/"+"_ExtCell";
	uri = uri + "?$orderby=__updated desc &$top="
			+ totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

$(function() {
	uRoleExtCellMapping.bindExtCellDropDown();
	uRoleExtCellMapping.loadRoleToExtCellLinkPage();
	$(window).resize(function() {
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
	setDynamicAssignGridHeight();
	objCommon.assignBackBtnHoverEffect();
	objCommon.sortByDateHoverEffect();
});