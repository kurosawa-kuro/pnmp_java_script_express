# 開発用コマンド
dev:  # ローカル開発サーバー起動
	npm run dev

# ログファイルの監視
watch:
	tail -f logs/combined.log

# エラーログファイルの監視
watch-error:
	tail -f logs/error.log
