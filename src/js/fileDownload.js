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
function fileDownload(as) {

}

var uFileDownload = new fileDownload();
var fileDownloadSpinner = null;
var arrBlobUrls = [];
/**
 * The purpose of this function is to implement download file 
 * functionality
 */
fileDownload.prototype.downloadFile = function () {
	fileDownloadSpinner = objOdata.showSpinnerForUploadFile();
	document.getElementById("dvGreyOut").style.display = 'block';
	var collectionName = objOdata.getSelectedCollectionName();
	if (collectionName.length == 0) {
		collectionName = this.getSelectedFileInsideServiceCollection();//sessionStorage.serviceFileName;
	}
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var tab = sessionStorage.tabName;
	//this.clearServiceCollectionData();
	path = this.getFilePath(collectionName);
	if (tab == "Log") {
		var logFolderName = document.getElementById("dvLogFolder").innerHTML;
		var logFileName = document.getElementById("defaultLogFileName").title;
		path = uEventLog.getLogFilePath(baseUrl, cellName, logFolderName, logFileName);
		collectionName = logFileName;
	} else if (tab == "Snapshot") {
		// Get the file name and URL of the selected snapshot
		var snapshotFileName = uEventSnapshot.getSelectedSnapshotName();
		path = uEventSnapshot.getSnapshotPath(snapshotFileName);
		collectionName = snapshotFileName;
	}
	var fileType = collectionName.substring(collectionName.lastIndexOf('.') + 1);
	contentType = this.setFileContentType(fileType);
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	this.get(path, contentType, "*", accessor, collectionName);

};

/**
 * Following method downloads file on clicking file name.
 */
fileDownload.prototype.downloadFileOnClick = function (collectionName,path) {
	fileDownloadSpinner = objOdata.showSpinnerForUploadFile();
	document.getElementById("dvGreyOut").style.display = 'block';
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var fileType = collectionName.substring(collectionName.lastIndexOf('.') + 1);
	contentType = this.setFileContentType(fileType);
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	this.get(path, contentType, "*", accessor, collectionName);
};

/**
 * The purpose of this function is to implement download barfile 
 * functionality
 */
fileDownload.prototype.downloadBarFile = function () {
	fileDownloadSpinner = objOdata.showSpinnerForUploadFile();
	document.getElementById("dvGreyOut").style.display = 'block';
	var fileName = $("#currentDirectoryName").text() + ".bar";
	var baseUrl = getClientStore().baseURL;
	var cellName = sessionStorage.selectedcell;
	var tab = sessionStorage.tabName;
	path = objOdata.currentCollectionPath;

	if (sessionStorage.newApiVersion == "true") {
		contentType = "application/zip+x-personium-bar";
	} else {
		contentType = "application/x-personium-bar+zip";
	}
	
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, "", "");
	this.get(path, contentType, "*", accessor, fileName);
};


/**
 * The purpose of this function is to create path 
 * for selected file
 * @param baseUrl
 * @param cellName
 * @param collectionName
 * @returns {Path}
 */
fileDownload.prototype.getFilePath = function(collectionName) {
	var path = objOdata.currentCollectionPath +"/";
	//path += collectionPath;
	if (!path.endsWith("/")) {
		path += "/";
	}
	if (sessionStorage.resourcetype == 'p:service') {
		//path += sessionStorage.selectedSvCol;
		path += "__src/";
	}
	path += collectionName;
	this.clearServiceCollectionData();
	return path;
};

/**
 * The purpose of this function to perform GET operation for file. 
 * @param requestUrl
 * @param accept
 * @param etag
 * @param accessor
 * @param collectionName
 */
fileDownload.prototype.get = function(requestUrl, accept, etag, accessor, collectionName) {
	var builder = new _pc.PersoniumRequestHeaderBuilder();
	builder.acceptEncoding("gzip");
	builder.accept(accept);
	builder.token(accessor.accessToken);
	builder.ifNoneMatch(etag);
	builder.defaultHeaders(accessor.getDefaultHeaders());
	var xhr = new XMLHttpRequest();
	xhr.open("GET", requestUrl, true);
	builder.build(xhr);
	xhr.responseType = "blob";
	xhr.onload = function(oEvent) {
		if (xhr.readyState == 4 && xhr.status == 200) {
			uFileDownload.fileDownloadSuccess(xhr, collectionName);
		} else {
			uFileDownload.fileDownloadError(xhr, collectionName);
		}
	};
	xhr.send(null);
};

