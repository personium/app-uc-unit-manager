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
function dataManagement() {
}

var uDataManagement = new dataManagement();
dataManagement.prototype.MAXROWS = 50;
dataManagement.prototype.entityID = "";
dataManagement.prototype.sbSuccessful = '';
dataManagement.prototype.sbConflict = '';
dataManagement.prototype.linksDeleted = 0;
dataManagement.prototype.propertyDetailsList = new Array();
dataManagement.prototype.totalRecordCount = 0;

var arrDeletedConflictCount = [];
var etagValue  = '';
var isDeleted = false;

$(window).resize(function(){
	//setDynamicCellListHeight();
	uDataManagement.setDynamicWidthForHeader();
	uDataManagement.setMarginForNoEntityTypeMsg();
	uDataManagement.setDataGridColsWidthOnResize();
	uDataManagement.setDynamicWidthForODataGrid();
	uDataManagement.setWidthRawView();
	/*if(sessionStorage.ODataViewSelectedTab == "grid") {
		uDataManagement.setDynamicWidthForODataGrid();
	} else if(sessionStorage.ODataViewSelectedTab == "raw") {
		uDataManagement.setWidthRawView();
	}*/
});

/**
 * The purpose of this method is to append OData name in the breadcrumb.
 * @param odataName
 */
dataManagement.prototype.updateBreadCrumb = function(odataName){
	var shorterCollectionName = objCommon.getShorterName(odataName, 19);
	var rowCount = $("#tblBoxBreadCrum tbody tr").length;
	var table = document.getElementById("tblBoxBreadCrum");
	if (rowCount===3) {
		if (objOdata.addBreadCrumSeparator()) {
			rowCount = rowCount + 1;
		}
	}
	var row = table.insertRow(rowCount);
	objOdata.selectedBreadCrumId = 'columnId_'+rowCount+'';
	row.id = 'rowId_'+rowCount+'';
	var cell = row.insertCell(0);
	cell.innerHTML = shorterCollectionName;
	cell.id = this.selectedBreadCrumId;
	cell.title = odataName;
	//this.setCollectionPath(collectionURL);
	/*var collPath = "'" + decodeURIComponent(collectionURL) + "'";
	cell.setAttribute('onclick', 'objOdata.deleteBreadCrum(id,title,' + collPath + ')');*/
	var cell1 = row.insertCell(-1);
	cell1.innerHTML = "";
	cell1.id = 'arrowColId_'+rowCount+'';
	//sessionStorage.ArrowId = cell1.id;
	var appendedRow  = '#'+'rowId_'+ rowCount+'';
	$(appendedRow).addClass("breadrCrumTableTr ContentHeading1 ContentHeadingpt1");
	objOdata.showBreadCrum(rowCount);
	objOdata.selectedBreadCrum(rowCount);
};

/**
 * The purpose of this method is to open OData Data Grid from WebDav Detail page.
 * @param collectionName
 * @param collectionURL
 */
dataManagement.prototype.openODataPage = function(collectionURL, collectionName){
	var target = document.getElementById('spinner');
	var spinner = new Spinner(opts).spin(target);
	$("#webDavContentArea").hide();
	$("#currentDirectoryName").text(collectionName);
	$("#currentDirectoryName").attr("title",collectionName);
	$(".currentDirectoryIcon").css("background","url(./images/newSprite.png) no-repeat 54% -949px");
	$(".currentDirectoryIcon").css("margin-left","-3px");
	$(".currentDirectoryIcon").css("margin-left","-2px");
	uDataManagement.updateBreadCrumb(collectionName);
	$("#webDavContentArea").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/ODataView.html',
		function() {
			uDataManagement.setDynamicWidthForHeader();
			sessionStorage.selectedEntityTypeCount = 0;
			var entityTypeNames = null;
			try {
				entityTypeNames = uEntityTypeOperations.fetchEntityTypes(collectionURL, spinner);
				if(entityTypeNames != undefined && entityTypeNames.length > 0){
					var propList = uDataManagement.getHeaderList(entityTypeNames[0]);
				}
				uDataManagement.tertiaryBarSettings();
				uDataManagement.loadDataView(collectionURL, entityTypeNames, spinner);
			} catch (exception) {
				document.getElementById('collectionErrorMsg').innerHTML = getUiProps().MSG0294;
				document.getElementById('collectionMessageSuccessBlock').style.display = "none";
				document.getElementById('collectionMessageErrorBlock').style.display = "table";
				if (spinner != undefined) {
					spinner.stop();
				}
			}
			/*$("#webDavContentArea").show();*/
			//spinner.stop();
	});
};

/**
 * The purpose of this method is to load data management page in OData View.
 * @param collectionName
 * @param collectionURL
 */
dataManagement.prototype.loadDataView = function(collectionURL, entityTypeNames, spinner){
	$("#odataContentArea").hide();
	if(spinner == undefined){
		var target = document.getElementById('spinner');
		spinner = new Spinner(opts).spin(target);
	}
	var selectedEntityTypeName = uEntityTypeOperations.getSelectedEntityType();
	if (selectedEntityTypeName.length == 0 && entityTypeNames != undefined) {
		selectedEntityTypeName = entityTypeNames[0];
	}
	var selectedEntityTypeIndex = uEntityTypeOperations.getSelectedEntityTypeIndex();
	$("#odataContentArea").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/dataManagement.html',
			function() {
				uEntityTypeOperations.setCurrentSelectedTab("data");
				sessionStorage.ODataViewSelectedTab = "grid";
				uEntityTypeOperations.viewEntityTypeData(entityTypeNames);
				uEntityTypeOperations.setDynamicHeight();
				setTimeout(function(){
					uEntityTypeOperations.setDynamicWidthForEntityTypeList();
				},50);
				if(entityTypeNames != undefined && entityTypeNames.length > 0){
					$("#entityTypeName").text(selectedEntityTypeName);
					$("#entityTypeName").attr('title',selectedEntityTypeName);
					if(!(collectionURL.endsWith('/'))){
						collectionURL = collectionURL + '/';
					}
					var entityTypeURL = collectionURL + selectedEntityTypeName;
					$("#entityTypeURL").text(entityTypeURL);
					$("#entityTypeURL").attr('title',entityTypeURL);
					$("#entityTypeCol_"+selectedEntityTypeIndex).addClass("entityTypeRowSelect");
					if(uDataManagement.propertyDetailsList.length > 0){
						$("#txtBoxQuery").val("/"+selectedEntityTypeName);
						$("#dvNoPropertyMsg").css("display","none");
						$("#odataGrid").css("display","block");
						uDataManagement.enableGoButton();
						sessionStorage.propertiesCount = uDataManagement.propertyDetailsList.length;
						uDataManagement.createHeaderForEntityTable(uDataManagement.propertyDetailsList, false);
						$("#createODataEntityIcon").addClass("createIcon");
						$("#createODataEntityIcon").removeClass("createIconWebDavDisabled");
						$("#createODataEntityText").addClass("createText");
						$("#createODataEntityText").removeClass("createTextWebDavDisabled");
						$("#createOdataEntityWrapper").css("cursor","pointer");
						$("#createOdataEntityWrapper").addClass("enabled");
						setTimeout(function(){
							uDataManagement.setHeaderColsWidth();
							$("#entityTable").scrollLeft(0);
						},50);
					}else{
						$("#txtBoxQuery").val("Type your query");
						$("#dvNoPropertyMsg").css("display","block");
						$("#odataGrid").css("display","none");
						$("#recordCount_OdataGrid").html("0 - 0 " + getUiProps().MSG0323 + " 0");
						uDataManagement.disableGoButton();
						sessionStorage.propertiesCount = 0;
						$("#createODataEntityIcon").removeClass("createIcon");
						$("#createODataEntityIcon").addClass("createIconWebDavDisabled");
						$("#createODataEntityText").removeClass("createText");
						$("#createODataEntityText").addClass("createTextWebDavDisabled");
						$("#createOdataEntityWrapper").css("cursor","default");
						$("#createOdataEntityWrapper").removeClass("enabled");
					}
					$("#dvemptyTableMessageOdata").hide();
					$("#entityTypeBody").show();
					$("#odataRightView").show();
					//$("#entityTypeRefreshBtn").attr("disabled",false);
				}else{
					$("#dvemptyTableMessageOdata").show();
					uDataManagement.setMarginForNoEntityTypeMsg();
					$("#entityTypeBody").hide();
					$("#odataRightView").hide();
					//$("#entityTypeRefreshBtn").attr("disabled",true);
				}
				//$("#tertiaryBar").show();
				uDataManagement.setDynamicWidthForODataGrid();
				uDataManagement.createEntityHoverEffect();
				uDataManagement.sortByDateHoverEffect();
				uDataManagement.gridBtnHoverEffect();
				uDataManagement.rawBtnHoverEffect();
				spinner.stop();
				$("#odataContentArea").show();
				$("#webDavContentArea").show();
				$('#entityTable').scroll(function () {
				    $("#entityTable > *").width($("#entityTable").width() + $("#entityTable").scrollLeft());
				    var bodyWidth = $("#entityTable").width();
				    if(document.getElementById("dvNoEntityCreated") != undefined){
					    var msgWidth = 133;
						var marginLeftForNoDataMsg = ((bodyWidth/2)-10)-(msgWidth/2)+$("#entityTable").scrollLeft();
						$("#dvNoEntityCreated").css("margin-left", marginLeftForNoDataMsg + "px");
				    }
					if(document.getElementById("dvAtomFormatMsg") != undefined){
						 var msgWidth = 146;
						 var marginLeftForNoDataMsg = ((bodyWidth/2)-10)-(msgWidth/2)+$("#entityTable").scrollLeft();
						 $("#dvAtomFormatMsg").css("margin-left", marginLeftForNoDataMsg + "px");
					}
					if(document.getElementById("dvExpandQueryMsg") != undefined){
						 var msgWidth = 262;
						 var marginLeftForNoDataMsg = ((bodyWidth/2)-10)-(msgWidth/2)+$("#entityTable").scrollLeft();
						 $("#dvExpandQueryMsg").css("margin-left", marginLeftForNoDataMsg + "px");
					}
					if(document.getElementById("dvNoDataMsg") != undefined){
						 var msgWidth = 87;
						 var marginLeftForNoDataMsg = ((bodyWidth/2)-10)-(msgWidth/2)+$("#entityTable").scrollLeft();
						 $("#dvNoDataMsg").css("margin-left", marginLeftForNoDataMsg + "px");
					}
				});
	});
};

/**
 * The purpose of this method is to disable Query Go button when no properties exist.
 */
dataManagement.prototype.disableGoButton = function(){
	$("#btnGo").attr("disabled", true);
	$('#btnGo').css("background","#e8e8e8");
	$('#btnGo').css("cursor","default");
};

/**
 * The purpose of this method is to enable Query Go button when properties exist.
 */
dataManagement.prototype.enableGoButton = function(){
	$("#btnGo").attr("disabled", false);
	$('#btnGo').css("background","#d9d9d9");
	$('#btnGo').css("cursor","pointer");
	$('#btnGo').hover(function(){
		$('#btnGo').css("background","#e8e8e8");
	}, function(){
		$('#btnGo').css("background","#d9d9d9");
	});
};

/**
 * The purpose of this method is to set margin-top for no entity type message
 * as per view port size.
 */
dataManagement.prototype.setMarginForNoEntityTypeMsg = function(){
	var height = $(window).height();
	var fixedHeightExceptETypeMsgArea = 0;
	var stdMarginTop = 0;
	if(sessionStorage.ODataSelectedTab == "data"){
		fixedHeightExceptETypeMsgArea = (295 + 35);
		stdMarginTop = 137;
	}else if(sessionStorage.ODataSelectedTab == "schema"){
		fixedHeightExceptETypeMsgArea = (295 + 35 + 1 + 35);
		stdMarginTop = 101;
	}
	var noPropMsgHeight = 46;
	var marginTopForNoPropMsg = ((height - fixedHeightExceptETypeMsgArea)/2 - (noPropMsgHeight/2));
	if (height>650){
		$("#dvemptyTableMessageOdata").css("margin-top", marginTopForNoPropMsg + "px");
	}else{
		$("#dvemptyTableMessageOdata").css("margin-top", stdMarginTop + "px");
	}
};

/**
 * The purpose of this method is to set dynamic widths of sub-navigation header as per
 * view port size.
 */
dataManagement.prototype.setDynamicWidthForHeader = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	
	/** OData Header-Data width - Start */
	var availableWidthForDataHeader = rightPanelWidth - 15 - 20;
	var dataWidth = Math.round((5.04885/100)*availableWidthForDataHeader);
	/** OData Header-Data width - End */
	
	if (width>1280) {
		$(".odataNavBar .data").css('min-width', dataWidth + "px");
	}else{
		$(".odataNavBar .data").css('min-width', "62px");
	}
};

/**
 * The purpose of this method is to set dynamic widths of various components as per
 * view port size.
 */
dataManagement.prototype.setDynamicWidthForODataGrid = function(){
	var width = $(window).width();
	var height = $(window).height();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	
	/** OData EntityType Info - Start */
	var availableWidthForOData = (rightPanelWidth - 15 - 20);
	var availableWidthForODataContent = Math.round(((79.96742/100)*availableWidthForOData));
	var entityTypeNameWidth = (availableWidthForODataContent/2) - 10 -15;
	var entityTypeURLWidth = (availableWidthForODataContent/2) - 10 -15 - 2;
	/** OData EntityType Info - End */
	
	/** OData Query - Start */
	var odataQueryWrapperWidth = (availableWidthForODataContent - 10);
	var txtBoxQueryWidth = (odataQueryWrapperWidth - 10 - 10 - 42 - 10);
	/** OData Query - End */
	
	/** OData No property message - Start */
	var fixedHeightExceptODataGrid = (295 + 113);
	var noPropMsgHeight = (1 + 23 + 1);
	var marginTopForNoPropMsg = ((height - fixedHeightExceptODataGrid)/2 - (noPropMsgHeight/2));
	/** OData No property message - End */
	
	/** Odata Grid width - Start */
	var dataGridWidth = availableWidthForODataContent;
	var dataGridHeight = (height - fixedHeightExceptODataGrid - 38 - 28 - 2);
	/*var dataGridColsWidth = (Math.round((dataGridWidth-38-36)/(1 + 4))-12);
	$("#entityTable thead tr th:not(.fixed)").css("min-width",dataGridColsWidth + "px");
	$("#entityTable tbody tr td:not(.fixed)").css("min-width",dataGridColsWidth + "px");
	uDataManagement.setHeaderColsWidth();*/
	/** Odata Grid width - End */
	
	/** OData No data message - Start */
	var noDataMsgHeight = (1 + 23 + 1);
	var marginTopForNoDataMsg = ((dataGridHeight/2) - (noDataMsgHeight/2));
	var msgWidth = 133;
	var marginLeftForNoDataMsg = ((dataGridWidth/2)-10)-(msgWidth/2);
	/** OData No data message - End */
	
	if (width>1280) {
		$(".entityTypeInfo .entityTypeName").css('max-width', entityTypeNameWidth + "px");
		$(".entityTypeInfo .entityTypeURL").css('max-width', entityTypeURLWidth + "px");
		$(".odataQueryWrapper").css('min-width', odataQueryWrapperWidth + "px");
		$(".txtBoxQuery").css('min-width', txtBoxQueryWidth + "px");
		$("#entityTable").css("min-width",dataGridWidth + "px");
		$("#entityTable thead").css("min-width",dataGridWidth + "px");
		$("#entityTable").css("max-width",dataGridWidth + "px");
		$("#entityTableBody").css("min-width",dataGridWidth + "px");
		$("#dvNoEntityCreated").css("margin-left", marginLeftForNoDataMsg + "px");
	}else{
		$(".entityTypeInfo .entityTypeName").css('max-width', "466px");
		$(".entityTypeInfo .entityTypeURL").css('max-width', "466px");
		$(".odataQueryWrapper").css('min-width', "970px");
		$(".txtBoxQuery").css('min-width', "898px");
		$("#entityTable").css("min-width","982px");
		$("#entityTable thead").css("min-width","982px");
		$("#entityTable").css("max-width","982px");
		$("#entityTableBody").css("min-width","982px");
		$("#dvNoEntityCreated").css("margin-left","414.5px");
	}
	if (height>650){
		if(sessionStorage.ODataViewSelectedTab == "grid") {
			//setCellListSliderPosition();
			//setDynamicCellListHeight();
			var oDataGridHeight = dataGridHeight + 16;
			$("#entityTableBody").css("max-height", oDataGridHeight + "px");
			$("#entityTableBody").css("height", oDataGridHeight + "px");
			$("#odataRightView").css("height","172px");
		} /*else {
			setCellListSliderPosition();
			setDynamicCellListHeight();
			$("#entityTableBody").css("max-height", dataGridHeight + "px");
			$("#entityTableBody").css("height", dataGridHeight + "px");
		}*/
		
		$("#dvNoPropertyMsg").css("margin-top", marginTopForNoPropMsg + "px");
		$("#dvNoEntityCreated").css("margin-top", marginTopForNoDataMsg + "px");
	}else{
		if(sessionStorage.ODataViewSelectedTab == "grid") {
			$("#entityTableBody").css("max-height","193px");
			$("#entityTableBody").css("height","193px");
			$("#odataRightView").css("height","332px");
			$("#odataGrid").css("height","241px");
		} /*else {
			$("#entityTableBody").css("max-height","174px");
			$("#entityTableBody").css("height","174px");
			$("#odataRightView").css("height","0px");
			$("#odataGrid").css("height","0px");
		}*/
		$("#dvNoPropertyMsg").css("margin-top","108.5px");
		$("#dvNoEntityCreated").css("margin-top","75.5px");
	}
};

/**
 * The purpose of this method is to set dynamic width/height for Raw view contents
 * as per view port size.
 */
dataManagement.prototype.setWidthRawView = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var availableWidthForOData = (rightPanelWidth - 15 - 20);
	var availableWidthForODataContent = Math.round(((79.96742/100)*availableWidthForOData));
	var height = $(window).height();
	var fixedHeightExceptODataGrid = (295 + 113);
	
	/** Margin-Top for No data message - Start */
	//var dataGridHeight = (height - fixedHeightExceptODataGrid - 5);
	var dataGridHeight = (height - fixedHeightExceptODataGrid + 1);
	var noDataMsgHeight = (1 + 23 + 1);
	var marginTopForNoDataMsg = ((dataGridHeight/2) - (noDataMsgHeight/2));
	/** Margin-Top for No data message - End */
	
	/** Max-Width for Raw table - Start */
	var dataGridWidth = availableWidthForODataContent;
	/** Max-Width for Raw table - End */
	if(width>1280){
		$("#entityRawTbody").css("min-width",dataGridWidth + "px");
		$("#entityRawTbody").css("max-width",dataGridWidth + "px");
	}else{
		$("#entityRawTbody").css("min-width","982px");
		$("#entityRawTbody").css("max-width","982px");
	}
	if (height>650){
		$("#entityRawTbody").css("height", (dataGridHeight-18) + "px");
		$("#entityRawTbody").css("max-height", (dataGridHeight-18) + "px");
		$("#dvNoDataJsonView").css("margin-top", marginTopForNoDataMsg + "px");
	}else{
		$("#entityRawTbody").css("height","228px");
		$("#entityRawTbody").css("max-height","228px");
		$("#dvNoDataJsonView").css("margin-top","113.5px");
	}
};

/**
 * The purpose of this method is to set data grid columns width as per view port size.
 */
dataManagement.prototype.setDataGridColsWidthOnResize = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	
	var availableWidthForOData = (rightPanelWidth - 15 - 20);
	var availableWidthForODataContent = Math.round(((79.96742/100)*availableWidthForOData));
	var dataGridWidth = availableWidthForODataContent;
	var noOfProps = parseInt(sessionStorage.propertiesCount);
	var dataGridColsWidth = 0;
	if(noOfProps == 0){
		dataGridColsWidth = Math.round((dataGridWidth-38-36)/(4)) - 12;
		if(dataGridColsWidth < 216){
			dataGridColsWidth = 216;
		}
	}else{
		dataGridColsWidth = Math.round((dataGridWidth-38-36)/(1 + 4)) - 12;
		if(dataGridColsWidth < 170){
			dataGridColsWidth = 170;
		}
	}
	
	/*var dataGridColsWidth = (Math.round((dataGridWidth-38-36)/(1 + 4))-12);
	if(dataGridColsWidth < 170){
		dataGridColsWidth = 170;
	}*/
	$("#entityTable thead tr th:eq(2)").css("min-width",dataGridColsWidth + "px");
	$("#entityTable thead tr th:eq(3)").css("min-width",dataGridColsWidth + "px");
	$("#entityTable thead tr th:eq(4)").css("min-width",dataGridColsWidth + "px");
	
	$("#entityTable tbody tr td:eq(2)").css("min-width",dataGridColsWidth + "px");
	$("#entityTable tbody tr td:eq(3)").css("min-width",dataGridColsWidth + "px");
	$("#entityTable tbody tr td:eq(4)").css("min-width",dataGridColsWidth + "px");
	for(var index = 0; index < noOfProps; index++){
		 var dynWidth = 0;
        if(uDataManagement.propertyDetailsList[index][0].length > 8){
            dynWidth = (uDataManagement.propertyDetailsList[index][0].length * 8) + 40;
        } else{
            dynWidth = (uDataManagement.propertyDetailsList[index][0].length * 10) + 40;
        }
        if(dynWidth < dataGridColsWidth){
        	dynWidth = dataGridColsWidth;
        }
		var colNum = index+5;
		$("#entityTable thead tr th:eq("+ colNum +")").css("min-width",dynWidth + "px");
		$("#entityTable tbody tr td:eq("+ colNum +")").css("min-width",dynWidth + "px");
	}
	$("#entityTable thead tr th:last-child").css("min-width",dataGridColsWidth + "px");
	$("#entityTable tbody tr td:last-child").css("min-width",dataGridColsWidth + "px");
	/*$("#entityTable thead tr th:not(.fixed)").css("min-width",dataGridColsWidth + "px");
	$("#entityTable tbody tr td:not(.fixed)").css("min-width",dataGridColsWidth + "px");*/
	uDataManagement.setHeaderColsWidth();
};

/**
 * The purpose of this method is to add and remove hover effect
 * on create entity.
 */
dataManagement.prototype.createEntityHoverEffect = function(){
	$("#createOdataEntityWrapper").hover(function(){
		if($("#createOdataEntityWrapper").hasClass("enabled")){
			$("#createODataEntityIcon").css("background","url(./images/sprite.png) no-repeat 43% -551px");
			$("#createODataEntityText").css("color","#c80000");
		}
	},function(){
		if($("#createOdataEntityWrapper").hasClass("enabled")){
			$("#createODataEntityIcon").css("background","url(./images/sprite.png) no-repeat 43% -523px");
			$("#createODataEntityText").css("color","#1b1b1b");
		}
	});
};

/**
 * The purpose of this function is to add and remove hover effect
 * on sort by date label.
 */
dataManagement.prototype.sortByDateHoverEffect = function () {
	$("#sortWrapperOData").hover(function(){
		$("#sortdownArrowOData ").css("background","url(./images/sprite.png) no-repeat 40% -578px");
		 $("#sortTextOData ").css("color","#c80000");
	 },function(){
		  $("#sortdownArrowOData ").css("background","url(./images/sprite.png) no-repeat 40% -601px");
		  $("#sortTextOData ").css("color","#1b1b1b");
	});
};

