type ReviewScopeParams = {
  query?: string
  planId?: string
  date?: string
  project?: string
  site?: string
  intervalStart?: string
  intervalEnd?: string
  startTime?: string
  endTime?: string
  status?: string
}

function setIfPresent(
  searchParams: URLSearchParams,
  key: string,
  value?: string
) {
  const normalizedValue = value?.trim()
  if (normalizedValue) {
    searchParams.set(key, normalizedValue)
  }
}

export function buildReviewScopeLabel(scope: {
  planId?: string
  date?: string
  project?: string
  site?: string
  intervalStart?: string
  intervalEnd?: string
  startTime?: string
  endTime?: string
}) {
  const interval =
    (scope.intervalStart && scope.intervalEnd
      ? `${scope.intervalStart}-${scope.intervalEnd}`
      : undefined) ??
    (scope.startTime && scope.endTime
      ? `${scope.startTime}-${scope.endTime}`
      : undefined)

  return [scope.project, scope.site, scope.date, interval, scope.planId]
    .filter(Boolean)
    .join(" / ")
}

export function buildShiftDetailsHref(scope: ReviewScopeParams = {}) {
  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "query", scope.query)
  setIfPresent(searchParams, "status", scope.status)
  setIfPresent(searchParams, "planId", scope.planId)
  setIfPresent(searchParams, "date", scope.date)
  setIfPresent(searchParams, "project", scope.project)
  setIfPresent(searchParams, "site", scope.site)
  setIfPresent(searchParams, "intervalStart", scope.intervalStart ?? scope.startTime)
  setIfPresent(searchParams, "intervalEnd", scope.intervalEnd ?? scope.endTime)

  const suffix = searchParams.toString()
  return `/shift-details${suffix ? `?${suffix}` : ""}`
}

export function buildScheduleRisksHref(scope: ReviewScopeParams = {}) {
  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "query", scope.query)
  setIfPresent(searchParams, "planId", scope.planId)
  setIfPresent(searchParams, "date", scope.date)
  setIfPresent(searchParams, "project", scope.project)
  setIfPresent(searchParams, "site", scope.site)
  setIfPresent(searchParams, "intervalStart", scope.intervalStart ?? scope.startTime)
  setIfPresent(searchParams, "intervalEnd", scope.intervalEnd ?? scope.endTime)

  const suffix = searchParams.toString()
  return `/schedule-risks${suffix ? `?${suffix}` : ""}`
}

export function buildUnavailabilityHref(scope: ReviewScopeParams = {}) {
  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "query", scope.query)
  setIfPresent(searchParams, "status", scope.status)
  setIfPresent(searchParams, "project", scope.project)
  setIfPresent(searchParams, "site", scope.site)
  setIfPresent(searchParams, "date", scope.date)
  setIfPresent(searchParams, "startTime", scope.startTime ?? scope.intervalStart)
  setIfPresent(searchParams, "endTime", scope.endTime ?? scope.intervalEnd)

  const suffix = searchParams.toString()
  return `/unavailability${suffix ? `?${suffix}` : ""}`
}

export function buildPlanDetailHref(planId?: string) {
  const normalizedPlanId = planId?.trim()
  return normalizedPlanId
    ? `/schedule-plans/${encodeURIComponent(normalizedPlanId)}`
    : "/schedule-plans"
}
