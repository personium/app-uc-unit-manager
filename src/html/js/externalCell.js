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
function externalCell() {
}

var objExtCell = new externalCell();
var totalRecordsize = 0;
var sbSuccessful = '';
var sbConflict = '';
var arrDeletedConflictCount = [];
var etagValue  = '';
var objboxMgr = null;
var isDeleted = false;

/**
 * The purpose of this method is to fetch external name.
 * @param uri
 * @returns externalCellName
 */
externalCell.prototype.getExternalCellName = function(uri) {
//function getExternalCellName(uri) {
	var arrUri = uri.split("/"); 
	var externalCellName = undefined;
	if (uri.startsWith(objCommon.PERSONIUM_LOCALUNIT)) {
		// local unit
		externalCellName = arrUri[1];
	} else {
		// url
		externalCellName = arrUri[3];  
	}

	if (externalCellName!= undefined && externalCellName.length == 0) {
		externalCellName = undefined;
	}
	
	return  externalCellName;
};

/**
 * Following method fetches  the external cell information.
 * @param uri external cell URL
 * @returns Array having domain name and external cell name.
 */
externalCell.prototype.getExternalCellInfo = function(uri) {
	// function getExternalCellName(uri) {
	var arrUri = uri.split("/");
	if (arrUri.length < 6) {
		var arrExtCellInfo = new Array();
		arrExtCellInfo.push(arrUri[2]);
		var externalCellName = arrUri[3];
		if (externalCellName != undefined && externalCellName.length == 0) {
			externalCellName = undefined;
		}
		arrExtCellInfo.push(externalCellName);
		return arrExtCellInfo;
	}
	return false;
};

/**
 * The purpose of this method is to open pop up window for creating external cell.
 * @param idDialogBox
 * @param idModalWindow
 */
externalCell.prototype.openExternalCellWindow = function(idDialogBox,
		idModalWindow) {
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
};

/**
 * The purpose of this method is to close the pop up window.
 */
externalCell.prototype.closeExternalPopUpWindow = function() {
	refreshDropDown();
	refreshExternalCellWindow();
	//$('#externalCellDialogBox, .window').hide();
	$('#externalCellModalWindow, .window').hide(0);
	
};
/**
 * The purpose of this method is to bring the page to its default state.
 */
function refreshExternalCellWindow() { 
	$('#txtUrl').val('');
	$("#rdMyCell").attr('checked', 'checked');
	$("#rowMyCell").show();
	$("#rowCellURL").hide();
	externalCellURLErrorMesage.innerHTML = "";

}
/**
 * The purpose of this method is to get accessor values. 
 * @returns accessor
 */
externalCell.prototype.getAccessor  = function() {
	var cellName = sessionStorage.selectedcell;	
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	return accessor;
};

/**
 * The purpose of this method is to fetch cell list.
  * @returns
 */
externalCell.prototype.getCellList = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objCellManager = new _pc.CellManager(accessor);
	var uri = objCellManager.getUrl();
	var count = objExtCell.retrieveCellCount();
	uri = uri + "?$orderby=__updated desc &$top=" + count;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
* The purpose of this method is to bind drop down.
*/
externalCell.prototype.bindDropDown = function(editFlg) {
	var objExternalCell = new externalCell();
	let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
	if (ManagerInfo.isCellManager) {
		return;
	}
	var jsonString = objExternalCell.getCellList();
	//jsonString = sortByKey(jsonString, '__published');
	var select = document.getElementById("ddlCellList");
	if (editFlg) {
		select = document.getElementById("ddlEditCellList");
	}
	for ( var count = 0; count < jsonString.length; count++) {
		var option = document.createElement("option");
		var objCell = jsonString[count];
		var tooltipExternalCellName = objCommon.getShorterEntityName(objCell.Name);
		option.innerHTML = objCell.Name;
		option.text = tooltipExternalCellName;
		option.title = objCell.Name;
		option.value = objCell.Name;
		select.appendChild(option);
		$("#ddlCellList option[value= '" + sessionStorage.selectedcell + "']")
		.remove();
	}
};

/**
 * The purpose of this method is to form schema URL on the basis of selected value from drop down / text box. 
 */
externalCell.prototype.getSchemaUrl = function() {
	var schemaURL = null;
	if ($('#rdMyCell').is(':checked')) {
		var selectCellMessage = getUiProps().MSG0283;
		var valid = objCommon.validateDropDownValue('ddlCellList', '#ddCellListErrorMsg', selectCellMessage);
		if (valid) {
			var baseUrl = getClientStore().baseURL;
			var selectedCell = $("#ddlCellList option:selected").val();
			var accessor = objCommon.initializeAccessor(baseUrl, selectedCell,"","");
    		var objCellManager = new _pc.CellManager(accessor);
    		schemaURL = objCellManager.getCellUrl(selectedCell);
		} else {
			removeSpinner("modalSpinnerExtCell");
			return;
		}
		return schemaURL;
	} else if ($('#rdExternalCell').is(':checked')) {
		schemaURL = $('#txtUrl').val();
		return schemaURL;
	}
};

externalCell.prototype.showMessage = function(idModalWindow) { 
	$(idModalWindow + ', .window').hide();
	addSuccessClass('#extCellMessageIcon');
	$("#extCellMessageBlock").css("display", 'table');
	document.getElementById("extCellSuccessmsg").innerHTML = getUiProps().MSG0284;
	objExtCell.createExternalCellTable();
	objCommon.centerAlignRibbonMessage("#extCellMessageBlock");
	objCommon.autoHideAssignRibbonMessage('extCellMessageBlock');
};

/***
 * The purpose of this method is to perform create operation for External cell.
 */
