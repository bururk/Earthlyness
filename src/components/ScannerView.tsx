import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  Upload,
  Scan,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Leaf,
  RotateCcw,
  Check,
  Zap,
  Info,
  Droplets,
  Soup,
  Package,
  Milk,
  Flame,
  X,
  Search,
} from "lucide-react";
import { SampleItemPreset, WasteAnalysisResult } from "../types";
import { PRESET_ANALYSIS_RESULTS, SAMPLE_PRESETS } from "../data/wasteData";
import { playScanBeep } from "../utils/audio";

interface ScannerViewProps {
  onSaveScan: (result: WasteAnalysisResult) => void;
  selectedRegion: string;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onSaveScan, selectedRegion }) => {
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanStepText, setScanStepText] = useState<string>("");
  const [scanProgress, setScanProgress] = useState<number>(0);

  const [result, setResult] = useState<WasteAnalysisResult | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [hasSaved, setHasSaved] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start camera stream
  const startCamera = async () => {
    setCameraError(null);
    setPreviewImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.error("Camera access error:", err);
      setCameraError("카메라를 켤 수 없습니다. 파일 업로드 또는 아래 샘플 스캔을 이용해 주세요.");
      setIsCameraActive(false);
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Capture image from live camera feed
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setPreviewImage(dataUrl);
      stopCamera();
      analyzeImage(dataUrl);
    }
  };

  // File Upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setPreviewImage(base64);
        stopCamera();
        analyzeImage(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset sample selection
  const handleSelectPreset = (preset: SampleItemPreset) => {
    setPreviewImage(preset.image);
    stopCamera();
    if (PRESET_ANALYSIS_RESULTS[preset.id]) {
      runSimulatedScan(PRESET_ANALYSIS_RESULTS[preset.id], preset.image);
    } else {
      analyzeTextQuery(preset.query, preset.image);
    }
  };

  // Simulated scan animation with sound
  const runSimulatedScan = (data: WasteAnalysisResult, imgUrl?: string) => {
    if (soundEnabled) playScanBeep("scan");
    setIsScanning(true);
    setScanProgress(0);
    setResult(null);
    setHasSaved(false);
    setCompletedSteps({});

    const steps = [
      "광학 광묵 센서 데이터 수집 중...",
      "분자 밀도 및 재질 구성 분석 중...",
      "환경부 분리배출 표준 지침 대조 중...",
      "분석 완료! 4단계 가이드 생성 중...",
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setScanProgress(Math.min(currentStep * 25, 100));
      if (currentStep < steps.length) {
        setScanStepText(steps[currentStep]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          const fullResult = { ...data, imageUrl: imgUrl || previewImage || undefined };
          setResult(fullResult);
          if (soundEnabled) playScanBeep("success");
        }, 300);
      }
    }, 400);
  };

  // API image analysis call
  const analyzeImage = async (base64Data: string) => {
    if (soundEnabled) playScanBeep("scan");
    setIsScanning(true);
    setScanProgress(20);
    setScanStepText("AI 분리수거 센서가 이미지를 분석하고 있습니다...");
    setResult(null);
    setHasSaved(false);
    setCompletedSteps({});

    try {
      const res = await fetch("/api/scan-waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64Data,
          region: selectedRegion,
        }),
      });

      setScanProgress(80);
      const data = await res.json();
      setScanProgress(100);

      setTimeout(() => {
        setIsScanning(false);
        const fullData = { ...data, imageUrl: base64Data };
        setResult(fullData);
        if (soundEnabled) playScanBeep("success");
      }, 300);
    } catch (err) {
      console.error("Analysis error:", err);
      setIsScanning(false);
      if (soundEnabled) playScanBeep("error");
    }
  };

  // Text Query analysis
  const analyzeTextQuery = async (queryText: string, imgUrl?: string) => {
    if (!queryText.trim()) return;
    if (soundEnabled) playScanBeep("scan");
    setIsScanning(true);
    setScanProgress(30);
    setScanStepText(`'${queryText}' 분리수거 규정 검색 중...`);
    setResult(null);
    setHasSaved(false);
    setCompletedSteps({});

    try {
      const res = await fetch("/api/scan-waste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          textQuery: queryText,
          region: selectedRegion,
        }),
      });

      setScanProgress(90);
      const data = await res.json();
      setScanProgress(100);

      setTimeout(() => {
        setIsScanning(false);
        const fullData = { ...data, imageUrl: imgUrl };
        setResult(fullData);
        if (soundEnabled) playScanBeep("success");
      }, 300);
    } catch (err) {
      console.error("Text query analysis error:", err);
      setIsScanning(false);
      if (soundEnabled) playScanBeep("error");
    }
  };

  // Toggle step checklist
  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  // Save scan log
  const handleSave = () => {
    if (result && !hasSaved) {
      onSaveScan(result);
      setHasSaved(true);
      if (soundEnabled) playScanBeep("success");
    }
  };

  const resetAll = () => {
    setPreviewImage(null);
    setResult(null);
    setHasSaved(false);
    setCompletedSteps({});
    stopCamera();
  };

  const getCategoryBadgeColor = (colorStr?: string) => {
    switch (colorStr) {
      case "sky":
        return "bg-sky-100 text-sky-800 border-sky-300";
      case "emerald":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "amber":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "rose":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "violet":
        return "bg-purple-100 text-purple-800 border-purple-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const renderPresetIcon = (iconName: string) => {
    switch (iconName) {
      case "Droplets":
        return <Droplets className="w-4 h-4 text-sky-600" />;
      case "Soup":
        return <Soup className="w-4 h-4 text-rose-600" />;
      case "Package":
        return <Package className="w-4 h-4 text-amber-600" />;
      case "Milk":
        return <Milk className="w-4 h-4 text-purple-600" />;
      case "Flame":
        return <Flame className="w-4 h-4 text-emerald-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-zinc-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Hidden Canvas for Camera Captures */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Main Scanner Stage */}
      <div className="bg-emerald-900 rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 text-white shadow-2xl relative overflow-hidden border-[8px] sm:border-[12px] border-emerald-100">
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-emerald-950/20 pointer-events-none" />

        {/* Top Control Bar inside Frame */}
        <div className="relative z-10 flex items-center justify-between pb-4 border-b-2 border-emerald-700/60">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-widest">
              AI SENSOR SCANNER v2.4
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-200 transition cursor-pointer border border-emerald-700"
              title={soundEnabled ? "사운드 켜짐" : "사운드 끄기"}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-300" /> : <VolumeX className="w-4 h-4 text-emerald-500" />}
            </button>

            {previewImage || isCameraActive ? (
              <button
                onClick={resetAll}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-xs font-bold text-emerald-100 transition cursor-pointer border border-emerald-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>다시 스캔</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Camera / Image Scanner Frame Area */}
        <div className="relative z-10 mt-5 aspect-4/3 sm:aspect-16/9 rounded-3xl bg-emerald-950/80 border-4 border-emerald-800/80 overflow-hidden flex items-center justify-center group shadow-inner">
          {/* Active Camera Feed */}
          <video
            ref={videoRef}
            playsInline
            muted
            className={`w-full h-full object-cover ${isCameraActive ? "block" : "hidden"}`}
          />

          {/* Uploaded / Captured Image Preview */}
          {previewImage && !isCameraActive && (
            <img src={previewImage} alt="Scanned waste" className="w-full h-full object-contain bg-emerald-950" />
          )}

          {/* Placeholder when no camera & no image */}
          {!isCameraActive && !previewImage && (
            <div className="text-center px-4 py-8">
              <div className="w-20 h-20 rounded-3xl bg-emerald-800/60 border-2 border-emerald-600/60 mx-auto flex items-center justify-center text-emerald-300 mb-4 shadow-lg">
                <Scan className="w-10 h-10 animate-pulse" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">쓰레기를 카메라에 비추거나 사진을 올려주세요</h3>
              <p className="text-xs sm:text-sm text-emerald-200/80 mt-2 max-w-md mx-auto font-medium">
                AI가 자동으로 재질을 구분하고 내용물 세척 및 올바른 분리배출 방법 4단계를 안내합니다.
              </p>
            </div>
          )}

          {/* Scanning Beam Overlay Animation */}
          {isScanning && (
            <div className="absolute inset-0 bg-emerald-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 z-20">
              <div className="absolute inset-x-0 h-1 bg-emerald-400 shadow-[0_0_20px_#34d399] animate-scan-line" />
              <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-4" />
              <p className="text-emerald-200 font-extrabold text-sm sm:text-base text-center">{scanStepText}</p>
              <div className="w-56 bg-emerald-950 h-3 rounded-full overflow-hidden mt-4 border border-emerald-700">
                <div
                  className="bg-amber-400 h-full transition-all duration-300"
                  style={{ width: `${scanProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Target Corner Guides */}
          {(isCameraActive || previewImage) && !isScanning && (
            <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="bg-emerald-950/80 border border-emerald-600 px-3 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold text-emerald-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  SPECTRO-ANALYZE: ACTIVE
                </div>
                <div className="text-[10px] sm:text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-600 px-3 py-1 rounded-xl">
                  {selectedRegion}
                </div>
              </div>

              {/* Center Target Box */}
              <div className="self-center w-40 h-40 border-2 border-dashed border-emerald-400/80 rounded-2xl relative flex items-center justify-center">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl-md" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr-md" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl-md" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br-md" />
              </div>

              <div className="text-center text-xs font-extrabold text-emerald-200 bg-emerald-950/90 border border-emerald-700 py-1.5 px-4 rounded-xl self-center">
                중앙 프레임에 쓰레기를 맞춰주세요
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="relative z-10 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left: Camera / Capture Button */}
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              disabled={isScanning}
              className="flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl hover:translate-y-0.5 active:translate-y-1 transition cursor-pointer disabled:opacity-50"
            >
              <Camera className="w-6 h-6" />
              <span>카메라 켜기 및 촬영</span>
            </button>
          ) : (
            <button
              onClick={capturePhoto}
              disabled={isScanning}
              className="flex items-center justify-center space-x-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-base sm:text-lg py-4 px-6 rounded-2xl shadow-xl hover:translate-y-0.5 active:translate-y-1 transition cursor-pointer"
            >
              <Zap className="w-6 h-6 fill-current" />
              <span>스캔 사진 촬영 (Capture)</span>
            </button>
          )}

          {/* Right: File Upload */}
          <div className="flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="flex-1 flex items-center justify-center space-x-2 bg-white/20 hover:bg-white/30 text-white font-extrabold py-4 px-6 rounded-2xl border-2 border-white/30 transition cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-5 h-5 text-emerald-300" />
              <span>사진 업로드</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {cameraError && (
          <p className="mt-4 text-xs font-bold text-rose-200 bg-rose-950/70 border-2 border-rose-600 p-3 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
            {cameraError}
          </p>
        )}
      </div>

      {/* Quick Text Search Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-b-8 border-emerald-200">
        <label className="block text-xs font-black text-emerald-900 uppercase tracking-widest mb-2">
          직접 쓰레기 이름 검색하여 스캔하기
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            analyzeTextQuery(textInput);
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-emerald-600 absolute left-4 top-3.5" />
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="예: 치킨 상자, 오염된 종이컵, 칫솔, 부탄가스..."
              className="w-full pl-12 pr-4 py-3 bg-emerald-50/50 border-2 border-emerald-200 rounded-2xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            disabled={!textInput.trim() || isScanning}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-sm transition cursor-pointer disabled:opacity-50 shadow-md"
          >
            분석
          </button>
        </form>
      </div>

      {/* Quick Sample Item Presets */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-md border-b-8 border-emerald-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm sm:text-base font-black text-emerald-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            자주 버리는 쓰레기 샘플 스캔 (Quick Test)
          </h4>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
            클릭 시 시뮬레이션 분석
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {SAMPLE_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              disabled={isScanning}
              className="flex flex-col items-start text-left p-3 rounded-2xl border-2 border-emerald-100 hover:border-emerald-500 hover:bg-emerald-50 transition cursor-pointer group bg-emerald-50/30"
            >
              <div className="w-full h-24 rounded-xl overflow-hidden mb-2 bg-emerald-100 relative">
                <img
                  src={preset.image}
                  alt={preset.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-1.5 right-1.5 bg-white rounded-full p-1 shadow-md">
                  {renderPresetIcon(preset.iconName)}
                </div>
              </div>
              <span className="text-xs font-extrabold text-slate-900 line-clamp-1">{preset.title}</span>
              <span className="text-[10px] font-medium text-emerald-700 mt-0.5 line-clamp-1">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Analysis Result Display Card */}
      {result && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-b-8 border-emerald-300 space-y-6">
          {/* Header & Category Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-emerald-100">
            <div>
              <div className="flex items-center space-x-2">
                <span
                  className={`text-xs font-black px-3.5 py-1 rounded-full border-2 ${getCategoryBadgeColor(
                    result.categoryColor
                  )}`}
                >
                  {result.category}
                </span>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  신뢰도 {result.confidenceScore}%
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-emerald-950 mt-2 flex items-center gap-2">
                {result.itemName}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-700 mt-1 font-extrabold">
                재질 구분: <span className="text-emerald-900">{result.materialDetail}</span>
              </p>
            </div>

            {/* Recyclable Status Pill */}
            <div className="shrink-0">
              {result.recyclable ? (
                <div className="flex items-center space-x-3 bg-emerald-100 border-2 border-emerald-400 text-emerald-950 px-5 py-3 rounded-2xl shadow-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-sm font-black uppercase text-emerald-950">재활용 가능</div>
                    <div className="text-xs font-bold text-emerald-700">세척 후 분리배출</div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3 bg-rose-100 border-2 border-rose-400 text-rose-950 px-5 py-3 rounded-2xl shadow-xs">
                  <XCircle className="w-8 h-8 text-rose-600 shrink-0" />
                  <div>
                    <div className="text-sm font-black uppercase text-rose-950">일반쓰레기 배출</div>
                    <div className="text-xs font-bold text-rose-700">종량제 봉투 사용</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Method Summary Banner */}
          <div className="bg-emerald-50 border-l-8 border-emerald-500 p-5 rounded-r-2xl border-y-2 border-r-2 border-emerald-200">
            <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest">한 줄 배출 요약</h4>
            <p className="text-base sm:text-lg font-black text-emerald-950 mt-1">{result.disposalMethod}</p>
          </div>

          {/* 4-Step Cleaning & Sorting Protocol */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base sm:text-xl font-black text-emerald-950 flex items-center gap-2">
                <span className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-emerald-950 font-black text-base shadow-xs">!</span>
                올바른 세척 & 분리배출 4단계 수칙
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                체크하여 실행 완료
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Step 1: Empty */}
              <div
                onClick={() => toggleStep("empty")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer ${
                  completedSteps["empty"]
                    ? "bg-emerald-100 border-emerald-500 text-emerald-950 shadow-xs"
                    : "bg-emerald-50/40 border-emerald-200 text-slate-800 hover:border-emerald-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      1
                    </span>
                    <span className="font-black text-sm uppercase tracking-wider text-emerald-950">
                      비운다 (Empty)
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                      completedSteps["empty"]
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-emerald-300 bg-white"
                    }`}
                  >
                    {completedSteps["empty"] && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs sm:text-sm mt-3 text-emerald-900 leading-relaxed font-bold">
                  {result.steps.empty}
                </p>
              </div>

              {/* Step 2: Rinse */}
              <div
                onClick={() => toggleStep("rinse")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer ${
                  completedSteps["rinse"]
                    ? "bg-emerald-100 border-emerald-500 text-emerald-950 shadow-xs"
                    : "bg-emerald-50/40 border-emerald-200 text-slate-800 hover:border-emerald-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      2
                    </span>
                    <span className="font-black text-sm uppercase tracking-wider text-emerald-950">
                      헹군다 (Rinse)
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                      completedSteps["rinse"]
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-emerald-300 bg-white"
                    }`}
                  >
                    {completedSteps["rinse"] && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs sm:text-sm mt-3 text-emerald-900 leading-relaxed font-bold">
                  {result.steps.rinse}
                </p>
              </div>

              {/* Step 3: Separate */}
              <div
                onClick={() => toggleStep("separate")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer ${
                  completedSteps["separate"]
                    ? "bg-emerald-100 border-emerald-500 text-emerald-950 shadow-xs"
                    : "bg-emerald-50/40 border-emerald-200 text-slate-800 hover:border-emerald-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      3
                    </span>
                    <span className="font-black text-sm uppercase tracking-wider text-emerald-950">
                      분리한다 (Separate)
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                      completedSteps["separate"]
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-emerald-300 bg-white"
                    }`}
                  >
                    {completedSteps["separate"] && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs sm:text-sm mt-3 text-emerald-900 leading-relaxed font-bold">
                  {result.steps.separate}
                </p>
              </div>

              {/* Step 4: Sort */}
              <div
                onClick={() => toggleStep("sort")}
                className={`p-5 rounded-2xl border-2 transition cursor-pointer ${
                  completedSteps["sort"]
                    ? "bg-emerald-100 border-emerald-500 text-emerald-950 shadow-xs"
                    : "bg-emerald-50/40 border-emerald-200 text-slate-800 hover:border-emerald-400"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      4
                    </span>
                    <span className="font-black text-sm uppercase tracking-wider text-emerald-950">
                      섞지않는다 (Sort)
                    </span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition ${
                      completedSteps["sort"]
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-emerald-300 bg-white"
                    }`}
                  >
                    {completedSteps["sort"] && <Check className="w-4 h-4 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs sm:text-sm mt-3 text-emerald-900 leading-relaxed font-bold">
                  {result.steps.sort}
                </p>
              </div>
            </div>
          </div>

          {/* Caution Tips */}
          {result.cautionTips && result.cautionTips.length > 0 && (
            <div className="bg-amber-100/80 border-2 border-amber-300 rounded-2xl p-5">
              <h4 className="text-xs sm:text-sm font-black text-amber-950 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                분리배출 시 꼭 알아야 할 주의사항
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-amber-950 pl-5 list-disc font-extrabold">
                {result.cautionTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs */}
          {result.faqs && result.faqs.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs sm:text-sm font-black text-emerald-950 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                자주 묻는 질문 (FAQ)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.faqs.map((faq, idx) => (
                  <div key={idx} className="bg-emerald-50/50 p-4 rounded-2xl border-2 border-emerald-200">
                    <p className="text-xs font-black text-emerald-950">Q. {faq.q}</p>
                    <p className="text-xs text-emerald-800 mt-1 leading-relaxed font-medium">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Carbon Footprint & Tactile Save Button */}
          <div className="pt-4 border-t-2 border-emerald-100 space-y-4">
            <div className="flex items-center space-x-2 text-xs font-black text-emerald-900 bg-emerald-100/80 px-4 py-3 rounded-2xl border border-emerald-300">
              <Leaf className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{result.environmentalImpact}</span>
            </div>

            <button
              onClick={handleSave}
              disabled={hasSaved}
              className={`w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black text-xl sm:text-2xl shadow-[0_8px_0_#059669] hover:shadow-[0_4px_0_#059669] hover:translate-y-1 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-70 disabled:shadow-none disabled:bg-slate-300 disabled:text-slate-600 disabled:translate-y-0`}
            >
              {hasSaved ? (
                <>
                  <Check className="w-7 h-7 text-emerald-700" />
                  <span>스캔 기록에 저장됨 (+10P)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-7 h-7 text-amber-300" />
                  <span>배출 완료 및 기록 저장 (+10P)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
