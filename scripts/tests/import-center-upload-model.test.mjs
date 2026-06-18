import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportFieldMappingTemplateUploadHref,
  buildImportUploadWorkspaceHref,
  buildImportUploadWorkspaceResultHref,
  summarizeImportTemplateUploadPrefill,
  summarizeImportUploadResultGuidance,
} = jiti("../../components/import-center-model.ts");


test("import center field mapping template upload href carries batch and template prefill", () => {
  assert.equal(
    buildImportFieldMappingTemplateUploadHref("BATCH/CSV 001", "TPL/MD 001"),
    "/data-quality/BATCH%2FCSV%20001?templateId=TPL%2FMD+001#import-detail-workspace",
  );
});

test("import center upload workspace href supports direct template prefill", () => {
  assert.equal(buildImportUploadWorkspaceHref(), "/data-quality/uploads/new");
  assert.equal(
    buildImportUploadWorkspaceHref({ templateId: "TPL/MD 001" }),
    "/data-quality/uploads/new?templateId=TPL%2FMD+001",
  );
  assert.equal(
    buildImportUploadWorkspaceHref({ fileType: "master_data" }),
    "/data-quality/uploads/new?fileType=master_data",
  );
  assert.equal(
    buildImportUploadWorkspaceHref({
      fileType: "personnel_schedule",
      templateId: "TPL/SCH 001",
    }),
    "/data-quality/uploads/new?fileType=personnel_schedule&templateId=TPL%2FSCH+001",
  );
});

test("import center upload workspace result href preserves upload feedback", () => {
  assert.equal(
    buildImportUploadWorkspaceResultHref({
      status: "success",
      batchId: "BATCH/CSV 001",
    }),
    "/data-quality/uploads/new?upload=success&batch=BATCH%2FCSV+001",
  );
  assert.equal(
    buildImportUploadWorkspaceResultHref({
      status: "failed",
      reason: "api_409",
      batchId: "BATCH/CSV 001",
    }),
    "/data-quality/uploads/new?upload=failed&reason=api_409&batch=BATCH%2FCSV+001",
  );
});

test("import center upload prefill summarizes selected active template", () => {
  const summary = summarizeImportTemplateUploadPrefill(
    [
      {
        template_id: "TPL-MD-001",
        template_name: "主数据模板",
        file_type: "master_data",
        field_mapping: { source_key: "source_key", name: "employee_name" },
        is_active: true,
        created_by: "ops",
        created_at: "2026-06-03T09:00:00+08:00",
      },
      {
        template_id: "TPL-OFF",
        template_name: "停用模板",
        file_type: "master_data",
        field_mapping: { source_key: "source_key" },
        is_active: false,
        created_by: "ops",
        created_at: "2026-06-03T09:00:00+08:00",
      },
    ],
    "TPL-MD-001",
  );

  assert.deepEqual(summary, {
    selectedTemplateId: "TPL-MD-001",
    defaultTemplateId: "TPL-MD-001",
    fileType: "master_data",
    tone: "success",
    title: "已预选字段映射模板",
    detail: "主数据模板 · 主数据 · 2 个字段",
    nextAction: "确认 CSV 文件表头匹配该模板后上传；如不匹配，可改选其他模板或手填字段映射 JSON。",
  });
});

test("import center upload prefill warns when template is inactive or missing", () => {
  const inactive = summarizeImportTemplateUploadPrefill(
    [
      {
        template_id: "TPL-OFF",
        template_name: "停用模板",
        file_type: "master_data",
        field_mapping: { source_key: "source_key" },
        is_active: false,
        created_by: "ops",
        created_at: "2026-06-03T09:00:00+08:00",
      },
    ],
    "TPL-OFF",
  );
  const missing = summarizeImportTemplateUploadPrefill([], "TPL-MISSING");

  assert.deepEqual(inactive, {
    selectedTemplateId: "TPL-OFF",
    defaultTemplateId: "",
    fileType: null,
    tone: "failed",
    title: "模板不可用于上传",
    detail: "字段映射模板 TPL-OFF 已停用，上传表单不会默认使用它。",
    nextAction: "请选择其他启用模板，或手填字段映射 JSON 后上传。",
  });
  assert.deepEqual(missing, {
    selectedTemplateId: "TPL-MISSING",
    defaultTemplateId: "",
    fileType: null,
    tone: "failed",
    title: "模板不可用于上传",
    detail: "字段映射模板 TPL-MISSING 未包含在当前可选模板列表。",
    nextAction: "请返回模板管理确认模板状态，或手填字段映射 JSON 后上传。",
  });
});

test("import center upload result guidance links uploads back to batch review", () => {
  assert.deepEqual(
    summarizeImportUploadResultGuidance({
      status: "success",
      batchId: "BATCH-CSV-001",
      reason: null,
    }),
    {
      tone: "success",
      title: "CSV 上传成功",
      detail: "批次 BATCH-CSV-001 已提交，可继续查看行结果和应用准备度。",
      batchHref: "/data-quality/BATCH-CSV-001",
      primaryActionLabel: "进入处理详情",
      nextAction: "查看批次行结果、失败行和应用准备度；确认无阻塞后再应用到业务数据。",
    },
  );

  assert.deepEqual(
    summarizeImportUploadResultGuidance({
      status: "failed",
      batchId: "BATCH/CSV 001",
      reason: "api_409",
    }),
    {
      tone: "failed",
      title: "CSV 上传失败",
      detail: "上传返回 409，可能是批次号重复或请求不满足校验。",
      batchHref: "/data-quality/BATCH%2FCSV%20001",
      primaryActionLabel: "回看批次",
      nextAction: "检查批次号、字段映射 JSON、模板选择和 CSV 表头后重新上传；如果批次已存在，先查看原批次结果。",
    },
  );

  assert.deepEqual(
    summarizeImportUploadResultGuidance({
      status: "failed",
      batchId: null,
      reason: "missing_required_fields",
    }),
    {
      tone: "failed",
      title: "CSV 上传失败",
      detail: "缺少批次号、业务日期或 CSV 文件。",
      batchHref: null,
      primaryActionLabel: "补齐后重试",
      nextAction: "补齐必填字段、确认选择 CSV 文件后重新上传。",
    },
  );

  assert.equal(
    summarizeImportUploadResultGuidance({
      status: undefined,
      batchId: null,
      reason: null,
    }),
    null,
  );
});
