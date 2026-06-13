import {
  type ImportBatchListRow,
  type ImportFieldMappingTemplate,
} from "@/components/import-center-model"
import {
  type MasterDataAgentImportDialogResult,
  type MasterDataAgentImportDialogSummary,
} from "./master-data-maintenance-types"
import {
  formatImportBatchDisplayLabel,
} from "./master-data-maintenance-formatters"

export function summarizeMasterDataAgentImportDialog({
  batches,
  templates,
  uploadStatus,
  uploadReason,
  uploadBatchId,
}: {
  batches: ImportBatchListRow[]
  templates: ImportFieldMappingTemplate[]
  uploadStatus?: string | null
  uploadReason?: string | null
  uploadBatchId?: string | null
}): MasterDataAgentImportDialogSummary {
  const activeTemplates = templates
    .filter((template) => template.file_type === "master_data" && template.is_active)
    .sort((left, right) => left.template_name.localeCompare(right.template_name, "zh-CN"))
  const resultBatch = uploadBatchId
    ? batches.find((batch) => batch.batch_id === uploadBatchId) ?? null
    : null

  return {
    openHref: "/master-data/agents?import_dialog=1",
    closeHref: "/master-data/agents",
    resultRedirectTo: "/master-data/agents?import_dialog=1",
    fileType: "master_data",
    templateDownloadHref: buildMasterDataAgentImportTemplateHref(),
    templateDownloadName: "customer-service-agents-template.csv",
    steps: [
      {
        key: "upload",
        title: "上传文件",
        detail: "下载人员导入模板后上传本次客服人员 CSV。",
      },
      {
        key: "mapping",
        title: "字段映射",
        detail: "选择已有映射模板；表头不一致时使用手动字段映射。",
      },
      {
        key: "result",
        title: "导入结果",
        detail: "只展示本次导入摘要，完整行结果进入批次详情处理。",
      },
    ],
    mappingModes: [
      {
        key: "template",
        label: "选择映射模板",
        detail: activeTemplates.length > 0
          ? "使用已维护的主数据字段映射。"
          : "暂无启用模板，可改用手动映射。",
      },
      {
        key: "manual",
        label: "手动映射字段",
        detail: "按 CSV 表头填写字段映射 JSON，仅作用于本次导入。",
      },
    ],
    activeTemplates,
    result: summarizeMasterDataAgentImportDialogResult({
      uploadStatus,
      uploadReason,
      uploadBatchId,
      batch: resultBatch,
    }),
  }
}

export function summarizeMasterDataAgentImportDialogResult({
  uploadStatus,
  uploadReason,
  uploadBatchId,
  batch,
}: {
  uploadStatus?: string | null
  uploadReason?: string | null
  uploadBatchId?: string | null
  batch: ImportBatchListRow | null
}): MasterDataAgentImportDialogResult | null {
  if (uploadStatus !== "success" && uploadStatus !== "failed") {
    return null
  }

  const batchHref = uploadBatchId
    ? buildMasterDataImportBatchProcessingHref(uploadBatchId)
    : null

  if (uploadStatus === "success") {
    return {
      tone: "success",
      title: "导入已提交",
      detail: uploadBatchId
        ? `批次 ${formatImportBatchDisplayLabel(uploadBatchId)} 已生成。`
        : "文件已提交。",
      rowSummary: batch
        ? `成功 ${batch.success_rows.toLocaleString("zh-CN")} 行 / 失败 ${batch.failed_rows.toLocaleString("zh-CN")} 行`
        : "批次行结果读取中",
      batchHref,
      failedRowsHref: batchHref,
      nextActionLabel: "查看批次详情",
    }
  }

  return {
    tone: "failed",
    title: "导入未完成",
    detail: formatMasterDataAgentImportFailureReason(uploadReason),
    rowSummary: batch
      ? `成功 ${batch.success_rows.toLocaleString("zh-CN")} 行 / 失败 ${batch.failed_rows.toLocaleString("zh-CN")} 行`
      : "暂无行结果",
    batchHref,
    failedRowsHref: batchHref,
    nextActionLabel: batchHref ? "查看批次详情" : "修正后重试",
  }
}

export function buildMasterDataAgentImportTemplateHref(): string {
  const lines = [
    "record_type,employee_id,employee_name,status,employee_type,organization_id,workplace_id,effective_from,effective_to,skill_id",
    "employee,A-2001,刘晓晓,active,internal,ORG-RETURN,NJ-01,2026-06-01,2026-12-31,",
    "employee_skill,A-2001,,, ,,,2026-06-01,2026-12-31,SKILL-RETURN-TICKET",
  ]

  return `data:text/csv;charset=utf-8,${encodeURIComponent(lines.join("\n"))}`
}

export function buildMasterDataImportBatchProcessingHref(batchId: string): string {
  return `/data-quality/import-batches/${encodeURIComponent(batchId)}`
}

export function formatMasterDataAgentImportFailureReason(reason?: string | null): string {
  if (!reason) {
    return "请检查必填项、CSV 文件和字段映射后重试。"
  }

  if (reason === "missing_required_fields") {
    return "缺少批次号、业务日期或 CSV 文件。"
  }

  if (reason === "invalid_json") {
    return "字段映射 JSON 格式不正确。"
  }

  if (reason.startsWith("api_")) {
    return `上传接口返回 ${reason.replace("api_", "")}，请查看批次或调整字段映射后重试。`
  }

  return reason
}
