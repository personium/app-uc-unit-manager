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
function entityTypeProperty() {
}

var uEntityTypeProperty = new entityTypeProperty();
entityTypeProperty.prototype.propertyDetailsList = new Array();
entityTypeProperty.prototype.lastSelectedValue =-2;
/** ****************** PROPERTY CREATE : START ******************* */

/**
 * The purpose of this function is to empty all the field values on Property
 * modal pop up.
 */
entityTypeProperty.prototype.emptyPropertyPopUpFieldsValues = function() {
	var selectedEntityTypeName = uEntityTypeOperations.getSelectedEntityType();
	uEntityTypeProperty.getComplexTypeNamesList();
	$("#idPropBooleanType").hide();
	$("#idPropDefaultValue").show();
	$("#idPropStringType").hide();
	$("#txtBoxPropDefaultValue").removeAttr('disabled');
	uEntityTypeProperty.setHTMLVal('#txtBoxPropertyName', '');
	uEntityTypeProperty.setHTMLVal('#txtBoxEntityTypeName', selectedEntityTypeName);
	uEntityTypeProperty.setHTMLVal('#dropDownPropType', '');
	uEntityTypeProperty.setHTMLVal('#dropDownPropNullable', '');
	uEntityTypeProperty.setHTMLVal('#txtBoxPropDefaultValue', '');
	uEntityTypeProperty.setHTMLVal('#dropDownPropCollectionKind', '');
	uEntityTypeProperty.setHTMLVal('#dropDownPropIsKey', '');
	uEntityTypeProperty.setHTMLVal('#txtBoxPropUniqueKey', '');
	uEntityTypeProperty.setHTMLVal('#txtAreaPropDefaultValue', '');
	uEntityTypeProperty.setErrorMessageSpanVal('#propertyNameErrorMsg', '');
	uEntityTypeProperty.setErrorMessageSpanVal('#typePropertyDDErrorMsg', '');
	uEntityTypeProperty.setErrorMessageSpanVal('#nullablePropDDErrorMsg', '');
	uEntityTypeProperty.setErrorMessageSpanVal('#defaultValuePropErrorMsg', '');
	uEntityTypeProperty.setErrorMessageSpanVal('#collectionKindPropDDErrorMsg', '');
	uEntityTypeProperty.setErrorMessageSpanVal('#isKeyPropDDErrorMsg', '');
	uEntityTypeProperty.setErrorMessageSpanVal('#propUniqueKeyErrorMsg', '');
	uEntityTypeProperty.setErrorMessageSpanVal('#defaultValuetxtAreaPropErrorMsg', '');
	uEntityTypeProperty.removeStatusIcons('#txtBoxPropertyName');
	uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
	uEntityTypeProperty.removeStatusIcons('#txtBoxPropUniqueKey');
	//var input = document.getElementById("txtBoxPropDefaultValue");
	//input.type = "text";
	var selectedIndexValue = document.getElementById("dropDownPropType").selectedIndex;
	  if (selectedIndexValue == 0){
			var input = document.getElementById("txtBoxPropDefaultValue");
			input.type = "text";
			$("#defaultTime").remove();
			uEntityTypeProperty.setHTMLVal('#txtBoxPropDefaultValue', '');
			$("#txtBoxPropDefaultValue").css("width", '215px');
			$("#txtBoxPropDefaultValue").css("padding-right", '25px');
			}
};

/**
 * The purpose of this function is to set HTML elements values.
 * 
 * @param fieldID
 * @param fieldValue
 */
entityTypeProperty.prototype.setHTMLVal = function(fieldID, fieldValue) {
	$(fieldID).val(fieldValue);
};

/**
 * The purpose of this function is set error span value.
 * 
 * @param spanID
 * @param spanValue
 */
entityTypeProperty.prototype.setErrorMessageSpanVal = function(spanID,
		spanValue) {
	$(spanID).html(spanValue);
};

/**
 * The purpose of this function is to get Property popup values.
 * 
 * @param id
 * @returns
 */
entityTypeProperty.prototype.getPropertyPopUpValues = function(id) {
	var value = $(id).val();
	return value;
};

/**
 * The purpose of this function is to retrieve the ComplexType list and bind
 * that list in Type drop down.
 */
entityTypeProperty.prototype.getComplexTypeNamesList = function() {
	var sortedJSONString = uSchemaManagement.fetchComplexTypes(sessionStorage.selectedCollectionURL);
	var complexTypeNames = "";
	var totalRecordsize = sortedJSONString.length;
	for ( var count = 0; count < totalRecordsize; count++) {
		var obj = sortedJSONString[count];
		complexTypeNames += obj;
		complexTypeNames += ",";
	}
	uComplexTypeProperty.bindTypeDDWithComplexType("dropDownPropType",
			"Property", complexTypeNames, totalRecordsize);
};

/**
 * The purpose of this function is to create DefaultValue drop down, if
 * type selected is Edm.Boolean.
 */
entityTypeProperty.prototype.createDefaultValueDropDownForBoolean = function() {
	var typeSelected = $("#dropDownPropType").val();
	var propSelectedNullable = uEntityTypeProperty.getPropertyPopUpValues('#dropDownPropNullable');
	$('#dropDownPropTypeBoolean').find('option').remove();
	if (typeSelected === "Edm.Boolean" && propSelectedNullable == 'true') {
		var mySelect = $('#dropDownPropTypeBoolean');
		mySelect.append($('<option></option>').val('true').html('True'));
		mySelect.append($('<option></option>').val('false').html('False'));
		mySelect.append($('<option></option>').val('null').html('Null'));
	} else if (typeSelected === "Edm.Boolean" && propSelectedNullable == 'false') {
		var mySelect = $('#dropDownPropTypeBoolean');
		mySelect.append($('<option></option>').val('true').html('True'));
		mySelect.append($('<option></option>').val('false').html('False'));
	}
};

/**
 * The purpose of this function is to set Default Value field type as per type
 * selected from the Type drop down.
 */
