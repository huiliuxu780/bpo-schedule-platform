import assert from "node:assert/strict";
import test from "node:test";

import {
  MASTER_DATA_MAINTENANCE_ENTITIES,
  getMasterDataMaintenanceEntity,
  summarizeMasterDataMaintenanceEntityDetail,
  summarizeMasterDataMaintenanceWorkbench,
} from "../../components/master-data-maintenance-model.ts";

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

test("master data maintenance defines the six read-only maintenance objects", () => {
  assert.deepEqual(
    MASTER_DATA_MAINTENANCE_ENTITIES.map((entity) => entity.label),
    ["坐席", "职场", "供应商", "项目", "技能", "绑定关系"],
  );
});

test("master data maintenance workbench shows an empty read-only state without source batches", () => {
  const summary = summarizeMasterDataMaintenanceWorkbench([]);

  assert.equal(summary.tone, "empty");
  assert.equal(summary.totalObjects, 6);
  assert.equal(summary.readyObjects, 0);
  assert.equal(summary.blockedObjects, 6);
  assert.equal(summary.sourceVersionLabel, "暂无主数据业务版本");
  assert.equal(summary.rows.length, 6);
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
  assert.equal(summary.readyObjects, 6);
  assert.equal(summary.blockedObjects, 0);
  assert.equal(summary.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(summary.latestBatchLabel, "BATCH-MD-001");
  assert.equal(summary.rows[0].statusLabel, "只读可查看");
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
  assert.equal(summary.blockedObjects, 6);
  assert.equal(summary.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(summary.latestBatchLabel, "BATCH-MD-002");
  assert.match(summary.detail, /最新主数据批次尚未应用/);
  assert.equal(summary.rows[0].statusLabel, "待同步");
  assert.equal(summary.rows[0].blockerSummary, "最新主数据批次尚未应用，当前仍按上一已应用版本只读展示");
});

test("master data maintenance resolves known entity keys", () => {
  assert.equal(getMasterDataMaintenanceEntity("skills")?.label, "技能");
  assert.equal(getMasterDataMaintenanceEntity("missing"), null);
});

test("master data entity detail exposes source context and empty reference impact without fabrication", () => {
  const detail = summarizeMasterDataMaintenanceEntityDetail("bindings", [baseBatch]);

  assert.equal(detail.entity.label, "绑定关系");
  assert.equal(detail.sourceVersionLabel, "BATCH-MD-001::v1");
  assert.equal(detail.sourceBatchHref, "/data-quality/import-batches/BATCH-MD-001");
  assert.equal(detail.effectivePeriodLabel, "暂无实体级有效期明细");
  assert.equal(detail.freezeStatusLabel, "暂无实体级冻结明细");
  assert.equal(detail.referenceImpacts.length, 4);
  assert.deepEqual(
    detail.referenceImpacts.map((impact) => impact.label),
    ["排班引用", "预测引用", "登录/状态引用", "比对与复核引用"],
  );
  assert.equal(detail.referenceImpacts[0].countLabel, "不伪造数量");
  assert.equal(detail.referenceImpacts[0].tone, "empty");
});

test("master data entity detail keeps a blocked source state when no applied version exists", () => {
  const detail = summarizeMasterDataMaintenanceEntityDetail("agents", [
    {
      ...baseBatch,
      application_status: "not_applied",
      applied_record_count: 0,
    },
  ]);

  assert.equal(detail.tone, "blocked");
  assert.equal(detail.sourceVersionLabel, "暂无主数据业务版本");
  assert.match(detail.detail, /尚未应用/);
  assert.equal(detail.referenceImpacts[0].detail, "来源版本未就绪，暂不展示引用影响。");
});
