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
function complexTypeProperty() {
}

var uComplexTypeProperty = new complexTypeProperty();

/******************** COMPLEX TYPE PROPERTY CREATE : START ********************/
/**
 * The purpose of this function is to empty all the field values on 
 * ComplexTypeProperty modal pop up.
 */
complexTypeProperty.prototype.emptyComplexTypePropPopUpFieldsValues = function () {
	$("#idBooleanType").hide();
	$("#idDefaultValue").show();
	$("#idStringType").hide();
	$("#txtBoxDefaultValue").removeAttr('disabled');
	var complexTypeName = "";
	complexTypeName = uEntityTypeOperations.getSelectedComplexType();
	sessionStorage.complexTypeName = complexTypeName;
	uComplexTypeProperty.getComplexTypeNameList("dropDownType", "ComplexTypeProperty");
	$("#txtBoxComplexTypePropName").val('');
	$("#txtBoxComplexTypeName").val(complexTypeName);
	$("#dropDownType").val('');
	$("#dropDownNullable	").val('');
	$("#txtBoxDefaultValue").val('');
	$("#dropDownCollectionKind").val('');
	$("#txtAreaDefaultValue").val('');
	$('#complexTypePropNameErrorMsg').html('');
	$('#complexTypeNameErrorMsg').html('');
	$('#typeDDErrorMsg').html('');
	$('#nullableDDErrorMsg').html('');
	$('#defaultValueErrorMsg').html('');
	$('#collectionKindDDErrorMsg').html('');
	$('#defaultValueTxtAreaErrorMsg').html('');
	$('#defaultValueTxtAreaErrorMsg').html('');
	uEntityTypeProperty.removeStatusIcons('#txtBoxComplexTypePropName');
	uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
	//uComplexTypeProperty.emptyComplexTypeDefaultValueFieldAsPerType();
	var selectedIndexValue = document.getElementById("dropDownType").selectedIndex;
	if (selectedIndexValue == 0){
		var input = document.getElementById("txtBoxDefaultValue");
		input.type = "text";
		$("#complexDefaultValueTime").remove();
		$("#txtBoxDefaultValue").css("width", '215px');
		$("#txtBoxDefaultValue").css("padding-right", '25px');
		$('#txtBoxDefaultValue').val('');
	}
	};

complexTypeProperty.prototype.emptyComplexTypeDefaultValueFieldAsPerType = function() {
	var dropdownSelectedValue = $("#dropDownType").val();
    switch (dropdownSelectedValue) {
    	case "Edm.DateTime":
    	case "Edm.Int32":
    	case "Edm.Single":
    	case "Edm.Double":
    	    $('#txtBoxDefaultValue').val('');
            uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
    	    break;
    }

	if (uComplexTypeProperty.validateTypeEmptyDropDown() == false) {
		uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
		$("#txtBoxDefaultValue").val('');
	}
};

/**
 * The purpose of this function is to get the Complex Type name.
 * 
 * @param typeDropDownID
 * @param propertyType
 */
complexTypeProperty.prototype.getComplexTypeNameList = function (typeDropDownID, propertyType) {
	var complexTypeList = "";
	var noOfComplexTypes = $("#complexTypeList tbody tr").length;
	$("#dropDownType optgroup").show();
	if(noOfComplexTypes == 1) {
		$("#dropDownType optgroup").hide();
	}
	for(var index = 0; index < noOfComplexTypes; index++) {
		complexTypeList += document.getElementById("complexTypeLbl_" + index).title;
		complexTypeList += ",";
	}
	uComplexTypeProperty.bindTypeDDWithComplexType(typeDropDownID, propertyType, complexTypeList, noOfComplexTypes);
};

/**
 * The purpose of this function is to bind Type drop down with dynamic
 * list of complex types.
 * 
 * @param typeDropDownID
 * @param propertyType
 * @param complexTypeList
 * @param noOfComplexTypes
 */
complexTypeProperty.prototype.bindTypeDDWithComplexType = function (typeDropDownID, propertyType, complexTypeList, noOfComplexTypes) {
	if (propertyType === "Property" && noOfComplexTypes == 0) {
		$("#dropDownPropType optgroup").hide();
	} else if (propertyType === "Property" && noOfComplexTypes > 0) {
		$("#dropDownPropType optgroup").show();
	}
	complexTypeNameFromSession = sessionStorage.complexTypeName;
	var complexTypeArray = complexTypeList.split(',');
	var select = document.getElementById(typeDropDownID);
	select.options.length = 6;
	for(var count=0; count < noOfComplexTypes; count++) {
		var option = document.createElement("option");
		option.id=null;
		option.innerHTML = null;
		var complexTypeName = complexTypeArray[count];
		var tooltipComplexTypeName = objCommon.getShorterEntityName(complexTypeName);
		option.innerHTML = complexTypeName;
		option.text = tooltipComplexTypeName;
		option.title = complexTypeName;
		option.value = complexTypeName;
		select.appendChild(option);
	}
	if (propertyType === "ComplexTypeProperty") {
		$("#dropDownType option[value= '" + complexTypeNameFromSession + "']").remove();
	}
};

