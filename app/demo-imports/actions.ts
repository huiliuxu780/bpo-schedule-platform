"use server"

import { redirect } from "next/navigation"

import { importDemoCsv, type DemoImportKind } from "@/lib/demo-imports"

function parseKind(value: FormDataEntryValue | null): DemoImportKind {
  if (
    value === "staff_master" ||
    value === "status_log" ||
    value === "login_log" ||
    value === "schedule_plan"
  ) {
    return value
  }

  return "staff_master"
}

async function readCsvText(formData: FormData) {
  const file = formData.get("csvFile")

  if (file instanceof File && file.size > 0) {
    return (await file.text()).trim()
  }

  const pasted = String(formData.get("csvText") ?? "").trim()

  if (pasted) {
    return pasted
  }

  return ""
}

export async function importDemoCsvAction(formData: FormData) {
  const kind = parseKind(formData.get("kind"))
  const csvText = await readCsvText(formData)
  const response = csvText ? await importDemoCsv(kind, csvText) : null
  const searchParams = new URLSearchParams()

  searchParams.set("kind", kind)

  if (response) {
    searchParams.set("batch", response.batch.batch_id)
    searchParams.set("success", String(response.batch.success_rows))
    searchParams.set("failed", String(response.batch.failed_rows))
  } else {
    searchParams.set("failed", "1")
    searchParams.set("error", "empty")
  }

  redirect(`/demo-imports?${searchParams.toString()}`)
}
