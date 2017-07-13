# UnitManager  

UnitManagerはPersoniumに対してUnitセル単位での管理を行う事が出来るGUIツールです。  
UnitManagerはWebサーバーに配置するだけで使用する事が出来ます。   

## セットアップ  

### 必要な情報  

1. PersoniumのURL  
1. UnitAdminCellのセル名  
1. UnitAdminアカウント  
1. 3.のパスワード  

### 手順  

1. UnitManagerのソースをWebサーバーに配置する。  
1. 以下にアクセスする  

        {配置したUnitManagerのURL}/login.html

### 操作方法  
  
Cell作成の場合、以下の様に操作する事で簡単にCellを作成出来ます。  

![alt text](./doc/demo.gif "Operation sample")  

1. 必要な情報を入力し、UnitManagerにログイン。  
1. 左サイドメニューのCell一覧の最下部にある「Create」を選択。   
(Cellが1つもない場合、自動的にCell作成のポップアップが表示されます。)  
1. 表示されたポップアップの右下にある次へをクリック。  
1. Cell名を入力し、右下の「create」ボタンをクリック。  
(この時、プロフィールや管理roleなどの作成をする事も出来ます。)  

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
