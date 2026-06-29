import Link from "next/link"
import { notFound } from "next/navigation"

import { updateDraftAction } from "./actions"
import { AppShell } from "@/components/app-shell"
import { ReadinessBanner } from "@/components/readiness-banner"
import { SchedulePlanDraftForm } from "@/components/schedule-plan-draft-form"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  getSchedulePlanResult,
  schedulePlanStatusLabel,
  summarizeSchedulePlanDraftFeedback,
} from "@/lib/schedule-plans"

type PageProps = {
  params: Promise<{
    planId: string
  }>
  searchParams?: Promise<{
    draft?: string
  }>
}

export default async function EditSchedulePlanPage({ params, searchParams }: PageProps) {
  const { planId } = await params
  const resolvedSearchParams = searchParams ? await searchParams : {}
  const result = await getSchedulePlanResult(planId)
  const plan = result.item

  if (!plan) {
    notFound()
  }

  const isDraft = plan.summary.status === "draft"
  const draftFeedback = summarizeSchedulePlanDraftFeedback(resolvedSearchParams.draft)

  return (
    <AppShell
      title="编辑排班草稿"
      breadcrumbItems={[
        { label: "排班计划", href: "/schedule-plans" },
        { label: "排班计划详情", href: `/schedule-plans/${encodeURIComponent(plan.summary.id)}` },
        { label: "编辑排班草稿" },
      ]}
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <ReadinessBanner
          message={result.message}
          hasData={result.item !== null}
          overallSource={result.source === "missing" ? "api_empty" : result.source}
        />

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
              {plan.summary.site_name} / {plan.summary.plan_date} /{" "}
              {plan.summary.version}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/schedule-plans/${encodeURIComponent(plan.summary.id)}`}>返回详情</Link>
          </Button>
        </div>

        {!isDraft ? (
          <Card>
            <CardHeader>
              <CardTitle>当前计划不可编辑</CardTitle>
              <CardDescription>
                当前状态为 {schedulePlanStatusLabel(plan.summary.status)}，仅草稿计划可编辑。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link href="/schedule-plans">返回列表</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <form action={updateDraftAction} className="flex flex-col gap-4">
              <SchedulePlanDraftForm
                mode="edit"
                planFields={{
                  plan_date: plan.summary.plan_date,
                  project_name: plan.summary.project_name,
                  site_name: plan.summary.site_name,
                  version: plan.summary.version,
                }}
                intervals={plan.intervals}
                submitLabel="保存草稿"
                cancelHref={`/schedule-plans/${encodeURIComponent(plan.summary.id)}`}
                planId={plan.summary.id}
              />
            </form>
          </>
        )}
      </main>
    </AppShell>
  )
}
