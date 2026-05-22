import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFulfillmentMatrixReturnHref,
  buildPersonFulfillmentDetailHref,
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
  assert.deepEqual(dailyView.reviewContexts, [
    {
      key: "A-1001::no_login",
      anomalyCode: "no_login",
      title: "午后状态缺登录切片",
      reviewGroup: {
        code: "supervisor_judgment",
        label: "待主管判断",
        reason: "需由现场主管确认培训安排是否符合当班在线要求。",
      },
      currentJudgment: "需补培训安排说明后再判断状态是否计入履约。",
      readyCount: 3,
      missingCount: 2,
      closureChecklist: {
        currentJudgment: "需补培训安排说明后再判断状态是否计入履约。",
        readyCount: 3,
        missingCount: 2,
        items: [
          {
            label: "排班记录",
            status: "已关联",
            ownerRole: "排班运营",
            judgmentImpact: "确认 13:00-18:00 排班覆盖。",
          },
          {
            label: "登录记录",
            status: "已关联",
            ownerRole: "数据管理员",
            judgmentImpact: "确认登录覆盖当日工作时段。",
          },
          {
            label: "状态记录",
            status: "已关联",
            ownerRole: "现场主管",
            judgmentImpact: "确认 13:00-18:00 状态为培训。",
          },
          {
            label: "培训安排说明",
            status: "需补充",
            ownerRole: "现场主管",
            judgmentImpact: "确认培训是否符合当班在线要求。",
          },
          {
            label: "主管判断",
            status: "待确认",
            ownerRole: "现场主管",
            judgmentImpact: "形成状态是否计入履约的判断。",
          },
        ],
      },
    },
  ]);
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
      reviewGroup: item.reviewGroup.label,
      impactHours: item.impactHours,
      start: item.start,
      end: item.end,
      detailDate: item.detailDate,
      sortReason: item.sortReason,
    })),
    [
      {
        key: "A-1002::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        priority: "high",
        reviewGroup: "需补材料",
        impactHours: 0.35,
        start: "09:00",
        end: "09:21",
        detailDate: "2026-05-11",
        sortReason: "高优先级优先 / 影响 0.35h / 员工 A-1002",
      },
      {
        key: "A-1001::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        priority: "medium",
        reviewGroup: "待主管判断",
        impactHours: 5,
        start: "13:00",
        end: "18:00",
        detailDate: "2026-05-11",
        sortReason: "中优先级优先 / 影响 5h / 员工 A-1001",
      },
    ]
  );
  assert.deepEqual(matrix.exceptionQueueSummary, {
    totalCount: 2,
    highPriorityCount: 1,
    loginGapCount: 1,
    statusMismatchCount: 1,
    missingMaterialCount: 1,
    supervisorJudgmentCount: 1,
    dataCheckCount: 0,
    agingWatchCount: 2,
    escalationCount: 1,
    totalImpactHours: 5.35,
  });
  assert.deepEqual(matrix.reviewLoadSummary, {
    totalOpenCount: 2,
    highPriorityOpenCount: 1,
    readyItemCount: 5,
    missingItemCount: 4,
    topReviewGroup: {
      code: "missing_material",
      label: "需补材料",
      count: 1,
      reason: "仍缺员工到岗说明、迟到或漏登原因和原始登录记录。",
    },
    nextPriority: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      reason: "先补到岗说明与原始登录记录，避免登录缺口判断悬空。",
    },
    groups: [
      {
        code: "missing_material",
        label: "需补材料",
        count: 1,
        highPriorityCount: 1,
        readyItemCount: 2,
        missingItemCount: 2,
        reason: "仍缺员工到岗说明、迟到或漏登原因和原始登录记录。",
      },
      {
        code: "supervisor_judgment",
        label: "待主管判断",
        count: 1,
        highPriorityCount: 0,
        readyItemCount: 3,
        missingItemCount: 2,
        reason: "需由现场主管确认培训安排是否符合当班在线要求。",
      },
      {
        code: "data_check",
        label: "需数据核对",
        count: 0,
        highPriorityCount: 0,
        readyItemCount: 0,
        missingItemCount: 0,
        reason: "暂无需数据核对事项。",
      },
    ],
  });
  assert.deepEqual(matrix.supervisorDailyWorkload, {
    totalFocusItems: 2,
    highPriorityItems: 1,
    agingWatchItems: 2,
    escalationItems: 1,
    totalImpactHours: 5.35,
    busiestOwner: {
      ownerRole: "现场主管",
      itemCount: 2,
      reason: "现场主管今日有 2 项待关注，其中 1 项建议升级。",
    },
    nextFocus: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      ownerRole: "现场主管",
      reason: "需要升级 / 需补材料 / 等待 5小时08分钟",
    },
    ownerLoads: [
      {
        ownerRole: "现场主管",
        itemCount: 2,
        highPriorityCount: 1,
        agingWatchCount: 2,
        escalationCount: 1,
        impactHours: 5.35,
        focus: "补充到岗、培训安排和主管判断材料。",
      },
      {
        ownerRole: "数据管理员",
        itemCount: 1,
        highPriorityCount: 1,
        agingWatchCount: 1,
        escalationCount: 1,
        impactHours: 0.35,
        focus: "核对原始登录或状态日志。",
      },
    ],
  });
  assert.deepEqual(matrix.exceptionSourceSummary, {
    totalSources: 2,
    primarySource: {
      track: "login",
      label: "登录轨道",
      itemCount: 1,
      reason: "登录轨道有 1 项异常，其中 1 项高优先，建议先核对原始登录记录。",
    },
    nextSource: {
      track: "login",
      label: "登录轨道",
      reason: "需要升级 / 需补材料 / 影响 0.35h",
    },
    sources: [
      {
        track: "login",
        label: "登录轨道",
        itemCount: 1,
        highPriorityCount: 1,
        agingWatchCount: 1,
        escalationCount: 1,
        impactHours: 0.35,
        focus: "核对登录开始/结束和原始登录记录。",
      },
      {
        track: "status",
        label: "状态轨道",
        itemCount: 1,
        highPriorityCount: 0,
        agingWatchCount: 1,
        escalationCount: 0,
        impactHours: 5,
        focus: "核对状态类型、覆盖时段和现场安排说明。",
      },
      {
        track: "schedule",
        label: "排班轨道",
        itemCount: 0,
        highPriorityCount: 0,
        agingWatchCount: 0,
        escalationCount: 0,
        impactHours: 0,
        focus: "核对排班覆盖、班次窗口和人员安排。",
      },
    ],
  });
  const lateLogin = matrix.exceptionQueue.find((item) => item.key === "A-1002::late_login");
  assert.ok(lateLogin);
  assert.deepEqual(lateLogin.reviewGroup, {
    code: "missing_material",
    label: "需补材料",
    reason: "仍缺员工到岗说明、迟到或漏登原因和原始登录记录。",
  });
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
  assert.deepEqual(lateLogin.handlingGuide, {
    priorityChecks: ["核对排班开始时间 09:00", "核对登录开始时间 09:21", "确认员工实际到岗时间"],
    requiredInfo: ["到岗说明", "迟到或漏登原因", "现场主管确认口径"],
    communicationTarget: "王敏 / 现场主管",
    boundary: "当前仅记录跟进过程，处理动作由线下流程完成。",
  });
  assert.deepEqual(lateLogin.evidenceSummary, {
    schedule: "排班 SCH-1002-1：早班 09:00-17:00",
    login: "登录 LOG-1002-1：CORN 登录 09:21-17:00",
    status: "状态轨道：无命中记录",
    conclusion: "09:00-09:21 存在登录缺口，需核对到岗或漏登原因。",
  });
  assert.deepEqual(lateLogin.handlingRecords, [
    {
      recordedAt: "2026-05-11 09:35",
      recorder: "现场主管",
      conclusion: "已联系员工确认到岗时间。",
      followUp: "等待补充迟到或漏登原因。",
    },
  ]);
  assert.deepEqual(lateLogin.handlingOutcome, {
    category: "到岗核对",
    reason: "排班开始 09:00，登录开始 09:21。",
    ownerRole: "现场主管",
    nextReviewPoint: "确认王敏实际到岗时间和迟到原因。",
  });
  assert.deepEqual(lateLogin.resolutionDraft, {
    suggestedConclusion: "待确认到岗：王敏 09:00-09:21 登录缺口，需补到岗说明。",
    requiredEvidence: ["员工到岗说明", "迟到或漏登原因", "CORN 原始登录日志截图"],
    communicationTarget: "王敏 / 现场主管",
    ownerRole: "现场主管",
    nextReviewPoint: "2026-05-11 10:00",
    riskIfOpen: "缺少到岗说明会影响当日履约缺口判断。",
  });
  assert.deepEqual(lateLogin.closureChecklist, {
    currentJudgment: "需补到岗说明后再判断当日登录缺口。",
    readyCount: 2,
    missingCount: 2,
    items: [
      {
        label: "排班记录",
        status: "已关联",
        ownerRole: "排班运营",
        judgmentImpact: "确认 09:00 开始排班。",
      },
      {
        label: "登录记录",
        status: "已关联",
        ownerRole: "数据管理员",
        judgmentImpact: "确认 09:21 登录开始。",
      },
      {
        label: "到岗说明",
        status: "需补充",
        ownerRole: "现场主管",
        judgmentImpact: "确认是否迟到或漏登。",
      },
      {
        label: "主管判断",
        status: "待确认",
        ownerRole: "现场主管",
        judgmentImpact: "形成当日履约缺口判断。",
      },
    ],
  });
  assert.deepEqual(lateLogin.handoffSummary, {
    recipient: "现场主管",
    summary: "王敏 09:00-09:21 登录缺口，影响 0.35h。",
    openQuestions: ["是否实际到岗但漏登", "迟到原因是否已说明"],
    nextTouchpoint: "班前到岗核对记录",
  });
  assert.deepEqual(lateLogin.dataCheckReadiness, {
    sourceRecords: ["SCH-1002-1", "LOG-1002-1"],
    checkFields: ["排班开始时间", "登录开始时间", "员工到岗说明"],
    riskNote: "若登录时间来自系统延迟，需由数据管理员核对原始日志。",
  });
  assert.deepEqual(lateLogin.dataQualityLinks, [
    {
      issueId: "DQ-202605-009",
      title: "登录员工不在主数据",
      source: "login_log",
      sourceLabel: "登录日志",
      severity: "low",
      status: "ignored",
      owner: "现场主管",
      href: "/data-quality/DQ-202605-009",
      matchedRecords: ["LOG-1002-1"],
      matchedFields: ["login_log.employee_id", "员工到岗说明"],
      reason: "登录缺口需要核对登录日志和人员主数据是否能支撑当日履约判断。",
      recommendation: "确认是否为临时账号；若需要计入履约，先补主数据。",
    },
  ]);
  assert.deepEqual(lateLogin.dataQualityRepairPrep, {
    needsDataOwner: true,
    priority: "高",
    reason: "登录开始时间晚于排班开始时间，需先确认是否为原始登录日志延迟。",
    ownerTeam: "数据管理员",
  });
  assert.deepEqual(lateLogin.repairMaterials, {
    records: ["SCH-1002-1", "LOG-1002-1"],
    fields: ["排班开始时间", "登录开始时间", "员工到岗说明"],
    supportingNotes: ["员工到岗说明", "CORN 原始登录日志截图", "现场主管确认口径"],
  });
  assert.deepEqual(lateLogin.dataQualityImpactScope, {
    impactedObjects: ["王敏", "早班", "2026-05-11 小组矩阵"],
    impactedComparisons: ["排班 vs 登录", "当日履约缺口"],
    excludedScope: "不影响班次类型、供应商绑定和需求预测版本。",
  });
  assert.deepEqual(lateLogin.supervisorFollowUp, {
    owner: "现场主管",
    status: "待补说明",
    nextCheckAt: "2026-05-11 10:00",
    currentFocus: "确认王敏实际到岗时间和迟到原因。",
  });
  assert.deepEqual(lateLogin.followUpGaps, {
    missingNotes: ["员工到岗说明", "迟到或漏登原因"],
    missingRecords: ["CORN 原始登录日志截图"],
    missingDecisions: ["现场主管确认口径"],
  });
  assert.deepEqual(lateLogin.groupFollowUpRollup, {
    queuePosition: "第 1 / 2 项",
    sameGroupOpenCount: 2,
    highPriorityOpenCount: 1,
    groupRiskNote: "供应商 A 当日仍有 2 项待跟进，其中 1 项为高优先。",
  });
  assert.deepEqual(lateLogin.agingEscalation, {
    detectedAt: "2026-05-11 09:22",
    waitingMinutes: 308,
    waitingLabel: "5小时08分钟",
    level: "需要升级",
    reason: "登录缺口已等待 5小时08分钟，仍缺员工到岗说明。",
    escalationTarget: "现场主管",
    nextReviewWindow: "2026-05-11 15:00 前",
    queueHint: "先处理该项，避免当日登录缺口判断悬空。",
  });
  const statusMismatch = matrix.exceptionQueue.find((item) => item.key === "A-1001::no_login");
  assert.ok(statusMismatch);
  assert.deepEqual(statusMismatch.reviewGroup, {
    code: "supervisor_judgment",
    label: "待主管判断",
    reason: "需由现场主管确认培训安排是否符合当班在线要求。",
  });
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
  assert.deepEqual(statusMismatch.handlingGuide, {
    priorityChecks: ["核对状态轨道 培训", "核对排班覆盖 13:00-18:00", "确认培训安排是否登记"],
    requiredInfo: ["培训安排说明", "在线要求确认", "主管复核结论"],
    communicationTarget: "刘晨 / 现场主管",
    boundary: "当前仅记录跟进过程，处理动作由线下流程完成。",
  });
  assert.deepEqual(statusMismatch.evidenceSummary, {
    schedule: "排班 SCH-1001-2：午后班 13:00-18:00",
    login: "登录 LOG-1001-1：CORN 登录 09:02-18:00",
    status: "状态 STA-1001-2：培训 13:00-18:00",
    conclusion: "13:00-18:00 状态为培训，需确认是否符合当班在线要求。",
  });
  assert.deepEqual(statusMismatch.handlingOutcome, {
    category: "状态核对",
    reason: "状态轨道为培训，覆盖 13:00-18:00。",
    ownerRole: "现场主管",
    nextReviewPoint: "确认培训安排是否符合当班在线要求。",
  });
  assert.deepEqual(statusMismatch.resolutionDraft, {
    suggestedConclusion: "待确认状态：刘晨 13:00-18:00 状态为培训，需补培训安排说明。",
    requiredEvidence: ["培训安排说明", "在线要求确认"],
    communicationTarget: "刘晨 / 现场主管",
    ownerRole: "现场主管",
    nextReviewPoint: "2026-05-11 15:00",
    riskIfOpen: "缺少培训安排说明会影响状态是否计入当班履约。",
  });
  assert.deepEqual(statusMismatch.closureChecklist, {
    currentJudgment: "需补培训安排说明后再判断状态是否计入履约。",
    readyCount: 3,
    missingCount: 2,
    items: [
      {
        label: "排班记录",
        status: "已关联",
        ownerRole: "排班运营",
        judgmentImpact: "确认 13:00-18:00 排班覆盖。",
      },
      {
        label: "登录记录",
        status: "已关联",
        ownerRole: "数据管理员",
        judgmentImpact: "确认登录覆盖当日工作时段。",
      },
      {
        label: "状态记录",
        status: "已关联",
        ownerRole: "现场主管",
        judgmentImpact: "确认 13:00-18:00 状态为培训。",
      },
      {
        label: "培训安排说明",
        status: "需补充",
        ownerRole: "现场主管",
        judgmentImpact: "确认培训是否符合当班在线要求。",
      },
      {
        label: "主管判断",
        status: "待确认",
        ownerRole: "现场主管",
        judgmentImpact: "形成状态是否计入履约的判断。",
      },
    ],
  });
  assert.deepEqual(statusMismatch.dataCheckReadiness.sourceRecords, [
    "SCH-1001-2",
    "LOG-1001-1",
    "STA-1001-2",
  ]);
  assert.deepEqual(statusMismatch.dataQualityLinks, [
    {
      issueId: "DQ-202605-010",
      title: "状态时间段重叠",
      source: "status_log",
      sourceLabel: "状态日志",
      severity: "high",
      status: "open",
      owner: "运营负责人",
      href: "/data-quality/DQ-202605-010",
      matchedRecords: ["STA-1001-2"],
      matchedFields: ["status_log.status_start_at/status_end_at", "培训安排说明"],
      reason: "状态不一致需要核对状态日志切片是否会影响个人三轨解释。",
      recommendation: "拆分或修正重叠状态，避免非有效产能重复计算。",
    },
  ]);
  assert.deepEqual(statusMismatch.dataQualityRepairPrep, {
    needsDataOwner: false,
    priority: "中",
    reason: "状态轨道为培训，优先由现场主管确认培训安排是否登记。",
    ownerTeam: "现场主管",
  });
  assert.deepEqual(statusMismatch.agingEscalation, {
    detectedAt: "2026-05-11 13:10",
    waitingMinutes: 80,
    waitingLabel: "1小时20分钟",
    level: "接近超时",
    reason: "状态判断已等待 1小时20分钟，需在班中复核培训安排说明。",
    escalationTarget: "现场主管",
    nextReviewWindow: "2026-05-11 15:30 前",
    queueHint: "关注培训说明是否补齐，避免午后状态判断延后。",
  });
  assert.deepEqual(statusMismatch.supervisorFollowUp.status, "待主管复核");
  assert.deepEqual(statusMismatch.followUpGaps.missingNotes, ["培训安排说明", "在线要求确认"]);
});

