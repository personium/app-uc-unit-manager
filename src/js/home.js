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
function home() {
}
var envtDeleteDialogBox = "environmentDeleteDialogBox";
var envtDeleteModalWindow = "environmentDeleteModalWindow";
var envtID = null;
var statusHashTable = new HashTable({
    'available'                             : 'availableStatusIconUnit',
    'not available'                         : 'notavailable',
    'can’t connect with the unit'           : 'connectionFailed',
    'failed to retrieve unit information'   : 'infoRetrivalFailed'}
);
var uHome = new home();

home.prototype.opts = {
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
        top : 'auto', // Top position relative to parent in px
        left : 'auto' // Left position relative to parent in px
};

/** Global variable to store the number of units for a user. */
home.prototype.noOfUnits            = 0;
home.prototype.resElasticSearch     = 0;
home.prototype.discStorageAvailable = 0;
home.prototype.dataStorageAvailable = 0;
home.prototype.discStorageUsed      = 0;
home.prototype.dataStorageUsed      = 0;
home.prototype.apiVersion           = '0';
/**
 * The purpose of this method is to set the table height as per viewport size.
 */
home.prototype.setDynamicServiceManagementGridtHeight = function() {
    var viewPortHeight = $(window).height();
    var gridHeight = viewPortHeight-105;
    if (viewPortHeight >650) {
        $("#serviceMgmtScroll").css("max-height", gridHeight);
    } else if (viewPortHeight <= 650) {
        $("#serviceMgmtScroll").css("max-height", '545px');
    }
};

/**
 * The purpose of this method is to set dynamic width for Unit URL and
 * Env ID in domain header.
 */
home.prototype.setDynamicWidthForDomainHeaderContents = function() {
    var viewPortWidth = $(window).width();
    var contentWidth = viewPortWidth - 13;
    var unitDetailsWidth = Math.round((contentWidth - (1/5)*contentWidth));
    var leftDomainWidth = Math.round(((50/100)*unitDetailsWidth) - 15 - 51 - 15);
    var rightDomainWidth = (unitDetailsWidth - leftDomainWidth - 15 - 51 - 30 - 15 - 5 - 4);
    var envIDWidth = (rightDomainWidth - 41);//Math.round(((49/100)*unitDetailsWidth) - 51);
    if (viewPortWidth > 1280) {
        $("#domainURLText").css("max-width", leftDomainWidth + "px");
        $("#envIDText").css("max-width", envIDWidth + "px");
    } else{
        $("#domainURLText").css("max-width", "445px");
        $("#envIDText").css("max-width", "410px");
    }
};

/**
 * The purpose of this method is to set dynamic width for Unit Name and
 * UnitID.
 */
home.prototype.setDynamicWidthForUnitHeaderContents = function() {
    var viewPortWidth = $(window).width();
    var contentWidth = viewPortWidth - 13;
    var unitDetailsWidth = Math.round((contentWidth - (1/5)*contentWidth));
    var leftUnitWidth = 0;
    var rightUnitWidth = 0;
    for(var index = 0; index < uHome.noOfUnits; index++){
        if($("#notificationIcon_"+index).is(":visible")){
            leftUnitWidth = Math.round(((50/100)*unitDetailsWidth) - 15 - 20 - 8 - 15);
            rightUnitWidth = (unitDetailsWidth - leftUnitWidth - 15 - 20 - 8 - 30 - 39 - 5 - 15 - 4);
            if (viewPortWidth > 1280) {
                $("#unitName_"+index).css("max-width", leftUnitWidth + "px");
                $("#unitId_"+index).css("max-width", rightUnitWidth + "px");
            } else{
                $("#unitName_"+index).css("max-width", "467px");
                $("#unitId_"+index).css("max-width", "410px");
            }
        }else{
            leftUnitWidth = Math.round(((50/100)*unitDetailsWidth) - 15 - 15);
            rightUnitWidth = (unitDetailsWidth - leftUnitWidth - 15 - 30 - 39 - 5 - 15 - 4);
            if (viewPortWidth > 1280) {
                $("#unitName_"+index).css("max-width", leftUnitWidth + "px");
                $("#unitId_"+index).css("max-width", rightUnitWidth + "px");
            } else{
                $("#unitName_"+index).css("max-width", "495px");
                $("#unitId_"+index).css("max-width", "410px");
            }
        }
        
    }
};

/**
 * The purpose of this function is to load home page.
 */
home.prototype.loadHomePage = function() {
    var objCommon = new common();
    $(".header").hide();
    $(".homeFooter").hide();
    $(".leftPanelHomePage").hide();
    $("#homeMainContainer").hide();
    var target = document.getElementById('spinner');
    var spinner = new Spinner(objCommon.optsCommon).spin(target);

    $("#unitContent").load(
            sessionStorage.contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/ServiceManagement.html',
            function() {
                $(".header").show();
                $(".leftPanelHomePage").show();
                uHome.getPrivilegeByID();
                uHome.fetchAvailableUnitURLsList1();
                $("#homeMainContainer").show();
                var timeZone = uHome.getTimeZone();
                var shortTimeZone = null;
                if (uTimeZone.timeZoneHashTable.hasItem(timeZone)) {
                    shortTimeZone = uTimeZone.timeZoneHashTable.getItem(timeZone);
                }
                sessionStorage.timeZone = shortTimeZone;
                uHome.setDynamicServiceManagementGridtHeight();
                uHome.setDynamicWidthForDomainHeaderContents();
                uHome.setDynamicWidthForUnitHeaderContents();
                uHome.setDynamicOrgNameWidth();
                uHome.disableConfigureUnitButton();
                uHome.setTabColorWhenServiceMgmtSelected();
                //uHome.getPrivilegeByID();
                spinner.stop();
            });
};

/**
 * The purpose of this function is to return the time zone.
 * 
 * @returns
 */
