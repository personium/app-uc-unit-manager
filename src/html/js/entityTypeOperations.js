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
function entityTypeOperations(){}

var uEntityTypeOperations = new entityTypeOperations();
entityTypeOperations.entityTypeNames = "";

/**
 * The purpose of this method is to validate the entity type name as per the 
 * specifications.
 * @param entityTypeName
 * @returns {Boolean}
 */
entityTypeOperations.prototype.validateEntityTypeName = function(entityTypeName, errorSpanId, txtBoxId){
	//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(upper case).
	var letters = /^[0-9a-zA-Z-_]+$/;
	//The following regex finds under score(_) and hyphen(-).
	var specialCharacter = /^[-_]*$/;
	var lenETypeName = entityTypeName.length;
	if (lenETypeName < 1 || entityTypeName == undefined || entityTypeName == null
			|| entityTypeName == "") {
		document.getElementById(errorSpanId).innerHTML = getUiProps().MSG0061;
		objCommon.showErrorIcon(txtBoxId);
		return false;
	} else if (lenETypeName > 128) {
		document.getElementById(errorSpanId).innerHTML = getUiProps().MSG0062;
		objCommon.showErrorIcon(txtBoxId);
		return false;
	} else if (lenETypeName != 0 && !(entityTypeName.match(letters))) {
		document.getElementById(errorSpanId).innerHTML = getUiProps().MSG0023;
		objCommon.showErrorIcon(txtBoxId);
		return false;
	} else if(lenETypeName != 0 && (specialCharacter.toString().indexOf(entityTypeName.substring(0, 1)) >= 0)) {
		document.getElementById(errorSpanId).innerHTML = getUiProps().MSG0086;
		objCommon.showErrorIcon(txtBoxId);
		return false;
	}
	objCommon.showValidValueIcon(txtBoxId);
	return true;
};

/**
 * The purpose of this method is to validate if entity name already exists.
 * @param accessor
 * @param entityTypeName
 * @param path
 * @returns
 */
entityTypeOperations.prototype.entityNameAlreadyExists = function(accessor, entityTypeName, path){
	var objjDCCollection = new _pc.PersoniumCollection(accessor , path);
	var objEntityTypeManager = new _pc.EntityTypeManager(accessor, objjDCCollection);
	var status = false;
	try {
		objEntityTypeManager.retrieve(entityTypeName);
		status = false;
	} catch(exception) {
		status = true;
	}
	return status;
};

/**
 * The purpose of this function is to load Data tab, after successful operation of
 * entity type.
 * @param path
 * @param entityTypeNames
 */
entityTypeOperations.prototype.updateViewAfterEntityTypeOperations = function(path, entityTypeNames){
	if (entityTypeNames != undefined) {
		var lenEntityTypeNames = entityTypeNames.length;
		if(lenEntityTypeNames > 0)
			$("#OdataSchemaTab").removeClass("odataTabSelected");
			$("#OdataSchemaTab").css("color","#1b1b1b");
			$("#OdataDataTab").addClass("odataTabSelected");
			uDataManagement.loadDataView(path, entityTypeNames);
		}
};

/**
 * The purpose of this method is to create an entity type.
 * @returns {Boolean}
 */
entityTypeOperations.prototype.createEntityType = function(){
	showSpinner("modalSpinnerEntityType");
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var path = sessionStorage.selectedCollectionURL;//baseUrl+cellName+"/"+boxName + "/" + colName;
	var entityTypeName = document.getElementById("txtETypeName").value;
	if (uEntityTypeOperations.validateEntityTypeName(entityTypeName, "popupETypeErrorMsg", "#txtETypeName")) {
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var objjDCCollection = new _pc.PersoniumCollection(accessor , path);
		var objEntityTypeManager = new _pc.EntityTypeManager(accessor, objjDCCollection);
		var json = {
				"Name" : entityTypeName
		};
		var objjEntityType = new _pc.EntityType(accessor, json);
		var notExists = uEntityTypeOperations.entityNameAlreadyExists(accessor, entityTypeName, path);
		if(notExists){
			objCommon.showValidValueIcon('#txtETypeName');
			var response = objEntityTypeManager.create(objjEntityType);
			if (response.rawData != undefined && response.rawData.getStatusCode() == 201) {
				var successMsg = getUiProps().MSG0256;
				objCommon.displaySuccessMessage(successMsg, '#createETypeModal', "223px", "crudOperationMessageBlock");
				var entityTypeNames = uEntityTypeOperations.fetchEntityTypes(sessionStorage.selectedCollectionURL);
				uEntityTypeOperations.viewEntityTypeData(entityTypeNames);
				//uEntityTypeOperations.updateViewAfterEntityTypeOperations(path, entityTypeNames);
				sessionStorage.selectedEntityTypeCount = 0;
				$("#entityTypeCol_"+sessionStorage.selectedEntityTypeCount).addClass("entityTypeRowSelect");
				if(sessionStorage.ODataSelectedTab === "schema"){
					$("#tabEntityName").text(entityTypeNames[0]);
					$("#tabEntityName").attr('title',entityTypeNames[0]);
					var url = sessionStorage.selectedCollectionURL + "/" + entityTypeNames[0];
					$("#propertyToolBarRight").text(url);
					$("#propertyToolBarRight").attr('title', url);
					if ($("#AssociationTab").hasClass("genericSelectRed")) {
						$('#propertyTerNav').hide();
						$('#PropertyViewBody').hide();
						document.getElementById("PropertyViewEmptyBody").style.display = "none";
						//uSchemaManagement.createSchematicDiagram();
						uSchemaManagement.loadAssociationEndViewMode();
					} else if ($("#PropertyTab").hasClass("genericSelectRed")) {
						uEntityTypeOperations.updatePropertyView(entityTypeNames[0]);
					}
					uEntityTypeOperations.setSchemaTabEntityListDynamicHeight();
					uEntityTypeOperations.setDynamicWidthForEntityTypeList();
				}else if(sessionStorage.ODataSelectedTab === "data"){
					$("#entityTypeName").text(entityTypeNames[0]);
					$("#entityTypeName").attr('title',entityTypeNames[0]);
					var collectionURL = sessionStorage.selectedCollectionURL;
					if(!(collectionURL.endsWith('/'))){
						collectionURL = collectionURL + '/';
					}
					var entityTypeURL = collectionURL + entityTypeNames[0];
					$("#createODataEntityIcon").removeClass("createIcon");
					$("#createODataEntityIcon").addClass("createIconWebDavDisabled");
					$("#createODataEntityText").removeClass("createText");
					$("#createODataEntityText").addClass("createTextWebDavDisabled");
					$("#createOdataEntityWrapper").css("cursor","default");
					$("#createOdataEntityWrapper").removeClass("enabled");
					$("#entityTypeURL").text(entityTypeURL);
					$("#entityTypeURL").attr('title',entityTypeURL);
					$("#txtBoxQuery").val("Type your query");
					$("#dvNoPropertyMsg").css("display","block");
					$("#odataGrid").css("display","none");
					sessionStorage.propertiesCount = 0;
					uEntityTypeOperations.setDynamicHeight();
					uEntityTypeOperations.setDynamicWidthForEntityTypeList();
				}
				$("#entityTypeBody").show();
				$("#odataRightView").show();
				$("#dvemptyTableMessageOdata").hide();
				//uEntityTypeOperations.updatePropertyView(entityTypeNames[0]);
				uDataManagement.getHeaderList(entityTypeNames[0]);
			}
			
		}else{
			document.getElementById("popupETypeErrorMsg").innerHTML = getUiProps().MSG0060;
			removeSpinner("modalSpinnerEntityType");
			objCommon.showErrorIcon('#txtETypeName');
			return false;
		}
	}
	removeSpinner("modalSpinnerEntityType");
};


