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
function installBox() {
}

var uInstallBox = new installBox();
var isPollingNeeded = false;
var isStateReady = false;
var isResponseConflict = false;
var fileData;
var fileName = null;
var failedInstallationCount = 0;

$("#btnImportBox").click(function() {
		isResponseConflict = false;
		uInstallBox.doBoxInstallation();
});


/**
 * Sets .bar file data.
 * @param barFileData
 */
installBox.prototype.setFileForInstallation = function(barFileData) {
	fileData = barFileData;
};

/**
 * Gets .bar file data.
 * @returns
 */
installBox.prototype.getFileForInstallation = function() {
	return fileData;
};

/**
 * The purpose of this method is to perform attach file operation
 */
installBox.prototype.attachBarFile = function(input,popupImageErrorId, fileDialogId) {
	fileData = null;
	var file = document.getElementById(fileDialogId).files[0];
	fileName = input.files[0].name;
	if (file) {
		var barFileSize = file.size / 1024 / 1024;
		if (uInstallBox.validateFileType(fileName, barFileSize,
				popupImageErrorId)) {
			uInstallBox.setFileForInstallation(file);
			$("#lblImportBoxNoFileSelected").html(fileName);
		}
	}
};

/**
 * Gets response body.
 * @param selectedBoxName box name.
 * @returns response.
 */
installBox.prototype.getInstallationResponse = function(selectedBoxName) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var path = uInstallBox.getPath(sessionStorage.selectedcellUrl, selectedBoxName);
	var response = uInstallBox.getInstallationStatus(path, accessor);
	var responseBody = null;
	if (response.httpClient.status == 200) {
		responseBody = response.bodyAsJson();
	}
	return responseBody;
};

/**
 * Following method is used for showingn response.
 * @param message Message
 * @param color color of the progress bar.
 * @param responseBody response.
 */
installBox.prototype.showResponse = function(message,color,responseBody) {
	$('#lblPercentage').html(responseBody.progress);
	document.getElementById("installStatusProgress").style.display = "inline-block";
	$('#lblProgressBar').html(responseBody.progress);
	$("#installStatusProgress").attr('value',
			parseInt(responseBody.progress));
	$("#installStatusProgress").attr('max', 100);
	$('#lblProgressBar').html(message);
	$('#installStatusProgress').css("background", color);
	var installationResponse = JSON.stringify(responseBody, null, '\t');
	$("#txtAreaInstallationStatus").val(installationResponse);
	$("#sectionProgressBar").css('height','170px');
	$("#txtAreaInstallationStatus").css('height', '130px');
};

/**
 * Following method is used for showing elements required while installation is about to start.
 * @param selectedBoxName box name.
 */
installBox.prototype.startingInstallationProcess = function(selectedBoxName) {
	document.getElementById("txtAreaInstallationStatus").style.display = "none";
	$('#lblProgressBar').html("");
	document.getElementById("dvStartingInstallation").style.display = "inline-block";
	//this.clearImportBoxPopUp();
	$('#lblPercentage').html('');
	$("#installStatusProgress").hide();
	$("#sectionProgressBar").css('height','215px');
	isPollingNeeded = true;
};

/**
 * Displays response in text area.
 * @param selectedBoxName Box Name.
 */
installBox.prototype.displayInstallationResponse = function(selectedBoxName) {
	var responseBody = uInstallBox.getInstallationResponse(selectedBoxName); 
	if (responseBody != null) {
		var responseBox = responseBody.box;
		if (!responseBox) {
			responseBox = responseBody;
		}
		document.getElementById("txtAreaInstallationStatus").style.display = "inline-block";
		document.getElementById("dvStartingInstallation").style.display = "none";
		$("#txtAreaInstallationStatus").scrollTop(0);
		if (responseBox.status.toLowerCase() == getUiProps().MSG0181
				.toLowerCase()) {
			$('#lblProgressBar').html(getUiProps().MSG0317);
			$('#lblPercentage').html('');
			$("#installStatusProgress").hide();
			var installationResponse = JSON.stringify(responseBox, null, '\t');
			$("#txtAreaInstallationStatus").val(installationResponse);
			$("#sectionProgressBar").css('height', '170px');
			$("#txtAreaInstallationStatus").css('height', '157px');
			isPollingNeeded = false;
			isStateReady = true;
		} else if (responseBox.status.toLowerCase() == getUiProps().MSG0179
				.toLowerCase()) {
			isPollingNeeded = true;
			isStateReady = false;
			uInstallBox.showResponse(getUiProps().MSG0318, 'red',
					responseBox);
		} else if (responseBox.status.toLowerCase() == getUiProps().MSG0180
				.toLowerCase()) {
			isStateReady = false;
			selectedBoxName = '';
			uInstallBox
					.showResponse(getUiProps().MSG0319, 'red', responseBox);
			//createBoxTable();
			isPollingNeeded = false;
		}
	} else if (isResponseConflict == false) {
		uInstallBox.startingInstallationProcess(selectedBoxName);
	}
};


