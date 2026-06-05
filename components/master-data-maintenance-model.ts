import type { ImportBatchListRow } from "@/components/import-center-model"

const taskCodeLabelPattern = /\b(?:F|B|Q|IM|US|DB)\d{3}\b/g
const smokeLabelPattern = /-SMOKE(?=-|\b)/gi

function formatImportBatchDisplayLabel(batchId: string): string {
  return batchId
    .replace(taskCodeLabelPattern, "业务")
    .replace(smokeLabelPattern, "")
}

function formatMasterDataVisibleValue(value: string): string {
  return value
    .replace(taskCodeLabelPattern, "业务")
    .replace(smokeLabelPattern, "")
}

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

export type MasterDataAgentMaintenanceActionKey =
  | "create"
  | "edit"
  | "freeze"
  | "effective_period"

export type MasterDataAgentMaintenanceStatus = "active" | "frozen" | "inactive"
export type MasterDataEmployeeType = "internal" | "outsourced"
export type MasterDataSkillCategory = "online" | "hotline" | "ticket"

export type MasterDataAgentMaintenanceDraft = {
  action: MasterDataAgentMaintenanceActionKey
  sourceBatchId: string
  employeeId: string
  employeeName?: string
  status?: MasterDataAgentMaintenanceStatus
  employeeType?: MasterDataEmployeeType
  organizationId?: string
  workplaceId?: string
  effectiveFrom?: string
  effectiveTo?: string
}

export type MasterDataAgentSkillMaintenanceDraft = {
  sourceBatchId: string
  employeeId: string
  skillIds: string[]
  effectiveFrom: string
  effectiveTo: string
}

export type MasterDataAgentSkillMaintenancePayload = {
  action: "replace"
  source_batch_id: string
  skill_ids: string[]
  effective_from: string
  effective_to: string
}

export type MasterDataReferenceListRow = {
  reference_id: string
  reference_name: string
  status: MasterDataAgentMaintenanceStatus
  effective_from: string
  effective_to: string
  batch_id: string
  skill_category?: MasterDataSkillCategory | null
}

export type MasterDataReferenceListDisplay = {
  referenceIdLabel: string
  referenceNameLabel: string
  statusLabel: string
  skillCategoryLabel: string
  effectivePeriodLabel: string
  sourceBatchLabel: string
}

export type MasterDataReferenceListViewRow = MasterDataReferenceListRow & {
  display: MasterDataReferenceListDisplay
}

export type MasterDataReferenceManagementSummary = {
  entity: MasterDataMaintenanceEntity
  title: string
  totalRecords: number
  activeRecords: number
  frozenRecords: number
  rows: MasterDataReferenceListViewRow[]
}

export type MasterDataBindingListRow = {
  binding_id: string
  employee_id: string
  supplier_id: string
  workplace_id: string
  project_id: string
  skill_id: string
  effective_from: string
  effective_to: string
  batch_id: string
}

export type MasterDataBindingListDisplay = {
  bindingLabel: string
  employeeLabel: string
  supplierLabel: string
  workplaceLabel: string
  projectLabel: string
  skillLabel: string
  effectivePeriodLabel: string
  sourceBatchLabel: string
}

export type MasterDataBindingListViewRow = MasterDataBindingListRow & {
  display: MasterDataBindingListDisplay
}

export type MasterDataBindingManagementSummary = {
  title: string
  totalRecords: number
  rows: MasterDataBindingListViewRow[]
}

export type MasterDataAgentMaintenancePayload = {
  action: MasterDataAgentMaintenanceActionKey
  source_batch_id: string
  employee_name?: string
  status?: MasterDataAgentMaintenanceStatus
  employee_type?: MasterDataEmployeeType
  organization_id?: string
  workplace_id?: string
  effective_from?: string
  effective_to?: string
}

export type MasterDataAgentMaintenanceFeedback = {
  tone: "success" | "error"
  title: string
  detail: string
}

export type MasterDataEmployeeListSkill = {
  employee_id: string
  skill_id: string
  skill_name: string
  skill_category: MasterDataSkillCategory | null
  effective_from: string
  effective_to: string
  batch_id: string
}

