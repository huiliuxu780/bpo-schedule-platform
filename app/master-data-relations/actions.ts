"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const API_BASE_URL =
  process.env.BPO_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000"

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

async function writeJson(path: string, payload?: unknown) {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: payload ? JSON.stringify(payload) : undefined,
    })

    return response.ok
  } catch {
    return false
  }
}

export async function upsertMasterDataRecordAction(formData: FormData) {
  const employeeId = formText(formData, "employee_id")
  const ok = await writeJson("/api/v1/master-data/records", {
    employee_id: employeeId,
    employee_name: formText(formData, "employee_name") || employeeId,
    workplace_id: formText(formData, "workplace_id"),
    workplace_name: formText(formData, "workplace_name"),
    supplier_id: formText(formData, "supplier_id"),
    supplier_name: formText(formData, "supplier_name"),
    project_id: formText(formData, "project_id"),
    project_name: formText(formData, "project_name"),
    skill_group: formText(formData, "skill_group"),
    skill_level: formText(formData, "skill_level") || "待确认",
    effective_from: formText(formData, "effective_from"),
    effective_to: formText(formData, "effective_to") || "未设置",
    status: formText(formData, "status") || "active",
  })

  revalidatePath("/master-data-relations")
  redirect(`/master-data-relations?result=${ok ? "maintained" : "failed"}`)
}

export async function freezeMasterDataRecordAction(formData: FormData) {
  await changeMasterDataRecordStatus(formData, "freeze")
}

export async function unfreezeMasterDataRecordAction(formData: FormData) {
  await changeMasterDataRecordStatus(formData, "unfreeze")
}

async function changeMasterDataRecordStatus(
  formData: FormData,
  action: "freeze" | "unfreeze"
) {
  const employeeId = encodeURIComponent(formText(formData, "employee_id"))
  const ok = await writeJson(`/api/v1/master-data/records/${employeeId}/${action}`)

  revalidatePath("/master-data-relations")
  redirect(`/master-data-relations?result=${ok ? "maintained" : "failed"}`)
}
