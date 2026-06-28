import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();

function readProject(relativePath) {
  return readFileSync(join(root, relativePath), "utf-8");
}

const pageSrc = readProject("app/dashboard/page.tsx");
const sectionCardsSrc = readProject("components/section-cards.tsx");
const bpoHeatmapSrc = readProject("components/bpo-heatmap.tsx");
const dataTableSrc = readProject("components/data-table.tsx");

// ── 1. Dashboard page calls the three data clients ──

test("dashboard page calls getSchedulePlansResult", () => {
  assert.match(pageSrc, /getSchedulePlansResult\s*\(/);
});

test("dashboard page calls getScheduleRisksResult", () => {
  assert.match(pageSrc, /getScheduleRisksResult\s*\(/);
});

test("dashboard page calls getUnavailabilityResult", () => {
  assert.match(pageSrc, /getUnavailabilityResult\s*\(/);
});

// ── 2. Dashboard page calls the view model builder ──

test("dashboard page calls buildDashboardOperationalViewModel", () => {
  assert.match(pageSrc, /buildDashboardOperationalViewModel\s*\(/);
});

test("dashboard page imports buildDashboardViewModel from lib/dashboard", () => {
  assert.match(pageSrc, /from\s+["']@\/lib\/dashboard["']/);
});

// ── 3. SectionCards accepts cards prop ──

test("SectionCards accepts cards prop", () => {
  assert.match(sectionCardsSrc, /cards\?/);
});

test("SectionCards uses DashboardMetricCard type (not a non-existent MetricCard)", () => {
  assert.match(sectionCardsSrc, /DashboardMetricCard/);
  assert.doesNotMatch(
    sectionCardsSrc,
    /type\s+MetricCard|,\s*type\s+MetricCard\b/
  );
});

test("SectionCards handles optional change field safely", () => {
  // Must not unconditionally call item.change.startsWith — needs a guard
  assert.doesNotMatch(sectionCardsSrc, /const\s+\w+\s*=\s*item\.change\.startsWith/);
  // Must have a conditional render or guard for change
  assert.match(sectionCardsSrc, /item\.change\s*&&/);
});

// ── 4. BpoHeatmap accepts rows and slots props ──

test("BpoHeatmap accepts rows and slots props", () => {
  assert.match(bpoHeatmapSrc, /rows\?/);
  assert.match(bpoHeatmapSrc, /slots\?/);
});

// ── 5. DataTable accepts anomalies prop ──

test("DataTable accepts anomalies prop", () => {
  assert.match(dataTableSrc, /anomalies\?/);
});

test("DataTable uses prop anomalies with fallback", () => {
  assert.match(dataTableSrc, /fallbackAnomalies/);
  assert.match(dataTableSrc, /sourceAnomalies/);
});

// ── 6. Dashboard page no longer relies solely on static data ──

test("dashboard page does not import static metricCards from data.ts", () => {
  // It may still import from data.ts for fallback purposes but should NOT
  // import the static metricCards as the primary data source
  assert.doesNotMatch(pageSrc, /import\s+\{[^}]*metricCards[^}]*\}\s+from\s+["']@\/app\/dashboard\/data["']/);
});

test("dashboard page does not import static anomalies from data.ts", () => {
  assert.doesNotMatch(pageSrc, /import\s+\{[^}]*anomalies[^}]*\}\s+from\s+["']@\/app\/dashboard\/data["']/);
});

// ── 7. Dashboard page passes viewModel data to children ──

test("dashboard page passes metricCards to SectionCards", () => {
  assert.match(pageSrc, /cards=\{viewModel\.metricCards\}/);
});

test("dashboard page follows dashboard-01 chart-first layout without the side heatmap", () => {
  assert.doesNotMatch(pageSrc, /BpoHeatmap/);
  assert.match(pageSrc, /<ChartAreaInteractive \/>/);
});

test("dashboard page keeps the main chart in a full-width section", () => {
  assert.match(pageSrc, /<section className="px-4 lg:px-6">[\s\S]+?<ChartAreaInteractive \/>[\s\S]+?<\/section>/);
});

test("dashboard page passes anomalies to DataTable", () => {
  assert.match(pageSrc, /anomalies=\{viewModel\.anomalies\}/);
});

// ── 8. Forbidden terminology in dashboard page ──

test("dashboard page does not expose internal terminology", () => {
  const forbiddenTerms = ["Gate", "PM", "Harness", "Codex", "Packet", "IM250"];

  for (const term of forbiddenTerms) {
    assert.equal(
      pageSrc.includes(term),
      false,
      `Dashboard page contains forbidden term: ${term}`
    );
  }
});

test("dashboard page does not use auto-fix or auto-reschedule language", () => {
  const forbiddenPhrases = ["自动修复", "自动重排", "缺口已消除"];

  for (const phrase of forbiddenPhrases) {
    assert.equal(
      pageSrc.includes(phrase),
      false,
      `Dashboard page contains forbidden phrase: ${phrase}`
    );
  }
});

// ── 9. Dashboard page is async ──

test("dashboard page exports an async server component", () => {
  assert.match(pageSrc, /export\s+default\s+async\s+function/);
});

// ── 10. Dashboard page describes data source ──

test("dashboard page includes a data-source attribution note", () => {
  // Page uses ReadinessBanner which displays readiness.message from the operational view model
  assert.match(pageSrc, /ReadinessBanner/);
  assert.match(pageSrc, /viewModel\.readiness\.message/);
});

test("dashboard page does not claim production real-time data", () => {
  assert.doesNotMatch(pageSrc, /实时/);
  assert.doesNotMatch(pageSrc, /生产实时/);
});