externalCell.prototype.registerExternalCell = function(body) {
	var objExternalCell = new externalCell();
	var accessor = objExternalCell.getAccessor();
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	try {
		var idModalWindow = '#externalCellModalWindow';
		var createdExtCellDetails = objExtCellManager.create(body);
		if (createdExtCellDetails instanceof _pc.ExtCell) {
			if (($('#chkBoxCreateExtCell').is(':checked'))) {
				var extCellURL = body.Url;
				var multiKey = "(Name='" + encodeURIComponent(extCellURL) + "')";
				var response = objCommon.assignEntity('dropDownAssignRelationCreateExtCell', 'ExtCell', 'Relation', multiKey, true);
				if (response.getStatusCode() == 204) {
					objExtCell.showMessage(idModalWindow);
				}
			} else {
				objExtCell.showMessage(idModalWindow);
			}
		}
	} catch (exception) {
		if (exception.getCode() == "PR409-OD-0003") {
			if ($('#rdMyCell').is(':checked')) {
				document.getElementById('ddCellListErrorMsg').innerHTML = getUiProps().MSG0032;
			} else {
				document.getElementById('externalCellURLErrorMesage').innerHTML = getUiProps().MSG0032;
				cellpopup.showErrorIcon('#txtUrl');
			}
		} else if (exception.getCode() == "PR400-OD-0006") {
			document.getElementById('externalCellURLErrorMesage').innerHTML = getUiProps().MSG0034;
			cellpopup.showErrorIcon('#txtUrl');
		}
	}
};
/**
 *  The purpose of this method is to register external cell.
 */
externalCell.prototype.createExternalCell = function() {
	showSpinner("modalSpinnerExtCell");
	var objExternalCell = new externalCell();
	var schemaURL = objExternalCell.getSchemaUrl();
	if (objExternalCell.getExternalCellInfo(schemaURL) == false) {
		document.getElementById(schemaSpan).innerHTML = getUiProps().MSG0302;
		cellpopup.showErrorIcon('#txtUrl');
		return false;
	}
 	else {
		if (objExternalCell.getExternalCellInfo(schemaURL) == false) {
			document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0302;
			cellpopup.showErrorIcon('#txtUrl');
			return false;
		}
		var extCellInfo = objExternalCell.getExternalCellInfo(schemaURL);
		var extCellURL = "";
		objCommon.getCell(schemaURL).done(function(cellObj) {
			extCellURL = cellObj.cell.url;
		}).fail(function(xmlObj) {
			if (xmlObj.status == "200" || xmlObj.status == "412") {
				extCellURL = schemaURL;
			}
		}).always(function() {
			if (extCellURL == "") {
				cellpopup.showErrorIcon('#txtUrl');
				document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0434;
				return false;
			}

			if (($('#chkBoxCreateExtCell').is(':checked'))) {
				var isValid = objCommon.validateDropDownValue(
						'dropDownAssignRelationCreateExtCell',
						'#selectRelationDropDownError',
						getUiProps().MSG0083);
				if (isValid == false) {
					removeSpinner("modalSpinnerExtCell");
					return;
				}
			}
			var body = {
				"Url" : schemaURL
			};
			objExternalCell.registerExternalCell(body);
		});		
	}
	removeSpinner("modalSpinnerExtCell");
};
/***
 * The purpose of this method is to perform update operation for External cell.
 */
externalCell.prototype.updateExternalCell = function(key, body) {
	var objExternalCell = new externalCell();
	var accessor = objExternalCell.getAccessor();
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	try {
		var idModalWindow = '#externalCellEditModalWindow';
		var response = objExtCellManager.update(key, body);
		if (response.getStatusCode() == 204) {
			objExtCell.showMessage(idModalWindow);
			updateExternalInfo(body.Url);
		}
	} catch (exception) {
		if (exception.getCode() == "PR409-OD-0003") {
			document.getElementById('externalCellURLEditErrorMessage').innerHTML = getUiProps().MSG0032;
			cellpopup.showErrorIcon('#txtEditUrl');
		} else if (exception.getCode() == "PR400-OD-0006") {
			document.getElementById('externalCellURLEditErrorMessage').innerHTML = getUiProps().MSG0034;
			cellpopup.showErrorIcon('#txtEditUrl');
		}
	}
};
function updateExternalInfo(schemaURL) {
	var objExternalCell = new externalCell();
	var extCellName = "";
	objCommon.getCell(schemaURL).done(function(cellObj) {
		extCellName = cellObj.cell.name;
	}).fail(function(xmlObj) {
		if (xmlObj.status == "200" || xmlObj.status == "412") {
			var extCellInfo = objExternalCell.getExternalCellInfo(schemaURL);
			extCellName = extCellInfo[1];
		}
	}).always(function() {
		var accessor = objExternalCell.getAccessor();
		var objExtCellManager = new _pc.ExtCellManager(accessor);
		$("#assignExtCellName").html(extCellName);
		$("#assignExtCellName").attr('title', extCellName);
		$("#assignExtCellURlName").text(schemaURL);
		var extData = objExtCell.getExternalCellData(schemaURL);
    	objExtCell.setCellControlsInfoTabValues(extCellName, extData.__metadata.etag, objCommon.convertEpochDateToReadableFormat(extData.__published), objCommon.convertEpochDateToReadableFormat(extData.__updated));
		uBoxDetail.displayBoxInfoDetails();
	});
}

/**
 *  The purpose of this method is to change external cell.
 */
