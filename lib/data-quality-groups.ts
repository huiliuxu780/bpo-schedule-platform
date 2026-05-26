import type { DataQualityIssue } from "./data-quality"

export type DataQualityGroupRisk = "high" | "medium" | "low"

export type DataQualityGroup = {
  id: string
  title: string
  description: string
  risk: DataQualityGroupRisk
  owner: string
  sourceTemplates: string[]
  traceKeys: string[]
  issueIds: string[]
  recommendedReview: string
  deferredActions: string[]
}

export type DataQualityGroupSummary = {
  totalGroups: number
  totalIssues: number
  highRiskGroups: number
  sourceTemplateCount: number
  groupedIssueCount: number
  deferredActions: string[]
}

export type DataQualityIssueGroupCoverage = {
  issueId: string
  groups: DataQualityGroup[]
}

export type DataQualityReviewGroupLinkItem = {
  groupId: string
  title: string
  risk: DataQualityGroupRisk
  owner: string
  issueCount: number
  sourceTemplates: string[]
  traceKeys: string[]
  href: string
  recommendedReview: string
}

export type DataQualityReviewGroupLinkSummary = {
  representativeIssueId?: string
  totalMatchedGroupCount: number
  ungroupedIssueCount: number
  groupedIssueCount: number
  topGroup?: DataQualityReviewGroupLinkItem
  items: DataQualityReviewGroupLinkItem[]
  nextViewHint: string
  deferredActions: string[]
}

export type DataQualityGroupExceptionCoverageItem = {
  groupId: string
  title: string
  risk: DataQualityGroupRisk
  owner: string
  issueCount: number
  impactedIssueCount: number
  impactedExceptionCount: number
  impactedPeople: string[]
  blockedRows: number
  affectedObjects: string[]
  sourceTemplates: string[]
  traceKeys: string[]
  representativeIssueId: string
  representativeIssueTitle: string
  href: string
  nextViewHint: string
}

export type DataQualityGroupExceptionCoverageSummary = {
  totalGroupCount: number
  totalImpactedGroupCount: number
  totalImpactedExceptionCount: number
  totalImpactedPeopleCount: number
  totalBlockedRows: number
  topGroup?: DataQualityGroupExceptionCoverageItem
  items: DataQualityGroupExceptionCoverageItem[]
  nextViewHint: string
  deferredActions: string[]
}

export type DataQualityGroupReviewSequenceStep = {
  sequence: number
  groupId: string
  title: string
  risk: DataQualityGroupRisk
  owner: string
  representativeIssueId: string
  representativeIssueTitle: string
  impactedExceptionCount: number
  impactedPeople: string[]
  blockedRows: number
  href: string
  nextViewHint: string
}

export type DataQualityGroupReviewSequenceSummary = {
  stepCount: number
  headline: string
  firstStep?: DataQualityGroupReviewSequenceStep
  steps: DataQualityGroupReviewSequenceStep[]
  nextViewHint: string
  deferredActions: string[]
}

export type DataQualityGroupStepImpactDrilldownItem = {
  sequence: number
  groupId: string
  title: string
  risk: DataQualityGroupRisk
  owner: string
  representativeIssueId: string
  representativeIssueTitle: string
  issueHref: string
  personHref?: string
  impactedPeople: string[]
  affectedObjects: string[]
  nextViewHint: string
}

export type DataQualityGroupStepImpactDrilldownSummary = {
  stepCount: number
  totalImpactedPeopleCount: number
  firstItem?: DataQualityGroupStepImpactDrilldownItem
  items: DataQualityGroupStepImpactDrilldownItem[]
  nextViewHint: string
  deferredActions: string[]
}

export type DataQualityGroupStepOwnerLoadItem = {
  owner: string
  firstSequence: number
  stepCount: number
  impactedPeople: string[]
  groupTitles: string[]
  representativeIssueId: string
  representativeIssueTitle: string
  issueHref: string
  personHref?: string
  nextViewHint: string
}

export type DataQualityGroupStepOwnerLoadSummary = {
  ownerCount: number
  totalStepCount: number
  totalImpactedPeopleCount: number
  topOwner?: DataQualityGroupStepOwnerLoadItem
  items: DataQualityGroupStepOwnerLoadItem[]
  nextViewHint: string
  deferredActions: string[]
}

