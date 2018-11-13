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
function receivedMessage() {
}

var uReceivedMessage = new receivedMessage();
var maxRowsForReceivedMessage = 50;
var sbSuccessfulReceivedMessage = 0;
var sbConflictReceivedMessage = 0;
var totalRecordsize = 0;
var storeReceivedMessageJson = '';
var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;
/**
 * Following method sets received message JSON.
 * @param receivedMessageJson json records.
 */
receivedMessage.prototype.setReceivedMessageJson = function(receivedMessageJson) {
	storeReceivedMessageJson = receivedMessageJson;
};

/**
 * Following method fetches json records.
 * @returns {String} json.
 */
receivedMessage.prototype.getReceivedMessageJson = function() {
	return storeReceivedMessageJson;
};
/**
 * The purpose of this method is to create and initialize received Message Manager.
 * @returns {jReceivedMessageManager}
 */
receivedMessage.prototype.createReceivedMessageManager = function(){
	var cellName = sessionStorage.selectedcell;
	//var boxName = collectionPath;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objReceivedMessageManager = new _pc.ReceivedMessageManager(accessor);
	return objReceivedMessageManager;
};

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
receivedMessage.prototype.retrieveRecordCount = function() {
	var accessor = objCommon.initializeAccessor(getClientStore().baseURL, sessionStorage.selectedcell);
	var objReceivedMessageManager = this.createReceivedMessageManager();
	var uri = objReceivedMessageManager.getUrl();
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
receivedMessage.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var accessor = objCommon.initializeAccessor(getClientStore().baseURL, sessionStorage.selectedcell);
	var objReceivedMessageManager = this.createReceivedMessageManager();
	var dataUri = objReceivedMessageManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
};
/**
 * The purpose of this function is to return received message list against selected cell.
 * @returns received message list
 */
receivedMessage.prototype.getReceivedMessageList = function () {
	var listCount = uReceivedMessage.retrieveRecordCount();
	var objReceivedMessageManager = this.createReceivedMessageManager();
	var json = objReceivedMessageManager.query().top(listCount).orderby("__updated desc").run();
	//sessionStorage['receivedMessageData'] = JSON.stringify(json);
	return json;
};

/**
 * The purpose of this function is to create header for received message table
 */
receivedMessage.prototype.createHeaderForReceivedMsgTable = function() {
	var dynamicHeader = '';
	dynamicHeader += "<tr class='entityTableHead'>";
	dynamicHeader += "<th class='entityTableHeadChkBox dynamicRowReceivedMessage' style='padding-left:0px;width:23px'><input type='checkbox' onclick='uReceivedMessage.checkSelectAll(this);' class='checkBox cursorHand' id='chkSelectall'></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col17'><div class='entityHeadText' title='Status'>Status</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col18'><div class='entityHeadText' title='Type'>Type</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col1'><div class='entityHeadText' title='ID'>ID</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col2'><div class='entityHeadText' title='Created On'>Created On</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col3'><div class='entityHeadText' title='Updated On'>Updated On</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col4'><div class='entityHeadText' title='From'>From</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col5'><div class='entityHeadText' title='Box.Name'>Box.Name</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col6'><div class='entityHeadText' title='Metadata-Etag'>Metadata-Etag</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col7'><div class='entityHeadText' title='Metadata-Type'>Metadata-Type</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col8'><div class='entityHeadText' title='Metadata-URI'>Metadata-URI</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col9'><div class='entityHeadText' title='InReplyTo'>InReplyTo</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col10'><div class='entityHeadText' title='MulticastTo'>MulticastTo</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col12'><div class='entityHeadText' title='Title'>Title</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col13'><div class='entityHeadText dynamicRowReceivedMessage' title='Body'>Body</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col14'><div class='entityHeadText' title='Priority'>Priority</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col15'><div class='entityHeadText' title='RequestRelation'>RequestRelation</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col16'><div class='entityHeadText' title='RequestRelationTarget'>RequestRelationTarget</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader += "</tr>";
	$("#receivedMessageTable thead tr").remove();
	$("#receivedMessageTable thead ").append(dynamicHeader);
};

receivedMessage.prototype.checkAllReceivedMessage = function (chkBox) {
	var buttonId = '#btnDeleteReceivedMessage';
	objCommon.assignEntityCheckBoxSelect(chkBox, buttonId, '', 'chkBox', 49, document.getElementById("chkSelectall"));
	objCommon.showSelectedRow(document.getElementById("chkSelectall"),"row","rowid");
};
/**
 * The purpose of this function is to create rows for received message table
 * @param dynamicTable
 * @param status
 * @param id
 * @param publishedDate
 * @param updatedDate
 * @param from
 * @param boxName
 * @param metadata_etag
 * @param metadata_type
 * @param metadata_uri
 * @param inReplyTo
 * @param multicastTo
 * @param type
 * @param title
 * @param body
 * @param priority
 * @param requestRelation
 * @param requestRelationTarget
 * @param count
 * @returns
 */
receivedMessage.prototype.createRowsForReceivedMessageTable = function(
		dynamicTable, status, id, publishedDate, updatedDate, from, boxName,
		metadata_etag, metadata_type, metadata_uri, inReplyTo, multicastTo,
		type, title, body, priority, requestRelation, requestRelationTarget,
		count, receivedMessageRowCount) {
	var messageID = "'"+id+"'";
	dynamicTable += '<tr onclick="objCommon.rowSelect(this,' + "'rowid'" + ','
			+ "'chkBox'" + ',' + "'row'" + ',' + "'btnDeleteReceivedMessage'"
			+ ',' + "'chkSelectall'" + ','
			+ receivedMessageRowCount
			+ ','
			+ totalRecordsize
			+ ','
			+ "''"
			+ ','
			+ "''"
			+ ','
			+ "''"
			+ ','
			+ "''"
			+ ','
			+ "'receivedMessageTable'"
			+ ');"  name = "allrows" id = "rowid'
			+ receivedMessageRowCount
			+ '"><td style="width:1%"><input id =  "txtHiddenEtagId'
			+ receivedMessageRowCount
			+ '" value='
			+ metadata_etag
			+ ' type = "hidden" /><input title="'
			+ receivedMessageRowCount
			+ '" id = "chkBox'
			+ receivedMessageRowCount
			+ '" type = "checkbox" class = "case cursorHand regular-checkbox big-checkbox" name = "case" value="'
			+ id + '" /><label for="chkBox' + receivedMessageRowCount
			+ '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label title= '"
			+ status
			+ "' class='cursorPointer'>"
			+ status
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label title= '"
			+ type + "' class='cursorPointer'>" + type + "</label></div></td>";
	dynamicTable += '<td><div style="width:280px;" class = "mainTableEllipsis"><a id="receivedMessageIDLink'+receivedMessageRowCount+'" onclick = "uReceivedMessage.openMessageDetail('+messageID+');" href = "#"  title= '+id+' tabindex ="-1" style="outline:none">'+id+'</a></div></td>';
	dynamicTable += "<td ><div style='width:150px;'  class = 'mainTableEllipsis'><label  title= '"
			+ publishedDate
			+ "' class='cursorPointer'>"
			+ publishedDate
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ updatedDate
			+ "' class='cursorPointer'>"
			+ updatedDate
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:280px;' class = 'mainTableEllipsis'><label  title= '"
			+ from + "' class='cursorPointer'>" + from + "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ boxName
			+ "' class='cursorPointer'>"
			+ boxName
			+ "</label></div></td>";
	dynamicTable += "<td  id='etag"
			+ receivedMessageRowCount
			+ "'  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ metadata_etag + "' class='cursorPointer' id='lblEtag"+ receivedMessageRowCount
			+ "'>" + metadata_etag
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ metadata_type
			+ "' class='cursorPointer'>"
			+ metadata_type
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ metadata_uri
			+ "' class='cursorPointer'>"
			+ metadata_uri
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:200px;' class = 'mainTableEllipsis'><label  title= '"
			+ inReplyTo
			+ "' class='cursorPointer'>"
			+ inReplyTo
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ multicastTo
			+ "' class='cursorPointer'>"
			+ multicastTo
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ title
			+ "' class='cursorPointer'>"
			+ title
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:280px;' class = 'mainTableEllipsis'><label  title= '"
			+ body + "' class='cursorPointer'>" + body + "</label></div></td>";
	dynamicTable += "<td  ><div style='width:100px;' class = 'mainTableEllipsis'><label  title= '"
			+ priority
			+ "' class='cursorPointer'>"
			+ priority
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:280px;' class = 'mainTableEllipsis'><label  title= '"
			+ requestRelation
			+ "' class='cursorPointer'>"
			+ requestRelation
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:280px;' class = 'mainTableEllipsis'><label  title= '"
			+ requestRelationTarget
			+ "' class='cursorPointer'>"
			+ requestRelationTarget + "</label></div></td>";
	dynamicTable += "</tr>";
	return dynamicTable;
};

