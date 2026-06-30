import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const projectRoot = join(import.meta.dirname, "../..")

function read(path) {
  return readFileSync(join(projectRoot, path), "utf8")
}

test("team scheduling board renders the standard capacity acceptance example", () => {
  const source = read("components/wfm-team-scheduling-board.tsx")

  for (const expectedText of [
    "上海职场 / A 项目 / A 组",
    "投诉",
    "10:00-10:30",
    "3.0 标准人力",
    "2.2",
    "0.8",
    "覆盖人数",
    "贡献人员",
    "低能力补位",
    "技能错配",
    "草稿可保存",
  ]) {
    assert.ok(source.includes(expectedText), `missing visible contract text: ${expectedText}`)
  }
})

test("new schedule plan page exposes the team scheduling board v0.1", () => {
  const pageSource = read("app/schedule-plans/new/page.tsx")

  assert.ok(pageSource.includes("WfmTeamSchedulingBoard"))
  assert.ok(pageSource.includes("<WfmTeamSchedulingBoard"))
})

test("team scheduling board does not leak implementation terms to operators", () => {
  const source = read("components/wfm-team-scheduling-board.tsx")

  for (const forbiddenText of ["Codex", "Gate", "Harness", "mock", "API", "schema"]) {
    assert.ok(!source.includes(forbiddenText), `operator UI must not include ${forbiddenText}`)
  }
})
