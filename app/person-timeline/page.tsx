import Link from "next/link"

import { AppShell } from "@/components/app-shell"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  encodeScopeId,
  fallbackPersonTimelines,
  getFulfillmentCalendar,
  getFulfillmentMatrix,
  getFulfillmentTeam,
  getTimelineEventPosition,
  type FulfillmentCalendarSummary,
  type FulfillmentDayMetrics,
  type FulfillmentGroupMatrix,
  type FulfillmentMatrixMember,
  type FulfillmentTeamWeek,
  type TimelineEvent,
} from "@/lib/person-timeline"

type PageProps = {
  searchParams?: Promise<{
    team?: string
    group?: string
    date?: string
  }>
}

export default async function PersonTimelinePage({ searchParams }: PageProps) {
  const { team: teamId, group: groupId, date } = (await searchParams) ?? {}
  const calendar = getFulfillmentCalendar(fallbackPersonTimelines)
  const selectedTeam = getFulfillmentTeam(teamId, fallbackPersonTimelines)
  const selectedMatrix =
    selectedTeam && groupId
      ? getFulfillmentMatrix(selectedTeam.id, groupId, date, fallbackPersonTimelines)
      : undefined
  const currentSummary = selectedMatrix?.summary ?? selectedTeam?.summary ?? calendar.summary
  const currentSummaryLabel = selectedMatrix
    ? "小组当日"
    : selectedTeam
      ? "团队本周"
      : "全部团队本周"

  return (
    <AppShell title="履约日历" searchPlaceholder="搜索团队、小组、人员或状态异常">
      <main className="flex flex-1 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
        <PageHeader calendarLabel={`${calendar.weekStart} 至 ${calendar.weekEnd}`} />

        <section className="grid gap-4 md:grid-cols-4">
          <Metric title="计划人数" value={`${currentSummary.plannedPeople}`} description={currentSummaryLabel} />
          <Metric title="登录人数" value={`${currentSummary.loginPeople}`} description={currentSummaryLabel} />
          <Metric title="缺口人数" value={`${currentSummary.gapPeople}`} description="排班高于登录" />
          <Metric title="异常人数" value={`${currentSummary.anomalyPeople}`} description="需定位到人" />
        </section>

        {selectedMatrix ? (
          <MemberMatrixSection matrix={selectedMatrix} />
        ) : selectedTeam ? (
          <GroupWeekSection team={selectedTeam} />
        ) : (
          <TeamWeekSection teams={calendar.teams} />
        )}
      </main>
    </AppShell>
  )
}

function PageHeader({ calendarLabel }: { calendarLabel: string }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="flex max-w-3xl flex-col gap-1">
        <h1 className="text-lg font-semibold">履约日历</h1>
        <p className="text-sm text-muted-foreground">
          通过排班、登录、状态对齐查看团队履约情况，并下钻到小组和个人单日轨道。
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline">周视图</Badge>
        <Badge variant="secondary">{calendarLabel}</Badge>
      </div>
    </div>
  )
}

function TeamWeekSection({
  teams,
}: {
  teams: FulfillmentTeamWeek[]
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>团队周视图</CardTitle>
            <CardDescription>团队按职场和项目组合，点击某天查看小组履约情况。</CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">职场 全部</Badge>
            <Badge variant="outline">项目 全部</Badge>
            <Badge variant="outline">供应商 全部</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {teams.map((team) => (
          <WeekCard
            key={team.id}
            title={`${team.workplace} / ${team.project}`}
            description={`小组 ${team.groups.length} 个`}
            days={team.days}
            hrefForDay={(day) => `/person-timeline?team=${encodeScopeId(team.id)}&date=${day.date}`}
          />
        ))}
      </CardContent>
    </Card>
  )
}

function GroupWeekSection({
  team,
}: {
  team: FulfillmentTeamWeek
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>小组周视图</CardTitle>
            <CardDescription>
              {team.workplace} / {team.project}，小组按供应商口径展示。
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/person-timeline">返回团队层</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {team.groups.map((group) => (
          <WeekCard
            key={group.id}
            title={`小组：${group.supplier}`}
            description={`成员 ${group.members.length} 人`}
            days={group.days}
            hrefForDay={(day) =>
              `/person-timeline?team=${encodeScopeId(team.id)}&group=${encodeScopeId(group.id)}&date=${day.date}`
            }
          />
        ))}
      </CardContent>
    </Card>
  )
}

