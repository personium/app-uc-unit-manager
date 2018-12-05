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
function odata() {
}

var objOdata = new odata();
odata.prototype.cellName = sessionStorage.selectedcell;
odata.prototype.boxName = sessionStorage.boxName;
odata.prototype.contextRoot = sessionStorage.contextRoot;
odata.prototype.fileName = '';
odata.prototype.fileType = '';
odata.prototype.contentType ='';
odata.prototype.spinner = null;
odata.prototype.currentCollectionPath = '';
odata.prototype.selectedBreadCrumId ='';
odata.prototype.selectedView = "";
odata.prototype.contentTypeHashTable = new HashTable({
	log: 'text/plain', 
	epf: 'text/plain',
	java: 'text/plain',
	lzh: 'application/x-compress',
	bar: 'application/zip',
	rar: 'application/x-rar-compressed',
	psd: 'image/vnd.adobe.photoshop',
	json: 'application/json',
	map: 'application/octet-stream',
	dat: 'application/octet-stream'
	}
);
var sbSuccessful = '';
var sbConflict = '';
var collectionPath = sessionStorage.boxName;
var boxHeirarchyPath = sessionStorage.boxName;
var folderClicked = false;
var boxRootpath ="";

/**
 * The purpose of this method is to get accessor values. 
 * @returns
 */
odata.prototype.getAccessor  = function() {
	var baseUrl  = getClientStore().baseURL; 
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	return accessor;
};

odata.prototype.getRootPath  = function() {
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	if(boxName == mainBoxValue){
		boxName = getUiProps().MSG0293;
	}
	return sessionStorage.selectedcellUrl + boxName;
};

odata.prototype.openWebDavCollection = function(){
	var id = objCommon.isSessionExist();
	if (id != null) {
		boxRootpath = this.getRootPath();
		this.setCollectionPath(boxRootpath);
		objOdata.setBoxDetails(sessionStorage.boxName,boxRootpath);
		objOdata.createTable(boxRootpath);
	} else {
		window.location.href = contextRoot;
	}
};

/*odata.prototype.createWebDavRootView = function(){
	var rootBoxName = $('#tblBoxBreadCrum #columnId_0').text();
	if(rootBoxName!==null && rootBoxName!=="") {
		uBoxDetail.initializePage(sessionStorage.boxName);
		this.delBreadCrumRows(1);
		this.setBoxDetails(null, null);
		$("#webDavTable thead tr").removeClass('mainTableHeaderRow');
		$("#webDavTable tbody").removeClass('webDavTableTbody');
		$("#staticAclMessage").hide();
		
		//Following ensures that the create icon used for opening sub menu remains in the disabled state when the root is clicked.
		objOdata.removeClassCollectionSubMenu();
		objOdata.disableCollectionSubMenu();
	}
};
*/
/**
 * The purpose of this method is to fetch path of the collection.
 * @returns {String}
 */
odata.prototype.getPath = function() {
	var baseUrl = getClientStore().baseURL;
	var accessor = objCommon.initializeAccessor(baseUrl, odata.prototype.cellName,"","");
    var objCellManager = new _pc.CellManager(accessor);
    var path = objCellManager.getCellUrl(odata.prototype.cellName);
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	if (boxName == mainBoxValue) {
		boxName = getUiProps().MSG0293;
	}
	if (boxHeirarchyPath == undefined) {
		boxHeirarchyPath = boxName;
	}
	// it is to replace the [default] BoxName with the --
	boxHeirarchyPath = boxHeirarchyPath.replace(mainBoxValue, getUiProps().MSG0293);
	path += boxHeirarchyPath;
	return path;
};

odata.prototype.setCollectionPath = function(Path) {
	this.currentCollectionPath = Path;
	sessionStorage.Path = Path;
};

/**
 * The purpose of this function is to disable delete button when no row is
 * selected in grid
 */
odata.prototype.disableDeleteButton = function(id) {
    if ($(id).hasClass('deleteBtn')) {
        $(id).attr('disabled', true);
        $(id).removeClass('deleteBtn');
        $(id).addClass('deleteBtnDisabled');
    }
};

/**
 * The purpose of this function is to enable delete button when a row is selected
 * in grid 
 */
odata.prototype.enableDeleteButton = function(id) {
    if ($(id).hasClass('deleteBtnDisabled')) {
        $(id).attr('disabled', false);
        $(id).removeClass('deleteBtnDisabled');
        $(id).addClass('deleteBtn');
    }
};

/**
 * The purpose of this function is to maintain last breadcrum arrow position
 * on the basis of folder check
 */
odata.prototype.checkFolderType = function (collectionType) {
    var tdArrowId = "#"+sessionStorage.ArrowId;
    var arrCollectionType = collectionType.split(',');
    $(tdArrowId).addClass('displayNone');
    for (var i= 0; i<arrCollectionType.length; i++) {
        if(arrCollectionType[i] == "folder") {
            $(tdArrowId).removeClass('displayNone');
            break;
        }
    }
};

/**
 * The purpose of this method is to fetch collection list.
 * @returns
 */
odata.prototype.getCollectionList = function(paracollectionURL) { 

	if (paracollectionURL == undefined) {
		var path = objOdata.getPath();
	} else {
		path = paracollectionURL;
	}
	var accessor = objOdata.getAccessor();
	var objDavCollection = new _pc.DavCollection(accessor,path);
	var collectionList  = objDavCollection.getResourceList(path);
	var sortedCollectionByLastModifiedDate = objCommon.sortByKey(collectionList, 'Date');
	return sortedCollectionByLastModifiedDate;
};

/**
 * The purpose of this method is to fetch collection name.
 * @param path
 * @returns
 */
odata.prototype.getName = function(path) {
	var collectionName = path;
	var recordsCount = 0;
	if (collectionName != undefined) {
		recordsCount = collectionName.length;
		var lastIndex = collectionName.lastIndexOf("/");
		if (recordsCount - lastIndex === 1) {
			collectionName = path.substring(0, recordsCount - 1);
			recordsCount = collectionName.length;
			lastIndex = collectionName.lastIndexOf("/");
		}
		collectionName = path.substring(lastIndex + 1, recordsCount);
	}
	return collectionName;
};



/**
 * The purpose of this method is to close add collection dropdown
 */
odata.prototype.closeAddCollectionDropdown = function(){
    $("#submenu").hide();
};

/**
 * The purpose of this method is to open Add Collection Dropdown
 */
odata.prototype.openAddCollectionDropDown = function(){
	var id = objCommon.isSessionExist();
	var contextRoot = sessionStorage.contextRoot;
	if (id != null) {
		if ($("#submenu").is(":visible")) {
			document.getElementById('submenu').style.display = 'none';
		} else {
			document.getElementById('submenu').style.display = 'block';
		}
	} else {
		window.location.href = contextRoot;
	}
};

/** The purpose of this method is to check the collection type and perform actions accordingly.
 * @param type
 * @param collectionName
 * @param collectionURL
 */
odata.prototype.checkCollectionType = function(type, collectionName,
		collectionURL, count) {
	var token = getClientStore().token;
	sessionStorage.tempToken = token;
	if (type == "p:odata") {
		sessionStorage.collectionName = collectionName;
		sessionStorage.selectedCollectionURL = collectionURL;
		objOdata.selectedView = "odata";
		$("#tertiaryBar").hide();
		uDataManagement.openODataPage(collectionURL, collectionName);
	}
	if (type == "folder") {
		isClickedFolder = true;
		this.clickFolder(collectionName, collectionURL);
		setTimeout(function() {
			objOdata.refreshTable();
		}, 500);
	}
	if (type == "file") {
		uFileDownload.downloadFileOnClick(collectionName, collectionURL);
	}
	if (type == "p:service") {
		sessionStorage.resourcetype = 'p:service';
		this.clickFolder(collectionName, collectionURL, type);
		objOdata.displayPluginSource(collectionName);
		uBoxDetail.populatePropertiesList(collectionURL, collectionURL, collectionName, false, "p:service");
		uBoxAcl.getAclSetting(collectionURL, sessionStorage.boxName);
	}
};

/**
 * The purpose of this function is to display plugin icons
 * and hide other icons.
 */
odata.prototype.displayPluginIcons = function () {
	$("#dvRefreshIcon").removeClass('addBorderOdataRefreshIcon');
	$("#dvRefreshIcon").addClass('removeBorderOdataRefreshIcon');
	$("#createWebDavWrapper").hide();
	$("#uploadWebDavWrapper").hide();
	$("#downloadWebDavWrapper").hide();
	$("#btnDeleteCollection").show();
	$("#btnServiceRegistration").show();
};

/**
 * The purpose of this function is to hide plugin icons
 * and display other icons.
 */
odata.prototype.hidePluginIcons = function () {
	$("#dvRefreshIcon").removeClass('addBorderOdataRefreshIcon');
	$("#dvRefreshIcon").addClass('removeBorderOdataRefreshIcon');
	$("#createWebDavWrapper").show();
	$("#uploadWebDavWrapper").show();
	$("#downloadWebDavWrapper").show();
	$("#btnDeleteCollection").show();
	$("#btnServiceRegistration").hide();
};

/**
 * The purpose of this method is to create rows for the grid.
 */
odata.prototype.createRows = function(dynamicTable, collectionName,
		lastModifiedDate, collectionURL, type, count, contentLength) {
	if (contentLength == undefined || contentLength == 'undefined') {
		contentLength = "-";
	}
	var icon = "";
	var engineServiceArrow = "";
	if(type=="folder"){
		icon = "wdFolderIcon";
		engineServiceArrow = "";
	}else if(type=="p:odata"){
		icon = "wdOdataIcon";
		engineServiceArrow = "";
	}else if (type == "file"){
		icon = "wdFileIcon";
		engineServiceArrow = "";
	}else if (type == "p:service"){
		icon = "wdEngineServiceIcon";
		engineServiceArrow = "";
}
	var collectionNameModified = "'" + collectionName + "'";
	var collectionURL = "'" + decodeURIComponent(collectionURL) + "'";
	dynamicTable += '<td width="1%" class="boxDetailTabCol1"><input  type="checkbox" id="wdchkBox'+count+'" class="subFolderChkBox cursorHand case cursorHand regular-checkbox big-checkbox" name="boxDetailCase" value='+collectionNameModified+'/><label for="wdchkBox'+count+'" class="customChkbox checkBoxLabel"></label></td>';
	/*dynamicTable += '<td width="60%" id = "col'+count+'" title= '+ collectionNameModified + ' class="boxDetailTabCol2"><div id="dvServiceCollectionArrow_'+count+'" class="'+ engineServiceArrow +'" onclick="objOdata.toggleArrow('+count+','+collectionNameModified+');"></div><div class="collectionNameLink '+ icon +'"><label id="boxDetailLink_'+ count +'" style="cursor: pointer"  onclick="objOdata.checkCollectionType('*/
	dynamicTable += '<td style="max-width:400px;" width="60%" id = "col'+count+'" title= '+ collectionNameModified + ' class="boxDetailTabCol2"><div id="dvServiceCollectionArrow_'+count+'" class="'+ engineServiceArrow +'" onclick="objOdata.toggleArrow('+count+','+collectionNameModified+');"></div><div class="collectionNameLink '+ icon +' mainTableEllipsis"><label id="boxDetailLink_'+ count +'"  style="cursor: pointer"  onclick="objOdata.checkCollectionType('
	+ "'" + type + "',"
	+ collectionNameModified
	+ ','
	+ collectionURL
	+ ','+count+');">'
	+ collectionName + '</label></div></td>';
	dynamicTable += "<td width='14%;' style='max-width:92px;' name = 'Size' class='boxDetailTabCol3'><div class='mainTableEllipsis' title= "+ contentLength + ">"+contentLength+"</div></td>";
	dynamicTable += "<td width='25%' name = 'Date' class='boxDetailTabCol4'>"
		+ lastModifiedDate + "</td>";
	/*dynamicTable += '<td class="boxDetailTabCol5"><div id="row..'+count+'" style="display:none"><a href="#" class="modalBox downloadIcon"  rel="375,208" title="Download">Download</a><a href="#" class="modalBox deleteIcon" rel="375,208" title="Delete" onclick="objOdata.getCollectionDetails('+collectionName+');">Delete</a></div></td>';*/
	dynamicTable += "</tr>";
	return dynamicTable;
};

