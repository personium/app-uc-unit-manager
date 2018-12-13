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
/** ************************ Query on OData : START ************************* */

function odataQuery() {
}

var uOdataQuery = new odataQuery();

$(window).resize(function(){
	if(document.getElementById("rawBtn") != undefined){
		var isRawBtnSelected = $("#rawBtn").hasClass("odataRawIconSelected");
		var mode = "";
		if(isRawBtnSelected){
			mode = "raw";
		}
		uOdataQuery.setMarginForAtomFormatMsg(mode);
	}
	uOdataQuery.setMarginForExpandQueryMsg();
	uOdataQuery.setMarginForGenericMsg();
	uOdataQuery.setMarginForNoDataMsg();
});
/**
 * The purpose of this function is to initialize query text box.
 */
/*odataQuery.prototype.initializeTxtboxWithDefaultText = function (propList) {
	if (document.getElementById("dvRowCount")!= undefined) {
	document.getElementById("dvRowCount").style.display = "none";
	//var propList = uDataManagement.getHeaderList();
	//var objEntityType = new entityType();
	var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
	var input = document.getElementById("txtBoxQuery");
	input.value = "/" + entityTypeName;
	if (propList.length === 0) {
		input.value = "Type your query";
	}
	}
};*/

/**
 * The purpose of this method is to set margin for atom format message as per 
 * view port size.
 */
odataQuery.prototype.setMarginForAtomFormatMsg = function(mode){
	var width = $(window).width();
	var height = $(window).height();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	
	var availableWidthForOData = (rightPanelWidth - 15 - 20);
	var availableWidthForODataContent = Math.round(((79.96742/100)*availableWidthForOData));
	var dataGridWidth = availableWidthForODataContent;
	var msgWidth = 146;
	var marginLeftForNoDataMsg = ((dataGridWidth/2)-10)-(msgWidth/2);
	
	var fixedHeightExceptODataGrid = (295 + 113);
	var dataGridHeight = (height - fixedHeightExceptODataGrid - 38 - 28);
	var noDataMsgHeight = (1 + 23 + 1);
	var marginTopForNoDataMsg = ((dataGridHeight/2) - (noDataMsgHeight/2));
	var defaultMarginTop = 75.5;
	if(mode != undefined && mode == "raw"){
		marginTopForNoDataMsg = marginTopForNoDataMsg +19;
		defaultMarginTop = defaultMarginTop + 19;
	}
	if (width>1280) {
		$("#dvAtomFormatMsg").css("margin-left", (marginLeftForNoDataMsg - 12) + "px");
	}else{
		$("#dvAtomFormatMsg").css("margin-left","396px");
	}
	if (height>650){
		$("#dvAtomFormatMsg").css("margin-top", marginTopForNoDataMsg + "px");
	}else{
		$("#dvAtomFormatMsg").css("margin-top", defaultMarginTop + "px");
	}
};

/**
 * The purpose of this method is to set margin for expand query message as per 
 * view port size.
 */
odataQuery.prototype.setMarginForExpandQueryMsg = function(){
	var width = $(window).width();
	var height = $(window).height();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	
	var availableWidthForOData = (rightPanelWidth - 15 - 20);
	var availableWidthForODataContent = Math.round(((79.96742/100)*availableWidthForOData));
	var dataGridWidth = availableWidthForODataContent;
	var msgWidth = 262;
	var marginLeftForNoDataMsg = ((dataGridWidth/2)-10)-(msgWidth/2);
	
	var fixedHeightExceptODataGrid = (295 + 113);
	var dataGridHeight = (height - fixedHeightExceptODataGrid - 38 - 28);
	var noDataMsgHeight = (1 + 23 + 1);
	var marginTopForNoDataMsg = ((dataGridHeight/2) - (noDataMsgHeight/2));
	if (width>1280) {
		$("#dvExpandQueryMsg").css("margin-left", (marginLeftForNoDataMsg -12)+ "px");
	}else{
		$("#dvExpandQueryMsg").css("margin-left","338px");
	}
	if (height>650){
		$("#dvExpandQueryMsg").css("margin-top", marginTopForNoDataMsg + "px");
	}else{
		$("#dvExpandQueryMsg").css("margin-top","75.5px");
	}
};

/**
 * The purpose of this method is to set margin for no data message as per 
 * view port size.
 */
odataQuery.prototype.setMarginForNoDataMsg = function(){
	var width = $(window).width();
	var height = $(window).height();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	
	var availableWidthForOData = (rightPanelWidth - 15 - 20);
	var availableWidthForODataContent = Math.round(((79.96742/100)*availableWidthForOData));
	var dataGridWidth = availableWidthForODataContent;
	var msgWidth = 87;
	var marginLeftForNoDataMsg = ((dataGridWidth/2)-10)-(msgWidth/2);
	
	var fixedHeightExceptODataGrid = (295 + 113);
	var dataGridHeight = (height - fixedHeightExceptODataGrid - 38 - 28);
	var noDataMsgHeight = (1 + 23 + 1);
	var marginTopForNoDataMsg = ((dataGridHeight/2) - (noDataMsgHeight/2));
	if (width>1280) {
		$("#dvNoDataMsg").css("margin-left", (marginLeftForNoDataMsg -12) + "px");
	}else{
		$("#dvNoDataMsg").css("margin-left","425.5px");
	}
	if (height>650){
		$("#dvNoDataMsg").css("margin-top", marginTopForNoDataMsg + "px");
	}else{
		$("#dvNoDataMsg").css("margin-top","75.5px");
	}
};

/**
 * The purpose of this method is to set margin for generic message as per 
 * view port size.
 */
odataQuery.prototype.setMarginForGenericMsg = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	
	var availableWidthForOData = (rightPanelWidth - 15 - 20);
	var availableWidthForODataContent = Math.round(((79.96742/100)*availableWidthForOData));
	var dataGridWidth = availableWidthForODataContent;
	var leftSubHeadingWidth = 213;
	var rightSubHeadingWidth = $(".odataSubHeaderRight").width();
	var msgWidth = $("#errorMsgODataQuery"). width();
	if(dataGridWidth >= 982){
		var marginLeftForMsg = ((dataGridWidth - leftSubHeadingWidth - rightSubHeadingWidth)/2)-(msgWidth/2);
		$("#errorMsgODataQuery").css("margin-left", (marginLeftForMsg -12) + "px");
	}else{
		dataGridWidth = 982;
		var marginLeftForMsg = ((dataGridWidth - leftSubHeadingWidth - rightSubHeadingWidth)/2)-(msgWidth/2);
		$("#errorMsgODataQuery").css("margin-left", (marginLeftForMsg -12) + "px");
	}
	/*if (width>1280) {
		$("#errorMsgODataQuery").css("margin-left", marginLeftForMsg + "px");
	}else{
		$("#errorMsgODataQuery").css("margin-left","144px");
	}*/
};


