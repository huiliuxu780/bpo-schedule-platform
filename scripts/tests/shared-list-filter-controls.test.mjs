import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

function read(path) {
  return readFileSync(path, "utf8")
}

const searchInputPath = "components/search-input-bar.tsx"
const statusFilterPath = "components/status-filter-pills.tsx"

const listPages = [
  "app/demand-plans/page.tsx",
  "app/schedule-plans/page.tsx",
  "app/shift-details/page.tsx",
  "app/unavailability/page.tsx",
]

const statusPages = [
  "app/schedule-plans/page.tsx",
  "app/shift-details/page.tsx",
  "app/unavailability/page.tsx",
]

test("SearchInputBar component exists and owns the search input UI", () => {
  assert.equal(existsSync(searchInputPath), true, `${searchInputPath} should exist`)

  const source = read(searchInputPath)
  assert.match(source, /export function SearchInputBar/)
  assert.match(source, /name="query"/)
  assert.match(source, /<Search\b/)
  assert.match(source, /<Input\b/)
  assert.match(source, /hiddenFields/)
  assert.match(source, /children/)
})

test("StatusFilterPills component exists and owns status option rendering", () => {
  assert.equal(existsSync(statusFilterPath), true, `${statusFilterPath} should exist`)

  const source = read(statusFilterPath)
  assert.match(source, /export function StatusFilterPills/)
  assert.match(source, /options\.map/)
  assert.match(source, /buildHref/)
  assert.match(source, /activeValue/)
  assert.match(source, /<Button\b/)
  assert.match(source, /<Link\b/)
})

for (const pagePath of listPages) {
  test(`${pagePath} uses SearchInputBar and no longer owns raw search JSX`, () => {
    const source = read(pagePath)
    assert.match(
      source,
      /import \{ SearchInputBar \} from "@\/components\/search-input-bar"/,
      `${pagePath} should import SearchInputBar`
    )
    assert.doesNotMatch(source, /import \{ Search \} from "lucide-react"/)
    assert.doesNotMatch(source, /from "@\/components\/ui\/input"/)
    assert.doesNotMatch(source, /<Search\b/)
    assert.doesNotMatch(source, /<Input\b/)
    assert.doesNotMatch(source, /name="query"/)
  })
}

for (const pagePath of statusPages) {
  test(`${pagePath} uses StatusFilterPills for status options`, () => {
    const source = read(pagePath)
    assert.match(
      source,
      /import \{ StatusFilterPills \} from "@\/components\/status-filter-pills"/,
      `${pagePath} should import StatusFilterPills`
    )
    assert.doesNotMatch(source, /statusOptions\.map/)
  })
}

test("demand-plans uses only SearchInputBar without status pills", () => {
  const source = read("app/demand-plans/page.tsx")
  assert.doesNotMatch(source, /StatusFilterPills/)
})
