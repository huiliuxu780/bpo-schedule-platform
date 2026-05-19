export type ReviewTimelineStatus =
  | "identified"
  | "assigned"
  | "reviewing"
  | "confirmed"
  | "closed"

export type ReviewTimelineStep = {
  id: ReviewTimelineStatus
  title: string
  owner: string
  entryCondition: string
  evidence: string[]
  exitCondition: string
  exampleCaseIds: string[]
}

export type ReviewTimelineSummary = {
  totalSteps: number
  totalEvidenceItems: number
  totalExampleCases: number
  owners: string[]
  deferredActions: string[]
}

export const deferredReviewTimelineActions = [
  "无复核提交",
  "无审批流",
  "无权限隔离",
  "无通知推送",
  "无生产状态写回",
]

export const fallbackReviewTimelineSteps: ReviewTimelineStep[] = [
  step("identified", "已识别", "系统本地模型", "预测、排班、登录、状态或主数据对齐后出现异常样例。", ["异常来源", "触发条件", "追溯键"], "进入待分派池。", ["AR-202605-001", "AR-202605-003"]),
  step("assigned", "已分派", "运营负责人", "异常有明确来源、严重度和建议责任角色。", ["负责人", "严重度", "影响工时"], "分派到排班运营、现场主管或数据管理员。", ["AR-202605-004", "AR-202605-007"]),
  step("reviewing", "复核中", "责任人", "责任人查看异常明细、人员时间轴或数据质量问题。", ["人员时间轴", "导入批次", "数据质量问题"], "形成确认异常或标记正常的复核结论。", ["AR-202605-005"]),
  step("confirmed", "已确认", "现场主管", "复核结论为确认异常，并保留原因和建议处理。", ["复核结果", "归因", "建议处理"], "等待后续处理动作或关闭。", ["AR-202605-003", "AR-202605-006"]),
  step("closed", "已关闭", "运营负责人", "异常已解释、标记正常或后续处理完成。", ["关闭原因", "审计记录", "处理状态"], "进入历史复盘，不再出现在待复核池。", ["AR-202605-002", "AR-202605-008"]),
]

export function summarizeReviewTimeline(
  rows: ReviewTimelineStep[]
): ReviewTimelineSummary {
  return {
    totalSteps: rows.length,
    totalEvidenceItems: rows.reduce((sum, row) => sum + row.evidence.length, 0),
    totalExampleCases: rows.reduce((sum, row) => sum + row.exampleCaseIds.length, 0),
    owners: Array.from(new Set(rows.map((row) => row.owner))),
    deferredActions: deferredReviewTimelineActions,
  }
}

export function getReviewTimelineStep(id: string) {
  return fallbackReviewTimelineSteps.find((row) => row.id === id)
}

function step(
  id: ReviewTimelineStatus,
  title: string,
  owner: string,
  entryCondition: string,
  evidence: string[],
  exitCondition: string,
  exampleCaseIds: string[]
): ReviewTimelineStep {
  return {
    id,
    title,
    owner,
    entryCondition,
    evidence,
    exitCondition,
    exampleCaseIds,
  }
}
