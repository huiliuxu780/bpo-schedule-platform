import { expect, test, type Page } from "@playwright/test"

function escapedPathPattern(pathname: string) {
  const escaped = pathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`${escaped}(?:\\?.*)?$`)
}

async function expectPlanDetail(page: Page, detailPath: string) {
  await expect(page).toHaveURL(escapedPathPattern(detailPath))
  await expect(page.getByText("复核链路")).toBeVisible()
}

async function navigateByMainLink(
  page: Page,
  name: string,
  expectedPath: RegExp,
) {
  const link = page.getByRole("main").getByRole("link", { name }).first()
  const href = await link.getAttribute("href")

  expect(href).toMatch(expectedPath)
  await page.goto(href!)
}

test("core local review path keeps plan detail context", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page.getByRole("heading", { name: "经营总览" })).toBeVisible()
  await expect(page.getByText("履约指标趋势")).toBeVisible()

  await page.goto("/demand-plans")
  const demandMain = page.getByRole("main")
  await expect(demandMain.locator("h1", { hasText: "需求计划" })).toBeVisible()
  await expect(demandMain.getByRole("heading", { name: "预测需求" })).toBeVisible()

  await page.goto("/schedule-plans")
  const scheduleMain = page.getByRole("main")
  await expect(scheduleMain.locator("h1", { hasText: "排班计划" })).toBeVisible()
  await expect(
    scheduleMain.getByRole("heading", { name: "排班风险提示" }),
  ).toBeVisible()

  const detailLink = page
    .locator('a[href^="/schedule-plans/"]')
    .filter({ hasText: /^查看$/ })
    .first()
  const detailHref = await detailLink.getAttribute("href")
  expect(detailHref).toMatch(/^\/schedule-plans\/[^/?]+/)
  await page.goto(detailHref!)
  await expect(page).toHaveURL(/\/schedule-plans\/[^/?]+(?:\?.*)?$/)
  const detailPath = new URL(page.url()).pathname
  await expect(page.getByText("复核链路")).toBeVisible()

  await navigateByMainLink(page, "查看风险", /^\/schedule-risks/)
  await expect(page).toHaveURL(/\/schedule-risks(?:\?.*)?$/)
  await expect(page.getByRole("main").locator("h1", { hasText: "风险提示" })).toBeVisible()
  await expect(page.getByText("上下文筛选")).toBeVisible()
  await navigateByMainLink(page, "返回计划详情", /^\/schedule-plans\//)
  await expectPlanDetail(page, detailPath)

  await navigateByMainLink(page, "查看班次", /^\/shift-details/)
  await expect(page).toHaveURL(/\/shift-details(?:\?.*)?$/)
  await expect(page.getByRole("main").locator("h1", { hasText: "班次明细" })).toBeVisible()
  await expect(page.getByText("上下文 drilldown")).toBeVisible()
  await navigateByMainLink(page, "返回计划详情", /^\/schedule-plans\//)
  await expectPlanDetail(page, detailPath)

  await navigateByMainLink(page, "查看不可用", /^\/unavailability/)
  await expect(page).toHaveURL(/\/unavailability(?:\?.*)?$/)
  await expect(
    page.getByRole("main").locator("h1", { hasText: "不可用管理" }),
  ).toBeVisible()
  await expect(page.getByText("上下文 drilldown")).toBeVisible()
  await navigateByMainLink(page, "影响", /^\/unavailability\//)
  await expect(page).toHaveURL(/\/unavailability\/[^?]+\?.*planId=/)
  await expect(
    page.getByRole("main").locator("h1", { hasText: "不可用影响定位" }),
  ).toBeVisible()
  await navigateByMainLink(page, "返回计划详情", /^\/schedule-plans\//)
  await expectPlanDetail(page, detailPath)
})

test("schedule plan list unavailability action keeps plan context", async ({
  page,
}) => {
  await page.goto("/schedule-plans")
  const scheduleMain = page.getByRole("main")
  await expect(scheduleMain.locator("h1", { hasText: "排班计划" })).toBeVisible()

  const firstPlanLink = scheduleMain
    .locator('a[href^="/schedule-plans/"]')
    .filter({ hasText: /^查看$/ })
    .first()
  const planHref = await firstPlanLink.getAttribute("href")
  expect(planHref).toMatch(/^\/schedule-plans\/[^/?]+/)
  const planPath = new URL(planHref!, "http://localhost").pathname
  const planId = planPath.split("/").pop()
  expect(planId).toBeTruthy()

  const planRow = firstPlanLink.locator("xpath=ancestor::tr")
  const unavailabilityLink = planRow.getByRole("link", { name: "不可用" })
  const unavailabilityHref = await unavailabilityLink.getAttribute("href")
  expect(unavailabilityHref).toContain(`planId=${planId}`)
  await page.goto(unavailabilityHref!)

  await expect(page).toHaveURL(/\/unavailability\?.*planId=/)
  await navigateByMainLink(page, "影响", /^\/unavailability\//)
  await expect(page).toHaveURL(/\/unavailability\/[^?]+\?.*planId=/)
  await navigateByMainLink(page, "计划详情", /^\/schedule-plans\//)
  await expectPlanDetail(page, planPath)
})

test("schedule plan draft edit route keeps list context and table controls accessible", async ({
  page,
}) => {
  await page.goto("/schedule-plans?query=苏州&status=draft")
  const scheduleMain = page.getByRole("main")

  await expect(scheduleMain.locator("h1", { hasText: "排班计划" })).toBeVisible()
  await expect(scheduleMain.getByText("本地筛选计划摘要与缺口风险")).toBeVisible()
  await expect(scheduleMain.getByRole("button", { name: "列控制" })).toBeVisible()
  await expect(
    scheduleMain.getByRole("combobox", { name: "计划状态筛选" }),
  ).toBeVisible()
  await expect(
    scheduleMain.getByRole("combobox", { name: "缺口筛选" }),
  ).toBeVisible()
  await expect(
    scheduleMain.getByRole("combobox", { name: "5 条/页" }),
  ).toBeVisible()

  const draftDetailLink = scheduleMain
    .locator('a[href^="/schedule-plans/"]')
    .filter({ hasText: /^查看$/ })
    .first()
  const detailHref = await draftDetailLink.getAttribute("href")
  expect(detailHref).toContain("from=schedule-plans")
  expect(detailHref).toContain("query=%E8%8B%8F%E5%B7%9E")
  expect(detailHref).toContain("status=draft")

  await page.goto(detailHref!)
  const detailUrl = new URL(page.url())
  const detailPath = detailUrl.pathname
  await expect(page.getByText("复核链路")).toBeVisible()
  await expect(
    page.getByRole("main").getByRole("link", { name: "返回列表" }).first(),
  ).toHaveAttribute(
    "href",
    "/schedule-plans?query=%E8%8B%8F%E5%B7%9E&status=draft",
  )

  const editHref = await page
    .getByRole("link", { name: "编辑草稿" })
    .getAttribute("href")
  expect(editHref).toContain("from=schedule-plans")
  expect(editHref).toContain("query=%E8%8B%8F%E5%B7%9E")
  expect(editHref).toContain("status=draft")

  await page.goto(editHref!)
  const editMain = page.getByRole("main")
  await expect(
    editMain.getByRole("heading", { name: "编辑排班草稿" }),
  ).toBeVisible()
  await expect(editMain.getByLabel("职场")).toHaveValue("苏州职场")

  const cancelHref = await editMain
    .getByRole("link", { name: "取消" })
    .getAttribute("href")
  expect(cancelHref).toContain(detailPath)
  expect(cancelHref).toContain("from=schedule-plans")
  expect(cancelHref).toContain("query=%E8%8B%8F%E5%B7%9E")
  expect(cancelHref).toContain("status=draft")

  await page.goto(cancelHref!)
  await expectPlanDetail(page, detailPath)
})

test("local demo import entry drives batch status placeholders", async ({ page }) => {
  await page.goto("/demo-imports")
  const importMain = page.getByRole("main")

  await expect(
    importMain.getByRole("heading", { name: "本机演示数据导入" }),
  ).toBeVisible()
  await expect(
    importMain.getByRole("heading", { name: "坐席主数据" }),
  ).toBeVisible()
  await expect(
    importMain.getByRole("heading", { name: "坐席状态数据" }),
  ).toBeVisible()
  await expect(
    importMain.getByRole("heading", { name: "登录数据" }),
  ).toBeVisible()
  await expect(importMain.getByText("不接数据库")).toBeVisible()

  const staffImportForm = importMain.locator(
    'form:has(input[name="kind"][value="staff_master"])',
  )
  await staffImportForm.locator('input[type="file"]').setInputFiles({
    name: "staff-master-demo.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(
      "staff_id,name,team,site,vendor,role,status\nA009,王晨,华东一组,上海职场,供应商A,客服,在线",
    ),
  })
  await staffImportForm.getByRole("button", { name: "导入坐席主数据" }).click()
  await expect(page).toHaveURL(/\/demo-imports\?.*kind=staff_master/)
  await expect(importMain.getByText("成功 1 行")).toBeVisible()
  await expect(importMain.getByText("失败 0 行")).toBeVisible()
  await expect(importMain.getByText("已同步").first()).toBeVisible()

  const statusImportForm = importMain.locator(
    'form:has(input[name="kind"][value="status_log"])',
  )
  await statusImportForm.locator('input[type="file"]').setInputFiles({
    name: "status-log-demo.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(
      "staff_id,date,start_time,end_time,status\nA009,2026-05-11,09:00,12:00,在线",
    ),
  })
  await statusImportForm.getByRole("button", { name: "导入坐席状态数据" }).click()
  await expect(page).toHaveURL(/\/demo-imports\?.*kind=status_log/)
  await expect(importMain.getByText("成功 1 行")).toBeVisible()

  const loginImportForm = importMain.locator(
    'form:has(input[name="kind"][value="login_log"])',
  )
  await loginImportForm.locator('input[type="file"]').setInputFiles({
    name: "login-log-demo.csv",
    mimeType: "text/csv",
    buffer: Buffer.from(
      "staff_id,date,planned_login,actual_login,actual_logout,online_minutes\nA009,2026-05-11,09:00,09:08,17:30,510",
    ),
  })
  await loginImportForm.getByRole("button", { name: "导入登录数据" }).click()
  await expect(page).toHaveURL(/\/demo-imports\?.*kind=login_log/)
  await expect(importMain.getByText("成功 1 行")).toBeVisible()

  await page.goto("/dashboard")
  const dashboardMain = page.getByRole("main")

  await expect(page.getByRole("heading", { name: "经营总览" })).toBeVisible()
  await expect(dashboardMain.getByText("本机 KPI Preview")).toBeVisible()
  await expect(dashboardMain.getByText(/导入覆盖 \d+ 行/)).toBeVisible()
  await expect(dashboardMain.getByText(/本机导入 records \d+ 行/)).toBeVisible()
  await expect(dashboardMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()
  await expect(dashboardMain.getByLabel("日期范围")).toHaveValue("2026-05-11")
  await dashboardMain.getByLabel("供应商").selectOption("供应商A")
  await dashboardMain.getByLabel("职场/团队").selectOption("上海职场")
  await dashboardMain.getByLabel("数据版本").selectOption("imported")
  await dashboardMain.getByRole("button", { name: "应用筛选" }).click()
  await expect(page).toHaveURL(/\/dashboard\?.*vendor=%E4%BE%9B%E5%BA%94%E5%95%86A/)
  await expect(page).toHaveURL(/\/dashboard\?.*site=%E4%B8%8A%E6%B5%B7%E8%81%8C%E5%9C%BA/)
  await expect(dashboardMain.getByText("本机导入数据最近批次")).toBeVisible()
  await expect(dashboardMain.getByText("坐席主数据").first()).toBeVisible()
  await expect(
    dashboardMain.getByRole("button", { name: "复核 ANM-202605-001" }),
  ).toBeVisible()

  await page.goto("/shift-details")
  const shiftMain = page.getByRole("main")
  await expect(shiftMain.locator("h1", { hasText: "班次明细" })).toBeVisible()
  await expect(shiftMain.getByText(/班次核对 records \d+ 行/)).toBeVisible()
  await expect(shiftMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()

  await page.goto("/schedule-risks")
  const risksMain = page.getByRole("main")
  await expect(risksMain.locator("h1", { hasText: "风险提示" })).toBeVisible()
  await expect(risksMain.getByText(/风险复核 records \d+ 行/)).toBeVisible()
  await expect(risksMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()

  await page.goto("/unavailability")
  const unavailabilityMain = page.getByRole("main")
  await expect(
    unavailabilityMain.locator("h1", { hasText: "不可用管理" }),
  ).toBeVisible()
  await expect(
    unavailabilityMain.getByText(/不可用核对 records \d+ 行/),
  ).toBeVisible()
  await expect(unavailabilityMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()

  await page.goto("/fulfillment-monitoring")
  const fulfillmentMain = page.getByRole("main")
  await expect(
    fulfillmentMain.locator("h1", { hasText: "履约监控" }),
  ).toBeVisible()
  await expect(
    fulfillmentMain.getByText(/履约核验 records \d+ 行/),
  ).toBeVisible()
  await expect(fulfillmentMain.getByText(/状态数据 \d+ 行/)).toBeVisible()
  await expect(fulfillmentMain.getByText(/登录数据 \d+ 行/)).toBeVisible()
  await expect(fulfillmentMain.getByText("状态日志样本")).toBeVisible()
  await expect(fulfillmentMain.getByText("登录数据样本")).toBeVisible()

  await page.goto("/agent-status-trace")
  const statusTraceMain = page.getByRole("main")
  await expect(
    statusTraceMain.locator("h1", { hasText: "坐席状态轨迹" }),
  ).toBeVisible()
  await expect(
    statusTraceMain.getByText(/状态轨迹 records \d+ 行/),
  ).toBeVisible()
  await expect(statusTraceMain.getByText(/状态数据 \d+ 行/)).toBeVisible()
  await expect(statusTraceMain.getByText("状态分布")).toBeVisible()
  await expect(statusTraceMain.getByText("状态日志样本")).toBeVisible()

  await page.goto("/fulfillment-exceptions")
  const exceptionMain = page.getByRole("main")
  await expect(
    exceptionMain.locator("h1", { hasText: "异常管理" }),
  ).toBeVisible()
  await expect(
    exceptionMain.getByText(/异常线索 records \d+ 行/),
  ).toBeVisible()
  await expect(exceptionMain.getByText(/状态数据 \d+ 行/)).toBeVisible()
  await expect(exceptionMain.getByText(/登录数据 \d+ 行/)).toBeVisible()
  await expect(exceptionMain.getByText("本机异常线索样本")).toBeVisible()

  await page.goto("/exception-review")
  const reviewMain = page.getByRole("main")
  await expect(
    reviewMain.locator("h1", { hasText: "异常复核" }),
  ).toBeVisible()
  await expect(
    reviewMain.getByText(/复核队列 records \d+ 行/),
  ).toBeVisible()
  await expect(reviewMain.getByText(/状态数据 \d+ 行/)).toBeVisible()
  await expect(reviewMain.getByText(/登录数据 \d+ 行/)).toBeVisible()
  await expect(
    reviewMain.getByRole("heading", { name: "只读复核队列" }),
  ).toBeVisible()
})

test("sidebar distinguishes opened and development modules", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page.getByRole("heading", { name: "经营总览" })).toBeVisible()

  const sidebar = page.locator("aside")
  await sidebar.getByRole("button", { name: "履约监控" }).click()

  await expect(
    sidebar.getByRole("link", { name: /工时核验/ }),
  ).toHaveAttribute("href", "/fulfillment-monitoring")

  await expect(
    sidebar.getByRole("link", { name: /坐席状态轨迹/ }),
  ).toHaveAttribute("href", "/agent-status-trace")

  await expect(
    sidebar.getByRole("link", { name: /异常管理/ }),
  ).toHaveAttribute("href", "/fulfillment-exceptions")

  const adherenceItem = sidebar
    .locator('[data-development-nav-item="true"]')
    .filter({ hasText: "实时遵守率" })

  await expect(adherenceItem).toBeVisible()
  await expect(adherenceItem).toHaveAttribute("aria-disabled", "true")
  await expect(adherenceItem.getByText("开发中")).toBeVisible()
  await expect(sidebar.getByRole("link", { name: /实时遵守率/ })).toHaveCount(0)

  await expect(
    sidebar.getByRole("link", { name: /异常复核/ }),
  ).toHaveAttribute("href", "/exception-review")
  await expect(page).toHaveURL(/\/dashboard(?:\?.*)?$/)

  await sidebar.getByRole("button", { name: "数据与集成" }).click()
  await expect(
    sidebar.getByRole("link", { name: /文件导入/ }),
  ).toHaveAttribute("href", "/demo-imports")
})
