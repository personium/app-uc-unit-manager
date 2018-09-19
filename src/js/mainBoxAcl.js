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
function mainBoxAcl() {
}

//var arrRolePrivilegeList = [];
var isExist = false;
var uMainBoxAcl = new mainBoxAcl();
var principalMode = false;
/**
 * The purpose of this function is to create role table corresponding to
 * selected cell for main box.
 * @param cellName
 */
mainBoxAcl.prototype.createMainBoxACLRoleTable = function (cellName) {
	$('#aclPrivilegeTable input[type=checkbox]').attr("checked", false);
	$('#aclPrivilegeTable input[type=checkbox]').attr('disabled',true);
	$(".dynamicCellACLRole").remove();
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	var objRoleManager = new _pc.RoleManager(accessor);
	var json = objRoleManager.retrieve("");
	var JSONstring = json.rawData;
	var sortJSONString = objCommon.sortByKey(JSONstring, '__updated');
	var recordSize = sortJSONString.length;
	var dynamicTable = "";
	var name = new Array();
	var boxName = new Array();
	var mainBoxValue = getUiProps().MSG0039;
		var principalBoxName = "'" + sessionStorage.boxName + "'";
		dynamicTable += '<tr id= "row_-1" class = "dynamicCellACLRole" onclick = "uMainBoxAcl.highlightRoleRow('+ -1 + ','+ "'all (anyone)'" +',' + principalBoxName + ','+true+')">';
		dynamicTable += '<td class="roleIconAcl" style="border-bottom:1px solid #fff"></td>';
		dynamicTable += '<td id= "col_-1" width = "80%" name = "acc" title = "' + 'all (anyone)' + '" class = "cellRoleAclTableTD">' + 'all (anyone)'+ '</td>';
		dynamicTable += "</tr>";
		for ( var count = 0; count < recordSize; count++) {
			var obj = sortJSONString[count];
			name[count] = obj.Name;
			boxName[count] = obj["_Box.Name"];
			if (boxName[count] == null) {
				boxName[count] = mainBoxValue;
			}
			var roleName = "'" + name[count] + "'";
			var countBoxName = "'" + boxName[count] + "'";
			var sRoleName = objCommon.getShorterName(name[count], 8);
			var sBoxName = objCommon.getShorterName(boxName[count], 8);
			var sRoleBoxPair = sRoleName + "&nbsp;&nbsp;-&nbsp;&nbsp;" + sBoxName;
			var rName = name[count];
			var bName = boxName[count];
			var roleBoxPair = rName + "  -  " + bName;
			dynamicTable += '<tr id= "row_'
					+ count
					+ '" class = "dynamicCellACLRole" onclick = "uMainBoxAcl.highlightRoleRow('
					+ count + ',' + roleName + ',' + countBoxName + ','+false+')">';
			dynamicTable += '<td class="roleIconAcl" style="border-bottom:1px solid #fff"></td>';
			dynamicTable += '<td id= "col_' + count
					+ '" width = "80%" name = "acc" title = "' + roleBoxPair
					+ '" class = "cellRoleAclTableTD">' + sRoleBoxPair
					+ '</td>';
			dynamicTable += "</tr>";
		}
		if (dynamicTable != "") {
			$("#roleAclTable").append(dynamicTable);
		}
		this.getFirstRoleSelected("all (anyone)", principalBoxName, true);
};

/**
 * The purpose of this function is to implement ACL 
 * for main box
 * @param arrRolePrivilegeList
 */
