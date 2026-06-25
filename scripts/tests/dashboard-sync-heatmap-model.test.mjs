import assert from "node:assert/strict";
import test from "node:test";


import {
  filterSyncStatusRows,
  summarizeHeatmapRows,
  summarizeSyncStatusRows,
} from "../../components/data-table-model.ts";

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