/**
 * The purpose of this method is to add and remove hover effect
 * on grid button.
 */
dataManagement.prototype.gridBtnHoverEffect = function(){
	$("#gridBtn").hover(function(){
		$("#gridBtn").removeClass("odataGridIconUnselected");
		$("#gridBtn").addClass("odataGridIconSelected");
	},function(){
		//if(!(($("#odataGrid").is(":visible") || (($("#dvNoPropertyMsg").is(":visible"))) && ($("#sortWrapperOData").is(":visible"))))){
		if(!$("#sortWrapperOData").is(":visible")){
			$("#gridBtn").removeClass("odataGridIconSelected");
			$("#gridBtn").addClass("odataGridIconUnselected");
		}
	});
};

/**
 * The purpose of this method is to add and remove hover effect
 * on raw button.
 */
dataManagement.prototype.rawBtnHoverEffect = function(){
	$("#rawBtn").hover(function(){
		$("#rawBtn").removeClass("odataRawIconUnselected");
		$("#rawBtn").addClass("odataRawIconSelected");
	},function(){
		//if(!($("#odataRaw").is(":visible") || (($("#dvNoPropertyMsg").is(":visible"))) && !($("#sortWrapperOData").is(":visible")))){
		if($("#sortWrapperOData").is(":visible")){	
			$("#rawBtn").removeClass("odataRawIconSelected");
			$("#rawBtn").addClass("odataRawIconUnselected");
		}
	});
};

/**
 * The purpose of this method is to update tertiary bar as per page view.
 */
dataManagement.prototype.tertiaryBarSettings = function(){
	/*$("#leftIcons").hide();
	$("#rightTertiaryBar").hide();*/
	$("#tertiaryBar").hide();
};

/**
 * The purpose of this method is to fetch the property names for the entity type
 * 
 * @returns {Array}
 */
dataManagement.prototype.getHeaderList = function(defaultEntityType) {
    var propDetailsList = new Array();
	var entityTypeName = defaultEntityType;
	if(defaultEntityType == undefined){
		entityTypeName = uEntityTypeOperations.getSelectedEntityType();
	}
    var json = uEntityTypeProperty.retrieveMaxPropertyList(entityTypeName);
    var sortJSONString = objCommon.sortByKeyInAscOrder(json, '__published');
    var recordSize = sortJSONString.length;
    for ( var count = 0; count < recordSize; count++) {
        var obj = sortJSONString[count];
        propDetailsList[count] = [];
        propDetailsList[count][0] = obj.Name;
        propDetailsList[count][1] = obj.Type;
        propDetailsList[count][2] = obj.CollectionKind === "NONE" ? "None" : obj.CollectionKind;
        propDetailsList[count][3] = obj.Nullable;
        propDetailsList[count][4] = obj.DefaultValue;
        propDetailsList[count][5] = obj.IsKey;
        propDetailsList[count][6] = obj.UniqueKey;
        propDetailsList[count][7] = obj.IsDeclared;
    }
    uDataManagement.propertyDetailsList = propDetailsList;
    return propDetailsList;
};

/**
 * The purpose of this method is to fetch the details of the properties
 * associated with entity type
 * 
 * @param propList
 * @returns {Array}
 */
dataManagement.prototype.fetchHeaderDetails = function(propList) {
    var propDetailsList = new Array();
   // var objEntityType = new entityTypeOperations();
    var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
    var objEntityTypeProperty = new uEntityTypeOperations();
    var noOfProps = propList.length;
    for ( var index = 0; index < noOfProps; index++) {
        var json = objEntityTypeProperty.retrievePropertyAPIResponse("",
                "RETRIEVE DETAILS", entityTypeName, propList[index]);
        propDetailsList[index] = [];
        propDetailsList[index][0] = propList[index];
        propDetailsList[index][1] = json.Type;
        propDetailsList[index][2] = json.CollectionKind;
        propDetailsList[index][3] = json.Nullable;
        propDetailsList[index][4] = json.DefaultValue;
        propDetailsList[index][5] = json.IsKey;
        propDetailsList[index][6] = json.UniqueKey;
    }
    return propDetailsList;
};

/**
 * The purpose of this function is to reset edit and delete buttons.
 */
dataManagement.prototype.resetButtonsAndCheckBox = function(){
	$('#deleteOdata').addClass("deleteIconDisabled");
	$('#deleteOdata').removeClass("deleteIconEnabled");
	uDataManagement.disableEditButton();
	$('#headerChkBox').attr('checked', false);
};

/**
 * The purpose of the following method is to select all checkboxes.
 * 
 * @param cBox
 */
dataManagement.prototype.checkAll = function(cBox) {
	var buttonId = '#deleteOdata';
	//objCommon.checkBoxSelect(cBox, buttonId,'#btnEditBox');
	objCommon.assignEntityCheckBoxSelect(cBox, buttonId, '', 'entityChkBox_', 49, document.getElementById("headerChkBox"));
	objCommon.showSelectedRow(document.getElementById("headerChkBox"),"row","entityRow_");
	objCommon.disableDeleteIcon(buttonId);
	uDataManagement.disableEditButton();
	var noOfRecords = $("#entityTable tbody tr").length;
	if ($("#headerChkBox").is(':checked')) {
		if(noOfRecords >= 1) { 
			objCommon.activateCollectionDeleteIcon(buttonId);
		}
		if(noOfRecords == 1) {
			uDataManagement.enableEditButton();
		}
	}
	//$('#chkCreateProfileBox').attr('checked', false);
   /* var buttonId = '#btnDeleteEntity';
    objCommon.checkBoxSelect(cBox, buttonId);
    var noOfRows = $("#entityTable tbody tr").length;
    var noOfSelectedRows = 0;
	for ( var indexCounter = 0; indexCounter < noOfRows; indexCounter++) {
		if ($('#entityChkBox_' + indexCounter).is(':checked')) {
			noOfSelectedRows++;
		}
	}
    if (cBox.checked == true) {
        for ( var index = 0; index < noOfRows; index++) {
            var obj = $('#entityRow_' + index);
            obj.addClass('checkRow');
        }
        $('.fht-fixed-column tr').addClass('checkRow');
        $('.fht-tbody').css('border-right', '1px solid #fff');
        if(noOfSelectedRows != 1){
			uDataManagement.disableEditButton();
		}else{
			uDataManagement.enableEditButton();
		}
    } else {
        for ( var index = 0; index < noOfRows; index++) {
            var obj = $('#entityRow_' + index);
            obj.removeClass('checkRow');
        }
        $('.fht-tbody').css('border-right', '1px solid #dfdfdf');		
        $('.fht-fixed-column tr').removeClass('checkRow');
        uDataManagement.disableEditButton();
    }*/
};

/**
 * The purpose of this method is to fetch the available with for
 * Data grid as per view port size.
 * @returns
 */
dataManagement.prototype.getAvailableWidthForDataGrid = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var availableWidthForOData = (rightPanelWidth - 15 - 20);
	var availableWidthForODataGrid = Math.round(((79.96742/100)*availableWidthForOData));
	return availableWidthForODataGrid;
};

/**
 * The purpose of this method is to create header for data management table
 * @param propList
 */
dataManagement.prototype.createHeaderForEntityTable = function(propList, isQuery) {
	var noOfProps = propList.length;
	var colWidth = 0;
	if(noOfProps == 0){
		colWidth = Math.round((parseInt(uDataManagement.getAvailableWidthForDataGrid())-38-36)/(4)) - 12;
		if(colWidth < 216){
			colWidth = 216;
		}
	}else{
		colWidth = Math.round((parseInt(uDataManagement.getAvailableWidthForDataGrid())-38-36)/(1 + 4)) - 12;
		if(colWidth < 170){
			colWidth = 170;
		}
	}
    var dynamicHeader = "<th class='entityTableHeadChkBox fixed'><div><input type='checkbox' class='checkBox cursorHand regular-checkbox big-checkbox'" +
    		"onclick='uDataManagement.checkAll(this);' id='headerChkBox'/><label for='headerChkBox' class='checkBoxLabel' id='headerChkBoxLabel'></label></div></th>";
    dynamicHeader = dynamicHeader
    + "<th class='entityTableColHead fixed'><div style='min-width:25px;' id='propTextURL' class='entityHeadText'></div></th>";
    dynamicHeader = dynamicHeader
    + "<th class='entityTableColHead' style='min-width:"+ colWidth +"px;'><div id='propTextID' class='entityHeadText'>ID</div></th>";
    dynamicHeader = dynamicHeader
    + "<th class='entityTableColHead' style='min-width:"+ colWidth +"px;'><div id='propTextCreatedOn' class='entityHeadText'>"+getUiProps().MSG0367+"</div></th>";
    dynamicHeader = dynamicHeader
    + "<th class='entityTableColHead' style='min-width:"+ colWidth +"px;'><div id='propTextUpdatedOn' class='entityHeadText'>"+getUiProps().MSG0368+"</div></th>";
    for ( var index = 0; index < noOfProps; index++) {
        var dynWidth = 0;
        if(propList[index][0].length > 8){
            dynWidth = (propList[index][0].length * 8) + 40;
        } else{
            dynWidth = (propList[index][0].length * 10) + 40;
        }
        if(dynWidth < colWidth){
        	dynWidth = colWidth;
        }
        dynamicHeader = dynamicHeader
        + "<th class='entityTableColHead' style='min-width:"+ dynWidth +"px;'><div id='propText_" + index//style='min-width:"+ dynWidth +"px'
        + "' class='entityHeadText'>" + propList[index][0]
        + "</div></th>";
    }
    dynamicHeader = dynamicHeader
    + "<th class='entityTableColLink' style='min-width:"+ colWidth +"px;'><div class='entityHeadText'>"+getUiProps().MSG0369+"</div></th>";
    $("#entityTable thead tr").html(dynamicHeader);
    if(!isQuery){
    	uDataManagement.getEntityList(propList,false);
    }
/*    $("#btnCreateEntity").removeClass("createBtnDisabled");
    $("#btnCreateEntity").addClass("createBtn");
    $("#btnCreateEntity").attr("disabled", false);
    $("#btnGrid").removeClass("odataNormalButtonGrey");
    $("#btnGrid").addClass("odataNormalButtonBlue");*/
  //  uDataManagement.getEntityList(propList);
};

/**
 * This method creates a row in create entity popup for ID field
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowID = function() {
    var infoMessage = getUiProps().MSG0274;
    var row = "<tr><td class='entityColText'><div class='lblElement'>ID</div>" +
    		"<div><input type='text' onblur='uDataManagement.validateRowID();' id='rowVal_id' class='bigTextBox propertyPopUpTextBox' tabIndex='1'></div>" +
    		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_id'></aside></span>" +
    		"</td>" +
    		"<td style='width:346px;'><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
			"<td class='displayNone' id='colType_id'>Edm.String</td>" +
			"<td class='displayNone' id='colNullable_id'>true</td>" +
			"<td class='displayNone' id='colCollection_id'>none</td></tr>";
    return row;
};

/**
 * This method creates a row in create entity popup of text box type with null
 * and default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextBoxNullDefault = function(index, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0212;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0213;
    }else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0220;
    }
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
    		""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' type='text' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextBox' value='"+ propDetailsList[index][4] +"'></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * This method creates a row in create entity popup of text box type with null
 * but no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextBoxNullNoDefault = function(index, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0212;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0213;
    } else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0220; 
    }
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' type='text' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextBox'></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text box type with not
 * null and default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextBoxNotNullDefault = function(index, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0212;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0213;
    } else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0220;
    }
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' type='text' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextBox' value='"+ propDetailsList[index][4] +"'></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text box type with not
 * null and no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextBoxNotNullNoDefault = function(index, type, propDetailsList) {
    var infoMessage = "";
     if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0212;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0213;
    } else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0220;
    }
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' type='text' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextBox'></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text area type with null
 * and default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextAreaNullDefaultString = function(index, type, propDetailsList) {
    var infoMessage = getUiProps().MSG0276;
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' rows='1' cols='1' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	">"+ propDetailsList[index][4] +"</textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text area type with null
 * but no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextAreaNullNoDefaultString = function(index, type, propDetailsList) {
    var infoMessage = getUiProps().MSG0276;
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' rows='1' cols='1' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	"></textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text area type with not
 * null and default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextAreaNotNullDefaultString = function(index, type, propDetailsList) {
    var infoMessage = getUiProps().MSG0276;
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' rows='1' cols='1' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	">"+ propDetailsList[index][4] +"</textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text area type with not
 * null and no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextAreaNotNullNoDefaultString = function(index, type, propDetailsList) {
    var infoMessage = getUiProps().MSG0276;
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' rows='1' cols='1' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	"></textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text area type with null
 * and default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextAreaNullDefault = function(index, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.String"){
        infoMessage = getUiProps().MSG0277;
    }else if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0215;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0216;
    }else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0409;
    }else if(type == "Edm.Boolean"){
        infoMessage = getUiProps().MSG0217;
    }
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:230px;'>" + propDetailsList[index][0] + "</div>" +
	"<span class='collectionIconEntity'></span>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' rows='1' cols='1' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	">"+ propDetailsList[index][4] +"</textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text area type with null
 * but no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextAreaNullNoDefault = function(index, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.String"){
        infoMessage = getUiProps().MSG0277;
    }else if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0215;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0216;
    }else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0409;
    }else if(type == "Edm.Boolean"){
        infoMessage = getUiProps().MSG0217;
    }
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:230px;'>" + propDetailsList[index][0] + "</div>" +
	"<span class='collectionIconEntity'></span>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' rows='1' cols='1' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	"></textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text area type with not
 * null and default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextAreaNotNullDefault = function(index, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.String"){
        infoMessage = getUiProps().MSG0277;
    }else if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0215;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0216;
    }else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0409;
    }else if(type == "Edm.Boolean"){
        infoMessage = getUiProps().MSG0217;
    }
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:230px;'>* " + propDetailsList[index][0] + "</div>" +
	"<span class='collectionIconEntity'></span>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' rows='1' cols='1' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	">"+ propDetailsList[index][4] +"</textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of text area type with not
 * null and no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowTextAreaNotNullNoDefault = function(index, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.String"){
        infoMessage = getUiProps().MSG0277;
    }else if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0215;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0216;
    }else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0409;
    }else if(type == "Edm.Boolean"){
        infoMessage = getUiProps().MSG0217;
    }
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:230px;'>* " + propDetailsList[index][0] + "</div>" +
	"<span class='collectionIconEntity'></span>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' rows='1' cols='1' id='rowVal_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	"></textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in create entity popup of select type with null and
 * default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowBooleanNullDefault = function(index, propDetailsList) {
    var defaultVal = $.trim(propDetailsList[index][4]);
    var infoMessage = getUiProps().MSG0272;
    var row = "";
    var tabIndexValue = index + 2;
    if (defaultVal == "true") {
        row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' name='entityDD' id='rowVal_" + index + "' class='selectMenuPopup'>" +
		"<option value='null'>Select</option>" +
		"<option value='true' selected='selected'>True</option>" +
		"<option value='false'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    } else if (defaultVal == "false") {
        row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' name='entityDD' id='rowVal_" + index + "' class='selectMenuPopup'>" +
		"<option value='null'>Select</option>" +
		"<option value='true'>True</option>" +
		"<option value='false' selected='selected'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    } else{
    	row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' name='entityDD' id='rowVal_" + index + "' class='selectMenuPopup'>" +
		"<option value='null' selected='selected'>Select</option>" +
		"<option value='true'>True</option>" +
		"<option value='false'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    }
    return row;
};

/**
 * This method creates a row in create entity popup of select type with null but
 * no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowBooleanNullNoDefault = function(index, propDetailsList) {
    var infoMessage = getUiProps().MSG0272;
    var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
	"<div class='customSelectIcon' style='background-position-x: 212px'>" +
	"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' name='entityDD' id='rowVal_" + index + "' class='selectMenuPopup'>" +
	"<option value='null' selected='selected'>Select</option>" +
	"<option value='true'>True</option>" +
	"<option value='false'>False</option>" +
	"</select></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * This method creates a row in create entity popup of select type with not null
 * and default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowBooleanNotNullDefault = function(index, propDetailsList) {
    var defaultVal = $.trim(propDetailsList[index][4]);
    var infoMessage = getUiProps().MSG0272;
    var row = "";
    var tabIndexValue = index + 2;
    if (defaultVal == "true" || defaultVal == "True") {
        row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' name='entityDD' id='rowVal_" + index + "' class='selectMenuPopup'>" +
		"<option value='null'>Select</option>" +
		"<option value='true' selected='selected'>True</option>" +
		"<option value='false'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon'><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    } else if (defaultVal == "false" || defaultVal == "False"){
        row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' name='entityDD' id='rowVal_" + index + "' class='selectMenuPopup'>" +
		"<option value='null'>Select</option>" +
		"<option value='true'>True</option>" +
		"<option value='false' selected='selected'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    } else{
    	row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' name='entityDD' id='rowVal_" + index + "' class='selectMenuPopup'>" +
		"<option value='null' selected='selected'>Select</option>" +
		"<option value='true'>True</option>" +
		"<option value='false'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    }
    return row;
};

/**
 * This method creates a row in create entity popup of select type with not null
 * and no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowBooleanNotNullNoDefault = function(index, propDetailsList) {
	var infoMessage = getUiProps().MSG0272;
	var tabIndexValue = index + 2;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
	"<div class='customSelectIcon' style='background-position-x: 212px'>" +
	"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' name='entityDD' id='rowVal_" + index + "' class='selectMenuPopup'>" +
	"<option value='null'>Select</option>" +
	"<option value='true'>True</option>" +
	"<option value='false'>False</option>" +
	"</select></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * This method creates a row in create entity popup of date type with null and
 * default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowDateNullDefault = function(index, propDetailsList) {
  //convert date from epoch to date control format
	var infoMessage = getUiProps().MSG0273;
	var tabIndexValue = index + 2;
    var dateValue = objCommon.convertEpochDateToDateControlFormat(propDetailsList[index][4]);
    var time = uDataManagement.retrieveTimeFromEpochDate(propDetailsList[index][4]);
    var row = "<tr><td  class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' type='date' class='bigTextBox propertyPopUpTextBox unstyledDateTypeSpinButton'" +
	" id='rowVal_"+ index +"' required='' style='padding-right: 0px; width: 120px;float:left;' value='"+ dateValue +"'><input tabindex='"+tabIndexValue+"' type='time' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' step='1' style='float:left;margin-top:0px;margin-bottom:0px;margin-left:2px;' class='time'" +
	" id='timeVal_"+ index +"' value='"+ time +"'><span style='width:40%;' class='spanPopupErrorMessageCommon'><aside class='popupAlertmsg' style='width:121px' id='rowValErrorMsg_"+ index +"'></aside></span></div>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * This method creates a row in create entity popup of date type with null but
 * no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowDateNullNoDefault = function(index, propDetailsList) {
	var infoMessage = getUiProps().MSG0273;
	var tabIndexValue = index + 2;
    var row = "<tr><td  class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>" + propDetailsList[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' type='date' class='bigTextBox propertyPopUpTextBox unstyledDateTypeSpinButton'" +
	" id='rowVal_"+ index +"' required='' style='padding-right: 0px; width: 120px;float:left;'><input tabindex='"+tabIndexValue+"' type='time' style='float:left;margin-top:0px;margin-bottom:0px;margin-left:2px;' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");'  step='1' class='time'" +
	" id='timeVal_"+ index +"'><span class='spanPopupErrorMessageCommon' style='width:40%;'><aside class='popupAlertmsg' style='width:121px' id='rowValErrorMsg_"+ index +"'></aside></span></div>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * This method creates a row in create entity popup of date type with not null
 * and default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowDateNotNullDefault = function(index, propDetailsList) {
    //convert date from epoch to date control format
	var tabIndexValue = index + 2;
    var dateValue = objCommon.convertEpochDateToDateControlFormat(propDetailsList[index][4]);
    var time = uDataManagement.retrieveTimeFromEpochDate(propDetailsList[index][4]);
    var infoMessage = getUiProps().MSG0273;
    var row = "<tr><td  class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' type='date' class='bigTextBox propertyPopUpTextBox unstyledDateTypeSpinButton'" +
	" id='rowVal_"+ index +"' required='' style='padding-right: 0px; width: 120px;float:left;' value='"+ dateValue +"'><input tabindex='"+tabIndexValue+"' type='time' step='1' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' style='float:left;margin-top:0px;margin-bottom:0px;margin-left:2px;'  class='time'" +
	" id='timeVal_"+ index +"' value='"+ time +"'><span class='spanPopupErrorMessageCommon' style='width:40%;'><aside class='popupAlertmsg' style='width:121px' id='rowValErrorMsg_"+ index +"'></aside></span></div>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * This method creates a row in create entity popup of date type with not null
 * and no default value
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowDateNotNullNoDefault = function(index, propDetailsList) {
    var infoMessage = getUiProps().MSG0273;
    var tabIndexValue = index + 2;
    var row = "<tr><td  class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>* " + propDetailsList[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' type='date' class='bigTextBox propertyPopUpTextBox unstyledDateTypeSpinButton'" +
	" id='rowVal_"+ index +"' required='' style='padding-right: 0px; width: 120px;float:left;'><input tabindex='"+tabIndexValue+"' type='time' onblur='uDataManagement.validateFieldsPerTypeOnBlur(false,"+index+");' step='1' class='time'" +
	" id='timeVal_"+ index +"' style='float:left;margin-top:0px;margin-bottom:0px;margin-left:2px;'><span class='spanPopupErrorMessageCommon' style='width:40%;'><aside class='popupAlertmsg' style='width:121px'  id='rowValErrorMsg_"+ index +"'></aside></span></div>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * This method creates a row in create entity popup of complex type
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createRowComplexNotNull = function(index, propDetailsList) {
	var infoMessage = "";
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ propDetailsList[index][0] +"' style='max-width:242px;'>*" + propDetailsList[index][0] + "</div>" +
	"<div class='hrule'></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * This method creates a row in edit entity popup of text box type with null
 * 
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createEditRowTextBoxNull = function(index,
        selectedEntity, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0212;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0213;
    }else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0220;
    }
    var tabIndexValue = index + 1;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
    		""+ selectedEntity[index][0] +"' style='max-width:242px;'>" + selectedEntity[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' type='text'  onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' id='rowValEdit_"+ index +"' class='bigTextBox propertyPopUpTextBox' value='"+ selectedEntity[index][1] +"'></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * The purpose of this method is to create a row for edit entity popup of text
 * box type and not null
 * 
 * @param index
 * @param selectedEntity
 * @returns {String}
 */
