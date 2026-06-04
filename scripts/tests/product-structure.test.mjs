import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const dashboardPagePath = new URL("../../app/dashboard/page.tsx", import.meta.url);
const appSidebarPath = new URL("../../components/app-sidebar.tsx", import.meta.url);
const masterDataIndexPagePath = new URL("../../app/master-data/page.tsx", import.meta.url);
const masterDataEntityPagePath = new URL("../../app/master-data/[entityKey]/page.tsx", import.meta.url);

test("dashboard overview does not expose data ingestion status panel", async () => {
  const source = await readFile(dashboardPagePath, "utf8");

  assert.equal(source.includes("DataSyncStatus"), false);
  assert.equal(source.includes("data-sync-status"), false);
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
    [...source.matchAll(/href: "\/dashboard"/g)].length,
    1,
    "only the business overview entry may point to the dashboard route",
  );
});

test("master data entry redirects to agents and entity pages do not use the old long detail workspace", async () => {
  const indexSource = await readFile(masterDataIndexPagePath, "utf8");
  const entitySource = await readFile(masterDataEntityPagePath, "utf8");
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

  assert.equal(indexSource.includes('redirect("/master-data/agents")'), true);

  for (const term of forbiddenEntityPageTerms) {
    assert.equal(entitySource.includes(term), false, term);
  }
});
