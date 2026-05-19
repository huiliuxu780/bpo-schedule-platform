import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  fallbackMasterDataRelations,
  summarizeMasterDataRelations,
} from "@/lib/master-data-relations"

export default function MasterDataRelationsPage() {
  const relations = fallbackMasterDataRelations
  const summary = summarizeMasterDataRelations(relations)

  return (
    <AppShell title="主数据关系" searchPlaceholder="搜索主数据对象或关系">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">主数据关系</h1>
            <p className="text-sm text-muted-foreground">
              本地只读关系图，展示坐席、供应商、职场、项目、绑定关系和班次类型如何支撑排班与履约对比。
            </p>
          </div>
          <Badge variant="outline">只读演示</Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="对象" value={`${summary.nodeCount}`} />
          <Metric title="关系" value={`${summary.edgeCount}`} />
          <Metric title="阻断关系" value={`${summary.blockingEdgeCount}`} />
          <Metric title="支撑流程" value={`${summary.supportedFlows.length}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>主数据对象</CardTitle>
              <CardDescription>对象状态来自本地样例，不代表真实主数据治理结果。</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>暂不实现动作</CardTitle>
              <CardDescription>本批只展示关系，不做主数据维护动作。</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {summary.deferredActions.map((item) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

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
