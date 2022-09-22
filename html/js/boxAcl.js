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
function boxAcl() {
}
var arrRolePrivilegeList = [];
var isExist = false;
var isOldRoleExist = false;
var uBoxAcl = new boxAcl();
boxAcl.prototype.SOURCE = "Box";
boxAcl.prototype.DESTINATION = "Role";
var isClickedFolder = false;
/**
 * The purpose of this function is to fetch role list against selected cell and 
 * box and bind role acl table
 */
boxAcl.prototype.roleAclTable = function () {
	sessionStorage['rolePrivilegeSet'] = "";
	//uMainBoxAcl.createMainBoxACLRoleTable(cellName);
};

/**
 * The purpose of this function is to implement alternate row color feature in
 * role acl table
 */
boxAcl.prototype.alternateRowColor = function () {
	$(".dynamicAclRole tr:even").css("background-color", "#F4F4F4");
	$(".selectProfileRow").css("background-color", "#dfdfdf");
};

/**
 * The purpose of this function is to implement toogle mode functionality for acl 
 * edit icon.
 */
boxAcl.prototype.toggleMode = function() {
	if ($("#roleAclEditIcon").hasClass("editIconBoxDetail")) {
		var mainBoxValue = getUiProps().MSG0039;
		$('#aclPrivilegeTable input[type=checkbox]').attr('disabled',false);
		$("#roleAclEditIcon").removeClass("editIconBoxDetail");
		$("#roleAclEditIcon").addClass("saveIconBoxDetail");
		document.getElementById("roleAclEditIcon").title = "Save";
		if (sessionStorage['rolePrivilegeSet'].length >0) {
			arrRolePrivilegeList = JSON.parse(sessionStorage['rolePrivilegeSet']);
		}
		var actualMainBoxValue = getUiProps().MSG0293;
		if (sessionStorage.boxName == actualMainBoxValue) {
			for ( var i = 0; i < arrRolePrivilegeList.length; i++) {
				var roleName = arrRolePrivilegeList[i].role;
				var priv = arrRolePrivilegeList[i].privilege;
				var index = roleName.indexOf(".");
				if (index == -1) {
					var newRole = "../"+ mainBoxValue+ "/" + roleName;
					var json = {
						"role" : newRole,
						"privilege" : priv
					};
					arrRolePrivilegeList.splice(i, 1, json);
				}

			}
		}
	} else if ($("#roleAclEditIcon").hasClass("saveIconBoxDetail")) {
		var response = null;
		response = uMainBoxAcl.implementMainBoxACL(arrRolePrivilegeList);
		if (response.httpClient.status == 200) {
			sessionStorage['rolePrivilegeSet'] = "";
			arrRolePrivilegeList.length = 0;
			this.getAclSetting();
			if(objOdata.getSelectedCollectionName() == ""){
				document.getElementById("boxPropsPaneHeader").innerHTML = sessionStorage.boxName;
			}
			$("#roleAclEditIcon").removeClass("saveIconBoxDetail");
			$("#roleAclEditIcon").addClass("editIconBoxDetail");
			document.getElementById("roleAclEditIcon").title = "Edit";
		}
	}
};


/**
 * The purpose of this function is to implement all check box select feature
 */
boxAcl.prototype.checkBoxSelect = function(chkBox) {
	uBoxAcl.getCheckBoxPrivilegeSelection();
};

/**
 * The purpose of this function is to get selected check box value and
 * persist that against selected role name
 */
boxAcl.prototype.getCheckBoxPrivilegeSelection = function () {
	var selectedPrivilege = objCommon.getMultipleSelections('aclPrivilegeTable', 'input', 'roleAclCheckBox');
	uMainBoxAcl.persistPrivilege(selectedPrivilege);
	//return selectedPrivilege;
};

/**
 * The purpose of this method is to fetch role list associated with the cell.
 * @returns role list
 */
boxAcl.prototype.getRoleListForCell = function(){
	var roleCount = retrieveRoleRecordCount();
	var dataJson = objRole.retrieveChunkedData(0, roleCount);
	return dataJson;
/*	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	var objRoleManager = new _pc.RoleManager(accessor);
	var json = objRoleManager.retrieve("");
	var JSONstring = json.rawData;
	var sortJSONString = objCommon.sortByKey(JSONstring, '__updated');
	return sortJSONString;*/
};