/**
 * The purpose of this function is to validate all the mandatory fields on
 * ComplexTypeProperty create pop up.
 * 
 * @param complexTypePropName
 * @param typeSelected
 */
complexTypeProperty.prototype.validate = function (complexTypePropName, typeSelected) {
	//document.getElementById("typeDDErrorMsg").innerHTML = "";
	//document.getElementById("defaultValueErrorMsg").innerHTML = "";
	//uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
	if (uComplexTypeProperty.validateComplexTypePropName(complexTypePropName)) {
		document.getElementById("complexTypePropNameErrorMsg").innerHTML = "";
		if (uComplexTypeProperty.validateTypeEmptyDropDown()) {
			return uComplexTypeProperty.validateDefaultValue(typeSelected);
		}
	}
	return false;
};

/**
 * The purpose of this function is to validate the ComplexTypeProperty name.
 * 
 * @param complexTypePropName
 */
complexTypeProperty.prototype.validateComplexTypePropName = function (complexTypePropName) {
	//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(upper case).
	var letters = /^[0-9a-zA-Z-_]+$/;
	//The following regex finds under score(_) and hyphen(-).
	var specialchar = /^[-_]*$/;
	var lenComplexTypePropName = complexTypePropName.length;
	if(lenComplexTypePropName < 1 || complexTypePropName == undefined || complexTypePropName == null || complexTypePropName == "") {
		document.getElementById("complexTypePropNameErrorMsg").innerHTML = getUiProps().MSG0070;
		cellpopup.showErrorIcon('#txtBoxComplexTypePropName');
		return false;
	} else if (lenComplexTypePropName > 128) {
		document.getElementById("complexTypePropNameErrorMsg").innerHTML = getUiProps().MSG0071;
		cellpopup.showErrorIcon('#txtBoxComplexTypePropName');
		return false;
	} else if (lenComplexTypePropName != 0 && ! (complexTypePropName.match(letters))) {
		document.getElementById("complexTypePropNameErrorMsg").innerHTML = getUiProps().MSG0023;
		cellpopup.showErrorIcon('#txtBoxComplexTypePropName');
		return false;
	} else if(lenComplexTypePropName != 0 && (specialchar.toString().indexOf(complexTypePropName.substring(0,1)) >= 0)){
		document.getElementById("complexTypePropNameErrorMsg").innerHTML = getUiProps().MSG0073;
		cellpopup.showErrorIcon('#txtBoxComplexTypePropName');
		return false;
	}
	cellpopup.showValidValueIcon('#txtBoxComplexTypePropName');
	return true;
};

/**
 * The purpose of this function is to validate if value is selected
 * from the drop down or not, if not then error message is displayed.
 */
complexTypeProperty.prototype.validateTypeEmptyDropDown = function () {
	var typeDD = $("#dropDownType").val();
	if(typeDD == 0){
		document.getElementById("typeDDErrorMsg").innerHTML = getUiProps().MSG0074;
		return false;
	} else {
		document.getElementById("typeDDErrorMsg").innerHTML = "";
	}
	return true;
};

/**
 * The purpose of this function is to validate Default values on the basis of type
 * selected from Type drop down.
 * 
 * @param typeSelected
 */
