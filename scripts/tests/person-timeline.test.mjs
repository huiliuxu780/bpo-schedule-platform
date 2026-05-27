import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildFulfillmentMatrixReturnHref,
  buildPersonFulfillmentDetailHref,
  buildSupervisorExceptionHandlingRecords,
  fallbackPersonTimelines,
  filterPersonTimelines,
  getFulfillmentCalendar,
  getFulfillmentGroup,
  getFulfillmentGroupMemberWeekMatrix,
  getFulfillmentMatrix,
  getFulfillmentMatrixExceptionQueueCursor,
  getSupervisorExceptionReviewState,
  getFulfillmentTeam,
  getPersonTimeline,
  getPersonTimelineAvailableDates,
  getPersonTimelineDailyView,
  getPersonTimelineWeekView,
  getTimelineEventPosition,
  resetSupervisorExceptionReviewProcessMemory,
  submitSupervisorExceptionEvidence,
  submitSupervisorExceptionReviewConclusion,
  submitSupervisorExceptionClosure,
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

test("matrix view surfaces selected exception follow-up before summary panels", () => {
  const pageSource = readFileSync(new URL("../../app/person-timeline/page.tsx", import.meta.url), "utf8");
  const teamRiskDistributionPosition = pageSource.indexOf("<TeamWeekRiskDistributionPanel team={teams[0]} />");
  const teamWeekCardPosition = pageSource.indexOf("{teams.map((team) => (");
  const supervisorWeeklyReviewQueuePosition = pageSource.indexOf("<SupervisorWeeklyReviewQueuePanel team={team} />");
  const supervisorWeeklyDecisionDigestPosition = pageSource.indexOf("<SupervisorWeeklyDecisionDigestPanel team={team} />");
  const weeklyDataQualitySummaryPosition = pageSource.indexOf("<WeeklyDataQualitySummaryPanel team={team} />");
  const weeklyOwnerPressurePosition = pageSource.indexOf("<WeeklyOwnerPressurePanel team={team} />");
  const weeklySourcePressurePosition = pageSource.indexOf("<WeeklySourcePressurePanel team={team} />");
  const weeklyReviewComparisonPosition = pageSource.indexOf("<WeeklyReviewComparisonPanel team={team} />");
  const weeklyClosureCloseoutPosition = pageSource.indexOf("<WeeklyClosureCloseoutPanel team={team} />");
  const weeklyQaBoundaryPosition = pageSource.indexOf("<WeeklyQaBoundaryPanel team={team} />");
  const supervisorWeeklyHandoffPosition = pageSource.indexOf("<SupervisorWeeklyHandoffSummaryPanel team={team} />");
  const teamEvidenceGapDistributionPosition = pageSource.indexOf("<TeamEvidenceGapDistributionPanel team={team} />");
  const closureReadinessTrendPosition = pageSource.indexOf("<ClosureReadinessTrendPanel team={team} />");
  const closureTrendReasonLabelPosition = pageSource.indexOf("变化原因");
  const closureTrendPrimaryBlockerLabelPosition = pageSource.indexOf("主阻塞");
  const closureTrendNextViewLabelPosition = pageSource.indexOf("下一查看");
  const groupRiskSummaryPosition = pageSource.indexOf("<GroupRiskSummaryPanel team={team} />");
  const followUpPosition = pageSource.indexOf("{selected ? <SelectedExceptionFollowUpCard selected={selected} /> : null}");
  const comparisonPosition = pageSource.indexOf("{selected ? <SelectedExceptionComparisonCard selected={selected} /> : null}");
  const ownerLoadPosition = pageSource.indexOf("{selected ? <SelectedExceptionOwnerLoadComparisonCard selected={selected} /> : null}");
  const nextDayPosition = pageSource.indexOf("{selected ? <SelectedExceptionNextDayWatchlistCard selected={selected} /> : null}");
  const reviewOutcomePreviewPosition = pageSource.indexOf("{selected ? <SelectedExceptionReviewOutcomePreviewCard selected={selected} /> : null}");
  const dataQualityImpactPosition = pageSource.indexOf("<DataQualityExceptionImpactPanel impact={matrix.dataQualityExceptionImpact} />");
  const dataQualityRankingPosition = pageSource.indexOf("<DataQualityImpactRankingPanel ranking={matrix.dataQualityImpactRanking} />");
  const impactPriorityPosition = pageSource.indexOf("<ExceptionImpactPriorityPanel priority={matrix.exceptionImpactPriority} />");
  const supervisorPriorityPosition = pageSource.indexOf("<SupervisorPrioritySummaryPanel summary={matrix.supervisorPrioritySummary} />");
  const handlingReadinessPosition = pageSource.indexOf("<HandlingReadinessNarrativePanel narrative={matrix.handlingReadinessNarrative} />");
  const decisionDigestPosition = pageSource.indexOf("<SupervisorDecisionDigestPanel digest={matrix.supervisorDecisionDigest} />");
  const closureRiskPosition = pageSource.indexOf("<ClosureRiskExplanationPanel explanation={matrix.closureRiskExplanation} />");
  const closureReviewPosition = pageSource.indexOf("<ClosureReviewSummaryPanel summary={matrix.closureReviewSummary} />");
  const trendPosition = pageSource.indexOf("<TeamDayRiskTrendPanel trend={matrix.teamDayRiskTrend} />");
  const riskDigestPosition = pageSource.indexOf("<TeamDayRiskDigestPanel summary={matrix.teamDayRiskDigest} />");
  const causeSplitPosition = pageSource.indexOf("<GroupRiskCauseSplitPanel split={matrix.groupRiskCauseSplit} />");
  const carryoverPosition = pageSource.indexOf("<TeamWeekCarryoverOverviewPanel overview={matrix.teamWeekCarryoverOverview} />");
  const closureReadinessPosition = pageSource.indexOf("<ExceptionClosureReadinessSummaryPanel matrix={matrix} summary={matrix.exceptionClosureReadinessSummary} />");
  const reviewLoadPosition = pageSource.indexOf("<ReviewLoadSummaryPanel summary={matrix.reviewLoadSummary} />");
  const titleCount = pageSource.match(/跟进时间线/g)?.length ?? 0;

  assert.ok(teamRiskDistributionPosition >= 0);
  assert.ok(teamWeekCardPosition >= 0);
  assert.ok(supervisorWeeklyReviewQueuePosition >= 0);
  assert.ok(supervisorWeeklyDecisionDigestPosition >= 0);
  assert.ok(weeklyDataQualitySummaryPosition >= 0);
  assert.ok(weeklyOwnerPressurePosition >= 0);
  assert.ok(weeklySourcePressurePosition >= 0);
  assert.ok(weeklyReviewComparisonPosition >= 0);
  assert.ok(weeklyClosureCloseoutPosition >= 0);
  assert.ok(weeklyQaBoundaryPosition >= 0);
  assert.ok(supervisorWeeklyHandoffPosition >= 0);
  assert.ok(teamEvidenceGapDistributionPosition >= 0);
  assert.ok(closureReadinessTrendPosition >= 0);
  assert.ok(closureTrendReasonLabelPosition >= 0);
  assert.ok(closureTrendPrimaryBlockerLabelPosition >= 0);
  assert.ok(closureTrendNextViewLabelPosition >= 0);
  assert.ok(groupRiskSummaryPosition >= 0);
  assert.ok(teamRiskDistributionPosition < teamWeekCardPosition);
  assert.ok(supervisorWeeklyDecisionDigestPosition < supervisorWeeklyReviewQueuePosition);
  assert.ok(supervisorWeeklyDecisionDigestPosition < weeklyDataQualitySummaryPosition);
  assert.ok(weeklyDataQualitySummaryPosition < weeklyOwnerPressurePosition);
  assert.ok(weeklyOwnerPressurePosition < weeklySourcePressurePosition);
  assert.ok(weeklySourcePressurePosition < weeklyReviewComparisonPosition);
  assert.ok(weeklyReviewComparisonPosition < weeklyClosureCloseoutPosition);
  assert.ok(weeklyClosureCloseoutPosition < weeklyQaBoundaryPosition);
  assert.ok(weeklyQaBoundaryPosition < supervisorWeeklyReviewQueuePosition);
  assert.ok(supervisorWeeklyDecisionDigestPosition < supervisorWeeklyHandoffPosition);
  assert.ok(supervisorWeeklyReviewQueuePosition < groupRiskSummaryPosition);
  assert.ok(supervisorWeeklyReviewQueuePosition < supervisorWeeklyHandoffPosition);
  assert.ok(supervisorWeeklyHandoffPosition < groupRiskSummaryPosition);
  assert.ok(supervisorWeeklyHandoffPosition < teamEvidenceGapDistributionPosition);
  assert.ok(teamEvidenceGapDistributionPosition < groupRiskSummaryPosition);
  assert.ok(teamEvidenceGapDistributionPosition < closureReadinessTrendPosition);
  assert.ok(closureReadinessTrendPosition < groupRiskSummaryPosition);
  assert.ok(closureReadinessTrendPosition < closureTrendReasonLabelPosition);
  assert.ok(followUpPosition >= 0);
  assert.ok(comparisonPosition >= 0);
  assert.ok(ownerLoadPosition >= 0);
  assert.ok(nextDayPosition >= 0);
  assert.ok(reviewOutcomePreviewPosition >= 0);
  assert.ok(dataQualityImpactPosition >= 0);
  assert.ok(dataQualityRankingPosition >= 0);
  assert.ok(impactPriorityPosition >= 0);
  assert.ok(supervisorPriorityPosition >= 0);
  assert.ok(handlingReadinessPosition >= 0);
  assert.ok(decisionDigestPosition >= 0);
  assert.ok(closureRiskPosition >= 0);
  assert.ok(closureReviewPosition >= 0);
  assert.ok(trendPosition >= 0);
  assert.ok(riskDigestPosition >= 0);
  assert.ok(causeSplitPosition >= 0);
  assert.ok(carryoverPosition >= 0);
  assert.ok(closureReadinessPosition >= 0);
  assert.ok(reviewLoadPosition >= 0);
  assert.ok(followUpPosition < riskDigestPosition);
  assert.ok(comparisonPosition < riskDigestPosition);
  assert.ok(ownerLoadPosition < riskDigestPosition);
  assert.ok(nextDayPosition < riskDigestPosition);
  assert.ok(nextDayPosition < reviewOutcomePreviewPosition);
  assert.ok(reviewOutcomePreviewPosition < dataQualityImpactPosition);
  assert.ok(dataQualityImpactPosition < dataQualityRankingPosition);
  assert.ok(dataQualityRankingPosition < impactPriorityPosition);
  assert.ok(impactPriorityPosition < supervisorPriorityPosition);
  assert.ok(supervisorPriorityPosition < handlingReadinessPosition);
  assert.ok(handlingReadinessPosition < decisionDigestPosition);
  assert.ok(decisionDigestPosition < closureRiskPosition);
  assert.ok(closureRiskPosition < closureReviewPosition);
  assert.ok(closureReviewPosition < trendPosition);
  assert.ok(trendPosition < riskDigestPosition);
  assert.ok(riskDigestPosition < causeSplitPosition);
  assert.ok(causeSplitPosition < reviewLoadPosition);
  assert.ok(causeSplitPosition < carryoverPosition);
  assert.ok(carryoverPosition < reviewLoadPosition);
  assert.ok(carryoverPosition < closureReadinessPosition);
  assert.ok(closureReadinessPosition < reviewLoadPosition);
  assert.equal(titleCount, 1);
});

