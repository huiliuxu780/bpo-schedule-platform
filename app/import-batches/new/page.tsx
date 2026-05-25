import Link from "next/link"

import {
  createDemandForecastImportAction,
  createPersonnelScheduleImportAction,
} from "@/app/import-batches/new/actions"
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
  searchParams: Promise<{ result?: string; type?: string }>
}

export default async function NewImportBatchPage({ searchParams }: PageProps) {
  const { result, type } = await searchParams
  const importType = type === "personnel-schedule" ? "personnel-schedule" : "demand-forecast"
  const config =
    importType === "personnel-schedule"
      ? {
          title: "人员级排班 CSV 导入",
          description: "选择人员级排班 CSV 文件，系统将解析字段、记录批次结果和失败行。",
          cardDescription: "CSV 需要包含员工、业务日期、职场、供应商、项目、班次和起止时间。",
          uploadedBy: "排班运营",
          action: createPersonnelScheduleImportAction,
          fields: [
            "schedule_detail_id",
            "schedule_version_id",
            "employee_id",
            "business_date",
            "workplace_id",
            "supplier_id",
            "project_id",
            "shift_type_id",
            "start_at",
            "end_at",
            "status",
          ],
        }
      : {
          title: "需求预测 CSV 导入",
          description: "选择需求预测 CSV 文件，系统将解析字段、记录批次结果和失败行。",
          cardDescription: "CSV 需要包含业务日期、职场、项目、时段和预测人数。",
          uploadedBy: "数据管理员",
          action: createDemandForecastImportAction,
          fields: [
            "business_date",
            "workplace_id",
            "project_id",
            "interval_start",
            "interval_end",
            "forecast_agents",
          ],
        }

  return (
    <AppShell title={config.title} searchPlaceholder="搜索批次、模板或错误码">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex max-w-3xl flex-col gap-1">
            <div className="text-xs text-muted-foreground">
              <Link href="/import-batches">导入批次</Link> / 新增
            </div>
            <h1 className="text-lg font-semibold">{config.title}</h1>
            <p className="text-sm text-muted-foreground">
              {config.description}
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

        <div className="flex flex-wrap gap-2">
          <Button asChild variant={importType === "demand-forecast" ? "default" : "outline"} size="sm">
            <Link href="/import-batches/new?type=demand-forecast">需求预测</Link>
          </Button>
          <Button asChild variant={importType === "personnel-schedule" ? "default" : "outline"} size="sm">
            <Link href="/import-batches/new?type=personnel-schedule">人员级排班</Link>
          </Button>
        </div>

        <form action={config.action} className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>文件信息</CardTitle>
              <CardDescription>
                {config.cardDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-[1fr_16rem]">
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">CSV 文件</span>
                <Input name="csv_file" type="file" accept=".csv,text/csv" required />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="font-medium">提交人</span>
                <Input name="uploaded_by" defaultValue={config.uploadedBy} />
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
              {config.fields.map((field) => (
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