/**
 * Gets box Path.
 * 
 * @param cellUrl cell URL
 * @param boxName box name
 * @returns {String} path
 */
installBox.prototype.getPath = function(cellUrl, boxName) {
	var path = cellUrl;
	path += boxName;
	return path;
};

/**
 * Following method checks if a file is valid or not.
 * @returns {Boolean} true/false
 */
installBox.prototype.isFileValid = function() {
	if (fileName == undefined || fileName == null) {
		document.getElementById("popupBarFileInstallationMsg").innerHTML = "";
		document.getElementById("popupBarFileInstallationMsg").innerHTML = getUiProps().MSG0176;
		return false;
	} else if (uInstallBox.getFileForInstallation() == undefined) {
		return false;
	} 
	return true;
};

/**
 * Followng method Validates import box name.
 * @param boxName box name
 * @param boxSpan span
 * @returns {Boolean} true/false
 */
installBox.prototype.validateImportBoxName = function(boxName,boxSpan) {
	var minLengthMessage = getUiProps().MSG0008;
	var maxLengthMessage = getUiProps().MSG0009;
	var specialCharacterMessage = getUiProps().MSG0011;
	var alphaNumericMessage = getUiProps().MSG0023;
	//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(upper case).
	var letters = /^[0-9a-zA-Z-_]+$/;
	//The following regex finds under score(_) and hyphen(-).
	var specialchar = /^[-_]*$/;
	var lenBoxName = boxName.length;
	if(lenBoxName < 1 || boxName == undefined || boxName == null || boxName == "") {
		document.getElementById(boxSpan).innerHTML = minLengthMessage;
		showErrorIcon('#importBoxName');
		return false;
	} else if (lenBoxName > 128) {
		document.getElementById(boxSpan).innerHTML = maxLengthMessage;
		showErrorIcon('#importBoxName');
		return false;
	} else if (lenBoxName != 0 && ! (boxName.match(letters))){
		document.getElementById(boxSpan).innerHTML = alphaNumericMessage;
		showErrorIcon('#importBoxName');
		return false;
	} else if(lenBoxName != 0 && (specialchar.toString().indexOf(boxName.substring(0,1)) >= 0)){
		document.getElementById(boxSpan).innerHTML = specialCharacterMessage;
		showErrorIcon('#importBoxName');
		return false;
	}
	showValidValueIcon('#importBoxName');
	document.getElementById(boxSpan).innerHTML = "";
	return true;
};

/**
 * Following method checks if a box already exists or not.
 * @param boxName BoxName
 * @returns {Boolean} True/false
 */
installBox.prototype.isBoxAlreadyCreated = function(boxName) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objJBoxManager = new _pc.BoxManager(accessor);
	try {
		var b = objJBoxManager.retrieve(boxName); 
		document.getElementById('popupImportBoxErrorMsg').innerHTML = getUiProps().MSG0399;
		showErrorIcon('#importBoxName');
		return false;
	} catch (exception) {
		showValidValueIcon('#importBoxName');
		document.getElementById("popupImportBoxErrorMsg").innerHTML = "";
		return true;
	}
};

installBox.prototype.performPostExceptionOperations = function() {
	uInstallBox.clearImportBoxPopUp();
	isResponseConflict = true;
	uInstallBox.displayFailureMessage();
	createBoxTable();
};

/**
 * Performs box installation.
 * @returns {Boolean}
 */
