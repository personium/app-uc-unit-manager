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
function uAccount() {
}

$(document).ready(function() {
	$(window).resize(function() {
		if ($('#dvemptyTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfEmptyMessage();
		}
	});
	$.ajaxSetup({
		cache : false
	});
	loadAccountPage();
	objCommon.creatEntityHoverEffect();
	objCommon.sortByDateHoverEffect();
	setDynamicGridHeight();
});

var objAccount = new uAccount();
var arrDeletedConflictCount = [];
var isDeleted = false;
function loadAccountPage() {
	if (sessionStorage.tabName == "Account") {
		createAccountTable();
		objCommon.checkCellContainerVisibility();
	}
	if ($('#chkPassword').is(':checked')) {
		$("#rowPassword").show();
		$("#rowRetype").show();
	}
	$("#chkPassword").click(function() {
		$("#rowPassword").hide();
		$("#rowRetype").hide();
		// $('.externalCellErrorMesage').html('');
		if ($('#chkPassword').is(':checked')) {
			$("#rowPassword").show();
			$("#rowRetype").show();
		}

	});
}
// Global variable
var maxRows = 10;
var totalRecordsize = 0;
var cellName = sessionStorage.selectedcell;
var contextRoot = sessionStorage.contextRoot;
var accountName = null;
var sbSuccessfulAccount = '';
var sbConflictAccount = '';

/**
 * The purpose of this function is to retrieve chunked data from API.
 * 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
uAccount.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objAccountMgr = createAccountManager();
	var uri = objAccountMgr.getUrl();
	uri = uri + "?$orderby=__updated desc &$skip=" + lowerLimit + "&$top="
			+ upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of following method is to close pop up windows.
 * @returns {Boolean}
 */
function closePopup() {
	$('#modalbox').hide();
	$('#modalbox-flyout').hide();
	$('#modalbox-close').hide();
	$('#modalbox-close12').hide();
	return false;
};

/**
 * The purpose of the following method is to delete multiple accounts.
 */
function deleteMultipleAccounts() {
	showSpinner("modalSpinnerAcct");
	var etagIDOfPreviousRecord = "txtHiddenEtagId";
	var arrEtag = [];
	var etagValue = '';
	var tableID = $('#mainAccountTable');
	var idCheckAllChkBox = "#chkSelectall";
	//if (!$("#chkSelectall").is(':checked')) {
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBox0");
	}
	var accounts = sessionStorage.AccountNames;
	var arrAccounts = accounts.split(',');
	for ( var count = 0; count < arrAccounts.length; count++) {
		deleteAccount(arrAccounts[count],count);
	}
	displayMultipleAccountsConflictMessage();
	removeSpinner("modalSpinnerAcct");
	var type="Account";
	var recordCount = retrieveAccountRecordCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
	arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
	'', recordCount, objAccount, isDeleted);
}
/**
 * The purpose of the following method is to delete account.
 * 
 * @param accName
 */
function deleteAccount(accName,count) {
	var baseUrl = getClientStore().baseURL;
	objCommon.disableButton('#btnDeleteAccount');
	var cellname = sessionStorage.selectedcell.toString();
	var accessor = objCommon.initializeAccessor(baseUrl, cellname, "", "");
	var objAccountManager = new _pc.AccountManager(accessor);
	var etag = objAccountManager.getEtag(accName);
	var promise = objAccountManager.del(accName, etag);
	try {
		if (promise.resolvedValue.status == 204) {
			sbSuccessfulAccount += accName + ",";
		}
	} catch (exception) {
		sbConflictAccount += accName + ",";
		sbConflictAccount.replace(/, $/, "");
		arrDeletedConflictCount.push(count);
		
	}
}

/**
 * The purpose of this method is to display successful messages for Edit and
 * single delete operation.(for response code : 204) It is accepting id of the
 * modal window as an input parameter.
 * 
 * @param id
 */
function displaySuccessfulMessage(id) {
	var existingAccount = sessionStorage.accountName;
	var shorterexistingAccountName = objCommon
			.getShorterEntityName(existingAccount);
	$("#mainContent").load(contextRoot + '/templates/accountListView.html',
			function() {
				if (navigator.userAgent.indexOf("Firefox") != -1) {
					loadAccountPage();
				}
			});
	addSuccessClass();
	inlineMessageBlock();
	if (id === '#singleDeleteModalWindow') {
		$('#singleDeleteModalWindow, .window').hide(0);
		var shorterAccountName = objCommon.getShorterEntityName(accountName);
		document.getElementById("successmsg").innerHTML = getUiProps().MSG0334+" ";
				+ shorterAccountName +" "+getUiProps().MSG0335;
		document.getElementById("successmsg").title = accountName;
	} /*else if (id === '#accountEditModalWindow') {
		$('#accountEditModalWindow, .window').hide();
		document.getElementById("successmsg").innerHTML = "Account "
				+ shorterexistingAccountName + " edited successfully!";
		document.getElementById("successmsg").title = existingAccount;
	}*/
	objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
	objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
}

/**
 * The purpose of this method is to show message when an account is deleted.
 */
function displayConflictMessage() {
	$('#singleDeleteModalWindow, .window').hide(0);
	addErrorClass();
	inlineMessageBlock();
	document.getElementById("successmsg").innerHTML = getUiProps().MSG0205;
	objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
	objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
}

