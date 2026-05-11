import {
  Bell,
  CalendarRange,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"

type SiteHeaderProps = {
  title?: string
  searchPlaceholder?: string
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export function SiteHeader({
  title = "经营总览",
  searchPlaceholder = "搜索异常编号、团队或员工",
  sidebarCollapsed,
  onToggleSidebar,
}: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        aria-label={sidebarCollapsed ? "展开导航栏" : "收起导航栏"}
        onClick={onToggleSidebar}
        className="hidden md:inline-flex"
      >
        {sidebarCollapsed ? (
          <PanelLeftOpen className="size-4" />
        ) : (
          <PanelLeftClose className="size-4" />
        )}
      </Button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-semibold">{title}</h1>
      </div>
      <div className="hidden w-72 items-center gap-2 rounded-md border bg-background px-2 md:flex">
        <Search className="size-4 text-muted-foreground" />
        <Input
          aria-label="搜索"
          placeholder={searchPlaceholder}
          className="h-8 border-0 px-0 shadow-none focus-visible:ring-0"
        />
      </div>
      <Button variant="outline" size="sm" className="hidden md:inline-flex">
        <CalendarRange className="size-4" />
        2026 年 5 月
      </Button>
      <Separator orientation="vertical" className="hidden h-6 md:block" />
      <Button variant="ghost" size="icon" aria-label="通知">
        <Bell className="size-4" />
      </Button>
      <ThemeToggle />
    </header>
  )
}
