import Link from "next/link"
import { notFound } from "next/navigation"

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
  fallbackImportBatches,
  getImportBatchById,
  importBatchStatusLabel,
} from "@/lib/import-batch-history"

type PageProps = {
  params: Promise<{ batchId: string }>
}

export function generateStaticParams() {
  return fallbackImportBatches.map((batch) => ({
    batchId: batch.id,
  }))
}

export default async function ImportBatchDetailPage({ params }: PageProps) {
  const { batchId } = await params
  const batch = getImportBatchById(batchId)

  if (!batch) {
    notFound()
  }

  return (
    <AppShell title={batch.id} searchPlaceholder="搜索批次字段">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/import-batches">导入批次</Link> / {batch.id}
            </div>
            <h1 className="text-lg font-semibold">{batch.templateName}</h1>
            <p className="text-sm text-muted-foreground">
              批次详情只展示上传结果和数据质量关联，不执行重导、修复或写库。
            </p>
          </div>
          <Badge variant={batch.status === "failed" ? "destructive" : "secondary"}>
            {importBatchStatusLabel(batch.status)}
          </Badge>
        </div>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="总行数" value={`${batch.totalRows}`} description={batch.sourceFile} />
          <Metric title="成功行" value={`${batch.successRows}`} description="本地样例结果" />
          <Metric title="失败行" value={`${batch.failedRows}`} description="仅追溯展示" />
          <Metric title="警告行" value={`${batch.warningRows}`} description="需要人工查看" />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>影响对象</CardTitle>
              <CardDescription>本批次可能影响的生产雏形对象。</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {batch.affectedObjects.map((item) => (
                <Badge key={item} variant="secondary">
                  {item}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>错误与质量问题</CardTitle>
              <CardDescription>用于跳转到数据质量中心的追溯键。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">错误码</div>
                <div className="mt-1">{batch.errorCodes.length > 0 ? batch.errorCodes.join(", ") : "无"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">数据质量问题</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {batch.qualityIssueIds.length > 0
                    ? batch.qualityIssueIds.map((issueId) => (
                        <Button
                          key={issueId}
                          asChild
                          size="sm"
                          variant="outline"
                        >
                          <Link href={`/data-quality/${issueId}`}>{issueId}</Link>
                        </Button>
                      ))
                    : "无"}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>批次说明</CardTitle>
            <CardDescription>本地样例备注，不代表生产处理结果。</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {batch.note}
          </CardContent>
        </Card>
      </main>
    </AppShell>
  )
}

function Metric({
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
