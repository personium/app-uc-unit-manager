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
function registerFileAsService() {
}

var uRegisterFileAsService = new registerFileAsService();
var registeredServiceList = [];
var isExist = false;

/**
 * The purpose of this function is to empty all field values of
 * registration pop up.
 */
registerFileAsService.prototype.emptyServiceRegistrationFieldsValues = function () {
	$("#dropDownSourceFileID").val('');
	$("#txtBoxServiceNameID").val('');
	$('#sourceFileDDErrorMsg').html('');
	$('#serviceNameErrorMsg').html('');
	$("#chkSelectallServiceRegistrationPopup").attr('checked', false);
	uRegisterFileAsService.removeStatusIcons('#txtBoxServiceNameID');
	uRegisterFileAsService.disableDeleteIcon();
};

/**
 * The purpose of this function is to fetch the uploaded files list
 * against the selected collection.
 * 
 * @returns {Array}
 */
registerFileAsService.prototype.fetchEngineServiceUploadedFileList = function () {
	//var engineServiceName = sessionStorage.rowSelectCollectionName;
	var accessor = objOdata.getAccessor();
	var path = sessionStorage.selectedCollectionURL;//objOdata.getPath();
	/*if (!path.endsWith("/")) {
		 path += "/";
	}
	path += engineServiceName+"/__src";*/
	path += "/__src";
	var objJDavCollection = new _pc.DavCollection(accessor, path);
	var serviceColList =  objJDavCollection.getResourceList(path);
	var sortedServiceCollectionData = objCommon.sortByKey(serviceColList, 'Date');
	var recordSize = sortedServiceCollectionData.length;
	var arrName = new Array();
	var uploadedFilesArray = new Array();
	for (var count = 0; count < recordSize; count++) {
		var arrayData = sortedServiceCollectionData[count];
		arrName[count] = arrayData.Name;
		var collectionName = decodeURIComponent(objOdata.getName(arrName[count].toString()));
		uploadedFilesArray[count] = collectionName;
	}
	return uploadedFilesArray;
};

/**
 * The purpose of this function is to bind source file drop down.
 * 
 * @param uploadedFileArray
 */
registerFileAsService.prototype.bindSourceFileDropDown = function (uploadedFileArray) {
	var arrayLength = uploadedFileArray.length;
	var select = document.getElementById("dropDownSourceFileID");
	select.options.length = 0;
	var newOption = document.createElement('option');
	newOption.value = 0;
	newOption.innerHTML = getUiProps().MSG0393;
	select.insertBefore(newOption, select.options[-1]);
	for (var count = 0; count < arrayLength; count++) {
		var newOption = document.createElement("option");
		var name = uploadedFileArray[count];
		var shorterName = objCommon.getShorterName(name, 30);
		newOption.text = shorterName;
		newOption.value = name;
		newOption.title = name;
		select.appendChild(newOption);
	}
};

/**
 * The purpose of this function is to validate empty source file
 * drop down.
 * 
 * @returns {Boolean}
 */
registerFileAsService.prototype.validateEmptySourceFileDropDown = function () {
	var sorceFileDD = $("#dropDownSourceFileID").val();
	var dropDownEmptyMessage = getUiProps().MSG0144;
	if (sorceFileDD == 0) {
		document.getElementById("sourceFileDDErrorMsg").innerHTML = dropDownEmptyMessage;
		return false;
	} else {
		document.getElementById("sourceFileDDErrorMsg").innerHTML = "";
	}
	return true;
};

/**
 * The purpose of this function is to validate service name.
 * 
 * @param serviceName
 * @returns {Boolean}
 */
