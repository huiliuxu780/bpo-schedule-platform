import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const sharedEmptyState = readFileSync("components/empty-state.tsx", "utf8")
const targetFiles = [
  "components/import-center-batch-list-panel.tsx",
  "components/import-center-batch-inspector-panel.tsx",
  "components/import-center-review-cases-workspace.tsx",
]

test("shared empty state component defines reusable structure", () => {
  assert.match(sharedEmptyState, /export function EmptyState/)
  assert.match(sharedEmptyState, /data-slot="empty-state"/)
  assert.match(sharedEmptyState, /data-slot="empty-state-icon"/)
  assert.match(sharedEmptyState, /data-slot="empty-state-title"/)
  assert.match(sharedEmptyState, /data-slot="empty-state-detail"/)
  assert.match(sharedEmptyState, /data-slot="empty-state-actions"/)
  assert.match(sharedEmptyState, /compact/)
  assert.match(sharedEmptyState, /children/)
  assert.doesNotMatch(sharedEmptyState, /from "@\/components\/ui\/button"/)
})

test("target panels use shared empty state instead of local copies", () => {
  for (const file of targetFiles) {
    const source = readFileSync(file, "utf8")

    assert.match(
      source,
      /from "@\/components\/empty-state"/,
      `${file} should import shared EmptyState`
    )
    assert.doesNotMatch(
      source,
      /function EmptyState\(/,
      `${file} should not define a local EmptyState`
    )
    assert.doesNotMatch(
      source,
      /CircleSlash/,
      `${file} should not own the empty-state icon`
    )
  }
})