export type DataQualityGroupStepOwnerReviewQueueItem = {
  rank: number
  owner: string
  stepCount: number
  impactedPeople: string[]
  primaryPerson?: string
  groupTitles: string[]
  representativeIssueId: string
  representativeIssueTitle: string
  issueHref: string
  personHref?: string
  queueReason: string
  nextViewHint: string
}

export type DataQualityGroupStepOwnerReviewQueueSummary = {
  queueCount: number
  totalStepCount: number
  totalImpactedPeopleCount: number
  firstItem?: DataQualityGroupStepOwnerReviewQueueItem
  items: DataQualityGroupStepOwnerReviewQueueItem[]
  nextViewHint: string
  deferredActions: string[]
}

export type DataQualityGroupStepOwnerHandoffBriefItem = {
  owner: string
  representativeIssueId: string
  representativeIssueTitle: string
  primaryPerson?: string
  groupTitles: string[]
  issueHref: string
  personHref?: string
  impactedPeople: string[]
  handoffPoints: string[]
  nextViewHint: string
}

export type DataQualityGroupStepOwnerHandoffBriefSummary = {
  handoffCount: number
  totalImpactedPeopleCount: number
  firstItem?: DataQualityGroupStepOwnerHandoffBriefItem
  items: DataQualityGroupStepOwnerHandoffBriefItem[]
  nextViewHint: string
  deferredActions: string[]
}

export type DataQualityGroupStepOwnerHandoffRiskItem = {
  owner: string
  representativeIssueId: string
  representativeIssueTitle: string
  primaryPerson?: string
  groupTitles: string[]
  issueHref: string
  personHref?: string
  impactedPeople: string[]
  riskReasons: string[]
  nextViewHint: string
}

export type DataQualityGroupStepOwnerHandoffRiskSummary = {
  riskCount: number
  totalImpactedPeopleCount: number
  topRisk?: DataQualityGroupStepOwnerHandoffRiskItem
  items: DataQualityGroupStepOwnerHandoffRiskItem[]
  nextViewHint: string
  deferredActions: string[]
}

export const deferredDataQualityGroupActions = [
  "无真实数据修复",
  "无自动合并",
  "无批量重导",
  "无审批或权限",
  "无生产写库",
]

export const fallbackDataQualityGroups: DataQualityGroup[] = [
  {
    id: "identity-integrity",
    title: "身份与主键完整性",
    description: "聚合必填缺失、重复主键和人员绑定缺失，优先保障坐席、供应商和绑定关系可被排班引用。",
    risk: "high",
    owner: "数据管理员",
    sourceTemplates: ["TPL-MASTER-DATA"],
    traceKeys: ["employee_id", "supplier_id", "agent_binding.employee_id"],
    issueIds: ["DQ-202605-001", "DQ-202605-003", "DQ-202605-004"],
    recommendedReview: "先修正主数据，再复核受影响排班和导入批次。",
    deferredActions: deferredDataQualityGroupActions,
  },
  {
    id: "time-validity",
    title: "时间有效性",
    description: "聚合非法时区、排班时间倒挂和状态重叠，避免 0.5h 展开和人员时间轴产生错误时长。",
    risk: "high",
    owner: "运营负责人",
    sourceTemplates: ["TPL-MASTER-DATA", "TPL-PERSONNEL-SCHEDULE", "TPL-STATUS-LOG"],
    traceKeys: ["timezone", "start_at/end_at", "status_start_at/status_end_at"],
    issueIds: ["DQ-202605-002", "DQ-202605-005", "DQ-202605-010"],
    recommendedReview: "先确认时区和跨天班次，再拆分重叠状态时间段。",
    deferredActions: deferredDataQualityGroupActions,
  },
  {
    id: "schedule-readiness",
    title: "排班准备度",
    description: "聚合班次类型缺失、饭点越界和预测时段断档，确认排班明细可展开到 0.5h 汇总。",
    risk: "medium",
    owner: "排班运营",
    sourceTemplates: ["TPL-PERSONNEL-SCHEDULE", "TPL-DEMAND-FORECAST"],
    traceKeys: ["shift_type_id", "meal_windows", "interval_start"],
    issueIds: ["DQ-202605-006", "DQ-202605-007", "DQ-202605-008"],
    recommendedReview: "先补齐班次类型和预测时段，再检查饭点窗口是否落在班次内。",
    deferredActions: deferredDataQualityGroupActions,
  },
  {
    id: "actual-log-reference",
    title: "实际日志引用",
    description: "聚合登录或状态日志中无法关联主数据的记录，避免实际履约与人员排班无法对齐。",
    risk: "low",
    owner: "现场主管",
    sourceTemplates: ["TPL-LOGIN-LOG", "TPL-STATUS-LOG"],
    traceKeys: ["login_log.employee_id", "status_log.employee_id"],
    issueIds: ["DQ-202605-009"],
    recommendedReview: "确认是否为临时账号；若计入履约，需要先补人员主数据。",
    deferredActions: deferredDataQualityGroupActions,
  },
]

