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
function externalCellToRelationMapping(){}
var objExternalCellToRelationMapping = new externalCellToRelationMapping();
var sbSuccessfulExtCellToRelationMappedCount = 0;

var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;
/**
 * The purpose of this method is to retrieve total count of linked relation 
 * @returns
 */
externalCellToRelationMapping.prototype.retrieveLinkedRelationCount = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	var extCellUrl = sessionStorage.extCellURL;
	var key="";
	key = "('"+encodeURIComponent(extCellUrl)+"')";
	uri += key + "/"+"_Relation";
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};
/**
 * The purpose of this function is to retrieve chunked data from API.
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
externalCellToRelationMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	var extCellUrl = sessionStorage.extCellURL;
	var key="";
	key = "('"+encodeURIComponent(extCellUrl)+"')";
	uri += key + "/"+"_Relation";
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to perform check all functionality for check box
 * in extCell to Relation mapping grid.
 * @param cBox
 */
externalCellToRelationMapping.prototype.checkAll = function(cBox) {
	var buttonId = '#btnDeleteExtCellToRelationMapping';
	//objCommon.checkBoxSelect(cBox, buttonId);
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxExtCellRelationAssign', 49, document.getElementById("checkAllExtCellRelationAssign"));
	objCommon.showSelectedRow(document.getElementById("checkAllExtCellRelationAssign"),"row","rowidExtCellRelationLink");
	};

/**
 * The purpose of this function is to render external cell details on the page.
 */
externalCellToRelationMapping.prototype.showExtCellDetails = function(){
	/*var shortenUrl = objCommon.getShorterEntityName(sessionStorage.externalCellURI);
	var shortenName = objCommon.getShorterEntityName(sessionStorage.externalCellName);*/
	$("#extCellNameDiv").text("External Cell Name: "+sessionStorage.externalCellName);
	document.getElementById('extCellNameDiv').title = sessionStorage.externalCellName;
	$("#extCellUrlDiv").text("External Cell URL: "+sessionStorage.externalCellURI);
	document.getElementById('extCellUrlDiv').title = sessionStorage.externalCellURI;
	$("#extCellDateDiv").text("External Cell Date: "+sessionStorage.externalCellDate);
};

/**
 * The purpose of this function is to refresh the relation box dropdown.
 */
externalCellToRelationMapping.prototype.refreshRelationBoxDD = function(){
	$(".dynRelBoxOption").remove();
};

/**
 * The purpose of this function is to create dynamic dropdown for the relation box list.
 */
externalCellToRelationMapping.prototype.bindRelationBoxDD = function(id, relName, boxName) {
	var shortenRelName = objCommon.getShorterName(relName, 8);//objCommon.getShorterEntityName(relName);
	var shortenBoxName = objCommon.getShorterName(boxName, 9);//objCommon.getShorterEntityName(boxName);
	var relBoxValue = relName + objCommon.startBracket + boxName + objCommon.endBracket;
	var shortenRelBoxValue = shortenRelName + objCommon.startBracket + shortenBoxName + objCommon.endBracket;
	var option = "<option title='" + relBoxValue + "' class='dynRelBoxOption' id='relBox_" + id + "'>" + shortenRelBoxValue + "</option>";
	$("#ddlRelationBox").append(option);
};

/**
 * The purpose of this function is to parse json to fetch box and relation names.
 */
externalCellToRelationMapping.prototype.fetchRelationAndBox = function(jsonString) {
	for ( var i = 0; i < jsonString.length; i++) {
		var objRel = jsonString[i];
		var id = objRel.__metadata.etag;
		var relName = objRel.Name;
		var boxName = objRel['_Box.Name'];
		var mainBoxValue = getUiProps().MSG0039;
		if(boxName == null){
			boxName = mainBoxValue;
		}
		var objRelExtCellLink = new externalCellToRelationMapping();
		objRelExtCellLink.bindRelationBoxDD(id, relName, boxName);
	}
};

/**
 * This is the main method to fetch relation box dropdown.
 */
