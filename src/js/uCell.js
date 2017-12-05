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
/*$(function() {
	$("a.modalBox").modalBox();
});*/
$(document).ready(function() {
	$.ajaxSetup({ cache : false });
});

var cellpopup = new cellUI.popup();

/**
 * The purpose of this method is to perform full text search operation on
 * enter key press.
 */
function textCellSearchOnKeyPress(){
	var event = window.event;
	var keycode = (event.keyCode ? event.keyCode : event.which);
	if(keycode == '13'){
		textCellSearch();
	}
}

/**
 * The purpose of this method is to show/hide cross icon on saerch text box
 * as per data.
 */
function handleCrossIconOnTextSearch(){
	if(	$("#txtSearchCellName").val() != ""){
		$("#txtSearchCellName").addClass("clearable");
	}else{
		$("#txtSearchCellName").removeClass("clearable");
		$("#txtSearchCellName").removeClass("clearableHover");
	}
}

/**
 * The purpose of this method is to show right panel contents.
 */
function showRightPanel(isCellCreate){
	$("#header").show();
	$("#navigationBar").show();
	if (isCellCreate == undefined) {
		if ($('#mainContentWebDav').is(':visible')) {
		} else {
			$("#mainContent").show();
		}
		if(!$("#mainContentWebDav").is(":visible")) {
			$("#mainContent").show();
		}
	}
		//$("#mainContent").show();
}

/**
 * The purpose of this method is to hide right panel contents.
 */
function hideRightPanel(){
	$("#header").hide();
	$("#navigationBar").hide();
	$("#mainContent").hide();
}

/**
 * The purpose of this method is to perform the text search operation 
 * on cell list.
 */
function textCellSearch(){
	objCommon.hideListTypePopUp();
	textSearch = true;
	jquery1_9_0("#tableDiv").mCustomScrollbar("destroy");
	var cellName = $("#txtSearchCellName").val();
	if(cellName != undefined && cellName != ""){
		var result = forwardTextCellSearch(cellName);
		if(!result){
			var cellText = getUiProps().LBL0012;
			$("#lblTotalCellCount").html("0 " + cellText);
			$("#mainCellTable").hide();
			$("#searchCellTable").remove();
			$("#noCell").remove();
			hideRightPanel();
			$("#mainContentWebDav").hide();
			$("#dvemptyTableMessage").hide();
			var position = $(".content").height();
			var marginTop = Math.round(position/2);
			var noCellFound = getUiProps().MSG0322;
			var noRow = '<div id="noCell" class="noCell" style="margin-top:'+ marginTop +'px">'+noCellFound+'</div>';
			$("#tableDiv").prepend(noRow);
			if (sessionStorage.selectedLanguage == 'ja') {
				$("#noCell").addClass('japaneseFont');
			}
		}
	} else {
		if (document.getElementById('searchCellTable') != null || document.getElementById('noCell') != null) {
			$("#txtSearchCellName").val("");
			var cellsText = getUiProps().LBL0011;
			$("#lblTotalCellCount").html(sessionStorage.totalCellCountForUnit+" "+cellsText);
			$("#searchCellTable").remove();
			$("#noCell").remove();
			$("#mainCellTable").show();
			getselectedcell(sessionStorage.lastselectedcell, sessionStorage.lastselectedindex, sessionStorage.lastselectedcelldate, false);
			showRightPanel();
			handleCrossIconOnTextSearch();
		}
	}
	jquery1_9_0("#tableDiv").mCustomScrollbar({
		scrollButtons:{
			enable:false
		},
		advanced:{
			updateOnBrowserResize: false
		},
			callbacks:{
				onTotalScroll:function(){
					retrieveChunkedDataCell();
				}
			},
		 theme:"light"
	});
	setTimeout(function() {
		if (cellName != undefined && cellName.length == 0) {
			var selectedCellClass = ".selectedCellInCellList";
			jquery1_9_0("#tableDiv").mCustomScrollbar("scrollTo",selectedCellClass);
		}
	}, 500);
}