entityTypeProperty.prototype.setPropDefaultValueFieldAsPerType = function() {
	var selectedIndexValue = document.getElementById("dropDownPropType").selectedIndex;
	if(uEntityTypeProperty.lastSelectedValue!==selectedIndexValue) {
		uEntityTypeProperty.lastSelectedValue=selectedIndexValue;
		var CONSTFIVE = 5;
		$("#defaultTime").remove();
		uEntityTypeProperty.setErrorMessageSpanVal('#nullablePropDDErrorMsg', '');
		uEntityTypeProperty.setErrorMessageSpanVal('#txtBoxPropDefaultValue', '');
		uEntityTypeProperty.setErrorMessageSpanVal('#typePropertyDDErrorMsg', '');
		uEntityTypeProperty.setErrorMessageSpanVal('#defaultValuePropErrorMsg', '');
		uEntityTypeProperty.setErrorMessageSpanVal('#defaultValuetxtAreaPropErrorMsg', '');
		var typeSelected = $("#dropDownPropType").val();
		var input = document.getElementById("txtBoxPropDefaultValue");
		input.type = "";
		$("#txtBoxPropDefaultValue").removeAttr('disabled');
		uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
		if (selectedIndexValue > CONSTFIVE) {
			input.type = "text";
			uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
			$('#txtBoxPropDefaultValue').val('');
			$("#txtBoxPropDefaultValue").attr('disabled', 'disabled');
		}
		if (typeSelected === "Edm.DateTime") {
			var dateTabIndex = $('#txtBoxPropDefaultValue').attr('tabindex');
			input.type="date";
			var input = document.createElement("input");
			input.type = "time";
			input.step = "1";
			input.className = "time"; // set the CSS class
			input.id="defaultTime";
			$("#defaultValueDiv").append(input);
			$("#defaultTime").css("margin-top","-50px");
			$("#defaultTime").css("width","114px");
			$("#defaultTime").css("padding-left","0px");
			$("#defaultTime").attr('tabindex', dateTabIndex);
			uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
			$('#txtBoxPropDefaultValue').addClass('unstyledDateTypeSpinButton');
			$("#txtBoxPropDefaultValue").attr('required', 'required');
			$("#txtBoxPropDefaultValue").css("padding-right", '0px');
			$("#txtBoxPropDefaultValue").css("width", '119px');
			$("#txtBoxPropDefaultValue").css("float", 'left');
			$("#dropDownPropCollectionKind").attr('disabled', 'disabled');
		}
		if (typeSelected === "Edm.Boolean") {
			$('#txtBoxPropDefaultValue').removeClass('unstyledDateTypeSpinButton');
			uEntityTypeProperty.createDefaultValueDropDownForBoolean();
			$("#idPropStringType").hide();
			$("#idPropDefaultValue").hide();
			$("#idPropBooleanType").show();
			uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
			$("#txtBoxPropDefaultValue").attr('required', '');
			$("#txtBoxPropDefaultValue").css("padding-right", '0px');
			$("#txtBoxPropDefaultValue").css("width", '240px');
		}
		if (typeSelected != "Edm.Boolean") {
			$("#idPropDefaultValue").show();
			$("#idPropBooleanType").hide();
		}
		if (typeSelected != "Edm.String" && typeSelected != "Edm.Boolean") {
			$("#idPropStringType").hide();
			$("#idPropDefaultValue").show();
			$("#idPropBooleanType").hide();
			$('#txtAreaPropDefaultValue').val('');
		}
		if (typeSelected === "Edm.String") {
			$('#txtBoxPropDefaultValue').removeClass('unstyledDateTypeSpinButton');
			$("#idPropDefaultValue").hide();
			$("#idPropBooleanType").hide();
			$("#idPropStringType").show();
		}
		if(typeSelected != "Edm.DateTime"){
			$('#txtBoxPropDefaultValue').removeClass('unstyledDateTypeSpinButton');
			$("#dropDownPropCollectionKind").removeAttr('disabled');
			$("#txtBoxPropDefaultValue").css("padding-right", '25px');
			$("#txtBoxPropDefaultValue").css("width", '215px');
			uEntityTypeProperty.setHTMLVal('#txtBoxPropDefaultValue', '');
		}
		if(typeSelected === "Edm.Int32"){
			$("#txtBoxPropDefaultValue").attr('required', '');
			//$("#txtBoxPropDefaultValue").css("padding-right", '');
			//$("#txtBoxPropDefaultValue").css("width", '');
		}
	}
};

/**
 * The purpose of this function is to validate all the mandatory fields on
 * create Property pop up.
 * 
 * @param propertyName
 * @param typeSelected
 * @param uniqueKey
 */
entityTypeProperty.prototype.validate = function(propertyName, typeSelected, uniqueKey) {
	var isValidate = false;
	//uEntityTypeProperty.setErrorMessageSpanVal('#typePropertyDDErrorMsg', '');
	//uEntityTypeProperty.setErrorMessageSpanVal('#defaultValuePropErrorMsg', '');
	//uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
	var defaultValueText = document.getElementById("txtBoxPropDefaultValue").value;
	var lenDefaultValueText = defaultValueText.length;
	if (uEntityTypeProperty.validatePropertyName(propertyName)) {
		cellpopup.showValidValueIcon('#txtBoxPropertyName');
		uEntityTypeProperty.setErrorMessageSpanVal('#propertyNameErrorMsg', '');
		if (uEntityTypeProperty.validateTypeEmptyDropDown()) {
			if (uEntityTypeProperty.validateDefaultValue(typeSelected)) {
				uEntityTypeProperty.setErrorMessageSpanVal(
						'#defaultValuePropErrorMsg', '');
				uEntityTypeProperty.setErrorMessageSpanVal(
						'#defaultValuetxtAreaPropErrorMsg', '');
					if (typeSelected === "Edm.Int32" || typeSelected === "Edm.Single" || typeSelected === "Edm.Double") {
						uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
						if (lenDefaultValueText > 0) {
						cellpopup.showValidValueIcon('#txtBoxPropDefaultValue');
						}
				}
				isValidate = uEntityTypeProperty.validateUniqueKey(uniqueKey);
				if (isValidate) {
					uEntityTypeProperty.setErrorMessageSpanVal(
							'#propUniqueKeyErrorMsg', '');
				}
			}
		}
	}
	return isValidate;
};

