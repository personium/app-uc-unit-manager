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

/**It creates a new cellUI name space.*/
cellUI = function(){};

/**It creates a new cell.popup object.*/
cellUI.popup = function() {};

/**Currently selected template option.*/
cellUI.popup.prototype.selectedCellTemplate = null;

/**
 * Display Select Template Pop up and select default template.
 */
cellUI.popup.prototype.selTemplateUI = function() {
	openCell();
	$("#chkAdmin").attr('checked', false);
	$("#chkCreateProfile").attr('checked', false);
	$("#publicProfile").attr('checked', false);
	$(".addOrRemoveCursor").css('cursor', 'default');
	$("#selTemplateRow0").addClass("popupCellBodySelected"); 
	this.selectedCellTemplate = "#selTemplateRow0";
	this.moveToPrevPage();
};

/**
 * Display Select Template Pop up and select default template.
 */
cellUI.popup.prototype.openAutoPopup = function() {
	var id = objCommon.isSessionExist();
	var contextRoot = sessionStorage.contextRoot;
	if (id != null) {
		var id = '#createCellDialog';
		$('#createCellModal').fadeIn(1000);			
		var winH = $(window).height();
		var winW = $(window).width();
		$(id).css('top', winH / 2 - $(id).height() / 2);
		//$(id).css('top', 120);
		var lefWidth = $(id).width();
		if(lefWidth === 0){
			lefWidth = 330;
		}
		$(id).css('left', winW / 2 - lefWidth / 2);
	} else {
		window.location.href = contextRoot;
	}

	$("#selTemplateRow0").addClass("popupCellBodySelected"); 
	this.selectedCellTemplate = "#selTemplateRow0";
	//this.moveToPrevPage();
};

/**
 * Display create cell Pop up and select default template.
 */
cellUI.popup.prototype.createCellUI = function(){
	$('#selectTemplateBody').hide();
	$('#createCellBody').show();
	$('#textCellPopup').focus();
	/*$("#chkAdmin").attr('checked', false);
	$("#chkCreateProfile").attr('checked', false);
	$("#publicProfile").attr('checked', false);*/
	var newCellUrl=getClientStore().baseURL;
	document.getElementById("cellURL").innerHTML = newCellUrl;
	$('#cellURL').attr('title', newCellUrl);
};

/**
 * This function select row on mouse click.
 * @param index row index
 * @param count total item count
 * @param selectable item is select-able or not
 */
cellUI.popup.prototype.highlightSelRow = function(index,count,selectable){
	if(!selectable){
		//if row is not select-able, do nothing
		return;
	}
	var id = null;
	//remove selection from siblings
	for(var icount = 0; icount < count;icount++){
		if(index != icount){
			id = "#row"+icount;
			$(id).removeClass("popupCellBodySelected");
		}
	}
	//mark current item as selected
	id = "#row"+index;
	this.selectedCellTemplate = id;
	$(id).addClass("popupCellBodySelected");
};


/**
 * This function highlight row on mouse hover.
 * @param index row index
 * @param selectable item is select-able or not
 */
cellUI.popup.prototype.hoverSelRow  =function(index,selectable){
	//hover current item as selected
	if(this.selectedCellTemplate === null){
		id = "#row"+index;
		$(id).addClass("popupCellBodySelected");
	}
};

/**
 * This function remove row highlight on mouse out.
 * @param index row index
 * @param selectable item is select-able or not
 */
cellUI.popup.prototype.mouseOutSelRow = function(index,selectable){
	//hover current item as selected
	if(this.selectedCellTemplate === null){
		id = "#row"+index;
		$(id).removeClass("popupCellBodySelected");
	}
};

/**
 * This function remove row highlight on mouse out.
 * @param index row index
 * @param selectable item is select-able or not
 */
cellUI.popup.prototype.moveToPrevPage = function(){
	$('#selectTemplateBody').show();
	$('#createCellBody').hide();
};

/**
 * This function dynamically populate cell URL.
 */
cellUI.popup.prototype.populateCellURL = function(){
	var cellName = document.getElementById("textCellPopup").value;
	var accessor = objCommon.initializeAccessor(getClientStore().baseURL, cellName,"","");
    var objCellManager = new _pc.CellManager(accessor);
    var cellUrl = objCellManager.getCellUrl(cellName);
	document.getElementById("cellURL").innerHTML = cellUrl;
	$('#cellURL').attr('title', cellUrl);
};


