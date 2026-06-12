import { AppShell } from "@/components/app-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <AppShell
      title="导入批次"
      breadcrumbItems={[{ label: "导入批次" }]}
    >
      <main className="grid min-h-0 flex-1 gap-4 overflow-hidden p-4 lg:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.1fr)] lg:p-6">
        <section className="flex min-h-0 flex-col gap-3">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-14 rounded-lg" />
          <Skeleton className="min-h-[560px] flex-1 rounded-lg" />
        </section>
        <section className="flex min-h-0 flex-col gap-3">
          <Skeleton className="h-36 rounded-lg" />
          <Skeleton className="min-h-[520px] flex-1 rounded-lg" />
        </section>
      </main>
    </AppShell>
  )
}
