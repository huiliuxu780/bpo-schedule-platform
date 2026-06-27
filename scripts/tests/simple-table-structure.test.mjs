import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import test from "node:test"

function read(path) {
  return readFileSync(path, "utf8")
}

const simpleTablePath = "components/simple-table.tsx"
const demandPlanTablePath = "components/demand-plan-table.tsx"
const schedulePlanIntervalTablePath = "components/schedule-plan-interval-table.tsx"
const scheduleRiskShiftTablePath = "components/schedule-risk-shift-table.tsx"
const scheduleRiskUnavailabilityTablePath =
  "components/schedule-risk-unavailability-table.tsx"
const unavailabilityImpactShiftTablePath =
  "components/unavailability-impact-shift-table.tsx"
const unavailabilityImpactRiskTablePath =
  "components/unavailability-impact-risk-table.tsx"
const shiftDetailsTablePath = "components/shift-details-table.tsx"

test("SimpleTable component exists and owns light table rendering", () => {
  assert.equal(existsSync(simpleTablePath), true, `${simpleTablePath} should exist`)

  const source = read(simpleTablePath)
  assert.match(source, /export function SimpleTable/)
  assert.match(source, /type SimpleTableProps/)
  assert.match(source, /useReactTable/)
  assert.match(source, /flexRender/)
  assert.match(source, /getCoreRowModel/)
  assert.match(source, /getSortedRowModel/)
  assert.match(source, /defaultSorting/)
  assert.match(source, /emptyMessage/)
  assert.match(source, /<Table\b/)
  assert.match(source, /<TableHeader\b/)
  assert.match(source, /<TableBody\b/)
})

test("DemandPlanTable delegates rendering to SimpleTable", () => {
  const source = read(demandPlanTablePath)

  assert.match(
    source,
    /import \{ SimpleTable \} from "@\/components\/simple-table"/,
    "DemandPlanTable should import SimpleTable"
  )
  assert.match(source, /<SimpleTable/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{rows\}/)
  assert.match(source, /emptyMessage="暂无符合条件的预测需求"/)
  assert.match(source, /defaultSorting=\{\[\{ id: "plan_date", desc: false \}\]\}/)

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})

test("DemandPlanTable stays focused after extraction", () => {
  const lineCount = read(demandPlanTablePath).trimEnd().split("\n").length

  assert.ok(
    lineCount <= 150,
    `DemandPlanTable should stay at or below 150 lines after SimpleTable extraction, got ${lineCount}`
  )
})

test("SchedulePlanIntervalTable delegates rendering to SimpleTable", () => {
  const source = read(schedulePlanIntervalTablePath)

  assert.match(
    source,
    /import \{ SimpleTable \} from "@\/components\/simple-table"/,
    "SchedulePlanIntervalTable should import SimpleTable"
  )
  assert.match(source, /<SimpleTable/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{intervals\}/)
  assert.match(source, /emptyMessage="当前计划暂无时段明细"/)
  assert.match(
    source,
    /defaultSorting=\{\[\{ id: "interval_start", desc: false \}\]\}/
  )

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})

test("ScheduleRiskShiftTable delegates rendering to SimpleTable", () => {
  const source = read(scheduleRiskShiftTablePath)

  assert.match(
    source,
    /import \{ SimpleTable \} from "@\/components\/simple-table"/,
    "ScheduleRiskShiftTable should import SimpleTable"
  )
  assert.match(source, /<SimpleTable/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{rows\}/)
  assert.match(source, /emptyMessage="暂无匹配的班次明细"/)
  assert.match(source, /defaultSorting=\{\[\{ id: "plan_id", desc: false \}\]\}/)

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})

test("ScheduleRiskUnavailabilityTable delegates rendering to SimpleTable", () => {
  const source = read(scheduleRiskUnavailabilityTablePath)

  assert.match(
    source,
    /import \{ SimpleTable \} from "@\/components\/simple-table"/,
    "ScheduleRiskUnavailabilityTable should import SimpleTable"
  )
  assert.match(source, /<SimpleTable/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{rows\}/)
  assert.match(
    source,
    /emptyMessage="当前风险时段暂无重叠的生效中不可用记录"/
  )
  assert.match(
    source,
    /defaultSorting=\{\[\{ id: "staff_name", desc: false \}\]\}/
  )

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})

test("UnavailabilityImpactShiftTable delegates rendering to SimpleTable", () => {
  const source = read(unavailabilityImpactShiftTablePath)

  assert.match(
    source,
    /import \{ SimpleTable \} from "@\/components\/simple-table"/,
    "UnavailabilityImpactShiftTable should import SimpleTable"
  )
  assert.match(source, /<SimpleTable/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{rows\}/)
  assert.match(source, /emptyMessage="当前不可用时段暂无匹配班次"/)
  assert.match(source, /defaultSorting=\{\[\{ id: "plan_id", desc: false \}\]\}/)

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})

test("UnavailabilityImpactRiskTable delegates rendering to SimpleTable", () => {
  const source = read(unavailabilityImpactRiskTablePath)

  assert.match(
    source,
    /import \{ SimpleTable \} from "@\/components\/simple-table"/,
    "UnavailabilityImpactRiskTable should import SimpleTable"
  )
  assert.match(source, /<SimpleTable/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{rows\}/)
  assert.match(source, /emptyMessage="当前不可用时段暂无关联风险提示"/)
  assert.match(
    source,
    /defaultSorting=\{\[\{ id: "risk_level", desc: false \}\]\}/
  )

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})

test("ShiftDetailsTable delegates rendering to SimpleTable", () => {
  const source = read(shiftDetailsTablePath)

  assert.match(
    source,
    /import \{ SimpleTable \} from "@\/components\/simple-table"/,
    "ShiftDetailsTable should import SimpleTable"
  )
  assert.match(source, /<SimpleTable/)
  assert.match(source, /columns=\{columns\}/)
  assert.match(source, /data=\{rows\}/)
  assert.match(source, /emptyMessage = "暂无符合条件的班次明细"/)
  assert.match(source, /emptyMessage=\{emptyMessage\}/)
  assert.match(source, /defaultSorting=\{\[\{ id: "plan_date", desc: false \}\]\}/)

  assert.doesNotMatch(source, /useReactTable/)
  assert.doesNotMatch(source, /flexRender/)
  assert.doesNotMatch(source, /getCoreRowModel/)
  assert.doesNotMatch(source, /getSortedRowModel/)
  assert.doesNotMatch(source, /type SortingState/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /<TableHeader\b/)
  assert.doesNotMatch(source, /<TableBody\b/)
})
