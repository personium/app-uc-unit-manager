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
function relationToExternalCellMapping() {
}

var objRelationToExternalCellMapping = new relationToExternalCellMapping();
// Constants
relationToExternalCellMapping.prototype.SOURCE = "Relation";
relationToExternalCellMapping.prototype.DESTINATION = "ExtCell";
var sbSuccessfulRelationToExtCellMappedCount = 0;
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

/**
 * The purpose of this method is to retrieve total count of linked External Cell 
 * @returns
 */
relationToExternalCellMapping.prototype.retrieveLinkedExtCellCount = function() {
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
	uri += key + "/"+"_ExtCell";
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
relationToExternalCellMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
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
	uri += key + "/"+"_ExtCell";
	uri = uri + "?$orderby=__updated desc &$skip=" + lowerLimit + "&$top="
			+ upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function to relation and box details on relation mapping
 * page
 */
relationToExternalCellMapping.prototype.showRelationDetails = function() {
	var relationNameDiv = document.getElementById("relationNameDiv");
	var boxNameDiv = document.getElementById("boxNameDiv");
	var relationDateDiv = document.getElementById("relationDateDiv");
	/*var displayRelationName = objCommon
			.getShorterEntityName(sessionStorage.relationName);
	var displayBoxName = objCommon.getShorterEntityName(sessionStorage.boxName);*/
	relationNameDiv.innerHTML = "Relation Name : " + sessionStorage.relationName;
	relationNameDiv.title = sessionStorage.relationName;
	boxNameDiv.innerHTML = "Box Name : " + sessionStorage.boxName;
	boxNameDiv.title = sessionStorage.boxName;
	relationDateDiv.innerHTML = "Updated On : " + sessionStorage.updatedOn;
	relationDateDiv.title = sessionStorage.updatedOn;
};

/**
 * The purpose of this function to bind drop down with external cell
 */
relationToExternalCellMapping.prototype.bindExternalCellDropDown = function() {
	var objRelationToExternalCellMapping = new relationToExternalCellMapping();
	objRelationToExternalCellMapping.refreshDropDown();
	var jsonString = objRelationToExternalCellMapping.getExternalCellList();
	for ( var count = 0; count < jsonString.length; count++) {
		var objExterrnalCell = jsonString[count];
		var externalCellURI = objExterrnalCell.Url;
		this.appendChildDropDown(externalCellURI);
	}
};

relationToExternalCellMapping.prototype.appendChildDropDown = function(url) {
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
		var select = document.getElementById("externalCellDropDown");
		select.appendChild(option);
    });
}

/**
 * The purpose of this function to get external cell detail against selected
 * cell.
 */
relationToExternalCellMapping.prototype.getExternalCellList = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var count = objExtCell.retrieveRecordCount();
	var uri = objExtCellManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to initialize AbstractODataContext.js
 */
relationToExternalCellMapping.prototype.initializeAbstractDataContext = function(
		accessor) {
	return new AbstractODataContext(accessor);
};

/**
 * The purpose of this function is to initialize LinkManager.js
 */
relationToExternalCellMapping.prototype.initializeLinkManager = function(
		accessor, context) {
	return new LinkManager(accessor, context);
};

/**
 * The purpose of this function is to configure link between relation and
 * external cell.
 */
