import {
  EndingData,
  SINGLE_STAT_ENDINGS,
  DUAL_STAT_ENDINGS,
  SPECIAL_ENDINGS,
  DEFAULT_ENDING,
} from "../data/ending-data.js";

interface Stats {
  str: number;
  int: number;
  emo: number;
  fin: number;
  liv: number;
}

/**
 * 스탯 조합을 분석하여 엔딩을 판정한다.
 *
 * 판정 우선순위:
 * 1. 특수 엔딩 (올스탯 조건)
 * 2. 듀얼 스탯 엔딩 (상위 2개 스탯이 비슷할 때)
 * 3. 단일 스탯 엔딩 (1개 스탯이 압도적일 때)
 * 4. 기본 엔딩
 */
export function judgeEnding(stats: Stats): EndingData {
  const { str, int, emo, fin, liv } = stats;
  const values = [str, int, emo, fin, liv];
  const total = values.reduce((sum, v) => sum + v, 0);
  const max = Math.max(...values);
  const min = Math.min(...values);

  // ========== 1순위: 특수 엔딩 ==========

  // 배드 엔딩: 아무것도 안 함
  if (total === 0) {
    return SPECIAL_ENDINGS.LAZY_ADVENTURER;
  }

  // 트루 엔딩: 올스탯 극한 균형
  if (total >= 50 && max - min <= 2) {
    return SPECIAL_ENDINGS.LEGENDARY;
  }

  // 히든 엔딩: 올스탯 균형
  if (max - min <= 2 && total >= 10) {
    return SPECIAL_ENDINGS.TRUE_HERO;
  }

  // ========== 2순위: 듀얼 / 단일 스탯 엔딩 ==========

  // 스탯을 정렬하여 상위 2개 추출
  const statEntries: [string, number][] = [
    ["str", str],
    ["int", int],
    ["emo", emo],
    ["fin", fin],
    ["liv", liv],
  ];
  const sorted = statEntries.sort((a, b) => b[1] - a[1]);

  const [first, second] = sorted;
  const gap = first[1] - second[1];

  // 듀얼 스탯: 1위와 2위 차이가 2 이하이고, 1위 스탯이 3 이상
  if (gap <= 2 && first[1] >= 3 && second[1] >= 3) {
    const key = [first[0], second[0]].sort().join("_");
    const dualEnding = DUAL_STAT_ENDINGS[key];
    if (dualEnding) {
      return dualEnding;
    }
  }

  // 단일 스탯: 1위 스탯이 3 이상
  if (first[1] >= 3) {
    const singleEnding = SINGLE_STAT_ENDINGS[first[0]];
    if (singleEnding) {
      return singleEnding;
    }
  }

  // ========== 3순위: 기본 엔딩 ==========
  return DEFAULT_ENDING;
}
