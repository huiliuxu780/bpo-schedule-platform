import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const masterDataAgentDataPath = new URL("../../app/master-data/agents/data.ts", import.meta.url);
const masterDataDetailsComponentPath = new URL("../../components/master-data-maintenance-details.tsx", import.meta.url);

test("master data visible terminology does not expose operating subject concepts", async () => {
  const detailsSource = await readFile(masterDataDetailsComponentPath, "utf8");
  const agentDataSource = await readFile(masterDataAgentDataPath, "utf8");
  const visibleMasterDataSources = [
    ["master data details", detailsSource],
    ["master data data loader", agentDataSource],
  ];

  for (const [label, source] of visibleMasterDataSources) {
    assert.equal(
      source.includes("职场运营主体"),
      false,
      `${label} should not expose workplace operating subject wording`,
    );
    assert.equal(
      source.includes("运营主体"),
      false,
      `${label} should not expose operating subject wording`,
    );
  }

  assert.equal(
    detailsSource.includes("服务团队"),
    true,
    "workplace detail should describe self-owned and supplier teams as service teams",
  );
});
