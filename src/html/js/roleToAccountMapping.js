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
function roleToAccountMapping() {
}

var roleName = sessionStorage.roleName;
var boxName = sessionStorage.boxName;
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

roleToAccountMapping.prototype.setRoleName = function(name) {
	roleName = name;
}
roleToAccountMapping.prototype.getRoleName = function() {
	return roleName;
}
roleToAccountMapping.prototype.setBoxName = function(name) {
	boxName = name;
}
roleToAccountMapping.prototype.getBoxName = function() {
	return boxName;
}

/**
 * The purpose of this function is to retrieve chunked data from API.
 * 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
roleToAccountMapping.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
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
	uri += key + "/"+"_Account";
	uri = uri + "?$orderby=__updated desc&$skip=" + lowerLimit + "&$top="
			+ upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to retrieve count of assigned account
 * to role.
 */
roleToAccountMapping.prototype.retrieveRoleAccountAssignRecordCount = function () {
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
	
	uri += key + "/"+"_Account";
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

//Global variables
var updatedOn = sessionStorage.updatedOn;
var accountCount = sessionStorage.accountCount;
var cellName = sessionStorage.selectedcell;
var mappingCount = 0;
var SOURCE = "Account";
var DESTINATION = "Role";
var isAvailable = false;
var sbSuccessfulRelation = '';
var sbConflictRelation = '';
var objRoleToAccountMapping = new roleToAccountMapping();

$(function() {
	$.ajaxSetup({ cache : false });
	bindAccountDropDown();
	loadRoleToAccountMappingPage();
	$(window).resize(function() {
		objCommon.setDynamicAssignEntityMaxwidth();
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
	objCommon.setDynamicAssignEntityMaxwidth();
	setDynamicAssignGridHeight();
	objCommon.assignBackBtnHoverEffect();
	objCommon.sortByDateHoverEffect();
});


/**
 * The purpose of this function is to set initially page control value afete
 * opening of mapping page 
 */
function loadRoleToAccountMappingPage() {
	if(sessionStorage.tabName == "Role"){
		createRoleToAccountMappingTable();
	}
}

/**
 * The purpose of this function is to check if a role already exists or not.
 */
function isRoleBoxExist() {
	var selectedAccountName = getSelectedAccount();
	var baseUrl  = getClientStore().baseURL; 
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var objLinkManager = objCommon.initializeLinkManager(accessor, context);
	var mainBoxValue = getUiProps().MSG0039;
	if(boxName == mainBoxValue) {
		boxName = null;
	}
	var response = objLinkManager.retrieveAccountRoleLinks(context, SOURCE, DESTINATION, selectedAccountName, boxName, roleName);
	if(response.getStatusCode() == 200) {
		var responseBody = response.bodyAsJson();
		var json = responseBody.d.results;
		for(var count = 0; count < json.length; count++) {
			var jsonBody = json[count];
			var listRoleName = objCommon.getRoleNameFromURI(jsonBody.uri);
			var listBoxName =  objCommon.getBoxNameFromURI(jsonBody.uri);
			if(listBoxName == "null") {
				listBoxName = null;
			}
			if(roleName == listRoleName && boxName == listBoxName) {
				isAvailable = true;
				return false;
			}
		}
	}
}

/**
 * The purpose of this function is to reload the top most panel.
 */
function reloadPanel() {
	var accountMappedSuccessMessage = getUiProps().MSG0035;
	addSuccessClass('#roleToAccountMessageIcon');
	//inlineMessageBlock(212,'#roleToAccountMessageBlock');
	$("#roleToAccountMessageBlock").css("display", 'table');
	document.getElementById("roleToAccountSuccessmsg").innerHTML = accountMappedSuccessMessage;
	objCommon.resetAssignationDropDown("#ddlAccount", "#assignAccountBtn", getUiProps().MSG0349);
	objCommon.centerAlignRibbonMessage("#roleToAccountMessageBlock");
	objCommon.autoHideAssignRibbonMessage("roleToAccountMessageBlock");
}

/**
 * The purpose of this function is to establish a link between a role
 * and an account.
 */
function linkRoleAndAccount() {
	showSpinner("modalSpinnerRoleAccountLink");
	var baseUrl  = getClientStore().baseURL; 
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var context = objCommon.initializeAbstractDataContext(accessor);
	var selectedAccountName = getSelectedAccount();
	if (selectedAccountName != null) {
		if(boxName == "") {
			boxName = null;
		}	
		isRoleBoxExist();
		if(isAvailable == false) {
			var objLinkManager = objCommon.initializeLinkManager(accessor, context);
			var response = objLinkManager.establishLink(context, SOURCE, DESTINATION, selectedAccountName, boxName, roleName);
			if(response.getStatusCode() == 204) {
				reloadPanel();
				createRoleToAccountMappingTable();
			}
		} else {
			var accountMappedConflictMessage = getUiProps().MSG0036;
			isAvailable = false;
			addErrorClass('#roleToAccountMessageIcon');
			//inlineMessageBlock(176,'#roleToAccountMessageBlock');
			$("#roleToAccountMessageBlock").css("display", 'table');
			document.getElementById("roleToAccountSuccessmsg").innerHTML = accountMappedConflictMessage;
			objCommon.resetAssignationDropDown("#ddlAccount", "#assignAccountBtn", getUiProps().MSG0349);
			objCommon.centerAlignRibbonMessage("#roleToAccountMessageBlock");
			objCommon.autoHideAssignRibbonMessage("roleToAccountMessageBlock");
		}
	}
	removeSpinner("modalSpinnerRoleAccountLink");
}

/**
 *  The purpose of this function is to prevent drop down from 
 * loading values again on page reload.
 */
function refreshAssignRoleToAccountDropDown() {
	var select = document.getElementById("ddlAccount");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0349;
	select.insertBefore(newOption, select.options[-1]);
}

/**
 * The purpose of this function is to get account details.
 */
function getAccountDetails() {
	var baseUrl  = getClientStore().baseURL; 
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objAccountManager = new _pc.AccountManager(accessor);
	var count = retrieveAccountRecordCount();
	var uri = objAccountManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
}

/**
 * The purpose of this function is to fetch the values of 
 * selected account.
 */
function getSelectedAccount() {
	var selectedAccount = null;
	var dropDown = document.getElementById("ddlAccount");
	if (dropDown.selectedIndex > 0 ) {
		selectedAccount = dropDown.options[dropDown.selectedIndex].title;
	}
	return selectedAccount;
}

/**
 * The purpose of this function is to bind the account drop down.
 */
function bindAccountDropDown() {
	refreshAssignRoleToAccountDropDown();
	var jsonString = getAccountDetails();
	var select = document.getElementById("ddlAccount");
	for(var count = 0; count < jsonString.length; count++) {
		var option = document.createElement("option");
		var objAccount = jsonString[count];
		var accName =objAccount.Name;
		var tooltipAccountName = objCommon.getShorterName(accName, 17);//objCommon.getShorterEntityName(accName);
		option.innerHTML = objAccount.Name;
		option.text = tooltipAccountName;
		option.title = objAccount.Name;
		select.appendChild(option);
	}
}

/**
 * The purpose of this function is to create row for RoleAccountLink Table .
 * 
 * @param dynamicTable
 * @param count
 * @param accountName
 * @param accountNameToolTip
 */
function createRowForRoleAccountLinkTable (dynamicRoleAccountLinkTable, count, accountName, accountNameToolTip, roleAccountLinkCount,etag) {
	dynamicRoleAccountLinkTable += '<td style="width:1%;"><input id =  "txtRoleToAccountMappingEtagId'+roleAccountLinkCount+'" value='+etag+' type = "hidden" /><input title="'+roleAccountLinkCount+'" id="chkBoxRoleAccountAssign'+roleAccountLinkCount+'" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'+accountName+'"/><label for="chkBoxRoleAccountAssign' + roleAccountLinkCount + '" class="customChkbox checkBoxLabel"></label></td>'; 
	dynamicRoleAccountLinkTable += "<td name = 'acc' style='max-width: 750px;width:99%;'><div class ='mainTableEllipsis'><label title='"+accountName+"' class='cursorPointer'>"+accountName+"</label></div></td>";
	dynamicRoleAccountLinkTable += "</tr>";
	return dynamicRoleAccountLinkTable;
}

function createRoleToAccountMappingTable() {
	$("#assignEntityGridTbody").empty();
	$('#checkAllRoleAccountAssign').attr('checked', false);
	objCommon.disableButton("#btnDeleteAssignRoleAccount");
	var totalRecordsize =  objRoleToAccountMapping.retrieveRoleAccountAssignRecordCount();
	if (totalRecordsize == 0) {
		objCommon.displayEmptyMessageInAssignGrid(getUiProps().MSG0238, "assignRoleTab", "checkAllRoleAccountAssign");
	} else {
		$("#checkAllRoleAccountAssign").removeAttr("disabled");
		document.getElementById("dvemptyAssignTableMessage").style.display = "none";
		var recordSize = 0;
		var json = objRoleToAccountMapping.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		createRoleToAccountMappingTableChunked(json, recordSize);
		var tableID = $('#mainRoleAccountLinkTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, objRoleToAccountMapping, json, createRoleToAccountMappingTableChunked,
				"assignRoleTab");
		objCommon.checkCellContainerVisibility();
	}
}

/**
 * The purpose of this function is to create dynamic table.
 */
function createRoleToAccountMappingTableChunked(json, recordSize) {
	$('#checkAllRoleAccountAssign').attr('checked', false);
	objCommon.disableButton('#btnDeleteAssignRoleAccount');
	var dynamicRoleAccountLinkTable = "";
	refreshRoleToAccountMappingTable();
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
	var roleAccountLinkCount = 0;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var accountName = obj["Name"];
		var etag = obj.__metadata.etag;
		//ToolTip
		var accountNameToolTip = objCommon.getShorterEntityName(accountName);
		dynamicRoleAccountLinkTable += '<tr class="dynamicRoleToAccountMappingRow" name="allrows" id="rowidRoleAccountLink'+roleAccountLinkCount+'" onclick="objCommon.rowSelect(this,'+ "'rowidRoleAccountLink'" +','+ "'chkBoxRoleAccountAssign'"+','+ "'row'" +','+ "'btnDeleteAssignRoleAccount'" +','+ "'checkAllRoleAccountAssign'" +','+ roleAccountLinkCount +',' + totalRecordsize +  ',' + "''" + ',' + "''" + ',' + "''" + ',' + "''" + ',' + "'mainRoleAccountLinkTable'" + ');">';
		dynamicRoleAccountLinkTable = createRowForRoleAccountLinkTable (dynamicRoleAccountLinkTable, count, accountName, accountNameToolTip, roleAccountLinkCount,etag);
			roleAccountLinkCount++;
	}
	$("#mainRoleAccountLinkTable tbody").html(dynamicRoleAccountLinkTable);
	if (jsonLength > 0) {
		$("#mainRoleAccountLinkTable thead tr").addClass('mainTableHeaderRow');
		$("#mainRoleAccountLinkTable tbody").addClass('mainTableTbody');
	}
}


/**
 * The purpose of this method is refresh pagination button
 * on table reload.
 */
function refreshRoleToAccountMappingTable() {
	$(".pagination").remove();
	$(".dynamicRoleToAccountMappingRow").remove();
}

/**
 * The purpose of this method is to select all checkboxes on click of header checkbox.
 */
function checkAllSelect(cBox){
	var buttonId = '#btnDeleteAssignRoleAccount';
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxRoleAccountAssign', 49, document.getElementById("checkAllRoleAccountAssign"));
	objCommon.showSelectedRow(document.getElementById("checkAllRoleAccountAssign"),"row","rowidRoleAccountLink");
}

/**
 * The purpose of this function is to display popup window for single or multiple delete
 */
function openRoleAccountAssignPopUp(){
	var response = objCommon.getMultipleSelections('mainRoleAccountLinkTable','input','case');
	sessionStorage.accountNames = response;
	$('#roleAccountMultipleDeleteModalWindow').fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$('#roleAccountMultipleDeleteDialogBox').css('top', windowHeight / 2 - $('#roleAccountMultipleDeleteDialogBox').height() / 2);
	$('#roleAccountMultipleDeleteDialogBox').css('left', windowWidth / 2 - $('#roleAccountMultipleDeleteDialogBox').width() / 2);
	$('#btnCancelDeleteRoleToAccountDeleteAssign').focus();
}

/**
 * handle single/multiple mapping delete operation
 */
function delRoleAccMapping() {
	showSpinner("modalSpinnerRoleAccountLink");
	var etagIDOfPreviousRecord = "txtRoleToAccountMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var tableID = $('#mainRoleAccountLinkTable');
	var idCheckAllChkBox = "#checkAllRoleAccountAssign";
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord,
				arrEtag, "#chkBoxRoleAccountAssign0", "#assignEntityGridTbody");
	}
	var mappings = sessionStorage.accountNames;
	var arrMappings = mappings.split(',');
	for ( var count = 0; count < arrMappings.length; count++) {
		var response = deleteMapping(arrMappings[count], true, count);
		if (response.resolvedValue.status == 204) {
			sbSuccessfulRelation += arrMappings[count] + ",";
		} else if (response.getStatusCode() == 409) {
			arrDeletedConflictCount.push(count);
			sbConflictRelation += arrMappings[count] + ",";
			sbConflictRelation.replace(/, $/, "");
		}
	}
	showDelStatusOnRibbon('#roleAccountMultipleDeleteModalWindow', '',
			'/templates/'+sessionStorage.selectedLanguage+'/roleToAccountMapping.html');
	removeSpinner("modalSpinnerRoleAccountLink");
	var recordCount = objRoleToAccountMapping
			.retrieveRoleAccountAssignRecordCount();
	var type = "assignRoleTab";
	var mappingType = "RoleToAccount";
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			mappingType, recordCount, objRoleToAccountMapping, isDeleted);

};

