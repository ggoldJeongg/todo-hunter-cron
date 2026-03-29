import { ENDINGS, EndingData, DEFAULT_ENDING } from "../data/ending-data.js";

/**
 * endingCode로 엔딩 데이터를 조회한다.
 * DB에 저장된 endingCode를 기반으로 프론트엔드에 전달할 데이터를 반환.
 *
 * @param endingCode - Character.endingCode (예: "STEEL_WARRIOR")
 * @returns 엔딩 데이터 (이름, 스토리, 배경 이미지 등)
 *
 * @example
 * // 크론에서 판정 후 DB에 저장된 endingCode를 조회
 * const ending = resolveEnding("MAGIC_SWORDSMAN");
 * // → { id: "D1", code: "MAGIC_SWORDSMAN", name: "마검사", background: "fight.png", ... }
 *
 * // 프론트엔드 API 응답 예시
 * // GET /api/ending?characterId=1
 * // → { endingCode: "MAGIC_SWORDSMAN", name: "마검사", story: [...], background: "fight.png" }
 */
export function resolveEnding(endingCode: string | null): EndingData {
  if (!endingCode) {
    return DEFAULT_ENDING;
  }

  return ENDINGS[endingCode] ?? DEFAULT_ENDING;
}

/**
 * 프론트엔드 API 응답용 엔딩 데이터를 생성한다.
 *
 * @example
 * // API Route에서 사용
 * const response = getEndingResponse("STEEL_WARRIOR");
 * // → { code: "STEEL_WARRIOR", name: "강철의 전사", type: "single",
 * //     story: [...], background: "/images/endings/fight.png" }
 */
export function getEndingResponse(endingCode: string | null) {
  const ending = resolveEnding(endingCode);

  return {
    code: ending.code,
    name: ending.name,
    type: ending.type,
    story: ending.story,
    // 프론트엔드에서 사용할 이미지 경로 (Next.js public 기준)
    background: `/images/endings/${ending.background}`,
  };
}
