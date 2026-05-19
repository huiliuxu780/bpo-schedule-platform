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
  getProductionMvpGap,
  getRoadmapBatch,
  productionMvpGapStatusLabel,
  productionMvpGaps,
} from "@/lib/production-mvp-gap-roadmap"
import {
  getProductionMvpGovernanceReadinessStepsForGap,
  productionMvpGovernanceReadinessStatusLabel,
} from "@/lib/production-mvp-governance-readiness"

type PageProps = {
  params: Promise<{
    gapId: string
  }>
}

export function generateStaticParams() {
  return productionMvpGaps.map((gap) => ({
    gapId: gap.id,
  }))
}

export default async function ProductionMvpGapPage({ params }: PageProps) {
  const { gapId } = await params
  const gap = getProductionMvpGap(decodeURIComponent(gapId))

  if (!gap) {
    notFound()
  }

  const batch = getRoadmapBatch(gap.proposedBatchId)
  const governanceReadinessSteps =
    getProductionMvpGovernanceReadinessStepsForGap(gap.id)

  return (
    <AppShell title={gap.title} searchPlaceholder="搜索缺口、验收项或边界">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> /{" "}
              <Link href="/production-mvp/gaps">生产缺口</Link> / {gap.id}
            </div>
            <h1 className="text-lg font-semibold">{gap.title}</h1>
            <p className="text-sm text-muted-foreground">
              {gap.businessPurpose}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={gap.priority === "P0" ? "default" : "outline"}>
              {gap.priority}
            </Badge>
            <Badge variant={gap.status === "next" ? "secondary" : "outline"}>
              {productionMvpGapStatusLabel(gap.status)}
            </Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="业务主线" value={gap.lane} />
          <Metric title="风险" value={riskLabel(gap.risk)} />
          <Metric title="验收关联" value={`${gap.acceptanceItemIds.length}`} />
          <Metric title="证据页" value={`${gap.evidenceRoutes.length}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>建议批次</CardTitle>
              <CardDescription>
                {batch
                  ? batch.recommendedReason
                  : "当前缺口尚未绑定推荐批次。"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {batch ? (
                <>
                  <div className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">
                      Batch {batch.sequence}
                    </div>
                    <div className="mt-1 text-sm font-medium">{batch.title}</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {batch.goal}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="outline" className="w-fit">
                    <Link href="/production-mvp/gaps">查看路线图</Link>
                  </Button>
                </>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>边界说明</CardTitle>
              <CardDescription>
                用于防止把本地展示误认为当前批次已经实现生产能力。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
                {gap.boundary}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <TagCard title="关联验收项" values={gap.acceptanceItemIds} routePrefix="/production-mvp/acceptance-checklist" />
          <TagCard title="证据页" values={gap.evidenceRoutes} routePrefix="" />
          <TagCard title="暂缓能力" values={gap.deferredCapabilities} />
        </section>

        {governanceReadinessSteps.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle>治理边界准备</CardTitle>
                  <CardDescription>
                    这些准备步骤说明该缺口进入生产治理前还需要哪些独立 Gate。
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/production-mvp/governance-readiness">
                    查看准备总览
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-2">
              {governanceReadinessSteps.map((step) => (
                <div key={step.id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Step {step.sequence} · {step.lane}
                      </div>
                      <div className="mt-1 text-sm font-medium">
                        {step.title}
                      </div>
                    </div>
                    <Badge
                      variant={
                        step.status === "ready_to_plan"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {productionMvpGovernanceReadinessStatusLabel(step.status)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.goal}
                  </p>
                  <Button asChild className="mt-3" size="sm" variant="outline">
                    <Link href={`/production-mvp/governance-readiness/${step.id}`}>
                      查看步骤
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}
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
}: {
  title: string
  values: string[]
  routePrefix?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {values.map((value) =>
          routePrefix !== undefined ? (
            <Button key={value} asChild size="sm" variant="outline">
              <Link href={routePrefix ? `${routePrefix}/${value}` : value}>
                {value}
              </Link>
            </Button>
          ) : (
            <Badge key={value} variant="secondary">
              {value}
            </Badge>
          )
        )}
      </CardContent>
    </Card>
  )
}

function riskLabel(risk: string) {
  return {
    high: "高",
    medium: "中",
    low: "低",
  }[risk] ?? risk
}
