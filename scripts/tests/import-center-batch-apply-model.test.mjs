import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportBatchApplyUrl,
  summarizeImportApplyActionGuidance,
  summarizeImportAppliedResultCard,
  summarizeImportReadinessIssueGroups,
  summarizeImportSingleBatchApplyAction,
  summarizeImportBatchApplyResultNotice,
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
