import { redirect } from "next/navigation"
import { ClipboardList } from "lucide-react"

import {
  type ImportReviewCaseDetailResponse,
  buildImportReviewCaseDetailWorkspaceHref,
  buildImportReviewConclusionWriteApiUrl,
  buildImportReviewConclusionWritePayload,
  summarizeImportReviewCaseConclusionAction,
} from "@/components/import-center-model"
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

type ImportCenterReviewCaseConclusionPanelProps = {
  caseId: string
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
  embedded?: boolean
}

export function ImportCenterReviewCaseConclusionPanel({
  caseId,
  detail,
  error,
  embedded = false,
}: ImportCenterReviewCaseConclusionPanelProps) {
  const action = summarizeImportReviewCaseConclusionAction({ detail, error })

  async function submitConclusion(formData: FormData) {
    "use server"

    if (!detail) {
      redirect(buildImportReviewCaseDetailWorkspaceHref(caseId))
    }

    const conclusionType = String(formData.get("conclusion_type") ?? "").trim()
    const riskLevel = String(formData.get("risk_level") ?? "").trim()
    const conclusionText = String(formData.get("conclusion_text") ?? "").trim()
    const decidedBy = String(formData.get("decided_by") ?? "").trim()
    const payload = buildImportReviewConclusionWritePayload({
      detail,
      conclusionType: conclusionType || "confirmed_gap",
      riskLevel: riskLevel || detail.case.severity,
      conclusionText: conclusionText || "确认异常成立。",
      decidedBy: decidedBy || "ops-lead-01",
    })
    const response = await fetch(
      buildImportReviewConclusionWriteApiUrl(detail.case.case_id),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    )

    const suffix = response.ok ? "?conclusion=success" : "?conclusion=failed"
    redirect(`${buildImportReviewCaseDetailWorkspaceHref(caseId)}${suffix}`)
  }

  const header = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardList className="size-4 text-muted-foreground" />
          {action.title}
        </CardTitle>
        <CardDescription className="mt-1">{action.detail}</CardDescription>
      </div>
      <Badge variant={action.canSubmit ? "outline" : "secondary"}>
        {action.statusLabel}
      </Badge>
    </div>
  )
  const body = action.canSubmit ? (
    <form action={submitConclusion} className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,180px)_minmax(0,160px)_minmax(0,1fr)]">
        <Input
          aria-label="结论类型"
          name="conclusion_type"
          defaultValue="confirmed_gap"
          required
        />
        <Input
          aria-label="风险等级"
          name="risk_level"
          defaultValue={detail?.case.severity ?? "medium"}
          required
        />
        <Input
          aria-label="处理人"
          name="decided_by"
          defaultValue="ops-lead-01"
          required
        />
      </div>
      <Input
        aria-label="复核结论"
        name="conclusion_text"
        defaultValue="确认异常成立。"
        required
      />
      <div className="flex justify-end">
        <Button type="submit" size="sm">
          {action.actionLabel}
        </Button>
      </div>
    </form>
  ) : (
    <div className="grid gap-2">
      {action.blockers.map((blocker) => (
        <div
          key={blocker}
          className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground"
        >
          {blocker}
        </div>
      ))}
    </div>
  )

  if (embedded) {
    return (
      <section className="grid gap-4 rounded-md border bg-background p-4">
        {header}
        {body}
      </section>
    )
  }

  return (
    <Card>
      <CardHeader>{header}</CardHeader>
      <CardContent>{body}</CardContent>
    </Card>
  )
}
