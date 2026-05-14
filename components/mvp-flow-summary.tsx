import Link from "next/link"
import { ArrowRight, DatabaseZap } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  buildDemandPlansHref,
  buildSchedulePlansHref,
  buildScheduleRisksHref,
  buildShiftDetailsHref,
  buildUnavailabilityHref,
} from "@/lib/review-navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function MvpFlowSummary({
  planCount,
  highRiskCount,
  totalGap,
  query,
  status,
}: {
  planCount: number
  highRiskCount: number
  totalGap: number
  query?: string
  status?: string
}) {
  const flowSteps = [
    {
      label: "需求计划",
      description: "查看预测需求输入",
      href: buildDemandPlansHref({ query }),
    },
    {
      label: "排班计划",
      description: "筛选计划并进入详情",
      href: buildSchedulePlansHref({ query, status }),
    },
    {
      label: "风险明细",
      description: "进入风险工作台继续复核",
      href: buildScheduleRisksHref({
        from: "schedule-plans-list",
        query,
        status,
      }),
    },
    {
      label: "不可用影响",
      description: "定位受影响班次",
      href: buildUnavailabilityHref({
        from: "schedule-plans-list",
        query,
        status,
      }),
    },
    {
      label: "班次明细",
      description: "回看 0.5h 明细",
      href: buildShiftDetailsHref({
        from: "schedule-plans-list",
        query,
        status,
      }),
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>本地 MVP 链路</CardTitle>
          <CardDescription>
            当前仅使用本地接口、种子数据和前端 fallback，不接数据库
          </CardDescription>
        </div>
        <Badge variant="outline" className="gap-1">
          <DatabaseZap data-icon="inline-start" />
          No Database
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Metric label="计划数" value={planCount} />
          <Metric label="高风险" value={highRiskCount} />
          <Metric label="缺口人次" value={totalGap} />
        </div>
        <Separator />
        <div className="flex flex-wrap items-center gap-2">
          {flowSteps.map((step, index) => (
            <div key={step.href} className="flex items-center gap-2">
              <Button asChild variant={index === 1 ? "default" : "outline"} size="sm">
                <Link href={step.href}>
                  {step.label}
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <span className="hidden text-xs text-muted-foreground lg:inline">
                {step.description}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-muted/30 px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-semibold tabular-nums">{value}</div>
    </div>
  )
}
