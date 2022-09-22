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
function sentMessage() {
}

var uSentMessage = new sentMessage();
var maxRowsForSentMessage = 50;
var sbSuccessfulSentMessage = 0;
var sbConflictSentMessage = 0;
var storeSentMessageJson = '';

var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;
/**
 * Following method sets received message JSON.
 * @param receivedMessageJson json records.
 */
sentMessage.prototype.setSentMessageJson = function(sentMessageJson) {
	storeSentMessageJson = sentMessageJson;
};

/**
 * Following method fetches json records.
 * @returns {String} json.
 */
sentMessage.prototype.getSentMessageJson = function() {
	return storeSentMessageJson;
};

/**
 * The purpose of this method is to create and initialize Sent Message Manager.
 * @returns {jSentMessageManager}
 */
sentMessage.prototype.createSentMessageManager = function(){
	var cellName = sessionStorage.selectedcell;
	var boxName = collectionPath;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var objSentMessageManager = new _pc.SentMessageManager(accessor);
	return objSentMessageManager;
};

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
sentMessage.prototype.retrieveRecordCount = function() {
	var accessor = objCommon.initializeAccessor(getClientStore().baseURL, sessionStorage.selectedcell);
	var objSentMessageManager = this.createSentMessageManager();
	var uri = objSentMessageManager.getUrl();
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
sentMessage.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var accessor = objCommon.initializeAccessor(getClientStore().baseURL, sessionStorage.selectedcell);
	var objSentMessageManager = this.createSentMessageManager();
	var dataUri = objSentMessageManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$skip="+ lowerLimit +"&$top=" + upperLimit;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
};

/**
 * The purpose of this function is to return sent message list against 
 * selected cell
 * @returns json
 */
sentMessage.prototype.getMessageList = function () {
	var listCount = uSentMessage.retrieveRecordCount();
	var objSentMessageManager = this.createSentMessageManager();
	var json = objSentMessageManager.query().top(listCount).run();
	sessionStorage['sentMessageDate'] = JSON.stringify(json);
	return json;
};

/**
 * The purpose of this function is to return detail of one particular 
 * sent message on the basis message id 
 * @param messageID
 * @returns json sent message list
 */
sentMessage.prototype.getMessageDetail = function (messageID) {
	var cellName = sessionStorage.selectedcell;
	var boxName = collectionPath;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var objSentMessageManager = new _pc.SentMessageManager(accessor);
	var json = objSentMessageManager.retrieve(messageID);
	json = json.body;
	return json;
};

/**
 * The purpose of this method is to create Sent Message table Grid view as per pagination.
 * @param json
 * @param recordSize total record count.
 */
sentMessage.prototype.createChunkedSentMessageTable = function(json, recordSize){
	$('#chkSelectall').attr('checked', false);
	$("#sentMessageTable").scrollLeft(0);
	$("#sentMessageTable tbody").scrollTop(0);
	objCommon.disableButton('#btnDeleteSentMessage');
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
	var sentMessageRowCount = 0;
	var maxLimit = (maxRowsForSentMessage+recordSize) < (jsonLength) ? (maxRowsForSentMessage+recordSize) : jsonLength;
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var id = obj.__id;
		var publishedDate = objCommon.convertEpochDateToReadableFormat(obj["__published"]);
		var updatedDate = objCommon.convertEpochDateToReadableFormat(obj["__updated"]);
		var to = obj["To"];
		var boxName = obj["_Box.Name"];
		var metadata_etag = obj["__metadata"]["etag"];
		var metadata_type = obj["__metadata"]["type"];
		var metadata_uri = obj["__metadata"]["uri"];
		var inReplyTo = obj["InReplyTo"];
		var toRelation = obj["ToRelation"];
		var type = obj["Type"];
		var title = obj["Title"];
		var body = obj["Body"];
		var priority = obj["Priority"];
		var requestRelation = obj["RequestRelation"];
		var requestRelationTarget = obj["RequestRelationTarget"];
		dynamicTable += '<tr class = "dynamicRowSentMessage" name="allrows" id="rowid'+count+'" onclick="uSentMessage.rowSelect('+ count + ');">';
		dynamicTable = uSentMessage.createRowsForSentMessageTable(dynamicTable,
				status, id, publishedDate, updatedDate, to, boxName,
				metadata_etag, metadata_type, metadata_uri, inReplyTo,
				toRelation, type, title, body, priority, requestRelation,
				requestRelationTarget, count,sentMessageRowCount);
		sentMessageRowCount++;
	}
	//uSentMessage.createHeader();
	$("#sentMessageTable tbody").html(dynamicTable);
/*	$("#sentMessageTable tbody tr:odd").css("background-color", "#F4F4F4");*/
};

/**
 * Following method fetches all sent messages.
 * @returns json.
 */
sentMessage.prototype.retrieveAllSentMessages = function () {
	var accessor = objCommon.initializeAccessor(getClientStore().baseURL, sessionStorage.selectedcell);
	var objSentMessageManager = this.createSentMessageManager();
	var totalRecordCount = uSentMessage.retrieveRecordCount();
	var dataUri = objSentMessageManager.getUrl();
	dataUri = dataUri + "?$orderby=__updated desc &$top=" + totalRecordCount;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var dataResponse = restAdapter.get(dataUri, "application/json");
	var dataJson = dataResponse.bodyAsJson().d.results;
	return dataJson;
};

/**
 * The purpose of this function is create sent message table
 */
sentMessage.prototype.createSentMessageTable = function () {
/*	$('#btnDeleteSentMessage').attr('disabled', 'disabled');
	$('#btnDeleteSentMessage').addClass('deleteBtnDisabled');
	$(".dynamicRowSentMessage").remove();
	$("#btnGridSentMessage").removeClass("odataNormalButtonGrey");
	$("#btnGridSentMessage").addClass("odataNormalButtonBlue");
	$(".dynamicRowSentMessage").remove();
	$('#sentMessageHeader').removeClass('displayNone');
	totalRecordsize = this.retrieveRecordCount();
	sessionStorage.totalRecordsOnSentMessage = totalRecordsize;
	sessionStorage.sentMessageView = "sentMessageGrid";
	sessionStorage.queryDataSentMessage = "";
	this.initializeTxtboxWithDefaultText(totalRecordsize);
	if (totalRecordsize >0) {
		var json = uSentMessage.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
		var recordSize = 0;
		uSentMessage.createChunkedSentMessageTable(json, recordSize);
		$(".pagination").remove();
		
		
		objCommon.createPaginationView(totalRecordsize, "",
				maxRowsForSentMessage, $("#sentMessageTable tbody"), "#resultPaneSentMessage",uSentMessage, json, 
				uSentMessage.createChunkedSentMessageTable, "sentMessage");
	} else {
		$("#dvsSentMessageEmpty").show();
		$('#sentMessageHeader').addClass("displayNone");
		this.sentMessageGridDefaultState();
	}
	uSentMessage.applyFixedColumnStyleSheet();*/
	totalRecordsize = this.retrieveRecordCount();
	sessionStorage.sentMessageView = "sentMessageGrid";
	sessionStorage.totalRecordsOnSentMessage = totalRecordsize;
	sessionStorage.queryDataSentMessage = "";
	if (totalRecordsize == 0) {
		$('#sentMessageTable tbody').empty();
		objCommon.displayEmptyMessageInGrid(getUiProps().MSG0345, "SentMessage");
		$("#sentMessageTable").css("overflow", "auto");
		$("#dvemptyTableMessage").css("margin-top", "7%");
		objCommon.disableButton('#btnDeleteSentMessage');
		$("#chkSelectall").attr('checked', false);
		$("#lblCheckSelectAllSentMessage").css('cursor','default');
		$("#sentMessageTable").scrollLeft(0);
		return true;
	}
	document.getElementById("dvemptyTableMessage").style.display = "none";
	var json = uSentMessage.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
	uSentMessage.setSentMessageJson(json);
	var enitreDataSet = uSentMessage.retrieveAllSentMessages();
	uSentMessage.setSentMessageJson(enitreDataSet);
	var recordNo = 0;
	this.createChunkedSentMessageTable(json, recordNo);
	var tableID = $('#sentMessageTable');
	objCommon.createPaginationView(totalRecordsize, maxRowsForSentMessage, tableID, uSentMessage, json, uSentMessage.createChunkedSentMessageTable, "SentMessage");
	objCommon.checkCellContainerVisibility();
};

