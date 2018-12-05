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
function common() {
}
$(document).ready(function() {
    window.setInterval(objCommon.checkIdleTime, 1000);
    document.onclick = function() {
        LASTACTIVITY = new Date().getTime();
    };
    document.onmousemove = function() {
        LASTACTIVITY = new Date().getTime();
    };
    document.onkeypress = function() {
        LASTACTIVITY = new Date().getTime();
    };
    $.ajaxSetup({ cache : false });
      if (getUiProps() != undefined) {
        common.prototype.linkIcon = getUiProps().MSG0224;
        common.prototype.linkSymbolHTTPCode = getUiProps().MSG0223;
        common.prototype.startBracket = getUiProps().MSG0290;
        common.prototype.endBracket = getUiProps().MSG0291;
    }
});
var objCommon = new common();
var cellList = null;
//Default timeout limit - 60 minutes.
var IDLE_TIMEOUT =  3600000;
// Records last activity time.
var LASTACTIVITY = new Date().getTime();
common.prototype.minRecordInterval = 0;
common.prototype.maxRecordInterval = 50;
common.prototype.noOfRecordsToBeFetched = 100;
common.prototype.maxNoOfPages = 10;
common.prototype.MAXROWS = 50;
common.prototype.PERSONIUM_LOCALUNIT = "personium-localunit:";
common.prototype.PERSONIUM_LOCALCEL = "personium-localcell:";
common.prototype.PERSONIUM_LOCALBOX = "personium-localbox:";
common.prototype.DOUBLE_NEGATIVE_MIN_VALUE = -1.79e+308;
common.prototype.DOUBLE_NEGATIVE_MAX_VALUE = -2.23e-308;
common.prototype.DOUBLE_POSITIVE_MIN_VALUE = 2.23e-308;
common.prototype.DOUBLE_POSITIVE_MAX_VALUE = 1.79e+308;
common.prototype.assignDataSetProfile = "";
common.prototype.dataSetProfile = "";

/**
 * This method checks idle time.
 */
common.prototype.checkIdleTime = function() {
    if (new Date().getTime() > LASTACTIVITY + IDLE_TIMEOUT) {
        //if (objCommon.isSessionExist() == null) {
            // If Cell Profile is loaded.
            if (sessionStorage.isResourceMgmt == "true") {
                sessionStorage.isResourceMgmt == "false";
                objCommon.openPopUpWindow("#timeOutCellProfileDialogBox",
                        "#timeOutCellProfileModalWindow");
            }
        //}
    }
};

/**
 * This method opens up pop up window.
 * @param idDialogBox
 * @param idModalWindow
 * @param selectedEnvID
 */
common.prototype.openPopUpWindow = function(idDialogBox, idModalWindow,
        selectedEnvID) {
    envtID = selectedEnvID;
    $(idModalWindow).fadeIn();
    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    $(idDialogBox).css('top', windowHeight / 2 - $(idDialogBox).height() / 2);
    $(idDialogBox).css('left', windowWidth / 2 - $(idDialogBox).width() / 2);
    if (idDialogBox == '#timeOutCellProfileDialogBox') {
        $("#btnTimeout").focus();
    }
};

/**
 * This method redirects session expiration pop up to the login page.
 */
common.prototype.redirectToLoginPageOnServerExpiration = function() {
    var contextRoot = sessionStorage.contextRoot;
    if (contextRoot.length == 0) {
        // "/" escapes in URL thereby not altering the URL.
        window.location.href = "/";
    } else {
        objCommon.redirectLoginPage();
    }
};

/**
 * The purpose of this function is to open model window for creating role.
 */
/*common.prototype.openCreateEntityModal= function(parentDivId, childDivId) {*/
function openCreateEntityModal(parentDivId, childDivId, firstElementToBeFocussed) {
//var id = objCommon.isSessionExist();
//if (id != null) {
  $(parentDivId).fadeIn(0);
  var winH = $(window).height();
  var winW = $(window).width();
  $(childDivId).css('top', winH / 2 - $(childDivId).height() / 2); 
  $(childDivId).css('left', winW / 2 - $(childDivId).width() / 2);
  if (childDivId == '#createBoxDialog') {
    $(childDivId).css('top', 125);
    uCellProfile.resetFileInput('#idImgFileBox', 'popupBoxImageErrorMsg');
  }
  if (parentDivId == '#createRoleModal' && childDivId == '#createRoleDialog') {
    refreshCreateRolePopup();
    retrieveBox("dropDownBox");
  }
  if (parentDivId == '#roleEditModalWindow' && childDivId == '#roleEditDialogBox') {
    getSelectedRoleDetails();
  }
  if (parentDivId == '#relationEditModalWindow' && childDivId == '#relationEditDialogBox') {
       getSelectedRelationDetails();
    }
  if (parentDivId == '#accountEditModalWindow' && childDivId == '#accountEditDialogBox') {
    getSelectedAccountDetails();
    }
  if (parentDivId == '#externalCellEditModalWindow' && childDivId == '#externalCellEditDialogBox') {
    objExtCell.bindDropDown(true);
    objExtCell.getSelectedExternalCellDetails();
    }
  if (parentDivId == '#multipleExternalCellDeleteModalWindow' && childDivId == '#multipleExternalCellDeleteDialogBox') {
    var objExternalCell = new externalCell();
    objExternalCell.getMultipleExternalCellNames();
    $('#btnCancelDeleteExtCell').focus();
  }
  if (parentDivId == '#externalRoleModalWindow' && childDivId == '#externalRoleDialogBox') {
    var objExternalRole = new externalRole();
    objExternalRole.emptyAllFieldsValues();
  }
  if (parentDivId == '#createODataModal' && childDivId == '#createODataDialog') {
    var objOdata = new odata();
    objOdata.closeAddCollectionDropdown();
    objOdata.emptyFieldValues();
  }
  if (parentDivId == '#roleEditModalWindow' && childDivId == '#roleEditDialogBox') {
    editPopupRoleErrorMsg.innerHTML = "";
  }
  if (parentDivId == '#createETypeModal' && childDivId == '#createETypeDialog') {
    document.getElementById("popupETypeErrorMsg").innerHTML = "";
    $("#txtETypeName").val("");
    objCommon.removeStatusIcons('#txtETypeName');
  }
  if (parentDivId == '#linkRoleWithBoxModal' && childDivId == '#linkRoleWithBoxDialog') {
    roleBoxPopupErrorMsg.innerHTML = "";
    $("#roleNamePopup").val("");
  }
  if (parentDivId == '#linkRelationWithBoxModal' && childDivId == '#linkRelationWithBoxDialog') {
    relationBoxpopupErrorMsg.innerHTML = "";
    $("#relationNamePopup").val("");
  }
  if (parentDivId == '#createFolderModal' && childDivId == '#createFolderDialog') {
    document.getElementById("popupFolderErrorMsg").innerHTML = "";
    $("#txtFolderName").val("");
    var objOdata = new odata();
    objOdata.closeAddCollectionDropdown();
  }
  if (parentDivId == '#createCTypeModal' && childDivId == '#createCTypeDialog') {
    document.getElementById("popupCTypeErrorMsg").innerHTML = "";
    $("#txtCTypeName").val("");
    objCommon.removeStatusIcons('#txtCTypeName');
  }
  if (parentDivId == '#complexTypePropertyModalWindow' && childDivId == '#complexTypePropertyDialogBox') {
    uComplexTypeProperty.emptyComplexTypePropPopUpFieldsValues();
  }
  if (parentDivId == '#createAssociationModal' && childDivId == '#createAssociationDialog') {
    var fromEntityTypeName = uEntityTypeOperations.getSelectedEntityType();
    document.getElementById("fromEntityTypeName").title = fromEntityTypeName;
    document.getElementById("fromEntityTypeName").innerHTML = objCommon.getShorterEntityName(fromEntityTypeName);
    uSchemaManagement.clearPopUpFields();
    uSchemaManagement.bindEntityTypeDropDown();
  }
  if (parentDivId == '#propertyModalWindow' && childDivId == '#propertyDialogBox') {
    uEntityTypeProperty.emptyPropertyPopUpFieldsValues();
  }
  if (parentDivId == '#editCellProfileModalWindow' && childDivId == '#editCellProfileDialogBox') {
    //uCellProfile.resetFileInput('#idImgFile', 'popupEditUserPhotoErrorMsg');
    uCellProfile.populateCellProfilePopupFieldsWithData();
  }
  if (parentDivId == '#createEntityModalWindow' && childDivId == '#createEntityDialogBox') {
    uDataManagement.createEntityPopUp(false,null);
  }
  if (parentDivId == '#editEntityModalWindow' && childDivId == '#editEntityDialogBox') {
    uDataManagement.editEntityPopUp();
  }
  if (parentDivId == '#changePasswordModal' && childDivId == '#changePasswordDialog') {
    uChangePassword.clearPopUpFields();
  }
  if (parentDivId == '#createEngineServiceModal' && childDivId == '#createEngineserviceDialog') {
    document.getElementById("popupEngineServiceErrorMsg").innerHTML = "";
    $("#txtEngineServiceName").val("");
    var objOdata = new odata();
    objOdata.closeAddCollectionDropdown();
  }
  if (parentDivId == '#editBoxProfileModalWindow' && childDivId == '#editBoxProfileDialogBox') {
    objBoxProfile.showBoxProfileInformation();
  }
  if (parentDivId == '#tokenPopUpModalWindow' && childDivId == '#tokenDialogBox') {
    uCellProfile.showAccessToken();
  }
  if (parentDivId == '#editUserInfoModal' && childDivId == '#editUserInfoDialog') {
    var objEditUserInformation = new editUserInformation();
    objEditUserInformation.initializeEditUserInfoFieldsValues();
  }
  if (parentDivId == '#createNewUserModal' && childDivId == '#createNewUserDialog') {
    var objAdministratorManagement = new administratorManagement();
    objAdministratorManagement.emptyCreateUserPopupFieldValues();
  }
  if (parentDivId == '#modalCreateRel' && childDivId == '#dialogCreateRel') {
      var objRelation = new uRelation();
      objRelation.retrieveBox();
      objRelation.emptyCreateRelationPopupFields();
  }
  if (parentDivId == '#externalCellModalWindow' && childDivId == '#externalCellDialogBox') {
      objExtCell.emptyCreateExtCellPopUp();
      refreshDropDown();
      objExtCell.bindDropDown();
      objExtCell.bindRelationBoxDropDown();
      }
  if (parentDivId == '#createBoxPopUpModalWindow' && childDivId == '#createBoxPopUpDialogBox') {
      $('.popupContent').find('input:text').removeClass( "errorIcon validValueIcon" );
    }
  if (parentDivId == '#boxEditModalWindow' && childDivId == '#boxEditDialogBox') {
      $('.sectionContent').find('input:text').removeClass( "errorIcon validValueIcon" );
     }
  if (parentDivId == '#createRuleModal' && childDivId == '#createRuleDialog') {
    refreshCreateRulePopup();
  }
  if (parentDivId == '#ruleEditModalWindow' && childDivId == '#ruleEditDialogBox') {
    getSelectedRuleDetails();
  }
  /*if (parentDivId == '#multipleEntityDeleteModalWindow' && childDivId == '#multipleEntityDeleteDialogBox') {
      $("#createEntityTable tbody").empty();
      $("#editEntityTable tbody").empty();
  }*/
  if (firstElementToBeFocussed != undefined) {
      $("#"+firstElementToBeFocussed).focus();
  }
//  } else {
//     window.location.href = contextRoot;
//    }
}
/**
 * The purpose of this function is to close popup model
 */
function closeEntityModal(modelId) {
    if (modelId == '#tokenPopUpModalWindow') {
        $('#txtAccessToken').remove();
    }
    $(modelId).hide("fast");
    var selectedIndexValue = "";
    if (modelId == '#propertyModalWindow') {
        selectedIndexValue = document.getElementById("dropDownPropType").selectedIndex;
        if (selectedIndexValue == 0) {
            var input = document.getElementById("txtBoxPropDefaultValue");
            input.type = "text";
            $("#defaultTime").remove();
            $("#txtBoxPropDefaultValue").css("width", '240px');
            uEntityTypeProperty.setHTMLVal('#txtBoxPropDefaultValue', '');
        }
    } else if (modelId == '#complexTypePropertyModalWindow') {
        selectedIndexValue = document.getElementById("dropDownType").selectedIndex;
        if (selectedIndexValue == 0) {
            var input = document.getElementById("txtBoxDefaultValue");
            input.type = "text";
            $("#complexDefaultValueTime").remove();
            $("#txtBoxDefaultValue").css("width", '240px');
            $('#txtBoxDefaultValue').val('');
        }
    }
}

/**
 * Acquire login URL from session and make transition
 */
function logoutManager() {
    let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
    var loginUrl = ManagerInfo.loginURL;
    sessionStorage.clear();
    location.href = loginUrl;
}

/**
 * The purpose of this function is to check if records against
 * a particular entity exists or not.
 */
common.prototype.isRecordExist = function(recordSize, messageDivID) {
  if(recordSize > 0) {
    $(messageDivID).hide();
  } else {
    $(messageDivID).show();
  }
};

/**
 * This method redirects to the login page.
 */
common.prototype.redirectLoginPage = function() {
    var contextRoot = sessionStorage.contextRoot;
    window.location.href = contextRoot;
};


/**
 * The purpose of this function is to sort the table on the basis of updated date
 */
common.prototype.sortByKey = function(array, key) {
  return array.sort(function(firstHalf, secondHalf) {
    var firstPart = firstHalf[key];
    var secondPart = secondHalf[key];
    return ((secondPart < firstPart) ? -1 : ((firstPart > secondPart) ? 0 : 1));
  });
};

/**
 * The purpose of this method is to sort the array based on key in ascending order
 * @param array
 * @param key
 */
common.prototype.sortByKeyInAscOrder = function(array, key) {
  return array.sort(function (a, b) {
    if (a[key] > b[key])
      return 1;
    if (a[key] < b[key])
      return -1;
    // a must be equal to b
    return 0;
  });
};

/**
 * The purpose of this function is to enable delete button for multiple delete
 */
common.prototype.enableButton = function(id) {
  $(id).removeAttr("disabled");
  $(id).removeClass('deleteIconDisabled');
  $(id).addClass('deleteIconEnabled');
};

/**
 * The purpose of this function is to disable delete button for multiple delete
 */
common.prototype.disableButton = function(id) {
  $(id).attr('disabled', true);
  $(id).removeClass('deleteIconEnabled');
  $(id).addClass('deleteIconDisabled');
};

/**
 * The purpose of this function is to enable delete button for multiple delete
 */
common.prototype.enableEditButton = function(id) {
  $(id).removeAttr("disabled");
  $(id).removeClass('btnEditIconDisabled');
  $(id).addClass('btnEditIconEnabled');
};

/**
 * The purpose of this function is to disable delete button for multiple delete
 */
common.prototype.disableEditButton = function(id) {
  $(id).attr('disabled', true);
  $(id).removeClass('btnEditIconEnabled');
  $(id).addClass('btnEditIconDisabled');
};

/**
 * The purpose of this function is to uncheck/check parent checkbox on
 * the basis of child checkboxes.
 */
common.prototype.unCheck = function() {
  var cbSelected = document.getElementsByTagName('input');
  var len = cbSelected.length;
  for ( var count = 0; count < len; count++) {
    if (cbSelected[count].type == 'checkbox'
      && cbSelected[count].name == 'case' && count > 0) {
      //If child is unchecked
      if (cbSelected[count].checked === false) {
        chkSelectall.checked = false; //Main CheckBox checked false.
        return false;
      } else {
        chkSelectall.checked = true; //Main CheckBox checked True.
      }
    }
  }
};

/**
 * The purpose of this function is to check/uncheck all the checkboxes.
 */
common.prototype.checkBoxSelect = function(chkBox, id, editBtnID) {
    var cbSelected = document.getElementsByTagName('input');
    var len = cbSelected.length;
    for ( var count = 0; count < len; count++) {
        if (cbSelected[count].type == 'checkbox') {
            cbSelected[count].checked = chkBox.checked;
        }
    }
    if (chkBox.checked == true) {
        this.enableButton(id);
        this.disableEditButton(editBtnID);
    }
    if (chkBox.checked == false) {
        this.disableButton(id);
        this.disableEditButton(editBtnID);
    }
};

/**
 * The purpose of this function is to check and uncheck all checkboxes for assign grid. 
 * @param chkBox
 * @param id
 * @param editBtnID
 * @param checkBoxID
 * @param recordCount
 * @param parentCheckBoxID
 */
common.prototype.assignEntityCheckBoxSelect = function(chkBox, id, editBtnID,
        checkBoxID, recordCount, parentCheckBoxID) {
    if (parentCheckBoxID.checked == true) {
        this.enableButton(id);
        for ( var count = 0; count <= recordCount; count++) {
            $('#' + checkBoxID + count).attr('checked', true);
        }
    } else if (parentCheckBoxID.checked == false) {
        this.disableButton(id);
        for ( var count = 0; count <= recordCount; count++) {
            $('#' + checkBoxID + count).attr('checked', false);
        }
    }
};

