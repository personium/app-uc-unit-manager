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
function login_validation(){}
var uLoginValidation = new login_validation();

function validateForm() {
	document.getElementById("logoutDiv").style.visibility = "hidden";
        if (document.login.loginUrl.value == "") {
		document.getElementById("unitspan").style.display = "block";
                document.getElementById("unitspan").innerHTML = "Please enter loginUrl";
		document.login.loginUrl.focus();
		return false;
        } else if (document.login.userId.value == "") {
		document.getElementById("unitspan").style.display = "none";
		document.getElementById("unitcellspan").style.display = "none";
		document.getElementById("userspan").style.display = "block";
		document.getElementById("userspan").innerHTML = "Please enter username";
		document.login.userId.focus();
		return false;
	} else if (document.login.passwd.value == "") {
		document.getElementById("unitspan").style.display = "none";
		document.getElementById("unitcellspan").style.display = "none";
		document.getElementById("userspan").style.display = "none";
		document.getElementById("paswdspan").style.display = "block";
		document.getElementById("paswdspan").innerHTML = "Please enter password";
		document.login.passwd.focus();
		return false;
	}
	sessionStorage.removeItem("revisionNumber");
	return true;
}

/**
 * The purpose of this function is to validate password.
 * @param password
 * @param passwordSpanID
 * @param userName
 * @param passwordID
 * @returns {Boolean}
 */
