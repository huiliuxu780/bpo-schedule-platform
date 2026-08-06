import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Send,
  Settings2,
  Snowflake,
  Upload,
} from "lucide-react"

import { uploadImportCsvAction } from "@/app/data-quality/actions"
import { EmployeeRestrictionsForm } from "@/components/employee-restrictions-form"
import { AgentImportDialog } from "@/components/master-data-agent-import-dialog"
import {
  type MasterDataAgentMaintenanceFeedback,
  type MasterDataAgentDetailSummary,
  type MasterDataAgentManagementSummary,
  type MasterDataEntitySourceContext,
  type MasterDataOrganizationDetailSummary,
  type MasterDataOrganizationManagementSummary,
  type MasterDataOrganizationListViewRow,
  type MasterDataReferenceManagementSummary,
  type MasterDataReferenceListViewRow,
  type MasterDataSkillDetailSummary,
  type MasterDataVendorDetailSummary,
  type MasterDataWorkplaceDetailSummary,
  type MasterDataWorkplaceOperatorViewRow,
  type MasterDataWorkplaceServiceTeamPeopleSummary,
  type MasterDataWorkplaceServiceTeamRow,
  type MasterDataWorkplaceServiceTeamType,
} from "@/components/master-data-maintenance-model"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

export function MasterDataAgentPageActions({
  summary,
}: {
  summary: MasterDataAgentManagementSummary
}) {
  return (
    <>
      <Button asChild size="sm">
        <Link href={summary.createHref}>
          <Plus data-icon="inline-start" />
          新建
        </Link>
      </Button>
      <Button asChild size="sm" variant="outline">
        <Link href={summary.importDialog.openHref}>
          <Upload data-icon="inline-start" />
          批量导入
        </Link>
      </Button>
    </>
  )
}

export function MasterDataWorkplacePageActions({
  summary,
}: {
  summary: MasterDataReferenceManagementSummary
}) {
  if (!summary.createHref) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href={summary.createHref}>
        <Plus data-icon="inline-start" />
        新建
      </Link>
    </Button>
  )
}

export function MasterDataVendorPageActions({
  summary,
}: {
  summary: MasterDataReferenceManagementSummary
}) {
  if (!summary.createHref) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href={summary.createHref}>
        <Plus data-icon="inline-start" />
        新建
      </Link>
    </Button>
  )
}

export function MasterDataSkillPageActions({
  summary,
}: {
  summary: MasterDataReferenceManagementSummary
}) {
  if (!summary.createHref) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href={summary.createHref}>
        <Plus data-icon="inline-start" />
        新建
      </Link>
    </Button>
  )
}

export function MasterDataOrganizationPageActions({
  summary,
}: {
  summary: MasterDataOrganizationManagementSummary
}) {
  return (
    <Button asChild size="sm">
      <Link href={summary.createHref}>
        <Plus data-icon="inline-start" />
        新建
      </Link>
    </Button>
  )
}

