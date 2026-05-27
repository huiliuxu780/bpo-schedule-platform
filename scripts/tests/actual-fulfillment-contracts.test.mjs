import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  fallbackActualFulfillmentRecords,
  filterScheduleActualAnomalies,
  getActualFulfillmentRecords,
  summarizeActualFulfillmentRecords,
} from "../../lib/actual-fulfillment-contracts.ts";

test("actual fulfillment fallback summarizes intervals quality issues and anomalies", () => {
  const summary = summarizeActualFulfillmentRecords(fallbackActualFulfillmentRecords);

  assert.equal(summary.intervalCount, 3);
  assert.equal(summary.qualityIssueCount, 2);
  assert.equal(summary.anomalyCount, 4);
  assert.equal(summary.highSeverityCount, 2);
  assert.equal(summary.totalImpactMinutes, 110);
  assert.deepEqual(summary.anomalyTypes, [
    "late_login",
    "non_productive_status",
    "status_gap",
    "unscheduled_login",
  ]);
  assert.equal(summary.primaryMessage, "登录时间晚于排班开始");
});

test("actual fulfillment model fetches backend contracts before fallback", async () => {
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).includes("/api/v1/actual-logs/intervals")) {
      return Response.json({
        items: [
          {
            interval_id: "AL-A-1002-2026-05-11-0900-0930",
            employee_id: "A-1002",
            business_date: "2026-05-11",
            workplace_id: "上海职场",
            project_id: "博西客服",
            interval_start: "09:00",
            interval_end: "09:30",
            login_minutes: 9,
            status_minutes: 9,
            productive_minutes: 9,
            status_types: ["available"],
            login_log_ids: ["LOG-1"],
            status_log_ids: ["STA-1"],
            trace_status: "ready",
          },
        ],
      });
    }
    if (String(url).includes("/api/v1/actual-logs/quality-issues")) {
      return Response.json({ items: [] });
    }
    if (String(url).includes("/api/v1/schedule-actual/anomalies")) {
      return Response.json({
        items: [
          {
            anomaly_id: "SA-late_login-A-1002-2026-05-11-0900",
            anomaly_type: "late_login",
            employee_id: "A-1002",
            business_date: "2026-05-11",
            workplace_id: "上海职场",
            project_id: "博西客服",
            schedule_detail_id: "SCH-1",
            login_log_id: "LOG-1",
            status_log_ids: [],
            interval_start: "09:00",
            interval_end: "09:21",
            impact_minutes: 21,
            severity: "medium",
            source_record_ids: ["SCH-1", "LOG-1"],
            message: "登录时间晚于排班开始",
          },
        ],
      });
    }
    return Response.json({ items: [] }, { status: 404 });
  };

  try {
    const records = await getActualFulfillmentRecords();
    const summary = summarizeActualFulfillmentRecords(records);

    assert.equal(records.intervals[0].intervalId, "AL-A-1002-2026-05-11-0900-0930");
    assert.equal(summary.intervalCount, 1);
    assert.equal(summary.anomalyCount, 1);
    assert.equal(calls.length, 3);
    assert.ok(calls.some((url) => url.endsWith("/api/v1/actual-logs/intervals")));
    assert.ok(calls.some((url) => url.endsWith("/api/v1/actual-logs/quality-issues")));
    assert.ok(calls.some((url) => url.endsWith("/api/v1/schedule-actual/anomalies")));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("actual fulfillment anomalies can be filtered by employee date and severity", () => {
  const rows = filterScheduleActualAnomalies(fallbackActualFulfillmentRecords.anomalies, {
    employeeId: "A-1002",
    businessDate: "2026-05-11",
    severity: "medium",
  });

  assert.deepEqual(
    rows.map((row) => row.anomalyType),
    ["late_login", "non_productive_status"]
  );
});

test("person timeline page surfaces actual fulfillment records in the exception panel", () => {
  const pageSource = readFileSync(new URL("../../app/person-timeline/page.tsx", import.meta.url), "utf8");

  assert.ok(pageSource.includes("getActualFulfillmentRecords"));
  assert.ok(pageSource.includes("ActualFulfillmentPanel"));
  assert.ok(pageSource.includes("实际履约切片"));
  assert.ok(pageSource.includes("排班对比异常"));
  assert.ok(pageSource.includes("来源记录"));
});
