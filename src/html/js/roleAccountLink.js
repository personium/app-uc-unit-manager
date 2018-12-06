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
//Global variable
function roleAccountLink() { 
}
var objRoleAccountLink = new roleAccountLink();
var objRoleAccountLink = new roleAccountLink();
var maxRows = 10;
var mappingCount = 0;
var SOURCE = "Account";
var DESTINATION = "Role";
var isAvailable = false;
var roleBoxCombination = "";
var boxNameForDelete = "";
var roleNameForDelete = "";
var totalRecordsize = "";
var sbSuccessfulAccountToRole = '';
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

/**
 * Following method fetch records.
 * @returns Number
 */
roleAccountLink.prototype.retrieveRecordCount = function () {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objAccountManager = new _pc.AccountManager(accessor);
	var uri = objAccountManager.getUrl();
	var accountName = sessionStorage.accountName;
	var key="";
	key = "('"+accountName+"')";
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
 * @returns json
 */
roleAccountLink.prototype.retrieveChunkedData = function (lowerLimit, upperLimit) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objAccountManager = new _pc.AccountManager(accessor);
	var uri = objAccountManager.getUrl();
	var accountName = sessionStorage.accountName;
	var key="";
	key = "('"+accountName+"')";
	uri += key + "/"+"_Role";
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * Following method populates table with data. 
 * @param json
 * @param recordSize
 */
function createChunkedAccountToRoleMappingTable(json, recordSize) {
	$('#chkSelectAllAccountMappingRecords').attr('checked', false);
	objCommon.disableButton('#btnDeleteAccountToRoleMapping');
	var dynamicAccountRoleLinkTable = "";
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
	var accountRoleLinkCount = 0;
	for ( var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var roleName = obj["Name"];
		var boxName = obj["_Box.Name"];
		if (boxName == null) {
			boxName = getUiProps().MSG0039;
			trimmedBoxName = getUiProps().MSG0039;
		}
		dynamicAccountRoleLinkTable += '<tr class="dynamicExtCellToRoleMappingRow" name="allrows" id="rowidAccountRoleLink'
				+ accountRoleLinkCount
				+ '" onclick="objCommon.rowSelect(this,'
				+ "'rowidAccountRoleLink'"
				+ ','
				+ "'chkAccountToRoleAssign'"
				+ ','
				+ "'row'"
				+ ','
				+ "'btnDeleteAccountToRoleMapping'"
				+ ','
				+ "'chkSelectAllAccountMappingRecords'"
				+ ','
				+ accountRoleLinkCount
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
				+ "'mainRoleAccountControlTable'" + ');">';
		dynamicAccountRoleLinkTable = createRows(
				dynamicAccountRoleLinkTable, count, roleName, boxName,
								recordSize, accountRoleLinkCount,obj.__metadata.etag);
		accountRoleLinkCount++;
	} 
	$("#mainRoleAccountControlTable tbody").html(dynamicAccountRoleLinkTable);
	if (jsonLength > 0) {
		$("#mainRoleAccountControlTable thead tr").addClass('mainTableHeaderRow');
		$("#mainRoleAccountControlTable tbody").addClass('mainTableTbody');
	}
	
	setTimeout(function() {
		applyScrollCssOnAccountRoleLinkGrid();	
		}, 300);
	
}

/**
 * Following method invokes method to populate table.
 */
function loadAccountRoleAssignationPage() {
	createRoleAccountLinksTable();
};

/**
 * The purpose of this method is to create an object of jAbstractODataContext.
 * This method is accepting accessor as an input parameter.
 */
function initializeAbstractDataContext(accessor) {
		var objAbstractDataContext =  new _pc.AbstractODataContext(accessor);
		return objAbstractDataContext;
}
	
/**
 * The purpose of this method is to sort the records in descending order.
 *
 */
function sortByKey(array, key) {
		return array.sort(function(firsthalf, secondhalf) {
		var firstPart = firsthalf[key];
		var secondPart = secondhalf[key];
		return ((secondPart < firstPart) ? -1 : ((firstPart > secondPart) ? 0 : 1));
	});
}

/**
* The purpose of this method is to check if records pertaining to a account are there are not.
*
*/
function isRecordExist(recordSize) {
		if (recordSize > 0) {
		document.getElementById("dvemptyTableMessage").style.display = "none";
	}
	else {
		//If record size is empty then a div displaying No roles mapped yet.
		document.getElementById("dvemptyTableMessage").style.display = "block";
	}
}

/**
 * The purpose of this method is to create headers.
 * @param dynamicTable
 * @returns
 */
function createHeaders(dynamicTable) {
	//Headers Start. 
	dynamicTable += "<tr>";
	dynamicTable += "<th class='col1'><input type='checkbox'  id='chkSelectall' onclick='checkAll(this)' class='checkBox cursorHand'/>";
	dynamicTable += "</th>";
	dynamicTable += "<th class='col2'>Role Name";
	dynamicTable += "</th>";
	dynamicTable += "<th colspan='2' class='col3'>Box Name";
	//Headers End.
	return dynamicTable;
}


/**
 * Following method create rows.
 */
function createRows(dynamicTable, count, roleName, boxName, recordSize,
		extCellRoleLinkCount,etag) {
	var roleBoxName = boxName + objCommon.startBracket + roleName + objCommon.endBracket;
	dynamicTable += '<td style="width:1%"><input id =  "txtRoleAccountMappingEtagId'+extCellRoleLinkCount+'" value='+etag+' type = "hidden" /><input title="'+extCellRoleLinkCount+'" id="chkAccountToRoleAssign'
			+ extCellRoleLinkCount
			+ '" type="checkbox" class="case regular-checkbox big-checkbox" name="case" value="'
			+ roleBoxName + '""/><label for="chkAccountToRoleAssign'
			+ extCellRoleLinkCount
			+ '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += "<td title="
			+ roleName
			+ " name = 'acc' style='max-width: 280px;width:49%'><div class = 'mainTableEllipsis'>"
			+ roleName + "</div></td>";
	dynamicTable += "<td title="
			+ boxName
			+ " style='max-width: 285px;width:50%'><div class = 'mainTableEllipsis'>"
			+ boxName + "</div></td>";
	dynamicTable += "</tr>";

	return dynamicTable;
};

/**
 * The purpose of this method is to create dynamic table.
 * 
 */
function createRoleAccountLinksTable() {
		$('#assignEntityGridTbody').empty();
		$('#chkSelectAllAccountMappingRecords').attr('checked', false);
		$("#btnDeleteAccountToRoleMapping").attr('disabled', true);
		$("#btnDeleteAccountToRoleMapping").removeClass('deleteIconEnabled');
		$("#btnDeleteAccountToRoleMapping").addClass('deleteIconDisabled');
		var totalRecordsize = objRoleAccountLink.retrieveRecordCount();
		if (totalRecordsize == 0) {
			objCommon.displayEmptyMessageInAssignGrid(getUiProps().MSG0241, "assignAccountTab", "chkSelectAllAccountMappingRecords");
			
		} else {
			$('#chkSelectAllAccountMappingRecords').removeAttr("disabled");
			document.getElementById("dvemptyAssignTableMessage").style.display = "none";
			var recordSize = 0;
			var json = objRoleAccountLink.retrieveChunkedData(objCommon.minRecordInterval,
					objCommon.noOfRecordsToBeFetched);
			createChunkedAccountToRoleMappingTable(json, recordSize);
			var tableID = $('#mainRoleAccountControlTable');
			var objAccountToRoleMapping =  new roleAccountLink();
			objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
					tableID, objAccountToRoleMapping, json, createChunkedAccountToRoleMappingTable,
					"assignAccountTab");
			objCommon.checkCellContainerVisibility();
		}	
}
	
