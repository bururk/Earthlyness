import React, { useState } from "react";
import { MessageSquare, Send, Sparkles, User, Bot, HelpCircle, Loader2 } from "lucide-react";

interface AiAssistantViewProps {
  selectedRegion: string;
}

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
  time: string;
}

const SUGGESTED_QUESTIONS = [
  "치킨 먹고 남은 뼈는 음식물 쓰레기인가요?",
  "스프링 노트 철사와 표지 비닐 배출 방법은?",
  "고추장통 씻어도 빨갛게 물든 건 재활용 되나요?",
  "아이스팩과 에어캡 뽁뽁이는 어디로 버려야 하나요?",
  "깨진 도자기 그릇과 전구 버리는 법 알려주세요",
];

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({ selectedRegion }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "ai",
      text: `안녕하세요! 🌿 분리수거 AI 전문 박사입니다.\n지역 [${selectedRegion}] 기준 및 한국 환경부 분리배출 규정에 맞춰 어떤 애매한 쓰레기라도 친절하게 분류법을 안내해 드립니다. 궁금한 점을 물어보세요!`,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ask-waste-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: textToSend,
          region: selectedRegion,
        }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        sender: "ai",
        text: data.answer || "죄송합니다, 답변을 생성하는 중 오류가 발생했습니다.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "답변을 불러오는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-900 rounded-[32px] p-6 sm:p-7 text-white shadow-lg border-b-8 border-emerald-950">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-md">
            <Bot className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              AI 1:1 분리수거 해결사
              <Sparkles className="w-5 h-5 text-amber-300" />
            </h2>
            <p className="text-xs sm:text-sm text-emerald-200 font-bold mt-0.5">
              분리수거 방법이 헷갈리거나 애매한 모든 종류의 쓰레기를 질문하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="bg-white rounded-3xl p-5 border-b-8 border-emerald-200 shadow-sm">
        <h4 className="text-xs sm:text-sm font-black text-emerald-950 mb-3 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-600" /> 자주 묻는 질문 칩
        </h4>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs font-black bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-200 px-3.5 py-2 rounded-2xl transition cursor-pointer text-emerald-900 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border-b-8 border-emerald-200 min-h-[380px] max-h-[520px] overflow-y-auto space-y-4 shadow-sm">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${
              msg.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                msg.sender === "user"
                  ? "bg-slate-900 text-white"
                  : "bg-emerald-500 text-white"
              }`}
            >
              {msg.sender === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            <div className={`max-w-[85%] ${msg.sender === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-bold inline-block text-left ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white rounded-tr-xs shadow-xs"
                    : "bg-emerald-50 text-emerald-950 border-2 border-emerald-200 rounded-tl-xs"
                }`}
              >
                {msg.text}
              </div>
              <span className="block text-[10px] text-emerald-700 mt-1 px-1 font-mono font-bold">{msg.time}</span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center space-x-2 text-emerald-900 font-extrabold text-xs py-2.5 px-4 bg-emerald-100 rounded-2xl w-fit border-2 border-emerald-300">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
            <span>AI 가 답변을 분석 및 작성하고 있습니다...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-3"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="예: 깨진 조명 전구는 어디에 버려야 하나요?"
          disabled={isLoading}
          className="flex-1 px-5 py-3.5 bg-white border-2 border-emerald-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3.5 rounded-2xl font-black text-sm transition cursor-pointer flex items-center gap-2 shadow-md disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">전송</span>
        </button>
      </form>
    </div>
  );
};
