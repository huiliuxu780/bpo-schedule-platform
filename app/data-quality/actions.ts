"use server"

import { redirect } from "next/navigation"

import {
  buildImportBatchApplyUrl,
  buildImportBatchProcessingHref,
  buildImportComparisonRunCalculateUrl,
  buildImportFieldMappingTemplateCreateUrl,
  buildImportFieldMappingTemplateDeactivateUrl,
  buildImportFieldMappingTemplateDetailUrl,
  buildImportFieldMappingTemplateWorkspaceHref,
  buildImportRowCorrectionUrl,
  buildImportUploadWorkspaceResultHref,
  buildImportUploadUrl,
  type ImportFileType,
  type ImportComparisonRunRecord,
} from "@/components/import-center-model"

const importFileTypes = new Set<ImportFileType>([
  "master_data",
  "personnel_schedule",
  "demand_forecast",
  "login_log",
  "status_log",
])

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
  const templateId = formText(formData, "template_id")
  const resultTarget = formText(formData, "result_redirect_to")
  const file = formData.get("csv_file")

  if (!batchId || !businessDateFrom || !businessDateTo || !(file instanceof File)) {
    redirect(buildUploadResultRedirectHref(resultTarget, {
      status: "failed",
      reason: "missing_required_fields",
    }))
  }

  const csvText = await file.text()
  const fileName = formText(formData, "file_name") || file.name
  let apiStatus: number | null = null
  let networkError: string | null = null

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
        templateId: templateId || undefined,
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

    apiStatus = response.status
  } catch (error) {
    networkError = formatActionError(error)
  }

  if (networkError) {
    redirect(buildUploadResultRedirectHref(resultTarget, {
      status: "failed",
      reason: networkError,
    }))
  }

  if (apiStatus !== null && (apiStatus < 200 || apiStatus >= 300)) {
    redirect(buildUploadResultRedirectHref(resultTarget, {
      status: "failed",
      reason: `api_${apiStatus}`,
      batchId,
    }))
  }

  redirect(buildUploadResultRedirectHref(resultTarget, {
    status: "success",
    batchId,
  }))
}

function buildUploadResultRedirectHref(
  resultTarget: string,
  params: {
    status: "success" | "failed"
    batchId?: string | null
    reason?: string | null
  }
) {
  if (resultTarget === "/data-quality/uploads/new") {
    return buildImportUploadWorkspaceResultHref(params)
  }

  const searchParams = new URLSearchParams({ upload: params.status })

  if (params.reason) {
    searchParams.set("reason", params.reason)
  }

  if (params.batchId) {
    searchParams.set("batch", params.batchId)
  }

  return `/data-quality?${searchParams.toString()}`
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

export async function updateImportFieldMappingTemplateAction(formData: FormData) {
  const templateId = formText(formData, "template_id")
  const templateName = formText(formData, "template_name")
  const fieldMappingText = formText(formData, "field_mapping")
  const detailHref = templateId
    ? buildImportFieldMappingTemplateWorkspaceHref(templateId)
    : "/data-quality"

  if (!templateId || !templateName || !fieldMappingText) {
    redirect(
      `${detailHref}?template=failed&action=update&reason=missing_required_fields`
    )
  }

  const fieldMapping = parseStringFieldMapping(fieldMappingText)
  if (!fieldMapping) {
    redirect(`${detailHref}?template=failed&action=update&reason=invalid_json`)
  }

  let apiStatus: number | null = null
  let networkError: string | null = null

  try {
    const response = await fetch(buildImportFieldMappingTemplateDetailUrl(templateId), {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        template_name: templateName,
        field_mapping: fieldMapping,
      }),
      cache: "no-store",
    })

    apiStatus = response.status
  } catch (error) {
    networkError = formatActionError(error)
  }

  if (networkError) {
    redirect(
      `${detailHref}?template=failed&action=update&reason=${encodeURIComponent(networkError)}`
    )
  }

  if (apiStatus !== null && (apiStatus < 200 || apiStatus >= 300)) {
    redirect(`${detailHref}?template=failed&action=update&reason=api_${apiStatus}`)
  }

  redirect(`${detailHref}?template=success&action=update`)
}

