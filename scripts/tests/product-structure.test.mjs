import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

const appRootPath = new URL("../../app/", import.meta.url);
const componentsRootPath = new URL("../../components/", import.meta.url);
const dashboardPagePath = new URL("../../app/dashboard/page.tsx", import.meta.url);
const appSidebarPath = new URL("../../components/app-sidebar.tsx", import.meta.url);
const appShellPath = new URL("../../components/app-shell.tsx", import.meta.url);
const siteHeaderPath = new URL("../../components/site-header.tsx", import.meta.url);
const masterDataIndexPagePath = new URL("../../app/master-data/page.tsx", import.meta.url);
const masterDataEntityPagePath = new URL("../../app/master-data/[entityKey]/page.tsx", import.meta.url);
const masterDataAgentCreatePagePath = new URL("../../app/master-data/agents/new/page.tsx", import.meta.url);
const masterDataAgentEditPagePath = new URL("../../app/master-data/agents/[employeeId]/edit/page.tsx", import.meta.url);
const masterDataAgentSkillsEditPagePath = new URL("../../app/master-data/agents/[employeeId]/skills/edit/page.tsx", import.meta.url);
const masterDataAgentDataPath = new URL("../../app/master-data/agents/data.ts", import.meta.url);
const masterDataWorkplaceDetailPagePath = new URL("../../app/master-data/sites/[workplaceId]/page.tsx", import.meta.url);
const masterDataWorkplaceCreatePagePath = new URL("../../app/master-data/sites/new/page.tsx", import.meta.url);
const masterDataWorkplaceEditPagePath = new URL("../../app/master-data/sites/[workplaceId]/edit/page.tsx", import.meta.url);
const masterDataVendorDetailPagePath = new URL("../../app/master-data/vendors/[vendorId]/page.tsx", import.meta.url);
const demandForecastProductionPagePath = new URL("../../app/demand-plans/production/page.tsx", import.meta.url);
const personnelScheduleProductionPagePath = new URL("../../app/schedule-plans/production/page.tsx", import.meta.url);
const actualLogProductionPagePath = new URL("../../app/actual-logs/production/page.tsx", import.meta.url);
const demandPlansPagePath = new URL("../../app/demand-plans/page.tsx", import.meta.url);
const demandForecastProductionDetailPagePath = new URL("../../app/demand-plans/production/[batchId]/page.tsx", import.meta.url);
const schedulePlansPagePath = new URL("../../app/schedule-plans/page.tsx", import.meta.url);
const schedulePlanCreatePagePath = new URL("../../app/schedule-plans/new/page.tsx", import.meta.url);
const schedulePlanDetailPagePath = new URL("../../app/schedule-plans/[planId]/page.tsx", import.meta.url);
const schedulePlanEditPagePath = new URL("../../app/schedule-plans/[planId]/edit/page.tsx", import.meta.url);
const personnelScheduleProductionDetailPagePath = new URL("../../app/schedule-plans/production/[batchId]/page.tsx", import.meta.url);
const actualLogProcessingDetailPagePath = new URL("../../app/actual-logs/production/[batchId]/page.tsx", import.meta.url);
const dataQualityPagePath = new URL("../../app/data-quality/page.tsx", import.meta.url);
const dataQualityBatchPagePath = new URL("../../app/data-quality/[batchId]/page.tsx", import.meta.url);
const dataQualityVersionsPagePath = new URL("../../app/data-quality/versions/page.tsx", import.meta.url);
const dataQualityReviewCasesPagePath = new URL("../../app/data-quality/review-cases/page.tsx", import.meta.url);
const dataQualityReviewCaseDetailPagePath = new URL("../../app/data-quality/review-cases/[caseId]/page.tsx", import.meta.url);
const dataQualityComparisonRunPagePath = new URL("../../app/data-quality/comparison-runs/[runId]/page.tsx", import.meta.url);
const dataQualityTemplateDetailPagePath = new URL("../../app/data-quality/field-mapping-templates/[templateId]/page.tsx", import.meta.url);
const dataQualityTemplateCreatePagePath = new URL("../../app/data-quality/field-mapping-templates/new/page.tsx", import.meta.url);
const dataQualityUploadPagePath = new URL("../../app/data-quality/uploads/new/page.tsx", import.meta.url);
const demandForecastProductionWorkbenchPath = new URL("../../components/demand-forecast-production-workbench.tsx", import.meta.url);
const personnelScheduleProductionWorkbenchPath = new URL("../../components/personnel-schedule-production-workbench.tsx", import.meta.url);
const actualLogProductionWorkbenchPath = new URL("../../components/actual-log-production-workbench.tsx", import.meta.url);
const importCenterReviewCasesWorkspacePath = new URL("../../components/import-center-review-cases-workspace.tsx", import.meta.url);
const importCenterReviewCaseDetailWorkspacePath = new URL("../../components/import-center-review-case-detail-workspace.tsx", import.meta.url);
const importCenterComparisonRunDetailWorkspacePath = new URL("../../components/import-center-comparison-run-detail-workspace.tsx", import.meta.url);
const importCenterVersionWorkbenchPath = new URL("../../components/import-center-version-workbench.tsx", import.meta.url);
const importCenterBatchListPanelPath = new URL("../../components/import-center-batch-list-panel.tsx", import.meta.url);
const masterDataActionsPath = new URL("../../app/master-data/[entityKey]/actions.ts", import.meta.url);
const masterDataModelPath = new URL("../../components/master-data-maintenance-model.ts", import.meta.url);
const masterDataWorkbenchPath = new URL("../../components/master-data-maintenance-workbench.tsx", import.meta.url);
const masterDataAgentImportDialogPath = new URL("../../components/master-data-agent-import-dialog.tsx", import.meta.url);
const globalsCssPath = new URL("../../app/globals.css", import.meta.url);
const uiAlertPath = new URL("../../components/ui/alert.tsx", import.meta.url);
const uiAvatarPath = new URL("../../components/ui/avatar.tsx", import.meta.url);
const uiBreadcrumbPath = new URL("../../components/ui/breadcrumb.tsx", import.meta.url);
const uiCollapsiblePath = new URL("../../components/ui/collapsible.tsx", import.meta.url);
const uiDialogPath = new URL("../../components/ui/dialog.tsx", import.meta.url);
const uiButtonPath = new URL("../../components/ui/button.tsx", import.meta.url);
const uiTablePath = new URL("../../components/ui/table.tsx", import.meta.url);

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

