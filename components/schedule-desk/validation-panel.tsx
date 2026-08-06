"use client"

// 右侧校验面板：调 POST /schedule-periods/{id}/validate，问题项点击后
// 滚动定位到对应 员工/日期/分段（验收 14.2）。

import { AlertTriangle, OctagonX, RefreshCw, ShieldCheck } from "lucide-react"

import { type ScheduleValidationIssue } from "@/components/schedule-desk/schedule-matrix-model"
import { postScheduleValidation } from "@/components/schedule-desk/schedule-matrix-api"
import {
  getPeriodId,
  getRange,
  requestFocus,
  setValidationState,
  useMatrixStatus,
  useValidationState,
} from "@/components/schedule-desk/use-matrix-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type ValidationPanelProps = {
  periodId: string
}

export function ScheduleDeskValidationPanel({ periodId }: ValidationPanelProps) {
  const status = useMatrixStatus()
  const validation = useValidationState()
  const range = getRange()
  const { errors, warnings, loading, ranAt, errorText } = validation
  const total = errors.length + warnings.length

  async function handleValidate() {
    const requestPeriodId = periodId
    const requestRange = getRange()
    setValidationState({ loading: true, errorText: null })

    const outcome = await postScheduleValidation(
      requestPeriodId,
      requestRange.dateFrom,
      requestRange.dateTo
    )

    // 响应回来时周期/范围已切换：丢弃本次结果，不把旧范围的校验写入新状态。
    const currentRange = getRange()

    if (
      getPeriodId() !== requestPeriodId ||
      currentRange.dateFrom !== requestRange.dateFrom ||
      currentRange.dateTo !== requestRange.dateTo
    ) {
      setValidationState({ loading: false })

      return
    }

    if (outcome.error || !outcome.data) {
      setValidationState({ loading: false, errorText: outcome.error ?? "校验失败" })

      return
    }

    setValidationState({
      loading: false,
      ranAt: new Date().toISOString(),
      errors: outcome.data.errors,
      warnings: outcome.data.warnings,
      errorText: null,
    })
  }

  function handleLocate(issue: ScheduleValidationIssue) {
    requestFocus(issue.employee_id, issue.schedule_date, issue.segment_index)
  }

  return (
    <Card className="flex w-full flex-col lg:w-80">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base">排班校验</CardTitle>
            <CardDescription>
              {range.dateFrom && range.dateTo ? `${range.dateFrom} 至 ${range.dateTo}` : "—"}
            </CardDescription>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void handleValidate()}
            disabled={loading || status.saving}
          >
            {loading ? <RefreshCw className="animate-spin" /> : <ShieldCheck />}
            {ranAt ? "重新校验" : "校验"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-2">
        {loading ? <p className="text-sm text-muted-foreground">正在执行排班规则校验…</p> : null}
        {errorText ? <p className="text-sm text-destructive">{errorText}</p> : null}
        {!loading && total === 0 && ranAt ? (
          <p className="flex items-center gap-1.5 text-sm text-emerald-600">
            <ShieldCheck className="size-4" aria-hidden />
            校验通过，没有发现错误与警告
          </p>
        ) : null}
        {!loading && total === 0 && !ranAt ? (
          <p className="text-sm text-muted-foreground">
            点击「校验」按员工排班规则检查当前范围（缺班、跨日、夜班、时长、连班等）。
          </p>
        ) : null}
        <div className="flex max-h-[420px] min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          {errors.length > 0 ? (
            <IssueGroup title="错误" tone="error" issues={errors} onLocate={handleLocate} />
          ) : null}
          {warnings.length > 0 ? (
            <IssueGroup title="警告" tone="warning" issues={warnings} onLocate={handleLocate} />
          ) : null}
        </div>
        {ranAt && !loading ? (
          <p className="text-xs text-muted-foreground">
            最近校验：{new Date(ranAt).toLocaleTimeString("zh-CN")} · 错误 {errors.length} · 警告{" "}
            {warnings.length}
          </p>
        ) : null}
      </CardContent>
    </Card>
  )
}

type IssueGroupProps = {
  title: string
  tone: "error" | "warning"
  issues: ScheduleValidationIssue[]
  onLocate: (issue: ScheduleValidationIssue) => void
}

function IssueGroup({ title, tone, issues, onLocate }: IssueGroupProps) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2">
        {tone === "error" ? (
          <OctagonX className="size-4 text-destructive" aria-hidden />
        ) : (
          <AlertTriangle className="size-4 text-amber-500" aria-hidden />
        )}
        <span className="text-sm font-medium">{title}</span>
        <Badge variant={tone === "error" ? "destructive" : "secondary"}>{issues.length}</Badge>
      </div>
      <ul className="flex flex-col gap-1">
        {issues.map((issue, index) => (
          <li key={`${issue.rule_code}-${issue.employee_id}-${issue.schedule_date}-${index}`}>
            <button
              type="button"
              onClick={() => onLocate(issue)}
              className={cn(
                "w-full rounded-md border px-2.5 py-2 text-left text-xs transition-colors",
                "hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
              )}
              title="点击定位到矩阵对应单元格"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  {issue.employee_id} · {issue.schedule_date}
                  {issue.segment_index !== null ? ` · 分段 ${issue.segment_index + 1}` : ""}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">{issue.rule_code}</span>
              </span>
              <span className="mt-0.5 block text-muted-foreground">{issue.message}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
