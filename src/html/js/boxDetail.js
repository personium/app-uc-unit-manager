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
function boxDetail(){}

var uBoxDetail = new boxDetail();
var collectionLocation = '';
boxDetail.prototype.tabName='';

boxDetail.prototype.getCollectionLocation  = function() {
	return collectionLocation;
};

boxDetail.prototype.setCollectionLocation  = function(path) {
	 collectionLocation = path;
};

/*var isCreateCollectionMenuEnabled = false;*/
/**
 * The purpose of this method is to create URL for the WebDav Collection.
 * @param collectionName
 * @returns {String}
 */
boxDetail.prototype.getCollectionURL  = function(collectionName) {
    var path = sessionStorage.selectedcellUrl;
    if (collectionName.length > 0 ) {
        path += collectionName;
    }
    return path;
};

/**
 * This method sets the initialization view for the Box Detail Root page.
 * @param boxname
 */
boxDetail.prototype.initializePage = function(boxname){
	$("#backBtnTxt").text(boxname);
	$("#backBtnTxt").attr('title',boxname);
	$("#currentDirectoryName").text(boxname);
	$("#currentDirectoryName").attr("title",boxname);
	$("#currentDirectoryIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
	$("#currentDirectoryIcon").css("margin-top","-2px");
	$("#currentDirectoryIcon").css("margin-left","0px");
	$("#dvemptyTableOdataMessageFile").hide();
	if (boxname == getUiProps().MSG0039) {
		$("#exportWebDavWrapper").hide();
	} else {
		$("#exportWebDavWrapper").show();
	}
	//uBoxDetail.createWebDavRootView(boxname);
	uBoxDetail.showRootPropertyBox(boxname);
	sessionStorage.boxName = boxname;
	objOdata.openWebDavCollection();
	objOdata.hidePluginIcons();
};

boxDetail.prototype.showRootPropertyBox = function(boxname) {
	//var collectionPathName = uBoxDetail.getCollectionURL(boxname);
	var mainBoxValue = getUiProps().MSG0039;
	var collectionPathValue = "";
	if(boxname == mainBoxValue){
		collectionPathValue = sessionStorage.selectedcellUrl;
	    collectionPathValue += getUiProps().MSG0293;
	}else{
		collectionPathValue = uBoxDetail.getCollectionURL(boxname);
	}
	uBoxDetail.populatePropertiesList(collectionPathValue, collectionPathValue, boxname, true, "box");
	uBoxAcl.getAclSetting(collectionPathValue, boxname);
	setTimeout(function() {
		uBoxDetail.setDynamicWidth();	
		}, 50);
};


/**
 * The purpose of this method is to open the Box Detail Root page for the
 * particular box.
 * @param boxname
 */
boxDetail.prototype.openBoxDetail = function(boxname, etagstart, etagEnd, createdDate, updatedDate, schema){
//	var id = objCommon.isSessionExist();
	sessionStorage.boxName = boxname;
	objCommon.setCellControlsInfoTabValues(boxname, etagstart, etagEnd, createdDate, updatedDate, schema);
	
//	if (id != null) {
		folderClicked = false;
		$("#mainContent").hide();
		$("#mainContentWebDav").hide();
		sessionStorage.tabName = "Box";
		objOdata.selectedView = "";
		$('#boxdetailContentsTab').addClass("selected");

		var target = document.getElementById('spinner');
		var spinner = new Spinner(opts).spin(target);
		$("#mainContentWebDav").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/boxDetail.html',
				function() {
					$("#webDavContentArea").hide();
					$("#webDavContentArea").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/boxDetailContent.html',
							function(){
								var roleList = uBoxAcl.getRoleListForCell();
								if (roleList != undefined) {
									sessionStorage.roleListAgainstSelectedCell = JSON.stringify(roleList);
								}
								uBoxDetail.initializePage(boxname);
								$("#webDavContentArea").show();
								$("#mainContentWebDav").show();
								var mainBoxValue = getUiProps().MSG0039;
								if (boxname == mainBoxValue) {
									boxname = getUiProps().MSG0293;
								}
								$("#dvBreadCrumBrowse").attr('title', boxname);
								boxHeirarchyPath = boxname;
								spinner.stop();
					});
				});
//	} else {
//		window.location.href = contextRoot;
//	}
};

/**
 * This method is used to load contents tab under WebDAV.
 * @param boxname
 */
boxDetail.prototype.loadBoxContentsTab = function(boxname){
	var id = objCommon.isSessionExist();
	sessionStorage.boxName = boxname;
	if (id != null) {
		sessionStorage.tabName = "Box";
		objOdata.selectedView = "";
		uBoxDetail.applySelectedClassOnTab('#boxdetailContentsTab');
		$("#webDavProfileArea").hide();
		var target = document.getElementById('spinner');
		var spinner = new Spinner(opts).spin(target);
		$("#webDavContentArea").hide();
		$("#tertiaryBar").hide();
		$("#webDavContentArea").load(contextRoot + '/templates/boxDetailContent.html',
				function(){
					uBoxDetail.initializePage(boxname);
					$("#tblBoxBreadCrum").find("tr:gt(0)").remove();
					$("#webDavContentArea").show();
					$("#tertiaryBar").show();
					$("#breadCrumbBar").show();
					/*$("#leftIcons").show();
					$("#rightTertiaryBar").show();*/
					spinner.stop();
		});
	} else {
		window.location.href = contextRoot;
	}
};

