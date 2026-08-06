import * as React from "react"

import { type AppBreadcrumbItem, SiteHeader } from "@/components/site-header"
import { TopNav } from "@/components/top-nav"
import { TooltipProvider } from "@/components/ui/tooltip"

type AppShellProps = {
  title: string
  breadcrumbItems?: AppBreadcrumbItem[]
  actions?: React.ReactNode
  children: React.ReactNode
}

export function AppShell({
  title,
  breadcrumbItems = [],
  actions,
  children,
}: AppShellProps) {
  return (
    <TooltipProvider>
      <div className="flex h-svh flex-col overflow-hidden">
        <TopNav />
        <SiteHeader
          title={title}
          breadcrumbItems={breadcrumbItems}
          actions={actions}
        />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </div>
    </TooltipProvider>
  )
}