/**
 * The purpose of the following method is to select/de-select all the rows of the data table.
 */
common.prototype.showSelectedRow = function(chkSelectall,colID,rowIDVal) {
  var cbSelected = document.getElementsByTagName('input');
  var len = cbSelected.length;
  if (chkSelectall.checked == true) {
    for ( var count = 0; count < len; count++) {
      var rowID = $('#'+rowIDVal+count);
      rowID.addClass('selectRow');
      $("#"+colID+count).hide();
    }
  } else {
      for (var count = 0; count < len; count++) {
      var rowID = $('#'+rowIDVal+count);
      rowID.removeClass('selectRow');
    }
  }
};

/**
 * The purpose of this method is to highlight rows according to their selection.
 */
common.prototype.rowSelect = function(objRow, rowID, chkBoxID, colID, delButID,
        chkAllID, count, totalRecordsize, editButID, collectionName, isAcl,
        fileType, tableID, collectionURL) {
    var targetID = event.target.id.indexOf("Link");
    if (fileType == "p:service") {
        sessionStorage.rowSelectCollectionName = collectionName;
    }
    if(targetID == -1){
        if (event.target.tagName.toUpperCase() !== "INPUT") {
            if (tableID == "webDavTable") {
                sessionStorage.selectedCollectionURL = collectionURL;
            }
            sessionStorage.rowSelectCollectionName = collectionName;
            sessionStorage.rowSelectCount = count;
            sessionStorage.selectedRowCount = count;
            var noOfSelectedRows = 0;
            if ($(event.target).is('.customChkbox')
                    && event.target.tagName.toUpperCase() === "LABEL") {
                var obj = $('#' + rowID + count);
                if ($('#' + chkBoxID + count).is(':checked')) {
                    obj.removeClass('selectRow');
                    $('#' + chkBoxID + count).attr('checked', true);
                    $('#' + colID + count).show();
                } else {
                    obj.addClass('selectRow');
                    $('#' + chkBoxID + count).attr('checked', false);
                    $('#' + colID + count).hide();
                }
            }else {
                var obj = $('#' + rowID + count);
                obj.siblings().removeClass('selectRow');
                obj.addClass('selectRow');
                for ( var index = 0; index < totalRecordsize; index++) {
                    if (index != count) {
                        $('#' + colID + index).hide();
                        $('#' + chkBoxID + index).attr('checked', false);
                    }
                }
                $('#' + chkBoxID + count).attr('checked', true);
                $('#' + colID + count).show();
            }
            for ( var index = 0; index < totalRecordsize; index++) {
                if ($('#' + chkBoxID + index).is(':checked')) {
                    noOfSelectedRows++;
                }
            }
            
            if ($('#' + chkAllID).is(':checked')) {
                $('#' + chkAllID).attr('checked', false);
            }
            if (fileType == 'logFile') {
                var numberOfChecked = $('input[name="chkName"]:checked').length;
                if (numberOfChecked == totalRecordsize) {
                    $("#chkSelectall").attr('checked', true);
                } else {
                    $("#chkSelectall").attr('checked', false);
                }
            }
        }
        //For checking and unchecking parent checkbox on the basis of child checkbox.
        var customCheckBoxesChecked = 0;
        var customCheckBoxesCheckedForWebDavGrid = 0;
        var totalDisplayedRowsInGrid = 0;
        if (tableID == "mainBoxTable") {
            var mainBoxText = $(".mainBoxSelector").text();
            var mainBoxValue = getUiProps().MSG0039;
            totalDisplayedRowsInGrid = $("#"+tableID+" tbody tr").length;
            if (mainBoxText == mainBoxValue) {
                totalDisplayedRowsInGrid = $("#"+tableID+" tbody tr").length-1;
            }
        } else {
            totalDisplayedRowsInGrid = $("#"+tableID+" > tbody > tr").length;
        }
        for ( var index = 0; index < totalDisplayedRowsInGrid; index++) {
            if ($('#' + chkBoxID + index).is(':checked')) {
                customCheckBoxesChecked++;
            }
        }
        if (totalDisplayedRowsInGrid == customCheckBoxesChecked) {
            $('#'+chkAllID).attr('checked', true);
        } else {
            $('#'+chkAllID).attr('checked', false);
        }
        var objOdata = new odata();
        if (tableID == "webDavTable") {
            uFileDownload.disableDownloadArea();
            this.disableDeleteIcon("#btnDeleteCollection"); 
        }
        if (tableID == "entityTable") {
            this.disableDeleteIcon('#' + delButID);
            uDataManagement.disableEditButton(editButID);
        }
        if (tableID == "snapshotTable") {
            // Deactivate download button, import button and delete button
            uFileDownload.disableDownloadArea();
            uEventSnapshot.disableImportButton();
            this.disableDeleteIcon('#' + delButID);
        }
        //this.checkEditButton(customCheckBoxesChecked, editButID, fileType, isAcl);
        if (customCheckBoxesChecked > 0) {
            this.checkEditButton(customCheckBoxesChecked, editButID, fileType, isAcl);
            //commonObj.enableButton('#' + delButID);
            if (customCheckBoxesChecked != 1) {
                for ( var index = 0; index < totalRecordsize; index++) {
                    $('#' + colID + index).hide();
                }
            } else {
                for ( var index = 0; index < totalRecordsize; index++) {
                    var objRow = $('#' + rowID + index);
                    if (objRow.hasClass("selectRow")) {
                        $('#' + colID + index).show();
                    }
                }
            }
            if (fileType != undefined && fileType != 'logFile') {
                var objOdata = new odata();
                objOdata.removeClassFromSrc();
            }
            /* */
            
            if (tableID == "entityTable") {
                this.activateCollectionDeleteIcon('#' + delButID);
                if(customCheckBoxesChecked == 1){
                    uDataManagement.enableEditButton();
                }
            }
            this.enableButton('#' + delButID);
                if (tableID == "webDavTable" && customCheckBoxesChecked == 1) {
                    var objOdata = new odata();
                        var selectedFileType = objOdata.getFileType();
                        fileType = selectedFileType;
                        if (fileType == 'file') {
                            objOdata.activateDownloadLink();
                        }
                    }
                if (tableID == "webDavTable") {
                    this.activateCollectionDeleteIcon("#btnDeleteCollection");
                }
            if (tableID == "snapshotTable") { // When the check box of snapshotTable is checked
                var checkedSnapshotName = "";
                for ( var index = 0; index < totalRecordsize; index++) {
                    if ($('#' + chkBoxID + index).is(':checked')) {
                        // Get the name of the file being checked
                        checkedSnapshotName = $("#boxDetailLink_"+index).text();
                        break;
                    }
                }
                // If the number of checks is two or more, the number of selections is displayed instead of the selection information
                uBoxAcl.showSelectedResourceCount(customCheckBoxesChecked);
                var objSnapshot = new snapshot();
                this.activateCollectionDeleteIcon('#' + delButID);
                if(customCheckBoxesChecked === 1) {
                  // If there is only one check, activate download button and import button
                  objSnapshot.enableDownloadButton();
                  objSnapshot.enableImportButton();
                }
                var target = document.getElementById('spinner');
                var spinner = new Spinner(opts).spin(target);
                setTimeout(function() {
                    // Display information on the selected file
                    var currentFolderURL = uEventSnapshot.getSnapshotPath(checkedSnapshotName);
                    var pathArray = currentFolderURL.split('/');
                    var currentCollectionName = pathArray[(pathArray.length) - 1];
                    uBoxDetail.populatePropertiesList(currentFolderURL, currentFolderURL, currentCollectionName, false, fileType);
                    spinner.stop();
                }, 1);
                objOdata.setMarginForSelectedResourcesMessage();
            }
            if (isAcl != false && isAcl != undefined) {
                var tableLength = $("#"+tableID+" > tbody > tr").length;
                if (event.target.tagName.toUpperCase() !== 'LABEL') {
                    for ( var index = 0; index < tableLength; index++) {
                        if ($('#' + chkBoxID + index).is(':checked')) {
                            customCheckBoxesCheckedForWebDavGrid++;
                        }
                    }
                }
                //uBoxAcl.showSelectedResourceCount(customCheckBoxesChecked);
                var checkedCollectionName = "";
                if(customCheckBoxesCheckedForWebDavGrid == 1){
                    for ( var index = 0; index < totalRecordsize; index++) {
                        if ($('#' + chkBoxID + index).is(':checked')) {
                            checkedCollectionName = $("#boxDetailLink_"+index).text();
                            break;
                        }
                    }
                    var urlArray = collectionURL.split("/");
                    var len = urlArray.length;
                    urlArray[len-1] = checkedCollectionName;
                    var checkedCollectionURL = urlArray.join("/");
                    var target = document.getElementById('spinner');
                    var spinner = new Spinner(opts).spin(target);
                    hideCellListOnCellSelection();
                    setTimeout(function() {
                        uBoxDetail.populatePropertiesList(checkedCollectionURL, checkedCollectionURL, checkedCollectionName, false, fileType);
                        uBoxAcl.getAclSetting(checkedCollectionURL, sessionStorage.boxName);
                        uBoxAcl.showSelectedResourceCount(0);
                        spinner.stop();
                    }, 1);
                    var objOdata = new odata();
                    objOdata.setMarginForSelectedResourcesMessage();
                } else if (customCheckBoxesCheckedForWebDavGrid > 1) {
                    uBoxAcl.showSelectedResourceCount(customCheckBoxesCheckedForWebDavGrid);
                }
                
                /*if (customCheckBoxesChecked == 1) {
                    var currentSelectedCol = null;
                    currentSelectedCol = collectionName;
                    for ( var indexS = 0; indexS < totalRecordsize; indexS++) {
                        if ($('#' + rowID + indexS).hasClass('selectRow')) {
                            var currId = 'col' + indexS;
                            currentSelectedCol = document
                                    .getElementById(currId).title;
                        }
                    }
                    //only one selection is selected
                    objBoxAcl.showSelectedResourceCount(customCheckBoxesChecked);
                } else {
                    //more than one collection are selected
                    objBoxAcl.showSelectedResourceCount(customCheckBoxesChecked);
                }*/
            }
        }else{
            if (tableID == "webDavTable") {
                var objOdata = new odata();
                objOdata.hidePluginIcons();
            }
            if (fileType == 'file') {
                var objFileDownload = new fileDownload();
                objFileDownload.disableDownloadArea();
            }
            
            if (tableID == 'logTable' && fileType == 'logFile') {
                var objLog = new log();
                objLog.disableDownloadButton();
            }
            if (tableID == "snapshotTable") { // When the check box is not selected
                uBoxAcl.showSelectedResourceCount(customCheckBoxesChecked);
                var target = document.getElementById('spinner');
                var spinner = new Spinner(opts).spin(target);
                setTimeout(function() {
                    var currentFolderURL = uEventSnapshot.getSnapshotPath();
                    var pathArray = currentFolderURL.split('/');
                    var currentCollectionName = pathArray[(pathArray.length) - 1];
                    uBoxDetail.populatePropertiesList(currentFolderURL, currentFolderURL, currentCollectionName, false, "");
                    spinner.stop();
                }, 1);
                objOdata.setMarginForSelectedResourcesMessage();
            }
            
            objCommon.disableEditButton('#' + editButID);
            objCommon.disableButton('#' + delButID);
            
            
            this.disableButton('#' + delButID);
            if (tableID == "entityTable") {
                uDataManagement.disableEditButton(editButID);
            }
            if (isAcl != false && isAcl != undefined) {
                uBoxAcl.showSelectedResourceCount(customCheckBoxesChecked);
                var pathArray = sessionStorage.Path.split('/');
                var parentCollectionName = pathArray[(pathArray.length) - 1];
                var lengthBreadCrumb = $("#tblBoxBreadCrum tbody tr").length;
                var type ="";
                if(lengthBreadCrumb == 1){
                    type = "box";
                }else if(lengthBreadCrumb > 1){
                    type = "folder";
                }
                if(type == "box" && parentCollectionName == getUiProps().MSG0293){
                    parentCollectionName = getUiProps().MSG0039;
                }
                var target = document.getElementById('spinner');
                var spinner = new Spinner(opts).spin(target);
                setTimeout(function() {
                    uBoxDetail.populatePropertiesList(sessionStorage.Path, sessionStorage.Path, parentCollectionName, false, type);
                    var boxNamePath = "";
                    for(var index = 4; index < pathArray.length; index++){
                        boxNamePath += pathArray[index] + '/';
                    }
                    uBoxAcl.getAclSetting(sessionStorage.Path, sessionStorage.boxName);
                    spinner.stop();
                }, 1);
                var objOdata = new odata();
                objOdata.setMarginForSelectedResourcesMessage();
            }
        }
    }
};

common.prototype.checkEditButton = function(noOfSelectedRows, editButID,
        fileType, isAcl) {
    if (fileType != undefined && fileType != 'logFile') {
        var objOdata = new odata();
        var selectedFileType = objOdata.getFileType();
        fileType = selectedFileType;
    }
    if (noOfSelectedRows === 0 && fileType != undefined) {
        var objOdata = new odata();
        objOdata.hidePluginIcons();
        if (fileType == 'logFile') {
            var objLog = new log();
            objLog.disableDownloadButton();
        } else {
            var objOdata = new odata();
            objOdata.showHideButtons();
            // objOdata.toggleDownloadLink();
        }
    }
    if (noOfSelectedRows === 1) {
        if (fileType == 'logFile') {
            var objLog = new log();
            objLog.enableDownloadButton();
        }
        this.enableEditButton('#' + editButID);
        if (fileType == 'file') {
            var objOdata = new odata();
            objOdata.hidePluginIcons();
            // objOdata.toggleUploadLink();
            var uFileDownload = new fileDownload();
            uFileDownload.clearBlobStorage();
        } else if (fileType == 'p:odata' || fileType == 'folder') {
            var objOdata = new odata();
            objOdata.hidePluginIcons();
            // objOdata.toggleDownloadLink();
        } else if (fileType == 'p:service') {
            // $("#submenu").hide();
            var objOdata = new odata();
            objOdata.displayPluginIcons();
            // objOdata.showEngineServiceButtons();
        }

        /*
         * if (noOfSelectedRows < 2 && isAcl != false) { var objBoxAcl = new
         * boxAcl(); objBoxAcl.setACLHeader(sessionStorage.boxName, 0); }
         */

    } else if (noOfSelectedRows > 1) {
        var objOdata = new odata();
        objOdata.hidePluginIcons();
        this.disableEditButton('#' + editButID);
        if (fileType == 'file' || fileType == 'p:odata'
                || fileType == 'folder' || fileType == 'p:service') {
            var objOdata = new odata();
            objOdata.showHideButtons();
            // objOdata .toggleDownloadLink();
        }
    }
};


/**
 * This function is used for generating date in the format to be shown in the list.
 */
common.prototype.convertEpochDateToReadableFormat = function(epochDate) {
    if (epochDate != undefined) {
        // Epoch Date Conversion
        var convertedDateTime = null;
        var strPublishedDate = epochDate.substring(6, 19);
        var numPublishedDate = parseInt(strPublishedDate);
        var objEpochDate = new Date(numPublishedDate);
        var timeStamp = objCommon.getTimeStamp(objEpochDate);
        var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var day = objEpochDate.getDate();
        var curr_month = objEpochDate.getMonth();
        var month = m_names[curr_month];
        var year = objEpochDate.getFullYear();
        var timeZone = sessionStorage.timeZone;
        if (timeZone != null && timeZone != 'null' && timeZone != undefined) {
            convertedDateTime = day + '-' + month + '-' + year + " "
            + timeStamp+" "+timeZone;
        } else {
            convertedDateTime = day + '-' + month + '-' + year + " "
            + timeStamp;
        }
        return convertedDateTime;
    }
};

/**
 * The purpose of this function is to convert 12 Hr time format to
 * 24 Hr time format.
 * 
 * @param compDate
 * @returns {String}
 */
common.prototype.getTimeStamp = function (objEpochDate) {
    var hours = objEpochDate.getHours();
    var minutes = objEpochDate.getMinutes();
    var seconds = objEpochDate.getSeconds();
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    var sSeconds = seconds.toString();
    if (hours < 10) {
        sHours = "0" + sHours;
    }
    if (minutes < 10) {
        sMinutes = "0" + sMinutes;
    }
    if (seconds < 10) {
        sSeconds = "0" + sSeconds;
    }
    var time = sHours + ":" + sMinutes+":" + sSeconds;
    return time;
};

/**
 * This function is used for generating date in the format according to 
 * date control.
 */
