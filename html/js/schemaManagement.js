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
function schemaManagement(){}

var uSchemaManagement = new schemaManagement();
schemaManagement.prototype.countDeleteRecords = 0;
schemaManagement.prototype.lstFromAscEnd = null;
schemaManagement.prototype.lstToAscEnd = null;
schemaManagement.prototype.lstToEntityType = null;
schemaManagement.prototype.lstFromMultiplicity = null;
schemaManagement.prototype.lstToMultiplicity = null;
schemaManagement.prototype.totalCountAssociationEndGridView = 0;

/**
 * The purpose of this method is to open List View tab under Schema Management
 */
schemaManagement.prototype.openListViewTab = function(){
	sessionStorage.odataTabName = "listView";
	document.getElementById("listView").style.display = "block";
	document.getElementById("associationView").style.display = "none";
	$("#associationViewTab").removeClass("mainNavEntitySelected");
	$("#listViewTab").addClass("mainNavEntitySelected");
	uEntityTypeProperty.createPropertyTable(uEntityTypeOperations.getSelectedEntityType());
};

/**
 * The purpose of this method is to open Association View tab under Schema Management
 */
schemaManagement.prototype.openAssociationViewTab = function(){
	sessionStorage.odataTabName = "associationView";
	document.getElementById("listView").style.display = "none";
	document.getElementById("associationView").style.display = "block";
	$("#associationViewTab").addClass("mainNavEntitySelected");
	$("#listViewTab").removeClass("mainNavEntitySelected");
};

/**
 * The purpose of this method is to clear input fields in Add Association PopUp
 */
schemaManagement.prototype.clearPopUpFields = function(){
	uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", "");
	uSchemaManagement.setHTMLValue("popupFromAssEndTypeErrorMsg", "");
	uSchemaManagement.setHTMLValue("popupToEntityTypeNameErrorMsg", "");
	uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", "");
	uSchemaManagement.setHTMLValue("popupToAssEndTypeErrorMsg", "");
	document.getElementById("txtFromAssEnd").value = "";
	document.getElementById("txtToAssEnd").value = "";
	$("#ddFromAssEndTypes").val("Select");
	$("#toEntityTypeName").val("Select");
	$("#ddToAssEndTypes").val("Select");
	uEntityTypeProperty.removeStatusIcons('#txtFromAssEnd');
	uEntityTypeProperty.removeStatusIcons('#txtToAssEnd');
};

/**
 * The purpose of this method is to bind to entity type name dropdown 
 */
schemaManagement.prototype.bindEntityTypeDropDown = function(){
	var entityTypeNameList = uEntityTypeOperations.fetchEntityTypeNameList();
	var noOfEntityTypeNames = entityTypeNameList.length;
	var options = "<option title='Select'>Select</option>";
	for(var index = 0; index < noOfEntityTypeNames; index++){
		var shorterETypeName = objCommon.getShorterEntityName(entityTypeNameList[index]);
		options = options + "<option title='"+ entityTypeNameList[index] +"'>" + shorterETypeName + "</option>";
	}
	$("#toEntityTypeName").html(options);
};

/**
 * The purpose of this method is to perform validations for first association end creation
 * @param fromAssEnd
 * @param fromAssType
 * @returns {Boolean}
 */
schemaManagement.prototype.validateFromAssociationFields = function(fromAssEnd, fromAssType){
	var result = true;
	var letters = /^[0-9a-zA-Z-_]+$/;
	var specialCharacter = /^[-_]*$/;
	var lenFromAssEnd = fromAssEnd.length;
	//var objOdataCommon = new odataCommon();
	uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", "");
	uSchemaManagement.setHTMLValue("popupFromAssEndTypeErrorMsg", "");
	if (lenFromAssEnd < 1 || fromAssEnd == undefined || fromAssEnd == null
			|| fromAssEnd == "") {
		uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0088);
		result = false;
		cellpopup.showErrorIcon('#txtFromAssEnd');
	} else if (lenFromAssEnd > 128) {
		uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0089);
		result = false;
		cellpopup.showErrorIcon('#txtFromAssEnd');
	} else if (lenFromAssEnd != 0 && !(fromAssEnd.match(letters))) {
		uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0023);
		result = false;
		cellpopup.showErrorIcon('#txtFromAssEnd');
	} else if(lenFromAssEnd != 0 && (specialCharacter.toString().indexOf(fromAssEnd.substring(0, 1)) >= 0)) {
		uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0090);
		result = false;
		cellpopup.showErrorIcon('#txtFromAssEnd');
	} else if(fromAssType == "Select"){
		uSchemaManagement.setHTMLValue("popupFromAssEndTypeErrorMsg", getUiProps().MSG0091);
		cellpopup.showValidValueIcon('#txtFromAssEnd');
		result = false;
	}
	return result;
};

/**
 * The purpose of this method is to validate to association end fields as specified.
 * @param toEntityTypeName
 * @param toAssEnd
 * @param toAssType
 * @returns {Boolean}
 */
schemaManagement.prototype.validateToAssociationFields = function(toEntityTypeName, toAssEnd, toAssType, fromAscType){
	var result = true;
	var letters = /^[0-9a-zA-Z-_]+$/;
	var specialCharacter = /^[-_]*$/;
	var max_limit = 128;
	var lenToAssEnd = toAssEnd.length;
	//var objODataCommon = new odataCommon();
	uSchemaManagement.setHTMLValue("popupToEntityTypeNameErrorMsg", "");
	uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", "");
	uSchemaManagement.setHTMLValue("popupToAssEndTypeErrorMsg", "");
	if(toEntityTypeName == "Select"){
		uSchemaManagement.setHTMLValue("popupToEntityTypeNameErrorMsg", getUiProps().MSG0101);
		result = false;
	} else if (lenToAssEnd < 1 || toAssEnd == undefined || toAssEnd == null
			|| toAssEnd == "") {
		uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0088);
		result = false;
		cellpopup.showErrorIcon('#txtToAssEnd');
	} else if (lenToAssEnd > max_limit) {
		uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0089);
		result = false;
		cellpopup.showErrorIcon('#txtToAssEnd');
	} else if (lenToAssEnd != 0 && !(toAssEnd.match(letters))) {
		uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0023);
		result = false;
	} else if(lenToAssEnd != 0 && (specialCharacter.toString().indexOf(toAssEnd.substring(0, 1)) >= 0)) {
		uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0090);
		result = false;
		cellpopup.showErrorIcon('#txtToAssEnd');
	} else if(toAssType == "Select"){
		uSchemaManagement.setHTMLValue("popupToAssEndTypeErrorMsg", getUiProps().MSG0091);
		result = false;
		cellpopup.showValidValueIcon('#txtToAssEnd');
	} else if(toAssType == "1" && fromAscType == "1"){
		uSchemaManagement.setHTMLValue("popupToAssEndTypeErrorMsg", getUiProps().MSG0102);
		result = false;
		cellpopup.showValidValueIcon('#txtToAssEnd');
	}
	return result;
};

/**
 * The purpose of this method is to create association end one.
 * @param fromAssEnd
 * @param fromAssType
 * @returns {Boolean}
 */
schemaManagement.prototype.createAssociationEndOne = function(fromAssEnd, fromAssType){
	var fromEntityTypeName = document.getElementById("fromEntityTypeName").title;
	var baseUrl = getClientStore().baseURL;
	 if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var colName= sessionStorage.collectionName;
	var path = sessionStorage.selectedCollectionURL;//baseUrl+cellName+"/"+boxName + "/" + colName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var json = {"Name":fromAssEnd, "_EntityType.Name":fromEntityTypeName, "Multiplicity":fromAssType};
	var objjAssociationEnd = new _pc.AssociationEnd(accessor, json, path);
	var objAssociationEndManager = new _pc.AssociationEndManager(accessor, objjAssociationEnd);
	var response = objAssociationEndManager.create(objjAssociationEnd);
	return true;
};

/**
 * The purpose of this method is to create second association with link
 * @param toEntityTypeName
 * @param toAssEnd
 * @param toAssType
 * @param fromEntityTypeName
 * @param fromAssEnd
 * @returns response
 */
schemaManagement.prototype.createAssociationTwoWithLink = function(toEntityTypeName, toAssEnd, toAssType, fromEntityTypeName, fromAssEnd){
	var baseUrl = getClientStore().baseURL;
	 if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var colName= sessionStorage.collectionName;
	var path = sessionStorage.selectedCollectionURL;//baseUrl+cellName+"/"+boxName + "/" + colName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var json = {"Name":toAssEnd, "Multiplicity":toAssType,  "_EntityType.Name":toEntityTypeName};
	var objjAssociationEnd = new _pc.AssociationEnd(accessor, json, path);
	var objAssociationEndManager = new _pc.AssociationEndManager(accessor, objjAssociationEnd);
	var response = objAssociationEndManager.createNavProList(objjAssociationEnd, fromEntityTypeName, fromAssEnd);
	return response;
};

/**
 * The purpose of this method is to check if association name already exists
 * @param entityTypeName
 * @param ascEnd
 * @returns
 */
schemaManagement.prototype.associationAlreadyExists = function(entityTypeName, ascEnd){
	var baseUrl = getClientStore().baseURL;
	 if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var boxName = sessionStorage.boxName;
	var colName= sessionStorage.collectionName;
	var path = sessionStorage.selectedCollectionURL;//baseUrl+cellName+"/"+boxName + "/" + colName;
	var json = "";
	var objjAssociationEnd = new _pc.AssociationEnd(accessor, json, path);
	var objAssociationEndManager = new _pc.AssociationEndManager(accessor, objjAssociationEnd);
	var response = null;
	try {
		 response = objAssociationEndManager.retrieve(ascEnd, entityTypeName);
	} catch (exception) {
		response = true;
	}
	return response;
};

