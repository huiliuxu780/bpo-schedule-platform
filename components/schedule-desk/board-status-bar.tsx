"use client"

// 状态区：周期/版本/范围/覆盖摘要 + 编辑态实时指标
//（未保存计数、校验错误数、最近保存时间）+ 发布入口按钮。
// 只读（已发布）状态下编辑指标隐藏并给出说明。

import { Loader2, Rocket } from "lucide-react"

import {
  type CoverageOverallSummary,
  schedulePeriodStatusLabel,
  type ScheduleDeskApiPeriod,
} from "@/components/schedule-desk/schedule-matrix-model"
import { useMatrixStatus } from "@/components/schedule-desk/use-matrix-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ScheduleDeskStatusBarProps = {
  period: ScheduleDeskApiPeriod
  matrixVersion: number
  rangeLabel: string
  employeeCount: number
  cellCount: number
  coverageOverall: CoverageOverallSummary
  onPublishRequest: () => void
}

export function ScheduleDeskStatusBar({
  period,
  matrixVersion,
  rangeLabel,
  employeeCount,
  cellCount,
  coverageOverall,
  onPublishRequest,
}: ScheduleDeskStatusBarProps) {
  const status = useMatrixStatus()
  const statusLabel = schedulePeriodStatusLabel(period.status)
  const readOnly = period.status === "published"

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-x-6 gap-y-2 p-3 text-sm">
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">周期状态</span>
          <Badge variant={readOnly ? "default" : "secondary"}>{statusLabel}</Badge>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">周期</span>
          <span className="font-mono text-xs">{period.period_id}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">矩阵版本</span>
          <span className="font-medium tabular-nums">v{status.baseVersion || matrixVersion}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">当前范围</span>
          <span>{rangeLabel}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">员工</span>
          <span className="tabular-nums">{employeeCount.toLocaleString("zh-CN")} 人</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">排班单元格</span>
          <span className="tabular-nums">{cellCount.toLocaleString("zh-CN")} 个</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="text-muted-foreground">覆盖摘要</span>
          <span className="tabular-nums">
            需求 {coverageOverall.demandTotal.toLocaleString("zh-CN")} / 计划{" "}
            {coverageOverall.plannedTotal.toLocaleString("zh-CN")} / 缺口{" "}
            {coverageOverall.gapTotal.toLocaleString("zh-CN")}
          </span>
          <span className="text-muted-foreground">
            平均覆盖率 {coverageOverall.averageCoverageRateLabel}
          </span>
        </span>
        {readOnly ? (
          <span className="text-xs text-muted-foreground">已发布周期为只读展示，编辑控件不可用</span>
        ) : (
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">未保存</span>
              <Badge variant={status.dirtyCount > 0 ? "secondary" : "outline"} className="tabular-nums">
                {status.dirtyCount} 处
              </Badge>
              {status.saving ? (
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" aria-hidden />
                  保存中
                </span>
              ) : null}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-muted-foreground">校验</span>
              <Badge
                variant={status.validationErrorCount > 0 ? "destructive" : "outline"}
                className="tabular-nums"
              >
                错误 {status.validationErrorCount}
              </Badge>
              <Badge variant="outline" className="tabular-nums">
                警告 {status.validationWarningCount}
              </Badge>
            </span>
            {status.lastSavedAt ? (
              <span className="text-muted-foreground">
                最近保存 {new Date(status.lastSavedAt).toLocaleTimeString("zh-CN")}
              </span>
            ) : null}
          </span>
        )}
        <span className="ml-auto">
          <Button
            type="button"
            size="sm"
            disabled={readOnly}
            title={readOnly ? "周期已发布，无需重复发布" : "校验并确认后排班发布"}
            onClick={onPublishRequest}
          >
            <Rocket />
            发布排班
          </Button>
        </span>
      </CardContent>
    </Card>
  )
}
