import Link from "next/link"

import {
  freezeMasterDataRecordAction,
  unfreezeMasterDataRecordAction,
  upsertMasterDataRecordAction,
} from "@/app/master-data-relations/actions"
import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  summarizeMasterDataMaintenance,
  summarizeMasterDataRelations,
} from "@/lib/master-data-relations"

type PageProps = {
  searchParams: Promise<{ result?: string }>
}

export default async function MasterDataRelationsPage({ searchParams }: PageProps) {
  const { result } = await searchParams
  const relations = fallbackMasterDataRelations
  const employeeBindings = await getEmployeeMasterDataBindings()
  const summary = summarizeMasterDataRelations(relations)
  const bindingSummary = summarizeEmployeeMasterDataBindings(employeeBindings)
  const maintenanceSummary = summarizeMasterDataMaintenance(employeeBindings)

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
          <Metric title="冻结" value={`${bindingSummary.frozen}`} />
        </section>

        {result ? (
          <div className="rounded-lg border p-3 text-sm">
            {result === "maintained" ? "主数据维护已提交。" : "主数据维护失败，请检查数据服务或字段。"}
          </div>
        ) : null}

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
                <CardTitle>维护状态</CardTitle>
                <CardDescription>
                  新增或修改主数据后，冻结、解冻和引用校验会影响后续业务引用。
                </CardDescription>
              </div>
              <Badge variant="outline">
                {maintenanceSummary.imported} 条导入 / {maintenanceSummary.blockedReferences} 条阻断
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
            <form
              action={upsertMasterDataRecordAction}
              className="grid gap-3 rounded-lg border p-3 md:grid-cols-3"
            >
              <MiniInput label="员工编号" name="employee_id" required />
              <MiniInput label="员工姓名" name="employee_name" />
              <MiniInput label="职场编号" name="workplace_id" required />
              <MiniInput label="职场名称" name="workplace_name" />
              <MiniInput label="供应商编号" name="supplier_id" required />
              <MiniInput label="供应商名称" name="supplier_name" />
              <MiniInput label="项目编号" name="project_id" required />
              <MiniInput label="项目名称" name="project_name" />
              <MiniInput label="技能组" name="skill_group" required />
              <MiniInput label="等级" name="skill_level" />
              <MiniInput label="生效日期" name="effective_from" required />
              <MiniInput label="失效日期" name="effective_to" />
              <div className="flex items-end md:col-span-3">
                <Button type="submit" size="sm">
                  新增或修改
                </Button>
              </div>
            </form>

            <div className="grid gap-3 rounded-lg border p-3">
              <div>
                <div className="text-sm font-medium">引用校验</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  冻结、停用、有效期失效或绑定不一致的记录会进入数据质量核对。
                </p>
              </div>
              <div className="grid gap-2 text-sm">
                <MiniDetail label="已冻结" value={`${maintenanceSummary.frozen}`} />
                <MiniDetail label="引用阻断" value={`${maintenanceSummary.blockedReferences}`} />
                <MiniDetail label="即将到期" value={`${maintenanceSummary.expiringSoon}`} />
              </div>
              <div className="flex flex-wrap gap-2">
                {maintenanceSummary.deferredActions.map((action) => (
                  <Badge key={action} variant="outline">
                    {action}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

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
                  {binding.sourceBatchId ? (
                    <div className="mr-auto flex gap-2">
                      <form action={freezeMasterDataRecordAction}>
                        <input name="employee_id" type="hidden" value={binding.employeeId} />
                        <Button size="sm" variant="outline" type="submit">
                          冻结
                        </Button>
                      </form>
                      <form action={unfreezeMasterDataRecordAction}>
                        <input name="employee_id" type="hidden" value={binding.employeeId} />
                        <Button size="sm" variant="outline" type="submit">
                          解冻
                        </Button>
                      </form>
                    </div>
                  ) : null}
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

function MiniInput({
  label,
  name,
  required,
}: {
  label: string
  name: string
  required?: boolean
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="font-medium">{label}</span>
      <Input name={name} required={required} />
    </label>
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