registerFileAsService.prototype.validateServiceName = function (serviceName) {
	var minLengthMessage = getUiProps().MSG0142;
	var maxLengthMessage = getUiProps().MSG0143;
	var existingServiceNameMsg = getUiProps().MSG0145;
	var lenServiceName = serviceName.length;
	var letters = /^[0-9a-zA-Z-_]+$/;
	var startHyphenUnderscore = /^[-_]/;
	if (lenServiceName < 1 || serviceName == undefined || serviceName == null
			|| serviceName == "") {
		document.getElementById("serviceNameErrorMsg").innerHTML = minLengthMessage;
		cellpopup.showErrorIcon("#txtBoxServiceNameID");
		return false;
	} else if (lenServiceName > 128) {
		document.getElementById("serviceNameErrorMsg").innerHTML = maxLengthMessage;
		cellpopup.showErrorIcon("#txtBoxServiceNameID");
		return false;
	} else if (this.isServiceNameExist(serviceName)) {
		document.getElementById("serviceNameErrorMsg").innerHTML = existingServiceNameMsg;
		cellpopup.showErrorIcon("#txtBoxServiceNameID");
		return false;
	}else if (serviceName.match(startHyphenUnderscore)) {
        document.getElementById("serviceNameErrorMsg").innerHTML = getUiProps().MSG0391;
        cellpopup.showErrorIcon("#txtBoxServiceNameID");
        return false;
	} else if (lenServiceName != 0 && ! (serviceName.match(letters))){
		document.getElementById("serviceNameErrorMsg").innerHTML = getUiProps().MSG0048;
		cellpopup.showErrorIcon("#txtBoxServiceNameID");
		return false;
	}
	cellpopup.showValidValueIcon("#txtBoxServiceNameID");
	return true;
};

/**
 * The purpose of this function is to add successfulWrapper and successfulIcon
 * class after removing all the added classes.
 */
registerFileAsService.prototype.addSuccessClassOnPopup = function () {
	$("#messageWrapperPopUp").removeClass("partialSuccessfulWrapper");
	$("#messageWrapperPopUp").addClass("successfulWrapper");
	$("#messageIconPopUp").removeClass("errorIcon");
	$("#messageIconPopUp").removeClass("partialSuccessfulIcon");
	$("#messageIconPopUp").addClass("successfulIcon");
};

/**
 * The purpose of this function is to add errorWrapper and errorIcon class after
 * removing all the added classes.
 */
registerFileAsService.prototype.addErrorClassOnPopup = function () {
	$("#messageWrapperPopUp").removeClass("successfulWrapper");
	$("#messageWrapperPopUp").removeClass("partialSuccessfulWrapper");
	$("#messageWrapperPopUp").addClass("errorWrapper");
	$("#messageIconPopUp").removeClass("successfulIcon");
	$("#messageIconPopUp").removeClass("partialSuccessfulIcon");
	$("#messageIconPopUp").addClass("errorIcon");
};

/**
 * The purpose of this function is to set the style to "inline" for all child
 * div(s) of messageBlock div.
 */
registerFileAsService.prototype.inlineMessageBlockOfPopup = function (width,divID) {
	$(divID).css("width", width);
	$(divID).css("display", 'table');
};

/**
 * The purpose of this function is to hide notification message of service
 * registration popup.
 */
registerFileAsService.prototype.hideNotificationMessage = function () {
	document.getElementById("serviceRegistraionMessageBlock").style.display = "none";
};

/**
 * The purpose of this function is to select all check boxes on service
 * registration pop up.
 * 
 * @param cBox
 */
registerFileAsService.prototype.checkAllRegisteredServices = function (cBox) {
	//var noOfRows = $("#tblRegisteredServices tbody tr").length;
	if (cBox.checked == true) { 
		$("#tblRegisteredServices tbody tr ").addClass('selectRow');
		$(".chkClass").attr('checked', true); 
		uRegisterFileAsService.enableDeleteIcon();
		
	} else {
		$("#tblRegisteredServices tbody tr ").removeClass('selectRow');
		$(".chkClass").attr('checked', false);
		uRegisterFileAsService.disableDeleteIcon();
	}
};

/**
 * The purpose of this function is to display notification message on service
 * registration pop up.
 * 
 * @param statusCode
 */
registerFileAsService.prototype.displayNotificationMessageOnPopUp = function (statusCode,isDelete,count) {
	var successfulRegistrationMessage = getUiProps().MSG0140;
	var unsuccessfulRegistrationMessage = getUiProps().MSG0141;
	var RIBBONTIMEOUT = '5000';
	var SUCCESSCODE = 207;
	if (statusCode === SUCCESSCODE) {
		this.createRegisteredServicesTable();
		addSuccessClass('#serviceRegistraionMessageIcon');
		uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#serviceRegistraionMessageBlock');
		uRegisterFileAsService.disableDeleteIcon();
		if (isDelete ==  true){
			closeEntityModal('#serviceRegistrationDeleteModalWindow');
			document.getElementById("serviceRegistraionSuccessMsg").innerHTML = count+" " + getUiProps().MSG0392;
			}
			else {
				document.getElementById("serviceRegistraionSuccessMsg").innerHTML = successfulRegistrationMessage;	
			}
	} else {
		addErrorClass('#serviceRegistraionMessageIcon');
		uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#serviceRegistraionMessageBlock');
		document.getElementById("serviceRegistraionSuccessMsg").innerHTML = unsuccessfulRegistrationMessage;
		}
	this.emptyServiceRegistrationFieldsValues();
	objCommon.autoHideAssignRibbonMessage('serviceRegistraionMessageBlock');
	//window.setTimeout(function(){uRegisterFileAsService.hideNotificationMessage();}, RIBBONTIMEOUT);
};