login_validation.prototype.validatePassword = function(password,
		passwordSpanID, userName, passwordID) {
	var result = true;
	document.getElementById(passwordSpanID).innerHTML = "";
	var lenPassword = password.length;
	//The following regex finds special characters example,@# et al.
	var specialCharacter = /^[!@#$%^&*()+=-_`~;,.<>?'":|{}[]\]*$/; 
	//The following regex finds aplhabets a-z(lower case) and A-Z(upper case).
	var alphabets = /^[a-zA-Z]*$/;
	//The following regex finds digits.
	var digits = /^[0-9]*$/;
	var spclCharExist = false;
	var alphabetExist = false;
	var digitExist = false;
	var MIN_LENGTH = 10;
	var MAX_LENGTH = 128;
	if(lenPassword < 1 || password === undefined || password === null || password === ""){
		uLoginValidation.setHTMLValue(passwordSpanID, getUiProps().MSG0174);
		//uLoginValidation.showErrorIcon("#" + passwordID);
		result = false;
	}else if(lenPassword < MIN_LENGTH){
		uLoginValidation.setHTMLValue(passwordSpanID, getUiProps().MSG0171);
		if(passwordID == "txtCreateNewUserPassword"){
			//uLoginValidation.showErrorIcon("#" + passwordID);
		}else if(passwordID == "txtPassSettingsNewPassword"){
			//uLoginValidation.showErrorBigIcon("#" + passwordID);
		}
		result = false;
	}else if(lenPassword > MAX_LENGTH){
		uLoginValidation.setHTMLValue(passwordSpanID, getUiProps().MSG0122);
		if(passwordID == "txtCreateNewUserPassword"){
			//uLoginValidation.showErrorIcon("#" + passwordID);
		}else if(passwordID == "txtPassSettingsNewPassword"){
			//uLoginValidation.showErrorBigIcon("#" + passwordID);
		}
		result = false;
	}else if(password.indexOf(userName) != -1){
		uLoginValidation.setHTMLValue(passwordSpanID, getUiProps().MSG0173);
		if(passwordID == "txtCreateNewUserPassword"){
			//uLoginValidation.showErrorIcon("#" + passwordID);
		}else if(passwordID == "txtPassSettingsNewPassword"){
			//uLoginValidation.showErrorBigIcon("#" + passwordID);
		}
		result = false;
	}
	else{	
		for(var index = 0; index < lenPassword; index++){
			if(password.substring(index, index+1).match(specialCharacter)){
				spclCharExist = true;
				break;
			}
		}
		for(var index = 0; index < lenPassword; index++){
			if(password.substring(index, index+1).match(alphabets)){
				alphabetExist = true;
				break;
			}
		}
		for(var index = 0; index < lenPassword; index++){
			if(password.substring(index, index+1).match(digits)){
				digitExist = true;
				break;
			}
		}
		if(!(spclCharExist && alphabetExist && digitExist)){
			uLoginValidation.setHTMLValue(passwordSpanID, getUiProps().MSG0172);
			if(passwordID == "txtCreateNewUserPassword"){
				//uLoginValidation.showErrorIcon("#" + passwordID);
			}else if(passwordID == "txtPassSettingsNewPassword"){
				//uLoginValidation.showErrorBigIcon("#" + passwordID);
			}
			result = false;
		}
	}
	if(result){
		if(passwordID == "txtCreateNewUserPassword"){
			//uLoginValidation.showValidValueIcon("#" + passwordID);
		}else if(passwordID == "txtPassSettingsNewPassword"){
			//uLoginValidation.showValidValueBigIcon("#" + passwordID);
		}
	}
	return result;
};

/**
 * The purpose of this function is to validate retype password.
 * 
 * @param retypePassword
 * @param retypePasswordSpanID
 * @param password
 * @returns {Boolean}
 */
login_validation.prototype.validateRetypePassword = function(
		retypePassword, retypePasswordSpanID, password, retypePasswordID) {
	document.getElementById(retypePasswordSpanID).innerHTML = "";
	var isRetypePasswordValid = false;
	var lenRetypePassword = retypePassword.length;
	var lenPassword = password.length;
	if (lenRetypePassword == 0) {
		document.getElementById(retypePasswordSpanID).innerHTML = getUiProps().MSG0164;
		//uLoginValidation.showErrorIcon("#" + retypePasswordID);
		isRetypePasswordValid = false;
	} else if (lenRetypePassword != lenPassword) {
		document.getElementById(retypePasswordSpanID).innerHTML = getUiProps().MSG0024;
		if(retypePasswordID == "txtCreateNewUserRetypePassword"){
			//uLoginValidation.showErrorIcon("#" + retypePasswordID);
		}else if(retypePasswordID == "txtPassSettingsRetypePassword"){
			//uLoginValidation.showErrorBigIcon("#" + retypePasswordID);
		}
		isRetypePasswordValid = false;
	} else if (lenRetypePassword != 0 && lenPassword != 0
			&& retypePassword != password) {
		document.getElementById(retypePasswordSpanID).innerHTML = getUiProps().MSG0024;
		if(retypePasswordID == "txtCreateNewUserRetypePassword"){
			//uLoginValidation.showErrorIcon("#" + retypePasswordID);
		}else if(retypePasswordID == "txtPassSettingsRetypePassword"){
			//uLoginValidation.showErrorBigIcon("#" + retypePasswordID);
		}
		isRetypePasswordValid = false;
	} else {
		if(retypePasswordID == "txtCreateNewUserRetypePassword"){
			//uLoginValidation.showValidValueIcon("#" + retypePasswordID);
		}else if(retypePasswordID == "txtPassSettingsRetypePassword"){
			//uLoginValidation.showValidValueBigIcon("#" + retypePasswordID);
		}
		isRetypePasswordValid = true;
	}
	return isRetypePasswordValid;
};

/**
 * The purpose of this method is to show valid value icon in input text boxes.
 * @param txtID
 */
login_validation.prototype.showValidValueIcon = function (txtID) {
	$(txtID).removeClass("errorIcon");	
	$(txtID).addClass("validValueIcon");
};

/**
 * The purpose of this method is to show error value icon in input text boxes.
 * @param txtID
 */
login_validation.prototype.showErrorIcon = function (txtID) {
	$(txtID).removeClass("validValueIcon");
	$(txtID).addClass("errorIcon");	
};

/**
 * The purpose of this method is to show valid value icon in big input text boxes.
 * @param txtID
 */
login_validation.prototype.showValidValueBigIcon = function (txtID) {
	$(txtID).removeClass("errorIconBig");	
	$(txtID).addClass("validValueIconBig");
};

/**
 * The purpose of this method is to show error value icon in big input text boxes.
 * @param txtID
 */
login_validation.prototype.showErrorBigIcon = function (txtID) {
	$(txtID).removeClass("validValueIconBig");
	$(txtID).addClass("errorIconBig");	
};

/**
 * The purpose of this method is to perform first time password reset operation
 * for new user.
 */
login_validation.prototype.firstTimePasswordReset = function() {
	var tempPassword = $("#tempPassword").val();
	var newPassword = $("#newPassword").val();
	var newRetypePassword = $("#newRetypePassword").val();
	var tempPasswordSpanID = "spanTempPassword";
	var newPasswordSpanID = "spanNewPassword";
	var newRetypePasswordSpanID = "spanNewRetypePassword";
	var userName = firstTimeUserName;
	document.getElementById(newRetypePasswordSpanID).innerHTML = "";
	uLoginValidation.validateTempPassword(tempPasswordSpanID, userName, tempPassword, newPasswordSpanID,
			newRetypePassword, newRetypePasswordSpanID, newPassword);
};

/**
 * The purpose of this method is to perform server side validation for temporary password.
 */
login_validation.prototype.validateTempPassword = function(tempPasswordSpanID,
		username, tempPassword, newPasswordSpanID, newRetypePassword,
		newRetypePasswordSpanID, newPassword) {
	var operation = "VALIDATE_TEMP_PASSWORD";
	var CSRFTokenFirstTimeResetPassword = document
			.getElementById("CSRFTokenFirstTimeResetPassword").value;
	if (tempPassword.length > 0) {
		$("#" + tempPasswordSpanID).html("");
		$
				.ajax({
					data : {
						operation : operation,
						username : username,
						tempPassword : tempPassword,
						CSRFTokenFirstTimeResetPassword : CSRFTokenFirstTimeResetPassword
					},

					url : './MailServlet',
					dataType : 'json',
					type : 'POST',
					async : false,
					cache : false,
					success : function(jsonData) {
						if (jsonData['sessionTimeOut'] == "sessionTimeOut") {
							window.location.href = firstTimeUserContextRoot;
						} else if (jsonData['isPasswordExist'] == true) {
							if (uLoginValidation.validatePassword(newPassword,
									newPasswordSpanID, username, "newPassword")) {
								document.getElementById(newPasswordSpanID).innerHTML = "";
								if (uLoginValidation.validateRetypePassword(
										newRetypePassword,
										newRetypePasswordSpanID, newPassword,
										"newRetypePassword")) {
									document
											.getElementById(newRetypePasswordSpanID).innerHTML = "";
									uLoginValidation.postNewPassword(username,
											newPassword, true);
								}
							}
						} else if (jsonData['isPasswordExist'] == false) {
							document.getElementById(tempPasswordSpanID).innerHTML = getUiProps().MSG0401;
							// uLoginValidation.showErrorIcon("#tempPassword");
						}
					},
					error : function() {
					}
				});
	} else {
		document.getElementById(tempPasswordSpanID).innerHTML = getUiProps().MSG0402;
		// uLoginValidation.showErrorIcon("#tempPassword");
	}

};

/**
 * The purpose of this function is to post new password for a user to the
 * server.
 * 
 * @param userName
 * @param newPassword
 */
login_validation.prototype.postNewPassword = function(userName,
		newPassword) {
	var operation = "PASSWORD_SETTINGS";
	var CSRFTokenPassword = document.getElementById("CSRFTokenFirstTimeResetPassword").value;
	$.ajax({
		data : {
			operation : operation,
			userName : userName,
			newPassword : newPassword,
			CSRFTokenPassword : CSRFTokenPassword
		},
		dataType : 'json',
		url : './AdministratorManagement',
		type : 'POST',
		/*beforeSend: function (xhr) {
			xhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
				xhr.setRequestHeader("Pragma", "no-cache");
				xhr.setRequestHeader("Expires", 0);
			},*/
		async : false,
		cache : false,
		success : function(jsonData) {
			if (jsonData['sessionTimeOut'] == "sessionTimeOut") {
				window.location.href = firstTimeUserContextRoot;
			} else if (jsonData['passwordUpdateStatus'] == true) {
				/*uLoginValidation.displayNotificationMessage(
						"PASSWORD_SETTINGS", "changePassAdminMgmntModal");*/
					window.location.href = firstTimeUserContextRoot + '/templates/'+sessionStorage.firstTimeUserSelectedLanguage+'/home.jsp';
			}
		},
		error : function() {
		}
	});
};

/**
 * The purpose of this function is to read contents of terms
 * and condition file.
 * @param fileName
 * @param callback
 */
login_validation.prototype.readTermsAndConditionFile = function(fileName, callback) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState != 4)  { return; }
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				var fileText = xmlhttp.responseText;
				
				if (fileText.length > 0) {
					callback(fileText);
				} else {
					//$(".divInnerSignUp ").scrollTop(1000);
					document.getElementById("dvTermsAndCondition").innerHTML = getUiProps().MSG0403;
				}
				
			} else if (xmlhttp.status == 404) {
				//$(".divInnerSignUp ").scrollTop(1000);
				document.getElementById("dvTermsAndCondition").innerHTML = getUiProps().MSG0404;
			}
		}
	};
	xmlhttp.open("GET", fileName, true);
	xmlhttp.send(null);
};

