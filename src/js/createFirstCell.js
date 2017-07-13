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
function createFirstCell() {
}
var uCreateFirstCell = new createFirstCell();

$(document).ready(function(){
	var objCellProfile = new cellProfile();
	objCellProfile.persistSessionDetail();
	$("#chkAdmin").click(function() { 
		if ($('#chkAdmin').is(':checked')){
		$("#trAdmin").show();
			} else {
			$("#trAdmin").hide();
			}
			});
			$("#chkCreateProfile").click(function() { 
			if ($('#chkCreateProfile').is(':checked')){ 
			 $("#trDisplayName").show();
			$("#trDescription").show();
			$("#trPhoto").show(); 
			$("#trAccess").show(); 
			} else {
			$("#trDisplayName").hide();
			$("#trDescription").hide();
			$("#trPhoto").hide();
			$("#btnPublic").attr('checked', true);
			$("#btnPrivate").attr('checked', false);
			$("#trAccess").hide(); 
			}
		});
			$("#navFooter").addClass("firstCellFooter");	
	});

	/**
	 * Below stated method is used for attaching footer class.  
	 */
	jQuery(window).load(function() {
		setTimeout(function() {
			//alert('first cell footer!!');
			$("#navFooter").addClass("firstCellFooter");
		}, 150);
	});

	/**
	 * The purpose of this function is to create a new Cell.
	 */
	createFirstCell.prototype.createFirstCell  = function() {
		
		var responseCode;
		var url =  getClientStore().baseURL; 
		token = getClientStore().token;
		var cellName = document.getElementById("textCellPopup").value;
		var objJdcContext = new _pc.PersoniumContext(url, cellName, "", "");
		var accessor = objJdcContext.withToken(token);
		var objCell = new _pc.Cell(accessor);
		var objCellManager = new _pc.CellManager(accessor);
		document.getElementById("popupErrorMsg").innerHTML = null;
		if (uCreateFirstCell.vaidateCellName(cellName)) {
			//Gets the response as true if cell name is new.
			responseCode = objCellManager.getHttpResponseCode(cellName,accessor);
			uCreateFirstCell.isCellExist(responseCode, accessor, objCell, objCellManager);
		}
	};

	/**
	 * The purpose of this function is to validate the cell name.
	 */
	createFirstCell.prototype.vaidateCellName  = function(cellName) {
	
	var letters = /^[0-9a-zA-Z-_]+$/;
	lenCellName = cellName.length;
	if(lenCellName < 1) {
		document.getElementById("popupErrorMsg").innerHTML = "Please enter cell name";
		return false;
	} else if(lenCellName >128) {
		document.getElementById("popupErrorMsg").innerHTML = "Cell name cannot exceed 128 characters";
		return false;
	} else if (lenCellName != 0 && ! (cellName.match(letters))){
		document.getElementById("popupErrorMsg").innerHTML = "Special characters: only - & _ are allowed";
		return false;
	}
	return true;
};

/**
 * The purpose of this method is to create role.
 * @param roleName
 * @param cellName
 */
createFirstCell.prototype.createRoleForFirstCell  = function(roleName,cellName) {
	var json = null;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	json = {"Name" : roleName,"_Box.Name" : null};
	var objJRole = new _pc.Role(accessor, json);
	var objRoleManager = new _pc.RoleManager(accessor);
	objRoleManager.create(objJRole);
	
};

/**
 * The purpose of this method is to show a rotating spinner during first cell is created.
 */
	createFirstCell.prototype.showSpinnerForFirstCell  = function() {
	document.getElementById("modalSpinnerFirstCell").style.display = "inline-block";
	var id = '#dialogSpinner';
	var winH = $(window).height();
	var winW = $(window).width();
	$(id).css('top', winH / 2 - $(id).height() / 2);
	$(id).css('left', winW / 2 - $(id).width() / 2);
	var target = document.getElementById('spinnerPopUp');
	var spinner = new Spinner(objCommon.opts).spin(target);
};
/**
 * The purpose of this function is to check whether an entity already exists or not.
 * If it's an unique name, it creates a Cell.
 * 
 */
  createFirstCell.prototype.isCellExist  = function(responseCode, ac, objCell, objCellManager) {
		if (responseCode === 404) {
			var displayName = $("#txtCellDisplayName").val();
			var descriptionDetails = document.getElementById("txtCellDescription").value;
			var roleName = document.getElementById("txtRoleName").value;
			var scopeSelection = $("#btnPublic").val();
			if ($('#btnPrivate').is(':checked')) {
				scopeSelection = $("#btnPrivate").val();
			}
			//When only Create Role is checked.
			if ($('#chkAdmin').is(':checked') && !$('#chkCreateProfile').is(':checked')) { 
				 if (roleValidation(roleName, "popupDefaultRoleErrorMsg")) { 
					 objCellManager.create(undefined, objCell,roleName,null,null);	
				}
			} 
			//When only Create Profile is checked.
			else if (!$('#chkAdmin').is(':checked') && $('#chkCreateProfile').is(':checked')) { 
				//When only profile is entered along with cell name i.e. no role information only profile will be saved.
				removeSpinner("modalSpinnerCellList");
				if (uCellProfile.validate(displayName, descriptionDetails,"popupCellDisplayNameErrorMsg", "popupCellDescriptionErrorMsg") && isFileValid==true) {
					objCellManager.create(undefined, objCell,null,displayName,descriptionDetails, scopeSelection);	
				}
			}
			//When both are selected - Role and Profile both will be saved.  
			else if ($('#chkAdmin').is(':checked') && $('#chkCreateProfile').is(':checked')) {
				removeSpinner("modalSpinnerCellList");
				 if (roleValidation(roleName, "popupDefaultRoleErrorMsg")) {
					 if (uCellProfile.validate(displayName, descriptionDetails,"popupCellDisplayNameErrorMsg", "popupCellDescriptionErrorMsg") && isFileValid==true) {
						 objCellManager.create(undefined, objCell,roleName,displayName,descriptionDetails, scopeSelection);	
					 }
				}
			 } 
			//When none is selected and only cell need to be created.
			else {
				objCellManager.create(undefined, objCell,null,null,null);
			removeSpinner("modalSpinnerCellList");
			return true;
		}
	} else {
		document.getElementById("popupErrorMsg").innerHTML = "Cell name already exists";
		removeSpinner("modalSpinnerCellList");
		return false;
		}
	};