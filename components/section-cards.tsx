import { TrendingDown, TrendingUp } from "lucide-react"

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

type SectionCardsProps = {
  cards?: DashboardMetricCard[]
}

export function SectionCards({ cards }: SectionCardsProps = {}) {
  const displayCards = cards ?? fallbackMetricCards

  return (
    <section className="@container/main px-4 lg:px-6">
      <div className="grid gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {displayCards.map((item) => (
          <Card
            key={item.title}
            className="min-h-[204px] overflow-hidden bg-gradient-to-t from-card to-muted/20"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <div className="grid gap-1">
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-[30px] leading-9 font-semibold tabular-nums">
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
            <CardContent>
              <div className="text-sm font-medium">{item.insight}</div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              {item.note}
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  )
}