home.prototype.getTimeZone = function () {
    var date = new Date();
    var strDate = date.toString();
    var fullTimeZoneValue = null;
    var regex = /[\u3000-\u303F]|[\u3040-\u309F]|[\u30A0-\u30FF]|[\uFF00-\uFFEF]|[\u4E00-\u9FAF]|[\u2605-\u2606]|[\u2190-\u2195]|\u203B/g;
    if (strDate != null) {
        var hasJapaneseCharacters = regex.test(strDate);
        if (hasJapaneseCharacters) {
            fullTimeZoneValue = "Japan Standard Time";
        } else {
            var timeZone = strDate.split("(");
            fullTimeZoneValue = objCommon.getBoxSubstring(timeZone[1]);
        }
    }
    return fullTimeZoneValue;
};

/**
 * The purpose of this function is to disable configuration unit
 * button for user privilege.
 */
home.prototype.disableConfigureUnitButton = function () {
    var privilege = sessionStorage.loggedInUserPrivilege;
    var USER ="user";
    if(privilege.toLowerCase() == USER.toLowerCase()) {
        $('.btnConfigurationUnit').css('background-color', '#e8e8e8');
        $('.btnConfigurationUnit').css('color', '#9d9d9d');
        $('.btnConfigurationUnit').css('cursor', 'default');
        $('.btnConfigurationUnit').removeAttr("onclick");
        $('.configUnitIcon').removeClass("configureUnitIcon");
        $('.configUnitIcon').addClass("disableConfigureUnitIcon");
    }
};

/**
 * The purpose of this function is to display access rights message.
 */
home.prototype.displayAccesRightsMessage = function () {
    $("#dvemptyTableUserPrivilegeMessage").text("Only privileged user can access Administrator Management");
    $("#dvemptyTableUserPrivilegeMessage").css("width",368 + "px");
    $("#dvemptyTableUserPrivilegeMessage").show();
    //$("#createUser").hide();
    $("#adminMgmtTableDiv").hide();
    $("#adminMgmtHead").hide();
};

/**
 * The purpose of this function is to display users table.
 */
home.prototype.displayUsersTable = function () {
    $("#dvemptyTableUserPrivilegeMessage").hide();
    //$("#createUser").show();
    uAdministratorManagement.fetchActiveUsersList();
    $("#adminMgmtTableDiv").show();
    $("#adminMgmtHead").show();
};

/**
 * The purpose of this method is to set the gap between navigation icons
 * dynamically on change of view prt size.
 */
home.prototype.setNavigationGap = function(){
    var width = $(window).width();
    var minGap = (35/1280);
    var dynamicGap = (minGap*width);
    if (width > 1280) {
        $('.adminMgmtWrapper').css('margin-left', (dynamicGap) + "px");
    } else{
        $('.adminMgmtWrapper').css('margin-left', "35px");
    }
};

/**
 * The purpose of this method is to set hovering changes on Navigation Bar.
 */
home.prototype.hoverEffectNavigationBar = function(){
    $(".serviceMgmtWrapper").hover(function(){
         $("#serviceMgmtIcon").removeClass("serviceMgmtIconGrey");
         $("#serviceMgmtIcon").addClass("serviceMgmtIconRed");
         $("#serviceMgmtTxt").removeClass("serviceMgmtTxtGrey");
         $("#serviceMgmtTxt").addClass("serviceMgmtTxtRed");
         $(".serviceMgmtWrapper").css("cursor","pointer");
      },function(){
          if(!$("#serviceMgmtWrapper").hasClass("selected")){
              $("#serviceMgmtIcon").addClass("serviceMgmtIconGrey");
              $("#serviceMgmtIcon").removeClass("serviceMgmtIconRed");
              $("#serviceMgmtTxt").addClass("serviceMgmtTxtGrey");
              $("#serviceMgmtTxt").removeClass("serviceMgmtTxtRed");
              $(".serviceMgmtWrapper").css("cursor","default");
          }
    });
    $(".adminMgmtWrapper").hover(function(){
         $("#adminMgmtIcon").removeClass("adminMgmtIconGrey");
         $("#adminMgmtIcon").addClass("adminMgmtIconRed");
         $("#adminMgmtTxt").removeClass("adminMgmtTxtGrey");
         $("#adminMgmtTxt").addClass("adminMgmtTxtRed");
         $(".adminMgmtWrapper").css("cursor","pointer");
      },function(){
          if(!$("#adminMgmtWrapper").hasClass("selected")){
              $("#adminMgmtIcon").addClass("adminMgmtIconGrey");
              $("#adminMgmtIcon").removeClass("adminMgmtIconRed");
              $("#adminMgmtTxt").addClass("adminMgmtTxtGrey");
              $("#adminMgmtTxt").removeClass("adminMgmtTxtRed");
              $(".adminMgmtWrapper").css("cursor","default");
          }
    });
};

/**
 * The purpose of this method is to set tab css when
 * Service Management Tab is clicked.
 */
home.prototype.setTabColorWhenServiceMgmtSelected = function(){
    $("#serviceMgmtWrapper").addClass("selected");
    $("#adminMgmtWrapper").removeClass("selected");
    $("#adminMgmtIcon").addClass("adminMgmtIconGrey");
    $("#adminMgmtIcon").removeClass("adminMgmtIconRed");
    $("#adminMgmtTxt").addClass("adminMgmtTxtGrey");
    $("#adminMgmtTxt").removeClass("adminMgmtTxtRed");
    $("#serviceMgmtIcon").removeClass("serviceMgmtIconGrey");
    $("#serviceMgmtIcon").addClass("serviceMgmtIconRed");
    $("#serviceMgmtTxt").removeClass("serviceMgmtTxtGrey");
    $("#serviceMgmtTxt").addClass("serviceMgmtTxtRed");
    $("#serviceManagmentHeader").show();
};

/**
 * The purpose of this method is to set tab css when
 * Administrator Management Tab is clicked.
 */
