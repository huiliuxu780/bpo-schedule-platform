import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft, Ban, Save, Upload } from "lucide-react"

import {
  deactivateImportFieldMappingTemplateAction,
  updateImportFieldMappingTemplateAction,
} from "@/app/data-quality/actions"
import { AppShell } from "@/components/app-shell"
import {
  type ImportFieldMappingTemplate,
  buildImportFieldMappingTemplateDetailUrl,
  buildImportFieldMappingTemplateUploadHref,
  buildImportUploadWorkspaceHref,
  formatFieldMappingTemplateSummary,
  formatImportFileType,
  summarizeImportFieldMappingTemplateActionNotice,
  summarizeImportFieldMappingTemplateDetail,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamic = "force-dynamic"

type FieldMappingTemplatePageProps = {
  params: Promise<{
    templateId: string
  }>
  searchParams?: Promise<{
    template?: string
    action?: string
    batchId?: string
    reason?: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function FieldMappingTemplatePage({
  params,
  searchParams,
}: FieldMappingTemplatePageProps) {
  const routeParams = await params
  const query = await searchParams
  const templateId = decodeURIComponent(routeParams.templateId)
  const sourceBatchId = query?.batchId
  const templateResult = await fetchImportFieldMappingTemplate(templateId)
  const template = templateResult.data
  const actionNotice = summarizeImportFieldMappingTemplateActionNotice({
    status: query?.template,
    action: query?.action,
    reason: query?.reason,
    templateId,
  })

  return (
    <AppShell title="字段映射模板" searchPlaceholder="搜索模板、字段或文件类型">
      <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
        <TemplateHeader
          sourceBatchId={sourceBatchId}
          template={template}
          templateId={templateId}
        />

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

        {templateResult.error ? (
          <TemplateReadError error={templateResult.error} templateId={templateId} />
        ) : template ? (
          <TemplateDetailWorkspace template={template} />
        ) : (
          <TemplateReadError error="字段映射模板不存在" templateId={templateId} />
        )}
      </main>
    </AppShell>
  )
}

function TemplateDetailWorkspace({ template }: { template: ImportFieldMappingTemplate }) {
  const summary = summarizeImportFieldMappingTemplateDetail(template)

  return (
    <section id="template-detail-workspace" className="grid gap-4">
      <Tabs defaultValue="overview" className="grid gap-4">
        <TabsList className="w-full justify-start overflow-x-auto md:w-fit">
          {summary.workspaceTabs.map((tab) => (
            <TabsTrigger key={tab.key} value={tab.key}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="overview" className="m-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">模板总览</CardTitle>
              <p className="text-sm text-muted-foreground">
                当前模板的文件类型、字段覆盖和维护状态定位
              </p>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <HeaderMetric
                label="映射字段"
                value={summary.mappedFieldCount.toLocaleString("zh-CN")}
              />
              <HeaderMetric label="维护状态" value={summary.statusLabel} />
              <HeaderMetric
                label="文件类型"
                value={formatImportFileType(template.file_type)}
              />
              <div className="rounded-md border bg-muted/30 p-3 md:col-span-3">
                <div className="text-xs text-muted-foreground">字段摘要</div>
                <p className="mt-1 text-sm font-medium">{summary.summaryText}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="maintenance" className="m-0 grid gap-4">
          <TemplateUpdateCard template={template} />
          <TemplateControlCard template={template} />
        </TabsContent>
        <TabsContent value="mapping" className="m-0">
          <TemplateMappingTable template={template} />
        </TabsContent>
      </Tabs>
    </section>
  )
}

function TemplateHeader({
  sourceBatchId,
  template,
  templateId,
}: {
  sourceBatchId?: string
  template: ImportFieldMappingTemplate | null
  templateId: string
}) {
  const uploadHref =
    template && sourceBatchId
      ? buildImportFieldMappingTemplateUploadHref(sourceBatchId, template.template_id)
      : template
        ? buildImportUploadWorkspaceHref({ templateId: template.template_id })
        : null

  return (
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
          <CardTitle className="text-lg">
            {template?.template_name ?? "字段映射模板详情"}
          </CardTitle>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{templateId}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          {template ? (
            <Badge variant={template.is_active ? "secondary" : "outline"}>
              {template.is_active ? "启用" : "停用"}
            </Badge>
          ) : null}
          {template ? (
            <Badge variant="outline">{formatImportFileType(template.file_type)}</Badge>
          ) : null}
          {template?.is_active && uploadHref ? (
            <Button asChild size="sm">
              <Link href={uploadHref}>
                <Upload data-icon="inline-start" />
                用此模板上传
              </Link>
            </Button>
          ) : null}
        </div>
      </CardHeader>
      {template ? (
        <CardContent className="grid gap-3 md:grid-cols-3">
          <HeaderMetric
            label="映射字段"
            value={Object.keys(template.field_mapping).length.toLocaleString("zh-CN")}
          />
          <HeaderMetric label="创建人" value={template.created_by} />
          <HeaderMetric label="创建时间" value={formatTemplateCreatedAt(template.created_at)} />
        </CardContent>
      ) : null}
    </Card>
  )
}

function TemplateUpdateCard({ template }: { template: ImportFieldMappingTemplate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">模板维护</CardTitle>
        <p className="text-sm text-muted-foreground">
          维护模板名称和来源字段到标准字段的映射关系
        </p>
      </CardHeader>
      <CardContent>
        <form action={updateImportFieldMappingTemplateAction} className="grid gap-4">
          <input name="template_id" type="hidden" value={template.template_id} />
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
            <Field label="模板名称">
              <Input
                name="template_name"
                defaultValue={template.template_name}
                required
              />
            </Field>
            <Field label="文件类型">
              <Input defaultValue={formatImportFileType(template.file_type)} disabled />
            </Field>
          </div>
          <Field label="字段映射 JSON">
            <textarea
              name="field_mapping"
              defaultValue={JSON.stringify(template.field_mapping, null, 2)}
              className="min-h-56 w-full rounded-lg border border-input bg-background px-2.5 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              required
            />
          </Field>
          <div className="flex justify-end">
            <Button type="submit">
              <Save data-icon="inline-start" />
              保存模板
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function TemplateMappingTable({ template }: { template: ImportFieldMappingTemplate }) {
  const mappingPairs = Object.entries(template.field_mapping)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">字段映射明细</CardTitle>
        <p className="text-sm text-muted-foreground">
          {formatFieldMappingTemplateSummary(template)}
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>来源字段</TableHead>
              <TableHead>标准字段</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappingPairs.map(([sourceField, standardField]) => (
              <TableRow key={`${template.template_id}-${sourceField}`}>
                <TableCell className="font-mono text-xs">{sourceField}</TableCell>
                <TableCell className="font-mono text-xs">{standardField}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function TemplateControlCard({ template }: { template: ImportFieldMappingTemplate }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">模板状态</CardTitle>
        <p className="text-sm text-muted-foreground">
          查看模板字段、启用状态和停用操作。
        </p>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3">
          <InfoItem label="字段范围" value="模板名称、字段映射 JSON、启用状态" />
          <InfoItem label="当前状态" value={template.is_active ? "启用" : "停用"} />
        </div>
        {template.is_active ? (
          <form action={deactivateImportFieldMappingTemplateAction} className="grid gap-3">
            <input name="template_id" type="hidden" value={template.template_id} />
            <p className="text-sm text-muted-foreground">
              停用后，该模板不会作为启用模板推荐；历史批次记录不受影响。
            </p>
            <Button type="submit" variant="destructive">
              <Ban data-icon="inline-start" />
              停用模板
            </Button>
          </form>
        ) : (
          <div className="rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground">
            当前模板已停用。
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TemplateReadError({
  error,
  templateId,
}: {
  error: string
  templateId: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">模板读取失败</CardTitle>
        <p className="mt-1 font-mono text-xs text-muted-foreground">{templateId}</p>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="text-sm text-muted-foreground">{error}</p>
        <div>
          <Button asChild size="sm" variant="outline">
            <Link href="/data-quality/uploads/new">返回 CSV 上传</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
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

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border bg-muted/30 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 truncate font-mono text-xs font-medium">{value}</div>
    </div>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  )
}

function formatTemplateCreatedAt(value: string): string {
  return value.replace("T", " ").slice(0, 16)
}

async function fetchImportFieldMappingTemplate(
  templateId: string
): Promise<ApiResult<ImportFieldMappingTemplate>> {
  try {
    const response = await fetch(buildImportFieldMappingTemplateDetailUrl(templateId), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: null,
        error: `字段映射模板 服务返回 ${response.status}`,
      }
    }

    return {
      data: (await response.json()) as ImportFieldMappingTemplate,
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: formatApiError(error),
    }
  }
}

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "api_unavailable"
}
