# Unit/Cell Manager  

# 概要
Unit Manager and Cell ManagerはPersoniumのセル単位での管理を行う事が出来るGUIツールです。  

| Name | Contents |
|---|---|
| Unit Manager  | Personium Unit 上のセルを管理するGUIツールです。  ユニットユーザーを利用することでユニットに存在するすべてのセルに対する操作が可能です。|
| Cell Manager  | ユーザーセルにセットアップし、セットアップされたセルを管理するGUIツールです。|

## セットアップ  

### Unit Manager セットアップ手順

本書ではUnit Manager のセットアップ手順を説明します。
Cell Manager を利用したい方は[Cell Managerセットアップ手順](.setup_cell-manager_ja.md)を参照してください。
この手順では以下の情報を使用します。環境に合わせて修正してください。

* {UnitFQDN}　　 ：Personium Unit URL
* {AccessToken}　：トランスセルトークン

1. [unit-manager.zip](https://github.com/personium/app-uc-unit-manager/raw/master/unit-manager.zip) をダウンロードします。
1. [Cell作成API](https://personium.io/docs/ja/apiref/current/100_Create_Cell.html)を実行し、自身のPersonium Unitにapp-uc-unit-managerセルを作成します。

    ```console
    # curl "https://{UnitFQDN}/__ctl/Cell" -X POST -i \
    -H 'Authorization: Bearer {AccessToken}' -H 'Accept: application/json' \
    -d '{"Name":"app-uc-unit-manager"}'
    ```

1. [Cellスナップショットファイル登録更新API](https://personium.io/docs/ja/apiref/current/503_Register_and_Update_Snapshot_Cell.html)を実行し、作成したセルにzipファイルをアップロードします。

    ```console
    # curl \
    "https://app-uc-unit-manager.{UnitFQDN}/__snapshot/app-uc-unit-manager.zip" \
    -X PUT -i -H 'Authorization: Bearer {AccessToken}' \
    -H 'Accept: application/json' \
    -T "{zip格納フォルダ}/app-uc-unit-manager_cell.zip"
    ```

1. [CellインポートAPI](https://personium.io/docs/ja/apiref/current/507_Import_Cell.html)を実行し、セルインポートを実行します。

    ```console
    # curl "https://app-uc-unit-manager.{UnitFQDN}/__import" -X POST -i \
    -H 'Authorization: Bearer {AccessToken}' \
    -d '{"Name":"app-uc-unit-manager"}
    ```

1. [ファイル取得API](https://personium.io/docs/ja/apiref/current/311_Get_WebDav.html)を実行し、login.js ファイルをダウンロードします。

    ```console
    # curl "https://app-uc-unit-manager.{UnitFQDN}/__/html/js/login.js" -X GET \
    -H 'Authorization: Bearer {AccessToken}' -o '/tmp/login.js'
    ```

1. テキストエディタを利用し、login.js を編集します。
    ファイルに記載されているFQDN`demo.personium.io`を自身のPersonium Unit のFQDN に変更してください。  
    \*変更する前は以下のように記載されています。

    * login.js

        ```
        ～～略～～
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

        ～～略～～
        ```

1. [ファイル登録更新API](https://personium.io/docs/ja/apiref/current/312_Register_and_Update_WebDAV.html)を実行し、変更したlogin.js をアップロードします。

    ```console
    # curl "https://app-uc-unit-manager.{UnitFQDN}/__/html/js/login.js" -X PUT \
    -i -H 'Authorization: Bearer {AccessToken}' -H 'Accept: application/json' \
    -T '/tmp/login.js'
    ```

1. 以下のURLにアクセスし、ユニットマネージャが表示されることを確認します。

    https://app-uc-unit-manager.{UnitFQDN}/__/html/login.html

## アクセス手順  

1. 以下にアクセスする。  

        https://app-uc-unit-manager.{UnitFQDN}/__/html/login.html

## 必要な情報  

1. Personium Unitもしくは一般セル  
1. セル名（Unitセルもしくは一般セル）  
1. 上記のセルの管理者アカウントのログイン情報（ID/パスワード） 

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
