import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportBatchApplyUrl,
  buildImportBatchDetailUrl,
  buildImportFieldMappingTemplateDeactivateUrl,
  buildImportFieldMappingTemplateDetailUrl,
  buildImportFieldMappingTemplateCreateUrl,
  buildImportFieldMappingTemplateNewWorkspaceHref,
  buildImportFieldMappingTemplateUploadHref,
  buildImportFieldMappingTemplateWorkspaceHref,
  buildImportUploadWorkspaceHref,
  buildImportUploadWorkspaceResultHref,
  buildImportFieldMappingTemplatesUrl,
  buildImportRowCorrectionUrl,
  formatFieldMappingTemplateSummary,
  formatImportRowErrorField,
  formatImportRowStatus,
  summarizeImportApplyActionGuidance,
  summarizeImportAppliedResultCard,
  summarizeImportReadinessIssueGroups,
  summarizeImportBatchDetailReadability,
  summarizeImportRowCorrectionNotice,
  summarizeImportTemplateFitHint,
  summarizeImportTemplateFitDetail,
  summarizeImportTemplateUploadPrefill,
  summarizeImportUploadResultGuidance,
  summarizeImportSingleBatchApplyAction,
  summarizeImportBatchApplyResultNotice,
  summarizeImportFieldMappingTemplateActionNotice,
  summarizeImportFieldMappingTemplateDetail,
  summarizeImportFieldMappingTemplates,
  summarizeImportBatchDetail,
  getImportRowStandardFieldsPreview,
} = jiti("../../components/import-center-model.ts");