/********************* ENGINE SERVICE VIEW : START *********************/ 

odata.prototype.showEngineServiceButtons = function () {
    /*$('#btnCreateCollection').hide();
    $('#btnUploadFile').hide();
    $('#btnServiceRegistration').show();
    $('#btnDeleteCollection').show();*/
};

/**
 * The purpose of this function is to show hide create, upload,
 * service registration and delete buttons.
 */
odata.prototype.showHideButtons = function () {
	/*$('#btnCreateCollection').show();
	$('#btnUploadFile').show();
	$('#btnServiceRegistration').hide();
	$('#btnDeleteCollection').show();
	$('#btnUploadFile').removeClass("downloadBtnDisabled");
	$('#btnUploadFile').attr("disabled",false);
	$('#btnUploadFile').addClass("importBtn");
	$('#properties').show();
	$('#aclSettings').show();
	$('#properties').show();
	$('#boxHeader').show();
	$('#ACLFiller').hide();
	var objBoxAcl = new boxAcl();
	var parentBoxName = objOdata.getName(collectionPath);
	objBoxAcl.setACLHeader(parentBoxName, 0);*/
};

/**
 * The purpose of this function is to add color to service engine
 * details table.
 * 
 * @param count
 */
odata.prototype.addColorToRows = function (count) {
    var tableId = "tblServiceCollectionDetails_"+count;
    var table = document.getElementById(tableId);
    var rows = table.getElementsByTagName("tr");
    var len = rows.length;
    for(var i = 0; i < len; i++) {
        if(i % 2 == 0){ 
            rows[i].className = "engineServiceEvenTR"; 
            $('.engineServiceEvenTR').css('background-color','#F4F4F4');
        } else { 
        }
    } 
};

/**
 * The purpose of this function is to show Upload button.
 */
odata.prototype.showUploadButton = function () {
	$("#createWebDavWrapper").hide();
	$("#uploadWebDavWrapper").show();
	$("#downloadWebDavWrapper").hide();
	$("#btnServiceRegistration").hide();
	$("#btnDeleteCollection").hide();
	$("#dvRefreshIcon").removeClass('removeBorderOdataRefreshIcon');
	$("#dvRefreshIcon").addClass('addBorderOdataRefreshIcon');
};

/**
 * The purpose of this function is to unselect other collections than engine service.
 * @param tableCount
 */
odata.prototype.unselectRow = function(tableCount,tableCount, index){
    var noOfCollectionRows = $("#webDavTable tbody tr").length;
    for(var index = 0; index < noOfCollectionRows; index++){
        if($("#wdrowid" + index).hasClass("selectRow")){
            $("#wdrowid" + index).removeClass("selectRow");
            $('#wdchkBox'+index).attr('checked', false);
        }
        if(tableCount != index){
            if( $("#tblServiceCollectionDetails_" + index) != undefined){
                var noOfFiles = $("#tblServiceCollectionDetails_" + index + " tbody tr").length;
                for(var innerIndex = 0; innerIndex < noOfFiles; innerIndex++){
                    $("#rowsrc_" + index + "_" + innerIndex).removeClass('selectSrcColRow');
                    $('#chkBox1_'+index + "_" + innerIndex).attr('checked', false);
                }
            }
        }
    }
    for(var index = 0; index < noOfCollectionRows; index++){
        if($("#dvSrc_" + index).hasClass("selectSrcRow")){
            $("#dvSrc_"+index).css("backgroundColor", "#fff");
        }
    }
};


/**
 * The purpose of this function is to return selected collection name from odata grid 
 */
odata.prototype.getSelectedCollectionNameOfPlugin = function(tableCount, count) {
	var collectionName = "";
	var noOfCollections = $("#tblServiceCollectionDetails tbody tr").length;
	for ( var index = 0; index < noOfCollections; index++) {
		if ($("#rowsrc_" + tableCount + "_" + index)
				.hasClass('selectSrcColRow')) {
			collectionName = document.getElementById("chkBox1_"
					+ tableCount + "_" + index).value;
			break;
		}
	}
	return collectionName;
};

/**
 * The purpose of this function is to perform operations after selecting a file
 * under Service Collection
 * 
 * @param tableCount
 * @param count
 */
odata.prototype.selectFileInServiceCollection = function(tableCount, count,
		collectionName, pluginPathWithSrc) {
	var targetID = event.target.id.indexOf("Link");
	if(targetID == -1) {
		$('#aclSettingsData').empty();
		$('#wdchkSelectall').attr('checked', false);
		uFileDownload.disableDownloadArea();
		var noOfSelectedRows = 0;
		var noOfFiles = $("#tblServiceCollectionDetails tbody tr").length;
		if (event.target.tagName.toUpperCase() !== "INPUT") {
			if ($(event.target).is('.customChkbox')
					&& event.target.tagName.toUpperCase() === "LABEL") {
				var obj = $("#rowsrc_" + tableCount + "_" + count);
				if ($('#chkBox1_' + tableCount + "_" + count).is(':checked')) {
					obj.removeClass('selectSrcColRow');
					$('#chkBox1_' + tableCount + "_" + count).attr('checked', true);
				} else {
					obj.addClass('selectSrcColRow');
					$('#chkBox1_' + tableCount + "_" + count)
							.attr('checked', false);
				}
			} else {
				var obj = $("#rowsrc_" + tableCount + "_" + count);
				obj.siblings().removeClass('selectSrcColRow');
				obj.addClass('selectSrcColRow');
				for ( var index = 0; index < noOfFiles; index++) {
					if (index != count) {
						$('#chkBox1_' + tableCount + "_" + index).attr('checked',
								false);
					}
				}
				$('#chkBox1_' + tableCount + "_" + count).attr('checked', true);
			}
		}
		objOdata.unselectRow(tableCount, tableCount, count);

		for ( var index = 0; index < noOfFiles; index++) {
			if ($('#chkBox1_' + tableCount + "_" + index).is(':checked')) {
				noOfSelectedRows++;
			}
		}
		if (noOfSelectedRows == 0) {
			objOdata.hidePluginIcons();
			$("#dvRefreshIcon").removeClass('removeBorderOdataRefreshIcon');
			$("#dvRefreshIcon").addClass('addBorderOdataRefreshIcon');
			$("#createWebDavWrapper").hide();
			objCommon.disableDeleteIcon('#btnDeleteCollection');
			var path = sessionStorage.selectedCollectionURL;
			var index = path.lastIndexOf("/");
			var subURI = path.substring(0, index);
			var folderName = $("#currentDirectoryName").text();
				uBoxDetail.populatePropertiesList(pluginPathWithSrc, pluginPathWithSrc, folderName, false,
						"folder");
			//uBoxAcl.getAclSetting(subURI, sessionStorage.boxName);
		}
		if (noOfSelectedRows == 1) {
			if (noOfFiles == 1) {
				$('#wdchkSelectall').attr('checked', true);
			}
			var selectedPluginName =  this.getSelectedCollectionNameOfPlugin(
					tableCount, count);
			if (!pluginPathWithSrc.endsWith("/")) {
				pluginPathWithSrc += "/";
			}
			var collectionInsidePluginPath = pluginPathWithSrc + selectedPluginName;
			$("#webDavDetailMessageBody").hide();
			uBoxDetail.populatePropertiesList(collectionInsidePluginPath,
					collectionInsidePluginPath, selectedPluginName, false, "file");
			//uBoxAcl.getAclSetting(collectionInsidePluginPath, sessionStorage.boxName);
			$("#webDavDetailBody").show();
			$("#dvRefreshIcon").removeClass('removeBorderOdataRefreshIcon');
			$("#dvRefreshIcon").addClass('addBorderOdataRefreshIcon');
			$("#createWebDavWrapper").hide();
			$("#uploadWebDavWrapper").show();
			$("#downloadWebDavWrapper").show();
			$("#btnDeleteCollection").show();
			$("#btnServiceRegistration").hide();
			objCommon.activateCollectionDeleteIcon("#btnDeleteCollection");
			objOdata.activateDownloadLink();
		}
		if (noOfSelectedRows > 1) {
			$("#dvRefreshIcon").removeClass('removeBorderOdataRefreshIcon');
			$("#dvRefreshIcon").addClass('addBorderOdataRefreshIcon');
			$("#createWebDavWrapper").hide();
			$("#uploadWebDavWrapper").show();
			$("#downloadWebDavWrapper").show();
			$("#btnDeleteCollection").show();
			$("#btnServiceRegistration").hide();
			objCommon.activateCollectionDeleteIcon("#btnDeleteCollection");
			uFileDownload.disableDownloadArea();
			uBoxAcl.showSelectedResourceCount(noOfSelectedRows);
			objOdata.setMarginForSelectedResourcesMessage();
		}
		if (noOfSelectedRows == noOfFiles) {
			$('#wdchkSelectall').attr('checked', true);
		}
	}
};

/**
 * The purpose of this function is to get folder levels.
 */
odata.prototype.getFolderLevels = function() {
	var collectionURL = sessionStorage.selectedCollectionURL;
	var urlArray = collectionURL.split("/");
	urlArray.splice(0,5);
	var folderPath = urlArray.join("/");
	if (folderPath.startsWith("/")) {
		folderPath = folderPath.substring(1, folderPath.length);
	}
	if (folderPath.endsWith("/")) {
		folderPath = folderPath.substring(0, folderPath.length - 1);
	}
	return folderPath;
};

/**
 * The purpose of this function is to get the Engine Service
 * collection type.
 * 
 * @returns {String}
 */
odata.prototype.getEngineServiceCollectionType = function() {
	var serviceType = "";
	//var noOfCollectionRows = $("#webDavTable tbody tr").length;
	//for ( var index = 0; index < noOfCollectionRows; index++) {
		if ($("#dvSrc").hasClass("selectSrcRow")) {
			serviceType = "p:service";
			//break;
		}
	//}
	return serviceType;
};
/*
 * odata.prototype.getPath = function() { var baseUrl =
 * getClientStore().baseURL; var path = baseUrl + odata.prototype.cellName +
 * "/"; path += collectionPath; return path; };
 */

odata.prototype.applyScrollCssOnPluginGrid = function () {
	var tbodyObject = document.getElementById("webDavTbody");
	if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
		$("#tblServiceCollectionDetails td:eq(2)").css("width", '14.5%');
	}
};

odata.prototype.showHideIconsforFilesInPlugin = function(isRefresh) {
	var pluginSource = getUiProps().MSG0295;
	$("#boxEditAclSettings").removeClass("editIconACLSettings");
	$("#boxEditAclSettings").addClass("disabledEditIconACLSettings");
	$("#currentDirectoryName").text(pluginSource);
	$("#currentDirectoryName").attr("title", pluginSource);
	$("#currentDirectoryIcon").css("background","url(./images/newSprite.png) no-repeat 54% -920px");
	$("#currentDirectoryIcon").css("margin-top", "0px");
	$('.mainTable').css('cursor', '');
	$('#aclSettingsData').empty();
	$("#dvRefreshIcon").removeClass("pluginRefreshIconDisabled");
	$("#dvRefreshIcon").addClass("refreshIcon");
	if (!isRefresh) {
		document.getElementById('dvRefreshIcon').style.pointerEvents = 'auto';	
	}
	$("#dvDownLoadIcon").removeClass("downloadWebDavIconEnabled");
	$("#dvDownLoadText").removeClass("downloadWebDavTextEnabled");
	$("#dvDownLoadIcon").addClass("downloadWebDavIconDisabled");
	$("#dvDownLoadText").addClass("downloadWebDavTextDisabled");
	document.getElementById('downloadWebDavWrapper').style.pointerEvents = 'none';
	$("#downloadWebDavWrapper").show();
	$("#uploadWebDavWrapper").show();
	$("#btnDeleteCollection").show();
	$("#uploadWebDavIcon").removeClass("uploadWebDavIconDisabled");
	$("#uploadWebDavIcon").addClass("uploadWebDavIconEnabled");
	$("#uploadWebDavText").removeClass("uploadWebDavTextDisabled");
	$("#uploadWebDavText").addClass("uploadWebDavTextEnabled");
	document.getElementById('uploadWebDavWrapper').style.pointerEvents = 'auto';
	objCommon.disableDeleteIcon('#btnDeleteCollection');
};

