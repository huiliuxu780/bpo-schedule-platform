import { expect, test } from "@playwright/test"

// 员工详情「排班限制」区块闭环：进详情页编辑夜班/跨日班开关与不可排班日期，
// 保存后反馈横幅与回显必须留在详情页。运行方式：bash scripts/e2e.sh
// （由 scripts/check.sh 调用），种子来自 backend.app.review_demo_seed
// （员工 A-1001 张三，默认允许夜班/跨日班、无不可排班日期）。

const seedEmployeeId = "A-1001"
const detailPath = `/master-data/agents/${seedEmployeeId}`

test("员工详情页编辑排班限制并保存后横幅与回显留在本页", async ({ page }) => {
  await page.goto(detailPath)

  // 区块渲染：默认允许夜班/跨日班，无不可排班日期。
  await expect(page.getByRole("heading", { name: "排班限制" })).toBeVisible()
  const nightShiftCheckbox = page.getByLabel("允许排夜班")
  const crossDayCheckbox = page.getByLabel("允许排跨日班")
  await expect(nightShiftCheckbox).toBeChecked()
  await expect(crossDayCheckbox).toBeChecked()
  await expect(page.getByText("暂无不可排班日期")).toBeVisible()

  // 编辑：关闭夜班开关并新增一个不可排班日期。
  await nightShiftCheckbox.uncheck()
  await page.getByLabel("新增不可排班日期").fill("2026-09-01")
  await page.getByRole("button", { name: "添加日期" }).click()
  await expect(page.getByText("2026-09-01")).toBeVisible()

  // 保存：redirect 回详情页，反馈横幅与回显均在本页。
  await page.getByRole("button", { name: "保存排班限制" }).click()
  await expect(page).toHaveURL(new RegExp(detailPath))
  await expect(page.getByText("排班限制保存成功")).toBeVisible()
  await expect(page.getByLabel("允许排夜班")).not.toBeChecked()
  await expect(page.getByLabel("允许排跨日班")).toBeChecked()
  await expect(page.getByText("2026-09-01")).toBeVisible()
})

test("员工详情页移除不可排班日期并恢复夜班开关", async ({ page }) => {
  await page.goto(detailPath)

  // 上一轮保存的状态回显：夜班关闭、存在不可排班日期。
  await expect(page.getByLabel("允许排夜班")).not.toBeChecked()
  await expect(page.getByText("2026-09-01")).toBeVisible()

  // 移除日期并恢复夜班开关。
  await page.getByRole("button", { name: `移除不可排班日期 2026-09-01` }).click()
  await expect(page.getByText("暂无不可排班日期")).toBeVisible()
  await page.getByLabel("允许排夜班").check()

  await page.getByRole("button", { name: "保存排班限制" }).click()
  await expect(page).toHaveURL(new RegExp(detailPath))
  await expect(page.getByText("排班限制保存成功")).toBeVisible()
  await expect(page.getByLabel("允许排夜班")).toBeChecked()
  await expect(page.getByText("暂无不可排班日期")).toBeVisible()
})
