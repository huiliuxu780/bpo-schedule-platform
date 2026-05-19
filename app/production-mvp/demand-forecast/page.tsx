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
  fallbackDemandForecastContract,
  summarizeDemandForecastContract,
} from "@/lib/demand-forecast-contract"

export default function DemandForecastContractPage() {
  const contract = fallbackDemandForecastContract
  const summary = summarizeDemandForecastContract(contract)

  return (
    <AppShell title="需求预测导入合同" searchPlaceholder="搜索预测字段或校验规则">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">需求预测导入合同</h1>
            <p className="text-sm text-muted-foreground">
              独立展示预测需求字段，按 0.5h、职场、项目、技能组和等级对齐人员排班。
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/production-mvp">返回生产雏形</Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="字段" value={`${summary.fieldCount}`} />
          <Metric title="必填" value={`${summary.requiredFieldCount}`} />
          <Metric title="校验规则" value={`${summary.validationRuleCount}`} />
          <Metric title="粒度" value={`${contract.intervalMinutes}m`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ListCard title="预测字段" values={contract.fields} />
          <ListCard title="必填字段" values={contract.requiredFields} />
          <ListCard title="对齐键" values={contract.comparisonKeys} />
          <ListCard title="校验规则" values={contract.validationRules} />
          <ListCard title="暂不实现动作" values={contract.deferredActions} />
        </section>
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

function ListCard({ title, values }: { title: string; values: string[] }) {
  return (
    <Card>
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
      </CardContent>
    </Card>
  )
}
