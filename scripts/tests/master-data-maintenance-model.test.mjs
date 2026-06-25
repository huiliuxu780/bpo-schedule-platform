import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  MASTER_DATA_MAINTENANCE_ENTITIES,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataEntitySourceContext,
  summarizeMasterDataMaintenanceWorkbench,
} = jiti("../../components/master-data-maintenance-model.ts");

const baseBatch = {
  batch_id: "BATCH-MD-001",
  file_name: "master.csv",
  file_type: "master_data",
  uploaded_by: "ops",
  uploaded_at: "2026-06-03T09:00:00+08:00",
  business_date_from: "2026-06-01",
  business_date_to: "2026-06-30",
  processing_status: "completed",
  total_rows: 18,
  success_rows: 18,
  failed_rows: 0,
  warning_rows: 0,
  version_count: 1,
  application_status: "applied",
  application_target: "master_data",
  import_version_id: "BATCH-MD-001::v1",
  applied_record_count: 18,
};

test("master data maintenance defines the core people-oriented maintenance objects without project", () => {
  assert.deepEqual(
    MASTER_DATA_MAINTENANCE_ENTITIES.map((entity) => entity.label),
    ["坐席", "组织", "职场", "供应商", "技能"],
  );
  assert.equal(getMasterDataMaintenanceEntity("projects"), null);
  assert.equal(getMasterDataMaintenanceEntity("site-operators"), null);
  assert.equal(getMasterDataMaintenanceEntity("bindings"), null);
  assert.equal(getMasterDataMaintenanceEntity("organizations")?.label, "组织");
});

test("master data maintenance workbench shows an empty read-only state without source batches", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalObjects, 5);
  assert.equal(summary.readyObjects, 0);
  assert.equal(summary.blockedObjects, 5);
  assert.equal(summary.sourceVersionLabel, "暂无主数据业务版本");
  assert.equal(summary.rows.length, 5);
  assert.equal(summary.rows[0].statusLabel, "待导入");
  assert.equal(summary.rows[0].blockerSummary, "尚未发现主数据导入批次");
  assert.equal(summary.rows[0].sourceBatchHref, null);
});

test("master data maintenance workbench uses the latest applied master data version", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([
    {
      ...baseBatch,
      batch_id: "BATCH-SCH-001",
      file_type: "personnel_schedule",
      import_version_id: "BATCH-SCH-001::v1",
    },
    baseBatch,
  ]);

  assert.equal(summary.tone, "ready");
  assert.equal(summary.readyObjects, 5);
  assert.equal(summary.blockedObjects, 0);
  assert.equal(summary.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(summary.latestBatchLabel, "BATCH-MD-001");
  assert.equal(summary.rows[0].statusLabel, "可查看");
  assert.equal(summary.rows[0].nextActionLabel, "查看列表");
  assert.equal(summary.rows[0].sourceBatchHref, "/data-quality/import-batches/BATCH-MD-001");
  assert.equal(summary.rows[0].sourceVersionHref, "/data-quality/versions?domain=master_data");
  assert.equal(summary.rows[0].detailHref, "/master-data/agents");
});

test("master data maintenance workbench blocks freshness when the newest master data batch is not applied", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([
    baseBatch,
    {
      ...baseBatch,
      batch_id: "BATCH-MD-002",
      uploaded_at: "2026-06-03T10:00:00+08:00",
      application_status: "not_applied",
      import_version_id: "BATCH-MD-002::v1",
      applied_record_count: 0,
    },
  ]);

  assert.equal(summary.tone, "blocked");
  assert.equal(summary.readyObjects, 0);
  assert.equal(summary.blockedObjects, 5);
  assert.equal(summary.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(summary.latestBatchLabel, "BATCH-MD-002");
  assert.match(summary.detail, /最新主数据批次尚未应用/);
  assert.equal(summary.rows[0].statusLabel, "待同步");
  assert.equal(summary.rows[0].blockerSummary, "最新主数据批次尚未应用，当前仍按上一已应用版本展示");
});

test("master data maintenance resolves known entity keys", () => {
  assert.equal(getMasterDataMaintenanceEntity("skills")?.label, "技能");
  assert.equal(getMasterDataMaintenanceEntity("missing"), null);
});

test("master data entity source context keeps list source state only", () => {
  const context = summarizeMasterDataEntitySourceContext("skills", [
    {
      ...baseBatch,
      batch_id: "BATCH-IM083-SMOKE-002",
      import_version_id: "BATCH-IM083-SMOKE-002::v1",
    },
  ]);

  assert.equal(context.entity.label, "技能");
  assert.equal(context.title, "技能");
  assert.equal(context.sourceVersionLabel, "BATCH-业务-002::v1");
  assert.equal(
    context.sourceBatchHref,
    "/data-quality/import-batches/BATCH-IM083-SMOKE-002",
  );
  assert.equal(context.agentSubmitSourceBatchId, null);
  assert.equal("workspaceTabs" in context, false);
  assert.equal("maintenanceActions" in context, false);
  assert.equal("referenceImpacts" in context, false);
});

test("agent workplace and vendor source contexts expose submit source batches for confirmed forms", () => {
  const agentContext = summarizeMasterDataEntitySourceContext("agents", [baseBatch]);
  const workplaceContext = summarizeMasterDataEntitySourceContext("sites", [baseBatch]);
  const vendorContext = summarizeMasterDataEntitySourceContext("vendors", [baseBatch]);
  const skillContext = summarizeMasterDataEntitySourceContext("skills", [baseBatch]);

  assert.equal(agentContext.agentSubmitSourceBatchId, "BATCH-MD-001");
  assert.equal(workplaceContext.workplaceSubmitSourceBatchId, "BATCH-MD-001");
  assert.equal(vendorContext.vendorSubmitSourceBatchId, "BATCH-MD-001");
  assert.equal(skillContext.agentSubmitSourceBatchId, null);
  assert.equal(skillContext.workplaceSubmitSourceBatchId, null);
  assert.equal(skillContext.vendorSubmitSourceBatchId, null);
  assert.equal(skillContext.skillSubmitSourceBatchId, "BATCH-MD-001");
});

test("master data source context keeps a blocked source state when no applied version exists", () => {
  const context = summarizeMasterDataEntitySourceContext("agents", [
    {
      ...baseBatch,
      application_status: "not_applied",
      applied_record_count: 0,
    },
  ]);

  assert.equal(context.tone, "blocked");
  assert.equal(context.sourceVersionLabel, "暂无主数据业务版本");
  assert.match(context.detail, /尚未应用/);
  assert.equal(context.agentSubmitSourceBatchId, "BATCH-MD-001");
});