/**
 * The purpose of this function is to check atom query format.
 * 
 * @returns {Boolean}
 */
odataQuery.prototype.checkAtomFormat = function (mode) {
	var displayErrorMessage = "";
	var xmlNotSupportedMessage = getUiProps().MSG0132;
	if (sessionStorage.queryType === "$format=atom") {
		var headerList = uDataManagement.getHeaderList();
		var noOfProps = headerList.length;
		var noOfCols = noOfProps + 6;
		$("#dvAtomFormatMsg").remove();
		if ($("#rawBtn").hasClass("odataRawIconSelected")) {
			displayErrorMessage = "<div id='dvAtomFormatMsg' class='dvNoDataJsonView' style='width:146px;'>"
					+ xmlNotSupportedMessage + "</div>";
			$("#odataRaw").html(displayErrorMessage);
			uOdataQuery.setMarginForAtomFormatMsg(mode);
		}
		if ($("#gridBtn").hasClass("odataGridIconSelected")) {
			displayErrorMessage = "<tr id='msg'><td style='width:100%;' id='msg' colspan='"
					+ noOfCols
					+ "'><div id='dvAtomFormatMsg' class='noEntityCreated' style='width:146px;'>"
					+ xmlNotSupportedMessage + "</div></td><td id='msg'></td></tr>";
			$("#entityTable tbody").html(displayErrorMessage);
			uOdataQuery.setMarginForAtomFormatMsg(mode);
			$("#entityTable").scrollLeft(0);
			$("#entityTable tbody").scrollTop(0);
		}
		return false;
	}
};

/**
 * The purpose of this function is to check expand query format.
 * @returns {Boolean}
 */
odataQuery.prototype.checkExpandQuery = function () {
	var displayErrorMessage = "";
	var ISEXPAND = "$expand"; 
	var expandNotSupportedMessage = getUiProps().MSG0133;
	if (sessionStorage.selectQueryType === ISEXPAND) {
		if ($("#gridBtn").hasClass("odataGridIconSelected")) {
			var headerList = uDataManagement.getHeaderList();
			var noOfProps = headerList.length;
			var noOfCols = noOfProps + 6;
			displayErrorMessage = "<tr id='msg'><td style='width:100%;' id='msg' colspan='"
					+ noOfCols
					+ "'><div id='dvExpandQueryMsg' class='noEntityCreated' style='width:262px;'>"
					+ expandNotSupportedMessage + "</div></td><td id='msg'></td></tr>";
			$("#entityTable tbody").html(displayErrorMessage);
			//setTimeout(function(){
				uOdataQuery.setMarginForExpandQueryMsg();
				$("#entityTable").scrollLeft(0);
				$("#entityTable tbody").scrollTop(0);
			//},50);
		}
		return false;
	}
};

/**
 * The purpose of this function is to get entity name from query string.
 * 
 * @param queryString
 * @returns
 */
odataQuery.prototype.getEntityNameFromQueryString = function (queryString) {
	var ISSELECT= "$select";
	var entityNameFromQueryString = "";
	var query = queryString.indexOf("?");
	if (query != -1) {
		var arrEntityName = queryString.split('?');	
		sessionStorage.queryType = arrEntityName[1];
		var arrSelectQuery = arrEntityName[1].split('=');
		sessionStorage.selectQueryType = arrSelectQuery[0];
		if (arrSelectQuery[0] === ISSELECT) {
			var selectQueryParameterList = arrSelectQuery[1];
			sessionStorage.selectQueryParameterList = selectQueryParameterList;
		}
		entityNameFromQueryString = arrEntityName[0].split('/');
		entityNameFromQueryString = entityNameFromQueryString[1];
	} else {
		entityNameFromQueryString = queryString.split('/');
		entityNameFromQueryString = entityNameFromQueryString[1];
		sessionStorage.queryType = "";
		sessionStorage.selectQueryType = "";
		sessionStorage.selectQueryParameterList = "";
	}
	return entityNameFromQueryString;
};

/**
 * The purpose of this function is to validate query string.
 * 
 * @param queryString
 * @returns {String}
 */
odataQuery.prototype.validateQueryString = function (queryString) {
	var validMessage = getUiProps().MSG0125;
	var entityNameFromQueryString = "";
	var query = queryString.indexOf("?");
	var isDollarSign = queryString.substring(query+1, query+2);
	if (query != -1) {
		if (isDollarSign === null || isDollarSign === "" || isDollarSign === "q") {
			entityNameFromQueryString=  uOdataQuery.getEntityNameFromQueryString(queryString);
			return entityNameFromQueryString;
		} else if (isDollarSign === "$") {
			entityNameFromQueryString=  uOdataQuery.getEntityNameFromQueryString(queryString);
			return entityNameFromQueryString;
		} else {
			uOdataQuery.showErrorMessage(validMessage,"163");
		}
	} else if (query == -1) {
		entityNameFromQueryString=  uOdataQuery.getEntityNameFromQueryString(queryString);
		return entityNameFromQueryString;
	} else {
		uOdataQuery.showErrorMessage(validMessage,"163");
	}
};

/**
 * The purpose of this function is to retrieve API response for the query
 * entered by the user.
 * 
 * @param queryString
 * @returns
 */
odataQuery.prototype.retrieveAPIResponse = function (queryString) {
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	if(boxName == mainBoxValue){
		boxName = getUiProps().MSG0293;
	}
	var colName = sessionStorage.collectionName;
	var baseUrl = getClientStore().baseURL;
	var path = sessionStorage.selectedCollectionURL;//baseUrl + cellName + "/" + boxName + "/" + colName;
	var accessor = objCommon.initializeAccessor(baseUrl, cellName);
	path += queryString;
	var restAdapter = _pc.RestAdapterFactory.create(accessor);
	var response = "";
	var result = false;
	try{
		 response = restAdapter.get(path, "application/json", "*");
		 result = true;
	}catch(exception){
		response = exception;
	}
	return [result,response];
};

