import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { ScannerView } from "./components/ScannerView";
import { EncyclopediaView } from "./components/EncyclopediaView";
import { AiAssistantView } from "./components/AiAssistantView";
import { QuizView } from "./components/QuizView";
import { WasteAnalysisResult, ScanLog } from "./types";
import { Sparkles, Recycle, ShieldCheck, Heart } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"scan" | "encyclopedia" | "ai-chat" | "quiz">("scan");
  const [selectedRegion, setSelectedRegion] = useState<string>("전국 (표준)");
  const [ecoPoints, setEcoPoints] = useState<number>(50);
  const [scanLogs, setScanLogs] = useState<ScanLog[]>([]);

  // Load saved state from localStorage
  useEffect(() => {
    try {
      const savedPoints = localStorage.getItem("ecoscan_points");
      if (savedPoints) setEcoPoints(parseInt(savedPoints, 10));

      const savedLogs = localStorage.getItem("ecoscan_logs");
      if (savedLogs) setScanLogs(JSON.parse(savedLogs));
    } catch (e) {
      console.error("LocalStorage load error:", e);
    }
  }, []);

  // Save new scan log
  const handleSaveScan = (result: WasteAnalysisResult) => {
    const newLog: ScanLog = {
      id: "scan-" + Date.now(),
      timestamp: new Date().toLocaleString("ko-KR", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      itemName: result.itemName,
      category: result.category,
      recyclable: result.recyclable,
      imageUrl: result.imageUrl,
      pointsEarned: 10,
    };

    const updatedLogs = [newLog, ...scanLogs];
    const updatedPoints = ecoPoints + 10;

    setScanLogs(updatedLogs);
    setEcoPoints(updatedPoints);

    try {
      localStorage.setItem("ecoscan_points", updatedPoints.toString());
      localStorage.setItem("ecoscan_logs", JSON.stringify(updatedLogs));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  };

  const handleClearLogs = () => {
    setScanLogs([]);
    try {
      localStorage.removeItem("ecoscan_logs");
    } catch (e) {
      console.error("LocalStorage clear error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        ecoPoints={ecoPoints}
        scanCount={scanLogs.length}
      />

      {/* Main Content View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "scan" && (
          <ScannerView onSaveScan={handleSaveScan} selectedRegion={selectedRegion} />
        )}

        {activeTab === "encyclopedia" && <EncyclopediaView />}

        {activeTab === "ai-chat" && <AiAssistantView selectedRegion={selectedRegion} />}

        {activeTab === "quiz" && (
          <QuizView scanLogs={scanLogs} onClearLogs={handleClearLogs} ecoPoints={ecoPoints} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t-4 border-emerald-500 py-6 mt-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-xs">
              <Recycle className="w-4 h-4" />
            </div>
            <span className="font-black text-emerald-950">EcoScan AI 분리수거 스캐너</span>
            <span className="text-emerald-300">|</span>
            <span className="text-emerald-700 font-medium">환경부 분리배출 표준 지침 준수</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-emerald-800 font-bold">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> AI 카메라 스캔 보안 유지
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-rose-500 fill-current" /> 자원순환과 지구를 지키는 습관
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
