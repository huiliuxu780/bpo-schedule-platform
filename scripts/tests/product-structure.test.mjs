import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

const appRootPath = new URL("../../app/", import.meta.url);
const componentsRootPath = new URL("../../components/", import.meta.url);
const appSidebarPath = new URL("../../components/app-sidebar.tsx", import.meta.url);
const appShellPath = new URL("../../components/app-shell.tsx", import.meta.url);
const siteHeaderPath = new URL("../../components/site-header.tsx", import.meta.url);
const masterDataEntityPagePath = new URL("../../app/master-data/[entityKey]/page.tsx", import.meta.url);
const masterDataAgentDetailPagePath = new URL("../../app/master-data/agents/[employeeId]/page.tsx", import.meta.url);
const masterDataAgentDataPath = new URL("../../app/master-data/agents/data.ts", import.meta.url);
const masterDataWorkplaceDetailPagePath = new URL("../../app/master-data/sites/[workplaceId]/page.tsx", import.meta.url);
const masterDataWorkplaceCreatePagePath = new URL("../../app/master-data/sites/new/page.tsx", import.meta.url);
const masterDataWorkplaceEditPagePath = new URL("../../app/master-data/sites/[workplaceId]/edit/page.tsx", import.meta.url);
const masterDataWorkplaceServiceTeamCreatePagePath = new URL("../../app/master-data/sites/[workplaceId]/service-teams/new/page.tsx", import.meta.url);
const masterDataWorkplaceServiceTeamDetailPagePath = new URL("../../app/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]/page.tsx", import.meta.url);
const masterDataWorkplaceServiceTeamEditPagePath = new URL("../../app/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]/edit/page.tsx", import.meta.url);
const masterDataWorkplaceServiceTeamActionsPath = new URL("../../app/master-data/sites/[workplaceId]/service-teams/actions.ts", import.meta.url);
const masterDataVendorDetailPagePath = new URL("../../app/master-data/vendors/[vendorId]/page.tsx", import.meta.url);
const masterDataVendorCreatePagePath = new URL("../../app/master-data/vendors/new/page.tsx", import.meta.url);
const masterDataVendorEditPagePath = new URL("../../app/master-data/vendors/[vendorId]/edit/page.tsx", import.meta.url);
const masterDataSkillCreatePagePath = new URL("../../app/master-data/skills/new/page.tsx", import.meta.url);
const masterDataSkillDetailPagePath = new URL("../../app/master-data/skills/[skillId]/page.tsx", import.meta.url);
const masterDataSkillEditPagePath = new URL("../../app/master-data/skills/[skillId]/edit/page.tsx", import.meta.url);
const masterDataOrganizationCreatePagePath = new URL("../../app/master-data/organizations/new/page.tsx", import.meta.url);
const masterDataOrganizationDetailPagePath = new URL("../../app/master-data/organizations/[organizationId]/page.tsx", import.meta.url);
const masterDataOrganizationEditPagePath = new URL("../../app/master-data/organizations/[organizationId]/edit/page.tsx", import.meta.url);
const demandForecastProductionPagePath = new URL("../../app/demand-plans/production/page.tsx", import.meta.url);
const personnelScheduleProductionPagePath = new URL("../../app/schedule-plans/production/page.tsx", import.meta.url);
const actualLogProductionPagePath = new URL("../../app/actual-logs/production/page.tsx", import.meta.url);
const dataQualityBatchPagePath = new URL("../../app/data-quality/[batchId]/page.tsx", import.meta.url);
const dataQualityVersionsPagePath = new URL("../../app/data-quality/versions/page.tsx", import.meta.url);
const dataQualityReviewCasesPagePath = new URL("../../app/data-quality/review-cases/page.tsx", import.meta.url);
const dataQualityReviewCaseDetailPagePath = new URL("../../app/data-quality/review-cases/[caseId]/page.tsx", import.meta.url);
const dataQualityComparisonRunPagePath = new URL("../../app/data-quality/comparison-runs/[runId]/page.tsx", import.meta.url);
const dataQualityTemplateDetailPagePath = new URL("../../app/data-quality/field-mapping-templates/[templateId]/page.tsx", import.meta.url);
const dataQualityUploadPagePath = new URL("../../app/data-quality/uploads/new/page.tsx", import.meta.url);
const demandForecastProductionWorkbenchPath = new URL("../../components/demand-forecast-production-workbench.tsx", import.meta.url);
const personnelScheduleProductionWorkbenchPath = new URL("../../components/personnel-schedule-production-workbench.tsx", import.meta.url);
const actualLogProductionWorkbenchPath = new URL("../../components/actual-log-production-workbench.tsx", import.meta.url);
const importCenterBatchListPanelPath = new URL("../../components/import-center-batch-list-panel.tsx", import.meta.url);
const masterDataActionsPath = new URL("../../app/master-data/[entityKey]/actions.ts", import.meta.url);
const masterDataModelPath = new URL("../../components/master-data-maintenance-model.ts", import.meta.url);
const masterDataWorkbenchPath = new URL("../../components/master-data-maintenance-workbench.tsx", import.meta.url);
const masterDataAgentImportDialogPath = new URL("../../components/master-data-agent-import-dialog.tsx", import.meta.url);
const demandForecastImportDialogPath = new URL("../../components/demand-forecast-import-dialog.tsx", import.meta.url);
const personnelScheduleImportDialogPath = new URL("../../components/personnel-schedule-import-dialog.tsx", import.meta.url);
const actualLogImportDialogPath = new URL("../../components/actual-log-import-dialog.tsx", import.meta.url);
const uiAlertPath = new URL("../../components/ui/alert.tsx", import.meta.url);
const uiAvatarPath = new URL("../../components/ui/avatar.tsx", import.meta.url);
const uiBreadcrumbPath = new URL("../../components/ui/breadcrumb.tsx", import.meta.url);
const uiCollapsiblePath = new URL("../../components/ui/collapsible.tsx", import.meta.url);
const uiDialogPath = new URL("../../components/ui/dialog.tsx", import.meta.url);