common.prototype.convertEpochDateToDateControlFormat = function(epochDate){ 

  if(epochDate!=undefined) {
    // Epoch Date Conversion
    var strPublishedDate = epochDate.substring(6, 19);
    var numPublishedDate = parseInt(strPublishedDate);
    var epochDateTemp = numPublishedDate;
    epochDateTemp = parseFloat(epochDateTemp);
    var objEpochDate = new Date(epochDateTemp);
    var publishedDateToLocale = objEpochDate.toLocaleString();
    var compDate = new Array();
    compDate = publishedDateToLocale.split(" ");
    var finalPublishedDate = compDate[0];
    //var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var d = new Date(finalPublishedDate);
    var day = d.getDate();
    var curr_month = d.getMonth()+1;
    //var month = m_names[curr_month];
    var year = d.getFullYear();
    if(curr_month.toString().length === 1){
      curr_month = '0' + curr_month;
    }
    if(day.toString().length === 1){
      day = '0' + day;
    }
    var convertedDateTime = year+'-'+curr_month+'-'+day;
    return convertedDateTime; 
  }
};


/**
 * This function is used to show previous page in pagination.
 */
function createPrevButton(tableID, maxRows){
  $('#prev').click(function() {
    var cRows = tableID.find('tr:gt(0)');
    var cFirstVisible = cRows.index(cRows.filter(':visible'));
    var val=parseInt(cFirstVisible)/10;
    if(val==0){
      val+=1;
    }
    $('#page'+val).siblings().removeClass('paginationButSelect');
    $('#page'+val).siblings().css('cursor','pointer');
    $('#page'+val).addClass('paginationButSelect');
    $('#page'+val).css('cursor','default');
    if ($('#prev').hasClass('disabled')) {
      $('#prev').css('cursor','default');
      return false;
    }
    cRows.hide();
    if (cFirstVisible - maxRows - 1 > 0) {
      cRows.filter(':lt(' + cFirstVisible + '):gt(' + (cFirstVisible - maxRows - 1) + ')').show();
    } else {
      cRows.filter(':lt(' + cFirstVisible + ')').show();
    }
    if (cFirstVisible - maxRows <= 0) {
      $('#prev').addClass('disabled');
      $('#prev').addClass('prevDisable');
      $('#prev').css('cursor','default');
    }
    $('#next').removeClass('disabled');
    $('#next').removeClass('nextDisable');
    $('#next').css('cursor','pointer');
    return false;
  });
}

/**
 * This function is used to show next page in pagination.
 */
function createNextButton(tableID, maxRows){
  $('#next').click(function() {
    var cRows = tableID.find('tr:gt(0)');
    var cFirstVisible = cRows.index(cRows.filter(':visible'));
    var val=parseInt(cFirstVisible)/10;
    val+=2;
    $('#page'+val).siblings().removeClass('paginationButSelect');
    $('#page'+val).siblings().css('cursor','pointer');
    $('#page'+val).addClass('paginationButSelect');
    $('#page'+val).css('cursor','default');
    if($('#next').hasClass('disabled')) {
      return false;
    }
    cRows.hide();
    cRows.filter(':lt(' + (cFirstVisible +2 * maxRows) + '):gt(' + (cFirstVisible + maxRows - 1) + ')').show();
    if (cFirstVisible + 2 * maxRows >= cRows.size()) {
      $('#next').addClass('disabled');
      $('#next').addClass('nextDisable');
      $('#next').css('cursor','default');
    }
    $('#prev').removeClass('disabled');
    $('#prev').removeClass('prevDisable');
    $('#prev').css('cursor','pointer');
    return false;
  });
}

/**
 * This function is used to show the page when a page is selected.
 */
function createPageButton(tableID, maxRows, totallPageNo){
  $('.paginationBut').click(function() {
    var cRows = tableID.find('tr:gt(0)');
    var pageNo=this.value;
    $('#page'+pageNo).siblings().removeClass('paginationButSelect');
    $('#page'+pageNo).siblings().css('cursor','pointer');
    $('#page'+pageNo).addClass('paginationButSelect');
    $('#page'+pageNo).css('cursor','default');
    cRows.hide();
    if(pageNo==1) {
      cRows.filter(':lt(' + ((pageNo)* maxRows) + '):gt(' + (pageNo-2) + ')').show();
      $('#prev').addClass('disabled');
      $('#prev').addClass('prevDisable');
      $('#prev').css('cursor','default');
      $('#next').removeClass('disabled');
      $('#next').removeClass('nextDisable');
      $('#next').css('cursor','pointer');
      if(pageNo == totallPageNo){
        $('#next').addClass('disabled');
        $('#next').addClass('nextDisable');
        $('#next').css('cursor','default');
      }
    }
    else {
      cRows.filter(':lt(' + ((pageNo)* maxRows) + '):gt(' + ((pageNo-1)*maxRows-1) + ')').show();
      $('#prev').removeClass('disabled');
      $('#prev').removeClass('prevDisable');
      $('#prev').css('cursor','pointer');
      if((pageNo!=0)&&(pageNo%3==0)){
      }
      if(pageNo == totallPageNo){
        $('#next').addClass('disabled');
        $('#next').addClass('nextDisable');
        $('#next').css('cursor','default');
      }
    }
    return false;
  });
}

/**
 * This function is used to create apply css classes for pagination
 */
function createUIForPagination(tableID, maxRows, recordSize){
  var cRows = tableID.find('tr:gt(0)');
  var cRowCount = cRows.size();
  if (cRowCount < maxRows) {
    return false;
  }
  if(recordSize== 10 || recordSize == 5){
    $(".mainTable tr:odd").css("background-color", "#F4F4F4");
    $(".selectProfileRow").css("background-color", "#dfdfdf");
    $('#next').addClass('disabled');
  } 
  $('#page1').addClass('paginationButSelect');
  $('#page1').css('cursor','default');
  $('#prev').addClass('disabled');
  $('#prev').addClass('prevDisable');
  $('#prev').css('cursor','default');
  return true;
}

/************************ NOTIFICATION RIBBON: Start ************************/

/**
 * The purpose of this function is to add errorWrapper and errorIcon
 * class after removing all the added classes.
 */
function addErrorClass(divID) {
    if (divID==undefined || divID==null) {
        divID ='#WebDavMessageIcon';
    }
    $(divID).removeClass("crudOperationSuccessIcon");
    $(divID).addClass("crudOperationErrorIcon");
    return;
}

/**
 * The purpose of this function is to add successfulWrapper and successfulIcon
 * class after removing all the added classes.
 */
function addSuccessClass(divID) {
    if (divID==undefined || divID==null) {
        divID ='#WebDavMessageIcon';
    }
    $(divID).removeClass("crudOperationErrorIcon");
    $(divID).addClass("crudOperationSuccessIcon");
    return;
}

/**
 * The purpose of this function is to add partialSuccessfulWrapper and
 * partialSuccessfulIcon class after removing all the added classes.
 */
function addPartialSuccessClass() {
  $("#messageWrapper").removeClass("errorWrapper");
  $("#messageWrapper").removeClass("successfulWrapper");
  $("#messageWrapper").addClass("partialSuccessfulWrapper");
  $("#messageIcon").removeClass("errorIcon");
  $("#messageIcon").removeClass("successfulIcon");
  $("#messageIcon").addClass("partialSuccessfulIcon");
}

/**
 * The purpose of this function is to set the style to "inline" for all
 * child div(s) of messageBlock div.
 */
function inlineMessageBlock(width,divID) {
    if (divID==undefined || divID==null) {
        divID = "#crudOperationMessageBlock";
    }
    $(divID).css("width", width);
    $(divID).css("display", 'block');
    return;
}

/************************ NOTIFICATION RIBBON: End ************************/

/**
 * The purpose of this function is to return the count of an entity
 * from the set of String being passed as an argument.
 */
function entityCount (entityNames) {
  var count = 0;
  if (entityNames.length > 0) {
    var entity = entityNames.split(",");
    count = entity.length;
  }
  return count;
}

/**
 * The purpose of this function is to show spinner with dynamic position during the delay in API call.
 */
function showDynamicSpinner(modal,left,top){
  document.getElementById(modal).style.display = "inline-block";
  var id = '#dialogSpinner';
  var winH = $(window).height();
  var winW = $(window).width();
  $(id).css('top', winH / 2 - $(id).height() / 2);
  $(id).css('left', winW / 2 - $(id).width() / 2);
  var objCommon = new common(); 
  var target = document.getElementById('spinnerPopUp');
  objCommon.opts.left = left;
  objCommon.opts.top = top;
  var spinner = new Spinner(objCommon.opts).spin(target);
}

/**
 * The purpose of this function is to show spinner during the delay in API call.
 */
function showSpinner(modal){
  document.getElementById(modal).style.display = "inline-block";
  var id = '#dialogSpinner';
  var winH = $(window).height();
  var winW = $(window).width();
  $(id).css('top', winH / 2 - $(id).height() / 2);
  $(id).css('left', winW / 2 - $(id).width() / 2);
  var objCommon = new common(); 
  var target = document.getElementById('spinnerPopUp');
  objCommon.opts.left = 'auto';
  objCommon.opts.top = 'auto';
  var spinner = new Spinner(objCommon.opts).spin(target);
}

/**
 * The purpose of this function is to remove the spinner which was shown
 * during the delay in API call.
 */
function removeSpinner(modal){
  var id = "#"+modal;
  $(id).hide();
}

/**
 * The purpose of this method is to display pagination icons.
 */
common.prototype.showPaginationIcons = function(dynamicTable,totalPageNo) {
  dynamicTable += "<div class='pagination dynamicRow'>";
  dynamicTable += "<input type='button' id='prev' value='' class='prev'>";
  for (var count = 1; count <= totalPageNo; count++) {
    if (count < 10) {
      dynamicTable += "<input type='button' id='page" + count + "' value='" + count + "' class='paginationBut'>";
    } else {
      dynamicTable += "<input type='button' id='page" + count + "' value='" + count + "' class='paginationBut' style='display:none'>";
    }
  }
  dynamicTable += "<input type='button' id='next' value='Next' class='next'/>";
  dynamicTable += "</div>";
  return dynamicTable;
};

/**
 * The purpose of this function is to set accessor.
 */
common.prototype.initializeAccessor = function(baseUrl, cellName, schemaURL, boxName) { 
  if (getClientStore() != undefined) {
    var token = getClientStore().token;
    var objJPersoniumContext = new _pc.PersoniumContext(baseUrl, cellName, schemaURL, boxName);
    var accessor = objJPersoniumContext.withToken(token);
    accessor.setCurrentCell(new _pc.Cell(accessor, cellName));
    return accessor;
  }
};

/**
 *  The purpose of this function is to retrieve the account name from URI. 
 */
common.prototype.getAccountNameFromURI = function(uri) {
  var ACCOUNT = "Account";
  var noOfCharacters = ACCOUNT.length;
  var accountIndex = uri.indexOf("Account");
  var accountNameFromURI = uri.substring(accountIndex + noOfCharacters, uri.length - 1);
  var accountName = this.getAccountNameAfterRemovingSpecialChar(accountNameFromURI);
  return accountName;
};

/**
 * The purpose of this function is to return the entity name after 
 * removing all the special characters other hyphen(-) and underscore(_)
 */
