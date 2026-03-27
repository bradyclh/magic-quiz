# 考點練習功能設計（Phase 1）

## 概述

新增獨立的「考點練習」區塊，從「形音義完整教材」提取會考原題，按考點分類組織，提供逐題即時回饋的練習模式。與現有測驗模式完全獨立，透過首頁切換進入。

## 目標

- 從教材 markdown 提取約 24 題會考原題，轉為結構化資料
- 建立按考點分類的題庫（字形/字音/字義 → 子分類）
- 實作逐題練習模式（選答即時顯示對錯與解析）
- 首頁新增「測驗模式 / 考點練習」切換

## 資料結構

### 考點題庫格式

```js
// src/data/kaodianQuestions.js
const kaodianQuestions = {
  ziXing: {
    label: "字形",
    icon: "📝",
    color: "vermillion",
    subcategories: {
      sentenceError: {
        label: "文句偵錯",
        questions: [
          {
            id: 1,
            source: "114 會考",
            q: "下列文句，何者用字完全正確？",
            opts: ["(A) ...", "(B) ...", "(C) ...", "(D) ..."],
            ans: "A",
            exp: "解析..."
          },
        ]
      },
      homophone: { label: "同音字比較", questions: [...] },
      idiomError: { label: "成語偵錯", questions: [...] },
      errorType: { label: "偵錯分辨", questions: [...] },
    }
  },
  ziYin: {
    label: "字音",
    icon: "🔊",
    color: "teal",
    subcategories: {
      mispronounce: { label: "易訛讀字", questions: [...] },
      similarChar: { label: "形近字辨音", questions: [...] },
      multiPronounce: { label: "一字多音", questions: [...] },
    }
  },
  ziYi: {
    label: "字義",
    icon: "💡",
    color: "gold",
    subcategories: {
      singleMeaning: { label: "單一字義比較", questions: [...] },
      fourGroup: { label: "四組單字比較", questions: [...] },
    }
  }
};
```

### 題目來源（從教材提取）

**字形（9 題）：**
- 文句偵錯：3 題（114、113、112 會考）
- 同音字比較：2 題（111、110 會考）
- 成語偵錯：2 題（111 補、104 會考）
- 偵錯分辨：2 題（105、105 補）

**字音（9 題）：**
- 易訛讀字：3 題（114、113、111 補）
- 形近字辨音：2 題（112、110 會考）
- 一字多音：4 題（111×2、106、103 特招）

**字義（6 題）：**
- 單一字義比較：3 題（113、111、109 會考）
- 四組單字比較：3 題（108、107、104 會考）

共計約 24 題。

## 檔案結構

```
src/
├── data/
│   ├── ziXingQuestions.js      ← 現有
│   ├── ziYiQuestions.js        ← 現有
│   └── kaodianQuestions.js     ← 新增：考點練習題庫
├── KaodianPractice.jsx         ← 新增：考點練習主元件
├── App.jsx                     ← 修改：新增模式切換
├── main.jsx
└── index.css                   ← 修改：新增動效與色彩
```

## 設計語言

### 視覺風格：「墨韻書卷」

沿用全站已建立的東方書院風設計系統，確保一致性。

### CSS 變數（已定義於 index.css）

```css
/* 基底 */
--parchment: #f7f2e9;        /* 宣紙背景 */
--parchment-light: #fdfaf4;  /* 淺宣紙 */
--ink: #1a1a2e;              /* 墨色文字 */
--ink-light: #2d2d44;        /* 淡墨 */
--ink-muted: #6b6b80;        /* 輔助文字 */
--card-bg: #fffef7;          /* 卡片背景 */
--card-border: #e8e0d0;      /* 卡片邊框 */

/* 三色系（分類主色） */
--vermillion: #c23b22;       /* 朱砂紅（字形） */
--vermillion-light: #e8d5d0;
--gold: #b8860b;             /* 金色（字義、重點） */
--gold-light: #f5e6c8;
--teal: #1a6b6a;             /* 青綠（字音） */
--teal-light: #d0e8e7;
```

### 新增 CSS 變數（本次需加入 index.css）

```css
/* 答題回饋色（東方色系，取代 Tailwind 預設綠紅） */
--correct: #2d6a4f;          /* 松綠 */
--correct-light: #e8f0e8;
--wrong: #9b2226;            /* 暗朱紅 */
--wrong-light: #f0e0e0;
```

### 字型

- 標題：`.font-display` → `'Noto Serif TC', serif`
- 內文：`'LXGW WenKai TC', 'Noto Serif TC', serif`

### 已定義的 CSS 類別

- `.control-bar` — 控制列毛玻璃效果
- `.question-card` — 題目卡片入場動畫
- `.option-item` — 選項 hover 位移效果
- `.explanation-box` — 解析區塊金色漸層
- `.score-glow` — 成績光暈動效

### 新增 CSS 類別（本次需加入 index.css）

```css
/* 分類卡片 */
.category-card {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}
.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(26, 26, 46, 0.12);
}
.category-card::before {
  /* 水墨山水剪影裝飾 — 每張卡片不同 opacity/position */
  content: '';
  position: absolute;
  right: -20px;
  bottom: -10px;
  width: 120px;
  height: 120px;
  opacity: 0.06;
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
}

/* 進度條 */
.progress-bar {
  height: 3px;
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 題目滑入/滑出 */
@keyframes slide-in {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes slide-out {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-40px); }
}
.slide-in {
  animation: slide-in 0.35s ease-out both;
}

/* 答對金光脈衝 */
@keyframes glow-pulse {
  0% { box-shadow: 0 0 0 0 rgba(184, 134, 11, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(184, 134, 11, 0); }
  100% { box-shadow: 0 0 0 0 rgba(184, 134, 11, 0); }
}
.glow-pulse {
  animation: glow-pulse 0.6s ease-out;
}

/* 答錯震動 */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}
.shake {
  animation: shake 0.4s ease-out;
}
```