/**
 * The purpose of this method is to update schematic diagram and association table
 * after new association creation.
 */
schemaManagement.prototype.updateAssociationPage = function(){
	uSchemaManagement.createSchematicDiagram(function() {
		uSchemaManagement.createEditModeAssociationTable();
	});
	if ($("#associationEndViewIcon").hasClass("associationEndViewIconSelected")) {
		uSchemaManagement.clickAssociationEndViewMode();
	} else if ($("#associationEndGridIcon").hasClass("associationEndGridIconSelected")) {
		uSchemaManagement.clickAssociationEndGridMode();
	}
};

/**
 * The purpose of this method is to create a new association.
 */
schemaManagement.prototype.createAssociation = function(){
	showSpinner("modalSpinnerSchemaManagement");
	//var objODataCommon = new odataCommon();
	var fromAssEnd = document.getElementById("txtFromAssEnd").value;
	var fromAssType = $("#ddFromAssEndTypes").val();
	var fromEntityTypeName = document.getElementById("fromEntityTypeName").title;
	if(uSchemaManagement.validateFromAssociationFields(fromAssEnd, fromAssType)){
		cellpopup.showValidValueIcon('#txtFromAssEnd');
		var toEntityTypeName = $("#toEntityTypeName").find("option:selected").attr("title");
		var toAssEnd = document.getElementById("txtToAssEnd").value;
		var toAssType = $("#ddToAssEndTypes").val();
		if(uSchemaManagement.validateToAssociationFields(toEntityTypeName, toAssEnd, toAssType, fromAssType)){
			cellpopup.showValidValueIcon('#txtToAssEnd');
			var ascOneDoesNotExists = uSchemaManagement.associationAlreadyExists(fromEntityTypeName, fromAssEnd);
			if(ascOneDoesNotExists != true){
				uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0092);
				removeSpinner("modalSpinnerSchemaManagement");
				cellpopup.showErrorIcon('#txtFromAssEnd');
				return false;
			}else{
				var ascLinkDoesNotExists = uSchemaManagement.associationAlreadyExists(toEntityTypeName, toAssEnd);
				if(ascLinkDoesNotExists != true){
					uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0092);
					removeSpinner("modalSpinnerSchemaManagement");
					cellpopup.showErrorIcon('#txtToAssEnd');
					return false;
				}else{
					var ascOneCreateSuccess = uSchemaManagement.createAssociationEndOne(fromAssEnd, fromAssType);
					if(ascOneCreateSuccess){
						var response = uSchemaManagement.createAssociationTwoWithLink(toEntityTypeName, toAssEnd, toAssType, fromEntityTypeName, fromAssEnd);
						var responseStatus = response.getStatusCode();
						//var objODataCommon = new odataCommon();
						if(responseStatus == 201){
							uSchemaManagement.updateAssociationPage();
							var message = getUiProps().MSG0382;
							objCommon.displaySuccessMessage(message, '#createAssociationModal', "222px", "crudOperationMessageBlock");
							//objODataCommon.displaySuccessMessage("#createAssociationModal", message, "");
						} else if(responseStatus == 409){
							var message = getUiProps().MSG0383;
							objCommon.displayErrorMessage (message, '#createAssociationModal', "310px", "crudOperationMessageBlock");
							//objODataCommon.displayErrorMessage("#createAssociationModal", message, "");
						}
						else{
							var message = getUiProps().MSG0384;
							objCommon.displayErrorMessage (message, '#createAssociationModal', "310px", "crudOperationMessageBlock");
							//objODataCommon.displayErrorMessage("#createAssociationModal", message, "");
						}
					}
				}
			}
		}
	}
	removeSpinner("modalSpinnerSchemaManagement");
};

/**
 * The purpose of this method is to toggle edit/view mode button
 */
schemaManagement.prototype.toggleMode = function(){
	if(document.getElementById("toggleButton").value == "Edit Mode"){
		document.getElementById("toggleButton").value = "View Mode";
		document.getElementById("toggleButton").title = "View Mode";
		$(".tableMode").show();
		$(".diagramMode").hide();
	}else if(document.getElementById("toggleButton").value == "View Mode"){
		document.getElementById("toggleButton").value = "Edit Mode";
		document.getElementById("toggleButton").title = "Edit Mode";
		$(".tableMode").hide();
		$(".diagramMode").show();
		var noOfAsc = lstFromAscEnd.length;
		if(noOfAsc > 0){
			document.getElementById("diagramHead").style.display = "block";
		}else{
			document.getElementById("diagramHead").style.display = "none";
		}
	}
};

/********************* Association View Start *******************************/

/**
 * The purpose of this method is to create and initialize AssociationEndManager.
 */
schemaManagement.prototype.createAssociationManager = function(){
	var baseUrl = getClientStore().baseURL;
	 if (!baseUrl.endsWith("/")) {
			baseUrl += "/";
		}
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var collectionName= sessionStorage.collectionName;
	var path = sessionStorage.selectedcellUrl + boxName + "/" + collectionName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objDCCollection = new _pc.PersoniumCollection(accessor , path);
	var objAssociationEndManager = new _pc.AssociationEndManager(accessor, objDCCollection);
	return objAssociationEndManager;
};

/**
 * The purpose of this function is to return response after particular API call
 * @param entityTypeName
 */
schemaManagement.prototype.retrieveAPIResponse = function (entityTypeName, mode, associationEndName, toEntityTypeName, toAssociationName) {
	var response = null;
	var baseUrl = getClientStore().baseURL;
	 if (!baseUrl.endsWith("/")) {
			baseUrl += "/";
		}
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var collectionName= sessionStorage.collectionName;
	var path = sessionStorage.selectedCollectionURL;//baseUrl+cellName+"/"+boxName + "/" + collectionName;
	//var json = {"Name":associationEndName, "_EntityType.Name":entityTypeName};
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objDCCollection = new _pc.PersoniumCollection(accessor , path);
	//var objJassociationEnd = new _pc.AssociationEnd(accessor, json, path);
	var objAssociationEndManager = new _pc.AssociationEndManager(accessor, objDCCollection);
	if (mode == "fromEditMode") {
		response = objAssociationEndManager.retrieveAssociationList(entityTypeName, associationEndName);
	} 
	if(mode == "toEditMode") {
		response = objAssociationEndManager.retrieveAssociationList(entityTypeName, associationEndName);
	} 
	if(mode == "multiplicity") {
		response = objAssociationEndManager.retrieve(associationEndName, entityTypeName);
	}	
	if(mode == "deleteLinkAssociation") {
		response = objAssociationEndManager.delAssociationLink(associationEndName, entityTypeName, toAssociationName, toEntityTypeName);
	}
	if(mode == "deleteAssociation") {
		response = objAssociationEndManager.del(associationEndName,entityTypeName);
	}
	if(mode === "totalRecordCount") {
		response = uSchemaManagement.retrieveRecordCountAssociationEnd(entityTypeName, accessor);
	}
	if(mode === "fromEditModeChunked") {
		response = uSchemaManagement.retrieveChunkedData(entityTypeName, objCommon.minRecordInterval, objCommon.noOfRecordsToBeFetched, accessor);
	}
	return response;
};

/**
 * Th epurpose of this method is to create view for association table in edit mode as per paginatiom
 * @param json
 * @param entityTypeName
 * @param recordSize
 */
schemaManagement.prototype.createChunkedEditModeTable = function(json, entityTypeName, recordSize, totalRecordCount){
	$('#chkSelectallAssocEditMode').attr('checked', false);
	var dynamicRows = "";
	//$("#dvemptyEditAssociationTableMessage").hide();
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	//var maxLimit = (objCommon.MAXROWS+recordSize) < (jsonLength) ? (objCommon.MAXROWS+recordSize) : jsonLength;
	var associationEditModeRowCount = 0;
	for (var count = recordSize; count < totalRecordCount; count++) {
		var obj = json[count];
		var fromEntityTypeName = obj["_EntityType.Name"];
		var fromAssociationName = obj.Name;
		var fromMultiplicity = obj.Multiplicity;
		var toAssociationEndUri = uSchemaManagement.retrieveAssociationLink(fromEntityTypeName, fromAssociationName);
		var toEntityTypeName = uSchemaManagement.getEntityTypeNameFromURI(toAssociationEndUri) ;
		var toAssociationEndName = uSchemaManagement.getAssociationEndNameFromURI(toAssociationEndUri);
		var multiplicity = '';
		if (toEntityTypeName != undefined) {
		multiplicity = uSchemaManagement.retrieveMultiplicity(toEntityTypeName, toAssociationEndName);
		}
		if (toEntityTypeName == undefined) {
			toEntityTypeName = "";
		}
		if (toAssociationEndName == undefined) {
			toAssociationEndName = "";
		}
		var collectionURL = "'" + sessionStorage.selectedCollectionURL + "'";
		dynamicRows +='<tr id ="rowidAssocEditMode'+ associationEditModeRowCount +'" class = "dynamicFromAssociationTable" onclick="objCommon.rowSelect(this,'+ "'rowidAssocEditMode'" +','+ "'chkBoxAssocEditMode'"+','+ "'row'" +','+ "'associationEndDeleteIcon'" +','+ "'chkSelectallAssocEditMode'" +','+ associationEditModeRowCount +',' + totalRecordCount + ','+ "'btnEditAssociationEndGrid'" + ','+"''"+','+"''"+','+"''"+','+"'mainAssociationTable'"+', '+collectionURL+');">';
		dynamicRows = uSchemaManagement.createRowsForEditModeAssociationTable(dynamicRows, count, fromEntityTypeName, fromAssociationName, fromMultiplicity, recordSize, toEntityTypeName, 
			toAssociationEndName, multiplicity, associationEditModeRowCount);
		associationEditModeRowCount++;
		}
		if (jsonLength >0) {
			$("#mainAssociationTable thead tr").addClass('mainTableHeaderRow');
			$("#mainAssociationTable tbody").addClass('mainTableTbody');
			uSchemaManagement.setDynamicAssociationEndGridModeHeight();
		}
		if (dynamicRows != "") {
			$("#mainAssociationTable tbody").html(dynamicRows);
			//uSchemaManagement.alternateRowColor();
		}
};

