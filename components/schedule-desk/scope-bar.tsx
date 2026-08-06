"use client"

import { useRouter } from "next/navigation"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type ScopeBarWeekOption = {
  value: string
  label: string
}

type ScheduleDeskScopeBarProps = {
  monthOptions: string[]
  selectedMonth: string
  weekOptions: ScopeBarWeekOption[]
  selectedWeekId: string
  statusLabel: string | null
}

function buildScopeHref(month: string, weekId: string) {
  const searchParams = new URLSearchParams()
  searchParams.set("month", month)

  if (weekId && weekId !== "all") {
    searchParams.set("week", weekId)
  }

  return `/schedule-desk?${searchParams.toString()}`
}

export function ScheduleDeskScopeBar({
  monthOptions,
  selectedMonth,
  weekOptions,
  selectedWeekId,
  statusLabel,
}: ScheduleDeskScopeBarProps) {
  const router = useRouter()

  return (
    <section className="flex flex-wrap items-center gap-3 rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">月份</span>
        <Select
          value={selectedMonth}
          onValueChange={(month) => router.push(buildScopeHref(month, ""))}
        >
          <SelectTrigger className="w-36" aria-label="选择排班月份">
            <SelectValue placeholder="选择月份" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">周</span>
        <Select
          value={selectedWeekId}
          onValueChange={(weekId) => router.push(buildScopeHref(selectedMonth, weekId))}
        >
          <SelectTrigger className="w-56" aria-label="选择排班周">
            <SelectValue placeholder="选择周" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">整个周期</SelectItem>
            {weekOptions.map((week) => (
              <SelectItem key={week.value} value={week.value}>
                {week.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">发布状态</span>
        {statusLabel ? (
          <Badge variant={statusLabel === "已发布" ? "default" : "secondary"}>
            {statusLabel}
          </Badge>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </div>
    </section>
  )
}