/**
 * The purpose of this method is to store the reference of current selected tab.
 */
entityTypeOperations.prototype.setCurrentSelectedTab = function(source){
	sessionStorage.ODataSelectedTab = source;
};

/**
 * The purpose of this method is to highlight the row on selecting it and update tab.
 * @param obj
 * @param count
 */
entityTypeOperations.prototype.rowSelect = function(obj, count){
	objCommon.hideListTypePopUp();
	$(obj).parent().siblings().children().removeClass("entityTypeRowSelect");
	$(obj).addClass("entityTypeRowSelect");
	var selectedEntityType = document.getElementById("entityTypeDv_" + count).title;
	var collectionURL = sessionStorage.selectedCollectionURL;
	sessionStorage.selectedEntityTypeCount = count;
	uDataManagement.getHeaderList(selectedEntityType);
	
	//if schema tab is selected then update property view
	if(sessionStorage.ODataSelectedTab === "schema"){
		//var collectionURL = objOdata.currentCollectionPath;
		if(!(collectionURL.endsWith('/'))){
			collectionURL = collectionURL + '/';
		}
		var entityTypeURL = collectionURL + selectedEntityType;
		$("#propertyToolBarRight").text(entityTypeURL);
		$("#propertyToolBarRight").attr('title',entityTypeURL);
		if (document.getElementById('entityTypeName') == null && document.getElementById('tabEntityName') != null) {
			$("#tabEntityName").text(selectedEntityType);
			$("#tabEntityName").attr('title',selectedEntityType);
		}
		if ($("#propDetailLabel") !== undefined) {
			$("#propDetailLabel").text("");
			$("#propDetailLabel").attr('title',"");
		}
		this.updatePropertyView(selectedEntityType);
	}else if(sessionStorage.ODataSelectedTab === "data"){
		$("#errorMsgODataQuery").hide();
		$("#entityTypeName").text(selectedEntityType);
		$("#entityTypeName").attr('title',selectedEntityType);
		//var collectionURL = objOdata.currentCollectionPath;
		if(!(collectionURL.endsWith('/'))){
			collectionURL = collectionURL + '/';
		} 
		var entityTypeURL = collectionURL + selectedEntityType; 
		$("#entityTypeURL").text(entityTypeURL);
		$("#entityTypeURL").attr('title',entityTypeURL);
		uDataManagement.enableButtonsForGridView();
		if(uDataManagement.propertyDetailsList.length > 0){
			//if(sessionStorage.ODataViewSelectedTab == "grid"){
				$("#dvNoPropertyMsg").css("display","none");
				$("#odataGrid").css("display","block");
				sessionStorage.propertiesCount = uDataManagement.propertyDetailsList.length;
				uDataManagement.createHeaderForEntityTable(uDataManagement.propertyDetailsList, false);
				uDataManagement.setHeaderColsWidth();
				uDataManagement.setDynamicWidthForODataGrid();
				$("#entityTable").scrollLeft(0);
				$("#entityTable").scrollTop(0);
			/*}else if(sessionStorage.ODataViewSelectedTab == "raw"){
				uDataManagement.clickRawTab();
			}*/
			uDataManagement.enableGoButton();
			$("#txtBoxQuery").val("/"+selectedEntityType);
			$("#createODataEntityIcon").addClass("createIcon");
			$("#createODataEntityIcon").removeClass("createIconWebDavDisabled");
			$("#createODataEntityText").addClass("createText");
			$("#createODataEntityText").removeClass("createTextWebDavDisabled");
			$("#createOdataEntityWrapper").css("cursor","pointer");
			$("#createOdataEntityWrapper").addClass("enabled");
		}else{
		//	if(sessionStorage.ODataViewSelectedTab == "grid"){
				$("#dvNoPropertyMsg").css("display","block");
				$("#odataGrid").css("display","none");
				$("#recordCount_OdataGrid").html("0 - 0 "+getUiProps().MSG0323+" 0");
				sessionStorage.propertiesCount = 0;
			/*}else if(sessionStorage.ODataViewSelectedTab == "raw"){
				uDataManagement.clickRawTab();
			}*/
			uDataManagement.disableGoButton();
			$("#txtBoxQuery").val("Type your query");
			$("#createODataEntityIcon").removeClass("createIcon");
			$("#createODataEntityIcon").addClass("createIconWebDavDisabled");
			$("#createODataEntityText").removeClass("createText");
			$("#createODataEntityText").addClass("createTextWebDavDisabled");
			$("#createOdataEntityWrapper").css("cursor","default");
			$("#createOdataEntityWrapper").removeClass("enabled");
		}
	}
	if ($("#AssociationTab").hasClass("genericSelectRed")) {
		$('#propertyTerNav').hide();
		$('#PropertyViewBody').hide();
		document.getElementById("PropertyViewEmptyBody").style.display = "none";
		//uSchemaManagement.createSchematicDiagram();
		uSchemaManagement.loadAssociationEndViewMode();
	}
	/*if(sessionStorage.odataTabName == "listView"){
		uEntityTypeProperty.createPropertyTable(selectedEntityType);
	}else if(sessionStorage.odataTabName == "associationView"){
		document.getElementById("toggleButton").value = "Edit Mode";
		document.getElementById("toggleButton").title = "Edit Mode";
		$(".tableMode").hide();
		$(".diagramMode").show();
		uSchemaManagement.createSchematicDiagram();
		uSchemaManagement.createEditModeAssociationTable(selectedEntityType);
	}else if(sessionStorage.odataTabName == "dataMgmt"){
		objOdataCommon.openDataMgmtPage();
	}*/
};