/**
 * The purpose of this function is to create from Association table(left view)
 * @param entityTypeName
 */
schemaManagement.prototype.createEditModeAssociationTable = function () {
	//var MAXROWS = 10;
	//uSchemaManagement.refreshEditModeTable();
	$("#associationEndGridTbody").scrollTop(0);
	var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
	//var totalRecordCount = uSchemaManagement.retrieveAPIResponse(entityTypeName, "totalRecordCount");
	var json = sessionStorage.dataSetAssociationEditMode;//uSchemaManagement.retrieveAPIResponse(entityTypeName, "fromEditModeChunked");
	var totalRecordCount = 0;
	if (typeof json != "undefined") {
		if(typeof json === "string"){
			json = JSON.parse(json);
			if(typeof json === "string"){
				json = JSON.parse(json);
			}
		}
		totalRecordCount = json.length;
		uSchemaManagement.totalCountAssociationEndGridView = totalRecordCount;
	}
	if (totalRecordCount > 0) {
		$('#chkSelectallAssocEditMode').attr('disabled', false);
		document.getElementById("dvemptyAscEndViewMode").style.display = "none";
		var recordSize = 0;
		uSchemaManagement.createChunkedEditModeTable(json, entityTypeName, recordSize, totalRecordCount);
			/*var tableID = $('#mainAssociationTable');
			var dvDisplayTable = "#dvEditModeAssociationTable";
			var associationManager = uSchemaManagement.createAssociationManager();
			objCommon.createPagination(totalRecordCount, "",
					objCommon.MAXROWS, tableID, dvDisplayTable,uSchemaManagement, entityTypeName, json, 
					uSchemaManagement.createChunkedEditModeTable, 1, "associations");*/
		} else {
			$('#chkSelectallAssocEditMode').attr('disabled', true);
			$('#associationEndGridTbody').empty();
			document.getElementById("dvemptyAscEndViewMode").style.display = "block";
			uSchemaManagement.setDynamicMarginTopEmptyAssociationEndGridModeMessage();
	}

};

/**
 * The purpose of this function is to create rows for 
 * FromAssociationTable.
 * @param dynamicRows
 * @param count
 * @param fromEntityTypeName
 * @param fromAssociationName
 * @param fromMultiplicity
 * @param shorterFromEntityName
 * @param shorterFromAssociationName
 * @param recordSize
 */
schemaManagement.prototype.createRowsForEditModeAssociationTable = function (dynamicRows, count, fromEntityTypeName, fromAssociationName, fromMultiplicity, recordSize, toEntityTypeName, toAssociationEndName, multiplicity,associationEditModeRowCount) {
	var editModeTableData = fromEntityTypeName +"~"+ fromAssociationName +"~"+ toEntityTypeName +"~"+ toAssociationEndName;
	dynamicRows += '<td class = "col1" style="padding: 0px 10px 0px 10px"><input  type="checkbox" id="chkBoxAssocEditMode'+associationEditModeRowCount+'" class="case cursorHand regular-checkbox big-checkbox" name="case" value = "'+editModeTableData+'"/><label for="chkBoxAssocEditMode'+associationEditModeRowCount+'" class="customChkbox checkBoxLabel"></label></td>';
	dynamicRows +='<td class = "col2" style="max-width: 100px" onclick=""><div class = "mainTableEllipsis"><label title = "'+fromEntityTypeName+'" class="cursorPointer">'+fromEntityTypeName+'</label></div></td>';
	dynamicRows +='<td class = "col3" style="max-width: 100px"><div class = "mainTableEllipsis"><label title = "'+fromAssociationName+'" class="cursorPointer">'+fromAssociationName+'</label></div></td>';
	dynamicRows +='<td width="240px" class = "col4" style="padding-left: 3.5%" title = "'+fromMultiplicity+'" onclick="">'+fromMultiplicity+'</td>';
	dynamicRows +='<td class = "col5" style="max-width: 100px"><div class = "mainTableEllipsis"><label title = "'+toEntityTypeName+'" class="cursorPointer">'+toEntityTypeName+'</label></div></td>';
	dynamicRows +='<td class = "col6" style="max-width: 100px"><div class = "mainTableEllipsis"><label title = "'+toAssociationEndName+'" class="cursorPointer">'+toAssociationEndName+'</label></div></td>';
	dynamicRows +='<td width="240px" class = "col7" style="padding-left: 3.5%" title = "'+multiplicity+'" onclick="">'+multiplicity+'</td>';
	dynamicRows +="</tr>";
	return dynamicRows;
};

/**
 * The purpose of this function is to check parent check box on selection of all
 * child check boxes.
 * @param cBox
 */
schemaManagement.prototype.checkAll = function (cBox) {
	var buttonId = '#associationEndDeleteIcon';
	//objCommon.checkBoxSelect(cBox, buttonId);
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'chkBoxAssocEditMode', uSchemaManagement.totalCountAssociationEndGridView, document.getElementById("chkSelectallAssocEditMode"));
	objCommon.showSelectedRow(document.getElementById("chkSelectallAssocEditMode"),"row","rowidAssocEditMode");
};

/**
 * The purpose of this function is to retrieve association link against one
 * association pair
 * @param entityTypeName
 * @param associationEndName
 */
schemaManagement.prototype.retrieveAssociationLink = function (entityTypeName, associationEndName) {
	var toAssociationEndUri = null;
	var json = uSchemaManagement.retrieveAPIResponse(entityTypeName, "toEditMode", associationEndName);
	var recordSize = json.length;
	if (recordSize > 0) {
		for (var count = 0; count < recordSize; count++) {
			var obj = json[count];
			 toAssociationEndUri = obj.uri;
		}
	}
	return toAssociationEndUri;
};

/**
 * The purpose of this function is to retrieve multiplicity of 
 * one association pair
 * @param entityTypeName
 * @param associationEndName
 */
schemaManagement.prototype.retrieveMultiplicity = function (entityTypeName, associationEndName) {
	var json = uSchemaManagement.retrieveAPIResponse(entityTypeName, "multiplicity", associationEndName);
	var multiplicity = json.multiplicity;
	return multiplicity;
};

/**
 * The purpose of this function is to implement alternate row  
 * color feature in table
 */
schemaManagement.prototype.alternateRowColor = function () {
	$("#mainAssociationTable tr:odd").css("background-color", "#F4F4F4");
	$(".selectProfileRow").css("background-color", "#dfdfdf");
};

/**
 * The purpose of this function is to refresh edit   
 * mode table
 */
schemaManagement.prototype.refreshEditModeTable = function () {
	$(".dynamicFromAssociationTable").remove();
	$(".pagination").remove();
	document.getElementById("dvemptyAsCListEditMode").style.display = "none";
	objCommon.disableButton('#associationEndDeleteIcon');
};

/**
 * The purpose of this function is to retrieve associationEndName from URI.
 * @param uri
 */
schemaManagement.prototype.getAssociationEndNameFromURI = function(uri) {
	if (uri != null || uri != undefined) {
		var ASSOCIATIONEND = "Name";
		var noOfCharacters = ASSOCIATIONEND.length;
		var associationEndIndex = uri.indexOf("Name");
		var entityTypeIndex = uri.indexOf("_EntityType.Name");
		var associationEndFromURI = uri.substring(associationEndIndex + noOfCharacters, entityTypeIndex);
		var associationEndName = objCommon.getEnityNameAfterRemovingSpecialChar(associationEndFromURI);
		return associationEndName;
	}
};

/**
 * The purpose of this function is to retrieve entityType name from URI.
 * @param uri
 */
schemaManagement.prototype.getEntityTypeNameFromURI = function(uri) {
	if (uri != null || uri != undefined) {
		var ENTITYTYPE = "_EntityType.Name";
		var noOfCharacters = ENTITYTYPE.length;
		var entityTypeIndex = uri.indexOf("_EntityType.Name");
		var entityTypeNameFromURI = uri.substring(entityTypeIndex
				+ noOfCharacters, uri.length - 1);
		var entityTypeName = objCommon
				.getEnityNameAfterRemovingSpecialChar(entityTypeNameFromURI);
		return entityTypeName;
	}
};

/**
 * The purpose of this method is to get the association ends list mapped with each other 
 * for view mode- Schematic Diagram
 */
schemaManagement.prototype.fetchAssociationEndsList = function(){
	lstFromAscEnd = new Array();
	lstToAscEnd = new Array();
	lstToEntityType = new Array();
	lstFromMultiplicity = new Array();
	lstToMultiplicity = new Array();
	var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
	var json = uSchemaManagement.retrieveAPIResponse(entityTypeName, "fromEditMode");
	var sortJSONString = objCommon.sortByKey(json, '__updated');
	sessionStorage.dataSetAssociationEditMode = JSON.stringify(json);
	var recordSize = sortJSONString.length;
	if (recordSize > 0) {
		for (var count = 0; count < recordSize; count++) {
			var obj = sortJSONString[count];
			var fromEntityTypeName = obj["_EntityType.Name"];
			var fromAssociationName = obj.Name;
			var fromMultiplicity = obj.Multiplicity;
			var toAssociationEndUri = uSchemaManagement.retrieveAssociationLink(fromEntityTypeName, fromAssociationName);
			var toAssociationEndName = uSchemaManagement.getAssociationEndNameFromURI(toAssociationEndUri);
			if(toAssociationEndName != undefined){
				lstToAscEnd.push(toAssociationEndName);
			}
			var toEntityTypeName = uSchemaManagement.getEntityTypeNameFromURI(toAssociationEndUri) ;
			if(toEntityTypeName != undefined){	
				lstToEntityType.push(toEntityTypeName);
			}
			if(toEntityTypeName != undefined && toAssociationEndName != undefined){
				var toMultiplicity = uSchemaManagement.retrieveMultiplicity(toEntityTypeName, toAssociationEndName);
				lstToMultiplicity.push(toMultiplicity);
			}
			if(toAssociationEndName != undefined && toEntityTypeName != undefined){
				lstFromAscEnd.push(fromAssociationName);
				lstFromMultiplicity.push(fromMultiplicity);
			}
		}
	}
};

