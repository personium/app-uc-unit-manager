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
function cellProfile() {
}

var uCellProfile = new cellProfile();
var profileFileName = "profile.json";
cellProfile.prototype.spinner = null;
var imgBinaryFile = null;
var isFileValid = true;
var MAXRECORDS = 8;
var CONSTRECORDS = 8;
var profileImageName = null;
var isProfileImage = true;

/**
 * The purpose of this function is to populate edit cell profile popup
 * with existing data. 
 */
cellProfile.prototype.populateCellProfilePopupFieldsWithData = function() {
    // Get profile from selected language
    var selectedLng = $("#profileLngList").val();
    var response = this.getCellProfileInfo(selectedLng);
    response = response.bodyAsJson();
    var tempDispName = objCommon.getProfileDisplayName(response);
    var tempDescription = objCommon.getProfileDescription(response);
    var displayName = objCommon.replaceNullValues(tempDispName,
            getUiProps().MSG0275);
    var description = objCommon.replaceNullValues(tempDescription,
            getUiProps().MSG0275);
    var binaryCellProfileImage = response.Image;
    imgBinaryFile = response.Image;
    var cellProfileImageName = response.ProfileImageName;
    if (displayName != undefined && displayName != null && displayName != '-') {
        document.getElementById("editDisplayName").value = displayName;
    }
    if (description != undefined && description != null && description != '-') {
        document.getElementById("editDescription").value = description;
    }

    // Make the data of dispName have cellType
    if (response.CellType) {
        document.getElementById("editDisplayName").dataset.CellType = response.CellType;
    } else {
        document.getElementById("editDisplayName").dataset.CellType = "";
    }

    objCommon.showProfileImage(binaryCellProfileImage, '#idImgFile',
                '#figEditCellProfile', cellProfileImageName,
                '#lblEditFileName');
};

/**
 * Following method is used to display error Icon - create cell profile..
 * @param txtID textBox ID
 */
cellProfile.prototype.showErrorIcon = function (txtID) {
    $(txtID).removeClass("validValueIconCellProfile");
    $(txtID).addClass("errorIconCellProfile");  
};

/**
 * Following method is used to display right Icon - create cell profile.
 * @param txtID textBox ID
 */
cellProfile.prototype.showValidValueIcon = function (txtID) {
    $(txtID).removeClass("errorIconCellProfile");   
    $(txtID).addClass("validValueIconCellProfile");
};

/**
 * Following method is used to remove status Icons - create cell profile.
 * @param txtID textBox ID
 */
cellProfile.prototype.removeStatusIcons = function (txtID) {
    $(txtID).removeClass("errorIconCellProfile");   
    $(txtID).removeClass("validValueIconCellProfile");
};

/**
 * The purpose of this function is to validate display name.
 * 
 * @param displayName
 * @param displayNameSpan
 * @returns {Boolean}
 */
cellProfile.prototype.validateDisplayName = function (displayName, displayNameSpan,txtID) {
    var MINLENGTH = 1;
    var MAXLENGTH = 256;
    var letters = new RegExp("^[^" + objCommon.getValidateBlackList() + "]+$");
    var lenDisplayName = displayName.length;
    this.removeStatusIcons(txtID);
    if(lenDisplayName < MINLENGTH || displayName == undefined || displayName == null || displayName == "") {
        document.getElementById(displayNameSpan).innerHTML =  getUiProps().MSG0103;
        this.showErrorIcon(txtID);
        //uCellProfile.spinner.stop();
        return false;
    } else if (lenDisplayName > MAXLENGTH) {
        document.getElementById(displayNameSpan).innerHTML = getUiProps().MSG0104;
        //uCellProfile.spinner.stop();
        this.showErrorIcon(txtID);
        return false;
    } else if (lenDisplayName != 0 && !(displayName.match(letters))){
        document.getElementById(displayNameSpan).innerHTML = getUiProps().MSG0429;
        this.showErrorIcon(txtID);
        return false;
    }

    this.showValidValueIcon(txtID);
    return true;
};

/**
 * The purpose of this function is to validate description.
 * 
 * @param descriptionDetails
 * @param descriptionSpan
 * @returns {Boolean}
 */
cellProfile.prototype.validateDescription = function (descriptionDetails, descriptionSpan) {
    var isValidDescription = true;
    var lenDescription = descriptionDetails.length;
    if (lenDescription > 51200) {
        isValidDescription = false;
        document.getElementById(descriptionSpan).innerHTML = getUiProps().MSG0107;
    }
    return isValidDescription;
};

/**
 * The purpose of this function is to validate edit cell profile
 * pop up fields.
 * 
 * @param displayName
 * @param descriptionDetails
 * @param displayNameSpan
 * @param descriptionSpan
 * @returns {Boolean}
 */
cellProfile.prototype.validate = function (displayName, descriptionDetails, displayNameSpan, descriptionSpan,txtID) {
    if (uCellProfile.validateDisplayName(displayName, displayNameSpan,txtID)) {
        document.getElementById(displayNameSpan).innerHTML = "";
        return uCellProfile.validateDescription(descriptionDetails, descriptionSpan);
    }
    return false;
};

/**
 * The purpose of this function is to retrieve API response on 
 * the basis of operation performed.
 * 
 * @param json
 * @param operationPerformed
 * @param cellName
 * @param profileLng
 * @returns
 */
