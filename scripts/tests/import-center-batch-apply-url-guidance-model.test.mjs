import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportBatchApplyUrl,
  summarizeImportApplyActionGuidance,
} = jiti("../../components/import-center-model.ts");

test("import center batch apply URL builder selects the existing apply API by file type", () => {
  assert.equal(
    buildImportBatchApplyUrl("BATCH APPLY/001", "master_data", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/BATCH%20APPLY%2F001/apply-master-data",
  );
  assert.equal(
    buildImportBatchApplyUrl("BATCH-SCH-001", "personnel_schedule", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/BATCH-SCH-001/apply-personnel-schedule",
  );
  assert.equal(
    buildImportBatchApplyUrl("BATCH-FC-001", "demand_forecast", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/BATCH-FC-001/apply-forecast",
  );
  assert.equal(
    buildImportBatchApplyUrl("BATCH-LOGIN-001", "login_log", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/BATCH-LOGIN-001/apply-actual-logs",
  );
  assert.equal(
    buildImportBatchApplyUrl("BATCH-STATUS-001", "status_log", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/BATCH-STATUS-001/apply-actual-logs",
  );
});

test("import center apply action guidance explains next step before write actions", () => {
  const readyReadiness = {
    batch_id: "BATCH-MD-001",
    file_type: "master_data",
    readiness_status: "ready",
    blockers: [],
    row_blockers: [],
    total_rows: 10,
    success_rows: 10,
    failed_rows: 0,
    warning_rows: 0,
    version_count: 1,
    application_status: "not_applied",
    application_target: "master_data",
    import_version_id: "BATCH-MD-001::v1",
    applied_record_count: 0,
  };

  assert.deepEqual(summarizeImportApplyActionGuidance(readyReadiness), {
    tone: "ready",
    title: "可进入应用前复核",
    detail: "10 行成功、0 行失败，已生成 1 个版本。",
    nextAction: "复核版本和目标对象后，再应用到业务数据。",
  });

  assert.deepEqual(
    summarizeImportApplyActionGuidance({
      ...readyReadiness,
      readiness_status: "blocked",
      failed_rows: 2,
      blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "批次仍有失败行" }],
    }),
    {
      tone: "blocked",
      title: "先修正失败行",
      detail: "当前批次还有 2 行失败，不能进入应用写入。",
      nextAction: "在失败行修正区逐行补齐标准字段，完成后重新查看准备度。",
    },
  );

  assert.deepEqual(
    summarizeImportApplyActionGuidance({
      ...readyReadiness,
      readiness_status: "blocked",
      row_blockers: [
        {
          row_number: 3,
          code: "MISSING_REQUIRED_FIELD",
          field_name: "employee_id",
          message: "employee_id is required",
        },
        {
          row_number: 4,
          code: "MISSING_REQUIRED_FIELD",
          field_name: "shift_type",
          message: "shift_type is required",
        },
      ],
    }),
    {
      tone: "blocked",
      title: "先补齐行级必填字段",
      detail: "2 个行级阻塞正在影响应用准备度。",
      nextAction: "优先处理第 3 行 employee_id；补齐后重新查看准备度。",
    },
  );

  assert.deepEqual(
    summarizeImportApplyActionGuidance({
      ...readyReadiness,
      readiness_status: "blocked",
      application_status: "applied",
      applied_record_count: 10,
      blockers: [
        {
          code: "IMPORT_BATCH_ALREADY_APPLIED",
          message: "already applied",
        },
      ],
    }),
    {
      tone: "done",
      title: "批次已应用",
      detail: "已写入 10 条记录，不需要重复应用。",
      nextAction: "查看下游版本或结果列表，确认是否还需要复核异常。",
    },
  );

  assert.deepEqual(
    summarizeImportApplyActionGuidance(null, "准备度 API 返回 500"),
    {
      tone: "unknown",
      title: "准备度不可判断",
      detail: "准备度 API 返回 500",
      nextAction: "先核对批次明细；准备度未知时先不要应用。",
    },
  );
});
