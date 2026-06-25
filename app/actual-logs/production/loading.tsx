import { AppShell } from "@/components/app-shell"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <AppShell
      title="登录/状态日志"
      breadcrumbItems={[{ label: "登录/状态日志" }]}
      actions={
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-24" />
        </div>
      }
    >
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <section className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </section>
        <Skeleton className="h-16 rounded-lg" />
        <Skeleton className="h-[520px] rounded-lg" />
      </main>
    </AppShell>
  )
}
