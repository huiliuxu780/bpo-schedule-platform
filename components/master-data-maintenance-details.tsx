import Link from "next/link"
import {
  Eye,
  Pencil,
  Snowflake,
} from "lucide-react"
import {
  type MasterDataAgentMaintenanceFeedback,
  type MasterDataEntitySourceContext,
  type MasterDataOrganizationDetailSummary,
  type MasterDataSkillDetailSummary,
  type MasterDataVendorDetailSummary,
  type MasterDataWorkplaceDetailSummary,
  type MasterDataWorkplaceOperatorViewRow,
  type MasterDataWorkplaceServiceTeamPeopleSummary,
  type MasterDataWorkplaceServiceTeamRow,
} from "@/components/master-data-maintenance-model"
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
