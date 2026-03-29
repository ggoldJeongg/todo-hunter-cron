/**
 * 엔딩 판정 수동 테스트 스크립트
 *
 * 사용법:
 *   npm run build && node dist/scripts/test-ending.js [옵션]
 *
 * 옵션:
 *   --user <userId>       로그인 유저 ID 기준으로 테스트 (기본: 전체 캐릭터)
 *   --character <charId>  캐릭터 ID 직접 지정
 *   --stats <STR,INT,EMO,FIN,LIV>  테스트 스탯 (예: 10,3,2,1,0)
 *   --no-restore          테스트 후 스탯 복구 안 함
 *   --sim-only            DB 변경 없이 시뮬레이션만 실행
 *   --all                 모든 캐릭터에 대해 판정 실행
 *
 * 예시:
 *   node dist/scripts/test-ending.js --user 2
 *   node dist/scripts/test-ending.js --user 2 --stats 10,3,2,1,0
 *   node dist/scripts/test-ending.js --all
 *   node dist/scripts/test-ending.js --sim-only
 */

import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { judgeEnding } from "../lib/ending-judge.js";

// ============================================================
// CLI 인자 파싱
// ============================================================

function parseArgs() {
  const args = process.argv.slice(2);

  const options = {
    userId: null as number | null,
    characterId: null as number | null,
    stats: null as { str: number; int: number; emo: number; fin: number; liv: number } | null,
    restore: true,
    simOnly: false,
    all: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--user":
        options.userId = Number(args[++i]);
        break;
      case "--character":
        options.characterId = Number(args[++i]);
        break;
      case "--stats": {
        const parts = args[++i].split(",").map(Number);
        if (parts.length !== 5 || parts.some(isNaN)) {
          console.error("--stats 형식: STR,INT,EMO,FIN,LIV (예: 10,3,2,1,0)");
          process.exit(1);
        }
        options.stats = { str: parts[0], int: parts[1], emo: parts[2], fin: parts[3], liv: parts[4] };
        break;
      }
      case "--no-restore":
        options.restore = false;
        break;
      case "--sim-only":
        options.simOnly = true;
        break;
      case "--all":
        options.all = true;
        break;
      default:
        console.error(`알 수 없는 옵션: ${args[i]}`);
        console.log("\n사용법: node dist/scripts/test-ending.js [--user <id>] [--stats STR,INT,EMO,FIN,LIV] [--all] [--sim-only]");
        process.exit(1);
    }
  }

  return options;
}

// ============================================================
// 단일 캐릭터 엔딩 판정
// ============================================================

async function judgeCharacter(
  characterId: number,
  testStats: { str: number; int: number; emo: number; fin: number; liv: number } | null,
  restore: boolean,
  simOnly: boolean
) {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: { status: true, user: { select: { loginId: true, nickname: true } } },
  });

  if (!character) {
    console.error(`  캐릭터(${characterId})를 찾을 수 없습니다.`);
    return;
  }

  if (!character.status) {
    console.error(`  캐릭터(${characterId})에 Status가 없습니다.`);
    return;
  }

  const originalStats = {
    str: character.status.str,
    int: character.status.int,
    emo: character.status.emo,
    fin: character.status.fin,
    liv: character.status.liv,
  };

  console.log(`\n  유저: ${character.user.nickname} (${character.user.loginId})`);
  console.log(`  캐릭터 ID: ${character.id}`);
  console.log(`  현재 스탯: STR=${originalStats.str} INT=${originalStats.int} EMO=${originalStats.emo} FIN=${originalStats.fin} LIV=${originalStats.liv}`);
  console.log(`  현재 endingState: ${character.endingState}, endingCode: ${character.endingCode ?? "(없음)"}`);

  // 테스트 스탯 적용
  const statsToJudge = testStats ?? originalStats;

  if (testStats && !simOnly) {
    await prisma.status.update({
      where: { characterId },
      data: testStats,
    });
    console.log(`  → 테스트 스탯 적용: STR=${testStats.str} INT=${testStats.int} EMO=${testStats.emo} FIN=${testStats.fin} LIV=${testStats.liv}`);
  }

  // 엔딩 판정
  const ending = judgeEnding(statsToJudge);

  console.log(`\n  ✦ 판정 결과: ${ending.name} (${ending.code})`);
  console.log(`  ✦ 배경: ${ending.background}`);
  console.log(`  ✦ 스토리:`);
  ending.story.forEach((line, i) => console.log(`    ${i + 1}. ${line}`));

  // DB 저장
  if (!simOnly) {
    await prisma.character.update({
      where: { id: characterId },
      data: {
        endingState: 2,
        endingCode: ending.code,
      },
    });
    console.log(`\n  → DB 저장 완료 (endingState=2, endingCode="${ending.code}")`);

    // 스탯 복구
    if (restore && testStats) {
      await prisma.status.update({
        where: { characterId },
        data: originalStats,
      });
      console.log("  → 스탯 원래대로 복구 완료");
    }
  } else {
    console.log("\n  → [sim-only] DB 변경 없음");
  }
}

// ============================================================
// 19개 엔딩 시뮬레이션
// ============================================================