externalCellToRelationMapping.prototype.populateRelationBoxDD = function(){
	var objRelExtCellLink = new externalCellToRelationMapping();
	objRelExtCellLink.getRelationBoxAsJSON();
};

/**
* The purpose of this method is to call API to fetch relations associated with the selected cell.
*/
externalCellToRelationMapping.prototype.getRelationBoxAsJSON = function() {
	var token = getClientStore().token;
	var baseUrl  = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(baseUrl,sessionStorage.selectedcell.toString(), "", "");
	var accessor = objJdcContext.withToken(token);
	var count = retrieveRelationRecordCount();
	var objRelationManager = new _pc.RelationManager(accessor);
	var uri = objRelationManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	/*var json = objRelationManager.retrieve("");
	var jsonString = json.rawData;
	jsonString = sortByKey(jsonString, '__published');*/
	var objRelExtCellLink = new externalCellToRelationMapping();
	objRelExtCellLink.refreshRelationBoxDD();
	objRelExtCellLink.fetchRelationAndBox(json);
};

/**
 * The purpose of this function is to segregate relation and box names from selected dropdown value.
 */
externalCellToRelationMapping.prototype.getSelectedRelationAndBox = function(){
	var relBox = $("#ddlRelationBox").find("option:selected").attr("title");
	var relation = $.trim(relBox.split(objCommon.startBracket)[0]);
	var box = $.trim(relBox.split(objCommon.startBracket)[1]);
	return [relation,box];
};

/**
 * The purpose of this method is to create an object of jAbstractODataContext.
 * This method is accepting accessor as an input parameter.
 */
externalCellToRelationMapping.prototype.initializeAbstractDataContext = function(accessor) {
		var objAbstractDataContext =  new _pc.AbstractODataContext(accessor);
		return objAbstractDataContext;
};

/**
 * The purpose of this method is to set accessor.
 */
externalCellToRelationMapping.prototype.initializeAccessor = function() { 
	var token = getClientStore().token;
	var baseUrl  = getClientStore().baseURL; 
	var cellname = sessionStorage.selectedcell.toString();
	var objJdcContext = new _pc.PersoniumContext(baseUrl,cellname, "", "");
	var accessor = objJdcContext.withToken(token);
	return accessor;
};

/**
 * Global variable holding accessor.
 */
//externalCellToRelationMapping.prototype.accessor = initializeAccessor();

/**
 * Global variable holding context.
 */
//commented during merging not a valid function.
//externalCellToRelationMapping.prototype.context = initializeAbstractDataContext();

/**
 * Global variables holding source and destination values for creating link between external cell
 * and relation.
 */
externalCellToRelationMapping.prototype.source = "ExtCell";
externalCellToRelationMapping.prototype.destination = "Relation";

/**
* The purpose of this method is to create an object of jLinkManager.
**/
externalCellToRelationMapping.prototype.initializeLinkManager = function(){	
	var objRelExtCellLink = new externalCellToRelationMapping();
	var objLinkMgr = new _pc.LinkManager(objRelExtCellLink.initializeAccessor(), objRelExtCellLink.context);
	return objLinkMgr;
};

/**
* The purpose of this method is to reload the page after successful creation.
*/
externalCellToRelationMapping.prototype.reloadPanel = function() {
	addSuccessClass('#extCellToRelationMessageIcon');
	inlineMessageBlock(208,'#extCellToRelationMessageBlock');
	document.getElementById("extCellToRelationSuccessmsg").innerHTML = getUiProps().MSG0040;
	$("#ddlRelationBox").val(getUiProps().MSG0226);
	$("#btnAssignExtCellToRelation").attr('disabled', 'disabled');
	$("#btnAssignExtCellToRelation").addClass('assignBtnDisabled');
	objCommon.centerAlignRibbonMessage("#extCellToRelationMessageBlock");
	objCommon.autoHideAssignRibbonMessage("extCellToRelationMessageBlock");
};

//Start - Delete Mapping
/**
 * The purpose of the following method is to close pop up window.
 */
