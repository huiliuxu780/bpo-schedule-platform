"use client"

import Link from "next/link"
import * as React from "react"

import {
  type BaseConfigTabFeedback,
  BaseConfigTabFeedbackCard,
} from "@/components/base-config/tab-feedback-card"
import {
  buildShiftSegmentBars,
  formatShiftDuration,
  getShiftActivityLabel,
  type ShiftActivityType,
  shiftActivityOptions,
  type ShiftDefinitionApiRecord,
  type ShiftVersionGroup,
} from "@/components/base-config/shift-activity-model"
import { BackendErrorAlert } from "@/components/backend-error-alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// 活动分段在时间条上的配色：工作用主色，其余活动用可区分的强调色。
const segmentBarClass: Record<ShiftActivityType, string> = {
  work: "bg-primary",
  meal: "bg-amber-500",
  rest: "bg-sky-500",
  training: "bg-violet-500",
}

const timelineTicks = [
  { leftPercent: 0, label: "00:00" },
  { leftPercent: 25, label: "06:00" },
  { leftPercent: 50, label: "12:00" },
  { leftPercent: 75, label: "18:00" },
  { leftPercent: 100, label: "24:00" },
]

export function ShiftActivityWorkbench({
  groups,
  error,
  feedback,
  editingShiftCode,
  submitAction,
}: {
  groups: ShiftVersionGroup[]
  error: string | null
  feedback: BaseConfigTabFeedback | null
  editingShiftCode: string
  submitAction: (formData: FormData) => Promise<void>
}) {
  const editingGroup =
    groups.find((group) => group.shift_code === editingShiftCode) ?? null

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:grid-cols-[minmax(360px,420px)_1fr] lg:p-4">
      <div className="grid auto-rows-max gap-3">
        {feedback ? <BaseConfigTabFeedbackCard feedback={feedback} /> : null}

        {/* key 按编辑目标变化强制重挂：同路由导航（修订切换/取消/action 回跳）
            时清空非受控字段与惰性 state，避免旧表单值滞留导致误提交。 */}
        <ShiftDefinitionForm
          key={editingGroup?.latest.shift_definition_id ?? "new"}
          submitAction={submitAction}
          editingRecord={editingGroup?.latest ?? null}
        />
      </div>

      <div className="grid auto-rows-max gap-3">
        {error ? (
          <BackendErrorAlert
            title="班次定义读取失败"
            description="后端服务不可用或请求失败，请检查后端服务状态后重试。"
            error={error}
          />
        ) : null}

        {groups.length === 0 && !error ? (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              暂无班次定义，请在左侧表单新建第一个班次。
            </CardContent>
          </Card>
        ) : null}

        {groups.map((group) => (
          <ShiftVersionGroupCard key={group.shift_code} group={group} />
        ))}
      </div>
    </main>
  )
}