/**
 * The purpose of this function is to register file as a service.
 */
registerFileAsService.prototype.registerFileAsAService = function () {
	var serviceNameTxtBox = $("#txtBoxServiceNameID").val();
	var sourceFileName = $("#dropDownSourceFileID").val();
	var objOdata = new odata();
	if (this.validateServiceName(serviceNameTxtBox)) {
		$('#serviceNameErrorMsg').html('');
		if (this.validateEmptySourceFileDropDown()) {
			var serviceSourceFilePair = "";
			$('#sourceFileDDErrorMsg').html('');
			registeredServiceList = this.retrieveRegisteredFilesList();
			serviceSourceFilePair = {"serviceName" : serviceNameTxtBox,"sourceFileName" : sourceFileName};
			if (registeredServiceList.length > 0) {
				for (var index = 0; index < registeredServiceList.length ; index++) {
					var fileName = registeredServiceList[index].sourceFileName;
					if (fileName == sourceFileName) {
						registeredServiceList.splice(index,1);
						registeredServiceList.push(serviceSourceFilePair);
					} else {
						if (this.isSourceFileExist(sourceFileName)){
							isExist = false;
						}else {
							isExist = false;
							registeredServiceList.push(serviceSourceFilePair);
						}
					}
				}
			} else {
				registeredServiceList.push(serviceSourceFilePair);
			}
			var ENGINE = this.getEngineSubject();
			var accessor = objOdata.getAccessor();
			var path = sessionStorage.selectedCollectionURL;//objOdata.getPath();
			 /*if (!path.endsWith("/")) {
				 path += "/";
				}
			path += sessionStorage.rowSelectCollectionName;*/
			var objServiceCollection = new _pc.ServiceCollection(accessor, path);
			var response = objServiceCollection.multipleServiceConfigure(registeredServiceList, ENGINE);
			var statusCode = response.httpClient.status;
			this.displayNotificationMessageOnPopUp(statusCode);
		}
	}
};

