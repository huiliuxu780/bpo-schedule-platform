import {
  type ImportBatchListRow,
} from "@/components/import-center-model"
import {
  type MasterDataMaintenanceEntityKey,
  type MasterDataMaintenanceEntity,
  type MasterDataMaintenanceSummary,
  type MasterDataEntitySourceContext,
} from "./master-data-maintenance-types"
import {
  formatImportBatchDisplayLabel,
  formatMasterDataVisibleValue,
  resolveMasterDataMaintenanceTone,
  resolveMasterDataMaintenanceTitle,
  resolveMasterDataMaintenanceStatusLabel,
  resolveMasterDataMaintenanceBlocker,
  resolveMasterDataMaintenanceDetail,
} from "./master-data-maintenance-formatters"

export const MASTER_DATA_MAINTENANCE_ENTITIES: MasterDataMaintenanceEntity[] = [
  {
    key: "agents",
    label: "坐席",
    scopeLabel: "人员基础档案、在职/冻结状态、所属供应商",
    referenceLabel: "排班明细、登录日志、状态轨迹",
    maintenanceBoundary: "人员档案、状态、组织、职场、供应商和技能关系。",
  },
  {
    key: "organizations",
    label: "组织",
    scopeLabel: "一级部门、二级部门和小组层级",
    referenceLabel: "人员归属、排班归因、日志归因",
    maintenanceBoundary: "组织编码、层级、父级组织、状态和生效周期。",
  },
  {
    key: "sites",
    label: "职场",
    scopeLabel: "职场编码、城市、时区和地点状态",
    referenceLabel: "坐席归属、排班计划、需求预测",
    maintenanceBoundary: "职场只表达地点本身，不表达团队归属。",
  },
  {
    key: "vendors",
    label: "供应商",
    scopeLabel: "供应商编码、名称、合作状态",
    referenceLabel: "坐席归属、外包员工归因、履约复核口径",
    maintenanceBoundary: "供应商编码、名称、合作状态和生效周期。",
  },
  {
    key: "skills",
    label: "技能",
    scopeLabel: "技能组、技能等级、服务语种",
    referenceLabel: "预测时段、排班技能、缺口比对",
    maintenanceBoundary: "技能编码、技能组、技能等级、服务语种和状态。",
  },
]

export const MASTER_DATA_VERSION_WORKBENCH_HREF = "/data-quality/versions?domain=master_data"

export function summarizeMasterDataMaintenanceWorkbench(
  batches: ImportBatchListRow[]
): MasterDataMaintenanceSummary {
  const masterDataBatches = batches
    .filter((batch) => batch.file_type === "master_data")
    .sort((left, right) => right.uploaded_at.localeCompare(left.uploaded_at))
  const latestBatch = masterDataBatches[0] ?? null
  const latestAppliedBatch =
    masterDataBatches.find(
      (batch) => batch.application_status === "applied" && batch.import_version_id
    ) ?? null
  const hasPendingFreshness =
    Boolean(latestBatch && latestAppliedBatch && latestBatch.batch_id !== latestAppliedBatch.batch_id)
  const tone = resolveMasterDataMaintenanceTone(
    masterDataBatches,
    latestAppliedBatch,
    hasPendingFreshness
  )
  const sourceVersionLabel = latestAppliedBatch?.import_version_id
    ? formatMasterDataVisibleValue(latestAppliedBatch.import_version_id)
    : "暂无主数据业务版本"
  const latestBatchLabel = latestBatch
    ? formatImportBatchDisplayLabel(latestBatch.batch_id)
    : "暂无主数据批次"
  const statusLabel = resolveMasterDataMaintenanceStatusLabel(tone, hasPendingFreshness)
  const blockerSummary = resolveMasterDataMaintenanceBlocker(
    masterDataBatches,
    latestAppliedBatch,
    hasPendingFreshness
  )
  const rows = MASTER_DATA_MAINTENANCE_ENTITIES.map((entity) => ({
    ...entity,
    tone,
    statusLabel,
    detailHref: `/master-data/${entity.key}`,
    sourceVersionLabel,
    sourceVersionHref: latestAppliedBatch ? MASTER_DATA_VERSION_WORKBENCH_HREF : null,
    sourceBatchLabel: latestBatchLabel,
    sourceBatchHref: latestBatch
      ? `/data-quality/import-batches/${latestBatch.batch_id}`
      : null,
    blockerSummary,
    nextActionLabel:
      tone === "ready"
        ? "查看列表"
        : "先处理来源批次",
  }))
  const readyObjects = tone === "ready" ? rows.length : 0

  return {
    tone,
    title: resolveMasterDataMaintenanceTitle(tone),
    detail: resolveMasterDataMaintenanceDetail(
      masterDataBatches,
      latestBatch,
      latestAppliedBatch,
      hasPendingFreshness
    ),
    totalObjects: rows.length,
    readyObjects,
    blockedObjects: rows.length - readyObjects,
    latestBatchLabel,
    sourceVersionLabel,
    sourceBatchHref: latestBatch
      ? `/data-quality/import-batches/${latestBatch.batch_id}`
      : null,
    versionWorkbenchHref: MASTER_DATA_VERSION_WORKBENCH_HREF,
    readonlyBoundary:
      "列表展示维护对象、来源版本和当前处理状态。",
    rows,
  }
}

