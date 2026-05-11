import { TrendingDown, TrendingUp } from "lucide-react"

import { metricCards } from "@/app/dashboard/data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function SectionCards() {
  return (
    <section className="grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
      {metricCards.map((item) => {
        const positive = item.change.startsWith("+")

        return (
          <Card key={item.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <div className="grid gap-1">
                <CardDescription>{item.title}</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums">
                  {item.value}
                </CardTitle>
              </div>
              <Badge variant="outline" className="gap-1">
                {positive ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {item.change}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">{item.insight}</div>
              <div className="mt-1 text-xs text-muted-foreground">{item.note}</div>
            </CardContent>
          </Card>
        )
      })}
    </section>
  )
}