export type MasterDataEmployeeListRow = {
  employee_id: string
  employee_name: string
  status: MasterDataAgentMaintenanceStatus
  employee_type: MasterDataEmployeeType
  organization_id: string | null
  organization_path: string | null
  workplace_id: string | null
  workplace_name: string | null
  effective_from: string
  effective_to: string
  batch_id: string
  skills: MasterDataEmployeeListSkill[]
}

export type MasterDataEmployeeListDisplay = {
  employeeTypeLabel: string
  statusLabel: string
  organizationLabel: string
  workplaceLabel: string
  skillSummary: string
  accountLabel: string
  jobNumberLabel: string
  publicNameLabel: string
  levelLabel: string
  freezeReasonLabel: string
  editHref: string
  freezeHref: string
  skillsEditHref: string
}

export type MasterDataEmployeeListViewRow = MasterDataEmployeeListRow & {
  display: MasterDataEmployeeListDisplay
}

export type MasterDataEmployeeListSummary = {
  totalEmployees: number
  activeEmployees: number
  internalEmployees: number
  outsourcedEmployees: number
  rows: MasterDataEmployeeListViewRow[]
}

export type MasterDataAgentManagementFilterField = {
  key:
    | "employee_name"
    | "skill_group"
    | "employee_id"
    | "status"
    | "organization"
    | "workplace"
    | "employee_type"
  label: string
  placeholder: string
  type: "input" | "select"
  options?: {
    value: string
    label: string
  }[]
}

export type MasterDataAgentManagementAction = {
  key: "employee_type" | "organization" | "skill_group" | "freeze"
  label: string
}

export type MasterDataAgentManagementColumn = {
  key:
    | "name"
    | "account"
    | "job_number"
    | "public_name"
    | "organization"
    | "skill_group"
    | "level"
    | "status"
    | "freeze_reason"
    | "id"
    | "actions"
  label: string
}

export type MasterDataAgentManagementSummary = MasterDataEmployeeListSummary & {
  title: "客服人员"
  createHref: string
  activeFilters: MasterDataAgentManagementFilters
  filterFields: MasterDataAgentManagementFilterField[]
  bulkActions: MasterDataAgentManagementAction[]
  tableColumns: MasterDataAgentManagementColumn[]
}

export type MasterDataAgentManagementFilters = Partial<
  Record<MasterDataAgentManagementFilterField["key"], string>
>

export type MasterDataEntitySourceContext = {
  entity: MasterDataMaintenanceEntity
  tone: MasterDataMaintenanceTone
  title: string
  detail: string
  sourceVersionLabel: string
  sourceVersionHref: string | null
  sourceBatchLabel: string
  sourceBatchHref: string | null
  agentSubmitSourceBatchId: string | null
}

export const MASTER_DATA_MAINTENANCE_ENTITIES: MasterDataMaintenanceEntity[] = [
  {
    key: "agents",
    label: "坐席",
    scopeLabel: "人员基础档案、在职/冻结状态、所属供应商",
    referenceLabel: "排班明细、登录日志、状态轨迹",
    maintenanceBoundary: "人员档案、状态、组织、职场、供应商和技能关系。",
  },
  {
    key: "sites",
    label: "职场",
    scopeLabel: "站点编码、城市、时区和运营状态",
    referenceLabel: "坐席归属、排班计划、需求预测",
    maintenanceBoundary: "职场编码、城市、时区、运营状态和生效周期。",
  },
  {
    key: "vendors",
    label: "供应商",
    scopeLabel: "供应商编码、名称、合作状态",
    referenceLabel: "坐席归属、项目绑定、履约复核口径",
    maintenanceBoundary: "供应商编码、名称、合作状态和生效周期。",
  },
  {
    key: "projects",
    label: "项目",
    scopeLabel: "项目编码、业务线、服务范围",
    referenceLabel: "需求预测、排班计划、复核案例",
    maintenanceBoundary: "项目编码、业务线、服务范围、状态和生效周期。",
  },
  {
    key: "skills",
    label: "技能",
    scopeLabel: "技能组、技能等级、服务语种",
    referenceLabel: "预测时段、排班技能、缺口比对",
    maintenanceBoundary: "技能编码、技能组、技能等级、服务语种和状态。",
  },
  {
    key: "bindings",
    label: "绑定关系",
    scopeLabel: "坐席-项目-技能-职场-供应商关系",
    referenceLabel: "排班展开、预测对齐、状态日志归因",
    maintenanceBoundary: "人员、项目、技能、职场、供应商之间的有效绑定关系。",
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
  }
}

