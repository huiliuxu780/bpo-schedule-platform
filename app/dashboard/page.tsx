import { DashboardClient } from "@/components/dashboard-client"
import {
  getDemoImportBatches,
  mapDemoBatchesToSyncStatus,
} from "@/lib/demo-imports"

export default async function DashboardPage() {
  const importedRows = mapDemoBatchesToSyncStatus(await getDemoImportBatches())

  return <DashboardClient syncStatusRows={importedRows} />
}