function ShiftDefinitionForm({
  submitAction,
  editingRecord,
}: {
  submitAction: (formData: FormData) => Promise<void>
  editingRecord: ShiftDefinitionApiRecord | null
}) {
  const isEditing = editingRecord !== null
  // 仅跟踪分段行集合（增删行），输入值提交时从 FormData 读取。
  const [segmentRows, setSegmentRows] = React.useState<number[]>(() =>
    editingRecord && editingRecord.segments.length > 0
      ? editingRecord.segments.map((_, index) => index)
      : [0]
  )
  const nextRowIdRef = React.useRef(
    editingRecord ? editingRecord.segments.length : 1
  )

  const addSegmentRow = () => {
    setSegmentRows((rows) => [...rows, nextRowIdRef.current])
    nextRowIdRef.current += 1
  }

  const removeSegmentRow = (rowId: number) => {
    setSegmentRows((rows) =>
      rows.length > 1 ? rows.filter((item) => item !== rowId) : rows
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? "修订班次" : "新建班次"}</CardTitle>
        <CardDescription>
          {isEditing
            ? `正在修订 ${editingRecord.shift_code}：保存将追加新版本，历史版本保留可追溯。`
            : "保存后立即生成 V1 版本；后续修订只会追加新版本，不覆写历史。"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={submitAction} className="grid gap-4">
          {isEditing ? (
            <input
              type="hidden"
              name="edit_shift_code"
              value={editingRecord.shift_code}
            />
          ) : null}

          <div className="grid gap-2">
            <Label htmlFor="shift-code">班次代码</Label>
            <Input
              id="shift-code"
              name="shift_code"
              defaultValue={editingRecord?.shift_code ?? ""}
              readOnly={isEditing}
              required
              placeholder="如 MORNING-A"
              className={isEditing ? "bg-muted" : undefined}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shift-name">班次名称</Label>
            <Input
              id="shift-name"
              name="shift_name"
              defaultValue={editingRecord?.shift_name ?? ""}
              required
              placeholder="如 早班"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="effective-from">生效开始</Label>
              <Input
                id="effective-from"
                name="effective_from"
                type="date"
                defaultValue={editingRecord?.effective_from ?? ""}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="effective-to">生效结束</Label>
              <Input
                id="effective-to"
                name="effective_to"
                type="date"
                defaultValue={editingRecord?.effective_to ?? ""}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="is-cross-day"
              name="is_cross_day"
              type="checkbox"
              defaultChecked={editingRecord?.is_cross_day ?? false}
              className="size-4 accent-primary"
            />
            <Label htmlFor="is-cross-day" className="font-normal">
              跨日班次（结束时间可早于开始时间，夜班归属开始日期）
            </Label>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">活动分段</span>
              <span className="text-xs text-muted-foreground">
                时间按 15 分钟粒度，总时长不超过 24 小时
              </span>
            </div>

            {segmentRows.map((rowId, position) => {
              const draft = editingRecord?.segments[rowId]

              return (
                <div
                  key={rowId}
                  className="grid grid-cols-[minmax(96px,1fr)_repeat(2,minmax(96px,1fr))_auto] items-end gap-2"
                >
                  <div className="grid gap-1">
                    {position === 0 ? (
                      <span className="text-xs text-muted-foreground">活动类型</span>
                    ) : null}
                    <select
                      name="segment_activity_type"
                      aria-label={`分段${position + 1}活动类型`}
                      defaultValue={draft?.activity_type ?? "work"}
                      className="h-9 w-full rounded-md border border-input bg-transparent px-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {shiftActivityOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-1">
                    {position === 0 ? (
                      <span className="text-xs text-muted-foreground">开始</span>
                    ) : null}
                    <Input
                      type="time"
                      name="segment_start_time"
                      step={900}
                      aria-label={`分段${position + 1}开始时间`}
                      defaultValue={draft?.start_time ?? ""}
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    {position === 0 ? (
                      <span className="text-xs text-muted-foreground">结束</span>
                    ) : null}
                    <Input
                      type="time"
                      name="segment_end_time"
                      step={900}
                      aria-label={`分段${position + 1}结束时间`}
                      defaultValue={draft?.end_time ?? ""}
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={segmentRows.length === 1}
                    aria-label={`移除分段${position + 1}`}
                    onClick={() => removeSegmentRow(rowId)}
                  >
                    移除
                  </Button>
                </div>
              )
            })}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="justify-self-start"
              onClick={addSegmentRow}
            >
              添加活动分段
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button type="submit">保存班次定义</Button>
            {isEditing ? (
              <Button variant="ghost" asChild>
                <Link href="/base-config?tab=shifts">取消修订</Link>
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ShiftVersionGroupCard({ group }: { group: ShiftVersionGroup }) {
  const latest = group.latest
  const bars = buildShiftSegmentBars(latest.segments, latest.is_cross_day)
  const archivedVersions = group.versions.filter(
    (version) => version.shift_definition_id !== latest.shift_definition_id
  )
  const [historyExpanded, setHistoryExpanded] = React.useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="font-mono text-base">{group.shift_code}</CardTitle>
          <Badge>V{latest.version_number}</Badge>
          <Badge variant={latest.status === "active" ? "default" : "secondary"}>
            {latest.status === "active" ? "生效中" : "已归档"}
          </Badge>
          {latest.is_cross_day ? <Badge variant="outline">跨日</Badge> : null}
          <div className="ms-auto">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/base-config?tab=shifts&shift_edit=${encodeURIComponent(group.shift_code)}`}
              >
                修订（生成新版本）
              </Link>
            </Button>
          </div>
        </div>
        <CardDescription>
          {latest.shift_name} · 生效 {latest.effective_from} 至 {latest.effective_to}
          {" · "}总时长 {formatShiftDuration(group.latestTotalMinutes)}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        <ShiftSegmentTimeline bars={bars} />

        <ShiftSegmentChips segments={latest.segments} />

        {archivedVersions.length > 0 ? (
          <div className="grid gap-2 rounded-md border border-dashed p-2 text-xs text-muted-foreground">
            <button
              type="button"
              aria-expanded={historyExpanded}
              className="flex items-center justify-between font-medium text-foreground"
              onClick={() => setHistoryExpanded((value) => !value)}
            >
              <span>历史版本（{archivedVersions.length} 个，已归档保留）</span>
              <span>{historyExpanded ? "收起明细" : "展开分段明细"}</span>
            </button>
            {archivedVersions.map((version) => (
              <div
                key={version.shift_definition_id}
                className="grid gap-1.5 border-t pt-2"
              >
                <span className="font-mono tabular-nums">
                  V{version.version_number} {version.shift_name} ·{" "}
                  {version.effective_from} 至 {version.effective_to} ·{" "}
                  {version.segments.length} 个分段 · 创建于 {version.created_at}
                </span>
                {historyExpanded ? (
                  <>
                    <ShiftSegmentTimeline
                      bars={buildShiftSegmentBars(
                        version.segments,
                        version.is_cross_day
                      )}
                    />
                    <ShiftSegmentChips segments={version.segments} />
                  </>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

function ShiftSegmentChips({
  segments,
}: {
  segments: ShiftDefinitionApiRecord["segments"]
}) {
  return (
    <ul className="flex flex-wrap gap-2">
      {segments.map((segment, index) => (
        <li
          key={`${segment.activity_type}-${segment.start_time}-${index}`}
          className="flex items-center gap-1.5 rounded-md border bg-background px-2 py-1 font-mono text-xs"
        >
          <span
            className={`inline-block size-2 rounded-full ${segmentBarClass[(segment.activity_type as ShiftActivityType) in segmentBarClass ? (segment.activity_type as ShiftActivityType) : "work"]}`}
          />
          {getShiftActivityLabel(segment.activity_type)}
          {"  "}
          {segment.start_time}-{segment.end_time}
        </li>
      ))}
    </ul>
  )
}

// 24 小时时间条：分段按分钟投影到轨道，跨日回绕拆成当日/次日两段。
function ShiftSegmentTimeline({
  bars,
}: {
  bars: ReturnType<typeof buildShiftSegmentBars>
}) {
  return (
    <div className="grid gap-1">
      <div className="relative h-6 overflow-hidden rounded-md border bg-muted">
        {timelineTicks.slice(1, -1).map((tick) => (
          <span
            key={tick.label}
            className="absolute inset-y-0 w-px bg-border"
            style={{ left: `${tick.leftPercent}%` }}
          />
        ))}
        {bars.map((bar) => (
          <span
            key={bar.key}
            title={bar.label}
            className={`absolute inset-y-0.5 rounded-sm ${segmentBarClass[bar.activity_type]} ${bar.wrapped ? "opacity-70" : ""}`}
            style={{
              left: `${bar.leftPercent}%`,
              width: `${Math.max(bar.widthPercent, 0.75)}%`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        {timelineTicks.map((tick) => (
          <span key={tick.label}>{tick.label}</span>
        ))}
      </div>
    </div>
  )
}