/**
 * The purpose of this method is to create entity type list view.
 * @param entityTypeList
 */
entityTypeOperations.prototype.createEntityTypeListView = function(entityTypeList){
	$("#entityTypeTbody").scrollTop(0);
	var noOfEntityTypes = entityTypeList.length;
	var dynamicRows = "";
	for ( var index = 0; index < noOfEntityTypes; index++) {
		//var shortenedEntityTypeName = objCommon.getShorterEntityName(entityTypeList[index]);
		/*dynamicRows = dynamicRows + '<tr id="entityTypeRow_'+ index +'" class="entityTypeRow" onclick="uEntityTypeOperations.rowSelect(this,'+ index +')";><td valign="top" style="padding-left:18px;padding-right:21px;"><div class="entityTypeList" id="entityTypeCol_'+ index +'"  title="'+ entityTypeList[index] +'">'+
		entityTypeList[index] +'</div></td></tr>';*/
		dynamicRows += "<tr><td id='entityTypeCol_"+ index +"' onclick='uEntityTypeOperations.rowSelect(this,"+ index +")'; style='width:100%;'><div id='entityTypeDv_"+ index +"' class='entityTypeRow mainTableEllipsis' title='"+ entityTypeList[index] +"'>"+ entityTypeList[index] +"</div></td><td style='width:0%;'></td></tr>";
	}
	$("#entityTypeTbody").html(dynamicRows);
	uEntityTypeOperations.setDynamicWidthForEntityTypeList();
	/*$("#mainEntityTypeTable tbody").html(dynamicRows);
	$("#mainEntityTypeTable tbody tr").removeClass("entityTypeRowSelect");
	$("#mainEntityTypeTable tbody tr:first").addClass("entityTypeRowSelect");
	var selectedEntityType = document.getElementById("entityTypeCol_0").title;
	var shortenedEType = "";
	if(selectedEntityType.length > 9){
		shortenedEType = selectedEntityType.substring(0, 9) + "..";
	}else{
		shortenedEType = selectedEntityType;
	}
	$("#tabEntityName").text(selectedEntityType);
	document.getElementById("tabEntityName").title = selectedEntityType;*/
};

/**
 * The purpose of this method is to view data for entity type tab
 * @param entityNames
 */
entityTypeOperations.prototype.viewEntityTypeData = function(entityNames){
	if(entityNames != undefined && entityNames.length > 0){
		uEntityTypeOperations.createEntityTypeListView(entityNames);
		$("#dvemptyTableMessageOdata").hide();
	} else {
		if ($("#OdataSchemaTab").hasClass("odataTabSelected")) {
			$("#entityTypeRawIcon").addClass('schemaRawIconDisabled');
			$("#entityTypeRawIcon").attr("disabled",true);
		}
		$("#entityTypeBody tbody").empty();
		$("#dvemptyTableMessageOdata").show();
		uDataManagement.setMarginForNoEntityTypeMsg();
		$("#entityTypeBody").hide();
		$("#odataRightView").hide();
	}
};

/**
 * The purpose of this method is to call API to fetch entity types.
 */
entityTypeOperations.prototype.fetchEntityTypes = function(url){
	sessionStorage.entityTypeCount = 0;
	var baseUrl  = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objjDCCollection = new _pc.PersoniumCollection(accessor , url);
	var objEntityTypeManager = new _pc.EntityTypeManager(accessor, objjDCCollection);
	var uri = objEntityTypeManager.getUrl();
	uri = uri + "?$orderby=__updated desc &$top=100";
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var entityTypeNames = [];
	try {
		var response = restAdapter.get(uri, "application/json");
		var sortedJSONString = response.bodyAsJson().d.results;
		var totalRecordsize = sortedJSONString.length;
		var updatedDate = [];
		sessionStorage.entityTypeCount = totalRecordsize;
		for ( var count = 0; count < totalRecordsize; count++) {
			var obj = sortedJSONString[count];
			entityTypeNames[count] = obj.Name;
			updatedDate[count] = obj.__updated;
		}
		uEntityTypeOperations.entityTypeNames = entityTypeNames;// = {"entityTypeNames":entityTypeNames};
	} catch (exception) {
		throw exception;
	}
	return entityTypeNames;
};

