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

export default function MasterDataContractPage() {
  const contract = fallbackProductionMvpContracts.masterData
  const drilldown = getImportContractDrilldown(
    "master-data",
    fallbackProductionMvpContracts
  )

  return (
    <AppShell title="主数据导入合同" searchPlaceholder="搜索主数据对象或字段">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <Header
          title="主数据导入合同"
          description="坐席、职场、供应商、项目、绑定关系和班次类型的第一阶段导入口径。"
        />

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="对象" value={`${drilldown?.entityCount ?? 0}`} />
          <Metric title="字段" value={`${drilldown?.fieldCount ?? 0}`} />
          <Metric title="必填" value={`${drilldown?.requiredFieldCount ?? 0}`} />
          <Metric title="校验规则" value={`${drilldown?.validationRuleCount ?? 0}`} />
        </section>

        <Card>
          <CardHeader>
            <CardTitle>对象字段</CardTitle>
            <CardDescription>只读合同展示，不执行真实导入或主数据写入。</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>对象</TableHead>
                  <TableHead>主键</TableHead>
                  <TableHead>字段</TableHead>
                  <TableHead>必填</TableHead>
                  <TableHead>外键</TableHead>
                  <TableHead>规则</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contract.entities.map((entity) => (
                  <TableRow key={entity.entity}>
                    <TableCell className="font-medium">{entity.entity}</TableCell>
                    <TableCell>{entity.primary_key.join(", ")}</TableCell>
                    <TableCell>{entity.fields.length}</TableCell>
                    <TableCell>{entity.required_fields.length}</TableCell>
                    <TableCell>{entity.foreign_keys?.join(", ") || "无"}</TableCell>
                    <TableCell>{entity.validation_rules.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          <ListCard title="批次字段" values={contract.batch_fields} />
          <ListCard title="失败行字段" values={contract.failure_row_fields} />
          <ListCard title="质量错误码" values={contract.quality_error_codes} />
          <ListCard title="暂不实现动作" values={fallbackProductionMvpContracts.deferredCapabilities} />
        </section>
      </main>
    </AppShell>
  )
}

function Header({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex max-w-3xl flex-col gap-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button asChild variant="outline" size="sm">
        <Link href="/production-mvp">返回生产雏形</Link>
      </Button>
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
        <Separator className="mt-4" />
      </CardContent>
    </Card>
  )
}