export async function createImportFieldMappingTemplateAction(formData: FormData) {
  const templateId = formText(formData, "template_id")
  const templateName = formText(formData, "template_name")
  const fileType = formText(formData, "file_type") as ImportFileType
  const createdBy = formText(formData, "created_by") || "local-operator"
  const fieldMappingText = formText(formData, "field_mapping")

  if (!templateId || !templateName || !fileType || !fieldMappingText) {
    redirect(
      "/data-quality/field-mapping-templates/new?template=failed&action=create&reason=missing_required_fields"
    )
  }

  const fieldMapping = parseStringFieldMapping(fieldMappingText)
  if (!fieldMapping) {
    redirect(
      "/data-quality/field-mapping-templates/new?template=failed&action=create&reason=invalid_json"
    )
  }

  let apiStatus: number | null = null
  let networkError: string | null = null

  try {
    const response = await fetch(buildImportFieldMappingTemplateCreateUrl(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        template_id: templateId,
        template_name: templateName,
        file_type: fileType,
        field_mapping: fieldMapping,
        created_by: createdBy,
      }),
      cache: "no-store",
    })

    apiStatus = response.status
  } catch (error) {
    networkError = formatActionError(error)
  }

  if (networkError) {
    redirect(
      `/data-quality/field-mapping-templates/new?template=failed&action=create&reason=${encodeURIComponent(networkError)}`
    )
  }

  if (apiStatus !== null && (apiStatus < 200 || apiStatus >= 300)) {
    redirect(
      `/data-quality/field-mapping-templates/new?template=failed&action=create&reason=api_${apiStatus}`
    )
  }

  redirect(
    `${buildImportFieldMappingTemplateWorkspaceHref(templateId)}?template=success&action=create`
  )
}

export async function deactivateImportFieldMappingTemplateAction(formData: FormData) {
  const templateId = formText(formData, "template_id")
  const detailHref = templateId
    ? buildImportFieldMappingTemplateWorkspaceHref(templateId)
    : "/data-quality"

  if (!templateId) {
    redirect(
      `${detailHref}?template=failed&action=deactivate&reason=missing_required_fields`
    )
  }

  let apiStatus: number | null = null
  let networkError: string | null = null

  try {
    const response = await fetch(
      buildImportFieldMappingTemplateDeactivateUrl(templateId),
      {
        method: "POST",
        cache: "no-store",
      }
    )

    apiStatus = response.status
  } catch (error) {
    networkError = formatActionError(error)
  }

  if (networkError) {
    redirect(
      `${detailHref}?template=failed&action=deactivate&reason=${encodeURIComponent(networkError)}`
    )
  }

  if (apiStatus !== null && (apiStatus < 200 || apiStatus >= 300)) {
    redirect(
      `${detailHref}?template=failed&action=deactivate&reason=api_${apiStatus}`
    )
  }

  redirect(`${detailHref}?template=success&action=deactivate`)
}

export async function applyImportBatchAction(formData: FormData) {
  const batchId = formText(formData, "batch_id")
  const fileType = formText(formData, "file_type") as ImportFileType
  const detailHref = batchId
    ? `/data-quality/${encodeURIComponent(batchId)}`
    : "/data-quality"

  if (!batchId || !importFileTypes.has(fileType)) {
    redirect(`${detailHref}?apply=failed&reason=missing_required_fields`)
  }

  let apiStatus: number | null = null
  let networkError: string | null = null

  try {
    const response = await fetch(buildImportBatchApplyUrl(batchId, fileType), {
      method: "POST",
      cache: "no-store",
    })

    apiStatus = response.status
  } catch (error) {
    networkError = formatActionError(error)
  }

  if (networkError) {
    redirect(
      `${detailHref}?apply=failed&reason=${encodeURIComponent(networkError)}`
    )
  }

  if (apiStatus !== null && (apiStatus < 200 || apiStatus >= 300)) {
    redirect(`${detailHref}?apply=failed&reason=api_${apiStatus}`)
  }

  redirect(`${detailHref}?apply=success`)
}