externalCell.prototype.changeExternalCell = function() {
	showSpinner("modalSpinnerExtCell");
	var objExternalCell = new externalCell();
	var schemaURL = $("#txtEditUrl").val();
	if (objExternalCell.getExternalCellInfo(schemaURL) == false) {
		document.getElementById("externalCellURLEditErrorMessage").innerHTML = getUiProps().MSG0302;
		cellpopup.showErrorIcon('#txtEditUrl');
		return false;
	}
	var extCellName = "";
	var extCellURL = "";
	objCommon.getCell(schemaURL).done(function(cellObj, status, xhr) {
		extCellName = cellObj.cell.name;
		let ver = xhr.getResponseHeader("x-personium-version");
        if (ver >= "1.7.1") {
        	extCellURL = cellObj.unit.url;
        } else {
			var extCellInfo = objExternalCell.getExternalCellInfo(schemaURL);
			extCellURL = extCellInfo[0];
        }
		
	}).fail(function(xmlObj) {
		if (xmlObj.status == "200" || xmlObj.status == "412") {
			var extCellInfo = objExternalCell.getExternalCellInfo(schemaURL);
			extCellName = extCellInfo[1];
			extCellURL = extCellInfo[0];
		}
	}).always(function() {
		if (!objBox.validateSchemaURL(schemaURL,
				"externalCellURLEditErrorMessage","#txtEditUrl")) {
			removeSpinner("modalSpinnerExtCell");
			return;
		} else if (!objCommon.validateURL(extCellURL,
					"externalCellURLEditErrorMessage", "#txtEditUrl")) {
			removeSpinner("modalSpinnerExtCell");
			return;	
		} else if (!objExternalCell.validateExternalCellName(extCellName)) {
			removeSpinner("modalSpinnerExtCell");
			return;
		} else if(!objCommon.doesUrlContainSlash(schemaURL, "externalCellURLEditErrorMessage","#txtEditUrl",getUiProps().MSG0285)) {
			removeSpinner("modalSpinnerExtCell");
			return;
		}
	
		let cellName = "";
		let unitUrl = "";
		objCommon.getCell(schemaURL).done(function(cellObj, status, xhr) {
			cellName = cellObj.cell.name;
			let ver = xhr.getResponseHeader("x-personium-version");
	        if (ver >= "1.7.1") {
	        	unitUrl = cellObj.unit.url;
	        } else {
	        	let cellSplit = schemaURL.split("/");
	            unitUrl = _.first(cellSplit, 3).join("/") + "/";
	        }
		}).fail(function(xmlObj) {
			if(xmlObj.status == "200" || xmlObj.status == "412") {
				let cellSplit = schemaURL.split("/");
	            unitUrl = _.first(cellSplit, 3).join("/") + "/";
				cellName = objCommon.getName(schemaURL);
			}
		}).always(function() {
			var body = {
				"Url" : objCommon.changeUnitUrlToLocalUnit(schemaURL, cellName, unitUrl)
			};
			var key = $("#assignExtCellURlName").text();
			objExternalCell.updateExternalCell(key, body);
			removeSpinner("modalSpinnerExtCell");
		});
	});
};

/**
 * Following method validates external cell name.
 * @param cellName External Cell Name.
 * @returns {Boolean} True/False.
 */
externalCell.prototype.validateExternalCellName = function(cellName) {
	if (cellName == undefined) {
		cellpopup.showErrorIcon('#txtUrl');
		document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0303;
		return false;
	}
	var letters = /^[0-9a-zA-Z-_]+$/;
	var startHyphenUnderscore = /^[-_]/;
	var lenCellName = cellName.length;
	if (lenCellName < 1) {
		document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0034;
		cellpopup.showErrorIcon('#txtUrl');
		return false;
	} else if (lenCellName > 128) {
		document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0304;
		cellpopup.showErrorIcon('#txtUrl');
		return false;
	} else if (cellName.match(startHyphenUnderscore)) {
        document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0305;
        cellpopup.showErrorIcon('#txtUrl');
        return false;
	} else if (lenCellName != 0 && !(cellName.match(letters))) {
		document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0300;
		cellpopup.showErrorIcon('#txtUrl');
		return false;
	}
	document.getElementById("externalCellURLErrorMesage").innerHTML = "";
	cellpopup.showValidValueIcon('#txtUrl');
	return true;
};

/**
 * The purpose of this method is to create an object of jAbstractODataContext.
 * This method is accepting accessor as an input parameter.
 */
externalCell.prototype.initializeAbstractDataContext = function() { 
	var objExternalCell = new externalCell();
	var accessor = objExternalCell.getAccessor();
	var objAbstractDataContext =  new _pc.AbstractODataContext(accessor);
	return objAbstractDataContext;
};

/**
 * The purpose of the following method is to get external role count.
 * @param externalCellURI
 * @returns {Number}
 */
externalCell.prototype.getExternalRoleCount = function(externalCellURI) {
	//function getExternalRoleCount(externalCellURI) {
		var roleCount = 0;
		var SOURCE = "ExtCell";
		var DESTINATION= "Role";
		var encodedExternalCellURI = encodeURIComponent(externalCellURI);
		var objExternalCell = new externalCell();
		var context = objCommon.initializeAbstractDataContext();
		var accessor = objExternalCell.getAccessor();	
		var objLinkMgr = objCommon.initializeLinkManager(accessor, context);
		var response = objLinkMgr.retrieveAccountRoleLinks(context,
				SOURCE,	DESTINATION, encodedExternalCellURI,"", "");
		
		var responseBody = response.bodyAsJson();
		var json = responseBody.d.results;
		if (response.getStatusCode() == 200) {
			if (json.length >= 1) {
				roleCount = json.length;
			} else {
				roleCount = 0;
			}
		}
		return roleCount;
	};

/**
 * The purpose of this method is to get the number of relations mapped with the external cell.
 * @param externalCellURI
 * @returns {Number}
 */
externalCell.prototype.getExternalCellToRelationCount = function(externalCellURI) {
		var relationCount = 0;
		var SOURCE = "ExtCell";
		var DESTINATION= "Relation";
		var encodedExternalCellURI = encodeURIComponent(externalCellURI);
		var objExternalCell = new externalCell();
		var accessor = objExternalCell.getAccessor();	
		var context = objExternalCell.initializeAbstractDataContext();
		var objLinkMgr = objCommon.initializeLinkManager(accessor, context);
		var response = objLinkMgr.retrieveAccountRoleLinks(context,
				SOURCE,	DESTINATION, encodedExternalCellURI,"", "");
		var responseBody = response.bodyAsJson();
		var json = responseBody.d.results;
		if (response.getStatusCode() == 200) {
			if (json.length >= 1) {
				relationCount = json.length;
			} else {
				relationCount = 0;
			}
		}
		return relationCount;
	};