/**
 * The purpose of this method is to show error message for query result.
 * @param message
 */
odataQuery.prototype.showErrorMessage = function(message, width){
	sessionStorage.errorInQuery = "true";
	var msgDv = '<span class="odataQueryErrorIcon" id="odataQueryMessageIcon">&nbsp;</span>' +
	'<div id="odataQuerySuccessmsg" class="crudOperationSuccessMsg" style="padding-top: 2px;width:'+ width +'px;">'+ message +'</div>';
	errorMsgODataQuery.innerHTML = msgDv;
	uOdataQuery.setMarginForGenericMsg();
	$("#errorMsgODataQuery").show();
};

/**
 * The purpose of this method is to reset the pagination controls when no data is present.
 * @param type
 */
odataQuery.prototype.resetPagination = function(){
	var recordCount = "0 - 0 " +getUiProps().MSG0323+" 0";
	var type = "";
	for(var index = 0; index <2; index++){
		if(index == 0){
			type = "OdataGrid";
		}else if(index == 1){
			type = "OdataQuery";
		}
		$("#recordCount_"+type).text(recordCount);
		$('#firstPage_'+type).addClass('firstPageDisabled');
		$('#firstPage_'+type).removeClass('firstPageEnabled');
		$('#prevPage_'+type).addClass('prevPageDisabled');
		$('#prevPage_'+type).removeClass('prevPageEnabled');
		$('#nextPage_'+type).addClass('nextPageDisabled');
		$('#nextPage_'+type).removeClass('nextPageEnabled');
		$('#lastPage_'+type).addClass('lastPageDisabled');
		$('#lastPage_'+type).removeClass('lastPageEnabled');
	}
};

/**
 * The purpose of this function is to process query string.
 * 
 * @returns {Boolean}
 */
odataQuery.prototype.processQuery = function () {
	objCommon.hideListTypePopUp();
	var target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);
	sessionStorage.odataView = "odataquery";
	sessionStorage.errorInQuery = "false";
	//sessionStorage.queryData = "";
	//jquery1_5_2('#entityTable').fixedHeaderTable('destroy');
	//errorMsgODataQuery.innerHTML = "";
	setTimeout(function(){
		$("#errorMsgODataQuery").hide();
		var validMessage = getUiProps().MSG0125;
		var entityNameMessage = getUiProps().MSG0126;
		//document.getElementById("dvRowCount").style.display = "none";
		var queryString = $("#txtBoxQuery").val();
		sessionStorage.queryString = queryString;
		var isGridBtnSelected = $("#gridBtn").hasClass("odataGridIconSelected");
		var isRawBtnSelected = $("#rawBtn").hasClass("odataRawIconSelected");
		var entityNameFromQueryString = uOdataQuery
				.validateQueryString(queryString);
		var mode = "";
		if(isRawBtnSelected){
			mode = "raw";
		}
		var isFormatAtom = uOdataQuery.checkAtomFormat(mode);
		if (isFormatAtom === false) {
			uOdataQuery.resetPagination();
			$('#headerChkBox').attr('checked', false);
			$("#headerChkBox").attr("disabled",true);
			uDataManagement.disableEditButton();
			objCommon.disableDeleteIcon("#deleteOdata");
			spinner.stop();
			return false;
		}
		var isExpandQuery = uOdataQuery.checkExpandQuery();
		if (isExpandQuery === false && isGridBtnSelected) {
			uOdataQuery.resetPagination();
			$('#headerChkBox').attr('checked', false);
			$("#headerChkBox").attr("disabled",true);
			uDataManagement.disableEditButton();
			objCommon.disableDeleteIcon("#deleteOdata");
			spinner.stop();
			return false;
		}
		var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
		if (entityNameFromQueryString === entityTypeName) {
			var responseResult = uOdataQuery.retrieveAPIResponse(queryString);
			var result = responseResult[0];
			var response = responseResult[1];
			/*var inlineResponse = response.bodyAsJson().d;*/
			//var responseStatus = response.getStatusCode();
			if (!result){//(responseStatus === 400 || responseStatus === 404) {
				uOdataQuery.showErrorMessage(validMessage,"163");
				//uOdataQuery.resetPagination();
			}
			if (result){
				var responseStatus = response.getStatusCode();
				if(responseStatus === 200) {
					uDataManagement.disableEditButton();
					objCommon.disableDeleteIcon("#deleteOdata");
					var inlineResponse = response.bodyAsJson().d;
					var json = response.bodyAsJson().d.results;
					sessionStorage.inlineCountOData = inlineResponse.__count;
					if (json === null) {
						uOdataQuery.showErrorMessage(validMessage,"163");
						//uOdataQuery.resetPagination();
					}
					if (isRawBtnSelected) {
						//sessionStorage.odataView = "odataquery";
						uOdataQuery.createRawQueryResponseTable(json, false, inlineResponse);
					}
					if (isGridBtnSelected) {
						//sessionStorage.odataView = "odataquery";
						uOdataQuery.checkQueryType(json, false, inlineResponse);
						/*setTimeout(function(){
							uDataManagement.setHeaderColsWidth();
							$("#entityTable").scrollLeft(0);
						},50);*/
						uDataManagement.setHeaderColsWidth();
						$("#entityTable").scrollLeft(0);

						//sessionStorage.selectQueryType = "";
					}
				}else {
					uOdataQuery.showErrorMessage(validMessage,"163");
					//uOdataQuery.resetPagination();
				}
			}
		} else if (entityNameFromQueryString === undefined) {
			uOdataQuery.showErrorMessage(validMessage,"163");
			//uOdataQuery.resetPagination();
			spinner.stop();
		} else if (entityNameFromQueryString != entityTypeName) {
			var query = entityNameFromQueryString.indexOf("?");
			var query1 = entityNameFromQueryString.indexOf("$");
			if (query === -1 && query1 != -1) {
				uOdataQuery.showErrorMessage(validMessage,"163");
				//uOdataQuery.resetPagination();
			} else if (query === -1 && query1 === -1) {
				uOdataQuery.showErrorMessage(entityNameMessage,"253");
				//uOdataQuery.resetPagination();
			}
		} 
		else {
			uOdataQuery.showErrorMessage(entityNameMessage,"253");
			//uOdataQuery.resetPagination();
		}
		spinner.stop();
	}, 50);
	/*jquery1_5_2('#entityTable').fixedHeaderTable({fixedColumn: true});
	uDataManagement.applyFixedColumnStyleSheet();*/
};