/**
 * The purpose of this method is to perform the full text search operation 
 * on cell list.
 */
function fullTextCellSearch(cellName){
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objCellManager = new _pc.CellManager(accessor);
	var result = false;
	var searchedCellName = "";
	try{
		var response = objCellManager.retrieve(cellName);
		searchedCellName = response.getName();
		result = true;
	} catch(exception){
		if(exception.message.indexOf("No such entity") != -1){
			result = false;
			
		}
	}
	if(result){
		var cellText = getUiProps().LBL0012;
		$("#lblTotalCellCount").html("1 " + cellText);
		$("#mainCellTable").hide();
		$("#noCell").remove();
		$("#searchCellTable").remove();
		showRightPanel();
		$("#mainContentWebDav").hide();
		var searchRow = '<table id="searchCellTable" cellpadding="0" cellspacing="0"><tr class="allCell selectedCellInCellList" id="searchCellList"><td name = "Cell"><div class="cellNameList" title = "'+searchedCellName+'" valign="top" id="searchedCellName">'+searchedCellName+'</div></td></tr></table>';
		$("#tableDiv").prepend(searchRow);
		if(searchedCellName != sessionStorage.lastselectedcell){
			getselectedcell(searchedCellName, 0, "", true);
		}
	}else{
		return false;
	}
	return true;
}

/**
 * The purpose of this method is to perform the forward text search operation
 * on cell list.
 */
function forwardTextCellSearch(cellName){
	var baseUrl = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(baseUrl, "", "", "");
	var ac = objJdcContext.withToken(token);
	//var res = ac.asCellOwner().unit.cell.query().filter("substringof('"+cellName+"',Name)").orderby('__updated desc').top(500).skip(0).run();
	var res = ac.asCellOwner().unit.cell.query().filter("startswith(Name,'"+cellName+"')").orderby('__updated desc').top(500).skip(0).run();
	var jsondata = JSON.stringify(res);
	var JSONstring = JSON.parse(jsondata);
	var lenJSONstring = JSONstring.length;
	if (lenJSONstring > 0) {
		var cellsText = getUiProps().LBL0011;
		$("#lblTotalCellCount").html(lenJSONstring+" "+cellsText);
		$("#mainCellTable").hide();
		$("#noCell").remove();
		$("#searchCellTable").remove();
		showRightPanel();
		$("#mainContentWebDav").hide();
		var date = new Array();
		var searchRow = '<table id="searchCellTable" cellpadding="0" cellspacing="0">';
		for(var count = 0; count < lenJSONstring; count++) {
			var obj = JSONstring[count];
			var fullCellName = JSONstring[count].Name;
			date[count] = obj.__published;
			var dtCreate = ""+ date[count]+"";
			var selectedCellDate = objCommon.convertEpochDateToReadableFormat(dtCreate);
			var finalSelectedCellDate = "'"+selectedCellDate+"'";
			if(count == 0){
				searchRow += '<tr class="allCell selectedCellInCellList" id="searchCellList'+count+'">';
				searchRow += '<td onClick="getselectedcell(\'' + fullCellName + '\',\'' + count + '\','+finalSelectedCellDate+')" name = "Cell"><div class="cellNameList" title = "'+fullCellName+'" valign="top" id="fullCellName">'+fullCellName+'</div></td>';
			}else{
				searchRow += '<tr class="allCell" id="searchCellList'+count+'">';
				searchRow += '<td onClick="getselectedcell(\'' + fullCellName + '\',\'' + count + '\','+finalSelectedCellDate+')" name = "Cell"><div class="cellNameList" title = "'+fullCellName+'" valign="top">'+fullCellName+'</div></td>';
			}
			
			searchRow += '</tr>';
		}
		searchRow += '</table>';
		$("#tableDiv").prepend(searchRow);
		var searchedCellName = JSONstring[0].Name;
		if(searchedCellName != sessionStorage.lastselectedcell){
			getselectedcell(searchedCellName, 0, "", true);
		}
	}else{
		return false;
	}
	return true;
}

