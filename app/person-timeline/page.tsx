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
  buildFulfillmentMatrixReturnHref,
  buildPersonFulfillmentDetailHref,
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
type MatrixQueueFilter =
  | "all"
  | "high"
  | "login"
  | "status"
  | "missing_material"
  | "supervisor_judgment"
  | "data_check"

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
        {teams[0] ? <TeamWeekRiskDistributionPanel team={teams[0]} /> : null}
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

function TeamWeekRiskDistributionPanel({ team }: { team: FulfillmentTeamWeek }) {
  const distribution = team.weekRiskDistribution
  const drilldownHref = `/person-timeline?team=${encodeScopeId(team.id)}&date=${distribution.nextDrilldown.date}`

  return (
    <div className="grid gap-3 rounded-lg border p-3 xl:grid-cols-[280px_minmax(0,1fr)_220px]">
      <div className="grid content-start gap-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="text-sm font-medium">团队周风险分布</div>
            <div className="text-xs text-muted-foreground">
              {team.workplace} / {team.project}
            </div>
          </div>
          <Badge variant={distribution.riskLevel === "高" ? "destructive" : distribution.riskLevel === "中" ? "secondary" : "outline"}>
            {distribution.riskLevel}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">{distribution.headline}</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <SummaryMetric label="最高风险日" value={distribution.highestRiskDay.label} />
          <SummaryMetric label="风险分" value={`${distribution.riskScore}`} />
        </div>
      </div>
      <div className="grid content-start gap-2">
        <div className="text-xs text-muted-foreground">{distribution.primaryReason}</div>
        <div className="grid gap-2 md:grid-cols-7">
          {distribution.points.map((point) => (
            <Link
              key={point.date}
              href={`/person-timeline?team=${encodeScopeId(team.id)}&date=${point.date}`}
              className={cn(
                "grid gap-1 rounded-md border p-2 text-xs transition-colors hover:bg-muted",
                point.date === distribution.highestRiskDay.date ? "border-primary bg-primary/10" : "border-border"
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">{point.weekday}</span>
                <Badge variant={point.riskLevel === "高" ? "destructive" : "outline"} className="text-[10px]">
                  {point.score}
                </Badge>
              </div>
              <span className="text-muted-foreground">{point.label.replace(`${point.weekday} `, "")}</span>
              <span className="text-muted-foreground">缺 {point.gapPeople}</span>
              <span className="text-muted-foreground">异 {point.anomalyPeople}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="grid content-start gap-2 rounded-md border bg-muted/30 p-2 text-xs">
        <div>
          <div className="font-medium text-foreground">{distribution.rank.label}</div>
          <div className="mt-1 text-muted-foreground">{distribution.rank.reason}</div>
        </div>
        <div>
          <div className="font-medium text-foreground">建议下钻</div>
          <div className="mt-1 text-muted-foreground">
            {distribution.nextDrilldown.label} / {distribution.nextDrilldown.groupName}
          </div>
          <div className="mt-1 text-muted-foreground">{distribution.nextDrilldown.reason}</div>
        </div>
        <Button asChild variant="outline" size="sm" className="justify-start">
          <Link href={drilldownHref}>查看小组</Link>
        </Button>
      </div>
    </div>
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
  if (
    value === "high" ||
    value === "login" ||
    value === "status" ||
    value === "missing_material" ||
    value === "supervisor_judgment" ||
    value === "data_check"
  ) {
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

  if (
    queueFilter === "missing_material" ||
    queueFilter === "supervisor_judgment" ||
    queueFilter === "data_check"
  ) {
    return matrix.exceptionQueue.filter((item) => item.reviewGroup.code === queueFilter)
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
    ? buildPersonFulfillmentDetailHref({
        employeeId: selected.employeeId,
        date: selected.detailDate,
        teamId: matrix.team.id,
        groupId: matrix.group.id,
        returnDate: selected.detailDate,
        queueFilter,
        exceptionKey: selected.key,
      })
    : ""

  return (
    <aside className="grid gap-3 rounded-lg border p-3">
      {selected ? <SelectedExceptionFollowUpCard selected={selected} /> : null}
      {selected ? <SelectedExceptionComparisonCard selected={selected} /> : null}
      {selected ? <SelectedExceptionOwnerLoadComparisonCard selected={selected} /> : null}
      {selected ? <SelectedExceptionNextDayWatchlistCard selected={selected} /> : null}
      <TeamDayRiskTrendPanel trend={matrix.teamDayRiskTrend} />
      <TeamDayRiskDigestPanel summary={matrix.teamDayRiskDigest} />
      <ReviewLoadSummaryPanel summary={matrix.reviewLoadSummary} />
      <SupervisorDailyWorkloadPanel summary={matrix.supervisorDailyWorkload} />
      <ExceptionSourceSummaryPanel summary={matrix.exceptionSourceSummary} />
      <SupervisorHandoffOverviewPanel summary={matrix.supervisorHandoffOverview} />
      <div className="grid grid-cols-2 gap-2 text-xs">
        <SummaryMetric label="异常" value={`${matrix.exceptionQueueSummary.totalCount}`} />
        <SummaryMetric label="高优" value={`${matrix.exceptionQueueSummary.highPriorityCount}`} />
        <SummaryMetric label="登录缺口" value={`${matrix.exceptionQueueSummary.loginGapCount}`} />
        <SummaryMetric
          label="状态不一致"
          value={`${matrix.exceptionQueueSummary.statusMismatchCount}`}
        />
        <SummaryMetric label="需补材料" value={`${matrix.exceptionQueueSummary.missingMaterialCount}`} />
        <SummaryMetric
          label="待主管判断"
          value={`${matrix.exceptionQueueSummary.supervisorJudgmentCount}`}
        />
        <SummaryMetric label="需数据核对" value={`${matrix.exceptionQueueSummary.dataCheckCount}`} />
        <SummaryMetric label="超时关注" value={`${matrix.exceptionQueueSummary.agingWatchCount}`} />
        <SummaryMetric label="建议升级" value={`${matrix.exceptionQueueSummary.escalationCount}`} />
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
              <div className="text-muted-foreground">
                处理分组：{item.reviewGroup.label}，{item.reviewGroup.reason}
              </div>
              <div className="text-muted-foreground">
                超时等级：{item.agingEscalation.level}，等待 {item.agingEscalation.waitingLabel}
              </div>
              <div className="text-muted-foreground">排序依据：{item.sortReason}</div>
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
            <div>排序依据：{selected.sortReason}</div>
            <div>证据：{selected.evidence}</div>
            <div>主管判断：{selected.supervisorAction}</div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">超时与升级</div>
              <Badge
                variant={
                  selected.agingEscalation.level === "需要升级"
                    ? "destructive"
                    : selected.agingEscalation.level === "接近超时"
                      ? "secondary"
                      : "outline"
                }
              >
                {selected.agingEscalation.level}
              </Badge>
            </div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>识别时间：{selected.agingEscalation.detectedAt}</div>
              <div>等待时长：{selected.agingEscalation.waitingLabel}</div>
              <div>升级原因：{selected.agingEscalation.reason}</div>
              <div>关注角色：{selected.agingEscalation.escalationTarget}</div>
              <div>下一复核：{selected.agingEscalation.nextReviewWindow}</div>
              <div>{selected.agingEscalation.queueHint}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border bg-muted/30 p-2">
            <div className="text-sm font-medium">处理建议</div>
            <div className="grid gap-2 text-xs">
              <div>
                <div className="font-medium text-foreground">优先核对</div>
                <div className="mt-1 text-muted-foreground">
                  {selected.handlingGuide.priorityChecks.join(" / ")}
                </div>
              </div>
              <div>
                <div className="font-medium text-foreground">需补信息</div>
                <div className="mt-1 text-muted-foreground">
                  {selected.handlingGuide.requiredInfo.join(" / ")}
                </div>
              </div>
              <div className="text-muted-foreground">
                沟通对象：{selected.handlingGuide.communicationTarget}
              </div>
              <div className="text-muted-foreground">{selected.handlingGuide.boundary}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">处理归类</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">{selected.handlingOutcome.category}</div>
              <div>归类原因：{selected.handlingOutcome.reason}</div>
              <div>负责角色：{selected.handlingOutcome.ownerRole}</div>
              <div>复核重点：{selected.handlingOutcome.nextReviewPoint}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">处理结论建议</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div className="font-medium text-foreground">
                {selected.resolutionDraft.suggestedConclusion}
              </div>
              <div>需核材料：{selected.resolutionDraft.requiredEvidence.join(" / ")}</div>
              <div>沟通对象：{selected.resolutionDraft.communicationTarget}</div>
              <div>负责角色：{selected.resolutionDraft.ownerRole}</div>
              <div>下一复核：{selected.resolutionDraft.nextReviewPoint}</div>
              <div>{selected.resolutionDraft.riskIfOpen}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">复核清单</div>
              <div className="text-xs text-muted-foreground">
                已齐 {selected.closureChecklist.readyCount} 项 / 待补{" "}
                {selected.closureChecklist.missingCount} 项
              </div>
            </div>
            <div className="text-xs font-medium text-foreground">
              {selected.closureChecklist.currentJudgment}
            </div>
            <div className="grid gap-2">
              {selected.closureChecklist.items.map((item) => (
                <div key={item.label} className="rounded-md border p-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{item.label}</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="mt-1 text-muted-foreground">负责角色：{item.ownerRole}</div>
                  <div className="text-muted-foreground">{item.judgmentImpact}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">交接摘要</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>交接对象：{selected.handoffSummary.recipient}</div>
              <div>{selected.handoffSummary.summary}</div>
              <div>待核对：{selected.handoffSummary.openQuestions.join(" / ")}</div>
              <div>下一触点：{selected.handoffSummary.nextTouchpoint}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">沟通上下文</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>沟通对象：{selected.communicationContext.audience}</div>
              <div>{selected.communicationContext.purpose}</div>
              <div>关键说明：{selected.communicationContext.keyMessages.join(" / ")}</div>
              <div>引用证据：{selected.communicationContext.evidenceToReference.join(" / ")}</div>
              <div>待确认：{selected.communicationContext.openQuestions.join(" / ")}</div>
              <div>下一沟通点：{selected.communicationContext.nextConversation}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">数据核对提示</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>相关记录：{selected.dataCheckReadiness.sourceRecords.join(" / ")}</div>
              <div>核对字段：{selected.dataCheckReadiness.checkFields.join(" / ")}</div>
              <div>{selected.dataCheckReadiness.riskNote}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium">关联数据质量</div>
              <Badge variant="outline">{selected.dataQualityLinks.length} 项</Badge>
            </div>
            {selected.dataQualityLinks.length === 0 ? (
              <div className="text-xs text-muted-foreground">当前异常没有关联的数据质量问题。</div>
            ) : (
              <div className="grid gap-2">
                {selected.dataQualityLinks.map((issue) => (
                  <div key={issue.issueId} className="grid gap-2 rounded-md border p-2 text-xs">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="font-medium text-foreground">
                          {issue.issueId} / {issue.title}
                        </div>
                        <div className="mt-1 text-muted-foreground">
                          {issue.sourceLabel} / 负责人：{issue.owner}
                        </div>
                      </div>
                      <Badge variant={issue.severity === "high" ? "destructive" : "secondary"}>
                        {issue.severity === "high" ? "高" : issue.severity === "medium" ? "中" : "低"}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground">
                      匹配记录：{issue.matchedRecords.join(" / ") || "无"}
                    </div>
                    <div className="text-muted-foreground">
                      核对字段：{issue.matchedFields.join(" / ")}
                    </div>
                    <div className="text-muted-foreground">{issue.reason}</div>
                    <div className="text-muted-foreground">{issue.recommendation}</div>
                    <div>
                      <Button asChild size="sm" variant="outline" className="h-7 px-2 text-xs">
                        <Link href={issue.href}>查看质量详情</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">数据修复前置判断</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>数据管理员介入：{selected.dataQualityRepairPrep.needsDataOwner ? "需要" : "暂不需要"}</div>
              <div>优先级：{selected.dataQualityRepairPrep.priority}</div>
              <div>介入原因：{selected.dataQualityRepairPrep.reason}</div>
              <div>负责团队：{selected.dataQualityRepairPrep.ownerTeam}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">准备材料</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>记录：{selected.repairMaterials.records.join(" / ")}</div>
              <div>字段：{selected.repairMaterials.fields.join(" / ")}</div>
              <div>说明：{selected.repairMaterials.supportingNotes.join(" / ")}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">影响范围</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>影响对象：{selected.dataQualityImpactScope.impactedObjects.join(" / ")}</div>
              <div>影响对比：{selected.dataQualityImpactScope.impactedComparisons.join(" / ")}</div>
              <div>{selected.dataQualityImpactScope.excludedScope}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">跟进状态</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>跟进人：{selected.supervisorFollowUp.owner}</div>
              <div>状态：{selected.supervisorFollowUp.status}</div>
              <div>下一核对：{selected.supervisorFollowUp.nextCheckAt}</div>
              <div>当前重点：{selected.supervisorFollowUp.currentFocus}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">跟进缺口</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>说明：{selected.followUpGaps.missingNotes.join(" / ")}</div>
              <div>记录：{selected.followUpGaps.missingRecords.join(" / ")}</div>
              <div>结论：{selected.followUpGaps.missingDecisions.join(" / ")}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">小组跟进汇总</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>队列位置：{selected.groupFollowUpRollup.queuePosition}</div>
              <div>待跟进：{selected.groupFollowUpRollup.sameGroupOpenCount} 项</div>
              <div>高优先：{selected.groupFollowUpRollup.highPriorityOpenCount} 项</div>
              <div>{selected.groupFollowUpRollup.groupRiskNote}</div>
            </div>
          </div>
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">证据汇总</div>
            <div className="grid gap-1 text-xs text-muted-foreground">
              <div>{selected.evidenceSummary.schedule}</div>
              <div>{selected.evidenceSummary.login}</div>
              <div>{selected.evidenceSummary.status}</div>
              <div className="pt-1 font-medium text-foreground">{selected.evidenceSummary.conclusion}</div>
            </div>
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
          <div className="grid gap-2 rounded-md border p-2">
            <div className="text-sm font-medium">处理记录</div>
            {selected.handlingRecords.map((record) => (
              <div key={`${record.recordedAt}-${record.conclusion}`} className="grid gap-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{record.recorder}</span>
                  <span className="text-muted-foreground">{record.recordedAt}</span>
                </div>
                <div className="text-muted-foreground">{record.conclusion}</div>
                <div className="text-muted-foreground">后续跟进：{record.followUp}</div>
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

function ReviewLoadSummaryPanel({
  summary,
}: {
  summary: FulfillmentGroupMatrix["reviewLoadSummary"]
}) {
  return (
    <div className="grid gap-3 rounded-md border bg-muted/30 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">复核负载</div>
          <div className="text-xs text-muted-foreground">
            当前小组待复核 {summary.totalOpenCount} 项，高优先 {summary.highPriorityOpenCount} 项
          </div>
        </div>
        <Badge variant={summary.highPriorityOpenCount > 0 ? "destructive" : "outline"}>
          待补 {summary.missingItemCount}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <SummaryMetric label="已齐材料" value={`${summary.readyItemCount}`} />
        <SummaryMetric label="待补材料" value={`${summary.missingItemCount}`} />
      </div>
      <div className="rounded-md border bg-background p-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">最高负载</span>
          <Badge variant="secondary">{summary.topReviewGroup.label}</Badge>
        </div>
        <div className="mt-1 text-muted-foreground">
          {summary.topReviewGroup.count} 项，{summary.topReviewGroup.reason}
        </div>
      </div>
      {summary.nextPriority ? (
        <div className="rounded-md border bg-background p-2 text-xs">
          <div className="font-medium">下一优先查看</div>
          <div className="mt-1 text-muted-foreground">
            {summary.nextPriority.employeeId} {summary.nextPriority.employeeName} /{" "}
            {summary.nextPriority.title}
          </div>
          <div className="mt-1 text-muted-foreground">{summary.nextPriority.reason}</div>
        </div>
      ) : (
        <div className="rounded-md border bg-background p-2 text-xs text-muted-foreground">
          当前没有待复核异常。
        </div>
      )}
      <div className="grid gap-2">
        {summary.groups.map((group) => (
          <div key={group.code} className="grid gap-1 rounded-md border bg-background p-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{group.label}</span>
              <span className="text-muted-foreground">
                {group.count} 项 / 高优 {group.highPriorityCount}
              </span>
            </div>
            <div className="text-muted-foreground">
              已齐 {group.readyItemCount} / 待补 {group.missingItemCount}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SelectedExceptionComparisonCard({
  selected,
}: {
  selected: FulfillmentMatrixExceptionQueueItem
}) {
  const comparison = selected.exceptionComparison

  return (
    <div className="grid gap-2 rounded-md border p-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">异常对比</div>
          <div className="text-xs text-muted-foreground">{comparison.priorityReason}</div>
        </div>
        <Badge variant="outline">{comparison.rankLabel}</Badge>
      </div>
      {comparison.comparedWith ? (
        <div className="grid gap-2 text-xs">
          <div className="rounded-md border bg-muted/30 p-2">
            <div className="font-medium text-foreground">
              对比：{comparison.comparedWith.employeeName} / {comparison.comparedWith.title}
            </div>
            <div className="mt-1 text-muted-foreground">
              {priorityLabel[comparison.comparedWith.priority]} / {comparison.comparedWith.reviewGroup} /{" "}
              {comparison.comparedWith.agingLevel} / 影响{" "}
              {comparison.comparedWith.impactHours.toFixed(2).replace(/\\.00$/, "")}h
            </div>
          </div>
          <div className="text-muted-foreground">{comparison.mainDifference}</div>
          <div className="rounded-md border p-2 text-muted-foreground">
            <span className="font-medium text-foreground">关注顺序：</span>
            {comparison.focusHint}
          </div>
        </div>
      ) : (
        <div className="text-xs text-muted-foreground">{comparison.mainDifference}</div>
      )}
    </div>
  )
}

function SelectedExceptionOwnerLoadComparisonCard({
  selected,
}: {
  selected: FulfillmentMatrixExceptionQueueItem
}) {
  const comparison = selected.ownerLoadComparison

  return (
    <div className="grid gap-2 rounded-md border p-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">责任人负载对比</div>
          <div className="text-xs text-muted-foreground">{comparison.loadDifference}</div>
        </div>
        <Badge variant={comparison.currentOwner.escalationCount > 0 ? "destructive" : "outline"}>
          {comparison.currentOwner.ownerRole}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <SummaryMetric label="当前责任人" value={`${comparison.currentOwner.itemCount} 项`} />
        <SummaryMetric label="建议升级" value={`${comparison.currentOwner.escalationCount} 项`} />
      </div>
      <div className="rounded-md border bg-muted/30 p-2 text-xs">
        <div className="font-medium text-foreground">{comparison.busiestOwner.ownerRole}</div>
        <div className="mt-1 text-muted-foreground">{comparison.busiestOwner.reason}</div>
      </div>
      {comparison.comparedOwner ? (
        <div className="rounded-md border p-2 text-xs">
          <div className="font-medium text-foreground">对比角色：{comparison.comparedOwner.ownerRole}</div>
          <div className="mt-1 text-muted-foreground">
            {comparison.comparedOwner.itemCount} 项 / 影响 {comparison.comparedOwner.impactHours.toFixed(2)}h
          </div>
          <div className="mt-1 text-muted-foreground">{comparison.comparedOwner.reason}</div>
        </div>
      ) : null}
      <div className="rounded-md border p-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">处理顺序：</span>
        {comparison.focusOrder}
      </div>
    </div>
  )
}

function SelectedExceptionNextDayWatchlistCard({
  selected,
}: {
  selected: FulfillmentMatrixExceptionQueueItem
}) {
  const watchlist = selected.nextDayWatchlist

  return (
    <div className="grid gap-2 rounded-md border p-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">次日关注清单</div>
          <div className="text-xs text-muted-foreground">{watchlist.headline}</div>
        </div>
        <Badge variant="outline">{watchlist.label}</Badge>
      </div>
      <div className="grid gap-2">
        {watchlist.items.map((item) => (
          <div key={item.key} className="rounded-md border bg-muted/30 p-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="font-medium text-foreground">
                {item.employeeId} {item.employeeName}
              </div>
              <Badge variant={item.priority === "high" ? "destructive" : "outline"}>
                {item.orderLabel} / {priorityLabel[item.priority]}
              </Badge>
            </div>
            <div className="mt-1 text-muted-foreground">责任角色：{item.ownerRole}</div>
            <div className="text-muted-foreground">来源：{item.source}</div>
            <div className="mt-1 text-muted-foreground">{item.reason}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamDayRiskTrendPanel({
  trend,
}: {
  trend: FulfillmentGroupMatrix["teamDayRiskTrend"]
}) {
  return (
    <div className="grid gap-2 rounded-md border p-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">风险趋势</div>
          <div className="text-xs text-muted-foreground">{trend.headline}</div>
        </div>
        <Badge
          variant={
            trend.currentDay.riskLevel === "高"
              ? "destructive"
              : trend.currentDay.riskLevel === "中"
                ? "secondary"
                : "outline"
          }
        >
          {trend.direction}
        </Badge>
      </div>
      <div className="grid gap-2 text-xs">
        <div className="grid grid-cols-2 gap-2">
          <SummaryMetric label="当前日" value={`${trend.currentDay.label} ${trend.currentDay.score}`} />
          <SummaryMetric label="最高风险日" value={`${trend.highestRiskDay.label} ${trend.highestRiskDay.score}`} />
        </div>
        <div className="rounded-md border bg-muted/30 p-2 text-muted-foreground">
          <div className="font-medium text-foreground">{trend.comparison.label}</div>
          <div className="mt-1">{trend.comparison.summary}</div>
        </div>
        <div className="grid gap-1">
          {trend.points.map((point) => (
            <div key={point.date} className="grid grid-cols-[72px_minmax(0,1fr)_36px] items-center gap-2">
              <span className="text-muted-foreground">{point.label}</span>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full",
                    point.riskLevel === "高"
                      ? "bg-destructive"
                      : point.riskLevel === "中"
                        ? "bg-primary"
                        : "bg-muted-foreground"
                  )}
                  style={{ width: `${point.score}%` }}
                />
              </div>
              <span className="text-right font-medium">{point.score}</span>
            </div>
          ))}
        </div>
        <div className="rounded-md border p-2 text-muted-foreground">
          <span className="font-medium text-foreground">下一关注：</span>
          {trend.nextFocus.reason}
        </div>
      </div>
    </div>
  )
}

function SelectedExceptionFollowUpCard({
  selected,
}: {
  selected: FulfillmentMatrixExceptionQueueItem
}) {
  return (
    <div className="grid gap-2 rounded-md border bg-primary/10 p-2">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">跟进时间线</div>
          <div className="text-xs text-muted-foreground">
            {selected.employeeId} {selected.employeeName} / {selected.title}
          </div>
        </div>
        <Badge variant={selected.priority === "high" ? "destructive" : "outline"}>
          {priorityLabel[selected.priority]}
        </Badge>
      </div>
      <div className="grid gap-2">
        {selected.followUpTimeline.map((item) => (
          <div key={`${item.stage}-${item.time}`} className="rounded-md border bg-background/80 p-2 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{item.stage}</span>
              <Badge variant="secondary" className="text-[10px]">
                {item.status}
              </Badge>
            </div>
            <div className="mt-1 text-muted-foreground">
              {item.time} / {item.owner}
            </div>
            <div className="text-muted-foreground">{item.summary}</div>
          </div>
        ))}
      </div>
    </div>
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
  return buildFulfillmentMatrixReturnHref({
    teamId: matrix.team.id,
    groupId: matrix.group.id,
    date: matrix.date,
    queueFilter,
    exceptionKey,
  })
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

function SupervisorDailyWorkloadPanel({
  summary,
}: {
  summary: FulfillmentGroupMatrix["supervisorDailyWorkload"]
}) {
  return (
    <div className="grid gap-3 rounded-md border bg-muted/30 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">今日工作量</div>
          <div className="text-xs text-muted-foreground">
            待关注 {summary.totalFocusItems} 项，影响 {formatOneDecimal(summary.totalImpactHours)}h
          </div>
        </div>
        <Badge variant={summary.escalationItems > 0 ? "destructive" : "outline"}>
          建议升级 {summary.escalationItems}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <SummaryMetric label="高优先" value={`${summary.highPriorityItems}`} />
        <SummaryMetric label="超时关注" value={`${summary.agingWatchItems}`} />
        <SummaryMetric label="角色数" value={`${summary.ownerLoads.length}`} />
      </div>
      <div className="rounded-md border bg-background p-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">最高负载角色</span>
          <Badge variant="secondary">{summary.busiestOwner.ownerRole}</Badge>
        </div>
        <div className="mt-1 text-muted-foreground">{summary.busiestOwner.reason}</div>
      </div>
      {summary.nextFocus ? (
        <div className="rounded-md border bg-background p-2 text-xs">
          <div className="font-medium">下一优先查看</div>
          <div className="mt-1 text-muted-foreground">
            {summary.nextFocus.employeeId} {summary.nextFocus.employeeName} / {summary.nextFocus.title}
          </div>
          <div className="mt-1 text-muted-foreground">
            {summary.nextFocus.ownerRole}：{summary.nextFocus.reason}
          </div>
        </div>
      ) : null}
      <div className="grid gap-2">
        {summary.ownerLoads.map((owner) => (
          <div key={owner.ownerRole} className="rounded-md border bg-background p-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{owner.ownerRole}</span>
              <span className="text-muted-foreground">{owner.itemCount} 项</span>
            </div>
            <div className="mt-1 text-muted-foreground">
              高优先 {owner.highPriorityCount} / 超时 {owner.agingWatchCount} / 建议升级{" "}
              {owner.escalationCount}
            </div>
            <div className="text-muted-foreground">影响 {formatOneDecimal(owner.impactHours)}h</div>
            <div className="text-muted-foreground">{owner.focus}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExceptionSourceSummaryPanel({
  summary,
}: {
  summary: FulfillmentGroupMatrix["exceptionSourceSummary"]
}) {
  return (
    <div className="grid gap-3 rounded-md border bg-muted/30 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">异常来源</div>
          <div className="text-xs text-muted-foreground">
            来源 {summary.totalSources} 类，主要看 {summary.primarySource.label}
          </div>
        </div>
        <Badge variant={summary.primarySource.itemCount > 0 ? "secondary" : "outline"}>
          {summary.primarySource.itemCount} 项
        </Badge>
      </div>
      <div className="rounded-md border bg-background p-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">主要来源</span>
          <Badge variant="secondary">{summary.primarySource.label}</Badge>
        </div>
        <div className="mt-1 text-muted-foreground">{summary.primarySource.reason}</div>
      </div>
      {summary.nextSource ? (
        <div className="rounded-md border bg-background p-2 text-xs">
          <div className="font-medium">下一优先来源</div>
          <div className="mt-1 text-muted-foreground">
            {summary.nextSource.label}：{summary.nextSource.reason}
          </div>
        </div>
      ) : null}
      <div className="grid gap-2">
        {summary.sources.map((source) => (
          <div key={source.track} className="rounded-md border bg-background p-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{source.label}</span>
              <span className="text-muted-foreground">{source.itemCount} 项</span>
            </div>
            <div className="mt-1 text-muted-foreground">
              高优先 {source.highPriorityCount} / 超时 {source.agingWatchCount} / 建议升级{" "}
              {source.escalationCount}
            </div>
            <div className="text-muted-foreground">影响 {formatOneDecimal(source.impactHours)}h</div>
            <div className="text-muted-foreground">{source.focus}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SupervisorHandoffOverviewPanel({
  summary,
}: {
  summary: FulfillmentGroupMatrix["supervisorHandoffOverview"]
}) {
  return (
    <div className="grid gap-3 rounded-md border bg-muted/30 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">交接概览</div>
          <div className="text-xs text-muted-foreground">
            待交接 {summary.totalHandoffItems} 项，待核对问题 {summary.openQuestionCount} 个
          </div>
        </div>
        <Badge variant={summary.escalationItems > 0 ? "destructive" : "outline"}>
          建议升级 {summary.escalationItems}
        </Badge>
      </div>
      <div className="rounded-md border bg-background p-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">主要接收人</span>
          <Badge variant="secondary">{summary.topRecipient.recipient}</Badge>
        </div>
        <div className="mt-1 text-muted-foreground">{summary.topRecipient.reason}</div>
      </div>
      {summary.nextHandoff ? (
        <div className="rounded-md border bg-background p-2 text-xs">
          <div className="font-medium">下一优先交接</div>
          <div className="mt-1 text-muted-foreground">
            {summary.nextHandoff.employeeName} / {summary.nextHandoff.title}
          </div>
          <div className="mt-1 text-muted-foreground">
            {summary.nextHandoff.recipient}：{summary.nextHandoff.reason}
          </div>
        </div>
      ) : null}
      <div className="grid gap-2">
        {summary.recipients.map((recipient) => (
          <div key={recipient.recipient} className="rounded-md border bg-background p-2 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{recipient.recipient}</span>
              <span className="text-muted-foreground">{recipient.itemCount} 项</span>
            </div>
            <div className="mt-1 text-muted-foreground">
              高优先 {recipient.highPriorityCount} / 超时 {recipient.agingWatchCount} / 建议升级{" "}
              {recipient.escalationCount}
            </div>
            <div className="text-muted-foreground">待核对问题 {recipient.openQuestionCount} 个</div>
            <div className="text-muted-foreground">下一触点：{recipient.nextTouchpoint}</div>
            <div className="text-muted-foreground">{recipient.focus}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function TeamDayRiskDigestPanel({
  summary,
}: {
  summary: FulfillmentGroupMatrix["teamDayRiskDigest"]
}) {
  return (
    <div className="grid gap-3 rounded-md border bg-muted/30 p-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="text-sm font-medium">当日风险</div>
          <div className="text-xs text-muted-foreground">{summary.headline}</div>
        </div>
        <Badge variant={summary.riskLevel === "高" ? "destructive" : "secondary"}>
          {summary.riskLevel}风险 {summary.riskScore}
        </Badge>
      </div>
      <div className="rounded-md border bg-background p-2 text-xs">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium">主要风险</span>
          <Badge variant="secondary">{summary.primaryRisk.label}</Badge>
        </div>
        <div className="mt-1 text-muted-foreground">{summary.primaryRisk.reason}</div>
      </div>
      {summary.nextFocus ? (
        <div className="rounded-md border bg-background p-2 text-xs">
          <div className="font-medium">下一优先查看</div>
          <div className="mt-1 text-muted-foreground">
            {summary.nextFocus.employeeName} / {summary.nextFocus.title}
          </div>
          <div className="mt-1 text-muted-foreground">{summary.nextFocus.reason}</div>
        </div>
      ) : null}
      <div className="grid gap-2">
        {summary.signals.map((signal) => (
          <div
            key={signal.label}
            className={cn(
              "rounded-md border bg-background p-2 text-xs",
              teamDayRiskSignalClass[signal.tone]
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{signal.label}</span>
              <span className="text-muted-foreground">{signal.value}</span>
            </div>
            <div className="mt-1 text-muted-foreground">{signal.reason}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatOneDecimal(value: number) {
  return (Math.round(value * 10) / 10).toFixed(1)
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

const teamDayRiskSignalClass = {
  high: "border-red-200 dark:border-red-900",
  medium: "border-amber-200 dark:border-amber-900",
  low: "border-emerald-200 dark:border-emerald-900",
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
  { value: "missing_material", label: "需补材料" },
  { value: "supervisor_judgment", label: "待主管判断" },
  { value: "data_check", label: "需数据核对" },
]