function runSimulation() {
  console.log("\n========================================");
  console.log(" 전체 엔딩 판정 시뮬레이션 (19개)");
  console.log("========================================\n");

  const testCases = [
    { label: "S1 나태한 모험가",       expected: "LAZY_ADVENTURER",   stats: { str: 0, int: 0, emo: 0, fin: 0, liv: 0 } },
    { label: "S2 진정한 용사",         expected: "TRUE_HERO",         stats: { str: 5, int: 5, emo: 5, fin: 5, liv: 5 } },
    { label: "S3 전설의 영웅",         expected: "LEGENDARY",         stats: { str: 10, int: 10, emo: 10, fin: 10, liv: 10 } },
    { label: "A1 강철의 전사 (STR)",   expected: "STEEL_WARRIOR",     stats: { str: 10, int: 1, emo: 1, fin: 1, liv: 1 } },
    { label: "A2 현자의 길 (INT)",     expected: "SAGE_PATH",         stats: { str: 1, int: 10, emo: 1, fin: 1, liv: 1 } },
    { label: "A3 공감의 시인 (EMO)",   expected: "EMPATHY_POET",      stats: { str: 1, int: 1, emo: 10, fin: 1, liv: 1 } },
    { label: "A4 황금의 상인 (FIN)",   expected: "GOLDEN_MERCHANT",   stats: { str: 1, int: 1, emo: 1, fin: 10, liv: 1 } },
    { label: "A5 마을의 수호자 (LIV)", expected: "VILLAGE_GUARDIAN",  stats: { str: 1, int: 1, emo: 1, fin: 1, liv: 10 } },
    { label: "D1 마검사 (STR+INT)",        expected: "MAGIC_SWORDSMAN",  stats: { str: 8, int: 7, emo: 1, fin: 1, liv: 1 } },
    { label: "D2 수호기사 (STR+EMO)",      expected: "GUARDIAN_KNIGHT",  stats: { str: 8, int: 1, emo: 7, fin: 1, liv: 1 } },
    { label: "D3 투기장의 챔피언 (STR+FIN)", expected: "ARENA_CHAMPION",  stats: { str: 8, int: 1, emo: 1, fin: 7, liv: 1 } },
    { label: "D4 자급자족 사냥꾼 (STR+LIV)", expected: "WILD_HUNTER",    stats: { str: 8, int: 1, emo: 1, fin: 1, liv: 7 } },
    { label: "D5 치유의 마법사 (INT+EMO)",  expected: "HEALING_MAGE",    stats: { str: 1, int: 8, emo: 7, fin: 1, liv: 1 } },
    { label: "D6 연금술사 (INT+FIN)",      expected: "ALCHEMIST",        stats: { str: 1, int: 8, emo: 1, fin: 7, liv: 1 } },
    { label: "D7 발명가 (INT+LIV)",        expected: "INVENTOR",         stats: { str: 1, int: 8, emo: 1, fin: 1, liv: 7 } },
    { label: "D8 음유시인 (EMO+FIN)",      expected: "BARD",             stats: { str: 1, int: 1, emo: 8, fin: 7, liv: 1 } },
    { label: "D9 드루이드 (EMO+LIV)",      expected: "DRUID",            stats: { str: 1, int: 1, emo: 8, fin: 1, liv: 7 } },
    { label: "D10 길드 마스터 (FIN+LIV)",  expected: "GUILD_MASTER",     stats: { str: 1, int: 1, emo: 1, fin: 8, liv: 7 } },
    { label: "F1 평범한 하루 (낮은 스탯)",  expected: "ORDINARY_DAY",    stats: { str: 1, int: 2, emo: 1, fin: 0, liv: 1 } },
  ];

  let passCount = 0;
  let failCount = 0;

  console.log(
    "결과".padEnd(6) +
    "엔딩".padEnd(35) +
    "판정".padEnd(22) +
    "배경"
  );
  console.log("-".repeat(80));

  for (const tc of testCases) {
    const result = judgeEnding(tc.stats);
    const pass = result.code === tc.expected;
    pass ? passCount++ : failCount++;

    console.log(
      (pass ? "PASS" : "FAIL").padEnd(6) +
      tc.label.padEnd(35) +
      `${result.name} (${result.code})`.padEnd(22) +
      result.background
    );

    if (!pass) {
      console.log(`       expected: ${tc.expected}, got: ${result.code}`);
    }
  }

  console.log(`\n  결과: ${passCount} PASS / ${failCount} FAIL (총 ${testCases.length}개)`);
  if (failCount === 0) console.log("  모든 엔딩 판정 테스트 통과!");
}

// ============================================================
// 메인
// ============================================================

async function main() {
  const options = parseArgs();

  console.log("========================================");
  console.log(" 엔딩 판정 테스트");
  console.log("========================================");

  if (options.all) {
    // 전체 캐릭터 판정
    const characters = await prisma.character.findMany({
      select: { id: true },
    });

    console.log(`\n전체 캐릭터 ${characters.length}명 판정 시작`);

    for (const char of characters) {
      console.log("\n----------------------------------------");
      await judgeCharacter(char.id, options.stats, options.restore, options.simOnly);
    }
  } else if (options.userId) {
    // userId로 캐릭터 조회
    const character = await prisma.character.findFirst({
      where: { userId: options.userId },
      select: { id: true },
    });

    if (!character) {
      console.error(`\nuserId=${options.userId}에 해당하는 캐릭터가 없습니다.`);
      return;
    }

    await judgeCharacter(character.id, options.stats, options.restore, options.simOnly);
  } else if (options.characterId) {
    // characterId 직접 지정
    await judgeCharacter(options.characterId, options.stats, options.restore, options.simOnly);
  } else {
    // 인자 없으면 사용법 출력 + 시뮬레이션만
    console.log("\n인자가 없어 시뮬레이션만 실행합니다.");
    console.log("특정 유저 테스트: node dist/scripts/test-ending.js --user <userId>");
    console.log("전체 유저 판정:   node dist/scripts/test-ending.js --all\n");
  }

  // 항상 시뮬레이션 출력
  runSimulation();
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
