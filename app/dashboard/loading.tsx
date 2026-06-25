import { AppShell } from "@/components/app-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <AppShell title="经营总览">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto pb-6">
        <div className="flex flex-wrap items-center gap-2 px-4 py-3 lg:px-6">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-36" />
        </div>
        <section className="grid gap-4 px-4 md:grid-cols-2 lg:grid-cols-4 lg:px-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </section>
        <section className="grid gap-4 px-4 lg:grid-cols-[1.25fr_0.75fr] lg:px-6">
          <Skeleton className="h-80 rounded-lg" />
          <Skeleton className="h-80 rounded-lg" />
        </section>
        <section className="grid gap-4 px-4 lg:px-6">
          <Skeleton className="h-96 rounded-lg" />
        </section>
      </main>
    </AppShell>
  )
}
