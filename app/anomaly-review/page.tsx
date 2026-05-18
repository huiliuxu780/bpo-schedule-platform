import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  anomalyReviewStatusLabel,
  anomalySeverityLabel,
  fallbackAnomalyReviewCases,
  summarizeAnomalyReviewCases,
  type AnomalyReviewCase,
  type AnomalyReviewSource,
} from "@/lib/anomaly-review"

const sourceLabels: Record<AnomalyReviewSource, string> = {
  forecast_schedule: "预测 vs 排班",
  schedule_login: "排班 vs 登录",
  schedule_status: "排班 vs 状态",
  master_data: "主数据",
  data_quality: "数据质量",
}

export default function AnomalyReviewPage() {
  const rows = fallbackAnomalyReviewCases
  const summary = summarizeAnomalyReviewCases(rows)
  const pendingRows = rows.filter((row) => row.status === "pending")

  return (
    <AppShell title="异常复核" searchPlaceholder="搜索异常、归因或负责人">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">异常复核</h1>
            <p className="text-sm text-muted-foreground">
              本地只读入口，用于查看生产雏形第一阶段异常、归因、负责人和复核口径。
            </p>
          </div>
          <Badge variant="outline">只读演示</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard title="异常总数" value={`${summary.total}`} description="本地样例口径" />
          <SummaryCard title="待复核" value={`${summary.pending}`} description="需要人工确认" />
          <SummaryCard title="高严重度" value={`${summary.highSeverity}`} description="优先处理池" />
          <SummaryCard
            title="影响工时"
            value={`${summary.impactedHours.toFixed(1)}h`}
            description={`${summary.impactedAgents} 人次受影响`}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>异常来源分布</CardTitle>
              <CardDescription>
                对应 PRD 中预测、排班、登录、状态、主数据和数据质量口径。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {Object.entries(summary.sourceCounts).map(([source, count]) => (
                <div
                  key={source}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {sourceLabels[source as AnomalyReviewSource]}
                    </div>
                    <div className="mt-1 truncate text-xs text-muted-foreground">
                      {source}
                    </div>
                  </div>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>暂不实现动作</CardTitle>
              <CardDescription>
                本批只提供复核视图，不产生处理流、权限边界或生产计算结果。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BadgeList values={summary.deferredActions} />
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>待复核优先项</CardTitle>
                <CardDescription>
                  先暴露异常解释和建议，不实现提交、批量处理或审批。
                </CardDescription>
              </div>
              <Badge variant="secondary">{pendingRows.length} 条</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 lg:grid-cols-2">
              {pendingRows.map((row) => (
                <AnomalyReviewCard key={row.id} row={row} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>异常复核清单</CardTitle>
            <CardDescription>
              覆盖第一阶段异常类型、复核状态、归因、负责人和影响范围。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>异常</TableHead>
                  <TableHead>来源</TableHead>
                  <TableHead>严重度</TableHead>
                  <TableHead>复核状态</TableHead>
                  <TableHead>归因</TableHead>
                  <TableHead>负责人</TableHead>
                  <TableHead>影响</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex min-w-48 flex-col gap-1">
                        <span className="font-medium">{row.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {row.id} / {row.code}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{sourceLabels[row.source]}</TableCell>
                    <TableCell>{anomalySeverityLabel(row.severity)}</TableCell>
                    <TableCell>{anomalyReviewStatusLabel(row.status)}</TableCell>
                    <TableCell>{row.rootCause}</TableCell>
                    <TableCell>{row.owner}</TableCell>
                    <TableCell>
                      {row.impactedAgents} 人 / {row.impactedHours.toFixed(1)}h
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function SummaryCard({
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

function AnomalyReviewCard({ row }: { row: AnomalyReviewCase }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{row.title}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {row.businessDate} / {row.workplace} / {row.interval}
          </div>
        </div>
        <Badge variant="outline">{row.owner}</Badge>
      </div>
      <Separator className="my-3" />
      <div className="grid gap-3 sm:grid-cols-3">
        <MiniMetric label="异常码" value={row.code} />
        <MiniMetric label="归因" value={row.rootCause} />
        <MiniMetric
          label="影响"
          value={`${row.impactedAgents} 人 / ${row.impactedHours.toFixed(1)}h`}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{row.recommendation}</p>
    </div>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  )
}

function BadgeList({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <Badge key={value} variant="outline" className="max-w-full break-all">
          {value}
        </Badge>
      ))}
    </div>
  )
}
