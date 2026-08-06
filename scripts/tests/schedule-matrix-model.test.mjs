import assert from "node:assert/strict";
import test from "node:test";

import {
  COVERAGE_INTERVAL_COUNT,
  aggregateDirtyCells,
  applyCoverageDelta,
  calculateRangeCoverage,
  cellSnapshotMatches,
  computeLocalCoverage,
  conflictCellAddressSet,
  conflictReasonLabel,
  expandCopyOperation,
  expandDateRange,
  formatCoverageRateLabel,
  formatWeekdayLabel,
  isFlushPeriodCurrent,
  pruneCopyTargets,
  schedulePeriodStatusLabel,
  segmentIntervalContributions,
  summarizeCoverageDailySummaries,
  summarizeCoverageIntervalSeries,
  summarizeCoverageOverall,
  summarizeScheduleMatrix,
} from "../../components/schedule-desk/schedule-matrix-model.ts";

function makeMatrix(overrides = {}) {
  return {
    period_id: "PERIOD-2026-06",
    version: 3,
    date_from: "2026-06-01",
    date_to: "2026-06-01",
    week: null,
    employees: [],
    cells: [],
    total: 0,
    next_cursor: null,
    ...overrides,
  };
}

function makeSegment(overrides = {}) {
  return {
    shift_code: "D09",
    activity_type: "work",
    start_time: "09:00",
    end_time: "18:00",
    crosses_day: false,
    skill_id: "L1-CN",
    allocation_ratio: 1,
    skill_coefficient: null,
    activity_coverage: 1,
    ...overrides,
  };
}

function makeCoverage(intervals, overrides = {}) {
  return {
    period_id: "PERIOD-2026-06",
    date_from: "2026-06-01",
    date_to: "2026-06-01",
    intervals,
    ...overrides,
  };
}

function makeInterval(overrides = {}) {
  return {
    date: "2026-06-01",
    interval_start: "09:00",
    demand_headcount: 10,
    planned_headcount: 8,
    gap: 2,
    coverage_rate: 0.8,
    std_demand_headcount: 10,
    std_planned_headcount: 8,
    std_gap: 2,
    std_coverage_rate: 0.8,
    ...overrides,
  };
}

test("empty matrix produces empty rows but keeps date columns and version", () => {
  const summary = summarizeScheduleMatrix(makeMatrix());

  assert.deepEqual(summary.dates, ["2026-06-01"]);
  assert.deepEqual(summary.employees, []);
  assert.deepEqual(summary.rows, []);
  assert.equal(summary.version, 3);
  assert.equal(summary.totalCells, 0);
});

test("matrix with inverted date range yields no date columns", () => {
  const summary = summarizeScheduleMatrix(
    makeMatrix({ date_from: "2026-06-07", date_to: "2026-06-01" })
  );

  assert.deepEqual(summary.dates, []);
  assert.deepEqual(summary.rows, []);
});

test("single employee single day renders one cell with a segment summary", () => {
  const summary = summarizeScheduleMatrix(
    makeMatrix({
      employees: ["EMP-001"],
      cells: [
        {
          employee_id: "EMP-001",
          schedule_date: "2026-06-01",
          locked: false,
          segments: [makeSegment()],
        },
      ],
      total: 1,
    })
  );

  assert.deepEqual(summary.employees, ["EMP-001"]);
  const row = summary.rows[0];
  const cell = row.cells["2026-06-01"];
  assert.equal(cell.isEmpty, false);
  assert.equal(cell.locked, false);
  assert.equal(cell.segments.length, 1);
  assert.equal(cell.segments[0].summaryText, "D09 09:00-18:00");
  assert.equal(cell.segments[0].shiftCodeLabel, "D09");
  assert.equal(cell.segments[0].activityTypeLabel, "出勤");
  assert.equal(cell.segments[0].timeRangeText, "09:00-18:00");
  assert.equal(cell.segments[0].crossesDay, false);
});

test("employee without shift code falls back to activity type label", () => {
  const summary = summarizeScheduleMatrix(
    makeMatrix({
      employees: ["EMP-001"],
      cells: [
        {
          employee_id: "EMP-001",
          schedule_date: "2026-06-01",
          locked: false,
          segments: [makeSegment({ shift_code: null, activity_type: "training" })],
        },
      ],
    })
  );

  const segment = summary.rows[0].cells["2026-06-01"].segments[0];
  assert.equal(segment.shiftCodeLabel, "—");
  assert.equal(segment.activityTypeLabel, "培训");
  assert.equal(segment.summaryText, "培训 09:00-18:00");
});

