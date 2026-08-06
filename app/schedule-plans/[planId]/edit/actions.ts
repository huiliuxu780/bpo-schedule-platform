"use server"

import { redirect } from "next/navigation"

import {
  updateSchedulePlanDraft,
  type SchedulePlanDraftPayload,
  type SchedulePlanIntervalInput,
} from "@/lib/schedule-plans"

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function formNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0)
  return Number.isFinite(value) && value > 0 ? value : 0
}

export async function updateDraftAction(formData: FormData) {
  const planId = formText(formData, "plan_id")
  const intervalCount = formNumber(formData, "interval_count")
  const intervals: SchedulePlanIntervalInput[] = Array.from(
    { length: intervalCount },
    (_, index) => ({
      interval_start: formText(formData, `interval_start_${index}`),
      interval_end: formText(formData, `interval_end_${index}`),
      forecast_agents: formNumber(formData, `forecast_agents_${index}`),
      scheduled_agents: formNumber(formData, `scheduled_agents_${index}`),
      note: formText(formData, `note_${index}`) || "草稿待复核",
    })
  )

  const payload: SchedulePlanDraftPayload = {
    plan_date: formText(formData, "plan_date"),
    project_name: formText(formData, "project_name") || "博西客服",
    site_name: formText(formData, "site_name") || "上海职场",
    version: formText(formData, "version") || "v1",
    intervals,
  }

  const updated = await updateSchedulePlanDraft(planId, payload)

  if (!updated.data) {
    redirect(`/schedule-plans/${planId}?draft=failed`)
  }

  redirect(`/schedule-plans/${updated.data.summary.id}`)
}