/**
 * The purpose of this method is to validate the complex type name as per the 
 * specifications.
 * @param entityTypeName
 * @returns {Boolean}
 */
entityTypeOperations.prototype.validateComplexTypeName = function(complexTypeName, txtBoxId){
	var letters = /^[0-9a-zA-Z-_]+$/;
	var specialCharacter = /^[-_]*$/;
	var lenCTypeName = complexTypeName.length;
	if (lenCTypeName < 1 || complexTypeName == undefined || complexTypeName == null
			|| complexTypeName == "") {
		document.getElementById("popupCTypeErrorMsg").innerHTML = getUiProps().MSG0067;
		objCommon.showErrorIcon(txtBoxId);
		return false;
	} else if (lenCTypeName > 128) {
		document.getElementById("popupCTypeErrorMsg").innerHTML = getUiProps().MSG0068;
		objCommon.showErrorIcon(txtBoxId);
		return false;
	} else if (lenCTypeName != 0 && !(complexTypeName.match(letters))) {
		document.getElementById("popupCTypeErrorMsg").innerHTML = getUiProps().MSG0023;
		objCommon.showErrorIcon(txtBoxId);
		return false;
	}else if(lenCTypeName != 0 && (specialCharacter.toString().indexOf(complexTypeName.substring(0, 1)) >= 0)) {
		document.getElementById("popupCTypeErrorMsg").innerHTML = getUiProps().MSG0087;
		objCommon.showErrorIcon(txtBoxId);
		return false;
	}
	objCommon.showValidValueIcon(txtBoxId);
	return true;
};

/**
 * The purpose of this method is to validate if complex type name already exists.
 * @param accessor
 * @param entityTypeName
 * @param path
 * @returns
 */
entityTypeOperations.prototype.complexTypeNameAlreadyExists = function(accessor, complexTypeName, path){
	var objjDCCollection = new _pc.PersoniumCollection(accessor , path);
	var objComplexTypeManager = new _pc.ComplexTypeManager(accessor, objjDCCollection);
	var status = false;
	try {
		objComplexTypeManager.retrieve(complexTypeName);
		status = false;
	} catch(exception) {
		status = true;
	}
	return status;
};

/**
 * The purpose of this method is to create complex type by calling API.
 * @returns {Boolean}
 */
entityTypeOperations.prototype.createComplexType = function(){
	showSpinner("modalSpinnerEntityType");
	//var objEntityType = new entityTypeOperations();
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var path = sessionStorage.selectedCollectionURL;//baseUrl+cellName+"/"+boxName + "/" + colName;
	var complexTypeName = document.getElementById("txtCTypeName").value;
	if (uEntityTypeOperations.validateComplexTypeName(complexTypeName, '#txtCTypeName')) {
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var objjDCCollection = new _pc.PersoniumCollection(accessor , path);
		var objComplexTypeManager = new _pc.ComplexTypeManager(accessor, objjDCCollection);
		var json = {
				"Name" : complexTypeName
		};
		var notExists = uEntityTypeOperations.complexTypeNameAlreadyExists(accessor, complexTypeName, path);
		if(notExists){
			var response = objComplexTypeManager.create(json);
			if (response != undefined && response.getStatusCode() == 201) {
				var successMsg = getUiProps().MSG0263;
				objCommon.displaySuccessMessage(successMsg, '#createCTypeModal', "240px", "crudOperationMessageBlock");
				uSchemaManagement.bindComplexTypeList();
			}
		}else{
			document.getElementById("popupCTypeErrorMsg").innerHTML = getUiProps().MSG0069;
			removeSpinner("modalSpinnerEntityType");
			objCommon.showErrorIcon('#txtCTypeName');
			return false;
		}
	}
	removeSpinner("modalSpinnerEntityType");
};

/********************************Edit Entity Type Start****************************************/

/**
 * The purpose of this function is to get the information for editing entity type
 */
entityTypeOperations.prototype.getEditEntityTypeName = function () {
	objCommon.removeStatusIcons('#txtEditEntityTypeName');
	document.getElementById("editEnityTypeErrorMsg").innerHTML = "";
	var entityTypeName = $('#tabEntityName').text();
	sessionStorage.selectedEntityType = entityTypeName;
	$('#txtEditEntityTypeName').val(entityTypeName);
	openCreateEntityModal('#enityTypeEditModalWindow','#entityTypeEditDialogBox', 'txtEditEntityTypeName');
};

/**
 * The purpose of this function is to perform edit operation on entity type.
 * @param existingEntityName
 * @param body
 * @param objJEntityTypeManager
 */
entityTypeOperations.prototype.editEntityType = function (existingEntityName, body, objJEntityTypeManager) {
	var etag = objJEntityTypeManager.getEtag(existingEntityName);
	var response = objJEntityTypeManager.update(existingEntityName, body, etag);
	if(response.getStatusCode() == 204) {
		var message =  getUiProps().MSG0254;
		objCommon.displaySuccessMessage(message, '#enityTypeEditModalWindow', "228px", "crudOperationMessageBlock");
		var entityTypeNames = uEntityTypeOperations.fetchEntityTypes(sessionStorage.selectedCollectionURL);
		uEntityTypeOperations.viewEntityTypeData(entityTypeNames);
		//uEntityTypeOperations.updateViewAfterEntityTypeOperations(sessionStorage.selectedCollectionURL, entityTypeNames);
		sessionStorage.selectedEntityTypeCount = 0;
		$("#entityTypeCol_"+sessionStorage.selectedEntityTypeCount).addClass("entityTypeRowSelect");
		$("#tabEntityName").text(entityTypeNames[0]);
		$("#tabEntityName").attr('title',entityTypeNames[0]);
		var url = sessionStorage.selectedCollectionURL + "/" + entityTypeNames[0];
		$("#propertyToolBarRight").text(url);
		$("#propertyToolBarRight").attr('title', url);
		uEntityTypeOperations.setSchemaTabEntityListDynamicHeight();
		uDataManagement.getHeaderList(entityTypeNames[0]);
	} else if (response.getStatusCode() == 409) {
		var existMessage = getUiProps().MSG0060;
		editEnityTypeErrorMsg.innerHTML=existMessage;
	}
};