mainBoxAcl.prototype.implementMainBoxACL = function (arrRolePrivilegeList) {
	var json = "";
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var path = uBoxDetail.getCollectionLocation();
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objJDavCollection = new _pc.DavCollection(accessor, path);
	var objXmlBaseUrlRole = new _pc.Role(accessor);
	objXmlBaseUrlRole.setBoxName(sessionStorage.boxName);
	var resourceBaseUrl = objXmlBaseUrlRole.getResourceBaseUrl();
	var objAce = null;
	var objJAcl = new _pc.Acl();
	var objPrincipal = new _pc.Principal();
	objJAcl.setRequireSchemaAuthz($('input[name="schemaAuth"]:checked').val());
	objJAcl.setBase(resourceBaseUrl);
	for ( var i = 0; i < arrRolePrivilegeList.length; i++) {
		var roleBoxPair = arrRolePrivilegeList[i].role;
		var arrRoleBoxPair = roleBoxPair.split("/");
		var boxName = arrRoleBoxPair[1];
		var roleName = arrRoleBoxPair[2];
		var privilegeList = arrRolePrivilegeList[i].privilege;
		json = {
			"Name" : roleName,
			"_Box.Name" : boxName
		};
		var objJRole = new _pc.Role(accessor, json);
		objAce = new _pc.Ace();
		objAce.setRole(objJRole);
		if (roleName == 'all (anyone)') {
			objAce.setPrincipal('all');
		} else {
			objAce.setRole(objJRole);
		}
		if (privilegeList != null) {
			var arrprivilegeList = privilegeList.split(',');
			for ( var count = 0; count < arrprivilegeList.length; count++) {
				if (arrprivilegeList[count].length != 0) {
					objAce.addPrivilege(arrprivilegeList[count]);
				}
			}
			objJAcl.addAce(objAce);
		}
	}
	var objJAclManager = new _pc.AclManager(accessor, objJDavCollection);
	var response = objJAclManager.setAsAcl(objJAcl);
	return response;
};

/**
 * The purpose of this function is to get first role box selected.
 * 
 * @param roleName
 * @param boxName
 */
