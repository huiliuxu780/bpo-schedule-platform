import assert from "node:assert/strict";
import test from "node:test";

import {
  buildEmployeeRestrictionsApiPath,
  buildEmployeeRestrictionsPayload,
  isValidUnavailableDate,
  normalizeUnavailableDates,
} from "../../components/employee-restrictions-model.ts";

test("isValidUnavailableDate accepts well-formed calendar dates only", () => {
  assert.equal(isValidUnavailableDate("2026-09-01"), true);
  assert.equal(isValidUnavailableDate("2026-02-28"), true);
  // 闰年 2 月 29 日合法
  assert.equal(isValidUnavailableDate("2028-02-29"), true);
});

test("isValidUnavailableDate rejects malformed or impossible dates", () => {
  assert.equal(isValidUnavailableDate(""), false);
  assert.equal(isValidUnavailableDate("2026/09/01"), false);
  assert.equal(isValidUnavailableDate("2026-9-1"), false);
  assert.equal(isValidUnavailableDate("2026-13-01"), false);
  assert.equal(isValidUnavailableDate("2026-00-10"), false);
  assert.equal(isValidUnavailableDate("2026-02-30"), false);
  // 非闰年 2 月 29 日非法
  assert.equal(isValidUnavailableDate("2026-02-29"), false);
  assert.equal(isValidUnavailableDate("20260901"), false);
  assert.equal(isValidUnavailableDate("2026-09-01 "), false);
});

test("normalizeUnavailableDates trims, deduplicates and sorts ascending", () => {
  const result = normalizeUnavailableDates([
    " 2026-09-10 ",
    "2026-09-01",
    "2026-09-10",
    "2026-08-05",
  ]);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.dates, ["2026-08-05", "2026-09-01", "2026-09-10"]);
});

test("normalizeUnavailableDates skips blank entries and collects invalid ones", () => {
  const result = normalizeUnavailableDates(["", "   ", "2026-02-30", "ok"]);

  assert.deepEqual(result.dates, []);
  assert.deepEqual(result.errors, [
    "不可排班日期格式无效：2026-02-30",
    "不可排班日期格式无效：ok",
  ]);
});

test("normalizeUnavailableDates keeps valid dates alongside invalid ones", () => {
  const result = normalizeUnavailableDates(["2026-09-01", "bad-date"]);

  assert.deepEqual(result.dates, ["2026-09-01"]);
  assert.deepEqual(result.errors, ["不可排班日期格式无效：bad-date"]);
});

test("normalizeUnavailableDates returns an empty list for empty input", () => {
  const result = normalizeUnavailableDates([]);

  assert.deepEqual(result, { dates: [], errors: [] });
});

test("buildEmployeeRestrictionsApiPath encodes the employee id", () => {
  assert.equal(
    buildEmployeeRestrictionsApiPath("A-1001"),
    "/api/v1/master-data/employees/A-1001/restrictions"
  );
  assert.equal(
    buildEmployeeRestrictionsApiPath("A 1001"),
    "/api/v1/master-data/employees/A%201001/restrictions"
  );
});

test("buildEmployeeRestrictionsPayload maps to the PATCH contract fields", () => {
  const payload = buildEmployeeRestrictionsPayload({
    nightShiftAllowed: false,
    crossDayAllowed: true,
    unavailableDates: ["2026-09-01"],
  });

  assert.deepEqual(payload, {
    night_shift_allowed: false,
    cross_day_allowed: true,
    unavailable_dates: ["2026-09-01"],
  });
  // 载荷数组必须是副本，避免外部修改影响
  assert.notEqual(payload.unavailable_dates, undefined);
});