async function collectSourceFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryUrl = new URL(entry.name, directoryUrl);

    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(new URL(`${entry.name}/`, directoryUrl)));
      continue;
    }

    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      const entryStat = await stat(entryUrl);
      if (entryStat.isFile()) {
        files.push(entryUrl);
      }
    }
  }

  return files;
}

test("production child routes use business object wording instead of production module wording", async () => {
  const pageExpectations = [
    {
      source: await readFile(demandForecastProductionPagePath, "utf8"),
      forbidden: ['title="预测生产"'],
      required: ['title="预测版本"'],
    },
    {
      source: await readFile(personnelScheduleProductionPagePath, "utf8"),
      forbidden: ['title="排班生产"'],
      required: ['title="排班版本"'],
    },
    {
      source: await readFile(actualLogProductionPagePath, "utf8"),
      forbidden: ['title="登录/状态日志生产"'],
      required: ['title="登录/状态日志"'],
    },
  ];
  const workbenchExpectations = [
    {
      source: await readFile(demandForecastProductionWorkbenchPath, "utf8"),
      forbidden: ["预测生产", "需求预测生产台账", "返回预测生产"],
      required: ["预测版本", "预测版本列表", "返回需求计划"],
    },
    {
      source: await readFile(personnelScheduleProductionWorkbenchPath, "utf8"),
      forbidden: ["排班生产", "人员排班生产台账", "返回排班生产", "生产版本"],
      required: ["排班版本", "排班版本列表", "返回排班计划"],
    },
    {
      source: await readFile(actualLogProductionWorkbenchPath, "utf8"),
      forbidden: ["登录/状态日志生产", "登录/状态日志生产台账", "返回日志生产"],
      required: ["登录/状态日志", "日志处理列表", "返回登录/状态日志"],
    },
  ];

  for (const { source, forbidden, required } of [...pageExpectations, ...workbenchExpectations]) {
    for (const phrase of forbidden) {
      assert.equal(source.includes(phrase), false, phrase);
    }

    for (const phrase of required) {
      assert.equal(source.includes(phrase), true, phrase);
    }
  }
});

test("master data visible terminology does not expose operating subject concepts", async () => {
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const agentDataSource = await readFile(masterDataAgentDataPath, "utf8");
  const visibleMasterDataSources = [
    ["master data workbench", workbenchSource],
    ["master data data loader", agentDataSource],
  ];

  for (const [label, source] of visibleMasterDataSources) {
    assert.equal(
      source.includes("职场运营主体"),
      false,
      `${label} should not expose workplace operating subject wording`,
    );
    assert.equal(
      source.includes("运营主体"),
      false,
      `${label} should not expose operating subject wording`,
    );
  }

  assert.equal(
    workbenchSource.includes("服务团队"),
    true,
    "workplace detail should describe self-owned and supplier teams as service teams",
  );
});

test("workplace detail keeps service-team maintenance nested under workplace detail", async () => {
  await access(masterDataWorkplaceServiceTeamCreatePagePath);
  await access(masterDataWorkplaceServiceTeamDetailPagePath);
  await access(masterDataWorkplaceServiceTeamEditPagePath);
  await access(masterDataWorkplaceServiceTeamActionsPath);

  const workplaceDetailSource = await readFile(masterDataWorkplaceDetailPagePath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const workplaceDetailComponentSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataWorkplaceDetailPage"),
    workbenchSource.indexOf("export function MasterDataWorkplaceCreatePage"),
  );

  assert.equal(
    workplaceDetailSource.includes('fetchMasterDataReferences("vendors")'),
    true,
    "workplace detail should read supplier master data for supplier service teams",
  );
  assert.equal(
    workplaceDetailComponentSource.includes("人员/绑定数"),
    true,
    "workplace service-team table should show aggregated people or binding counts",
  );
  assert.equal(
    workplaceDetailSource.includes("fetchMasterDataWorkplaceServiceTeams"),
    true,
    "workplace detail should fetch maintained service-team records",
  );
  assert.equal(
    workbenchSource.includes("新增服务团队"),
    true,
    "workplace detail should provide a page action to the nested create page",
  );
  assert.equal(
    workplaceDetailComponentSource.includes("冻结服务团队"),
    true,
    "service-team freeze should use a dialog in the workplace detail context",
  );
  assert.equal(
    workplaceDetailComponentSource.includes("查看"),
    true,
    "workplace service-team table should link to the nested service-team detail page",
  );
  assert.equal(
    workbenchSource.includes("MasterDataWorkplaceServiceTeamDetailPage"),
    true,
    "workplace service-team detail should be rendered by a dedicated page component",
  );
  const serviceTeamDetailSource = await readFile(masterDataWorkplaceServiceTeamDetailPagePath, "utf8");
  assert.equal(
    serviceTeamDetailSource.includes("fetchMasterDataEmployees"),
    true,
    "service-team detail should read employees for the associated people list",
  );
  assert.equal(
    serviceTeamDetailSource.includes("fetchMasterDataWorkplaceBindings"),
    true,
    "service-team detail should read workplace bindings for supplier-team people",
  );
  assert.equal(
    workbenchSource.includes("关联人员"),
    true,
    "service-team detail should render a read-only associated people section",
  );
  assert.equal(workplaceDetailComponentSource.includes("合同"), false);
  assert.equal(workplaceDetailComponentSource.includes("结算"), false);
  assert.equal(workplaceDetailComponentSource.includes("最低人力"), false);
  assert.equal(workbenchSource.includes("createServiceTeamHref"), true);
  assert.equal(workplaceDetailComponentSource.includes("<form"), true);
});