/**
 * The purpose of this method is to restore the cell list state after
 * closing the search operation.
 */
function restoreCellList(){
	$("#txtSearchCellName").val("");
	var cellsText = getUiProps().LBL0011;
	$("#lblTotalCellCount").html(sessionStorage.totalCellCountForUnit+" "+cellsText);
	jquery1_9_0("#tableDiv").mCustomScrollbar("destroy");
	$("#mainCellTable").show();
	if($("#searchedCellName").is(":visible") && $("#searchedCellName").text() != sessionStorage.lastselectedcell){
		getselectedcell(sessionStorage.lastselectedcell, sessionStorage.lastselectedindex, sessionStorage.lastselectedcelldate, true);
	} else if(!$("#searchedCellName").is(":visible")) {
		if( sessionStorage.tabName == "Role") {
			var noOfRecords = $("#mainRoleTable > tbody > tr").length;
			if(noOfRecords == 0 ) {
				$("#dvemptyTableMessage").show();
			}
		} else if( sessionStorage.tabName == "Account") {
			var noOfRecords = $("#mainAccountTable > tbody > tr").length;
			if(noOfRecords == 0 ) {
				$("#dvemptyTableMessage").show();
			}
		} else if( sessionStorage.tabName == "External Cell") {
			var noOfRecords = $("#mainExternalCellTable > tbody > tr").length;
			if(noOfRecords == 0 ) {
				$("#dvemptyTableMessage").show();
			}
		} else if( sessionStorage.tabName == "Relation") {
			var noOfRecords = $("#mainRelationTable > tbody > tr").length;
			if(noOfRecords == 0 ) {
				$("#dvemptyTableMessage").show();
			}
		} else if( sessionStorage.tabName == "External Role") {
			var noOfRecords = $("#externalRoleTable > tbody > tr").length;
			if(noOfRecords == 0 ) {
				$("#dvemptyTableMessage").show();
			}
		}
		getselectedcell(sessionStorage.lastselectedcell, sessionStorage.lastselectedindex, sessionStorage.lastselectedcelldate, true);
	}
	$("#searchCellTable").remove();
	$("#noCell").remove();
	if (sessionStorage.tabName == "Box") {
		if ($('#mainContentWebDav').is(':visible')) {
		} else {
			showRightPanel();
		}
	}
	if(!$("#mainContentWebDav").is(":visible")) {
		showRightPanel();
	}
	handleCrossIconOnTextSearch();
	jquery1_9_0("#tableDiv").mCustomScrollbar({
		scrollButtons:{
			enable:false
		},
		advanced:{
			updateOnBrowserResize: false
		},
			callbacks:{
				onTotalScroll:function(){
					retrieveChunkedDataCell();
				}
			},
		 theme:"light"
	});
	setTimeout(function() {
		var selectedCellClass = ".selectedCellInCellList";
		jquery1_9_0("#tableDiv").mCustomScrollbar("scrollTo",selectedCellClass);
	}, 500);
}

/**
 * The purpose of this method is to refresh the cell list.
 */
function refreshCellList(isCellCreate) {
	$("#txtSearchCellName").val("");
	handleCrossIconOnTextSearch();
	$("#searchCellTable").remove();
	$("#noCell").remove();
	showRightPanel(isCellCreate);
	createcelltable();
	activeCell(0);
	selectBoxInNavigationBar();
	addSelectedClassMainNavBox();
}

/* The purpose of this function is to close the notification ribbon,
 * when cross icon is clicked.
 */
function hideMessage() {
	document.getElementById("messageBlock").style.display = "none";
}

function applyContents() {
	$("#headerlogout").html(getUiProps().header_logout_label);
	$("#headertip").html(getUiProps().header_logo_label);
}

