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
  getNextAnomalyTriageReadinessStep,
  productionMvpAnomalyTriageReadinessStatusLabel,
  productionMvpAnomalyTriageReadinessSteps,
  summarizeProductionMvpAnomalyTriageReadiness,
} from "@/lib/production-mvp-anomaly-triage-readiness"

export default function ProductionMvpAnomalyTriageReadinessPage() {
  const summary = summarizeProductionMvpAnomalyTriageReadiness(
    productionMvpAnomalyTriageReadinessSteps
  )
  const nextStep = getNextAnomalyTriageReadinessStep()

  return (
    <AppShell title="异常识别准备" searchPlaceholder="搜索异常类型、归因或复核">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> / 异常识别准备
            </div>
            <h1 className="text-lg font-semibold">异常识别与复核准备</h1>
            <p className="text-sm text-muted-foreground">
              承接路线图第三批：先把异常类型、来源证据、分派归因、复核工作流和关闭审计拆成准备步骤。当前仍是本地只读准备视图，不执行真实规则识别、复核提交、审批或生产公式。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/anomaly-review">异常复核</Link>
            </Button>
            <Badge variant="outline">准备视图</Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="准备步骤" value={`${summary.stepCount}`} description="第三批复核准备" />
          <Metric title="可计划" value={`${summary.readyToPlanCount}`} description="只读建模" />
          <Metric title="需 Gate" value={`${summary.requiresGateCount}`} description="工作流/审计" />
          <Metric title="验收主线" value={`${summary.acceptanceItemCount}`} description="异常/实际" />
          <Metric title="暂缓能力" value={`${summary.deferredCapabilities.length}`} description="后续独立 Gate" />
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>推荐起点</CardTitle>
                <CardDescription>
                  先定义异常类型目录，再接来源证据和复核归因字段。
                </CardDescription>
              </div>
              <Badge variant="secondary">{nextStep.title}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{nextStep.goal}</p>
            <Button asChild size="sm" variant="outline" className="w-fit">
              <Link href={`/production-mvp/anomaly-triage-readiness/${nextStep.id}`}>
                查看起点
              </Link>
            </Button>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          {productionMvpAnomalyTriageReadinessSteps.map((step) => (
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
                    {productionMvpAnomalyTriageReadinessStatusLabel(step.status)}
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
                  <Link href={`/production-mvp/anomaly-triage-readiness/${step.id}`}>
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
              异常准备页只定义后续拆批线索，不改变复核、审批、权限和生产公式边界。
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
