import assert from "node:assert/strict";
import test from "node:test";

import {
  buildStatusMappingKey,
  buildStatusMappingPutPayload,
  emptyStatusMappingRow,
  normalizeStatusMappingRows,
  summarizeStatusMappingCountFlags,
  summarizeStatusMappingFeedback,
} from "../../components/base-config/status-mapping-model.ts";

function row(overrides = {}) {
  return {
    ...emptyStatusMappingRow(),
    status: "在岗",
    sub_status: "接线",
    status_cd: "CD-001",
    activity_code: "hotline_online",
    activity_name: "热线在线",
    counts_attendance: true,
    ...overrides,
  };
}

test("normalizeStatusMappingRows trims fields and keeps the payload shape", () => {
  const result = normalizeStatusMappingRows([
    row({
      status: " 在岗 ",
      sub_status: " 接线 ",
      status_cd: " CD-001 ",
      activity_code: " hotline_online ",
      activity_name: " 热线在线 ",
    }),
  ]);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.items, [
    {
      status: "在岗",
      sub_status: "接线",
      status_cd: "CD-001",
      activity_code: "hotline_online",
      activity_name: "热线在线",
      counts_attendance: true,
      counts_valid_hours: false,
      counts_production_hours: false,
      counts_coverage: false,
      counts_rest: false,
      counts_punctuality: false,
    },
  ]);
});

test("normalizeStatusMappingRows treats only boolean true as enabled for count flags", () => {
  // FormData/JSON 来源可能混入 "true"/1/"false" 等脏值：只有真布尔 true 才视为开启。
  const result = normalizeStatusMappingRows([
    row({
      counts_attendance: "true",
      counts_valid_hours: 1,
      counts_production_hours: "false",
      counts_coverage: 0,
      counts_rest: true,
      counts_punctuality: "1",
    }),
  ]);

  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.items[0], {
    status: "在岗",
    sub_status: "接线",
    status_cd: "CD-001",
    activity_code: "hotline_online",
    activity_name: "热线在线",
    counts_attendance: false,
    counts_valid_hours: false,
    counts_production_hours: false,
    counts_coverage: false,
    counts_rest: true,
    counts_punctuality: false,
  });
});

test("normalizeStatusMappingRows skips fully blank rows", () => {
  const result = normalizeStatusMappingRows([emptyStatusMappingRow(), row()]);

  assert.deepEqual(result.errors, []);
  assert.equal(result.items.length, 1);
});

test("normalizeStatusMappingRows reports missing required fields with row position", () => {
  const result = normalizeStatusMappingRows([
    row({ activity_code: "", activity_name: "" }),
  ]);

  assert.equal(result.items.length, 0);
  assert.ok(
    result.errors.some(
      (error) =>
        error.startsWith("STATUS_MAPPING_FIELD_REQUIRED") &&
        error.includes("第1行") &&
        error.includes("业务活动代码") &&
        error.includes("业务活动名称")
    )
  );
});

test("normalizeStatusMappingRows keeps the last duplicate composite key", () => {
  const result = normalizeStatusMappingRows([
    row({ activity_name: "热线在线" }),
    row({ activity_code: "online_service", activity_name: "在线服务" }),
  ]);

  assert.deepEqual(result.errors, []);
  assert.equal(result.items.length, 1);
  assert.equal(result.items[0].activity_code, "online_service");
  assert.equal(result.items[0].activity_name, "在线服务");
});

test("normalizeStatusMappingRows sorts by status triple", () => {
  const result = normalizeStatusMappingRows([
    row({ status: "在岗", sub_status: "小休", status_cd: "CD-009" }),
    row({ status: "在岗", sub_status: "接线" }),
    row({ status: "加班", sub_status: "接线", status_cd: "CD-005" }),
  ]);

  assert.deepEqual(
    result.items.map((item) => `${item.status}/${item.sub_status}`),
    ["加班/接线", "在岗/小休", "在岗/接线"]
  );
});

test("buildStatusMappingPutPayload copies items to avoid shared references", () => {
  const items = normalizeStatusMappingRows([row()]).items;
  const payload = buildStatusMappingPutPayload(items);

  assert.deepEqual(payload, { items });
  assert.notEqual(payload.items[0], items[0]);
});

test("summarizeStatusMappingCountFlags lists enabled calibers only", () => {
  const record = row({ counts_rest: true, counts_coverage: true });

  assert.deepEqual(summarizeStatusMappingCountFlags(record), [
    "计入考勤",
    "计入覆盖",
    "计入休息",
  ]);
});

test("buildStatusMappingKey joins the triple for display keys", () => {
  assert.equal(buildStatusMappingKey(row()), "在岗 / 接线 / CD-001");
});

test("summarizeStatusMappingFeedback renders success and error banners", () => {
  const success = summarizeStatusMappingFeedback({
    mapping_feedback_status: "success",
    mapping_feedback_saved_count: "2",
  });
  assert.equal(success?.tone, "success");
  assert.ok(success.detail.includes("2 条映射"));

  const error = summarizeStatusMappingFeedback({
    mapping_feedback_status: "error",
    mapping_feedback_code: "STATUS_MAPPING_FORM_INVALID",
    mapping_feedback_message: "第1行缺少业务活动代码",
  });
  assert.equal(error?.tone, "error");
  assert.ok(error.detail.includes("STATUS_MAPPING_FORM_INVALID"));

  assert.equal(summarizeStatusMappingFeedback({}), null);
});
