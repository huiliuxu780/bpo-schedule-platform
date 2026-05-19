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
