import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  formatFieldMappingTemplateSummary,
  summarizeImportFieldMappingTemplateActionNotice,
  summarizeImportFieldMappingTemplateDetail,
  summarizeImportFieldMappingTemplates,
} = jiti("../../components/import-center-model.ts");


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
