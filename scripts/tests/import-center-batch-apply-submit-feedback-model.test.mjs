import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportSingleBatchApplyAction,
  summarizeImportBatchApplyResultNotice,
} = jiti("../../components/import-center-model.ts");

test("import center single batch apply action exposes a submit only for ready unapplied batches", () => {
  const readyReadiness = {
    batch_id: "BATCH-APPLY-001",
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
    application_target: "master_data_snapshot",
    import_version_id: "BATCH-APPLY-001::v1",
    applied_record_count: 0,
  };

  assert.deepEqual(summarizeImportSingleBatchApplyAction(readyReadiness), {
    tone: "ready",
    canSubmit: true,
    statusLabel: "可应用",
    actionLabel: "应用到业务数据",
    title: "单批次应用已就绪",
    detail: "10 行成功记录将写入 master_data_snapshot。",
    nextAction: "确认版本和应用目标无误后，只对当前批次执行一次应用写入。",
  });

  assert.deepEqual(
    summarizeImportSingleBatchApplyAction({
      ...readyReadiness,
      readiness_status: "blocked",
      failed_rows: 1,
      blockers: [{ code: "IMPORT_FAILED_ROWS_PRESENT", message: "导入批次仍存在失败行。" }],
    }),
    {
      tone: "blocked",
      canSubmit: false,
      statusLabel: "不可应用",
      actionLabel: "不可应用",
      title: "应用前仍有阻塞",
      detail: "导入批次仍存在失败行。",
      nextAction: "先处理失败行、行级缺字段或版本缺口，再重新查看准备度。",
    },
  );

  assert.deepEqual(
    summarizeImportSingleBatchApplyAction({
      ...readyReadiness,
      readiness_status: "blocked",
      application_status: "applied",
      applied_record_count: 10,
    }),
    {
      tone: "done",
      canSubmit: false,
      statusLabel: "已应用",
      actionLabel: "无需重复应用",
      title: "批次已应用",
      detail: "已写入 10 条记录，不需要重复应用。",
      nextAction: "继续查看下游版本、对比结果或复核案例。",
    },
  );

  assert.deepEqual(
    summarizeImportSingleBatchApplyAction(null, "准备度 API 返回 500"),
    {
      tone: "unknown",
      canSubmit: false,
      statusLabel: "准备度未知",
      actionLabel: "不可应用",
      title: "准备度不可判断",
      detail: "准备度 API 返回 500",
      nextAction: "先核对批次明细；准备度未知时先不要应用。",
    },
  );
});

test("import center batch apply result notice summarizes action feedback", () => {
  assert.deepEqual(
    summarizeImportBatchApplyResultNotice({
      status: "success",
      batchId: "BATCH-APPLY-001",
    }),
    {
      tone: "success",
      title: "批次应用成功",
      detail: "批次 BATCH-APPLY-001 已写入对应业务数据。",
      nextAction: "刷新准备度和应用状态后，继续查看下游结果或复核案例。",
    },
  );

  assert.deepEqual(
    summarizeImportBatchApplyResultNotice({
      status: "failed",
      reason: "api_400",
    }),
    {
      tone: "failed",
      title: "批次应用失败",
      detail: "应用返回 400。",
      nextAction: "回到状态检查区查看阻塞项；修正后只对当前批次重试。",
    },
  );

  assert.equal(summarizeImportBatchApplyResultNotice({ status: undefined }), null);
});
