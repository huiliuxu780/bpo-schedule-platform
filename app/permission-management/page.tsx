import { AppShell } from "@/components/app-shell"
import {
  buildPermissionManagementTableRows,
  permissionManagementPreviewItems,
  summarizePermissionManagementRecords,
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

export default async function PermissionManagementPage() {
  const records = await getDemoImportRecords()
  const summary = summarizePermissionManagementRecords(records)
  const rows = buildPermissionManagementTableRows(permissionManagementPreviewItems)

  return (
    <AppShell title="权限管理" searchPlaceholder="搜索权限能力、数据源或批次">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">权限管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              展示本机只读权限 readiness 和后续 Gate 边界，不做登录、授权或权限判定。
            </p>
          </div>
          <Badge variant="outline">本机只读</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="权限管理 records"
            value={`${summary.importedRows}`}
            description={`${summary.sourceCount} 类本机来源`}
          />
          <MetricCard
            title="本机只读项"
            value={`${summary.readonlyItems}`}
            description="可用于演示说明"
          />
          <MetricCard
            title="需后续 Gate"
            value={`${summary.deferredItems}`}
            description="账号、角色、授权"
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
          title="权限管理 records"
          description="从本机 processed records 读取权限 readiness 的来源覆盖"
        />

        <Card>
          <CardHeader>
            <CardTitle>本机权限 readiness</CardTitle>
            <CardDescription>
              当前只读展示哪些权限相关能力可解释，生产权限能力统一进入后续 Gate。
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
          title="权限管理边界"
          description="当前只证明权限管理入口已开放并能解释演示范围。"
          lines={[
            "不做账号登录、认证、授权或权限判定。",
            "不维护用户、角色或生产权限边界。",
            "不接数据库、真实接口、审批、导出、批量或生产审计存储。",
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
