"use client"

import Link from "next/link"
import { type ReactNode } from "react"
import { type ColumnDef } from "@tanstack/react-table"

import { MainTableShell } from "@/components/main-table-shell"
import { type MasterDataReferenceManagementSummary } from "@/components/master-data-maintenance-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type ReferenceRow = MasterDataReferenceManagementSummary["rows"][number]

const columnLabels: Record<string, string> = {
  name: "名称",
  code: "编码",
  attribute: "属性",
  status: "状态",
  effective_period: "有效期",
  source_batch: "来源批次",
  actions: "操作",
}

const columns: ColumnDef<ReferenceRow>[] = [
  {
    id: "name",
    header: "名称",
    cell: ({ row }) => (
      <span className="font-medium">
        {row.original.display.referenceNameLabel}
      </span>
    ),
  },
  {
    id: "code",
    header: "编码",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.display.referenceIdLabel}
      </span>
    ),
  },
  {
    id: "attribute",
    header: "属性",
    cell: ({ row }) => row.original.display.skillCategoryLabel,
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
        {row.original.display.detailHref ? (
          <ReferenceRowActionLink href={row.original.display.detailHref}>
            查看
          </ReferenceRowActionLink>
        ) : null}
        {row.original.display.editHref ? (
          <ReferenceRowActionLink href={row.original.display.editHref}>
            编辑
          </ReferenceRowActionLink>
        ) : null}
        {row.original.display.freezeHref ? (
          <ReferenceRowActionLink
            href={row.original.display.freezeHref}
            destructive
          >
            冻结
          </ReferenceRowActionLink>
        ) : null}
      </div>
    ),
  },
]

export function MasterDataReferenceTable({
  title,
  rows,
}: {
  title: string
  rows: ReferenceRow[]
}) {
  const hasActionRows = rows.some(
    (row) =>
      row.display.detailHref || row.display.editHref || row.display.freezeHref
  )
  const visibleColumns = hasActionRows
    ? columns
    : columns.filter((column) => column.id !== "actions")

  return (
    <MainTableShell
      title={title}
      description={`维护${title}编码、状态、有效期与来源批次`}
      columns={visibleColumns}
      data={rows}
      columnLabels={columnLabels}
      emptyMessage={`暂无${title}记录`}
      initialSorting={[{ id: "name", desc: false }]}
    />
  )
}

function ReferenceRowActionLink({
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
