import { Clock3 } from "lucide-react"

import {
  type ImportReviewCaseDetailResponse,
  summarizeImportReviewCaseProcessingTimeline,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type ImportCenterReviewCaseProcessingTimelineProps = {
  detail: ImportReviewCaseDetailResponse | null
  error: string | null
}

export function ImportCenterReviewCaseProcessingTimeline({
  detail,
  error,
}: ImportCenterReviewCaseProcessingTimelineProps) {
  const timeline = summarizeImportReviewCaseProcessingTimeline({ detail, error })

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock3 className="size-4 text-muted-foreground" />
              {timeline.title}
            </CardTitle>
            <CardDescription className="mt-1">
              {timeline.summary}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{timeline.currentStage}</Badge>
            <Badge variant={timeline.tone === "blocked" ? "destructive" : "outline"}>
              {timeline.statusLabel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-0">
        <div className="px-4 lg:px-6">
          <div className="rounded-md border bg-muted/30 p-3 text-sm text-muted-foreground">
            {timeline.nextAction}
          </div>
        </div>
        {timeline.items.length === 0 ? (
          <div className="px-4 pb-4 lg:px-6">
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              暂无可展示的处理动作。
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[110px]">阶段</TableHead>
                  <TableHead className="min-w-[160px]">动作</TableHead>
                  <TableHead className="min-w-[150px]">处理人</TableHead>
                  <TableHead className="min-w-[210px]">时间</TableHead>
                  <TableHead className="min-w-[280px]">说明</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timeline.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant="secondary">{item.stage}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="grid gap-1">
                        <div className="font-mono text-xs">{item.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.sourceLabel} · {item.title}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.actor}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {item.timestamp}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.detail}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
