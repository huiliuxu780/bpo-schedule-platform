"use client"

import { useRouter } from "next/navigation"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  type CoverageDailySummary,
  type CoverageIntervalPoint,
  formatWeekdayLabel,
} from "@/components/schedule-desk/schedule-matrix-model"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type ScheduleDeskCoveragePanelProps = {
  dates: string[]
  selectedDate: string
  queryPrefix: string
  intervalPoints: CoverageIntervalPoint[]
  dailySummaries: CoverageDailySummary[]
}

function buildDateHref(queryPrefix: string, date: string) {
  const parts = [queryPrefix, `date=${encodeURIComponent(date)}`].filter(Boolean)

  return `/schedule-desk?${parts.join("&")}`
}

export function ScheduleDeskCoveragePanel({
  dates,
  selectedDate,
  queryPrefix,
  intervalPoints,
  dailySummaries,
}: ScheduleDeskCoveragePanelProps) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>半小时覆盖</CardTitle>
          <CardDescription>
            {selectedDate}（{formatWeekdayLabel(selectedDate)}）需求人数 vs 计划人数，缺口 = 需求 −
            计划
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">日期</span>
          <Select
            value={selectedDate}
            onValueChange={(date) => router.push(buildDateHref(queryPrefix, date))}
          >
            <SelectTrigger className="w-48" aria-label="选择覆盖日期">
              <SelectValue placeholder="选择日期" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}（{formatWeekdayLabel(date)}）
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={intervalPoints} margin={{ left: -18, right: 12 }} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="timeLabel"
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                fontSize={11}
                interval={3}
              />
              <YAxis axisLine={false} tickLine={false} tickMargin={8} fontSize={11} allowDecimals={false} />
              <Tooltip content={<CoverageIntervalTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
              <Legend
                formatter={(value) => (value === "demandHeadcount" ? "需求人数" : "计划人数")}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="demandHeadcount" fill="var(--chart-1)" opacity={0.55} />
              <Bar dataKey="plannedHeadcount">
                {intervalPoints.map((point) => (
                  <Cell
                    key={point.timeLabel}
                    fill={point.gap > 0 ? "var(--chart-3)" : "var(--chart-2)"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-muted-foreground">
          计划柱为黄色系表示该区间存在缺口（计划 &lt; 需求）；需求为 0 的区间覆盖率显示为 “—”。
        </p>
        <div>
          <h3 className="mb-2 text-sm font-medium">每日缺口汇总</h3>
          {dailySummaries.length === 0 ? (
            <p className="text-sm text-muted-foreground">当前范围暂无覆盖数据。</p>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b bg-muted/60 text-left text-xs text-muted-foreground">
                    <th className="px-3 py-2 font-medium">日期</th>
                    <th className="px-3 py-2 font-medium">星期</th>
                    <th className="px-3 py-2 text-right font-medium">需求合计</th>
                    <th className="px-3 py-2 text-right font-medium">计划合计</th>
                    <th className="px-3 py-2 text-right font-medium">缺口合计</th>
                    <th className="px-3 py-2 text-right font-medium">平均覆盖率</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySummaries.map((day) => (
                    <tr
                      key={day.date}
                      className={cn("border-b last:border-b-0", day.date === selectedDate && "bg-muted/40")}
                    >
                      <td className="px-3 py-2 tabular-nums">{day.date}</td>
                      <td className="px-3 py-2">{day.weekdayLabel}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{day.demandTotal}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{day.plannedTotal}</td>
                      <td
                        className={cn(
                          "px-3 py-2 text-right tabular-nums",
                          day.gapTotal > 0 && "font-medium text-destructive"
                        )}
                      >
                        {day.gapTotal}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {day.averageCoverageRateLabel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function CoverageIntervalTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: CoverageIntervalPoint }>
}) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  const point = payload[0].payload

  return (
    <div className="rounded-md border bg-card p-2 text-xs shadow-md">
      <p className="font-medium">{point.timeLabel}</p>
      <p className="mt-1 text-muted-foreground">
        需求 {point.demandHeadcount} / 计划 {point.plannedHeadcount}
      </p>
      <p
        className={cn(
          "text-muted-foreground",
          point.gap > 0 && "font-medium text-destructive"
        )}
      >
        缺口 {point.gap}
      </p>
      <p className="text-muted-foreground">覆盖率 {point.coverageRateLabel}</p>
    </div>
  )
}