export function MasterDataWorkplaceServiceTeamPageActions({
  detailSummary,
}: {
  detailSummary: MasterDataWorkplaceDetailSummary
}) {
  if (!detailSummary.createServiceTeamHref) {
    return null
  }

  return (
    <Button asChild size="sm">
      <Link href={detailSummary.createServiceTeamHref}>
        <Plus data-icon="inline-start" />
        新增服务团队
      </Link>
    </Button>
  )
}

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
  importDialogOverride,
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
  // 统一导入向导覆盖：新三页（/base-config）传参后替换旧主数据导入对话框，
  // 旧页面（/master-data/agents）不传则保持原行为。
  importDialogOverride?: React.ReactNode
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

      <AgentManagementListToolbar summary={managementSummary} />

      <AgentManagementTablePanel
        summary={managementSummary}
        employeeListError={employeeListError ?? null}
      />

      {freezeEmployee ? (
        <AgentFreezeDialog
          summary={summary}
          employee={freezeEmployee}
          action={agentSubmitAction}
          returnPath={managementSummary.returnPath}
        />
      ) : null}

      {importDialogOpen ? (
        importDialogOverride ?? (
          <AgentImportDialog
            dialog={managementSummary.importDialog}
            templateError={templateError ?? null}
            action={uploadImportCsvAction}
          />
        )
      ) : null}
    </main>
  )
}
export function MasterDataReferenceManagementPage({
  summary,
  listSummary,
  error,
  feedback,
  selectedFreezeWorkplaceId = "",
  selectedFreezeVendorId = "",
  selectedFreezeSkillId = "",
  workplaceSubmitAction,
  vendorSubmitAction,
  skillSubmitAction,
}: {
  summary: MasterDataEntitySourceContext
  listSummary: MasterDataReferenceManagementSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  selectedFreezeWorkplaceId?: string
  selectedFreezeVendorId?: string
  selectedFreezeSkillId?: string
  workplaceSubmitAction?: (formData: FormData) => Promise<void>
  vendorSubmitAction?: (formData: FormData) => Promise<void>
  skillSubmitAction?: (formData: FormData) => Promise<void>
}) {
  const selectedFreezeWorkplace =
    listSummary.entity.key === "sites"
      ? listSummary.rows.find(
          (row) => row.reference_id === selectedFreezeWorkplaceId
        ) ?? null
      : null
  const selectedFreezeVendor =
    listSummary.entity.key === "vendors"
      ? listSummary.rows.find((row) => row.reference_id === selectedFreezeVendorId) ??
        null
      : null
  const selectedFreezeSkill =
    listSummary.entity.key === "skills"
      ? listSummary.rows.find((row) => row.reference_id === selectedFreezeSkillId) ??
        null
      : null
  const hasActionRows = listSummary.rows.some(
    (row) =>
      row.display.detailHref || row.display.editHref || row.display.freezeHref
  )

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
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
                {hasActionRows ? <TableHead className="text-right">操作</TableHead> : null}
              </TableRow>
            </TableHeader>
            <TableBody>
              {listSummary.rows.map((row) => (
                <TableRow key={row.reference_id}>
                  <TableCell className="font-medium">
                    {row.display.referenceNameLabel}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.display.referenceIdLabel}
                  </TableCell>
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
                  {hasActionRows ? (
                    <TableCell className="whitespace-nowrap text-right">
                      {row.display.detailHref ? (
                        <Button
                          asChild
                          size="xs"
                          variant="ghost"
                          className="px-1.5 text-primary hover:text-primary"
                        >
                          <Link href={row.display.detailHref}>查看</Link>
                        </Button>
                      ) : null}
                      {row.display.editHref ? (
                        <Button
                          asChild
                          size="xs"
                          variant="ghost"
                          className="px-1.5 text-primary hover:text-primary"
                        >
                          <Link href={row.display.editHref}>编辑</Link>
                        </Button>
                      ) : null}
                      {row.display.freezeHref ? (
                        <Button
                          asChild
                          size="xs"
                          variant="ghost"
                          className="px-1.5 text-destructive hover:text-destructive"
                        >
                          <Link href={row.display.freezeHref}>冻结</Link>
                        </Button>
                      ) : null}
                    </TableCell>
                  ) : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      {selectedFreezeWorkplace && workplaceSubmitAction ? (
        <MasterDataWorkplaceFreezeDialog
          summary={summary}
          workplace={selectedFreezeWorkplace}
          action={workplaceSubmitAction}
        />
      ) : null}
      {selectedFreezeVendor && vendorSubmitAction ? (
        <MasterDataVendorFreezeDialog
          summary={summary}
          vendor={selectedFreezeVendor}
          action={vendorSubmitAction}
        />
      ) : null}
      {selectedFreezeSkill && skillSubmitAction ? (
        <MasterDataSkillFreezeDialog
          summary={summary}
          skill={selectedFreezeSkill}
          action={skillSubmitAction}
        />
      ) : null}
    </main>
  )
}

function MasterDataWorkplaceFreezeDialog({
  summary,
  workplace,
  action,
}: {
  summary: MasterDataEntitySourceContext
  workplace: MasterDataReferenceListViewRow
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>冻结职场</DialogTitle>
          <DialogDescription>
            冻结后该职场会进入冻结状态。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 text-sm text-muted-foreground">
          <p>
            确认冻结{" "}
            <span className="font-medium text-foreground">
              {workplace.display.referenceNameLabel}
            </span>
            ？
          </p>
          <p className="font-mono text-xs">{workplace.display.referenceIdLabel}</p>
        </div>
        {summary.workplaceSubmitSourceBatchId ? (
          <form action={action}>
            <input type="hidden" name="action" value="freeze" />
            <input
              type="hidden"
              name="source_batch_id"
              value={summary.workplaceSubmitSourceBatchId}
            />
            <input
              type="hidden"
              name="workplace_id"
              value={workplace.reference_id}
            />
            <DialogFooter>
              <Button asChild size="sm" variant="outline">
                <Link href="/master-data/sites">取消</Link>
              </Button>
              <Button type="submit" size="sm" variant="destructive">
                确认冻结
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button asChild size="sm" variant="outline">
              <Link href="/master-data/sites">关闭</Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

function MasterDataVendorFreezeDialog({
  summary,
  vendor,
  action,
}: {
  summary: MasterDataEntitySourceContext
  vendor: MasterDataReferenceListViewRow
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>冻结供应商</DialogTitle>
          <DialogDescription>
            冻结后该供应商会进入冻结状态。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 text-sm text-muted-foreground">
          <p>
            确认冻结{" "}
            <span className="font-medium text-foreground">
              {vendor.display.referenceNameLabel}
            </span>
            ？
          </p>
          <p className="font-mono text-xs">{vendor.display.referenceIdLabel}</p>
        </div>
        {summary.vendorSubmitSourceBatchId ? (
          <form action={action}>
            <input type="hidden" name="action" value="freeze" />
            <input
              type="hidden"
              name="source_batch_id"
              value={summary.vendorSubmitSourceBatchId}
            />
            <input type="hidden" name="vendor_id" value={vendor.reference_id} />
            <DialogFooter>
              <Button asChild size="sm" variant="outline">
                <Link href="/master-data/vendors">取消</Link>
              </Button>
              <Button type="submit" size="sm" variant="destructive">
                确认冻结
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button asChild size="sm" variant="outline">
              <Link href="/master-data/vendors">关闭</Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

function MasterDataSkillFreezeDialog({
  summary,
  skill,
  action,
}: {
  summary: MasterDataEntitySourceContext
  skill: MasterDataReferenceListViewRow
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>冻结技能组</DialogTitle>
          <DialogDescription>
            冻结后该技能组会进入冻结状态。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 text-sm text-muted-foreground">
          <p>
            确认冻结{" "}
            <span className="font-medium text-foreground">
              {skill.display.referenceNameLabel}
            </span>
            ？
          </p>
          <p className="font-mono text-xs">{skill.display.referenceIdLabel}</p>
        </div>
        {summary.skillSubmitSourceBatchId ? (
          <form action={action}>
            <input type="hidden" name="action" value="freeze" />
            <input
              type="hidden"
              name="source_batch_id"
              value={summary.skillSubmitSourceBatchId}
            />
            <input type="hidden" name="skill_id" value={skill.reference_id} />
            <DialogFooter>
              <Button asChild size="sm" variant="outline">
                <Link href="/master-data/skills">取消</Link>
              </Button>
              <Button type="submit" size="sm" variant="destructive">
                确认冻结
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button asChild size="sm" variant="outline">
              <Link href="/master-data/skills">关闭</Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function MasterDataWorkplaceDetailPage({
  detailSummary,
  error,
  feedback = null,
  selectedFreezeServiceTeamId = "",
  serviceTeamSubmitAction,
}: {
  detailSummary: MasterDataWorkplaceDetailSummary
  error: string | null
  feedback?: MasterDataAgentMaintenanceFeedback | null
  selectedFreezeServiceTeamId?: string
  serviceTeamSubmitAction?: (formData: FormData) => Promise<void>
}) {
  const workplace = detailSummary.workplace
  const selectedFreezeServiceTeam =
    detailSummary.operatorRows.find(
      (row) =>
        row.operator_key === selectedFreezeServiceTeamId &&
        row.source_type === "service_team"
    ) ?? null

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="职场详情读取失败" error={error} /> : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="服务团队"
          value={detailSummary.totalOperators.toLocaleString("zh-CN")}
          detail="该职场下的团队来源"
          tone={detailSummary.totalOperators > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="自有团队"
          value={detailSummary.internalOperators.toLocaleString("zh-CN")}
          detail="来自人员档案"
          tone={detailSummary.internalOperators > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="供应商团队"
          value={detailSummary.supplierOperators.toLocaleString("zh-CN")}
          detail="来自人员归属记录"
          tone={detailSummary.supplierOperators > 0 ? "ready" : "default"}
        />
      </section>

      <section className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 text-base font-semibold tracking-normal">职场信息</h2>
        {workplace ? (
          <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyField label="职场名称" value={workplace.display.referenceNameLabel} />
            <ReadOnlyField label="职场编码" value={workplace.display.referenceIdLabel} />
            <ReadOnlyField label="状态" value={workplace.display.statusLabel} />
            <ReadOnlyField label="地点属性" value={workplace.display.skillCategoryLabel} />
            <ReadOnlyField label="有效期" value={workplace.display.effectivePeriodLabel} />
            <ReadOnlyField label="来源批次" value={workplace.display.sourceBatchLabel} />
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 text-base font-semibold tracking-normal">服务团队</h2>
        {detailSummary.operatorRows.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            暂无该职场服务团队记录。
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>团队类型</TableHead>
                <TableHead>服务团队</TableHead>
                <TableHead>供应商</TableHead>
                <TableHead>人员/绑定数</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>有效期</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>来源批次</TableHead>
                <TableHead className="w-40 text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailSummary.operatorRows.map((row) => (
                <TableRow key={row.operator_key}>
                  <TableCell>{row.display.operatorTypeLabel}</TableCell>
                  <TableCell className="font-medium">
                    {row.display.operatorNameLabel}
                  </TableCell>
                  <TableCell>{row.display.supplierLabel}</TableCell>
                  <TableCell>{row.display.recordCountLabel}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                      {row.display.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.display.effectivePeriodLabel}</TableCell>
                  <TableCell>{row.display.sourceLabel}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.display.sourceBatchLabel}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.display.detailHref ? (
                      <Button
                        asChild
                        size="xs"
                        variant="ghost"
                        className="px-1.5 text-primary hover:text-primary"
                      >
                        <Link href={row.display.detailHref}>
                          <Eye data-icon="inline-start" />
                          查看
                        </Link>
                      </Button>
                    ) : null}
                    {row.display.editHref ? (
                      <Button
                        asChild
                        size="xs"
                        variant="ghost"
                        className="px-1.5 text-primary hover:text-primary"
                      >
                        <Link href={row.display.editHref}>
                          <Pencil data-icon="inline-start" />
                          编辑
                        </Link>
                      </Button>
                    ) : null}
                    {row.display.freezeHref ? (
                      <Button
                        asChild
                        size="xs"
                        variant="ghost"
                        className="px-1.5 text-destructive hover:text-destructive"
                      >
                        <Link href={row.display.freezeHref}>
                          <Snowflake data-icon="inline-start" />
                          冻结
                        </Link>
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      {selectedFreezeServiceTeam && workplace && serviceTeamSubmitAction ? (
        <MasterDataWorkplaceServiceTeamFreezeDialog
          workplaceId={workplace.reference_id}
          serviceTeam={selectedFreezeServiceTeam}
          action={serviceTeamSubmitAction}
        />
      ) : null}
    </main>
  )
}

function MasterDataWorkplaceServiceTeamFreezeDialog({
  workplaceId,
  serviceTeam,
  action,
  cancelHref,
}: {
  workplaceId: string
  serviceTeam: MasterDataWorkplaceOperatorViewRow
  action: (formData: FormData) => Promise<void>
  cancelHref?: string
}) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>冻结服务团队</DialogTitle>
          <DialogDescription>
            冻结后该服务团队会进入冻结状态。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-1 text-sm text-muted-foreground">
          <p>
            确认冻结{" "}
            <span className="font-medium text-foreground">
              {serviceTeam.display.operatorNameLabel}
            </span>
            ？
          </p>
          <p className="font-mono text-xs">{serviceTeam.operator_key}</p>
        </div>
        <form action={action}>
          <input type="hidden" name="action" value="freeze" />
          <input type="hidden" name="source_batch_id" value={serviceTeam.batch_id} />
          <input type="hidden" name="workplace_id" value={workplaceId} />
          <input
            type="hidden"
            name="service_team_id"
            value={serviceTeam.operator_key}
          />
          <DialogFooter>
            <Button asChild size="sm" variant="outline">
              <Link href={cancelHref ?? `/master-data/sites/${encodeURIComponent(workplaceId)}`}>
                取消
              </Link>
            </Button>
            <Button type="submit" size="sm" variant="destructive">
              确认冻结
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function MasterDataWorkplaceServiceTeamDetailPage({
  detailSummary,
  serviceTeam,
  serviceTeamRow,
  peopleSummary,
  error,
  showFreezeDialog = false,
  serviceTeamSubmitAction,
}: {
  detailSummary: MasterDataWorkplaceDetailSummary
  serviceTeam: MasterDataWorkplaceServiceTeamRow | null
  serviceTeamRow: MasterDataWorkplaceOperatorViewRow | null
  peopleSummary: MasterDataWorkplaceServiceTeamPeopleSummary
  error: string | null
  showFreezeDialog?: boolean
  serviceTeamSubmitAction?: (formData: FormData) => Promise<void>
}) {
  const workplace = detailSummary.workplace
  const detailHref = serviceTeamRow?.display.detailHref ?? ""

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="服务团队详情读取失败" error={error} /> : null}

      <div className="flex flex-wrap justify-end gap-2">
        {serviceTeamRow?.display.editHref ? (
          <Button asChild size="sm" variant="outline">
            <Link href={serviceTeamRow.display.editHref}>
              <Pencil data-icon="inline-start" />
              编辑服务团队
            </Link>
          </Button>
        ) : null}
        {detailHref ? (
          <Button asChild size="sm" variant="destructive">
            <Link
              href={`${detailHref}?freeze_service_team_id=${encodeURIComponent(
                serviceTeamRow?.operator_key ?? ""
              )}`}
            >
              <Snowflake data-icon="inline-start" />
              冻结服务团队
            </Link>
          </Button>
        ) : null}
      </div>

      {serviceTeam && serviceTeamRow && workplace ? (
        <>
          <section className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="团队类型"
              value={serviceTeamRow.display.operatorTypeLabel}
              detail="服务团队分类"
              tone={serviceTeam.team_type === "internal" ? "ready" : "default"}
            />
            <MetricCard
              label="状态"
              value={serviceTeamRow.display.statusLabel}
              detail="当前维护状态"
              tone={serviceTeam.status === "active" ? "ready" : "default"}
            />
            <MetricCard
              label="来源"
              value={serviceTeamRow.display.sourceLabel}
              detail="记录来源"
              tone="default"
            />
          </section>

          <section className="rounded-lg border bg-background p-4">
            <h2 className="mb-3 text-base font-semibold tracking-normal">服务团队信息</h2>
            <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
              <ReadOnlyField label="服务团队 ID" value={serviceTeam.service_team_id} />
              <ReadOnlyField
                label="服务团队名称"
                value={serviceTeamRow.display.operatorNameLabel}
              />
              <ReadOnlyField
                label="团队类型"
                value={serviceTeamRow.display.operatorTypeLabel}
              />
              <ReadOnlyField
                label="归属职场"
                value={workplace.display.referenceNameLabel}
              />
              <ReadOnlyField
                label={serviceTeam.team_type === "internal" ? "组织来源" : "供应商来源"}
                value={
                  serviceTeam.team_type === "internal"
                    ? (serviceTeam.organization_id ?? "-")
                    : serviceTeamRow.display.supplierLabel
                }
              />
              <ReadOnlyField label="状态" value={serviceTeamRow.display.statusLabel} />
              <ReadOnlyField
                label="生效期"
                value={serviceTeamRow.display.effectivePeriodLabel}
              />
              <ReadOnlyField
                label="来源批次"
                value={serviceTeamRow.display.sourceBatchLabel}
              />
            </div>
          </section>

          <section className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold tracking-normal">关联人员</h2>
              <Badge variant="secondary">{peopleSummary.totalPeople} 人</Badge>
            </div>
            {peopleSummary.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>人员 ID</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>组织</TableHead>
                      <TableHead>职场</TableHead>
                      <TableHead>技能</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>匹配来源</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {peopleSummary.rows.map((person) => (
                      <TableRow key={person.employee_id}>
                        <TableCell className="font-medium">
                          {person.display.employeeNameLabel}
                        </TableCell>
                        <TableCell className="font-mono">
                          {person.employee_id}
                        </TableCell>
                        <TableCell>{person.display.employeeTypeLabel}</TableCell>
                        <TableCell>{person.display.organizationLabel}</TableCell>
                        <TableCell>{person.display.workplaceLabel}</TableCell>
                        <TableCell className="min-w-64">
                          {person.display.skillSummary}
                        </TableCell>
                        <TableCell>{person.display.statusLabel}</TableCell>
                        <TableCell>{person.display.matchSourceLabel}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <AgentFormBlockedState detail={peopleSummary.emptyDetail} />
            )}
          </section>
        </>
      ) : (
        <AgentFormBlockedState detail="未找到该服务团队，请回到职场详情重新选择。" />
      )}

      {showFreezeDialog &&
      serviceTeamRow &&
      workplace &&
      detailHref &&
      serviceTeamSubmitAction ? (
        <MasterDataWorkplaceServiceTeamFreezeDialog
          workplaceId={workplace.reference_id}
          serviceTeam={serviceTeamRow}
          action={serviceTeamSubmitAction}
          cancelHref={detailHref}
        />
      ) : null}
    </main>
  )
}

export function MasterDataWorkplaceCreatePage({
  summary,
  error,
  feedback,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <WorkplaceFormPageShell error={error} feedback={feedback}>
      {summary.workplaceSubmitSourceBatchId ? (
        <WorkplaceMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.workplaceSubmitSourceBatchId}
          submitLabel="提交新增"
          fields={[
            "workplace_id",
            "reference_name",
            "status",
            "effective_from",
            "effective_to",
          ]}
        />
      ) : (
        <AgentFormBlockedState detail="当前来源批次不满足职场维护提交条件。" />
      )}
    </WorkplaceFormPageShell>
  )
}

export function MasterDataWorkplaceEditPage({
  summary,
  error,
  feedback,
  workplace,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  workplace: MasterDataReferenceListViewRow | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <WorkplaceFormPageShell error={error} feedback={feedback}>
      {summary.workplaceSubmitSourceBatchId && workplace ? (
        <WorkplaceMaintenanceForm
          action={action}
          actionKey="edit"
          sourceBatchId={summary.workplaceSubmitSourceBatchId}
          submitLabel="提交编辑"
          fields={[
            "reference_name",
            "status",
            "effective_from",
            "effective_to",
          ]}
          hiddenFields={{ workplace_id: workplace.reference_id }}
          defaultValues={{
            reference_name: workplace.reference_name,
            status: workplace.status,
            effective_from: workplace.effective_from,
            effective_to: workplace.effective_to,
          }}
        />
      ) : (
        <AgentFormBlockedState
          detail={
            workplace
              ? "当前来源批次不满足职场维护提交条件。"
              : "未找到该职场，请返回列表重新选择。"
          }
        />
      )}
    </WorkplaceFormPageShell>
  )
}

export function MasterDataWorkplaceServiceTeamCreatePage({
  summary,
  error,
  feedback,
  workplaceId,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  workplaceId: string
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <WorkplaceFormPageShell error={error} feedback={feedback}>
      {summary.workplaceSubmitSourceBatchId ? (
        <WorkplaceServiceTeamMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.workplaceSubmitSourceBatchId}
          workplaceId={workplaceId}
          submitLabel="提交新增"
          showServiceTeamId
        />
      ) : (
        <AgentFormBlockedState detail="当前来源批次不满足服务团队维护提交条件。" />
      )}
    </WorkplaceFormPageShell>
  )
}

export function MasterDataWorkplaceServiceTeamEditPage({
  summary,
  error,
  feedback,
  workplaceId,
  serviceTeam,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  workplaceId: string
  serviceTeam: MasterDataWorkplaceServiceTeamRow | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <WorkplaceFormPageShell error={error} feedback={feedback}>
      {summary.workplaceSubmitSourceBatchId && serviceTeam ? (
        <WorkplaceServiceTeamMaintenanceForm
          action={action}
          actionKey="edit"
          sourceBatchId={summary.workplaceSubmitSourceBatchId}
          workplaceId={workplaceId}
          submitLabel="提交编辑"
          hiddenServiceTeamId={serviceTeam.service_team_id}
          defaultValues={{
            team_type: serviceTeam.team_type,
            team_name: serviceTeam.team_name,
            organization_id: serviceTeam.organization_id ?? "",
            supplier_id: serviceTeam.supplier_id ?? "",
            status: serviceTeam.status,
            effective_from: serviceTeam.effective_from,
            effective_to: serviceTeam.effective_to,
          }}
        />
      ) : (
        <AgentFormBlockedState
          detail={
            serviceTeam
              ? "当前来源批次不满足服务团队维护提交条件。"
              : "未找到该服务团队，请回到职场详情重新选择。"
          }
        />
      )}
    </WorkplaceFormPageShell>
  )
}

export function MasterDataVendorCreatePage({
  summary,
  error,
  feedback,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <VendorFormPageShell error={error} feedback={feedback}>
      {summary.vendorSubmitSourceBatchId ? (
        <VendorMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.vendorSubmitSourceBatchId}
          submitLabel="提交新增"
          fields={[
            "vendor_id",
            "reference_name",
            "status",
            "effective_from",
            "effective_to",
          ]}
        />
      ) : (
        <AgentFormBlockedState detail="当前来源批次不满足供应商维护提交条件。" />
      )}
    </VendorFormPageShell>
  )
}

export function MasterDataVendorEditPage({
  summary,
  error,
  feedback,
  vendor,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  vendor: MasterDataReferenceListViewRow | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <VendorFormPageShell error={error} feedback={feedback}>
      {summary.vendorSubmitSourceBatchId && vendor ? (
        <VendorMaintenanceForm
          action={action}
          actionKey="edit"
          sourceBatchId={summary.vendorSubmitSourceBatchId}
          submitLabel="提交编辑"
          fields={[
            "reference_name",
            "status",
            "effective_from",
            "effective_to",
          ]}
          hiddenFields={{ vendor_id: vendor.reference_id }}
          defaultValues={{
            reference_name: vendor.reference_name,
            status: vendor.status,
            effective_from: vendor.effective_from,
            effective_to: vendor.effective_to,
          }}
        />
      ) : (
        <AgentFormBlockedState
          detail={
            vendor
              ? "当前来源批次不满足供应商维护提交条件。"
              : "未找到该供应商，请返回列表重新选择。"
          }
        />
      )}
    </VendorFormPageShell>
  )
}

export function MasterDataSkillCreatePage({
  summary,
  error,
  feedback,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <SkillFormPageShell error={error} feedback={feedback}>
      {summary.skillSubmitSourceBatchId ? (
        <SkillMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.skillSubmitSourceBatchId}
          submitLabel="提交新增"
          fields={[
            "skill_id",
            "reference_name",
            "skill_category",
            "status",
            "effective_from",
            "effective_to",
          ]}
        />
      ) : (
        <AgentFormBlockedState detail="当前来源批次不满足技能组维护提交条件。" />
      )}
    </SkillFormPageShell>
  )
}

export function MasterDataSkillEditPage({
  summary,
  error,
  feedback,
  skill,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  skill: MasterDataReferenceListViewRow | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <SkillFormPageShell error={error} feedback={feedback}>
      {summary.skillSubmitSourceBatchId && skill ? (
        <SkillMaintenanceForm
          action={action}
          actionKey="edit"
          sourceBatchId={summary.skillSubmitSourceBatchId}
          submitLabel="提交编辑"
          fields={[
            "reference_name",
            "skill_category",
            "status",
            "effective_from",
            "effective_to",
          ]}
          hiddenFields={{ skill_id: skill.reference_id }}
          defaultValues={{
            reference_name: skill.reference_name,
            skill_category: skill.skill_category ?? undefined,
            status: skill.status,
            effective_from: skill.effective_from,
            effective_to: skill.effective_to,
          }}
        />
      ) : (
        <AgentFormBlockedState
          detail={
            skill
              ? "当前来源批次不满足技能组维护提交条件。"
              : "未找到该技能组，请返回列表重新选择。"
          }
        />
      )}
    </SkillFormPageShell>
  )
}

export function MasterDataOrganizationCreatePage({
  summary,
  error,
  feedback,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <OrganizationFormPageShell error={error} feedback={feedback}>
      {summary.organizationSubmitSourceBatchId ? (
        <OrganizationMaintenanceEditor
          action={action}
          actionKey="create"
          sourceBatchId={summary.organizationSubmitSourceBatchId}
          submitLabel="提交新增"
          fields={[
            "organization_id",
            "organization_name",
            "organization_level",
            "parent_organization_id",
            "status",
            "effective_from",
            "effective_to",
          ]}
        />
      ) : (
        <AgentFormBlockedState detail="当前来源批次不满足组织维护提交条件。" />
      )}
    </OrganizationFormPageShell>
  )
}

export function MasterDataOrganizationEditPage({
  summary,
  error,
  feedback,
  organization,
  action,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  organization: MasterDataOrganizationListViewRow | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <OrganizationFormPageShell error={error} feedback={feedback}>
      {summary.organizationSubmitSourceBatchId && organization ? (
        <OrganizationMaintenanceEditor
          action={action}
          actionKey="edit"
          sourceBatchId={summary.organizationSubmitSourceBatchId}
          submitLabel="提交编辑"
          fields={[
            "organization_name",
            "organization_level",
            "parent_organization_id",
            "status",
            "effective_from",
            "effective_to",
          ]}
          hiddenFields={{ organization_id: organization.organization_id }}
          defaultValues={{
            organization_name: organization.organization_name,
            organization_level: String(organization.organization_level),
            parent_organization_id: organization.parent_organization_id ?? "",
            status: organization.status,
            effective_from: organization.effective_from,
            effective_to: organization.effective_to,
          }}
        />
      ) : (
        <AgentFormBlockedState
          detail={
            organization
              ? "当前来源批次不满足组织维护提交条件。"
              : "未找到该组织，请返回列表重新选择。"
          }
        />
      )}
    </OrganizationFormPageShell>
  )
}

export function MasterDataVendorDetailPage({
  summary,
  detailSummary,
  error,
}: {
  summary: MasterDataEntitySourceContext
  detailSummary: MasterDataVendorDetailSummary
  error: string | null
}) {
  const vendor = detailSummary.vendor

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="供应商详情读取失败" error={error} /> : null}

      <section className="grid gap-3 md:grid-cols-3">
        <MetricCard
          label="服务职场"
          value={detailSummary.totalServiceWorkplaces.toLocaleString("zh-CN")}
          detail="来自人员归属记录"
          tone={detailSummary.totalServiceWorkplaces > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="服务团队"
          value={detailSummary.totalServiceTeams.toLocaleString("zh-CN")}
          detail="来自职场服务团队"
          tone={detailSummary.totalServiceTeams > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="来源版本"
          value={summary.sourceVersionLabel}
          detail="主数据业务版本"
          tone="default"
        />
      </section>

      <section className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 text-base font-semibold tracking-normal">供应商信息</h2>
        {vendor ? (
          <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyField label="供应商名称" value={vendor.display.referenceNameLabel} />
            <ReadOnlyField label="供应商编码" value={vendor.display.referenceIdLabel} />
            <ReadOnlyField label="状态" value={vendor.display.statusLabel} />
            <ReadOnlyField label="对象属性" value={vendor.display.skillCategoryLabel} />
            <ReadOnlyField label="有效期" value={vendor.display.effectivePeriodLabel} />
            <ReadOnlyField label="来源批次" value={vendor.display.sourceBatchLabel} />
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 text-base font-semibold tracking-normal">服务团队</h2>
        {detailSummary.serviceTeamRows.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            暂无该供应商服务团队记录。
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>服务团队</TableHead>
                <TableHead>归属职场</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>有效期</TableHead>
                <TableHead>来源批次</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailSummary.serviceTeamRows.map((row) => (
                <TableRow key={row.service_team_id}>
                  <TableCell className="font-medium">
                    {row.display.teamNameLabel}
                  </TableCell>
                  <TableCell>{row.display.workplaceLabel}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                      {row.display.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.display.effectivePeriodLabel}</TableCell>
                  <TableCell className="font-mono">
                    {row.display.sourceBatchLabel}
                  </TableCell>
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
        )}
      </section>

      <section className="rounded-lg border bg-background p-4">
        <h2 className="mb-3 text-base font-semibold tracking-normal">服务职场</h2>
        {detailSummary.serviceRows.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            暂无该供应商服务职场记录。
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>职场</TableHead>
                <TableHead>职场编码</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>有效期</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>来源批次</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {detailSummary.serviceRows.map((row) => (
                <TableRow key={row.service_key}>
                  <TableCell className="font-medium">
                    {row.display.workplaceLabel}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.display.workplaceIdLabel}
                  </TableCell>
                  <TableCell>
                    <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                      {row.display.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.display.effectivePeriodLabel}</TableCell>
                  <TableCell>{row.display.sourceLabel}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.display.sourceBatchLabel}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      asChild
                      size="xs"
                      variant="ghost"
                      className="px-1.5 text-primary hover:text-primary"
                    >
                      <Link href={row.display.detailHref}>查看职场</Link>
                    </Button>
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

export function MasterDataOrganizationManagementPage({
  summary,
  listSummary,
  error,
  feedback,
  selectedFreezeOrganizationId = "",
  organizationSubmitAction,
}: {
  summary: MasterDataEntitySourceContext
  listSummary: MasterDataOrganizationManagementSummary
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  selectedFreezeOrganizationId?: string
  organizationSubmitAction?: (formData: FormData) => Promise<void>
}) {
  const selectedFreezeOrganization =
    listSummary.rows.find(
      (row) => row.organization_id === selectedFreezeOrganizationId
    ) ?? null

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="组织列表读取失败" error={error} /> : null}
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
          detail="当前可引用组织"
          tone={listSummary.activeRecords > 0 ? "ready" : "default"}
        />
        <MetricCard
          label="冻结"
          value={listSummary.frozenRecords.toLocaleString("zh-CN")}
          detail="不可继续引用组织"
          tone={listSummary.frozenRecords > 0 ? "blocked" : "default"}
        />
      </section>

      <section className="rounded-lg border bg-background p-4">
        {listSummary.rows.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            暂无组织记录。
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>组织名称</TableHead>
                <TableHead>组织编码</TableHead>
                <TableHead>层级</TableHead>
                <TableHead>上级组织</TableHead>
                <TableHead>组织路径</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>有效期</TableHead>
                <TableHead>来源批次</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listSummary.rows.map((row) => (
                <TableRow key={row.organization_id}>
                  <TableCell className="font-medium">
                    {row.display.organizationNameLabel}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.display.organizationIdLabel}
                  </TableCell>
                  <TableCell>{row.display.organizationLevelLabel}</TableCell>
                  <TableCell>{row.display.parentOrganizationLabel}</TableCell>
                  <TableCell>{row.display.organizationPathLabel}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                      {row.display.statusLabel}
                    </Badge>
                  </TableCell>
                  <TableCell>{row.display.effectivePeriodLabel}</TableCell>
                  <TableCell className="font-mono text-xs">
                    {row.display.sourceBatchLabel}
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right">
                    <Button
                      asChild
                      size="xs"
                      variant="ghost"
                      className="px-1.5 text-primary hover:text-primary"
                    >
                      <Link href={row.display.detailHref}>查看</Link>
                    </Button>
                    <Button
                      asChild
                      size="xs"
                      variant="ghost"
                      className="px-1.5 text-primary hover:text-primary"
                    >
                      <Link href={row.display.editHref}>编辑</Link>
                    </Button>
                    <Button
                      asChild
                      size="xs"
                      variant="ghost"
                      className="px-1.5 text-destructive hover:text-destructive"
                    >
                      <Link href={row.display.freezeHref}>冻结</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
      {selectedFreezeOrganization && organizationSubmitAction ? (
        <MasterDataOrganizationFreezeDialog
          summary={summary}
          organization={selectedFreezeOrganization}
          action={organizationSubmitAction}
        />
      ) : null}
    </main>
  )
}

export function MasterDataOrganizationDetailPage({
  detailSummary,
  error,
}: {
  detailSummary: MasterDataOrganizationDetailSummary
  error: string | null
}) {
  const organization = detailSummary.organization

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="组织详情读取失败" error={error} /> : null}

      {organization ? (
        <>
          <section className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="组织层级"
              value={organization.display.organizationLevelLabel}
              detail={organization.display.parentOrganizationLabel}
              tone="default"
            />
            <MetricCard
              label="直接下级组织"
              value={detailSummary.totalChildOrganizations.toLocaleString("zh-CN")}
              detail="只读层级核对"
              tone={detailSummary.totalChildOrganizations > 0 ? "ready" : "default"}
            />
            <MetricCard
              label="归属人员"
              value={detailSummary.totalPeople.toLocaleString("zh-CN")}
              detail="当前直接归属"
              tone={detailSummary.totalPeople > 0 ? "ready" : "default"}
            />
          </section>

          <section className="rounded-lg border bg-background p-4">
            <h2 className="mb-3 text-base font-semibold tracking-normal">组织信息</h2>
            <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
              <ReadOnlyField
                label="组织名称"
                value={organization.display.organizationNameLabel}
              />
              <ReadOnlyField
                label="组织编码"
                value={organization.display.organizationIdLabel}
              />
              <ReadOnlyField
                label="层级"
                value={organization.display.organizationLevelLabel}
              />
              <ReadOnlyField
                label="上级组织"
                value={organization.display.parentOrganizationLabel}
              />
              <ReadOnlyField
                label="组织路径"
                value={organization.display.organizationPathLabel}
              />
              <ReadOnlyField label="状态" value={organization.display.statusLabel} />
              <ReadOnlyField
                label="有效期"
                value={organization.display.effectivePeriodLabel}
              />
              <ReadOnlyField
                label="来源批次"
                value={organization.display.sourceBatchLabel}
              />
            </div>
          </section>

          <section className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold tracking-normal">直接下级组织</h2>
              <Badge variant="secondary">
                {detailSummary.totalChildOrganizations.toLocaleString("zh-CN")} 个
              </Badge>
            </div>
            {detailSummary.childRows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>组织名称</TableHead>
                    <TableHead>组织编码</TableHead>
                    <TableHead>层级</TableHead>
                    <TableHead>组织路径</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailSummary.childRows.map((row) => (
                    <TableRow key={row.organization_id}>
                      <TableCell className="font-medium">
                        {row.display.organizationNameLabel}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {row.display.organizationIdLabel}
                      </TableCell>
                      <TableCell>{row.display.organizationLevelLabel}</TableCell>
                      <TableCell>{row.display.organizationPathLabel}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                          {row.display.statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="xs"
                          variant="ghost"
                          className="px-1.5 text-primary hover:text-primary"
                        >
                          <Link href={row.display.detailHref}>查看组织</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <AgentFormBlockedState detail={detailSummary.emptyChildDetail} />
            )}
          </section>

          <section className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold tracking-normal">归属人员</h2>
              <Badge variant="secondary">
                {detailSummary.totalPeople.toLocaleString("zh-CN")} 人
              </Badge>
            </div>
            {detailSummary.peopleRows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>人员 ID</TableHead>
                    <TableHead>人员类型</TableHead>
                    <TableHead>职场</TableHead>
                    <TableHead>技能</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailSummary.peopleRows.map((row) => (
                    <TableRow key={row.employee_id}>
                      <TableCell className="font-medium">
                        {row.display.publicNameLabel}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{row.employee_id}</TableCell>
                      <TableCell>{row.display.employeeTypeLabel}</TableCell>
                      <TableCell>{row.display.workplaceLabel}</TableCell>
                      <TableCell>{row.display.skillSummary}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                          {row.display.statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="xs"
                          variant="ghost"
                          className="px-1.5 text-primary hover:text-primary"
                        >
                          <Link href={row.display.detailHref}>查看人员</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <AgentFormBlockedState detail={detailSummary.emptyPeopleDetail} />
            )}
          </section>
        </>
      ) : (
        <AgentFormBlockedState detail="未找到该组织，请返回列表重新选择。" />
      )}
    </main>
  )
}

export function MasterDataSkillDetailPage({
  detailSummary,
  error,
}: {
  detailSummary: MasterDataSkillDetailSummary
  error: string | null
}) {
  const skill = detailSummary.skill

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="技能组详情读取失败" error={error} /> : null}

      {skill ? (
        <>
          <section className="grid gap-3 md:grid-cols-3">
            <MetricCard
              label="归属属性"
              value={skill.display.skillCategoryLabel}
              detail="技能组分类"
              tone="default"
            />
            <MetricCard
              label="状态"
              value={skill.display.statusLabel}
              detail="主数据状态"
              tone={skill.status === "active" ? "ready" : "default"}
            />
            <MetricCard
              label="拥有该技能的客服人员"
              value={detailSummary.totalPeople.toLocaleString("zh-CN")}
              detail="当前技能集合"
              tone={detailSummary.totalPeople > 0 ? "ready" : "default"}
            />
          </section>

          <section className="rounded-lg border bg-background p-4">
            <h2 className="mb-3 text-base font-semibold tracking-normal">技能组信息</h2>
            <div className="grid gap-3 text-sm md:grid-cols-2 lg:grid-cols-3">
              <ReadOnlyField
                label="技能组名称"
                value={skill.display.referenceNameLabel}
              />
              <ReadOnlyField
                label="技能组编码"
                value={skill.display.referenceIdLabel}
              />
              <ReadOnlyField
                label="归属属性"
                value={skill.display.skillCategoryLabel}
              />
              <ReadOnlyField label="状态" value={skill.display.statusLabel} />
              <ReadOnlyField
                label="有效期"
                value={skill.display.effectivePeriodLabel}
              />
              <ReadOnlyField
                label="来源批次"
                value={skill.display.sourceBatchLabel}
              />
            </div>
          </section>

          <section className="rounded-lg border bg-background p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold tracking-normal">
                拥有该技能的客服人员
              </h2>
              <Badge variant="secondary">
                {detailSummary.totalPeople.toLocaleString("zh-CN")} 人
              </Badge>
            </div>
            {detailSummary.peopleRows.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>人员 ID</TableHead>
                    <TableHead>人员类型</TableHead>
                    <TableHead>组织</TableHead>
                    <TableHead>职场</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detailSummary.peopleRows.map((row) => (
                    <TableRow key={row.employee_id}>
                      <TableCell className="font-medium">
                        {row.display.publicNameLabel}
                      </TableCell>
                      <TableCell className="font-mono text-xs">{row.employee_id}</TableCell>
                      <TableCell>{row.display.employeeTypeLabel}</TableCell>
                      <TableCell>{row.display.organizationLabel}</TableCell>
                      <TableCell>{row.display.workplaceLabel}</TableCell>
                      <TableCell>
                        <Badge variant={row.status === "active" ? "outline" : "secondary"}>
                          {row.display.statusLabel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="xs"
                          variant="ghost"
                          className="px-1.5 text-primary hover:text-primary"
                        >
                          <Link href={row.display.detailHref}>查看人员</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <AgentFormBlockedState detail={detailSummary.emptyPeopleDetail} />
            )}
          </section>
        </>
      ) : (
        <AgentFormBlockedState detail="未找到该技能组，请返回列表重新选择。" />
      )}
    </main>
  )
}

function MasterDataOrganizationFreezeDialog({
  summary,
  organization,
  action,
}: {
  summary: MasterDataEntitySourceContext
  organization: MasterDataOrganizationListViewRow
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <Dialog open>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>冻结组织</DialogTitle>
          <DialogDescription>
            冻结后该组织将不可继续作为新的人员归属引用，已有历史数据不在本弹窗内调整。
          </DialogDescription>
        </DialogHeader>
        <form action={action} className="grid gap-4">
          <input type="hidden" name="action" value="freeze" />
          <input
            type="hidden"
            name="source_batch_id"
            value={summary.organizationSubmitSourceBatchId ?? ""}
          />
          <input
            type="hidden"
            name="organization_id"
            value={organization.organization_id}
          />
          <div className="rounded-md border bg-muted/20 p-3 text-sm">
            <div className="font-medium">
              {organization.display.organizationNameLabel}
            </div>
            <div className="text-muted-foreground">
              {organization.display.organizationPathLabel}
            </div>
          </div>
          <DialogFooter>
            <Button asChild size="sm" variant="outline">
              <Link href="/master-data/organizations">取消</Link>
            </Button>
            <Button type="submit" size="sm" variant="destructive">
              冻结组织
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function ReadOnlyField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="grid gap-1 rounded-md border bg-muted/20 p-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="min-w-0 break-words font-medium">{value}</span>
    </div>
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
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
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
        <div className="flex items-center justify-end gap-2">
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

function AgentManagementListToolbar({
  summary,
}: {
  summary: MasterDataAgentManagementSummary
}) {
  return (
    <section className="flex min-h-9 flex-wrap items-center justify-start gap-3 px-1">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">已选 0 项</span>
        {summary.bulkActions.map((action) => (
          <Button key={action.key} size="sm" variant="outline" disabled>
            {action.label}
          </Button>
        ))}
      </div>
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
                    <AgentRowActionLink href={row.display.detailHref}>
                      查看
                    </AgentRowActionLink>
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

export function MasterDataAgentDetailPage({
  detailSummary,
  error,
  feedback = null,
  restrictionsAction,
}: {
  detailSummary: MasterDataAgentDetailSummary
  error: string | null
  feedback?: MasterDataAgentMaintenanceFeedback | null
  restrictionsAction?: (formData: FormData) => Promise<void>
}) {
  const employee = detailSummary.employee

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title="客服人员详情读取失败" error={error} /> : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

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

          {restrictionsAction ? (
            <section className="rounded-lg border bg-background p-4">
              <div className="mb-3 grid gap-1">
                <h2 className="text-base font-semibold tracking-normal">排班限制</h2>
                <p className="text-sm text-muted-foreground">
                  维护夜班/跨日班开关与不可排班日期，供排班矩阵校验引用。
                </p>
              </div>
              <EmployeeRestrictionsForm
                action={restrictionsAction}
                employeeId={employee.employee_id}
                nightShiftAllowed={employee.night_shift_allowed ?? true}
                crossDayAllowed={employee.cross_day_allowed ?? true}
                unavailableDates={employee.unavailable_dates ?? []}
              />
            </section>
          ) : null}

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
      size="sm"
      variant="ghost"
      className="px-2 text-primary hover:text-primary"
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}

function AgentFreezeDialog({
  summary,
  employee,
  action,
  returnPath,
}: {
  summary: MasterDataEntitySourceContext
  employee: MasterDataAgentManagementSummary["rows"][number]
  action: (formData: FormData) => Promise<void>
  returnPath: string
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
            <input type="hidden" name="return_path" value={returnPath} />
            <DialogFooter>
              <Button asChild size="sm" variant="outline">
                <Link href={returnPath}>取消</Link>
              </Button>
              <Button type="submit" size="sm" variant="destructive">
                确认冻结
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <Button asChild size="sm" variant="outline">
              <Link href={returnPath}>关闭</Link>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export function MasterDataAgentCreatePage({
  summary,
  error,
  feedback,
  action,
  returnPath,
}: {
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  action: (formData: FormData) => Promise<void>
  returnPath?: string
}) {
  return (
    <AgentFormPageShell error={error} feedback={feedback}>
      {summary.agentSubmitSourceBatchId ? (
        <AgentMaintenanceForm
          action={action}
          actionKey="create"
          sourceBatchId={summary.agentSubmitSourceBatchId}
          title="人员信息"
          description="填写人员账号、姓名、状态、人员类型、组织、职场和有效期。"
          submitLabel="提交新增"
          hiddenFields={returnPath ? { return_path: returnPath } : {}}
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
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  employee: MasterDataAgentManagementSummary["rows"][number] | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <AgentFormPageShell error={error} feedback={feedback}>
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
  summary: MasterDataEntitySourceContext
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  employee: MasterDataAgentManagementSummary["rows"][number] | null
  action: (formData: FormData) => Promise<void>
}) {
  return (
    <AgentFormPageShell error={error} feedback={feedback}>
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
  error,
  feedback,
  children,
}: {
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  children: React.ReactNode
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? (
        <MasterDataListError title="主数据来源读取失败" error={error} />
      ) : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-4">{children}</section>
    </main>
  )
}

function WorkplaceFormPageShell({
  error,
  feedback,
  children,
}: {
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  children: React.ReactNode
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? (
        <MasterDataListError title="职场来源读取失败" error={error} />
      ) : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-4">{children}</section>
    </main>
  )
}

function VendorFormPageShell({
  error,
  feedback,
  children,
}: {
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  children: React.ReactNode
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? (
        <MasterDataListError title="供应商来源读取失败" error={error} />
      ) : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-4">{children}</section>
    </main>
  )
}

function SkillFormPageShell({
  error,
  feedback,
  children,
}: {
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  children: React.ReactNode
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? (
        <MasterDataListError title="技能组来源读取失败" error={error} />
      ) : null}

      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-4">{children}</section>
    </main>
  )
}

function OrganizationFormPageShell({
  error,
  feedback,
  children,
}: {
  error: string | null
  feedback: MasterDataAgentMaintenanceFeedback | null
  children: React.ReactNode
}) {
  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? (
        <MasterDataListError title="组织来源读取失败" error={error} />
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

type WorkplaceMaintenanceField =
  | "workplace_id"
  | "reference_name"
  | "status"
  | "effective_from"
  | "effective_to"

function WorkplaceMaintenanceForm({
  action,
  actionKey,
  sourceBatchId,
  submitLabel,
  fields,
  hiddenFields = {},
  defaultValues = {},
}: {
  action: (formData: FormData) => Promise<void>
  actionKey: "create" | "edit"
  sourceBatchId: string
  submitLabel: string
  fields: WorkplaceMaintenanceField[]
  hiddenFields?: Record<string, string>
  defaultValues?: Partial<Record<WorkplaceMaintenanceField, string>>
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">职场信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3">
          <input type="hidden" name="action" value={actionKey} />
          <input type="hidden" name="source_batch_id" value={sourceBatchId} />
          {Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <div className="grid gap-3 md:grid-cols-2">
            {fields.includes("workplace_id") ? (
              <MaintenanceInput
                label="职场 ID"
                name="workplace_id"
                placeholder="SITE-001"
                defaultValue={defaultValues.workplace_id}
                required
              />
            ) : null}
            {fields.includes("reference_name") ? (
              <MaintenanceInput
                label="职场名称"
                name="reference_name"
                placeholder="输入职场名称"
                defaultValue={defaultValues.reference_name}
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
            {fields.includes("effective_from") ? (
              <MaintenanceInput
                label="生效开始"
                name="effective_from"
                type="date"
                defaultValue={defaultValues.effective_from}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("effective_to") ? (
              <MaintenanceInput
                label="生效结束"
                name="effective_to"
                type="date"
                defaultValue={defaultValues.effective_to}
                required={actionKey === "create"}
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

type VendorMaintenanceField =
  | "vendor_id"
  | "reference_name"
  | "status"
  | "effective_from"
  | "effective_to"

function VendorMaintenanceForm({
  action,
  actionKey,
  sourceBatchId,
  submitLabel,
  fields,
  hiddenFields = {},
  defaultValues = {},
}: {
  action: (formData: FormData) => Promise<void>
  actionKey: "create" | "edit"
  sourceBatchId: string
  submitLabel: string
  fields: VendorMaintenanceField[]
  hiddenFields?: Record<string, string>
  defaultValues?: Partial<Record<VendorMaintenanceField, string>>
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">供应商信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3">
          <input type="hidden" name="action" value={actionKey} />
          <input type="hidden" name="source_batch_id" value={sourceBatchId} />
          {Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <div className="grid gap-3 md:grid-cols-2">
            {fields.includes("vendor_id") ? (
              <MaintenanceInput
                label="供应商 ID"
                name="vendor_id"
                placeholder="SUP-001"
                defaultValue={defaultValues.vendor_id}
                required
              />
            ) : null}
            {fields.includes("reference_name") ? (
              <MaintenanceInput
                label="供应商名称"
                name="reference_name"
                placeholder="输入供应商名称"
                defaultValue={defaultValues.reference_name}
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
            {fields.includes("effective_from") ? (
              <MaintenanceInput
                label="生效开始"
                name="effective_from"
                type="date"
                defaultValue={defaultValues.effective_from}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("effective_to") ? (
              <MaintenanceInput
                label="生效结束"
                name="effective_to"
                type="date"
                defaultValue={defaultValues.effective_to}
                required={actionKey === "create"}
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

type SkillMaintenanceField =
  | "skill_id"
  | "reference_name"
  | "skill_category"
  | "status"
  | "effective_from"
  | "effective_to"

function SkillMaintenanceForm({
  action,
  actionKey,
  sourceBatchId,
  submitLabel,
  fields,
  hiddenFields = {},
  defaultValues = {},
}: {
  action: (formData: FormData) => Promise<void>
  actionKey: "create" | "edit"
  sourceBatchId: string
  submitLabel: string
  fields: SkillMaintenanceField[]
  hiddenFields?: Record<string, string>
  defaultValues?: Partial<Record<SkillMaintenanceField, string>>
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">技能组信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3">
          <input type="hidden" name="action" value={actionKey} />
          <input type="hidden" name="source_batch_id" value={sourceBatchId} />
          {Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <div className="grid gap-3 md:grid-cols-2">
            {fields.includes("skill_id") ? (
              <MaintenanceInput
                label="技能组 ID"
                name="skill_id"
                placeholder="SKILL-ONLINE-001"
                defaultValue={defaultValues.skill_id}
                required
              />
            ) : null}
            {fields.includes("reference_name") ? (
              <MaintenanceInput
                label="技能组名称"
                name="reference_name"
                placeholder="输入技能组名称"
                defaultValue={defaultValues.reference_name}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("skill_category") ? (
              <SkillCategorySelect
                label="归属属性"
                name="skill_category"
                defaultValue={defaultValues.skill_category}
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
            {fields.includes("effective_from") ? (
              <MaintenanceInput
                label="生效开始"
                name="effective_from"
                type="date"
                defaultValue={defaultValues.effective_from}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("effective_to") ? (
              <MaintenanceInput
                label="生效结束"
                name="effective_to"
                type="date"
                defaultValue={defaultValues.effective_to}
                required={actionKey === "create"}
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

type OrganizationMaintenanceField =
  | "organization_id"
  | "organization_name"
  | "organization_level"
  | "parent_organization_id"
  | "status"
  | "effective_from"
  | "effective_to"

function OrganizationMaintenanceEditor({
  action,
  actionKey,
  sourceBatchId,
  submitLabel,
  fields,
  hiddenFields = {},
  defaultValues = {},
}: {
  action: (formData: FormData) => Promise<void>
  actionKey: "create" | "edit"
  sourceBatchId: string
  submitLabel: string
  fields: OrganizationMaintenanceField[]
  hiddenFields?: Record<string, string>
  defaultValues?: Partial<Record<OrganizationMaintenanceField, string>>
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">组织信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3">
          <input type="hidden" name="action" value={actionKey} />
          <input type="hidden" name="source_batch_id" value={sourceBatchId} />
          {Object.entries(hiddenFields).map(([name, value]) => (
            <input key={name} type="hidden" name={name} value={value} />
          ))}
          <div className="grid gap-3 md:grid-cols-2">
            {fields.includes("organization_id") ? (
              <MaintenanceInput
                label="组织 ID"
                name="organization_id"
                placeholder="ORG-RETURN"
                defaultValue={defaultValues.organization_id}
                required
              />
            ) : null}
            {fields.includes("organization_name") ? (
              <MaintenanceInput
                label="组织名称"
                name="organization_name"
                placeholder="输入组织名称"
                defaultValue={defaultValues.organization_name}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("organization_level") ? (
              <MaintenanceInput
                label="组织层级"
                name="organization_level"
                type="number"
                placeholder="1"
                defaultValue={defaultValues.organization_level}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("parent_organization_id") ? (
              <MaintenanceInput
                label="上级组织 ID"
                name="parent_organization_id"
                placeholder="一级组织可留空"
                defaultValue={defaultValues.parent_organization_id}
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
            {fields.includes("effective_from") ? (
              <MaintenanceInput
                label="生效开始"
                name="effective_from"
                type="date"
                defaultValue={defaultValues.effective_from}
                required={actionKey === "create"}
              />
            ) : null}
            {fields.includes("effective_to") ? (
              <MaintenanceInput
                label="生效结束"
                name="effective_to"
                type="date"
                defaultValue={defaultValues.effective_to}
                required={actionKey === "create"}
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

function AgentMaintenanceFeedbackCard({
  feedback,
}: {
  feedback: MasterDataAgentMaintenanceFeedback
}) {
  const isError = feedback.tone === "error"

  return (
    <Alert variant={isError ? "destructive" : "default"}>
      {isError ? <AlertTriangle /> : <CheckCircle2 />}
      <AlertTitle>{feedback.title}</AlertTitle>
      <AlertDescription>{feedback.detail}</AlertDescription>
    </Alert>
  )
}

function AgentSkillMaintenanceSection({
  summary,
  action,
  selectedEmployeeId = "",
}: {
  summary: MasterDataEntitySourceContext
  action: (formData: FormData) => Promise<void>
  selectedEmployeeId?: string
}) {
  if (!summary.agentSubmitSourceBatchId) {
    return null
  }

  return (
    <section>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">技能组</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="grid gap-3">
            <input
              type="hidden"
              name="source_batch_id"
              value={summary.agentSubmitSourceBatchId}
            />
            <p className="text-sm text-muted-foreground">
              多个技能 ID 用逗号或换行分隔，提交后替换该坐席当前技能全集。来源批次{" "}
              <span className="font-mono text-foreground">
                {summary.agentSubmitSourceBatchId}
              </span>
              。
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

function WorkplaceServiceTeamMaintenanceForm({
  action,
  actionKey,
  sourceBatchId,
  workplaceId,
  submitLabel,
  showServiceTeamId = false,
  hiddenServiceTeamId,
  defaultValues = {},
}: {
  action: (formData: FormData) => Promise<void>
  actionKey: "create" | "edit"
  sourceBatchId: string
  workplaceId: string
  submitLabel: string
  showServiceTeamId?: boolean
  hiddenServiceTeamId?: string
  defaultValues?: Partial<{
    team_type: MasterDataWorkplaceServiceTeamType
    team_name: string
    organization_id: string
    supplier_id: string
    status: string
    effective_from: string
    effective_to: string
  }>
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">服务团队信息</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="grid gap-3">
          <input type="hidden" name="action" value={actionKey} />
          <input type="hidden" name="source_batch_id" value={sourceBatchId} />
          <input type="hidden" name="workplace_id" value={workplaceId} />
          {hiddenServiceTeamId ? (
            <input
              type="hidden"
              name="service_team_id"
              value={hiddenServiceTeamId}
            />
          ) : null}
          <div className="grid gap-3 md:grid-cols-2">
            {showServiceTeamId ? (
              <MaintenanceInput
                label="服务团队 ID"
                name="service_team_id"
                placeholder="TEAM-SH-001"
                required
              />
            ) : null}
            <ServiceTeamTypeSelect
              label="团队类型"
              name="team_type"
              defaultValue={defaultValues.team_type}
              required={actionKey === "create"}
            />
            <MaintenanceInput
              label="服务团队名称"
              name="team_name"
              placeholder="集中退换小组"
              defaultValue={defaultValues.team_name}
              required={actionKey === "create"}
            />
            <MaintenanceInput
              label="组织 ID（自有团队）"
              name="organization_id"
              placeholder="ORG-RETURN"
              defaultValue={defaultValues.organization_id}
            />
            <MaintenanceInput
              label="供应商 ID（供应商团队）"
              name="supplier_id"
              placeholder="SUP-001"
              defaultValue={defaultValues.supplier_id}
            />
            <MaintenanceSelect
              label="状态"
              name="status"
              defaultValue={defaultValues.status}
              required={actionKey === "create"}
            />
            <MaintenanceInput
              label="生效开始"
              name="effective_from"
              type="date"
              defaultValue={defaultValues.effective_from}
              required={actionKey === "create"}
            />
            <MaintenanceInput
              label="生效结束"
              name="effective_to"
              type="date"
              defaultValue={defaultValues.effective_to}
              required={actionKey === "create"}
            />
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

type AgentMaintenanceField =
  | "employee_id"
  | "employee_name"
  | "reference_id"
  | "reference_name"
  | "supplier_id"
  | "workplace_id"
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
        <option value="active">正常</option>
        <option value="inactive">停用</option>
        <option value="frozen">冻结</option>
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

function ServiceTeamTypeSelect({
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
        <option value="internal">自有团队</option>
        <option value="supplier">供应商团队</option>
      </select>
    </label>
  )
}

function SkillCategorySelect({
  label,
  name,
  defaultValue = "online",
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
        <option value="online">在线技能组</option>
        <option value="hotline">热线技能组</option>
        <option value="ticket">工单技能组</option>
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
