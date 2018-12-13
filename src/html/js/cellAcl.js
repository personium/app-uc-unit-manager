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
function cellAcl() {
}

var arrCellACLRolePrivilegeList = [];
var isExist = false;
var uCellAcl = new cellAcl();

/**
 * The purpose of this function is to implement cell ACL i.e
 * add and remove privileges from roles.
 * 
 * @param arrCellACLRolePrivilegeList
 */
cellAcl.prototype.implementCellACL = function (arrCellACLRolePrivilegeList) {
	var json = "";
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var path = sessionStorage.selectedcellUrl;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objJDavCollection = new _pc.DavCollection(accessor, path);
	var objAce = null;
	var objJAcl = new _pc.Acl();
	var objPrincipal = new _pc.Principal();
	var rolePrivList = this.getCellACLSettings();
	objJAcl.setRequireSchemaAuthz(rolePrivList.schemaAuthz);

	for ( var i = 0; i < arrCellACLRolePrivilegeList.length; i++) {
		var roleBoxPair = arrCellACLRolePrivilegeList[i].role;
		var arrRoleBoxPair = roleBoxPair.split("/");
		var boxName = arrRoleBoxPair[1];
		var roleName = arrRoleBoxPair[2];
		var privilegeList = arrCellACLRolePrivilegeList[i].privilege;
		json = {
			"Name" : roleName,
			"_Box.Name" : boxName
		};
		var objJRole = new _pc.Role(accessor, json);
		objAce = new _pc.Ace();
		objAce.setRole(objJRole);
		if (privilegeList != null) {
			var arrprivilegeList = privilegeList.split(',');
			for ( var count = 0; count < arrprivilegeList.length; count++) {
				if (arrprivilegeList[count].length != 0) {
					objAce.addPrivilege(arrprivilegeList[count]);
				}
			}
			objJAcl.addAce(objAce);
		}
		//objJAcl.addAce(objAce);
	}
	var objJAclManager = new _pc.AclManager(accessor, objJDavCollection);
	var response = objJAclManager.setAsAcl(objJAcl);
	return response;
};

/**
 * The purpose of this function is to t toggle between edit and
 * save mode.
 */
/*cellAcl.prototype.cellACLToggleMode = function () {
	if ($("#cellRoleACLEditIcon").hasClass("editIconACL")) {
		var mainBoxValue = getUiProps().MSG0039;
		$('#cellACLPrivilegeTable input[type=checkbox]')
				.attr('disabled', false);
		$("#cellRoleACLEditIcon").removeClass("editIconACL");
		$("#cellRoleACLEditIcon").addClass("saveIconACL");
		document.getElementById("cellRoleACLEditIcon").title = "Save";
		arrCellACLRolePrivilegeList = JSON
				.parse(sessionStorage['cellACLRolePrivilegeSet']);
		for ( var i = 0; i < arrCellACLRolePrivilegeList.length; i++) {
			var roleName = arrCellACLRolePrivilegeList[i].role;
			var priv = arrCellACLRolePrivilegeList[i].privilege;
			var index = roleName.indexOf(".");
			if (index == -1) {
				var newRole = "../"+ mainBoxValue+ "/" + roleName;
				var json = {
					"role" : newRole,
					"privilege" : priv
				};
				arrCellACLRolePrivilegeList.splice(i, 1, json);
			}

		}
	} else if ($("#cellRoleACLEditIcon").hasClass("saveIconACL")) {
		var SUCCESSCODE = 200;
		var response = this.implementCellACL(arrCellACLRolePrivilegeList);
		if (response.httpClient.status == SUCCESSCODE) {
			arrCellACLRolePrivilegeList.length = 0;
			sessionStorage['cellACLRolePrivilegeSet'] = "";
			this.getCellACLSettings();
			$("#cellRoleACLEditIcon").removeClass("saveIconACL");
			$("#cellRoleACLEditIcon").addClass("editIconACL");
			document.getElementById("cellRoleACLEditIcon").title = "Edit";
		}
	}
};*/

/**
 * The purpose of this function is to get first role box selected.
 * 
 * @param roleName
 * @param boxName
 */
