"use server"

import { redirect } from "next/navigation"

import {
  createSchedulePlanDraft,
  type SchedulePlanDraftPayload,
  type SchedulePlanIntervalInput,
} from "@/lib/schedule-plans"

const slotKeys = ["0", "1", "2", "3"] as const

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function formNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0)
  return Number.isFinite(value) && value > 0 ? value : 0
}

export async function createDraftAction(formData: FormData) {
  const intervals: SchedulePlanIntervalInput[] = slotKeys.map((slot) => ({
    interval_start: formText(formData, `interval_start_${slot}`),
    interval_end: formText(formData, `interval_end_${slot}`),
    forecast_agents: formNumber(formData, `forecast_agents_${slot}`),
    scheduled_agents: formNumber(formData, `scheduled_agents_${slot}`),
    note: formText(formData, `note_${slot}`) || "草稿待复核",
  }))

  const payload: SchedulePlanDraftPayload = {
    plan_date: formText(formData, "plan_date"),
    project_name: formText(formData, "project_name") || "博西客服",
    site_name: formText(formData, "site_name") || "上海职场",
    version: formText(formData, "version") || "v1",
    intervals,
  }

  const created = await createSchedulePlanDraft(payload)

  if (!created.data) {
    // 直接落到排班计划台并由其消费 draft 反馈参数：
    // /schedule-plans 列表级路由已被过渡期重定向，落到旧路由只会被二次跳转且无人消费。
    redirect("/schedule-desk?draft=failed")
  }

  redirect("/schedule-desk?draft=created")
}