/**
 * The purpose of this function is to implement get ACL setting feature for selected
 * collection
 */
boxAcl.prototype.getAclSetting = function (collectionURL, boxname) {
	uBoxDetail.setCollectionLocation(collectionURL);
	//var objOdata = new odata();
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	/*var colName= objOdata.getSelectedCollectionName();
	//this.setACLHeader(colName,1);
	var path = baseUrl+cellName+"/";//+boxName + "/" + colName;
	path += collectionPath;
	if (!path.endsWith("/")) {
		path += "/";
	}
	if (isClickedFolder != true) {
		path += colName;
		isClickedFolder = false;
	}*/
	var roleList = sessionStorage.roleListAgainstSelectedCell;//uBoxAcl.getRoleListForCell();
	if (typeof roleList === "string") {
		roleList = JSON.parse(roleList);
		if (typeof roleList === "string") {
			roleList = JSON.parse(roleList);
		}
	}
	var sortedRoleList = this.getSortedRoleList(roleList);
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var objJDavCollection = new _pc.DavCollection(accessor, collectionURL);
	//var objJAclManager = new _pc.AclManager(accessor,objJDavCollection);
	var response = uBoxAcl.getAclList(accessor, objJDavCollection);
	var schemaAuthz = response.schemaAuthz;
	if(schemaAuthz == ""){
		schemaAuthz = "Not set";
	}
	response = response.privilegeList;
	if (response != undefined) {
		var stringArrRolePrivilegeSet = '';
		stringArrRolePrivilegeSet = JSON.stringify(response);
		var changedResponse = this.custumizeResponse(stringArrRolePrivilegeSet);
		sessionStorage['rolePrivilegeSet'] = JSON.stringify(changedResponse);
		uMainBoxAcl.bindPrivilegesToMainBoxRoleACLPrivilegeTable(sortedRoleList, changedResponse, boxname, schemaAuthz);
	}
};

/**
 * Following method fetches the sorted list of role.
 * @param roleList roleList
 * @returns {Array} sorted  array list. 
 */
boxAcl.prototype.getSortedRoleList = function(roleList) {
	var boxname = sessionStorage.boxName;
	var boxNameForRole = "";
	var arrSameBoxRoles = [];
	var arrRoles = [];
	var mainBoxValue = getUiProps().MSG0039;
	var noOfRoles = roleList.length; 
	for ( var count = 0; count < noOfRoles; count++) {
		var obj = roleList[count];
		if (obj != undefined) {
				boxNameForRole = mainBoxValue;
				if (obj._Box.length > 0){
					// Since _Box is an array of only one data, we use the first data
					boxNameForRole = obj._Box[0].Name;
				}
				if (boxname === boxNameForRole) {
					//Array - Collection of roles with box names having SIMILAR name as that of the selected box name.
					arrSameBoxRoles.unshift(roleList[count]);
				} else {
				//Array - Collection of roles with box names having DISTINCT name as that of the selected box name.
				arrRoles.push(roleList[count]);
			}
		}
	} 
	//Pushing roles with box names having similar name as that of the selected box name, on top of the final role list.
	for ( var count = 0; count < arrSameBoxRoles.length; count++) {
		arrRoles.unshift(arrSameBoxRoles[count]);
	} 
	return arrRoles;
}; 

/**
 * The purpose of this function is to refresh privilege and role acl table 
 * if no collection is selected.
 */
boxAcl.prototype.boxAclRefresh = function () {
	sessionStorage['rolePrivilegeSet'] = "";
	document.getElementById("boxPropsPaneHeader").innerHTML = sessionStorage.boxName;
	arrRolePrivilegeList.length = 0;
	$("#roleAclEditIcon").removeClass("saveIconBoxDetail");
	$("#roleAclEditIcon").addClass("editIconBoxDetail");
	document.getElementById("roleAclEditIcon").title = "Edit";
	$("#roleAclEditIcon").css("cursor", "default");
	$("#roleAclEditIcon").attr("disabled","disabled");
	$('#aclPrivilegeTable input[type=checkbox]').attr("checked", false);
	$('#aclPrivilegeTable input[type=checkbox]').attr('disabled',true);
};

/**
 * The purpose of this function is to perform operation on the basis of selected 
 * collection
 */
