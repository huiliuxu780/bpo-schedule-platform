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
  searchPlaceholder?: string
  breadcrumbItems?: AppBreadcrumbItem[]
  actions?: React.ReactNode
  children: React.ReactNode
}

export function AppShell({
  title,
  searchPlaceholder = "搜索计划、项目或职场",
  breadcrumbItems = [],
  actions,
  children,
}: AppShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <AppSidebar />
        <SidebarInset className="h-svh overflow-hidden">
          <SiteHeader
            title={title}
            searchPlaceholder={searchPlaceholder}
            breadcrumbItems={breadcrumbItems}
            actions={actions}
          />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
