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
function login() {
}

var uLogin = new login();

login.prototype.renderLoginFields = function(calledFromCell) {
    var errorFlag = null;
    var showMessage = '';
    if (errorFlag == 'null' && showMessage == 'null') {
        document.getElementById("logoutDiv").style.visibility = "hidden";
    } else {
        document.getElementById("logoutDiv").style.visibility = "visible";
        $("#logoutDiv").addClass("loginErrorMessage");
        $("#logoutMsg").text(showMessage);
    }

    var user = localStorage ? localStorage.user : null;
    if (user) {
        document.getElementById("logoutDiv").style.visibility = "visible";
        $("#logoutDiv").addClass("logoutSuccess");
        //var username = sessionStorage.logoutShorterUName;
        $("#logoutMsg").text("You have logged out successfully.");
        $('#logoutMsg').attr('title', user);
        localStorage.user = '';
    }
    var browserLanguage = navigator.language;
    if (browserLanguage != undefined && browserLanguage.toLowerCase() == 'ja') {
        $("#ddLanguageSelector").val('Japanese(jp)');
    }

    if (calledFromCell) {
        // When called from Unit Admin Cell and login as Unit Admin, Unit Manager will be displayed.
        uLogin.initCellManager(uLogin.accessManager);
    } else {
        uLogin.accessManager();
    }
}
login.prototype.accessManager = function() {
    // If there is token in the parameter, log in automatically
    let hash = location.hash.substring(1);
    let params = hash.split("&");
    let arrParam = {};
    for (var i in params) {
        var param = params[i].split("=");
        arrParam[param[0]] = param[1]; 
    }
    if (arrParam.refresh_token) {
        // Update the received token and try login
        var unitCellUrl = $("#loginUrl").val();
        let refreshTokenCredential = {
            grant_type: "refresh_token",
            refresh_token: arrParam.refresh_token
        };
        login.refreshToken(unitCellUrl, refreshTokenCredential).done(function(jsonData){
            login.getCellInfo(jsonData);
        });
    } else if (arrParam.id && arrParam.password) {
        // Try login with id, pass
        var cellUrl = $("#loginUrl").val();
        $("#userId").val(arrParam.id);
        $("#passwd").val(arrParam.password);
        login.determineManagerType(cellUrl);
    } else {
        // Manual Login
        $('body > div.mySpinner').hide();
        $('body > div.myHiddenDiv').show();
    }

    // Clear fragments
    location.hash = "";
}
login.prototype.initCellManager = function(callback) {
    // If it is not a local file, hide unitURL and unitCellName and extract from location.
    var cellUrlSplit = _.first(location.href.split("#")).split("/");
    if (!_.contains(cellUrlSplit, "file:") && !_.contains(cellUrlSplit, "localhost")) {
        // Hide unitURL and unitCellName
        $(".dtUnitUrl").toggle(false);
        $("#loginForm").addClass("localCellManager");
        // Get CellURL or UnitURL
        let cellUrl = _.first(cellUrlSplit, 3).join("/") + "/";
        login.getCell(cellUrl).done(function(cellObj, status, xhr) {
            let ver = xhr.getResponseHeader("x-personium-version");
            if (ver < "1.7.1" || cellObj.unit.path_based_cellurl_enabled) {
                // For version 1.6 or lower, or for path-based URL
                $("#loginUrl").val(_.first(cellUrlSplit, 4).join("/") + "/");
            } else {
                // Version 1.7 or higher and it is not a path based URL
                $("#loginUrl").val(cellUrl);
            }
            if (cellObj.unit) {
                uLogin.pTarget = cellObj.unit.url;
            } else {
                uLogin.pTarget = cellUrl;
            }
        }).fail(function(xmlObj) {
            cellUrl = _.first(cellUrlSplit, 4).join("/") + "/";
            $("#loginUrl").val(cellUrl);
            uLogin.pTarget = _.first(cellUrlSplit, 3).join("/") + "/"
        }).always(function() {
            if ((typeof callback !== "undefined") && $.isFunction(callback)) {
                callback();
            }
        })
    } else {
        if ((typeof callback !== "undefined") && $.isFunction(callback)) {
            callback();
        }
    }
}

