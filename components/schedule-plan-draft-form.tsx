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

type SchedulePlanDraftFormProps = {
  mode: DraftMode
  action: (formData: FormData) => Promise<void>
  planFields: PlanFields
  intervals: IntervalRow[]
  submitLabel: string
  cancelHref: string
  planId?: string
}

export function SchedulePlanDraftForm({
  mode,
  action,
  planFields,
  intervals,
  submitLabel,
  cancelHref,
  planId,
}: SchedulePlanDraftFormProps) {
  const description =
    mode === "create"
      ? "创建后由后端计算预测、已排、缺口和覆盖率"
      : "保存后由后端重新计算预测、已排、缺口和覆盖率"

  return (
    <form action={action} className="flex flex-col gap-4">
      {mode === "edit" && planId && (
        <input type="hidden" name="plan_id" value={planId} />
      )}
      <input
        type="hidden"
        name="interval_count"
        value={`${intervals.length}`}
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
              defaultValue={planFields.plan_date}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">项目</span>
            <Input
              name="project_name"
              defaultValue={planFields.project_name}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">职场</span>
            <Input name="site_name" defaultValue={planFields.site_name} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">版本</span>
            <Input name="version" defaultValue={planFields.version} />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>0.5h 时段</CardTitle>
          <CardDescription>
            {mode === "create"
              ? "维护核心时段的预测、已排、缺口和备注"
              : "保存草稿明细中的预测、已排、缺口和备注"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {intervals.map((interval, index) => (
            <div
              key={`${interval.interval_start}-${interval.interval_end}`}
              className="grid gap-3 rounded-md border p-3 md:grid-cols-[7rem_7rem_1fr_1fr_2fr]"
            >
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">开始</span>
                <Input
                  name={`interval_start_${index}`}
                  defaultValue={interval.interval_start}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">结束</span>
                <Input
                  name={`interval_end_${index}`}
                  defaultValue={interval.interval_end}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">预测</span>
                <Input
                  name={`forecast_agents_${index}`}
                  type="number"
                  min="0"
                  defaultValue={`${interval.forecast_agents}`}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">已排</span>
                <Input
                  name={`scheduled_agents_${index}`}
                  type="number"
                  min="0"
                  defaultValue={`${interval.scheduled_agents}`}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">备注</span>
                <Input name={`note_${index}`} defaultValue={interval.note} />
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline">
          <Link href={cancelHref}>取消</Link>
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  )
}
