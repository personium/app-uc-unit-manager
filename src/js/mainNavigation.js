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
function mainNavigation() {
}

var uMainNavigation = new mainNavigation();

var contextRoot = sessionStorage.contextRoot;

/**
 * These are the configurable settings for spinner.
 */
var opts = {
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
    top : '320', // Top position relative to parent in px
    left : 'auto' // Left position relative to parent in px
};

/*
 * The purpose of this function is to display the box list against selected cell
 */
function boxListData(callback) {
    objCommon.hideListTypePopUp();
//  var id = objCommon.isSessionExist();
//  if (id != null) {
        $("#dvemptyTableMessage").hide();
        sessionStorage.tabName = "Box";
        /*$("#messageBlock").hide();
        $("#headingContent").html('');
        $("#headingContentBox").html('');
        $("#headingContent").html("Box List");
        $("#mainContent").hide();*/
        /*$("#mainContainer").hide();*/
        /*$("#spinner").hide();*/
        /*var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);*/
        /*setTimeout(function(){
            $("#spinner").show();
            spinner.stop();
        }, 2000);*/
        var spinner = "";
        if(document.getElementById("spinnerEnvt") == null){
            var target = document.getElementById('spinner');
            spinner = new Spinner(opts).spin(target);
        }
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/boxListView.html',
                function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        createBoxTable();
                    }
                    $("#mainContentWebDav").hide();
                    $("#mainContainer").show();
                    $("#mainContent").show();
                    if(document.getElementById("spinnerEnvt") != null){
                        $("#spinnerEnvt").remove();
                    }
                    if(spinner != ""){
                        spinner.stop();
                    }
                    if (callback != undefined) {
                        callback();
                    }
                    if (sessionStorage.isFirstCellCreate == 1) {
                        sessionStorage.isFirstCellCreate = 0;
                        var ucellP = new cellUI.popup();
                        ucellP.displaySuccessMessage();
                    }
                });
        setTimeout(function() {
            if(sessionStorage.isCellDeleted == 1 && sessionStorage.isCellDeleted != undefined && sessionStorage.isCellDeleted != null) {
                sessionStorage.isCellDeleted = 0;
                displayCellDeleteSuccessMessage('#deleteModal','boxMessageBlock');
            }
        }, 500);
        
//  } else {
//      window.location.href = contextRoot;
//  }
}

/*
 * The purpose of this function is to display the role list against selected
 * cell
 */
function roleListData() {
    objCommon.hideListTypePopUp();
    hideCellListOnCellSelection();
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#dvemptyTableMessage").hide();
        sessionStorage.tabName = "Role";
        /*$("#messageBlock").hide();
        $("#headingContent").html('');
        $("#headingContentBox").html('');
        $("#headingContent").html("Role List");
        $("#mainContent").hide();*/
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/roleListView.html',
                function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        loadRolePage();
                    }
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

/*
 * The purpose of this function is to display the account list against selected
 * cell
 */
function accountListData() {
    objCommon.hideListTypePopUp();
    hideCellListOnCellSelection();
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#dvemptyTableMessage").hide();
        sessionStorage.tabName = "Account";
        var spinner = "";
        if(document.getElementById("spinnerEnvt") == null){
            var target = document.getElementById('spinner');
            spinner = new Spinner(opts).spin(target);
        }
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/accountListView.html',
                function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        loadAccountPage();
                    }
                    $("#mainContainer").show();
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    if(document.getElementById("spinnerEnvt") != null){
                        $("#spinnerEnvt").remove();
                    }
                    if(spinner != ""){
                        spinner.stop();
                    }
                });
    } else {
        window.location.href = contextRoot;
    }
}

/*
 * The purpose of this function is to display the mapping between role and
 * account
 */