/** The purpose of this function is to create a new Cell. 
 */
cellUI.popup.prototype.performCellCreate = function () {
	var cellAlreadyExist = true;
	//session management
	var id = objCommon.isSessionExist();
	var contextRoot = sessionStorage.contextRoot;
	if (id != null) {
		var url =  getClientStore().baseURL;
		token = getClientStore().token;
		var cellName = document.getElementById("textCellPopup").value;
		var objJdcContext = new _pc.PersoniumContext(url, cellName, "", "");
		var ac = objJdcContext.withToken(token);
		var objCell = new _pc.Cell(ac);
		var objCellManager = new _pc.CellManager(ac);
		document.getElementById("popupCellNameErrorMsg").innerHTML = "";
		//Cell name validation
		if (this.validateInput()) {
			//role name validation
			if ($('#chkAdmin').is(':checked')) {
				//var roleName = document.getElementById("txtRoleName").value;
				if (!this.roleValidation()) {
					//role validation failed
					return;
				}
			}
			if ($('#chkCreateProfile').is(':checked')) {
				var displayName = $("#trDisplayName").val();
				var descriptionDetails = document.getElementById("trDescription").value;
				if (!uCellProfile.validate(displayName, descriptionDetails,
						"popupCellDisplayNameErrorMsg",
						"popupCellDescriptionErrorMsg", '#trDisplayName')) {
					return;
			}
		}
			try {
				objCellManager.retrieve(cellName);
			}
			catch(exception){
				if(exception.code === "PR404-OD-0002"){
					cellAlreadyExist = false;
				}
			}
			if (!cellAlreadyExist) {
				var response  = this.createCell( ac, objCell, objCellManager);
				if(response){
					sessionStorage.totalCellCountForUnit = parseInt(sessionStorage.totalCellCountForUnit) + 1;
					//this.displaySuccessMessage();
				}else{
					this.displayErrorMessage();
				}
				this.closePopup(true);
			}else{
				document.getElementById("popupCellNameErrorMsg").innerHTML = getUiProps().MSG0395;
				uCellProfile.showErrorIcon('#textCellPopup');
			}
		}
	} else {
		window.location.href = contextRoot;
	}
};

/**
 * The purpose of this function is to display success message notification
 */
cellUI.popup.prototype.displaySuccessMessage = function () {
	//setTimeout(function() {
        addSuccessClass("#deleteBoxIcon");
        document.getElementById("deleteBoxSuccessmsg").innerHTML = getUiProps().MSG0328;
        $("#deleteBoxMessageBlock").width(140);
        $("#deleteBoxMessageBlock").css("display", 'table');
        selectBoxInNavigationBar();
        objCommon.centerAlignRibbonMessage("#deleteBoxMessageBlock");
        objCommon.autoHideAssignRibbonMessage('deleteBoxMessageBlock');
	//}, 1000);
};

/**
 * The purpose of this function is to display error message notification
 * on successful box create
 * @param boxName
 */
cellUI.popup.prototype.displayErrorMessage = function () {
	setTimeout(function() {
        addErrorClass("#deleteBoxIcon");
        document.getElementById("deleteBoxSuccessmsg").innerHTML = getUiProps().MSG0329;
        $("#deleteBoxMessageBlock").css("display", 'table');
        objCommon.centerAlignRibbonMessage("#deleteBoxMessageBlock");
        objCommon.autoHideAssignRibbonMessage('deleteBoxMessageBlock');
	}, 10);
};

/**
 * This method is responsible for cell create, with administrator role, no administrator role
 * and cell profile creation. 
 */
cellUI.popup.prototype.createCell = function(accessor, objCell, objCellManager) {
	//Create Cell with Administrator role
	var cell = null;
	var response = true;
	try {
		cell = objCellManager.create(undefined, objCell, null, null, null);
		sessionStorage.isFirstCellCreate = 1;
	} catch (e) {
		response = false;
	}
	if ($('#chkAdmin').is(':checked')) {
		var roleName = document.getElementById("txtRoleName").value;
		var json = {"Name" : roleName,"_Box.Name" : null};
		var objJRole = new _pc.Role(accessor, json);
		var objRoleManager = new _pc.RoleManager(accessor);
		objRoleManager.create(objJRole);
	}
	//When Create Profile is checked.
	if ($('#chkCreateProfile').is(':checked')) {
		var displayName = $("#trDisplayName").val();
		var descriptionDetails = document.getElementById("trDescription").value;
		var scopeSelection = "Private";
		if ($('#publicProfile').is(':checked')) {
			scopeSelection = "Public";
		} 
	uCellProfile.createFirstCellProfile(displayName,descriptionDetails,cell.name, scopeSelection);	
	}
	refreshCellList(true);
	removeSpinner("modalSpinnerCellList");
	return response;
};