externalCellToRelationMapping.prototype.closePopup = function () {
$('#extCellToRelationDeleteModalWindow').hide(0);
return false;
};

/**
 * The purpose of the following method is to open pop up window.
 * @param relationName
 * @param boxName
 */

externalCellToRelationMapping.prototype.openPopUpWindow = function() {
	var response = objCommon.getMultipleSelections('mainExternalCellRelationLinkTable','input','case');
	sessionStorage.ExternalCellMappedRelations = response;
	var idDialogBox = '#extCellToRelationDeleteDialogBox';
	var idModalWindow = '#extCellToRelationDeleteModalWindow';
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$('#btnCancelExtCellToRelation').focus();
	//sessionStorage.selectedRelation = relationName;
	//sessionStorage.selectedBoxName = boxName;

};

/**
 * The purpose of the following method is to check if a box name is empty or not.
 * @param boxName
 * @returns {Boolean}
 */
externalCellToRelationMapping.prototype.isBoxNameEmpty = function(boxName) {  
	var mainBoxValue = getUiProps().MSG0039;
	if (boxName == mainBoxValue) {
		return true;
	}
};

/**
 * The purpose of the following method is to reload relation table.
 */
externalCellToRelationMapping.prototype.reloadTable = function() {
sessionStorage.removeItem("selectedRelation");
sessionStorage.removeItem("selectedBoxName");
objExternalCellToRelationMapping.createTable();	
};

/**
 * The purpose of the following method is to return success message.
 * @param relationName
 * @param boxName
 * @returns {String}
 */
externalCellToRelationMapping.prototype.getSuccessMessage = function(relationName,boxName) {
var mainBoxValue = getUiProps().MSG0039;
if (boxName == "null") { 
	boxName = mainBoxValue;
}
var relationBoxName = relationName + objCommon.linkIcon + boxName;	
var successMessage = "Configuration with Relation "+relationBoxName+" deleted successfully!";
return successMessage;
};

/**
 * The purpose of the following method is to delete mapping.
 * @returns
 */
externalCellToRelationMapping.prototype.deleteRelationBoxMapping = function(relationBoxPair) {
	var box = objExternalCellToRoleMapping.getBoxNameForDelete(relationBoxPair);
	box = box.replace(/'/g, " ").split(' ').join('');
	var mainBoxValue = getUiProps().MSG0039;
	if (box == mainBoxValue) {
		box = 'null';
	}
	var relation = objExternalCellToRoleMapping.getRoleNameForDelete(relationBoxPair);
	relation = relation.replace(/'/g, " ").split(' ').join('');
	var externalCellURI = encodeURIComponent(sessionStorage.externalCellURI);
	var context = objExternalCellToRoleMapping.initializeAbstractDataContext();
	var objLinkManager = objExternalCellToRoleMapping
			.initializeLinkManager(context);
	/*if (objExternalCellToRelationMapping
			.isBoxNameEmpty(sessionStorage.selectedBoxName)) {
		sessionStorage.selectedBoxName = null;
	}*/
	var response = objLinkManager.delLink(context,
			externalCellToRelationMapping.prototype.source,
			externalCellToRelationMapping.prototype.destination,
			externalCellURI, box,
			relation);
	return response;
};

/**
 * The purpose of the following method is to expunge relation and box mapping.
 */
externalCellToRelationMapping.prototype.removeRelationBoxMapping = function() {
	var relationBoxNames = sessionStorage.ExternalCellMappedRelations;
	var arrRelationBoxNames = relationBoxNames.split(',');

	var etagIDOfPreviousRecord = "txtExtCellToRelationMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#mainExternalCellRelationLinkTable');
	var idCheckAllChkBox = "#checkAllExtCellRelationAssign";
	var mappingType = "ExtCelltoRelation";
	var type = "assignExtCellTab";

	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord,
				arrEtag, "#chkBoxExtCellRelationAssign0",
				"#assignEntityGridTbody");
	}

	for ( var count = 0; count < arrRelationBoxNames.length; count++) {
		var response = objExternalCellToRelationMapping
				.deleteRelationBoxMapping(arrRelationBoxNames[count]);
		if (response.resolvedValue.status == 204) {
			sbSuccessfulExtCellToRelationMappedCount++;
			isDeleted = true;
		} else {
			arrDeletedConflictCount.push(count);
		}
	}
	addSuccessClass('#extCellToRelationMessageIcon');
	$('#extCellToRelationMessageBlock').css("display", 'table');
	// inlineMessageBlock(230,'#extCellToRelationMessageBlock');
	$('#extCellToRoleMessageBlock').css("display", 'table');
	document.getElementById("extCellToRelationSuccessmsg").innerHTML = sbSuccessfulExtCellToRelationMappedCount
			+ " "+getUiProps().MSG0376;
	// objExternalCellToRelationMapping.createTable();
	$("#ddlRelationBox").val(getUiProps().MSG0282);
	$("#btnAssignExtCellToRelation").attr('disabled', 'disabled');
	$("#btnAssignExtCellToRelation").addClass('assignBtnDisabled');
	$('#extCellToRelationDeleteModalWindow').hide(0);
	objCommon.centerAlignRibbonMessage("#extCellToRelationMessageBlock");
	objCommon.autoHideAssignRibbonMessage("extCellToRelationMessageBlock");
	sbSuccessfulExtCellToRelationMappedCount = 0;
	var recordCount = objExternalCellToRelationMapping
			.retrieveLinkedRelationCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			mappingType, recordCount, objExternalCellToRelationMapping,
			isDeleted);

};