cellProfile.prototype.retrieveCollectionAPIResponse = function (json, operationPerformed,cellName, profileLng) {
    var baseUrl = getClientStore().baseURL;
    var response = null;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }
    var accessor = objCommon.initializeAccessor(getClientStore().baseURL, cellName,"","");
    var objCellManager = new _pc.CellManager(accessor);
    var path = objCellManager.getCellUrl(cellName)+"__/";
    if (profileLng) {
        path += "locales/" + profileLng;
    }
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var objJDavCollection = new _pc.DavCollection(accessor, path);
    if (operationPerformed === "EDIT") {
        response = objJDavCollection.put(profileFileName, "application/json", JSON.stringify(json), "*");
    }
    if (operationPerformed === "RETRIEVE") {
        response = objJDavCollection.getJSON(profileFileName);
    }
    return response;
};

/**
 * The purpose of this function is to update cell profile.
 */
cellProfile.prototype.updateCellProfile = function() {
        var displayName = document.getElementById("editDisplayName").value;
        var description = document.getElementById("editDescription").value;
        var fileData = null;
        // The file to be uploaded in binary format.
        var profileBoxImageName = $('#lblEditFileName').text();
        var validDisplayName = validateDisplayName(displayName, "popupEditDisplayNameErrorMsg",'#editDisplayName');
        if(validDisplayName){
            $('#popupEditDisplayNameErrorMsg').html('');
            var validDesciption = uCellProfile.validateDescription(description,"popupEditDescriptionErrorMsg");
            if (validDesciption){
                var prof = this.getCellProfileInfo();
                var status = prof.getStatusCode();
                prof = prof.bodyAsJson();
                if (document.getElementById("editDisplayName").dataset.CellType == "App") {
                    // If cellType is App, update en of existing profile.json
                    latestProf = {
                        "DisplayName": {"en": displayName},
                        "Description": {"en": description},
                        "Image" : imgBinaryFile,
                        "ProfileImageName" : profileBoxImageName
                    };
                } else {
                    latestProf = {
                        "DisplayName" : displayName,
                        "Description" : description,
                        "Image" : imgBinaryFile,
                        "ProfileImageName" : profileBoxImageName
                    };
                }
                if (status == 200) {
                    $.extend(
                        true,
                        prof,
                        latestProf
                    );
                } else {
                    prof = latestProf;
                }
                
                fileData = prof;
                var selectedLng = $("#profileLngList").val();
                response = uCellProfile.retrieveCollectionAPIResponse(fileData, "EDIT",sessionStorage.selectedcell, selectedLng);
                var statusCode = objCommon.getStatusCode(response);
                if (statusCode === 201 || statusCode === 204) {
                    uMainNavigation.openCellProfileInfo(selectedLng);
                    this.closeEditProfilePopUp('#editCellProfileModalWindow');
                }
            }
        }
};

/**
 * Following function closes edit profile pop up.
 * @param modelId Modal window ID.
 */
cellProfile.prototype.closeEditProfilePopUp = function(modelId) {
    $(modelId).hide();
    uCellProfile.clearErrorMessages("#figEditCellProfile","#lblEditFileName","#editDisplayName","#idImgFile");
};

/**
 * The purpose of this method is to clear error messages while opening edit box profile popup.
 */
cellProfile.prototype.clearErrorMessages = function(figureID,lblFileName,txtDisplayName,idImage){
    imgBinaryFile = null;
    $(figureID).addClass("boxProfileImage");
    $(lblFileName).text(getUiProps().MSG0398);
    $('.RHSAlertMsg').html('');
    $('.RHSAlertMsg').html('');
    $(txtDisplayName).val("");
    $('.profileTextArea').val('');
    removeStatusIcons(txtDisplayName);
    $(idImage).css("display", "none");
};

/**
 * The purpose of this function is to display profile details.
 */
cellProfile.prototype.displayProfileDetails = function () {
    var target = document.getElementById('spinner');
    var spinner = new Spinner(objCommon.opts).spin(target);
    var ERRORSTATUSCODE = 404;
    var SUCCESSSTATUSCODE = 200;
    var cellName = sessionStorage.selectedcell; 
    var response = uCellProfile.retrieveCollectionAPIResponse(profileFileName, "RETRIEVE",cellName);
    if(document.getElementById("message") != undefined){
        document.getElementById("message").style.display = "none";
    }
    if (response.httpClient.status === ERRORSTATUSCODE) {
        spinner.stop();
        $("#dvUserImage").hide();
        $("#spanDisplay").hide();
        $("#idDescription").hide();
        if(document.getElementById("message") != undefined){
            document.getElementById("message").style.display = "block";
        }
    } else if (response.httpClient.status === SUCCESSSTATUSCODE) {
        spinner.stop();
        uCellProfile.retrieveProfileInfoFromResponse(response);
    } else {
        if(document.getElementById("Unablemessage") != undefined){
            document.getElementById("Unablemessage").style.display = "block";
        }
    }
    this.getSelectedCellACLSettings();
    spinner.stop();
    MAXRECORDS=CONSTRECORDS;
    $('.innerDiv').remove();
    $('.paginationBut').remove();
    jQuery('#dvExternalCellRegion div').html('');
    uCellProfile.retrieveCellProfileFirstRecord(0,CONSTRECORDS);
    uCellProfile.disablePreviousButton();
    uCellProfile.doPagination();
    sessionStorage.readableCellCreatedDate=undefined;
    imgBinaryFile= null;
};

