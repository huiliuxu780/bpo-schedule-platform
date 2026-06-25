import type {
  ImportFileType,
  ImportFieldMappingTemplateSummary,
  ImportFieldMappingTemplateWorkspaceTab,
  ImportFieldMappingTemplateDetailWorkspaceTab,
  ImportFieldMappingTemplateDetailSummary,
  ImportFieldMappingTemplateActionNotice,
  ImportTemplateUploadPrefill,
  ImportTemplateFitHint,
  ImportTemplateFitOption,
  ImportTemplateFitDetail,
  ImportFieldMappingTemplate,
} from "./import-center-types"

import {
  formatImportFileType,
} from "./import-center-formatters"

const recommendedImportStandardFields: Record<ImportFileType, string[]> = {
  master_data: [
    "source_key",
    "employee_id",
    "employee_name",
    "worksite_id",
    "supplier_id",
    "project_id",
  ],
  personnel_schedule: [
    "source_key",
    "employee_id",
    "business_date",
    "shift_type_id",
    "start_time",
    "end_time",
  ],
  demand_forecast: [
    "source_key",
    "business_date",
    "interval_start",
    "worksite_id",
    "project_id",
    "skill_group",
    "demand_agents",
  ],
  login_log: ["source_key", "employee_id", "login_time", "logout_time"],
  status_log: ["source_key", "employee_id", "status_code", "start_time", "end_time"],
}

const importFieldMappingTemplateDetailWorkspaceTabs: ImportFieldMappingTemplateDetailWorkspaceTab[] =
  [
    { key: "overview", label: "总览" },
    { key: "maintenance", label: "维护表单" },
    { key: "mapping", label: "字段明细" },
  ]

const importFieldMappingTemplateWorkspaceTabs: ImportFieldMappingTemplateWorkspaceTab[] =
  [
    { key: "overview", label: "总览" },
    { key: "fit", label: "模板适配" },
    { key: "templates", label: "模板列表" },
  ]

export function summarizeImportFieldMappingTemplates(
  templates: ImportFieldMappingTemplate[]
): ImportFieldMappingTemplateSummary {
  const coveredFileTypes = new Set<ImportFileType>()

  return templates.reduce<ImportFieldMappingTemplateSummary>(
    (summary, template) => {
      coveredFileTypes.add(template.file_type)

      return {
        totalTemplates: summary.totalTemplates + 1,
        activeTemplates: summary.activeTemplates + (template.is_active ? 1 : 0),
        inactiveTemplates: summary.inactiveTemplates + (template.is_active ? 0 : 1),
        coveredFileTypes: coveredFileTypes.size,
        totalMappedFields:
          summary.totalMappedFields + Object.keys(template.field_mapping).length,
        workspaceTabs: summary.workspaceTabs,
      }
    },
    {
      totalTemplates: 0,
      activeTemplates: 0,
      inactiveTemplates: 0,
      coveredFileTypes: 0,
      totalMappedFields: 0,
      workspaceTabs: [...importFieldMappingTemplateWorkspaceTabs],
    }
  )
}

export function summarizeImportFieldMappingTemplateDetail(
  template: ImportFieldMappingTemplate
): ImportFieldMappingTemplateDetailSummary {
  return {
    mappedFieldCount: Object.keys(template.field_mapping).length,
    statusLabel: template.is_active ? "启用" : "停用",
    summaryText: formatFieldMappingTemplateSummary(template),
    workspaceTabs: [...importFieldMappingTemplateDetailWorkspaceTabs],
  }
}

export function summarizeImportFieldMappingTemplateActionNotice({
  status,
  action,
  reason,
  templateId,
}: {
  status?: string
  action?: string
  reason?: string
  templateId: string
}): ImportFieldMappingTemplateActionNotice | null {
  if (!status || !action) {
    return null
  }

  const isSuccess = status === "success"
  const isDeactivate = action === "deactivate"
  const isCreate = action === "create"
  const actionLabel = isDeactivate ? "停用" : isCreate ? "创建" : "更新"

  if (isSuccess) {
    return {
      tone: "success",
      title: isDeactivate ? "模板已停用" : isCreate ? "模板已创建" : "模板已更新",
      detail: isDeactivate
        ? `字段映射模板 ${templateId} 已停用，上传时不会再作为启用模板推荐。`
        : isCreate
          ? `字段映射模板 ${templateId} 已创建，可在上传时作为启用模板复用。`
          : `字段映射模板 ${templateId} 已保存最新名称和字段映射。`,
      nextAction: isDeactivate
        ? "返回批次处理页检查同类型模板覆盖，必要时选择其他启用模板。"
        : isCreate
          ? "继续检查当前模板字段覆盖，或返回批次处理页选择该模板上传。"
          : "返回批次处理页重新选择模板，或继续检查当前模板字段覆盖。",
    }
  }

  return {
    tone: "failed",
    title: `模板${actionLabel}失败`,
    detail: `字段映射模板 ${templateId} 未完成${actionLabel}：${reason || "未知错误"}。`,
    nextAction: isDeactivate
      ? "检查模板是否仍存在，再重新提交停用。"
      : "检查模板名称和字段映射 JSON 后重新提交。",
  }
}

