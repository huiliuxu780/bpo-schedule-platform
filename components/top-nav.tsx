"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import {
  Activity,
  CalendarDays,
  ChevronsUpDown,
  LogOut,
  Moon,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type TopNavItem = {
  title: string
  href: string
  icon: LucideIcon
  // 过渡期兼容：旧路由仍为现役页面，访问时同步高亮对应新导航项；
  // 旧路由并入新页面后可移除。
  activePrefixes?: string[]
}

const navItems: TopNavItem[] = [
  {
    title: "排班计划台",
    href: "/schedule-desk",
    icon: CalendarDays,
    activePrefixes: ["/schedule-plans"],
  },
  {
    title: "实际执行",
    href: "/execution",
    icon: Activity,
    activePrefixes: ["/actual-logs"],
  },
  {
    title: "基础配置",
    href: "/base-config",
    icon: Settings,
    activePrefixes: ["/master-data"],
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

export function TopNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <Link
        href="/schedule-desk"
        className="flex min-w-0 shrink-0 items-center gap-2"
      >
        <div className="flex size-8 items-center justify-center text-foreground">
          <BrandMark className="size-6" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">BPO WFM</div>
          <div className="truncate text-xs text-muted-foreground">
            人力计划与履约管理
          </div>
        </div>
      </Link>
      <nav
        aria-label="主导航"
        className="flex min-w-0 flex-1 items-center gap-1"
      >
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            pathname.startsWith(`${item.href}/`) ||
            (item.activePrefixes ?? []).some(
              (prefix) =>
                pathname === prefix || pathname.startsWith(`${prefix}/`)
            )

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              )}
            >
              <item.icon className="size-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
      <TopNavUserMenu />
    </div>
  )
}

function TopNavUserMenu() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar className="size-7 rounded-lg">
            <AvatarImage src="/shadcn-avatar.jpg" alt="@shadcn" />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:block">本地用户</span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
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
  )
}
