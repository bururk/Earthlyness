import { QuizItem, SampleItemPreset, WasteAnalysisResult } from "../types";

export const SAMPLE_PRESETS: SampleItemPreset[] = [
  {
    id: "pet-transparent",
    title: "투명 페트병 (생수/음료)",
    category: "투명 페트병",
    iconName: "Droplets",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=60",
    description: "라벨 제거 후 별도 분리배출 필수",
    query: "투명 생수 페트병 500ml",
  },
  {
    id: "ramen-cup",
    title: "컵라면 용기 (스티로폼/종이)",
    category: "일반쓰레기 / 스티로폼",
    iconName: "Soup",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&auto=format&fit=crop&q=60",
    description: "국물 자국 남은 용기는 일반쓰레기",
    query: "빨간 국물 오염된 컵라면 용기",
  },
  {
    id: "delivery-box",
    title: "택배 박스 (종이)",
    category: "종이류",
    iconName: "Package",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=60",
    description: "테이프 및 택배 운송장 스티커 제거 필수",
    query: "종이 택배 박스 상자",
  },
  {
    id: "milk-carton",
    title: "우유팩 / 음료팩",
    category: "종이팩",
    iconName: "Milk",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60",
    description: "펼쳐서 씻은 후 종이팩 전용함 배출",
    query: "1L 우유 종이팩",
  },
  {
    id: "gas-can",
    title: "부탄가스 / 에어컨 스프레이",
    category: "캔류",
    iconName: "Flame",
    image: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=500&auto=format&fit=crop&q=60",
    description: "구멍을 내어 가스 완전히 배출 후 캔류 배출",
    query: "부탄가스 캔 쇠캔",
  },
  {
    id: "broken-glass",
    title: "깨진 유리병 / 유리조각",
    category: "일반쓰레기 (불연성)",
    iconName: "AlertTriangle",
    image: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?w=500&auto=format&fit=crop&q=60",
    description: "신문지에 싸서 불연성 마포 마대/일반쓰레기",
    query: "깨진 유리 조각 파편",
  },
];