/**
 * The purpose of this function is to get selected cell ACL settings.
 */
cellProfile.prototype.getSelectedCellACLSettings = function () {
    var objCellAcl = new cellAcl();
    var cellName = sessionStorage.selectedcell;
    objCellAcl.createCellACLRoleTable(cellName);
};


/**
 * The purpose of this function is to extract profile information
 * from response.
 * 
 * @param response
 */
cellProfile.prototype.retrieveProfileInfoFromResponse = function (response) {
    var MAXLENDESCRIPTION = 1180;
    var DISPLAYCHAR = 1179;
    var lenDescription = 0;
    response = response.bodyAsJson();
    var resDisplayName = response.DisplayName;
    var resDescription = response.Description;
    //var shorterDisplayName = objCommon.getShorterEntityName(resDisplayName);
    imgBinaryFile = response.Image;
    var profileImageName = response.profileImageName;
    $("#dvUserImage").show();
    $("#spanDisplay").show();
    $("#idDescription").show();
    if(resDisplayName == null){
        resDisplayName = "";
    }
    if (profileImageName != undefined && profileImageName != "defaultImage.jpg" && profileImageName != 'undefined') {
        $("#lblProfileImage").show();
        $("#btRremoveProfileImage").show();
        var shorterProfileImageName = uCellProfile.getShorterProfileImageName(profileImageName);
        $("#lblProfileImage").text(shorterProfileImageName);
    }
    $("#displayNameID").text(resDisplayName);
    $("#displayNameID").attr('title', resDisplayName);
    if (resDescription != null) {
        lenDescription = resDescription.length;
    }
    //$("#descriptionID").text(resDescription);
    //$("#descriptionID").attr('title', resDescription);
    /*if (lenDescription > MAXLENDESCRIPTION) {
        var shorterDescription = resDescription.substring(0, DISPLAYCHAR) + "..";
        $("#descriptionID").text(shorterDescription);
        //$("#descriptionID").attr('title', resDescription);
    }*/
    if(resDescription == null){
        resDescription = "";
    }
    if (resDescription != null) {
        uCellProfile.checkDesciptionLength(resDescription,MAXLENDESCRIPTION);
    }
    //should the image binary data is not null , data would be converted into Image.
    if (imgBinaryFile!= null && imgBinaryFile!= undefined && imgBinaryFile != '') {
        uCellProfile.convertBinaryDataToImage(imgBinaryFile, profileImageName); 
    }else{
        document.getElementById('dvUserImage').innerHTML = "<figure class='cellProfileImage'>User Photo</figure>";
    }
};

/**
 * The purpose of the following method is to convert binary data into a image.
 * @param binaryFormatImage
 *//*
cellProfile.prototype.convertBinaryDataToImage = function (binaryFormatImage, profileImageName) { 
    document.getElementById('dvUserImage').innerHTML = "";
    var img = document.createElement('img');
    img.id="imgUserPhoto";
    img.src = binaryFormatImage;
    img.width="124";
    img.height="126";
    img.alt = profileImageName;
    document.getElementById('dvUserImage').appendChild(img);
};*/


/**
 * The purpose of this method is to perform attach file operation
 */
cellProfile.prototype.attachFile = function(popupImageErrorId, fileDialogId) {
    var file = document.getElementById(fileDialogId).files[0];
    uCellProfile.fileName = document.getElementById(fileDialogId).value;
    if (file) {
        profileImageName = file.name;
        isProfileImage = true;
        var imageFileSize = file.size / 1024;
        if (uCellProfile.validateFileType(uCellProfile.fileName, imageFileSize,
                popupImageErrorId)) {
            //$("#lblProfileImage").hide();
            //$("#btRremoveProfileImage").hide();
            //$("#editCellProfileDialogBox").css('height', 375);
            uCellProfile.getAsBinaryString(file);
        }
    }
};


/**
 * The purpose of this method is to get file content as text
 * @param readFile
 */
cellProfile.prototype.getAsBinaryString = function(readFile) {
    try {
        var reader = new FileReader();
    } catch (e) {
        //uCellProfile.spinner.stop();
        //document.getElementById('successmsg').innerHTML = "Error: seems File API is not supported on your browser";
        return;
    }
    reader.readAsDataURL(readFile, "UTF-8");
    reader.onload = uCellProfile.loaded;
    reader.onerror = uCellProfile.errorHandler;
};

/**
 * The purpose of this method is to read file data
 * @param evt
 */
cellProfile.prototype.loaded = function(evt) {
    imgBinaryFile = null;
    imgBinaryFile = evt.target.result;
    //document.getElementById("fileID").value = '';
};

/**
 * The purpose of this method is to perform error handling for file read. 
 * @param evt
 */
cellProfile.prototype.errorHandler = function(evt) {
    if (evt.target.error.code == evt.target.error.NOT_READABLE_ERR) {
        uCellProfile.spinner.stop();
        alert("Error reading file...");
        //document.getElementById('successmsg').innerHTML = "Error reading file...";
    }
};

/**
 * This method ensures that only image file is added.
 * @param filePath
 * @returns {Boolean}
 */
