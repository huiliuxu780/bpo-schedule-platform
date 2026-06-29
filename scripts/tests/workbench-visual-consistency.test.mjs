import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

function read(path) {
  return readFileSync(path, "utf8")
}

test("shared metric card keeps dashboard-style shadow and responsive number treatment", () => {
  const source = read("components/metric-card.tsx")

  assert.match(source, /@container\/card/)
  assert.match(source, /bg-gradient-to-t/)
  assert.match(source, /from-primary\/5/)
  assert.match(source, /shadow-md/)
  assert.match(source, /shadow-black\/5/)
  assert.match(source, /hover:shadow-lg/)
  assert.match(source, /tabular-nums/)
  assert.match(source, /@\[250px\]\/card:text-5xl/)
})

test("shared search bar is a compact shadcn-style toolbar surface", () => {
  const source = read("components/search-input-bar.tsx")

  assert.match(source, /rounded-xl/)
  assert.match(source, /border bg-card/)
  assert.match(source, /shadow-xs/)
  assert.match(source, /min-w-\[min\(28rem,100%\)\]/)
  assert.doesNotMatch(source, /数据来源/)
  assert.doesNotMatch(source, /后端 API/)
})

test("main table shell owns the visual card, header action, toolbar, and muted table header", () => {
  const source = read("components/main-table-shell.tsx")

  assert.match(source, /CardAction/)
  assert.match(source, /data-slot="main-table-shell"/)
  assert.match(source, /shadow-md shadow-black\/5/)
  assert.match(source, /data-slot="main-table-shell-toolbar"/)
  assert.match(source, /bg-background/)
  assert.match(source, /shadow-xs/)
  assert.match(source, /<TableHeader className="bg-muted">/)
  assert.match(source, /<CardAction>\{columnVisibilityControl\}<\/CardAction>/)
})

test("status filter pills expose active navigation semantics only for selected links", () => {
  const source = read("components/status-filter-pills.tsx")

  assert.match(source, /aria-current=\{active \? "page" : undefined\}/)
  assert.match(source, /variant=\{active \? "default" : "outline"\}/)
  assert.doesNotMatch(source, /data-active=\{false\}/)
})

test("secondary workbench pages do not wrap table shells in another card", () => {
  const pages = [
    "app/demand-plans/page.tsx",
    "app/shift-details/page.tsx",
    "app/unavailability/page.tsx",
  ]

  for (const page of pages) {
    const source = read(page)

    assert.doesNotMatch(source, /from "@\/components\/ui\/card"/)
    assert.doesNotMatch(source, /<Card\b/)
  }
})

test("secondary workbench tables use the shared MainTableShell instead of ad hoc table cards", () => {
  const tables = [
    "components/demand-plan-table.tsx",
    "components/shift-details-table.tsx",
    "components/unavailability-table.tsx",
  ]

  for (const table of tables) {
    const source = read(table)

    assert.match(source, /MainTableShell/)
    assert.doesNotMatch(source, /SimpleTable/)
    assert.doesNotMatch(source, /variant="embedded"/)
  }
})
