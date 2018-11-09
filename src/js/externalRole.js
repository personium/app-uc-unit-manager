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
function externalRole() {
}

//Global variables
var uExternalRole  = new externalRole();
externalRole.prototype.totalRecordsize = 0;
var sbSuccessfulCount = 0;
var sbConflictCount = 0;
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

/******************************** CREATE EXTERNAL ROLE : START ********************************/

/**
 *  The purpose of this function is to bind relation box drop down.
 */
externalRole.prototype.bindRelationBoxDropDown = function (editFlg) {
	var shorterRelationName = null;
	var shorterBoxName = null;
	var mainBoxValue = getUiProps().MSG0039;
	uExternalRole.refreshRelationBoxDropDown(editFlg);
	var jsonString = uExternalRole.getAllRelationBoxPair();
	var select = document.getElementById("idRelationBoxDropDown");
	if (editFlg) {
		select = document.getElementById("idEditRelationBoxDropDown");
	}
	for (var i = 0; i < jsonString.length; i++) {
		var option = document.createElement("option");
		var objRelation = jsonString[i];
		option.id = objRelation.__metadata.etag;
		var uri = objRelation._Box.__deferred.uri;
		var searchBoxNameString = uri.search("_Box.Name");
		var searchBoxString = uri.search("/_Box");
		var boxName = uri.substring(searchBoxNameString + 10, searchBoxString - 1);
		boxName = boxName.replace(/'/g, " ");
		boxName = boxName.trim();
		shorterRelationName = objCommon.getShorterName(objRelation.Name,8);
		shorterBoxName = objCommon.getShorterName(boxName,8);
		option.text = shorterRelationName + objCommon.startBracket + shorterBoxName + objCommon.endBracket;
		option.value = objRelation.Name + objCommon.startBracket + boxName + objCommon.endBracket;
		option.title = objRelation.Name + objCommon.startBracket + boxName + objCommon.endBracket;
		if (boxName == "null") {
			option.text = shorterRelationName + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
			option.value = objRelation.Name + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
			option.title = objRelation.Name + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
		}
		select.appendChild(option);
	}
};

/**
 * The purpose of this function is to retrieve all the relation box pair against a
 * selected cell.
 */
externalRole.prototype.getAllRelationBoxPair = function () {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRelationManager = new _pc.RelationManager(accessor);
	var count = retrieveRelationRecordCount();
	var uri = objRelationManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to refresh the relation box drop down.
 */
externalRole.prototype.refreshRelationBoxDropDown = function (editFlg) {
	var select = document.getElementById("idRelationBoxDropDown");
	if (editFlg) {
		select = document.getElementById("idEditRelationBoxDropDown");
		select.options.length = 0;
		return;
	}
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0226;
	select.insertBefore(newOption, select.options[-1]);
};

/**
 * The purpose of this function is to get selected relation and box pair from the
 * drop down.
 */
externalRole.prototype.getSelectedRelationBoxPair = function (id) {
	var relationBoxPair = null;
	var dropDownID = document.getElementById(id);
	if (dropDownID.selectedIndex > 0) {
		var selectedRelation = dropDownID.value;
		if (selectedRelation != null) {
			relationBoxPair = selectedRelation.split(objCommon.startBracket);
		}
	} else {
		document.getElementById("relationBoxDDErrorMsg").innerHTML = getUiProps().MSG0222;
	}
	return relationBoxPair;
};
/**
 * The purpose of this function is to get selected relation and box pair from the
 * drop down.
 */
externalRole.prototype.getSelectedEditRelationBoxPair = function (id) {
	var relationBoxPair = null;
	var dropDownID = document.getElementById(id);
	var selectedRelation = dropDownID.value;
	if (selectedRelation != null) {
		relationBoxPair = selectedRelation.split(objCommon.startBracket);
	}
	return relationBoxPair;
};

/**
 * The purpose of this function is to check if relation box selected from 
 * drop down is valid
 */
externalRole.prototype.validateEmptyDropDown = function (relBox) {
	//document.getElementById("externalRoleURLErrorMsg").innerHTML = '';
	var dropDownEmptyMessage = getUiProps().MSG0050;
	if(relBox == 0){
		document.getElementById("relationBoxDDErrorMsg").innerHTML = dropDownEmptyMessage;
		return false;
	} else {
		document.getElementById("relationBoxDDErrorMsg").innerHTML = "";
	}
	return true;
};

/**
 * The purpose of this function is to check/unckeck all the checkboxes.
 */
externalRole.prototype.checkAll = function(cBox) {
	var buttonId = '#btnDeleteExtRole';
	objCommon.checkBoxSelect(cBox, buttonId);
	objCommon.showSelectedRow(document.getElementById("chkSelectall"),"row","rowid");
};

/**
 * Following method gets ext role information.
 * @param uri in the form of "https://{UnitFQDN}/{CellName}/__role/__/{ExtRoleName}"
 * @returns hash (isValid/url/domainName/extRoleName)
 */
externalRole.prototype.validateExternalRoleUrl = function(uri) {
    let isValid = false;
    let url = jquery1_12_4.url(uri);
    let tempPath = url.attr('path');
    let missingKeyword = (tempPath.search("/__role/__/") == -1);
    let tempPathArray = tempPath.split("/");

    if (missingKeyword) {
        document.getElementById("externalRoleURLErrorMsg").innerHTML = "Invalid URL";
        cellpopup.showErrorIcon('#txtBoxExtRoleURL');
        return false;
    }
    
    isValid = objBox.validateSchemaURL(uri,"externalRoleURLErrorMsg","#txtBoxExtRoleURL");
    if (!isValid)
        return false;

    let tempDomainName = url.attr('host');
    isValid = objCommon.validateURL(tempDomainName, "externalRoleURLErrorMsg", "#txtBoxExtRoleURL");
    if (!isValid)
        return false;

    let extRoleName = _.last(tempPathArray);
    isValid = uExternalRole.validateExternalRoleName(extRoleName);
    if (!isValid)
        return false;

    /*
    isValid = objCommon.doesUrlContainSlash(uri, "externalRoleURLErrorMsg", "#txtBoxExtRoleURL", getUiProps().MSG0297);
    if (!isValid)
        return false;
    */

    return true;
};


/**
 * The purpose of this function is to create External Role.
 */
externalRole.prototype.createExternalRole = function() {
	var result = false;
	showSpinner("modalSpinnerExtRole");
	var extRoleURL = null;
	var mainBoxValue = getUiProps().MSG0039;
	var extRoleURLAlreadyAddedMappedMsg = getUiProps().MSG0058;
	var validMessage = getUiProps().MSG0052;
	extRoleURL = document.getElementById("txtBoxExtRoleURL").value;
    /*
     * Validate the value and also return boolean so that additional action can be performed.
     * true: valid URL
     * false: invalid URL
     */
    if (uExternalRole.validateExternalRoleUrl(extRoleURL)) {
        if (uExternalRole.validateEmptyDropDown()) {
            if ($("#chkBoxAssignRoleToExtRole").is(':checked')) {
                var isValidValue = objCommon.validateDropDownValue(
                        "dropDownRoleAssignToExtRole",
                        "#ddRoleBoxErrorMsgExtRole",
                        getUiProps().MSG0279);
                if (isValidValue == false) {
                    removeSpinner("modalSpinnerExtRole");
                    return;
                }
            }
            var arrSelectedRelationBox = uExternalRole
                    .getSelectedRelationBoxPair("idRelationBoxDropDown");
            if (!arrSelectedRelationBox) {
            	removeSpinner("modalSpinnerExtRole");
                return;
            }
            var selectedRelationName = arrSelectedRelationBox[0].split(
                    ' ').join('');
            selectedRelationName = selectedRelationName.trim();
            var selectedBoxName = arrSelectedRelationBox[1].split(' ')
                    .join('');
            selectedBoxName = objCommon
                    .getBoxSubstring(selectedBoxName);
            if (selectedBoxName == mainBoxValue) {
                selectedBoxName = null;
            }
            var baseUrl = getClientStore().baseURL;
            var cellName = sessionStorage.selectedcell;
            var accessor = objCommon.initializeAccessor(baseUrl,
                    cellName);
            var objExtRoleManager = new _pc.ExtRoleManager(accessor);
            var body = {
                "ExtRoleURL" : extRoleURL,
                "RelationName" : selectedRelationName,
                "RelationBoxName" : selectedBoxName
            };
            var jsonResponse = "";
            try {
                jsonResponse = objExtRoleManager.create(body);
                result = true;
            } catch (exception) {
                result = false;
                jsonResponse = exception;
            }
            if (result && jsonResponse.getStatusCode() == 201) {
                var response = null;
                if ($("#chkBoxAssignRoleToExtRole").is(':checked')) {
                    var encodedExternalRoleURL = encodeURIComponent(extRoleURL);
                    var multiKey = "(ExtRole='"
                            + encodedExternalRoleURL
                            + "',_Relation.Name='"
                            + selectedRelationName
                            + "',_Relation._Box.Name='"
                            + selectedBoxName + "')";
                    response = objCommon.assignEntity(
                            "dropDownRoleAssignToExtRole", "ExtRole",
                            "Role", multiKey, true);
                    if (response.getStatusCode() == 204
                            || response.getStatusCode() == 404) {
                        // 404 is obtained when Relation and Role both
                        // happens to be main box but even then the role
                        // is getting created.
                        uExternalRole.displayNotificationMessage();
                    }
                } else {
                    uExternalRole.displayNotificationMessage();
                }
            } else if (!result
                    && jsonResponse.message
                            .indexOf("entity already exists") != -1) {
                cellpopup.showErrorIcon('#txtBoxExtRoleURL');
                document.getElementById("externalRoleURLErrorMsg").innerHTML = extRoleURLAlreadyAddedMappedMsg;
            } else {
                cellpopup.showErrorIcon('#txtBoxExtRoleURL');
                document.getElementById("externalRoleURLErrorMsg").innerHTML = validMessage;
            }
        }
    }
    removeSpinner("modalSpinnerExtRole");
};
/**
 * The purpose of this function is to edit External Role.
 */
externalRole.prototype.editExternalRole = function() {
	var result = false;
	showSpinner("modalSpinnerExtRoleToRoleMap");
	var extRoleURL = null;
	var mainBoxValue = getUiProps().MSG0039;
	var extRoleURLAlreadyAddedMappedMsg = getUiProps().MSG0058;
	var validMessage = getUiProps().MSG0052;
	extRoleURL = document.getElementById("txtBoxExtRoleEditURL").value;
    /*
     * Validate the value and also return boolean so that additional action can be performed.
     * true: valid URL
     * false: invalid URL
     */
    if (uExternalRole.validateExternalRoleUrl(extRoleURL)) {
        if (uExternalRole.validateEmptyDropDown()) {
        	var key = [
        		"ExtRole='" + encodeURIComponent(sessionStorage.ExtRoleName) + "'",
        		"_Relation.Name='" + sessionStorage.ExtRoleRelationName + "'"
        	].join(",");
        	if (sessionStorage.ExtRoleBoxName != "null") {
        		key += ",_Relation._Box.Name='" + sessionStorage.ExtRoleBoxName + "'";
        	}

            var arrSelectedRelationBox = uExternalRole.getSelectedEditRelationBoxPair("idEditRelationBoxDropDown");
            var selectedRelationName = arrSelectedRelationBox[0].split(' ').join('');
            selectedRelationName = selectedRelationName.trim();
            var selectedBoxName = arrSelectedRelationBox[1].split(' ').join('');
            selectedBoxName = objCommon.getBoxSubstring(selectedBoxName);
            if (selectedBoxName == mainBoxValue) {
                selectedBoxName = null;
            }
            var baseUrl = getClientStore().baseURL;
            var cellName = sessionStorage.selectedcell;
            var accessor = objCommon.initializeAccessor(baseUrl,
                    cellName);
            var objExtRoleManager = new _pc.ExtRoleManager(accessor);
            var body = {
                "ExtRoleURL" : extRoleURL,
                "RelationName" : selectedRelationName,
                "RelationBoxName" : selectedBoxName
            };
            var jsonResponse = "";
            try {
                jsonResponse = objExtRoleManager.update(key, body);
                result = true;
            } catch (exception) {
                result = false;
                jsonResponse = exception;
            }
            if (result && jsonResponse.getStatusCode() == 204) {
                var response = null;
                uExternalRole.displayNotificationEditMessage();
                uExternalRole.updateInfo(extRoleURL, selectedRelationName, selectedBoxName);
            } else if (jsonResponse.httpClient.responseText
                            .indexOf("entity already exists") != -1) {
                cellpopup.showErrorIcon('#txtBoxExtRoleEditURL');
                document.getElementById("externalRoleEditURLErrorMsg").innerHTML = extRoleURLAlreadyAddedMappedMsg;
            } else {
                cellpopup.showErrorIcon('#txtBoxExtRoleEditURL');
                document.getElementById("externalRoleEditURLErrorMsg").innerHTML = validMessage;
            }
        }
    }
    removeSpinner("modalSpinnerExtRoleToRoleMap");
};
externalRole.prototype.updateInfo = function (extRoleUrl, relationName, boxName) {
	sessionStorage.ExtRoleName = extRoleUrl;
    sessionStorage.ExtRoleRelationName = relationName;
    sessionStorage.ExtRoleBoxName = boxName;
    $("#lblExtRoleName").html(sessionStorage.ExtRoleName);
	$("#lblExtRoleName").attr('title', sessionStorage.ExtRoleName);
	$("#lblExtRoleRelationName").html(sessionStorage.ExtRoleRelationName);
	$("#lblExtRoleBoxName").html(sessionStorage.ExtRoleBoxName);
    let extRoleData = uExternalRole.getExternalRoleData(extRoleUrl, relationName, boxName);
    uExternalRole.setCellControlsInfoTabValues(extRoleUrl, extRoleData.__metadata.etag, objCommon.convertEpochDateToReadableFormat(extRoleData.__published), objCommon.convertEpochDateToReadableFormat(extRoleData.__updated));
    uBoxDetail.displayBoxInfoDetails();
}

/**
 * The purpose of this function is to display success message 
 * on notification ribbon.
 * 
 * @param extRoleURI
 */
externalRole.prototype.displayNotificationMessage = function () {
	$('#externalRoleModalWindow, .window').hide();
	addSuccessClass('#extRoleMessageIcon');
	$('#extRoleMessageBlock').css('width', '');
	$("#extRoleMessageBlock").css("display", 'table');
	document.getElementById("extRoleSuccessmsg").innerHTML = getUiProps().MSG0281;
	uExternalRole.createExternalRoleTable();
	objCommon.centerAlignRibbonMessage("#extRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("extRoleMessageBlock");
};
/**
 * The purpose of this function is to display edit success message 
 * on notification ribbon.
 * 
 * @param extRoleURI
 */
externalRole.prototype.displayNotificationEditMessage = function () {
	$('#externalRoleEditModalWindow, .window').hide();
	addSuccessClass('#extRoleToRoleMessageIcon');
	$('#extRoleToRoleMessageBlock').css('width', '');
	$("#extRoleToRoleMessageBlock").css("display", 'table');
	document.getElementById("extRoleToRoleSuccessmsg").innerHTML = getUiProps().MSG0430;
	objCommon.centerAlignRibbonMessage("#extRoleToRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("extRoleToRoleMessageBlock");
};

/**
 * The purpose of this function is to empty all the fields on modal pop up.
 */
externalRole.prototype.emptyAllFieldsValues = function () {
	$("#idRelationBoxDropDown").val('');
	$("#txtBoxExtRoleURL").val('');
	$('#relationBoxDDErrorMsg').html('');
	$('#externalRoleURLErrorMsg').html('');
	$("#ddRoleBoxErrorMsgExtRole").text("");
	$('#chkBoxAssignRoleToExtRole').attr('checked', false);
	$("#dropDownRoleAssignToExtRole").attr('disabled', true);
	$('#dropDownRoleAssignToExtRole').addClass("customSlectDDDisabled");
	objCommon.bindRoleBoxDropDown("dropDownRoleAssignToExtRole");
	objCommon.removePopUpStatusIcons('#txtBoxExtRoleURL');
};

/******************************** CREATE EXTERNAL ROLE : END ********************************/

/******************************** VIEW EXTERNAL ROLE : START ********************************/

/**
 * The purpose of this method is to create and initialize external role manager.
 */
externalRole.prototype.createExternalRoleManager = function(){
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleMgr = new _pc.ExtRoleManager(accessor);
	return objExtRoleMgr;
};

/**
 * The purpose of this method is to create external role table view as per pagination.
 * @param json
 * @param recordSize
 */
externalRole.prototype.createChunkedExtRoleTable = function(json, recordSize, spinnerCallback){
	$('#chkSelectall').attr('checked', false);
	$("#chkSelectall").attr('disabled', false);
	objCommon.disableButton('#btnDeleteExtRole');
	var dynamicTable = "";
	var mainBoxValue = getUiProps().MSG0039;
	$("#dvemptyExternalRoleTableMessage").hide();
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS+recordSize) < (jsonLength) ? (objCommon.MAXROWS+recordSize) : jsonLength;
	var externalRoleRowCount = 0;
	for (var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var extRoleName = obj.ExtRole;
		var extRoleETag = obj.__metadata.etag;
		var arrEtag = extRoleETag.split("/");
		var test = arrEtag[0];
		var test1 =  arrEtag[1].replace(/["]/g,"");
		//var test2 = "'"+ test1 +"'" ;
		var relationName = obj["_Relation.Name"];
		var boxName = obj["_Relation._Box.Name"];

        // Assume it is the Main box.
        if (boxName === null) {
            boxName = mainBoxValue;
        }
    
        // Main box or box without schema URL uses "- ({Cell URL string})"
        var infoSchema = "- (" + sessionStorage.selectedcellUrl + "/)";
        // Get schema URL for box
        if (boxName != getUiProps().MSG0039) {
            var boxObj = uExternalRole.retrieveChunkedDataBox(boxName);
            if (boxObj.Schema) {
                infoSchema = boxObj.Schema;
            }
        }

		var updatedDate = obj.__updated;
		updatedDate = objCommon.convertEpochDateToReadableFormat(updatedDate);
		var createdDate = obj.__published;
		createdDate = objCommon.convertEpochDateToReadableFormat(createdDate);
		var shorterExtRole = objCommon.getShorterEntityName(extRoleName, true);
		var shorterRelationName = objCommon.getShorterEntityName(relationName);
		var shorterBoxName = objCommon.getShorterEntityName(boxName);
			dynamicTable += '<tr class="dynamicRoleBoxRow" name="allrows" id="rowid'
				+ externalRoleRowCount+ '" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteExtRole'" +','+ "'chkSelectall'" +','+ externalRoleRowCount +',' + totalRecordsize + ','+ "''" + ','+"''"+','+"''"+','+"''"+','+"'externalRoleTable'"+');">';
			dynamicTable = uExternalRole.createRowsForExtRoleTable(dynamicTable, extRoleName, relationName, boxName, updatedDate, count, shorterExtRole, shorterRelationName, shorterBoxName,createdDate, externalRoleRowCount,test,test1,infoSchema,extRoleETag);
			externalRoleRowCount++;
	}
	if (jsonLength >0) {
		$("#externalRoleTable thead tr").addClass('mainTableHeaderRow');
		$("#externalRoleTable tbody").addClass('mainTableTbody');
	}
	$("#externalRoleTable tbody").html(dynamicTable);
	setTimeout(function() {
		uExternalRole.applyScrollCssOnExtRoleGrid();	
		}, 400);
	if (spinnerCallback != undefined) {
		spinnerCallback();
	}
};

/**
 * The purpose of this function is to create dynamic table for
 * external role.
 */
externalRole.prototype.createExternalRoleTable = function () {
	totalRecordsize= uExternalRole.retrieveRecordCount();
	this.refreshExtRoleTable();
	if (totalRecordsize > 0) {
		document.getElementById("dvemptyTableMessage").style.display = "none";
		var json = uExternalRole.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
		var recordSize = 0;
		uExternalRole.createChunkedExtRoleTable(json, recordSize);
		var tableID = $('#externalRoleTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS, tableID, uExternalRole, json, uExternalRole.createChunkedExtRoleTable, "ExtRole");
		objCommon.checkCellContainerVisibility();
	} else {
		objCommon.displayEmptyMessageInGrid(getUiProps().MSG0235, "ExtRole");
		objCommon.disableButton('#btnDeleteExtRole');
	}
};

/**
 * The purpose of this method is to open popup for single delete.
 */
externalRole.prototype.openSingleDeletePopUp = function(){
	var id = '#singleDeleteDialogBox';
	$('#singleDeleteModalWindow').fadeIn(1000);	
	var winH = $(window).height();
	var winW = $(window).width();
	$(id).css('top', winH / 2 - $(id).height() / 2);
	$(id).css('left', winW / 2 - $(id).width() / 2);
};

/**
 * The purpose of this method is to close the delete popups.
 */
externalRole.prototype.closeDeleteRolePopup = function() {
	$('#multipleDeleteModalWindow, .window').hide();
	$('#singleDeleteModalWindow, .window').hide();
};

/**
 * The purpose of this method is to open popup for multiple delete.
 */
externalRole.prototype.openMultipleDeleteRolePopUp = function() {
	var id = '#multipleDeleteDialogBox';
	$('#multipleDeleteModalWindow').fadeIn(1000);	
	var winH = $(window).height();
	var winW = $(window).width();
	$(id).css('top', winH / 2 - $(id).height() / 2);
	$(id).css('left', winW / 2 - $(id).width() / 2);
	$('#btnCancelExtRoleDelete').focus();
};

/**
 * The purpose of this method is to delete single external role.
 */
externalRole.prototype.deleteSingleExtRole = function(extRoleName, relationName, boxName,count){
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleManager = new _pc.ExtRoleManager(accessor);
	var key = "ExtRole='" + encodeURIComponent(extRoleName) + "',_Relation.Name='" + relationName + "',_Relation._Box.Name='" + boxName + "'";
	var result = false;
	var etag = "";
	var mainBoxValue = getUiProps().MSG0039;
	if (boxName == mainBoxValue || boxName == "null") {
		key = "ExtRole='" + encodeURIComponent(extRoleName) + "',_Relation.Name='" + relationName + "'";
	}
	try {
		etag = objExtRoleManager.getEtag(key);
		result = true;
	} catch (exception){
		result = false;
		sbConflictCount ++;
	}
	if (result && etag != "") {
		var promise = objExtRoleManager.del(key, etag);
	try {
		if (promise.resolvedValue.status == 204) {
			sbSuccessfulCount ++;
		} 
	} catch (exception) {
		arrDeletedConflictCount.push(count);
		sbConflictCount ++;
	}
		return promise;
	}
};

/**
 * The purpose of this function is to get role information for multiple delete.
 */
externalRole.prototype.getMultipleExtRoleNames = function() { 
	var noOfExtRoles = $("#externalRoleTable tr").length - 1;
	var extRoleRelBoxArray = [];
	for (var index = 0; index < noOfExtRoles; index++) {
		var body = {};
		if($("#chkBox"+index).is(":checked")){
			body["ExtRoleName"] = document.getElementById("extRoleNameLink_" + index).title;
			body["RelationName"] = document.getElementById("labelExtRoleRelName_" + index).title;
			body["boxName"] = document.getElementById("labelExtRoleBoxName_" + index).title;
			extRoleRelBoxArray.push(body);	
		}
	}
	return extRoleRelBoxArray;
};

/**
 * The purpose of this method is to delete multiple external role.
 */
externalRole.prototype.deleteMultipleExtRoles = function(){
	showSpinner("modalSpinnerExtRole");	
	var etagIDOfPreviousRecord = "txtHiddenEtagId";
	var arrEtag = [];
	var etagValue = '';
	var idCheckAllChkBox = '#chkSelectall';
	var tableID = $('#externalRoleTable');
	//if (!$("#chkSelectall").is(':checked')) {
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBox0");
	}
	
	var objExtRole = new externalRole();
	var paramArray = objExtRole.getMultipleExtRoleNames();
	var noOfRecords = paramArray.length;
	for(var index = 0; index < noOfRecords; index++){
		var extRoleName = paramArray[index]["ExtRoleName"];
		var relationName = paramArray[index]["RelationName"];
		var boxName = paramArray[index]["boxName"];
		uExternalRole.deleteSingleExtRole(extRoleName, relationName, boxName,index);
	}
	this.displayMultipleRolesConflictMessage();
	removeSpinner("modalSpinnerExtRole");
	var type = "ExtRole";
	 var recordCount = uExternalRole.retrieveRecordCount();
		objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, uExternalRole, isDeleted);
};

/**
 * The purpose of this function is to create rows of dynamic table for
 * external role.
 */
externalRole.prototype.createRowsForExtRoleTable = function (dynamicTable, extRoleName, relationName, boxName, updatedDate, count, shorterExtRole, shorterRelationName, shorterBoxName,createdDate,externalRoleRowCount,externalRoleEtagStart,externalRoleEtagEnd,externalRoleUri,etag) {
	var paramRelationName = "'"+relationName+"'";
	var paramExtRoleName = "'"+extRoleName+"'";
    var paramBoxName = "'"+boxName+"'";
    if (boxName == getUiProps().MSG0039) {
        paramBoxName = "'null'";
    }
	var paramUpdatedDate = "'"+updatedDate+"'";
	var paramEtagStart = "'"+externalRoleEtagStart+"'";
	var paramEtagEnd = "'"+externalRoleEtagEnd+"'";
	//var paramUri = "'"+externalRoleUri+"'";
	var paramCreatedDate = "'"+createdDate+"'";
	var paramUri = "'"+ externalRoleUri.replace(/[']/g,"`") +"'" ;
	var linkedRoleList = uExternalRole.getRoleDetailsLinkedToExternalRole(extRoleName,relationName,boxName);//uExternalRole.getExternalRoleCount(extRoleName,relationName,boxName);
	dynamicTable += '<td style="width:1%"><input id =  "txtHiddenEtagId'+externalRoleRowCount+'" value='+etag+' type = "hidden" /><input title="'+externalRoleRowCount+'" id="chkBox'+externalRoleRowCount+'" type="checkbox" class="case cursorHand regular-checkbox big-checkbox" name="case" value=""/><label for="chkBox'+externalRoleRowCount+'" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += '<td style="max-width: 100px;width:20%"><div class = "mainTableEllipsis"><a id="extRoleNameLink_'+ externalRoleRowCount +'" title = "'+extRoleName+'" href = "#" class = "roleNameLink" onclick="openExternalRoleLinkPage('+paramRelationName+','+paramExtRoleName+','+paramBoxName+','+paramUpdatedDate+','+externalRoleRowCount+','+paramCreatedDate+','+paramEtagStart+','+paramEtagEnd+','+paramUri+');" tabindex ="-1" style="outline:none">' +extRoleName+ '</a></div></td>';
	dynamicTable += '<td id="extRoleRelName_'+ count +'" style="max-width: 100px;width:15%"><div class ="mainTableEllipsis"><label id="labelExtRoleRelName_'+ externalRoleRowCount +'" title = "'+relationName+'" class="cursorPointer">' +relationName+ '</label></div></td>';
	dynamicTable += '<td id="extRoleBoxName_'+ count +'" style="max-width: 100px;width:15%"><div class ="mainTableEllipsis"><label id="labelExtRoleBoxName_'+ externalRoleRowCount +'" title = "'+boxName+'" class="cursorPointer">' +boxName+ '</label></div></td>';
	dynamicTable += '<td style="width: 15%">' +createdDate+ '</td>';
	dynamicTable += '<td style="width: 15%">' +updatedDate+ '</td>';
	dynamicTable += "<td style='max-width: 100px;width:19%'><div class = 'mainTableEllipsis'><label title= '"+linkedRoleList+"' class='cursorPointer'>"+ linkedRoleList +"</label></div></td>";
	dynamicTable += "</tr>";
	return dynamicTable;
};

/**
 * The purpose of this function is to extract relation name from external 
 * role URI.
 * 
 * @param uri
 */
externalRole.prototype.getRelationNameFromURI = function (uri) {
	var RELATION = "_Relation.Name";
	var noOfCharacters = RELATION.length;
	var relationIndex = uri.indexOf(RELATION);
	var boxIndex = uri.indexOf("_Relation._Box.Name");
	var relationNameFromURI = uri.substring(relationIndex + noOfCharacters, boxIndex);
	var relationName = objCommon.getRelationNameAfterRemovingSpecialChar(relationNameFromURI);//getEnityNameAfterRemovingSpecialChar(relationNameFromURI);
	return relationName;
};

/**
 * The purpose of this function is to extract box name from external 
 * role URI.
 * 
 * @param uri
 */
externalRole.prototype.getBoxNameFromURI = function(uri) {
	var BOX = "_Relation._Box.Name";
	var noOfCharacters = BOX.length;
	var boxIndex = uri.indexOf(BOX);
	var boxNameFromURI = uri.substring(boxIndex + noOfCharacters, uri.length-1);
	var boxName = objCommon.getEnityNameAfterRemovingSpecialChar(boxNameFromURI);
	return boxName;
};

/******************************** VIEW EXTERNAL ROLE : END ********************************/
externalRole.prototype.initEditExternalRole = function () {
	uExternalRole.bindRelationBoxDropDown(true);
	var ddValue = "";
	if (sessionStorage.ExtRoleBoxName == "null") {
		var mainBoxValue = getUiProps().MSG0039;
		ddValue = sessionStorage.ExtRoleRelationName + objCommon.startBracket + mainBoxValue + objCommon.endBracket;
	} else {
		ddValue = sessionStorage.ExtRoleRelationName + objCommon.startBracket + sessionStorage.ExtRoleBoxName + objCommon.endBracket;
	}
	$("#idEditRelationBoxDropDown").val(ddValue);
	$("#txtBoxExtRoleEditURL").val(sessionStorage.ExtRoleName);

	// The purpose of this function is to validate external role URl on blur
	$("#txtBoxExtRoleEditURL").blur(function() {
	    var extRoleURL = document.getElementById("txtBoxExtRoleEditURL").value;
	    uExternalRole.validateExternalRoleUrl(extRoleURL);
	});
	
	// The purpose of this function is to validate dropdown  on blur
	$("#idEditRelationBoxDropDown").blur(function() {
		var relBox = $("#idEditRelationBoxDropDown").val();
		uExternalRole.validateEmptyDropDown(relBox);
	});
};
externalRole.prototype.loadExternalRolePage = function () {
	uExternalRole.bindRelationBoxDropDown();
	uExternalRole.createExternalRoleTable();
	objCommon.checkCellContainerVisibility();
};

/**
 * The purpose of this method is to create an object of jAbstractODataContext.
 * This method is accepting accessor as an input parameter.
 */
externalRole.prototype.initializeAbstractDataContext = function() { 
	var accessor = uExternalRole.getAccessor();
	var objAbstractDataContext =  new _pc.AbstractODataContext(accessor);
	return objAbstractDataContext;
};

externalRole.prototype.getAccessor  = function() {
	var cellName = sessionStorage.selectedcell;	
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	return accessor;
};

/**The purpose of the following function is to fetch the count of roles associated with an external role.
 * 
 * @param externalRoleURI
 * @param relationName
 * @param relationBoxName
 * @returns {Number}
 */
externalRole.prototype.getExternalRoleCount = function(externalRoleURI,relationName,relationBoxName) { 
	var roleCount = 0;
	var SOURCE = "ExtRole";
	var DESTINATION = "Role";
	var encodedExternalRoleURI = encodeURIComponent(externalRoleURI);
	relationName = "'" + relationName + "'";
	encodedExternalRoleURI = "'" + encodedExternalRoleURI + "'";
	relationBoxName = "'" + relationBoxName + "'";
	var key = "(ExtRole=" + encodedExternalRoleURI + ",_Relation.Name="
			+ relationName + ",_Relation._Box.Name=" + relationBoxName + ")";
	var accessor = uExternalRole.getAccessor();
	var context = uExternalRole.initializeAbstractDataContext();
	var objLinkManager = new _pc.LinkManager(accessor, context);
	var response = objLinkManager.retrieveRoleAccountLinks(context, SOURCE,
			DESTINATION, key);
	if (response.getStatusCode() == 200) {
		var responseBody = response.bodyAsJson();
		var json = responseBody.d.results;
		if (json.length >= 1) {
			roleCount = json.length;
		} else {
			roleCount = 0;
		}
	}
	return roleCount;
};

/**The purpose of the following function is to fetch the count of roles associated with an external role.
 * 
 * @param externalRoleURI
 * @param relationName
 * @param relationBoxName
 * @returns
 */
externalRole.prototype.getRoleDetailsLinkedToExternalRole = function(externalRoleURI,relationName,relationBoxName) { 
	var roleList = [];
	var SOURCE = "ExtRole";
	var DESTINATION= "Role";
	var encodedExternalRoleURI = encodeURIComponent(externalRoleURI);
	relationName = "'"+relationName+"'";
	encodedExternalRoleURI = "'"+encodedExternalRoleURI+"'";
    if (relationBoxName == getUiProps().MSG0039) {
        relationBoxName = "'null'";
    } else {
        relationBoxName = "'"+relationBoxName+"'";
    }
	
	var key = "(ExtRole="+encodedExternalRoleURI+",_Relation.Name="+relationName+",_Relation._Box.Name="+relationBoxName+")";
	var accessor = uExternalRole.getAccessor();
	var context = uExternalRole.initializeAbstractDataContext();
	var objLinkManager = new _pc.LinkManager(accessor, context); 
	var response = objLinkManager.retrieveRoleAccountLinks(context,SOURCE,	DESTINATION, key);
	try {
		if (response.getStatusCode() == 200) {
			var responseBody = response.bodyAsJson();
			var json = responseBody.d.results;
			for (var count=0; count<json.length; count++) {
				var obj = json[count];
				var role = objCommon.getRoleNameFromURI(obj.uri);
				roleList.push(" "+role);
			}
		}
	} catch (e) {
		// TODO: handle exception
	}
	return roleList;
};
	
/**
 * The Purpose of this function to display ribbon message after external 
 * role delete operation.
 */
externalRole.prototype.displayMultipleRolesConflictMessage = function () {
	this.closeDeleteRolePopup();
	var conflictRoleDeleteLength = 0;
	var successfulRoleDeleteLength = 0;
	conflictRoleDeleteLength = sbConflictCount;
	successfulRoleDeleteLength = sbSuccessfulCount;
	if(conflictRoleDeleteLength < 1 && successfulRoleDeleteLength > 0) {
		isDeleted = true;
		addSuccessClass('#extRoleMessageIcon');
		$("#extRoleMessageBlock").css("display", 'table');
		//inlineMessageBlock(285,'#extRoleMessageBlock');
		document.getElementById("extRoleSuccessmsg").innerHTML = successfulRoleDeleteLength+" "+getUiProps().MSG0342;
	} else if(successfulRoleDeleteLength < 1 && conflictRoleDeleteLength > 0) {
		isDeleted = false;
		addErrorClass('#extRoleMessageIcon');
		//inlineMessageBlock(285,'#extRoleMessageBlock');
		$("#extRoleMessageBlock").css("display", 'table');
		document.getElementById("extRoleSuccessmsg").innerHTML = conflictRoleDeleteLength+" "+getUiProps().MSG0343;
	} else if(conflictRoleDeleteLength > 0 && successfulRoleDeleteLength > 0 ) {
		isDeleted = true;
		addErrorClass('#extRoleMessageIcon');
		//inlineMessageBlock(300,'#extRoleMessageBlock');
		$("#extRoleMessageBlock").css("display", 'table');
		document.getElementById("extRoleSuccessmsg").innerHTML = successfulRoleDeleteLength+ " " + getUiProps().MSG0323 + " " +(conflictRoleDeleteLength + successfulRoleDeleteLength)+" "+getUiProps().MSG0342;
	}
	//uExternalRole.createExternalRoleTable();
	objCommon.centerAlignRibbonMessage("#extRoleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("extRoleMessageBlock");
	sbSuccessfulCount = 0;
	sbConflictCount = 0;
};

/**
 * The purpose of this function is to maintain table initial state
 */
externalRole.prototype.refreshExtRoleTable = function () {
	$(".dynamicRoleBoxRow").remove();
	$(".pagination").remove(); 
	document.getElementById("chkSelectall").checked = false;	
};

/**
 * The purpose of this method is to fetch the required records as per pagination. 
 * @param lowerLimit
 * @param upperLimit
 * @returns ExternalRole JSON
 */

externalRole.prototype.retrieveChunkedData = function (lowerLimit, upperLimit) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleMgr = new _pc.ExtRoleManager(accessor);
	var uri = objExtRoleMgr.getUrl();
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};
/**
 * The purpose of this method is to fetch the required records as per pagination. 
 * @param lowerLimit
 * @param upperLimit
 * @returns ExternalRole JSON
 */

externalRole.prototype.retrieveChunkedDataBox = function (boxName) {
    var baseUrl = getClientStore().baseURL;
    var cellName = sessionStorage.selectedcell;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var objboxMgr = createBoxManager();
    var uri = objboxMgr.getUrl();
    uri = uri + "('"+boxName+"')?$orderby=__updated desc";
    var restAdapter = _pc.RestAdapterFactory.create(accessor);
    var response = restAdapter.get(uri, "application/json");
    var json = response.bodyAsJson().d.results;
    return json;
};
externalRole.prototype.getExternalRoleData = function(externalRoleURI,relationName,relationBoxName) {
	var encodedExternalRoleURI = encodeURIComponent(externalRoleURI);
	relationName = "'" + relationName + "'";
	encodedExternalRoleURI = "'" + encodedExternalRoleURI + "'";
	var key = [
    	"ExtRole=" + encodedExternalRoleURI,
    	"_Relation.Name=" + relationName
    ].join(",");
    if (relationBoxName) {
        key += ",_Relation._Box.Name='" + relationBoxName + "'";
    }

	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleMgr = new _pc.ExtRoleManager(accessor);
	var uri = objExtRoleMgr.getUrl();	
	uri = uri + "("+key+")?$extend=_Box";

	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};
/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
externalRole.prototype.retrieveRecordCount = function () {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleMgr = new _pc.ExtRoleManager(accessor);
	var uri = objExtRoleMgr.getUrl(); 
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * The purpose of this function is to change css dynamicaly after
 * scrollbar appearence in grid
 */
externalRole.prototype.applyScrollCssOnExtRoleGrid = function() {
	var tbodyObject = document.getElementById("entityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#externalRoleTable td:eq(1)").css("width", '20.05%');
		$("#externalRoleTable td:eq(2)").css("width", '15.1%');
		$("#externalRoleTable td:eq(3)").css("width", '15.1%');
		$("#externalRoleTable td:eq(4)").css("width", '15.1%');
	}
};

/**
 * Following method validates external role name.
 * @param roleName external role name.
 * @returns {Boolean} True/False.
 */
externalRole.prototype.validateExternalRoleName = function(roleName) {
	if (roleName == undefined) {
		cellpopup.showErrorIcon('#txtBoxExtRoleURL');
		document.getElementById("externalRoleURLErrorMsg").innerHTML = getUiProps().MSG0049;
		return false;
	}
	var letters = /^[0-9a-zA-Z-_]+$/;
	var startHyphenUnderscore = /^[-_]/;
	var lenCellName = roleName.length;
	if (lenCellName < 1) {
		document.getElementById("externalRoleURLErrorMsg").innerHTML = getUiProps().MSG0052;
		cellpopup.showErrorIcon('#txtBoxExtRoleURL');
		return false;
	} else if (lenCellName > 128) {
		document.getElementById("externalRoleURLErrorMsg").innerHTML = getUiProps().MSG0298;
		cellpopup.showErrorIcon('#txtBoxExtRoleURL');
		return false;
	} else if (roleName.match(startHyphenUnderscore)) {
		document.getElementById("externalRoleURLErrorMsg").innerHTML = getUiProps().MSG0299;
		cellpopup.showErrorIcon('#txtBoxExtRoleURL');
		return false;
	} else if (lenCellName != 0 && !(roleName.match(letters))) {
		document.getElementById("externalRoleURLErrorMsg").innerHTML = getUiProps().MSG0300;
		cellpopup.showErrorIcon('#txtBoxExtRoleURL');
		return false;
	} 
	document.getElementById("externalRoleURLErrorMsg").innerHTML = "";
	cellpopup.showValidValueIcon('#txtBoxExtRoleURL');
	return true;
};

/**
 * The purpose of this function is to validate external role URl on blur
 * 
 */
$("#txtBoxExtRoleURL").blur(function() {
    var extRoleURL = document.getElementById("txtBoxExtRoleURL").value;
    uExternalRole.validateExternalRoleUrl(extRoleURL);
});

/**
 * The purpose of this function is to validate dropdown  on blur
 * 
 */
$("#idRelationBoxDropDown").blur(function() {
	var relBox = $("#idRelationBoxDropDown").val();
	uExternalRole.validateEmptyDropDown(relBox);
});

/**
 * The purpose of this function is to validate second dropdown in register external role popup  on blur
 * 
 */
$("#dropDownRoleAssignToExtRole").blur( function() {
	objCommon.validateDropDownValue("dropDownRoleAssignToExtRole", "#ddRoleBoxErrorMsgExtRole", getUiProps().MSG0279);
});

function checkboxFocusOnExtRole() {
	$("#lblAssignExtRole").css("outline","-webkit-focus-ring-color auto 5px");
}

function checkboxBlurOnExtRole() {
	$("#lblAssignExtRole").css("outline","none");
}

/**
 * Following method fetches all external role data.
 * @returns json
 */
externalRole.prototype.retrieveAllExternalRoleData = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtRoleMgr = new _pc.ExtRoleManager(accessor);
	var totalRecordCount = uExternalRole.retrieveRecordCount();
	var uri = objExtRoleMgr.getUrl();	
	uri = uri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

$(function() {
	if(sessionStorage.tabName == "External Role"){
		uExternalRole.loadExternalRolePage();
		objCommon.creatEntityHoverEffect();
		objCommon.sortByDateHoverEffect();
		setDynamicGridHeight();
		$(window).resize(function () {
			if ($('#dvemptyTableMessage').is(':visible')) {
				objCommon.setDynamicPositionOfEmptyMessage();
			}
		});
	}
});

externalRole.prototype.setCellControlsInfoTabValues = function(ccname, etag, cccreatedat, ccupdatedat, ccurl) {   
    sessionStorage.ccname       = objCommon.replaceNullValues(ccname,getUiProps().MSG0275);
    sessionStorage.ccetag       = etag;
    sessionStorage.cccreatedat  = objCommon.replaceNullValues(cccreatedat,getUiProps().MSG0275);
    sessionStorage.ccupdatedat  = objCommon.replaceNullValues(ccupdatedat,getUiProps().MSG0275);
    if (ccurl != undefined) {
    	sessionStorage.ccurl        = objCommon.replaceNullValues(ccurl,getUiProps().MSG0275).replace(/[`]/g,"'");
    } else {
    	sessionStorage.removeItem("ccurl");
    }
    
};