# Unit/Cell Manager  
Unit Manager and Cell ManagerはPersoniumのセル単位での管理を行う事が出来るGUIツールです。  

- Unit Manager - Personium Unit配下のセル（複数）  
- Cell Manager - 一般セル

## 必要な情報  

1. Personium Unitもしくは一般セル  
1. セル名（Unitセルもしくは一般セル）  
1. 上記のセルの管理者アカウントのログイン情報（ID/パスワード）  

## セットアップ  
Personium Project's Unit/Cell Managerを使いたい場合、下記のURLにアクセスしてください。   

    https://demo.personium.io/app-uc-unit-manager/__/html/login.html

Unit/Cell ManagerはWebサーバーに配置するだけで使用する事が出来ます。  
例： [1-server unit](https://github.com/personium/ansible/blob/master/1-server_unit/1-server_unit.jpg)を構築した方はモジュールをNginxサーバフォルダにuploadしてください。

## アクセス手順  

1. 以下にアクセスする  

        {配置したUnitManagerのURL}/login.html

## 操作方法  
  
以下にフォルダの作成、ファイルのアップロードを行い、ファイルとフォルダを削除する手順を示します。  

[YouTube デモビデオ](https://youtu.be/d1_pET0M-YA)  

1. 必要な情報を入力し、Unit/Cell Managerにログイン。  
1. [main]をクリックしてmain boxの配下を表示。   
1. "Create"ボタン上にホバーし、表示されたポップアップメニューの"Folder"を選択。  
"Create Folder"ダイアログが表示される。  
1. フォルダ名を入力し、右下の「create」ボタンをクリック。  
1. 新規作成したフォルダのアンカーをクリックして、フォルダの配下を表示。  
1. "Upload"ボタンをクリックして、ファイルをupload。  
1. Uploadしたファイルをチェックし、ゴミ箱アイコンをクリックしてファイルを削除。  
1. パンくずリストでmain boxの配下に戻る。  
1. 作成したフォルダをチェックし、ゴミ箱アイコンをクリックしてフォルダを削除。  

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
