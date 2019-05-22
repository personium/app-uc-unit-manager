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

function uRule(){}
var objRule = new uRule();

var maxRows=10;
var totalRecordsize = 0;
var cellName = sessionStorage.selectedcell;
var ruleName = sessionStorage.ruleName;
var boxName = sessionStorage.boxName;
var contextRoot = sessionStorage.contextRoot;
var sbSuccessful = '';
var sbConflict = '';
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;
var timerList = ["timer.oneshot", "timer.periodic"];

/**
 * The purpose of this method is to fetch the required records as per pagination. 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
uRule.prototype.retrieveChunkedData = function (lowerLimit, upperLimit) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRuleManager = new _pc.RuleManager(accessor);
	var dataUri = objRuleManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
};

uRule.prototype.getRuleData = function(ruleName, boxName) {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRuleManager = new _pc.RuleManager(accessor);
	var ruleUri = objRuleManager.getUrl();
	var dataUri = ruleUri + "(Name='"+ruleName+"')";
	if (boxName && boxName !== getUiProps().MSG0039) {
		dataUri = ruleUri + "(Name='"+ruleName+"',_Box.Name='"+boxName+"')";
	}
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri + "?$expand=_Box", "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
}

/**
 * The purpose of this function is to call the createTable function
 * for displaying rule list
 */
$(document).ready(function(){
	$.ajaxSetup({ cache : false });
	if(sessionStorage.tabName == "Rule"){
		loadRulePage();
	}
	objCommon.creatEntityHoverEffect();
	objCommon.sortByDateHoverEffect();
	setDynamicGridHeight();
	$(window).resize(function () {
		if ($('#dvemptyTableMessage').is(':visible')) {
			objCommon.setDynamicPositionOfEmptyMessage();
		}
	});
});

function loadRulePage() {
	createRuleTable();
	retrieveBox("dropDownBox");
	objCommon.checkCellContainerVisibility();
}

/**
 * The purpose of this method is perform rule delete operation
 * on the basis of rule box pair.
 */
function deleteRule(ruleBoxPair,count) {
	var boxName = null;
	var mainBoxValue = getUiProps().MSG0039;
	var arrRuleBox = ruleBoxPair.split(" ");
	var ruleName = arrRuleBox[0].split(' ').join('');
	if (arrRuleBox[1] != undefined && arrRuleBox[1] != mainBoxValue) {
		boxName = arrRuleBox[1].split(' ').join('');
		if (boxName == mainBoxValue) {
			boxName = null;
		}
	}
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var objRuleManager = new _pc.RuleManager(accessor);
	var response = objRuleManager.del(ruleName, boxName);
	try {
		if (response.resolvedValue.status == 204) {
			sbSuccessful += ruleName + ",";
		} 
	} 
	catch (exception) {
		arrDeletedConflictCount.push(count);
		sbConflict += ruleName + ",";
		sbConflict.replace(/, $/, "");	
	}
}

/**
 * The purpose of this method is perform multiple delete operation
 */
uRule.prototype.deleteMultipleRules = function() {
	showSpinner("modalSpinnerRule");
	var rules = sessionStorage.RuleNames;
	var ruleBoxPair = rules.replace(/"/g,"").replace(/'/g,"");
	var arrRules = ruleBoxPair.split(',');
	var etagIDOfPreviousRecord = "txtHiddenEtagId";
	var arrEtag = [];
	var etagValue = '';
	var tableID = $('#mainRuleTable');
	var idCheckAllChkBox = "#chkSelectall";
	//if (!$("#chkSelectall").is(':checked')) {
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBox0");
	}
	
	for ( var count = 0; count < arrRules.length; count++) {
		deleteRule(arrRules[count],count);
	}
	this.displayMultipleRulesConflictMessage();
	removeSpinner("modalSpinnerRule");
	var type="Rule";
	 var recordCount = retrieveRuleRecordCount();
		objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, objRule, isDeleted);
};

/**
 * The purpose of this method is display conflict message.
 */
uRule.prototype.displayMultipleRulesConflictMessage = function() {
	$('#multipleDeleteModalWindow, .window').hide();
	var conflictRuleDeleteLength = 0;
	var successfulRuleDeleteLength = 0;
	sbSuccessful = sbSuccessful.substring(0, sbSuccessful.length - 1);
	sbConflict = sbConflict.substring(0, sbConflict.length - 1);
	conflictRuleDeleteLength = entityCount(sbConflict);
	successfulRuleDeleteLength = entityCount(sbSuccessful);
	if(conflictRuleDeleteLength < 1 && successfulRuleDeleteLength > 0) {
		isDeleted = true;
		addSuccessClass('#ruleMessageIcon');
		document.getElementById("ruleSuccessmsg").innerHTML = successfulRuleDeleteLength+" "+getUiProps().MSG0421;
	} else if(successfulRuleDeleteLength < 1 && conflictRuleDeleteLength > 0) {
		isDeleted = false;
		addErrorClass('#ruleMessageIcon');
		document.getElementById("ruleSuccessmsg").innerHTML = conflictRuleDeleteLength+" "+getUiProps().MSG0422;
		
	} else if(conflictRuleDeleteLength > 0 && successfulRuleDeleteLength > 0 ) {
		isDeleted = true;
		addErrorClass('#ruleMessageIcon');
		document.getElementById("ruleSuccessmsg").innerHTML = successfulRuleDeleteLength+" "+getUiProps().MSG0323+" "+(conflictRuleDeleteLength + successfulRuleDeleteLength)+" "+getUiProps().MSG0421;
	}
	sbSuccessful = '';
	sbConflict = '';
	$("#ruleMessageBlock").css("display", 'table');
	//createRuleTable();
	objCommon.centerAlignRibbonMessage("#ruleMessageBlock");
	objCommon.autoHideAssignRibbonMessage("ruleMessageBlock");
};

/**
 * The purpose of this function is to get rule name.
 */
function getRuleName(ruleName,boxName) {
	var mainBoxValue = getUiProps().MSG0039;
	openSingleDeleteRule();
	if (boxName == mainBoxValue) {
		boxName = undefined;
	}
	sessionStorage.ruleName = ruleName;
	sessionStorage.boxName = boxName;
}

/**
 * The purpose of this function is to check/unckeck all the checkboxes.
 */
