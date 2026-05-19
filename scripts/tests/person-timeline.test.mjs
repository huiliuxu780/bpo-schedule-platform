import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackPersonTimelines,
  filterPersonTimelines,
  getPersonTimeline,
  summarizePersonTimelines,
} from "../../lib/person-timeline.ts";

test("person timeline summary counts local coverage", () => {
  const summary = summarizePersonTimelines(fallbackPersonTimelines);

  assert.equal(summary.totalPeople, 4);
  assert.equal(summary.peopleWithAnomalies, 3);
  assert.equal(summary.totalEvents, 16);
  assert.equal(summary.scheduledHours, 31);
  assert.equal(summary.loginHours, 27.5);
  assert.deepEqual(summary.deferredActions, [
    "无真实登录系统接入",
    "无状态源回写",
    "无复核提交",
    "无审批、导出或批量处理",
  ]);
});

test("person timeline filters by owner, anomaly, and query", () => {
  const rows = filterPersonTimelines(fallbackPersonTimelines, {
    owner: "现场主管",
    hasAnomaly: true,
    query: "迟到",
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].employeeId, "A-1002");
});

test("person timeline lookup exposes schedule login and status tracks", () => {
  const row = getPersonTimeline("A-1001");

  assert.equal(row?.tracks.schedule.length, 2);
  assert.equal(row?.tracks.login.length, 1);
  assert.equal(row?.tracks.status.length, 2);
  assert.equal(row?.anomalies[0].code, "no_login");
});
