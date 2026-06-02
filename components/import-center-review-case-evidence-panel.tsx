import { redirect } from "next/navigation"
import { FileText } from "lucide-react"

import {
  type ImportReviewCaseDetailResponse,
  buildImportReviewCaseDetailWorkspaceHref,
  buildImportReviewEvidenceWriteApiUrl,
  buildImportReviewEvidenceWritePayload,
  summarizeImportReviewCaseEvidenceAction,
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

type ImportCenterReviewCaseEvidencePanelProps = {
  caseId: string
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}

export function ImportCenterReviewCaseEvidencePanel({
  caseId,
  detail,
  error,
}: ImportCenterReviewCaseEvidencePanelProps) {
  const action = summarizeImportReviewCaseEvidenceAction({ detail, error })

  async function submitEvidence(formData: FormData) {
    "use server"

    if (!detail) {
      redirect(buildImportReviewCaseDetailWorkspaceHref(caseId))
    }

    const evidenceType = String(formData.get("evidence_type") ?? "").trim()
    const evidenceUri = String(formData.get("evidence_uri") ?? "").trim()
    const submittedBy = String(formData.get("submitted_by") ?? "").trim()
    const note = String(formData.get("note") ?? "").trim()
    const payload = buildImportReviewEvidenceWritePayload({
      detail,
      evidenceType: evidenceType || "note",
      evidenceUri:
        evidenceUri || `local://review/${detail.case.case_id}/evidence-${detail.evidence.length + 1}`,
      submittedBy: submittedBy || detail.case.owner_id,
      note,
    })
    const response = await fetch(
      buildImportReviewEvidenceWriteApiUrl(detail.case.case_id),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      }
    )

    const suffix = response.ok ? "?evidence=success" : "?evidence=failed"
    redirect(`${buildImportReviewCaseDetailWorkspaceHref(caseId)}${suffix}`)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="size-4 text-muted-foreground" />
              {action.title}
            </CardTitle>
            <CardDescription className="mt-1">{action.detail}</CardDescription>
          </div>
          <Badge variant={action.canSubmit ? "outline" : "secondary"}>
            {action.statusLabel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {action.canSubmit ? (
          <form action={submitEvidence} className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-[minmax(0,180px)_minmax(0,1fr)]">
              <Input
                aria-label="证据类型"
                name="evidence_type"
                defaultValue="note"
                required
              />
              <Input
                aria-label="证据位置"
                name="evidence_uri"
                defaultValue={`local://review/${caseId}/note`}
                required
              />
            </div>
            <div className="grid gap-3 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
              <Input
                aria-label="提交人"
                name="submitted_by"
                defaultValue={detail?.case.owner_id ?? ""}
                required
              />
              <Input
                aria-label="证据备注"
                name="note"
                defaultValue="补充复核证据。"
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="break-all font-mono text-xs text-muted-foreground">
                {action.apiHref}
              </div>
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
        )}
      </CardContent>
    </Card>
  )
}
