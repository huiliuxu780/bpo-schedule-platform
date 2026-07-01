"use client"

import { useState } from "react"
import {
  AlertTriangle,
  CheckCircle2,
  CircleAlert,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  buildIm276AcceptanceScenario,
  buildIm277AdjustmentScenarios,
  calculateCoverageResult,
} from "@/lib/wfm-coverage"

const reasonLabels = {
  standard_capacity_gap: "标准人力不足",
  low_capacity_substitution: "低能力补位",
  skill_mismatch: "技能错配",
  overstaffed: "超排",
} as const

const draftScenarioLabels = {
  initial: "初始草稿",
  tayMovedOut: "移出 tay",
  alexAdded: "加入 alex",
  lilyAdded: "加入 lily",
} as const

export function WfmTeamSchedulingBoard() {
  const { demand } = buildIm276AcceptanceScenario()
  const scenarios = buildIm277AdjustmentScenarios()
  const [draftScenario, setDraftScenario] = useState("initial")
  const scenarioOptions = Object.values(scenarios)
  const currentScenario = scenarios[draftScenario] ?? scenarios.initial
  const coverage = currentScenario.coverage
  const assignments = currentScenario.assignments

  return (
    <section className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="grid gap-1">
          <h2 className="text-xl font-semibold tracking-normal">
            班组长排班板 v0.1
          </h2>
          <p className="text-sm text-muted-foreground">
            小组级预测需求、人员级排班草稿、标准人力覆盖和草稿缺口预警在同一工作台内复核。
          </p>
          <p className="text-sm font-medium">上海职场 / A 项目 / A 组</p>
          <p className="text-sm text-muted-foreground">
            投诉 10:00-10:30 需求 3.0 标准人力，当前已排{" "}
            {formatCapacity(coverage.scheduledStandardCapacity)}，缺口{" "}
            {formatCapacity(coverage.gapStandardCapacity)}。
          </p>
          <p className="text-sm text-muted-foreground">
            基准样例：覆盖人数 3，已排 2.2，缺口 0.8。
          </p>
        </div>
        <Badge variant="outline">草稿可保存</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">调整草稿</CardTitle>
          <CardDescription>
            当前场景：{currentScenario.label}。{currentScenario.summary}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {scenarioOptions.map((scenario) => (
            <Button
              key={scenario.id}
              type="button"
              variant={draftScenario === scenario.id ? "default" : "outline"}
              size="sm"
              onClick={() => setDraftScenario(scenario.id)}
            >
              {draftScenarioLabels[
                scenario.id as keyof typeof draftScenarioLabels
              ] ?? scenario.label}
            </Button>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">小组级预测需求</CardTitle>
            <CardDescription>{coverage.scopeLabel}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Metric label="业务日期" value={demand.businessDate} />
              <Metric label="时段" value={`${demand.intervalStart}-${demand.intervalEnd}`} />
              <Metric label="职场 / 项目" value={`${demand.workplaceName} / ${demand.projectName}`} />
              <Metric label="小组 / 技能" value={`${demand.teamName} / ${demand.skillName}`} />
            </div>
            <div className="rounded-md border p-4">
              <div className="text-sm text-muted-foreground">需求</div>
              <div className="mt-1 text-3xl font-semibold">
                {formatCapacity(coverage.requiredStandardCapacity)} 标准人力
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">人员级排班草稿</CardTitle>
            <CardDescription>
              班次决定时间覆盖，技能能力决定标准人力贡献。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>员工</TableHead>
                  <TableHead>班次</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>技能</TableHead>
                  <TableHead className="text-right">贡献</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coverage.contributors.map((contributor) => {
                  const assignment = assignments.find(
                    (item) => item.employeeId === contributor.employeeId
                  )

                  return (
                    <TableRow key={contributor.employeeId}>
                      <TableCell className="font-medium">
                        {contributor.employeeName}
                      </TableCell>
                      <TableCell>{contributor.shiftTypeName}</TableCell>
                      <TableCell>
                        {assignment?.startTime}-{assignment?.endTime}
                      </TableCell>
                      <TableCell>{contributor.plannedSkillName}</TableCell>
                      <TableCell className="text-right">
                        {formatCapacity(contributor.standardCapacityContribution)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            贡献人员：
            {coverage.contributors
              .map(
                (contributor) =>
                  `${contributor.employeeName} ${formatCapacity(
                    contributor.standardCapacityContribution
                  )}`
              )
              .join("、")}
            。
          </CardFooter>
        </Card>

        <CapacityGapPanel coverage={coverage} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">技能错配校验</CardTitle>
          <CardDescription>
            无目标技能人员可以出现在草稿中，但对当前技能贡献为 0。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          {coverage.contributors.map((contributor) => (
            <div key={contributor.employeeId} className="rounded-md border p-3">
              <div className="font-medium">{contributor.employeeName}</div>
              <div className="mt-1 text-sm text-muted-foreground">
                {contributor.reason === "no_target_skill"
                  ? "无投诉技能"
                  : "具备投诉技能"}
              </div>
              <div className="mt-3 text-lg font-semibold">
                {formatCapacity(contributor.standardCapacityContribution)}
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Badge variant="destructive">技能错配</Badge>
          <span>
            alex 对投诉贡献为 0；当前草稿不能用覆盖人数自动填补标准人力缺口。
          </span>
        </CardFooter>
      </Card>
    </section>
  )
}

function CapacityGapPanel({ coverage }: { coverage: ReturnType<typeof calculateCoverageResult> }) {
  const isSatisfied = coverage.resultStatus === "satisfied"

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {isSatisfied ? (
            <CheckCircle2 className="size-4 text-muted-foreground" />
          ) : (
            <CircleAlert className="size-4 text-destructive" />
          )}
          草稿缺口预警
        </CardTitle>
        <CardDescription>
          {isSatisfied
            ? "当前时段已达到预测需求，保存草稿仍不代表正式履约承诺。"
            : `覆盖人数为 ${coverage.coveredEmployeeCount}，但标准人力仍不满足当前需求。`}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Metric
            label="需求"
            value={formatCapacity(coverage.requiredStandardCapacity)}
          />
          <Metric
            label="已排标准人力"
            value={formatCapacity(coverage.scheduledStandardCapacity)}
          />
          <Metric
            label="缺口"
            value={formatCapacity(coverage.gapStandardCapacity)}
          />
          <Metric label="覆盖人数" value={`${coverage.coveredEmployeeCount}`} />
        </div>
        <Separator />
        <div className="grid gap-2">
          {coverage.reasons.length > 0 ? (
            coverage.reasons.map((reason) => (
              <div key={reason} className="flex items-center gap-2 text-sm">
                {reason === "standard_capacity_gap" ? (
                  <AlertTriangle className="size-4 text-destructive" />
                ) : (
                  <Users className="size-4 text-muted-foreground" />
                )}
                <span>{reasonLabels[reason]}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-muted-foreground" />
              <span>满足</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="size-4" />
            <span>草稿可保存，但不能视为已满足。</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-semibold">{value}</div>
    </div>
  )
}

function formatCapacity(value: number) {
  return value.toFixed(1)
}
