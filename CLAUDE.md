# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**quiz-app** — 一般常識クイズアプリ。HTML / CSS / JavaScript のみで構成された静的 Web アプリケーション。

## 技術スタック

- HTML5
- CSS3
- JavaScript (Vanilla JS)

ビルドツール・パッケージマネージャーは使用しない。ブラウザで直接 `index.html` を開くか、ローカルサーバーで配信する。

## 開発サーバーの起動

```bash
# Python 3 が使える場合
python3 -m http.server 8080

# Node.js が使える場合
npx serve .
```

その後 `http://localhost:8080` をブラウザで開く。

## GitHubリポジトリ

https://github.com/aki419/quiz-app.git
