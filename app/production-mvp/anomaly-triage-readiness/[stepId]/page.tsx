import Link from "next/link"
import { notFound } from "next/navigation"

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
  getProductionMvpAnomalyTriageReadinessStep,
  productionMvpAnomalyTriageReadinessStatusLabel,
  productionMvpAnomalyTriageReadinessSteps,
} from "@/lib/production-mvp-anomaly-triage-readiness"

type PageProps = {
  params: Promise<{
    stepId: string
  }>
}

export function generateStaticParams() {
  return productionMvpAnomalyTriageReadinessSteps.map((step) => ({
    stepId: step.id,
  }))
}

export default async function ProductionMvpAnomalyTriageReadinessStepPage({
  params,
}: PageProps) {
  const { stepId } = await params
  const step = getProductionMvpAnomalyTriageReadinessStep(
    decodeURIComponent(stepId)
  )

  if (!step) {
    notFound()
  }

  return (
    <AppShell title={step.title} searchPlaceholder="搜索触发、复核或证据">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> /{" "}
              <Link href="/production-mvp/anomaly-triage-readiness">
                异常识别准备
              </Link>{" "}
              / {step.id}
            </div>
            <h1 className="text-lg font-semibold">{step.title}</h1>
            <p className="text-sm text-muted-foreground">{step.goal}</p>
          </div>
          <Badge variant={step.status === "ready_to_plan" ? "secondary" : "outline"}>
            {productionMvpAnomalyTriageReadinessStatusLabel(step.status)}
          </Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="步骤" value={`${step.sequence}`} />
          <Metric title="业务主线" value={step.lane} />
          <Metric title="触发口径" value={`${step.triggerCriteria.length}`} />
          <Metric title="复核字段" value={`${step.reviewFields.length}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <TagCard title="输入对象" values={step.inputObjects} />
          <TagCard title="输出物" values={step.outputArtifacts} />
          <TagCard title="触发口径" values={step.triggerCriteria} />
          <TagCard title="复核字段" values={step.reviewFields} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <TagCard
            title="前置依赖"
            values={step.dependsOnStepIds}
            routePrefix="/production-mvp/anomaly-triage-readiness"
            emptyText="无"
          />
          <TagCard
            title="关联缺口"
            values={step.relatedGapIds}
            routePrefix="/production-mvp/gaps"
          />
          <TagCard
            title="验收主线"
            values={step.acceptanceItemIds}
            routePrefix="/production-mvp/acceptance-checklist"
          />
          <TagCard title="证据页" values={step.evidenceRoutes} routePrefix="" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>暂缓能力</CardTitle>
              <CardDescription>这些能力需要后续独立 Gate。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {step.deferredCapabilities.map((capability) => (
                <Badge key={capability} variant="secondary">
                  {capability}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>边界说明</CardTitle>
              <CardDescription>
                防止把准备视图误认为真实复核流或生产公式。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                {step.boundary}
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </AppShell>
  )
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="break-words text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

function TagCard({
  title,
  values,
  routePrefix,
  emptyText,
}: {
  title: string
  values: string[]
  routePrefix?: string
  emptyText?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) =>
            routePrefix !== undefined ? (
              <Button key={value} asChild size="sm" variant="outline">
                <Link href={routePrefix ? `${routePrefix}/${value}` : value}>
                  {value}
                </Link>
              </Button>
            ) : (
              <Badge key={value} variant="outline">
                {value}
              </Badge>
            )
          )
        ) : (
          <span className="text-sm text-muted-foreground">
            {emptyText ?? "无"}
          </span>
        )}
      </CardContent>
    </Card>
  )
}
