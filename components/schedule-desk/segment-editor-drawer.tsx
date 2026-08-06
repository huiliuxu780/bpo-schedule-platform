"use client"

// 活动分段编辑抽屉：对单个矩阵单元格做分段 CRUD
//（班次码/活动类型/起止时间/跨日/技能/分配比例），用 ui/sheet。

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import {
  type ScheduleDeskApiSegment,
  activityTypeLabel,
  parseTimeToMinutes,
} from "@/components/schedule-desk/schedule-matrix-model"
import { setCellSegments } from "@/components/schedule-desk/use-matrix-store"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"

const ACTIVITY_TYPE_OPTIONS = [
  { value: "work", label: "出勤" },
  { value: "rest", label: "休息" },
  { value: "meal", label: "用餐" },
  { value: "training", label: "培训" },
]

const TIME_OPTIONS: string[] = []

for (let minutes = 0; minutes < 24 * 60; minutes += 15) {
  TIME_OPTIONS.push(
    `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`
  )
}

export type SegmentEditorDrawerProps = {
  open: boolean
  employeeId: string
  scheduleDate: string
  initialSegments: ScheduleDeskApiSegment[]
  shiftCodeOptions: string[]
  skillOptions: string[]
  onClose: () => void
  // 批量模板模式：确认后把分段应用到选中行，而非写入单个单元格。
  onConfirm?: (segments: ScheduleDeskApiSegment[]) => void
}

type DraftSegment = {
  draftKey: string
  shiftCode: string
  activityType: string
  startTime: string
  endTime: string
  crossesDay: boolean
  skillId: string
  allocationRatio: string
}

let draftSequence = 0

function toDraft(segment: ScheduleDeskApiSegment): DraftSegment {
  draftSequence += 1

  return {
    draftKey: `draft-${draftSequence}`,
    shiftCode: segment.shift_code ?? "",
    activityType: segment.activity_type,
    startTime: segment.start_time,
    endTime: segment.end_time,
    crossesDay: segment.crosses_day,
    skillId: segment.skill_id ?? "",
    allocationRatio: String(segment.allocation_ratio),
  }
}

function emptyDraft(): DraftSegment {
  draftSequence += 1

  return {
    draftKey: `draft-${draftSequence}`,
    shiftCode: "",
    activityType: "work",
    startTime: "09:00",
    endTime: "18:00",
    crossesDay: false,
    skillId: "",
    allocationRatio: "1",
  }
}

function isCrossing(draft: DraftSegment): boolean {
  try {
    return draft.crossesDay || parseTimeToMinutes(draft.endTime) <= parseTimeToMinutes(draft.startTime)
  } catch {
    return draft.crossesDay
  }
}

function validateDrafts(drafts: DraftSegment[]): string | null {
  if (drafts.length === 0) {
    return null
  }

  for (const [index, draft] of drafts.entries()) {
    const position = `第 ${index + 1} 个分段`
    const startOk = TIME_OPTIONS.includes(draft.startTime)
    const endOk = TIME_OPTIONS.includes(draft.endTime)

    if (!startOk || !endOk) {
      return `${position}：起止时间必须是 15 分钟整点（HH:MM）`
    }

    // 起止相同不允许：否则会被静默解释为 24h 跨日段，语义歧义必须显式报错。
    if (draft.startTime === draft.endTime) {
      return `${position}：起止时间不能相同`
    }

    const ratio = Number(draft.allocationRatio)

    if (!Number.isFinite(ratio) || ratio < 0 || ratio > 1) {
      return `${position}：分配比例必须在 0 到 1 之间`
    }

    const start = parseTimeToMinutes(draft.startTime)
    const end = parseTimeToMinutes(draft.endTime)
    const duration = end > start ? end - start : end + 24 * 60 - start

    if (duration === 24 * 60 && !draft.crossesDay && end !== start) {
      return `${position}：分段时长不能恰好为 24 小时`
    }
  }

  return null
}

