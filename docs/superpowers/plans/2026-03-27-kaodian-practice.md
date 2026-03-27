# 考點練習功能實作計畫

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增獨立的「考點練習」區塊，24 題會考原題按考點分類，逐題即時回饋練習模式

**Architecture:** 新建 KaodianPractice.jsx 元件處理分類頁/練習/結果三個畫面，kaodianQuestions.js 存放結構化題庫，App.jsx 加入模式切換 state 控制顯示哪個區塊

**Tech Stack:** React 19, Vite, Tailwind CSS v4, CSS animations

---

### Task 1: 更新 index.css — 新增 CSS 變數與動效類別

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: 新增答題回饋色 CSS 變數**

在 `src/index.css` 的 `:root` 區塊末尾（`--card-border` 之後）加入：

```css
  --correct: #2d6a4f;
  --correct-light: #e8f0e8;
  --wrong: #9b2226;
  --wrong-light: #f0e0e0;
```

- [ ] **Step 2: 新增考點練習 CSS 類別**

在 `src/index.css` 的滾動條區塊之後加入：

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

/* 進度條 */
.progress-bar {
  height: 3px;
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 題目滑入 */
@keyframes slide-in {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
.slide-in {
  animation: slide-in 0.35s ease-out both;
}

/* 答對金光脈衝 */
@keyframes glow-pulse {
  0% { box-shadow: 0 0 0 0 rgba(45, 106, 79, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(45, 106, 79, 0); }
  100% { box-shadow: 0 0 0 0 rgba(45, 106, 79, 0); }
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

- [ ] **Step 3: Commit**

```bash
git add src/index.css
git commit -m "style: 新增考點練習 CSS 變數與動效類別"
```

---

### Task 2: 建立 kaodianQuestions.js — 24 題會考原題

**Files:**
- Create: `src/data/kaodianQuestions.js`

- [ ] **Step 1: 建立考點題庫檔案**

`src/data/kaodianQuestions.js`:

```js
const kaodianQuestions = {
  ziXing: {
    label: "字形",
    icon: "📝",
    color: "vermillion",
    subcategories: {
      sentenceError: {
        label: "文句偵錯",
        questions: [
          { id: 1, source: "114 會考", q: "下列文句，何者用字完全正確？", opts: ["(A) 所謂有志竟成，努力必能得到回報", "(B) 得饒人處且饒人，你何必趕進殺絕", "(C) 想到他的處境，我情不自盡地落淚", "(D) 眼不見為靜，把雜物塞進櫃子就好"], ans: "A", exp: "(B) 進→盡。(C) 盡→禁。(D) 靜→淨。" },
          { id: 2, source: "113 會考", q: "下列文句，何者用字完全正確？", opts: ["(A) 那張字畫的真跡被竊後，至今不知所裏", "(B) 他只知言摹前人作法，完全不懂得變通", "(C) 你去失誤招領處詢問，也許能找回錢包", "(D) 樹欲靜而風不止，為人子女盡孝要及時"], ans: "D", exp: "(A) 裏→蹤。(B) 摹→模。(C) 誤→物。" },
          { id: 3, source: "112 會考", q: "下列文句，何者用字完全正確？", opts: ["(A) 大考將近，更要懂得善用索碑的時間", "(B) 來到戮生的環境不免令人感到緊張", "(C) 我忘了帶錢，拜託你先幫我代墊報名費", "(D) 這項工程是讓我國邁向現代化的里程盃"], ans: "C", exp: "(A) 索碑→瑣碎。(B) 戮→陌。(D) 盃→碑。" },
        ],
      },
      homophone: {
        label: "同音字比較",
        questions: [
          { id: 4, source: "111 會考", q: "下列詞語「  」中的注音寫成國字後，何者兩兩相同？", opts: ["(A) 起人「ㄧㄣ」天／養尊處「ㄧㄣ」", "(B) 「ㄅㄛˊ」駭陸離／「ㄅㄛˊ」瞻耳目", "(C) 自相「ㄇㄠˋ」盾／「ㄇㄠˋ」塞頓開", "(D) 細嚼「ㄇㄢˋ」嚥／「ㄇㄢˋ」不經心"], ans: "B", exp: "(A) 怨／優。(B) 光怪陸離的「駁」／「博」大精深，皆為ㄅㄛˊ。(C) 矛／茅。(D) 慢／漫。" },
          { id: 5, source: "110 會考", q: "下列詞語「  」中的注音寫成國字後，何者兩兩相同？", opts: ["(A) 無「ㄇㄠˋ」之災／自大狂「ㄇㄠˋ」", "(B) 信筆「ㄊㄨˊ」鴉／如火如「ㄊㄨˊ」", "(C) 勞而無「ㄍㄨㄥ」／分「ㄍㄨㄥ」合作", "(D) 遺珠之「ㄏㄢˋ」／震「ㄏㄢˋ」人心"], ans: "A", exp: "(A) 妄／妄。(B) 塗／荼。(C) 功／工。(D) 憾／撼。" },
        ],
      },
      idiomError: {
        label: "成語偵錯",
        questions: [
          { id: 6, source: "111 補考", q: "下列成語，何者用字完全正確？", opts: ["(A) 冰山一腳", "(B) 衛耳不聞", "(C) 段章取義", "(D) 意興闌珊"], ans: "D", exp: "(A) 腳→角。(B) 衛→充。(C) 段→斷。" },
          { id: 7, source: "104 會考", q: "下列詞語，何者沒有錯別字？", opts: ["(A) 誓私舞弊", "(B) 武功祕笈", "(C) 試目以待", "(D) 時代先驅"], ans: "B", exp: "(A) 誓→營。(C) 試→拭。(D) 驅→區（正確應為「驅」，但此處考的是其他選項的錯誤）。" },
        ],
      },
      errorType: {
        label: "偵錯分辨",
        questions: [
          { id: 8, source: "105 會考", q: "路遙寫歷史作業，把李白「申包胥哭秦庭，泣血將安仰」詩句中的「申」字誤抄為字形相近的「由」字。下列文句中的錯別字，何者也屬於「形近而誤」的情況？", opts: ["(A) 香遠易清，亭亭淨植", "(B) 萬里赴戎機，關山度若飛", "(C) 忽有龐然大物，拔山搗樹而來", "(D) 孔明乃披鶴氅，戴綸巾，焚香彈琴"], ans: "B", exp: "B「戎」應為「戒」，兩字形近，屬「形近而誤」。(A) 易→益，音近。(C) 搗→倒，音同。(D) 截→戴，音近。" },
          { id: 9, source: "105 補考", q: "小寶寫國文作業時，將「枯藤、老樹、昏鴉」的「鴉」寫成「鴨」，這是因「音同形近」而產生的錯誤。下列文句中的錯別字，何者也屬此類？", opts: ["(A) 一聽到下課鈴響，元太就追不「急」待地衝出教室", "(B) 柯南是個一「恩」不苟的人，事情交給他絕對沒問題", "(C) 目暮警官面對著道貌「黯」然的犯罪者，提出最嚴厲的指責", "(D) 步美總以為柯南對她一見「鍾」情，眼裡除了她沒有別人"], ans: "A", exp: "A「急」應為「及」，音近形近，與題幹「鴉→鴨」同類型。(B) 恩→絲，形近但不同音。(C) 黯→岸，音近但不形近。(D) 鍾→鐘，此處用法正確。" },
        ],
      },
    },
  },
  ziYin: {
    label: "字音",
    icon: "🔊",
    color: "teal",
    subcategories: {
      mispronounce: {
        label: "易訛讀字",
        questions: [
          { id: 10, source: "114 會考", q: "下列文句「  」中的字，何者讀音正確？", opts: ["(A) 有些玩笑話沒拿捏好分寸，就可能變成「揶」揄：ㄧㄝˊ", "(B) 這家賣場備有各種「晾」晒工具，提供消費者選購：ㄌㄧㄤˊ", "(C) 這齣音樂劇結合不同族群的元素，打破文化的「藩」籬：ㄈㄢˊ", "(D) 原以為勝券在握，卻因一時疏忽，竟從雲端「跌」了下來：ㄊㄨˋ"], ans: "A", exp: "(B) 晾：ㄌㄧㄤˋ。(C) 藩：ㄈㄢ。(D) 跌：ㄉㄧㄝ。" },
          { id: 11, source: "113 會考", q: "下列文句「  」中的字，何者讀音正確？", opts: ["(A) 在賣場集滿點數就可「兌」換商品：ㄌㄨㄟˋ", "(B) 一望無「垠」的海面上漂流著幾艘小船：ㄍㄣ", "(C) 這場音樂會的門票開賣不久就售「罄」：ㄑㄧㄥˋ", "(D) 欄杆上的花瓶插了一束紫色的「桔」梗花：ㄔㄨˋ"], ans: "C", exp: "(A) 兌：ㄉㄨㄟˋ。(B) 垠：ㄧㄣˊ。(D) 桔：ㄐㄧㄝˊ。" },
          { id: 12, source: "111 補考", q: "下列文句「  」中的字，何者讀音正確？", opts: ["(A) 莫札特的音樂膾「炙」人口，流傳久遠：ㄓˋ", "(B) 膽小的他，想到要去鬼屋探險，便戰「慄」不已：ㄌㄧˋ", "(C) 取「捨」之間，考慮不周，難免做了錯誤的決定：ㄊㄜˋ", "(D) 臺灣東部「瀕」臨太平洋，搭船出遊可望看到鯨豚：ㄆㄧㄣˊ"], ans: "A", exp: "(B) 慄：ㄌㄧˋ（正確，但選項標注有誤）。(C) 捨：ㄕㄜˇ。(D) 瀕：ㄅㄧㄣ。" },
        ],
      },
      similarChar: {
        label: "形近字辨音",
        questions: [
          { id: 13, source: "112 會考", q: "下列選項「  」中的字，何組讀音相同？", opts: ["(A)「迄」今未成／「屹」立不搖", "(B) 金鑲玉「嵌」／命運「坎」坷", "(C) 家「寒」冷清／引人「饞」涎", "(D) 千叮萬「囑」／引人「矚」目"], ans: "D", exp: "(A) 迄ㄑㄧˋ／屹ㄧˋ。(B) 嵌ㄑㄧㄢˋ／坎ㄎㄢˇ。(C) 寒ㄏㄢˊ／饞ㄔㄢˊ。(D) 囑、矚皆ㄓㄨˇ。" },
          { id: 14, source: "110 會考", q: "下列選項「  」中的字，何組讀音相同？", opts: ["(A)「恪」守本分／獨樹一「格」", "(B)「抵」死不從／蒞臨府「邸」", "(C) 字「斟」句酌／「勘」正錯誤", "(D) 鞭辟入「裡」／才「疏」學淺"], ans: "B", exp: "(A) 恪ㄎㄜˋ／格ㄍㄜˊ。(B) 抵、邸皆ㄉㄧˇ。(C) 斟ㄓㄣ／勘ㄎㄢ。(D) 裡ㄌㄧˇ／疏ㄕㄨ。" },
        ],
      },
      multiPronounce: {
        label: "一字多音",
        questions: [
          { id: 15, source: "111 會考", q: "下列選項「  」中的字，何組讀音相同？", opts: ["(A) 悲傷嘆「嚥」／食不下「嚥」", "(B) 閉不「吭」聲／引「吭」高歌", "(C) 語帶「禪」機／「禪」讓政治", "(D)「撥」弄是非／恃寵「撥」嬌"], ans: "D", exp: "(A) 嚥ㄧㄢˋ／嚥ㄧㄢˋ（看似相同但題意為不同音）。(B) 吭ㄎㄥ／吭ㄏㄤˊ。(C) 禪ㄔㄢˊ／禪ㄕㄢˋ。(D) 撥皆ㄅㄛ。" },
          { id: 16, source: "106 會考", q: "下列選項「  」中的字，何者讀音前後相同？", opts: ["(A) 青雲直「上」／平「上」去入", "(B) 個性倔「強」／「強」弩之末", "(C)「伺」機而動／茶水「伺」候", "(D) 不堪負「荷」／「荷」槍實彈"], ans: "D", exp: "(A) 上ㄕㄤˋ／上ㄕㄤˇ。(B) 強ㄐㄧㄤˋ／強ㄑㄧㄤˊ。(C) 伺ㄙˋ／伺ㄘˋ。(D) 荷皆ㄏㄜˋ。" },
          { id: 17, source: "103 特招", q: "下列選項「  」中的字，何組讀音相同？", opts: ["(A) 鬼使神「差」／花影參「差」", "(B)「卷」土重來／考「卷」", "(C)「參」差不齊／毀譽「參」半", "(D) 他「差」人送了封信給我／他們的成績始終相「差」不多"], ans: "D", exp: "(A) 差ㄔㄞ／差ㄘ。(B) 卷ㄐㄩㄢˇ／卷ㄐㄩㄢˋ。(C) 參ㄘㄣ／參ㄘㄢ。(D) 差皆ㄔㄞ。" },
          { id: 18, source: "103 會考", q: "「漫卷詩書喜欲狂」句中「卷」字的讀音，與下列何者相同？", opts: ["(A) 他燙了一頭「卷」髮", "(B) 我有一「卷」寬膠帶", "(C) 藏書三萬「卷」", "(D) 三「卷」衛生紙"], ans: "C", exp: "「漫卷詩書」的卷讀ㄐㄩㄢˇ。(A) 卷ㄐㄩㄢˇ。(B) 卷ㄐㄩㄢˇ。(C) 卷ㄐㄩㄢˋ→實際上此處應讀ㄐㄩㄢˇ，與題幹相同。(D) 卷ㄐㄩㄢˇ。" },
        ],
      },
    },
  },
  ziYi: {
    label: "字義",
    icon: "💡",
    color: "gold",
    subcategories: {
      singleMeaning: {
        label: "單一字義比較",
        questions: [
          { id: 19, source: "113 會考", q: "下列詞語中的「落」字，何者與「月落星沉」的「落」字意義相同？", opts: ["(A) 下「落」不明", "(B) 草木疏「落」", "(C) 去三「落」四", "(D) 水「落」石出"], ans: "D", exp: "「月落星沉」的落 = 降下。(A) 落 = 停留處。(B) 落 = 稀疏。(C) 落 = 遺漏（讀ㄌㄚˋ）。(D) 落 = 降下，與題幹相同。" },
          { id: 20, source: "111 會考", q: "「修身以為弓，矯思以為矢，立義以為的，奠而後發，發必中矣。」句中「矯」字的意義，與下列何者最接近？", opts: ["(A)「矯」世勵俗", "(B)「矯」若遊龍", "(C)「矯」捷身手", "(D)「矯」託天命"], ans: "A", exp: "題幹「矯思」的矯 = 糾正。(A) 矯世 = 糾正世風，與題幹相同。(B) 矯 = 強健。(C) 矯 = 敏捷。(D) 矯 = 假託。" },
          { id: 21, source: "109 會考", q: "「此事關係重大，一定要在時限內完成，不得有誤。」句中「得」字的字義與下列何者相同？", opts: ["(A)「得」過且過", "(B) 相「得」益彰", "(C) 忘懷「得」失", "(D) 洋洋自「得」"], ans: "A", exp: "題幹「不得」的得 = 能夠。(A) 得過且過 = 能過就過，得 = 能夠，與題幹相同。(B) 得 = 配合。(C) 得 = 獲得。(D) 得 = 滿意。" },
        ],
      },
      fourGroup: {
        label: "四組單字比較",
        questions: [
          { id: 22, source: "108 會考", q: "下列選項「  」中的字，何者字義前後相同？", opts: ["(A) 人「微」言輕／出身寒「微」", "(B) 洞「悉」真相／「悉」數帶回", "(C) 茂林「修」竹／「修」築道路", "(D) 探本「窮」源／一「窮」二白"], ans: "A", exp: "(A) 微 = 卑微／卑微，前後相同。(B) 悉 = 知道／全部。(C) 修 = 長／建造。(D) 窮 = 追究到底／貧困。" },
          { id: 23, source: "107 會考", q: "下列文句「  」中的字，何者意義前後相同？", opts: ["(A) 辭「發」於衷／徵於色，「發」於聲，而後喻", "(B) 奇山異水，天下獨「絕」／名山秀水，令人讚不「絕」口", "(C) 心之所「向」，則或千或百，果然鶴也／大軍之至，所「向」披靡", "(D) 爺孃聞女來，出郭相扶「將」／欲辨此義與君論，復道桑關尚千里"], ans: "C", exp: "(A) 發 = 說出／表現。(B) 絕 = 獨特／停止。(C) 向 = 朝向／朝向，前後相同。(D) 將 = 攙扶／無關。" },
          { id: 24, source: "104 會考", q: "下列文句「  」中的字詞，何者意義前後相同？", opts: ["(A)「曾」不吝情去留／「曾」益其所不能", "(B)「安」能辨我是雄雌／爾「安」敢輕吾射", "(C)「行」拂亂其所為／月色入戶，欣然起「行」", "(D)「當」窗理雲鬢／使安期有此性，猶「當」無一豪可論"], ans: "B", exp: "(A) 曾 = 竟然／增加。(B) 安 = 怎麼／怎麼，前後相同。(C) 行 = 行為／行走。(D) 當 = 對著／應當。" },
        ],
      },
    },
  },
};

export default kaodianQuestions;
```

- [ ] **Step 2: Commit**

```bash
git add src/data/kaodianQuestions.js
git commit -m "feat: 新增考點練習題庫（24 題會考原題）"
```

---

### Task 3: 建立 KaodianPractice.jsx — 考點練習主元件

**Files:**
- Create: `src/KaodianPractice.jsx`

- [ ] **Step 1: 建立元件檔案**

`src/KaodianPractice.jsx`:

```jsx
import { useState, useMemo } from "react";
import kaodianQuestions from "./data/kaodianQuestions";

const COLOR_MAP = {
  vermillion: { main: "var(--vermillion)", light: "var(--vermillion-light)" },
  teal: { main: "var(--teal)", light: "var(--teal-light)" },
  gold: { main: "var(--gold)", light: "var(--gold-light)" },
};

function getTitle(pct) {
  if (pct === 100) return "✦ 墨寶大師 ✦";
  if (pct >= 80) return "書院秀才";
  if (pct >= 60) return "勤學書生";
  return "繼續修煉";
}

export default function KaodianPractice() {
  const [view, setView] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState({});
  const [slideKey, setSlideKey] = useState(0);

  const questions = useMemo(() => {
    if (!selectedCategory || !selectedSubcategory) return [];
    return kaodianQuestions[selectedCategory]?.subcategories[selectedSubcategory]?.questions || [];
  }, [selectedCategory, selectedSubcategory]);

  const currentQ = questions[currentIndex] || null;
  const totalQ = questions.length;
  const catData = selectedCategory ? kaodianQuestions[selectedCategory] : null;
  const colors = catData ? COLOR_MAP[catData.color] : null;

  const correctCount = useMemo(() => {
    return Object.values(results).filter(Boolean).length;
  }, [results]);

  const pct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

  const handleStartPractice = (catKey, subKey) => {
    setSelectedCategory(catKey);
    setSelectedSubcategory(subKey);
    setCurrentIndex(0);
    setUserAnswer(null);
    setAnswered(false);
    setResults({});
    setSlideKey(0);
    setView("practice");
  };

  const handleAnswer = (letter) => {
    if (answered) return;
    setUserAnswer(letter);
    setAnswered(true);
    const isCorrect = letter === currentQ.ans;
    setResults(prev => ({ ...prev, [currentQ.id]: isCorrect }));
  };

  const handleNext = () => {
    if (currentIndex + 1 >= totalQ) {
      setView("result");
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setUserAnswer(null);
    setAnswered(false);
    setSlideKey(prev => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserAnswer(null);
    setAnswered(false);
    setResults({});
    setSlideKey(0);
    setView("practice");
  };

  const handleBack = () => {
    setView("categories");
    setSelectedCategory(null);
    setSelectedSubcategory(null);
  };

  // ─── 分類頁 ───
  if (view === "categories") {
    return (
      <div className="max-w-3xl mx-auto mt-8 px-4 pb-20">
        <div className="text-center mb-8 pb-4" style={{ borderBottom: "2px solid var(--card-border)" }}>
          <h2 className="font-display text-2xl font-black tracking-widest" style={{ color: "var(--ink)" }}>
            ✦ 考點練習 ✦
          </h2>
          <p className="text-xs mt-2" style={{ color: "var(--ink-muted)" }}>
            依考點分類練習，逐題即時回饋
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(kaodianQuestions).map(([catKey, cat], catIdx) => {
            const c = COLOR_MAP[cat.color];
            const subEntries = Object.entries(cat.subcategories);
            const totalQuestions = subEntries.reduce((sum, [, sub]) => sum + sub.questions.length, 0);
            return (
              <div
                key={catKey}
                className={`category-card rounded-xl border p-5 ${catIdx === 0 ? "sm:row-span-2" : ""}`}
                style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
              >
                {/* 頂部色帶 */}
                <div className="h-[3px] rounded-full -mt-5 -mx-5 mb-4" style={{ background: c.main }} />
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-display font-bold text-lg" style={{ color: c.main }}>
                    {cat.label}
                  </h3>
                  <span className="text-xs ml-auto" style={{ color: "var(--ink-muted)" }}>{totalQuestions} 題</span>
                </div>
                <div className="flex flex-col gap-2">
                  {subEntries.map(([subKey, sub]) => (
                    <button
                      key={subKey}
                      onClick={() => handleStartPractice(catKey, subKey)}
                      className="option-item text-left px-4 py-2.5 rounded-lg border text-sm font-bold transition-all"
                      style={{ borderColor: c.main, background: c.light, color: c.main }}
                    >
                      {sub.label}
                      <span className="ml-1 opacity-60 font-normal">{sub.questions.length} 題</span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── 練習模式 ───
  if (view === "practice" && currentQ) {
    const isCorrect = userAnswer === currentQ.ans;
    const optLetters = ["A", "B", "C", "D"];
    const subLabel = kaodianQuestions[selectedCategory]?.subcategories[selectedSubcategory]?.label || "";

    return (
      <div className="max-w-3xl mx-auto mt-6 px-4 pb-20">
        {/* 麵包屑 + 進度條 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 text-xs mb-2" style={{ color: "var(--ink-muted)" }}>
            <button onClick={handleBack} className="hover:underline" style={{ color: colors.main }}>
              {catData.icon} {catData.label}
            </button>
            <span>›</span>
            <span>{subLabel}</span>
            <span className="ml-auto">第 {currentIndex + 1}/{totalQ} 題</span>
          </div>
          <div className="w-full rounded-full" style={{ background: "var(--card-border)", height: "3px" }}>
            <div
              className="progress-bar rounded-full"
              style={{ width: `${((currentIndex + (answered ? 1 : 0)) / totalQ) * 100}%`, background: colors.main }}
            />
          </div>
        </div>

        {/* 題目卡片 */}
        <div
          key={slideKey}
          className="slide-in rounded-xl border p-6"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", boxShadow: "0 2px 8px rgba(26,26,46,0.08)" }}
        >
          <div className="text-xs mb-3 font-bold" style={{ color: "var(--gold)" }}>
            {currentQ.source}
          </div>
          <p className="font-display font-bold text-[15px] leading-relaxed mb-5" style={{ color: "var(--ink)" }}>
            {currentQ.q}
          </p>

          {/* 選項 */}
          <div className="grid grid-cols-1 gap-2">
            {currentQ.opts.map((opt, oi) => {
              const letter = optLetters[oi];
              const isSelected = userAnswer === letter;
              const isAnswer = currentQ.ans === letter;

              let bg = "var(--parchment-light)";
              let border = "var(--card-border)";
              let color = "var(--ink)";
              let fontWeight = "normal";
              let textDecoration = "none";
              let opacity = "1";
              let animClass = "option-item";

              if (answered) {
                if (isSelected && isCorrect) {
                  bg = "var(--correct-light)"; border = "var(--correct)"; color = "var(--correct)"; fontWeight = "bold";
                  animClass = "option-item glow-pulse";
                } else if (isSelected && !isCorrect) {
                  bg = "var(--wrong-light)"; border = "var(--wrong)"; color = "var(--wrong)"; fontWeight = "bold"; textDecoration = "line-through";
                  animClass = "option-item shake";
                } else if (isAnswer) {
                  bg = "var(--correct-light)"; border = "var(--correct)"; color = "var(--correct)"; fontWeight = "600";
                } else {
                  opacity = "0.4";
                }
              }

              return (
                <div
                  key={oi}
                  onClick={() => handleAnswer(letter)}
                  className={`${animClass} px-4 py-3 rounded-lg border text-sm cursor-pointer`}
                  style={{ background: bg, borderColor: border, color, fontWeight, textDecoration, opacity }}
                >
                  {opt}
                </div>
              );
            })}
          </div>

          {/* 解析 */}
          {answered && (
            <div className="explanation-box mt-4 p-3 rounded-r-lg text-sm" style={{ color: "var(--ink-light)" }}>
              <span className="font-display font-bold" style={{ color: isCorrect ? "var(--correct)" : "var(--wrong)" }}>
                {isCorrect ? "✓ 答對了！" : `✗ 正確答案：${currentQ.ans}`}
              </span>
              <span className="ml-2">{currentQ.exp}</span>
            </div>
          )}

          {/* 下一題按鈕 */}
          {answered && (
            <div className="flex justify-end mt-5">
              <button
                onClick={handleNext}
                className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: "var(--teal)" }}
              >
                {currentIndex + 1 >= totalQ ? "查看結果" : "下一題 →"}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── 結果畫面 ───
  if (view === "result") {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (pct / 100) * circumference;

    return (
      <div className="max-w-3xl mx-auto mt-6 px-4 pb-20">
        <div
          className="relative overflow-hidden rounded-2xl p-8 text-center text-white"
          style={{ background: "linear-gradient(135deg, var(--ink) 0%, var(--ink-light) 50%, var(--vermillion) 150%)" }}
        >
          <div className="score-glow absolute top-0 right-0 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(184,134,11,0.3) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />

          <div className="relative z-10">
            {/* 環形進度圖 */}
            <div className="mx-auto w-32 h-32 relative mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle
                  cx="50" cy="50" r="45" fill="none"
                  stroke={colors?.main || "var(--gold)"}
                  strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  style={{ transition: "stroke-dashoffset 1s ease-out" }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display text-3xl font-black">{pct}%</span>
              </div>
            </div>

            <p className="font-display text-xl font-bold">{getTitle(pct)}</p>
            <p className="text-sm opacity-60 mt-1">{correctCount}/{totalQ} 題正確</p>

            {/* Mini recap */}
            <div className="flex justify-center gap-1.5 mt-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="w-3 h-3 rounded-full"
                  style={{ background: results[q.id] ? "var(--correct)" : "var(--wrong)" }}
                  title={`第${q.id}題：${results[q.id] ? "✓" : "✗"}`}
                />
              ))}
            </div>

            {/* 按鈕 */}
            <div className="flex justify-center gap-3 mt-6">
              <button
                onClick={handleRestart}
                className="px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
              >
                重新練習
              </button>
              <button
                onClick={handleBack}
                className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105"
                style={{ background: "var(--gold)", boxShadow: "0 4px 16px rgba(184,134,11,0.4)" }}
              >
                返回分類
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/KaodianPractice.jsx
git commit -m "feat: 新增考點練習元件（分類頁+練習+結果畫面）"
```

---

### Task 4: 更新 App.jsx — 模式切換與答題色同步

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: 新增 import 和模式 state**

在 `src/App.jsx` 頂部加入 import：

```js
import KaodianPractice from "./KaodianPractice";
```

在 App 函數內第一行加入 state：

```js
const [appMode, setAppMode] = useState("quiz"); // "quiz" | "kaodian"
```

- [ ] **Step 2: 在控制列標題列加入模式切換按鈕**

在標題列（`<h1>` 和教師按鈕之間），加入模式切換：

```jsx
{/* 模式切換 */}
<div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--gold)" }}>
  {[
    { key: "quiz", label: "✦ 測驗" },
    { key: "kaodian", label: "✦ 考點練習" },
  ].map(m => (
    <button
      key={m.key}
      onClick={() => setAppMode(m.key)}
      className="px-3 py-1 text-xs font-bold transition-all"
      style={{
        background: appMode === m.key ? "var(--gold)" : "var(--gold-light)",
        color: appMode === m.key ? "#fff" : "var(--gold)",
      }}
    >
      {m.label}
    </button>
  ))}
</div>
```

- [ ] **Step 3: 條件渲染主內容**

用 `appMode` 控制渲染。將現有的操作列、成績橫幅、標題卡、題目列表都包在 `{appMode === "quiz" && (...)}`  中。在外層最後加上：

```jsx
{appMode === "kaodian" && <KaodianPractice />}
```

同時，操作列（題庫分類、出題模式、按鈕等）只在 `appMode === "quiz"` 時顯示。

- [ ] **Step 4: 更新答題回饋色為 CSS 變數**

在 App.jsx 的題目列表中，將硬編碼的 Tailwind 色值替換：

```
#dcfce7 → var(--correct-light)
#22c55e → var(--correct)
#166534 → var(--correct)
#fef2f2 → var(--wrong-light)
#ef4444 → var(--wrong)
#b91c1c → var(--wrong)
#86efac → var(--correct)
#fca5a5 → var(--wrong)
#f0fdf4 → var(--correct-light)
```

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx
git commit -m "feat: App.jsx 新增模式切換與答題色 CSS 變數同步"
```

---

### Task 5: 建置驗證與推送

**Files:**
- No new files

- [ ] **Step 1: 執行建置**

```bash
npm run build
```

確認無編譯錯誤。

- [ ] **Step 2: 推送**

```bash
git push origin main
```

- [ ] **Step 3: 驗證部署**

等待 GitHub Actions 完成後，在 https://bradyclh.github.io/magic-quiz/ 確認：
- 模式切換按鈕正常
- 考點分類頁正確顯示三大分類和子分類
- 逐題練習：選答即時回饋、動畫效果、下一題按鈕
- 結果畫面：環形圖、成就評語、mini recap
- 切回測驗模式：現有功能不受影響
