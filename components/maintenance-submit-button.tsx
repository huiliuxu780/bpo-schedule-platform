"use client"

import { useFormStatus } from "react-dom"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MaintenanceSubmitButton({
  label,
  pendingLabel = "提交中",
}: {
  label: string
  pendingLabel?: string
}) {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      data-slot="maintenance-submit-button"
    >
      <Send data-icon="inline-start" />
      {pending ? pendingLabel : label}
    </Button>
  )
}