registerFileAsService.prototype.getEngineSubject = function() {
	var path = uBoxProperty.getPath();
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.propfind(path);
	var xmlContent = response.httpClient.responseText;
	try {
		return xmlContent.match(/subject=\"([^\"]+?)\"/)[1];
	} catch (e) {
		return "";
	}
	
}

/**
 * The purpose of this function is to check existing service name.
 * 
 * @param serviceName
 * @returns {Boolean}
 */
registerFileAsService.prototype.isServiceNameExist = function (serviceName) { 
	var isExists = false;
	var registeredServiceNameList = [];
	registeredServiceNameList = this.retrieveRegisteredFilesList();
	var len = registeredServiceNameList.length;
	for (var count = 0; count < len; count++) {
		var existingServiceName = registeredServiceNameList[count].serviceName;
		if(existingServiceName == serviceName) {
			isExists = true;
			break;
		}
	}
	return isExists;
};

/**
 * The purpose of this function is to check source file name existence
 * before adding it in array.
 * 
 * @param sourceFileName
 * @returns {Boolean}
 */
registerFileAsService.prototype.isSourceFileExist = function (sourceFileName) { 
	for (var count = 0; count < registeredServiceList.length; count++) {
		var existingSourceFileName = registeredServiceList[count].sourceFileName;
		if(existingSourceFileName == sourceFileName) {
			isExist = true;	
		}
	}
	return isExist;
};

/**
 * The purpose of this function is to retrieve registered files list.
 * 
 * @returns {Array}
 */
registerFileAsService.prototype.retrieveRegisteredFilesList = function () {
	var registeredServicesList = [];
	//var engineServiceName = sessionStorage.rowSelectCollectionName;
	var accessor = objOdata.getAccessor();
	var path = sessionStorage.selectedCollectionURL;//objOdata.currentCollectionPath;  //objOdata.getPath();
	/*if (!path.endsWith("/")) {
		path += "/";
	}
	path += engineServiceName;*/
	var objServiceCollection = new _pc.ServiceCollection(accessor, path);
	var response  = objServiceCollection.propfind();
	registeredServicesList =  this.getRegisteredServices(response);
	return registeredServicesList;
};

/**
 * The purpose of this function is to create rows of registered services
 * table.
 * 
 * @param lenRegisteredServicesList
 * @param registeredServicesList
 */
registerFileAsService.prototype.createRowsForRegisteredServicesTable = function (lenRegisteredServicesList, registeredServicesList) {
	var registeredServiceDynamicTable = "";
	var serviceName = "";
	var sourceFileName = "";
	var engineServiceName = sessionStorage.rowSelectCollectionName;
	var path = objOdata.getPath();
	if (!path.endsWith("/")) {
		path += "/";
	}
	path += engineServiceName;
	$("#chkSelectallServiceRegistrationPopup").attr('disabled', false);
	$("#chkSelectallServiceRegistrationPopup").css('cursor', 'pointer');
	var arrserviceName = [];
	var arrserviceFile = [];
	var arrservicePath = [];
	for (var count = 0; count < lenRegisteredServicesList; count++) {
		serviceName = registeredServicesList[count].serviceName;
		sourceFileName = registeredServicesList[count].sourceFileName;
		if (!path.endsWith("/")) {
			path += "/";
		}
		var serviceURL = path+serviceName;
		var rowServiceName= "'"+serviceName+"'";
		var rowSourceFileName= "'"+sourceFileName+"'";
		arrserviceName.push(serviceName.length);
		arrserviceFile.push(sourceFileName.length);
		arrservicePath.push(serviceURL.length);
		registeredServiceDynamicTable += '<tr id="rowID_'+count+'" style="" class="registeredServiceDynamicRow" onclick="uRegisterFileAsService.rowSelectGrid('+count+','+lenRegisteredServicesList+')">';
		registeredServiceDynamicTable += '<td id="colchkID_'+count+'" class="col1" style="padding-left: 10px; min-width:27px"><input id = "chkBox_'+count+'" type = "checkbox" class = "chkClass case cursorHand regular-checkbox big-checkbox" name = "case"/><label for="chkBox_'+count+'" class="customChkbox checkBoxLabel"></label></td>';
		registeredServiceDynamicTable += '<td style="min-width:175px"><div class=""><label id="colServiceNameID_'+count+'" class="cursorPointer">'+serviceName+'</label></div></td>';
		registeredServiceDynamicTable += '<td style="min-width:175px"><div class=""><label id="colServiceName_'+count+'" class="cursorPointer">'+sourceFileName+'</label></div></td>';
		registeredServiceDynamicTable += '<td style="min-width:315px"><div class=""><label id="colPathLink_'+count+'" class="cursorPointer serviceRegistrationUrl">'+serviceURL+'</label></div></td>';
		registeredServiceDynamicTable += '</tr>';
	}
	var tbody = document.getElementById("tbodyServicesRegistered");
	tbody.innerHTML = registeredServiceDynamicTable;
	//$("#tblRegisteredServices tbody tr:last td").css('border-bottom','none');
	$("#tblRegisteredServices").css('border-bottom','1px solid #e6e6e6');
	$("#tblRegisteredServices").css('border-left','1px solid #e6e6e6');
	$("#tblRegisteredServices").css('border-right','1px solid #e6e6e6');
	$("#tblRegisteredServices thead tr th:eq(0)").css('border-left','none');
	$("#tblRegisteredServices thead tr th:eq(3)").css('border-right','none');
	$("#tblRegisteredServices tbody ").css('height',220+"px");
	$("#tblRegisteredServices").css('overflow-x',"auto");
	uRegisterFileAsService.applyDynamicMinWidth(arrserviceName, arrserviceFile, arrservicePath);
};

/**
 * The purpose of this function is to create table of files registered as
 * a service.
 */
registerFileAsService.prototype.createRegisteredServicesTable = function () {
	$(".noServiceRegisteredMsg").remove();
	$(".registeredServiceDynamicRow").remove();
	var registeredServicesList =  this.retrieveRegisteredFilesList();
	if (registeredServicesList != undefined) {
		var lenRegisteredServicesList = registeredServicesList.length;
		if (lenRegisteredServicesList > 0) {
			$('#dvEmptyServiceRegistration').hide();
			this.createRowsForRegisteredServicesTable(lenRegisteredServicesList, registeredServicesList);
		} else {
			$('#dvEmptyServiceRegistration').show();
			$("#chkSelectallServiceRegistrationPopup").attr('disabled', true);
			$("#chkSelectallServiceRegistrationPopup").css('cursor', 'default');
			$("#tblRegisteredServices").css('border-left','none');
			$("#tblRegisteredServices").css('border-right','none');
			$("#tblRegisteredServices").css('border-bottom','none');
			$("#tblRegisteredServices").css('border-right','none');
			$("#tblRegisteredServices thead >tr >th+th").css('min-width',175+"px");
			$("#tblRegisteredServices thead >tr >th+th+th").css('min-width',175+"px");
			$("#tblRegisteredServices thead >tr >th+th+th+th").css('min-width',268+"px");
			$("#tblRegisteredServices").css('overflow-x',"hidden");
			$("#tblRegisteredServices tbody ").css('height',0+"px");
			$("#tblRegisteredServices").scrollLeft(0);
			$("#tbodyServicesRegistered").scrollTop(0);
			$("#tblRegisteredServices thead tr th:eq(0)").css('border-left','1px solid #e6e6e6');
			$("#tblRegisteredServices thead tr th:eq(3)").css('border-right','1px solid #e6e6e6');
		}
	}
};

/**
 * The purpose of this function is to open service registration pop up.
 */
registerFileAsService.prototype.openServiceRegistrationModal = function () {
	var collectionName = objOdata.getSelectedCollectionName();
	var path = sessionStorage.selectedCollectionURL;
	var index = path.lastIndexOf("/");
	var subURI = path.substring(0, index+1);
	var fullURI = subURI + collectionName;
	sessionStorage.selectedCollectionURL = fullURI;
	this.emptyServiceRegistrationFieldsValues();
	$('#serviceRegistrationModal').fadeIn(1700);
	var winH = $(window).height();
	var winW = $(window).width();
	$('#serviceRegistratioDialog').css('top', winH / 2 - $('#serviceRegistratioDialog').height() / 2);
	$('#serviceRegistratioDialog').css('left', winW / 2 - $('#serviceRegistratioDialog').width() / 2);
	this.createRegisteredServicesTable();
	var uploadedFileArray = this.fetchEngineServiceUploadedFileList();
	this.bindSourceFileDropDown(uploadedFileArray);
	$('#txtBoxServiceNameID').focus();
};

/**
 * The purpose of this function is to close modal pop up.
 */
registerFileAsService.prototype.closeServiceRegistrationModal = function (modelId) {
	$(modelId).hide();
	$('#serviceRegistraionMessageBlock').hide();
	//var objOdata = new odata();
	//var count = sessionStorage.rowSelectCount;
	//var id = "#dvServiceCollectionArrow_"+count;
	/*if ($(id).hasClass("downArrowServiceCollection")) {
		//objOdata.createEngineServiceDetailsTable(count);
		objOdata.displayPluginIcons();
		//objOdata.addColorToRows(count);
	}*/
};

/**
 * The purpose of this function is to parse XML to retrieve list
 * of registered files.
 * 
 * @param response
 * @returns {Array}
 */
registerFileAsService.prototype.getRegisteredServices = function(response) {
	var registeredServiceList = [];
	var serviceName = "";
	var sourceFileName = "";
	var serviceSourceFilePair = "";
	var doc = response.bodyAsXml();
	var propstat = doc.getElementsByTagName("propstat");
	var lenPropstat = propstat.length;
	for ( var count = 0; count < lenPropstat; count++) {
		if (count == 1) {
			break;
		}
		var prop = propstat[count].getElementsByTagName("prop");
		var pService = prop[count].lastElementChild;
		var chPath = pService.children;
		var lenPersoniumPath = chPath.length;
		for ( var serviceCount = 0; serviceCount < lenPersoniumPath; serviceCount++) {
			if (chPath[serviceCount].attributes[0] != undefined) {
				serviceName = chPath[serviceCount].attributes[0].value;
				sourceFileName = chPath[serviceCount].attributes[1].value;
				serviceSourceFilePair = {
						"serviceName" : serviceName,
						"sourceFileName" : sourceFileName
					};
					registeredServiceList.push(serviceSourceFilePair);
			}
		}
	}
	return registeredServiceList;
};

//START DELETE SERVICE REGISTRATION

/**
 * This function registers a file.
 * @param serviceName
 * @param serviceFileName
 * @param arrServiceRegistration
 * @param isAllRecordSelected
 * @param checkedRecords
 */
registerFileAsService.prototype.registerFiles = function (serviceName,serviceFileName,arrServiceRegistration,isAllRecordSelected,checkedRecords) {
	var ENGINE = "engine";
	var accessor = objOdata.getAccessor();
	var response ='';
	$('#sourceFileDDErrorMsg').html('');
	var path = objOdata.getPath();
	if (!path.endsWith("/")) {
	 path += "/";
	}
	path += sessionStorage.rowSelectCollectionName;
	var objServiceCollection = new _pc.ServiceCollection(accessor, path);
	if (isAllRecordSelected == false) {
	 response = objServiceCollection.multipleServiceConfigure(arrServiceRegistration, ENGINE);
	}
	else{
	 arrServiceRegistration.length = 0;
	 response = objServiceCollection.multipleServiceConfigure(arrServiceRegistration, ENGINE);
	}
	var statusCode = response.httpClient.status;
	if (statusCode==207){
	arrServiceRegistration=[];
	uRegisterFileAsService.disableDeleteIcon();
	this.displayNotificationMessageOnPopUp(statusCode,true,checkedRecords);
	}
};

/**
 * This method enables a user to select records for performing delete operation. 
 */
registerFileAsService.prototype.selectRecordsForDelete = function( ){
	var serviceSourceFilePair = "";
	arrServiceRegistration=[];
	var totalRecords = $("#tblRegisteredServices tbody tr").length;
	//var numberOfChecked = $('input[class="chkClass"]:checked').length;
	var numberOfChecked = 0;
	for ( var index = 0; index < totalRecords; index++) {
		if ($("#chkBox_" + index).is(':checked')) {
			numberOfChecked++;
		}
	}
	for(var index = 0; index < totalRecords; index++) {
		var chkID = "#chkBox_"+index;
		if (!($(chkID).is(':checked'))) {
			serviceName = document.getElementById("colServiceNameID_" + index).innerHTML;
			serviceFileName = document.getElementById("colServiceName_" + index).innerHTML;
			serviceSourceFilePair = {"serviceName" : serviceName,"sourceFileName" : serviceFileName};
			arrServiceRegistration.push(serviceSourceFilePair);
		}
	}
	if (arrServiceRegistration.length==0) {
		serviceName = document.getElementById("colServiceNameID_0").innerHTML;
		serviceFileName = document.getElementById("colServiceName_0" ).innerHTML;
		serviceSourceFilePair = {"serviceName" : serviceName,"sourceFileName" : serviceFileName};
		arrServiceRegistration.push(serviceSourceFilePair);
		//closeEntityModal('#serviceRegistrationDeleteModalWindow');
		uRegisterFileAsService.registerFiles('', '',arrServiceRegistration,true,numberOfChecked);
	}
	else { 
		//closeEntityModal('#serviceRegistrationDeleteModalWindow');
		uRegisterFileAsService.registerFiles('', '',arrServiceRegistration,false,numberOfChecked);
	}
}; 

/**
 * This functions disables Delete Icon.
 */
registerFileAsService.prototype.disableDeleteIcon = function() {
	//Disable Delete.
	$("#deleteRegisteredService").addClass("deleteIconDisabled");
	$("#deleteRegisteredService").removeClass("deleteIconEnabledServiceRegistration");
	$("#deleteRegisteredService").attr('disabled', true);
};

/**
 * This function enables Delete Icon.
 */
registerFileAsService.prototype.enableDeleteIcon = function() {
	//Enable Delete.
	$("#deleteRegisteredService").removeClass("deleteIconDisabled");
	$("#deleteRegisteredService").addClass("deleteIconEnabledServiceRegistration");
	$("#deleteRegisteredService").attr('disabled', false);
};
	
/**
 * The purpose of the following method is to perform as row select event in the grid. 
 * @param count
 * @param totalRecordsize
 */
registerFileAsService.prototype.rowSelectGrid = function(count, totalRecordsize) {
var targetID = event.target.id.indexOf("Link");
if(targetID == -1){
	if (event.target.tagName.toUpperCase() !== "INPUT") {
		if ($(event.target).is('.customChkbox')	&& event.target.tagName.toUpperCase() === "LABEL") {
			var chkID = $("#chkBox_" + count);
			var rowID = $("#rowID_" + count);
			var obj = rowID;
			if ($(chkID).is(':checked')) {
				obj.removeClass('selectRow');
				$(chkID).attr('checked', true);
			} else {
				obj.addClass('selectRow');
				$(chkID).attr('checked', false);
			}
			
		} else {
			var chkID = $("#chkBox_" + count);
			var rowID = $("#rowID_" + count);
			var obj = rowID;
			obj.siblings().removeClass('selectRow');
			obj.addClass('selectRow');
			for ( var index = 0; index < totalRecordsize; index++) {
				if (index != count) {
					$("#chkBox_" + index).attr('checked', false);
				}
			}
			$(chkID).attr('checked', true);
			
		}
	}
	var numberOfChecked = 0;
	for ( var index = 0; index < totalRecordsize; index++) {
		if ($("#chkBox_" + index).is(':checked')) {
			numberOfChecked++;
		}
	}
	if (totalRecordsize == numberOfChecked) {
		$("#chkSelectallServiceRegistrationPopup").attr('checked', true);
	} else {
		$("#chkSelectallServiceRegistrationPopup").attr('checked', false);
	}
	if (numberOfChecked >0) {
		uRegisterFileAsService.enableDeleteIcon();
	} else {
		uRegisterFileAsService.disableDeleteIcon();
	}
}
};

//END DELETE SERVICE REGISTRATION

/**
 * The purpose of this method is to remove status icon
 * on pop up close event.
 */
registerFileAsService.prototype.removeStatusIcons = function(txtID){
	$(txtID).removeClass("errorIcon");	
	$(txtID).removeClass("validValueIcon");
};

registerFileAsService.prototype.applyScrollCssOnBoxGrid = function() {
	var tbodyObject = document.getElementById("tbodyServicesRegistered");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#tblRegisteredServices td:eq(1)").css("width", '25.2%');
		$("#tblRegisteredServices td:eq(2)").css("width", '25.1%');
	}
};

