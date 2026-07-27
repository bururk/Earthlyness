import React, { useState } from "react";
import { Search, Filter, CheckCircle2, XCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Droplets, Package, Flame, Soup, Milk } from "lucide-react";

interface WasteGuideItem {
  id: string;
  name: string;
  category: string;
  categoryTag: "sky" | "emerald" | "amber" | "rose" | "violet" | "zinc";
  recyclable: boolean;
  material: string;
  summary: string;
  steps: {
    empty: string;
    rinse: string;
    separate: string;
    sort: string;
  };
  notAllowed: string;
}

const ENCYCLOPEDIA_DATABASE: WasteGuideItem[] = [
  {
    id: "pet-1",
    name: "투명 페트병 (생수, 탄산음료)",
    category: "투명 페트병",
    categoryTag: "sky",
    recyclable: true,
    material: "PETE (無色 페트)",
    summary: "내용물 비우고 라벨 떼어낸 뒤 압착하여 투명 페트병 수거함에 배출",
    steps: {
      empty: "생수나 음료 잔여물을 완전히 털어냅니다.",
      rinse: "깨끗한 물로 내부를 헹굽니다.",
      separate: "비닐 라벨을 수직선 따라 떼어 비닐류로 버립니다.",
      sort: "발로 가볍게 찌그러뜨려 뚜껑을 닫은 후 투명 페트 전용함 배출.",
    },
    notAllowed: "유색 페트병, 양념이 배어든 페트병, 간장/주방세제 용기는 일반 플라스틱 배출",
  },
  {
    id: "plastic-1",
    name: "유색 페트병 & 플라스틱 용기 (샴푸, 세제, 유색음료)",
    category: "플라스틱",
    categoryTag: "emerald",
    recyclable: true,
    material: "HDPE, PP, PS, OTHER",
    summary: "내용물을 씻은 후 플라스틱 수거함 배출",
    steps: {
      empty: "남은 내용물 및 세제를 깨끗이 비웁니다.",
      rinse: "물로 여러 번 헹궈 거품을 없앱니다.",
      separate: "펌프 헤드 내부에 스프링 철사가 들어있다면 펌프만 일반쓰레기로 분리.",
      sort: "플라스틱 전용 수거함에 배출.",
    },
    notAllowed: "칫솔, 알약 포장재, 고무장갑, 오염된 플라스틱 용기",
  },
  {
    id: "paper-1",
    name: "종이 택배 박스 & 신문 / 책자",
    category: "종이류",
    categoryTag: "amber",
    recyclable: true,
    material: "골판지 / 신문지",
    summary: "테이프, 스티커 제거 후 펼쳐서 종이류 배출",
    steps: {
      empty: "박스 속 비닐 충전재나 스티로폼을 비웁니다.",
      rinse: "물에 젖지 않도록 건조 상태를 유지합니다.",
      separate: "박스 박피 테이프, 택배 운송장 스티커, 철핀 제거.",
      sort: "납작하게 접어서 종이류 배출.",
    },
    notAllowed: "코팅지, 전단지, 사용한 휴지, 영수증, 오염된 종이",
  },
  {
    id: "paper-pack-1",
    name: "우유팩 & 두유 종이팩",
    category: "종이팩",
    categoryTag: "violet",
    recyclable: true,
    material: "최고급 천연펄프 (PE Coated)",
    summary: "씻어서 잘라 펼쳐 건조 후 종이팩 전용함 배출",
    steps: {
      empty: "내부 음료를 비웁니다.",
      rinse: "물로 완전히 헹궈 부패 및 냄새를 방지합니다.",
      separate: "가위로 잘라 넓게 펼친 후 햇볕이나 바람에 건조.",
      sort: "일반 종이와 섞지 않고 종이팩 수거함 또는 주민센터 교환 부스 배출.",
    },
    notAllowed: "일반 종이 박스와 혼합 배출 (해리 시간이 달라 폐기됨)",
  },
  {
    id: "can-1",
    name: "음료수 캔 & 통조림 캔",
    category: "캔류",
    categoryTag: "emerald",
    recyclable: true,
    material: "알루미늄 (Al) / 철 (Fe)",
    summary: "내용물 헹구고 압착하여 캔류 배출",
    steps: {
      empty: "음료나 통조림 기름을 비웁니다.",
      rinse: "물로 내부를 씻어냅니다.",
      separate: "통조림 뚜껑(철)은 캔 내부에 넣거나 함께 배출, 플라스틱 뚜껑은 플라스틱 배출.",
      sort: "찌그러뜨려 캔류 전용함 배출.",
    },
    notAllowed: "담배꽁초나 이물질이 들어있는 캔, 녹슨 캔",
  },
  {
    id: "can-2",
    name: "부탄가스 캔 & 살충제 에어졸",
    category: "캔류",
    categoryTag: "emerald",
    recyclable: true,
    material: "철캔",
    summary: "야외에서 가스 완전히 빼고 구멍 뚫어 배출",
    steps: {
      empty: "통풍이 잘되는 야외에서 노즐을 눌러 가스를 끝까지 비웁니다.",
      rinse: "세척 불필요.",
      separate: "가스 제거기나 송곳으로 바닥 근처 구멍을 내어 미량 가스 배출.",
      sort: "상단 플라스틱 캡 분리 후 캔류 배출.",
    },
    notAllowed: "가스가 차있는 상태로 배출 (청소차 폭발 사고 원인)",
  },
  {
    id: "vinyl-1",
    name: "과자 봉지 & 라면 봉지 & 에어캡(뽁뽁이)",
    category: "비닐류",
    categoryTag: "violet",
    recyclable: true,
    material: "필름류 비닐 (OTHER/PP)",
    summary: "이물질 씻어서 투명 비닐봉지에 모아 배출",
    steps: {
      empty: "과자 가루나 라면 스프 가루를 완전히 털어냅니다.",
      rinse: "기름이나 양념이 묻었다면 물로 헹궈 말립니다.",
      separate: "스티커나 테이프 부착 부위 잘라내기.",
      sort: "흩날리지 않게 한데 모아 비닐류 전용함 배출.",
    },
    notAllowed: "음식물이 범벅되어 안 씻기는 비닐, 식탁보, 랩",
  },
  {
    id: "glass-1",
    name: "음료수 유리병 & 양념병",
    category: "유리병",
    categoryTag: "sky",
    recyclable: true,
    material: "소다석회 유리",
    summary: "내용물 비우고 뚜껑 분리 후 유리병 배출",
    steps: {
      empty: "내용물을 완전히 비웁니다.",
      rinse: "물로 헹궈 깨끗하게 만듭니다.",
      separate: "알루미늄/플라스틱 뚜껑은 따로 분리배출.",
      sort: "유리병 전용 수거함에 배출 (깨지지 않게 주의).",
    },
    notAllowed: "깨진 유리, 거울, 내열유리 용기, 도자기, 전구",
  },
  {
    id: "styrofoam-1",
    name: "흰색 스티로폼 상자 (신선식품 택배)",
    category: "스티로폼",
    categoryTag: "amber",
    recyclable: true,
    material: "EPS (발포스티렌)",
    summary: "테이프, 스티커 제거 후 깨끗한 상태로 배출",
    steps: {
      empty: "내부 내용물 및 아이스팩 제거.",
      rinse: "이물질을 깨끗이 닦거나 씻어냅니다.",
      separate: "상자 겉면 박스 테이프, 운송장 스티커 완벽 제거.",
      sort: "흰색 스티로폼 수거함 배출.",
    },
    notAllowed: "붉은 국물 물든 스티로폼, 건축용 열반사 스티로폼, 과일 포장망",
  },
  {
    id: "general-1",
    name: "깨진 유리 & 도자기 & 코팅 종이 & 칫솔",
    category: "일반쓰레기",
    categoryTag: "rose",
    recyclable: false,
    material: "복합 재질 / 재활용 불가 소재",
    summary: "종량제 봉투 또는 불연성 쓰레기 마대에 배출",
    steps: {
      empty: "이물질 비우기.",
      rinse: "깨진 유리는 신문지/두꺼운 박스로 감싸기.",
      separate: "겉면에 '깨진 유리 주의' 표시 작성.",
      sort: "종량제 봉투 또는 불연성 마대에 배출.",
    },
    notAllowed: "재활용 수거함에 방치",
  },
];