/**
 * The purpose of this function is to create service collection details
 * table.
 * 
 * @param selectedCount
 */
odata.prototype.createEngineServiceDetailsTable = function (selectedCount, collectionName, isRefresh) {
	objOdata.showHideIconsforFilesInPlugin(isRefresh);
	var pluginSource = getUiProps().MSG0295;
	var lastBreadCrumTitle = $("#tblBoxBreadCrum tbody tr:last td:first").attr('title');
	if (lastBreadCrumTitle != pluginSource) {
		uDataManagement.updateBreadCrumb(pluginSource);
	}

	var allRegisteredFilesList = [];
	var accessor = objOdata.getAccessor();
	var path = objOdata.getPath();// sessionStorage.selectedCollectionURL;
	if (!path.endsWith("/")) {
		path += "/";
	}
	sessionStorage.selectedCollectionURL = path;
	path += getUiProps().MSG0295;;
	var objJDavCollection = new _pc.DavCollection(accessor, path);
	var serviceColList = objJDavCollection.getResourceList(path);
	var sortedServiceCollectionData = objCommon.sortByKey(serviceColList, 'Date');
	var recordSize = sortedServiceCollectionData.length;
	var arrName = new Array();
	var arrLastModifiedDate = new Array();
	var dynamicTable = "";
	var dynamicTableEngineService = dynamicTable;
	allRegisteredFilesList = uRegisterFileAsService.retrieveRegisteredFilesList();
	var lenUploadedFilesList = allRegisteredFilesList.length;
	dynamicTableEngineService += "<table id='tblServiceCollectionDetails' cellpadding='0' cellspacing='0' class='serviceCollectionDetails' style='width:100%'>";
	if (recordSize > 0) {
		$("#webDavTbody").scrollTop(0);
		$("#wdchkSelectall").attr('checked', false);
		$("#wdchkSelectall").attr('disabled', false);
		for ( var count = 0; count < recordSize; count++) {
			var arrayData = sortedServiceCollectionData[count];
			arrName[count] = arrayData.Name;
			arrLastModifiedDate[count] = arrayData.Date;
			var contentLength = arrayData.ContentLength;
			var updatedDate = objCommon.convertEpochDateToReadableFormat(arrLastModifiedDate[count]);
			var collectionName = decodeURIComponent(objOdata.getName(arrName[count].toString()));
			var fileName = collectionName;
			for ( var index = 0; index < lenUploadedFilesList; index++) {
				if (allRegisteredFilesList[index].sourceFileName == collectionName) {
					collectionName += "&nbsp;&nbsp;&ndash;&ndash;&nbsp;&nbsp;" + allRegisteredFilesList[index].serviceName;
				}
			}
			var downloadFileName = "'" + fileName + "'";
			var downloadFilePath = path + "/" + fileName;
			downloadFilePath = "'" + downloadFilePath + "'";
			dynamicTableEngineService += '<tr id="rowsrc_'
					+ selectedCount
					+ '_'
					+ count
					+ '" style="height: 29px;" onclick="objOdata.selectFileInServiceCollection('
					+ selectedCount + ',' + count + ",'" + fileName + "','"
					+ path + "'" + ');">';
			dynamicTableEngineService += '<td style="width:1%;/*padding-left:25px;*/"><input id="chkBox1_'
					+ selectedCount
					+ '_'
					+ count
					+ '" type="checkbox" class="pluginChkBox case cursorHand regular-checkbox big-checkbox" name="engineServiceCase" value="'
					+ fileName
					+ '"/><label for="chkBox1_'
					+ selectedCount
					+ '_'
					+ count
					+ '" class="customChkbox checkBoxLabel"></label></td>';
			dynamicTableEngineService += '<td style="padding: 0px 10px 0px 1px;font-size: 10pt;border-bottom: 1px solid #e6e6e6;height: 36px;color: #3c3c3c;width:60%;max-width:329px;"><div class="mainTableEllipsis"><a id="filesInPluginLink" title="'
					+ collectionName
					+ '" onclick="uFileDownload.downloadFileOnClick('
					+ downloadFileName
					+ ','
					+ downloadFilePath
					+ ');" style="cursor:pointer;">'
					+ collectionName
					+ '</a></div></td>';
			dynamicTableEngineService += "<td style='width:14%;max-width:92px;'><div class='mainTableEllipsis' title="+contentLength+">"
					+ contentLength + "</div></td>";
			dynamicTableEngineService += "<td style='width:25%'><div class='mainTableEllipsis'>"
					+ updatedDate + "</div></td>";
			dynamicTableEngineService += "</tr>";
		}
		dynamicTableEngineService += "</table>";
		$("#webDavTbody").empty();
		$("#webDavTbody").append(dynamicTableEngineService);
		$("#dvSrc").addClass("selectSrcRow");
		$("#dvSrc").css("backgroundColor", "#f4f4f4");
	} else if (recordSize == 0) {
		$("#wdchkSelectall").attr('checked', false);
		$("#wdchkSelectall").attr('disabled', true);
		var emptyServiceCollectionMessage = getUiProps().MSG0365;
		var emptyFolderMsg = '<tr id="msg"><td id="msg" colspan="4" style="width:100%;"><div id="dvemptyTableOdataMessageFile" style="width:225px" class="emptyFolderMessage"'
				+ '>'+emptyServiceCollectionMessage+'</div></td><td id="msg"></td></tr>';
		$("#webDavTbody").empty();
		$("#webDavTbody").append(emptyFolderMsg);
		objOdata.setMarginForEmptyFolderMessage();
		if (sessionStorage.selectedLanguage == 'ja') {
			$("#dvemptyTableOdataMessageFile").css('width', "400px");
			$("#dvemptyTableOdataMessageFile").addClass('japaneseFont');
		}
	}
	uBoxDetail.setDynamicWidth();
	this.setDynamicHeight();
	setTimeout(function() {
		objOdata.applyScrollCssOnPluginGrid();	
	}, 300);
};

odata.prototype.displayPluginSource = function (pluginName) {
	objOdata.selectedView = 'p:service';
	$("#dvDownLoadIcon").css("background","url(./images/newSprite.png) no-repeat -16px -856px");
	$("#dvDownLoadText").css("color"," #e8e8e8");
	$("#wdchkSelectall").attr('checked', false);
	$("#wdchkSelectall").attr('disabled', true);
	this.showUploadButton();
	this.disableUploadArea();
	this.setCurrentDirectoryIconAndName(pluginName);
	pluginName = "'" + pluginName + "'";
	var pluginSource = getUiProps().MSG0295;
	var dynamicTable = '<div class="dvEngineServiceSrc srcDiv" id="dvSrc" onclick="objOdata.addRemoveSelectRowClass();"><label class="srcLabel" id="lblSrc" onclick="objOdata.createEngineServiceDetailsTable(0,'+pluginName+');">'+pluginSource+'</label></div>';
	$("#webDavTbody").empty();
	$("#webDavTbody").append(dynamicTable);
	$("#boxEditAclSettings").removeClass("disabledEditIconACLSettings");
	$("#boxEditAclSettings").addClass("editIconACLSettings");
};

odata.prototype.setCurrentDirectoryIconAndName = function (pluginName) {
	$("#currentDirectoryName").text(pluginName);
	$("#currentDirectoryName").attr("title",pluginName);
	$("#currentDirectoryIcon").css("background","url(./images/sprite3.png) 54% -166px no-repeat");
	$("#currentDirectoryIcon").css("margin-top","0px");
};

odata.prototype.disableUploadArea = function () {
	$("#dvRefreshIcon").removeClass("refreshIcon ");
	$("#dvRefreshIcon").addClass("pluginRefreshIconDisabled");
	document.getElementById('dvRefreshIcon').style.pointerEvents = 'none';
	$("#uploadWebDavIcon").removeAttr("style");
	$("#uploadWebDavText").removeAttr("style");
	$("#uploadWebDavIcon").removeClass("uploadWebDavIconEnabled");
	$("#uploadWebDavIcon").addClass("uploadWebDavIconDisabled");
	$("#uploadWebDavText").removeClass("uploadWebDavTextEnabled ");
	$("#uploadWebDavText").addClass("uploadWebDavTextDisabled");
	document.getElementById('uploadWebDavWrapper').style.pointerEvents = 'none';
};

/**
 * The purpose of this function is to display __src.
 * 
 * @param count
 */
odata.prototype.displayEngineServiceSource = function (count) {
	$("#dynaminTR"+count).remove();
	var rowID = "wdrowid"+count;
	var selectedRowID = $("#"+rowID).attr('id');
	if (rowID === selectedRowID) {
		var table = document.getElementById("webDavTable");
		var dvSrc = document.createElement("div");
		table.appendChild(dvSrc);
		sessionStorage.selectedEngineServiceIndex = count;
		var dynamicTable = "";
		dynamicTable += "<div class='dvEngineServiceSrc' id='dvSrc_"+count+"' onclick='objOdata.addRemoveSelectRowClass("+count+");' style='height: 28px;cursor:pointer;margin-top:0px;margin-bottom:0px;padding-top: 8px;border-bottom: 1px solid #e6e6e6;'><label style='cursor:pointer;margin-left:25px;font-family: Segoe UI;font-size: 10pt;color: #3c3c3c;' id='lblSrc'>__src</label></div>";
		//dynamicTable += "<div id='dvSrc_"+count+"' onclick='objOdata.addRemoveSelectRowClass("+count+");' style='height:19px;padding-bottom:4px;cursor:default;padding-top:5px;margin-top:0px;margin-bottom:0px;'><label style='cursor:pointer;margin-left:25px;' id='lblSrc'>__src</label></div>";
		dynamicTable += "<div id='dvServiceCollectionDataTable"+count+"'></div>";
		var row = $('#'+ rowID);
		row.after('<div class="dynamicRowServiceCollection" id="dynaminTR'+count+'"><td style="padding-left:26px;padding-right:0px;padding-top:0px;padding-bottom:1px;" colspan="'+ row.children().length +'" style="padding:0px;">'+dynamicTable+'</td></div>');
		objOdata.createEngineServiceDetailsTable(count);
	}
};

/**
 * The purpose of this function is to remove selected row class
 * from src
 */
odata.prototype.removeClassFromSrc = function () {
	var noOfCollectionRows = $("#webDavTable tbody tr").length;
	for(var index = 0; index < noOfCollectionRows; index++){
		if($("#dvSrc").hasClass("selectSrcRow")){
			$("#dvSrc").removeClass("selectSrcRow");
			$("#dvSrc").css("backgroundColor", "#fff");
		}
	}
};

/**
 * The purpose of this function is to add and remove classes
 * from the table rows.
 * 
 * @param count
 */
odata.prototype.addRemoveSelectRowClass = function (count) {
	$("#boxEditAclSettings").removeClass("editIconACLSettings");
	$("#boxEditAclSettings").addClass("disabledEditIconACLSettings");
	$('#aclSettingsData').empty();
	$("#webDavDetailMessageBody").hide();
	var pluginSource = getUiProps().MSG0295;
	var colName = sessionStorage.rowSelectCollectionName;
	sessionStorage.resourcetype = 'p:service';
	sessionStorage.selectedSvCol = colName;
	var path = sessionStorage.selectedCollectionURL;
	if (path != undefined) {
		var index = path.lastIndexOf("/");
		var subURI = path.substring(0, index+1);
		var fullURI = subURI + colName;
		sessionStorage.selectedCollectionURL = fullURI;
	}
	var pluginPath = this.getPath();
	if (!pluginPath.endsWith("/")) {
		pluginPath += "/";
	}
	pluginPath += pluginSource;
	uBoxDetail.populatePropertiesList(pluginPath, pluginPath, pluginSource, false,"folder");
	$("#webDavDetailBody").show();
	sessionStorage.selectedEngineServiceIndex = count;
	$("#dvSrc").addClass("selectSrcRow");
	$("#dvSrc").css("backgroundColor", "#f4f4f4");
};