test("multi-segment cell keeps all segments in order and marks locked cells", () => {
  const summary = summarizeScheduleMatrix(
    makeMatrix({
      employees: ["EMP-002"],
      cells: [
        {
          employee_id: "EMP-002",
          schedule_date: "2026-06-01",
          locked: true,
          segments: [
            makeSegment(),
            makeSegment({
              shift_code: null,
              activity_type: "meal",
              start_time: "12:00",
              end_time: "12:30",
            }),
            makeSegment({
              shift_code: null,
              activity_type: "rest",
              start_time: "18:00",
              end_time: "18:30",
            }),
          ],
        },
      ],
      total: 1,
    })
  );

  const cell = summary.rows[0].cells["2026-06-01"];
  assert.equal(cell.locked, true);
  assert.equal(cell.segments.length, 3);
  assert.deepEqual(
    cell.segments.map((segment) => segment.summaryText),
    ["D09 09:00-18:00", "用餐 12:00-12:30", "休息 18:00-18:30"]
  );
});

test("cross-day segment is flagged and annotated with +1天", () => {
  const summary = summarizeScheduleMatrix(
    makeMatrix({
      employees: ["EMP-003"],
      cells: [
        {
          employee_id: "EMP-003",
          schedule_date: "2026-06-01",
          locked: false,
          segments: [
            makeSegment({
              shift_code: "N22",
              start_time: "22:00",
              end_time: "06:00",
              crosses_day: true,
            }),
          ],
        },
      ],
    })
  );

  const segment = summary.rows[0].cells["2026-06-01"].segments[0];
  assert.equal(segment.crossesDay, true);
  assert.equal(segment.summaryText, "N22 22:00-06:00（+1天）");
});

test("missing date cell for an employee is rendered as empty placeholder", () => {
  const summary = summarizeScheduleMatrix(
    makeMatrix({
      date_from: "2026-06-01",
      date_to: "2026-06-02",
      employees: ["EMP-001"],
      cells: [
        {
          employee_id: "EMP-001",
          schedule_date: "2026-06-01",
          locked: false,
          segments: [makeSegment()],
        },
      ],
    })
  );

  assert.deepEqual(summary.dates, ["2026-06-01", "2026-06-02"]);
  const missing = summary.rows[0].cells["2026-06-02"];
  assert.equal(missing.isEmpty, true);
  assert.deepEqual(missing.segments, []);
});

test("employees missing from the employees list are still picked up from cells", () => {
  const summary = summarizeScheduleMatrix(
    makeMatrix({
      employees: [],
      cells: [
        {
          employee_id: "EMP-009",
          schedule_date: "2026-06-01",
          locked: false,
          segments: [makeSegment()],
        },
      ],
    })
  );

  assert.deepEqual(summary.employees, ["EMP-009"]);
  assert.equal(summary.rows.length, 1);
});

test("empty coverage produces 48 zero points with dash rate labels", () => {
  const points = summarizeCoverageIntervalSeries(makeCoverage([]), "2026-06-01");

  assert.equal(points.length, COVERAGE_INTERVAL_COUNT);
  assert.equal(points[0].timeLabel, "00:00");
  assert.equal(points[1].timeLabel, "00:30");
  assert.equal(points[47].timeLabel, "23:30");
  assert.equal(points[0].demandHeadcount, 0);
  assert.equal(points[0].plannedHeadcount, 0);
  assert.equal(points[0].gap, 0);
  assert.equal(points[0].coverageRate, null);
  assert.equal(points[0].coverageRateLabel, "—");
});

test("coverage interval rows are merged into the fixed 48-slot timeline", () => {
  const points = summarizeCoverageIntervalSeries(
    makeCoverage([
      makeInterval(),
      makeInterval({
        interval_start: "09:30",
        demand_headcount: 12,
        planned_headcount: 12,
        gap: 0,
        coverage_rate: 1,
      }),
    ]),
    "2026-06-01"
  );

  const nine = points[18];
  assert.equal(nine.timeLabel, "09:00");
  assert.equal(nine.demandHeadcount, 10);
  assert.equal(nine.plannedHeadcount, 8);
  assert.equal(nine.gap, 2);
  assert.equal(nine.coverageRateLabel, "80.0%");

  const nineThirty = points[19];
  assert.equal(nineThirty.demandHeadcount, 12);
  assert.equal(nineThirty.coverageRateLabel, "100.0%");

  const untouched = points[20];
  assert.equal(untouched.demandHeadcount, 0);
  assert.equal(untouched.coverageRateLabel, "—");
});