boxAcl.prototype.boxAclOperation = function (noOfSelectedRows, isAcl) {
	var roleAclTableLength = $("#roleAclTable tr").length;
	if (noOfSelectedRows === 1 && isAcl == true && roleAclTableLength != 0) {
		$("#roleAclEditIcon").removeClass("saveIconBoxDetail");
		$("#roleAclEditIcon").addClass("editIconBoxDetail");
		document.getElementById("roleAclEditIcon").title = "Edit";
		$("#roleAclEditIcon").removeAttr("disabled");
		$("#roleAclEditIcon").css("cursor", "pointer");
		this.getAclSetting();
		isAcl = false;
	} else if (noOfSelectedRows > 1) {
		isAcl = false;
		this.setACLHeader("&nbsp",noOfSelectedRows);
		$("#roleAclEditIcon").css("cursor", "default");
		$('#aclPrivilegeTable input[type=checkbox]').attr("checked", false);
		$("#roleAclEditIcon").attr("disabled","disabled");
	}
};

/**
 * The purpose of this function is to change the header/title value of ACL View on RHS
 * based on selection
 */
boxAcl.prototype.setACLHeader = function (title,count) {
	var trimmedLimit = 20;
	if(title!= null && title != "&nbsp"){
/*		var shorterTitleName = objCommon.getShorterName(title, trimmedLimit);
		if(document.getElementById("boxPropsPaneHeader") != undefined){
			document.getElementById("boxPropsPaneHeader").innerHTML = title;
			document.getElementById("boxPropsPaneHeader").title = title;
		}
		$('#properties').show();
		$('#aclSettings').show();
		$('#properties').show();
		$('#boxHeader').show();
		$('#ACLFiller').hide();*/
		$('#webDavDetailBody').show();
		$('#webDavDetailMessageBody').hide();
	} else {
		if(count > 1){
			uBoxAcl.showSelectedResourceCount(count);
		}
	}
};

/**
 * The purpose of this function is to display selected resources count.
 * @param count
 */
boxAcl.prototype.showSelectedResourceCount = function(count) {
	//document.getElementById("dvNoColSelected").innerHTML = count+" resources are selected";
	if(count > 1){
		$('#resourceCount').text(count);
		$('#webDavDetailBody').hide();
		$('#webDavDetailMessageBody').show();
	}else{
		$('#webDavDetailBody').show();
		$('#webDavDetailMessageBody').hide();
	}
	/*$('#properties').hide();
	$('#aclSettings').hide();
	$('#properties').hide();
	$('#boxHeader').hide();
	$('#ACLFiller').show();*/
};

/**
 * handle global check box
 */
boxAcl.prototype.checkAll = function(chkSelectall) {
	objOdata.checkAll(chkSelectall);
	var selectedRow = 0;
	var globalCb = document.getElementById("chkSelectall");
	if (globalCb.checked) {
		var rowCount = $("#tblBoxDetail tr").length - 1;
		for ( var i = 0; i < rowCount; i++) {
			var rowId = "#rowid" + i;
			if ($(rowId).hasClass('selectRow')) {
				selectedRow++;
			}
		}
		if (rowCount > 0) {
			this.setACLHeader(null, selectedRow);
		}
	} else {
		this.setACLHeader(sessionStorage.boxName, 0);
	}
};

/**
 * The purpose of this function is to custumzie response of PROPFIND command
 * add box name before role name if return role name contains only role name and
 * make final result as ../boxName/RoleName
 * @param stringArrRolePrivilegeSet
 * @returns {Array}
 */
boxAcl.prototype.custumizeResponse = function(stringArrRolePrivilegeSet) {
	var arrResponse = [];
	arrResponse = JSON.parse(stringArrRolePrivilegeSet);
	for ( var i = 0; i < arrResponse.length; i++) {
		var roleName = arrResponse[i].role;
		var priv = arrResponse[i].privilege;
		var index = roleName.indexOf(".");
		if (index == -1) {
			var boxname = sessionStorage.boxName;
			if(boxname == getUiProps().MSG0039){
				boxname = getUiProps().MSG0293;
			}
			var newRole = "../"+ boxname+ "/" + roleName;
			var json = {
				"role" : newRole,
				"privilege" : priv
			};
			arrResponse.splice(i, 1, json);
		}

	}
	return arrResponse;
};

/**
 * Fetch Acl list against collection and 
 * perform parse operation
 * @return privilegeList
 */
