"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { type AppBreadcrumbItem, SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
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
      <SidebarProvider
        defaultOpen={false}
        style={
          {
            "--sidebar-width": "240px",
            "--sidebar-width-icon": "64px",
            "--header-height": "48px",
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <SiteHeader
            title={title}
            breadcrumbItems={breadcrumbItems}
            actions={actions}
          />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
