import { expect, test } from "@playwright/test"

// 导航壳运行时覆盖：三个新导航页可达且顶部导航正确高亮（含过渡期旧路由高亮），
// /execution 导入对话框深链在本页闭环，/base-config 员工写入路径不回跳旧路由。
// 运行方式：bash scripts/e2e.sh（由 scripts/check.sh 调用），种子来自 backend.app.review_demo_seed
// （员工 A-1001 张三、主数据批次 BATCH-DEMO-REVIEW-20260511）。

const seedEmployeeId = "A-1001"

test("三个新导航页可达且顶部导航正确高亮", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "主导航" })

  await page.goto("/schedule-desk")
  await expect(page).toHaveURL(/\/schedule-desk$/)
  await expect(
    nav.getByRole("link", { name: "排班计划台" })
  ).toHaveAttribute("aria-current", "page")
  await expect(nav.getByRole("link", { name: "实际执行" })).not.toHaveAttribute(
    "aria-current"
  )
  await expect(nav.getByRole("link", { name: "基础配置" })).not.toHaveAttribute(
    "aria-current"
  )

  await page.goto("/execution")
  await expect(page).toHaveURL(/\/execution$/)
  await expect(nav.getByRole("link", { name: "实际执行" })).toHaveAttribute(
    "aria-current",
    "page"
  )

  await page.goto("/base-config")
  await expect(page).toHaveURL(/\/base-config$/)
  await expect(nav.getByRole("link", { name: "基础配置" })).toHaveAttribute(
    "aria-current",
    "page"
  )
})

test("过渡期旧路由访问时对应新导航项保持高亮", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "主导航" })

  await page.goto("/schedule-plans")
  await expect(nav.getByRole("link", { name: "排班计划台" })).toHaveAttribute(
    "aria-current",
    "page"
  )

  await page.goto("/actual-logs/production")
  await expect(nav.getByRole("link", { name: "实际执行" })).toHaveAttribute(
    "aria-current",
    "page"
  )

  await page.goto("/master-data/agents")
  await expect(nav.getByRole("link", { name: "基础配置" })).toHaveAttribute(
    "aria-current",
    "page"
  )
})

test("execution 导入对话框深链在本页直接打开", async ({ page }) => {
  await page.goto("/execution?import_dialog=1&log_type=login")
  await expect(page).toHaveURL(/\/execution\?import_dialog=1&log_type=login/)

  // 对话框在 /execution 本页打开，关闭/取消链接回本页而非旧路由。
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText("登录日志导入")).toBeVisible()
  await expect(dialog.getByRole("link", { name: "取消" })).toHaveAttribute(
    "href",
    "/execution"
  )
})

test("base-config 员工标签页渲染且冻结提交反馈留在本页", async ({ page }) => {
  await page.goto("/base-config?tab=employees")
  await expect(page.getByText(seedEmployeeId, { exact: true }).first()).toBeVisible()

  // 冻结对话框由 model 生成的 freezeHref 深链打开（本页前缀，非旧路由）。
  await page.goto(`/base-config?tab=employees&freeze_employee_id=${seedEmployeeId}`)
  const dialog = page.getByRole("dialog")
  await expect(dialog).toBeVisible()
  await expect(dialog.getByText("冻结客服人员")).toBeVisible()
  await expect(dialog.locator('input[name="return_path"]')).toHaveValue(
    "/base-config?tab=employees"
  )
  await expect(dialog.getByRole("link", { name: "取消" })).toHaveAttribute(
    "href",
    "/base-config?tab=employees"
  )

  // 走一次真实维护提交：回跳与反馈横幅必须落在 /base-config，不得跳回旧路由。
  await dialog.getByRole("button", { name: "确认冻结" }).click()
  await expect(page).toHaveURL(/\/base-config\?tab=employees/)
  expect(page.url()).not.toContain("/master-data")
  await expect(page.getByText("人员保存成功")).toBeVisible()
})