/**
 * The purpose of this function is to toggle arrows.
 * 
 * @param count
 */
odata.prototype.toggleArrow = function(count, collectionName) {
	sessionStorage.rowSelectCollectionName = collectionName;
	var id = "#dvServiceCollectionArrow_" + count;
	var dynamicTrID = "dynaminTR" + count;
	if ($(id).hasClass("rightArrowServiceCollection")) {
		$(id).removeClass("rightArrowServiceCollection");
		$(id).addClass('downArrowServiceCollection');
		objOdata.displayEngineServiceSource(count);
	} else if ($(id).hasClass("downArrowServiceCollection")) {
		$('#' + dynamicTrID).remove();
		$(id).removeClass("downArrowServiceCollection");
		$(id).addClass('rightArrowServiceCollection');
		objOdata.setHeaderView();
	}
};

/** ******************* ENGINE SERVICE VIEW : END ******************** */

/**
 * The purpose of this method is to set the available width for breadcrumb and box name in breadcrumb.
 */
odata.prototype.setAvailableWidthForBreadCrumb = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var availableWidthForBreadCrumb = (rightPanelWidth - 15 - 20 - 528);
	if(width>1280){
		$("#tblBoxBreadCrum").css("width",availableWidthForBreadCrumb + "px");
	}else{
		$("#tblBoxBreadCrum").css("width","700px");
	}
};

/**
 * The purpose of this method is to set box details that perches on the top of the grid.
 * @param boxName
 * @param boxModifiedDate
 */
//odata.prototype.setBoxDetails = function(boxName, boxModifiedDate) {
odata.prototype.setBoxDetails = function(boxName, pCollectionPath) {
	if(boxName!==null) {
		objOdata.setAvailableWidthForBreadCrumb();
		//var shortenedBoxName = objCommon.getShorterEntityName(boxName);
		$("#columnId_0").addClass('mainTableEllipsisBreadCrumBoxName');
		$("#columnId_0").text(boxName);
		$("#columnId_0").attr('title', boxName);
		$("#columnId_01").attr('title', '>');
		$("#columnId_01").text('>');
		this.selectedBreadCrumId = 'columnId_0';
	}else {
		$("#columnId_0").attr('title', '');
		$("#columnId_01").attr('title', '');
		$("#columnId_0").text('');
		$("#columnId_01").text('');
		this.selectedBreadCrumId = 'contents';
	}
};

/**
 * The purpose of this method is to set the header layout as per data content
 */
odata.prototype.setHeaderView = function(){
    //var noOfRows = $("#webDavTable tbody tr").length;
    var tblHeight = document.getElementById('webDavTable').offsetHeight;
    //var tableHeight =  $("#webDavTable").height();
    if(tblHeight > 324){
        $("#webDavTable thead th:eq(0)").removeClass("boxDetailTabHeadNoScrollBarCol1");
        $("#webDavTable thead th:eq(1)").removeClass("boxDetailTabHeadNoScrollBarCol2");
        $("#webDavTable thead th:eq(2)").removeClass("boxDetailTabHeadNoScrollBarCol3");
        $("#webDavTable thead th:eq(3)").removeClass("boxDetailTabHeadNoScrollBarCol4");
        $("#webDavTable thead th:eq(0)").addClass("boxDetailTabHeadScrollBarCol1");
        $("#webDavTable thead th:eq(1)").addClass("boxDetailTabHeadScrollBarCol2");
        $("#webDavTable thead th:eq(2)").addClass("boxDetailTabHeadScrollBarCol3");
        $("#webDavTable thead th:eq(3)").addClass("boxDetailTabHeadScrollBarCol4");
    }else{
        $("#webDavTable thead th:eq(0)").addClass("boxDetailTabHeadNoScrollBarCol1");
        $("#webDavTable thead th:eq(1)").addClass("boxDetailTabHeadNoScrollBarCol2");
        $("#webDavTable thead th:eq(2)").addClass("boxDetailTabHeadNoScrollBarCol3");
        $("#webDavTable thead th:eq(3)").addClass("boxDetailTabHeadNoScrollBarCol4");
        $("#webDavTable thead th:eq(0)").removeClass("boxDetailTabHeadScrollBarCol1");
        $("#webDavTable thead th:eq(1)").removeClass("boxDetailTabHeadScrollBarCol2");
        $("#webDavTable thead th:eq(2)").removeClass("boxDetailTabHeadScrollBarCol3");
        $("#webDavTable thead th:eq(3)").removeClass("boxDetailTabHeadScrollBarCol4");
    }
};

/**
 * The purpose of this method is to return file type of selected entity in odata grid
 */
odata.prototype.getFileType = function() {
	var noOfCollections = $("#webDavTable tbody tr").length;
	var fileType = "";
	for(var index = 0; index < noOfCollections; index++){
		if($("#wdrowid" + index).hasClass("selectRow")){
			fileType = document.getElementById("fileTypeId" + index).value;
			fileType = fileType.replace(/'/g, "");
			break;
		}
	}
	return fileType;
};

/**
 * The purpose of this method is to set margin for resouces message as per view port size.
 */
odata.prototype.setMarginForSelectedResourcesMessage = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var boxDetailContentWidth = (rightPanelWidth - 15 -20);
	var boxDetailTableWidth = (72.31270/100)*boxDetailContentWidth;
	var webDavDetailsWidth = boxDetailContentWidth - boxDetailTableWidth;
	var messageWidth = 175;
	var marginLeftForMsg = (webDavDetailsWidth/2) - (messageWidth/2);
	if(width>1280){
		$("#webDavDetailMessageBody").css('margin-left',marginLeftForMsg + 'px');
	}else{
		$("#webDavDetailMessageBody").css('margin-left','82.5px');
	}
	
	var height = $(window).height();
	var fixedHeight = 18+43+27+30+26+23+11+34+42;
	var webDavDetailsHeight = (height - fixedHeight);
	var msgHeight = 23;
	var marginTopForMsg = ((webDavDetailsHeight/2) - (msgHeight/2));
	if(height>650){
		$("#webDavDetailMessageBody").css('margin-top',marginTopForMsg + 'px');
	}else{
		$("#webDavDetailMessageBody").css('margin-top','186.5px');
	}
};

/**
 * The purpose of this method is to set margin for empty folder message as per view port size.
 */
odata.prototype.setMarginForEmptyFolderMessage = function(){
	var height = $(window).height();
	var fixedHeight = 18+43+27+30+26+23+11+34+42+88;
	var webDavBodyHeight = (height - fixedHeight);
	var msgHeight = 23;
	var marginTopForEmptyFolderMessage = ((webDavBodyHeight/2) - (msgHeight/2));
	if(height>650){
		$("#dvemptyTableOdataMessageFile").css('margin-top',marginTopForEmptyFolderMessage + 'px');
	}else{
		$("#dvemptyTableOdataMessageFile").css('margin-top','167.5px');
	}
};


/**
 * The purpose of this method is to create table for the grid.
 */
odata.prototype.createTable = function(collectionURLValue) {
	$("#dvRefreshIcon").removeClass("pluginRefreshIconDisabled");
	$("#dvRefreshIcon").addClass("refreshIcon");
	//document.getElementById('dvRefreshIcon').style.pointerEvents = 'auto';
	$("#uploadWebDavIcon").removeClass("uploadWebDavIconDisabled");
	$("#uploadWebDavIcon").addClass("uploadWebDavIconEnabled");
	$("#uploadWebDavText").removeClass("uploadWebDavTextDisabled");
	$("#uploadWebDavText").addClass("uploadWebDavTextEnabled");
	document.getElementById('uploadWebDavWrapper').style.pointerEvents = 'auto';
	objCommon.disableDeleteIcon('#btnDeleteCollection');
	$(".dynamicRowServiceCollection").remove();
	sessionStorage.resourcetype = '';
	$("#wdchkSelectall").attr('checked', false);
	$("#wdchkSelectall").attr('disabled', false);
	this.hidePluginIcons();
	var collectionList = objOdata.getCollectionList(collectionURLValue);
	var recordSize = collectionList.length;
	var totalRecordsize = recordSize;
	var arrName = new Array();
	var arrLastModifiedDate = new Array();
	var collectionType = "";
	$(".dynamicRow").remove();
	$("#dvemptyTableOdataMessage").hide();
	$("#dvemptyTableOdataMessageFile").hide();
	var dynamicTable = "";
	$("#webDavTbody").scrollTop(0);
	for ( var count = 0; count < recordSize; count++) {
		var arrayData = collectionList[count];
		var collectionURL = arrayData.Name;
		arrName[count] = arrayData.Name;
		arrLastModifiedDate[count] = arrayData.Date;
		var contentLength = arrayData.ContentLength;
		var type = arrayData.Type;
		var fileType = "'"+type+"'";
		collectionType += type + ',';
		var collectionName = decodeURIComponent(objOdata.getName(arrName[count].toString()));	
		var aclCollectionName = "'"+collectionName+"'";
		var collectionURLValueTemp = "'" + collectionURL + "'";
		collectionURLValueTemp = decodeURIComponent(collectionURLValueTemp);
		var lastModifiedDate = objCommon.convertEpochDateToReadableFormat(arrLastModifiedDate[count]);
		dynamicTable += '<tr class="dynamicRow" id = "wdrowid'+count+'" onclick="objCommon.rowSelect(this,'+ "'wdrowid'" +','+ "'wdchkBox'"+','+ "'row'" +','+ "'btnDeleteCollection'" +','+ "'wdchkSelectall'" +','+ count +',' + totalRecordsize + ','+"'editBtn'"+','+aclCollectionName+','+true+', '+fileType+','+"'webDavTable'"+','+collectionURLValueTemp+');"><input type="hidden" id = "fileTypeId'+count+'" value="'+fileType+'"/>';
		dynamicTable = objOdata.createRows(dynamicTable, collectionName,
			lastModifiedDate, collectionURL, type, count, contentLength);
	}
	if (recordSize == 0) {
		$("#btnRefreshCollection").css("cursor", "default");
		$("#webDavTable thead tr").addClass('mainTableHeaderRow');
		if (folderClicked == true) {
			var emptyFolderTextMessage = getUiProps().MSG0360;
			var emptyFolderMsg = '<tr id="msg"><td id="msg" colspan="4" style="width:100%;"><div id="dvemptyTableOdataMessageFile" class="emptyFolderMessage"' + 
			'>'+emptyFolderTextMessage+'</div></td><td id="msg"></td></tr>';
			dynamicTable = emptyFolderMsg;
		}else{
			var emptyCollectionTextMessage = getUiProps().MSG0359;
			var emptyBoxMsg = '<tr id="msg"><td id="msg"><div id="dvemptyTableOdataMessageFile" style="margin-left: 50%;" class="emptyBoxMessage"' + 
			'>'+emptyCollectionTextMessage+'</div></td></tr>';
			dynamicTable = emptyBoxMsg;
		} 
	} else {
		$("#btnRefreshCollection").css("cursor", "");
		$("#dvemptyTableOdataMessageFile").hide();
		$("#webDavTable thead tr").addClass('mainTableHeaderRow');
		$("#webDavTable tbody").addClass('webDavTableTbody');
	}
	$("#webDavTbody").empty();
	$("#webDavTbody").append(dynamicTable);
	if (recordSize == 0) {
		objOdata.setMarginForEmptyFolderMessage();
		$("#wdchkSelectall").attr("disabled",true);
		$("#dvemptyTableOdataMessageFile").css('margin-left', "auto");
		$("#webDavTable tbody").removeClass('webDavTableTbody');
		if (sessionStorage.selectedLanguage == 'ja') {
			$("#dvemptyTableOdataMessageFile").addClass('japaneseFont');
			if (!folderClicked) {
				$("#dvemptyTableOdataMessageFile").css('width', "670px");
			}
		}
	}
	uBoxDetail.setDynamicWidth();
	this.setDynamicHeight();
};

