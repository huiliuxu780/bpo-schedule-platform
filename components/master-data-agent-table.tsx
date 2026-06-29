"use client"

import Link from "next/link"
import { type ReactNode } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { MainTableShell } from "@/components/main-table-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { type MasterDataAgentManagementSummary } from "@/components/master-data-maintenance-model"

type AgentRow = MasterDataAgentManagementSummary["rows"][number]

const columnLabels: Record<string, string> = {
  employee_name: "姓名",
  account: "账号",
  organization: "组织",
  skill_group: "技能组",
  level: "级别",
  status: "状态",
  actions: "操作",
}

const columns: ColumnDef<AgentRow>[] = [
  {
    accessorKey: "employee_name",
    header: "姓名",
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium">
        {row.original.employee_name}
      </span>
    ),
  },
  {
    id: "account",
    header: "账号",
    cell: ({ row }) => row.original.display.accountLabel,
  },
  {
    id: "organization",
    header: "组织",
    cell: ({ row }) => (
      <span className="block max-w-[13rem] truncate">
        {row.original.display.organizationLabel}
      </span>
    ),
  },
  {
    id: "skill_group",
    header: "技能组",
    cell: ({ row }) => (
      <span className="block max-w-[14rem] truncate">
        {row.original.display.skillSummary}
      </span>
    ),
  },
  {
    id: "level",
    header: "级别",
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.display.levelLabel}</span>
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
    id: "actions",
    header: "操作",
    cell: ({ row }) => (
      <div
        data-action-scope="row"
        className="flex justify-end gap-1 whitespace-nowrap"
      >
        <AgentRowActionLink href={row.original.display.detailHref}>
          查看
        </AgentRowActionLink>
        <AgentRowActionLink href={row.original.display.editHref}>
          编辑
        </AgentRowActionLink>
        <AgentRowActionLink href={row.original.display.freezeHref}>
          冻结
        </AgentRowActionLink>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon-xs" variant="ghost" aria-label="更多操作">
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href={row.original.display.skillsEditHref}>技能维护</Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

export function MasterDataAgentTable({
  emptyMessage = "暂无符合条件的客服人员",
  rows,
}: {
  emptyMessage?: string
  rows: AgentRow[]
}) {
  return (
    <MainTableShell
      title="客服人员"
      description="维护客服人员、组织归属、技能组与状态"
      columns={columns}
      data={rows}
      columnLabels={columnLabels}
      emptyMessage={emptyMessage}
      initialSorting={[{ id: "employee_name", desc: false }]}
    />
  )
}

function AgentRowActionLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <Button asChild size="sm" variant="ghost" className="px-2">
      <Link href={href}>{children}</Link>
    </Button>
  )
}
