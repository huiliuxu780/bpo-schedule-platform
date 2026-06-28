import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import test from "node:test"

const root = process.cwd()

function readProject(relativePath) {
  return readFileSync(join(root, relativePath), "utf-8")
}

const dashboardPageSrc = readProject("app/dashboard/page.tsx")
const appShellSrc = readProject("components/app-shell.tsx")
const appSidebarSrc = readProject("components/app-sidebar.tsx")
const siteHeaderSrc = readProject("components/site-header.tsx")
const sectionCardsSrc = readProject("components/section-cards.tsx")
const dataTableSrc = readProject("components/data-table.tsx")
const readinessBannerSrc = readProject("components/readiness-banner.tsx")

test("app shell uses the dashboard-01 inset sidebar frame", () => {
  assert.match(appShellSrc, /--sidebar-width/)
  assert.match(appShellSrc, /--header-height/)
  assert.match(appShellSrc, /variant="inset"/)
  assert.match(siteHeaderSrc, /h-\(--header-height\)/)
})

test("sidebar uses flat workbench navigation rather than expanded directory groups", () => {
  assert.match(appSidebarSrc, /快速新建/)
  assert.match(appSidebarSrc, /待处理风险/)
  assert.match(appSidebarSrc, /collapsible="offcanvas"/)
  assert.match(appSidebarSrc, /SidebarGroupLabel>运营数据/)
  assert.match(appSidebarSrc, /SidebarGroupLabel>主数据/)
  assert.match(appSidebarSrc, /icon: Users/)
  assert.match(appSidebarSrc, /icon: Network/)
  assert.match(appSidebarSrc, /icon: MapPin/)
  assert.match(appSidebarSrc, /icon: Handshake/)
  assert.match(appSidebarSrc, /icon: Wrench/)
  assert.doesNotMatch(appSidebarSrc, /groupIcon/)
  assert.doesNotMatch(appSidebarSrc, /CollapsibleTrigger/)
  assert.doesNotMatch(appSidebarSrc, /SidebarMenuSub/)
})

test("normal readiness state stays out of the operator surface", () => {
  assert.match(readinessBannerSrc, /overallSource === "api"[\s\S]+?return null/)
  assert.doesNotMatch(readinessBannerSrc, /后端 API/)
})

test("dashboard content keeps dashboard-01 section rhythm", () => {
  assert.match(dashboardPageSrc, /@container\/main/)
  assert.match(dashboardPageSrc, /md:gap-6/)
  assert.match(dashboardPageSrc, /md:py-6/)
  assert.match(dashboardPageSrc, /SectionCards/)
  assert.match(dashboardPageSrc, /ChartAreaInteractive/)
  assert.match(dashboardPageSrc, /DataTable/)
})

test("dashboard cards use the shadcn metric-card visual rhythm", () => {
  assert.match(sectionCardsSrc, /@container\/card/)
  assert.match(sectionCardsSrc, /CardAction/)
  assert.match(sectionCardsSrc, /CardFooter/)
  assert.match(sectionCardsSrc, /bg-gradient-to-t/)
  assert.match(sectionCardsSrc, /min-h-\[196px\]/)
  assert.match(sectionCardsSrc, /shadow-xs/)
  assert.match(sectionCardsSrc, /line-clamp-1/)
  assert.match(sectionCardsSrc, /tabular-nums/)
  assert.match(sectionCardsSrc, /text-3xl/)
  assert.match(sectionCardsSrc, /href=\{item\.drilldown\.href\}/)
  assert.match(sectionCardsSrc, /className="block h-full"/)
  assert.doesNotMatch(sectionCardsSrc, /variant="ghost" size="sm"/)
})

test("dashboard table uses tabs and column controls like the reference workbench", () => {
  assert.match(dataTableSrc, /TabsList/)
  assert.match(dataTableSrc, /TabsTrigger/)
  assert.match(dataTableSrc, /列控制/)
  assert.match(dataTableSrc, /DropdownMenuCheckboxItem/)
  assert.match(dataTableSrc, /TableHeader className="bg-muted"/)
  assert.match(dataTableSrc, /className="w-full flex-col justify-start gap-6"/)
  assert.doesNotMatch(dataTableSrc, /BPO 异常明细/)
})