/**
 * The purpose of this method is to prevent drop down from loading values again on page reload.
 */
function refreshDropDown() {
	var select = document.getElementById("ddlCellList");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0283;
	select.insertBefore(newOption, select.options[-1]);
}

/**
 * The purpose of this method is to validate schema URL.
 * @param schemaURL
 * @param schemaSpan
 * @returns {Boolean}
 */
function validateExternalCellURL(schemaURL, schemaSpan) {
	if (schemaURL != undefined) {
		var isHttp = schemaURL.substring(0, 5);
		var isHttps = schemaURL.substring(0, 6);
		var mandatoryFieldMessage = getUiProps().MSG0033;
		var validMessage = getUiProps().MSG0034;
		//var endsWithMessage = getUiProps().MSG0285;
		var urlMaxLengthMessage = getUiProps().MSG0057;
		var lengthSchemaURL = schemaURL.length;
		var schemaSplit = schemaURL.split("/");
		var isDot = -1;
		if(schemaSplit.length > 2) {
			if (schemaSplit[2].length>0) {
				isDot = schemaSplit[2].indexOf(".");
			}
		}
		if ($('#rdExternalCell').is(':checked')) {
			if (lengthSchemaURL < 1 || schemaURL == undefined || schemaURL == null
					|| schemaURL == "") {
				document.getElementById(schemaSpan).innerHTML = mandatoryFieldMessage;
				cellpopup.showErrorIcon('#txtUrl');
				return false;
			} else if (isHttp != "http:" && isHttps != "https:") {
				document.getElementById(schemaSpan).innerHTML = validMessage;
				cellpopup.showErrorIcon('#txtUrl');
				return false;
			} else if (lengthSchemaURL > 1024) {
				document.getElementById(schemaSpan).innerHTML = urlMaxLengthMessage;
				cellpopup.showErrorIcon('#txtUrl');
				return false;
			} else if (isDot == -1) {
				document.getElementById(schemaSpan).innerHTML = validMessage;
				cellpopup.showErrorIcon('#txtUrl');
				return false;
			}/*else if (!schemaURL.endsWith("/")) {
				document.getElementById(schemaSpan).innerHTML = endsWithMessage;
				cellpopup.showErrorIcon('#txtUrl');
				return false;
			}*/
			document.getElementById(schemaSpan).innerHTML = "";
			cellpopup.showValidValueIcon('#txtUrl');
		}
		return true;
	}
}



/**
 * The purpose of the following method is to create Rows for the dynamic table.
 */
externalCell.prototype.createRows = function(dynamicTable, externalCellURI, externalCellName,externalCellDate, count, fullExternalCellName, fullExternalCellURI,externalRoleCount, linkedRelationList, externalCellRowCount, createdDate,parrEtag0, parrEtag1,etag) {
	var selectedExtCellName = "'"+ fullExternalCellName + "'" ;
	var selectedExtCellURL = "'"+ fullExternalCellURI + "'" ;
	var dispExtCellURL = objCommon.changeLocalUnitToUnitUrl(fullExternalCellURI);
	var pcreatedDate = "'" + createdDate + "'" ;
	var pexternalCellDate = "'" + externalCellDate+"'" ;
	
//function createRows (dynamicTable, externalCellURI, externalCellName,externalCellDate, count, shorterExternalCellName, shorterExternalCellURI,externalRoleCount) {
	dynamicTable += '<td style="width:1%"><input id =  "txtHiddenEtagId'+externalCellRowCount+'" value='+etag+' type = "hidden" /><input  title="'+externalCellRowCount+'" id="chkBox'+externalCellRowCount+'" type="checkbox" class="case cursorHand regular-checkbox big-checkbox" name="case" value="'+externalCellURI+'"/><label for="chkBox'+externalCellRowCount+'" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += '<td name = "externalCellName" style="max-width: 100px;width:15%"><div class = "mainTableEllipsis"><a href="#" id="extCellNameLink_' + count + '" title= "' + fullExternalCellName + '" onclick="openExternalCellToRoleMapping(' + selectedExtCellName + ',' +selectedExtCellURL+ ');" tabindex ="-1" style="outline:none">' + fullExternalCellName + '</a></div></td>';
	dynamicTable += "<td name = 'externalCellURL' id='extCellURI_" + count + "' style='max-width: 100px;width:24%'><div class = 'mainTableEllipsis'><label title= "+dispExtCellURL+" class='cursorPointer'>"
			+ dispExtCellURL + "</label></div></td>";
	dynamicTable += "<td style='width:15%' name = 'Date' id='extCellCreatedDate_" + count + "'>" + createdDate
	+ "</td>";
	dynamicTable += "<td style='width:15%' name = 'Date' id='extCellDate_" + count + "'>" + externalCellDate
			+ "</td>";
	dynamicTable += "<td style='max-width: 163px;width:30%'><div class = 'mainTableEllipsis'><label title= '"+linkedRelationList+"' class='cursorPointer'>"+ linkedRelationList +"</label></div></td>";
	//dynamicTable += '<td style="width:30%"><span onclick="openExternalCellToRoleMapping(' + count + ');" title = "Map to role" class="relationMappingIcon hand">Mapping</span><input type="text" value='+externalRoleCount+' class="textBoxCircle hand" onclick="openExternalCellToRoleMapping(' + count + ');" title = "Map to role"/><span title="Map to relation", class="relationIcon" onclick="openExternalCellToRelationRoleMapping(' + count + ');">Relation</span><input type="text", title = "Map to relation",  value="'+extCellToRelationCount+'"  class="textBoxCircle hand" onclick="openExternalCellToRelationRoleMapping(' + count + ');"/></td>';
	dynamicTable += "</tr>";
	return dynamicTable;
};