complexTypeProperty.prototype.validateDefaultValue = function (typeSelected) {
	var txtAreaDefaultValue = document.getElementById("txtAreaDefaultValue").value;
	var defaultValueText = document.getElementById("txtBoxDefaultValue").value;
	var lenDefaultValueText = "";
	var lentxtAreaDefaultValueText = "";
	lenDefaultValueText = defaultValueText.length;
	lentxtAreaDefaultValueText = txtAreaDefaultValue.length;
	if (typeSelected === "Edm.String") {
		if (lentxtAreaDefaultValueText > 51200) {
			document.getElementById("defaultValueTxtAreaErrorMsg").innerHTML = getUiProps().MSG0078;
			return false;
		}
		return true;
	} else if (typeSelected === "Edm.Int32") {
		var letters = /^[-+]?[0-9]+$/;
		if (defaultValueText < -2147483648 || defaultValueText > 2147483647) {
			document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0075;
			cellpopup.showErrorIcon('#txtBoxDefaultValue');
			return false;
		} else if (lenDefaultValueText != 0 && ! (defaultValueText.match(letters))) {
			document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0076;
			cellpopup.showErrorIcon('#txtBoxDefaultValue');
			return false;
		}
		uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
		if (lenDefaultValueText > 0) {
			cellpopup.showValidValueIcon('#txtBoxDefaultValue');
		}
		return true;
	} else if (typeSelected === "Edm.Single") {
		var isValid = "";
		var letters = /^[-+]?[0-9]*\.?[0-9]+$/; 
		if (lenDefaultValueText != 0 && ! (defaultValueText.match(letters))) {
			document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0080;
			cellpopup.showErrorIcon('#txtBoxDefaultValue');
			return false;
		}
		isValid = uComplexTypeProperty.isTypeSingleValid(defaultValueText, lenDefaultValueText);
		if (!isValid) {
			document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0081;
			cellpopup.showErrorIcon('#txtBoxDefaultValue');
			return false;
		}
		
		uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
		if (lenDefaultValueText > 0) {
			cellpopup.showValidValueIcon('#txtBoxDefaultValue');
		}
		return true;
	} else if (typeSelected === "Edm.Double") {
		var isValid = "";
		var letters = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
		if (lenDefaultValueText != 0 && ! (defaultValueText.match(letters))) {
			document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0080;
			cellpopup.showErrorIcon('#txtBoxDefaultValue');
			return false;
		}
        if (!objCommon.isTypeDoubleValid(defaultValueText)) {
        	document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0219;
		   	cellpopup.showErrorIcon('#txtBoxDefaultValue');
		    return false;
        }
		
		uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
		if (lenDefaultValueText > 0) {
			cellpopup.showValidValueIcon('#txtBoxDefaultValue');
		}
		return true;
	} else if (typeSelected === "Edm.DateTime") {
		var defaultValueTime = document.getElementById("complexDefaultValueTime").value;
		var lenDefaultValueTime = "";
		lenDefaultValueTime = defaultValueTime.length;
		var MAXLENGTHDATE = 4;
		var arrDefaultValueText = defaultValueText.split('-');
		var dateLength= arrDefaultValueText[0].length;
		
		//2000-01-01T00:00:00		3000-01-01T00:00:00
		if (lenDefaultValueText > 0) {
			if(defaultValueText < "2000-01-01" || defaultValueText > "3000-01-01") {
				document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0079;
				return false;
			} else if (dateLength > MAXLENGTHDATE) {
				document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0079;
				return false;
			} 
		}
	 if( lenDefaultValueTime > 0){
			if (lenDefaultValueText == 0) {
				document.getElementById("defaultValueErrorMsg").innerHTML = getUiProps().MSG0115;
				return false;
				} 
		}else if(lenDefaultValueText > 0){
			if(lenDefaultValueTime == 0){
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
		    document.getElementById('complexDefaultValueTime').value = currentTime;
			}
		} 
	 
	 
		return true;
	}
	return true;
};

/**
 * The purpose of this function is to validate Edm.Single type.
 * @param defaultValueText
 * @param lenDefaultValueText
 */
complexTypeProperty.prototype.isTypeSingleValid = function (defaultValueText, lenDefaultValueText) {
	var decimalIndex = defaultValueText.indexOf(".");
	var integerPart = defaultValueText.substring("0", decimalIndex);
	var fractionalPart = defaultValueText.substring(decimalIndex, lenDefaultValueText);
	var lenIntegerPart = integerPart.length;
	var lenFractionalPart = fractionalPart.length - 1;
	if (decimalIndex == -1) {
		lenFractionalPart = fractionalPart.length;
	}
	if(lenIntegerPart > 5 || lenFractionalPart > 5) {
		return false;
	}
	return true;
};

/**
 * The purpose of this function is to convert date into Epoch Date.
 */
complexTypeProperty.prototype.retrieveEpochDate = function(defaultDate,
		defaultTimeStamp) {
	var date = defaultDate;
	var time = defaultTimeStamp;
	var hours = "";
	var minutes = "";
	var seconds = "";
	if (date != null && (time == null || time == undefined || time == '')) {
		date = defaultDate;
		var currentDate = new Date();
		hours = currentDate.getHours();
		minutes = currentDate.getMinutes();
		seconds = currentDate.getSeconds();
	} else if (time != null && date != null) {
		var fullTime = time.split(':');
		hours = fullTime[0];
		minutes = fullTime[1];
		seconds = fullTime[2];
		if (!seconds) {
			seconds = "00";
		}
		date = defaultDate;
	}
	var selectedDateWithTime = date + " " + hours + ":" + minutes + ":"
			+ seconds;
	var epochDateTime = new Date(selectedDateWithTime).getTime();
	epochDateTime = "/Date(" + epochDateTime + ")/";
	return epochDateTime;
};

/**
 * The purpose of this function is to set Default Value field type as per
 * type selected from the Type drop down.
 */