test("null coverage_rate displays as dash", () => {
  const points = summarizeCoverageIntervalSeries(
    makeCoverage([
      makeInterval({ demand_headcount: 0, planned_headcount: 3, gap: -3, coverage_rate: null }),
    ]),
    "2026-06-01"
  );

  const point = points[18];
  assert.equal(point.coverageRate, null);
  assert.equal(point.coverageRateLabel, "—");
  assert.equal(formatCoverageRateLabel(null), "—");
});

test("intervals from other dates are ignored by the day series", () => {
  const points = summarizeCoverageIntervalSeries(
    makeCoverage([makeInterval({ date: "2026-06-02" })], {
      date_from: "2026-06-01",
      date_to: "2026-06-02",
    }),
    "2026-06-01"
  );

  assert.ok(points.every((point) => point.demandHeadcount === 0));
});

test("weekly aggregation groups gap and average coverage per day", () => {
  const summaries = summarizeCoverageDailySummaries(
    makeCoverage(
      [
        makeInterval({ coverage_rate: 0.8 }),
        makeInterval({ interval_start: "09:30", coverage_rate: 1 }),
        makeInterval({
          date: "2026-06-02",
          demand_headcount: 0,
          planned_headcount: 5,
          gap: -5,
          coverage_rate: null,
        }),
      ],
      { date_from: "2026-06-01", date_to: "2026-06-02" }
    )
  );

  assert.equal(summaries.length, 2);

  const [dayOne, dayTwo] = summaries;
  assert.equal(dayOne.date, "2026-06-01");
  assert.equal(dayOne.weekdayLabel, "周一");
  assert.equal(dayOne.demandTotal, 20);
  assert.equal(dayOne.plannedTotal, 16);
  assert.equal(dayOne.gapTotal, 4);
  assert.equal(dayOne.averageCoverageRateLabel, "90.0%");

  assert.equal(dayTwo.date, "2026-06-02");
  assert.equal(dayTwo.weekdayLabel, "周二");
  assert.equal(dayTwo.gapTotal, -5);
  assert.equal(dayTwo.averageCoverageRate, null);
  assert.equal(dayTwo.averageCoverageRateLabel, "—");
});

test("empty coverage yields empty daily summaries and dash overall summary", () => {
  assert.deepEqual(summarizeCoverageDailySummaries(makeCoverage([])), []);

  const overall = summarizeCoverageOverall(makeCoverage([]));
  assert.equal(overall.demandTotal, 0);
  assert.equal(overall.plannedTotal, 0);
  assert.equal(overall.gapTotal, 0);
  assert.equal(overall.averageCoverageRate, null);
  assert.equal(overall.averageCoverageRateLabel, "—");
});

test("overall coverage summary totals all intervals", () => {
  const overall = summarizeCoverageOverall(
    makeCoverage([
      makeInterval(),
      makeInterval({
        interval_start: "09:30",
        demand_headcount: 5,
        planned_headcount: 6,
        gap: -1,
        coverage_rate: 1.2,
      }),
    ])
  );

  assert.equal(overall.demandTotal, 15);
  assert.equal(overall.plannedTotal, 14);
  assert.equal(overall.gapTotal, 1);
  assert.equal(Math.round(overall.averageCoverageRate * 100) / 100, 1);
  assert.equal(overall.averageCoverageRateLabel, "100.0%");
});

test("date helpers expand ranges and label weekdays", () => {
  assert.deepEqual(expandDateRange("2026-06-01", "2026-06-03"), [
    "2026-06-01",
    "2026-06-02",
    "2026-06-03",
  ]);
  assert.deepEqual(expandDateRange("2026-06-03", "2026-06-01"), []);
  assert.deepEqual(expandDateRange("bad", "2026-06-01"), []);
  assert.equal(formatWeekdayLabel("2026-06-01"), "周一");
  assert.equal(formatWeekdayLabel("2026-06-07"), "周日");
  assert.equal(formatWeekdayLabel("bad"), "—");
});

