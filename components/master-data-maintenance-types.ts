import {
  type ImportFieldMappingTemplate,
  type ImportFileType,
} from "@/components/import-center-model"

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
