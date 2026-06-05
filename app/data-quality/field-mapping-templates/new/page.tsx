import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft, Plus } from "lucide-react"

import { createImportFieldMappingTemplateAction } from "@/app/data-quality/actions"
import { AppShell } from "@/components/app-shell"
import {
  type ImportFileType,
  formatImportFileType,
  summarizeImportFieldMappingTemplateActionNotice,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export const dynamic = "force-dynamic"

type FieldMappingTemplateCreatePageProps = {
  searchParams?: Promise<{
    template?: string
    action?: string
    reason?: string
  }>
}

const fileTypes: ImportFileType[] = [
  "master_data",
  "personnel_schedule",
  "demand_forecast",
  "login_log",
  "status_log",
]

export default async function FieldMappingTemplateCreatePage({
  searchParams,
}: FieldMappingTemplateCreatePageProps) {
  const query = await searchParams
  const actionNotice = summarizeImportFieldMappingTemplateActionNotice({
    status: query?.template,
    action: query?.action,
    reason: query?.reason,
    templateId: "新模板",
  })

  return (
    <AppShell
      title="新增字段映射模板"
      searchPlaceholder="搜索模板、字段或文件类型"
      breadcrumbItems={[
        { label: "导入批次", href: "/data-quality" },
        { label: "字段映射模板", href: "/data-quality/field-mapping-templates/new" },
        { label: "新增字段映射模板" },
      ]}
    >
      <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3">
                <Button asChild size="sm" variant="outline">
                  <Link href="/data-quality/uploads/new">
                    <ArrowLeft data-icon="inline-start" />
                    返回 CSV 上传
                  </Link>
                </Button>
              </div>
              <CardTitle className="text-lg">新增字段映射模板</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                保存常用 CSV 表头到标准字段的映射，上传时可直接复用
              </p>
            </div>
            <Badge variant="outline">模板新增</Badge>
          </CardHeader>
        </Card>

        {actionNotice ? (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
              <div>
                <CardTitle className="text-base">{actionNotice.title}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {actionNotice.detail}
                </p>
              </div>
              <Badge
                variant={
                  actionNotice.tone === "success" ? "secondary" : "destructive"
                }
              >
                {actionNotice.tone === "success" ? "成功" : "失败"}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {actionNotice.nextAction}
              </p>
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">模板信息</CardTitle>
              <p className="text-sm text-muted-foreground">
                模板 ID 创建后不可作为本页字段修改；如需改 ID，请新增另一个模板
              </p>
            </CardHeader>
            <CardContent>
              <form action={createImportFieldMappingTemplateAction} className="grid gap-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="模板 ID">
                    <Input
                      name="template_id"
                      placeholder="TPL-MD-20260603-001"
                      required
                    />
                  </Field>
                  <Field label="模板名称">
                    <Input
                      name="template_name"
                      placeholder="主数据 source_key 模板"
                      required
                    />
                  </Field>
                  <Field label="文件类型">
                    <select
                      name="file_type"
                      defaultValue="master_data"
                      className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      {fileTypes.map((fileType) => (
                        <option key={fileType} value={fileType}>
                          {formatImportFileType(fileType)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="创建人">
                    <Input name="created_by" defaultValue="operator" required />
                  </Field>
                </div>
                <Field label="字段映射 JSON">
                  <textarea
                    name="field_mapping"
                    defaultValue={'{\n  "source_key": "source_key"\n}'}
                    className="min-h-56 w-full rounded-lg border border-input bg-background px-2.5 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    required
                  />
                </Field>
                <div className="flex justify-end">
                  <Button type="submit">
                    <Plus data-icon="inline-start" />
                    创建模板
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </AppShell>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  )
}
