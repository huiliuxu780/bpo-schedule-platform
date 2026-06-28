import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("Dashboard Page - Operational Integration", () => {
  const pagePath = join(process.cwd(), "app/dashboard/page.tsx");
  const pageContent = readFileSync(pagePath, "utf-8");

  it("should use result-style reader for schedule plans", () => {
    assert.match(pageContent, /getSchedulePlansResult\(/);
  });

  it("should use result-style reader for schedule risks", () => {
    assert.match(pageContent, /getScheduleRisksResult\(/);
  });

  it("should use result-style reader for unavailability", () => {
    assert.match(pageContent, /getUnavailabilityResult\(/);
  });

  it("should build operational view model", () => {
    assert.match(pageContent, /buildDashboardOperationalViewModel\(/);
  });

  it("should pass readiness message to readiness banner", () => {
    assert.match(pageContent, /readiness\.message/);
  });

  it("should pass readiness hasFilteredData to readiness banner", () => {
    assert.match(pageContent, /readiness\.hasFilteredData/);
  });

  it("should pass readiness overallSource to readiness banner", () => {
    assert.match(pageContent, /readiness\.overallSource/);
  });

  it("should pass plansSource to operational view model", () => {
    assert.match(pageContent, /plansSource:/);
  });

  it("should pass risksSource to operational view model", () => {
    assert.match(pageContent, /risksSource:/);
  });

  it("should pass unavailabilitySource to operational view model", () => {
    assert.match(pageContent, /unavailabilitySource:/);
  });

  it("should not contain internal terminology", () => {
    const forbiddenTerms = ["Gate Plan", "PM", "Harness", "Codex", "Packet", "IM251"];
    for (const term of forbiddenTerms) {
      assert.doesNotMatch(
        pageContent,
        new RegExp(term, "i"),
        `Page should not contain term: ${term}`
      );
    }
  });

  it("should not contain auto-fix or auto-scheduling language", () => {
    const forbiddenPhrases = ["自动修复", "自动重排", "自动调度完成", "自动补位"];
    for (const phrase of forbiddenPhrases) {
      assert.doesNotMatch(
        pageContent,
        new RegExp(phrase),
        `Page should not contain phrase: ${phrase}`
      );
    }
  });
});

describe("BpoHeatmap - Empty State", () => {
  const heatmapPath = join(process.cwd(), "components/bpo-heatmap.tsx");
  const heatmapContent = readFileSync(heatmapPath, "utf-8");

  it("should check for empty rows", () => {
    assert.match(heatmapContent, /displayRows\.length === 0/);
  });

  it("should check for empty slots", () => {
    assert.match(heatmapContent, /displaySlots\.length === 0/);
  });

  it("should render empty state message", () => {
    assert.match(heatmapContent, /暂无可展示的人力缺口时段/);
  });

  it("should conditionally render grid based on isEmpty", () => {
    assert.match(heatmapContent, /\{isEmpty \? \(/);
    assert.match(heatmapContent, /: \(/);
  });

  it("should not contain internal terminology", () => {
    const forbiddenTerms = ["Gate Plan", "PM", "Harness", "Codex", "Packet", "IM251"];
    for (const term of forbiddenTerms) {
      assert.doesNotMatch(
        heatmapContent,
        new RegExp(term, "i"),
        `Heatmap should not contain term: ${term}`
      );
    }
  });

  it("should not contain auto-fix or auto-scheduling language", () => {
    const forbiddenPhrases = ["自动修复", "自动重排", "自动调度完成", "自动补位"];
    for (const phrase of forbiddenPhrases) {
      assert.doesNotMatch(
        heatmapContent,
        new RegExp(phrase),
        `Heatmap should not contain phrase: ${phrase}`
      );
    }
  });
});

describe("DataTable - Empty State Distinction", () => {
  const tablePath = join(process.cwd(), "components/data-table.tsx");
  const tableContent = readFileSync(tablePath, "utf-8");

  it("should distinguish no data vs filtered no results", () => {
    assert.match(tableContent, /暂无异常记录/);
    assert.match(tableContent, /暂无符合条件的异常记录/);
  });

  it("should check sourceAnomalies length for no data state", () => {
    assert.match(tableContent, /sourceAnomalies\.length === 0/);
  });

  it("should check hasActiveFilters for filtered state", () => {
    assert.match(tableContent, /hasActiveFilters/);
  });

  it("should render appropriate message based on state", () => {
    assert.match(
      tableContent,
      /sourceAnomalies\.length === 0 && !hasActiveFilters/
    );
    assert.match(
      tableContent,
      /\?\s*["']暂无异常记录["']/
    );
    assert.match(
      tableContent,
      /:\s*["']暂无符合条件的异常记录["']/
    );
  });

  it("should not contain internal terminology", () => {
    const forbiddenTerms = ["Gate Plan", "PM", "Harness", "Codex", "Packet", "IM251"];
    for (const term of forbiddenTerms) {
      assert.doesNotMatch(
        tableContent,
        new RegExp(term, "i"),
        `Table should not contain term: ${term}`
      );
    }
  });

  it("should not contain auto-fix or auto-scheduling language", () => {
    const forbiddenPhrases = ["自动修复", "自动重排", "自动调度完成", "自动补位"];
    for (const phrase of forbiddenPhrases) {
      assert.doesNotMatch(
        tableContent,
        new RegExp(phrase),
        `Table should not contain phrase: ${phrase}`
      );
    }
  });
});

describe("Readiness Banner - Component Structure", () => {
  const bannerPath = join(process.cwd(), "components/readiness-banner.tsx");
  const bannerContent = readFileSync(bannerPath, "utf-8");

  it("should accept readiness prop with message, hasData, overallSource", () => {
    assert.match(bannerContent, /message: string/);
    assert.match(bannerContent, /hasData: boolean/);
    assert.match(bannerContent, /overallSource:/);
  });

  it("should use shadcn alert and semantic theme tokens", () => {
    assert.match(bannerContent, /@\/components\/ui\/alert/);
    assert.doesNotMatch(bannerContent, /bg-green|text-green|border-green/);
    assert.doesNotMatch(bannerContent, /bg-amber|text-amber|border-amber/);
    assert.doesNotMatch(bannerContent, /bg-blue|text-blue|border-blue/);
    assert.doesNotMatch(bannerContent, /bg-gray|text-gray|border-gray/);
  });

  it("should not render normal api source as an operator-facing banner", () => {
    assert.match(bannerContent, /overallSource === ["']api["'][\s\S]+?return null/);
    assert.doesNotMatch(bannerContent, /后端 API/);
  });

  it("should handle fallback source styling", () => {
    assert.match(bannerContent, /source === ["']fallback["']/);
  });

  it("should handle mixed source styling", () => {
    assert.match(bannerContent, /source === ["']mixed["']/);
  });

  it("should handle api_empty source styling", () => {
    assert.match(bannerContent, /source === ["']api_empty["']/);
  });

  it("should not contain internal terminology", () => {
    const forbiddenTerms = ["Gate Plan", "PM", "Harness", "Codex", "Packet", "IM251"];
    for (const term of forbiddenTerms) {
      assert.doesNotMatch(
        bannerContent,
        new RegExp(term, "i"),
        `Banner should not contain term: ${term}`
      );
    }
  });

  it("should not contain auto-fix or auto-scheduling language", () => {
    const forbiddenPhrases = ["自动修复", "自动重排", "自动调度完成", "自动补位"];
    for (const phrase of forbiddenPhrases) {
      assert.doesNotMatch(
        bannerContent,
        new RegExp(phrase),
        `Banner should not contain phrase: ${phrase}`
      );
    }
  });
});