uRule.prototype.checkAll = function(cBox) {
	var buttonId = '#btnDeleteRule';
	objCommon.checkBoxSelect(cBox, buttonId, '#btnEditRule');
	$('#btnEditRule').attr('disabled', false);
	objCommon.showSelectedRow(document.getElementById("chkSelectall"), "row",
			"rowid");
};

/**
 * The purpose of this function is to get rule information for multiple delete.
 */
uRule.prototype.getMultipleRuleNames = function() { 
	var len = document.fRuleTable.elements.length;
	var count = 0;
	var ruleName = null;
	for (count = 0; count < len; count++) {
		if (document.fRuleTable.elements[count].name == "case") {
			if (document.fRuleTable.elements[count].checked) {
				var rule = document.fRuleTable.elements[count].value;
				if (ruleName == null) {
					ruleName = rule;
				} else {
					ruleName = ruleName + ',' + rule;
				}
			}
		}
	}
	sessionStorage.RuleNames = ruleName;
	
};

/**
 * The purpose of this function is to close Rule popup
 */
function closeCreateRule() {
	document.getElementById("txtRuleName").value='';
	$("#txtRuleName").removeClass("errorIcon");
	$("#txtEventSubject").removeClass("errorIcon");
	document.getElementById("popupRuleErrorMsg").innerHTML = "";
	$('.popupContent').find('input:text').val('');
	$('.popupAlertmsg').html('');
	$('#dropDownBox').html('');
	$("#dvTextEventObject").css("display", "block");
	$("#dvTextEventObjectLocalBox").css("display", "none");
	$("#dvTextEventObjectLocalCel").css("display", "none");
	$("#dvTextTargetUrl").css("display", "block");
	$("#dvTextTargetUrlLocalBox").css("display", "none");
	$("#dvTextTargetUrlLocalCel").css("display", "none");
	$('#createRuleModal, .window').hide(0);
}

/**
 * Following function closes edit rule pop up.
 */
function closeEditRulePopUp() {
	document.getElementById("txtRuleNameEdit").value='';
	objCommon.removePopUpStatusIcons('#txtRuleNameEdit');
	objCommon.removePopUpStatusIcons('#txtEventSubjectEdit');
	document.getElementById("popupRuleErrorMsgEdit").innerHTML = "";
	document.getElementById("popupEventSubjectErrorMsgEdit").innerHTML = "";
	$('#ruleEditModalWindow, .window').hide(0);
}

/**
 * The purpose of this function is to close single and multiple rule delete popup
 */
function closeDeleteRulePopup() {
	$('#multipleDeleteModalWindow, .window').hide(0);
	$('#singleDeleteModalWindow, .window').hide(0);
	$('#conflictModalwindow, .window').hide(0);
	$("#mainContent").load(contextRoot+'/templates/ruleListView.html');
}

/**
 * The purpose of this function is to open model window for single rule delete
 */
function openSingleDeleteRule() {
	var id = '#singleDeleteDialogBox';
	$('#singleDeleteModalWindow').fadeIn(0);	
	var winH = $(window).height();
	var winW = $(window).width();
	$(id).css('top', winH / 2 - $(id).height() / 2);
	$(id).css('left', winW / 2 - $(id).width() / 2);
	
}

/**
 * The purpose of this method is to open model window for multiple delete operation
 */
uRule.prototype.openPopUpWindow= function(idDialogBox, idModalWindow ) {
	if (idDialogBox === '#multipleDeleteDialogBox') {
		this.getMultipleRuleNames();
	}
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	$('#btnCancelRuleDelete').focus();
};

/**
 * The purpose of this method is to get account count linked with particular rule 
 */
function getAccountCount(ruleName,boxName,accessor){
	var mainBoxValue = getUiProps().MSG0039;
	var key = null;
	var accountCount =0;
	var baseUrl = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(baseUrl, cellName, "", "");
	var objLinkMgr = new _pc.LinkManager(accessor,objJdcContext );
	key = "(Name="+ruleName+",_Box.Name="+boxName+")";
	if (boxName == "'"+mainBoxValue+"'") {
		key = "(Name="+ruleName+")";
	}	
	var response = objLinkMgr.retrieveRuleAccountLinks(objJdcContext,"Rule","Account",key);
	var responseBody = response.bodyAsJson();
	var json = responseBody.d.results;
	if (response.getStatusCode() == 200) {
		if(json.length > 0) {
			accountCount =	json.length;
		}
	}
	return accountCount;
}

/**
 * The purpose of this method is to create rule table view as per pagination.
 * @param json
 * @param recordSize
 */
