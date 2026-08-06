import { expect, test } from "@playwright/test"

// 草稿创建落点反馈：createDraftAction 成功带 ?draft=created、失败带 ?draft=failed
// 直接落到排班计划台；横幅仅当参数存在时渲染（一次性反馈，不带参数即消失）。
// 运行方式：bash scripts/e2e.sh（由 scripts/check.sh 调用）。
test("排班计划台仅在携带 draft 参数时显示草稿创建反馈横幅", async ({ page }) => {
  await page.goto("/schedule-desk?draft=created")
  await expect(page.getByText("排班草稿已创建")).toBeVisible()

  await page.goto("/schedule-desk?draft=failed")
  await expect(page.getByText("草稿创建失败，请重试")).toBeVisible()

  await page.goto("/schedule-desk")
  await expect(page.getByText("排班草稿已创建")).toHaveCount(0)
  await expect(page.getByText("草稿创建失败，请重试")).toHaveCount(0)
})
