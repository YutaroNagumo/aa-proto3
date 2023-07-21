# AAプロトタイプ

## 目的
本プロジェクトはAA開発用API/SDK（Stackup、Alchemy、zerodev、banana）のパフォーマンス（Tx処理速度・ガス代）および開発環境（ドキュメント・コミュニティ）を検証・確認することを目的としています。

## 概要
本プロジェクトは4つのツールと通常のEOAからのTxの5つを簡単に比較可能なツールを提供します。ローカル環境で起動後、以下の2ステップでTxの発行が可能です：

1. **ツールの選択**：対象ツールボタンをクリックします。
2. **実行関数の選択**：対象関数のタブをクリックします。

実行結果はプロトのフロントエンドにログとして表示され、処理時間、TxHash、ガス代に関してはcsvファイル（result.csv）に逐次保存されます。

## ローカル環境での実行手順
本プロジェクトをローカル環境で実行するためには、以下の手順を実行します：

### 依存関係のインストール
必要なパッケージをインストールするために、プロジェクトのルートディレクトリで以下のコマンドを実行します：

```shell
npm install
```

### 依存関係のインストール
必要なパッケージをインストールするために、プロジェクトのルートディレクトリで以下のコマンドを実行します：


### プロジェクトの実行
以下のコマンドを実行し、プロジェクトを起動します：

```shell
npm run dev
```
このコマンドにより、デフォルトでは http://localhost:3000 でアプリケーションが起動します。ブラウザでこのURLにアクセスして、アプリケーションのUIを表示します。

### 環境変数の補足

NEXT_PUBLIC_RPC_URL : Stackupが提供するBundler APIのRPC URL
NEXT_PUBLIC_PAYMASTER_UR : Stackupが提供するPaymaster APIのRPC URL
NEXT_PUBLIC_PRIVATE_KEY : 南雲の開発用walletの秘密鍵
NEXT_PUBLIC_ALCHEMY_KEY : 南雲個人アカウントのAlchemy APIの秘密鍵
