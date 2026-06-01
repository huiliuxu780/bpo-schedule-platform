import { redirect } from "next/navigation"

type LegacyImportBatchDetailPageProps = {
  params: Promise<{
    batchId: string
  }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function LegacyImportBatchDetailPage({
  params,
  searchParams,
}: LegacyImportBatchDetailPageProps) {
  const routeParams = await params
  const query = await searchParams
  const legacyParams = new URLSearchParams()

  for (const [key, value] of Object.entries(query ?? {})) {
    if (typeof value === "string") {
      legacyParams.set(key, value)
    } else if (Array.isArray(value)) {
      for (const item of value) {
        legacyParams.append(key, item)
      }
    }
  }

  const search = legacyParams.toString()

  redirect(
    `/data-quality/${encodeURIComponent(routeParams.batchId)}${
      search ? `?${search}` : ""
    }`
  )
}
