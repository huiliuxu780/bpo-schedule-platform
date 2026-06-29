import type { ReactNode } from "react"

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MetricCard({
  title,
  value,
  description,
  action,
}: {
  title: string
  value: string
  description: string
  action?: ReactNode
}) {
  return (
    <Card
      data-slot="metric-card"
      className="@container/card flex min-h-[172px] flex-col bg-gradient-to-t from-primary/5 to-card shadow-md shadow-black/5 transition-shadow hover:shadow-lg dark:bg-card"
    >
      <CardHeader>
        <div className="min-w-0">
          <CardDescription className="text-base">{title}</CardDescription>
          <CardTitle className="mt-3 text-4xl font-semibold tabular-nums @[250px]/card:text-5xl">
            {value}
          </CardTitle>
        </div>
        {action ? <CardAction>{action}</CardAction> : null}
      </CardHeader>
      <CardFooter className="mt-auto flex-col items-start gap-1.5 text-sm">
        <p className="text-muted-foreground">{description}</p>
      </CardFooter>
    </Card>
  )
}
