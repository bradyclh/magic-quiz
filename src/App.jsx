import { useState, useEffect, useMemo } from "react";
import ziXingQuestions from "./data/ziXingQuestions";
import ziYiQuestions from "./data/ziYiQuestions";

const QUESTIONS_PER_PAGE = 7;

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

  const handleSubmit = () => {
    setShowResults(true);
  };

  const score = useMemo(() => {
    if (!showResults) return null;
    let correct = 0;
    currentQuestions.forEach(q => {
      if (selectedAnswers[q.id] === q.ans) correct++;
    });
    return correct;
  }, [showResults, selectedAnswers, currentQuestions]);

  const totalPages = Math.ceil(currentQuestions.length / QUESTIONS_PER_PAGE);
  const categoryLabel = category === "ziXing" ? "字形" : category === "ziYi" ? "字義" : "綜合";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-pink-50">
      {/* Control Bar */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-md border-b-2 border-pink-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-2 text-pink-600 font-bold text-lg">
            <span className="text-2xl">✨</span> 魔法學園・{categoryLabel}測驗
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Selector */}
            <div className="flex rounded-lg overflow-hidden border-2 border-amber-300">
              {[
                { key: "ziXing", label: "字形篇", bank: ziXingQuestions },
                { key: "ziYi", label: "字義篇", bank: ziYiQuestions },
                { key: "all", label: "綜合", bank: [...ziXingQuestions, ...ziYiQuestions] },
              ].map(({ key, label, bank }) => (
                <button
                  key={key}
                  onClick={() => setCategory(key)}
                  className={`px-3 py-2 text-sm font-semibold transition-all ${
                    category === key
                      ? "bg-amber-400 text-white"
                      : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  {label}({bank.length})
                </button>
              ))}
            </div>
            {/* Teacher / Student Toggle */}
            <button
              onClick={() => setIsTeacherMode(!isTeacherMode)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                isTeacherMode
                  ? "bg-purple-100 border-purple-400 text-purple-700"
                  : "bg-blue-50 border-blue-300 text-blue-700"
              }`}
            >
              {isTeacherMode ? "🧙 教師版" : "🎓 學生版"}
            </button>
            {/* Mode Select */}
            <select
              className="px-3 py-2 rounded-lg border-2 border-pink-300 bg-pink-50 text-pink-800 text-sm font-medium"
              value={testMode}
              onChange={e => setTestMode(e.target.value)}
            >
              <option value="original">全部 {activeBank.length} 題</option>
              <option value="random">隨機抽 20 題</option>
            </select>
            {/* Submit */}
            {!isTeacherMode && !showResults && (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold shadow hover:shadow-lg transition-all hover:scale-105"
              >
                交卷批改
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Banner */}
      {showResults && !isTeacherMode && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-6 shadow-xl text-center">
            <div className="text-lg opacity-90">你的成績</div>
            <div className="text-5xl font-black mt-1">
              {score} / {currentQuestions.length}
            </div>
            <div className="text-sm mt-2 opacity-80">
              正確率 {Math.round((score / currentQuestions.length) * 100)}%
            </div>
            <button
              onClick={() => { setSelectedAnswers({}); setShowResults(false); }}
              className="mt-4 px-5 py-2 bg-white/20 hover:bg-white/30 rounded-full text-sm font-semibold transition"
            >
              重新作答
            </button>
          </div>
        </div>
      )}

      {/* Title Card */}
      <div className="max-w-4xl mx-auto mt-6 px-4">
        <div className="text-center mb-6 pb-4 border-b-2 border-pink-200">
          <h1 className="text-2xl font-black text-indigo-900 tracking-wider">
            ✨ 魔法學園・{categoryLabel}測驗卷 ✨
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            共 {currentQuestions.length} 題 ・ {isTeacherMode ? "教師解析版" : "學生作答版"}
          </p>
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-4xl mx-auto px-4 pb-20 space-y-4">
        {currentQuestions.map((q, idx) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.ans;
          const optLetters = ["A", "B", "C", "D"];

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl shadow-sm border-2 p-4 transition-all ${
                showResults && userAns
                  ? isCorrect
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-red-300 bg-red-50/30"
                  : "border-slate-200 hover:border-pink-200"
              }`}
            >
              {/* Question Text */}
              <div className="flex gap-2 mb-3">
                <span className="font-black text-indigo-600 min-w-[2rem]">
                  {idx + 1}.
                </span>
                <p className="font-medium text-slate-800 leading-relaxed">
                  {q.q}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 ml-8">
                {q.opts.map((opt, oi) => {
                  const letter = optLetters[oi];
                  const isSelected = userAns === letter;
                  const isAnswer = q.ans === letter;

                  let optStyle = "border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 cursor-pointer";

                  if (isTeacherMode && isAnswer) {
                    optStyle = "border-pink-400 bg-pink-50 text-pink-800 font-bold";
                  } else if (showResults) {
                    if (isSelected && isCorrect) {
                      optStyle = "border-emerald-400 bg-emerald-50 text-emerald-800 font-bold";
                    } else if (isSelected && !isCorrect) {
                      optStyle = "border-red-400 bg-red-50 text-red-700 font-bold line-through";
                    } else if (isAnswer) {
                      optStyle = "border-emerald-400 bg-emerald-50 text-emerald-700 font-semibold";
                    } else {
                      optStyle = "border-slate-200 bg-slate-50 opacity-60";
                    }
                  } else if (isSelected) {
                    optStyle = "border-indigo-400 bg-indigo-50 text-indigo-800 font-semibold ring-2 ring-indigo-300";
                  }

                  return (
                    <div
                      key={oi}
                      onClick={() => !isTeacherMode && handleSelect(q.id, letter)}
                      className={`px-3 py-2 rounded-lg border-2 text-sm transition-all ${optStyle}`}
                    >
                      {opt}
                    </div>
                  );
                })}
              </div>

              {/* Explanation (teacher mode or after submit) */}
              {(isTeacherMode || (showResults && userAns)) && (
                <div className="mt-3 ml-8 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-lg text-sm">
                  <span className="font-bold text-indigo-700">
                    【解答：{q.ans}】
                  </span>
                  <span className="text-slate-700 ml-2">{q.exp}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
