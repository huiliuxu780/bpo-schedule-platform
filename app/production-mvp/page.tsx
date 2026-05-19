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
import {
  getProductionMvpContracts,
  summarizeProductionMvpContracts,
  type FulfillmentComparisonContract,
  type MasterDataImportContract,
  type PersonnelScheduleImportContract,
} from "@/lib/production-mvp-contracts"
import { getImportContractDrilldowns } from "@/lib/import-drilldown"

export default async function ProductionMvpPage() {
  const contracts = await getProductionMvpContracts()
  const summary = summarizeProductionMvpContracts(contracts)
  const drilldowns = getImportContractDrilldowns(contracts)

  return (
    <AppShell title="生产雏形" searchPlaceholder="搜索合同、字段或异常规则">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <h1 className="text-lg font-semibold">生产雏形</h1>
            <p className="text-sm text-muted-foreground">
              汇总生产雏形第一批本地合同：主数据、人员级排班、0.5h 时段汇总，以及预测/排班/登录/状态对比。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/progress">总进度</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/gaps">生产缺口</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/data-foundation">数据底座准备</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/alignment-readiness">
                预测与实际对齐
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/anomaly-triage-readiness">
                异常识别准备
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/production-mvp/acceptance-checklist">验收清单</Link>
            </Button>
            <Badge variant="outline">本地只读合同</Badge>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <SummaryCard
            title="合同块"
            value={`${summary.contractCount}`}
            description="主数据、排班、履约对比"
          />
          <SummaryCard
            title="对比来源"
            value={`${summary.sourceCount}`}
            description="预测、排班、登录、状态"
          />
          <SummaryCard
            title="异常规则"
            value={`${summary.anomalyRuleCount}`}
            description="第一批识别口径"
          />
          <SummaryCard
            title="排班粒度"
            value={summary.hasHalfHourIntervalAggregation ? "0.5h" : "待定"}
            description={
              summary.hasPersonnelScheduleDetail
                ? "人员明细 + 时段汇总"
                : "缺少人员明细"
            }
          />
        </section>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>合同 drilldown</CardTitle>
                <CardDescription>
                  从总览进入具体合同验收；均为本地只读展示，不执行真实导入。
                </CardDescription>
              </div>
              <Badge variant="outline">3 个入口</Badge>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 lg:grid-cols-3">
            {drilldowns.map((row) => (
              <div key={row.id} className="rounded-lg border p-3">
                <div className="flex min-h-24 flex-col justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium">{row.title}</div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {row.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="secondary">{row.grain}</Badge>
                    <Button asChild size="sm" variant="outline">
                      <Link href={row.href}>查看详情</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <div className="rounded-lg border border-dashed p-3">
              <div className="flex min-h-24 flex-col justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">需求预测导入合同</div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    独立验收 0.5h 预测需求、技能组、等级和预测人数口径。
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge variant="secondary">0.5h 预测需求</Badge>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/production-mvp/demand-forecast">查看详情</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <MasterDataCard contract={contracts.masterData} />
          <PersonnelScheduleCard contract={contracts.personnelSchedule} />
        </section>

        <FulfillmentComparisonCard contract={contracts.fulfillmentComparison} />

        <Card>
          <CardHeader>
            <CardTitle>延期生产能力</CardTitle>
            <CardDescription>
              这些能力进入生产雏形 PRD 范围，但本批只做合同展示，不做实现。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BadgeList values={summary.deferredCapabilities} />
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function SummaryCard({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}

function MasterDataCard({ contract }: { contract: MasterDataImportContract }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>主数据导入合同</CardTitle>
            <CardDescription>
              坐席、职场、供应商、项目、绑定关系和班次类型字段口径。
            </CardDescription>
          </div>
          <Badge variant="secondary">{contract.version}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>对象</TableHead>
              <TableHead>主键</TableHead>
              <TableHead>字段</TableHead>
              <TableHead>必填</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contract.entities.map((entity) => (
              <TableRow key={entity.entity}>
                <TableCell className="font-medium">{entity.entity}</TableCell>
                <TableCell>{entity.primary_key.join(", ")}</TableCell>
                <TableCell>{entity.fields.length}</TableCell>
                <TableCell>{entity.required_fields.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Separator />
        <ContractSection
          title="批次字段"
          values={contract.batch_fields}
          limit={8}
        />
        <ContractSection
          title="质量错误码"
          values={contract.quality_error_codes}
          limit={8}
        />
      </CardContent>
    </Card>
  )
}

function PersonnelScheduleCard({
  contract,
}: {
  contract: PersonnelScheduleImportContract
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>人员级排班合同</CardTitle>
            <CardDescription>
              先定义人员明细，再展开为 0.5h 时段排班汇总。
            </CardDescription>
          </div>
          <Badge variant="secondary">{contract.entity}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <MiniMetric label="主键" value={contract.primary_key.join(", ")} />
          <MiniMetric label="字段" value={`${contract.fields.length}`} />
          <MiniMetric label="必填" value={`${contract.required_fields.length}`} />
        </div>
        <Separator />
        <ContractSection title="人员排班字段" values={contract.fields} limit={10} />
        <ContractSection
          title="校验规则"
          values={contract.validation_rules}
          limit={8}
        />
        <div className="rounded-lg border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-medium">0.5h 展开结果</div>
            <Badge variant="outline">
              {contract.expansion.interval_minutes} 分钟
            </Badge>
          </div>
          <div className="mt-3 flex flex-col gap-3">
            <ContractSection
              title="group_by"
              values={contract.expansion.group_by}
              limit={8}
            />
            <ContractSection
              title="target_fields"
              values={contract.expansion.target_fields}
              limit={10}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FulfillmentComparisonCard({
  contract,
}: {
  contract: FulfillmentComparisonContract
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>预测/排班/登录/状态对比合同</CardTitle>
            <CardDescription>
              用同一业务日期、职场、项目和 0.5h 时段对齐汇总，并保留人员级复核键。
            </CardDescription>
          </div>
          <Badge variant="secondary">{contract.version}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-3 rounded-lg border p-3">
            <div className="text-sm font-medium">四类来源</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>来源</TableHead>
                  <TableHead>粒度</TableHead>
                  <TableHead>字段</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contract.sources.map((source) => (
                  <TableRow key={source.source}>
                    <TableCell className="font-medium">{source.source}</TableCell>
                    <TableCell>{source.grain}</TableCell>
                    <TableCell>{source.fields.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-col gap-4 rounded-lg border p-3">
            <ContractSection
              title="时段对齐键"
              values={contract.comparison_keys}
              limit={6}
            />
            <ContractSection
              title="人员级追溯键"
              values={contract.person_level_keys}
              limit={6}
            />
            <ContractSection
              title="状态字典字段"
              values={contract.status_dictionary_fields}
              limit={5}
            />
          </div>
        </div>
        <Separator />
        <div className="grid gap-3 lg:grid-cols-2">
          {contract.anomaly_rules.map((rule) => (
            <div key={rule.code} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="text-sm font-medium">{rule.code}</div>
                <Badge variant="outline">{rule.review_owner}</Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {rule.condition}
              </p>
              <div className="mt-3">
                <BadgeList values={rule.compares} />
              </div>
            </div>
          ))}
        </div>
        <ContractSection title="复核字段" values={contract.review_fields} limit={8} />
      </CardContent>
    </Card>
  )
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 break-words text-sm font-medium">{value}</div>
    </div>
  )
}

function ContractSection({
  title,
  values,
  limit,
}: {
  title: string
  values: string[]
  limit: number
}) {
  const visibleValues = values.slice(0, limit)
  const hiddenCount = Math.max(values.length - visibleValues.length, 0)

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      <BadgeList
        values={
          hiddenCount === 0
            ? visibleValues
            : [...visibleValues, `+${hiddenCount}`]
        }
      />
    </div>
  )
}

function BadgeList({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {values.map((value) => (
        <Badge key={value} variant="outline" className="max-w-full break-all">
          {value}
        </Badge>
      ))}
    </div>
  )
}
