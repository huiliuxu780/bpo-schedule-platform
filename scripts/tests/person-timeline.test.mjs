import assert from "node:assert/strict";
import test from "node:test";

import {
  fallbackPersonTimelines,
  filterPersonTimelines,
  getFulfillmentCalendar,
  getFulfillmentGroup,
  getFulfillmentGroupMemberWeekMatrix,
  getFulfillmentMatrix,
  getFulfillmentMatrixExceptionQueueCursor,
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
  assert.deepEqual(dailyView.exceptionExplanations, [
    {
      id: "EXP-A-1001-2026-05-11-no_login",
      anomalyCode: "no_login",
      type: "状态不一致",
      title: "午后状态缺登录切片",
      date: "2026-05-11",
      start: "13:00",
      end: "18:00",
      involvedTracks: ["schedule", "login", "status"],
      impactHours: 5,
      evidence: "该时段有排班和登录记录，但状态轨道为培训，需确认是否符合当班在线要求。",
      supervisorAction: "先确认培训安排是否已登记；若未登记，联系员工恢复在线或补充原因。",
      priority: "medium",
    },
  ]);
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
  assert.deepEqual(selectedTeam.riskSummary, {
    highestRiskGroup: "供应商 A",
    highestRiskDate: "2026-05-11",
    highestRiskMember: "A-1002 王敏",
    gapPeople: 3,
    anomalyPeople: 2,
  });

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
  const liuChen = matrix.members.find((member) => member.employeeId === "A-1001");
  assert.ok(liuChen);
  assert.deepEqual(
    liuChen.exceptionExplanations.map((explanation) => ({
      anomalyCode: explanation.anomalyCode,
      type: explanation.type,
      start: explanation.start,
      end: explanation.end,
      impactHours: explanation.impactHours,
      priority: explanation.priority,
    })),
    [
      {
        anomalyCode: "no_login",
        type: "状态不一致",
        start: "13:00",
        end: "18:00",
        impactHours: 5,
        priority: "medium",
      },
    ]
  );
  assert.deepEqual(
    matrix.exceptionQueue.map((item) => ({
      key: item.key,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      title: item.title,
      priority: item.priority,
      impactHours: item.impactHours,
      start: item.start,
      end: item.end,
      detailDate: item.detailDate,
    })),
    [
      {
        key: "A-1002::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        priority: "high",
        impactHours: 0.35,
        start: "09:00",
        end: "09:21",
        detailDate: "2026-05-11",
      },
      {
        key: "A-1001::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        priority: "medium",
        impactHours: 5,
        start: "13:00",
        end: "18:00",
        detailDate: "2026-05-11",
      },
    ]
  );
  assert.deepEqual(matrix.exceptionQueueSummary, {
    totalCount: 2,
    highPriorityCount: 1,
    loginGapCount: 1,
    statusMismatchCount: 1,
    totalImpactHours: 5.35,
  });
  const lateLogin = matrix.exceptionQueue.find((item) => item.key === "A-1002::late_login");
  assert.ok(lateLogin);
  assert.deepEqual(lateLogin.focusEventIds, ["SCH-1002-1", "LOG-1002-1"]);
  assert.deepEqual(
    lateLogin.evidenceCards.map((card) => ({
      track: card.track,
      eventId: card.eventId,
      label: card.label,
      start: card.start,
      end: card.end,
    })),
    [
      { track: "schedule", eventId: "SCH-1002-1", label: "早班", start: "09:00", end: "17:00" },
      { track: "login", eventId: "LOG-1002-1", label: "CORN 登录", start: "09:21", end: "17:00" },
    ]
  );
  const statusMismatch = matrix.exceptionQueue.find((item) => item.key === "A-1001::no_login");
  assert.ok(statusMismatch);
  assert.deepEqual(statusMismatch.focusEventIds, ["SCH-1001-2", "LOG-1001-1", "STA-1001-2"]);
  assert.deepEqual(
    statusMismatch.evidenceCards.map((card) => ({
      track: card.track,
      eventId: card.eventId,
      label: card.label,
    })),
    [
      { track: "schedule", eventId: "SCH-1001-2", label: "午后班" },
      { track: "login", eventId: "LOG-1001-1", label: "CORN 登录" },
      { track: "status", eventId: "STA-1001-2", label: "培训" },
    ]
  );
});

