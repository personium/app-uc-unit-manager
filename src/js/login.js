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
				$.ajax({
					dataType : 'json',
					url : unitCellUrl + '__token' ,//+ tokenUrl,
					data : {
			                        grant_type: "password",
						username  : $("#userId").val(),
			                        password  : $("#passwd").val(),
						p_target : $("#unitUrl").val()
					},
					type : 'POST',
					async : false,
					cache : false,
					success : function(jsonData) {
						localStorage.setItem("clickedEnvironmentUnitUrl", $("#unitUrl").val());
						localStorage.setItem("clickedEnvironmentUnitCellName", $("#unitCellName").val());
						localStorage.setItem("clickedEnvironmentId", $("#userId").val());
						localStorage.setItem("clickedEnvironmentPass", $("#passwd").val());
						sessionStorage.setItem("selectedLanguage", $("#ddLanguageSelector").val());
						var href = location.href.split("/");
						var root = "";
						for (var i=0; i < href.length - 1; i++) {
						    root += href[i] + "/";
						}
						root = root.substr(0, root.length - 1);
						sessionStorage.setItem("contextRoot", root);
	
						window.open('./htmls/'+sessionStorage.selectedLanguage+'/environment.html','_blank');
						//location.href = './htmls/'+sessionStorage.selectedLanguage+'/environment.html';
					},
					error : function(jsonData) {
						document.getElementById("logoutDiv").style.visibility = "visible";
						$("#logoutDiv").addClass("loginErrorMessage");
						$("#logoutMsg").text("Invalid username or password");
					}
				});
			},
			error : function(res) {
				document.getElementById("logoutDiv").style.visibility = "visible";
				$("#logoutDiv").addClass("loginErrorMessage");
				$("#logoutMsg").text("The target unitcell does not exist.");
			}
		});
	}
}