function MemberMatrixSection({ matrix }: { matrix: FulfillmentGroupMatrix }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>小组成员单日矩阵</CardTitle>
            <CardDescription>
              {matrix.team.workplace} / {matrix.team.project} / {matrix.group.supplier} / {matrix.date}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/person-timeline?team=${encodeScopeId(matrix.team.id)}&date=${matrix.date}`}>
              返回小组层
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SummaryStrip summary={matrix.summary} />
        <div className="overflow-x-auto">
          <div className="min-w-[920px] rounded-lg border">
            <TimelineScale />
            {matrix.members.map((member) => (
              <MemberMatrixRow key={member.employeeId} member={member} matrix={matrix} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function WeekCard({
  title,
  description,
  days,
  hrefForDay,
  selected,
}: {
  title: string
  description: string
  days: FulfillmentDayMetrics[]
  hrefForDay: (day: FulfillmentDayMetrics) => string
  selected?: boolean
}) {
  return (
    <div className={cn("rounded-lg border p-3", selected ? "border-primary" : "border-border")}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        {selected ? <Badge>当前查看</Badge> : null}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
        {days.map((day) => (
          <Link
            key={day.date}
            href={hrefForDay(day)}
            className={cn(
              "rounded-md border p-2 text-xs transition-colors hover:bg-muted",
              day.gapPeople > 0 || day.anomalyPeople > 0 ? "border-primary/40" : "border-border"
            )}
          >
            <div className="font-medium">{day.weekday}</div>
            <div className="text-muted-foreground">{day.label}</div>
            <div className="mt-2 grid gap-1">
              <span>计 {day.plannedPeople}</span>
              <span>登 {day.loginPeople}</span>
              <span>缺 {day.gapPeople}</span>
              <span>异 {day.anomalyPeople}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SummaryStrip({ summary }: { summary: FulfillmentCalendarSummary }) {
  return (
    <div className="grid gap-2 rounded-lg border bg-muted/30 p-3 text-sm md:grid-cols-4">
      <div>计划 {summary.plannedPeople} 人</div>
      <div>登录 {summary.loginPeople} 人</div>
      <div>缺口 {summary.gapPeople} 人</div>
      <div>异常 {summary.anomalyPeople} 人</div>
    </div>
  )
}

function MemberMatrixRow({
  member,
  matrix,
}: {
  member: FulfillmentMatrixMember
  matrix: FulfillmentGroupMatrix
}) {
  const detailHref = `/person-timeline/${member.employeeId}?date=${matrix.date}&team=${encodeScopeId(
    matrix.team.id
  )}&group=${encodeScopeId(matrix.group.id)}`

  return (
    <div className="grid grid-cols-[144px_1fr] gap-3 border-t p-3">
      <div className="flex flex-col gap-2">
        <Button asChild variant="link" className="h-auto justify-start p-0 text-left">
          <Link href={detailHref}>
            <span className="font-medium">{member.employeeName}</span>
            <span className="ml-1 text-xs text-muted-foreground">{member.employeeId}</span>
          </Link>
        </Button>
        <div className="text-xs text-muted-foreground">{member.supplier}</div>
        <div className="flex flex-wrap gap-1">
          {member.scheduledHours > member.loginHours ? (
            <Badge variant="destructive">登录缺口</Badge>
          ) : null}
          {member.anomalies.map((anomaly) => (
            <Button key={anomaly.code} asChild variant="ghost" size="sm" className="h-6 px-2 text-xs">
              <Link href={detailHref}>{anomaly.title}</Link>
            </Button>
          ))}
        </div>
      </div>
      <div className="grid gap-2">
        <MatrixTrack title="排班" rows={member.tracks.schedule} tone="schedule" />
        <MatrixTrack title="登录" rows={member.tracks.login} tone="login" />
        <MatrixTrack title="状态" rows={member.tracks.status} tone="status" />
      </div>
    </div>
  )
}

function TimelineScale() {
  const hours = ["08", "10", "12", "14", "16", "18", "20"]

  return (
    <div className="grid grid-cols-[144px_1fr] gap-3 p-3 text-xs text-muted-foreground">
      <div>时间轴</div>
      <div className="relative h-5">
        {hours.map((hour, index) => (
          <span
            key={hour}
            className="absolute top-0 -translate-x-1/2"
            style={{ left: `${(index / (hours.length - 1)) * 100}%` }}
          >
            {hour}
          </span>
        ))}
      </div>
    </div>
  )
}

function MatrixTrack({
  title,
  rows,
  tone,
}: {
  title: string
  rows: TimelineEvent[]
  tone: "schedule" | "login" | "status"
}) {
  return (
    <div className="grid grid-cols-[48px_1fr] gap-2">
      <div className="pt-1 text-xs text-muted-foreground">{title}</div>
      <div className="relative h-8 rounded-md bg-muted/50">
        {rows.length === 0 ? (
          <span className="flex h-full items-center px-2 text-xs text-muted-foreground">无记录</span>
        ) : (
          rows.map((item) => {
            const position = getTimelineEventPosition(item)
            return (
              <span
                key={item.id}
                className={cn("absolute top-1 h-6 rounded-sm border px-2 text-xs leading-6", matrixToneClass[tone])}
                style={{ left: `${position.leftPercent}%`, width: `${position.widthPercent}%` }}
                title={`${item.label} ${item.start}-${item.end}`}
              >
                {item.label}
              </span>
            )
          })
        )}
      </div>
    </div>
  )
}

function Metric({
  title,
  value,
  description,
}: {
  title: string
  value: string
  description: string
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">{value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{description}</CardContent>
    </Card>
  )
}

const matrixToneClass = {
  schedule: "border-sky-300 bg-sky-100 text-sky-950 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-100",
  login: "border-emerald-300 bg-emerald-100 text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  status: "border-amber-300 bg-amber-100 text-amber-950 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
}
