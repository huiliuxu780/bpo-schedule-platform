"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CalendarDays,
  ChevronDown,
  Database,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
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

type AppSidebarProps = {
  collapsed: boolean
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
      { title: "需求计划", href: "/demand-plans", activeMatch: "exact" },
      { title: "预测生产", href: "/demand-plans/production", activeMatch: "prefix", tag: "P1" },
      { title: "排班生产", href: "/schedule-plans/production", activeMatch: "exact", tag: "P1" },
      {
        title: "排班计划",
        href: "/schedule-plans",
        activeMatch: "prefix",
        excludePrefixes: ["/schedule-plans/production"],
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
      { title: "组织", href: "/master-data/organizations", activeMatch: "exact" },
      { title: "职场", href: "/master-data/sites", activeMatch: "exact" },
      { title: "供应商", href: "/master-data/vendors", activeMatch: "exact" },
      { title: "技能", href: "/master-data/skills", activeMatch: "exact" },
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

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const pathname = usePathname()
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
    () => new Set([activeGroupTitle])
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
    <aside
      className={cn(
        "hidden h-svh shrink-0 border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 md:block",
        collapsed ? "w-16" : "w-72"
      )}
    >
      <div
        className={cn(
          "flex h-12 items-center border-b px-2",
          collapsed ? "justify-center" : "justify-between gap-2"
        )}
      >
        <a
          href="#"
          className={cn(
            "flex min-w-0 items-center gap-2",
            collapsed && "hidden"
          )}
        >
          <div className="flex size-8 items-center justify-center text-foreground">
            <BrandMark className="size-7" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">BPO WFM</div>
            <div className="truncate text-xs text-muted-foreground">
              人力计划与履约管理
            </div>
          </div>
        </a>
        {collapsed ? (
          <div className="flex size-8 items-center justify-center text-foreground">
            <BrandMark className="size-7" />
          </div>
        ) : null}
      </div>
      <nav
        className={cn(
          "flex h-[calc(100vh-3rem)] flex-col gap-1 overflow-y-auto p-2",
          collapsed && "items-center"
        )}
      >
        {nav.map((group) => (
          <div key={group.title} className={cn("pb-1", collapsed && "w-10")}>
            <button
              aria-expanded={
                expandedGroups.has(group.title) || group.title === activeGroupTitle
              }
              title={collapsed ? group.title : undefined}
              onClick={() => toggleGroup(group.title)}
              className={cn(
                "grid h-8 w-full items-center gap-2 rounded-md text-left text-sm font-medium",
                collapsed
                  ? "place-items-center px-0"
                  : "grid-cols-[1rem_1fr_1rem] px-2",
                group.title === activeGroupTitle
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <group.icon className="size-4" />
              <span className={cn("truncate", collapsed && "sr-only")}>
                {group.title}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 opacity-60 transition-transform",
                  expandedGroups.has(group.title) && "rotate-180",
                  collapsed && "hidden"
                )}
              />
            </button>
            {!collapsed &&
            (expandedGroups.has(group.title) || group.title === activeGroupTitle) ? (
              <div className="mt-1 grid gap-1 pl-7">
                {group.items.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "grid min-h-8 grid-cols-[1fr_auto] items-center gap-2 rounded-md px-2 text-sm",
                      isActiveItem(item)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <span className="truncate">{item.title}</span>
                    {item.badge ? (
                      <Badge
                        variant={item.active ? "secondary" : "outline"}
                        className="h-5 px-1.5"
                      >
                        {item.badge}
                      </Badge>
                    ) : null}
                    {item.tag ? (
                      <Badge variant="outline" className="h-5 px-1.5">
                        {item.tag}
                      </Badge>
                    ) : null}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  )
}
