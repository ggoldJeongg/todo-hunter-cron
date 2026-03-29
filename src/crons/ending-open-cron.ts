import { PrismaClient } from "@prisma/client";
import { CronJob } from "../types/cron-type.js";
import { judgeEnding } from "../lib/ending-judge.js";

// 엔딩 open 크론잡
// 매주 일요일 자정: 스탯 조합을 분석하여 엔딩을 판정하고 endingState를 ENABLED(2)로 변경
const EndingOpenCron: CronJob = {
  name: "캐릭터 엔딩 판정 + open 업데이트",
  schedule: "0 0 * * 0", // 매주 일요일 자정
  task: async (prisma: PrismaClient) => {
    try {
      // endingState=1 (DISABLED) 인 캐릭터 + Status 조회
      const characters = await prisma.character.findMany({
        where: {
          endingState: 1,
        },
        include: {
          status: true,
        },
      });

      if (characters.length === 0) {
        console.log(`[${EndingOpenCron.name}] 대상 캐릭터가 없습니다.`);
        return;
      }

      let updatedCount = 0;

      for (const character of characters) {
        if (!character.status) {
          console.warn(
            `[${EndingOpenCron.name}] 캐릭터(${character.id})에 Status가 없습니다. 건너뜁니다.`
          );
          continue;
        }

        const { str, int, emo, fin, liv } = character.status;

        // 엔딩 판정
        const ending = judgeEnding({ str, int, emo, fin, liv });

        // 캐릭터에 엔딩 결과 저장 + endingState=2 (ENABLED)
        await prisma.character.update({
          where: { id: character.id },
          data: {
            endingState: 2,
            endingCode: ending.code,
          },
        });

        console.log(
          `[${EndingOpenCron.name}] 캐릭터(${character.id}): ` +
            `STR=${str} INT=${int} EMO=${emo} FIN=${fin} LIV=${liv} → ` +
            `${ending.name} (${ending.code})`
        );

        updatedCount++;
      }

      console.log(
        `[${EndingOpenCron.name}] ${updatedCount}개의 캐릭터 엔딩이 판정되었습니다.`
      );
    } catch (error) {
      console.error(`[${EndingOpenCron.name}] 실패:`, error);
    }
  },
};

export default EndingOpenCron;
