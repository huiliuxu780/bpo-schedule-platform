import type { ReactNode } from "react"

import { ImportCenterBatchInspectorPanel } from "@/components/import-center-batch-inspector-panel"
import { ImportCenterBatchListPanel } from "@/components/import-center-batch-list-panel"
import { ImportCenterOverviewPanel } from "@/components/import-center-overview-panel"
import {
  type ImportApplyReadinessResponse,
  type ImportBatchFilters,
  type ImportBatchListRow,
  buildImportBatchProcessingHref,
  filterImportBatches,
  summarizeImportExceptionGuidance,
} from "@/components/import-center-model"

type ImportCenterApiPanelProps = {
  batches: ImportBatchListRow[]
  selectedBatchId: string | null
  readiness: ImportApplyReadinessResponse | null
  batchError: string | null
  readinessError: string | null
  batchFilters?: ImportBatchFilters
  templateError?: string | null
  templateCount?: number
  children?: ReactNode
}

export function ImportCenterApiPanel({
  batches,
  selectedBatchId,
  readiness,
  batchError,
  readinessError,
  batchFilters = {},
  templateError = null,
  templateCount = 1,
  children,
}: ImportCenterApiPanelProps) {
  const filteredBatches = filterImportBatches(batches, batchFilters)
  const selectedBatch =
    batches.find((batch) => batch.batch_id === selectedBatchId) ??
    filteredBatches[0] ??
    batches[0] ??
    null
  const exceptionGuidance = summarizeImportExceptionGuidance({
    batchError,
    readinessError,
    templateError,
    selectedBatchId: selectedBatch?.batch_id ?? selectedBatchId,
    batchCount: batches.length,
    templateCount,
  })
  const selectedBatchDetailHref = selectedBatch
    ? buildImportBatchProcessingHref(selectedBatch.batch_id)
    : null

  return (
    <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
      <ImportCenterOverviewPanel
        batches={filteredBatches}
        selectedBatch={selectedBatch}
        readiness={readiness}
        exceptionGuidance={exceptionGuidance}
      />

      <section
        id="import-batch-workspace"
        className="grid min-h-0 scroll-mt-16 gap-4 xl:grid-cols-[minmax(0,1fr)_420px]"
      >
        <ImportCenterBatchListPanel
          batches={batches}
          selectedBatch={selectedBatch}
          selectedBatchId={selectedBatchId}
          readiness={readiness}
          batchError={batchError}
          batchFilters={batchFilters}
          selectedBatchDetailHref={selectedBatchDetailHref}
        />
        <ImportCenterBatchInspectorPanel
          selectedBatch={selectedBatch}
          readiness={readiness}
          readinessError={readinessError}
          mode="summary"
          detailHref={selectedBatchDetailHref}
        />
      </section>

      {children}
    </main>
  )
}