function openRoleLinkPage(accountname, accountdate, rolecount, etagstart, etagEnd,createdDate, updatedDate, schema) {
    var id = objCommon.isSessionExist();
    if (id != null) {
        sessionStorage.accountname = accountname;
        sessionStorage.accountdate = accountdate;
        sessionStorage.rolecount = rolecount;

        objCommon.setCellControlsInfoTabValues(accountname, etagstart, etagEnd, createdDate, updatedDate, schema);

        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContentWebDav").empty();
        $("#mainContentWebDav").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/roleAccountLinkControl.html', function() {
                    /*if (navigator.userAgent.indexOf("Firefox") != -1) {
                        loadAccountRoleAssignationPage();
                    }*/
                    $("#mainContentWebDav").show();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

function clickAccountRoleLinkMappingPage() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        sessionStorage.accountname = $("#lblAccountName").text();
        $("#mainContentWebDav").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/roleAccountLinkControl.html', function() {
                    /*if (navigator.userAgent.indexOf("Firefox") != -1) {
                    loadAccountRoleAssignationPage();
                    }*/
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}


/*
 * The purpose of this function is to display the relation list against selected
 * cell
 */
function relationListData() {
    objCommon.hideListTypePopUp();
    addSelectedClassMainNavSocial();
    $('.socialSubMenu').hide();
    hideCellListOnCellSelection();
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#dvemptyTableMessage").hide();
        sessionStorage.tabName = "Relation";
        var spinner = "";
        if(document.getElementById("spinnerEnvt") == null){
            var target = document.getElementById('spinner');
            spinner = new Spinner(opts).spin(target);
        }
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/relationListView.html',
                function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        var objRelation  = new uRelation();
                        objRelation.loadRelationPage();
                    }
                    $("#mainContainer").show();
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    if(document.getElementById("spinnerEnvt") != null){
                        $("#spinnerEnvt").remove();
                    }
                    if(spinner != ""){
                        spinner.stop();
                    }
                });
    } else {
        window.location.href = contextRoot;
    }
}

/*
 * The purpose of this function is to display the mapping between role and
 * account
 */
    function openRoleAccountLinkMappingPage(roleName, boxName,etagstart, etagEnd,createdDate, updatedDate, schema) {

    objCommon.setCellControlsInfoTabValues(roleName, etagstart, etagEnd, createdDate, updatedDate, schema);
    
    var id = objCommon.isSessionExist();
    if (id != null) {
        if(roleName != undefined && boxName != undefined) {
            sessionStorage.roleName = roleName;
            sessionStorage.boxName = boxName.split(' ').join('');
        }
        $("#mainContentWebDav").empty();
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContentWebDav").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/assignRoleNavigation.html', function() {
                    $("#roleAccountLinkDiV").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/roleToAccountMapping.html', function() {
                        if (navigator.userAgent.indexOf("Firefox") != -1) {
                            loadRoleToAccountMappingPage();
                    }
                        $("#mainContentWebDav").show();
                        $("#assignRoleName").attr('title',roleName);
                        $('#assignRoleName').text(roleName);
                        $("#assignBoxName").text(sessionStorage.boxName);
                        //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0245);
                        spinner.stop();
                    });
                });
    } else {
        window.location.href = contextRoot;
    }
}

/*
 * The purpose of this function is to display the mapping between role and
 * account on click of assign account navigation.
 */
function clickRoleAccountLinkMappingPage() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        sessionStorage.roleName = $("#assignRoleName").text();
        sessionStorage.boxName = $("#assignBoxName").text();
        $("#roleAccountLinkDiV").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/roleToAccountMapping.html', function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        loadRoleToAccountMappingPage();
                    }
                    //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0245);
                    spinner.stop();
                    
                });
    } else {
        window.location.href = contextRoot;
    }
}
/**
 * The purpose of the following method is to open External Cell page.
 */
function externalCellList() {
    objCommon.hideListTypePopUp();
    hideCellListOnCellSelection();
    addSelectedClassMainNavSocial();
    $('.socialSubMenu').hide();
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#dvemptyTableMessage").hide();
        sessionStorage.tabName = "External Cell";
        /*$("#messageBlock").hide();
        $("#headingContent").html('');
        $("#headingContentBox").html('');
        $("#headingContent").html("Social");
        $("#headingContentBox").html("External Cell");
        $("#mainContent").hide();*/
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/externalCell.html',
                function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        var objExternalCell = new externalCell();
                        objExternalCell.loadExternalCellPage();
                    }
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

/**
 * The purpose of this function is to display received message list
 * on click of received message tab
 */
function openReceivedMessageList() {
    objCommon.hideListTypePopUp();
    addSelectedClassMainNavMessage();
    $('.messageSubMenu').hide();
    hideCellListOnCellSelection();
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#dvemptyTableMessage").hide();
        sessionStorage.tabName = "Received";
        var spinner = "";
        if(document.getElementById("spinnerEnvt") == null){
            var target = document.getElementById('spinner');
            spinner = new Spinner(opts).spin(target);
        }
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/receivedMessage.html',
                function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        //loadAccountPage();
                        uReceivedMessage.createReceivedMessageTable();
                    }
                    $("#mainContainer").show();
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    if(document.getElementById("spinnerEnvt") != null){
                        $("#spinnerEnvt").remove();
                    }
                    if(spinner != ""){
                        spinner.stop();
                    }
                    uReceivedMessage.setDynamicWidthForGrid();
                    $('#receivedMessageTable').scroll(function () {
                         $("#receivedMessageTable > *").width($("#receivedMessageTable").width() + $("#receivedMessageTable").scrollLeft());
                    });
                });
    } else {
        window.location.href = contextRoot;
    }
}
/**
 * The purpose of this function is to display sent message list
 * on click of sent message tab
 */
