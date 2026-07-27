import React from "react";
import { Recycle, Scan, BookOpen, MessageSquare, Award, MapPin, Leaf, Sparkles } from "lucide-react";

interface NavbarProps {
  activeTab: "scan" | "encyclopedia" | "ai-chat" | "quiz";
  setActiveTab: (tab: "scan" | "encyclopedia" | "ai-chat" | "quiz") => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  ecoPoints: number;
  scanCount: number;
}

const REGIONS = [
  "전국 (표준)",
  "서울특별시",
  "경기도",
  "인천광역시",
  "부산광역시",
  "대구광역시",
  "광주광역시",
  "대전광역시",
  "울산광역시",
  "세종특별자치시",
  "강원특별자치도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedRegion,
  setSelectedRegion,
  ecoPoints,
  scanCount,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-emerald-500 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
              <Recycle className="w-6 h-6 sm:w-7 sm:h-7 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl sm:text-2xl text-emerald-950 tracking-tight">
                  에코스캔 <span className="text-emerald-500 font-bold text-lg sm:text-xl">EcoScan</span>
                </span>
                <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 hidden xs:flex">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" /> AI 센서
                </span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold hidden sm:block">스마트 AI 분리수거 자동 분류 & 세척 가이드</p>
            </div>
          </div>

          {/* Region selector & Eco stats pill */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Region dropdown */}
            <div className="relative flex items-center bg-emerald-100/70 hover:bg-emerald-100 transition rounded-2xl border-2 border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-900">
              <MapPin className="w-4 h-4 text-emerald-600 mr-1 shrink-0" />
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="bg-transparent font-extrabold cursor-pointer focus:outline-hidden pr-1"
                aria-label="지역 선택"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Eco Points */}
            <div className="flex items-center space-x-2 bg-amber-400 border-2 border-emerald-900 text-emerald-950 px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-xs">
              <Leaf className="w-4 h-4 text-emerald-950" />
              <span>{ecoPoints} P</span>
              <span className="opacity-40">|</span>
              <span className="hidden xs:inline">{scanCount}회 배출</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-t-2 border-emerald-100 py-2.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("scan")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap cursor-pointer ${
              activeTab === "scan"
                ? "bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800"
                : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-200/60"
            }`}
          >
            <Scan className="w-4 h-4" />
            <span>AI 센서 스캐너</span>
          </button>

          <button
            onClick={() => setActiveTab("encyclopedia")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap cursor-pointer ${
              activeTab === "encyclopedia"
                ? "bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800"
                : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-200/60"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>분리수거 백과</span>
          </button>

          <button
            onClick={() => setActiveTab("ai-chat")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap cursor-pointer ${
              activeTab === "ai-chat"
                ? "bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800"
                : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-200/60"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>AI 1:1 질문</span>
          </button>

          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition whitespace-nowrap cursor-pointer ${
              activeTab === "quiz"
                ? "bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800"
                : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border-2 border-emerald-200/60"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>O/X 퀴즈 & 기록</span>
          </button>
        </div>
      </div>
    </header>
  );
};
