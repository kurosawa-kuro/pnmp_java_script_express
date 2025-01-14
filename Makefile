# 開発用コマンド
dev:  # ローカル開発サーバー起動
	pnpm run dev

# ログファイルの監視
watch:
	tail -f logs/combined.log

install-pnpm:
	npm install -g pnpm

# 依存関係のインストール
pnpm-install: install-pnpm
	pnpm install

# すべてのセットアップを実行
setup: install-pnpm pnpm-install