const CATEGORIES = [
  "전체",
  "투명 페트병",
  "플라스틱",
  "종이류",
  "종이팩",
  "캔류",
  "비닐류",
  "유리병",
  "스티로폼",
  "일반쓰레기",
];

export const EncyclopediaView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [expandedId, setExpandedId] = useState<string | null>("pet-1");

  const filteredItems = ENCYCLOPEDIA_DATABASE.filter((item) => {
    const matchesCategory =
      selectedCategory === "전체" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.material.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getTagColorClass = (tag: string) => {
    switch (tag) {
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-emerald-900 rounded-[32px] p-6 sm:p-8 text-white shadow-lg border-b-8 border-emerald-950 relative overflow-hidden">
        <h2 className="text-2xl sm:text-3xl font-black">올바른 분리수거 백과사전 📖</h2>
        <p className="text-xs sm:text-sm text-emerald-200 mt-1 font-bold">
          재질별 정확한 세척 방법과 배출 금지 품목을 검색해 보세요.
        </p>

        {/* Search Bar */}
        <div className="relative mt-5">
          <Search className="w-5 h-5 text-emerald-600 absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="품목 이름으로 검색 (예: 우유팩, 택배박스, 칫솔, 깨진유리)..."
            className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-2xl shadow-inner text-sm focus:outline-hidden font-extrabold"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition whitespace-nowrap cursor-pointer ${
              selectedCategory === cat
                ? "bg-emerald-600 text-white shadow-md border-b-4 border-emerald-800"
                : "bg-white text-emerald-950 border-2 border-emerald-200 hover:bg-emerald-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items List Accordion */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border-b-8 border-emerald-200">
            <Info className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-base font-black text-emerald-950">검색 결과가 없습니다.</p>
            <p className="text-xs text-emerald-700 mt-1 font-medium">다른 검색어를 입력하시거나 카테고리를 변경해보세요.</p>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border-b-8 border-emerald-200 border-2 border-emerald-100 overflow-hidden shadow-sm hover:border-emerald-300 transition"
              >
                {/* Accordion Bar Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="w-full p-5 flex items-center justify-between text-left cursor-pointer hover:bg-emerald-50/50 transition"
                >
                  <div className="flex items-center space-x-3.5">
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full border-2 ${getTagColorClass(
                        item.categoryTag
                      )}`}
                    >
                      {item.category}
                    </span>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-emerald-950 flex items-center gap-2">
                        {item.name}
                        {item.recyclable ? (
                          <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                            재활용 가능
                          </span>
                        ) : (
                          <span className="text-[10px] font-black text-rose-800 bg-rose-100 border border-rose-300 px-2 py-0.5 rounded-md">
                            종량제 배출
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-emerald-800 mt-0.5 line-clamp-1 font-bold">{item.summary}</p>
                    </div>
                  </div>

                  <div className="text-emerald-700 shrink-0 ml-2">
                    {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </div>
                </button>

                {/* Accordion Expanded Details */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-emerald-50/60 border-t-2 border-emerald-100 space-y-4">
                    <div className="text-xs text-emerald-900 bg-white p-3.5 rounded-2xl border-2 border-emerald-200 font-extrabold">
                      <span className="font-black text-emerald-950">세부 재질 구분:</span> {item.material}
                    </div>

                    {/* 4 Steps */}
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-emerald-950 mb-3 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 4단계 올바른 배출 가이드
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200">
                          <span className="font-black text-emerald-700">1. 비우기:</span> {item.steps.empty}
                        </div>
                        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200">
                          <span className="font-black text-emerald-700">2. 헹구기:</span> {item.steps.rinse}
                        </div>
                        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200">
                          <span className="font-black text-emerald-700">3. 분리하기:</span> {item.steps.separate}
                        </div>
                        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-200">
                          <span className="font-black text-emerald-700">4. 섞지않기:</span> {item.steps.sort}
                        </div>
                      </div>
                    </div>

                    {/* Not Allowed Items Warning */}
                    <div className="bg-rose-100/80 border-2 border-rose-300 rounded-2xl p-4 text-xs sm:text-sm text-rose-950 font-extrabold">
                      <span className="font-black text-rose-950 flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-4 h-4 text-rose-600" /> 배출하면 안 되는 품목:
                      </span>
                      {item.notAllowed}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