/**
 * The purpose of the following method is to highlight selected row.
 * @param count
 */
externalCellToRelationMapping.prototype.highlightRow = function (count) { 
	var rowId = '#extCellDetailRw_'+count;
	$('#extCellDetailRw_'+count).siblings().removeClass('selectRow');
	$(rowId).siblings().removeClass('selectProfileRow');
	$(rowId).siblings().removeClass('selectRow');
	$(rowId).siblings().removeClass('greyBackGround');
	$(rowId).addClass('selectProfileRow');
	$(rowId).addClass('selectRow');
	$(rowId).addClass('greyBackGround');
	
	};

//END  - Delete Mapping

/**The purpose of this method is to create rows.
 * 
 */
externalCellToRelationMapping.prototype.createRows = function(dynamicTable,
		count, relationName, boxName, recordSize, extCellRelationLinkCount,etag) {
	var relationBoxName = boxName + objCommon.startBracket + relationName + objCommon.endBracket;
	dynamicTable += '<td style="width:1%"><input id = "txtExtCellToRelationMappingEtagId'+extCellRelationLinkCount+'" value='+etag+' type = "hidden" /><input title="'+extCellRelationLinkCount+'" id="chkBoxExtCellRelationAssign'
			+ extCellRelationLinkCount
			+ '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'+ relationBoxName + '""/><label for="chkBoxExtCellRelationAssign'
			+ extCellRelationLinkCount
			+ '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += "<td name = 'acc' style='max-width: 400px;width:49%'><div class = 'mainTableEllipsis'><label title='"+relationName+"' class='cursorPointer'>"
			+ relationName + "</label></div></td>";
	dynamicTable += "<td style='max-width: 400px;width:50%'><div class = 'mainTableEllipsis'><label title='"+boxName+"' class='cursorPointer'>"
			+ boxName + "</label></div></td>";
	dynamicTable += "</tr>";
	return dynamicTable;
};

/**
 * The purpose of this method is to create data table.
 * @returns {String}
 */
