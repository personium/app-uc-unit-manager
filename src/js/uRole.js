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

function uRole(){}
var objRole = new uRole();

var maxRows=10;
var totalRecordsize = 0;
var cellName = sessionStorage.selectedcell;
var roleName = sessionStorage.roleName;
var boxName = sessionStorage.boxName;
var contextRoot = sessionStorage.contextRoot;
var sbSuccessful = '';
var sbConflict = '';
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

/**
 * The purpose of this method is to fetch the required records as per pagination. 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
uRole.prototype.retrieveChunkedData = function (lowerLimit, upperLimit) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var dataUri = objRoleManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
};

/**
 * The purpose of this function is to call the createTable function
 * for displaying role list
 */
$(document).ready(function(){
	$.ajaxSetup({ cache : false });
	if(sessionStorage.tabName == "Role"){
		loadRolePage();
	}
	objCommon.creatEntityHoverEffect();
	objCommon.sortByDateHoverEffect();
	setDynamicGridHeight();
	$(window).resize(function () {
		if ($('#dvemptyTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfEmptyMessage();
		}
	});
});

function loadRolePage() {
	createRoleTable();
	retrieveBox("dropDownBox");
	objCommon.checkCellContainerVisibility();
}

/**
 * The purpose of this method is perform role delete operation
 * on the basis of role box pair.
 */
function deleteRole(roleBoxPair,count) {
	var boxName = null;
	var mainBoxValue = getUiProps().MSG0039;
	var arrRoleBox = roleBoxPair.split(" ");
	var roleName = arrRoleBox[0].split(' ').join('');
	if (arrRoleBox[1] != undefined && arrRoleBox[1] != mainBoxValue) {
		boxName = arrRoleBox[1].split(' ').join('');
		if (boxName == mainBoxValue) {
			boxName = null;
		}
	}
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var objRoleManager = new _pc.RoleManager(accessor);
	var response = objRoleManager.del(roleName, boxName);
	try {
		if (response.resolvedValue.status == 204) {
			sbSuccessful += roleName + ",";
		} 
	} 
	catch (exception) {
		arrDeletedConflictCount.push(count);
		sbConflict += roleName + ",";
		sbConflict.replace(/, $/, "");	
	}
}

/**
 * The purpose of this method is perform multiple delete operation
 */
uRole.prototype.deleteMultipleRoles = function() {
	showSpinner("modalSpinnerRole");
	var roles = sessionStorage.RoleNames;
	var roleBoxPair = roles.replace(/"/g,"").replace(/'/g,"");
	var arrRoles = roleBoxPair.split(',');
	var etagIDOfPreviousRecord = "txtHiddenEtagId";
	var arrEtag = [];
	var etagValue = '';
	var tableID = $('#mainRoleTable');
	var idCheckAllChkBox = "#chkSelectall";
	//if (!$("#chkSelectall").is(':checked')) {
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBox0");
	}
	
	for ( var count = 0; count < arrRoles.length; count++) {
		deleteRole(arrRoles[count],count);
	}
	this.displayMultipleRolesConflictMessage();
	removeSpinner("modalSpinnerRole");
	var type="Role";
	 var recordCount = retrieveRoleRecordCount();
		objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, objRole, isDeleted);
};

/**
 * The purpose of this method is display conflict message.
 */
