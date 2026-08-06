import type * as React from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export type AppBreadcrumbItem = {
  label: string
  href?: string
}

type SiteHeaderProps = {
  title?: string
  breadcrumbItems?: AppBreadcrumbItem[]
  actions?: React.ReactNode
}

export function SiteHeader({
  title = "经营总览",
  breadcrumbItems = [],
  actions,
}: SiteHeaderProps) {
  return (
    <header className="flex min-h-12 shrink-0 items-center gap-3 border-b bg-background/95 px-4 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
      <div className="flex min-w-0 flex-1 items-center">
        {breadcrumbItems.length > 0 ? (
          <>
            <Breadcrumb>
              <BreadcrumbList className="text-sm">
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1

                  return (
                    <AppBreadcrumbNode
                      key={`${item.label}-${index}`}
                      item={item}
                      isLast={isLast}
                    />
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="sr-only">{title}</h1>
          </>
        ) : (
          <h1 className="truncate text-sm font-medium">{title}</h1>
        )}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  )
}

function AppBreadcrumbNode({
  item,
  isLast,
}: {
  item: AppBreadcrumbItem
  isLast: boolean
}) {
  return (
    <>
      <BreadcrumbItem>
        {isLast || !item.href ? (
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={item.href}>{item.label}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
      {!isLast ? <BreadcrumbSeparator /> : null}
    </>
  )
}
