import { AppShell } from "@/components/app-shell"
import {
  buildPermissionManagementTableRows,
  permissionManagementPreviewItems,
  summarizePermissionManagementRecords,
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

export default async function PermissionManagementPage() {
  const records = await getDemoImportRecords()
  const summary = summarizePermissionManagementRecords(records)
  const rows = buildPermissionManagementTableRows(permissionManagementPreviewItems)

  return (
    <AppShell title="权限管理" searchPlaceholder="搜索权限能力或状态">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">权限管理</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              查看权限相关能力的开放状态，区分已可查看的管理入口和仍在开发的权限能力。
            </p>
          </div>
          <Badge variant="outline">功能状态</Badge>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            title="能力项"
            value={`${summary.readonlyItems + summary.deferredItems}`}
            description="权限模块范围"
          />
          <MetricCard
            title="已开放"
            value={`${summary.readonlyItems}`}
            description="可查看的管理入口"
          />
          <MetricCard
            title="开发中"
            value={`${summary.deferredItems}`}
            description="账号、角色、授权"
          />
          <MetricCard
            title="关联数据"
            value={`${summary.sourceCount}`}
            description="组织、审计等上下文"
          />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>权限能力清单</CardTitle>
            <CardDescription>
              展示权限模块能力状态；账号、角色和授权策略仍标记开发中。
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
