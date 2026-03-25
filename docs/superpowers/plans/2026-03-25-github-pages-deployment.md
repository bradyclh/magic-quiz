# magic-quiz GitHub Pages 部署實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將現有 `magic-quiz.jsx` 轉為 Vite + React 專案並部署到 `https://bradyclh.github.io/magic-quiz/`

**Architecture:** Vite 建置 React 19 + Tailwind CSS v4 專案，透過 GitHub Actions 自動部署到 GitHub Pages。元件程式碼不做功能性修改，僅搬移至標準專案結構。

**Tech Stack:** Vite 6.x, React 19.x, Tailwind CSS 4.x (@tailwindcss/vite), GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-03-25-github-pages-deployment-design.md`

**Prerequisites:** Git repo 已初始化（`git init` 已執行），`magic-quiz.jsx` 存在於專案根目錄。

---

## File Structure

```
magic-quiz/
├── index.html                  # Vite 入口 HTML（新建）
├── package.json                # 依賴與 scripts（新建）
├── vite.config.js              # Vite 設定（新建）
├── .gitignore                  # Git 忽略規則（新建）
├── src/
│   ├── main.jsx                # React 掛載進入點（新建）
│   ├── App.jsx                 # 主元件，內容來自 magic-quiz.jsx（新建）
│   └── index.css               # Tailwind CSS 引入（新建）
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions 部署 workflow（新建）
├── CLAUDE.md                   # 已存在，需更新
└── docs/                       # 已存在
```

---

### Task 1: 初始化 Vite 專案結構

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `.gitignore`

- [ ] **Step 1: 建立 `package.json`**

```json
{
  "name": "magic-quiz",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "vite": "^6.0.0"
  }
}
```

- [ ] **Step 2: 建立 `vite.config.js`**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/magic-quiz/",
});
```

- [ ] **Step 3: 建立 `index.html`**

```html
<!DOCTYPE html>
<html lang="zh-TW">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>魔法學園・字形測驗</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: 建立 `.gitignore`**

```
node_modules
dist
.DS_Store
```

- [ ] **Step 5: Commit**

```bash
git add package.json vite.config.js index.html .gitignore
git commit -m "chore: initialize Vite project structure"
```

---

### Task 2: 建立 React 入口與搬移元件

**Files:**
- Create: `src/main.jsx`
- Create: `src/App.jsx`（內容來自 `magic-quiz.jsx`）
- Create: `src/index.css`

- [ ] **Step 1: 建立 `src/index.css`**

```css
@import "tailwindcss";
```

- [ ] **Step 2: 建立 `src/main.jsx`**

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: 建立 `src/App.jsx`**

將 `magic-quiz.jsx` 的完整內容複製到 `src/App.jsx`，不做任何修改。檔案已包含 `export default function App()`。

```bash
cp magic-quiz.jsx src/App.jsx
```

- [ ] **Step 4: Commit**

```bash
git add src/
git commit -m "feat: add React entry point and move quiz component"
```

---

### Task 3: 安裝依賴並驗證本地開發

**Files:** 無新檔案

- [ ] **Step 1: 安裝 npm 依賴**

```bash
npm install
```

Expected: 成功安裝，產生 `node_modules/` 和 `package-lock.json`

- [ ] **Step 2: 執行建置驗證**

```bash
npm run build
```

Expected: 成功產生 `dist/` 目錄，無錯誤

- [ ] **Step 3: 本地預覽驗證**

```bash
npm run preview
```

用瀏覽器開啟顯示的 URL（含 `/magic-quiz/` 路徑），確認：
- 頁面正常顯示「魔法學園・字形測驗」
- 題目與選項正確渲染
- 教師/學生切換功能正常
- Tailwind 樣式正確套用

- [ ] **Step 4: Commit lock file**

```bash
git add package-lock.json
git commit -m "chore: add package-lock.json"
```

---

### Task 4: 建立 GitHub Actions 部署 workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 建立 `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deployment workflow"
```

---

### Task 5: 建立 GitHub repo 並部署

**Files:** 無新檔案

- [ ] **Step 1: 建立公開 GitHub repo**

```bash
gh repo create bradyclh/magic-quiz --public --source=. --push
```

Expected: 建立成功，程式碼推送到 `main` 分支

- [ ] **Step 2: 啟用 GitHub Pages**

透過 GitHub API 啟用 Pages，source 設為 GitHub Actions：

```bash
gh api repos/bradyclh/magic-quiz/pages -X POST -f build_type=workflow
```

- [ ] **Step 3: 確認 GitHub Actions 執行成功**

```bash
gh run list --limit 1
gh run view --log $(gh run list --limit 1 --json databaseId -q '.[0].databaseId')
```

Expected: workflow 狀態為 `completed` / `success`

- [ ] **Step 4: 驗證部署結果**

開啟 `https://bradyclh.github.io/magic-quiz/`，確認頁面正常顯示。

---

### Task 6: 清理與更新文件

**Files:**
- Modify: `CLAUDE.md`
- Delete: `magic-quiz.jsx`（已搬移至 `src/App.jsx`）

- [ ] **Step 1: 刪除原始檔案 `magic-quiz.jsx`**

```bash
git rm magic-quiz.jsx
```

- [ ] **Step 2: 更新 `CLAUDE.md`**

更新以反映新的專案結構，加入以下內容：
- 開發指令：`npm run dev`、`npm run build`、`npm run preview`
- 部署方式：push 到 `main` 自動觸發 GitHub Actions 部署
- 部署網址：`https://bradyclh.github.io/magic-quiz/`
- 移除舊的檔案結構描述

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "chore: remove original jsx, update CLAUDE.md"
```

- [ ] **Step 4: Push 並確認部署**

```bash
git push
```

確認 GitHub Actions 再次成功執行。