/**
 * Following method fetches all the received messages.
 */
receivedMessage.prototype.retrieveAllReceivedMessages = function () {
	var accessor = objCommon.initializeAccessor(getClientStore().baseURL, sessionStorage.selectedcell);
	var totalRecordCount = uReceivedMessage.retrieveRecordCount();
	var objReceivedMessageManager = this.createReceivedMessageManager();
	var dataUri = objReceivedMessageManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
};
/**
 * The purpose of this function is to create received message table
 */
receivedMessage.prototype.createReceivedMessageTable = function () {
	var token = getClientStore().token;
	sessionStorage.token = token;
	totalRecordsize = this.retrieveRecordCount();
	if (totalRecordsize == 0) {
		$('#receivedMessageTable tbody').empty();
		objCommon.displayEmptyMessageInGrid(getUiProps().MSG0316, "ReceivedMessage");
		$("#receivedMessageTable").css("overflow", "auto");
		$("#dvemptyTableMessage").css("margin-top", "7%");
		objCommon.disableButton('#btnDeleteReceivedMessage');
		$("#chkSelectall").attr('checked', false);
		$("#lblCheckSelectAllReceivedMessage").css('cursor','default');
		$("#receivedMessageTable").scrollLeft(0);
	} else {
		document.getElementById("dvemptyTableMessage").style.display = "none";
		var json = uReceivedMessage.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
		var enitreDataSet = this.retrieveAllReceivedMessages();
		uReceivedMessage.setReceivedMessageJson(enitreDataSet);
		var recordNo = 0;
		this.createChunkedReceivedMessageTable(json, recordNo);
		var tableID = $('#receivedMessageTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS, tableID, uReceivedMessage, json, this.createChunkedReceivedMessageTable, "ReceivedMessage");
		objCommon.checkCellContainerVisibility();
	}
};

/**
 * The purpose of this function is to initialize received message query text box with ReceivedMessage
 * key word or default text on the basis of record size.
 * @param recordSize
 */
receivedMessage.prototype.initializeTxtboxWithDefaultTextReceivedMessage = function (recordSize) {
	if (document.getElementById("dvRowCountReceivedMessage")!= undefined) {
	document.getElementById("dvRowCountReceivedMessage").style.display = "none";
	var input = document.getElementById("txtBoxQueryReceivedMessage");
	input.value = "/" + "ReceivedMessage";
	if (recordSize === 0) {
		input.value = "Type your query";
	}
	}
};

/**
 * The purpose of this function is to maintain grid default state when no messages 
 * is received
 */
receivedMessage.prototype.receivedMessageGridDefaultState = function () {
	$("#btnGridReceivedMessage").removeClass("odataNormalButtonBlue");
	$("#btnGridReceivedMessage").addClass("odataNormalButtonGrey");
	$("#btnGridReceivedMessage").attr("disabled",true);
	$("#btnRawReceivedMessage").attr("disabled",true);
	$("#btnGridReceivedMessage").addClass("cursorDefault");
	$("#btnRawReceivedMessage").addClass("cursorDefault");
	$("#btnGoReceivedMessage").removeClass("normalButtonBlue");
	$("#btnGoReceivedMessage").addClass("normalButtonBlueDisabledSentMessage");
	$('#txtBoxQueryReceivedMessage').attr('readonly','readonly');
};

/**
 * Teh purpose of thsi function is to implement chekck all functionality for
 * parent check box
 * @param cBox
 */
receivedMessage.prototype.checkSelectAll = function(cBox) {
	var buttonId = '#btnDeleteReceivedMessage';
	objCommon.checkBoxSelect(cBox, buttonId, '#btnEditAccount');
	objCommon.showSelectedRow(document.getElementById("chkSelectall"),"row","rowid");
	uReceivedMessage.selectChkBox();
};

/**
 * The purpose of this function is to return message detail in json format on the 
 * basis of message ID
 * @param messageID
 * @returns
 */
receivedMessage.prototype.getReceivedMessageDetail = function (messageID) {
	var cellName = sessionStorage.selectedcell;
	//var boxName = sessionStorage.boxName;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	var objReceivedMessageManager = new _pc.ReceivedMessageManager(accessor);
	var json = objReceivedMessageManager.retrieve(messageID);
	json = json.body;
	return json;
};

/**
 * The purpose of this function is to open message detail popup on click of meesage id from
 * grid table
 * @param messageID
 */
receivedMessage.prototype.openMessageDetail = function (messageID) {
	var messageStatus = null;
	var response = this.getReceivedMessageDetail(messageID);
	if (response == true ){
		messageStatus = 404;
	} 
	var jsonData = JSON.stringify(response, null, '\t');
	if (messageStatus == 404) {
		$("#textReceivedMessageDetail").val("Message Not Exist");
		openCreateEntityModal('#receivedMessageDetailPopUpModalWindow', '#receivedMessageDetailDialogBox', 'textReceivedMessageDetail');
		$("#textReceivedMessageDetail").scrollTop(0);
		$("#textReceivedMessageDetail").scrollLeft(0);
	} else {
		var jsonData1 = objCommon.syntaxHighlight(jsonData);
		$("#textReceivedMessageDetail").html(jsonData1);
		openCreateEntityModal('#receivedMessageDetailPopUpModalWindow', '#receivedMessageDetailDialogBox', 'textReceivedMessageDetail');
		$("#textReceivedMessageDetail").scrollTop(0);
		$("#textReceivedMessageDetail").scrollLeft(0);
		//$(".key").css('margin-left', '-40px');
	}
};

/**
 * The purpose of this function is to perform multiple delete operation for selected
 * message IDs
 */
receivedMessage.prototype.deleteMultipleReceivedMessages = function() {
	var selectedMessageDetails = this.getSelectedReceivedMessageDetail();
	var length = selectedMessageDetails.length;
	var etagIDOfPreviousRecord = "txtHiddenEtagId";
	var arrEtag = [];
	var etagValue = '';
	var tableID = $('#receivedMessageTable');
	var idCheckAllChkBox = "#chkSelectall";
	// if (!$("#chkSelectall").is(':checked')) {
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord,
				arrEtag, "#chkBox0");
	}
	for ( var i = 0; i < length; i++) {
		var messageID = selectedMessageDetails[i]["ID"];
		var etag = selectedMessageDetails[i]["ETAG"];
		this.deleteMessage(messageID, etag, i);
	}
	this.displayDeleteReceivedMessage();
	var type = "ReceivedMessage";
	var recordCount = uReceivedMessage.retrieveRecordCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, uReceivedMessage, isDeleted);
	$(idCheckAllChkBox).attr('checked', false);
};

/**
 * The purpose of this function is to return selected message detail from grid table
 * @returns {Array}
 */
receivedMessage.prototype.getSelectedReceivedMessageDetail = function() { 
	var receivedMessageDetail = [];
	//var pageNO = sessionStorage.selectedPageIndexBox;
	//if (pageNO == 1) {
		var noOfMessages = $("#receivedMessageTable tr").length - 1;
		for (var index = 0; index < noOfMessages; index++) {
			var body = {};
			if($("#chkBox"+index).is(":checked")){
				body["ID"] = document.getElementById("receivedMessageIDLink" + index).title;
				body["ETAG"] = document.getElementById("lblEtag" + index).title;
				receivedMessageDetail.push(body);	
			}
		}
	/*}else {
		var endIndex = (pageNO*50)-1;
		var startIndex= endIndex - 49;
		for (var index = startIndex; index < endIndex; index++) {
			var body = {};
			if($("#chkBox"+index).is(":checked")){
				body["ID"] = document.getElementById("receivedMessageIDLink" + index).title;
				body["ETAG"] = document.getElementById("etag" + index).title;
				receivedMessageDetail.push(body);	
			}
		}
	}*/
	return receivedMessageDetail;
};

/**
 * The purpose of this function is to perform delete operation for received message on the basis of
 * message ID
 * @param messageID
 * @param etag
 */
receivedMessage.prototype.deleteMessage = function(messageID, etag,count) {
	$('#rowCountReceivedMessageBlock').hide();
	var cellName = sessionStorage.selectedcell;
	var boxName = collectionPath;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var objReceivedMessageManager = new _pc.ReceivedMessageManager(accessor);
	var response = objReceivedMessageManager.del(messageID, etag);
	if (response.resolvedValue.status == 204) {
		isDeleted = true;
		sbSuccessfulReceivedMessage ++;
	} else if (response.errorMessage.status == 409) {
		arrDeletedConflictCount.push(count);
		sbConflictReceivedMessage ++;
	}
};

