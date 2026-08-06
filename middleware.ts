import { NextResponse, type NextRequest } from "next/server"

// 阶段 2 旧路由重定向（动态深链兜底）：next.config.mjs 只覆盖列表级固定页，
// 生效映射下尚未迁移的动态子路由在此以 307 映射到新工作台，并透传 searchParams。
// 只处理下方明确清单；其余路径（含 /api、/_next、静态资源）一律放行。

// 排班计划详情页尚未迁移，先映射到排班计划台列表并保留 query。
// /schedule-plans/new 与 /schedule-plans/production 仍是现役页面、
// /schedule-plans/[planId]/edit 承载草稿编辑，均不拦截。
const SCHEDULE_PLAN_DETAIL_PATTERN = /^\/schedule-plans\/(?!new$|production$)[^/]+$/

// 暂缓映射（保留预定写法，待目标内容迁移后启用）：
// /data-quality/comparison-runs/[runId] → /execution（307，保留 query）——待阶段6执行页承接比对运行详情后启用
// /data-quality/review-cases/[caseId] → /execution（307，保留 query）——待阶段6执行页承接复核案例后启用
// const COMPARISON_RUN_DETAIL_PATTERN = /^\/data-quality\/comparison-runs\/[^/]+$/
// const REVIEW_CASE_DETAIL_PATTERN = /^\/data-quality\/review-cases\/[^/]+$/

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const target = resolveLegacyDeepLinkTarget(pathname)

  if (!target) {
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL(`${target}${search}`, request.url), 307)
}

function resolveLegacyDeepLinkTarget(pathname: string): string | null {
  if (SCHEDULE_PLAN_DETAIL_PATTERN.test(pathname)) {
    return "/schedule-desk"
  }

  return null
}

export const config = {
  // 仅上述动态深链族进入兜底逻辑，其余路径不进入 middleware。
  matcher: ["/schedule-plans/:path*"],
}