/**
 * The purpose of this method is to show pertinent messages when multiple
 * accounts are deleted.
 */

function displayMultipleAccountsConflictMessage() {
	var conflictAccountDeleteLength = 0;
	var successfulAccountDeleteLength = 0;
	sbSuccessfulAccount = sbSuccessfulAccount.substring(0, sbSuccessfulAccount.length - 1);
	sbConflictAccount = sbConflictAccount.substring(0, sbConflictAccount.length - 1);
	$('#multipleDeleteModalWindow, .window').hide(0);
	conflictAccountDeleteLength = entityCount(sbConflictAccount);
	successfulAccountDeleteLength = entityCount(sbSuccessfulAccount);
	if (conflictAccountDeleteLength < 1 && successfulAccountDeleteLength > 0) {
		isDeleted = true;
		addSuccessClass('#accountMessageIcon');
		$("#accountMessageBlock").css("display", 'table');
		document.getElementById("accountSuccessmsg").innerHTML = successfulAccountDeleteLength + " " +getUiProps().MSG0336;
	} else if (successfulAccountDeleteLength < 1
			&& conflictAccountDeleteLength > 0) {
		isDeleted = false;
		addErrorClass('#accountMessageIcon');
		$("#accountMessageBlock").css("display", 'table');
		document.getElementById("accountSuccessmsg").innerHTML = conflictAccountDeleteLength +" "+getUiProps().MSG0337;
	} else if (conflictAccountDeleteLength > 0
			&& successfulAccountDeleteLength > 0) {
		isDeleted = true;
		addErrorClass('#accountMessageIcon');
		$("#accountMessageBlock").css("display", 'table');
		document.getElementById("accountSuccessmsg").innerHTML = successfulAccountDeleteLength + " "+ getUiProps().MSG0323 + " " + (conflictAccountDeleteLength + successfulAccountDeleteLength)
		+ " "+getUiProps().MSG0336;
	}
	sbSuccessfulAccount = '';
	sbConflictAccount = '';
	objCommon.centerAlignRibbonMessage("#accountMessageBlock");
	objCommon.autoHideAssignRibbonMessage('accountMessageBlock');
}

/**
 * The purpose of this function is to get account information.
 */
function getMultipleAccountNames() {
	var elementsLength = document.fAccountTable.elements.length;
	var count = 0;
	var accountName = null;
	for (count = 0; count < elementsLength; count++) {
		if (document.fAccountTable.elements[count].name == "case") {
			if (document.fAccountTable.elements[count].checked) {
				var formAccountName = document.fAccountTable.elements[count].value;
				if (accountName == null) {
					accountName = formAccountName;
				} else {
					accountName = accountName + ',' + formAccountName;
				}
			}
		}
	}
	sessionStorage.AccountNames = accountName;
}

/**
 * The purpose of this method is to get Account Name.
 *
 */
function getAccountName(accountName) {
	sessionStorage.accountName = null;
	sessionStorage.accountName = accountName;
	openPopUpWindow('#singleDeleteDialogBox', '#singleDeleteModalWindow');
	$('#' + accountName).show();
}

/** 
 * The purpose of this function is to check/uncheck all the checkboxes.
 */
uAccount.prototype.checkAllAccountGrid = function (cBox) {
	var buttonId = '#btnDeleteAccount';
	objCommon.checkBoxSelect(cBox, buttonId, '#btnEditAccount');
	objCommon.showSelectedRow(document.getElementById("chkSelectall"), "row",
			"rowid");
};

/**
 * The purpose of this method is to close create Account popup. 
 */
function closeCreateAccount() {
	$('.popUpCreateAccountContent').find('input:text').val('');
	$('.popUpCreateAccountContent').find('input:password').val('');
	$('.asidePopupErrorMessageCommon').html('');
	$('#createAccModal, .window').hide(0);
}

/**
 * The purpose of this method is to close delete Account popup. 
 */
function closeDeleteAccount() {
	$('#singleDeleteModalWindow, .window').hide(0);
	$('#multipleDeleteModalWindow, .window').hide(0);
	$('#conflictModalwindow, .window').hide(0);
	$("#mainContent").load(contextRoot + '/templates/accountListView.html',
			function() {
				if (navigator.userAgent.indexOf("Firefox") != -1) {
					loadAccountPage();
				}
			});
}

/**
 * The purpose of this method is to open pop up window.
 * @param idDialogBox
 * @param idModalWindow
 */
uAccount.prototype.openPopUpWindow = function(idDialogBox, idModalWindow) {
	if (idDialogBox === '#multipleDeleteDialogBox') {
		getMultipleAccountNames();
		$('#btnCancelAccountDelete').focus();
	}
	if (idDialogBox == '#createAccDialog') {
		objAccount.emptyCreateAccountPopUp();
		objCommon.bindRoleBoxDropDown('dropDownAcntCreate');
	}
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	if (idDialogBox == '#createAccDialog') {
		$('#txtAccountName').focus();	
	}
	if (idDialogBox === '#multipleDeleteDialogBox') {
		$('#btnCancelAccountDelete').focus();
	}
};

/**
 * The purpose of this method is to perform validations on account name.
 * @param accountName
 * @param operation
 * @returns {Boolean}
 */
