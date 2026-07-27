import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Gemini Client
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API: Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Response Schema definition for Waste Analysis
const wasteSchema = {
  type: Type.OBJECT,
  properties: {
    itemName: {
      type: Type.STRING,
      description: "감지된 쓰레기/제품명 (예: 투명 페트병, 오염된 배달용기, 부탄가스 캔)",
    },
    category: {
      type: Type.STRING,
      description: "분리수거 대표 카테고리 (투명 페트병, 플라스틱, 비닐류, 종이팩, 종이류, 캔류, 유리병, 스티로폼, 일반쓰레기, 음식물쓰레기, 폐건전지/소형가전 중 하나)",
    },
    categoryColor: {
      type: Type.STRING,
      description: "UI 색상 태그 (sky, emerald, amber, rose, violet, zinc 중 하나)",
    },
    recyclable: {
      type: Type.BOOLEAN,
      description: "재활용 가능 여부 (true/false)",
    },
    materialDetail: {
      type: Type.STRING,
      description: "세부 재질 구분 (예: PETE 1번, HDPE, 알루미늄, 복합재질 OTHER, 라미네이팅 종이 등)",
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "AI 신뢰도 점수 (0-100 퍼센트)",
    },
    steps: {
      type: Type.OBJECT,
      description: "올바른 분리배출 4단계 수칙",
      properties: {
        empty: { type: Type.STRING, description: "1단계: 내용물 비우기 지침" },
        rinse: { type: Type.STRING, description: "2단계: 물로 세척/헹구기 지침" },
        separate: { type: Type.STRING, description: "3단계: 라벨/뚜껑/이종재질 분리하기 지침" },
        sort: { type: Type.STRING, description: "4단계: 올바른 수거함/요일 배출하기 지침" },
      },
      required: ["empty", "rinse", "separate", "sort"],
    },
    disposalMethod: {
      type: Type.STRING,
      description: "배출 방법 요약 한 줄 설명",
    },
    cautionTips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "배출 시 꼭 주의해야 할 점 (1~3개)",
    },
    faqs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          q: { type: Type.STRING, description: "자주 묻는 질문" },
          a: { type: Type.STRING, description: "답변" },
        },
        required: ["q", "a"],
      },
      description: "관련 자주 묻는 질문 2개",
    },
    environmentalImpact: {
      type: Type.STRING,
      description: "올바른 분리수거 시 환경 보호 효과 (예: 탄소 감축량, 자원 순환 효과)",
    },
  },
  required: [
    "itemName",
    "category",
    "categoryColor",
    "recyclable",
    "materialDetail",
    "confidenceScore",
    "steps",
    "disposalMethod",
    "cautionTips",
    "faqs",
    "environmentalImpact",
  ],
};

