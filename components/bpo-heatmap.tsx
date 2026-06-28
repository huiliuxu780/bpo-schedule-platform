import Link from "next/link"
import * as React from "react"
import { ArrowRight } from "lucide-react"

import { heatmapRows as fallbackRows, heatmapSlots as fallbackSlots } from "@/app/dashboard/data"
import type { DashboardDrilldownLink } from "@/lib/dashboard"
import { summarizeHeatmapRows } from "@/components/data-table-model"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function heatClass(value: number) {
  if (value <= -6) {
    return "bg-destructive text-destructive-foreground"
  }

  if (value <= -3) {
    return "bg-primary text-primary-foreground"
  }

  if (value < 0) {
    return "bg-muted text-foreground"
  }

  return "bg-background text-muted-foreground"
}

type BpoHeatmapProps = {
  rows?: Array<{ day: string; slots: number[] }>
  slots?: string[]
  drilldown?: DashboardDrilldownLink
}

export function BpoHeatmap({ rows, slots, drilldown }: BpoHeatmapProps = {}) {
  const displayRows = rows ?? fallbackRows
  const displaySlots = slots ?? fallbackSlots
  const summary = summarizeHeatmapRows(displayRows, displaySlots)
  const gridTemplateColumns = `3rem repeat(${Math.max(
    displaySlots.length,
    1
  )}, minmax(0, 1fr))`

  const isEmpty = displayRows.length === 0 || displaySlots.length === 0

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="grid min-w-0 gap-1">
          <CardTitle>时段人力缺口</CardTitle>
          <CardDescription>
            总缺口 {summary.totalDeficit} 人次 / 严重时段{" "}
            {summary.severeSlotCount} 个 / 峰值{" "}
            {summary.peak
              ? `${summary.peak.day} ${summary.peak.slot} ${summary.peak.value}`
              : "无"}
          </CardDescription>
        </div>
        {drilldown ? (
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={drilldown.href}>
              {drilldown.label}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        ) : null}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
            暂无可展示的人力缺口时段
          </div>
        ) : (
          <div
            className="grid gap-1 text-xs"
            style={{ gridTemplateColumns }}
          >
            <div />
            {displaySlots.map((slot) => (
              <div
                key={slot}
                className="flex h-7 items-center justify-center text-muted-foreground"
              >
                {slot}
              </div>
            ))}
            {displayRows.map((row) => (
              <React.Fragment key={row.day}>
                <div
                  className="flex h-8 items-center text-muted-foreground"
                >
                  {row.day}
                </div>
                {row.slots.map((value, index) => (
                  <div
                    key={`${row.day}-${displaySlots[index]}`}
                    role="gridcell"
                    tabIndex={0}
                    aria-label={`${row.day} ${displaySlots[index]} 缺口 ${value} 人`}
                    className={cn(
                      "flex h-8 items-center justify-center rounded-md border text-xs tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      heatClass(value)
                    )}
                    title={`${row.day} ${displaySlots[index]} 缺口 ${value}`}
                  >
                    {value}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-sm bg-background ring-1 ring-border" />
            正常
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-sm bg-muted" />
            轻微缺口
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-sm bg-primary" />
            中度缺口
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="size-2 rounded-sm bg-destructive" />
            严重缺口
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