/**
 * The purpose of this method is to create from association end view in schematic diagram
 * @param index
 * @returns {String}
 */
schemaManagement.prototype.createDiagLeftPanel = function(index){
	var fromAscEnd = "";
	//var shorterFromAscEnd = objCommon.getShorterEntityName(lstFromAscEnd[index]);
	if(index == 0){
		fromAscEnd = "<div style='width:30%;height:43px;float:left;' class='associationEndViewModeLHS'><div class='schematicDiagRow schematicDiagLeftCol' style='padding-top: 12px;'><label title='"+ lstFromAscEnd[index] +"'>"+ lstFromAscEnd[index] +"</label></div></div>";
	}else{
		fromAscEnd = "<div style='width:30%;height:43px;float:left;' class='associationEndViewModeLHS'><div class='schematicDiagRow schematicDiagLeftCol' style='padding-top: 12px;'><label title='"+ lstFromAscEnd[index] +"'>"+ lstFromAscEnd[index] +"</label></div></div>";
	}
	return fromAscEnd;
};

/**
 * The purpose of this method is to create to association end view in schematic diagram
 * @param index
 * @returns {String}
 */
schemaManagement.prototype.createDiagRightPanel = function(index){
	/*var shorterToEntityType = objCommon.getShorterEntityName(lstToEntityType[index]);
	var shorterToAscEnd = objCommon.getShorterEntityName(lstToAscEnd[index]);*/
	var toAscEnd = "<div style='width:30%;float:left;margin-left: -25px;margin-top: -13px;z-index: -1;position: relative;' style='text-align:right;'><div class='associationEndViewModeRHSEntity associationEndVieModeRHSTopDv'><label title='"+ lstToEntityType[index] +"'>"+ lstToEntityType[index] +"</label></div><div class='associationEndViewModeRHSEntity associationEndVieModeRHSBottomDv'><label title='"+ lstToAscEnd[index] +"'>"+ lstToAscEnd[index] +"</label></div></div>";
	return toAscEnd;
};

/**
 * The purpose of this method is to show links between association ends in schematic diagram
 * @param index
 * @returns {String}
 */
schemaManagement.prototype.createDiagMiddlePanel = function(index){
	var diagramaticAssociation = "<div style='width:268px;float:left;height: 40px;margin-left: -17px;'><canvas height='50' id='canvasRow_"+ index +"' class='canvas'></canvas> </div>";
	return diagramaticAssociation;
};

/**
 * The purpose of this method is to create links between association ends in schematic diagram
 * @param index
 */
schemaManagement.prototype.createUILink = function(index){
	var c=document.getElementById("canvasRow_"+index);
	var ctx=c.getContext("2d");
	ctx.arc(20,25,18,0,Math.PI * 2,false);
	ctx.strokeStyle = "#e2e2e2";
	ctx.lineWidth = 2;
	ctx.fillStyle = "#fff";
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.beginPath();
	ctx.translate(0.5,0.5);
	ctx.moveTo(38,25);
	ctx.lineTo(254,25);
	ctx.strokeStyle = "#b1b1b1";
	//ctx.lineWidth = 1;
	ctx.stroke();
	ctx.closePath();
	ctx.beginPath();
	ctx.arc(273,25,18,0,Math.PI * 2,false);
	ctx.strokeStyle = "#e2e2e2";
	ctx.lineWidth = 2;
	ctx.fillStyle = "#fff";
	ctx.stroke();
	ctx.closePath();
	ctx.fill();
	ctx.font="14px Segoe UI";
	ctx.fillStyle = "#000";
	if (lstFromMultiplicity[index] == "0..1"){
		ctx.fillText(lstFromMultiplicity[index],9,29);
	} else if (lstFromMultiplicity[index] == "*"){
		ctx.fillText(lstFromMultiplicity[index],17,32);
	} else {
		ctx.fillText(lstFromMultiplicity[index],16,29);
	}
	ctx.textAlign = 'center';
	if (lstToMultiplicity[index] == "0..1"){
		ctx.fillText(lstToMultiplicity[index],273,29);
	}  else if (lstToMultiplicity[index] == "*"){
		ctx.fillText(lstToMultiplicity[index],272,31);
	} else {
		ctx.fillText(lstToMultiplicity[index],273,29);
	}
};

/**
 * The purpose of this method is to set value of any html component
 * @param id
 * @param value
 */
schemaManagement.prototype.setHTMLValue = function(id, value){
	document.getElementById(id).innerHTML = value;
};

schemaManagement.prototype.loadAssociationEndViewMode = function() {
	var target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);
	$('#PropertyTab').removeClass("genericSelectRed");
	$('#AssociationTab').addClass("genericSelectRed");
	$("#associationEndMainDiv").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/associationEnd.html', function() {
		$('#propertyTerNav').hide();
		$('#PropertyViewBody').hide();
		$(".associationEndViewIcon").addClass("associationEndViewIconSelected");
		$(".associationEndGridIcon").removeClass("associationEndGridIconSelected");
		document.getElementById("PropertyViewEmptyBody").style.display = "none";
		uSchemaManagement.createSchematicDiagram(function() {
			uSchemaManagement.createEditModeAssociationTable();
		});
		spinner.stop();
	});
	
};

/**
 * The purpose of this function is to set dynamic max width of complex type name.
 */
schemaManagement.prototype.associationTabSetDynamicEntityTypeNameMaxwidth = function() {
	var viewPortWidth = $(window).width();
	var associationEndOperationsBarWidth = $(".associationEndOperationsBar").width();
	var entityTypeNameMaxWidth = associationEndOperationsBarWidth - 26;
	if (viewPortWidth > 1280) {
		$("#diagramHead").css("max-width", entityTypeNameMaxWidth);
	} else if (viewPortWidth <= 1280) {
		$("#diagramHead").css("max-width", '956px');
	}
};

/**
 * The purpose of this function is to display association end view mode and
 * hide association end grid mode on click of a association end view icon.
 */
schemaManagement.prototype.clickAssociationEndViewMode = function () {
	$(".associationEndViewIcon").addClass("associationEndViewIconSelected");
	$(".associationEndGridIcon").removeClass("associationEndGridIconSelected");
	$('#associationEndGridMode').hide();
	$('#associationEndViewMode').show();
	$('#associationEndEditIcon').hide();
	$('#dvDeleteIconAssociationEnd').hide();
	$("#associationEndCreateIcon").removeClass("addBorderRight");
	$("#associationEndCreateIcon").addClass("removeBorderRight");
	uSchemaManagement.setDynamicMarginTopEmptyAssociationEndViewModeMessage();
	uSchemaManagement.setDynamicAssociationEndViewModeHeight();
};

/**
 * The purpose of this function is to display association end grid mode and
 * hide association end view mode on click of a association end grid icon.
 */
schemaManagement.prototype.clickAssociationEndGridMode = function () {
	$(".associationEndGridIcon").addClass("associationEndGridIconSelected");
	$(".associationEndViewIcon").removeClass("associationEndViewIconSelected");
	$('#associationEndViewMode').hide();
	$('#associationEndGridMode').show();
	$('#associationEndEditIcon').show();
	$('#dvDeleteIconAssociationEnd').show();
	$('#associationEndDeleteIcon').attr("disabled", "disabled");
	$('#associationEndDeleteIcon').removeClass("deleteIconEnabled");
	$('#associationEndDeleteIcon').addClass("deleteIconDisabled");
	$("#associationEndCreateIcon").removeClass("removeBorderRight");
	$("#associationEndCreateIcon").addClass("addBorderRight");
	$('#mainAssociationTable').find('input[type=checkbox]:checked').removeAttr('checked');
	$('#mainAssociationTable tbody tr').removeClass("selectRow");
	uSchemaManagement.applyScrollCssOnGridModeAssociationTable();
	uSchemaManagement.setDynamicAssociationEndGridModeHeight();
	uSchemaManagement.setDynamicMarginTopEmptyAssociationEndGridModeMessage();
};

/**
 * The purpose of this method is to create schematic diagram in view mode
 */