/**
 * The purpose of this function is to check validation before 
 * editing entity type and on the basis of condition link it to 
 * editEntityType function
 */
entityTypeOperations.prototype.updateEntityType = function () {
	showSpinner("modalSpinnerEntityType");
	var body = null;
	var existingEntityName = sessionStorage.selectedEntityType;
	var newEntityTypeName =  $('#txtEditEntityTypeName').val();
	if (uEntityTypeOperations.validateEntityTypeName(newEntityTypeName, "editEnityTypeErrorMsg", "#txtEditEntityTypeName")) {
		body = {"Name" : newEntityTypeName};
		var baseUrl = getClientStore().baseURL;
		if (!baseUrl.endsWith("/")) {
			baseUrl += "/";
		}
		var cellName = sessionStorage.selectedcell;
		var path = sessionStorage.selectedCollectionURL;
		var accessor = objCommon.initializeAccessor(baseUrl,cellName);
		var objjDCCollection = new _pc.PersoniumCollection(accessor , path);
		var objJEntityTypeManager = new _pc.EntityTypeManager(accessor,objjDCCollection);
		if (newEntityTypeName === existingEntityName) {
			uEntityTypeOperations.editEntityType(existingEntityName, body, objJEntityTypeManager);
			if ($("#AssociationTab").hasClass("genericSelectRed")) {
			uSchemaManagement.updateAssociationPage();
			} else if ($("#PropertyTab").hasClass("genericSelectRed")) {
				$('#propertyTerNav').show();
				$('#PropertyViewBody').show();
				var entityTypeNames = uEntityTypeOperations.fetchEntityTypes(sessionStorage.selectedCollectionURL);
				uEntityTypeOperations.updatePropertyView(entityTypeNames[0]);
			}
		} else {
			var status = false;
			try {
				objJEntityTypeManager.retrieve(newEntityTypeName);
				status = false;
			} catch(exception) {
				status = true;
			}
			if (status) {
				uEntityTypeOperations.editEntityType(existingEntityName, body, objJEntityTypeManager);
				if ($("#AssociationTab").hasClass("genericSelectRed")) {
					uSchemaManagement.updateAssociationPage();
					} if ($("#PropertyTab").hasClass("genericSelectRed")) {
						var entityTypeName = $('#tabEntityName').text();
						$('#propertyTerNav').show();
						$('#PropertyViewBody').show();
						var entityTypeNames = uEntityTypeOperations.fetchEntityTypes(sessionStorage.selectedCollectionURL);
						uEntityTypeOperations.updatePropertyView(entityTypeNames[0]);
					}
			} else {
				document.getElementById("editEnityTypeErrorMsg").innerHTML = "";
				var existMessage = getUiProps().MSG0060;
				objCommon.showErrorIcon('#txtEditEntityTypeName');
				document.getElementById("editEnityTypeErrorMsg").innerHTML = existMessage;
			}
		}
	}
	removeSpinner("modalSpinnerEntityType");
};

/********************************Edit Entity Type End****************************************/

/**
 * Th epurpose of this method is to show message after delete complex type operation
 */
entityTypeOperations.prototype.displayMsgForDeleteCompType = function(promise, complexTypeName){
	if(promise.resolvedValue != null && promise.resolvedValue.status == 204){
		var message = getUiProps().MSG0264;
		objCommon.displaySuccessMessage(message, '#compTypeDeleteModalWindow', "240px", "crudOperationMessageBlock");
		uSchemaManagement.bindComplexTypeList();
	}else if(promise.errorMessage != null && promise.errorMessage.status == 409){
		var message = getUiProps().MSG0265;
		objCommon.displayErrorMessage (message, '#compTypeDeleteModalWindow', "230px", "crudOperationMessageBlock");
	}
};

/**
 * This is the generic method to fetch the name of selected complex type
 * @returns {String}
 */
entityTypeOperations.prototype.getSelectedComplexType = function(){
	var complexTypeName = "";
	var noOfComplexTypes = $("#complexTypeList tbody tr").length;
	for(var index = 0; index < noOfComplexTypes; index++){
		if($("#complexTypeCol_" + index).hasClass("complexTypeRowSelect")){
			complexTypeName = document.getElementById("complexTypeLbl_" + index).title;
			break;
		}
	}
	return complexTypeName;
};

/**
 * The purpose of this method is to delete complex type by calling API.
 */
entityTypeOperations.prototype.deleteComplexType = function(){
	showSpinner("modalSpinnerEntityType");
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var path = sessionStorage.selectedCollectionURL;
	var complexTypeName = $('#tabComplexTypeName').text();
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objjDCCollection = new _pc.PersoniumCollection(accessor , path);
	var objComplexTypeManager = new _pc.ComplexTypeManager(accessor, objjDCCollection);
	var promise = objComplexTypeManager.del(path, complexTypeName,"*");
	uEntityTypeOperations.displayMsgForDeleteCompType(promise, complexTypeName);
	removeSpinner("modalSpinnerEntityType");
};
/********************************Delete Enity Type Start****************************************/