login.prototype.getEnvDetail = function() {
    document.getElementById("logoutDiv").style.visibility = "hidden";

    if (validateForm()) {
        $('body > div.mySpinner').show();
        $('body > div.myHiddenDiv').hide();
        var unitCellUrl = $("#loginUrl").val();
        $.ajax({
            type: "GET",
            url: unitCellUrl,
            headers:{
                'Accept':'application/json'
            },
            success : function(res) {
                login.determineManagerType(unitCellUrl);
            },
            error : function(res) {
                if (res.status == "200" || res.status == "412") {
                    login.determineManagerType(unitCellUrl);
                } else {
                    $('body > div.mySpinner').hide();
                    $('body > div.myHiddenDiv').show();
    
                    document.getElementById("logoutDiv").style.visibility = "visible";
                    $("#logoutDiv").addClass("loginErrorMessage");
                    $("#logoutMsg").text("The target unitcell does not exist.");
                }
            }
        });
    }
    return false;
}

/*
 * Retrieve cell name from cell URL
 * Parameter:
 *     1. ended with "/", "https://demo.personium.io/debug-user1/"
 *     2. ended without "/", "https://demo.personium.io/debug-user1"
 * Return:
 *     debug-user1
 */
login.prototype.getName = function (path) {
    if ((typeof path === "undefined") || path == null || path == "") {
        return "";
    };

    let name;
    if (_.contains(path, "\\")) {
        name = _.last(_.compact(path.split("\\")));
    } else {
        name = _.last(_.compact(path.split("/")));
    }

    return name;
};

login.determineManagerType = function(unitCellUrl) {
    let cellTokenCredential = {
        grant_type: "password",
        username: $("#userId").val(),
        password: $("#passwd").val()
    };
    login.getCell(unitCellUrl).done(function(cellObj, status, xhr) {
        let ver = xhr.getResponseHeader("x-personium-version");
        if (ver >= "1.7.1") {
            uLogin.pTarget = cellObj.unit.url;
        } else {
            let cellSplit = unitCellUrl.split("/");
            uLogin.pTarget = _.first(cellSplit, 3).join("/") + "/"
        }
    }).fail(function(xmlObj) {
        if (xmlObj.status == "200" || xmlObj.status == "412") {
            let cellSplit = unitCellUrl.split("/");
            uLogin.pTarget = _.first(cellSplit, 3).join("/") + "/"
        }
    }).always(function() {
        let unitTokenCredential = $.extend(
            true,
            _.clone(cellTokenCredential),
            {
                p_target : uLogin.pTarget
            }
        );
    
        $.when(
            login.getToken(unitCellUrl, unitTokenCredential),
            login.getToken(unitCellUrl, cellTokenCredential)).done(function(json1, json2){
                login.isUnitCell(json1[0], json2[0], uLogin.pTarget);
        });
    })
}

login.getToken = function(unitCellUrl, loginInfo) {
    return  $.ajax({
        dataType : 'json',
        url : unitCellUrl + '__token' ,//+ tokenUrl,
        data : loginInfo,
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        },
        type : 'POST',
        async : false,
        cache : false,
        error : function(jsonData) {
            document.getElementById("logoutDiv").style.visibility = "visible";
            $("#logoutDiv").addClass("loginErrorMessage");
            $("#logoutMsg").text("Invalid username or password");
            $('body > div.mySpinner').hide();
            $('body > div.myHiddenDiv').show();
        }
    });
}

login.refreshToken = function(cellUrl, refreshInfo) {
    return $.ajax({
        dataType: 'json',
        url : cellUrl + '__token', //+ tokenUrl
        data : refreshInfo,
        headers: {
            'Accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded'
        },
        type : 'POST',
        async : false,
        cache : false,
        error : function(jsonData) {
            document.getElementById("logoutDiv").style.visibility = "visible";
            $("#logoutDiv").addClass("loginErrorMessage");
            $("#logoutMsg").text("Invalid token");
            $('body > div.mySpinner').hide();
            $('body > div.myHiddenDiv').show();
        }
    })
}
login.getCell = function(cellUrl) {
    return $.ajax({
        type: "GET",
        url: cellUrl,
        headers: {
            'Accept': 'application/json'
        }
    });
}

login.isUnitCell = function(jsonData1, jsonData2, unitUrl) {
    $.ajax({
        type: "GET",
        url: unitUrl + '__ctl/Cell',
        headers: {
            'Accept':'application/json',
            'Authorization':'Bearer ' + jsonData1.access_token
        },
        async : false,
        cache : false,
        success: function(res) {
            console.log("Unit Manager");
            let managerInfo = {
                isCellManager: false,
                loginURL: location.protocol + "//" + location.host + location.pathname,// Hold the URL of the login screen
                cellUrl: $("#loginUrl").val(),
                token: jsonData1.access_token,
                refreshToken: jsonData1.refresh_token
            };
            login.openManagerWindow(managerInfo);
        },
        error: function(res) {
            if (res.status === 403) {
                console.log("Cell Manager");
                login.getCellInfo(jsonData2);
            } else {
                console.log(res.status);
            }
        }
    });
}