test("period status label maps draft and published", () => {
  assert.equal(schedulePeriodStatusLabel("draft"), "草稿");
  assert.equal(schedulePeriodStatusLabel("published"), "已发布");
});

// ---- 本地覆盖计算：与后端 coverage_calculation 黄金用例双端一致 ----

function makeCoverageSegment(overrides = {}) {
  return {
    shift_code: null,
    activity_type: "work",
    start_time: "09:00",
    end_time: "09:30",
    crosses_day: false,
    skill_id: null,
    allocation_ratio: 1,
    skill_coefficient: null,
    activity_coverage: 1,
    ...overrides,
  };
}

function rowByInterval(rows) {
  const map = new Map();
  for (const row of rows) {
    map.set(`${row.date}|${row.intervalStart}`, row);
  }
  return map;
}

test("覆盖黄金用例1：完全重叠 —— 09:00-09:30 恰好覆盖一个区间", () => {
  const rows = calculateRangeCoverage(
    "2026-06-01",
    "2026-06-01",
    { "2026-06-01": { E1: [makeCoverageSegment()] } },
    { "2026-06-01": { "09:00": 2 } }
  );

  assert.equal(rows.length, COVERAGE_INTERVAL_COUNT);
  const row = rowByInterval(rows).get("2026-06-01|09:00");
  assert.equal(row.plannedHeadcount, 1);
  assert.equal(row.demandHeadcount, 2);
  assert.equal(row.gap, 1);
  assert.equal(row.coverageRate, 0.5);
  assert.equal(row.stdPlannedHeadcount, 1);
});

test("覆盖黄金用例2：部分重叠 —— 09:15-09:45 两个区间各 15 分钟", () => {
  const contributions = segmentIntervalContributions(
    "2026-06-01",
    makeCoverageSegment({ start_time: "09:15", end_time: "09:45" })
  );
  assert.deepEqual(
    contributions.map((item) => [item.intervalStart, item.overlapRatio]),
    [
      ["09:00", 0.5],
      ["09:30", 0.5],
    ]
  );

  const rows = calculateRangeCoverage(
    "2026-06-01",
    "2026-06-01",
    {
      "2026-06-01": {
        E1: [makeCoverageSegment({ start_time: "09:15", end_time: "09:45" })],
      },
    },
    {}
  );
  const byInterval = rowByInterval(rows);
  // 物理人数口径：员工在区间内即计 1 人
  assert.equal(byInterval.get("2026-06-01|09:00").plannedHeadcount, 1);
  // 标准人力口径：重叠比例 15/30
  assert.equal(byInterval.get("2026-06-01|09:00").stdPlannedHeadcount, 0.5);
  assert.equal(byInterval.get("2026-06-01|09:30").stdPlannedHeadcount, 0.5);
});

test("覆盖黄金用例3：跨日 —— 22:00-02:00 尾部计入次日", () => {
  const rows = calculateRangeCoverage(
    "2026-06-01",
    "2026-06-02",
    {
      "2026-06-01": {
        E1: [
          makeCoverageSegment({
            start_time: "22:00",
            end_time: "02:00",
            crosses_day: true,
          }),
        ],
      },
    },
    {}
  );
  const byInterval = rowByInterval(rows);

  for (const interval of ["22:00", "22:30", "23:00", "23:30"]) {
    assert.equal(byInterval.get(`2026-06-01|${interval}`).plannedHeadcount, 1);
  }
  for (const interval of ["00:00", "00:30", "01:00", "01:30"]) {
    assert.equal(byInterval.get(`2026-06-02|${interval}`).plannedHeadcount, 1);
  }
  // 当日凌晨不被错误计入
  assert.equal(byInterval.get("2026-06-01|00:00").plannedHeadcount, 0);
  assert.equal(byInterval.get("2026-06-02|02:00").plannedHeadcount, 0);
});

test("覆盖黄金用例4：多技能比例 —— 13.3 公式四因子相乘", () => {
  const segment = makeCoverageSegment({
    start_time: "10:00",
    end_time: "10:30",
    skill_id: "SKILL-A",
    allocation_ratio: 0.6,
    skill_coefficient: 1.2,
    activity_coverage: 0.9,
  });
  const contributions = segmentIntervalContributions("2026-06-01", segment);
  assert.equal(contributions.length, 1);
  // 1.0 × 0.6 × 1.2 × 0.9 = 0.648
  assert.equal(contributions[0].stdHeadcount, 0.648);

  const rows = calculateRangeCoverage(
    "2026-06-01",
    "2026-06-01",
    { "2026-06-01": { E1: [segment] } },
    {}
  );
  const row = rowByInterval(rows).get("2026-06-01|10:00");
  assert.equal(row.plannedHeadcount, 1);
  assert.equal(row.stdPlannedHeadcount, 0.648);
});

