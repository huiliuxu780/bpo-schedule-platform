import type { DashboardImportRecordSummary } from "@/components/data-table-model"

type ImportedRecordsSummaryProps = {
  records: DashboardImportRecordSummary[]
  title?: string
  description?: string
}

export function ImportedRecordsSummary({
  records,
  title,
  description,
}: ImportedRecordsSummaryProps) {
  void records
  void title
  void description

  return null
}
