"use client"

import * as React from "react"

import {
  type BaseConfigTabFeedback,
  BaseConfigTabFeedbackCard,
} from "@/components/base-config/tab-feedback-card"
import {
  emptyStatusMappingRow,
  type StatusMappingApiRecord,
  type StatusMappingCountFlagKey,
  statusMappingCountFlagOptions,
  summarizeStatusMappingCountFlags,
  type StatusMappingFormRow,
} from "@/components/base-config/status-mapping-model"
import { BackendErrorAlert } from "@/components/backend-error-alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export function StatusMappingWorkbench({
  items,
  error,
  feedback,
  submitAction,
}: {
  items: StatusMappingApiRecord[]
  error: string | null
  feedback: BaseConfigTabFeedback | null
  submitAction: (formData: FormData) => Promise<void>
}) {
  // 行编辑状态：初始来自服务端快照；新增行追加空行，提交时整表 PUT 合并。
  const [rows, setRows] = React.useState<StatusMappingFormRow[]>(() =>
    items.length > 0 ? items.map((item) => ({ ...item })) : []
  )

  const updateRow = (
    index: number,
    patch: Partial<StatusMappingFormRow>
  ) => {
    setRows((current) =>
      current.map((row, position) =>
        position === index ? { ...row, ...patch } : row
      )
    )
  }

  const removeRow = (index: number) => {
    setRows((current) => current.filter((_, position) => position !== index))
  }

  const addRow = () => {
    setRows((current) => [...current, emptyStatusMappingRow()])
  }

  return (
    <main className="grid flex-1 auto-rows-max gap-3 overflow-x-hidden overflow-y-auto bg-muted/40 p-3 lg:p-4">
      {feedback ? <BaseConfigTabFeedbackCard feedback={feedback} /> : null}

      {error ? (
        <BackendErrorAlert
          title="状态映射读取失败"
          description="后端服务不可用或请求失败，请检查后端服务状态后重试。"
          error={error}
        />
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>状态映射维护</CardTitle>
          <CardDescription>
            将实际状态的「状态 / 子状态 / 状态码」三元组映射到业务活动，并选择参与哪些统计口径；保存时按三元组合并覆盖。移除行只把该行从当前编辑区撤下，不会删除服务端已保存的映射。
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <form action={submitAction} className="grid gap-3">
            {rows.map((row, index) => (
              <React.Fragment key={index}>
                <input
                  type="hidden"
                  name="mapping_row"
                  value={JSON.stringify(row)}
                />
                <StatusMappingRowEditor
                  row={row}
                  position={index}
                  removable={rows.length > 0}
                  onChange={(patch) => updateRow(index, patch)}
                  onRemove={() => removeRow(index)}
                />
              </React.Fragment>
            ))}

            {rows.length === 0 && !error ? (
              <p className="rounded-md border border-dashed py-8 text-center text-sm text-muted-foreground">
                暂无状态映射，点击下方「新增映射」配置第一条三元组映射。
              </p>
            ) : null}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={addRow}>
                新增映射
              </Button>
              <Button type="submit" disabled={rows.length === 0}>
                保存状态映射
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {items.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">当前生效映射（{items.length} 条）</CardTitle>
            <CardDescription>
              上次保存后的服务端快照，按状态三元组排序。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2">
              {items.map((item) => (
                <li
                  key={`${item.status}-${item.sub_status}-${item.status_cd}`}
                  className="flex flex-wrap items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs">
                    {item.status} / {item.sub_status} / {item.status_cd}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span>
                    {item.activity_name}
                    <span className="ms-1 font-mono text-xs text-muted-foreground">
                      {item.activity_code}
                    </span>
                  </span>
                  <span className="ms-auto flex flex-wrap gap-1">
                    {summarizeStatusMappingCountFlags(item).map((label) => (
                      <Badge key={label} variant="secondary">
                        {label}
                      </Badge>
                    ))}
                    {summarizeStatusMappingCountFlags(item).length === 0 ? (
                      <Badge variant="outline">不计入任何口径</Badge>
                    ) : null}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </main>
  )
}

function StatusMappingRowEditor({
  row,
  position,
  onChange,
  onRemove,
}: {
  row: StatusMappingFormRow
  position: number
  removable: boolean
  onChange: (patch: Partial<StatusMappingFormRow>) => void
  onRemove: () => void
}) {
  const rowLabel = `第${position + 1}行`

  return (
    <div className="grid gap-2 rounded-md border p-3">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          value={row.status}
          aria-label={`${rowLabel}状态`}
          placeholder="状态，如 在岗"
          onChange={(event) => onChange({ status: event.target.value })}
        />
        <Input
          value={row.sub_status}
          aria-label={`${rowLabel}子状态`}
          placeholder="子状态，如 接线"
          onChange={(event) => onChange({ sub_status: event.target.value })}
        />
        <Input
          value={row.status_cd}
          aria-label={`${rowLabel}状态码`}
          placeholder="状态码"
          onChange={(event) => onChange({ status_cd: event.target.value })}
        />
        <Input
          value={row.activity_code}
          aria-label={`${rowLabel}业务活动代码`}
          placeholder="业务活动代码"
          onChange={(event) => onChange({ activity_code: event.target.value })}
        />
        <Input
          value={row.activity_name}
          aria-label={`${rowLabel}业务活动名称`}
          placeholder="业务活动名称"
          onChange={(event) => onChange({ activity_name: event.target.value })}
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-xs text-muted-foreground">统计口径：</span>
        {statusMappingCountFlagOptions.map((option) => (
          <label
            key={option.key}
            className="flex items-center gap-1.5 text-sm"
          >
            <input
              type="checkbox"
              className="size-4 accent-primary"
              aria-label={`${rowLabel}${option.label}`}
              checked={row[option.key as StatusMappingCountFlagKey]}
              onChange={(event) =>
                onChange({ [option.key]: event.target.checked })
              }
            />
            {option.label}
          </label>
        ))}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ms-auto"
          aria-label={`${rowLabel}从编辑区移除`}
          title="不影响服务端已保存的映射"
          onClick={onRemove}
        >
          从编辑区移除
        </Button>
      </div>
    </div>
  )
}
