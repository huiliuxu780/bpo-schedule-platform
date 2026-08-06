import { AlertTriangle, CheckCircle2 } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export type BaseConfigTabFeedback = {
  tone: "success" | "error"
  title: string
  detail: string
}

// 基础配置标签页共享反馈横幅：server action redirect 回跳后由查询参数驱动。
export function BaseConfigTabFeedbackCard({
  feedback,
}: {
  feedback: BaseConfigTabFeedback
}) {
  const isError = feedback.tone === "error"

  return (
    <Alert variant={isError ? "destructive" : "default"}>
      {isError ? <AlertTriangle /> : <CheckCircle2 />}
      <AlertTitle>{feedback.title}</AlertTitle>
      <AlertDescription>{feedback.detail}</AlertDescription>
    </Alert>
  )
}
