"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CirclePlus,
  ClipboardList,
  Command,
  FileSpreadsheet,
  Handshake,
  Inbox,
  LayoutDashboard,
  MapPin,
  Moon,
  Network,
  Sun,
  UserRound,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  activeMatch?: "exact" | "prefix"
}

const primaryNav: NavItem[] = [
  {
    title: "经营总览",
    href: "/dashboard",
    icon: LayoutDashboard,
    activeMatch: "exact",
  },
  {
    title: "排班计划",
    href: "/schedule-plans",
    icon: CalendarDays,
    activeMatch: "prefix",
  },
  {
    title: "履约风险",
    href: "/schedule-risks",
    icon: AlertTriangle,
    activeMatch: "prefix",
  },
  {
    title: "不可用记录",
    href: "/unavailability",
    icon: Activity,
    activeMatch: "prefix",
  },
  {
    title: "班次明细",
    href: "/shift-details",
    icon: ClipboardList,
    activeMatch: "prefix",
  },
]

const dataNav: NavItem[] = [
  {
    title: "需求计划",
    href: "/demand-plans",
    icon: FileSpreadsheet,
    activeMatch: "prefix",
  },
  {
    title: "登录/状态日志",
    href: "/actual-logs/production",
    icon: Inbox,
    activeMatch: "prefix",
  },
]

const masterDataNav: NavItem[] = [
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
]

function isActivePath(pathname: string, item: NavItem) {
  if (item.activeMatch === "exact") {
    return pathname === item.href
  }

  return pathname.startsWith(item.href)
}

function NavMenu({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <SidebarMenu>
      {items.map((item) => {
        const Icon = item.icon

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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <Command className="size-5!" />
                <span className="text-base font-semibold">BPO WFM</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  asChild
                  tooltip="快速新建"
                  className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
                >
                  <Link href="/schedule-plans/new">
                    <CirclePlus />
                    <span>快速新建</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuButton
                  asChild
                  tooltip="待处理风险"
                  className="size-8 shrink-0 border bg-background p-0 group-data-[collapsible=icon]:opacity-0"
                >
                  <Link href="/schedule-risks?status=open">
                    <Inbox />
                    <span className="sr-only">待处理风险</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <NavMenu items={primaryNav} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>运营数据</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu items={dataNav} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel>主数据</SidebarGroupLabel>
          <SidebarGroupContent>
            <NavMenu items={masterDataNav} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="rounded-lg grayscale">
                    <AvatarFallback className="rounded-lg">本</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">本地用户</span>
                    <span className="truncate text-xs text-muted-foreground">
                      本地环境
                    </span>
                  </div>
                  <UserRound className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={8}
                className="w-56 rounded-lg"
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
    </Sidebar>
  )
}