export function summarizeImportTemplateUploadPrefill(
  templates: ImportFieldMappingTemplate[],
  selectedTemplateId?: string | null
): ImportTemplateUploadPrefill | null {
  if (!selectedTemplateId) {
    return null
  }

  const template = templates.find(
    (candidate) => candidate.template_id === selectedTemplateId
  )

  if (!template) {
    return {
      selectedTemplateId,
      defaultTemplateId: "",
      fileType: null,
      tone: "failed",
      title: "模板不可用于上传",
      detail: `字段映射模板 ${selectedTemplateId} 未包含在当前可选模板列表。`,
      nextAction: "请返回模板管理确认模板状态，或手填字段映射 JSON 后上传。",
    }
  }

  if (!template.is_active) {
    return {
      selectedTemplateId,
      defaultTemplateId: "",
      fileType: null,
      tone: "failed",
      title: "模板不可用于上传",
      detail: `字段映射模板 ${selectedTemplateId} 已停用，上传表单不会默认使用它。`,
      nextAction: "请选择其他启用模板，或手填字段映射 JSON 后上传。",
    }
  }

  return {
    selectedTemplateId,
    defaultTemplateId: template.template_id,
    fileType: template.file_type,
    tone: "success",
    title: "已预选字段映射模板",
    detail: `${template.template_name} · ${formatImportFileType(template.file_type)} · ${Object.keys(template.field_mapping).length} 个字段`,
    nextAction:
      "确认 CSV 文件表头匹配该模板后上传；如不匹配，可改选其他模板或手填字段映射 JSON。",
  }
}

export function summarizeImportTemplateFitHint(
  fileType: ImportFileType,
  templates: ImportFieldMappingTemplate[],
  templateError?: string | null
): ImportTemplateFitHint {
  if (templateError) {
    return {
      fileType,
      status: "error",
      matchingTemplates: 0,
      activeMatchingTemplates: 0,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      mappedFieldCount: 0,
      detail: `字段映射模板读取失败：${templateError}`,
      nextAction: "保留手填字段映射 JSON 上传，或稍后重试模板读取。",
    }
  }

  const matchingTemplates = templates.filter((template) => template.file_type === fileType)
  const activeTemplates = matchingTemplates.filter((template) => template.is_active)
  const recommendedTemplate = [...activeTemplates].sort(
    (left, right) =>
      Object.keys(right.field_mapping).length - Object.keys(left.field_mapping).length
  )[0]

  if (!recommendedTemplate) {
    return {
      fileType,
      status: "missing",
      matchingTemplates: matchingTemplates.length,
      activeMatchingTemplates: activeTemplates.length,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      mappedFieldCount: 0,
      detail: `${formatImportFileType(fileType)}没有启用模板。`,
      nextAction: "先使用手填字段映射 JSON 上传；模板维护在对应页面中处理。",
    }
  }

  return {
    fileType,
    status: "matched",
    matchingTemplates: matchingTemplates.length,
    activeMatchingTemplates: activeTemplates.length,
    recommendedTemplateId: recommendedTemplate.template_id,
    recommendedTemplateName: recommendedTemplate.template_name,
    mappedFieldCount: Object.keys(recommendedTemplate.field_mapping).length,
    detail: `已找到 ${activeTemplates.length} 个启用模板，推荐使用“${recommendedTemplate.template_name}”。`,
    nextAction: "选择同类型模板后上传；如 CSV 表头不一致，再改用手填字段映射 JSON。",
  }
}