/**
 *The purpose of this function is display success/comflict message after delete operation 
 */
receivedMessage.prototype.displayDeleteReceivedMessage = function () {
	$('#receivedMessageDeleteModalWindow, .window').hide();
	var conflictReceivedMessageLength = 0;
	var successfulReceivedMessageLength = 0;
	successfulReceivedMessageLength = sbSuccessfulReceivedMessage;
	conflictReceivedMessageLength = sbConflictReceivedMessage;
	if(conflictReceivedMessageLength < 1 && successfulReceivedMessageLength > 0) {
		isDeleted = true;
		addSuccessClass('#receivedMessageIcon');
		$("#receivedMessageBlock").css("display", 'table');
		document.getElementById("receivedMessageSuccessmsg").innerHTML = successfulReceivedMessageLength+" " + getUiProps().MSG0346;
	} else if(successfulReceivedMessageLength < 1 && conflictReceivedMessageLength > 0) {
		isDeleted = false;
		addErrorClass('#receivedMessageIcon');
		$("#receivedMessageBlock").css("display", 'table');
		document.getElementById("receivedMessageSuccessmsg").innerHTML = conflictReceivedMessageLength+" " + getUiProps().MSG0347;
	} else if(conflictReceivedMessageLength > 0 && successfulReceivedMessageLength > 0 ) {
		isDeleted = true;
		addErrorClass('#receivedMessageIcon');
		$("#receivedMessageBlock").css("display", 'table');
		document.getElementById("receivedMessageBlock").innerHTML = successfulReceivedMessageLength+" " + getUiProps().MSG0323 + " " + (conflictReceivedMessageLength + successfulReceivedMessageLength)+" " + getUiProps().MSG0346;
	}	
	//this.createReceivedMessageTable();
	objCommon.centerAlignRibbonMessage("#receivedMessageBlock");
	objCommon.autoHideAssignRibbonMessage("receivedMessageBlock");
	sbSuccessfulReceivedMessage = 0;
	sbConflictReceivedMessage = 0;
};

/**
 * The purpose of this function is create raw view table for received message
 */
receivedMessage.prototype.getRawJSONViewReceivedMessage = function() {
	$('#btnDeleteReceivedMessage').attr('disabled', 'disabled');
	$('#btnDeleteReceivedMessage').addClass('deleteBtnDisabled');
	var json = "";
	if(typeof objCommon.dataSetProfile === "string"){
		json = JSON.parse(objCommon.dataSetProfile);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}else{
		json = objCommon.dataSetProfile;
	}
	var modCurrent = sessionStorage.selectedPageNoReceivedMessage % objCommon.maxNoOfPages;
	if(modCurrent === 0){
		modCurrent = objCommon.maxNoOfPages;
	}
	var recordCount = (modCurrent-1)*maxRowsForReceivedMessage;
	if (sessionStorage.totalRecordsOnReceivedMessage > 0) {
		uReceivedMessage.createChunkedReceivedMessageRawView(json, recordCount);
		$(".pagination").remove();
		objCommon.createPaginationView(sessionStorage.totalRecordsOnReceivedMessage, "",
				maxRowsForReceivedMessage, $("#receivedMessageRawTable"), "#resultPaneReceivedMessage", uReceivedMessage, json, uReceivedMessage.createChunkedReceivedMessageRawView, "receivedMessageRaw",
				sessionStorage.selectedPageNoReceivedMessage);
		var tableID = $("#receivedMessageRawTable");
		var totalPageNo = Math.ceil(sessionStorage.totalRecordsOnReceivedMessage / maxRowsForReceivedMessage);
		var selectedPageNo = sessionStorage.selectedPageNoReceivedMessage;
		uReceivedMessage.maintainPageState(selectedPageNo, tableID, maxRowsForReceivedMessage, totalPageNo);
	} else if (parseInt(sessionStorage.totalRecordsOnReceivedMessage) === 0) {
		$("#dvsReceivedMessageEmpty").show();
	}
};

/**
 * The purpose of this function is to maintain page state
 * @param pageNo
 * @param tableID
 * @param maxRows
 * @param totalPageNo
 */
receivedMessage.prototype.maintainPageState = function(pageNo, tableID, maxRows,
		totalPageNo) {
	if(pageNo === "" || pageNo === undefined){
		pageNo = 1;
	}
	var selectedPageIDNum = sessionStorage.selectedPageIDNumberReceivedMessage;
	if(selectedPageIDNum === "" || selectedPageIDNum === undefined){
		selectedPageIDNum = 1;
	}
	for(var index = 1; index <= objCommon.maxNoOfPages; index++){
		var pageVal = parseInt(index)+parseInt(pageNo)-parseInt(selectedPageIDNum);
		$("#page"+index).val(parseInt(pageVal));
	}
	$('#page' + selectedPageIDNum).siblings().removeClass('paginationButSelect');
	$('#page' + selectedPageIDNum).siblings().css('cursor', 'pointer');
	$('#page' + selectedPageIDNum).addClass('paginationButSelect');
	$('#page' + selectedPageIDNum).css('cursor', 'default');
	
	if (pageNo == 1) {
		$('#prev').addClass('disabled');
		$('#prev').addClass('prevDisable');
		$('#prev').css('cursor', 'default');
		$("#prev").attr("disabled","disabled");
		$('#next').removeClass('disabled');
		$('#next').removeClass('nextDisable');
		$('#next').css('cursor', 'pointer');
		$("#next").attr("disabled",false);
		if (pageNo == totalPageNo) {
			$('#next').addClass('disabled');
			$('#next').addClass('nextDisable');
			$('#next').css('cursor', 'default');
			$("#next").attr("disabled","disabled");
		}
	} else {
		$('#prev').removeClass('disabled');
		$('#prev').removeClass('prevDisable');
		$('#prev').css('cursor', 'pointer');
		$("#prev").attr("disabled",false);
		if (pageNo == totalPageNo) {
			$('#next').addClass('disabled');
			$('#next').addClass('nextDisable');
			$('#next').css('cursor', 'default');
			$("#next").attr("disabled","disabled");
		}
	}
};

/**
 * The purpose of this function is to hide grid view on click of raw button
 */
receivedMessage.prototype.clickRawTabReceivedMessage = function() {
	document.getElementById("dvReceivedMessageTable").style.display = "none";
	document.getElementById("dvReceivedMessageRawTable").style.display = "block";
	this.disableButtonsForRawView();
	this.saveSelectedPage("grid");
	if(sessionStorage.receivedMessageView === "receivedMessageQuery"){
		var json = sessionStorage.queryDataReceivedMessage;
		if(json != ""){
			json = JSON.parse(sessionStorage.queryDataReceivedMessage);
		}
		uReceivedMessage.createRawQueryResponseTable(json, true);
	}else if(sessionStorage.receivedMessageView === "receivedMessageGrid"){
		this.getRawJSONViewReceivedMessage();
		var selectedIndex = this.getSelectedRowIndexInGridView();
		this.highlightRowInRawView(selectedIndex);
	}
};

/**
 * The purpose of this function is to disable button for raw view
 */
receivedMessage.prototype.disableButtonsForRawView = function() {
	$("#btnGridReceivedMessage").removeClass("odataNormalButtonBlue");
	$("#btnGridReceivedMessage").addClass("odataNormalButtonGrey");
	$("#btnRawReceivedMessage").removeClass("odataNormalButtonGrey");
	$("#btnRawReceivedMessage").addClass("odataNormalButtonBlue");
};
/**
 * The purpose of this function is to disable button for grid view
 */
receivedMessage.prototype.disableButtonsForGridView = function() {
	$("#btnRawReceivedMessage").removeClass("odataNormalButtonBlue");
	$("#btnRawReceivedMessage").addClass("odataNormalButtonGrey");
	$("#btnGridReceivedMessage").removeClass("odataNormalButtonGrey");
	$("#btnGridReceivedMessage").addClass("odataNormalButtonBlue");
};

/**
 * The purpose of this function is to save select page state form grid table
 * @param mode
 */
receivedMessage.prototype.saveSelectedPage = function(mode) {
	
	var totalPageNo = Math.ceil(sessionStorage.totalRecordsOnReceivedMessage / maxRowsForReceivedMessage);
	var selectedPageNo = 0;
	var selectedPageIDNumber = 0;
	for(var index = 1; index <= objCommon.maxNoOfPages; index++){
		if($("#page"+index).hasClass("paginationButSelect")){
			selectedPageNo = parseInt($("#page"+index).val());
			selectedPageIDNumber = index;
			break;
		}
	}
	if (totalPageNo == 1) {
		selectedPageNo = 1;
		selectedPageIDNumber = 1;
	}
	sessionStorage.selectedPageNoReceivedMessage = selectedPageNo;
	sessionStorage.selectedPageIDNumberReceivedMessage = selectedPageIDNumber;
};