test("dashboard overview does not expose data ingestion status panel", async () => {
  const source = await readFile(dashboardPagePath, "utf8");

  assert.equal(source.includes("DataSyncStatus"), false);
  assert.equal(source.includes("data-sync-status"), false);
});

test("ui typography and density baseline is not overridden by component drift", async () => {
  const globalsSource = await readFile(globalsCssPath, "utf8");
  const buttonSource = await readFile(uiButtonPath, "utf8");
  const tableSource = await readFile(uiTablePath, "utf8");
  const agentImportDialogSource = await readFile(masterDataAgentImportDialogPath, "utf8");

  assert.equal(
    /button,\s*input,\s*select\s*\{\s*font:\s*inherit;\s*\}/s.test(globalsSource),
    false,
    "global form reset must not override component typography utilities",
  );
  assert.equal(
    buttonSource.includes("text-[0.8rem]"),
    false,
    "Button small size must not use a non-standard 12.8px font size",
  );
  assert.equal(
    /xs:\s*"[^"]*text-xs/.test(buttonSource),
    false,
    "Button extra-small text actions must not render at 12px against 14px page actions",
  );
  assert.equal(
    /TableHead[\s\S]*text-xs/.test(tableSource),
    false,
    "TableHead must not force 12px headers against 14px table body text",
  );
  assert.equal(
    agentImportDialogSource.includes("text-xs"),
    false,
    "agent import dialog body, steps, mapping controls, and result copy should keep the 14px baseline",
  );
});