/**
 * The purpose of this method is to create pagination.
 * @param recordSize
 * @param dynamicTable
 */
/*odataQuery.prototype.createPagination = function (totalRecordCount, dynamicTable,maxRows,tblMain,dvDisplayTable,json,
		propDetailsList, headerList, updateMethod, type) {
	var pagination = "";
	var totalPageNo = Math.ceil(totalRecordCount / maxRows);
	sessionStorage.selectedPageIndexOdataQuery = 1;
	if (totalRecordCount > 0) {
		pagination = uOdataQuery.showPaginationIcons(pagination, totalPageNo);
	}
	$(dvDisplayTable).append(pagination);
	var tableID = $(tblMain);
	var valid = uOdataQuery.createUIForPagination(tableID, maxRows, totalRecordCount);
	if (!valid) { 
		return;
	}
	uOdataQuery.createPrevButton(tableID, maxRows, totalPageNo, json, propDetailsList, headerList, updateMethod, type);
	uOdataQuery.createNextButton(tableID, maxRows, totalPageNo, json, propDetailsList, headerList, updateMethod, type);
	uOdataQuery.createPageButton(tableID, maxRows, totalPageNo, json, propDetailsList, headerList, updateMethod, type);
};*/



/**
 * The purpose of this method is to display pagination icons.
 */
/*odataQuery.prototype.showPaginationIcons = function(dynamicTable,totalPageNo) {
	dynamicTable += "<div class='pagination dynamicRow'>";
	dynamicTable += "<input type='button' id='prev' value='' class='prev'>";
	for (var count = 1; count <= totalPageNo; count++) {
		dynamicTable += "<input type='button' id='page" + count + "' value='" + count + "' class='paginationBut'>";
		if(count === objCommon.maxNoOfPages){
			break;
		}
	}
	dynamicTable += "<input type='button' id='next' value='Next' class='next'/>";
	dynamicTable += "</div>";
	return dynamicTable;
};*/

/**
 * This function is used to create apply css classes for pagination
 */
/*odataQuery.prototype.createUIForPagination = function(tableID, maxRows, totalRecordCount){
	if(totalRecordCount <= maxRows){
		$('#next').addClass('disabled');
		$("#next").attr("disabled","disabled");
		$('#next').addClass('nextDisable');
		$('#next').css('cursor','default');
	}	
	$('#page1').addClass('paginationButSelect');
//	$('#page1').attr('disabled','disabled');
	$('#page1').css('cursor','default');
	$('#prev').addClass('disabled');
	$('#prev').addClass('prevDisable');
	$('#prev').css('cursor','default');
	$("#prev").attr("disabled","disabled");
	return true;
};*/

/**
 * The purpose of this method is to create Pagination UI for Odata Query table data.
 */
odataQuery.prototype.createQueryPaginationView = function(type){
	var paginationContent = '<div class="recordCount" id="recordCount_'+ type +'"></div>' +
		'<div class="paginationIcons">' +
			'<div class="leftPagination">' +
			'<div class="firstPageDisabled" id="firstPage_'+ type +'"></div>' +
			'<div class="prevPageDisabled" id="prevPage_'+ type +'"></div>' +
		'</div>' +
		'<div class="rightPagination">' +
		'<div class="nextPageDisabled" id="nextPage_'+ type +'"></div>' +
		'<div class="lastPageDisabled" id="lastPage_'+ type +'"></div>' +
		'</div>' +
		'<div class="rightPagination"></div>' +
		'</div></div>';
	$(".pagination").html(paginationContent);
};

/**
 * This function is the first view generator for pagination as per present data.
 */
odataQuery.prototype.createUIForPagination = function(maxRows, totalRecordCount, type){
	var lowerRecordCount = 0;
	var upperRecordCount = 0;
	if (totalRecordCount != 0) {
		lowerRecordCount = 1;
		if (totalRecordCount <= maxRows) {
			upperRecordCount = totalRecordCount;
		} else {
			upperRecordCount = maxRows;
		}
	}
	var recordCount = lowerRecordCount + " - " + upperRecordCount + " of "
			+ totalRecordCount;
	$("#recordCount_"+type).text(recordCount);
	if (totalRecordCount <= maxRows) {
		$('#nextPage_'+type).addClass('nextPageDisabled');
		$('#nextPage_'+type).removeClass('nextPageEnabled');
		$('#lastPage_'+type).addClass('lastPageDisabled');
		$('#lastPage_'+type).removeClass('lastPageEnabled');
	} else {
		$('#nextPage_'+type).removeClass('nextPageDisabled');
		$('#nextPage_'+type).addClass('nextPageEnabled');
		$('#lastPage_'+type).removeClass('lastPageDisabled');
		$('#lastPage_'+type).addClass('lastPageEnabled');
	}
	$('#firstPage_'+type).addClass('firstPageDisabled');
	$('#firstPage_'+type).removeClass('firstPageEnabled');
	$('#prevPage_'+type).addClass('prevPageDisabled');
	$('#prevPage_'+type).removeClass('prevPageEnabled');
	return true;
};

/**
 * This function is used to show previous page in pagination.
 */
