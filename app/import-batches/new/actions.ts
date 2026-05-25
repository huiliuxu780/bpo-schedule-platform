"use server"

import { redirect } from "next/navigation"

import { createDemandForecastImportBatch } from "@/lib/import-batch-history"

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export async function createDemandForecastImportAction(formData: FormData) {
  const file = formData.get("csv_file")

  if (!file || typeof file === "string" || file.size === 0) {
    redirect("/import-batches/new?result=missing-file")
  }

  const created = await createDemandForecastImportBatch({
    file_name: file.name,
    uploaded_by: formText(formData, "uploaded_by") || "数据管理员",
    csv_content: await file.text(),
  })

  if (!created) {
    redirect("/import-batches/new?result=failed")
  }

  redirect(`/import-batches/${created.id}`)
}
