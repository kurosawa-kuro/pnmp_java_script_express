# 開発用コマンド
dev:  # ローカル開発サーバー起動
	pnpm run dev

# ログファイルの監視
watch:
	tail -f logs/combined.log

# PNPMのインストールと環境設定
install-pnpm:
	npm install -g pnpm
	npm config get prefix || (mkdir -p ~/.npm-global && npm config set prefix '~/.npm-global')
	echo 'export PATH="$$PATH:$$(npm config get prefix)/bin"' >> ~/.bashrc
	source ~/.bashrc

# 依存関係のインストール
pnpm-install: install-pnpm
	pnpm install

# すべてのセットアップを実行
setup: install-pnpm pnpm-install
