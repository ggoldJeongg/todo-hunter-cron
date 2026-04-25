import { PrismaClient } from "@prisma/client";
import { CronJob } from "../types/cron-type.js";

// 의지력 자정 리셋 크론잡 (all 유저)
// MAX_WILLPOWER 공식: 100 + level * 10  (메인 앱 constants/game.ts 와 동일하게 유지)
const WillpowerResetCron: CronJob = {
  name: "캐릭터 willpower 자정 리셋",
  schedule: "0 0 * * *", // 매일 자정
  task: async (prisma: PrismaClient) => {
    try {
      const affected = await prisma.$executeRaw`
        UPDATE "Character" SET willpower = 100 + level * 10
      `;
      console.log(
        `[${WillpowerResetCron.name}] ${affected}개의 character willpower가 리셋되었습니다.`
      );
    } catch (error) {
      console.error(`[${WillpowerResetCron.name}] 실패:`, error);
    }
  },
};

export default WillpowerResetCron;