relationToExternalCellMapping.prototype.configureRelationToExternalCell = function() {
	//document.getElementById("selectExternalCellDDMsg").innerHTML = "";
	//document.getElementById("selectRelationDDMsg").innerHTML = "";
	//var externalCellDropdownMessage = getUiProps().MSG0054;
	showSpinner("modalSpinnerRelationMappingLink");
	var objRelationToExternalCellMapping = new relationToExternalCellMapping();
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var mainBoxValue = getUiProps().MSG0039;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var selectedExternalCell = objRelationToExternalCellMapping
			.getSelectedExternalCell();
	var externalCellUriKey = encodeURIComponent(selectedExternalCell);
	var boxName = sessionStorage.boxName;
	if (boxName == mainBoxValue) {
		boxName = null;
	}
	var relationName = sessionStorage.relationName;
	/*if (selectedExternalCell == null) {
		document.getElementById("selectExternalCellDDMsg").innerHTML = externalCellDropdownMessage;
		removeSpinner("modalSpinnerRelationMappingLink");
		return false;
	}*/
	if (selectedExternalCell != null) {
		var objLinkManager = objCommon.initializeLinkManager(accessor, context);
		var response = objLinkManager.establishLink(context,
				objRelationToExternalCellMapping.DESTINATION,
				objRelationToExternalCellMapping.SOURCE, externalCellUriKey,
				boxName, relationName);
		if (response.getStatusCode() == 204) {
			objRelationToExternalCellMapping.reloadPanel();
			objRelationToExternalCellMapping.createTable();
		} else if (response.getStatusCode() == 409) {
			addErrorClass('#relationToExtCellMessageIcon');
			//inlineMessageBlock(172,'#relationToExtCellMessageBlock');
			$("#relationToExtCellMessageBlock").css("display", 'table');
			$("#relationToExtCellMessageBlock").css("width", "0px");
			document.getElementById("relationToExtCellSuccessmsg").innerHTML = getUiProps().MSG0036;
			$("#externalCellDropDown").val("Select External Cell");
			$("#btnAssignRelationToExtCell").attr('disabled', 'disabled');
			 $("#btnAssignRelationToExtCell").addClass('assignBtnDisabled');
			 objCommon.centerAlignRibbonMessage("#relationToExtCellMessageBlock");
			objCommon.autoHideAssignRibbonMessage("relationToExtCellMessageBlock");
		}
	}
	removeSpinner("modalSpinnerRelationMappingLink");
};

/**
 * The purpose of this function is to get selected external cell from drop down.
 */
relationToExternalCellMapping.prototype.getSelectedExternalCell = function() {
	var selectedExternalCell = null;
	var externalCellDropDown = document.getElementById("externalCellDropDown");
	if (externalCellDropDown.selectedIndex > 0) {
		selectedExternalCell = externalCellDropDown.options[externalCellDropDown.selectedIndex].title;
	}
	return selectedExternalCell;
};

/**
 * The purpose of this function is to external cell drop down
 */
relationToExternalCellMapping.prototype.refreshDropDown = function() {
	var select = document.getElementById("externalCellDropDown");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0098;
	select.insertBefore(newOption, select.options[-1]);
};

/**
 * The purpose of this function is to display success message after mapping
 */
relationToExternalCellMapping.prototype.reloadPanel = function() {
	addSuccessClass('#relationToExtCellMessageIcon');
	//inlineMessageBlock(241,'#relationToExtCellMessageBlock');
	$("#relationToExtCellMessageBlock").css("display", 'table');
	$("#relationToExtCellMessageBlock").css("width", "0px");
	document.getElementById("relationToExtCellSuccessmsg").innerHTML = getUiProps().MSG0042; 
	$("#externalCellDropDown").val("Select External Cell");
	$("#btnAssignRelationToExtCell").attr('disabled', 'disabled');
	$("#btnAssignRelationToExtCell").addClass('assignBtnDisabled');
	objCommon.centerAlignRibbonMessage("#relationToExtCellMessageBlock");
	objCommon.autoHideAssignRibbonMessage("relationToExtCellMessageBlock");
};

/**
 * The purpose of this function is to implement alternate row color in table
 */
relationToExternalCellMapping.prototype.alternateRowColor = function() {
	$(".linkTable tr:even").css("background-color", "#F4F4F4");
	$(".selectProfileRow").css("background-color", "#dfdfdf");
};

/**
 * The purpose of this function is to select all checkboxes on click of header checkbox.
 */
relationToExternalCellMapping.prototype.checkAll = function(cBox){
	var buttonId = '#btnDeleteRelationToExtCellMapping';
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxRelationExtCellAssign', 49, document.getElementById("checkAllRelationExtCellAssign"));
	objCommon.showSelectedRow(document.getElementById("checkAllRelationExtCellAssign"),"row","rowidRelationExtCellLink");
};

/**
 * The purpose of this function is to create data table.
 * @returns {String}
 */
