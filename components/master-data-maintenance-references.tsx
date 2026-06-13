import Link from "next/link"
import {
  type MasterDataAgentMaintenanceFeedback,
  type MasterDataEntitySourceContext,
  type MasterDataOrganizationManagementSummary,
  type MasterDataOrganizationListViewRow,
  type MasterDataReferenceManagementSummary,
  type MasterDataReferenceListViewRow,
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
  MasterDataListError,
  AgentMaintenanceFeedbackCard,
  MetricCard,
} from "./master-data-maintenance-fields"

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