externalCellToRelationMapping.prototype.createTable = function() {
	$('#assignEntityGridTbody').empty();
	$('#checkAllExtCellRelationAssign').attr('checked', false);
	$("#btnDeleteExtCellToRelationMapping").attr('disabled', true);
	$("#btnDeleteExtCellToRelationMapping").removeClass('deleteIconEnabled');
	$("#btnDeleteExtCellToRelationMapping").addClass('deleteIconDisabled');
	var totalRecordsize =  objExternalCellToRelationMapping.retrieveLinkedRelationCount();
	if (totalRecordsize == 0) {
		var emptyMessage = getUiProps().MSG0240;
		objCommon.displayEmptyMessageInAssignGrid(emptyMessage, "assignExtCellTab", "checkAllExtCellRelationAssign");
	} else {
		$('#checkAllExtCellRelationAssign').removeAttr("disabled");
		document.getElementById("dvemptyAssignTableMessage").style.display = "none";
		var recordSize = 0;
		var json = objExternalCellToRelationMapping.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		objExternalCellToRelationMapping.createChunkedExtCellToRelationMappingTable(json, recordSize);
		var tableID = $('#mainExternalCellRelationLinkTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, objExternalCellToRelationMapping, json, objExternalCellToRelationMapping.createChunkedExtCellToRelationMappingTable,
				"assignExtCellTab");
		objCommon.checkCellContainerVisibility();
	}	
};

/**
 * The purpose of this function is to create table in chunked based on JSON dat aand
 * record size.
 * @param json
 * @param recordSize
 */
externalCellToRelationMapping.prototype.createChunkedExtCellToRelationMappingTable = function(json, recordSize) {
	$('#checkAllExtCellRelationAssign').attr('checked', false);
	objCommon.disableButton('#btnDeleteExtCellToRelationMapping');
	var dynamicExtCellRelationLinkTable = "";
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
	var extCellRelationLinkCount = 0;
	for ( var count = recordSize; count < maxLimit; count++) {
	var obj = json[count];
	var relationName = obj["Name"];
	var boxName = obj["_Box.Name"];
	var etag = obj.__metadata.etag;
	if (boxName == null) {
	boxName = getUiProps().MSG0039;
	trimmedBoxName = getUiProps().MSG0039;
	}
	dynamicExtCellRelationLinkTable += '<tr class="dynamicExtCellToRelationMappingRow" name="allrows" id="rowidExtCellRelationLink'+extCellRelationLinkCount+'" onclick="objCommon.rowSelect(this,'+ "'rowidExtCellRelationLink'" +','+ "'chkBoxExtCellRelationAssign'"+','+ "'row'" +','+ "'btnDeleteExtCellToRelationMapping'" +','+ "'checkAllExtCellRelationAssign'" +','+ extCellRelationLinkCount +',' + totalRecordsize +  ',' + "''" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainExternalCellRelationLinkTable'" + ');">';
	dynamicExtCellRelationLinkTable = objExternalCellToRelationMapping.createRows(dynamicExtCellRelationLinkTable, count, relationName, boxName, recordSize, extCellRelationLinkCount,etag);
	
	extCellRelationLinkCount++;
	}
	$("#mainExternalCellRelationLinkTable tbody").html(dynamicExtCellRelationLinkTable);
	if (jsonLength > 0) {
		$("#mainExternalCellRelationLinkTable thead tr").addClass('mainTableHeaderRow');
		$("#mainExternalCellRelationLinkTable tbody").addClass('mainTableTbody');
	}
	setTimeout(function() {
		objExternalCellToRelationMapping
				.applyScrollCssOnExtCellRelationLinkGrid();
	}, 300);
};
/**
 * The purpose of this function is to refresh the table after every successful operation.
 */
externalCellToRelationMapping.prototype.refreshTable = function(){
	$(".dynamicExtCellDetRow").remove();
};

/**
 * The purpose of this function is to check if select value of dropdwon is passed
 * during configuration of external cell with relation. 
 */
externalCellToRelationMapping.prototype.validateEmptyDD = function(){
	var relBox = $("#ddlRelationBox").val();
	if($.trim(relBox) == 'Select Relation -- Box Name'){
		//$("#selRelBoxDDMsg").text(getUiProps().MSG0041);
		return false;
	}else{
		//$("#selRelBoxDDMsg").text("");
		return true;
	}
};

/**
 * This function is called on page load.
 * It contains page initialization code.
 */
