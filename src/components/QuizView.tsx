import React, { useState } from "react";
import { Award, Check, X, RotateCcw, Leaf, Trash2, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import { QUIZ_LIST } from "../data/wasteData";
import { ScanLog } from "../types";
import { playScanBeep } from "../utils/audio";

interface QuizViewProps {
  scanLogs: ScanLog[];
  onClearLogs: () => void;
  ecoPoints: number;
}

export const QuizView: React.FC<QuizViewProps> = ({ scanLogs, onClearLogs, ecoPoints }) => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isQuizFinished, setIsQuizFinished] = useState<boolean>(false);

  const quiz = QUIZ_LIST[currentQuizIdx];

  const handleAnswer = (ans: boolean) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(ans);

    const isCorrect = ans === quiz.isRecyclable;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playScanBeep("success");
    } else {
      playScanBeep("error");
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    if (currentQuizIdx < QUIZ_LIST.length - 1) {
      setCurrentQuizIdx((prev) => prev + 1);
    } else {
      setIsQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuizIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setIsQuizFinished(false);
  };

  return (
    <div className="space-y-8">
      {/* Quiz Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-b-8 border-emerald-200 border-2 border-emerald-100 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-4">
          <div className="flex items-center space-x-2">
            <Award className="w-7 h-7 text-amber-500" />
            <h2 className="text-lg sm:text-xl font-black text-emerald-950">오늘의 O/X 분리수거 상식 퀴즈 🏆</h2>
          </div>
          <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full border border-emerald-300">
            {currentQuizIdx + 1} / {QUIZ_LIST.length}
          </span>
        </div>

        {!isQuizFinished ? (
          <div className="space-y-6">
            <div className="bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 text-center">
              <span className="text-xs font-black text-emerald-800 uppercase tracking-widest bg-emerald-200/80 px-3 py-1 rounded-full border border-emerald-300">
                카테고리: {quiz.category}
              </span>
              <h3 className="text-lg sm:text-2xl font-black text-emerald-950 mt-4 leading-relaxed">
                "{quiz.question}"
              </h3>
            </div>

            {/* O / X Answer Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer(true)}
                disabled={selectedAnswer !== null}
                className={`p-6 sm:p-8 rounded-3xl font-black text-3xl flex flex-col items-center justify-center space-y-2 border-4 transition cursor-pointer shadow-md ${
                  selectedAnswer === true
                    ? quiz.isRecyclable === true
                      ? "bg-emerald-600 border-emerald-700 text-white shadow-lg"
                      : "bg-rose-600 border-rose-700 text-white shadow-lg"
                    : "bg-emerald-50 border-emerald-300 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-500"
                } disabled:opacity-80`}
              >
                <div className="w-16 h-16 rounded-2xl border-4 border-current flex items-center justify-center text-4xl font-black">
                  O
                </div>
                <span className="text-sm font-black uppercase tracking-wider">그렇다 (참)</span>
              </button>

              <button
                onClick={() => handleAnswer(false)}
                disabled={selectedAnswer !== null}
                className={`p-6 sm:p-8 rounded-3xl font-black text-3xl flex flex-col items-center justify-center space-y-2 border-4 transition cursor-pointer shadow-md ${
                  selectedAnswer === false
                    ? quiz.isRecyclable === false
                      ? "bg-emerald-600 border-emerald-700 text-white shadow-lg"
                      : "bg-rose-600 border-rose-700 text-white shadow-lg"
                    : "bg-rose-50 border-rose-300 text-rose-900 hover:bg-rose-100 hover:border-rose-500"
                } disabled:opacity-80`}
              >
                <div className="w-16 h-16 rounded-2xl border-4 border-current flex items-center justify-center text-4xl font-black">
                  X
                </div>
                <span className="text-sm font-black uppercase tracking-wider">아니다 (거짓)</span>
              </button>
            </div>

            {/* Explanation box after answer */}
            {selectedAnswer !== null && (
              <div
                className={`p-6 rounded-3xl border-2 space-y-3 ${
                  selectedAnswer === quiz.isRecyclable
                    ? "bg-emerald-100/90 border-emerald-400 text-emerald-950"
                    : "bg-rose-100/90 border-rose-400 text-rose-950"
                }`}
              >
                <div className="flex items-center space-x-2 font-black text-base sm:text-lg">
                  {selectedAnswer === quiz.isRecyclable ? (
                    <>
                      <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                      <span className="text-emerald-950">정답입니다! (+10P 획득) 🎉</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-6 h-6 text-rose-700" />
                      <span className="text-rose-950">아쉽네요! 오답입니다.</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm leading-relaxed font-extrabold">
                  {quiz.explanation}
                </p>

                <button
                  onClick={handleNext}
                  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 px-6 rounded-2xl text-base sm:text-lg shadow-[0_6px_0_#059669] hover:shadow-[0_2px_0_#059669] hover:translate-y-1 transition cursor-pointer"
                >
                  {currentQuizIdx < QUIZ_LIST.length - 1 ? "다음 문제 풀기 →" : "결과 확인하기"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 space-y-5">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 border-4 border-amber-300 text-amber-600 mx-auto flex items-center justify-center text-4xl font-black shadow-md">
              🏆
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-emerald-950">퀴즈 완료!</h3>
            <p className="text-base font-bold text-emerald-800">
              총 {QUIZ_LIST.length}문제 중 <span className="text-emerald-600 font-black text-xl">{score}문제</span>를 맞히셨습니다.
            </p>

            <button
              onClick={resetQuiz}
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black px-8 py-4 rounded-2xl text-base shadow-[0_6px_0_#059669] hover:shadow-[0_2px_0_#059669] hover:translate-y-1 transition cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" />
              <span>퀴즈 다시 풀기</span>
            </button>
          </div>
        )}
      </div>

      {/* History Log Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-b-8 border-emerald-200 border-2 border-emerald-100 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b-2 border-emerald-100 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-emerald-950 flex items-center gap-2">
              <Leaf className="w-6 h-6 text-emerald-600" />
              나의 분리수거 스캔 및 배출 기록
            </h2>
            <p className="text-xs text-emerald-800 mt-1 font-bold">
              총 누적 포인트: <span className="font-black text-amber-600 text-sm">{ecoPoints} P</span> | 환경 보호에 기여 중 🌿
            </p>
          </div>

          {scanLogs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="flex items-center space-x-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-200 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>기록 삭제</span>
            </button>
          )}
        </div>

        {scanLogs.length === 0 ? (
          <div className="text-center py-12 text-emerald-700 text-xs sm:text-sm font-bold bg-emerald-50/50 rounded-2xl border border-emerald-100">
            아직 저장된 스캔 기록이 없습니다. AI 센서 스캐너 탭에서 쓰레기를 분석하고 기록을 남겨보세요!
          </div>
        ) : (
          <div className="space-y-3">
            {scanLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border-2 border-emerald-200 hover:border-emerald-400 transition"
              >
                <div className="flex items-center space-x-3.5">
                  {log.imageUrl ? (
                    <img
                      src={log.imageUrl}
                      alt={log.itemName}
                      className="w-14 h-14 rounded-2xl object-cover bg-emerald-100 border-2 border-emerald-300 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
                      Eco
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm sm:text-base font-black text-emerald-950">{log.itemName}</h4>
                    <div className="flex items-center space-x-2 text-xs text-emerald-800 mt-1">
                      <span className="font-black text-emerald-900 bg-emerald-100 px-2.5 py-0.5 rounded-md border border-emerald-300">
                        {log.category}
                      </span>
                      <span className="flex items-center gap-1 font-mono font-bold text-emerald-700">
                        <Calendar className="w-3.5 h-3.5" />
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs sm:text-sm font-black text-emerald-950 bg-amber-300 px-3 py-1.5 rounded-xl border border-amber-400 shadow-xs">
                    +{log.pointsEarned} P
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
