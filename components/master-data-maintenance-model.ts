import type {
  ImportBatchListRow,
  ImportFieldMappingTemplate,
  ImportFileType,
} from "@/components/import-center-model"

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
  | "organizations"
  | "sites"
  | "vendors"
  | "skills"

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
export type MasterDataWorkplaceMaintenanceActionKey = "create" | "edit" | "freeze"
export type MasterDataVendorMaintenanceActionKey = "create" | "edit" | "freeze"
export type MasterDataSkillMaintenanceActionKey = "create" | "edit" | "freeze"
export type MasterDataOrganizationMaintenanceActionKey =
  | "create"
  | "edit"
  | "freeze"
export type MasterDataWorkplaceServiceTeamMaintenanceActionKey =
  | "create"
  | "edit"
  | "freeze"

export type MasterDataAgentMaintenanceStatus = "active" | "frozen" | "inactive"
export type MasterDataEmployeeType = "internal" | "outsourced"
export type MasterDataSkillCategory = "online" | "hotline" | "ticket"
export type MasterDataWorkplaceServiceTeamType = "internal" | "supplier"

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

export type MasterDataWorkplaceMaintenanceDraft = {
  action: MasterDataWorkplaceMaintenanceActionKey
  sourceBatchId: string
  workplaceId: string
  workplaceName?: string
  status?: MasterDataAgentMaintenanceStatus
  effectiveFrom?: string
  effectiveTo?: string
}

export type MasterDataVendorMaintenanceDraft = {
  action: MasterDataVendorMaintenanceActionKey
  sourceBatchId: string
  vendorId: string
  vendorName?: string
  status?: MasterDataAgentMaintenanceStatus
  effectiveFrom?: string
  effectiveTo?: string
}

export type MasterDataSkillMaintenanceDraft = {
  action: MasterDataSkillMaintenanceActionKey
  sourceBatchId: string
  skillId: string
  skillName?: string
  skillCategory?: MasterDataSkillCategory
  status?: MasterDataAgentMaintenanceStatus
  effectiveFrom?: string
  effectiveTo?: string
}

export type MasterDataOrganizationMaintenanceDraft = {
  action: MasterDataOrganizationMaintenanceActionKey
  sourceBatchId: string
  organizationId: string
  organizationName?: string
  organizationLevel?: number
  parentOrganizationId?: string
  status?: MasterDataAgentMaintenanceStatus
  effectiveFrom?: string
  effectiveTo?: string
}

export type MasterDataWorkplaceServiceTeamMaintenanceDraft = {
  action: MasterDataWorkplaceServiceTeamMaintenanceActionKey
  sourceBatchId: string
  serviceTeamId: string
  workplaceId?: string
  teamType?: MasterDataWorkplaceServiceTeamType
  teamName?: string
  organizationId?: string
  supplierId?: string
  status?: MasterDataAgentMaintenanceStatus
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
  detailHref: string | null
  editHref: string | null
  freezeHref: string | null
}

export type MasterDataReferenceListViewRow = MasterDataReferenceListRow & {
  display: MasterDataReferenceListDisplay
}

export type MasterDataOrganizationListRow = {
  organization_id: string
  organization_name: string
  organization_level: number
  parent_organization_id: string | null
  status: MasterDataAgentMaintenanceStatus
  effective_from: string
  effective_to: string
  batch_id: string
  organization_path: string
}

export type MasterDataOrganizationListDisplay = {
  organizationIdLabel: string
  organizationNameLabel: string
  organizationLevelLabel: string
  parentOrganizationLabel: string
  organizationPathLabel: string
  statusLabel: string
  effectivePeriodLabel: string
  sourceBatchLabel: string
  detailHref: string
  editHref: string
  freezeHref: string
}

export type MasterDataOrganizationListViewRow = MasterDataOrganizationListRow & {
  display: MasterDataOrganizationListDisplay
}

export type MasterDataOrganizationManagementSummary = {
  title: string
  createHref: string
  totalRecords: number
  activeRecords: number
  frozenRecords: number
  rows: MasterDataOrganizationListViewRow[]
}

export type MasterDataOrganizationDetailSummary = {
  found: boolean
  title: string
  backHref: string
  organization: MasterDataOrganizationListViewRow | null
  totalChildOrganizations: number
  totalPeople: number
  emptyChildDetail: string
  emptyPeopleDetail: string
  childRows: MasterDataOrganizationListViewRow[]
  peopleRows: MasterDataEmployeeListViewRow[]
}

export type MasterDataReferenceManagementSummary = {
  entity: MasterDataMaintenanceEntity
  title: string
  createHref: string | null
  totalRecords: number
  activeRecords: number
  frozenRecords: number
  rows: MasterDataReferenceListViewRow[]
}

export type MasterDataSkillDetailSummary = {
  found: boolean
  title: string
  backHref: string
  skill: MasterDataReferenceListViewRow | null
  totalPeople: number
  emptyPeopleDetail: string
  peopleRows: MasterDataEmployeeListViewRow[]
}

export type MasterDataWorkplaceBindingRow = {
  binding_id: string
  employee_id: string
  supplier_id: string
  workplace_id: string
  skill_id: string
  effective_from: string
  effective_to: string
  batch_id: string
}

export type MasterDataWorkplaceServiceTeamRow = {
  service_team_id: string
  workplace_id: string
  team_type: MasterDataWorkplaceServiceTeamType
  team_name: string
  organization_id: string | null
  supplier_id: string | null
  status: MasterDataAgentMaintenanceStatus
  effective_from: string
  effective_to: string
  batch_id: string
}

export type MasterDataWorkplaceOperatorSource =
  | "employee"
  | "binding"
  | "service_team"
export type MasterDataWorkplaceOperatorType = "internal" | "supplier"

export type MasterDataWorkplaceOperatorDisplay = {
  operatorTypeLabel: string
  operatorNameLabel: string
  supplierLabel: string
  recordCountLabel: string
  statusLabel: string
  sourceLabel: string
  effectivePeriodLabel: string
  sourceBatchLabel: string
  detailHref: string | null
  editHref: string | null
  freezeHref: string | null
}

