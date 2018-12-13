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
var contextRoot = sessionStorage.contextRoot;

$ (document).ready(function() {
	setHeaderWidth();
	setCellNameWidth();
	setCellURLWidth();
	setBoxNavWidth();
	setRoleNavWidth();
	setAccountNavWidth();
	setSocialNavWidth();
	setMessageNavWidth();
	setEventNavWidth();
	setSnapshotNavWidth();
	$("#boxNav").hover(function(){
		$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -25px");
		$("#boxText").css("color","#c80000");
	},function(){
		if(!$("#boxNav").hasClass("selected")){
			$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
			$("#boxText").css("color","#1b1b1b");
		}
	});
	$("#roleNav").hover(function(){
		$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -94px");
		$("#roleText").css("color","#c80000");
	},function(){
		if(!$("#roleNav").hasClass("selected")){
			$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -129px");
			$("#roleText").css("color","#1b1b1b");
		}
	});
	$("#accountNav").hover(function(){
		$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -165px");
		$("#accountText").css("color","#c80000");
	},function(){
		if(!$("#accountNav").hasClass("selected")){
			$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -198px");
			$("#accountText").css("color","#1b1b1b");
		}
	});
	$("#socialNav").hover(function(){
		$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -235px");
		$("#socialText").css("color","#c80000");
		$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -14px");
	},function(){
		if(!$("#socialNav").hasClass("selected")){
			$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -273px");
			$("#socialText").css("color","#1b1b1b");
			$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
		}
	});
	$("#messageNav").hover(function(){
		$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -318px");
		$("#messageText").css("color","#c80000");
		$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -14px");
	},function(){
		if(!$("#messageNav").hasClass("selected")){
			$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -351px");
			$("#messageText").css("color","#1b1b1b");
			$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
		}
	});
	$("#eventNav").hover(function(){
		$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -388px");
		$("#eventText").css("color","#c80000");
		$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -14px");
	},function(){
		if(!$("#eventNav").hasClass("selected")){
			$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
			$("#eventText").css("color","#1b1b1b");
			$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
		}
	});
	$("#snapshotNav").hover(function(){
		$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -388px");
		$("#snapshotText").css("color","#c80000");
	},function(){
		if(!$("#snapshotNav").hasClass("selected")){
			$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
			$("#snapshotText").css("color","#1b1b1b");
		}
	});
	$("#infoNav").hover(function(){
		$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -457px");
		$("#infoText").css("color","#c80000");
	},function(){
		if(!$("#infoNav").hasClass("selected")){
			$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -491px");
			$("#infoText").css("color","#1b1b1b");
		}
	});
	
	$(".socialNav").hover(function(){
		$(".socialSubMenu").css("display","block");
	}, function(){
		$(".socialSubMenu").css("display","none");
	});
	$(".userSubMenu").hover(function(){
		$(".socialSubMenu").css("display","block");
	}, function(){
		$(".socialSubMenu").css("display","none");
	});
	$(".messageNav").hover(function(){
		$(".messageSubMenu").css("display","block");
	}, function(){
		$(".messageSubMenu").css("display","none");
	});
	$(".eventNav").hover(function(){
		$(".eventSubMenu").css("display","block");
	}, function(){
		$(".eventSubMenu").css("display","none");
	});
	$.ajaxSetup({ cache : false });
	$('.cellList li').each(function() {
		$(this).click(function() {
			$(this).siblings().removeClass("activeCell");
			$(this).toggleClass("activeCell");
		});
	});
	
	$('.leftNavHomePage ul li').each(function() {
		$(this).click(function() {
			$(this).siblings().removeClass("selected");
			$(this).addClass("selected");
		});
	}); 
	
	$('.leftNav ul li').each(function() {
		$(this).click(function() {
			$(this).siblings().removeClass("selected");
			$(this).toggleClass("selected");
		});
	}); 
	
	$('#navigationBar ul li').each(function() {
		$(this).click(function() {
			if(this.id == "boxNav") {
				selectBoxInNavigationBar();
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
			} else if(this.id == "roleNav") {
				selectRoleInNavigationBar();
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
			} else if(this.id == "accountNav") {
				selectAccountInNavigationBar();
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
			} else if(this.id == "socialNav") {
				//selectSocialInNavigationBar();
			} else if(this.id == "messageNav") {
				//selectMessageInNavigationBar();
			} else if(this.id == "eventNav") {
				selectEventInNavigationBar();
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
			} else if(this.id == "snapshotNav") {
				selectSnapshotInNavigationBar();
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
			} else if(this.id == "infoNav") {
				selectInfoInNavigationBar();
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
			}
		});
	}); 
	
	$('.assignEntities ul li').each(function() {
		$(this).click(function() {
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
		});
	});
	
	$('.assignAccountToRole ul li').each(function() {
		$(this).click(function() {
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
		});
	});

	$(function() {
		$(".profileTable tr:even").css("background-color", "#F4F4F4");
		$(".selectProfileRow").css("background-color", "#dfdfdf");
		$(".mainTable tr:even").css("background-color", "F4F4F4");		
	});

/**
 * The purpose of this function is to perform operation on 
 * window resize event.
 */	
	$(window).resize(function () {
		setDynamicUnitManagementHeight();
		setDynamicUnitNameMaxwidth();
		setDynamicAssignGridHeight();
		setHeaderWidth();
		setCellNameWidth();
		setCellURLWidth();
		setBoxNavWidth();
		setRoleNavWidth();
		setAccountNavWidth();
		setSocialNavWidth();
		setMessageNavWidth();
		setEventNavWidth();
		setSnapshotNavWidth();
		getWindowSize();
		setRightContainerHomeWidth();
		getODataWindowSize();
		//setRightContainerWidth();
		setRightContainerOdataWidth();
		setFooterHeight();
		setHomeFooterHeight();
		setODataFooterHeight();
		setDynamicLoginSection();
		setDynaicBrowserCompatabilitySection();
		setCellListSliderPosition();
		setDynamicCellListHeight();
		setDynamicGridHeight();
	});
	cellMenuHover();
	setCellListSliderPosition();
	setDynamicCellListHeight();
});

