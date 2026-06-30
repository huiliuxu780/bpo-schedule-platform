export type DemandRequirement = {
  businessDate: string
  intervalStart: string
  intervalEnd: string
  workplaceName: string
  projectName: string
  teamName: string
  skillName: string
  requiredStandardCapacity: number
}

export type EmployeeSkillCapacity = {
  employeeId: string
  employeeName: string
  employeeType?: string
  skillCapacities: Record<string, number>
}

export type ShiftAssignment = {
  assignmentId: string
  employeeId: string
  shiftTypeName: string
  startTime: string
  endTime: string
  plannedSkillName: string
}

export type CoverageContributor = {
  employeeId: string
  employeeName: string
  shiftTypeName: string
  plannedSkillName: string
  standardCapacityContribution: number
  reason: "target_skill" | "no_target_skill" | "different_planned_skill"
}

export type CoverageResultStatus = "satisfied" | "insufficient" | "overstaffed"

export type CoverageResultReason =
  | "standard_capacity_gap"
  | "low_capacity_substitution"
  | "skill_mismatch"
  | "overstaffed"

export type CoverageResult = {
  scopeLabel: string
  requiredStandardCapacity: number
  scheduledStandardCapacity: number
  gapStandardCapacity: number
  coveredEmployeeCount: number
  resultStatus: CoverageResultStatus
  reasons: CoverageResultReason[]
  contributors: CoverageContributor[]
}

export function calculateCoverageResult(
  demand: DemandRequirement,
  assignments: ShiftAssignment[],
  employees: EmployeeSkillCapacity[]
): CoverageResult {
  const employeeById = new Map(
    employees.map((employee) => [employee.employeeId, employee])
  )

  const contributors = assignments
    .filter((assignment) => assignmentCoversDemandInterval(assignment, demand))
    .map((assignment) => {
      const employee = employeeById.get(assignment.employeeId)
      const skillMatches = assignment.plannedSkillName === demand.skillName
      const contribution =
        employee && skillMatches
          ? employee.skillCapacities[demand.skillName] ?? 0
          : 0
      const reason: CoverageContributor["reason"] = skillMatches
        ? contribution > 0
          ? "target_skill"
          : "no_target_skill"
        : "different_planned_skill"

      return {
        employeeId: assignment.employeeId,
        employeeName: employee?.employeeName ?? assignment.employeeId,
        shiftTypeName: assignment.shiftTypeName,
        plannedSkillName: assignment.plannedSkillName,
        standardCapacityContribution: roundCapacity(contribution),
        reason,
      }
    })

  const scheduledStandardCapacity = roundCapacity(
    contributors.reduce(
      (sum, contributor) => sum + contributor.standardCapacityContribution,
      0
    )
  )
  const gapStandardCapacity = roundCapacity(
    Math.max(demand.requiredStandardCapacity - scheduledStandardCapacity, 0)
  )
  const resultStatus: CoverageResultStatus =
    gapStandardCapacity > 0
      ? "insufficient"
      : scheduledStandardCapacity > demand.requiredStandardCapacity
        ? "overstaffed"
        : "satisfied"
  const reasons: CoverageResultReason[] = []

  if (gapStandardCapacity > 0) {
    reasons.push("standard_capacity_gap")
  }
  if (
    contributors.some(
      (contributor) =>
        contributor.standardCapacityContribution > 0 &&
        contributor.standardCapacityContribution < 1
    )
  ) {
    reasons.push("low_capacity_substitution")
  }
  if (
    contributors.some(
      (contributor) => contributor.standardCapacityContribution === 0
    )
  ) {
    reasons.push("skill_mismatch")
  }
  if (resultStatus === "overstaffed") {
    reasons.push("overstaffed")
  }

  return {
    scopeLabel: `${demand.workplaceName} / ${demand.projectName} / ${demand.teamName} / ${demand.skillName} / ${demand.intervalStart}-${demand.intervalEnd}`,
    requiredStandardCapacity: demand.requiredStandardCapacity,
    scheduledStandardCapacity,
    gapStandardCapacity,
    coveredEmployeeCount: contributors.length,
    resultStatus,
    reasons,
    contributors,
  }
}

export function buildIm276AcceptanceScenario() {
  const demand: DemandRequirement = {
    businessDate: "2026-06-30",
    intervalStart: "10:00",
    intervalEnd: "10:30",
    workplaceName: "上海职场",
    projectName: "A 项目",
    teamName: "A 组",
    skillName: "投诉",
    requiredStandardCapacity: 3,
  }
  const employees: EmployeeSkillCapacity[] = [
    {
      employeeId: "king",
      employeeName: "king",
      employeeType: "正式",
      skillCapacities: { 投诉: 1, 售后: 0.6 },
    },
    {
      employeeId: "james",
      employeeName: "james",
      employeeType: "正式",
      skillCapacities: { 投诉: 1, 工单: 0.8 },
    },
    {
      employeeId: "tay",
      employeeName: "tay",
      employeeType: "实习",
      skillCapacities: { 投诉: 0.2 },
    },
    {
      employeeId: "alex",
      employeeName: "alex",
      employeeType: "正式",
      skillCapacities: { 售后: 1 },
    },
  ]
  const assignments: ShiftAssignment[] = [
    {
      assignmentId: "assignment-king",
      employeeId: "king",
      shiftTypeName: "大白班",
      startTime: "09:00",
      endTime: "18:00",
      plannedSkillName: "投诉",
    },
    {
      assignmentId: "assignment-james",
      employeeId: "james",
      shiftTypeName: "小白班",
      startTime: "10:00",
      endTime: "19:00",
      plannedSkillName: "投诉",
    },
    {
      assignmentId: "assignment-tay",
      employeeId: "tay",
      shiftTypeName: "临时班",
      startTime: "10:00",
      endTime: "12:00",
      plannedSkillName: "投诉",
    },
  ]

  return { demand, employees, assignments }
}

function assignmentCoversDemandInterval(
  assignment: ShiftAssignment,
  demand: DemandRequirement
) {
  const assignmentStart = parseTimeToMinutes(assignment.startTime)
  const assignmentEnd = parseTimeToMinutes(assignment.endTime)
  const demandStart = parseTimeToMinutes(demand.intervalStart)
  const demandEnd = parseTimeToMinutes(demand.intervalEnd)

  return assignmentStart <= demandStart && assignmentEnd >= demandEnd
}

function parseTimeToMinutes(value: string) {
  const [hour, minute] = value.split(":").map(Number)
  return hour * 60 + minute
}

function roundCapacity(value: number) {
  return Number(value.toFixed(3))
}
