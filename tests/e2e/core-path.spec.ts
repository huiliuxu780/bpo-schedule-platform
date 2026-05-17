import { expect, test, type Page } from "@playwright/test"

const apiBaseUrl = process.env.BPO_API_BASE_URL ?? "http://127.0.0.1:8000"

function escapedPathPattern(pathname: string) {
  const escaped = pathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return new RegExp(`${escaped}(?:\\?.*)?$`)
}

async function expectPlanDetail(page: Page, detailPath: string) {
  await expect(page).toHaveURL(escapedPathPattern(detailPath))
  await expect(page.getByText("复核链路")).toBeVisible()
}

async function gotoAppPage(page: Page, url: string) {
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 })
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("ERR_ABORTED")) {
      throw error
    }

    await page.waitForTimeout(300)
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 })
  }
}

async function navigateByMainLink(
  page: Page,
  name: string,
  expectedPath: RegExp,
) {
  const link = page.getByRole("main").getByRole("link", { name }).first()
  const href = await link.getAttribute("href")

  expect(href).toMatch(expectedPath)
  await gotoAppPage(page, href!)
}

test("core local review path keeps plan detail context", async ({ page }) => {
  test.setTimeout(60_000)

  await gotoAppPage(page, "/dashboard")
  await expect(page.getByRole("heading", { name: "经营总览" })).toBeVisible()
  await expect(page.getByText("履约指标趋势")).toBeVisible()

  await gotoAppPage(page, "/demand-plans")
  const demandMain = page.getByRole("main")
  await expect(demandMain.locator("h1", { hasText: "需求计划" })).toBeVisible()
  await expect(demandMain.getByRole("heading", { name: "预测需求" })).toBeVisible()

  await gotoAppPage(page, "/schedule-plans")
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
  await gotoAppPage(page, detailHref!)
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
  await gotoAppPage(page, "/schedule-plans")
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
  await gotoAppPage(page, unavailabilityHref!)

  await expect(page).toHaveURL(/\/unavailability\?.*planId=/)
  await navigateByMainLink(page, "影响", /^\/unavailability\//)
  await expect(page).toHaveURL(/\/unavailability\/[^?]+\?.*planId=/)
  await navigateByMainLink(page, "计划详情", /^\/schedule-plans\//)
  await expectPlanDetail(page, planPath)
})

test("schedule plan draft edit route keeps list context and table controls accessible", async ({
  page,
}) => {
  await gotoAppPage(page, "/schedule-plans?query=苏州&status=draft")
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

  await gotoAppPage(page, detailHref!)
  const detailUrl = new URL(page.url())
  const detailPath = detailUrl.pathname
  await expect(page.getByText("复核链路")).toBeVisible()
  const detailMain = page.getByRole("main")
  await expect(
    detailMain.getByRole("heading", { name: "复核准备" }),
  ).toBeVisible()
  await expect(detailMain.getByText("需补齐缺口")).toBeVisible()
  await expect(
    detailMain.getByText("先补齐缺口时段，再复核风险和不可用。"),
  ).toBeVisible()
  await expect(
    detailMain.getByText("不提交审批、不发布排班、不做自动排班或生产写回。"),
  ).toBeVisible()
  await expect(
    detailMain.getByRole("link", { name: "返回列表" }).first(),
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

  await gotoAppPage(page, editHref!)
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

  await gotoAppPage(page, cancelHref!)
  await expectPlanDetail(page, detailPath)
})

test("local demo import entry drives batch status placeholders", async ({ page }) => {
  test.setTimeout(120_000)

  await gotoAppPage(page, "/demo-imports")
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
  await expect(
    importMain.getByRole("heading", { name: "排班数据" }),
  ).toBeVisible()
  await expect(importMain.getByText("不接数据库")).toBeVisible()

  const importForms = importMain.locator("form")
  const staffImportForm = importForms.nth(0)
  await expect(
    staffImportForm.getByRole("button", { name: "导入坐席主数据" }),
  ).toBeVisible()
  const staffImportResponse = await page.request.post(
    `${apiBaseUrl}/api/v1/demo-imports/staff_master`,
    {
      data: {
        csv_text:
          "staff_id,name,team,site,vendor,role,status\nA001,张敏,华东一组,上海职场,供应商A,客服,在线\nA002,李想,华南二组,苏州职场,供应商B,客服,培训",
      },
    },
  )
  expect(staffImportResponse.ok()).toBeTruthy()

  const statusImportForm = importForms.nth(1)
  await expect(
    statusImportForm.getByRole("button", { name: "导入坐席状态数据" }),
  ).toBeVisible()
  const statusImportResponse = await page.request.post(
    `${apiBaseUrl}/api/v1/demo-imports/status_log`,
    {
      data: {
        csv_text:
          "staff_id,date,start_time,end_time,status\nA001,2026-05-11,09:00,12:00,在线\nA002,2026-05-11,10:00,11:00,培训",
      },
    },
  )
  expect(statusImportResponse.ok()).toBeTruthy()

  const loginImportForm = importForms.nth(2)
  await expect(
    loginImportForm.getByRole("button", { name: "导入登录数据" }),
  ).toBeVisible()
  const loginImportResponse = await page.request.post(
    `${apiBaseUrl}/api/v1/demo-imports/login_log`,
    {
      data: {
        csv_text:
          "staff_id,date,planned_login,actual_login,actual_logout,online_minutes\nA001,2026-05-11,09:00,09:08,17:30,510\nA002,2026-05-11,09:00,09:00,17:00,480",
      },
    },
  )
  expect(loginImportResponse.ok()).toBeTruthy()

  const schedulePlanImportForm = importForms.nth(3)
  await expect(
    schedulePlanImportForm.getByRole("button", { name: "导入排班数据" }),
  ).toBeVisible()
  const schedulePlanImportResponse = await page.request.post(
    `${apiBaseUrl}/api/v1/demo-imports/schedule_plan`,
    {
      data: {
        csv_text:
          "plan_id,plan_date,project_name,site_name,version,status,interval_start,interval_end,forecast_agents,scheduled_agents,note\nSP-20260511-SH,2026-05-11,博西客服,上海职场,v1,draft,09:00,09:30,12,10,早高峰补人\nSP-20260511-SH,2026-05-11,博西客服,上海职场,v1,draft,09:30,10:00,14,14,覆盖正常",
      },
    },
  )
  expect(schedulePlanImportResponse.ok()).toBeTruthy()

  await gotoAppPage(page, "/demo-imports")
  const refreshedImportMain = page.getByRole("main")
  await expect(
    refreshedImportMain.getByRole("heading", { name: "最近导入批次" }),
  ).toBeVisible()
  await expect(
    refreshedImportMain.getByRole("heading", {
      name: "processed records 来源",
    }),
  ).toBeVisible()
  await expect(
    refreshedImportMain.getByRole("columnheader", { name: "状态" }).first(),
  ).toBeVisible()
  await expect(
    refreshedImportMain.getByRole("columnheader", { name: "批次" }).first(),
  ).toBeVisible()
  await expect(
    refreshedImportMain.getByRole("columnheader", { name: "最新批次" }).first(),
  ).toBeVisible()
  await expect(refreshedImportMain.getByText("已同步").first()).toBeVisible()
  await expect(
    refreshedImportMain
      .getByRole("cell", { name: /schedule_plan-\d{14}-\d+/ })
      .first(),
  ).toBeVisible()
  await expect(refreshedImportMain.getByText("排班数据").first()).toBeVisible()
  await expect(refreshedImportMain.getByText("不接数据库")).toBeVisible()

  await gotoAppPage(page, "/dashboard")
  const dashboardMain = page.getByRole("main")

  await expect(page.getByRole("heading", { name: "经营总览" })).toBeVisible()
  await expect(dashboardMain.getByText("本机 KPI Preview")).toBeVisible()
  await expect(dashboardMain.getByText(/导入覆盖 \d+ 行/)).toBeVisible()
  await expect(dashboardMain.getByText(/本机导入 records \d+ 行/)).toBeVisible()
  await expect(dashboardMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()
  await expect(dashboardMain.getByText(/排班数据 \d+ 行/)).toBeVisible()
  await expect(
    dashboardMain.getByRole("columnheader", { name: "数据源" }).first(),
  ).toBeVisible()
  await expect(
    dashboardMain.getByRole("columnheader", { name: "最新批次" }).first(),
  ).toBeVisible()
  await expect(dashboardMain.getByText("排班数据").first()).toBeVisible()
  await expect(
    dashboardMain.getByRole("cell", { name: /schedule_plan-\d{14}-\d+/ }).first(),
  ).toBeVisible()
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

  await gotoAppPage(page, "/schedule-plans")
  const schedulePlansMain = page.getByRole("main")
  await expect(schedulePlansMain.locator("h1", { hasText: "排班计划" })).toBeVisible()
  await expect(
    schedulePlansMain.getByText(/排班数据 records \d+ 行/),
  ).toBeVisible()
  await expect(schedulePlansMain.getByText("计划样本")).toBeVisible()

  await gotoAppPage(page, "/shift-details")
  const shiftMain = page.getByRole("main")
  await expect(shiftMain.locator("h1", { hasText: "班次明细" })).toBeVisible()
  await expect(shiftMain.getByText(/班次核对 records \d+ 行/)).toBeVisible()
  await expect(shiftMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()

  await gotoAppPage(page, "/schedule-risks")
  const risksMain = page.getByRole("main")
  await expect(risksMain.locator("h1", { hasText: "风险提示" })).toBeVisible()
  await expect(risksMain.getByText(/风险复核 records \d+ 行/)).toBeVisible()
  await expect(risksMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()

  await gotoAppPage(page, "/unavailability")
  const unavailabilityMain = page.getByRole("main")
  await expect(
    unavailabilityMain.locator("h1", { hasText: "不可用管理" }),
  ).toBeVisible()
  await expect(
    unavailabilityMain.getByText(/不可用核对 records \d+ 行/),
  ).toBeVisible()
  await expect(unavailabilityMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()

  await gotoAppPage(page, "/fulfillment-monitoring")
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

  await gotoAppPage(page, "/agent-status-trace")
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

  await gotoAppPage(page, "/corn-status-log")
  const cornStatusMain = page.getByRole("main")
  await expect(
    cornStatusMain.locator("h1", { hasText: "CORN 状态日志" }),
  ).toBeVisible()
  await expect(
    cornStatusMain.getByText(/CORN 状态日志 records \d+ 行/),
  ).toBeVisible()
  await expect(cornStatusMain.getByText(/状态数据 \d+ 行/)).toBeVisible()
  await expect(cornStatusMain.getByText("状态日志分布")).toBeVisible()
  await expect(cornStatusMain.getByText("CORN 状态日志样本")).toBeVisible()

  await gotoAppPage(page, "/fulfillment-exceptions")
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

  await gotoAppPage(page, "/exception-review")
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

  await gotoAppPage(page, "/adherence-monitoring")
  const adherenceMain = page.getByRole("main")
  await expect(
    adherenceMain.locator("h1", { hasText: "实时遵守率" }),
  ).toBeVisible()
  await expect(
    adherenceMain.getByText(/遵守率预览 records \d+ 行/),
  ).toBeVisible()
  await expect(adherenceMain.getByText(/状态数据 \d+ 行/)).toBeVisible()
  await expect(adherenceMain.getByText(/登录数据 \d+ 行/)).toBeVisible()
  await expect(
    adherenceMain.getByRole("heading", { name: "本机遵守率预览样本" }),
  ).toBeVisible()

  await gotoAppPage(page, "/data-quality")
  const dataQualityMain = page.getByRole("main")
  await expect(
    dataQualityMain.locator("h1", { hasText: "数据质量" }),
  ).toBeVisible()
  await expect(
    dataQualityMain.getByText(/数据质量 records \d+ 行/),
  ).toBeVisible()
  await expect(dataQualityMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()
  await expect(dataQualityMain.getByText(/状态数据 \d+ 行/)).toBeVisible()
  await expect(dataQualityMain.getByText(/登录数据 \d+ 行/)).toBeVisible()
  await expect(
    dataQualityMain.getByRole("heading", { name: "本机质量预览明细" }),
  ).toBeVisible()

  await gotoAppPage(page, "/field-mapping")
  const fieldMappingMain = page.getByRole("main")
  await expect(
    fieldMappingMain.locator("h1", { hasText: "字段映射" }),
  ).toBeVisible()
  await expect(
    fieldMappingMain.getByText(/字段映射 records \d+ 行/),
  ).toBeVisible()
  await expect(fieldMappingMain.getByText("坐席主数据").first()).toBeVisible()
  await expect(fieldMappingMain.getByText("坐席状态数据").first()).toBeVisible()
  await expect(fieldMappingMain.getByText("登录数据").first()).toBeVisible()
  await expect(
    fieldMappingMain.getByRole("heading", { name: "本机字段映射预览" }),
  ).toBeVisible()

  await gotoAppPage(page, "/organization-people")
  const organizationPeopleMain = page.getByRole("main")
  await expect(
    organizationPeopleMain.locator("h1", { hasText: "组织与人员" }),
  ).toBeVisible()
  await expect(
    organizationPeopleMain.getByText(/组织与人员 records \d+ 行/),
  ).toBeVisible()
  await expect(organizationPeopleMain.getByText("团队分布")).toBeVisible()
  await expect(organizationPeopleMain.getByText("华东一组").first()).toBeVisible()
  await expect(
    organizationPeopleMain.getByRole("heading", { name: "本机人员主数据样本" }),
  ).toBeVisible()
  await expect(
    organizationPeopleMain.getByRole("heading", { name: "本机组织分布" }),
  ).toBeVisible()

  await gotoAppPage(page, "/today-fulfillment")
  const todayFulfillmentMain = page.getByRole("main")
  await expect(
    todayFulfillmentMain.locator("h1", { hasText: "今日履约" }),
  ).toBeVisible()
  await expect(
    todayFulfillmentMain.getByText(/今日履约 records \d+ 行/),
  ).toBeVisible()
  await expect(todayFulfillmentMain.getByText(/坐席主数据 \d+ 行/)).toBeVisible()
  await expect(todayFulfillmentMain.getByText("今日状态样本")).toBeVisible()
  await expect(todayFulfillmentMain.getByText("今日登录样本")).toBeVisible()

  await gotoAppPage(page, "/anomaly-alerts")
  const anomalyAlertsMain = page.getByRole("main")
  await expect(
    anomalyAlertsMain.locator("h1", { hasText: "异常预警" }),
  ).toBeVisible()
  await expect(
    anomalyAlertsMain.getByText(/异常预警 records \d+ 行/),
  ).toBeVisible()
  await expect(anomalyAlertsMain.getByText("本机异常预警队列")).toBeVisible()
  await expect(anomalyAlertsMain.getByText("ANM-202605-001")).toBeVisible()

  await gotoAppPage(page, "/deficit-heatmap")
  const deficitHeatmapMain = page.getByRole("main")
  await expect(
    deficitHeatmapMain.locator("h1", { hasText: "时段缺口热力图" }),
  ).toBeVisible()
  await expect(
    deficitHeatmapMain.getByText("时段缺口 records"),
  ).toBeVisible()
  await expect(deficitHeatmapMain.getByText("严重时段清单")).toBeVisible()
  await expect(deficitHeatmapMain.getByText("时段人力缺口")).toBeVisible()

  await gotoAppPage(page, "/vendor-management")
  const vendorManagementMain = page.getByRole("main")
  await expect(
    vendorManagementMain.locator("h1", { hasText: "供应商管理" }),
  ).toBeVisible()
  await expect(
    vendorManagementMain.getByText(/供应商管理 records \d+ 行/),
  ).toBeVisible()
  await expect(vendorManagementMain.getByText("本机供应商分布")).toBeVisible()
  await expect(vendorManagementMain.getByText("供应商A").first()).toBeVisible()

  await gotoAppPage(page, "/rule-configuration")
  const ruleConfigurationMain = page.getByRole("main")
  await expect(
    ruleConfigurationMain.locator("h1", { hasText: "规则配置" }),
  ).toBeVisible()
  await expect(
    ruleConfigurationMain.getByText(/规则配置 records \d+ 行/),
  ).toBeVisible()
  await expect(
    ruleConfigurationMain.getByRole("heading", { name: "本机规则目录" }),
  ).toBeVisible()
  await expect(ruleConfigurationMain.getByText("导入 records 只读展示")).toBeVisible()

  await gotoAppPage(page, "/monthly-settlement")
  const monthlySettlementMain = page.getByRole("main")
  await expect(
    monthlySettlementMain.locator("h1", { hasText: "月度结算" }),
  ).toBeVisible()
  await expect(
    monthlySettlementMain.getByText(/结算复盘 records \d+ 行/),
  ).toBeVisible()
  await expect(monthlySettlementMain.getByText("本机复盘预览")).toBeVisible()
  await expect(
    monthlySettlementMain.getByText("不计算生产结算金额。", { exact: true }),
  ).toBeVisible()

  await gotoAppPage(page, "/report-center")
  const reportCenterMain = page.getByRole("main")
  await expect(
    reportCenterMain.locator("h1", { hasText: "报表中心" }),
  ).toBeVisible()
  await expect(
    reportCenterMain.getByText(/报表中心 records \d+ 行/),
  ).toBeVisible()
  await expect(
    reportCenterMain.getByRole("heading", { name: "本机报表预览" }),
  ).toBeVisible()
  await expect(
    reportCenterMain.getByText("不生成生产报表或导出文件。", { exact: true }),
  ).toBeVisible()

  await gotoAppPage(page, "/supplier-review")
  const supplierReviewMain = page.getByRole("main")
  await expect(
    supplierReviewMain.locator("h1", { hasText: "供应商复盘" }),
  ).toBeVisible()
  await expect(
    supplierReviewMain.getByText(/供应商复盘 records \d+ 行/),
  ).toBeVisible()
  await expect(
    supplierReviewMain.getByRole("heading", {
      name: "本机供应商复盘",
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    supplierReviewMain.getByText("不做供应商考核写回或结算金额。", {
      exact: true,
    }),
  ).toBeVisible()

  await gotoAppPage(page, "/smart-scheduling")
  const smartSchedulingMain = page.getByRole("main")
  await expect(
    smartSchedulingMain.locator("h1", { hasText: "智能排班" }),
  ).toBeVisible()
  await expect(
    smartSchedulingMain.getByText(/智能排班 records \d+ 行/),
  ).toBeVisible()
  await expect(
    smartSchedulingMain.getByRole("heading", {
      name: "本机排班建议",
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    smartSchedulingMain.getByText("不自动生成或发布排班。", { exact: true }),
  ).toBeVisible()

  await gotoAppPage(page, "/interface-integration")
  const interfaceIntegrationMain = page.getByRole("main")
  await expect(
    interfaceIntegrationMain.locator("h1", { hasText: "接口集成" }),
  ).toBeVisible()
  await expect(
    interfaceIntegrationMain.getByText(/接口集成 records \d+ 行/),
  ).toBeVisible()
  await expect(
    interfaceIntegrationMain.getByRole("heading", {
      name: "本机接入 readiness",
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    interfaceIntegrationMain.getByText("不连接真实接口或配置接口凭证。", {
      exact: true,
    }),
  ).toBeVisible()

  await gotoAppPage(page, "/operation-audit")
  const operationAuditMain = page.getByRole("main")
  await expect(
    operationAuditMain.locator("h1", { hasText: "操作审计" }),
  ).toBeVisible()
  await expect(
    operationAuditMain.getByText(/操作审计 records \d+ 行/),
  ).toBeVisible()
  await expect(
    operationAuditMain.getByRole("heading", {
      name: "本机审计证据",
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    operationAuditMain.getByText("不生成生产审计日志或不可篡改审计存储。", {
      exact: true,
    }),
  ).toBeVisible()
})

test("opened local module routes render real module pages", async ({ page }) => {
  const routes = [
    { path: "/today-fulfillment", heading: "今日履约", marker: "今日履约边界" },
    { path: "/anomaly-alerts", heading: "异常预警", marker: "异常预警边界" },
    { path: "/deficit-heatmap", heading: "时段缺口热力图", marker: "缺口热力图边界" },
    { path: "/vendor-management", heading: "供应商管理", marker: "供应商管理 records" },
    { path: "/rule-configuration", heading: "规则配置", marker: "规则配置边界" },
    { path: "/report-center", heading: "报表中心", marker: "报表中心 records" },
    { path: "/supplier-review", heading: "供应商复盘", marker: "供应商复盘 records" },
    { path: "/operation-audit", heading: "操作审计", marker: "操作审计 records" },
    { path: "/smart-scheduling", heading: "智能排班", marker: "智能排班 records" },
    { path: "/interface-integration", heading: "接口集成", marker: "接口集成 records" },
  ]

  for (const route of routes) {
    await gotoAppPage(page, route.path)

    const main = page.getByRole("main")
    await expect(page).toHaveURL(escapedPathPattern(route.path))
    await expect(main.locator("h1", { hasText: route.heading })).toBeVisible()
    await expect(main.locator("h1", { hasText: "经营总览" })).toHaveCount(0)
    await expect(main.getByText(route.marker).first()).toBeVisible()
  }
})

test("sidebar distinguishes opened and development modules", async ({ page }) => {
  await gotoAppPage(page, "/today-fulfillment")
  await expect(
    page.getByRole("main").locator("h1", { hasText: "今日履约" }),
  ).toBeVisible()

  const sidebar = page.locator("aside")
  await expect(
    sidebar.getByRole("link", { name: /今日履约/ }),
  ).toHaveAttribute("href", "/today-fulfillment")

  await expect(
    sidebar.getByRole("link", { name: /异常预警/ }),
  ).toHaveAttribute("href", "/anomaly-alerts")

  await expect(
    sidebar.getByRole("link", { name: /时段缺口热力图/ }),
  ).toHaveAttribute("href", "/deficit-heatmap")

  await gotoAppPage(page, "/fulfillment-monitoring")
  await expect(page.getByRole("heading", { name: "履约监控" })).toBeVisible()

  await expect(
    sidebar.getByRole("link", { name: /工时核验/ }),
  ).toHaveAttribute("href", "/fulfillment-monitoring")

  await expect(
    sidebar.getByRole("link", { name: /坐席状态轨迹/ }),
  ).toHaveAttribute("href", "/agent-status-trace")

  await expect(
    sidebar.getByRole("link", { name: /异常管理/ }),
  ).toHaveAttribute("href", "/fulfillment-exceptions")

  await expect(
    sidebar.getByRole("link", { name: /实时遵守率/ }),
  ).toHaveAttribute("href", "/adherence-monitoring")

  await expect(
    sidebar.getByRole("link", { name: /异常复核/ }),
  ).toHaveAttribute("href", "/exception-review")

  await gotoAppPage(page, "/monthly-settlement")
  await expect(
    sidebar.getByRole("link", { name: /月度结算/ }),
  ).toHaveAttribute("href", "/monthly-settlement")

  await expect(
    sidebar.getByRole("link", { name: /报表中心/ }),
  ).toHaveAttribute("href", "/report-center")

  await expect(
    sidebar.getByRole("link", { name: /供应商复盘/ }),
  ).toHaveAttribute("href", "/supplier-review")

  for (const itemName of ["结算锁账"]) {
    const developmentItem = sidebar
      .locator('[data-development-nav-item="true"]')
      .filter({ hasText: itemName })

    await expect(developmentItem).toBeVisible()
    await expect(developmentItem).toHaveAttribute("aria-disabled", "true")
    await expect(developmentItem.getByText("开发中")).toBeVisible()
  }

  await gotoAppPage(page, "/smart-scheduling")
  await expect(
    sidebar.getByRole("link", { name: /智能排班/ }),
  ).toHaveAttribute("href", "/smart-scheduling")

  await gotoAppPage(page, "/data-quality")
  await expect(
    sidebar.getByRole("link", { name: /文件导入/ }),
  ).toHaveAttribute("href", "/demo-imports")

  await expect(
    sidebar.getByRole("link", { name: /数据质量/ }),
  ).toHaveAttribute("href", "/data-quality")

  await expect(
    sidebar.getByRole("link", { name: /CORN 状态日志/ }),
  ).toHaveAttribute("href", "/corn-status-log")

  await expect(
    sidebar.getByRole("link", { name: /字段映射/ }),
  ).toHaveAttribute("href", "/field-mapping")

  await expect(
    sidebar.getByRole("link", { name: /接口集成/ }),
  ).toHaveAttribute("href", "/interface-integration")

  await gotoAppPage(page, "/organization-people")
  await expect(
    sidebar.getByRole("link", { name: /组织与人员/ }),
  ).toHaveAttribute("href", "/organization-people")

  await expect(
    sidebar.getByRole("link", { name: /供应商管理/ }),
  ).toHaveAttribute("href", "/vendor-management")

  await expect(
    sidebar.getByRole("link", { name: /规则配置/ }),
  ).toHaveAttribute("href", "/rule-configuration")

  const permissionItem = sidebar
    .locator('[data-development-nav-item="true"]')
    .filter({ hasText: "权限管理" })

  await expect(permissionItem).toBeVisible()
  await expect(permissionItem).toHaveAttribute("aria-disabled", "true")
  await expect(permissionItem.getByText("开发中")).toBeVisible()

  await expect(
    sidebar.getByRole("link", { name: /操作审计/ }),
  ).toHaveAttribute("href", "/operation-audit")
})
