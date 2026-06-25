import {
  type MasterDataMaintenanceEntityKey,
  type MasterDataReferenceListRow,
  type MasterDataOrganizationListRow,
  type MasterDataOrganizationManagementSummary,
  type MasterDataOrganizationDetailSummary,
  type MasterDataReferenceManagementSummary,
  type MasterDataEmployeeListRow,
} from "./master-data-maintenance-types"
import {
  formatImportBatchDisplayLabel,
  formatMasterDataVisibleValue,
  isReferenceEntity,
  formatMasterDataEmployeeStatus,
  formatEffectivePeriod,
  formatMasterDataSkillCategory,
} from "./master-data-maintenance-formatters"
import {
  getMasterDataMaintenanceEntity,
} from "./master-data-maintenance-entities"
import {
  summarizeMasterDataEmployeeList,
} from "./master-data-maintenance-agent-model"

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