cellProfile.prototype.validateFileType = function(filePath, imageSize, popupImageErrorId) {
    var fileExtension = filePath.substring(filePath.lastIndexOf('.') + 1)
            .toLowerCase();
    if (fileExtension.toLowerCase() == "jpeg"
            || fileExtension.toLowerCase() == "png"
    ) {
        if (imageSize > getUiProps().MSG0117) { //1000KB
            imgBinaryFile = null;
            document.getElementById(popupImageErrorId).innerHTML = "";
            document.getElementById(popupImageErrorId).innerHTML = getUiProps().MSG0199;
            isFileValid = false;
            return false;
        } else {
            document.getElementById(popupImageErrorId).innerHTML = "";
            isFileValid = true;
            return true;
        }
    } else {
        imgBinaryFile = null;
        document.getElementById(popupImageErrorId).innerHTML = "";
        document.getElementById(popupImageErrorId).innerHTML = getUiProps().MSG0116;
        isFileValid = false;
        return false;
    }
};
    
/**
 * The purpose of the following method is to reset the file input.
 */
cellProfile.prototype.resetFileInput = function(fileDialogID, popupImageErrorId) {
    var input = $(fileDialogID);
    var clone = input.clone(); // We create a clone of the original element
    input.replaceWith(clone); // And substitute the original with the clone
    $(fileDialogID).replaceWith($(fileDialogID).clone());
    document.getElementById(popupImageErrorId).innerHTML = "";
};


/**
 * The purpose of the following function is to reset persist session
 * details.
 */
cellProfile.prototype.persistSessionDetail = function() { 
    var jsonData = {};
    var tempToken = sessionStorage.tempToken;
    var envName = sessionStorage.selectedEnvName;
    var unitURL = sessionStorage.selectedUnitUrl;
    var refreshToken = sessionStorage.tempRefreshToken;
    var expiresIn = sessionStorage.tempExpiresIn;
    jsonData["token"] = tempToken;
    jsonData["environmentName"] = envName;
    jsonData["baseURL"] = unitURL;
    jsonData["refreshToken"] = refreshToken;
    jsonData["expiresIn"] = expiresIn;
    setClientStore(jsonData);
};


/**
 * The purpose of the following method is to store new token values(Refresh and Access)
 * @param data
 */
cellProfile.prototype.storeNewTokenValues = function (data) { 
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
};

/**
 * The purpose of the following method is to set new token values.
 * @param data
 */
cellProfile.prototype.setNewTokenValues = function(data) {
    uCellProfile.storeNewTokenValues(data);
    sessionStorage.tokenCreationDateTime ='';
    var token = getClientStore().token;
    var refreshToken = getClientStore().refreshToken;
    var expiresIn = getClientStore().expiresIn;
    sessionStorage.tempToken = token;
    sessionStorage.tempRefreshToken = refreshToken;
    sessionStorage.tempExpiresIn = expiresIn;
    sessionStorage.tokenCreationDateTime = Date.now();
};

/**
 * The purpose of the following method is to cell refresh token API and set the new values.
 */
cellProfile.prototype.getNewTokenValues = function () {
        var paramTargetURL = sessionStorage.selectedUnitUrl;
        let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
        var paramTargetCellUrl = ManagerInfo.cellUrl;
        var refreshtokenURL = paramTargetCellUrl + "__token";
        let tokenCredential = {
            grant_type: "refresh_token",
            refresh_token: getClientStore().refreshToken
        };
        if (!ManagerInfo.isCellManager) {
        $.extend(
                true,
                tokenCredential,
                {
                    p_target : paramTargetURL
                }
            );
        } 
            $.ajax({
            dataType : 'json',
            url : refreshtokenURL,
            data : tokenCredential,
            headers: {
                'Accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            },
            type : 'POST',
            async : false,
            success : function(data) {
                uCellProfile.setNewTokenValues(data);
            },
            error : function(error) {
                console.log(error);
            }
        });
};


/**
 * This method is used for fetching external cell list pertaining to the selected cell from cell list.
 * @returns
 */
cellProfile.prototype.retrieveExternalCellList = function() {
    var baseUrl = getClientStore().baseURL;
    var cellName = sessionStorage.selectedcell;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var objExtCellManager = new _pc.ExtCellManager(accessor);
    var json = objExtCellManager.retrieve("");
    return json;
};

/**
 * The purpose of this method is to fetch external cell name.
 * @param uri
 * @returns
 */
cellProfile.prototype.getExternalCellName = function(uri) {
    //function getExternalCellName(uri) {
        var arrUri = uri.split("/");
        var externalCellName = arrUri[3];
        return  externalCellName;
    };

/**
 * The purpose of this method is to fetch unit url of external cell to whome it belong.
 * @param uri
 * @returns
 */
cellProfile.prototype.getUnitOfExternalCell = function(uri) {
    var arrUri = uri.split("/");
    var unitUrl = arrUri[2];
    return  unitUrl;
};  
    
/**
 * The purpose of the following method is to fetch the response.
 * @param json
 * @param cellName
 * @returns
 */
cellProfile.prototype.retrieveCollectionResponse = function (json,cellName) {
    var baseUrl = getClientStore().baseURL;
    var response = null;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }
    var path = sessionStorage.selectedcellUrl+"__/";
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var objJDavCollection = new _pc.DavCollection(accessor, path);
    response = objJDavCollection.getJSON(profileFileName);
    return response;
    
};

/**
 * The purpose of the following method is to diplay Image of the external cell.
 * @param binaryFormatImage
 * @param count
 * @param externalCellName
 */
