import Link from "next/link"
import { notFound } from "next/navigation"

import { updateDraftAction } from "./actions"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import {
  buildPlanDetailHref,
  buildSchedulePlansHref,
} from "@/lib/review-navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getSchedulePlan, schedulePlanStatusLabel } from "@/lib/schedule-plans"

type PageProps = {
  params: Promise<{
    planId: string
  }>
  searchParams: Promise<{
    from?: string
    query?: string
    status?: string
    date?: string
    project?: string
    site?: string
    intervalStart?: string
    intervalEnd?: string
    startTime?: string
    endTime?: string
  }>
}

export default async function EditSchedulePlanPage({
  params,
  searchParams,
}: PageProps) {
  const { planId } = await params
  const scopeParams = await searchParams
  const plan = await getSchedulePlan(planId)

  if (!plan) {
    notFound()
  }

  const isDraft = plan.summary.status === "draft"
  const detailHref = buildPlanDetailHref(plan.summary.id, {
    from: scopeParams.from,
    query: scopeParams.query,
    status: scopeParams.status,
    date: scopeParams.date ?? plan.summary.plan_date,
    project: scopeParams.project ?? plan.summary.project_name,
    site: scopeParams.site ?? plan.summary.site_name,
    intervalStart: scopeParams.intervalStart ?? scopeParams.startTime,
    intervalEnd: scopeParams.intervalEnd ?? scopeParams.endTime,
  })
  const listHref = buildSchedulePlansHref({
    query: scopeParams.query,
    status: scopeParams.status,
  })

  return (
    <AppShell title="编辑排班草稿" searchPlaceholder="搜索计划、项目或职场">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">编辑排班草稿</h1>
            <p className="text-sm text-muted-foreground">
              {plan.summary.site_name} / {plan.summary.plan_date} /{" "}
              {plan.summary.version}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={detailHref}>返回详情</Link>
          </Button>
        </div>

        {!isDraft ? (
          <Card>
            <CardHeader>
              <CardTitle>当前计划不可编辑</CardTitle>
              <CardDescription>
                当前状态为 {schedulePlanStatusLabel(plan.summary.status)}，F007
                仅允许编辑 draft 草稿。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href={scopeParams.from ? detailHref : listHref}>返回列表</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form action={updateDraftAction} className="flex flex-col gap-4">
            <input type="hidden" name="plan_id" value={plan.summary.id} />
            <input
              type="hidden"
              name="interval_count"
              value={`${plan.intervals.length}`}
            />
            <input type="hidden" name="from" value={scopeParams.from ?? ""} />
            <input type="hidden" name="query" value={scopeParams.query ?? ""} />
            <input type="hidden" name="status" value={scopeParams.status ?? ""} />
            <input
              type="hidden"
              name="date"
              value={scopeParams.date ?? plan.summary.plan_date}
            />
            <input
              type="hidden"
              name="project"
              value={scopeParams.project ?? plan.summary.project_name}
            />
            <input
              type="hidden"
              name="site"
              value={scopeParams.site ?? plan.summary.site_name}
            />
            <input
              type="hidden"
              name="intervalStart"
              value={scopeParams.intervalStart ?? scopeParams.startTime ?? ""}
            />
            <input
              type="hidden"
              name="intervalEnd"
              value={scopeParams.intervalEnd ?? scopeParams.endTime ?? ""}
            />
            <Card>
              <CardHeader>
                <CardTitle>计划信息</CardTitle>
                <CardDescription>
                  保存后由后端重新计算预测、已排、缺口和覆盖率
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-4">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">日期</span>
                  <Input
                    name="plan_date"
                    type="date"
                    defaultValue={plan.summary.plan_date}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">项目</span>
                  <Input
                    name="project_name"
                    defaultValue={plan.summary.project_name}
                  />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">职场</span>
                  <Input name="site_name" defaultValue={plan.summary.site_name} />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">版本</span>
                  <Input name="version" defaultValue={plan.summary.version} />
                </label>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>0.5h 时段</CardTitle>
                <CardDescription>
                  当前保存整份草稿明细，不做人员级排班
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {plan.intervals.map((item, index) => (
                  <div
                    key={`${item.interval_start}-${item.interval_end}`}
                    className="grid gap-3 rounded-md border p-3 md:grid-cols-[7rem_7rem_1fr_1fr_2fr]"
                  >
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">开始</span>
                      <Input
                        name={`interval_start_${index}`}
                        defaultValue={item.interval_start}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">结束</span>
                      <Input
                        name={`interval_end_${index}`}
                        defaultValue={item.interval_end}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">预测</span>
                      <Input
                        name={`forecast_agents_${index}`}
                        type="number"
                        min="0"
                        defaultValue={`${item.forecast_agents}`}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">已排</span>
                      <Input
                        name={`scheduled_agents_${index}`}
                        type="number"
                        min="0"
                        defaultValue={`${item.scheduled_agents}`}
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">备注</span>
                      <Input name={`note_${index}`} defaultValue={item.note} />
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button asChild variant="outline">
                <Link href={detailHref}>取消</Link>
              </Button>
              <Button type="submit">保存草稿</Button>
            </div>
          </form>
        )}
      </main>
    </AppShell>
  )
}
