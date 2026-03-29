// 엔딩 타입 정의
export type EndingType = "special" | "single" | "dual" | "default";

export interface EndingData {
  id: string;
  code: string;
  name: string;
  type: EndingType;
  stats?: string[];
  story: string[];
  background: string; // 이미지 파일명 (확장자 포함)
}

// ==================== 배경 이미지 매핑 ====================
// 실제 이미지 파일: src/data/*.png
// 프론트엔드에서는 public/images/endings/ 경로로 복사하여 사용

export const BACKGROUND_IMAGES = {
  battle: "fight.png",       // 전투/투기장
  library: "library.png",    // 도서관/마법탑
  forest: "forest.png",      // 숲/자연
  market: "square.png",      // 시장/광장
  village: "town.png",       // 마을/집
  lazy: "bad_room.png",      // 여관 침대 (배드 엔딩)
  hero: "town.png",          // 왕성/대전 (TODO: 전용 이미지 추가 시 교체)
} as const;

// ==================== 특수 엔딩 ====================

const LAZY_ADVENTURER: EndingData = {
  id: "S1",
  code: "LAZY_ADVENTURER",
  name: "나태한 모험가",
  type: "special",
  story: [
    "여관 침대에서 뒹굴며 한 주가 지나갔다.",
    '창밖으로 들려오는 모험가들의 발소리가 점점 멀어진다.',
    '"내일부터 시작하지 뭐..." 라고 중얼거리며 다시 눈을 감는다.',
  ],
  background: BACKGROUND_IMAGES.lazy,
};

const TRUE_HERO: EndingData = {
  id: "S2",
  code: "TRUE_HERO",
  name: "진정한 용사",
  type: "special",
  story: [
    "검술도, 마법도, 마음도, 살림도 모두 갈고닦은 한 주.",
    '마을 사람들이 말한다. "저 사람이야말로 진정한 용사다."',
    "어떤 위기가 와도 흔들리지 않는, 균형 잡힌 영웅의 모습이 빛난다.",
  ],
  background: BACKGROUND_IMAGES.hero,
};

const LEGENDARY: EndingData = {
  id: "S3",
  code: "LEGENDARY",
  name: "전설의 영웅",
  type: "special",
  story: [
    "모든 분야에서 극에 달한 능력치. 세계가 당신의 이름을 기억한다.",
    '전설은 이렇게 기록된다 — "그는 모든 것을 해냈다."',
    "왕국의 기사도, 마법학원의 현자도, 모두가 당신을 우러러본다.",
  ],
  background: BACKGROUND_IMAGES.hero,
};

// ==================== 단일 스탯 엔딩 ====================

const STEEL_WARRIOR: EndingData = {
  id: "A1",
  code: "STEEL_WARRIOR",
  name: "강철의 전사",
  type: "single",
  stats: ["str"],
  story: [
    "쉬지 않고 몸을 단련한 한 주. 근육에 힘이 넘친다.",
    "마을을 위협하던 몬스터를 압도적인 힘으로 제압했다.",
    '"강철의 전사 만세!" 사람들이 환호한다.',
  ],
  background: BACKGROUND_IMAGES.battle,
};

const SAGE_PATH: EndingData = {
  id: "A2",
  code: "SAGE_PATH",
  name: "현자의 길",
  type: "single",
  stats: ["int"],
  story: [
    "지식을 갈구하며 책과 함께한 한 주.",
    "고대 마법서를 해독해 몬스터의 약점을 간파했다.",
    "힘이 아닌 지혜로 거둔 승리. 마법학원에서 초청장이 왔다.",
  ],
  background: BACKGROUND_IMAGES.library,
};

const EMPATHY_POET: EndingData = {
  id: "A3",
  code: "EMPATHY_POET",
  name: "공감의 시인",
  type: "single",
  stats: ["emo"],
  story: [
    "마음을 열고 세상과 교감한 한 주.",
    "몬스터와 대화에 성공했다. 알고 보니 외로운 존재였다.",
    "칼 대신 말로 해결한 이야기가 마을에 퍼진다.",
  ],
  background: BACKGROUND_IMAGES.forest,
};