/**
 * The purpose of this function is to get the information for deleting entity type
 */
entityTypeOperations.prototype.DeleteEntityType = function () {
	var entityTypeName = $('#tabEntityName').text();
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var path = sessionStorage.selectedCollectionURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName);
	var objjDCCollection = new _pc.PersoniumCollection(accessor , path);
	var objJEntityTypeManager = new _pc.EntityTypeManager(accessor,objjDCCollection);
	var etag = objJEntityTypeManager.getEtag(entityTypeName);
	var promise = objJEntityTypeManager.del(entityTypeName, etag);
	if (promise != undefined) {
		uEntityTypeOperations.displayDeleteMessageForEntityType (promise, entityTypeName);
	}
};

/**
 * The purpose of this function is to display message for delete operation
 * @param promise
 * @param entityTypeName
 */
entityTypeOperations.prototype.displayDeleteMessageForEntityType = function (promise, entityTypeName) {
	if (promise.resolvedValue != null && promise.resolvedValue.status == 204) {
		var message = getUiProps().MSG0255;
		objCommon.displaySuccessMessage(message, '#entityTypeDeleteModalWindow', "223px", 'crudOperationMessageBlock');
		$("#crudOperationMessageBlock").css("display", 'table');
		var entityTypeNames = uEntityTypeOperations.fetchEntityTypes(sessionStorage.selectedCollectionURL);
		if (entityTypeNames.length == 0) {
			$("#AssociationTab").removeClass("genericSelectRed");
			$("#PropertyTab").addClass("genericSelectRed");
			$("#associationEndMainDiv").empty();
		}
		uEntityTypeOperations.viewEntityTypeData(entityTypeNames);
		//uEntityTypeOperations.updateViewAfterEntityTypeOperations(sessionStorage.selectedCollectionURL, entityTypeNames);
		uEntityTypeOperations.setDynamicWidthForEntityTypeList();
		sessionStorage.selectedEntityTypeCount = 0;
		$("#entityTypeCol_"+sessionStorage.selectedEntityTypeCount).addClass("entityTypeRowSelect");
		$("#tabEntityName").text(entityTypeNames[0]);
		$("#tabEntityName").attr('title',entityTypeNames[0]);
		var url = sessionStorage.selectedCollectionURL + "/" + entityTypeNames[0];
		$("#propertyToolBarRight").text(url);
		$("#propertyToolBarRight").attr('title', url);
		uEntityTypeOperations.setSchemaTabEntityListDynamicHeight();
		if ($("#AssociationTab").hasClass("genericSelectRed")) {
			$('#propertyTerNav').hide();
			$('#PropertyViewBody').hide();
			document.getElementById("PropertyViewEmptyBody").style.display = "none";
			if (entityTypeNames.length > 0) {
				uSchemaManagement.loadAssociationEndViewMode();
			}
		} else if ($("#PropertyTab").hasClass("genericSelectRed")) {
			$('#propertyTerNav').show();
			$('#PropertyViewBody').show();
			uEntityTypeOperations.updatePropertyView(entityTypeNames[0]);
		}
		if (entityTypeNames.length > 0) {
			uDataManagement.getHeaderList(entityTypeNames[0]);
		}
	} else if (promise.errorMessage != null && promise.errorMessage.status == 409) {
		var message = getUiProps().MSG0259;
		objCommon.displayErrorMessage (message, '#entityTypeDeleteModalWindow', "217px", "crudOperationMessageBlock");
	}
};
/********************************Delete Enity Type End****************************************/

/**
 * This is the generic method to fetch the name of selected entity type
 * @returns {String}
 */
entityTypeOperations.prototype.getSelectedEntityType = function(){
	var entityTypeName = "";
	var noOfEntityTypes = $("#entityTypeBody tbody tr").length;
	for(var index = 0; index < noOfEntityTypes; index++){
		if($("#entityTypeCol_" + index).hasClass("entityTypeRowSelect")){
			entityTypeName = document.getElementById("entityTypeDv_" + index).title;
			break;
		}
	}
	return entityTypeName;
};

/**
 * This is the generic method to return the selected entity type index.
 * @returns {Integer}
 */
entityTypeOperations.prototype.getSelectedEntityTypeIndex = function(){
	var entityTypeNameIndex = 0;
	var noOfEntityTypes = $("#entityTypeBody tbody tr").length;
	for(var index = 0; index < noOfEntityTypes; index++){
		if($("#entityTypeCol_" + index).hasClass("entityTypeRowSelect")){
			entityTypeNameIndex = index;
			break;
		}
	}
	return entityTypeNameIndex;
};

/**
 * The purpose of this method is to fetch the entity type names
 * @returns {Array}
 */
entityTypeOperations.prototype.fetchEntityTypeNameList = function(){
	var noOfEntityTypes = $("#entityTypeBody tbody tr").length;
	var entityTypeNameList = new Array();
	for(var index = 0; index < noOfEntityTypes; index++){
		entityTypeNameList.push(document.getElementById("entityTypeDv_" + index).title);
	}
	return entityTypeNameList;
};

/**
 * This function sets the content to be shown when Odata page is loaded.
 */
entityTypeOperations.prototype.setDataManagementContent = function(){
	sessionStorage.odataTabName = "dataMgmt";
	document.getElementById("odataMessageBlock").style.display = "none";
	document.getElementById("editEntityIconEnabled").style.display = "none";
	document.getElementById("deleteEntityIconEnabled").style.display = "none";	
	$("#schemaManagementHeader").removeClass("schemaManagementHeaderSelected");
	$("#schemaManagementHeader").addClass("schemaManagementHeaderUnSelected");
	$("#dataManagementHeader").removeClass("dataManagementHeaderUnSelected");
	$("#dataManagementHeader").addClass("dataManagementHeaderSelected");
	$("#schemaManagment").hide();
	$("#schemaManagment").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/dataManagement.html', function() {
		$("#schemaManagment").show();
		$("#boxTableDiv").show();
	});
};

