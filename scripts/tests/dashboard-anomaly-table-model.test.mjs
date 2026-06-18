import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDashboardAnomalyEntryState,
  clampDashboardPageIndex,
  dashboardAnomalyMatchesQuery,
  filterDashboardAnomalies,
  getDashboardPaginationRange,
} from "../../components/data-table-model.ts";

const anomaly = {
  id: "ANM-202605-001",
  type: "实际有效在线不足",
  project: "Bosch CC",
  team: "华东一组",
  shiftTime: "05-11 12:00-14:00",
  headcount: 6,
  impactedHours: "18.0h",
  severity: "高",
  status: "待复核",
};

test("dashboard anomaly search matches all visible table fields", () => {
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "bosch"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "华东"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "待复核"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "12:00"), true);
  assert.equal(dashboardAnomalyMatchesQuery(anomaly, "missing"), false);
});

test("dashboard page index is clamped after filter or page-size changes", () => {
  assert.equal(clampDashboardPageIndex({ pageIndex: 3, pageSize: 5, rowCount: 6 }), 1);
  assert.equal(clampDashboardPageIndex({ pageIndex: -2, pageSize: 5, rowCount: 6 }), 0);
  assert.equal(clampDashboardPageIndex({ pageIndex: 4, pageSize: 10, rowCount: 0 }), 0);
});

test("dashboard anomaly filters combine query, severity, and status", () => {
  const rows = [
    anomaly,
    { ...anomaly, id: "ANM-2", severity: "中", status: "已确认", team: "华南二组" },
    { ...anomaly, id: "ANM-3", severity: "低", status: "已忽略", team: "西区支援组" },
  ];

  assert.deepEqual(
    filterDashboardAnomalies(rows, { query: "华", severity: "中", status: "已确认" }).map((row) => row.id),
    ["ANM-2"],
  );
  assert.deepEqual(
    filterDashboardAnomalies(rows, { query: "", severity: "all", status: "待复核" }).map((row) => row.id),
    ["ANM-202605-001"],
  );
});

test("dashboard anomaly entry stays blocked without a stable downstream target", () => {
  assert.deepEqual(buildDashboardAnomalyEntryState(anomaly), {
    kind: "blocked",
    label: "等待下游定位",
    detail: "当前异常还没有稳定的复核案例、对比运行或来源批次，不能从经营总览直接跳转。",
  });
});

test("dashboard anomaly entry links only when a stable downstream target exists", () => {
  assert.deepEqual(
    buildDashboardAnomalyEntryState({
      ...anomaly,
      downstreamEntry: {
        type: "review_case",
        id: "CASE-QUERY-001",
      },
    }),
    {
      kind: "link",
      label: "查看复核案例",
      href: "/data-quality/review-cases/CASE-QUERY-001",
    },
  );
});

test("dashboard pagination range reports visible row bounds", () => {
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 0, pageSize: 5, rowCount: 12 }), {
    from: 1,
    to: 5,
  });
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 2, pageSize: 5, rowCount: 12 }), {
    from: 11,
    to: 12,
  });
  assert.deepEqual(getDashboardPaginationRange({ pageIndex: 0, pageSize: 5, rowCount: 0 }), {
    from: 0,
    to: 0,
  });
});