/* The purpose of this function is to get the first cell selected
 * every time user logs into the application
 */
 function getFirstCellSelected(cellName, celldate,index) {
	var objCommon = new common();
	var selectedCellDate = objCommon.convertEpochDateToReadableFormat(celldate);
	sessionStorage.selectedcelldate = selectedCellDate;
	sessionStorage.selectedcell = cellName;
	sessionStorage.selectedindex = index;
	sessionStorage.lastselectedcelldate = selectedCellDate;
	sessionStorage.lastselectedcell = cellName;
	sessionStorage.lastselectedindex = index;
	if(index != undefined) {
		var objFirstCell=$('#cellList'+index);
		objFirstCell.siblings().removeClass('selectedCellInCellList');
		objFirstCell.addClass('selectedCellInCellList');
	}
	$("#cellNameHeading").html(cellName);
	$("#cellNameHeading").attr('title', cellName);
	var unitURL = sessionStorage.selectedUnitUrl;
	var cellURL = "";
	if(!unitURL.endsWith("/")){
		unitURL = unitURL + "/";
	} 
	cellURL = unitURL + cellName;
	if (!cellURL.endsWith("/")) {
		cellURL += "/";
	}
	$('#cellURLHeading').html(cellURL);
	$('#cellURLHeading').attr('title', cellURL);
	if (sessionStorage.isCellDeleted == 1) {
		boxListData();
	} else {
		boxListData(function() {
			let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
            if (ManagerInfo.isCellManager) {
                // For Cell Manager, hide the button.
                $("#leftPanel").hide();
                $("#dvCellListContainer").hide();
                $("#btnCreateCell").hide();
            } else {
                $("#dvCellListContainer").show();
            }
			jquery1_9_0("#tableDiv").mCustomScrollbar("update");
			objCommon.checkCellContainerVisibility();
		});
	}
	//sessionStorage.tempToken = "";
	//uCellProfile.displayProfileDetails();
}

/* The purpose of this function is to persist the cell name. 
 */
function getselectedcell(cellname, index, celldate, isSearch) {
	objCommon.hideListTypePopUp();
	if(isSearch == true){
		/*sessionStorage.lastselectedcell = sessionStorage.selectedcell;
		sessionStorage.lastselectedcelldate = sessionStorage.selectedcelldate;
		sessionStorage.lastselectedindex = sessionStorage.selectedindex;*/
		sessionStorage.selectedcell = cellname;
		sessionStorage.selectedcelldate = celldate;
		sessionStorage.selectedindex = index;
	} else if (isSearch == undefined) {
		sessionStorage.selectedcell = cellname;
		sessionStorage.selectedcelldate = celldate;
		sessionStorage.selectedindex = index;
		sessionStorage.lastselectedcell = cellname;
		sessionStorage.lastselectedcelldate = celldate;
		sessionStorage.lastselectedindex = index;
		hideCellListOnCellSelection();
	} else if (isSearch == false) {
		sessionStorage.selectedcell = sessionStorage.lastselectedcell;
		sessionStorage.selectedcelldate = sessionStorage.lastselectedcelldate;
		sessionStorage.selectedindex = sessionStorage.lastselectedindex;
	}
	$("#cellNameHeading").html(cellname);
	$("#cellNameHeading").attr('title', cellname);
	var unitURL = sessionStorage.selectedUnitUrl;
	var cellURL = "";
	if(!unitURL.endsWith("/")){
		unitURL = unitURL + "/";
	} 
	cellURL = unitURL + cellname;
	if (!cellURL.endsWith("/")) {
		cellURL +="/";
	}
	$('#cellURLHeading').html(cellURL);
	$('#cellURLHeading').attr('title', cellURL);
	activeCell(index);
	sessionStorage['cellACLRolePrivilegeSet'] = "";
	persistTabOnCellChange();
}

/**
 * The purpose of this function is to persist the previous tab 
 * on selecting different cell.
 */