test("覆盖黄金用例5：空单元格 —— 48 行全零，需求为 0 时 coverage_rate=null", () => {
  const rows = calculateRangeCoverage(
    "2026-06-01",
    "2026-06-01",
    {},
    { "2026-06-01": { "00:00": 0 } }
  );
  assert.equal(rows.length, COVERAGE_INTERVAL_COUNT);
  for (const row of rows) {
    assert.equal(row.plannedHeadcount, 0);
    assert.equal(row.stdPlannedHeadcount, 0);
    assert.equal(row.coverageRate, null);
    assert.ok(row.gap <= 0);
  }
});

test("非出勤分段不计入覆盖；同员工重叠分段物理计 1 标准累加", () => {
  const rows = calculateRangeCoverage(
    "2026-06-01",
    "2026-06-01",
    {
      "2026-06-01": {
        E1: [makeCoverageSegment({ activity_type: "meal", start_time: "12:00", end_time: "13:00" })],
        E2: [
          makeCoverageSegment({ start_time: "09:00", end_time: "10:00" }),
          makeCoverageSegment({ start_time: "09:00", end_time: "10:00" }),
        ],
      },
    },
    {}
  );
  const byInterval = rowByInterval(rows);
  assert.equal(byInterval.get("2026-06-01|12:00").plannedHeadcount, 0);
  assert.equal(byInterval.get("2026-06-01|12:00").stdPlannedHeadcount, 0);
  assert.equal(byInterval.get("2026-06-01|09:00").plannedHeadcount, 1);
  assert.equal(byInterval.get("2026-06-01|09:00").stdPlannedHeadcount, 2);
});

test("范围覆盖聚合多员工多日期", () => {
  const rows = calculateRangeCoverage(
    "2026-06-01",
    "2026-06-01",
    {
      "2026-06-01": {
        E1: [makeCoverageSegment({ start_time: "09:00", end_time: "10:00" })],
        E2: [makeCoverageSegment({ start_time: "09:30", end_time: "10:30" })],
      },
    },
    { "2026-06-01": { "09:30": 2 } }
  );
  const byInterval = rowByInterval(rows);
  assert.equal(byInterval.get("2026-06-01|09:00").plannedHeadcount, 1);
  assert.equal(byInterval.get("2026-06-01|09:30").plannedHeadcount, 2);
  assert.equal(byInterval.get("2026-06-01|09:30").coverageRate, 1);
  assert.equal(byInterval.get("2026-06-01|10:00").plannedHeadcount, 1);
});

test("computeLocalCoverage 输出与后端 recalculate 响应形状一致", () => {
  const serverCoverage = {
    period_id: "PERIOD-2026-06",
    date_from: "2026-06-01",
    date_to: "2026-06-01",
    intervals: Array.from({ length: COVERAGE_INTERVAL_COUNT }, (_, index) => ({
      date: "2026-06-01",
      interval_start: `${String(Math.floor(index / 2)).padStart(2, "0")}:${index % 2 === 0 ? "00" : "30"}`,
      demand_headcount: index === 18 ? 2 : 0,
      planned_headcount: 0,
      gap: index === 18 ? 2 : 0,
      coverage_rate: null,
      std_demand_headcount: index === 18 ? 2 : 0,
      std_planned_headcount: 0,
      std_gap: index === 18 ? 2 : 0,
      std_coverage_rate: null,
    })),
  };

  const local = computeLocalCoverage(
    "2026-06-01",
    "2026-06-01",
    [
      {
        employee_id: "E1",
        schedule_date: "2026-06-01",
        segments: [makeCoverageSegment()],
      },
    ],
    serverCoverage
  );

  const interval = local.intervals.find((item) => item.interval_start === "09:00");
  assert.equal(interval.planned_headcount, 1);
  assert.equal(interval.gap, 1);
  assert.equal(interval.coverage_rate, 0.5);
  assert.equal(interval.std_planned_headcount, 1);
});

