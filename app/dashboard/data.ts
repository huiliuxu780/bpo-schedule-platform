export const metricCards = [
  {
    title: "预测需要工时",
    value: "18,560.5h",
    change: "+3.21%",
    insight: "需求波峰仍集中在午间",
    note: "预测需求较上月继续上行",
  },
  {
    title: "BPO 排班工时",
    value: "17,238.0h",
    change: "-2.18%",
    insight: "排班覆盖仍有缺口",
    note: "BPO 生效排班版本",
  },
  {
    title: "实际有效工时",
    value: "16,225.5h",
    change: "+1.86%",
    insight: "有效在线略有恢复",
    note: "CORN 状态日志计算",
  },
  {
    title: "异常工时",
    value: "543.5h",
    change: "+8.36%",
    insight: "异常需要优先复核",
    note: "37 条影响结算口径",
  },
]

export const trendData = [
  { date: "05-01", realization: 88.4, fit: 92.1, adherence: 89.5 },
  { date: "05-02", realization: 86.9, fit: 91.5, adherence: 88.1 },
  { date: "05-03", realization: 89.6, fit: 93.0, adherence: 90.4 },
  { date: "05-04", realization: 87.3, fit: 90.6, adherence: 88.7 },
  { date: "05-05", realization: 90.2, fit: 94.2, adherence: 91.8 },
  { date: "05-06", realization: 91.1, fit: 95.0, adherence: 92.5 },
  { date: "05-07", realization: 88.7, fit: 92.9, adherence: 90.2 },
  { date: "05-08", realization: 86.5, fit: 91.0, adherence: 87.6 },
  { date: "05-09", realization: 89.1, fit: 93.3, adherence: 90.8 },
  { date: "05-10", realization: 90.4, fit: 94.1, adherence: 91.2 },
  { date: "05-11", realization: 87.8, fit: 92.4, adherence: 88.9 },
  { date: "05-12", realization: 91.6, fit: 95.2, adherence: 92.7 },
]

export const heatmapRows = [
  {
    day: "周一",
    slots: [-1, -2, 0, 1, -4, -6, -3, 0],
  },
  {
    day: "周二",
    slots: [0, -1, -2, -3, -5, -4, -2, 1],
  },
  {
    day: "周三",
    slots: [1, 0, -1, -2, -6, -7, -4, -1],
  },
  {
    day: "周四",
    slots: [0, -1, 0, -3, -4, -5, -2, 0],
  },
  {
    day: "周五",
    slots: [-2, -3, -1, -2, -7, -8, -5, -2],
  },
]

export const heatmapSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
]

export type Anomaly = {
  id: string
  type: string
  project: string
  team: string
  shiftTime: string
  headcount: number
  impactedHours: string
  severity: "高" | "中" | "低"
  status: "待复核" | "已确认" | "已忽略"
}

export const anomalies: Anomaly[] = [
  {
    id: "ANM-202605-001",
    type: "实际有效在线不足",
    project: "Bosch CC",
    team: "华东一组",
    shiftTime: "05-11 12:00-14:00",
    headcount: 6,
    impactedHours: "18.0h",
    severity: "高",
    status: "待复核",
  },
  {
    id: "ANM-202605-002",
    type: "应登录未登录",
    project: "Bosch CC",
    team: "华南二组",
    shiftTime: "05-11 09:00-10:30",
    headcount: 3,
    impactedHours: "4.5h",
    severity: "中",
    status: "待复核",
  },
  {
    id: "ANM-202605-003",
    type: "排班缺口",
    project: "Bosch CC",
    team: "华北三组",
    shiftTime: "05-10 13:00-15:00",
    headcount: 5,
    impactedHours: "10.0h",
    severity: "高",
    status: "已确认",
  },
  {
    id: "ANM-202605-004",
    type: "非排班时段登录",
    project: "Bosch CC",
    team: "西区支援组",
    shiftTime: "05-10 18:00-19:00",
    headcount: 2,
    impactedHours: "2.0h",
    severity: "低",
    status: "已忽略",
  },
  {
    id: "ANM-202605-005",
    type: "迟到",
    project: "Bosch CC",
    team: "华东一组",
    shiftTime: "05-09 08:30-09:30",
    headcount: 4,
    impactedHours: "2.5h",
    severity: "中",
    status: "待复核",
  },
  {
    id: "ANM-202605-006",
    type: "CORN 状态无法识别",
    project: "Bosch CC",
    team: "华南二组",
    shiftTime: "05-09 15:00-15:30",
    headcount: 1,
    impactedHours: "0.5h",
    severity: "低",
    status: "已确认",
  },
]

export const syncStatus = [
  {
    source: "CORN 登录数据",
    batch: "LOGIN-20260511-0830",
    status: "已同步",
    syncedAt: "今日 08:36",
  },
  {
    source: "CORN 状态日志",
    batch: "CORN-20260511-0900",
    status: "处理中",
    syncedAt: "今日 09:04",
  },
  {
    source: "BPO 排班数据",
    batch: "SCH-202605-V12",
    status: "已同步",
    syncedAt: "昨日 22:18",
  },
  {
    source: "预测需求数据",
    batch: "FCST-202605-V08",
    status: "需关注",
    syncedAt: "昨日 18:42",
  },
]
