import Link from "next/link"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  buildPersonTimelineHref,
  type PersonnelScheduleDetailRow,
} from "@/lib/personnel-schedule-details"

export function PersonnelScheduleDetailTable({
  rows,
}: {
  rows: PersonnelScheduleDetailRow[]
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>员工</TableHead>
          <TableHead>供应商</TableHead>
          <TableHead>班次</TableHead>
          <TableHead>计划时间</TableHead>
          <TableHead>技能</TableHead>
          <TableHead>0.5h 展开</TableHead>
          <TableHead>异常</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.scheduleDetailId}>
            <TableCell>
              <div className="flex min-w-36 flex-col gap-1">
                <span className="font-medium">{row.employeeName}</span>
                <span className="text-xs text-muted-foreground">{row.employeeId}</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex min-w-32 flex-col gap-1">
                <span>{row.supplier}</span>
                <span className="text-xs text-muted-foreground">{row.workplace}</span>
              </div>
            </TableCell>
            <TableCell>{row.shiftType}</TableCell>
            <TableCell>
              <div className="flex min-w-32 flex-col gap-1">
                <span className="font-mono text-xs">
                  {row.startTime}-{row.endTime}
                </span>
                <span className="text-xs text-muted-foreground">
                  休息 {row.breakWindow} / 饭点 {row.mealWindow}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">
                {row.skillGroup} / {row.skillLevel}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex max-w-80 flex-wrap gap-1">
                {row.expandedIntervals.slice(0, 6).map((interval) => (
                  <Badge
                    key={`${row.scheduleDetailId}-${interval.start}-${interval.end}`}
                    variant="outline"
                  >
                    {interval.start}-{interval.end}
                  </Badge>
                ))}
                {row.expandedIntervals.length > 6 ? (
                  <Badge variant="outline">+{row.expandedIntervals.length - 6}</Badge>
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              {row.anomalyCodes.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {row.anomalyCodes.map((code) => (
                    <Badge key={code} variant="outline">
                      {code}
                    </Badge>
                  ))}
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">无</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="outline" size="sm">
                <Link href={buildPersonTimelineHref(row)}>个人时间轴</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {rows.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={8}
              className="h-24 text-center text-sm text-muted-foreground"
            >
              当前计划暂无人员级排班明细
            </TableCell>
          </TableRow>
        ) : null}
      </TableBody>
    </Table>
  )
}
