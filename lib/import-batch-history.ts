export type ImportBatchStatus = "completed" | "completed_with_errors" | "failed" | "pending_review"

export type ImportBatch = {
  id: string
  templateId: string
  templateName: string
  sourceFile: string
  owner: string
  uploadedAt: string
  status: ImportBatchStatus
  totalRows: number
  successRows: number
  failedRows: number
  warningRows: number
  affectedObjects: string[]
  errorCodes: string[]
  qualityIssueIds: string[]
  note: string
}

export type ImportBatchSummary = {
  total: number
  completed: number
  failed: number
  pendingReview: number
  totalRows: number
  failedRows: number
  warningRows: number
  failureRate: number
  deferredActions: string[]
}

export const deferredImportBatchActions = [
  "无真实上传",
  "无批量导入",
  "无失败行写库",
  "无自动修复",
  "无审批或权限",
]

export const fallbackImportBatches: ImportBatch[] = [
  {
    id: "BATCH-20260519-001",
    templateId: "TPL-MASTER-DATA",
    templateName: "主数据模板",
    sourceFile: "master_data_20260519.xlsx",
    owner: "数据管理员",
    uploadedAt: "2026-05-19 09:12",
    status: "completed_with_errors",
    totalRows: 320,
    successRows: 308,
    failedRows: 7,
    warningRows: 5,
    affectedObjects: ["坐席", "职场", "供应商", "绑定关系"],
    errorCodes: ["missing_required_field", "foreign_key_missing"],
    qualityIssueIds: ["DQ-202605-001", "DQ-202605-004"],
    note: "供应商绑定缺失导致部分人员不可用于排班。",
  },
  {
    id: "BATCH-20260519-002",
    templateId: "TPL-PERSONNEL-SCHEDULE",
    templateName: "人员级排班模板",
    sourceFile: "personnel_schedule_20260519.xlsx",
    owner: "排班运营",
    uploadedAt: "2026-05-19 10:05",
    status: "pending_review",
    totalRows: 680,
    successRows: 646,
    failedRows: 12,
    warningRows: 22,
    affectedObjects: ["人员级排班", "0.5h 时段汇总"],
    errorCodes: ["invalid_time_range", "shift_type_missing"],
    qualityIssueIds: ["DQ-202605-002", "DQ-202605-006"],
    note: "部分班次类型未启用，等待排班运营复核。",
  },
  {
    id: "BATCH-20260519-003",
    templateId: "TPL-DEMAND-FORECAST",
    templateName: "需求预测模板",
    sourceFile: "demand_forecast_20260519.xlsx",
    owner: "预测运营",
    uploadedAt: "2026-05-19 10:40",
    status: "completed",
    totalRows: 96,
    successRows: 96,
    failedRows: 0,
    warningRows: 0,
    affectedObjects: ["需求预测", "履约对比"],
    errorCodes: [],
    qualityIssueIds: [],
    note: "0.5h 预测时段已完整覆盖。",
  },
  {
    id: "BATCH-20260519-004",
    templateId: "TPL-STATUS-LOG",
    templateName: "状态日志模板",
    sourceFile: "status_log_20260519.xlsx",
    owner: "现场主管",
    uploadedAt: "2026-05-19 11:20",
    status: "failed",
    totalRows: 420,
    successRows: 0,
    failedRows: 420,
    warningRows: 0,
    affectedObjects: ["状态日志", "人员时间轴"],
    errorCodes: ["duplicate_primary_key", "status_overlap"],
    qualityIssueIds: ["DQ-202605-003", "DQ-202605-008"],
    note: "状态时间段重叠，当前只展示失败结果，不做修复提交。",
  },
]

export function summarizeImportBatches(
  rows: ImportBatch[]
): ImportBatchSummary {
  const summary = rows.reduce<ImportBatchSummary>(
    (result, row) => {
      result.total += 1
      result.totalRows += row.totalRows
      result.failedRows += row.failedRows
      result.warningRows += row.warningRows

      if (row.status === "failed") {
        result.failed += 1
      } else if (row.status === "pending_review") {
        result.pendingReview += 1
      } else {
        result.completed += 1
      }

      return result
    },
    {
      total: 0,
      completed: 0,
      failed: 0,
      pendingReview: 0,
      totalRows: 0,
      failedRows: 0,
      warningRows: 0,
      failureRate: 0,
      deferredActions: deferredImportBatchActions,
    }
  )

  return {
    ...summary,
    failureRate: summary.totalRows > 0 ? summary.failedRows / summary.totalRows : 0,
  }
}

export function getImportBatchById(id: string) {
  return fallbackImportBatches.find((row) => row.id === id)
}

export function importBatchStatusLabel(status: ImportBatchStatus) {
  const labels: Record<ImportBatchStatus, string> = {
    completed: "已完成",
    completed_with_errors: "完成有错误",
    failed: "失败",
    pending_review: "待复核",
  }

  return labels[status]
}