cellProfile.prototype.displayExternalCellInformation = function (binaryFormatImage,count,externalCellName,shorterExternalCellName,displayName, unitUrl, scope) { 
    var selectedUnit = sessionStorage.selectedUnitUrl;
    if (unitUrl != selectedUnit && scope == 'Private') {
        displayName = '';
        binaryFormatImage = null;
    }
    var img = document.createElement('img');
    img.id="imgUserPhoto_"+count;
    if (displayName == undefined) {
        displayName = externalCellName;
    }
    if (binaryFormatImage!= null && binaryFormatImage!= undefined) {
        img.src = binaryFormatImage;    
    }
    else {
        img.src = "./newImages/userImage.jpg";      
    }
    img.width="114";
    img.height="99";
    img.title = displayName;
    img.style.cssText = 'border:1px  solid #dfdfdf;';
    $('<div class="innerDiv" style="width:125px;float:left;margin-left:43px; margin-top:20px;"  id=dv_'+count+'/>') // create div
    .attr({
    })
    .appendTo('#dvExternalCellRegion');
    $('#dv_'+count+'').append(img);
    $("#"+img.id).after("<div title="+externalCellName+" style='font-family:Segoe UI;font-size:0.9em; margin: 0 auto;'>"+shorterExternalCellName+"</div>");
};

/**
 * The purpose of the following method is to get image of the external cell.
 * @param response
 * @param count
 * @param externalCellName
 */
cellProfile.prototype.getImage = function (response,count,externalCellName,shorterExternalCellName, unitUrl) {
    response = response.bodyAsJson();
    var displayName =  response.DisplayName;
    var binaryImage = response.Image;
    var scope = response.Scope;
    uCellProfile.displayExternalCellInformation(binaryImage,count,externalCellName,shorterExternalCellName,displayName, unitUrl, scope);
};

/**
 * The purpose of the following method is to fetch cell profile information of the first 6 records.
 */
cellProfile.prototype.retrieveCellProfileFirstRecord = function(startIndex,endIndex) {
    var json = uCellProfile.retrieveExternalCellList();
    var jsonString = json.rawData;
    var sortData = objCommon.sortByKey(jsonString, '__published');
    var recordSize = jsonString.length;
    if (recordSize < CONSTRECORDS && recordSize>0 ) {
        endIndex = recordSize;
        var paginationInformation = " 1 - " +recordSize+ " of "+recordSize+" ";
        $('#dvPages').append(paginationInformation);
    }
    uCellProfile.retrieveCellProfile(startIndex,endIndex);
};

/**
 * The purpose of the following method is to fetch cell profile image.
 * @param startIndex
 * @param endIndex
 */
cellProfile.prototype.retrieveCellProfile = function(startIndex,endIndex) {
    var json = uCellProfile.retrieveExternalCellList();
    var jsonString = json.rawData;
    var sortData = objCommon.sortByKey(jsonString, '__published');
    var recordSize = jsonString.length;
    if (recordSize == 0) { 
        document.getElementById("searchMessage").style.display = "inline-block";
    }
    else {
        document.getElementById("searchMessage").style.display = "none";
    for ( var count = startIndex; count < endIndex; count++) {
        var arrayData = jsonString[count];
            uCellProfile.setCellProfileData(arrayData.Url, count);
        }
    }
};
cellProfile.prototype.setCellProfileData = function(cellUrl, count) {
    let externalCellName = "";
    let unitUrl = "";
    objCommon.getCell(cellUrl).done(function(cellObj, status, xhr) {
        externalCellName = cellObj.cell.name;
        let ver = xhr.getResponseHeader("x-personium-version");
        if (ver >= "1.7.1") {
            unitUrl = cellObj.unit.url;
        } else {
            unitUrl = uCellProfile.getUnitOfExternalCell(cellUrl);
        }
    }).fail(function(xmlObj) {
       externalCellName = uCellProfile.getExternalCellName(cellUrl);
       unitUrl = uCellProfile.getUnitOfExternalCell(cellUrl);
    }).always(function() {
        var response = uCellProfile.retrieveCollectionResponse(profileFileName,externalCellName);
        var shorterExternalCellName = objCommon.getShorterName(externalCellName,16);
        uCellProfile.getImage(response,count,externalCellName,shorterExternalCellName, unitUrl);
    });
}

/**
 * The purpose of the following method is to return external cell record size.
 * @returns
 */
cellProfile.prototype.getExternalCellRecordSize = function() { 
var json = uCellProfile.retrieveExternalCellList();
var jsonString = json.rawData;
var sortData = objCommon.sortByKey(jsonString, '__published');
var recordSize = jsonString.length;
return recordSize;
};

/**
 * The purpose of the following method is to return page count.
 * @returns {Number}
 */
cellProfile.prototype.displayPages = function() { 
    var json = uCellProfile.retrieveExternalCellList();
    var jsonString = json.rawData;
    var sortData = objCommon.sortByKey(jsonString, '__published');
    var recordSize = jsonString.length;
    var pages = recordSize/CONSTRECORDS;
    pages = Math.ceil(pages);
    return pages;
};

/**
 * The purpose of the following method is to enable next button of the external cell section
 */
cellProfile.prototype.enableNextButton = function() {
    $('#btnNext').removeAttr('disabled');
    $('#btnNext').removeClass('disabled');
    $('#btnNext').removeClass('nextDisable');
    $('#btnNext').css('cursor','pointer');
};
/**
 * The purpose of the following method is to disable next button of the external cell section
 */