test("vendor service context stays nested under vendor detail", async () => {
  await access(masterDataVendorDetailPagePath);
  const vendorDetailSource = await readFile(masterDataVendorDetailPagePath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");

  assert.equal(
    vendorDetailSource.includes("fetchMasterDataWorkplaceServiceTeams"),
    true,
    "vendor detail should read maintained service teams for reverse supplier links",
  );
  assert.equal(
    workbenchSource.includes("查看团队"),
    true,
    "vendor detail should link to existing workplace service-team details",
  );

  const sourceFiles = [
    ...await collectSourceFiles(appRootPath),
    ...await collectSourceFiles(componentsRootPath),
  ];

  for (const fileUrl of sourceFiles) {
    const source = await readFile(fileUrl, "utf8");

    assert.equal(source.includes("供应商合同"), false, fileUrl.pathname);
    assert.equal(source.includes("结算比例"), false, fileUrl.pathname);
    assert.equal(source.includes("最低人力"), false, fileUrl.pathname);
  }
});

test("skill maintenance uses child pages and a freeze dialog instead of list-page forms", async () => {
  await access(masterDataSkillCreatePagePath);
  await access(masterDataSkillEditPagePath);

  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const modelSource = await readFile(masterDataModelPath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const createPageSource = await readFile(masterDataSkillCreatePagePath, "utf8");
  const editPageSource = await readFile(masterDataSkillEditPagePath, "utf8");
  const referenceListSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataReferenceManagementPage"),
    workbenchSource.indexOf("export function MasterDataWorkplaceDetailPage"),
  );

  assert.equal(entitySource.includes("MasterDataSkillPageActions"), true);
  assert.equal(entitySource.includes("freeze_skill_id"), true);
  assert.equal(entitySource.includes("submitMasterDataSkillMaintenance"), true);
  assert.equal(actionsSource.includes("submitMasterDataSkillMaintenance"), true);
  assert.equal(actionsSource.includes("parseSkillAction"), true);
  assert.equal(modelSource.includes("buildMasterDataSkillMaintenancePayload"), true);
  assert.equal(modelSource.includes("skillSubmitSourceBatchId"), true);
  assert.equal(referenceListSource.includes("MasterDataSkillFreezeDialog"), true);
  assert.equal(referenceListSource.includes("<DialogContent"), true);
  assert.equal(referenceListSource.includes("SkillMaintenanceForm"), false);
  assert.equal(createPageSource.includes("MasterDataSkillCreatePage"), true);
  assert.equal(editPageSource.includes("MasterDataSkillEditPage"), true);
  assert.equal(editPageSource.includes("notFound()"), true);
});

test("master data reference detail actions use a consistent view label", async () => {
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const referenceListSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataReferenceManagementPage"),
    workbenchSource.indexOf("export function MasterDataWorkplaceDetailPage"),
  );

  assert.equal(
    referenceListSource.includes(">详情</Link>"),
    false,
    "reference master-data rows should not mix 详情 with the established 查看 row action label",
  );
  assert.equal(
    referenceListSource.includes(">查看</Link>"),
    true,
    "reference master-data rows should expose the detail link as 查看",
  );
});

