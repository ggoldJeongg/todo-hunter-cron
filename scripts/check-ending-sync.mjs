// 두 레포의 엔딩 코드 동기화 검증 스크립트
// - cron: src/data/ending-data.ts 의 ENDINGS 객체
// - main: constants/ending.ts 의 ENDING_MAP 객체
// 두 객체의 최상위 키 목록이 일치해야 통과.
//
// 사용:
//   npm run check-endings                       (기본 경로 사용)
//   MAIN_DATA_FILE=path/to/ending.ts npm run check-endings

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 기본 경로: cron 레포는 자기 자신, main은 형제 디렉토리
const cronFile = path.resolve(
  __dirname,
  "..",
  process.env.CRON_DATA_FILE ?? "src/data/ending-data.ts"
);
const mainFile = path.resolve(
  __dirname,
  "..",
  process.env.MAIN_DATA_FILE ?? "../todo-hunter/constants/ending.ts"
);

// 항목 앞의 공백, // 한 줄 주석, /* 블록 주석 */ 을 제거
function stripLeading(s) {
  let prev;
  let cur = s;
  do {
    prev = cur;
    cur = cur.replace(/^\s+/, "");
    cur = cur.replace(/^\/\/[^\n]*\n?/, "");
    cur = cur.replace(/^\/\*[\s\S]*?\*\//, "");
  } while (cur !== prev);
  return cur;
}

function extractTopLevelKeys(text, mapName) {
  const reStart = new RegExp(`export\\s+const\\s+${mapName}\\b[^=]*=\\s*\\{`);
  const m = text.match(reStart);
  if (!m) {
    throw new Error(`${mapName} 정의를 찾을 수 없음`);
  }

  // 매칭하는 닫는 괄호 위치 찾기
  const startIdx = m.index + m[0].length;
  let depth = 1;
  let endIdx = startIdx;
  while (endIdx < text.length && depth > 0) {
    const c = text[endIdx];
    if (c === "{") depth++;
    else if (c === "}") depth--;
    if (depth > 0) endIdx++;
  }
  const block = text.slice(startIdx, endIdx);

  // 최상위 엔트리만 추출 (중첩 객체/배열 안의 필드는 제외)
  const keys = [];
  let buf = "";
  let curDepth = 0;
  for (const c of block) {
    if (c === "{" || c === "[" || c === "(") curDepth++;
    else if (c === "}" || c === "]" || c === ")") curDepth--;

    if (curDepth === 0 && c === ",") {
      const km = stripLeading(buf).match(/^([A-Z_][A-Z0-9_]*)/);
      if (km) keys.push(km[1]);
      buf = "";
    } else {
      buf += c;
    }
  }
  // 마지막 항목 (trailing comma 없는 경우 대비)
  const km = stripLeading(buf).match(/^([A-Z_][A-Z0-9_]*)/);
  if (km) keys.push(km[1]);

  return keys.sort();
}

function main() {
  for (const [label, p] of [["cron", cronFile], ["main", mainFile]]) {
    if (!fs.existsSync(p)) {
      console.error(`✗ ${label} 데이터 파일을 찾을 수 없음: ${p}`);
      process.exit(1);
    }
  }

  const cronText = fs.readFileSync(cronFile, "utf-8");
  const mainText = fs.readFileSync(mainFile, "utf-8");

  let cronKeys, mainKeys;
  try {
    cronKeys = extractTopLevelKeys(cronText, "ENDINGS");
  } catch (e) {
    console.error(`✗ cron 파싱 실패 (${cronFile}): ${e.message}`);
    process.exit(1);
  }
  try {
    mainKeys = extractTopLevelKeys(mainText, "ENDING_MAP");
  } catch (e) {
    console.error(`✗ main 파싱 실패 (${mainFile}): ${e.message}`);
    process.exit(1);
  }

  const inCronOnly = cronKeys.filter((k) => !mainKeys.includes(k));
  const inMainOnly = mainKeys.filter((k) => !cronKeys.includes(k));

  if (inCronOnly.length === 0 && inMainOnly.length === 0) {
    console.log(`✓ 엔딩 코드 ${cronKeys.length}개 양쪽 동기화 OK`);
    console.log(`  ${cronKeys.join(", ")}`);
    process.exit(0);
  }

  console.error("✗ 엔딩 코드 불일치");
  if (inCronOnly.length) {
    console.error(`  cron에만 있음 (${inCronOnly.length}): ${inCronOnly.join(", ")}`);
  }
  if (inMainOnly.length) {
    console.error(`  main에만 있음 (${inMainOnly.length}): ${inMainOnly.join(", ")}`);
  }
  console.error("");
  console.error("수정 방법:");
  console.error("  1) cron: src/data/ending-data.ts 의 ENDINGS 객체");
  console.error("  2) main: constants/ending.ts 의 ENDING_MAP 객체");
  console.error("  양쪽에 동일한 endingCode 가 있어야 합니다.");
  process.exit(1);
}

main();
