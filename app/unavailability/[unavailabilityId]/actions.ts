"use server"

import { redirect } from "next/navigation"
import { resolveUnavailability } from "@/lib/unavailability"

export async function resolveUnavailabilityAction(formData: FormData) {
  const unavailabilityId = String(formData.get("unavailability_id") ?? "").trim()

  if (!unavailabilityId) {
    redirect("/unavailability")
  }

  const result = await resolveUnavailability(unavailabilityId)

  if (result) {
    redirect(`/unavailability/${encodeURIComponent(result.unavailability_id)}?unavailabilityAction=resolve_success`)
  }

  redirect(`/unavailability/${encodeURIComponent(unavailabilityId)}?unavailabilityAction=resolve_failed`)
}