dataManagement.prototype.createEditRowTextBoxNotNull = function(index,
        selectedEntity, type, propDetailsList) {
    if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0212;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0213;
    }else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0220;
    }
    var tabIndexValue = index + 1;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ selectedEntity[index][0] +"' style='max-width:242px;'>* " + selectedEntity[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' type='text' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' id='rowValEdit_"+ index +"' class='bigTextBox propertyPopUpTextBox' value='"+ selectedEntity[index][1] +"'></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in edit entity popup of text area type with null
 * and default value
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createEditRowTextAreaNullString = function(index, selectedEntity, type, propDetailsList) {
    var infoMessage = getUiProps().MSG0276;
    var tabIndexValue = index + 1;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ selectedEntity[index][0] +"' style='max-width:242px;'>" + selectedEntity[index][0] + "</div>" +
	"<div><textarea tabindex='"+tabIndexValue+"' rows='1' cols='1' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' id='rowValEdit_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	">"+ selectedEntity[index][1] +"</textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * This method creates a row in edit entity popup of text area type with null
 * and default value
 * @param index
 * @returns {String}
 */
dataManagement.prototype.createEditRowTextAreaNotNullString = function(index, selectedEntity, type, propDetailsList) {
    var infoMessage = getUiProps().MSG0276;
    var tabIndexValue = index + 1;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ selectedEntity[index][0] +"' style='max-width:242px;'>* " + selectedEntity[index][0] + "</div>" +
	"<div><textarea tabindex='"+tabIndexValue+"' rows='1' cols='1' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' id='rowValEdit_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	">"+ selectedEntity[index][1] +"</textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * The purpose of this method is to create a row for edit entity popup of text
 * area type and null
 * 
 * @param index
 * @param selectedEntity
 * @returns {String}
 */
dataManagement.prototype.createEditRowTextAreaNull = function(index,
        selectedEntity, type, propDetailsList) {
    var infoMessage = "";
   if(type == "Edm.String"){
        infoMessage = getUiProps().MSG0277;
    }else if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0215;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0216;
    }else if(type == "Edm.Boolean"){
        infoMessage = getUiProps().MSG0217;
    } else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0409;
    }
    var tabIndexValue = index + 1;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ selectedEntity[index][0] +"' style='max-width:230px;'>" + selectedEntity[index][0] + "</div>" +
	"<span class='collectionIconEntity'></span>" +
	"<div><textarea tabindex='"+tabIndexValue+"' rows='1' cols='1' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' id='rowValEdit_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	">"+ selectedEntity[index][1] +"</textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * The purpose of this method is to create a row for edit entity popup of text
 * area type and not null
 * 
 * @param index
 * @param selectedEntity
 * @returns {String}
 */
dataManagement.prototype.createEditRowTextAreaNotNull = function(index,
        selectedEntity, type, propDetailsList) {
    var infoMessage = "";
    if(type == "Edm.String"){
        infoMessage = getUiProps().MSG0277;
    }else if(type == "Edm.Int32"){
        infoMessage = getUiProps().MSG0215;
    }else if(type == "Edm.Single"){
        infoMessage = getUiProps().MSG0216;
    }else if(type == "Edm.Boolean"){
        infoMessage = getUiProps().MSG0217;
    }else if(type == "Edm.Double"){
        infoMessage = getUiProps().MSG0409;
    }
    var tabIndexValue = index + 1;
    var row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis entityColTextAreaTxt' title='" +
	""+ selectedEntity[index][0] +"' style='max-width:230px;'>" + selectedEntity[index][0] + "</div>" +
	"<span class='collectionIconEntity'></span>" +
	"<div><textarea tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' rows='1' cols='1' id='rowValEdit_"+ index +"' class='bigTextBox propertyPopUpTextArea'" +
	">"+ selectedEntity[index][1] +"</textarea></div>" +
	"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
	return row;
};

/**
 * The purpose of this method is to create a row for edit entity popup of
 * boolean type and null
 * 
 * @param index
 * @param selectedEntity
 * @returns {String}
 */
dataManagement.prototype.createEditRowBooleanNull = function(index,
        selectedEntity, propDetailsList) {
    var defaultVal = $.trim(selectedEntity[index][1]);
    var infoMessage = getUiProps().MSG0272;
    var row = "";
    var tabIndexValue = index + 1;
    if (defaultVal == "true" || defaultVal == "True") {
        row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ selectedEntity[index][0] +"' style='max-width:242px;'>" + selectedEntity[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' name='entityDD' id='rowValEdit_" + index + "' class='selectMenuPopup'>" +
		"<option value='null'>Select</option>" +
		"<option value='true' selected='selected'>True</option>" +
		"<option value='false'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    } else if (defaultVal == "false" || defaultVal == "False"){
    	row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ selectedEntity[index][0] +"' style='max-width:242px;'>" + selectedEntity[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' name='entityDD' id='rowValEdit_" + index + "' class='selectMenuPopup'>" +
		"<option value='null'>Select</option>" +
		"<option value='true'>True</option>" +
		"<option value='false' selected='selected'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    } else {
    	row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ selectedEntity[index][0] +"' style='max-width:242px;'>" + selectedEntity[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' name='entityDD' id='rowValEdit_" + index + "' class='selectMenuPopup'>" +
		"<option value='null' selected='selected'>Select</option>" +
		"<option value='true'>True</option>" +
		"<option value='false'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    }
    return row;
};

/**
 * The purpose of this method is to create a row for edit entity popup of
 * boolean type and not null
 * 
 * @param index
 * @param selectedEntity
 * @returns {String}
 */
dataManagement.prototype.createEditRowBooleanNotNull = function(index,
        selectedEntity, propDetailsList) {
    var defaultVal = $.trim(selectedEntity[index][1]);
    var infoMessage = getUiProps().MSG0272;
    var row = "";
    var tabIndexValue = index + 1;
    if (defaultVal == "true" || defaultVal == "True") {
        row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ selectedEntity[index][0] +"' style='max-width:242px;'>* " + selectedEntity[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' name='entityDD' id='rowValEdit_" + index + "' class='selectMenuPopup'>" +
		"<option value='null'>Select</option>" +
		"<option value='true' selected='selected'>True</option>" +
		"<option value='false'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    } else if (defaultVal == "false" || defaultVal == "False"){
    	row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ selectedEntity[index][0] +"' style='max-width:242px;'>* " + selectedEntity[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' name='entityDD' id='rowValEdit_" + index + "' class='selectMenuPopup'>" +
		"<option value='null'>Select</option>" +
		"<option value='true'>True</option>" +
		"<option value='false' selected='selected'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    } else {
    	row = "<tr><td class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
		""+ selectedEntity[index][0] +"' style='max-width:242px;'>* " + selectedEntity[index][0] + "</div>" +
		"<div class='customSelectIcon' style='background-position-x: 212px'>" +
		"<select tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' name='entityDD' id='rowValEdit_" + index + "' class='selectMenuPopup'>" +
		"<option value='null' selected='selected'>Select</option>" +
		"<option value='true'>True</option>" +
		"<option value='false'>False</option>" +
		"</select></div>" +
		"<span class='spanPopupErrorMessageCommon '><aside class='popupAlertmsg' id='rowValErrorEditMsg_"+ index +"'></aside></span>" +
		"</td>" +
		"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
		"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
		"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
		"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    }
    return row;
};

/**
 * The purpose of this method is to create a row for edit entity popup of date
 * type and null
 * 
 * @param index
 * @param selectedEntity
 * @returns {String}
 */
dataManagement.prototype.createEditRowDateNull = function(index, selectedEntity, propDetailsList) {
	var infoMessage = getUiProps().MSG0273;
	var tabIndexValue = index + 1;
    var dateValue = "";
    var time = "";
    var timeVal = "";
    var fullDateTime = selectedEntity[index][1];
    if (fullDateTime != undefined) {
    	time = selectedEntity[index][1].split(" ");
        timeVal = time[1];
    }
    if(selectedEntity[index][1] != ""){
	    dateValue = objCommon
	    .convertReadableDateToInputDateFormat(selectedEntity[index][1]);
    }
    var row = "<tr><td id='entityColTextVal_"+ index +"' class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ selectedEntity[index][0] +"' style='max-width:242px;'>" + selectedEntity[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' type='date' class='bigTextBox propertyPopUpTextBox unstyledDateTypeSpinButton'" +
	" id='rowValEdit_"+ index +"' required='' style='padding-right: 0px; width: 120px; float:left;' value='"+ dateValue +"'><input tabindex='"+tabIndexValue+"' type='time' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' step='1' style='float:left;margin-bottom:0px;margin-top:0px;margin-left:2px;' class='time'" +
	" id='timeValEdit_"+ index +"' value='"+ timeVal +"' ><span class='spanPopupErrorMessageCommon' style='width:40%;'><aside class='popupAlertmsg'  id='rowValErrorEditMsg_"+ index +"'></aside></span></div>" +
	"</td>" +
	"<td ><div class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * The purpose of this method is to create a row for edit entity popup of date
 * type and not null
 * 
 * @param index
 * @param selectedEntity
 * @returns {String}
 */
dataManagement.prototype.createEditRowDateNotNull = function(index,
        selectedEntity, propDetailsList) {
	var infoMessage = getUiProps().MSG0273;
	var tabIndexValue = index + 1;
    var dateValue = "";
    var time = "";
    var timeVal = "";
    var fullDateTime = selectedEntity[index][1];
    if (fullDateTime != undefined) {
    	time = selectedEntity[index][1].split(" ");
        timeVal = time[1];
    }
    if(selectedEntity[index][1] != ""){
	    dateValue = objCommon.convertReadableDateToInputDateFormat(selectedEntity[index][1]);
    }
    var row = "<tr><td id='entityColTextVal_"+ index +"' class='entityColText'><div class='lblElement mainTableEllipsis' title='" +
	""+ selectedEntity[index][0] +"' style='max-width:242px;'>* " + selectedEntity[index][0] + "</div>" +
	"<div><input tabindex='"+tabIndexValue+"' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' type='date' class='bigTextBox propertyPopUpTextBox unstyledDateTypeSpinButton'" +
	" id='rowValEdit_"+ index +"' required='' style='padding-right: 0px; width: 120px;float:left;' value='"+ dateValue +"'><input tabindex='"+tabIndexValue+"' type='time' step='1' onblur='uDataManagement.validateFieldsPerTypeOnBlur(true,"+index+");' style='float:left;margin-bottom:0px;margin-top:0px;margin-left:2px;' class='time'" +
	" id='timeValEdit_"+ index +"' value='"+ timeVal +"'><span style='width:40%;' class='spanPopupErrorMessageCommon'><aside class='popupAlertmsg'  id='rowValErrorEditMsg_"+ index +"'></aside></span></div>" +
	"</td>" +
	"<td ><div  class='popUpInfoMsg'>"+ infoMessage +"</div></td>" +
	"<td class='displayNone' id='colType_"+ index +"'>"+ propDetailsList[index][1] +"</td>" +
	"<td class='displayNone' id='colNullable_"+ index +"'>"+ propDetailsList[index][3] +"</td>" +
	"<td class='displayNone' id='colCollection_"+ index +"'>"+ propDetailsList[index][2] +"</td></tr>";
    return row;
};

/**
 * The purpose of this method is to generate create entity popup rows
 * dynamically as per their schema defined.
 */
dataManagement.prototype.createEntityPopUp = function(edit, selectedEntity) {
    var dynamicRows = "";
    if (!edit) {
        dynamicRows = dynamicRows + uDataManagement.createRowID();
    }
    var propDetailsList = uDataManagement.propertyDetailsList;
    var noOfProps = propDetailsList.length;
    for ( var index = 0; index < noOfProps; index++) {
        var type = propDetailsList[index][1];
        //var kind = propDetailsList[index][2];
        if ($.trim(propDetailsList[index][1]) == "Edm.String"
            && $.trim(propDetailsList[index][2]) == "None") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullDefaultString(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullNoDefaultString(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNullString(index,
                            selectedEntity, type, propDetailsList);
                }
            } else {// null is not allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullDefaultString(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullNoDefaultString(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNotNullString(
                            index, selectedEntity, type, propDetailsList);
                }
            }
        } else if ($.trim(propDetailsList[index][1]) == "Edm.String"
            && $.trim(propDetailsList[index][2]) == "List") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullDefault(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullNoDefault(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNull(index,
                            selectedEntity, type, propDetailsList);
                }
            } else {// null is not allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullDefault(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullNoDefault(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNotNull(
                            index, selectedEntity, type, propDetailsList);
                }
            }
        } else if (($.trim(propDetailsList[index][1]) == "Edm.Int32" 
        	       || $.trim(propDetailsList[index][1]) == "Edm.Single" 
        	       || $.trim(propDetailsList[index][1]) == "Edm.Double")
                  && $.trim(propDetailsList[index][2]) == "None") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextBoxNullDefault(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextBoxNullNoDefault(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextBoxNull(index,
                            selectedEntity, type, propDetailsList);
                }
            } else {// null is not allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextBoxNotNullDefault(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextBoxNotNullNoDefault(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextBoxNotNull(
                            index, selectedEntity, type, propDetailsList);
                }
            }
        } else if (($.trim(propDetailsList[index][1]) == "Edm.Int32"
           	       || $.trim(propDetailsList[index][1]) == "Edm.Single" 
        	       || $.trim(propDetailsList[index][1]) == "Edm.Double")
                  && $.trim(propDetailsList[index][2]) == "List") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullDefault(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullNoDefault(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNull(index,
                            selectedEntity, type, propDetailsList);
                }
            } else {// null is not allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullDefault(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullNoDefault(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNotNull(
                            index, selectedEntity, type, propDetailsList);
                }
            }
        } else if ($.trim(propDetailsList[index][1]) == "Edm.Boolean"
            && $.trim(propDetailsList[index][2]) == "None") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowBooleanNullDefault(index, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowBooleanNullNoDefault(index, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowBooleanNull(index,
                            selectedEntity, propDetailsList);
                }
            } else {// null is not allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowBooleanNotNullDefault(index, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowBooleanNotNullNoDefault(index, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowBooleanNotNull(
                            index, selectedEntity, propDetailsList);
                }
            }
        } else if ($.trim(propDetailsList[index][1]) == "Edm.Boolean"
            && $.trim(propDetailsList[index][2]) == "List") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullDefault(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullNoDefault(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNull(index,
                            selectedEntity, type, propDetailsList);
                }
            } else {// null is not allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullDefault(index, type, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullNoDefault(index, type, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNotNull(
                            index, selectedEntity, type, propDetailsList);
                }
            }
        } else if ($.trim(propDetailsList[index][1]) == "Edm.DateTime"
            && $.trim(propDetailsList[index][2]) == "None") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowDateNullDefault(index, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowDateNullNoDefault(index, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowDateNull(index,
                            selectedEntity, propDetailsList);
                }
            } else {// null is not allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowDateNotNullDefault(index, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowDateNotNullNoDefault(index, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowDateNotNull(index,
                            selectedEntity, propDetailsList);
                }
            }
        } else if ($.trim(propDetailsList[index][1]) == "Edm.DateTime"
            && $.trim(propDetailsList[index][2]) == "List") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullDefault(index, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNullNoDefault(index, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNull(index,
                            selectedEntity, propDetailsList);
                }
            } else {// null is not allowed
                if (!edit) {
                    if ($.trim(propDetailsList[index][4]) != "") {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullDefault(index, propDetailsList);
                    } else {
                        dynamicRows = dynamicRows
                        + uDataManagement
                        .createRowTextAreaNotNullNoDefault(index, propDetailsList);
                    }
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createEditRowTextAreaNotNull(
                            index, selectedEntity, propDetailsList);
                }
            }
        }
        else if ($.trim(propDetailsList[index][2]) == "List") {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    dynamicRows = dynamicRows
                    + uDataManagement.createRowComplexNotNull(index, propDetailsList);
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createRowComplexNotNull(index, propDetailsList);
                }
            }/*
             * else{// null is not allowed- in future when complex types are
             * fetched dynamicRows = dynamicRows +
             * uDataManagement.createRowTextAreaNotNullNoDefault(index); }
             */
        } else {
            if (propDetailsList[index][3] == true) {// null is allowed
                if (!edit) {
                    dynamicRows = dynamicRows
                    + uDataManagement.createRowComplexNotNull(index, propDetailsList);
                } else {
                    dynamicRows = dynamicRows
                    + uDataManagement.createRowComplexNotNull(index, propDetailsList);
                }
            }/*
             * else{// null is not allowed- in future when complex types are
             * fetched dynamicRows = dynamicRows +
             * uDataManagement.createRowTextBoxNotNullNoDefault(index); }
             */
        }
    }
    if (!edit) {
        $("#createEntityTable tbody").html(dynamicRows);
        var tabIndexCancel = noOfProps+2;
        $("#btnCancelCreateEntity").attr("tabindex", tabIndexCancel);
        $("#btnCreateEntity").attr("tabindex", tabIndexCancel + 1);
        $("#btnCrossEntityCreate").attr("tabindex", tabIndexCancel + 2);
    } else {
        $("#editEntityTable tbody").html(dynamicRows);
        var tabIndexCancelEdit = noOfProps+1;
        $("#btnCancelEditEntity").attr("tabindex", tabIndexCancelEdit);
        $("#btnEditEntity").attr("tabindex", tabIndexCancelEdit + 1);
        $("#btnCrossEditEntity").attr("tabindex", tabIndexCancelEdit + 2);
    }
    var winH = $(window).height();
    if (!edit) {
    	$("#createEntityDialogBox").css('top', winH / 2 - $("#createEntityDialogBox").height() / 2); 
    } else{
    	$("#editEntityDialogBox").css('top', winH / 2 - $("#editEntityDialogBox").height() / 2);
    }
    $(".sectionContentCreateEntity").scrollTop(0);
    if (sessionStorage.selectedLanguage == 'ja') {
    	$(".popupAlertmsg").addClass('japaneseFont');
    }
};

/**
 * The purpose of this function is to check if create entity is enabled/disabled
 * and open popup accordingly.
 */
dataManagement.prototype.openCreateEntityPopUp = function(){
	if($("#createODataEntityIcon").hasClass("createIcon")){
		openCreateEntityModal('#createEntityModalWindow','#createEntityDialogBox', 'rowVal_id');
		$("#editEntityTable tbody").empty();
	}
};

/**
 * The purpose of this function is to check if edit entity is enabled/disabled
 * and open popup accordingly.
 */
dataManagement.prototype.openEditEntityPopUp = function(){
	if($("#editOdata").hasClass("editIconWebDavEnabled")){
		openCreateEntityModal('#editEntityModalWindow','#editEntityDialogBox', 'rowValEdit_0');
		 $("#createEntityTable tbody").empty();
		}
};

/**
 * The purpose of this function is to check if delete entity is enabled/disabled
 * and open popup accordingly.
 */
dataManagement.prototype.openDeleteEntityPopUp = function(){
	if($("#deleteOdata").hasClass("deleteIconWebDavEnabled")){
		openCreateEntityModal('#multipleEntityDeleteModalWindow','#multipleEntityDeleteDialogBox', 'btnCancelEntityDelete');
			  $("#createEntityTable tbody").empty();
			  $("#editEntityTable tbody").empty();
		  }
};


/**
 * The purpose of this method is to show valid value icon in input text boxes.
 * @param txtID
 */
dataManagement.prototype.showValidValueIcon = function (txtID) {
	$(txtID).removeClass("errorIcon");	
	$(txtID).addClass("validValueIcon");
};

/**
 * The purpose of this method is to show error value icon in input text boxes.
 * @param txtID
 */
dataManagement.prototype.showErrorIcon = function (txtID) {
	$(txtID).removeClass("validValueIcon");
	$(txtID).addClass("errorIcon");	
};

/**
 * The purpose of this method is to validate the mandatory fields.
 * 
 * @returns {Boolean}
 */
dataManagement.prototype.validateEmptyFields = function(edit) {
    var noOfRows = 0;
    var elem = "";
    var loopLimit = 0;
    if (!edit) {
        elem = "#rowVal_";
        noOfRows = $("#createEntityTable tbody tr").length;
        loopLimit = (noOfRows - 1);
    } else {
        noOfRows = $("#editEntityTable tbody tr").length;
        elem = "#rowValEdit_";
        loopLimit = noOfRows;
    }
    var result = true;
    var MINLENGTH = 1;
    for ( var index = 0; index < loopLimit; index++) {
        if ($("#colNullable_" + index).text() == "false") {
            if ($("#colType_" + index).text() != "Edm.Boolean") {
                var fieldLength = $(elem + index).val().length;
                if (fieldLength < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                     //     break;
                    } else {
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0115);
                    //break;
                    }
                    if (($("#colType_" + index).text() == "Edm.String" || $("#colType_" + index).text() == "Edm.Int32"
                    	|| $("#colType_" + index).text() == "Edm.Single" || $("#colType_" + index).text() == "Edm.Double")
                    	&& ($("#colCollection_" + index).text() != "List")){
                    	uDataManagement.showErrorIcon("#rowVal_"+index);
                    }
                    break;
                }/*else{
                	uDataManagement.showValidValueIcon("#rowVal_"+index);
                }*/
            } else {
                if ($(elem + index).val() == "Select") {
                    result = false;
                    if (edit) {
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0115);
                        break;
                    }
                    else {
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0115);
                        break;
                    }
                }
            }
        }
    }
    return result;
};

/**
 * The purpose of this method is to apply validations on property values as per
 * their defined schema.
 * 
 * @returns {Boolean}
 */