/**
 * The purpose of this function is to validate Property name.
 * 
 * @param propertyName
 */
entityTypeProperty.prototype.validatePropertyName = function(propertyName) {
	var isPropertyNameValid = true;
	var MINLENGTH = 1;
	var MAXLENGTH = 128;
	//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(upper case)
	var letters = /^[0-9a-zA-Z-_]+$/;
	//The following regex finds under score(_) and hyphen(-)
	var specialchar = /^[-_]*$/;
	var lenPropertyName = propertyName.length;
	if (lenPropertyName < MINLENGTH || propertyName === undefined
			|| propertyName === null || propertyName === "") {
		isPropertyNameValid = false;
		uEntityTypeProperty.setErrorMessageSpanVal('#propertyNameErrorMsg',
				getUiProps().MSG0093);
		cellpopup.showErrorIcon('#txtBoxPropertyName');
	} else if (lenPropertyName > MAXLENGTH) {
		isPropertyNameValid = false;
		uEntityTypeProperty.setErrorMessageSpanVal('#propertyNameErrorMsg',
				getUiProps().MSG0071);
		cellpopup.showErrorIcon('#txtBoxPropertyName');
	} else if (lenPropertyName != 0 && !(propertyName.match(letters))) {
		isPropertyNameValid = false;
		uEntityTypeProperty.setErrorMessageSpanVal('#propertyNameErrorMsg',
				getUiProps().MSG0023);
		cellpopup.showErrorIcon('#txtBoxPropertyName');
	} else if (lenPropertyName != 0
			&& (specialchar.toString().indexOf(propertyName.substring(0, 1)) >= 0)) {
		isPropertyNameValid = false;
		uEntityTypeProperty.setErrorMessageSpanVal('#propertyNameErrorMsg',
				getUiProps().MSG0073);
		cellpopup.showErrorIcon('#txtBoxPropertyName');
	}
	return isPropertyNameValid;
};

/**
 * The purpose of this function is to validate UniqueKey.
 * 
 * @param uniqueKeyValue
 */
entityTypeProperty.prototype.validateUniqueKey = function(uniqueKeyValue) {
	var isUniqueKeyValid = true;
	var MAXLENGTH = 128;
	//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(upper case)
	var letters = /^[0-9a-zA-Z-_]+$/;
	//The following regex finds under score(_) and hyphen(-)
	var specialchar = /^[-_]*$/;
	var lenUniqueKey = uniqueKeyValue.length;
	if (lenUniqueKey > MAXLENGTH) {
		isUniqueKeyValid = false;
		uEntityTypeProperty.setErrorMessageSpanVal('#propUniqueKeyErrorMsg',
				getUiProps().MSG0095);
		cellpopup.showErrorIcon('#txtBoxPropUniqueKey');
	} else if (lenUniqueKey != 0 && !(uniqueKeyValue.match(letters))) {
		isUniqueKeyValid = false;
		uEntityTypeProperty.setErrorMessageSpanVal('#propUniqueKeyErrorMsg',
				getUiProps().MSG0096);
		cellpopup.showErrorIcon('#txtBoxPropUniqueKey');
	} else if (lenUniqueKey != 0
			&& (specialchar.toString().indexOf(uniqueKeyValue.substring(0, 1)) >= 0)) {
		isUniqueKeyValid = false;
		uEntityTypeProperty.setErrorMessageSpanVal('#propUniqueKeyErrorMsg',
				getUiProps().MSG0097);
		cellpopup.showErrorIcon('#txtBoxPropUniqueKey');
	}
	return isUniqueKeyValid;
};

/**
 * The purpose of this function is to validate if value is selected from the
 * type drop down or not, if not then error message is displayed.
 */
entityTypeProperty.prototype.validateTypeEmptyDropDown = function() {
	var isSelected = true;
	var typeDD = $("#dropDownPropType").val();
	if (typeDD == 0) {
		isSelected = false;
		uEntityTypeProperty.setErrorMessageSpanVal('#typePropertyDDErrorMsg',
				getUiProps().MSG0074);
	} else {
		uEntityTypeProperty.setErrorMessageSpanVal('#typePropertyDDErrorMsg',
				'');
	}
	return isSelected;
};

/**
 * The purpose of this function is to validate Default values on the basis of
 * type selected from the Type drop down.
 * 
 * @param typeSelected
 */
