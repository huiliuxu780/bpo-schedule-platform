"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertTriangle, CheckCircle2, Upload } from "lucide-react"

import {
  type ActualLogImportDialogStepKey,
  type ActualLogImportDialogSummary,
} from "@/components/actual-log-production-model"
import { formatFieldMappingTemplateSummary } from "@/components/import-center-model"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function ActualLogImportDialog({
  dialog,
  templateError,
  action,
}: {
  dialog: ActualLogImportDialogSummary
  templateError: string | null
  action: (formData: FormData) => Promise<void>
}) {
  const router = useRouter()
  const formRef = React.useRef<HTMLFormElement>(null)
  const [activeStep, setActiveStep] =
    React.useState<ActualLogImportDialogStepKey>(
      dialog.result ? "result" : "upload"
    )
  const defaultTemplateId = dialog.activeTemplates[0]?.template_id ?? ""

  function closeDialog(open: boolean) {
    if (!open) {
      router.push(dialog.closeHref)
    }
  }

  function moveToMappingStep() {
    if (formRef.current?.reportValidity()) {
      setActiveStep("mapping")
    }
  }

  return (
    <Dialog open onOpenChange={closeDialog}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-hidden sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>{dialog.title}</DialogTitle>
          <DialogDescription>
            从登录/状态日志页发起导入；行明细、失败修正和应用处理进入批次详情。
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 overflow-y-auto pr-1">
          <ActualLogImportStepHeader steps={dialog.steps} activeStep={activeStep} />

          <form ref={formRef} action={action} className="grid gap-4">
            <input name="file_type" type="hidden" value={dialog.fileType} />
            <input
              name="result_redirect_to"
              type="hidden"
              value={dialog.resultRedirectTo}
            />

            <section
              hidden={activeStep !== "upload"}
              aria-hidden={activeStep !== "upload"}
              className="grid gap-3 rounded-md border p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="grid gap-1">
                  <h3 className="text-sm font-semibold tracking-normal">上传文件</h3>
                  <p className="text-sm text-muted-foreground">
                    先下载模板，按人员、事件时间、状态区间和时区字段补齐后上传。
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <a
                    download={dialog.templateDownloadName}
                    href={dialog.templateDownloadHref}
                  >
                    下载导入模板
                  </a>
                </Button>
              </div>

              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <Field label="批次号">
                  <Input
                    name="batch_id"
                    placeholder={
                      dialog.logType === "status"
                        ? "STATUS-20260612-001"
                        : "LOGIN-20260612-001"
                    }
                    required
                  />
                </Field>
                <Field label="文件名">
                  <Input
                    name="file_name"
                    placeholder={
                      dialog.logType === "status"
                        ? "status-log.csv"
                        : "login-log.csv"
                    }
                  />
                </Field>
                <Field label="上传人">
                  <Input name="uploaded_by" defaultValue="operator" required />
                </Field>
                <Field label="CSV 文件">
                  <Input name="csv_file" type="file" accept=".csv,text/csv" required />
                </Field>
                <Field label="开始日期">
                  <Input
                    name="business_date_from"
                    type="date"
                    defaultValue="2026-06-01"
                    required
                  />
                </Field>
                <Field label="结束日期">
                  <Input
                    name="business_date_to"
                    type="date"
                    defaultValue="2026-06-30"
                    required
                  />
                </Field>
              </div>
            </section>

            <section
              hidden={activeStep !== "mapping"}
              aria-hidden={activeStep !== "mapping"}
              className="grid gap-3 rounded-md border p-4"
            >
              <div className="grid gap-1">
                <h3 className="text-sm font-semibold tracking-normal">字段映射</h3>
                <p className="text-sm text-muted-foreground">
                  两种方式二选一：选择模板，或保持模板为空后手动填写字段映射。
                </p>
              </div>
              <div className="grid gap-3 lg:grid-cols-2">
                <div className="grid gap-3 rounded-md bg-muted/30 p-3">
                  <MappingModeHeader mode={dialog.mappingModes[0]} />
                  <Field label="映射模板">
                    <select
                      name="template_id"
                      defaultValue={defaultTemplateId}
                      className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">不使用模板</option>
                      {dialog.activeTemplates.map((template) => (
                        <option key={template.template_id} value={template.template_id}>
                          {template.template_name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {templateError ? (
                    <Alert variant="destructive">
                      <AlertTriangle />
                      <AlertTitle>映射模板读取失败</AlertTitle>
                      <AlertDescription>{templateError}</AlertDescription>
                    </Alert>
                  ) : dialog.activeTemplates.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      暂无启用模板，本次可使用手动映射。
                    </p>
                  ) : (
                    <div className="grid gap-2">
                      {dialog.activeTemplates.slice(0, 3).map((template) => (
                        <div
                          key={template.template_id}
                          className="rounded-md border bg-background px-2 py-1.5"
                        >
                          <div className="truncate text-sm font-medium">
                            {template.template_name}
                          </div>
                          <div className="truncate text-sm text-muted-foreground">
                            {formatFieldMappingTemplateSummary(template)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-3 rounded-md bg-muted/30 p-3">
                  <MappingModeHeader mode={dialog.mappingModes[1]} />
                  <Field label="字段映射 JSON">
                    <textarea
                      name="field_mapping"
                      defaultValue={JSON.stringify(
                        buildDefaultFieldMapping(dialog),
                        null,
                        2
                      )}
                      className="min-h-32 w-full rounded-lg border border-input bg-background px-2.5 py-2 font-mono text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    />
                  </Field>
                </div>
              </div>
            </section>

            <section
              hidden={activeStep !== "result"}
              aria-hidden={activeStep !== "result"}
              className="grid gap-3 rounded-md border p-4"
            >
              <div className="grid gap-1">
                <h3 className="text-sm font-semibold tracking-normal">导入结果</h3>
                <p className="text-sm text-muted-foreground">
                  弹窗只保留本次摘要；完整成功/失败行、准备度和应用处理在批次详情页完成。
                </p>
              </div>
              <ActualLogImportResult result={dialog.result} />
            </section>

            <DialogFooter className="-mx-4 -mb-4">
              {activeStep === "upload" ? (
                <>
                  <Button asChild variant="outline">
                    <Link href={dialog.closeHref}>取消</Link>
                  </Button>
                  <Button type="button" onClick={moveToMappingStep}>
                    下一步
                  </Button>
                </>
              ) : activeStep === "mapping" ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveStep("upload")}
                  >
                    上一步
                  </Button>
                  <Button type="submit">
                    <Upload data-icon="inline-start" />
                    开始导入
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href={dialog.closeHref}>关闭</Link>
                  </Button>
                  {dialog.result?.batchHref ? (
                    <Button asChild>
                      <Link href={dialog.result.batchHref}>查看批次详情</Link>
                    </Button>
                  ) : null}
                </>
              )}
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ActualLogImportStepHeader({
  steps,
  activeStep,
}: {
  steps: ActualLogImportDialogSummary["steps"]
  activeStep: ActualLogImportDialogStepKey
}) {
  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.key === activeStep)
  )

  return (
    <div className="grid gap-2 md:grid-cols-3">
      {steps.map((step, index) => (
        <div
          key={step.key}
          className="rounded-md border bg-card px-3 py-2 text-card-foreground"
        >
          <div className="flex items-center gap-2">
            <Badge variant={index === activeIndex ? "default" : "secondary"}>
              {index + 1}
            </Badge>
            <span className="text-sm font-medium">{step.title}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
        </div>
      ))}
    </div>
  )
}

function MappingModeHeader({
  mode,
}: {
  mode: ActualLogImportDialogSummary["mappingModes"][number]
}) {
  return (
    <div className="grid gap-1">
      <div className="text-sm font-medium">{mode.label}</div>
      <div className="text-sm text-muted-foreground">{mode.detail}</div>
    </div>
  )
}

function ActualLogImportResult({
  result,
}: {
  result: ActualLogImportDialogSummary["result"]
}) {
  if (!result) {
    return (
      <Alert>
        <CheckCircle2 />
        <AlertTitle>等待导入提交</AlertTitle>
        <AlertDescription>
          提交后会在这里展示本次导入结果，并提供批次详情入口。
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant={result.tone === "failed" ? "destructive" : "default"}>
      {result.tone === "failed" ? <AlertTriangle /> : <CheckCircle2 />}
      <AlertTitle>{result.title}</AlertTitle>
      <AlertDescription>
        <span className="block">{result.detail}</span>
        <span className="block">{result.rowSummary}</span>
      </AlertDescription>
    </Alert>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      <span>{label}</span>
      {children}
    </label>
  )
}

function buildDefaultFieldMapping(dialog: ActualLogImportDialogSummary) {
  if (dialog.logType === "status") {
    return {
      record_type: "record_type",
      interval_id: "interval_id",
      employee_id: "employee_id",
      external_status_code: "external_status_code",
      start_at: "start_at",
      end_at: "end_at",
      timezone: "timezone",
      normalized_status: "normalized_status",
      category: "category",
      is_productive: "is_productive",
    }
  }

  return {
    event_id: "event_id",
    employee_id: "employee_id",
    event_type: "event_type",
    event_time: "event_time",
    timezone: "timezone",
  }
}
