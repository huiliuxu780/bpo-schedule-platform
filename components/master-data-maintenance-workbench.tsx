import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings2,
  Upload,
} from "lucide-react"

import {
  type MasterDataAgentMaintenanceFeedback,
  type MasterDataAgentManagementSummary,
  type MasterDataBindingManagementSummary,
  type MasterDataEntityDetailSummary,
  type MasterDataReferenceManagementSummary,
} from "@/components/master-data-maintenance-model"
import { buildImportUploadWorkspaceHref } from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

export function MasterDataAgentManagementPage({
  summary,
  managementSummary,
  error,
  feedback,
  employeeListError,
  selectedFreezeEmployeeId,
  agentSubmitAction,
}: {
  summary: MasterDataEntityDetailSummary
  managementSummary: MasterDataAgentManagementSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  employeeListError?: string | null
  selectedFreezeEmployeeId: string
  agentSubmitAction: (formData: FormData) => Promise<void>
}) {
  const freezeEmployee =
    managementSummary.rows.find(
      (row) => row.employee_id === selectedFreezeEmployeeId
    ) ?? null

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      <section className="flex min-h-9 items-center justify-between gap-3 bg-background px-1">
        <h1 className="text-base font-semibold tracking-normal">
          {managementSummary.title}
        </h1>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href={managementSummary.createHref}>
              <Plus data-icon="inline-start" />
              新建
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link href={buildImportUploadWorkspaceHref({ fileType: "master_data" })}>
              <Upload data-icon="inline-start" />
              导入人员
            </Link>
          </Button>
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              主数据来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <AgentManagementFilterPanel summary={managementSummary} />

      <AgentManagementTablePanel
        summary={managementSummary}
        employeeListError={employeeListError ?? null}
      />

      {freezeEmployee ? (
        <AgentFreezeDialog
          summary={summary}
          employee={freezeEmployee}
          action={agentSubmitAction}
        />
      ) : null}
    </main>
  )
}
export function MasterDataReferenceManagementPage({
  summary,
  listSummary,
  error,
  feedback,
}: {
  summary: MasterDataEntityDetailSummary
  listSummary: MasterDataReferenceManagementSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      <section className="flex min-h-9 items-center justify-between gap-3 bg-background px-1">
        <h1 className="text-base font-semibold tracking-normal">{listSummary.title}</h1>
        <Button asChild size="sm" variant="outline">
          <Link href={buildImportUploadWorkspaceHref({ fileType: "master_data" })}>
            <Upload data-icon="inline-start" />
            导入主数据
          </Link>
        </Button>
      </section>

      {error ? <MasterDataListError title={`${listSummary.title}列表读取失败`} error={error} /> : null}
      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="记录数"
          value={listSummary.totalRecords.toLocaleString("zh-CN")}
          detail={summary.sourceVersionLabel}
          tone="default"
        />
        <MetricCard
          label="生效"
          value={listSummary.activeRecords.toLocaleString("zh-CN")}
          detail="当前可引用记录"
          tone={listSummary.activeRecords > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="冻结"
          value={listSummary.frozenRecords.toLocaleString("zh-CN")}
          detail="不可继续引用记录"
          tone={listSummary.frozenRecords > 0 ? "blocked" : "default"}
        />
      </section>

      <section className="rounded-lg border bg-background p-4">
        {listSummary.rows.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            暂无{listSummary.title}记录。
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>编码</TableHead>
                <TableHead>属性</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>有效期</TableHead>
                <TableHead>来源批次</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listSummary.rows.map((row) => (
                <TableRow key={row.reference_id}>
                  <TableCell className="font-medium">{row.reference_name}</TableCell>
                  <TableCell className="font-mono text-xs">{row.reference_id}</TableCell>
                  <TableCell>{row.display.skillCategoryLabel}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                      {row.display.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.display.effectivePeriodLabel}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.display.sourceBatchLabel}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </main>
  )
}

export function MasterDataBindingManagementPage({
  summary,
  listSummary,
  error,
  feedback,
}: {
  summary: MasterDataEntityDetailSummary
  listSummary: MasterDataBindingManagementSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      <section className="flex min-h-9 items-center justify-between gap-3 bg-background px-1">
        <h1 className="text-base font-semibold tracking-normal">{listSummary.title}</h1>
        <Button asChild size="sm" variant="outline">
          <Link href={buildImportUploadWorkspaceHref({ fileType: "master_data" })}>
            <Upload data-icon="inline-start" />
            导入主数据
          </Link>
        </Button>
      </section>

      {error ? <MasterDataListError title="绑定关系列表读取失败" error={error} /> : null}
      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-3 md:grid-cols-2">
        <MetricCard
          label="绑定数"
          value={listSummary.totalRecords.toLocaleString("zh-CN")}
          detail={summary.sourceVersionLabel}
          tone="default"
        />
        <MetricCard
          label="来源批次"
          value={summary.sourceBatchLabel}
          detail="当前绑定关系来源"
          tone="default"
        />
      </section>

      <section className="rounded-lg border bg-background p-4">
        {listSummary.rows.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            暂无绑定关系记录。
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>绑定ID</TableHead>
                <TableHead>人员</TableHead>
                <TableHead>供应商</TableHead>
                <TableHead>职场</TableHead>
                <TableHead>项目</TableHead>
                <TableHead>技能</TableHead>
                <TableHead>有效期</TableHead>
                <TableHead>来源批次</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listSummary.rows.map((row) => (
                <TableRow key={row.binding_id}>
                  <TableCell className="font-mono text-xs">{row.binding_id}</TableCell>
                  <TableCell>{row.employee_id}</TableCell>
                  <TableCell>{row.supplier_id}</TableCell>
                  <TableCell>{row.workplace_id}</TableCell>
                  <TableCell>{row.project_id}</TableCell>
                  <TableCell>{row.skill_id}</TableCell>
                  <TableCell>{row.display.effectivePeriodLabel}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.display.sourceBatchLabel}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </main>
  )
}

function MasterDataListError({
  title,
  error,
}: {
  title: string
  error: string
}) {
  return (
    <Card className="border-destructive/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="size-4 text-destructive" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
    </Card>
  )
}

function AgentManagementFilterPanel({
  summary,
}: {
  summary: MasterDataAgentManagementSummary
}) {
  return (
    <section className="rounded-lg border bg-background p-4">
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
        <div className="flex items-center gap-2 pl-0 lg:pl-[6.5rem]">
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

function AgentManagementTablePanel({
  summary,
  employeeListError,
}: {
  summary: MasterDataAgentManagementSummary
  employeeListError: string | null
}) {
  return (
    <section className="rounded-lg border bg-background p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">已选 0 项</span>
        {summary.bulkActions.map((action) => (
          <Button key={action.key} size="sm" variant="outline" disabled>
            {action.label}
          </Button>
        ))}
      </div>

      {employeeListError ? (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          人员列表读取失败：{employeeListError}
        </div>
      ) : summary.rows.length === 0 ? (
        <div className="rounded-md border p-4 text-sm text-muted-foreground">
          暂无符合条件的客服人员。
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox disabled aria-label="选择全部客服人员" />
              </TableHead>
              {summary.tableColumns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.key === "actions" ? "text-right" : undefined}
                >
                  <span className="inline-flex items-center gap-2">
                    {column.label}
                    {column.key === "actions" ? <Settings2 /> : null}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {summary.rows.map((row) => (
              <TableRow key={row.employee_id}>
                <TableCell className="w-10">
                  <Checkbox disabled aria-label={`选择${row.employee_name}`} />
                </TableCell>
                <TableCell className="font-medium">{row.employee_name}</TableCell>
                <TableCell>{row.display.accountLabel}</TableCell>
                <TableCell>{row.display.jobNumberLabel}</TableCell>
                <TableCell>{row.display.publicNameLabel}</TableCell>
                <TableCell className="max-w-[13rem] truncate">
                  {row.display.organizationLabel}
                </TableCell>
                <TableCell className="max-w-[14rem] truncate">
                  {row.display.skillSummary}
                </TableCell>
                <TableCell>{row.display.levelLabel}</TableCell>
                <TableCell>
                  <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                    {row.display.statusLabel}
                  </Badge>
                </TableCell>
                <TableCell>{row.display.freezeReasonLabel}</TableCell>
                <TableCell>{row.employee_id}</TableCell>
                <TableCell className="whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1">
                    <AgentRowActionLink href={row.display.editHref}>
                      编辑
                    </AgentRowActionLink>
                    <AgentRowActionLink href={row.display.freezeHref}>
                      冻结
                    </AgentRowActionLink>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon-xs" variant="ghost" aria-label="更多操作">
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuItem asChild>
                            <Link
                              href={row.display.skillsEditHref}
                            >
                              技能维护
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}

function AgentRowActionLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Button
      asChild
      size="xs"
      variant="ghost"
      className="px-1.5 text-primary hover:text-primary"
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}

function AgentFreezeDialog({
  summary,
  employee,
  action,
}: {
  summary: MasterDataEntityDetailSummary
  employee: MasterDataAgentManagementSummary["rows"][number]
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="agent-freeze-title"
    >
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle id="agent-freeze-title" className="text-base">
            冻结客服人员
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-1 text-sm text-muted-foreground">
            <p>
              确认冻结{" "}
              <span className="font-medium text-foreground">
                {employee.employee_name}
              </span>
              ？
            </p>
            <p className="font-mono text-xs">{employee.employee_id}</p>
            <p>冻结后该人员状态会通过单人维护 服务 更新为 frozen。</p>
          </div>
          {summary.agentSubmitSourceBatchId ? (
            <form action={action} className="flex justify-end gap-2">
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
              <Button asChild size="sm" variant="outline">
                <Link href="/master-data/agents">取消</Link>
              </Button>
              <Button type="submit" size="sm" variant="destructive">
                确认冻结
              </Button>
            </form>
          ) : (
            <div className="flex justify-end gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href="/master-data/agents">关闭</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function MasterDataAgentCreatePage({
  summary,
  error,
  feedback,
  action,
}: {
  summary: MasterDataEntityDetailSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
      <AgentFormPageShell
      title="新建客服人员"
      description="创建单个客服人员基础档案。人员表导入从客服人员列表进入。"
      error={error}
      feedback={feedback}
    >
      {summary.agentSubmitSourceBatchId ? (
        <AgentMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.agentSubmitSourceBatchId}
          title="人员信息"
          description="填写人员账号、姓名、状态、人员类型、组织、职场和有效期。"
          submitLabel="提交新增"
          fields={[
            "employee_id",
            "employee_name",
            "status",
            "employee_type",
            "organization_id",
            "workplace_id",
            "effective_from",
            "effective_to",
          ]}
        />
      ) : (
        <AgentFormBlockedState />
      )}
    </AgentFormPageShell>
  )
}

export function MasterDataAgentEditPage({
  summary,
  error,
  feedback,
  employee,
  action,
}: {
  summary: MasterDataEntityDetailSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  employee: MasterDataAgentManagementSummary["rows"][number] | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <AgentFormPageShell
      title="编辑客服人员"
      description="修改单个客服人员的基础字段。技能集合单独进入技能维护页。"
      error={error}
      feedback={feedback}
    >
      {summary.agentSubmitSourceBatchId && employee ? (
        <AgentMaintenanceForm
          action={action}
          actionKey="edit"
          sourceBatchId={summary.agentSubmitSourceBatchId}
          title="人员信息"
          description="未填写的字段由后端保留原值。"
          submitLabel="提交编辑"
          fields={[
            "employee_id",
            "employee_name",
            "status",
            "employee_type",
            "organization_id",
            "workplace_id",
          ]}
          defaultValues={{
            employee_id: employee.employee_id,
            employee_name: employee.employee_name,
            status: employee.status,
            employee_type: employee.employee_type,
            organization_id: employee.organization_id ?? "",
            workplace_id: employee.workplace_id ?? "",
          }}
        />
      ) : (
        <AgentFormBlockedState
          detail={
            employee
              ? "当前来源批次不满足单人维护提交条件。"
              : "未找到该客服人员，请返回列表重新选择。"
          }
        />
      )}
    </AgentFormPageShell>
  )
}

export function MasterDataAgentSkillsEditPage({
  summary,
  error,
  feedback,
  employee,
  action,
}: {
  summary: MasterDataEntityDetailSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  employee: MasterDataAgentManagementSummary["rows"][number] | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <AgentFormPageShell
      title="维护客服技能组"
      description="替换单个客服人员当前技能集合。"
      error={error}
      feedback={feedback}
    >
      {summary.agentSubmitSourceBatchId && employee ? (
        <AgentSkillMaintenanceSection
          summary={summary}
          action={action}
          selectedEmployeeId={employee.employee_id}
        />
      ) : (
        <AgentFormBlockedState
          detail={
            employee
              ? "当前来源批次不满足单人技能维护提交条件。"
              : "未找到该客服人员，请返回列表重新选择。"
          }
        />
      )}
    </AgentFormPageShell>
  )
}

function AgentFormPageShell({
  title,
  description,
  error,
  feedback,
  children,
}: {
  title: string
  description: string
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  children: React.ReactNode
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      <section className="flex flex-col gap-3 rounded-lg border bg-background p-4">
        <Button asChild size="sm" variant="ghost" className="w-fit px-0">
          <Link href="/master-data/agents">
            <ArrowLeft data-icon="inline-start" />
            返回客服人员
          </Link>
        </Button>
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold tracking-normal">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              主数据来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-4">{children}</section>
    </main>
  )
}

function AgentFormBlockedState({
  detail = "当前来源批次不满足单人维护提交条件。",
}: {
  detail?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">当前不可维护</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{detail}</CardContent>
    </Card>
  )
}

function AgentMaintenanceFeedbackCard({
  feedback,
}: {
  feedback: MasterDataAgentMaintenanceFeedback
}) {
  const isError = feedback.tone === "error"

  return (
    <Card className={isError ? "border-destructive/50" : ""}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {isError ? (
            <AlertTriangle className="size-4 text-destructive" />
          ) : (
            <CheckCircle2 className="size-4 text-muted-foreground" />
          )}
          {feedback.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {feedback.detail}
      </CardContent>
    </Card>
  )
}

function AgentSkillMaintenanceSection({
  summary,
  action,
  selectedEmployeeId = "",
}: {
  summary: MasterDataEntityDetailSummary
  action: (formData: FormData) => Promise<void>
  selectedEmployeeId?: string
}) {
  if (!summary.agentSubmitSourceBatchId) {
    return null
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-normal">
          坐席技能维护
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          覆盖单个坐席当前技能集合。来源批次{" "}
          <span className="font-mono text-foreground">
            {summary.agentSubmitSourceBatchId}
          </span>
          。
        </p>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">维护坐席技能</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="grid gap-3">
            <input
              type="hidden"
              name="source_batch_id"
              value={summary.agentSubmitSourceBatchId}
            />
            <p className="text-sm text-muted-foreground">
              多个技能 ID 用逗号或换行分隔，提交后替换该坐席当前技能全集。
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <MaintenanceInput
                label="坐席 ID"
                name="employee_id"
                placeholder="A-1001"
                defaultValue={selectedEmployeeId}
                required
              />
              <MaintenanceTextarea
                label="技能 ID 列表"
                name="skill_ids"
                placeholder="SKILL-RETURN-TICKET, SKILL-GENERAL"
                required
              />
              <MaintenanceInput
                label="生效开始"
                name="effective_from"
                type="date"
                required
              />
              <MaintenanceInput
                label="生效结束"
                name="effective_to"
                type="date"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm">
                <Send data-icon="inline-start" />
                提交技能维护
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}

type AgentMaintenanceField =
  | "employee_id"
  | "employee_name"
  | "reference_id"
  | "reference_name"
  | "binding_id"
  | "supplier_id"
  | "workplace_id"
  | "project_id"
  | "skill_id"
  | "status"
  | "employee_type"
  | "organization_id"
  | "effective_from"
  | "effective_to"

function AgentMaintenanceForm({
  action,
  actionKey,
  sourceBatchId,
  title,
  description,
  submitLabel,
  fields,
  hiddenFields = {},
  defaultValues = {},
}: {
  action: (formData: FormData) => Promise<void>
  actionKey: "create" | "edit" | "freeze" | "effective_period"
  sourceBatchId: string
  title: string
  description: string
  submitLabel: string
  fields: AgentMaintenanceField[]
  hiddenFields?: Record<string, string>
  defaultValues?: Partial<Record<AgentMaintenanceField, string>>
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3">
          <input type="hidden" name="action" value={actionKey} />
          <input type="hidden" name="source_batch_id" value={sourceBatchId} />
          {Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {fields.includes("binding_id") ? (
              <MaintenanceInput
                label="绑定关系 ID"
                name="binding_id"
                placeholder="BIND-1001"
                defaultValue={defaultValues.binding_id}
                required
              />
            ) : null}
            {fields.includes("employee_id") ? (
              <MaintenanceInput
                label="坐席 ID"
                name="employee_id"
                placeholder="A-1001"
                defaultValue={defaultValues.employee_id}
                required
              />
            ) : null}
            {fields.includes("employee_name") ? (
              <MaintenanceInput
                label="坐席姓名"
                name="employee_name"
                placeholder="输入坐席姓名"
                defaultValue={defaultValues.employee_name}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("reference_id") ? (
              <MaintenanceInput
                label={`${title.replace(/^新增|^编辑|^冻结/, "")} ID`}
                name="reference_id"
                placeholder="OBJ-1001"
                defaultValue={defaultValues.reference_id}
                required
              />
            ) : null}
            {fields.includes("reference_name") ? (
              <MaintenanceInput
                label="对象名称"
                name="reference_name"
                placeholder="输入对象名称"
                defaultValue={defaultValues.reference_name}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("supplier_id") ? (
              <MaintenanceInput
                label="供应商 ID"
                name="supplier_id"
                placeholder="SUP-001"
                defaultValue={defaultValues.supplier_id}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("workplace_id") ? (
              <MaintenanceInput
                label="职场 ID"
                name="workplace_id"
                placeholder="SITE-001"
                defaultValue={defaultValues.workplace_id}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("project_id") ? (
              <MaintenanceInput
                label="项目 ID"
                name="project_id"
                placeholder="PROJ-001"
                defaultValue={defaultValues.project_id}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("skill_id") ? (
              <MaintenanceInput
                label="技能 ID"
                name="skill_id"
                placeholder="SKILL-001"
                defaultValue={defaultValues.skill_id}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("status") ? (
              <MaintenanceSelect
                label="状态"
                name="status"
                defaultValue={defaultValues.status}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("employee_type") ? (
              <EmployeeTypeSelect
                label="人员类型"
                name="employee_type"
                defaultValue={defaultValues.employee_type}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("organization_id") ? (
              <MaintenanceInput
                label="组织 ID"
                name="organization_id"
                placeholder="ORG-RETURN"
                defaultValue={defaultValues.organization_id}
                required={false}
              />
            ) : null}
            {fields.includes("effective_from") ? (
              <MaintenanceInput
                label="生效开始"
                name="effective_from"
                type="date"
                defaultValue={defaultValues.effective_from}
                required={actionKey !== "edit"}
              />
            ) : null}
            {fields.includes("effective_to") ? (
              <MaintenanceInput
                label="生效结束"
                name="effective_to"
                type="date"
                defaultValue={defaultValues.effective_to}
                required={actionKey !== "edit"}
              />
            ) : null}
          </div>
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              <Send data-icon="inline-start" />
              {submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function MaintenanceInput({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  required = false,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        required={required}
      />
    </label>
  )
}

function MaintenanceTextarea({
  label,
  name,
  placeholder,
  required = false,
}: {
  label: string
  name: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium md:col-span-2">
      {label}
      <textarea
        name={name}
        placeholder={placeholder}
        required={required}
        rows={3}
        className="min-h-20 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
    </label>
  )
}

function MaintenanceSelect({
  label,
  name,
  defaultValue = "active",
  required = false,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="active">active</option>
        <option value="inactive">inactive</option>
        <option value="frozen">frozen</option>
      </select>
    </label>
  )
}

function EmployeeTypeSelect({
  label,
  name,
  defaultValue = "internal",
  required = false,
}: {
  label: string
  name: string
  defaultValue?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      <select
        name={name}
        required={required}
        defaultValue={defaultValue}
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="internal">自有员工</option>
        <option value="outsourced">外包员工</option>
      </select>
    </label>
  )
}

function MetricCard({
  label,
  value,
  detail,
  tone,
}: {
  label: string
  value: string
  detail: string
  tone: "default" | "ready" | "blocked"
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={
            tone === "blocked"
              ? "text-2xl font-semibold tracking-normal text-destructive"
              : "text-2xl font-semibold tracking-normal"
          }
        >
          {value}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  )
}
