import Link from "next/link"
import { ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react"

import type { DashboardMetricCard } from "@/lib/dashboard"
import { metricCards as fallbackMetricCards } from "@/app/dashboard/data"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
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
      <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
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
      className="@container/card group flex min-h-[196px] flex-col overflow-hidden shadow-md shadow-black/5 transition-shadow hover:shadow-lg"
    >
      <CardHeader>
        <div className="min-w-0">
          <CardDescription className="text-base">
            {item.title}
          </CardDescription>
          <CardTitle className="mt-3 text-4xl font-semibold tabular-nums @[250px]/card:text-5xl">
            {item.value}
          </CardTitle>
        </div>
        {item.change && (
          <CardAction>
            <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-semibold">
              {item.change.startsWith("+") ? (
                <TrendingUp data-icon="inline-start" />
              ) : (
                <TrendingDown data-icon="inline-start" />
              )}
              {item.change}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="mt-auto flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex items-center gap-2 font-medium">
          <span className="truncate">{item.insight}</span>
          {item.drilldown ? (
            <ArrowUpRight
              data-icon="inline-end"
              className="shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          ) : null}
        </div>
        <p className="text-muted-foreground">
          {item.note}
        </p>
      </CardFooter>
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
