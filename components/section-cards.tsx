import Link from "next/link"
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react"

import type { DashboardMetricCard } from "@/lib/dashboard"
import { metricCards as fallbackMetricCards } from "@/app/dashboard/data"
import {
  Card,
  CardContent,
  CardFooter,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

type SectionCardsProps = {
  cards?: DashboardMetricCard[]
}

export function SectionCards({ cards }: SectionCardsProps = {}) {
  const displayCards: DashboardMetricCard[] = cards ?? fallbackMetricCards

  return (
    <section className="@container/main px-4 lg:px-6">
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-sm @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
        {displayCards.map((item) => (
          <Card
            key={item.title}
            className="min-h-[160px] overflow-hidden shadow-sm"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <div className="grid gap-1">
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums @[250px]/card:text-4xl">
                  {item.value}
                </CardTitle>
              </div>
              {item.change && (
                <Badge variant="outline" className="gap-1">
                  {item.change.startsWith("+") ? (
                    <TrendingUp className="size-3" />
                  ) : (
                    <TrendingDown className="size-3" />
                  )}
                  {item.change}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pb-2">
              <div className="text-sm font-medium">{item.insight}</div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 pt-0 text-xs text-muted-foreground">
              <span className="min-w-0">{item.note}</span>
              {item.drilldown ? (
                <Button asChild variant="ghost" size="sm" className="h-7 px-2">
                  <Link href={item.drilldown.href}>
                    {item.drilldown.label}
                    <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              ) : null}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
