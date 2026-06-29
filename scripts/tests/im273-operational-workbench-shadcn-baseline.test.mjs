import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const root = join(import.meta.dirname, "..", "..")

function read(path) {
  return readFileSync(join(root, path), "utf8")
}

const listPages = [
  "app/schedule-plans/page.tsx",
  "app/schedule-risks/page.tsx",
  "app/unavailability/page.tsx",
  "app/shift-details/page.tsx",
]

test("operational workbench pages share the same page header and main rhythm", () => {
  for (const page of listPages) {
    const source = read(page)

    assert.match(source, /WorkbenchPageHeader/, `${page} uses shared header`)
    assert.match(source, /@container\/main/, `${page} keeps shadcn container rhythm`)
    assert.match(source, /md:gap-6/, `${page} keeps dashboard-01 section spacing`)
    assert.match(source, /xl:grid-cols-4/, `${page} keeps responsive metric card grid`)
    assert.doesNotMatch(source, /<h1 className="text-lg font-semibold"/, `${page} avoids duplicate page h1`)
  }
})

test("shared metric card follows dashboard-01 card composition", () => {
  const source = read("components/metric-card.tsx")

  assert.match(source, /CardAction/)
  assert.match(source, /CardFooter/)
  assert.match(source, /@container\/card/)
  assert.match(source, /bg-gradient-to-t/)
  assert.match(source, /min-h-\[172px\]/)
  assert.match(source, /text-4xl/)
  assert.match(source, /text-5xl/)
  assert.match(source, /mt-auto/)
  assert.match(source, /shadow-md/)
  assert.match(source, /shadow-black\/5/)
})

test("operational tables keep one column-control surface", () => {
  const shell = read("components/main-table-shell.tsx")
  const unavailability = read("components/unavailability-table.tsx")

  assert.match(shell, /CardAction>\{columnVisibilityControl\}<\/CardAction>/)
  assert.doesNotMatch(unavailability, /columnVisibilityControl/)
})

test("normal workbench pages do not expose implementation-source copy", () => {
  for (const page of listPages) {
    const source = read(page)

    assert.doesNotMatch(source, /后端 API|数据来自后端|API 请求失败/)
    assert.doesNotMatch(source, /Gate|Harness|Codex|Qoder/)
  }
})
