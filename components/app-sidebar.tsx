"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  CircleHelp,
  Database,
  Handshake,
  Inbox,
  LayoutDashboard,
  MapPin,
  Moon,
  MoreHorizontal,
  Network,
  PanelTop,
  PlusCircle,
  Settings,
  Sun,
  type LucideIcon,
  Users,
  Wrench,
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
}

type NavGroup = {
  title: string
  icon: LucideIcon
  items: NavItem[]
}

const nav: NavGroup[] = [
  {
    title: "运营工作台",
    icon: LayoutDashboard,
    items: [
      {
        title: "经营总览",
        href: "/dashboard",
        activeMatch: "exact",
      },
    ],
  },
  {
    title: "计划与排班",
    icon: CalendarDays,
    items: [
      {
        title: "需求计划",
        href: "/demand-plans",
        icon: PanelTop,
        activeMatch: "prefix",
      },
      {
        title: "排班计划",
        href: "/schedule-plans",
        icon: CalendarDays,
        activeMatch: "prefix",
      },
      {
        title: "月班表草稿",
        href: "/roster-drafts",
        icon: CalendarDays,
        activeMatch: "prefix",
      },
      {
        title: "履约风险",
        href: "/schedule-risks",
        icon: CircleHelp,
        activeMatch: "prefix",
      },
    ],
  },
  {
    title: "日志数据",
    icon: Database,
    items: [
      {
        title: "登录/状态日志",
        href: "/actual-logs/production",
        icon: Inbox,
        activeMatch: "prefix",
      },
    ],
  },
  {
    title: "主数据",
    icon: Settings,
    items: [
      {
        title: "客服人员",
        href: "/master-data/agents",
        icon: Users,
        activeMatch: "prefix",
      },
      {
        title: "组织",
        href: "/master-data/organizations",
        icon: Network,
        activeMatch: "prefix",
      },
      {
        title: "职场",
        href: "/master-data/sites",
        icon: MapPin,
        activeMatch: "prefix",
      },
      {
        title: "供应商",
        href: "/master-data/vendors",
        icon: Handshake,
        activeMatch: "prefix",
      },
      {
        title: "技能",
        href: "/master-data/skills",
        icon: Wrench,
        activeMatch: "prefix",
      },
    ],
  },
]

function isActivePath(pathname: string, item: NavItem) {
  if (item.activeMatch === "exact") {
    return pathname === item.href
  }

  return pathname.startsWith(item.href)
}

function NavList({
  groupIcon,
  items,
}: {
  groupIcon?: LucideIcon
  items: NavItem[]
}) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const Icon = item.icon ?? groupIcon ?? LayoutDashboard

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
      <LayoutDashboard />
    </div>
  )
}

export function AppSidebar({
  variant = "inset",
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Sidebar collapsible="icon" variant={variant}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/dashboard">
                <BrandMark />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">BPO WFM</span>
                  <span className="truncate text-xs text-muted-foreground">
                    人力计划与履约管理
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === "/schedule-plans/new"}
            >
              <Link href="/schedule-plans/new">
                <PlusCircle />
                <span>快速新建</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/schedule-risks?status=open">
                <Inbox />
                <span>待处理风险</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {nav.map((group) => (
              <div key={group.title} className="mb-3 last:mb-0">
                <div className="px-2 pb-1 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
                  {group.title}
                </div>
                <NavList groupIcon={group.icon} items={group.items} />
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
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