// ---- 编辑操作：脏标记聚合、复制展开、冲突回滚辅助 ----

test("脏单元格聚合：clear 优先于 set，锁操作单独进 locks", () => {
  const payload = aggregateDirtyCells([
    {
      employee_id: "E1",
      schedule_date: "2026-06-01",
      segments: [makeCoverageSegment()],
      segmentsDirty: true,
      cleared: false,
      locked: false,
      lockDirty: false,
    },
    {
      employee_id: "E1",
      schedule_date: "2026-06-02",
      segments: [],
      segmentsDirty: true,
      cleared: true,
      locked: true,
      lockDirty: true,
    },
    {
      employee_id: "E2",
      schedule_date: "2026-06-01",
      segments: [],
      segmentsDirty: false,
      cleared: false,
      locked: true,
      lockDirty: true,
    },
  ]);

  assert.deepEqual(
    payload.changes.map((change) => [change.employee_id, change.schedule_date]),
    [["E1", "2026-06-01"]]
  );
  assert.deepEqual(payload.clears, [{ employee_id: "E1", schedule_date: "2026-06-02" }]);
  assert.deepEqual(payload.locks, [
    { employee_id: "E1", schedule_date: "2026-06-02", locked: true },
    { employee_id: "E2", schedule_date: "2026-06-01", locked: true },
  ]);
  assert.deepEqual(payload.copies, []);
});

test("复制展开：源未脏走 copies，源已脏降级为本地 changes", () => {
  const cleanCopy = expandCopyOperation({
    source_employee_id: "E1",
    source_date: "2026-06-01",
    targets: [
      { employee_id: "E1", schedule_date: "2026-06-02" },
      { employee_id: "E1", schedule_date: "2026-06-03" },
    ],
    sourceDirty: false,
    sourceSegments: [makeCoverageSegment()],
  });
  assert.equal(cleanCopy.copies.length, 1);
  assert.equal(cleanCopy.copies[0].targets.length, 2);
  assert.deepEqual(cleanCopy.changes, []);

  const dirtyCopy = expandCopyOperation({
    source_employee_id: "E1",
    source_date: "2026-06-01",
    targets: [{ employee_id: "E1", schedule_date: "2026-06-02" }],
    sourceDirty: true,
    sourceSegments: [makeCoverageSegment({ start_time: "08:00" })],
  });
  assert.deepEqual(dirtyCopy.copies, []);
  assert.equal(dirtyCopy.changes.length, 1);
  assert.equal(dirtyCopy.changes[0].segments[0].start_time, "08:00");

  const emptyCopy = expandCopyOperation({
    source_employee_id: "E1",
    source_date: "2026-06-01",
    targets: [],
    sourceDirty: false,
    sourceSegments: [],
  });
  assert.deepEqual(emptyCopy, { changes: [], copies: [] });
});

test("冲突回滚辅助：结构化寻址精确收集冲突单元格与原因文案", () => {
  const conflicts = [
    { employee_id: "E1", schedule_date: "2026-06-01", reason: "CELL_LOCKED" },
    { employee_id: "E2", schedule_date: "2026-06-02", reason: "BASE_VERSION_STALE" },
    { employee_id: "E2", schedule_date: "2026-06-03", reason: "CELL_LOCKED" },
  ];
  const addresses = conflictCellAddressSet(conflicts);
  assert.ok(addresses.get("E1")?.has("2026-06-01"));
  assert.ok(addresses.get("E2")?.has("2026-06-02"));
  assert.ok(addresses.get("E2")?.has("2026-06-03"));
  assert.equal(addresses.size, 2);
  assert.equal(addresses.get("E2").size, 2);
  assert.equal(conflictReasonLabel("CELL_LOCKED"), "单元格已被锁定");
  assert.equal(conflictReasonLabel("BASE_VERSION_STALE"), "矩阵版本已被更新");
  assert.equal(conflictReasonLabel("COPY_SOURCE_MISSING"), "复制源单元格不存在");
});

// ---- flush 竞态防护：快照一致性、跨周期响应丢弃、copy 目标去重 ----

