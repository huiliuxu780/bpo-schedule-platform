import {
  type MasterDataAgentMaintenanceStatus,
  type MasterDataReferenceListRow,
  type MasterDataSkillDetailSummary,
  type MasterDataWorkplaceBindingRow,
  type MasterDataWorkplaceServiceTeamRow,
  type MasterDataWorkplaceOperatorSource,
  type MasterDataWorkplaceOperatorType,
  type MasterDataWorkplaceOperatorViewRow,
  type MasterDataWorkplaceDetailSummary,
  type MasterDataWorkplaceServiceTeamPeopleSummary,
  type MasterDataVendorDetailSummary,
  type MasterDataEmployeeListRow,
} from "./master-data-maintenance-types"
import {
  formatImportBatchDisplayLabel,
  formatMasterDataVisibleValue,
  summarizeGroupedStatus,
  pickEarliestValue,
  pickLatestValue,
  pickFirstValue,
  deduplicateVendorWorkplaceBindings,
  formatMasterDataEmployeeType,
  formatMasterDataEmployeeStatus,
  formatEffectivePeriod,
  formatMasterDataEmployeeSkills,
} from "./master-data-maintenance-formatters"
import {
  summarizeMasterDataEmployeeList,
} from "./master-data-maintenance-agent-model"
import {
  summarizeMasterDataReferenceManagement,
} from "./master-data-maintenance-reference-model"

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

export function resolveSupplierServiceTeamEmployees(
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

export function buildMaintainedWorkplaceServiceTeamRows(
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

export function buildWorkplaceInternalTeamRows(
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

export function buildWorkplaceSupplierTeamRows(
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

export function buildWorkplaceOperatorRow({
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
