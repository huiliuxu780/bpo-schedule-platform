import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { test } from "node:test"

const sidebar = readFileSync("components/app-sidebar.tsx", "utf8")
const siteHeader = readFileSync("components/site-header.tsx", "utf8")
const appShell = readFileSync("components/app-shell.tsx", "utf8")

function assertPrefixNavItem(title, href) {
  assert.match(
    sidebar,
    new RegExp(
      `title: "${title}"[\\s\\S]+?href: "${href.replaceAll("/", "\\/")}"[\\s\\S]+?activeMatch: "prefix"`
    ),
    `${title} should use prefix matching for child routes`
  )
}

test("sidebar keeps confirmed navigation modules and rejects generic data-quality modules", () => {
  assert.match(sidebar, /const primaryNav: NavItem\[\] = \[/)
  assert.match(sidebar, /title: "经营总览"/)
  assert.match(sidebar, /title: "排班计划"/)
  assert.match(sidebar, /title: "履约风险"/)
  assert.match(sidebar, /title: "不可用记录"/)
  assert.match(sidebar, /title: "班次明细"/)
  assert.match(sidebar, /<SidebarGroupLabel>运营数据<\/SidebarGroupLabel>/)
  assert.match(sidebar, /title: "登录\/状态日志"/)
  assert.match(sidebar, /<SidebarGroupLabel>主数据<\/SidebarGroupLabel>/)

  assert.doesNotMatch(sidebar, /title: "质量中心"/)
  assert.doesNotMatch(sidebar, /title: "数据质量中心"/)
  assert.doesNotMatch(sidebar, /title: "导入中心"/)
  assert.doesNotMatch(sidebar, /href: "\/data-quality"/)
})

test("sidebar exposes current local MVP operational routes without legacy demo labels", () => {
  assert.match(sidebar, /title: "班次明细"/)
  assert.match(sidebar, /href: "\/shift-details"/)
  assert.match(sidebar, /title: "不可用记录"/)
  assert.match(sidebar, /href: "\/unavailability"/)
  assert.doesNotMatch(sidebar, /title: "不可用管理"/)
})

test("master-data detail create and edit pages use parent-path sidebar matching", () => {
  assertPrefixNavItem("客服人员", "/master-data/agents")
  assertPrefixNavItem("组织", "/master-data/organizations")
  assertPrefixNavItem("职场", "/master-data/sites")
  assertPrefixNavItem("供应商", "/master-data/vendors")
  assertPrefixNavItem("技能", "/master-data/skills")
})

test("breadcrumb is owned by the app shell header", () => {
  assert.match(appShell, /<SiteHeader[\s\S]+breadcrumbItems={breadcrumbItems}/)
  assert.match(siteHeader, /data-slot="site-header"/)
  assert.match(siteHeader, /data-slot="site-header-breadcrumb"/)
  assert.match(siteHeader, /data-slot="site-header-title"/)
  assert.match(siteHeader, /<h1 className="sr-only" data-slot="site-header-title">\{title\}<\/h1>/)
})
