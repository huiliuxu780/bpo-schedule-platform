import Link from "next/link"
import { MasterDataOrganizationTable } from "@/components/master-data-organization-table"
import { MasterDataReferenceTable } from "@/components/master-data-reference-table"
import {
  type MasterDataAgentMaintenanceFeedback,
  type MasterDataEntitySourceContext,
  type MasterDataOrganizationManagementSummary,
  type MasterDataOrganizationListViewRow,
  type MasterDataReferenceManagementSummary,
  type MasterDataReferenceListViewRow,
} from "@/components/master-data-maintenance-model"
import { MetricCard } from "@/components/metric-card"
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
  MasterDataListError,
  AgentMaintenanceFeedbackCard,
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
  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {error ? <MasterDataListError title={`${listSummary.title}列表读取失败`} error={error} /> : null}
      {feedback ? <AgentMaintenanceFeedbackCard feedback={feedback} /> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="记录数"
          value={listSummary.totalRecords.toLocaleString("zh-CN")}
          description={summary.sourceVersionLabel}
        />
        <MetricCard
          title="生效"
          value={listSummary.activeRecords.toLocaleString("zh-CN")}
          description="当前可引用记录"
        />
        <MetricCard
          title="冻结"
          value={listSummary.frozenRecords.toLocaleString("zh-CN")}
          description="不可继续引用记录"
        />
        <MetricCard
          title="维护对象"
          value={listSummary.title}
          description="主数据引用表"
        />
      </section>

      <MasterDataReferenceTable title={listSummary.title} rows={listSummary.rows} />

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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="记录数"
          value={listSummary.totalRecords.toLocaleString("zh-CN")}
          description={summary.sourceVersionLabel}
        />
        <MetricCard
          title="生效"
          value={listSummary.activeRecords.toLocaleString("zh-CN")}
          description="当前可引用组织"
        />
        <MetricCard
          title="冻结"
          value={listSummary.frozenRecords.toLocaleString("zh-CN")}
          description="不可继续引用组织"
        />
        <MetricCard
          title="维护对象"
          value={listSummary.title}
          description="组织层级表"
        />
      </section>

      <MasterDataOrganizationTable rows={listSummary.rows} />
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
