"use server"

import { redirect } from "next/navigation"

import {
  buildCsvImportPreview,
  normalizeCsvImportType,
  type CsvImportPreviewFormState,
  type CsvImportType,
} from "@/lib/csv-import-preview"
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

export async function previewCsvImportAction(
  _state: CsvImportPreviewFormState,
  formData: FormData
): Promise<CsvImportPreviewFormState> {
  const importType = normalizeCsvImportType(formText(formData, "import_type"))
  const file = formData.get("csv_file")

  if (!file || typeof file === "string" || file.size === 0) {
    return {
      status: "error",
      message: "请选择 CSV 文件后再预览。",
    }
  }

  if (!file.name.toLowerCase().endsWith(".csv")) {
    return {
      status: "error",
      message: "当前只支持 CSV 文件预览。",
    }
  }

  const preview = buildCsvImportPreview({
    importType,
    fileName: file.name,
    csvContent: await file.text(),
  })

  return {
    status: "ready",
    message:
      preview.missingRequiredFields.length > 0
        ? "字段映射预览已生成，仍有必填字段缺失。"
        : "字段映射预览已生成，可以继续校验后提交。",
    preview,
  }
}

async function createCsvImportAction(
  formData: FormData,
  importType: Exclude<CsvImportType, "master-data">
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