relationToExternalCellMapping.prototype.createTable = function() {
	$('#assignEntityGridTbody').empty();
	$('#checkAllRelationExtCellAssign').attr('checked', false);
	$("#btnDeleteRelationToExtCellMapping").attr('disabled', true);
	$("#btnDeleteRelationToExtCellMapping").removeClass('deleteIconEnabled');
	$("#btnDeleteRelationToExtCellMapping").addClass('deleteIconDisabled');
	var totalRecordsize =  objRelationToExternalCellMapping.retrieveLinkedExtCellCount();
	if (totalRecordsize == 0) {
		var emptyMessage = getUiProps().MSG0239;
		objCommon.displayEmptyMessageInAssignGrid(emptyMessage, "assignRelationTab", "checkAllRelationExtCellAssign");
	} else {
		$('#checkAllRelationExtCellAssign').removeAttr("disabled");
		document.getElementById("dvemptyAssignTableMessage").style.display = "none";
		var recordSize = 0;
		var json = objRelationToExternalCellMapping.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		objRelationToExternalCellMapping.createChunkedRelationToExtCellMappingTable(json, recordSize);
		var tableID = $('#mainRelationExtCellLinkTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, objRelationToExternalCellMapping, json, objRelationToExternalCellMapping.createChunkedRelationToExtCellMappingTable,
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
relationToExternalCellMapping.prototype.createChunkedRelationToExtCellMappingTable = function(json, recordSize) {
	$('#checkAllRelationExtCellAssign').attr('checked', false);
	objCommon.disableButton('#btnDeleteRelationToExtCellMapping');
	$("#mainRelationExtCellLinkTable tbody").empty();
	var dynamicRelationExtCellLinkTable = "";
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
	var relationExtCellLinkCount = 0;
	for ( var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var extCellURI = obj["Url"];
		var extCellURL = extCellURI;
		var etag = obj.__metadata.etag;
		dynamicRelationExtCellLinkTable = objRelationToExternalCellMapping.createRowsForExternalCellTable(dynamicRelationExtCellLinkTable, count,extCellURL, relationExtCellLinkCount, etag, totalRecordsize);
		relationExtCellLinkCount++;
	}
	if (jsonLength > 0) {
		$("#mainRelationExtCellLinkTable thead tr").addClass('mainTableHeaderRow');
		$("#mainRelationExtCellLinkTable tbody").addClass('mainTableTbody');
	}
	setTimeout(function() {
		objRelationToExternalCellMapping.applyScrollCssOnRelationExtCellLinkGrid();
	}, 300);
};

/**
 * The purpose of this function is to create rows for mapped external cell table
 */
relationToExternalCellMapping.prototype.createRowsForExternalCellTable = function(
		dynamicRows, count,externalCellURL, relationExtCellLinkCount, etag, totalRecordsize) {
	var externalCell = "";
	objCommon.getCell(externalCellURL).done(function(cellObj) {
        externalCell = cellObj.cell.name;
    }).fail(function(xmlObj) {
    	externalCell = objExtCell.getExternalCellName(externalCellURL);
    }).always(function() {
    	var extCellDetails = externalCellURL + objCommon.startBracket + externalCell + objCommon.endBracket;
		var dispExternalCellURL = objCommon.changeLocalUnitToUnitUrl(externalCellURL);
		var dynamicRows = '<tr class="dynamicRelationToExtCellMappingRow" name="allrows" id="rowidRelationExtCellLink'+relationExtCellLinkCount+'" onclick="objCommon.rowSelect(this,'+ "'rowidRelationExtCellLink'" +','+ "'chkBoxRelationExtCellAssign'"+','+ "'row'" +','+ "'btnDeleteRelationToExtCellMapping'" +','+ "'checkAllRelationExtCellAssign'" +','+ relationExtCellLinkCount +',' + totalRecordsize +  ',' + "''" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainRelationExtCellLinkTable'" + ');">';
		dynamicRows += '<td style="width:1%"><input id = "txtRelationToExtCellMappingEtagId'+relationExtCellLinkCount+'" value='+etag+' type = "hidden" /><input title="'+relationExtCellLinkCount+'" id="chkBoxRelationExtCellAssign' + relationExtCellLinkCount
					+ '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'+ extCellDetails + '""/><label for="chkBoxRelationExtCellAssign' + relationExtCellLinkCount + '" class="customChkbox checkBoxLabel"></label></td>';
		dynamicRows += "<td name = 'acc' style='max-width: 172px;width:40%'><div class = 'mainTableEllipsis'><label title='"+externalCell+"' class='cursorPointer'>"
					+ externalCell + "</label></div></td>";
		dynamicRows += "<td name = 'acc' style='max-width: 300px;width:59%'><div class = 'mainTableEllipsis'><label title='"+dispExternalCellURL+"' class='cursorPointer'>" + dispExternalCellURL + "</label></div></td>";
		dynamicRows += "</tr>";
		$("#mainRelationExtCellLinkTable tbody").append(dynamicRows);
    });
};

relationToExternalCellMapping.prototype.openPopUpWindow = function() {
	var idDialogBox = '#relationToExtCellMappingDeleteDialogBox';
	var idModalWindow = '#relationToExtCellMappingDeleteModalWindow';
	var response = objCommon.getMultipleSelections('mainRelationExtCellLinkTable','input','case');
	sessionStorage.selLinks = response;
	$(idModalWindow).fadeIn(1000);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$('#btnCancelRelationToExtCell').focus();
};

relationToExternalCellMapping.prototype.removeRelationBoxMapping = function() {
	var selectedExternalCellDetails = sessionStorage.selLinks;
	var arrExtCells = selectedExternalCellDetails.split(',');

	var etagIDOfPreviousRecord = "txtRelationToExtCellMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#mainRelationExtCellLinkTable');
	var idCheckAllChkBox = "#checkAllRelationExtCellAssign";
	var mappingType = "RelationToExtCell";
	var type = "assignRelationTab";

	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord,
				arrEtag, "#chkBoxRelationExtCellAssign0",
				"#assignEntityGridTbody");
	}
	for ( var count = 0; count < arrExtCells.length; count++) {
		var response = objRelationToExternalCellMapping
				.deleteRelationExtCellMapping(arrExtCells[count]);
		if (response.resolvedValue.status == 204) {
			isDeleted = true;
			sbSuccessfulRelationToExtCellMappedCount++;
		} else {
			arrDeletedConflictCount.push(count);
		}
	}
	addSuccessClass('#relationToExtCellMessageIcon');
	$('#relationToExtCellMessageBlock').css("display", 'table');
	document.getElementById("relationToExtCellSuccessmsg").innerHTML = sbSuccessfulRelationToExtCellMappedCount
			+ " " + getUiProps().MSG0358;
	// objRelationToExternalCellMapping.createTable();
	$("#externalCellDropDown").val(getUiProps().MSG0098);
	$("#btnAssignRelationToExtCell").attr('disabled', 'disabled');
	$("#btnAssignRelationToExtCell").addClass('assignBtnDisabled');
	$('#relationToExtCellMappingDeleteModalWindow').hide();
	objCommon.centerAlignRibbonMessage("#relationToExtCellMessageBlock");
	objCommon.autoHideAssignRibbonMessage("relationToExtCellMessageBlock");
	sbSuccessfulRelationToExtCellMappedCount = 0;
	var recordCount = objRelationToExternalCellMapping
			.retrieveLinkedExtCellCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			mappingType, recordCount, objRelationToExternalCellMapping,
			isDeleted);
};

