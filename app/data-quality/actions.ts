"use server"

import { redirect } from "next/navigation"

import { buildImportUploadUrl, type ImportFileType } from "@/components/import-center-model"

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

export async function uploadImportCsvAction(formData: FormData) {
  const batchId = formText(formData, "batch_id")
  const fileType = formText(formData, "file_type") as ImportFileType
  const uploadedBy = formText(formData, "uploaded_by") || "local-operator"
  const businessDateFrom = formText(formData, "business_date_from")
  const businessDateTo = formText(formData, "business_date_to")
  const fieldMapping = formText(formData, "field_mapping") || '{"source_key":"source_key"}'
  const file = formData.get("csv_file")

  if (!batchId || !businessDateFrom || !businessDateTo || !(file instanceof File)) {
    redirect("/data-quality?upload=failed&reason=missing_required_fields")
  }

  const csvText = await file.text()
  const fileName = formText(formData, "file_name") || file.name

  try {
    const response = await fetch(
      buildImportUploadUrl({
        batchId,
        fileName,
        fileType,
        uploadedBy,
        businessDateFrom,
        businessDateTo,
        fieldMapping,
      }),
      {
        method: "POST",
        headers: {
          "content-type": "text/csv; charset=utf-8",
        },
        body: csvText,
        cache: "no-store",
      }
    )

    if (!response.ok) {
      redirect(
        `/data-quality?upload=failed&reason=api_${response.status}&batch=${encodeURIComponent(
          batchId
        )}`
      )
    }
  } catch (error) {
    redirect(
      `/data-quality?upload=failed&reason=${encodeURIComponent(formatActionError(error))}`
    )
  }

  redirect(`/data-quality?upload=success&batch=${encodeURIComponent(batchId)}`)
}

function formatActionError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "api_unavailable"
}
