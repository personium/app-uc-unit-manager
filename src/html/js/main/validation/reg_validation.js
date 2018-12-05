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
$(document).ready(function() {
	//$("#ProceedButton").attr("disabled","disabled");
});

var v1 = false;
var v2 = false;
var v3 = false;
var v4 = false;
var v5 = false;
var v6 = false;
var v7 = false;
function validateData(id) {
	var passid = document.registration.cpassd;
	if (id == 'cpassd') {
		var uid = document.getElementById("useridtext").value;
		// v1 = userid_validation(uid);
		v1 = validateUserNameAndPassword(uid, passid);
	}
	if (id == 'crpassd') {
		v2 = passid_empty_validation(passid);
	}
	if (id == 'cfName') {
		var rpassid = document.registration.crpassd;
		v3 = passid_validation(passid, rpassid);
	}
	if (id == 'cfamilyName') {
		var uname = document.registration.cfName;
		v4 = username_validation(uname);
	}
	if (id == 'coName') {
		var familyName = document.registration.cfamilyName;
		v5 = family_name(familyName);
	}
	if (id == 'cemail') {
		var orgName = document.registration.coName;
		v6 = org_name(orgName);
		//var uemail = document.registration.cemail;
		//ValidateEmail(uemail);
	}

	/*if(id=='coName'){
		var orgName = document.registration.coName;
		v6=org_name(orgName);
		
	}*/

	/*if(v1==true && v2==true && v3==true && v4==true && v5==true && v6==true){
		//alert("regUserId>>"+v1+"="+v2+"="+v3+"="+v4+"="+v5+"="+v6+"");
		$("#ProceedButton").removeAttr("disabled");
		return true;
	}*/
	/*
	
	var passid = document.registration.cpassd;
	if(id=='cid'){
		var uid = document.registration.cid;
		v1=userid_validation(uid);
	}
	if(id=='cpassd'){
		v2=passid_empty_validation(passid);
		}
	if(id=='crpassd'){
		var rpassid = document.registration.crpassd;
		v3= passid_validation(passid,rpassid);
	}
	if(id=='cfName'){
		var uname = document.registration.cfName;
		v4= username_validation(uname);
	}
	if(id=='cemail'){
		var uemail = document.registration.cemail;
		v5=ValidateEmail(uemail);
	}
	if(id=='cfamilyName'){
		var familyName = document.registration.cfamilyName; 
		v6=family_name(familyName);
	}
	if(id=='coName'){
		var orgName = document.registration.coName;
		v7=org_name(orgName);
		
	}
	if(v1==true && v2==true && v3==true && v4==true && v5==true && v6==true && v7==true){
		alert("regUserId>>"+v1+"="+v2+"="+v3+"="+v4+"="+v5+"="+v6+"="+v7+"");
		$("#ProceedButton").removeAttr("disabled");
		return true;
	}
	 */}

function formValidation(f) {
	var uid = document.getElementById("useridtext").value;
	var passid = document.registration.cpassd;
	var rpassid = document.registration.crpassd;
	var uname = document.registration.cfName;
	var uemail = document.registration.cemail;
	var familyName = document.registration.cfamilyName;
	var orgName = document.registration.coName;

	if (userid_validation(uid)) {
		if (passid_empty_validation(passid)) {
			if (passid_validation(passid, rpassid)) {
				if (username_validation(uname)) {
					if (family_name(familyName)) {
						if (org_name(orgName)) {
							if (ValidateEmail(uemail, f)) {
							}
						}
					}
				}
			}
		}
	}

	return true;
}