export type MasterDataWorkplaceOperatorViewRow = {
  operator_key: string
  operator_type: MasterDataWorkplaceOperatorType
  operator_name: string
  supplier_id: string | null
  record_count: number
  status: MasterDataAgentMaintenanceStatus
  source_type: MasterDataWorkplaceOperatorSource
  effective_from: string
  effective_to: string
  batch_id: string
  display: MasterDataWorkplaceOperatorDisplay
}

export type MasterDataWorkplaceDetailSummary = {
  found: boolean
  title: string
  backHref: string
  workplace: MasterDataReferenceListViewRow | null
  totalOperators: number
  internalOperators: number
  supplierOperators: number
  createServiceTeamHref: string | null
  operatorRows: MasterDataWorkplaceOperatorViewRow[]
}

export type MasterDataWorkplaceServiceTeamPersonDisplay = {
  employeeNameLabel: string
  employeeTypeLabel: string
  statusLabel: string
  organizationLabel: string
  workplaceLabel: string
  skillSummary: string
  matchSourceLabel: string
}

export type MasterDataWorkplaceServiceTeamPersonViewRow =
  MasterDataEmployeeListRow & {
    display: MasterDataWorkplaceServiceTeamPersonDisplay
  }

export type MasterDataWorkplaceServiceTeamPeopleSummary = {
  totalPeople: number
  emptyDetail: string
  rows: MasterDataWorkplaceServiceTeamPersonViewRow[]
}

export type MasterDataVendorServiceWorkplaceDisplay = {
  workplaceIdLabel: string
  workplaceLabel: string
  statusLabel: string
  sourceLabel: string
  effectivePeriodLabel: string
  sourceBatchLabel: string
  detailHref: string
}

export type MasterDataVendorServiceWorkplaceViewRow = {
  service_key: string
  workplace_id: string
  status: MasterDataAgentMaintenanceStatus
  effective_from: string
  effective_to: string
  batch_id: string
  display: MasterDataVendorServiceWorkplaceDisplay
}

export type MasterDataVendorServiceTeamDisplay = {
  teamNameLabel: string
  workplaceLabel: string
  statusLabel: string
  effectivePeriodLabel: string
  sourceBatchLabel: string
  detailHref: string
}

export type MasterDataVendorServiceTeamViewRow = {
  service_team_id: string
  workplace_id: string
  team_name: string
  status: MasterDataAgentMaintenanceStatus
  effective_from: string
  effective_to: string
  batch_id: string
  display: MasterDataVendorServiceTeamDisplay
}