mainNavigation.prototype.openSentMessageList = function() {
    objCommon.hideListTypePopUp();
    addSelectedClassMainNavMessage();
    $('.messageSubMenu').hide();
    hideCellListOnCellSelection();
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#dvemptyTableMessage").hide();
        sessionStorage.tabName = "SentMessage";
        var spinner = "";
        if(document.getElementById("spinnerEnvt") == null){
            var target = document.getElementById('spinner');
            spinner = new Spinner(opts).spin(target);
        }
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/sentMessage.html',
                function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        //loadAccountPage();
                        //uReceivedMessage.createReceivedMessageTable();
                        uSentMessage.createSentMessageTable();
                    }
                    $("#mainContainer").show();
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    if(document.getElementById("spinnerEnvt") != null){
                        $("#spinnerEnvt").remove();
                    }
                    if(spinner != ""){
                        spinner.stop();
                    }
                    uSentMessage.setDynamicWidthForGrid();
                    uSentMessage.setSentMessageGridHeight();
                    $('#sentMessageTable').scroll(function () {
                        $("#sentMessageTable > *").width($("#sentMessageTable").width() + $("#sentMessageTable").scrollLeft());
                    });
                });
    } else {
        window.location.href = contextRoot;
    }
};

/**
 * The purpose of this function is to display log list
 * on click of log tab
 */
mainNavigation.prototype.logViewData = function() {
    objCommon.hideListTypePopUp();
    hideCellListOnCellSelection();
    $('#messageMenuDropDown').addClass('displayNoneCellMenu');
    var id = objCommon.isSessionExist();
/*  if (id != null) {
    sessionStorage.tabName = "Log";
    $("#messageBlock").hide();
    $("#headingContent").html('');
    $("#headingContentBox").html('');
    $("#headingContent").html("Log");
    $("#mainContent").hide();
    var target = document.getElementById('spinner');
    var spinner = new Spinner(opts).spin(target);
    $("#mainContent").load(contextRoot + '/htmls/log.html',
            function() {
                var objLog = new log();
                objLog.createEventLogFolderTable();
                $("#mainContent").show();
                $("#mainContentWebDav").hide();
                spinner.stop();
            });
    } else {
        window.location.href = contextRoot;
    }*/
    
    if (id != null) {
        sessionStorage.tabName = "Log";
        $("#dvemptyTableMessage").hide();
        var spinner = "";
        if(document.getElementById("spinnerEnvt") == null) {
            var target = document.getElementById('spinner');
            spinner = new Spinner(opts).spin(target);
        }
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/log.html',
                function() {
                    var objLog = new log();
                    objLog.createEventLogFolderTable();
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    spinner.stop();
                    if(spinner != ""){
                        spinner.stop();
                    }
                });
    } else {
        window.location.href = contextRoot;
    }
};
/*
 * The purpose of this function is to display the mapping between role and
 * external cell
 */
function openExternalCellToRoleMapping(externalCellName, extCellURL, etagstart, etagEnd,createdDate, updatedDate, schema) {
    var id = objCommon.isSessionExist();
    if (id != null) {
        sessionStorage.externalCellURI = extCellURL;
        sessionStorage.extCellURL = extCellURL;
        objCommon.setCellControlsInfoTabValues(externalCellName, etagstart, etagEnd, createdDate, updatedDate, schema);
        $("#mainContent").hide();
        $("#mainContentWebDav").empty();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContentWebDav").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/assignExternalCellNavigation.html', function() {
                    $("#extCellTabLinkDiV").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/externalCellToRoleMapping.html', function() {
                        if (navigator.userAgent.indexOf("Firefox") != -1) {
                            var objExternalCellToRoleMapping = new externalCellToRoleMapping();
                        objExternalCellToRoleMapping.loadExtCellToRolesMappingPage();
                    }
                        $("#mainContentWebDav").show();
                        $('#assignExtCellName').text(externalCellName);
                        $("#assignExtCellName").attr('title', externalCellName);
                        $("#assignExtCellURlName").text(extCellURL);
                        //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0242);
                        spinner.stop();
                    });
                });
    } else {
        window.location.href = contextRoot;
    }
}
/**
 * The purpose of this function is to load extCell to role mapping grid
 */