function AccountNameValidation(accountName, operation, isPasswordChanged, pwd,
		retypedPwd) {
	var letters = /^[0-9a-zA-Z-_!$*=^`{|}~.@]+$/;
	var specialchar = /^[-_!$*=^`{|}~.@]*$/;
	var lenAccountName = accountName.length;
	var minLengthMessage = getUiProps().MSG0016;
	var maxLengthMessage = getUiProps().MSG0017;
	var alphaNumericMessage = getUiProps().MSG0018;
	var specialCharacterMessage = getUiProps().MSG0019;
	var id = null;
	if (operation == "create") {
		id = "popupAccErrorMsg";
	} else if (operation == "edit") {
		id = "popupEditErrorMsg";
	}
	if (lenAccountName == 0 || accountName == undefined || accountName == null
			|| accountName == "") {
		document.getElementById(id).innerHTML = minLengthMessage;
		if (operation == "create") {
			cellpopup.showErrorIcon('#txtAccountName');
		} else {
			cellpopup.showErrorIcon('#txtEditAccountName');
		}
		return false;
	} else if (lenAccountName > 128) {
		document.getElementById(id).innerHTML = maxLengthMessage;
		if (operation == "create") {
			cellpopup.showErrorIcon('#txtAccountName');
		} else {
			cellpopup.showErrorIcon('#txtEditAccountName');
		}
		return false;
	} else if (lenAccountName != 0 && !(accountName.match(letters))) {
		document.getElementById(id).innerHTML = alphaNumericMessage;
		if (operation == "create") {
			cellpopup.showErrorIcon('#txtAccountName');
		} else {
			cellpopup.showErrorIcon('#txtEditAccountName');
		}
		return false;
	} else if (lenAccountName != 0
			&& (specialchar.toString().indexOf(accountName.substring(0, 1)) >= 0)) {
		document.getElementById(id).innerHTML = specialCharacterMessage;
		if (operation == "create") {
			cellpopup.showErrorIcon('#txtAccountName');
		} else {
			cellpopup.showErrorIcon('#txtEditAccountName');
		}
		return false;
	}
	if (isPasswordChanged) {
		var status = reTypePasswordValidation(pwd, retypedPwd);
		return status;
	}
	return true;
}

/**
 * Following function validates retype-pasword value.
 */
function reTypePasswordValidation(passd, repassd) {
	var letters = /^[0-9a-zA-Z-_]+$/;
	var passdlen = passd.length;
	var repassdlen = repassd.length;
	var lengthPassword = getUiProps().MSG0022;
	var charPassword = getUiProps().MSG0023;
	var repassword = getUiProps().MSG0024;
	cellpopup.showValidValueIcon('#txtEditAccountName');
	document.getElementById("popupEditErrorMsg").innerHTML = '';
	if (passdlen < 6 || passdlen > 32) {
		document.getElementById("editChangedPassword").innerHTML = lengthPassword;
		cellpopup.showErrorIcon('#txtEditPassword');
		return false;
	} else if (passd.length != 0 && !(passd.match(letters))) {
		document.getElementById("editChangedPassword").innerHTML = charPassword;
		cellpopup.showErrorIcon('#txtEditPassword');
		return false;
	} else if (repassdlen != passdlen || passd != repassd) {
		document.getElementById("editChangedPassword").innerHTML = "";
		document.getElementById("editReTypePassword").innerHTML = repassword;
		cellpopup.showValidValueIcon('#txtEditPassword');
		cellpopup.showErrorIcon('#txtEditReTypePassword');
		return false;
	} else {
		return true;
	}
}

/** The purpose of the following method is to check validations and ensures that the 
 * correct values are entered in account name and password. 
 */
function Accvalidation(accname, passd, repassd, operation) {
	var letters = /^[0-9a-zA-Z-_]+$/;
	var passdlen = passd.length;
	var repassdlen = repassd.length;
	var minPassword = getUiProps().MSG0021;
	var lengthPassword = getUiProps().MSG0022;
	var charPassword = getUiProps().MSG0023;
	var repassword = getUiProps().MSG0024;
	if (AccountNameValidation(accname, operation, false)) {
		cellpopup.showValidValueIcon('#txtAccountName');
		if (passdlen < 1) {
			document.getElementById("pasdError").innerHTML = minPassword;
			cellpopup.showErrorIcon('#txtPassword');
			return false;
		} else if (passdlen < 6 || passdlen > 32) {
			document.getElementById("pasdError").innerHTML = lengthPassword;
			cellpopup.showErrorIcon('#txtPassword');
			return false;
		} else if (passd.length != 0 && !(passd.match(letters))) {
			document.getElementById("pasdError").innerHTML = charPassword;
			cellpopup.showErrorIcon('#txtPassword');
			return false;
		} else if (repassdlen != passdlen) {
			cellpopup.showValidValueIcon('#txtPassword');
			document.getElementById("pasdError").innerHTML = "";
			document.getElementById("rPasdError").innerHTML = repassword;
			cellpopup.showErrorIcon('#txtRePassword');
			return false;
		} else {
			document.getElementById("rPasdError").innerHTML = "";
			cellpopup.showValidValueIcon('#txtPassword');
			cellpopup.showValidValueIcon('#txtRePassword');
			return true;
		}
		return true;
	}
}

