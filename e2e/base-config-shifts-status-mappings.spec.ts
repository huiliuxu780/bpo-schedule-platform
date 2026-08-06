import { expect, test } from "@playwright/test"

// 基础配置「班次与活动」「状态映射」两标签闭环：班次列表渲染 → 新建班次
// （产生 V1 版本）→ 修订班次（追加 V2、历史保留）→ 校验失败横幅 → 跨日班次
// 回绕分段 → 状态映射编辑保存 → 反馈横幅。运行方式：bash scripts/e2e.sh
// （由 scripts/check.sh 调用），e2e 环境使用独立数据库。
//
// 执行顺序契约：
// ① Playwright 按文件名字母序执行，本 spec（base-config-*）先于其余 spec；
//    空态断言依赖两点——review_demo_seed 不播种 shift_definitions /
//    status_activity_mappings 两张表，且没有其他 spec 先于本文件写入这两张表。
//    文件内各用例同样严格按声明顺序执行并共享状态（V1→V2、映射合并）。
// ② 残留数据清单（供后续 spec 参考）：
//    - 班次定义：E2E-MORN（V1 已归档、V2 生效「E2E早班（调整）」）、
//      E2E-NIGHT（V1 生效，跨日 22:00–06:00）；
//    - 状态映射：在岗 / 接线 / CD-E2E → hotline_online「热线在线服务」，
//      计入考勤。
//    后续 spec 不得对这两张表做空态/计数断言（排班台班次码候选 datalist
//    会包含 E2E-MORN/E2E-NIGHT，属预期残留）。

const shiftsTabPath = "/base-config?tab=shifts"
const mappingsTabPath = "/base-config?tab=status-mappings"
const shiftsTabUrlPattern = /\/base-config\?tab=shifts/
const mappingsTabUrlPattern = /\/base-config\?tab=status-mappings/
const seedShiftCode = "E2E-MORN"

test("班次标签渲染空态并通过新建班次生成 V1 版本", async ({ page }) => {
  await page.goto(shiftsTabPath)

  // 空态与新建表单就位：默认一个待填写的工作分段。
  await expect(page.getByText("暂无班次定义")).toBeVisible()
  await expect(page.getByRole("heading", { name: "新建班次" })).toBeVisible()

  await page.getByLabel("班次代码").fill(seedShiftCode)
  await page.getByLabel("班次名称").fill("E2E早班")
  await page.getByLabel("生效开始").fill("2026-08-01")
  await page.getByLabel("生效结束").fill("2026-12-31")
  await page.getByLabel("分段1开始时间").fill("08:00")
  await page.getByLabel("分段1结束时间").fill("12:00")

  // 追加一个用餐分段，验证多活动分段编辑。
  await page.getByRole("button", { name: "添加活动分段" }).click()
  await page.getByLabel("分段2活动类型").selectOption("meal")
  await page.getByLabel("分段2开始时间").fill("12:00")
  await page.getByLabel("分段2结束时间").fill("12:45")

  await page.getByRole("button", { name: "保存班次定义" }).click()

  // 保存成功横幅 + V1 版本卡片（含时间条与分段）。
  await expect(page).toHaveURL(shiftsTabUrlPattern)
  await expect(page.getByText("班次定义保存成功")).toBeVisible()
  await expect(page.getByText("已生成新版本，历史版本未被覆写")).toBeVisible()
  await expect(page.getByText(seedShiftCode).first()).toBeVisible()
  await expect(page.getByText("V1", { exact: true })).toBeVisible()
  await expect(page.getByText("生效中", { exact: true })).toBeVisible()
  await expect(page.getByText("工作 08:00-12:00")).toBeVisible()
  await expect(page.getByText("用餐 12:00-12:45")).toBeVisible()
})

test("修订同一班次追加 V2 版本且不覆写 V1 历史", async ({ page }) => {
  await page.goto(shiftsTabPath)

  await page.getByRole("link", { name: "修订（生成新版本）" }).click()

  // 修订表单回显最新版本的班次信息，班次代码锁定不可改。
  await expect(page.getByRole("heading", { name: "修订班次" })).toBeVisible()
  await expect(page.getByLabel("班次代码")).toHaveValue(seedShiftCode)
  await expect(page.getByLabel("分段1开始时间")).toHaveValue("08:00")

  await page.getByLabel("班次名称").fill("E2E早班（调整）")
  await page.getByRole("button", { name: "保存班次定义" }).click()

  // V2 生效中，V1 以归档形式保留在历史版本区。
  await expect(page.getByText("班次定义保存成功")).toBeVisible()
  await expect(page.getByText("V2", { exact: true })).toBeVisible()
  await expect(page.getByText("E2E早班（调整）").first()).toBeVisible()
  await expect(page.getByText(/历史版本（1 个，已归档保留）/)).toBeVisible()
  await expect(page.getByText(/V1 E2E早班 ·/)).toBeVisible()
})

test("状态映射标签新增映射保存后横幅与快照回显", async ({ page }) => {
  await page.goto(mappingsTabPath)

  await expect(page.getByText("暂无状态映射")).toBeVisible()

  await page.getByRole("button", { name: "新增映射" }).click()
  await page.getByLabel("第1行状态", { exact: true }).fill("在岗")
  await page.getByLabel("第1行子状态").fill("接线")
  await page.getByLabel("第1行状态码").fill("CD-E2E")
  await page.getByLabel("第1行业务活动代码").fill("hotline_online")
  await page.getByLabel("第1行业务活动名称").fill("热线在线")
  await page.getByLabel("第1行计入考勤").check()

  await page.getByRole("button", { name: "保存状态映射" }).click()

  await expect(page).toHaveURL(mappingsTabUrlPattern)
  await expect(page.getByText("状态映射保存成功")).toBeVisible()
  await expect(page.getByText("在岗 / 接线 / CD-E2E")).toBeVisible()
  await expect(page.getByText("计入考勤").first()).toBeVisible()
})

