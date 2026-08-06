import { expect, test, type Page } from "@playwright/test"

// 闭环路径：从根路由出发，不依赖深链走通「排班计划台 → 需求计划 → 复核案例 → 案例详情（比对运行）」。
// 覆盖阶段 1 壳层切换：首页重定向到排班计划台入口，顶部导航 3 项（排班计划台/实际执行/基础配置）可见。
// 排班计划台：种子未派生周期时展示空态；若其它 spec 已向共享 e2e 库注入周期，则展示矩阵，两者均可接受。
// 需求计划与复核案例尚未并入新导航：需求计划过渡期直接路由访问；
// /data-quality/review-cases 仍是真实功能页面（阶段 2 会重定向、阶段 6 才并入 /execution）。
// 运行方式：bash scripts/e2e.sh（由 scripts/check.sh 调用），沿用后端内存 seed 与复核演示种子。
const demoCaseId = "CASE-QUERY-001"
const demoComparisonRunId = "RUN-DEMO-FS-20260511"

test("从根路由出发可走通排班到复核案例的闭环", async ({ page }) => {
  // 第一段：根路由重定向到排班计划台入口，顶部导航可见。
  // 排班计划台处于空态（未派生周期）或已加载矩阵（其它 spec 注入了周期）均可接受。
  await page.goto("/")
  await expect(page).toHaveURL(/\/schedule-desk$/)
  await expect(
    page
      .getByRole("navigation", { name: "主导航" })
      .getByRole("link", { name: "排班计划台" })
  ).toBeVisible()
  await expect(
    page
      .getByRole("heading", { name: "暂无排班周期" })
      .or(page.getByRole("heading", { name: /排班矩阵/ }))
  ).toBeVisible()

  // 第二段：顶部导航本阶段不含需求计划入口，过渡期直接路由访问，种子需求行可见。
  await page.goto("/demand-plans")
  await expect(page).toHaveURL(/\/demand-plans$/)
  await expect(page.getByText("博西客服").first()).toBeVisible()

  // 第三段：直接访问复核案例过渡路由（/data-quality/review-cases 仍是真实功能页面），
  // 演示案例可见且可筛选。
  await page.goto("/data-quality/review-cases")
  await expect(page).toHaveURL(/\/data-quality\/review-cases$/)
  await expect(demoCaseRow(page)).toBeVisible()

  await page.getByPlaceholder("案例、来源、owner").fill(demoCaseId)
  await page.getByRole("button", { name: "筛选" }).click()
  await expect(page).toHaveURL(/[?&]query=CASE-QUERY-001/)
  await expect(demoCaseRow(page)).toBeVisible()

  // 第四段：进入案例详情，切到来源链路 tab，关联的比对运行节点可见（闭环后段来源链路）。
  await page.getByRole("link", { name: "查看复核详情" }).click()
  await expect(page).toHaveURL(/\/data-quality\/review-cases\/CASE-QUERY-001$/)
  await page.getByRole("tab", { name: "来源链路" }).click()
  await expect(page.getByText(new RegExp(`计算 ${demoComparisonRunId}`))).toBeVisible()
})

// 筛选后页面会出现「焦点 …」徽标，表格行的案例编号用精确匹配定位。
function demoCaseRow(page: Page) {
  return page.getByText(demoCaseId, { exact: true })
}
