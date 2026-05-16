"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Database,
  LayoutDashboard,
  Settings,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type NavItem = {
  title: string
  href?: string
  activeMatch?: "exact" | "prefix"
  active?: boolean
  badge?: string
  tag?: string
  development?: boolean
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
      { title: "今日履约", href: "/today-fulfillment", activeMatch: "exact", tag: "P1" },
      { title: "异常预警", href: "/anomaly-alerts", activeMatch: "exact", tag: "P1" },
      { title: "时段缺口热力图", href: "/deficit-heatmap", activeMatch: "exact", tag: "P1" },
    ],
  },
  {
    title: "计划与排班",
    icon: CalendarDays,
    items: [
      { title: "需求计划", href: "/demand-plans", activeMatch: "exact" },
      { title: "排班计划", href: "/schedule-plans", activeMatch: "prefix" },
      { title: "风险提示", href: "/schedule-risks", activeMatch: "prefix" },
      { title: "班次明细", href: "/shift-details", activeMatch: "exact" },
      { title: "不可用管理", href: "/unavailability", activeMatch: "exact", tag: "P1" },
      { title: "智能排班", development: true },
    ],
  },
  {
    title: "履约监控",
    icon: ClipboardCheck,
    items: [
      { title: "工时核验", href: "/fulfillment-monitoring", activeMatch: "exact", tag: "P1" },
      { title: "坐席状态轨迹", href: "/agent-status-trace", activeMatch: "exact", tag: "P1" },
      { title: "异常管理", href: "/fulfillment-exceptions", activeMatch: "exact", tag: "P1" },
      { title: "实时遵守率", href: "/adherence-monitoring", activeMatch: "exact", tag: "P1" },
      { title: "异常复核", href: "/exception-review", activeMatch: "exact", tag: "P1" },
    ],
  },
  {
    title: "结算复盘",
    icon: BarChart3,
    items: [
      { title: "月度结算", href: "/monthly-settlement", activeMatch: "exact", tag: "P1" },
      { title: "报表中心", href: "/report-center", activeMatch: "exact", tag: "P1" },
      { title: "供应商复盘", href: "/supplier-review", activeMatch: "exact", tag: "P1" },
      { title: "结算锁账", development: true },
    ],
  },
  {
    title: "数据与集成",
    icon: Database,
    items: [
      { title: "数据源管理", href: "/demo-imports", activeMatch: "exact" },
      { title: "文件导入", href: "/demo-imports", activeMatch: "exact" },
      { title: "接入批次", href: "/demo-imports", activeMatch: "exact" },
      { title: "CORN 状态日志", href: "/corn-status-log", activeMatch: "exact", tag: "P1" },
      { title: "字段映射", href: "/field-mapping", activeMatch: "exact", tag: "P1" },
      { title: "接口集成", development: true },
      { title: "数据质量", href: "/data-quality", activeMatch: "exact", tag: "P1" },
    ],
  },
  {
    title: "系统管理",
    icon: Settings,
    items: [
      { title: "组织与人员", href: "/organization-people", activeMatch: "exact", tag: "P1" },
      { title: "供应商管理", href: "/vendor-management", activeMatch: "exact", tag: "P1" },
      { title: "规则配置", href: "/rule-configuration", activeMatch: "exact", tag: "P1" },
      { title: "权限管理", development: true },
      { title: "操作审计", development: true },
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
      if (!item.href) {
        return false
      }

      if (item.activeMatch === "exact") {
        return pathname === item.href
      }

      if (item.activeMatch === "prefix") {
        return pathname.startsWith(item.href)
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
                {group.items.map((item) => {
                  const itemClassName = cn(
                    "grid min-h-8 grid-cols-[1fr_auto] items-center gap-2 rounded-md px-2 text-sm",
                    item.development
                      ? "cursor-not-allowed text-muted-foreground/60"
                      : isActiveItem(item)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                  const content = (
                    <>
                      <span className="truncate">{item.title}</span>
                      {item.development ? (
                        <Badge
                          variant="outline"
                          className="h-5 border-dashed px-1.5 text-[10px] text-muted-foreground"
                        >
                          开发中
                        </Badge>
                      ) : null}
                      {!item.development && item.badge ? (
                        <Badge
                          variant={item.active ? "secondary" : "outline"}
                          className="h-5 px-1.5"
                        >
                          {item.badge}
                        </Badge>
                      ) : null}
                      {!item.development && item.tag ? (
                        <Badge variant="outline" className="h-5 px-1.5">
                          {item.tag}
                        </Badge>
                      ) : null}
                    </>
                  )

                  if (item.development) {
                    return (
                      <div
                        key={item.title}
                        aria-disabled="true"
                        data-development-nav-item="true"
                        title={`${item.title} 开发中`}
                        className={itemClassName}
                      >
                        {content}
                      </div>
                    )
                  }

                  if (!item.href) {
                    return null
                  }

                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className={itemClassName}
                    >
                      {content}
                    </Link>
                  )
                })}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  )
}
