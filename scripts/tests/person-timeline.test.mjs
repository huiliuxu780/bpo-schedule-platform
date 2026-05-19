import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackPersonTimelines,
  filterPersonTimelines,
  getPersonTimeline,
  getPersonTimelineAvailableDates,
  getPersonTimelineDailyView,
  getTimelineEventPosition,
  summarizePersonTimelines,
} from "../../lib/person-timeline.ts";

test("person timeline summary counts local coverage", () => {
  const summary = summarizePersonTimelines(fallbackPersonTimelines);

  assert.equal(summary.totalPeople, 4);
  assert.equal(summary.peopleWithAnomalies, 3);
  assert.equal(summary.totalEvents, 22);
  assert.equal(summary.scheduledHours, 47);
  assert.equal(summary.loginHours, 43.45);
  assert.equal(summary.statusHours, 43.92);
  assert.equal("deferredActions" in summary, false);
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

  assert.equal(row?.tracks.schedule.length, 3);
  assert.equal(row?.tracks.login.length, 2);
  assert.equal(row?.tracks.status.length, 3);
  assert.equal(row?.anomalies[0].code, "no_login");
});

test("person timeline exposes calendar days and a daily three-track view", () => {
  const row = getPersonTimeline("A-1001");
  assert.ok(row);

  const days = getPersonTimelineAvailableDates(row);
  assert.deepEqual(days.map((day) => day.date), ["2026-05-11", "2026-05-12"]);
  assert.equal(days[0].anomalyCount, 1);

  const dailyView = getPersonTimelineDailyView(row, "2026-05-11");
  assert.equal(dailyView.date, "2026-05-11");
  assert.equal(dailyView.tracks.schedule.length, 2);
  assert.equal(dailyView.tracks.login.length, 1);
  assert.equal(dailyView.tracks.status.length, 2);
  assert.equal(dailyView.anomalies.length, 1);
});

test("timeline event positioning maps time ranges to horizontal percentages", () => {
  const row = getPersonTimeline("A-1001");
  assert.ok(row);

  const position = getTimelineEventPosition(row.tracks.schedule[0]);
  assert.equal(Number(position.leftPercent.toFixed(2)), 8.33);
  assert.equal(Number(position.widthPercent.toFixed(2)), 25);
});
