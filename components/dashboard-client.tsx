"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { BpoHeatmap } from "@/components/bpo-heatmap"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataSyncStatus } from "@/components/data-sync-status"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import type {
  DashboardFilterState,
  DashboardImportKpiBatch,
  DashboardSyncStatusRow,
} from "@/components/data-table-model"

type DashboardClientProps = {
  filters: DashboardFilterState
  importBatches: DashboardImportKpiBatch[]
  syncStatusRows: DashboardSyncStatusRow[]
}

const selectClassName =
  "h-8 min-w-32 rounded-lg border border-input bg-background px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"

function GlobalFilterBar({ filters }: { filters: DashboardFilterState }) {
  return (
    <form
      action="/dashboard"
      className="flex flex-wrap items-end gap-2 px-4 py-3 lg:px-6"
    >
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        日期范围
        <select
          aria-label="日期范围"
          className={selectClassName}
          defaultValue={filters.date}
          name="date"
        >
          <option value="2026-05-11">2026-05-11</option>
          <option value="2026-05-12">2026-05-12</option>
          <option value="2026-05">2026-05 全月</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        职场/团队
        <select
          aria-label="职场/团队"
          className={selectClassName}
          defaultValue={filters.site}
          name="site"
        >
          <option value="all">全部职场/团队</option>
          <option value="上海职场">上海职场</option>
          <option value="苏州职场">苏州职场</option>
          <option value="华东一组">华东一组</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        供应商
        <select
          aria-label="供应商"
          className={selectClassName}
          defaultValue={filters.vendor}
          name="vendor"
        >
          <option value="all">全部供应商</option>
          <option value="供应商A">供应商A</option>
          <option value="供应商B">供应商B</option>
        </select>
      </label>
      <label className="grid gap-1 text-xs font-medium text-muted-foreground">
        数据版本
        <select
          aria-label="数据版本"
          className={selectClassName}
          defaultValue={filters.dataVersion}
          name="dataVersion"
        >
          <option value="imported">本机导入版本</option>
          <option value="effective">生效版本</option>
        </select>
      </label>
      <Button size="sm" type="submit">
        应用筛选
      </Button>
    </form>
  )
}

export function DashboardClient({
  filters,
  importBatches,
  syncStatusRows,
}: DashboardClientProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <SiteHeader
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
        />
        <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto pb-6">
          <GlobalFilterBar filters={filters} />
          <SectionCards importBatches={importBatches} />
          <section className="grid gap-4 px-4 lg:grid-cols-[1.25fr_0.75fr] lg:px-6">
            <ChartAreaInteractive />
            <BpoHeatmap />
          </section>
          <section className="grid gap-4 px-4 lg:grid-cols-[1fr_360px] lg:px-6">
            <DataTable />
            <DataSyncStatus rows={syncStatusRows} />
          </section>
        </main>
      </div>
    </div>
  )
}
