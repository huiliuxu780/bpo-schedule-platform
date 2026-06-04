import type { ImportBatchListRow } from "@/components/import-center-model"

export type MasterDataMaintenanceTone = "ready" | "blocked" | "empty"

export type MasterDataMaintenanceEntityKey =
  | "agents"
  | "sites"
  | "vendors"
  | "projects"
  | "skills"
  | "bindings"

export type MasterDataMaintenanceEntity = {
  key: MasterDataMaintenanceEntityKey
  label: string
  scopeLabel: string
  referenceLabel: string
  maintenanceBoundary: string
}

export type MasterDataMaintenanceRow = MasterDataMaintenanceEntity & {
  tone: MasterDataMaintenanceTone
  statusLabel: string
  detailHref: string
  sourceVersionLabel: string
  sourceVersionHref: string | null
  sourceBatchLabel: string
  sourceBatchHref: string | null
  blockerSummary: string
  nextActionLabel: string
}

export type MasterDataMaintenanceSummary = {
  tone: MasterDataMaintenanceTone
  title: string
  detail: string
  totalObjects: number
  readyObjects: number
  blockedObjects: number
  latestBatchLabel: string
  sourceVersionLabel: string
  sourceBatchHref: string | null
  versionWorkbenchHref: string
  readonlyBoundary: string
  rows: MasterDataMaintenanceRow[]
}

export type MasterDataReferenceImpact = {
  key: "schedule" | "forecast" | "actual_logs" | "review"
  label: string
  tone: "empty" | "blocked"
  countLabel: string
  detail: string
  sourceLabel: string
}

export type MasterDataMaintenanceAction = {
  key: "create" | "edit" | "freeze" | "effective_period"
  label: string
  statusLabel: "待预校验" | "来源阻塞"
  targetScope: string
  referenceCheckLabel: string
  failureBoundary: string
  submitLabel: "暂不提交" | "提交新增" | "提交编辑" | "提交冻结" | "提交有效期"
  canSubmit: boolean
}

export type MasterDataAgentMaintenanceActionKey = MasterDataMaintenanceAction["key"]

export type MasterDataAgentMaintenanceStatus = "active" | "frozen" | "inactive"

export type MasterDataAgentMaintenanceDraft = {
  action: MasterDataAgentMaintenanceActionKey
  sourceBatchId: string
  employeeId: string
  employeeName?: string
  status?: MasterDataAgentMaintenanceStatus
  effectiveFrom?: string
  effectiveTo?: string
}

export type MasterDataAgentMaintenancePayload = {
  action: MasterDataAgentMaintenanceActionKey
  source_batch_id: string
  employee_name?: string
  status?: MasterDataAgentMaintenanceStatus
  effective_from?: string
  effective_to?: string
}

export type MasterDataAgentMaintenanceFeedback = {
  tone: "success" | "error"
  title: string
  detail: string
}

export type MasterDataEntityDetailSummary = {
  entity: MasterDataMaintenanceEntity
  tone: MasterDataMaintenanceTone
  title: string
  detail: string
  sourceVersionLabel: string
  sourceVersionHref: string | null
  sourceBatchLabel: string
  sourceBatchHref: string | null
  effectivePeriodLabel: string
  freezeStatusLabel: string
  referenceImpacts: MasterDataReferenceImpact[]
  maintenanceActions: MasterDataMaintenanceAction[]
  agentSubmitSourceBatchId: string | null
}

export const MASTER_DATA_MAINTENANCE_ENTITIES: MasterDataMaintenanceEntity[] = [
  {
    key: "agents",
    label: "坐席",
    scopeLabel: "人员基础档案、在职/冻结状态、所属供应商",
    referenceLabel: "排班明细、登录日志、状态轨迹",
    maintenanceBoundary: "本页只读；新增、冻结和有效期维护留到受控维护动作。",
  },
  {
    key: "sites",
    label: "职场",
    scopeLabel: "站点编码、城市、时区和运营状态",
    referenceLabel: "坐席归属、排班计划、需求预测",
    maintenanceBoundary: "本页只展示维护对象和来源版本，不修改站点状态。",
  },
  {
    key: "vendors",
    label: "供应商",
    scopeLabel: "供应商编码、名称、合作状态",
    referenceLabel: "坐席归属、项目绑定、结算复盘口径",
    maintenanceBoundary: "本轮不进入供应商新增、停用或权限隔离。",
  },
  {
    key: "projects",
    label: "项目",
    scopeLabel: "项目编码、业务线、服务范围",
    referenceLabel: "需求预测、排班计划、复核案例",
    maintenanceBoundary: "本页不定义生产状态码或结算规则。",
  },
  {
    key: "skills",
    label: "技能",
    scopeLabel: "技能组、技能等级、服务语种",
    referenceLabel: "预测时段、排班技能、缺口比对",
    maintenanceBoundary: "技能变更和版本追踪由后续任务承接。",
  },
  {
    key: "bindings",
    label: "绑定关系",
    scopeLabel: "坐席-项目-技能-职场-供应商关系",
    referenceLabel: "排班展开、预测对齐、状态日志归因",
    maintenanceBoundary: "本轮只标记引用影响，不提供批量绑定维护。",
  },
]