entityTypeProperty.prototype.validateDefaultValue = function(typeSelected) {
	var isDefaultValueValid = true;
	var txtAreaDefaultValue = document
			.getElementById("txtAreaPropDefaultValue").value;
	var defaultValueText = document.getElementById("txtBoxPropDefaultValue").value;
	var lenDefaultValueText = "";
	var lentxtAreaDefaultValueText = "";
	lenDefaultValueText = defaultValueText.length;
	lentxtAreaDefaultValueText = txtAreaDefaultValue.length;
	if (typeSelected === "Edm.String") {
		if (lentxtAreaDefaultValueText > 51200) {
			isDefaultValueValid = false;
			uEntityTypeProperty.setErrorMessageSpanVal(
					'#defaultValuetxtAreaPropErrorMsg',
					getUiProps().MSG0078);
		}
	} else if (typeSelected === "Edm.Int32") {
		var letters = /^[-+]?[0-9]+$/;
		if (defaultValueText < -2147483648 || defaultValueText > 2147483647) {
			isDefaultValueValid = false;
			uEntityTypeProperty.setErrorMessageSpanVal(
					'#defaultValuePropErrorMsg', getUiProps().MSG0075);
			cellpopup.showErrorIcon('#txtBoxPropDefaultValue');
		} else if (lenDefaultValueText != 0
				&& !(defaultValueText.match(letters))) {
			isDefaultValueValid = false;
			uEntityTypeProperty.setErrorMessageSpanVal(
					'#defaultValuePropErrorMsg', getUiProps().MSG0076);
			cellpopup.showErrorIcon('#txtBoxPropDefaultValue');
		}
	} else if (typeSelected === "Edm.Single") {
		var isValid = "";
		var letters = /^[-+]?[0-9]*\.?[0-9]+$/;
		if (lenDefaultValueText != 0 && !(defaultValueText.match(letters))) {
			isDefaultValueValid = false;
			uEntityTypeProperty.setErrorMessageSpanVal(
					'#defaultValuePropErrorMsg', getUiProps().MSG0080);
			cellpopup.showErrorIcon('#txtBoxPropDefaultValue');
		}
		isValid = uComplexTypeProperty.isTypeSingleValid(defaultValueText,
		   		lenDefaultValueText);
		if (!isValid) {
		   	isDefaultValueValid = false;
		   	uEntityTypeProperty.setErrorMessageSpanVal(
		   			'#defaultValuePropErrorMsg', getUiProps().MSG0081);
		  	cellpopup.showErrorIcon('#txtBoxPropDefaultValue');
		}
	} else if (typeSelected === "Edm.Double") {
		var isValid = "";
		var letters = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
		if (lenDefaultValueText != 0 && ! (defaultValueText.match(letters))) {
			isDefaultValueValid = false;
			uEntityTypeProperty.setErrorMessageSpanVal(
					'#defaultValuePropErrorMsg', getUiProps().MSG0080);
			cellpopup.showErrorIcon('#txtBoxPropDefaultValue');
		}
        if (!objCommon.isTypeDoubleValid(defaultValueText)) {
        	isDefaultValueValid = false;
		   	uEntityTypeProperty.setErrorMessageSpanVal(
		   			'#defaultValuePropErrorMsg', getUiProps().MSG0219);
		  	cellpopup.showErrorIcon('#txtBoxPropDefaultValue');
        }
	} else if (typeSelected === "Edm.DateTime") {
		var defaultValueTime = $("#defaultTime").val();
		var lenDefaultValueTime ="";
		lenDefaultValueTime = defaultValueTime.length;
		var MINDATEVALUE = "2000-01-01";
		var MAXDATEVALUE = "3000-01-01";
		var MAXLENGTHDATE = 4;
		var arrDefaultValueText = defaultValueText.split('-');
		var dateLength= arrDefaultValueText[0].length;
		
		// 2000-01-01T00:00:00 3000-01-01T00:00:00
		if (lenDefaultValueText > 0) {
			if (defaultValueText < MINDATEVALUE
					|| defaultValueText > MAXDATEVALUE) {
				isDefaultValueValid = false;
				uEntityTypeProperty.setErrorMessageSpanVal(
						'#defaultValuePropErrorMsg', getUiProps().MSG0079);
			} else if (dateLength > MAXLENGTHDATE) {
				isDefaultValueValid = false;
				uEntityTypeProperty.setErrorMessageSpanVal(
						'#defaultValuePropErrorMsg', getUiProps().MSG0079);
			}
		} 
		 if( lenDefaultValueTime > 0){
			if (lenDefaultValueText == 0) {
				  isDefaultValueValid = false;
					uEntityTypeProperty.setErrorMessageSpanVal(
							'#defaultValuePropErrorMsg', getUiProps().MSG0115);
				} 
		} else if( lenDefaultValueText > 0){
			if( lenDefaultValueTime == 0){
			var currentDate = new Date();
			var hours = currentDate.getHours();
			var minutes = currentDate.getMinutes();
			var seconds = currentDate.getSeconds();
			if (minutes < 10) {
		        minutes = "0" + minutes;
		    }
		    if (seconds < 10) {
		        seconds = "0" + seconds;
		    }
		    var currentTime = hours+":"+minutes+":"+ seconds;
		    document.getElementById('defaultTime').value = currentTime;
			}
		} 
		 
	}
	return isDefaultValueValid;
};

/**
 * The purpose of this function is to create Property URI.
 * @param entityTypeName
 * @returns {String}
 */
entityTypeProperty.prototype.getPropertyUri = function (entityTypeName) {
	var sb = "";
	/*sb = getOdataClientStore().baseURL;
	sb += sessionStorage.selectedcell;
	sb +="/";
	sb += sessionStorage.boxName;
	sb +="/";
	sb += sessionStorage.collectionName;
	sb += "/$metadata/EntityType(";
	sb += "'"+entityTypeName+"'";
//	sb += escape("'"+entityTypeName+"'");
	sb += ")/_Property";
	return sb;*/
	var collectionURL = sessionStorage.selectedCollectionURL;
	if(!(collectionURL.endsWith('/'))){
		collectionURL += "/";
	}
	sb += collectionURL;
	sb += "$metadata/EntityType(";
	sb += "'"+entityTypeName+"'";
//	sb += escape("'"+entityTypeName+"'");
	sb += ")/_Property";
	return sb;
};

/**
 * The purpose of this function is to retrieve the maximum allowed property list(400).
 * @param entityTypeName
 * @returns json
 */
entityTypeProperty.prototype.retrieveMaxPropertyList = function (entityTypeName) {
	if(entityTypeName != null || entityTypeName != undefined) {
		if (entityTypeName.length > 0) {
			var uri = uEntityTypeProperty.getPropertyUri(entityTypeName);
			uri = uri + "?$top=400";
			 var boxName = sessionStorage.boxName;
			 var baseUrl  = getClientStore().baseURL;
			 if (!baseUrl.endsWith("/")) {
				baseUrl += "/";
			 }
			var cellName = sessionStorage.selectedcell;
			var accessor = objCommon.initializeAccessor(baseUrl, cellName, "",
					boxName);
			var restAdapter = _pc.RestAdapterFactory.create(accessor);
			var response = restAdapter.get(uri, "application/json");
			var json = response.bodyAsJson().d.results;
			return json;
		}
	}
};

/**
 * The purpose of this function is to retrieve API response.
 * 
 * @param json
 * @param operationPerformed
 * @param entityTypeName
 * @param propertyName
 */