/**
 * The purpose of this method is to set accessor.
 * 
 */
function initializeAccessor() { 
	var token = getClientStore().token;
	var baseUrl  = getClientStore().baseURL; 
	var cellname = sessionStorage.selectedcell.toString();
	var objJdcContext = new _pc.PersoniumContext(baseUrl,cellname, "", "");
	var accessor	=	objJdcContext.withToken(token);
	return accessor;
}

/**
* The purpose of this method is to create an object of jLinkManager.
* 
**/
function initializeLinkManager() {
	var accessor = initializeAccessor();
	var context	= initializeAbstractDataContext(accessor);
	var objLinkMgr = new _pc.LinkManager(accessor, context);
	return objLinkMgr;
}
	
/**
* The purpose of this method is to fetch the Box name from the uri. 
* 
*/
function getBoxName(uri) {
	var matchBoxName = uri.match(/\,_Box\.Name='(.+)'/);
	if (matchBoxName) {
		return matchBoxName[1];
	}

	return null;
}
	
/**
* The purpose of this method is to fetch a role name  from the uri. 
* 
*/
function getRoleName(uri) {
	var matchName = uri.match(/\(Name='(.+)',/);
	if (matchName) {
		return matchName[1];
	}

	return null;
}
	
/**
* The purpose of this method is to check if a role already exists or not.
* 
*/
function isRoleBoxExist () {
	
	var arrRole = objCommon.getSelectedEntity("ddlRoleBox");
	var role = arrRole[0].split(' ').join('');
	var box = arrRole[1].split(' ').join('');
	var objLinkManager = initializeLinkManager();
	if (box == getUiProps().MSG0293) {
			box = null;
	}
	var accessor = initializeAccessor();
	var context	= initializeAbstractDataContext(accessor);
	var response = objLinkManager.retrieveAccountRoleLinks(context, SOURCE, DESTINATION,sessionStorage.accountName, box, role);
	if (response.getStatusCode() == 200) {
		var responseBody = response.bodyAsJson();
		var json = responseBody.d.results;
		for ( var i = 0; i < json.length; i++) {
			var jsonBody = json[i];
			var roleName = getRoleName(jsonBody.uri);
			var boxName =  getBoxName(jsonBody.uri);
			if (boxName == "null" ) {
				boxName = null;
			}
			if (role == roleName && box == boxName) {
				isAvailable = true;
				return false;
			}
		}
	}
}

/**
* The purpose of this method is to reload the top most panel.
* 
*/
function reloadPanel() {
	var roleMessage = getUiProps().MSG0025;
	addSuccessClass('#accountToRoleMessageIcon');
	inlineMessageBlock(220,'#accountToRoleMessageBlock');
	document.getElementById("accountToRoleSuccessmsg").innerHTML = roleMessage;
	$("#ddlRoleBox").val(getUiProps().MSG0225);
	$("#btnAssignAccountToRole").attr('disabled', 'disabled');
	$("#btnAssignAccountToRole").addClass('assignBtnDisabled');
	objCommon.centerAlignRibbonMessage("#accountToRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("accountToRoleMessageBlock");
}

/**
* The purpose of this method is to establish a link between an Account and a role.
* 
*/
function linkAccountAndRole() {
	//document.getElementById("selectRoleBoxDDMsg").innerHTML = "";
	showSpinner("modalSpinnerAcctRoleMap");
	//var roleBoxDropdownMessage = getUiProps().MSG0055;
	var mainBox = getUiProps().MSG0039;
	var arrRole = objCommon.getSelectedEntity("ddlRoleBox");
	if (arrRole == false) {
		//document.getElementById("selectRoleBoxDDMsg").innerHTML = roleBoxDropdownMessage;
		removeSpinner("modalSpinnerAcctRoleMap");
		return false;
	}
	var role = arrRole[0].split(' ').join('');
	var box = arrRole[1].split(' ').join('');
	box = objCommon.getBoxSubstring(box);
	//isRoleBoxExist();
	var accessor = initializeAccessor();
	var context	= initializeAbstractDataContext(accessor);
	//if (isAvailable == false) {
		var objLinkManager = initializeLinkManager();
		if (box == mainBox) {
			box = null;
		}
		response = objLinkManager.establishLink(context, SOURCE, DESTINATION,
				sessionStorage.accountName, box, role);
		// 204 is returned when the link has been successfully created.
		if (response.getStatusCode() == 204) {
			// Loading grid with updated values.
			reloadPanel();
			createRoleAccountLinksTable();
		} else if (response.getStatusCode() == 409) {
			addErrorClass('#accountToRoleMessageIcon');
			inlineMessageBlock(210,'#accountToRoleMessageBlock');
			document.getElementById("accountToRoleSuccessmsg").innerHTML = getUiProps().MSG0036;
			$("#ddlRoleBox").val(getUiProps().MSG0225);
			$("#btnAssignAccountToRole").attr('disabled', 'disabled');
			$("#btnAssignAccountToRole").addClass('assignBtnDisabled');
			objCommon.centerAlignRibbonMessage("#accountToRoleMessageBlock");
			objCommon.autoHideAssignRibbonMessage("accountToRoleMessageBlock");
		}
	removeSpinner("modalSpinnerAcctRoleMap");
}

/**
* The purpose of this method is to prevent drop down from loading values again on page reload.
*/
function refreshRoleBoxDropDown() {
	var select = document.getElementById("ddlRoleBox");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0225;
	select.insertBefore(newOption, select.options[-1]);
}

/**
* The purpose of this method is to establish a link between an Account and a role.
* 
*/
function getRoleBox() {
	var accessor = initializeAccessor();
	var objRoleManager = new _pc.RoleManager(accessor);
	var count = retrieveRoleRecordCount();
	var uri = objRoleManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
}


/**
* The purpose of this method is to bind the Role Box drop down.
* 
*/
function bindRoleBoxDropDown() {
	refreshRoleBoxDropDown();
	var jsonString = getRoleBox();
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
		var tooltipRoleBoxName = objCommon.getShorterName(option.innerHTML, 17);//objCommon.getShorterEntityName(option.innerHTML);
		option.text = tooltipRoleBoxName ;
		select.appendChild(option);
	}
}

 /** 
  * The purpose of this function is to check/uncheck all the checkboxes.
  */
 function checkAll(cBox) {
	var buttonId = '#btnDeleteAccountToRoleMapping';
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkAccountToRoleAssign', 49, document.getElementById("chkSelectAllAccountMappingRecords"));
	objCommon.showSelectedRow(document.getElementById("chkSelectAllAccountMappingRecords"), "row",
			"rowidAccountRoleLink");
}

/**
 * The purpose of the following method is to close Mapping window.
 */
function closeMapping() {
	$('#singleDeleteMappingModalWindow, .window').hide();
	$('#multipleDeleteMappingModalWindow, .window').hide();
	$("#mainContent").load(contextRoot+'/templates/'+sessionStorage.selectedLanguage+'/roleAccountLinkControl.html', function() {
		if (navigator.userAgent.indexOf("Firefox") != -1) {
			loadAccountRoleAssignationPage();
		}
	});
	dvRoleCount.innerHTML = "";
	sessionStorage.rolecount = mappingCount;
	dvRolesMapped.innerHTML = mappingCount + " Role(s) Mapped";
}

/**
 * The followig method is used for opening pop up window.
 * @param idDialogBox
 * @param idModalWindow
 */ 
 function openPopUpWindow(idDialogBox, idModalWindow) {
		if (idDialogBox === '#multipleDeleteAccountToRoleMappingDialogBox') {
			var response = objCommon.getMultipleSelections('mainRoleAccountControlTable','input','case');
			sessionStorage.RoleBoxName = response;
			//getMultipleRoleNames();
		}
		$(idModalWindow).fadeIn(0);			
		var windowHeight = $(window).height();
		var windowWidth = $(window).width();
		$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
		$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
		$("#btnCancelAccountToRoleAssign").focus();
	}

// Methods for Deleting Mapping START.
function displayRolesMappedCount(count) { 
	sbSuccessfulAccountToRole = '';
	mappingCount = mappingCount - parseInt(count);
	dvRoleCount.innerHTML = "";
	sessionStorage.rolecount = mappingCount;
	dvRolesMapped.innerHTML = mappingCount + " Role(s) Mapped";
}

/**
 * The purpose of this method is to delete multiple mappings.
 */
function deleteMultipleMappings() {
	sbSuccessfulAccountToRole = '';
	// showSpinner("modalSpinnerAcctRoleMap");
	var roleBoxNames = sessionStorage.RoleBoxName;
	var arrRoleBoxNames = roleBoxNames.split(',');
	var etagIDOfPreviousRecord = "txtRoleAccountMappingEtagId";
	var arrEtag = new Array();
	var etagValue = '';
	var idCheckAllChkBox = "#chkSelectAllAccountMappingRecords";
	var tableID = $('#mainRoleAccountControlTable');
	if (!$("#chkSelectAllAccountMappingRecords").is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord,
				arrEtag, "#chkAccountToRoleAssign0", "#assignEntityGridTbody");
	}
	for ( var count = 0; count < arrRoleBoxNames.length; count++) {
		deleteMapping(arrRoleBoxNames[count], count);
	}
	displayMappingMessage();
	var type = "assignAccountTab";
	var recordCount = objRoleAccountLink.retrieveRecordCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, objRoleAccountLink, isDeleted);

}