const GOLDEN_MERCHANT: EndingData = {
  id: "A4",
  code: "GOLDEN_MERCHANT",
  name: "황금의 상인",
  type: "single",
  stats: ["fin"],
  story: [
    "재화를 모으고 투자한 한 주. 금화가 쌓여간다.",
    "용병을 고용해 몬스터를 처리하고, 마을 경제를 부흥시켰다.",
    '"돈이면 안 되는 게 없지." 자신만만한 미소를 짓는다.',
  ],
  background: BACKGROUND_IMAGES.market,
};

const VILLAGE_GUARDIAN: EndingData = {
  id: "A5",
  code: "VILLAGE_GUARDIAN",
  name: "마을의 수호자",
  type: "single",
  stats: ["liv"],
  story: [
    "마을 곳곳을 정비하며 보낸 한 주.",
    "성벽을 보강하고 함정을 설치해 몬스터가 접근조차 못 한다.",
    "마을 사람들이 평화로운 밤을 보낸다. 모두 당신 덕분이다.",
  ],
  background: BACKGROUND_IMAGES.village,
};

// ==================== 듀얼 스탯 엔딩 ====================

const MAGIC_SWORDSMAN: EndingData = {
  id: "D1",
  code: "MAGIC_SWORDSMAN",
  name: "마검사",
  type: "dual",
  stats: ["str", "int"],
  story: [
    "검과 마법, 두 가지 길을 동시에 걸은 한 주.",
    "전략적 전투로 보스급 몬스터를 단독 격파했다.",
    "마법 검사의 전설이 시작된다.",
  ],
  background: BACKGROUND_IMAGES.battle,
};

const GUARDIAN_KNIGHT: EndingData = {
  id: "D2",
  code: "GUARDIAN_KNIGHT",
  name: "수호기사",
  type: "dual",
  stats: ["str", "emo"],
  story: [
    "힘을 기르되, 지키고 싶은 사람을 떠올린 한 주.",
    "동료가 위험에 빠졌을 때 몸을 던져 막아냈다.",
    '"당신이 있어서 든든합니다." 동료의 눈에 눈물이 맺힌다.',
  ],
  background: BACKGROUND_IMAGES.battle,
};

const ARENA_CHAMPION: EndingData = {
  id: "D3",
  code: "ARENA_CHAMPION",
  name: "투기장의 챔피언",
  type: "dual",
  stats: ["str", "fin"],
  story: [
    "전투력을 갈고닦으며 상금을 노린 한 주.",
    "투기장에서 연전연승. 명성과 부를 동시에 거머쥐었다.",
    "관중의 환호 속에서 챔피언 벨트를 들어올린다.",
  ],
  background: BACKGROUND_IMAGES.battle,
};

const WILD_HUNTER: EndingData = {
  id: "D4",
  code: "WILD_HUNTER",
  name: "자급자족 사냥꾼",
  type: "dual",
  stats: ["str", "liv"],
  story: [
    "숲에서 몸을 단련하며 자연과 함께한 한 주.",
    "몬스터를 사냥하고, 직접 요리하고, 자유롭게 살아간다.",
    "누구에게도 얽매이지 않는 사냥꾼의 삶.",
  ],
  background: BACKGROUND_IMAGES.forest,
};

const HEALING_MAGE: EndingData = {
  id: "D5",
  code: "HEALING_MAGE",
  name: "치유의 마법사",
  type: "dual",
  stats: ["int", "emo"],
  story: [
    "지식과 공감 능력을 함께 키운 한 주.",
    "치유 마법을 개발해 몬스터에게 상처받은 마을 사람을 치료했다.",
    '"고마워요, 선생님." 아이의 미소가 보답이다.',
  ],
  background: BACKGROUND_IMAGES.library,
};

const ALCHEMIST: EndingData = {
  id: "D6",
  code: "ALCHEMIST",
  name: "연금술사",
  type: "dual",
  stats: ["int", "fin"],
  story: [
    "지식을 돈으로 바꾸는 법을 터득한 한 주.",
    "몬스터 재료로 묘약을 제조해 대박 사업을 벌였다.",
    "실험실과 금고가 동시에 가득 찬다.",
  ],
  background: BACKGROUND_IMAGES.library,
};

