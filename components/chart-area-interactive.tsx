"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { trendData } from "@/app/dashboard/data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const ranges = ["日", "周", "月"]

const TrendAreaChart = dynamic(() => Promise.resolve(TrendAreaChartContent), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-md bg-muted/40" />,
})

export function ChartAreaInteractive() {
  const [range, setRange] = React.useState("日")

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>履约指标趋势</CardTitle>
          <CardDescription>
            排班实现率、排班拟合度、排班遵守率趋势
          </CardDescription>
        </div>
        <div className="flex rounded-md border p-0.5">
          {ranges.map((item) => (
            <Button
              key={item}
              variant={range === item ? "secondary" : "ghost"}
              size="sm"
              className="h-7 px-3"
              onClick={() => setRange(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="h-[280px] min-w-0">
        <TrendAreaChart />
      </CardContent>
    </Card>
  )
}

function TrendAreaChartContent() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={trendData} margin={{ left: -18, right: 12 }}>
        <defs>
          <linearGradient id="realization" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-1))"
              stopOpacity={0.32}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-1))"
              stopOpacity={0.04}
            />
          </linearGradient>
          <linearGradient id="fit" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0.26}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-2))"
              stopOpacity={0.04}
            />
          </linearGradient>
          <linearGradient id="adherence" x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--chart-3))"
              stopOpacity={0.22}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--chart-3))"
              stopOpacity={0.04}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tickMargin={10}
          fontSize={12}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tickMargin={8}
          domain={[80, 100]}
          fontSize={12}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip
          cursor={false}
          contentStyle={{
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--card-foreground))",
          }}
          formatter={(value, name) => [
            `${Number(value).toFixed(1)}%`,
            name === "realization"
              ? "排班实现率"
              : name === "fit"
                ? "排班拟合度"
                : "排班遵守率",
          ]}
        />
        <Area
          dataKey="realization"
          type="monotone"
          stroke="hsl(var(--chart-1))"
          fill="url(#realization)"
          strokeWidth={2}
        />
        <Area
          dataKey="fit"
          type="monotone"
          stroke="hsl(var(--chart-2))"
          fill="url(#fit)"
          strokeWidth={2}
        />
        <Area
          dataKey="adherence"
          type="monotone"
          stroke="hsl(var(--chart-3))"
          fill="url(#adherence)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
