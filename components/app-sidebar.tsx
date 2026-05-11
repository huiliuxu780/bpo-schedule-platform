"use client"

import * as React from "react"
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
    active: true,
    items: [
      { title: "经营总览", active: true },
      { title: "今日履约" },
      { title: "异常预警", badge: "12" },
      { title: "时段缺口热力图" },
    ],
  },
  {
    title: "计划与排班",
    icon: CalendarDays,
    items: [
      { title: "需求计划" },
      { title: "排班计划" },
      { title: "班次明细" },
      { title: "不可用管理", tag: "P1" },
      { title: "智能排班", tag: "Beta" },
    ],
  },
  {
    title: "履约监控",
    icon: ClipboardCheck,
    items: [
      { title: "工时核验" },
      { title: "坐席状态轨迹" },
      { title: "异常管理", badge: "12" },
      { title: "实时遵守率", tag: "P1" },
      { title: "异常复核", tag: "P1" },
    ],
  },
  {
    title: "结算复盘",
    icon: BarChart3,
    items: [
      { title: "月度结算" },
      { title: "报表中心" },
      { title: "供应商复盘", tag: "P1" },
      { title: "结算锁账", tag: "P1" },
    ],
  },
  {
    title: "数据与集成",
    icon: Database,
    items: [
      { title: "数据源管理" },
      { title: "文件导入" },
      { title: "接入批次" },
      { title: "CORN 状态日志" },
      { title: "字段映射", tag: "P1" },
      { title: "接口集成", tag: "P1" },
      { title: "数据质量", tag: "P1" },
    ],
  },
  {
    title: "系统管理",
    icon: Settings,
    items: [
      { title: "组织与人员" },
      { title: "供应商管理" },
      { title: "规则配置" },
      { title: "权限管理", tag: "P1" },
      { title: "操作审计", tag: "P1" },
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
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(
    () => new Set(nav.filter((group) => group.active).map((group) => group.title))
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
        "hidden h-svh shrink-0 border-r bg-background transition-[width] duration-200 md:block",
        collapsed ? "w-16" : "w-64"
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
              aria-expanded={expandedGroups.has(group.title)}
              title={collapsed ? group.title : undefined}
              onClick={() => toggleGroup(group.title)}
              className={cn(
                "grid h-7 w-full items-center gap-2 rounded-md text-left text-xs font-medium",
                collapsed
                  ? "place-items-center px-0"
                  : "grid-cols-[1rem_1fr_1rem] px-2",
                group.active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
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
            {!collapsed && expandedGroups.has(group.title) ? (
              <div className="mt-1 grid gap-1 pl-7">
                {group.items.map((item) => (
                  <a
                    key={item.title}
                    href="#"
                    className={cn(
                      "grid min-h-7 grid-cols-[1fr_auto] items-center gap-2 rounded-md px-2 text-xs",
                      item.active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
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
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </nav>
    </aside>
  )
}