dataManagement.prototype.validateFieldsPerType = function(edit) {
    var noOfRows = 0;
    var elem = "";
    var time = "";
    var loopLimit = 0;
    if (!edit) {
        elem = "#rowVal_";
        time = "#timeVal_";
        noOfRows = $("#createEntityTable tbody tr").length;
        loopLimit = (noOfRows - 1);
    } else {
        elem = "#rowValEdit_";
        time = "#timeValEdit_";
        noOfRows = $("#editEntityTable tbody tr").length;
        loopLimit = noOfRows;
    }
    var result = true;
    var MAXLENGTH = 128;
    var MINLENGTH = 1;
   // var specialchar = /^[-_]*$/;
    for ( var index = 0; index < loopLimit; index++) {
        if ($("#colType_" + index).text() == "Edm.String"
            && $("#colCollection_" + index).text() != "List") {
           // var letters = /^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9a-zA-Z-_]+$/;
            //var letters = /^[0-9a-zA-Z-_]+$/;
            var lenField = $(elem + index).val().length;
           // var valField = $(elem + index).val();
            MAXLENGTH = 51200;
            
            if ($("#colNullable_" + index).text() == "false") {
            	if (lenField < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                      $("#rowValEdit_" + index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                    } else {
                    $("#rowVal_" + index).focus();
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0115);
                    }
                    break;
                }
            }
            
            if (lenField > MAXLENGTH) {
                result = false;
                if (edit) {
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0114);
                	$("#rowValEdit_" + index).focus();
                    break;
                }
                else {
                 $("#rowVal_" + index).focus();
                 objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0114);
                    break;	
                }
            } /*else if (lenField != 0 && !(valField.match(letters))) {
                result = false;
                if (edit) {
                objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                        getUiProps().MSG0110);
                break;
                } else {
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0110);
                    break;
                }
            } else if (lenField != 0
                    && (specialchar.toString()
                            .indexOf(valField.substring(0, 1)) >= 0)) {
                result = false;
                if(edit) {
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0111);
                    break;
                }
                else {
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0111);
                    break;
                }
            }*/
        }
        if ($("#colType_" + index).text() == "Edm.String"
            && $("#colCollection_" + index).text() == "List") {
        	 if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                       $("#rowValEdit_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                       $("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                     break;
                 }
             }
            if ($.trim($(elem + index).val()) != "") {
             //   var listLetters = /^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9a-zA-Z-_,、]+$/;
                //var listLetters = /^[0-9a-zA-Z-_,]+$/;
             //   var letters = /^[一-龠ぁ-ゔ[ァ-ヴー々〆〤0-9a-zA-Z-_]+$/;
                //var letters = /^[0-9a-zA-Z-_]+$/;
                MAXLENGTH = 51200;
               /* if (!($(elem + index).val().match(listLetters))) {
                    result = false;
                    if (edit) {
                    objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0112);
                    break;
                    }
                    else {
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    }
                }*/
               // var data = $(elem + index).val();
               /* if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                    objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0112);
                    break;
                    }
                    else {
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    }
                }*/
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var lenField = list[ind].length;
                   // var valField = list[ind];
                    if (lenField > MAXLENGTH) {
                        result = false;
                        flag = true;
                        if (edit) {
                        $("#rowValEdit_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0114);
                        break;
                        }
                        else {
                        $("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0114);
                            break;
                        }
                    } /*else if (lenField != 0 && !(valField.match(letters))) {
                        result = false;
                        flag = true;
                        if (edit) {
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                    getUiProps().MSG0110);
                            break;
                        } else {
                        	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0110);
                            break;
                        }
                    } else if (lenField != 0
                            && (specialchar.toString().indexOf(
                                    valField.substring(0, 1)) >= 0)) {
                        result = false;
                        flag = true;
                        if (edit) {
                        	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                    getUiProps().MSG0111);
                            break;
                        } else {
                        	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0111);
                            break;
                        }
                        
                    }*/
                }
                if (flag) {
                    break;
                }
            }
        }
        if ($("#colType_" + index).text() == "Edm.Int32"
            && $("#colCollection_" + index).text() != "List") {
            //Following regex reads value from [0-9].
            var letters = /^[-+]?[0-9]+$/;
            var lenField = $(elem + index).val().length;
            var valField = $(elem + index).val();
            if ($("#colNullable_" + index).text() == "false") {
            	if (lenField < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                    	$("#rowValEdit_" + index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                      uDataManagement.showErrorIcon("#rowValEdit_"+index);
                    } else {
                        $("#rowVal_" + index).focus();
	                    objCommon.setHTMLValue("rowValErrorMsg_" + index,
	                            getUiProps().MSG0115);
	                	uDataManagement.showErrorIcon("#rowVal_"+index);
                    }
                    break;
                }
            }
            if (valField < -2147483648 || valField > 2147483647) {
                result = false;
                if (edit) {
                  objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0075);
                  //  break;
                } else {
                   objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0075);
                //    break;	
                }
            } else if (lenField != 0 && !(valField.match(letters))) {
                result = false;
                if (edit) {
                objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0076);
                //    break;	
                }
                else {
                    objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0076);
                //    break;
                }
                
            }
            if(!result){
            	if(edit){
                   $("#rowValEdit_"+index).focus();
                    uDataManagement.showErrorIcon("#rowValEdit_"+index);
                   }else{
                    $("#rowVal_" + index).focus();
                    uDataManagement.showErrorIcon("#rowVal_"+index);
               }
             break;
            }else{
            if(lenField != 0){
                if(edit){
                		uDataManagement.showValidValueIcon("#rowValEdit_"+index);
                	}else{
                		uDataManagement.showValidValueIcon("#rowVal_"+index);
                	}
            	}
            }
        }
        if ($("#colType_" + index).text() == "Edm.Int32"
            && $("#colCollection_" + index).text() == "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                    	 $("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                    	 $("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                     break;
                 }
             }
            if ($.trim($(elem + index).val()) != "") {
              //Following regex reads value from [0-9] and comma.
                var listLetters = /^[-+]?[0-9,、]+$/;
              //Following regex reads value from [0-9].
                var letters = /^[-+]?[0-9]+$/;
                if (!($(elem + index).val().match(listLetters))) {
                    result = false;
                    if (edit) {
                    	$("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    }
                    else {
                    	$("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    }
                }
                var data = $(elem + index).val();
                if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                    	$("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    } else {
                    	$("#rowVal_" + index).focus();
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    }
                }
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var lenField = list[ind].length;
                    var valField = list[ind];
                    if (valField < -2147483648 || valField > 2147483647) {
                        result = false;
                        flag = true;
                        if (edit) {
                        $("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0075);
                        break;
                        }
                        else {
                        $("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0075);
                            break;
                        }
                    } else if (lenField != 0 && !(valField.match(letters))) {
                        result = false;
                        flag = true;
                       if (edit) {
                       $("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0076);
                           break;
                       }
                       else {
                       $("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                   getUiProps().MSG0076);
                           break;   
                       }
                        
                    }
                }
                if (flag) {
                    break;
                }
            }
        }
        if ($("#colType_" + index).text() == "Edm.Single"
            && $("#colCollection_" + index).text() != "List") {
           //Following regex reads value from [0-9] and decimal.
            var letters = /^[-+]?[0-9]*\.?[0-9]+$/;
            var lenField = $(elem + index).val().length;
            var valField = $(elem + index).val();
            if ($("#colNullable_" + index).text() == "false") {
            	if (lenField < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                    $("#rowValEdit_"+index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                      uDataManagement.showErrorIcon("#rowValEdit_"+index);
                    } else {
                    $("#rowVal_" + index).focus();
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0115);
                	uDataManagement.showErrorIcon("#rowVal_"+index);
                    }
                    break;
                }
            }
            if (lenField != 0 && !(valField.match(letters))) {
                result = false;
                if (edit) {
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
	                        getUiProps().MSG0080);
                }else{
	                objCommon.setHTMLValue("rowValErrorMsg_" + index,
	                        getUiProps().MSG0080);
                }
              //  break;
            }
            var isValid = uComplexTypeProperty.isTypeSingleValid(valField,
                    lenField);
            if (!isValid) {
                result = false;
                if (edit) {
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
	                        getUiProps().MSG0080);
                }else{
	                objCommon.setHTMLValue("rowValErrorMsg_" + index,
	                        getUiProps().MSG0081);
                }
              //  break;
            }
            if(!result){
               if(edit){
                $("#rowValEdit_"+index).focus();
                uDataManagement.showErrorIcon("#rowValEdit_"+index);
             }else{
            		$("#rowVal_" + index).focus();
            		uDataManagement.showErrorIcon("#rowVal_"+index);
            	}
            	break;
            }else{
            	if(lenField != 0){
            		if(edit){
                		uDataManagement.showValidValueIcon("#rowValEdit_"+index);
                	}else{
                		uDataManagement.showValidValueIcon("#rowVal_"+index);
                	}
            	}
            }
        }
        if ($("#colType_" + index).text() == "Edm.Single"
            && $("#colCollection_" + index).text() == "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                    	 $("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                     $("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                     break;
                 }
             }
            if ($.trim($(elem + index).val()) != "") {
               //Following regex reads value from [0-9], decimal and comma.
                var listLetters = /^[-+0-9\.,、]*$/;
                //Following regex reads value from [0-9] and decimal.
                var letters = /^[-+]?[0-9]*\.?[0-9]+$/;
                if (!($(elem + index).val().match(listLetters))) {
                    result = false;
                   if (edit) {
                	   $("#rowValEdit_"+index).focus();
                   objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                               getUiProps().MSG0112);
                       break;
                   } else {
                   objCommon.setHTMLValue("rowValErrorMsg_" + index,
                               getUiProps().MSG0112);
                   $("#rowVal_" + index).focus();
                       break;
                   }
                }
                var data = $(elem + index).val();
                if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                    	 $("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    } else {
                    	 $("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    }
                }
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var lenField = list[ind].length;
                    var valField = list[ind];
                    if (lenField != 0 && !(valField.match(letters))) {
                        result = false;
                        flag = true;
                        if (edit) {
                       	 $("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                    getUiProps().MSG0080);
                            break;	
                        } 
                        else {
                        	 $("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0080);
                            break;
                        }
                        
                    }
                    var isValid = uComplexTypeProperty.isTypeSingleValid(
                            valField, lenField);
                    if (!isValid) {
                        result = false;
                        flag = true;
                        if (edit) {
                       	 $("#rowValEdit_"+index).focus();
                         objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                    getUiProps().MSG0081);
                            break;	
                        }
                      else {
                    		 $("#rowVal_" + index).focus();
                         objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                  getUiProps().MSG0081);
                          break;   
                        }
                    }
                }
                if (flag) {
                    break;
                }
            }
        }
    
        if ($("#colType_" + index).text() == "Edm.DateTime"
            && $("#colCollection_" + index).text() != "List") {
            var lenField = $(elem + index).val().length;
            var valField = $(elem + index).val();
            var bits = valField.split('-');
            var timelenField = $(time + index).val().length;
            
        	if ($("#colNullable_" + index).text() == "false") {
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                    	 $("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                    	 $("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                     break;
                 }
             }
            var MINDATEVALUE = "2000-01-01";
            var MAXDATEVALUE = "3000-01-01";
            // 2000-01-01T00:00:00 3000-01-01T00:00:00
            if (lenField > 0) {
                if (valField < MINDATEVALUE || valField > MAXDATEVALUE) {
                    result = false;
                    if (edit) {
                    	 $("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0079);
                    	$("#entityColTextVal_" + index).css("width","244px");
                        break;	
                    }
                    else {
                    	$("#rowVal_" + index).focus();
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0079);
                        break;
                    }
                } else if (bits[0].length > 4) {
                	if (edit) {
                		result = false;
                		$("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0079);
                    	$("#entityColTextVal_" + index).css("width","244px");
                        break;	
                	} else {
                		result = false;
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0079);
                    	break;
                	}
                }
            }
            //for time validation
            if ( timelenField > 0){
            	if ( lenField == 0){
            		if (edit) {
                		result = false;
                		$("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                    			getUiProps().MSG0115);
                    	$("#entityColTextVal_" + index).css("width","244px");
                        break;	
                	} else {
                		result = false;
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                    			getUiProps().MSG0115);
                    	break;
                	}
            		
            	}
            }else if(lenField > 0){
            	if(timelenField == 0){
            		if(edit){
            			var currentDate = new Date();
            			var hours = currentDate.getHours();
            			var minutes = currentDate.getMinutes();
            			var seconds = currentDate.getSeconds();
            			if (minutes < 10) {
            		        minutes = "0" + minutes;
            		    }
            		    if (seconds < 10) {
            		        seconds = "0" + seconds;
            		    }
            		    var currentTime = hours+":"+minutes+":"+ seconds;
            		    var id = "timeValEdit_"+index;
            		    document.getElementById(id).value = currentTime;
            		    } }else{
            		    	var currentDate = new Date();
                			var hours = currentDate.getHours();
                			var minutes = currentDate.getMinutes();
                			var seconds = currentDate.getSeconds();
                			if (minutes < 10) {
                		        minutes = "0" + minutes;
                		    }
                		    if (seconds < 10) {
                		        seconds = "0" + seconds;
                		    }
                		    var currentTime = hours+":"+minutes+":"+ seconds;
                		    var id = "timeVal_"+index;
                		    document.getElementById(id).value = currentTime;
            		    }
            	}
       }// main if
        
        
        
        /*
         * if($("#colType_"+index).text() == "Edm.DateTime" &&
         * $("#colCollection_"+index).text() == "List"){ var listLetters =
         * /^[0-9,]+$/; if(!($(elem+index).val().match(listLetters))){ result =
         * false; objOdataCommon.setHTMLValue("rowValErrorMsg_"+index,
         * getOdataUiProps().MSG0112); break; } var list =
         * $(elem+index).val().split(','); var noOfItems = list.length; var flag =
         * false; for(var ind = 0; ind < noOfItems; ind++){ var lenField =
         * list[ind].length; var valField = list[ind]; var MINDATEVALUE =
         * "2000-01-01"; var MAXDATEVALUE = "3000-01-01"; // 2000-01-01T00:00:00
         * 3000-01-01T00:00:00 if (lenField > 0) { if (valField < MINDATEVALUE ||
         * valField > MAXDATEVALUE) { result = false;
         * objOdataCommon.setHTMLValue("rowValErrorMsg_"+index,
         * getOdataUiProps().MSG0079); break; } } } if(flag){ break; } }
         */
        if ($("#colType_" + index).text() == "Edm.Boolean"
            && $("#colCollection_" + index).text() != "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		if ($(elem + index).val() == "null") {
                    result = false;
                    if (edit) {
                    	$("#rowValEdit_"+index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0115);
                        break;
                    }
                    else {
                    	$("#rowVal_" + index).focus();
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0115);
                        break;
                    }
                }
             }
        }
        if ($("#colType_" + index).text() == "Edm.Boolean"
            && $("#colCollection_" + index).text() == "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                    	 $("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                       $("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                     break;
                 }
        	}
        	
            if ($(elem + index).val() != "") {
                var data = $(elem + index).val();
                if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                    	$("#rowValEdit_"+index).focus();
                    objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0112);
                        break;
                    }
                    else {
                    $("#rowVal_" + index).focus();
                    objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                        break;	
                    }
                }
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var valField = list[ind];
                    if (!($.trim(valField) == "true"
                        || $.trim(valField) == "True"
                            || $.trim(valField) == "False"
                                || $.trim(valField) == "false" 
                                    || $.trim(valField) == "")) {
                        result = false;
                        flag = true;
                        if (edit) {
                        	$("#rowValEdit_"+index).focus();	 $("#rowVal_" + index).focus();
                        	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                    getUiProps().MSG0112);
                            break;	
                        }
                        else {
                        	 $("#rowVal_" + index).focus();
                        	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0112);
                            break;
                        }
                        
                    }
                }
                if (flag) {
                    break;
                }
            }
        }
        if ($("#colType_" + index).text() == "Edm.Double"
            && $("#colCollection_" + index).text() != "List") {
            //The following reqex ensures that only the double type is accepted, it also ensures that the value doesn't contain more than one .(decimal)
            var letters = "^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$";
            var lenField = $(elem + index).val().length;
            var valField = $(elem + index).val();
            if ($("#colNullable_" + index).text() == "false") {
            	if (lenField < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                    	$("#rowValEdit_"+index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                      uDataManagement.showErrorIcon("#rowValEdit_"+index);
                    } else {
                    $("#rowVal_" + index).focus();
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0115);
                	 uDataManagement.showErrorIcon("#rowVal_"+index);
                    }
                    break;
                }
            }
            if (lenField > 0) {
            if (!(valField.match(letters))) {
	            result = false;
	            if (edit){
	            	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
	                        getUiProps().MSG0221);
	            	//break;
	            }
	            else {
		            objCommon.setHTMLValue("rowValErrorMsg_" + index,
		                        getUiProps().MSG0221);
		            //break;
	            }
            } else if (!objCommon.isTypeDoubleValid(valField)) {
                result = false;
                if (edit) {
                	$("#rowValEdit_"+index).focus();
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                    getUiProps().MSG0219);
                   // break;
                } else {
                	$("#rowVal_" + index).focus();
                objCommon.setHTMLValue("rowValErrorMsg_" + index,
                   getUiProps().MSG0219);
                  //  break;
                }
            }
            if(!result){
            if(edit){
               $("#rowValEdit_"+index).focus();
                 uDataManagement.showErrorIcon("#rowValEdit_"+index);
              }else{
                  $("#rowVal_" + index).focus(); 
                 uDataManagement.showErrorIcon("#rowVal_"+index);
               }
             break;
            }else{
            	if(lenField != 0){
            		if(edit){
               		 uDataManagement.showValidValueIcon("#rowValEdit_"+index);
	               	}else{
	            		uDataManagement.showValidValueIcon("#rowVal_"+index);
	               	}
            	}
            }
          }
        }
        if ($("#colType_" + index).text() == "Edm.Double"
            && $("#colCollection_" + index).text() == "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                     	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                               getUiProps().MSG0115);
                     } else {
                     	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                               getUiProps().MSG0115);
                     }
                 }
             }
            if ($.trim($(elem + index).val()) != "") {
               //Following regex reads value from [0-9], decimal and comma.
                var listLetters = /^[-+0-9eE\.,、]*$/;
                //The following reqex ensures that only the double type is accepted
                var letters = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
                if (!($(elem + index).val().match(listLetters))) {
                    result = false;
                    if (edit) {
                    	$("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                               getUiProps().MSG0112);
                    } else {
                    	$("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                               getUiProps().MSG0112);
                    }
                }
                var data = $(elem + index).val();
                if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                    	$("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                               getUiProps().MSG0112);
                    } else {
                    	$("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                               getUiProps().MSG0112);
                    }
                }
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var lenField = list[ind].length;
                    var valField = list[ind];
                    if (lenField > 0) {
                    	if (!(valField.match(letters))) {
	                        result = false;
	                        flag = true;
	                        if (edit){
	                        	$("#rowValEdit_"+index).focus();
	                        	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
	                                    getUiProps().MSG0080);
	                        	break;
	                        }
	                        else {
	                        	$("#rowValEdit_"+index).focus();
		                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
		                                    getUiProps().MSG0080);
		                        break;
	                        }
                        } else if (!objCommon.isTypeDoubleValid(valField)) {
                            result = false;
                            flag = true;
                            if (edit) {
                            	$("#rowValEdit_"+index).focus();
                            	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                                       getUiProps().MSG0219);
                                break;
                            } else {
                            	$("#rowValEdit_"+index).focus();
                                objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                                       getUiProps().MSG0219);
                               break;
                            }
                        }
                    }
                }
                if (flag) {
                   // break;
                }
            }
        }
    }
    return result;
};

//To be used later when API support is available
/**
 * The purpose of this method is to create data for DateTime property with
 * collection kind as list
 * 
 * @param propVal
 * @returns {Array}
 */
/*
 * dataManagement.prototype.getListDataForDate = function(propVal){ var
 * arrayData = propVal.split(','); var noOfItems = arrayData.length; var
 * propValData = new Array(); for(var counter = 0; counter < noOfItems;
 * counter++){ var datePropVal =
 * uComplexTypeProperty.retrieveEpochDate(arrayData[counter]);
 * propValData.push(datePropVal); } return propValData; };
 */

/**
 * The purpose of this method is to create data for property with collection
 * kind as list
 * 
 * @param propVal
 * @returns {Array}
 */
dataManagement.prototype.getListData = function(propVal, propType) {
    var arrayData = propVal.split(',');	
    if(propType != "Edm.String" && propVal.indexOf('、') != -1){
        arrayData = propVal.split('、');
    }
    var noOfItems = arrayData.length;
    var propValData = new Array();
    for ( var counter = 0; counter < noOfItems; counter++) {
        propValData.push(arrayData[counter]);
    }
    return propValData;
};

/**
 * The purpose of this method is to generate json data for entity creation
 * 
 * @returns {___anonymous36758_36759}
 */
dataManagement.prototype.createJsonData = function(edit) {
    var noOfRows = 0;
    var elem = "";
    var time = "";
    if (!edit) {
        elem = "#rowVal_";
        time = "#timeVal_";
        noOfRows = ($("#createEntityTable tbody tr").length - 1);
    } else {
        elem = "#rowValEdit_";
        time = "#timeValEdit_";
        noOfRows = $("#editEntityTable tbody tr").length;
    }
    var json = {};
    for ( var index = 0; index < noOfRows; index++) {
        if (uDataManagement.propertyDetailsList[index][1] == "Edm.String"
         || uDataManagement.propertyDetailsList[index][1] == "Edm.Int32"
         ||uDataManagement.propertyDetailsList[index][1] == "Edm.Single"
         || uDataManagement.propertyDetailsList[index][1] == "Edm.Double") {
            if ($(elem + index).val() != "") {
                if (uDataManagement.propertyDetailsList[index][2] == "None") {
                    var propName = uDataManagement.propertyDetailsList[index][0];
                    var propVal = $(elem + index).val();
                    json[propName] = propVal;
                } else if (uDataManagement.propertyDetailsList[index][2] == "List") {
                    var propName = uDataManagement.propertyDetailsList[index][0];
                    var propVal = $(elem + index).val();
                    var propValData = uDataManagement.getListData(propVal, uDataManagement.propertyDetailsList[index][1]);
                    json[propName] = propValData;
                }
            }
        } else if (uDataManagement.propertyDetailsList[index][1] == "Edm.Boolean") {
            if (uDataManagement.propertyDetailsList[index][2] == "None") {
                if ($(elem + index).val() != "null") {
                    var propName = uDataManagement.propertyDetailsList[index][0];
                    var propVal = $(elem + index).val();
                    json[propName] = propVal;
                }else{
                	var propName = uDataManagement.propertyDetailsList[index][0];
                    json[propName] = null;
                }
            } else if (uDataManagement.propertyDetailsList[index][2] == "List") {
                if ($(elem + index).val() != "") {
                    var propName = uDataManagement.propertyDetailsList[index][0];
                    var propVal = $(elem + index).val();
                    var propValData = uDataManagement.getListData(propVal, uDataManagement.propertyDetailsList[index][1]);
                    json[propName] = propValData;
                }
            }
        } else if (uDataManagement.propertyDetailsList[index][1] == "Edm.DateTime") {
            if ($(elem + index).val() != "") {
                if (uDataManagement.propertyDetailsList[index][2] == "None") {
                    var propName = uDataManagement.propertyDetailsList[index][0];
                    var propVal = uComplexTypeProperty.retrieveEpochDate($(
                            elem + index).val(),$(time + index).val());
                    json[propName] = propVal;
                }
                // To be used later when API support is available
                /*
                 * else if(propDetailsList[index][2] == "List"){ var propName =
                 * propDetailsList[index][0]; var propVal = $(elem+index).val();
                 * var propValData =
                 * uDataManagement.getListDataForDate(propVal); json[propName] =
                 * propValData; }
                 */
            }
        } 
        else {
            // for complex type
        }
    }
    var idValue = $("#rowVal_id").val();
    if (!edit && idValue != "" && idValue != null && idValue != undefined) {
        json.__id = idValue;
    }
    return json;
};

/**
 * The purpose of this method is to clear error messages
 */
dataManagement.prototype.clearErrorMessages = function(edit) {
    var noOfRows = 0;
    var loopLimit = 0;
    if (!edit) {
        document.getElementById("rowValErrorMsg_id").innerHTML = "";
        noOfRows = $("#createEntityTable tbody tr").length;
        loopLimit = (noOfRows - 1);
    }else{
   	noOfRows = $("#editEntityTable tbody tr").length;
        loopLimit = noOfRows;
    }
    for ( var index = 0; index < loopLimit; index++) {
        if (uDataManagement.propertyDetailsList[index][1] == "Edm.String"
            || uDataManagement.propertyDetailsList[index][1] == "Edm.Int32"
                || uDataManagement.propertyDetailsList[index][1] == "Edm.Boolean"
                    || uDataManagement.propertyDetailsList[index][1] == "Edm.Single"
                        || uDataManagement.propertyDetailsList[index][1] == "Edm.DateTime"
                        	|| uDataManagement.propertyDetailsList[index][1] == "Edm.Double") {
            if (edit) {
            	//document.getElementById("rowValErrorEditMsg_" + index).innerHTML = "";
            } else {
            	//document.getElementById("rowValErrorMsg_" + index).innerHTML = "";	
            }
        	
        }
    }
};

/**
 * The purpose of this method is to remove error/success validation icons from text boxes.
 */