/** 
 * The purpose of this function is to select box in navigation bar
 * and removes selected class from other menus.
 */
function selectBoxInNavigationBar() {
	$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -129px");
	$("#roleText").css("color","#1b1b1b");
	$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -198px");
	$("#accountText").css("color","#1b1b1b");
	$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -273px");
	$("#socialText").css("color","#1b1b1b");
	$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -351px");
	$("#messageText").css("color","#1b1b1b");
	$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#eventText").css("color","#1b1b1b");
	$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#snapshotText").css("color","#1b1b1b");
	$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -491px");
	$("#infoText").css("color","#1b1b1b");
	$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -25px");
	$("#boxText").css("color","#c80000");
}

/** 
 * The purpose of this function is to select role in navigation bar
 * and removes selected class from other menus.
 */
function selectRoleInNavigationBar() {
	$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
	$("#boxText").css("color","#1b1b1b");
	$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -198px");
	$("#accountText").css("color","#1b1b1b");
	$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -273px");
	$("#socialText").css("color","#1b1b1b");
	$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -351px");
	$("#messageText").css("color","#1b1b1b");
	$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#eventText").css("color","#1b1b1b");
	$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#snapshotText").css("color","#1b1b1b");
	$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -491px");
	$("#infoText").css("color","#1b1b1b");
	$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -94px");
	$("#roleText").css("color","#c80000");
}

/** 
 * The purpose of this function is to select account in navigation bar
 * and removes selected class from other menus.
 */