/** 
 * The purpose of this function is to validate the name.
 */
cellUI.popup.prototype.validateInput = function() {
	var cellName = document.getElementById("textCellPopup").value;
	var letters = /^[0-9a-zA-Z-_]+$/;
	var startHyphenUnderscore = /^[-_]/;
	lenCellName = cellName.length;
	if (lenCellName < 1) {
		document.getElementById("popupCellNameErrorMsg").innerHTML = getUiProps().MSG0001;
		uCellProfile.showErrorIcon('#textCellPopup');
		return false;
	} else if (lenCellName > 128) {
		document.getElementById("popupCellNameErrorMsg").innerHTML = getUiProps().MSG0396;
		uCellProfile.showErrorIcon('#textCellPopup');
		return false;
	} else if (cellName.match(startHyphenUnderscore)) {
        document.getElementById("popupCellNameErrorMsg").innerHTML = getUiProps().MSG0397;
        uCellProfile.showErrorIcon('#textCellPopup');
        return false;
	} else if (lenCellName != 0 && !(cellName.match(letters))) {
		document.getElementById("popupCellNameErrorMsg").innerHTML = getUiProps().MSG0300;
		uCellProfile.showErrorIcon('#textCellPopup');
		return false;
	}
	document.getElementById("popupCellNameErrorMsg").innerHTML = "";
	uCellProfile.showValidValueIcon('#textCellPopup');
	return true;
};

/**
 * Following method is used to close pop up window
 */
cellUI.popup.prototype.closePopup = function (force) {
	if(sessionStorage.totalCellCountForUnit === '0'){
		if(!force){
		//When cell creation popup is closed with cell not present, it returns to login screen
		logoutManager();
		}
	}else{
		document.getElementById("textCellPopup").value="";
		document.getElementById("txtRoleName").value="";
		
		/*$("#textCellPopup").removeClass("validValueIcon");
		$("#textCellPopup").removeClass("errorIcon");	
		$("#txtRoleName").removeClass("validValueIcon");
		$("#txtRoleName").removeClass("errorIcon");*/
		uCellProfile.removeStatusIcons("#textCellPopup");
		uCellProfile.removeStatusIcons("#txtRoleName");
		uCellProfile.removeStatusIcons("#trDisplayName");
		//document.getElementById("btnPublic").checked = true;
		document.getElementById("chkAdmin").checked = false;
		$('#createCellModal, .window').hide(0);
	}
	$('#chkCreateProfile').attr('checked', false);
	$('#publicProfile').attr('checked', false);
	$('#cellProfileElements :input').attr('disabled', true);
	disableBrowseButton("#btnCellProfileBrowse");
	$('.LHSAlertMessage').html('');
	$('#txtRoleName').attr('disabled', true);
	clearBoxProfileSection('#idImgFileCell', 'popupCellImageErrorMsg','#btnCellProfileBrowse','#figCellProfile','#imgCellProfile','#lblCellNoFileSelected');
};
/**
 * Following method is used for displaying valid value icon.
 * @param txtID
 */
cellUI.popup.prototype.showValidValueIcon = function (txtID) {
	$(txtID).removeClass("errorIcon");	
	$(txtID).addClass("validValueIcon");
};

/**
 * Client side validation of role name
 * @param roleName name of the role
 * @returns {Boolean}
 */