/**
 * The purpose of this method is to open the Profile page for the
 * selected Box.
 */
boxDetail.prototype.loadBoxProfileTab = function() {
	var id = objCommon.isSessionExist();

	objOdata.selectedView = "";
	if (id != null) {
		$("#breadCrumbBar").hide();
		uBoxDetail.applySelectedClassOnTab('#boxdetailProfileTab');
		var target = document.getElementById('spinner');
		var spinner = new Spinner(opts).spin(target);
		$("#tertiaryBar").hide();
		$("#webDavContentArea").hide();
		$("#webDavProfileArea").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/cellProfileInfo.html',
				function() {
					objBoxProfile.displayProfileDetails();
					$("#dvBoxEditIcon").show();
					$("#dvCellEditIcon").hide();
					$("#profileLngArea").hide();
					$("#webDavProfileArea").show();
					spinner.stop();
				});
	} else {
		window.location.href = contextRoot;
	}
	uBoxDetail.tabName ='boxProfile';
};

/**
 * The purpose of this method is to open the info page for the
 * selected Box.
 */
boxDetail.prototype.loadBoxInfoTab = function() {
	var id = objCommon.isSessionExist();

	objOdata.selectedView = "";
	if (id != null) {
		$("#breadCrumbBar").hide();
		uBoxDetail.applySelectedClassOnTab('#boxdetailInfoTab');
		var target = document.getElementById('spinner');
		var spinner = new Spinner(opts).spin(target);

		$("#webDavProfileArea").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/cellControlsInfo.html',
				function() {
					$("#tertiaryBar").hide();
					$("#webDavContentArea").hide();
					uBoxDetail.displayBoxInfoDetails();
					$("#webDavProfileArea").show();
					spinner.stop();
				});
	} else {
		window.location.href = contextRoot;
	}
	uBoxDetail.tabName ='boxInfo';
};

/**
 * The purpose of this method is to apply the selected class on tab.
 */
boxDetail.prototype.applySelectedClassOnTab = function(divID) {
	$('#boxdetailContentsTab').removeClass("selected");
	$('#boxdetailInfoTab').removeClass("selected");
	
	$(divID).addClass("selected");
	
};

/**
 * The purpose of this method is to display the Box Info details.
 */
boxDetail.prototype.displayBoxInfoDetails = function() {
	$("#ccName").text(sessionStorage.ccname);
	$("#ccCreatedate").text(sessionStorage.cccreatedat);
	$("#ccUpatedate").text(sessionStorage.ccupdatedat);
	$("#ccEtag").text(sessionStorage.ccetag);
	if (sessionStorage.ccurl && sessionStorage.ccurl != getUiProps().MSG0275) {
		var dispCcURL = objCommon.changeLocalUnitToUnitUrl(sessionStorage.ccurl);
		$("#ccUrl").text(dispCcURL);
		$("#ccUrl").css("display", "block");
	} else {
		$("#ccUrl").css("display", "none");
		$("#ccUrl").siblings(".ContentHeadingpt1").css("display", "none");
	}
};


/**
 * The purpose of this method is to set dynamic widths of various components as per
 * view port size.
 */