schemaManagement.prototype.createSchematicDiagram = function(callback){
	uSchemaManagement.fetchAssociationEndsList();
	var noOfAsc = lstFromAscEnd.length;
	if(noOfAsc > 0){
		var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
		document.getElementById("dvemptyAscEndViewMode").style.display = "none";
		document.getElementById("schematicRep").style.display = "block";
		document.getElementById("diagramHead").style.display = "block";
		uSchemaManagement.setHTMLValue("lbldiagramHead", entityTypeName);
		document.getElementById("lbldiagramHead").title = entityTypeName;
		var dynamicTable = "";
		for(var index = 0; index < noOfAsc; index++){
			dynamicTable = dynamicTable + "<div class='associationSchemaDiagramRow addPositionOnAssociationVieMode' style='width: 100%;height: 85px;'>";
			dynamicTable = dynamicTable + uSchemaManagement.createDiagLeftPanel(index);
			dynamicTable = dynamicTable + uSchemaManagement.createDiagMiddlePanel(index);
			dynamicTable = dynamicTable + uSchemaManagement.createDiagRightPanel(index);
			dynamicTable = dynamicTable + "</div>";
		}
		
		$("#schemaDiag").html(dynamicTable);
		for(var index = 0; index < noOfAsc; index++){
			uSchemaManagement.createUILink(index);
		}
		uSchemaManagement.setDynamicAssociationEndViewModeHeight();
	}else{
		document.getElementById("dvemptyAscEndViewMode").style.display = "block";
		document.getElementById("schematicRep").style.display = "none";
		document.getElementById("diagramHead").style.display = "none";
		uSchemaManagement.setDynamicMarginTopEmptyAssociationEndViewModeMessage();
	}
	if (callback != undefined) {
		callback();
	}
};
/******************************DELETE ASSOCIATION ****************************/

schemaManagement.prototype.getSelectedAssociation = function() {
	var selectedAssociation = objCommon.getMultipleSelections(
			'mainAssociationTable', 'input', 'case');
	var arrSelectedAssociation = selectedAssociation.split(",");
	for ( var count = 0; count < arrSelectedAssociation.length; count++) {
		var val = arrSelectedAssociation[count].split("~");
		var fromEntityTypeName = objCommon.getEnityNameAfterRemovingSpecialChar(val[0]);
		var fromAssociationEndName = objCommon.getEnityNameAfterRemovingSpecialChar(val[1]);
		var toEntityTypeName = objCommon.getEnityNameAfterRemovingSpecialChar(val[2]);
		var toAssociationEndName = objCommon.getEnityNameAfterRemovingSpecialChar(val[3]);
		var response = uSchemaManagement.deleteAssociation(fromEntityTypeName,
				fromAssociationEndName, toEntityTypeName, toAssociationEndName);
		if (response == 204) {
			uSchemaManagement.countDeleteRecords += 1;
		}
	}
	if (uSchemaManagement.countDeleteRecords > 0) {
		//var objODataCommon = new odataCommon();
		uSchemaManagement.updateAssociationPage();
		var message = uSchemaManagement.countDeleteRecords
				+ " " + getUiProps().MSG0385;
		objCommon.displaySuccessMessage(message, '#associationDeleteModalWindow', "250px", "crudOperationMessageBlock");
		//objODataCommon.displaySuccessMessage("#associationDeleteModalWindow", message, "");
		uSchemaManagement.countDeleteRecords = 0;
	}
};

/**
 * The purpose of the following method is to delete records when data is available at both ends.
 * @param fromEntityTypeName
 * @param fromAssociationEndName
 * @param toEntityTypeName
 * @param toAssociationEndName
 * @returns
 */
schemaManagement.prototype.deleteValidScenario = function(fromEntityTypeName,
		fromAssociationEndName, toEntityTypeName, toAssociationEndName) {
	var response = null;
	response = uSchemaManagement.retrieveAPIResponse(fromEntityTypeName,
			"deleteLinkAssociation", fromAssociationEndName, toEntityTypeName,
			toAssociationEndName);
	var responseCode = null;
	if (response.resolvedValue !=null && response.resolvedValue.status == 204) {
		var fromResponse = uSchemaManagement
				.retrieveAPIResponse(fromEntityTypeName, "deleteAssociation",
						fromAssociationEndName);
		if (response.resolvedValue.status !=null && fromResponse.resolvedValue.status == 204) {
			response = uSchemaManagement.retrieveAPIResponse(toEntityTypeName,
					"deleteAssociation", toAssociationEndName);
			responseCode = response.resolvedValue.status;
		}
	}
	if (response.resolvedValue == null && response.errorMessage.status == 404 && fromEntityTypeName == toEntityTypeName) {
		responseCode = 204;
		//response.resolvedValue.status = 204;
	}
	return responseCode;
};
/**
 * The purpose of the following method is to delete association from the left side. 
 * @param fromEntityTypeName
 * @param fromAssociationEndName
 * @returns
 */
schemaManagement.prototype.deleteAssociationLeftSide = function(
		fromEntityTypeName, fromAssociationEndName) {
	var response = uSchemaManagement.retrieveAPIResponse(fromEntityTypeName,
			"deleteAssociation", fromAssociationEndName);
	return response.resolvedValue.status;
};
/**
 * The purpose of the following method is to delete association from the right side.
 * @param toEntityTypeName
 * @param toAssociationEndName
 * @returns
 */
schemaManagement.prototype.deleteAssociationRightSide = function(
		toEntityTypeName, toAssociationEndName) {
	var response = uSchemaManagement.uSchemaManagement.retrieveAPIResponse(
			toEntityTypeName, "deleteAssociation", toAssociationEndName);
	return response.resolvedValue.status;
};

/**
 * The purpose of the following method is to to delete Association.
 * @param fromEntityTypeName
 * @param fromAssociationEndName
 * @param toEntityTypeName
 * @param toAssociationEndName
 * @returns
 */
schemaManagement.prototype.deleteAssociation = function(fromEntityTypeName,
		fromAssociationEndName, toEntityTypeName, toAssociationEndName) {
	var response = null;
	if (fromEntityTypeName.length != 0 && fromAssociationEndName.length != 0
			&& toEntityTypeName.length != 0 && toAssociationEndName.length != 0) {
		response = uSchemaManagement.deleteValidScenario(fromEntityTypeName,
				fromAssociationEndName, toEntityTypeName, toAssociationEndName);
	} else if (fromEntityTypeName != undefined && fromAssociationEndName != undefined) {
		response = uSchemaManagement.deleteAssociationLeftSide(
				fromEntityTypeName, fromAssociationEndName);
	} else if (toEntityTypeName != undefined && toAssociationEndName != undefined) {
		response = uSchemaManagement.deleteAssociationRightSide(
				toEntityTypeName, toAssociationEndName);
	} else {
		var message = getUiProps().MSG0189; //"Error occurred while deleting Association Link!";
		objCommon.displayErrorMessage (message, '#associationDeleteModalWindow', "305px");
	}
	return response;
};