export function summarizeImportTemplateFitDetail(
  fileType: ImportFileType,
  templates: ImportFieldMappingTemplate[],
  templateError?: string | null
): ImportTemplateFitDetail {
  const recommendedFields = recommendedImportStandardFields[fileType]

  if (templateError) {
    return {
      fileType,
      status: "error",
      matchingTemplates: 0,
      activeMatchingTemplates: 0,
      inactiveMatchingTemplates: 0,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      recommendedMappedFieldCount: 0,
      mappedStandardFields: [],
      missingStandardFields: recommendedFields,
      templateOptions: [],
      title: "字段映射模板读取失败",
      detail: `字段映射模板读取失败：${templateError}`,
      nextAction: "保留手填字段映射 JSON 上传，或稍后重试模板读取。",
    }
  }

  const matchingTemplates = templates.filter((template) => template.file_type === fileType)
  const templateOptions = matchingTemplates
    .map((template) => buildImportTemplateFitOption(template, recommendedFields))
    .sort(compareImportTemplateFitOptions)
  const activeOptions = templateOptions.filter((template) => template.isActive)
  const recommendedTemplate = activeOptions[0] ?? null

  if (!recommendedTemplate) {
    return {
      fileType,
      status: "missing",
      matchingTemplates: matchingTemplates.length,
      activeMatchingTemplates: 0,
      inactiveMatchingTemplates: templateOptions.length,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      recommendedMappedFieldCount: 0,
      mappedStandardFields: [],
      missingStandardFields: recommendedFields,
      templateOptions,
      title: `暂无启用${formatImportFileType(fileType)}模板`,
      detail: `当前${formatImportFileType(fileType)}没有启用模板；上传前需要手填字段映射 JSON。`,
      nextAction: "先使用手填字段映射 JSON；模板新增或维护留到对应页面。",
    }
  }

  return {
    fileType,
    status: "matched",
    matchingTemplates: matchingTemplates.length,
    activeMatchingTemplates: activeOptions.length,
    inactiveMatchingTemplates: templateOptions.length - activeOptions.length,
    recommendedTemplateId: recommendedTemplate.templateId,
    recommendedTemplateName: recommendedTemplate.templateName,
    recommendedMappedFieldCount: recommendedTemplate.mappedFieldCount,
    mappedStandardFields: recommendedTemplate.mappedStandardFields,
    missingStandardFields: recommendedTemplate.missingStandardFields,
    templateOptions,
    title: `推荐使用${recommendedTemplate.templateName}`,
    detail: `当前${formatImportFileType(fileType)}有 ${activeOptions.length} 个启用模板；推荐模板覆盖 ${recommendedTemplate.mappedFieldCount} 个字段，仍缺 ${recommendedTemplate.missingStandardFields.length} 个建议字段。`,
    nextAction: "优先使用推荐模板；如果 CSV 表头不一致，继续用手填字段映射 JSON 兜底。",
  }
}

export function formatFieldMappingTemplateSummary(
  template: ImportFieldMappingTemplate
): string {
  const entries = Object.entries(template.field_mapping)
  const preview = entries.slice(0, 3).map(([sourceField, standardField]) => {
    return `${sourceField} -> ${standardField}`
  })
  const remainingCount = entries.length - preview.length

  if (remainingCount > 0) {
    preview[preview.length - 1] = `${preview[preview.length - 1]} +${remainingCount}`
  }

  return preview.join(", ")
}

function buildImportTemplateFitOption(
  template: ImportFieldMappingTemplate,
  recommendedFields: string[]
): ImportTemplateFitOption {
  const mappingPairs = Object.entries(template.field_mapping).map(
    ([sourceField, standardField]) => ({
      sourceField,
      standardField,
    })
  )
  const mappedStandardFields = Array.from(
    new Set(mappingPairs.map((pair) => pair.standardField))
  ).sort()
  const mappedFieldSet = new Set(mappedStandardFields)
  const missingStandardFields = recommendedFields.filter(
    (field) => !mappedFieldSet.has(field)
  )

  return {
    templateId: template.template_id,
    templateName: template.template_name,
    isActive: template.is_active,
    mappedFieldCount: mappingPairs.length,
    mappedStandardFields,
    missingStandardFields,
    mappingPairs,
  }
}

function compareImportTemplateFitOptions(
  left: ImportTemplateFitOption,
  right: ImportTemplateFitOption
): number {
  if (left.isActive !== right.isActive) {
    return left.isActive ? -1 : 1
  }

  if (left.mappedFieldCount !== right.mappedFieldCount) {
    return right.mappedFieldCount - left.mappedFieldCount
  }

  return left.templateId.localeCompare(right.templateId)
}