boxDetail.prototype.setDynamicWidth = function(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightPanelWidth = width - leftPanelWidth;
	var height = $(window).height();
	var scrollBarWidth = 5;
	if(document.getElementById("webDavBody") != null && document.getElementById("webDavBody") != undefined){
		var tbodyObject = document.getElementById("webDavBody");
		if (tbodyObject.scrollHeight > tbodyObject.clientHeight) {
			scrollBarWidth = 0;
		}
	}
	
	// Back Button Text Ellipsis Width - Start
	var availableWidthForBackBtn = rightPanelWidth - 15 - 14- 10 -20;
	// Back Button Text Ellipsis Width - End
	
	// Secondary Header Bar Min width - Start
	var availableWidthForSecondaryHeader = rightPanelWidth - 15 - 20;
	var contentsWidth = Math.round((7.00325/100)*availableWidthForSecondaryHeader);
	var profileWidth = Math.round((5.86319/100)*availableWidthForSecondaryHeader);
	// Secondary Header Bar Min width - End
	
	// BreadCrumb Bar - Start
	var maxWidthForCurrentDirectoryName = (availableWidthForSecondaryHeader/3) - 5 - 20 - 5 - 70;
	// BreadCrumb Bar - End
	
	// Box name Max width - Start
	var boxDetailContentWidth = (rightPanelWidth - 15 -20);
	var boxDetailTableWidth = (72.31270/100)*boxDetailContentWidth;
	var boxNameDynwidth = Math.round((55.29279/100)*boxDetailTableWidth);
	//Box name Max width - End
	
	// Properties Pane - WebDav Name Max width - Start
	var webDavDetailsWidth = boxDetailContentWidth - boxDetailTableWidth;
	var webDavNameWidth = (webDavDetailsWidth - 20 - 10 - 59 - 10 - 25);
	//Properties Pane - WebDav Name Max width - End
	
	// Properties Pane - WebDav URL Max width - Start
	var webDavPropsWidth = Math.round(((58.5/100)*webDavDetailsWidth) - 10 - 20 -10 - 5 - 1 + scrollBarWidth);
	//Properties Pane - WebDav URL Max width - End
	
	//ACL Settings Max width - Start
	var webDavACLSettingsRoleWidth = Math.round(((42/100)*webDavDetailsWidth) - 3);
	var webDavACLSettingsPrivWidth = Math.round(((58.5/100)*webDavDetailsWidth) - 10 - 20 -10 - 5 - 1 + scrollBarWidth);
	//ACL Settings Max width - End
	
	//Web DAV Details Panel Height - Start
	var fixedHeight = 18+43+27+30+26+23+11+34+42+41;
	var webDavDetailsHeight = (height - fixedHeight);
	//Web DAV Details Panel Height - End
	
	//Web DAV Details ACL Settings section Max Height - Start
	var fixedHeightOtherThanACLSettings = (fixedHeight + 10 + 29 + 10 + 10 + 2);
	var aclSettingsHeight = (height - fixedHeightOtherThanACLSettings);
	//Web DAV Details ACL Settings section Max Height - End
	
	if (width>1280) {
		$(".backBtnTxt").css('max-width', availableWidthForBackBtn + "px");
		$(".data").css('min-width', contentsWidth + "px");
		$(".profile").css('min-width', profileWidth + "px");
		$("#boxNameWebDavRootDv").css("max-width", boxNameDynwidth + "px");
		if(height < 650){
			$("#propsHeadWebDavName").css("max-width", (webDavNameWidth-5) + "px");
		}else{
			$("#propsHeadWebDavName").css("max-width", webDavNameWidth + "px");
		}
		$("#propsInfoURL").css("max-width", webDavPropsWidth + "px");
		$("#propsInfoResourceType").css("max-width", webDavPropsWidth + "px");
		$("#propsInfoContentType").css("max-width", webDavPropsWidth + "px");
		$("#propsInfoCreatedAt").css("max-width", webDavPropsWidth + "px");
		$("#propsInfoUpdatedAt").css("max-width", webDavPropsWidth + "px");
		$("#propsInfoSize").css("max-width", webDavPropsWidth + "px");
		$(".aclSettingsData tbody tr td:nth-child(1)").css("max-width", webDavACLSettingsRoleWidth + "px");
		$("#aclSettingsData .col1 .role").css("max-width",((webDavACLSettingsRoleWidth/2)-11) + "px");
		$("#aclSettingsData .col1 .box").css("max-width",((webDavACLSettingsRoleWidth/2)-11) + "px");
		$(".aclSettingsData tbody tr td:nth-child(2)").css("max-width", webDavACLSettingsPrivWidth + "px");
		$("#leftBreadCrumbBar").css("width",(maxWidthForCurrentDirectoryName - 100)  +"px");
		$("#currentDirectoryName").css("max-width", (maxWidthForCurrentDirectoryName - 130)+ "px");
		$("#leftBreadCrumbBar").css("margin-right","40px");
	}else{
		$(".backBtnTxt").css('max-width', "1204px");
		$(".data").css('min-width', "86px");
		$(".profile").css('min-width', "72px");
		$("#boxNameWebDavRootDv").css("max-width", "491px");
		$("#propsHeadWebDavName").css("max-width", "216px");
		$("#propsInfoURL").css("max-width", (151 + scrollBarWidth)+"px");
		$("#propsInfoResourceType").css("max-width", (151 + scrollBarWidth)+"px");
		$("#propsInfoContentType").css("max-width", (151 + scrollBarWidth)+"px");
		$("#propsInfoCreatedAt").css("max-width", (151 + scrollBarWidth)+"px");
		$("#propsInfoUpdatedAt").css("max-width", (151 + scrollBarWidth)+"px");
		$("#propsInfoSize").css("max-width", (151 + scrollBarWidth)+"px");
		$(".aclSettingsData tbody tr td:nth-child(1)").css("max-width", "140px");
		$("#aclSettingsData .col1 .role").css("max-width",((140/2)-11) + "px");
		$("#aclSettingsData .col1 .box").css("max-width",((140/2)-11) + "px");
		$(".aclSettingsData tbody tr td:nth-child(2)").css("max-width", (151 + scrollBarWidth)+"px");
		$("#leftBreadCrumbBar").css("margin-right","40px");
		$("#leftBreadCrumbBar").css("width","247px");
		$("#currentDirectoryName").css("max-width", "204.333335px");
		
	}
	if (height>650){
		$(".webDavDetails").css('min-height', webDavDetailsHeight + "px");
		$("#webDavBody").css("max-height", aclSettingsHeight + "px");
	}else{
		$(".webDavDetails").css('min-height', "355px");
		$("#webDavBody").css("max-height", "296px");
	}
};

/**
 * The purpose of this method is to show hovering effect on Back button.
 */
boxDetail.prototype.backBtnHoverEffect = function(){
	$(".backWrapper").hover(function(){
		$(".backIcon").css("background","url(./images/newSprite.png) no-repeat -21px -1556px");
		$(".backBtnTxt").css("color","#e62525");
	},function(){
		$(".backIcon").css("background","url(./images/newSprite.png) no-repeat -20px -1529px");
		$(".backBtnTxt").css("color","#c80000");
	});
};

/**
 * The purpose of this function is to add and remove hover effect
 * on sort by date label.
 */
boxDetail.prototype.sortByDateHoverEffect = function () {
	$("#sortWrapperWebDav").hover(function(){
		$("#sortdownArrowWebDav ").css("background","url(./images/sprite.png) no-repeat 40% -578px");
		 $("#sortTextWebDav ").css("color","#c80000");
	 },function(){
		  $("#sortdownArrowWebDav ").css("background","url(./images/sprite.png) no-repeat 40% -601px");
		  $("#sortTextWebDav ").css("color","#1b1b1b");
	});
};