test("application source does not retain rejected center-first visible wording", async () => {
  const sourceFiles = [
    ...await collectSourceFiles(appRootPath),
    ...await collectSourceFiles(componentsRootPath),
  ];
  const forbiddenVisiblePhrases = [
    "数据接入状态",
    "导入中心",
    "数据质量",
    "质量中心",
    "接入批次",
    "CORN",
    "local-operator",
    " 服务",
  ];
  const forbiddenTaskCodePattern = /\b(?:F|B|Q|IM|US|DB)\d{3}\b/;

  for (const fileUrl of sourceFiles) {
    const source = await readFile(fileUrl, "utf8");

    for (const phrase of forbiddenVisiblePhrases) {
      assert.equal(source.includes(phrase), false, `${fileUrl.pathname}: ${phrase}`);
    }

    assert.equal(
      forbiddenTaskCodePattern.test(source),
      false,
      `${fileUrl.pathname}: task code label`,
    );
  }
});

test("sidebar does not expose placeholder or deferred product capabilities", async () => {
  const source = await readFile(appSidebarPath, "utf8");
  const forbiddenLabels = [
    "今日履约",
    "异常预警",
    "时段缺口热力图",
    "智能排班",
    "工时核验",
    "坐席状态轨迹",
    "异常管理",
    "实时遵守率",
    "异常复核",
    "月度结算",
    "报表中心",
    "供应商复盘",
    "结算锁账",
    "数据源管理",
    "文件导入",
    "业务版本",
    "接入批次",
    "数据质量",
    "质量中心",
    "导入中心",
    "预测生产",
    "排班生产",
    "主数据维护",
    "字段映射",
    "接口集成",
    "组织与人员",
    "供应商管理",
    "规则配置",
    "权限管理",
    "操作审计",
  ];

  for (const label of forbiddenLabels) {
    assert.equal(source.includes(`title: "${label}"`), false, label);
  }

  assert.equal(
    source.includes('href: "/demand-plans/production"'),
    false,
    "demand production route should not be exposed as its own sidebar item",
  );
  assert.equal(
    source.includes('href: "/schedule-plans/production"'),
    false,
    "schedule production route should not be exposed as its own sidebar item",
  );
  assert.equal(
    source.includes('excludePrefixes: ["/schedule-plans/production"]'),
    false,
    "schedule parent navigation should own production child routes",
  );

  assert.equal(
    [...source.matchAll(/href: "\/dashboard"/g)].length,
    1,
    "only the business overview entry may point to the dashboard route",
  );
});

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

test("business pages pass breadcrumbs through AppShell", async () => {
  const pagePaths = [
    demandPlansPagePath,
    demandForecastProductionPagePath,
    demandForecastProductionDetailPagePath,
    schedulePlansPagePath,
    schedulePlanCreatePagePath,
    schedulePlanDetailPagePath,
    schedulePlanEditPagePath,
    personnelScheduleProductionPagePath,
    personnelScheduleProductionDetailPagePath,
    actualLogProductionPagePath,
    actualLogProcessingDetailPagePath,
    dataQualityPagePath,
    dataQualityBatchPagePath,
    dataQualityVersionsPagePath,
    dataQualityReviewCasesPagePath,
    dataQualityReviewCaseDetailPagePath,
    dataQualityComparisonRunPagePath,
    dataQualityTemplateDetailPagePath,
    dataQualityTemplateCreatePagePath,
    dataQualityUploadPagePath,
  ];

  for (const pagePath of pagePaths) {
    const source = await readFile(pagePath, "utf8");

    assert.equal(source.includes("breadcrumbItems"), true, pagePath.pathname);
  }
});