function clickExtCellToRoleMappingPage() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        sessionStorage.extCellURL = $("#assignExtCellURlName").text();
        $("#extCellTabLinkDiV").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/externalCellToRoleMapping.html', function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        objExternalCellToRoleMapping.loadExtCellToRolesMappingPage();
                    }
                    //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0242);
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}


/**
 * The purpose of this function is to load extCell to relation mapping grid
 */
function clickExtCellToRelationMappingPage() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        sessionStorage.extCellURL = $("#assignExtCellURlName").text();
        $("#extCellTabLinkDiV").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/externalCellToRelationMapping.html', function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        objExternalCellToRelationMapping.loadExtCellToRelationMappingPage();
                    }
                    //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0246);
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

/*
 * The purpose of this function is to open role details page displaying
 * mapping with relation
 */
function openRelationToRoleMappingPage(relationName, boxName,  etagstart, etagEnd,createdDate, updatedDate, schema ) {
    boxName = boxName.trim();
    var id = objCommon.isSessionExist();
    if (id != null) {
        objCommon.setCellControlsInfoTabValues(relationName, etagstart, etagEnd, createdDate, updatedDate, schema);
        sessionStorage.relationName = relationName;
        sessionStorage.boxName = boxName;
        sessionStorage.updatedOn = updatedDate;
        $("#mainContent").hide();
        $("#mainContentWebDav").empty();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContentWebDav").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/assignRelationNavigation.html', function() {
                    $("#relationTabLinkDiV").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/relationToRoleMapping.html', function() {
                        if (navigator.userAgent.indexOf("Firefox") != -1) {
                            var objRelationToRoleMapping = new relationToRoleMapping();
                            objRelationToRoleMapping.loadRelationToRoleMappingPage();
                    }
                        $("#mainContentWebDav").show();
                        $('#assignRelationName').text(relationName);
                        $("#assignRelationName").attr('title', relationName);
                        $("#assignBoxName").text(boxName);
                        //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0242);
                        spinner.stop();
                    });
                });
    } else {
        window.location.href = contextRoot;
    }
}

/**
 * The purpose of this function is to load relation to role mapped grid
 */
function clickRelationToRoleMappingPage() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        sessionStorage.relationName = $("#assignRelationName").text();
        sessionStorage.boxName = $("#assignBoxName").text();
        $("#relationTabLinkDiV").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/relationToRoleMapping.html', function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        var objRelationToRoleMapping = new relationToRoleMapping();
                        objRelationToRoleMapping.loadRelationToRoleMappingPage();
                    }
                    //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0242);
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

/**
 * The purpose of this function is to load extCell to relation mapping grid
 */
function openRelationToExtCellMappingPage() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        sessionStorage.relationName = $("#assignRelationName").text();
        sessionStorage.boxName = $("#assignBoxName").text();
        $("#relationTabLinkDiV").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/relationToExtCellMapping.html', function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        var objRelationToExternalCellMapping = new relationToExternalCellMapping();
                        objRelationToExternalCellMapping.loadRelationToExtCellMappingPage();
                    }
                    //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0247);
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

/*
 * The purpose of this function is to open External Role page.
 */