entityTypeProperty.prototype.retrievePropertyAPIResponse = function(json,
		operationPerformed, entityTypeName, propertyName) {
	var response = null;
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	if (boxName == mainBoxValue) {
		boxName = getUiProps().MSG0293;
	}
	var collectionName = uEntityTypeOperations.getFolderHeirarchy(boxName);//sessionStorage.collectionName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "",
			boxName);
	var objPropertyManager = new _pc.PropertyManager(accessor, collectionName);
	if (operationPerformed === "CREATE") {
		response = objPropertyManager.create(json);
	}
	if (operationPerformed === "RETRIEVE") {
		response = uEntityTypeProperty.retrieveMaxPropertyList(entityTypeName);
	}
	if (operationPerformed === "RETRIEVE DETAILS") {
		response = objPropertyManager.retrieve(propertyName, entityTypeName);
	}
	if (operationPerformed === "DELETE") {
		var etag = uEntityTypeProperty.getEtag(entityTypeName, propertyName,
				objPropertyManager);
		var key = "Name='" + propertyName + "',_EntityType.Name='"
				+ entityTypeName + "'";
		response = objPropertyManager.del(key, etag);
	}
	return response;
};

/**
 * The purpose of this function is to display error message if Nullable is selected
 * as false.
 * 
 * @param propSelectedNullable
 * @param txtPropDefaultValue
 * @param txtAreaDefaultValue
 * @param propSelectedType
 */
entityTypeProperty.prototype.isNullable = function (propSelectedNullable, propSelectedType) {
	if (propSelectedNullable == 'false') {
		uEntityTypeProperty.setErrorMessageSpanVal(
				'#nullablePropDDErrorMsg', getUiProps().MSG0139);
	}
};


/**
 * The purpose of this function is to create Property.
 */
entityTypeProperty.prototype.createProperty = function() {
	showSpinner("modalSpinnerSchemaManagement");
	var lenTxtPropDefaultValue = 0;
	var json = "";
	var lenSelectedCollectionKind = "";
	var lenSelectedNullable = 0;
	var lenUniqueKey = "";
	var lenIsKey = "";
	var txtProperty = uEntityTypeProperty
	.getPropertyPopUpValues('#txtBoxPropertyName');
	var txtEntityType = uEntityTypeProperty
			.getPropertyPopUpValues('#txtBoxEntityTypeName');
	var propSelectedType = uComplexTypeProperty.getSelectedComplectTypeFromDropDown('dropDownPropType');//uEntityTypeProperty.getPropertyPopUpValues('#dropDownPropType');
	var propSelectedNullable = uEntityTypeProperty
			.getPropertyPopUpValues('#dropDownPropNullable');
	var txtPropDefaultValue = uEntityTypeProperty
			.getPropertyPopUpValues('#txtBoxPropDefaultValue');
	var txtPropDefaultValueTime = uEntityTypeProperty
	.getPropertyPopUpValues('#defaultTime');
	var txtAreaDefaultValue = document
			.getElementById("txtAreaPropDefaultValue").value;
	var selectedCollectionKind = uEntityTypeProperty
			.getPropertyPopUpValues('#dropDownPropCollectionKind');
	var propIsKey = uEntityTypeProperty
			.getPropertyPopUpValues('#dropDownPropIsKey');
	var txtUniqueKey = uEntityTypeProperty
			.getPropertyPopUpValues('#txtBoxPropUniqueKey');

	if (propSelectedNullable === null) {
		propSelectedNullable = null;
	}
	if (propSelectedType === "Edm.Boolean") {
		txtPropDefaultValue = uEntityTypeProperty
				.getPropertyPopUpValues('#dropDownPropTypeBoolean');
	}
	if (propSelectedType === "Edm.String") {
		txtPropDefaultValue = txtAreaDefaultValue;
	}
	if (propSelectedType === "Edm.DateTime" && txtPropDefaultValue.length > 0) {
		txtPropDefaultValue = uComplexTypeProperty
				.retrieveEpochDate(txtPropDefaultValue,txtPropDefaultValueTime);
	}
	if(txtPropDefaultValue != null && txtPropDefaultValue != undefined){
		lenTxtPropDefaultValue = txtPropDefaultValue.length;
	}
	if(propSelectedNullable != null && propSelectedNullable != undefined){
		lenSelectedNullable = propSelectedNullable.length;
	}
	lenSelectedCollectionKind = selectedCollectionKind.length;
	lenUniqueKey = txtUniqueKey.length;
	lenIsKey = propIsKey.length;

	if (uEntityTypeProperty.validate(txtProperty, propSelectedType,
			txtUniqueKey)) {
		json = "{";
		json += '"Name":"' + txtProperty + '","_EntityType.Name":"'
				+ txtEntityType + '","Type":"' + propSelectedType + '"';
		if (lenSelectedNullable != 0 && propSelectedNullable != "null") {
			json += ',"Nullable":"' + propSelectedNullable + '"';
		}
		if (lenTxtPropDefaultValue != 0) {
			if (txtPropDefaultValue == "null" && propSelectedType === "Edm.Boolean") {
				json += ',"DefaultValue":' + txtPropDefaultValue;
			} else {
				json += ',"DefaultValue":"' + txtPropDefaultValue + '"';
			}
		}
		if (lenSelectedCollectionKind != 0) {
			json += ',"CollectionKind":"' + selectedCollectionKind + '"';
		}
		if (lenIsKey != 0) {
			json += ',"IsKey":"' + propIsKey + '"';
		}
		if (lenUniqueKey != 0) {
			json += ',"UniqueKey":"' + txtUniqueKey + '"';
		}
		json += "}";
		try {
			var response = uEntityTypeProperty.retrievePropertyAPIResponse(json, "CREATE");
				if (response !== undefined && response.getStatusCode() == 201) {
					var successMsg = getUiProps().MSG0262;
					objCommon.displaySuccessMessage(successMsg, '#propertyModalWindow', "208px", "crudOperationMessageBlock");
					uDataManagement.getHeaderList();
					uEntityTypeProperty.createPropertyTable(txtEntityType);
				} else if (response.getStatusCode() === 409) {
					uEntityTypeProperty.setErrorMessageSpanVal('#propertyNameErrorMsg',
					getUiProps().MSG0094);
					cellpopup.showErrorIcon('#txtBoxPropertyName');
				}
		} catch (exception) {
			if (exception.getCode() == "PR400-OD-0001") {
				uEntityTypeProperty.setErrorMessageSpanVal('#defaultValuetxtAreaPropErrorMsg',	getUiProps().MSG0080);
			} else if (exception.getCode() == "PR400-OD-0006") {
				//&& exception.message == "[Nullable] field format error."
				uEntityTypeProperty.isNullable(propSelectedNullable, propSelectedType);
			} else if (exception.getCode() == "PR400-OD-0032") {
				var hierarchyExceedsmessage = exception.message;
				objCommon.displayErrorMessage (hierarchyExceedsmessage, '#propertyModalWindow', "555px", "crudOperationMessageBlock");
			} else {
				var message = getUiProps().MSG0268;
				objCommon.displayErrorMessage (message, '#propertyModalWindow', "195px", "crudOperationMessageBlock");
			}
		}
		
	}
	removeSpinner("modalSpinnerSchemaManagement");
};

