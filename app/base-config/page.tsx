import { AppShell } from "@/components/app-shell"
import { ImportTaskDialog } from "@/components/import-task-dialog"
import {
  MasterDataAgentManagementPage,
  MasterDataAgentPageActions,
} from "@/components/master-data-maintenance-workbench"
import {
  type MasterDataAgentManagementFilters,
  summarizeMasterDataAgentManagement,
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceFeedback,
} from "@/components/master-data-maintenance-model"
import {
  fetchImportBatches,
  fetchImportFieldMappingTemplates,
  fetchMasterDataEmployees,
} from "@/app/master-data/agents/data"
import { submitMasterDataAgentMaintenance } from "@/app/master-data/[entityKey]/actions"
import { uploadImportCsvAction } from "@/app/data-quality/actions"
import {
  submitShiftDefinition,
  submitStatusMappings,
} from "@/app/base-config/actions"
import { fetchShiftDefinitions, fetchStatusMappings } from "@/lib/base-config"
import {
  groupShiftDefinitionVersions,
  summarizeShiftFeedback,
} from "@/components/base-config/shift-activity-model"
import { ShiftActivityWorkbench } from "@/components/base-config/shift-activity-workbench"
import { summarizeStatusMappingFeedback } from "@/components/base-config/status-mapping-model"
import { StatusMappingWorkbench } from "@/components/base-config/status-mapping-workbench"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { summarizeImportTaskDialog } from "@/lib/import-task-model"

export const dynamic = "force-dynamic"

type BaseConfigTab = "employees" | "shifts" | "status-mappings"

// 四标签壳：第三标签待后续阶段并入，暂不渲染占位标签。
const baseConfigTabs: { value: BaseConfigTab; label: string }[] = [
  { value: "employees", label: "员工与技能" },
  { value: "shifts", label: "班次与活动" },
  { value: "status-mappings", label: "状态映射" },
]

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function resolveBaseConfigTab(value: string): BaseConfigTab {
  const knownTabs: BaseConfigTab[] = ["employees", "shifts", "status-mappings"]

  return knownTabs.includes(value as BaseConfigTab)
    ? (value as BaseConfigTab)
    : "employees"
}

export default async function BaseConfigPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const activeTab = resolveBaseConfigTab(
    getSingleSearchParam(resolvedSearchParams.tab)
  )
  const batchResult = await fetchImportBatches()
  const employeeResult = await fetchMasterDataEmployees()
  const templateResult = await fetchImportFieldMappingTemplates()
  const shiftResult = await fetchShiftDefinitions()
  const statusMappingResult = await fetchStatusMappings()
  const shiftGroups = groupShiftDefinitionVersions(shiftResult.data ?? [])
  const shiftFeedback = summarizeShiftFeedback(resolvedSearchParams)
  const statusMappingFeedback = summarizeStatusMappingFeedback(resolvedSearchParams)
  const editingShiftCode = getSingleSearchParam(resolvedSearchParams.shift_edit)
  const summary = summarizeMasterDataEntitySourceContext(
    "agents",
    batchResult.data ?? []
  )
  const feedback = summarizeMasterDataMaintenanceFeedback(resolvedSearchParams)
  const agentManagementSummary = summarizeMasterDataAgentManagement(
    employeeResult.data ?? [],
    resolveAgentManagementFilters(resolvedSearchParams),
    {
      batches: batchResult.data ?? [],
      templates: templateResult.data ?? [],
      uploadStatus: getSingleSearchParam(resolvedSearchParams.upload),
      uploadReason: getSingleSearchParam(resolvedSearchParams.reason),
      uploadBatchId: getSingleSearchParam(resolvedSearchParams.batch),
    },
    // 宿主页列表路径：冻结/新建/导入/维护提交的回跳均留在本页员工标签。
    { hostListPath: "/base-config?tab=employees" }
  )
  const selectedFreezeEmployeeId = getSingleSearchParam(
    resolvedSearchParams.freeze_employee_id
  )
  const importDialogOpen =
    getSingleSearchParam(resolvedSearchParams.import_dialog) === "1" ||
    Boolean(getSingleSearchParam(resolvedSearchParams.upload))
  // 统一导入向导（主数据变体）：result_redirect_to 指向本页员工标签。
  const importTaskDialog = summarizeImportTaskDialog({
    variant: "master-data",
    routePrefix: "/base-config?tab=employees",
    batches: batchResult.data ?? [],
    templates: templateResult.data ?? [],
    uploadStatus: getSingleSearchParam(resolvedSearchParams.upload),
    uploadReason: getSingleSearchParam(resolvedSearchParams.reason),
    uploadBatchId: getSingleSearchParam(resolvedSearchParams.batch),
  })

  return (
    <AppShell
      title="基础配置"
      breadcrumbItems={[{ label: "基础配置" }]}
      actions={<MasterDataAgentPageActions summary={agentManagementSummary} />}
    >
      <Tabs defaultValue={activeTab} className="min-h-0 flex-1">
        <TabsList className="mx-3 mt-3 shrink-0 lg:mx-4">
          {baseConfigTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent
          value="employees"
          className="flex min-h-0 flex-1 flex-col"
        >
          <MasterDataAgentManagementPage
            summary={summary}
            managementSummary={agentManagementSummary}
            error={batchResult.error}
            templateError={templateResult.error}
            feedback={feedback}
            employeeListError={employeeResult.error}
            importDialogOpen={importDialogOpen}
            selectedFreezeEmployeeId={selectedFreezeEmployeeId}
            agentSubmitAction={submitMasterDataAgentMaintenance}
            importDialogOverride={
              importDialogOpen ? (
                <ImportTaskDialog
                  dialog={importTaskDialog}
                  templateError={templateResult.error}
                  action={uploadImportCsvAction}
                />
              ) : null
            }
          />
        </TabsContent>
        <TabsContent value="shifts" className="flex min-h-0 flex-1 flex-col">
          <ShiftActivityWorkbench
            groups={shiftGroups}
            error={shiftResult.error}
            feedback={shiftFeedback}
            editingShiftCode={editingShiftCode}
            submitAction={submitShiftDefinition}
          />
        </TabsContent>
        <TabsContent
          value="status-mappings"
          className="flex min-h-0 flex-1 flex-col"
        >
          <StatusMappingWorkbench
            items={statusMappingResult.data ?? []}
            error={statusMappingResult.error}
            feedback={statusMappingFeedback}
            submitAction={submitStatusMappings}
          />
        </TabsContent>
      </Tabs>
    </AppShell>
  )
}

function resolveAgentManagementFilters(
  searchParams: Record<string, string | string[] | undefined>
): MasterDataAgentManagementFilters {
  return {
    employee_name: getSingleSearchParam(searchParams.employee_name),
    skill_group: getSingleSearchParam(searchParams.skill_group),
    employee_id: getSingleSearchParam(searchParams.employee_id),
    status: getSingleSearchParam(searchParams.status),
    organization: getSingleSearchParam(searchParams.organization),
    workplace: getSingleSearchParam(searchParams.workplace),
    employee_type: getSingleSearchParam(searchParams.employee_type),
  }
}

function getSingleSearchParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}