function createChunkedRuleTable(json, recordSize){
	$('#chkSelectall').attr('checked', false);
	$("#chkSelectall").attr('disabled', false);
	objCommon.disableButton('#btnDeleteRule');
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var mainBoxValue = getUiProps().MSG0039;
	var name = new Array();
	var etag = new Array();
	var updatedDate = new Array();
	var createdDate = new Array();
	var box = new Array();
	var action = new Array();
	var eventExternal = new Array();
	var eventType = new Array();
	var eventSubject = new Array();
	var eventObject = new Array();
	var eventInfo = new Array();
	var targetUrl = new Array();
	var dynamicTable = "";
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	var jsonLength = json.length;
	var maxLimit = (objCommon.MAXROWS+recordSize) < (jsonLength) ? (objCommon.MAXROWS+recordSize) : jsonLength;
	var ruleRowCount = 0;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		etag[count] = obj.__metadata.etag;
		name[count] = obj.Name;
		updatedDate[count] = obj.__updated;
		createdDate[count] = obj.__published;
		var uri=obj._Box.__deferred.uri;
		var boxstart=uri.search("_Box.Name");
		var boxend=uri.search("/_Box");
		var boxprint=uri.substring(boxstart+10,boxend-1);
		var boxp=boxprint.replace(/'/g," ");
		box[count] = boxp;
		if (boxp == "null") {
		box[count] = mainBoxValue;
		}
		action[count] = obj.Action;
		if (!obj.EventExternal) {
			eventExternal[count] = "Internal";
		} else {
			eventExternal[count] = "External";
		}
		eventType[count] = obj.EventType;
		eventSubject[count] = obj.EventSubject;
		eventObject[count] = obj.EventObject;
		eventInfo[count] = obj.EventInfo;
		targetUrl[count] = obj.TargetUrl;
		var ruleDate = objCommon.convertEpochDateToReadableFormat(""+ updatedDate[count]+"");
		var ruleCreatedDate = objCommon.convertEpochDateToReadableFormat(""+ createdDate[count]+"");
		var ruleName = "'"+ name[count]+"'" ;
		var	boxName = "'"+ box[count] +"'";
		boxName = boxName.split(' ').join('');
		var ruleAction = "'" + action[count] + "'";
		var ruleEventExternal = "'" + obj.EventExternal + "'";
		var ruleEventType = "'" + eventType[count] + "'";
		var ruleEventSubject = "'" + eventSubject[count] + "'";
		var ruleEventObject = "'" + eventObject[count] + "'";
		var ruleEventInfo = "'" + eventInfo[count]+ "'";
		var ruleTargetUrl = "'" + targetUrl[count] + "'";
		var ruleBoxPair = ruleName+" "+boxName+" "+ruleAction+" "+ruleEventExternal+" "+ruleEventType+" "+ruleEventSubject+" "+ruleEventObject+" "+ruleEventInfo+" "+ruleTargetUrl;

		var arrEtag = etag[count].split("/");
		var test = "'"+ arrEtag[0] +"'" ;
		var test1 =  arrEtag[1].replace(/["]/g,"");
		var test2 = "'"+ test1 +"'" ;
		var infoCreatedat = "'"+ ruleCreatedDate +"'" ;
		var infoUpdatedat = "'"+ ruleDate +"'" ;
		var infoSchema = "'"+ uri.replace(/[']/g,"`") +"'" ;
		
		//Rows Start
			dynamicTable += '<tr name = "allrows" id = "rowid'+ruleRowCount+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteRule'" +','+ "'chkSelectall'" +','+ ruleRowCount +',' + totalRecordsize + ','+ "'btnEditRule'" + ','+"''"+','+"''"+','+"''"+','+"'mainRuleTable'"+');">';
			dynamicTable += '<td style="width:1%"><input id =  "txtHiddenEtagId'+ruleRowCount+'" value='+obj.__metadata.etag+' type = "hidden" /><input title="'+ruleRowCount+'" id = "chkBox'+ruleRowCount+'" type = "checkbox" class = "case cursorHand regular-checkbox big-checkbox" name = "case" value = "'+ruleBoxPair+'" /><label for="chkBox'+ruleRowCount+'" class="customChkbox checkBoxLabel"></label></td>';
			
			dynamicTable += '<td name = "acc" style="max-width:270px;"><div class = "mainTableEllipsis"><a tile="'+name[count]+'" tabindex ="-1" style="outline:none" onclick="uRuleDetail.openRuleDetail('+ruleName+', '+boxName+')">'+name[count]+'</a></div></td>';//openRuleAccountLinkMappingPage('+ruleName+','+boxName+','+ruleDate+','+accountCount+');
			dynamicTable += "<td><div class = 'mainTableEllipsis'><label title= '"+box[count]+"' class='cursorPointer'>"+box[count]+"</label></div></td>";
			dynamicTable += "<td><div class = 'mainTableEllipsis'><label title= '"+action[count]+"' class='cursorPointer'>"+action[count]+"</label></div></td>";

			dynamicTable += "<td><div class = 'mainTableEllipsis'><label title= '"+ruleCreatedDate+"' class='cursorPointer'>"+ruleCreatedDate+"</label></div></td>";
			dynamicTable += "<td><div class = 'mainTableEllipsis'><label title= '"+ruleDate+"' class='cursorPointer'>"+ruleDate+"</label></div></td>";
			ruleDate = "'"+ruleDate+"'";
			dynamicTable += "</tr>";
			ruleRowCount++;
		//Rows End
	}	
	$("#mainRuleTable tbody").html(dynamicTable);
	setTimeout(function() {
		applyScrollCssOnRuleGrid();	
		}, 300);
}

/**
 * The purpose of this method is to create and initialize Rule Manager.
 */
function createRuleManager(){
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var objRuleManager = new _pc.RuleManager(accessor);
	return objRuleManager;
}

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
function retrieveRuleRecordCount() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRuleManager = new _pc.RuleManager(accessor);
	var uri = objRuleManager.getUrl();
	uri = uri + "?$top=0&$inlinecount=allpages";
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var response = restAdapter.get(uri, "application/json");
	var json = response.bodyAsJson().d;
	var count = json.__count;
	return count;
};

/**
 * Have the logic for creating grid for rule
 */
function createRuleTable() {
	var token = getClientStore().token;
	sessionStorage.token = token;
	totalRecordsize = retrieveRuleRecordCount();
	if (totalRecordsize == 0) {
		objCommon.displayEmptyMessageInGrid(getUiProps().MSG0418, "Rule");
		$("#chkSelectall").attr('checked', false);
		$("#chkSelectall").attr('disabled', true);
		$('#mainRuleTable tbody').empty();
		objCommon.disableButton("#btnDeleteRule");
	} else {
		$("#chkSelectall").attr('disabled', false);
		document.getElementById("dvemptyTableMessage").style.display = "none";
		var json = objRule.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
		var recordNo = 0;
		createChunkedRuleTable(json, recordNo);
		var tableID = $('#mainRuleTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS, tableID, objRule, json, createChunkedRuleTable, "Rule");
		objCommon.checkCellContainerVisibility();
	}
}

/**
 * The purpose of this function is to check the existence of a rule.
 * 
 * @param accessor
 * @param objJRule
 * @param objRuleManager
 */
function isExist(check, accessor, objJRule, objRuleManager) {
	//If rule is new.
	if (check === true) {
		objRuleManager.create(objJRule);
		removeSpinner("modalSpinnerRule");
		return true;
	}
	var existMessage = getUiProps().MSG0007;
	document.getElementById("popupRuleErrorMsg").innerHTML = existMessage;
	removeSpinner("modalSpinnerRule");
	return false;
}

/**
 * Client side validation for rule name.
 * 
 * @param ruleName
 * @param errorSpanID
 */
 function ruleValidation(ruleName,errorSpanID) {
		//The following regex finds undersscore(_) and hyphen(-).	
		var specialCharacter = /^[-_]*$/;
		//The following regex finds characters in the range of 0-9,a-z(lower case) and A-Z(uppercase).
		var letter = /^[0-9a-zA-Z-_]+$/;
		var maxLengthMessage = getUiProps().MSG0425;
		var charMessage =  getUiProps().MSG0023; //getUiProps().MSG0005;
		var specialCharMessage = getUiProps().MSG0426;
		var lenRuleName = (ruleName) ? ruleName.length:0;
		if (lenRuleName < 1) {
			return true;
		}else if((lenRuleName > 128)) {
			document.getElementById(errorSpanID).innerHTML = maxLengthMessage;
			cellpopup.showErrorIcon('#txtRuleName');
			return false;
		} else if(lenRuleName != 0 && !(ruleName.match(letter))) {
			document.getElementById(errorSpanID).innerHTML = charMessage;
			cellpopup.showErrorIcon('#txtRuleName');
			return false;
		} else if(lenRuleName != 0 && (specialCharacter.toString().indexOf(ruleName.substring(0, 1)) >= 0)) {
			document.getElementById(errorSpanID).innerHTML = specialCharMessage;
			cellpopup.showErrorIcon('#txtRuleName');
			return false;
		} else {
			document.getElementById(errorSpanID).innerHTML = "";
			$("#txtRuleNameEdit").removeClass("errorIcon");
			cellpopup.showValidValueIcon('#txtRuleName');
			return true;
		}
		cellpopup.showValidValueIcon('#txtRuleName');
		return true;
	}
 
/**
 * The purpose of this function is to create a new rule.
 */
function createRule() {
	showSpinner("modalSpinnerRule");
	var json = null;
	var action = convInvalidValToUndefined($("#dropDownAction option:selected").val());
	var eventExternal = false;
	var external = $('input[name="dropDownEventExternal"]:checked').val();
	if (external === "true") {
		eventExternal = true;
	}
	var boxName = undefined;
	var dropDownBox = document.getElementById("dropDownBox");
	if ($("#chkBoxBound").attr("checked")) {
		boxName = convInvalidValToUndefined(dropDownBox.options[dropDownBox.selectedIndex].title, true);
	}
	var ruleName = convInvalidValToUndefined(document.getElementById("txtRuleName").value);
	var eventType = convInvalidValToUndefined(document.getElementById("txtEventType").value);
	var eventSubject = convInvalidValToUndefined(document.getElementById("txtEventSubject").value);
	var eventObject = convInvalidValToUndefined(document.getElementById("txtEventObject").value);
	var eventInfo = convInvalidValToUndefined(document.getElementById("txtEventInfo").value);
	var targetUrl = convInvalidValToUndefined(document.getElementById("txtTargetUrl").value);
	if ($("#txtTargetUrl").attr("disabled")) {
		targetUrl = null;
	}

	var isRuleCreationAllowed = false;
	if (!ruleValidation(ruleName, "popupRuleErrorMsg")) {
		removeSpinner("modalSpinnerRule");
		return;
	}
	// Event Subject
	if (eventSubject) {
		if (!objBox.validateSchemaURL(eventSubject, "popupEventSubjectErrorMsg", "#txtEventSubject")) {
			removeSpinner("modalSpinnerRule");
			return;
		}
	}
	// Event Object
	if (_.indexOf(timerList, eventType) < 0) {
		if (!eventExternal) {
			if (boxName) {
				eventObject = document.getElementById("txtEventObjectLocalBox").value;
				if (!eventObject) {
					document.getElementById("popupEventObjectErrorMsg").innerHTML = getUiProps().MSG0080;
					cellpopup.showErrorIcon("#txtEventObjectLocalBox");
					removeSpinner("modalSpinnerRule");
					return;
				}
				eventObject = objCommon.PERSONIUM_LOCALBOX + "/" + eventObject;
			} else {
				eventObject = document.getElementById("txtEventObjectLocalCel").value;
				if (!eventObject) {
					document.getElementById("popupEventObjectErrorMsg").innerHTML = getUiProps().MSG0080;
					cellpopup.showErrorIcon("#txtEventObjectLocalCel");
					removeSpinner("modalSpinnerRule");
					return;
				}
				eventObject = objCommon.PERSONIUM_LOCALCEL + "/" + eventObject;
			}
		}
	} else {
		if (!eventObject) {
			document.getElementById("popupEventObjectErrorMsg").innerHTML = getUiProps().MSG0080;
			cellpopup.showErrorIcon("#txtEventObject");
			removeSpinner("modalSpinnerRule");
			return;
		}
		if (!objCommon.isNumber(eventObject)) {
			document.getElementById("popupEventObjectErrorMsg").innerHTML = getUiProps().MSG0433;
			cellpopup.showErrorIcon("#txtEventObject");
			removeSpinner("modalSpinnerRule");
			return;
		}
	}

	// Target URL
	if (!validateTargetUrl(false)) {
		removeSpinner("modalSpinnerRule");
		return;
	}
	if (action == "exec") {
		if (boxName) {
			targetUrl = objCommon.PERSONIUM_LOCALBOX + "/" + $("#txtTargetUrlLocalBox").val();
		} else {
			targetUrl = objCommon.PERSONIUM_LOCALCEL + "/" + $("#txtTargetUrlLocalCel").val();
		}
	}

	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	if(boxName == null || boxName == "" || boxName == 0) {
		boxName = undefined;
	}
	json = {"Name" : ruleName,"_Box.Name" : boxName,"EventType": eventType,
	        "EventSubject":eventSubject,"EventObject":eventObject,"EventInfo":eventInfo,
	        "EventExternal":eventExternal,"Action":action,"TargetUrl":targetUrl};
	var objJRule = new _pc.Rule(accessor, json);
	var objRuleManager = new _pc.RuleManager(accessor);
	
	try {
		 objRuleManager.retrieve(ruleName,boxName);
	}
	catch (exception) {
		isRuleCreationAllowed = true;
	}
	
	//var success = isExist(check, accessor, objJRule, objRuleManager);
	if (isRuleCreationAllowed) {
		objRuleManager.create(objJRule);
		displayRuleCreateMessage (ruleName);
	} else {
		var existMessage = getUiProps().MSG0007;
		document.getElementById("popupRuleErrorMsg").innerHTML = existMessage;
		$("#txtRuleName").addClass("errorIcon");
	}

	removeSpinner("modalSpinnerRule");
}

function convInvalidValToUndefined(value, allowNullStrBool) {
	if(value == null || value == "" || value == 0 || (!allowNullStrBool && value == "null")) {
		return  undefined;
	}
	return value;
}
function convInvalidValToEmpty(value, allowNullStrBool) {
	if(value == null || value == undefined || value == 0 || (!allowNullStrBool && value == "null")) {
		return  "";
	}
	return value;
}

/**
 * The purpose of this function is to bind the dropdown with 
 * box data against selected cellname
 * 
 * @param JSONstring
 * @param dropDownId
 * @param boxName
 */
function bindBoxDropDown(JSONstring,dropDownId, boxName) {
	var len = JSONstring.length;
	var select = document.getElementById(dropDownId);
	//var defaultOption = document.createElement('option');
	//if (dropDownId == 'dropDownBox') {
	//	defaultOption.value = 0;
	//	defaultOption.innerHTML = getUiProps().MSG0400;
	//	select.insertBefore(defaultOption, select.options[0]);
	//}
	//newOption.value = 0;
	//newOption.innerHTML = mainBoxValue;
	//select.appendChild(newOption);
	if(dropDownId == "dropDownBoxEdit" || dropDownId == "ddlBoxList" ){
		//var defaultOption = document.createElement('option');
		//defaultOption.value = 0;
		//defaultOption.innerHTML = mainBoxValue;
		//defaultOption.title = mainBoxValue;
		if (boxName) {
			var newOption = document.createElement('option');
			newOption.value = 0;
			newOption.innerHTML = objCommon.getShorterName(boxName, 18);
			newOption.title = boxName;
			select.appendChild(newOption);
		}		
	}
	for(var count=0; count < len; count++) {
		var option = document.createElement("option");
		option.id=null;
		option.innerHTML = null;
		var obj = JSONstring[count];
		option.id = obj.__metadata.etag;
		var tooltipBoxName = objCommon.getShorterName(obj.Name, 18);
		option.innerHTML = obj.Name;
		option.text = tooltipBoxName;
		option.title = obj.Name;
		select.appendChild(option);
	}
	if(dropDownId == "dropDownBoxEdit") {
		$("#dropDownBoxEdit option[value= '" + objCommon.getShorterName(boxName,18) + "']").remove();
	}
	if(dropDownId == "ddlBoxList") {
		$("option[value= '" + objCommon.getShorterName(boxName.trim(), 18) + "']").remove();
	}
}
	
/** 
 * The purpose of this function is to retrieve the 
 * box list against a cellname
 * @param dropDownId
 * @param boxName
 */
function retrieveBox(dropDownId, boxName) {
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var objBoxManager = new _pc.BoxManager(accessor);
	var totalRecordCount = objBox.retrieveRecordCount(objBoxManager);
	var dataUri = objBoxManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	//var JSONstring =  objBoxManager.getBoxes("");
	var select = document.getElementById(dropDownId);
	select.options.length = 0;
	bindBoxDropDown(dataJson,dropDownId, boxName);
}

/***************************** EDIT ROLE : START *****************************/

/**
 * The purpose of this function is to perfom edit operation on rule.
 * 
 * @param oldRuleName
 * @param oldBoxName
 * @param body
 * @param objJRuleManager
 */
function editRule(oldRuleName, oldBoxName, body, objJRuleManager) {
	var response = objJRuleManager.update(oldRuleName, oldBoxName, body, "*");
	if(response.getStatusCode() == 204) {
		displayEditRuleSuccessMessage();
	} else if (response.getStatusCode() == 409) {
		var existRuleNameMessage = getUiProps().MSG0007;
		editPopupRuleErrorMsg.innerHTML = existRuleNameMessage;
		$("#txtRuleNameEdit").addClass("errorIcon");
	}
}

/**
 * The purpose of this function is to display success message notification
 * on successful rule create
 * @param oldRuleName
 */
function displayRuleCreateMessage (ruleName) {
	$('#createRuleModal, .window').hide();
	addSuccessClass('#ruleMessageIcon');
	$("#ruleMessageBlock").css("display", 'table');
	document.getElementById("ruleSuccessmsg").innerHTML = getUiProps().MSG0419;
	createRuleTable();
	objCommon.centerAlignRibbonMessage("#ruleMessageBlock");
	objCommon.autoHideAssignRibbonMessage('ruleMessageBlock');
}

/**
 * The purpose of this function is to display success message notification
 * on successful edit.
 */
function displayEditRuleSuccessMessage() {
	objCommon.removePopUpStatusIcons('#txtRuleNameEdit');
	$('#ruleEditModalWindow, .window').hide();
	$("#ruleInfoMessageBlock").css("display", 'table');
	document.getElementById("ruleInfoSuccessmsg").innerHTML = getUiProps().MSG0420;
	addSuccessClass('#ruleInfoMessageIcon');
	createRuleTable();
	objCommon.centerAlignRibbonMessage("#ruleInfoMessageBlock");
	objCommon.autoHideAssignRibbonMessage('ruleInfoMessageBlock');
}

/**
 * The purpose of this function is to check validation for 
 * editing rule and calls editRule method
 */
function updateRule() {
	showSpinner("modalSpinnerRule");
	var mainBoxValue = getUiProps().MSG0039;;
	var body = null;
	var newBoxSelected = null;
	var eventExternal = false;
	var newRuleName = null;
	var oldRuleName = sessionStorage.currentRuleName;
	var oldBoxName = sessionStorage.currentBoxName;
	if (oldBoxName == mainBoxValue) {
		oldBoxName = null;
	}

	var action = convInvalidValToUndefined($("#dropDownActionEdit option:selected").val());
	var external = $('input[name="dropDownEventExternalEdit"]:checked').val();
	if (external === "true") {
		eventExternal = true;
	}
	newRuleName = document.getElementById("txtRuleNameEdit").value;
	var dropDown = document.getElementById("dropDownBoxEdit");
	if ($("#chkBoxBoundEdit").attr("checked")) {
		if (oldBoxName && dropDown.selectedIndex == 0 ) {
			newBoxSelected = oldBoxName;
		} else {
			newBoxSelected = dropDown.options[dropDown.selectedIndex].title;
		}
	}
	var eventType = convInvalidValToUndefined(document.getElementById("txtEventTypeEdit").value);
	var eventSubject = convInvalidValToUndefined(document.getElementById("txtEventSubjectEdit").value);
	var eventObject = convInvalidValToUndefined(document.getElementById("txtEventObjectEdit").value);
	var eventInfo = convInvalidValToUndefined(document.getElementById("txtEventInfoEdit").value);
	var targetUrl = convInvalidValToUndefined(document.getElementById("txtTargetUrlEdit").value);
	if ($("#txtTargetUrlEdit").attr("disabled")) {
		targetUrl = null;
	}
	if (!ruleValidation(newRuleName, "popupRuleErrorMsgEdit")) {
		$("#txtRuleNameEdit").addClass("errorIcon");
		removeSpinner("modalSpinnerRule");
		return;
	}

	// Event Subject
	if (eventSubject) {
		if (!objBox.validateSchemaURL(eventSubject, "popupEventSubjectErrorMsgEdit", "#txtEventSubjectEdit")) {
			removeSpinner("modalSpinnerRule");
			return;
		}
	}

	// Event Object
	if (_.indexOf(timerList, eventType) < 0) {
		if (!eventExternal) {
			if (newBoxSelected) {
				eventObject = document.getElementById("txtEventObjectLocalBoxEdit").value;
				if (!eventObject) {
					document.getElementById("popupEventObjectErrorMsgEdit").innerHTML = getUiProps().MSG0080;
					cellpopup.showErrorIcon("#txtEventObjectLocalBoxEdit");
					removeSpinner("modalSpinnerRule");
					return;
				}
				eventObject = objCommon.PERSONIUM_LOCALBOX + "/" + eventObject;
			} else {
				eventObject = document.getElementById("txtEventObjectLocalCelEdit").value;
				if (!eventObject) {
					document.getElementById("popupEventObjectErrorMsgEdit").innerHTML = getUiProps().MSG0080;
					cellpopup.showErrorIcon("#txtEventObjectLocalCelEdit");
					removeSpinner("modalSpinnerRule");
					return;
				}
				eventObject = objCommon.PERSONIUM_LOCALCEL + "/" + eventObject;
			}
		}
	} else {
		if (!eventObject) {
			document.getElementById("popupEventObjectErrorMsgEdit").innerHTML = getUiProps().MSG0080;
			cellpopup.showErrorIcon("#txtEventObjectEdit");
			removeSpinner("modalSpinnerRule");
			return;
		}
		if (!objCommon.isNumber(eventObject)) {
			document.getElementById("popupEventObjectErrorMsgEdit").innerHTML = getUiProps().MSG0433;
			cellpopup.showErrorIcon("#txtEventObjectEdit");
			removeSpinner("modalSpinnerRule");
			return;
		}
	}

	// Target URL
	if (!validateTargetUrl(true)) {
		removeSpinner("modalSpinnerRule");
		return;
	}
	if (action == "exec") {
		if (newBoxSelected) {
			targetUrl = objCommon.PERSONIUM_LOCALBOX + "/" + $("#txtTargetUrlLocalBoxEdit").val();
		} else {
			targetUrl = objCommon.PERSONIUM_LOCALCEL + "/" + $("#txtTargetUrlLocalCelEdit").val();
		}
	}
	body = {"Name" : newRuleName, "_Box.Name" : newBoxSelected};
	if (newBoxSelected == undefined || newBoxSelected == null || newBoxSelected == "" || newBoxSelected == mainBoxValue) {
		body = {"Name" : newRuleName};
	}
	$.extend(body, {"EventType": eventType, "EventSubject":eventSubject,"EventObject":eventObject,
					"EventInfo":eventInfo, "EventExternal":eventExternal,"Action":action,"TargetUrl":targetUrl})
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl,cellName,"","");
	var objJRuleManager = new _pc.RuleManager(accessor);
	editRule(oldRuleName, oldBoxName, body, objJRuleManager);
	uRuleDetail.initializePage(newRuleName, newBoxSelected);

	removeSpinner("modalSpinnerRule");
}

/** 
 * The purpose of this method is to get relation count linked with particular rule 
*/
function getRelationCount(ruleName,boxName,accessor){
	var mainBoxValue = getUiProps().MSG0039;
	var key = null;
	var relationCount =0;
	var baseUrl = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(baseUrl, cellName, "", "");
	var objLinkMgr = new _pc.LinkManager(accessor,objJdcContext );
	key = "(Name="+ruleName+",_Box.Name="+boxName+")";
	if (boxName == "'"+mainBoxValue+"'") {
		key = "(Name="+ruleName+")";
	}
	var response = objLinkMgr.retrieveRuleAccountLinks(objJdcContext,"Rule","Relation",key);
	var responseBody = response.bodyAsJson();
	var json = responseBody.d.results;
	if (response.getStatusCode() == 200) {
		if(json.length >= 1) {
			relationCount =	json.length;
			}
			else {
				relationCount = 0;
		}
	}
	return relationCount;
}

/** 
 * The purpose of this method is to get external cell count linked with particular rule 
*/
function getExtItemCount(ruleName,boxName,accessor,item){
	var mainBoxValue = getUiProps().MSG0039;
	var key = null;
	var relationCount =0;
	var baseUrl = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(baseUrl, cellName, "", "");
	var objLinkMgr = new _pc.LinkManager(accessor,objJdcContext );
	key = "(Name="+ruleName+",_Box.Name="+boxName+")";
	if (boxName == "'"+mainBoxValue+"'") {
		key = "(Name="+ruleName+")";
	}
	var response = objLinkMgr.retrieveRuleAccountLinks(objJdcContext,"Rule",item,key);
	var responseBody = response.bodyAsJson();
	var json = responseBody.d.results;
	if (response.getStatusCode() == 200) {
		if(json.length >= 1) {
			relationCount =	json.length;
			}
			else {
				relationCount = 0;
		}
	}
	return relationCount;
}

function getSelectedRuleDetails() {
	var selectedRuleDetails = objCommon.getMultipleSelections('mainRuleTable', 'input', 'case');
	var arrSelectedRule = selectedRuleDetails.split("'");
	var existingRuleName = arrSelectedRule[1];
	var existingBoxName = arrSelectedRule[3];
	var existingAction = arrSelectedRule[5];
	var existingEventExternal = arrSelectedRule[7];
	var existingEventType = convInvalidValToUndefined(arrSelectedRule[9]);
	var existingEventSubject = convInvalidValToEmpty(arrSelectedRule[11]);
	var existingEventObject = convInvalidValToEmpty(arrSelectedRule[13]);
	var existingEventInfo = convInvalidValToEmpty(arrSelectedRule[15]);
	var existingTargetUrl = convInvalidValToEmpty(arrSelectedRule[17]);
	var mainBoxValue = getUiProps().MSG0039;
	if (existingBoxName == mainBoxValue) {
		$("#chkBoxBoundEdit").attr("checked", false)
		$("#dropDownBoxEdit").attr("disabled", true);
		retrieveBox("dropDownBoxEdit");
	} else {
		$("#chkBoxBoundEdit").attr("checked", true)
		$("#dropDownBoxEdit").attr("disabled", false);
		retrieveBox("dropDownBoxEdit", existingBoxName);
	}
	if ($("#dropDownBoxEdit").children('option').length > 0) {
		$("#chkBoxBoundEdit").attr("disabled", false);
	} else {
		$("#chkBoxBoundEdit").attr("disabled", true);
	}
	sessionStorage.currentRuleName = existingRuleName;
	sessionStorage.currentBoxName = existingBoxName;
	$('#txtRuleNameEdit').val(existingRuleName);
	$("#dropDownActionEdit").val(existingAction);
	$("input[name=dropDownEventExternalEdit]").val([existingEventExternal]);
	$("#txtEventTypeEdit").val(existingEventType);
	$("#txtEventSubjectEdit").val(existingEventSubject);
	$("#txtEventInfoEdit").val(existingEventInfo);
	changeTextField(true, existingEventObject, existingTargetUrl);

	//openCreateEntityModal('#ruleEditModalWindow', '#ruleEditDialogBox');
}
/***************************** EDIT ROLE : END ******************************/

function applyScrollCssOnRuleGrid() {
	var tbodyObject = document.getElementById("entityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#mainRuleTable td:eq(2)").css("width", '32.3%');
	}
}

function refreshCreateRulePopup() {
	document.getElementById("txtRuleName").value='';
	objCommon.removePopUpStatusIcons('#txtRuleName');
	objCommon.removePopUpStatusIcons('#txtEventSubject');
	$("#dropDownAction").val(0);
	$("input[name=dropDownEventExternal]").val(['false']);
	$("#txtEventType").val("");
	changeTextField(false);
	//$("#ruleName").removeClass("errorIcon");
	document.getElementById("popupRuleErrorMsg").innerHTML = "";
	$('.popupContent').find('input:text').val('');
	$('.popupAlertmsg').html('');
	$('#dropDownBox').html('');
	$('#ddlRuleErrorMsg').html('');
	retrieveBox("dropDownBox");
	if ($("#dropDownBox").children('option').length > 0) {
		$("#chkBoxBound").attr("disabled", false);
	} else {
		$("#chkBoxBound").attr("disabled", true);
	}
}

/*
**
* Check validation of TargetUrl
* @returns {Boolean}
*/
function validateTargetUrl(editFlg) {
	var editId = (editFlg)? "Edit":"";

	document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = "";
	var targetUrl = $("#txtTargetUrl"+editId).val();
	var action = convInvalidValToUndefined($("#dropDownAction"+editId+" option:selected").val());
	var boxName = null;
	var dropDownBox = document.getElementById("dropDownBox"+editId);
	if ($("#chkBoxBound"+editId).attr("checked")) {
		boxName = convInvalidValToUndefined(dropDownBox.options[dropDownBox.selectedIndex].title, true);
	}
	switch(action) {
		case "exec":
			if (boxName) {
				targetUrl = document.getElementById("txtTargetUrlLocalBox"+editId).value;
				if (!targetUrl) {
					document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = getUiProps().MSG0080;
					return false;
				}
				let targetSplit = targetUrl.split("/");
				if (targetSplit.length < 2) {
					document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = getUiProps().MSG0427;
					return false;
				}
			} else {
				targetUrl = document.getElementById("txtTargetUrlLocalCel"+editId).value;
				if (!targetUrl) {
					document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = getUiProps().MSG0080;
					return false;
				}
				let targetSplit = targetUrl.split("/");
				if (targetSplit.length < 3) {
					document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = getUiProps().MSG0428;
					return false;
				}
			}
			break;
		case "relay":
			if (!targetUrl) {
				document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = getUiProps().MSG0080;
				cellpopup.showErrorIcon("#txtTargetUrl"+editFlg);
				return false;
			}
			var urlParse = $.url(targetUrl);
			var protocol = urlParse.attr('protocol');
			var checkList = ["http", "https", "personium-localunit", "personium-localcell"];
			if (boxName) {
				checkList.push("personium-localbox");
			}
			if (_.indexOf(checkList, protocol) < 0) {
				document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = getUiProps().MSG0423;
				cellpopup.showErrorIcon("#txtTargetUrl"+editFlg);
				return false;
			}
			
			if (!objBox.validateSchemaURL(targetUrl, "popupTargetUrlErrorMsg"+editId, "#txtTargetUrl"+editFlg)) {
				return false;
			}
			break;
		case "relay.event":
			if (!targetUrl) {
				document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = getUiProps().MSG0080;
				cellpopup.showErrorIcon("#txtTargetUrl"+editFlg);
				return false;
			}
			var urlParse = $.url(targetUrl);
			var protocol = urlParse.attr('protocol');
			var checkList = ["personium-localunit", "personium-localcell"];
			if (_.indexOf(checkList, protocol) < 0) {
				// cellUrl,http,https
				if (!objBox.validateSchemaURL(targetUrl, "popupTargetUrlErrorMsg"+editId, "#txtTargetUrl"+editFlg)) {
					return false;
				}
			} else {
				if (targetUrl.slice(-1) != "/") {
    				targetUrl += "/";
    				$("#txtTargetUrl"+editId).val(targetUrl);
    			}
    			let targetSplit = targetUrl.split("/");
    			let splitLength = 2;
    			let errorMsg = getUiProps().MSG0432;
				if (protocol == "personium-localunit") {
					splitLength = 3;
					errorMsg = getUiProps().MSG0431;
				}
				if (targetSplit.length !== splitLength) {
					document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = errorMsg;
					return false;
				}
			}
			break;
	}

	return true;
};

/**
**The purpose of this function is to validate rule name field
* 
*/
$("#txtRuleName").blur(function () {
	var ruleName = document.getElementById("txtRuleName").value;
	ruleValidation(ruleName, "popupRuleErrorMsg");
});

$("#txtEventSubject").blur(function () {
	var eventSubject = convInvalidValToUndefined(document.getElementById("txtEventSubject").value);
	if (eventSubject) {
		if (!objBox.validateSchemaURL(eventSubject, "popupEventSubjectErrorMsg", "#txtEventSubject")) {
			removeSpinner("modalSpinnerRule");
			return;
		}
	}

	removeStatusIcons("#txtEventSubject");
	document.getElementById("popupEventSubjectErrorMsg").innerHTML = "";
});

$("#chkBoxBound").change(function() {
	if ($("#chkBoxBound").attr("checked")) {
		$("#dropDownBox").attr("disabled", false);
	} else {
		$("#dropDownBox").attr("disabled", true);
	}
	changeTextField(false);
})

/**
**The purpose of this function is to validate Box field
* 
*/
$("#dropDownBox").change(function () {
	changeTextField(false);
});

/**
**The purpose of this function is to validate Action field
* 
*/
$("#dropDownAction").change(function () {
	changeTextField(false);
});
/**
 *
 */
$("#txtEventType").change(function () {
	changeTextField(false);
});

/**
**The purpose of this function is to validate Event External field
* 
*/
$('input[name="dropDownEventExternal"]:radio').change(function () {
	changeTextField(false);
});
$("#txtTargetUrl, #txtTargetUrlLocalBox, #txtTargetUrlLocalCel").blur(function () {
		validateTargetUrl(false);
});
function changeTextField(editFlg, initEventObject, initTargetUrl) {
	var editId = (editFlg)? "Edit":"";
	let eventType = $("#txtEventType"+editId).val();
	let eventExternal = $('input[name="dropDownEventExternal'+editId+'"]:checked').val();
	if (_.indexOf(timerList, eventType) < 0) {
		$("#rdExternal").attr('disabled',false);
		if (eventExternal === "false") {
			$("#dvEventObject"+editId).addClass("requiredElement");
			if ($("#chkBoxBound"+editId).attr("checked")) {
				// There is a box setting
				$("#dvTextEventObject"+editId).css("display", "none");
				$("#dvTextEventObjectLocalBox"+editId).css("display", "block");
				$("#dvTextEventObjectLocalCel"+editId).css("display", "none");
				if (initEventObject) {
					$("#txtEventObjectLocalBox"+editId).val(initEventObject.replace(objCommon.PERSONIUM_LOCALBOX + "/",""));
				}
			} else {
				// There is no box setting
				$("#dvTextEventObject"+editId).css("display", "none");
				$("#dvTextEventObjectLocalBox"+editId).css("display", "none");
				$("#dvTextEventObjectLocalCel"+editId).css("display", "block");
				if (initEventObject) {
					$("#txtEventObjectLocalCel"+editId).val(initEventObject.replace(objCommon.PERSONIUM_LOCALCEL + "/",""));
				}
			}
		} else {
			$("#dvEventObject"+editId).removeClass("requiredElement");
			$("#dvTextEventObject"+editId).css("display", "block");
			$("#dvTextEventObjectLocalBox"+editId).css("display", "none");
			$("#dvTextEventObjectLocalCel"+editId).css("display", "none");
			if (initEventObject) {
				$("#txtEventObject"+editId).val(initEventObject);
			}
			$("#txtEventObject"+editId).attr('placeholder', 'Any character string');
		}
	} else {

		$("#dvEventObject"+editId).addClass("requiredElement");
		$("#dvTextEventObject"+editId).css("display", "block");
		$("#dvTextEventObjectLocalBox"+editId).css("display", "none");
		$("#dvTextEventObjectLocalCel"+editId).css("display", "none");
		if (initEventObject) {
			$("#txtEventObject"+editId).val(initEventObject);
		}
		$("#txtEventObject"+editId).attr('placeholder', 'Numeric only string');
		$('input[name="dropDownEventExternal'+editId+'"]').val(["false"]);
		$("#rdExternal").attr('disabled','disabled');
	}
	
	var action = convInvalidValToUndefined($("#dropDownAction"+editId+" option:selected").val());
	$("#txtTargetUrl"+editId).attr("disabled", false);
	switch (action) {
		case "exec":
			$("#dvTargetUrl"+editId).addClass("requiredElement");
			if ($("#chkBoxBound"+editId).attr("checked")) {
				$("#dvTextTargetUrl"+editId).css("display", "none");
				$("#dvTextTargetUrlLocalBox"+editId).css("display", "block");
				$("#dvTextTargetUrlLocalCel"+editId).css("display", "none");
				if (initTargetUrl) {
					$("#txtTargetUrlLocalBox"+editId).val(initTargetUrl.replace(objCommon.PERSONIUM_LOCALBOX + "/",""));
				}
			} else {
				$("#dvTextTargetUrl"+editId).css("display", "none");
				$("#dvTextTargetUrlLocalBox"+editId).css("display", "none");
				$("#dvTextTargetUrlLocalCel"+editId).css("display", "block");
				if (initTargetUrl) {
					$("#txtTargetUrlLocalCel"+editId).val(initTargetUrl.replace(objCommon.PERSONIUM_LOCALCEL + "/",""));
				}
			}
			break;
		case "log.info":
		case "log.warn":
		case "log.error":
			$("#txtTargetUrl"+editId).attr("disabled", true);
		default:
			$("#dvTargetUrl"+editId).removeClass("requiredElement");
			$("#dvTextTargetUrl"+editId).css("display", "block");
			$("#dvTextTargetUrlLocalBox"+editId).css("display", "none");
			$("#dvTextTargetUrlLocalCel"+editId).css("display", "none");
			if (initTargetUrl) {
				$("#txtTargetUrl"+editId).val(initTargetUrl);
			}
	}

	document.getElementById("popupEventObjectErrorMsg"+editId).innerHTML = "";
	document.getElementById("popupTargetUrlErrorMsg"+editId).innerHTML = "";
}

/**
 * Following method fetches all rule data.
 * @returns json.
 */
function retrieveAllRuleData() {
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var totalRecordCount = retrieveRuleRecordCount();
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objRuleManager = new _pc.RuleManager(accessor);
	var dataUri = objRuleManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$top="+ totalRecordCount;
	var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
}