home.prototype.setTabColorWhenAdminMgmtSelected = function(){
    $("#serviceMgmtIcon").removeClass("serviceMgmtIconRed");
    $("#serviceMgmtTxt").removeClass("serviceMgmtTxtRed");
    $("#serviceMgmtIcon").addClass("serviceMgmtIconGrey");
    $("#serviceMgmtTxt").addClass("serviceMgmtTxtGrey");
    $("#serviceMgmtWrapper").removeClass("selected");
    $("#adminMgmtWrapper").addClass("selected");
    $("#adminMgmtIcon").removeClass("adminMgmtIconGrey");
    $("#adminMgmtIcon").addClass("adminMgmtIconRed");
    $("#adminMgmtTxt").removeClass("adminMgmtTxtGrey");
    $("#adminMgmtTxt").addClass("adminMgmtTxtRed");
    $("#serviceManagmentHeader").hide();
};

/**
 * The purpose of this function is to redirect to environment management
 * page on click of environment management.
 */
home.prototype.clickEnvironmentManagement = function() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        uHome.setTabColorWhenServiceMgmtSelected();
        $("#unitContent" ).hide();
    //  $("#homePageRightContainer").hide();
        var target = document.getElementById('spinner');
        var serviceMgmtOpts = uHome.opts;
        serviceMgmtOpts.top = '190';
        var spinner = new Spinner(serviceMgmtOpts).spin(target);
        $('.dvEnvTable').addClass('dvAdmin');
        $("#unitContent").load(
                sessionStorage.contextRoot
                        + '/htmls/'+sessionStorage.selectedLanguage+'/ServiceManagement.html', function() {
                    uHome.fetchAvailableUnitURLsList1();
                    uHome.disableConfigureUnitButton();
                    $('.dvEnvTable').removeClass('dvAdmin');
                    $("#unitContent").show();
                    uHome.setDynamicServiceManagementGridtHeight();
                    uHome.getPrivilegeByID();
                    spinner.stop();
                });
    } else {
        window.location.href = sessionStorage.contextRoot;
    }
};

/**
 * The purpose of this function is to redirect to administrator management page
 * on click of administrator management.
 */
home.prototype.clickAdministratorManagement = function() {
    $("#unitContent" ).hide();
    $("#adminMgmt").css('cursor','pointer');
    var id = objCommon.isSessionExist();
    if (id != null) {
        uHome.setTabColorWhenAdminMgmtSelected();
        var privilegeJSON = uHome.retrieveUserPrivilege();
        var privilege = privilegeJSON["privilege"];
        sessionStorage.loggedInUserPrivilege = privilege;
        $("#homePageRightContainer").hide();
        var target = document.getElementById('spinner');
        var adminMgmtOpts = uHome.opts;
        var winH=$(window).height();
        winH = (winH-155)/2;
        adminMgmtOpts.top = winH.toString();
        var spinner = new Spinner(adminMgmtOpts).spin(target);
        $("#unitContent").load(sessionStorage.contextRoot+'/htmls/'+sessionStorage.selectedLanguage+'/administratorManagement.html', function() {
            if (privilege == "user") {
                uHome.displayAccesRightsMessage();
            } else {
                uHome.displayUsersTable();
            }
            $('.dvEnvTable').addClass('dvAdmin');
            $("#unitContent").show();
            uAdministratorManagement.setScrollableHeightForAdminMgmt();
            //uAdministratorManagement.setColumnEllipsisWidth();
            uAdministratorManagement.setMarginForMaxUserLimitMsg();
            uAdministratorManagement.setPositionForUserPrivilegeMsg();
            //uAdministratorManagement.setMarginForSuccessMsg();
            spinner.stop();
        });
    } else {
        window.location.href = sessionStorage.contextRoot;
    }
};

/**
 * The purpose of this function is to retrieve privilege of the 
 * logged in user.
 * 
 * @returns {String}
 */
home.prototype.retrieveUserPrivilege = function () {
    var privilegeJSON = "";
    $.ajax({
        dataType : 'json',
        url : '../../home',
        type : 'GET',
        async : false,
        cache : false,
        success : function(jsonData) {
            if(jsonData.privilege == "sessionTimeOut"){
                uCreateEnvironment.performLogout();
            }else{
                privilegeJSON = jsonData;
            }
        },
        error : function(jsonData) {
            uCreateEnvironment.performLogout();
        }
    });
    return privilegeJSON;
};

/**
 * The purpose of this function is to fetch available unit URLs and environment list.
 */
home.prototype.fetchAvailableUnitURLsList = function() {
    $.ajax({
        dataType : 'json',
        url : '../../Login',
        type : 'GET',
        async : false,
        cache : false,
        success : function(jsonData) {
            uHome.displayUnitURLList(jsonData);
        },
        error : function(jsonData) {
        }
    });
};

/**
 * The purpose of this function is to fetch available unit URLs and environment list.
 */
home.prototype.fetchAvailableUnitURLsList1 = function() {
    $.ajax({
        dataType : 'json',
        url : '../../Login',
        type : 'GET',
        async : false,
        cache : false,
        success : function(jsonData) {
            $("#lblOrgName").text(jsonData.organizationName);
            $("#lblOrgName").attr('title', jsonData.organizationName);
            uHome.displayUnitURLList1(jsonData);
        },
        error : function(jsonData) {
        }
    });
};

/**
 * The purpose of this function is to display unit URL and environment list.
 * @param jsonData
 */