/**
 * The purpose of this function is to return selected row index  
 * @returns {Array}
 */
receivedMessage.prototype.getSelectedRowIndexInGridView = function() {
	var pageNO = sessionStorage.selectedPageIndexBox;
	var gridViewSelection = [];
	if (pageNO == 1) {
		var noOfmsgSelecttion = $("#receivedMessageTable tr").length - 1;
		for (var index = 0; index < noOfmsgSelecttion; index++) {
			if($("#chkBox"+index).is(":checked")){
				gridViewSelection.push(index);	
			}
		}
	}else {
		var endIndex = (pageNO*50)-1;
		var startIndex= endIndex - 49;
		for (var index = startIndex; index < endIndex; index++) {
			if($("#chkBox"+index).is(":checked")){
				gridViewSelection.push(index);	
			}
		}
	}
	return gridViewSelection;
};

/**
 * The purpose of this function is to highlight selected row
 * @param arrSelectedIndex
 */
receivedMessage.prototype.highlightRowInRawView = function(arrSelectedIndex) {
	for (var i = 0; i <arrSelectedIndex.length; i++) {
		var x = arrSelectedIndex[i];
		$("#rawViewRow"+x).addClass('selectRow');
	}
};

/**
 * The purpose of this function is to check ATOM format for entered query
 * @returns {Boolean}
 */
receivedMessage.prototype.checkAtomFormat = function () {
	//var displayErrorMessage = "";
	var xmlNotSupportedMessage = getUiProps().MSG0132;
	if (sessionStorage.queryType === "$format=atom") {
		if (uReceivedMessage.isGridSelected()) {
		this.displayErrorNotification(xmlNotSupportedMessage);
		return false;
		}
		uReceivedMessage.displayErrorRawView(xmlNotSupportedMessage);
		return false;
	}
};

/**
 * The purpose of thsi function is to perform query operation on click of GO button
 * @returns {Boolean}
 */
receivedMessage.prototype.processQuery = function() {
	$('#rowCountReceivedMessageBlock').hide();
	// jquery1_5_2('#receivedMessageTable').fixedHeaderTable('destroy');
	// showSpinner("modalSpinnerReceivedMessage");
	errorReceivedMsgQuery.innerHTML = "";
	var validMessage = getUiProps().MSG0125;
	var entityNameMessage = getUiProps().MSG0188;
	// document.getElementById("dvRowCountReceivedMessage").style.display =
	// "none";
	var queryString = $("#txtBoxQueryReceivedMessage").val();
	if (queryString == "/ReceivedMessage") {
		// removeSpinner("modalSpinnerReceivedMessage");
		this.createReceivedMessageTable();
		return false;
	}
	// var isGridBtnSelected =
	// $("#btnGridReceivedMessage").hasClass("odataGridIconSelected");
	// var isRawBtnSelected =
	// $("#btnRawReceivedMessage").hasClass("odataRawIconSelected");
	var messageKeyWordFromQueryString = this.validateQueryString(queryString);
	var isFormatAtom = this.checkAtomFormat();
	if (isFormatAtom === false) {
		sessionStorage.queryType = "";
		// removeSpinner("modalSpinnerReceivedMessage");
		return false;
	}
	var isExpandQuery = this.checkExpandQuery();
	if (isExpandQuery === false) {
		sessionStorage.selectQueryType = "";
		// removeSpinner("modalSpinnerReceivedMessage");
		return false;
	}
	var isFilterQuery = this.checkFilterQuery();
	if (isFilterQuery === false) {
		sessionStorage.selectQueryType = "";
		// removeSpinner("modalSpinnerReceivedMessage");
		return false;
	}

	var isFullTextSearchQuery = this.checkFullTextSearchQuery();
	if (isFullTextSearchQuery === false) {
		sessionStorage.selectQueryType = "";
		// removeSpinner("modalSpinnerReceivedMessage");
		return false;
	}
	var entityTypeName = "ReceivedMessage";
	if (messageKeyWordFromQueryString === entityTypeName) {
		var responseStatus = null;
		var response = this.retrieveAPIResponse(queryString);
		if (response != 400 && response != 404) {
			inlineResponse = response.bodyAsJson().d;
			// sessionStorage.recordCountReceivedMessage =
			// inlineResponse.__count;
			responseStatus = response.getStatusCode();
		}
		if (response === 400 || response === 404) {
			errorReceivedMsgQuery.innerHTML = validMessage;
		}
		if (responseStatus === 200) {
			$("#dvErrorMessage").hide();
			var json = response.bodyAsJson().d.results;
			uReceivedMessage.setReceivedMessageJson(json);
			// sessionStorage['receivedMessageData'] = JSON.stringify(json);
			//uReceivedMessage.createReceivedMessageTableQuery(json.length, json);
			if (json === null) {
				errorReceivedMsgQuery.innerHTML = validMessage;
			}
			if (uReceivedMessage.isRawViewSelected()) {
				var receivedMessageDataSet = JSON.stringify(json);
				uReceivedMessage.rawIconClick(receivedMessageDataSet,
						json.length);
				// sessionStorage.receivedMessageView = "receivedMessageQuery";
				// this.createRawQueryResponseTable(json, false);
				}
			if (uReceivedMessage.isGridSelected()) {
				uReceivedMessage.createReceivedMessageTableQuery(json.length,
						json);
				// sessionStorage.receivedMessageView = "receivedMessageQuery";
				// this.checkQueryType(json, false, inlineResponse);
				// sessionStorage.selectQueryType = "";
			}
			var INLINECOUNTQUERY = "$inlinecount=allpages";
			if (sessionStorage.queryType === INLINECOUNTQUERY) {
				this.showInlineCount(uReceivedMessage.retrieveRecordCount());
			}
		}
	} else if (messageKeyWordFromQueryString === undefined) {
		$("#dvErrorMessage").show();
		errorReceivedMsgQuery.innerHTML = validMessage;
		// removeSpinner("modalSpinnerReceivedMessage");
	} else if (messageKeyWordFromQueryString != entityTypeName) {
		$("#dvErrorMessage").show();
		var query = messageKeyWordFromQueryString.indexOf("?");
		var query1 = messageKeyWordFromQueryString.indexOf("$");
		if (query === -1 && query1 != -1) {
			errorReceivedMsgQuery.innerHTML = validMessage;
		} else if (query === -1 && query1 === -1) {
			errorReceivedMsgQuery.innerHTML = entityNameMessage;
		}
	} else {
		$("#dvErrorMessage").show();
		errorReceivedMsgQuery.innerHTML = entityNameMessage;
	}
	// jquery1_5_2('#receivedMessageTable').fixedHeaderTable({ fixedColumn: true
	// });
	// uReceivedMessage.applyFixedColumnStyleSheet();
	// removeSpinner("modalSpinnerReceivedMessage");
};

/**
 * The purpose of this function is to validate query string entered in text box.
 * @param queryString
 * @returns {String}
 */
receivedMessage.prototype.validateQueryString = function (queryString) {
	var validMessage = getUiProps().MSG0125;
	var messageKeyWordFromQueryString = "";
	var query = queryString.indexOf("?");
	var isDollarSign = queryString.substring(query+1, query+2);
	if (query != -1) {
		if (isDollarSign === null || isDollarSign === "" || isDollarSign === "q") {
			messageKeyWordFromQueryString=  this.getMessageKeyWordFromQueryString(queryString);
			return messageKeyWordFromQueryString;
		} else if (isDollarSign === "$") {
			messageKeyWordFromQueryString=  this.getMessageKeyWordFromQueryString(queryString);
			return messageKeyWordFromQueryString;
		} else {
			errorReceivedMsgQuery.innerHTML = validMessage;
		}
	} else if (query == -1 && isDollarSign!="/") {
		messageKeyWordFromQueryString=  this.getMessageKeyWordFromQueryString(queryString);
		return messageKeyWordFromQueryString;
	} else {
		errorReceivedMsgQuery.innerHTML = validMessage;
	}
};


/**
 * The purpose of this function is to extract sentMessage kewword from entered query string.
 * @param queryString
 * @returns {String}
 */