complexTypeProperty.prototype.setDefaultValueFieldAsPerType = function () {
	$("#complexDefaultValueTime").remove();
	//$("#txtBoxDefaultValue").val('');
	$('#typeDDErrorMsg').html('');
	$('#defaultValueErrorMsg').html('');
	$('#defaultValueTxtAreaErrorMsg').html('');
	uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
	var input = "";
	var typeSelected = "";
	typeSelected = $("#dropDownType").val();
	var selectedIndexValue = document.getElementById("dropDownType").selectedIndex;
	$("#txtBoxDefaultValue").removeAttr('disabled');
	input = document.getElementById ("txtBoxDefaultValue");
	input.type = "";
	if(selectedIndexValue > 5) {
		input.type = "text";
		uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
		$('#txtBoxDefaultValue').val('');
		$("#txtBoxDefaultValue").attr('disabled', 'disabled');
	}
	if (typeSelected === "Edm.DateTime") {
		var dateTabIndex = $('#txtBoxDefaultValue').attr('tabindex');
		input.type = "date";
		var input = document.createElement("input");
		input.type = "time";
		input.step = "1";
		input.className = "time"; // set the CSS class
		input.id = "complexDefaultValueTime";
		$("#idDefaultValue").append(input);
		$("#complexDefaultValueTime").css("width","114px");
		$("#complexDefaultValueTime").css("padding-left","0px");
		$("#complexDefaultValueTime").attr('tabindex', dateTabIndex);
		$('#txtBoxDefaultValue').addClass('unstyledDateTypeSpinButton');
		uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
		$('#txtBoxDefaultValue').addClass('unstyledDateTypeSpinButton');
		$("#txtBoxDefaultValue").attr('required', 'required');
		$("#txtBoxDefaultValue").css("padding-right", '0px');
		$("#txtBoxDefaultValue").css("width", '120px');
		$("#txtBoxDefaultValue").css("float", 'left');
	}
	if (typeSelected === "Edm.Boolean") {
		$("#idStringType").hide();
		$("#idDefaultValue").hide();
		$("#idBooleanType").show();
		$('#txtBoxDefaultValue').removeClass('unstyledDateTypeSpinButton');
		uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
		$("#txtBoxDefaultValue").attr('required', '');
		$("#txtBoxDefaultValue").css("padding-right", '0px');
		$("#txtBoxDefaultValue").css("width", '240px');
	}
	if (typeSelected != "Edm.Boolean") {
		$("#idDefaultValue").show();
		$("#idBooleanType").hide();
	}
	if (typeSelected != "Edm.String" && typeSelected != "Edm.Boolean") {
		$("#idStringType").hide();
		$("#idDefaultValue").show();
		$("#idBooleanType").hide();
		$('#txtAreaDefaultValue').val('');
	}
	if (typeSelected === "Edm.String") {
		$('#txtBoxDefaultValue').removeClass('unstyledDateTypeSpinButton');
		$("#idDefaultValue").hide();
		$("#idBooleanType").hide();
		$("#idStringType").show();
	
	}
	if(typeSelected != "Edm.DateTime"){
		$("#txtBoxDefaultValue").css("padding-right", '25px');
		$("#txtBoxDefaultValue").css("width", '215px');
		$('#txtBoxDefaultValue').val('');
	}
	if(typeSelected === "Edm.Int32"){
		$("#txtBoxDefaultValue").attr('required', '');
		$("#complexDefaultValueTime").remove();
		//$("#txtBoxDefaultValue").css("padding-right", '');
		//$("#txtBoxDefaultValue").css("width", '');
	} 
};

/**
 * The purpose of this function is to retrieve API response.
 * @param json
 * @param operationPerformed
 * @param complexTypeName
 * @param complexTypePropName
 */
complexTypeProperty.prototype.retrieveAPIResponse = function (json, operationPerformed, complexTypeName, complexTypePropName) {
	var response = null;
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	if (boxName == mainBoxValue) {
		boxName = getUiProps().MSG0293;
	}
	var collectionName= uEntityTypeOperations.getFolderHeirarchy(boxName);//sessionStorage.collectionName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", boxName);
	var objComplexTypePropertyManager = new _pc.ComplexTypePropertyManager(accessor, collectionName);
	if (operationPerformed === "CREATE") {
		response = objComplexTypePropertyManager.create(json);
	}
	if (operationPerformed == "RETRIEVE") {
		response = objComplexTypePropertyManager.retrieveComplexTypePropertyList(complexTypeName);
	}
	if (operationPerformed == "RETRIEVE DETAILS") {
		response = objComplexTypePropertyManager.retrieve(complexTypeName, complexTypePropName);
	}
	return response;
};

/**
 * The purpose of this function is to create ComplexTypeProperty.
 */