cellAcl.prototype.getFirstCellACLRoleSelected = function (roleName, boxName) {
	var mainBoxValue = getUiProps().MSG0039;
	sessionStorage.selectedCellACLRole = roleName;
	sessionStorage.selectedCellACLBoxName = boxName;
	if (boxName == null) {
		sessionStorage.selectedCellACLBoxName = mainBoxValue;
	}
	var objFirstRole = $('#row_' + 0);
	objFirstRole.siblings().removeClass('selectRowCellACLRole');
	objFirstRole.addClass('selectRowCellACLRole');
	this.getCellACLSettings();
};

/**
 * The purpose of this function is to retrieve cell ACL settings by calling
 * API.
 */
cellAcl.prototype.getCellACLSettings = function () {
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var path = sessionStorage.selectedcellUrl;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objJDavCollection = new _pc.DavCollection(accessor, path);
	var objJAclManager = new _pc.AclManager(accessor, objJDavCollection);
	var response = uBoxAcl.getAclList(accessor, objJDavCollection);
	return response;
};

/**
 * The purpose of this function is to check if role box pair exists in
 * cell ACL privilege list.
 * @param roleName
 * @returns
 */
cellAcl.prototype.isRoleExist = function (roleBoxPair) {
	for ( var i = 0; i < arrCellACLRolePrivilegeList.length; i++) {
		var arrRoleBoxPair = arrCellACLRolePrivilegeList[i].role;
		if (arrRoleBoxPair == roleBoxPair) {
			isExist = true;
		}
	}
	return isExist;
};

/**
 * The purpose of this function is to get all selected privileges from
 * privilege table.
 */
cellAcl.prototype.getCheckBoxPrivilegeSelection = function () {
	var selectedPrivilege = objCommon.getMultipleSelections(
			'cellACLPrivilegeTable', 'input', 'cellRoleACLCheckBox');
	uCellAcl.persistPrivilege(selectedPrivilege);
};

/**
 * The purpose of this function is to 
 * @param chkBox
 */
cellAcl.prototype.cellACLCheckBoxSelect = function (chkBox) {
	uCellAcl.getCheckBoxPrivilegeSelection();
};

/**
 * The purpose of this function is to create role table 
 * @param cellName
 */
cellAcl.prototype.createCellACLRoleTable = function () {
	var roleCount = retrieveRoleRecordCount();
	var JSONstring = objRole.retrieveChunkedData(0, roleCount);
	var sortJSONString = objCommon.sortByKey(JSONstring, '__updated');
	var recordSize = sortJSONString.length;
	var dynamicTable = "";
	var mainBoxValue = getUiProps().MSG0039;
	if (recordSize > 0) {
		var rolePrivList = this.getCellACLSettings();
		var test =rolePrivList.privilegeList;
		var previlegeRecordSize = test.length;
		if (previlegeRecordSize == undefined) {
			previlegeRecordSize = 0;
		}
		for ( var count = 0; count < recordSize; count++) {
			var obj = sortJSONString[count];
			roleName = obj.Name;
			boxName = obj["_Box.Name"];
			if (boxName == null) {
				boxName = mainBoxValue;
			}
			var sRoleName = objCommon.getShorterName(roleName, 25);
			var sBoxName = objCommon.getShorterName(boxName, 30);
			if (sRoleName.length>=25 && sBoxName.length>=13) {
				sRoleName = objCommon.getShorterName(roleName, 18);
				sBoxName = objCommon.getShorterName(boxName, 13);
			}
			var sRoleBoxPair = sRoleName + "&nbsp;-&nbsp;" + sBoxName;
			var roleBoxPair = roleName + "  -  " + boxName;
			var selectedRoleBoxPair = "../" + boxName + "/" + roleName;
			var rolePrivCounter = 0;
			dynamicTable += "<tr>";
			dynamicTable += "<td class='col1 ContentTextpt1'><div class='mainTableEllipsis' title='"+ roleBoxPair +"'>"+ sRoleBoxPair +"</div></td>";
			for ( var privCount = 0; privCount < previlegeRecordSize; privCount++) {
				var aclRoleName = test[privCount].role;
				var index = aclRoleName.lastIndexOf("/");
				if (index == -1) {
					aclRoleName = "../" + mainBoxValue + "/" + aclRoleName;
				}
				var privilegeList = test[privCount].privilege;
				if (aclRoleName == selectedRoleBoxPair) {
						dynamicTable += "<td class='col2 ContentTextpt1'><div>"+ privilegeList.replace(/[, ]+/g, ', ') + "</div></td>";
					break;
				}
				rolePrivCounter++;
			}
			dynamicTable += "</tr>";
		}
		if (dynamicTable != "") {
			$("#cellInfoAdmin thead").show();
			$("#cellInfoAdminData").html(dynamicTable);
		}
	} else {
		var noRole = getUiProps().MSG0231;
		var displayErrorMessage = "";
		$("#cellInfoAdmin thead").hide();
		displayErrorMessage = "<tr class='trCellRolesBodyEmptyMsg' ><td colspan='2' style='border:none;'><div id='cellRolesBody' class='emptyTableMessage' style='width:150px;margin:8% 0% 0% 40%'>"
				+ noRole + "</div></td></tr>";
		$("#cellInfoAdminData").html(displayErrorMessage);
	}
	uCellAcl.setDynamicHeight();
};