function persistTabOnCellChange(){
	var tab = sessionStorage.tabName;
	var contextRoot = sessionStorage.contextRoot;
//	var id = objCommon.isSessionExist();
//	if (id != null) {
		if(tab == "Box"){
			boxListData();
		}else if(tab == "Role"){
			roleListData();
		}else if(tab == "Account"){
			accountListData();
		}else if(tab == "External Cell"){
			externalCellList();
		}else if(tab == "Relation"){
			relationListData();
		}else if(tab == "External Role"){
			externalRoleList();
		}else if(tab == "SentMessage"){
			uMainNavigation.openSentMessageList();
		}else if(tab == "Received"){
			openReceivedMessageList();
		}else if(tab == "Log"){
			uMainNavigation.logViewData();
		}else if(tab == "infoProfile"){
			uMainNavigation.openCellProfileInfo();
		}else if(tab == "infoAdmin"){
			uMainNavigation.CellInfoNavigationData();
		}else{
			sessionStorage.tabName = "";
		}
}

/* The purpose of this function is to close the create cell pop up.
 */
function closeCreateCell() {
	$('.popupContent').find('input:text').val('');
	$('.popupContent').find('textarea').val('');
	$('.popupAlertmsg').html('');
	$('#createCellModal, .window').hide();
	$('#chkAdmin').attr('checked', false);
	$('#chkCreateProfile').attr('checked', false);
	$("#trAdmin").hide(); 
	$("#trDisplayName").hide();
	$("#trDescription").hide();
	$("#trPhoto").hide();
	$('#txtRoleName').val('Admin');
	$("#trAccess").hide();
	$("#btnPublic").attr('checked', true);
	$("#btnPrivate").attr('checked', false);
	uCellProfile.resetFileInput('idCellImgFile','popupCreatePhotoErrorMsg');
}

/* The purpose of this function is to open the create cell pop up.
 */
function openCell() {
	var id = objCommon.isSessionExist();
	var contextRoot = sessionStorage.contextRoot;
	if (id != null) {
		var id = '#createCellDialog';
		$('.popupAlertmsg').html('');
		$('#createCellModal').fadeIn(0);
		var winH = $(window).height();
		var winW = $(window).width();
		$(id).css('top', winH / 2 - $(id).height() / 2);
		//$(id).css('top', 120);
		$(id).css('left', winW / 2 - $(id).width() / 2);
		$('#btnFwdCellCreate').focus();
	} else {
		window.location.href = contextRoot;
	}
}

/* The purpose of this function is to close the delete cell pop up.
 */
function closeDeleteModalWindow() {
	$('#deleteModal, .window').hide("fast");
}

/* The purpose of this function is to open the delete cell pop up.
 */
function openDeleteModalWindow() {
	var id = '#deleteDialog';
	document.getElementById("popupErrorMsgRecursiveCellDelete").innerHTML = null;
	$('#textCapcha').val('');	
	$('#deleteModal').fadeIn("fast");	
	var winH = $(window).height();
	var winW = $(window).width();
	$('#labelCapcha').val(generateCapchaText());
	$(id).css('top', winH / 2 - $(id).height() / 2);
	$(id).css('left', winW / 2 - $(id).width() / 2);
	$('#textCapcha').focus();
}

/* The purpose of this function is to generate the five character text.
 */
function generateCapchaText() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for( var i=0; i < 5; i++ ) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

/* The purpose of this function is to validate the text entered by User.
 */
function validateCapchaText() {
	var enterText = $('#textCapcha').val();
	var displayText = $('#labelCapcha').val();

	if (enterText==="" || enterText===null || enterText===undefined ) {
		document.getElementById("popupErrorMsgRecursiveCellDelete").innerHTML = getUiProps().MSG0187;
		return false;
	}
	if (displayText!==enterText) {
		$('#textCapcha').val = null;
		$('#labelCapcha').val(generateCapchaText());
		document.getElementById("popupErrorMsgRecursiveCellDelete").innerHTML = getUiProps().MSG0186;
		return false;
	}
	return true;
}
/**
 * Following method pulls out cellinformation using its index on the list.
 * @param selectedIndex Index of the cell.
 * @returns {Array} Array having Cell Name and its date of creation.
 */
