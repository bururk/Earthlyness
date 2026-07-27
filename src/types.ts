export type WasteCategory =
  | "투명 페트병"
  | "플라스틱"
  | "비닐류"
  | "종이팩"
  | "종이류"
  | "캔류"
  | "유리병"
  | "스티로폼"
  | "일반쓰레기"
  | "음식물쓰레기"
  | "폐건전지/소형가전";

export interface WasteStep {
  empty: string;
  rinse: string;
  separate: string;
  sort: string;
}

export interface WasteFAQ {
  q: string;
  a: string;
}

export interface WasteAnalysisResult {
  id?: string;
  timestamp?: string;
  itemName: string;
  category: WasteCategory | string;
  categoryColor: "sky" | "emerald" | "amber" | "rose" | "violet" | "zinc" | string;
  recyclable: boolean;
  materialDetail: string;
  confidenceScore: number;
  steps: WasteStep;
  disposalMethod: string;
  cautionTips: string[];
  faqs: WasteFAQ[];
  environmentalImpact: string;
  imageUrl?: string;
}

export interface SampleItemPreset {
  id: string;
  title: string;
  category: string;
  iconName: string;
  image: string;
  description: string;
  query: string;
}

export interface QuizItem {
  id: string;
  question: string;
  isRecyclable: boolean;
  explanation: string;
  category: string;
}

export interface ScanLog {
  id: string;
  timestamp: string;
  itemName: string;
  category: string;
  recyclable: boolean;
  imageUrl?: string;
  pointsEarned: number;
}