complexTypeProperty.prototype.createComplexTypeProperty = function () {
	showSpinner("modalSpinnerEntityType");
	var lenTxtDefaultValue = "";
	var json = "";
	var lenSelectedCollectionKind = "";
	var lenSelectedNullable = "";
	var txtComplexTypeProperty = $("#txtBoxComplexTypePropName").val();
	var txtComplexType = $("#txtBoxComplexTypeName").val();
	var selectedType = uComplexTypeProperty.getSelectedComplectTypeFromDropDown('dropDownType');//$("#dropDownType").val();
	var selectedNullable = $("#dropDownNullable").val();
	var txtDefaultValue = $("#txtBoxDefaultValue").val();
	var txtDefaultValueTime = $("#complexDefaultValueTime").val();
	var txtAreaDefaultValue = document.getElementById("txtAreaDefaultValue").value;
	var selectedCollectionKind = $("#dropDownCollectionKind").val();
	
	if (selectedNullable === null) {
		selectedNullable = null;
	}
	if (selectedType === "Edm.Boolean") {
		txtDefaultValue = $("#dropDownTypeBoolean").val();
	}
	if (selectedType === "Edm.String") {
		txtDefaultValue = txtAreaDefaultValue;
	}
	if (selectedType === "Edm.DateTime" && txtDefaultValue.length > 0) {
		txtDefaultValue = uComplexTypeProperty.retrieveEpochDate(txtDefaultValue,txtDefaultValueTime);
	}
	lenTxtDefaultValue = txtDefaultValue.length;
	lenSelectedNullable = selectedNullable.length;
	lenSelectedCollectionKind = selectedCollectionKind.length;
	
	if (uComplexTypeProperty.validate(txtComplexTypeProperty, selectedType)) {
		json = "{";
		json += '"Name":"'+txtComplexTypeProperty+'","_ComplexType.Name":"'+txtComplexType+'","Type":"'+selectedType+'"';
		if(lenSelectedNullable != 0 && selectedNullable != "null") {
			json += ',"Nullable":"'+selectedNullable+'"';
		}
		if(lenTxtDefaultValue != 0) {
			json += ',"DefaultValue":"'+txtDefaultValue+'"';
		}
		if(lenSelectedCollectionKind != 0) {
			json += ',"CollectionKind":"'+selectedCollectionKind+'"';
		}
		json +="}";
		try {
			var response = uComplexTypeProperty.retrieveAPIResponse(json, "CREATE");
			if (response !=  undefined && response.getStatusCode() != 409 && response.getStatusCode() != 400 && response.getStatusCode() == 201) {
				var successMsg = getUiProps().MSG0267;
				objCommon.displaySuccessMessage(successMsg, '#complexTypePropertyModalWindow', "294px", "crudOperationMessageBlock");
				uComplexTypeProperty.createComplexTypePropertyTable(txtComplexType);
			} else if(response.getStatusCode() == 409) {
				document.getElementById("complexTypePropNameErrorMsg").innerHTML = getUiProps().MSG0085;
				cellpopup.showErrorIcon('#txtBoxComplexTypePropName');
			}
		} catch (exception) {
			if (exception.getCode() == "PR400-OD-0001") {
				uEntityTypeProperty.setErrorMessageSpanVal('#defaultValueTxtAreaErrorMsg',	getUiProps().MSG0080);
			} else if (exception.getCode() == "PR400-OD-0032") {
				var hierarchyExceedsmessage = exception.message;
				objCommon.displayErrorMessage (hierarchyExceedsmessage, '#complexTypePropertyModalWindow', "555px", "crudOperationMessageBlock");
			} else {
				var message = getUiProps().MSG0269;
				objCommon.displayErrorMessage (message, '#complexTypePropertyModalWindow', "284px", "crudOperationMessageBlock");
			}
		}
	}
	removeSpinner("modalSpinnerEntityType");
};

/**
 * The purpose of this function is to return selected complex type value from
 * drop down
 * @param dropDownID
 * @returns
 */
complexTypeProperty.prototype.getSelectedComplectTypeFromDropDown = function(dropDownID) {
	var selectedCompType = null;
	var dropDown = document.getElementById(dropDownID);
	if (dropDown.selectedIndex > 0 ) {
		selectedCompType = dropDown.options[dropDown.selectedIndex].title;
	}
	return selectedCompType;
};

/********************* COMPLEX TYPE PROPERTY CREATE : END *********************/

/********************* COMPLEX TYPE PROPERTY VIEW : START *********************/

/**
 * The purpose of this function is to display first complex type property
 * selected in grid.
 * @param complexTypePropName
 * @param complexTypeName
 */
complexTypeProperty.prototype.getFirstComplexTypePropertySelected = function (complexTypePropName, complexTypeName) {
	sessionStorage.deletedComplexTypePropName = complexTypePropName;
	sessionStorage.deletedComplexTypeName = complexTypeName;
	$("#complexTypePropertyCol_0").addClass("ctpRowSelect");
	var complexType = objCommon.getEnityNameAfterRemovingSpecialChar(complexTypeName);
	uComplexTypeProperty.createComplexTypePropertyDetailsTable(complexTypePropName, complexType);
};