export function summarizeDataQualityGroups(
  groups: DataQualityGroup[]
): DataQualityGroupSummary {
  const templates = new Set<string>()

  for (const group of groups) {
    for (const template of group.sourceTemplates) {
      templates.add(template)
    }
  }

  return {
    totalGroups: groups.length,
    totalIssues: groups.reduce((total, group) => total + group.issueIds.length, 0),
    highRiskGroups: groups.filter((group) => group.risk === "high").length,
    sourceTemplateCount: templates.size,
    groupedIssueCount: getGroupedIssueIds(groups).length,
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function getDataQualityGroup(id: string) {
  return fallbackDataQualityGroups.find((group) => group.id === id)
}

export function getDataQualityGroupsForIssue(issueId: string) {
  return fallbackDataQualityGroups.filter((group) => group.issueIds.includes(issueId))
}

export function getDataQualityIssueGroupCoverage(
  issueIds: string[],
  groups = fallbackDataQualityGroups
): DataQualityIssueGroupCoverage[] {
  return issueIds.map((issueId) => ({
    issueId,
    groups: groups.filter((group) => group.issueIds.includes(issueId)),
  }))
}

export function getUngroupedDataQualityIssueIds(
  issueIds: string[],
  groups = fallbackDataQualityGroups
) {
  const groupedIssueIds = new Set(getGroupedIssueIds(groups))

  return issueIds.filter((issueId) => !groupedIssueIds.has(issueId))
}

export function summarizeDataQualityReviewGroupLink(
  representativeIssueId?: string,
  groups = fallbackDataQualityGroups
): DataQualityReviewGroupLinkSummary {
  if (!representativeIssueId) {
    return {
      representativeIssueId,
      totalMatchedGroupCount: 0,
      ungroupedIssueCount: 0,
      groupedIssueCount: 0,
      items: [],
      nextViewHint: "当前没有复核建议问题可关联质量分组。",
      deferredActions: deferredDataQualityGroupActions,
    }
  }

  const items = groups
    .filter((group) => group.issueIds.includes(representativeIssueId))
    .map((group) => ({
      groupId: group.id,
      title: group.title,
      risk: group.risk,
      owner: group.owner,
      issueCount: group.issueIds.length,
      sourceTemplates: group.sourceTemplates,
      traceKeys: group.traceKeys,
      href: `/data-quality/groups/${group.id}`,
      recommendedReview: group.recommendedReview,
    }))
    .sort(compareReviewGroupLinkItems)

  return {
    representativeIssueId,
    totalMatchedGroupCount: items.length,
    ungroupedIssueCount: items.length > 0 ? 0 : 1,
    groupedIssueCount: items.reduce((total, item) => total + item.issueCount, 0),
    topGroup: items[0],
    items,
    nextViewHint:
      items.length > 0
        ? "进入质量分组查看同组问题、字段和分组复核建议。"
        : "当前建议问题尚未进入质量分组，先查看数据质量详情。",
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function summarizeDataQualityGroupExceptionCoverage(
  issues: DataQualityIssue[],
  groups = fallbackDataQualityGroups
): DataQualityGroupExceptionCoverageSummary {
  const issueById = new Map(issues.map((issue) => [issue.id, issue]))
  const items = groups
    .map((group) => buildGroupExceptionCoverageItem(group, issueById))
    .filter((item): item is DataQualityGroupExceptionCoverageItem => item !== null)
    .sort(compareGroupExceptionCoverageItems)

  return {
    totalGroupCount: groups.length,
    totalImpactedGroupCount: items.length,
    totalImpactedExceptionCount: items.reduce(
      (total, item) => total + item.impactedExceptionCount,
      0
    ),
    totalImpactedPeopleCount: uniqueValues(
      items.flatMap((item) => item.impactedPeople)
    ).length,
    totalBlockedRows: items.reduce((total, item) => total + item.blockedRows, 0),
    topGroup: items[0],
    items,
    nextViewHint:
      items.length > 0
        ? "先查看影响最多履约异常的质量分组，再回到代表问题确认字段和影响对象。"
        : "当前质量分组没有匹配到履约异常影响。",
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function summarizeDataQualityGroupReviewSequence(
  issues: DataQualityIssue[],
  groups = fallbackDataQualityGroups
): DataQualityGroupReviewSequenceSummary {
  const coverage = summarizeDataQualityGroupExceptionCoverage(issues, groups)
  const steps = coverage.items.map((item, index) => ({
    sequence: index + 1,
    groupId: item.groupId,
    title: item.title,
    risk: item.risk,
    owner: item.owner,
    representativeIssueId: item.representativeIssueId,
    representativeIssueTitle: item.representativeIssueTitle,
    impactedExceptionCount: item.impactedExceptionCount,
    impactedPeople: item.impactedPeople,
    blockedRows: item.blockedRows,
    href: item.href,
    nextViewHint: `第 ${index + 1} 步查看${item.title}，再打开 ${item.representativeIssueId} 复核影响对象。`,
  }))
  const [firstStep, secondStep] = steps

  return {
    stepCount: steps.length,
    headline: firstStep
      ? `先看 ${firstStep.title}${secondStep ? `，再看 ${secondStep.title}` : ""}`
      : "当前没有需要排序的质量分组。",
    firstStep,
    steps,
    nextViewHint:
      steps.length > 0
        ? "按分组步骤查看原因分组，再回到代表问题确认履约异常影响。"
        : "当前质量分组没有匹配到履约异常影响，暂不生成复核顺序。",
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function summarizeDataQualityGroupStepImpactDrilldown(
  issues: DataQualityIssue[],
  groups = fallbackDataQualityGroups
): DataQualityGroupStepImpactDrilldownSummary {
  const issueById = new Map(issues.map((issue) => [issue.id, issue]))
  const sequence = summarizeDataQualityGroupReviewSequence(issues, groups)
  const items = sequence.steps.map((step) => {
    const issue = issueById.get(step.representativeIssueId)
    const affectedObjects = issue
      ? uniqueValues(issue.affectedObjects.map((object) => object.label))
      : []
    const personHref = issue?.impactLinks.find((link) =>
      link.target.includes("/person-timeline")
    )?.target

    return {
      sequence: step.sequence,
      groupId: step.groupId,
      title: step.title,
      risk: step.risk,
      owner: step.owner,
      representativeIssueId: step.representativeIssueId,
      representativeIssueTitle: step.representativeIssueTitle,
      issueHref: `/data-quality/${step.representativeIssueId}`,
      personHref,
      impactedPeople: step.impactedPeople,
      affectedObjects,
      nextViewHint: personHref
        ? `先打开 ${step.representativeIssueId}，再进入人员履约核对影响对象。`
        : `先打开 ${step.representativeIssueId}，再查看该问题的影响对象。`,
    }
  })

  return {
    stepCount: items.length,
    totalImpactedPeopleCount: uniqueValues(
      items.flatMap((item) => item.impactedPeople)
    ).length,
    firstItem: items[0],
    items,
    nextViewHint:
      items.length > 0
        ? "按分组步骤查看代表问题、人员和影响对象，确认异常追溯入口。"
        : "当前没有分组步骤可生成影响对象摘要。",
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function summarizeDataQualityGroupStepOwnerLoad(
  issues: DataQualityIssue[],
  groups = fallbackDataQualityGroups
): DataQualityGroupStepOwnerLoadSummary {
  const drilldown = summarizeDataQualityGroupStepImpactDrilldown(issues, groups)
  const itemsByOwner = new Map<
    string,
    {
      sourceItems: DataQualityGroupStepImpactDrilldownItem[]
      impactedPeople: string[]
      groupTitles: string[]
    }
  >()

  for (const item of drilldown.items) {
    const current = itemsByOwner.get(item.owner) ?? {
      sourceItems: [],
      impactedPeople: [],
      groupTitles: [],
    }
    current.sourceItems.push(item)
    current.impactedPeople = uniqueValues([
      ...current.impactedPeople,
      ...item.impactedPeople,
    ])
    current.groupTitles = uniqueValues([...current.groupTitles, item.title])
    itemsByOwner.set(item.owner, current)
  }

  const items = Array.from(itemsByOwner.entries())
    .map(([owner, value]) => {
      const representative = [...value.sourceItems].sort(
        (left, right) => left.sequence - right.sequence
      )[0]

      return {
        owner,
        firstSequence: representative.sequence,
        stepCount: value.sourceItems.length,
        impactedPeople: value.impactedPeople,
        groupTitles: value.groupTitles,
        representativeIssueId: representative.representativeIssueId,
        representativeIssueTitle: representative.representativeIssueTitle,
        issueHref: representative.issueHref,
        personHref: representative.personHref,
        nextViewHint: `先协调${owner}查看 ${representative.representativeIssueId}，再核对关联人员。`,
      }
    })
    .sort(compareOwnerLoadItems)

  return {
    ownerCount: items.length,
    totalStepCount: drilldown.stepCount,
    totalImpactedPeopleCount: uniqueValues(
      items.flatMap((item) => item.impactedPeople)
    ).length,
    topOwner: items[0],
    items,
    nextViewHint:
      items.length > 0
        ? "按 owner 查看分组步骤负载，再进入代表问题和人员履约核对。"
        : "当前没有分组步骤可生成 owner 负载摘要。",
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function summarizeDataQualityGroupStepOwnerReviewQueue(
  issues: DataQualityIssue[],
  groups = fallbackDataQualityGroups
): DataQualityGroupStepOwnerReviewQueueSummary {
  const ownerLoad = summarizeDataQualityGroupStepOwnerLoad(issues, groups)
  const items = ownerLoad.items.map((item, index) => {
    const rank = index + 1
    const primaryPerson = item.impactedPeople[0]

    return {
      rank,
      owner: item.owner,
      stepCount: item.stepCount,
      impactedPeople: item.impactedPeople,
      primaryPerson,
      groupTitles: item.groupTitles,
      representativeIssueId: item.representativeIssueId,
      representativeIssueTitle: item.representativeIssueTitle,
      issueHref: item.issueHref,
      personHref: item.personHref,
      queueReason: `第 ${rank} 位：${item.owner} 负责 ${item.stepCount} 个分组步骤，影响 ${item.impactedPeople.length} 名人员。`,
      nextViewHint: primaryPerson
        ? `先查看 ${item.representativeIssueId}，再核对 ${primaryPerson} 的人员履约。`
        : `先查看 ${item.representativeIssueId}，再回到 owner 负载确认影响人员。`,
    }
  })

  return {
    queueCount: items.length,
    totalStepCount: ownerLoad.totalStepCount,
    totalImpactedPeopleCount: ownerLoad.totalImpactedPeopleCount,
    firstItem: items[0],
    items,
    nextViewHint:
      items.length > 0
        ? "按 owner 复核队列逐项查看代表问题和人员履约，再回到分组步骤确认遗漏。"
        : "当前没有 owner 负载可生成复核队列。",
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function summarizeDataQualityGroupStepOwnerHandoffBrief(
  issues: DataQualityIssue[],
  groups = fallbackDataQualityGroups
): DataQualityGroupStepOwnerHandoffBriefSummary {
  const queue = summarizeDataQualityGroupStepOwnerReviewQueue(issues, groups)
  const items = queue.items.map((item) => ({
    owner: item.owner,
    representativeIssueId: item.representativeIssueId,
    representativeIssueTitle: item.representativeIssueTitle,
    primaryPerson: item.primaryPerson,
    groupTitles: item.groupTitles,
    issueHref: item.issueHref,
    personHref: item.personHref,
    impactedPeople: item.impactedPeople,
    handoffPoints: [
      `交接 ${item.owner} 先看 ${item.representativeIssueId} / ${item.representativeIssueTitle}。`,
      `关联分组：${item.groupTitles.join(" / ") || "无"}。`,
      item.primaryPerson
        ? `代表人员：${item.primaryPerson}，先核对人员履约链路。`
        : "暂无代表人员，先回到质量问题确认影响对象。",
      `队列理由：${item.queueReason}`,
    ],
    nextViewHint: item.primaryPerson
      ? `先打开 ${item.representativeIssueId}，再进入 ${item.primaryPerson} 的人员履约。`
      : `先打开 ${item.representativeIssueId}，再回到 owner 队列确认影响人员。`,
  }))

  return {
    handoffCount: items.length,
    totalImpactedPeopleCount: queue.totalImpactedPeopleCount,
    firstItem: items[0],
    items,
    nextViewHint:
      items.length > 0
        ? "按 owner 交接摘要逐项确认代表问题、代表人员和关联分组。"
        : "当前没有 owner 队列可生成交接摘要。",
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function summarizeDataQualityGroupStepOwnerHandoffRiskSummary(
  issues: DataQualityIssue[],
  groups = fallbackDataQualityGroups
): DataQualityGroupStepOwnerHandoffRiskSummary {
  const handoffBrief = summarizeDataQualityGroupStepOwnerHandoffBrief(issues, groups)
  const items = handoffBrief.items.map((item) => ({
    owner: item.owner,
    representativeIssueId: item.representativeIssueId,
    representativeIssueTitle: item.representativeIssueTitle,
    primaryPerson: item.primaryPerson,
    groupTitles: item.groupTitles,
    issueHref: item.issueHref,
    personHref: item.personHref,
    impactedPeople: item.impactedPeople,
    riskReasons: [
      `阻塞原因：${item.owner} 需要先确认 ${item.representativeIssueId} / ${item.representativeIssueTitle} 的交接范围。`,
      item.primaryPerson
        ? `代表人员：${item.primaryPerson}，若人员履约未核对，交接结论可能停留在口径说明。`
        : "代表人员缺失，交接前需要先回到质量问题确认影响对象。",
      item.groupTitles.length > 1
        ? `关联分组：${item.groupTitles.join(" / ")}，同一 owner 需要先拆清分组责任。`
        : `关联分组：${item.groupTitles.join(" / ") || "无"}，需确认是否足够支撑责任人复核。`,
      item.impactedPeople.length > 1
        ? `影响人员：${item.impactedPeople.join(" / ")}，多人影响会放大交接阻塞。`
        : `影响人员：${item.impactedPeople[0] ?? "无"}，先保证人员入口可追溯。`,
    ],
    nextViewHint: item.primaryPerson
      ? `先查看风险问题 ${item.representativeIssueId}，再核对 ${item.primaryPerson} 的人员履约。`
      : `先查看风险问题 ${item.representativeIssueId}，再回到交接摘要补齐影响对象。`,
  }))

  return {
    riskCount: items.length,
    totalImpactedPeopleCount: handoffBrief.totalImpactedPeopleCount,
    topRisk: items[0],
    items,
    nextViewHint:
      items.length > 0
        ? "按 owner 交接风险逐项确认阻塞原因、代表问题和人员入口。"
        : "当前没有 owner 交接摘要可生成交接风险。",
    deferredActions: deferredDataQualityGroupActions,
  }
}

export function dataQualityGroupRiskLabel(risk: DataQualityGroupRisk) {
  return {
    high: "高风险",
    medium: "中风险",
    low: "低风险",
  }[risk]
}

function getGroupedIssueIds(groups: DataQualityGroup[]) {
  return Array.from(new Set(groups.flatMap((group) => group.issueIds)))
}

function compareReviewGroupLinkItems(
  left: DataQualityReviewGroupLinkItem,
  right: DataQualityReviewGroupLinkItem
) {
  const riskRank: Record<DataQualityGroupRisk, number> = {
    high: 3,
    medium: 2,
    low: 1,
  }

  return (
    riskRank[right.risk] - riskRank[left.risk] ||
    right.issueCount - left.issueCount ||
    left.title.localeCompare(right.title, "zh-Hans-CN")
  )
}

function buildGroupExceptionCoverageItem(
  group: DataQualityGroup,
  issueById: Map<string, DataQualityIssue>
): DataQualityGroupExceptionCoverageItem | null {
  const groupIssues = group.issueIds
    .map((issueId) => issueById.get(issueId))
    .filter((issue): issue is DataQualityIssue => Boolean(issue))
  const impactedIssues = groupIssues.filter(
    (issue) => getImpactedExceptionCount(issue) > 0
  )

  if (impactedIssues.length === 0) {
    return null
  }

  const representativeIssue = [...impactedIssues].sort(compareIssuesByImpact)[0]

  return {
    groupId: group.id,
    title: group.title,
    risk: group.risk,
    owner: group.owner,
    issueCount: group.issueIds.length,
    impactedIssueCount: impactedIssues.length,
    impactedExceptionCount: impactedIssues.reduce(
      (total, issue) => total + getImpactedExceptionCount(issue),
      0
    ),
    impactedPeople: uniqueValues(impactedIssues.flatMap(getImpactedPeople)),
    blockedRows: impactedIssues.reduce((total, issue) => total + issue.blockedRows, 0),
    affectedObjects: uniqueValues(
      impactedIssues.flatMap((issue) =>
        issue.affectedObjects.map((object) => object.label)
      )
    ),
    sourceTemplates: group.sourceTemplates,
    traceKeys: group.traceKeys,
    representativeIssueId: representativeIssue.id,
    representativeIssueTitle: representativeIssue.title,
    href: `/data-quality/groups/${group.id}`,
    nextViewHint: `先查看${group.title}分组，再打开 ${representativeIssue.id} 确认异常影响对象。`,
  }
}

function compareGroupExceptionCoverageItems(
  left: DataQualityGroupExceptionCoverageItem,
  right: DataQualityGroupExceptionCoverageItem
) {
  return (
    right.impactedExceptionCount - left.impactedExceptionCount ||
    right.impactedPeople.length - left.impactedPeople.length ||
    right.blockedRows - left.blockedRows ||
    compareRisk(right.risk, left.risk) ||
    left.title.localeCompare(right.title, "zh-Hans-CN")
  )
}

function compareOwnerLoadItems(
  left: DataQualityGroupStepOwnerLoadItem,
  right: DataQualityGroupStepOwnerLoadItem
) {
  return (
    right.stepCount - left.stepCount ||
    right.impactedPeople.length - left.impactedPeople.length ||
    left.firstSequence - right.firstSequence ||
    left.owner.localeCompare(right.owner, "zh-Hans-CN")
  )
}

function compareIssuesByImpact(left: DataQualityIssue, right: DataQualityIssue) {
  return (
    getImpactedExceptionCount(right) - getImpactedExceptionCount(left) ||
    getImpactedPeople(right).length - getImpactedPeople(left).length ||
    right.blockedRows - left.blockedRows ||
    left.id.localeCompare(right.id)
  )
}

function getImpactedExceptionCount(issue: DataQualityIssue) {
  const exceptionObjects = issue.affectedObjects.filter(
    (object) =>
      object.type.includes("履约") ||
      object.label.includes("异常") ||
      object.label.includes("履约")
  )
  const personTimelineLinks = issue.impactLinks.filter(
    (link) => link.type === "person_timeline"
  )

  return exceptionObjects.length > 0 || personTimelineLinks.length > 0
    ? Math.max(1, exceptionObjects.filter((object) => object.label.includes("异常")).length)
    : 0
}

function getImpactedPeople(issue: DataQualityIssue) {
  return uniqueValues([
    ...issue.affectedObjects
      .map((object) => object.objectId)
      .filter((objectId) => /^A-\d+/.test(objectId)),
    ...issue.impactLinks
      .map((link) => link.target.match(/A-\d+/)?.[0] ?? "")
      .filter((employeeId) => employeeId.length > 0),
  ])
}

function compareRisk(left: DataQualityGroupRisk, right: DataQualityGroupRisk) {
  const riskRank: Record<DataQualityGroupRisk, number> = {
    high: 3,
    medium: 2,
    low: 1,
  }

  return riskRank[left] - riskRank[right]
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values.filter((value) => value.length > 0)))
}
