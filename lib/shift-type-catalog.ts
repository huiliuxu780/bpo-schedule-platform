export type ShiftTypeStatus = "active" | "inactive" | "draft"

export type ShiftType = {
  id: string
  code: string
  name: string
  workplace: string
  supplier: string
  project: string
  startTime: string
  endTime: string
  durationHours: number
  mealBreakMinutes: number
  restBreakMinutes: number
  halfHourIntervals: number
  assignedPeople: number
  skillGroups: string[]
  status: ShiftTypeStatus
  note: string
}

export type ShiftTypeSummary = {
  total: number
  active: number
  inactive: number
  draft: number
  withMealBreak: number
  totalAssignedPeople: number
  totalScheduledHours: number
  deferredActions: string[]
}

export const deferredShiftTypeActions = [
  "无班次规则计算",
  "无自动排班生成",
  "无主数据 CRUD",
  "无冻结解冻",
  "无生产公式",
]

export const fallbackShiftTypes: ShiftType[] = [
  {
    id: "SHIFT-MORNING-01",
    code: "MORNING_A",
    name: "早班 A",
    workplace: "上海职场",
    supplier: "华东供应商",
    project: "Bosch CC",
    startTime: "09:00",
    endTime: "18:00",
    durationHours: 8,
    mealBreakMinutes: 60,
    restBreakMinutes: 30,
    halfHourIntervals: 16,
    assignedPeople: 36,
    skillGroups: ["售前", "中文"],
    status: "active",
    note: "第一期人员级排班默认班次。",
  },
  {
    id: "SHIFT-MID-01",
    code: "MID_B",
    name: "中班 B",
    workplace: "苏州职场",
    supplier: "华东供应商",
    project: "Bosch CC",
    startTime: "11:00",
    endTime: "20:00",
    durationHours: 8,
    mealBreakMinutes: 60,
    restBreakMinutes: 30,
    halfHourIntervals: 16,
    assignedPeople: 28,
    skillGroups: ["售后", "中文"],
    status: "active",
    note: "覆盖午后和晚高峰需求预测。",
  },
  {
    id: "SHIFT-LATE-01",
    code: "LATE_C",
    name: "晚班 C",
    workplace: "广州职场",
    supplier: "华南供应商",
    project: "Bosch CC",
    startTime: "14:00",
    endTime: "22:00",
    durationHours: 7.5,
    mealBreakMinutes: 30,
    restBreakMinutes: 30,
    halfHourIntervals: 15,
    assignedPeople: 18,
    skillGroups: ["售后", "英文"],
    status: "active",
    note: "用于晚间英文技能组覆盖。",
  },
  {
    id: "SHIFT-SPLIT-01",
    code: "SPLIT_D",
    name: "拆分班 D",
    workplace: "上海职场",
    supplier: "试点供应商",
    project: "Bosch CC",
    startTime: "09:00",
    endTime: "20:00",
    durationHours: 8,
    mealBreakMinutes: 120,
    restBreakMinutes: 0,
    halfHourIntervals: 16,
    assignedPeople: 0,
    skillGroups: ["试点"],
    status: "draft",
    note: "只作为后续复杂班次配置占位。",
  },
]

export function summarizeShiftTypes(rows: ShiftType[]): ShiftTypeSummary {
  return rows.reduce<ShiftTypeSummary>(
    (summary, row) => {
      summary.total += 1
      summary.totalAssignedPeople += row.assignedPeople
      summary.totalScheduledHours += row.assignedPeople * row.durationHours

      if (row.status === "active") {
        summary.active += 1
      } else if (row.status === "inactive") {
        summary.inactive += 1
      } else {
        summary.draft += 1
      }

      if (row.mealBreakMinutes > 0) {
        summary.withMealBreak += 1
      }

      return summary
    },
    {
      total: 0,
      active: 0,
      inactive: 0,
      draft: 0,
      withMealBreak: 0,
      totalAssignedPeople: 0,
      totalScheduledHours: 0,
      deferredActions: deferredShiftTypeActions,
    }
  )
}

export function filterShiftTypes(
  rows: ShiftType[],
  filters: { status?: ShiftTypeStatus | "all"; project?: string | "all" } = {}
) {
  const { status = "all", project = "all" } = filters

  return rows.filter((row) => {
    if (status !== "all" && row.status !== status) {
      return false
    }

    if (project !== "all" && row.project !== project) {
      return false
    }

    return true
  })
}

export function getShiftTypeById(id: string) {
  return fallbackShiftTypes.find((row) => row.id === id)
}

export function shiftTypeStatusLabel(status: ShiftTypeStatus) {
  const labels: Record<ShiftTypeStatus, string> = {
    active: "启用",
    inactive: "停用",
    draft: "草稿",
  }

  return labels[status]
}
