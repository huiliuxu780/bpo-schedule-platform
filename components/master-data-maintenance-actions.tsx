import Link from "next/link"
import {
  Plus,
  Upload,
} from "lucide-react"
import {
  type MasterDataAgentManagementSummary,
  type MasterDataOrganizationManagementSummary,
  type MasterDataReferenceManagementSummary,
  type MasterDataWorkplaceDetailSummary,
} from "@/components/master-data-maintenance-model"
import { Button } from "@/components/ui/button"

export function MasterDataAgentPageActions({
  summary,
}: {
  summary: MasterDataAgentManagementSummary
}) {
  return (
    <>
      <Button asChild size="sm">
        <Link href={summary.createHref}>
          <Plus data-icon="inline-start" />
          新建
        </Link>
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link href={summary.importDialog.openHref}>
          <Upload data-icon="inline-start" />
          批量导入
        </Link>
      </Button>
    </>
  )
}

export function MasterDataWorkplacePageActions({
  summary,
}: {
  summary: MasterDataReferenceManagementSummary
}) {
  if (!summary.createHref) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href={summary.createHref}>
        <Plus data-icon="inline-start" />
        新建
      </Link>
    </Button>
  )
}

export function MasterDataVendorPageActions({
  summary,
}: {
  summary: MasterDataReferenceManagementSummary
}) {
  if (!summary.createHref) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href={summary.createHref}>
        <Plus data-icon="inline-start" />
        新建
      </Link>
    </Button>
  )
}

export function MasterDataSkillPageActions({
  summary,
}: {
  summary: MasterDataReferenceManagementSummary
}) {
  if (!summary.createHref) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href={summary.createHref}>
        <Plus data-icon="inline-start" />
        新建
      </Link>
    </Button>
  )
}

export function MasterDataOrganizationPageActions({
  summary,
}: {
  summary: MasterDataOrganizationManagementSummary
}) {
  return (
    <Button asChild size="sm">
      <Link href={summary.createHref}>
        <Plus data-icon="inline-start" />
        新建
      </Link>
    </Button>
  )
}

export function MasterDataWorkplaceServiceTeamPageActions({
  detailSummary,
}: {
  detailSummary: MasterDataWorkplaceDetailSummary
}) {
  if (!detailSummary.createServiceTeamHref) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href={detailSummary.createServiceTeamHref}>
        <Plus data-icon="inline-start" />
        新增服务团队
      </Link>
    </Button>
  )
}