/** ****************** PROPERTY CREATE : END ******************* */

/** ****************** PROPERTY VIEW : START ******************* */

/**
 * The purpose of this function is to highlight alternate rows in different
 * color.
 */
entityTypeProperty.prototype.alternatePropertyRowColor = function() {
	$("#propertyList tr:odd").css("background-color", "#F4F4F4");
	$(".selectProfileRow").css("background-color", "#dfdfdf");
};

/**
 * The purpose of this function is to get selected Property.
 * 
 * @param count
 * @param propertyName
 * @param entityTypeName
 */
entityTypeProperty.prototype.rowSelectProperty = function(count, propertyName,
		entityTypeName) {
	sessionStorage.selectedPropertyName = propertyName;
	sessionStorage.selectedEntityTypeName = entityTypeName;
	var rowId = '#propertyCol_' + count;
	$(rowId).parent().siblings().children().removeClass('entityTypeRowSelect');
	$(rowId).addClass('entityTypeRowSelect');
	//$(rowId).siblings().removeClass('selectRow');
	//$(rowId).addClass('selectRow');
	var sortJSONString = uEntityTypeProperty.propertyDetailsList;
	uEntityTypeProperty
			.createPropertyDetailsTable(propertyName, entityTypeName, sortJSONString);
};

/**
 * The purpose of this function is to create rows of Property table.
 * 
 * @param dynamicRows
 * @param count
 * @param propertyName
 * @param shorterPropertyName
 * @param entityTypeName
 */
entityTypeProperty.prototype.createRowsForPropertyTable = function(dynamicRows,
		count, propertyName, shorterPropertyName, entityTypeName) {
	var propertyNameSelected = "'" + propertyName + "'";
	dynamicRows += "<tr  id='propertyRow_" + count
			+ "' class = 'dynamicPropertyRow'>";
	dynamicRows += '<td title = "' + propertyName + '" onclick="uEntityTypeProperty.rowSelectProperty(' + count + ', ' + propertyNameSelected + ', ' + entityTypeName + ');" style="width:100%;cursor:default;max-width: 262px;" id="propertyCol_' + count +'"><div style="margin-left: 10px;margin-right: 10px;" class="entityPropNameText mainTableEllipsis" id="propertyCol_' + count + '">'
			+ propertyName + '</div></td>';
	dynamicRows += "<td style='width:0%'></td>";
	dynamicRows += "</tr>";
	return dynamicRows;
};

/**
 * The purpose of this function is to get first property selected.
 * 
 * @param propertyName
 * @param entityTypeName
 */
entityTypeProperty.prototype.getFirstPropertySelected = function(propertyName,
		entityTypeName, sortJSONString) {
	sessionStorage.selectedPropertyName = propertyName;
	sessionStorage.selectedEntityTypeName = entityTypeName;
	var objFirstProperty = $('#propertyCol_' + 0);
	objFirstProperty.siblings().removeClass("selectRow");
	//objFirstProperty.addClass("selectRow");
	objFirstProperty.addClass("entityTypeRowSelect");
	entityTypeName = objCommon
			.getEnityNameAfterRemovingSpecialChar(entityTypeName);
	uEntityTypeProperty
			.createPropertyDetailsTable(propertyName, entityTypeName, sortJSONString);
};

/**
 * The purpose of this function is to create property table.
 * 
 * @param entityTypeName
 */
entityTypeProperty.prototype.createPropertyTable = function(entityTypeName, spinnerCallback) {
	$(".dynamicPropertyRow").remove();
	var propertyName = null;
	var json = uEntityTypeProperty.retrievePropertyAPIResponse("", "RETRIEVE",
			entityTypeName);
	var sortJSONString = null;
	var recordSize = null;
	if (json != undefined) {
		sortJSONString = objCommon.sortByKey(json, '__updated');
		uEntityTypeProperty.propertyDetailsList = sortJSONString;
		recordSize = sortJSONString.length;
	}
	sessionStorage.countOfProps = recordSize;
	if (recordSize > 0) {
		document.getElementById("propertyCountLabel").innerHTML = recordSize+" " + getUiProps().MSG0370;
		$('#propertyTerNavRHS').show();
		document.getElementById("PropertyViewBody").style.display = "block";
		document.getElementById("terNavIcons").style.display = "block";
		document.getElementById("PropertyViewEmptyBody").style.display = "none";
		var dynamicRows = "";
		if(document.getElementById("propertyList") != undefined){
			document.getElementById("propertyList").style.display = "block";
		}
		$("#dvNoSchemaMgmtMsg").hide();
		$("#editIconPropertyDetails").show();
		$("#deleteIconPropertyDetails").show();
		for ( var count = 0; count < recordSize; count++) {
			var obj = sortJSONString[count];
			propertyName = obj.Name;
			entityTypeName = objCommon
					.getEnityNameAfterRemovingSpecialChar(entityTypeName);
			entityTypeName = "'" + entityTypeName + "'";
			var shorterPropertyName = objCommon
					.getShorterEntityName(propertyName);
			dynamicRows = uEntityTypeProperty.createRowsForPropertyTable(
					dynamicRows, count, propertyName, shorterPropertyName,
					entityTypeName, sortJSONString);
		}
		$("#propertyList").append(dynamicRows);
		//uEntityTypeProperty.alternatePropertyRowColor();
		uEntityTypeProperty.getFirstPropertySelected(sortJSONString[0].Name,
				entityTypeName, sortJSONString);
	} else {
		//clear the label and hide property detail view
		document.getElementById("PropertyViewBody").style.display = "none";
		$('#propertyTerNavRHS').hide();
		document.getElementById("terNavIcons").style.display = "none";
		document.getElementById("PropertyViewEmptyBody").style.display = "block";
		document.getElementById("propertyCountLabel").innerHTML = "";
		
		if(document.getElementById("propertyList") != null || document.getElementById("propertyList") != undefined){
			document.getElementById("propertyList").style.display = "none";
		}
		$("#editIconPropertyDetails").hide();
		$("#deleteIconPropertyDetails").hide();
		$("#dvNoSchemaMgmtMsg").show();
		$(".dynamicPropertyDetailsRow").remove();
	}
	if (spinnerCallback != undefined) {
		spinnerCallback();
	}
};