function getCellInfo(selectedIndex){
	var url = getClientStore().baseURL;
	var objJdcContext = new _pc.PersoniumContext(url, "", "", "");
	var ac = objJdcContext.withToken(token);
	var res = ac.asCellOwner().unit.cell.query().orderby('__updated desc').top(
			500).skip(0).run();
	var jsondata = JSON.stringify(res);
	var JSONstring = JSON.parse(jsondata);
	var dtCreate = JSONstring[selectedIndex].__published;
	dtCreate = ""+ dtCreate+"";
	var selectedCellDate = objCommon.convertEpochDateToReadableFormat(dtCreate);
	var finalSelectedCellDate = "'"+selectedCellDate+"'";
	var arrCellInfo = new Array();
	arrCellInfo.push(JSONstring[selectedIndex].Name);
	arrCellInfo.push(finalSelectedCellDate);
	return arrCellInfo;
}


/* The purpose of this function is to delete the selected cell.
 */
function deleteCell() {
	if (validateCapchaText()) {
		//showSpinner("modalSpinnerCellProfile");
		$("#btnDeleteCell").css('pointer-events','none');
		var objCommon = new common();
		var cellName = sessionStorage.selectedcell;
		var token = getClientStore().token;
		var baseUrl  = getClientStore().baseURL; 
		var cellname = sessionStorage.selectedcell;
		var accessor = objCommon.initializeAccessor(baseUrl, cellname,"","");
		var objCellManager = new _pc.CellManager(accessor);	
		var response = objCellManager.recursiveDelete(cellName);
		if(response.resolvedValue.status === 204) {
			sessionStorage.isScrollMove = 1;
			sessionStorage.isCellDeleted = 1;
			createcelltable();
			var selectedIndex = sessionStorage.selectedindex;
			var arr = getCellInfo(selectedIndex);
			getselectedcell(arr[0], selectedIndex, arr[1]);
			selectBoxInNavigationBar();
			$("#infoNav").removeClass("selected");
			$("#boxNav").addClass("selected");
		} else if(response.resolvedValue.status == 409) {
			displayConflictMessage();
		}
	}
}
/* The purpose of this function is to display the message on notification
 * ribbon, if cell is successfully deleted.
 * API returns 204 in response
 */
function displayCellDeleteSuccessMessage(modalId,dvMessageID) {
	$('#deleteModal, .window').hide("fast");
	document.getElementById(dvMessageID).style.display = "table";
	$('#boxMessageBlock #successmsg').text(getUiProps().MSG0266);
	objCommon.centerAlignRibbonMessage("#boxMessageBlock");
	objCommon.autoHideAssignRibbonMessage('boxMessageBlock');
	//window.setTimeout("$('#boxMessageBlock').hide()", timeOut);
};

/* The purpose of this function is to display the message on notification
 * ribbon, if cell cannot be deleted.
 * API returns 409 in response
 */
function displayConflictMessage() {
	addErrorClass();
	inlineMessageBlock();
	document.getElementById("successmsg").innerHTML = getUiProps().MSG0200;
	removeSpinner("modalSpinnerCellProfile");
	$('#deleteModal, .window').hide("fast");
	objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
	objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
}

/**
 * The purpose of this function is to retrieve data in chunk (500) on total 
 * scroll event inside cell list.
 */
