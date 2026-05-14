type ReviewScopeParams = {
  from?: string
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
  draft?: string
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

  setIfPresent(searchParams, "from", scope.from)
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

export function buildSchedulePlansHref(scope: ReviewScopeParams = {}) {
  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "query", scope.query)
  setIfPresent(searchParams, "status", scope.status)
  setIfPresent(searchParams, "draft", scope.draft)

  const suffix = searchParams.toString()
  return `/schedule-plans${suffix ? `?${suffix}` : ""}`
}

export function buildNewSchedulePlanHref(scope: ReviewScopeParams = {}) {
  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "query", scope.query)
  setIfPresent(searchParams, "status", scope.status)

  const suffix = searchParams.toString()
  return `/schedule-plans/new${suffix ? `?${suffix}` : ""}`
}

export function buildScheduleRisksHref(scope: ReviewScopeParams = {}) {
  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "from", scope.from)
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

  setIfPresent(searchParams, "from", scope.from)
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

export function buildPlanDetailHref(
  planId?: string,
  scope: ReviewScopeParams = {},
) {
  const normalizedPlanId = planId?.trim()
  if (!normalizedPlanId) {
    return buildSchedulePlansHref(scope)
  }

  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "from", scope.from)
  setIfPresent(searchParams, "query", scope.query)
  setIfPresent(searchParams, "status", scope.status)
  setIfPresent(searchParams, "draft", scope.draft)
  setIfPresent(searchParams, "date", scope.date)
  setIfPresent(searchParams, "project", scope.project)
  setIfPresent(searchParams, "site", scope.site)
  setIfPresent(searchParams, "intervalStart", scope.intervalStart ?? scope.startTime)
  setIfPresent(searchParams, "intervalEnd", scope.intervalEnd ?? scope.endTime)

  const suffix = searchParams.toString()
  return `/schedule-plans/${encodeURIComponent(normalizedPlanId)}${
    suffix ? `?${suffix}` : ""
  }`
}

export function buildPlanEditHref(
  planId?: string,
  scope: ReviewScopeParams = {},
) {
  const normalizedPlanId = planId?.trim()
  if (!normalizedPlanId) {
    return buildSchedulePlansHref(scope)
  }

  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "from", scope.from)
  setIfPresent(searchParams, "query", scope.query)
  setIfPresent(searchParams, "status", scope.status)
  setIfPresent(searchParams, "date", scope.date)
  setIfPresent(searchParams, "project", scope.project)
  setIfPresent(searchParams, "site", scope.site)
  setIfPresent(searchParams, "intervalStart", scope.intervalStart ?? scope.startTime)
  setIfPresent(searchParams, "intervalEnd", scope.intervalEnd ?? scope.endTime)

  const suffix = searchParams.toString()
  return `/schedule-plans/${encodeURIComponent(normalizedPlanId)}/edit${
    suffix ? `?${suffix}` : ""
  }`
}

export function buildScheduleRiskDetailHref(
  riskId: string,
  scope: ReviewScopeParams = {},
) {
  const normalizedRiskId = riskId.trim()
  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "from", scope.from)
  setIfPresent(searchParams, "planId", scope.planId)
  setIfPresent(searchParams, "date", scope.date)
  setIfPresent(searchParams, "project", scope.project)
  setIfPresent(searchParams, "site", scope.site)
  setIfPresent(searchParams, "intervalStart", scope.intervalStart ?? scope.startTime)
  setIfPresent(searchParams, "intervalEnd", scope.intervalEnd ?? scope.endTime)

  const suffix = searchParams.toString()
  return `/schedule-risks/${encodeURIComponent(normalizedRiskId)}${
    suffix ? `?${suffix}` : ""
  }`
}

export function buildUnavailabilityDetailHref(
  unavailabilityId: string,
  scope: ReviewScopeParams = {},
) {
  const normalizedId = unavailabilityId.trim()
  const searchParams = new URLSearchParams()

  setIfPresent(searchParams, "from", scope.from)
  setIfPresent(searchParams, "query", scope.query)
  setIfPresent(searchParams, "status", scope.status)
  setIfPresent(searchParams, "date", scope.date)
  setIfPresent(searchParams, "project", scope.project)
  setIfPresent(searchParams, "site", scope.site)
  setIfPresent(searchParams, "startTime", scope.startTime ?? scope.intervalStart)
  setIfPresent(searchParams, "endTime", scope.endTime ?? scope.intervalEnd)

  const suffix = searchParams.toString()
  return `/unavailability/${encodeURIComponent(normalizedId)}${
    suffix ? `?${suffix}` : ""
  }`
}

export function buildReviewBackLink(
  scope: ReviewScopeParams,
  fallback: { href: string; label: string },
) {
  switch (scope.from) {
    case "schedule-plans-list":
      return {
        href: buildSchedulePlansHref(scope),
        label: "返回计划列表",
      }
    case "schedule-plans":
      return {
        href: buildPlanDetailHref(scope.planId, scope),
        label: "返回计划详情",
      }
    case "schedule-risks":
      return {
        href: buildScheduleRisksHref(scope),
        label: "返回风险列表",
      }
    case "unavailability":
      return {
        href: buildUnavailabilityHref(scope),
        label: "返回不可用",
      }
    case "shift-details":
      return {
        href: buildShiftDetailsHref(scope),
        label: "返回班次",
      }
    default:
      return fallback
  }
}