// API: Waste Scan & Image/Text Analysis
app.post("/api/scan-waste", async (req, res) => {
  try {
    const { imageBase64, mimeType, textQuery, region } = req.body;

    const ai = getGenAI();
    if (!ai) {
      // Return structured fallback if API key is not ready
      return res.json({
        itemName: textQuery || "스캔된 쓰레기",
        category: "투명 페트병",
        categoryColor: "sky",
        recyclable: true,
        materialDetail: "PET (1번 페트)",
        confidenceScore: 95,
        steps: {
          empty: "용기 안의 음료나 물을 완전히 비워주세요.",
          rinse: "물로 내부 잔여물을 깨끗이 헹궈주세요.",
          separate: "비닐 라벨은 떼어내어 비닐류로 분리배출하고, 뚜껑은 따로 모읍니다.",
          sort: "압착하여 부피를 줄인 후 '투명 페트병 전용 수거함'에 배출합니다.",
        },
        disposalMethod: "비닐 라벨을 제거하고 찌그러뜨린 후 투명 페트병 전용함에 배출하세요.",
        cautionTips: [
          "색상이 들어간 유색 페트병은 일반 플라스틱으로 배출해야 합니다.",
          "상표 스티커나 비닐 라벨은 반드시 제거해야 재활용률이 높아집니다.",
        ],
        faqs: [
          { q: "뚜껑은 꼭 닫아서 버려야 하나요?", a: "뚜껑(PP/PE)은 압착 후 닫아서 배출하면 세척 과정에서 부유 분리되므로 괜찮습니다." },
          { q: "라벨에 붙은 접착제 자국은 어쩌죠?", a: "최근 페트병은 수성 접착제를 사용하므로 물로 세척 시 쉽게 제거됩니다." },
        ],
        environmentalImpact: "투명 페트병 1kg 재활용 시 약 2.3kg의 이산화탄소 배출을 줄일 수 있습니다.",
      });
    }

    const systemInstruction = `당신은 대한민국 최고 수준의 분리수거 및 자원순환 AI 에이전트입니다.
사용자가 제공한 쓰레기 사진(카메라 스캔/이미지) 또는 텍스트 정보를 바탕으로 정확한 분리수거 방법, 재질 구분, 4단계 세척 가이드(비우기/헹구기/분리하기/섞지않기), 주의사항, 자주 묻는 질문을 분석해 JSON 형식으로 반환하십시오.
한국 환경부 및 지자체(${region || "전국"}) 표준 분리배출 지침을 엄격히 준수하세요.
- 이물질이 씻이지 않는 용기(예: 음식물이 밴 컵라면 스티로폼 용기)는 일반쓰레기로 판정하세요.
- 투명 페트병과 유색 페트병/일반 플라스틱은 명확히 구분하세요.
- 종이팩(우유팩)은 일반 종이류와 별도 배출임을 명시하세요.`;

    const contents: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contents.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || "image/jpeg",
        },
      });
    }

    const promptText = textQuery
      ? `다음 쓰레기/물품을 분리수거 분석해주세요: "${textQuery}"`
      : "카메라 센서로 스캔된 이 쓰레기를 분석하여 정확한 재질과 올바른 4단계 분리배출 방법, 세척 팁을 알려주세요.";

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: wasteSchema,
        temperature: 0.2,
      },
    });

    const resultText = response.text || "{}";
    const parsedData = JSON.parse(resultText);

    return res.json(parsedData);
  } catch (error: any) {
    console.error("Error in /api/scan-waste:", error);
    res.status(500).json({
      error: "분리수거 분석 중 오류가 발생했습니다.",
      details: error.message,
    });
  }
});

// API: Q&A Chat Assistant for Tricky Waste Items
app.post("/api/ask-waste-ai", async (req, res) => {
  try {
    const { question, region } = req.body;
    if (!question) {
      return res.status(400).json({ error: "질문을 입력해주세요." });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        answer: `'${question}'에 대한 분리수거 안내:\n• 깨끗이 세척 후 재활용이 가능한지 확인하세요.\n• 오염이 심하거나 이종 재질 분리가 불가능하면 종량제 봉투(일반쓰레기)로 배출해야 합니다.\n• 대형 폐기물이나 가전제품은 지자체 수거 서비스를 이용하세요.`,
        category: "기타/일반",
        quickTips: ["세척 불가시 일반쓰레기", "재질 분리 필수"],
      });
    }

    const prompt = `사용자가 헷갈리는 쓰레기 분리배출에 대해 질문했습니다: "${question}" (지역: ${region || "전국"})
한국 환경부 표준 분리배출 규정에 맞춰 친절하고 명확하게 답변해 주세요.
1. 재활용 가능 여부 및 분류 카테고리
2. 세척 및 사전 처리 과정
3. 헷갈리기 쉬운 주의사항
4. 간결한 한 줄 요약`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 친절한 분리수거 박사이자 자원순환 전문 AI 안내원입니다. 명확하고 가독성 높게 답변하세요.",
        temperature: 0.3,
      },
    });

    res.json({
      answer: response.text,
    });
  } catch (error: any) {
    console.error("Error in /api/ask-waste-ai:", error);
    res.status(500).json({ error: "답변을 생성하지 못했습니다." });
  }
});

// Start Server & Vite Integration
async function main() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[EcoScan Server] Running at http://0.0.0.0:${PORT}`);
  });
}

main();