export function SegmentEditorDrawer({
  open,
  employeeId,
  scheduleDate,
  initialSegments,
  shiftCodeOptions,
  skillOptions,
  onClose,
  onConfirm,
}: SegmentEditorDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>编辑活动分段</SheetTitle>
          <SheetDescription>
            {employeeId} · {scheduleDate} · 点击下方按钮增删分段
          </SheetDescription>
        </SheetHeader>
        {open ? (
          <SegmentDraftForm
            key={`${employeeId}|${scheduleDate}`}
            employeeId={employeeId}
            scheduleDate={scheduleDate}
            initialSegments={initialSegments}
            shiftCodeOptions={shiftCodeOptions}
            skillOptions={skillOptions}
            onClose={onClose}
            onConfirm={onConfirm}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

type SegmentDraftFormProps = Omit<SegmentEditorDrawerProps, "open">

function SegmentDraftForm({
  employeeId,
  scheduleDate,
  initialSegments,
  shiftCodeOptions,
  skillOptions,
  onClose,
  onConfirm,
}: SegmentDraftFormProps) {
  // 草稿初始值来自打开时的单元格分段；抽屉每次打开都按 key 重新挂载。
  const [drafts, setDrafts] = React.useState<DraftSegment[]>(() =>
    initialSegments.map(toDraft)
  )

  const validationError = validateDrafts(drafts)

  function updateDraft(draftKey: string, patch: Partial<DraftSegment>) {
    setDrafts((current) =>
      current.map((draft) => (draft.draftKey === draftKey ? { ...draft, ...patch } : draft))
    )
  }

  function removeDraft(draftKey: string) {
    setDrafts((current) => current.filter((draft) => draft.draftKey !== draftKey))
  }

  function handleConfirm() {
    if (validationError) {
      toast.error(validationError)

      return
    }

    const segments: ScheduleDeskApiSegment[] = drafts.map((draft) => ({
      shift_code: draft.shiftCode.trim() === "" ? null : draft.shiftCode.trim(),
      activity_type: draft.activityType,
      start_time: draft.startTime,
      end_time: draft.endTime,
      crosses_day: isCrossing(draft),
      skill_id: draft.skillId.trim() === "" ? null : draft.skillId.trim(),
      allocation_ratio: Number(draft.allocationRatio),
      skill_coefficient: null,
      activity_coverage: 1,
    }))

    if (onConfirm) {
      onConfirm(segments)
    } else {
      setCellSegments(employeeId, scheduleDate, segments)
    }

    onClose()
  }

  return (
    <div className="mt-4 flex flex-col gap-4">
          {drafts.map((draft, index) => (
            <div key={draft.draftKey} className="rounded-md border p-3">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium">分段 {index + 1}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeDraft(draft.draftKey)}
                >
                  <Trash2 />
                  删除
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${draft.draftKey}-shift`}>班次码（可选）</Label>
                  <Input
                    id={`${draft.draftKey}-shift`}
                    list="schedule-desk-shift-codes"
                    value={draft.shiftCode}
                    placeholder="如 D09"
                    onChange={(event) => updateDraft(draft.draftKey, { shiftCode: event.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>活动类型</Label>
                  <Select
                    value={draft.activityType}
                    onValueChange={(value) => updateDraft(draft.draftKey, { activityType: value })}
                  >
                    <SelectTrigger aria-label="活动类型">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACTIVITY_TYPE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>开始时间</Label>
                  <Select
                    value={draft.startTime}
                    onValueChange={(value) => updateDraft(draft.draftKey, { startTime: value })}
                  >
                    <SelectTrigger aria-label="开始时间">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label>结束时间</Label>
                  <Select
                    value={draft.endTime}
                    onValueChange={(value) => updateDraft(draft.draftKey, { endTime: value })}
                  >
                    <SelectTrigger aria-label="结束时间">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${draft.draftKey}-skill`}>技能（可选）</Label>
                  <Input
                    id={`${draft.draftKey}-skill`}
                    list="schedule-desk-skill-ids"
                    value={draft.skillId}
                    placeholder="如 L1-CN"
                    onChange={(event) => updateDraft(draft.draftKey, { skillId: event.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor={`${draft.draftKey}-ratio`}>技能分配比例（0~1）</Label>
                  <Input
                    id={`${draft.draftKey}-ratio`}
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={draft.allocationRatio}
                    onChange={(event) =>
                      updateDraft(draft.draftKey, { allocationRatio: event.target.value })
                    }
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <Checkbox
                    id={`${draft.draftKey}-crosses`}
                    checked={isCrossing(draft)}
                    onCheckedChange={(checked) =>
                      updateDraft(draft.draftKey, { crossesDay: checked === true })
                    }
                  />
                  <Label htmlFor={`${draft.draftKey}-crosses`} className="font-normal">
                    跨日（夜班尾部计入次日）
                  </Label>
                  {isCrossing(draft) ? (
                    <span className="text-xs text-muted-foreground">
                      {activityTypeLabel(draft.activityType)}分段将按跨日口径计入覆盖
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
          <datalist id="schedule-desk-shift-codes">
            {shiftCodeOptions.map((code) => (
              <option key={code} value={code} />
            ))}
          </datalist>
          <datalist id="schedule-desk-skill-ids">
            {skillOptions.map((skill) => (
              <option key={skill} value={skill} />
            ))}
          </datalist>
          <Button type="button" variant="outline" onClick={() => setDrafts((current) => [...current, emptyDraft()])}>
            <Plus />
            新增分段
          </Button>
          {drafts.length > 0 && validationError ? (
            <p className="text-sm text-destructive">{validationError}</p>
          ) : null}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button type="button" variant="ghost" onClick={onClose}>
              取消
            </Button>
            <Button type="button" onClick={handleConfirm} disabled={validationError !== null}>
              保存分段
            </Button>
          </div>
    </div>
  )
}
