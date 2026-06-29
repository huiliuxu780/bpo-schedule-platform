"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type IntervalRow = {
  forecast_agents: number
  scheduled_agents: number
}

type DraftSummaryProps = {
  intervals: IntervalRow[]
}

export function SchedulePlanDraftSummary({ intervals }: DraftSummaryProps) {
  const intervalCount = intervals.length
  const totalForecast = intervals.reduce((sum, row) => sum + row.forecast_agents, 0)
  const totalScheduled = intervals.reduce((sum, row) => sum + row.scheduled_agents, 0)
  const totalGap = intervals.reduce(
    (sum, row) => sum + Math.max(row.forecast_agents - row.scheduled_agents, 0),
    0
  )
  const coverageRate = totalForecast > 0 ? totalScheduled / totalForecast : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle>草稿摘要</CardTitle>
        <CardDescription>
          按当前录入时段汇总，用于保存前复核草稿口径。
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">时段数量</span>
            <span className="font-medium">{intervalCount}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">总预测人力</span>
            <span className="font-medium">{totalForecast}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">总已排人力</span>
            <span className="font-medium">{totalScheduled}</span>
          </div>
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">总缺口人力</span>
            <span className="font-medium">{totalGap}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">覆盖率</span>
            <span className="font-medium">{(coverageRate * 100).toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
