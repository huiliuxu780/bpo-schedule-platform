import Link from "next/link"

import { createDemandForecastImportAction } from "@/app/import-batches/new/actions"
import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type PageProps = {
  searchParams: Promise<{ result?: string }>
}

export default async function NewImportBatchPage({ searchParams }: PageProps) {
  const { result } = await searchParams

  return (
    <AppShell title="需求预测导入" searchPlaceholder="搜索批次、模板或错误码">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/import-batches">导入批次</Link> / 新增
            </div>
            <h1 className="text-lg font-semibold">需求预测 CSV 导入</h1>
            <p className="text-sm text-muted-foreground">
              选择需求预测 CSV 文件，系统将解析字段、记录批次结果和失败行。
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/import-batches">返回批次</Link>
          </Button>
        </div>

        {result ? (
          <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {result === "missing-file" ? "请选择 CSV 文件后再提交。" : "导入提交失败，请检查文件内容。"}
          </div>
        ) : null}

        <form action={createDemandForecastImportAction} className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>文件信息</CardTitle>
              <CardDescription>
                CSV 需要包含业务日期、职场、项目、时段和预测人数。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[1fr_16rem]">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">CSV 文件</span>
                <Input name="csv_file" type="file" accept=".csv,text/csv" required />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">提交人</span>
                <Input name="uploaded_by" defaultValue="数据管理员" />
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>字段要求</CardTitle>
              <CardDescription>
                表头需使用英文编码，便于批次结果追溯到字段和行号。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
              {[
                "business_date",
                "workplace_id",
                "project_id",
                "interval_start",
                "interval_end",
                "forecast_agents",
              ].map((field) => (
                <div key={field} className="rounded-md border px-3 py-2 font-mono text-xs">
                  {field}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href="/import-batches">取消</Link>
            </Button>
            <Button type="submit">提交导入</Button>
          </div>
        </form>
      </main>
    </AppShell>
  )
}
