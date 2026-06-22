import {
  type ImportBatchListRow,
} from "@/components/import-center-model"
import {
  type MasterDataMaintenanceTone,
  type MasterDataMaintenanceEntityKey,
  type MasterDataAgentMaintenanceStatus,
  type MasterDataEmployeeType,
  type MasterDataSkillCategory,
  type MasterDataWorkplaceServiceTeamType,
  type MasterDataWorkplaceBindingRow,
  type MasterDataEmployeeListSkill,
} from "./master-data-maintenance-types"

export const taskCodeLabelPattern = /\b(?:F|B|Q|IM|US|DB)\d{3}\b/g

export const smokeLabelPattern = /-SMOKE(?=-|\b)/gi

export function formatImportBatchDisplayLabel(batchId: string): string {
  return batchId
    .replace(taskCodeLabelPattern, "业务")
    .replace(smokeLabelPattern, "")
}

export function formatMasterDataVisibleValue(value: string): string {
  return value
    .replace(taskCodeLabelPattern, "业务")
    .replace(smokeLabelPattern, "")
}

export function summarizeGroupedStatus(
  statuses: MasterDataAgentMaintenanceStatus[]
): MasterDataAgentMaintenanceStatus {
  if (statuses.includes("active")) {
    return "active"
  }

  return statuses[0] ?? "inactive"
}

export function pickEarliestValue(values: string[]): string {
  const sorted = values.filter(Boolean).sort()
  return sorted[0] ?? ""
}

export function pickLatestValue(values: string[]): string {
  const sorted = values.filter(Boolean).sort()
  return sorted[sorted.length - 1] ?? ""
}

export function pickFirstValue(values: string[]): string {
  return values.find(Boolean) ?? ""
}

export function deduplicateVendorWorkplaceBindings(
  bindings: MasterDataWorkplaceBindingRow[]
) {
  const byWorkplacePeriod = new Map<string, MasterDataWorkplaceBindingRow>()

  for (const binding of bindings) {
    if (!binding.workplace_id) {
      continue
    }

    const key = [
      binding.workplace_id,
      binding.effective_from,
      binding.effective_to,
      binding.batch_id,
    ].join(":")

    if (!byWorkplacePeriod.has(key)) {
      byWorkplacePeriod.set(key, binding)
    }
  }

  return [...byWorkplacePeriod.values()]
}

export function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

export function isReferenceEntity(
  entityKey: MasterDataMaintenanceEntityKey
): entityKey is "sites" | "vendors" | "skills" {
  return ["sites", "vendors", "skills"].includes(entityKey)
}

export function formatMasterDataEmployeeType(employeeType: MasterDataEmployeeType) {
  if (employeeType === "internal") {
    return "自有员工"
  }

  return "外包员工"
}

export function formatMasterDataEmployeeStatus(status: MasterDataAgentMaintenanceStatus) {
  if (status === "active") {
    return "生效"
  }

  if (status === "frozen") {
    return "冻结"
  }

  return "停用"
}

export function formatMasterDataServiceTeamType(
  teamType: MasterDataWorkplaceServiceTeamType
) {
  return teamType === "internal" ? "自有团队" : "供应商团队"
}

export function formatEffectivePeriod(effectiveFrom: string, effectiveTo: string) {
  return `${effectiveFrom} 至 ${effectiveTo}`
}

export function formatMasterDataSkillCategory(
  category: MasterDataSkillCategory | null
) {
  if (category === "online") {
    return "在线技能组"
  }

  if (category === "hotline") {
    return "热线技能组"
  }

  if (category === "ticket") {
    return "工单技能组"
  }

  return "未分类技能组"
}

export function formatMasterDataEmployeeSkills(skills: MasterDataEmployeeListSkill[]) {
  if (skills.length === 0) {
    return "暂无技能"
  }

  return [...skills]
    .sort((left, right) => {
      if (left.skill_name === right.skill_name) {
        return left.skill_id < right.skill_id ? -1 : 1
      }

      return left.skill_name < right.skill_name ? -1 : 1
    })
    .map(
      (skill) =>
        `${skill.skill_name}（${formatMasterDataSkillCategory(skill.skill_category)}）`
    )
    .join("、")
}

export function resolveMasterDataMaintenanceTone(
  masterDataBatches: ImportBatchListRow[],
  latestAppliedBatch: ImportBatchListRow | null,
  hasPendingFreshness: boolean
): MasterDataMaintenanceTone {
  if (masterDataBatches.length === 0) {
    return "empty"
  }

  if (!latestAppliedBatch || hasPendingFreshness) {
    return "blocked"
  }

  return "ready"
}

export function resolveMasterDataMaintenanceTitle(tone: MasterDataMaintenanceTone) {
  if (tone === "ready") {
    return "主数据维护对象已接入"
  }

  if (tone === "blocked") {
    return "主数据来源仍有阻塞"
  }

  return "等待主数据来源批次"
}

export function resolveMasterDataMaintenanceStatusLabel(
  tone: MasterDataMaintenanceTone,
  hasPendingFreshness: boolean
) {
  if (hasPendingFreshness) {
    return "待同步"
  }

  if (tone === "ready") {
    return "可查看"
  }

  return "待导入"
}

export function resolveMasterDataMaintenanceBlocker(
  masterDataBatches: ImportBatchListRow[],
  latestAppliedBatch: ImportBatchListRow | null,
  hasPendingFreshness: boolean
) {
  if (masterDataBatches.length === 0) {
    return "尚未发现主数据导入批次"
  }

  if (hasPendingFreshness) {
    return "最新主数据批次尚未应用，当前仍按上一已应用版本展示"
  }

  if (!latestAppliedBatch) {
    return "主数据批次尚未应用到业务数据"
  }

  return "无阻塞"
}

export function resolveMasterDataMaintenanceDetail(
  masterDataBatches: ImportBatchListRow[],
  latestBatch: ImportBatchListRow | null,
  latestAppliedBatch: ImportBatchListRow | null,
  hasPendingFreshness: boolean
) {
  if (masterDataBatches.length === 0) {
    return "当前还没有主数据导入批次，无法建立坐席、组织、职场、供应商和技能的维护台账。"
  }

  if (!latestAppliedBatch) {
    return `已发现主数据批次 ${latestBatch ? formatImportBatchDisplayLabel(latestBatch.batch_id) : "未知批次"}，但尚未应用到业务数据。`
  }

  if (hasPendingFreshness) {
    return `当前来源为 ${formatMasterDataVisibleValue(latestAppliedBatch.import_version_id ?? "")}，最新主数据批次尚未应用：${latestBatch ? formatImportBatchDisplayLabel(latestBatch.batch_id) : "未知批次"}。`
  }

  return `当前来源为已应用版本 ${formatMasterDataVisibleValue(latestAppliedBatch.import_version_id ?? "")}，来源批次 ${formatImportBatchDisplayLabel(latestAppliedBatch.batch_id)}。`
}