/**
 * The purpose of this function is to create rows for sent message table
 * @param dynamicTable
 * @param id
 * @param publishedDate
 * @param updatedDate
 * @param to
 * @param boxName
 * @param metadata_etag
 * @param metadata_type
 * @param metadata_uri
 * @param inReplyTo
 * @param toRelation
 * @param type
 * @param title
 * @param body
 * @param priority
 * @param requestRelation
 * @param requestRelationTarget
 * @param count
 * @returns
 */
sentMessage.prototype.createRows  = function(dynamicTable, id, publishedDate, updatedDate, to, boxName, metadata_etag, metadata_type, metadata_uri, inReplyTo, toRelation, 
		type, title, body, priority, requestRelation, requestRelationTarget, count) {
	var messageID = "'"+id+"'";
	//dynamicTable += '<td><input id="chkBox'+count+'" type="checkbox" class="case cursorHand" name="case" value="'+id+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteSentMessage'" +','+ "'chkSelectall'" +','+ count +',' + totalRecordsize + ');"/></td>'; 
	dynamicTable += '<td><input id="chkBox'+count+'" type="checkbox" class="case cursorHand" name="case" value="'+id+'" onclick="uSentMessage.rowSelect('+ count + ');"/></td>';
	dynamicTable += '<td name = "acc"><a id="messageID'+count+'" href ="#" class="roleNameLink" title= "'+id+'" onclick = "uSentMessage.openMessageDetail('+messageID+');">'+id+'</a></td>';
	dynamicTable += "<td>"+publishedDate+"</td>";
	dynamicTable += "<td>"+updatedDate+"</td>";
	dynamicTable += "<td title= '"+to+"'>"+to+"</td>";
	dynamicTable += "<td title= '"+boxName+"'>"+boxName+"</td>";
	dynamicTable += "<td id='etag"+count+"' title= '"+metadata_etag+"'>"+metadata_etag+"</td>";
	dynamicTable += "<td title= '"+metadata_type+"'>"+metadata_type+"</td>";
	dynamicTable += "<td title= '"+metadata_uri+"'>"+metadata_uri+"</td>";
	dynamicTable += "<td title= '"+inReplyTo+"'>"+inReplyTo+"</td>";
	dynamicTable += "<td title= '"+toRelation+"'>"+toRelation+"</td>";
	dynamicTable += "<td title= '"+type+"'>"+type+"</td>";
	dynamicTable += "<td title= '"+title+"'>"+title+"</td>";
	dynamicTable += "<td title= '"+body+"'>"+body+"</td>";
	dynamicTable += "<td title= '"+priority+"'>"+priority+"</td>";
	dynamicTable += "<td title= '"+requestRelation+"'>"+requestRelation+"</td>";
	dynamicTable += "<td title= '"+requestRelationTarget+"'>"+requestRelationTarget+"</td>";
	dynamicTable += "</tr>";
	return dynamicTable;
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
 * @param toRelation
 * @param type
 * @param title
 * @param body
 * @param priority
 * @param requestRelation
 * @param requestRelationTarget
 * @param count
 * @returns
 */
sentMessage.prototype.createRowsForSentMessageTable = function(
		dynamicTable, status, id, publishedDate, updatedDate, to, boxName,
		metadata_etag, metadata_type, metadata_uri, inReplyTo, toRelation,
		type, title, body, priority, requestRelation, requestRelationTarget,
		count,sentMessageRowCount) {
	var messageID = "'"+id+"'";
	dynamicTable += '<tr onclick="objCommon.rowSelect(this,' + "'rowid'" + ','
			+ "'chkBox'" + ',' + "'row'" + ',' + "'btnDeleteSentMessage'" + ','
			+ "'chkSelectall'" + ','
			+ sentMessageRowCount
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
			+ "'sentMessageTable'"
			+ ');"  name = "allrows" id = "rowid'
			+ sentMessageRowCount
			+ '"><td style="width:1%"><input id = "txtSentMessageEtagId'
			+ sentMessageRowCount
			+ '" value='
			+ metadata_etag
			+ ' type = "hidden" /><input title="'
			+ sentMessageRowCount
			+ '" id = "chkBox'
			+ sentMessageRowCount
			+ '" type = "checkbox" class = "case cursorHand regular-checkbox big-checkbox" name = "case" value="'
			+ id + '" /><label for="chkBox' + sentMessageRowCount
			+ '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += '<td><div style="width:280px;" class = "mainTableEllipsis"><a id="sentMessageIDLink'+sentMessageRowCount+'" onclick = "uSentMessage.openMessageDetail('+messageID+');" href = "#"  title= '+id+' tabindex ="-1" style="outline:none">'+id+'</a></div></td>';
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
			+ to + "' class='cursorPointer'>" + to + "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ boxName
			+ "' class='cursorPointer'>"
			+ boxName
			+ "</label></div></td>";
	dynamicTable += "<td  id='etag"
			+ sentMessageRowCount
			+ "'  ><div style='width:150px;' class = 'mainTableEllipsis'><label  title= '"
			+ metadata_etag + "' class='cursorPointer' id='lblEtag" + sentMessageRowCount
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
			+ toRelation
			+ "' class='cursorPointer'>"
			+ toRelation
			+ "</label></div></td>";
	dynamicTable += "<td  ><div style='width:150px;' class = 'mainTableEllipsis'><label title= '"
			+ type + "' class='cursorPointer'>" + type + "</label></div></td>";

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
 * The purpose of this method is to create Sent Message Raw view as per pagination.
 * @param json
 * @param recordSize
 */
/*sentMessage.prototype.createChunkedSentMessageRawView = function(json, recordSize){alert(JSON.stringify(json));
	var dynamicRow = "";
	if(typeof json === "string"){
		json = JSON.parse(json);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}
	//recordSize =10;
	//var jsonLength = json.length;
	//var maxLimit = (maxRowsForSentMessage+recordSize) < (jsonLength) ? (maxRowsForSentMessage+recordSize) : jsonLength;
	for ( var count = 0; count < recordSize; count++) {
		var obj = json[count];
		dynamicRow += "<tr id='rawViewRow"+count+"'><td class='jsonRawViewSentMessageTable'>" + JSON.stringify(obj)
				+ "</td></tr>";
	}
	$("#sentMessageRawTable tbody").html(dynamicRow);
};*/

/**
 * The purpose of this function is create raw view table for sent message
 */
/*sentMessage.prototype.getRawJSONView = function() {
	$('#btnDeleteSentMessage').attr('disabled', 'disabled');
	$('#btnDeleteSentMessage').addClass('deleteBtnDisabled');
	
	var json = "";
	if(typeof objCommon.dataSetProfile === "string"){
		json = JSON.parse(objCommon.dataSetProfile);
		if(typeof json === "string"){
			json = JSON.parse(json);
		}
	}else{
		json = objCommon.dataSetProfile;
	}
	var modCurrent = sessionStorage.selectedPageNoSentMessage % objCommon.maxNoOfPages;
	if(modCurrent === 0){
		modCurrent = objCommon.maxNoOfPages;
	}
	var recordCount = (modCurrent-1)*maxRowsForSentMessage;
	if (sessionStorage.totalRecordsOnSentMessage > 0) {
		uSentMessage.createChunkedSentMessageRawView(json, recordCount);
		$(".pagination").remove();
		objCommon.createPaginationView(sessionStorage.totalRecordsOnSentMessage, "",
				maxRowsForSentMessage, $("#sentMessageRawTable"), "#resultPaneSentMessage", uSentMessage, json, uSentMessage.createChunkedSentMessageRawView, "sentMessageRaw",
				sessionStorage.selectedPageNoSentMessage);
		var tableID = $("#sentMessageRawTable");
		objCommon.createPaginationView(sessionStorage.totalRecordsOnSentMessage, maxRowsForSentMessage, tableID, uSentMessage, json, uSentMessage.createChunkedSentMessageRawView, "SentMessage");

		var totalPageNo = Math.ceil(sessionStorage.totalRecordsOnSentMessage / maxRowsForSentMessage);
		var selectedPageNo = sessionStorage.selectedPageNoSentMessage;
		uSentMessage.maintainPageState(selectedPageNo, tableID, maxRowsForSentMessage, totalPageNo);
	} else if (parseInt(sessionStorage.totalRecordsOnSentMessage) === 0) {
		$("#dvsSentMessageEmpty").show();
	}
};*/

/**
 * The purpose of this function is to hide grid view on click of raw button
 */
/*sentMessage.prototype.clickRawTab = function() { 
	document.getElementById("sentMessageTableDiv").style.display = "none";
	document.getElementById("dvSentMessageRawTable").style.display = "block";
	this.disableButtonsForRawView();
	this.saveSelectedPage("grid");
	if(sessionStorage.sentMessageView === "sentMessageQuery"){
		var json = sessionStorage.queryDataSentMessage;
		if(json != ""){
			json = JSON.parse(sessionStorage.queryDataSentMessage);
		}
		uSentMessage.createRawQueryResponseTable(json, true);
	}else if(sessionStorage.sentMessageView === "sentMessageGrid"){

		this.getRawJSONView();
		var selectedIndex = this.getSelectedRowIndexInGridView();
		this.highlightRowInRawView(selectedIndex);
	}
};*/

sentMessage.prototype.initializeRawBlockStyle = function() {
	$("#sortWrapperOData").css("border-right", "0px");
	$("#sentMessageTableDiv").hide();
	$("#dvemptyTableMessage").hide();
	$("#btnRawSentMessage").removeClass('odataRawIconUnselected');
	$("#btnRawSentMessage").addClass('odataRawIconSelected');
	$("#btnGridSentMessage").removeClass('odataGridIconSelected');
	$("#btnGridSentMessage").addClass('odataGridIconUnselected');
	$("#dvSentMessageRawTable").show();
	uSentMessage.setRawSentMessageDivHeight();
	uSentMessage.setRawSentMessageDivWidth();
	
};


sentMessage.prototype.setRawSentMessageDivWidth = function(){
	var width = $(window).width();
	var leftPanelWidth = $('#leftPanel').width();//Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var gridWidth = rightPanelWidth - 52;
	if (width>1280) {
		$("#sentMessageRawDataTbody").css("min-width",gridWidth + "px");
	}else{
		$("#sentMessageRawDataTbody").css("min-width","1226px");

	}
	$("#sentMessageRawDataTbody > *").width(
			$("#sentMessageRawDataTbody").width()
				+ $("#sentMessageRawDataTbody").scrollLeft());
};

/**
* Following method sets raw table height.
*/
sentMessage.prototype.setRawSentMessageDivHeight = function(){
	var viewPortHeight = $(window).height();
	var gridHeight = viewPortHeight - 244 - 47;
	if (viewPortHeight > 650) {
		$("#sentMessageRawDataTbody").css("max-height", gridHeight);
		var tblReceivedMessageHeight = gridHeight + 37; 
		$("#sentMessageRawDataTbody").css("min-height", tblReceivedMessageHeight);
	} else if (viewPortHeight <= 650) {
		$("#sentMessageRawDataTbody").css("min-height", '396px');
		$("#sentMessageRawDataTbody").css("max-height", '359px');
	}
};

/**
 * Following method is triggered when raw icon is clicked.
 */
sentMessage.prototype.rawIconClick = function(sentMessageDataSet,totalRecordsize) {
	uSentMessage.initializeRawBlockStyle();
	$(".paginationWrapper").hide();
	objCommon.disableButton('#btnDeleteSentMessage');
	if (totalRecordsize == 0) {
		var message = getUiProps().MSG0345;
		uSentMessage.displayErrorRawView(message);
	} else {
		var target = document.getElementById('spinner');
		spinner = new Spinner(opts).spin(target);
		setTimeout(function() {
			$("#sentMessageRawDataTbody").scrollLeft(0);
			$("#sentMessageRawDataTbody").scrollTop(0);
			uSentMessage.createChunkedSentMessageRawView(
					sentMessageDataSet, totalRecordsize);
			if (spinner != undefined) {
				spinner.stop();
			}
		}, 50);
	}
};

sentMessage.prototype.createChunkedSentMessageRawView = function(json, recordSize){
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
	$("#sentMessageRawTable tbody").html(dynamicRow);
};

/**
 * The purpose of this function is to hide grid view on click of grid button
 */
sentMessage.prototype.clickGridTab = function() {
	document.getElementById("dvSentMessageRawTable").style.display = "none";
	document.getElementById("sentMessageTableDiv").style.display = "block";
	this.disableButtonsForGridView();
	uSentMessage.saveSelectedPage("raw");
	if(sessionStorage.sentMessageView === "sentMessageQuery"){
		uSentMessage.checkQueryType(JSON.parse(sessionStorage.queryDataSentMessage), true);
	}else if(sessionStorage.sentMessageView === "sentMessageGrid"){
		var modCurrent = sessionStorage.selectedPageNoSentMessage % objCommon.maxNoOfPages;
		if(modCurrent === 0){
			modCurrent = objCommon.maxNoOfPages;
		}
		var recordCount = (modCurrent-1)*maxRowsForSentMessage;
		uSentMessage.createChunkedSentMessageTable(objCommon.dataSetProfile, recordCount);
		
		var totalPageNo = Math.ceil(sessionStorage.totalRecordsOnSentMessage / maxRowsForSentMessage);
		var tableID = $("#sentMessageTable");
		var selectedPageNo = sessionStorage.selectedPageNoSentMessage;
		$(".pagination").remove();
		objCommon.createPaginationView(sessionStorage.totalRecordsOnSentMessage, "", maxRowsForSentMessage,
				$("#sentMessageTable"), "#resultPaneSentMessage", uSentMessage, objCommon.dataSetProfile,
				uSentMessage.createChunkedSentMessageTable, "sentMessage", sessionStorage.selectedPageIndexBox);
		uSentMessage.maintainPageState(selectedPageNo, tableID,
				maxRowsForSentMessage, totalPageNo);
		//uSentMessage.applyFixedColumnStyleSheet();
	}
	
};

/**
 * The purpose of this function is to open message detail pop up
 * on click of any particular ID in sent message table
 * @param messageID
 */
sentMessage.prototype.openMessageDetail = function (messageID) {
/*	var messageStatus = null;
	var response = this.getMessageDetail(messageID);
	if (response == true ){
		messageStatus = 404;
	} else {
		messageStatus = response.Result[0].Code;
	}
	var jsonData = JSON.stringify(response, null, '\t');
	if (messageStatus == 201) {
		$("#textSentMessageDetail").val(jsonData);
		openCreateEntityModal('#sentMessageDetailPopUpModalWindow', '#sentMessageDetailDialogBox');
	} else if (messageStatus == 404) {
		$("#textSentMessageDetail").val("Message Not Exist");
		openCreateEntityModal('#sentMessageDetailPopUpModalWindow', '#sentMessageDetailDialogBox');
	}*/
	var response = this.getMessageDetail(messageID);
	if (response == true ){
		$("#textSentMessageDetail").val("Message Not Exist");
		openCreateEntityModal('#sentMessageDetailPopUpModalWindow', '#sentMessageDetailDialogBox', 'textSentMessageDetail');
		$("#textSentMessageDetail").scrollTop(0);
		$("#textSentMessageDetail").scrollLeft(0);
		return true;
	}
	var jsonData = JSON.stringify(response, null, '\t');
	var jsonData1 = objCommon.syntaxHighlight(jsonData);
	$("#textSentMessageDetail").html(jsonData1);
	openCreateEntityModal('#sentMessageDetailPopUpModalWindow', '#sentMessageDetailDialogBox', 'textSentMessageDetail');
	$("#textSentMessageDetail").scrollTop(0);
	$("#textSentMessageDetail").scrollLeft(0);
};

/**
 * The purpose of this function is to disable button for raw view
 */
sentMessage.prototype.disableButtonsForRawView = function() {
	$("#btnGridSentMessage").removeClass("odataGridIconSelected");
	$("#btnGridSentMessage").addClass("odataGridIconUnselected");
	$("#btnRawSentMessage").removeClass("odataRawIconUnselected");
	$("#btnRawSentMessage").addClass("odataRawIconSelected");
};

/**
 * The purpose of this function is to disable button for grid view
 */
sentMessage.prototype.disableButtonsForGridView = function() {
	$("#btnRawSentMessage").removeClass("odataRawIconSelected");
	$("#btnRawSentMessage").addClass("odataRawIconUnselected");
	$("#btnGridSentMessage").removeClass("odataGridIconUnselected");
	$("#btnGridSentMessage").addClass("odataGridIconSelected");
};

/**
 * Teh purpose of this function is to implement check all functionality 
 * on click of parent check box
 * @param cBox
 */
sentMessage.prototype.checkSelectAll = function(cBox) {
	var buttonId = '#btnDeleteSentMessage';
	objCommon.checkBoxSelect(cBox, buttonId,  '#btnEditAccount');
	objCommon.showSelectedRow(document.getElementById("chkSelectall"),"row","rowid");
};

/**
 * The purpose of this function is to save select page state form grid table
 * @param mode
 */
sentMessage.prototype.saveSelectedPage = function(mode) {
	var totalPageNo = Math.ceil(sessionStorage.totalRecordsOnSentMessage / maxRowsForSentMessage);
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
	sessionStorage.selectedPageNoSentMessage = selectedPageNo;
	sessionStorage.selectedPageIDNumberSentMessage = selectedPageIDNumber;
};

/**
 * The purpose of this function is to maintain page state
 * @param pageNo
 * @param tableID
 * @param maxRows
 * @param totalPageNo
 */
sentMessage.prototype.maintainPageState = function(pageNo, tableID, maxRows,
		totalPageNo) {
	if(pageNo === "" || pageNo === undefined){
		pageNo = 1;
	}
	var selectedPageIDNum = sessionStorage.selectedPageIDNumberSentMessage;
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
 * The purpose of this function is to return selected row index  
 * @returns {Array}
 */
sentMessage.prototype.getSelectedRowIndexInGridView = function() {
	var pageNO = sessionStorage.selectedPageIndexBox;
	var gridViewSelection = [];
	if (pageNO == 1) {
		var noOfmsgSelecttion = $("#sentMessageTable tr").length - 1;
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
sentMessage.prototype.highlightRowInRawView = function(arrSelectedIndex) {
	for (var i = 0; i <arrSelectedIndex.length; i++) {
		var x = arrSelectedIndex[i];
		$("#rawViewRow"+x).addClass('selectRow');
	}
};

/**
 * The purpose of this function to delete selected sent message from message table
 */
sentMessage.prototype.deleteMultipleMessages = function() {
	$('#rowCountSentMessageBlock').hide();
	var selectedMessageDetails = this.getSelectedMessageDetail();
	var length = selectedMessageDetails.length;
	
	var etagIDOfPreviousRecord = "txtSentMessageEtagId";
	var arrEtag = [];
	var etagValue = '';
	var tableID = $('#sentMessageTable');
	var idCheckAllChkBox = "#chkSelectall";
	//if (!$("#chkSelectall").is(':checked')) {
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord, arrEtag,"#chkBox0");
	}
	for (var i =0; i < length; i++) {
		var messageID = selectedMessageDetails[i]["ID"];
		var etag = selectedMessageDetails[i]["ETAG"];
		this.deleteMessage(messageID, etag,i);
	}
	
	this.displayDeleteSentMessage();
	var type = "SentMessage";
	var recordCount = uSentMessage.retrieveRecordCount();
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, uSentMessage, isDeleted);
	uSentMessage.setSentMessageJson(uSentMessage.retrieveAllSentMessages());
	$(idCheckAllChkBox).attr('checked', false);
};

/**
 * The purpose of this function is to perform delete operation on the basis of message id. 
 * @param messageID Message ID
 * @param etag Etag
 */
sentMessage.prototype.deleteMessage = function(messageID, etag,count) {
	var cellName = sessionStorage.selectedcell;
	var boxName = collectionPath;
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var objSentMessageManager = new _pc.SentMessageManager(accessor);
	var response = objSentMessageManager.del(messageID, etag);
	if (response.resolvedValue.status == 204) {
		sbSuccessfulSentMessage ++;
		isDeleted = true;
	} else if (response.errorMessage.status == 409) {
		arrDeletedConflictCount.push(count);
		sbConflictSentMessage ++;
	}
};

/**
 * The purpose of this function is to return selected message detail form grid table
 * @returns {Array} selected message
 */
sentMessage.prototype.getSelectedMessageDetail = function() { 
	var sentMessageDetail = [];
/*	var pageNO = sessionStorage.selectedPageIndexBox;
	if (pageNO == 1) {*/
		var noOfMessages = $("#sentMessageTable tr").length - 1;
		for (var index = 0; index < noOfMessages; index++) {
			var body = {};
			if($("#chkBox"+index).is(":checked")){
				body["ID"] = document.getElementById("sentMessageIDLink" + index).title;
				body["ETAG"] = document.getElementById("lblEtag" + index).title;
				sentMessageDetail.push(body);	
			}
		}
		
	/*}else {
		var endIndex = (pageNO*50)-1;
		var startIndex= endIndex - 49;
		for (var index = startIndex; index < endIndex; index++) {
			var body = {};
			if($("#chkBox"+index).is(":checked")){
				body["ID"] = document.getElementById("messageID" + index).title;
				body["ETAG"] = document.getElementById("etag" + index).title;
				sentMessageDetail.push(body);	
			}
		}
	}*/
	return sentMessageDetail;
};

/**
 * The purpose of this function is to display success/conflict message for
 * sent message delete operation 
 */
sentMessage.prototype.displayDeleteSentMessage = function () {
	$('#sentMessageDeleteModalWindow, .window').hide();
	var conflictSentMessageLength = 0;
	var successfulSentMessageLength = 0;
	successfulSentMessageLength = sbSuccessfulSentMessage;
	conflictSentMessageLength = sbConflictSentMessage;
	if(conflictSentMessageLength < 1 && successfulSentMessageLength > 0) {
		isDeleted = true;
		addSuccessClass("#sentMessageIcon");
		inlineMessageBlock(235,"#sentMessageBlock");
		document.getElementById("sentMessageSuccessmsg").innerHTML = successfulSentMessageLength+" " + getUiProps().MSG0346;
	} else if(successfulSentMessageLength < 1 && conflictSentMessageLength > 0) {
		isDeleted = false;
		addErrorClass("#sentMessageIcon");
		inlineMessageBlock(240,"#sentMessageBlock");
		document.getElementById("sentMessageSuccessmsg").innerHTML = conflictSentMessageLength+" " + getUiProps().MSG0347;
	} else if(conflictSentMessageLength > 0 && successfulSentMessageLength > 0 ) {
		isDeleted = true;
		addPartialSuccessClass("#sentMessageIcon");
		inlineMessageBlock(270,"#sentMessageBlock");
		document.getElementById("sentMessageSuccessmsg").innerHTML = successfulSentMessageLength+" " + getUiProps().MSG0323 +" " +(conflictSentMessageLength + successfulSentMessageLength)+" " + getUiProps().MSG0346;
	}	
	//this.createSentMessageTable();
	objCommon.centerAlignRibbonMessage("#sentMessageBlock");
	objCommon.autoHideAssignRibbonMessage('sentMessageBlock');
	sbSuccessfulSentMessage = 0;
	sbConflictSentMessage = 0;
};

/**
 * The purpose of this function is to maintain grid default state when message grid is empty
 */
sentMessage.prototype.sentMessageGridDefaultState = function () {
	$("#btnGridSentMessage").removeClass("odataNormalButtonBlue");
	$("#btnGridSentMessage").addClass("odataNormalButtonGrey");
	$("#btnGridSentMessage").attr("disabled",true);
	$("#btnRawSentMessage").attr("disabled",true);
	$("#btnGridSentMessage").addClass("cursorDefault");
	$("#btnRawSentMessage").addClass("cursorDefault");
	$("#btnGoSentMessage").removeClass("normalButtonBlue");
	$("#btnGoSentMessage").addClass("normalButtonBlueDisabledSentMessage");
	$('#txtBoxQuerySentMessage').attr('readonly','readonly');
};

/**
 * The purpose of this function is to intialize text box query with sentMessage text or
 * default text on the basis of record size.
 * @param recordSize
 */
sentMessage.prototype.initializeTxtboxWithDefaultText = function (recordSize) {
	if (document.getElementById("dvRowCountSentMessage")!= undefined) {
	document.getElementById("dvRowCountSentMessage").style.display = "none";
	var input = document.getElementById("txtBoxQuerySentMessage");
	input.value = "/" + "SentMessage";
	if (recordSize === 0) {
		input.value = "Type your query";
	}
	}
};

/**
 * The purpose of this function is to check ATOM format for entered query
 * @returns {Boolean}
 */
sentMessage.prototype.checkAtomFormat = function () {//var displayErrorMessage = "";
	var xmlNotSupportedMessage = getUiProps().MSG0132;
	if (sessionStorage.queryType === "$format=atom") {
		if (uSentMessage.isGridSelected()) {
			uSentMessage.displayErrorNotification(xmlNotSupportedMessage);
		return false;
		}
		uSentMessage.displayErrorRawView(xmlNotSupportedMessage);
		return false;
	}
};

/**
 * The purpose of thsi function is to perform query operation on click of GO button
 * @returns {Boolean}
 */
sentMessage.prototype.processQuery = function () {
	$('#rowCountSentMessageBlock').hide();
	//showSpinner("modalSpinnerSentMessage");
	errorSentMsgQuery.innerHTML = "";
	var validMessage = getUiProps().MSG0125;
	var entityNameMessage = getUiProps().MSG0182;
	//document.getElementById("dvRowCountSentMessage").style.display = "none";
	var queryString = $("#txtBoxQuerySentMessage").val();
	if (queryString == "/SentMessage") {
		//removeSpinner("modalSpinnerSentMessage");
		this.createSentMessageTable();
		return false;
	}
	//var isGridBtnSelected = $("#btnGridSentMessage").hasClass("odataGridIconSelected");
	//var isRawBtnSelected = $("#btnRawSentMessage").hasClass("odataRawIconSelected");
	var messageKeyWordFromQueryString = this.validateQueryString(queryString);
	var isFormatAtom = this.checkAtomFormat();
	if (isFormatAtom === false) {
		sessionStorage.queryType = "";
		//removeSpinner("modalSpinnerSentMessage");
		return false;
	}
	var isExpandQuery = this.checkExpandQuery();
	if (isExpandQuery === false) {
		sessionStorage.selectQueryType = "";
		//removeSpinner("modalSpinnerSentMessage");
		return false;
	}
	var isFilterQuery = this.checkFilterQuery();
	if (isFilterQuery === false) {
		sessionStorage.selectQueryType = "";
		//removeSpinner("modalSpinnerSentMessage");
		return false;
	}
	
	var isFullTextSearchQuery = this.checkFullTextSearchQuery();
	if (isFullTextSearchQuery === false) {
		sessionStorage.selectQueryType = "";
		//removeSpinner("modalSpinnerSentMessage");
		return false;
	}
	var entityTypeName = "SentMessage";
	if (messageKeyWordFromQueryString === entityTypeName) {
		var responseStatus = null;
		var inlineResponse = null;
		var response = this.retrieveAPIResponse(queryString);
		if (response != 400 && response != 404) {
			inlineResponse = response.bodyAsJson().d;
			//sessionStorage.recordCountSentMessage = inlineResponse.__count;
			responseStatus = response.getStatusCode();
		}
		if (response === 400 || response === 404) {
			errorSentMsgQuery.innerHTML = validMessage;
		}
		if (responseStatus === 200) {
			$("#dvSentErrorMessage").hide();
			var json = response.bodyAsJson().d.results;
			uSentMessage.setSentMessageJson(json);
			//sessionStorage['sentMessageDate'] = JSON.stringify(json);
			if (json === null) {
				errorSentMsgQuery.innerHTML = validMessage;
			}
			if (uSentMessage.isRawViewSelected()) {
				var sentMessageDataSet = JSON.stringify(json);
				uSentMessage.rawIconClick(sentMessageDataSet,
						json.length);
				//sessionStorage.sentMessageView = "sentMessageQuery";
				//this.createRawQueryResponseTable(json, false);
			}
			if (uSentMessage.isGridSelected()) {
				uSentMessage.createSentMessageTableQuery(json.length, json);
				//sessionStorage.sentMessageView = "sentMessageQuery";
				//this.checkQueryType(json, false, inlineResponse);
			//	sessionStorage.selectQueryType = "";
			}
			var INLINECOUNTQUERY = "$inlinecount=allpages";
			if (sessionStorage.queryType === INLINECOUNTQUERY) {
				this.showInlineCount(uSentMessage.retrieveRecordCount());
			}
		}
	} else if (messageKeyWordFromQueryString === undefined) {
		$("#dvSentErrorMessage").show();
		errorSentMsgQuery.innerHTML = validMessage;
		//removeSpinner("modalSpinnerSentMessage");
	} else if (messageKeyWordFromQueryString != entityTypeName) {
		$("#dvSentErrorMessage").show();
		var query = messageKeyWordFromQueryString.indexOf("?");
		var query1 = messageKeyWordFromQueryString.indexOf("$");
		if (query === -1 && query1 != -1) {
			errorSentMsgQuery.innerHTML = validMessage;
		} else if (query === -1 && query1 === -1) {
			errorSentMsgQuery.innerHTML = entityNameMessage;
		}
	} 
	else {
		$("#dvSentErrorMessage").show();
		errorSentMsgQuery.innerHTML = entityNameMessage;
	}
	//removeSpinner("modalSpinnerSentMessage");
	//uSentMessage.applyFixedColumnStyleSheet();
};

/**
 * The purpose of this function is to validate query string entered in text box.
 * @param queryString
 * @returns {String}
 */
sentMessage.prototype.validateQueryString = function (queryString) {
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
			errorSentMsgQuery.innerHTML = validMessage;
		}
	//} else if (query == -1) {
	} else if (query == -1 && isDollarSign!="/") {
		messageKeyWordFromQueryString=  this.getMessageKeyWordFromQueryString(queryString);
		return messageKeyWordFromQueryString;
	} else {
		errorSentMsgQuery.innerHTML = validMessage;
	}
};