/**
* The purpose of the following method is to delete mapping.
* 
* @returns
*/
relationToExternalCellMapping.prototype.reloadTable = function() {
	objRelationToExternalCellMapping.createTable();
};

/**
 * The purpose of the following method is to return success message.
 * @param relationName
 * @param boxName
 * @returns {String}
 */
relationToExternalCellMapping.prototype.getSuccessMessage = function(relationName,boxName) {
var successMessage = "Configuration with External cell "+sessionStorage.selectedExtCellName+" deleted successfully!";
return successMessage;
};


/**
 * The purpose of the following method is to delete mapping.
 * 
 * @returns
 */
relationToExternalCellMapping.prototype.deleteRelationExtCellMapping = function(selectedExtCellDetail) {
	var extCellUrl = objRelationToExternalCellMapping.getExtCellUrlForDelete(selectedExtCellDetail);
	extCellUrl = extCellUrl.replace(/'/g, " ").split(' ').join('');
	var externalCellURI = encodeURIComponent(extCellUrl);
	var accessor = objCommon.initializeAccessor(getClientStore().baseURL,
			sessionStorage.selectedcell, "", "");
	var context = new _pc.AbstractODataContext(accessor);
	var objLinkManager = new _pc.LinkManager(accessor, context);
	var relationName = sessionStorage.relationName;
	var mainBoxValue = getUiProps().MSG0039;
	var boxName = sessionStorage.boxName;
	var key = "(Name='" + relationName + "'";
	if (boxName == mainBoxValue) {
		boxName = null;
	}
	if (boxName !== undefined && boxName !== null && boxName !== getUiProps().MSG0293) {
		key += ",_Box.Name='" + boxName + "'";
	}
	key += ")";
	var response = objLinkManager.delLink(context, "Relation", "ExtCell", key,
			externalCellURI);
	return response;
};

/**
 * The purpose of the following method is to close pop up window.
 */
relationToExternalCellMapping.prototype.closePopup = function() {
	$('#relationToExtCellMappingDeleteModalWindow').hide();
	return false;
};

/**
 * The purpose of this function is to extract external cell name from external
 * cell url.
 */
relationToExternalCellMapping.prototype.getExternalCellNameFromURI = function(
		uri) {
	var extCellIndex = uri.lastIndexOf("/");
	var extCellFromURI = uri.substring(extCellIndex, uri.length);
	var extCellName = objCommon
			.getEnityNameAfterRemovingSpecialChar(extCellFromURI);
	if (extCellName.length == 0) {
		extCellName = undefined;
	}
	return extCellName;
};

/**
 * The purpose of this function is to refresh external cell after every
 * successful transaction
 */
relationToExternalCellMapping.prototype.refreshTable = function() {
	$(".dynamicExtCellDetRow").remove();
};

/**
 * The purpose of this function is to call function on ready state of page
 */
relationToExternalCellMapping.prototype.loadRelationToExtCellMappingPage = function() {
	if (sessionStorage.tabName == "Relation") {
		objRelationToExternalCellMapping.bindExternalCellDropDown();
		objRelationToExternalCellMapping.createTable();
	}
	$("#btnAssignRelationToExtCell").click(function() {
		objRelationToExternalCellMapping.configureRelationToExternalCell();
});
};

/**
 * The purpose of this function is to apply dynamic css on grid in
 * presence of scrollbar.
 */
relationToExternalCellMapping.prototype.applyScrollCssOnRelationExtCellLinkGrid = function() {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRelationExtCellLinkTable td:eq(1)").css("width", '40.1%');
	}
};