const MASTER_DATA_VERSION_WORKBENCH_HREF = "/data-quality/versions?domain=master_data"

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
  const sourceVersionLabel =
    latestAppliedBatch?.import_version_id ?? "暂无主数据业务版本"
  const latestBatchLabel = latestBatch?.batch_id ?? "暂无主数据批次"
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
        ? "查看详情与受控动作"
        : "先处理来源批次后再进入维护",
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
      "当前工作台展示维护对象、来源版本和阻塞原因；详情页提供受控动作安全壳，但不提交真实新增、修改、冻结、批量、审批、权限或导出动作。",
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

export function summarizeMasterDataMaintenanceEntityDetail(
  entityKey: MasterDataMaintenanceEntityKey,
  batches: ImportBatchListRow[]
): MasterDataEntityDetailSummary {
  const entity = getMasterDataMaintenanceEntity(entityKey)

  if (!entity) {
    throw new Error(`Unknown master data entity: ${entityKey}`)
  }

  const workbench = summarizeMasterDataMaintenanceWorkbench(batches)
  const isSourceReady = workbench.tone === "ready"
  const agentSubmitSourceBatchId =
    entity.key === "agents" && workbench.latestBatchLabel !== "暂无主数据批次"
      ? workbench.latestBatchLabel
      : null

  return {
    entity,
    tone: workbench.tone,
    title: `${entity.label}详情与引用影响`,
    detail: isSourceReady
      ? `当前基于 ${workbench.sourceVersionLabel} 展示 ${entity.label} 的维护边界和引用影响空态。`
      : `${entity.label}来源尚未应用或仍有阻塞，暂不展示引用影响明细。`,
    sourceVersionLabel: workbench.sourceVersionLabel,
    sourceVersionHref:
      workbench.sourceVersionLabel === "暂无主数据业务版本"
        ? null
        : workbench.versionWorkbenchHref,
    sourceBatchLabel: workbench.latestBatchLabel,
    sourceBatchHref: workbench.sourceBatchHref,
    effectivePeriodLabel: "暂无实体级有效期明细",
    freezeStatusLabel: "暂无实体级冻结明细",
    referenceImpacts: buildMasterDataReferenceImpacts(entity, isSourceReady),
    maintenanceActions: buildMasterDataMaintenanceActions(
      entity,
      isSourceReady,
      Boolean(agentSubmitSourceBatchId)
    ),
    agentSubmitSourceBatchId,
  }
}

export function buildMasterDataAgentMaintenanceApiPath(employeeId: string): string {
  return `/api/v1/master-data/employees/${encodeURIComponent(employeeId)}/maintenance`
}

