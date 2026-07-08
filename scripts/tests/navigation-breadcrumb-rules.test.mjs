import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const sidebar = readFileSync("components/app-sidebar.tsx", "utf8")
const siteHeader = readFileSync("components/site-header.tsx", "utf8")
const appShell = readFileSync("components/app-shell.tsx", "utf8")

function assertActivePrefix(title, href) {
  assert.match(
    sidebar,
    new RegExp(
      `title: "${title}"[\\s\\S]+?"${href.replaceAll("/", "\\/")}"`
    ),
    `${title} should own ${href} as a compatible child route`
  )
}

test("sidebar keeps the slim first-level product navigation", () => {
  assert.match(sidebar, /const primaryNav: NavItem\[\] = \[/)
  assert.match(sidebar, /title: "经营总览"[\s\S]+?href: "\/dashboard"/)
  assert.match(sidebar, /title: "排班"[\s\S]+?href: "\/roster-drafts"/)
  assert.match(sidebar, /title: "待办"[\s\S]+?href: "\/roster-change-governance"/)
  assert.match(sidebar, /const systemNav: NavItem = \{[\s\S]+?title: "系统管理"[\s\S]+?href: "\/master-data\/agents"/)

  assert.doesNotMatch(sidebar, /title: "运营工作台"/)
  assert.doesNotMatch(sidebar, /title: "计划与排班"/)
  assert.doesNotMatch(sidebar, /title: "日志数据"/)
  assert.doesNotMatch(sidebar, /title: "主数据"/)
  assert.doesNotMatch(sidebar, /data-slot="sidebar-group-title"/)

  assert.doesNotMatch(sidebar, /title: "质量中心"/)
  assert.doesNotMatch(sidebar, /title: "数据质量中心"/)
  assert.doesNotMatch(sidebar, /title: "导入中心"/)
})

test("sidebar does not expose legacy planning demo routes as product entries", () => {
  assert.doesNotMatch(sidebar, /title: "班次明细"/)
  assert.doesNotMatch(sidebar, /title: "不可用管理"/)
  assert.doesNotMatch(sidebar, /title: "需求计划"/)
  assert.doesNotMatch(sidebar, /title: "排班计划"/)
  assert.doesNotMatch(sidebar, /title: "月班表草稿"/)
  assert.doesNotMatch(sidebar, /title: "正式班表"/)
  assert.doesNotMatch(sidebar, /title: "履约风险"/)
  assert.doesNotMatch(sidebar, /title: "班务申请中心"/)
  assert.doesNotMatch(sidebar, /title: "班务变更申请"/)
})

test("compatible child routes still map to their slim parent entry", () => {
  assertActivePrefix("排班", "/demand-plans")
  assertActivePrefix("排班", "/schedule-plans")
  assertActivePrefix("排班", "/published-roster")
  assertActivePrefix("排班", "/schedule-risks")
  assertActivePrefix("待办", "/duty-requests")
  assertActivePrefix("待办", "/roster-change-governance")
  assertActivePrefix("系统管理", "/master-data/skills")
  assertActivePrefix("系统管理", "/actual-logs/production")
})

test("sidebar does not map placeholder settings to customer personnel", () => {
  assert.doesNotMatch(sidebar, /title: "设置"[\s\S]+?href: "\/master-data\/agents"/)
  assert.doesNotMatch(sidebar, /const navSecondary: NavItem\[\]/)
})

test("breadcrumb is owned by the app shell header", () => {
  assert.match(appShell, /<SiteHeader[\s\S]+breadcrumbItems={breadcrumbItems}/)
  assert.match(siteHeader, /data-slot="site-header"/)
  assert.match(siteHeader, /data-slot="site-header-breadcrumb"/)
  assert.match(siteHeader, /data-slot="site-header-title"/)
  assert.match(siteHeader, /<h1 className="sr-only" data-slot="site-header-title">\{title\}<\/h1>/)
})