/**
 * The purpose of this function is to extract sentMessage kewword from entered query string.
 * @param queryString
 * @returns {String}
 */
sentMessage.prototype.getMessageKeyWordFromQueryString = function (queryString) {
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
 * The purpose of this function is to return API response on the 
 * basis of query string 
 * @param queryString
 * @returns
 */
sentMessage.prototype.retrieveAPIResponse = function (queryString) {
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
 * The purpose of this function is to check query type from entered query string
 * @param json
 * @param inlineResponse
 */
sentMessage.prototype.checkQueryType = function (json, toggleMode, inlineResponse) {
	var recordSize = json.length;
	var headerList = "";
	var SELECTQUERY = "$select";
	var SELECTALLQUERY = "$select=*";
	var INLINECOUNTQUERY = "$inlinecount=allpages";
	var noDataMessage = getUiProps().MSG0131;
	sessionStorage.queryDataSentMessage = JSON.stringify(json);
	if (sessionStorage.selectQueryParameterList != undefined
			&& sessionStorage.selectQueryType === SELECTQUERY) {
		if (sessionStorage.queryType === SELECTALLQUERY) {
			this.createSentMessageTable();
		} else {
			var selectQueryParameterList = sessionStorage.selectQueryParameterList;
			headerList = new Array();
			var arrSelectQueryParameterList = selectQueryParameterList
					.split(',');
			for ( var count = 0; count < arrSelectQueryParameterList.length; count++) {
				if (arrSelectQueryParameterList[count] == "To" || arrSelectQueryParameterList[count] == "InReplyTo" || arrSelectQueryParameterList[count] == "ToRelation" || arrSelectQueryParameterList[count] == "Type" 
					|| arrSelectQueryParameterList[count] == "Title" || arrSelectQueryParameterList[count] == "Body" ||arrSelectQueryParameterList[count] == "Priority"
						|| arrSelectQueryParameterList[count] == "RequestRelation" || arrSelectQueryParameterList[count] == "RequestRelationTarget") {
					headerList.push(arrSelectQueryParameterList[count]);
				} else {
					
				}
			}
			this.createdynamicGridTable(json, headerList);
		}
	} else if (sessionStorage.queryType === INLINECOUNTQUERY) {
		var inlineCount = 0;
		if(inlineResponse != undefined){
			inlineCount = inlineResponse.__count;
		}
		sessionStorage.recordCountSentMessage = inlineCount;
		$('#rowInlinecountID').html(inlineCount);
		document.getElementById("dvRowCountSentMessage").style.display = "block";
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
			$("#sentMessageTable tbody").html(noDataRow);
		}
	}
	
};

/**
 * The purpose of this method is create Grid mode Query result view as per pagination.
 * @param json
 * @param recordSize
 */
sentMessage.prototype.createChunkedGridQuerySentMessageTable = function(json, recordSize){
	var dynamicTable = "";
	var maxLimit = (maxRowsForSentMessage+recordSize) < (json.length) ? (maxRowsForSentMessage+recordSize) : json.length;
	var totalRecordsize = json.length;
	
	for(var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var id = obj.__id;
		var publishedDate = objCommon.convertEpochDateToReadableFormat(obj["__published"]);
		var updatedDate = objCommon.convertEpochDateToReadableFormat(obj["__updated"]);
		var to = obj["To"];
		var boxName = obj["_Box.Name"];
		var metadata_etag = obj["__metadata"]["etag"];
		var metadata_type = obj["__metadata"]["type"];
		var metadata_uri = obj["__metadata"]["uri"];
		var inReplyTo = obj["InReplyTo"];
		var toRelation = obj["ToRelation"];
		var type = obj["Type"];
		var title = obj["Title"];
		var body = obj["Body"];
		var priority = obj["Priority"];
		var requestRelation = obj["RequestRelation"];
		var requestRelationTarget = obj["RequestRelationTarget"];
		//dynamicTable += '<tr class = "dynamicRowSentMessage" name="allrows" id="rowid'+count+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteSentMessage'" +','+ "'chkSelectall'" +','+ count +',' + totalRecordsize + ');">';
		dynamicTable += '<tr class = "dynamicRowSentMessage" name="allrows" id="rowid'+count+'" onclick="uSentMessage.rowSelect('+ count + ');">';
		dynamicTable = uSentMessage.createRows(dynamicTable, id, publishedDate, updatedDate, to, boxName, metadata_etag, metadata_type, metadata_uri, inReplyTo, toRelation, type, title, body, priority, requestRelation, requestRelationTarget, count);
	}
	uSentMessage.createHeader();
	$("#sentMessageTable tbody").html(dynamicTable);
/*	$("#sentMessageTable tbody tr:odd").css("background-color", "#F4F4F4");*/
};

/**
 * The purpose of this function is to create grid table after query operation
 * @param json
 */
sentMessage.prototype.createGridQueryResponseTable = function (json, toggleMode) {

	$('#btnDeleteSentMessage').attr('disabled', 'disabled');
	$('#btnDeleteSentMessage').addClass('deleteBtnDisabled');
	$("#btnGridSentMessage").removeClass("odataNormalButtonGrey");
	$("#btnGridSentMessage").addClass("odataNormalButtonBlue");
	$(".dynamicRowSentMessage").remove();
	$('#sentMessageHeader').removeClass('displayNone');
	var recordSize = 0;
	if(toggleMode){
		recordSize = (parseInt(sessionStorage.selectedPageNoSentMessage)-1)*maxRowsForSentMessage;
	}
	uSentMessage.createChunkedGridQuerySentMessageTable(json, recordSize);
	$(".pagination").remove();
	uOdataQuery.createPagination(json.length, "",
			maxRowsForSentMessage, $("#sentMessageTable"), "#resultPaneSentMessage", json, "", "", uSentMessage.createChunkedGridQuerySentMessageTable,"SentMessage");
	//sessionStorage.selectedPageNoSentMessage = "";
	if(toggleMode){
		var totalPageNo = Math.ceil(json.length / maxRowsForSentMessage);
		var selectedPageNo = sessionStorage.selectedPageNoSentMessage;
		uSentMessage.maintainPageState(selectedPageNo, "",
				maxRowsForSentMessage, totalPageNo);
	}
};

/**
 * The purpose of this function is to create dynamic header on the basis of select query.
 * @param headerList
 */
sentMessage.prototype.createHeaderForSelectQuery = function(headerList){
	var dynamicHeader ="";
	dynamicHeader += "<th class='entityTableHeadChkBox dynamicRowSentMessage' style='padding-left:0px;width:23px'><input type='checkbox' onclick='uSentMessage.checkSelectAll(this);' class='checkBox cursorHand' id='chkSelectall'></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col1'><div id='propTextID_"
			+ index
			+ "' class='entityHeadText' title='ID'>ID</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col2'><div id='propTextCreatedOn_"
			+ index
			+ "' class='entityHeadText' title='Created On'>Created On</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
			+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col3'><div id='propTextUpdatedOn_"
			+ index
			+ "' class='entityHeadText' title='Updated On'>Updated On</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col6'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Metadata-Etag'>Metadata-Etag</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col7'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Metadata-Type'>Metadata-Type</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col8'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Metadata-URI'>Metadata-URI</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	var noOfHeaders = headerList.length;
	for ( var index = 0; index < noOfHeaders; index++) {
		var dynWidth = 0;
		if(headerList[index][0].length > 8){
			dynWidth = (headerList[index].length * 8) + 40;
		} else{
			dynWidth = (headerList[index].length * 10) + 40;
		}
		dynamicHeader = dynamicHeader
				+ "<th class='entityTableColHead dynamicRowSentMessage'><div style='min-width:"+ dynWidth +"px'><div id='propText_" + index
				+ "' class='entityHeadText' title='"
				+ headerList[index] + "'>" + headerList[index]
				+ "</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	}
	$("#sentMessageTable thead tr").append(dynamicHeader);
};

/**
 * The purpose of this function is to create grid table for select query
 * @param json
 * @param headerList
 */
sentMessage.prototype.createdynamicGridTable = function(json, headerList){
	var jsonLength = json.length;
	var dynamicTable = '';
	var recordSize = jsonLength;
	totalRecordsize = recordSize;
	$(".dynamicRowSentMessage").remove();
	for(var count = 0; count < jsonLength; count++) {
		var obj = json[count];
		var id = obj.__id;
		var publishedDate = objCommon.convertEpochDateToReadableFormat(obj["__published"]);
		var updatedDate = objCommon.convertEpochDateToReadableFormat(obj["__updated"]);
		var metadata_etag = obj["__metadata"]["etag"];
		var metadata_type = obj["__metadata"]["type"];
		var metadata_uri = obj["__metadata"]["uri"];
		//dynamicTable += '<tr class = "dynamicRowSentMessage" name="allrows" id="rowid'+count+'" onclick="objCommon.rowSelect(this,'+ "'rowid'" +','+ "'chkBox'"+','+ "'row'" +','+ "'btnDeleteSentMessage'" +','+ "'chkSelectall'" +','+ count +',' + totalRecordsize + ');">';
		dynamicTable += '<tr class = "dynamicRowSentMessage" name="allrows" id="rowid'+count+'" onclick="uSentMessage.rowSelect('+ count + ');">';
		var messageID = "'"+id+"'";
		dynamicTable += '<td><input id="chkBox'+count+'" type="checkbox" class="case cursorHand" name="case" value="'+id+'" onclick="uSentMessage.rowSelect('+ count + ');"/></td>'; 
		dynamicTable += '<td name = "acc"><a id="messageID'+count+'" href ="#" class="roleNameLink" title= "'+id+'" onclick = "uSentMessage.openMessageDetail('+messageID+');">'+id+'</a></td>';
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
	$("#sentMessageTable tbody").append(dynamicTable);
/*	$("#sentMessageTable tbody tr:odd").css("background-color", "#F4F4F4");*/
	$(".pagination").remove();
	objCommon.createPagination(recordSize, "", maxRowsForSentMessage, $("#sentMessageTable"), "#resultPaneSentMessage");
	sessionStorage.selectedPageNoSentMessage = "";
};

/**
 * The purpose of this method is to create Raw mode Query result view as per pagination.
 * @param json
 * @param recordSize
 */
sentMessage.prototype.createChunkedRawQuerySentMessageTable = function(json, recordSize){
	var dynamicRow = "";
	var maxLimit = (maxRowsForSentMessage+recordSize) < (json.length) ? (maxRowsForSentMessage+recordSize) : json.length;
	for ( var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		dynamicRow += "<tr id='rawViewRow"+count+"'><td class='jsonRawViewSentMessageTable'>" + JSON.stringify(obj)
				+ "</td></tr>";
	}
	$("#sentMessageRawTable tbody").html(dynamicRow);
};

/**
 * The purpose of this function is to craete raw view after query operation.
 * @param json
 */
sentMessage.prototype.createRawQueryResponseTable = function (json, toggleMode) {
	$('#btnDeleteSentMessage').attr('disabled', 'disabled');
	$('#btnDeleteSentMessage').addClass('deleteBtnDisabled');
	sessionStorage.queryDataSentMessage = JSON.stringify(json);
	var recordSize = json.length;
	var INLINECOUNTQUERY = "$inlinecount=allpages";
	
	var noDataMessage = getUiProps().MSG0131;
	if (recordSize > 0) {
		if (sessionStorage.queryType === INLINECOUNTQUERY) {
			$('#rowInlinecountID').html(sessionStorage.recordCountSentMessage);
			document.getElementById("dvRowCountSentMessage").style.display = "block";
		}
		if(toggleMode){
			recordCount = (parseInt(sessionStorage.selectedPageNoSentMessage)-1)*maxRowsForSentMessage;
			if(recordCount < 0){
				recordCount = 0;
			}
		}else{
			recordCount = 0;
		}
		uSentMessage.createChunkedRawQuerySentMessageTable(json, recordCount);
		$(".pagination").show();
		$(".pagination").remove();
/*		uOdataQuery.createPagination(recordSize, "",
				maxRowsForSentMessage, $("#sentMessageRawTable"), "#resultPaneSentMessage", json, "", "", uSentMessage.createChunkedRawQuerySentMessageTable,
				"SentMessage");*/
		var tableID = $('#sentMessageRawTable');
		objCommon.createPaginationView(recordSize, maxRowsForSentMessage, tableID, uSentMessage, json, uSentMessage.createChunkedRawQuerySentMessageTable, "SentMessage");
		if(toggleMode){
			var tableID = $("#sentMessageRawTable");
			var totalPageNo = Math.ceil(recordSize / maxRowsForSentMessage);
			var selectedPageNo = sessionStorage.selectedPageNoSentMessage;
			uSentMessage.maintainPageState(selectedPageNo, tableID, maxRowsForSentMessage, totalPageNo);
		}
	} else if (recordSize === 0) {
		var noDataRawView = "<tr><td style='border:none;'><div id='dvNoEntityCreated' class='dvNoDataJsonView'>"
				+ noDataMessage + "</div></td></tr>";
		$("#sentMessageRawTable tbody").html(noDataRawView);
	}
};

/**
 * The purpose of this query is to check expand query from entererd query
 * @returns {Boolean}
 */
sentMessage.prototype.checkExpandQuery = function () {
	var ISEXPAND = "$expand"; 
	var expandNotSupportedMessage = getUiProps().MSG0183;
	if (sessionStorage.selectQueryType === ISEXPAND) {
		errorSentMsgQuery.innerHTML = expandNotSupportedMessage;
		return false;
	}
};

/**
 * The purpose of this function is check filter query from entered query
 * @returns {Boolean}
 */
sentMessage.prototype.checkFilterQuery = function () {
	var ISFILTER = "$filter"; 
	var filterNotSupportedMessage = getUiProps().MSG0184;
	if (sessionStorage.selectQueryType === ISFILTER) {
		$("#dvSentErrorMessage").show();
		errorSentMsgQuery.innerHTML = filterNotSupportedMessage;
		return false;
	}
};

/**
 * The purpose of this function is to add and remove hover effect
 * on sort by date label.
 */
sentMessage.prototype.sortByDateHoverEffect = function () {
	$("#sortWrapperOData").hover(function(){
		$("#sortdownArrowOData ").css("background","url(./images/sprite.png) no-repeat 40% -578px");
		 $("#sortTextOData ").css("color","#c80000");
	 },function(){
		  $("#sortdownArrowOData ").css("background","url(./images/sprite.png) no-repeat 40% -601px");
		  $("#sortTextOData ").css("color","#1b1b1b");
	});
};

/**
 * The purpose of this function is to check fullTExt query option from eneterd query string 
 * @returns {Boolean}
 */
sentMessage.prototype.checkFullTextSearchQuery = function () {
	var ISFULLTEXT = "q"; 
	var fullTextSearchNotSupportedMessage = getUiProps().MSG0185;
	if (sessionStorage.selectQueryType === ISFULLTEXT) {
		$("#dvSentErrorMessage").show();
		errorSentMsgQuery.innerHTML = fullTextSearchNotSupportedMessage;
		return false;
	}
};

/**
 * The purpose of this function is to create header for sent message table 
 */
sentMessage.prototype.createHeader = function(){
	var index = 0;
	var dynamicHeader = '';
	dynamicHeader += "<tr class='entityTableHead'>";
	dynamicHeader += "<th class='entityTableHeadChkBox dynamicRowSentMessage' style='padding-left:0px;width:23px'><input type='checkbox' onclick='uSentMessage.checkSelectAll(this);' class='checkBox cursorHand' id='chkSelectall'></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col1'><div id='propTextID_"
	+ index
	+ "' class='entityHeadText' title='ID'>ID</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col2'><div id='propTextCreatedOn_"
	+ index
	+ "' class='entityHeadText' title='Created On'>Created On</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col3'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Updated On'>Updated On</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col4'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='To'>To</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col5'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Box.Name'>Box.Name</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col6'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Metadata-Etag'>Metadata-Etag</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col7'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Metadata-Type'>Metadata-Type</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col8'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Metadata-URI'>Metadata-URI</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col9'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='InReplyTo'>InReplyTo</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col10'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='ToRelation'>ToRelation</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col11'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Type'>Type</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col12'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Title'>Title</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col13'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText dynamicRowSentMessage' title='Body'>Body</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col14'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='Priority'>Priority</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col15'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='RequestRelation'>RequestRelation</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader = dynamicHeader
	+ "<th class='entityTableColHead dynamicRowSentMessage'><div class = 'col16'><div id='propTextUpdatedOn_"
	+ index
	+ "' class='entityHeadText' title='RequestRelationTarget'>RequestRelationTarget</div><div id='sortIcon' class='sortIcon'></div></div></th>";
	dynamicHeader += "</tr>";
	$("#sentMessageTable thead tr").remove();
	$("#sentMessageTable thead").append(dynamicHeader);
};

/*
sentMessage.prototype.checkAllSentMessage = function (chkBox) {
	var buttonId = '#btnDeleteSentMessage';
	objCommon.assignEntityCheckBoxSelect(chkBox, buttonId, '', 'chkBox', 49, document.getElementById("chkSelectall"));
	objCommon.showSelectedRow(document.getElementById("chkSelectall"),"row","rowid");
};*/

/**
 * The purpose of this function is set dynamic width of table tbody
 */
sentMessage.prototype.setDynamicWidthForGrid = function(){
	var width = $(window).width();
	var leftPanelWidth = $('#leftPanel').width();//Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var gridWidth = rightPanelWidth - 52;
	if (width>1280) {
		$("#sentMessageRawTable").css("min-width",gridWidth + "px");
		$("#sentMessageRawTable thead").css("min-width",gridWidth + "px");
		$("#sentMessageRawTable tbody").css("min-width",gridWidth + "px");
		
		$("#sentMessageTable").css("min-width",gridWidth + "px");
		$("#sentMessageTable thead").css("min-width",gridWidth + "px");
		$("#tblSentMessageTBody").css("min-width",gridWidth + "px");
	}else{
		$("#sentMessageRawTable").css("min-width","1228px");
		$("#sentMessageRawTable thead").css("min-width","1228px");
		$("#sentMessageRawTable tbody").css("min-width","1228px");
		
		$("#sentMessageTable").css("min-width","1228px");
		$("#sentMessageTable thead").css("min-width","1228px");
		$("#tblSentMessageTBody").css("min-width","1228px");
	} 
};

$(document).ready(function() {
	$("#txtBoxQuerySentMessage").val("/SentMessage");
	uSentMessage.createSentMessageTable();
	$("#btnRawSentMessage").click(function() {
		$("#dvSentErrorMessage").hide();
		var jsonSentMessage = uSentMessage.getSentMessageJson();
		var sentMessageDataSet = JSON.stringify(jsonSentMessage);
		uSentMessage.rawIconClick(sentMessageDataSet,jsonSentMessage.length);
	});
	
	$("#btnGridSentMessage").click(function() {
		$("#dvSentErrorMessage").hide();
		$(".paginationWrapper").show(); 
		$("#sortWrapperOData").css("border-right", "1px solid #565656");
		$("#dvSentMessageRawTable").hide();
		$("#btnGridSentMessage").css("pointer-events","none");
		$("#sentMessageTableDiv").show();
		$("#btnRawSentMessage").removeClass('odataRawIconSelected');
		$("#btnRawSentMessage").addClass('odataRawIconUnselected');
		$("#btnGridSentMessage").removeClass('odataGridIconUnselected');
		$("#btnGridSentMessage").addClass('odataGridIconSelected');
		uSentMessage.setDynamicWidthForGrid();
		$("#entityGridTbody").css('width', 'auto');
		var target = document.getElementById('spinner');
			spinner = new Spinner(opts).spin(target);
			setTimeout(function() {
				$("#sentMessageTable").scrollLeft(0);
				$("#entityGridTbody").scrollTop(0);
				//uSentMessage.createReceivedMessageTable();
				var json = uSentMessage.getSentMessageJson();
				uSentMessage.createSentMessageTableQuery(json.length, json);
				if (spinner != undefined){
					spinner.stop();
					$("#btnGridSentMessage").css("pointer-events","all");
				}
			}, 50);
	});
	
	
	uSentMessage.sortByDateHoverEffect();
	/*$("#btnRawSentMessage").click(function() {
		uSentMessage.rawIconClick();
	});*/
	$("#btnGridSentMessage").click(function() {
		$("#chkSelectall").attr('checked', false);
		uSentMessage.clickGridTab();
	});
	$("#btnDeleteSentMessage").click(function() {
		openCreateEntityModal('#sentMessageDeleteModalWindow', '#sentMessageDeleteDialogBox', 'btnCancelSentMessage');
	});
	$("#btnSendMessageDelete").click(function() {
		uSentMessage.deleteMultipleMessages();
	});
	$("#btnGoSentMessage").click(function() {
		$("#dvSentErrorMessage").hide();
		uSentMessage.processQuery();
	});
});

/**
 * Teh purpose of this function is to implement select row functionality 
 * @param rowNumber
 */
sentMessage.prototype.rowSelect = function(rowIndex) {
	objCommon.rowSelect(this,'rowid', 'chkBox','row','btnDeleteSentMessage','chkSelectall', rowIndex, totalRecordsize);
};

/**
 * Following method checks if the grid icon is selected or not.
 * @returns
 */
sentMessage.prototype.isGridSelected = function () {
	var isGridBtnSelected = $("#btnGridSentMessage").hasClass("odataGridIconSelected");
	return isGridBtnSelected;
};

 /**
  * Following method checks if the raw view icon is selected or not.
  */
sentMessage.prototype.isRawViewSelected = function () {
	var isRawBtnSelected = $("#btnRawSentMessage").hasClass("odataRawIconSelected");
	return isRawBtnSelected;
};

sentMessage.prototype.setSentMessageGridHeight = function(){
	var viewPortHeight = $(window).height();
	var gridHeight = viewPortHeight - 244 - 47;
	if (viewPortHeight > 650) {
		$("#entityGridTbody").css("max-height", gridHeight);
		var tblReceivedMessageHeight = gridHeight + 37;
		$("#sentMessageRawTable").css("min-height", tblReceivedMessageHeight);
		$("#sentMessageRawTable tbody").css("max-height", tblReceivedMessageHeight);
		$("#sentMessageTable").css("min-height", tblReceivedMessageHeight);
		
	} else if (viewPortHeight <= 650) {
		$("#sentMessageRawTable").css("min-height", '396px');
		$("#sentMessageRawTable tbody").css("max-height", '396px');

		$("#sentMessageTable").css("min-height", '396px');
		$("#entityGridTbody").css("max-height", '359px');
	}

};

sentMessage.prototype.checkExpandQuery = function () {
	var ISEXPAND = "$expand"; 
	var expandNotSupportedMessage = getUiProps().MSG0183;
	if (sessionStorage.selectQueryType === ISEXPAND) {
		$("#dvSentErrorMessage").show();
		errorSentMsgQuery.innerHTML = expandNotSupportedMessage;
		return false;
	}
};

sentMessage.prototype.displayErrorRawView = function(message) {
	$('#sentMessageRawTable tbody').empty();
	objCommon.displayEmptyMessageInGrid(message,
			"SentMessage");
	$("#sentMessageRawTable").css("overflow", "auto");
	$("#dvemptyTableMessage").css("margin-top", "7%");
	$("#sentMessageRawTable").scrollLeft(0);
};

sentMessage.prototype.displayErrorNotification = function (message) {
	$('#sentMessageTable tbody').empty();
	objCommon.displayEmptyMessageInGrid(message, "SentMessage");
	$("#sentMessageTable").css("overflow", "auto");
	$("#dvemptyTableMessage").css("margin-top", "7%");
	objCommon.disableButton('#btnDeleteSentMessage');
	$("#chkSelectall").attr('checked', false);
	$("#lblCheckSelectAllSentMessage").css('cursor','default');
	$("#sentMessageTable").scrollLeft(0);
};

sentMessage.prototype.createSentMessageTableQuery = function (totalRecordsize,json) {
	var token = getClientStore().token;
	sessionStorage.token = token;
	if (totalRecordsize == 0) {
		var message = getUiProps().MSG0345;
		uSentMessage.displayErrorNotification(message);
	} else {
		document.getElementById("dvemptyTableMessage").style.display = "none";
		var recordNo = 0;
		this.createChunkedSentMessageTable(json, recordNo);
		var tableID = $('#sentMessageTable');
		objCommon.createPaginationView(totalRecordsize, objCommon.MAXROWS,
				tableID, uSentMessage, json,
				this.createChunkedSentMessageTable, "SentMessage");
		objCommon.checkCellContainerVisibility();
	}
};

/**
 * Following method displays inline count messaga.
 * @param inlineCount count.
 */
sentMessage.prototype.showInlineCount = function (inlineCount) {
	$("#rowCountSentMessageBlock").css("display", 'table');
	document.getElementById("rowCountSentSuccessmsg").innerHTML = getUiProps().MSG0348 + " "
			+ inlineCount;
	objCommon.centerAlignRibbonMessage("#rowCountSentMessageBlock");
	
};


$(window).resize(function(){
	uSentMessage.setDynamicWidthForGrid();
	uSentMessage.setSentMessageGridHeight();
	$("#sentMessageTable > *").width($("#sentMessageTable").width() + $("#sentMessageTable").scrollLeft());
	$("#sentMessageRawTable > *").width($("#sentMessageRawTable").width() + $("#sentMessageRawTable").scrollLeft());
});

