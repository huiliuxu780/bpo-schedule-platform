import { expect, test, type Page } from "@playwright/test"

// 交互路径：导入中心复核案例工作台的关键词筛选。
// GET 表单提交 → 服务端按 query 重新渲染 → 表格行变化，是 churn 最高的 workbench 路径。
// 运行方式：bash scripts/e2e.sh（由 scripts/check.sh 调用），依赖其中的演示种子案例。
const demoCaseId = "CASE-QUERY-001"

test("复核案例关键词筛选驱动表格行变化", async ({ page }) => {
  await page.goto("/data-quality/review-cases")
  await expect(demoCaseRow(page)).toBeVisible()

  // 命中关键词：URL 携带 query 参数，案例行保留。
  await page.getByPlaceholder("案例、来源、owner").fill(demoCaseId)
  await page.getByRole("button", { name: "筛选" }).click()
  await expect(page).toHaveURL(/[?&]query=CASE-QUERY-001/)
  await expect(demoCaseRow(page)).toBeVisible()

  // 未命中关键词：URL 更新且表格进入空态。
  await page.getByPlaceholder("案例、来源、owner").fill("不存在的关键词")
  await page.getByRole("button", { name: "筛选" }).click()
  await expect(page).toHaveURL(/[?&]query=/, { timeout: 10_000 })
  await expect(demoCaseRow(page)).toHaveCount(0)
  // 列表空态的提示文案在页面上唯一（「暂无匹配复核案例」同时出现在汇总卡片）。
  await expect(page.getByText("调整筛选条件后重新查看。")).toBeVisible()
})

// 筛选后页面会出现「焦点 …」徽标，表格行的案例编号用精确匹配定位。
function demoCaseRow(page: Page) {
  return page.getByText(demoCaseId, { exact: true })
}