test("fulfillment group member week matrix exposes member day cells", () => {
  const calendar = getFulfillmentCalendar(fallbackPersonTimelines);
  const team = calendar.teams.find((item) => item.workplace === "上海职场");
  assert.ok(team);
  const group = team.groups.find((item) => item.supplier === "供应商 A");
  assert.ok(group);

  const weekMatrix = getFulfillmentGroupMemberWeekMatrix(
    team.id,
    group.id,
    fallbackPersonTimelines
  );

  assert.ok(weekMatrix);
  assert.equal(weekMatrix.team.id, team.id);
  assert.equal(weekMatrix.group.id, group.id);
  assert.equal(weekMatrix.weekStart, "2026-05-11");
  assert.equal(weekMatrix.weekEnd, "2026-05-17");
  assert.deepEqual(weekMatrix.summary, {
    memberCount: 2,
    scheduledDays: 4,
    loginDays: 4,
    gapHours: 1.0499999999999998,
    anomalyCount: 2,
  });
  assert.deepEqual(weekMatrix.riskSummary, {
    riskMemberCount: 2,
    highestGapMember: "A-1002 王敏",
    highestAnomalyMember: "A-1001 刘晨",
    highestGapDate: "2026-05-11",
  });
  assert.deepEqual(
    weekMatrix.watchlist.map((item) => ({
      key: item.key,
      employeeId: item.employeeId,
      date: item.date,
      title: item.title,
      reason: item.reason,
      priority: item.priority,
    })),
    [
      {
        key: "A-1002::2026-05-11",
        employeeId: "A-1002",
        date: "2026-05-11",
        title: "王敏 周一",
        reason: "缺口 0.5h / 异常 1",
        priority: "high",
      },
      {
        key: "A-1001::2026-05-11",
        employeeId: "A-1001",
        date: "2026-05-11",
        title: "刘晨 周一",
        reason: "缺口 0.5h / 异常 1",
        priority: "high",
      },
      {
        key: "A-1002::2026-05-12",
        employeeId: "A-1002",
        date: "2026-05-12",
        title: "王敏 周二",
        reason: "缺口 0.1h / 异常 0",
        priority: "medium",
      },
    ]
  );
  assert.equal(weekMatrix.members.length, 2);
  assert.deepEqual(
    weekMatrix.members.map((item) => item.employeeId),
    ["A-1002", "A-1001"]
  );
  const member = weekMatrix.members.find((item) => item.employeeId === "A-1001");
  assert.ok(member);
  assert.equal(member.days.length, 7);
  assert.deepEqual(
    {
      date: member.days[0].date,
      label: member.days[0].label,
      weekday: member.days[0].weekday,
      scheduledHours: member.days[0].scheduledHours,
      loginHours: member.days[0].loginHours,
      gapHours: member.days[0].gapHours,
      anomalyCount: member.days[0].anomalyCount,
    },
    {
    date: "2026-05-11",
    label: "05/11",
    weekday: "周一",
    scheduledHours: 8,
    loginHours: 7.5,
    gapHours: 0.5,
    anomalyCount: 1,
    }
  );
  assert.deepEqual(member.summary, {
    scheduledDays: 2,
    loginDays: 2,
    scheduledHours: 16,
    loginHours: 15.5,
    gapHours: 0.5,
    anomalyCount: 1,
  });
});

test("fulfillment matrix exception queue cursor exposes supervisor review position", () => {
  const calendar = getFulfillmentCalendar(fallbackPersonTimelines);
  const team = calendar.teams.find((item) => item.workplace === "上海职场");
  assert.ok(team);
  const group = team.groups.find((item) => item.supplier === "供应商 A");
  assert.ok(group);

  const matrix = getFulfillmentMatrix(team.id, group.id, "2026-05-11", fallbackPersonTimelines);
  assert.ok(matrix);

  const defaultCursor = getFulfillmentMatrixExceptionQueueCursor(matrix.exceptionQueue);
  assert.equal(defaultCursor.selected?.key, "A-1002::late_login");
  assert.equal(defaultCursor.selectedIndex, 1);
  assert.equal(defaultCursor.totalCount, 2);
  assert.equal(defaultCursor.previous, undefined);
  assert.equal(defaultCursor.next?.key, "A-1001::no_login");

  const secondCursor = getFulfillmentMatrixExceptionQueueCursor(
    matrix.exceptionQueue,
    "A-1001::no_login"
  );
  assert.equal(secondCursor.selected?.key, "A-1001::no_login");
  assert.equal(secondCursor.selectedIndex, 2);
  assert.equal(secondCursor.totalCount, 2);
  assert.equal(secondCursor.previous?.key, "A-1002::late_login");
  assert.equal(secondCursor.next, undefined);

  const emptyCursor = getFulfillmentMatrixExceptionQueueCursor([], "missing");
  assert.equal(emptyCursor.selected, undefined);
  assert.equal(emptyCursor.selectedIndex, 0);
  assert.equal(emptyCursor.totalCount, 0);
  assert.equal(emptyCursor.previous, undefined);
  assert.equal(emptyCursor.next, undefined);
});
