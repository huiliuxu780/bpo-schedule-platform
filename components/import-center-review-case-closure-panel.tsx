import { redirect } from "next/navigation"
import { ClipboardCheck } from "lucide-react"

import {
  type ImportReviewCaseDetailResponse,
  buildImportReviewCaseClosureWriteApiUrl,
  buildImportReviewCaseClosureWritePayload,
  buildImportReviewCaseDetailWorkspaceHref,
  summarizeImportReviewCaseClosureAction,
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

type ImportCenterReviewCaseClosurePanelProps = {
  caseId: string
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
  embedded?: boolean
}

export function ImportCenterReviewCaseClosurePanel({
  caseId,
  detail,
  error,
  embedded = false,
}: ImportCenterReviewCaseClosurePanelProps) {
  const action = summarizeImportReviewCaseClosureAction({ detail, error })

  async function submitClosure(formData: FormData) {
    "use server"

    if (!detail) {
      redirect(buildImportReviewCaseDetailWorkspaceHref(caseId))
    }

    const closedBy = String(formData.get("closed_by") ?? "").trim()
    const closureNote = String(formData.get("closure_note") ?? "").trim()
    const payload = buildImportReviewCaseClosureWritePayload({
      detail,
      closedBy: closedBy || "ops-lead-01",
      closureNote,
    })
    const response = await fetch(buildImportReviewCaseClosureWriteApiUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    })

    const suffix = response.ok ? "?closure=success" : "?closure=failed"
    redirect(`${buildImportReviewCaseDetailWorkspaceHref(caseId)}${suffix}`)
  }

  const header = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <CardTitle className="flex items-center gap-2 text-base">
          <ClipboardCheck className="size-4 text-muted-foreground" />
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
    <form action={submitClosure} className="grid gap-3">
      <div className="grid gap-3 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
        <Input
          aria-label="关闭人"
          name="closed_by"
          defaultValue="ops-lead-01"
          required
        />
        <Input
          aria-label="关闭备注"
          name="closure_note"
          defaultValue="证据和结论已复核。"
        />
      </div>
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
