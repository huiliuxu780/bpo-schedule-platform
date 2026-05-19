"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { BpoHeatmap } from "@/components/bpo-heatmap"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

function GlobalFilterBar() {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-3 lg:px-6">
      <Button variant="outline" size="sm">
        日期范围：2026-05-01 至 2026-05-31
      </Button>
      <Button variant="outline" size="sm">
        供应商：全部
      </Button>
      <Button variant="outline" size="sm">
        团队：全部团队
      </Button>
    </div>
  )
}

export default function DashboardPage() {
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
          <GlobalFilterBar />
          <SectionCards />
          <section className="grid gap-4 px-4 lg:grid-cols-[1.25fr_0.75fr] lg:px-6">
            <ChartAreaInteractive />
            <BpoHeatmap />
          </section>
          <section className="px-4 lg:px-6">
            <DataTable />
          </section>
        </main>
      </div>
    </div>
  )
}
