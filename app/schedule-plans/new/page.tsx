import Link from "next/link"

import { createDraftAction } from "@/app/schedule-plans/new/actions"
import { AppShell } from "@/components/app-shell"
import { SchedulePlanDraftForm } from "@/components/schedule-plan-draft-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  summarizeSchedulePlanDraftFeedback,
} from "@/lib/schedule-plans"

const defaultSlots = [
  ["09:00", "09:30", 16, 15, "早高峰缺口待补"],
  ["09:30", "10:00", 18, 17, "预测需求上升"],
  ["10:00", "10:30", 18, 18, "覆盖正常"],
  ["10:30", "11:00", 17, 16, "临时请假待复核"],
] as const

const defaultIntervals = defaultSlots.map(([start, end, forecast, scheduled, note]) => ({
  interval_start: start,
  interval_end: end,
  forecast_agents: forecast,
  scheduled_agents: scheduled,
  note,
}))

type PageProps = {
  searchParams?: Promise<{
    draft?: string
  }>
}

export default async function NewSchedulePlanPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const draftFeedback = summarizeSchedulePlanDraftFeedback(resolvedSearchParams.draft)

  return (
    <AppShell
      title="新建排班草稿"
      breadcrumbItems={[
        { label: "排班计划", href: "/schedule-plans" },
        { label: "新建排班草稿" },
      ]}
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        {draftFeedback ? (
          <Card
            className={
              draftFeedback.tone === "error"
                ? "border-destructive/50"
                : undefined
            }
          >
            <CardHeader>
              <CardTitle className="text-base">{draftFeedback.title}</CardTitle>
              <CardDescription>{draftFeedback.description}</CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">
              创建排班草稿，维护计划信息和 0.5h 时段。
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/schedule-plans">返回列表</Link>
          </Button>
        </div>

        <form action={createDraftAction} className="flex flex-col gap-4">
          <SchedulePlanDraftForm
            mode="create"
            planFields={{
              plan_date: "2026-05-13",
              project_name: "博西客服",
              site_name: "上海职场",
              version: "v1",
            }}
            intervals={defaultIntervals}
            submitLabel="创建草稿"
            cancelHref="/schedule-plans"
          />
        </form>
      </main>
    </AppShell>
  )
}