home.prototype.displayUnitURLList = function(jsonData) {

    var countUnitURL = 0;
    //var totalUnitUrlCount =  Object.keys(jsonData).length;
    var totalUnitUrlCount = 0;
    var dynamicURLList = "";
    var envList = "";
    dynamicURLList += "<tbody class='scrollEnv'>";
    for ( var unitID in jsonData.unitURLList) {
    totalUnitUrlCount++;
        var unitData = jsonData.unitURLList[unitID];
        var unitURL = unitData[1];
        var selectedUnitUrl = "'" + unitURL + "'";
        // var shorterUnitURL = objCommon.getShorterEntityName(unitURL, true);
        dynamicURLList += "<tr><td colspan='2' class='unitURL'><div id ='unitUrl_"
                + unitID
                + "' class='unitURLText' title='"
                + unitURL
                + "'>"
                + unitURL
                + "</div></td></tr>";
        var allEnvDetail = jsonData.environmentList[unitURL];
        if (allEnvDetail.length > 0) {
        for ( var i = 0; i < allEnvDetail.length; i++) {
                envList = allEnvDetail[i];
                var envID = envList[0];
                var envName = envList[1];
                var selectedEnvName = "'" + envName + "'";
                var selectedEnvID = "'" + envID + "'";
                dynamicURLList += '<tr><td style="width:40%;padding-top:8px;"><div id ="envNameId_'
                        + i
                        + '"  class="addSpace cursorPointer envNameCol" title="'
                        + envName
                        + '" onclick = "uHome.getEnvDetail('
                        + selectedEnvName
                        + ','
                        + selectedUnitUrl
                        + ','
                        + selectedEnvID
                        + ')">'
                        + envName
                        + '</div></td><td class="envIDCol"><div class="envIDColText" title="'
                        + envID
                        + '">Environment ID: '
                        + envID
                        + '</div></td><td class ="tdDelete" style="display:none;width:1%" id="tdDelete_'
                        + i
                        + '"><div title="Delete" id="dvDelete_'
                        + i
                        + '""  class="  homePageDeleteButton disableDeleteText">Delete</div></td></tr>';
            }
        }
        else {
            if (allEnvDetail.length == 0) {
                countUnitURL++;
            }
        }
        document.getElementById("dvEmptyEnvironmentMessage").style.display = "none";
        if (totalUnitUrlCount == countUnitURL) {
            countUnitURL = 0;
            document.getElementById("dvEmptyEnvironmentMessage").style.display = "inline-block";
        }
    }
    dynamicURLList += "</tbody>";
    var CSRFTokenDisplayEnvironment = sessionStorage.requestId;
    $("#CSRFTokenDisplayEnvironment").val(CSRFTokenDisplayEnvironment);
    $("#envDetailsTable").html(dynamicURLList);
};

/**
 * The purpose of this method is to get the number of objects in a map.
 * @param obj
 * @returns {Number}
 */
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

/**
 * The purpose of this function is to display unit URL and environment list.
 * @param jsonData
 */
