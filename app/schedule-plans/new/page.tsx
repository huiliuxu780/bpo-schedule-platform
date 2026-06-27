import Link from "next/link"

import { createDraftAction } from "@/app/schedule-plans/new/actions"
import { AppShell } from "@/components/app-shell"
import {
  summarizeSchedulePlanDraftFeedback,
} from "@/lib/schedule-plans"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const defaultSlots = [
  ["09:00", "09:30", 16, 15, "早高峰缺口待补"],
  ["09:30", "10:00", 18, 17, "预测需求上升"],
  ["10:00", "10:30", 18, 18, "覆盖正常"],
  ["10:30", "11:00", 17, 16, "临时请假待复核"],
] as const

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
          <input
            type="hidden"
            name="interval_count"
            value={`${defaultSlots.length}`}
          />
          <Card>
            <CardHeader>
              <CardTitle>计划信息</CardTitle>
              <CardDescription>
                创建后由后端计算预测、已排、缺口和覆盖率
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">日期</span>
                <Input name="plan_date" type="date" defaultValue="2026-05-13" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">项目</span>
                <Input name="project_name" defaultValue="博西客服" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">职场</span>
                <Input name="site_name" defaultValue="上海职场" />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">版本</span>
                <Input name="version" defaultValue="v1" />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>0.5h 时段</CardTitle>
              <CardDescription>
                维护核心时段的预测、已排、缺口和备注。
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {defaultSlots.map((slot, index) => (
                <div
                  key={`${slot[0]}-${slot[1]}`}
                  className="grid gap-3 rounded-md border p-3 md:grid-cols-[7rem_7rem_1fr_1fr_2fr]"
                >
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">开始</span>
                    <Input
                      name={`interval_start_${index}`}
                      defaultValue={slot[0]}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">结束</span>
                    <Input name={`interval_end_${index}`} defaultValue={slot[1]} />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">预测</span>
                    <Input
                      name={`forecast_agents_${index}`}
                      type="number"
                      min="0"
                      defaultValue={`${slot[2]}`}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">已排</span>
                    <Input
                      name={`scheduled_agents_${index}`}
                      type="number"
                      min="0"
                      defaultValue={`${slot[3]}`}
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">备注</span>
                    <Input name={`note_${index}`} defaultValue={slot[4]} />
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href="/schedule-plans">取消</Link>
            </Button>
            <Button type="submit">创建草稿</Button>
          </div>
        </form>
      </main>
    </AppShell>
  )
}