function retrieveChunkedDataCell() {
	var totalCellCountForUnit = sessionStorage.totalCellCountForUnit;
	var rowCount = $('#mainCellTable tr').length-1;
	if (totalCellCountForUnit > rowCount) {
		var lastRowCount = rowCount;
		var cellName = sessionStorage.selectedcell;
		var baseUrl = getClientStore().baseURL;
		var accessor = objCommon.initializeAccessor(baseUrl, cellName);
		var res = accessor.asCellOwner().unit.cell.query().orderby(
				'__updated desc').skip(rowCount).top(500).run();
		var jsondata = JSON.stringify(res);
		var JSONstring = JSON.parse(jsondata);
		var lenJSONstring = JSONstring.length;
		var dynamicTable = '';
		var date = new Array();
		for ( var i = 0; i < lenJSONstring; i++) {
			var obj = JSONstring[i];
			fullCellName = JSONstring[i].Name;
			date[i] = obj.__published;
			var dtCreate = "" + date[i] + "";
			var selectedCellDate = objCommon
					.convertEpochDateToReadableFormat(dtCreate);
			var finalSelectedCellDate = "'" + selectedCellDate + "'";
			dynamicTable += '<tr class="allCell" id = "cellList' + lastRowCount + '">';
			dynamicTable += '<td onClick="getselectedcell(\''
					+ fullCellName
					+ '\',\''
					+ lastRowCount
					+ '\','
					+ finalSelectedCellDate
					+ ')" style="height:35px" name = "Cell"><div class="cellNameList" title = "'
					+ fullCellName + '" valign="top" >' + fullCellName
					+ '</div></td>';
			dynamicTable += "</tr>";
			lastRowCount++;
		}
		$('#mainCellTable tbody').append(dynamicTable);
		jquery1_9_0("#tableDiv").mCustomScrollbar("update");
	}
}

/**
 * The purpose of this function is to return cell
 * manager object.
 */
function createCellManager(){
	var cellName = sessionStorage.selectedcell.toString();
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objCellMgr = new _pc.CellManager(accessor);
	return objCellMgr;
}

/**
 * The purpose of this function is to expand cell list.
 */
function expandCellList() {
	$('.associationSchemaDiagramRow').removeClass("addPositionOnAssociationVieMode");
	setTimeout(function() {
		$('.checkBoxLabel').addClass("chkboxPositionInherit");
	}, 50);
	$("#leftPanel").hide();
	$("#dvCellListStretch").show();
	$("#dvCellListContainer").animate({
		width : "toggle",
	}, {
		duration : 500,
		specialEasing : {
			width : "linear",
		},
	});
	jquery1_9_0("#tableDiv").mCustomScrollbar("update");
	if (sessionStorage.isScrollMove == 1) {
		sessionStorage.isScrollMove = 0;
		var selectedCellClass = ".selectedCellInCellList";
		jquery1_9_0("#tableDiv").mCustomScrollbar("scrollTo",selectedCellClass);
	}
}

/**
 * The purpose of this function is to collapse cell list.
 */
function collapseCellList() {
	if ($('#dvCellListContainer').is(':visible')) {
		$('.checkBoxLabel').addClass("chkboxPositionInherit");
		setTimeout(function() {
			$('.checkBoxLabel').removeClass("chkboxPositionInherit");
			$('.associationSchemaDiagramRow').addClass("addPositionOnAssociationVieMode");
		}, 350);
		$("#dvCellListContainer").animate({
			width : "toggle"
		}, {
			duration : 400,
			specialEasing : {
				width : "linear",
			},
		});
		$("#leftPanel").show();
	} else {
		var objCommon = new common();
		objCommon.checkCellContainerVisibility();
	}
}

/**
 * The purpose of this function is to hide cell list on
 * click of cell row.
 */
function hideCellListOnCellSelection() {
	$('.checkBoxLabel').removeClass("chkboxPositionInherit");
	$('.associationSchemaDiagramRow').addClass("addPositionOnAssociationVieMode");
	if (!JSON.parse(sessionStorage.ManagerInfo).isCellManager) {
		$("#leftPanel").show();
		$("#dvCellListContainer").hide();
	}
}