const baseBatch = {
  batch_id: "BATCH-MD-001",
  file_name: "master.csv",
  file_type: "master_data",
  uploaded_by: "ops",
  uploaded_at: "2026-05-29T09:00:00+08:00",
  business_date_from: "2026-05-01",
  business_date_to: "2026-05-31",
  processing_status: "completed",
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

test("import center mapping template URL builder supports all templates and file type filtering", () => {
  assert.equal(
    buildImportFieldMappingTemplatesUrl(undefined, "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates",
  );
  assert.equal(
    buildImportFieldMappingTemplatesUrl("master_data", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates?file_type=master_data",
  );
  assert.equal(
    buildImportFieldMappingTemplateCreateUrl("http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates",
  );
});

test("import center field mapping template detail URLs encode template path", () => {
  assert.equal(
    buildImportFieldMappingTemplateNewWorkspaceHref(),
    "/data-quality/field-mapping-templates/new",
  );
  assert.equal(
    buildImportFieldMappingTemplateWorkspaceHref("TPL/MD 001"),
    "/data-quality/field-mapping-templates/TPL%2FMD%20001",
  );
  assert.equal(
    buildImportFieldMappingTemplateWorkspaceHref("TPL/MD 001", {
      batchId: "BATCH/CSV 001",
    }),
    "/data-quality/field-mapping-templates/TPL%2FMD%20001?batchId=BATCH%2FCSV+001",
  );
  assert.equal(
    buildImportFieldMappingTemplateDetailUrl("TPL/MD 001", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates/TPL%2FMD%20001",
  );
  assert.equal(
    buildImportFieldMappingTemplateDeactivateUrl(
      "TPL/MD 001",
      "http://127.0.0.1:8000",
    ),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates/TPL%2FMD%20001/deactivate",
  );
});

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

test("import center field mapping template action notice summarizes update and deactivate results", () => {
  assert.deepEqual(
    summarizeImportFieldMappingTemplateActionNotice({
      status: "success",
      action: "create",
      reason: undefined,
      templateId: "TPL-MD-001",
    }),
    {
      tone: "success",
      title: "模板已创建",
      detail: "字段映射模板 TPL-MD-001 已创建，可在上传时作为启用模板复用。",
      nextAction: "继续检查当前模板字段覆盖，或返回批次处理页选择该模板上传。",
    },
  );
  assert.deepEqual(
    summarizeImportFieldMappingTemplateActionNotice({
      status: "success",
      action: "update",
      reason: undefined,
      templateId: "TPL-MD-001",
    }),
    {
      tone: "success",
      title: "模板已更新",
      detail: "字段映射模板 TPL-MD-001 已保存最新名称和字段映射。",
      nextAction: "返回批次处理页重新选择模板，或继续检查当前模板字段覆盖。",
    },
  );
  assert.deepEqual(
    summarizeImportFieldMappingTemplateActionNotice({
      status: "failed",
      action: "deactivate",
      reason: "api_404",
      templateId: "TPL-MD-001",
    }),
    {
      tone: "failed",
      title: "模板停用失败",
      detail: "字段映射模板 TPL-MD-001 未完成停用：api_404。",
      nextAction: "检查模板是否仍存在，再重新提交停用。",
    },
  );
  assert.equal(
    summarizeImportFieldMappingTemplateActionNotice({
      status: undefined,
      action: undefined,
      reason: undefined,
      templateId: "TPL-MD-001",
    }),
    null,
  );
});

test("import center mapping template summary previews stable field pairs", () => {
  assert.equal(
    formatFieldMappingTemplateSummary({
      template_id: "TPL-MD-001",
      template_name: "主数据 source_key",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
        "工号": "employee_id",
        "城市": "worksite",
      },
      created_by: "ops",
      created_at: "2026-05-29T10:00:00+08:00",
      is_active: true,
    }),
    "source_key -> source_key, 姓名 -> employee_name, 工号 -> employee_id +1",
  );
});

test("import center detail and correction URL builders encode batch and row path", () => {
  assert.equal(
    buildImportBatchDetailUrl("BATCH/CSV 001", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/persisted/BATCH%2FCSV%20001",
  );
  assert.equal(
    buildImportRowCorrectionUrl("BATCH/CSV 001", 3, "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches/BATCH%2FCSV%20001/rows/3/correct",
  );
});

test("import center failed row preview prefers standard fields over raw data", () => {
  assert.deepEqual(
    getImportRowStandardFieldsPreview({
      row_id: 1,
      batch_id: "B1",
      row_number: 2,
      row_status: "failed",
      source_key: null,
      error_field: "source_key",
      error_code: "MISSING_REQUIRED_FIELD",
      error_message: "source_key is required",
      raw_data: {
        source: "csv",
        standard_fields: {
          employee_id: "E001",
          employee_name: "张敏",
        },
      },
    }),
    '{"employee_id":"E001","employee_name":"张敏"}',
  );

  assert.deepEqual(
    getImportRowStandardFieldsPreview({
      row_id: 2,
      batch_id: "B1",
      row_number: 3,
      row_status: "failed",
      source_key: null,
      error_field: "source_key",
      error_code: "MISSING_REQUIRED_FIELD",
      error_message: "source_key is required",
      raw_data: {
        employee_id: "E002",
      },
    }),
    '{"employee_id":"E002"}',
  );
});

test("import center detail summary counts persisted row statuses", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-DETAIL-001",
      file_name: "detail.csv",
      file_type: "master_data",
      uploaded_by: "ops",
      uploaded_at: "2026-05-29T11:00:00+08:00",
      business_date_from: "2026-05-01",
      business_date_to: "2026-05-31",
      processing_status: "completed_with_errors",
      total_rows: 4,
      success_rows: 2,
      failed_rows: 1,
      warning_rows: 1,
    },
    rows: [
      { row_id: 1, batch_id: "BATCH-DETAIL-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-DETAIL-001", row_number: 2, row_status: "failed", source_key: null, error_field: "source_key", error_code: "MISSING", error_message: "missing", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-DETAIL-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: null, error_code: "WARN", error_message: "warn", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-DETAIL-001", row_number: 4, row_status: "success", source_key: "A4", error_field: null, error_code: null, error_message: null, raw_data: {} },
    ],
    failed_rows: [],
    versions: [
      {
        version_id: "BATCH-DETAIL-001::v1",
        batch_id: "BATCH-DETAIL-001",
        version_type: "master_data",
        business_date_from: "2026-05-01",
        business_date_to: "2026-05-31",
        created_at: "2026-05-29T11:00:00+08:00",
      },
    ],
  };

  assert.deepEqual(summarizeImportBatchDetail(detail), {
    totalRows: 4,
    successRows: 2,
    failedRows: 1,
    warningRows: 1,
    versionCount: 1,
    workspaceTabs: [
      { key: "overview", label: "总览" },
      { key: "processing", label: "处理摘要" },
      { key: "exception-trace", label: "异常追踪" },
      { key: "versions", label: "版本记录" },
      { key: "rows", label: "行结果" },
    ],
  });
});

test("import center batch detail readability explains next review focus", () => {
  const detail = {
    batch: {
      batch_id: "BATCH-DETAIL-001",
      file_name: "detail.csv",
      file_type: "master_data",
      uploaded_by: "ops",
      uploaded_at: "2026-05-29T11:00:00+08:00",
      business_date_from: "2026-05-01",
      business_date_to: "2026-05-31",
      processing_status: "completed_with_errors",
      total_rows: 4,
      success_rows: 2,
      failed_rows: 1,
      warning_rows: 1,
    },
    rows: [
      { row_id: 1, batch_id: "BATCH-DETAIL-001", row_number: 1, row_status: "success", source_key: "A1", error_field: null, error_code: null, error_message: null, raw_data: {} },
      { row_id: 2, batch_id: "BATCH-DETAIL-001", row_number: 2, row_status: "failed", source_key: null, error_field: "source_key", error_code: "MISSING", error_message: "missing", raw_data: {} },
      { row_id: 3, batch_id: "BATCH-DETAIL-001", row_number: 3, row_status: "warning", source_key: "A3", error_field: "employee_id", error_code: "WARN", error_message: "warn", raw_data: {} },
      { row_id: 4, batch_id: "BATCH-DETAIL-001", row_number: 4, row_status: "success", source_key: "A4", error_field: null, error_code: null, error_message: null, raw_data: {} },
    ],
    failed_rows: [],
    versions: [
      {
        version_id: "BATCH-DETAIL-001::v1",
        batch_id: "BATCH-DETAIL-001",
        version_type: "master_data",
        business_date_from: "2026-05-01",
        business_date_to: "2026-05-31",
        created_at: "2026-05-29T11:00:00+08:00",
      },
    ],
  };

  assert.deepEqual(summarizeImportBatchDetailReadability(detail), {
    tone: "blocked",
    title: "先处理失败行",
    detail: "当前批次共 4 行，1 行失败、1 行警告；失败行会阻塞应用。",
    nextAction: "先查看全部行结果中的错误字段和失败原因，再进入失败行修正。",
    focusLabel: "失败行",
    errorFieldSummary: "source_key、employee_id",
  });

  assert.deepEqual(
    summarizeImportBatchDetailReadability({
      ...detail,
      rows: detail.rows.filter((row) => row.row_status !== "failed"),
      versions: [],
    }),
    {
      tone: "warning",
      title: "缺少版本记录",
      detail: "当前批次有 3 行结果但还没有版本记录；需要先确认导入版本是否生成。",
      nextAction: "优先查看版本记录区域和应用准备度，确认是否存在版本缺口。",
      focusLabel: "版本记录",
      errorFieldSummary: "employee_id",
    },
  );

  assert.equal(formatImportRowErrorField({ ...detail.rows[1], error_field: "source_key" }), "source_key");
  assert.equal(formatImportRowErrorField({ ...detail.rows[0], error_field: null }), "无");
});

test("import center row status formatter is stable for detail drilldown", () => {
  assert.equal(formatImportRowStatus("success"), "成功");
  assert.equal(formatImportRowStatus("failed"), "失败");
  assert.equal(formatImportRowStatus("warning"), "警告");
});

test("import center row correction notice summarizes success and remaining work", () => {
  assert.deepEqual(
    summarizeImportRowCorrectionNotice({
      status: "success",
      row: "3",
      remainingFailedRows: 2,
    }),
    {
      tone: "success",
      title: "第 3 行已修正",
      detail: "当前批次仍有 2 行待修正。",
      nextAction: "继续处理剩余失败行，完成后再查看批次准备度。",
    },
  );

  assert.deepEqual(
    summarizeImportRowCorrectionNotice({
      status: "success",
      row: "3",
      remainingFailedRows: 0,
    }),
    {
      tone: "success",
      title: "第 3 行已修正",
      detail: "当前批次已没有失败行。",
      nextAction: "查看上方批次准备度和批次明细，确认是否仍有阻塞原因。",
    },
  );
});

test("import center row correction notice explains failed correction reasons", () => {
  assert.deepEqual(
    summarizeImportRowCorrectionNotice({
      status: "failed",
      reason: "invalid_json",
      row: "2",
      remainingFailedRows: 1,
    }),
    {
      tone: "failed",
      title: "修正失败",
      detail: "标准字段不是合法 JSON 对象。",
      nextAction: "检查字段 JSON、行号后重新提交。",
    },
  );

  assert.equal(
    summarizeImportRowCorrectionNotice({
      status: "idle",
      remainingFailedRows: 1,
    }),
    null,
  );
});

test("import center field mapping template summary tracks inventory and coverage", () => {
  assert.deepEqual(
    summarizeImportFieldMappingTemplates([
      {
        template_id: "TPL-MD-001",
        template_name: "主数据 source_key",
        file_type: "master_data",
        field_mapping: {
          source_key: "source_key",
          "姓名": "employee_name",
        },
        created_by: "ops",
        created_at: "2026-05-29T10:00:00+08:00",
        is_active: true,
      },
      {
        template_id: "TPL-SCH-001",
        template_name: "排班基础模板",
        file_type: "personnel_schedule",
        field_mapping: {
          source_key: "source_key",
          "日期": "business_date",
          "开始": "start_time",
        },
        created_by: "planner",
        created_at: "2026-05-29T11:00:00+08:00",
        is_active: false,
      },
    ]),
    {
      totalTemplates: 2,
      activeTemplates: 1,
      inactiveTemplates: 1,
      coveredFileTypes: 2,
      totalMappedFields: 5,
      workspaceTabs: [
        { key: "overview", label: "总览" },
        { key: "fit", label: "模板适配" },
        { key: "templates", label: "模板列表" },
      ],
    },
  );
});

test("import center field mapping template detail exposes task workspaces", () => {
  assert.deepEqual(
    summarizeImportFieldMappingTemplateDetail({
      template_id: "TPL-MD-001",
      template_name: "主数据 source_key",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
      },
      created_by: "ops",
      created_at: "2026-05-29T10:00:00+08:00",
      is_active: true,
    }),
    {
      mappedFieldCount: 2,
      statusLabel: "启用",
      summaryText: "source_key -> source_key, 姓名 -> employee_name",
      workspaceTabs: [
        { key: "overview", label: "总览" },
        { key: "maintenance", label: "维护表单" },
        { key: "mapping", label: "字段明细" },
      ],
    },
  );
});

test("import center template fit hint recommends active template by selected file type", () => {
  const templates = [
    {
      template_id: "TPL-MD-LOW",
      template_name: "主数据基础模板",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
      },
      created_by: "ops",
      created_at: "2026-05-29T10:00:00+08:00",
      is_active: true,
    },
    {
      template_id: "TPL-MD-FULL",
      template_name: "主数据完整模板",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
        "工号": "employee_id",
      },
      created_by: "ops",
      created_at: "2026-05-29T11:00:00+08:00",
      is_active: true,
    },
    {
      template_id: "TPL-SCHEDULE-OFF",
      template_name: "停用排班模板",
      file_type: "personnel_schedule",
      field_mapping: {
        source_key: "source_key",
      },
      created_by: "ops",
      created_at: "2026-05-29T12:00:00+08:00",
      is_active: false,
    },
  ];

  assert.deepEqual(summarizeImportTemplateFitHint("master_data", templates), {
    fileType: "master_data",
    status: "matched",
    matchingTemplates: 2,
    activeMatchingTemplates: 2,
    recommendedTemplateId: "TPL-MD-FULL",
    recommendedTemplateName: "主数据完整模板",
    mappedFieldCount: 3,
    detail: "已找到 2 个启用模板，推荐使用“主数据完整模板”。",
    nextAction: "选择同类型模板后上传；如 CSV 表头不一致，再改用手填字段映射 JSON。",
  });

  assert.deepEqual(summarizeImportTemplateFitHint("personnel_schedule", templates), {
    fileType: "personnel_schedule",
    status: "missing",
    matchingTemplates: 1,
    activeMatchingTemplates: 0,
    recommendedTemplateId: null,
    recommendedTemplateName: null,
    mappedFieldCount: 0,
    detail: "人员排班没有启用模板。",
    nextAction: "先使用手填字段映射 JSON 上传；模板维护在对应页面中处理。",
  });

  assert.deepEqual(
    summarizeImportTemplateFitHint("login_log", templates, "字段映射模板 API 返回 500"),
    {
      fileType: "login_log",
      status: "error",
      matchingTemplates: 0,
      activeMatchingTemplates: 0,
      recommendedTemplateId: null,
      recommendedTemplateName: null,
      mappedFieldCount: 0,
      detail: "字段映射模板读取失败：字段映射模板 API 返回 500",
      nextAction: "保留手填字段映射 JSON 上传，或稍后重试模板读取。",
    },
  );
});

test("import center template fit detail ranks matching templates and reports standard field gaps", () => {
  const templates = [
    {
      template_id: "TPL-MD-LOW",
      template_name: "主数据基础模板",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
      },
      created_by: "ops",
      created_at: "2026-05-29T10:00:00+08:00",
      is_active: true,
    },
    {
      template_id: "TPL-MD-FULL",
      template_name: "主数据完整模板",
      file_type: "master_data",
      field_mapping: {
        source_key: "source_key",
        "姓名": "employee_name",
        "工号": "employee_id",
        "项目": "project_id",
      },
      created_by: "ops",
      created_at: "2026-05-29T11:00:00+08:00",
      is_active: true,
    },
    {
      template_id: "TPL-SCH",
      template_name: "排班模板",
      file_type: "personnel_schedule",
      field_mapping: {
        source_key: "source_key",
      },
      created_by: "planner",
      created_at: "2026-05-29T12:00:00+08:00",
      is_active: false,
    },
  ];

  assert.deepEqual(summarizeImportTemplateFitDetail("master_data", templates), {
    fileType: "master_data",
    status: "matched",
    matchingTemplates: 2,
    activeMatchingTemplates: 2,
    inactiveMatchingTemplates: 0,
    recommendedTemplateId: "TPL-MD-FULL",
    recommendedTemplateName: "主数据完整模板",
    recommendedMappedFieldCount: 4,
    mappedStandardFields: ["employee_id", "employee_name", "project_id", "source_key"],
    missingStandardFields: ["worksite_id", "supplier_id"],
    templateOptions: [
      {
        templateId: "TPL-MD-FULL",
        templateName: "主数据完整模板",
        isActive: true,
        mappedFieldCount: 4,
        mappedStandardFields: ["employee_id", "employee_name", "project_id", "source_key"],
        missingStandardFields: ["worksite_id", "supplier_id"],
        mappingPairs: [
          { sourceField: "source_key", standardField: "source_key" },
          { sourceField: "姓名", standardField: "employee_name" },
          { sourceField: "工号", standardField: "employee_id" },
          { sourceField: "项目", standardField: "project_id" },
        ],
      },
      {
        templateId: "TPL-MD-LOW",
        templateName: "主数据基础模板",
        isActive: true,
        mappedFieldCount: 2,
        mappedStandardFields: ["employee_name", "source_key"],
        missingStandardFields: [
          "employee_id",
          "worksite_id",
          "supplier_id",
          "project_id",
        ],
        mappingPairs: [
          { sourceField: "source_key", standardField: "source_key" },
          { sourceField: "姓名", standardField: "employee_name" },
        ],
      },
    ],
    title: "推荐使用主数据完整模板",
    detail: "当前主数据有 2 个启用模板；推荐模板覆盖 4 个字段，仍缺 2 个建议字段。",
    nextAction: "优先使用推荐模板；如果 CSV 表头不一致，继续用手填字段映射 JSON 兜底。",
  });

  assert.deepEqual(summarizeImportTemplateFitDetail("status_log", templates), {
    fileType: "status_log",
    status: "missing",
    matchingTemplates: 0,
    activeMatchingTemplates: 0,
    inactiveMatchingTemplates: 0,
    recommendedTemplateId: null,
    recommendedTemplateName: null,
    recommendedMappedFieldCount: 0,
    mappedStandardFields: [],
    missingStandardFields: [
      "source_key",
      "employee_id",
      "status_code",
      "start_time",
      "end_time",
    ],
    templateOptions: [],
    title: "暂无启用状态日志模板",
    detail: "当前状态日志没有启用模板；上传前需要手填字段映射 JSON。",
    nextAction: "先使用手填字段映射 JSON；模板新增或维护留到对应页面。",
  });
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

test("import center applied result card shows version result and next-step entries", () => {
  assert.deepEqual(
    summarizeImportAppliedResultCard({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM084-SCH-001",
        file_type: "personnel_schedule",
        application_status: "applied",
        application_target: "personnel_schedule",
        import_version_id: "SCH-VERSION-001",
        applied_record_count: 36,
      },
      readiness: {
        batch_id: "BATCH-IM084-SCH-001",
        file_type: "personnel_schedule",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 36,
        success_rows: 36,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "applied",
        application_target: "personnel_schedule",
        import_version_id: "SCH-VERSION-001",
        applied_record_count: 36,
      },
      comparisonRuns: [
        {
          run_id: "RUN-IM085-SA-001",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-VERSION-001",
          actual_import_version_id: "STATUS-VERSION-001",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          status: "completed",
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 24,
          created_at: "2026-06-03T11:00:00+08:00",
        },
        {
          run_id: "RUN-IM085-FS-001",
          comparison_type: "forecast_vs_schedule",
          forecast_version_id: "FC-VERSION-001",
          schedule_version_id: "SCH-VERSION-001",
          actual_import_version_id: null,
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          status: "completed",
          total_results: 12,
          total_gap_agents: 6,
          total_late_minutes: null,
          created_at: "2026-06-03T10:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-IM085-001",
          source_result_type: "schedule_actual",
          source_result_id: 101,
          business_date: "2026-05-01",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-06-03T11:30:00+08:00",
        },
      ],
      applyStatus: "success",
    }),
    {
      tone: "success",
      statusLabel: "刚完成应用",
      title: "业务版本结果已生成",
      detail: "当前批次已写入人员排班，生成版本 SCH-VERSION-001；已定位对应版本结果，可直接进入对比运行或复核案例。",
      targetLabel: "人员排班",
      versionLabel: "SCH-VERSION-001",
      appliedRecordLabel: "36 条",
      primaryActionLabel: "查看对应对比运行",
      primaryHref: "/data-quality/comparison-runs/RUN-IM085-SA-001",
      secondaryActionLabel: "查看复核案例",
      secondaryHref:
        "/data-quality/review-cases?businessDate=2026-05-01&sourceResultType=schedule_actual",
    },
  );

  assert.deepEqual(
    summarizeImportAppliedResultCard({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM084-MD-001",
        application_status: "applied",
        application_target: "master_data",
        import_version_id: "MD-VERSION-001",
        applied_record_count: 10,
      },
      readiness: null,
      applyStatus: undefined,
    }),
    {
      tone: "done",
      statusLabel: "已应用",
      title: "业务版本结果已生成",
      detail: "当前批次已写入主数据，生成版本 MD-VERSION-001；建议先核对版本记录，再进入下游结果追踪。",
      targetLabel: "主数据",
      versionLabel: "MD-VERSION-001",
      appliedRecordLabel: "10 条",
      primaryActionLabel: "查看版本记录",
      primaryHref: "/data-quality/BATCH-IM084-MD-001?tab=batch-detail",
      secondaryActionLabel: "查看下游结果追踪",
      secondaryHref: "/data-quality/BATCH-IM084-MD-001?tab=result-trace",
    },
  );

  assert.deepEqual(
    summarizeImportAppliedResultCard({
      batch: {
        ...baseBatch,
        batch_id: "BATCH-IM119-LOGIN-001",
        file_type: "login_log",
        application_status: "applied",
        application_target: "actual_logs",
        import_version_id: "LOGIN-VERSION-001",
        applied_record_count: 42,
      },
      readiness: {
        batch_id: "BATCH-IM119-LOGIN-001",
        file_type: "login_log",
        readiness_status: "ready",
        blockers: [],
        row_blockers: [],
        total_rows: 42,
        success_rows: 42,
        failed_rows: 0,
        warning_rows: 0,
        version_count: 1,
        application_status: "applied",
        application_target: "actual_logs",
        import_version_id: "LOGIN-VERSION-001",
        applied_record_count: 42,
      },
      comparisonRuns: [
        {
          run_id: "RUN-IM119-SA-LOGIN-001",
          comparison_type: "schedule_vs_actual",
          forecast_version_id: null,
          schedule_version_id: "SCH-VERSION-001",
          actual_import_version_id: "LOGIN-VERSION-001",
          business_date_from: "2026-05-01",
          business_date_to: "2026-05-01",
          status: "completed",
          total_results: 18,
          total_gap_agents: null,
          total_late_minutes: 24,
          created_at: "2026-06-03T11:00:00+08:00",
        },
      ],
      reviewCases: [
        {
          case_id: "CASE-IM119-LOGIN-001",
          source_result_type: "schedule_actual",
          source_result_id: 101,
          business_date: "2026-05-01",
          owner_id: "supervisor-01",
          severity: "high",
          status: "open",
          created_at: "2026-06-03T11:30:00+08:00",
        },
      ],
      applyStatus: "success",
    }),
    {
      tone: "success",
      statusLabel: "刚完成应用",
      title: "业务版本结果已生成",
      detail:
        "当前批次已写入登录/状态日志，生成版本 LOGIN-VERSION-001；已定位对应版本结果，可直接进入对比运行或复核案例。",
      targetLabel: "登录/状态日志",
      versionLabel: "LOGIN-VERSION-001",
      appliedRecordLabel: "42 条",
      primaryActionLabel: "查看对应对比运行",
      primaryHref: "/data-quality/comparison-runs/RUN-IM119-SA-LOGIN-001",
      secondaryActionLabel: "查看复核案例",
      secondaryHref:
        "/data-quality/review-cases?businessDate=2026-05-01&sourceResultType=schedule_actual",
    },
  );

  assert.equal(
    summarizeImportAppliedResultCard({
      batch: baseBatch,
      readiness: null,
      applyStatus: undefined,
    }),
    null,
  );
});

