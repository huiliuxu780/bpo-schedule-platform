"use server"

import { redirect } from "next/navigation"

import {
  submitSupervisorExceptionClosure,
  submitSupervisorExceptionEvidence,
  submitSupervisorExceptionReviewConclusion,
  type SupervisorExceptionEvidenceRecord,
} from "@/lib/person-timeline"

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim()
}

function returnPath(formData: FormData) {
  return formText(formData, "return_path") || "/person-timeline"
}

export async function submitSupervisorReviewConclusionAction(formData: FormData) {
  submitSupervisorExceptionReviewConclusion({
    exceptionKey: formText(formData, "exception_key"),
    employeeId: formText(formData, "employee_id"),
    anomalyCode: formText(formData, "anomaly_code"),
    submittedBy: formText(formData, "submitted_by") || "现场主管",
    conclusion: formText(formData, "conclusion"),
    sourceReferences: formText(formData, "source_references")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  })

  redirect(returnPath(formData))
}

export async function submitSupervisorEvidenceAction(formData: FormData) {
  submitSupervisorExceptionEvidence({
    exceptionKey: formText(formData, "exception_key"),
    submittedBy: formText(formData, "submitted_by") || "现场主管",
    note: formText(formData, "note"),
    linkedRecordType:
      (formText(formData, "linked_record_type") as SupervisorExceptionEvidenceRecord["linkedRecordType"]) ||
      "person_timeline",
    linkedRecordId: formText(formData, "linked_record_id"),
  })

  redirect(returnPath(formData))
}

export async function submitSupervisorClosureAction(formData: FormData) {
  submitSupervisorExceptionClosure({
    exceptionKey: formText(formData, "exception_key"),
    closedBy: formText(formData, "closed_by") || "现场主管",
    conclusion: formText(formData, "closure_conclusion"),
  })

  redirect(returnPath(formData))
}
