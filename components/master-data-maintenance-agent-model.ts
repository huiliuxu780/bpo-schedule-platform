import {
  type ImportBatchListRow,
  type ImportFieldMappingTemplate,
} from "@/components/import-center-model"
import {
  type MasterDataWorkplaceBindingRow,
  type MasterDataWorkplaceServiceTeamRow,
  type MasterDataEmployeeListRow,
  type MasterDataEmployeeListSummary,
  type MasterDataAgentDetailSummary,
  type MasterDataAgentManagementFilterField,
  type MasterDataAgentManagementSummary,
  type MasterDataAgentManagementFilters,
} from "./master-data-maintenance-types"
import {
  formatImportBatchDisplayLabel,
  formatMasterDataVisibleValue,
  formatMasterDataEmployeeType,
  formatMasterDataEmployeeStatus,
  formatMasterDataServiceTeamType,
  formatEffectivePeriod,
  formatMasterDataEmployeeSkills,
} from "./master-data-maintenance-formatters"
import {
  summarizeMasterDataAgentImportDialog,
} from "./master-data-maintenance-import-dialog-model"

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

export function normalizeMasterDataAgentManagementFilters(
  filters: MasterDataAgentManagementFilters
): MasterDataAgentManagementFilters {
  return Object.fromEntries(
    Object.entries(filters)
      .map(([key, value]) => [key, value?.trim() ?? ""])
      .filter(([, value]) => value && value !== "all")
  ) as MasterDataAgentManagementFilters
}

export function buildMasterDataAgentManagementFilterOptions(
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

export function buildSelectOptions(
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

export function matchesMasterDataAgentManagementFilters(
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