cellProfile.prototype.disableNextButton = function() {
$("#btnNext").attr('disabled','disabled');
$('#btnNext').addClass('disabled');
$('#btnNext').addClass('nextDisable');
$('#btnNext').css('cursor','default');
};

/**
 * The purpose of the following method is to enable previous button of the external cell section
 */
cellProfile.prototype.enablePreviousButton = function() {
    $('#btnPrevious').removeAttr('disabled');
    $('#btnPrevious').removeClass('disabled');
    $('#btnPrevious').removeClass('prevDisable');
    $('#btnPrevious').css('cursor','pointer');
};

/**
 * The purpose of the following method is to disable next button of the external cell section
 */
cellProfile.prototype.disablePreviousButton = function() {
    $("#btnPrevious").attr('disabled','disabled');
    $('#btnPrevious').addClass('disabled');
    $('#btnPrevious').addClass('prevDisable');
    $('#btnPrevious').css('cursor','default');
    //btnPrevious.setAttribute("class", "prev prevDisable default");
};

/**
 * The purpose of the following method is to move to the next record.
 */
cellProfile.prototype.movePrevious = function() {
    var endIndex =0;
    var startIndex = 0;
    var recordSize = uCellProfile.getExternalCellRecordSize();
    var mod = MAXRECORDS%CONSTRECORDS;
    if (mod> 0) {
        MAXRECORDS = MAXRECORDS-mod;
        MAXRECORDS = MAXRECORDS+CONSTRECORDS;
    }
    MAXRECORDS = MAXRECORDS-CONSTRECORDS;
    endIndex = MAXRECORDS;
    startIndex = endIndex - CONSTRECORDS;
    uCellProfile.enableNextButton();
    if (startIndex < 0) {
        //Disable Previous Button.
        uCellProfile.disablePreviousButton();
    } else {
        var paginationInformation = " "+parseInt(startIndex+1)+" - "+endIndex+" of "+recordSize+" ";
        $('.innerDiv').remove();
        jQuery('#dvExternalCellRegion div').html('');
        $("#textPagination").html('');
        $("#textPagination").html(paginationInformation);
        uCellProfile.retrieveCellProfile(startIndex,endIndex);  
        uCellProfile.enableNextButton();
    }
};

/**
 * The purpose of the following method is to move to the next record.
 */
cellProfile.prototype.moveNext = function() {
    var startIndex = 0;
    var endIndex = 0;
    uCellProfile.enablePreviousButton();
    $('.innerDiv').remove();
    jQuery('#dvExternalCellRegion div').html('');
    var recordSize = uCellProfile.getExternalCellRecordSize();
    startIndex = MAXRECORDS; 
    endIndex = MAXRECORDS+CONSTRECORDS; 
    if (endIndex>recordSize){
        endIndex = recordSize ;
        uCellProfile.disableNextButton();
    }
    var paginationInformation = " "+parseInt(startIndex+1)+" - "+endIndex+" of "+recordSize+" ";
    $("#textPagination").html('');
    $("#textPagination").html(paginationInformation);
    uCellProfile.retrieveCellProfile(startIndex,endIndex);
    MAXRECORDS = endIndex;

};

/**
 * The purpose of the following method is to do pagination.
 */
cellProfile.prototype.doPagination = function() {
    var totalPages = uCellProfile.displayPages();
    var recordSize = uCellProfile.getExternalCellRecordSize();
    if (totalPages > 1) {
        var span = document.createElement("span");
        span.id= "textPagination";
        //Previous Button.
        var btnPrevious = document.createElement("input");
        btnPrevious.id = "btnPrevious";
        btnPrevious.type = "button";
        btnPrevious.value = "previous"; 
        btnPrevious.setAttribute("class", "prev");
        btnPrevious.setAttribute('onclick', 'uCellProfile.movePrevious()');
        $('#dvPages').append(btnPrevious);
        uCellProfile.disablePreviousButton();
        //Next Button.
        var btnNext = document.createElement("input");
        btnNext.id = "btnNext";
        btnNext.type = "button";
        btnNext.value = "Next"; 
        btnNext.setAttribute("class", "next");
        var paginationInformation = " 1 - "+MAXRECORDS+" of "+recordSize.toString()+" ";
        $('#dvPages').append(span);
        $('#dvPages').append(btnNext);
        $("#textPagination").html(paginationInformation);
        btnNext.setAttribute('onclick', 'uCellProfile.moveNext()');
        uCellProfile.enableNextButton();
    }
    if (recordSize == CONSTRECORDS) {
        var paginationInformation = " 1 - "+MAXRECORDS+" of "+recordSize.toString()+" ";
        $('#dvPages').append(paginationInformation);
    }
};

/**
 * The purpose of this method is to display access token (pop up).
 */
cellProfile.prototype.showAccessToken = function() {
    $("#txtAccessToken").remove();
    jQuery(dvTokenTextArea)
    .append(
            '<textarea name="" cols="" rows="" class="textAreaShowAccessToken" readonly="readonly" id="txtAccessToken" tabindex="1"></textarea>');
    var accessToken = getClientStore().token;
    var expiresIn = getClientStore().expiresIn;
    var expiresInMilliseconds = parseInt(expiresIn)* 1000;
    var tokenExpiryDateTime = parseInt(sessionStorage.tokenCreationDateTime)+parseInt(expiresInMilliseconds);
    expiryDateTime = "/Date("+tokenExpiryDateTime+")/";
    $("#txtAccessToken").text(accessToken);
    $('#lblExpiryTime').html(getUiProps().MSG0394+": " + objCommon.getReadableDateForAccessToken(expiryDateTime,tokenExpiryDateTime));
    setTimeout(function() {
        $('#txtAccessToken').scrollTop(0);
    }, 10);
};

