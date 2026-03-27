import { useState, useEffect, useMemo } from "react";
import ziXingQuestions from "./data/ziXingQuestions";
import ziYiQuestions from "./data/ziYiQuestions";

export default function App() {
  const [category, setCategory] = useState("ziXing");
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [testMode, setTestMode] = useState("original");

  const activeBank = useMemo(() => {
    if (category === "ziXing") return ziXingQuestions;
    if (category === "ziYi") return ziYiQuestions;
    return [
      ...ziXingQuestions,
      ...ziYiQuestions.map(q => ({ ...q, id: q.id + ziXingQuestions.length })),
    ];
  }, [category]);

  const [currentQuestions, setCurrentQuestions] = useState(activeBank);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (testMode === "original") {
      setCurrentQuestions(activeBank);
    } else {
      const shuffled = [...activeBank].sort(() => 0.5 - Math.random());
      setCurrentQuestions(shuffled.slice(0, 20));
    }
    setSelectedAnswers({});
    setShowResults(false);
  }, [testMode, activeBank]);

  const handleSelect = (qId, letter) => {
    if (showResults) return;
    setSelectedAnswers(prev => ({ ...prev, [qId]: letter }));
  };

  const handleSubmit = () => setShowResults(true);

  const handleReshuffle = () => {
    const shuffled = [...activeBank].sort(() => 0.5 - Math.random());
    setCurrentQuestions(shuffled.slice(0, 20));
    setSelectedAnswers({});
    setShowResults(false);
  };

  const score = useMemo(() => {
    if (!showResults) return null;
    let correct = 0;
    currentQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.ans) correct++;
    });
    return correct;
  }, [showResults, selectedAnswers, currentQuestions]);

  const categoryLabel = category === "ziXing" ? "字形" : category === "ziYi" ? "字義" : "綜合";
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen">
      {/* ─── 控制列 ─── */}
      <header className="control-bar sticky top-0 z-50 border-b px-4 py-3" style={{ background: "rgba(247,242,233,0.92)", borderColor: "var(--card-border)" }}>
        <div className="max-w-3xl mx-auto">
          {/* 標題列 */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-lg font-bold tracking-wide" style={{ color: "var(--ink)" }}>
              <span className="mr-1">✦</span>
              魔法學園<span className="mx-1" style={{ color: "var(--gold)" }}>・</span>{categoryLabel}測驗
            </h1>
            <button
              onClick={() => setIsTeacherMode(!isTeacherMode)}
              className="px-3 py-1 rounded-full text-xs font-bold border-2 transition-all"
              style={{
                borderColor: isTeacherMode ? "var(--vermillion)" : "var(--teal)",
                background: isTeacherMode ? "var(--vermillion-light)" : "var(--teal-light)",
                color: isTeacherMode ? "var(--vermillion)" : "var(--teal)",
              }}
            >
              {isTeacherMode ? "🧙 教師版" : "🎓 學生版"}
            </button>
          </div>

          {/* 操作列 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 題庫分類 */}
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--gold)" }}>
              {[
                { key: "ziXing", label: "字形", count: ziXingQuestions.length },
                { key: "ziYi", label: "字義", count: ziYiQuestions.length },
                { key: "all", label: "綜合", count: ziXingQuestions.length + ziYiQuestions.length },
              ].map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className="px-3 py-1.5 text-xs font-bold transition-all"
                  style={{
                    background: category === cat.key ? "var(--gold)" : "var(--gold-light)",
                    color: category === cat.key ? "#fff" : "var(--gold)",
                  }}
                >
                  {cat.label}
                  <span className="ml-0.5 opacity-70">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* 出題模式 */}
            <select
              className="px-2 py-1.5 rounded-lg border text-xs font-bold"
              style={{ borderColor: "var(--card-border)", background: "var(--card-bg)", color: "var(--ink)" }}
              value={testMode}
              onChange={e => setTestMode(e.target.value)}
            >
              <option value="original">全部 {activeBank.length} 題</option>
              <option value="random">隨機 20 題</option>
            </select>

            {/* 重新抽題 */}
            {!isTeacherMode && !showResults && testMode === "random" && (
              <button
                onClick={handleReshuffle}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105"
                style={{ background: "var(--gold)" }}
              >
                🎲 重新抽題
              </button>
            )}

            {/* 交卷 */}
            {!isTeacherMode && !showResults && (
              <button
                onClick={handleSubmit}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105 ml-auto"
                style={{ background: "var(--teal)" }}
              >
                交卷批改
                {answeredCount > 0 && (
                  <span className="ml-1 opacity-70">({answeredCount}/{currentQuestions.length})</span>
                )}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─── 成績橫幅 ─── */}
      {showResults && !isTeacherMode && (
        <div className="max-w-3xl mx-auto mt-6 px-4">
          <div className="relative overflow-hidden rounded-2xl p-8 text-center text-white" style={{ background: "linear-gradient(135deg, var(--ink) 0%, var(--ink-light) 50%, var(--vermillion) 150%)" }}>
            {/* 裝飾光暈 */}
            <div className="score-glow absolute top-0 right-0 w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(184,134,11,0.3) 0%, transparent 70%)", transform: "translate(30%, -30%)" }} />
            <div className="score-glow absolute bottom-0 left-0 w-32 h-32 rounded-full" style={{ background: "radial-gradient(circle, rgba(194,59,34,0.2) 0%, transparent 70%)", transform: "translate(-30%, 30%)", animationDelay: "1.2s" }} />

            <div className="relative z-10">
              <p className="text-sm opacity-70 font-display">你的成績</p>
              <p className="font-display text-6xl font-black mt-2 tracking-tight">
                {score}<span className="text-3xl opacity-50 mx-1">/</span><span className="text-3xl opacity-70">{currentQuestions.length}</span>
              </p>
              <p className="text-sm mt-2 opacity-60">
                正確率 {Math.round((score / currentQuestions.length) * 100)}%
              </p>

              <button
                onClick={() => { setSelectedAnswers({}); setShowResults(false); }}
                className="mt-5 px-5 py-2 rounded-full text-sm font-bold transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}
              >
                重新作答
              </button>

              {testMode === "random" && (
                <div className="mt-5 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.15)" }}>
                  <p className="text-xs opacity-50 mb-2">想繼續挑戰嗎？</p>
                  <button
                    onClick={handleReshuffle}
                    className="px-6 py-2.5 rounded-full text-sm font-bold transition-all hover:scale-105"
                    style={{ background: "var(--gold)", boxShadow: "0 4px 20px rgba(184,134,11,0.4)" }}
                  >
                    🎲 再抽 20 題
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── 標題卡 ─── */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <div className="text-center mb-8 pb-4" style={{ borderBottom: "2px solid var(--card-border)" }}>
          <h2 className="font-display text-2xl font-black tracking-widest" style={{ color: "var(--ink)" }}>
            ✦ 魔法學園・{categoryLabel}測驗卷 ✦
          </h2>
          <p className="text-xs mt-2 tracking-wide" style={{ color: "var(--ink-muted)" }}>
            共 {currentQuestions.length} 題 ・ {isTeacherMode ? "教師解析版" : "學生作答版"}
          </p>
        </div>
      </div>

      {/* ─── 題目列表 ─── */}
      <div className="max-w-3xl mx-auto px-4 pb-24 space-y-5">
        {currentQuestions.map((q, idx) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.ans;
          const optLetters = ["A", "B", "C", "D"];

          let cardBorder = "var(--card-border)";
          let cardBg = "var(--card-bg)";
          if (showResults && userAns) {
            cardBorder = isCorrect ? "#86efac" : "#fca5a5";
            cardBg = isCorrect ? "#f0fdf4" : "#fef2f2";
          }

          return (
            <div
              key={q.id}
              className="question-card rounded-xl border p-5 transition-all"
              style={{
                borderColor: cardBorder,
                background: cardBg,
                boxShadow: "0 1px 4px rgba(26,26,46,0.06)",
                animationDelay: `${idx * 0.03}s`,
              }}
            >
              {/* 題幹 */}
              <div className="flex gap-3 mb-4">
                <span
                  className="font-display font-black text-lg min-w-[2rem] text-right"
                  style={{ color: "var(--vermillion)" }}
                >
                  {idx + 1}
                </span>
                <p className="font-medium leading-relaxed text-[15px]" style={{ color: "var(--ink)" }}>
                  {q.q}
                </p>
              </div>

              {/* 選項 */}
              <div className="grid grid-cols-1 gap-2 ml-10">
                {q.opts.map((opt, oi) => {
                  const letter = optLetters[oi];
                  const isSelected = userAns === letter;
                  const isAnswer = q.ans === letter;

                  let bg = "var(--parchment-light)";
                  let border = "var(--card-border)";
                  let color = "var(--ink)";
                  let fontWeight = "normal";
                  let opacity = "1";
                  let textDecoration = "none";
                  let extraShadow = "none";

                  if (isTeacherMode && isAnswer) {
                    bg = "var(--vermillion-light)";
                    border = "var(--vermillion)";
                    color = "var(--vermillion)";
                    fontWeight = "bold";
                  } else if (showResults) {
                    if (isSelected && isCorrect) {
                      bg = "#dcfce7"; border = "#22c55e"; color = "#166534"; fontWeight = "bold";
                    } else if (isSelected && !isCorrect) {
                      bg = "#fef2f2"; border = "#ef4444"; color = "#b91c1c"; fontWeight = "bold"; textDecoration = "line-through"; opacity = "0.8";
                    } else if (isAnswer) {
                      bg = "#dcfce7"; border = "#22c55e"; color = "#166534"; fontWeight = "600";
                    } else {
                      opacity = "0.45";
                    }
                  } else if (isSelected) {
                    bg = "var(--gold-light)";
                    border = "var(--gold)";
                    color = "var(--ink)";
                    fontWeight = "bold";
                    extraShadow = "0 0 0 2px rgba(184,134,11,0.2)";
                  }

                  return (
                    <div
                      key={oi}
                      onClick={() => !isTeacherMode && handleSelect(q.id, letter)}
                      className="option-item px-4 py-2.5 rounded-lg border text-sm cursor-pointer"
                      style={{
                        background: bg,
                        borderColor: border,
                        color,
                        fontWeight,
                        opacity,
                        textDecoration,
                        boxShadow: extraShadow,
                      }}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>

              {/* 解析 */}
              {(isTeacherMode || (showResults && userAns)) && (
                <div className="explanation-box mt-4 ml-10 p-3 rounded-r-lg text-sm" style={{ color: "var(--ink-light)" }}>
                  <span className="font-display font-bold" style={{ color: "var(--gold)" }}>
                    【解答：{q.ans}】
                  </span>
                  <span className="ml-2">{q.exp}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
