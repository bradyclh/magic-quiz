# magic-quiz GitHub Pages 部署設計

## 目標

將現有的單一 React 元件 (`magic-quiz.jsx`) 轉換為完整的 Vite + React 專案，部署到 GitHub Pages，網址為 `https://bradyclh.github.io/magic-quiz/`。

## 決策紀錄

- 使用 Vite 作為建置工具（而非改寫為純 HTML 或 CDN 載入 React）
- Repo 名稱為 `magic-quiz`，建在 `bradyclh` 帳號下，公開 repo
- PDF 來源檔案不放入 repo

## 專案結構

```
magic-quiz/
├── index.html                # Vite 入口 HTML
├── package.json              # 依賴與 scripts
├── vite.config.js            # Vite 設定（含 base path 與 Tailwind 插件）
├── src/
│   ├── main.jsx              # React 掛載進入點
│   ├── App.jsx               # 主元件（從 magic-quiz.jsx 搬入）
│   └── index.css             # Tailwind CSS 引入
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 自動部署
├── .gitignore
└── CLAUDE.md
```

## 技術棧

| 項目 | 選擇 | 版本 |
|------|------|------|
| 建置工具 | Vite | 6.x |
| UI 框架 | React | 19.x |
| 樣式 | Tailwind CSS | 4.x（使用 `@tailwindcss/vite` 插件） |
| 部署 | GitHub Actions + GitHub Pages | - |

## 關鍵設定

### vite.config.js

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/magic-quiz/",
});
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### GitHub Actions workflow (`deploy.yml`)

- 觸發條件：push 到 `main` 分支
- 權限：`pages: write`、`id-token: write`、`contents: read`
- 步驟：checkout → 安裝 Node.js 22 → `npm install` → `npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages`

### Tailwind CSS v4

- 透過 `@tailwindcss/vite` 插件直接整合到 Vite，不需要 `postcss.config.js` 或 `tailwind.config.js`
- `index.css` 中使用 `@import "tailwindcss"` 引入

## 程式碼調整

### src/main.jsx

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

### src/App.jsx

- 直接搬入 `magic-quiz.jsx` 的內容，不做功能性修改
- 保留 `export default function App()`

### index.html

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

## 部署流程

1. `git init` → 初始化本地 repo
2. 建立所有檔案（Vite 專案結構）
3. `npm install` → 安裝依賴
4. `npm run dev` → 本地驗證
5. `npm run build` → 確認建置成功
6. `gh repo create bradyclh/magic-quiz --public --source=.` → 建立遠端 repo
7. 在 GitHub repo settings 啟用 Pages（source: GitHub Actions）
8. push 到 `main` → GitHub Actions 自動建置並部署
9. 驗證 `https://bradyclh.github.io/magic-quiz/` 可正常存取