export const PRESET_ANALYSIS_RESULTS: Record<string, WasteAnalysisResult> = {
  "pet-transparent": {
    itemName: "투명 페트병 (생수/음료병)",
    category: "투명 페트병",
    categoryColor: "sky",
    recyclable: true,
    materialDetail: "PETE (1번 무색 페트)",
    confidenceScore: 99,
    steps: {
      empty: "내용물(생수나 음료)을 완전히 털어 비워주세요.",
      rinse: "물로 내부를 1~2회 헹궈 깨끗한 상태로 만듭니다.",
      separate: "비닐 라벨을 수직 절취선으로 잘라내어 '비닐류'로 따로 배출합니다. (뚜껑/링은 닫아서 배출)",
      sort: "발로 가볍게 찌그러뜨려 부피를 줄인 뒤 '투명 페트병 전용 수거함'에 배출합니다.",
    },
    disposalMethod: "라벨 제거 후 압착하여 투명 페트병 전용 수거함에 배출하세요.",
    cautionTips: [
      "유색 페트병(맥주병, 사이다 녹색병 등)은 투명 페트병 함이 아닌 '일반 플라스틱'으로 배출해야 합니다.",
      "비닐 라벨은 자원 순환을 방해하므로 반드시 떼어내어 비닐류로 따로 버려주세요.",
    ],
    faqs: [
      { q: "뚜껑(PP재질)은 따로 버려야 하나요?", a: "뚜껑을 닫아 압착 상태를 유지해 배출하면 재활용 세척 공정에서 물에 뜨는 성질을 이용하여 자동으로 분리되므로 닫아 버려도 괜찮습니다." },
      { q: "투명 페트병 요일제가 무엇인가요?", a: "지자체에 따라 공동주택 및 단독주택별 투명 페트병 지정 배출 요일이 정해져 있으니 지역 수거일을 확인하세요." },
    ],
    environmentalImpact: "투명 페트병 1,000개를 고품질 재활용하면 고기능성 의류 1벌 또는 양털 후드집업 1벌을 만들 수 있습니다.",
  },

  "ramen-cup": {
    itemName: "오염된 컵라면 용기 (스티로폼/종이)",
    category: "일반쓰레기",
    categoryColor: "rose",
    recyclable: false,
    materialDetail: "오염된 PS (발포스티렌) / 코팅 종이",
    confidenceScore: 96,
    steps: {
      empty: "남은 국물과 건더기 스프를 음식물 쓰레기로 깨끗이 비웁니다.",
      rinse: "물과 주방세제로 최대한 헹궈봅니다.",
      separate: "햇볕에 며칠 말려 착색이 빠진 경우 스티로폼 배출 가능하나, 붉은 기름 국물이 완벽히 지워지지 않으면 일반쓰레기입니다.",
      sort: "붉은 기름 착색이 남은 용기는 종량제 봉투(일반쓰레기)로 배출합니다.",
    },
    disposalMethod: "세척 후에도 국물 착색 및 오염이 남아있다면 종량제 봉투에 버리세요.",
    cautionTips: [
      "붉은 국물 염색 및 기름 성분은 스티로폼 재활용 시 품질을 저하시키는 주원인입니다.",
      "햇볕에 2~3일 말리면 카로티노이드 성분이 분해되어 유백색으로 돌아온 경우에 한해 깨끗이 스티로폼으로 배출할 수 있습니다.",
    ],
    faqs: [
      { q: "종이 컵라면 용기는 종이로 버리나요?", a: "내부에 얇은 비닐 핑막 코팅이 되어있고 국물이 스며든 종이용기는 일반 종이 재활용이 불가능하므로 종량제 봉투에 버려야 합니다." },
      { q: "뚜껑 덮개 비닐은 어떻게 하나요?", a: "양념이 묻지 않은 깨끗한 상태면 비닐류, 스프 기름이 범벅되어 있으면 일반쓰레기입니다." },
    ],
    environmentalImpact: "오염된 스티로폼을 종량제 배출하면 소각 및 인공 연료 추출 과정에서 세척수 오염을 막을 수 있습니다.",
  },

  "delivery-box": {
    itemName: "택배 종이 박스",
    category: "종이류",
    categoryColor: "amber",
    recyclable: true,
    materialDetail: "골판지 종이 (Carton)",
    confidenceScore: 98,
    steps: {
      empty: "상자 내부의 비닐 충전재(에어캡)나 내용물을 모두 꺼냅니다.",
      rinse: "이물질이 묻지 않도록 건조하고 깨끗한 상태를 유지합니다.",
      separate: "박스 겉면의 비닐 테이프, 택배 운송장 스티커, 철핀 등을 깔끔히 떼어냅니다.",
      sort: "상자를 납작하게 접어서 '종이류(골판지)' 수거함에 모아 배출합니다.",
    },
    disposalMethod: "테이프와 운송장 스티커를 모두 제거한 뒤 접어서 종이류로 배출하세요.",
    cautionTips: [
      "택배 테이프 및 스티커 접착제는 재생 종이 반죽 과정에서 덩어리를 형성하므로 완벽히 제거해야 합니다.",
      "비에 젖거나 오염된 박스는 일반쓰레기로 버려야 합니다.",
    ],
    faqs: [
      { q: "택배 운송장 종이도 같이 버려도 되나요?", a: "운송장은 특수 열감응 코팅지 및 접착제가 붙어있어 재활용이 안 되므로 일반쓰레기로 버려주세요." },
      { q: "박스 손잡이 노끈은 어떻게 하나요?", a: "노끈이나 플라스틱 손잡이는 제거 후 각각 해당 재질에 맞춰 분리합니다." },
    ],
    environmentalImpact: "종이 상자 1톤을 재활용하면 원목 17그루와 26,000리터의 물을 아낄 수 있습니다.",
  },

  "milk-carton": {
    itemName: "우유팩 / 음료 종이팩",
    category: "종이팩",
    categoryColor: "violet",
    recyclable: true,
    materialDetail: "우유팩 (Polyethylene Coated Paper, 최고급 펄프)",
    confidenceScore: 97,
    steps: {
      empty: "우유나 두유 등 내용을 전부 비워냅니다.",
      rinse: "물로 내부를 깨끗이 헹궈 냄새나 부패를 막습니다.",
      separate: "가위로 가로/세로를 갈라 넓게 펼친 후 건조시킵니다.",
      sort: "일반 종이와 섞지 말고 '종이팩 전용 수거함' 또는 주민센터 교환 사업(화장지 교환)을 활용해 배출합니다.",
    },
    disposalMethod: "씻어서 펼친 후 건조하여 종이팩 전용 수거함이나 주민센터 교환 부스에 배출하세요.",
    cautionTips: [
      "우유팩은 일반 신문지/상자와 재활용 공정(해리 시간)이 달라 일반 종이에 섞이면 폐기됩니다.",
      "주민센터에 우유팩을 모아가면 롤휴지나 쓰레기 봉투로 교환해주는 지자체가 많습니다.",
    ],
    faqs: [
      { q: "멸균팩(내부 은박 Aluminium 코팅)도 우유팩과 같나요?", a: "멸균팩은 일반 우유팩과 따로 분류하는 지자체가 늘고 있습니다. 지정 수거함이 없으면 종이팩 수거함에 배출하세요." },
    ],
    environmentalImpact: "우리나라 종이팩을 전량 재활용하면 연간 105억 원의 펄프 수입 대체 효과와 고급 화장지를 생산할 수 있습니다.",
  },

  "gas-can": {
    itemName: "부탄가스 / 에어로졸 캔",
    category: "캔류",
    categoryColor: "emerald",
    recyclable: true,
    materialDetail: "철캔 (Fe) / 주석 도금 강판",
    confidenceScore: 99,
    steps: {
      empty: "통풍이 잘되는 야외에서 노즐을 눌러 잔여 가스를 완벽히 빼냅니다.",
      rinse: "별도의 세척은 필요 없으나 가스 완충을 확인합니다.",
      separate: "캔 바깥쪽 하단에 가스 제거기나 송곳으로 구멍을 뚫어 남아있는 남아있는 미량의 가스를 배출합니다.",
      sort: "상단의 플라스틱 캡은 플라스틱으로 분리하고, 가스캔 본체는 '캔류(철캔)'로 배출합니다.",
    },
    disposalMethod: "통풍이 잘되는 야외에서 잔여 가스를 완전히 배출 후 캔류로 버리세요.",
    cautionTips: [
      "가스가 남아있는 상태로 청소차량에 들어가면 압착 과정에서 대형 폭발 화재 사고가 발생합니다.",
      "구멍을 뚫을 때는 화기나 전열기구가 없는 안전한 야외 공간에서 진행하세요.",
    ],
    faqs: [
      { q: "스프레이캔(헤어스프레이, 살충제)도 똑같나요?", a: "네, 에어로졸 스프레이 역시 동일하게 노즐을 오래 눌러 가스를 완전히 비운 뒤 구멍을 내어 배출합니다." },
    ],
    environmentalImpact: "금속 캔 1개를 재활용하면 TV를 3시간 동안 켤 수 있는 전력을 절약할 수 있습니다.",
  },

  "broken-glass": {
    itemName: "깨진 유리병 / 유리 파편",
    category: "일반쓰레기",
    categoryColor: "zinc",
    recyclable: false,
    materialDetail: "파손된 유리 (파유리)",
    confidenceScore: 95,
    steps: {
      empty: "내용물을 제거하고 안전 도구를 사용하여 모읍니다.",
      rinse: "파편 위험이 있으므로 직접 물세척은 삼가고 안전에 유의합니다.",
      separate: "신문지나 두꺼운 종이, 뽁뽁이로 여러 겹 꼼꼼히 싸서 작업자가 다치지 않게 합니다.",
      sort: "지자체 '불연성 종량제 마대' 또는 일반 종량제 봉투에 넣고 표면에 '깨진 유리 주의'라고 명시하여 배출합니다.",
    },
    disposalMethod: "신문지나 상자로 안전하게 감싼 후 불연성 쓰레기 마대 또는 종량제 봉투에 배출하세요.",
    cautionTips: [
      "깨진 유리는 병 재활용 공정(빈용기 재사용 및 수거)에 투입할 수 없으므로 재활용 불가합니다.",
      "수거 작업원의 안전을 위해 겉면에 '깨진 유리 위험' 문구를 크게 작성해주세요.",
    ],
    faqs: [
      { q: "내열유리(글라스락, 사렉스)나 거울도 유리병 재활용 되나요?", a: "아닙니다. 내열유리 및 거울, 도자기, 조명 전구는 녹는점이 일반 유리병과 달라 재활용되지 않으며 불연성 쓰레기입니다." },
    ],
    environmentalImpact: "안전한 불연성 배출은 환경 미화원의 인명 사고를 예방하는 소중한 배려입니다.",
  },
};

