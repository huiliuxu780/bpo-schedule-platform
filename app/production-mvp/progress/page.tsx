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
import { productionMvpAcceptanceItems } from "@/lib/production-mvp-acceptance"
import {
  productionMvpProgressAreas,
  summarizeProductionMvpProgress,
} from "@/lib/production-mvp-progress"

export default function ProductionMvpProgressPage() {
  const areas = productionMvpProgressAreas
  const summary = summarizeProductionMvpProgress(
    areas,
    productionMvpAcceptanceItems
  )

  return (
    <AppShell title="总进度" searchPlaceholder="搜索生产雏形入口或缺口">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/production-mvp">生产雏形</Link> / 总进度
            </div>
            <h1 className="text-lg font-semibold">生产雏形总进度</h1>
            <p className="text-sm text-muted-foreground">
              集中查看本地已完成入口、验收覆盖状态和仍缺的生产能力。这里仍是只读验收视图，不代表真实生产能力已上线。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/gaps">生产缺口</Link>
            </Button>
            <Badge variant="outline">本地进度视图</Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-5">
          <Metric title="进度域" value={`${summary.areaCount}`} description="数据/排班/异常" />
          <Metric title="本地入口" value={`${summary.localRouteCount}`} description="可打开页面" />
          <Metric title="已覆盖项" value={`${summary.coveredItemCount}`} description="验收清单" />
          <Metric title="部分覆盖项" value={`${summary.partialItemCount}`} description="后续开发" />
          <Metric title="生产缺口" value={`${summary.followUpGapCount}`} description="待拆批" />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {areas.map((area) => (
            <Card key={area.id}>
              <CardHeader>
                <CardTitle>{area.title}</CardTitle>
                <CardDescription>
                  {area.coveredItems.length} 个已覆盖项，{area.partialItems.length} 个部分覆盖项。
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="rounded-lg border p-3">
                  <div className="text-xs text-muted-foreground">本地入口</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {area.localRoutes.map((route) => (
                      <Button key={route} asChild size="sm" variant="outline">
                        <Link href={route}>{route}</Link>
                      </Button>
                    ))}
                  </div>
                </div>
                <TagBlock title="已覆盖验收项" values={area.coveredItems} />
                <TagBlock title="部分覆盖验收项" values={area.partialItems} />
                <TagBlock title="后续缺口" values={area.followUpGaps} />
              </CardContent>
            </Card>
          ))}
        </section>

        <Card>
          <CardHeader>
            <CardTitle>总进度边界</CardTitle>
            <CardDescription>
              总进度只汇总本地可验收入口和缺口，不触发真实流程或生产写入。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {[
              "无真实上传",
              "无数据库",
              "无审批",
              "无权限",
              "无导出",
              "无批量处理",
              "无生产公式",
            ].map((item) => (
              <Badge key={item} variant="secondary">
                {item}
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

function TagBlock({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.length > 0 ? (
          values.map((value) => (
            <Badge key={value} variant="outline">
              {value}
            </Badge>
          ))
        ) : (
          <span className="text-sm text-muted-foreground">无</span>
        )}
      </div>
    </div>
  )
}
