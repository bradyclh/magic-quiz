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
