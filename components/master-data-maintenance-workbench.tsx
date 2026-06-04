import Link from "next/link"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  GitBranch,
  Link2,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react"

import {
  type MasterDataAgentMaintenanceFeedback,
  type MasterDataAgentManagementSummary,
  type MasterDataEmployeeListRow,
  type MasterDataEmployeeListSummary,
  type MasterDataEntityDetailSummary,
  type MasterDataMaintenanceTone,
  summarizeMasterDataEmployeeList,
  summarizeMasterDataMaintenanceWorkbench,
} from "@/components/master-data-maintenance-model"
import type { ImportBatchListRow } from "@/components/import-center-model"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type MasterDataMaintenanceWorkbenchProps = {
  batches: ImportBatchListRow[]
  error: string | null
}

export function MasterDataMaintenanceWorkbench({
  batches,
  error,
}: MasterDataMaintenanceWorkbenchProps) {
  const summary = summarizeMasterDataMaintenanceWorkbench(batches)

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <div>
            <h1 className="text-xl font-semibold tracking-normal">主数据维护</h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              管理坐席、职场、供应商、项目、技能和绑定关系，查看来源版本、当前状态和关联范围。
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {formatToneLabel(summary.tone)}
          </Badge>
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

      <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="维护对象"
          value={summary.totalObjects.toLocaleString("zh-CN")}
          detail="坐席、职场、供应商、项目、技能、绑定关系"
          tone="default"
        />
        <MetricCard
          label="可查看对象"
          value={summary.readyObjects.toLocaleString("zh-CN")}
          detail="基于已应用主数据版本"
          tone={summary.readyObjects > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="仍有阻塞"
          value={summary.blockedObjects.toLocaleString("zh-CN")}
          detail={summary.title}
          tone={summary.blockedObjects > 0 ? "blocked" : "default"}
        />
        <MetricCard
          label="来源版本"
          value={summary.sourceVersionLabel}
          detail={`最新批次 ${summary.latestBatchLabel}`}
          tone="default"
        />
      </section>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4 text-muted-foreground" />
            来源与版本
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 text-sm text-muted-foreground">
          <div className="grid gap-1">
            <p className="font-medium text-foreground">{summary.title}</p>
            <p>{summary.detail}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href={summary.versionWorkbenchHref}>
                查看业务版本
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            {summary.sourceBatchHref ? (
              <Button asChild size="sm" variant="ghost">
                <Link href={summary.sourceBatchHref}>查看来源批次</Link>
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Database className="size-4 text-muted-foreground" />
            主数据对象台账
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>对象</TableHead>
                <TableHead>维护范围</TableHead>
                <TableHead>引用影响</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>状态</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.rows.map((row) => (
                <TableRow key={row.key}>
                  <TableCell className="align-top">
                    <div className="font-medium">{row.label}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {row.maintenanceBoundary}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[15rem] align-top text-sm text-muted-foreground">
                    {row.scopeLabel}
                  </TableCell>
                  <TableCell className="max-w-[14rem] align-top text-sm text-muted-foreground">
                    {row.referenceLabel}
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="font-mono text-xs">{row.sourceVersionLabel}</div>
                    {row.sourceBatchHref ? (
                      <Button asChild size="sm" variant="link" className="h-auto px-0 py-1">
                        <Link href={row.sourceBatchHref}>{row.sourceBatchLabel}</Link>
                      </Button>
                    ) : (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {row.sourceBatchLabel}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="grid gap-1">
                      <Badge variant={row.tone === "blocked" ? "destructive" : "outline"}>
                        {row.statusLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {row.blockerSummary}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <div className="inline-grid justify-items-end gap-1 text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={row.detailHref}>
                          查看详情
                          <ArrowRight data-icon="inline-end" />
                        </Link>
                      </Button>
                      <span className="text-xs text-muted-foreground">
                        {row.nextActionLabel}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </main>
  )
}

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
            <Link href="/data-quality/uploads/new">
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
      description="创建单个客服人员基础档案。人员表导入可从导入中心进入。"
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

export function MasterDataMaintenanceEntityDetail({
  summary,
  error,
  feedback,
  employeeList,
  employeeListError,
  agentSubmitAction,
  agentSkillSubmitAction,
  referenceSubmitAction,
  bindingSubmitAction,
}: {
  summary: MasterDataEntityDetailSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  employeeList?: MasterDataEmployeeListRow[]
  employeeListError?: string | null
  agentSubmitAction?: (formData: FormData) => Promise<void>
  agentSkillSubmitAction?: (formData: FormData) => Promise<void>
  referenceSubmitAction?: (formData: FormData) => Promise<void>
  bindingSubmitAction?: (formData: FormData) => Promise<void>
}) {
  const employeeListSummary = summarizeMasterDataEmployeeList(employeeList ?? [])
  const canRenderAgentSubmit = Boolean(
    agentSubmitAction && summary.agentSubmitSourceBatchId
  )
  const canRenderReferenceSubmit = Boolean(
    referenceSubmitAction && summary.referenceSubmitSourceBatchId
  )
  const canRenderBindingSubmit = Boolean(
    bindingSubmitAction && summary.bindingSubmitSourceBatchId
  )
  const canRenderAnySubmit =
    canRenderAgentSubmit || canRenderReferenceSubmit || canRenderBindingSubmit

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <section className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-2">
          <Button asChild size="sm" variant="ghost" className="w-fit px-0">
            <Link href="/master-data">
              <ArrowLeft data-icon="inline-start" />
              返回主数据维护
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold tracking-normal">
              {summary.title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
              {summary.detail}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.tone === "blocked" ? "destructive" : "outline"}>
            {formatToneLabel(summary.tone)}
          </Badge>
        </div>
      </section>

      {error ? (
        <Card className="border-destructive/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="size-4 text-destructive" />
              主数据详情来源读取失败
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{error}</CardContent>
        </Card>
      ) : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <Tabs defaultValue="overview" className="grid gap-4">
        <TabsList className="h-auto w-full justify-start overflow-x-auto md:w-fit">
          {summary.workspaceTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-0 grid gap-4">
          <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="维护对象"
              value={summary.entity.label}
              detail={summary.entity.scopeLabel}
              tone="default"
            />
            <MetricCard
              label="来源版本"
              value={summary.sourceVersionLabel}
              detail={`来源批次 ${summary.sourceBatchLabel}`}
              tone="default"
            />
            <MetricCard
              label="有效期"
              value={summary.effectivePeriodLabel}
              detail="当前生效周期"
              tone="default"
            />
            <MetricCard
              label="冻结状态"
              value={summary.freezeStatusLabel}
              detail="当前状态摘要"
              tone={summary.tone === "blocked" ? "blocked" : "default"}
            />
          </section>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Database className="size-4 text-muted-foreground" />
                当前对象概览
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-3">
              <DetailItem label="维护范围" value={summary.entity.scopeLabel} />
              <DetailItem label="引用范围" value={summary.entity.referenceLabel} />
              <DetailItem label="来源批次" value={summary.sourceBatchLabel} />
            </CardContent>
          </Card>

          {summary.entity.key === "agents" ? (
            <AgentEmployeeListSection
              summary={employeeListSummary}
              error={employeeListError ?? null}
            />
          ) : null}
        </TabsContent>

        <TabsContent value="source" className="mt-0 grid gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <GitBranch className="size-4 text-muted-foreground" />
                来源与关联
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 text-sm text-muted-foreground">
              <div className="grid gap-1">
                <p>
                  <span className="font-medium text-foreground">业务范围：</span>
                  {summary.entity.scopeLabel}
                </p>
                <p>
                  <span className="font-medium text-foreground">引用范围：</span>
                  {summary.entity.referenceLabel}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {summary.sourceVersionHref ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={summary.sourceVersionHref}>
                      查看业务版本
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </Button>
                ) : null}
                {summary.sourceBatchHref ? (
                  <Button asChild size="sm" variant="ghost">
                    <Link href={summary.sourceBatchHref}>查看来源批次</Link>
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Link2 className="size-4 text-muted-foreground" />
                引用影响摘要
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>引用类型</TableHead>
                    <TableHead>来源范围</TableHead>
                    <TableHead>数量</TableHead>
                    <TableHead>说明</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.referenceImpacts.map((impact) => (
                    <TableRow key={impact.key}>
                      <TableCell className="align-top font-medium">
                        {impact.label}
                      </TableCell>
                      <TableCell className="align-top text-sm text-muted-foreground">
                        {impact.sourceLabel}
                      </TableCell>
                      <TableCell className="align-top">
                        <Badge variant={impact.tone === "blocked" ? "destructive" : "outline"}>
                          {impact.countLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xl align-top text-sm text-muted-foreground">
                        {impact.detail}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="mt-0">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings2 className="size-4 text-muted-foreground" />
                维护动作
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>动作</TableHead>
                    <TableHead>实体范围</TableHead>
                    <TableHead>引用校验</TableHead>
                    <TableHead>错误提示</TableHead>
                    <TableHead className="text-right">提交</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {summary.maintenanceActions.map((action) => (
                    <TableRow key={action.key}>
                      <TableCell className="align-top">
                        <div className="font-medium">{action.label}</div>
                        <Badge
                          variant={
                            action.statusLabel === "来源阻塞" ? "destructive" : "outline"
                          }
                          className="mt-2"
                        >
                          {action.statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[14rem] align-top text-sm text-muted-foreground">
                        {action.targetScope}
                      </TableCell>
                      <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                        {action.referenceCheckLabel}
                      </TableCell>
                      <TableCell className="max-w-xs align-top text-sm text-muted-foreground">
                        {action.failureBoundary}
                      </TableCell>
                      <TableCell className="align-top text-right">
                        <Button size="sm" variant="outline" disabled={!action.canSubmit}>
                          {action.submitLabel}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit" className="mt-0 grid gap-4">
          {canRenderAgentSubmit ? (
            <AgentMaintenanceSubmitSection
              summary={summary}
              action={agentSubmitAction}
            />
          ) : null}

          {canRenderReferenceSubmit ? (
            <ReferenceMaintenanceSubmitSection
              summary={summary}
              action={referenceSubmitAction}
            />
          ) : null}

          {canRenderBindingSubmit ? (
            <BindingMaintenanceSubmitSection
              summary={summary}
              action={bindingSubmitAction}
            />
          ) : null}

          {!canRenderAnySubmit ? (
            <Card>
              <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Send className="size-4 text-muted-foreground" />
                暂无可提交表单
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                当前对象或来源批次不满足提交条件；请先查看来源与引用状态。
            </CardContent>
          </Card>
          ) : null}
        </TabsContent>

        {summary.entity.key === "agents" ? (
          <TabsContent value="agent_skills" className="mt-0 grid gap-4">
            {agentSkillSubmitAction && summary.agentSubmitSourceBatchId ? (
              <AgentSkillMaintenanceSection
                summary={summary}
                action={agentSkillSubmitAction}
              />
            ) : (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Send className="size-4 text-muted-foreground" />
                    暂无可提交技能维护
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  当前来源批次不满足技能维护提交条件。
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ) : null}
      </Tabs>
    </main>
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

function AgentEmployeeListSection({
  summary,
  error,
}: {
  summary: MasterDataEmployeeListSummary
  error: string | null
}) {
  return (
    <section className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="人员总数"
          value={summary.totalEmployees.toLocaleString("zh-CN")}
          detail="来自主数据员工表"
          tone="default"
        />
        <MetricCard
          label="生效人员"
          value={summary.activeEmployees.toLocaleString("zh-CN")}
          detail="status=active"
          tone={summary.activeEmployees > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="自有员工"
          value={summary.internalEmployees.toLocaleString("zh-CN")}
          detail="employee_type=internal"
          tone="default"
        />
        <MetricCard
          label="外包员工"
          value={summary.outsourcedEmployees.toLocaleString("zh-CN")}
          detail="employee_type=outsourced"
          tone="default"
        />
      </div>

      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4 text-muted-foreground" />
            人员列表
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {error ? (
            <div className="border-t p-4 text-sm text-muted-foreground">
              人员列表读取失败：{error}
            </div>
          ) : summary.rows.length === 0 ? (
            <div className="border-t p-4 text-sm text-muted-foreground">
              暂无人员主数据。请先上传并应用包含 employee 记录的主数据批次。
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>坐席</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>类型</TableHead>
                  <TableHead>组织/职场</TableHead>
                  <TableHead>技能</TableHead>
                  <TableHead>有效期</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.rows.map((row) => (
                  <TableRow key={row.employee_id}>
                    <TableCell className="align-top">
                      <div className="font-medium">{row.employee_name}</div>
                      <div className="mt-1 font-mono text-xs text-muted-foreground">
                        {row.employee_id}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                        {row.display.statusLabel}
                      </Badge>
                    </TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {row.display.employeeTypeLabel}
                    </TableCell>
                    <TableCell className="max-w-[18rem] align-top text-sm text-muted-foreground">
                      <div className="text-foreground">{row.display.organizationLabel}</div>
                      <div className="mt-1">{row.display.workplaceLabel}</div>
                    </TableCell>
                    <TableCell className="max-w-[20rem] align-top text-sm text-muted-foreground">
                      {row.display.skillSummary}
                    </TableCell>
                    <TableCell className="align-top text-sm text-muted-foreground">
                      {row.effective_from} 至 {row.effective_to}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function AgentMaintenanceSubmitSection({
  summary,
  action,
}: {
  summary: MasterDataEntityDetailSummary
  action?: (formData: FormData) => Promise<void>
}) {
  if (!action || !summary.agentSubmitSourceBatchId) {
    return null
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-normal">
          坐席维护
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          维护单个坐席基础档案。来源批次{" "}
          <span className="font-mono text-foreground">
            {summary.agentSubmitSourceBatchId}
          </span>
          。
        </p>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <AgentMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.agentSubmitSourceBatchId}
          title="新增坐席"
          description="创建单个坐席基础档案，可同时填写人员类型、组织和职场。"
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
        <AgentMaintenanceForm
          action={action}
          actionKey="edit"
          sourceBatchId={summary.agentSubmitSourceBatchId}
          title="编辑坐席"
          description="修正单个坐席姓名、状态、人员类型、组织或职场，未填字段由后端保留原值。"
          submitLabel="提交编辑"
          fields={[
            "employee_id",
            "employee_name",
            "status",
            "employee_type",
            "organization_id",
            "workplace_id",
          ]}
        />
        <AgentMaintenanceForm
          action={action}
          actionKey="freeze"
          sourceBatchId={summary.agentSubmitSourceBatchId}
          title="冻结坐席"
          description="将单个坐席状态更新为 frozen，并保留姓名与有效期。"
          submitLabel="提交冻结"
          fields={["employee_id"]}
        />
        <AgentMaintenanceForm
          action={action}
          actionKey="effective_period"
          sourceBatchId={summary.agentSubmitSourceBatchId}
          title="调整有效期"
          description="调整单个坐席有效期，并保留姓名和状态。"
          submitLabel="提交有效期"
          fields={["employee_id", "effective_from", "effective_to"]}
        />
      </div>
    </section>
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

function ReferenceMaintenanceSubmitSection({
  summary,
  action,
}: {
  summary: MasterDataEntityDetailSummary
  action?: (formData: FormData) => Promise<void>
}) {
  if (!action || !summary.referenceSubmitSourceBatchId) {
    return null
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-normal">
          {summary.entity.label}维护
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          维护单个{summary.entity.label}基础档案。来源批次{" "}
          <span className="font-mono text-foreground">
            {summary.referenceSubmitSourceBatchId}
          </span>
          。
        </p>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <AgentMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.referenceSubmitSourceBatchId}
          hiddenFields={{ entity_key: summary.entity.key }}
          title={`新增${summary.entity.label}`}
          description={`创建单个${summary.entity.label}基础档案，状态默认 active。`}
          submitLabel="提交新增"
          fields={[
            "reference_id",
            "reference_name",
            "status",
            "effective_from",
            "effective_to",
          ]}
        />
        <AgentMaintenanceForm
          action={action}
          actionKey="edit"
          sourceBatchId={summary.referenceSubmitSourceBatchId}
          hiddenFields={{ entity_key: summary.entity.key }}
          title={`编辑${summary.entity.label}`}
          description="修正单个对象名称或状态，未填字段由后端保留原值。"
          submitLabel="提交编辑"
          fields={["reference_id", "reference_name", "status"]}
        />
        <AgentMaintenanceForm
          action={action}
          actionKey="freeze"
          sourceBatchId={summary.referenceSubmitSourceBatchId}
          hiddenFields={{ entity_key: summary.entity.key }}
          title={`冻结${summary.entity.label}`}
          description="冻结单个对象，并保留名称与有效期。"
          submitLabel="提交冻结"
          fields={["reference_id"]}
        />
        <AgentMaintenanceForm
          action={action}
          actionKey="effective_period"
          sourceBatchId={summary.referenceSubmitSourceBatchId}
          hiddenFields={{ entity_key: summary.entity.key }}
          title="调整有效期"
          description="调整单个对象有效期，并保留名称和状态。"
          submitLabel="提交有效期"
          fields={["reference_id", "effective_from", "effective_to"]}
        />
      </div>
    </section>
  )
}

function BindingMaintenanceSubmitSection({
  summary,
  action,
}: {
  summary: MasterDataEntityDetailSummary
  action?: (formData: FormData) => Promise<void>
}) {
  if (!action || !summary.bindingSubmitSourceBatchId) {
    return null
  }

  return (
    <section className="grid gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-base font-semibold tracking-normal">
          绑定关系维护
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground">
          维护单条坐席、供应商、职场、项目、技能绑定关系。来源批次{" "}
          <span className="font-mono text-foreground">
            {summary.bindingSubmitSourceBatchId}
          </span>
          ，绑定关系没有冻结状态字段，因此冻结动作保持禁用。
        </p>
      </div>
      <div className="grid gap-3 xl:grid-cols-2">
        <AgentMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.bindingSubmitSourceBatchId}
          title="新增绑定关系"
          description="创建单条人员、供应商、职场、项目和技能绑定关系。"
          submitLabel="提交新增"
          fields={[
            "binding_id",
            "employee_id",
            "supplier_id",
            "workplace_id",
            "project_id",
            "skill_id",
            "effective_from",
            "effective_to",
          ]}
        />
        <AgentMaintenanceForm
          action={action}
          actionKey="edit"
          sourceBatchId={summary.bindingSubmitSourceBatchId}
          title="编辑绑定关系"
          description="修正单条绑定关系引用对象，未填字段由后端保留原值。"
          submitLabel="提交编辑"
          fields={[
            "binding_id",
            "employee_id",
            "supplier_id",
            "workplace_id",
            "project_id",
            "skill_id",
          ]}
        />
        <AgentMaintenanceForm
          action={action}
          actionKey="effective_period"
          sourceBatchId={summary.bindingSubmitSourceBatchId}
          title="调整绑定有效期"
          description="调整单条绑定关系有效期，并保留引用对象。"
          submitLabel="提交有效期"
          fields={["binding_id", "effective_from", "effective_to"]}
        />
      </div>
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

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md border p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  )
}

function formatToneLabel(tone: MasterDataMaintenanceTone) {
  if (tone === "ready") {
    return "已形成来源版本"
  }

  if (tone === "blocked") {
    return "来源阻塞"
  }

  return "等待来源"
}
