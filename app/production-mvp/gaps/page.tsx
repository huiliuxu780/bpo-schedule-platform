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
  getProductionMvpGapsForRoadmapBatch,
  getRecommendedNextRoadmapBatch,
  productionMvpGapStatusLabel,
  productionMvpGaps,
  productionMvpRoadmapBatches,
  summarizeProductionMvpGaps,
} from "@/lib/production-mvp-gap-roadmap"

export default function ProductionMvpGapsPage() {
  const summary = summarizeProductionMvpGaps(productionMvpGaps)
  const nextBatch = getRecommendedNextRoadmapBatch()

  return (
    <AppShell title="生产缺口" searchPlaceholder="搜索缺口、批次或验收项">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> / 生产缺口
            </div>
            <h1 className="text-lg font-semibold">生产雏形缺口路线图</h1>
            <p className="text-sm text-muted-foreground">
              把当前本地验收视图后面的生产缺口按优先级、风险和推荐批次排好序；这里不触发真实上传、数据库、审批、权限、导出或批量操作。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/progress">总进度</Link>
            </Button>
            <Badge variant="outline">路线图只读</Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="缺口总数" value={`${summary.total}`} description="待拆批能力" />
          <Metric title="P0" value={`${summary.priorityCounts.P0}`} description="建议下一批" />
          <Metric title="P1" value={`${summary.priorityCounts.P1}`} description="后续高价值" />
          <Metric title="P2" value={`${summary.priorityCounts.P2}`} description="治理补齐" />
          <Metric title="高风险" value={`${summary.riskCounts.high}`} description="需谨慎 Gate" />
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>推荐下一批</CardTitle>
                <CardDescription>{nextBatch.recommendedReason}</CardDescription>
              </div>
              <Badge variant="secondary">{nextBatch.title}</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-3">
            {getProductionMvpGapsForRoadmapBatch(nextBatch.id).map((gap) => (
              <GapCard key={gap.id} gap={gap} compact />
            ))}
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          {productionMvpGaps.map((gap) => (
            <GapCard key={gap.id} gap={gap} />
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>后续批次顺序</CardTitle>
            <CardDescription>
              先补数据底座，再补实际日志与预测版本，最后进入发布、复核、导出和治理边界。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-3">
            {productionMvpRoadmapBatches.map((batch) => (
              <div key={batch.id} className="rounded-lg border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      Batch {batch.sequence}
                    </div>
                    <div className="mt-1 text-sm font-medium">{batch.title}</div>
                  </div>
                  <Badge variant="outline">{batch.gapIds.length} 项</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{batch.goal}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {batch.dependsOnBatchIds.length > 0 ? (
                    batch.dependsOnBatchIds.map((dependency) => (
                      <Badge key={dependency} variant="secondary">
                        依赖 {dependency}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary">无前置依赖</Badge>
                  )}
                </div>
              </div>
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

function GapCard({
  gap,
  compact = false,
}: {
  gap: (typeof productionMvpGaps)[number]
  compact?: boolean
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardDescription>{gap.lane}</CardDescription>
            <CardTitle className="text-base">{gap.title}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant={gap.priority === "P0" ? "default" : "outline"}>
              {gap.priority}
            </Badge>
            <Badge variant={gap.status === "next" ? "secondary" : "outline"}>
              {productionMvpGapStatusLabel(gap.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">{gap.businessPurpose}</p>
        {!compact ? (
          <div className="flex flex-wrap gap-2">
            {gap.acceptanceItemIds.map((itemId) => (
              <Button key={itemId} asChild size="sm" variant="outline">
                <Link href={`/production-mvp/acceptance-checklist/${itemId}`}>
                  {itemId}
                </Link>
              </Button>
            ))}
          </div>
        ) : null}
        <Button asChild size="sm" variant="outline" className="w-fit">
          <Link href={`/production-mvp/gaps/${gap.id}`}>查看缺口</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
