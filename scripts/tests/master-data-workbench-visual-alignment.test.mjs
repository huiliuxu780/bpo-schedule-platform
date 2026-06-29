import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

function read(path) {
  return readFileSync(path, "utf8")
}

test("master data sidebar only exposes real master data entries", () => {
  const source = read("components/app-sidebar.tsx")

  assert.match(source, /title: "客服人员"[\s\S]+?href: "\/master-data\/agents"/)
  assert.match(source, /title: "组织"[\s\S]+?href: "\/master-data\/organizations"/)
  assert.match(source, /title: "职场"[\s\S]+?href: "\/master-data\/sites"/)
  assert.match(source, /title: "供应商"[\s\S]+?href: "\/master-data\/vendors"/)
  assert.match(source, /title: "技能"[\s\S]+?href: "\/master-data\/skills"/)
  assert.doesNotMatch(source, /title: "设置"[\s\S]+?href: "\/master-data\/agents"/)
  assert.doesNotMatch(source, /const navSecondary: NavItem\[\]/)
})

test("agent management list removes disabled pseudo bulk actions", () => {
  const source = read("components/master-data-maintenance-agents.tsx")
  const model = read("components/master-data-maintenance-agent-model.ts")

  assert.doesNotMatch(source, /AgentManagementListToolbar/)
  assert.doesNotMatch(source, /已选 0 项/)
  assert.doesNotMatch(source, /summary\.bulkActions\.map/)
  assert.doesNotMatch(model, /bulkActions:/)
})

test("agent management page uses shared metric cards and dedicated table shell", () => {
  const source = read("components/master-data-maintenance-agents.tsx")

  assert.match(source, /from "@\/components\/metric-card"/)
  assert.match(source, /MasterDataAgentTable/)
  assert.match(source, /grid gap-4 md:grid-cols-2 xl:grid-cols-4/)
  assert.match(source, /MetricCard as SummaryMetricCard/)
})

test("master data agent table delegates table structure to MainTableShell", () => {
  const source = read("components/master-data-agent-table.tsx")

  assert.match(source, /"use client"/)
  assert.match(source, /MainTableShell/)
  assert.match(source, /title="客服人员"/)
  assert.match(source, /columnLabels/)
  assert.match(source, /暂无符合条件的客服人员/)
  assert.match(source, /技能维护/)
  assert.doesNotMatch(source, /<Table\b/)
  assert.doesNotMatch(source, /summary\.bulkActions/)
})

test("reference and organization management pages use shared metric cards and table shells", () => {
  const source = read("components/master-data-maintenance-references.tsx")

  assert.match(source, /from "@\/components\/metric-card"/)
  assert.match(source, /MasterDataReferenceTable/)
  assert.match(source, /MasterDataOrganizationTable/)
  assert.match(source, /grid gap-4 md:grid-cols-2 xl:grid-cols-4/)
  assert.doesNotMatch(source, /<Table\b/)
})

test("master data reference table delegates table structure to MainTableShell", () => {
  const source = read("components/master-data-reference-table.tsx")

  assert.match(source, /"use client"/)
  assert.match(source, /MainTableShell/)
  assert.match(source, /title=\{title\}/)
  assert.match(source, /暂无\$\{title\}记录/)
  assert.match(source, /hasActionRows/)
})

test("master data organization table delegates table structure to MainTableShell", () => {
  const source = read("components/master-data-organization-table.tsx")

  assert.match(source, /"use client"/)
  assert.match(source, /MainTableShell/)
  assert.match(source, /title="组织"/)
  assert.match(source, /暂无组织记录/)
  assert.match(source, /organizationPathLabel/)
})
