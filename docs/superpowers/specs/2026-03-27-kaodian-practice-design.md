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
    color: "amber",
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
    color: "blue",
    subcategories: {
      mispronounce: { label: "易訛讀字", questions: [...] },
      similarChar: { label: "形近字辨音", questions: [...] },
      multiPronounce: { label: "一字多音", questions: [...] },
    }
  },
  ziYi: {
    label: "字義",
    icon: "💡",
    color: "green",
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

## UI 設計

### 1. 首頁模式切換

Control Bar 左側（logo 旁）新增切換按鈕：
- 「📝 測驗模式」/「📖 考點練習」
- 紫色主題（border-violet-500）
- 切換時完全替換下方內容

### 2. 考點分類頁（KaodianPractice 預設畫面）

- 三大分類區塊：字形（琥珀色）、字音（藍色）、字義（綠色）
- 每個子分類顯示為按鈕，標示題數
- 點擊進入練習

### 3. 練習模式

- 頂部麵包屑導覽：「📝 字形 › 文句偵錯 ・ 第 1/3 題」
- 出處標示（如「114 會考」）
- 四個選項，點選後即時顯示：
  - 答對：選項變綠，顯示綠色解析框
  - 答錯：選中選項變紅+刪除線，正確答案變綠，顯示解析
- 「下一題 →」按鈕
- 最後一題完成後顯示：成績摘要 + 「返回分類」按鈕

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