relationToExternalCellMapping.prototype.enableDisableAssignRelationToExtCellBtn = function() {
	var selectedRoleName = objRelationToExternalCellMapping.getSelectedExternalCell();
	 $("#btnAssignRelationToExtCell").attr('disabled', 'disabled');
	 $("#btnAssignRelationToExtCell").addClass('assignBtnDisabled');
	if (selectedRoleName != null) {
		 $("#btnAssignRelationToExtCell").removeAttr("disabled");
		 $("#btnAssignRelationToExtCell").removeClass('assignBtnDisabled');
	}
};

relationToExternalCellMapping.prototype.getExtCellUrlForDelete = function(selectedExtCellDetails) {  
	var arrExtCells = selectedExtCellDetails.split(objCommon.startBracket);
	var extCellUrl = arrExtCells[0];
	return extCellUrl; 
	};
	
	/**
	 * Following method fetches all relation to external cell data.
	 * @returns json.
	 */
	relationToExternalCellMapping.prototype.retrieveAllRelationToExtCellJsonData = function () {
		var cellName = sessionStorage.selectedcell;
		var baseUrl = getClientStore().baseURL;
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var objRelationManager = new _pc.RelationManager(accessor);
		var uri = objRelationManager.getUrl();
		var key="";
		var relationName = sessionStorage.relationName;
		var boxName = sessionStorage.boxName;
		var mainBoxValue = getUiProps().MSG0039;
		var totalRecordCount = objRelationToExternalCellMapping.retrieveLinkedExtCellCount();
		key = "(Name='"+relationName+"')";
		if(boxName != null && boxName != mainBoxValue) {
			key = "(Name='"+relationName+"',_Box.Name='"+boxName+"')";
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
	var objRelationToExternalCellMapping = new relationToExternalCellMapping();
	objRelationToExternalCellMapping.loadRelationToExtCellMappingPage();
	objCommon.sortByDateHoverEffect();
	setDynamicAssignGridHeight();
	objCommon.assignBackBtnHoverEffect();
	$(window).resize(function () {
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
});