test("agent detail stays under customer-service personnel context", async () => {
  await access(masterDataAgentDetailPagePath);
  const agentDetailSource = await readFile(masterDataAgentDetailPagePath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");

  assert.equal(
    agentDetailSource.includes("fetchMasterDataWorkplaceServiceTeams"),
    true,
    "agent detail should read workplace service teams for read-only relationship context",
  );
  assert.equal(
    agentDetailSource.includes("fetchMasterDataWorkplaceBindings"),
    true,
    "agent detail should read workplace bindings for supplier-team matching",
  );
  assert.equal(
    workbenchSource.includes("MasterDataAgentDetailPage"),
    true,
    "agent detail should render through a dedicated personnel detail component",
  );
  assert.equal(
    workbenchSource.includes("关联服务团队"),
    true,
    "agent detail should expose a read-only associated service-team section",
  );
  assert.equal(agentDetailSource.includes("合同"), false);
  assert.equal(agentDetailSource.includes("结算"), false);
  assert.equal(agentDetailSource.includes("最低人力"), false);
});

test("organization detail stays read-only under organization context", async () => {
  await access(masterDataOrganizationDetailPagePath);
  const organizationDetailSource = await readFile(masterDataOrganizationDetailPagePath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");

  assert.equal(
    organizationDetailSource.includes("fetchMasterDataOrganizations"),
    true,
    "organization detail should read organization rows for read-only hierarchy context",
  );
  assert.equal(
    organizationDetailSource.includes("fetchMasterDataEmployees"),
    true,
    "organization detail should read personnel rows for current people context",
  );
  assert.equal(
    workbenchSource.includes("MasterDataOrganizationDetailPage"),
    true,
    "organization detail should render through a dedicated organization detail component",
  );
  assert.equal(
    workbenchSource.includes("直接下级组织"),
    true,
    "organization detail should expose direct child organizations",
  );
  assert.equal(
    workbenchSource.includes("归属人员"),
    true,
    "organization detail should expose current people under the organization",
  );
  assert.equal(organizationDetailSource.includes("合同"), false);
  assert.equal(organizationDetailSource.includes("结算"), false);
  assert.equal(organizationDetailSource.includes("最低人力"), false);
});

test("skill detail stays read-only under skill context", async () => {
  await access(masterDataSkillDetailPagePath);
  const skillDetailSource = await readFile(masterDataSkillDetailPagePath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");

  assert.equal(
    skillDetailSource.includes("fetchMasterDataSkills"),
    true,
    "skill detail should read skill rows for read-only skill context",
  );
  assert.equal(
    skillDetailSource.includes("fetchMasterDataEmployees"),
    true,
    "skill detail should read personnel rows for current people context",
  );
  assert.equal(
    workbenchSource.includes("MasterDataSkillDetailPage"),
    true,
    "skill detail should render through a dedicated skill detail component",
  );
  assert.equal(
    workbenchSource.includes("技能组信息"),
    true,
    "skill detail should expose skill basic information",
  );
  assert.equal(
    workbenchSource.includes("拥有该技能的客服人员"),
    true,
    "skill detail should expose people who own the skill",
  );
  assert.equal(skillDetailSource.includes("合同"), false);
  assert.equal(skillDetailSource.includes("结算"), false);
  assert.equal(skillDetailSource.includes("最低人力"), false);
});

test("agent list keeps page actions and filter actions in their own zones", async () => {
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const agentListSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataAgentManagementPage"),
    workbenchSource.indexOf("export function MasterDataReferenceManagementPage"),
  );
  const filterSource = workbenchSource.slice(
    workbenchSource.indexOf("function AgentManagementFilterPanel"),
    workbenchSource.indexOf("function AgentManagementFilterField"),
  );
  const toolbarSource = workbenchSource.slice(
    workbenchSource.indexOf("function AgentManagementListToolbar"),
    workbenchSource.indexOf("function AgentManagementFilterField"),
  );
  const tablePanelSource = workbenchSource.slice(
    workbenchSource.indexOf("function AgentManagementTablePanel"),
    workbenchSource.indexOf("function AgentRowActionLink"),
  );
  const filterCallIndex = agentListSource.indexOf("<AgentManagementFilterPanel");
  const toolbarCallIndex = agentListSource.indexOf("<AgentManagementListToolbar");
  const tableCallIndex = agentListSource.indexOf("<AgentManagementTablePanel");

  assert.equal(
    entitySource.includes("actions={"),
    true,
    "agent page-level actions should be passed to the shared SiteHeader slot",
  );
  assert.equal(
    entitySource.includes("<MasterDataAgentPageActions"),
    true,
    "agent create/import actions should live in the page header actions slot",
  );
  assert.equal(
    filterCallIndex > -1 && toolbarCallIndex > filterCallIndex,
    true,
    "agent filter panel should render above the list toolbar",
  );
  assert.equal(
    toolbarCallIndex > -1 && tableCallIndex > toolbarCallIndex,
    true,
    "agent list toolbar should sit directly above the table panel",
  );
  assert.equal(
    toolbarSource.includes("justify-start"),
    true,
    "agent list toolbar should only align selected/bulk actions",
  );
  assert.equal(
    toolbarSource.includes("summary.bulkActions.map"),
    true,
    "agent bulk actions should live in the shared list toolbar",
  );
  assert.equal(
    toolbarSource.includes("summary.createHref"),
    false,
    "agent page create action should not live in the list toolbar",
  );
  assert.equal(
    toolbarSource.includes("summary.importDialog.openHref"),
    false,
    "agent page import action should not live in the list toolbar",
  );
  assert.equal(
    tablePanelSource.includes("summary.bulkActions.map"),
    false,
    "agent table panel should not own bulk actions",
  );
  assert.equal(
    filterSource.includes('action="/master-data/agents"'),
    true,
    "filter actions should remain inside the agent filter form",
  );
  assert.equal(
    filterSource.includes("justify-end"),
    true,
    "agent filter submit/reset actions should align to the lower right of the filter panel",
  );
  assert.equal(
    filterSource.includes("lg:pl-[6.5rem]"),
    false,
    "filter actions should not be visually anchored to the left label column",
  );
  assert.equal(
    filterSource.includes("managementSummary.createHref"),
    false,
    "page-level create action should not be mixed into the filter form",
  );
  assert.equal(
    filterSource.includes("managementSummary.importDialog.openHref"),
    false,
    "page-level import action should not be mixed into the filter form",
  );
});

test("sidebar expands all groups by default and inherits master data detail state", async () => {
  const source = await readFile(appSidebarPath, "utf8");

  assert.equal(
    source.includes("new Set(nav.map((group) => group.title))"),
    true,
    "sidebar should default all nav groups to expanded",
  );
  assert.match(
    source,
    /title: "职场",\s+href: "\/master-data\/sites",\s+activeMatch: "prefix"/,
    "workplace detail routes should inherit the workplace nav item",
  );
  assert.match(
    source,
    /title: "供应商",\s+href: "\/master-data\/vendors",\s+activeMatch: "prefix"/,
    "vendor detail routes should inherit the vendor nav item",
  );
});

test("global shell uses shadcn sidebar and header breadcrumb primitives", async () => {
  await access(uiAlertPath);
  await access(uiAvatarPath);
  await access(uiBreadcrumbPath);
  await access(uiCollapsiblePath);
  await access(uiDialogPath);

  const shellSource = await readFile(appShellPath, "utf8");
  const sidebarSource = await readFile(appSidebarPath, "utf8");
  const headerSource = await readFile(siteHeaderPath, "utf8");

  assert.equal(shellSource.includes("SidebarProvider"), true);
  assert.equal(shellSource.includes("SidebarInset"), true);
  assert.equal(shellSource.includes("sidebarCollapsed"), false);
  assert.equal(sidebarSource.includes("@/components/ui/sidebar"), true);
  assert.equal(sidebarSource.includes("@/components/ui/collapsible"), true);
  assert.equal(sidebarSource.includes("<Sidebar"), true);
  assert.equal(sidebarSource.includes("CollapsibleTrigger"), true);
  assert.equal(sidebarSource.includes("CollapsibleContent"), true);
  assert.equal(sidebarSource.includes("SidebarMenuSub"), true);
  assert.equal(sidebarSource.includes("SidebarMenuSubButton"), true);
  assert.equal(sidebarSource.includes("SidebarMenuSubItem"), true);
  assert.equal(sidebarSource.includes("<aside"), false);
  assert.equal(sidebarSource.includes("collapsed"), false);
  assert.equal(sidebarSource.includes("SidebarGroupLabel asChild"), false);
  assert.equal(sidebarSource.includes('className="pl-7"'), false);
  assert.equal(headerSource.includes("SidebarTrigger"), true);
  assert.equal(headerSource.includes("Breadcrumb"), true);
  assert.equal(headerSource.includes("breadcrumbItems"), true);
  assert.equal(headerSource.includes("parentBreadcrumbItems"), false);
  assert.equal(headerSource.includes("breadcrumbItems.slice(0, -1)"), false);
  assert.equal(headerSource.includes('className="sr-only"'), true);
  assert.equal(headerSource.includes('className="truncate text-base font-medium"'), false);
  assert.equal(headerSource.includes("actions"), true);
  assert.equal(headerSource.includes("Search"), false);
  assert.equal(headerSource.includes("CalendarRange"), false);
  assert.equal(headerSource.includes("Bell"), false);
  assert.equal(headerSource.includes("ThemeToggle"), false);
  assert.equal(sidebarSource.includes("SidebarFooter"), true);
  assert.equal(sidebarSource.includes("@/components/ui/avatar"), true);
  assert.equal(sidebarSource.includes("AvatarImage"), true);
  assert.equal(sidebarSource.includes("/shadcn-avatar.jpg"), true);
  assert.equal(sidebarSource.includes("<AvatarFallback"), true);
  assert.equal(sidebarSource.includes("DropdownMenu"), true);
  assert.equal(sidebarSource.includes("切换为"), true);
  assert.equal(sidebarSource.includes("退出登录"), true);
});

test("global header shell does not retain the removed search placeholder API", async () => {
  const shellSource = await readFile(appShellPath, "utf8");
  const headerSource = await readFile(siteHeaderPath, "utf8");
  const pageSources = [
    ...await collectSourceFiles(appRootPath),
    ...await collectSourceFiles(componentsRootPath),
  ];

  assert.equal(shellSource.includes("searchPlaceholder"), false, "AppShell API");
  assert.equal(headerSource.includes("searchPlaceholder"), false, "SiteHeader API");

  for (const fileUrl of pageSources) {
    const source = await readFile(fileUrl, "utf8");

    assert.equal(source.includes("searchPlaceholder"), false, fileUrl.pathname);
  }
});

test("agent bulk import starts from the agent list dialog and leaves details to batch detail pages", async () => {
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const importDialogSource = await readFile(masterDataAgentImportDialogPath, "utf8");
  const modelSource = await readFile(masterDataModelPath, "utf8");
  const agentSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataAgentManagementPage"),
    workbenchSource.indexOf("export function MasterDataReferenceManagementPage"),
  );

  assert.equal(
    agentSource.includes("<AgentImportDialog"),
    true,
    "agent list should render an in-page import dialog",
  );
  assert.equal(
    agentSource.includes('buildImportUploadWorkspaceHref({ fileType: "master_data" })'),
    false,
    "agent list import entry should not jump to the standalone upload workspace",
  );
  assert.equal(
    entitySource.includes("fetchImportFieldMappingTemplates"),
    true,
    "agent page should load mapping templates for the dialog",
  );
  assert.equal(
    modelSource.includes("summarizeMasterDataAgentImportDialog"),
    true,
    "dialog flow should be modeled instead of ad hoc page markup",
  );
  assert.equal(
    importDialogSource.includes("查看批次详情"),
    true,
    "full import details should remain on the batch detail page",
  );
  assert.equal(
    importDialogSource.includes("失败行修正"),
    true,
    "failed-row correction should be linked from the result step",
  );
  assert.equal(importDialogSource.includes("DialogContent"), true);
  assert.equal(importDialogSource.includes("AlertTitle"), true);
  assert.equal(importDialogSource.includes("useState<AgentImportStepKey>"), true);
  assert.equal(importDialogSource.includes('hidden={activeStep !== "upload"}'), true);
  assert.equal(importDialogSource.includes('hidden={activeStep !== "mapping"}'), true);
  assert.equal(importDialogSource.includes('hidden={activeStep !== "result"}'), true);
  assert.equal(importDialogSource.includes('action={action}'), true);
  assert.equal(workbenchSource.includes('role="dialog"'), false);
});

test("non-agent master data pages do not expose unconfirmed import actions in content", async () => {
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const referenceSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataReferenceManagementPage"),
    workbenchSource.indexOf("export function MasterDataWorkplaceDetailPage"),
  );
  const organizationSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataOrganizationManagementPage"),
    workbenchSource.indexOf("function ReadOnlyField"),
  );

  assert.equal(
    referenceSource.includes("导入主数据"),
    false,
    "reference list content should not expose a standalone import shortcut",
  );
  assert.equal(
    organizationSource.includes("导入主数据"),
    false,
    "organization list content should not expose a standalone import shortcut",
  );
  assert.equal(
    referenceSource.includes("buildImportUploadWorkspaceHref"),
    false,
    "reference list content should not jump to the standalone upload workspace",
  );
  assert.equal(
    organizationSource.includes("buildImportUploadWorkspaceHref"),
    false,
    "organization list content should not jump to the standalone upload workspace",
  );
  assert.equal(
    entitySource.includes("entity.key === \"agents\" && agentManagementSummary"),
    true,
    "shared Header actions should stay scoped to the confirmed agent actions only",
  );
});