boxAcl.prototype.getAclList = function(accessor, objJDavCollection) {
	var aclSettings = {};
	var privilegeList = [];
	var rolePrivilegePair = "";
	var grant ="";
	var privilegeNodeList ="";
	var roleName = null;
	var privilege = null;
	var schemaAuthz = "";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.propfind(objJDavCollection.getPath());
	var doc = response.bodyAsXml();
	var nl = doc.getElementsByTagName("response");
	for (var i = 0; i < nl.length; i++) {
		if (i == 1) {
			break;
		}
		var elm = nl[i];
		var acl = elm.getElementsByTagName("acl");
		var ace = elm.getElementsByTagName("ace");
		var prevList = ''; 
			for (var aclCount = 0; aclCount <acl.length; aclCount++) {
				if (aclCount == 1) {
					break;
				}
				if (acl[aclCount].attributes != undefined) {
					var noOfAttributes = acl[aclCount].attributes.length;
					for (var attributeCount = 0; attributeCount < noOfAttributes; attributeCount++) {
						if (acl[aclCount].attributes[attributeCount].name === "p:requireSchemaAuthz" ) {
							schemaAuthz = acl[aclCount].attributes[attributeCount].value;
							break;
						}
					}
					
				}
				for (var aceCount = 0; aceCount <ace.length; aceCount++) {
                    if ($(ace[aceCount]).find("inherited").size() > 0) {
                        continue;
                    }
					/*if (ace[aceCount].firstElementChild != null && ace[aceCount].firstElementChild.childNodes[1].firstChild != null) {
						roleName = ace[aceCount].firstElementChild.childNodes[1].firstChild.data;
						grant = ace[aceCount].lastElementChild;
						privilegeNodeList  = grant.childNodes;
					} else {
						roleName = ace[aceCount].firstElementChild.childNodes[1].nodeName;
						if (roleName == 'all') {
							roleName = 'all (anyone)';
						}
						grant = ace[aceCount].lastElementChild;
						privilegeNodeList  = grant.childNodes;
					}*/
					if (ace[aceCount].firstElementChild != null && ace[aceCount].firstElementChild.childNodes[1] != null){
						if(ace[aceCount].firstElementChild.childNodes[1].localName == "href"){
							if(ace[aceCount].firstElementChild.childNodes[1].firstChild.data != null){
								roleName = ace[aceCount].firstElementChild.childNodes[1].firstChild.data;
								grant = ace[aceCount].lastElementChild;
								privilegeNodeList  = grant.childNodes;
							}
						}else if(ace[aceCount].firstElementChild.childNodes[1].localName = "all"){
							roleName = ace[aceCount].firstElementChild.childNodes[1].localName;
							if (roleName == 'all') {
								roleName = 'all (anyone)';
							}
							grant = ace[aceCount].lastElementChild;
							privilegeNodeList  = grant.childNodes;
						}
					}
					for (var prvNodeCount =0; prvNodeCount <privilegeNodeList.length-1; prvNodeCount = prvNodeCount+2) {
                        privilege = privilegeNodeList[prvNodeCount+1].firstElementChild.localName;
                        prevList += privilege + ", ";
							/*rolePrivilegePair = {"role" : roleName,"privilege" : privilege};
							privilegeList.push(rolePrivilegePair);*/
					}
						var lastCharactorIndex = prevList.lastIndexOf(', ');
						prevList = prevList.substring(0,lastCharactorIndex);
						if(roleName != null) {
							rolePrivilegePair = {"role" : roleName,"privilege" : prevList};
							privilegeList.push(rolePrivilegePair);
						}
						prevList= '';
				}
			}
	}
	aclSettings = {"privilegeList":privilegeList,"schemaAuthz":schemaAuthz};
	return aclSettings;
};

function radioBtnFocusOnBoxAcl(id) {
	$(id).css("outline","-webkit-focus-ring-color auto 5px");
}

function radioBtnBlurOnBoxAcl(id) {
	$(id).css("outline","none");
}

$(document).ready(function() {
	$('#ACLFiller').hide();
	$.ajaxSetup({ cache: false });
	//document.getElementById("boxPropsPaneHeader").innerHTML = sessionStorage.boxName;
	/*if(sessionStorage.tabName == "Box"){
		document.getElementById("boxPropsPaneHeader").innerHTML = sessionStorage.boxName;
		uBoxAcl.roleAclTable();
	}*/
});