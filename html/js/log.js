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
function log() {
}

var uEventLog = new log();

/**
 * The purpose of this function is to set property pane header.
 */
log.prototype.setPropsPaneHeader = function(strHeader) {
	$('#eventLogPropsPaneHeader').html(strHeader);
	$('#eventLogPropsPaneHeader').attr('title', strHeader);
};

/**
 * The purpose of this function is to create rows for event log folder
 * table.
 * 
 * @param count
 * @param len
 * @param constLogFolderName
 * @param logFolderName
 * @returns {String}
 */
log.prototype.createRowsForLogFolderTable = function (count, len, constLogFolderName, logFolderName) {
	var dynamicTable = '';
	dynamicTable += '<tr class="dynamicRowLogFolder entityColDataChkBox fixed" id="rowID_'+count+'" onclick="objCommon.rowSelect(this,'+ "'rowID_'" +','+ "'chkBoxID_'"+','+ "'row'" +','+ "''" +','+ "'logchkSelectall'" +','+ count +',' + len + ','+ "''" + ','+"''"+','+"''"+','+"''"+','+"'logTable'"+');">';
	dynamicTable += '<td class="boxDetailTabCol1"><input type="checkbox" name="case" class="chkClass checkBox cursorHand regular-checkbox big-checkbox" id="chkBoxID_' + count + '" value="' + count + '"/><label for="chkBoxID_' + count + '" class="customChkbox checkBoxLabel"></label></td>';
	dynamicTable += '<td class="boxDetailTabCol2"><div class="collectionNameLink wdFolderIcon" onclick="uEventLog.createEventLogDetailsTable('+constLogFolderName+');">'+logFolderName+'</div></td>';
	dynamicTable += '<td class="boxDetailTabCol3"></td>';
	dynamicTable += '<td class="boxDetailTabCol4"></td>';
	dynamicTable += '</tr>';
	return dynamicTable;
};

/**
 * The purpose of this function is to create event log folder table.
 */
log.prototype.createEventLogFolderTable = function() {
	$('.dynamicRowLogFolder').remove();
	this.disableDownloadButton();
	$("#dvEmptyTableLogsArchive").hide();
	$("#logchkSelectall").attr('disabled', false);
	$("#logchkSelectall").attr('checked', false);
	$('#anchorRootLog').removeClass("linkLogBreadCrumb");
	$('#dvLogFolder').html('');
	var logFolderArray = [];
	var constArchive = "archive";
	var constCurrent = "current";
	logFolderArray.push(constArchive);
	logFolderArray.push(constCurrent);
	this.setPropsPaneHeader("Log");
	var dynamicTable = '';
	var len = logFolderArray.length;
	for (var count = 0; count < len; count++) {
		var logFolderName = logFolderArray[count];
		var constLogFolderName = "'"+logFolderName+"'";
		dynamicTable += this.createRowsForLogFolderTable(count, len, constLogFolderName, logFolderName);
	}
	$("#logTable tbody").append(dynamicTable);
	$(".boxDetailTable tbody tr:odd").css("background-color", "#F4F4F4");
	uEventLog.setDynamicWidth();
};

/**
 * The purpose of this function is to create event log details table.
 * 
 * @param logFolderName
 */
log.prototype.createEventLogDetailsTable = function (logFolderName) {
	$("#logTable").find("tbody tr").remove();
	$('#anchorRootLog').addClass("linkLogBreadCrumb");
	$("#logchkSelectall").attr('checked', false);
	
	document.getElementById("dvLogFolder").innerHTML = logFolderName;
	this.setPropsPaneHeader(logFolderName);
	this.disableDownloadButton();
	if (logFolderName == "current") {
		var dynamicTable = '';
		var count = 0;
		var len = 1;
		var logFileName = "default.log";
		var type = "logFile";
		var fileType = "'"+type+"'";
		dynamicTable += '<tr class="dynamicRowLogFolder entityColDataChkBox fixed" id="rowID_'+count+'" onclick="objCommon.rowSelect(this,'+ "'rowID_'" +','+ "'chkBoxID_'"+','+ "'row'" +','+ "''" +','+ "'logchkSelectall'" +','+ count +',' + len + ','+ "''" + ','+"''"+','+false+','+fileType+','+"'logTable'"+');">';
		dynamicTable += '<td class="boxDetailTabCol1"><input type="checkbox" name="case" class="chkClass checkBox cursorHand regular-checkbox big-checkbox" id="chkBoxID_' + count + '" value="' + count + '"/><label for="chkBoxID_' + count + '" class="customChkbox checkBoxLabel"></label></td>';		
		dynamicTable += '<td class="boxDetailTabCol2"><div id="defaultLogFileName" class="collectionNameLink wdFileIcon" title="'+logFileName+'">'+logFileName+'</div></td>';		
		dynamicTable += '<td class="boxDetailTabCol3"></td>';
		dynamicTable += '<td class="boxDetailTabCol4"></td>';
		dynamicTable += '</tr>';
		$("#logTable tbody").append(dynamicTable);
		$(".boxDetailTable tbody tr:even").css("background-color", "#F4F4F4");
	}
	if (logFolderName == "archive") {
		$("#logchkSelectall").attr('disabled', true);
		var emptyBoxMsg = '<tr id="msg"><td id="msg" colspan="4"><div id="dvEmptyTableLogsArchive" style="margin-left: 33%;margin-top:15%;width:230px;" class="emptyBoxMessage">'+getUiProps().MSG0381+'</div></td></tr>';
		$("#logTable tbody").append(emptyBoxMsg);
		if (sessionStorage.selectedLanguage == 'ja') {
			$("#dvEmptyTableLogsArchive").addClass('japaneseFont');
			$("#dvEmptyTableLogsArchive").css('width', '342px');
		}
	}
};