test("workplace maintenance uses child pages and freeze dialog instead of list-page forms", async () => {
  await access(masterDataWorkplaceCreatePagePath);
  await access(masterDataWorkplaceEditPagePath);

  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const modelSource = await readFile(masterDataModelPath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const createPageSource = await readFile(masterDataWorkplaceCreatePagePath, "utf8");
  const editPageSource = await readFile(masterDataWorkplaceEditPagePath, "utf8");
  const referenceSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataReferenceManagementPage"),
    workbenchSource.indexOf("export function MasterDataWorkplaceDetailPage"),
  );

  assert.equal(
    entitySource.includes("MasterDataWorkplacePageActions"),
    true,
    "workplace list should use Header actions for create",
  );
  assert.equal(
    entitySource.includes("freeze_workplace_id"),
    true,
    "workplace freeze should be controlled by list-page dialog state",
  );
  assert.equal(
    actionsSource.includes("submitMasterDataWorkplaceMaintenance"),
    true,
    "workplace forms should use a workplace-specific server action",
  );
  assert.equal(
    modelSource.includes("buildMasterDataWorkplaceMaintenancePayload"),
    true,
    "workplace maintenance should be modeled explicitly",
  );
  assert.equal(referenceSource.includes("WorkplaceMaintenanceForm"), false);
  assert.equal(referenceSource.includes("MasterDataWorkplaceFreezeDialog"), true);
  assert.equal(referenceSource.includes("DialogContent"), true);
  assert.equal(createPageSource.includes("MasterDataWorkplaceCreatePage"), true);
  assert.equal(editPageSource.includes("MasterDataWorkplaceEditPage"), true);
  assert.equal(editPageSource.includes("notFound()"), true);
});