cellUI.popup.prototype.roleValidation = function () {
	var roleName = document.getElementById("txtRoleName").value;
	//The following regex finds underscore(_) and hyphen(-).	
	var specialCharacter = /^[-_]*$/;
	//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(upper case).
	var letter = /^[0-9a-zA-Z-_]+$/;
	var minLengthMessage = getUiProps().MSG0003;
	var maxLengthMessage = getUiProps().MSG0004;
	var charMessage = getUiProps().MSG0005;
	var specialCharMessage = getUiProps().MSG0006;
	var lenRoleName = roleName.length;
	if((lenRoleName < 1)) {
		document.getElementById("popupRoleNameErrorMsg").innerHTML = minLengthMessage;
		uCellProfile.showErrorIcon('#txtRoleName');
		return false;
	} else if((lenRoleName > 128)) {
		document.getElementById("popupRoleNameErrorMsg").innerHTML = maxLengthMessage;
		uCellProfile.showErrorIcon('#txtRoleName');
		return false;
	} else if(lenRoleName != 0 && !(roleName.match(letter))) {
		document.getElementById("popupRoleNameErrorMsg").innerHTML = charMessage;
		uCellProfile.showErrorIcon('#txtRoleName');
		return false;
	} else if(lenRoleName != 0 && (specialCharacter.toString().indexOf(roleName.substring(0, 1)) >= 0)) {
		document.getElementById("popupRoleNameErrorMsg").innerHTML = specialCharMessage;
		uCellProfile.showErrorIcon('#txtRoleName');
		return false;
	} else {
		uCellProfile.showValidValueIcon('#txtRoleName');
		return true;
	}
};

/**
 * Following method is used to display error Icon.
 * @param txtID
 */
cellUI.popup.prototype.showErrorIcon = function (txtID) {
	$(txtID).removeClass("validValueIcon");
	$(txtID).addClass("errorIcon");	
};

/**
 * Following method validates cell Name. 
 */
$("#textCellPopup").blur(function() {
	cellpopup.validateInput();
});

/**
 * Following method clears status icon and message from cell name text box.
 */
$("#textCellPopup").click(function() {
	document.getElementById("popupCellNameErrorMsg").innerHTML = '';
	uCellProfile.removeStatusIcons("#textCellPopup");
});

/**
 * Following method validates role Name. 
 */
$("#txtRoleName").blur(function() {
	cellpopup.roleValidation(); 
});

/**
 * Following method clears status icon and message from role name text box.
 */
$("#txtRoleName").click(function() {
	document.getElementById("popupRoleNameErrorMsg").innerHTML = '';
	uCellProfile.removeStatusIcons("#txtRoleName");
});

/**
 * Following method validates description.
 */
$("#trDescription").blur(function() {
	if ($('#chkCreateProfile').is(':checked')) {
		var descriptionDetails = document.getElementById("trDescription").value;
		uCellProfile.validateDescription(descriptionDetails, "popupCellDescriptionErrorMsg");
	}
});

/**
 * Following method validates display name.
 */
$("#trDisplayName").blur(function() {
	if ($('#chkCreateProfile').is(':checked')) {
		var displayName = $("#trDisplayName").val();
		uCellProfile.validateDisplayName(displayName, "popupCellDisplayNameErrorMsg","#trDisplayName");
	}
});

/**
 * Following method clears status icon and message from display name text box.
 */
$("#trDisplayName").click(function() {
	if ($('#chkAdmin').is(':checked')){
		cellpopup.roleValidation();
	}
	document.getElementById("popupCellDisplayNameErrorMsg").innerHTML = '';
	uCellProfile.removeStatusIcons("#trDisplayName");
});

/**
 * Following method clears status icon and message from description text area.
 */
$("#trDescription").click(function() {
	var displayName = $("#trDisplayName").val();
	uCellProfile.validateDisplayName(displayName, "popupCellDisplayNameErrorMsg","#trDisplayName");
	document.getElementById("popupCellDescriptionErrorMsg").innerHTML = '';
	uCellProfile.removeStatusIcons("#trDescription");
});

$("#publicProfile").click(function() {
	if ($('#publicProfile').is(':checked')){
		// Display Validate Cell Profile.
		cellpopup.validateInput();
		// Display Role Validations.
		if ($('#chkAdmin').is(':checked')){
		cellpopup.roleValidation();
		}
		//Display Name Validations.
		var displayName = $("#trDisplayName").val();
		uCellProfile.validateDisplayName(displayName, "popupCellDisplayNameErrorMsg","#trDisplayName");
		document.getElementById("popupCellDescriptionErrorMsg").innerHTML = '';
		//Description Validations
		var descriptionDetails = document.getElementById("trDescription").value;
		uCellProfile.validateDescription(descriptionDetails, "popupCellDescriptionErrorMsg");
	}
});

function checkboxFocusOnCell(id) {
	$(id).css("outline","-webkit-focus-ring-color auto 5px");
}

function checkboxBlurOnCell(id) {
	$(id).css("outline","none");
}

function divOnFocusBrowseOnCell() {
	$("#dvCellBrowse").css("outline","-webkit-focus-ring-color auto 5px");
}

function divOnBlurBrowseOnCell() {
	$("#dvCellBrowse").css("outline","none");
}