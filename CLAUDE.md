# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

「魔法學園・字形測驗」— 中文字形與字義的互動式測驗應用。題庫為 78 題國中程度的中文字形辨析選擇題。

## 開發指令

```bash
npm run dev      # 啟動開發伺服器
npm run build    # 建置生產版本（輸出至 dist/）
npm run preview  # 本地預覽建置結果
```

## 部署

- Push 到 `main` 分支自動觸發 GitHub Actions 建置與部署
- 部署網址：https://bradyclh.github.io/magic-quiz/
- Workflow 設定：`.github/workflows/deploy.yml`

## 架構

Vite + React 19 + Tailwind CSS v4 專案。

- **`src/App.jsx`**：主元件，包含題庫資料（`fullQuestionBank`）與所有 UI 邏輯
  - 題庫格式：每題有 `id`、`q`（題目）、`opts`（4 選項）、`ans`（正確答案字母）、`exp`（解析）
  - 模式：教師版（直接顯示答案解析）與學生版（作答後批改）
  - 出題：全部 78 題或隨機抽 20 題
- **`src/main.jsx`**：React 進入點
- **`src/index.css`**：Tailwind CSS 引入
- **`vite.config.js`**：Vite 設定，`base: "/magic-quiz/"` 對應 GitHub Pages 子路徑

## 注意事項

- 所有題目內容為繁體中文，包含注音符號（ㄅㄆㄇ）
- 僅依賴 React（useState, useEffect, useMemo）與 Tailwind CSS，無其他第三方套件