common.prototype.getEnityNameAfterRemovingSpecialChar = function(entityNameFromURI) {
  var entityName = entityNameFromURI.replace(/[=&\/\\#,+()$%.'":*?<>{} ]/g,"");
  return entityName;
};

/**
 * The purpose of this function is to return the account name after 
 * removing all the special characters other then allowed one
 */
common.prototype.getAccountNameAfterRemovingSpecialChar = function(entityNameFromURI) {
  var entityName = entityNameFromURI.replace(/[&\/\\#,+()%'":?<> ]/g,"");
  return entityName;
};

/**
 * The purpose of this function is to return the relation name after 
 * removing all the special characters other then allowed one
 */
common.prototype.getRelationNameAfterRemovingSpecialChar = function(entityNameFromURI) {
  var entityName = entityNameFromURI.replace(/[=&\/\\#,()$%.'"*?<>{} ]/g,"");
  return entityName;
};

/**
 * The purpose of this function is to retrieve the role name from URI. 
 */
common.prototype.getRoleNameFromURI = function(uri) {
  var ROLE = "Role";
  var noOfCharacters = ROLE.length;
  var roleIndex = uri.indexOf("Name");
  var boxIndex = uri.indexOf("_Box.Name");
  var roleNameFromURI = uri.substring(roleIndex + noOfCharacters, boxIndex);
  var roleName = this.getEnityNameAfterRemovingSpecialChar(roleNameFromURI);
  return roleName;
};

/**
 * The purpose of this function is to retrieve the role name from URI. 
 */
common.prototype.getRelationNameFromURI = function(uri) {
  var RELATION = "Name";
  var noOfCharacters = RELATION.length;
  var relationIndex = uri.indexOf("Name");
  var boxIndex = uri.indexOf("_Box.Name");
  var relationNameFromURI = uri.substring(relationIndex + noOfCharacters, boxIndex);
  var relationName = this.getRelationNameAfterRemovingSpecialChar(relationNameFromURI);
  return relationName;
};

/**
 * The purpose of this function is to retrieve a box name from URI.
 */
common.prototype.getBoxNameFromURI = function(uri) {
  var BOX = "_Box.Name";
  var noOfCharacters = BOX.length;
  var boxIndex = uri.indexOf("_Box.Name");
  var boxNameFromURI = uri.substring(boxIndex + noOfCharacters,uri.length-1);
  var boxName = this.getEnityNameAfterRemovingSpecialChar(boxNameFromURI);
  return boxName;
};

/**
 * The purpose of this function is to retrieve a property Id from Link URI.
 */
common.prototype.getPropertyFromURI = function(uri,key) {
  var noOfCharacters = key.length;
  var itemIndex = uri.indexOf(key);
  var boxNameFromURI = uri.substring(itemIndex + noOfCharacters,uri.length-1);
  return this.getEnityNameAfterRemovingSpecialChar(boxNameFromURI);
};


/**
 * The purpose of the following method is to limit the excessive length of drop down in case it exceeds the specified length.  
 * @param name
 * @param trimmedlength
 * @returns
 */
common.prototype.getShorterName = function(name, trimmedlength) {
  var entityToolTip = name;
  if(entityToolTip != null) {
    var len = entityToolTip.length; 
    if(len > trimmedlength && len != 0) {
      entityToolTip = entityToolTip.substring(0, trimmedlength) + "..";
    } 
  }
  return entityToolTip;
};
/**
 * The purpose of this function is to restrict the size of the entity name
 * if no. of characters in entity name are greater than 16.
 */
common.prototype.getShorterEntityName = function(entityName, isSchema) {
  var entityToolTip = entityName;
  if(entityToolTip != null) {
    var len = entityToolTip.length; 
    if(len > 20 && len != 0 && isSchema != true) {
      entityToolTip = entityToolTip.substring(0, 19) + "..";
    } else if (isSchema == true && len > 80) {
      entityToolTip = entityToolTip.substring(0, 50) + "..";
    }
  }
  return entityToolTip;
};

/**
 * These are the configurable settings for spinner.
 */
common.prototype.opts = {
    lines: 13, // The number of lines to draw
    length: 10, // The length of each line
    width: 3, // The line thickness
    radius: 5, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#b6b6b6', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    // zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

/**
 * The purpose of this method is to create pagination.
 * @param recordSize
 * @param dynamicTable
 */
common.prototype.createPagination = function (recordSize, dynamicTable,maxRows,tblMain,dvDisplayTable) {
  var pagination = "";
  var totalPageNo = Math.ceil(recordSize / maxRows);
  var objCommon = new common();
  if (recordSize > 0) {
    pagination = objCommon.showPaginationIcons(pagination, totalPageNo);
  }
  $(dvDisplayTable).append(pagination);
  var tableID = $(tblMain);
  var valid = createUIForPagination(tableID, maxRows, recordSize);
  if (!valid) { 
    return;
  }
  createPrevButton(tableID, maxRows);
  createNextButton(tableID, maxRows);
  createPageButton(tableID, maxRows, totalPageNo);
};

/**
 * Common method for obtaining various checkbox selections/values select against the supplied arguments 
 * @param parentId is checkbox placeholder e.g. {tableId}
 * @param type 'input'
 * @param identifier is the check box name
 */
common.prototype.getMultipleSelections = function(parentId,type,identifier){
  var elementsLength =document.getElementById(parentId).getElementsByTagName(type).length;
  var count = 0;
  var response = null;
  for (count = 0; count < elementsLength; count++) {
    if (document.getElementById(parentId).getElementsByTagName(type)[count].name == identifier) {
      if (document.getElementById(parentId).getElementsByTagName(type)[count].checked) {
        var formRelationName = document.getElementById(parentId).getElementsByTagName(type)[count].value;
        if (response == null) {
          response = formRelationName;
        } else {
          response = response + ',' + formRelationName;
        }
      }
    }
  }
  return response;
};
/**
 * The purpose of the following method is to ensure that a record is selected from the drop down.
 * @returns {Boolean}
 */
common.prototype.validateDropDownValue = function (ddlID,dvMessageID,message) {
  if (document.getElementById(ddlID).selectedIndex == 0 ) {
    $(dvMessageID).text(message);
    return false;
  } else {
    $(dvMessageID).text("");
    return true;
  }
};

/**
 * The purpose of this method is to check session value on main navigation tab click
 */
common.prototype.isSessionExist = function() {
  //var id = null;
  //$.ajax({
  //  async : false,
  //  dataType : 'json',
  //  url : './Info',
  //  type : 'GET',
  //  success : function(jsonData) {
  //    id = jsonData.id;
  //  },
  //  error : function() {
  //  }
  //});
  //return id;
  return "debug";
};


/**
 * The purpose of this function is show success message on ribbon for create and delete operation 
 * of role and relation.
 * @param startText
 * @param entityName
 * @param lastText
 * @param modelWindowId
 */
common.prototype.displaySuccessfulMessage = function (startText, entityName, lastText, modelWindowId) {
  var shorterEntityName = objCommon.getShorterEntityName(entityName);
  $(modelWindowId).hide();
  addSuccessClass();
  inlineMessageBlock();
  document.getElementById("successmsg").innerHTML = startText+ " " +shorterEntityName+ " is "+lastText+ " successfully " ; 
  document.getElementById("successmsg").title = entityName;
  if (startText == "Role") {
    objBoxProfile.boxProfileRoleTable();
  } else if (startText == "Relation") {
    objBoxProfile.boxProfileRelationTable();
  }
  objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
  objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
};

/**
 * The purpose of this function is show success message on ribbon.
 * @param message
 * @param modelWindowId
 * @param width
 */
common.prototype.displaySuccessMessage = function(message, modelWindowId, width, divMsgBlock) {
    $(modelWindowId).hide();
    addSuccessClass();
    if (divMsgBlock != undefined && divMsgBlock != null) {
        $("#"+divMsgBlock).css("display", 'table');
        $("#"+divMsgBlock).css("width", '0px');
    } else {
        inlineMessageBlock(width);
    }
    $("#WebDavSuccessmsg").text(message);
    objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
    objCommon.autoHideAssignRibbonMessage("crudOperationMessageBlock");
};

/**
 * The purpose of this function is show error message on ribbon.
 * @param message
 * @param modelWindowId
 * @param width
 */
common.prototype.displayErrorMessage = function(message, modelWindowId, width, divMsgBlock) {
    $(modelWindowId).hide();
    addErrorClass();
    if (divMsgBlock != undefined && divMsgBlock != null) {
        $("#"+divMsgBlock).css("display", 'table');
        $("#"+divMsgBlock).css("width", '0px');
    } else {
        inlineMessageBlock(width);
    }
    $("#WebDavSuccessmsg").text(message);
    objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
    objCommon.autoHideAssignRibbonMessage("crudOperationMessageBlock");
};

/**
 * The purpose of this function is to display conflict message.
 */
common.prototype.displayConflictMessage = function (startText, entityName,modelWindowId) {
  var shorterEntityName = objCommon.getShorterEntityName(entityName);
  $(modelWindowId).hide();
  addErrorClass();
  inlineMessageBlock();
  document.getElementById("successmsg").innerHTML = startText+ " " +shorterEntityName+ " can not be deleted";
  document.getElementById("successmsg").title = entityName;
  objCommon.centerAlignRibbonMessage("#crudOperationMessageBlock");
  objCommon.autoHideAssignRibbonMessage('crudOperationMessageBlock');
};

/**
 *  The purpose of this function is to retrieve the external Cell from URI. 
 */
common.prototype.getExtCellFromURI = function(uri) {
  var extCell = "ExtCell";
  var noOfCharacters = extCell.length;
  var extCellIndex = uri.indexOf("ExtCell");
  var extCellNameFromURI = uri.substring(extCellIndex + noOfCharacters, uri.length - 1);
  var extCellName = extCellNameFromURI.replace(/[=#,+()$%'"*?<>{} ]/g,"");
  return  extCellName;
};

/**
 * The purpose of this function is to maintain the slight color differences in
 * alternate rows.
 */
common.prototype.alternateRowColor = function(tableId) {
  var id = "'."+tableId+" tr:odd'";
  $(id).css("background-color", "#F4F4F4");
  $(".selectProfileRow").css("background-color", "#dfdfdf");
};

/**
 * The purpose of this function is to create an object of jAbstractODataContext,
 * and accepts accessor as an input parameter.
 * @param accessor
 */
common.prototype.initializeAbstractDataContext = function(
    accessor) {
  return new _pc.AbstractODataContext(accessor);
};

/**
 * The purpose of this function is to create an object of jLinkManager.
 * @param accessor
 * @param context
 */
common.prototype.initializeLinkManager = function(accessor,
    context) {
  return new _pc.LinkManager(accessor, context);
};

/** 
 * The purpose of this function is to extract external cell name from external 
 * cell url.
 */
common.prototype.getExternalCellNameFromURI = function(uri) {
  var extCellIndex = uri.lastIndexOf("/");
  var extCellFromURI = uri.substring(extCellIndex, uri.length);
  var extCellName = objCommon.getEnityNameAfterRemovingSpecialChar(extCellFromURI);
  if (extCellName.length == 0) {
    extCellName = undefined;
  }
  return extCellName;
};

/**
 *  The purpose of this function is to retrieve the external role,relation name, box name from URI. 
 */
common.prototype.getKeyInExtRoleURI = function(uri,key) {
  var keyItem = null;
  var noOfCharacters = null;
  var itemIndex = null;
  var nextEleIndex = null;
  var response = "";
  if(key=="ExtRole"){
    keyItem = "ExtRole(ExtRole='";
    noOfCharacters = keyItem.length;
    itemIndex = uri.indexOf("ExtRole(ExtRole='");
    nextEleIndex = uri.indexOf(",_Relation.");
    response = uri.substring(itemIndex + noOfCharacters, nextEleIndex-1);
  }else if(key=="relation"){
    keyItem = "_Relation.Name='";
    noOfCharacters = keyItem.length;
    itemIndex = uri.indexOf("_Relation.Name='");
    nextEleIndex = uri.indexOf(",_Relation._");
    response = uri.substring(itemIndex + noOfCharacters, nextEleIndex-1);
  }
  else if(key=="box"){
    keyItem = "_Relation._Box.Name='";
    noOfCharacters = keyItem.length;
    itemIndex = uri.indexOf("_Relation._Box.Name='");
    response = uri.substring(itemIndex + noOfCharacters, uri.length - 2);
  }
  return  response;
};

/**
 * The purpose of the following method is to transform epoch date into readable form for Token.
 * @param epochDate
 * @param strEpochDate
 * @returns {String}
 */
common.prototype.getReadableDateForAccessToken = function(epochDate,strEpochDate){ 
  if(epochDate!=undefined) {
    // Epoch Date Conversion
    var strPublishedDate = epochDate.substring(6, 19);
    var numPublishedDate = parseInt(strPublishedDate);
    var epochDateTemp = numPublishedDate;
    epochDateTemp = parseFloat(epochDateTemp);
    var objEpochDate = new Date(epochDateTemp);
    var publishedDateToLocale = objEpochDate.toLocaleString();
    var finalPublishedDate = publishedDateToLocale.slice(0, 13);
    var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var d = new Date(finalPublishedDate);
    var day = objEpochDate.getDate();
    var curr_month = objEpochDate.getMonth();
    var month = m_names[curr_month];
    var year = objEpochDate.getFullYear();
    var dtExpiry = new Date (strEpochDate); 
    var currentMinutes = dtExpiry.getMinutes();
    if (currentMinutes.toString().length == 1) {
      currentMinutes = "0" + currentMinutes;
    }
    var expiryTime = dtExpiry.getHours() +":"+currentMinutes+":"+dtExpiry.getSeconds();
    var convertedDateTime = null;
    var timeZone = sessionStorage.timeZone;
    if (timeZone != null) {
        convertedDateTime = day+' '+month+' '+year+" at "+ expiryTime+" "+timeZone;
    } else {
        convertedDateTime = day+' '+month+' '+year+" at "+ expiryTime;
    }
    return convertedDateTime; 
  }
};
/**
 * This function extracts the status code from response object.
 */
common.prototype.getStatusCode = function (response) {
    if (response instanceof _pc.DavResponse) {
        return this.getStatusCode(response.body);
    } else if (response instanceof _pc.PersoniumHttpClient) {
        return response.httpClient.status;
    } else if (response instanceof _pc.Promise) {
        if (response.resolvedValue!== null) {
            return response.resolvedValue.status;
        } else { 
            return -100;
        }
    }
};

/**
 * These are spinner settings specific only to the main spinner while loading the application.
 */
common.prototype.optsCommon = {
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
        top : '300', // Top position relative to parent in px
        left : 'auto' // Left position relative to parent in px
};

/**
 * Hashtable Class
 */
function HashTable(obj)
{
  this.length = 0;
  this.items = {};
  for (var p in obj) {
    if (obj.hasOwnProperty(p)) {
      this.items[p] = obj[p];
      this.length++;
    }
  }

  this.setItem = function(key, value) {
    var previous = undefined;
    if (this.hasItem(key)) {
      previous = this.items[key];
    }
    else {
      this.length++;
    }
    this.items[key] = value;
    return previous;
  };

  this.getItem = function(key) {
    return this.hasItem(key) ? this.items[key] : undefined;
  };

  this.hasItem = function(key) {
    return this.items.hasOwnProperty(key);
  };

  this.removeItem = function(key) {
    if (this.hasItem(key)) {
      previous = this.items[key];
      this.length--;
      delete this.items[key];
      return previous;
    } else {
      return undefined;
    }
  };

  this.keys = function() {
    var keys = [];
    for (var k in this.items) {
      if (this.hasItem(k)) {
        keys.push(k);
      }
    }
    return keys;
  };

  this.values = function() {
    var values = [];
    for (var k in this.items) {
      if (this.hasItem(k)) {
        values.push(this.items[k]);
      }
    }
    return values;
  };

  this.each = function(fn) {
    for (var k in this.items) {
      if (this.hasItem(k)) {
        fn(k, this.items[k]);
      }
    }
  };

  this.clear = function() {
    this.items = {};
    this.length = 0;
  };
}

/**
 * The purpose of this function is to fetch total cell count against one unit 
 * @returns count
 */
common.prototype.retrieveCellRecordCount = function () {
    let ManagerInfo = JSON.parse(sessionStorage.ManagerInfo);
    if (ManagerInfo.isCellManager) {
        return 1;
    };
    var baseUrl = getClientStore().baseURL;
    var token = getClientStore().token;
    var objJdcContext = new _pc.PersoniumContext(baseUrl, "", "", "");
    var accessor = objJdcContext.withToken(token);
    var uri = baseUrl + "__ctl/Cell";
    uri = uri + "?$top=0&$inlinecount=allpages";
    var restAdapter = _pc.RestAdapterFactory.create(accessor);
    var response = restAdapter.get(uri, "application/json");
    var json = response.bodyAsJson().d;
    var count = json.__count;
    return count;
};

/**
 * The purpose of this function is to load environment page
 * based on the cell count
 * @param response
 */
common.prototype.getCellCountAndOpenPage = function() {
    var totalCellCount = this.retrieveCellRecordCount();
    sessionStorage.totalCellCountForUnit = totalCellCount;
    if (totalCellCount == 0) {
        $("#mainContainer").hide();
        //open create cell popup
        var ucellP = new cellUI.popup();
        ucellP.openAutoPopup();
        setTimeout(function() {
            $("#mainContainer").show();
            if(document.getElementById("spinnerEnvt") != null){
                $("#spinnerEnvt").remove();
            }
        }, 300);
    } else if (totalCellCount > 0) {
    }
};

/**
 * This method splits a combination of two entities and split it on the basis of ↁEsymbol.
 * @param dropdownID
 * @returns {Boolean}
 */
common.prototype.getSelectedEntity = function(dropdownID) {
    var arrRole = false;
    if (document.getElementById(dropdownID).selectedIndex > 0) {
        var selectedRole = document.getElementById(dropdownID).value;
        arrRole = selectedRole.split(objCommon.startBracket);
    }
    return arrRole;
};
/**
 * This method adds environment IDs in local storage.
 * @param envID
 *//*
common.prototype.addEnvironmentIds = function(envID) {
    localStorage.setItem(envID, envID);
};

*//**
 * This method validates if multiple windows are opened or not.
 * @param envID
 * @returns {Boolean}
 *//*
common.prototype.isMultipleTabsOpened = function(envID) {
    if (localStorage.getItem(envID) == null) {
        return false;
    }
    return true;
};

*//**
 * This method expunges environment ID from the local storage.
 * @param envID
 *//*
common.prototype.removeEnvironmentIDFromLocalStorage = function(envID) {
    localStorage.removeItem(envID);
    sessionStorage.selectedEnvID = null;
};

*//**
 * Following method is invoked to remove environment from local storage.
 *//*
window.onbeforeunload = function() {
    objCommon.removeEnvironmentIDFromLocalStorage(sessionStorage.selectedEnvID);
};*/

/**
 * Following method is used to add environment id in local storage to handle
 * page refresh scenario.
 */
/*window.onload = function() {
    objCommon.addEnvironmentIds(sessionStorage.selectedEnvID);
};*/

/**
 * The purpose of this function is to check visibility of
 * cell container.
 */
common.prototype.checkCellContainerVisibility = function () {
    if ($('#dvCellListContainer').is(':visible')) {
        $('.checkBoxLabel').addClass("chkboxPositionInherit");
    } else {
        $('.checkBoxLabel').removeClass("chkboxPositionInherit");
    }
};

/** Pagination : Start */
/**
 * This function displays spinner on pagination.
 */
common.prototype.showSpinnerForEntities = function(type) {
    if (type == "Account" || type == "Relation" || type == "ExtRole" || type == "ExtCell") {
        var target = document.getElementById('spinner');
        spinner = new Spinner(opts).spin(target);
    }
};
/**
 * This function is the first view generator for pagination as per present data.
 */
common.prototype.createUIForPaginationTemp = function(maxRows, totalRecordCount,type,activePage,startIndex){
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
    var recordCount = lowerRecordCount + " - " + upperRecordCount + " " + getUiProps().MSG0323 + " "+
    + totalRecordCount;
    //var startIndex = sessionStorage.startIndex;
    $('#firstPage_'+type).addClass('firstPageDisabled');
    $('#firstPage_'+type).removeClass('firstPageEnabled');
    $('#prevPage_'+type).addClass('prevPageDisabled');
    $('#prevPage_'+type).removeClass('prevPageEnabled');
    if (startIndex == undefined){
        
    } else {
        startIndex = parseInt(startIndex) + 1;
        if (totalRecordCount != 0) {
                if (totalRecordCount <= maxRows) {
                    upperRecordCount = totalRecordCount;
                } else {
                    //var activePage = parseInt(sessionStorage.activePage); 
                    upperRecordCount = activePage * maxRows;
                }
            }
        recordCount = startIndex + " - " + upperRecordCount + " " + getUiProps().MSG0323 + " " + totalRecordCount;
            $('#firstPage_'+type).addClass('firstPageEnabled');
            $('#firstPage_'+type).removeClass('firstPageDisabled');
            $('#prevPage_'+type).removeClass('prevPageDisabled');
            $('#prevPage_'+type).addClass('prevPageEnabled');
    }
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
    var lastPage = Math.ceil(totalRecordCount/maxRows);
    if (activePage == 1) {
        $('#firstPage_'+type).addClass('firstPageDisabled');
        $('#firstPage_'+type).removeClass('firstPageEnabled');
        $('#prevPage_'+type).addClass('prevPageDisabled');
        $('#prevPage_'+type).removeClass('prevPageEnabled');
        
    } else if(activePage == lastPage)  {
        $('#nextPage_'+type).addClass('nextPageDisabled');
        $('#nextPage_'+type).removeClass('nextPageEnabled');
        $('#lastPage_'+type).addClass('lastPageDisabled');
        $('#lastPage_'+type).removeClass('lastPageEnabled');
        recordCount = startIndex + " - " + totalRecordCount + " " + getUiProps().MSG0323 + " "+ totalRecordCount;
        if (totalRecordCount <= objCommon.MAXROWS) {
            $('#prevPage_'+type).addClass('prevPageDisabled');
            $('#prevPage_'+type).removeClass('prevPageEnabled');
            $('#firstPage_'+type).addClass('firstPageDisabled');
            $('#firstPage_'+type).removeClass('firstPageEnabled');
            $('#nextPage_'+type).removeClass('nextPageDisabled');
            $('#nextPage_'+type).addClass('nextPageEnabled');
            $('#lastPage_'+type).removeClass('lastPageDisabled');
            $("#lastPage_"+type).addClass("lastPageEnabled");
        }
    }
    $("#recordCount_"+type).text(recordCount);
    return true;
};

/**
 * This function is used to show previous page in pagination.
 */
common.prototype.createPrevButtonTemp = function(tableID, maxRows,
        totalRecordCount, totalPageNo, manager, json, updateMethod, type,
        found, propList, activePages, startIndex) {
    $('#prevPage_'+type).unbind();
    $('#prevPage_'+type).click(function() {
        if($("#prevPage_"+type).hasClass("prevPageEnabled")){
            objCommon.showSpinnerForEntities(type);
            setTimeout(function() {
                var lowerRecordInterval = $("#recordCount_"+type).text().split("-")[0]; 
                var selectedPage = Math.ceil(lowerRecordInterval/maxRows);
                var pageNoWithData = Math.floor(objCommon.noOfRecordsToBeFetched / maxRows);
                var newSelectedPage = selectedPage - 1;
                var modCurrent = newSelectedPage % pageNoWithData;
                var recordCount = (modCurrent-1)*maxRows;
                if(newSelectedPage % pageNoWithData == 0 ){
                    var index = newSelectedPage/pageNoWithData;
                    json = manager.retrieveChunkedData(objCommon.noOfRecordsToBeFetched*(index-1),objCommon.noOfRecordsToBeFetched);
                    recordCount = (pageNoWithData - 1) * maxRows;//(objCommon.maxNoOfPages - 1) * maxRows;
                    if (!found) {
                        objCommon.dataSetProfile = JSON.stringify(json);
                    } else {
                        objCommon.assignDataSetProfile = JSON.stringify(json);
                    }
                } else {
                    var cnt = parseInt(lowerRecordInterval)-51;
                    json = manager.retrieveChunkedData(cnt,objCommon.noOfRecordsToBeFetched);
                    if (!found) { 
                        objCommon.dataSetProfile = JSON.stringify(json);
                    } else { 
                        objCommon.assignDataSetProfile = JSON.stringify(json);
                    }
                }
                if(type == "OdataGrid"){
                    objCommon.hideListTypePopUp();
                    updateMethod(json, propList, recordCount);
                }else{
                    updateMethod(json, recordCount, function(){
                        if (spinner != undefined){
                            spinner.stop();
                        }});
                }

                var lowerRecordCount = ((newSelectedPage - 1) * maxRows) + 1;
                var upperRecordCount = ((newSelectedPage) * maxRows);
                var recordCount = lowerRecordCount + " - " + upperRecordCount + " " + getUiProps().MSG0323 + " "+ totalRecordCount;
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
            }, 50);
        }
    });
};

/**
 * This function is used to show next page in pagination.
 */
common.prototype.createNextButtonTemp = function(tableID, maxRows, totalRecordCount, totalPageNo,manager,json,updateMethod,type, found, propList,activePage,startIndex){
    $('#nextPage_'+type).unbind();
    $('#nextPage_'+type).click(function() {
        if($("#nextPage_"+type).hasClass("nextPageEnabled")){
            objCommon.showSpinnerForEntities(type);
            setTimeout(function() {
                var lowerRecordInterval = $("#recordCount_"+type).text().split("-")[0]; 
                var selectedPage = Math.ceil(lowerRecordInterval/maxRows);
                var pageNoWithData = Math.floor(objCommon.noOfRecordsToBeFetched / maxRows);
                var newSelectedPage = selectedPage +1;
                var modCurrent = newSelectedPage % pageNoWithData;
                if(modCurrent === 0){
                    modCurrent = pageNoWithData;//objCommon.maxNoOfPages;
                }
                var recordCount = (modCurrent-1)*maxRows;
                if(newSelectedPage % pageNoWithData == 1){
                    var index = selectedPage/pageNoWithData;
                    json = manager.retrieveChunkedData(objCommon.noOfRecordsToBeFetched*(index),objCommon.noOfRecordsToBeFetched); 
                    if (!found) {
                        objCommon.dataSetProfile = JSON.stringify(json);
                    } else {
                        objCommon.assignDataSetProfile = JSON.stringify(json);
                    }
                    recordCount = 0;
                }else{
                    if (!found) {
                    json = objCommon.dataSetProfile;
                    
                    } else {
                        json = objCommon.assignDataSetProfile;
                    }
                }
                if(type == "OdataGrid"){
                    objCommon.hideListTypePopUp();
                    updateMethod(json, propList, recordCount);
                }else{
                    updateMethod(json, recordCount,function(){
                        if (spinner != undefined){
                            spinner.stop();
                        }});
                }
                sessionStorage.selectedPageIndexBox = newSelectedPage;

                var lowerRecordCount = (selectedPage * maxRows) + 1;
                var upperRecordCount = 0;
                if(newSelectedPage < totalPageNo){
                    upperRecordCount = (newSelectedPage * maxRows);
                }else if(newSelectedPage == totalPageNo){
                    upperRecordCount = (selectedPage * maxRows) + (totalRecordCount - (selectedPage * maxRows));
                }
                var recordCount = lowerRecordCount + " - " + upperRecordCount + " " + getUiProps().MSG0323 + " " + totalRecordCount;
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
            }, 50);
        }
    });
};

/**
 * This function is used to show first page in pagination.
 */
common.prototype.createFirstButtonTemp = function(tableID, maxRows, totalRecordCount, totalPageNo, manager, json,updateMethod,type, found, propList,activePage,startIndex){
    $('#firstPage_'+type).unbind();
    $('#firstPage_'+type).click(function() {
        if($("#firstPage_"+type).hasClass("firstPageEnabled")){
            objCommon.showSpinnerForEntities(type);
            setTimeout(function() {
                var lowerRecordInterval = $("#recordCount_"+type).text().split("-")[0];
                var selectedPage = Math.ceil(lowerRecordInterval/maxRows);
                var newSelectedPage = 1;
                var recordCount = 0;
    
                if(selectedPage > (objCommon.noOfRecordsToBeFetched/maxRows)){
                    var index = 1;
                    json = manager.retrieveChunkedData(objCommon.noOfRecordsToBeFetched*(index-1),objCommon.noOfRecordsToBeFetched);
                    if (!found) {
                        objCommon.dataSetProfile = JSON.stringify(json);
                    } else {
                        objCommon.assignDataSetProfile = JSON.stringify(json);
                    }
                }else{
                    //json = objCommon.dataSetProfile;
                    var cnt = parseInt(lowerRecordInterval)-51;
                    json = manager.retrieveChunkedData(cnt,objCommon.noOfRecordsToBeFetched);
                    if (!found) {
                    
                        objCommon.dataSetProfile = JSON.stringify(json);
                    } else {
                        objCommon.assignDataSetProfile = JSON.stringify(json);
                    }
                }
                if(type == "OdataGrid"){
                    objCommon.hideListTypePopUp();
                    updateMethod(json, propList, recordCount);
                }else{
                    updateMethod(json, recordCount, function(){
                        if (spinner != undefined){
                            spinner.stop();
                        }});
                }
    
                var lowerRecordCount = 1;
                var upperRecordCount = maxRows;
                var recordCount = lowerRecordCount + " - " + upperRecordCount + " " + getUiProps().MSG0323 + " " + totalRecordCount;
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
            }, 50);
        }
    });
};

/**
 * This function is used to show last page in pagination.
 */
common.prototype.createLastButtonTemp = function(tableID, maxRows, totalRecordCount, totalPageNo, manager, json,updateMethod,type, found, propList){
    $('#lastPage_'+type).unbind();
    $('#lastPage_'+type).click(function() {
        if($("#lastPage_"+type).hasClass("lastPageEnabled")){
            objCommon.showSpinnerForEntities(type);
        
            setTimeout(function() {
                var lowerRecordInterval = $("#recordCount_"+type).text().split("-")[0];
                var selectedPage = Math.ceil(lowerRecordInterval/maxRows);
                var newSelectedPage = 1;
                var pageNoWithData = Math.floor(objCommon.noOfRecordsToBeFetched / maxRows);
                var divCurrent = Math.ceil(parseInt(selectedPage) / parseInt(pageNoWithData));
                var divDataFetched = (divCurrent*2);
                var modLastPage = parseInt(totalPageNo) % parseInt(pageNoWithData);
                var recordCount = (pageNoWithData - modLastPage - 1) * maxRows;
                //recordCount = (modLastPage - 1) * maxRows;

                if((totalPageNo - selectedPage) >= pageNoWithData){}
                if(selectedPage <= divDataFetched && totalPageNo > divDataFetched){
                    var index = Math.floor(totalPageNo / pageNoWithData);
                    if(totalPageNo % pageNoWithData == 0){
                        index = index - 1;
                    }
                    json = manager.retrieveChunkedData(objCommon.noOfRecordsToBeFetched*(index),objCommon.noOfRecordsToBeFetched);
                    if (!found) {
                        objCommon.dataSetProfile = JSON.stringify(json);
                    } else {
                        objCommon.assignDataSetProfile = JSON.stringify(json);
                    }
                }else{
                    if (!found) {
                        json = objCommon.dataSetProfile;
                    } else {
                        json = objCommon.assignDataSetProfile;
                    }
                }
                
                if(type == "OdataGrid"){
                    objCommon.hideListTypePopUp();
                    updateMethod(json, propList, recordCount);
                }else{
                    updateMethod(json, recordCount, function(){
                        if (spinner != undefined){
                            spinner.stop();
                        }});
                }

                var lowerRecordCount = ((totalPageNo - 1)*maxRows) + 1;
                var upperRecordCount = totalRecordCount;
                var recordCount = lowerRecordCount + " - " + upperRecordCount + " " + getUiProps().MSG0323 + " "+ totalRecordCount;
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
            }, 50);
        }
    });
};

/**
 * This is the method for creating pagination on the page tables.
 * @param totalRecordCount totalRecordCount
 * @param maxRows maxRows
 * @param tblMain tblMain
 * @param manager manager
 * @param json json
 * @param updateMethod updateMethod
 * @param type type
 * @param lastPageIndex lastPageIndex
 */
common.prototype.createPaginationView = function(totalRecordCount, maxRows,tblMain,
        manager,json,updateMethod, type, lastPageIndex, propList,selectedPage,startIndex){
    var totalPageNo = Math.ceil(totalRecordCount / maxRows);
    if(lastPageIndex != undefined && lastPageIndex != -1){
        sessionStorage.selectedPageIndexBox = lastPageIndex;
    }else{
        sessionStorage.selectedPageIndexBox = 1;
    }
    //objCommon.dataSetProfile = JSON.stringify(json);
    var found = $.inArray(type, assignTableIDList) > -1;
    if (!found) {
        objCommon.dataSetProfile = JSON.stringify(json);
    } else {
        objCommon.assignDataSetProfile = JSON.stringify(json);
    }
    var tableID = $(tblMain);
    if(type == "OdataGrid"){
        objCommon.hideListTypePopUp();
        $(".pagination").empty();
        uOdataQuery.createQueryPaginationView("OdataGrid");
    } 
    
    var valid = objCommon.createUIForPaginationTemp(maxRows, totalRecordCount, type,selectedPage,startIndex);
    if (!valid) {
        return;
    }
    objCommon.createPrevButtonTemp(tableID, maxRows, totalRecordCount, totalPageNo, manager, json,updateMethod,type, found, propList,selectedPage,startIndex);
    objCommon.createNextButtonTemp(tableID, maxRows, totalRecordCount, totalPageNo,manager,json,updateMethod,type, found, propList,selectedPage,startIndex);
    objCommon.createFirstButtonTemp(tableID, maxRows, totalRecordCount, totalPageNo,manager,json,updateMethod,type, found, propList);
    objCommon.createLastButtonTemp(tableID, maxRows, totalRecordCount, totalPageNo,manager,json,updateMethod,type, found, propList);
};

/** Pagination : End */

/**
 * The purpose of this function is to add and remove hover effect
 * on create entity label.
 */
common.prototype.creatEntityHoverEffect = function () {
    $("#createEntityWrapper").hover(function(){
        $("#createIcon").css("background","url(./images/sprite.png) no-repeat 43% -551px");
        $("#createText").css("color","#c80000");
        $("#arrow").css("background","url(./images/sprite.png) no-repeat 18% -577px");
    },function(){
        $("#createIcon").css("background","url(./images/sprite.png) no-repeat 43% -523px");
        $("#createText").css("color","#1b1b1b");
        $("#arrow").css("background","url(./images/sprite.png) no-repeat 18% -600px");
    });
};

/**
 * The purpose of this function is to add and remove hover effect
 * on sort by date label.
 */
common.prototype.sortByDateHoverEffect = function () {
    $(".sortWrapper").hover(function(){
        $(".downArrow").css("background","url(./images/sprite.png) no-repeat 18% -577px");
        $(".sortText").css("color","#c80000");
        $(".downArrow").css("cursor","pointer");
        $(".sortText").css("cursor","pointer");
     },function(){
        $(".downArrow").css("background","url(./images/sprite.png) no-repeat 18% -600px");
        $(".sortText").css("color","#1b1b1b");
        $(".downArrow").css("cursor","default");
        $(".sortText").css("cursor","default");
    });
};

/**
 * The purpose of this function is to add hover effect on back
 * functionality og assign grid.
 */
common.prototype.assignBackBtnHoverEffect = function(){
    $(".assignBackWrapper").hover(function(){
        $(".assignBackIcon").css("background","url(./images/newSprite.png) no-repeat 58% -1552px");
        $(".assignEntityText").css("color","#e62525");
    },function(){
        $(".assignBackIcon").css("background","url(./images/newSprite.png) no-repeat 57% -1525px");
        $(".assignEntityText").css("color","#c80000");
    });
};

/**
* The purpose of this function is to set empty message position
* dynamically.
*/
common.prototype.setDynamicPositionOfEmptyMessage = function () {
    var viewportHeight = $(window).height();
    var messagePosition = (viewportHeight/2) - 344;
    if (viewportHeight > 650) {
        $("#dvemptyTableMessage").css("margin-top", messagePosition);
    } else if (viewportHeight <= 650) {
        $("#dvemptyTableMessage").css("margin-top", '-19px');
    }
};

/**
 * The purpose of this function is to display empty table message
 * in entity grid.
 * 
 * @param emptyEntityMessage
 * @param type
 */
common.prototype.displayEmptyMessageInGrid = function (emptyEntityMessage, type) {
    $("#dvemptyTableMessage").text(emptyEntityMessage);
    var recordCount = "0 - 0 "+ getUiProps().MSG0323 +" 0";
    $("#recordCount_"+type).text(recordCount);
    $("#chkSelectall").attr('disabled', true);
    document.getElementById("dvemptyTableMessage").style.display = "block";
    objCommon.setDynamicPositionOfEmptyMessage();
};

/**
 * The purpose of this function is to display empty table message in assign
 * grid
 */
common.prototype.setDynamicPositionOfAssignEmptyMessage = function () {
    var viewportHeight = $(window).height();
    var messageHeight = (viewportHeight - 336)/2;
    if (viewportHeight > 650) {
        $("#dvemptyAssignTableMessage").css("margin-top", messageHeight);
    } else if (viewportHeight <= 650) {
        $("#dvemptyAssignTableMessage").css("margin-top", '157px');
    }
};


/**
 * The purpose of this function is to display empty table message
 * in entity grid.
 * 
 * @param emptyEntityMessage
 */
common.prototype.displayEmptyMessageInAssignGrid = function (emptyEntityMessage, type, checkAllID) {
    $("#dvemptyAssignTableMessage").text(emptyEntityMessage);
    var recordCount = "0 - 0 " + getUiProps().MSG0323 + " 0";
    $("#recordCount_"+type).text(recordCount);
    $("#"+checkAllID).attr('disabled', true);
    if (checkAllID == 'checkAllRoleAccountAssign' || checkAllID == 'checkAllRoleRelationAssign') {
        $('.accountEmptyTableMessageWidth').css('width', '165px');
    } else {
        $('.accountEmptyTableMessageWidth').css('width', '187px');
    }
    document.getElementById("dvemptyAssignTableMessage").style.display = "block";
    if (checkAllID == 'checkAllRoleAccountAssign' || checkAllID == 'checkAllRoleExtCellAssign' || 'checkAllRoleRelationAssign') {
        document.getElementById("dvemptyAssignTableMessage").style.display = "table";
        $('#dvemptyAssignTableMessage').css('width', '0px');
    }
    objCommon.setDynamicPositionOfAssignEmptyMessage();
};

/**
 * Array of tabs containing assignations.
 */
var assignTableIDList = [ "assignRoleTab", "assignExtCellTab","assignAccountTab","assignExtRoleTab", "assignRelationTab"];

/**
 * The purpose of this function is to perform back button operation.
 */
common.prototype.clickAssignBackButton = function (){
    var tab = sessionStorage.tabName;
    $("#dvemptyTableMessage").hide();
    $("#mainContent").show();
    $("#mainContentWebDav").empty();
    $("#mainContentWebDav").hide();
    $("#webDavAccountArea").empty();
    $("#webDavAccountArea").hide();
    if(tab == "Account"){
        loadAccountPage();
    }else if(tab == "External Cell"){
        var objExternalCell = new externalCell();
        objExternalCell.loadExternalCellPage();
    }else if(tab == "Relation"){
        var objRelation  = new uRelation();
        objRelation.loadRelationPage();
    }else if(tab == "External Role"){
        uExternalRole.loadExternalRolePage();
    }
};

/**
 * The purpose of this function is to set max-width dynamically
 * for assign Entity name on assignation pages.
 */
common.prototype.setDynamicAssignEntityMaxwidth = function () {
    var viewPortWidth = $(window).width();
    var gridWidth = viewPortWidth - 90;
    if (viewPortWidth > 1280) {
        $("#divAssignRoleName").css("max-width", gridWidth);
    } else if (viewPortWidth <= 1280) {
        $("#divAssignRoleName").css("max-width", '1200px');
    }
};
/**
 * Following method is used to display error Icon.
 * @param txtID
 */
common.prototype.showErrorIcon = function(txtID){
    $(txtID).removeClass("validValueIconCollection");
    $(txtID).addClass("errorIconCollection");   
};
/**
 * Following method is used for displaying valid value icon.
 * @param txtID
 */
common.prototype.showValidValueIcon = function(txtID){
    $(txtID).removeClass("errorIconCollection");    
    $(txtID).addClass("validValueIconCollection");
    
};

/**
 * Following method is used to remove icons from the textboxes.
 * @param txtID
 */
common.prototype.removeStatusIcons = function(txtID){
    $(txtID).removeClass("errorIconCollection");    
    $(txtID).removeClass("validValueIconCollection");
};

var messageTimer = null;
common.prototype.autoHideAssignRibbonMessage = function(divID){
    if(messageTimer){
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    var timeOut = getUiProps().MSG0037;
    messageTimer = window.setTimeout("$('#"+divID+"').hide()", timeOut);
};


/**
 * These are spinner settings which can be used for every spinner alignment.
 * Top and Left are dynamically set as per screen requirement.
 */
common.prototype.optsCustom = {
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
/**
 * Following method resets scrollbar.
 */
common.prototype.restScrollBar = function(tBodyID) {
    $(tBodyID).scrollTop(0);
    $(tBodyID).scrollLeft(0);
};

/**
 * Following method enables delete icon (Collection).
 */
common.prototype.activateCollectionDeleteIcon = function(id){
    $(id).removeClass();
    $(id).removeClass('deleteIconWebDav');
    $(id).addClass('deleteIconWebDavEnabled');
};

/**
 * Following method disables delete icon (Collection).
 */
common.prototype.disableDeleteIcon = function(id){
    $(id).removeAttr('style');
    $(id).removeClass();
    $(id).removeClass('deleteIconWebDavEnabled');
    $(id).addClass('deleteIconWebDav');
};

/**
 * The purpose of this method is to set value of any html component
 * @param id
 * @param value
 */
common.prototype.setHTMLValue = function(id, value){
    document.getElementById(id).innerHTML = value;
};

/**
 * The purpose of this method is to generate date in format applicable to UI Date component.
 * @param readableDate
 * @returns {String}
 */
common.prototype.convertReadableDateToInputDateFormat = function(readableDate){
    var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var monthName = readableDate.split("-")[1];
    var monthNum = m_names.indexOf(monthName);
    monthNum = monthNum +1;
    if(monthNum < 10){
        monthNum = "0" + monthNum;
    }
    var dayNum = "";
    if(readableDate.split("-")[0].length == 1){
        dayNum = "0" + readableDate.split("-")[0];
    }else if(readableDate.split("-")[0].length == 2){
        dayNum = readableDate.split("-")[0];
    }
    var readableYearAndTime = readableDate.split("-")[2];
    var readableYear = readableYearAndTime.split(" ")[0];
    var inputDate = readableYear + "-" + monthNum + "-" + dayNum;
    return inputDate;
};

common.prototype.replaceNullValues = function(value, replaceString) {
    if (value== "" || value == null || value == undefined){
        return replaceString;
    }
    return value;
};

common.prototype.setCellControlsInfoTabValues = function(ccname, cctag0, cctag1, cccreatedat, ccupdatedat, ccurl) {
    
    cctag0  = objCommon.replaceNullValues(cctag0,getUiProps().MSG0275);
    cctag1  = objCommon.replaceNullValues(cctag1,getUiProps().MSG0275);

    var etag = cctag0 + "/" +'" ' +cctag1 + '"';
    
    if (cctag1 == getUiProps().MSG0275) {
        etag = cctag0;
    }
    
    sessionStorage.ccname       = objCommon.replaceNullValues(ccname,getUiProps().MSG0275);
    sessionStorage.ccetag       = etag;
    sessionStorage.cccreatedat  = objCommon.replaceNullValues(cccreatedat,getUiProps().MSG0275);
    sessionStorage.ccupdatedat  = objCommon.replaceNullValues(ccupdatedat,getUiProps().MSG0275);
    sessionStorage.ccurl        = objCommon.replaceNullValues(ccurl,getUiProps().MSG0275).replace(/[`]/g,"'");
};

/**
 * The purpose of this method is to bind role box drop down
 * on the basis of drop down ID
 * @param dropDownID
 */
common.prototype.bindRoleBoxDropDown = function(dropDownID) {
    var message = getUiProps().MSG0225;
    var mainBox = getUiProps().MSG0039;
    objCommon.refreshDropDown(dropDownID, message);
    var jsonString = objCommon.getRoleListForSelectedCell();
    var select = document.getElementById(dropDownID);
    for (var count = 0; count < jsonString.length; count++) {
        var option = document.createElement("option");
        var objRole = jsonString[count];
        option.id = objRole.__metadata.etag;
        var boxName = objRole['_Box.Name'];
        option.innerHTML = objRole.Name + objCommon.startBracket + boxName + objCommon.endBracket;
        if (boxName == null) {
            option.innerHTML = objRole.Name + objCommon.startBracket + mainBox + objCommon.endBracket;
        }
        option.title = option.innerHTML;
        option.value = option.innerHTML;
        var tooltipRoleBoxName = objCommon.getShorterName(option.innerHTML, 17);
        option.text = tooltipRoleBoxName ;
        select.appendChild(option);
    }
};

/**
 * The purpose of this method is to refesh frop down
 * on the basis of drop down ID
 * @param dropDownID
 * @param message
 */
common.prototype.refreshDropDown = function(dropDownID, message) {
    var select = document.getElementById(dropDownID);
    select.options.length = 0;
    var newOption = document.createElement('option');
    newOption.value = 0;
    newOption.innerHTML = message;
    select.insertBefore(newOption, select.options[-1]);
};

/**
 * The purpose of this method is to fetch role list 
 * against selected cell
 * @returns
 */
common.prototype.getRoleListForSelectedCell = function () {
    var cellName = sessionStorage.selectedcell;
    var baseUrl = getClientStore().baseURL;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var objRoleManager = new _pc.RoleManager(accessor);
    var count = retrieveRoleRecordCount();
    var uri = objRoleManager.getUrl();
    uri = uri + "?$orderby=__updated desc &$top=" + count;
    var restAdapter =  new _pc.RestAdapterFactory.create(accessor);
    var response = restAdapter.get(uri, "application/json");
    var json = response.bodyAsJson().d.results;
    return json;
};

/**
 * The purpose of this function is to enable/disable drop down
 * on click of check box.
 * @param chkBoxID
 * @param dropDownID
 * @param isRoleBox
 */
common.prototype.clickAssignChkBoxCreatePopup = function(chkBoxID, dropDownID, isRoleBox, dropDownErrorMsg) {
    var dropDownDefaultMsg = null;
    if (isRoleBox) {
        dropDownDefaultMsg = getUiProps().MSG0225;
    }
    if ($('#'+chkBoxID).is(':checked')) {
        $("#"+dropDownID).removeAttr("disabled");
        $("#"+dropDownID).removeClass("customSlectDDDisabled");
    } else {
        $("#"+dropDownID).attr('disabled', true);
        $("#"+dropDownID).addClass("customSlectDDDisabled");
        $("#"+dropDownID).val(dropDownDefaultMsg);
        $("#"+dropDownErrorMsg).text("");
    }
};

/**
 * The purpose of this function is to assign entity at the time
 * of entity creation.
 * 
 * @param dropDownID
 * @param SOURCE
 * @param DESTINATION
 * @param key
 * @param isMultiKey
 * @returns
 */
common.prototype.assignEntity = function(dropDownID, SOURCE, DESTINATION, key, isMultiKey) {
    var cellName = sessionStorage.selectedcell;
    var baseUrl = getClientStore().baseURL;
    var accessor = objCommon.initializeAccessor(baseUrl, cellName);
    var context = objCommon.initializeAbstractDataContext(accessor);
    var arrRoleOrRelation = objCommon.getSelectedEntity(dropDownID);
    var mainBox = getUiProps().MSG0039;
    var roleOrRelation = arrRoleOrRelation[0].split(' ').join('');
    var box = arrRoleOrRelation[1].split(' ').join('');
    box = objCommon.getBoxSubstring(box);
    roleOrRelation = roleOrRelation.trim();
        var objLinkManager = objCommon.initializeLinkManager(accessor, context);
        if (box == mainBox) {
            box = null;
        }
    var response = objLinkManager.establishLink(context, SOURCE, DESTINATION, key, box, roleOrRelation, isMultiKey);
    return response;
};

/**
 * The purpose of this function is to get substring from box name.
 * 
 * @param boxName
 * @returns
 */
common.prototype.getBoxSubstring = function (boxName) {
    var boxSubstring = null;
    if (boxName != undefined) {
        var lenBoxName = boxName.length;
        if (lenBoxName > 0) {
            boxSubstring  = boxName.substring(0, lenBoxName - 1);
        }
    }
    return boxSubstring;
};

/**
 * This a generic function to remove pop up status icon.
 * 
 * @param txtID
 */
common.prototype.removePopUpStatusIcons = function(txtID){
    $(txtID).removeClass("errorIcon");  
    $(txtID).removeClass("validValueIcon");
};

/**
 * The purpose of this function is to reset assignation
 * scrren drop down after mapping functionality based on 
 * dropDownID
 * @param dropDownID
 * @param btnAssign
 * @param message
 */
common.prototype.resetAssignationDropDown = function(dropDownID, btnAssign, message){
    $(dropDownID).val(message);
    $(btnAssign).attr('disabled', 'disabled');
    $(btnAssign).addClass('assignBtnDisabled');
};

/**
 * The purpose of this function is to hide the list type pop up 
 * of data management grid.
 */
common.prototype.hideListTypePopUp = function() {
    $('.openDetailsPopUpDataMgmt').each(function() {
        $(".openDetailsPopUpDataMgmt").remove();
    });
};

common.prototype.contentTypeHashTable = new HashTable({
    log :'text/plain', 
    epf : 'text/plain',
    java: 'text/plain',
    lzh : 'application/x-compress',
    bar : 'application/zip',
    rar : 'application/x-rar-compressed',
    psd : 'image/vnd.adobe.photoshop',
    js  : 'application/x-javascript',
    pdf : 'application/pdf',
    txt : 'text/plain',
    jpg : 'image/jpeg',
    png : 'image/png',
    html: 'text/html',
    docx: 'application/docx',
    doc : 'application/docx',
    xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    xls : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    zip : 'application/zip',
    json: 'application/json',
    wmv : 'video/x-ms-wmv',
    xml : 'text/xml',
    css : 'text/css',
    mp3 : 'audio/mp3',
    mp4 : 'video/mp4',
    pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    jpeg: 'image/jpeg',
    ppt : 'application/vnd.ms-powerpoint'
});


common.prototype.syntaxHighlight =function(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
};

/**
 * The purpose of this function is to centre align  success/failure div 
 * @param errorSuccessdivId
 */
common.prototype.centerAlignRibbonMessage = function(errorSuccessdivId) {
    var width =$(window).width();
    var divWidth =$(errorSuccessdivId).width();
    var divHalfWidth = divWidth/2;
    var widthDiff = (width)/2 - divHalfWidth;
    $(errorSuccessdivId).css("left",widthDiff);
    
};

/**
 * Following method validates URL.
 * @param cellURL URL.
 * @param errorSpan Error Span ID.
 * @param txtID text Box ID.
 * @returns {Boolean} True/False.
 */
common.prototype.validateURL = function(domainName,errorSpan,txtID) {
    var letters = /^[0-9a-zA-Z\-\_\.]+/;
    var startHyphenUnderscore = /^[\-_!@#$%^&*()=+]/;
    if (domainName == undefined){
        document.getElementById(errorSpan).innerHTML = getUiProps().MSG0302;
        cellpopup.showErrorIcon(txtID);
        return false;
    }
    var lenCellName = domainName.length;
    if (domainName.match(startHyphenUnderscore)) {
        document.getElementById(errorSpan).innerHTML = getUiProps().MSG0301;
        cellpopup.showErrorIcon(txtID);
        return false;
    } else if (lenCellName != 0 && !(domainName.match(letters))) {
        document.getElementById(errorSpan).innerHTML = getUiProps().MSG0300;
        cellpopup.showErrorIcon(txtID);
        return false;
    } 
    document.getElementById(errorSpan).innerHTML = "";
    cellpopup.showValidValueIcon(txtID);
    return true;
};

/**
 * Following method checks if the '/' is provided in the end or not.
 * @param schemaURL external role URL.
 * @param schemaSpan span id for error message.
 * @param txtID text box ID.
 * @param message error message.
 * @returns {Boolean} True/False.
 */
common.prototype.doesUrlContainSlash = function(schemaURL, schemaSpan,txtID,message) {
    if (schemaURL != undefined) {
        if (!schemaURL.endsWith("/")) {
            document.getElementById(schemaSpan).innerHTML = message;
            cellpopup.showErrorIcon(txtID);
            return false;
        }
        document.getElementById(schemaSpan).innerHTML = "";
        cellpopup.showValidValueIcon(txtID);
        return true;
    }
};

/******************************************** Pagination After Delete - Start ********************************************/

/**
 * Following method returns index of the immediate previous record.
 * @returns position
 */
common.prototype.getSelectedEtag = function(assignEntityGridTbody) {
    var val = [];
    if (assignEntityGridTbody != "#entityTableBody") {
        assignEntityGridTbody = objCommon.replaceNullValues(
                assignEntityGridTbody, "#entityGridTbody");
    }
    $(assignEntityGridTbody + ' :checkbox:checked').each(function(iterate) {
        val[iterate] = $(this).attr('title');
    });
    return val[0];
};

/**
 * Following method returns index of the first unselected item.
 * @returns
 */
common.prototype.getEtagOfFirstUnSelectedCheckBox = function(
        assignEntityGridTbody) {
    var val = [];
    if (assignEntityGridTbody != "#entityTableBody") {
        assignEntityGridTbody = objCommon.replaceNullValues(
                assignEntityGridTbody, "#entityGridTbody");
    }
    $(assignEntityGridTbody + ' :checkbox:not(:checked)').each(
            function(iterate) {
                val[iterate] = $(this).attr('title');
            });
    return val[0];
};

/**
 * Following method returns etag value of the immediate previous record.
 * @param etagIDOfPreviousRecord Hidden TextBox ID
 * @returns etag value.
 */
common.prototype.getEtagElementID = function(etagIDOfPreviousRecord,firstCheckBoxID,assignEntityGridTbody) {
    var previousIndex = 0;
    var firstAmongSelectedIndexes = 0;
    var firstAmongUnselectedIndexes = 0;
    var etagInfo = [];
    //if ($("#chkBox0").is(':checked')) {
    if ($(firstCheckBoxID).is(':checked')) {
        firstAmongUnselectedIndexes = objCommon
                .getEtagOfFirstUnSelectedCheckBox(assignEntityGridTbody);
        etagIDOfPreviousRecord += firstAmongUnselectedIndexes;
    } else {
        firstAmongSelectedIndexes = objCommon.getSelectedEtag(assignEntityGridTbody);
        if (firstAmongSelectedIndexes != 0) {
            previousIndex = firstAmongSelectedIndexes - 1;
        }
        etagIDOfPreviousRecord += previousIndex;
    }
    etagInfo.push(etagIDOfPreviousRecord);
    etagInfo.push(previousIndex);
    return etagInfo;
};

/**
 * Following method gets etag value.
 * @param etagIDOfPreviousRecord  id of hidden textboxn
 * @param previousIndex index of the record just above the selected one.
 * @param type Type
 * @returns {Array} array having etag position
 */
common.prototype.getEtagValue = function(etagIDOfPreviousRecord,previousIndex,type) {
    var arrEtagInformation = [];
    var etagValue = document.getElementById(etagIDOfPreviousRecord).value;
    var paginatonLowerValue = objCommon
            .getEtagPaginationPosition(previousIndex,type);
    arrEtagInformation.push(etagValue);
    arrEtagInformation.push(paginatonLowerValue);
    return arrEtagInformation;
};

/**
 * Following method finds out pagination position.
 * @param previousIndex Index
 * @param type Type
 * @returns position
 */
common.prototype.getEtagPaginationPosition = function(previousIndex,type) {
    var contentPagination = $('#recordCount_'+type).clone().children().remove()
            .end().text();
    var arrPaginationText = contentPagination.split('-');
    var paginatonLowerValue = parseInt(arrPaginationText[0]);
    if (previousIndex != 0)
        paginatonLowerValue += (previousIndex - 1);
    return paginatonLowerValue;
};

/**
 * Following method pulls out the etag value of previous record.
 * @param etagIDOfPreviousRecord TextBox Hidden field ID.
 * @param arrEtag array of Etag
 * @param firstCheckBoxID ID of first checkbox
 * @param mappingTBody tbody of the table - tbody would be undefined in case of grids other than the mapping ones. 
 * @returns etag value.
 */
common.prototype.fetchEtagOfPreviousRecord = function(etagIDOfPreviousRecord,arrEtag,firstCheckBoxID,mappingTBody) {
        etagIDOfPreviousRecord = objCommon
                .getEtagElementID(etagIDOfPreviousRecord,firstCheckBoxID,mappingTBody)[0];
        arrEtag = objCommon.getEtagValue(etagIDOfPreviousRecord, objCommon
                .getEtagElementID(etagIDOfPreviousRecord,firstCheckBoxID,mappingTBody)[1]);
        // Use this Etag value to find the exact postion of record in New Json.
        etagValue = arrEtag[0];
    return etagValue;
};


/**
 * Following method gets updated json data for the active page.
 * @param tableID Table ID.
 * @param type Box,Account et al.
 * @param startIndex Start Index
 * @returns {String} json data.
 */
common.prototype.getUpdatedJsonDataForActivepage = function(tableID,type,startIndex,mappingType) {
    
    var endIndex = startIndex + (objCommon.MAXROWS * 2);
    var json = '';
    if (type == "OdataGrid") {
        $("#headerChkBox").attr('disabled', false);
        json =  uDataManagement.retrieveChunkedData(startIndex, endIndex);
    } else {
        $("#chkSelectall").attr('disabled', false);
        $(tableID + "thead tr").addClass("mainTableHeaderRow");
        $(tableID + "tbody").removeClass("emptyBoxTable");
        $(tableID + " tbody").addClass("mainTableTbody");
    }
    if (type == "Box") {
        json = objBox.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "Account") {
        json = objAccount.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "Role") {
        json = objRole.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "ExtCell") {
        json = objExtCell.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "Relation") {
        json = objRelation.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "assignAccountTab") {
        json = objRoleAccountLink.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "ReceivedMessage") {
        json =  uReceivedMessage.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "SentMessage") {
        json =  uSentMessage.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "ExtRole") {
        json =  uExternalRole.retrieveChunkedData(startIndex, endIndex);
    }
    if (type == "assignRoleTab") {
        if (mappingType == "RoleToAccount") {
            json = objRoleToAccountMapping.retrieveChunkedData(startIndex,
                    endIndex);
        }
        if (mappingType == "RoleToExtCell") {
            json = objRoleToExtCellMapping.retrieveChunkedData(startIndex,
                    endIndex);
        }
        if (mappingType == "RoleToRelation") {
            json = objRoleToRelationMapping.retrieveChunkedData(startIndex,
                    endIndex);
        }
        if (mappingType == "RoleToExtRole"){
            json = objRoleToExtRoleMapping.retrieveChunkedData(startIndex,
                    endIndex);
        }
    }
    if (type == "assignRelationTab") {
        if (mappingType == "RelationToRole") {
            json = uRelationToRoleMapping.retrieveChunkedData(startIndex, endIndex);
        }
        if (mappingType == "RelationToExtCell") {
            json =  objRelationToExternalCellMapping.retrieveChunkedData(startIndex, endIndex);
        }
    }
    if (type == "assignExtCellTab") {
        if (mappingType == "ExtCelltoRelation") {
            json = objExternalCellToRelationMapping.retrieveChunkedData(startIndex, endIndex);
        }
        if (mappingType == "ExtCelltoRole") {
            json =  objExternalCellToRoleMapping.retrieveChunkedData(startIndex, endIndex);
        }
    }
    
    if (type == "assignExtRoleTab") {
        if (mappingType == "ExtRoleToRole") {
            json =  uExternalRoleToRoleMapping.retrieveChunkedData(startIndex, endIndex);
        }
    }
    return json;    
};

/**
 * Following method searches the index position of selected etag in the refreshed dataset.
 * @param etag etag
 * @param json json dataset
 * @returns {Number} index
 */
common.prototype.searchEtagInDataSet = function(etag,json) {
    var index = 0;
    var jsonLength = json.length;
    //This method need to be improved by fetching 100 records and then move on to another set of 100 if records aren't found.
    for ( var count = 0; count < jsonLength; count++) {
        var obj = json[count];
        if (obj.__metadata.etag == etag) {
            index = count;
        break;
        }
    }
    return index;
};

/**
 * Following method fetches the start index needed for fetching the dataset.
 * @param etagValue etag
 * @param type Box,Account et al.
 * @returns {Number} Index.
 */
common.prototype.getStartIndex = function(etagValue,type,mappingType) {
    var index = 0;
    var json = '';
    if (type =="Box" ) {
        json =  retrieveAllJsonData();
    }
    if (type =="Account" ) {
        json =  retrieveAllAccountData();
    }
    if (type =="Role" ) {
        json =  retrieveAllRoleData();
    }
    if (type == "ExtCell") {
        json =  objExtCell.retrieveAllExternalCellData();
    }
    if (type == "Relation") {
        json =  objRelation.retrieveAllRelationData();
    }
    if (type == "ReceivedMessage") {
        json =  uReceivedMessage.retrieveAllReceivedMessages();
    }
    if (type == "SentMessage") {
        json =  uSentMessage.retrieveAllSentMessages();
    }
    if (type == "assignAccountTab") {
        json =  retrieveAllRoleAccountLinkJsonData();
    }
    if (type == "ExtRole") {
        json =  uExternalRole.retrieveAllExternalRoleData(); 
    }
    if (type == "assignRoleTab") {
        if (mappingType == "RoleToAccount") {
        json =  retrieveAllRoleToAccountMappingJsonData();
    } 
        if (mappingType == "RoleToExtCell") {
            json =  objRoleToExtCellMapping.retrieveAllRoleToExtCellJsonData();
        }
        if (mappingType == "RoleToRelation") {
            json =  objRoleToRelationMapping.retrieveAllRoleToRelationJsonData();
        }
        if (mappingType == "RoleToExtRole"){
            json =  objRoleToExtRoleMapping.retrieveAllRoleToExtRoleJsonData();
        }
    }
    
    if (type == "assignRelationTab") {
        if (mappingType == "RelationToRole") {
            json =  uRelationToRoleMapping.retrieveAllRelationToRoleJsonData();
        }
        if (mappingType == "RelationToExtCell") {
            json =  objRelationToExternalCellMapping.retrieveAllRelationToExtCellJsonData();
        }
    }
    
    if (type == "assignExtCellTab") {
        if (mappingType == "ExtCelltoRelation") {
            json =  objExternalCellToRelationMapping.retrieveAllExtCellToRelationJsonData();
        }
        if (mappingType == "ExtCelltoRole") {
            json =  objExternalCellToRoleMapping.retrieveAllExtCellToRoleJsonData();
        }
    }
    
    if (type == "assignExtRoleTab") {
        if (mappingType == "ExtRoleToRole") {
            json =  uExternalRoleToRoleMapping.retrieveAllExtRoleToRoleJsonData();
        }
    }
    if (type == "OdataGrid") {
        json =  uDataManagement.retrieveAllEntityJsonData();
    }
    index =  objCommon.searchEtagInDataSet(etagValue,json);
    var mod =  index % objCommon.MAXROWS;
    var startIndex =  index  -  mod;
    return startIndex;
};

/**
 * Following method fetches the active page.
 * @param type Box,Account et al.
 * @returns selected page number.
 */
common.prototype.getActivePage = function(type) {
    var lowerRecordInterval = parseInt($("#recordCount_"+type).text().split("-")[0]);
    var selectedPage = Math.ceil(lowerRecordInterval / objCommon.MAXROWS);
    return selectedPage;
};

/**
 * Following method fetches the last page.
 * @param totalRecordCount Total length of json data.
 * @returns last page number.
 */
common.prototype.getLastPage = function(totalRecordCount) {
    var lastPage = Math.ceil(totalRecordCount/objCommon.MAXROWS);
    return lastPage;
};

/**
 * Following method binds grid 
 * @param etagValue etag value
 * @param type Box,Account et al.
 * @param tableID table ID
 * @param objCellControlElement cell control object lie objBox,objAccount et al.
 */
common.prototype.bindGrid = function(etagValue, type, tableID,
        objCellControlElement, mappingType) {
    var selectedPage = objCommon.getActivePage(type);
    var startIndex = objCommon.getStartIndex(etagValue, type, mappingType);
    var json = objCommon.getUpdatedJsonDataForActivepage(tableID, type,
            startIndex, mappingType);
    var totalRecordCount = 0;
    var table = '';
    if (type == "Box") {
        createChunkedBoxTable(json, 0);
        totalRecordCount = getBoxTotalRecordCount();
        table = createChunkedBoxTable;
    }
    if (type == "Account") {
        createChunkedAccountTable(json, 0);
        totalRecordCount = retrieveAccountRecordCount();
        table = createChunkedAccountTable;
    }
    if (type == "Role") {
        createChunkedRoleTable(json, 0);
        totalRecordCount = retrieveRoleRecordCount();
        table = createChunkedRoleTable;
    }
    if (type == "Rule") {
        createChunkedRuleTable(json, 0);
        totalRecordCount = retrieveRuleRecordCount();
        table = createChunkedRuleTable;
    }
    if (type == "ExtCell") {
        objExtCell.createChunkedExtCellTable(json, 0);
        totalRecordCount = objExtCell.retrieveRecordCount();
        table = objExtCell.createChunkedExtCellTable;
    }
    if (type == "Relation") {
        createChunkedRelationTable(json, 0);
        totalRecordCount = retrieveRelationRecordCount();
        table = createChunkedRelationTable;
    }
    if (type == "ReceivedMessage") {
        uReceivedMessage.createChunkedReceivedMessageTable(json, 0);
        totalRecordCount = uReceivedMessage.retrieveRecordCount();
        table = uReceivedMessage.createChunkedReceivedMessageTable;
    }
    if (type == "SentMessage") {
        uSentMessage.createChunkedSentMessageTable(json, 0);
        totalRecordCount = uSentMessage.retrieveRecordCount();
        table = uSentMessage.createChunkedSentMessageTable;
    }
    if (type == "assignAccountTab") {
        createChunkedAccountToRoleMappingTable(json, 0);
        totalRecordCount = objRoleAccountLink.retrieveRecordCount();
        table = createChunkedAccountToRoleMappingTable;
    }
    if (type == "ExtRole") {
        uExternalRole.createChunkedExtRoleTable(json, 0);
        totalRecordCount = uExternalRole.retrieveRecordCount();
        table = uExternalRole.createChunkedExtRoleTable;
    }
    if (type == "assignRoleTab") {
        if (mappingType == "RoleToAccount") {
            createRoleToAccountMappingTableChunked(json, 0);
            totalRecordCount = objRoleToAccountMapping
                    .retrieveRoleAccountAssignRecordCount();
            table = createRoleToAccountMappingTableChunked;
        }
        if (mappingType == "RoleToExtCell") {
            objRoleToExtCellMapping.createRoleToExtCellMappingTableChunked(
                    json, 0);
            totalRecordCount = objRoleToExtCellMapping
                    .retrieveRoleExtCellAssignRecordCount();
            table = objRoleToExtCellMapping.createRoleToExtCellMappingTableChunked;
        }
        if (mappingType == "RoleToRelation") {
            objRoleToRelationMapping.createRoleToRelationMappingTableChunked(
                    json, 0);
            totalRecordCount = objRoleToRelationMapping
                    .retrieveRoleRelationAssignRecordCount();
            table = objRoleToRelationMapping.createRoleToRelationMappingTableChunked;
        }
        if (mappingType == "RoleToExtRole") {
            objRoleToExtRoleMapping.createRoleToExtRoleMappingTableChunked(
                    json, 0);
            totalRecordCount = objRoleToExtRoleMapping
                    .retrieveRoleExtRoleAssignRecordCount();
            table = objRoleToExtRoleMapping.createRoleToExtRoleMappingTableChunked;
        }
    }

    if (type == "assignRelationTab") {
        if (mappingType == "RelationToRole") {
            uRelationToRoleMapping.createChunkedRelationToRoleMappingTable(
                    json, 0);
            totalRecordCount = uRelationToRoleMapping.retrieveLinkedRoleCount();
            table = uRelationToRoleMapping.createChunkedRelationToRoleMappingTable;
        }
        if (mappingType == "RelationToExtCell") {
            objRelationToExternalCellMapping
                    .createChunkedRelationToExtCellMappingTable(json, 0);
            totalRecordCount = objRelationToExternalCellMapping
                    .retrieveLinkedExtCellCount();
            table = objRelationToExternalCellMapping.createChunkedRelationToExtCellMappingTable;
        }
    }
    if (type == "assignExtCellTab") {
        if (mappingType == "ExtCelltoRelation") {
            objExternalCellToRelationMapping
                    .createChunkedExtCellToRelationMappingTable(json, 0);
            totalRecordCount = objExternalCellToRelationMapping
                    .retrieveLinkedRelationCount();
            table = objExternalCellToRelationMapping.createChunkedExtCellToRelationMappingTable;
        }
        if (mappingType == "ExtCelltoRole") {
            objExternalCellToRoleMapping
                    .createChunkedExtCellToRoleMappingTable(json, 0);
            totalRecordCount = objExternalCellToRoleMapping
                    .retrieveLinkedRoleCount();
            table = objExternalCellToRoleMapping.createChunkedExtCellToRoleMappingTable;
        }
    }
    
    if (type == "assignExtRoleTab") {
        if (mappingType == "ExtRoleToRole") {
            uExternalRoleToRoleMapping.createChunkedExtRoleToRoleMappingTable(
                    json, 0);
            totalRecordCount = uExternalRoleToRoleMapping
                    .retrieveLinkedExtRoleCount();
            table = uExternalRoleToRoleMapping.createChunkedExtRoleToRoleMappingTable;
        }
    }
    if (type == "OdataGrid") { 
        uDataManagement.createEntityTable(json, uDataManagement.propertyDetailsList, 0);
        totalRecordCount = uDataManagement.retrieveRecordCount();
        table = uDataManagement.createEntityTable;
    }
    
    objCommon.createPaginationView(totalRecordCount, objCommon.MAXROWS,
            tableID, objCellControlElement, json, table, type, '', '',
            selectedPage, startIndex);
    objCommon.checkCellContainerVisibility();
};

/**
 * Following methos sets grid style.
 * @param tableID Table ID.
 */
common.prototype.setGridStyle = function(tableID) {
    $(tableID + "thead tr").addClass("mainTableHeaderRow");
    $(tableID + "tbody").removeClass("emptyBoxTable");
    $(tableID + "tbody").addClass("mainTableTbody");
};


/**
 * Following method binds grid when all records have deleted.
 * @param startIndex start Index
 * @param endIndex End Index
 * @param objCellControlElement cell control object lie objBox,objAccount et al.
 * @param type Box,Account et al.
 * @param selectedPage Selected Page Number
 * @param tableID Table ID
 * @param totalRecordCount Total length of json data.
 */
common.prototype.bindGridSelectAll = function(startIndex, endIndex,
        objCellControlElement, type,selectedPage,tableID,totalRecordCount,mappingType,idCheckAllChkBox) {
    $(idCheckAllChkBox).attr('disabled', false);
    var table = '';
    var recordSize = 0;
    var json = objCellControlElement.retrieveChunkedData(startIndex, endIndex);
    if (type == "Box") {
        objCommon.setGridStyle("#mainBoxTable");
        createChunkedBoxTable(json, recordSize);
        //totalRecordCount = getBoxTotalRecordCount();
        table = createChunkedBoxTable;
    }
    if (type == "Account") {
        objCommon.setGridStyle("#mainAccountTable");
        createChunkedAccountTable(json, recordSize);
        table = createChunkedAccountTable;
    } 
    if (type == "Role") {
        objCommon.setGridStyle("#mainRoleTable");
        createChunkedRoleTable(json, recordSize);
        table = createChunkedRoleTable;
    } 
    if (type == "ExtCell") {
        objCommon.setGridStyle("#mainExternalCellTable");
        objExtCell.createChunkedExtCellTable(json, recordSize);
        table = objExtCell.createChunkedExtCellTable;
    }
    if (type == "Relation") {
        objCommon.setGridStyle("#mainRelationTable");
        createChunkedRelationTable(json, recordSize);
        table = createChunkedRelationTable;
    }
    if (type == "ReceivedMessage") {
        objCommon.setGridStyle("#receivedMessageTable");
        uReceivedMessage.createChunkedReceivedMessageTable(json, recordSize);
        table = uReceivedMessage.createChunkedReceivedMessageTable;
    }
    if (type == "SentMessage") {
        objCommon.setGridStyle("#sentMessageTable");
        uSentMessage.createChunkedSentMessageTable(json, recordSize);
        table = uSentMessage.createChunkedSentMessageTable;
    }
    if (type == "assignAccountTab") {
        objCommon.setGridStyle("#mainRoleAccountControlTable");
        createChunkedAccountToRoleMappingTable(json, recordSize);
        table = createChunkedAccountToRoleMappingTable;
    }
    if (type == "ExtRole") {
        objCommon.setGridStyle("#externalRoleTable");
        uExternalRole.createChunkedExtRoleTable(json, recordSize);
        table = uExternalRole.createChunkedExtRoleTable;
    }
    if (type == "assignRoleTab") {
        if (mappingType == "RoleToAccount") {
            objCommon.setGridStyle("#mainRoleAccountLinkTable");
            createRoleToAccountMappingTableChunked(json, recordSize);
            table = createRoleToAccountMappingTableChunked;
        }
        if (mappingType == "RoleToExtCell") {
            objCommon.setGridStyle("#mainRoleExtCellLinkTable");
            objRoleToExtCellMapping.createRoleToExtCellMappingTableChunked(json, recordSize); 
            table = objRoleToExtCellMapping.createRoleToExtCellMappingTableChunked;
        }
        
        if (mappingType == "RoleToRelation"){
            objCommon.setGridStyle("#mainRoleRelationLinkTable");
            objRoleToRelationMapping.createRoleToRelationMappingTableChunked(json, recordSize); 
            table = objRoleToRelationMapping.createRoleToRelationMappingTableChunked;   
        }
        if (mappingType == "RoleToExtRole"){
            objCommon.setGridStyle("#mainRoleExtRoleLinkTable");
            objRoleToExtRoleMapping.createRoleToExtRoleMappingTableChunked(json, recordSize);
            table = objRoleToExtRoleMapping.createRoleToExtRoleMappingTableChunked;
        }
    }
    
    if (type == "assignRelationTab") {
        if (mappingType == "RelationToRole") {
            objCommon.setGridStyle("#mainRelationRoleLinkTable");
            uRelationToRoleMapping.createChunkedRelationToRoleMappingTable(json,recordSize);
            table = uRelationToRoleMapping.createChunkedRelationToRoleMappingTable;
        }
        if (mappingType == "RelationToExtCell") {
            objCommon.setGridStyle("#mainRelationExtCellLinkTable");
            objRelationToExternalCellMapping.createChunkedRelationToExtCellMappingTable(json, recordSize);
            table = objRelationToExternalCellMapping.createChunkedRelationToExtCellMappingTable;
        }
    }
    if (type == "assignExtCellTab") {
        if (mappingType == "ExtCelltoRelation") {
            objCommon.setGridStyle("#mainExternalCellRelationLinkTable");
            objExternalCellToRelationMapping.createChunkedExtCellToRelationMappingTable(json, recordSize);
            table = objExternalCellToRelationMapping.createChunkedExtCellToRelationMappingTable;
        }
        if (mappingType == "ExtCelltoRole") {
            objCommon.setGridStyle("#mainExternalCellRoleLinkTable");
            objExternalCellToRoleMapping.createChunkedExtCellToRoleMappingTable(json, recordSize);
            table = objExternalCellToRoleMapping.createChunkedExtCellToRoleMappingTable;
        }
    }
    
    if (type == "assignExtRoleTab") {
        if (mappingType == "ExtRoleToRole") {
            uExternalRoleToRoleMapping.createTable();
            objCommon.setGridStyle("#extRoleToRoleMappingTable");
            uExternalRoleToRoleMapping.createChunkedExtRoleToRoleMappingTable(json, recordSize);
            table = uExternalRoleToRoleMapping.createChunkedExtRoleToRoleMappingTable;
        }
    }
    if (type == "OdataGrid") { 
        uDataManagement.getEntityList(uDataManagement.propertyDetailsList,true);
        uDataManagement.createEntityTable(json, uDataManagement.propertyDetailsList, recordSize);
        table = uDataManagement.createEntityTable;
    }
    // objCommon.dataSetProfile = JSON.stringify(json);
    objCommon.createPaginationView(totalRecordCount, objCommon.MAXROWS,
            tableID, objCellControlElement, json, table, type,
            '', '', selectedPage, startIndex);
    objCommon.checkCellContainerVisibility();
};

/**
 * Following method is used for binding grid when 'check all' checkbox is checked.
 */
common.prototype.bindGridCheckAll = function(type, cellControlElement, tableID,
        totalRecordCount,mappingType,idCheckAllChkBox) {
    if (totalRecordCount <= objCommon.MAXROWS) {    
        objCommon.populateGridByType(type, mappingType);
        if (totalRecordCount == 0) {
            var recordCount = "0 - 0 " +  getUiProps().MSG0323 + " 0";
            $("#recordCount_"+type).text(recordCount);
        }
        return;
    }
    var lowerRecordInterval = $("#recordCount_" + type).text().split("-")[0];
    var selectedPage = objCommon.getActivePage(type);
    var startIndex = 0;
    var endIndex = 0;
    //Total Pages count.
    var lastPage = objCommon.getLastPage(totalRecordCount);
    if (selectedPage == lastPage) {
        // startIndex = (parseInt(lowerRecordInterval) - objCommon.MAXROWS) - 1;
        startIndex = (parseInt(lowerRecordInterval)) - 1;
        if (selectedPage == 2) {
            startIndex = objCommon.MAXROWS;
        }
        endIndex = startIndex + objCommon.MAXROWS;
    } else if (selectedPage > lastPage) {
        selectedPage = lastPage;
        startIndex = (parseInt(lowerRecordInterval) - objCommon.MAXROWS) - 1;
        // startIndex = (parseInt(lowerRecordInterval) ) - 1;
        endIndex = startIndex + objCommon.MAXROWS;
        //when total count of pages is 2 and apparently the max record could not exceed 100
    }  else {
        startIndex = parseInt(lowerRecordInterval) - 1;
        endIndex = startIndex + (objCommon.MAXROWS *2);
    }
    objCommon.bindGridSelectAll(startIndex, endIndex, cellControlElement, type,
            selectedPage, tableID, totalRecordCount, mappingType,idCheckAllChkBox);
};

/**
 * Following method populates grid on the basis of type
 */
common.prototype.populateGridByType = function(type,mappingType) {
    if (type == "Box") {
        createBoxTable();
    }
    if (type == "Account") {
        createAccountTable();
    }
    if (type == "Role") {
        createRoleTable();
    }
    if (type == "Rule") {
        createRuleTable();
    }
    if (type == "ExtCell") {
        objExtCell.createExternalCellTable();
    }
    if (type == "Relation") {
        createRelationTable();
    }
    if (type == "ReceivedMessage") {
        uReceivedMessage.createReceivedMessageTable();
    }
    if (type == "SentMessage") {
        uSentMessage.createSentMessageTable();
    }
    if (type == "assignAccountTab") {
        createRoleAccountLinksTable();
    }
    if (type == "ExtRole") {
        uExternalRole.createExternalRoleTable();
    }
    if (type == "assignRoleTab") {
        if (mappingType == "RoleToAccount"){
        createRoleToAccountMappingTable();
        }
        if (mappingType == "RoleToExtCell"){
            objRoleToExtCellMapping.createExtCellMappedToRole();
        }
        if (mappingType == "RoleToRelation"){
            objRoleToRelationMapping.createRelationMappedToRole();
        }
        if (mappingType == "RoleToExtRole"){
            objRoleToExtRoleMapping.createTable();
        }
    }
    if (type == "assignRelationTab") {
        if (mappingType == "RelationToRole") {
            uRelationToRoleMapping.createTable();
        }
        if (mappingType == "RelationToExtCell") {
            objRelationToExternalCellMapping.createTable();
        }
    }
    
    if (type == "assignExtCellTab") {
        if (mappingType == "ExtCelltoRelation") {
            objExternalCellToRelationMapping.createTable();
        }
        if (mappingType == "ExtCelltoRole") {
            objExternalCellToRoleMapping.createTable();
        }
    }
    if (type == "assignExtRoleTab") {
        if (mappingType == "ExtRoleToRole") {
            uExternalRoleToRoleMapping.createTable();
        }
    }
    if (type == "OdataGrid") { 
        uDataManagement.getEntityList(uDataManagement.propertyDetailsList,false);
        uDataManagement.setDynamicWidthForODataGrid();
    }
};

/**
 * Following method populates grid after delete operation
 * @param etagValue Etag 
 * @param arrDeletedConflictCount Array having count, should a record couldn't be deleted.
 * @param arrEtag array of etag
 * @param idCheckAllChkBox select all check box ID
 * @param etagIDOfPreviousRecord TextBox ID of hidden textbox.
 * @param type Type of Table
 * @param tableID Table ID
 * @param mappingType Mapping type
 * @param recordCount total records count
 * @param objControlElement object cell control element
 * @param isDeleted isDeleted flag
 */
common.prototype.populateTableAfterDelete = function(etagValue,arrDeletedConflictCount,
        arrEtag, idCheckAllChkBox, etagIDOfPreviousRecord, 
        type, tableID, mappingType, recordCount,objControlElement,isDeleted) {
    if (arrDeletedConflictCount.length > 0
            && $(idCheckAllChkBox).is(':checked')) {
        var count = arrDeletedConflictCount[0];
        arrEtag = objCommon.getEtagValue(etagIDOfPreviousRecord + count,
                objCommon.getEtagElementID(etagIDOfPreviousRecord)[1], type);
        etagValue = arrEtag[0];
        arrDeletedConflictCount = [];
        objCommon.bindGrid(etagValue, type, tableID,
                objControlElement, mappingType);
    } else if (arrDeletedConflictCount.length == 0
            && $(idCheckAllChkBox).is(':checked')) {
            objCommon.bindGridCheckAll(type, objControlElement, tableID,
                recordCount,mappingType,idCheckAllChkBox);
        arrDeletedConflictCount = [];
    } else if (isDeleted == true && !$(idCheckAllChkBox).is(':checked')) {
        var selectedPage = objCommon.getActivePage(type);
        if (selectedPage == 1) {
            objCommon.populateGridByType(type, mappingType);
        } else {
            objCommon.bindGrid(etagValue, type, tableID,
                    objControlElement, mappingType);
        }
        isDeleted = false;
    }
};

/******************************************** Pagination After Delete - End ********************************************/

/**
 * Following method displays Image.
 * @param imgBinaryFile image binary data.
 * @param imgProfile image profile.
 * @param figureProfileImage figure id.
 * @param profileImage profile filename.
 * @param lblFileName profile filename lbl id.
 */
common.prototype.showProfileImage = function(imgBinaryFile,imgProfile,figureProfileImage,profileImage,lblFileName) {
    //if the image binary data is not null , data would be converted into Image.
    if (!imgBinaryFile) {
      $(figureProfileImage).addClass("boxProfileImage");
      $(imgProfile).css("display", "none").attr('src', "#");
      return;
    };

    var minHeight = 71;
    var minWidth = 70;
    var imgHeight = 0;
    var imgWidth = 0;
    var img = new Image();
    img.src = imgBinaryFile;
    img.onload = function(){
      imgHeight = img.height;
      imgWidth = img.width;

      if (profileImage != undefined) {
         $(lblFileName).text(profileImage);         
      }

      checkImageDimensions(imgProfile, figureProfileImage,
            minHeight, minWidth, imgHeight, imgWidth,
            imgBinaryFile);
    }
}

/*
 * Replace personium-localunit with your unit URL
 */
common.prototype.changeLocalUnitToUnitUrl = function (cellUrl) {
    var result = cellUrl;
    if (cellUrl.startsWith(objCommon.PERSONIUM_LOCALUNIT)) {
        if (!objCommon.pathBasedCellUrlEnabled) {
            // https://cellname.fqdn/
            let cellname = cellUrl.replace(objCommon.PERSONIUM_LOCALUNIT + "/", "");
            if (cellname.endsWith("/")) {
              cellname = cellname.substring(0, cellname.length-1);
            }
            let unitSplit = getClientStore().baseURL.split("/");
            unitSplit[2] = cellname + "." + unitSplit[2];
            result = unitSplit.join("/");
        } else {
            // https://fqdn/cellname/
            result = cellUrl.replace(objCommon.PERSONIUM_LOCALUNIT + "/", getClientStore().baseURL);
        }
    }

    return result;
}

/*
 * Replace unit URL with your personium-localunit
 */
common.prototype.changeUnitUrlToLocalUnit = function (cellUrl, cellName, unitUrl) {
    var result = cellUrl;
    if (unitUrl.startsWith(getClientStore().baseURL)) {
        result = objCommon.PERSONIUM_LOCALUNIT + "/" + cellName;
    }

    return result;
}

/*
 * Acquire DisplayName from the object of profile.json according to existence of multilingual correspondence.
 */
common.prototype.getProfileDisplayName = function(resJson) {
    var tempDispName = resJson.DisplayName;
    if (sessionStorage.selectedLanguage === 'en' && tempDispName.en != undefined) {
        tempDispName = resJson.DisplayName.en;
    }
    return tempDispName;
}

/*
 * Acquire Description from the object of profile.json according to existence of multilingual correspondence.
 */
common.prototype.getProfileDescription = function(resJson) {
    var tempDescription = resJson.Description;
    if (sessionStorage.selectedLanguage === 'en' && tempDescription && tempDescription.en != undefined) {
        tempDescription = resJson.Description.en;
    }
    return tempDescription;
}

/**
 * The purpose of this function is to validate Edm.Double type.
 * @param value
 */
common.prototype.isTypeDoubleValid = function(value) {
    if (0 == value
        || (objCommon.DOUBLE_NEGATIVE_MIN_VALUE <= value
            && value <= objCommon.DOUBLE_NEGATIVE_MAX_VALUE)
        || (objCommon.DOUBLE_POSITIVE_MIN_VALUE <= value
            && value <= objCommon.DOUBLE_POSITIVE_MAX_VALUE)) {

        return true;
    }

    return false;
}

/**
 * Get SchemaUrl from object. If it does not exist, let URL of its cell be SchemaUrl.
 * @param obj
 */
common.prototype.getObjectSchemaUrl = function(obj) {
  var infoSchema = "'- (" + sessionStorage.selectedcellUrl + "/)'";
  if (obj.length > 0 && obj[0].Schema) {
    infoSchema = "'" + obj[0].Schema + "'";
  }

  return infoSchema;
}

/**
 * Check if the value is an integer value
 */
common.prototype.isNumber = function(val){
  var regex = new RegExp(/^[0-9]+$/);
  return regex.test(val);
}

common.prototype.getCell = function(cellUrl) {
    return jquery1_12_4.ajax({
        type: "GET",
        url: cellUrl,
        headers: {
            'Accept': 'application/json'
        }
    });
}

/*
 * Retrieve cell name from cell URL
 * Parameter:
 *     1. ended with "/", "https://demo.personium.io/debug-user1/"
 *     2. ended without "/", "https://demo.personium.io/debug-user1"
 * Return:
 *     debug-user1
 */
common.prototype.getName = function (path) {
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

/**
 * The purpose of this function is to return the BlackList used for the validate check.
 */
common.prototype.getValidateBlackList = function() {
  var blackList = [
    // ASCII
    // C0
    "\\x00-\\x1F", // Control Code
    // C1
    "\\x7F-\\x9F", // Control Code
    // Unicode
    "\\u061C", //ARABIC LETTER MARK
    "\\u200B", //ZERO WIDTH SPACE
    "\\u200C", //ZERO WIDTH NON-JOINER
    "\\u200D", //ZERO WIDTH JOINER
    "\\u200E", //LEFT-TO-RIGHT MARK
    "\\u200F", //RIGHT-TO-LEFT MARK
    "\\u2028", //LINE SEPARATOR
    "\\u2029", //PARAGRAPH SEPARATOR
    "\\u202A-\\u202E", //Bi-directional text
    "\\u2066", //LEFT-TO-RIGHT ISOLATE
    "\\u2062", //INVISIBLE TIMES
    "\\u2063", //INVISIBLE SEPARATOR
    "\\u2064", //INVISIBLE PLUS
    "\\u2067", //RIGHT-TO-LEFT ISOLATE
    "\\u2068", //FIRST STRONG ISOLATE
    "\\u2069", //POP DIRECTIONAL ISOLATE
    "\\uFEFF", //ZERO WIDTH NO-BREAK SPACE
    "\\uFFF9", //INTERLINEAR ANNOTATION ANCHOR
    "\\uFFFA", //INTERLINEAR ANNOTATION SEPARATOR
    "\\uFFFB", //INTERLINEAR ANNOTATION SEPARATOR
    "\\uFDD0-\\uFDEF", //noncharacter
    "\\uFFFE", //noncharacter
    "\\uFFFF" //noncharacter
  ].join("");

  return blackList;
}