receivedMessage.prototype.getMessageKeyWordFromQueryString = function (queryString) {
	var ISSELECT= "$select";
	var messageKeyWordFromQueryString = "";
	var query = queryString.indexOf("?");
	if (query != -1) {
		var arrEntityName = queryString.split('?');	
		sessionStorage.queryType = arrEntityName[1];
		var arrSelectQuery = arrEntityName[1].split('=');
		sessionStorage.selectQueryType = arrSelectQuery[0].replace(/\s+/g, '');
		if (arrSelectQuery[0] === ISSELECT) {
			var selectQueryParameterList = arrSelectQuery[1].replace(/\s+/g, '');
			if (selectQueryParameterList.indexOf("&") != -1) {
				var index = selectQueryParameterList.indexOf("&");
				selectQueryParameterList = selectQueryParameterList.substring(0, index);
			}
			sessionStorage.selectQueryParameterList = selectQueryParameterList;
		}
		messageKeyWordFromQueryString = arrEntityName[0].split('/');
		messageKeyWordFromQueryString = messageKeyWordFromQueryString[1];
	} else {
		messageKeyWordFromQueryString = queryString.split('/');
		messageKeyWordFromQueryString = messageKeyWordFromQueryString[1];
	}
	return messageKeyWordFromQueryString;
};

/**
 * The purpose of this query is to check expand query from entererd query
 * @returns {Boolean}
 */
receivedMessage.prototype.checkExpandQuery = function () {
	var ISEXPAND = "$expand"; 
	var expandNotSupportedMessage = getUiProps().MSG0183;
	if (sessionStorage.selectQueryType === ISEXPAND) {
		$("#dvErrorMessage").show();
		errorReceivedMsgQuery.innerHTML = expandNotSupportedMessage;
		return false;
	}
};

/**
 * The purpose of this function is check filter query from entered query
 * @returns {Boolean}
 */
receivedMessage.prototype.checkFilterQuery = function () {
	var ISFILTER = "$filter"; 
	var filterNotSupportedMessage = getUiProps().MSG0184;
	if (sessionStorage.selectQueryType === ISFILTER) {
		$("#dvErrorMessage").show();
		errorReceivedMsgQuery.innerHTML = filterNotSupportedMessage;
		return false;
	}
};

/**
 * The purpose of this function is to check fullTExt query option from eneterd query string 
 * @returns {Boolean}
 */
receivedMessage.prototype.checkFullTextSearchQuery = function () {
	var ISFULLTEXT = "q"; 
	var fullTextSearchNotSupportedMessage = getUiProps().MSG0185;
	if (sessionStorage.selectQueryType === ISFULLTEXT) {
		$("#dvErrorMessage").show();
		errorReceivedMsgQuery.innerHTML = fullTextSearchNotSupportedMessage;
		return false;
	}
};

/**
 * The purpose of this function is to return API response on the 
 * basis of query string 
 * @param queryString
 * @returns
 */
receivedMessage.prototype.retrieveAPIResponse = function (queryString) {
	var cellName = sessionStorage.selectedcell;
	var baseUrl = getClientStore().baseURL;
	var path = sessionStorage.selectedcellUrl + "__ctl";
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	path += queryString; 
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = null;
	try {
		response = restAdapter.get(path, "application/json", "*");
	} catch (exception) {
		response = exception.getCode();
		if (JSON.stringify(response).indexOf("400") != -1) {
			response = 400;
		} else if (JSON.stringify(response).indexOf("404") != -1) {
			response = 404;
		}
	}
	return response;
};

/**
 * The purpose of this function is to craete raw view after query operation.
 * @param json
 */
receivedMessage.prototype.createRawQueryResponseTable = function (json, toggleMode) {
	$('#btnDeleteReceivedMessage').attr('disabled', 'disabled');
	$('#btnDeleteReceivedMessage').addClass('deleteBtnDisabled');
	sessionStorage.queryDataReceivedMessage = JSON.stringify(json);
	var recordSize = json.length;
	var INLINECOUNTQUERY = "$inlinecount=allpages";
	var noDataMessage = getUiProps().MSG0131;
	if (recordSize > 0) {
		if (sessionStorage.queryType === INLINECOUNTQUERY) {
			$('#rowInlinecountID').html(sessionStorage.recordCountReceivedMessage);
			document.getElementById("dvRowCountReceivedMessage").style.display = "block";
		}
		if(toggleMode){
			recordCount = (parseInt(sessionStorage.selectedPageNoReceivedMessage)-1)*maxRowsForReceivedMessage;
			if(recordCount < 0){
				recordCount = 0;
			}
		}else{
			recordCount = 0;
		}
		uReceivedMessage.createChunkedRawQueryReceivedMessageTable(json, recordCount);
		$(".pagination").show();
		$(".pagination").remove();
		uOdataQuery.createPagination(recordSize, "",
				maxRowsForReceivedMessage, $("#receivedMessageRawTable"), "#resultPaneReceivedMessage", json, "", "", uReceivedMessage.createChunkedRawQueryReceivedMessageTable,
				"ReceivedMessage");
		if(toggleMode){
			var tableID = $("#receivedMessageRawTable");
			var totalPageNo = Math.ceil(recordSize / maxRowsForReceivedMessage);
			var selectedPageNo = sessionStorage.selectedPageNoReceivedMessage;
			uReceivedMessage.maintainPageState(selectedPageNo, tableID, maxRowsForReceivedMessage, totalPageNo);
		}
	} else if (recordSize === 0) {
		var noDataRawView = "<tr><td style='border:none;'><div id='dvNoEntityCreated' class='dvNoDataJsonView'>"
				+ noDataMessage + "</div></td></tr>";
		$("#receivedMessageRawTable tbody").html(noDataRawView);
	}
	//jquery1_5_2('#receivedMessageTable').fixedHeaderTable({ altClass: 'odd', footer: false, cloneHeadToFoot: false, fixedColumns: 0 });
};

/**
 * The purpose of this function is to check query type from entered query string
 * @param json
 * @param inlineResponse
 */
receivedMessage.prototype.checkQueryType = function(json, toggleMode,
		inlineResponse) {
	var recordSize = json.length;
	var headerList = "";
	var SELECTQUERY = "$select";
	var SELECTALLQUERY = "$select=*";
	var INLINECOUNTQUERY = "$inlinecount=allpages";
	var noDataMessage = getUiProps().MSG0131;
	sessionStorage.queryDataReceivedMessage = JSON.stringify(json);
	if (sessionStorage.selectQueryParameterList != undefined
			&& sessionStorage.selectQueryType === SELECTQUERY) {
		if (sessionStorage.queryType === SELECTALLQUERY) {
			this.createReceivedMessageTable();
		} else {
			var selectQueryParameterList = sessionStorage.selectQueryParameterList;
			headerList = new Array();
			var arrSelectQueryParameterList = selectQueryParameterList
					.split(',');
			for ( var count = 0; count < arrSelectQueryParameterList.length; count++) {
				if (arrSelectQueryParameterList[count] == "From"
						|| arrSelectQueryParameterList[count] == "InReplyTo"
						|| arrSelectQueryParameterList[count] == "MulticastTo"
						|| arrSelectQueryParameterList[count] == "Type"
						|| arrSelectQueryParameterList[count] == "Title"
						|| arrSelectQueryParameterList[count] == "Body"
						|| arrSelectQueryParameterList[count] == "Priority"
						|| arrSelectQueryParameterList[count] == "RequestRelation"
						|| arrSelectQueryParameterList[count] == "RequestRelationTarget"
						|| arrSelectQueryParameterList[count] == "Status") {
					headerList.push(arrSelectQueryParameterList[count]);
				} /*else {

				}*/
			}
			this.createdynamicGridTable(json, headerList);
		}
	} else if (sessionStorage.queryType === INLINECOUNTQUERY) {
		var inlineCount = 0;
		if (inlineResponse != undefined) {
			inlineCount = inlineResponse.__count;
		}
		sessionStorage.recordCountReceivedMessage = inlineCount;
		// $('#rowInlinecountID').html(inlineCount);
		// document.getElementById("dvRowCountReceivedMessage").style.display =
		// "block";
		this.createGridQueryResponseTable(json, toggleMode);
	} else {
		if (recordSize > 0) {
			this.createGridQueryResponseTable(json, toggleMode);
		} else {
			var noOfCols = 6;
			var noDataRow = "<tr><td colspan='"
					+ noOfCols
					+ "' style='border:none;'><div id='dvNoEntityCreated' class='noEntityCreated'>"
					+ noDataMessage + "</div></td></tr>";
			$("#receivedMessageTable tbody").html(noDataRow);
		}
	}
};

/**
 * The purpose of this function is to create dynamic table after select query operation.
 * @param json
 * @param headerList
 */
