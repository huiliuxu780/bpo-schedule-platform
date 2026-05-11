import { CheckCircle2, Clock3, TriangleAlert } from "lucide-react"

import { syncStatus } from "@/app/dashboard/data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

function statusIcon(status: string) {
  if (status === "已同步") {
    return <CheckCircle2 className="size-4" />
  }

  if (status === "处理中") {
    return <Clock3 className="size-4" />
  }

  return <TriangleAlert className="size-4" />
}

function statusVariant(status: string) {
  if (status === "需关注") {
    return "destructive" as const
  }

  return "outline" as const
}

export function DataSyncStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>数据接入状态</CardTitle>
        <CardDescription>核心数据源最近批次与同步状态</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {syncStatus.map((item) => (
          <div
            key={item.source}
            className="grid grid-cols-[1fr_auto] gap-3 rounded-md border p-3"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{item.source}</div>
              <div className="mt-1 truncate text-xs text-muted-foreground">
                {item.batch}
              </div>
            </div>
            <div className="grid justify-items-end gap-1">
              <Badge variant={statusVariant(item.status)} className="gap-1">
                {statusIcon(item.status)}
                {item.status}
              </Badge>
              <div className="text-xs text-muted-foreground">{item.syncedAt}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