/**
 * The purpose of this function is to get path of event log file.
 * 
 * @param baseUrl
 * @param cellName
 * @param logFolderName
 * @param logFileName
 * @returns {String}
 */
log.prototype.getLogFilePath = function (baseUrl, cellName, logFolderName, logFileName) {
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var accessor = objCommon.initializeAccessor(baseUrl, cellName,"","");
    var objCellManager = new _pc.CellManager(accessor);
    var path = objCellManager.getCellUrl(cellName);
	path += "__log/";
	path += logFolderName;
	if (!path.endsWith("/")) {
		path += "/";
	}
	path += logFileName;
	return path;
};

/**
 * The purpose of this function is to refresh event log table.
 */
log.prototype.refreshEventLogTable = function() {
	uFileDownload.disableDownloadArea();
	var isInsideFolder = $('#anchorRootLog').hasClass("linkLogBreadCrumb");
	if (isInsideFolder) {
		var logFolderName =  document.getElementById("dvLogFolder").innerHTML;
		this.createEventLogDetailsTable(logFolderName);
		return true;
	}
	this.createEventLogFolderTable();
};

/**
 * The purpose of this function is to perform check all operation.
 * 
 * @param cBox
 */
log.prototype.checkAll = function (cBox) {
	var logFolderName =  document.getElementById("dvLogFolder").innerHTML;
	
	if (cBox.checked == true) { 
		$("#logTable tbody tr ").addClass('selectRow');
		$(".chkClass").attr('checked', true); 
		if (logFolderName.length > 0) {
			this.enableDownloadButton();
		}
		return true;
	}
	$("#logTable tbody tr ").removeClass('selectRow');
	$(".chkClass").attr('checked', false);
	this.disableDownloadButton();
	var isInsideFolder = $('#anchorRootLog').hasClass("linkLogBreadCrumb");
	if(!isInsideFolder) {
		this.setPropsPaneHeader("Log");
	}
};

/**
 * The purpose of this function is to enable download button. 
 */
log.prototype.enableDownloadButton = function () {
	var logFileName = this.getSelectedLogFileName();
	this.setPropsPaneHeader(logFileName);
	$("#dvDownLoadIcon").removeClass();
	$("#dvDownLoadText").removeClass();
	$("#dvDownLoadText").addClass('japaneseFont');
	$("#dvDownLoadIcon").addClass("downloadWebDavIconEnabled");
	$("#dvDownLoadText").addClass("downloadWebDavTextEnabled");
	uEventLog.downloadHoverEffect();
	document.getElementById('downloadWebDavWrapper').style.pointerEvents = 'auto';
};


/**
 * The purpose of this function is to disable download button.
 */
log.prototype.disableDownloadButton = function() {
	var logFolderName =  document.getElementById("dvLogFolder").innerHTML;
	this.setPropsPaneHeader(logFolderName);
	$("#dvDownLoadIcon").removeClass();
	$("#dvDownLoadText").removeClass();
	$("#dvDownLoadText").addClass('japaneseFont');
	$("#dvDownloadIcon").removeAttr('style');
	$("#dvDownloadText").removeAttr('style');
	$("#dvDownLoadIcon").addClass("downloadWebDavIconDisabled");
	$("#dvDownLoadText").addClass("downloadWebDavTextDisabled");
	document.getElementById('downloadWebDavWrapper').style.pointerEvents = 'none';
};

/**
 * The purpose of this method is to show hover effect on Download file area.
 */
log.prototype.downloadHoverEffect = function(){
	$("#downloadWebDavWrapper").hover(function(){
		$("#dvDownLoadIcon").css("background","url(./images/newSprite.png) no-repeat -16px -823px");
		$("#dvDownLoadText").css("color","#c80000");
		$("#downloadWebDavWrapper").css("cursor","pointer");
	},function(){
		$("#dvDownLoadIcon").css("background","url(./images/newSprite.png) no-repeat -16px -790px");
		$("#dvDownLoadText").css("color","#1b1b1b");
	});
};


log.prototype.getSelectedLogFileName = function(){
	var logFileName = "";
	var noOfCollections = $("#logTable tbody tr").length;
	for(var index = 0; index < noOfCollections; index++){
		if($("#rowID_" + index).hasClass("selectRow")){
			logFileName = $('#defaultLogFileName').attr('title');
			break;
		}
	}
	return logFileName;
};

$(window).resize(function(){
	uEventLog.setDynamicWidth();
});

log.prototype.setDynamicWidth = function(){
	var height = $(window).height();
	$("#webDavDetails").css('min-height', "425px");
	if (height>=650) {
		$("#webDavDetails").css('min-height', height - 225);
	}
};