import { Upload } from "lucide-react"

import { importDemoCsvAction } from "@/app/demo-imports/actions"
import { AppShell } from "@/components/app-shell"
import { buildImportedRecordSourceRows } from "@/components/data-table-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  buildDemoImportBatchRows,
  getDemoImportBatches,
  getDemoImportRecords,
  type DemoImportKind,
} from "@/lib/demo-imports"

const importCards: {
  kind: DemoImportKind
  title: string
  description: string
  template: string
}[] = [
  {
    kind: "staff_master",
    title: "坐席主数据",
    description: "员工、团队、职场、供应商、岗位和当前状态。",
    template:
      "staff_id,name,team,site,vendor,role,status\nA001,张敏,华东一组,上海职场,供应商A,客服,在线\nA002,李想,华南二组,苏州职场,供应商B,客服,培训",
  },
  {
    kind: "status_log",
    title: "坐席状态数据",
    description: "按日期和时段导入在线、离线、请假、培训等状态。",
    template:
      "staff_id,date,start_time,end_time,status\nA001,2026-05-11,09:00,12:00,在线\nA002,2026-05-11,10:00,11:00,培训",
  },
  {
    kind: "login_log",
    title: "登录数据",
    description: "计划登录、实际登录、实际登出和在线分钟数。",
    template:
      "staff_id,date,planned_login,actual_login,actual_logout,online_minutes\nA001,2026-05-11,09:00,09:08,17:30,510\nA002,2026-05-11,09:00,09:00,17:00,480",
  },
  {
    kind: "schedule_plan",
    title: "排班数据",
    description: "计划日期、项目、职场、版本、状态和半小时时段。",
    template:
      "plan_id,plan_date,project_name,site_name,version,status,interval_start,interval_end,forecast_agents,scheduled_agents,note\nSP-20260511-SH,2026-05-11,博西客服,上海职场,v1,draft,09:00,09:30,12,10,早高峰补人\nSP-20260511-SH,2026-05-11,博西客服,上海职场,v1,draft,09:30,10:00,14,14,覆盖正常",
  },
]

type PageProps = {
  searchParams: Promise<{
    kind?: string
    batch?: string
    success?: string
    failed?: string
    error?: string
  }>
}

export default async function DemoImportsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const batches = await getDemoImportBatches()
  const records = await getDemoImportRecords()
  const batchRows = buildDemoImportBatchRows(batches)
  const sourceRows = buildImportedRecordSourceRows(records)
  const showResult = params.success || params.failed || params.error

  return (
    <AppShell title="文件导入" searchPlaceholder="搜索导入批次、数据源或状态">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">
              本机演示数据导入
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              用 CSV 导入坐席主数据、状态数据、登录数据和排班数据，只服务 localhost 演示。
            </p>
          </div>
          <Badge variant="outline">不接数据库</Badge>
        </section>

        {showResult ? (
          <Card>
            <CardContent className="flex flex-wrap items-center gap-3 py-4 text-sm">
              <Badge variant={params.failed === "0" ? "default" : "destructive"}>
                最近导入
              </Badge>
              <span>成功 {params.success ?? 0} 行</span>
              <span>失败 {params.failed ?? 0} 行</span>
              {params.batch ? (
                <span className="font-mono text-xs text-muted-foreground">
                  {params.batch}
                </span>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {importCards.map((card) => (
            <Card key={card.kind}>
              <CardHeader>
                <CardTitle className="text-base">{card.title}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <form action={importDemoCsvAction} className="grid gap-3">
                  <input type="hidden" name="kind" value={card.kind} />
                  <label className="grid gap-1 text-sm font-medium">
                    CSV 文件
                    <Input name="csvFile" type="file" accept=".csv,text/csv" />
                  </label>
                  <label className="grid gap-1 text-sm font-medium">
                    或粘贴 CSV
                    <textarea
                      name="csvText"
                      defaultValue={card.template}
                      className="min-h-40 resize-y rounded-md border bg-background px-3 py-2 font-mono text-xs shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                  </label>
                  <Button type="submit" className="justify-self-start">
                    <Upload className="size-4" />
                    导入{card.title}
                  </Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>最近导入批次</CardTitle>
              <CardDescription>
                本机运行期间最近导入的演示数据批次。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>数据源</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead className="text-right">成功</TableHead>
                      <TableHead className="text-right">失败</TableHead>
                      <TableHead>批次</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {batchRows.length > 0 ? (
                      batchRows.map((row) => (
                        <TableRow key={row.batchId}>
                          <TableCell className="font-medium">
                            {row.sourceName}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                row.failedRows === 0 ? "outline" : "destructive"
                              }
                            >
                              {row.statusLabel}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.successRows}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.failedRows}
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate font-mono text-xs text-muted-foreground">
                            {row.batchId}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="h-16 text-center text-muted-foreground"
                        >
                          暂无导入批次。先导入任意一类 CSV，dashboard 的数据接入状态会显示本机批次。
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
              <CardTitle>processed records 来源</CardTitle>
              <CardDescription>
                后端本机运行态已经处理并提供给业务模块读取的数据源。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>数据源</TableHead>
                      <TableHead className="text-right">行数</TableHead>
                      <TableHead className="text-right">样本</TableHead>
                      <TableHead>最新批次</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sourceRows.length > 0 ? (
                      sourceRows.map((row) => (
                        <TableRow key={row.kind}>
                          <TableCell className="font-medium">
                            {row.label}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.totalRows}
                          </TableCell>
                          <TableCell className="text-right tabular-nums">
                            {row.sampleRows}
                          </TableCell>
                          <TableCell className="max-w-[220px] truncate font-mono text-xs text-muted-foreground">
                            {row.latestBatch}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="h-16 text-center text-muted-foreground"
                        >
                          暂无 processed records。导入 CSV 后，本机接口会把处理结果提供给 dashboard 和各模块页面读取。
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </AppShell>
  )
}
