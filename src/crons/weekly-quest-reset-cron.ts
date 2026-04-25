import { PrismaClient } from "@prisma/client";
import { CronJob } from "../types/cron-type.js";

// 주간 퀘스트 월요일 리셋 크론잡 (all 유저)
// isWeekly=true 퀘스트의 SuccessDay 기록만 삭제하여 다음 주에 다시 도전 가능하게 함.
// 데일리 퀘스트의 SuccessDay 는 보존 (별도 일간 리셋 책임).
const WeeklyQuestResetCron: CronJob = {
  name: "주간 퀘스트 월요일 리셋",
  schedule: "0 0 * * 1", // 매주 월요일 자정
  task: async (prisma: PrismaClient) => {
    try {
      const result = await prisma.successDay.deleteMany({
        where: {
          quest: {
            isWeekly: true,
          },
        },
      });
      console.log(
        `[${WeeklyQuestResetCron.name}] ${result.count}개의 weekly SuccessDay 가 삭제되었습니다.`
      );
    } catch (error) {
      console.error(`[${WeeklyQuestResetCron.name}] 실패:`, error);
    }
  },
};

export default WeeklyQuestResetCron;
