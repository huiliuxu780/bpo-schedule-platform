import assert from "node:assert/strict";
import test from "node:test";

import {
  getImportContractDrilldown,
  getImportContractDrilldowns,
  summarizeImportContractDrilldowns,
} from "../../lib/import-drilldown.ts";
import { fallbackProductionMvpContracts } from "../../lib/production-mvp-contracts.ts";

test("import contract drilldowns expose the three production MVP contract routes", () => {
  const rows = getImportContractDrilldowns(fallbackProductionMvpContracts);

  assert.equal(rows.length, 3);
  assert.deepEqual(
    rows.map((row) => row.id),
    ["master-data", "personnel-schedules", "fulfillment-comparison"]
  );
  assert.deepEqual(
    rows.map((row) => row.href),
    [
      "/production-mvp/master-data",
      "/production-mvp/personnel-schedules",
      "/production-mvp/fulfillment-comparison",
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
  assert.equal(row?.href, "/production-mvp/personnel-schedules");
  assert.equal(row?.highlights.includes("0.5h 展开"), true);
});
