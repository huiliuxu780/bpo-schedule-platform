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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getImportContractDrilldown } from "@/lib/import-drilldown"
import { fallbackProductionMvpContracts } from "@/lib/production-mvp-contracts"

export default function FulfillmentComparisonContractPage() {
  const contract = fallbackProductionMvpContracts.fulfillmentComparison
  const drilldown = getImportContractDrilldown(
    "fulfillment-comparison",
    fallbackProductionMvpContracts
  )

  return (
    <AppShell title="履约对比合同" searchPlaceholder="搜索来源、异常或对齐键">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">履约对比合同</h1>
            <p className="text-sm text-muted-foreground">
              预测、排班、登录和状态日志按同一业务日期、职场、项目和 0.5h 时段对齐。
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/production-mvp">返回生产雏形</Link>
          </Button>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="来源" value={`${drilldown?.entityCount ?? 0}`} />
          <Metric title="唯一字段" value={`${drilldown?.fieldCount ?? 0}`} />
          <Metric title="必填" value={`${drilldown?.requiredFieldCount ?? 0}`} />
          <Metric title="异常规则" value={`${contract.anomaly_rules.length}`} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>四类来源</CardTitle>
            <CardDescription>本地只读合同展示，不执行真实对比计算。</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>来源</TableHead>
                  <TableHead>粒度</TableHead>
                  <TableHead>字段</TableHead>
                  <TableHead>必填</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contract.sources.map((source) => (
                  <TableRow key={source.source}>
                    <TableCell className="font-medium">{source.source}</TableCell>
                    <TableCell>{source.grain}</TableCell>
                    <TableCell>{source.fields.length}</TableCell>
                    <TableCell>{source.required_fields.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-3">
          <ListCard title="时段对齐键" values={contract.comparison_keys} />
          <ListCard title="人员级追溯键" values={contract.person_level_keys} />
          <ListCard title="状态字典字段" values={contract.status_dictionary_fields} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>异常规则</CardTitle>
            <CardDescription>
              暴露识别口径和复核负责人，不实现生产异常计算或复核提交。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-2">
            {contract.anomaly_rules.map((rule) => (
              <div key={rule.code} className="rounded-lg border p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium">{rule.code}</div>
                  <Badge variant="outline">{rule.review_owner}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{rule.condition}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {rule.compares.map((item) => (
                    <Badge key={item} variant="secondary">
                      {item}
                    </Badge>
                  ))}
                </div>
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
