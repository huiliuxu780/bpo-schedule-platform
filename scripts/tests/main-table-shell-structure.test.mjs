import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

function read(path) {
  return readFileSync(path, "utf8")
}

const boundarySpecPath = "docs/design/main-table-shell-boundary-spec.md"
const structureGuardPath = "docs/design/main-table-shell-structure-guard.md"
const mainTableShellPath = "components/main-table-shell.tsx"
const candidateTablePaths = [
  "components/schedule-plan-table.tsx",
  "components/unavailability-table.tsx",
  "components/data-table.tsx",
]

const allowedShellResponsibilities = [
  "toolbar layout slots",
  "column visibility menu",
  "summary strip slot",
  "shared table render loop",
  "empty row structure",
  "pagination controls",
]

const forbiddenShellResponsibilities = [
  "domain column definitions",
  "domain filter state names",
  "row actions",
  "route hrefs",
  "server query parameters",
  "business status meanings",
  "business copy",
]

test("MainTableShell boundary spec keeps the implementation order explicit", () => {
  const source = read(boundarySpecPath)

  assert.match(source, /IM205: add a docs\/test-only shell structure guard/)
  assert.match(source, /IM206: migrate `schedule-plan-table`/)
  assert.match(source, /IM207: migrate `unavailability-table`/)
  assert.match(source, /Defer `components\/data-table\.tsx`/)
})

test("MainTableShell structure guard document records allowed and forbidden ownership", () => {
  assert.equal(
    existsSync(structureGuardPath),
    true,
    `${structureGuardPath} should exist before MainTableShell implementation`
  )

  const source = read(structureGuardPath)

  for (const responsibility of allowedShellResponsibilities) {
    assert.match(
      source,
      new RegExp(responsibility.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `guard should list allowed shell responsibility: ${responsibility}`
    )
  }

  for (const responsibility of forbiddenShellResponsibilities) {
    assert.match(
      source,
      new RegExp(responsibility.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
      `guard should list forbidden shell responsibility: ${responsibility}`
    )
  }
})

test("IM205 does not introduce or wire a MainTableShell implementation", () => {
  assert.equal(
    existsSync(mainTableShellPath),
    false,
    `${mainTableShellPath} should not exist in the docs/test-only guard slice`
  )

  for (const tablePath of candidateTablePaths) {
    const source = read(tablePath)

    assert.doesNotMatch(
      source,
      /MainTableShell/,
      `${tablePath} should not import or render MainTableShell before its implementation slice`
    )
  }
})