$(document).ready(function() {
	handleCrossIconOnTextSearch();
	if (document.getElementById('btnCellListSlide')!= null) {
		document.getElementById('btnCellListSlide').onmousedown = function(e) {
		var oldx = 0;
		var winW = $(window).width()/2;
		// Check for mouse left click.
		if (e.which === 1) {
			// This stretches cell list on mouse move.
			document.onmousemove = function(e) {
				var cellContainerWidth = $('#dvCellListContainer').width();
				if (e.pageX > oldx && cellContainerWidth < winW) {
					e = e || event;
					var dynamicWidth = e.pageX+1+'px';
					var integerDynamicWidth = parseInt(dynamicWidth);
					document.getElementById("dvCellListContainer").style.width = dynamicWidth;
					document.getElementById("tableDiv").style.width = integerDynamicWidth-10+'px';
					document.getElementById("txtSearchCellName").style.width = integerDynamicWidth-147+'px';
					$('#dvCellListStretch').css('left', integerDynamicWidth-10+'px');
					document.getElementById("btnCreateCell").style.width = dynamicWidth;
					$('#cellCreateIcon').css('margin-left', (integerDynamicWidth/2)-62+'px');
					$(".cellNameList").css("width", integerDynamicWidth-47+'px');
					$(".cellNameList").css("max-width", integerDynamicWidth-47+'px');
					$("#dvEnvironmentName").css("width", integerDynamicWidth-30+'px');
					$("#dvEnvironmentName").css("max-width", integerDynamicWidth-30+'px');
				} else if (e.pageX < oldx && cellContainerWidth > 230 && e.pageX !=0) {
					e = e || event;
					var dynamicWidth = e.pageX-1+'px';
					var integerDynamicWidth = parseInt(dynamicWidth);
					document.getElementById("dvCellListContainer").style.width = dynamicWidth;
					document.getElementById("tableDiv").style.width = integerDynamicWidth-10+'px';
					document.getElementById("txtSearchCellName").style.width = integerDynamicWidth-147+'px';
					$('#dvCellListStretch').css('left', integerDynamicWidth-10+'px');
					$('#cellCreateIcon').css('margin-left', (integerDynamicWidth/2)-62+'px');
					document.getElementById("btnCreateCell").style.width = dynamicWidth;
					$(".cellNameList").css("width", integerDynamicWidth-47+'px');
					$(".cellNameList").css("mx-width", integerDynamicWidth-47+'px');
					$("#dvEnvironmentName").css("width", integerDynamicWidth-30+'px');
					$("#dvEnvironmentName").css("max-width", integerDynamicWidth-30+'px');
				} else if(cellContainerWidth < 230) {
					document.getElementById("dvCellListContainer").style.width = '230px';
					document.getElementById("tableDiv").style.width = '220px';
					document.getElementById("txtSearchCellName").style.width = '83px';
					document.getElementById("btnCreateCell").style.width = '230px';
					$('#cellCreateIcon').css('margin-left', '53px');
					$('#dvCellListStretch').css('left', '220px');
					$(".cellNameList").css("width", '253px');
					$(".cellNameList").css("max-width", '253px');
					$("#dvEnvironmentName").css("width", '200px');
					$("#dvEnvironmentName").css("max-width", '200px');
				} else if(cellContainerWidth > winW) {
					document.getElementById("dvCellListContainer").style.width = winW+'px';
					document.getElementById("tableDiv").style.width = winW-10+'px';
					$('#dvCellListStretch').css('left', winW-10+'px');
					document.getElementById("btnCreateCell").style.width = winW+'px';
					$('#cellCreateIcon').css('margin-left', (winW/2)-62+'px');
					document.getElementById("txtSearchCellName").style.width = winW-147+'px';
					$(".cellNameList").css("width", winW-47+'px');
					$(".cellNameList").css("max-width", winW-47+'px');
					$("#dvEnvironmentName").css("width", winW-30+'px');
					$("#dvEnvironmentName").css("max-width", winW-30+'px');
				}
			};
			document.onmouseup = function() {
				document.onmousemove = null;
			};
		}
		oldx = e.pageX;
		};
	}
});

/*createCellListHoverEffect = function () {
	$("#createEntityWrapper").hover(function(){
		$("#createIcon").css("background","url(../images/sprite.png) no-repeat 43% -551px");
		$("#createText").css("color","#c80000");
		$("#arrow").css("background","url(../images/sprite.png) no-repeat 18% -577px");
	},function(){
		$("#createIcon").css("background","url(../images/sprite.png) no-repeat 43% -523px");
		$("#createText").css("color","#1b1b1b");
		$("#arrow").css("background","url(../images/sprite.png) no-repeat 18% -600px");
	});
};*/