/**
 * The purpose of this method is to show hovering effect on Back button.
 */
boxDetail.prototype.boxNameHoverEffect = function(){
	$("#webDavRootIcon").hover(function(){
		$("#webDavRootIcon").css("background","url(./images/sprite.png) no-repeat 43% -25px");
		$("#boxNameWebDavRoot").css("color","#c80000");
		$("#boxNameWebDavRoot").css("text-decoration","underline");
	},function(){
		$("#webDavRootIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
		$("#boxNameWebDavRoot").css("color","#3c3c3c");
		$("#boxNameWebDavRoot").css("text-decoration","none");
	});
	$("#boxNameWebDavRoot").hover(function(){
		$("#webDavRootIcon").css("background","url(./images/sprite.png) no-repeat 43% -25px");
		$("#boxNameWebDavRoot").css("color","#c80000");
		$("#boxNameWebDavRoot").css("text-decoration","underline");
	},function(){
		$("#webDavRootIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
		$("#boxNameWebDavRoot").css("color","#3c3c3c");
		$("#boxNameWebDavRoot").css("text-decoration","none");
	});
};

/**
 * The purpose of this method is to create WebDAV root table.
 */
/*boxDetail.prototype.createWebDavRootView = function(boxname){
	var dynamicTable = "<tr style='cursor:default;'>";
	dynamicTable += "<td><div class='webDavRootIcon' id='webDavRootIcon' onclick='objOdata.openWebDavCollection();'></div></td>";
	dynamicTable += "<td><div class='boxNameWebDavRoot mainTableEllipsis' id='boxNameWebDavRootDv'><a id='boxNameWebDavRoot' onclick='objOdata.openWebDavCollection();'/></div></td>";
	dynamicTable += "<td><div class='sizeWebDavRoot' id='sizeWebDavRoot'></div></td>";
	dynamicTable += "<td><div class='updatedWebDavRoot' id='updatedWebDavRoot'></div></td>";
	dynamicTable += "</tr>";
	$("#webDavTbody").html(dynamicTable);
	$("#boxNameWebDavRoot").text(boxname);
	$("#boxNameWebDavRoot").attr('title',boxname);
	$("#sizeWebDavRoot").text();
//	$("#updatedWebDavRoot").text(updated);
	$("#wdchkSelectall").attr('disabled', true);
	uBoxDetail.boxNameHoverEffect();
};*/

/**
 * The purpose of this method is to perform back button operation maintaining the
 * box list view page state.
 */
boxDetail.prototype.clickBackButton = function(){
	objCommon.hideListTypePopUp();
	$("#mainContent").show();
	$("#mainContentWebDav").hide();
	$("#mainContentWebDav").empty();
};

/**
 * The purpose of this method is to populate values on Properties pane.
 * @param collectionPath
 * @param webDavName
 */
boxDetail.prototype.populatePropertiesList = function(collectionPathName, collectionPathValue, webDavName, root, type){
		var updated = "";
	    var properties = objOdata.getProperties(collectionPathValue);
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
	        if (propertyName == "getlastmodified"){
	        	$("#propsInfoUpdatedAt").text(propertyValue);
	        	updated = propertyValue;
	        }
	        if (propertyName == "creationdate"){
	        	$("#propsInfoCreatedAt").text(propertyValue);
	        }
	        if (propertyName == "getcontenttype"){
	        	$("#propsInfoContentType").text(propertyValue);
	        	$("#propsInfoContentType").attr('title',propertyValue);
	        }
	        if (propertyName == "getcontentlength"){
	        	$("#propsInfoSize").text(propertyValue);
	        }
	        if (propertyName == "resourcetype"){
	        	$("#propsInfoResourceType").text(propertyValue);
	        	if(propertyValue != ""){
	        		$("#propsInfoContentType").text("");
		        	$("#propsInfoContentType").attr('title',"");
		        	$("#propsInfoSize").text("");
	        	}
	        }
	    }
	    if (webDavName == getUiProps().MSG0293) {
	    	webDavName = getUiProps().MSG0039;
	    }
	    $("#propsHeadWebDavName").text(webDavName);
	    $("#propsHeadWebDavName").attr('title',webDavName);
		$("#propsInfoURL").text(collectionPathName);
		//$("#propsInfoURL").attr('title',collectionPathName);
		//$("#boxEditAclSettings").removeClass("disabledEditIconACLSettings");
		//$("#boxEditAclSettings").addClass("editIconACLSettings");
		if(root){
			$("#updatedWebDavRoot").text(updated);
		}
		if(type == "folder"){
			$(".propsHeadWebDavIcon").css("background","url(./images/newSprite.png) no-repeat 54% -918px");
			$(".propsHeadWebDavIcon").css("margin-left","18px");
		}else if(type=="p:odata"){
			$(".propsHeadWebDavIcon").css("background","url(./images/newSprite.png) no-repeat 54% -949px");
			$(".propsHeadWebDavIcon").css("margin-left","15px");
		}else if (type == "file"){
			$(".propsHeadWebDavIcon").css("background","url(./images/newSprite.png) no-repeat 47% -1625px");
			$(".propsHeadWebDavIcon").css("margin-left","18px");
		}else if (type == "p:service"){
			$(".propsHeadWebDavIcon").css("background","url(./images/sprite3.png) no-repeat 54% -165px");
			$(".propsHeadWebDavIcon").css("margin-left","20px");
			//$("#boxEditAclSettings").removeClass("editIconACLSettings");
			//$("#boxEditAclSettings").addClass("disabledEditIconACLSettings");
		}else if (type == "box"){
			$(".propsHeadWebDavIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
			$(".propsHeadWebDavIcon").css("margin-left","20px");
		}
		uBoxDetail.setDynamicWidth();
};

/**
 * The purpose of this method is to show hover effect on Upload file area.
 */
boxDetail.prototype.uploadHoverEffect = function(){
	$("#uploadWebDavWrapper").hover(function(){
		$("#uploadWebDavIcon").css("background","url(./images/newSprite.png) no-repeat -15px -756px");
		$("#uploadWebDavText").css("color","#c80000");
	},function(){
		$("#uploadWebDavIcon").css("background","url(./images/newSprite.png) no-repeat -16px -663px");
		$("#uploadWebDavText").css("color","#1b1b1b");
	});
};

/**
 * The purpose of this method is to show hover effect on Download file area.
 */
boxDetail.prototype.downloadHoverEffect = function(){
	$("#downloadWebDavWrapper").hover(function(){
		$("#dvDownLoadIcon").css("background","url(./images/newSprite.png) no-repeat -16px -823px");
		$("#dvDownLoadText").css("color","#c80000");
		$("#downloadWebDavWrapper").css("cursor","pointer");
	},function(){
		$("#dvDownLoadIcon").css("background","url(./images/newSprite.png) no-repeat -16px -790px");
		$("#dvDownLoadText").css("color","#1b1b1b");
	});
};

/**
 * The purpose of this method is to show hover effect on Export file area.
 */
boxDetail.prototype.exportHoverEffect = function(){
	$("#exportWebDavWrapper").hover(function(){
		$("#dvExportIcon").css("background","url(./images/newSprite.png) no-repeat -16px -823px");
		$("#dvExportText").css("color","#c80000");
		$("#exportWebDavWrapper").css("cursor","pointer");
	},function(){
		$("#dvExportIcon").css("background","url(./images/newSprite.png) no-repeat -16px -790px");
		$("#dvExportText").css("color","#1b1b1b");
	});
};

//<input type="checkbox" value="all" class="aclSetPrivChkBox" onclick="uBoxAcl.checkBoxSelect(this);" id = "aclChekBox" name = "roleAclCheckBox">all</td></tr>
/**
 * Following method create rows for edit row ACL.
 */

boxDetail.prototype.createAclRows = function(dynamicTable,id,roleBoxDisplay){
	var idFocusAll = '"' + "#lblAll"+id + '"';
	var idFocusRead = '"' + "#lblRead"+id + '"';
	var idFocusWrite = '"' + "#lblWrite"+id + '"';
	var idFocusReadProperties = '"' + "#lblReadProperties"+id + '"';
	var idFocusWriteProperties = '"' + "#lblWriteProperties"+id + '"';
	var idFocusReadAcl = '"' + "#lblReadAcl"+id + '"';
	var idFocusWriteAcl = '"' + "#lblWriteAcl"+id + '"';
	var idFocusExec = '"' + "#lblExec"+id + '"';
	var idFocusAlsc = '"' + "#lblAlsc"+id + '"';
	
	var tabIndex = id + 4;
	dynamicTable += "<tr id=tr_"+id+"><td style='text-align:left;' class='borderRight'><div id=dv"+ id+" class='editACLTableEllipsis' title='"
	+ roleBoxDisplay
	+ "'>"
	+ roleBoxDisplay
	+ "</div></td><td><input  id='chkall"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='D:all' onfocus='checkBoxACLFocus("+idFocusAll+");' onblur='checkBoxACLBlur("+idFocusAll+");' tabindex='"+tabIndex+"'><label id ='lblAll"+id+"'  for='chkall"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td><input  id='chkread"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='D:read' onfocus='checkBoxACLFocus("+idFocusRead+");' onblur='checkBoxACLBlur("+idFocusRead+");' tabindex='"+tabIndex+"'><label id ='lblRead"+id+"' for='chkread"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td ><input id = 'chkwrite"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='D:write' onfocus='checkBoxACLFocus("+idFocusWrite+");' onblur='checkBoxACLBlur("+idFocusWrite+");' tabindex='"+tabIndex+"'><label id ='lblWrite"+id+"' for='chkwrite"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td ><input id = 'chkread-properties"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='D:read-properties' onfocus='checkBoxACLFocus("+idFocusReadProperties+");' onblur='checkBoxACLBlur("+idFocusReadProperties+");' tabindex='"+tabIndex+"'><label id ='lblReadProperties"+id+"' for='chkread-properties"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td ><input id = 'chkwrite-properties"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='D:write-properties' onfocus='checkBoxACLFocus("+idFocusWriteProperties+");' onblur='checkBoxACLBlur("+idFocusWriteProperties+");' tabindex='"+tabIndex+"'><label id ='lblWriteProperties"+id+"' for='chkwrite-properties"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td ><input id = 'chkread-acl"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='D:read-acl' onfocus='checkBoxACLFocus("+idFocusReadAcl+");' onblur='checkBoxACLBlur("+idFocusReadAcl+");' tabindex='"+tabIndex+"'><label id ='lblReadAcl"+id+"' for='chkread-acl"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td ><input id = 'chkwrite-acl"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='D:write-acl' onfocus='checkBoxACLFocus("+idFocusWriteAcl+");' onblur='checkBoxACLBlur("+idFocusWriteAcl+");' tabindex='"+tabIndex+"'><label id ='lblWriteAcl"+id+"' for='chkwrite-acl"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td ><input id= 'chkexec"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='p:exec' onfocus='checkBoxACLFocus("+idFocusExec+");' onblur='checkBoxACLBlur("+idFocusExec+");' tabindex='"+tabIndex+"'><label id ='lblExec"+id+"' for='chkexec"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td><td ><input id= 'chkalsc"
	+ id
	+ "' type='checkbox' class='case cursorHand regular-checkbox big-checkbox aclCheckboxFocus' name='case' value='p:alter-schema' onfocus='checkBoxACLFocus("+idFocusAlsc+");' onblur='checkBoxACLBlur("+idFocusAlsc+");' tabindex='"+tabIndex+"'><label id ='lblAlsc"+id+"' for='chkalsc"
	+ id
	+ "' class='customChkbox checkBoxLabel aclLabelFocus'></label></td></tr>";
return dynamicTable;
};

/**
 * Following method check priveleges.
 * @param arrCheckedState privleges list for checking the respective checboxes.
 */
boxDetail.prototype.checkPrivleges = function(arrCheckedState) {
if (arrCheckedState.length > 0) {
	for ( var iterateState = 0; iterateState < arrCheckedState.length; iterateState++) {
		var objJson = arrCheckedState[iterateState];
		var collectionPrivlegeList = objJson.privilegeList.replace(/'/g,"");
		var arrCollectionPrivlegeList = collectionPrivlegeList.split(', ');
		for ( var count = 0; count < arrCollectionPrivlegeList.length; count++) {
			//if( arrCollectionPrivlegeList[count] == "read") {
			var chkBoxID = "#chk"+arrCollectionPrivlegeList[count] +objJson.RowID; 
				$(chkBoxID).attr('checked', true);
			//}
			}
		}
	}
};
/**
 * Following method displays radio button with relevant values.
 * @param schemaAuthz
 */
boxDetail.prototype.showSchemaAuth = function(schemaAuthz) {
	$('input:checkbox[name="schemaAuth"]').val([schemaAuthz]);
};

/**
 * Following method fetches role and its acl settings.
 * @returns {Array}
 */

boxDetail.prototype.getRoleBoxACLSettings = function() { 
    var rowCount = $('#editACLGridTbody tr').length + 1;
	var rolePrivilegeList = '';
	var arrCheckedRolePrivilegeList = [];
	var jsonRolePrivilegeList = null;
	var mainBoxValue = getUiProps().MSG0039;
	for ( var index = 0; index < rowCount; index++) {
		var roleBoxCombo =  '';
		var roleBoxPair ='';
		roleBoxCombo =  $('#dv' + index).attr("title");
		if (roleBoxCombo!=undefined){
			var arrRoleBoxCombo = '';
			arrRoleBoxCombo = roleBoxCombo.split(' - ');
		
		roleName = arrRoleBoxCombo[0];
		boxName = arrRoleBoxCombo[1];
		if (boxName == mainBoxValue) {
			boxName = getUiProps().MSG0293;
		}
		roleBoxPair = "../" + boxName + "/" + roleName;
		}
		if ($('#chkall' + index).is(':checked')) {
			rolePrivilegeList += 'D:all,';
		}
		if ($('#chkread' + index).is(':checked')) {
			rolePrivilegeList += 'D:read,';
		}
		if ($('#chkwrite' + index).is(':checked')) {
			rolePrivilegeList += 'D:write,';
		}
		if ($('#chkread-properties' + index).is(':checked')) {
			rolePrivilegeList += 'D:read-properties,';
		}
		if ($('#chkwrite-properties' + index).is(':checked')) {
			rolePrivilegeList += 'D:write-properties,';
		}
		if ($('#chkread-acl' + index).is(':checked')) {
			rolePrivilegeList += 'D:read-acl,';
		}
		if ($('#chkwrite-acl' + index).is(':checked')) {
			rolePrivilegeList += 'D:write-acl,';
		}
		if ($('#chkwrite-content' + index).is(':checked')) {
			rolePrivilegeList += 'D:write-content,';
		}
		if ($('#chkbind' + index).is(':checked')) {
			rolePrivilegeList += 'D:bind,';
		}
		if ($('#chkunbind' + index).is(':checked')) {
			rolePrivilegeList += 'D:unbind,';
		}
		if ($('#chkexec' + index).is(':checked')) {
			rolePrivilegeList += 'p:exec,';
		}
		if ($('#chkalsc' + index).is(':checked')) {
			rolePrivilegeList += 'p:alter-schema,';
		}

		//regex below removes the last comma and extra space from the privilege list.
		if (rolePrivilegeList.length >= 1) {
    		jsonRolePrivilegeList = {
    				"role" : roleBoxPair,
    				"privilege" : rolePrivilegeList.replace(/,\s*$/, "")
    			};
    		
    		arrCheckedRolePrivilegeList.push(jsonRolePrivilegeList);
    		jsonRolePrivilegeList = null;
    		rolePrivilegeList='';
		}
	}
	return arrCheckedRolePrivilegeList;
};

/**
 * Followinfg method populates Edit ACL table.
 * @param roleList role list
 * @param rolePrivList privelege list
 * @param schemaAuthz schema authz info
 */
boxDetail.prototype.populateACLSettings = function(roleList, rolePrivList,
		schemaAuthz) { 
	this.showSchemaAuth(schemaAuthz);
	var mainBoxValue = getUiProps().MSG0039;
	var actualMainBoxValue = getUiProps().MSG0293;
	var boxname = sessionStorage.boxName;
	if (boxname == mainBoxValue) {
		boxname = actualMainBoxValue;
	}
	//var mainBoxValue = "__";
	var boxNameForRole = "";
	var noOfRoles = roleList.length;
	var displayBoxName = '';
    var dynamicTable = "";
	var arrCheckedState = [];

    // Destroy DataTable contents and clear HTML table tbody
    if (jquery1_12_4.fn.DataTable.isDataTable("#editAclSettingsTable")) {
        jquery1_12_4("#editAclSettingsTable").DataTable().destroy();
    }
    jquery1_12_4("#editAclSettingsTable tbody").empty();

	for ( var count = 0; count < noOfRoles; count++) {
		var rolePrivCounter = 0;
		var obj = roleList[count];
		var roleName = obj.Name;
		if (count != 0) {
			boxNameForRole = actualMainBoxValue;
			if (obj._Box.length > 0){
				// Since _Box is an array of only one data, we use the first data
				boxNameForRole = obj._Box[0].Name;
			}
		} else {
			boxNameForRole = boxname;
		}
		if (!(boxNameForRole.endsWith('/'))) {
			boxNameForRole = boxNameForRole + "/";
		}
		var boxNameValue = boxNameForRole.slice(0, -1);
		if (boxNameValue == actualMainBoxValue) {
			boxNameValue = getUiProps().MSG0039;
		}
		displayBoxName = obj["_Box.Name"];
		if (displayBoxName == null) {
			displayBoxName = mainBoxValue;
		}
		var roleBoxDisplay = roleName + " - " + displayBoxName;
		if (roleName == 'all (anyone)') {
			roleBoxDisplay = roleName;
		}
		var roleBoxPair = "../" + boxNameForRole + roleName;
		var recordSize = rolePrivList.length;
		for ( var privCount = 0; privCount < recordSize; privCount++) {
			var aclRoleName = rolePrivList[privCount].role;
			var privilegeList = rolePrivList[privCount].privilege;
			if (aclRoleName == roleBoxPair) {
				var objCheckedState = {
					"RowID" : count,
					"privilegeList" : privilegeList
				};
				arrCheckedState.push(objCheckedState);
				dynamicTable = uBoxDetail.createAclRows(dynamicTable, count,
						roleBoxDisplay);
				break;
			}
			rolePrivCounter++;
		}
		if (rolePrivCounter == recordSize ) {
			dynamicTable = uBoxDetail.createAclRows(dynamicTable, count,
					roleBoxDisplay);
		}
	}
	$("#editACLGridTbody").html(dynamicTable);
	uBoxDetail.checkPrivleges(arrCheckedState);

    // Construct DataTable from scratches
    var tempTable = jquery1_12_4('#editAclSettingsTable').DataTable({
        sScrollX: "100%",
        sScrollY: 200,
        sScrollXInner: "150%",
        bScrollCollapse: true,
        paging: false,
        ordering: true,
        searching: false,
        info: false,
        destroy: true,
        aaSorting: [], // disable initial sort
        columnDefs: [
            { className: "tdDataTables", targets: "_all" },
            { className: "readProperties", targets: [4] },
            { className: "writeProperties", targets: [5] },
            { className: "readAcl", targets: [6] },
            { className: "writeAcl", targets: [7] },
            { targets: "no-sort", orderable: false }
        ]
    });
    new jquery1_12_4.fn.dataTable.FixedColumns(tempTable);

	$("#btnCancelBoxAcl").attr("tabindex", noOfRoles + 4);
	$("#btnEditAcl").attr("tabindex", noOfRoles + 5);
	$(".crossIconFocus").attr("tabindex", noOfRoles + 6);
	this.disableCheckBoxes();
};

/**
 * Following method disables -- All,Write-Properties,Write,Read-Acl and Write-Acl checkboxes from the first row of the ACl table.
 */
boxDetail.prototype.disableCheckBoxes = function() { 
	$("#chkall0").attr('disabled', true);
	$("#chkwrite-properties0").attr('disabled', true);
	$("#chkwrite0").attr('disabled', true);
	$("#chkread-acl0").attr('disabled', true);
	$("#chkwrite-acl0").attr('disabled', true);
	$("#lblAll0").css('cursor','default');
	$("#lblAll0").css('background', '#e8e8e8');
	$("#lblWrite0").css('cursor','default');
	$("#lblWrite0").css('background', '#e8e8e8');
	$("#lblWriteProperties0").css('cursor','default');
	$("#lblWriteProperties0").css('background', '#e8e8e8');
	$("#lblReadAcl0").css('cursor','default');
	$("#lblReadAcl0").css('background', '#e8e8e8');
	$("#lblWriteAcl0").css('cursor','default');
	$("#lblWriteAcl0").css('background', '#e8e8e8');
};

/**
 * Following method fetches role list with all (anyone) on the top.
 * @param roleList roleList
 * @returns role list pertaining to selected box pooled together with 'all (anyone)' on the top.
 */
boxDetail.prototype.getAllRoles = function(roleList) {
	var sortedRoleList = uBoxAcl.getSortedRoleList(roleList);
	sortedRoleList.splice(0, 0, {
		Name : "all (anyone)"
	});
	return sortedRoleList;
};

/**
 * Following method fetches record for edit.
 * @param collectionURL cllection URL
 * @param boxname Box Name
 */
boxDetail.prototype.getAclSettingsForEdit = function(collectionURL, boxname) {
	var baseUrl = getClientStore().baseURL;
	if (!baseUrl.endsWith("/")) {
		baseUrl += "/";
	}
	var cellName = sessionStorage.selectedcell;
	var boxName = sessionStorage.boxName;
	var roleList = uBoxAcl.getRoleListForCell();
	var accessor = objCommon.initializeAccessor(baseUrl, cellName, boxName);
	var objJDavCollection = new _pc.DavCollection(accessor, collectionURL);
	var response = uBoxAcl.getAclList(accessor, objJDavCollection);
	var schemaAuthz = response.schemaAuthz;
	response = response.privilegeList;
	if (response != undefined) {
		var stringArrRolePrivilegeSet = '';
		stringArrRolePrivilegeSet = JSON.stringify(response);
		var changedResponse = uBoxAcl
				.custumizeResponse(stringArrRolePrivilegeSet);
		var allRoleList = this.getAllRoles(roleList);
		uBoxDetail.populateACLSettings(allRoleList, changedResponse,
				schemaAuthz);
	}
	$('#lblNoneBoxAcl').focus();
};

/**
 * Following method opens up Edit ACL pop up window.
 * @param idDialogBox dialog box id
 * @param idModalWindow modal window id
 */
boxDetail.prototype.openPopUpWindow = function(idDialogBox, idModalWindow) {
	$(idModalWindow).fadeIn(0);
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();
	$(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
	$(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
	uBoxDetail.getAclSettingsForEdit(uBoxDetail.getCollectionLocation(),sessionStorage.boxName);
};

$(document).ready(function(){
	   $("#btnEditAcl").click(function() {
		   var response = uMainBoxAcl.implementMainBoxACL(uBoxDetail.getRoleBoxACLSettings()); 
			var code = objCommon.getStatusCode(response);
			if (code == 200) {
				uBoxAcl.getAclSetting(uBoxDetail.getCollectionLocation(),sessionStorage.boxName);
				closeEntityModal('#editAclSettingModal');
				}
	   });
	//uBoxDetail.setDynamicWidth();
	//uBoxDetail.backBtnHoverEffect();
	uBoxDetail.sortByDateHoverEffect();
	uBoxDetail.uploadHoverEffect();
	uBoxDetail.exportHoverEffect();
	//uBoxDetail.boxNameHoverEffect();
	$("#createWebDavWrapper").hover(function() {
		//if (uBoxDetail.getCreateCollectionMenuEnabled()) {
			objOdata.showCreateIconOnHover();
			$("#dvCollectionSubMenu").show();
		//}
	}, function() {
		//if (uBoxDetail.getCreateCollectionMenuEnabled()) {
			objOdata.showCreateIconOnHoverOut();
			$("#dvCollectionSubMenu").hide();
		//}
	});
	$(".createBoxSubMenu").hover(function(){
		$(".createBoxSubMenu").css("display","block");
	}, function(){
		$(".createBoxSubMenu").css("display","none");
	});
	if (document.getElementById('downloadWebDavWrapper') != null) {
		document.getElementById('downloadWebDavWrapper').style.pointerEvents = 'none';
	}
	/*if (document.getElementById('btnDeleteCollection') != null) {
		document.getElementById('btnDeleteCollection').style.pointerEvents = 'none';
	}*/
	
	// Make the operation of the Schema Auth check box of the ACL a single selection
	$('[name=schemaAuth]').click(function() {
		$('[name=schemaAuth]:checked').not(this).attr('checked', false);
    });
});

$(window).resize(function(){
	uBoxDetail.setDynamicWidth();
	objOdata.setDynamicHeight();
	objOdata.setAvailableWidthForBreadCrumb();
	objOdata.setMarginForEmptyFolderMessage();
	objOdata.setMarginForSelectedResourcesMessage();
});

/**
 * Following is the click event of Refresh button.
 */
$('#dvRefreshIcon').click(function() {
	objOdata.getCollectionList();
});

/**
 * Following is the click event to load the content tab.
 */

$("#boxdetailContentsTab").click(function(){
	objCommon.hideListTypePopUp();
	var boxname = sessionStorage.boxName;
	var mainBoxValue = getUiProps().MSG0039;
	if (boxname == mainBoxValue) {
		boxname = getUiProps().MSG0293;
	}
	$("#dvBreadCrumBrowse").attr('title', boxname);
	boxHeirarchyPath = boxname;
	uBoxDetail.loadBoxContentsTab(sessionStorage.boxName);
	$("#webDavProfileArea").hide();
});

/**
 * Following is the click event to load the Info tab.
 */

$("#boxdetailInfoTab").click(function(){
	objCommon.hideListTypePopUp();
	uBoxDetail.loadBoxInfoTab();
});


function checkBoxACLFocus(id) {
	$(id).css("outline","-webkit-focus-ring-color auto 5px");
}

function checkBoxACLBlur(id) {
	$(id).css("outline","none");
}


/**
* The purpose of this function is to check if delete box detail is enabled/disabled
* and open popup accordingly.
*/
boxDetail.prototype.openDeleteBoxDetailEntityPopUp = function(){
	if($("#btnDeleteCollection").hasClass("deleteIconWebDavEnabled")){
		objOdata.openPopUpWindow('#multipleFileDeleteDialogBox','#multipleFileDeleteModalWindow');
		  }
};
