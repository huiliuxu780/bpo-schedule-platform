import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  summarizeImportVersionComparisonTriggerNotice,
} = jiti("../../components/import-center-model.ts");

test("import center version comparison trigger notice links new run and result list", () => {
  assert.deepEqual(
    summarizeImportVersionComparisonTriggerNotice({
      status: "success",
      runId: "CALC-SA-20260501-LOCAL-001",
    }),
    {
      tone: "success",
      title: "比对运行已生成",
      detail:
        "当前版本语境已生成新的对比运行 CALC-SA-20260501-LOCAL-001，可直接进入详情或回看当前比对运行列表。",
      runLabel: "CALC-SA-20260501-LOCAL-001",
      primaryActionLabel: "查看新对比运行",
      primaryHref: "/data-quality/comparison-runs/CALC-SA-20260501-LOCAL-001",
      secondaryActionLabel: "查看比对运行列表",
      secondaryHref: "#comparison-runs-list",
    },
  );

  assert.deepEqual(
    summarizeImportVersionComparisonTriggerNotice({
      status: "failed",
      reason: "api_400",
    }),
    {
      tone: "failed",
      title: "比对未提交",
      detail: "比对提交返回 400，请先核对来源版本和业务日。",
      runLabel: "未生成运行",
      primaryActionLabel: "查看比对运行列表",
      primaryHref: "#comparison-runs-list",
      secondaryActionLabel: "留在当前版本语境",
      secondaryHref: "#import-result-trace",
    },
  );
});
