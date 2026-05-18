import { heatmapRows, heatmapSlots } from "@/app/dashboard/data"
import { AppShell } from "@/components/app-shell"
import { BpoHeatmap } from "@/components/bpo-heatmap"
import {
  buildDeficitHeatmapTableRows,
  summarizeHeatmapRows,
} from "@/components/data-table-model"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function DeficitHeatmapPage() {
  const summary = summarizeHeatmapRows(heatmapRows, heatmapSlots)
  const severeSlots = buildDeficitHeatmapTableRows(heatmapRows, heatmapSlots)

  return (
    <AppShell title="时段缺口热力图" searchPlaceholder="搜索职场、日期或时段">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">时段缺口热力图</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              复用 dashboard 本机 seed 缺口热力图，展示时段缺口分布和严重时段。
            </p>
          </div>
          <Badge variant="outline">本机热力图预览</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="时段缺口 records"
            value={`${summary.totalDeficit}`}
            description="缺口人次合计"
          />
          <MetricCard
            title="严重时段"
            value={`${summary.severeSlotCount}`}
            description="缺口小于等于 -6"
          />
          <MetricCard
            title="正常时段"
            value={`${summary.normalSlotCount}`}
            description="非负缺口"
          />
          <MetricCard
            title="峰值缺口"
            value={summary.peak ? `${summary.peak.value}` : "0"}
            description={
              summary.peak ? `${summary.peak.day} ${summary.peak.slot}` : "无"
            }
          />
        </section>

        <BpoHeatmap />

        <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>严重时段清单</CardTitle>
              <CardDescription>
                从本机 seed 热力图中筛出，当前不触发自动排班。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>日期</TableHead>
                      <TableHead>时段</TableHead>
                      <TableHead className="text-right">缺口</TableHead>
                      <TableHead>状态</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {severeSlots.length > 0 ? (
                      severeSlots.map((slot) => (
                        <TableRow key={`${slot.day}-${slot.slot}`}>
                          <TableCell>{slot.day}</TableCell>
                          <TableCell>{slot.slot}</TableCell>
                          <TableCell className="text-right tabular-nums">
                            {slot.deficit}
                          </TableCell>
                          <TableCell>
                            <Badge variant="destructive">
                              {slot.statusLabel}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-16 text-center text-muted-foreground"
                        >
                          暂无严重缺口时段。本机 seed 缺口恢复后会在这里展示。
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>缺口热力图边界</CardTitle>
              <CardDescription>
                当前只证明时段缺口页面已经开放。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <p>不接数据库，不接真实预测、排班或 CORN 数据源。</p>
              <p>不执行自动排班、补班派发、审批或批量处理。</p>
              <p>不固化生产缺口公式、结算口径或收费因子。</p>
            </CardContent>
          </Card>
        </section>
      </main>
    </AppShell>
  )
}

function MetricCard({
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
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}