export const QUIZ_LIST: QuizItem[] = [
  {
    id: "q1",
    question: "깨끗이 씻은 우유팩은 일반 종이류(신문, 상자)와 함께 버려야 한다?",
    isRecyclable: false,
    category: "종이팩",
    explanation: "X (거짓)! 우유팩은 최고급 펄프로 제작되어 일반 종이와 해리 속도가 다릅니다. 일반 종이에 섞이면 재활용되지 못하고 폐기되므로 '종이팩 전용 수거함'에 따로 버려야 합니다.",
  },
  {
    id: "q2",
    question: "투명 페트병의 비닐 라벨은 떼어내어 비닐류로 따로 배출해야 한다?",
    isRecyclable: true,
    category: "투명 페트병",
    explanation: "O (참)! 비닐 라벨을 제거해야 고품질 투명 페트병 재생 원료(의류, 섬유)로 재활용할 수 있습니다.",
  },
  {
    id: "q3",
    question: "양념 국물이 빨갛게 배어든 스티로폼 용기는 깨끗이 씻어도 착색이 남아있다면 재활용할 수 없다?",
    isRecyclable: false,
    category: "스티로폼",
    explanation: "O (참)! 오염되거나 착색된 스티로폼은 원료 품질을 떨어뜨려 스티로폼 재활용이 불가능하므로 종량제 봉투(일반쓰레기)로 배출해야 합니다.",
  },
  {
    id: "q4",
    question: "부탄가스 캔은 구멍을 뚫지 않고 그대로 캔류로 버리는 것이 안전하다?",
    isRecyclable: false,
    category: "캔류",
    explanation: "X (거짓)! 남아있는 잔여 가스로 인해 청소차 압착 과정에서 폭발 화재가 생길 수 있습니다. 통풍이 잘되는 야외에서 잔여 가스를 빼고 구멍을 내어 배출해야 합니다.",
  },
  {
    id: "q5",
    question: "코팅된 영수증 및 택배 운송장 스티커는 종이류로 재활용된다?",
    isRecyclable: false,
    category: "일반쓰레기",
    explanation: "X (거짓)! 영수증(감열지)과 운송장 스티커는 특수 화학 코팅과 접착제가 묻어있어 재활용이 되지 않으며 일반쓰레기로 버려야 합니다.",
  },
];
