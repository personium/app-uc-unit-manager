# Cell Manager 

本書ではCell Manager のセットアップ手順を説明します。
必要なセルにセットアップして利用してください。
なお、Cell Manager を利用する場合は事前にUnit Manager がセットアップされている必要があります。
この手順では以下の情報を使用します。環境に合わせて修正してください。

* {UnitFQDN}　　 ：Personium Unit URL
* {AccessToken}　：トランスセルトークン
* {UserCell}     ：任意のユーザーセル

## Cell Manager のセットアップ手順

ユーザーセルに対してCell Manager をセットアップする手順を説明します。 
この手順は以下の設定がされている必要があります。

  a) Cellが作成されていること  
  b) Roleが作成されていること  
  c) Accountが作成されており「b」のRoleが割り当ててあること  
  d) 「b」のRoleにCellのroot権限が割り当てられていること  
  e) [cell-manager.bar](https://github.com/personium/app-uc-unit-manager/raw/master/cell-manager.bar) を所持していること  

1. ブラウザにてUnit Manager にアクセスします。

    ```
    https://app-uc-unit-manager.{UnitFQDN}/__/html/login.html
    ```

1. ログイン画面に以下の要領で情報を入力し、ログインします。

    |項目|入力値|
    |---|---|
    | Login URL  | https://{UnitCellName}.{UnitFQDN}/|
    | Username　 | {UnitUserName}                    |
    | Password　 | {UnitUserPassword}                |

1. 画面左部のメニュー「Cell List」のセットアップ対象セルをクリックします。
    この手順では`test-user`

    <img src="./doc/select_test-user-cell.jpg" title="cell-list" style="width:70%;height:auto;">

1. Create BoxプルダウンのImport Boxボタンをクリックします。

    <img src="./doc/Import_Box_001.jpg" title="cell-list" style="width:70%;height:auto;">

1. Import Box画面で①Box Nameにcell-managerと入力します。  
その後②Browseボタンをクリックし、Cell Managerセットアップ手順で作成したcell-manager.barを選択してOKボタンをクリックします。  
ファイルの選択が完了したら③Createボタンをクリックします。  

    <img src="./doc/Import_Box_002.jpg" title="cell-list" style="width:70%;height:auto;">

    Installation Completedが表示されることを確認しCancelボタンをクリックします。  
    <img src="./doc/Import_Box_003.jpg" title="cell-list" style="width:70%;height:auto;">

1. `Box List`の`cell-manager`をクリックします。

    <img src="./doc/cell_manager_box.jpg" title="cell-manager-box-click" style="width:70%;height:auto;">

1. 鉛筆アイコンをクリックします。

    <img src="./doc/cell-edit_bottan.jpg" title="cell-edit-bottan-click" style="width:70%;height:auto;">

1. Edit Box 画面の`Schema URL`を変更します。  
    `https://app-uc-unit-manager.{UnitFQDN}/`となるように自身のPersonium Unit URLを指定してください。

    <img src="./doc/schema_url_edit.jpg" title="schema-url-edit" style="width:70%;height:auto;">

    Schema URL を修正した後"save"ボタンをクリックします。

1. cell-manager Box のsrc コレクションをクリックします。
1. login.html コレクションのチェックボックスをオンにしてdownload ボタンをクリックします。

    <img src="./doc/download_loginhtml.jpg" title="schema-url-edit" style="width:70%;height:auto;">

1. ダウンロードしたlogin.html をテキストエディタで編集します。
    ファイル内に記載されているFQDN`demo.personium.io`を自身のPersonium Unit のFQDNに修正します。  
1. 編集したファイルをアップロードするためUnit Manager のupload ボタンをクリックします。

    <img src="./doc/upload_loginhtml_001.jpg" title="schema-url-edit" style="width:70%;height:auto;">

    ファイル選択ダイアログが表示されるので、login.htmlを選択してOKボタンをクリックします。
    以上でCell Managerのセットアップは完了です。

## アクセス手順  

1. 以下にアクセスします。

    ```
    https://{UserCell}.{UnitFQDN}/cell-manager/src/login.html
    ```

## 必要な情報  

1. セルの管理者アカウントのログイン情報（ID/パスワード）

## 操作方法

操作方法は[Unit Manager](./README_ja.md) と同一です。