/**
 * The purpose of the following method is to create profile of the first cell.
 * @param displayName
 * @param descriptionDetails
 * @param newlyCreatedCell
 */
cellProfile.prototype.createFirstCellProfile = function(displayName,descriptionDetails,newlyCreatedCell, scopeSelection) {
    var response = null;
    var fileData = null;
        fileData = {
        "DisplayName" : displayName,
        "Description" : descriptionDetails,
        "Image" : imgBinaryFile,
        "Scope" : scopeSelection,
        "ProfileImageName" : profileImageName
    };
    response = uCellProfile.retrieveCollectionAPIResponse(fileData, "EDIT",newlyCreatedCell);
    var statusCode = objCommon.getStatusCode(response);

    if (statusCode === 201 || statusCode === 204) {
        sessionStorage.selectedcell = newlyCreatedCell;
        var accessor = objCommon.initializeAccessor(getClientStore().baseURL, sessionStorage.selectedcell,"","");
        var objCellManager = new _pc.CellManager(accessor);
        sessionStorage.selectedcellUrl = objCellManager.getCellUrl(sessionStorage.selectedcell);
        if (scopeSelection == "Public") {
            this.appendAllReadACLToProfile();
        }
    }
};

cellProfile.prototype.appendAllReadACLToProfile = function() {
    var baseUrl = getClientStore().baseURL;
    if (!baseUrl.endsWith("/")) {
        baseUrl += "/";
    }
    var cellName = sessionStorage.selectedcell;
    var path = sessionStorage.selectedcellUrl + "__/profile.json";
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var objJDavCollection = new _pc.DavCollection(accessor, path);
    var objXmlBaseUrlRole = new _pc.Role(accessor);
    objXmlBaseUrlRole.setBoxName("[main]");
    var resourceBaseUrl = objXmlBaseUrlRole.getResourceBaseUrl();
    var boxName = null;
    var roleName = "all (anyone)";
    json = {
        "Name" : roleName,
        "_Box.Name" : boxName
    };
    var objJRole = new _pc.Role(accessor, json);
    var objJAcl = new _pc.Acl();
    objJAcl.setBase(resourceBaseUrl);
    objAce = new _pc.Ace();
    objAce.setRole(objJRole);
    objAce.setPrincipal('all');
    objAce.addPrivilege("D:read");
    objJAcl.addAce(objAce);

    var objJAclManager = new _pc.AclManager(accessor, objJDavCollection);
    var response = objJAclManager.setAsAcl(objJAcl);
    return response;
}

//Methods for Expand and collapse - More/Less Start.
/**
 * The purpose of this method is to create more/less link functionality
 */
cellProfile.prototype.clickMoreLink = function(){
    if($("#cellExpandCollapse").text() == "more"){
        $("#bpDescription").removeClass("expandDesc");
        $("#descriptionID").removeClass("descWithMoreLink");
        $("#descriptionID").addClass("expanded");
        $("#cellExpandCollapse").text("less");
    }else if($("#cellExpandCollapse").text() == "less"){
        $("#descriptionID").removeClass("expanded");
        $("#descriptionID").addClass("descWithMoreLink");
        $("#descriptionID").scrollTop(0);
        $("#cellExpandCollapse").text("more");
    }
};

/**
 * This method checks the length of description and shows more link accordingly
 */
cellProfile.prototype.checkDesciptionLength = function(description,allowedLength){
    var descLength = description.length;
    $("#descriptionID").text(description);
    if (descLength > allowedLength){
        $("#descriptionID").removeClass("expanded");
        $("#descriptionID").addClass("descWithMoreLink");
        $("#descriptionID").scrollTop(0);
        $("#cellExpandCollapse").text("more");
        document.getElementById("cellExpandCollapse").style.display = "block";
    } else {
        document.getElementById("cellExpandCollapse").style.display = "none";
    }
};
//End

/**
 * The purpose of this function is to remove profiel image on click 
 * of cross icon inside edit cell profile poppup window.
 */
cellProfile.prototype.removeImage = function(){
    $("#editCellProfileDialogBox").css('height', 375);
    $("#lblProfileImage").hide();
    $("#btRremoveProfileImage").hide();
    isProfileImage = false;
};

/**
 * The purpose of this function is to return shorter imageName
 * if name exceeds in length of 20.
 * @param profileImageName
 * @returns
 */
cellProfile.prototype.getShorterProfileImageName = function(profileImageName){
    var shorterProfileImageName= profileImageName;
    var trimmedLength = 10;
    if (profileImageName.length > 20){
        var lastIndex = profileImageName.lastIndexOf(".");
        var lastString = profileImageName.substring(lastIndex, profileImageName.length);
        var startString = profileImageName.substring(0,trimmedLength);
        var midString = profileImageName.substring(lastIndex-2, lastIndex);
        shorterProfileImageName = startString + "..." + midString + lastString;
    }
    return shorterProfileImageName;
};

/**
 * Following method retrieves cell profile information.
 * @returns reposne.
 */