/**
 * The purpose of this function is to create rows for 
 * ComplexTypeProperty table.
 * 
 * @param dynamicRows
 * @param count
 * @param complexTypePropName
 * @param shorterComplexTypePropName
 * @param complexTypeName
 */
complexTypeProperty.prototype.createRowsForComplexTypePropertyTable = function (dynamicRows, count, complexTypePropName, shorterComplexTypePropName, complexTypeName) {
	var complexTypePropNameSelected = "'"+ complexTypePropName +"'" ;
	dynamicRows +="<tr  id='complexTypePropertyRow_"+ count +"' class = 'dynamicComplexTypePropertyRow'>";
	dynamicRows +='<td style="width:100%;max-width:258px;" id="complexTypePropertyCol_'+ count +'" onclick="uComplexTypeProperty.rowSelectComplexTypeProperty(this, '+count+', '+complexTypePropNameSelected+', '+complexTypeName+');"><div id="ctpName" class="complexTypeRow mainTableEllipsis"><label title = "'+complexTypePropName+'" style="cursor: pointer;">'+complexTypePropName+'</label></div></td>';
	dynamicRows +='<td style="width:0%"></td>';
	dynamicRows +="</tr>";
	return dynamicRows;
};

/**
 * The purpose of this function is to get selected ComplexTypeProperty
 * details.
 * @param count
 * @param complexTypePropName
 * @param complexTypeName
 */
complexTypeProperty.prototype.rowSelectComplexTypeProperty = function(obj, count, complexTypePropName, complexTypeName) {
	$(obj).parent().siblings().children().removeClass("ctpRowSelect");
	$(obj).addClass("ctpRowSelect");
	sessionStorage.deletedComplexTypePropName = complexTypePropName;
	sessionStorage.deletedComplexTypeName = complexTypeName;
	uComplexTypeProperty.createComplexTypePropertyDetailsTable(complexTypePropName, complexTypeName);
};

/**
 * The purpose of this function is to create ComplexTypeProperty table.
 * @param complexTypeName
 */
complexTypeProperty.prototype.createComplexTypePropertyTable = function (complexTypeName) {
	$(".dynamicComplexTypePropertyRow").remove();
	$("#dvNoCompTypeProp").hide();
	var complexTypePropName = null;
	var json = uComplexTypeProperty.retrieveAPIResponse("", "RETRIEVE", complexTypeName);
	var sortJSONString = objCommon.sortByKey(json, '__updated');
	var recordSize = sortJSONString.length;
	if (recordSize > 0) {
		$("#complexTypePropertyTerNavRHS").show();
		$("#parentDivNoCTPMessage").hide();
		$("#divCTPTable").show();
		$("#ctpTbody").scrollTop(0);
		var dynamicRows = "";
		for (var count = 0; count < recordSize; count++) {
			var obj = sortJSONString[count];
			complexTypePropName = obj.Name;
			complexTypeName = objCommon.getEnityNameAfterRemovingSpecialChar(complexTypeName);
			complexTypeName = "'"+ complexTypeName +"'" ;
			var shorterComplexTypePropName  = objCommon.getShorterEntityName(complexTypePropName);
			dynamicRows = uComplexTypeProperty.createRowsForComplexTypePropertyTable(dynamicRows, count, complexTypePropName, shorterComplexTypePropName, complexTypeName);
		}
		$("#complexTypePropertyList tbody").append(dynamicRows);
		uComplexTypeProperty.getFirstComplexTypePropertySelected(sortJSONString[0].Name, complexTypeName);
	} else {
		$("#parentDivNoCTPMessage").show();
		$("#divCTPTable").hide();
		$("#complexTypePropertyTerNavRHS").hide();
		$("#complexTypePropertyDetailViewTbody").empty();
		$("#dvNoCompTypeProp").show();
		uComplexTypeProperty.setDynamicHeightOfEmptyComplexTypePropertyMessage();
	}
	uComplexTypeProperty.setComplexTypePropertyDynamicHeight();
};

/**
 * The purpose of this function is to create ComplexTypeProperty details table.
 * @param complexTypePropertyName
 * @param complexTypeName
 */