/******************************DELETE ASSOCIATION ****************************/

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
schemaManagement.prototype.retrieveRecordCountAssociationEnd = function(entityTypeName, accessor) {
	var objAssociationEndManager = uSchemaManagement.createAssociationManager();
	var uri = null;
	if(entityTypeName != null || entityTypeName != undefined) {
		uri = objAssociationEndManager.getAssociationUri(entityTypeName);
	}
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
schemaManagement.prototype.retrieveChunkedData = function(entityTypeName, lowerLimit, upperLimit, accessor) {
	var objAssociationEndManager = uSchemaManagement.createAssociationManager();
	var uri = null;
	if(entityTypeName != null || entityTypeName != undefined) {
		uri = objAssociationEndManager.getAssociationUri(entityTypeName);
	}
	uri = uri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d.results;
	return json;
};

/******************** COMPLEX TYPE VIEW: START *******************/

/**
 * The purpose of this function is to retrieve complex type record count.
 * @param objjDCCollection
 * @param accessor
 */
schemaManagement.prototype.retrieveRecordCount = function(objjDCCollection, accessor) {
	var objComplexTypeManager = new _pc.ComplexTypeManager(accessor, objjDCCollection);
	var uri = objComplexTypeManager.getUrl();
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * The purpose of this method is to call API to fetch complex types.
 * @param url
 */
schemaManagement.prototype.fetchComplexTypes = function(url) {
	sessionStorage.complexTypeCount = 0;
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objjDCCollection = new _pc.PersoniumCollection(accessor, url);
	var recordCount = uSchemaManagement.retrieveRecordCount(objjDCCollection, accessor);
	var objComplexTypeManager = new _pc.ComplexTypeManager(accessor,
			objjDCCollection);
	var uri = objComplexTypeManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top="+recordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var sortedJSONString = response.bodyAsJson().d.results;
	var totalRecordsize = sortedJSONString.length;
	var complexTypeNames = [];
	var updatedDate = [];
	sessionStorage.entityTypeCount = totalRecordsize;
	for ( var count = 0; count < totalRecordsize; count++) {
		var obj = sortedJSONString[count];
		complexTypeNames[count] = obj.Name;
		updatedDate[count] = obj.__updated;
	}
	return complexTypeNames;
};

/**
 * The purpose of this method is to view data for complex type tab
 * @param complexTypeList
 */
schemaManagement.prototype.viewComplexTypeData = function(complexTypeList) {
	if (complexTypeList.length > 0) {
		$("#complexTypeRefreshIcon").removeClass('schemaRefreshIconDisabled');
		//$("#complexTypeRefreshIcon").attr("disabled",false);
		//$("#complexTypeRawIcon").removeClass('schemaRawIconDisabled');
		//$("#complexTypeRawIcon").attr("disabled",false);
		$("#odataRightView").show();
		$("#complexTypePropertyViewUI").show();
		$("#dvemptyComplexTypeMessageOdata").hide();
		uSchemaManagement.createComplexTypeListView(complexTypeList);
	} else {
		//$("#complexTypeRefreshIcon").addClass('schemaRefreshIconDisabled');
		//$("#complexTypeRefreshIcon").attr("disabled",true);
		$("#complexTypeRawIcon").addClass('schemaRawIconDisabled');
		$("#complexTypeRawIcon").attr("disabled",true);
		$("#complexTypeTbody").empty();
		$("#complexTypePropertyViewUI").hide();
		$("#dvemptyComplexTypeMessageOdata").show();
		uSchemaManagement.setDynamicMarginTopOfEmptyComplexTypeMessage();
	}
};

/**
 * The purpose of this function is to create list view of complex types.
 * @param complexTypeList
 */
schemaManagement.prototype.createComplexTypeListView = function(complexTypeList) {
	$("#complexTypeTbody").scrollTop(0);
	var noOfcomplexTypes = complexTypeList.length;
	var dynamicRows = "";
	for ( var index = 0; index < noOfcomplexTypes; index++) {
		dynamicRows += "<tr><td id='complexTypeCol_" + index
				+ "' onclick='uSchemaManagement.rowSelect(this," + index
				+ ")'; style='width:100%;max-width: 200px;'><div id='complexTypeDv_" + index
				+ "' class='complexTypeRow mainTableEllipsis'><label title='"+ complexTypeList[index] + "' id='complexTypeLbl_" + index + "' style='cursor: pointer;'>" + complexTypeList[index]
				+ "</label></div></td><td style='width:0%;'></td></tr>";
	}
	$("#complexTypeTbody").html(dynamicRows);
};

/**
 * The purpose of this function is to set dynamic ids of refresh, create and
 * raw icon for complex type.
 */
schemaManagement.prototype.setDynamicIDsOfComplexTypeOperations = function() {
	var complexTypeRefreshIcon = document.getElementById("entityTypeRefreshIcon");
	if (complexTypeRefreshIcon != null) {
		complexTypeRefreshIcon.id = "complexTypeRefreshIcon";
		var complexTypeCreateIcon = document.getElementById("entityTypeCreateIcon");
		complexTypeCreateIcon.id = "complexTypeCreateIcon";
		var complexTypeRawIcon = document.getElementById("entityTypeRawIcon");
		complexTypeRawIcon.id = "complexTypeRawIcon";
		$("#complexTypeCreateIcon").unbind();
		$("#complexTypeRefreshIcon").unbind();
		$("#complexTypeCreateIcon").click(function() {
			openCreateEntityModal('#createCTypeModal','#createCTypeDialog', 'txtCTypeName');
		});
		$("#complexTypeRefreshIcon").click(function() {
			$("#complexTypeRefreshIcon").css("pointer-events","none");
			var target = document.getElementById('spinner');
			spinner = new Spinner(opts).spin(target);
			setTimeout(function() {
				var collectionURL = sessionStorage.selectedCollectionURL;
				if(collectionURL != null && collectionURL != undefined) {
					uSchemaManagement.bindComplexTypeList(function(){
						if (spinner != undefined){
							spinner.stop();
							$("#complexTypeRefreshIcon").css("pointer-events","all");
						}});
				}
			}, 50);
		});
	}
};

/**
 * The purpose of this function is to set dynamic ids of refresh, create and
 * raw icon for entity type.
 */
schemaManagement.prototype.setDynamicIDsOfEntityTypeOperations = function() {
	var entityTypeRefreshIcon = document.getElementById("complexTypeRefreshIcon");
	if (entityTypeRefreshIcon != null) {
		entityTypeRefreshIcon.id = "entityTypeRefreshIcon";
		var entityTypeCreateIcon = document.getElementById("complexTypeCreateIcon");
		entityTypeCreateIcon.id = "entityTypeCreateIcon";
		var entityTypeRawIcon = document.getElementById("complexTypeRawIcon");
		entityTypeRawIcon.id = "entityTypeRawIcon";
		$("#entityTypeCreateIcon").unbind();
		$("#entityTypeCreateIcon").click(function() {
			openCreateEntityModal('#createETypeModal','#createETypeDialog', 'txtETypeName');
		});
		$("#entityTypeRefreshIcon").unbind();
		$("#entityTypeRefreshIcon").click(function() {
				uEntityTypeOperations.refreshEntityTypeList();
			});
	}
};

/**
 * The purpose of this function is to display complex type view,
 * on click of complex type tab.
 */
schemaManagement.prototype.clickComplexTypeTab = function() {
	var target = document.getElementById('spinner');
	spinner = new Spinner(opts).spin(target);
	setTimeout(function() {
		uSchemaManagement.setDynamicIDsOfComplexTypeOperations();
	$(".entityTypeTab").removeClass("typeTabSelected");
	$(".complexTypeTab").addClass("typeTabSelected");
	$("#entityTypeBody").hide();
	$("#entityTypeTbody").empty();
	$("#complexTypeList").show();
	$("#propertyViewUI").hide();
	$("#dvemptyTableMessageOdata").hide();
	$("#complexTypePropertyViewUI").show();
	$("#complexTypeRawIcon").addClass('schemaRawIconDisabled');
	$("#complexTypeRawIcon").attr("disabled",true);
	uSchemaManagement.bindComplexTypeList(function(){
		if (spinner != undefined){
			spinner.stop();
		}});
	uSchemaManagement.setDynamicWidthForComplexTypeList();
	}, 25);
};

schemaManagement.prototype.bindComplexTypeList = function(spinnerCallback) {
	var complexTypeList = uSchemaManagement
			.fetchComplexTypes(sessionStorage.selectedCollectionURL);
	uSchemaManagement.viewComplexTypeData(complexTypeList);
	if (complexTypeList.length > 0) {
		var selectedComplexType = document.getElementById("complexTypeLbl_0").title;
		$("#tabComplexTypeName").text(selectedComplexType);
		document.getElementById("tabComplexTypeName").title = selectedComplexType;
		uSchemaManagement.setSchemaTabComplexTypeListDynamicHeight();
		$("#complexTypeCol_0").addClass("complexTypeRowSelect");
		uComplexTypeProperty.createComplexTypePropertyTable(selectedComplexType);
		uSchemaManagement.setDynamicComplexTypeNameMaxwidth();
	}
	if (spinnerCallback != undefined) {
		spinnerCallback();
	}
};

/**
 * The purpose of this function is to hide complex type div and adds
 * selected class on complex type tab and removes selected class from
 * entity type tab.
 */
schemaManagement.prototype.hideComplexTypeView = function() {
	$("#complexTypeList").hide();
	$("#complexTypePropertyViewUI").hide();
	$("#dvemptyComplexTypeMessageOdata").hide();
	$("#complexTypeTbody").empty();
	$("#complexTypePropertyViewUI").hide();
	$(".complexTypeTab").removeClass("typeTabSelected");
	$(".entityTypeTab").addClass("typeTabSelected");
	$("#entityTypeBody").show();
	$("#propertyViewUI").show();
	$("#propertyTerNav").show();
};

/**
 * The purpose of this function is to display entity type view,
 * on click of entity type tab.
 */
schemaManagement.prototype.clickEntityTypeTab = function() {
	uEntityTypeOperations.setPropertyDynamicHeight();
	var target = document.getElementById('spinner');
	spinner = new Spinner(opts).spin(target);
	setTimeout(function() {
		uSchemaManagement.setDynamicIDsOfEntityTypeOperations();
		sessionStorage.selectedEntityTypeCount = 0;
		uSchemaManagement.hideComplexTypeView();
		$('#PropertyTab').addClass("genericSelectRed");
		$('#AssociationTab').removeClass("genericSelectRed");
		$("#associationEndMainDiv").empty();
		$("#entityTypeRawIcon").addClass('schemaRawIconDisabled');
		$("#entityTypeRawIcon").attr("disabled",true);
		var entityTypeNames = uEntityTypeOperations.entityTypeNames;
		uEntityTypeOperations.viewEntityTypeData(entityTypeNames);
		uEntityTypeOperations.setSchemaTabEntityListDynamicHeight();
		//setTimeout(function() {
			uEntityTypeOperations.setDynamicWidthForEntityTypeList();
		//}, 50);
		$("#entityTypeCol_" + sessionStorage.selectedEntityTypeCount).addClass(
				"entityTypeRowSelect");
		var selectedEntityTypeName = uEntityTypeOperations.getSelectedEntityType();
		$("#tabEntityName").text(selectedEntityTypeName);
		$("#tabEntityName").attr('title', selectedEntityTypeName);
		var url = sessionStorage.selectedCollectionURL + "/"
				+ selectedEntityTypeName;
		$("#propertyToolBarRight").text(url);
		$("#propertyToolBarRight").attr('title', url);
		if (entityTypeNames != null	&& entityTypeNames.length > 0) {
			var selectedEntityType = document
					.getElementById("entityTypeDv_"
							+ sessionStorage.selectedEntityTypeCount).title;
			if (selectedEntityType !== undefined) {
				uEntityTypeOperations
						.updatePropertyView(selectedEntityType, function() {
							if (spinner != undefined){
								spinner.stop();
							}
						});
			}
		} else if (entityTypeNames.length == 0) {
			if (spinner != undefined){
				spinner.stop();
			}
		}
	}, 50);
};

/**
 * The purpose of this function is to perform row select operation on click
 * of complex type row.
 * @param obj
 * @param count
 */
schemaManagement.prototype.rowSelect = function(obj, count) {
	sessionStorage.selectedComplexTypeCount = count;
	$(obj).parent().siblings().children().removeClass("complexTypeRowSelect");
	$(obj).addClass("complexTypeRowSelect");
	var selectedComplexType = document.getElementById("complexTypeLbl_" + count).title;
	$("#tabComplexTypeName").text(selectedComplexType);
	document.getElementById("tabComplexTypeName").title = selectedComplexType;
	uComplexTypeProperty.createComplexTypePropertyTable(selectedComplexType);
};

/**
 * The purpose of this method is to set dynamic widths of complex type list data
 * according to view port size.
 */
schemaManagement.prototype.setDynamicWidthForComplexTypeList = function() {
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;

	/** OData EntityType width - Start */
	var availableWidthForOData = rightPanelWidth - 15 - 20;
	var availableWidthForEntityTypeListPanel = Math.round(((19.95114/100)*availableWidthForOData));
	var entityTypeNameWidth = (availableWidthForEntityTypeListPanel - 5 - 5 - 6 - 10);

	var scrollBarWidth = 5;
	if(document.getElementById("complexTypeTbody") != null && document.getElementById("complexTypeTbody") != undefined){
		var tbodyObject = document.getElementById("complexTypeTbody");
		if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
			scrollBarWidth = 0;
		}
	}
	/** OData EntityType width - End */

	if (width>1280) {
		$(".complexTypeRowSelect").css('max-width', (entityTypeNameWidth + scrollBarWidth) + "px");
	}else{
		$(".complexTypeRowSelect").css('max-width', (223 + scrollBarWidth) + "px");
	}
};

/**
 * The purpose of this function is to set dynamic margin top of empty
 * complex type message.
 */
schemaManagement.prototype.setDynamicMarginTopOfEmptyComplexTypeMessage = function() {
	var viewPortHeight = $(window).height();
	var entityTypeListHeight = $("#entityTypeList").height();
	var marginTop = (entityTypeListHeight - 143)/2;
	if (viewPortHeight > 650) {
		$("#dvemptyComplexTypeMessageOdata").css("margin-top", marginTop+'px');
	} else if(viewPortHeight <= 650) {
		$("#dvemptyComplexTypeMessageOdata").css("margin-top", '95px');
	}
};

/**
 * The purpose of this function is to set dynamic max width of complex type name.
 */
schemaManagement.prototype.setDynamicComplexTypeNameMaxwidth = function() {
	var viewPortWidth = $(window).width();
	var complexTypeTopSection = $("#complexTypeTopSection").width();
	var complexTypeMidLeftSection = $(".ctpTerNavLeft").width();
	var complexTypeNameMaxWidth = complexTypeTopSection - 80;
	var complexTypePropertyNameMaxWidth = complexTypeNameMaxWidth-complexTypeMidLeftSection;
	if (viewPortWidth > 1280) {
		$("#tabComplexTypeName").css("max-width", complexTypeNameMaxWidth);
		$("#complexTypePropLabel").css("max-width", complexTypePropertyNameMaxWidth);
	} else if (viewPortWidth <= 1280) {
		$("#tabComplexTypeName").css("max-width", '899px');
		$("#complexTypePropLabel").css("max-width", '624px');
	}
};

/**
 * The purpose of this function is to set dynamic height of complex type grid in
 * schema tab
 */
schemaManagement.prototype.setSchemaTabComplexTypeListDynamicHeight = function(){
	var height = $(window).height();

	//Web DAV Details Panel Height - Start
	var fixedHeight = 295;;
	var entityTypeListHeight = (height - fixedHeight)-36;
	var entityTypeBodyHeight = (entityTypeListHeight - 35 - 10 - 5);
	//Web DAV Details Panel Height - End

	if (height>650){
		setCellListSliderPosition();
		setDynamicCellListHeight();
		$(".entityTypeList").css('min-height', entityTypeListHeight + "px");
		$("#complexTypeTbody").css("max-height",entityTypeBodyHeight + "px");
	}else{
		setCellListSliderPosition();
		setDynamicCellListHeight();
		$(".entityTypeList").css('min-height', "319px");
		$("#complexTypeTbody").css("max-height","269px");
	}
};

schemaManagement.prototype.applyScrollCssOnGridModeAssociationTable = function() {
	var tbodyObject = document.getElementById("associationEndGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainAssociationTable td:eq(1)").css("width", '16.3%');
		$("#mainAssociationTable td:eq(3)").css("width", '16.2%');
		$("#mainAssociationTable td:eq(4)").css("width", '16.1%');
		$("#mainAssociationTable td:eq(5)").css("width", '16.1%');
	}
};

