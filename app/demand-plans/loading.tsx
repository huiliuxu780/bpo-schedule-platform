import { AppShell } from "@/components/app-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <AppShell
      title="需求计划"
      breadcrumbItems={[{ label: "需求计划" }]}
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="h-14 rounded-lg" />
        <section className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-24 rounded-lg" />
          ))}
        </section>
        <Skeleton className="h-[480px] rounded-lg" />
      </main>
    </AppShell>
  )
}