dataManagement.prototype.clearErrorAndSuccessIcons = function(edit){
	var noOfRows = 0;
    var loopLimit = 0;
    if (!edit) {
        $("#rowVal_id").removeClass("errorIcon");
        $("#rowVal_id").removeClass("validValueIcon");
        noOfRows = $("#createEntityTable tbody tr").length;
        loopLimit = (noOfRows - 1);
    }else{
    	noOfRows = $("#editEntityTable tbody tr").length;
        loopLimit = noOfRows;
    }
    for ( var index = 0; index < loopLimit; index++) {
        if ((uDataManagement.propertyDetailsList[index][1] == "Edm.String"
            || uDataManagement.propertyDetailsList[index][1] == "Edm.Int32"
                    || uDataManagement.propertyDetailsList[index][1] == "Edm.Single"
                        	|| uDataManagement.propertyDetailsList[index][1] == "Edm.Double")
                        	&& uDataManagement.propertyDetailsList[index][2] != "List") {
            if (edit) {
            	$("#rowValEdit_" + index).removeClass("errorIcon");
            	$("#rowValEdit_" + index).removeClass("validValueIcon");
            } else {
            	$("#rowVal_" + index).removeClass("errorIcon");
            	$("#rowVal_" + index).removeClass("validValueIcon");
            }
        }
     }
};

/**
 * This method validates ID field as specified in API
 * 
 * @returns {Boolean}
 */
dataManagement.prototype.validateIDField = function(isCalledOnBlur) {
    var id = $("#rowVal_id").val();
    var lengthOfID = id.length;
   //Following regex reads value from [0-9],[A-z],hyphen and underscore.
    var letters = /^[0-9a-zA-Z-_:]+$/;
    var specialchar = /^[-_:]*$/;
    var MAXLENGTH = 200;
    var result = true;
    if (lengthOfID > MAXLENGTH) {
        result = false;
        objCommon.setHTMLValue("rowValErrorMsg_id",
                getUiProps().MSG0129);
    } else if (lengthOfID != 0 && !(id.match(letters))) {
        result = false;
        	objCommon.setHTMLValue("rowValErrorMsg_id",
                    getUiProps().MSG0130);
    } else if (lengthOfID != 0
            && (specialchar.toString().indexOf(id.substring(0, 1)) >= 0)) {
        result = false;
        	objCommon.setHTMLValue("rowValErrorMsg_id",
                    getUiProps().MSG0127);
    }
    if(!result){
    uDataManagement.showErrorIcon("#rowVal_id");
    if(!isCalledOnBlur){
     $("#rowVal_id").focus();
    }
   }else{
    	if(lengthOfID != 0){
    		uDataManagement.showValidValueIcon("#rowVal_id");
    	}
    }
    return result;
};

/**
 * The purpose of this method is to create an entity.
 */
dataManagement.prototype.createEntity = function() {
    showSpinner("modalSpinnerDataManagement");
    uDataManagement.clearErrorMessages(false);
    uDataManagement.clearErrorAndSuccessIcons(false);
        var idCheck = uDataManagement.validateIDField(false);
        if (idCheck) {
            var fieldCheck = uDataManagement.validateFieldsPerType(false);
            if (fieldCheck) {
                var baseUrl = getClientStore().baseURL;
                if (!baseUrl.endsWith("/")) {
                    baseUrl += "/";
                }
                var cellName = sessionStorage.selectedcell;
                var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
                var path = sessionStorage.selectedCollectionURL;
                if(!(path).endsWith("/")){
                	path += "/";
                }
                path += entityTypeName;
                var accessor = objCommon.initializeAccessor(baseUrl,
                        cellName);
                var objjEntity = new _pc.Entity(accessor, path);
                var objEntityManager = new _pc.EntityManager(accessor, objjEntity);
                var json = uDataManagement.createJsonData(false);
                	 var response = objEntityManager.create(json);
                     if (response != undefined && response.getStatusCode() == 201) {
                     	if(sessionStorage.ODataViewSelectedTab == "raw"){
                     		uDataManagement.getRawJSONView();
                     	}else if(sessionStorage.ODataViewSelectedTab == "grid"){
                         uDataManagement.getEntityList(uDataManagement.propertyDetailsList,false);
                         setTimeout(function(){
                         	uDataManagement.setHeaderColsWidth();
                         },50);
                     	}
                         var message = getUiProps().MSG0371;
                         objCommon.displaySuccessMessage(message, '#createEntityModalWindow', "191px", "crudOperationMessageBlock");
                     } else if (response != undefined
                             && response.getStatusCode() == 409) {
                         uDataManagement.clearErrorAndSuccessIcons(false);
                     	objCommon.setHTMLValue("rowValErrorMsg_id",
                                 getUiProps().MSG0128);
                         uDataManagement.showErrorIcon("#rowVal_id");
                     }
            }
        }
  //  }
    removeSpinner("modalSpinnerDataManagement");
};

/**
 * The purpose of this method is to enable edit button.
 */
dataManagement.prototype.enableEditButton = function() {
    $("#editOdata").removeClass("editIconWebDav");
    $("#editOdata").addClass('editIconWebDavEnabled');
};

/**
 * The purpose of this method is to disable edit button
 */
dataManagement.prototype.disableEditButton = function() {
	 $("#editOdata").addClass("editIconWebDav");
	 $("#editOdata").removeClass('editIconWebDavEnabled');
};

/**
 * The purpose of this method is to highlight a row.
 * 
 * @param rowIndex
 * @param noOfCols
 * @param noOfRows
 */
/*dataManagement.prototype.rowSelect = function(rowIndex, noOfCols, noOfRows) {
    if ($('#entityChkBox_' + rowIndex).is(':checked')) {
        $('#entityTable input[type=checkbox][id=entityChkBox_'+ rowIndex +']').attr('checked',true);
        $('.fht-fixed-column .fht-tbody tr').eq(rowIndex).addClass('checkRow');
        for ( var index = 0; index < noOfRows; index++) {
            for ( var indexCol = 0; indexCol < (noOfCols + 3); indexCol++) {
                $("#entityCol_" + index + "_" + indexCol).removeClass(
                'selectCol');
                $("#colChkBox_" + index).removeClass('selectCol');
                $("#colLink_" + index).removeClass('selectCol');
                $("#colId_" + index).removeClass('selectCol');
                $("#colCreatedOn_" + index).removeClass('selectCol');
                $("#colUpdatedOn_" + index).removeClass('selectCol');
            }
        }
        var obj = $('#entityRow_' + rowIndex);
        obj.addClass('checkRow');
    } else {
        var obj = $('#entityRow_' + rowIndex);
        obj.removeClass('checkRow');
        $('.fht-fixed-column .fht-tbody tr').eq(rowIndex).removeClass('checkRow');
        $('#entityTable input[type=checkbox][id=entityChkBox_'+ rowIndex +']').attr('checked',false);
    }
    var noOfSelectedRows = 0;
    for ( var index = 0; index < noOfRows; index++) {
        if ($('#entityChkBox_' + index).is(':checked')) {
            noOfSelectedRows++;
        }
    }
    if (noOfSelectedRows == 1) {
        uDataManagement.enableEditButton();
    } else {
        uDataManagement.disableEditButton();
    }
    if (noOfSelectedRows != noOfRows) {
        $('#headerChkBox').attr('checked', false);
    }
    if (noOfSelectedRows == noOfRows) {
        $('#headerChkBox').attr('checked', true);
    }
    if (noOfSelectedRows == 0) {
        // Disable Delete button
        objCommon.disableButton('#btnDeleteEntity');
    } else {
        // Enable Delete Button
        objCommon.enableButton('#btnDeleteEntity');
    }
};*/

/**
 * The purpose of this method is to highlight a column
 * 
 * @param rowIndex
 * @param colIndex
 * @param noOfCols
 * @param noOfRows
 */
/*dataManagement.prototype.columnSelect = function(rowIndex, colIndex, noOfCols,
        noOfRows) {
    if (event.target.type !== 'checkbox') {
        for ( var index = 0; index < noOfRows; index++) {
            if (index != rowIndex) {
                for ( var indexCol = 0; indexCol < (noOfCols + 3); indexCol++) {
                    $("#entityCol_" + index + "_" + indexCol).removeClass(
                    'selectCol');
                    $("#colChkBox_" + index).removeClass('selectCol');
                    $("#colLink_" + index).removeClass('selectCol');
                    $("#colId_" + index).removeClass('selectCol');
                    $("#colCreatedOn_" + index).removeClass('selectCol');
                    $("#colUpdatedOn_" + index).removeClass('selectCol');
                }
            }
            var row = $('#entityRow_' + index);
            row.removeClass('checkRow');
            $('.fht-fixed-column .fht-tbody tr').removeClass('checkRow');
            $('#entityChkBox_' + index).attr('checked', false);
        }
        var obj = "";
        if (colIndex == "chk") {
            obj = $("#colChkBox_" + rowIndex);
            $('.fht-fixed-column .fht-tbody tr').eq(rowIndex).addClass('checkRow');
        } else if (colIndex == "id") {
            obj = $("#colId_" + rowIndex);
        } else if (colIndex == "create") {
            obj = $("#colCreatedOn_" + rowIndex);
        } else if (colIndex == "update") {
            obj = $("#colUpdatedOn_" + rowIndex);
        } else if (colIndex == "link") {
            obj = $("#colLink_" + rowIndex);
        } else {
            obj = $("#entityCol_" + rowIndex + "_" + colIndex);
        }
        obj.siblings().removeClass('selectCol');
        obj.addClass("selectCol");
        objCommon.disableButton('#btnDeleteEntity');
    }
    var noOfSelectedRows = 0;
    for ( var index = 0; index < noOfRows; index++) {
        if ($('#entityChkBox_' + index).is(':checked')) {
            noOfSelectedRows++;
        }
    }
    if (noOfSelectedRows == 1) {
        uDataManagement.enableEditButton();
    } else {
        uDataManagement.disableEditButton();
    }
};*/

/**
 * The purpose of the following method id to close the property details window.
 * 
 * @param id
 */
dataManagement.prototype.closePropertyDetailsDiv = function(id) {
    $("#" + id).remove();
};

/**
 * The purpose of the following method is to create property details pop up.
 * 
 * @param entityNames
 * @param id
 * @returns {String}
 */
dataManagement.prototype.createTablePropertyDetails = function(
		shorterPropertyValues, entityNames, id) {
	var count = 0;
	var dynamicTable = '';
	if (entityNames.length > 0) {
		var entity = entityNames.split(",");
		var arrEntity = new Array();
		arrEntity = entityNames.split(",");
		count = entity.length;
		dynamicTable += "<table class='propertyDetailsTablePopUp'  id='tblPropertyDetails_"
				+ id + "'>";
		dynamicTable += '<thead style="color: #1b1b1b;text-align: left;font-family: Segoe UI Light; font-weight:normal;font-size: 12pt;" ><tr><th  style="height:35px;border-bottom: 1px solid #e6e6e6;"><div style="float:left;padding-left:10px;max-width: 125px" class="editACLTableEllipsis">'
				+ entityNames
				+ '</div>'
				+ '<input type="button" style="outline:none" onclick="uDataManagement.closePropertyDetailsDiv('
				+ "'"
				+ id
				+ "'"
				+ ');" class="collectionPopupCloseIcon" title="'+getUiProps().LBL0026+'"/></th></thead></tr>';
		dynamicTable += '<tbody   class="propertyDetailsTbody entityGridTbody">';
		for ( var i = 0; i < count; i++) {
			dynamicTable += '<tr id="elrowid' + count + '">';
			dynamicTable += '<td><div title='
					+ arrEntity[i]
					+ ' class="editACLTableEllipsis">'
					+ arrEntity[i] + '</div></td>';
			dynamicTable += '</tr></div>';
		}
		dynamicTable += '</tbody></table>';
	}
	return dynamicTable;
};

/**
 * Following method calculates dimemsions - width and height.
 * @param percentage - number pop up would be drifted.
 * @param windowElement windowwidth and windowheight.
 * @returns {Number} dimension
 */
dataManagement.prototype.calculateDimension = function(percentage,windowElement) {
	var modifiedValue  = ((percentage * windowElement) / 100);
	var newValue = windowElement - modifiedValue;
	return newValue;
};

/**
 * The purpose of the following method is to create detais pop up.
 * 
 * @param propertyValues
 * @param e
 * @param count
 * @param indexHeader
 */
dataManagement.prototype.createPropertyDetailsPopUp = function(
        shorterPropertyValues, propertyValues, count, indexHeader) {
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
    var id = "dvID_" + count + "_" + indexHeader;
    var element = document.getElementById(id); 
    var evt = window.event;
    var clickX = 0, clickY = 0;
    if (evt.pageX || evt.pageY) {
        clickX = evt.pageX;
        clickY = evt.pageY;
    }
    // calculate 15 percent of total window width.
    var widthPercentageToBeShiftedInside = 15;
    var heightPercentageToBeShiftedInside = 22;
    var newWidth = this.calculateDimension(widthPercentageToBeShiftedInside,windowWidth);
    var newHeight = this.calculateDimension(heightPercentageToBeShiftedInside,windowHeight);
    //If the location of click event is greater than the difference calculated above then 'newWidth' becomes the width; 
       if (clickX > newWidth) {
       clickX = newWidth;
    }
     if (clickY > newHeight) {
          clickY = newHeight;
     }
    var left = clickX + 20 + "px";
    var top = clickY +17+ "px";
    if (element == null) {
        var dynamicTable = uDataManagement.createTablePropertyDetails(
                shorterPropertyValues, propertyValues, id);
        $('<div  id=' + id + ' style="background-color : #ffffff;position:absolute; max-width:230px; top:' + top + ';left:' + left + '"/>') 
        .html(dynamicTable) // set html content
        .attr({
            className : 'openDetailsPopUpDataMgmt modal-window block-border'
        }).appendTo('body');
    }
};

/**
 * The purpose of this method is to reassign the width for header columns 
 * as per data column width.
 */
dataManagement.prototype.setHeaderColsWidth = function(){
	var noOfProps = uDataManagement.propertyDetailsList.length;
	var headerIDWidth = $("#entityTable tbody tr td:eq(2)").width();
	$("#entityTable thead tr th:eq(2)").css("min-width", headerIDWidth + "px");
	var headerCreatedOnWidth = $("#entityTable tbody tr td:eq(3)").width();
	$("#entityTable thead tr th:eq(3)").css("min-width", headerCreatedOnWidth + "px");
	var headerUpdatedOnWidth = $("#entityTable tbody tr td:eq(4)").width();
	$("#entityTable thead tr th:eq(4)").css("min-width", headerUpdatedOnWidth + "px");
	for(var index = 0; index < noOfProps; index++){
		var colIndex = index+5;
		var headerColWidth = $("#entityTable tbody tr td:eq("+ colIndex +")").width();
		$("#entityTable thead tr th:eq("+ colIndex +")").css("min-width", headerColWidth + "px");
	}
	var headerLinkWidth = $("#entityTable tbody tr td:last-child").width();
	if(headerLinkWidth != 0 && headerLinkWidth != null && headerLinkWidth != undefined){
		$("#entityTable thead tr th:last-child").css("min-width", headerLinkWidth + "px");
	}
};

/**
 * The purpose of this method si to open Entity URL popup with the appropriate value.
 * @param entityURL
 */
dataManagement.prototype.openEntityURLPopUp = function(count){
	var entityURL = $("#odataGridURLIcon_"+count).val();
	var entityURLVal = unescape(entityURL);
	$("#entityURLValue").text(entityURLVal);
	openCreateEntityModal("#urlEntityModalWindow", "#urlEntityDialogBox", 'entityURLValue');
	$("#entityURLValue").scrollTop(0);
	$("#urlDataManagement").focus();
};

/**
 * The purpose of this method is to create dynamic row for entity data
 * 
 * @param count
 * @param propNameValuePairForRow
 * @returns {String}
 */
dataManagement.prototype.createEntityRow = function(count,
        propNameValuePairForRow, recordSize, id, createdOn, updatedOn, entityURL,etag) {
    var noOfProps = propNameValuePairForRow.length;
    var colWidth = 0;
	if(noOfProps == 0){
		colWidth = Math.round((parseInt(uDataManagement.getAvailableWidthForDataGrid())-38-36)/(4)) - 12;
		if(colWidth < 216){
			colWidth = 216;
		}
	}else{
		colWidth = Math.round((parseInt(uDataManagement.getAvailableWidthForDataGrid())-38-36)/(1 + 4)) - 12;
		if(colWidth < 170){
			colWidth = 170;
		}
	} 
	var collectionURL = '"' + sessionStorage.selectedCollectionURL + '"';
    var dynamicRow = "<tr id='entityRow_" + count + "' onclick='objCommon.rowSelect(this,"+ '"entityRow_"' +","+ '"entityChkBox_"'+","+ '"row"' +","+ '"deleteOdata"' +","+ '"headerChkBox"' +","+ count +"," + uDataManagement.totalRecordCount + ","+ '"editOdata"' + ","+'""'+","+'""'+","+'""'+","+'"entityTable"'+","+ collectionURL +");'>";
    var headerListSize = propNameValuePairForRow.length;
    var colName = '"' + 'chk' + '"';
    var dynamicCols = "<td class='entityColDataChkBox fixed' id='colChkBox_"
        + count
        + "'><input id =  'txtHiddenEntityEtagId"+count+"' value="+etag+" type ='hidden' /> <input title="+count+" type='checkbox' name='case' class='checkBox cursorHand regular-checkbox big-checkbox' id='entityChkBox_"
        + count + "' value='" + id + "'/><label for='entityChkBox_"+ count +"' class='customChkbox checkBoxLabel'></label></td>";
    colName = '"' + 'url' + '"';
    dynamicCols = dynamicCols + "<td class='entityColData fixed' style='min-width:25px;' id='colURL_"
    + count + "'><div id='entityURLLink' class='odataGridURLIcon' onclick='uDataManagement.openEntityURLPopUp("+ count +");'></div>" +
    		"<input type='hidden' id='odataGridURLIcon_"+ count +"' value='"+ escape(entityURL) +"'/></td>";
   // var idWidth = id.length * 8;
    colName = '"' + 'id' + '"';
    dynamicCols = dynamicCols + "<td class='entityColData' style='min-width:"+ colWidth +"px' id='colId_" + count
    + "'>" + id + "</td>";
    colName = '"' + 'create' + '"';
    dynamicCols = dynamicCols + "<td class='entityColData' style='min-width:"+ colWidth +"px' id='colCreatedOn_"
    + count + "'>" + createdOn + "</td>";
    colName = '"' + 'update' + '"';
    dynamicCols = dynamicCols + "<td class='entityColData' style='min-width:"+ colWidth +"px' id='colUpdatedOn_"
    + count + "'>" + updatedOn + "</td>";
    for ( var indexHeader = 0; indexHeader < headerListSize; indexHeader++) {
        var propValue = propNameValuePairForRow[indexHeader][1].toString();
        /*var propValWidth = propValue.length * 8;*/
        var propNameWidth = 0;
        if(propNameValuePairForRow[indexHeader][0].length > 8){
        	propNameWidth = (propNameValuePairForRow[indexHeader][0].length * 8) + 40;
        } else{
        	propNameWidth = (propNameValuePairForRow[indexHeader][0].length * 10) + 40;
        }
        if(propNameWidth < colWidth){
        	propNameWidth = colWidth;
        }
        
        var shorterPropValue = "";
        var length = propValue.length;
        if (length > 16) {
            shorterPropValue = propValue.substring(0, 15) + "..";
        } else {
            shorterPropValue = propValue;
        }

        if (propNameValuePairForRow[indexHeader][3] == "List") {
        	if (propNameValuePairForRow[indexHeader][4] == false) {
        		var propertyValues = '"' + propValue + '"';
                var trimmedPropertyValues = '"' + shorterPropValue + '"';
                dynamicCols = dynamicCols
                + "<td style='min-width:"+ propNameWidth +"px' class='entityColData entityDataLink' id='entityCol_"
                + count
                + "_"
                + indexHeader
                + "'>"
                + "<div id=dvAnchorTag"
                + count
                + "><a id='listLink' style='white-space:nowrap;' onclick='uDataManagement.createPropertyDetailsPopUp("
                + trimmedPropertyValues + "," + propertyValues
                + " ," + count + "," + indexHeader
                + ")'  href=# class='addSpace isDeclaredProperty'>" + propValue
                + "</a></div></td>";
        	} else {
        		var propertyValues = '"' + propValue + '"';
                var trimmedPropertyValues = '"' + shorterPropValue + '"';
                dynamicCols = dynamicCols
                + "<td style='min-width:"+ propNameWidth +"px' class='entityColData entityDataLink' id='entityCol_"
                + count
                + "_"
                + indexHeader
                + "'>"
                + "<div id=dvAnchorTag"
                + count
                + "><a id='listLinkId' style='white-space:nowrap;' onclick='uDataManagement.createPropertyDetailsPopUp("
                + trimmedPropertyValues + "," + propertyValues
                + " ," + count + "," + indexHeader
                + ")'  href=# class=addSpace>" + propValue
                + "</a></div></td>";
        	}
            
        } else {
        	if (propNameValuePairForRow[indexHeader][4] == false) {
        		dynamicCols = dynamicCols
                + "<td style='min-width:"+ propNameWidth +"px;white-space:nowrap;' class='entityColData isDeclaredProperty' id='entityCol_" + count + "_"
                + indexHeader + "'>" + propValue + "</td>";
        	} else {
        		dynamicCols = dynamicCols
                + "<td style='min-width:"+ propNameWidth +"px;white-space:nowrap;' class='entityColData' id='entityCol_" + count + "_"
                + indexHeader + "'>" + propValue + "</td>";
        	}
            
        }
    }
    colName = '"' + 'link' + '"';
    id = '"' + id + '"';
    dynamicCols = dynamicCols
    + "<td style='min-width:"+ colWidth +"px' class='entityColDataLink' id='colLink_"
    + count
    + "'><div id='entityLinkImage' class='entityTableLinkImg' onclick='uDataManagement.openEntityLinkModal("
    + id + ");'></div></td>";
    dynamicRow = dynamicRow + dynamicCols;
    dynamicRow = dynamicRow + "</tr>";
    return dynamicRow;
};

/**
 * The purpose of this method is to create and initialize an entity manager.
 * @returns {jEntityManager}
 */
dataManagement.prototype.initializeEntityManager = function(){
    var baseUrl = getClientStore().baseURL;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }
    var cellName = sessionStorage.selectedcell;
    var collectionURL = sessionStorage.selectedCollectionURL;
    if(!(collectionURL.endsWith('/'))){
    	collectionURL += '/';
    }
    var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
    var path = collectionURL + entityTypeName;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var objjEntity = new _pc.Entity(accessor, path);
    var objEntityManager = new _pc.EntityManager(accessor, objjEntity);
    return objEntityManager;
};

/**
 * The purpose of this method is to fetch the total count of records.
 * @returns count total number of records
 */
dataManagement.prototype.retrieveRecordCount = function() {
	var objEntityManager = uDataManagement.initializeEntityManager();
	var response = objEntityManager.query().top(0).inlinecount("allpages").runAsResponse();
	var json = response.getOData().d;
	var count = json.__count;
	return count;
};

/**
 * The purpose of this method is to fetch the required records as per pagination. 
 * @param lowerLimit
 * @param upperLimit
 * @returns
 */
dataManagement.prototype.retrieveChunkedData = function(lowerLimit, upperLimit) {
	var objEntityManager = uDataManagement.initializeEntityManager();
	var json = objEntityManager.query().orderby("__updated desc").skip(lowerLimit).top(upperLimit).run();
	return json;
};

/**
 * The purpose of this method is to create Data View Grid as per paginated data.
 * @param json
 * @param propList
 * @param recordSize
 */