export function buildMasterDataAgentMaintenancePayload(
  draft: MasterDataAgentMaintenanceDraft
): MasterDataAgentMaintenancePayload {
  return compactMasterDataAgentMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    employee_name: draft.employeeName,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function summarizeMasterDataAgentMaintenanceFeedback(
  searchParams: Record<string, string | string[] | undefined>
): MasterDataAgentMaintenanceFeedback | null {
  const status = getSingleSearchParam(searchParams.maintenance_status)

  if (status === "success") {
    const employeeId = getSingleSearchParam(searchParams.employee_id) || "未知坐席"
    const employeeName = getSingleSearchParam(searchParams.employee_name) || "未返回姓名"
    const employeeStatus = getSingleSearchParam(searchParams.employee_status) || "未知状态"
    const actionStatus = getSingleSearchParam(searchParams.action_status) || "submitted"

    return {
      tone: "success",
      title: "坐席维护已提交",
      detail: `${employeeId} ${employeeName} 已 ${actionStatus}，当前状态 ${employeeStatus}。`,
    }
  }

  if (status === "error") {
    const code = getSingleSearchParam(searchParams.maintenance_code) || "MASTER_DATA_AGENT_SUBMIT_FAILED"
    const message = getSingleSearchParam(searchParams.maintenance_message) || "后端未返回错误说明"

    return {
      tone: "error",
      title: "坐席维护提交失败",
      detail: `${code}: ${message}`,
    }
  }

  return null
}

function buildMasterDataReferenceImpacts(
  entity: MasterDataMaintenanceEntity,
  isSourceReady: boolean
): MasterDataReferenceImpact[] {
  const blockedDetail = "来源版本未就绪，暂不展示引用影响。"
  const emptyPrefix = `${entity.label}引用影响明细尚未接入，当前不伪造数量。`

  return [
    {
      key: "schedule",
      label: "排班引用",
      tone: isSourceReady ? "empty" : "blocked",
      countLabel: "不伪造数量",
      detail: isSourceReady ? `${emptyPrefix} 后续会说明受影响排班版本和班次展开。` : blockedDetail,
      sourceLabel: "人员排班版本、班次明细",
    },
    {
      key: "forecast",
      label: "预测引用",
      tone: isSourceReady ? "empty" : "blocked",
      countLabel: "不伪造数量",
      detail: isSourceReady ? `${emptyPrefix} 后续会说明受影响预测版本、技能组和半小时粒度。` : blockedDetail,
      sourceLabel: "需求预测版本、技能组时段",
    },
    {
      key: "actual_logs",
      label: "登录/状态引用",
      tone: isSourceReady ? "empty" : "blocked",
      countLabel: "不伪造数量",
      detail: isSourceReady ? `${emptyPrefix} 后续会说明受影响登录事件、状态区间和业务日。` : blockedDetail,
      sourceLabel: "登录日志、状态日志",
    },
    {
      key: "review",
      label: "比对与复核引用",
      tone: isSourceReady ? "empty" : "blocked",
      countLabel: "不伪造数量",
      detail: isSourceReady ? `${emptyPrefix} 后续会说明相关比对结果和复核案例。` : blockedDetail,
      sourceLabel: "comparison run、review case",
    },
  ]
}

function buildMasterDataMaintenanceActions(
  entity: MasterDataMaintenanceEntity,
  isSourceReady: boolean,
  hasSourceBatch: boolean
): MasterDataMaintenanceAction[] {
  const actionLabels = buildMasterDataActionLabels(entity.label)
  const canSubmitAgent = entity.key === "agents" && hasSourceBatch

  return [
    {
      key: "create",
      label: actionLabels.create,
      statusLabel: isSourceReady ? "待预校验" : "来源阻塞",
      targetScope: `仅限单个${entity.label}对象，不进入批量新增。`,
      referenceCheckLabel: buildMasterDataReferenceCheckLabel(entity, isSourceReady),
      failureBoundary: buildMasterDataFailureBoundary(entity, isSourceReady),
      submitLabel: canSubmitAgent ? "提交新增" : "暂不提交",
      canSubmit: canSubmitAgent,
    },
    {
      key: "edit",
      label: actionLabels.edit,
      statusLabel: isSourceReady ? "待预校验" : "来源阻塞",
      targetScope: `仅限单个${entity.label}字段修正，不修改生产公式或结算口径。`,
      referenceCheckLabel: buildMasterDataReferenceCheckLabel(entity, isSourceReady),
      failureBoundary: buildMasterDataFailureBoundary(entity, isSourceReady),
      submitLabel: canSubmitAgent ? "提交编辑" : "暂不提交",
      canSubmit: canSubmitAgent,
    },
    {
      key: "freeze",
      label: actionLabels.freeze,
      statusLabel: isSourceReady ? "待预校验" : "来源阻塞",
      targetScope: `仅限单个${entity.label}冻结或恢复，不建立权限、审批或发布流程。`,
      referenceCheckLabel: buildMasterDataReferenceCheckLabel(entity, isSourceReady),
      failureBoundary: buildMasterDataFailureBoundary(entity, isSourceReady),
      submitLabel: canSubmitAgent ? "提交冻结" : "暂不提交",
      canSubmit: canSubmitAgent,
    },
    {
      key: "effective_period",
      label: actionLabels.effectivePeriod,
      statusLabel: isSourceReady ? "待预校验" : "来源阻塞",
      targetScope: `仅限单个${entity.label}有效期调整，不改历史版本展开结果。`,
      referenceCheckLabel: buildMasterDataReferenceCheckLabel(entity, isSourceReady),
      failureBoundary: buildMasterDataFailureBoundary(entity, isSourceReady),
      submitLabel: canSubmitAgent ? "提交有效期" : "暂不提交",
      canSubmit: canSubmitAgent,
    },
  ]
}

function buildMasterDataActionLabels(entityLabel: string) {
  return {
    create: `新增${entityLabel}`,
    edit: `编辑${entityLabel}`,
    freeze: `冻结${entityLabel}`,
    effectivePeriod: `调整${entityLabel}有效期`,
  }
}

function buildMasterDataReferenceCheckLabel(
  entity: MasterDataMaintenanceEntity,
  isSourceReady: boolean
) {
  if (!isSourceReady) {
    return "来源版本未就绪，禁止进入写入。"
  }

  if (entity.key === "agents") {
    return "提交前只校验坐席单实体字段；引用影响仍保持空态，不伪造数量。"
  }

  return "引用影响校验：当前只有空态摘要，不伪造数量；提交前必须补齐真实引用结果。"
}

function buildMasterDataFailureBoundary(
  entity: MasterDataMaintenanceEntity,
  isSourceReady: boolean
) {
  if (!isSourceReady) {
    return "先应用主数据来源批次，再重新检查引用影响。"
  }

  if (entity.key === "agents") {
    return "调用 IM108 单坐席 API；缺少坐席、重复创建、字段缺失或有效期无效时展示后端错误码。"
  }

  return "后端写入未接入；若引用校验缺失、实体缺失、来源版本过期或动作越界，必须阻塞提交。"
}

function compactMasterDataAgentMaintenancePayload(
  payload: MasterDataAgentMaintenancePayload
): MasterDataAgentMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataAgentMaintenancePayload
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

function resolveMasterDataMaintenanceTone(
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

function resolveMasterDataMaintenanceTitle(tone: MasterDataMaintenanceTone) {
  if (tone === "ready") {
    return "主数据维护对象已接入"
  }

  if (tone === "blocked") {
    return "主数据来源仍有阻塞"
  }

  return "等待主数据来源批次"
}

function resolveMasterDataMaintenanceStatusLabel(
  tone: MasterDataMaintenanceTone,
  hasPendingFreshness: boolean
) {
  if (hasPendingFreshness) {
    return "待同步"
  }

  if (tone === "ready") {
    return "只读可查看"
  }

  return "待导入"
}

function resolveMasterDataMaintenanceBlocker(
  masterDataBatches: ImportBatchListRow[],
  latestAppliedBatch: ImportBatchListRow | null,
  hasPendingFreshness: boolean
) {
  if (masterDataBatches.length === 0) {
    return "尚未发现主数据导入批次"
  }

  if (hasPendingFreshness) {
    return "最新主数据批次尚未应用，当前仍按上一已应用版本只读展示"
  }

  if (!latestAppliedBatch) {
    return "主数据批次尚未应用到业务数据"
  }

  return "无阻塞；当前仅开放只读查看"
}

function resolveMasterDataMaintenanceDetail(
  masterDataBatches: ImportBatchListRow[],
  latestBatch: ImportBatchListRow | null,
  latestAppliedBatch: ImportBatchListRow | null,
  hasPendingFreshness: boolean
) {
  if (masterDataBatches.length === 0) {
    return "当前还没有主数据导入批次，无法建立坐席、职场、供应商、项目、技能和绑定关系的维护台账。"
  }

  if (!latestAppliedBatch) {
    return `已发现主数据批次 ${latestBatch?.batch_id ?? "未知批次"}，但尚未应用到业务数据。`
  }

  if (hasPendingFreshness) {
    return `当前只读来源为 ${latestAppliedBatch.import_version_id}，但最新主数据批次尚未应用：${latestBatch?.batch_id ?? "未知批次"}。`
  }

  return `当前只读来源为已应用版本 ${latestAppliedBatch.import_version_id}，来源批次 ${latestAppliedBatch.batch_id}。`
}
