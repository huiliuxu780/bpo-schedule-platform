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
  getNextDataFoundationStep,
  productionMvpDataFoundationStatusLabel,
  productionMvpDataFoundationSteps,
  summarizeProductionMvpDataFoundation,
} from "@/lib/production-mvp-data-foundation"

export default function ProductionMvpDataFoundationPage() {
  const summary = summarizeProductionMvpDataFoundation(
    productionMvpDataFoundationSteps
  )
  const nextStep = getNextDataFoundationStep()

  return (
    <AppShell title="数据底座准备" searchPlaceholder="搜索准备步骤、输入或边界">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> / 数据底座准备
            </div>
            <h1 className="text-lg font-semibold">数据导入与主数据闭环准备</h1>
            <p className="text-sm text-muted-foreground">
              把路线图推荐的第一批拆成可验收准备步骤：导入执行、字段映射、主数据维护、绑定关系冻结解冻和数据质量追溯。当前仍是本地只读准备视图，不执行真实上传、导入、CRUD、冻结解冻或写库。
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
          <Metric title="准备步骤" value={`${summary.stepCount}`} description="第一批数据底座" />
          <Metric title="可计划" value={`${summary.readyToPlanCount}`} description="仍不实现生产能力" />
          <Metric title="需 Gate" value={`${summary.requiresGateCount}`} description="冻结/审计/修复" />
          <Metric title="验收主线" value={`${summary.acceptanceItemCount}`} description="上传与主数据" />
          <Metric title="暂缓能力" value={`${summary.deferredCapabilities.length}`} description="后续独立 Gate" />
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>推荐起点</CardTitle>
                <CardDescription>
                  先确认真实导入前需要哪些模板、字段映射、批次追溯键和失败行修复口径。
                </CardDescription>
              </div>
              <Badge variant="secondary">{nextStep.title}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{nextStep.goal}</p>
            <Button asChild size="sm" variant="outline" className="w-fit">
              <Link href={`/production-mvp/data-foundation/${nextStep.id}`}>
                查看起点
              </Link>
            </Button>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          {productionMvpDataFoundationSteps.map((step) => (
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
                    {productionMvpDataFoundationStatusLabel(step.status)}
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
                  <Link href={`/production-mvp/data-foundation/${step.id}`}>
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
              数据底座准备页只承接路线图，不改变系统能力边界。
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
