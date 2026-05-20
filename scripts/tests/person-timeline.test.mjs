import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackPersonTimelines,
  filterPersonTimelines,
  getFulfillmentCalendar,
  getFulfillmentGroup,
  getFulfillmentMatrix,
  getFulfillmentTeam,
  getPersonTimeline,
  getPersonTimelineAvailableDates,
  getPersonTimelineDailyView,
  getPersonTimelineWeekView,
  getTimelineEventPosition,
  summarizePersonTimelines,
} from "../../lib/person-timeline.ts";

test("person timeline summary counts local coverage", () => {
  const summary = summarizePersonTimelines(fallbackPersonTimelines);

  assert.equal(summary.totalPeople, 5);
  assert.equal(summary.peopleWithAnomalies, 3);
  assert.equal(summary.totalEvents, 28);
  assert.equal(summary.scheduledHours, 63);
  assert.equal(summary.loginHours, 58.45);
  assert.equal(summary.statusHours, 58.92);
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

test("person timeline week view exposes seven days and weekly totals", () => {
  const row = getPersonTimeline("A-1001");
  assert.ok(row);

  const weekView = getPersonTimelineWeekView(row, "2026-05-11");

  assert.equal(weekView.employee.employeeId, "A-1001");
  assert.equal(weekView.weekStart, "2026-05-11");
  assert.equal(weekView.weekEnd, "2026-05-17");
  assert.equal(weekView.selectedDate, "2026-05-11");
  assert.equal(weekView.days.length, 7);
  assert.deepEqual(
    weekView.days.map((day) => ({
      date: day.date,
      scheduledHours: day.scheduledHours,
      loginHours: day.loginHours,
      gapHours: day.gapHours,
      anomalyCount: day.anomalyCount,
    })),
    [
      { date: "2026-05-11", scheduledHours: 8, loginHours: 7.5, gapHours: 0.5, anomalyCount: 1 },
      { date: "2026-05-12", scheduledHours: 8, loginHours: 8, gapHours: 0, anomalyCount: 0 },
      { date: "2026-05-13", scheduledHours: 0, loginHours: 0, gapHours: 0, anomalyCount: 0 },
      { date: "2026-05-14", scheduledHours: 0, loginHours: 0, gapHours: 0, anomalyCount: 0 },
      { date: "2026-05-15", scheduledHours: 0, loginHours: 0, gapHours: 0, anomalyCount: 0 },
      { date: "2026-05-16", scheduledHours: 0, loginHours: 0, gapHours: 0, anomalyCount: 0 },
      { date: "2026-05-17", scheduledHours: 0, loginHours: 0, gapHours: 0, anomalyCount: 0 },
    ]
  );
  assert.deepEqual(weekView.summary, {
    scheduledDays: 2,
    loginDays: 2,
    scheduledHours: 16,
    loginHours: 15.5,
    gapHours: 0.5,
    anomalyCount: 1,
  });
});

test("timeline event positioning maps time ranges to horizontal percentages", () => {
  const row = getPersonTimeline("A-1001");
  assert.ok(row);

  const position = getTimelineEventPosition(row.tracks.schedule[0]);
  assert.equal(Number(position.leftPercent.toFixed(2)), 8.33);
  assert.equal(Number(position.widthPercent.toFixed(2)), 25);
});

test("fulfillment calendar aggregates team week metrics", () => {
  const calendar = getFulfillmentCalendar(fallbackPersonTimelines);

  assert.equal(calendar.weekDays.length, 7);
  assert.equal(calendar.summary.plannedPeople, 8);
  assert.equal(calendar.summary.loginPeople, 8);

  const shanghaiTeam = calendar.teams.find(
    (team) => team.workplace === "上海职场" && team.project === "博西客服"
  );
  assert.ok(shanghaiTeam);
  assert.equal(shanghaiTeam.groups.length, 2);

  const firstDay = shanghaiTeam.days.find((day) => day.date === "2026-05-11");
  assert.deepEqual(
    {
      plannedPeople: firstDay?.plannedPeople,
      loginPeople: firstDay?.loginPeople,
      gapPeople: firstDay?.gapPeople,
      anomalyPeople: firstDay?.anomalyPeople,
    },
    {
      plannedPeople: 3,
      loginPeople: 3,
      gapPeople: 2,
      anomalyPeople: 2,
    }
  );
});

test("fulfillment group view sorts groups by business risk", () => {
  const calendar = getFulfillmentCalendar(fallbackPersonTimelines);
  const team = calendar.teams.find((item) => item.workplace === "上海职场");
  assert.ok(team);

  const selectedTeam = getFulfillmentTeam(team.id, fallbackPersonTimelines);
  assert.ok(selectedTeam);
  assert.equal(selectedTeam.groups[0].supplier, "供应商 A");

  const group = getFulfillmentGroup(team.id, selectedTeam.groups[0].id, fallbackPersonTimelines);
  assert.ok(group);
  assert.equal(group.members.length, 2);
});

test("fulfillment matrix exposes member daily three-track rows", () => {
  const calendar = getFulfillmentCalendar(fallbackPersonTimelines);
  const team = calendar.teams.find((item) => item.workplace === "上海职场");
  assert.ok(team);
  const group = team.groups.find((item) => item.supplier === "供应商 A");
  assert.ok(group);

  const matrix = getFulfillmentMatrix(team.id, group.id, "2026-05-11", fallbackPersonTimelines);

  assert.ok(matrix);
  assert.equal(matrix.members.length, 2);
  assert.equal(matrix.summary.plannedPeople, 2);
  assert.equal(matrix.summary.loginPeople, 2);
  assert.equal(matrix.summary.gapPeople, 2);
  assert.equal(matrix.summary.anomalyPeople, 2);
  assert.equal(matrix.members[0].tracks.schedule.length > 0, true);
  assert.equal(matrix.members[0].tracks.login.length > 0, true);
  assert.equal(matrix.members[0].tracks.status.length > 0, true);
});