dataManagement.prototype.createEntityTable = function(json, propList, recordSize){
	$('#headerChkBox').attr('checked', false);
	uDataManagement.disableEditButton();
	objCommon.disableDeleteIcon("#deleteOdata");
    var dynamicRow = "";
    var noOfProps = propList.length;
    if(typeof json === "string"){
        json = JSON.parse(json);
        if(typeof json === "string"){
            json = JSON.parse(json);
        }
    }
    var jsonLength = json.length;
    var maxLimit = (uDataManagement.MAXROWS+recordSize) < (jsonLength) ? (uDataManagement.MAXROWS+recordSize) : jsonLength;
    var rowIndex = 0;

    for ( var count = recordSize; count < maxLimit; count++) {
        var obj = json[count];
        var id = obj.__id;
        var createdOn = objCommon
        .convertEpochDateToReadableFormat(obj.__published);
        var updatedOn = objCommon
        .convertEpochDateToReadableFormat(obj.__updated);
        var metaData = obj.__metadata;
        var entityURL = metaData.uri;
        var etag = obj.__metadata.etag;
        var propNameValuePairForRow = new Array();
        for ( var indexProp = 0; indexProp < noOfProps; indexProp++) {
            var propName = propList[indexProp][0];
            var type = propList[indexProp][1];
            var kind = propList[indexProp][2];
            var isDeclared = propList[indexProp][7];
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
        + uDataManagement.createEntityRow(rowIndex,
                propNameValuePairForRow, (maxLimit - recordSize), id, createdOn,
                updatedOn, entityURL,etag);
        rowIndex++;

    }
    $("#entityTable tbody").html(dynamicRow);
   // $("#entityTable tbody tr:odd").css("background-color", "#F4F4F4");
};

/**
 * The purpose of this method is to fetch the list of entities and show them in
 * table form.
 */
dataManagement.prototype.getEntityList = function(propList,isDeleted) {
    sessionStorage.queryData = "";
    uDataManagement.totalRecordCount = uDataManagement.retrieveRecordCount('');
    sessionStorage.totalRecordsOnDataGrid = uDataManagement.totalRecordCount;
    sessionStorage.odataView = "odataset";
    if(uDataManagement.totalRecordCount > 0){
    	$("#headerChkBox").attr("disabled",false);
    	$("#headerChkBoxLabel").css("cursor","pointer");
    	objCommon.disableDeleteIcon("#deleteOdata");
    	uDataManagement.disableEditButton();
        if (isDeleted == false){
          var json = uDataManagement.retrieveChunkedData(objCommon.minRecordInterval,objCommon.noOfRecordsToBeFetched);
          var recordSize = 0;
        uDataManagement.createEntityTable(json, propList, recordSize);
        var tableID = $('#entityTable');
        objCommon.createPaginationView(uDataManagement.totalRecordCount, objCommon.MAXROWS, tableID, uDataManagement, json, uDataManagement.createEntityTable, "OdataGrid", -1, propList);
       /* $(".pagination").remove();
        objCommon.createPagination(totalRecordCount, "",
                uDataManagement.MAXROWS, $("#entityTable tbody"), "#resultPane",uDataManagement, propList, json, 
                uDataManagement.createEntityTable, 1, "dataManagement");
        sessionStorage.selectedPageNo = "";*/
        }
    } else {
    	$("#headerChkBox").attr("disabled",true);
    	$("#headerChkBoxLabel").css("cursor","default");
        var noOfProps = propList.length;
        var noOfCols = noOfProps + 6;
        var noDataRow = "<tr id='msg'><td style='width:100%;' id='msg' colspan='"
            + noOfCols
            + "'><div id='dvNoEntityCreated' class='noEntityCreated' style='line-height: 21px;'>"+getUiProps().MSG0366+"</div></td><td id='msg'></td></tr>";
        $("#entityTable tbody").html(noDataRow);
        if (sessionStorage.selectedLanguage == 'ja') {
        	$("#dvNoEntityCreated").css('width', '150px');
        	$("#dvNoEntityCreated").addClass('japaneseFont');
        }
        $("#recordCount_OdataGrid").html("0 - 0 "+getUiProps().MSG0323+" 0");
    }
    $("#entityTable").scrollLeft(0);
	$("#entityTable tbody").scrollTop(0);
    $('#headerChkBox').attr('checked', false);
};

/**
 * The purpose of this method is to get the details of selected entity
 * 
 * @returns {Array}
 */
dataManagement.prototype.getSelectedEntity = function(propList) {
    var noOfRows = $("#entityTable tbody tr").length;
    var selectedEntity = new Array();
    var sizeHeaderList = propList.length;
    for ( var index = 0; index < noOfRows; index++) {
        if ($('#entityChkBox_' + index).is(':checked')) {
            for ( var innerIndex = 0; innerIndex < sizeHeaderList; innerIndex++) {
                selectedEntity[innerIndex] = [];
                selectedEntity[innerIndex][0] = propList[innerIndex];
                selectedEntity[innerIndex][1] = $("#entityCol_" + index + "_" + innerIndex).text();
                selectedEntity[innerIndex][2] = $("#colId_" + index).text();// $('#entityChkBox_'+index).val();//this
                // is generated
                // row id for
                // entity
            }
            break;
        }
    }
    return selectedEntity;
};

/**
 * The purpose of this method is to create and open edit entity popup
 */
dataManagement.prototype.editEntityPopUp = function() {
    var propList = uDataManagement.getProperties();
    var selectedEntity = uDataManagement.getSelectedEntity(propList);
    uDataManagement.entityID = selectedEntity[0][2];
    uDataManagement.createEntityPopUp(true, selectedEntity);
};

/**
 * The purpose of this method is to call API for edit entity.
 */
dataManagement.prototype.editEntity = function() {
    showSpinner("modalSpinnerDataManagement");
    uDataManagement.clearErrorMessages(true);
    uDataManagement.clearErrorAndSuccessIcons(true);
        var fieldCheck = uDataManagement.validateFieldsPerType(true);
        if (fieldCheck) {
            var baseUrl = getClientStore().baseURL;
            if (!baseUrl.endsWith("/")) {
                baseUrl += "/";
            }
            var cellName = sessionStorage.selectedcell;
            var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
            var entityId = uDataManagement.entityID;
            var path = sessionStorage.selectedCollectionURL;
            if(!(path).endsWith("/")){
            	path += "/";
            }
            path += entityTypeName;
            var accessor = objCommon.initializeAccessor(baseUrl, cellName);
            var objjEntity = new _pc.Entity(accessor, path);
            var objEntityManager = new _pc.EntityManager(accessor, objjEntity);
            var json = uDataManagement.createJsonData(true);
            var response = objEntityManager.update(entityId, json, "*");
            if (response.getStatusCode() == 204) {
            	uDataManagement.getEntityList(uDataManagement.propertyDetailsList,false);
                 setTimeout(function(){
						uDataManagement.setHeaderColsWidth();
					},50);
                var message = getUiProps().MSG0374;
                objCommon.displaySuccessMessage(message, '#editEntityModalWindow', "200px", "crudOperationMessageBlock");
                uDataManagement.resetButtonsAndCheckBox();
            }
        }
   // }
    removeSpinner("modalSpinnerDataManagement");
};

/**
 * The purpose of this method is to save the selected page number
 * 
 * @param mode
 */
dataManagement.prototype.saveSelectedPage = function(mode) {
    var totalPageNo = Math.ceil(sessionStorage.totalRecordsOnDataGrid / uDataManagement.MAXROWS);
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
    sessionStorage.selectedPageNo = selectedPageNo;
    sessionStorage.selectedPageIDNumber = selectedPageIDNumber;
};

/**
 * The purpose of this method is to update page number and page state on
 * toggling between raw view and grid view.
 * 
 * @param pageNo
 * @param tableID
 * @param maxRows
 * @param totalPageNo
 */
/*dataManagement.prototype.maintainPageState = function(pageNo, tableID, maxRows,
        totalPageNo) {
    if(pageNo === "" || pageNo === undefined){
        pageNo = 1;
    }
    var selectedPageIDNum = sessionStorage.selectedPageIDNumber;
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
};*/

/**
 * The purpose of this method is to create data view for Raw mode.
 * @param json
 * @param propList
 * @param recordCount
 */
dataManagement.prototype.createTableForRawView = function(totalRecordCount, callback){
	var json = uDataManagement.retrieveChunkedData(0,totalRecordCount);
	var jsonLength = json.length;
	var dynamicTable = '<table id="entityRawTable" cellspacing=0 cellpadding=0 class="scrollEntityTable">' +
	'<tbody id="entityRawTbody" class="entityRawTbody scrollEntityTable entityGridTbody"><tr><td></tr></td>';
	for ( var count = 0; count < jsonLength; count++) {
		var obj = json[count];
		dynamicTable += "<tr><td><pre class='prettyprint'><div >" + objCommon.syntaxHighlight(obj)
	+ "</div></pre></td></tr>";
	}
	//$("#entityRawTable tbody").html(dynamicRow);
	dynamicTable += '</tbody></table>';
	$("#odataRaw").html(dynamicTable);
	$("#entityRawTable tbody").scrollLeft(0);
	$("#entityRawTable tbody").scrollTop(0);
	if(callback != undefined){
		callback();
	}
};

/**
 * The purpose of this method is fetch data for Raw view
 */
dataManagement.prototype.getRawJSONView = function(callback) {
	if(uDataManagement.propertyDetailsList.length > 0){
		$("#dvNoPropertyMsg").css("display","none");
		$("#odataGrid").css("display","none");
		$("#odataRaw").css("display","block");
		uDataManagement.enableGoButton();
		var totalRecordCount = uDataManagement.retrieveRecordCount('');
		if(totalRecordCount > 0){
			 uDataManagement.createTableForRawView(totalRecordCount, callback);
		}else{
			 var noDataRawView = "<div id='dvNoDataJsonView' class='dvNoDataJsonView' style='line-height: 21px;'>"+getUiProps().MSG0366+"</div>";
		     $("#odataRaw").html(noDataRawView);
		     if (sessionStorage.selectedLanguage == 'ja') {
				 $("#dvNoDataJsonView").css('width', '150px');
				 $("#dvNoDataJsonView").addClass('japaneseFont');
			 }
		     if(callback != undefined){
		    	 callback();
		     }
		}
		uDataManagement.setWidthRawView();
	}else{
		$("#dvNoPropertyMsg").css("display","block");
		$("#odataGrid").css("display","none");
		$("#odataRaw").css("display","none");
		uDataManagement.disableGoButton();
		if(callback != undefined){
			callback();
		}
	}
};

/**
 * The purpose of this method is to disable buttons as per Raw view
 */
dataManagement.prototype.disableButtonsForRawView = function() {
	$("#rawBtn").addClass("odataRawIconSelected");
	$("#rawBtn").removeClass("odataRawIconUnselected");
    $("#gridBtn").removeClass("odataGridIconSelected");
    $("#gridBtn").addClass("odataGridIconUnselected");
    $("#editOdata").addClass("editIconWebDav");
    $("#editOdata").removeClass("editIconWebDavEnabled");
    $("#deleteOdata").addClass("deleteIconWebDav");
    $("#deleteOdata").removeClass("deleteIconEnabled");
    objCommon.disableDeleteIcon("#deleteOdata");
    $("#sortWrapperOData").hide();
    $(".paginationWrapperOData").hide();
};

/**
 * The purpose of this method is to enable buttons as per Grid view
 */
dataManagement.prototype.enableButtonsForGridView = function() {
	$("#rawBtn").removeClass("odataRawIconSelected");
    $("#rawBtn").addClass("odataRawIconUnselected");
    $("#gridBtn").removeClass("odataGridIconUnselected");
    $("#gridBtn").addClass("odataGridIconSelected");
    $("#editOdata").addClass("editIconWebDav");
    $("#editOdata").removeClass("editIconWebDavEnabled");
    $("#deleteOdata").addClass("deleteIconWebDav");
    $("#deleteOdata").removeClass("deleteIconEnabled");
    objCommon.disableDeleteIcon("#deleteOdata");
    $("#sortWrapperOData").show();
    $(".paginationWrapperOData").show();
    $("#odataRaw").css("display","none");
   /* $("#btnGrid").addClass("odataNormalButtonBlue");
    $("#btnGrid").removeClass("odataNormalButtonGrey");
    $("#btnRaw").addClass("odataNormalButtonGrey");
    $("#btnRaw").removeClass("odataNormalButtonBlue");
    $("#btnCreateEntity").addClass("createBtn");
    $("#btnCreateEntity").removeClass("createBtnDisabled");
    $("#btnCreateEntity").removeAttr("disabled");
    var noOfSelectedRows = 0;
    var noOfRows = $("#entityTable tbody tr").length;
    for ( var index = 0; index < noOfRows; index++) {
        if ($('#entityChkBox_' + index).is(':checked')) {
            noOfSelectedRows++;
        }
    }
    if (noOfSelectedRows == 1) {
        uDataManagement.enableEditButton();
    } else {
        uDataManagement.disableEditButton();
    }
    if (noOfSelectedRows == 0) {
        objCommon.disableButton('#btnDeleteEntity');
    } else {
        objCommon.enableButton('#btnDeleteEntity');
    }*/
};

/**
 * The purpose of this method is to create Data Grid table on Tab switch.
 * @param callback
 */
dataManagement.prototype.gridTableOnTabSwitch = function(callback){
	 if(uDataManagement.propertyDetailsList.length > 0){
			$("#dvNoPropertyMsg").css("display","none");
			$("#odataGrid").css("display","block");
			sessionStorage.propertiesCount = uDataManagement.propertyDetailsList.length;
			uDataManagement.createHeaderForEntityTable(uDataManagement.propertyDetailsList, false);
			uDataManagement.enableGoButton();
			setTimeout(function(){
				uDataManagement.setHeaderColsWidth();
				$("#entityTable").scrollLeft(0);
				callback();
			},50);
		}else{
			$("#dvNoPropertyMsg").css("display","block");
			$("#odataGrid").css("display","none");
			$("#recordCount_OdataGrid").html("0 - 0 "+getUiProps().MSG0323+" 0");
			uDataManagement.disableGoButton();
			sessionStorage.propertiesCount = 0;
			callback();
		}
	    uDataManagement.setDynamicWidthForODataGrid();
	    $('#entityTable').scroll(function () {
		    $("#entityTable > *").width($("#entityTable").width() + $("#entityTable").scrollLeft());
		    var bodyWidth = $("#entityTable").width();
		    var msgWidth = 133;
			var marginLeftForNoDataMsg = (bodyWidth/2)-(msgWidth/2)+$("#entityTable").scrollLeft();
			$("#dvNoEntityCreated").css("margin-left", marginLeftForNoDataMsg + "px");
		});
};

/**
 * The purpose of this method is to open Raw view
 */
dataManagement.prototype.clickRawTab = function() {
	objCommon.hideListTypePopUp();
	sessionStorage.ODataViewSelectedTab = "raw";
    uDataManagement.disableButtonsForRawView();
    if(sessionStorage.odataView === "odataquery"){
    	var target = document.getElementById('spinner');
    	var spinner = new Spinner(opts).spin(target);
    	setTimeout(function(){
	        var json = sessionStorage.queryData;
	        if(json != ""){
	            json = JSON.parse(sessionStorage.queryData);
	        }
	        if(uDataManagement.propertyDetailsList.length > 0){
	        	var result = true;
	    		$("#dvNoPropertyMsg").css("display","none");
	    		$("#odataGrid").css("display","none");
	    		$("#odataRaw").css("display","block");
	    		uDataManagement.enableGoButton();
	    		var isFormatAtom = uOdataQuery.checkAtomFormat("raw");
				if (isFormatAtom === false) {
					uOdataQuery.resetPagination();
					result = false;
				}
				if(result){
					var isExpandQuery = uOdataQuery.checkExpandQuery();
					if (isExpandQuery === false) {
						var responseResult = uOdataQuery.retrieveAPIResponse(sessionStorage.queryString);
						var response = responseResult[1];
						json = response.bodyAsJson().d.results;
					}
					if(sessionStorage.errorInQuery == "true" && json == ""){
			        	var totalRecordCount = uDataManagement.retrieveRecordCount('');
			        	json = uDataManagement.retrieveChunkedData(0,totalRecordCount);
			        }
		    		uOdataQuery.createRawQueryResponseTable(json, true);
		    		uOdataQuery.setMarginForGenericMsg();
				}
				
				}else{
		    		$("#dvNoPropertyMsg").css("display","block");
		    		$("#odataGrid").css("display","none");
		    		$("#odataRaw").css("display","none");
		    		uDataManagement.disableGoButton();
		        }
	        spinner.stop();
    	}, 50);
    }else if(sessionStorage.odataView === "odataset"){
    	var target = document.getElementById('spinner');
    	var spinner = new Spinner(opts).spin(target);
    	setTimeout(function(){
	    	uDataManagement.getRawJSONView(function(){
	    		spinner.stop();
	    	});
    	}, 50);
    }
   /* uDataManagement.saveSelectedPage("grid");
    if(sessionStorage.odataView === "odataquery"){
        var json = sessionStorage.queryData;
        if(json != ""){
            json = JSON.parse(sessionStorage.queryData);
        }
        uOdataQuery.createRawQueryResponseTable(json, true);
    }else if(sessionStorage.odataView === "odataset"){
        uDataManagement.getRawJSONView();
    }*/
};

/**
 * The purpose of this method is to open Grid view
 */
dataManagement.prototype.clickGridTab = function() {
	sessionStorage.ODataViewSelectedTab = "grid";
		uDataManagement.enableButtonsForGridView();
		 if(sessionStorage.odataView === "odataquery"){
			 var target = document.getElementById('spinner');
			 var spinner = new Spinner(opts).spin(target);
			 setTimeout(function(){
				 if(uDataManagement.propertyDetailsList.length > 0){
						$("#dvNoPropertyMsg").css("display","none");
						$("#odataGrid").css("display","block");
						uDataManagement.enableGoButton();
						var isFormatAtom = uOdataQuery.checkAtomFormat("");
						if (isFormatAtom === false) {
							uOdataQuery.resetPagination();
							spinner.stop();
							return false;
						}
						var isExpandQuery = uOdataQuery.checkExpandQuery();
						if (isExpandQuery === false) {
							uOdataQuery.resetPagination();
							spinner.stop();
							return false;
						}
						uOdataQuery.setMarginForGenericMsg();
						var json = sessionStorage.queryData;
				        if(json != ""){
				            json = JSON.parse(sessionStorage.queryData);
				        }
					    uOdataQuery.checkQueryType(json, true);
					    setTimeout(function(){
							uDataManagement.setHeaderColsWidth();
							$("#entityTable").scrollLeft(0);
						},50);
					    $('#entityTable').scroll(function () {
						    $("#entityTable > *").width($("#entityTable").width() + $("#entityTable").scrollLeft());
						    var bodyWidth = $("#entityTable").width();
						    var msgWidth = 133;
							var marginLeftForNoDataMsg = (bodyWidth/2)-(msgWidth/2)+$("#entityTable").scrollLeft();
							$("#dvNoEntityCreated").css("margin-left", marginLeftForNoDataMsg + "px");
					    });
				 }else{
						$("#dvNoPropertyMsg").css("display","block");
						$("#odataGrid").css("display","none");
						$("#recordCount_OdataGrid").html("0 - 0 "+getUiProps().MSG0323+" 0");
						uDataManagement.disableGoButton();
				 }
				 uDataManagement.setDynamicWidthForODataGrid();
				 spinner.stop();
			 }, 50);
		 }else if(sessionStorage.odataView === "odataset"){
			var target = document.getElementById('spinner');
			var spinner = new Spinner(opts).spin(target);
			uDataManagement.gridTableOnTabSwitch(function(){
				spinner.stop();
			});
		 }
};

/** **************************************** */
/** ** Start - Entity Link - View/Create *** */
/** **************************************** */

/**
 * Open model window for establishing entity link
 */
dataManagement.prototype.openEntityLinkModal = function(id) {
    var objDataMgmt = new dataManagement();
/*    sessionStorage.selectedcell = 'test_3419';
    sessionStorage.boxName = 'test_1';
    sessionStorage.collectionName = 'Odata5';*/
    $('#EntityLinkModal').fadeIn(1000);
    var winH = $(window).height();
    var winW = $(window).width();
    $('#chkELSelectall').attr('checked', false);
    $('#textId').val('');
    $("#entityLinkDialog").css('top', winH / 2 - $("#entityLinkDialog").height() / 2); 
    $("#entityLinkDialog").css('left', winW / 2 - $("#entityLinkDialog").width() / 2);
    sessionStorage.selectedPropId = id;
    var entityNames = objDataMgmt.fetchEntities();
    objDataMgmt.bindEntityTypeDD(entityNames);
    objDataMgmt.createEntityLinkTable();
    document.getElementById("validationMessageArea").innerHTML = "";
    document.getElementById("validationMessageArea1").innerHTML = "";
    uDataManagement.entityLinkPopUpRemoveStatusIcons("#textId");
    $("#entityTypeDD").focus();
};

dataManagement.prototype.fetchEntities = function() {
    var objDataMgmt = new dataManagement();
    var response = objDataMgmt.getEntityTypes();
    if (response != undefined) {
        var JSONstring = response.rawData;
        var totalRecordsize = null;
        var sortedJSONString = null;
        var entityNames = new Array();
        var updatedDate = new Array();
        if (JSONstring.length > 0) {
            sortedJSONString = objCommon.sortByKey(JSONstring, '__updated');
            totalRecordsize = sortedJSONString.length;
        }
        sessionStorage.entityTypeCount = totalRecordsize;
        for ( var count = 0; count < totalRecordsize; count++) {
            var obj = sortedJSONString[count];
            entityNames[count] = obj.Name;
            updatedDate[count] = obj.__updated;
        }
        return entityNames;
    }
    return null;
};

/**
 * retrieve and return entity types against cellName, boxName and collectionName
 */
dataManagement.prototype.getEntityTypes = function() {
    sessionStorage.entityTypeCount = 0;
    //var objOdataCommon = new odataCommon();
    var baseUrl = getClientStore().baseURL;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }
    var cellName = sessionStorage.selectedcell;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var boxName = sessionStorage.boxName;
    var colName = sessionStorage.collectionName;
    var path = sessionStorage.selectedCollectionURL;//baseUrl + cellName + "/" + boxName + "/" + colName;
    var objjDCCollection = new _pc.PersoniumCollection(accessor, path);
    var objEntityTypeManager = new _pc.EntityTypeManager(accessor,
            objjDCCollection);
    return objEntityTypeManager.retrieve('');
};

/**
 * This method is responsible of binding entityTypeDD dropdown with retrieved
 * entity type list
 */
dataManagement.prototype.bindEntityTypeDD = function(entityNames) {
    var select = document.getElementById("entityTypeDD");
    select.options.length = 0;
    var newOption = document.createElement('option');
    newOption.value = 0;
    newOption.innerHTML = getUiProps().MSG0405;
    select.insertBefore(newOption, select.options[-1]);
    for ( var count = 0; (entityNames != null && entityNames.length > 0 && count < entityNames.length); count++) {
        // if(currentSelectedEType != entityNames[count]){
        var newOption = document.createElement("option");
        var name = entityNames[count];
        var shorterName = objCommon.getShorterEntityName(name);
        newOption.text = shorterName;
        newOption.value = name;
        newOption.title = name;
        select.appendChild(newOption);
        // }
    }
};

/**
 * The purpose of this method is to create dynamic entity link table.
 * 
 * @param count
 * @param entityLinksList
 */