odataQuery.prototype.createPrevButton = function(tableID, maxRows, totalRecordCount, totalPageNo, json, updateMethod, type, propList, headerList){
	$('#prevPage_'+type).click(function() {
		if($("#prevPage_"+type).hasClass("prevPageEnabled")){
			var lowerRecordInterval = $("#recordCount_"+type).text().split("-")[0];
			var selectedPage = Math.ceil(lowerRecordInterval/maxRows);
			var newSelectedPage = selectedPage - 1;	
			var recordCount = (newSelectedPage - 1) * maxRows;
			updateMethod(json, headerList, propList, recordCount);

			var lowerRecordCount = ((newSelectedPage - 1) * maxRows) + 1;
			var upperRecordCount = ((newSelectedPage) * maxRows);
			var recordCount = lowerRecordCount + " - " + upperRecordCount + " of " + totalRecordCount;
			$("#recordCount_"+type).text(recordCount);

			sessionStorage.selectedPageIndexBox = newSelectedPage;
			if (newSelectedPage == 1) {
				$('#prevPage_'+type).addClass('prevPageDisabled');
				$('#prevPage_'+type).removeClass('prevPageEnabled');
				$('#firstPage_'+type).addClass('firstPageDisabled');
				$('#firstPage_'+type).removeClass('firstPageEnabled');
			}
			$('#nextPage_'+type).removeClass('nextPageDisabled');
			$('#nextPage_'+type).addClass('nextPageEnabled');
			$('#lastPage_'+type).removeClass('lastPageDisabled');
			$("#lastPage_"+type).addClass("lastPageEnabled");
			return false;
		}
	});
};

/**
 * This function is used to show next page in pagination.
 */
odataQuery.prototype.createNextButton = function(tableID, maxRows, totalRecordCount, totalPageNo, json, updateMethod, type, propList, headerList){
	$('#nextPage_'+type).click(function() {
		if($("#nextPage_"+type).hasClass("nextPageEnabled")){
			var lowerRecordInterval = $("#recordCount_"+type).text().split("-")[0];
			var selectedPage = Math.ceil(lowerRecordInterval/maxRows);
			var pageNoWithData = Math.floor(objCommon.noOfRecordsToBeFetched / maxRows);
			var newSelectedPage = selectedPage +1;      
			var modCurrent = newSelectedPage % pageNoWithData;
			if(modCurrent === 0){
				modCurrent = pageNoWithData;//objCommon.maxNoOfPages;
			}
			var recordCount = selectedPage * maxRows;
			updateMethod(json, headerList, propList, recordCount);
			sessionStorage.selectedPageIndexBox = newSelectedPage;

			var lowerRecordCount = (selectedPage * maxRows) + 1;
			var upperRecordCount = 0;
			if(newSelectedPage < totalPageNo){
				upperRecordCount = (newSelectedPage * maxRows);
			}else if(newSelectedPage == totalPageNo){
				upperRecordCount = (selectedPage * maxRows) + (totalRecordCount - (selectedPage * maxRows));
			}
			var recordCount = lowerRecordCount + " - " + upperRecordCount + " of " + totalRecordCount;
			$("#recordCount_"+type).text(recordCount);

			if(newSelectedPage == totalPageNo){
				$('#nextPage_'+type).addClass('nextPageDisabled');
				$('#nextPage_'+type).removeClass('nextPageEnabled');
				$('#lastPage_'+type).addClass('lastPageDisabled');
				$("#lastPage_"+type).removeClass("lastPageEnabled");
			}
			$('#prevPage_'+type).removeClass('prevPageDisabled');
			$('#prevPage_'+type).addClass('prevPageEnabled');
			$('#firstPage_'+type).removeClass('firstPageDisabled');
			$('#firstPage_'+type).addClass('firstPageEnabled');
			return false;
		}
	});
};

/**
 * This function is used to show first page in pagination.
 */
odataQuery.prototype.createFirstButton = function(tableID, maxRows, totalRecordCount, totalPageNo, json, updateMethod, type, propList, headerList){
	$('#firstPage_'+type).click(function() {
		if($("#firstPage_"+type).hasClass("firstPageEnabled")){
			var newSelectedPage = 1;
			var recordCount = 0;
			updateMethod(json, headerList, propList, recordCount);

			var lowerRecordCount = 1;
			var upperRecordCount = maxRows;
			var recordCount = lowerRecordCount + " - " + upperRecordCount + " of " + totalRecordCount;
			$("#recordCount_"+type).text(recordCount);
			sessionStorage.selectedPageIndexBox = newSelectedPage;
			$('#prevPage_'+type).addClass('prevPageDisabled');
			$('#prevPage_'+type).removeClass('prevPageEnabled');
			$('#firstPage_'+type).addClass('firstPageDisabled');
			$('#firstPage_'+type).removeClass('firstPageEnabled');

			$('#nextPage_'+type).removeClass('nextPageDisabled');
			$('#nextPage_'+type).addClass('nextPageEnabled');
			$('#lastPage_'+type).removeClass('lastPageDisabled');
			$("#lastPage_"+type).addClass("lastPageEnabled");
			return false;
		}
	});
};

/**
 * This function is used to show last page in pagination.
 */
odataQuery.prototype.createLastButton = function(tableID, maxRows, totalRecordCount, totalPageNo, json, updateMethod, type, propList, headerList){
	$('#lastPage_'+type).click(function() {
		if($("#lastPage_"+type).hasClass("lastPageEnabled")){
			var newSelectedPage = 1;
			var recordCount = (Math.ceil(totalRecordCount/maxRows) - 1)*maxRows;
			updateMethod(json, headerList, propList, recordCount);

			var lowerRecordCount = ((totalPageNo - 1)*maxRows) + 1;
			var upperRecordCount = totalRecordCount;
			var recordCount = lowerRecordCount + " - " + upperRecordCount + " of " + totalRecordCount;
			$("#recordCount_"+type).text(recordCount);

			sessionStorage.selectedPageIndexBox = newSelectedPage;
			$('#prevPage_'+type).removeClass('prevPageDisabled');
			$('#prevPage_'+type).addClass('prevPageEnabled');
			$('#firstPage_'+type).removeClass('firstPageDisabled');
			$('#firstPage_'+type).addClass('firstPageEnabled');

			$('#nextPage_'+type).addClass('nextPageDisabled');
			$('#nextPage_'+type).removeClass('nextPageEnabled');
			$('#lastPage_'+type).addClass('lastPageDisabled');
			$("#lastPage_"+type).removeClass("lastPageEnabled");
			return false;
		}
	});
};

/**
 * The purpose of this method is to create pagination functionality for query mode.
 * @param totalRecordCount
 * @param maxRows
 * @param tblMain
 * @param json
 * @param updateMethod
 * @param type
 * @param propList
 * @param headerList
 */