function selectAccountInNavigationBar() {
	$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
	$("#boxText").css("color","#1b1b1b");
	$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -129px");
	$("#roleText").css("color","#1b1b1b");
	$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -273px");
	$("#socialText").css("color","#1b1b1b");
	$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -351px");
	$("#messageText").css("color","#1b1b1b");
	$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#eventText").css("color","#1b1b1b");
	$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#snapshotText").css("color","#1b1b1b");
	$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -491px");
	$("#infoText").css("color","#1b1b1b");
	$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -165px");
	$("#accountText").css("color","#c80000");
}

/** 
 * The purpose of this function is to select social in navigation bar
 * and removes selected class from other menus.
 */
function selectSocialInNavigationBar() {
	$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
	$("#boxText").css("color","#1b1b1b");
	$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -129px");
	$("#roleText").css("color","#1b1b1b");
	$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -198px");
	$("#accountText").css("color","#1b1b1b");
	$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -351px");
	$("#messageText").css("color","#1b1b1b");
	$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#eventText").css("color","#1b1b1b");
	$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#snapshotText").css("color","#1b1b1b");
	$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -491px");
	$("#infoText").css("color","#1b1b1b");
	$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -235px");
	$("#socialText").css("color","#c80000");
	$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -14px");
}

/** 
 * The purpose of this function is to select message in navigation bar
 * and removes selected class from other menus.
 */
function selectMessageInNavigationBar() {
	$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
	$("#boxText").css("color","#1b1b1b");
	$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -129px");
	$("#roleText").css("color","#1b1b1b");
	$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -198px");
	$("#accountText").css("color","#1b1b1b");
	$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -273px");
	$("#socialText").css("color","#1b1b1b");
	$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#eventText").css("color","#1b1b1b");
	$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#snapshotText").css("color","#1b1b1b");
	$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -491px");
	$("#infoText").css("color","#1b1b1b");
	$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -318px");
	$("#messageText").css("color","#c80000");
	$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -14px");
}

/** 
 * The purpose of this function is to select event in navigation bar
 * and removes selected class from other menus.
 */
function selectEventInNavigationBar() {
	$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
	$("#boxText").css("color","#1b1b1b");
	$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -129px");
	$("#roleText").css("color","#1b1b1b");
	$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -198px");
	$("#accountText").css("color","#1b1b1b");
	$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -273px");
	$("#socialText").css("color","#1b1b1b");
	$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -351px");
	$("#messageText").css("color","#1b1b1b");
	$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#snapshotText").css("color","#1b1b1b");
	$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -491px");
	$("#infoText").css("color","#1b1b1b");
	$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -388px");
	$("#eventText").css("color","#c80000");
	$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -14px");
}

/** 
 * The purpose of this function is to select log in navigation bar
 * and removes selected class from other menus.
 */
function selectSnapshotInNavigationBar() {
	$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
	$("#boxText").css("color","#1b1b1b");
	$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -129px");
	$("#roleText").css("color","#1b1b1b");
	$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -198px");
	$("#accountText").css("color","#1b1b1b");
	$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -273px");
	$("#socialText").css("color","#1b1b1b");
	$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -351px");
	$("#messageText").css("color","#1b1b1b");
	$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#eventText").css("color","#1b1b1b");
	$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -491px");
	$("#infoText").css("color","#1b1b1b");
	$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -388px");
	$("#snapshotText").css("color","#c80000");
}

/** 
 * The purpose of this function is to select info in navigation bar
 * and removes selected class from other menus.
 */