/**
 * The purpose of following method is to retrieve box name from the role box combination.
 * @param roleName
 * @returns
 */
function getBoxNameForDelete(roleName) {
var arrRoleBoxNames = roleName.split(objCommon.startBracket);
var boxName = arrRoleBoxNames[0];
return boxName; 
}

/**
 * The purpose of following method is to retrieve role name from the role box combination.
 * @param roleName
 * @returns
 */
function getRoleNameForDelete(roleName) {
var arrRoleBoxNames = roleName.split(objCommon.startBracket);
var roleName = arrRoleBoxNames[1];
roleName = objCommon.getBoxSubstring(roleName);
return roleName; 
}

/**
 * The purpose of this method is to delete  mapping on the basis of account name.
 * @param accName
 */
function deleteMapping(roleName,count) {
	var box = getBoxNameForDelete(roleName);
	box = box.replace(/'/g, " ").split(' ').join('');
	var mainBoxValue = getUiProps().MSG0039;
	if (box == mainBoxValue) {
		box = 'null';
	}
	var role = getRoleNameForDelete(roleName);
	role = role.replace(/'/g, " ").split(' ').join('');
	accountName = sessionStorage.accountName;
	var accessor = initializeAccessor();
	var context = initializeAbstractDataContext(accessor);
	var objLinkManager = new _pc.LinkManager(accessor);
	// split role Name in to role and Box.
	var response = objLinkManager.delLink(context, SOURCE, DESTINATION,
			accountName, box, role);
	if (response.resolvedValue.status == 204) {
		roleBoxCombination = role + " -- " + box;
		sbSuccessfulAccountToRole += roleBoxCombination + ",";
	} else {
		arrDeletedConflictCount.push(count);
	}
}

/**
 * The purpose of the following method is yto displey message on deletion of mappings.
 */
function displayMappingMessage() {
	var successfulRoleBoxLength = 0;
	sbSuccessfulAccountToRole = sbSuccessfulAccountToRole.substring(0, sbSuccessfulAccountToRole.length - 1);
	$('#multipleDeleteAccountToRoleMappingModalWindow, .window').hide();
	successfulRoleBoxLength = entityCount(sbSuccessfulAccountToRole);
	if (successfulRoleBoxLength > 0) {
		isDeleted = true;
		addSuccessClass('#accountToRoleMessageIcon');
		document.getElementById("accountToRoleSuccessmsg").innerHTML = successfulRoleBoxLength
				+ " " + getUiProps().MSG0100;
		
		$("#accountToRoleMessageBlock").css("display", 'table');
		$("#btnAssignAccountToRole").attr('disabled', 'disabled');
		$("#btnAssignAccountToRole").addClass('assignBtnDisabled');
		//createRoleAccountLinksTable();
		$("#ddlRoleBox").val(getUiProps().MSG0225);
		objCommon.centerAlignRibbonMessage("#accountToRoleMessageBlock");
		objCommon.autoHideAssignRibbonMessage("accountToRoleMessageBlock");
		sbSuccessfulAccountToRole = '';
	}
	//removeSpinner("modalSpinnerAcctRoleMap");
}

/**;
* The purpose of this function is to get account information.
*/
function getMultipleRoleNames() {
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
	sessionStorage.RoleBoxName = roleName;
}
/**
 * The purpose of this function is to apply dynamic css on grid in
 * presence of scrollbar.
 */
function applyScrollCssOnAccountRoleLinkGrid() {
	var tbodyObject = document.getElementById("assignEntityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRoleAccountControlTable td:eq(1)").css("width", '49.1%');
	}
}

// Methods for Deleting Mapping END.

function enableDisableAssignAccoutnToRoleBtn() {
	var selectedAccountName = objCommon.getSelectedEntity("ddlRoleBox");
	 $("#btnAssignAccountToRole").attr('disabled', 'disabled');
	 $("#btnAssignAccountToRole").addClass('assignBtnDisabled');
	if (selectedAccountName != false) {
		 $("#btnAssignAccountToRole").removeAttr("disabled");
		 $("#btnAssignAccountToRole").removeClass('assignBtnDisabled');
	}
}

/**
 * Following method fetches all account to role mapping data.
 * @returns json
 */
function retrieveAllRoleAccountLinkJsonData() {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objAccountManager = new _pc.AccountManager(accessor);
	var totalRecordCount = objRoleAccountLink.retrieveRecordCount();
	var uri = objAccountManager.getUrl();
	var accountName = sessionStorage.accountName;
	var key="";
	key = "('"+accountName+"')";
	uri += key + "/"+"_Role";
	uri = uri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
}

$(document).ready(function() {
	bindRoleBoxDropDown();
	setDynamicAssignGridHeight();
	objCommon.setDynamicAssignEntityMaxwidth();
	$(window).resize(function() {
		objCommon.setDynamicAssignEntityMaxwidth();
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
	$("#lblAccountName").html(sessionStorage.accountName);
	$("#lblAccountName").attr('title', sessionStorage.accountName);
	$("#txtAssignRoleBoxName").attr("placeholder", getUiProps().MSG0242);
	loadAccountRoleAssignationPage();
	objCommon.assignBackBtnHoverEffect();
	objCommon.sortByDateHoverEffect();
});


$(document).ready(function() {
	bindRoleBoxDropDown();
	setDynamicAssignGridHeight();
	objCommon.setDynamicAssignEntityMaxwidth();
	$(window).resize(function() {
		objCommon.setDynamicAssignEntityMaxwidth();
		if ($('#dvemptyAssignTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfAssignEmptyMessage();
		}
	});
	$("#lblAccountName").html(sessionStorage.accountName);
	$("#lblAccountName").attr('title', sessionStorage.accountName);
	$("#txtAssignRoleBoxName").attr("placeholder", getUiProps().MSG0242);
	loadAccountRoleAssignationPage();
	objCommon.assignBackBtnHoverEffect();
	objCommon.sortByDateHoverEffect();

});
