import Link from "next/link"
import {
  RotateCcw,
  Search,
} from "lucide-react"
import { uploadImportCsvAction } from "@/app/data-quality/actions"
import { MasterDataAgentTable } from "@/components/master-data-agent-table"
import { AgentImportDialog } from "@/components/master-data-agent-import-dialog"
import {
  type MasterDataAgentMaintenanceFeedback,
  type MasterDataAgentDetailSummary,
  type MasterDataAgentManagementSummary,
  type MasterDataEntitySourceContext,
} from "@/components/master-data-maintenance-model"
import { MetricCard as SummaryMetricCard } from "@/components/metric-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ReadOnlyField,
  MasterDataListError,
  AgentFormBlockedState,
  AgentMaintenanceFeedbackCard,
  MetricCard,
} from "./master-data-maintenance-fields"

export function MasterDataAgentManagementPage({
  summary,
  managementSummary,
  error,
  templateError,
  feedback,
  employeeListError,
  importDialogOpen,
  selectedFreezeEmployeeId,
  agentSubmitAction,
}: {
  summary: MasterDataEntitySourceContext
  managementSummary: MasterDataAgentManagementSummary
  error: string | null
  templateError?: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  employeeListError?: string | null
  importDialogOpen?: boolean
  selectedFreezeEmployeeId: string
  agentSubmitAction: (formData: FormData) => Promise<void>
}) {
  const freezeEmployee =
    managementSummary.rows.find(
      (row) => row.employee_id === selectedFreezeEmployeeId
    ) ?? null

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="主数据来源读取失败" error={error} /> : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <AgentManagementFilterPanel summary={managementSummary} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryMetricCard
          title="客服人员"
          value={managementSummary.totalEmployees.toLocaleString("zh-CN")}
          description="筛选后条目"
        />
        <SummaryMetricCard
          title="生效"
          value={managementSummary.activeEmployees.toLocaleString("zh-CN")}
          description="当前可排班人员"
        />
        <SummaryMetricCard
          title="自有员工"
          value={managementSummary.internalEmployees.toLocaleString("zh-CN")}
          description="内部人员"
        />
        <SummaryMetricCard
          title="外包员工"
          value={managementSummary.outsourcedEmployees.toLocaleString("zh-CN")}
          description="供应商人员"
        />
      </section>

      <MasterDataAgentTable
        rows={employeeListError ? [] : managementSummary.rows}
        emptyMessage={
          employeeListError
            ? `人员列表读取失败：${employeeListError}`
            : "暂无符合条件的客服人员"
        }
      />

      {freezeEmployee ? (
        <AgentFreezeDialog
          summary={summary}
          employee={freezeEmployee}
          action={agentSubmitAction}
        />
      ) : null}

      {importDialogOpen ? (
        <AgentImportDialog
          dialog={managementSummary.importDialog}
          templateError={templateError ?? null}
          action={uploadImportCsvAction}
        />
      ) : null}
    </main>
  )
}

function AgentManagementFilterPanel({
  summary,
}: {
  summary: MasterDataAgentManagementSummary
}) {
  return (
    <section className="rounded-xl border bg-card p-4 shadow-xs">
      <form action="/master-data/agents" className="grid gap-4">
        <div className="grid gap-x-12 gap-y-3 lg:grid-cols-3">
          {summary.filterFields.map((field) => (
            <AgentManagementFilterField
              key={field.key}
              field={field}
              value={summary.activeFilters[field.key] ?? ""}
            />
          ))}
        </div>
        <div
          data-action-scope="filter"
          className="flex items-center justify-end gap-2"
        >
          <Button type="submit" size="sm">
            <Search data-icon="inline-start" />
            查询
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href="/master-data/agents">
              <RotateCcw data-icon="inline-start" />
              重置
            </Link>
          </Button>
        </div>
      </form>
    </section>
  )
}