test("vendor maintenance uses child pages and freeze dialog instead of list-page forms", async () => {
  await access(masterDataVendorCreatePagePath);
  await access(masterDataVendorEditPagePath);

  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const modelSource = await readFile(masterDataModelPath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const createPageSource = await readFile(masterDataVendorCreatePagePath, "utf8");
  const editPageSource = await readFile(masterDataVendorEditPagePath, "utf8");
  const referenceSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataReferenceManagementPage"),
    workbenchSource.indexOf("export function MasterDataWorkplaceDetailPage"),
  );

  assert.equal(
    entitySource.includes("MasterDataVendorPageActions"),
    true,
    "vendor list should use Header actions for create",
  );
  assert.equal(
    entitySource.includes("freeze_vendor_id"),
    true,
    "vendor freeze should be controlled by list-page dialog state",
  );
  assert.equal(
    actionsSource.includes("submitMasterDataVendorMaintenance"),
    true,
    "vendor forms should use a vendor-specific server action",
  );
  assert.equal(
    modelSource.includes("buildMasterDataVendorMaintenancePayload"),
    true,
    "vendor maintenance should be modeled explicitly",
  );
  assert.equal(referenceSource.includes("VendorMaintenanceForm"), false);
  assert.equal(referenceSource.includes("MasterDataVendorFreezeDialog"), true);
  assert.equal(referenceSource.includes("DialogContent"), true);
  assert.equal(createPageSource.includes("MasterDataVendorCreatePage"), true);
  assert.equal(editPageSource.includes("MasterDataVendorEditPage"), true);
  assert.equal(editPageSource.includes("notFound()"), true);
});

