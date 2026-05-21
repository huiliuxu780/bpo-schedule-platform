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
  getFulfillmentGroupMemberWeekMatrix,
  getFulfillmentMatrix,
  getFulfillmentMatrixExceptionQueueCursor,
  getFulfillmentTeam,
  getTimelineEventPosition,
  type FulfillmentCalendarSummary,
  type FulfillmentDayMetrics,
  type FulfillmentGroupMatrix,
  type FulfillmentGroupMemberWeekMatrix,
  type FulfillmentGroupMemberWeekMatrixMember,
  type FulfillmentMatrixExceptionQueueCursor,
  type FulfillmentMatrixExceptionQueueItem,
  type FulfillmentMatrixMember,
  type FulfillmentTeamWeek,
  type PersonTimelineWeekDay,
  type TimelineEvent,
} from "@/lib/person-timeline"

type PageProps = {
  searchParams?: Promise<{
    team?: string
    group?: string
    date?: string
    focus?: string
    exception?: string
    queue?: string
  }>
}

type GroupWeekFocus = "all" | "gap" | "anomaly"
type MatrixQueueFilter = "all" | "high" | "login" | "status"

export default async function PersonTimelinePage({ searchParams }: PageProps) {
  const { team: teamId, group: groupId, date, focus, exception, queue } =
    (await searchParams) ?? {}
  const groupWeekFocus: GroupWeekFocus =
    focus === "gap" || focus === "anomaly" ? focus : "all"
  const queueFilter = getMatrixQueueFilter(queue)
  const calendar = getFulfillmentCalendar(fallbackPersonTimelines)
  const selectedTeam = getFulfillmentTeam(teamId, fallbackPersonTimelines)
  const selectedMatrix =
    selectedTeam && groupId && date
      ? getFulfillmentMatrix(selectedTeam.id, groupId, date, fallbackPersonTimelines)
      : undefined
  const selectedGroupWeekMatrix =
    selectedTeam && groupId && !date
      ? getFulfillmentGroupMemberWeekMatrix(selectedTeam.id, groupId, fallbackPersonTimelines)
      : undefined
  const currentSummary =
    selectedMatrix?.summary ?? selectedGroupWeekMatrix?.group.summary ?? selectedTeam?.summary ?? calendar.summary
  const currentSummaryLabel = selectedMatrix
    ? "小组当日"
    : selectedGroupWeekMatrix
      ? "小组本周"
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
          <MemberMatrixSection
            matrix={selectedMatrix}
            selectedExceptionKey={exception}
            queueFilter={queueFilter}
          />
        ) : selectedGroupWeekMatrix ? (
          <GroupMemberWeekMatrixSection matrix={selectedGroupWeekMatrix} focus={groupWeekFocus} />
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
      <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-4">
          {team.groups.map((group) => (
            <WeekCard
              key={group.id}
              title={`小组：${group.supplier}`}
              description={`成员 ${group.members.length} 人`}
              days={group.days}
              hrefForDay={(day) =>
                `/person-timeline?team=${encodeScopeId(team.id)}&group=${encodeScopeId(group.id)}&returnDate=${day.date}`
              }
            />
          ))}
        </div>
        <GroupRiskSummaryPanel team={team} />
      </CardContent>
    </Card>
  )
}

function GroupRiskSummaryPanel({ team }: { team: FulfillmentTeamWeek }) {
  return (
    <aside className="grid content-start gap-3 rounded-lg border p-3">
      <div>
        <div className="text-sm font-medium">小组风险摘要</div>
        <div className="text-xs text-muted-foreground">按缺口、异常和成员风险排序</div>
      </div>
      <SummaryMetric label="最高风险小组" value={team.riskSummary.highestRiskGroup || "无"} />
      <SummaryMetric label="最高风险日期" value={team.riskSummary.highestRiskDate || "无"} />
      <SummaryMetric label="最高风险成员" value={team.riskSummary.highestRiskMember || "无"} />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <SummaryMetric label="缺口人数" value={`${team.riskSummary.gapPeople}`} />
        <SummaryMetric label="异常人数" value={`${team.riskSummary.anomalyPeople}`} />
      </div>
    </aside>
  )
}

