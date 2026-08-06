import { expect, test } from "@playwright/test"

// 阶段 4 行为检查：排班矩阵编辑/校验/发布闭环。
// 自备种子：beforeAll 经后端 API（创建专属员工+绑定 → upload-csv →
// apply-personnel-schedule → 创建周期）向 e2e 独立数据库注入最小排班周期
// （2026-06，员工 E2E-EMP-01），不依赖 dev 库。
// 不复用种子员工 A-1001：navigation-shell.spec.ts 按字母序先跑，其冻结提交
// 会把 A-1001 置为 frozen，排班落库校验拒绝冻结员工（frozen 判定为
// personnel_schedule_persistence 的通用主数据校验，属业务规则不改）。
// 用户流：查看矩阵 → 编辑空单元格新增分段 → 自动保存（未保存计数归零）→
// 校验 → 发布（状态转已发布、矩阵转只读）。

const apiBase = process.env.NEXT_PUBLIC_BPO_API_BASE_URL ?? "http://127.0.0.1:8810"
const batchId = "BATCH-E2E-MATRIX-001"
const sourceBatchId = "BATCH-DEMO-REVIEW-20260511"
const employeeId = "E2E-EMP-01"
const month = "2026-06"
const scheduleDates = ["2026-06-08", "2026-06-09", "2026-06-10"]
// 批次业务窗口比已排日期多 2 天：周期范围派生自批次业务日期，
// 2026-06-11/12 留在矩阵里作为空单元格供编辑用户流使用。
const businessDateTo = "2026-06-12"

const FIELD_MAPPING = JSON.stringify({
  source_key: "source_key",
  record_type: "record_type",
  shift_type_id: "shift_type_id",
  shift_type_name: "shift_type_name",
  status: "status",
  start_time: "start_time",
  end_time: "end_time",
  effective_from: "effective_from",
  effective_to: "effective_to",
  employee_id: "employee_id",
  workplace_id: "workplace_id",
  project_id: "project_id",
  skill_id: "skill_id",
  schedule_date: "schedule_date",
})

function buildSeedCsv(): string {
  const header = Object.keys(JSON.parse(FIELD_MAPPING)).join(",")
  const shiftRow = ["SHIFT-E2E-001", "shift_type", "E2E-DAY", "E2E 早班", "active", "09:00", "18:00", "2026-06-01", "2026-06-30", "", "", "", "", ""].join(",")
  const detailRows = scheduleDates.map((date) =>
    [`DETAIL-${date}`, "schedule_detail", "E2E-DAY", "", "", "09:00", "18:00", "", "", employeeId, "SH-01", "BOSCH-CS", "L1-CN", date].join(",")
  )

  return [header, shiftRow, ...detailRows].join("\n")
}

test.beforeAll(async ({ request }) => {
  // 第 0 步：创建 e2e 专属员工与绑定（复用种子主数据 SUP-A/SH-01/BOSCH-CS/L1-CN），
  // 避免依赖可能被其它 spec 冻结的共享种子员工。
  const employeeResponse = await request.post(
    `${apiBase}/api/v1/master-data/employees/${employeeId}/maintenance`,
    {
      data: {
        action: "create",
        source_batch_id: sourceBatchId,
        employee_name: "E2E 测试员工",
        workplace_id: "SH-01",
        effective_from: "2026-06-01",
        effective_to: "2026-06-30",
      },
    }
  )
  expect(
    employeeResponse.ok(),
    `create employee failed: ${await employeeResponse.text()}`
  ).toBe(true)

  const bindingResponse = await request.post(
    `${apiBase}/api/v1/master-data/bindings/BIND-${employeeId}/maintenance`,
    {
      data: {
        action: "create",
        source_batch_id: sourceBatchId,
        employee_id: employeeId,
        supplier_id: "SUP-A",
        workplace_id: "SH-01",
        project_id: "BOSCH-CS",
        skill_id: "L1-CN",
        effective_from: "2026-06-01",
        effective_to: "2026-06-30",
      },
    }
  )
  expect(
    bindingResponse.ok(),
    `create binding failed: ${await bindingResponse.text()}`
  ).toBe(true)

  const uploadUrl = new URL(`${apiBase}/api/v1/import-batches/upload-csv`)
  uploadUrl.searchParams.set("batch_id", batchId)
  uploadUrl.searchParams.set("file_name", "e2e-matrix-seed.csv")
  uploadUrl.searchParams.set("file_type", "personnel_schedule")
  uploadUrl.searchParams.set("uploaded_by", "e2e")
  uploadUrl.searchParams.set("business_date_from", scheduleDates[0])
  uploadUrl.searchParams.set("business_date_to", businessDateTo)
  uploadUrl.searchParams.set("field_mapping", FIELD_MAPPING)

  const uploadResponse = await request.post(uploadUrl.toString(), {
    data: buildSeedCsv(),
    headers: { "Content-Type": "text/csv" },
  })
  expect(uploadResponse.ok(), `upload-csv failed: ${await uploadResponse.text()}`).toBe(true)

  const applyResponse = await request.post(
    `${apiBase}/api/v1/import-batches/${batchId}/apply-personnel-schedule`
  )
  expect(applyResponse.ok(), `apply failed: ${await applyResponse.text()}`).toBe(true)

  const periodResponse = await request.post(`${apiBase}/api/v1/schedule-periods`, {
    data: { month, source_batch_id: batchId },
  })
  expect(periodResponse.ok(), `create period failed: ${await periodResponse.text()}`).toBe(true)
})

