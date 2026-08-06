/** @type {import('next').NextConfig} */

// 阶段 2 旧路由重定向：列表级固定页映射走静态重定向。
// 过渡期临时重定向（permanent: false，307）：浏览器不永久缓存，将来启用暂缓映射时
// 已访问客户端仍能看到新映射；旧路由退役删除代码时本表一并移除。
// 映射表中所有 destination 均不是任何 source，不存在重定向循环。
// 长期保留（不重定向）：/data-quality 根、/data-quality/[batchId]、
// /data-quality/uploads/new、/data-quality/field-mapping-templates/**（导入弹窗深链目标），
// 以及 /schedule-plans/new、/schedule-plans/[planId]/edit、/master-data/agents/new 等动态子路由
// （动态深链兜底见根目录 middleware.ts）。
const legacyRouteRedirects = [
  { source: "/dashboard", destination: "/schedule-desk", permanent: false },
  { source: "/schedule-plans", destination: "/schedule-desk", permanent: false },
  { source: "/actual-logs", destination: "/execution", permanent: false },
  { source: "/actual-logs/production", destination: "/execution", permanent: false },
  { source: "/unavailability", destination: "/base-config?tab=employees", permanent: false },
  { source: "/master-data", destination: "/base-config?tab=employees", permanent: false },
  { source: "/master-data/agents", destination: "/base-config?tab=employees", permanent: false },
  { source: "/master-data/skills", destination: "/base-config?tab=employees", permanent: false },
  { source: "/master-data/organizations", destination: "/base-config", permanent: false },
  { source: "/master-data/sites", destination: "/base-config", permanent: false },
  { source: "/master-data/vendors", destination: "/base-config", permanent: false },

  // 暂缓映射（保留预定写法，启用时同样使用过渡期临时重定向）：
  // { source: "/demand-plans", destination: "/schedule-desk", permanent: false }, // 待阶段4版本抽屉承接需求内容后启用
  // { source: "/shift-details", destination: "/schedule-desk?view=shifts", permanent: false }, // 待阶段4降级视图承接后启用
  // { source: "/schedule-risks", destination: "/schedule-desk?view=risks", permanent: false }, // 待阶段4降级视图承接后启用
  // { source: "/data-quality/versions", destination: "/schedule-desk?panel=versions", permanent: false }, // 待阶段4版本抽屉承接后启用
  // { source: "/data-quality/review-cases", destination: "/execution", permanent: false }, // 待阶段6执行页承接复核案例后启用
]

const nextConfig = {
  redirects: async () => legacyRouteRedirects,
}

export default nextConfig