receivedMessage.prototype.createdynamicGridTable = function(json, headerList){
	//jquery1_5_2('#receivedMessageTable').fixedHeaderTable('destroy');
	var jsonLength = json.length;
	var dynamicTable = '';
	var recordSize = jsonLength;
	totalRecordsize = recordSize;
	$(".dynamicRowReceivedMessage").remove();
	for(var count = 0; count < jsonLength; count++) {
		var obj = json[count];
		var id = obj.__id;
		var publishedDate = objCommon.convertEpochDateToReadableFormat(obj["__published"]);
		var updatedDate = objCommon.convertEpochDateToReadableFormat(obj["__updated"]);
		var metadata_etag = obj["__metadata"]["etag"];
		var metadata_type = obj["__metadata"]["type"];
		var metadata_uri = obj["__metadata"]["uri"];
		//dynamicTable += '<tr class = "dynamicRowReceivedMessage" name="allrows" id="rowid'+count+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteReceivedMessage'" +','+ "'chkSelectall'" +','+ count +',' + totalRecordsize + ');">';
		dynamicTable += '<tr class = "dynamicRowReceivedMessage" name="allrows" id="rowid'+count+'" onclick="uReceivedMessage.rowSelect('+ count + ');">';
		var messageID = "'"+id+"'";
		dynamicTable += '<td><input id="chkBox'+count+'" type="checkbox" class="case cursorHand" name="case" value="'+id+'" onclick="uReceivedMessage.rowSelect('+ count + ');"/></td>'; 
		dynamicTable += '<td name = "acc"><a id="receivedMessageIDLink'+count+'" href ="#" class="roleNameLink" title= "'+id+'" onclick = "uReceivedMessage.openMessageDetail('+messageID+');">'+id+'</a></td>';
		dynamicTable += "<td>"+publishedDate+"</td>";
		dynamicTable += "<td>"+updatedDate+"</td>";
		dynamicTable += "<td id='etag"+count+"' title= '"+metadata_etag+"'>"+metadata_etag+"</td>";
		dynamicTable += "<td title= '"+metadata_type+"'>"+metadata_type+"</td>";
		dynamicTable += "<td title= '"+metadata_uri+"'>"+metadata_uri+"</td>";
		for (var i = 0; i< headerList.length; i++) {
			dynamicTable += "<td title= '"+obj[headerList[i]]+"'>"+obj[headerList[i]]+"</td>";
		}
		dynamicTable += "</tr>";
	}
	this.createHeaderForSelectQuery(headerList);
	$("#receivedMessageTable tbody").append(dynamicTable);
	$("#receivedMessageTable tbody tr:odd").css("background-color", "#F4F4F4");
	$(".pagination").remove();
	objCommon.createPagination(recordSize, "",
			maxRowsForReceivedMessage, $("#receivedMessageTable"), "#resultPaneReceivedMessage");
	sessionStorage.selectedPageNoReceivedMessage = "";
};

/**
 * The purpose of this function is to create dynamic header on the basis of select query.
 * @param headerList
 */
receivedMessage.prototype.createHeaderForSelectQuery = function(headerList){
	var dynamicHeader ="";
	dynamicHeader += "<tr class='entityTableHead'>";
	dynamicHeader += "<th class='entityTableHeadChkBox dynamicRowReceivedMessage' style='padding-left:0px;width:23px'><input type='checkbox' onclick='uReceivedMessage.checkSelectAll(this);' class='checkBox cursorHand' id='chkSelectall'></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col1'><div class='entityHeadText' title='ID'>ID</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col2'><div class='entityHeadText' title='Created On'>Created On</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col3'><div class='entityHeadText' title='Updated On'>Updated On</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col6'><div class='entityHeadText' title='Metadata-Etag'>Metadata-Etag</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col7'><div class='entityHeadText' title='Metadata-Type'>Metadata-Type</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div class = 'col8'><div class='entityHeadText' title='Metadata-URI'>Metadata-URI</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	var noOfHeaders = headerList.length;
	for ( var index = 0; index < noOfHeaders; index++) {
		var dynWidth = 0;
		if(headerList[index][0].length > 8){
			dynWidth = (headerList[index].length * 8) + 40;
		} else{
			dynWidth = (headerList[index].length * 10) + 40;
		}
		dynamicHeader = dynamicHeader
				+ "<th class='entityTableColHead dynamicRowReceivedMessage'><div style='min-width:"+ dynWidth +"px'><div id='propText_" + index
				+ "' class='entityHeadText' title='"
				+ headerList[index] + "'>" + headerList[index]
				+ "</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	}
	dynamicHeader += "</tr>";
	$("#receivedMessageTable thead tr").remove();
	$("#receivedMessageTable thead").append(dynamicHeader);
};

/**
 * The purpose of this function is to create grid table after query operation
 * @param json
 */
receivedMessage.prototype.createGridQueryResponseTable = function (json, toggleMode) {
	//jquery1_5_2('#receivedMessageTable').fixedHeaderTable('destroy');
	$('#btnDeleteReceivedMessage').attr('disabled', 'disabled');
	$('#btnDeleteReceivedMessage').addClass('deleteBtnDisabled');
	$("#btnGridReceivedMessage").removeClass("odataNormalButtonGrey");
	$("#btnGridReceivedMessage").addClass("odataNormalButtonBlue");
	$(".dynamicRowReceivedMessage").remove();
	$('#receivedMessageHeader').removeClass('displayNone');
	var recordSize = 0;
	if(toggleMode){
		recordSize = (parseInt(sessionStorage.selectedPageNoReceivedMessage)-1)*maxRowsForReceivedMessage;
	}
	uReceivedMessage.createChunkedGridQueryReceivedMessageTable(json, recordSize);
	$(".pagination").remove();
	uOdataQuery.createPagination(json.length, "",
			maxRowsForReceivedMessage, $("#receivedMessageTable"), "#resultPaneReceivedMessage", json, "", "", uReceivedMessage.createChunkedGridQueryReceivedMessageTable,"ReceivedMessage");
	//sessionStorage.selectedPageNoSentMessage = "";
	//jquery1_5_2('#receivedMessageTable').fixedHeaderTable({ altClass: 'odd', footer: false, cloneHeadToFoot: false, fixedColumns: 0 });
	if(toggleMode){
		var totalPageNo = Math.ceil(json.length / maxRowsForReceivedMessage);
		var selectedPageNo = sessionStorage.selectedPageNoReceivedMessage;
		uReceivedMessage.maintainPageState(selectedPageNo, "",
				maxRowsForReceivedMessage, totalPageNo);
	}
};

/**
 * The purpose of this method is to create Received Message table Grid view as per pagination.
 * @param json
 * @param recordSize
 */
receivedMessage.prototype.createChunkedReceivedMessageTable = function(json, recordSize){
	$('#chkSelectall').attr('checked', false);
	$("#receivedMessageTable").scrollLeft(0);
	$("#receivedMessageTable tbody").scrollTop(0);
	objCommon.disableButton('#btnDeleteReceivedMessage');
	var dynamicTable = "";
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
			if(typeof json === "string"){
				json = JSON.parse(json);
			}
		}
	}
	var jsonLength = json.length;
	var maxLimit = (maxRowsForReceivedMessage+recordSize) < (jsonLength) ? (maxRowsForReceivedMessage+recordSize) : jsonLength;
	var receivedMessageRowCount = 0;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var status = obj.Status;
		var type = obj.Type; 
		var id = obj.__id;
		var publishedDate = objCommon.convertEpochDateToReadableFormat(obj["__published"]);
		var updatedDate = objCommon.convertEpochDateToReadableFormat(obj["__updated"]);
		var from = obj["From"];
		var boxName = obj["_Box.Name"];
		var metadata_etag = obj["__metadata"]["etag"];
		var metadata_type = obj["__metadata"]["type"];
		var metadata_uri = obj["__metadata"]["uri"];
		var inReplyTo = obj["InReplyTo"];
		var multicastTo = obj["MulticastTo"];
		var title = obj["Title"];
		var body = obj["Body"];
		var priority = obj["Priority"];
		var requestRelation = obj["RequestRelation"];
		var requestRelationTarget = obj["RequestRelationTarget"];
		//dynamicTable += '<tr class = "dynamicRowReceivedMessage" name="allrows" id="rowid'+count+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteReceivedMessage'" +','+ "'chkSelectall'" +','+ count +',' + totalRecordsize + ');">';
		/*dynamicTable += '<tr class = "dynamicRowReceivedMessage" name="allrows" id="rowid'
				+ count
				+ '" onclick="uReceivedMessage.rowSelect('
				+ count
				+ ');">';*/
		dynamicTable = uReceivedMessage.createRowsForReceivedMessageTable(
				dynamicTable, status, id, publishedDate, updatedDate, from,
				boxName, metadata_etag, metadata_type, metadata_uri, inReplyTo,
				multicastTo, type, title, body, priority, requestRelation,
				requestRelationTarget, count, receivedMessageRowCount);
		receivedMessageRowCount++;
	}
	$("#receivedMessageTable tbody").html(dynamicTable);
	if (jsonLength > 0) {
		$("#receivedMessageTable thead tr").addClass('mainTableHeaderRow');
		//$("#receivedMessageTable tbody").addClass('mainTableTbody');
	}
	/*setTimeout(function() {
		applyScrollCssOnReceivedMessageGrid();	
		}, 300);*/
};
/*function applyScrollCssOnReceivedMessageGrid() {
	var tbodyObject = document.getElementById("entityGridTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#receivedMessageTable td:eq(2)").css("width", '32.3%');
	}
}*/