/**
 * The purpose of this function is to set margin-top of empty message div
 * on association end view mode.
 */
schemaManagement.prototype.setDynamicMarginTopEmptyAssociationEndViewModeMessage = function() {
	var viewPortHeight = $(window).height();
	var emptymessageHeight = 25;
	var marginTop = ((viewPortHeight - 408)/2- (emptymessageHeight/2));
	if (viewPortHeight > 650) {
		$("#dvemptyAscEndViewMode").css("margin-top", marginTop+'px');
	} else if(viewPortHeight <= 650) {
		$("#dvemptyAscEndViewMode").css("margin-top", '108px');
	}
};

/**
 * The purpose of this function is to set margin-top of empty message div
 * on association end grid mode.
 */
schemaManagement.prototype.setDynamicMarginTopEmptyAssociationEndGridModeMessage = function() {
	var viewPortHeight = $(window).height();
	var emptymessageHeight = 25;
	var marginTop = ((viewPortHeight - 453)/2- (emptymessageHeight/2));
	if (viewPortHeight > 650) {
		$("#dvemptyAscEndViewMode").css("margin-top", marginTop+'px');
	} else if(viewPortHeight <= 650) {
		$("#dvemptyAscEndViewMode").css("margin-top", '85px');
	}
};

/**
 * The purpose of this function is to set dynamic height of association
 * grid in grid mode.
 */
schemaManagement.prototype.setDynamicAssociationEndGridModeHeight = function() {
	var viewPortHeight = $(window).height();
	var fixedHeight = 473; // (36+36+35+47)
	var gridHeight = viewPortHeight - fixedHeight;
	if (viewPortHeight > 650) {
		$("#associationEndGridTbody").css("max-height", gridHeight);
	} else if (viewPortHeight <= 650) {
		$("#associationEndGridTbody").css("max-height", '177px');
	}
};

/**
 * The purpose of this function is to set height of association
 * diagram in view mode.
 */
schemaManagement.prototype.setDynamicAssociationEndViewModeHeight = function() {
	var viewPortHeight = $(window).height();
	var fixedHeight = 431; // (36+36+35+47)
	var gridHeight = viewPortHeight - fixedHeight;
	if (viewPortHeight > 650) {
		$("#associationEndViewMode").css("max-height", gridHeight);
	} else if (viewPortHeight <= 650) {
		$("#associationEndViewMode").css("max-height", '219px');
	}
};


$(window).resize(function(){
	if ($("#OdataSchemaTab").hasClass("odataTabSelected") && $(".complexTypeTab").hasClass("typeTabSelected")) {
		uSchemaManagement.setDynamicMarginTopOfEmptyComplexTypeMessage();
		uSchemaManagement.setSchemaTabComplexTypeListDynamicHeight();
		uComplexTypeProperty.setComplexTypePropertyDynamicHeight();
		uSchemaManagement.setDynamicComplexTypeNameMaxwidth();
		uComplexTypeProperty.setDynamicHeightOfEmptyComplexTypePropertyMessage();
	}
	if ($("#OdataSchemaTab").hasClass("odataTabSelected") && $(".entityTypeTab ").hasClass("typeTabSelected") && $("#AssociationTab").hasClass("genericSelectRed")) {
		uSchemaManagement.associationTabSetDynamicEntityTypeNameMaxwidth();
		if($("#associationEndViewIcon").hasClass("associationEndViewIconSelected") ) {
			uSchemaManagement.setDynamicMarginTopEmptyAssociationEndViewModeMessage();
			uSchemaManagement.setDynamicAssociationEndViewModeHeight();
		} else if($("#associationEndGridIcon").hasClass("associationEndGridIconSelected") ) {
			uSchemaManagement.setDynamicMarginTopEmptyAssociationEndGridModeMessage();
			uSchemaManagement.setDynamicAssociationEndGridModeHeight();
		}
	}
	uSchemaManagement.setDynamicWidthForComplexTypeList();
});

/******************** COMPLEX TYPE VIEW: END *******************/

/**
 * The purpose of this function is load data management raw view.
 */
schemaManagement.prototype.clickEntityTypeRawView = function() {
	var target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);
	$("#OdataSchemaTab").removeClass("odataTabSelected");
	$("#OdataSchemaTab").css("color","#1b1b1b");
	$("#OdataDataTab").addClass("odataTabSelected");
	var entityTypeNames = uEntityTypeOperations.entityTypeNames;
	var collectionURL = sessionStorage.selectedCollectionURL;
	var selectedEntityTypeName = uEntityTypeOperations.getSelectedEntityType();
	if (selectedEntityTypeName.length == 0) {
		selectedEntityTypeName = entityTypeNames[0];
	}
	var selectedEntityTypeIndex = uEntityTypeOperations.getSelectedEntityTypeIndex();
	$("#odataContentArea").hide();
	$("#odataContentArea").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/dataManagement.html',
			function() {
				uEntityTypeOperations.setCurrentSelectedTab("data");
				sessionStorage.ODataViewSelectedTab = "raw";
				uEntityTypeOperations.viewEntityTypeData(entityTypeNames);
				uEntityTypeOperations.setDynamicHeight();
				setTimeout(function(){
					uEntityTypeOperations.setDynamicWidthForEntityTypeList();
				},50);
				uDataManagement.disableButtonsForRawView();
				if(entityTypeNames.length > 0){
					$("#entityTypeName").text(selectedEntityTypeName);
					$("#entityTypeName").attr('title',selectedEntityTypeName);
					if(!(collectionURL.endsWith('/'))){
						collectionURL = collectionURL + '/';
					}
					var entityTypeURL = collectionURL + selectedEntityTypeName;
					$("#entityTypeURL").text(entityTypeURL);
					$("#entityTypeURL").attr('title',entityTypeURL);
					$("#entityTypeCol_"+selectedEntityTypeIndex).addClass("entityTypeRowSelect");
					if(uDataManagement.propertyDetailsList.length > 0){
						$("#txtBoxQuery").val("/"+selectedEntityTypeName);
						$("#dvNoPropertyMsg").css("display","none");
						$("#odataGrid").css("display","none");
						$("#odataRaw").css("display","block");
						uDataManagement.enableGoButton();
						sessionStorage.propertiesCount = uDataManagement.propertyDetailsList.length;
						uDataManagement.getRawJSONView();
						$("#createODataEntityIcon").addClass("createIcon");
						$("#createODataEntityIcon").removeClass("createIconWebDavDisabled");
						$("#createODataEntityText").addClass("createText");
						$("#createODataEntityText").removeClass("createTextWebDavDisabled");
						$("#createOdataEntityWrapper").css("cursor","pointer");
						$("#createOdataEntityWrapper").addClass("enabled");
					}else{
						$("#txtBoxQuery").val("Type your query");
						$("#dvNoPropertyMsg").css("display","block");
						$("#odataGrid").css("display","none");
						$("#recordCount_OdataGrid").html("0 - 0 "+getUiProps().MSG0323+" 0");
						uDataManagement.disableGoButton();
						sessionStorage.propertiesCount = 0;
						$("#createODataEntityIcon").removeClass("createIcon");
						$("#createODataEntityIcon").addClass("createIconWebDavDisabled");
						$("#createODataEntityText").removeClass("createText");
						$("#createODataEntityText").addClass("createTextWebDavDisabled");
						$("#createOdataEntityWrapper").css("cursor","default");
						$("#createOdataEntityWrapper").removeClass("enabled");
					}
					$("#dvemptyTableMessageOdata").hide();
					$("#entityTypeBody").show();
					$("#odataRightView").show();
					//$("#entityTypeRefreshBtn").attr("disabled",false);
				}else{
					$("#dvemptyTableMessageOdata").show();
					uDataManagement.setMarginForNoEntityTypeMsg();
					$("#entityTypeBody").hide();
					$("#odataRightView").hide();
					//$("#entityTypeRefreshBtn").attr("disabled",true);
				}
				uDataManagement.setDynamicWidthForODataGrid();
				uDataManagement.createEntityHoverEffect();
				uDataManagement.sortByDateHoverEffect();
				uDataManagement.gridBtnHoverEffect();
				uDataManagement.rawBtnHoverEffect();
				spinner.stop();
				$("#odataContentArea").show();
				$("#webDavContentArea").show();
	});
};
/********************************Validation on blur:Start****************************************/
/**
 * This function validates association end(from) on blur event 
 */
