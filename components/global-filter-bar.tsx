import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { DashboardOperationalFilters } from "@/lib/dashboard"

type FilterOptionGroupProps = {
  label: string
  active?: string
  options: Array<{
    label: string
    value: string
  }>
  param: keyof DashboardOperationalFilters
  buildHref: (overrides: Partial<DashboardOperationalFilters>) => string
}

type GlobalFilterBarProps = {
  filters: DashboardOperationalFilters
  hasActiveFilters: boolean
  sites?: string[]
  projects?: string[]
  planStatuses?: string[]
}

const planStatusLabels: Record<string, string> = {
  draft: "草稿",
  review_ready: "待复核",
  published: "已发布",
}

function FilterOptionGroup({
  label,
  active,
  options,
  param,
  buildHref,
}: FilterOptionGroupProps) {
  if (options.length === 0) {
    return null
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="flex min-w-0 flex-wrap items-center gap-1">
        <Button asChild variant={!active ? "secondary" : "ghost"} size="sm">
          <Link href={buildHref({ [param]: undefined })}>全部</Link>
        </Button>
        {options.map((option) => (
          <Button
            key={option.value}
            asChild
            variant={active === option.value ? "secondary" : "ghost"}
            size="sm"
          >
            <Link href={buildHref({ [param]: option.value })}>
              {option.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}

export function GlobalFilterBar({
  filters,
  hasActiveFilters,
  sites = [],
  projects = [],
  planStatuses = [],
}: GlobalFilterBarProps) {
  function buildHref(overrides: Partial<DashboardOperationalFilters>): string {
    const params = new URLSearchParams()
    const merged = { ...filters, ...overrides }

    for (const [key, value] of Object.entries(merged)) {
      if (value && value.trim()) {
        params.set(key, value)
      }
    }

    const queryString = params.toString()
    return queryString ? `/dashboard?${queryString}` : "/dashboard"
  }

  const siteOptions = sites.map((site) => ({ label: site, value: site }))
  const projectOptions = projects.map((project) => ({
    label: project,
    value: project,
  }))
  const statusOptions = planStatuses.map((status) => ({
    label: planStatusLabels[status] ?? status,
    value: status,
  }))

  return (
    <section className="mx-4 rounded-lg border bg-card/50 px-3 py-2 lg:mx-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <div className="shrink-0 text-sm font-medium text-foreground">
          总览口径
        </div>
        <FilterOptionGroup
          label="项目"
          active={filters.project}
          options={projectOptions}
          param="project"
          buildHref={buildHref}
        />
        <FilterOptionGroup
          label="职场"
          active={filters.site}
          options={siteOptions}
          param="site"
          buildHref={buildHref}
        />
        <FilterOptionGroup
          label="计划状态"
          active={filters.planStatus}
          options={statusOptions}
          param="planStatus"
          buildHref={buildHref}
        />
        {hasActiveFilters ? (
          <Button asChild variant="outline" size="sm" className="ml-auto">
            <Link href="/dashboard">重置</Link>
          </Button>
        ) : null}
      </div>
    </section>
  )
}