export async function triggerLocalComparisonRunAction(formData: FormData) {
  const batchId = formText(formData, "batch_id")
  const comparisonType = formText(
    formData,
    "comparison_type"
  ) as ImportComparisonRunRecord["comparison_type"]
  const forecastVersionId = formText(formData, "forecast_version_id") || null
  const scheduleVersionId = formText(formData, "schedule_version_id") || null
  const actualImportVersionId = formText(formData, "actual_import_version_id") || null
  const businessDateFrom = formText(formData, "business_date_from")
  const businessDateTo = formText(formData, "business_date_to")

  if (
    !batchId ||
    !businessDateFrom ||
    !businessDateTo ||
    (comparisonType !== "forecast_vs_schedule" &&
      comparisonType !== "schedule_vs_actual") ||
    (comparisonType === "forecast_vs_schedule" &&
      (!forecastVersionId || !scheduleVersionId)) ||
    (comparisonType === "schedule_vs_actual" &&
      (!scheduleVersionId || !actualImportVersionId))
  ) {
    redirect(
      buildImportBatchProcessingHref(batchId || "", {
        compare: "failed",
        compareReason: "missing_required_fields",
        tab: "result-trace",
      })
    )
  }

  let networkError: string | null = null
  let apiReason: string | null = null
  let runId = buildLocalComparisonRunId(comparisonType, businessDateFrom)

  try {
    const response = await fetch(buildImportComparisonRunCalculateUrl(), {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        run_id: runId,
        comparison_type: comparisonType,
        forecast_version_id: forecastVersionId,
        schedule_version_id: scheduleVersionId,
        actual_import_version_id: actualImportVersionId,
        business_date_from: businessDateFrom,
        business_date_to: businessDateTo,
      }),
      cache: "no-store",
    })

    const payload = await readActionJson(response)
    const responseRunId = extractActionRunId(payload)
    if (typeof responseRunId === "string" && responseRunId.trim().length > 0) {
      runId = responseRunId
    }

    if (response.status < 200 || response.status >= 300) {
      apiReason = extractActionApiReason(payload) ?? `api_${response.status}`
    }
  } catch (error) {
    networkError = formatActionError(error)
  }

  if (networkError) {
    redirect(
      buildImportBatchProcessingHref(batchId, {
        compare: "failed",
        compareReason: networkError,
        tab: "result-trace",
      })
    )
  }

  if (apiReason) {
    redirect(
      buildImportBatchProcessingHref(batchId, {
        compare: "failed",
        compareReason: apiReason,
        compareRun: runId,
        tab: "result-trace",
      })
    )
  }

  redirect(
    buildImportBatchProcessingHref(batchId, {
      compare: "success",
      compareRun: runId,
      tab: "result-trace",
    })
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

function parseStringFieldMapping(value: string): Record<string, string> | null {
  try {
    const parsed = JSON.parse(value) as unknown
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return null
    }

    const entries = Object.entries(parsed)
    if (entries.length === 0) {
      return null
    }

    if (
      entries.every(
        ([sourceField, standardField]) =>
          sourceField.trim().length > 0 &&
          typeof standardField === "string" &&
          standardField.trim().length > 0
      )
    ) {
      return Object.fromEntries(
        entries.map(([sourceField, standardField]) => [
          sourceField.trim(),
          String(standardField).trim(),
        ])
      )
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

async function readActionJson(response: Response): Promise<Record<string, unknown> | null> {
  try {
    const payload = (await response.json()) as unknown
    if (typeof payload === "object" && payload !== null) {
      return payload as Record<string, unknown>
    }
  } catch {
    return null
  }

  return null
}

function extractActionApiReason(payload: Record<string, unknown> | null): string | null {
  if (!payload) {
    return null
  }

  const detail =
    typeof payload.detail === "object" && payload.detail !== null
      ? (payload.detail as Record<string, unknown>)
      : null
  const error =
    detail && typeof detail.error === "object" && detail.error !== null
      ? (detail.error as Record<string, unknown>)
      : null

  const message = typeof error?.message === "string" ? error.message.trim() : ""
  if (message) {
    return message
  }

  const code = typeof error?.code === "string" ? error.code.trim() : ""
  return code || null
}

function extractActionRunId(payload: Record<string, unknown> | null): string | null {
  if (!payload) {
    return null
  }

  const run =
    typeof payload.run === "object" && payload.run !== null
      ? (payload.run as Record<string, unknown>)
      : null

  return typeof run?.run_id === "string" && run.run_id.trim().length > 0
    ? run.run_id.trim()
    : null
}

function buildLocalComparisonRunId(
  comparisonType: ImportComparisonRunRecord["comparison_type"],
  businessDateFrom: string
): string {
  const typeCode = comparisonType === "forecast_vs_schedule" ? "FS" : "SA"
  const dateCode = businessDateFrom.replaceAll("-", "") || "LOCAL"
  const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14)
  const randomCode = crypto.randomUUID().slice(0, 8).toUpperCase()

  return `CALC-${typeCode}-${dateCode}-${timestamp}-${randomCode}`
}
