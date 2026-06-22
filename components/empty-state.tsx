import * as React from "react"
import { CircleSlash } from "lucide-react"

import { cn } from "@/lib/utils"

type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string
  detail: string
  compact?: boolean
  icon?: React.ReactNode
}

export function EmptyState({
  title,
  detail,
  compact = false,
  icon,
  children,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-6 text-center",
        compact ? "min-h-36" : "min-h-64",
        className
      )}
      {...props}
    >
      <div data-slot="empty-state-icon" className="text-muted-foreground">
        {icon ?? <CircleSlash className="size-5" />}
      </div>
      <div data-slot="empty-state-title" className="text-sm font-medium">
        {title}
      </div>
      <div
        data-slot="empty-state-detail"
        className="max-w-md text-sm text-muted-foreground"
      >
        {detail}
      </div>
      {children ? (
        <div data-slot="empty-state-actions" className="flex items-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  )
}