test("fulfillment detail links preserve queue return context", () => {
  const calendar = getFulfillmentCalendar(fallbackPersonTimelines);
  const team = calendar.teams.find((item) => item.workplace === "上海职场");
  assert.ok(team);
  const group = team.groups.find((item) => item.supplier === "供应商 A");
  assert.ok(group);

  const detailHref = buildPersonFulfillmentDetailHref({
    employeeId: "A-1002",
    date: "2026-05-11",
    teamId: team.id,
    groupId: group.id,
    returnDate: "2026-05-11",
    queueFilter: "high",
    exceptionKey: "A-1002::late_login",
  });
  const detailUrl = new URL(detailHref, "http://local");

  assert.equal(detailUrl.pathname, "/person-timeline/A-1002");
  assert.equal(detailUrl.searchParams.get("date"), "2026-05-11");
  assert.equal(detailUrl.searchParams.get("team"), team.id);
  assert.equal(detailUrl.searchParams.get("group"), group.id);
  assert.equal(detailUrl.searchParams.get("returnDate"), "2026-05-11");
  assert.equal(detailUrl.searchParams.get("queue"), "high");
  assert.equal(detailUrl.searchParams.get("exception"), "A-1002::late_login");

  const returnHref = buildFulfillmentMatrixReturnHref({
    teamId: team.id,
    groupId: group.id,
    date: "2026-05-11",
    queueFilter: "high",
    exceptionKey: "A-1002::late_login",
  });
  const returnUrl = new URL(returnHref, "http://local");

  assert.equal(returnUrl.pathname, "/person-timeline");
  assert.equal(returnUrl.searchParams.get("team"), team.id);
  assert.equal(returnUrl.searchParams.get("group"), group.id);
  assert.equal(returnUrl.searchParams.get("date"), "2026-05-11");
  assert.equal(returnUrl.searchParams.get("queue"), "high");
  assert.equal(returnUrl.searchParams.get("exception"), "A-1002::late_login");
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
