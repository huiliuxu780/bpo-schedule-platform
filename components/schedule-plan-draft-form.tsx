"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link"
import { SchedulePlanDraftSummary } from "@/components/schedule-plan-draft-summary"
import { SchedulePlanDraftValidationPanel } from "@/components/schedule-plan-draft-validation-panel"
import { validateSchedulePlanDraft } from "@/lib/schedule-plans"

type DraftMode = "create" | "edit"

type PlanFields = {
  plan_date: string
  project_name: string
  site_name: string
  version: string
}

type IntervalRow = {
  interval_start: string
  interval_end: string
  forecast_agents: number
  scheduled_agents: number
  note: string
}

type EditorRow = IntervalRow & { _id: number }

type SchedulePlanDraftFormProps = {
  mode: DraftMode
  planFields: PlanFields
  intervals: IntervalRow[]
  submitLabel: string
  cancelHref: string
  planId?: string
}

export function SchedulePlanDraftForm({
  mode,
  planFields,
  intervals,
  submitLabel,
  cancelHref,
  planId,
}: SchedulePlanDraftFormProps) {
  const [rows, setRows] = useState<EditorRow[]>(() =>
    intervals.length > 0
      ? intervals.map((row, i) => ({ ...row, _id: i }))
      : [
          {
            _id: 0,
            interval_start: "09:00",
            interval_end: "09:30",
            forecast_agents: 0,
            scheduled_agents: 0,
            note: "",
          },
        ]
  )
  const [nextId, setNextId] = useState(
    intervals.length > 0 ? intervals.length : 1
  )
  const [planFieldState, setPlanFieldState] = useState<PlanFields>(planFields)

  const validationSummary = validateSchedulePlanDraft(planFieldState, rows)

  const description =
    mode === "create"
      ? "维护计划信息和 0.5h 时段，保存前可在下方复核汇总。"
      : "编辑草稿信息和 0.5h 时段，保存前可在下方复核汇总。"

  function handleAddRow() {
    const last = rows[rows.length - 1]
    let newStart = ""
    let newEnd = ""

    if (last?.interval_end && /^\d{2}:\d{2}$/.test(last.interval_end)) {
      const [h, m] = last.interval_end.split(":").map(Number)
      const totalMinutes = h * 60 + m + 30
      if (totalMinutes <= 23 * 60 + 30) {
        const nh = Math.floor(totalMinutes / 60)
        const nm = totalMinutes % 60
        newStart = last.interval_end
        newEnd = `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`
      }
    }

    setRows((prev) => [
      ...prev,
      {
        _id: nextId,
        interval_start: newStart,
        interval_end: newEnd,
        forecast_agents: 0,
        scheduled_agents: 0,
        note: "",
      },
    ])
    setNextId((prev) => prev + 1)
  }

  function handleDeleteRow(id: number) {
    if (rows.length <= 1) return
    setRows((prev) => prev.filter((r) => r._id !== id))
  }

  function updateField<K extends keyof IntervalRow>(
    index: number,
    field: K,
    value: IntervalRow[K]
  ) {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    )
  }

  function handleNumberChange(
    index: number,
    field: "forecast_agents" | "scheduled_agents",
    raw: string
  ) {
    const parsed = Number(raw)
    const value = Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
    updateField(index, field, value)
  }

  function updatePlanField(field: keyof PlanFields, value: string) {
    setPlanFieldState((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      {mode === "edit" && planId && (
        <input type="hidden" name="plan_id" value={planId} />
      )}
      <input
        type="hidden"
        name="interval_count"
        value={`${rows.length}`}
      />

      <Card>
        <CardHeader>
          <CardTitle>计划信息</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">日期</span>
            <Input
              name="plan_date"
              type="date"
              value={planFieldState.plan_date}
              onChange={(e) => updatePlanField("plan_date", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">项目</span>
            <Input
              name="project_name"
              value={planFieldState.project_name}
              onChange={(e) => updatePlanField("project_name", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">职场</span>
            <Input
              name="site_name"
              value={planFieldState.site_name}
              onChange={(e) => updatePlanField("site_name", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">版本</span>
            <Input
              name="version"
              value={planFieldState.version}
              onChange={(e) => updatePlanField("version", e.target.value)}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>0.5h 时段</CardTitle>
          <CardDescription>
            维护每个时段的预测、已排和备注，缺口按预测减已排实时计算。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {rows.map((row, index) => {
            const gap = Math.max(row.forecast_agents - row.scheduled_agents, 0)
            return (
              <div
                key={row._id}
                className="grid gap-3 rounded-md border p-3 md:grid-cols-[6rem_6rem_5rem_5rem_4rem_1fr_auto]"
              >
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">开始</span>
                  <Input
                    name={`interval_start_${index}`}
                    value={row.interval_start}
                    onChange={(e) =>
                      updateField(index, "interval_start", e.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">结束</span>
                  <Input
                    name={`interval_end_${index}`}
                    value={row.interval_end}
                    onChange={(e) =>
                      updateField(index, "interval_end", e.target.value)
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">预测</span>
                  <Input
                    name={`forecast_agents_${index}`}
                    type="number"
                    min="0"
                    value={row.forecast_agents}
                    onChange={(e) =>
                      handleNumberChange(
                        index,
                        "forecast_agents",
                        e.target.value
                      )
                    }
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">已排</span>
                  <Input
                    name={`scheduled_agents_${index}`}
                    type="number"
                    min="0"
                    value={row.scheduled_agents}
                    onChange={(e) =>
                      handleNumberChange(
                        index,
                        "scheduled_agents",
                        e.target.value
                      )
                    }
                  />
                </label>
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-muted-foreground">缺口</span>
                  <div className="flex h-8 items-center px-2 text-sm tabular-nums">
                    {gap}
                  </div>
                </div>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">备注</span>
                  <Input
                    name={`note_${index}`}
                    value={row.note}
                    onChange={(e) =>
                      updateField(index, "note", e.target.value)
                    }
                  />
                </label>
                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={rows.length <= 1}
                    onClick={() => handleDeleteRow(row._id)}
                  >
                    删除
                  </Button>
                </div>
              </div>
            )
          })}
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddRow}
            >
              新增时段
            </Button>
          </div>
        </CardContent>
      </Card>

      <SchedulePlanDraftSummary
        intervals={rows.map((r) => ({
          forecast_agents: r.forecast_agents,
          scheduled_agents: r.scheduled_agents,
        }))}
      />

      <SchedulePlanDraftValidationPanel summary={validationSummary} />

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline">
          <Link href={cancelHref}>取消</Link>
        </Button>
        <Button type="submit" disabled={!validationSummary.canSubmit}>
          {submitLabel}
        </Button>
      </div>
    </>
  )
}