/**
 * The purpose of this method is to create Received Message Raw view as per pagination.
 * @param json
 * @param recordSize
 */
receivedMessage.prototype.createChunkedReceivedMessageRawView = function(json, recordSize){
	var dynamicRow = "";
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	for ( var count = 0; count < recordSize; count++) {
		var obj = json[count];
		dynamicRow += "<tr id='rawViewRow"+count+"'><td><pre class='prettyprint'><div >" + objCommon.syntaxHighlight(obj)
		+ "</div></pre></td></tr>";
	}
	$("#receivedMessageRawTable tbody").html(dynamicRow);
};

/**
 * The purpose of this method is create Grid mode Query result view as per pagination.
 * @param json
 * @param recordSize
 */
receivedMessage.prototype.createChunkedGridQueryReceivedMessageTable = function(json, recordSize){
	var dynamicTable = "";
	var maxLimit = (maxRowsForReceivedMessage+recordSize) < (json.length) ? (maxRowsForReceivedMessage+recordSize) : json.length;
	var totalRecordsize = json.length;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var status = obj.Status;
		var type = obj.Type;
		var id = obj.__id;
		var publishedDate = objCommon.convertEpochDateToReadableFormat(obj["__published"]);
		var updatedDate = objCommon.convertEpochDateToReadableFormat(obj["__updated"]);
		var from = obj["From"];
		var boxName = obj["_Box.Name"];
		var metadata_etag = obj["__metadata"]["etag"];
		var metadata_type = obj["__metadata"]["type"];
		var metadata_uri = obj["__metadata"]["uri"];
		var inReplyTo = obj["InReplyTo"];
		var multicastTo = obj["MulticastTo"];
		var title = obj["Title"];
		var body = obj["Body"];
		var priority = obj["Priority"];
		var requestRelation = obj["RequestRelation"];
		var requestRelationTarget = obj["RequestRelationTarget"];
		//dynamicTable += '<tr class = "dynamicRowReceivedMessage" name="allrows" id="rowid'+count+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteReceivedMessage'" +','+ "'chkSelectall'" +','+ count +',' + totalRecordsize + ');">';
		dynamicTable += '<tr class = "dynamicRowReceivedMessage" name="allrows" id="rowid'+count+'" onclick="uReceivedMessage.rowSelect('+ count + ');">';
		dynamicTable = uReceivedMessage.createRowsForReceivedMessageTable(dynamicTable, status, id, publishedDate, updatedDate, from, boxName, metadata_etag, metadata_type, metadata_uri, inReplyTo, multicastTo, type, title, body, priority, requestRelation, requestRelationTarget, count);
	}
	//uReceivedMessage.createHeaderForReceivedMsgTable();
	//$("#receivedMessageTable tbody").append(dynamicTable);
	//$("#receivedMessageTable tbody tr:odd").css("background-color", "#F4F4F4");
};

/**
 * The purpose of this method is to create Raw mode Query result view as per pagination.
 * @param json
 * @param recordSize
 */
receivedMessage.prototype.createChunkedRawQueryReceivedMessageTable = function(json, recordSize){
	var dynamicRow = "";
	var maxLimit = (maxRowsForReceivedMessage+recordSize) < (json.length) ? (maxRowsForReceivedMessage+recordSize) : json.length;
	for ( var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		dynamicRow += "<tr id='rawViewRow"+count+"'><td class='jsonRawViewReceivedMessageTable'>" + JSON.stringify(obj)
				+ "</td></tr>";
	}
	$("#receivedMessageRawTable tbody").html(dynamicRow);
};

/**
 * Teh purpose of this function is to implement select row functionality 
 * @param rowNumber
 */
receivedMessage.prototype.rowSelect = function(rowIndex) {
	objCommon.rowSelect(this,'rowid', 'chkBox','row','btnDeleteReceivedMessage','chkSelectall', rowIndex, totalRecordsize);
	uReceivedMessage.selectChkBox();
};

receivedMessage.prototype.selectChkBox = function() {
	$('.fht-fixed-column .fht-tbody tr').removeClass('checkRow');
	for (var intCount= 0; intCount < totalRecordsize; intCount++) {
		if ($('#chkBox' + intCount).is(':checked')) {
			$('.fht-fixed-column .fht-tbody tr').eq(intCount).addClass('checkRow');
		}
	}
};


/* Apply the Stylesheet on Fixed column*/
receivedMessage.prototype.applyFixedColumnStyleSheet = function () {
	$('.fht-fixed-column input[type=checkbox]').css('margin-left','11px');
	$('.fht-fixed-column tr').css('height', '26px');
	$('.fht-fixed-column td').css('height', '26px');
	$('.fht-fixed-column td').css('border', '1px solid #dfdfdf');
	$('.fht-fixed-column tbody td').css('border','1px solid #dfdfdf');
	$('.fht-fixed-column').css('width', '34px');

	$('.fht-fixed-column tr:even').css('background-color', '#F4F4F4');
	$('.fht-fixed-column tr:odd').css('background-color', '#FFFFFF');
	$('.fht-fixed-column .fht-thead').css('border-right', '1px solid white');
	$('.fht-fixed-column .fht-tbody').css('border-right', '1px solid #dfdfdf');
	
	/* Control the height of the Div */
	if (totalRecordsize < 11) {
		$('.fht-fixed-column .fht-tbody').css('height', 26 * totalRecordsize);
	}
};

/**
 * The purpose of this function is to add and remove hover effect
 * on sort by date label.
 */
receivedMessage.prototype.sortByDateHoverEffect = function () {
	$("#sortWrapperOData").hover(function(){
		$("#sortdownArrowOData ").css("background","url(./images/sprite.png) no-repeat 40% -578px");
		 $("#sortTextOData ").css("color","#c80000");
	 },function(){
		  $("#sortdownArrowOData ").css("background","url(./images/sprite.png) no-repeat 40% -601px");
		  $("#sortTextOData ").css("color","#1b1b1b");
	});
};

$(document).ready(function() {
	$("#txtBoxQueryReceivedMessage").val("/ReceivedMessage");
	uReceivedMessage.createReceivedMessageTable();
	uReceivedMessage.sortByDateHoverEffect();
	$("#btnRawReceivedMessage").click(function() {
		$("#dvErrorMessage").hide();
		var jsonReceivedMessage = uReceivedMessage.getReceivedMessageJson();
		var receivedMessageDataSet = JSON.stringify(jsonReceivedMessage);
		uReceivedMessage.rawIconClick(receivedMessageDataSet,jsonReceivedMessage.length);
	});
	$("#btnGridReceivedMessage").click(function() {
		$("#dvErrorMessage").hide();
		$(".paginationWrapper").show(); 
		$("#sortWrapperOData").css("border-right", "1px solid #565656");
		$("#dvReceivedMessageRawTable").hide();
		$("#btnGridReceivedMessage").css("pointer-events","none");
		$("#receivedMessageTableDiv").show();
		$("#btnRawReceivedMessage").removeClass('odataRawIconSelected');
		$("#btnRawReceivedMessage").addClass('odataRawIconUnselected');
		$("#btnGridReceivedMessage").removeClass('odataGridIconUnselected');
		$("#btnGridReceivedMessage").addClass('odataGridIconSelected');
		uReceivedMessage.setDynamicWidthForGrid();
		$("#entityGridTbody").css('width', 'auto');
		var target = document.getElementById('spinner');
			spinner = new Spinner(opts).spin(target);
			setTimeout(function() {
				$("#receivedMessageTable").scrollLeft(0);
				$("#entityGridTbody").scrollTop(0);
				//uReceivedMessage.createReceivedMessageTable();
				var json = uReceivedMessage.getReceivedMessageJson();
				uReceivedMessage.createReceivedMessageTableQuery(json.length, json);
				if (spinner != undefined){
					spinner.stop();
					$("#btnGridReceivedMessage").css("pointer-events","all");
				}
			}, 50);
	});
	$("#btnDeleteReceivedMessage").click(function() {
		openCreateEntityModal('#receivedMessageDeleteModalWindow', '#receivedMessageDeleteDialogBox', 'btnCancelReceivedMessage');
	});
	$("#btnReceivedMessageDeleteOk").click(function() {
		uReceivedMessage.deleteMultipleReceivedMessages();
	});
	$("#btnGoReceivedMessage").click(function() {
		$("#dvErrorMessage").hide();
		uReceivedMessage.processQuery();
	});
	setReceivedMessageGridHeight();
});