/**
 * The purpose of this function is to create Property details table.
 * 
 * @param propertyName
 * @param entityTypeName
 */
entityTypeProperty.prototype.createPropertyDetailsTable = function(
		propertyName, entityTypeName, jsonData) {
	$("#propDetailLabel").text(propertyName);
	$("#propDetailLabel").attr('title',propertyName);
	$(".dynamicPropertyDetailsRow").remove();
	var dynamicRowsCTPDetailsView = "";
	var propertyIndex = 0;
	var shorterDefaultValue = "";
	/*var json = uEntityTypeProperty.retrievePropertyAPIResponse("",
			"RETRIEVE DETAILS", entityTypeName, propertyName);*/
	var noOfProps = jsonData.length;
	for(var index = 0; index < noOfProps; index++){
		var obj = jsonData[index];
		var propNameFromList = obj["Name"];
		if(propNameFromList == propertyName){
			propertyIndex = index;
			break;
		}
	}
	var json = jsonData[propertyIndex];
	var entityTypeName = json["_EntityType.Name"];
	var propertyType = json.Type;
	var nullableValue = json.Nullable;
	var defaultValue = json.DefaultValue;
	var collectionKind = json.CollectionKind;
	var isKey = json.IsKey;
	var uniqueKey = json.UniqueKey;
	var etag = json.__metadata.etag;
	var type = json.__metadata.type;
	var uri = json.__metadata.uri;
	var publishedDate = json.__published;
	var updatedDate = json.__updated;
	publishedDate = objCommon.convertEpochDateToReadableFormat(publishedDate);
	updatedDate = objCommon.convertEpochDateToReadableFormat(updatedDate);

	var shorterEntityTypeName = objCommon.getShorterEntityName(entityTypeName);
	var shorterPropertyName = objCommon.getShorterEntityName(propertyName);
	//var shorterUri = objCommon.getShorterEntityName(uri, true);
	if (propertyType === "Edm.DateTime") {
		if (defaultValue != null) {
			defaultValue = objCommon
					.convertEpochDateToReadableFormat(defaultValue);
		}
	}
	shorterDefaultValue = objCommon.getShorterEntityName(defaultValue);
	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>* "+getUiProps().LBL0013+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText'><div class='mainTableEllipsis' style='width:100%;max-width:500px;' title='"
			+ propertyName + "'>" + propertyName + "</div></td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>* "+getUiProps().LBL0014+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText'><div class='mainTableEllipsis' style='width:100%;max-width:500px;' title='"
			+ entityTypeName + "'>" + entityTypeName + "</div></td>";
	dynamicRowsCTPDetailsView += "</tr>";
	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>* "+getUiProps().LBL0015+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText'><div class='mainTableEllipsis' style='width:100%;max-width:500px;' title='"
			+ propertyType + "'>" + propertyType + "</div></td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>"+getUiProps().LBL0016+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' title='"
			+ nullableValue + "'>" + nullableValue + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>"+getUiProps().LBL0017+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText'><div class='mainTableEllipsis' style='width:100%;max-width:500px;' title='"
			+ defaultValue + "'>" + defaultValue + "</div></td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>"+getUiProps().LBL0018+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' title='"
			+ collectionKind + "'>" + collectionKind + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>"+getUiProps().LBL0019+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' title='"
			+ isKey + "'>" + isKey + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>"+getUiProps().LBL0020+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' title='"
			+ uniqueKey + "'>" + uniqueKey + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>"+getUiProps().LBL0021+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' title='"
			+ publishedDate + "'>" + publishedDate + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>"+getUiProps().LBL0022+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' title='"
			+ updatedDate + "'>" + updatedDate + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow '>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeProp complexTypePropHeading'>"+getUiProps().LBL0023+"</td>";
	dynamicRowsCTPDetailsView += "<td width='200px'></td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropMetadata complexTypePropHeading'>"+getUiProps().LBL0024+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' title='"
			+ etag + "'>" + etag + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropMetadata complexTypePropHeading'>"+getUiProps().LBL0025+"</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' title='"
			+ type + "'>" + type + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";

	dynamicRowsCTPDetailsView += "<tr class='dynamicPropertyDetailsRow' style='word-wrap: break-word;'>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropMetadata complexTypePropHeading'>URI</td>";
	dynamicRowsCTPDetailsView += "<td class='entityTypeDetailsTable complexTypePropText' style='padding-top:1px;overflow:auto;max-height:45px;display: block;'>" + uri + "</td>";
	dynamicRowsCTPDetailsView += "</tr>";
	$("#propertyDetailsView").append(dynamicRowsCTPDetailsView);
	if (sessionStorage.selectedLanguage == 'ja') {
		$(".entityTypeProp").addClass('japaneseFont');
		$(".complexTypePropMetadata").addClass('japaneseFont');
	}
	//uEntityTypeProperty.alternatePropertyRowColor();
};

/** ****************** PROPERTY VIEW : END ******************* */

/** ***************** PROPERTY DELETE : START *************** */