test("in-flight 期间再编辑：快照不一致保持脏标记不丢变更", () => {
  const sentSegments = [makeCoverageSegment()];
  const snapshot = { segments: sentSegments, locked: false };

  // 未被再次编辑：引用与锁状态一致，可确认。
  assert.equal(cellSnapshotMatches(snapshot, { segments: sentSegments, locked: false }), true);
  // in-flight 期间重新保存了分段（新数组引用）：必须保持脏标记等下一轮。
  assert.equal(
    cellSnapshotMatches(snapshot, { segments: [makeCoverageSegment()], locked: false }),
    false
  );
  // in-flight 期间锁状态变化：同样保持脏标记。
  assert.equal(cellSnapshotMatches(snapshot, { segments: sentSegments, locked: true }), false);
});

test("跨周期 flush 响应：周期不一致时丢弃权威状态写入", () => {
  assert.equal(isFlushPeriodCurrent("PERIOD-2026-06", "PERIOD-2026-06"), true);
  assert.equal(isFlushPeriodCurrent("PERIOD-2026-06", "PERIOD-2026-07"), false);
  // 范围切换重建过程中当前周期可能为空：同样丢弃。
  assert.equal(isFlushPeriodCurrent("PERIOD-2026-06", null), false);
});

test("copy 目标去重：直接编辑优先，全被剔除的 copy 整体丢弃", () => {
  const sourceSegments = [makeCoverageSegment()];
  const directEdits = new Map([
    ["E1", new Set(["2026-06-02"])],
    ["E2", new Set(["2026-06-01", "2026-06-02"])],
  ]);
  const copies = [
    {
      source_employee_id: "E1",
      source_date: "2026-06-01",
      targets: [
        { employee_id: "E1", schedule_date: "2026-06-02" },
        { employee_id: "E1", schedule_date: "2026-06-03" },
      ],
      sourceDirty: false,
      sourceSegments,
    },
    {
      source_employee_id: "E2",
      source_date: "2026-06-03",
      targets: [
        { employee_id: "E2", schedule_date: "2026-06-01" },
        { employee_id: "E2", schedule_date: "2026-06-02" },
      ],
      sourceDirty: false,
      sourceSegments,
    },
    {
      source_employee_id: "E3",
      source_date: "2026-06-01",
      targets: [{ employee_id: "E3", schedule_date: "2026-06-02" }],
      sourceDirty: false,
      sourceSegments,
    },
  ];

  const pruned = pruneCopyTargets(copies, directEdits);

  // E1 的 06-02 目标被直接编辑覆盖需剔除，06-03 保留；
  // E2 的 targets 全被剔除，整条 copy 丢弃；E3 无直接编辑不受影响。
  assert.equal(pruned.length, 2);
  assert.deepEqual(pruned[0].targets, [{ employee_id: "E1", schedule_date: "2026-06-03" }]);
  assert.deepEqual(pruned[1].targets, [{ employee_id: "E3", schedule_date: "2026-06-02" }]);
  // targets 未变化的 copy 保持原对象引用。
  assert.equal(pruned[1], copies[2]);
});

test("applyCoverageDelta 以后端为权威覆盖本地估算", () => {
  const base = {
    period_id: "PERIOD-2026-06",
    date_from: "2026-06-01",
    date_to: "2026-06-01",
    intervals: [
      {
        date: "2026-06-01",
        interval_start: "09:00",
        demand_headcount: 2,
        planned_headcount: 1,
        gap: 1,
        coverage_rate: 0.5,
        std_demand_headcount: 2,
        std_planned_headcount: 1,
        std_gap: 1,
        std_coverage_rate: 0.5,
      },
      {
        date: "2026-06-01",
        interval_start: "09:30",
        demand_headcount: 0,
        planned_headcount: 0,
        gap: 0,
        coverage_rate: null,
        std_demand_headcount: 0,
        std_planned_headcount: 0,
        std_gap: 0,
        std_coverage_rate: null,
      },
    ],
  };

  const merged = applyCoverageDelta(base, [
    {
      date: "2026-06-01",
      interval_start: "09:00",
      planned_headcount: 2,
      gap: 0,
      coverage_rate: 1,
    },
  ]);

  assert.equal(merged.intervals[0].planned_headcount, 2);
  assert.equal(merged.intervals[0].coverage_rate, 1);
  assert.equal(merged.intervals[0].std_planned_headcount, 2);
  // 未命中 delta 的区间保持原值
  assert.equal(merged.intervals[1].planned_headcount, 0);
  // 空 delta 返回原对象
  assert.equal(applyCoverageDelta(base, []), base);
});