/**
 * The purpose of this function is to set height of table grid
 * dynamically.
 */
function setReceivedMessageGridHeight() {
	var viewPortHeight = $(window).height();
	var gridHeight = viewPortHeight - 244 - 47;
	if (viewPortHeight > 650) {
		$("#entityGridTbody").css("max-height", gridHeight);
		var tblReceivedMessageHeight = gridHeight + 37; 
		$("#receivedMessageTable").css("min-height", tblReceivedMessageHeight);
	} else if (viewPortHeight <= 650) {
		$("#receivedMessageTable").css("min-height", '396px');
		$("#entityGridTbody").css("max-height", '359px');
	}
}
/**
 * The purpose of this function is set dynamic width of table tbody
 */
receivedMessage.prototype.setDynamicWidthForGrid = function(){
	var width = $(window).width();
	var leftPanelWidth = $('#leftPanel').width();//Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var gridWidth = rightPanelWidth - 52;
	if (width>1280) {
		$("#receivedMessageTable").css("min-width",gridWidth + "px");
		$("#receivedMessageTable thead").css("min-width",gridWidth + "px");
		$("#tblReceivedMessageTBody").css("min-width",gridWidth + "px");
	}else{
		$("#receivedMessageTable").css("min-width","1228px");
		$("#receivedMessageTable thead").css("min-width","1228px");
		$("#tblReceivedMessageTBody").css("min-width","1228px");
	}
};

/********************* Methods for Raw View START ************************/
/**
 * Following method sets raw table width.
 */
receivedMessage.prototype.setRawReceivedMessageDivWidth = function(){
	var width = $(window).width();
	var leftPanelWidth = $('#leftPanel').width();//Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var gridWidth = rightPanelWidth - 52;
	if (width>1280) {
		$("#receivedMessageRawDataTbody").css("min-width",gridWidth + "px");
	}else{
		$("#receivedMessageRawDataTbody").css("min-width","1226px");

	}
	$("#receivedMessageRawDataTbody > *").width(
			$("#receivedMessageRawDataTbody").width()
				+ $("#receivedMessageRawDataTbody").scrollLeft());
};

/**
 * Following method sets raw table height.
 */
receivedMessage.prototype.setRawReceivedMessageDivHeight = function(){
	var viewPortHeight = $(window).height();
	var gridHeight = viewPortHeight - 244 - 47;
	if (viewPortHeight > 650) {
		$("#receivedMessageRawDataTbody").css("max-height", gridHeight);
		var tblReceivedMessageHeight = gridHeight + 37; 
		$("#receivedMessageRawDataTbody").css("min-height", tblReceivedMessageHeight);
	} else if (viewPortHeight <= 650) {
		$("#receivedMessageRawDataTbody").css("min-height", '396px');
		$("#receivedMessageRawDataTbody").css("max-height", '359px');
	}
};

/**
 * Following method is triggered when raw icon is clicked.
 */
receivedMessage.prototype.rawIconClick = function(receivedMessageDataSet,totalRecordsize) {
	uReceivedMessage.initializeRawBlockStyle();
	$(".paginationWrapper").hide();
	objCommon.disableButton('#btnDeleteReceivedMessage');
	if (totalRecordsize == 0) {
		var message = getUiProps().MSG0316;
		uReceivedMessage.displayErrorRawView(message);
	} else {
		var target = document.getElementById('spinner');
		spinner = new Spinner(opts).spin(target);
		setTimeout(function() {
			$("#receivedMessageRawDataTbody").scrollLeft(0);
			$("#receivedMessageRawDataTbody").scrollTop(0);
			uReceivedMessage.createChunkedReceivedMessageRawView(
					receivedMessageDataSet, totalRecordsize);
			if (spinner != undefined) {
				spinner.stop();
			}
		}, 50);
	}
};

/********************* Methods for Raw View END. ************************/

/********************* Methods for Received Query View START ************/
/**
 * Following method sets raw view block style.
 */
receivedMessage.prototype.initializeRawBlockStyle = function() {
	$("#sortWrapperOData").css("border-right", "0px");
	$("#receivedMessageTableDiv").hide();
	$("#dvemptyTableMessage").hide();
	$("#btnRawReceivedMessage").removeClass('odataRawIconUnselected');
	$("#btnRawReceivedMessage").addClass('odataRawIconSelected');
	$("#btnGridReceivedMessage").removeClass('odataGridIconSelected');
	$("#btnGridReceivedMessage").addClass('odataGridIconUnselected');
	$("#dvReceivedMessageRawTable").show();
	uReceivedMessage.setRawReceivedMessageDivHeight();
	uReceivedMessage.setRawReceivedMessageDivWidth();
	
};

/**
 * Following method displays error message.
 * @param message
 */
receivedMessage.prototype.displayErrorRawView = function(message) {
	$('#receivedMessageRawTable tbody').empty();
	objCommon.displayEmptyMessageInGrid(message,
			"ReceivedMessage");
	$("#receivedMessageRawTable").css("overflow", "auto");
	$("#dvemptyTableMessage").css("margin-top", "7%");
	$("#receivedMessageRawTable").scrollLeft(0);
};

/**
 * Following method displays error message - XML format.
 * @param message
 */
receivedMessage.prototype.displayErrorNotification = function (message) {
	$('#receivedMessageTable tbody').empty();
	objCommon.displayEmptyMessageInGrid(message, "ReceivedMessage");
	$("#receivedMessageTable").css("overflow", "auto");
	$("#dvemptyTableMessage").css("margin-top", "7%");
	objCommon.disableButton('#btnDeleteReceivedMessage');
	$("#chkSelectall").attr('checked', false);
	$("#lblCheckSelectAllReceivedMessage").css('cursor','default');
	$("#receivedMessageTable").scrollLeft(0);
	
};
/**
 * Following method creates table for received message table.
 * @param totalRecordsize total record size
 * @param json json records.
 */
receivedMessage.prototype.createReceivedMessageTableQuery = function (totalRecordsize,json) {
	var token = getClientStore().token;
	sessionStorage.token = token;
	if (totalRecordsize == 0) {
		var message = getUiProps().MSG0316;
		uReceivedMessage.displayErrorNotification(message);
	} else {
		document.getElementById("dvemptyTableMessage").style.display = "none";
		var recordNo = 0;
		this.createChunkedReceivedMessageTable(json, recordNo);
		var tableID = $('#receivedMessageTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, uReceivedMessage, json,
				this.createChunkedReceivedMessageTable, "ReceivedMessage");
		objCommon.checkCellContainerVisibility();
	}
};
/**
 * Following method checks if the grid icon is selected or not.
 * @returns
 */
receivedMessage.prototype.isGridSelected = function () {
	var isGridBtnSelected = $("#btnGridReceivedMessage").hasClass("odataGridIconSelected");
	return isGridBtnSelected;
};

 /**
  * Following method checks if the raw view icon is selected or not.
  */
receivedMessage.prototype.isRawViewSelected = function () {
	var isRawBtnSelected = $("#btnRawReceivedMessage").hasClass("odataRawIconSelected");
	return isRawBtnSelected;
};

/**
 * Following method displays inline row count.
 * @param inlineCount count
 */
receivedMessage.prototype.showInlineCount = function (inlineCount) {
	//addSuccessClass('#rowCountMessageIcon');
	$("#rowCountReceivedMessageBlock").css("display", 'table');
	document.getElementById("rowCountSuccessmsg").innerHTML = getUiProps().MSG0348 + " "
			+ inlineCount;
	objCommon.centerAlignRibbonMessage("#rowCountReceivedMessageBlock");
};

/********************* Methods for Received Query View END ************************/
$(window).resize(
		function() {
			uReceivedMessage.setRawReceivedMessageDivHeight();
			uReceivedMessage.setRawReceivedMessageDivWidth();
			if ($('#dvemptyTableMessage').is(':visible')) {
				objCommon.setDynamicPositionOfEmptyMessage();
				$("#dvemptyTableMessage").css("margin-top", "7%");
			}
			setReceivedMessageGridHeight();
			uReceivedMessage.setDynamicWidthForGrid();
			$("#receivedMessageTable > *").width(
					$("#receivedMessageTable").width()
							+ $("#receivedMessageTable").scrollLeft());
});