test("business content surfaces do not duplicate page identity h1 headings", async () => {
  const contentPaths = [
    demandPlansPagePath,
    schedulePlansPagePath,
    schedulePlanCreatePagePath,
    schedulePlanDetailPagePath,
    schedulePlanEditPagePath,
    demandForecastProductionWorkbenchPath,
    personnelScheduleProductionWorkbenchPath,
    actualLogProductionWorkbenchPath,
    importCenterReviewCasesWorkspacePath,
    importCenterReviewCaseDetailWorkspacePath,
    importCenterComparisonRunDetailWorkspacePath,
    importCenterVersionWorkbenchPath,
  ];

  for (const contentPath of contentPaths) {
    const source = await readFile(contentPath, "utf8");

    assert.equal(source.includes("<h1"), false, contentPath.pathname);
  }
});

test("master data entry redirects to agents and entity pages do not use the old long detail workspace", async () => {
  const indexSource = await readFile(masterDataIndexPagePath, "utf8");
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsPath, "utf8");
  const modelSource = await readFile(masterDataModelPath, "utf8");
  const forbiddenEntityPageTerms = [
    "  MasterDataMaintenanceEntityDetail,",
    "<MasterDataMaintenanceEntityDetail",
    "submitMasterDataReferenceMaintenance",
    "submitMasterDataBindingMaintenance",
    "详情与引用影响",
    "提交表单",
    "维护动作",
    "来源与引用",
  ];
  const forbiddenActionTerms = [
    "submitMasterDataReferenceMaintenance",
    "submitMasterDataBindingMaintenance",
    "parseBindingAction",
    "parseEntityKey",
    "buildMasterDataReferenceMaintenance",
    "buildMasterDataBindingMaintenance",
  ];
  const forbiddenModelTerms = [
    "MasterDataEntityDetailSummary",
    "summarizeMasterDataMaintenanceEntityDetail",
    "MasterDataMaintenanceWorkspaceTab",
    "workspaceTabs",
    "MasterDataReferenceMaintenancePayload",
    "MasterDataBindingMaintenancePayload",
    "buildMasterDataReferenceMaintenance",
    "buildMasterDataBindingMaintenance",
  ];

  assert.equal(indexSource.includes('redirect("/master-data/agents")'), true);

  for (const term of forbiddenEntityPageTerms) {
    assert.equal(entitySource.includes(term), false, term);
  }

  for (const term of forbiddenActionTerms) {
    assert.equal(actionsSource.includes(term), false, term);
  }

  for (const term of forbiddenModelTerms) {
    assert.equal(modelSource.includes(term), false, term);
  }
});

test("master data product surface does not expose project as a maintenance object", async () => {
  const sidebarSource = await readFile(appSidebarPath, "utf8");
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
  const modelSource = await readFile(masterDataModelPath, "utf8");

  assert.equal(sidebarSource.includes('title: "技能"'), true);
  assert.equal(sidebarSource.includes('href: "/master-data/skills"'), true);
  assert.equal(sidebarSource.includes('title: "职场运营主体"'), false);
  assert.equal(sidebarSource.includes('href: "/master-data/site-operators"'), false);
  assert.equal(sidebarSource.includes('title: "绑定关系"'), false);
  assert.equal(sidebarSource.includes('href: "/master-data/bindings"'), false);
  assert.equal(sidebarSource.includes('title: "项目"'), false);
  assert.equal(sidebarSource.includes('href: "/master-data/projects"'), false);
  assert.equal(modelSource.includes('key: "projects"'), false);
  assert.equal(modelSource.includes('key: "site-operators"'), false);
  assert.equal(modelSource.includes('key: "bindings"'), false);
  assert.equal(modelSource.includes('label: "项目"'), false);
  assert.equal(modelSource.includes('label: "职场运营主体"'), false);
  assert.equal(modelSource.includes('label: "绑定关系"'), false);
  assert.equal(modelSource.includes('scopeLabel: "坐席-项目'), false);
  assert.equal(modelSource.includes('人员、项目'), false);
  assert.equal(entitySource.includes('projects" | "skills"'), false);
  assert.equal(entitySource.includes('"projects", "skills"'), false);
  assert.equal(entitySource.includes('entity.key === "site-operators"'), false);
  assert.equal(entitySource.includes('entity.key === "bindings"'), false);
});

