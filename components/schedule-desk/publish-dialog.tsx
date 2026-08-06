"use client"

// 发布确认弹窗：摘要周期/日期范围/版本号，发布前先刷出未保存改动，
// 调 POST /schedule-periods/{id}/publish，成功后刷新服务端状态区。

import * as React from "react"
import { useRouter } from "next/navigation"
import { Loader2, Rocket } from "lucide-react"
import { toast } from "sonner"

import { schedulePeriodStatusLabel } from "@/components/schedule-desk/schedule-matrix-model"
import { postSchedulePublish } from "@/components/schedule-desk/schedule-matrix-api"
import { flushNow, useMatrixStatus } from "@/components/schedule-desk/use-matrix-store"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type PublishDialogProps = {
  open: boolean
  periodId: string
  month: string
  status: "draft" | "published"
  dateFrom: string
  dateTo: string
  onClose: () => void
}

export function ScheduleDeskPublishDialog({
  open,
  periodId,
  month,
  status,
  dateFrom,
  dateTo,
  onClose,
}: PublishDialogProps) {
  const router = useRouter()
  const matrixStatus = useMatrixStatus()
  const [note, setNote] = React.useState("")
  const [publishing, setPublishing] = React.useState(false)

  async function handlePublish() {
    setPublishing(true)

    // 发布前先把未保存改动刷到服务端，保证发布快照完整。
    // saving=true（有在途请求）时 flushNow 会等待在途完成并补发剩余脏改动，
    // 不会在「flushNow 返回 empty 但仍有在途请求」时直接放行发布。
    if (matrixStatus.dirtyCount > 0 || matrixStatus.saving) {
      const flushResult = await flushNow()

      if (flushResult.kind === "failed") {
        setPublishing(false)
        toast.error("存在未保存改动且保存失败，请先处理后再发布")

        return
      }
    }

    const outcome = await postSchedulePublish(periodId, {
      date_from: dateFrom,
      date_to: dateTo,
      note: note.trim() === "" ? undefined : note.trim(),
    })

    setPublishing(false)

    if (outcome.error || !outcome.data) {
      toast.error("发布失败", { description: outcome.error ?? "未知错误" })

      return
    }

    toast.success("排班已发布", {
      description: `版本 ${outcome.data.version_id} · 发布于 ${new Date(
        outcome.data.published_at
      ).toLocaleString("zh-CN")}`,
    })
    setNote("")
    onClose()
    // 刷新服务端数据：周期状态变为已发布，状态区与只读态随之更新。
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && !publishing && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发布排班</DialogTitle>
          <DialogDescription>
            发布后生成排班版本快照，周期状态变为「已发布」，编辑控件将转为只读。
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 text-sm">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-md border p-3">
            <dt className="text-muted-foreground">周期</dt>
            <dd className="font-mono text-xs leading-5">{periodId}</dd>
            <dt className="text-muted-foreground">月份</dt>
            <dd>{month}</dd>
            <dt className="text-muted-foreground">当前状态</dt>
            <dd>{schedulePeriodStatusLabel(status)}</dd>
            <dt className="text-muted-foreground">发布日期范围</dt>
            <dd className="tabular-nums">
              {dateFrom} 至 {dateTo}
            </dd>
            <dt className="text-muted-foreground">矩阵版本</dt>
            <dd className="tabular-nums">v{matrixStatus.baseVersion}</dd>
            {matrixStatus.dirtyCount > 0 ? (
              <>
                <dt className="text-muted-foreground">未保存改动</dt>
                <dd className="text-amber-600">
                  {matrixStatus.dirtyCount} 处（发布时将自动保存）
                </dd>
              </>
            ) : null}
          </dl>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="schedule-publish-note">发布备注（可选）</Label>
            <Input
              id="schedule-publish-note"
              value={note}
              maxLength={200}
              placeholder="如：W2 夜班调整"
              onChange={(event) => setNote(event.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onClose} disabled={publishing}>
            取消
          </Button>
          <Button type="button" onClick={() => void handlePublish()} disabled={publishing}>
            {publishing ? <Loader2 className="animate-spin" /> : <Rocket />}
            {publishing ? "发布中…" : "确认发布"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