const INVENTOR: EndingData = {
  id: "D7",
  code: "INVENTOR",
  name: "발명가",
  type: "dual",
  stats: ["int", "liv"],
  story: [
    "머리를 쓰며 생활을 개선한 한 주.",
    "마법 도구를 발명해 마을의 생활 수준을 한 단계 끌어올렸다.",
    '"이 세상을 더 편리하게!" 오늘도 설계도를 그린다.',
  ],
  background: BACKGROUND_IMAGES.village,
};

const BARD: EndingData = {
  id: "D8",
  code: "BARD",
  name: "음유시인",
  type: "dual",
  stats: ["emo", "fin"],
  story: [
    "감성과 사업 감각을 동시에 발휘한 한 주.",
    "모험담을 노래로 만들어 전국을 순회한다.",
    "감동과 금화를 동시에 거두는 예술가의 삶.",
  ],
  background: BACKGROUND_IMAGES.market,
};

const DRUID: EndingData = {
  id: "D9",
  code: "DRUID",
  name: "드루이드",
  type: "dual",
  stats: ["emo", "liv"],
  story: [
    "자연과 마음으로 교감한 한 주.",
    "숲의 정령과 친구가 되어 자연의 균형을 지킨다.",
    '"숲이 당신을 기억합니다." 바람이 속삭인다.',
  ],
  background: BACKGROUND_IMAGES.forest,
};

const GUILD_MASTER: EndingData = {
  id: "D10",
  code: "GUILD_MASTER",
  name: "길드 마스터",
  type: "dual",
  stats: ["fin", "liv"],
  story: [
    "재정과 실무를 동시에 챙긴 한 주.",
    "모험가 길드를 설립하고 체계적으로 마을을 운영한다.",
    "모든 모험가가 당신의 길드 문을 두드린다.",
  ],
  background: BACKGROUND_IMAGES.market,
};

// ==================== 기본 엔딩 ====================

const ORDINARY_DAY: EndingData = {
  id: "F1",
  code: "ORDINARY_DAY",
  name: "평범한 하루",
  type: "default",
  story: [
    "특별할 것 없는 평범한 한 주가 지나갔다.",
    "대단한 일은 없었지만, 그래도 하루하루를 살았다.",
    "다음 주에는 좀 더 열심히 해볼까?",
  ],
  background: BACKGROUND_IMAGES.village,
};

// ==================== 엔딩 맵 (코드 → 데이터) ====================

export const ENDINGS: Record<string, EndingData> = {
  LAZY_ADVENTURER,
  TRUE_HERO,
  LEGENDARY,
  STEEL_WARRIOR,
  SAGE_PATH,
  EMPATHY_POET,
  GOLDEN_MERCHANT,
  VILLAGE_GUARDIAN,
  MAGIC_SWORDSMAN,
  GUARDIAN_KNIGHT,
  ARENA_CHAMPION,
  WILD_HUNTER,
  HEALING_MAGE,
  ALCHEMIST,
  INVENTOR,
  BARD,
  DRUID,
  GUILD_MASTER,
  ORDINARY_DAY,
};

// ==================== 단일 스탯 → 엔딩 매핑 ====================

export const SINGLE_STAT_ENDINGS: Record<string, EndingData> = {
  str: STEEL_WARRIOR,
  int: SAGE_PATH,
  emo: EMPATHY_POET,
  fin: GOLDEN_MERCHANT,
  liv: VILLAGE_GUARDIAN,
};

// ==================== 듀얼 스탯 → 엔딩 매핑 (키: "stat1_stat2" 정렬순) ====================

export const DUAL_STAT_ENDINGS: Record<string, EndingData> = {
  emo_fin: BARD,
  emo_int: HEALING_MAGE,
  emo_liv: DRUID,
  emo_str: GUARDIAN_KNIGHT,
  fin_int: ALCHEMIST,
  fin_liv: GUILD_MASTER,
  fin_str: ARENA_CHAMPION,
  int_liv: INVENTOR,
  int_str: MAGIC_SWORDSMAN,
  liv_str: WILD_HUNTER,
};

// ==================== 특수 & 기본 엔딩 export ====================

export const SPECIAL_ENDINGS = {
  LAZY_ADVENTURER,
  TRUE_HERO,
  LEGENDARY,
};

export const DEFAULT_ENDING = ORDINARY_DAY;
