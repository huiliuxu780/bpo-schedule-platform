import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const masterDataAgentDetailPagePath = new URL("../../app/master-data/agents/[employeeId]/page.tsx", import.meta.url);
const masterDataSkillDetailPagePath = new URL("../../app/master-data/skills/[skillId]/page.tsx", import.meta.url);
const masterDataOrganizationDetailPagePath = new URL("../../app/master-data/organizations/[organizationId]/page.tsx", import.meta.url);
const masterDataAgentsComponentPath = new URL("../../components/master-data-maintenance-agents.tsx", import.meta.url);
const masterDataDetailsComponentPath = new URL("../../components/master-data-maintenance-details.tsx", import.meta.url);

test("agent detail stays under customer-service personnel context", async () => {
  await access(masterDataAgentDetailPagePath);
  const agentDetailSource = await readFile(masterDataAgentDetailPagePath, "utf8");
  const agentsSource = await readFile(masterDataAgentsComponentPath, "utf8");

  assert.equal(
    agentDetailSource.includes("fetchMasterDataWorkplaceServiceTeams"),
    true,
    "agent detail should read workplace service teams for read-only relationship context",
  );
  assert.equal(
    agentDetailSource.includes("fetchMasterDataWorkplaceBindings"),
    true,
    "agent detail should read workplace bindings for supplier-team matching",
  );
  assert.equal(
    agentsSource.includes("MasterDataAgentDetailPage"),
    true,
    "agent detail should render through a dedicated personnel detail component",
  );
  assert.equal(
    agentsSource.includes("关联服务团队"),
    true,
    "agent detail should expose a read-only associated service-team section",
  );
  assert.equal(agentDetailSource.includes("合同"), false);
  assert.equal(agentDetailSource.includes("结算"), false);
  assert.equal(agentDetailSource.includes("最低人力"), false);
});

test("organization detail stays read-only under organization context", async () => {
  await access(masterDataOrganizationDetailPagePath);
  const organizationDetailSource = await readFile(masterDataOrganizationDetailPagePath, "utf8");
  const detailsSource = await readFile(masterDataDetailsComponentPath, "utf8");

  assert.equal(
    organizationDetailSource.includes("fetchMasterDataOrganizations"),
    true,
    "organization detail should read organization rows for read-only hierarchy context",
  );
  assert.equal(
    organizationDetailSource.includes("fetchMasterDataEmployees"),
    true,
    "organization detail should read personnel rows for current people context",
  );
  assert.equal(
    detailsSource.includes("MasterDataOrganizationDetailPage"),
    true,
    "organization detail should render through a dedicated organization detail component",
  );
  assert.equal(
    detailsSource.includes("直接下级组织"),
    true,
    "organization detail should expose direct child organizations",
  );
  assert.equal(
    detailsSource.includes("归属人员"),
    true,
    "organization detail should expose current people under the organization",
  );
  assert.equal(organizationDetailSource.includes("合同"), false);
  assert.equal(organizationDetailSource.includes("结算"), false);
  assert.equal(organizationDetailSource.includes("最低人力"), false);
});

test("skill detail stays read-only under skill context", async () => {
  await access(masterDataSkillDetailPagePath);
  const skillDetailSource = await readFile(masterDataSkillDetailPagePath, "utf8");
  const detailsSource = await readFile(masterDataDetailsComponentPath, "utf8");

  assert.equal(
    skillDetailSource.includes("fetchMasterDataSkills"),
    true,
    "skill detail should read skill rows for read-only skill context",
  );
  assert.equal(
    skillDetailSource.includes("fetchMasterDataEmployees"),
    true,
    "skill detail should read personnel rows for current people context",
  );
  assert.equal(
    detailsSource.includes("MasterDataSkillDetailPage"),
    true,
    "skill detail should render through a dedicated skill detail component",
  );
  assert.equal(
    detailsSource.includes("技能组信息"),
    true,
    "skill detail should expose skill basic information",
  );
  assert.equal(
    detailsSource.includes("拥有该技能的客服人员"),
    true,
    "skill detail should expose people who own the skill",
  );
  assert.equal(skillDetailSource.includes("合同"), false);
  assert.equal(skillDetailSource.includes("结算"), false);
  assert.equal(skillDetailSource.includes("最低人力"), false);
});
