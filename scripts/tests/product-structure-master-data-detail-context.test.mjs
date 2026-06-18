import assert from "node:assert/strict";
import { access, readdir, readFile, stat } from "node:fs/promises";
import test from "node:test";

const appRootPath = new URL("../../app/", import.meta.url);
const componentsRootPath = new URL("../../components/", import.meta.url);
const masterDataAgentDetailPagePath = new URL("../../app/master-data/agents/[employeeId]/page.tsx", import.meta.url);
const masterDataAgentDataPath = new URL("../../app/master-data/agents/data.ts", import.meta.url);
const masterDataWorkplaceDetailPagePath = new URL("../../app/master-data/sites/[workplaceId]/page.tsx", import.meta.url);
const masterDataWorkplaceServiceTeamCreatePagePath = new URL("../../app/master-data/sites/[workplaceId]/service-teams/new/page.tsx", import.meta.url);
const masterDataWorkplaceServiceTeamDetailPagePath = new URL("../../app/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]/page.tsx", import.meta.url);
const masterDataWorkplaceServiceTeamEditPagePath = new URL("../../app/master-data/sites/[workplaceId]/service-teams/[serviceTeamId]/edit/page.tsx", import.meta.url);
const masterDataWorkplaceServiceTeamActionsPath = new URL("../../app/master-data/sites/[workplaceId]/service-teams/actions.ts", import.meta.url);
const masterDataVendorDetailPagePath = new URL("../../app/master-data/vendors/[vendorId]/page.tsx", import.meta.url);
const masterDataSkillDetailPagePath = new URL("../../app/master-data/skills/[skillId]/page.tsx", import.meta.url);
const masterDataOrganizationDetailPagePath = new URL("../../app/master-data/organizations/[organizationId]/page.tsx", import.meta.url);
const masterDataActionsComponentPath = new URL("../../components/master-data-maintenance-actions.tsx", import.meta.url);
const masterDataAgentsComponentPath = new URL("../../components/master-data-maintenance-agents.tsx", import.meta.url);
const masterDataDetailsComponentPath = new URL("../../components/master-data-maintenance-details.tsx", import.meta.url);

async function collectSourceFiles(directoryUrl) {
  const entries = await readdir(directoryUrl, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryUrl = new URL(entry.name, directoryUrl);

    if (entry.isDirectory()) {
      files.push(...await collectSourceFiles(new URL(`${entry.name}/`, directoryUrl)));
      continue;
    }

    if (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx")) {
      const entryStat = await stat(entryUrl);
      if (entryStat.isFile()) {
        files.push(entryUrl);
      }
    }
  }

  return files;
}

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

test("workplace detail keeps service-team maintenance nested under workplace detail", async () => {
  await access(masterDataWorkplaceServiceTeamCreatePagePath);
  await access(masterDataWorkplaceServiceTeamDetailPagePath);
  await access(masterDataWorkplaceServiceTeamEditPagePath);
  await access(masterDataWorkplaceServiceTeamActionsPath);

  const workplaceDetailSource = await readFile(masterDataWorkplaceDetailPagePath, "utf8");
  const actionsSource = await readFile(masterDataActionsComponentPath, "utf8");
  const detailsSource = await readFile(masterDataDetailsComponentPath, "utf8");
  const detailModelSource = await readFile(new URL("../../components/master-data-maintenance-detail-model.ts", import.meta.url), "utf8");

  assert.equal(
    workplaceDetailSource.includes('fetchMasterDataReferences("vendors")'),
    true,
    "workplace detail should read supplier master data for supplier service teams",
  );
  assert.equal(
    detailsSource.includes("人员/绑定数"),
    true,
    "workplace service-team table should show aggregated people or binding counts",
  );
  assert.equal(
    workplaceDetailSource.includes("fetchMasterDataWorkplaceServiceTeams"),
    true,
    "workplace detail should fetch maintained service-team records",
  );
  assert.equal(
    actionsSource.includes("新增服务团队"),
    true,
    "workplace detail should provide a page action to the nested create page",
  );
  assert.equal(
    detailsSource.includes("冻结服务团队"),
    true,
    "service-team freeze should use a dialog in the workplace detail context",
  );
  assert.equal(
    detailsSource.includes("查看"),
    true,
    "workplace service-team table should link to the nested service-team detail page",
  );
  assert.equal(
    detailsSource.includes("MasterDataWorkplaceServiceTeamDetailPage"),
    true,
    "workplace service-team detail should be rendered by a dedicated page component",
  );
  const serviceTeamDetailSource = await readFile(masterDataWorkplaceServiceTeamDetailPagePath, "utf8");
  assert.equal(
    serviceTeamDetailSource.includes("fetchMasterDataEmployees"),
    true,
    "service-team detail should read employees for the associated people list",
  );
  assert.equal(
    serviceTeamDetailSource.includes("fetchMasterDataWorkplaceBindings"),
    true,
    "service-team detail should read workplace bindings for supplier-team people",
  );
  assert.equal(
    detailsSource.includes("关联人员"),
    true,
    "service-team detail should render a read-only associated people section",
  );
  assert.equal(detailsSource.includes("合同"), false);
  assert.equal(detailsSource.includes("结算"), false);
  assert.equal(detailsSource.includes("最低人力"), false);
  assert.equal(detailModelSource.includes("createServiceTeamHref"), true);
  assert.equal(detailsSource.includes("<form"), true);
});

test("vendor service context stays nested under vendor detail", async () => {
  await access(masterDataVendorDetailPagePath);
  const vendorDetailSource = await readFile(masterDataVendorDetailPagePath, "utf8");
  const detailsSource = await readFile(masterDataDetailsComponentPath, "utf8");

  assert.equal(
    vendorDetailSource.includes("fetchMasterDataWorkplaceServiceTeams"),
    true,
    "vendor detail should read maintained service teams for reverse supplier links",
  );
  assert.equal(
    detailsSource.includes("查看团队"),
    true,
    "vendor detail should link to existing workplace service-team details",
  );

  const sourceFiles = [
    ...await collectSourceFiles(appRootPath),
    ...await collectSourceFiles(componentsRootPath),
  ];

  for (const fileUrl of sourceFiles) {
    const source = await readFile(fileUrl, "utf8");

    assert.equal(source.includes("供应商合同"), false, fileUrl.pathname);
    assert.equal(source.includes("结算比例"), false, fileUrl.pathname);
    assert.equal(source.includes("最低人力"), false, fileUrl.pathname);
  }
});

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