/**
 * The purpose of this function is to perform checkbox select operation
 * of OData grid.
 * 
 * @param chkBox
 * @param id
 * @param editBtnID
 */
odata.prototype.checkBoxSelectOData = function(chkBox, id, editBtnID) {
	var cbSelected = document.getElementsByTagName('input');
	var len = cbSelected.length;
	for ( var count = 0; count < len; count++) {
		if (cbSelected[count].type == 'checkbox'
				&& cbSelected[count].name == 'boxDetailCase') {
			cbSelected[count].checked = chkBox.checked;
		}
	}
	if (chkBox.checked == true) {
		objCommon.enableButton(id);
		objCommon.disableEditButton(editBtnID);
	}
	if (chkBox.checked == false) {
		objCommon.disableButton(id);
		objCommon.disableEditButton(editBtnID);
	}
};

/** ******************* DELETE COLLECTION : START ******************** */ 

/**
 * The purpose of this function is to check parent check box on selection of all
 * child check boxes.
 * 
 * @param cBox
 */
odata.prototype.checkAll = function (cBox) {
	var lastBreadCrumTitle = $("#tblBoxBreadCrum tbody tr:last td:first").attr('title');
	var pluginSource = getUiProps().MSG0295;
	if (lastBreadCrumTitle != pluginSource) {
		objOdata.hidePluginIcons();
		uFileDownload.disableDownloadArea();
		var buttonId = '#btnDeleteCollection';
		objCommon.disableDeleteIcon(buttonId);
		objOdata.checkBoxSelectOData(cBox, buttonId);
		objCommon.showSelectedRow(document.getElementById("wdchkSelectall"),"row","wdrowid");
		var noOfRecords = $("#webDavTable > tbody > tr").length;
		if ($("#wdchkSelectall").is(':checked')) {
			if(noOfRecords >= 1) { 
				objCommon.activateCollectionDeleteIcon("#btnDeleteCollection");
			}
			if(noOfRecords > 1) {
				uBoxAcl.showSelectedResourceCount(noOfRecords);
			}/*else if(noOfRecords == 0){
				
			}*/else if(noOfRecords == 1){
				var checkedCollectionName = "";
				for ( var index = 0; index < noOfRecords; index++) {
					if ($('#wdchkBox' + index).is(':checked')) {
						checkedCollectionName = $("#boxDetailLink_"+index).text();
						break;
					}
				}
				var currentFolderURL = sessionStorage.Path;
				var urlArray = currentFolderURL.split("/");
				var len = urlArray.length;
				urlArray[len] = checkedCollectionName;
				var checkedCollectionURL = urlArray.join("/");
				var selectedFileType = objOdata.getFileType();
				uBoxDetail.populatePropertiesList(checkedCollectionURL, checkedCollectionURL, checkedCollectionName, false, selectedFileType);
				uBoxAcl.getAclSetting(checkedCollectionURL, sessionStorage.boxName);
				if (selectedFileType == "file") {
					this.activateDownloadLink();
				} 
			}
		}else{
			var lengthBreadCrumb = $("#tblBoxBreadCrum tbody tr").length;
			var type ="";
			if(lengthBreadCrumb == 1){
				type = "box";
			}else if(lengthBreadCrumb > 1){
				type = "folder";
			}
			var currentFolderURL = sessionStorage.Path;
			var pathArray = currentFolderURL.split('/');
			var currentCollectionName = pathArray[(pathArray.length) - 1];
			var target = document.getElementById('spinner');
			var spinner = new Spinner(opts).spin(target);
			setTimeout(function() {
				uBoxDetail.populatePropertiesList(currentFolderURL, currentFolderURL, currentCollectionName, false, type);
				uBoxAcl.getAclSetting(currentFolderURL, sessionStorage.boxName);
				uBoxAcl.showSelectedResourceCount(0);
				spinner.stop();
			}, 1);
		}
		objOdata.setMarginForSelectedResourcesMessage();
	} else if (lastBreadCrumTitle == pluginSource) {
		var noOfFilesInPlugin = $("#tblServiceCollectionDetails > tbody > tr").length;
		if (cBox.checked == true) {
			if (noOfFilesInPlugin == 1) {
				this.activateDownloadLink();
				var pluginPath = this.getPath();
				if (!pluginPath.endsWith("/")) {
					pluginPath += "/";
				}
				var pluginFileName = document.getElementById('chkBox1_0_0').value;
				pluginPath += pluginSource + "/" + pluginFileName;
				uBoxDetail.populatePropertiesList(pluginPath, pluginPath, pluginFileName, false, "file");
			}
			if(noOfFilesInPlugin > 1) {
				uBoxAcl.showSelectedResourceCount(noOfFilesInPlugin);
				objOdata.setMarginForSelectedResourcesMessage();
				uFileDownload.disableDownloadArea();
			}
			objCommon.activateCollectionDeleteIcon('#btnDeleteCollection');
			$("#tblServiceCollectionDetails tbody tr ").addClass('selectSrcColRow');
			$(".pluginChkBox").attr('checked', true);
		} else {
			$("#webDavDetailMessageBody").hide();
			var pluginSrcPath = this.getPath();
			if (!pluginSrcPath.endsWith("/")) {
				pluginSrcPath += "/";
			}
			pluginSrcPath += pluginSource;
			uBoxDetail.populatePropertiesList(pluginSrcPath, pluginSrcPath, pluginSource, false,"folder");
			uFileDownload.disableDownloadArea();
			objCommon.disableDeleteIcon('#btnDeleteCollection');
			$("#webDavDetailBody").show();
			$("#tblServiceCollectionDetails tbody tr ").removeClass('selectSrcColRow');
			$(".pluginChkBox").attr('checked', false);
		}
	}
	
};

/**
 * The purpose of this table is to remove row select from plugin table on click
 * of parent checkbox.
 */
odata.prototype.removeRowSelectFromPluginTable = function () {
	$('.serviceCollectionDetails').find('input[type=checkbox]:checked').removeAttr('checked');
	$(".serviceCollectionDetails > tbody > tr").removeClass('selectSrcColRow');
	$(".dvEngineServiceSrc").css("backgroundColor", "#fff");
	$(".dvEngineServiceSrc").removeClass('selectSrcRow');
};

/**
 * The purpose of this function is to get collection details
 *
 * @param collectionName
 */
odata.prototype.getCollectionDetails = function (collectionName) {
	sessionStorage.collectionName = collectionName;
	openCreateEntityModal('#singleFileDeleteModalWindow', '#singleFileDeleteDialogBox');
};

/**
 * The purpose of this function is to delete single collection.
 */
odata.prototype.deleteSingleCollection = function() {
	showSpinner("modalSpinnerBoxOdata");
	var collectionName = sessionStorage.collectionName;
	var response = objOdata.retrieveResponse(collectionName);
	if (response.resolvedValue.status == 204) {
		objOdata.displaySuccessfulCollectionDeleteMessage(collectionName);
	} else if (response.resolvedValue.status == 403) {
		objOdata.displayConflictMessage(collectionName);
	}
	removeSpinner("modalSpinnerBoxOdata");
};

/**
 * The purpose of this function is to display success ribbon message for
 * collection delete operation.
 * 
 * @param collectionName
 */
odata.prototype.displaySuccessfulCollectionDeleteMessage = function (collectionName) {
	$('#singleFileDeleteModalWindow, .window').hide();
	objOdata.createTable();
	addSuccessClass();
	inlineMessageBlock();
	var shorterCollectionName = objCommon.getShorterEntityName(collectionName);
	document.getElementById("successmsg").innerHTML = "Collection " + shorterCollectionName + " is successfully deleted!"; 
	document.getElementById("successmsg").title = collectionName;
	removeSpinner("modalSpinnerBoxOdata");
	objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
	objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
	sessionStorage.collectionName = "";
};

/**
 * The purpose of this function is to display conflict ribbon message for
 * collection delete operation. 
 * 
 * @param collectionName
 */
odata.prototype.displayConflictMessage = function (collectionName) {
	var shorterCollectionName = objCommon.getShorterEntityName(collectionName);
	$('#singleFileDeleteModalWindow, .window').hide();
	addErrorClass();
	inlineMessageBlock();
	document.getElementById("successmsg").innerHTML = "Collection " +shorterCollectionName+ " cannot be deleted";
	document.getElementById("successmsg").title = collectionName;
	objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
	objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
	removeSpinner("modalSpinnerBoxOdata");
};

/**
 * The purpose of this function is to delete multiple collections.
 */
odata.prototype.deleteMultipleCollections = function() {
	// showSpinner("modalSpinnerBoxOdata");
	var collectionNames = sessionStorage.CollectionNames;
	var arrCollectionNames = collectionNames.split(',');
	for ( var count = 0; count < arrCollectionNames.length; count++) {
		objOdata.deleteFiles(arrCollectionNames[count]);
	}
	objOdata.displayAllMessages();
	// removeSpinner("modalSpinnerBoxOdata");
};

/**
 * The purpose of this function is to display success and conflict messages, in
 * multiple delete scenario.
 */
odata.prototype.displayAllMessages = function() {
	objCommon.disableDeleteIcon("#btnDeleteCollection");
	sbSuccessful = sbSuccessful.substring(0, sbSuccessful.length - 1);
	sbConflict = sbConflict.substring(0, sbConflict.length - 1);
	$('#multipleFileDeleteModalWindow, .window').hide();
	if (sbSuccessful.length > 0 && sbConflict.length < 1) {
		if (sessionStorage.fileDelete == "service") {
			objCollectionOdata.displaySuccessMessage(entityCount(sbSuccessful)
					+ "  " + getUiProps().MSG0361, 0);
		} else {
			objCollectionOdata.displaySuccessMessage(entityCount(sbSuccessful)
					+ " " + getUiProps().MSG0362, 0);
		}
	} else if (sbSuccessful.length < 1 && sbConflict.length > 0) {
		if (sessionStorage.fileDelete == "service") {
			objCollectionOdata.displayErrorMessage(entityCount(sbConflict)
					+ " " + getUiProps().MSG0363, 0);
		} else {
			objCollectionOdata.displayErrorMessage(entityCount(sbConflict)
					+ " " + getUiProps().MSG0364, 0);
		}
	} else if (sbSuccessful.length > 0 && sbConflict.length > 0) {
		if (sessionStorage.fileDelete == "service") {
			objCollectionOdata.displayErrorMessage(entityCount(sbSuccessful)
					+ " " + getUiProps().MSG0323 + " "
					+ (entityCount(sbConflict) + entityCount(sbSuccessful))
					+ " " + getUiProps().MSG0361, 0);
		} else {
			objCollectionOdata.displayErrorMessage(entityCount(sbSuccessful)
					+ " " + getUiProps().MSG0323 + " "
					+ (entityCount(sbConflict) + entityCount(sbSuccessful))
					+ " " + getUiProps().MSG0362, 0);
		}
	}
	if (sessionStorage.fileDelete == "service") {
		objOdata.displayPluginTableAfterDeleteOperation();
	} else {
		objOdata.refreshWebDavTableAfterDeleteOperation();
	}
	sbSuccessful = "";
	sbConflict = "";
	uFileDownload.disableDownloadArea();
};

/**
 * The purpose of this function is to display plugin grid after
 * delete operation.
 */
odata.prototype.displayPluginTableAfterDeleteOperation = function() {
	var count = 0;
	var pluginSource = getUiProps().MSG0295;
	objOdata.createEngineServiceDetailsTable(count, sessionStorage.rowSelectCollectionName);
	$("#dvSrc").css(
			"backgroundColor", "#f4f4f4");
	var selectedPluginPath = sessionStorage.selectedCollectionURL;
	if (!selectedPluginPath.endsWith("/")) {
		selectedPluginPath += "/";
	}
	selectedPluginPath += pluginSource;
	uBoxDetail.populatePropertiesList(selectedPluginPath, selectedPluginPath,
			pluginSource, false, "folder");
	uBoxAcl.getAclSetting(selectedPluginPath, sessionStorage.boxName);
	$("#webDavDetailBody").show();
	$("#webDavDetailMessageBody").hide();
};

