import { expect, test } from "@playwright/test"

// 阶段4行为检查：统一导入向导（任务22）。
// 新三页挂载替换旧对话框：/schedule-desk（排班）、/execution（实际日志）、
// /base-config（主数据）；三步向导 upload→mapping→result 参数化开合，
// result_redirect_to 指向新路由。旧三域对话框保留至旧路由退役（本套不覆盖）。
// 运行方式：bash scripts/e2e.sh（由 scripts/check.sh 调用）。

function buildScheduleCsv(): string {
  const header =
    "schedule_date,employee_id,workplace_id,supplier_id,skill_id,shift_type_id,start_time,end_time"
  const row = "2026-06-20,E2E-TASK22-01,SH-01,SUP-A,L1-CN,MORNING,09:00,18:00"

  return `${header}\n${row}`
}

test("排班计划台统一导入向导三步走通并回跳新路由", async ({ page }) => {
  await page.goto("/schedule-desk")
  await page.getByRole("link", { name: "导入排班" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("heading", { name: "排班导入" })).toBeVisible()

  // 步骤一：上传文件
  await expect(page.getByText("上传文件", { exact: true }).first()).toBeVisible()
  await page.getByLabel("批次号").fill("BATCH-E2E-TASK22-SCH-001")
  await page.getByLabel("文件名").fill("task22-schedule.csv")
  await page
    .getByLabel("CSV 文件")
    .setInputFiles({ name: "task22-schedule.csv", mimeType: "text/csv", buffer: Buffer.from(buildScheduleCsv()) })

  // 步骤二：字段映射
  await page.getByRole("button", { name: "下一步" }).click()
  await expect(page.getByText("字段映射", { exact: true }).first()).toBeVisible()
  await expect(page.getByLabel("字段映射 JSON")).toContainText("schedule_date")

  // 步骤三：导入结果（真实提交，回跳 /schedule-desk?import_dialog=1&upload=success&batch=...）。
  // 提交触发整页导航；force 点击只派发一次，避免 actionability 重试造成重复提交（409）。
  await Promise.all([
    page.waitForURL(/\/schedule-desk\?import_dialog=1&upload=success/, { timeout: 15000 }),
    page.getByRole("button", { name: "开始导入" }).click({ force: true }).catch(() => {}),
  ])
  await expect(page.getByText("导入已提交")).toBeVisible({ timeout: 15000 })
  await expect(page.getByText("成功", { exact: false }).first()).toBeVisible()

  await Promise.all([
    page.waitForURL(/\/schedule-desk$/),
    page.getByRole("link", { name: "关闭" }).click().catch(() => {}),
  ])
})

test("实际执行页统一导入向导区分登录与状态日志变体", async ({ page }) => {
  await page.goto("/execution")

  await page.getByRole("link", { name: "导入登录日志" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("heading", { name: "登录日志导入" })).toBeVisible()
  await expect(page.getByLabel("批次号")).toHaveAttribute("placeholder", /LOGIN-/)
  await page.getByRole("link", { name: "取消" }).click()
  await expect(page.getByRole("dialog")).toHaveCount(0)

  await page.getByRole("link", { name: "导入状态日志" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("heading", { name: "状态日志导入" })).toBeVisible()
  await expect(page.getByLabel("批次号")).toHaveAttribute("placeholder", /STATUS-/)
  await page.getByRole("link", { name: "取消" }).click()
  await expect(page.getByRole("dialog")).toHaveCount(0)
})

test("基础配置页统一导入向导承载主数据变体", async ({ page }) => {
  await page.goto("/base-config?tab=employees")

  await page.getByRole("link", { name: "批量导入" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByRole("heading", { name: "客服人员批量导入" })).toBeVisible()
  await expect(page.getByLabel("上传人")).toHaveValue("operator")
  await expect(page.getByLabel("字段映射 JSON")).toContainText("employee_name")

  await page.getByRole("link", { name: "取消" }).click()
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(page).toHaveURL(/\/base-config\?tab=employees$/)
})