cellProfile.prototype.getCellProfileInfo = function(profileLng) {
    var cellName = sessionStorage.selectedcell;
    var response = uCellProfile.retrieveCollectionAPIResponse(profileFileName,
            "RETRIEVE", cellName, profileLng);
    return response;
};

/**
 * Specify the language and display the details of the profile.
 */
cellProfile.prototype.changeEditProfileLng = function (sel) {
    uCellProfile.displayCellProfileInfo(sel.value);
}

/**
 * The purpose of this function is to display profile details.
 */
cellProfile.prototype.displayCellProfileInfo = function (profileLng) {
    var target = document.getElementById('spinner');
    var spinner = new Spinner(objCommon.opts).spin(target);
    var SUCCESSSTATUSCODE = 200;
    var FAILEDSTATUSCODE = 404;
    var response = uCellProfile.getCellProfileInfo(profileLng);
    spinner.stop();
    if (response.httpClient.status === SUCCESSSTATUSCODE) {
        // Add locales to the dropdown list
        var localesPath = sessionStorage.selectedcellUrl+"__/locales";
        var collectionList = objOdata.getCollectionList(localesPath);
        var recordSize = collectionList.length;
        for ( var count = 0; count < recordSize; count++) {
            var arrayData = collectionList[count];
            var collectionName = decodeURIComponent(objOdata.getName(arrayData.Name.toString()));
            if ($("#profileLngList option[value='" + collectionName + "']").length == 0) {
                let option = $('<option>')
                            .val(collectionName)
                            .text(collectionName)
                $("#profileLngList").append(option);
            }        
        }

        $("#profileLngList").val(profileLng);
        uCellProfile.retrieveProfileInfoFromResponse1(response);
    } else if (response.httpClient.status === FAILEDSTATUSCODE) {
        $("#dvdisplayName").text("-");
        $("#dvdisplayDesc").text("-");
        $("#figboxProfileImage").addClass("boxProfileImage");
        $("#imgBoxViewProfile").css("display", "none").attr('src', "#");
    }
    spinner.stop();
    sessionStorage.readableCellCreatedDate = undefined;
    imgBinaryFile = null;
};

/**
 * The purpose of this function is to extract profile information
 * from response.
 * 
 * @param response
 */
cellProfile.prototype.retrieveProfileInfoFromResponse1 = function (response) {
    response = response.bodyAsJson();
    var tempDispName = objCommon.getProfileDisplayName(response);
    var tempDescription = objCommon.getProfileDescription(response);
    var resDisplayName = objCommon.replaceNullValues(tempDispName,getUiProps().MSG0275);
    var resDescription = objCommon.replaceNullValues(tempDescription,getUiProps().MSG0275);
    imgBinaryFile = response.Image;
    var profileImageName = response.profileImageName;
    if(resDisplayName == null){
        resDisplayName = "-";
    }
    
    if(resDescription == null || resDescription.length==0) {
        resDescription = "-";
    }

    $("#dvdisplayName").text(resDisplayName);
    $("#dvdisplayDesc").text(resDescription);
    objCommon.showProfileImage(imgBinaryFile,'#imgBoxViewProfile','#figboxProfileImage');
};

/**
 * The purpose of the following method is to convert binary data into a image.
 * @param binaryFormatImage
 */
cellProfile.prototype.convertBinaryDataToImage = function (binaryFormatImage, profileImageName) { 
    document.getElementById('ProfilePhoto').innerHTML = "";
    var img = document.createElement('img');
    img.id="imgUserPhoto";
    img.src = binaryFormatImage;
    img.width="71";
    img.height="67";
    img.alt = profileImageName;
    $("#ProfilePhoto").removeClass('imgBorder');
    document.getElementById('ProfilePhoto').appendChild(img);
};

/**
 * Following method checks display name validations on blur event.
 */
cellProfile.prototype.editDisplayNameBlurEvent = function() {
    var displayName = $("#editDisplayName").val();
    var displayNameSpan = "popupEditDisplayNameErrorMsg";
    var txtDisplayName = "#editDisplayName";
    validateDisplayName(displayName, displayNameSpan, txtDisplayName);
};

/**
 * Following method checks description validations on blur event.
 */
cellProfile.prototype.editDescriptionBlurEvent = function() {
    document.getElementById("popupEditDescriptionErrorMsg").innerHTML = "";
    var descriptionDetails = document.getElementById("editDescription").value;
    var descriptionSpan = "popupEditDescriptionErrorMsg";
    validateDescription(descriptionDetails, descriptionSpan);
};

function divOnFocusBrowseOnCellProfile() {
    $(".browseEditCellProfile").css("outline","-webkit-focus-ring-color auto 5px");
}

function divOnBlurBrowseOnCellProfile() {
    $(".browseEditCellProfile").css("outline","none");
}

$(function() {
    uCellProfile.persistSessionDetail();
    var oldRefreshToken = getClientStore().refreshToken;
    if (oldRefreshToken != undefined) {
        setInterval(function() {
            uCellProfile.getNewTokenValues();
            uCellProfile.showAccessToken();
            let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
            ManagerInfo.refreshToken = getClientStore().refreshToken;
            sessionStorage.ManagerInfo = JSON.stringify(ManagerInfo);
        }, 1800000); //30 Minutes.1800000
    }
    $("#btnEditCellProfile").click(function() {
        uCellProfile.updateCellProfile();
        
    });
});

