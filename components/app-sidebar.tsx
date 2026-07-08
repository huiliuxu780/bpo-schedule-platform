"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import {
  CalendarClock,
  CalendarCog,
  Gauge,
  Inbox,
  LayoutDashboard,
  Moon,
  MoreHorizontal,
  Settings,
  Sun,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  href: string
  icon?: LucideIcon
  activeMatch?: "exact" | "prefix"
  activePrefixes?: string[]
  activeExcludePrefixes?: string[]
}

const primaryNav: NavItem[] = [
  {
    title: "经营总览",
    href: "/dashboard",
    icon: Gauge,
    activeMatch: "exact",
  },
  {
    title: "排班",
    href: "/roster-drafts",
    icon: CalendarClock,
    activePrefixes: [
      "/demand-plans",
      "/schedule-plans",
      "/roster-drafts",
      "/published-roster",
      "/schedule-risks",
      "/shift-details",
      "/unavailability",
    ],
  },
  {
    title: "待办",
    href: "/roster-change-governance",
    icon: Inbox,
    activePrefixes: [
      "/roster-change-governance",
      "/duty-requests",
      "/data-quality/review-cases",
      "/data-quality/comparison-runs",
    ],
  },
]

const systemNav: NavItem = {
  title: "系统管理",
  href: "/master-data/agents",
  icon: Settings,
  activePrefixes: [
    "/master-data",
    "/master-data/agents",
    "/master-data/organizations",
    "/master-data/sites",
    "/master-data/vendors",
    "/master-data/skills",
    "/actual-logs",
    "/actual-logs/production",
    "/data-quality",
  ],
  activeExcludePrefixes: [
    "/data-quality/review-cases",
    "/data-quality/comparison-runs",
  ],
}

function isActivePath(pathname: string, item: NavItem) {
  if (item.activeExcludePrefixes?.some((prefix) => pathname.startsWith(prefix))) {
    return false
  }

  if (item.activeMatch === "exact") {
    return pathname === item.href
  }

  if (item.activePrefixes?.some((prefix) => pathname.startsWith(prefix))) {
    return true
  }

  return pathname.startsWith(item.href)
}

function NavList({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const Icon = item.icon ?? LayoutDashboard

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActivePath(pathname, item)}
              tooltip={item.title}
            >
              <Link href={item.href}>
                <Icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
}

function BrandMark() {
  return (
    <div className="flex size-6 items-center justify-center rounded-md border bg-background text-foreground">
      <CalendarCog />
    </div>
  )
}

export function AppSidebar({
  variant = "sidebar",
}: React.ComponentProps<typeof Sidebar>) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Sidebar collapsible="icon" variant={variant}>
      <SidebarHeader className="gap-1 px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/dashboard">
                <BrandMark />
                <div
                  data-slot="brand-copy"
                  className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden"
                >
                  <span className="truncate font-medium">BPO WFM</span>
                  <span className="truncate text-xs text-muted-foreground">
                    人力计划与履约管理
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-4">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <NavList items={primaryNav} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3">
        <NavList items={[systemNav]} />
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="rounded-lg">
                    <AvatarImage src="/shadcn-avatar.jpg" alt="本地用户" />
                    <AvatarFallback className="rounded-lg">本</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">本地用户</span>
                    <span className="truncate text-xs text-muted-foreground">
                      本地环境
                    </span>
                  </div>
                  <MoreHorizontal className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={8}
                className="w-56"
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={(event) => {
                      event.preventDefault()
                      setTheme(isDark ? "light" : "dark")
                    }}
                  >
                    {isDark ? <Sun /> : <Moon />}
                    <span>{isDark ? "切换为浅色" : "切换为深色"}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
