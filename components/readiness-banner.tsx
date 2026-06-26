import type { JSX } from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export type DataSource = "api" | "fallback" | "mixed" | "api_empty"

export type ReadinessProps = {
  message: string
  hasData: boolean
  overallSource: DataSource
  className?: string
}

type BannerVariant = {
  icon: JSX.Element
  className: string
}

function getBannerVariant(source: DataSource): BannerVariant {
  if (source === "api") {
    return {
      icon: <CheckCircle2 className="size-4" />,
      className: "border-primary/30 bg-primary/5 text-foreground",
    }
  }

  if (source === "fallback") {
    return {
      icon: <AlertTriangle className="size-4" />,
      className: "border-destructive/30 bg-destructive/5 text-foreground",
    }
  }

  if (source === "mixed") {
    return {
      icon: <Info className="size-4" />,
      className: "border-border bg-muted/50 text-foreground",
    }
  }

  if (source === "api_empty") {
    return {
      icon: <AlertCircle className="size-4" />,
      className: "border-border bg-muted/50 text-foreground",
    }
  }

  return {
    icon: <AlertCircle className="size-4" />,
    className: "border-border bg-muted/50 text-foreground",
  }
}

export function ReadinessBanner({
  message,
  hasData,
  overallSource,
  className,
}: ReadinessProps) {
  const variant = getBannerVariant(overallSource)
  const emptyLabel = !hasData ? "当前无可展示数据。" : null

  return (
    <Alert
      className={cn(
        "mx-4 flex items-center gap-2 lg:mx-6",
        variant.className,
        className
      )}
    >
      {variant.icon}
      <AlertDescription className="text-current">
        {message}
        {emptyLabel ? ` ${emptyLabel}` : ""}
      </AlertDescription>
    </Alert>
  )
}
