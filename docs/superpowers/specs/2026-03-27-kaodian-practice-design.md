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
    color: "vermillion",  // 使用 --vermillion 系列
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
          // ...
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
    color: "teal",  // 使用 --teal 系列
    subcategories: {
      mispronounce: { label: "易訛讀字", questions: [...] },
      similarChar: { label: "形近字辨音", questions: [...] },
      multiPronounce: { label: "一字多音", questions: [...] },
    }
  },
  ziYi: {
    label: "字義",
    icon: "💡",
    color: "gold",  // 使用 --gold 系列
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
└── index.css
```

## 設計語言

### 視覺風格：「墨韻書卷」

沿用全站已建立的東方書院風設計系統，確保一致性。

### CSS 變數（已定義於 index.css）

```css
--parchment: #f7f2e9;        /* 宣紙背景 */
--parchment-light: #fdfaf4;  /* 淺宣紙 */
--ink: #1a1a2e;              /* 墨色文字 */
--ink-light: #2d2d44;        /* 淡墨 */
--ink-muted: #6b6b80;        /* 輔助文字 */
--vermillion: #c23b22;       /* 朱砂紅（字形主色） */
--vermillion-light: #e8d5d0; /* 朱砂淺 */
--gold: #b8860b;             /* 金色（字義主色、重點） */
--gold-light: #f5e6c8;       /* 金色淺 */
--teal: #1a6b6a;             /* 青綠（字音主色） */
--teal-light: #d0e8e7;       /* 青綠淺 */
--card-bg: #fffef7;          /* 卡片背景 */
--card-border: #e8e0d0;      /* 卡片邊框 */
```

### 字型

- 標題：`font-display` → `'Noto Serif TC', serif`
- 內文：`'LXGW WenKai TC', 'Noto Serif TC', serif`

### 已定義的 CSS 類別

- `.control-bar` — 控制列毛玻璃效果
- `.question-card` — 題目卡片入場動畫
- `.option-item` — 選項 hover 位移效果
- `.explanation-box` — 解析區塊金色漸層
- `.score-glow` — 成績光暈動效

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

三大分類區塊，各有專屬主色：
- **字形**（朱砂紅）：border/text 使用 `--vermillion`，bg 使用 `--vermillion-light`
- **字音**（青綠）：border/text 使用 `--teal`，bg 使用 `--teal-light`
- **字義**（金色）：border/text 使用 `--gold`，bg 使用 `--gold-light`

每個子分類：
- 圓角按鈕（rounded-lg），顯示分類名稱和題數
- hover 效果：`transform: translateY(-2px)` + 加深 boxShadow
- 使用 `font-display` 標題字型顯示分類名稱

### 3. 練習模式

- **麵包屑導覽**：`ink-muted` 色小字，「📝 字形 › 文句偵錯 ・ 第 1/3 題」
- **出處標示**：`--gold` 色小字（如「114 會考」）
- **題幹**：`font-display` 字型，題號使用 `--vermillion` 色
- **選項**：使用 `.option-item` 類別（含 hover 位移效果）
  - 預設：`bg: var(--parchment-light); border: var(--card-border)`
  - 選中：`bg: var(--gold-light); border: var(--gold)`
  - 答對：`bg: #dcfce7; border: #22c55e`
  - 答錯：`bg: #fef2f2; border: #ef4444; text-decoration: line-through`
- **解析**：使用 `.explanation-box` 類別（金色漸層 + 左側金色邊線）
- **下一題按鈕**：`bg: var(--teal); color: #fff; rounded-full`
- **完成畫面**：
  - 墨色漸層背景（同成績橫幅風格）
  - 使用 `.score-glow` 光暈裝飾
  - 成績數字使用 `font-display` 大號字
  - 「返回分類」按鈕 + 「重新練習」按鈕

## 元件狀態

```
KaodianPractice:
  - view: "categories" | "practice"
  - selectedCategory: string | null    (如 "ziXing")
  - selectedSubcategory: string | null (如 "sentenceError")
  - currentIndex: number               (當前題目索引)
  - userAnswer: string | null          (當前選答)
  - results: { [questionId]: boolean } (作答記錄)
```

## 不在範圍內

- Phase 2 的學習模式（考點說明+延伸學習）
- Phase 3 的測驗模式（批改計分）
- 持久化儲存（localStorage）
- 教材中的「牛刀小試」（非標準選擇題格式）
- 教材中的「考點分類與延伸學習」整理內容