function selectInfoInNavigationBar() {
	$("#boxIcon").css("background","url(./images/sprite.png) no-repeat 43% -60px");
	$("#boxText").css("color","#1b1b1b");
	$("#roleIcon").css("background","url(./images/sprite.png) no-repeat 43% -129px");
	$("#roleText").css("color","#1b1b1b");
	$("#accountIcon").css("background","url(./images/sprite.png) no-repeat 43% -198px");
	$("#accountText").css("color","#1b1b1b");
	$("#socialIcon").css("background","url(./images/sprite.png) no-repeat 43% -273px");
	$("#socialText").css("color","#1b1b1b");
	$("#socialArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#messageIcon").css("background","url(./images/sprite.png) no-repeat 43% -351px");
	$("#messageText").css("color","#1b1b1b");
	$("#messageArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#eventIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#eventText").css("color","#1b1b1b");
	$("#eventArrow").css("background","url(./images/newSprite.png) no-repeat -20px -33px");
	$("#snapshotIcon").css("background","url(./images/sprite.png) no-repeat 43% -423px");
	$("#snapshotText").css("color","#1b1b1b");
	$("#infoIcon").css("background","url(./images/sprite.png) no-repeat 43% -457px");
	$("#infoText").css("color","#c80000");
}

/**
 * The purpose of this function is to get window height 
 * for cell list.
 */	
function getWindowSize () {
	var varheight = $(window).height();
	if (varheight > 650) {
		$("#btnCreateCell").addClass("cellListCreateButtonLargeScreen");
		//$("#downID").addClass("cellListDownwardIconLargeScreen");
	} else {
		$("#btnCreateCell").removeClass("cellListCreateButtonLargeScreen");
		//$("#downID").removeClass("cellListDownwardIconLargeScreen");
	}
}

/**
 * The purpose of this function is to get window height 
 * for oData list.
 */	
function getODataWindowSize () {
	var varheight = $(window).height();
	if (varheight > 650) {
		$("#btnODataList").addClass("oDataListCreateBtnLagreScreen");
	} else {
		$("#btnODataList").removeClass("oDataListCreateBtnLagreScreen");
		$("#btnODataList").addClass("createEntityType");
	}
}

/**
 * The purpose of this function is to set header width 
 * for cell profile having Cell Name and Environment URL.
 */	
function setHeaderWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightHeadingWidth = 189;
	var height = $(window).height();
	if (width>1280) {
		//$('#leftHeading').css('min-width', (Math.floor((width-leftPanelWidth-rightHeadingWidth)/(width - leftPanelWidth)*100)) + "%");
		$('#leftHeading').css('min-width', (width-leftPanelWidth-rightHeadingWidth) + "px");
		if(height < 650){
			var scrollBarWidth = 15;
			$('#leftHeading').css('min-width', (width-leftPanelWidth-rightHeadingWidth-scrollBarWidth) + "px");
		}
	}else{
		// Re-set min-width and fix leftHeading
		$('#leftHeading').css('min-width', "1074px");
		if(height < 650){
			var scrollBarWidth = 15;
			$('#leftHeading').css('min-width', (1174-scrollBarWidth) + "px");
		}
	}
}

/**
 * The purpose of this method is to set dynamic width for Cell Name in Header.
 */
function setCellNameWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightHeadingWidth = 189;
	var cellNameWidth = Math.round((width - leftPanelWidth - rightHeadingWidth)/2) - 35;
	if (width>1280) {
		$("#cellNameHeading").css('max-width', (cellNameWidth-1) + "px");
	}else{
		$("#cellNameHeading").css('max-width', "552px");
	}
}

/**
 * The purpose of this method is to set dynamic width for Cell URL in Header.
 */
function setCellURLWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.ceil((1.328125/100)*width);
	var rightHeadingWidth = 189;
	var cellURLWidth = Math.round((width - leftPanelWidth - rightHeadingWidth)/2) - 20;
	if (width>1280) {
		$("#cellURLHeading").css('max-width', cellURLWidth + "px");
	}else{
		$("#cellURLHeading").css('max-width', "567px");
	}
}

/**
 * The purpose of this function is to set the Box Tab width
 * as per screen size on Cell Profile page.
 */	
function setBoxNavWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.round((1.328125/100)*width);
	/*var rightGap = 354;
	var navContentsWidthFixed = 608;*/
	var boxTabFixedWidth = 112;
	var boxNavWidth = (boxTabFixedWidth/(width - leftPanelWidth))*100;
	if (width>1280) {
		/*var boxNavWidth = Math.round((width - leftPanelWidth - rightGap - navContentsWidthFixed)/6);
		boxNavWidth = boxNavWidth + boxTabContentWidthFixed;*/
		$('#boxNav').css('min-width', boxNavWidth + "%");
	}
}

/**
 * The purpose of this function is to set the Role Tab width
 * as per screen size on Cell Profile page.
 */	
function setRoleNavWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.round((1.328125/100)*width);
	/*var rightGap = 354;
	var navContentsWidthFixed = 608;
	var roleTabContentWidthFixed = 69;*/
	var roleTabFixedWidth = 104;
	var roleNavWidth = (roleTabFixedWidth/(width - leftPanelWidth))*100;
	if (width>1280) {
//		var roleNavWidth = Math.round((width - leftPanelWidth - rightGap - navContentsWidthFixed)/6);
//		roleNavWidth = roleNavWidth + roleTabContentWidthFixed;
		$('#roleNav').css('min-width', roleNavWidth + "%");
	}
}

/**
 * The purpose of this function is to set the Account Tab width
 * as per screen size on Cell Profile page.
 */	
function setAccountNavWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.round((1.328125/100)*width);
	/*var navContentsWidthFixed = 608;
	var rightGap = 354;
	var accountTabContentWidthFixed = 101;*/
	var accountTabFixedWidth = 136;
	var accountNavWidth = (accountTabFixedWidth/(width - leftPanelWidth))*100;
	if (width>1280) {
		/*var accountNavWidth = Math.round((width - leftPanelWidth - rightGap - navContentsWidthFixed)/6);
		accountNavWidth = accountNavWidth + accountTabContentWidthFixed;*/
		$('#accountNav').css('min-width', accountNavWidth + "%");
	}
}

/**
 * The purpose of this function is to set the Social Tab width
 * as per screen size on Cell Profile page.
 */	
function setSocialNavWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.round((1.328125/100)*width);
	/*var rightGap = 354;
	var navContentsWidthFixed = 608;
	var socialTabContentWidthFixed = 94;*/
	var socialTabFixedWidth = 129;
	var socialNavWidth = (socialTabFixedWidth/(width - leftPanelWidth))*100;
	if (width>1280) {
		/*var socialNavWidth = Math.round((width - leftPanelWidth - rightGap - navContentsWidthFixed)/6);
		socialNavWidth = socialNavWidth + socialTabContentWidthFixed;*/
		if (sessionStorage.selectedLanguage === 'ja') {
			socialNavWidth = socialNavWidth + 1.5;
			$('#socialNav').css('min-width', socialNavWidth + "%");
		} else {
			$('#socialNav').css('min-width', socialNavWidth + "%");
		}
	}
}

/**
 * The purpose of this function is to set the Message Tab width
 * as per screen size on Cell Profile page.
 */	
function setMessageNavWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.round((1.328125/100)*width);
	/*var rightGap = 354;
	var navContentsWidthFixed = 608;
	var messageTabContentWidthFixed = 122;*/
	var messageTabFixedWidth = 157;
	var messageNavWidth = (messageTabFixedWidth/(width - leftPanelWidth))*100;
	if (width>1280) {
		/*var messageNavWidth = Math.round((width - leftPanelWidth - rightGap - navContentsWidthFixed)/6);
		messageNavWidth = messageNavWidth + messageTabContentWidthFixed;*/
		$('#messageNav').css('min-width', messageNavWidth + "%");
	}
}

/**
 * The purpose of this function is to set the Log Tab width
 * as per screen size on Cell Profile page.
 */	
function setEventNavWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.round((1.328125/100)*width);
	/*var rightGap = 354;
	var navContentsWidthFixed = 608;
	var logTabContentWidthFixed = 64;*/
	var eventTabFixedWidth = 129;
	var eventNavWidth = (eventTabFixedWidth/(width - leftPanelWidth))*100;
	if (width>1280) {
		/*var logNavWidth = Math.round((width - leftPanelWidth - rightGap - navContentsWidthFixed)/6);
		logNavWidth = logNavWidth + logTabContentWidthFixed;*/
		$('#eventNav').css('min-width', eventNavWidth + "%");
	}
}

/**
 * The purpose of this function is to set the Snapshot Tab width
 * as per screen size on Cell Profile page.
 */	
function setSnapshotNavWidth(){
	var width = $(window).width();
	var leftPanelWidth = Math.round((1.328125/100)*width);
	var snapshotTabFixedWidth = 140;
	var snapshotNavWidth = (snapshotTabFixedWidth/(width - leftPanelWidth))*100;
	if (width>1280) {
		$('#snapshotNav').css('min-width', snapshotNavWidth + "%");
	}
}

/**
 * The purpose of this function is to set window width 
 * for cell profile right container.
 */	
function setRightContainerWidth(){
	var width = $(window).width();
	var leftPanelWidth = $("#leftPanel").width();
	if (width>1280) {
		//$('#rightPanel').css('width', ((width-leftPanelWidth)/width)*100 + "%");
	}
}

/**
 * The purpose of this function is to set window width 
 * for oData right container.
 */	
function setRightContainerOdataWidth(){
	var width = $(window).width();
	if (width>1280) {
		$('#rightContainerOData').css('width', ((width-273)/width)*100 + "%");
	}
}

function setFooterHeight(){
	var height = $(window).height();
	$('.innerFooter').css('top',"581px");	
	if (height>650) {
		 $('.innerFooter').css('top', (height-69) + "px");
	}
}

function setHomeFooterHeight(){
	var height = $(window).height();
	$('.innerHomeFooter').css('top',"581px");	
	if (height>650) {
		 $('.innerHomeFooter').css('top', (height-69) + "px");
	}
}

function setODataFooterHeight() {
	var height = $(window).height();
	$('.innerFooterOData').css('top',"576px");	
	if (height>650) {
		 $('.innerFooterOData').css('top', (height-74) + "px");
	}
}

function setRightContainerHomeWidth(){
	var width = $(window).width();
	if (width>1280) {
		$('#homeContainer').css('width', ((width-140)/width)*100 + "%");
	}
}

/**
 * The purpose of this function is to perform hover operation on social/message tab.
 */
function cellMenuHover() {
	$('.cellMenuHover').mouseover(function() {
		if ($(this).attr('id') == 'social') {
		$('#socialMenuDropDown').removeClass('displayNoneCellMenu');
		$('#firstChild').removeClass('selected');
		$('#secondChild').removeClass('selected');
		$('#lastChild').removeClass('selected');
		$('.socialMenuDropDown li a').each(function() {
			$(this).addClass("anchorColor");
		});
	} else if ($(this).attr('id') == 'messageTab'){
		$('#messageMenuDropDown').removeClass('displayNoneCellMenu');
		$('#messageFirstChild').removeClass('selected');
		$('#messageLastChild').removeClass('selected');
		$('.messageMenuDropDown li a').each(function() {
			$(this).addClass("anchorColor");
		});
	}
	} 
	);
}

/**
 * The purpose of this function is to maintain top and left position
 * of login section dynamically.
 */
function setDynamicLoginSection() {
	var winH = $(window).height();
	var winW = $(window).width();
	var childDivId = "#dvloginSection";
	if (winH > 484) {
		$(childDivId).css('margin-top', winH / 2 - ($(childDivId).height() / 2) - 80);
	} if (winW > 526) {
		$(childDivId).css('margin-left', winW / 2 - ($(childDivId).width() / 2));
	}
}

