import { FileText } from "lucide-react"

import {
  type ImportFieldMappingTemplate,
  formatFieldMappingTemplateSummary,
  formatImportFileType,
  summarizeImportFieldMappingTemplates,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ImportCenterTemplateManagementPanelProps = {
  templates: ImportFieldMappingTemplate[]
  templateError?: string | null
}

export function ImportCenterTemplateManagementPanel({
  templates,
  templateError,
}: ImportCenterTemplateManagementPanelProps) {
  const summary = summarizeImportFieldMappingTemplates(templates)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">字段映射模板</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            只读查看模板库存、覆盖类型和字段映射摘要
          </p>
        </div>
        <Badge variant={templateError ? "destructive" : "outline"}>
          {templateError ? "读取失败" : `${summary.totalTemplates} 个模板`}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <section className="grid gap-3 md:grid-cols-4">
          <Metric label="启用模板" value={summary.activeTemplates} />
          <Metric label="停用模板" value={summary.inactiveTemplates} />
          <Metric label="覆盖类型" value={summary.coveredFileTypes} />
          <Metric label="映射字段" value={summary.totalMappedFields} />
        </section>

        {templateError ? (
          <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
            字段映射模板读取失败：{templateError}
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
            暂无字段映射模板。上传时仍可手填字段映射 JSON。
          </div>
        ) : (
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {templates.map((template) => (
              <TemplateCard key={template.template_id} template={template} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TemplateCard({ template }: { template: ImportFieldMappingTemplate }) {
  const mappedFieldCount = Object.keys(template.field_mapping).length

  return (
    <div className="grid gap-3 rounded-md border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{template.template_name}</div>
          <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {template.template_id}
          </div>
        </div>
        <Badge variant={template.is_active ? "secondary" : "outline"}>
          {template.is_active ? "启用" : "停用"}
        </Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{formatImportFileType(template.file_type)}</Badge>
        <span>{mappedFieldCount} 个字段</span>
        <span>{template.created_by}</span>
      </div>
      <p className="line-clamp-2 text-xs text-muted-foreground">
        {formatFieldMappingTemplateSummary(template)}
      </p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <FileText className="size-3.5" />
        <span>{formatTemplateCreatedAt(template.created_at)}</span>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-lg font-semibold">
        {value.toLocaleString("zh-CN")}
      </div>
    </div>
  )
}

function formatTemplateCreatedAt(value: string): string {
  return value.replace("T", " ").slice(0, 16)
}