odataQuery.prototype.createPagination = function(totalRecordCount, maxRows,tblMain,
		json,updateMethod, type, propList, headerList){
	var totalPageNo = Math.ceil(totalRecordCount / maxRows);
	var tableID = $(tblMain);
	$(".pagination").empty();
	uOdataQuery.createQueryPaginationView("OdataQuery");
	var valid = uOdataQuery.createUIForPagination(maxRows, totalRecordCount, type);
	if (!valid) { 
		return;
	}
	uOdataQuery.createPrevButton(tableID, maxRows, totalRecordCount, totalPageNo, json,updateMethod,type, propList, headerList);
	uOdataQuery.createNextButton(tableID, maxRows, totalRecordCount, totalPageNo,json,updateMethod,type, propList, headerList);
	uOdataQuery.createFirstButton(tableID, maxRows, totalRecordCount, totalPageNo,json,updateMethod,type, propList, headerList);
	uOdataQuery.createLastButton(tableID, maxRows, totalRecordCount, totalPageNo, json,updateMethod,type, propList, headerList);
};

/**
 * This function is used to show previous page in pagination.
 */
/*odataQuery.prototype.createPrevButton = function(tableID, maxRows, totalPageNo, json, propDetailsList, headerList, updateMethod, type){
	$('#prev').click(function() {
		var selectedPage = 0;
		var selectedPageIDNumber = 0;
		for(var index = 1; index <= objCommon.maxNoOfPages; index++){
			if($("#page"+index).hasClass("paginationButSelect")){
				selectedPage = parseInt($("#page"+index).val());
				selectedPageIDNumber = index;
				break;
			}
		}
		var newSelectedPageIDNumber = selectedPageIDNumber - 1;
		var newSelectedPage = selectedPage - 1;	
		var recordCount = (newSelectedPage - 1) * maxRows;
		if(parseInt($("#page1").val()) === selectedPage){
			for(var index = 1; index <= objCommon.maxNoOfPages; index++){
				$("#page"+index).val(newSelectedPage+index-1);
			}
		}
		if(type === "DataManagement"){
			updateMethod(json, headerList, propDetailsList, recordCount);
		}else if(type === "SentMessage"){
			updateMethod(json, recordCount);
		}

		$('#page'+newSelectedPageIDNumber).siblings().removeClass('paginationButSelect');
		$('#page'+newSelectedPageIDNumber).siblings().css('cursor','pointer');
		$('#page'+newSelectedPageIDNumber).addClass('paginationButSelect');
		$('#page'+newSelectedPageIDNumber).css('cursor','default');
		//sessionStorage.selectedPageIndexDataManagement = newSelectedPage;
		if (newSelectedPage == 1) {
			$('#prev').addClass('disabled');
			$('#prev').addClass('prevDisable');
			$('#prev').css('cursor','default');
			$("#prev").attr("disabled","disabled");
		}
		$('#next').removeClass('disabled');
		$('#next').removeClass('nextDisable');
		$('#next').css('cursor','pointer');
		$("#next").attr("disabled",false);
		return false;
	});
};
*/
/**
 * This function is used to show next page in pagination.
 */
/*odataQuery.prototype.createNextButton = function(tableID, maxRows, totalPageNo, json, propDetailsList, headerList, updateMethod, type){
	$('#next').click(function() {
		var selectedPage = 0;
		var selectedPageIDNumber = 0;
		for(var index = 1; index <= objCommon.maxNoOfPages; index++){
			if($("#page"+index).hasClass("paginationButSelect")){
				selectedPage = parseInt($("#page"+index).val());
				selectedPageIDNumber = index;
				break;
			}
		}
		var recordCount = selectedPage * maxRows;
		var newSelectedPage = selectedPage +1;	
		if(newSelectedPage > objCommon.maxNoOfPages){
			var newValue = newSelectedPage - objCommon.maxNoOfPages;
			for(var index = 1; index <= objCommon.maxNoOfPages; index++){
				$("#page"+index).val(index+newValue);
			}
		}
		if(type === "DataManagement"){
			updateMethod(json, headerList, propDetailsList, recordCount);
		}else if(type === "SentMessage"){
			updateMethod(json, recordCount);
		}
//		sessionStorage.selectedPageIndexDataManagement = newSelectedPage;
		var newSelectedPageIDNumber = selectedPageIDNumber + 1;
		$('#page'+newSelectedPageIDNumber).siblings().removeClass('paginationButSelect');
		$('#page'+newSelectedPageIDNumber).siblings().css('cursor','pointer');
		$('#page'+newSelectedPageIDNumber).addClass('paginationButSelect');
		$('#page'+newSelectedPageIDNumber).css('cursor','default');
		if(newSelectedPage == totalPageNo){
			$('#next').addClass('disabled');
			$('#next').addClass('nextDisable');
			$('#next').css('cursor','default');
			$("#next").attr("disabled","disabled");
		}
		$('#prev').removeClass('disabled');
		$('#prev').removeClass('prevDisable');
		$('#prev').css('cursor','pointer');
		$("#prev").attr("disabled",false);
		return false;
	});
};*/

/**
 * This function is used to show the page when a page is selected.
 */
/*odataQuery.prototype.createPageButton = function(tableID, maxRows, totallPageNo, json, propDetailsList, headerList, updateMethod, type){
	$('.paginationBut').click(function() {
		var selectedPage = this.value;
		var selectedPageIDNumber = this.id;
		var recordCount = (selectedPage - 1) * maxRows;
		if(type === "DataManagement"){
			updateMethod(json, headerList, propDetailsList, recordCount);
		}else if(type === "SentMessage"){
			updateMethod(json, recordCount);
		}
		//sessionStorage.selectedPageIndexDataManagement = selectedPage;
		$('#'+selectedPageIDNumber).siblings().removeClass('paginationButSelect');
		$('#'+selectedPageIDNumber).siblings().css('cursor','pointer');
		$('#'+selectedPageIDNumber).addClass('paginationButSelect');
		$('#'+selectedPageIDNumber).css('cursor','default');
		if(selectedPage==1) {
			$('#prev').addClass('disabled');
			$('#prev').addClass('prevDisable');
			$('#prev').css('cursor','default');
			$("#prev").attr("disabled","disabled");
			$('#next').removeClass('disabled');
			$('#next').removeClass('nextDisable');
			$('#next').css('cursor','pointer');
			$("#next").attr("disabled",false);
			if(selectedPage == totallPageNo){
				$('#next').addClass('disabled');
				$('#next').addClass('nextDisable');
				$('#next').css('cursor','default');
				$("#next").attr("disabled","disabled");
			}
		}
		else {
			$('#prev').removeClass('disabled');
			$('#prev').removeClass('prevDisable');
			$('#prev').css('cursor','pointer');
			$("#prev").attr("disabled",false);
			if(selectedPage == totallPageNo){
				$('#next').addClass('disabled');
				$('#next').addClass('nextDisable');
				$('#next').css('cursor','default');
				$("#next").attr("disabled","disabled");
			}
		}
		return false;
	});
};*/

