import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const { summarizeMasterDataWorkplaceDetail } = jiti(
  "../../components/master-data-maintenance-model.ts",
);

test("workplace detail groups service teams inside the selected workplace", () => {
  const detail = summarizeMasterDataWorkplaceDetail({
    workplaceId: "SH-01",
    workplaces: [
      {
        reference_id: "SH-01",
        reference_name: "上海职场",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        reference_id: "NJ-01",
        reference_name: "南京职场",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
    employees: [
      {
        employee_id: "A-1001",
        employee_name: "张三",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-SELF",
        organization_path: "CC / CCO / 自有团队",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
      {
        employee_id: "A-1002",
        employee_name: "王五",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-SELF",
        organization_path: "CC / CCO / 自有团队",
        workplace_id: "SH-01",
        workplace_name: "上海职场",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
      {
        employee_id: "A-2001",
        employee_name: "李四",
        status: "active",
        employee_type: "internal",
        organization_id: "ORG-NJ",
        organization_path: "CC / CCO / 南京团队",
        workplace_id: "NJ-01",
        workplace_name: "南京职场",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
        skills: [],
      },
    ],
    bindings: [
      {
        binding_id: "BIND-001",
        employee_id: "A-3001",
        supplier_id: "SUP-001",
        workplace_id: "SH-01",
        skill_id: "SKILL-TICKET",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        binding_id: "BIND-003",
        employee_id: "A-3003",
        supplier_id: "SUP-001",
        workplace_id: "SH-01",
        skill_id: "SKILL-HOTLINE",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
      {
        binding_id: "BIND-002",
        employee_id: "A-3002",
        supplier_id: "SUP-002",
        workplace_id: "NJ-01",
        skill_id: "SKILL-HOTLINE",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
    suppliers: [
      {
        reference_id: "SUP-001",
        reference_name: "上海供应商",
        status: "active",
        effective_from: "2026-06-01",
        effective_to: "2026-12-31",
        batch_id: "BATCH-MD-001",
      },
    ],
  });

  assert.equal(detail.found, true);
  assert.equal(detail.title, "上海职场");
  assert.equal(detail.workplace?.display.referenceIdLabel, "SH-01");
  assert.equal(detail.totalOperators, 2);
  assert.equal(detail.internalOperators, 1);
  assert.equal(detail.supplierOperators, 1);
  assert.deepEqual(
    detail.operatorRows.map((row) => [
      row.display.operatorTypeLabel,
      row.display.operatorNameLabel,
      row.display.supplierLabel,
      row.display.recordCountLabel,
      row.display.sourceLabel,
      row.display.effectivePeriodLabel,
    ]),
    [
      [
        "自有团队",
        "CC / CCO / 自有团队",
        "无供应商",
        "2 人",
        "人员档案",
        "2026-06-01 至 2026-12-31",
      ],
      [
        "供应商团队",
        "上海供应商",
        "上海供应商",
        "2 条绑定",
        "人员归属记录",
        "2026-06-01 至 2026-12-31",
      ],
    ],
  );
  assert.equal(JSON.stringify(detail).includes("合同"), false);
  assert.equal(JSON.stringify(detail).includes("结算"), false);
  assert.equal(JSON.stringify(detail).includes("最低人力"), false);
});

test("workplace detail returns not found for unknown workplace id", () => {
  const detail = summarizeMasterDataWorkplaceDetail({
    workplaceId: "UNKNOWN",
    workplaces: [],
    employees: [],
    bindings: [],
  });

  assert.equal(detail.found, false);
  assert.equal(detail.workplace, null);
  assert.equal(detail.operatorRows.length, 0);
});
