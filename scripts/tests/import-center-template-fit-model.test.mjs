import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportTemplateFitHint,
  summarizeImportTemplateFitDetail,
} = jiti("../../components/import-center-model.ts");


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