/*
 * For user that can manage a cell, need to use PROPFIND to retrieve information about the cell. 
 * "Depth" must be set to zero to get only the information about the box.
 */
login.getCellInfo = function(jsonData) {
    var cellUrl = $("#loginUrl").val();
    $.ajax({
        type: "PROPFIND",
        url: cellUrl + "__",
        headers: {
            'Accept':'application/xml',
            'Depth': '0',
            'Authorization':'Bearer ' + jsonData.access_token
        },
        async : false,
        cache : false,
        success: function(res, textStatus, xhr) {
            let lastModified = $(res).find('getlastmodified').first().text();
            let epoch = new Date(lastModified).getTime();
            let managerInfo = {
                isCellManager: true,
                __published: "/Date(" + epoch + ")/",//need to change to epoch time
                loginURL: location.protocol + "//" + location.host + location.pathname,// Hold the URL of the login screen
                cellUrl: cellUrl,
                token: jsonData.access_token,
                refreshToken: jsonData.refresh_token
            };
            login.openManagerWindow(managerInfo);
        },
        error: function(res) {
            console.log(res.status);
        }
    });
}

login.openManagerWindow = function(managerInfo) {
    let appUnitFQDN = 'demo.personium.io';
    let managerUrl = '';
    $.ajax({
        type: "GET",
        url: "https://" + appUnitFQDN + "/",
        headers: {
            'Accept': 'application/json'
        },
        success: function(unitObj, status, xhr) {
            let ver = xhr.getResponseHeader("x-personium-version");
            if (ver < "1.7.1" || unitObj.unit.path_based_cellurl_enabled) {
                managerUrl = 'https://'+appUnitFQDN+'/app-uc-unit-manager/';
            } else {
                managerUrl = 'https://app-uc-unit-manager.'+appUnitFQDN+'/';
            }
            login.checkLoginUrl(managerInfo, managerUrl);
        },
        error: function(res) {
            console.log(res.status);
            managerUrl = 'https://'+appUnitFQDN+'/app-uc-unit-manager/';
            login.checkLoginUrl(managerInfo, managerUrl);
        }
    })
}

login.checkLoginUrl = function(managerInfo, managerUrl) {
    let launchUrl = managerUrl + '__/html';
    var cellUrl = $("#loginUrl").val();
    $.ajax({
        type: "GET",
        url: cellUrl,
        headers: {
            'Accept': 'application/json'
        },
        success: function(cellObj) {
            location.href = login.prepareHashParams(launchUrl, managerInfo, cellObj.cell.name);
        },
        error: function(res) {
            console.log(res.status);
            if (res.status == "200" || res.status == "412") {
                location.href = login.prepareHashParams(launchUrl, managerInfo, uLogin.getName(cellUrl));
            }
        }
    })
}

login.prepareHashParams = function(launchUrl, managerInfo, cellName) {
    let url = [
        launchUrl + "/environment.html",
        '?lng=' + $("#ddLanguageSelector").val(),
        '#ManagerInfo=' + JSON.stringify(managerInfo),
        '&contextRoot=' + launchUrl,
        '&clickedEnvironmentUnitUrl=' + uLogin.pTarget,
        '&clickedEnvironmentUnitCellName=' + cellName,
        '&selectedLanguage=' + $("#ddLanguageSelector").val()
    ].join("");
    return url;
}

function clearData() {
    $('#confirm').find('input:text').val('');
    $('#confirm').find('input:password').val('');
    $("#confirm").find('input:text').css("background-color", "white");
    $("#confirm").find('input:password').css("background-color", "white");
    $('#userspanid').html('');
    $('#passspanid').html('');
    $('#repassspanid').html('');
    $('#firstnameid').html('');
    $('#familynameid').html('');
    $('#orgspanid').html('');
    $('#emailspanid').html('');
}        

//Closing the success registration popup
function closeSuccessMsg() {
    $('#successMsgBlock, .window').hide();
}

//Cancel functionality on view screen
function back() {
    if (document.getElementById("register").style.display == "block") {
        document.getElementById("register").style.display = "none";
        document.getElementById("confirm").style.display = "block";
    }
}