/**
 * The purpose of thi smethod is to set dynamic height for EntityType List View.
 */
entityTypeOperations.prototype.setDynamicHeight = function(){
	var height = $(window).height();

	//Web DAV Details Panel Height - Start
	var fixedHeight = 18+43+27+30+26+23+11+34+42+10+31;
	var entityTypeListHeight = (height - fixedHeight);
	var entityTypeBodyHeight = (entityTypeListHeight - 35 - 10 - 5);
	//Web DAV Details Panel Height - End

	if (height>650){
		$(".entityTypeList").css('min-height', entityTypeListHeight + "px");
		$("#entityTypeTbody").css("max-height",entityTypeBodyHeight + "px");
	}else{
		$(".entityTypeList").css('min-height', "355px");
		$("#entityTypeTbody").css("max-height","305px");
	}
};

/**
 * The purpose of this method is to set dynamic widths of entitytype list data
 * view port size.
 */
entityTypeOperations.prototype.setDynamicWidthForEntityTypeList = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;

	/** OData EntityType width - Start */
	var availableWidthForOData = rightPanelWidth - 15 - 20;
	var availableWidthForEntityTypeListPanel = Math.round(((19.95114/100)*availableWidthForOData));
	var entityTypeNameWidth = (availableWidthForEntityTypeListPanel - 5 - 5 - 6 - 10);

	var scrollBarWidth = 5;
	if(document.getElementById("entityTypeTbody") != null && document.getElementById("entityTypeTbody") != undefined){
		var tbodyObject = document.getElementById("entityTypeTbody");
		if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
			scrollBarWidth = 0;
		}
	}
	/** OData EntityType width - End */

	if (width>1280) {
		$(".entityTypeRow").css('max-width', (entityTypeNameWidth + scrollBarWidth) + "px");
	}else{
		$(".entityTypeRow").css('max-width', (223 + scrollBarWidth) + "px");
		//$("#entityTypeTbody tr td").css("width","226px");
	}
};

$(window).resize(function(){
	if ($("#OdataSchemaTab").hasClass("odataTabSelected")) {
		uEntityTypeOperations.setSchemaTabEntityListDynamicHeight();
		uEntityTypeOperations.setPropertyDynamicHeight();
	} else if ($("#OdataDataTab").hasClass("odataTabSelected")) {
		uEntityTypeOperations.setDynamicHeight();
	}
	uEntityTypeOperations.setDynamicWidthForEntityTypeList();
});

/**
 * The purpose of this method is to update property view on entity type selection.
 * @param selectedEntityType
 */
entityTypeOperations.prototype.updatePropertyView = function(selectedEntityType, spinnerCallback){
	if($("#PTBAREntityLabel")!== undefined){
		$("#PTBAREntityLabel").text(selectedEntityType);
		$("#PTBAREntityLabel").attr('title',selectedEntityType);
	}
	if(selectedEntityType !== undefined){
		uEntityTypeProperty.createPropertyTable(selectedEntityType, spinnerCallback);
	}
};


/**
 * The purpose of this function is to open schema management page for entity type.
 */
entityTypeOperations.prototype.openSchemaMgmtView = function() {
	objCommon.hideListTypePopUp();
	this.setCurrentSelectedTab("schema");
	var id = objCommon.isSessionExist();
	if (id != null) {
		var target = document.getElementById('spinner');
		var spinner = new Spinner(opts).spin(target);
		$("#odataContentArea").empty();
		$("#complexTypeList").hide();
		$("#odataContentArea")
				.load(
						contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/schemaManagement.html',
						function() {
							$("#OdataDataTab").removeClass("odataTabSelected");
							$("#OdataSchemaTab").css("color", "#c80000");
							$("#OdataSchemaTab").addClass("odataTabSelected");
							$("#entityTypeRawIcon").addClass('schemaRawIconDisabled');
							$("#entityTypeRawIcon").attr("disabled",true);
							uEntityTypeOperations.setPropertyDynamicHeight();
							//var entityTypeNames = uEntityTypeOperations.entityTypeNames;
							//Fresh call to fetch entity names instead of picking them up from session storage.
							var entityTypeNames = uEntityTypeOperations.fetchEntityTypes(sessionStorage.selectedCollectionURL);
							uEntityTypeOperations
									.viewEntityTypeData(entityTypeNames);
							uEntityTypeOperations
									.setSchemaTabEntityListDynamicHeight();
							setTimeout(function() {
								uEntityTypeOperations
										.setDynamicWidthForEntityTypeList();
							}, 50);
							$(
									"#entityTypeCol_"
											+ sessionStorage.selectedEntityTypeCount)
									.addClass("entityTypeRowSelect");
							var selectedEntityTypeName = uEntityTypeOperations
									.getSelectedEntityType();
							$("#tabEntityName").text(selectedEntityTypeName);
							$("#tabEntityName").attr('title',
									selectedEntityTypeName);
							var url = sessionStorage.selectedCollectionURL
									+ "/" + selectedEntityTypeName;
							$("#propertyToolBarRight").text(url);
							$("#propertyToolBarRight").attr('title', url);
							spinner.stop();
							if (entityTypeNames != null	&& entityTypeNames.length > 0) {
								var selectedEntityType = document
										.getElementById("entityTypeDv_"
												+ sessionStorage.selectedEntityTypeCount).title;
								if (selectedEntityType !== undefined) {
									uEntityTypeOperations
											.updatePropertyView(selectedEntityType);
								}
							}
							$("#entityTypeCreateIcon").click(
									function() {
										openCreateEntityModal(
												'#createETypeModal',
												'#createETypeDialog', 'txtETypeName');
									});
							$("#entityTypeRefreshIcon").click(function() {
								uEntityTypeOperations.refreshEntityTypeList();
							});
						});
	} else { //
		window.location.href = contextRoot;
	}
};

