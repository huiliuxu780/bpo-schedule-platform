import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportExceptionGuidance,
} = jiti("../../components/import-center-model.ts");

test("import center exception guidance consolidates API and empty-state blockers", () => {
  assert.deepEqual(
    summarizeImportExceptionGuidance({
      batchError: "导入批次 API 返回 500",
      readinessError: null,
      templateError: null,
      selectedBatchId: null,
      batchCount: 0,
      templateCount: 2,
    }),
    [
      {
        scope: "batch_api",
        tone: "blocked",
        title: "批次读取失败",
        detail: "导入批次 API 返回 500",
        nextAction: "先刷新批次列表；批次不可读时先不要继续判断准备度。",
      },
    ],
  );

  assert.deepEqual(
    summarizeImportExceptionGuidance({
      batchError: null,
      readinessError: "准备度 API 返回 404",
      templateError: "字段映射模板 API 返回 500",
      selectedBatchId: "BATCH-MD-001",
      batchCount: 1,
      templateCount: 0,
    }),
    [
      {
        scope: "readiness_api",
        tone: "blocked",
        title: "准备度读取失败",
        detail: "BATCH-MD-001：准备度 API 返回 404",
        nextAction: "先刷新准备度；准备度未知时先不要应用或进入复核。",
      },
      {
        scope: "template_api",
        tone: "warning",
        title: "模板读取失败",
        detail: "字段映射模板 API 返回 500",
        nextAction: "上传仍可使用手填字段映射 JSON；稍后再重试模板读取。",
      },
    ],
  );

  assert.deepEqual(
    summarizeImportExceptionGuidance({
      batchError: null,
      readinessError: null,
      templateError: null,
      selectedBatchId: null,
      batchCount: 0,
      templateCount: 0,
    }),
    [
      {
        scope: "empty_batches",
        tone: "warning",
        title: "暂无导入批次",
        detail: "当前没有可查看或复核的导入批次。",
        nextAction: "先上传 CSV，生成批次、行结果和导入版本后再继续检查准备度。",
      },
      {
        scope: "empty_templates",
        tone: "warning",
        title: "暂无字段映射模板",
        detail: "当前没有启用或停用模板可供选择。",
        nextAction: "可先手填字段映射 JSON，或新建字段映射模板。",
      },
    ],
  );

  assert.deepEqual(
    summarizeImportExceptionGuidance({
      batchError: null,
      readinessError: null,
      templateError: null,
      selectedBatchId: "BATCH-MD-001",
      batchCount: 1,
      templateCount: 2,
    }),
    [
      {
        scope: "ready",
        tone: "ready",
        title: "关键异常态已收敛",
        detail: "批次、准备度和字段映射模板均可读取。",
        nextAction: "继续处理失败行、检查应用前行动建议，或上传下一份文件。",
      },
    ],
  );
});