function externalRoleList() {
    objCommon.hideListTypePopUp();
    addSelectedClassMainNavSocial();
    $('.socialSubMenu').hide();
    hideCellListOnCellSelection();
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#dvemptyTableMessage").hide();
        sessionStorage.tabName = "External Role";
        /*$("#messageBlock").hide();
        $("#headingContent").html('');
        $("#headingContentBox").html('');
        $("#headingContent").html("Social");
        $("#headingContentBox").html("External Role");
        $("#mainContent").hide();*/
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContent").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/externalRoleListView.html', function() {
                    if (navigator.userAgent.indexOf("Firefox") != -1) {
                        uExternalRole.loadExternalRolePage();
                    }
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

/**
 * The purpose of this method is to open Box Details screen.
 */
function openBoxDetail(boxName) {
    /*var id = objCommon.isSessionExist();
    if (id != null) {
        sessionStorage.boxName = boxName;
        $("#messageBlock").hide();
        $("#headingContent").html('');
        $("#headingContentBox").html('');
        $("#headingContent").html("Box Detail");
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContent").load(contextRoot + '/htmls/boxDetail.html',
                function() {
            objOdata.createTable();
            objOdata.populatePropertiesList();
                    $("#mainContent").show();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }*/
}
/**
 * The purpose of this function is to display the mapping between role and
 * relation
 */
function openRoleRelationLinkMappingPage() {
    var target = document.getElementById('spinner');
    var spinner = new Spinner(opts).spin(target);
    $("#mainContent").hide();
    $("#roleAccountLinkDiV").load(
            contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/roleToRelationMapping.html',
            function() {
                if (navigator.userAgent.indexOf("Firefox") != -1) {
                    var objRoleExtCellMapping = new roleToExtCellMapping();
                    objRoleExtCellMapping.loadRoleToExtCellLinkPage();
                }
                /*$("#txtAssignEntity")
                        .attr("placeholder", getUiProps().MSG0246);*/
                spinner.stop();
            });

}

/**
 * The purpose of this function is to display the mapping between role and
 * external cell
 */
function openRoleExtCellLinkPage(roleName, boxName, updatedOn,
        externalCellCount) {
    var target = document.getElementById('spinner');
    var spinner = new Spinner(opts).spin(target);
    $("#mainContent").hide();
    $("#roleAccountLinkDiV").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/roleToExtCell.html',
            function() {
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            var objRoleExtCellMapping = new roleToExtCellMapping();
            objRoleExtCellMapping.loadRoleToExtCellLinkPage();
        }
        //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0247);
                spinner.stop();
            });
}

/**
 * Following method opens mapping window for ext role.
 * @param paramRelationName relation name
 * @param paramExtRoleName ext role name
 * @param paramBoxName box name
 * @param paramUpdatedDate updated date
 * @param externalRoleToRoleCount record count
 */
function openExternalRoleLinkPage(paramRelationName, paramExtRoleName,
        paramBoxName, paramUpdatedDate,externalRoleToRoleCount,paramExtRoleCreatedDate,paramExtRoleEtagStart,paramExtRoleEtagEnd,paramExtRoleUri) {
    
    
    objCommon.setCellControlsInfoTabValues(paramExtRoleName,paramExtRoleEtagStart,paramExtRoleEtagEnd,paramExtRoleCreatedDate,paramUpdatedDate,paramExtRoleUri);
    
    var id = objCommon.isSessionExist();
    if (id != null) {
        sessionStorage.ExtRoleName = paramExtRoleName;
        sessionStorage.ExtRoleRelationName = paramRelationName;
        sessionStorage.ExtRoleBoxName = paramBoxName;
        sessionStorage.ExtRoleUpdatedDate = paramUpdatedDate;
        sessionStorage.ExternalRoleToRoleCount = externalRoleToRoleCount;
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#mainContentWebDav").empty();
        $("#mainContentWebDav").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/externalRoleToRoleMapping.html',
                function() {
                    $("#mainContentWebDav").show();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

function clickExternalRoleLinkMappingPage() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        sessionStorage.ExtRoleName = $("#lblExtRoleName").text();
        sessionStorage.ExtRoleRelationName = $("#lblExtRoleRelationName").text();
        sessionStorage.ExtRoleBoxName = $("#lblExtRoleBoxName").text();
        $("#mainContentWebDav").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/externalRoleToRoleMapping.html', function() {
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
}

/** 
* The purpose of this function is to display the mapping between role and external role
*/
function openRoleExtRoleLinkPage() {
    var target = document.getElementById('spinner');
    var spinner = new Spinner(opts).spin(target);
    $("#mainContent").hide();
    $("#roleAccountLinkDiV").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/roleToExtRole.html',
            function() {
        if (navigator.userAgent.indexOf("Firefox") != -1) {
            var objRoleExtCellMapping = new roleToExtCellMapping();
            objRoleExtCellMapping.loadRoleToExtCellLinkPage();
        }
        //$("#txtAssignEntity").attr("placeholder", getUiProps().MSG0248);
                spinner.stop();
            });
}

/*
 * The purpose of this function is to display the box list against selected cell
 */
mainNavigation.prototype.CellInfoNavigationData = function() {
    objCommon.hideListTypePopUp();
    var id = objCommon.isSessionExist();
    hideCellListOnCellSelection();
    if (id != null) {
        $("#dvemptyTableMessage").hide();
        var spinner = "";
        if(document.getElementById("spinnerEnvt") == null) {
            var target = document.getElementById('spinner');
            spinner = new Spinner(opts).spin(target);
        }
        $("#mainContent").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/cellInfoNavigation.html',
                function() {
                    if(sessionStorage.tabName==='infoAdmin') {
                        uMainNavigation.openAdministrationDetail();
                    } else {
                        uMainNavigation.openCellProfileInfo();
                    }

                    $("#mainContainer").show();
                    $("#mainContent").show();
                    $("#mainContentWebDav").hide();
                    if(document.getElementById("spinnerEnvt") != null){
                        $("#spinnerEnvt").remove();
                    }
                    if(spinner != ""){
                        spinner.stop();
                    }
                });
    } else {
        window.location.href = contextRoot;
    }
};