test("workplace operating subjects stay nested under workplace detail", async () => {
  await access(masterDataWorkplaceDetailPagePath);

  const sourceFiles = [
    ...await collectSourceFiles(appRootPath),
    ...await collectSourceFiles(componentsRootPath),
  ];
  const filePaths = sourceFiles.map((fileUrl) => fileUrl.pathname);

  assert.equal(
    filePaths.some((path) => path.endsWith("/app/master-data/site-operators/page.tsx")),
    false,
  );
  assert.equal(
    filePaths.some((path) => path.endsWith("/app/master-data/bindings/page.tsx")),
    false,
  );
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

test("vendor service context stays nested under vendor detail", async () => {
  await access(masterDataVendorDetailPagePath);

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

test("master data pages pass breadcrumbs through AppShell", async () => {
  const pageSources = [
    await readFile(masterDataEntityPagePath, "utf8"),
    await readFile(masterDataAgentCreatePagePath, "utf8"),
    await readFile(masterDataAgentEditPagePath, "utf8"),
    await readFile(masterDataAgentSkillsEditPagePath, "utf8"),
    await readFile(masterDataWorkplaceDetailPagePath, "utf8"),
    await readFile(masterDataVendorDetailPagePath, "utf8"),
  ];

  for (const source of pageSources) {
    assert.equal(source.includes("breadcrumbItems"), true);
  }
});

test("agent child form pages do not duplicate the global page header", async () => {
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const formShellSource = workbenchSource.slice(
    workbenchSource.indexOf("function AgentFormPageShell"),
    workbenchSource.indexOf("function AgentFormBlockedState"),
  );
  const skillsSectionSource = workbenchSource.slice(
    workbenchSource.indexOf("function AgentSkillMaintenanceSection"),
    workbenchSource.indexOf("type AgentMaintenanceField"),
  );

  assert.equal(
    formShellSource.includes("<h1"),
    false,
    "agent child content should rely on AppShell/SiteHeader for the page title",
  );
  assert.equal(
    formShellSource.includes("返回客服人员"),
    false,
    "agent child content should rely on breadcrumb navigation for returning to the list",
  );
  assert.equal(
    formShellSource.includes("ArrowLeft"),
    false,
    "agent child content should not render a duplicate page-level back action",
  );
  assert.equal(
    formShellSource.includes("description"),
    false,
    "agent child content shell should not repeat page-level explanatory copy",
  );
  assert.equal(
    skillsSectionSource.includes("坐席技能维护"),
    false,
    "skills edit content should not repeat the page title as a section heading",
  );
});

test("master data content pages do not render duplicate page identity headers", async () => {
  const workbenchSource = await readFile(masterDataWorkbenchPath, "utf8");
  const workplaceDetailSource = await readFile(masterDataWorkplaceDetailPagePath, "utf8");
  const vendorDetailSource = await readFile(masterDataVendorDetailPagePath, "utf8");

  assert.equal(
    workbenchSource.includes("<h1"),
    false,
    "master data content should rely on AppShell/SiteHeader for page identity",
  );
  assert.equal(
    workbenchSource.includes("ArrowLeft"),
    false,
    "master data content should rely on breadcrumb links instead of duplicate page back blocks",
  );
  for (const label of ["返回客服人员", "返回职场", "返回供应商"]) {
    assert.equal(workbenchSource.includes(label), false, label);
  }
  assert.equal(
    workplaceDetailSource.includes("title={detailSummary.title}"),
    true,
    "workplace detail SiteHeader should show the actual workplace name",
  );
  assert.equal(
    vendorDetailSource.includes("title={detailSummary.title}"),
    true,
    "vendor detail SiteHeader should show the actual vendor name",
  );
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
    schedulePageSource.includes("PersonnelScheduleProductionPageActions"),
    true,
    "personnel schedule import action should be mounted in AppShell actions",
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
