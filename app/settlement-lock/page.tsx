import { AppShell } from "@/components/app-shell"
import {
  buildSettlementLockTableRows,
  settlementLockPreviewItems,
  summarizeSettlementLockRecords,
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
import { getDemoImportRecords } from "@/lib/demo-imports"

export default async function SettlementLockPage() {
  const records = await getDemoImportRecords()
  const summary = summarizeSettlementLockRecords(records)
  const rows = buildSettlementLockTableRows(settlementLockPreviewItems)

  return (
    <AppShell title="结算锁账" searchPlaceholder="搜索锁账能力或状态">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">结算锁账</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              查看月度结算锁定相关能力状态，区分复盘输入、锁账动作和账单流程。
            </p>
          </div>
          <Badge variant="outline">功能状态</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="能力项"
            value={`${summary.readonlyItems + summary.deferredItems}`}
            description="锁账模块范围"
          />
          <MetricCard
            title="已开放"
            value={`${summary.readonlyItems}`}
            description="复盘输入查看"
          />
          <MetricCard
            title="开发中"
            value={`${summary.deferredItems}`}
            description="锁账、公式、账单"
          />
          <MetricCard
            title="关联数据"
            value={`${summary.sourceCount}`}
            description="复盘与履约上下文"
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>锁账能力清单</CardTitle>
            <CardDescription>
              展示结算锁账模块能力状态；锁账动作、公式、账单和审批仍标记开发中。
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
                            row.statusLabel === "已开放"
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
        <CardTitle
          className="text-2xl font-semibold tabular-nums"
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
