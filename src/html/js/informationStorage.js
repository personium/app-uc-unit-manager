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
var clientStore;
var uiProps;


function getClientStore() {
	return clientStore;
}

function setClientStore(jsonData) {
	clientStore = jsonData;
}

function getUiProps() {
	return uiProps;
}

function setUiProps(props) {
	uiProps = props;
}

function showRightContainer() {
	if (document.getElementById("rightContainer")!=null) {
	document.getElementById("rightContainer").style.display = "inline-block";
	}
}

function hideCellListView() {
	$("#cellListPanel").hide();  
}

function loadCellList() {
	sessionStorage.tabName = "";
	var contextRoot = sessionStorage.contextRoot;
	var target = document.getElementById('dvCellListContainer');
	var spinner = new Spinner(objCommon.opts).spin(target);
	// Code for Spinner START.
	$("#dvCellListContainer").load(contextRoot + '/templates/'+sessionStorage.selectedLanguage+'/cellListView.html', function(){
	});

	spinner.stop();
	// Code for Spinner END.
} 