externalCellToRelationMapping.prototype.loadExtCellToRelationMappingPage = function() {
	var objRelExtCellLink = new externalCellToRelationMapping();
	if (sessionStorage.tabName == "External Cell") {
		//objRelExtCellLink.showExtCellDetails();
		objRelExtCellLink.populateRelationBoxDD();
		objRelExtCellLink.createTable();
	}
	
	$("#btnAssignExtCellToRelation").click(function() {
		//showSpinner("modalSpinnerExternalCellToRelationMapping");
		if (!objRelExtCellLink.validateEmptyDD()) {
			//removeSpinner("modalSpinnerExternalRelationRoleMapping");
			return false;
		}
		var arrRelBox = objRelExtCellLink.getSelectedRelationAndBox();
		var relation = arrRelBox[0];
		var box = arrRelBox[1];
		box = objCommon.getBoxSubstring(box);
		var objLinkManager = objRelExtCellLink.initializeLinkManager();
			var mainBoxValue = getUiProps().MSG0039;
			if (box == mainBoxValue) {
				box = null;
			}
				response = objLinkManager.establishLink(objRelExtCellLink.context,
										objRelExtCellLink.source,
										objRelExtCellLink.destination,
										encodeURIComponent(sessionStorage.externalCellURI),
										box, relation, false);
			// 204 is returned when the link has been successfully created.
			if (response.getStatusCode() == 204) {
				objRelExtCellLink.createTable();
				objRelExtCellLink.reloadPanel();
			}
			else if(response.getStatusCode() == 409){
				addErrorClass('#extCellToRelationMessageIcon');
				inlineMessageBlock(205,'#extCellToRelationMessageBlock');
				document.getElementById("extCellToRelationSuccessmsg").innerHTML = getUiProps().MSG0036;
				objCommon.resetAssignationDropDown("#ddlRelationBox", "#btnAssignExtCellToRelation", getUiProps().MSG0226);
				objCommon.centerAlignRibbonMessage("#extCellToRelationMessageBlock");
				objCommon.autoHideAssignRibbonMessage("extCellToRelationMessageBlock");
			}
		removeSpinner("modalSpinnerExternalCellToRelationMapping");
	});
};

/**
 * The purpose of this function is to apply dynamic css on grid in
 * presence of scrollbar.
 */
externalCellToRelationMapping.prototype.applyScrollCssOnExtCellRelationLinkGrid = function() {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainExternalCellRelationLinkTable td:eq(1)").css("width", '49.1%');
	}
};

/**
 * The purpose of this function is to enabe/disable assign button on 
 * the basis of drop down selection.
 */
externalCellToRelationMapping.prototype.enableDisableAssignExtCellToRelationBtn = function() {
	var selectedRelationName = objCommon.getSelectedEntity('ddlRelationBox');
	 $("#btnAssignExtCellToRelation").attr('disabled', 'disabled');
	 $("#btnAssignExtCellToRelation").addClass('assignBtnDisabled');
	if (selectedRelationName != false) {
		 $("#btnAssignExtCellToRelation").removeAttr("disabled");
		 $("#btnAssignExtCellToRelation").removeClass('assignBtnDisabled');
	}
};

/**
 * Following method fetches all the external cell to relation mapping data.
 * @returns json
 */
externalCellToRelationMapping.prototype.retrieveAllExtCellToRelationJsonData = function () {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	var extCellUrl = sessionStorage.extCellURL;
	var totalRecordCount = objExternalCellToRelationMapping.retrieveLinkedRelationCount();
	var key="";
	key = "('"+encodeURIComponent(extCellUrl)+"')";
	uri += key + "/"+"_Relation";
	uri = uri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

$(function() {
	var objRelExtCellLink = new externalCellToRelationMapping();
	objRelExtCellLink.loadExtCellToRelationMappingPage();
	objCommon.sortByDateHoverEffect();
	setDynamicAssignGridHeight();
	objCommon.assignBackBtnHoverEffect();
	$(window).resize(function () {
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
});