/**
 * core mapping delete operation
 * @param accountName
 */
function deleteMapping(accountName){
	var roleName = sessionStorage.roleName;
	var boxName = sessionStorage.boxName;
	var baseUrl  = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objLinkManager = new _pc.LinkManager(accessor);
	var context	= objCommon.initializeAbstractDataContext(accessor);
	var key="(Name='"+roleName+"'";
	var mainBoxValue = getUiProps().MSG0039;
	if(boxName == mainBoxValue){
		boxName = null;
	}
	if (boxName !== undefined && boxName !== null && boxName !== mainBoxValue) {
		key+=",_Box.Name='" + boxName + "'";
	}
	key+=")";
	return objLinkManager.delLink(context, "Role", "Account",key,accountName);
}


/**
 * @param id
 * @param statusCode
 * @param url
 * show delete operation status - single or multiple
 */
function showDelStatusOnRibbon(id, statusCode, url) {
		var conflictRelnDeleteLength = 0;
		var successfulRelnDeleteLength = 0;
		sbSuccessfulRelation = sbSuccessfulRelation.substring(0, sbSuccessfulRelation.length - 1);
		sbConflictRelation = sbConflictRelation.substring(0, sbConflictRelation.length - 1);
		$('#roleAccountMultipleDeleteModalWindow, .window').hide();
		conflictRelnDeleteLength = entityCount(sbConflictRelation);
		successfulRelnDeleteLength = entityCount(sbSuccessfulRelation);
		if(conflictRelnDeleteLength < 1 && successfulRelnDeleteLength > 0) {
			isDeleted = true;
			addSuccessClass('#roleToAccountMessageIcon');
			document.getElementById("roleToAccountSuccessmsg").innerHTML = successfulRelnDeleteLength+" "+getUiProps().MSG0350;
			sbSuccessfulRelation = '';
			sbConflictRelation = '';
		} else if(successfulRelnDeleteLength < 1 && conflictRelnDeleteLength > 0) {
			isDeleted = false;
			addErrorClass('#roleToAccountMessageIcon');
			document.getElementById("successmsg").innerHTML = conflictRelnDeleteLength+" "+getUiProps().MSG0351;
			sbSuccessfulRelation = '';
			sbConflictRelation = '';
		} else if(conflictRelnDeleteLength > 0 && successfulRelnDeleteLength > 0 ) {
			isDeleted = true;
			addErrorClass('#roleToAccountMessageIcon');
			document.getElementById("successmsg").innerHTML = successfulRelnDeleteLength+" "+getUiProps().MSG0323+" "+(conflictRelnDeleteLength + successfulRelnDeleteLength)+" "+getUiProps().MSG0350;
			sbSuccessfulRelation = '';
			sbConflictRelation = '';
		}
		$("#roleToAccountMessageBlock").css("display", 'table');
		$("#assignAccountBtn").attr('disabled', 'disabled');
		$("#assignAccountBtn").addClass('assignBtnDisabled');
		//createRoleToAccountMappingTable();
		$("#ddlAccount").val(getUiProps().MSG0349);
		objCommon.centerAlignRibbonMessage("#roleToAccountMessageBlock");
		objCommon.autoHideAssignRibbonMessage("roleToAccountMessageBlock");
}

/**
 * Following method fetches all role to account mapping data.
 * @returns json
 */
function retrieveAllRoleToAccountMappingJsonData() {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var uri = objRoleManager.getUrl();
	var mainBoxValue = getUiProps().MSG0039;
	var totalRecordCount = objRoleToAccountMapping.retrieveRoleAccountAssignRecordCount();
	var key="";
	key = "(Name='"+roleName+"')";
	if(boxName != null && boxName != mainBoxValue) {
		key = "(Name='"+roleName+"',_Box.Name='"+boxName+"')";
	}
	uri += key + "/"+"_Account";
	uri = uri + "?$orderby=__updated desc &$top="
			+ totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
}

function enableDisableAssignBtn() {
	var selectedAccountName = getSelectedAccount();
	 $("#assignAccountBtn").attr('disabled', 'disabled');
	 $("#assignAccountBtn").addClass('assignBtnDisabled');
	if (selectedAccountName != null) {
		 $("#assignAccountBtn").removeAttr("disabled");
		 $("#assignAccountBtn").removeClass('assignBtnDisabled');
	}
}
