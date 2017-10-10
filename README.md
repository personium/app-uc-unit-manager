# Cell Manager  
Cell Manager is a GUI tool that helps you manage Personium cell(s).  

- Cells within a Personium Unit  
- Cell belong to a user/organization  

## Prerequisites  
In order to use the Cell Manager, make sure you have the following ready.  

1. A valid Personium Unit or Cell  
1. Cell name (Unit Cell or general Cell)  
1. Login information (ID/passowrd) of the admin user of the above Cell 

## Installation  
No installation or compilation, you only need to upload the modules to your web server.  
For example, if you have constructed your own [1-server unit](https://github.com/personium/ansible/blob/master/1-server_unit/1-server_unit.jpg), you can upload the modules to your Nginx's server folder.  

## How to access  
1. Access the login.html file.  
E.g. Your web server is running on port 8000 and you put the files under cell-manager.  

        http://localhost:8000/cell-manager/login.html

## A simple use case  
Perform the following procedures to create a folder and upload a file to the folder. Then, delete the file and the folder.  

[Demo video on YouTube](https://youtu.be/d1_pET0M-YA)  

1. Logon to the Cell Manager.  
1. Click [main] to show the content of the main box.  
1. Hover over the "Create" button and select "Folder" from the popup menu.  
"Create Folder" dialog will be displayed.  
1. Enter folder name.  
1. Click the "Create" button on the bottom right corner of the dialog.  
1. Click the link of the newly created folder to display the content.  
1. Click "Upload" to upload a file.  
1. Select the file and click the garbage bin icon to delete it.  
1. Go up one folder using the breadcrumb navigation.  
1. Select the folder and click the garbage bin icon to delete it.  


## License  

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    Copyright 2017 FUJITSU LIMITED