test("supervisor exception review process memory stores conclusion evidence and closure", () => {
  resetSupervisorExceptionReviewProcessMemory();

  const conclusion = submitSupervisorExceptionReviewConclusion({
    exceptionKey: "A-1001::no_login",
    employeeId: "A-1001",
    anomalyCode: "no_login",
    submittedBy: "现场主管",
    conclusion: "确认培训安排符合当班要求，登录缺口不计入人员缺勤。",
    sourceReferences: ["schedule-A-1001-20260511-1300", "status-A-1001-20260511-training"],
  });
  const evidence = submitSupervisorExceptionEvidence({
    exceptionKey: "A-1001::no_login",
    submittedBy: "现场主管",
    note: "已核对培训登记和状态轨道，员工当天参加项目培训。",
    linkedRecordType: "person_timeline",
    linkedRecordId: "A-1001",
  });
  const closure = submitSupervisorExceptionClosure({
    exceptionKey: "A-1001::no_login",
    closedBy: "现场主管",
    conclusion: "已形成本地处理结论，后续等待数据库持久化 Gate。",
  });
  const state = getSupervisorExceptionReviewState("A-1001::no_login");

  assert.equal(conclusion.id, "REV-0001");
  assert.equal(evidence.id, "EVD-0001");
  assert.equal(closure.id, "CLS-0001");
  assert.equal(state.status, "closed_locally");
  assert.equal(state.latestConclusion?.conclusion, conclusion.conclusion);
  assert.equal(state.evidenceRecords.length, 1);
  assert.equal(state.closureRecord?.evidenceRecordIds[0], "EVD-0001");
});

test("supervisor exception handling records expose pending submitted evidence and closure chain", () => {
  resetSupervisorExceptionReviewProcessMemory();

  const pendingState = getSupervisorExceptionReviewState("A-1002::late_login");
  const pendingRecords = buildSupervisorExceptionHandlingRecords({
    exceptionKey: "A-1002::late_login",
    state: pendingState,
    suggestedConclusion: "建议按实际登录晚到记录进入主管复核。",
    sourceReferences: ["SCH-A-1002-20260511", "LOG-A-1002-20260511"],
  });

  assert.deepEqual(pendingRecords, [
    {
      id: "PENDING-A-1002::late_login",
      kind: "pending_review",
      title: "待提交复核",
      actor: "现场主管",
      occurredAt: "待提交",
      summary: "建议按实际登录晚到记录进入主管复核。",
      references: ["SCH-A-1002-20260511", "LOG-A-1002-20260511"],
    },
  ]);

  submitSupervisorExceptionReviewConclusion({
    exceptionKey: "A-1002::late_login",
    employeeId: "A-1002",
    anomalyCode: "late_login",
    submittedBy: "现场主管",
    conclusion: "确认登录晚到 21 分钟，需要按实际来源记录复核。",
    sourceReferences: ["SCH-A-1002-20260511", "LOG-A-1002-20260511"],
  });
  submitSupervisorExceptionEvidence({
    exceptionKey: "A-1002::late_login",
    submittedBy: "现场主管",
    note: "已核对排班明细和登录日志。",
    linkedRecordType: "actual_log",
    linkedRecordId: "SCH-A-1002-20260511",
  });
  submitSupervisorExceptionClosure({
    exceptionKey: "A-1002::late_login",
    closedBy: "现场主管",
    conclusion: "已形成本地处理记录，等待后续数据库 Gate 持久化。",
  });

  const closedRecords = buildSupervisorExceptionHandlingRecords({
    exceptionKey: "A-1002::late_login",
    state: getSupervisorExceptionReviewState("A-1002::late_login"),
    suggestedConclusion: "建议按实际登录晚到记录进入主管复核。",
    sourceReferences: ["SCH-A-1002-20260511", "LOG-A-1002-20260511"],
  });

  assert.deepEqual(
    closedRecords.map((record) => record.kind),
    ["review_conclusion", "evidence", "closure"]
  );
  assert.equal(closedRecords[0].title, "复核结论");
  assert.deepEqual(closedRecords[0].references, [
    "SCH-A-1002-20260511",
    "LOG-A-1002-20260511",
  ]);
  assert.equal(closedRecords[1].title, "补充证据");
  assert.deepEqual(closedRecords[1].references, ["EVD-0001", "SCH-A-1002-20260511"]);
  assert.equal(closedRecords[2].title, "处理结论");
  assert.deepEqual(closedRecords[2].references, ["CLS-0001", "EVD-0001"]);
});