dataManagement.prototype.createEntityLinkRows = function(entityLinksList) {
	var noOfLinkedEntities = entityLinksList.length;
	var dynamicTable = "";
	for ( var index = 0; index < noOfLinkedEntities; index++) {
		var currentEntity = entityLinksList[index][0];
		var entityId = entityLinksList[index][1];
		dynamicTable += '<tr id="elrowid'
				+ index
				+ '" style="" class="registeredServiceDynamicRow" onclick="uDataManagement.linkRowSelect(this,'
				+ index + ',' + noOfLinkedEntities + ');">';
		dynamicTable += '<td style="padding-left: 10px;width:5%"><input id = "elChkBox'
				+ index
				+ '" type = "checkbox" class = "chkClass case cursorHand regular-checkbox big-checkbox" name = "case"/><label for="elChkBox'
				+ index + '" class="customChkbox checkBoxLabel"></label></td>';
		dynamicTable += '<td style="max-width:106px;width:47.5%"><div class="mainTableEllipsis"><label id="LinkEntityTypeName_'
				+ index
				+ '" title="'
				+ currentEntity
				+ '" class="cursorPointer">'
				+ currentEntity
				+ '</label></div></td>';
		dynamicTable += '<td style="max-width:106px;width:47.5%"><div class="mainTableEllipsis"><label id="linkEntityID_'
				+ index
				+ '" title="'
				+ entityId
				+ '" class="cursorPointer">'
				+ entityId + '</label></div></td>';
		dynamicTable += '</tr>';
	}
	var tbody = document.getElementById("tbody");
	tbody.innerHTML = dynamicTable;
};

/**
 * This method is responsible of creating the contents of the table
 */
dataManagement.prototype.createEntityLinkTable = function() {
    /** * Start:Retrieve data */
    var baseUrl = getClientStore().baseURL;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }
    var cellName = sessionStorage.selectedcell;
    var boxName = sessionStorage.boxName;
    var colName = sessionStorage.collectionName;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
 //   var objEntityType = new entityTypeOperations();
    var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
    //var entityTypeName = 'test';
    var userDataId = sessionStorage.selectedPropId;
    var sessionCollectionURL = sessionStorage.selectedCollectionURL;
    if (!sessionCollectionURL.endsWith("/")) {
    	sessionCollectionURL += "/";
    }
    var path = /*baseUrl + cellName + "/" + boxName + "/" + colName + "/"
    +*/ sessionCollectionURL + entityTypeName;
    var objjEntity = new _pc.Entity(accessor, path);
    var objEntityLinkManager = new _pc.EntityLinkManager(accessor, objjEntity);
    var objDataMgmt = new dataManagement();
    var entityNames = objDataMgmt.fetchEntities();
    var entityLinksList = new Array();
    var counter = 0;
    if (entityNames != null && entityNames.length > 0) {
        for ( var countE = 0; countE < entityNames.length; countE++) {
            var currentEntity = entityNames[countE];
            // if(currentEntity!=entityTypeName){
            var uri = path + "('" + userDataId + "')/_" + currentEntity;
            var response = objEntityLinkManager.get(uri);
            if (response.getStatusCode() == 200) {
                var responseBody = response.bodyAsJson();
                var json = responseBody.d.results;
                var recordSize = json.length;
                if (recordSize > 0) {
                    for ( var count = 0; count < recordSize; count++) {
                        var obj = json[count];
                        var entityId = obj.__id;/*objCommon.getPropertyFromURI(obj.__metadata.uri,
                                currentEntity);*/
                        entityLinksList[counter] = [];
                        entityLinksList[counter][0] = currentEntity;
                        entityLinksList[counter][1] = entityId;
                        counter = counter + 1;
                    }
                }
            }
            // }
        }
    }

	$("#tbody").empty();
	$("#dvNoEntityLink").show();
	$("#mtable").css('border-bottom','none');
    $("#chkELSelectall").attr('disabled', true);
    if (entityLinksList.length > 0) {
    	$("#dvNoEntityLink").hide();
        uDataManagement.createEntityLinkRows(entityLinksList);
        $("#chkELSelectall").attr('disabled', false);
        $("#mtable tbody tr:last td").css('border-bottom','none');
        $("#mtable").css('border-bottom','1px solid #e6e6e6');
    }
    $("#deleteEntityLink").removeClass("deleteIconEnabled");
    $("#deleteEntityLink").addClass("deleteIconDisabled");
    $("#deleteEntityLink").attr('disabled', true);
    /** End:Retrieve Data */

};

/**
 * This method is responsible of binding entityTypeDD dropdown with retrieved
 * entity type list
 * {Cell_name}/{Box_name}/{Collection_name}/{EntityType_name}('{usedata_id}')/$links/_{EntityType_name}
 */
dataManagement.prototype.addLink = function() {
	uDataManagement.entityLinkPopUpRemoveStatusIcons("#textId");
    var dropDown = document.getElementById("entityTypeDD");
    var textField = document.getElementById("textId");
    var validationArea = document.getElementById("validationMessageArea");
    var validationArea1 = document.getElementById("validationMessageArea1");
    var selectedEntityTypeName = null;
    var targetId = null;
    if (dropDown.selectedIndex == 0) {
    	uDataManagement.entityLinkPopUpRemoveStatusIcons("#textId");
    	validationArea.innerHTML = getUiProps().MSG0386;
        validationArea1.innerHTML = "";
    } else if (textField.value == null || textField.value == ""
        || textField.value.trim() == "") {
    	validationArea.innerHTML = "";
        validationArea1.innerHTML = getUiProps().MSG0388;
        uDataManagement.entityLinkPopUpErrorIcon("#textId");
        
    } else if (textField.value.length > 128) {
    	validationArea.innerHTML = "";
        validationArea1.innerHTML = getUiProps().MSG0143;
        uDataManagement.entityLinkPopUpErrorIcon("#textId");
    } else {
    	uDataManagement.entityLinkPopUpValidIcon("#textId");
        document.getElementById("validationMessageArea").innerHTML = "";
        selectedEntityTypeName = dropDown.value;
        targetId = textField.value;
        validationArea.innerHTML = "";
        validationArea1.innerHTML = "";
        var cellName = sessionStorage.selectedcell;
        var boxName = sessionStorage.boxName;
        var colName = sessionStorage.collectionName;
  //      var objEntityType = new entityTypeOperations();
        var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
        var sessionCollectionURL = sessionStorage.selectedCollectionURL;
        if (!sessionCollectionURL.endsWith("/")) {
        	sessionCollectionURL += "/";
        }
        var userDataId = sessionStorage.selectedPropId;
        var baseUrl = getClientStore().baseURL;
        if (!baseUrl.endsWith("/")) {
            baseUrl += "/";
        }
        var accessor = objCommon.initializeAccessor(baseUrl, cellName);
        var path = sessionCollectionURL + entityTypeName;//baseUrl + cellName + "/" + boxName + "/" + colName + "/" + entityTypeName;
        var objjEntity = new _pc.Entity(accessor, path);
        var objEntityLinkManager = new _pc.EntityLinkManager(accessor, objjEntity);
        var body = {};
        
        var targetURI =/* baseUrl + cellName + "/" + boxName + "/" + colName
        + "/"*/sessionCollectionURL + selectedEntityTypeName + "('" + targetId + "')";
        var sourceURI = path + "('" + userDataId + "')/$links/_"
        + selectedEntityTypeName;
        body["uri"] = targetURI;
        var response = "";
        try {
        	response = objEntityLinkManager.create(sourceURI, body);
        } catch (exception){
        	response = exception.message;
        }
        uDataManagement.displayStatusOnRibbon(response);
    }
};

/**
 * display response status on Ribbon
 */
dataManagement.prototype.displayStatusOnRibbon = function(response) {
    var ribbontimeout = '5000';
    if (response instanceof Object && (response.getStatusCode() == 204 || response.getStatusCode() == 200)) {
        uDataManagement.createEntityLinkTable();
        addSuccessClass('#entityLinkMessageIcon');
        uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#entityLnkMessageBlock');
        document.getElementById("entityLinkSuccessMsg").innerHTML = getUiProps().MSG0375;
    } else if (response instanceof Object && response.getStatusCode() == 409) {
    	addErrorClass('#entityLinkMessageIcon');
    	uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#entityLnkMessageBlock');
        document.getElementById("entityLinkSuccessMsg").innerHTML = getUiProps().MSG0376;
    } else {
    	addErrorClass('#entityLinkMessageIcon');
        if (JSON.stringify(response).indexOf("No such association") != -1) {
        	uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#entityLnkMessageBlock');
            document.getElementById("entityLinkSuccessMsg").innerHTML = getUiProps().MSG0377;
        } else {
        	uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#entityLnkMessageBlock');
            document.getElementById("entityLinkSuccessMsg").innerHTML = getUiProps().MSG0378;
        }
    }
    $("#entityTypeDD").val('');
    $("#textId").val('');
    $("#chkELSelectall").attr('checked', false);
    uDataManagement.entityLinkPopUpRemoveStatusIcons("#textId");
    uDataManagement.centerAlignRibbonMessage("#entityLnkMessageBlock");
    objCommon.autoHideAssignRibbonMessage("entityLnkMessageBlock");
};
/**
 * The purpose of this function is to add successfulWrapper and successfulIcon
 * class after removing all the added classes.
 */
dataManagement.prototype.addSuccessClass = function() {
    $("#messageWrapperPopUp").removeClass("errorWrapper");
    $("#messageWrapperPopUp").removeClass("partialSuccessfulWrapper");
    $("#messageWrapperPopUp").addClass("successfulWrapper");
    $("#messageIconPopUp").removeClass("errorIcon");
    $("#messageIconPopUp").removeClass("partialSuccessfulIcon");
    $("#messageIconPopUp").addClass("successfulIcon");
};

/**
 * The purpose of this function is to add errorWrapper and errorIcon class after
 * removing all the added classes.
 */
dataManagement.prototype.addErrorClass = function() {
    $("#messageWrapperPopUp").removeClass("successfulWrapper");
    $("#messageWrapperPopUp").removeClass("partialSuccessfulWrapper");
    $("#messageWrapperPopUp").addClass("errorWrapper");
    $("#messageIconPopUp").removeClass("successfulIcon");
    $("#messageIconPopUp").removeClass("partialSuccessfulIcon");
    $("#messageIconPopUp").addClass("errorIcon");
};

/**
 * The purpose of this function is to set the style to "inline" for all child
 * div(s) of messageBlock div.
 */
dataManagement.prototype.inlineMessageBlock = function() {
    document.getElementById("messageBlockPopUp").style.display = "inline-block";
    document.getElementById("messageWrapperPopUp").style.display = "inline-block";
    document.getElementById("messageIconPopUp").style.display = "inline-block";
    document.getElementById("entityLinkSuccessMsg").style.display = "inline-block";
};

dataManagement.prototype.hideMessage = function() {
    document.getElementById("messageBlockPopUp").style.display = "none";
};

/**
 * The purpose of this function is to close popup model
 */
function closeEntityModal(modelId) {
    $(modelId).hide();
};
/** **************************************** */
/** ** End - Entity Link - View/Create *** */
/** **************************************** */

/**
 * The purpose of this method is to perform row select functionality on entity
 * link popup
 * 
 * @param obj
 * @param count
 * @param noOfRecords
 */
dataManagement.prototype.linkRowSelect = function(obj, count, noOfRecords) {
    var noOfSelectedRows = 0;
    if (event.target.tagName.toUpperCase() !== "INPUT") {
           if ($(event.target).is('.customChkbox')  && event.target.tagName.toUpperCase() === "LABEL") {
     var obj = $('#elrowid' + count);
     if ($('#elChkBox' + count).is(':checked')) {
         obj.removeClass('selectRow');
         $('#elChkBox' + count).attr('checked', true);
      }else{
            obj.addClass('selectRow');
          $('#elChkBox' + count).attr('checked', false);
      }
 } else {
     var obj = $('#elrowid' + count);
     obj.siblings().removeClass('selectRow');
     obj.addClass('selectRow');
     for(var index = 0; index < noOfRecords; index++){
         if(index!=count){
            $('#elChkBox' + index).attr('checked', false);
         }
     }
     $('#elChkBox' + count).attr('checked', true);
     $("#chkELSelectall").attr('checked', false);
 }
    }
 for ( var index = 0; index < noOfRecords; index++) {
     if ($('#elChkBox' + index).is(':checked')) {
         noOfSelectedRows++;
     }
 }
 if (noOfSelectedRows > 0) {
     $("#deleteEntityLink").removeClass("deleteIconDisabled");
     $("#deleteEntityLink").addClass("deleteIconEnabledServiceRegistration");
     $("#deleteEntityLink").attr('disabled', false);
 } else {
     $("#deleteEntityLink").addClass("deleteIconDisabled");
     $("#deleteEntityLink").removeClass("deleteIconEnabledServiceRegistration");
     $("#deleteEntityLink").attr('disabled', true);
 }
 if (noOfSelectedRows != noOfRecords) {
     $("#chkELSelectall").attr('checked', false);
 } else {
     $("#chkELSelectall").attr('checked', true);
 }
};


/**
 * The purpose of this method is to select all checkboxes on entity link popup
 * @param cBox
 */
dataManagement.prototype.checkAllLinks = function(cBox) {
    var noOfRows = $("#mtable tbody tr").length;
    if (cBox.checked == true) {
        for ( var index = 0; index < noOfRows; index++) {
            var obj = $('#elrowid' + index);
            obj.addClass('selectRow');
            $('#elChkBox' + index).attr('checked', true);
        }
        $("#deleteEntityLink").removeClass("deleteIconDisabled");
        $("#deleteEntityLink").addClass("deleteIconEnabledServiceRegistration");
        $("#deleteEntityLink").attr('disabled', false);
    } else {
        for ( var index = 0; index < noOfRows; index++) {
            var obj = $('#elrowid' + index);
            obj.removeClass('selectRow');
            $('#elChkBox' + index).attr('checked', false);
        }
        $("#deleteEntityLink").addClass("deleteIconDisabled");
        $("#deleteEntityLink").removeClass("deleteIconEnabledServiceRegistration");
        $("#deleteEntityLink").attr('disabled', true);
    }
};

/**
 * The purpose of this method is to get the list of selected entities
 */
dataManagement.prototype.getSelectedLinkedEntities = function() {
    var noOfLinkedEntities = $("#mtable tbody tr").length;
    var linkedEntityList = new Array();
    var counter = 0;
    for ( var index = 0; index < noOfLinkedEntities; index++) {
        if ($("#elChkBox" + index).is(':checked')) {
            linkedEntityList[counter] = [];
            linkedEntityList[counter][0] = $("#LinkEntityTypeName_" + index).text();
            linkedEntityList[counter][1] = $("#linkEntityID_" + index).text();
            counter = counter + 1;
        }
    }
    return linkedEntityList;
};

/**
 * The purpose of this method is to perform operations after deleting an entity link
 * @param totalSelectedLinks
 * @param deletedLinks
 */
dataManagement.prototype.performPostEntityLinkDeleteOperations = function(
        totalSelectedLinks, deletedLinks) {
    closeEntityModal("#entityLinkDeleteModalWindow");
    uDataManagement.createEntityLinkTable();
    var ribbontimeout = '10000';
    if (totalSelectedLinks == deletedLinks) {
        addSuccessClass('#entityLinkMessageIcon');
        uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#entityLnkMessageBlock');
        //inlineMessageBlock(210,'#entityLnkMessageBlock');
        document.getElementById("entityLinkSuccessMsg").innerHTML = deletedLinks
        + " " + getUiProps().MSG0379;
        uDataManagement.centerAlignRibbonMessage("#entityLnkMessageBlock");
        objCommon.autoHideAssignRibbonMessage("entityLnkMessageBlock");
    } else if (deletedLinks == 0) {
    	addErrorClass('#entityLinkMessageIcon');
    	uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#entityLnkMessageBlock');
    	//inlineMessageBlock(260,'#entityLnkMessageBlock');
        document.getElementById("entityLinkSuccessMsg").innerHTML = (totalSelectedLinks - deletedLinks)
        + " " + getUiProps().MSG0380;
        uDataManagement.centerAlignRibbonMessage("#entityLnkMessageBlock");
        objCommon.autoHideAssignRibbonMessage("entityLnkMessageBlock");
    } else {
    	addErrorClass('#entityLinkMessageIcon');
    	uRegisterFileAsService.inlineMessageBlockOfPopup(0,'#entityLnkMessageBlock');
    	//inlineMessageBlock(300,'#entityLnkMessageBlock');
        document.getElementById("entityLinkSuccessMsg").innerHTML = deletedLinks
        + " " +getUiProps().MSG0323 + " "+ totalSelectedLinks + getUiProps().MSG0379;
        uDataManagement.centerAlignRibbonMessage("#entityLnkMessageBlock");
        objCommon.autoHideAssignRibbonMessage("entityLnkMessageBlock");
    }
    $("#entityTypeDD").val('');
    $("#textId").val('');
    $("#chkELSelectall").attr('checked', false);
};

/**
 * The purpose of this method is to delete an entity link
 * @param path
 * @param entityTypeNameLink
 * @param entityIDLink
 * @param accessor
 */
dataManagement.prototype.deleteEntityLink = function(path, entityTypeNameLink,
        entityIDLink, accessor) {
    path = path + entityTypeNameLink;
    var objjEntityLink = new _pc.EntityLink(accessor, path);
    var objEntityLinkManager = new _pc.EntityLinkManager(accessor, objjEntityLink);
    var promise = objEntityLinkManager.del(entityIDLink, "*");
    if (promise.resolvedValue.status == 204) {
        uDataManagement.linksDeleted += 1;
    }
};

/**
 * The purpose of this method is to delete all the selected entity links
 */
dataManagement.prototype.clickDeleteEntityLink = function() {
    showDynamicSpinner("modalSpinnerDataManagement",-250,-50);
    uDataManagement.linksDeleted = 0;
    var baseUrl = getClientStore().baseURL;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }
    var cellName = sessionStorage.selectedcell;
    var boxName = sessionStorage.boxName;
    var colName = sessionStorage.collectionName;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
 //   var objEntityType = new entityTypeOperations();
    var entityTypeName = uEntityTypeOperations.getSelectedEntityType();
    var selectedEntityID = sessionStorage.selectedPropId;
    var selectedLinkedEntitiesList = uDataManagement.getSelectedLinkedEntities();
    var noOfSelectedEntities = selectedLinkedEntitiesList.length;
    for ( var index = 0; index < noOfSelectedEntities; index++) {
        var entityTypeNameLink = selectedLinkedEntitiesList[index][0];
        var entityIDLink = selectedLinkedEntitiesList[index][1];
        var sessionCollectionURL = sessionStorage.selectedCollectionURL;
        if (!sessionCollectionURL.endsWith("/")) {
        	sessionCollectionURL += "/";
        }
        var path = /*baseUrl + cellName + "/" + boxName + "/" + colName + "/"
        +*/ sessionCollectionURL + entityTypeName + "('" + selectedEntityID + "')" + "/$links/_";
        uDataManagement.deleteEntityLink(path, entityTypeNameLink,
                entityIDLink, accessor);
    }
    removeSpinner("modalSpinnerDataManagement");
    uDataManagement.performPostEntityLinkDeleteOperations(noOfSelectedEntities,
            uDataManagement.linksDeleted);
};

/**
 * The purpose of this method is to fetch the property names from the header.
 * @returns {Array}
 */
dataManagement.prototype.getProperties = function(){
    var noOfCols = $("#entityTable thead tr th").length;
    var headerNames = new Array();
    for(var index = 0; index < (noOfCols-6); index++){
        headerNames.push($("#propText_"+index).text());
    }
    return headerNames;
};
/* Apply the Stylesheet on Fixed column*/
dataManagement.prototype.applyFixedColumnStyleSheet = function () {
    $('.fht-fixed-column input[type=checkbox]').css('margin-left','11px');
    $('.fht-fixed-column tr').css('height', '30px');
    $('.fht-fixed-column td').css('height', '30px');
    $('.fht-fixed-column td').css('border', '1px solid #dfdfdf');
    $('fht-fixed-column tbody td').css('border','1px solid #dfdfdf');
    $('.fht-fixed-column').css('width', '61px');

    $('.fht-fixed-column tr:even').css('background-color', '#F4F4F4');
    $('.fht-fixed-column tr:odd').css('background-color', '#FFFFFF');
    $('.fht-fixed-column .fht-thead').css('border-right', '1px solid white');
    $('.fht-fixed-column .fht-tbody').css('border-right', '1px solid #dfdfdf');

    /* Control the height of the Div */
    if (sessionStorage.totalRecordsOnDataGrid < 9) {
        $('.fht-fixed-column .fht-tbody').css('height', 31 * sessionStorage.totalRecordsOnDataGrid);
    }
};
/***************************************************
 * ENTITY DELETE - GRID STARTS
 ***************************************************/

/**
 * The purpose of the following method is to delete Entity.
 * @param entityTypeID
 */
dataManagement.prototype.deleteEntity = function(entityTypeID,count) {
    var objEntityManager = this.initializeEntityManager();
    var promise = objEntityManager.del(entityTypeID, "*");
    if (promise.resolvedValue != null && promise.resolvedValue.status == 204) {
    	isDeleted = true;
    	this.sbSuccessful += entityTypeID + ",";
    } else if (promise.errorMessage != null && promise.errorMessage.status == 409) {
        this.sbConflict += entityTypeID + ",";
        arrDeletedConflictCount.push(count);
    }
};

/*
 * The purpose of the following method is to delete multiple records.
 */
dataManagement.prototype.deleteMultipleRecords = function() {
	var selectedRecords = objCommon.getMultipleSelections('entityTable',
			'input', 'case');
	var arrEntity = selectedRecords.split(',');
	var etagIDOfPreviousRecord = "txtHiddenEntityEtagId";
	var arrEtag = [];
	var etagValue = '';
	var tableID = $('#entityTable');
	var idCheckAllChkBox = "#headerChkBox";
	if (!$(idCheckAllChkBox).is(':checked')) {
		etagValue = objCommon.fetchEtagOfPreviousRecord(etagIDOfPreviousRecord,
				arrEtag, "#entityChkBox_0", "#entityTableBody");
	}
	for (var count = 0; count < arrEntity.length; count++) {
		uDataManagement.deleteEntity(arrEntity[count], count);
	}
	var recordCount = uDataManagement.retrieveRecordCount(); 
	var type = "OdataGrid";
	objCommon.populateTableAfterDelete(etagValue, arrDeletedConflictCount,
			arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, type, tableID,
			'', recordCount, uDataManagement, isDeleted);
	// uDataManagement.getEntityList(uDataManagement.propertyDetailsList,true);
	setTimeout(function() {
		uDataManagement.setHeaderColsWidth();
	}, 50);
	uDataManagement.setDynamicWidthForODataGrid();
	this.showDeleteMessage();
	uDataManagement.resetButtonsAndCheckBox();
};
 
/**
 * Following method displays message after deletion opertaion - Entity from the
 * grid.
 */