test("矩阵编辑、自动保存、校验与发布闭环", async ({ page }) => {
  // 第一段：打开 2026-06 周期，员工 E2E-EMP-01 的行与已排单元格摘要可见。
  await page.goto(`/schedule-desk?month=${month}`)
  await expect(page.getByRole("heading", { name: /排班矩阵/ })).toBeVisible()
  await expect(page.getByText(employeeId, { exact: true }).first()).toBeVisible()

  const seededCell = page.locator(`button[data-cell="${employeeId}|${scheduleDates[0]}"]`)
  await expect(seededCell).toBeVisible()
  await expect(
    page.locator(`button[data-cell="${employeeId}|2026-06-11"]`)
  ).toBeVisible()

  // 第二段：编辑空单元格（2026-06-11）——打开抽屉、新增分段、保存分段。
  await page.locator(`button[data-cell="${employeeId}|2026-06-11"]`).click()
  await expect(page.getByRole("heading", { name: "编辑活动分段" })).toBeVisible()
  await expect(page.getByText(`${employeeId} · 2026-06-11`)).toBeVisible()

  await page.getByRole("button", { name: "新增分段" }).click()
  await expect(page.getByText("分段 1")).toBeVisible()
  await page.getByRole("button", { name: "保存分段" }).click()
  await expect(page.getByRole("heading", { name: "编辑活动分段" })).toBeHidden()

  // 第三段：乐观更新即时标脏，300ms 防抖后自动保存成功（最近保存时间出现、未保存计数归零）。
  await expect(page.getByText("最近保存")).toBeVisible({ timeout: 10_000 })
  await expect(page.getByText("0 处")).toBeVisible()
  // 编辑后的单元格不再是空态占位。
  await expect(page.locator(`button[data-cell="${employeeId}|2026-06-11"]`)).toContainText("出勤")

  // 第四段：校验——点击「校验」执行规则检查并展示结果摘要。
  await page.getByRole("button", { name: /^校验$/ }).click()
  await expect(page.getByText(/最近校验/)).toBeVisible({ timeout: 15_000 })

  // 第五段：发布——确认弹窗展示摘要，发布成功后 toast 提示、状态转为已发布、矩阵转只读。
  await page.getByRole("button", { name: "发布排班" }).click()
  await expect(page.getByRole("heading", { name: "发布排班" })).toBeVisible()
  // 状态栏与发布弹窗都会展示周期编号，取弹窗内（发布范围摘要）其一即可。
  await expect(page.getByLabel("发布排班").getByText("PERIOD-2026-06")).toBeVisible()

  await page.getByRole("button", { name: "确认发布" }).click()
  await expect(page.getByText("排班已发布").first()).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole("heading", { name: "排班矩阵（只读）" })).toBeVisible({
    timeout: 15_000,
  })
  await expect(page.getByText("已发布周期为只读展示，编辑控件不可用")).toBeVisible()
})
