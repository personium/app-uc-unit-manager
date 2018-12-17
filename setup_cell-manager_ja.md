# Cell Manager セットアップ手順

本書ではCell Manager のセットアップ手順を説明します。
必要なセルにインストールして利用してください。
なお、Cell Manager を利用する場合は事前にUnit Manager がセットアップされている必要があります。
この手順では以下の情報を使用します。環境に合わせて修正してください。

* {UnitFQDN}　　 ：Personium Unit URL
* {AccessToken}　：トランスセルトークン
* {UserCell}     ：任意のユーザーセル

1. [ファイル取得API](https://personium.io/docs/ja/apiref/current/311_Get_WebDav.html)を実行し、Cell Manager をダウンロードします。

    ```console
    # curl "https://{UnitFQDN}/app-uc-unit-manager/__/cell-manager.bar" -X GET \
    -H 'Authorization: Bearer {AccessToken}' -o '/tmp/cell-manager.zip'
    ```

1. ダウンロードした `cell-manager.zip` を解凍します。  
    
    `cell-manager.zip`を解凍すると以下のファイルが展開されます。

    ```
    00_meta
    ├   00_manifest.json
    └   90_rootprops.xml
    90_contents
    └   src
        └   login.html
    ```

1. bar ディレクトリ内のファイルに含まれるFQDN`demo.personium.io`を自身のPersonium Unit のFQDNに修正します。  
    \*変更する前は以下のように記載されています。

    * 00_mainfast.json

        ```
        {
            "bar_version":"2",
            "box_version":"1",
            "default_path":"cell-manager",
            "schema":"https://demo.personium.io/app-uc-unit-manager/"
        }
        ```

    * 90_rootprops.xml
    
        ```
        <multistatus xmlns="DAV:">
            <response>
                <href>personium-localbox:/</href>
                <propstat>
                    <prop>
                        <creationdate>2018-12-14T10:29:57.585+0900</creationdate>
                        <getlastmodified>Fri, 14 Dec 2018 01:29:57 GMT</getlastmodified>
                        <resourcetype>
                            <collection/>
                        </resourcetype>
                        <acl xml:base="https://demo.personium.io/app-uc-unit-manager/__role/cell-manager/" xmlns:p="urn:x-personium:xmlns"/>
                    </prop>
                    <status>HTTP/1.1 200 OK</status>
                </propstat>
            </response>
            <response>
                <href>personium-localbox:/src</href>
                <propstat>
                    <prop>
                        <creationdate>2018-12-14T10:29:57.850+0900</creationdate>
                        <getlastmodified>Fri, 14 Dec 2018 01:29:57 GMT</getlastmodified>
                        <resourcetype>
                            <collection/>
                        </resourcetype>
                        <acl xml:base="https://demo.personium.io/app-uc-unit-manager/__role/cell-manager/" xmlns:p="urn:x-personium:xmlns">
                            <ace>
                                <principal>
                                    <all/>
                                </principal>
                                <grant>
                                    <privilege>
                                        <D:read xmlns:D="DAV:"/>
                                    </privilege>
                                </grant>
                            </ace>
                        </acl>
                    </prop>
                    <status>HTTP/1.1 200 OK</status>
                </propstat>
            </response>
            <response>
                <href>personium-localbox:/src/login.html</href>
                <propstat>
                    <prop>
                        <creationdate>2018-12-14T10:29:58.115+0900</creationdate>
                        <getcontentlength>20348</getcontentlength>
                        <getcontenttype>text/html</getcontenttype>
                        <getlastmodified>Fri, 14 Dec 2018 01:29:58 GMT</getlastmodified>
                        <resourcetype/>
                        <acl xml:base="https://demo.personium.io/app-uc-unit-manager/__role/cell-manager/" xmlns:p="urn:x-personium:xmlns"/>
                    </prop>
                    <status>HTTP/1.1 200 OK</status>
                </propstat>
            </response>
        </multistatus>
        ```

    * login.html

        ```
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
            <meta http-equiv="Pragma" content="no-cache">
            <meta http-equiv="Expires" content="-1">
            <title>Personium Unit Manager</title>
            <script type="text/javascript"
                    src="https://demo.personium.io/app-uc-unit-manager/__/html/js/main/validation/login_validation.js"></script>
            <!--<script type="text/javascript" src="./login.js"></script>-->
            <script type="text/javascript" src="https://demo.personium.io/app-uc-unit-manager/__/html/js/login.js"></script>
            <script type="text/javascript" src="https://demo.personium.io/app-uc-unit-manager/__/html/js/jquery-1.9.0.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-url-parser/2.3.1/purl.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
            <script type="text/javascript" src="https://demo.personium.io/app-uc-unit-manager/__/html/js/commonFunctions.js"></script>
            <script type="text/javascript" src="https://demo.personium.io/app-uc-unit-manager/__/html/js/jquery.modalbox.js"></script>
            <script type="text/javascript"
                    src="https://demo.personium.io/app-uc-unit-manager/__/html/js/main/validation/reg_validation.js"></script>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link href="https://demo.personium.io/app-uc-unit-manager/__/html/css/loginStylesheet.css" rel="stylesheet" type="text/css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.4.0/css/font-awesome.min.css" />
            ～～｛略｝～～
        ```

1. barディレクトリをzip 形式で圧縮します。  
    \*Windows を利用して圧縮する場合は7z 等を使用して圧縮してください。  
    \*barファイルの詳細については[こちら](https://personium.io/docs/ja/apiref/current/301_Bar_File.html)を参照してください。

1. 圧縮したzipファイルのファイル名を`cell-manager.bar`に変更します。


1. [ファイル登録更新API](https://personium.io/docs/ja/apiref/current/312_Register_and_Update_WebDAV.html)を実行し、bar ファイルをアップロードします。

    ```console
    # curl "https://{UnitFQDN}/app-uc-unit-manager/__/cell-manager.bar" -X PUT \
    -H 'Authorization: Bearer {AccessToken}' -T '/tmp/cell-manager.zip'
    ```

1. [BoxインストールAPI](https://personium.io/docs/ja/apiref/current/302_Box_Installation.html)を実行し、任意のユーザーセルにboxインストールを実行します。

    ```
    # curl "https://{UnitFQDN}/{UserCell}/cell-manager" -X MKCOL -i \
    -H 'Content-type: application/zip' -H 'Authorization: Bearer {AccessToken}' \
    -H 'Accept: application/json' -T "/tmp/cell-manager.bar"
    ```

## アクセス手順  

1. 以下にアクセスします。

    ```
    https://{UnitFQDN}/{UserCell}/cell-manager/src/login.html
    ```

## 必要な情報  

1. セルの管理者アカウントのログイン情報（ID/パスワード）

## 操作方法

操作方法は[Unit Manager](./README_ja.md) と同一です。