import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";
import test from "node:test";

const bannedTerms = [
  "暂不实现",
  "待开发动作",
  "本地只读",
  "数据接入状态",
  "只读演示",
  "无真实",
  "PRD",
  "验收",
  "占位",
  "不触发",
  "不保存",
  "不执行",
  "本批",
  "Gate",
  "No Database",
  "MVP 链路",
  "人员时间轴",
  "坐席状态轨迹",
];

const files = [
  ...globSync("app/**/*.tsx", { exclude: ["app/production-mvp/**"] }),
  ...globSync("components/**/*.tsx"),
].sort();

test("product UI copy does not expose internal execution language", () => {
  const offenders = [];

  for (const file of files) {
    const content = readFileSync(file, "utf8");
    for (const term of bannedTerms) {
      if (content.includes(term)) {
        offenders.push(`${file}: ${term}`);
      }
    }
  }

  assert.deepEqual(offenders, []);
});
