// 员工排班限制模型：夜班/跨日班开关与不可排班日期的纯函数处理。
// 供详情页限制区块（components/employee-restrictions-form.tsx）与
// server action（app/master-data/agents/[employeeId]/actions.ts）共用，
// 保证客户端预校验与服务端提交校验逻辑一致。

export const EMPLOYEE_RESTRICTIONS_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export type EmployeeRestrictionsInput = {
  nightShiftAllowed: boolean
  crossDayAllowed: boolean
  unavailableDates: string[]
}

export type NormalizedUnavailableDates = {
  dates: string[]
  errors: string[]
}

export function isValidUnavailableDate(value: string): boolean {
  if (!EMPLOYEE_RESTRICTIONS_DATE_PATTERN.test(value)) {
    return false
  }

  const [year, month, day] = value.split("-").map(Number)
  const parsed = new Date(Date.UTC(year, month - 1, day))

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}

// 规范化不可排班日期：去空白、校验 YYYY-MM-DD 合法日期、去重、升序排序。
// 空字符串静默忽略（表单未填写时不视为错误），非法日期收集到 errors。
export function normalizeUnavailableDates(
  values: readonly string[]
): NormalizedUnavailableDates {
  const errors: string[] = []
  const seen = new Set<string>()

  for (const raw of values) {
    const value = raw.trim()
    if (!value) {
      continue
    }
    if (!isValidUnavailableDate(value)) {
      errors.push(`不可排班日期格式无效：${value}`)
      continue
    }
    seen.add(value)
  }

  return {
    dates: Array.from(seen).sort(),
    errors,
  }
}

export function buildEmployeeRestrictionsApiPath(employeeId: string): string {
  return `/api/v1/master-data/employees/${encodeURIComponent(employeeId)}/restrictions`
}

export function buildEmployeeRestrictionsPayload(
  input: EmployeeRestrictionsInput
): {
  night_shift_allowed: boolean
  cross_day_allowed: boolean
  unavailable_dates: string[]
} {
  return {
    night_shift_allowed: input.nightShiftAllowed,
    cross_day_allowed: input.crossDayAllowed,
    unavailable_dates: [...input.unavailableDates],
  }
}