test("状态映射按三元组合并覆盖，重复保存不新增行", async ({ page }) => {
  await page.goto(mappingsTabPath)

  // 上一轮保存的映射回显在编辑区。
  await expect(page.getByLabel("第1行状态", { exact: true })).toHaveValue("在岗")
  await expect(page.getByLabel("第1行计入考勤")).toBeChecked()

  // 修改业务活动名称后再次保存：同三元组合并覆盖，仍只有一条映射。
  await page.getByLabel("第1行业务活动名称").fill("热线在线服务")
  await page.getByRole("button", { name: "保存状态映射" }).click()

  await expect(page.getByText("状态映射保存成功")).toBeVisible()
  await expect(page.getByText("已按状态三元组合并保存 1 条映射")).toBeVisible()
  await expect(page.getByText("热线在线服务")).toBeVisible()
  await expect(page.getByText("当前生效映射（1 条）")).toBeVisible()
})

test("班次表单校验失败时横幅展示错误码文案", async ({ page }) => {
  await page.goto(shiftsTabPath)

  // 只有用餐分段、缺工作分段 → SHIFT_WORK_SEGMENT_REQUIRED。
  await page.getByLabel("班次代码").fill("E2E-BAD")
  await page.getByLabel("班次名称").fill("E2E无效班次")
  await page.getByLabel("生效开始").fill("2026-08-01")
  await page.getByLabel("生效结束").fill("2026-12-31")
  await page.getByLabel("分段1活动类型").selectOption("meal")
  await page.getByLabel("分段1开始时间").fill("12:00")
  await page.getByLabel("分段1结束时间").fill("13:00")
  await page.getByRole("button", { name: "保存班次定义" }).click()

  await expect(page).toHaveURL(shiftsTabUrlPattern)
  await expect(page.getByText("班次定义保存失败")).toBeVisible()
  await expect(page.getByText(/SHIFT_WORK_SEGMENT_REQUIRED/)).toBeVisible()

  // 失败 redirect 后表单重挂为空白；改起止相同再提交 → SHIFT_SEGMENT_INVALID。
  await page.getByLabel("班次代码").fill("E2E-BAD")
  await page.getByLabel("班次名称").fill("E2E无效班次")
  await page.getByLabel("生效开始").fill("2026-08-01")
  await page.getByLabel("生效结束").fill("2026-12-31")
  await page.getByLabel("分段1开始时间").fill("09:00")
  await page.getByLabel("分段1结束时间").fill("09:00")
  await page.getByRole("button", { name: "保存班次定义" }).click()

  await expect(page.getByText("班次定义保存失败")).toBeVisible()
  await expect(page.getByText(/SHIFT_SEGMENT_INVALID/)).toBeVisible()
})

test("跨日班次回绕分段保存成功且时间条拆段渲染", async ({ page }) => {
  await page.goto(shiftsTabPath)

  await page.getByLabel("班次代码").fill("E2E-NIGHT")
  await page.getByLabel("班次名称").fill("E2E夜班")
  await page.getByLabel("生效开始").fill("2026-08-01")
  await page.getByLabel("生效结束").fill("2026-12-31")
  await page.locator("#is-cross-day").check()
  await page.getByLabel("分段1开始时间").fill("22:00")
  await page.getByLabel("分段1结束时间").fill("06:00")

  await page.getByRole("button", { name: "保存班次定义" }).click()

  // 成功横幅 + 跨日徽标 + 时间条按当日/次日拆成两段渲染。
  await expect(page.getByText("班次定义保存成功")).toBeVisible()
  await expect(page.getByText("E2E-NIGHT").first()).toBeVisible()
  await expect(page.getByText("跨日", { exact: true })).toBeVisible()
  await expect(page.getByText("工作 22:00-06:00")).toBeVisible()
  await expect(
    page.locator('[title="工作 22:00-06:00（当日部分）"]')
  ).toBeVisible()
  await expect(
    page.locator('[title="工作 22:00-06:00（次日部分）"]')
  ).toBeVisible()
})

test("同路由切换修订目标时表单重挂回显新版本", async ({ page }) => {
  await page.goto(`${shiftsTabPath}&shift_edit=E2E-MORN`)

  await expect(page.getByLabel("班次名称")).toHaveValue("E2E早班（调整）")

  // 客户端导航：取消修订 → 点另一个班次的修订链接（同路由、组件不整体刷新）。
  await page.getByRole("link", { name: "取消修订" }).click()
  // 此时存在 E2E-MORN / E2E-NIGHT 两个班次组，E2E-NIGHT 按代码排序在最后。
  await page.getByRole("link", { name: "修订（生成新版本）" }).last().click()

  // key 重挂后回显必须切到 E2E-NIGHT，而不是滞留 E2E-MORN 的旧值。
  await expect(page.getByLabel("班次代码")).toHaveValue("E2E-NIGHT")
  await expect(page.getByLabel("班次名称")).toHaveValue("E2E夜班")
  await expect(page.getByLabel("分段1开始时间")).toHaveValue("22:00")
})
