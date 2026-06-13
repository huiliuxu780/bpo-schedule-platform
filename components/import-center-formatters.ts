import type {
  ImportApplicationStatus,
  ImportFileType,
  ImportProcessingStatus,
  ImportReadinessStatus,
  ImportRowStatus,
} from "./import-center-types"

const taskCodeLabelPattern = /\b(?:F|B|Q|IM|US|DB)\d{3}\b/g

const taskCodeFileNamePattern = /\b(?:F|B|Q|IM|US|DB)\d{3}(?=[-_])/gi

const smokeLabelPattern = /-SMOKE(?=-|\b)/gi

const smokeFileNamePattern = /[-_]smoke(?=[-_.])/gi

const fileTypeLabels: Record<ImportFileType, string> = {
  master_data: "主数据",
  personnel_schedule: "人员排班",
  demand_forecast: "需求预测",
  login_log: "登录日志",
  status_log: "状态日志",
}

const processingStatusLabels: Record<ImportProcessingStatus, string> = {
  completed: "已完成",
  completed_with_errors: "有失败行",
  failed: "失败",
}

const applicationStatusLabels: Record<ImportApplicationStatus, string> = {
  not_applied: "未应用",
  applied: "已应用",
}

const readinessStatusLabels: Record<ImportReadinessStatus, string> = {
  ready: "可应用",
  blocked: "未就绪",
}

const rowStatusLabels: Record<ImportRowStatus, string> = {
  success: "成功",
  failed: "失败",
  warning: "警告",
}

export function formatImportBatchDisplayLabel(batchId: string | null | undefined): string {
  if (!batchId) {
    return "暂无批次"
  }

  return batchId
    .replace(taskCodeLabelPattern, "业务")
    .replace(smokeLabelPattern, "")
}

export function formatImportBatchFileDisplayName(
  fileName: string | null | undefined
): string {
  if (!fileName) {
    return "未命名文件"
  }

  return fileName
    .replace(taskCodeFileNamePattern, "业务")
    .replace(smokeFileNamePattern, "")
}

export function formatImportFileType(fileType: ImportFileType): string {
  return fileTypeLabels[fileType] ?? fileType
}

export function formatImportProcessingStatus(status: ImportProcessingStatus): string {
  return processingStatusLabels[status] ?? status
}

export function formatImportApplicationStatus(status: ImportApplicationStatus): string {
  return applicationStatusLabels[status] ?? status
}

export function formatImportReadinessStatus(status: ImportReadinessStatus): string {
  return readinessStatusLabels[status] ?? status
}

export function formatImportRowStatus(status: ImportRowStatus): string {
  return rowStatusLabels[status] ?? status
}
