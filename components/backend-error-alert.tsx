import { AlertTriangle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type BackendErrorAlertProps = {
  error: string
  title?: string
  description?: string
}

export function BackendErrorAlert({
  error,
  title = "数据加载失败",
  description = "后端服务不可用或请求失败，请检查后端服务状态后重试。",
}: BackendErrorAlertProps) {
  return (
    <Alert variant="destructive">
      <AlertTriangle />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>{description}</p>
        <p className="mt-1 break-all font-mono text-xs">{error}</p>
      </AlertDescription>
    </Alert>
  )
}
