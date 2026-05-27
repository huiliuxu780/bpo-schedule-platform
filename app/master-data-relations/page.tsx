import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  employeeMasterDataBindingStatusLabel,
  fallbackMasterDataRelations,
  getEmployeeMasterDataBindings,
  getMasterDataBindingTarget,
  masterDataReferenceStatusLabel,
  summarizeEmployeeMasterDataBindings,
  summarizeMasterDataRelations,
} from "@/lib/master-data-relations"

export default async function MasterDataRelationsPage() {
  const relations = fallbackMasterDataRelations
  const employeeBindings = await getEmployeeMasterDataBindings()
  const summary = summarizeMasterDataRelations(relations)
  const bindingSummary = summarizeEmployeeMasterDataBindings(employeeBindings)

  return (
    <AppShell title="主数据关系" searchPlaceholder="搜索主数据对象或关系">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">主数据关系</h1>
            <p className="text-sm text-muted-foreground">
              展示坐席、供应商、职场、项目、绑定关系和班次类型如何支撑排班与履约对比。
            </p>
          </div>
          <Badge variant="outline">关系图</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="对象" value={`${summary.nodeCount}`} />
          <Metric title="关系" value={`${summary.edgeCount}`} />
          <Metric title="员工绑定" value={`${bindingSummary.total}`} />
          <Metric title="待复核" value={`${bindingSummary.needsReview}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>主数据对象</CardTitle>
              <CardDescription>对象状态用于判断排班和履约对比是否具备基础关系。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 lg:grid-cols-2">
              {relations.nodes.map((node) => (
                <div key={node.id} className="rounded-lg border p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-sm font-medium">{node.title}</div>
                    <Badge variant={node.status === "ready" ? "secondary" : "outline"}>
                      {node.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{node.id}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {node.supports.map((flow) => (
                      <Badge key={flow} variant="outline">
                        {flow}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>员工绑定关系</CardTitle>
                <CardDescription>
                  按员工展示供应商、职场、项目、技能、有效期和状态，用于异常反查。
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {bindingSummary.active} 个有效 / {bindingSummary.expiringSoon} 个即将到期
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {employeeBindings.map((binding) => (
              <div
                key={binding.employeeId}
                id={`employee-${binding.employeeId}`}
                className="scroll-mt-24 rounded-lg border p-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {binding.employeeId} {binding.employeeName}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {binding.workplace} / {binding.project} / {binding.supplier}
                    </div>
                  </div>
                  <Badge variant={binding.status === "needs_review" ? "destructive" : "secondary"}>
                    {employeeMasterDataBindingStatusLabel(binding.status)}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <MiniDetail label="技能" value={binding.skills.join("、")} />
                  <MiniDetail label="有效期" value={`${binding.effectiveFrom} 至 ${binding.effectiveTo}`} />
                  <MiniDetail
                    label="关联异常"
                    value={[...binding.anomalyIds, ...binding.qualityIssueIds].join("、") || "无"}
                  />
                  <MiniDetail label="来源批次" value={binding.sourceBatchId ?? "样例关系"} />
                  <MiniDetail label="导入版本" value={binding.sourceVersionId ?? "未生成"} />
                  <MiniDetail label="引用状态" value={masterDataReferenceStatusLabel(binding.referenceStatus)} />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {binding.businessImpact}
                </p>
                <div className="mt-3 flex justify-end">
                  <Button asChild size="sm" variant="outline">
                    <Link href={getMasterDataBindingTarget(binding.employeeId)}>定位此员工</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>关系清单</CardTitle>
            <CardDescription>阻断关系缺失时会影响排班、履约对比或异常归因。</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {relations.edges.map((edge) => (
              <div key={`${edge.from}-${edge.to}-${edge.label}`} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium">
                    {edge.from} {"->"} {edge.to}
                  </div>
                  <Badge variant={edge.blocking ? "default" : "outline"}>
                    {edge.blocking ? "阻断" : "参考"}
                  </Badge>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">{edge.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  )
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
