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
 * The purpose of this function to get the API version of the unit.
 */
home.prototype.getAPIVersion = function(requestURL){
    var unitUrl = requestURL + "__ctl/Cell";
    var CSRFTokenAPIVersion = sessionStorage.requestId;
    $.ajax({
        dataType    : 'json',
        url         : './home',
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
        url         : './home',
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
    let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
    var targetCellUrl = ManagerInfo.cellUrl;
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
        url : targetCellUrl + '__token' ,//+ tokenUrl,
        data : tokenCredential,
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        },
        type : 'POST',
        async : false,
        cache : false,
        success : function(jsonData) {
            uHome.loadCellDetails(jsonData);
            ManagerInfo.refreshToken = getClientStore().refreshToken;
            sessionStorage.ManagerInfo = JSON.stringify(ManagerInfo);
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
    sessionStorage.selectedcellUrl = '';
    sessionStorage.target = target;
    sessionStorage.token = token;
    objCommon.getCellCountAndOpenPage();
    sessionStorage.isSocialGraph = "false";
    sessionStorage.isResourceMgmt = "true";
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

home.prototype.setEnvironmentVariables = function() {
    let tempParams = uHome.getHashParams();
    if (tempParams.selectedLanguage) {
        sessionStorage.selectedLanguage = tempParams.selectedLanguage;
    }
    if (tempParams.contextRoot) {
        sessionStorage.contextRoot = tempParams.contextRoot;
    }
    if (tempParams.clickedEnvironmentUnitUrl != null
            && tempParams.clickedEnvironmentUnitCellName != null
            && tempParams.ManagerInfo != null) {
        sessionStorage.selectedUnitUrl = tempParams.clickedEnvironmentUnitUrl;
        sessionStorage.selectedUnitCellName = tempParams.clickedEnvironmentUnitCellName;
        sessionStorage.ManagerInfo = tempParams.ManagerInfo;
    }
    sessionStorage.pathBasedCellUrlEnabled = true;
    sessionStorage.newApiVersion = false;
    objCommon.getCell(sessionStorage.selectedUnitUrl).done(function(unitObj, status, xhr) {
        let ver = xhr.getResponseHeader("x-personium-version");
        if (ver >= "1.7.1") {
            sessionStorage.pathBasedCellUrlEnabled = unitObj.unit.path_based_cellurl_enabled;
            sessionStorage.newApiVersion = true;
        } else if (ver >= "1.6.16") {
            sessionStorage.newApiVersion = true;
        }
    }).fail(function(xhr) {
        let ver = xhr.getResponseHeader("x-personium-version");
        if (ver >= "1.6.16") {
            sessionStorage.newApiVersion = true;
        }
    });

    uHome.storeEnvDetails();
};

home.prototype.getHashParams = function() {
    let hash = location.hash.substring(1);
    let params = hash.split("&");
    let arrParam = {};
    for (var i in params) {
        var param = params[i].split("=");
        arrParam[param[0]] = decodeURIComponent(param[1]); 
    }
    // Clear fragments
    location.hash = "";
    
    return arrParam;
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
