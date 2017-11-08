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

login.prototype.getEnvDetail = function() {
    document.getElementById("logoutDiv").style.visibility = "hidden";

    if (validateForm()) {
        var unitCellUrl = $("#unitUrl").val() + $("#unitCellName").val() + "/";
        $.ajax({
            type: "GET",
            url: unitCellUrl,
            headers:{
                'Accept':'application/xml'
            },
            success : function(res) {
                login.determineManagerType(unitCellUrl);
            },
            error : function(res) {
                document.getElementById("logoutDiv").style.visibility = "visible";
                $("#logoutDiv").addClass("loginErrorMessage");
                $("#logoutMsg").text("The target unitcell does not exist.");
            }
        });
    }
    return false;
}

/*
 * Get cell URL from URL
 * Parameter:
 *     "https://demo.personium.io/debug-user1/test/login.html"
 * Return:
 *     "https://demo.personium.io/debug-user1/"
 */
login.prototype.cellUrlWithEndingSlash = function (tempUrl) {
    var i = tempUrl.indexOf("/", 8); // search after "http://" or "https://"

    if (tempUrl.slice(-1) != "/") {
        tempUrl += "/";
    }

    i = tempUrl.indexOf("/", i + 1);

    var cellUrl = tempUrl.substring(0, i + 1);

    return cellUrl;
};

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
    let unitTokenCredential = $.extend(
        true,
        _.clone(cellTokenCredential),
        {
            p_target : $("#unitUrl").val()
        }
    );

    $.when(
        login.getToken(unitCellUrl, unitTokenCredential),
        login.getToken(unitCellUrl, cellTokenCredential)).done(function(json1, json2){
            login.isUnitCell(json1[0], json2[0]);
    });
}

login.getToken = function(unitCellUrl, loginInfo) {
    return  $.ajax({
        dataType : 'json',
        url : unitCellUrl + '__token' ,//+ tokenUrl,
        data : loginInfo,
        type : 'POST',
        async : false,
        cache : false,
        error : function(jsonData) {
            document.getElementById("logoutDiv").style.visibility = "visible";
            $("#logoutDiv").addClass("loginErrorMessage");
            $("#logoutMsg").text("Invalid username or password");
        }
    });
}

login.isUnitCell = function(jsonData1, jsonData2) {
    $.ajax({
        type: "GET",
        url: $("#unitUrl").val() + '__ctl/Cell',
        headers: {
            'Accept':'application/json',
            'Authorization':'Bearer ' + jsonData1.access_token
        },
        async : false,
        cache : false,
        success: function(res) {
            console.log("Unit Manager");
            login.setupInfo({ isCellManager: false });
            login.openManagerWindow();
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
    $.ajax({
        type: "PROPFIND",
        url: $("#unitUrl").val() + $("#unitCellName").val() + "/__",
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
                __published: "/Date(" + epoch + ")/"//need to change to epoch time
            };
            login.setupInfo(managerInfo);
            login.openManagerWindow();
        },
        error: function(res) {
            console.log(res.status);
        }
    });
}

login.setupInfo = function(managerInfo) {
    localStorage.setItem("clickedEnvironmentUnitUrl", $("#unitUrl").val());
    localStorage.setItem("clickedEnvironmentUnitCellName", $("#unitCellName").val());
    localStorage.setItem("clickedEnvironmentId", $("#userId").val());
    localStorage.setItem("clickedEnvironmentPass", $("#passwd").val());
    localStorage.setItem("ManagerInfo", JSON.stringify(managerInfo));
    sessionStorage.setItem("selectedLanguage", $("#ddLanguageSelector").val());
}

login.openManagerWindow = function() {
    sessionStorage.setItem("contextRoot", "https://demo.personium.io/app-uc-unit-manager/__/unitmgr-light");

    location.href = 'https://demo.personium.io/app-uc-unit-manager/__/unitmgr-light/htmls/'+sessionStorage.selectedLanguage+'/environment.html';
}