schemaManagement.prototype.txtFromAssEndValidation = function() {
	var fromAssEnd = document.getElementById("txtFromAssEnd").value;
	var fromAssType = $("#ddFromAssEndTypes").val();
	uSchemaManagement.validateFromAssociationFields(fromAssEnd, fromAssType);
};

//START LHS validations
/**
 * Following method checks validations of -  From Association End Types on blur event.
 */
schemaManagement.prototype.validateFromAssociationTypeField = function(fromAssType){
	var result = true;
	if(fromAssType == "Select"){
	uSchemaManagement.setHTMLValue("popupFromAssEndTypeErrorMsg", getUiProps().MSG0091);
	result = false;
}
 return result;
};

/**
 * Following method checks validations of -  From Association Input Field.
 * @param fromAssEnd From Association End
 * @param fromAssType From Association Type
 * @returns {Boolean} true/false
 */
schemaManagement.prototype.validateFromAssociationTextField = function(fromAssEnd, fromAssType){
	var result = true;
	var letters = /^[0-9a-zA-Z-_]+$/;
	var specialCharacter = /^[-_]*$/;
	var lenFromAssEnd = fromAssEnd.length;
	uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", "");
	if (lenFromAssEnd < 1 || fromAssEnd == undefined || fromAssEnd == null
			|| fromAssEnd == "") {
		uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0088);
		result = false;
		cellpopup.showErrorIcon('#txtFromAssEnd');
	} else if (lenFromAssEnd > 128) {
		uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0089);
		result = false;
		cellpopup.showErrorIcon('#txtFromAssEnd');
	} else if (lenFromAssEnd != 0 && !(fromAssEnd.match(letters))) {
		uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0023);
		result = false;
		cellpopup.showErrorIcon('#txtFromAssEnd');
	} else if(lenFromAssEnd != 0 && (specialCharacter.toString().indexOf(fromAssEnd.substring(0, 1)) >= 0)) {
		uSchemaManagement.setHTMLValue("popupFromAssEndErrorMsg", getUiProps().MSG0090);
		result = false;
		cellpopup.showErrorIcon('#txtFromAssEnd');
	} 
	return result;
};

/**
 * Following method checks validations of -  From Association Input Field on blur event.
 */
schemaManagement.prototype.txtFromAssEndValidationsOnBlur = function() {
	var fromAssEnd = document.getElementById("txtFromAssEnd").value;
	if(uSchemaManagement.validateFromAssociationTextField(fromAssEnd))
		cellpopup.showValidValueIcon('#txtFromAssEnd');
};

/**
 * Following method checks validations of -  From Association End Type dropdown on blur event.
 */
schemaManagement.prototype.ddFromAssEndTypesValidationsOnBlur = function() {
	uSchemaManagement.setHTMLValue("popupFromAssEndTypeErrorMsg", "");
	var fromAssType = $("#ddFromAssEndTypes").val();
	uSchemaManagement.validateFromAssociationTypeField(fromAssType);
};

//END LHS Validations

//START RHS Validations
/**
 * Following method checks validations of Entity Name on blur event.
 */
schemaManagement.prototype.validateEntityName = function(toEntityTypeName){
	var result = true;
	//var objODataCommon = new odataCommon();
	uSchemaManagement.setHTMLValue("popupToEntityTypeNameErrorMsg", "");
	if(toEntityTypeName == "Select"){
		uSchemaManagement.setHTMLValue("popupToEntityTypeNameErrorMsg", getUiProps().MSG0101);
		result = false;
	}
	return result;
};

/**
 * Following method checks validations of -  From Association End Field dropdown.
 * @param toAssEnd To associaton end.
 * @param toAssType to association type.
 * @returns {Boolean}
 */
schemaManagement.prototype.validateAssociationEndField = function(toAssEnd, toAssType){
	var result = true;
	var letters = /^[0-9a-zA-Z-_]+$/;
	var specialCharacter = /^[-_]*$/;
	var max_limit = 128;
	var lenToAssEnd = toAssEnd.length;
	uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", "");
	if (lenToAssEnd < 1 || toAssEnd == undefined || toAssEnd == null
			|| toAssEnd == "") {
		uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0088);
		result = false;
		cellpopup.showErrorIcon('#txtToAssEnd');
	} else if (lenToAssEnd > max_limit) {
		uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0089);
		result = false;
		cellpopup.showErrorIcon('#txtToAssEnd');
	} else if (lenToAssEnd != 0 && !(toAssEnd.match(letters))) {
		uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0023);
		result = false;
	} else if(lenToAssEnd != 0 && (specialCharacter.toString().indexOf(toAssEnd.substring(0, 1)) >= 0)) {
		uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", getUiProps().MSG0090);
		result = false;
		cellpopup.showErrorIcon('#txtToAssEnd');
	} 
	return result;
};

/**
 * Following method checks validations of -  Association End Field on Blur event.
 */
schemaManagement.prototype.validateAssociationEndFieldOnBlur = function() {
	 var toAssEnd = document.getElementById("txtToAssEnd").value;
	 uSchemaManagement.setHTMLValue("popupToAssEndErrorMsg", "");
		var toAssType = $("#ddToAssEndTypes").val();
		if (uSchemaManagement.validateAssociationEndField(toAssEnd, toAssType))
			cellpopup.showValidValueIcon('#txtToAssEnd');
			
};

/**
 * Following method checks validations of -  From Association Entity Type Name on blur event.
 */
schemaManagement.prototype.validateAssocialtionEntityNameOnBlur = function() {
	var toEntityTypeName = $("#toEntityTypeName").find("option:selected").attr("title");
	uSchemaManagement.validateEntityName(toEntityTypeName);
};

/**
 * Following method checks validations of -  From Association End Type dropdown.
 * @param toAssType To Association Type.
 * @param fromAscType From Asoociation Type.
 * @returns {Boolean} True/False.
 */
schemaManagement.prototype.ddToAssEndTypesValidation = function(toAssType,
		fromAscType) {
	var result = true;
	uSchemaManagement.setHTMLValue("popupToAssEndTypeErrorMsg", "");
	if (toAssType == "Select") {
		uSchemaManagement.setHTMLValue("popupToAssEndTypeErrorMsg",
				getUiProps().MSG0091);
		result = false;
		// cellpopup.showValidValueIcon('#txtToAssEnd');
	} else if (toAssType == "1" && fromAscType == "1") {
		uSchemaManagement.setHTMLValue("popupToAssEndTypeErrorMsg",
				getUiProps().MSG0102);
		result = false;
		// cellpopup.showValidValueIcon('#txtToAssEnd');
	}
	return result;
};

/**
 * Following method checks validations of -  From Association End Type dropdown on blur event.
 */
schemaManagement.prototype.ddToAssEndTypesOnBlur = function() {
	var fromAssType = $("#ddFromAssEndTypes").val();
	var toAssType = $("#ddToAssEndTypes").val();
	uSchemaManagement.ddToAssEndTypesValidation(toAssType, fromAssType);
};

//END RHS Validations

/**
 * This method is called on page load
 */
$(document).ready(function() {
	/*if(sessionStorage.odataTabName == "listView" || sessionStorage.odataTabName == "associationView"){
		uSchemaManagement.createSchematicDiagram();
		var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
		uSchemaManagement.createEditModeAssociationTable(entityTypeName);
	}
	$("#btnDeleteAssociationIcon").click(function() {
		openCreateEntityModal('#associationDeleteModalWindow', '#associationDeleteDialogBox');
	});
	$("#btnDeleteAssociation").click(function() {
		uSchemaManagement.getSelectedAssociation();
	});*/
});