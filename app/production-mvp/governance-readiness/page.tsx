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
  getNextGovernanceReadinessStep,
  productionMvpGovernanceReadinessStatusLabel,
  productionMvpGovernanceReadinessSteps,
  summarizeProductionMvpGovernanceReadiness,
} from "@/lib/production-mvp-governance-readiness"

export default function ProductionMvpGovernanceReadinessPage() {
  const summary = summarizeProductionMvpGovernanceReadiness(
    productionMvpGovernanceReadinessSteps
  )
  const nextStep = getNextGovernanceReadinessStep()

  return (
    <AppShell title="治理边界准备" searchPlaceholder="搜索发布、冻结、权限或审计">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> / 治理边界准备
            </div>
            <h1 className="text-lg font-semibold">发布冻结与权限审计边界准备</h1>
            <p className="text-sm text-muted-foreground">
              承接路线图第三批：先把排班发布态、冻结解冻、权限边界、审计留痕、导出批量暂缓拆成准备步骤。当前仍是本地只读准备视图，不执行真实发布、审批、权限、审计写入、导出或批量。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/gaps">生产缺口</Link>
            </Button>
            <Badge variant="outline">治理准备</Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="准备步骤" value={`${summary.stepCount}`} description="治理边界准备" />
          <Metric title="可计划" value={`${summary.readyToPlanCount}`} description="只读建模" />
          <Metric title="需 Gate" value={`${summary.requiresGateCount}`} description="权限/审计/导出" />
          <Metric title="验收主线" value={`${summary.acceptanceItemCount}`} description="排班/主数据" />
          <Metric title="暂缓能力" value={`${summary.deferredCapabilities.length}`} description="后续独立 Gate" />
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>推荐起点</CardTitle>
                <CardDescription>
                  先定义排班发布态，再处理冻结、权限和审计证据边界。
                </CardDescription>
              </div>
              <Badge variant="secondary">{nextStep.title}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <p className="text-sm text-muted-foreground">{nextStep.goal}</p>
            <Button asChild size="sm" variant="outline" className="w-fit">
              <Link href={`/production-mvp/governance-readiness/${nextStep.id}`}>
                查看起点
              </Link>
            </Button>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          {productionMvpGovernanceReadinessSteps.map((step) => (
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
                    {productionMvpGovernanceReadinessStatusLabel(step.status)}
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
                  <Link href={`/production-mvp/governance-readiness/${step.id}`}>
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
              治理准备页只定义后续拆批线索，不改变审批、权限、审计、导出和批量边界。
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