/**
 * The purpose of this method is to create Account Name.
 * Cell Name is also harcoded for now later it would be replaced with the cell selected from the list.
 */
function accountNewCreate() {
	popupAccErrorMsg.innerHTML = null;
	var accNameToCreate = document.getElementById('txtAccountName').value;
	var password = document.getElementById('txtPassword').value;
	var rePassword = document.getElementById('txtRePassword').value;
	var operation = "create";
	showSpinner("modalSpinnerAcct");
	if (Accvalidation(accNameToCreate, password, rePassword, operation)) {
		if (($('#checkBoxAccountCreate').is(':checked'))) {
			var isValid = objCommon.validateDropDownValue('dropDownAcntCreate', '#selectRoleDropDownError', getUiProps().MSG0279);
			if (isValid == false) {
				removeSpinner("modalSpinnerAcct");
				return;
			}
		}
		var createAllowed = false;
		var body = {
			"Name" : accNameToCreate
		};
		var baseUrl = getClientStore().baseURL;
		var cellname = sessionStorage.selectedcell.toString();
		var accessor = objCommon.initializeAccessor(baseUrl, cellname, "", "");
		var objAccount = new _pc.Account(accessor, body);
		var objAccountManager = new _pc.AccountManager(accessor);
		try {
			var accountResponse = objAccountManager.retrieve(accNameToCreate);
			createAllowed = !(accountResponse instanceof _pc.Account);
		} catch (exception) {
			createAllowed = true;
		}
		if (createAllowed) {
			createAccount(accessor, objAccount, objAccountManager, password, accNameToCreate);
		} else {
			displayAccountExistMessage("create");
			removeSpinner("modalSpinnerAcct");
		}
	}
	removeSpinner("modalSpinnerAcct");
}

/**
 * The purpose of this method is to create an account and display ribbon message.
 */
function createAccount(accessor, objAccount, objAccountManager, pwd, accNameToCreate) {
	var objCommon = new common();
	var accountRes = objAccountManager.create(objAccount, pwd);
	if (accountRes instanceof _pc.Account) {
		var objAccount = new uAccount();
		if (($('#checkBoxAccountCreate').is(':checked'))) {
			var createdAccountName = accNameToCreate;
			var multiKey = "(Name='" + createdAccountName + "')";
			var response = objCommon.assignEntity('dropDownAcntCreate', 'Account', 'Role', multiKey, true);
			if (response.getStatusCode() == 204) {
				$('#createAccModal, .window').hide(0);
				objAccount.displaySuccessMessage(getUiProps().MSG0280);
			}
		} else {
			$('#createAccModal, .window').hide(0);
			objAccount.displaySuccessMessage(getUiProps().MSG0280);
		}
		
	}
	removeSpinner("modalSpinnerAcct");
}

function accountRefresh() {
	var contextRoot = sessionStorage.contextRoot;
	$("#mainContent").load(contextRoot + '/templates/accountListView.html',
			function() {
				if (navigator.userAgent.indexOf("Firefox") != -1) {
					loadAccountPage();
				}
			});
}

/**
 * The purpose of this method is to display "Already exists" messages depending upon the operation (EDIT or CREATE)
 * @param operation
 */
function displayAccountExistMessage(operation) {
	var existMessage = getUiProps().MSG0020;
	//If Account already exists.
	document.getElementById("rPasdError").innerHTML = "";
	if (operation === "edit") {
		document.getElementById("popupEditErrorMsg").innerHTML = existMessage;
		cellpopup.showErrorIcon('#txtEditAccountName');
		//popupEditErrorMsg.innerHTML = existMessage;
	} else if (operation === "create") {
		document.getElementById("popupAccErrorMsg").innerHTML = existMessage;
		cellpopup.showErrorIcon('#txtAccountName');
		//popupAccErrorMsg.innerHTML = existMessage;
	}
	check = null;
}

/**
 * The purpose of this method is to close EDIT Account pop up window. 
 */
function closeEditWindow() {
	$('#accountEditModalWindow, .window').hide(0);
	$('.popupContent').find('input:text').val('');
	$('.popupContent').find('input:password').val('');
	$('.popupAlertmsg').html('');

}

/**
 *	The purpose of this method is to update account name.
 */