complexTypeProperty.prototype.createComplexTypePropertyDetailsTable = function (complexTypePropertyName, complexTypeName) {
	$("#complexTypePropLabel").text(complexTypePropertyName);
	document.getElementById("complexTypePropLabel").title = complexTypePropertyName;
	$(".dynamicComplexTypePropertyDetailsRow").remove();
	var dynamicRowsCTPDetailsView = "";
	var json = uComplexTypeProperty.retrieveAPIResponse("", "RETRIEVE DETAILS", complexTypeName, complexTypePropertyName);
	var complexTypePropType = json.Type;
	var nullableValue = json.Nullable;
	var defaultValue = json.DefaultValue;
	var collectionKind = json.CollectionKind;
	
	if(complexTypePropType === "Edm.DateTime") {
		if(defaultValue != null) {
			defaultValue = objCommon.convertEpochDateToReadableFormat(defaultValue);
		}
	}	
	shorterDefaultValue = objCommon.getShorterEntityName(defaultValue);
	dynamicRowsCTPDetailsView += "<tr class='dynamicComplexTypePropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropHeading' style='width: 32%;'>* Complex Type Name</td>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropText' style='width: 68%;max-width:480px;'><div class='mainTableEllipsis'><label title= '"+complexTypeName+"'>"+complexTypeName+"</label></div></td>";
	dynamicRowsCTPDetailsView += "</tr>";
	
	dynamicRowsCTPDetailsView += "<tr class='dynamicComplexTypePropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropHeading' style='width: 32%;'>* Type</td>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropText' style='width: 68%;max-width:480px;'><div class='mainTableEllipsis'><label title= '"+complexTypePropType+"'>"+complexTypePropType+"</label></div></td>";
	dynamicRowsCTPDetailsView += "</tr>";
	
	dynamicRowsCTPDetailsView += "<tr class='dynamicComplexTypePropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropHeading' style='width: 300px;'>Nullable</td>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropText' style='width: 68%;'><div><label>"+nullableValue+"</label></div></td>";
	dynamicRowsCTPDetailsView += "</tr>";
	
	dynamicRowsCTPDetailsView += "<tr class='dynamicComplexTypePropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropHeading' style='width: 32%;'>Default Value</td>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropText' style='width: 68%;max-width:480px;'><div class='mainTableEllipsis'><label title= '"+defaultValue+"'>"+defaultValue+"</label></div></td>";
	dynamicRowsCTPDetailsView += "</tr>";
	
	dynamicRowsCTPDetailsView += "<tr class='dynamicComplexTypePropertyDetailsRow'>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropHeading' style='width: 32%;'>Collection Kind</td>";
	dynamicRowsCTPDetailsView += "<td class='complexTypePropText' style='width: 68%;'><div><label>"+collectionKind+"</label></div></td>";
	dynamicRowsCTPDetailsView += "</tr>";
	
	$("#complexTypePropertyDetailViewTbody").append(dynamicRowsCTPDetailsView);
};

/********************* COMPLEX TYPE PROPERTY VIEW : END *********************/

/********************* COMPLEX TYPE PROPERTY DELETE : START *****************/

/**
 * The purpose of this function is to delete ComplexTypeProperty.
 */
complexTypeProperty.prototype.deleteComplexTypeProperty = function () {
	showSpinner("modalSpinnerEntityType");
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	if (boxName == mainBoxValue) {
		boxName = getUiProps().MSG0293;
	}
	var collectionName= uEntityTypeOperations.getFolderHeirarchy(boxName);//sessionStorage.collectionName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", boxName);
	var objComplexTypePropertyManager = new _pc.ComplexTypePropertyManager(accessor, collectionName);
	var complexTypePropertyName = sessionStorage.deletedComplexTypePropName;
	var complextypeName = sessionStorage.deletedComplexTypeName;
	complextypeName = objCommon.getEnityNameAfterRemovingSpecialChar(complextypeName);
	var key = "Name='"+complexTypePropertyName+"',_ComplexType.Name='"+complextypeName+"'";
	var etag = uComplexTypeProperty.getEtag(complextypeName, complexTypePropertyName, objComplexTypePropertyManager);
	var promise = objComplexTypePropertyManager.del(key,etag);
	if (promise != undefined) {
		uComplexTypeProperty.displayDeleteMessageForComplextTypeProperty(promise, complexTypePropertyName, complextypeName);
	}
	removeSpinner("modalSpinnerEntityType");
};

/**
 * The purpose of this function is to retrieve etag of particular complex type property
 * @param complextypeName
 * @param complexTypePropertyName
 * @param objComplexTypePropertyManager
 * @returns etag
 */
complexTypeProperty.prototype.getEtag = function (complextypeName, complexTypePropertyName, objComplexTypePropertyManager) {
	var json = objComplexTypePropertyManager.retrieve(complextypeName, complexTypePropertyName);
	var etag = json.__metadata.etag;
	return etag;
};

/**
 * The purpose of this function is to display message for delete operation
 * @param response
 * @param entityTypeName
 */
complexTypeProperty.prototype.displayDeleteMessageForComplextTypeProperty = function (promise, complexTypePropertyName, complextypeName) {
	if (promise.resolvedValue != null && promise.resolvedValue.status == 204) {
		var message = getUiProps().MSG0270;
		objCommon.displaySuccessMessage(message, '#complexTypePropertyDeleteModalWindow', "290px", "crudOperationMessageBlock");
		uComplexTypeProperty.createComplexTypePropertyTable(complextypeName);
	} else if (promise.errorMessage != null && promise.errorMessage.status == 409) {
		var message = getUiProps().MSG0271;
		objCommon.displayErrorMessage(message, '#complexTypePropertyDeleteModalWindow', "285px", "crudOperationMessageBlock");
	}
};
/********************* COMPLEX TYPE PROPERTY DELETE : END *******************/