/**
 * The purpose of this function is to display webDav grid after
 * delete operation.
 */
odata.prototype.refreshWebDavTableAfterDeleteOperation = function() {
	var finalPath = objOdata.getPath();
	if (!finalPath.endsWith("/")) {
		finalPath += "/";
		}
	var rowCount = $('#tblBoxBreadCrum tbody tr').length;
	var heirarchyLevelName = null;
	var type = null;
	if (rowCount == 1) {
		heirarchyLevelName = sessionStorage.boxName;
		type = "box";
		folderClicked = false;
	} else {
		heirarchyLevelName = $("#currentDirectoryName").text();
		type = "folder";
		folderClicked = true;
	}
	objOdata.createTable(finalPath);
	uBoxDetail.populatePropertiesList(finalPath,
			finalPath, heirarchyLevelName, false, type);
	uBoxAcl.getAclSetting(finalPath, sessionStorage.boxName);
	$("#webDavDetailBody").show();
	$("#webDavDetailMessageBody").hide();
};

/**
 * The purpose of this function is to delete collections on the basis of ID.
 * 
 * @param id
 */
odata.prototype.deleteFiles = function(id) {
	var statusCode = objOdata.retrieveResponse(id);
	if (statusCode == 204) {
		sbSuccessful += id + ",";
	} else if (statusCode == -100 || statusCode >= 400) {
		sbConflict += id + ",";
	}
};

/**
 * The purpose of this function is to retrieve API response.
 * 
 * @param id
 * @returns
 */
odata.prototype.retrieveResponse = function(id) {
	var cellName = sessionStorage.selectedcell.toString();
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	var pluginSource = getUiProps().MSG0295;
	if (boxName == mainBoxValue) {
		boxName = getUiProps().MSG0293;
	}
	var baseUrl = getClientStore().baseURL;
	var path = this.currentCollectionPath;
	if (sessionStorage.fileDelete == "service") {
		if (!path.endsWith("/")) {
			path += "/";
		}
		path += pluginSource + "/";
	}
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var objDav = new _pc.DavCollection(accessor, path);
	/** Specify recursive deletion */
	var options = {};
	options.headers = {};
    options.headers["X-Personium-Recursive"] = true;
	var response = objDav.del(id, options);
	var statusCode = objCommon.getStatusCode(response);
	return statusCode;
};

/**
 * The purpose of this function is to open pop up window for multiple delete of
 * collections.
 * 
 * @param idDialogBox
 * @param idModalWindow
 */
