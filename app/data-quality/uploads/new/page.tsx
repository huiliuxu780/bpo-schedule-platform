import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { ImportCenterTemplateManagementPanel } from "@/components/import-center-template-management-panel"
import { ImportCenterUploadForm } from "@/components/import-center-upload-form"
import {
  type ImportFieldMappingTemplate,
  buildImportFieldMappingTemplatesUrl,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

type ImportUploadWorkspacePageProps = {
  searchParams?: Promise<{
    templateId?: string
    upload?: string
    reason?: string
    batch?: string
  }>
}

type ApiResult<T> = {
  data: T | null
  error: string | null
}

export default async function ImportUploadWorkspacePage({
  searchParams,
}: ImportUploadWorkspacePageProps) {
  const query = await searchParams
  const templateResult = await fetchImportFieldMappingTemplates()
  const templates = templateResult.data ?? []

  return (
    <AppShell title="CSV 上传" searchPlaceholder="搜索模板、字段或批次">
      <main className="grid flex-1 auto-rows-max gap-4 overflow-x-hidden overflow-y-auto px-4 py-4 lg:px-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3">
                <Button asChild size="sm" variant="outline">
                  <Link href="/data-quality">
                    <ArrowLeft data-icon="inline-start" />
                    返回导入中心
                  </Link>
                </Button>
              </div>
              <CardTitle className="text-lg">CSV 上传工作区</CardTitle>
              <CardDescription className="mt-1">
                独立发起 CSV 导入，提交到现有上传接口并生成接入批次
              </CardDescription>
            </div>
            <Badge variant="outline">单批上传</Badge>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-3">
            <HeaderItem label="上传入口" value="列表页、模板详情页" />
            <HeaderItem label="模板预选" value={query?.templateId ?? "可手动选择"} />
            <HeaderItem label="处理边界" value="不做审批、导出、批量" />
          </CardContent>
        </Card>

        <Tabs defaultValue="upload">
          <TabsList className="w-full justify-start overflow-x-auto md:w-fit">
            <TabsTrigger value="upload">上传 CSV</TabsTrigger>
            <TabsTrigger value="templates">字段映射模板</TabsTrigger>
          </TabsList>
          <TabsContent value="upload">
            <ImportCenterUploadForm
              resultRedirectTo="/data-quality/uploads/new"
              selectedTemplateId={query?.templateId}
              templateError={templateResult.error}
              templates={templates}
              uploadBatchId={query?.batch}
              uploadReason={query?.reason}
              uploadStatus={query?.upload}
            />
          </TabsContent>
          <TabsContent value="templates">
            <ImportCenterTemplateManagementPanel
              templateError={templateResult.error}
              templates={templates}
            />
          </TabsContent>
        </Tabs>
      </main>
    </AppShell>
  )
}

function HeaderItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-md border px-3 py-2">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="truncate text-sm font-medium">{value}</div>
    </div>
  )
}

async function fetchImportFieldMappingTemplates(): Promise<
  ApiResult<ImportFieldMappingTemplate[]>
> {
  try {
    const response = await fetch(buildImportFieldMappingTemplatesUrl(), {
      cache: "no-store",
    })

    if (!response.ok) {
      return {
        data: [],
        error: `字段映射模板 API 返回 ${response.status}`,
      }
    }

    const payload = (await response.json()) as {
      items?: ImportFieldMappingTemplate[]
    }

    return {
      data: Array.isArray(payload.items) ? payload.items : [],
      error: null,
    }
  } catch (error) {
    return {
      data: [],
      error: formatApiError(error),
    }
  }
}

function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return "本地 API 暂不可用"
}
