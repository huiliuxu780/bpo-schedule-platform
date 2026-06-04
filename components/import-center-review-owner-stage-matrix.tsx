import Link from "next/link"

import {
  type ImportReviewCaseProcessingStageSnapshot,
  type ImportReviewCaseRecord,
  type ImportReviewCasesWorkspaceFilters,
  summarizeImportReviewOwnerStageMatrix,
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

type ImportCenterReviewOwnerStageMatrixProps = {
  cases: ImportReviewCaseRecord[]
  filters: ImportReviewCasesWorkspaceFilters
  processingStages: Record<string, ImportReviewCaseProcessingStageSnapshot | undefined>
}

export function ImportCenterReviewOwnerStageMatrix({
  cases,
  filters,
  processingStages,
}: ImportCenterReviewOwnerStageMatrixProps) {
  const matrix = summarizeImportReviewOwnerStageMatrix({
    cases,
    processingStages,
    baseFilters: filters,
  })

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <CardTitle className="text-base">Owner 阶段负载</CardTitle>
            <CardDescription className="mt-1">
              {matrix.totalOwners.toLocaleString("zh-CN")} 个 owner ·{" "}
              {matrix.actionableCount.toLocaleString("zh-CN")} 个待处理案例
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              案例 {matrix.totalCases.toLocaleString("zh-CN")}
            </Badge>
            <Badge variant="outline">Owner 聚合</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {matrix.rows.length === 0 ? (
          <div className="px-4 pb-4 lg:px-6">
            <div className="rounded-md border p-4 text-sm text-muted-foreground">
              当前范围没有可聚合的 owner 负载。
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[180px]">Owner</TableHead>
                  {matrix.columns.map((column) => (
                    <TableHead key={column.key} className="min-w-[110px] text-right">
                      {column.label}
                    </TableHead>
                  ))}
                  <TableHead className="min-w-[100px] text-right">待处理</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matrix.rows.map((row) => (
                  <TableRow key={row.ownerId}>
                    <TableCell>
                      <div className="grid min-w-0 gap-1">
                        <div className="truncate font-medium">{row.ownerId}</div>
                        <div className="text-xs text-muted-foreground">
                          总计 {row.totalCount.toLocaleString("zh-CN")} 个案例
                        </div>
                      </div>
                    </TableCell>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.key} className="text-right">
                        {cell.href ? (
                          <Button asChild size="sm" variant="outline" className="min-w-12">
                            <Link
                              href={cell.href}
                              aria-label={`${row.ownerId} ${cell.label} ${cell.count} 个案例`}
                            >
                              {cell.count.toLocaleString("zh-CN")}
                            </Link>
                          </Button>
                        ) : (
                          <Badge variant="outline">0</Badge>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      <Badge
                        variant={row.actionableCount > 0 ? "secondary" : "outline"}
                      >
                        {row.actionableCount.toLocaleString("zh-CN")}
                      </Badge>
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