odata.prototype.openPopUpWindow = function (idDialogBox, idModalWindow) {
    if (idDialogBox === '#multipleFileDeleteDialogBox') {
        var response = objCommon.getMultipleSelections('webDavTable','input','boxDetailCase');
        sessionStorage.fileDelete = "normal";
        $("#multipleDeleteMsg").text(getUiProps().MSG0389);
        var serviceCollectionFiles = null;
        if(response == null){
            var noOfCollections = $("#webDavTable tbody tr").length;
            for(var index = 0; index < noOfCollections; index++){
                var serviceColFiles = $("#tblServiceCollectionDetails tbody tr").length;
                if( serviceColFiles != 0 && serviceCollectionFiles == null){
                    var parentID = 'tblServiceCollectionDetails';
                    serviceCollectionFiles = objCommon.getMultipleSelections(parentID,'input','engineServiceCase');
                    if(serviceCollectionFiles != null){
                        sessionStorage.selectedServiceCollection = sessionStorage.rowSelectCollectionName;//document.getElementById("wdchkBox"+index).value;
                        //sessionStorage.selectedServiceCollectionIndex = index;
                        break;
                    }
                }
            }
            $("#multipleDeleteMsg").text(getUiProps().MSG0390);
            $(idDialogBox).css('width', '539px');
            response = serviceCollectionFiles;
            sessionStorage.fileDelete = "service";
        }
        sessionStorage.CollectionNames = response;
    }
    $(idModalWindow).fadeIn(0);
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    $(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
    $(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
    $('#btnCancelDavCollectionDelete').focus();
};

/********************* DELETE COLLECTION : END *********************/
/**
 * The purpose of this method is to load the elements and values when the page is loaded for the first time.
 */
$(document).ready(function() {
    $.ajaxSetup({ cache : false });
    $('#btnServiceRegistration').hide();
    /*if(sessionStorage.tabName == "Box"){
		objOdata.createTable();
	}*/
    $("#btnCreateOdata").click(function() {
        objOdata.createOdataCollection();
    });
    $("#btnSingleFileDelete").click(function() {
        objOdata.deleteSingleCollection();
    });
    /*$("#btnMultipleFileDelete").click(function() {
        objOdata.deleteMultipleCollections();
    });*/
});

/********************* CREATE O-DATA : START *********************/ 
/**
 * The purpose of this function is to empty all the fields on O-Data modal pop up.
 */
odata.prototype.emptyFieldValues = function() {
	$("#popupOdataErrorMsg").text("");
	$("#txtOdataName").val("");
};

/** ******************* CREATE O-DATA : END ********************* */

/***********************Upload File Start************************/

/**
 * The purpose of this method is to perform attach file operation
 */
odata.prototype.attachFile = function () {
    var file = document.getElementById('fileID').files[0];
    objOdata.fileName = document.getElementById("fileID").value;
	var spinner = "";
    if(file) {
     objOdata.spinner = objOdata.showSpinnerForUploadFile();
      document.getElementById("dvGreyOut").style.display = 'block';
       var fileSize = file.size/1024/1024;
       if(objOdata.validateFileName(objOdata.fileName, fileSize)){
           setTimeout(function(){objOdata.uploadFile(file);},200);
           //objOdata.getAsBinaryString(file);
       }
   }
   document.getElementById('fileID').value = '';
   uFileDownload.disableDownloadArea();
};

/**
 * The purpose of this method is to get file content as text
 * @param readFile
 */
odata.prototype.getAsBinaryString = function(readFile) {
    try {
        var reader = new FileReader();
    } catch (e) {
        objOdata.spinner.stop();
        document.getElementById("dvGreyOut").style.display = 'none';
        alert("Error: seems File API is not supported on your browser");
        //document.getElementById('successmsg').innerHTML = "Error: seems File API is not supported on your browser";
        return;
    }
    //reader.readAsDataURL(readFile, "UTF-8");//readAsBinaryString(readFile, "UTF-8");
    reader.readAsDataURL(readFile, "UTF-8");
    reader.onload = objOdata.loaded;
    reader.onerror = objOdata.errorHandler;
};

/**
 * The purpose of this method is to read file data
 * @param evt
 */
odata.prototype.loaded = function(evt) {
    var fileString = evt.target.result;
    objOdata.uploadFile(fileString);
    document.getElementById("fileID").value = '';
};

/**
 * The purpose of this method is to perform error handling for file read. 
 * @param evt
 */
odata.prototype.errorHandler = function(evt) {
    if (evt.target.error.code == evt.target.error.NOT_READABLE_ERR) {
        objOdata.spinner.stop();
        document.getElementById("dvGreyOut").style.display = 'none';
        alert("Error reading file...");
        //document.getElementById('successmsg').innerHTML = "Error reading file...";
    }
};

/**
 * The purpose of this method is to perform file validation
 */
odata.prototype.validateFileName = function(fileName, fileSize) {
    var letters = new RegExp("^[^" + objCommon.getValidateBlackList() + "]+$");
    //var letters = /^[0-9a-zA-Z-_.]+$/;
    if (fileName.indexOf("fakepath") != -1) {
        fileName = fileName.substring(fileName.lastIndexOf("fakepath") + 9);
    }
    var fileLength = fileName.length;
    objOdata.fileType = fileName.substring(fileName.lastIndexOf('.') + 1);
    if (fileLength > 256) {
        objOdata.spinner.stop();
        document.getElementById("dvGreyOut").style.display = 'none';
        alert("File name cannot exceed 256 characters");
        return false;
    } else if (fileLength != 0 && !(fileName.match(letters))) {
        objOdata.spinner.stop();
        document.getElementById("dvGreyOut").style.display = 'none';
        alert(getUiProps().MSG0429);
        return false;
    } /*else if (fileSize >100) {
		objOdata.spinner.stop();
		document.getElementById("dvGreyOut").style.display = 'none';
		alert("File size can not exceed 100 MB");
		return false;
	} */else if (fileSize == 0) {
	    objOdata.spinner.stop();
	    document.getElementById("dvGreyOut").style.display = 'none';
	    alert("File is empty");
	    return false;
	} 
    return true;
};

/**
 * The purpose of this method is to perform upload file operation
 */
odata.prototype.uploadFile = function (fileData) {
    var response = "";
    if (objOdata.fileName.indexOf("fakepath") != -1) {
        objOdata.fileName = objOdata.fileName.substring(objOdata.fileName.lastIndexOf("fakepath") + 9);
    }	
    objOdata.contentType = fileData.type;
    if (objOdata.contentType.length == 0) {
        objOdata.contentType = objOdata.setContentType();
    }
    var baseUrl = getClientStore().baseURL;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }
    var type = this.getEngineServiceCollectionType();
    var cellName = sessionStorage.selectedcell;
    var path = objOdata.currentCollectionPath;
   // path += collectionPath;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
   try {
	   var lastBreadCrumTitle = $("#tblBoxBreadCrum tbody tr:last td:first").attr('title');
	   if (lastBreadCrumTitle == getUiProps().MSG0295) {
		   type = "p:service"; 
	   }
    if (type == "p:service") {
    	var pluginPath = objOdata.getPath();
        flag = true;
        var objJserviceCollection = new _pc.ServiceCollection(accessor, pluginPath);
        response = objJserviceCollection.put(objOdata.fileName, objOdata.contentType, fileData, "*");
    } else {
        var objJDavCollection = new _pc.DavCollection(accessor, path);
        response = objJDavCollection.put(objOdata.fileName, objOdata.contentType, fileData, "*");
        if (response.getBody() != undefined) {
        	response = response.getBody();
        }
    } 
    if (response.httpClient.status == 201 || response.httpClient.status == 204) {
    	if (type == "p:service") {
    		var count = 0;
    		objOdata.createEngineServiceDetailsTable(count, sessionStorage.rowSelectCollectionName);
    		var folderName = $("#currentDirectoryName").text();
    		var pluginPath = this.getPath();
			if (!pluginPath.endsWith("/")) {
				pluginPath += "/";
			}
			pluginPath += getUiProps().MSG0295;
            uBoxDetail.populatePropertiesList(pluginPath, pluginPath, folderName, false, "folder");
    	} else {
    		objOdata.createTable(objOdata.currentCollectionPath);
    		var folderName = $("#currentDirectoryName").text();
            uBoxDetail.populatePropertiesList(objOdata.currentCollectionPath, objOdata.currentCollectionPath, folderName, false, "folder");
            uBoxAcl.getAclSetting(objOdata.currentCollectionPath, sessionStorage.boxName);
    	}
    	/*var folderName = $("#currentDirectoryName").text();
        uBoxDetail.populatePropertiesList(objOdata.currentCollectionPath, objOdata.currentCollectionPath, folderName, false, "folder");
        uBoxAcl.getAclSetting(objOdata.currentCollectionPath, sessionStorage.boxName);*/
    objCollectionOdata.displaySuccessMessage(getUiProps().MSG0260, 188);
    
    } 
   	}catch(exception){
	   objCollectionOdata.displayErrorMessage(getUiProps().MSG0261, 178);
   }
   	$("#webDavDetailBody").show();
	$("#webDavDetailMessageBody").hide();
document.getElementById("dvGreyOut").style.display = 'none';
    objOdata.spinner.stop();
};

/**
 * The purpose of this method is set content type for file
 */
odata.prototype.setContentType = function () {
    if (objOdata.contentTypeHashTable.hasItem(objOdata.fileType.toLowerCase())) {
        return objOdata.contentTypeHashTable.getItem(objOdata.fileType.toLowerCase());
    }
    return 'application/octet-stream';
};
/**
 * The purpose of this method is show conflict message for file upload.
 */
odata.prototype.displayUploadConflictMessage = function (startText, entityName,lastText) {
    var shorterEntityName = objCommon.getShorterEntityName(entityName);
    addErrorClass();
    inlineMessageBlock();
    document.getElementById("successmsg").innerHTML = startText+ " " +shorterEntityName+ " " +lastText;
    document.getElementById("successmsg").title = entityName;
    objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
    objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
};

/**
 * The purpose of this method is dispaly error message if there is any error 
 * during upload operation
 */
odata.prototype.displayUploadErrorMessage = function () {
    addErrorClass();
    inlineMessageBlock();
    document.getElementById("successmsg").innerHTML = "Error during file upload!";
    objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
    objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
};

/**
 * This variable is used to create and customize spinner image for file upload
 */
odata.prototype.odataopts = {
            lines : 8, // The number of lines to draw
            length : 0, // The length of each line
            width : 7, // The line thickness
            radius : 11, // The radius of the inner circle
            corners : 1, // Corner roundness (0..1)
            rotate : 0, // The rotation offset
            direction : 1, // 1: clockwise, -1: counterclockwise
            color : '#b6b6b6', // #rgb or #rrggbb
            speed : 1.2, // Rounds per second
            trail : 68, // Afterglow percentage
            shadow : false, // Whether to render a shadow
            hwaccel : false, // Whether to use hardware acceleration
            className : 'spinner', // The CSS class to assign to the spinner
            zIndex : 2e9, // The z-index (defaults to 2000000000)
            top : '300', // Top position relative to parent in px
            left : '720', // Left position relative to parent in px
            position : 'fixed'

};

/**
 * This purpose of this method is to show spinner for upload
 * file processing
 */
odata.prototype.showSpinnerForUploadFile = function () {
    var target = document.getElementById('spinner');
    objOdata.spinner = new Spinner(objOdata.odataopts).spin(target);
    return objOdata.spinner;
};

/***********************Upload File End************************/

/**********************Box Collection BreadCrum Start ************************/

/**
 * The purpose of this function is update odata grid and breadcrum
 */
odata.prototype.clickFolder = function (collectionName, collectionURL, type) {
	folderClicked = true;
	sessionStorage.resourcetype = '';
	objCommon.disableDeleteIcon("#btnDeleteCollection");
	$("#currentDirectoryName").text(collectionName);
	$("#currentDirectoryName").attr("title",collectionName);
	$("#currentDirectoryIcon").css("background","url(./images/newSprite.png) no-repeat 54% -920px");
	$("#currentDirectoryIcon").css("margin-top","0px");
	$("#webDavTable").find("tbody tr").remove();
	var shorterCollectionName = objCommon.getShorterName(collectionName, 13);
	var rowCount = $("#tblBoxBreadCrum tbody tr").length;
	var table = document.getElementById("tblBoxBreadCrum");
	//var rowCount = noOfBreadcrums;
	if (rowCount===3) {
		if (objOdata.addBreadCrumSeparator()) {
			rowCount = rowCount + 1;
		}
	}
	var row = table.insertRow(rowCount);
	this.selectedBreadCrumId = 'columnId_'+rowCount+'';
	row.id = 'rowId_'+rowCount+'';
	var cell = row.insertCell(0);
	cell.innerHTML = collectionName;
	cell.id = this.selectedBreadCrumId;
	cell.title = collectionName;
	this.setCollectionPath(collectionURL);
	var collPath = "'" + decodeURIComponent(collectionURL) + "'";
	var mType = "'" + type + "'";
	cell.setAttribute('onclick', 'objOdata.deleteBreadCrum(id,title,' + collPath + ','+mType+')');
	var cell1 = row.insertCell(-1);
	cell1.innerHTML = ">";
	cell1.id = 'arrowColId_'+rowCount+'';
	$(cell1).addClass("breadCrumStyle");
	sessionStorage.ArrowId = cell1.id;
	var appendedRow  = '#'+'rowId_'+ rowCount+'';
	$(appendedRow).addClass("breadrCrumTableTr ContentHeading1 ContentHeadingpt1");
	var appendedCol  = '#'+'columnId_'+ rowCount+'';
	$(appendedCol).addClass("mainTableEllipsisBreadCrum");
	this.showBreadCrum(rowCount);
	this.persistBreadCrumPath(collectionName);
	boxHeirarchyPath = document.getElementById("dvBreadCrumBrowse").title;
	this.selectedBreadCrum(rowCount);
	if (type != 'p:service') {
		this.createTable(collectionURL);
		uFileDownload.disableDownloadArea();
		uBoxDetail.populatePropertiesList(collectionURL, collectionURL, collectionName, false, "folder");
		uBoxAcl.getAclSetting(collectionURL, sessionStorage.boxName);
		$("#webDavDetailBody").show();
		$("#webDavDetailMessageBody").hide();
	} else if (type == 'p:service') {
		uBoxDetail.populatePropertiesList(collectionURL, collectionURL, collectionName, false, "p:service");
		$("#webDavDetailBody").show();
		$("#webDavDetailMessageBody").hide();
	}
	//$("#wdchkSelectall").attr("checked",false);
	/*uFileDownload.disableDownloadArea();
	uBoxDetail.populatePropertiesList(collectionURL, collectionURL, collectionName, false, "folder");
	$("#webDavDetailBody").show();
	$("#webDavDetailMessageBody").hide();
	uBoxAcl.getAclSetting(collectionURL, sessionStorage.boxName);*/
	folderClicked = false;
};


/**
 * The purpose of this function is add selected class on breadcrum navigation
 */
odata.prototype.selectedBreadCrum = function (rowCount) {
    for (var i=0; i<=rowCount; i++) {
        var selectedColumn  = '#'+'columnId_'+i+'';
        $(selectedColumn).addClass("breadCrumSelectedTd");
        if (i == rowCount) {
            var selectedColumn = '#'+'columnId_'+rowCount+'';
            $(selectedColumn).removeClass("breadCrumSelectedTd");
        }
    }
};

/**
 * The purpose of this function is delete right side breadcrum navigation. 
 */
odata.prototype.deleteBreadCrum = function (id,title,pcollectionURL, mType) {
	objCommon.hideListTypePopUp();
	if (id!==this.selectedBreadCrumId) {
		document.getElementById('dvRefreshIcon').style.pointerEvents = 'auto';
		sessionStorage.resourcetype = '';
		folderClicked = true;
		var clickedId = id;
		var arrClickedId = clickedId.split("_");
		clickedId = arrClickedId[1];
		objOdata.showBreadCrum(clickedId);
		clickedId = parseInt(clickedId) + 1;
	
		objOdata.delBreadCrumRows(clickedId);
		$("#currentDirectoryName").text(title);
		$("#currentDirectoryName").attr("title",title);
		$("#currentDirectoryIcon").css("background","url(./images/newSprite.png) no-repeat 54% -920px");
		$("#currentDirectoryIcon").css("margin-top","0px");
		$("#currentDirectoryIcon").css("margin-left","0px");
		var type = "folder";
		var columnId = '#'+id;
		if (columnId == '#columnId_0') {
			//folderClicked = false;
			pcollectionURL = boxRootpath;
			$("#currentDirectoryIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
			$("#currentDirectoryIcon").css("margin-top","-2px");
			$("#currentDirectoryIcon").css("margin-left","0px");
			type = "box";
		}
		$(columnId).removeClass("breadCrumSelectedTd");
		uFileDownload.disableDownloadArea();
		objOdata.setCollectionPath(pcollectionURL);
		$("#boxEditAclSettings").removeClass("disabledEditIconACLSettings");
		$("#boxEditAclSettings").addClass("editIconACLSettings");
		if(objOdata.selectedView == "odata"){
			var target = document.getElementById('spinner');
			var opts = objCommon.optsCustom;
			opts.top = '400';
			opts.left = 'auto';
			var spinner = new Spinner(opts).spin(target);
			$("#webDavContentArea").hide();
			$("#webDavContentArea").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/boxDetailContent.html',
					function(){
						objOdata.createTable(objOdata.currentCollectionPath);
						uBoxDetail.populatePropertiesList(objOdata.currentCollectionPath, objOdata.currentCollectionPath, title, false, type);
						uBoxAcl.getAclSetting(sessionStorage.Path, sessionStorage.boxName);
						/*$("#leftIcons").show();
						$("#rightTertiaryBar").show();*/
						$("#tertiaryBar").show();
						$("#webDavContentArea").show();
						objOdata.selectedView = "";
						spinner.stop();
			});
		} else if (mType == "p:service") {
			objOdata.displayPluginSource(sessionStorage.rowSelectCollectionName);
			uBoxDetail.populatePropertiesList(objOdata.currentCollectionPath, objOdata.currentCollectionPath, title, false, "p:service");
			uBoxAcl.getAclSetting(sessionStorage.Path, sessionStorage.boxName);
			objOdata.selectedView = "";
			$("#boxEditAclSettings").removeClass("disabledEditIconACLSettings");
			$("#boxEditAclSettings").addClass("editIconACLSettings");
		} else {
			objOdata.createTable(objOdata.currentCollectionPath);
			uBoxDetail.populatePropertiesList(objOdata.currentCollectionPath, objOdata.currentCollectionPath, title, false, type);
			uBoxAcl.getAclSetting(sessionStorage.Path, sessionStorage.boxName);
		}
		$("#webDavDetailBody").show();
		$("#webDavDetailMessageBody").hide();
	}
};

odata.prototype.delBreadCrumRows= function(paraRowCount) {
	var noOfBreadcrums = $("#tblBoxBreadCrum tbody tr").length;
	for (var i = paraRowCount; i<=noOfBreadcrums; i++) {
		$('#rowId_'+i+'').remove();
	}
	if(parseInt(paraRowCount) <= 3) {
		$('#rowId_Separator').remove();
	}
	this.updateCollectionPathOnBreadCrumClick(paraRowCount);
};

odata.prototype.persistBreadCrumPath = function(collectionName) {
	var dvValue = document.getElementById("dvBreadCrumBrowse").title;
	if (!dvValue.endsWith("/")) {
		dvValue += "/";
	}
	dvValue += collectionName + "/";
	document.getElementById("dvBreadCrumBrowse").title = dvValue;
};

odata.prototype.updateCollectionPathOnBreadCrumClick = function() {
	var noOfBreadcrums = $("#tblBoxBreadCrum tbody tr").length;
	var collectionTitle = '';
	var mainBoxValue = getUiProps().MSG0039;
	boxHeirarchyPath = '';
	for ( var i = 0; i < noOfBreadcrums; i++) {
		if (i != 3) {
			collectionTitle = document.getElementById("columnId_" + i).title;
			boxHeirarchyPath += collectionTitle + "/";
		}

	}
	if (boxHeirarchyPath.endsWith('/')) {
		boxHeirarchyPath = boxHeirarchyPath.substring(0, boxHeirarchyPath.length-1);
	}
	boxHeirarchyPath = boxHeirarchyPath.replace(mainBoxValue, getUiProps().MSG0293);
	document.getElementById("dvBreadCrumBrowse").title = boxHeirarchyPath;
	this.createTable();
};


odata.prototype.showBreadCrum= function(paraRowCount) {
	for (var i = 0; i<=paraRowCount; i++) {
		$('#rowId_'+i+'').removeClass("displayNone");
	}
	for (var i = 0; i<=paraRowCount-6; i++) {
		//var appendedRow  = '#'+'rowId_'+noOfBreadcrums+'';
		$('#rowId_'+ (parseInt(i) + 3) +'').addClass("displayNone");
	}
	$('#rowId_Separator').addClass("displayNone");
	if(paraRowCount>6) {
		$('#rowId_Separator').removeClass("displayNone");
	}
};


odata.prototype.addBreadCrumSeparator= function() {
	var rowID = document.getElementById("rowId_Separator");
	if(rowID===undefined || rowID==null) {
		var table = document.getElementById("tblBoxBreadCrum");
		var row = table.insertRow(3);
		row.id = 'rowId_Separator';
		var cell = row.insertCell(0);
		cell.innerHTML = '....';
		cell.id = 'columnId_Separator';
		cell.title = '....';
		var cell1 = row.insertCell(-1);
		cell1.innerHTML = "";
		cell1.id = 'arrowColId_Separator';
		$('#rowId_Separator').addClass("breadrCrumTableTr ContentHeading1 ContentHeadingpt1");
		return true;
	}
	return false;
};

/**
 * The purpose of this function is to toggle upload link on 
 * selection of any file.
 */
odata.prototype.toggleUploadLink = function () {
   /* if ($("#btnUploadFile").hasClass("uploadBtn")) {
        $("#btnUploadFile").removeClass("uploadBtn");
        $("#btnUploadFile").addClass("importBtn");
        $("#btnUploadFile").attr('title', "Download");
    } */	
};

/**
 * The purpose of this function is to toggle download link on 
 * de selection of any file.
 */
odata.prototype.activateDownloadLink = function () {
	$("#dvDownLoadIcon").removeClass();
	$("#dvDownLoadText").removeClass();
	$("#dvDownLoadIcon").addClass("downloadWebDavIconEnabled");
	$("#dvDownLoadText").addClass("downloadWebDavTextEnabled");
	if (sessionStorage.selectedLanguage == 'ja') {
		$("#dvDownLoadText").addClass("japaneseFont");
	}
	uBoxDetail.downloadHoverEffect();
	document.getElementById('downloadWebDavWrapper').style.pointerEvents = 'auto';
};
/**
 * The purpose of this function is to enable upload/download operation
 * on selected condition
 */
odata.prototype.toggleMode = function(){
    /*if ($("#btnUploadFile").hasClass("uploadBtn")) {
        document.getElementById('fileID').click();
        document.getElementById('fileID').value = '';
        $("#downloadBinaryData").attr("href", '');
        $("#downloadBinaryData").attr("download", '');
    } else if ($("#btnUploadFile").hasClass("importBtn")) {
        uFileDownload.downloadFile();
    }*/
    document.getElementById('fileID').click();
    document.getElementById('fileID').value = '';
};

/**
 * The purpose of this function is to return selected collection name from odata grid 
 */
odata.prototype.getSelectedCollectionName = function(){
    var collectionName = "";
    var noOfCollections = $("#webDavTable tbody tr").length;
    for(var index = 0; index < noOfCollections; index++){
        if($("#wdrowid" + index).hasClass("selectRow")){
            collectionName = document.getElementById("col" + index).title;
            break;
        }
    }
    return collectionName;
};

/**
 * The purpose of this function is to refresh odata grid after folder click 
 */
odata.prototype.refreshTable = function () {
    var rowID = 'wdrowid';
    var tableLength = $("#webDavTable tbody tr").length;
    var chkBoxID = 'wdchkBox';
    for (var count = 0; count <= tableLength; count++) {
        var obj = $('#' + rowID + count);
        obj.siblings().removeClass('selectRow');
        obj.removeClass('selectRow');
        $('#' + chkBoxID + count).attr('checked', false);
    }
    //this.showHideButtons();
    this.hidePluginIcons();
    $("#btnUploadFile").removeClass("importBtn");
    $("#btnUploadFile").addClass("uploadBtn");
    $("#btnUploadFile").attr('title', "Upload");
    objCommon.disableButton("#btnDeleteCollection");
    isClickedFolder = false;
};

/**
 * The purpose of this function is to refresh odata grid on click of refresh button
 */
odata.prototype.refreshCollection = function () {
	$("#dvRefreshIcon").css("pointer-events","none");
	objOdata.spinner = objOdata.showSpinnerForUploadFile();
	var refreshPath = objOdata.getPath();
	var pluginSource = getUiProps().MSG0295;
	var heirarchyLevelName = $("#currentDirectoryName").text();
	var folderHeirarchy = document.getElementById("dvBreadCrumBrowse").title;
	var isInsideFolder = folderHeirarchy.indexOf("/");
	var type = null;
	if (isInsideFolder != -1) {
		type = "folder";
		folderClicked = true; 
	} else {
		type = "box";
		folderClicked = false;
	}//sessionStorage.resourcetype = 'p:service';
	var lastBreadCrumTitle = $("#tblBoxBreadCrum tbody tr:last td:first").attr('title');
	if (lastBreadCrumTitle == pluginSource) {
		sessionStorage.resourcetype = 'p:service';
	}
	if (sessionStorage.resourcetype != 'p:service') {
		objOdata.refreshCollectionCallback(objOdata.createTable(refreshPath),
				function() {
					uBoxDetail.populatePropertiesList(refreshPath, refreshPath, heirarchyLevelName, false, type);
					$("#webDavDetailMessageBody").hide();
					$("#webDavDetailBody").show();
					uBoxAcl.getAclSetting(refreshPath, sessionStorage.boxName);
					$("#dvRefreshIcon").css("pointer-events","auto");
					objOdata.spinner.stop();
				});
	} else if (sessionStorage.resourcetype == 'p:service') {
		$("#dvDownLoadIcon").css("background","url(./images/newSprite.png) no-repeat -16px -856px");
		$("#dvDownLoadText").css("color"," #e8e8e8");
		$('#wdchkSelectall').attr('checked', false);
		var count = 0;
		if (!refreshPath.endsWith("/")) {
			refreshPath += "/";
		}
		refreshPath += pluginSource;
		objOdata.refreshCollectionCallback(objOdata.createEngineServiceDetailsTable(count, sessionStorage.rowSelectCollectionName, true),
				function() {
					uBoxDetail.populatePropertiesList(refreshPath, refreshPath, pluginSource, false, "folder");
					$("#webDavDetailMessageBody").hide();
					$("#webDavDetailBody").show();
					uBoxAcl.getAclSetting(refreshPath, sessionStorage.boxName);
					$("#dvRefreshIcon").css("pointer-events","auto");
					objOdata.spinner.stop();
				});
	}
	
};

/**
 * The purpose of this function is to handle callback for odata grid refresh 
 */
odata.prototype.refreshCollectionCallback = function (refresh, callback) {
    setTimeout(function(){callback();},1000);
};
/**********************Box Collection BreadCrum End ************************/
/**
 * The purpose of the following method is to read xml nodes of a box/collection.
 */
odata.prototype.getProperties = function(url) {
    var folderList = [];
    var accessor = objOdata.getAccessor();
    var restAdapter = _pc.RestAdapterFactory.create(accessor);
    var response = restAdapter.propfind(url);
    var doc = response.bodyAsXml();
    var nl = doc.getElementsByTagName("response");
    var name="";
    //for ( var i = 0; i < nl.length; i++) {
    var elm = nl[0];
    var propChildNodes = elm.getElementsByTagName("prop")[0].childNodes;
    for ( var i = 0; i < propChildNodes.length; i++) {
        if (propChildNodes[i].nodeName!= "#text" && propChildNodes[i].nodeName!= "acl" && propChildNodes[i].nodeName!= "resourcetype" && propChildNodes[i].nodeName!= "p:service"){ 
            name = {"id" : i,"Name" :  propChildNodes[i],"Value" : propChildNodes[i].textContent};
            folderList.push(name);
        }
        if(propChildNodes[i].nodeName == "resourcetype"){
        	if(propChildNodes[i].childNodes.length != 0){
        		name = {"id" : i,"Name" :  propChildNodes[i],"Value" : propChildNodes[i].childNodes[1].nodeName};
        	}else{
        		name = {"id" : i,"Name" :  propChildNodes[i],"Value" : ""};
        	}
            folderList.push(name);
        }
    }
    return folderList;
};

/**
 * The purpose of the following method is to create property rows.
 * @param propertyName
 * @param propertyValue
 * @returns {String}
 */
odata.prototype.createPropertyRows = function (propertyName,propertyValue,dynamicTable) {
    dynamicTable += "<tr class=propRow >";
    dynamicTable += '<td title="'+propertyName+'" class="propertyRow"><div class="propertyHeader">'+propertyName+'</div></td><td  title="'+propertyValue+'" class="propertyColumn"><div class="propertyData"> : '+propertyValue+'</div></td>';
    dynamicTable += "</tr>";
    return dynamicTable;
};

/**
 * The purpose of the following method is to get collection path.
 * @returns {String}
 */
odata.prototype.getCollectionPath  = function() {
    var collectionName = objOdata.getSelectedCollectionName();
    var path = sessionStorage.selectedcellUrl;
    path += collectionPath;
    if (!path.endsWith("/")) {
        path += "/";
    }
    if (collectionName.length > 0 ) {
        path += collectionName;
    }
    return path;
};

/**
 * The purposoe of the following method is to populate properties list.
 */
odata.prototype.populatePropertiesList  = function() {
    $(".propRow").remove();
    var dynamicTable='';
    dynamicTable = '<table>';
    var objOdata  = new odata();
    var collectionPath = objOdata.getCollectionPath();
    var properties = objOdata.getProperties(collectionPath);
    for (var count=0;count<properties.length;count++){
        var propertyName = properties[count].Name;
        propertyName = propertyName.nodeName;
        var propertyValue = properties[count].Value;
        if (propertyName == "getlastmodified" || propertyName =="creationdate") {
            propertyValue = ""+ propertyValue+""; 
            var objCommon= new common();
            propertyValue = new Date(propertyValue).getTime();
            propertyValue = "/Date("+ propertyValue + ")/";
            propertyValue = objCommon.convertEpochDateToReadableFormat(propertyValue);
        }
        dynamicTable = objOdata.createPropertyRows(propertyName,propertyValue,dynamicTable);
    }
    dynamicTable += "</table>";
    document.getElementById("dvPropertyList").innerHTML = dynamicTable;
};

/**
 * Following method shows cursor (hand) pointer.
 * @param id element ID
 */
odata.prototype.showCurosrHand = function(id) {
	$(id).css('cursor', 'pointer');
};

/**
 * Following mwthod shows default pointer.
 * @param id element ID
 */
odata.prototype.showDefaultPointer = function(id) {
	$(id).css('cursor', 'default');
};

/**
 * Following method attaches style to the create Icon (collection) on hover.
 */
odata.prototype.showCreateIconOnHover = function(){
	$("#createIconCollection").css("background","url(./images/sprite.png) no-repeat 43% -551px");
	$("#createTextCollection").css("color","#c80000");
	$("#arrowCollection").css("background","url(./images/sprite.png) no-repeat 18% -577px");
	$("#createCollectionSubMenu").css("display","block");
};

/**
 * Following method attaches style to the create Icon (collection) when hover is out.
 */
odata.prototype.showCreateIconOnHoverOut = function(){
	$("#createIconCollection").css("background","url(./images/sprite.png) no-repeat 43% -523px");
	$("#createTextCollection").css("color","#1b1b1b");
	$("#arrowCollection").css("background","url(./images/sprite.png) no-repeat 18% -600px");
	$("#createCollectionSubMenu").css("display","none");
};

/**
 * The purpose of this method is to set dynamic height for Data Managment
 * area as per view port size.
 */
odata.prototype.setDynamicHeight = function(){
	var viewPortHeight = $(window).height();
	var gridHeight		= viewPortHeight - 360;
	var gProfileHeight	= viewPortHeight - 236;
	var descHeight		= viewPortHeight - 230;
	
	//dataManagment Tab
	$("#webDavProfileArea").css("max-height", '414px');
	
	//BoxProfileInfo
	$("#CellProfileInfo").css("max-height", '420px');
	$("#webDavTbody").css("max-height", '290px');

	if (viewPortHeight > 650) {

		//dataManagment Tab
		$("#webDavTbody	").css("max-height", gridHeight);

		//BoxProfileInfo
		$("#webDavProfileArea").css("max-height", gProfileHeight);
		$("#CellProfileInfo").css("max-height", descHeight);
	}
};