function userid_validation(uid) {
	var userid_len;
	if (uid == 'undefined' || uid == "") {
		userid_len = 0;
	} else {
		userid_len = uid.length;
	}

	var specialchar = /^[!@#$%^&*()+=-_`~;,.<>?'":|{}[]\]*$/;
	var letters = /^[0-9a-zA-Z-_]+$/;

	if (userid_len == 0) {
		document.getElementById("userspanid").innerHTML = "<font color=red>Please enter username";
		//$("#ProceedButton").attr("disabled","disabled");
		//uid.style.background = 'khaki';
		return false;
	} else if ((userid_len < 1) || (userid_len > 128)) {
		document.getElementById("userspanid").innerHTML = "<font color=red>The maximum length of user id cannot exceed 128 characters";
		//$("#ProceedButton").attr("disabled","disabled");
		//uid.style.background = 'khaki';
		return false;
	} else if (userid_len != 0 && !(uid.match(letters))) {
		document.getElementById("userspanid").innerHTML = "<font color=red>Only '-' and '_' are allowed</font>";
		//uid.style.background = 'khaki';
		return false;
	} else if (userid_len != 0
			&& (specialchar.toString().indexOf(uid.substring(0, 1)) >= 0)) {
		document.getElementById("userspanid").innerHTML = "<font color=red>The user id cannot start with special characters";
		//$("#ProceedButton").attr("disabled","disabled");
		//uid.style.background = 'khaki';
		return false;
	} else {
		//uid.style.background = 'White';
		document.getElementById("userspanid").innerHTML = "";
		return true;
	}

}

function passid_empty_validation(passid) {
	var passid_len1 = 0;
	var password = passid.value;
	if (passid == 'undefined' || passid == "") {
		passid_len1 = 0;
	} else {
		passid_len1 = passid.value.length;
	}
	var result = true;
	document.getElementById("passspanid").innerHTML = "";
	var specialCharacter = /^[!@#$%^&*()+=-_`~;,.<>?'":|{}[]\]*$/;
	var alphabets = /^[a-zA-Z]*$/;
	var digits = /^[0-9]*$/;
	var spclCharExist = false;
	var alphabetExist = false;
	var digitExist = false;
	var MIN_LENGTH = 10;
	var MAX_LENGTH = 128;
	var userName = document.getElementById("useridtext").value;
	if (passid_len1 < 1 || password === undefined || password === null
			|| password === "") {
		document.getElementById("passspanid").innerHTML = "Password cannot be blank";
		result = false;
	} else if (passid_len1 < MIN_LENGTH) {
		document.getElementById("passspanid").innerHTML = "Password length must not be less than ten characters";
		result = false;
	} else if (passid_len1 > MAX_LENGTH) {
		document.getElementById("passspanid").innerHTML = "The maximum length of password cannot exceed 128 characters";
		result = false;
	} else {
		for ( var index = 0; index < passid_len1; index++) {
			if (password.substring(index, index + 1).match(specialCharacter)) {
				spclCharExist = true;
				break;
			}
		}
		for ( var index = 0; index < passid_len1; index++) {
			if (password.substring(index, index + 1).match(alphabets)) {
				alphabetExist = true;
				break;
			}
		}
		for ( var index = 0; index < passid_len1; index++) {
			if (password.substring(index, index + 1).match(digits)) {
				digitExist = true;
				break;
			}
		}
		if (!(spclCharExist && alphabetExist && digitExist)) {
			document.getElementById("passspanid").innerHTML = "Password must be a combination of alphabets, special characters and numbers";
			result = false;
		}
	}
	if (result) {
		if (userName != "" && userName != undefined) {
			if (password.indexOf(userName) != -1) {
				document.getElementById("passspanid").innerHTML = "Password cannot contain username in it";
				result = false;
			}
		}
	}
	return result;
}

function passid_validation(passid, rpassid) {

	var passid_len;
	var rpassid_len;
	if (passid == 'undefined' || passid == "") {
		passid_len = 0;
	} else {
		passid_len = passid.value.length;
	}
	if (rpassid == 'undefined' || rpassid == "") {
		rpassid_len = 0;
	} else {
		rpassid_len = rpassid.value.length;
	}

	if (rpassid_len == 0) {
		document.getElementById("repassspanid").innerHTML = "<font color=red>Please retype password";
		//$("#ProceedButton").attr("disabled","disabled");
		//rpassid.style.background = 'khaki';
		return false;
	} else if (passid_len == 0 || rpassid_len == 0
			|| passid.value != rpassid.value) {
		document.getElementById("repassspanid").innerHTML = "<font color=red>Retype Password does not match with password entered";
		//$("#ProceedButton").attr("disabled","disabled");
		//rpassid.style.background = 'khaki';
		return false;
	}
	//rpassid.style.background = 'White';
	document.getElementById("repassspanid").innerHTML = "";
	return true;
}

function username_validation(uname) {
	//$(function(){ $('firstnameid').css('visibility','hidden');});

	var specialchar = /^[!@#$%^&*()+=-_`~;,.<>?'":|{}[]\]*$/;

	var unamelen;
	if (uname == 'undefined' || uname == "") {
		unamelen = 0;
	} else {
		unamelen = uname.value.length;
	}

	if (unamelen == 0) {
		document.getElementById("firstnameid").innerHTML = "<font color=red>Please enter first name";
		//	$("#ProceedButton").attr("disabled","disabled");
		//uname.style.background = 'khaki';
		return false;
	} else if ((uname.value.length < 1) || (uname.value.length > 128)) {
		document.getElementById("firstnameid").innerHTML = "<font color=red>The maximum length of first name cannot exceed 128 characters";
		//$("#ProceedButton").attr("disabled","disabled");
		//uname.style.background = 'khaki';
		return false;
	} else if (uname.value.length != 0
			&& (specialchar.toString().indexOf(uname.value.substring(0, 1)) >= 0)) {
		document.getElementById("firstnameid").innerHTML = "<font color=red>The first name cannot start with special characters";
		//$("#ProceedButton").attr("disabled","disabled");
		//uname.style.background = 'khaki';
		return false;
	} else if (!uname.value.replace(/\s/g, '').length) {
		$('#cfNameid').val('');
		document.getElementById("firstnameid").innerHTML = "<font color=red>Please enter first name";
		//$("#ProceedButton").attr("disabled","disabled");
		//uname.style.background = 'khaki';
		return false;
	} else {
		uname.style.background = 'White';
		document.getElementById("firstnameid").innerHTML = "";
		return true;
	}
	//$(function(){ $('firstnameid').css('visibility','hidden');});
}

function family_name(familyName) {
	//var regx = /^[0-9a-zA-Z!@#$%^&*()+=-_`~;,.<>?'":|{}[]\]+$/;
	//var specialchar = /^[!@#$%^&*()]*$/;
	var familyNamelen;
	if (familyName == 'undefined' || familyName == "") {
		familyNamelen = 0;
	} else {
		familyNamelen = familyName.value.length;
	}
	var specialchar = /^[!@#$%^&*()+=-_`~;,.<>?'":|{}[]\]*$/;

	if (familyNamelen == 0) {
		document.getElementById("familynameid").innerHTML = "<font color=red>Please enter family name";
		//$("#ProceedButton").attr("disabled","disabled");
		//familyName.style.background = 'khaki';
		return false;
	} else if ((familyName.value.length < 1) || (familyName.value.length > 128)) {
		document.getElementById("familynameid").innerHTML = "<font color=red>The maximum length of family name cannot exceed 128 characters";
		//$("#ProceedButton").attr("disabled","disabled");
		//familyName.style.background = 'khaki';
		return false;
	} else if (familyName.value.length != 0
			&& (specialchar.toString()
					.indexOf(familyName.value.substring(0, 1)) >= 0)) {
		document.getElementById("familynameid").innerHTML = "<font color=red>The family name cannot start with special characters";
		//$("#ProceedButton").attr("disabled","disabled");
		//familyName.style.background = 'khaki';
		return false;
	} else if (!familyName.value.replace(/\s/g, '').length) {
		$('#cfamilyNameid').val('');
		document.getElementById("familynameid").innerHTML = "<font color=red>Please enter family name";
		//$("#ProceedButton").attr("disabled","disabled");
		//familyName.style.background = 'khaki';
		return false;
	} else {
		familyName.style.background = 'White';
		document.getElementById("familynameid").innerHTML = "";
		return true;
	}
}

function org_name(orgName) {
	//var letters = /^[A-Za-z]+$/;
	var orgNamelen;
	if (orgName == 'undefined' || orgName == "") {
		orgNamelen = 0;
	} else {
		orgNamelen = orgName.value.length;
	}
	var specialchar = /^[!@#$%^&*()+=-_`~;,.<>?'":|{}[]\]*$/;

	if (orgNamelen == 0) {
		document.getElementById("orgspanid").innerHTML = "<font color=red>Please enter organization name";
		//$("#ProceedButton").attr("disabled","disabled");
		//orgName.style.background = 'khaki';
		return false;
	} else if ((orgName.value.length < 1) || (orgName.value.length > 128)) {
		document.getElementById("orgspanid").innerHTML = "<font color=red>The maximum length of organization name cannot exceed 128 characters";
		//$("#ProceedButton").attr("disabled","disabled");
		//orgName.style.background = 'khaki';
		return false;
	} else if (orgName.value.length != 0
			&& (specialchar.toString().indexOf(orgName.value.substring(0, 1)) >= 0)) {
		document.getElementById("orgspanid").innerHTML = "<font color=red>The organization name cannot start with special characters";
		//$("#ProceedButton").attr("disabled","disabled");
		//orgName.style.background = 'khaki';
		return false;
	} else if (!orgName.value.replace(/\s/g, '').length) {
		$('#coNameid').val('');
		document.getElementById("orgspanid").innerHTML = "<font color=red>Please enter organization name";
		//$("#ProceedButton").attr("disabled","disabled");
		//orgName.style.background = 'khaki';
		return false;
	} else {
		orgName.style.background = 'White';
		document.getElementById("orgspanid").innerHTML = "";
		return true;
	}
}

function ValidateEmail(uemail) {
	var uemaillen;
	if (uemail == 'undefined' || uemail == "") {
		uemaillen = 0;
	} else {
		uemaillen = uemail.value.length;
	}
	
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	if (uemaillen == 0) {
		document.getElementById("emailspanid").innerHTML = "<font color=red>Please enter email";
		//$("#ProceedButton").attr("disabled","disabled");
		//uemail.style.background = 'khaki';
		return false;
	} else if (uemail.value.length != 0 && !uemail.value.match(mailformat)) {
		document.getElementById("emailspanid").innerHTML = "<font color=red>Please enter a valid email address";
		//$("#ProceedButton").attr("disabled","disabled");
		//uemail.style.background = 'khaki';
		return false;
	} else {
		uemail.style.background = 'white';
		document.getElementById("emailspanid").innerHTML = "";
		return true;
	}
	return true;
	//(FillBilling(f));
}
function ValidateEmail(uemail, f) {
	var uemaillen;
	if (uemail == 'undefined' || uemail == "") {
		uemaillen = 0;
	} else {
		uemaillen = uemail.value.length;
	}
	var emailID = uemail.value;
	var specialchar = /^[-_]*$/;
	var query = emailID.indexOf("@");
	var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

	if (uemaillen == 0) {
		document.getElementById("emailspanid").innerHTML = "<font color=red>Please enter email";
		//$("#ProceedButton").attr("disabled","disabled");
	//	uemail.style.background = 'khaki';
		return false;
	} else if (uemail.value.length != 0 && !uemail.value.match(mailformat)) {
		document.getElementById("emailspanid").innerHTML = "<font color=red>Please enter a valid email address";
		//$("#ProceedButton").attr("disabled","disabled");
		//uemail.style.background = 'khaki';
		return false;
	}  else if (uemail.value.length != 0 && (specialchar.toString().indexOf(emailID.substring(0,1)) >= 0)) {
		document.getElementById("emailspanid").innerHTML = "<font color=red>Please enter a valid email address";
		//$("#ProceedButton").attr("disabled","disabled");
		//uemail.style.background = 'khaki';
		return false;
	} else {
		uemail.style.background = 'white';
		document.getElementById("emailspanid").innerHTML = "";
		//return true;
	} 
	if (query != -1) {
		var digits = /^[0-9]+$/;
		var onlyNumbers = emailID.substring(0, query);
		var firstCharacter = emailID.substring(0, 1);
		if(uemail.value.length != 0 && (onlyNumbers.match(digits))){
			document.getElementById("emailspanid").innerHTML = "<font color=red>Please enter a valid email address";
			//uemail.style.background = 'khaki';
			return false;
		} else if (uemail.value.length != 0 && (firstCharacter.match(digits))) {
			document.getElementById("emailspanid").innerHTML = "<font color=red>Please enter a valid email address";
			//uemail.style.background = 'khaki';
			return false;
		}
	} 
	(FillBilling(f));
	return true;

}

function FillBilling(f) {
	if (document.getElementById("confirm").style.display == "block") {
		document.getElementById("confirm").style.display = "none";
		document.getElementById("register").style.display = "block";
	} else {

		document.getElementById("confirm").style.display = "none";
		document.getElementById("register").style.display = "block";
	}

	f.rid.value = f.cid.value;
	f.rpassd.value = f.cpassd.value;
	f.rrpassd.value = f.crpassd.value;
	f.rfName.value = f.cfName.value;
	f.rfamilyName.value = f.cfamilyName.value;
	f.roName.value = f.coName.value;
	f.remail.value = f.cemail.value;
}

/**
 * The purpose of the following method is to validate user name and password.
 * @param uid
 * @param passid
 */
function validateUserNameAndPassword(uid, passid) {
	userid_validation(uid);
	passid_empty_validation(passid);
}