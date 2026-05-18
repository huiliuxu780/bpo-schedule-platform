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
import { Separator } from "@/components/ui/separator"
import { getImportContractDrilldown } from "@/lib/import-drilldown"
import { fallbackProductionMvpContracts } from "@/lib/production-mvp-contracts"

export default function PersonnelScheduleContractPage() {
  const contract = fallbackProductionMvpContracts.personnelSchedule
  const drilldown = getImportContractDrilldown(
    "personnel-schedules",
    fallbackProductionMvpContracts
  )

  return (
    <AppShell title="人员级排班合同" searchPlaceholder="搜索排班字段或校验规则">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">人员级排班合同</h1>
            <p className="text-sm text-muted-foreground">
              先保留人员级明细，再生成 0.5h 时段排班汇总，用于后续预测和实际登录状态对比。
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/production-mvp">返回生产雏形</Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="实体" value={contract.entity} />
          <Metric title="字段" value={`${drilldown?.fieldCount ?? 0}`} />
          <Metric title="必填" value={`${drilldown?.requiredFieldCount ?? 0}`} />
          <Metric title="展开粒度" value={`${contract.expansion.interval_minutes}m`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ListCard title="人员排班字段" values={contract.fields} />
          <ListCard title="必填字段" values={contract.required_fields} />
          <ListCard title="生成字段" values={contract.generated_fields} />
          <ListCard title="校验规则" values={contract.validation_rules} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>0.5h 展开结果</CardTitle>
            <CardDescription>
              展开结果仍是本地合同，不代表真实排班计算或数据库写入能力。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            <ListCard title="group_by" values={contract.expansion.group_by} compact />
            <ListCard title="target_fields" values={contract.expansion.target_fields} compact />
            <ListCard title="traceability_fields" values={contract.expansion.traceability_fields} compact />
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
        <CardTitle className="break-words text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
    </Card>
  )
}

function ListCard({
  title,
  values,
  compact,
}: {
  title: string
  values: string[]
  compact?: boolean
}) {
  return (
    <Card className={compact ? "border-dashed" : undefined}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <Badge key={value} variant="outline" className="max-w-full break-all">
              {value}
            </Badge>
          ))}
        </div>
        <Separator className="mt-4" />
      </CardContent>
    </Card>
  )
}
