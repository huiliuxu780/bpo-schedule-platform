import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  siteHeader: new URL("../../components/site-header.tsx", import.meta.url),
  agents: new URL("../../components/master-data-maintenance-agents.tsx", import.meta.url),
  actions: new URL("../../components/master-data-maintenance-actions.tsx", import.meta.url),
};

test("visible action placement is encoded in header, filter, list, row, and dialog scopes", async () => {
  const [siteHeader, agents, actions] = await Promise.all(
    Object.values(files).map((file) => readFile(file, "utf8"))
  );

  assert.match(
    siteHeader,
    /data-action-scope="page"/,
    "AppShell header actions must be marked as page-level actions"
  );

  assert.match(
    agents,
    /function AgentManagementFilterPanel[\s\S]+data-action-scope="filter"/,
    "filter submit/reset controls must stay inside a filter action scope"
  );
  assert.match(
    agents,
    /function AgentManagementListToolbar[\s\S]+data-action-scope="list"/,
    "bulk/list controls must stay inside a list toolbar scope"
  );
  assert.match(
    agents,
    /data-action-scope="row"/,
    "view/edit/freeze controls must stay inside a row action scope"
  );
  assert.match(
    agents,
    /function AgentFreezeDialog[\s\S]+data-action-scope="danger"/,
    "dangerous confirmation controls must stay inside a dialog danger action scope"
  );

  const filterPanel = agents.match(
    /function AgentManagementFilterPanel[\s\S]+?function AgentManagementListToolbar/
  )?.[0] ?? "";
  assert.match(filterPanel, /查询/);
  assert.match(filterPanel, /重置/);
  assert.doesNotMatch(filterPanel, /新建/);
  assert.doesNotMatch(filterPanel, /批量导入/);

  const listToolbar = agents.match(
    /function AgentManagementListToolbar[\s\S]+?function AgentManagementFilterField/
  )?.[0] ?? "";
  assert.match(listToolbar, /bulkActions\.map/);
  assert.doesNotMatch(listToolbar, /新建/);
  assert.doesNotMatch(listToolbar, /批量导入/);

  assert.match(actions, /^export function MasterDataAgentPageActions/m);
  assert.match(actions, /新建/);
  assert.match(actions, /批量导入/);
  assert.doesNotMatch(actions, /查询/);
  assert.doesNotMatch(actions, /重置/);
});
