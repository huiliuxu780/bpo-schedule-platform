import assert from "node:assert/strict";
import test from "node:test";

import {
  buildImportApiUrl,
  buildImportBatchDetailUrl,
  buildImportFieldMappingTemplatesUrl,
  buildImportRowCorrectionUrl,
  buildImportUploadUrl,
  formatFieldMappingTemplateSummary,
  formatImportRowStatus,
  summarizeImportApplyActionGuidance,
  summarizeImportExceptionGuidance,
  summarizeImportRowCorrectionNotice,
  summarizeImportTemplateFitHint,
  summarizeImportFieldMappingTemplates,
  summarizeImportBatchDetail,
  getImportRowStandardFieldsPreview,
  formatImportFileType,
  getImportBatchHealth,
  summarizeImportBatches,
} from "../../components/import-center-model.ts";

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

test("import center model formats file types for business-facing UI", () => {
  assert.equal(formatImportFileType("master_data"), "主数据");
  assert.equal(formatImportFileType("personnel_schedule"), "人员排班");
  assert.equal(formatImportFileType("demand_forecast"), "需求预测");
  assert.equal(formatImportFileType("login_log"), "登录日志");
  assert.equal(formatImportFileType("status_log"), "状态日志");
});

test("import center summary uses live batch rows without sample data", () => {
  const summary = summarizeImportBatches([
    baseBatch,
    {
      ...baseBatch,
      batch_id: "BATCH-SCH-001",
      file_type: "personnel_schedule",
      failed_rows: 2,
      warning_rows: 1,
      application_status: "applied",
      applied_record_count: 8,
    },
  ]);

  assert.deepEqual(summary, {
    totalBatches: 2,
    totalRows: 20,
    failedRows: 2,
    warningRows: 1,
    appliedBatches: 1,
    notAppliedBatches: 1,
  });
});

test("import center health prefers readiness blockers over row counts", () => {
  assert.equal(
    getImportBatchHealth(baseBatch, {
      batch_id: "BATCH-MD-001",
      file_type: "master_data",
      readiness_status: "blocked",
      blockers: [{ code: "IMPORT_BATCH_HAS_FAILED_ROWS", message: "有失败行" }],
      row_blockers: [],
      total_rows: 10,
      success_rows: 9,
      failed_rows: 1,
      warning_rows: 0,
      version_count: 1,
      application_status: "not_applied",
      application_target: "master_data",
      import_version_id: "BATCH-MD-001::v1",
      applied_record_count: 0,
    }),
    "blocked",
  );
  assert.equal(getImportBatchHealth({ ...baseBatch, warning_rows: 1 }), "warning");
  assert.equal(getImportBatchHealth(baseBatch), "ready_candidate");
});

test("import center API URL builder keeps local API configurable", () => {
  assert.equal(
    buildImportApiUrl("/api/v1/import-batches", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-batches",
  );
  assert.equal(
    buildImportApiUrl("api/v1/import-batches/B1/apply-readiness", "http://127.0.0.1:8000/"),
    "http://127.0.0.1:8000/api/v1/import-batches/B1/apply-readiness",
  );
});

test("import center upload URL builder encodes CSV upload query", () => {
  const url = new URL(
    buildImportUploadUrl(
      {
        batchId: "BATCH-CSV-001",
        fileName: "主数据.csv",
        fileType: "master_data",
        uploadedBy: "ops",
        businessDateFrom: "2026-05-01",
        businessDateTo: "2026-05-31",
        fieldMapping: '{"source_key":"source_key","姓名":"employee_name"}',
      },
      "http://127.0.0.1:8000",
    ),
  );

  assert.equal(url.origin, "http://127.0.0.1:8000");
  assert.equal(url.pathname, "/api/v1/import-batches/upload-csv");
  assert.equal(url.searchParams.get("batch_id"), "BATCH-CSV-001");
  assert.equal(url.searchParams.get("file_name"), "主数据.csv");
  assert.equal(url.searchParams.get("file_type"), "master_data");
  assert.equal(url.searchParams.get("uploaded_by"), "ops");
  assert.equal(url.searchParams.get("business_date_from"), "2026-05-01");
  assert.equal(url.searchParams.get("business_date_to"), "2026-05-31");
  assert.equal(
    url.searchParams.get("field_mapping"),
    '{"source_key":"source_key","姓名":"employee_name"}',
  );
});

test("import center upload URL builder can submit a field mapping template id", () => {
  const url = new URL(
    buildImportUploadUrl(
      {
        batchId: "BATCH-TPL-001",
        fileName: "schedule.csv",
        fileType: "personnel_schedule",
        uploadedBy: "ops",
        businessDateFrom: "2026-05-01",
        businessDateTo: "2026-05-31",
        fieldMapping: '{"source_key":"source_key"}',
        templateId: "TPL-SCHEDULE-001",
      },
      "http://127.0.0.1:8000",
    ),
  );

  assert.equal(url.pathname, "/api/v1/import-batches/upload-csv");
  assert.equal(url.searchParams.get("template_id"), "TPL-SCHEDULE-001");
  assert.equal(url.searchParams.get("field_mapping"), '{"source_key":"source_key"}');
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
  });
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
      nextAction: "检查字段 JSON、行号和本地 API 状态后重新提交。",
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
    nextAction: "先使用手填字段映射 JSON 上传；模板维护在单独任务中处理。",
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
    nextAction: "复核版本和目标对象后，再由后续受控任务提供应用写入入口。",
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
      title: "准备度暂不可判断",
      detail: "准备度 API 返回 500",
      nextAction: "先确认本地 API 状态；不要在准备度未知时执行应用写入。",
    },
  );
});

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
        nextAction: "先确认本地 API 和 /api/v1/import-batches；批次不可读时不要继续判断准备度。",
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
        nextAction: "先恢复准备度接口；准备度未知时不要执行应用写入或下游复核。",
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
        nextAction: "本轮先使用手填字段映射 JSON；模板维护留到后续受控任务。",
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