uRole.prototype.displayMultipleRolesConflictMessage = function() {
	$('#multipleDeleteModalWindow, .window').hide();
	var conflictRoleDeleteLength = 0;
	var successfulRoleDeleteLength = 0;
	sbSuccessful = sbSuccessful.substring(0, sbSuccessful.length - 1);
	sbConflict = sbConflict.substring(0, sbConflict.length - 1);
	conflictRoleDeleteLength = entityCount(sbConflict);
	successfulRoleDeleteLength = entityCount(sbSuccessful);
	if(conflictRoleDeleteLength < 1 && successfulRoleDeleteLength > 0) {
		isDeleted = true;
		addSuccessClass('#roleMessageIcon');
		document.getElementById("roleSuccessmsg").innerHTML = successfulRoleDeleteLength+" "+getUiProps().MSG0332;
	} else if(successfulRoleDeleteLength < 1 && conflictRoleDeleteLength > 0) {
		isDeleted = false;
		addErrorClass('#roleMessageIcon');
		document.getElementById("roleSuccessmsg").innerHTML = conflictRoleDeleteLength+" "+getUiProps().MSG0333;
		
	} else if(conflictRoleDeleteLength > 0 && successfulRoleDeleteLength > 0 ) {
		isDeleted = true;
		addErrorClass('#roleMessageIcon');
		document.getElementById("roleSuccessmsg").innerHTML = successfulRoleDeleteLength+" "+getUiProps().MSG0323+" "+(conflictRoleDeleteLength + successfulRoleDeleteLength)+" "+getUiProps().MSG0332;
	}
	sbSuccessful = '';
	sbConflict = '';
	$("#roleMessageBlock").css("display", 'table');
	//createRoleTable();
	objCommon.centerAlignRibbonMessage("#roleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("roleMessageBlock");
};

/**
 * The purpose of this function is to get role name.
 */
function getRoleName(roleName,boxName) {
	var mainBoxValue = getUiProps().MSG0039;
	openSingleDeleteRole();
	if (boxName == mainBoxValue) {
		boxName = undefined;
	}
	sessionStorage.roleName = roleName;
	sessionStorage.boxName = boxName;
}

/**
 * The purpose of this function is to check/unckeck all the checkboxes.
 */
uRole.prototype.checkAll = function(cBox) {
	var buttonId = '#btnDeleteRole';
	objCommon.checkBoxSelect(cBox, buttonId, '#btnEditRole');
	$('#btnEditRole').attr('disabled', false);
	objCommon.showSelectedRow(document.getElementById("chkSelectall"), "row",
			"rowid");
	$("#btnEditRoleIcon").removeClass();
	$("#btnEditRoleIcon").addClass('editIconDisabled');
	$("#btnEditRoleIcon").attr("disabled", true);
	var noOfRecords = $("#mainRoleTable > tbody > tr").length;
	if ($("#chkSelectall").is(':checked')) {
		if (noOfRecords == 1) {
			$("#btnEditRoleIcon").removeClass();
			$("#btnEditRoleIcon").addClass('editIconEnabled');
			$('#btnEditRoleIcon').removeAttr("disabled");
		}
	}
};

/**
 * The purpose of this function is to get role information for multiple delete.
 */
uRole.prototype.getMultipleRoleNames = function() { 
	var len = document.fRoleTable.elements.length;
	var count = 0;
	var roleName = null;
	for (count = 0; count < len; count++) {
		if (document.fRoleTable.elements[count].name == "case") {
			if (document.fRoleTable.elements[count].checked) {
				var role = document.fRoleTable.elements[count].value;
				if (roleName == null) {
					roleName = role;
				} else {
					roleName = roleName + ',' + role;
				}
			}
		}
	}
	sessionStorage.RoleNames = roleName;
	
};

/**
 * The purpose of this function is to close Role popup
 */
function closeCreateRole() {
	document.getElementById("roleName").value='';
	$("#roleName").removeClass("errorIcon");
	document.getElementById("popupRoleErrorMsg").innerHTML = "";
	$('.popupContent').find('input:text').val('');
	$('.popupAlertmsg').html('');
	$('#dropDownBox').html('');
	$('#createRoleModal, .window').hide(0);
}

/**
 * Following function closes edit role pop up.
 */
function closeEditRolePopUp() {
	document.getElementById("txtEditRoleName").value='';
	objCommon.removePopUpStatusIcons('#txtEditRoleName');
	document.getElementById("editPopupRoleErrorMsg").innerHTML = "";
	$('#roleEditModalWindow, .window').hide(0);
}

/**
 * The purpose of this function is to close single and multiple role delete popup
 */
function closeDeleteRolePopup() {
	$('#multipleDeleteModalWindow, .window').hide(0);
	$('#singleDeleteModalWindow, .window').hide(0);
	$('#conflictModalwindow, .window').hide(0);
	$("#mainContent").load(contextRoot+'/htmls/roleListView.html');
}

/**
 * The purpose of this function is to open model window for single role delete
 */
function openSingleDeleteRole() {
	var id = '#singleDeleteDialogBox';
	$('#singleDeleteModalWindow').fadeIn(0);	
	var winH = $(window).height();
	var winW = $(window).width();
	$(id).css('top', winH / 2 - $(id).height() / 2);
	$(id).css('left', winW / 2 - $(id).width() / 2);
	
}

/**
 * The purpose of this method is to open model window for multiple delete operation
 */
uRole.prototype.openPopUpWindow= function(idDialogBox, idModalWindow ) {
	if (idDialogBox === '#multipleDeleteDialogBox') {
		this.getMultipleRoleNames();
	}
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$('#btnCancelRoleDelete').focus();
};

/**
 * The purpose of this method is to get account count linked with particular role 
 */
function getAccountCount(roleName,boxName,accessor){
	var mainBoxValue = getUiProps().MSG0039;
	var key = null;
	var accountCount =0;
	var baseUrl = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(baseUrl, cellName, "", "");
	var objLinkMgr = new _pc.LinkManager(accessor,objJdcContext );
	key = "(Name="+roleName+",_Box.Name="+boxName+")";
	if (boxName == "'"+mainBoxValue+"'") {
		key = "(Name="+roleName+")";
	}	
	var response = objLinkMgr.retrieveRoleAccountLinks(objJdcContext,"Role","Account",key);
	var responseBody = response.bodyAsJson();
	var json = responseBody.d.results;
	if (response.getStatusCode() == 200) {
		if(json.length > 0) {
			accountCount =	json.length;
		}
	}
	return accountCount;
}

/**
 * The purpose of this method is to create role table view as per pagination.
 * @param json
 * @param recordSize
 */
function createChunkedRoleTable(json, recordSize){
	$('#chkSelectall').attr('checked', false);
	$("#chkSelectall").attr('disabled', false);
	objCommon.disableButton('#btnDeleteRole');
	$("#btnEditRoleIcon").removeClass('editIconEnabled');
	$("#btnEditRoleIcon").addClass('editIconDisabled');
	$("#btnEditRoleIcon").attr("disabled", true);
	//$("#btnDeleteRole").attr('disabled', true);
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var mainBoxValue = getUiProps().MSG0039;
	var name = new Array();
	var etag = new Array();
	var updatedDate = new Array();
	var createdDate = new Array();
	var box = new Array();
	var dynamicTable = "";
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS+recordSize) < (jsonLength) ? (objCommon.MAXROWS+recordSize) : jsonLength;
	var roleRowCount = 0;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		etag[count] = obj.__metadata.etag;
		name[count] = obj.Name;
		updatedDate[count] = obj.__updated;
		createdDate[count] = obj.__published;
		var uri=obj._Box.__deferred.uri;
		var boxstart=uri.search("_Box.Name");
		var boxend=uri.search("/_Box");
		var boxprint=uri.substring(boxstart+10,boxend-1);
		var boxp=boxprint.replace(/'/g," ");
		box[count] = boxp;
		if (boxp == "null") {
		box[count] = mainBoxValue;
		} 
		var roleDate = objCommon.convertEpochDateToReadableFormat(""+ updatedDate[count]+"");
		var roleCreatedDate = objCommon.convertEpochDateToReadableFormat(""+ createdDate[count]+"");
		var roleName = "'"+ name[count]+"'" ;
		var	boxName = "'"+ box[count]+"'";
		boxName = boxName.split(' ').join('');
		var roleBoxPair = roleName+" "+boxName;
		var arrEtag = etag[count].split("/");
		var test = "'"+ arrEtag[0] +"'" ;
		var test1 =  arrEtag[1].replace(/["]/g,"");
		var test2 = "'"+ test1 +"'" ;
		var infoCreatedat = "'"+ roleCreatedDate +"'" ;
		var infoUpdatedat = "'"+ roleDate +"'" ;
		var infoSchema = "'"+ uri.replace(/[']/g,"`") +"'" ;
		
		//Rows Start
			dynamicTable += '<tr name = "allrows" id = "rowid'+roleRowCount+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteRole'" +','+ "'chkSelectall'" +','+ roleRowCount +',' + totalRecordsize + ','+ "'btnEditRole'" + ','+"''"+','+"''"+','+"''"+','+"'mainRoleTable'"+');">';
			dynamicTable += '<td style="width:1%"><input id =  "txtHiddenEtagId'+roleRowCount+'" value='+obj.__metadata.etag+' type = "hidden" /><input title="'+roleRowCount+'" id = "chkBox'+roleRowCount+'" type = "checkbox" class = "case cursorHand regular-checkbox big-checkbox" name = "case" value = "'+roleBoxPair+'" /><label for="chkBox'+roleRowCount+'" class="customChkbox checkBoxLabel"></label></td>';
			
			dynamicTable += '<td name = "acc" style="width:33%;max-width: 200px"><div class = "mainTableEllipsis"><a href = "#" id="roleNameLink" class="roleNameLink" onclick="openRoleAccountLinkMappingPage('+roleName+','+boxName+','+test+','+test2+','+infoCreatedat+', '+infoUpdatedat+','+infoSchema+');" title= "Configure this role in more details" tabindex ="-1" style="outline:none">'+name[count]+'</a></div></td>';//openRoleAccountLinkMappingPage('+roleName+','+boxName+','+roleDate+','+accountCount+');
			dynamicTable += "<td style='width:32%;max-width: 200px'><div class = 'mainTableEllipsis'><label title= '"+box[count]+"' class='cursorPointer'>"+box[count]+"</label></div></td>";
			dynamicTable += "<td style='width:17%'>"+roleCreatedDate+"</td>";
			dynamicTable += "<td style='width:17%'>"+roleDate+"</td>";
			roleDate = "'"+roleDate+"'";
			dynamicTable += "</tr>";
			roleRowCount++;
		//Rows End
	}	
	if (jsonLength >0) {
		$("#mainRoleTable thead tr").addClass('mainTableHeaderRow');
		$("#mainRoleTable tbody").addClass('mainTableTbody');
	}
	$("#mainRoleTable tbody").html(dynamicTable);
	setTimeout(function() {
		applyScrollCssOnRoleGrid();	
		}, 300);
}

/**
 * The purpose of this method is to create and initialize Role Manager.
 */
function createRoleManager(){
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var objRoleManager = new _pc.RoleManager(accessor);
	return objRoleManager;
}

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
function retrieveRoleRecordCount() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var uri = objRoleManager.getUrl();
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * Have the logic for creating grid for role
 */
function createRoleTable() {
	var token = getClientStore().token;
	sessionStorage.token = token;
	totalRecordsize = retrieveRoleRecordCount();
	if (totalRecordsize == 0) {
		objCommon.displayEmptyMessageInGrid(getUiProps().MSG0231, "Role");
		$("#chkSelectall").attr('checked', false);
		$("#chkSelectall").attr('disabled', true);
		$('#mainRoleTable tbody').empty();
		objCommon.disableButton("#btnDeleteRole");
		$("#btnEditRoleIcon").removeClass('editIconEnabled');
		$("#btnEditRoleIcon").addClass('editIconDisabled');
		$("#btnEditRoleIcon").attr("disabled", true);
	} else {
		$("#chkSelectall").attr('disabled', false);
		document.getElementById("dvemptyTableMessage").style.display = "none";
		var json = objRole.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
		var recordNo = 0;
		createChunkedRoleTable(json, recordNo);
		var tableID = $('#mainRoleTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS, tableID, objRole, json, createChunkedRoleTable, "Role");
		objCommon.checkCellContainerVisibility();
	}
}

/**
 * The purpose of this function is to check the existence of a role.
 * 
 * @param accessor
 * @param objJRole
 * @param objRoleManager
 */
function isExist(check, accessor, objJRole, objRoleManager) {
	//If role is new.
	if (check === true) {
		objRoleManager.create(objJRole);
		removeSpinner("modalSpinnerRole");
		return true;
	}
	var existMessage = getUiProps().MSG0007;
	document.getElementById("popupRoleErrorMsg").innerHTML = existMessage;
	removeSpinner("modalSpinnerRole");
	return false;
}

/**
 * Client side validation for role name.
 * 
 * @param roleName
 * @param errorSpanID
 */
 function roleValidation(roleName,errorSpanID) {
		//The following regex finds undersscore(_) and hyphen(-).	
		var specialCharacter = /^[-_]*$/;
		//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(uppercase).
		var letter = /^[0-9a-zA-Z-_]+$/;
		var minLengthMessage = getUiProps().MSG0003;
		var maxLengthMessage = getUiProps().MSG0004;
		var charMessage =  getUiProps().MSG0023; //getUiProps().MSG0005;
		var specialCharMessage = getUiProps().MSG0006;
		var lenRoleName = roleName.length;
		if((lenRoleName < 1)) {
			document.getElementById(errorSpanID).innerHTML = minLengthMessage;
			cellpopup.showErrorIcon('#roleName');
			return false;
		} else if((lenRoleName > 128)) {
			document.getElementById(errorSpanID).innerHTML = maxLengthMessage;
			cellpopup.showErrorIcon('#roleName');
			return false;
		} else if(lenRoleName != 0 && !(roleName.match(letter))) {
			document.getElementById(errorSpanID).innerHTML = charMessage;
			cellpopup.showErrorIcon('#roleName');
			return false;
		} else if(lenRoleName != 0 && (specialCharacter.toString().indexOf(roleName.substring(0, 1)) >= 0)) {
			document.getElementById(errorSpanID).innerHTML = specialCharMessage;
			cellpopup.showErrorIcon('#roleName');
			return false;
		} else {
			document.getElementById(errorSpanID).innerHTML = "";
			$("#txtEditRoleName").removeClass("errorIcon");
			cellpopup.showValidValueIcon('#roleName');
			return true;
		}
		cellpopup.showValidValueIcon('#roleName');
		return true;
	}
 
/**
 * The purpose of this function is to create a new role.
 */
function createRole() {
	showSpinner("modalSpinnerRole");
	var json = null;
	var roleName = document.getElementById("roleName").value;
	var boxName = null;
	var dropDown = document.getElementById("dropDownBox");
	var isRoleCreationAllowed = false;
	if (dropDown.selectedIndex > 0 ) {
		boxName = dropDown.options[dropDown.selectedIndex].title;
	}
	if (roleValidation(roleName, "popupRoleErrorMsg")) {
		
		if (validateBoxDropDown()) {
			var baseUrl = getClientStore().baseURL;
			var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
			if(boxName == null || boxName == "" || boxName == 0) {
				boxName = undefined;
			}
			json = {"Name" : roleName,"_Box.Name" : boxName};
			var objJRole = new _pc.Role(accessor, json);
			var objRoleManager = new _pc.RoleManager(accessor);
			
			try {
				 objRoleManager.retrieve(roleName,boxName);
			}
			catch (exception) {
				isRoleCreationAllowed = true;
			}
			
			//var success = isExist(check, accessor, objJRole, objRoleManager);
			if (isRoleCreationAllowed) {
				objRoleManager.create(objJRole);
				displayRoleCreateMessage (roleName);
			} else {
				var existMessage = getUiProps().MSG0007;
				document.getElementById("popupRoleErrorMsg").innerHTML = existMessage;
				$("#roleName").addClass("errorIcon");
			}
			}
		}
		
	
	removeSpinner("modalSpinnerRole");
}

/**
 * The purpose of this function is to bind the dropdown with 
 * box data against selected cellname
 * 
 * @param JSONstring
 * @param dropDownId
 * @param boxName
 */
function bindBoxDropDown(JSONstring,dropDownId, boxName) {
	var len = JSONstring.length;
	var select = document.getElementById(dropDownId);
	var defaultOption = document.createElement('option');
	var mainBoxValue = getUiProps().MSG0039;
	if (dropDownId == 'dropDownBox') {
		defaultOption.value = 0;
		defaultOption.innerHTML = getUiProps().MSG0400;
		select.insertBefore(defaultOption, select.options[0]);
	}
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = mainBoxValue;
	select.appendChild(newOption);
	if(dropDownId == "dropDownBoxEdit" || dropDownId == "ddlBoxList" ){
		var defaultOption = document.createElement('option');
		defaultOption.value = 0;
		defaultOption.innerHTML = mainBoxValue;
		defaultOption.title = mainBoxValue;
		if (boxName != mainBoxValue) {
			select.insertBefore(defaultOption, select.options[0]);
		}
		newOption.innerHTML = objCommon.getShorterName(boxName, 18);
		newOption.title = boxName;
		select.insertBefore(newOption, select.options[0]);
	}
	for(var count=0; count < len; count++) {
		var option = document.createElement("option");
		option.id=null;
		option.innerHTML = null;
		var obj = JSONstring[count];
		option.id = obj.__metadata.etag;
		var tooltipBoxName = objCommon.getShorterName(obj.Name, 18);
		option.innerHTML = obj.Name;
		option.text = tooltipBoxName;
		option.title = obj.Name;
		select.appendChild(option);
	}
	if(dropDownId == "dropDownBoxEdit") {
		$("#dropDownBoxEdit option[value= '" + objCommon.getShorterName(boxName,18) + "']").remove();
	}
	if(dropDownId == "ddlBoxList") {
		$("option[value= '" + objCommon.getShorterName(boxName.trim(), 18) + "']").remove();
	}
}
	
/** 
 * The purpose of this function is to retrieve the 
 * box list against a cellname
 * @param dropDownId
 * @param boxName
 */
function retrieveBox(dropDownId, boxName) {
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var objBoxManager = new _pc.BoxManager(accessor);
	var totalRecordCount = objBox.retrieveRecordCount(objBoxManager);
	var dataUri = objBoxManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	//var JSONstring =  objBoxManager.getBoxes("");
	var select = document.getElementById(dropDownId);
	select.options.length = 0;
	bindBoxDropDown(dataJson,dropDownId, boxName);
}

/***************************** EDIT ROLE : START *****************************/

/**
 * The purpose of this function is to perfom edit operation on role.
 * 
 * @param oldRoleName
 * @param oldBoxName
 * @param body
 * @param objJRoleManager
 */
function editRole(oldRoleName, oldBoxName, body, objJRoleManager) {
	var response = objJRoleManager.update(oldRoleName, oldBoxName, body, "*");
	if(response.getStatusCode() == 204) {
		displayEditRoleSuccessMessage();
		$("#btnEditRoleIcon").removeClass();
		$("#btnEditRoleIcon").addClass('editIconDisabled');
		$("#btnEditRoleIcon").attr("disabled", true);
	} else if (response.getStatusCode() == 409) {
		var existRoleNameMessage = getUiProps().MSG0007;
		editPopupRoleErrorMsg.innerHTML = existRoleNameMessage;
		$("#txtEditRoleName").addClass("errorIcon");
	}
}

/**
 * The purpose of this function is to display success message notification
 * on successful role create
 * @param oldRoleName
 */
function displayRoleCreateMessage (roleName) {
	$('#createRoleModal, .window').hide();
	addSuccessClass('#roleMessageIcon');
	$("#roleMessageBlock").css("display", 'table');
	document.getElementById("roleSuccessmsg").innerHTML = getUiProps().MSG0330;
	createRoleTable();
	objCommon.centerAlignRibbonMessage("#roleMessageBlock");
	objCommon.autoHideAssignRibbonMessage('roleMessageBlock');
}

/**
 * The purpose of this function is to display success message notification
 * on successful edit.
 */
function displayEditRoleSuccessMessage() {
	objCommon.removePopUpStatusIcons('#txtEditRoleName');
	$('#roleEditModalWindow, .window').hide();
	$("#roleMessageBlock").css("display", 'table');
	document.getElementById("roleSuccessmsg").innerHTML = getUiProps().MSG0331;
	addSuccessClass('#roleMessageIcon');
	createRoleTable();
	objCommon.centerAlignRibbonMessage("#roleMessageBlock");
	objCommon.autoHideAssignRibbonMessage('roleMessageBlock');
}

/**
 * The purpose of this function is to check validation for 
 * editing role and calls editRole method
 */
function updateRole() {
	showSpinner("modalSpinnerRole");
	var mainBoxValue = getUiProps().MSG0039;
	var body = null;
	var newBoxSelected = null;
	var newRoleName = null;
	var oldRoleName = sessionStorage.currentRoleName;
	var oldBoxName = sessionStorage.currentBoxName;
	if (oldBoxName == mainBoxValue) {
		oldBoxName = null;
	}
	newRoleName = document.getElementById("txtEditRoleName").value;
	var dropDown = document.getElementById("dropDownBoxEdit");
	if (dropDown.selectedIndex == 0 ) {
		newBoxSelected = oldBoxName;
	} else if (dropDown.selectedIndex > 0 ) {
		newBoxSelected = dropDown.options[dropDown.selectedIndex].title;
	}
	if (roleValidation(newRoleName, "editPopupRoleErrorMsg")) {
		body = {"Name" : newRoleName, "_Box.Name" : newBoxSelected};
		if (newBoxSelected == undefined || newBoxSelected == null || newBoxSelected == "" || newBoxSelected == mainBoxValue) {
			body = {"Name" : newRoleName};
		}
		var baseUrl = getClientStore().baseURL;
		var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
		var objJRoleManager = new _pc.RoleManager(accessor);
		editRole(oldRoleName, oldBoxName, body, objJRoleManager);
	}
	 else {
		$("#txtEditRoleName").addClass("errorIcon");
	}
	removeSpinner("modalSpinnerRole");
}

/** 
 * The purpose of this method is to get relation count linked with particular role 
*/
function getRelationCount(roleName,boxName,accessor){
	var mainBoxValue = getUiProps().MSG0039;
	var key = null;
	var relationCount =0;
	var baseUrl = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(baseUrl, cellName, "", "");
	var objLinkMgr = new _pc.LinkManager(accessor,objJdcContext );
	key = "(Name="+roleName+",_Box.Name="+boxName+")";
	if (boxName == "'"+mainBoxValue+"'") {
		key = "(Name="+roleName+")";
	}
	var response = objLinkMgr.retrieveRoleAccountLinks(objJdcContext,"Role","Relation",key);
	var responseBody = response.bodyAsJson();
	var json = responseBody.d.results;
	if (response.getStatusCode() == 200) {
		if(json.length >= 1) {
			relationCount =	json.length;
			}
			else {
				relationCount = 0;
		}
	}
	return relationCount;
}

/** 
 * The purpose of this method is to get external cell count linked with particular role 
*/
function getExtItemCount(roleName,boxName,accessor,item){
	var mainBoxValue = getUiProps().MSG0039;
	var key = null;
	var relationCount =0;
	var baseUrl = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(baseUrl, cellName, "", "");
	var objLinkMgr = new _pc.LinkManager(accessor,objJdcContext );
	key = "(Name="+roleName+",_Box.Name="+boxName+")";
	if (boxName == "'"+mainBoxValue+"'") {
		key = "(Name="+roleName+")";
	}
	var response = objLinkMgr.retrieveRoleAccountLinks(objJdcContext,"Role",item,key);
	var responseBody = response.bodyAsJson();
	var json = responseBody.d.results;
	if (response.getStatusCode() == 200) {
		if(json.length >= 1) {
			relationCount =	json.length;
			}
			else {
				relationCount = 0;
		}
	}
	return relationCount;
}

function getSelectedRoleDetails() {
	var selectedRoleDetails = objCommon.getMultipleSelections('mainRoleTable', 'input', 'case');
	var arrSelectedRole = selectedRoleDetails.split("'");
	var existingRoleName = arrSelectedRole[1];
	var existingBoxName = arrSelectedRole[3];
	retrieveBox("dropDownBoxEdit", existingBoxName);
	sessionStorage.currentRoleName = existingRoleName;
	sessionStorage.currentBoxName = existingBoxName;
	$('#txtEditRoleName').val(existingRoleName);
	//openCreateEntityModal('#roleEditModalWindow', '#roleEditDialogBox');
}
/***************************** EDIT ROLE : END ******************************/

function applyScrollCssOnRoleGrid() {
	var tbodyObject = document.getElementById("entityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRoleTable td:eq(2)").css("width", '32.3%');
	}
}

function refreshCreateRolePopup() {
	document.getElementById("roleName").value='';
	objCommon.removePopUpStatusIcons('#roleName');
	//$("#roleName").removeClass("errorIcon");
	document.getElementById("popupRoleErrorMsg").innerHTML = "";
	$('.popupContent').find('input:text').val('');
	$('.popupAlertmsg').html('');
	$('#dropDownBox').html('');
	$('#ddlRoleErrorMsg').html('');
}

/*
**
* This method ensures that the first index is never selected.
* @returns {Boolean}
*/
function  validateBoxDropDown () {
	var dropDown = document.getElementById("dropDownBox");
	if (dropDown.selectedIndex  == 0) {
		//$("#popupRoleErrorMsg").text('');
		$("#ddlRoleErrorMsg").text(getUiProps().MSG0222);
		return false;
	}
	return true;
};


/**
**The purpose of this function is to validate role name field
* 
*/
$("#roleName").blur(function () {
	var roleName = document.getElementById("roleName").value;
	roleValidation(roleName, "popupRoleErrorMsg");
});

/**
**The purpose of this function is to validate role name field in edit role popup
* 
*/
$("#txtEditRoleName").blur(function () {
	var newRoleName = document.getElementById("txtEditRoleName").value;
	if(roleValidation(newRoleName, "editPopupRoleErrorMsg")) {
		cellpopup.showValidValueIcon('#txtEditRoleName');
	} else {
		$("#txtEditRoleName").addClass("errorIcon");
	}
});

/**
**The purpose of this function is to validate role name field
* 
*/
$("#dropDownBox").blur(function () {
	if (validateBoxDropDown())
	$("#ddlRoleErrorMsg").text('');
});

/**
 * Following method fetches all role data.
 * @returns json.
 */
function retrieveAllRoleData() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var totalRecordCount = retrieveRoleRecordCount();
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRoleManager = new _pc.RoleManager(accessor);
	var dataUri = objRoleManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$top="+ totalRecordCount;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
}