/**
 * Following method opens and populates the edit cell pop up window.
 * @param idDialogBox
 * @param idModalWindow
 */
cellAcl.prototype.openPopUpWindow = function(idDialogBox, idModalWindow) {
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	this.populateCellACLSettings();
        $('#lblRoot0').focus();
		$('#editAclSettingsTable').scroll(
			function() {
				$("#editAclSettingsTable > tbody").width($("#editAclSettingsTable").width()
						+ $("#editAclSettingsTable").scrollLeft());
			});
};

/**
 * Following method fetches role and its acl settings.
 * @returns {Array} array of role and its corresponding privilege(s).
 */
cellAcl.prototype.getRoleBoxACLSettings = function() {
	var rowCount = $('#editCellACLGridTbody tr').length;
	var rolePrivilegeList = '';
	var arrCheckedRolePrivilegeList = [];
	var jsonRolePrivilegeList = null;
	var mainBoxValue = getUiProps().MSG0039;
	for ( var index = 0; index < rowCount; index++) {
		var roleBoxCombo =  '';
		var roleBoxPair ='';
		roleBoxCombo =  $('#dv' + index).attr("title");
		if (roleBoxCombo!=undefined){
			var arrRoleBoxCombo = '';
			arrRoleBoxCombo = roleBoxCombo.split(' - ');
		
		roleName = arrRoleBoxCombo[0];
		boxName = arrRoleBoxCombo[1].trim();
		if (boxName == mainBoxValue) {
			boxName = getUiProps().MSG0293;;
		}
		roleBoxPair = "../" + boxName + "/" + roleName;
		}
		//root, auth, auth-read, message, message-read, event, event-read, log, log-read, social, social-read, box, box-read, box-install, acl, acl-read, propfind.
		if ($('#chkroot' + index).is(':checked')) {
			rolePrivilegeList += 'p:root,';
		}
		if ($('#chkauth' + index).is(':checked')) {
			rolePrivilegeList += 'p:auth,';
		}
		if ($('#chkauth-read' + index).is(':checked')) {
			rolePrivilegeList += 'p:auth-read,';
		}
		if ($('#chkmessage' + index).is(':checked')) {
			rolePrivilegeList += 'p:message,';
		}
		if ($('#chkmessage-read' + index).is(':checked')) {
			rolePrivilegeList += 'p:message-read,';
		}
		if ($('#chkevent' + index).is(':checked')) {
			rolePrivilegeList += 'p:event,';
		}
		if ($('#chkevent-read' + index).is(':checked')) {
			rolePrivilegeList += 'p:event-read,';
		}
		if ($('#chklog' + index).is(':checked')) {
			rolePrivilegeList += 'p:log,';
		}
		if ($('#chklog-read' + index).is(':checked')) {
			rolePrivilegeList += 'p:log-read,';
		}
		if ($('#chksocial' + index).is(':checked')) {
			rolePrivilegeList += 'p:social,';
		}
		if ($('#chksocial-read' + index).is(':checked')) {
			rolePrivilegeList += 'p:social-read,';
		}
		if ($('#chkbox' + index).is(':checked')) {
			rolePrivilegeList += 'p:box,';
		}
		if ($('#chkbox-read' + index).is(':checked')) {
			rolePrivilegeList += 'p:box-read,';
		}
		if ($('#chkbox-install' + index).is(':checked')) {
			rolePrivilegeList += 'p:box-install,';
		}
		if ($('#chkacl' + index).is(':checked')) {
			rolePrivilegeList += 'p:acl,';
		}
		if ($('#chkacl-read' + index).is(':checked')) {
			rolePrivilegeList += 'p:acl-read,';
		}
		if ($('#chkpropfind' + index).is(':checked')) {
			rolePrivilegeList += 'p:propfind,';
		}
		if ($('#chkall' + index).is(':checked')) {
			rolePrivilegeList += 'D:all,';
		}
		if ($('#chkread' + index).is(':checked')) {
			rolePrivilegeList += 'D:read,';
		}
		if ($('#chkwrite' + index).is(':checked')) {
			rolePrivilegeList += 'D:write,';
		}
		if ($('#chkread-properties' + index).is(':checked')) {
			rolePrivilegeList += 'D:read-properties,';
		}
		if ($('#chkwrite-properties' + index).is(':checked')) {
			rolePrivilegeList += 'D:write-properties,';
		}
		if ($('#chkread-acl' + index).is(':checked')) {
			rolePrivilegeList += 'D:read-acl,';
		}
		if ($('#chkwrite-acl' + index).is(':checked')) {
			rolePrivilegeList += 'D:write-acl,';
		}
		if ($('#chkexec' + index).is(':checked')) {
			rolePrivilegeList += 'D:exec,';
		}
		if ($('#chkalsc' + index).is(':checked')) {
			rolePrivilegeList += 'D:alter-schema,';
		}

		//regex below removes the last comma and extra space from the privilege list.
		if (rolePrivilegeList.length >= 1) {
		jsonRolePrivilegeList = {
				"role" : roleBoxPair,
				"privilege" : rolePrivilegeList.replace(/,\s*$/, "")
			};
		arrCheckedRolePrivilegeList.push(jsonRolePrivilegeList);
		jsonRolePrivilegeList = null;
		rolePrivilegeList='';
		}
	}
	return arrCheckedRolePrivilegeList;
};

