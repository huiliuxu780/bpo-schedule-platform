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