/**
 * The purpose of this function is to set dynamic height of entity list grid in
 * schema tab
 */
entityTypeOperations.prototype.setSchemaTabEntityListDynamicHeight = function(){
	var height = $(window).height();
	var entityTypeBodyHeight = height-388;
	var entityTypeListHeight = entityTypeBodyHeight+93;
	if (height>650){
		$(".entityTypeList").css('min-height', entityTypeListHeight + "px");
		$("#entityTypeTbody").css("max-height",entityTypeBodyHeight + "px");
	}else{
		$(".entityTypeList").css('min-height', "355px");
		$("#entityTypeTbody").css("max-height","262px");
	}
};

/**
 * The purpose of this method is to set dynamic height for Property List View.
 */
entityTypeOperations.prototype.setPropertyDynamicHeight = function(){
	var height = $(window).height();
	var entityTypeBodyHeight = height-430;
	if (height>650){
		var propertyTableHeight=entityTypeBodyHeight+19;
		$("#PropertyViewEmptyBody").css("height",entityTypeBodyHeight + "px");
		$("#propertyListLHSEmpty").css("height",(propertyTableHeight +7) + "px");
		$("#odataRightView").css("height",(entityTypeBodyHeight +5) + "px");
		$("#propertyListTbody").css("max-height",(propertyTableHeight +7)+ "px");
		$("#propertyListTbody").css("height",(propertyTableHeight +7) + "px");
		$("#propertyDetailsView").css("max-height",propertyTableHeight  + "px");
		$("#PropertyViewBodyRight").css("height","0px");
		$("#propertyListLHS").css("height","0px");
	}else if (height <= 650){
		$("#PropertyViewEmptyBody").css("height","190px");
		$("#propertyListLHSEmpty").css("height","247px");
		$("#odataRightView").css("height","332px");
		$("#propertyListTbody").css("max-height","246px");
		$("#propertyListTbody").css("height","246px");
		$("#propertyDetailsView").css("max-height","243px");
		$("#PropertyViewBodyRight").css("height","0px");
		$("#propertyListLHS").css("height","0px");
	}
};


/**
 * Following method reloads entity type list and its data on the RHS.
 */
entityTypeOperations.prototype.refreshEntityTypeList = function () {
	$(".disableRefreshEntityType").css("pointer-events","none");
	var entityTypeNames = uEntityTypeOperations.fetchEntityTypes(sessionStorage.selectedCollectionURL);
	var noOfRecords = entityTypeNames.length;
	var target = document.getElementById('spinner');
		spinner = new Spinner(opts).spin(target);
		setTimeout(function() {
				uEntityTypeOperations.viewEntityTypeData(entityTypeNames);
				if (document.getElementById('entityTypeCol_0') != null) {
					var objTableCellElement = document.getElementById('entityTypeCol_0');
					uEntityTypeOperations.rowSelect(objTableCellElement,0);
				}
				if (noOfRecords == 1) {
					$("#entityTypeBody").show();
					$("#odataRightView").show();
				}
				
			if (spinner != undefined){
				spinner.stop();
				$(".disableRefreshEntityType").css("pointer-events","all");
			}
		}, 50);
	if (noOfRecords == 0) {
			spinner.stop();
		}
};

/**
 * The purpose of this method is to return folder heirarchy path from collection
 * @param boxName
 * @returns
 */
entityTypeOperations.prototype.getFolderHeirarchy = function(boxName) {
	var collectionURL = sessionStorage.selectedCollectionURL;
	var urlArray = collectionURL.split("/");
	urlArray.splice(0,urlArray.length - 1);
	var folderPath = urlArray.join("/");
	if (folderPath.startsWith("/")) {
		folderPath = folderPath.substring(1, folderPath.length);
	}
	if (folderPath.endsWith("/")) {
		folderPath = folderPath.substring(0, folderPath.length - 1);
	}
	return folderPath;
};

/**
 * This function is called on page load.
 */
$(function(){
	$("#btnEditEntityType").click(function() {
		uEntityTypeOperations.updateEntityType();
	});
	$("#btnDeleteEntityType").click(function() {
		uEntityTypeOperations.DeleteEntityType();
	});

	/**
	 * Checks validation of create Complex type on blur event.
	 */
	$("#txtCTypeName").blur(function() {
		var complexTypeName = document.getElementById("txtCTypeName").value;
		if (uEntityTypeOperations.validateComplexTypeName(complexTypeName, '#txtCTypeName'))
		document.getElementById("popupCTypeErrorMsg").innerHTML = '';
	});

	/**
	 * Checks validation of create Entity type on blur event.
	 */
	$("#txtETypeName").blur(function() {
		var entityTypeName = document.getElementById("txtETypeName").value;
		if (uEntityTypeOperations.validateEntityTypeName(entityTypeName, "popupETypeErrorMsg", "#txtETypeName")) 
			document.getElementById("popupETypeErrorMsg").innerHTML = '';
	});


/**
 * Checks validation of edit Entity type on blur event.
 */
$("#txtEditEntityTypeName").blur(function() {
	var newEntityTypeName =  $('#txtEditEntityTypeName').val();
	if (uEntityTypeOperations.validateEntityTypeName(newEntityTypeName, "editEnityTypeErrorMsg", "#txtEditEntityTypeName"))
		document.getElementById("editEnityTypeErrorMsg").innerHTML = '';
});
});