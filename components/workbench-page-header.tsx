import type { ReactNode } from "react"

export function WorkbenchPageHeader({
  description,
  actions,
}: {
  description: string
  actions?: ReactNode
}) {
  return (
    <section
      data-slot="workbench-page-header"
      className="flex flex-wrap items-center justify-between gap-3"
    >
      <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      ) : null}
    </section>
  )
}