/**
 * Following method creates for edit cell pop up.
 * @param dynamicTable html table.
 * @param id count for checkbox id.
 * @param roleBoxDisplay role box name.
 * @returns HTML table.
 */
cellAcl.prototype.createAclRows = function(dynamicTable, id, roleBoxDisplay) {
	var tabIndex = id + 1;
	var lblRootFocus = '"' + "#lblRoot"+id + '"';
	var lblAuthFocus = '"' + "#lblAuth"+id + '"';
	var lblAuthreadFocus = '"' + "#lblAuth-read"+id + '"';
	var lblMessageFocus = '"' + "#lblMessage"+id + '"';
	var lblMessagereadFocus = '"' + "#lblMessage-read"+id + '"';
	var lblEventFocus = '"' + "#lblEvent"+id + '"';
	var lblEventreadFocus = '"' + "#lblEvent-read"+id + '"';
	var lblLogFocus = '"' + "#lblLog"+id + '"';
	var lblLogReadFocus = '"' + "#lblLogRead"+id + '"';
	var lblSocialFocus = '"' + "#lblSocial"+id + '"';
	var lblSocialReadFocus = '"' + "#lblSocialRead"+id + '"';
	var lblBoxFocus = '"' + "#lblBox"+id + '"';
	var lblBoxReadFocus = '"' + "#lblBoxRead"+id + '"';
	var lblBoxInstallFocus = '"' + "#lblBoxInstall"+id + '"';
	var lblAclFocus = '"' + "#lblAcl"+id + '"';
	var lblAclreadFocus = '"' + "#lblAcl-read"+id + '"';
	var lblPropfindFocus = '"' + "#lblPropfind"+id + '"';
	var lblAllFocus = '"' + "#lblAll"+id + '"';
	var lblReadFocus = '"' + "#lblRead"+id + '"';
	var lblWriteFocus = '"' + "#lblWrite"+id + '"';
	var lblReadPropertiesFocus = '"' + "#lblReadProperties"+id + '"';
	var lblWritePropertiesFocus = '"' + "#lblWriteProperties"+id + '"';
	var lblReadAclFocus = '"' + "#lblReadAcl"+id + '"';
	var lblWriteAclFocus = '"' + "#lblWriteAcl"+id + '"';
	var lblExecFocus = '"' + "#lblExec"+id + '"';
	var lblAlscFocus = '"' + "#lblAlsc"+id + '"';
	
	dynamicTable += "<tr id=tr_"
			+ id
			+ "><td  style='text-align:left;' class='borderRight'><div id=dv"
			+ id
			+ " class='editACLTableEllipsis' title='"
			+ roleBoxDisplay
			+ "'>"
			+ roleBoxDisplay
			+ "</div></td><td><input id='chkroot"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblRootFocus+");' onblur='checkBoxCellACLBlur("+lblRootFocus+");' tabindex='"+tabIndex+"' value='p:root'><label id ='lblRoot"
			+ id
			+ "' for='chkroot"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkauth"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblAuthFocus+");' onblur='checkBoxCellACLBlur("+lblAuthFocus+");' tabindex='"+tabIndex+"'  value='auth'><label id ='lblAuth"
			+ id
			+ "' for='chkauth"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id = 'chkauth-read"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblAuthreadFocus+");' onblur='checkBoxCellACLBlur("+lblAuthreadFocus+");' tabindex='"+tabIndex+"'  value='p:auth-read'><label id ='lblAuth-read"
			+ id
			+ "' for='chkauth-read"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id = 'chkmessage"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblMessageFocus+");' onblur='checkBoxCellACLBlur("+lblMessageFocus+");' tabindex='"+tabIndex+"'  value='p:message'><label id ='lblMessage"
			+ id
			+ "' for='chkmessage"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id = 'chkmessage-read"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblMessagereadFocus+");' onblur='checkBoxCellACLBlur("+lblMessagereadFocus+");' tabindex='"+tabIndex+"'  value='p:message-read'><label id ='lblMessage-read"
			+ id
			+ "' for='chkmessage-read"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id = 'chkevent"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblEventFocus+");' onblur='checkBoxCellACLBlur("+lblEventFocus+");' tabindex='"+tabIndex+"'  value='p:event'><label id ='lblEvent"
			+ id
			+ "' for='chkevent"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id = 'chkevent-read"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblEventreadFocus+");' onblur='checkBoxCellACLBlur("+lblEventreadFocus+");' tabindex='"+tabIndex+"'  value='p:event-read'><label id ='lblEvent-read"
			+ id
			+ "' for='chkevent-read"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chklog"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblLogFocus+");' onblur='checkBoxCellACLBlur("+lblLogFocus+");' tabindex='"+tabIndex+"'  value='p:log'><label id ='lblLog"
			+ id
			+ "' for='chklog"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chklog-read"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblLogReadFocus+");' onblur='checkBoxCellACLBlur("+lblLogReadFocus+");' tabindex='"+tabIndex+"'  value='p:log-read'><label id ='lblLogRead"
			+ id
			+ "' for='chklog-read"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chksocial"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblSocialFocus+");' onblur='checkBoxCellACLBlur("+lblSocialFocus+");' tabindex='"+tabIndex+"'  value='p:log-social'><label id ='lblSocial"
			+ id
			+ "' for='chksocial"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chksocial-read"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblSocialReadFocus+");' onblur='checkBoxCellACLBlur("+lblSocialReadFocus+");' tabindex='"+tabIndex+"'  value='p:social-read'><label id ='lblSocialRead"
			+ id
			+ "' for='chksocial-read"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chkbox"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblBoxFocus+");' onblur='checkBoxCellACLBlur("+lblBoxFocus+");' tabindex='"+tabIndex+"'  value='p:box'><label id ='lblBox"
			+ id
			+ "' for='chkbox"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chkbox-read"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblBoxReadFocus+");' onblur='checkBoxCellACLBlur("+lblBoxReadFocus+");' tabindex='"+tabIndex+"'  value='p:box-read'><label id ='lblBoxRead"
			+ id
			+ "' for='chkbox-read"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chkbox-install"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblBoxInstallFocus+");' onblur='checkBoxCellACLBlur("+lblBoxInstallFocus+");' tabindex='"+tabIndex+"'  value='p:box-install'><label id ='lblBoxInstall"
			+ id
			+ "' for='chkbox-install"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chkacl"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblAclFocus+");' onblur='checkBoxCellACLBlur("+lblAclFocus+");' tabindex='"+tabIndex+"'  value='p:acl'><label id ='lblAcl"
			+ id
			+ "' for='chkacl"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chkacl-read"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblAclreadFocus+");' onblur='checkBoxCellACLBlur("+lblAclreadFocus+");' tabindex='"+tabIndex+"'  value='p:acl-read'><label id ='lblAcl-read"
			+ id
			+ "' for='chkacl-read"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input id= 'chkpropfind"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblPropfindFocus+");' onblur='checkBoxCellACLBlur("+lblPropfindFocus+");' tabindex='"+tabIndex+"'  value='p:propfind'><label id ='lblPropfind"
			+ id 
			+ "' for='chkpropfind"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkall"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblAllFocus+");' onblur='checkBoxCellACLBlur("+lblAllFocus+");' tabindex='"+tabIndex+"'  value='D:all'><label id ='lblAll"
			+ id
			+ "' for='chkall"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkread"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblReadFocus+");' onblur='checkBoxCellACLBlur("+lblReadFocus+");' tabindex='"+tabIndex+"'  value='D:read'><label id ='lblRead"
			+ id
			+ "' for='chkread"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkwrite"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblWriteFocus+");' onblur='checkBoxCellACLBlur("+lblWriteFocus+");' tabindex='"+tabIndex+"'  value='D:write'><label id ='lblWrite"
			+ id
			+ "' for='chkwrite"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkread-properties"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblReadPropertiesFocus+");' onblur='checkBoxCellACLBlur("+lblReadPropertiesFocus+");' tabindex='"+tabIndex+"'  value='D:read-properties'><label id ='lblReadProperties"
			+ id
			+ "' for='chkread-properties"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkwrite-properties"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblWritePropertiesFocus+");' onblur='checkBoxCellACLBlur("+lblWritePropertiesFocus+");' tabindex='"+tabIndex+"'  value='D:write-properties'><label id ='lblWriteProperties"
			+ id
			+ "' for='chkwrite-properties"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkread-acl"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblReadAclFocus+");' onblur='checkBoxCellACLBlur("+lblReadAclFocus+");' tabindex='"+tabIndex+"'  value='D:read-acl'><label id ='lblReadAcl"
			+ id
			+ "' for='chkread-acl"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkwrite-properties"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblWriteAclFocus+");' onblur='checkBoxCellACLBlur("+lblWriteAclFocus+");' tabindex='"+tabIndex+"'  value='D:write-acl'><label id ='lblWriteAcl"
			+ id
			+ "' for='chkwrite-acl"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkexec"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblExecFocus+");' onblur='checkBoxCellACLBlur("+lblExecFocus+");' tabindex='"+tabIndex+"'  value='p:exec'><label id ='lblExec"
			+ id
			+ "' for='chkexec"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkalsc"
			+ id
			+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' onfocus='checkBoxCellACLFocus("+lblAlscFocus+");' onblur='checkBoxCellACLBlur("+lblAlscFocus+");' tabindex='"+tabIndex+"'  value='p:alter-schema'><label id ='lblAlsc"
			+ id
			+ "' for='chkalsc"
			+ id
			+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td></tr>";
		return dynamicTable;
};

