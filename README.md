# Trello Clone - モノレポ

Trello ライクなタスク管理アプリケーションのモノレポです。

## プロジェクト構成

```
trello-clone/
├── trello-clone/          # フロントエンド (React + TypeScript + Vite)
└── trello-clone-api/      # バックエンド (Node.js + Express + TypeORM)
```

## 技術スタック

### フロントエンド (trello-clone)
- React 18
- TypeScript
- Vite
- Jotai (状態管理)
- @hello-pangea/dnd (ドラッグ&ドロップ)
- React Router DOM

### バックエンド (trello-clone-api)
- Node.js
- Express
- TypeScript
- TypeORM
- SQLite

## セットアップ

### 前提条件
- Node.js (v18以上)
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone <repository-url>
cd trello-clone
```

2. 依存関係をインストール
```bash
# ルートディレクトリで
npm install

# フロントエンド
cd trello-clone
npm install

# バックエンド
cd ../trello-clone-api
npm install
```

### 開発サーバーの起動

1. バックエンドを起動
```bash
cd trello-clone-api
npm run dev
```

2. フロントエンドを起動（別ターミナルで）
```bash
cd trello-clone
npm run dev
```

3. ブラウザで `http://localhost:5173` にアクセス

## 機能

- ユーザー認証（サインアップ/サインイン）
- ボード管理
- リストの作成・削除・並び替え
- カードの作成・削除・移動・並び替え
- ドラッグ&ドロップによる直感的な操作
- カードの詳細表示・編集

## スクリプト

### フロントエンド (trello-clone)
```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run preview  # ビルド結果のプレビュー
```

### バックエンド (trello-clone-api)
```bash
npm run dev      # 開発サーバー起動
npm run build    # TypeScript コンパイル
npm start        # プロダクションサーバー起動
```

## 環境変数

### バックエンド (.env)
```env
PORT=3000
JWT_SECRET=your-jwt-secret
```

## 開発ガイドライン

### ブランチ戦略
- `main`: 本番環境用ブランチ
- `feature/*`: 新機能開発用ブランチ
- `bugfix/*`: バグ修正用ブランチ

### コミットメッセージ
- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント更新
- `style:` - コードスタイル修正
- `refactor:` - リファクタリング
- `test:` - テスト追加・修正
- `chore:` - その他の変更

## ライセンス

MIT License 