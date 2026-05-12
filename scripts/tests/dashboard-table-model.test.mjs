import assert from "node:assert/strict";
import test from "node:test";

import {
  clampDashboardPageIndex,
  dashboardAnomalyMatchesQuery,
  filterDashboardAnomalies,
  filterSyncStatusRows,
  getDashboardPaginationRange,
  summarizeHeatmapRows,
  summarizeSyncStatusRows,
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

test("sync status helpers filter rows and summarize state counts", () => {
  const rows = [
    { source: "CORN 登录数据", batch: "A", status: "已同步", syncedAt: "今日 08:36" },
    { source: "CORN 状态日志", batch: "B", status: "处理中", syncedAt: "今日 09:04" },
    { source: "预测需求数据", batch: "C", status: "需关注", syncedAt: "昨日 18:42" },
  ];

  assert.deepEqual(filterSyncStatusRows(rows, "需关注").map((row) => row.source), ["预测需求数据"]);
  assert.deepEqual(summarizeSyncStatusRows(rows), {
    total: 3,
    synced: 1,
    processing: 1,
    attention: 1,
  });
});

test("heatmap summary reports total deficit, severe slots, and peak shortage", () => {
  const summary = summarizeHeatmapRows([
    { day: "周一", slots: [-1, -6, 0] },
    { day: "周二", slots: [-3, -8, 1] },
  ], ["09:00", "10:00", "11:00"]);

  assert.deepEqual(summary, {
    totalDeficit: 18,
    severeSlotCount: 2,
    normalSlotCount: 2,
    peak: {
      day: "周二",
      slot: "10:00",
      value: -8,
    },
  });
});