/**
 * The purpose of this method is to create tabular data view for Grid Mode.
 * @param json
 * @param headerList
 * @param propDetailsList
 * @param recordSize
 */
odataQuery.prototype.createTableDataGrid = function(json, headerList, propDetailsList, recordSize){
	var noOfProps = headerList.length;
	var dynamicRow = "";
	var maxLimit = (uDataManagement.MAXROWS+recordSize) < (json.length) ? (uDataManagement.MAXROWS+recordSize) : json.length;
	for ( var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		var id = obj.__id;
		var createdOn = objCommon
				.convertEpochDateToReadableFormat(obj.__published);
		var updatedOn = objCommon
				.convertEpochDateToReadableFormat(obj.__updated);
		var metaData = obj.__metadata;
		var entityURL = metaData.uri;
		var propNameValuePairForRow = new Array();
		for ( var indexProp = 0; indexProp < noOfProps; indexProp++) {
			var propName = headerList[indexProp][0];
			var type = propDetailsList[indexProp][1];
			var kind = propDetailsList[indexProp][2];
			var isDeclared = propDetailsList[indexProp][7];
			var propValue = obj[propName];
			if (propValue == null) {
				propValue = "";
			}
			if (propValue != "" && type == "Edm.DateTime") {
				propValue = objCommon
						.convertEpochDateToReadableFormat(propValue);
			}
			propNameValuePairForRow[indexProp] = [];
			propNameValuePairForRow[indexProp][0] = propName;
			propNameValuePairForRow[indexProp][1] = propValue;
			propNameValuePairForRow[indexProp][2] = type;
			propNameValuePairForRow[indexProp][3] = kind;
			propNameValuePairForRow[indexProp][4] = isDeclared;
		}
		dynamicRow = dynamicRow
				+ uDataManagement.createEntityRow(count,
						propNameValuePairForRow, recordSize, id, createdOn,
						updatedOn, entityURL);
	}
	$("#entityTable tbody").html(dynamicRow);
	$("#entityTable").scrollLeft(0);
	$("#entityTable tbody").scrollTop(0);
	//$("#entityTable tbody tr:odd").css("background-color", "#F4F4F4");
};

/**
 * The purpose of this function is to create grid table using the response
 * returned by API for query entered by the user.
 * 
 * @param json
 * @param headerList
 * @param recordSize
 */
odataQuery.prototype.createGridQueryResponseTable = function (json, headerList, recordSize, propDetailsList, toggleMode) {
	uDataManagement.disableEditButton();
	objCommon.disableDeleteIcon("#deleteOdata");
	var recordCount = 0;
	if(propDetailsList === undefined || propDetailsList === ""){
		propDetailsList = headerList;
	}
	/*if(toggleMode){
		recordCount = (parseInt(sessionStorage.selectedPageNo)-1)*uDataManagement.MAXROWS;
	}else{
		recordCount = 0;
	}*/
	uOdataQuery.createTableDataGrid(json, headerList, propDetailsList, recordCount);
	sessionStorage.propertiesCount = propDetailsList.length;
	//$(".pagination").remove();
	uOdataQuery.createPagination(recordSize, objCommon.MAXROWS,
			$("#entityTable"), json, uOdataQuery.createTableDataGrid, "OdataQuery", propDetailsList, headerList);
	/*if(toggleMode){
		var totalPageNo = Math.ceil(recordSize / uDataManagement.MAXROWS);
		var selectedPageNo = sessionStorage.selectedPageNo;
		uDataManagement.maintainPageState(selectedPageNo, "",
				uDataManagement.MAXROWS, totalPageNo);
	}*/
//	sessionStorage.selectedPageNo = "";
};

/**
 * The purpose of this function is to check query type entered
 * by the user.
 * 
 * @param json
 */
odataQuery.prototype.checkQueryType = function (json, toggleMode, inlineResponse) {
	var recordSize = json.length;
	sessionStorage.totalRecordsOnDataGrid=recordSize;
	var headerList = "";
	var SELECTQUERY = "$select";
	var SELECTALLQUERY = "$select=*";
	var INLINECOUNTQUERY = "$inlinecount=allpages";
	var noDataMessage = getUiProps().MSG0131;
	sessionStorage.queryData = JSON.stringify(json);
	var propDetailsList = "";
	if (sessionStorage.selectQueryParameterList != undefined
			&& sessionStorage.selectQueryType === SELECTQUERY) {
		if (sessionStorage.queryType === SELECTALLQUERY) {
			headerList = uDataManagement.getHeaderList();
		} else {
			var selectQueryParameterList = sessionStorage.selectQueryParameterList;
			var tempHeaderList = uDataManagement.getHeaderList();
			headerList = new Array();
			var arrSelectQueryParameterList = selectQueryParameterList
					.split(',');
			for ( var count = 0; count < arrSelectQueryParameterList.length; count++) {
				for(var innerCount = 0; innerCount < tempHeaderList.length; innerCount++){
					if(arrSelectQueryParameterList[count] == tempHeaderList[innerCount][0]){
						headerList.push(tempHeaderList[innerCount]);
					}
				}
				
			}
		}
		uDataManagement.createHeaderForEntityTable(headerList, true);
		propDetailsList = headerList;//uDataManagement.fetchHeaderDetails(headerList);
	} else if (sessionStorage.queryType === INLINECOUNTQUERY) {
		var inlineCount = 0;
		if(inlineResponse != undefined){
			inlineCount = inlineResponse.__count;
		}else{
			inlineCount = sessionStorage.inlineCountOData;
		}
		var inlineCountMsg = "Row Count: " + inlineCount;
		$('#errorMsgODataQuery').html(inlineCountMsg);
		$("#errorMsgODataQuery").show();
		uOdataQuery.setMarginForGenericMsg();
		headerList = uDataManagement.getHeaderList();
	} else {
		headerList = uDataManagement.getHeaderList();
	}
	if (recordSize > 0) {
		uDataManagement.createHeaderForEntityTable(headerList, true);
		//$(".pagination").show();
		uOdataQuery.createGridQueryResponseTable(json, headerList, recordSize, propDetailsList, toggleMode);
		$("#headerChkBox").attr("disabled",false);
		$("#headerChkBoxLabel").css("cursor","pointer");
	} else {
		var noOfProps = headerList.length;
		var noOfCols = noOfProps + 6;
		var noDataRow = "<tr id='msg'><td style='width:100%;' id='msg' colspan='"
				+ noOfCols
				+ "' style='border:none;'><div id='dvNoDataMsg' class='noEntityCreated'>"
				+ noDataMessage + "</div></td><td id='msg'></td></tr>";
		$("#entityTable tbody").html(noDataRow);
		uOdataQuery.setMarginForNoDataMsg();
		$("#entityTable").scrollLeft(0);
		$("#entityTable tbody").scrollTop(0);
		uOdataQuery.resetPagination();
		$("#headerChkBox").attr("disabled",true);
		$("#headerChkBoxLabel").css("cursor","default");
		$("#dvNoDataMsg").css('width', '90px');
		if (sessionStorage.selectedLanguage == 'ja') {
			$("#dvNoDataMsg").css('width', '190px');
			$("#dvNoDataMsg").addClass('japaneseFont');
		}
		//$(".pagination").hide();
	}
};