test("organization maintenance uses child pages and freeze dialog instead of list-page forms", async () => {
  await access(masterDataOrganizationCreatePagePath);
  await access(masterDataOrganizationEditPagePath);

  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const modelSource = await readFile(masterDataModelPath, "utf8");
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const createPageSource = await readFile(masterDataOrganizationCreatePagePath, "utf8");
  const editPageSource = await readFile(masterDataOrganizationEditPagePath, "utf8");
  const organizationSource = workbenchSource.slice(
    workbenchSource.indexOf("export function MasterDataOrganizationManagementPage"),
    workbenchSource.indexOf("function ReadOnlyField"),
  );

  assert.equal(
    entitySource.includes("MasterDataOrganizationPageActions"),
    true,
    "organization list should use Header actions for create",
  );
  assert.equal(
    entitySource.includes("freeze_organization_id"),
    true,
    "organization freeze should be controlled by list-page dialog state",
  );
  assert.equal(
    actionsSource.includes("submitMasterDataOrganizationMaintenance"),
    true,
    "organization forms should use an organization-specific server action",
  );
  assert.equal(
    modelSource.includes("buildMasterDataOrganizationMaintenancePayload"),
    true,
    "organization maintenance should be modeled explicitly",
  );
  assert.equal(organizationSource.includes("OrganizationMaintenanceForm"), false);
  assert.equal(organizationSource.includes("MasterDataOrganizationFreezeDialog"), true);
  assert.equal(organizationSource.includes("DialogContent"), true);
  assert.equal(createPageSource.includes("MasterDataOrganizationCreatePage"), true);
  assert.equal(editPageSource.includes("MasterDataOrganizationEditPage"), true);
  assert.equal(editPageSource.includes("notFound()"), true);
});

test("business import actions belong to business page headers, not the generic batch ledger", async () => {
  const batchListPanelSource = await readFile(importCenterBatchListPanelPath, "utf8");
  const demandPageSource = await readFile(demandForecastProductionPagePath, "utf8");
  const schedulePageSource = await readFile(personnelScheduleProductionPagePath, "utf8");
  const actualLogPageSource = await readFile(actualLogProductionPagePath, "utf8");
  const demandWorkbenchSource = await readFile(demandForecastProductionWorkbenchPath, "utf8");
  const scheduleWorkbenchSource = await readFile(personnelScheduleProductionWorkbenchPath, "utf8");
  const actualLogWorkbenchSource = await readFile(actualLogProductionWorkbenchPath, "utf8");
  const demandWorkbenchBody = demandWorkbenchSource.slice(
    demandWorkbenchSource.indexOf("export function DemandForecastProductionWorkbench"),
    demandWorkbenchSource.indexOf("export function DemandForecastProductionDetail"),
  );
  const scheduleWorkbenchBody = scheduleWorkbenchSource.slice(
    scheduleWorkbenchSource.indexOf("export function PersonnelScheduleProductionWorkbench"),
    scheduleWorkbenchSource.indexOf("export function PersonnelScheduleProductionDetail"),
  );
  const actualLogWorkbenchBody = actualLogWorkbenchSource.slice(
    actualLogWorkbenchSource.indexOf("export function ActualLogProductionWorkbench"),
    actualLogWorkbenchSource.indexOf("export function ActualLogProcessingDetail"),
  );

  assert.equal(
    batchListPanelSource.includes("buildImportUploadWorkspaceHref"),
    false,
    "generic import batch ledger should not own a CSV upload entry",
  );
  assert.equal(
    batchListPanelSource.includes("上传 CSV"),
    false,
    "generic import batch ledger should not expose a generic upload button",
  );
  assert.equal(
    demandPageSource.includes("DemandForecastProductionPageActions"),
    true,
    "demand forecast import action should be mounted in AppShell actions",
  );
  assert.equal(
    demandPageSource.includes("<DemandForecastImportDialog"),
    true,
    "demand forecast import should open a page-local Dialog",
  );
  assert.equal(
    demandWorkbenchSource.includes('buildImportUploadWorkspaceHref({ fileType: "demand_forecast" })'),
    false,
    "demand forecast action should not jump to the standalone upload workspace",
  );
  assert.equal(
    schedulePageSource.includes("PersonnelScheduleProductionPageActions"),
    true,
    "personnel schedule import action should be mounted in AppShell actions",
  );
  assert.equal(
    schedulePageSource.includes("<PersonnelScheduleImportDialog"),
    true,
    "personnel schedule import should open a page-local Dialog",
  );
  assert.equal(
    scheduleWorkbenchSource.includes('buildImportUploadWorkspaceHref({ fileType: "personnel_schedule" })'),
    false,
    "personnel schedule action should not jump to the standalone upload workspace",
  );
  assert.equal(
    actualLogPageSource.includes("ActualLogProductionPageActions"),
    true,
    "actual log import actions should be mounted in AppShell actions",
  );
  assert.equal(
    demandWorkbenchBody.includes("导入预测"),
    false,
    "demand forecast workbench content should not own the import action",
  );
  assert.equal(
    scheduleWorkbenchBody.includes("导入排班"),
    false,
    "schedule workbench content should not own the import action",
  );
  assert.equal(
    actualLogWorkbenchBody.includes("导入登录日志"),
    false,
    "actual log workbench content should not own login-log import action",
  );
  assert.equal(
    actualLogWorkbenchBody.includes("导入状态日志"),
    false,
    "actual log workbench content should not own status-log import action",
  );
});

