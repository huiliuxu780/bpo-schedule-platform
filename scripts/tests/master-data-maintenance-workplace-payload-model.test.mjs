import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildMasterDataWorkplaceMaintenanceApiPath,
  buildMasterDataWorkplaceMaintenancePayload,
} = jiti("../../components/master-data-maintenance-model.ts");

test("workplace maintenance payload maps create edit and freeze actions", () => {
  assert.equal(
    buildMasterDataWorkplaceMaintenanceApiPath("SH 01/华东"),
    "/api/v1/master-data/workplaces/SH%2001%2F%E5%8D%8E%E4%B8%9C/maintenance",
  );

  assert.deepEqual(
    buildMasterDataWorkplaceMaintenancePayload({
      action: "create",
      sourceBatchId: "BATCH-MD-001",
      workplaceId: "SH-01",
      workplaceName: "上海职场",
      status: "active",
      effectiveFrom: "2026-06-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "create",
      source_batch_id: "BATCH-MD-001",
      reference_name: "上海职场",
      status: "active",
      effective_from: "2026-06-01",
      effective_to: "2026-12-31",
    },
  );
  assert.deepEqual(
    buildMasterDataWorkplaceMaintenancePayload({
      action: "edit",
      sourceBatchId: "BATCH-MD-001",
      workplaceId: "SH-01",
      workplaceName: "上海职场东区",
      status: "inactive",
      effectiveFrom: "2026-07-01",
      effectiveTo: "2026-12-31",
    }),
    {
      action: "edit",
      source_batch_id: "BATCH-MD-001",
      reference_name: "上海职场东区",
      status: "inactive",
      effective_from: "2026-07-01",
      effective_to: "2026-12-31",
    },
  );
  assert.deepEqual(
    buildMasterDataWorkplaceMaintenancePayload({
      action: "freeze",
      sourceBatchId: "BATCH-MD-001",
      workplaceId: "SH-01",
    }),
    {
      action: "freeze",
      source_batch_id: "BATCH-MD-001",
    },
  );
});
