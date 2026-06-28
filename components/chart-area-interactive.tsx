"use client"

import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts"

import { trendData } from "@/app/dashboard/data"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Badge } from "@/components/ui/badge"

const chartConfig = {
  realization: {
    label: "排班实现率",
    color: "var(--chart-1)",
  },
  fit: {
    label: "排班拟合度",
    color: "var(--chart-2)",
  },
  adherence: {
    label: "排班遵守率",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

const CHART_INITIAL_DIMENSION = { width: 320, height: 250 } as const

export function ChartAreaInteractive() {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>履约指标趋势</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            排班实现率、排班拟合度、排班遵守率趋势
          </span>
          <span className="@[540px]/card:hidden">履约趋势</span>
        </CardDescription>
        <CardAction>
          <Badge variant="outline">示例数据</Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          initialDimension={CHART_INITIAL_DIMENSION}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={trendData} margin={{ left: 4, right: 12 }}>
            <defs>
              <linearGradient id="fillRealization" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-realization)"
                  stopOpacity={1}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-realization)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFit" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-fit)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-fit)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAdherence" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-adherence)"
                  stopOpacity={0.65}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-adherence)"
                  stopOpacity={0.08}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={28}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickMargin={8}
              domain={[80, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value, name) => (
                    <>
                      <span className="text-muted-foreground">
                        {chartConfig[name as keyof typeof chartConfig]?.label ??
                          name}
                      </span>
                      <span className="ml-auto font-mono font-medium tabular-nums text-foreground">
                        {Number(value).toFixed(1)}%
                      </span>
                    </>
                  )}
                />
              }
            />
            <Area
              dataKey="realization"
              type="natural"
              fill="url(#fillRealization)"
              stroke="var(--color-realization)"
              stackId="a"
            />
            <Area
              dataKey="fit"
              type="natural"
              fill="url(#fillFit)"
              stroke="var(--color-fit)"
              stackId="a"
            />
            <Area
              dataKey="adherence"
              type="natural"
              fill="url(#fillAdherence)"
              stroke="var(--color-adherence)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