export function getMasterDataMaintenanceEntity(
  entityKey: string
): MasterDataMaintenanceEntity | null {
  return (
    MASTER_DATA_MAINTENANCE_ENTITIES.find((entity) => entity.key === entityKey) ??
    null
  )
}

export function summarizeMasterDataEntitySourceContext(
  entityKey: MasterDataMaintenanceEntityKey,
  batches: ImportBatchListRow[]
): MasterDataEntitySourceContext {
  const entity = getMasterDataMaintenanceEntity(entityKey)

  if (!entity) {
    throw new Error(`Unknown master data entity: ${entityKey}`)
  }

  const workbench = summarizeMasterDataMaintenanceWorkbench(batches)
  const latestMasterDataBatch = [...batches]
    .filter((batch) => batch.file_type === "master_data")
    .sort((left, right) => right.uploaded_at.localeCompare(left.uploaded_at))[0] ?? null
  const isSourceReady = workbench.tone === "ready"
  const agentSubmitSourceBatchId =
    entity.key === "agents" && latestMasterDataBatch
      ? latestMasterDataBatch.batch_id
      : null
  const organizationSubmitSourceBatchId =
    entity.key === "organizations" && latestMasterDataBatch
      ? latestMasterDataBatch.batch_id
      : null
  const workplaceSubmitSourceBatchId =
    entity.key === "sites" && latestMasterDataBatch
      ? latestMasterDataBatch.batch_id
      : null
  const vendorSubmitSourceBatchId =
    entity.key === "vendors" && latestMasterDataBatch
      ? latestMasterDataBatch.batch_id
      : null
  const skillSubmitSourceBatchId =
    entity.key === "skills" && latestMasterDataBatch
      ? latestMasterDataBatch.batch_id
      : null

  return {
    entity,
    tone: workbench.tone,
    title: entity.label,
    detail: isSourceReady
      ? `当前基于 ${workbench.sourceVersionLabel} 展示 ${entity.label} 列表。`
      : `${entity.label}来源尚未应用或仍有阻塞。`,
    sourceVersionLabel: workbench.sourceVersionLabel,
    sourceVersionHref:
      workbench.sourceVersionLabel === "暂无主数据业务版本"
        ? null
        : workbench.versionWorkbenchHref,
    sourceBatchLabel: workbench.latestBatchLabel,
    sourceBatchHref: workbench.sourceBatchHref,
    agentSubmitSourceBatchId,
    organizationSubmitSourceBatchId,
    workplaceSubmitSourceBatchId,
    vendorSubmitSourceBatchId,
    skillSubmitSourceBatchId,
  }
}