test("person timeline page exposes local review submit evidence and closure actions", () => {
  const pageSource = readFileSync(new URL("../../app/person-timeline/page.tsx", import.meta.url), "utf8");

  assert.ok(pageSource.includes("SelectedExceptionLocalClosureCard"));
  assert.ok(pageSource.includes("buildSupervisorExceptionHandlingRecords"));
  assert.ok(pageSource.includes("处理记录链"));
  assert.ok(pageSource.includes("待提交复核"));
  assert.ok(pageSource.includes("提交复核结论"));
  assert.ok(pageSource.includes("补充证据"));
  assert.ok(pageSource.includes("关闭异常"));
  assert.ok(pageSource.includes("submitSupervisorReviewConclusionAction"));
  assert.ok(pageSource.includes("submitSupervisorEvidenceAction"));
  assert.ok(pageSource.includes("submitSupervisorClosureAction"));
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
  assert.deepEqual(shanghaiTeam.weekRiskDistribution, {
    riskLevel: "高",
    riskScore: 100,
    headline: "本周风险集中在周一 05/11，建议先下钻供应商 A。",
    highestRiskDay: {
      date: "2026-05-11",
      label: "周一 05/11",
      score: 100,
      reason: "缺口 2 人 / 异常 2 人",
    },
    primaryReason: "本周累计缺口 4 人，异常 2 人，最高风险来自周一 05/11。",
    nextDrilldown: {
      date: "2026-05-11",
      label: "周一 05/11",
      groupName: "供应商 A",
      reason: "先看供应商 A，缺口 2 人 / 异常 2 人。",
    },
    rank: {
      label: "第 1 / 3 个团队",
      reason: "按本周缺口和异常排序，上海职场 / 博西客服 当前最高。",
    },
    points: [
      {
        date: "2026-05-11",
        label: "周一 05/11",
        score: 100,
        riskLevel: "高",
        weekday: "周一",
        plannedPeople: 3,
        loginPeople: 3,
        gapPeople: 2,
        anomalyPeople: 2,
      },
      {
        date: "2026-05-12",
        label: "周二 05/12",
        score: 60,
        riskLevel: "中",
        weekday: "周二",
        plannedPeople: 3,
        loginPeople: 3,
        gapPeople: 2,
        anomalyPeople: 0,
      },
      {
        date: "2026-05-13",
        label: "周三 05/13",
        score: 0,
        riskLevel: "低",
        weekday: "周三",
        plannedPeople: 0,
        loginPeople: 0,
        gapPeople: 0,
        anomalyPeople: 0,
      },
      {
        date: "2026-05-14",
        label: "周四 05/14",
        score: 0,
        riskLevel: "低",
        weekday: "周四",
        plannedPeople: 0,
        loginPeople: 0,
        gapPeople: 0,
        anomalyPeople: 0,
      },
      {
        date: "2026-05-15",
        label: "周五 05/15",
        score: 0,
        riskLevel: "低",
        weekday: "周五",
        plannedPeople: 0,
        loginPeople: 0,
        gapPeople: 0,
        anomalyPeople: 0,
      },
      {
        date: "2026-05-16",
        label: "周六 05/16",
        score: 0,
        riskLevel: "低",
        weekday: "周六",
        plannedPeople: 0,
        loginPeople: 0,
        gapPeople: 0,
        anomalyPeople: 0,
      },
      {
        date: "2026-05-17",
        label: "周日 05/17",
        score: 0,
        riskLevel: "低",
        weekday: "周日",
        plannedPeople: 0,
        loginPeople: 0,
        gapPeople: 0,
        anomalyPeople: 0,
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.supervisorWeeklyReviewQueue, {
    headline: "本周优先复核供应商 A 的周一 05/11，缺口 2 人 / 异常 2 人。",
    totalItems: 3,
    highPriorityCount: 1,
    totalGapPeople: 4,
    totalAnomalyPeople: 2,
    topItem: {
      key: "上海职场||博西客服||供应商 A::2026-05-11",
      groupId: "上海职场||博西客服||供应商 A",
      groupName: "供应商 A",
      date: "2026-05-11",
      label: "周一 05/11",
      priority: "高",
      score: 100,
      gapPeople: 2,
      anomalyPeople: 2,
      reviewTarget: "A-1002 王敏",
      reason: "缺口 2 人 / 异常 2 人，建议先看 A-1002 王敏。",
    },
    items: [
      {
        key: "上海职场||博西客服||供应商 A::2026-05-11",
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
        priority: "高",
        score: 100,
        gapPeople: 2,
        anomalyPeople: 2,
        reviewTarget: "A-1002 王敏",
        reason: "缺口 2 人 / 异常 2 人，建议先看 A-1002 王敏。",
      },
      {
        key: "上海职场||博西客服||供应商 A::2026-05-12",
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-12",
        label: "周二 05/12",
        priority: "低",
        score: 30,
        gapPeople: 1,
        anomalyPeople: 0,
        reviewTarget: "A-1002 王敏",
        reason: "缺口 1 人 / 异常 0 人，建议先看 A-1002 王敏。",
      },
      {
        key: "上海职场||博西客服||供应商 B::2026-05-12",
        groupId: "上海职场||博西客服||供应商 B",
        groupName: "供应商 B",
        date: "2026-05-12",
        label: "周二 05/12",
        priority: "低",
        score: 30,
        gapPeople: 1,
        anomalyPeople: 0,
        reviewTarget: "A-1005 赵岩",
        reason: "缺口 1 人 / 异常 0 人，建议先看 A-1005 赵岩。",
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.supervisorWeeklyDecisionDigest, {
    headline: "本周先判断供应商 A / 周一 05/11，当前 3 个复核组合、2 项异常交接需要主管确认。",
    totalDecisions: 3,
    highConfidenceCount: 1,
    openRiskCount: 2,
    nextReviewTarget: "A-1002 王敏",
    topDecision: {
      key: "weekly_review_priority",
      title: "先复核供应商 A / 周一 05/11",
      suggestedDecision: "优先判断 A-1002 王敏 是否影响当日履约。",
      confidence: "高",
      evidenceSummary: "缺口 2 人 / 异常 2 人 / 高优组合 1 个。",
      openRisk: "仍有 2 项异常交接，开放问题 4 个。",
      nextReviewPoint: "进入供应商 A 的周一 05/11，先看 A-1002 王敏。",
      sourceReferences: ["本周复核队列", "本周交接摘要"],
      groupId: "上海职场||博西客服||供应商 A",
      groupName: "供应商 A",
      date: "2026-05-11",
      label: "周一 05/11",
    },
    decisions: [
      {
        key: "weekly_review_priority",
        title: "先复核供应商 A / 周一 05/11",
        suggestedDecision: "优先判断 A-1002 王敏 是否影响当日履约。",
        confidence: "高",
        evidenceSummary: "缺口 2 人 / 异常 2 人 / 高优组合 1 个。",
        openRisk: "仍有 2 项异常交接，开放问题 4 个。",
        nextReviewPoint: "进入供应商 A 的周一 05/11，先看 A-1002 王敏。",
        sourceReferences: ["本周复核队列", "本周交接摘要"],
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
      },
      {
        key: "weekly_evidence_gap",
        title: "先补主管判断",
        suggestedDecision: "本周判断前先补齐主管判断，涉及 2 人。",
        confidence: "中",
        evidenceSummary: "证据缺口 4 项，主要缺口为主管判断。",
        openRisk: "缺口未补齐时，周度结论只能作为复核准备口径。",
        nextReviewPoint: "下钻供应商 A / 周一 05/11，核对主管判断。",
        sourceReferences: ["证据缺口分布", "闭环准备趋势"],
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
      },
      {
        key: "weekly_closure_readiness",
        title: "周一闭环暂缓",
        suggestedDecision: "周一 05/11 仍有 2 项未就绪，先解释待补材料。",
        confidence: "中",
        evidenceSummary: "准备 6 天 / 阻塞 1 天 / 转好 1 天。",
        openRisk: "待补材料阻塞 1 项，闭环前需补齐说明。",
        nextReviewPoint: "优先回看供应商 A 的周一 05/11。",
        sourceReferences: ["闭环准备趋势"],
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.weeklyDataQualitySummary, {
    headline: "本周 2 个数据质量问题影响 2 项异常，先处理状态时间段重叠。",
    totalIssueCount: 2,
    impactedExceptionCount: 2,
    impactedPeopleCount: 2,
    impactedDayCount: 1,
    totalImpactHours: 5.35,
    highSeverityCount: 1,
    totalBlockedEvidenceCount: 6,
    topIssue: {
      issueId: "DQ-202605-010",
      title: "状态时间段重叠",
      severity: "high",
      owner: "运营负责人",
      impactHours: 5,
      impactedExceptionCount: 1,
      impactedPeople: ["刘晨"],
      impactedDays: ["周一 05/11"],
      affectedGroups: ["供应商 A"],
      blockedEvidence: ["培训安排说明", "在线要求确认", "主管复核结论"],
      nextDrilldown: {
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
        exceptionKey: "A-1001::no_login",
        reason: "先看刘晨的午后状态缺登录切片，再进入 /data-quality/DQ-202605-010。",
      },
      reason: "影响 5.00h / 1 项异常 / 1 天 / 3 项证据阻塞 / high",
      href: "/data-quality/DQ-202605-010",
    },
    issues: [
      {
        issueId: "DQ-202605-010",
        title: "状态时间段重叠",
        severity: "high",
        owner: "运营负责人",
        impactHours: 5,
        impactedExceptionCount: 1,
        impactedPeople: ["刘晨"],
        impactedDays: ["周一 05/11"],
        affectedGroups: ["供应商 A"],
        blockedEvidence: ["培训安排说明", "在线要求确认", "主管复核结论"],
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1001::no_login",
          reason: "先看刘晨的午后状态缺登录切片，再进入 /data-quality/DQ-202605-010。",
        },
        reason: "影响 5.00h / 1 项异常 / 1 天 / 3 项证据阻塞 / high",
        href: "/data-quality/DQ-202605-010",
      },
      {
        issueId: "DQ-202605-009",
        title: "登录员工不在主数据",
        severity: "low",
        owner: "现场主管",
        impactHours: 0.35,
        impactedExceptionCount: 1,
        impactedPeople: ["王敏"],
        impactedDays: ["周一 05/11"],
        affectedGroups: ["供应商 A"],
        blockedEvidence: ["到岗说明", "迟到或漏登原因", "现场主管确认口径"],
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1002::late_login",
          reason: "先看王敏的迟到 21 分钟，再进入 /data-quality/DQ-202605-009。",
        },
        reason: "影响 0.35h / 1 项异常 / 1 天 / 3 项证据阻塞 / low",
        href: "/data-quality/DQ-202605-009",
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.weeklyOwnerPressureSummary, {
    headline: "本周现场主管承接 2 项异常、1 项升级，先看王敏 / 迟到 21 分钟。",
    totalOwnerCount: 2,
    totalExceptionCount: 2,
    highPriorityCount: 1,
    escalationCount: 1,
    totalImpactHours: 5.35,
    topOwner: {
      ownerRole: "现场主管",
      exceptionCount: 2,
      highPriorityCount: 1,
      escalationCount: 1,
      blockedEvidenceCount: 6,
      impactHours: 5.35,
      affectedPeople: ["刘晨", "王敏"],
      affectedDays: ["周一 05/11"],
      affectedGroups: ["供应商 A"],
      nextDrilldown: {
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
        exceptionKey: "A-1002::late_login",
        reason: "先看王敏的迟到 21 分钟，现场主管需补 3 项证据。",
      },
      reason: "2 项异常 / 1 项高优 / 1 项升级 / 阻塞证据 6 项 / 影响 5.35h",
    },
    owners: [
      {
        ownerRole: "现场主管",
        exceptionCount: 2,
        highPriorityCount: 1,
        escalationCount: 1,
        blockedEvidenceCount: 6,
        impactHours: 5.35,
        affectedPeople: ["刘晨", "王敏"],
        affectedDays: ["周一 05/11"],
        affectedGroups: ["供应商 A"],
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1002::late_login",
          reason: "先看王敏的迟到 21 分钟，现场主管需补 3 项证据。",
        },
        reason: "2 项异常 / 1 项高优 / 1 项升级 / 阻塞证据 6 项 / 影响 5.35h",
      },
      {
        ownerRole: "数据管理员",
        exceptionCount: 1,
        highPriorityCount: 1,
        escalationCount: 1,
        blockedEvidenceCount: 3,
        impactHours: 0.35,
        affectedPeople: ["王敏"],
        affectedDays: ["周一 05/11"],
        affectedGroups: ["供应商 A"],
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1002::late_login",
          reason: "先看王敏的迟到 21 分钟，数据管理员需补 3 项证据。",
        },
        reason: "1 项异常 / 1 项高优 / 1 项升级 / 阻塞证据 3 项 / 影响 0.35h",
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.weeklySourcePressureSummary, {
    headline: "本周登录轨道有 1 项异常、1 项升级，先看王敏 / 迟到 21 分钟。",
    totalSourceCount: 2,
    totalExceptionCount: 2,
    highPriorityCount: 1,
    escalationCount: 1,
    totalImpactHours: 5.35,
    topSource: {
      track: "login",
      label: "登录轨道",
      exceptionCount: 1,
      highPriorityCount: 1,
      escalationCount: 1,
      impactHours: 0.35,
      affectedPeople: ["王敏"],
      affectedDays: ["周一 05/11"],
      affectedGroups: ["供应商 A"],
      blockedEvidenceCount: 3,
      nextDrilldown: {
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
        exceptionKey: "A-1002::late_login",
        reason: "先看王敏的迟到 21 分钟，核对登录轨道。",
      },
      reason: "1 项异常 / 1 项高优 / 1 项升级 / 阻塞证据 3 项 / 影响 0.35h",
    },
    sources: [
      {
        track: "login",
        label: "登录轨道",
        exceptionCount: 1,
        highPriorityCount: 1,
        escalationCount: 1,
        impactHours: 0.35,
        affectedPeople: ["王敏"],
        affectedDays: ["周一 05/11"],
        affectedGroups: ["供应商 A"],
        blockedEvidenceCount: 3,
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1002::late_login",
          reason: "先看王敏的迟到 21 分钟，核对登录轨道。",
        },
        reason: "1 项异常 / 1 项高优 / 1 项升级 / 阻塞证据 3 项 / 影响 0.35h",
      },
      {
        track: "status",
        label: "状态轨道",
        exceptionCount: 1,
        highPriorityCount: 0,
        escalationCount: 0,
        impactHours: 5,
        affectedPeople: ["刘晨"],
        affectedDays: ["周一 05/11"],
        affectedGroups: ["供应商 A"],
        blockedEvidenceCount: 3,
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1001::no_login",
          reason: "先看刘晨的午后状态缺登录切片，核对状态轨道。",
        },
        reason: "1 项异常 / 0 项高优 / 0 项升级 / 阻塞证据 3 项 / 影响 5.00h",
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.weeklyReviewComparisonSummary, {
    headline: "本周先对齐登录轨道 / 现场主管 / 状态时间段重叠，闭环阻塞集中在待补材料。",
    comparisonCount: 3,
    escalationCount: 1,
    blockedDayCount: 1,
    openRiskCount: 2,
    topComparison: {
      key: "source_owner",
      label: "来源与责任对比",
      primary: "登录轨道",
      secondary: "现场主管",
      impact: "来源 1 项异常 / 责任 2 项异常 / 升级 1 项",
      reason: "登录轨道与现场主管都指向王敏 / 迟到 21 分钟。",
      nextDrilldown: {
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
        exceptionKey: "A-1002::late_login",
        reason: "先按登录轨道核对王敏的迟到 21 分钟。",
      },
    },
    items: [
      {
        key: "source_owner",
        label: "来源与责任对比",
        primary: "登录轨道",
        secondary: "现场主管",
        impact: "来源 1 项异常 / 责任 2 项异常 / 升级 1 项",
        reason: "登录轨道与现场主管都指向王敏 / 迟到 21 分钟。",
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1002::late_login",
          reason: "先按登录轨道核对王敏的迟到 21 分钟。",
        },
      },
      {
        key: "quality_readiness",
        label: "质量与闭环对比",
        primary: "状态时间段重叠",
        secondary: "待补材料",
        impact: "质量影响 5.00h / 阻塞 1 项 / 未就绪日 1 天",
        reason: "状态时间段重叠影响 1 项异常，闭环主要阻塞为待补材料。",
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1001::no_login",
          reason: "先看刘晨的午后状态缺登录切片，再进入 /data-quality/DQ-202605-010。",
        },
      },
      {
        key: "queue_decision",
        label: "队列与判断对比",
        primary: "供应商 A / 周一 05/11",
        secondary: "先复核供应商 A / 周一 05/11",
        impact: "待看 3 组 / 高优 1 组 / 开放风险 2 项",
        reason: "本周复核队列和决策摘要都先指向 A-1002 王敏。",
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "",
          reason: "先进入供应商 A / 周一 05/11，核对 A-1002 王敏。",
        },
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.weeklyClosureCloseoutSummary, {
    headline: "本周 6 天可推进闭环，周一 05/11 仍有 2 项未就绪，先补待补材料。",
    readyDayCount: 6,
    blockedDayCount: 1,
    missingMaterialCount: 1,
    missingDecisionCount: 1,
    openRiskCount: 2,
    topCloseout: {
      key: "blocked_day",
      label: "优先收口日",
      primary: "周一 05/11",
      secondary: "供应商 A",
      impact: "未就绪 2 项 / 待补材料 1 项 / 待主管判断 1 项",
      reason: "周一 05/11 仍有 2 项未就绪，优先回看供应商 A。",
      nextDrilldown: {
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
        exceptionKey: "",
        reason: "先进入供应商 A / 周一 05/11，补齐待补材料。",
      },
    },
    items: [
      {
        key: "blocked_day",
        label: "优先收口日",
        primary: "周一 05/11",
        secondary: "供应商 A",
        impact: "未就绪 2 项 / 待补材料 1 项 / 待主管判断 1 项",
        reason: "周一 05/11 仍有 2 项未就绪，优先回看供应商 A。",
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "",
          reason: "先进入供应商 A / 周一 05/11，补齐待补材料。",
        },
      },
      {
        key: "evidence_gap",
        label: "证据缺口收口",
        primary: "主管判断",
        secondary: "现场主管",
        impact: "证据缺口 4 项 / 主管判断 2 项 / 涉及 2 人",
        reason: "主管判断缺 2 项，先看供应商 A / 周一 05/11。",
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1002::late_login",
          reason: "先看王敏的迟到 21 分钟，补齐主管判断。",
        },
      },
      {
        key: "decision_risk",
        label: "判断风险收口",
        primary: "先复核供应商 A / 周一 05/11",
        secondary: "开放风险 2 项",
        impact: "建议判断 3 个 / 高把握 1 个 / 开放风险 2 项",
        reason: "优先判断 A-1002 王敏 是否影响当日履约。",
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "",
          reason: "进入供应商 A 的周一 05/11，先看 A-1002 王敏。",
        },
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.weeklyQaBoundarySummary, {
    headline: "本周 7 个主管看板均为查看依据，6 类生产能力仍需单独确认。",
    coveredPanelCount: 7,
    boundaryCount: 6,
    openRiskCount: 2,
    escalationCount: 1,
    topBoundary: {
      key: "review_write",
      label: "复核写入",
      status: "需单独确认",
      relatedPanel: "周度闭环收口摘要",
      reason: "当前展示建议结论、证据和风险，不形成处理记录。",
    },
    boundaries: [
      {
        key: "review_write",
        label: "复核写入",
        status: "需单独确认",
        relatedPanel: "周度闭环收口摘要",
        reason: "当前展示建议结论、证据和风险，不形成处理记录。",
      },
      {
        key: "evidence_upload",
        label: "补充证据",
        status: "需单独确认",
        relatedPanel: "周度闭环收口摘要",
        reason: "当前展示缺口和下钻建议，不接收文件或材料。",
      },
      {
        key: "approval_release",
        label: "审批发布",
        status: "需单独确认",
        relatedPanel: "周度复核对比摘要",
        reason: "当前展示复核对比和风险，不改变发布状态。",
      },
      {
        key: "permission_export",
        label: "权限与报表",
        status: "需单独确认",
        relatedPanel: "周度质量影响汇总",
        reason: "当前展示影响范围和质量线索，不生成报表文件或权限隔离。",
      },
      {
        key: "source_integration",
        label: "外部数据接入",
        status: "需单独确认",
        relatedPanel: "周度来源压力",
        reason: "当前展示来源轨道归因，不连接外部系统。",
      },
      {
        key: "production_records",
        label: "生产数据留存",
        status: "需单独确认",
        relatedPanel: "本周复核队列",
        reason: "当前展示队列和查看路径，不写入生产记录。",
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.supervisorWeeklyHandoffSummary, {
    headline: "本周需要向现场主管交接 2 项异常，开放问题 4 个。",
    totalItems: 2,
    openQuestionCount: 4,
    escalationItems: 1,
    topRecipient: {
      recipient: "现场主管",
      itemCount: 2,
      reason: "现场主管承接 2 项异常，开放问题 4 个。",
    },
    nextItem: {
      key: "上海职场||博西客服||供应商 A::2026-05-11::A-1002::late_login",
      groupId: "上海职场||博西客服||供应商 A",
      groupName: "供应商 A",
      date: "2026-05-11",
      label: "周一 05/11",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      recipient: "现场主管",
      nextTouchpoint: "班前到岗核对记录",
      reason: "需要升级 / 2 个待核对问题 / 班前到岗核对记录",
    },
    recipients: [
      {
        recipient: "现场主管",
        itemCount: 2,
        openQuestionCount: 4,
        escalationCount: 1,
        nextTouchpoint: "班前到岗核对记录",
        focus: "本周集中说明班前到岗核对记录，避免跨天重复追问。",
      },
    ],
    items: [
      {
        key: "上海职场||博西客服||供应商 A::2026-05-11::A-1002::late_login",
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        recipient: "现场主管",
        nextTouchpoint: "班前到岗核对记录",
        reason: "需要升级 / 2 个待核对问题 / 班前到岗核对记录",
      },
      {
        key: "上海职场||博西客服||供应商 A::2026-05-11::A-1001::no_login",
        groupId: "上海职场||博西客服||供应商 A",
        groupName: "供应商 A",
        date: "2026-05-11",
        label: "周一 05/11",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        recipient: "现场主管",
        nextTouchpoint: "状态轨道复核记录",
        reason: "接近超时 / 2 个待核对问题 / 状态轨道复核记录",
      },
    ],
  });
  assert.deepEqual(shanghaiTeam.teamEvidenceGapDistribution, {
    headline: "本周证据缺口集中在主管判断，共 2 项，涉及 2 人。",
    totalGapItems: 4,
    affectedPeopleCount: 2,
    topGap: {
      label: "主管判断",
      count: 2,
      affectedPeopleCount: 2,
      ownerRole: "现场主管",
      reason: "主管判断缺 2 项，先看供应商 A / 周一 05/11。",
    },
    gaps: [
      {
        key: "主管判断",
        label: "主管判断",
        count: 2,
        affectedPeopleCount: 2,
        ownerRole: "现场主管",
        representativePeople: ["A-1002 王敏", "A-1001 刘晨"],
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1002::late_login",
          reason: "先看王敏的迟到 21 分钟，补齐主管判断。",
        },
      },
      {
        key: "到岗说明",
        label: "到岗说明",
        count: 1,
        affectedPeopleCount: 1,
        ownerRole: "现场主管",
        representativePeople: ["A-1002 王敏"],
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1002::late_login",
          reason: "先看王敏的迟到 21 分钟，补齐到岗说明。",
        },
      },
      {
        key: "培训安排说明",
        label: "培训安排说明",
        count: 1,
        affectedPeopleCount: 1,
        ownerRole: "现场主管",
        representativePeople: ["A-1001 刘晨"],
        nextDrilldown: {
          groupId: "上海职场||博西客服||供应商 A",
          groupName: "供应商 A",
          date: "2026-05-11",
          label: "周一 05/11",
          exceptionKey: "A-1001::no_login",
          reason: "先看刘晨的午后状态缺登录切片，补齐培训安排说明。",
        },
      },
    ],
  });
  const closureTrendForExistingAssertions = {
    ...shanghaiTeam.closureReadinessTrend,
    points: shanghaiTeam.closureReadinessTrend.points.map((point) => {
      const pointForExistingAssertions = { ...point };
      delete pointForExistingAssertions.changeReason;
      delete pointForExistingAssertions.primaryBlocker;
      delete pointForExistingAssertions.breakdown;
      delete pointForExistingAssertions.nextViewHint;
      return pointForExistingAssertions;
    }),
  };

  assert.deepEqual(closureTrendForExistingAssertions, {
    headline: "本周闭环准备度周二 05/12 起转好，主要阻塞为待补材料。",
    readyDayCount: 6,
    blockedDayCount: 1,
    improvingDayCount: 1,
    decliningDayCount: 0,
    stableDayCount: 6,
    topBlocker: {
      key: "missing_material",
      label: "待补材料",
      count: 1,
      reason: "待补材料阻塞 1 项，先看供应商 A / 周一 05/11。",
    },
    nextReviewDay: {
      date: "2026-05-11",
      label: "周一 05/11",
      groupId: "上海职场||博西客服||供应商 A",
      groupName: "供应商 A",
      blockedCount: 2,
      reason: "周一 05/11 仍有 2 项未就绪，优先回看供应商 A。",
    },
    points: [
      {
        date: "2026-05-11",
        label: "周一 05/11",
        readyCount: 0,
        blockedCount: 2,
        missingMaterialCount: 1,
        missingDecisionCount: 1,
        dataCheckCount: 0,
        readinessScore: 0,
        direction: "持平",
        reason: "待补材料 1 项 / 待主管判断 1 项 / 需数据核对 0 项",
      },
      {
        date: "2026-05-12",
        label: "周二 05/12",
        readyCount: 0,
        blockedCount: 0,
        missingMaterialCount: 0,
        missingDecisionCount: 0,
        dataCheckCount: 0,
        readinessScore: 100,
        direction: "转好",
        reason: "当日暂无待闭环异常。",
      },
      {
        date: "2026-05-13",
        label: "周三 05/13",
        readyCount: 0,
        blockedCount: 0,
        missingMaterialCount: 0,
        missingDecisionCount: 0,
        dataCheckCount: 0,
        readinessScore: 100,
        direction: "持平",
        reason: "当日暂无待闭环异常。",
      },
      {
        date: "2026-05-14",
        label: "周四 05/14",
        readyCount: 0,
        blockedCount: 0,
        missingMaterialCount: 0,
        missingDecisionCount: 0,
        dataCheckCount: 0,
        readinessScore: 100,
        direction: "持平",
        reason: "当日暂无待闭环异常。",
      },
      {
        date: "2026-05-15",
        label: "周五 05/15",
        readyCount: 0,
        blockedCount: 0,
        missingMaterialCount: 0,
        missingDecisionCount: 0,
        dataCheckCount: 0,
        readinessScore: 100,
        direction: "持平",
        reason: "当日暂无待闭环异常。",
      },
      {
        date: "2026-05-16",
        label: "周六 05/16",
        readyCount: 0,
        blockedCount: 0,
        missingMaterialCount: 0,
        missingDecisionCount: 0,
        dataCheckCount: 0,
        readinessScore: 100,
        direction: "持平",
        reason: "当日暂无待闭环异常。",
      },
      {
        date: "2026-05-17",
        label: "周日 05/17",
        readyCount: 0,
        blockedCount: 0,
        missingMaterialCount: 0,
        missingDecisionCount: 0,
        dataCheckCount: 0,
        readinessScore: 100,
        direction: "持平",
        reason: "当日暂无待闭环异常。",
      },
    ],
  });

  assert.deepEqual(shanghaiTeam.closureReadinessTrend.points[0].primaryBlocker, {
    key: "missing_material",
    label: "待补材料",
    count: 1,
  });
  assert.equal(
    shanghaiTeam.closureReadinessTrend.points[0].changeReason,
    "首日基线：准备度 0，阻塞 2 项。"
  );
  assert.deepEqual(shanghaiTeam.closureReadinessTrend.points[0].breakdown, [
    { key: "missing_material", label: "待补材料", count: 1 },
    { key: "supervisor_decision", label: "待主管判断", count: 1 },
    { key: "data_check", label: "需数据核对", count: 0 },
  ]);
  assert.equal(
    shanghaiTeam.closureReadinessTrend.points[0].nextViewHint,
    "先回看周一 05/11 的待补材料，再确认主管判断和数据核对。"
  );
  assert.equal(
    shanghaiTeam.closureReadinessTrend.points[1].changeReason,
    "较前一日转好：准备度从 0 提升到 100，阻塞减少 2 项。"
  );
  assert.equal(shanghaiTeam.closureReadinessTrend.points[1].primaryBlocker, null);
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
  assert.deepEqual(matrix.dataQualityExceptionImpact, {
    headline: "当前 2 个数据质量问题关联 2 项异常，先看状态时间段重叠。",
    totalIssueCount: 2,
    impactedExceptionCount: 2,
    impactedPeopleCount: 2,
    totalImpactHours: 5.35,
    primaryIssue: {
      issueId: "DQ-202605-010",
      title: "状态时间段重叠",
      sourceLabel: "状态日志",
      severity: "high",
      status: "open",
      owner: "运营负责人",
      href: "/data-quality/DQ-202605-010",
      impactedExceptionCount: 1,
      impactedPeople: ["刘晨"],
      impactHours: 5,
      reason: "状态不一致需要核对状态日志切片是否会影响个人三轨解释。",
      recommendation: "拆分或修正重叠状态，避免非有效产能重复计算。",
      representativeExceptions: [
        {
          key: "A-1001::no_login",
          employeeId: "A-1001",
          employeeName: "刘晨",
          title: "午后状态缺登录切片",
          priority: "medium",
          reviewGroup: "待主管判断",
          impactHours: 5,
        },
      ],
    },
    issues: [
      {
        issueId: "DQ-202605-010",
        title: "状态时间段重叠",
        sourceLabel: "状态日志",
        severity: "high",
        status: "open",
        owner: "运营负责人",
        href: "/data-quality/DQ-202605-010",
        impactedExceptionCount: 1,
        impactedPeople: ["刘晨"],
        impactHours: 5,
        reason: "状态不一致需要核对状态日志切片是否会影响个人三轨解释。",
        recommendation: "拆分或修正重叠状态，避免非有效产能重复计算。",
        representativeExceptions: [
          {
            key: "A-1001::no_login",
            employeeId: "A-1001",
            employeeName: "刘晨",
            title: "午后状态缺登录切片",
            priority: "medium",
            reviewGroup: "待主管判断",
            impactHours: 5,
          },
        ],
      },
      {
        issueId: "DQ-202605-009",
        title: "登录员工不在主数据",
        sourceLabel: "登录日志",
        severity: "low",
        status: "ignored",
        owner: "现场主管",
        href: "/data-quality/DQ-202605-009",
        impactedExceptionCount: 1,
        impactedPeople: ["王敏"],
        impactHours: 0.35,
        reason: "登录缺口需要核对登录日志和人员主数据是否能支撑当日履约判断。",
        recommendation: "确认是否为临时账号；若需要计入履约，先补主数据。",
        representativeExceptions: [
          {
            key: "A-1002::late_login",
            employeeId: "A-1002",
            employeeName: "王敏",
            title: "迟到 21 分钟",
            priority: "high",
            reviewGroup: "需补材料",
            impactHours: 0.35,
          },
        ],
      },
    ],
  });
  assert.deepEqual(matrix.dataQualityImpactRanking, {
    headline: "优先处理 DQ-202605-010 状态时间段重叠，影响 5.00h 和 1 项异常。",
    totalRankedIssueCount: 2,
    highSeverityCount: 1,
    totalBlockedEvidenceCount: 6,
    leadIssue: {
      issueId: "DQ-202605-010",
      title: "状态时间段重叠",
      rank: 1,
      severity: "high",
      owner: "运营负责人",
      impactScore: 561,
      impactHours: 5,
      impactedExceptionCount: 1,
      impactedPeople: ["刘晨"],
      blockedEvidence: ["培训安排说明", "在线要求确认", "主管复核结论"],
      recommendedView: "先看刘晨的午后状态缺登录切片，再进入 /data-quality/DQ-202605-010。",
      businessReason: "影响 5.00h / 1 项异常 / 3 项证据阻塞 / high",
      href: "/data-quality/DQ-202605-010",
    },
    items: [
      {
        issueId: "DQ-202605-010",
        title: "状态时间段重叠",
        rank: 1,
        severity: "high",
        owner: "运营负责人",
        impactScore: 561,
        impactHours: 5,
        impactedExceptionCount: 1,
        impactedPeople: ["刘晨"],
        blockedEvidence: ["培训安排说明", "在线要求确认", "主管复核结论"],
        recommendedView: "先看刘晨的午后状态缺登录切片，再进入 /data-quality/DQ-202605-010。",
        businessReason: "影响 5.00h / 1 项异常 / 3 项证据阻塞 / high",
        href: "/data-quality/DQ-202605-010",
      },
      {
        issueId: "DQ-202605-009",
        title: "登录员工不在主数据",
        rank: 2,
        severity: "low",
        owner: "现场主管",
        impactScore: 92,
        impactHours: 0.35,
        impactedExceptionCount: 1,
        impactedPeople: ["王敏"],
        blockedEvidence: ["到岗说明", "迟到或漏登原因", "现场主管确认口径"],
        recommendedView: "先看王敏的迟到 21 分钟，再进入 /data-quality/DQ-202605-009。",
        businessReason: "影响 0.35h / 1 项异常 / 3 项证据阻塞 / low",
        href: "/data-quality/DQ-202605-009",
      },
    ],
  });
  assert.deepEqual(matrix.exceptionImpactPriority, {
    headline: "优先查看刘晨 / 午后状态缺登录切片，影响 5.00h，涉及 3 个对象。",
    totalImpactHours: 5.35,
    blockedItemCount: 2,
    topItem: {
      key: "A-1001::no_login",
      employeeId: "A-1001",
      employeeName: "刘晨",
      title: "午后状态缺登录切片",
      priority: "medium",
      reviewGroup: "待主管判断",
      agingLevel: "接近超时",
      impactHours: 5,
      impactedObjects: ["刘晨", "状态轨道", "2026-05-11 小组矩阵"],
      impactedComparisons: ["排班 vs 状态", "当日异常人数"],
      blockerCount: 2,
      priorityReason: "影响 5.00h / 2 个影响对比 / 待补 2 项 / 接近超时",
      excludedScope: "不影响登录原始时长、班次类型和需求预测版本。",
    },
    items: [
      {
        key: "A-1001::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        priority: "medium",
        reviewGroup: "待主管判断",
        agingLevel: "接近超时",
        impactHours: 5,
        impactedObjects: ["刘晨", "状态轨道", "2026-05-11 小组矩阵"],
        impactedComparisons: ["排班 vs 状态", "当日异常人数"],
        blockerCount: 2,
        priorityReason: "影响 5.00h / 2 个影响对比 / 待补 2 项 / 接近超时",
        excludedScope: "不影响登录原始时长、班次类型和需求预测版本。",
      },
      {
        key: "A-1002::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        priority: "high",
        reviewGroup: "需补材料",
        agingLevel: "需要升级",
        impactHours: 0.35,
        impactedObjects: ["王敏", "早班", "2026-05-11 小组矩阵"],
        impactedComparisons: ["排班 vs 登录", "当日履约缺口"],
        blockerCount: 2,
        priorityReason: "影响 0.35h / 2 个影响对比 / 待补 2 项 / 需要升级",
        excludedScope: "不影响班次类型、供应商绑定和需求预测版本。",
      },
    ],
  });
  assert.deepEqual(matrix.supervisorPrioritySummary, {
    headline: "优先查看王敏 / 迟到 21 分钟：高优异常且需要升级，先补 2 项材料。",
    totalImpactHours: 5.35,
    highPriorityCount: 1,
    blockedCount: 2,
    escalationCount: 1,
    focusReasons: ["高优异常 1 项", "升级关注 1 项", "闭环阻塞 2 项", "总影响 5.35h"],
    topFocus: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      priority: "high",
      reviewGroup: "需补材料",
      agingLevel: "需要升级",
      impactHours: 0.35,
      blockerCount: 2,
      focusReason: "高优 / 需要升级 / 待补 2 项 / 影响 0.35h",
      impactScope: "王敏 / 早班 / 2026-05-11 小组矩阵",
      nextView: "先核对到岗说明、迟到或漏登原因、现场主管确认口径。",
    },
    orderedItems: [
      {
        key: "A-1002::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        priority: "high",
        reviewGroup: "需补材料",
        agingLevel: "需要升级",
        impactHours: 0.35,
        blockerCount: 2,
        focusReason: "高优 / 需要升级 / 待补 2 项 / 影响 0.35h",
        impactScope: "王敏 / 早班 / 2026-05-11 小组矩阵",
        nextView: "先核对到岗说明、迟到或漏登原因、现场主管确认口径。",
      },
      {
        key: "A-1001::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        priority: "medium",
        reviewGroup: "待主管判断",
        agingLevel: "接近超时",
        impactHours: 5,
        blockerCount: 2,
        focusReason: "中优 / 接近超时 / 待补 2 项 / 影响 5.00h",
        impactScope: "刘晨 / 状态轨道 / 2026-05-11 小组矩阵",
        nextView: "先核对培训安排说明、在线要求确认、主管复核结论。",
      },
    ],
  });
  assert.deepEqual(matrix.handlingReadinessNarrative, {
    headline: "王敏 / 迟到 21 分钟还缺到岗说明、迟到或漏登原因、现场主管确认口径，先补材料再判断。",
    readyCount: 5,
    blockedCount: 4,
    evidenceLineCount: 6,
    preparationSteps: [
      "先补到岗说明、迟到或漏登原因、现场主管确认口径。",
      "再核对排班开始时间 09:00 / 核对登录开始时间 09:21 / 确认员工实际到岗时间。",
      "最后回看影响范围：王敏 / 早班 / 2026-05-11 小组矩阵。",
    ],
    leadItem: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      readiness: "已齐 2 项 / 待补 2 项",
      blockerReason: "缺少到岗说明、迟到或漏登原因、现场主管确认口径。",
      evidenceStatus:
        "排班 SCH-1002-1：早班 09:00-17:00 / 登录 LOG-1002-1：CORN 登录 09:21-17:00 / 状态轨道：无命中记录",
      impactScope: "王敏 / 早班 / 2026-05-11 小组矩阵",
      nextView: "先查看王敏的到岗说明和 2026-05-11 个人三轨详情。",
    },
    items: [
      {
        key: "A-1002::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        readiness: "已齐 2 项 / 待补 2 项",
        blockerReason: "缺少到岗说明、迟到或漏登原因、现场主管确认口径。",
        evidenceStatus:
          "排班 SCH-1002-1：早班 09:00-17:00 / 登录 LOG-1002-1：CORN 登录 09:21-17:00 / 状态轨道：无命中记录",
        impactScope: "王敏 / 早班 / 2026-05-11 小组矩阵",
        nextView: "先查看王敏的到岗说明和 2026-05-11 个人三轨详情。",
      },
      {
        key: "A-1001::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        readiness: "已齐 3 项 / 待补 2 项",
        blockerReason: "缺少培训安排说明、在线要求确认、主管复核结论。",
        evidenceStatus:
          "排班 SCH-1001-2：午后班 13:00-18:00 / 登录 LOG-1001-1：CORN 登录 09:02-18:00 / 状态 STA-1001-2：培训 13:00-18:00",
        impactScope: "刘晨 / 状态轨道 / 2026-05-11 小组矩阵",
        nextView: "先查看刘晨的培训安排说明和 2026-05-11 个人三轨详情。",
      },
    ],
  });
  assert.deepEqual(matrix.supervisorDecisionDigest, {
    headline: "当前 2 项异常均有待确认判断，先看王敏 / 迟到 21 分钟。",
    totalDecisionCount: 2,
    mediumConfidenceCount: 2,
    openRiskCount: 2,
    nextReviewPoint: "2026-05-11 10:00",
    leadDecision: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      suggestedOutcome: "待确认到岗：王敏 09:00-09:21 登录缺口，需补到岗说明。",
      confidence: "中",
      readiness: "已齐 2 项 / 待补 2 项",
      openRisk: "缺少到岗说明会影响当日履约缺口判断。",
      nextReviewPoint: "2026-05-11 10:00",
      sourceReferences: ["SCH-1002-1", "LOG-1002-1", "DQ-202605-009"],
      decisionReason: "中可信 / 待补 2 项 / 风险：缺少到岗说明会影响当日履约缺口判断。",
    },
    decisions: [
      {
        key: "A-1002::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        suggestedOutcome: "待确认到岗：王敏 09:00-09:21 登录缺口，需补到岗说明。",
        confidence: "中",
        readiness: "已齐 2 项 / 待补 2 项",
        openRisk: "缺少到岗说明会影响当日履约缺口判断。",
        nextReviewPoint: "2026-05-11 10:00",
        sourceReferences: ["SCH-1002-1", "LOG-1002-1", "DQ-202605-009"],
        decisionReason: "中可信 / 待补 2 项 / 风险：缺少到岗说明会影响当日履约缺口判断。",
      },
      {
        key: "A-1001::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        suggestedOutcome: "待确认状态：刘晨 13:00-18:00 状态为培训，需补培训安排说明。",
        confidence: "中",
        readiness: "已齐 3 项 / 待补 2 项",
        openRisk: "缺少培训安排说明会影响状态是否计入当班履约。",
        nextReviewPoint: "2026-05-11 15:00",
        sourceReferences: ["SCH-1001-2", "LOG-1001-1", "STA-1001-2", "DQ-202605-010"],
        decisionReason: "中可信 / 待补 2 项 / 风险：缺少培训安排说明会影响状态是否计入当班履约。",
      },
    ],
  });
  assert.deepEqual(matrix.closureRiskExplanation, {
    headline: "当前 2 项异常存在闭环风险，先解释王敏 / 迟到 21 分钟的 2 项阻塞。",
    totalRiskCount: 2,
    highImpactRiskCount: 1,
    nextRiskOwner: "现场主管",
    leadRisk: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      cannotCloseReason: "仍缺到岗说明、迟到或漏登原因、现场主管确认口径，不能形成当日履约缺口闭环。",
      businessImpact: "缺少到岗说明会影响当日履约缺口判断。",
      missingEvidence: ["到岗说明", "迟到或漏登原因", "现场主管确认口径"],
      ownerRole: "现场主管",
      nextStep: "先查看王敏的到岗说明和 2026-05-11 个人三轨详情。",
      riskLevel: "高",
      readiness: "已齐 2 项 / 待补 2 项",
      impactHours: 0.35,
      sourceReferences: ["SCH-1002-1", "LOG-1002-1", "DQ-202605-009"],
      riskReason: "高优先 / 待补 2 项 / 影响 0.35h / 风险：缺少到岗说明会影响当日履约缺口判断。",
    },
    risks: [
      {
        key: "A-1002::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        cannotCloseReason: "仍缺到岗说明、迟到或漏登原因、现场主管确认口径，不能形成当日履约缺口闭环。",
        businessImpact: "缺少到岗说明会影响当日履约缺口判断。",
        missingEvidence: ["到岗说明", "迟到或漏登原因", "现场主管确认口径"],
        ownerRole: "现场主管",
        nextStep: "先查看王敏的到岗说明和 2026-05-11 个人三轨详情。",
        riskLevel: "高",
        readiness: "已齐 2 项 / 待补 2 项",
        impactHours: 0.35,
        sourceReferences: ["SCH-1002-1", "LOG-1002-1", "DQ-202605-009"],
        riskReason: "高优先 / 待补 2 项 / 影响 0.35h / 风险：缺少到岗说明会影响当日履约缺口判断。",
      },
      {
        key: "A-1001::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        cannotCloseReason: "仍缺培训安排说明、在线要求确认、主管复核结论，不能形成当日状态异常闭环。",
        businessImpact: "缺少培训安排说明会影响状态是否计入当班履约。",
        missingEvidence: ["培训安排说明", "在线要求确认", "主管复核结论"],
        ownerRole: "现场主管",
        nextStep: "先查看刘晨的培训安排说明和 2026-05-11 个人三轨详情。",
        riskLevel: "中",
        readiness: "已齐 3 项 / 待补 2 项",
        impactHours: 5,
        sourceReferences: ["SCH-1001-2", "LOG-1001-1", "STA-1001-2", "DQ-202605-010"],
        riskReason: "中优先 / 待补 2 项 / 影响 5.00h / 风险：缺少培训安排说明会影响状态是否计入当班履约。",
      },
    ],
  });
  assert.deepEqual(matrix.closureReviewSummary, {
    headline: "当前 0 项可闭环、2 项待复核，先复核王敏 / 迟到 21 分钟。",
    readyToCloseCount: 0,
    pendingReviewCount: 2,
    blockedCount: 2,
    nextReviewer: "现场主管",
    leadReview: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      reviewStatus: "需补材料",
      suggestedConclusion: "待确认到岗：王敏 09:00-09:21 登录缺口，需补到岗说明。",
      readiness: "已齐 2 项 / 待补 2 项",
      blockerSummary: "缺少到岗说明、迟到或漏登原因、现场主管确认口径。",
      evidenceSummary:
        "排班 SCH-1002-1：早班 09:00-17:00 / 登录 LOG-1002-1：CORN 登录 09:21-17:00 / 状态轨道：无命中记录",
      riskSummary: "缺少到岗说明会影响当日履约缺口判断。",
      nextAction: "先补到岗说明，再回看王敏 2026-05-11 个人三轨详情。",
      sourceReferences: ["SCH-1002-1", "LOG-1002-1", "DQ-202605-009"],
    },
    reviews: [
      {
        key: "A-1002::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        title: "迟到 21 分钟",
        reviewStatus: "需补材料",
        suggestedConclusion: "待确认到岗：王敏 09:00-09:21 登录缺口，需补到岗说明。",
        readiness: "已齐 2 项 / 待补 2 项",
        blockerSummary: "缺少到岗说明、迟到或漏登原因、现场主管确认口径。",
        evidenceSummary:
          "排班 SCH-1002-1：早班 09:00-17:00 / 登录 LOG-1002-1：CORN 登录 09:21-17:00 / 状态轨道：无命中记录",
        riskSummary: "缺少到岗说明会影响当日履约缺口判断。",
        nextAction: "先补到岗说明，再回看王敏 2026-05-11 个人三轨详情。",
        sourceReferences: ["SCH-1002-1", "LOG-1002-1", "DQ-202605-009"],
      },
      {
        key: "A-1001::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        title: "午后状态缺登录切片",
        reviewStatus: "待主管判断",
        suggestedConclusion: "待确认状态：刘晨 13:00-18:00 状态为培训，需补培训安排说明。",
        readiness: "已齐 3 项 / 待补 2 项",
        blockerSummary: "缺少培训安排说明、在线要求确认、主管复核结论。",
        evidenceSummary:
          "排班 SCH-1001-2：午后班 13:00-18:00 / 登录 LOG-1001-1：CORN 登录 09:02-18:00 / 状态 STA-1001-2：培训 13:00-18:00",
        riskSummary: "缺少培训安排说明会影响状态是否计入当班履约。",
        nextAction: "先补培训安排说明，再回看刘晨 2026-05-11 个人三轨详情。",
        sourceReferences: ["SCH-1001-2", "LOG-1001-1", "STA-1001-2", "DQ-202605-010"],
      },
    ],
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
  assert.deepEqual(matrix.supervisorHandoffOverview, {
    totalHandoffItems: 2,
    openQuestionCount: 4,
    escalationItems: 1,
    topRecipient: {
      recipient: "现场主管",
      itemCount: 2,
      reason: "现场主管有 2 项需要交接，仍有 4 个待核对问题。",
    },
    nextHandoff: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      recipient: "现场主管",
      reason: "需要升级 / 2 个待核对问题 / 班前到岗核对记录",
    },
    recipients: [
      {
        recipient: "现场主管",
        itemCount: 2,
        highPriorityCount: 1,
        agingWatchCount: 2,
        escalationCount: 1,
        openQuestionCount: 4,
        nextTouchpoint: "班前到岗核对记录",
        focus: "集中说明待核对问题和下一触点，避免交接后重复追问。",
      },
    ],
  });
  assert.deepEqual(matrix.teamDayRiskDigest, {
    riskLevel: "高",
    riskScore: 86,
    headline: "当日高风险：登录轨道与状态轨道同时存在异常，先看王敏。",
    primaryRisk: {
      label: "建议升级",
      reason: "1 项异常已达到升级关注，2 项仍在超时关注。",
    },
    nextFocus: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      reason: "需要升级 / 登录轨道 / 2 个待核对问题",
    },
    signals: [
      {
        label: "待关注异常",
        value: "2项",
        tone: "high",
        reason: "其中 1 项高优先，影响 5.35h。",
      },
      {
        label: "超时关注",
        value: "2项",
        tone: "high",
        reason: "1 项建议升级。",
      },
      {
        label: "主要来源",
        value: "登录轨道",
        tone: "high",
        reason: "登录轨道有 1 项异常。",
      },
      {
        label: "交接压力",
        value: "4问",
        tone: "medium",
        reason: "现场主管有 2 项需要交接。",
      },
    ],
  });
  assert.deepEqual(matrix.teamDayRiskTrend, {
    direction: "下降",
    headline: "本周风险从周一高位回落，当前日仍是最高风险日。",
    currentDay: {
      date: "2026-05-11",
      label: "周一 05/11",
      score: 100,
      riskLevel: "高",
      gapPeople: 2,
      anomalyPeople: 2,
    },
    comparison: {
      label: "较下一有排班日",
      scoreDelta: 80,
      summary: "比周二高 80 分，缺口多 1 人，异常多 2 人。",
    },
    highestRiskDay: {
      date: "2026-05-11",
      label: "周一 05/11",
      score: 100,
      reason: "缺口 2 人 / 异常 2 人",
    },
    nextFocus: {
      date: "2026-05-11",
      label: "周一 05/11",
      reason: "先处理周一 2 项异常，避免高风险日悬空。",
    },
    points: [
      {
        date: "2026-05-11",
        label: "周一 05/11",
        score: 100,
        riskLevel: "高",
        gapPeople: 2,
        anomalyPeople: 2,
      },
      {
        date: "2026-05-12",
        label: "周二 05/12",
        score: 20,
        riskLevel: "低",
        gapPeople: 1,
        anomalyPeople: 0,
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
  assert.deepEqual(lateLogin.communicationContext, {
    audience: "王敏 / 现场主管",
    purpose: "确认王敏 09:00-09:21 登录缺口的到岗事实和迟到原因。",
    keyMessages: [
      "排班 09:00 开始，登录 09:21 开始，存在 21 分钟缺口。",
      "当前影响 0.35h，已达到需要升级关注。",
      "需补到岗说明、迟到或漏登原因和现场主管确认口径。",
    ],
    evidenceToReference: [
      "排班 SCH-1002-1：早班 09:00-17:00",
      "登录 LOG-1002-1：CORN 登录 09:21-17:00",
    ],
    openQuestions: ["是否实际到岗但漏登", "迟到原因是否已说明"],
    nextConversation: "2026-05-11 10:00 前和现场主管确认到岗说明。",
  });
  assert.deepEqual(lateLogin.followUpTimeline, [
    {
      stage: "识别",
      time: "2026-05-11 09:22",
      owner: "系统识别",
      summary: "迟到 21 分钟，影响 0.35h。",
      status: "已完成",
    },
    {
      stage: "已跟进",
      time: "2026-05-11 09:35",
      owner: "现场主管",
      summary: "已联系员工确认到岗时间。等待补充迟到或漏登原因。",
      status: "已完成",
    },
    {
      stage: "当前卡点",
      time: "2026-05-11 09:35",
      owner: "现场主管",
      summary: "待补说明：需补到岗说明、迟到或漏登原因。",
      status: "进行中",
    },
    {
      stage: "下一复核",
      time: "2026-05-11 10:00",
      owner: "现场主管",
      summary: "确认王敏实际到岗时间和迟到原因。",
      status: "待查看",
    },
  ]);
  assert.deepEqual(lateLogin.exceptionComparison, {
    rankLabel: "第 1 / 2 项",
    priorityReason: "王敏为高优先级，且已达到需要升级。",
    comparedWith: {
      key: "A-1001::no_login",
      employeeId: "A-1001",
      employeeName: "刘晨",
      title: "午后状态缺登录切片",
      priority: "medium",
      reviewGroup: "待主管判断",
      agingLevel: "接近超时",
      impactHours: 5,
    },
    mainDifference: "当前异常优先级更高；对比异常影响时长多 4.65h，但尚未达到升级关注。",
    focusHint: "先补王敏到岗说明，再回看刘晨培训状态是否符合在线要求。",
  });
  assert.deepEqual(lateLogin.ownerLoadComparison, {
    currentOwner: {
      ownerRole: "现场主管",
      itemCount: 2,
      highPriorityCount: 1,
      escalationCount: 1,
      impactHours: 5.35,
      focus: "补充到岗、培训安排和主管判断材料。",
    },
    busiestOwner: {
      ownerRole: "现场主管",
      itemCount: 2,
      reason: "现场主管今日有 2 项待关注，其中 1 项建议升级。",
    },
    comparedOwner: {
      ownerRole: "数据管理员",
      itemCount: 1,
      impactHours: 0.35,
      reason: "比现场主管少 1 项，影响少 5.00h。",
    },
    loadDifference: "现场主管是当前最高负载角色，比数据管理员多 1 项，影响多 5.00h。",
    focusOrder: "先由现场主管补王敏到岗说明，再让数据管理员核对原始登录记录。",
  });
  assert.deepEqual(lateLogin.nextDayWatchlist, {
    date: "2026-05-12",
    label: "周二 05/12",
    headline: "明天先看周二 05/12 的登录缺口和今日未闭环异常。",
    items: [
      {
        key: "A-1002::2026-05-12::late_login",
        employeeId: "A-1002",
        employeeName: "王敏",
        priority: "high",
        ownerRole: "现场主管",
        source: "今日异常：迟到 21 分钟",
        reason: "今日需要升级且明天仍有 0.1h 登录缺口，先确认到岗说明是否补齐。",
        orderLabel: "第 1 项",
      },
      {
        key: "A-1001::2026-05-12::no_login",
        employeeId: "A-1001",
        employeeName: "刘晨",
        priority: "medium",
        ownerRole: "现场主管",
        source: "今日异常：午后状态缺登录切片",
        reason: "今日状态判断未闭环，明天复核培训安排是否仍影响在线要求。",
        orderLabel: "第 2 项",
      },
    ],
  });
  assert.deepEqual(matrix.groupRiskCauseSplit, {
    headline: "当前小组风险主要来自状态安排不一致，其次是登录到岗偏差。",
    totalImpactHours: 5.35,
    causes: [
      {
        key: "status_alignment",
        label: "状态安排不一致",
        itemCount: 1,
        peopleCount: 1,
        impactHours: 5,
        share: 93,
        representative: "A-1001 刘晨 / 午后状态缺登录切片",
        focus: "先确认培训安排是否应计入在线要求。",
      },
      {
        key: "login_attendance",
        label: "登录到岗偏差",
        itemCount: 1,
        peopleCount: 1,
        impactHours: 0.35,
        share: 7,
        representative: "A-1002 王敏 / 迟到 21 分钟",
        focus: "先核对到岗说明和原始登录开始时间。",
      },
    ],
  });
  assert.deepEqual(matrix.teamWeekCarryoverOverview, {
    headline: "周一未闭环后，周二仍有 1 人登录缺口需要延续查看。",
    carryoverDays: 1,
    items: [
      {
        date: "2026-05-12",
        label: "周二 05/12",
        gapPeople: 1,
        anomalyPeople: 0,
        reviewTarget: "A-1002 王敏",
        reason: "周二仍有 1 人登录缺口，需回看今日到岗问题是否连续。",
        orderLabel: "第 1 天",
      },
    ],
  });
  assert.deepEqual(matrix.exceptionClosureReadinessSummary, {
    headline: "当前 2 项异常均未达到闭环条件，优先补齐主管判断和到岗说明。",
    readyCount: 0,
    blockedCount: 2,
    missingMaterialCount: 1,
    missingDecisionCount: 1,
    dataCheckCount: 0,
    nextCandidate: {
      key: "A-1002::late_login",
      employeeId: "A-1002",
      employeeName: "王敏",
      title: "迟到 21 分钟",
      readiness: "待补材料",
      reason: "缺少到岗说明、迟到或漏登原因、现场主管确认口径。",
    },
    blockers: [
      {
        key: "missing_material",
        label: "待补材料",
        count: 1,
        reason: "王敏仍需补到岗说明、迟到或漏登原因、现场主管确认口径。",
        evidenceItems: [
          {
            key: "A-1002::late_login::到岗说明",
            employeeId: "A-1002",
            employeeName: "王敏",
            title: "到岗说明",
            ownerRole: "现场主管",
            status: "需补充",
            sourceRecords: ["SCH-1002-1", "LOG-1002-1"],
            currentEvidence: "已有关联证据：SCH-1002-1 / LOG-1002-1",
            nextView: "查看王敏的个人单日三轨详情。",
          },
          {
            key: "A-1002::late_login::主管判断",
            employeeId: "A-1002",
            employeeName: "王敏",
            title: "主管判断",
            ownerRole: "现场主管",
            status: "待确认",
            sourceRecords: ["SCH-1002-1", "LOG-1002-1"],
            currentEvidence: "已有关联证据：SCH-1002-1 / LOG-1002-1",
            nextView: "查看王敏的个人单日三轨详情。",
          },
        ],
      },
      {
        key: "supervisor_judgment",
        label: "待主管判断",
        count: 1,
        reason: "刘晨仍需确认培训安排是否符合在线要求。",
        evidenceItems: [
          {
            key: "A-1001::no_login::培训安排说明",
            employeeId: "A-1001",
            employeeName: "刘晨",
            title: "培训安排说明",
            ownerRole: "现场主管",
            status: "需补充",
            sourceRecords: ["SCH-1001-2", "LOG-1001-1", "STA-1001-2"],
            currentEvidence: "已有关联证据：SCH-1001-2 / LOG-1001-1 / STA-1001-2",
            nextView: "查看刘晨的个人单日三轨详情。",
          },
          {
            key: "A-1001::no_login::主管判断",
            employeeId: "A-1001",
            employeeName: "刘晨",
            title: "主管判断",
            ownerRole: "现场主管",
            status: "待确认",
            sourceRecords: ["SCH-1001-2", "LOG-1001-1", "STA-1001-2"],
            currentEvidence: "已有关联证据：SCH-1001-2 / LOG-1001-1 / STA-1001-2",
            nextView: "查看刘晨的个人单日三轨详情。",
          },
        ],
      },
    ],
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
  assert.deepEqual(lateLogin.reviewOutcomePreview, {
    suggestedOutcome: "待确认到岗：王敏 09:00-09:21 登录缺口，需补到岗说明。",
    confidence: "中",
    evidenceSummary: [
      "排班 SCH-1002-1：早班 09:00-17:00",
      "登录 LOG-1002-1：CORN 登录 09:21-17:00",
      "状态轨道：无命中记录",
    ],
    openRisk: "缺少到岗说明会影响当日履约缺口判断。",
    nextReviewPoint: "2026-05-11 10:00",
    sourceReferences: ["SCH-1002-1", "LOG-1002-1", "DQ-202605-009"],
    readiness: "已齐 2 项 / 待补 2 项",
    boundary: "仅作为主管复核前的结论预览，不形成处理记录。",
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