home.prototype.displayUnitURLList1 = function(jsonData) {
    var dynamicURLList      ='';
/*  var apiVersion          = '';*/
    var showNotification    = false;
    var unitData            = '';
    var unitID              = '';
    var unitURL             = '';
    var planType            ='';
/*  var envID               = '';
    var diskStorage         ='';
    var odataStorage        = '';*/
    var status              = true;
    var clickEnvironment    = '';
    var selectedUnitUrl     = '';
    var mail                = '';
    var mailPort            = '';
    var globalIP            = '';
    var statusClass         = '';
/*  var statusWidth         = '';*/
    var marginLeft          = '25px'; 
    var counter             = 0;
    var showPerc            = 1;
    var OpenCellListButton  = 0;
    var isAvailable         = 1;
    var unitDisplayID       = '';
    //alert('isAvailable--->' + isAvailable);
    uHome.noOfUnits = Object.size(jsonData.unitURLList);
    for ( var ID in jsonData.unitURLList) {

        unitData                = jsonData.unitURLList[ID];
        unitID                  = unitData[0];
        unitURL                 = unitData[1];
        selectedUnitUrl         = "'" + unitURL + "'";
        serviceName             = unitData[2];
        planType                = unitData[3];
        //status                    = unitData[4];
        mail                    = unitData[4];
        mailPort                = unitData[5];
        //diskStorageAvailable  = unitData[7];
        //dataStorageAvailable  = unitData[8];
        UserType                = unitData[6];
        globalIP                = unitData[8];
        isAvailable             = unitData[9];
        unitDisplayID           = unitData[10];
        OpenCellListButton      = 1;
        
        showNotification        = false;
        showNotification        = jsonData.notificationStatusList[ID];
        status                  = 'Available';
        diskStorageAvailable    = 0;
        dataStorageAvailable    = 0;
        diskStorageUsed         = 0;
        dataStorageUsed         = 0;
        uHome.apiVersion        = '';
        showPerc                = 0;
        storageDiskUsedPerc     = 0;
        dataDiskUsedPerc        = 0;
        //alert('isAvailable--->' + isAvailable);
        if (isAvailable==0 || !uHome.validateSchemaURL(unitURL)) {
            status              = 'Not Available';
            OpenCellListButton  = 0;

        } else {
            uHome.getAPIVersion(unitURL);
            //alert('apiversion---->' + uHome.apiVersion);
            if(uHome.apiVersion=='0'){
                uHome.apiVersion            = '';
                status              = 'Can’t connect with the unit';
                OpenCellListButton  = 0;

            } else {
                uHome.getStatusData(unitURL);

                if(uHome.resElasticSearch==0){
                    status                  = 'Failed to retrieve unit information';
                } else {
                    diskStorageAvailable    = uHome.discStorageAvailable;
                    dataStorageAvailable    = uHome.dataStorageAvailable;
                    diskStorageUsed         = uHome.discStorageUsed;
                    dataStorageUsed         = uHome.dataStorageUsed;
                    showPerc                = 1;
                    storageDiskUsedPerc     = Math.round((diskStorageUsed/diskStorageAvailable)*100);
                    dataDiskUsedPerc        = Math.round((dataStorageUsed/dataStorageAvailable)*100);
                }
            }
        }
        var txtstorageDiskUsedPerc  = storageDiskUsedPerc + "%";
        var txtdataDiskUsedPerc     = dataDiskUsedPerc + "%";
        
        if (statusHashTable.hasItem(status.toLowerCase())) {
            statusClass = statusHashTable.getItem(status.toLowerCase());
        }
        
        statusWidth ='140';
        marginLeft  = '3.5%';
        if(status.toLowerCase() ==='active' || status.toLowerCase()==='inactive') {
            statusWidth = '25';
            marginLeft = '6.5%';
        }

        var allEnvDetail = jsonData.environmentList[unitURL];
        var envID = null;
        if (allEnvDetail.length > 0) {
            var envList         = allEnvDetail[0];
            envID               = envList[0];
            var envName         = envList[1];
            var selectedEnvName = "'" + envName + "'";
            var selectedEnvID   = "'" + envID + "'";

            clickEnvironment    = 'onclick = "uHome.getEnvDetail(' + selectedEnvName + ',' + selectedUnitUrl + ',' + selectedEnvID + ')"';
        }else {
            OpenCellListButton = 0;
        }
            
        var unitMgmntUnitID         = '"' + unitID + '"';
        var unitMgmntUnitName       = serviceName.replace(/'/g, "&#39;");
        unitMgmntUnitName           = unitMgmntUnitName.replace(/"/g, "↔");
        unitMgmntUnitName           = '"' + unitMgmntUnitName + '"';
        var unitMgmntAPIVersion     = '"' + uHome.apiVersion + '"';
        var unitMgmntStatus         = '"' + status + '"';
        var unitMgmntPlan           = '"' + planType + '"';
        var unitMgmntDomain         = '"' + unitURL + '"';
        var unitMgmntEnvID          = '"' + envID + '"';
        var unitMgmntTotalDiskSpace = '"' + diskStorageAvailable + '"';
        var unitMgmntMail           = '"' + mail + '"';
        var unitMgmntMailPort       = '"' + mailPort + '"';
        var unitMgmntGlobalIP       = '"' + globalIP + '"';
        var unitMgmntstorageDiskUsedPerc = '"' + storageDiskUsedPerc + '"';
        var unitMgmntstorageDiskUsed= '"' + diskStorageUsed + '"';
        var unitMgmntDatabaseUsed= '"' + dataStorageUsed + '"';
        var unitMgmntDatabaseUsedPerc = '"' + dataDiskUsedPerc + '"';
        var unitMgmntTotalDatabaseUsed= '"' + dataStorageAvailable + '"';
        
    
        if (storageDiskUsedPerc==0 && showPerc==0) {
            txtstorageDiskUsedPerc ="";
            txtdataDiskUsedPerc ="";
        }
        
        classEnvBtn = "class='EnvBtnEnabled ContentHeading1 backgroundcolor4 border2'";
        if (sessionStorage.selectedLanguage == 'ja') {
            classEnvBtn = "class='EnvBtnEnabled ContentHeading1 backgroundcolor4 border2 openCellListWidth'";
        }

        if(OpenCellListButton==0) {
            clickEnvironment ='';
            classEnvBtn = "class='EnvBtnDisabled ContentHeading1 backgroundcolor4 border2'";
            if (sessionStorage.selectedLanguage == 'ja') {
                classEnvBtn = "class='EnvBtnDisabled ContentHeading1 backgroundcolor4 border2 openCellListWidth'";
            }
        }
        var dynamicStatusWidth = '100px';
        if (sessionStorage.selectedLanguage === 'ja') {
            dynamicStatusWidth = '118px';
        }
        dynamicURLList += "<div id='midcol' class='backgroundcolor2 border' style='height:178px;position:relative'>";
        dynamicURLList += "<div id='unitHeader' class='backgroundcolor3'>";
            if (showNotification) {
                dynamicURLList += "<div id='notificationIcon_"+ counter +"' class='notificationIcon' style='float:left;width:20px;margin-top:6px;margin-left:15px;'></div>";
                dynamicURLList += "<div class='Heading2 unitNameText' style='margin-top:6px;margin-right:15px;margin-left:8px;' id='unitName_"+ counter +"'>"+ serviceName + "</div>" +
                "<div class='ContentHeading1' style='text-align:right;float:right;margin-top:9px;margin-right:15px;margin-left:15px;'><div style='float:left;margin-right:5px;'>"+getUiProps().LBL0008+":</div><div class='ContentText1 unitIdText' id='unitId_"+ counter +"' title='"+ unitDisplayID +"'>" + unitDisplayID + "</div></div>" +
                "</div>";
            } else {
                dynamicURLList += "<div id='notificationIcon_"+ counter +"' style='float:left;width:32px;height:10px;margin-top:6px;margin-left:3px;display:none;'></div>";
                dynamicURLList += "<div class='Heading2 unitNameText' style='margin-top:6px;margin-right:15px;margin-left:15px;' id='unitName_"+ counter +"'>"+ serviceName + "</div>" +
                "<div class='ContentHeading1' style='text-align:right;float:right;margin-top:9px;margin-right:15px;margin-left:15px;'><div style='float:left;margin-right:5px;'>"+getUiProps().LBL0008+":</div><div class='ContentText1 unitIdText' id='unitId_"+ counter +"' title='"+ unitDisplayID  +"'>" + unitDisplayID + "</div></div>" +
                "</div>";
            }
            /*dynamicURLList += "<div class='Heading2' style='float:left;width:400px;margin-top:6px;margin-right:10px;margin-left:8px;'>"+ serviceName + "</div>" +
            "<div class='ContentHeading1' style='text-align:right;float:right;width:200px;margin-top:9px;margin-right:15px;'><div>Unit ID : <span class='ContentText1'>" + unitID + "</div>" +
            "</div>";*/
            dynamicURLList += "<div id='DomainHeader'>" +
                "<div id='leftDomain' class='ContentHeading1 ellipsis' style='float:left;margin-top:15px;margin-left:15px;margin-right:30px;height: 17px;'><div style='float:left;width:51px;'>"+getUiProps().LBL0001+": </div><div class='ContentText1 domainURLText' id='domainURLText' title='" + unitURL + "'>"+ unitURL +"</div></div>" +
                "<div class='ContentHeading1 ellipsis' style='width:150px;float:left;margin-left:90px;margin-top:15px;'>"+getUiProps().LBL0003+": <span class='ContentText1'>" + uHome.apiVersion +"</span></div>" +
                "<div id='rightDomain' class='ContentHeading1' style='float:right;margin-top:15px;margin-right:15px;height: 17px;text-align:right;'><div style='float:left;width:41px;'>"+getUiProps().LBL0009+": </div><div class='ContentText1 envIDText' id='envIDText' title='" + envID + "'>"+ envID +"</div></div>" +
            "</div>";
            dynamicURLList += "<div id='UnitInfo' style='margin-top: 16px;'>" +
                "<div class='ContentHeading1 ellipsis' style='width:80px; float:left;margin-left: 15px;'>"+getUiProps().LBL0002+": <span class='ContentText1'>"+ planType + "</span></div>";

            dynamicURLList += "<div class='ContentHeading1' style='width:57px; float:left;margin-left: " + marginLeft + ";'>"+getUiProps().LBL0004+": </div>" +
                "<div style='margin-left:85;width:60px;height:16px;margin-top:1px; border:0.5px solid black; float:left;border-radius: 5px;background: linear-gradient(to right, orange 0%,orange "+ storageDiskUsedPerc +"%,#e0e0e0 "+ storageDiskUsedPerc +"%,#e0e0e0 100%);'></div>" +
                "<label style='float: left;margin-left: 6px;' class='ContentText1'>" + txtstorageDiskUsedPerc + "</label>"+
                "<div class='ContentHeading1 marginRight10 marginTop5'style='width:69px;float:left;margin-left: " + marginLeft + ";'>"+getUiProps().LBL0005+": </div>" +
                "<div style='margin-left:85;width:60px;height:16px;margin-top:1px; border:0.5px solid black;  float:left;border-radius: 5px;background: linear-gradient(to right, orange 0%,orange "+ dataDiskUsedPerc +"%,#e0e0e0 "+ dataDiskUsedPerc +"%,#e0e0e0 100%);'></div>" +
                "<label style='float: left;margin-left: 6px;' class='ContentText1'>" + txtdataDiskUsedPerc + "</label>"+
            "</div>" +
            "<div id='EnvInfo' style='margin-top: 20px;'>" +
                "<div id='EnvBtn'" + classEnvBtn + clickEnvironment + ">" +
                    "<div class='openCellListIcon' style='width:27px;height:26px;margin-left:5px;margin-top:4px;'></div>" +
                    "<div class='ContentHeading1' style='text-align:left;float:left;margin-top:6px;margin-left:14px;color:#c80000'>"+getUiProps().LBL0010+"</div>" +
                "</div>" +
            "</div>" +
            "<div class='ContentHeading1 ellipsis' style='width:"+dynamicStatusWidth+";float:left;margin-left:15px;margin-top:3px' id='statusWidthDynamic'>"+getUiProps().LBL0006+": </div>" +
            "<div class='" + statusClass +"' style='float:left;width:25px; height:10; margin-left:-57px;'></div>" +
            "<div class='ContentText1 ellipsis' style='width:270px;float:left;margin-top:3px;margin-left: -32px;'>"+ status + "</div>" +
            
            "<div id='btnConfigurationUnit_"+counter+"' class='ContentHeading1 backgroundcolor1 btnConfigurationUnit' style='cursor:pointer;position: absolute; left: 0; bottom: 0; width: 136px; height: 25px; padding-top:5px' " +
                    "onclick='uUnitManagement.openUnitManagement("+unitMgmntUnitID+","+unitMgmntUnitName+","+unitMgmntAPIVersion+","+unitMgmntStatus+","+unitMgmntPlan+","+unitMgmntDomain+","+unitMgmntEnvID+","+unitMgmntTotalDiskSpace+","+unitMgmntMail+","+unitMgmntMailPort+","+unitMgmntGlobalIP+","+unitMgmntstorageDiskUsedPerc+","+unitMgmntstorageDiskUsed+","+unitMgmntDatabaseUsed+","+unitMgmntDatabaseUsedPerc+","+unitMgmntTotalDatabaseUsed+");'>" +
                "<div class='configureUnitIcon configUnitIcon' style='width:32px;margin:2px 0px 0px 5px;'></div>" +
                "<div style='text-align:left;float:left;margin:2px 0px 0px 3px;'>"+getUiProps().LBL0007+"</div>" +
            "</div>" +
        "</div>";
            if(uHome.noOfUnits == (counter+1)){
                dynamicURLList += "<div id='whiteSpace' style='height:28px;background-color:white'></div>";
            }else{
                dynamicURLList += "<div id='whiteSpace' style='height:35px;background-color:white'></div>";
            }
            counter++;
    }

    $("#mainServiceManagement").html(dynamicURLList);
};

/**
 * The purpose of this function to get the API version of the unit.
 */
home.prototype.getAPIVersion = function(requestURL){
    var unitUrl = requestURL + "__ctl/Cell";
    var CSRFTokenAPIVersion = sessionStorage.requestId;
    $.ajax({
        dataType    : 'json',
        url         : '../../home',
        type        : 'POST',
        data        : {
            operation   : 'APIVersion',
            unitUrl : unitUrl,
            CSRFTokenAPIVersion : CSRFTokenAPIVersion
        },
        async   : true,
        cache   : false,
        success : function(response) {
            uHome.apiVersion ='0';
        },
        error : function(response) {
            uHome.apiVersion ='';
        }
    });
    return true;
};

/**
 * The purpose of this function to get the API version of the unit.
 */
function getElasticSearchDavResponse(json) {
    var data                    = json.diskSpaceResponse;
    var jsonData                = JSON.parse(data);
    var statusData              = jsonData.status;
    var volumeStatus            = statusData.volumeStatus;
    uHome.resElasticSearch      = 0;
    uHome.dataStorageAvailable  = 1;
    uHome.discStorageAvailable  = 1;
    uHome.dataStorageUsed       = 0;
    uHome.discStorageUsed       = 0;
    for (var i = 0; i< volumeStatus.length; i++) {
        uHome.resElasticSearch  = 1;
        var volume              = volumeStatus[i].volume;
        if (volume == 'elasticsearch1') {
            if(volumeStatus[i].allocatedDiskSize!==undefined){
                uHome.dataStorageAvailable  = volumeStatus[i].allocatedDiskSize;
                uHome.dataStorageUsed       = volumeStatus[i].usedDiskSize;
            }
        }

        if (volume == 'dav') {
            if(volumeStatus[i].allocatedDiskSize!==undefined){
                uHome.discStorageAvailable  = volumeStatus[i].allocatedDiskSize;
                uHome.discStorageUsed       = volumeStatus[i].usedDiskSize;
            }
        }
    }
    return true;
};

/**
 * The purpose of this function to get the Dav/Disc data from unit.
 */
home.prototype.getStatusData = function(requestURL) {
    var unitUrl = requestURL + "__mx/stats";
    var CSRFTokenDiscSpace = sessionStorage.requestId;
    $.ajax({
        dataType    : 'json',
        url         : '../../home',
        type        : 'POST',
        data        : {
            operation   : 'DiscSpace',
            unitUrl : unitUrl,
            CSRFTokenDiscSpace : CSRFTokenDiscSpace
        },
        async   : false,
        cache   : false,
        success : function(response) {
            if (response.sessionTimeOut != "sessionTimeOut") {
                getElasticSearchDavResponse(response);
        }
        },
        error : function(response) {
            uHome.resElasticSearch = 0;
        }
    });
    return true;
};

/**
 * The purpose of this function is to get selected environment and unit
 * URLdetails.
 * @param envName
 * @param unitURL
 */
home.prototype.getEnvDetail = function(envPass, unitURL, envID) {
    //var isEnvtWindowOpened = true;
    //isEnvtWindowOpened = objCommon.isMultipleTabsOpened(envID);
    //if (isEnvtWindowOpened == false) {
        //objCommon.addEnvironmentIds(envID);
        uHome.setEnvironmentVariablesInLocalStorage(envID, envPass, unitURL);
        window.open(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/environment.jsp','_blank');
    //}
};

/**
 * The purpose of this function is to Store selected environment and unit
 * @param envName
 * @param unitURL
 * @param envID
 */
home.prototype.storeEnvDetails = function() {
    uHome.getUserPrivilege();
};

/**
 * The purpose of this function is retrieve user privilege.
 * 
 * @param jsonData
 */
home.prototype.getUserPrivilege = function() {
    var target = sessionStorage.selectedUnitUrl;
    var targetCellUrl = target + sessionStorage.selectedUnitCellName;
    let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
    let tokenCredential = {
        grant_type: "refresh_token",
        refresh_token: ManagerInfo.refreshToken
    };
    if (!ManagerInfo.isCellManager) {
        $.extend(
            true,
            tokenCredential,
            {
                p_target : target
            }
        );
    } 
    $.ajax({
        dataType : 'json',
        url : targetCellUrl + '/__token' ,//+ tokenUrl,
        data : tokenCredential,
        type : 'POST',
        async : false,
        cache : false,
        success : function(jsonData) {
            uHome.loadCellDetails(jsonData);
        },
        error : function(jsonData) {
        }
    });
};

/**
 * The purpose of this function is to open resource management page.
 */
home.prototype.openResourceManagement = function() {
    var target = getClientStore().baseURL;
    var token = getClientStore().token;
    var objCommon = new common();
    sessionStorage.tabName = "";
    sessionStorage.selectedcell = '';
    sessionStorage.target = target;
    sessionStorage.token = token;
    objCommon.getCellCountAndOpenPage();
    sessionStorage.isSocialGraph == "false";
    sessionStorage.isResourceMgmt == "true";
};

/**
 * The purpose of this function is to parse token retrieved in XML format.
 * 
 * @param data
 */
home.prototype.parseToken = function(data) {
    var jsonData = {};
    var accessToken = data.access_token;
    var refreshToken = data.refresh_token;
    var expiresIn = data.expires_in;
    var envName = sessionStorage.selectedEnvName;
    var unitURL = sessionStorage.selectedUnitUrl;
    jsonData["token"] = accessToken;
    jsonData["environmentName"] = envName;
    jsonData["baseURL"] = unitURL;
    jsonData["refreshToken"] = refreshToken;
    jsonData["expiresIn"] = expiresIn;
    setClientStore(jsonData);
    sessionStorage.tokenCreationDateTime = new Date().getTime();
};

/**
 * The purpose of this function is to load cell profile page.
 */
home.prototype.loadCellDetails = function(data) {
    uHome.parseToken(data);
    var token = getClientStore().token;
    var refreshToken = getClientStore().refreshToken;
    var expiresIn = getClientStore().expiresIn;
    sessionStorage.tempToken = token;
    sessionStorage.tempRefreshToken = refreshToken;
    sessionStorage.tempExpiresIn = expiresIn;
    uHome.openResourceManagement();
};

// DELETE ENVIRONMENT START
/**
 * This method opens up a new pop up window for Deleting environment .
 * 
 * @param idDialogBox
 * @param idModalWindow
 * @param selectedEnvID
 */
home.prototype.openPopUpWindow = function(idDialogBox, idModalWindow,
        selectedEnvID) {
    envtID = selectedEnvID;
    $(idModalWindow).fadeIn(1000);
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    $(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
    $(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
};

/**
 * This functions performs log out operation.
 */
home.prototype.performLogout = function() {
    var contextRoot = sessionStorage.contextRoot;
    window.location.href = contextRoot;
};

/**
 * The purpose of the following method is to display notification message.
 */
home.prototype.displayNotificationMessage = function() {
    var message = "Environment deleted successfully";
    objOdataCommon.displaySuccessMessage("#editUserInfoModal", message, "");
    $('#environmentDeleteModalWindow, .window').hide();
    uHome.fetchAvailableUnitURLsList();
    uHome.getPrivilegeByID();
};

/**
 * The purpose of the following method id to delete environment.
 */
home.prototype.deleteEnvironment = function() {
    $.ajax({
        data : {
            envID : envtID
        },
        dataType : 'json',
        url : '../../DeleteEnvironment',
        type : 'POST',
        cache : false,
        success : function(jsonData) {
            if (jsonData['deleteEnvtResult'] == "sessionTimeOut") {
                uHome.performLogout();
            } else if (jsonData['deleteEnvtResult'] == "success") {
                // Display Success Message.
                uHome.displayNotificationMessage();
            }
        },
        error : function(jsonData) {
        }
    });
};

/**
 * The purpose of the following method is to display delete button,should the
 * privilege happens to be ADMIN.
 * 
 * @param jsonData
 * @returns
 */
home.prototype.showDeleteButton = function(jsonData) {
    var privilege = jsonData.privilege;
    sessionStorage.loggedInUserPrivilege = privilege;
    var ADMIN = "administrator";
    var SUBSCRIBER = "subscriber";
    var USER ="user";
    if (privilege.toLowerCase() == ADMIN.toLowerCase() || privilege.toLowerCase() == SUBSCRIBER.toLowerCase()) {
        $('.tdDelete').show();
        $('#btnCreateEnvironment').show();
    }
    else if(privilege.toLowerCase() == USER.toLowerCase()) {
        $('.tdDelete').hide();
        $('#btnCreateEnvironment').hide();
    }
    return privilege;
};

/**
 * The purpose of the following method is to get Privilege of a user.
 */
home.prototype.getPrivilegeByID = function() {
    $.ajax({
        dataType : 'json',
        url : '../../home',
        type : 'GET',
        async : false,
        cache : false,
        success : function(jsonData) {
            if (jsonData.privilege == "sessionTimeOut") {
                uCreateEnvironment.performLogout();
            } else {
                uHome.showDeleteButton(jsonData);
            }
        },
        error : function(jsonData) {
            uCreateEnvironment.performLogout();
        }
    });
};

home.prototype.setEnvironmentVariables = function() {
    if (localStorage.clickedEnvironmentUnitUrl != null
            && localStorage.clickedEnvironmentUnitCellName != null
            && localStorage.ManagerInfo != null) {
        sessionStorage.selectedUnitUrl = localStorage
                .getItem("clickedEnvironmentUnitUrl");
        sessionStorage.selectedUnitCellName = localStorage
                .getItem("clickedEnvironmentUnitCellName");
        sessionStorage.ManagerInfo = localStorage.getItem("ManagerInfo");
        uHome.storeEnvDetails();
    }
    uHome.removeEnvironmentVariablesFromLocalStorage();
};

home.prototype.removeEnvironmentVariablesFromLocalStorage = function() {
    localStorage.removeItem("clickedEnvironmentPass");
    localStorage.removeItem("clickedEnvironmentUnitUrl");
    localStorage.removeItem("clickedEnvironmentId");
    localStorage.removeItem("ManagerInfo");
};

home.prototype.setEnvironmentVariablesInLocalStorage = function (envID, envPass, unitURL) {
    localStorage.setItem("clickedEnvironmentId", envID);
    localStorage.setItem("clickedEnvironmentPass", envName);
    localStorage.setItem("clickedEnvironmentUnitUrl", unitURL);
};

// DELETE ENVIRONMENT ENDS

$(function() {
    $.ajaxSetup({ cache : false });
    sessionStorage.isHomePage == "true";
});

home.prototype.validateSchemaURL = function(schemaURL) {
    var isHttp = schemaURL.substring(0, 5);
    var isHttps = schemaURL.substring(0, 6);
    var minURLLength = schemaURL.length;
    var letters = /^[0-9a-zA-Z-_.\/]+$/;
    var startHyphenUnderscore = /^[-_!@#$%^&*()=+]/;
    var urlLength = schemaURL.length;
    var schemaSplit = schemaURL.split("/");
    var isDot = -1;
    if(schemaURL.split("/").length > 2) {
        if (schemaSplit[2].length>0) {
            isDot = schemaSplit[2].indexOf(".");
        }
    }
    var domainName = schemaURL.substring(8, urlLength);
    if (schemaURL == "" || schemaURL == null || schemaURL == undefined) {
        return false;
    } else if ((isHttp != "http:" && isHttps != "https:")
            || (minURLLength <= 8)) {
        return false;
    } else if (urlLength > 1024) {
        return false;
    } else if (domainName.match(startHyphenUnderscore)) {
        return false;
    } else if (!(domainName.match(letters))) {
        return false;
    } else if (isDot == -1) {
        return false;
    } else if ((domainName.indexOf(".."))>-1 || (domainName.indexOf("//"))>-1) {
        return false;
    }
    return true;
};

/**
 * The purpose of this method is to set the max-width for organization name
 * dynamically on change of view prt size.
 */
home.prototype.setDynamicOrgNameWidth = function(){
    var width = $(window).width();
    var ellipsisWidth = width - 345;
    if (width > 1280) {
        $("#dvOrgName").css("max-width", ellipsisWidth + "px");
    } else{
        $("#dvOrgName").css("max-width", "935px");
    }
};