/**
 * The purpose of this function is to get browser details.
 * 
 * @returns jsonBrowserDetails
 */
function getBrowserDetails() {
	var jsonBrowserDetails = {};
	var userAgent = navigator.userAgent, temp;
	var browserInfo = userAgent
			.match(/(chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
	if (browserInfo && (temp = userAgent.match(/version\/([\.\d]+)/i)) != null)
		browserInfo[2] = temp[1];
	jsonBrowserDetails = {
		"BrowserName" : browserInfo[1],
		"BrowserVersion" : browserInfo[2]
	};
	return jsonBrowserDetails;
}

/**
* The purpose of this function is to set dynamic property like top,left,
* min-width, min-height for browser compatible case.
*/
function setDynaicBrowserCompatabilitySection() {
	var userAgent = navigator.userAgent;
	if (userAgent.indexOf('Chrome') >0) {
		var version = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
		if (version < 25) {
			displayIncompatibleMessage();
		} 
	} else if (userAgent.indexOf('msie') >0) {
		setIEStyling();
		displayIncompatibleMessage();
	} else if (userAgent.indexOf('Trident') >0) {
		setIEStyling();
		displayIncompatibleMessage();
	} else {
		displayIncompatibleMessage();
	}
	
	/*var jsonBrowserDetails = getBrowserDetails();
	var browserName = jsonBrowserDetails.BrowserName;
	var browserVersion = jsonBrowserDetails.BrowserVersion;
	browserName = browserName.toLowerCase();
	var arrFullVersion = browserVersion.split('.');
	var majorVersion = arrFullVersion[0];
	if (browserName === "chrome") {
		if (majorVersion < 25) {
			displayIncompatibleMessage();
		}
	} else if (browserName === "msie") {
		setIEStyling();
		//if (majorVersion <= 10) {
			displayIncompatibleMessage();
		//}
	} else {
		displayIncompatibleMessage();
	}*/
	
	/*else if (browserName === "firefox") {
		if (majorVersion < 25) {
			displayIncompatibleMessage();
		}
	} else if (browserName === "safari") {
		if (majorVersion < 5) {
			displayIncompatibleMessage();
		}
	}*/
}

/**
 * The purpose is to display browser supported messages.
 */
function displayIncompatibleMessage() {
	$("#loginForm").remove();
	$("#incompatibleBrowseMsg").show();
}

/**
 * The purpose of this function is to set styling on IE.
 */
function setIEStyling() {
	$("#logoContainer").removeClass("fjLogo");
	$("#logoContainer").addClass("fjLogoIE");
	$("#incompatibleBrowseMsg").css("font-size", "0.8em");
	$("#fullLoginFooter").css("font-size", "0.76em");
}

/**
 * The purpose of this function is set cell list slider
 * position.
 */
function setCellListSliderPosition (){
	var winH = $(window).height();
	var height = winH/2;
	if (winH > 650) {
		$("#leftPanel").css("height", winH);
		$("#dvCellListContainer").css("height", winH);
		$("#btnMinCellList").css("margin-top", height);
		$("#btnCellListSlide").css("margin-top", height-129);
		
	} else if (winH <= 650) {
		$("#leftPanel").css("height", '650px');
		$("#dvCellListContainer").css("height", '650px');
		$("#btnMinCellList").css("margin-top", '325px');
		$("#btnCellListSlide").css("margin-top", '196px');
	}
}

/**
 * The puspose of this function is to set height of cell
 * list dynamically.
 */
function setDynamicCellListHeight() {
	var viewPortHeight = $(window).height();
	var cellListHeight = viewPortHeight-174;
	if (viewPortHeight >650) {
		$("#tableDiv").css("height", cellListHeight);
		$("#rightPanel").css("height", viewPortHeight);
	} else if (viewPortHeight <= 650) {
		$("#tableDiv").css("height", '476px');
		$("#rightPanel").css("height", '650px');
	}
}

/**
 * The puspose of this function is to set height of table grid
 * dynamically.
 */
function setDynamicGridHeight() {
	var viewPortHeight = $(window).height();
	var gridHeight = viewPortHeight-244;
	if (viewPortHeight >650) {
		$("#entityGridTbody").css("max-height", gridHeight);	
	} else if (viewPortHeight <= 650) {
		$("#entityGridTbody").css("max-height", '406px');
	}
}

/**
 * The purpose of this function is to set dynamic height 
 * of unit management page.
 */
function setDynamicUnitManagementHeight() {
	var viewPortHeight = $(window).height();
	var gridHeight = viewPortHeight - 105;
	if (viewPortHeight > 650) {
		$("#scrollUnit").css("max-height", gridHeight);	
	} else if (viewPortHeight <= 650) {
		$("#scrollUnit").css("max-height", '545px');
	}
}

/**
 * The purpose of this function is to set max width of
 * unit name.
 */
function setDynamicUnitNameMaxwidth() {
	var viewPortWidth = $(window).width();
	var gridWidth = viewPortWidth - 80;
	if (viewPortWidth > 1280) {
		$("#unitName").css("max-width", gridWidth);
	} else if (viewPortWidth <= 1280) {
		$("#unitName").css("max-width", '1200px');
	}
}

function setDynamicAssignGridHeight() {
	var viewPortHeight = $(window).height();
	var gridHeight = viewPortHeight-310;
	if (viewPortHeight >650) {
		$("#assignEntityGridTbody").css("max-height", gridHeight);	
	} else if (viewPortHeight <= 650) {
		$("#assignEntityGridTbody").css("max-height", '340px');
	}
}
/**
 * The purpose of this function is to add selected class to social tab in navigation bar 
 * on its sublist selection
 */
function addSelectedClassMainNavSocial() {
	selectSocialInNavigationBar();
	$("#socialNav").addClass("selected");
	$("#boxNav").removeClass("selected");
	$("#roleNav").removeClass("selected");
	$("#accountNav").removeClass("selected");
	$("#messageNav").removeClass("selected");
	$("#eventNav").removeClass("selected");
	$("#snapshotNav").removeClass("selected");
	$("#infoNav").removeClass("selected");
}

/**
 * The purpose of this function is to add selected class to message tab in navigation bar 
 * on its sublist selection
 */
function addSelectedClassMainNavMessage() {
	selectMessageInNavigationBar();
	$("#messageNav").addClass("selected");
	$("#boxNav").removeClass("selected");
	$("#roleNav").removeClass("selected");
	$("#accountNav").removeClass("selected");
	$("#socialNav").removeClass("selected");
	$("#eventNav").removeClass("selected");
	$("#snapshotNav").removeClass("selected");
	$("#infoNav").removeClass("selected");
}

/**
 * The purpose of this function is to add selected class to event tab in navigation bar 
 * on its sublist selection
 */
function addSelectedClassMainNavEvent() {
	selectMessageInNavigationBar();
	$("#eventNav").addClass("selected");
	$("#boxNav").removeClass("selected");
	$("#roleNav").removeClass("selected");
	$("#accountNav").removeClass("selected");
	$("#socialNav").removeClass("selected");
	$("#messageNav").removeClass("selected");
	$("#snapshotNav").removeClass("selected");
	$("#infoNav").removeClass("selected");
}

/**
 * The purpose of this function is to add selected class to Box  in navigation bar. 
 * 
 */
function addSelectedClassMainNavBox() {
	$("#boxNav").addClass("selected");
	$("#socialNav").removeClass("selected");
	$("#roleNav").removeClass("selected");
	$("#accountNav").removeClass("selected");
	$("#messageNav").removeClass("selected");
	$("#eventNav").removeClass("selected");
	$("#snapshotNav").removeClass("selected");
	$("#infoNav").removeClass("selected");
}