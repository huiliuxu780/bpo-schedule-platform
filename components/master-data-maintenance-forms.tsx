import { Send } from "lucide-react"
import {
  type MasterDataAgentMaintenanceFeedback,
  type MasterDataAgentManagementSummary,
  type MasterDataEntitySourceContext,
  type MasterDataOrganizationListViewRow,
  type MasterDataReferenceListViewRow,
  type MasterDataWorkplaceServiceTeamRow,
  type MasterDataWorkplaceServiceTeamType,
} from "@/components/master-data-maintenance-model"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  MasterDataListError,
  AgentFormBlockedState,
  AgentMaintenanceFeedbackCard,
  MaintenanceInput,
  MaintenanceTextarea,
  MaintenanceSelect,
  EmployeeTypeSelect,
  ServiceTeamTypeSelect,
  SkillCategorySelect,
} from "./master-data-maintenance-fields"

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

export function MasterDataAgentCreatePage({
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
    <AgentFormPageShell error={error} feedback={feedback}>
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