installBox.prototype.doBoxInstallation = function() {
	var selectedPage = objCommon.getActivePage("Box");
	if (selectedPage != 1) {
		createBoxTable();
	}
	var boxName = document.getElementById("importBoxName").value;
	sessionStorage.enteredBoxName = boxName;
	var boxSpan = "popupImportBoxErrorMsg";
	if (uInstallBox.validateImportBoxName(boxName, boxSpan)) {
		var doesBoxExist = uInstallBox.isBoxAlreadyCreated(boxName);
		if (doesBoxExist) {
			if (uInstallBox.isFileValid()) {
				// Close Modal Pop up before anything.
				var barFileData = uInstallBox.getFileForInstallation();
				$('#importBoxModal, .window').hide();
				var baseUrl = getClientStore().baseURL;
				var boxName = document.getElementById("importBoxName").value;
				var cellName = sessionStorage.selectedcell;
				var path = uInstallBox.getPath(sessionStorage.selectedcellUrl, boxName);
				var accessor = objCommon.initializeAccessor(baseUrl, cellName);
				var builder = new _pc.PersoniumRequestHeaderBuilder();
				builder.contentType("application/zip");
				builder.accept("application/zip");
				builder.token(accessor.accessToken);
				builder.defaultHeaders(accessor.getDefaultHeaders());
				var xhr = new XMLHttpRequest();
				xhr.upload.onprogress = function(evt) {
					if (evt.lengthComputable) {
						// Create Fake Row in the Grid.
						var fakeRow = uInstallBox.createFakeRow(boxName);
						$('#mainBoxTable tbody tr:first').before(fakeRow);
						// Show Installation Pop up immediately.
						openCreateEntityModal('#progressBarModalWindow',
								'#progressBarDialogBox');
						uInstallBox.displayInstallationResponse(boxName, true);
						if (isPollingNeeded == true) {
							uInstallBox.doPolling(boxName);
						}
					}
				};
				xhr.onreadystatechange = function(evt) {
					if (xhr.readyState == 4 && xhr.status == 202) {
						uInstallBox.displayInstallationResponse(boxName);
						uInstallBox
								.displaySuccessfulInstallationMessage(boxName);
					} else if (xhr.readyState == 4
							&& (xhr.status == 409 || xhr.status == 400
									|| xhr.status == 500 || xhr.status == 0)) {
						uInstallBox.performPostExceptionOperations();
					}
				};
				xhr.open("MKCOL", path, true);
				builder.build(xhr);
				xhr.send(barFileData);
			}
		}
	}};

/**
 * Calls method for Polling in every 20 seconds.
 * @param boxName Box Name.
 */
installBox.prototype.doPolling = function(boxName) {
	if (isPollingNeeded) {
		setTimeout(function() {
			uInstallBox.polling(boxName);
		}, 20000);
	}
};

/**
 * Performs Polling.
 * @param boxName Box name
 */
installBox.prototype.polling = function(box) {
	var boxName = sessionStorage.enteredBoxName;
	if (boxName == undefined || boxName == null || boxName == '') {
		boxName = box;
	} 
	if (!isResponseConflict) {
		uInstallBox.displayInstallationResponse(boxName);
		if (isStateReady == true && isPollingNeeded == true) {
			uInstallBox.displaySuccessfulInstallationMessage(boxName);
		} else {
			setTimeout(function() {
				uInstallBox.polling(boxName);
			}, 20000);
		}
	}
};

/**
 * Displays message on successful installation.
 * @param boxName Box Name
 */
installBox.prototype.displaySuccessfulInstallationMessage = function(boxName) {
	isStateReady = false;
	fileData = null;
	fileName = null;
	//uInstallBox.displayInstallationResponse(boxName);
	addSuccessClass('#boxMessageIcon');
	inlineMessageBlock(155, '#boxMessageBlock');
	document.getElementById("successmsg").innerHTML = getUiProps().MSG0321;
	document.getElementById('boxMessageBlock').style.display = "table";
	createBoxTable();
	isPollingNeeded = false;
	objCommon.centerAlignRibbonMessage("#boxMessageBlock");
	objCommon.autoHideAssignRibbonMessage('boxMessageBlock');
};

/**
 * Displays message on Failed installation.
 * @param boxName Box Name
 */
installBox.prototype.displayFailureMessage = function() {
	isStateReady = false;
	fileData = null;
	fileName = null;
	uInstallBox.closeInstallationPopUpModal('#progressBarModalWindow');
	addErrorClass('#boxMessageIcon');
	inlineMessageBlock(341, '#boxMessageBlock');
	document.getElementById("successmsg").innerHTML = getUiProps().MSG0320;
	objCommon.centerAlignRibbonMessage("#boxMessageBlock");
	objCommon.autoHideAssignRibbonMessage("boxMessageBlock");
};

/**
 * Validate the correctness of .bar file and ensure that only .bar files get uploaded.
 * @param filePath path of the file
 * @param barFileSize size
 * @param popupImageErrorId error element ID
 * @returns {Boolean} true/false
 */
