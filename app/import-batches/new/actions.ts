"use server"

import { redirect } from "next/navigation"

import {
  createDemandForecastImportBatch,
  createLoginLogImportBatch,
  createPersonnelScheduleImportBatch,
  createStatusLogImportBatch,
} from "@/lib/import-batch-history"

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export async function createDemandForecastImportAction(formData: FormData) {
  await createCsvImportAction(formData, "demand-forecast")
}

export async function createPersonnelScheduleImportAction(formData: FormData) {
  await createCsvImportAction(formData, "personnel-schedule")
}

export async function createLoginLogImportAction(formData: FormData) {
  await createCsvImportAction(formData, "login-log")
}

export async function createStatusLogImportAction(formData: FormData) {
  await createCsvImportAction(formData, "status-log")
}

async function createCsvImportAction(
  formData: FormData,
  importType: "demand-forecast" | "personnel-schedule" | "login-log" | "status-log"
) {
  const file = formData.get("csv_file")

  if (!file || typeof file === "string" || file.size === 0) {
    redirect(`/import-batches/new?type=${importType}&result=missing-file`)
  }

  const payload = {
    file_name: file.name,
    uploaded_by: formText(formData, "uploaded_by") || "排班运营",
    csv_content: await file.text(),
  }
  const created =
    importType === "demand-forecast"
      ? await createDemandForecastImportBatch(payload)
      : importType === "personnel-schedule"
        ? await createPersonnelScheduleImportBatch(payload)
        : importType === "login-log"
          ? await createLoginLogImportBatch(payload)
          : await createStatusLogImportBatch(payload)

  if (!created) {
    redirect(`/import-batches/new?type=${importType}&result=failed`)
  }

  redirect(`/import-batches/${created.id}`)
}
