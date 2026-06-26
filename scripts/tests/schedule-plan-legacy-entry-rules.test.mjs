import assert from "node:assert/strict"
import { access, readFile } from "node:fs/promises"
import { test } from "node:test"

const schedulePlansPagePath = new URL(
  "../../app/schedule-plans/page.tsx",
  import.meta.url
)
const schedulePlanDetailPagePath = new URL(
  "../../app/schedule-plans/[planId]/page.tsx",
  import.meta.url
)
const mvpFlowSummaryPath = new URL(
  "../../components/mvp-flow-summary.tsx",
  import.meta.url
)
const scheduleRiskTablePath = new URL(
  "../../components/schedule-risk-table.tsx",
  import.meta.url
)

test("schedule plan list does not link into legacy planning demo routes", async () => {
  const source = await readFile(schedulePlansPagePath, "utf8")

  assert.equal(source.includes("MvpFlowSummary"), false)
  assert.equal(source.includes("ScheduleRiskTable"), false)
  assert.equal(source.includes("getScheduleRisks"), false)
  assert.equal(source.includes('href="/schedule-risks'), false)
  assert.equal(source.includes('href="/shift-details'), false)
  assert.equal(source.includes('href="/unavailability'), false)
})

test("schedule plan detail keeps detail content local to the plan page", async () => {
  const source = await readFile(schedulePlanDetailPagePath, "utf8")

  assert.equal(source.includes("summarizeSchedulePlanFulfillmentIssues"), true)
  assert.equal(source.includes("MvpFlowSummary"), false)
  assert.equal(source.includes("ScheduleRiskTable"), false)
  assert.equal(source.includes("复核链路"), false)
  assert.equal(source.includes('href="/schedule-risks'), false)
  assert.equal(source.includes('href="/shift-details'), false)
  assert.equal(source.includes('href="/unavailability'), false)
})

test("orphaned legacy planning link components are removed while schedule risk table remains valid", async () => {
  await assert.rejects(access(mvpFlowSummaryPath))
  await assert.doesNotReject(access(scheduleRiskTablePath))
})
