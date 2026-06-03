import Link from "next/link"
import { FileText } from "lucide-react"

import {
  type ImportFieldMappingTemplate,
  type ImportFileType,
  type ImportTemplateFitDetail,
  type ImportTemplateFitOption,
  buildImportFieldMappingTemplateNewWorkspaceHref,
  buildImportFieldMappingTemplateWorkspaceHref,
  formatFieldMappingTemplateSummary,
  formatImportFileType,
  summarizeImportFieldMappingTemplates,
  summarizeImportTemplateFitDetail,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ImportCenterTemplateManagementPanelProps = {
  templates: ImportFieldMappingTemplate[]
  templateError?: string | null
  selectedFileType?: ImportFileType | null
}

export function ImportCenterTemplateManagementPanel({
  templates,
  templateError,
  selectedFileType,
}: ImportCenterTemplateManagementPanelProps) {
  const summary = summarizeImportFieldMappingTemplates(templates)
  const fitDetail = selectedFileType
    ? summarizeImportTemplateFitDetail(selectedFileType, templates, templateError)
    : null
  const fitOptionsByTemplateId = new Map(
    fitDetail?.templateOptions.map((option) => [option.templateId, option]) ?? []
  )
  const orderedTemplates = selectedFileType
    ? [...templates].sort((left, right) => {
        if (left.file_type === selectedFileType && right.file_type !== selectedFileType) {
          return -1
        }
        if (left.file_type !== selectedFileType && right.file_type === selectedFileType) {
          return 1
        }
        return left.template_id.localeCompare(right.template_id)
      })
    : templates

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <div>
          <CardTitle className="text-base">字段映射模板</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            按当前批次文件类型查看模板适配、字段覆盖和映射明细
          </p>
        </div>
        <Badge variant={templateError ? "destructive" : "outline"}>
          {templateError ? "读取失败" : `${summary.totalTemplates} 个模板`}
        </Badge>
        <Button asChild size="sm" variant="outline">
          <Link href={buildImportFieldMappingTemplateNewWorkspaceHref()}>
            新增模板
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <section className="grid gap-3 md:grid-cols-4">
          <Metric label="启用模板" value={summary.activeTemplates} />
          <Metric label="停用模板" value={summary.inactiveTemplates} />
          <Metric label="覆盖类型" value={summary.coveredFileTypes} />
          <Metric label="映射字段" value={summary.totalMappedFields} />
        </section>

        {fitDetail ? <TemplateFitDetailCard detail={fitDetail} /> : null}

        {templateError ? (
          <div className="rounded-md border border-dashed px-3 py-3 text-sm text-muted-foreground">
            字段映射模板读取失败：{templateError}
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
            暂无字段映射模板。上传时仍可手填字段映射 JSON。
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {orderedTemplates.map((template) => (
              <TemplateCard
                key={template.template_id}
                fitOption={fitOptionsByTemplateId.get(template.template_id) ?? null}
                isRecommended={fitDetail?.recommendedTemplateId === template.template_id}
                selectedFileType={selectedFileType}
                template={template}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function TemplateFitDetailCard({ detail }: { detail: ImportTemplateFitDetail }) {
  return (
    <div className="grid gap-3 rounded-md border bg-muted/20 p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium">模板适配</div>
          <p className="mt-1 text-sm text-muted-foreground">{detail.title}</p>
        </div>
        <Badge variant={detail.status === "matched" ? "secondary" : "outline"}>
          {formatImportFileType(detail.fileType)}
        </Badge>
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        <Metric label="同类型模板" value={detail.matchingTemplates} />
        <Metric label="启用同类型" value={detail.activeMatchingTemplates} />
        <Metric label="推荐映射字段" value={detail.recommendedMappedFieldCount} />
        <Metric label="建议字段缺口" value={detail.missingStandardFields.length} />
      </div>
      <p className="text-sm text-muted-foreground">{detail.detail}</p>
      <div className="grid gap-3 lg:grid-cols-2">
        <FieldList title="已覆盖标准字段" fields={detail.mappedStandardFields} />
        <FieldList title="建议补齐字段" fields={detail.missingStandardFields} />
      </div>
      <p className="text-xs text-muted-foreground">{detail.nextAction}</p>
    </div>
  )
}

function TemplateCard({
  template,
  fitOption,
  isRecommended,
  selectedFileType,
}: {
  template: ImportFieldMappingTemplate
  fitOption: ImportTemplateFitOption | null
  isRecommended: boolean
  selectedFileType?: ImportFileType | null
}) {
  const mappedFieldCount = fitOption?.mappedFieldCount ?? Object.keys(template.field_mapping).length
  const mappingPairs =
    fitOption?.mappingPairs ??
    Object.entries(template.field_mapping).map(([sourceField, standardField]) => ({
      sourceField,
      standardField,
    }))

  return (
    <div className="grid gap-3 rounded-md border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium">{template.template_name}</span>
            {isRecommended ? <Badge variant="secondary">推荐模板</Badge> : null}
          </div>
          <div className="mt-1 truncate font-mono text-xs text-muted-foreground">
            {template.template_id}
          </div>
        </div>
        <Badge variant={template.is_active ? "secondary" : "outline"}>
          {template.is_active ? "启用" : "停用"}
        </Badge>
      </div>
      <div>
        <Button asChild size="sm" variant="outline">
          <Link href={buildImportFieldMappingTemplateWorkspaceHref(template.template_id)}>
            维护模板
          </Link>
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant={template.file_type === selectedFileType ? "secondary" : "outline"}>
          {formatImportFileType(template.file_type)}
        </Badge>
        <span>{mappedFieldCount} 个字段</span>
        <span>{template.created_by}</span>
      </div>
      <p className="line-clamp-2 text-xs text-muted-foreground">
        {formatFieldMappingTemplateSummary(template)}
      </p>
      {fitOption ? (
        <div className="grid gap-2">
          <FieldList title="缺口字段" fields={fitOption.missingStandardFields} compact />
        </div>
      ) : null}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>来源字段</TableHead>
            <TableHead>标准字段</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappingPairs.map((pair) => (
            <TableRow key={`${template.template_id}-${pair.sourceField}`}>
              <TableCell className="font-mono text-xs">{pair.sourceField}</TableCell>
              <TableCell className="font-mono text-xs">{pair.standardField}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <FileText className="size-3.5" />
        <span>{formatTemplateCreatedAt(template.created_at)}</span>
      </div>
    </div>
  )
}

function FieldList({
  title,
  fields,
  compact = false,
}: {
  title: string
  fields: string[]
  compact?: boolean
}) {
  return (
    <div className="grid gap-2 rounded-md border bg-background p-3">
      <div className="text-xs font-medium text-muted-foreground">{title}</div>
      {fields.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {fields.map((field) => (
            <Badge key={field} variant="outline" className="font-mono">
              {field}
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          {compact ? "暂无缺口" : "暂无字段"}
        </p>
      )}
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