function updateAccount() {
	showSpinner("modalSpinnerAcct");
	var isPasswordChanged = false;
	var existingAccountName = sessionStorage.accountName;
	var newAccountName = $("#txtEditAccountName").val(); // txtEditAccountName
	var changedPassword = $("#txtEditPassword").val();
	var reTypedPassword = $("#txtEditReTypePassword").val();
	var operation = "edit";
	if (changedPassword != '') {
		isPasswordChanged = true;
	}
	if (AccountNameValidation(newAccountName, operation, isPasswordChanged,
			changedPassword, reTypedPassword)) {
		if (objAccount.accountPasswordValidation(operation,
				'editChangedPassword')) {
			var baseUrl = getClientStore().baseURL;
			var cellname = sessionStorage.selectedcell.toString();
			var accessor = objCommon.initializeAccessor(baseUrl, cellname, "",
					"");
			var objAccountManager = new _pc.AccountManager(accessor);
			var isAccountNotExist = false;
			var etag = objAccountManager.getEtag(existingAccountName);
			var body = {
				"Name" : newAccountName
			};
			if (existingAccountName == newAccountName) {
				performEdit(existingAccountName, body, etag, objAccountManager,
						changedPassword);
			} else {
				try {
					isAccountNotExist = objAccountManager
							.retrieve(newAccountName);
				} catch (exception) {
					isAccountNotExist = true;
				}
				if (isAccountNotExist === true) {
					isAccountNotExist = null;
					performEdit(existingAccountName, body, etag,
							objAccountManager, changedPassword);
					updateAccountInfo(newAccountName);
				} else {
					displayAccountExistMessage(operation);
					isAccountNotExist = null;
				}
			}
		}
	}
	removeSpinner("modalSpinnerAcct");
}
function updateAccountInfo(accountName) {
	sessionStorage.ccname = accountName;
	sessionStorage.accountName = accountName;
	var baseUrl = getClientStore().baseURL;
	var cellname = sessionStorage.selectedcell.toString();
	var accessor = objCommon.initializeAccessor(baseUrl, cellname, "", "");
	var objAccountManager = new _pc.AccountManager(accessor);
	var res = objAccountManager.retrieve(accountName);
	sessionStorage.ccurl = res.rawData.__metadata.uri;
	$("#lblAccountName").html(accountName);
	$("#lblAccountName").attr('title', accountName);
	uBoxDetail.displayBoxInfoDetails();
}

/***
 * The purpose of the following method is to perform actual edit operation, this method is being invoked in updateAccount()
 * @param existingAccountName
 * @param body
 * @param etag
 * @param objAccountManager
 */
function performEdit(existingAccountName, body, etag, objAccountManager,
		changedPassword) {
	var response = '';
	if (changedPassword != undefined && changedPassword != '') {
		response = objAccountManager.update(existingAccountName, body, etag,
				changedPassword);
	} else {
		response = objAccountManager.update(existingAccountName, body, etag);
	}
	if (response.getStatusCode() == 204) {
		$('#accountEditModalWindow, .window').hide(0);
		objAccount.displayLinkSuccessMessage(getUiProps().MSG0286);
		objAccount.emptyEditAccountPopUp();
	}
}

/**The purpose of this method is to create rows.
 * 
 */
function createRowsForAccountTable(dynamicTable, count, _accountName, accountType,
		accountDateDisplay, rolecount, accountname, accountdate, rolecount,
		tooltipAccountName, accountRowCount, accountPublishedDate, role, parrEtag0, parrEtag1, pinfoSchema,etag) {
	
	var paccountPublishedDate = "'" + accountPublishedDate + "'";
	dynamicTable += '<td style="width:1%"><input id =  "txtHiddenEtagId'+accountRowCount+'" value='+etag+' type = "hidden" /><input title="'+accountRowCount+'" id="chkBox'
			+ accountRowCount
			+ '" type="checkbox" class="case cursorHand regular-checkbox big-checkbox" name="case" value="'
			+ tooltipAccountName + '"/><label for="chkBox' + accountRowCount
			+ '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += '<td name = "acc" style="max-width: 120px;width:34%"><div class = "mainTableEllipsis"><a style="outline:none" tabindex="-1" id="accountRoleLink" href ="#" onclick="openRoleLinkPage('+accountname+','+accountdate+','+rolecount+',' + parrEtag0 +',' + parrEtag1 +',' + paccountPublishedDate +',' + accountdate +',\'\');" class="roleNameLink" title= "'
			+ tooltipAccountName
			+ '">'
			+ tooltipAccountName
			+ ' </a></div></td>';//
	dynamicTable += "<td style='width:15%'>" + accountType + "</td>";
	dynamicTable += "<td style='width:15%'>" + accountPublishedDate + "</td>";
	dynamicTable += "<td style='width:15%'>" + accountDateDisplay + "</td>";
	dynamicTable += "<td style='width:20%;max-width: 100px;'><div class = 'mainTableEllipsis'><label title= '" + role + "' class='cursorPointer'>" + role + "</label></div></td>";
	dynamicTable += "</tr>";
	return dynamicTable;
}

/**
 * The purpose of this method is to create and initialize account manager.
 */
function createAccountManager() {
	var token = getClientStore().token;
	var url = getClientStore().baseURL;
	var cellname = sessionStorage.selectedcell.toString();
	var objJdcContext = new _pc.PersoniumContext(url, cellname, "", "");
	var accessor = objJdcContext.withToken(token);
	var objAccountManager = new _pc.AccountManager(accessor);
	return objAccountManager;
}

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
function retrieveAccountRecordCount() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objAccountManager = new _pc.AccountManager(accessor);
	var uri = objAccountManager.getUrl();
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * The purpose o this method is to create table view as per pagination.
 * @param json
 * @param recordSize
 */
