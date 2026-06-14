"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  ChevronDown,
  ChevronsUpDown,
  Database,
  LayoutDashboard,
  LogOut,
  Moon,
  Settings,
  Sun,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  href: string
  activeMatch?: "exact" | "prefix"
  excludePrefixes?: string[]
  active?: boolean
  badge?: string
  tag?: string
}

type NavGroup = {
  title: string
  icon: LucideIcon
  active?: boolean
  items: NavItem[]
}

const nav: NavGroup[] = [
  {
    title: "运营工作台",
    icon: LayoutDashboard,
    items: [
      { title: "经营总览", href: "/dashboard", activeMatch: "exact" },
    ],
  },
  {
    title: "计划与排班",
    icon: CalendarDays,
    items: [
      { title: "需求计划", href: "/demand-plans", activeMatch: "prefix" },
      {
        title: "排班计划",
        href: "/schedule-plans",
        activeMatch: "prefix",
      },
      { title: "班次明细", href: "/shift-details", activeMatch: "exact" },
      { title: "不可用管理", href: "/unavailability", activeMatch: "exact", tag: "P1" },
    ],
  },
  {
    title: "日志数据",
    icon: Database,
    items: [
      { title: "登录/状态日志", href: "/actual-logs/production", activeMatch: "prefix", tag: "P1" },
    ],
  },
  {
    title: "主数据",
    icon: Settings,
    items: [
      {
        title: "客服人员",
        href: "/master-data/agents",
        activeMatch: "prefix",
        tag: "P1",
      },
      { title: "组织", href: "/master-data/organizations", activeMatch: "prefix" },
      { title: "职场", href: "/master-data/sites", activeMatch: "prefix" },
      { title: "供应商", href: "/master-data/vendors", activeMatch: "prefix" },
      { title: "技能", href: "/master-data/skills", activeMatch: "prefix" },
    ],
  },
]

function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("size-5", className)}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M5.636 5.636a9 9 0 1 0 12.728 12.728a9 9 0 0 0 -12.728 -12.728z" />
      <path d="M16.243 7.757a6 6 0 0 0 -8.486 0" />
    </svg>
  )
}

export function AppSidebar() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const isActiveItem = React.useCallback(
    (item: NavItem) => {
      if (item.activeMatch === "exact") {
        return pathname === item.href
      }

      if (item.activeMatch === "prefix") {
        return (
          pathname.startsWith(item.href) &&
          !item.excludePrefixes?.some((prefix) => pathname.startsWith(prefix))
        )
      }

      return false
    },
    [pathname]
  )
  const activeGroupTitle =
    nav.find((group) => group.items.some((item) => isActiveItem(item)))?.title ??
    "运营工作台"
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    () => new Set(nav.map((group) => group.title))
  )

  function toggleGroup(title: string) {
    setExpandedGroups((current) => {
      const next = new Set(current)

      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }

      return next
    })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <Link href="/dashboard" className="flex min-w-0 items-center gap-2 px-1">
          <div className="flex size-8 items-center justify-center text-foreground">
            <BrandMark className="size-7" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold">BPO WFM</div>
            <div className="truncate text-xs text-muted-foreground">
              人力计划与履约管理
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {nav.map((group) => {
          const groupExpanded =
            expandedGroups.has(group.title) || group.title === activeGroupTitle
          const groupActive = group.title === activeGroupTitle

          return (
            <Collapsible
              key={group.title}
              open={groupExpanded}
              onOpenChange={() => toggleGroup(group.title)}
              className="group/collapsible"
            >
              <SidebarGroup>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={groupActive}
                        tooltip={group.title}
                      >
                        <group.icon />
                        <span>{group.title}</span>
                        <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {group.items.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isActiveItem(item)}
                            >
                              <Link href={item.href}>
                                <span>{item.title}</span>
                                {item.badge ? (
                                  <Badge
                                    variant={item.active ? "secondary" : "outline"}
                                    className="ml-auto h-5 px-1.5"
                                  >
                                    {item.badge}
                                  </Badge>
                                ) : null}
                                {item.tag ? (
                                  <Badge
                                    variant="outline"
                                    className="ml-auto h-5 px-1.5"
                                  >
                                    {item.tag}
                                  </Badge>
                                ) : null}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            </Collapsible>
          )
        })}
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                  tooltip="本地用户"
                >
                  <Avatar className="rounded-lg">
                    <AvatarImage
                      src="/shadcn-avatar.jpg"
                      alt="@shadcn"
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-medium">本地用户</span>
                    <span className="truncate text-xs text-muted-foreground">
                      本地环境
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]:hidden" />
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
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem disabled>
                    <LogOut />
                    <span>退出登录</span>
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