test("demand forecast import dialog uses the strict step-by-step upload flow", async () => {
  const dialogSource = await readFile(demandForecastImportDialogPath, "utf8");
  const actionSource = await readFile(new URL("../../app/data-quality/actions.ts", import.meta.url), "utf8");

  assert.equal(dialogSource.includes("DialogContent"), true);
  assert.equal(dialogSource.includes("AlertTitle"), true);
  assert.equal(dialogSource.includes("useState<DemandForecastImportDialogStepKey>"), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "upload"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "mapping"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "result"}'), true);
  assert.equal(dialogSource.includes('name="file_type"'), true);
  assert.equal(dialogSource.includes('value={dialog.fileType}'), true);
  assert.equal(dialogSource.includes('name="result_redirect_to"'), true);
  assert.equal(
    actionSource.includes('resultTarget === "/demand-plans/production?import_dialog=1"'),
    true,
    "upload action should return demand forecast results to the page-local Dialog",
  );
});

test("personnel schedule import dialog uses the strict step-by-step upload flow", async () => {
  const dialogSource = await readFile(personnelScheduleImportDialogPath, "utf8");
  const actionSource = await readFile(new URL("../../app/data-quality/actions.ts", import.meta.url), "utf8");

  assert.equal(dialogSource.includes("DialogContent"), true);
  assert.equal(dialogSource.includes("AlertTitle"), true);
  assert.equal(dialogSource.includes("useState<PersonnelScheduleImportDialogStepKey>"), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "upload"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "mapping"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "result"}'), true);
  assert.equal(dialogSource.includes('name="file_type"'), true);
  assert.equal(dialogSource.includes('value={dialog.fileType}'), true);
  assert.equal(dialogSource.includes('name="result_redirect_to"'), true);
  assert.equal(
    actionSource.includes('resultTarget === "/schedule-plans/production?import_dialog=1"'),
    true,
    "upload action should return personnel schedule results to the page-local Dialog",
  );
});

test("actual log import dialog uses the strict step-by-step upload flow", async () => {
  const pageSource = await readFile(actualLogProductionPagePath, "utf8");
  const workbenchSource = await readFile(actualLogProductionWorkbenchPath, "utf8");
  const dialogSource = await readFile(actualLogImportDialogPath, "utf8");
  const actionSource = await readFile(new URL("../../app/data-quality/actions.ts", import.meta.url), "utf8");

  assert.equal(pageSource.includes("<ActualLogImportDialog"), true);
  assert.equal(
    workbenchSource.includes('buildImportUploadWorkspaceHref({ fileType: "login_log" })'),
    false,
    "actual log page actions should not link login logs to the standalone upload workspace",
  );
  assert.equal(
    workbenchSource.includes('buildImportUploadWorkspaceHref({ fileType: "status_log" })'),
    false,
    "actual log page actions should not link status logs to the standalone upload workspace",
  );
  assert.equal(dialogSource.includes("DialogContent"), true);
  assert.equal(dialogSource.includes("AlertTitle"), true);
  assert.equal(dialogSource.includes("useState<ActualLogImportDialogStepKey>"), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "upload"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "mapping"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "result"}'), true);
  assert.equal(dialogSource.includes('name="file_type"'), true);
  assert.equal(dialogSource.includes('value={dialog.fileType}'), true);
  assert.equal(dialogSource.includes('name="result_redirect_to"'), true);
  assert.equal(
    actionSource.includes('resultTarget === "/actual-logs/production?import_dialog=1&log_type=login"'),
    true,
    "upload action should return login-log results to the page-local Dialog",
  );
  assert.equal(
    actionSource.includes('resultTarget === "/actual-logs/production?import_dialog=1&log_type=status"'),
    true,
    "upload action should return status-log results to the page-local Dialog",
  );
});

test("result chain pages do not present import batches as their parent module", async () => {
  const resultPageSources = [
    ["business versions", await readFile(dataQualityVersionsPagePath, "utf8")],
    ["comparison run detail", await readFile(dataQualityComparisonRunPagePath, "utf8")],
    ["review cases", await readFile(dataQualityReviewCasesPagePath, "utf8")],
    ["review case detail", await readFile(dataQualityReviewCaseDetailPagePath, "utf8")],
  ];

  for (const [label, source] of resultPageSources) {
    assert.equal(
      source.includes('{ label: "导入批次", href: "/data-quality" }'),
      false,
      `${label} should not breadcrumb under the import batch ledger`,
    );
  }

  const batchDetailSource = await readFile(dataQualityBatchPagePath, "utf8");
  const uploadSource = await readFile(dataQualityUploadPagePath, "utf8");
  const templateDetailSource = await readFile(dataQualityTemplateDetailPagePath, "utf8");

  assert.equal(
    batchDetailSource.includes('{ label: "导入批次", href: "/data-quality" }'),
    true,
    "batch processing page should keep batch breadcrumb context",
  );
  assert.equal(
    uploadSource.includes('{ label: "导入批次", href: "/data-quality" }'),
    true,
    "internal compatible upload page should keep batch breadcrumb context",
  );
  assert.equal(
    templateDetailSource.includes('{ label: "导入批次", href: "/data-quality" }'),
    true,
    "template page should keep batch/template breadcrumb context",
  );
});
