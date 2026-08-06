"use client"

import * as React from "react"
import { Plus, Trash2 } from "lucide-react"

import { isValidUnavailableDate } from "@/components/employee-restrictions-model"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// 员工详情「排班限制」区块表单：夜班/跨日班开关 + 不可排班日期增删。
// 日期列表在客户端维护，以隐藏域随表单提交，服务端 action 统一二次校验。
export function EmployeeRestrictionsForm({
  action,
  employeeId,
  nightShiftAllowed,
  crossDayAllowed,
  unavailableDates,
}: {
  action: (formData: FormData) => Promise<void>
  employeeId: string
  nightShiftAllowed: boolean
  crossDayAllowed: boolean
  unavailableDates: string[]
}) {
  const [dates, setDates] = React.useState<string[]>(unavailableDates)
  const [dateInput, setDateInput] = React.useState("")
  const [dateError, setDateError] = React.useState<string | null>(null)

  const addDate = () => {
    const value = dateInput.trim()

    if (!value) {
      setDateError("请先选择日期")
      return
    }
    if (!isValidUnavailableDate(value)) {
      setDateError(`不可排班日期格式无效：${value}`)
      return
    }
    if (dates.includes(value)) {
      setDateError(`该日期已在列表中：${value}`)
      return
    }

    setDates([...dates, value].sort())
    setDateInput("")
    setDateError(null)
  }

  const removeDate = (value: string) => {
    setDates(dates.filter((date) => date !== value))
    setDateError(null)
  }

  return (
    <form action={action} className="grid gap-4">
      <input type="hidden" name="employee_id" value={employeeId} />

      <div className="grid gap-3 text-sm md:grid-cols-2">
        <label className="flex items-center gap-2 rounded-md border p-3">
          <input
            type="checkbox"
            name="night_shift_allowed"
            defaultChecked={nightShiftAllowed}
            className="size-4 accent-primary"
            aria-label="允许排夜班"
          />
          <span className="grid gap-0.5">
            <span className="font-medium">允许排夜班</span>
            <span className="text-xs text-muted-foreground">
              关闭后夜班限制生效，矩阵不再为其排夜班
            </span>
          </span>
        </label>
        <label className="flex items-center gap-2 rounded-md border p-3">
          <input
            type="checkbox"
            name="cross_day_allowed"
            defaultChecked={crossDayAllowed}
            className="size-4 accent-primary"
            aria-label="允许排跨日班"
          />
          <span className="grid gap-0.5">
            <span className="font-medium">允许排跨日班</span>
            <span className="text-xs text-muted-foreground">
              关闭后跨日班限制生效，矩阵不再为其排跨日班次
            </span>
          </span>
        </label>
      </div>

      <div className="grid gap-2">
        <span className="text-sm font-medium">不可排班日期</span>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            type="date"
            value={dateInput}
            onChange={(event) => {
              setDateInput(event.target.value)
              setDateError(null)
            }}
            aria-label="新增不可排班日期"
            className="w-auto"
          />
          <Button type="button" size="sm" variant="outline" onClick={addDate}>
            <Plus />
            添加日期
          </Button>
        </div>
        {dateError ? (
          <p className="text-sm text-destructive">{dateError}</p>
        ) : null}
        {dates.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {dates.map((date) => (
              <li
                key={date}
                className="flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 font-mono text-xs"
              >
                <span>{date}</span>
                <button
                  type="button"
                  onClick={() => removeDate(date)}
                  aria-label={`移除不可排班日期 ${date}`}
                  className="rounded p-0.5 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            暂无不可排班日期，该员工所有日期均可排班。
          </p>
        )}
        {dates.map((date) => (
          <input key={date} type="hidden" name="unavailable_dates" value={date} />
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="sm">
          保存排班限制
        </Button>
      </div>
    </form>
  )
}
