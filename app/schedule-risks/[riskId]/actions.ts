"use server"

import { redirect } from "next/navigation"
import { confirmScheduleRisk, resolveScheduleRisk } from "@/lib/schedule-plans"

export async function confirmScheduleRiskAction(formData: FormData) {
  const riskId = String(formData.get("risk_id") ?? "").trim()

  if (!riskId) {
    redirect("/schedule-risks")
  }

  const result = await confirmScheduleRisk(riskId)

  if (result) {
    redirect(`/schedule-risks/${encodeURIComponent(result.risk_id)}?riskAction=confirm_success`)
  }

  redirect(`/schedule-risks/${encodeURIComponent(riskId)}?riskAction=confirm_failed`)
}

export async function resolveScheduleRiskAction(formData: FormData) {
  const riskId = String(formData.get("risk_id") ?? "").trim()

  if (!riskId) {
    redirect("/schedule-risks")
  }

  const result = await resolveScheduleRisk(riskId)

  if (result) {
    redirect(`/schedule-risks/${encodeURIComponent(result.risk_id)}?riskAction=resolve_success`)
  }

  redirect(`/schedule-risks/${encodeURIComponent(riskId)}?riskAction=resolve_failed`)
}