mainBoxAcl.prototype.getFirstRoleSelected = function (roleName, boxName, principalMode) {
	boxName = boxName.replace(/[']/g,"");
	var mainBoxValue = getUiProps().MSG0039;
	sessionStorage.selectedCellACLRole = roleName;
	sessionStorage.selectedCellACLBoxName = boxName;
	if (boxName == null && principalMode == false) {
		sessionStorage.selectedCellACLBoxName = mainBoxValue;
	}
	var objFirstRole = $('#row_' + -1);
	objFirstRole.siblings().removeClass('selectRowCellACLRole');
	objFirstRole.addClass('selectRowCellACLRole');
	if ($("#roleAclEditIcon").hasClass("saveIconBoxDetail")) {
		$("#roleAclEditIcon").removeClass("saveIconBoxDetail");
		$("#roleAclEditIcon").addClass("editIconBoxDetail");
		document.getElementById("roleAclEditIcon").title = "Edit";
	}
	uBoxAcl.getAclSetting();
};

/**
 * The purpose of this function is to highlight role row on click of
 * row.
 * 
 * @param count
 * @param roleName
 * @param boxName
 */
mainBoxAcl.prototype.highlightRoleRow = function (count, roleName, boxName, principalMode) {
	boxName = boxName.replace(/[']/g,"");
	var mainBoxValue = getUiProps().MSG0039;
	sessionStorage.selectedCellACLRole = roleName;
	sessionStorage.selectedCellACLBoxName = boxName;
	if (boxName == null && principalMode == false) {
		sessionStorage.selectedCellACLBoxName = mainBoxValue;
	}
	var rowId = '#row_' + count;
	$(rowId).siblings().removeClass('selectProfileRow');
	$(rowId).siblings().removeClass('selectRowCellACLRole');
	$(rowId).addClass('selectProfileRow');
	$(rowId).addClass('selectRowCellACLRole');
	if (sessionStorage['rolePrivilegeSet'].length >0) {
		var savedRolePrivilegeSet = JSON.parse(sessionStorage['rolePrivilegeSet']);
		this.selectedRoleACLOperation(savedRolePrivilegeSet);
	} else {
		$('#aclPrivilegeTable input[type=checkbox]').attr("checked", false);
	}
	if ($("#roleAclEditIcon").hasClass("saveIconBoxDetail")) {
		$('#aclPrivilegeTable input[type=checkbox]').attr('disabled',false);
	}
};

/**
 * The purpose of this function is to bind privilege table according to the
 * role selected from the ACL roles table.
 * 
 * @param jsonData
 */
mainBoxAcl.prototype.selectedRoleACLOperation = function (jsonData) {
	$('#aclPrivilegeTable input[type=checkbox]').attr('disabled', false);
	$('#aclPrivilegeTable input[type=checkbox]').attr("checked", false);
	for ( var i = 0; i < jsonData.length; i++) {
		var aclRoleName = jsonData[i].role;
		var selectedRoleBoxPair = "../" + sessionStorage.selectedCellACLBoxName + "/" + sessionStorage.selectedCellACLRole;
		
		checkedPrivilegeList = jsonData[i].privilege;
		if (aclRoleName == selectedRoleBoxPair) {
			this.checkBoxOperation(checkedPrivilegeList);
		} else {
			// $('#aclPrivilegeTable input[type=checkbox]').attr("checked",
			// false);
		}
	}
	$('#aclPrivilegeTable input[type=checkbox]').attr('disabled', true);
};

/**
 * The purpose of this function is to perform checkbox operations.
 * 
 * @param checkedPrivilegeList
 */
mainBoxAcl.prototype.checkBoxOperation = function (checkedPrivilegeList) {
	var arrCheckedprivilege = null;
	var checkedPrivilege = null;
	arrCheckedprivilege = checkedPrivilegeList.split(',');
	for ( var i = 0; i < arrCheckedprivilege.length; i++) {
		checkedPrivilege = arrCheckedprivilege[i];
		$('#aclPrivilegeTable tr').each(
			function() {
				var privilegeCheckBoxValue = $(this).find(
						".aclSetPrivChkBox").val();
				if (checkedPrivilege == privilegeCheckBoxValue) {
					$('input[value="' + privilegeCheckBoxValue + '"]')
							.attr("checked", true);
				}
			});
	}
};

/**
 * The purpose of this function is to bind privileges to the main box ACL
 * privilege table.
 * 
 * @param response
 */
mainBoxAcl.prototype.bindPrivilegesToMainBoxRoleACLPrivilegeTable = function (roleList, rolePrivList, boxname, schemaAuthz) {
	/*$('#aclPrivilegeTable input[type=checkbox]').attr("checked", false);
	$('#aclPrivilegeTable input[type=checkbox]').attr('disabled', true);*/
	var actualMainBoxValue = getUiProps().MSG0293;
	if(boxname == getUiProps().MSG0039){
		boxname = actualMainBoxValue;
	}
	//var mainBoxValue = "__";//getUiProps().MSG0039;
	var boxNameForRole = "";
	roleList.splice(0, 0, {Name:"all (anyone)"});
	var noOfRoles = roleList.length;
	var dynamicTable = "<tr id='schemaAuthz'><td class='col1'><div class='mainTableEllipsis'>Schema Auth</div></td><td class='col2'><div>"+ schemaAuthz +"</div></td></tr>";
//	dynamicTable += "<tr><td class='col1'><div>all (anyone)</div></td><td class='col2'><div>"+ schemaAuth +"</div></td></tr>";
	for ( var count = 0; count < noOfRoles; count++) {
		var rolePrivCounter = 0;
		var obj = roleList[count];
		var roleName = obj.Name;
		
		if(count != 0){
			boxNameForRole = actualMainBoxValue;
			if (obj._Box.length > 0){
				// Since _Box is an array of only one data, we use the first data
				boxNameForRole = obj._Box[0].Name;
			}
		}else{
			boxNameForRole = boxname;
		}
		
		if(!(boxNameForRole.endsWith('/'))){
			boxNameForRole = boxNameForRole + "/";
		}
		var boxNameValue = boxNameForRole.slice(0,-1);
		if(boxNameValue == actualMainBoxValue){
			boxNameValue = getUiProps().MSG0039;
		}
		var roleBoxPair = "../" + boxNameForRole + roleName;
		var roleBoxValue = roleName + " - " + boxNameValue;
		var recordSize = rolePrivList.length;
		for ( var privCount = 0; privCount < recordSize; privCount++) {
			var aclRoleName = rolePrivList[privCount].role;
			//var selectedRoleBoxPair = "../" + sessionStorage.selectedCellACLBoxName + "/" + sessionStorage.selectedCellACLRole;
			var privilegeList = rolePrivList[privCount].privilege;
			if (aclRoleName == roleBoxPair) {
				//this.checkBoxOperation(checkedPrivilegeList);
				if(roleName != "all (anyone)"){
					dynamicTable += "<tr><td title='"+ roleBoxValue +"' class='col1'><div class='mainTableEllipsis role'>"+ roleName +"</div>" +
							"<div class='hyphen'>-</div><div class='mainTableEllipsis box'>"+ boxNameValue +"</div></td>" +
									"<td class='col2'><div>"+ privilegeList +"</div></td></tr>";
				}else{
					dynamicTable += "<tr><td title='"+ roleName +"' class='col1'><div class='mainTableEllipsis'>"+ roleName +"</div>" +
					"</td><td class='col2'><div>"+ privilegeList +"</div></td></tr>";
				}
				break;
			}
			rolePrivCounter++;
		}
	/*	if(rolePrivCounter == recordSize && roleName != "all (anyone)"){
			dynamicTable += "<tr><td title='"+ roleBoxValue +"' class='col1'><div class='mainTableEllipsis role'>"+ roleName +"</div>" +
					"<div class='hyphen'>-</div><div class='mainTableEllipsis box'>"+ boxNameValue +"</div></td>" +
							"<td class='col2'></td></tr>";
		}*/
	}
	$("#aclSettingsData").html(dynamicTable);
	if (schemaAuthz == 'Not set'){
		$('#schemaAuthz').hide();
	}
	uBoxDetail.setDynamicWidth();
	//uBoxDetail.setDynamicWidth();
	/*var recordSize = response.length;
	var checkedPrivilegeList = null;
	for ( var count = 0; count < recordSize; count++) {
		var aclRoleName = response[count].role;
		var selectedRoleBoxPair = "../" + sessionStorage.selectedCellACLBoxName + "/" + sessionStorage.selectedCellACLRole;
		checkedPrivilegeList = response[count].privilege;
		if (aclRoleName == selectedRoleBoxPair) {
			this.checkBoxOperation(checkedPrivilegeList);
		}
	}*/
	//$('#aclPrivilegeTable input[type=checkbox]').attr('disabled', true);
};

/**
 * The purpose of this function is to persist the privileges corresponding
 * to role box pair.
 * 
 * @param rolePrivilegeList
 */
mainBoxAcl.prototype.persistPrivilege = function (rolePrivilegeList) {
	var roleName = null;
	var jsonRolePrivilegeList = null;
	roleName = sessionStorage.selectedCellACLRole;
	var boxName = sessionStorage.selectedCellACLBoxName;
	var roleBoxPair = "../" + boxName + "/" + roleName;
	jsonRolePrivilegeList = {
		"role" : roleBoxPair,
		"privilege" : rolePrivilegeList
	};
	if (arrRolePrivilegeList.length > 0) {
		for ( var i = 0; i < arrRolePrivilegeList.length; i++) {
			var arrRoleName = arrRolePrivilegeList[i].role;
			if (arrRoleName == roleBoxPair) {
				arrRolePrivilegeList.splice(i, 1);
				arrRolePrivilegeList.push(jsonRolePrivilegeList);
			} else {
				if (this.isRoleExist(roleBoxPair)) {
					isExist = false;
				} else {
					isExist = false;
					arrRolePrivilegeList.push(jsonRolePrivilegeList);
				}
			}
		}
	} else {
		arrRolePrivilegeList.push(jsonRolePrivilegeList);
	}
};

/**
 * The purpose of this function is to check if role box pair exists in
 * role ACL privilege list.
 * @param roleName
 * @returns
 */
mainBoxAcl.prototype.isRoleExist = function (roleBoxPair) {
	for ( var i = 0; i < arrRolePrivilegeList.length; i++) {
		var arrRoleBoxPair = arrRolePrivilegeList[i].role;
		if (arrRoleBoxPair == roleBoxPair) {
			isExist = true;
		}
	}
	return isExist;
};