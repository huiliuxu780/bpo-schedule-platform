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
  "components/demand-plan-table.tsx",
  "components/schedule-plan-table.tsx",
  "components/shift-details-table.tsx",
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

test("MainTableShell component exists and owns main table structure", () => {
  assert.equal(
    existsSync(mainTableShellPath),
    true,
    `${mainTableShellPath} should exist for the first implementation slice`
  )

  const source = read(mainTableShellPath)

  assert.match(source, /export function MainTableShell/)
  assert.match(source, /type MainTableShellProps/)
  assert.match(source, /useReactTable/)
  assert.match(source, /flexRender/)
  assert.match(source, /getCoreRowModel/)
  assert.match(source, /getPaginationRowModel/)
  assert.match(source, /getSortedRowModel/)
  assert.match(source, /DropdownMenuCheckboxItem/)
  assert.match(source, /getAllLeafColumns/)
  assert.match(source, /getVisibleLeafColumns/)
  assert.match(source, /getDashboardPaginationRange/)
  assert.match(source, /clampDashboardPageIndex/)
})

test("SchedulePlanTable delegates main table structure to MainTableShell", () => {
  const source = read("components/schedule-plan-table.tsx")

  assert.match(
    source,
    /import \{ MainTableShell \} from "@\/components\/main-table-shell"/,
    "SchedulePlanTable should import MainTableShell"
  )
  assert.match(source, /<MainTableShell/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{filteredPlans\}/)
  assert.match(source, /columnLabels=\{columnLabels\}/)
  assert.match(source, /emptyMessage=\{emptyMessage\}/)
  assert.match(source, /暂无排班计划数据/)
  assert.match(source, /暂无符合条件的排班计划/)
  assert.match(source, /initialSorting=\{\[\{ id: "plan_date", desc: false \}\]\}/)

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getPaginationRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type PaginationState/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /type VisibilityState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})

test("DemandPlanTable delegates main table structure to MainTableShell", () => {
  const source = read("components/demand-plan-table.tsx")

  assert.match(
    source,
    /import \{ MainTableShell \} from "@\/components\/main-table-shell"/,
    "DemandPlanTable should import MainTableShell"
  )
  assert.match(source, /<MainTableShell/)
  assert.match(source, /title="预测需求"/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{rows\}/)
  assert.match(source, /columnLabels=\{columnLabels\}/)
  assert.match(source, /emptyMessage="暂无符合条件的预测需求"/)
  assert.match(source, /initialSorting=\{\[\{ id: "plan_date", desc: false \}\]\}/)

  assert.doesNotMatch(source, /SimpleTable/)
  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /<Table\b/)
})

test("ShiftDetailsTable delegates main table structure to MainTableShell", () => {
  const source = read("components/shift-details-table.tsx")

  assert.match(
    source,
    /import \{ MainTableShell \} from "@\/components\/main-table-shell"/,
    "ShiftDetailsTable should import MainTableShell"
  )
  assert.match(source, /<MainTableShell/)
  assert.match(source, /title="班次明细"/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{rows\}/)
  assert.match(source, /columnLabels=\{columnLabels\}/)
  assert.match(source, /emptyMessage = "暂无符合条件的班次明细"/)
  assert.match(source, /emptyMessage=\{emptyMessage\}/)
  assert.match(source, /initialSorting=\{\[\{ id: "plan_date", desc: false \}\]\}/)

  assert.doesNotMatch(source, /SimpleTable/)
  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /<Table\b/)
})

test("UnavailabilityTable delegates main table structure to MainTableShell", () => {
  const source = read("components/unavailability-table.tsx")

  assert.match(
    source,
    /import \{ MainTableShell \} from "@\/components\/main-table-shell"/,
    "UnavailabilityTable should import MainTableShell"
  )
  assert.match(source, /<MainTableShell/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{filteredRows\}/)
  assert.match(source, /columnLabels=\{columnLabels\}/)
  assert.match(source, /emptyMessage = "暂无符合条件的不可用记录"/)
  assert.match(source, /emptyMessage=\{emptyMessage\}/)
  assert.match(
    source,
    /initialSorting=\{\[\{ id: "unavailable_date", desc: false \}\]\}/
  )
  assert.doesNotMatch(source, /variant="embedded"/)
  assert.match(source, /columnVisibilityControl/)

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getPaginationRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type PaginationState/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /type VisibilityState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})

test("remaining candidates do not wire MainTableShell before their slices", () => {
  assert.equal(
    existsSync(mainTableShellPath),
    true,
    `${mainTableShellPath} should exist before remaining candidates migrate`
  )

  for (const tablePath of candidateTablePaths.filter(
    (path) =>
      ![
        "components/schedule-plan-table.tsx",
        "components/demand-plan-table.tsx",
        "components/shift-details-table.tsx",
        "components/unavailability-table.tsx",
      ].includes(path)
  )) {
    const source = read(tablePath)

    assert.doesNotMatch(
      source,
      /MainTableShell/,
      `${tablePath} should not import or render MainTableShell before its implementation slice`
    )
  }
})