installBox.prototype.validateFileType = function(filePath, barFileSize,
		popupImageErrorId) {
	var fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
			.toLowerCase();
	if (fileExtension.toLowerCase() == "bar") {
		document.getElementById(popupImageErrorId).innerHTML = "";
		if (barFileSize > 100) {
			document.getElementById(popupImageErrorId).innerHTML = "";
			document.getElementById(popupImageErrorId).innerHTML = getUiProps().MSG0177;
			return false;
		}
		// should the extension happens to be other than ".bar",error message
		// would be shown.
	} else {
		document.getElementById(popupImageErrorId).innerHTML = "";
		document.getElementById(popupImageErrorId).innerHTML =  getUiProps().MSG0176;
		return false;
	}
	return true;
};

/**
 * Open ups installation status pop up.
 * @param boxName Box Name.
 */
installBox.prototype.openInstallationStatusPopUp = function(boxName,isOpenedDirectlyFromScreen) {
	sessionStorage.enteredBoxName = boxName;
	openCreateEntityModal('#progressBarModalWindow', '#progressBarDialogBox');
	uInstallBox.displayInstallationResponse(boxName);
	if (!isOpenedDirectlyFromScreen) {
		setTimeout(function() {
			uInstallBox.polling(boxName);
		}, 20000);
	}
};

/**
 * Gets Installation response.
 * @param url URL
 * @param accessor Accessor
 * @returns response
 */
installBox.prototype.getInstallationStatus = function(url, accessor) {
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(url, "application/json", "*");
	return response;
};

/**
 * Creates Fake Row.
 * @param boxName Box Name
 * @returns {String} row
 */
installBox.prototype.createFakeRow = function(boxName) {
	var dynamicTable = "";
	dynamicTable += "<tr name='allrows'>";
	dynamicTable += "<td><input id = 'chkBoxFake' type = 'checkbox' class = 'case cursorHand regular-checkbox big-checkbox' name = 'case'  /><label for='chkBoxFake'  class='customChkbox checkBoxLabel'></td>";
	dynamicTable += "<td name = 'acc'><div class = 'mainTableEllipsis'><a id='' href = '#'   tabindex='-1' style='outline: none;'>"
			+ boxName + "</a></div></td>";
	dynamicTable += "<td name = 'acc' style='max-width: 200px'><div class = 'mainTableEllipsis'><label class='cursorPointer'>URL Not Available</label></div></td>";
	dynamicTable += "<td></td>";
	dynamicTable += '<td><label class="showInstallationIcon"></label></td>';
	dynamicTable += "</tr>";
	return dynamicTable;
};

/**
 * Closes the installation pop up.
 * @param modalID Modal ID
 */
installBox.prototype.closeInstallationPopUpModal = function(modalID) {
	$(modalID).hide();
	$("#installStatusProgress").attr('value', 0);
	$("#lblProgressBar").text('');
	$("#txtAreaInstallationStatus").val('');
	if (isPollingNeeded) {
		setTimeout(function() {
			uInstallBox.polling(boxName);
		}, 20000);
	}
};

/**
 * This method performs operations to be performed on closing pop up.
 */
installBox.prototype.clearImportBoxPopUp = function() {
	fileData = null;
	uInstallBox.setFileForInstallation('');
	$("#lblImportBoxNoFileSelected").html(getUiProps().MSG0398);
	$("#popupBarFileInstallationMsg").html('');
	$("#importBoxName").val('');
	$("#importBoxName").removeClass( "errorIcon validValueIcon");
	$("#popupRoleErrorMsg").html();
};


/**
 * This method closed import box pop up.
 * @param modalId Modal ID
 */
installBox.prototype.closeImportBoxPopUp = function(modalId) {
	$(modalId).hide();
	uInstallBox.clearImportBoxPopUp();
};

/**
 * Following method opens import box pop up.
 */
installBox.prototype.openImportBoxPopUp = function() {
	uInstallBox.clearImportBoxPopUp(); 
	openCreateEntityModal('#importBoxModal','#importBoxDialog','importBoxName');
};

/**
 * Following method validates Box Name on blur event. 
 */
$("#importBoxName").blur(function() {
	var boxName = $('#importBoxName').val(); //"popupBoxErrorMsg";
	var boxSpan = "popupImportBoxErrorMsg";
	uInstallBox.validateImportBoxName(boxName, boxSpan);
});

$(document).ready(function() {
	$.ajaxSetup({ cache : false });
});