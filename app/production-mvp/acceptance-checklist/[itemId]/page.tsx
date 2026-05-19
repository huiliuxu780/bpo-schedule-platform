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
  getProductionMvpAcceptanceItem,
  productionMvpAcceptanceItems,
  productionMvpAcceptanceStatusLabel,
} from "@/lib/production-mvp-acceptance"
import {
  getProductionMvpGapsForAcceptanceItem,
  productionMvpGapStatusLabel,
} from "@/lib/production-mvp-gap-roadmap"
import {
  getProductionMvpDataFoundationStepsForAcceptanceItem,
  productionMvpDataFoundationStatusLabel,
} from "@/lib/production-mvp-data-foundation"
import {
  getProductionMvpAlignmentReadinessStepsForAcceptanceItem,
  productionMvpAlignmentReadinessStatusLabel,
} from "@/lib/production-mvp-alignment-readiness"

type PageProps = {
  params: Promise<{
    itemId: string
  }>
}

export function generateStaticParams() {
  return productionMvpAcceptanceItems.map((item) => ({
    itemId: item.id,
  }))
}

export default async function ProductionMvpAcceptanceItemPage({
  params,
}: PageProps) {
  const { itemId } = await params
  const item = getProductionMvpAcceptanceItem(decodeURIComponent(itemId))

  if (!item) {
    notFound()
  }

  const relatedGaps = getProductionMvpGapsForAcceptanceItem(item.id)
  const dataFoundationSteps =
    getProductionMvpDataFoundationStepsForAcceptanceItem(item.id)
  const alignmentReadinessSteps =
    getProductionMvpAlignmentReadinessStepsForAcceptanceItem(item.id)

  return (
    <AppShell title={item.title} searchPlaceholder="搜索验收证据或后续缺口">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> /{" "}
              <Link href="/production-mvp/acceptance-checklist">验收清单</Link> /{" "}
              {item.id}
            </div>
            <h1 className="text-lg font-semibold">{item.title}</h1>
            <p className="text-sm text-muted-foreground">{item.purpose}</p>
          </div>
          <Badge variant={item.status === "covered" ? "secondary" : "outline"}>
            {productionMvpAcceptanceStatusLabel(item.status)}
          </Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="业务主线" value={item.lane} />
          <Metric title="验收项" value={`${item.acceptance.length}`} />
          <Metric title="证据页" value={`${item.evidenceRoutes.length}`} />
          <Metric title="后续缺口" value={`${item.followUpGaps.length}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>验收口径</CardTitle>
              <CardDescription>本地生产雏形第一阶段应该能回答的问题。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              {item.acceptance.map((acceptance) => (
                <div key={acceptance} className="rounded-lg border p-3 text-sm">
                  {acceptance}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>证据页</CardTitle>
              <CardDescription>可直接打开的本地验收入口。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {item.evidenceRoutes.map((route) => (
                <Button key={route} asChild size="sm" variant="outline">
                  <Link href={route}>{route}</Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>后续开发缺口</CardTitle>
              <CardDescription>
                这些是后续可以拆批的能力，不属于本批实现动作。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {item.followUpGaps.map((gap) => (
                <Badge key={gap} variant="secondary">
                  {gap}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>暂缓生产能力</CardTitle>
              <CardDescription>真实生产能力需要后续独立 Gate。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {item.deferredCapabilities.map((capability) => (
                <Badge key={capability} variant="outline">
                  {capability}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>关联生产缺口</CardTitle>
                <CardDescription>
                  这些缺口进入路线图排序，不代表当前批次已经实现。
                </CardDescription>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/production-mvp/gaps">查看路线图</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {relatedGaps.map((gap) => (
              <div key={gap.id} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      {gap.lane}
                    </div>
                    <div className="mt-1 text-sm font-medium">{gap.title}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={gap.priority === "P0" ? "default" : "outline"}>
                      {gap.priority}
                    </Badge>
                    <Badge variant="secondary">
                      {productionMvpGapStatusLabel(gap.status)}
                    </Badge>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {gap.businessPurpose}
                </p>
                <Button asChild className="mt-3" size="sm" variant="outline">
                  <Link href={`/production-mvp/gaps/${gap.id}`}>查看缺口</Link>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {dataFoundationSteps.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle>数据底座准备</CardTitle>
                  <CardDescription>
                    这些准备步骤承接推荐下一批，但当前仍不执行真实生产能力。
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/production-mvp/data-foundation">查看准备总览</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-2">
              {dataFoundationSteps.map((step) => (
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
                      {productionMvpDataFoundationStatusLabel(step.status)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.goal}
                  </p>
                  <Button asChild className="mt-3" size="sm" variant="outline">
                    <Link href={`/production-mvp/data-foundation/${step.id}`}>
                      查看步骤
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        {alignmentReadinessSteps.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle>预测与实际对齐准备</CardTitle>
                  <CardDescription>
                    这些准备步骤承接路线图第二批，当前仍不接真实接口。
                  </CardDescription>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/production-mvp/alignment-readiness">
                    查看准备总览
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-2">
              {alignmentReadinessSteps.map((step) => (
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
                      {productionMvpAlignmentReadinessStatusLabel(step.status)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.goal}
                  </p>
                  <Button asChild className="mt-3" size="sm" variant="outline">
                    <Link href={`/production-mvp/alignment-readiness/${step.id}`}>
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
