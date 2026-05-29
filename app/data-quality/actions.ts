"use server"

import { redirect } from "next/navigation"

import {
  buildImportRowCorrectionUrl,
  buildImportUploadUrl,
  type ImportFileType,
} from "@/components/import-center-model"

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

export async function correctImportFailedRowAction(formData: FormData) {
  const batchId = formText(formData, "batch_id")
  const rowNumber = Number(formText(formData, "row_number"))
  const standardFieldsText = formText(formData, "standard_fields")

  if (!batchId || !Number.isInteger(rowNumber) || rowNumber < 1 || !standardFieldsText) {
    redirect("/data-quality?correction=failed&reason=missing_required_fields")
  }

  const standardFields = parseStandardFields(standardFieldsText)
  if (!standardFields) {
    redirect(
      `/data-quality?batch=${encodeURIComponent(batchId)}&correction=failed&reason=invalid_json&row=${rowNumber}`
    )
  }

  let apiStatus: number | null = null
  let networkError: string | null = null

  try {
    const response = await fetch(buildImportRowCorrectionUrl(batchId, rowNumber), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        row_number: rowNumber,
        standard_fields: standardFields,
      }),
      cache: "no-store",
    })

    apiStatus = response.status
  } catch (error) {
    networkError = formatActionError(error)
  }

  if (networkError) {
    redirect(
      `/data-quality?batch=${encodeURIComponent(batchId)}&correction=failed&reason=${encodeURIComponent(networkError)}&row=${rowNumber}`
    )
  }

  if (apiStatus !== null && (apiStatus < 200 || apiStatus >= 300)) {
    redirect(
      `/data-quality?batch=${encodeURIComponent(batchId)}&correction=failed&reason=api_${apiStatus}&row=${rowNumber}`
    )
  }

  redirect(
    `/data-quality?batch=${encodeURIComponent(batchId)}&correction=success&row=${rowNumber}`
  )
}

function parseStandardFields(value: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(value) as unknown
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    return null
  }

  return null
}

function formatActionError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "api_unavailable"
}
