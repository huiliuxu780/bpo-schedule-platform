import Link from "next/link"

import {
  type ImportReviewCaseProcessingStageSnapshot,
  type ImportReviewCaseRecord,
  summarizeImportReviewOwnerContext,
  summarizeImportReviewOwnerNavigation,
} from "@/components/import-center-model"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

type ImportCenterReviewOwnerContextProps = {
  currentCase: ImportReviewCaseRecord | null
  cases: ImportReviewCaseRecord[]
  processingStages: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
  error: string | null
}

export function ImportCenterReviewOwnerContext({
  currentCase,
  cases,
  processingStages,
  error,
}: ImportCenterReviewOwnerContextProps) {
  const context = summarizeImportReviewOwnerContext({
    currentCase,
    cases,
    processingStages,
    error,
  })
  const navigation = summarizeImportReviewOwnerNavigation({
    currentCase,
    cases,
    processingStages,
    error,
  })

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-base">同 Owner 处理上下文</CardTitle>
            <CardDescription className="mt-1">{context.detail}</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={context.tone === "blocked" ? "destructive" : "secondary"}>
              {context.title}
            </Badge>
            {context.ownerId ? (
              <Badge variant="outline">{context.ownerId}</Badge>
            ) : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 p-0">
        <div className="grid gap-3 px-4 lg:px-6">
          <div className="rounded-md border bg-muted/30 p-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-medium">{navigation.title}</div>
                  <Badge variant="outline">{navigation.positionLabel}</Badge>
                  <Badge variant="secondary">
                    待处理 {navigation.totalActionableCount.toLocaleString("zh-CN")}
                  </Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {navigation.detail}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {navigation.previous ? (
                  <Button asChild size="sm" variant="outline">
                    <Link href={navigation.previous.href}>上一条待处理</Link>
                  </Button>
                ) : (
                  <Button disabled size="sm" variant="outline">
                    上一条待处理
                  </Button>
                )}
                {navigation.next ? (
                  <Button asChild size="sm" variant="secondary">
                    <Link href={navigation.next.href}>
                      {navigation.positionLabel === "当前案例不在待处理序列"
                        ? "进入首条待处理"
                        : "下一条待处理"}
                    </Link>
                  </Button>
                ) : (
                  <Button disabled size="sm" variant="secondary">
                    下一条待处理
                  </Button>
                )}
                <Button asChild size="sm" variant="outline">
                  <Link href={navigation.listHref}>查看 Owner 列表</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {context.actionableCount > 0 ? (
              <Button asChild size="sm" variant="secondary">
                <Link href={context.stageHref}>进入首要阶段</Link>
              </Button>
            ) : (
              <Button disabled size="sm" variant="secondary">
                进入首要阶段
              </Button>
            )}
          </div>
        </div>
        {context.items.length === 0 ? (
          <div className="px-4 pb-4 lg:px-6">
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              暂无同 owner 的其他案例。
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[190px]">案例</TableHead>
                  <TableHead className="min-w-[110px]">阶段</TableHead>
                  <TableHead className="min-w-[120px]">风险</TableHead>
                  <TableHead className="min-w-[220px]">证据/结论</TableHead>
                  <TableHead className="min-w-[260px]">下一步</TableHead>
                  <TableHead className="min-w-[110px] text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {context.items.map((item) => (
                  <TableRow key={item.caseId}>
                    <TableCell>
                      <div className="grid min-w-0 gap-1">
                        <div className="truncate font-mono text-xs">{item.caseId}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.createdAt}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{item.stageLabel}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{item.severityLabel}</Badge>
                        <Badge variant="outline">{item.statusLabel}</Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.evidenceLabel}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {item.nextAction}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" variant="outline">
                        <Link href={item.detailHref}>查看</Link>
                      </Button>
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
