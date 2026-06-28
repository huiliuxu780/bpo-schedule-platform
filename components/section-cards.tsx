import Link from "next/link"
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"

import type { DashboardMetricCard } from "@/lib/dashboard"
import { metricCards as fallbackMetricCards } from "@/app/dashboard/data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type SectionCardsProps = {
  cards?: DashboardMetricCard[]
}

export function SectionCards({ cards }: SectionCardsProps = {}) {
  const displayCards: DashboardMetricCard[] = cards ?? fallbackMetricCards

  return (
    <section className="@container/main px-4 lg:px-6">
      <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {displayCards.map((item) => (
          <MetricCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  )
}

function MetricCard({ item }: { item: DashboardMetricCard }) {
  const content = (
    <Card
      data-slot="card"
      className="@container/card group relative flex min-h-[196px] flex-col overflow-hidden rounded-xl border bg-gradient-to-t from-primary/5 to-card shadow-md shadow-black/5 transition-shadow hover:shadow-lg dark:from-primary/10 dark:to-card"
    >
      <CardHeader className="flex w-full flex-row items-start justify-between gap-4 p-6 pb-0">
        <div className="min-w-0">
          <CardDescription className="text-base leading-none">
            {item.title}
          </CardDescription>
          <CardTitle className="mt-6 text-4xl font-semibold tracking-normal tabular-nums text-foreground @[280px]/card:text-5xl">
            {item.value}
          </CardTitle>
        </div>
        {item.change && (
          <Badge
            variant="outline"
            className="h-8 shrink-0 rounded-full border-border/70 bg-background/70 px-3 text-sm font-semibold shadow-xs backdrop-blur-sm"
          >
            {item.change.startsWith("+") ? (
              <TrendingUp data-icon="inline-start" />
            ) : (
              <TrendingDown data-icon="inline-start" />
            )}
            {item.change}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="mt-auto flex flex-col gap-2 p-6 pt-0">
        <div className="flex items-center gap-2 text-base font-semibold leading-none text-foreground">
          <span className="truncate">{item.insight}</span>
          {item.drilldown ? (
            <ArrowUpRight
              data-icon="inline-end"
              className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          ) : null}
        </div>
        <p className="text-base leading-none text-muted-foreground">
          {item.note}
        </p>
      </CardContent>
    </Card>
  )

  if (!item.drilldown) {
    return content
  }

  return (
    <Link
      href={item.drilldown.href}
      aria-label={item.drilldown.label}
      className="block h-full"
    >
      {content}
    </Link>
  )
}