/**
 * This method redirects to the login page.
 */
login_validation.prototype.redirectLoginPage = function() {
	var operation = "RESET_LASTLOGIN_AT";
	var CSRFTokenResetLastLogin = document.getElementById("CSRFTokenResetLastLogin").value;
	var userName = firstTimeUserName;
	$.ajax({
		data : {
			operation : operation,
			userName : userName,
			CSRFTokenResetLastLogin : CSRFTokenResetLastLogin
		},
		dataType : 'json',
		url : './MailServlet',
		type : 'POST',
		async : false,
		cache : false,
		success : function(jsonData) {
			if (jsonData['sessionTimeOut'] == "sessionTimeOut") {
				window.location.href = firstTimeUserContextRoot;
			} else if (jsonData['isLastLoginUpdateSuccess'] == true) {
				window.location.href = firstTimeUserContextRoot;
			}
		},
		error : function() {
		}
	});
};

/**
 * This method redirects to the login page.
 */
login_validation.prototype.agreeAndProceed = function() {
	uLoginValidation.updateTermsAndCondition();
	$("#divTermsAndConditionsFirstTime").hide();
	$("#lblFirstTimeUserFullName").text(firstTimeUserFullName + ",");
	$("#divResetPassword").show();
};

/**
 * The purpose of this method is to set value of any html component
 * @param id
 * @param value
 */