function AgentManagementFilterField({
  field,
  value,
}: {
  field: MasterDataAgentManagementSummary["filterFields"][number]
  value: string
}) {
  return (
    <label className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-3 text-sm">
      <span className="text-right text-foreground">{field.label}:</span>
      {field.type === "input" ? (
        <Input
          name={field.key}
          placeholder={field.placeholder}
          defaultValue={value}
        />
      ) : (
        <Select name={field.key} defaultValue={value || "all"}>
          <SelectTrigger className="h-8 w-full min-w-0 px-2.5 text-sm">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent
            align="start"
            position="popper"
            className="min-w-[var(--radix-select-trigger-width)]"
          >
            <SelectGroup>
              {(field.options ?? []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    </label>
  )
}

export function MasterDataAgentDetailPage({
  detailSummary,
  error,
}: {
  detailSummary: MasterDataAgentDetailSummary
  error: string | null
}) {
  const employee = detailSummary.employee

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="客服人员详情读取失败" error={error} /> : null}

      {employee ? (
        <>
          <section className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="人员类型"
              value={employee.display.employeeTypeLabel}
              detail="当前人员归属"
              tone={employee.employee_type === "internal" ? "ready" : "default"}
            />
            <MetricCard
              label="状态"
              value={employee.display.statusLabel}
              detail="主数据状态"
              tone={employee.status === "active" ? "ready" : "default"}
            />
            <MetricCard
              label="关联服务团队"
              value={detailSummary.totalServiceTeams.toLocaleString("zh-CN")}
              detail="只读核对关系"
              tone={detailSummary.totalServiceTeams > 0 ? "ready" : "default"}
            />
          </section>

          <section className="rounded-lg border bg-background p-4">
            <h2 className="mb-3 text-base font-semibold tracking-normal">人员信息</h2>
            <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
              <ReadOnlyField label="姓名" value={employee.display.publicNameLabel} />
              <ReadOnlyField label="人员 ID" value={employee.employee_id} />
              <ReadOnlyField label="人员类型" value={employee.display.employeeTypeLabel} />
              <ReadOnlyField label="组织" value={employee.display.organizationLabel} />
              <ReadOnlyField label="职场" value={employee.display.workplaceLabel} />
              <ReadOnlyField label="状态" value={employee.display.statusLabel} />
              <ReadOnlyField
                label="有效期"
                value={`${employee.effective_from} 至 ${employee.effective_to}`}
              />
              <ReadOnlyField
                label="来源批次"
                value={employee.display.sourceBatchLabel}
              />
            </div>
          </section>

          <section className="rounded-lg border bg-background p-4">
            <h2 className="mb-3 text-base font-semibold tracking-normal">技能集合</h2>
            <div className="rounded-md border p-4 text-sm">
              {employee.display.skillSummary}
            </div>
          </section>

          <section className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold tracking-normal">关联服务团队</h2>
              <Badge variant="secondary">
                {detailSummary.totalServiceTeams.toLocaleString("zh-CN")} 个
              </Badge>
            </div>
            {detailSummary.serviceTeamRows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>服务团队</TableHead>
                    <TableHead>团队类型</TableHead>
                    <TableHead>归属职场</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>有效期</TableHead>
                    <TableHead>来源批次</TableHead>
                    <TableHead>匹配来源</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailSummary.serviceTeamRows.map((row) => (
                    <TableRow key={row.service_team_id}>
                      <TableCell className="font-medium">
                        {row.display.teamNameLabel}
                      </TableCell>
                      <TableCell>{row.display.teamTypeLabel}</TableCell>
                      <TableCell>{row.display.workplaceLabel}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                          {row.display.statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell>{row.display.effectivePeriodLabel}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.display.sourceBatchLabel}
                      </TableCell>
                      <TableCell>{row.display.matchSourceLabel}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="xs"
                          variant="ghost"
                          className="px-1.5 text-primary hover:text-primary"
                        >
                          <Link href={row.display.detailHref}>查看团队</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <AgentFormBlockedState detail={detailSummary.emptyServiceTeamDetail} />
            )}
          </section>
        </>
      ) : (
        <AgentFormBlockedState detail="未找到该客服人员，请返回列表重新选择。" />
      )}
    </main>
  )
}

function AgentFreezeDialog({
  summary,
  employee,
  action,
}: {
  summary: MasterDataEntitySourceContext
  employee: MasterDataAgentManagementSummary["rows"][number]
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>冻结客服人员</DialogTitle>
          <DialogDescription>
            冻结后该人员会进入冻结状态。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 text-sm text-muted-foreground">
          <p>
            确认冻结{" "}
            <span className="font-medium text-foreground">
              {employee.employee_name}
            </span>
            ？
          </p>
          <p className="font-mono text-xs">{employee.employee_id}</p>
        </div>
        {summary.agentSubmitSourceBatchId ? (
          <form action={action}>
            <input type="hidden" name="action" value="freeze" />
            <input
              type="hidden"
              name="source_batch_id"
              value={summary.agentSubmitSourceBatchId}
            />
            <input
              type="hidden"
              name="employee_id"
              value={employee.employee_id}
            />
            <DialogFooter data-action-scope="danger">
              <Button asChild size="sm" variant="outline">
                <Link href="/master-data/agents">取消</Link>
              </Button>
              <Button type="submit" size="sm" variant="destructive">
                确认冻结
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter data-action-scope="danger">
            <Button asChild size="sm" variant="outline">
              <Link href="/master-data/agents">关闭</Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
