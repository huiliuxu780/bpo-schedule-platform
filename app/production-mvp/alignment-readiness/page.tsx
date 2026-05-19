import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getNextAlignmentReadinessStep,
  productionMvpAlignmentReadinessStatusLabel,
  productionMvpAlignmentReadinessSteps,
  summarizeProductionMvpAlignmentReadiness,
} from "@/lib/production-mvp-alignment-readiness"

export default function ProductionMvpAlignmentReadinessPage() {
  const summary = summarizeProductionMvpAlignmentReadiness(
    productionMvpAlignmentReadinessSteps
  )
  const nextStep = getNextAlignmentReadinessStep()

  return (
    <AppShell title="预测与实际对齐" searchPlaceholder="搜索预测、登录、状态或基准">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> / 预测与实际对齐
            </div>
            <h1 className="text-lg font-semibold">预测版本与实际日志对齐准备</h1>
            <p className="text-sm text-muted-foreground">
              承接路线图第二批：先把预测版本、登录日志、状态日志、状态码映射和对比基准拆成准备步骤。当前仍是本地只读准备视图，不接真实预测、登录或状态接口。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/gaps">生产缺口</Link>
            </Button>
            <Badge variant="outline">准备视图</Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="准备步骤" value={`${summary.stepCount}`} description="第二批对齐准备" />
          <Metric title="可计划" value={`${summary.readyToPlanCount}`} description="仍不接真实接口" />
          <Metric title="需 Gate" value={`${summary.requiresGateCount}`} description="接口/状态码" />
          <Metric title="验收主线" value={`${summary.acceptanceItemCount}`} description="预测/实际/异常" />
          <Metric title="暂缓能力" value={`${summary.deferredCapabilities.length}`} description="后续独立 Gate" />
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>推荐起点</CardTitle>
                <CardDescription>
                  先定义预测版本基准，再对齐登录、状态和异常识别的时间粒度。
                </CardDescription>
              </div>
              <Badge variant="secondary">{nextStep.title}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{nextStep.goal}</p>
            <Button asChild size="sm" variant="outline" className="w-fit">
              <Link href={`/production-mvp/alignment-readiness/${nextStep.id}`}>
                查看起点
              </Link>
            </Button>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          {productionMvpAlignmentReadinessSteps.map((step) => (
            <Card key={step.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <CardDescription>
                      Step {step.sequence} · {step.lane}
                    </CardDescription>
                    <CardTitle className="text-base">{step.title}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      step.status === "ready_to_plan" ? "secondary" : "outline"
                    }
                  >
                    {productionMvpAlignmentReadinessStatusLabel(step.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">{step.goal}</p>
                <div className="flex flex-wrap gap-2">
                  {step.relatedGapIds.map((gapId) => (
                    <Button key={gapId} asChild size="sm" variant="outline">
                      <Link href={`/production-mvp/gaps/${gapId}`}>{gapId}</Link>
                    </Button>
                  ))}
                </div>
                <Button asChild size="sm" variant="outline" className="w-fit">
                  <Link href={`/production-mvp/alignment-readiness/${step.id}`}>
                    查看步骤
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>本批边界</CardTitle>
            <CardDescription>
              对齐准备页只承接路线图，不改变真实集成和生产公式边界。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {summary.deferredCapabilities.map((capability) => (
              <Badge key={capability} variant="secondary">
                {capability}
              </Badge>
            ))}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function Metric({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}