/**
 * The purpose of this method is to create data for Raw View.
 * @param json
 * @param headerList
 * @param propDetailsList
 * @param recordSize
 */
odataQuery.prototype.createRawDataTable = function(json){
	
	/*var dynamicRow = "";
	var maxLimit = (uDataManagement.MAXROWS+recordSize) < (json.length) ? (uDataManagement.MAXROWS+recordSize) : json.length;
	for ( var count = recordSize; count < maxLimit; count++) {
		var obj = json[count];
		dynamicRow += "<tr><td class='jsonRawView'>" + JSON.stringify(obj)
				+ "</td></tr>";
	}
	$("#entityRawTable tbody").html(dynamicRow);*/
	
	var jsonLength = json.length;
	var dynamicTable = '<table id="entityRawTable" cellspacing=0 cellpadding=0 class="scrollEntityTable">' +
	'<tbody id="entityRawTbody" class="entityRawTbody scrollEntityTable entityGridTbody"><tr><td></td></tr>';
    for ( var count = 0; count < jsonLength; count++) {
        var obj = json[count];
        dynamicTable += "<tr><td><pre class='prettyprint'><div>" + objCommon.syntaxHighlight(obj)
        + "</div></pre></td></tr>";
    }
    //$("#entityRawTable tbody").html(dynamicRow);
    dynamicTable += '</tbody></table>';
    $("#odataRaw").html(dynamicTable);
    $("#entityRawTable tbody").scrollLeft(0);
    $("#entityRawTable tbody").scrollTop(0);
};

/**
 * The purpose of this function is to create raw table using the response
 * returned by API for query entered by the user.
 * 
 * @param json
 */
odataQuery.prototype.createRawQueryResponseTable = function (json, toggleMode, inlineResponse) {
	uDataManagement.disableEditButton();
	objCommon.disableDeleteIcon("#deleteOdata");
	var recordSize = json.length;
	sessionStorage.lenEntityData = recordSize;
	sessionStorage.queryData = JSON.stringify(json);
	var INLINECOUNTQUERY = "$inlinecount=allpages";
	var noDataMessage = getUiProps().MSG0131;
	//var recordCount = 0;
	if (sessionStorage.queryType === INLINECOUNTQUERY) {
		var inlineCount = 0;
		if(inlineResponse != undefined){
			inlineCount = inlineResponse.__count;
		}else{
			inlineCount = sessionStorage.inlineCountOData;
		}
		/*$('#rowInlinecountID').html(inlineCount);
		document.getElementById("dvRowCount").style.display = "block";*/
		var inlineCountMsg = "Row Count: " + inlineCount;
		$('#errorMsgODataQuery').html(inlineCountMsg);
		$("#errorMsgODataQuery").show();
		uOdataQuery.setMarginForGenericMsg();
	}
	if (recordSize > 0) {
		/*if(toggleMode){
			recordCount = (parseInt(sessionStorage.selectedPageNo)-1)*uDataManagement.MAXROWS;
			if(recordCount < 0){
				recordCount = 0;
			}
		}else{
			recordCount = 0;
		}*/
		uOdataQuery.createRawDataTable(json);
		/*$(".pagination").show();
		$(".pagination").remove();
		uOdataQuery.createPagination(recordSize, "",
				uDataManagement.MAXROWS, $("#entityRawTable"), "#resultPane", json, "", "", uOdataQuery.createRawDataTable, "DataManagement");
		if(toggleMode){
			var totalPageNo = Math.ceil(recordSize / uDataManagement.MAXROWS);
			var selectedPageNo = sessionStorage.selectedPageNo;
			uDataManagement.maintainPageState(selectedPageNo, "",
					uDataManagement.MAXROWS, totalPageNo);
		}*/
	} else if (recordSize === 0) {
		/*var noDataRawView = "<tr><td style='border:none;'><div id='dvNoEntityCreated' class='dvNoDataJsonView'>"
				+ noDataMessage + "</div></td></tr>";
		$("#entityRawTable tbody").html(noDataRawView);*/
		//$(".pagination").hide();
		var noDataRawView = "<div id='dvNoDataJsonView' class='dvNoDataJsonView' style='width:90px;'>"+ noDataMessage +"</div>";
	     $("#odataRaw").html(noDataRawView);
	     if (sessionStorage.selectedLanguage == 'ja') {
				$("#dvNoDataJsonView").css('width', '190px');
				$("#dvNoDataJsonView").addClass('japaneseFont');
			}
	}
	uDataManagement.setWidthRawView();
};

/** ************************* Query on OData : END ************************** */

$(function() {
	if(document.querySelector('#txtBoxQuery') != null) {
		document.querySelector("#txtBoxQuery").spellcheck = false;
	}
	//uOdataQuery.initializeTxtboxWithDefaultText(new Array());
	$("#btnGo").click(function() {
		uOdataQuery.processQuery();
	});
});