dataManagement.prototype.showDeleteMessage = function() {
	$('input:checkbox').removeAttr('checked');
	objCommon.disableDeleteIcon("#deleteOdata");
	this.sbSuccessful = this.sbSuccessful.substring(0,
			this.sbSuccessful.length - 1);
	this.sbConflict = this.sbConflict.substring(0, this.sbConflict.length - 1);
	var message = '';
	//Success Case
	if (this.sbSuccessful.length > 0 && this.sbConflict.length < 1) {
		message = entityCount(this.sbSuccessful)
				+ " " + getUiProps().MSG0372;
		objCommon.displaySuccessMessage(message,
				'#multipleEntityDeleteModalWindow', "221px", "crudOperationMessageBlock");
	//Faliure Case
	} else if (this.sbSuccessful.length < 1 && this.sbConflict.length > 0) {
		message = entityCount(this.sbConflict)
				+ " "+getUiProps().MSG0373;
		objCommon.displayErrorMessage(message,
				'#multipleEntityDeleteModalWindow', "203px", "crudOperationMessageBlock");
	//Mixed - Conflict Case
	} else if (this.sbSuccessful.length > 0 && this.sbConflict.length > 0) {
		message = entityCount(this.sbSuccessful)
				+ " " + getUiProps().MSG0323 + " "
				+ (entityCount(this.sbConflict) + entityCount(this.sbSuccessful))
				+ " " + getUiProps().MSG0372;
		objCommon.displayErrorMessage(message,
				'#multipleEntityDeleteModalWindow', "251px", "crudOperationMessageBlock");
	}
	this.sbSuccessful = "";
	this.sbConflict = "";
};

/**
 * The purpose of this method is to show valid value icon in input text box
 * of entity link popup.
 * @param txtID
 */
dataManagement.prototype.entityLinkPopUpValidIcon = function (txtID) {
	$(txtID).removeClass("errorIconEntityLink");
	$(txtID).addClass("successIconEntityLink");
};

/**
 * The purpose of this method is to show error value icon in input text box
 * of entity link popup.
 * @param txtID
 */
dataManagement.prototype.entityLinkPopUpErrorIcon = function (txtID) {
	$(txtID).removeClass("successIconEntityLink");
	$(txtID).addClass("errorIconEntityLink");	
};

/**
 * The purpose of this method is to hide error/success icon in input text box
 * of entity link popup.
 * @param txtID
 */
dataManagement.prototype.entityLinkPopUpRemoveStatusIcons = function(txtID){
	$(txtID).removeClass("successIconEntityLink");	
	$(txtID).removeClass("errorIconEntityLink");
};

/**
 * Follwing mthod removes error/valid icons from the textbox.
 * @param txtID textBoxID
 */
dataManagement.prototype.removeStatusIcons = function(txtID){
	$(txtID).removeClass("errorIcon");	
	$(txtID).removeClass("validValueIcon");
};

/**
 * Following method validates entity while creating/editing entities.
 * @param edit Flag that determines if the request is for Edit or Create.
 * @param index Index of the element for which the validations are being run.
 * @returns {Boolean} True/False.
 */
dataManagement.prototype.validateFieldsPerTypeOnBlur = function(edit,index) {
    var elem = "";
    var time = "";
    if (!edit) {
        elem = "#rowVal_";
        time = "#timeVal_";
        objCommon.setHTMLValue("rowValErrorMsg_" + index,'');
        uDataManagement.removeStatusIcons(elem + index);
    } else {
        elem = "#rowValEdit_";
        time = "#timeValEdit_";
        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,'');
        uDataManagement.removeStatusIcons(elem + index);
    }
    var result = true;
    var MAXLENGTH = 128;
    var MINLENGTH = 1;
        if ($("#colType_" + index).text() == "Edm.String"
            && $("#colCollection_" + index).text() != "List") {
            var lenField = $(elem + index).val().length;
            MAXLENGTH = 51200;
            if ($("#colNullable_" + index).text() == "false") {
            	if (lenField < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                     // $("#rowValEdit_" + index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                    } else {
                    //$("#rowVal_" + index).focus();
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0115);
                    }
                   // break;
                }
            }
            if (lenField > MAXLENGTH) {
                result = false;
                if (edit) {
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0114);
                	//$("#rowValEdit_" + index).focus();
                   // break;
                }
                else {
                 //$("#rowVal_" + index).focus();
                 objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0114);
                   // break;	
                }
            } 
        }
        if ($("#colType_" + index).text() == "Edm.String"
            && $("#colCollection_" + index).text() == "List") {
        	 if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                       //$("#rowValEdit_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                       //$("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                     //break;
                 }
             }
            if ($.trim($(elem + index).val()) != "") {
                MAXLENGTH = 51200;
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var lenField = list[ind].length;
                   // var valField = list[ind];
                    if (lenField > MAXLENGTH) {
                        result = false;
                        flag = true;
                        if (edit) {
                        //$("#rowValEdit_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0114);
                        break;
                        }
                        else {
                        //$("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0114);
                            break;
                        }
                    } 
                }
                if (flag) {
                    //break;
                }
            }
        }
        if ($("#colType_" + index).text() == "Edm.Int32"
            && $("#colCollection_" + index).text() != "List") {
            //Following regex reads value from [0-9].
            var letters = /^[-+]?[0-9]+$/;
            var lenField = $(elem + index).val().length;
            var valField = $(elem + index).val();
            if ($("#colNullable_" + index).text() == "false") {
            	if (lenField < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                    	//$("#rowValEdit_" + index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                      uDataManagement.showErrorIcon("#rowValEdit_"+index);
                    } else {
                        //$("#rowVal_" + index).focus();
	                    objCommon.setHTMLValue("rowValErrorMsg_" + index,
	                            getUiProps().MSG0115);
	                	uDataManagement.showErrorIcon("#rowVal_"+index);
                    }
                    //break;
                }
            }
            if (valField < -2147483648 || valField > 2147483647) {
                result = false;
                if (edit) {
                  objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0075);
                  //  break;
                } else {
                   objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0075);
                //    break;	
                }
            } else if (lenField != 0 && !(valField.match(letters))) {
                result = false;
                if (edit) {
                objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                            getUiProps().MSG0076);
                //    break;	
                }
                else {
                    objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0076);
                //    break;
                }
                
            }
            if(!result){
            	if(edit){
                   //$("#rowValEdit_"+index).focus();
                    uDataManagement.showErrorIcon("#rowValEdit_"+index);
                   }else{
                    //$("#rowVal_" + index).focus();
                    uDataManagement.showErrorIcon("#rowVal_"+index);
               }
             //break;
            }else{
            if(lenField != 0){
                if(edit){
                		uDataManagement.showValidValueIcon("#rowValEdit_"+index);
                	}else{
                		uDataManagement.showValidValueIcon("#rowVal_"+index);
                	}
            	}
            }
        }
        if ($("#colType_" + index).text() == "Edm.Int32"
            && $("#colCollection_" + index).text() == "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                    	 //$("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                    	 //$("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                     //break;
                 }
             }
            if ($.trim($(elem + index).val()) != "") {
              //Following regex reads value from [0-9] and comma.
                var listLetters = /^[-+]?[0-9,、]+$/;
              //Following regex reads value from [0-9].
                var letters = /^[-+]?[0-9]+$/;
                if (!($(elem + index).val().match(listLetters))) {
                    result = false;
                    if (edit) {
                    	//$("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0112);
                       // break;
                    }
                    else {
                    	//$("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                       // break;
                    }
                }
                var data = $(elem + index).val();
                if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                    	//$("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0112);
                       // break;
                    } else {
                    	//$("#rowVal_" + index).focus();
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                      //  break;
                    }
                }
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var lenField = list[ind].length;
                    var valField = list[ind];
                    if (valField < -2147483648 || valField > 2147483647) {
                        result = false;
                        flag = true;
                        if (edit) {
                        //$("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0075);
                       // break;
                        }
                        else {
                        //$("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0075);
                         //   break;
                        }
                    } else if (lenField != 0 && !(valField.match(letters))) {
                        result = false;
                        flag = true;
                       if (edit) {
                       //$("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0076);
                         //  break;
                       }
                       else {
                       //$("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                   getUiProps().MSG0076);
                        //   break;   
                       }
                        
                    }
                }
                if (flag) {
                   // break;
                }
            }
        }
        if ($("#colType_" + index).text() == "Edm.Single"
            && $("#colCollection_" + index).text() != "List") {
           //Following regex reads value from [0-9] and decimal.
            var letters = /^[-+]?[0-9]*\.?[0-9]+$/;
            var lenField = $(elem + index).val().length;
            var valField = $(elem + index).val();
            if ($("#colNullable_" + index).text() == "false") {
            	if (lenField < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                    //$("#rowValEdit_"+index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                      uDataManagement.showErrorIcon("#rowValEdit_"+index);
                    } else {
                    //$("#rowVal_" + index).focus();
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0115);
                	uDataManagement.showErrorIcon("#rowVal_"+index);
                    }
                  //  break;
                }
            }
            if (lenField != 0 && !(valField.match(letters))) {
                result = false;
                if (edit) {
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
	                        getUiProps().MSG0080);
                }else{
	                objCommon.setHTMLValue("rowValErrorMsg_" + index,
	                        getUiProps().MSG0080);
                }
              //  break;
            }
            var isValid = uComplexTypeProperty.isTypeSingleValid(valField,
                    lenField);
            if (!isValid) {
                result = false;
                if (edit) {
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
	                        getUiProps().MSG0080);
                }else{
	                objCommon.setHTMLValue("rowValErrorMsg_" + index,
	                        getUiProps().MSG0081);
                }
              //  break;
            }
            if(!result){
               if(edit){
                //$("#rowValEdit_"+index).focus();
                uDataManagement.showErrorIcon("#rowValEdit_"+index);
             }else{
            		//$("#rowVal_" + index).focus();
            		uDataManagement.showErrorIcon("#rowVal_"+index);
            	}
            	//break;
            }else{
            	if(lenField != 0){
            		if(edit){
                		uDataManagement.showValidValueIcon("#rowValEdit_"+index);
                	}else{
                		uDataManagement.showValidValueIcon("#rowVal_"+index);
                	}
            	}
            }
        }
        if ($("#colType_" + index).text() == "Edm.Single"
            && $("#colCollection_" + index).text() == "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                    	 //$("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                     //$("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                    // break;
                 }
             }
            if ($.trim($(elem + index).val()) != "") {
               //Following regex reads value from [0-9], decimal and comma.
                var listLetters = /^[-+0-9\.,、]*$/;
                //Following regex reads value from [0-9] and decimal.
                var letters = /^[-+]?[0-9]*\.?[0-9]+$/;
                if (!($(elem + index).val().match(listLetters))) {
                    result = false;
                   if (edit) {
                	   //$("#rowValEdit_"+index).focus();
                   objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                               getUiProps().MSG0112);
                      // break;
                   } else {
                   objCommon.setHTMLValue("rowValErrorMsg_" + index,
                               getUiProps().MSG0112);
                   //$("#rowVal_" + index).focus();
                      // break;
                   }
                }
                var data = $(elem + index).val();
                if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                    	 //$("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0112);
                      //  break;
                    } else {
                    	 //$("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                      //  break;
                    }
                }
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var lenField = list[ind].length;
                    var valField = list[ind];
                    if (lenField != 0 && !(valField.match(letters))) {
                        result = false;
                        flag = true;
                        if (edit) {
                       	 //$("#rowValEdit_"+index).focus();
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                    getUiProps().MSG0080);
                            break;	
                        } 
                        else {
                        	 //$("#rowVal_" + index).focus();
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0080);
                            break;
                        }
                        
                    }
                    var isValid = uComplexTypeProperty.isTypeSingleValid(
                            valField, lenField);
                    if (!isValid) {
                        result = false;
                        flag = true;
                        if (edit) {
                       	 //$("#rowValEdit_"+index).focus();
                         objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                    getUiProps().MSG0081);
                            break;	
                        }
                      else {
                    		 //$("#rowVal_" + index).focus();
                         objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                  getUiProps().MSG0081);
                          break;   
                        }
                    }
                }
                if (flag) {
                   // break;
                }
            }
        }
        if ($("#colType_" + index).text() == "Edm.DateTime"
            && $("#colCollection_" + index).text() != "List") {
            var lenField = $(elem + index).val().length;
            var valField = $(elem + index).val();
            var bits = valField.split('-');
            var timelenField = $(time + index).val().length;
            
        	if ($("#colNullable_" + index).text() == "false") {
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                    	 //$("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                   	$("#entityColTextVal_" + index).css("width","244px");
                     } else {
                    	 //$("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                   //  break;
                 }
             }
            var MINDATEVALUE = "2000-01-01";
            var MAXDATEVALUE = "3000-01-01";
            // 2000-01-01T00:00:00 3000-01-01T00:00:00
            if (lenField > 0) {
                if (valField < MINDATEVALUE || valField > MAXDATEVALUE) {
                    result = false;
                    if (edit) {
                    	 //$("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0079);
                    	$("#entityColTextVal_" + index).css("width","244px");
                     //   break;	
                    }
                    else {
                    	//$("#rowVal_" + index).focus();
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0079);
                      //  break;
                    }
                } else if (bits[0].length > 4) {
                	if (edit) {
                		result = false;
                		//$("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0079);
                    	$("#entityColTextVal_" + index).css("width","244px");
                      //  break;	
                	} else {
                		result = false;
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0079);
                    //	break;
                	}
                }
            }
            
            if(timelenField > 0){
            	if(lenField == 0){
            		if (edit) {
                		result = false;
                		//$("#rowValEdit_"+index).focus();
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                    			getUiProps().MSG0115);
                    	$("#entityColTextVal_" + index).css("width","244px");
                      //  break;	
                	} else {
                		result = false;
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                    			getUiProps().MSG0115);
                    //	break;
                	}
            	}
            }else if(lenField > 0){
            	if(timelenField == 0){
            		if(edit){
            			var currentDate = new Date();
            			var hours = currentDate.getHours();
            			var minutes = currentDate.getMinutes();
            			var seconds = currentDate.getSeconds();
            			if (minutes < 10) {
            		        minutes = "0" + minutes;
            		    }
            		    if (seconds < 10) {
            		        seconds = "0" + seconds;
            		    }
            		    var currentTime = hours+":"+minutes+":"+ seconds;
            		    var id = "timeValEdit_"+index;
            		    document.getElementById(id).value = currentTime;
            		    } else{
            		    	var currentDate = new Date();
                			var hours = currentDate.getHours();
                			var minutes = currentDate.getMinutes();
                			var seconds = currentDate.getSeconds();
                			if (minutes < 10) {
                		        minutes = "0" + minutes;
                		    }
                		    if (seconds < 10) {
                		        seconds = "0" + seconds;
                		    }
                		    var currentTime = hours+":"+minutes+":"+ seconds;
                		    var id = "timeVal_"+index;
                		    document.getElementById(id).value = currentTime;
            		    }
            	}
            }
            
        }
        if ($("#colType_" + index).text() == "Edm.Boolean"
            && $("#colCollection_" + index).text() != "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		if ($(elem + index).val() == "null") {
                    result = false;
                    if (edit) {
                    	//$("#rowValEdit_"+index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0115);
                     //   break;
                    }
                    else {
                    	//$("#rowVal_" + index).focus();
                    	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0115);
                     //   break;
                    }
                }
             }
        }
        if ($("#colType_" + index).text() == "Edm.Boolean"
            && $("#colCollection_" + index).text() == "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                    	 //$("#rowValEdit_"+index).focus();
                       objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                   getUiProps().MSG0115);
                     } else {
                       //$("#rowVal_" + index).focus();
                       objCommon.setHTMLValue("rowValErrorMsg_" + index,
                             getUiProps().MSG0115);
                     }
                  //   break;
                 }
        	}
        	
            if ($(elem + index).val() != "") {
                var data = $(elem + index).val();
                if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                    	//$("#rowValEdit_"+index).focus();
                    objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                getUiProps().MSG0112);
                      //  break;
                    }
                    else {
                    //$("#rowVal_" + index).focus();
                    objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                getUiProps().MSG0112);
                     //   break;	
                    }
                }
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var valField = list[ind];
                    if (!($.trim(valField) == "true"
                        || $.trim(valField) == "True"
                            || $.trim(valField) == "False"
                                || $.trim(valField) == "false" 
                                    || $.trim(valField) == "")) {
                        result = false;
                        flag = true;
                        if (edit) {
                        	//$("#rowValEdit_"+index).focus();	 $("#rowVal_" + index).focus();
                        	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                    getUiProps().MSG0112);
                            break;	
                        }
                        else {
                        	 //$("#rowVal_" + index).focus();
                        	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                    getUiProps().MSG0112);
                            break;
                        }
                        
                    }
                }
                if (flag) {
                 //   break;
                }
            }
        }
        if ($("#colType_" + index).text() == "Edm.Double"
            && $("#colCollection_" + index).text() != "List") {
            //The following reqex ensures that only the double type is accepted, it also ensures that the value doesn't contain more than one .(decimal)
            var letters = "^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$";
            var lenField = $(elem + index).val().length;
            var valField = $(elem + index).val();
            if ($("#colNullable_" + index).text() == "false") {
            	if (lenField < MINLENGTH || $(elem + index).val() == ""
                    || $(elem + index).val() == undefined) {
                    result = false;
                    if (edit) {
                    	//$("#rowValEdit_"+index).focus();
                      objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                  getUiProps().MSG0115);
                      uDataManagement.showErrorIcon("#rowValEdit_"+index);
                    } else {
                    //$("#rowVal_" + index).focus();
                	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                            getUiProps().MSG0115);
                	 uDataManagement.showErrorIcon("#rowVal_"+index);
                    }
                 //   break;
                }
            }
            if (lenField > 0) {
            if (!(valField.match(letters))) {
	            result = false;
	            if (edit){
	            	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
	                        getUiProps().MSG0221);
	            	//break;
	            }
	            else {
		            objCommon.setHTMLValue("rowValErrorMsg_" + index,
		                        getUiProps().MSG0221);
		            //break;
	            }
            } else if (!objCommon.isTypeDoubleValid(valField)) {
                result = false;
                if (edit) {
                	//$("#rowValEdit_"+index).focus();
                	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                    getUiProps().MSG0219);
                   // break;
                } else {
                	//$("#rowVal_" + index).focus();
                objCommon.setHTMLValue("rowValErrorMsg_" + index,
                   getUiProps().MSG0219);
                  //  break;
                }
            }
            if(!result){
            if(edit){
               //$("#rowValEdit_"+index).focus();
                 uDataManagement.showErrorIcon("#rowValEdit_"+index);
              }else{
                  //$("#rowVal_" + index).focus(); 
                 uDataManagement.showErrorIcon("#rowVal_"+index);
               }
           //  break;
            }else{
            	if(lenField != 0){
            		if(edit){
               		 uDataManagement.showValidValueIcon("#rowValEdit_"+index);
	               	}else{
	            		uDataManagement.showValidValueIcon("#rowVal_"+index);
	               	}
            	}
            }
          }
        }
        if ($("#colType_" + index).text() == "Edm.Double"
            && $("#colCollection_" + index).text() == "List") {
        	if ($("#colNullable_" + index).text() == "false") {
        		var lenField = $(elem + index).val().length;
             	if (lenField < MINLENGTH || $(elem + index).val() == ""
                     || $(elem + index).val() == undefined) {
                     result = false;
                     if (edit) {
                     	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                               getUiProps().MSG0115);
                     } else {
                     	objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                               getUiProps().MSG0115);
                     }
                 }
             }
            if ($.trim($(elem + index).val()) != "") {
               //Following regex reads value from [0-9], decimal and comma.
                var listLetters = /^[-+0-9eE\.,、]*$/;
                //The following reqex ensures that only the double type is accepted
                var letters = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
                if (!($(elem + index).val().match(listLetters))) {
                    result = false;
                    if (edit) {
                    	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                               getUiProps().MSG0112);
                    } else {
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                               getUiProps().MSG0112);
                    }
                }
                var data = $(elem + index).val();
                if (data.lastIndexOf(',') == (data.length - 1) || data.lastIndexOf('、') == (data.length - 1)) {
                    result = false;
                    if (edit) {
                        objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                               getUiProps().MSG0112);
                    } else {
                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                               getUiProps().MSG0112);
                    }
                }
                var list = $(elem + index).val().split(',');
                if($(elem + index).val().indexOf('、') != -1){
                    list = $(elem + index).val().split('、');
                }
                var noOfItems = list.length;
                var flag = false;
                for ( var ind = 0; ind < noOfItems; ind++) {
                    var lenField = list[ind].length;
                    var valField = list[ind];
                    if (lenField > 0) {
                    	if (!(valField.match(letters))) {
	                        result = false;
	                        flag = true;
	                        if (edit){
	                        	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
	                                    getUiProps().MSG0080);
	                        	break;
	                        }
	                        else {
		                        objCommon.setHTMLValue("rowValErrorMsg_" + index,
		                                    getUiProps().MSG0080);
		                        break;
	                        }
                        } else if (!objCommon.isTypeDoubleValid(valField)) {
                            result = false;
                            flag = true;
                            if (edit) {
                            	objCommon.setHTMLValue("rowValErrorEditMsg_" + index,
                                                       getUiProps().MSG0219);
                                break;
                            } else {
                                objCommon.setHTMLValue("rowValErrorMsg_" + index,
                                                       getUiProps().MSG0219);
                               break;
                            }
                        }
                    }
                }
                if (flag) {
                   // break;
                }
            }
        }
//    }
    return result;
};

/**
 * Following method performs validation of ID field on blur event.
 */
dataManagement.prototype.validateRowID = function(){
	uDataManagement.removeStatusIcons("#rowVal_id");
	objCommon.setHTMLValue("rowValErrorMsg_id",'');
	uDataManagement.validateIDField(true);
};

/**
 * Following method retrieves time from EPOC.
 */
dataManagement.prototype.retrieveTimeFromEpochDate = function(epochDate){ 
	if(epochDate!=undefined) {
	    // Epoch Date Conversion
	    var strPublishedDate = epochDate.substring(6, 19);
	    var numPublishedDate = parseInt(strPublishedDate);
	    var objEpochDate = new Date(numPublishedDate);
		var timeStamp = objCommon.getTimeStamp(objEpochDate);
		
	    return timeStamp; 
	  }
	};


	/***********************************************
	 * ENTITY DELETE - GRID ENDS.
	 ***********************************************/
	$(document).ready(function(){
		$("#OdataDataTab").click(function(){
			$("#OdataSchemaTab").removeClass("odataTabSelected");
			$("#OdataSchemaTab").css("color","#1b1b1b");
			$("#OdataDataTab").addClass("odataTabSelected");
			var entityTypeNames = uEntityTypeOperations.entityTypeNames;
			var collectionURL = sessionStorage.selectedCollectionURL;// objOdata.currentCollectionPath;
			uDataManagement.loadDataView(collectionURL, entityTypeNames);
		});
	});

	/**
	 * The purpose of this function is to centre align  success/failure div 
	 * @param errorSuccessdivId
	 */
	dataManagement.prototype.centerAlignRibbonMessage = function(errorSuccessdivId) {
		var width =$("#entityLinkDialog").width();
		var divWidth =$(errorSuccessdivId).width();
		var divHalfWidth = divWidth/2;
		var widthDiff = (width)/2 - divHalfWidth;
		$(errorSuccessdivId).css("left",widthDiff);
	};
	
	/**
	 * Following methodfetches all the enitity json data.
	 * @returns json
	 */
	dataManagement.prototype.retrieveAllEntityJsonData = function() {
		var objEntityManager = uDataManagement.initializeEntityManager();
		var totalRecordCount = uDataManagement.retrieveRecordCount('');
		var json = objEntityManager.query().orderby("__updated desc").top(totalRecordCount).run();
		return json;
	};