"use server"

import { redirect } from "next/navigation"

import {
  publishSchedulePlan,
  submitSchedulePlanForReview,
} from "@/lib/schedule-plans"

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export async function submitReviewAction(formData: FormData) {
  const planId = formText(formData, "plan_id")
  const updated = await submitSchedulePlanForReview(planId)

  if (!updated) {
    redirect(`/schedule-plans/${encodeURIComponent(planId)}?lifecycle=submit_review_failed`)
  }

  redirect(`/schedule-plans/${encodeURIComponent(updated.summary.id)}?lifecycle=submit_review_success`)
}

export async function publishSchedulePlanAction(formData: FormData) {
  const planId = formText(formData, "plan_id")
  const updated = await publishSchedulePlan(planId)

  if (!updated) {
    redirect(`/schedule-plans/${encodeURIComponent(planId)}?lifecycle=publish_failed`)
  }

  redirect(`/schedule-plans/${encodeURIComponent(updated.summary.id)}?lifecycle=publish_success`)
}
