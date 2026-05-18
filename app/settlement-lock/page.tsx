import { AppShell } from "@/components/app-shell"
import {
  buildSettlementLockTableRows,
  settlementLockPreviewItems,
  summarizeSettlementLockRecords,
} from "@/components/data-table-model"
import { ImportedRecordsSummary } from "@/components/imported-records-summary"
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
import { getDemoImportRecords } from "@/lib/demo-imports"

export default async function SettlementLockPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeSettlementLockRecords(records)
  const rows = buildSettlementLockTableRows(settlementLockPreviewItems)

  return (
    <AppShell title="结算锁账" searchPlaceholder="搜索锁账能力、数据源或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">结算锁账</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示本机只读锁账 readiness 和后续 Gate 边界，不执行锁账或结算计算。
            </p>
          </div>
          <Badge variant="outline">本机只读</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="结算锁账 records"
            value={`${summary.importedRows}`}
            description={`${summary.sourceCount} 类本机来源`}
          />
          <MetricCard
            title="本机只读项"
            value={`${summary.readonlyItems}`}
            description="复盘输入覆盖"
          />
          <MetricCard
            title="需后续 Gate"
            value={`${summary.deferredItems}`}
            description="锁账、公式、账单"
          />
          <MetricCard
            title="最近批次"
            value={summary.latestBatch}
            description={summary.latestSource}
            compact
          />
        </section>

        <ImportedRecordsSummary
          records={records}
          title="结算锁账 records"
          description="从本机 processed records 读取锁账 readiness 的来源覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>本机锁账 readiness</CardTitle>
            <CardDescription>
              当前只读展示锁账前置输入覆盖，生产锁账能力统一进入后续 Gate。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>能力</TableHead>
                    <TableHead>说明</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.item}>
                      <TableCell className="font-medium">{row.item}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.statusLabel === "本机只读"
                              ? "outline"
                              : "secondary"
                          }
                        >
                          {row.statusLabel}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <BoundaryCard
          title="结算锁账边界"
          description="当前只证明结算锁账入口已开放并能解释演示范围。"
          lines={[
            "不执行锁账，不冻结账期。",
            "不计算结算金额、结算公式、收费因子或账单。",
            "不做审批、导出、批量、数据库或真实接口写回。",
          ]}
        />
      </main>
    </AppShell>
  )
}

function MetricCard({
  title,
  value,
  description,
  compact = false,
}: {
  title: string
  value: string
  description: string
  compact?: boolean
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle
          className={
            compact
              ? "break-all text-sm font-semibold leading-5"
              : "text-2xl font-semibold tabular-nums"
          }
        >
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}

function BoundaryCard({
  title,
  description,
  lines,
}: {
  title: string
  description: string
  lines: string[]
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-muted-foreground">
        {lines.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </CardContent>
    </Card>
  )
}
