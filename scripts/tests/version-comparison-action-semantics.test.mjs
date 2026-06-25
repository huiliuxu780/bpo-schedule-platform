import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const modelPath = "components/import-center-version-model.ts"

test("version workbench comparison actions use comparison-run semantics", async () => {
  const source = await readFile(modelPath, "utf8")

  for (const expected of [
    '"可发起比对运行"',
    '"发起比对运行"',
    '"比对运行已生成"',
    '"查看比对运行列表"',
    '"最新一次比对运行结果"',
    '"业务版本列表比对运行结果"',
  ]) {
    assert.match(source, new RegExp(expected), `${expected} should be present`)
  }

  for (const deprecated of [
    '"可发起一次比对"',
    '"发起一次比对"',
    '"比对已生成新运行"',
    '"查看结果列表"',
    '"最新一次比对结果"',
    '"业务版本列表比对结果"',
  ]) {
    assert.doesNotMatch(source, new RegExp(deprecated), `${deprecated} should not be present`)
  }
})