/**
 * The purpose of this method is to createa and initialize external cell manager.
 */
externalCell.prototype.createExternalCellManager = function(){
	var objExternalCell = new externalCell();
	var accessor = objExternalCell.getAccessor();
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	return objExtCellManager;
};

/**
 * Th epurpose of this method is to create external cell table view as per pagination.
 * @param json
 * @param recordSize
 */
externalCell.prototype.createChunkedExtCellTable = function(json, recordSize, spinnerCallback) {
	$('#chkSelectall').attr('checked', false);
	$("#chkSelectall").attr('disabled', false);
	objCommon.disableButton('#btnDeleteExternalCell');
	$("#mainExternalCellTable tbody").empty();
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS+recordSize) < (jsonLength) ? (objCommon.MAXROWS+recordSize) : jsonLength;
	var externalCellRowCount = 0;
	for ( var count = recordSize; count < maxLimit; count++) {
		var arrayData = json[count];
		objExtCell.addExtCellTable(arrayData, count, externalCellRowCount);
		externalCellRowCount++;
	}
	if (jsonLength >0) {
		$("#mainExternalCellTable thead tr").addClass('mainTableHeaderRow');
		$("#mainExternalCellTable tbody").addClass('mainTableTbody');
	}
	setTimeout(function() {
		objExtCell.applyScrollCssOnExtCellGrid();	
		}, 300);
	if (spinnerCallback != undefined) {
		spinnerCallback();
	}
};
externalCell.prototype.addExtCellTable = function(arrayData, count, externalCellRowCount) {
	var dynamicTable = "";
	var objExternalCell = new externalCell();
	//alert('arrayData --->' + JSON.stringify(arrayData));
	var externalCellURI = arrayData.Url;
	
	var etag = arrayData.__metadata.etag;
	//alert('arrayData --->' + JSON.stringify( arrayData.__metadata.etag));
	
	var arrEtag = etag.split("/");
	var arrEtag0 = "'"+ arrEtag[0] +"'" ;
	var arrEtag1 = "'"+ arrEtag[1].replace(/["]/g,"") + "'";
	
	var externalCellURL = "'"+ externalCellURI + "'";
	var externalRoleCount = 0;//objExternalCell.getExternalRoleCount(externalCellURI[count]);
	var linkedRelationList = objExtCell.getRelationDetailsLinkedToExternalCell(externalCellURI);//objExternalCell.getExternalCellToRelationCount(externalCellURI[count]);
	var externalCellName = getUiProps().LBL0028;
	var cellUrl = objCommon.changeLocalUnitToUnitUrl(arrayData.Url)
	objCommon.getCell(cellUrl).done(function(cellObj) {
		externalCellName = cellObj.cell.name;
	}).fail(function(xmlObj) {
		if (xmlObj.status == "200" || xmlObj.status == "412") {
			externalCellName = objExternalCell.getExternalCellName(arrayData.Url);
		}
	}).always(function() {
		var fullExternalCellName = externalCellName;
		var fullExternalCellURI = externalCellURI;
		var createdDate = objCommon.convertEpochDateToReadableFormat(arrayData.__published);
		var externalCellDate = objCommon.convertEpochDateToReadableFormat(arrayData.__updated);
		externalCellName = "'"+externalCellName+"'";
		dynamicTable = '<tr name="allrows" id="rowid' + externalCellRowCount+ '" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteExternalCell'" +','+ "'chkSelectall'" +','+ externalCellRowCount +',' + totalRecordsize + ','+ "''" + ','+"''"+','+"''"+','+"''"+','+"'mainExternalCellTable'"+');">';
		dynamicTable = objExternalCell.createRows(dynamicTable, externalCellURL,externalCellName, externalCellDate, count, fullExternalCellName, fullExternalCellURI,externalRoleCount, linkedRelationList, externalCellRowCount, createdDate, arrEtag0, arrEtag1,etag);
		$("#mainExternalCellTable tbody").append(dynamicTable);
	});
}

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
externalCell.prototype.retrieveRecordCount = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};
/**
 * The purpose of this method is to fetch the required records as per pagination. 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
externalCell.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};
externalCell.prototype.getExternalCellData = function(extUrl) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	uri = uri + "('"+encodeURIComponent(extUrl)+"')";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/**
 * The purpose of this function is to create dynamic tabled on the basis of
 * response returned by API
 */
externalCell.prototype.createExternalCellTable = function() {
	var objExtCell = new externalCell();
	totalRecordsize = objExtCell.retrieveRecordCount();
	if (totalRecordsize > 0) {
		document.getElementById("dvemptyTableMessage").style.display = "none";
		var json = objExtCell.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
		var recordNo = 0;
		objExtCell.createChunkedExtCellTable(json, recordNo);
		var tableID = $('#mainExternalCellTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS, tableID, objExtCell, json, objExtCell.createChunkedExtCellTable, "ExtCell");
		objCommon.checkCellContainerVisibility();
	} else {
		$('#chkSelectall').attr('checked', false);
		$("#mainExternalCellTable tbody").empty();
		objCommon.displayEmptyMessageInGrid(getUiProps().MSG0234, "ExtCell", "230");
		objCommon.disableButton('#btnDeleteExternalCell');
	}
};
externalCell.prototype.getSelectedExternalCellDetails = function() {
	var selectedExternalCell = $("#assignExtCellURlName").text();
	$("#txtEditUrl").val(objCommon.changeLocalUnitToUnitUrl(selectedExternalCell));
}
/********************************************/

/**
 * The purpose of this function is to check parent check box on selection of all
 * child check boxes.
 */
function checkAll(cBox) {
	var buttonId = '#btnDeleteExternalCell';
	objCommon.checkBoxSelect(cBox, buttonId);
	objCommon.showSelectedRow(document.getElementById("chkSelectall"),"row","rowid");
}

/**
 * The purpose of this function is to implement row select functionality on click
 * of row.
 */
function rowSelect(count) {
	$("#hyplinkDeleteIcon").show();
	var rowID = $('#rowid' + count);
	rowID.siblings().removeClass('selectRow');
	rowID.addClass('selectRow');
	if (!$('#chkBox' + count).is(':checked')) {
		$('#chkBox' + count).attr('checked', true);
	} else {
		$('#chkBox' + count).attr('checked', false);
	}
	var checkCount = 0;
	for ( var count = 0; count <totalRecordsize; count++) {
		$('#row' + count).hide();
		if ($('#chkBox' + count).is(':checked')) {
			checkCount += 1;
		}
	}
	if (checkCount === 1) {
		objCommon.disableButton('#btnDeleteExternalCell');
		for ( var count = 0; count <totalRecordsize; count++) {
			if ($('#chkBox' + count).is(':checked')) {
				$('#row' + count).show();
			}
		}
	} else { // checked more than one
		objCommon.enableButton('#btnDeleteExternalCell');
	}
	if (checkCount <= 1) {
		objCommon.disableButton('#btnDeleteExternalCell');
	}
	objCommon.unCheck();
}

/**
 * The purpose of this function is to get external cell details for single delete on click of row
 */
function openSingleExternalCellDeleteWindow(externalCellUrl, externalCellName) {
	sessionStorage.externalCellUrl = externalCellUrl;
	sessionStorage.externalCellName = externalCellName;
	var objExternalCell = new externalCell();
	objExternalCell.openExternalCellWindow('#externalCellSingleDeleteDialogBox','#externalCellSingleDeleteModalWindow');
}

/**
 * The purpose of this function is to implement multiple external cell delete functionality.
 */
externalCell.prototype.deleteMultipleExternalCell = function () {	
	var objExternalCell = new externalCell();
	var etagIDOfPreviousRecord = "txtHiddenEtagId";
	var arrEtag = [];
	var etagValue = '';
	var idCheckAllChkBox = '#chkSelectall';
	var tableID = $('#mainExternalCellTable');
/*	if (!$("#chkSelectall").is(':checked')) {*/
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBox0");
	}
	showSpinner("modalSpinnerExtCell");
	var externalCellUrls = sessionStorage.externalCellUrls;
	externalCellUrls = externalCellUrls.replace(/'/g,"");
	var arrExternalCellUrls = externalCellUrls.split(',');
	for ( var count = 0; count < arrExternalCellUrls.length; count++) {
		objExternalCell.deleteExternalCell(arrExternalCellUrls[count],count);
		}
	objExternalCell.displayMessage();
	removeSpinner("modalSpinnerExtCell");
	var type="ExtCell";
	 var recordCount = objExtCell.retrieveRecordCount();
		objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, objExternalCell, isDeleted);
};

/**
 * The purpose of this function is to delete external cell on the basis of
 * external cell url.
 */
externalCell.prototype.deleteExternalCell = function (id,count) {
	showSpinner("modalSpinnerExtCell");
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var etag = objExtCellManager.getEtag(id);
	
	try {
		var promise = objExtCellManager.del(id, etag);
		if (promise.resolvedValue.status == 204) {
			sbSuccessful += id + ",";
		}
	} catch (exception) {
		arrDeletedConflictCount.push(count);
		sbConflict += id + ",";
	}
	removeSpinner("modalSpinnerExtCell");
};

/**
 * The purpose of this function is to get selected external cell details for multiple delete. 
 */
externalCell.prototype.getMultipleExternalCellNames = function () { 
	var elementsLength = document.externalCellftable.elements.length;
	var count = 0;
	var externalCellUrl = null;
	for (count = 0; count < elementsLength; count++) {
		if (document.externalCellftable.elements[count].name == "case") {
			if (document.externalCellftable.elements[count].checked) {
				var formExternalCellUrl = document.externalCellftable.elements[count].value;
				
				if (externalCellUrl == null) {
					externalCellUrl = formExternalCellUrl;
				} else {
					externalCellUrl = externalCellUrl + ',' + formExternalCellUrl;
				}
			}
		}
	}
	sessionStorage.externalCellUrls = externalCellUrl;
};

/**
 * The purpose of this function is to display message in case of multiple delete scenario.
 */
externalCell.prototype.displayMessage = function () {
	sbSuccessful =sbSuccessful.substring(0, sbSuccessful.length-1);	
	sbConflict = sbConflict.substring(0, sbConflict.length-1);
	$('#multipleExternalCellDeleteModalWindow, .window').hide();
	if (sbSuccessful.length > 0 && sbConflict.length < 1) {
		isDeleted = true;
		addSuccessClass('#extCellMessageIcon');
		document.getElementById("extCellSuccessmsg").innerHTML = entityCount(sbSuccessful)
		+ " " + getUiProps().MSG0340;
	} else if (sbSuccessful.length < 1 && sbConflict.length > 0) {
		isDeleted = false;
		addErrorClass('#extCellMessageIcon');
		document.getElementById("extCellSuccessmsg").innerHTML = entityCount(sbConflict)
		+ " " + getUiProps().MSG0341;
	} else if (sbSuccessful.length > 0 && sbConflict.length > 0) {
		isDeleted = true;
		addErrorClass('#extCellMessageIcon');
		document.getElementById("extCellSuccessmsg").innerHTML = entityCount(sbSuccessful) + " " + getUiProps().MSG0323 +" "
		+(entityCount(sbConflict)+entityCount(sbSuccessful))+" " + getUiProps().MSG0340;
	}
	sbSuccessful = '';
	sbConflict = '';
	$("#extCellMessageBlock").css("display", 'table');
	//objExtCell.createExternalCellTable();
	objCommon.centerAlignRibbonMessage("#extCellMessageBlock");
	objCommon.autoHideAssignRibbonMessage("extCellMessageBlock");
};


/****************************************/
/**
 * The purpose of this method is to load the elements and values when the page is loaded for the first time.
 */
externalCell.prototype.loadExternalCellPage = function() {
	var objExternalCell = new externalCell();
	if (sessionStorage.tabName == "External Cell") {
		objExternalCell.createExternalCellTable();
		objCommon.checkCellContainerVisibility();
	}
	$("#rdMyCell").click(function() {
		$("#rowCellURL").hide();
		$("#rowMyCell").show();
		$('#externalCellURLErrorMesage').html('');
		$("#ddlCellList").val("Select Cell");
		$('#txtUrl').val('');
		objCommon.removePopUpStatusIcons('#txtUrl');
		$('#chkBoxCreateExtCell').attr('checked', false);
		$("#dropDownAssignRelationCreateExtCell").attr('disabled', true);
		$("#dropDownAssignRelationCreateExtCell").addClass("customSlectDDDisabled");
		$("#dropDownAssignRelationCreateExtCell").val(getUiProps().MSG0282);
		$("#selectRelationDropDownError").text("");
	});

	$("#rdExternalCell").click(function() {
		$("#rowMyCell").hide();
		$("#rowCellURL").show();
		$('#ddCellListErrorMsg').html('');
		$('#chkBoxCreateExtCell').attr('checked', false);
		$("#dropDownAssignRelationCreateExtCell").attr('disabled', true);
		$("#dropDownAssignRelationCreateExtCell").addClass("customSlectDDDisabled");
		$("#dropDownAssignRelationCreateExtCell").val(getUiProps().MSG0282);
		$("#selectRelationDropDownError").text("");
	});
	
	$("#btnRegister").click(function() {
		objExternalCell.createExternalCell();
	});
};
externalCell.prototype.initEditExternalCell = function() {
	$("#rowEditCellURL").show();
	$('#ddCellListEditErrorMsg').html('');
	$("#txtEditUrl").blur(
		function() {
			var objExternalCell = new externalCell();
			var schemaURL = $("#txtEditUrl").val();
			if (objExternalCell.getExternalCellInfo(schemaURL) == false) {
				document.getElementById("externalCellURLEditErrorMessage").innerHTML = getUiProps().MSG0302;
				cellpopup.showErrorIcon('#txtEditUrl');
				return false;
			}
			var extCellName = "";
			var extCellURL = "";
			objCommon.getCell(schemaURL).done(function(cellObj, status, xhr) {
				extCellName = cellObj.cell.name;
				let ver = xhr.getResponseHeader("x-personium-version");
        		if (ver >= "1.7.1") {
        			extCellURL = cellObj.unit.url;
        		} else {
        			var extCellInfo = objExternalCell.getExternalCellInfo(schemaURL);
        			extCellURL = extCellInfo[0];
        		}
			}).fail(function(xmlObj) {
				if (xmlObj.status == "200" || xmlObj.status == "412") {
					var extCellInfo = objExternalCell.getExternalCellInfo(schemaURL);
					extCellName = extCellInfo[1];
					extCellURL = extCellInfo[0];
				}
			}).always(function() {
				if (objBox.validateSchemaURL(schemaURL,
						"externalCellURLEditErrorMessage","#txtEditUrl"))
					if (objCommon.validateURL(extCellURL,
							"externalCellURLEditErrorMessage", "#txtEditUrl")) 
						if (objExternalCell.validateExternalCellName(extCellName))
							objCommon.doesUrlContainSlash(schemaURL, "externalCellURLEditErrorMessage","#txtEditUrl",getUiProps().MSG0285);
			});
		});
}
externalCell.prototype.setCellControlsInfoTabValues = function(ccname, etag, cccreatedat, ccupdatedat, ccurl) {   
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

/**
 * The purpose of this function is to change css dynamicaly after
 * scrollbar appearence in grid
 */
externalCell.prototype.applyScrollCssOnExtCellGrid = function() {
	var tbodyObject = document.getElementById("entityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainExternalCellTable td:eq(2)").css("width", '24.1%');
		$("#mainExternalCellTable td:eq(3)").css("width", '15.1%');
		$("#mainExternalCellTable td:eq(4)").css("width", '15.1%');
	}
};

/**
 * The purpose of this method is to get the details of relations
 * mapped with the particular external cell.
 * @param externalCellURI
 * @returns
 */
externalCell.prototype.getRelationDetailsLinkedToExternalCell = function(externalCellURI) {
		var relationList = [];
		var SOURCE = "ExtCell";
		var DESTINATION= "Relation";
		var encodedExternalCellURI = encodeURIComponent(externalCellURI);
		var objExternalCell = new externalCell();
		var accessor = objExternalCell.getAccessor();	
		var context = objExternalCell.initializeAbstractDataContext();
		var objLinkMgr = objCommon.initializeLinkManager(accessor, context);
		var response = objLinkMgr.retrieveAccountRoleLinks(context,
				SOURCE,	DESTINATION, encodedExternalCellURI,"", "");
		var responseBody = response.bodyAsJson();
		var json = responseBody.d.results;
		if (response.getStatusCode() == 200) {
			for (var count=0; count<json.length; count++) {
				var obj = json[count];
				var relation = objCommon.getRelationNameFromURI(obj.uri);
				relationList.push(" "+relation);
			}
		}
		return relationList;
	};
	
/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
externalCell.prototype.retrieveCellCount = function() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objCellManager = new _pc.CellManager(accessor);
	var uri = objCellManager.getUrl();
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * Following method empties create external cell pop up.
 */
externalCell.prototype.emptyCreateExtCellPopUp = function () {
	$('#txtUrl').val('');
	$("#rdMyCell").attr('checked', 'checked');
	$("#rowMyCell").show();
	$("#rowCellURL").hide();
	$('.asidePopupErrorMessageCommon').html('');
	$('#chkBoxCreateExtCell').attr('checked', false);
	$('#dropDownAssignRelationCreateExtCell').addClass("customSlectDDDisabled");
	$("#dropDownAssignRelationCreateExtCell").attr('disabled', true);
	objCommon.removePopUpStatusIcons('#txtUrl');
	//objCommon.removePopUpStatusIcons('#txtPassword');
	//objCommon.removePopUpStatusIcons('#txtRePassword');
};

/**
 * Following method closes edit pop up window.
 */
externalCell.prototype.closeEditPopUpWindow = function () {
    objExtCell.emptyEditExternalCellPopUp();
    $('#externalCellEditModalWindow, .window').hide(0);
 };

 /**
 * Following function clears edit account pop up elements.
 */
externalCell.prototype.emptyEditExternalCellPopUp = function () {
	$("#rdExternalCell").val("");
	objCommon.removePopUpStatusIcons('#txtUrl');
};

/**
 * Following method binds external cell dropdown.
 */
externalCell.prototype.bindRelationBoxDropDown = function () {
	var message = getUiProps().MSG0226;
	var mainBox = getUiProps().MSG0039;
	objCommon.refreshDropDown('dropDownAssignRelationCreateExtCell', message);
	var jsonString = objExtCell.getRelationListForSelectedCell();
	var select = document.getElementById('dropDownAssignRelationCreateExtCell');
	for (var count = 0; count < jsonString.length; count++) {
		var option = document.createElement("option");
		var objRelation = jsonString[count];
		option.id = objRelation.__metadata.etag;
		var boxName = objRelation['_Box.Name'];
		option.innerHTML = objRelation.Name + objCommon.startBracket + boxName + objCommon.endBracket;
		if (boxName == null) {
			option.innerHTML = objRelation.Name + objCommon.startBracket + mainBox + objCommon.endBracket;
		}
		option.title = option.innerHTML;
		option.value = option.innerHTML;
		var tooltipRoleBoxName = objCommon.getShorterName(option.innerHTML, 17);
		option.text = tooltipRoleBoxName ;
		select.appendChild(option);
	}
};

/**
 * Following method gets relation list. 
 * @returns
 */
externalCell.prototype.getRelationListForSelectedCell = function () {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
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
 * Following method checks dropdown validations on blur event. 
 */
$("#ddlCellList").blur(function() {
	var selectCellMessage = getUiProps().MSG0283;
	objCommon.validateDropDownValue('ddlCellList', '#ddCellListErrorMsg', selectCellMessage);  
});

/**
 * Following method checks URL validations on blur event.
 */
$("#txtUrl")
		.blur(
				function() {
					var objExternalCell = new externalCell();
					var schemaURL = objExternalCell.getSchemaUrl();
					if (objExternalCell.getExternalCellInfo(schemaURL) == false) {
						document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0302;
						cellpopup.showErrorIcon('#txtUrl');
						return false;
					}
					var extCellURL = "";
					objCommon.getCell(schemaURL).done(function(cellObj, status, xhr) {
						let ver = xhr.getResponseHeader("x-personium-version");
						extCellURL = cellObj.cell.url;						
					}).fail(function(xmlObj) {
						if (xmlObj.status == "200" || xmlObj.status == "412") {
							extCellURL = schemaURL;
						}
					}).always(function() {
						if (extCellURL == "") {
							cellpopup.showErrorIcon('#txtUrl');
							document.getElementById("externalCellURLErrorMesage").innerHTML = getUiProps().MSG0434;
							return false;
						}

						objCommon.doesUrlContainSlash(schemaURL, "externalCellURLErrorMesage","#txtUrl",getUiProps().MSG0285);									
					})
});


/**
 * Following method checks dropdown (assignation) validations on blur event. 
 */
$("#dropDownAssignRelationCreateExtCell").blur(function() {
	objCommon.validateDropDownValue('dropDownAssignRelationCreateExtCell', '#selectRelationDropDownError', getUiProps().MSG0083);
});

function radioBtnThisFocusOnExternalCell() {
	$("#lblThisRadioExtCell").css("outline","-webkit-focus-ring-color auto 5px");
}

function radioBtnThisBlurOnExternalCell() {
	$("#lblThisRadioExtCell").css("outline","none");
}

function radioBtnOthereFocusOnExternalCell() {
	$("#lblOtherRadioExtCell").css("outline","-webkit-focus-ring-color auto 5px");
}

function radioBtnOtherBlurOnExternalCell() {
	$("#lblOtherRadioExtCell").css("outline","none");
}

function checkboxFocusOnExtCell() {
	$("#lblAssignrelationExtCell").css("outline","-webkit-focus-ring-color auto 5px");
}

function checkboxBlurOnExtCell() {
	$("#lblAssignrelationExtCell").css("outline","none");
}

/**
 * Following method fetches all the external cell data.
 * @returns json
 */
externalCell.prototype.retrieveAllExternalCellData = function () {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var totalRecordCount = objExtCell.retrieveRecordCount();
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objExtCellManager = new _pc.ExtCellManager(accessor);
	var uri = objExtCellManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top="+ totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

$(document).ready (
		function() {
			var objExternalCell = new externalCell();
			objExternalCell.loadExternalCellPage();
			objCommon.creatEntityHoverEffect();
			objCommon.sortByDateHoverEffect();
			setDynamicGridHeight();
			$(window).resize(function () {
				if ($('#dvemptyTableMessage').is(':visible')) {
					objCommon.setDynamicPositionOfEmptyMessage();
				}
			});
	});