/**
 * The purpose of this method is to set dynamic min-width for table thead and td
 * based on the entity length.
 * @param arrserviceName
 * @param arrserviceFile
 * @param arrservicePath
 */
registerFileAsService.prototype.applyDynamicMinWidth = function(arrserviceName, arrserviceFile, arrservicePath) {
	var maxLengthServiceName = Math.max.apply( Math, arrserviceName );
	var maxLengthServiceFile = Math.max.apply( Math, arrserviceFile );
	var maxLengthServicePath = Math.max.apply( Math, arrservicePath );
	var minWidthServiceName = 175;
	var minWidthServiceFile = 175;
	var minWidthServicePath = 315;
	
	if (maxLengthServiceName > 25) {
		minWidthServiceName = maxLengthServiceName*8;
	}
	if (maxLengthServiceFile > 25) {
		minWidthServiceFile = maxLengthServiceFile*8;
	}
	if (maxLengthServicePath >55) {
		minWidthServicePath = maxLengthServicePath*6;
	}
	$("#tblRegisteredServices thead >tr >th+th").css('min-width',minWidthServiceName+"px");
	$("#tblRegisteredServices tbody >tr >td+td").css('min-width',minWidthServiceName+"px");
	$("#tblRegisteredServices thead >tr >th+th+th").css('min-width',minWidthServiceFile+"px");
	$("#tblRegisteredServices tbody >tr >td+td+td").css('min-width',minWidthServiceFile+"px");
	$("#tblRegisteredServices thead >tr >th+th+th+th").css('min-width',minWidthServicePath+"px");
	$("#tblRegisteredServices tbody >tr >td+td+td+td").css('min-width',minWidthServicePath+"px");
	$('#tblRegisteredServices').scroll(function () {
		$("#tblRegisteredServices > tbody").width($("#tblRegisteredServices").width() + $("#tblRegisteredServices").scrollLeft());
	});
	$("#tblRegisteredServices").scrollLeft(0);
	$("#tbodyServicesRegistered").scrollTop(0);
};

/**
**The purpose of this function is to validate service path.
* 
*/
registerFileAsService.prototype.validateService = function() {
	var serviceNameID = document.getElementById("txtBoxServiceNameID").value;
	if (uRegisterFileAsService.validateServiceName(serviceNameID))
		$('#serviceNameErrorMsg').text('');
};

/**
 * Following method validates source file drop down.
 */
registerFileAsService.prototype.validateSourceFileDropDown = function() {
	uRegisterFileAsService.validateEmptySourceFileDropDown();
};