/**
 * The purpose of this function is to delete Property.
 */
entityTypeProperty.prototype.deleteProperty = function() {
	showSpinner("modalSpinnerSchemaManagement");
	var propertyName = sessionStorage.selectedPropertyName;
	var entityTypeName = sessionStorage.selectedEntityTypeName;
	entityTypeName = objCommon
			.getEnityNameAfterRemovingSpecialChar(entityTypeName);
	var promise = uEntityTypeProperty.retrievePropertyAPIResponse("",
			"DELETE", entityTypeName, propertyName);
	if (promise != undefined) {
		uDataManagement.getHeaderList();
		uEntityTypeProperty.displayDeleteMessageForProperty(promise, entityTypeName);
	}
	removeSpinner("modalSpinnerSchemaManagement");
};

/**
 * The purpose of this function is to retrieve etag of selected Property.
 * 
 * @param entityTypeName
 * @param propertyName
 * @param objPropertyManager
 */
entityTypeProperty.prototype.getEtag = function(entityTypeName, propertyName,
		objPropertyManager) {
	var json = objPropertyManager.retrieve(propertyName, entityTypeName);
	var etag = json.__metadata.etag;
	return etag;
};

/**
 * The purpose of this function is to display message for delete operation
 * 
 * @param promise
 * @param propertyName
 * @param entityTypeName
 */
entityTypeProperty.prototype.displayDeleteMessageForProperty = function(
		promise, entityTypeName) {
	if (promise.resolvedValue != null && promise.resolvedValue.status === 204) {
		var message = getUiProps().MSG0257;
		objCommon.displaySuccessMessage(message, '#propertyDeleteModalWindow', "210px", "crudOperationMessageBlock");
		uEntityTypeProperty.createPropertyTable(entityTypeName);
	} else if (promise.errorMessage != null && promise.errorMessage.status === 409) {
		var message = getUiProps().MSG0258;
		objCommon.displayErrorMessage(message, '#propertyDeleteModalWindow', "202px", "crudOperationMessageBlock");
	}
};

/**
 * Following method is used to remove icons from the textboxes.
 * @param txtID
 */
entityTypeProperty.prototype.removeStatusIcons = function(txtID){
	$(txtID).removeClass("errorIcon");	
	$(txtID).removeClass("validValueIcon");
};

/**
 * The purpose of this function is to empty default value field as per
 * selection of type from drop down. 
 */
entityTypeProperty.prototype.emptyDefaultValueFieldAsPerType = function() {
	var selectedType = $("#dropDownPropType").val();
	switch (selectedType) {
		case "Edm.DateTime":
		case "Edm.Int32":
		case "Edm.Single":
		case "Edm.Double":
		    $('#txtBoxPropDefaultValue').val('');
		    uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
	}
};
/** ***************** PROPERTY DELETE : END *************** */

/** ***************** ON BLUR VALIDATIONS : START *************** */
/**
 * Following method check property name validations on blur event. 
 */
$("#txtBoxPropertyName").blur(
		function() {
			var propertyName = $('#txtBoxPropertyName').val();
			if (uEntityTypeProperty.validatePropertyName(propertyName)) {
				cellpopup.showValidValueIcon('#txtBoxPropertyName');
				uEntityTypeProperty.setErrorMessageSpanVal(
						'#propertyNameErrorMsg', '');
			}
		});
/**
 * Following method check default value validations on blur event.
 */
entityTypeProperty.prototype.defaultValueValidations = function() {
	var defaultValueText = document.getElementById("txtBoxPropDefaultValue").value;
	var txtPropDefaultValue = uEntityTypeProperty
	.getPropertyPopUpValues('#txtBoxPropDefaultValue');
	var txtPropDefaultValueTime = uEntityTypeProperty
	.getPropertyPopUpValues('#defaultTime');
	var lenDefaultValueText = defaultValueText.length;
	var propSelectedType = uComplexTypeProperty
			.getSelectedComplectTypeFromDropDown('dropDownPropType');
	if (propSelectedType === "Edm.Boolean") {
		txtPropDefaultValue = uEntityTypeProperty
				.getPropertyPopUpValues('#dropDownPropTypeBoolean');
	}
	if (propSelectedType === "Edm.String") {
		txtPropDefaultValue = txtAreaDefaultValue;
	}
	if (propSelectedType === "Edm.DateTime" && txtPropDefaultValue.length > 0) {
		txtPropDefaultValue = uComplexTypeProperty
				.retrieveEpochDate(txtPropDefaultValue,txtPropDefaultValueTime);
	}
	if (uEntityTypeProperty.validateDefaultValue(propSelectedType)) {
		uEntityTypeProperty.setErrorMessageSpanVal('#defaultValuePropErrorMsg',
				'');
		uEntityTypeProperty.setErrorMessageSpanVal(
				'#defaultValuetxtAreaPropErrorMsg', '');
		if (propSelectedType === "Edm.Int32"
				|| propSelectedType === "Edm.Single"
				|| propSelectedType === "Edm.Double") {
			uEntityTypeProperty.removeStatusIcons('#txtBoxPropDefaultValue');
			if (lenDefaultValueText > 0) {
				cellpopup.showValidValueIcon('#txtBoxPropDefaultValue');
			}
		}
	}

};

/**
 * Following method check prop type validations on blur event.
 */
$("#dropDownPropType").blur(function() {
	uEntityTypeProperty.validateTypeEmptyDropDown();
});

/**
 * Following method check default value validations on blur event.
 */
$("#txtBoxPropDefaultValue").blur(function() {
	uEntityTypeProperty.defaultValueValidations();
});

/**
 * Following method check time default value validations on blur event.
 */
if($("#OdataSchemaTab").hasClass("odataTabSelected")){
$("#defaultTime").live('blur',function(){
	uEntityTypeProperty.defaultValueValidations();
});
}


/** ***************** ON BLUR VALIDATIONS : END *************** */
$(function() {
	$("#btnAddProperty").click(function() {
		uEntityTypeProperty.createProperty();
	});
	$("#btnDeleteProperty").click(function() {
		uEntityTypeProperty.deleteProperty();
	});
});