/**
 * The purpose of this method is to open the Info page for the
 * selected Cell.
 */
mainNavigation.prototype.openCellProfileInfo = function() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        sessionStorage.tabName = "infoProfile";
        $('#cellInfoProfile').addClass("selected");
        $('#cellInfoAdministration').removeClass("selected");
        
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#cellInfoDetail").load(contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/cellProfileInfo.html',
                function() {
                    $("#cellInfoDetail").hide();
                    uCellProfile.displayCellProfileInfo();
                    $("#cellInfoDetail").show();
                    $("#dvBoxEditIcon").hide();
                    $("#dvCellEditIcon").show();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
};

/**
 * The purpose of this method is to open the Administration page for the
 * selected Cell.
 */
mainNavigation.prototype.openAdministrationDetail = function() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        sessionStorage.tabName = "infoAdmin";
        $('#cellInfoProfile').removeClass("selected");
        $('#cellInfoAdministration').addClass("selected");

        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#cellInfoDetail").load(
            contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/cellAdministration.html',
            function() {
                $("#cellInfoDetail").hide();
                uCellAcl.createCellACLRoleTable();
                // Disable the Delete button for Cell Manager
                let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
                if (ManagerInfo.isCellManager) {
                    jquery1_12_4("#deleteCell").prop("disabled", true);
                }
                $("#cellInfoDetail").show();
                spinner.stop();
            });
    } else {
        window.location.href = contextRoot;
    }
};

/**
 * The purpose of this method is to open the info page for the
 * selected Role.
 */
mainNavigation.prototype.openRoleInfo = function() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#dvemptyAssignTableMessage").hide();
        $("#roleAccountLinkDiV").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/cellControlsInfo.html', function() {
                    //if (navigator.userAgent.indexOf("Firefox") != -1) {
                    uBoxDetail.displayBoxInfoDetails();
                    //}
                    spinner.stop();
                    
                });
    } else {
        window.location.href = contextRoot;
    }
};

/**
 * The purpose of this method is to open the info page for the
 * selected account.
 */
mainNavigation.prototype.openAccountInfo = function() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#mainContent").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#dvemptyAssignTableMessage").hide();
        $("#divAccountHeader").hide();
        $("#webDavAccountArea").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/cellControlsInfo.html', function() {
                    uBoxDetail.displayBoxInfoDetails();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
};

/**
 * The purpose of this method is to open the info page for the
 * selected account.
 */
mainNavigation.prototype.openExternalCellInfo = function() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        $("#dvemptyAssignTableMessage").hide();
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#extCellTabLinkDiV").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/cellControlsInfo.html', function() {
                    uBoxDetail.displayBoxInfoDetails();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
};

/**
 * The purpose of this function is to load info page to selected relation mapping.
 */
mainNavigation.prototype.openRelationInfo = function() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#dvemptyAssignTableMessage").hide();
        $("#relationTabLinkDiV").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/cellControlsInfo.html', function() {
                    uBoxDetail.displayBoxInfoDetails();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
};

/**
 * The purpose of this function is to load info page to selected External Role mapping.
 */
mainNavigation.prototype.openExternalRoleInfo = function() {
    var id = objCommon.isSessionExist();
    if (id != null) {
        var target = document.getElementById('spinner');
        var spinner = new Spinner(opts).spin(target);
        $("#dvemptyAssignTableMessage").hide();
        $("#divAccountHeader").hide();
        $("#webDavAccountArea").load(
                contextRoot + '/htmls/'+sessionStorage.selectedLanguage+'/cellControlsInfo.html', function() {
                    uBoxDetail.displayBoxInfoDetails();
                    spinner.stop();
                });
    } else {
        window.location.href = contextRoot;
    }
};
