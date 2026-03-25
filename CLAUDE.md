# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概述

「魔法學園・字形測驗」— 一個中文字形與字義的互動式測驗應用，以單一 React 元件（`magic-quiz.jsx`）實作。題庫為 78 題國中程度的中文字形辨析選擇題。

## 架構

整個應用為單一檔案 `magic-quiz.jsx`，無建置系統、無 package.json。設計為直接嵌入支援 JSX 的環境使用（如 Claude Artifacts 或類似平台）。

- **題庫**：`fullQuestionBank` 陣列，每題包含 `id`、`q`（題目）、`opts`（4 個選項）、`ans`（正確答案字母）、`exp`（解析）
- **模式**：教師版（直接顯示答案與解析）與學生版（作答後批改）
- **出題**：全部 78 題或隨機抽 20 題
- **UI**：使用 Tailwind CSS utility classes 進行樣式設定，無外部 CSS 檔案

## 參考資料

- `606691375920185655_字形.pdf` — 字形題目來源 PDF
- `606691397260542413_字義.pdf` — 字義題目來源 PDF

## 注意事項

- 所有題目內容為繁體中文，包含注音符號（ㄅㄆㄇ）
- 元件使用 `export default function App()` 匯出
- 僅依賴 React（useState, useEffect, useMemo）與 Tailwind CSS，無其他第三方套件
