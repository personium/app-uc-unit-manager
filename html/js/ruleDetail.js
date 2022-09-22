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
function ruleDetail(){}

var uRuleDetail = new ruleDetail();
var collectionLocation = '';
ruleDetail.prototype.tabName='';

/**
 * The purpose of this method is to open the Box Detail Root page for the
 * particular box.
 * @param boxname
 */
ruleDetail.prototype.openRuleDetail = function(rulename, boxname){
	sessionStorage.boxName = boxname;
	
	$("#mainContent").hide();
	$("#mainContentWebDav").hide();
	sessionStorage.tabName = "Rule";
	$('#ruledetailInfoTab').addClass("selected");

	var target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);
	$("#mainContentWebDav").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/ruleDetail.html',
			function() {
				$("#webDavProfileArea").hide();
				$("#webDavProfileArea").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/ruleInfo.html',
						function(){
							uRuleDetail.initializePage(rulename, boxname);
							$("#webDavProfileArea").show();
							$("#mainContentWebDav").show();
							spinner.stop();
				});
			});
};

ruleDetail.prototype.setCellControlsInfoTabValues = function(ccname, ccbox, ccaction, ccexternal, cctype, ccsubject, ccobject, ccinfo, cctargeturl, cctag, cccreatedat, ccupdatedat, schemaboxObj) {
    sessionStorage.ccname       = objCommon.replaceNullValues(ccname,getUiProps().MSG0275);
    sessionStorage.ccbox       = objCommon.replaceNullValues(ccbox,getUiProps().MSG0275);
    sessionStorage.currentRuleName = objCommon.replaceNullValues(ccname,getUiProps().MSG0275);
	sessionStorage.currentBoxName = objCommon.replaceNullValues(ccbox,getUiProps().MSG0039);
    sessionStorage.ccaction       = objCommon.replaceNullValues(ccaction,getUiProps().MSG0275);
    sessionStorage.ccexternal       = objCommon.replaceNullValues(ccexternal,getUiProps().MSG0275);
    sessionStorage.cctype       = objCommon.replaceNullValues(cctype,getUiProps().MSG0275);
    sessionStorage.ccsubject       = objCommon.replaceNullValues(ccsubject,getUiProps().MSG0275);
    sessionStorage.ccobject       = objCommon.replaceNullValues(ccobject,getUiProps().MSG0275);
    sessionStorage.ccinfo       = objCommon.replaceNullValues(ccinfo,getUiProps().MSG0275);
    sessionStorage.cctargeturl       = objCommon.replaceNullValues(cctargeturl,getUiProps().MSG0275);
    sessionStorage.ccetag       = objCommon.replaceNullValues(cctag,getUiProps().MSG0275);
    sessionStorage.cccreatedat  = objCommon.convertEpochDateToReadableFormat(cccreatedat);
    sessionStorage.ccupdatedat  = objCommon.convertEpochDateToReadableFormat(ccupdatedat);

    if (schemaboxObj.length > 0 && schemaboxObj[0].Schema) {
    	sessionStorage.ccurl        = schemaboxObj[0].Schema;
    } else {
    	sessionStorage.ccurl        = "- (" + sessionStorage.selectedcellUrl + ")";
    }
    
};

/**
 * The purpose of this method is to display the Box Info details.
 */
ruleDetail.prototype.displayRuleInfoDetails = function() {
	$("#ccName").text(sessionStorage.ccname);
	$("#ccBox").text(sessionStorage.ccbox);
	$("#ccAction").text(sessionStorage.ccaction);
	$("#ccExternal").text(sessionStorage.ccexternal);
	$("#ccType").text(sessionStorage.cctype);
	$("#ccSubject").text(sessionStorage.ccsubject);
	$("#ccObject").text(sessionStorage.ccobject);
	$("#ccInfo").text(sessionStorage.ccinfo);
	$("#ccTargetUrl").text(sessionStorage.cctargeturl);
	$("#ccCreatedate").text(sessionStorage.cccreatedat);
	$("#ccUpatedate").text(sessionStorage.ccupdatedat);
	$("#ccEtag").text(sessionStorage.ccetag);
	var dispCcURL = objCommon.changeLocalUnitToUnitUrl(sessionStorage.ccurl);
	$("#ccUrl").text(dispCcURL);
};

/**
 * This method sets the initialization view for the Box Detail Root page.
 * @param rulename
 */
ruleDetail.prototype.initializePage = function(rulename, boxname){
	$("#backBtnTxt").text(rulename);
	$("#backBtnTxt").attr('title',rulename);
	ruleData = objRule.getRuleData(rulename, boxname);
	uRuleDetail.setCellControlsInfoTabValues(rulename, boxname, ruleData.Action, ruleData.EventExternal, ruleData.EventType, ruleData.EventSubject, ruleData.EventObject, ruleData.EventInfo, ruleData.TargetUrl, ruleData.__metadata.etag, ruleData.__published, ruleData.__updated, ruleData._Box);
	uRuleDetail.displayRuleInfoDetails();
};

/**
 * The purpose of this method is to perform back button operation maintaining the
 * box list view page state.
 */
ruleDetail.prototype.clickBackButton = function(){
	objCommon.hideListTypePopUp();
	$("#mainContent").show();
	$("#mainContentWebDav").hide();
	$("#mainContentWebDav").empty();
};

/**
**The purpose of this function is to validate rule name field in edit rule popup
* 
*/
$("#txtRuleNameEdit").blur(function () {
	var newRuleName = document.getElementById("txtRuleNameEdit").value;
	if(ruleValidation(newRuleName, "popupRuleErrorMsgEdit")) {
		cellpopup.showValidValueIcon('#txtRuleNameEdit');
	} else {
		$("#txtRuleNameEdit").addClass("errorIcon");
	}
});
$("#txtEventSubjectEdit").blur(function () {
	var eventSubject = convInvalidValToUndefined(document.getElementById("txtEventSubjectEdit").value);
	if (eventSubject) {
		if (!objBox.validateSchemaURL(eventSubject, "popupEventSubjectErrorMsgEdit", "#txtEventSubjectEdit")) {
			removeSpinner("modalSpinnerRule");
			return;
		}
	}

	removeStatusIcons("#txtEventSubjectEdit");
	document.getElementById("popupEventSubjectErrorMsgEdit").innerHTML = "";
});
$("#chkBoxBoundEdit").change(function() {
	if ($("#chkBoxBoundEdit").attr("checked")) {
		$("#dropDownBoxEdit").attr("disabled", false);
	} else {
		$("#dropDownBoxEdit").attr("disabled", true);
	}
	changeTextField(true);
})
$("#dropDownBoxEdit").change(function () {
	changeTextField(true);
});
$("#dropDownActionEdit").change(function () {
	changeTextField(true);
});
$('input[name="dropDownEventExternalEdit"]:radio').change(function () {
	changeTextField(true);
});
$("#txtTargetUrlEdit, #txtTargetUrlLocalBoxEdit, #txtTargetUrlLocalCelEdit").blur(function () {
	validateTargetUrl(true);
});

$("#txtEventTypeEdit").change(function () {
	changeTextField(true);
});