test("import center readiness issue groups prioritize blockers by operational type", () => {
  assert.deepEqual(
    summarizeImportReadinessIssueGroups({
      batch_id: "BATCH-READINESS-001",
      file_type: "master_data",
      readiness_status: "blocked",
      blockers: [
        { code: "IMPORT_FAILED_ROWS_PRESENT", message: "导入批次仍存在失败行。" },
        { code: "IMPORT_NO_SUCCESS_ROWS", message: "导入批次没有可应用的成功行。" },
      ],
      row_blockers: [
        {
          row_number: 1,
          code: "REQUIRED_FIELD_MISSING",
          field_name: "source_key",
          message: "缺少必填字段 source_key",
        },
        {
          row_number: 2,
          code: "REQUIRED_FIELD_MISSING",
          field_name: "employee_id",
          message: "缺少必填字段 employee_id",
        },
      ],
      total_rows: 2,
      success_rows: 0,
      failed_rows: 1,
      warning_rows: 0,
      version_count: 0,
      application_status: "not_applied",
      application_target: "master_data_snapshot",
      import_version_id: null,
      applied_record_count: 0,
    }),
    [
      {
        key: "failed_rows",
        tone: "blocked",
        title: "失败行阻塞",
        count: 1,
        detail: "当前批次还有 1 行失败，应用写入前必须先修正。",
        nextAction: "先进入失败行修正，补齐标准字段并重新检查准备度。",
        evidence: ["失败 1 行", "成功 0 行", "警告 0 行"],
      },
      {
        key: "row_required_fields",
        tone: "blocked",
        title: "行级必填字段缺口",
        count: 2,
        detail: "2 个行级阻塞正在影响应用准备度。",
        nextAction: "优先处理第 1 行 source_key；补齐后重新查看准备度。",
        evidence: ["第 1 行 source_key", "第 2 行 employee_id"],
      },
      {
        key: "version",
        tone: "blocked",
        title: "导入版本缺口",
        count: 1,
        detail: "当前批次还没有可追溯导入版本。",
        nextAction: "检查上传解析结果和版本生成记录，确认版本存在后再进入应用前复核。",
        evidence: ["版本 0", "导入版本 未生成"],
      },
      {
        key: "batch_blockers",
        tone: "blocked",
        title: "批次级阻塞",
        count: 2,
        detail: "2 个批次级阻塞仍需处理。",
        nextAction: "按阻塞码处理批次问题后重新检查准备度。",
        evidence: ["IMPORT_FAILED_ROWS_PRESENT", "IMPORT_NO_SUCCESS_ROWS"],
      },
    ],
  );

  assert.deepEqual(
    summarizeImportReadinessIssueGroups({
      batch_id: "BATCH-READY-001",
      file_type: "master_data",
      readiness_status: "ready",
      blockers: [],
      row_blockers: [],
      total_rows: 3,
      success_rows: 3,
      failed_rows: 0,
      warning_rows: 0,
      version_count: 1,
      application_status: "not_applied",
      application_target: "master_data_snapshot",
      import_version_id: "BATCH-READY-001::v1",
      applied_record_count: 0,
    }),
    [
      {
        key: "ready",
        tone: "ready",
        title: "准备度已通过",
        count: 0,
        detail: "当前批次没有应用前阻塞，已生成可追溯导入版本。",
        nextAction: "继续复核应用目标和下游结果；可在应用入口完成写入。",
        evidence: ["成功 3 行", "版本 BATCH-READY-001::v1"],
      },
    ],
  );
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
