import type {
  ImportBatchListRow,
  ImportBatchSummary,
  ImportBatchFilters,
} from "./import-center-types"

export function summarizeImportBatches(rows: ImportBatchListRow[]): ImportBatchSummary {
  return rows.reduce<ImportBatchSummary>(
    (summary, row) => ({
      totalBatches: summary.totalBatches + 1,
      totalRows: summary.totalRows + row.total_rows,
      failedRows: summary.failedRows + row.failed_rows,
      warningRows: summary.warningRows + row.warning_rows,
      appliedBatches:
        summary.appliedBatches + (row.application_status === "applied" ? 1 : 0),
      notAppliedBatches:
        summary.notAppliedBatches +
        (row.application_status === "not_applied" ? 1 : 0),
    }),
    {
      totalBatches: 0,
      totalRows: 0,
      failedRows: 0,
      warningRows: 0,
      appliedBatches: 0,
      notAppliedBatches: 0,
    }
  )
}

export function filterImportBatches(
  rows: ImportBatchListRow[],
  filters: ImportBatchFilters
): ImportBatchListRow[] {
  const query = filters.query?.trim().toLowerCase() ?? ""
  const fileType = filters.fileType && filters.fileType !== "all" ? filters.fileType : null
  const processingStatus =
    filters.processingStatus && filters.processingStatus !== "all"
      ? filters.processingStatus
      : null
  const applicationStatus =
    filters.applicationStatus && filters.applicationStatus !== "all"
      ? filters.applicationStatus
      : null

  return rows.filter((row) => {
    if (fileType && row.file_type !== fileType) {
      return false
    }

    if (processingStatus && row.processing_status !== processingStatus) {
      return false
    }

    if (applicationStatus && row.application_status !== applicationStatus) {
      return false
    }

    if (!query) {
      return true
    }

    const searchableText = [
      row.batch_id,
      row.file_name,
      row.uploaded_by,
      row.application_target,
      row.import_version_id ?? "",
    ]
      .join(" ")
      .toLowerCase()

    return searchableText.includes(query)
  })
}