function GroupMemberWeekMatrixSection({
  matrix,
  focus,
}: {
  matrix: FulfillmentGroupMemberWeekMatrix
  focus: GroupWeekFocus
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>小组成员周矩阵</CardTitle>
            <CardDescription>
              {matrix.team.workplace} / {matrix.team.project} / {matrix.group.supplier} / {matrix.weekStart} 至{" "}
              {matrix.weekEnd}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/person-timeline?team=${encodeScopeId(matrix.team.id)}`}>返回小组周</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2 rounded-lg border bg-muted/30 p-3 text-sm md:grid-cols-5">
          <div>成员 {matrix.summary.memberCount} 人</div>
          <div>计划 {matrix.summary.scheduledDays} 人天</div>
          <div>登录 {matrix.summary.loginDays} 人天</div>
          <div>缺口 {matrix.summary.gapHours.toFixed(1)}h</div>
          <div>异常 {matrix.summary.anomalyCount}</div>
        </div>
        <div className="grid gap-2 rounded-lg border p-3 text-sm md:grid-cols-4">
          <div>风险成员 {matrix.riskSummary.riskMemberCount} 人</div>
          <div>最高缺口 {matrix.riskSummary.highestGapMember || "无"}</div>
          <div>最高异常 {matrix.riskSummary.highestAnomalyMember || "无"}</div>
          <div>最高缺口日 {matrix.riskSummary.highestGapDate || "无"}</div>
        </div>
        <div className="grid gap-2 rounded-lg border p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-sm font-medium">本周待看清单</div>
              <div className="text-xs text-muted-foreground">按小组成员缺口和异常优先查看</div>
            </div>
            <Badge variant="outline">{matrix.watchlist.length} 项</Badge>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {matrix.watchlist.map((item) => (
              <Link
                key={item.key}
                href={`/person-timeline?team=${encodeScopeId(matrix.team.id)}&group=${encodeScopeId(
                  matrix.group.id
                )}&date=${item.date}`}
                className="grid gap-1 rounded-md border p-2 text-xs transition-colors hover:bg-muted"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{item.title}</span>
                  <Badge variant={item.priority === "high" ? "destructive" : "outline"}>
                    {priorityLabel[item.priority]}
                  </Badge>
                </div>
                <span className="text-muted-foreground">{item.reason}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <FocusLink matrix={matrix} focus="all" currentFocus={focus} label="全部" />
          <FocusLink matrix={matrix} focus="gap" currentFocus={focus} label="看缺口" />
          <FocusLink matrix={matrix} focus="anomaly" currentFocus={focus} label="看异常" />
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[1040px] rounded-lg border">
            <div className="grid grid-cols-[160px_repeat(7,minmax(112px,1fr))] border-b bg-muted/30 text-xs text-muted-foreground">
              <div className="p-3">成员</div>
              {matrix.members[0]?.days.map((day) => (
                <Link
                  key={day.date}
                  href={`/person-timeline?team=${encodeScopeId(matrix.team.id)}&group=${encodeScopeId(
                    matrix.group.id
                  )}&date=${day.date}`}
                  className="border-l p-3 transition-colors hover:bg-muted"
                >
                  <div className="font-medium text-foreground">{day.weekday}</div>
                  <div>{day.label}</div>
                </Link>
              ))}
            </div>
            {matrix.members.map((member) => (
              <GroupMemberWeekRow key={member.employeeId} member={member} matrix={matrix} focus={focus} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function FocusLink({
  matrix,
  focus,
  currentFocus,
  label,
}: {
  matrix: FulfillmentGroupMemberWeekMatrix
  focus: GroupWeekFocus
  currentFocus: GroupWeekFocus
  label: string
}) {
  const href = `/person-timeline?team=${encodeScopeId(matrix.team.id)}&group=${encodeScopeId(matrix.group.id)}${
    focus === "all" ? "" : `&focus=${focus}`
  }`

  return (
    <Button asChild variant={focus === currentFocus ? "default" : "outline"} size="sm">
      <Link href={href}>{label}</Link>
    </Button>
  )
}

function GroupMemberWeekRow({
  member,
  matrix,
  focus,
}: {
  member: FulfillmentGroupMemberWeekMatrixMember
  matrix: FulfillmentGroupMemberWeekMatrix
  focus: GroupWeekFocus
}) {
  const weekHref = `/person-timeline/${member.employeeId}?team=${encodeScopeId(
    matrix.team.id
  )}&group=${encodeScopeId(matrix.group.id)}`

  return (
    <div className="grid grid-cols-[160px_repeat(7,minmax(112px,1fr))] border-b last:border-b-0">
      <div className="flex flex-col gap-1 p-3">
        <Button asChild variant="link" className="h-auto justify-start p-0 text-left">
          <Link href={weekHref}>
            <span className="font-medium">{member.employeeName}</span>
            <span className="ml-1 text-xs text-muted-foreground">{member.employeeId}</span>
          </Link>
        </Button>
        <div className="text-xs text-muted-foreground">
          排班 {member.summary.scheduledHours.toFixed(1)}h / 缺口 {member.summary.gapHours.toFixed(1)}h
        </div>
      </div>
      {member.days.map((day) => (
        <GroupMemberWeekCell key={day.date} day={day} member={member} matrix={matrix} focus={focus} />
      ))}
    </div>
  )
}

function GroupMemberWeekCell({
  day,
  member,
  matrix,
  focus,
}: {
  day: PersonTimelineWeekDay
  member: FulfillmentGroupMemberWeekMatrixMember
  matrix: FulfillmentGroupMemberWeekMatrix
  focus: GroupWeekFocus
}) {
  const hasRisk = day.gapHours > 0 || day.anomalyCount > 0
  const focusHit =
    focus === "all" || (focus === "gap" && day.gapHours > 0) || (focus === "anomaly" && day.anomalyCount > 0)
  const isRestDay = day.scheduledHours === 0 && day.loginHours === 0
  const detailHref = `/person-timeline/${member.employeeId}?date=${day.date}&team=${encodeScopeId(
    matrix.team.id
  )}&group=${encodeScopeId(matrix.group.id)}&returnDate=${day.date}`

  return (
    <Link
      href={detailHref}
      className={`grid gap-1 border-l p-3 text-xs transition-colors hover:bg-muted ${
        focusHit && hasRisk ? "bg-primary/10 ring-1 ring-primary/30" : hasRisk ? "bg-primary/5" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">{isRestDay ? "休" : hasRisk ? "需看" : "正常"}</span>
        {hasRisk ? <Badge variant="destructive">异 {day.anomalyCount}</Badge> : null}
      </div>
      <span className="text-muted-foreground">排 {day.scheduledHours.toFixed(1)}h</span>
      <span className="text-muted-foreground">登 {day.loginHours.toFixed(1)}h</span>
      <span className={day.gapHours > 0 ? "text-destructive" : "text-muted-foreground"}>
        缺 {day.gapHours.toFixed(1)}h
      </span>
    </Link>
  )
}

function MemberMatrixSection({
  matrix,
  selectedExceptionKey,
  queueFilter,
}: {
  matrix: FulfillmentGroupMatrix
  selectedExceptionKey?: string
  queueFilter: MatrixQueueFilter
}) {
  const visibleQueue = getVisibleMatrixExceptionQueue(matrix, queueFilter)
  const queueCursor = getFulfillmentMatrixExceptionQueueCursor(visibleQueue, selectedExceptionKey)
  const selectedException = queueCursor.selected

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
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="overflow-x-auto">
            <div className="min-w-[920px] rounded-lg border">
              <TimelineScale />
              {matrix.members.map((member) => (
                <MemberMatrixRow
                  key={member.employeeId}
                  member={member}
                  matrix={matrix}
                  selectedExceptionKey={selectedException?.key ?? ""}
                  selectedException={selectedException}
                />
              ))}
            </div>
          </div>
          <MatrixExceptionPanel
            cursor={queueCursor}
            matrix={matrix}
            visibleQueue={visibleQueue}
            queueFilter={queueFilter}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function getMatrixQueueFilter(value?: string): MatrixQueueFilter {
  if (value === "high" || value === "login" || value === "status") {
    return value
  }

  return "all"
}

function getVisibleMatrixExceptionQueue(
  matrix: FulfillmentGroupMatrix,
  queueFilter: MatrixQueueFilter
) {
  if (queueFilter === "high") {
    return matrix.exceptionQueue.filter((item) => item.priority === "high")
  }

  if (queueFilter === "login") {
    return matrix.exceptionQueue.filter((item) => item.type === "登录缺口")
  }

  if (queueFilter === "status") {
    return matrix.exceptionQueue.filter((item) => item.type === "状态不一致")
  }

  return matrix.exceptionQueue
}

function MatrixExceptionPanel({
  cursor,
  matrix,
  visibleQueue,
  queueFilter,
}: {
  cursor: FulfillmentMatrixExceptionQueueCursor
  matrix: FulfillmentGroupMatrix
  visibleQueue: FulfillmentMatrixExceptionQueueItem[]
  queueFilter: MatrixQueueFilter
}) {
  const selected = cursor.selected

  const detailHref = selected
    ? `/person-timeline/${selected.employeeId}?date=${selected.detailDate}&team=${encodeScopeId(
        matrix.team.id
      )}&group=${encodeScopeId(matrix.group.id)}&returnDate=${selected.detailDate}`
    : ""

  return (
    <aside className="grid gap-3 rounded-lg border p-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <SummaryMetric label="异常" value={`${matrix.exceptionQueueSummary.totalCount}`} />
        <SummaryMetric label="高优" value={`${matrix.exceptionQueueSummary.highPriorityCount}`} />
        <SummaryMetric label="登录缺口" value={`${matrix.exceptionQueueSummary.loginGapCount}`} />
        <SummaryMetric
          label="状态不一致"
          value={`${matrix.exceptionQueueSummary.statusMismatchCount}`}
        />
        <SummaryMetric
          label="总影响"
          value={`${matrix.exceptionQueueSummary.totalImpactHours.toFixed(1)}h`}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {queueFilters.map((item) => (
          <Button
            key={item.value}
            asChild
            size="sm"
            variant={queueFilter === item.value ? "default" : "outline"}
            className="h-7 px-2 text-xs"
          >
            <Link
              href={`/person-timeline?team=${encodeScopeId(matrix.team.id)}&group=${encodeScopeId(
                matrix.group.id
              )}&date=${matrix.date}&queue=${item.value}`}
            >
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-medium">待关注异常</div>
          <Badge variant="outline">{visibleQueue.length} 项</Badge>
        </div>
        {selected ? (
          <div className="grid gap-2 rounded-md border bg-muted/30 p-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">处理进度</span>
              <span className="text-muted-foreground">
                第 {cursor.selectedIndex} / {cursor.totalCount} 项
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <QueueCursorButton
                label="上一项"
                item={cursor.previous}
                matrix={matrix}
                queueFilter={queueFilter}
              />
              <QueueCursorButton
                label="下一项"
                item={cursor.next}
                matrix={matrix}
                queueFilter={queueFilter}
              />
            </div>
          </div>
        ) : null}
        {visibleQueue.length === 0 ? (
          <div className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
            当前筛选没有待关注异常，可切换全部查看当天其他异常。
          </div>
        ) : (
          <div className="grid gap-2">
          {visibleQueue.map((item) => (
            <Link
              key={item.key}
              href={matrixQueueItemHref(matrix, queueFilter, item.key)}
              className={cn(
                "grid gap-1 rounded-md border p-2 text-xs transition-colors hover:bg-muted",
                selected && item.key === selected.key ? "border-primary bg-primary/10" : "border-border"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">
                  {item.employeeId} {item.employeeName}
                </span>
                <Badge variant={item.priority === "high" ? "destructive" : "outline"}>
                  {priorityLabel[item.priority]}
                </Badge>
              </div>
              <div className="text-muted-foreground">
                {item.start}-{item.end} / {item.title}
              </div>
              <div className="text-muted-foreground">影响 {item.impactHours.toFixed(1)}h</div>
            </Link>
          ))}
          </div>
        )}
      </div>
      {selected ? (
        <>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-sm font-medium">当前异常解释</div>
              <div className="text-xs text-muted-foreground">
                {selected.employeeId} {selected.employeeName}
              </div>
            </div>
            <Badge variant={selected.priority === "high" ? "destructive" : "outline"}>
              {priorityLabel[selected.priority]}
            </Badge>
          </div>
          <div className="grid gap-2 text-sm">
            <div className="font-medium">
              {selected.start}-{selected.end} / {selected.type}
            </div>
            <div className="text-xs text-muted-foreground">{selected.title}</div>
          </div>
          <div className="grid gap-2 text-xs text-muted-foreground">
            <div>涉及轨道：{selected.involvedTracks.map((track) => trackLabel[track]).join(" / ")}</div>
            <div>影响时长：{selected.impactHours.toFixed(1)}h</div>
            <div>证据：{selected.evidence}</div>
            <div>建议动作：{selected.supervisorAction}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium">三轨证据</div>
            {selected.evidenceCards.map((card) => (
              <div key={card.eventId} className="rounded-md border p-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{trackLabel[card.track]}</span>
                  <span className="text-muted-foreground">{card.eventId}</span>
                </div>
                <div className="mt-1 text-muted-foreground">
                  {card.label} {card.start}-{card.end}
                </div>
              </div>
            ))}
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={detailHref}>查看个人详情</Link>
          </Button>
        </>
      ) : null}
    </aside>
  )
}

function QueueCursorButton({
  label,
  item,
  matrix,
  queueFilter,
}: {
  label: string
  item?: FulfillmentMatrixExceptionQueueItem
  matrix: FulfillmentGroupMatrix
  queueFilter: MatrixQueueFilter
}) {
  if (!item) {
    return (
      <Button size="sm" variant="outline" disabled className="h-8 text-xs">
        {label}
      </Button>
    )
  }

  return (
    <Button asChild size="sm" variant="outline" className="h-8 text-xs">
      <Link href={matrixQueueItemHref(matrix, queueFilter, item.key)}>{label}</Link>
    </Button>
  )
}

function matrixQueueItemHref(
  matrix: FulfillmentGroupMatrix,
  queueFilter: MatrixQueueFilter,
  exceptionKey: string
) {
  return `/person-timeline?team=${encodeScopeId(matrix.team.id)}&group=${encodeScopeId(
    matrix.group.id
  )}&date=${matrix.date}&queue=${queueFilter}&exception=${encodeScopeId(exceptionKey)}`
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
  selectedExceptionKey,
  selectedException,
}: {
  member: FulfillmentMatrixMember
  matrix: FulfillmentGroupMatrix
  selectedExceptionKey: string
  selectedException?: FulfillmentMatrixExceptionQueueItem
}) {
  const isSelectedMember = selectedException?.employeeId === member.employeeId
  const focusEventIds = new Set(isSelectedMember ? selectedException.focusEventIds : [])
  const weekHref = `/person-timeline/${member.employeeId}?team=${encodeScopeId(
    matrix.team.id
  )}&group=${encodeScopeId(matrix.group.id)}&returnDate=${matrix.date}`
  return (
    <div
      className={cn(
        "grid grid-cols-[144px_1fr] gap-3 border-t p-3",
        isSelectedMember ? "bg-primary/5 ring-1 ring-inset ring-primary/30" : ""
      )}
      data-focus-member={isSelectedMember ? member.employeeId : undefined}
    >
      <div className="flex flex-col gap-2">
        <Button asChild variant="link" className="h-auto justify-start p-0 text-left">
          <Link href={weekHref}>
            <span className="font-medium">{member.employeeName}</span>
            <span className="ml-1 text-xs text-muted-foreground">{member.employeeId}</span>
          </Link>
        </Button>
        <div className="text-xs text-muted-foreground">{member.supplier}</div>
        {isSelectedMember ? (
          <Badge variant="outline">
            定位 {selectedException.start}-{selectedException.end}
          </Badge>
        ) : null}
        <div className="flex flex-wrap gap-1">
          {member.scheduledHours > member.loginHours ? (
            <Badge variant="destructive">登录缺口</Badge>
          ) : null}
          {member.exceptionExplanations.map((explanation) => {
            const exceptionKey = matrixExceptionKey(member.employeeId, explanation.anomalyCode)

            return (
              <Button
                key={explanation.id}
                asChild
                variant={exceptionKey === selectedExceptionKey ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-xs"
              >
                <Link
                  href={`/person-timeline?team=${encodeScopeId(matrix.team.id)}&group=${encodeScopeId(
                    matrix.group.id
                  )}&date=${matrix.date}&exception=${encodeScopeId(exceptionKey)}`}
                >
                  {explanation.title}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>
      <div className="grid gap-2">
        <MatrixTrack title="排班" rows={member.tracks.schedule} tone="schedule" focusEventIds={focusEventIds} />
        <MatrixTrack title="登录" rows={member.tracks.login} tone="login" focusEventIds={focusEventIds} />
        <MatrixTrack title="状态" rows={member.tracks.status} tone="status" focusEventIds={focusEventIds} />
      </div>
    </div>
  )
}

function matrixExceptionKey(employeeId: string, anomalyCode: string) {
  return `${employeeId}::${anomalyCode}`
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
  focusEventIds,
}: {
  title: string
  rows: TimelineEvent[]
  tone: "schedule" | "login" | "status"
  focusEventIds: Set<string>
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
            const isFocused = focusEventIds.has(item.id)
            return (
              <span
                key={item.id}
                className={cn(
                  "absolute top-1 h-6 rounded-sm border px-2 text-xs leading-6",
                  matrixToneClass[tone],
                  isFocused ? "ring-2 ring-primary ring-offset-1 ring-offset-background" : ""
                )}
                data-focus-event={isFocused ? item.id : undefined}
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

function SummaryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/30 p-2">
      <div className="text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold tabular-nums">{value}</div>
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

const priorityLabel = {
  high: "高优先级",
  medium: "中优先级",
  low: "低优先级",
}

const trackLabel = {
  schedule: "排班",
  login: "登录",
  status: "状态",
}

const queueFilters: Array<{ value: MatrixQueueFilter; label: string }> = [
  { value: "all", label: "全部" },
  { value: "high", label: "高优先级" },
  { value: "login", label: "登录缺口" },
  { value: "status", label: "状态不一致" },
]
