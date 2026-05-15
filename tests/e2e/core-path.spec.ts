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
  await page.goBack()
  await expectPlanDetail(page, detailPath)
})