function createChunkedAccountTable(json, recordSize, spinnerCallback) {
	$('#chkSelectall').attr('checked', false);
	$("#chkSelectall").attr('disabled', false);
	objCommon.disableButton('#btnDeleteAccount');
	$("#entityGridTbody").scrollTop(0);
	var token = getClientStore().token;
	var accountName = new Array();
	var etag = new Array();
	var roleSchema = new Array();
	var updatedDate = new Array();
	var publishedDate = new Array();
	var dynamicTable = "";
	var url = getClientStore().baseURL;
	var cellname = sessionStorage.selectedcell.toString();
	var objJdcContext = new _pc.PersoniumContext(url, cellname, "", "");
	var accessor = objJdcContext.withToken(token);
	var objLinkMgr = new _pc.LinkManager(accessor, objJdcContext);
	var rolecount = 0;
	if (typeof json === "string") {
		json = JSON.parse(json);
		if (typeof json === "string") {
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS + recordSize) < (jsonLength) ? (objCommon.MAXROWS + recordSize)
			: jsonLength;
	var accountRowCount = 0;
	for ( var count = recordSize; count < maxLimit; count++) {
		var arrayData = json[count];
		etag[count] = arrayData.__metadata.etag;
		roleSchema[count] = arrayData.__metadata.uri;
		accountName[count] = arrayData.Name;
		updatedDate[count] = objCommon
				.convertEpochDateToReadableFormat(arrayData.__updated);
		publishedDate[count] = objCommon
				.convertEpochDateToReadableFormat(arrayData.__published);
		//changes for role account link control start
		var accountname = "'" + accountName[count] + "'";
		var accounttype = arrayData.Type;
		var accountdate = updatedDate[count];
		var accountPublishedDate = publishedDate[count];
		accountdate = "'" + accountdate + "'";
		var accountDateDisplay = updatedDate[count];
		var response = objLinkMgr.retrieveAccountRoleLinks(objJdcContext, "Account", "Role", accountName[count], "", "");
		var rolesMappedList = objAccount.retrieveAssignedRolesListForAccount(response);
		var arrEtag = etag[count].split("/");
		var arrEtag0 = "'"+ arrEtag[0] +"'" ;
		var arrEtag1 = "'"+ arrEtag[1].replace(/["]/g,"") + "'";
		var infoSchema = "'"+ roleSchema[count].replace(/[']/g,"`") +"'" ;

		var tooltipAccountName = accountName[count];
		if (accountName[count].length > 16) {
			accountName[count] = accountName[count].substring(0, 15) + "..";

		}
		dynamicTable += '<tr name="allrows" id="rowid' + accountRowCount
				+ '" onclick="objCommon.rowSelect(this,' + "'rowid'" + ','
				+ "'chkBox'" + ',' + "'row'" + ',' + "'btnDeleteAccount'" + ','
				+ "'chkSelectall'" + ',' + accountRowCount + ','
				+ totalRecordsize + ',' + "'btnEditAccount'" + ',' + "''" + ','
				+ "''" + ',' + "''" + ',' + "'mainAccountTable'" + ');">';
		dynamicTable = createRowsForAccountTable(dynamicTable, count,
				accountName[count], accounttype, accountDateDisplay, rolecount, accountname,
				accountdate, rolecount, tooltipAccountName, accountRowCount,
				accountPublishedDate, rolesMappedList, arrEtag0, arrEtag1, infoSchema,etag[count]);
		accountRowCount++;
	}
	if (jsonLength > 0) {
		$("#mainAccountTable thead tr").addClass('mainTableHeaderRow');
		$("#mainAccountTable tbody").addClass('mainTableTbody');
	}
	$("#mainAccountTable tbody").html(dynamicTable);
	setTimeout(function() {
		applyScrollCssOnAccountGrid();
	}, 300);
	if (spinnerCallback != undefined) {
		spinnerCallback();
	}
}

/**
 * The purpose of this function is to retrieve list of assigned roles for
 * every account.
 * @param response
 * @returns {Array}
 */
uAccount.prototype.retrieveAssignedRolesListForAccount = function (response) {
	var rolesMappedList = new Array();
	var responseBody = response.bodyAsJson();
	var jsonLink = responseBody.d.results;
	var role = "";
	var lenJsonLink = jsonLink.length;
	if (response.getStatusCode() == 200) {
		for ( var index = 0; index < lenJsonLink; index++) {
			var obj = jsonLink[index];
			role = objCommon.getRoleNameFromURI((obj.uri));
			rolesMappedList.push(" " + role);
		}
	}
	return rolesMappedList;
};

/**
 *	The purpose of this function is to create dynamic table on the basis of response returned by API
 */
function createAccountTable() {
	var objCommon = new common();
	var token = getClientStore().token;
	sessionStorage.token = token;
	totalRecordsize = retrieveAccountRecordCount();
	if (totalRecordsize == 0) {
		$('#mainAccountTable tbody').empty();
		objCommon.displayEmptyMessageInGrid(getUiProps().MSG0232, "Account");
		$("#btnDeleteAccount").attr('disabled', true);
		$("#chkSelectall").attr('checked', false);
		$("#labelSelectAllAccount").css('cursor','default');
	} else {
		document.getElementById("dvemptyTableMessage").style.display = "none";
		var recordSize = 0;
		var json = objAccount.retrieveChunkedData(objCommon.minRecordInterval,
				objCommon.noOfRecordsToBeFetched);
		createChunkedAccountTable(json, recordSize);
		var tableID = $('#mainAccountTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
						tableID, objAccount, json, createChunkedAccountTable,
						"Account");
		objCommon.checkCellContainerVisibility();
		$("#labelSelectAllAccount").css('cursor','pointer');
	}
}

/**
 * The purpose of this function is to get selected account information.
 */
function getSelectedAccountDetails() {
	var selectedAccountName = $("#lblAccountName").text();
	$('#txtEditAccountName').val(selectedAccountName);
	sessionStorage.accountName = null;
	sessionStorage.accountName = selectedAccountName;
}

/**
 * The purpose of this function is to apply scroll css on
 * account grid.
 */
function applyScrollCssOnAccountGrid() {
	var tbodyObject = document.getElementById("entityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainAccountTable td:eq(1)").css("width", '34.15%');
		$("#mainAccountTable td:eq(2)").css("width", '15.05%%');
	}
}

/**
 * The purpose of this function to display generic success message after
 * CRUD operation
 * @param message
 */
uAccount.prototype.displayLinkSuccessMessage = function (message) {
	addSuccessClass('#accountLinkMessageIcon');
	$("#accountLinkMessageBlock").css("display", 'table');
	document.getElementById("accountLinkSuccessmsg").innerHTML = message;
	createAccountTable();
	objCommon.centerAlignRibbonMessage("#accountLinkMessageBlock");
	objCommon.autoHideAssignRibbonMessage('accountLinkMessageBlock');
};
uAccount.prototype.displaySuccessMessage = function (message) {
	addSuccessClass('#accountMessageIcon');
	$("#accountMessageBlock").css("display", 'table');
	document.getElementById("accountSuccessmsg").innerHTML = message;
	createAccountTable();
	objCommon.centerAlignRibbonMessage("#accountMessageBlock");
	objCommon.autoHideAssignRibbonMessage('accountMessageBlock');
};

/**
 * The purpose of this function is to empty all the field 
 * before opening create account pop up.
 */
uAccount.prototype.emptyCreateAccountPopUp = function () {
	$('.popUpCreateAccountContent').find('input:text').val('');
	$('.popUpCreateAccountContent').find('input:password').val('');
	$('.asidePopupErrorMessageCommon').html('');
	$('#checkBoxAccountCreate').attr('checked', false);
	$('#dropDownAcntCreate').addClass("customSlectDDDisabled");
	$("#dropDownAcntCreate").attr('disabled', true);
	objCommon.removePopUpStatusIcons('#txtAccountName');
	objCommon.removePopUpStatusIcons('#txtPassword');
	objCommon.removePopUpStatusIcons('#txtRePassword');
};

/**
 * Following method closes edit pop up window.
 */
uAccount.prototype.closeEditPopUpWindow = function () {
    objAccount.emptyEditAccountPopUp();
    $('#accountEditModalWindow, .window').hide(0);
  };
  
/**
 * Following function clears edit account pop up elements.
 */
uAccount.prototype.emptyEditAccountPopUp = function () {
	$('.popUpEditAccountContent').find('input:text').val('');
	$('.popUpEditAccountContent').find('input:password').val('');
	$('.asidePopupErrorMessageCommon').html('');
	objCommon.removePopUpStatusIcons('#txtEditAccountName');
	objCommon.removePopUpStatusIcons('#txtEditPassword');
	objCommon.removePopUpStatusIcons('#txtEditReTypePassword');
};

/**
 * Following function validates account name on blur.
 */
$("#txtEditAccountName").blur(function(){
	var editAccountName = $("#txtEditAccountName").val(); // txtEditAccountName
	var operation = "edit";
	if(AccountNameValidation(editAccountName, operation, false)) {
		cellpopup.showValidValueIcon('#txtEditAccountName');
		document.getElementById("popupEditErrorMsg").innerHTML = '';
	}
});

/**
 * Following function validates account new password on blur.
 */
$("#txtEditPassword").blur(function(){
	var operation = "edit";
	objAccount.accountPasswordValidation(operation,'editChangedPassword');
});

/**
 * Following function validates account retype password on blur.
 */
$("#txtEditReTypePassword").blur(function(){
	var operation = "edit";
	objAccount.accountRetypePasswordValidation(operation,'editReTypePassword');
});

/**
 * Following method validates account password validation.
 * @returns {Boolean}
 */
uAccount.prototype.accountPasswordValidation = function(operation, errorSpanID) {
	var passd = '';
	passd = document.getElementById('txtPassword').value;
	if (operation == "edit") {
		passd = $("#txtEditPassword").val();
	}
	var letters = /^[0-9a-zA-Z-_]+$/;
	var passdlen = passd.length;
	var minPassword = getUiProps().MSG0021;
	var lengthPassword = getUiProps().MSG0022;
	var charPassword = getUiProps().MSG0023;
	if (passdlen == 0 || passdlen == undefined || passdlen == null
			|| passdlen == "") {
		objCommon.removePopUpStatusIcons('#txtEditPassword');
		document.getElementById("editChangedPassword").innerHTML = '';
		if (operation == "create") {
			document.getElementById(errorSpanID).innerHTML = minPassword;
			cellpopup.showErrorIcon('#txtPassword');
		} else {
			document.getElementById(errorSpanID).innerHTML = minPassword;
			cellpopup.showErrorIcon('#txtEditPassword');
			cellpopup.showValidValueIcon('#txtEditAccountName');
		}
		return false;
	} else if (passdlen < 1) {
		if (operation == "create") {
			document.getElementById(errorSpanID).innerHTML = minPassword;
			cellpopup.showErrorIcon('#txtPassword');
		} else {
			document.getElementById(errorSpanID).innerHTML = minPassword;
			cellpopup.showErrorIcon('#txtEditPassword');
		}
		return false;
	} else if (passdlen < 6 || passdlen > 32) {
		document.getElementById(errorSpanID).innerHTML = lengthPassword;
		if (operation == "edit") {
			cellpopup.showErrorIcon('#txtEditPassword');
		} else {
			cellpopup.showErrorIcon('#txtPassword');
		}
		return false;
	} else if (passd.length != 0 && !(passd.match(letters))) {
		document.getElementById(errorSpanID).innerHTML = charPassword;
		if (operation == "edit") {
			cellpopup.showErrorIcon('#txtEditPassword');
		} else {
			cellpopup.showErrorIcon('#txtPassword');
		}
		return false;
	} else {
		if (operation == "edit") {
			cellpopup.showValidValueIcon('#txtEditPassword');
		} else {
			cellpopup.showValidValueIcon('#txtPassword');
		}
		document.getElementById(errorSpanID).innerHTML = "";
		return true;
	}
	return true;
};

/**
 * Following method validates account retype-password validation.
 * @returns {Boolean}
 */
uAccount.prototype.accountRetypePasswordValidation = function(operation,
		errorSpanID) {
	var minPassword = getUiProps().MSG0164;
	var lengthPassword = getUiProps().MSG0022;
	var passd = '';
	var repassd = '';
	if (operation == "edit") {
		passd = document.getElementById('txtEditPassword').value;
		repassd = document.getElementById('txtEditReTypePassword').value;
	} else {
		passd = document.getElementById('txtPassword').value;
		repassd = document.getElementById('txtRePassword').value;
	}
	var passdlen = passd.length;
	var repassdlen = repassd.length;
	var repassword = getUiProps().MSG0024;
	if (repassdlen == 0 || repassdlen == undefined || repassdlen == null
			|| repassdlen == "") {
		objCommon.removePopUpStatusIcons('#txtEditReTypePassword');
		document.getElementById("editReTypePassword").innerHTML = '';
		if (operation == "create") {
			document.getElementById(errorSpanID).innerHTML = minPassword;
			cellpopup.showErrorIcon('#txtRePassword');
		} else {
			document.getElementById(errorSpanID).innerHTML = minPassword;
			cellpopup.showErrorIcon('#txtEditReTypePassword');
		}
		return false;
	} else if (repassdlen < 6 || repassdlen > 32) {
		document.getElementById(errorSpanID).innerHTML = lengthPassword;
		if (operation == "edit") {
			cellpopup.showErrorIcon('#txtEditReTypePassword');
		} else {
			cellpopup.showErrorIcon('#txtRePassword');
		}
		return false;
	} else if (repassdlen != passdlen) {
		document.getElementById(errorSpanID).innerHTML = repassword;
		if (operation == "edit") {
			cellpopup.showErrorIcon('#txtEditReTypePassword');
		} else {
			cellpopup.showErrorIcon('#txtRePassword');
		}
		return false;
	} else {
		document.getElementById(errorSpanID).innerHTML = "";
		if (operation == "edit") {
			cellpopup.showValidValueIcon('#txtEditReTypePassword');
		} else {
			cellpopup.showValidValueIcon('#txtRePassword');
		}
		return true;
	}
	return true;
};

/**
 * Following methods checks account name validations on blur event.
 */
$("#txtAccountName").blur(function() {
	var accNameToCreate = document.getElementById('txtAccountName').value;
	var operation = "create";
	if (AccountNameValidation(accNameToCreate, operation, false)) {
		cellpopup.showValidValueIcon('#txtAccountName');	
		$("#popupAccErrorMsg").text('');	
	}
});

/**
 * Following methods checks password validations on blur event.
 */
$("#txtPassword").blur(function() {
	var operation = "create";
	objAccount.accountPasswordValidation(operation,'pasdError');
});

/**
 * Following methods checks retype-password validations on blur event.
 */
$("#txtRePassword").blur(function() {
	var operation = "create";
	objAccount.accountRetypePasswordValidation(operation,'rPasdError');
});

/**
 * Following methods checks password validations on blur event.
 */
$("#txtEditPassword").blur(function() {
	var operation = "edit";
	objAccount.accountPasswordValidation(operation,'editChangedPassword');
});

/**
 * Following methods checks retype-password validations on blur event.
 */
$("#txtEditReTypePassword").blur(function() {
	var operation = "edit";
	objAccount.accountRetypePasswordValidation(operation,'editReTypePassword');
});


/**
 * Following methods checks dropdown validations on blur event.
 */
$("#dropDownAcntCreate").blur(function() {
	objCommon.validateDropDownValue('dropDownAcntCreate', '#selectRoleDropDownError', getUiProps().MSG0279);
});

function checkboxFocusOnAccount() {
	$("#lblAssignCreateRole").css("outline","-webkit-focus-ring-color auto 5px");
}

function checkboxBlurOnAccount() {
	$("#lblAssignCreateRole").css("outline","none");
}

/**
 * Following method fetches all account data.
 * @returns json
 */
function retrieveAllAccountData() {
	var cellName = sessionStorage.selectedcell;
	var totalRecordCount = retrieveAccountRecordCount();
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objAccountMgr = createAccountManager();
	var uri = objAccountMgr.getUrl();
	uri = uri + "?$orderby=__updated desc &$top="
			+ totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
}