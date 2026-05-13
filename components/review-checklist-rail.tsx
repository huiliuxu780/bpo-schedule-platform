import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type ReviewChecklistMetric = {
  label: string
  value: string | number
}

type ReviewChecklistAction = {
  label: string
  href: string
}

type ReviewChecklistRailProps = {
  scopeLabel: string
  scopeFallbackLabel: string
  scopeDescription: string
  taskDescription: string
  currentStep: string
  nextStep: string
  summaryItems: ReviewChecklistMetric[]
  actions: ReviewChecklistAction[]
  backHref: string
  backLabel: string
}

export function ReviewChecklistRail({
  scopeLabel,
  scopeFallbackLabel,
  scopeDescription,
  taskDescription,
  currentStep,
  nextStep,
  summaryItems,
  actions,
  backHref,
  backLabel,
}: ReviewChecklistRailProps) {
  return (
    <aside className="grid gap-4 xl:sticky xl:top-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">当前复核范围</CardTitle>
          <CardDescription>{scopeDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm">
          <div className="rounded-lg border bg-background p-3">
            <p className="text-xs text-muted-foreground">范围摘要</p>
            <p className="mt-1">{scopeLabel || scopeFallbackLabel}</p>
          </div>
          <div className="grid gap-2">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-lg border bg-background px-3 py-2"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">复核任务</CardTitle>
          <CardDescription>{taskDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2 rounded-lg border bg-background p-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">当前步骤</p>
              <p className="mt-1">{currentStep}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">下一步</p>
              <p className="mt-1">{nextStep}</p>
            </div>
          </div>
          <div className="grid gap-2">
            {actions.map((action) => (
              <Button key={action.label} asChild variant="outline" size="sm">
                <Link href={action.href}>{action.label}</Link>
              </Button>
            ))}
            <Button asChild variant="ghost" size="sm">
              <Link href={backHref}>{backLabel}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}