export type MasterDataVendorDetailSummary = {
  found: boolean
  title: string
  backHref: string
  vendor: MasterDataReferenceListViewRow | null
  totalServiceWorkplaces: number
  activeServiceWorkplaces: number
  totalServiceTeams: number
  serviceRows: MasterDataVendorServiceWorkplaceViewRow[]
  serviceTeamRows: MasterDataVendorServiceTeamViewRow[]
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

export type MasterDataWorkplaceMaintenancePayload = {
  action: MasterDataWorkplaceMaintenanceActionKey
  source_batch_id: string
  reference_name?: string
  status?: MasterDataAgentMaintenanceStatus
  effective_from?: string
  effective_to?: string
}

export type MasterDataVendorMaintenancePayload = {
  action: MasterDataVendorMaintenanceActionKey
  source_batch_id: string
  reference_name?: string
  status?: MasterDataAgentMaintenanceStatus
  effective_from?: string
  effective_to?: string
}

export type MasterDataSkillMaintenancePayload = {
  action: MasterDataSkillMaintenanceActionKey
  source_batch_id: string
  reference_name?: string
  skill_category?: MasterDataSkillCategory
  status?: MasterDataAgentMaintenanceStatus
  effective_from?: string
  effective_to?: string
}

export type MasterDataOrganizationMaintenancePayload = {
  action: MasterDataOrganizationMaintenanceActionKey
  source_batch_id: string
  organization_name?: string
  organization_level?: number
  parent_organization_id?: string
  status?: MasterDataAgentMaintenanceStatus
  effective_from?: string
  effective_to?: string
}

export type MasterDataWorkplaceServiceTeamMaintenancePayload = {
  action: MasterDataWorkplaceServiceTeamMaintenanceActionKey
  source_batch_id: string
  workplace_id?: string
  team_type?: MasterDataWorkplaceServiceTeamType
  team_name?: string
  organization_id?: string
  supplier_id?: string
  status?: MasterDataAgentMaintenanceStatus
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
  sourceBatchLabel: string
  detailHref: string
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

export type MasterDataAgentServiceTeamDisplay = {
  teamNameLabel: string
  teamTypeLabel: string
  workplaceLabel: string
  statusLabel: string
  effectivePeriodLabel: string
  sourceBatchLabel: string
  matchSourceLabel: string
  detailHref: string
}

export type MasterDataAgentServiceTeamViewRow = {
  service_team_id: string
  workplace_id: string
  team_type: MasterDataWorkplaceServiceTeamType
  team_name: string
  status: MasterDataAgentMaintenanceStatus
  effective_from: string
  effective_to: string
  batch_id: string
  display: MasterDataAgentServiceTeamDisplay
}

export type MasterDataAgentDetailSummary = {
  found: boolean
  title: string
  backHref: string
  employee: MasterDataEmployeeListViewRow | null
  totalServiceTeams: number
  emptyServiceTeamDetail: string
  serviceTeamRows: MasterDataAgentServiceTeamViewRow[]
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

export type MasterDataAgentImportDialogStep = {
  key: "upload" | "mapping" | "result"
  title: string
  detail: string
}

export type MasterDataAgentImportDialogMappingMode = {
  key: "template" | "manual"
  label: string
  detail: string
}

export type MasterDataAgentImportDialogResult = {
  tone: "success" | "failed"
  title: string
  detail: string
  rowSummary: string
  batchHref: string | null
  failedRowsHref: string | null
  nextActionLabel: string
}

export type MasterDataAgentImportDialogSummary = {
  openHref: string
  closeHref: string
  resultRedirectTo: string
  fileType: ImportFileType
  templateDownloadHref: string
  templateDownloadName: string
  steps: MasterDataAgentImportDialogStep[]
  mappingModes: MasterDataAgentImportDialogMappingMode[]
  activeTemplates: ImportFieldMappingTemplate[]
  result: MasterDataAgentImportDialogResult | null
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
  importDialog: MasterDataAgentImportDialogSummary
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
  organizationSubmitSourceBatchId: string | null
  workplaceSubmitSourceBatchId: string | null
  vendorSubmitSourceBatchId: string | null
  skillSubmitSourceBatchId: string | null
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

export function buildMasterDataAgentMaintenanceApiPath(employeeId: string): string {
  return `/api/v1/master-data/employees/${encodeURIComponent(employeeId)}/maintenance`
}

export function buildMasterDataWorkplaceMaintenanceApiPath(
  workplaceId: string
): string {
  return `/api/v1/master-data/workplaces/${encodeURIComponent(workplaceId)}/maintenance`
}

export function buildMasterDataVendorMaintenanceApiPath(vendorId: string): string {
  return `/api/v1/master-data/suppliers/${encodeURIComponent(vendorId)}/maintenance`
}

export function buildMasterDataSkillMaintenanceApiPath(skillId: string): string {
  return `/api/v1/master-data/skills/${encodeURIComponent(skillId)}/maintenance`
}

export function buildMasterDataOrganizationMaintenanceApiPath(
  organizationId: string
): string {
  return `/api/v1/master-data/organizations/${encodeURIComponent(organizationId)}/maintenance`
}

export function buildMasterDataWorkplaceServiceTeamMaintenanceApiPath(
  serviceTeamId: string
): string {
  return `/api/v1/master-data/workplace-service-teams/${encodeURIComponent(serviceTeamId)}/maintenance`
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

export function buildMasterDataWorkplaceMaintenancePayload(
  draft: MasterDataWorkplaceMaintenanceDraft
): MasterDataWorkplaceMaintenancePayload {
  return compactMasterDataWorkplaceMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    reference_name: draft.workplaceName,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataVendorMaintenancePayload(
  draft: MasterDataVendorMaintenanceDraft
): MasterDataVendorMaintenancePayload {
  return compactMasterDataVendorMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    reference_name: draft.vendorName,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataSkillMaintenancePayload(
  draft: MasterDataSkillMaintenanceDraft
): MasterDataSkillMaintenancePayload {
  return compactMasterDataSkillMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    reference_name: draft.skillName,
    skill_category: draft.skillCategory,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataOrganizationMaintenancePayload(
  draft: MasterDataOrganizationMaintenanceDraft
): MasterDataOrganizationMaintenancePayload {
  return compactMasterDataOrganizationMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    organization_name: draft.organizationName,
    organization_level: draft.organizationLevel,
    parent_organization_id: draft.parentOrganizationId,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
}

export function buildMasterDataWorkplaceServiceTeamMaintenancePayload(
  draft: MasterDataWorkplaceServiceTeamMaintenanceDraft
): MasterDataWorkplaceServiceTeamMaintenancePayload {
  return compactMasterDataWorkplaceServiceTeamMaintenancePayload({
    action: draft.action,
    source_batch_id: draft.sourceBatchId,
    workplace_id: draft.workplaceId,
    team_type: draft.teamType,
    team_name: draft.teamName,
    organization_id: draft.organizationId,
    supplier_id: draft.supplierId,
    status: draft.status,
    effective_from: draft.effectiveFrom,
    effective_to: draft.effectiveTo,
  })
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
      sourceBatchLabel: formatImportBatchDisplayLabel(employee.batch_id),
      detailHref: `/master-data/agents/${encodeURIComponent(employee.employee_id)}`,
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

export function summarizeMasterDataAgentDetail({
  employeeId,
  employees,
  bindings,
  serviceTeams,
}: {
  employeeId: string
  employees: MasterDataEmployeeListRow[]
  bindings: MasterDataWorkplaceBindingRow[]
  serviceTeams: MasterDataWorkplaceServiceTeamRow[]
}): MasterDataAgentDetailSummary {
  const employeeSummary = summarizeMasterDataEmployeeList(employees)
  const employee =
    employeeSummary.rows.find((row) => row.employee_id === employeeId) ?? null

  if (!employee) {
    return {
      found: false,
      title: "客服人员未找到",
      backHref: "/master-data/agents",
      employee: null,
      totalServiceTeams: 0,
      emptyServiceTeamDetail: "未找到该人员，无法匹配服务团队。",
      serviceTeamRows: [],
    }
  }

  const employeeBindings = bindings.filter(
    (binding) => binding.employee_id === employee.employee_id
  )
  const supplierMatches = new Set(
    employeeBindings.map(
      (binding) => `${binding.workplace_id}:${binding.supplier_id}`
    )
  )
  const matchedTeams = serviceTeams
    .filter((serviceTeam) => {
      if (serviceTeam.team_type === "internal") {
        return (
          serviceTeam.workplace_id === employee.workplace_id &&
          serviceTeam.organization_id === employee.organization_id
        )
      }

      if (!serviceTeam.supplier_id) {
        return false
      }

      return supplierMatches.has(
        `${serviceTeam.workplace_id}:${serviceTeam.supplier_id}`
      )
    })
    .sort((left, right) => {
      const workplaceComparison = left.workplace_id.localeCompare(right.workplace_id)
      if (workplaceComparison !== 0) {
        return workplaceComparison
      }

      return left.team_name.localeCompare(right.team_name, "zh-CN")
    })
    .map((serviceTeam) => ({
      service_team_id: serviceTeam.service_team_id,
      workplace_id: serviceTeam.workplace_id,
      team_type: serviceTeam.team_type,
      team_name: serviceTeam.team_name,
      status: serviceTeam.status,
      effective_from: serviceTeam.effective_from,
      effective_to: serviceTeam.effective_to,
      batch_id: serviceTeam.batch_id,
      display: {
        teamNameLabel: formatMasterDataVisibleValue(serviceTeam.team_name),
        teamTypeLabel: formatMasterDataServiceTeamType(serviceTeam.team_type),
        workplaceLabel:
          employee.workplace_id === serviceTeam.workplace_id
            ? employee.display.workplaceLabel
            : formatMasterDataVisibleValue(serviceTeam.workplace_id),
        statusLabel: formatMasterDataEmployeeStatus(serviceTeam.status),
        effectivePeriodLabel: formatEffectivePeriod(
          serviceTeam.effective_from,
          serviceTeam.effective_to
        ),
        sourceBatchLabel: formatImportBatchDisplayLabel(serviceTeam.batch_id),
        matchSourceLabel:
          serviceTeam.team_type === "internal"
            ? "同职场同组织"
            : "同职场同供应商绑定",
        detailHref: `/master-data/sites/${encodeURIComponent(serviceTeam.workplace_id)}/service-teams/${encodeURIComponent(serviceTeam.service_team_id)}`,
      },
    }))

  return {
    found: true,
    title: employee.display.publicNameLabel,
    backHref: "/master-data/agents",
    employee,
    totalServiceTeams: matchedTeams.length,
    emptyServiceTeamDetail: "暂无该人员关联的服务团队。",
    serviceTeamRows: matchedTeams,
  }
}

export function summarizeMasterDataAgentManagement(
  employees: MasterDataEmployeeListRow[],
  filters: MasterDataAgentManagementFilters = {},
  importDialogInput: {
    batches?: ImportBatchListRow[]
    templates?: ImportFieldMappingTemplate[]
    uploadStatus?: string | null
    uploadReason?: string | null
    uploadBatchId?: string | null
  } = {}
): MasterDataAgentManagementSummary {
  const normalizedFilters = normalizeMasterDataAgentManagementFilters(filters)
  const filterOptions = buildMasterDataAgentManagementFilterOptions(employees)
  const filteredEmployees = employees.filter((employee) =>
    matchesMasterDataAgentManagementFilters(employee, normalizedFilters)
  )

  return {
    ...summarizeMasterDataEmployeeList(filteredEmployees),
    title: "客服人员",
    createHref: "/master-data/agents/new",
    importDialog: summarizeMasterDataAgentImportDialog({
      batches: importDialogInput.batches ?? [],
      templates: importDialogInput.templates ?? [],
      uploadStatus: importDialogInput.uploadStatus,
      uploadReason: importDialogInput.uploadReason,
      uploadBatchId: importDialogInput.uploadBatchId,
    }),
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
        options: filterOptions.skillGroups,
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
        options: filterOptions.organizations,
      },
      {
        key: "workplace",
        label: "职场",
        placeholder: "请选择",
        type: "select",
        options: filterOptions.workplaces,
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

function summarizeMasterDataAgentImportDialogResult({
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

function buildMasterDataAgentImportTemplateHref(): string {
  const lines = [
    "record_type,employee_id,employee_name,status,employee_type,organization_id,workplace_id,effective_from,effective_to,skill_id",
    "employee,A-2001,刘晓晓,active,internal,ORG-RETURN,NJ-01,2026-06-01,2026-12-31,",
    "employee_skill,A-2001,,, ,,,2026-06-01,2026-12-31,SKILL-RETURN-TICKET",
  ]

  return `data:text/csv;charset=utf-8,${encodeURIComponent(lines.join("\n"))}`
}

function buildMasterDataImportBatchProcessingHref(batchId: string): string {
  return `/data-quality/import-batches/${encodeURIComponent(batchId)}`
}

function formatMasterDataAgentImportFailureReason(reason?: string | null): string {
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
            : entity.key === "sites"
              ? "地点"
            : entity.label,
        effectivePeriodLabel: formatEffectivePeriod(
          reference.effective_from,
          reference.effective_to
        ),
        sourceBatchLabel: formatImportBatchDisplayLabel(reference.batch_id),
        detailHref:
          entity.key === "sites"
            ? `/master-data/sites/${encodeURIComponent(reference.reference_id)}`
            : entity.key === "vendors"
              ? `/master-data/vendors/${encodeURIComponent(reference.reference_id)}`
              : entity.key === "skills"
                ? `/master-data/skills/${encodeURIComponent(reference.reference_id)}`
              : null,
        editHref:
          entity.key === "sites"
            ? `/master-data/sites/${encodeURIComponent(reference.reference_id)}/edit`
            : entity.key === "vendors"
              ? `/master-data/vendors/${encodeURIComponent(reference.reference_id)}/edit`
              : entity.key === "skills"
                ? `/master-data/skills/${encodeURIComponent(reference.reference_id)}/edit`
                : null,
        freezeHref:
          entity.key === "sites"
            ? `/master-data/sites?freeze_workplace_id=${encodeURIComponent(reference.reference_id)}`
            : entity.key === "vendors"
              ? `/master-data/vendors?freeze_vendor_id=${encodeURIComponent(reference.reference_id)}`
              : entity.key === "skills"
                ? `/master-data/skills?freeze_skill_id=${encodeURIComponent(reference.reference_id)}`
                : null,
      },
    }))

  return {
    entity,
    title: entity.label,
    createHref:
      entity.key === "sites"
        ? "/master-data/sites/new"
        : entity.key === "vendors"
          ? "/master-data/vendors/new"
          : entity.key === "skills"
            ? "/master-data/skills/new"
            : null,
    totalRecords: rows.length,
    activeRecords: rows.filter((row) => row.status === "active").length,
    frozenRecords: rows.filter((row) => row.status === "frozen").length,
    rows,
  }
}

export function summarizeMasterDataSkillDetail({
  skillId,
  skills,
  employees,
}: {
  skillId: string
  skills: MasterDataReferenceListRow[]
  employees: MasterDataEmployeeListRow[]
}): MasterDataSkillDetailSummary {
  const skillSummary = summarizeMasterDataReferenceManagement("skills", skills)
  const skill =
    skillSummary.rows.find((row) => row.reference_id === skillId) ?? null

  if (!skill) {
    return {
      found: false,
      title: "技能组未找到",
      backHref: "/master-data/skills",
      skill: null,
      totalPeople: 0,
      emptyPeopleDetail: "未找到该技能组，无法读取归属人员。",
      peopleRows: [],
    }
  }

  const peopleRows = summarizeMasterDataEmployeeList(employees).rows.filter((row) =>
    row.skills.some((employeeSkill) => employeeSkill.skill_id === skill.reference_id)
  )

  return {
    found: true,
    title: skill.display.referenceNameLabel,
    backHref: "/master-data/skills",
    skill,
    totalPeople: peopleRows.length,
    emptyPeopleDetail: "暂无拥有该技能的客服人员。",
    peopleRows,
  }
}

export function summarizeMasterDataVendorDetail({
  vendorId,
  vendors,
  workplaces,
  bindings,
  serviceTeams,
}: {
  vendorId: string
  vendors: MasterDataReferenceListRow[]
  workplaces: MasterDataReferenceListRow[]
  bindings: MasterDataWorkplaceBindingRow[]
  serviceTeams?: MasterDataWorkplaceServiceTeamRow[]
}): MasterDataVendorDetailSummary {
  const vendorSummary = summarizeMasterDataReferenceManagement("vendors", vendors)
  const workplaceSummary = summarizeMasterDataReferenceManagement("sites", workplaces)
  const vendor =
    vendorSummary.rows.find((row) => row.reference_id === vendorId) ?? null

  if (!vendor) {
    return {
      found: false,
      title: "供应商未找到",
      backHref: "/master-data/vendors",
      vendor: null,
      totalServiceWorkplaces: 0,
      activeServiceWorkplaces: 0,
      totalServiceTeams: 0,
      serviceRows: [],
      serviceTeamRows: [],
    }
  }

  const workplaceById = new Map(
    workplaceSummary.rows.map((workplace) => [workplace.reference_id, workplace])
  )
  const serviceRows = deduplicateVendorWorkplaceBindings(
    bindings.filter((binding) => binding.supplier_id === vendor.reference_id)
  )
    .map((binding) => {
      const workplace = workplaceById.get(binding.workplace_id) ?? null
      const workplaceName =
        workplace?.display.referenceNameLabel ??
        formatMasterDataVisibleValue(binding.workplace_id)
      const status = workplace?.status ?? "active"

      return {
        service_key: [
          binding.workplace_id,
          binding.effective_from,
          binding.effective_to,
          binding.batch_id,
        ].join(":"),
        workplace_id: binding.workplace_id,
        status,
        effective_from: binding.effective_from,
        effective_to: binding.effective_to,
        batch_id: binding.batch_id,
        display: {
          workplaceIdLabel: formatMasterDataVisibleValue(binding.workplace_id),
          workplaceLabel: workplaceName,
          statusLabel: formatMasterDataEmployeeStatus(status),
          sourceLabel: "人员归属记录",
          effectivePeriodLabel: formatEffectivePeriod(
            binding.effective_from,
            binding.effective_to
          ),
          sourceBatchLabel: formatImportBatchDisplayLabel(binding.batch_id),
          detailHref: `/master-data/sites/${encodeURIComponent(binding.workplace_id)}`,
        },
      }
    })
    .sort((left, right) => left.workplace_id.localeCompare(right.workplace_id))
  const serviceTeamRows = (serviceTeams ?? [])
    .filter(
      (serviceTeam) =>
        serviceTeam.team_type === "supplier" &&
        serviceTeam.supplier_id === vendor.reference_id
    )
    .map((serviceTeam) => {
      const workplace = workplaceById.get(serviceTeam.workplace_id) ?? null
      const workplaceLabel =
        workplace?.display.referenceNameLabel ??
        formatMasterDataVisibleValue(serviceTeam.workplace_id)

      return {
        service_team_id: serviceTeam.service_team_id,
        workplace_id: serviceTeam.workplace_id,
        team_name: serviceTeam.team_name,
        status: serviceTeam.status,
        effective_from: serviceTeam.effective_from,
        effective_to: serviceTeam.effective_to,
        batch_id: serviceTeam.batch_id,
        display: {
          teamNameLabel: formatMasterDataVisibleValue(serviceTeam.team_name),
          workplaceLabel,
          statusLabel: formatMasterDataEmployeeStatus(serviceTeam.status),
          effectivePeriodLabel: formatEffectivePeriod(
            serviceTeam.effective_from,
            serviceTeam.effective_to
          ),
          sourceBatchLabel: formatImportBatchDisplayLabel(serviceTeam.batch_id),
          detailHref: `/master-data/sites/${encodeURIComponent(serviceTeam.workplace_id)}/service-teams/${encodeURIComponent(serviceTeam.service_team_id)}`,
        },
      }
    })
    .sort((left, right) => {
      const workplaceComparison = left.workplace_id.localeCompare(right.workplace_id)
      if (workplaceComparison !== 0) {
        return workplaceComparison
      }

      return left.team_name.localeCompare(right.team_name)
    })

  return {
    found: true,
    title: vendor.display.referenceNameLabel,
    backHref: "/master-data/vendors",
    vendor,
    totalServiceWorkplaces: serviceRows.length,
    activeServiceWorkplaces: serviceRows.filter((row) => row.status === "active")
      .length,
    totalServiceTeams: serviceTeamRows.length,
    serviceRows,
    serviceTeamRows,
  }
}

export function summarizeMasterDataWorkplaceDetail({
  workplaceId,
  workplaces,
  employees,
  bindings,
  suppliers,
  serviceTeams,
}: {
  workplaceId: string
  workplaces: MasterDataReferenceListRow[]
  employees: MasterDataEmployeeListRow[]
  bindings: MasterDataWorkplaceBindingRow[]
  suppliers?: MasterDataReferenceListRow[]
  serviceTeams?: MasterDataWorkplaceServiceTeamRow[]
}): MasterDataWorkplaceDetailSummary {
  const workplaceSummary = summarizeMasterDataReferenceManagement("sites", workplaces)
  const workplace =
    workplaceSummary.rows.find((row) => row.reference_id === workplaceId) ?? null

  if (!workplace) {
    return {
      found: false,
      title: "职场未找到",
      backHref: "/master-data/sites",
      workplace: null,
      totalOperators: 0,
      internalOperators: 0,
      supplierOperators: 0,
      createServiceTeamHref: null,
      operatorRows: [],
    }
  }

  const supplierById = new Map(
    (suppliers ?? []).map((supplier) => [supplier.reference_id, supplier])
  )
  const maintainedRows = buildMaintainedWorkplaceServiceTeamRows(
    (serviceTeams ?? []).filter(
      (serviceTeam) => serviceTeam.workplace_id === workplace.reference_id
    ),
    supplierById,
    workplace.reference_id
  )
  const internalRows =
    maintainedRows.length > 0
      ? []
      : buildWorkplaceInternalTeamRows(
          employees.filter(
            (employee) =>
              employee.workplace_id === workplace.reference_id &&
              employee.employee_type === "internal"
          )
        )

  const supplierRows =
    maintainedRows.length > 0
      ? []
      : buildWorkplaceSupplierTeamRows(
          bindings.filter((binding) => binding.workplace_id === workplace.reference_id),
          supplierById
        )

  const operatorRows = [...maintainedRows, ...internalRows, ...supplierRows].sort((left, right) => {
    if (left.operator_type !== right.operator_type) {
      return left.operator_type === "internal" ? -1 : 1
    }

    return left.operator_name.localeCompare(right.operator_name)
  })

  return {
    found: true,
    title: workplace.display.referenceNameLabel,
    backHref: "/master-data/sites",
    workplace,
    totalOperators: operatorRows.length,
    internalOperators: operatorRows.filter((row) => row.operator_type === "internal")
      .length,
    supplierOperators: operatorRows.filter((row) => row.operator_type === "supplier")
      .length,
    createServiceTeamHref: `/master-data/sites/${encodeURIComponent(workplace.reference_id)}/service-teams/new`,
    operatorRows,
  }
}

export function summarizeMasterDataWorkplaceServiceTeamPeople({
  serviceTeam,
  employees,
  bindings,
}: {
  serviceTeam: MasterDataWorkplaceServiceTeamRow | null
  employees: MasterDataEmployeeListRow[]
  bindings: MasterDataWorkplaceBindingRow[]
}): MasterDataWorkplaceServiceTeamPeopleSummary {
  if (!serviceTeam) {
    return {
      totalPeople: 0,
      emptyDetail: "未找到该服务团队，无法匹配关联人员。",
      rows: [],
    }
  }

  const matchedEmployees =
    serviceTeam.team_type === "internal"
      ? employees.filter(
          (employee) =>
            employee.workplace_id === serviceTeam.workplace_id &&
            employee.organization_id === serviceTeam.organization_id
        )
      : resolveSupplierServiceTeamEmployees(serviceTeam, employees, bindings)
  const matchSourceLabel =
    serviceTeam.team_type === "internal"
      ? "同职场同组织"
      : "同职场同供应商绑定"
  const rows = matchedEmployees
    .sort((left, right) => left.employee_id.localeCompare(right.employee_id))
    .map((employee) => ({
      ...employee,
      display: {
        employeeNameLabel: formatMasterDataVisibleValue(employee.employee_name),
        employeeTypeLabel: formatMasterDataEmployeeType(employee.employee_type),
        statusLabel: formatMasterDataEmployeeStatus(employee.status),
        organizationLabel: employee.organization_path ?? "未绑定组织",
        workplaceLabel: employee.workplace_name ?? "未绑定职场",
        skillSummary: formatMasterDataEmployeeSkills(employee.skills),
        matchSourceLabel,
      },
    }))

  return {
    totalPeople: rows.length,
    emptyDetail:
      serviceTeam.team_type === "internal"
        ? "暂无同职场同组织的人员。"
        : "暂无通过供应商归属记录匹配的人员。",
    rows,
  }
}

function resolveSupplierServiceTeamEmployees(
  serviceTeam: MasterDataWorkplaceServiceTeamRow,
  employees: MasterDataEmployeeListRow[],
  bindings: MasterDataWorkplaceBindingRow[]
): MasterDataEmployeeListRow[] {
  if (!serviceTeam.supplier_id) {
    return []
  }

  const employeeIds = new Set(
    bindings
      .filter(
        (binding) =>
          binding.workplace_id === serviceTeam.workplace_id &&
          binding.supplier_id === serviceTeam.supplier_id
      )
      .map((binding) => binding.employee_id)
  )

  return employees.filter((employee) => employeeIds.has(employee.employee_id))
}

function buildMaintainedWorkplaceServiceTeamRows(
  serviceTeams: MasterDataWorkplaceServiceTeamRow[],
  supplierById: Map<string, MasterDataReferenceListRow>,
  workplaceId: string
): MasterDataWorkplaceOperatorViewRow[] {
  return serviceTeams.map((serviceTeam) => {
    const supplier = serviceTeam.supplier_id
      ? supplierById.get(serviceTeam.supplier_id) ?? null
      : null

    return buildWorkplaceOperatorRow({
      key: serviceTeam.service_team_id,
      type: serviceTeam.team_type,
      name: serviceTeam.team_name,
      supplierId: serviceTeam.supplier_id,
      supplierName: supplier?.reference_name,
      recordCount: 1,
      status: serviceTeam.status,
      sourceType: "service_team",
      effectiveFrom: serviceTeam.effective_from,
      effectiveTo: serviceTeam.effective_to,
      batchId: serviceTeam.batch_id,
      detailHref: `/master-data/sites/${encodeURIComponent(workplaceId)}/service-teams/${encodeURIComponent(serviceTeam.service_team_id)}`,
      editHref: `/master-data/sites/${encodeURIComponent(workplaceId)}/service-teams/${encodeURIComponent(serviceTeam.service_team_id)}/edit`,
      freezeHref: `/master-data/sites/${encodeURIComponent(workplaceId)}?freeze_service_team_id=${encodeURIComponent(serviceTeam.service_team_id)}`,
    })
  })
}

function buildWorkplaceInternalTeamRows(
  employees: MasterDataEmployeeListRow[]
): MasterDataWorkplaceOperatorViewRow[] {
  const byOrganization = new Map<string, MasterDataEmployeeListRow[]>()

  for (const employee of employees) {
    const key =
      employee.organization_id ??
      employee.organization_path ??
      `unassigned:${employee.employee_id}`
    const current = byOrganization.get(key) ?? []
    current.push(employee)
    byOrganization.set(key, current)
  }

  return [...byOrganization.entries()].map(([key, group]) => {
    const firstEmployee = group[0]
    const teamName =
      firstEmployee.organization_path ??
      firstEmployee.organization_id ??
      "未绑定组织"

    return buildWorkplaceOperatorRow({
      key: `internal:${key}`,
      type: "internal",
      name: teamName,
      supplierId: null,
      recordCount: group.length,
      status: summarizeGroupedStatus(group.map((employee) => employee.status)),
      sourceType: "employee",
      effectiveFrom: pickEarliestValue(group.map((employee) => employee.effective_from)),
      effectiveTo: pickLatestValue(group.map((employee) => employee.effective_to)),
      batchId: pickFirstValue(group.map((employee) => employee.batch_id)),
    })
  })
}

function buildWorkplaceSupplierTeamRows(
  bindings: MasterDataWorkplaceBindingRow[],
  supplierById: Map<string, MasterDataReferenceListRow>
): MasterDataWorkplaceOperatorViewRow[] {
  const bySupplier = new Map<string, MasterDataWorkplaceBindingRow[]>()

  for (const binding of bindings) {
    if (!binding.supplier_id) {
      continue
    }

    const current = bySupplier.get(binding.supplier_id) ?? []
    current.push(binding)
    bySupplier.set(binding.supplier_id, current)
  }

  return [...bySupplier.entries()].map(([supplierId, group]) => {
    const supplier = supplierById.get(supplierId) ?? null
    const supplierName =
      supplier?.reference_name ??
      formatMasterDataVisibleValue(supplierId)

    return buildWorkplaceOperatorRow({
      key: `supplier:${supplierId}`,
      type: "supplier",
      name: supplierName,
      supplierId,
      supplierName,
      recordCount: group.length,
      status: supplier?.status ?? "active",
      sourceType: "binding",
      effectiveFrom: pickEarliestValue(group.map((binding) => binding.effective_from)),
      effectiveTo: pickLatestValue(group.map((binding) => binding.effective_to)),
      batchId: pickFirstValue(group.map((binding) => binding.batch_id)),
    })
  })
}

export function summarizeMasterDataOrganizationManagement(
  organizations: MasterDataOrganizationListRow[]
): MasterDataOrganizationManagementSummary {
  const rows = [...organizations]
    .sort((left, right) => {
      if (left.organization_level !== right.organization_level) {
        return left.organization_level - right.organization_level
      }

      return left.organization_id.localeCompare(right.organization_id)
    })
    .map((organization) => ({
      ...organization,
      display: {
        organizationIdLabel: formatMasterDataVisibleValue(organization.organization_id),
        organizationNameLabel: formatMasterDataVisibleValue(organization.organization_name),
        organizationLevelLabel: `${organization.organization_level}级组织`,
        parentOrganizationLabel: organization.parent_organization_id
          ? formatMasterDataVisibleValue(organization.parent_organization_id)
          : "无上级组织",
        organizationPathLabel: formatMasterDataVisibleValue(organization.organization_path),
        statusLabel: formatMasterDataEmployeeStatus(organization.status),
        effectivePeriodLabel: formatEffectivePeriod(
          organization.effective_from,
          organization.effective_to
        ),
        sourceBatchLabel: formatImportBatchDisplayLabel(organization.batch_id),
        detailHref: `/master-data/organizations/${encodeURIComponent(organization.organization_id)}`,
        editHref: `/master-data/organizations/${encodeURIComponent(organization.organization_id)}/edit`,
        freezeHref: `/master-data/organizations?freeze_organization_id=${encodeURIComponent(organization.organization_id)}`,
      },
    }))

  return {
    title: "组织",
    createHref: "/master-data/organizations/new",
    totalRecords: rows.length,
    activeRecords: rows.filter((row) => row.status === "active").length,
    frozenRecords: rows.filter((row) => row.status === "frozen").length,
    rows,
  }
}

export function summarizeMasterDataOrganizationDetail({
  organizationId,
  organizations,
  employees,
}: {
  organizationId: string
  organizations: MasterDataOrganizationListRow[]
  employees: MasterDataEmployeeListRow[]
}): MasterDataOrganizationDetailSummary {
  const organizationSummary = summarizeMasterDataOrganizationManagement(organizations)
  const organization =
    organizationSummary.rows.find((row) => row.organization_id === organizationId) ??
    null

  if (!organization) {
    return {
      found: false,
      title: "组织未找到",
      backHref: "/master-data/organizations",
      organization: null,
      totalChildOrganizations: 0,
      totalPeople: 0,
      emptyChildDetail: "未找到该组织，无法读取下级组织。",
      emptyPeopleDetail: "未找到该组织，无法读取归属人员。",
      childRows: [],
      peopleRows: [],
    }
  }

  const childRows = organizationSummary.rows.filter(
    (row) => row.parent_organization_id === organization.organization_id
  )
  const peopleRows = summarizeMasterDataEmployeeList(employees).rows.filter(
    (row) => row.organization_id === organization.organization_id
  )

  return {
    found: true,
    title: organization.display.organizationNameLabel,
    backHref: "/master-data/organizations",
    organization,
    totalChildOrganizations: childRows.length,
    totalPeople: peopleRows.length,
    emptyChildDetail: "暂无直接下级组织。",
    emptyPeopleDetail: "暂无归属该组织的客服人员。",
    childRows,
    peopleRows,
  }
}

function buildWorkplaceOperatorRow({
  key,
  type,
  name,
  supplierId,
  supplierName,
  recordCount,
  status,
  sourceType,
  effectiveFrom,
  effectiveTo,
  batchId,
  detailHref = null,
  editHref = null,
  freezeHref = null,
}: {
  key: string
  type: MasterDataWorkplaceOperatorType
  name: string
  supplierId: string | null
  supplierName?: string
  recordCount: number
  status: MasterDataAgentMaintenanceStatus
  sourceType: MasterDataWorkplaceOperatorSource
  effectiveFrom: string
  effectiveTo: string
  batchId: string
  detailHref?: string | null
  editHref?: string | null
  freezeHref?: string | null
}): MasterDataWorkplaceOperatorViewRow {
  return {
    operator_key: key,
    operator_type: type,
    operator_name: name,
    supplier_id: supplierId,
    record_count: recordCount,
    status,
    source_type: sourceType,
    effective_from: effectiveFrom,
    effective_to: effectiveTo,
    batch_id: batchId,
    display: {
      operatorTypeLabel: type === "internal" ? "自有团队" : "供应商团队",
      operatorNameLabel: formatMasterDataVisibleValue(name),
      supplierLabel: supplierId
        ? formatMasterDataVisibleValue(supplierName ?? supplierId)
        : sourceType === "service_team"
          ? "-"
          : "无供应商",
      recordCountLabel:
        sourceType === "service_team"
          ? `${recordCount} 条记录`
          : type === "internal"
            ? `${recordCount} 人`
            : `${recordCount} 条绑定`,
      statusLabel: formatMasterDataEmployeeStatus(status),
      sourceLabel:
        sourceType === "employee"
          ? "人员档案"
          : sourceType === "binding"
            ? "人员归属记录"
            : "服务团队记录",
      effectivePeriodLabel: formatEffectivePeriod(effectiveFrom, effectiveTo),
      sourceBatchLabel: formatImportBatchDisplayLabel(batchId),
      detailHref,
      editHref,
      freezeHref,
    },
  }
}

function summarizeGroupedStatus(
  statuses: MasterDataAgentMaintenanceStatus[]
): MasterDataAgentMaintenanceStatus {
  if (statuses.includes("active")) {
    return "active"
  }

  return statuses[0] ?? "inactive"
}

function pickEarliestValue(values: string[]): string {
  const sorted = values.filter(Boolean).sort()
  return sorted[0] ?? ""
}

function pickLatestValue(values: string[]): string {
  const sorted = values.filter(Boolean).sort()
  return sorted[sorted.length - 1] ?? ""
}

function pickFirstValue(values: string[]): string {
  return values.find(Boolean) ?? ""
}

function deduplicateVendorWorkplaceBindings(
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

function normalizeMasterDataAgentManagementFilters(
  filters: MasterDataAgentManagementFilters
): MasterDataAgentManagementFilters {
  return Object.fromEntries(
    Object.entries(filters)
      .map(([key, value]) => [key, value?.trim() ?? ""])
      .filter(([, value]) => value && value !== "all")
  ) as MasterDataAgentManagementFilters
}

function buildMasterDataAgentManagementFilterOptions(
  employees: MasterDataEmployeeListRow[]
): Pick<
  Record<
    "skillGroups" | "organizations" | "workplaces",
    NonNullable<MasterDataAgentManagementFilterField["options"]>
  >,
  "skillGroups" | "organizations" | "workplaces"
> {
  const skillGroups = new Map<string, string>()
  const organizations = new Map<string, string>()
  const workplaces = new Map<string, string>()

  for (const employee of employees) {
    if (employee.organization_id) {
      organizations.set(
        employee.organization_id,
        employee.organization_path ?? employee.organization_id
      )
    }

    if (employee.workplace_id) {
      workplaces.set(employee.workplace_id, employee.workplace_name ?? employee.workplace_id)
    }

    for (const skill of employee.skills) {
      if (skill.skill_id) {
        skillGroups.set(skill.skill_id, skill.skill_name || skill.skill_id)
      }
    }
  }

  return {
    skillGroups: buildSelectOptions("全部技能组", skillGroups),
    organizations: buildSelectOptions("全部组织", organizations),
    workplaces: buildSelectOptions("全部职场", workplaces),
  }
}

function buildSelectOptions(
  allLabel: string,
  options: Map<string, string>
): NonNullable<MasterDataAgentManagementFilterField["options"]> {
  return [
    { value: "all", label: allLabel },
    ...[...options.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([value, label]) => ({ value, label })),
  ]
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
    !employee.skills.some(
      (skill) =>
        skill.skill_id === skillGroup ||
        skill.skill_name === skillGroup ||
        skill.skill_category === skillGroup
    )
  ) {
    return false
  }

  const organization = filters.organization
  if (
    organization &&
    employee.organization_id !== organization &&
    employee.organization_path !== organization
  ) {
    return false
  }

  const workplace = filters.workplace
  if (
    workplace &&
    employee.workplace_id !== workplace &&
    employee.workplace_name !== workplace
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
    const recordType = getSingleSearchParam(searchParams.record_type) || "人员"

    return {
      tone: "success",
      title: `${recordType}保存成功`,
      detail: `${recordId} ${recordName} 已 ${actionStatus}，当前状态 ${recordStatus}。`,
    }
  }

  if (status === "error") {
    const code =
      getSingleSearchParam(searchParams.maintenance_code) ||
      "MASTER_DATA_MAINTENANCE_SUBMIT_FAILED"
    const message = getSingleSearchParam(searchParams.maintenance_message) || "后端未返回错误说明"
    const recordType = getSingleSearchParam(searchParams.record_type) || "人员"

    return {
      tone: "error",
      title: `${recordType}保存失败`,
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

function compactMasterDataWorkplaceMaintenancePayload(
  payload: MasterDataWorkplaceMaintenancePayload
): MasterDataWorkplaceMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataWorkplaceMaintenancePayload
}

function compactMasterDataVendorMaintenancePayload(
  payload: MasterDataVendorMaintenancePayload
): MasterDataVendorMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataVendorMaintenancePayload
}

function compactMasterDataSkillMaintenancePayload(
  payload: MasterDataSkillMaintenancePayload
): MasterDataSkillMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataSkillMaintenancePayload
}

function compactMasterDataOrganizationMaintenancePayload(
  payload: MasterDataOrganizationMaintenancePayload
): MasterDataOrganizationMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataOrganizationMaintenancePayload
}

function compactMasterDataWorkplaceServiceTeamMaintenancePayload(
  payload: MasterDataWorkplaceServiceTeamMaintenancePayload
): MasterDataWorkplaceServiceTeamMaintenancePayload {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== "")
  ) as MasterDataWorkplaceServiceTeamMaintenancePayload
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

function isReferenceEntity(
  entityKey: MasterDataMaintenanceEntityKey
): entityKey is "sites" | "vendors" | "skills" {
  return ["sites", "vendors", "skills"].includes(entityKey)
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

function formatMasterDataServiceTeamType(
  teamType: MasterDataWorkplaceServiceTeamType
) {
  return teamType === "internal" ? "自有团队" : "供应商团队"
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