export function buildMasterDataAgentMaintenanceApiPath(employeeId: string): string {
  return `/api/v1/master-data/employees/${encodeURIComponent(employeeId)}/maintenance`
}

export function buildMasterDataAgentSkillMaintenanceApiPath(
  employeeId: string
): string {
  return `/api/v1/master-data/employees/${encodeURIComponent(employeeId)}/skills/maintenance`
}

export function buildMasterDataAgentMaintenancePayload(
  draft: MasterDataAgentMaintenanceDraft
): MasterDataAgentMaintenancePayload {
  return compactMasterDataAgentMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    employee_name: draft.employeeName,
    status: draft.status,
    employee_type: draft.employeeType,
    organization_id: draft.organizationId,
    workplace_id: draft.workplaceId,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataAgentSkillMaintenancePayload(
  draft: MasterDataAgentSkillMaintenanceDraft
): MasterDataAgentSkillMaintenancePayload {
  return {
    action: "replace",
    source_batch_id: draft.sourceBatchId,
    skill_ids: draft.skillIds,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  }
}

export function summarizeMasterDataEmployeeList(
  employees: MasterDataEmployeeListRow[]
): MasterDataEmployeeListSummary {
  const rows = employees.map((employee) => ({
    ...employee,
    display: {
      employeeTypeLabel: formatMasterDataEmployeeType(employee.employee_type),
      statusLabel: formatMasterDataEmployeeStatus(employee.status),
      organizationLabel: employee.organization_path ?? "未绑定组织",
      workplaceLabel: employee.workplace_name ?? "未绑定职场",
      skillSummary: formatMasterDataEmployeeSkills(employee.skills),
      accountLabel: employee.employee_id,
      jobNumberLabel: "未配置",
      publicNameLabel: employee.employee_name,
      levelLabel: formatMasterDataEmployeeType(employee.employee_type),
      freezeReasonLabel: employee.status === "frozen" ? "主数据冻结" : "-",
      editHref: `/master-data/agents/${encodeURIComponent(employee.employee_id)}/edit`,
      freezeHref: `/master-data/agents?freeze_employee_id=${encodeURIComponent(employee.employee_id)}`,
      skillsEditHref: `/master-data/agents/${encodeURIComponent(employee.employee_id)}/skills/edit`,
    },
  }))

  return {
    totalEmployees: rows.length,
    activeEmployees: rows.filter((row) => row.status === "active").length,
    internalEmployees: rows.filter((row) => row.employee_type === "internal").length,
    outsourcedEmployees: rows.filter((row) => row.employee_type === "outsourced")
      .length,
    rows,
  }
}

export function summarizeMasterDataAgentManagement(
  employees: MasterDataEmployeeListRow[],
  filters: MasterDataAgentManagementFilters = {}
): MasterDataAgentManagementSummary {
  const normalizedFilters = normalizeMasterDataAgentManagementFilters(filters)
  const filteredEmployees = employees.filter((employee) =>
    matchesMasterDataAgentManagementFilters(employee, normalizedFilters)
  )

  return {
    ...summarizeMasterDataEmployeeList(filteredEmployees),
    title: "客服人员",
    createHref: "/master-data/agents/new",
    activeFilters: normalizedFilters,
    filterFields: [
      {
        key: "employee_name",
        label: "客服名",
        placeholder: "请输入",
        type: "input",
      },
      {
        key: "skill_group",
        label: "技能组",
        placeholder: "请选择",
        type: "select",
        options: [
          { value: "all", label: "全部技能组" },
          { value: "online", label: "在线技能组" },
          { value: "hotline", label: "热线技能组" },
          { value: "ticket", label: "工单技能组" },
        ],
      },
      {
        key: "employee_id",
        label: "账号",
        placeholder: "请输入",
        type: "input",
      },
      {
        key: "status",
        label: "状态",
        placeholder: "请选择",
        type: "select",
        options: [
          { value: "all", label: "全部状态" },
          { value: "active", label: "生效" },
          { value: "frozen", label: "冻结" },
          { value: "inactive", label: "停用" },
        ],
      },
      {
        key: "organization",
        label: "组织",
        placeholder: "请选择",
        type: "select",
        options: [{ value: "all", label: "全部组织" }],
      },
      {
        key: "workplace",
        label: "职场",
        placeholder: "请选择",
        type: "select",
        options: [{ value: "all", label: "全部职场" }],
      },
      {
        key: "employee_type",
        label: "坐席类型",
        placeholder: "全部",
        type: "select",
        options: [
          { value: "all", label: "全部" },
          { value: "internal", label: "自有员工" },
          { value: "outsourced", label: "外包员工" },
        ],
      },
    ],
    bulkActions: [
      { key: "employee_type", label: "人员类型" },
      { key: "organization", label: "组织架构" },
      { key: "skill_group", label: "技能组" },
      { key: "freeze", label: "冻结/解冻" },
    ],
    tableColumns: [
      { key: "name", label: "姓名" },
      { key: "account", label: "账号" },
      { key: "job_number", label: "工号" },
      { key: "public_name", label: "对外展示名" },
      { key: "organization", label: "组织" },
      { key: "skill_group", label: "技能组" },
      { key: "level", label: "级别" },
      { key: "status", label: "状态" },
      { key: "freeze_reason", label: "冻结/解冻原因" },
      { key: "id", label: "ID" },
      { key: "actions", label: "操作" },
    ],
  }
}

export function summarizeMasterDataReferenceManagement(
  entityKey: MasterDataMaintenanceEntityKey,
  references: MasterDataReferenceListRow[]
): MasterDataReferenceManagementSummary {
  const entity = getMasterDataMaintenanceEntity(entityKey)

  if (!entity || !isReferenceEntity(entity.key)) {
    throw new Error(`Unknown reference master data entity: ${entityKey}`)
  }

  const rows = [...references]
    .sort((left, right) => left.reference_id.localeCompare(right.reference_id))
    .map((reference) => ({
      ...reference,
      display: {
        referenceIdLabel: formatMasterDataVisibleValue(reference.reference_id),
        referenceNameLabel: formatMasterDataVisibleValue(reference.reference_name),
        statusLabel: formatMasterDataEmployeeStatus(reference.status),
        skillCategoryLabel:
          entity.key === "skills"
            ? formatMasterDataSkillCategory(reference.skill_category ?? null)
            : entity.label,
        effectivePeriodLabel: formatEffectivePeriod(
          reference.effective_from,
          reference.effective_to
        ),
        sourceBatchLabel: formatImportBatchDisplayLabel(reference.batch_id),
      },
    }))

  return {
    entity,
    title: entity.label,
    totalRecords: rows.length,
    activeRecords: rows.filter((row) => row.status === "active").length,
    frozenRecords: rows.filter((row) => row.status === "frozen").length,
    rows,
  }
}

export function summarizeMasterDataBindingManagement(
  bindings: MasterDataBindingListRow[]
): MasterDataBindingManagementSummary {
  const rows = [...bindings]
    .sort((left, right) => left.binding_id.localeCompare(right.binding_id))
    .map((binding) => ({
      ...binding,
      display: {
        bindingLabel: formatMasterDataVisibleValue(binding.binding_id),
        employeeLabel: formatMasterDataVisibleValue(binding.employee_id),
        supplierLabel: formatMasterDataVisibleValue(binding.supplier_id),
        workplaceLabel: formatMasterDataVisibleValue(binding.workplace_id),
        projectLabel: formatMasterDataVisibleValue(binding.project_id),
        skillLabel: formatMasterDataVisibleValue(binding.skill_id),
        effectivePeriodLabel: formatEffectivePeriod(
          binding.effective_from,
          binding.effective_to
        ),
        sourceBatchLabel: formatImportBatchDisplayLabel(binding.batch_id),
      },
    }))

  return {
    title: "绑定关系",
    totalRecords: rows.length,
    rows,
  }
}

function normalizeMasterDataAgentManagementFilters(
  filters: MasterDataAgentManagementFilters
): MasterDataAgentManagementFilters {
  return Object.fromEntries(
    Object.entries(filters)
      .map(([key, value]) => [key, value?.trim() ?? ""])
      .filter(([, value]) => value && value !== "all")
  ) as MasterDataAgentManagementFilters
}

function matchesMasterDataAgentManagementFilters(
  employee: MasterDataEmployeeListRow,
  filters: MasterDataAgentManagementFilters
) {
  const employeeName = filters.employee_name
  if (employeeName && !employee.employee_name.includes(employeeName)) {
    return false
  }

  const employeeId = filters.employee_id
  if (employeeId && !employee.employee_id.includes(employeeId)) {
    return false
  }

  if (filters.status && employee.status !== filters.status) {
    return false
  }

  if (filters.employee_type && employee.employee_type !== filters.employee_type) {
    return false
  }

  const skillGroup = filters.skill_group
  if (
    skillGroup &&
    !employee.skills.some((skill) => skill.skill_category === skillGroup)
  ) {
    return false
  }

  return true
}

export function summarizeMasterDataAgentMaintenanceFeedback(
  searchParams: Record<string, string | string[] | undefined>
): MasterDataAgentMaintenanceFeedback | null {
  return summarizeMasterDataMaintenanceFeedback(searchParams)
}

export function summarizeMasterDataMaintenanceFeedback(
  searchParams: Record<string, string | string[] | undefined>
): MasterDataAgentMaintenanceFeedback | null {
  const status = getSingleSearchParam(searchParams.maintenance_status)

  if (status === "success") {
    const recordId =
      getSingleSearchParam(searchParams.record_id) ||
      getSingleSearchParam(searchParams.employee_id) ||
      "未知对象"
    const recordName =
      getSingleSearchParam(searchParams.record_name) ||
      getSingleSearchParam(searchParams.employee_name) ||
      "未返回名称"
    const recordStatus =
      getSingleSearchParam(searchParams.record_status) ||
      getSingleSearchParam(searchParams.employee_status) ||
      "未知状态"
    const actionStatus = getSingleSearchParam(searchParams.action_status) || "submitted"

    return {
      tone: "success",
      title: "人员保存成功",
      detail: `${recordId} ${recordName} 已 ${actionStatus}，当前状态 ${recordStatus}。`,
    }
  }

  if (status === "error") {
    const code =
      getSingleSearchParam(searchParams.maintenance_code) ||
      "MASTER_DATA_MAINTENANCE_SUBMIT_FAILED"
    const message = getSingleSearchParam(searchParams.maintenance_message) || "后端未返回错误说明"

    return {
      tone: "error",
      title: "人员保存失败",
      detail: `${code}: ${message}`,
    }
  }

  return null
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

function isReferenceEntity(
  entityKey: MasterDataMaintenanceEntityKey
): entityKey is "sites" | "vendors" | "projects" | "skills" {
  return ["sites", "vendors", "projects", "skills"].includes(entityKey)
}

function formatMasterDataEmployeeType(employeeType: MasterDataEmployeeType) {
  if (employeeType === "internal") {
    return "自有员工"
  }

  return "外包员工"
}

function formatMasterDataEmployeeStatus(status: MasterDataAgentMaintenanceStatus) {
  if (status === "active") {
    return "生效"
  }

  if (status === "frozen") {
    return "冻结"
  }

  return "停用"
}

function formatEffectivePeriod(effectiveFrom: string, effectiveTo: string) {
  return `${effectiveFrom} 至 ${effectiveTo}`
}

function formatMasterDataSkillCategory(
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

function formatMasterDataEmployeeSkills(skills: MasterDataEmployeeListSkill[]) {
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
    return "可查看"
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
    return "最新主数据批次尚未应用，当前仍按上一已应用版本展示"
  }

  if (!latestAppliedBatch) {
    return "主数据批次尚未应用到业务数据"
  }

  return "无阻塞"
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
    return `已发现主数据批次 ${latestBatch ? formatImportBatchDisplayLabel(latestBatch.batch_id) : "未知批次"}，但尚未应用到业务数据。`
  }

  if (hasPendingFreshness) {
    return `当前来源为 ${formatMasterDataVisibleValue(latestAppliedBatch.import_version_id ?? "")}，最新主数据批次尚未应用：${latestBatch ? formatImportBatchDisplayLabel(latestBatch.batch_id) : "未知批次"}。`
  }

  return `当前来源为已应用版本 ${formatMasterDataVisibleValue(latestAppliedBatch.import_version_id ?? "")}，来源批次 ${formatImportBatchDisplayLabel(latestAppliedBatch.batch_id)}。`
}