/**
 * The purpose of this function is to create file (using Blob/URL) on success of 
 * file GET operation (200)
 * @param xhr
 * @param fileName
 */
fileDownload.prototype.fileDownloadSuccess = function(xhr, fileName) {
	fileDownloadSpinner.stop();
	document.getElementById("dvGreyOut").style.display = 'none';
	new _pc.PersoniumResponse(xhr);
	var blob = xhr.response;
	var blobURLref = URL.createObjectURL(blob);
	arrBlobUrls.push(blobURLref);
	$("#downloadBinaryData").attr("href",blobURLref);
	$("#downloadBinaryData").attr("download", fileName);
	document.getElementById('downloadBinaryData').click();
	$('input:checkbox').attr('checked',false);
	uFileDownload.disableDownloadArea();
	$('table tr').removeClass('selectRow');
};

/**
 * The purpose of this function to show error message on file download
 * fail operation.
 * @param xhr
 * @param fileName
 */
fileDownload.prototype.fileDownloadError = function(xhr, fileName) {
	fileDownloadSpinner.stop();
	document.getElementById("dvGreyOut").style.display = 'none';
	new _pc.PersoniumResponse(xhr);
	if (xhr.status == 404) {
		alert(getUiProps().MSG0206);
	} else if (xhr.status == 400) {
		alert(getUiProps().MSG0207);
	} else if (xhr.status == 401) {
		alert(getUiProps().MSG0208);
	} else if (xhr.status == 403) {
		alert(getUiProps().MSG0209);
	} else if (xhr.status == 503) {
		alert(getUiProps().MSG0210);
	}
};

/**
 * The purpose of this function is to set content type on the
 * basis of selected file type
 * @param fileType
 * @returns
 */
fileDownload.prototype.setFileContentType = function (fileType) {
	if (objCommon.contentTypeHashTable.hasItem(fileType.toLowerCase())) {
		return objCommon.contentTypeHashTable.getItem(fileType.toLowerCase());
	}
	return "text/plain";
};


/**
 * The purpose of this function is to clear blob storage
 */
fileDownload.prototype.clearBlobStorage = function () {
	if (arrBlobUrls.length >0) {
		for (var i =0; i <arrBlobUrls.length; i++) {
			URL.revokeObjectURL(arrBlobUrls[i]);
		}
		arrBlobUrls.length = 0;
	}
};

/**
 * The purpose of this function is to clear service collection stored data after 
 * success operation
 */
fileDownload.prototype.clearServiceCollectionData = function() {
	sessionStorage.resourcetype = '';
	sessionStorage.selectedSvCol = '';
};

/**
 * The purpose of this function is to get information related with selected 
 * service collection
 * @returns {String}
 */
fileDownload.prototype.getSelectedFileInsideServiceCollection = function() {
	//var noOfCollections = $("#webDavTable tbody tr").length;
	var fileName = '';
//	for(var index = 0; index < noOfCollections; index++){
	var index = 0;
		var serviceColFiles = $("#tblServiceCollectionDetails tbody tr").length;
		for (var i = 0; i < serviceColFiles; i++) {
			if($("#rowsrc_" + index+"_"+i).hasClass("selectSrcColRow")){
				fileName = document.getElementById("chkBox1_"+index+"_"+i).value;
				sessionStorage.selectedSvCol = sessionStorage.rowSelectCollectionName;//document.getElementById("wdchkBox"+index).value;
				var resourceType = "p:service";//document.getElementById("fileTypeId" + index).value;
				//resourceType = resourceType.replace(/'/g, "");
				sessionStorage.resourcetype = resourceType;
				break;
			}
		}
	//}
	return fileName;
};

/**
 * Following method disables download area.
 */
fileDownload.prototype.disableDownloadArea = function() {
	$("#dvDownLoadIcon").removeAttr("style");
	$("#dvDownLoadText").removeAttr("style");
	$("#dvDownLoadIcon").removeClass();
	$("#dvDownLoadText").removeClass();
	$("#dvDownLoadIcon").addClass("downloadWebDavIconDisabled");
	$("#dvDownLoadText").addClass("downloadWebDavTextDisabled");
	document.getElementById('downloadWebDavWrapper').style.pointerEvents = 'none';
};
