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
  productionMvpAcceptanceItems,
  productionMvpAcceptanceStatusLabel,
  summarizeProductionMvpAcceptance,
} from "@/lib/production-mvp-acceptance"

export default function ProductionMvpAcceptanceChecklistPage() {
  const items = productionMvpAcceptanceItems
  const summary = summarizeProductionMvpAcceptance(items)

  return (
    <AppShell title="验收清单" searchPlaceholder="搜索业务主线、验收口径或证据页">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> / 验收清单
            </div>
            <h1 className="text-lg font-semibold">生产雏形验收清单</h1>
            <p className="text-sm text-muted-foreground">
              按第一阶段业务主线检查是否达到可导入、可查看、可对比、可定位异常；暂缓能力只列入口径，不在本批实现。
            </p>
          </div>
          <Badge variant="outline">本地验收口径</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="业务主线" value={`${summary.total}`} description="第一阶段范围" />
          <Metric title="已覆盖" value={`${summary.covered}`} description="可直接验收" />
          <Metric title="部分覆盖" value={`${summary.partial}`} description="后续需开发" />
          <Metric title="证据页" value={`${summary.evidenceRouteCount}`} description="本地路由" />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardDescription>{item.lane}</CardDescription>
                    <CardTitle>{item.title}</CardTitle>
                  </div>
                  <Badge variant={item.status === "covered" ? "secondary" : "outline"}>
                    {productionMvpAcceptanceStatusLabel(item.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">{item.purpose}</p>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">验收口径</div>
                  <ul className="mt-2 grid gap-2 text-sm">
                    {item.acceptance.map((acceptance) => (
                      <li key={acceptance}>{acceptance}</li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">证据页</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.evidenceRoutes.map((route) => (
                      <Button key={route} asChild size="sm" variant="outline">
                        <Link href={route}>{route}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.deferredCapabilities.map((capability) => (
                    <Badge key={capability} variant="outline">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>暂缓生产能力</CardTitle>
            <CardDescription>
              这些能力可以进入生产雏形 PRD，但需要后续单独 Gate，不属于本批实现。
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