/**
 * Following method populates Cell Acl settings pop up with relevant privilege values.
 */
cellAcl.prototype.populateCellACLSettings = function () {
	objCommon.restScrollBar('#editCellACLGridTbody');
	var roleCount = retrieveRoleRecordCount();
	var JSONstring = objRole.retrieveChunkedData(0, roleCount);
	var sortJSONString = objCommon.sortByKey(JSONstring, '__updated');
	var recordSize = sortJSONString.length;
	var arrCheckedState =[];
	var mainBoxValue = getUiProps().MSG0039;
	var dynamicTable = "<tr><td style='text-align: left;'class='borderRight headerFontSettings'><div class='editACLTableEllipsis '></div></td><td class='headerFontSettings'><div>Root</div></td><td class='headerFontSettings headerCellAcl'><div>Auth</div></td><td class='headerFontSettings '><div class='auth-read'>Auth-Read</div></td><td class='headerFontSettings '><div>Message</div></td><td class='headerFontSettings '><div class='message-read'>Message-Read</div></td><td class='headerFontSettings '><div class=''>Event</div></td><td class='headerFontSettings '><div class='event-read'>Event-Read</div></td><td class='headerFontSettings '><div>Log</div></td><td class='headerFontSettings '><div class='log-read'>Log-Read</div></td><td class='headerFontSettings '><div>Social</div></td><td class='headerFontSettings '><div class='social-read'>Social-Read</div></td><td class='headerFontSettings '><div>Box</div></td><td class='headerFontSettings '><div class='box-read'>Box-Read</div></td><td class='headerFontSettings '><div class='box-install'>Box-Install</div></td><td class='headerFontSettings '><div>Acl</div></td><td class='headerFontSettings '><div class='acl-read'>Acl-Read</div></td><td class='headerFontSettings '><div>propfind</div></td><td class='headerFontSettings'><div>All</div></td><td class='headerFontSettings'><div class='read' >Read</div></td><td class='headerFontSettings'><div class='write'>Write</div></td><td class='headerFontSettings'><div class='read-properties'>Read-Properties</div></td><td class='headerFontSettings'><div class='write-properties'>Write-Properties</div></td><td class='headerFontSettings'><div class='read-acl'>Read-ACL</div></td><td class='headerFontSettings'><div class='write-acl'>Write-ACL</div></td><td class='headerFontSettings'><div class='exec'>Exec</div></td><td class='headerFontSettings'><div class='alter-schema'>Alter-Schema</div></td></tr>";
	if (recordSize > 0) {
		var rolePrivList = this.getCellACLSettings();
		var test = rolePrivList.privilegeList;
		var previlegeRecordSize = test.length;
		if (previlegeRecordSize == undefined) {
			previlegeRecordSize = 0;
		}
		for ( var count = 0; count < recordSize; count++) {
			var obj = sortJSONString[count];
			roleName = obj.Name;
			boxName = obj["_Box.Name"];
			if (boxName == null) {
				boxName = mainBoxValue;
			}
			var sRoleName = objCommon.getShorterName(roleName, 25);
			if (sRoleName.length>=25 && sRoleName.length>=13) {
				sRoleName = objCommon.getShorterName(roleName, 18);
				sBoxName = objCommon.getShorterName(boxName, 13);
			}
			var roleBoxPair = roleName + "  -  " + boxName;
			var selectedRoleBoxPair = "../" + boxName + "/" + roleName;
			var rolePrivCounter = 0;
			for ( var privCount = 0; privCount < previlegeRecordSize; privCount++) {
				var aclRoleName = test[privCount].role;
				var index = aclRoleName.lastIndexOf("/");
				if (index == -1) {
					aclRoleName = "../" + mainBoxValue + "/" + aclRoleName;
				}
				var privilegeList = test[privCount].privilege;
				if (aclRoleName == selectedRoleBoxPair) {
					var objCheckedState = {
						"RowID" : count,
						"privilegeList" : privilegeList
					};
					arrCheckedState.push(objCheckedState);
					//It creates row for a role that has privileges.
					dynamicTable = this.createAclRows(dynamicTable, count,
							roleBoxPair);
					break;
				} 
				rolePrivCounter++;
			}
			//It creates row for a role that has no privileges.
			if (rolePrivCounter == previlegeRecordSize ) {
				dynamicTable = this.createAclRows(dynamicTable, count,
						roleBoxPair);
			}
		}
	}
	$("#editCellACLGridTbody").html(dynamicTable);
	$("#btnCancelEditCellAcl").attr("tabindex", recordSize + 1);
	$("#btnEditCellAcl").attr("tabindex", recordSize + 2);
	$(".crossIconCellACLFocus").attr("tabindex", recordSize + 3);
	uBoxDetail.checkPrivleges(arrCheckedState);
};

/**
 * Following method edits cell ACL, this is invoked on the clisk of Save button from edit cell acl pop up.
 */
cellAcl.prototype.editCellAcl = function() {
	var response = this.implementCellACL(this.getRoleBoxACLSettings());
	var code = objCommon.getStatusCode(response);
	if (code == 200) {
		this.createCellACLRoleTable();
		closeEntityModal('#editCellAclSettingModal');
	}
};

cellAcl.prototype.setDynamicHeight= function() {
	var viewPortHeight = $(window).height();
	var cellInfoListHeight = viewPortHeight-200;
	if (viewPortHeight <=650) {
		cellInfoListHeight = 450;
	}
	$("#cellInfoDetail").css("max-height", cellInfoListHeight + "px");
	$("#AdministrationDetail").css("max-height", cellInfoListHeight + "px");	
};

function checkBoxCellACLFocus(id) {
	$(id).css("outline","-webkit-focus-ring-color auto 5px");
}

function checkBoxCellACLBlur(id) {
	$(id).css("outline","none");
}

$(window).resize(function(){
	uCellAcl.setDynamicHeight();
});

