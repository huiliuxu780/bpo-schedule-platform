"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"

type AppShellProps = {
  title: string
  searchPlaceholder?: string
  children: React.ReactNode
}

export function AppShell({
  title,
  searchPlaceholder = "搜索计划、项目或职场",
  children,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <AppSidebar collapsed={sidebarCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <SiteHeader
          title={title}
          searchPlaceholder={searchPlaceholder}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed((current) => !current)}
        />
        {children}
      </div>
    </div>
  )
}