## UI 設計

### 1. 首頁模式切換

Control Bar 標題列新增切換按鈕：
- 「✦ 測驗模式」/「✦ 考點練習」
- 使用 `--gold` 主色，與題庫分類選擇器風格一致
- 圓角分段按鈕（rounded-lg + overflow-hidden + border）
- active 狀態：`background: var(--gold); color: #fff`
- inactive 狀態：`background: var(--gold-light); color: var(--gold)`
- 切換時完全替換下方內容（測驗 = 現有，考點 = KaodianPractice）

### 2. 考點分類頁（KaodianPractice 預設畫面）

**整體佈局：不等高卡片（asymmetric grid）**

三大分類用 `.category-card` 卡片呈現，避免三欄等高的呆板感：
- 使用 CSS Grid：`grid-template-columns: 1fr 1fr`
- 字形卡片佔左側整欄（`grid-row: span 2`），較大
- 字音、字義各佔右側一格，較小
- 手機版（< 640px）：單欄堆疊

**卡片設計：**
- 圓角（rounded-xl）、`--card-bg` 背景、`--card-border` 邊框
- 頂部色帶：3px 高的分類主色條
- 左上角：icon + 分類名稱（`font-display` 粗體）
- 右下角：水墨裝飾偽元素（`::before`，淡墨剪影，opacity 0.06）
- 內部：子分類按鈕列表

**子分類按鈕：**
- 圓角（rounded-lg），分類主色 border + light bg
- 顯示名稱和題數（如「文句偵錯 3題」）
- hover：`translateY(-2px)` + 加深 boxShadow
- 使用 `font-display` 字型

### 3. 練習模式

**聚焦式體驗** — 整個畫面只呈現一題，非列表式。

**頂部區域：**
- 麵包屑導覽：`--ink-muted` 色小字，點擊可返回分類頁
  - 格式：「📝 字形 › 文句偵錯 ・ 第 1/3 題」
- 進度條：`.progress-bar`，使用當前分類主色填充
  - 寬度 = `(currentIndex / totalQuestions) * 100%`
  - 位於麵包屑下方，3px 高

**題目卡片：**
- 使用 `.slide-in` 動畫（每次切題時觸發）
- 出處標示：`--gold` 色小字（如「114 會考」）
- 題幹：`font-display` 字型，題號使用分類主色
- 選項：使用 `.option-item` 類別
  - 預設：`bg: var(--parchment-light); border: var(--card-border)`
  - 選中後（答對）：`bg: var(--correct-light); border: var(--correct)` + `.glow-pulse` 動畫
  - 選中後（答錯）：`bg: var(--wrong-light); border: var(--wrong); text-decoration: line-through` + `.shake` 動畫
  - 正確答案（答錯時標示）：`bg: var(--correct-light); border: var(--correct)`
- 解析：使用 `.explanation-box` 類別

**底部操作：**
- 答題後顯示「下一題 →」按鈕：`bg: var(--teal); color: #fff; rounded-full`
- 最後一題答完後按鈕變為「查看結果」

### 4. 完成畫面

**高成就時刻設計** — 比測驗模式的成績橫幅更豐富。

**整體佈局：**
- 墨色漸層背景（同成績橫幅：`--ink` → `--ink-light` → 微量 `--vermillion`）
- 使用 `.score-glow` 光暈裝飾
- 全畫面居中

**環形進度圖：**
- SVG 圓環，用分類主色描邊
- 中間顯示正確率百分比（`font-display` 大號字）
- 動畫填充（stroke-dashoffset 從 full 到目標值，1s ease-out）

**成就評語：**
依正確率顯示不同稱號和文字：
- 100%：「✦ 墨寶大師 ✦」
- 80%+：「書院秀才」
- 60%+：「勤學書生」
- < 60%：「繼續修煉」

**每題回顧（mini recap）：**
- 橫向排列的小圓點，每題一個
- 答對 = `--correct` 實心圓、答錯 = `--wrong` 實心圓
- hover 或點擊可顯示題目簡述

**操作按鈕：**
- 「重新練習」：ghost 按鈕（透明底 + 白色邊框）
- 「返回分類」：`bg: var(--gold); color: #fff; rounded-full`

## 元件狀態

```
KaodianPractice:
  - view: "categories" | "practice" | "result"
  - selectedCategory: string | null      (如 "ziXing")
  - selectedSubcategory: string | null   (如 "sentenceError")
  - currentIndex: number                 (當前題目索引)
  - userAnswer: string | null            (當前選答)
  - answered: boolean                    (當前題是否已答)
  - results: { [questionId]: boolean }   (作答記錄)
  - animating: boolean                   (切題動畫進行中)
```

注意新增：
- `view` 加入 `"result"` 狀態（完成畫面）
- `answered` 控制是否顯示解析和下一題按鈕
- `animating` 防止切題動畫期間重複操作

## 現有 App.jsx 答題回饋色更新

將現有測驗模式中的 Tailwind 硬編碼綠紅色改為新 CSS 變數，保持全站一致：
- `#dcfce7` / `#22c55e` → `var(--correct-light)` / `var(--correct)`
- `#fef2f2` / `#ef4444` → `var(--wrong-light)` / `var(--wrong)`
- `#86efac` / `#fca5a5`（卡片邊框）同步更新

## 不在範圍內

- Phase 2 的學習模式（考點說明+延伸學習）
- Phase 3 的測驗模式（批改計分）
- 持久化儲存（localStorage）
- 教材中的「牛刀小試」（非標準選擇題格式）
- 教材中的「考點分類與延伸學習」整理內容
