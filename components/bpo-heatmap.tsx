import * as React from "react"

import { heatmapRows, heatmapSlots } from "@/app/dashboard/data"
import { summarizeHeatmapRows } from "@/components/data-table-model"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

export function BpoHeatmap() {
  const summary = summarizeHeatmapRows(heatmapRows, heatmapSlots)

  return (
    <Card>
      <CardHeader>
        <CardTitle>时段人力缺口</CardTitle>
        <CardDescription>
          总缺口 {summary.totalDeficit} 人次 / 严重时段{" "}
          {summary.severeSlotCount} 个 / 峰值{" "}
          {summary.peak
            ? `${summary.peak.day} ${summary.peak.slot} ${summary.peak.value}`
            : "无"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[3rem_repeat(8,minmax(0,1fr))] gap-1 text-xs">
          <div />
          {heatmapSlots.map((slot) => (
            <div
              key={slot}
              className="flex h-7 items-center justify-center text-muted-foreground"
            >
              {slot}
            </div>
          ))}
          {heatmapRows.map((row) => (
            <React.Fragment key={row.day}>
              <div
                className="flex h-8 items-center text-muted-foreground"
              >
                {row.day}
              </div>
              {row.slots.map((value, index) => (
                <div
                  key={`${row.day}-${heatmapSlots[index]}`}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`${row.day} ${heatmapSlots[index]} 缺口 ${value} 人`}
                  className={cn(
                    "flex h-8 items-center justify-center rounded-md border text-xs tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    heatClass(value)
                  )}
                  title={`${row.day} ${heatmapSlots[index]} 缺口 ${value}`}
                >
                  {value}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
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
