"use client"

import Link from "next/link"
import { type ReactNode } from "react"
import { type ColumnDef } from "@tanstack/react-table"

import { MainTableShell } from "@/components/main-table-shell"
import { type MasterDataOrganizationManagementSummary } from "@/components/master-data-maintenance-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type OrganizationRow = MasterDataOrganizationManagementSummary["rows"][number]

const columnLabels: Record<string, string> = {
  organization_name: "组织名称",
  organization_id: "组织编码",
  organization_level: "层级",
  parent_organization: "上级组织",
  organization_path: "组织路径",
  status: "状态",
  effective_period: "有效期",
  source_batch: "来源批次",
  actions: "操作",
}

const columns: ColumnDef<OrganizationRow>[] = [
  {
    id: "organization_name",
    header: "组织名称",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.display.organizationNameLabel}
      </span>
    ),
  },
  {
    id: "organization_id",
    header: "组织编码",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.display.organizationIdLabel}
      </span>
    ),
  },
  {
    id: "organization_level",
    header: "层级",
    cell: ({ row }) => row.original.display.organizationLevelLabel,
  },
  {
    id: "parent_organization",
    header: "上级组织",
    cell: ({ row }) => row.original.display.parentOrganizationLabel,
  },
  {
    id: "organization_path",
    header: "组织路径",
    cell: ({ row }) => (
      <span className="block max-w-[18rem] truncate">
        {row.original.display.organizationPathLabel}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "outline" : "secondary"}>
        {row.original.display.statusLabel}
      </Badge>
    ),
  },
  {
    id: "effective_period",
    header: "有效期",
    cell: ({ row }) => row.original.display.effectivePeriodLabel,
  },
  {
    id: "source_batch",
    header: "来源批次",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.display.sourceBatchLabel}
      </span>
    ),
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <div data-action-scope="row" className="flex justify-end gap-1">
        <OrganizationRowActionLink href={row.original.display.detailHref}>
          查看
        </OrganizationRowActionLink>
        <OrganizationRowActionLink href={row.original.display.editHref}>
          编辑
        </OrganizationRowActionLink>
        <OrganizationRowActionLink
          href={row.original.display.freezeHref}
          destructive
        >
          冻结
        </OrganizationRowActionLink>
      </div>
    ),
  },
]

export function MasterDataOrganizationTable({
  rows,
}: {
  rows: OrganizationRow[]
}) {
  return (
    <MainTableShell
      title="组织"
      description="维护组织层级、路径、状态与有效期"
      columns={columns}
      data={rows}
      columnLabels={columnLabels}
      emptyMessage="暂无组织记录"
      initialSorting={[{ id: "organization_level", desc: false }]}
    />
  )
}

function OrganizationRowActionLink({
  href,
  children,
  destructive = false,
}: {
  href: string
  children: ReactNode
  destructive?: boolean
}) {
  return (
    <Button
      asChild
      size="sm"
      variant="ghost"
      className={destructive ? "px-2 text-destructive hover:text-destructive" : "px-2"}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}
