import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync, existsSync } from "node:fs"
import { resolve } from "node:path"

const root = resolve(import.meta.dirname, "..", "..")

function read(relativePath) {
  return readFileSync(resolve(root, relativePath), "utf8")
}

test("components/metric-card.tsx exists and exports MetricCard", () => {
  const path = resolve(root, "components/metric-card.tsx")
  assert.ok(existsSync(path), "components/metric-card.tsx should exist")
  const content = read("components/metric-card.tsx")
  assert.match(
    content,
    /export function MetricCard/,
    "metric-card.tsx should contain `export function MetricCard`",
  )
})

test("components/metric-card.tsx imports required pieces from @/components/ui/card", () => {
  const content = read("components/metric-card.tsx")
  const importMatch = content.match(
    /import\s*\{([\s\S]*?)\}\s*from\s*"@\/components\/ui\/card"/,
  )
  assert.ok(
    importMatch,
    "metric-card.tsx should import from @/components/ui/card",
  )

  const importBody = importMatch[1]
  for (const name of [
    "Card",
    "CardHeader",
    "CardDescription",
    "CardTitle",
    "CardFooter",
  ]) {
    assert.match(
      importBody,
      new RegExp(`\\b${name}\\b`),
      `metric-card.tsx should import ${name} from @/components/ui/card`,
    )
  }
})

const pagePaths = [
  "app/demand-plans/page.tsx",
  "app/schedule-plans/page.tsx",
  "app/shift-details/page.tsx",
  "app/unavailability/page.tsx",
  "app/unavailability/[unavailabilityId]/page.tsx",
  "app/schedule-risks/[riskId]/page.tsx",
]

for (const pagePath of pagePaths) {
  test(`${pagePath} imports MetricCard from @/components/metric-card`, () => {
    const content = read(pagePath)
    assert.match(
      content,
      /import\s*\{\s*MetricCard\s*\}\s*from\s*"@\/components\/metric-card"/,
      `${pagePath} should import { MetricCard } from "@/components/metric-card"`,
    )
  })

  test(`${pagePath} does not declare a local MetricCard or SummaryCard function`, () => {
    const content = read(pagePath)
    assert.doesNotMatch(
      content,
      /function\s+MetricCard\b/,
      `${pagePath} should not declare a local MetricCard function`,
    )
    assert.doesNotMatch(
      content,
      /function\s+SummaryCard\b/,
      `${pagePath} should not declare a local SummaryCard function`,
    )
  })
}

test("app/schedule-plans/page.tsx does not contain <SummaryCard usage", () => {
  const content = read("app/schedule-plans/page.tsx")
  assert.doesNotMatch(
    content,
    /<SummaryCard/,
    "schedule-plans/page.tsx should not contain `<SummaryCard` usage",
  )
})
