"use client"

import Link from "next/link"
import { AlertCircle, RotateCcw } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <AppShell
      title="页面异常"
      breadcrumbItems={[{ label: "页面异常" }]}
      actions={
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard">返回经营总览</Link>
        </Button>
      }
    >
      <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <Alert variant="destructive" className="max-w-3xl">
          <AlertCircle />
          <AlertTitle>当前页面加载失败</AlertTitle>
          <AlertDescription>
            数据读取或页面渲染时出现异常。可以先重试当前页面；如果仍然失败，返回经营总览后再进入对应功能。
          </AlertDescription>
        </Alert>

        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" onClick={reset}>
            <RotateCcw />
            重试
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">返回经营总览</Link>
          </Button>
        </div>

        {error.digest ? (
          <p className="text-sm text-muted-foreground">错误编号：{error.digest}</p>
        ) : null}
      </main>
    </AppShell>
  )
}