/**
 * The purpose of this method is to set dynamic height for Complex TYpe Property List View.
 */
complexTypeProperty.prototype.setComplexTypePropertyDynamicHeight = function(){
	var height = $(window).height();
	var ctpListHeight = height - 295;
	var entityTypeBodyHeight = height-381;
	var ctpTableHeight = height - 368;
	if (height>650){
		$("#ctpTbody").css("max-height",entityTypeBodyHeight + "px");
		$("#complexTypePropertyList").css("height", ctpTableHeight+"px");
		$(".entityTypeList").css('min-height', ctpListHeight + "px");
	}else if (height <= 650){
		$("#ctpTbody").css("max-height","269px");
		$(".entityTypeList").css('min-height', "355px");
		$("#complexTypePropertyList").css("height", "282px");
	}
};

/**
 * The purpose of this function is to set dynamix height of empty complex type property message.
 */
complexTypeProperty.prototype.setDynamicHeightOfEmptyComplexTypePropertyMessage = function() {
	var viewPortHeight = $(window).height();
	//var odataRightViewHeight = $("#odataRightView").height();
	var ctpTableHeight = viewPortHeight - 368;
	var marginTop = (ctpTableHeight/2)-20;//(odataRightViewHeight - 72)/2;
	if (viewPortHeight > 650) {
		$("#parentDivNoCTPMessage").css("height", ctpTableHeight+"px");
		$("#innerDivNoCTPMessage").css("height", marginTop+'px');
	} else if(viewPortHeight <= 650) {
		$("#innerDivNoCTPMessage").css("height", "125px");
		$("#parentDivNoCTPMessage").css("height", "282px");
	}
};

/********************* ON BLUR VALIDATIONS : START *******************/
/**
 * Following method validates complex type property name on blur event.
 */
$("#txtBoxComplexTypePropName").blur(
		function() {
			var complexTypePropName = $("#txtBoxComplexTypePropName").val();
			if (uComplexTypeProperty.validateComplexTypePropName(complexTypePropName)) 
				document.getElementById("complexTypePropNameErrorMsg").innerHTML = "";
	});
/**
 * Following method validates dropdown name on blur event.
 */
$("#dropDownType").blur(function() {
	if (uComplexTypeProperty.validateTypeEmptyDropDown() == false)
		uEntityTypeProperty.removeStatusIcons('#txtBoxDefaultValue');
});

/**
 * Following method validates default value name on blur event.
 */
$("#txtBoxDefaultValue").blur(
		function() {
			var selectedType = uComplexTypeProperty.getSelectedComplectTypeFromDropDown('dropDownType');
			var txtDefaultValue = $("#txtBoxDefaultValue").val();
			var txtDefaultValueTime = $("#complexDefaultValueTime").val();
			if (selectedType === "Edm.Boolean") {
				txtDefaultValue = $("#dropDownTypeBoolean").val();
			}
			if (selectedType === "Edm.String") {
				txtDefaultValue = txtAreaDefaultValue;
			}
			if (selectedType === "Edm.DateTime" && txtDefaultValue.length > 0) {
				txtDefaultValue = uComplexTypeProperty.retrieveEpochDate(txtDefaultValue,txtDefaultValueTime);
			}
			if (uComplexTypeProperty.validateDefaultValue(selectedType))
				$('#defaultValueErrorMsg').html('');
		});

/**
 * Following method check time default value validations on blur event.
 */
if($("#OdataSchemaTab").hasClass("odataTabSelected")){
$("#complexDefaultValueTime").live('blur',function(){
	var selectedType = uComplexTypeProperty.getSelectedComplectTypeFromDropDown('dropDownType');
	var txtDefaultValue = $("#txtBoxDefaultValue").val();
	var txtDefaultValueTime = $("#complexDefaultValueTime").val();
	if (selectedType === "Edm.Boolean") {
		txtDefaultValue = $("#dropDownTypeBoolean").val();
	}
	if (selectedType === "Edm.String") {
		txtDefaultValue = txtAreaDefaultValue;
	}
	if (selectedType === "Edm.DateTime" && txtDefaultValue.length > 0) {
		txtDefaultValue = uComplexTypeProperty.retrieveEpochDate(txtDefaultValue,txtDefaultValueTime);
	}
	if (uComplexTypeProperty.validateDefaultValue(selectedType))
		$('#defaultValueErrorMsg').html('');
});
}
/********************* ON BLUR VALIDATIONS : END *******************/
$(function() {
	/*$("#btnDeleteComplexTypeProperty").click(function() {
		uComplexTypeProperty.deleteComplexTypeProperty();
	});*/
});