login_validation.prototype.setHTMLValue = function(id, value){
	document.getElementById(id).innerHTML = value;
};

/**
 * This method update terms and condition field in database.
 */
login_validation.prototype.generateAutoPassword = function() {
	var password = "";
	//var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*_-";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var numbers = "0123456789";
	var specialCharacters = "!@#$%&*_-";
	for( var i=0; i < 7; i++ ) {
		password += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	for( var k=0; k < 2; k++ ) {
		password += specialCharacters.charAt(Math.floor(Math.random() * numbers.length));
	}
	for( var j=0; j < 3; j++ ) {
		password += numbers.charAt(Math.floor(Math.random() * specialCharacters.length));
	}
	return password;
};

/**
 * This method send forget password mail to user.
 */
login_validation.prototype.ForgetPasswordMail = function() {
	document.getElementById("spanForgotPassword").innerHTML = "";
	var userName = $("#txtboxForgotPassword").val();
	var password = uLoginValidation.generateAutoPassword();
	var operation = "FORGET_PASSWORD";
	var CSRFTokenForgetPassword = document.getElementById("CSRFTokenForgotPassword").value;
	if (userName.length > 0) {
		$.ajax({
			data : {
				operation : operation,
				userName : userName,
				newPassword : password,
				CSRFTokenForgetPassword : CSRFTokenForgetPassword
			},
					url : './MailServlet',
					dataType : 'json',
					type : 'POST',
					async : false,
					cache : false,
					success : function(jsonData) {
						if (jsonData['sessionTimeOut'] == "sessionTimeOut") {
							window.location.href = forgotPassContextRoot;
						} else if (jsonData['forgetPasswordMail'] == "forgetPasswordMailSentSuccess") {
							$("#dvForgotPasswordInput").hide();
							$("#dvForgotPasswordSuccess").show();
						} else if (jsonData['forgetPasswordMail'] == "forgetPasswordMailSentFailure") {
							$("#dvForgotPasswordInput").hide();
							$("#dvForgotPasswordSuccess").show();
							document.getElementById("spanForgotPassword").innerHTML = "Error while sending mail. Please try again.";
						} else if (jsonData['forgetPasswordMail'] == "userNotFound") {
							document.getElementById("spanForgotPassword").innerHTML = "Please enter valid username";
						}
					},
					error : function() {
					}
				});
	} else {
		document.getElementById("spanForgotPassword").innerHTML = "Please enter username";
	}
	
};

/**
 * This method update terms and condition field in database.
 */
login_validation.prototype.updateTermsAndCondition = function() {
	var operation = "SET_TERMS_AND_CONDITION";
	var CSRFTokenResetLastLogin = document.getElementById("CSRFTokenResetLastLogin").value;
	var userName = firstTimeUserName;
	$.ajax({
		data : {
			operation : operation,
			userName : userName,
			CSRFTokenResetLastLogin : CSRFTokenResetLastLogin
		},
		dataType : 'json',
		url : './MailServlet',
		type : 'POST',
		async : false,
		cache : false,
		success : function(jsonData) {
			if (jsonData['sessionTimeOut'] == "sessionTimeOut") {
				window.location.href = firstTimeUserContextRoot;
			} else if (jsonData['isTermsAndConditionUpdateSuccess'] == true) {
			}
		},
		error : function() {
		}
	});
};