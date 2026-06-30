import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SchedulePlanDraftValidationSummary } from "@/lib/schedule-plans"

type SchedulePlanDraftValidationPanelProps = {
  summary: SchedulePlanDraftValidationSummary
}

export function SchedulePlanDraftValidationPanel({
  summary,
}: SchedulePlanDraftValidationPanelProps) {
  const { errorCount, warningCount, totalGap, canSubmit, issues } = summary

  const errors = issues.filter((issue) => issue.severity === "error")
  const warnings = issues.filter((issue) => issue.severity === "warning")

  return (
    <Card className="border-2">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">草稿校验</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm">
        <div className="flex gap-3">
          <Badge variant={canSubmit ? "default" : "destructive"}>
            {canSubmit ? "可保存" : "需要修正"}
          </Badge>
          <Badge variant="secondary">{errorCount} 错误</Badge>
          <Badge variant="secondary">{warningCount} 提醒</Badge>
          <Badge variant="outline">缺口 {totalGap}</Badge>
        </div>

        {errors.length > 0 && (
          <div className="grid gap-1">
            <div className="font-medium text-destructive">错误</div>
            <ul className="grid list-disc gap-0.5 pl-5">
              {errors.map((error, index) => (
                <li key={index} className="text-destructive">
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="grid gap-1">
            <div className="font-medium text-muted-foreground">提醒</div>
            <ul className="grid list-disc gap-0.5 pl-5">
              {warnings.map((warning, index) => (
                <li key={index} className="text-muted-foreground">
                  {warning.message}
                </li>
              ))}
            </ul>
          </div>
        )}

        {errors.length === 0 && warnings.length === 0 && (
          <div className="text-muted-foreground">草稿内容完整</div>
        )}
      </CardContent>
    </Card>
  )
}
