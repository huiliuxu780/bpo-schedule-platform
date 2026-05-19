import assert from "node:assert/strict";
import test from "node:test";

import {
  getImportContractDrilldown,
  getImportContractDrilldowns,
  summarizeImportContractDrilldowns,
} from "../../lib/import-drilldown.ts";
import { fallbackProductionMvpContracts } from "../../lib/production-mvp-contracts.ts";

test("import contract drilldowns expose business routes instead of internal PRD pages", () => {
  const rows = getImportContractDrilldowns(fallbackProductionMvpContracts);

  assert.equal(rows.length, 3);
  assert.deepEqual(
    rows.map((row) => row.id),
    ["master-data", "personnel-schedules", "fulfillment-comparison"]
  );
  assert.deepEqual(
    rows.map((row) => row.href),
    [
      "/master-data-relations",
      "/shift-details",
      "/anomaly-review",
    ]
  );
});

test("import contract drilldown summary keeps field and rule counts traceable", () => {
  const rows = getImportContractDrilldowns(fallbackProductionMvpContracts);
  const summary = summarizeImportContractDrilldowns(rows);

  assert.equal(summary.contractCount, 3);
  assert.equal(summary.totalFields, 84);
  assert.equal(summary.requiredFields, 60);
  assert.equal(summary.validationRules, 41);
  assert.equal(summary.deferredActions.length, 4);
});

test("import contract drilldown lookup returns the personnel schedule expansion", () => {
  const row = getImportContractDrilldown(
    "personnel-schedules",
    fallbackProductionMvpContracts
  );

  assert.equal(row?.title, "人员级排班合同");
  assert.equal(row?.href, "/shift-details");
  assert.equal(row?.highlights.includes("0.5h 展开"), true);
});
