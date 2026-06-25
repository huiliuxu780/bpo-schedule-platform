import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const demandForecastProductionPagePath = new URL("../../app/demand-plans/production/page.tsx", import.meta.url);
const personnelScheduleProductionPagePath = new URL("../../app/schedule-plans/production/page.tsx", import.meta.url);
const actualLogProductionPagePath = new URL("../../app/actual-logs/production/page.tsx", import.meta.url);
const demandForecastProductionWorkbenchPath = new URL("../../components/demand-forecast-production-workbench.tsx", import.meta.url);
const personnelScheduleProductionWorkbenchPath = new URL("../../components/personnel-schedule-production-workbench.tsx", import.meta.url);
const actualLogProductionWorkbenchPath = new URL("../../components/actual-log-production-workbench.tsx", import.meta.url);
const importCenterBatchListPanelPath = new URL("../../components/import-center-batch-list-panel.tsx", import.meta.url);
const demandForecastImportDialogPath = new URL("../../components/demand-forecast-import-dialog.tsx", import.meta.url);
const personnelScheduleImportDialogPath = new URL("../../components/personnel-schedule-import-dialog.tsx", import.meta.url);
const actualLogImportDialogPath = new URL("../../components/actual-log-import-dialog.tsx", import.meta.url);
const dataQualityActionsPath = new URL("../../app/data-quality/actions.ts", import.meta.url);

test("business import actions belong to business page headers, not the generic batch ledger", async () => {
  const batchListPanelSource = await readFile(importCenterBatchListPanelPath, "utf8");
  const demandPageSource = await readFile(demandForecastProductionPagePath, "utf8");
  const schedulePageSource = await readFile(personnelScheduleProductionPagePath, "utf8");
  const actualLogPageSource = await readFile(actualLogProductionPagePath, "utf8");
  const demandWorkbenchSource = await readFile(demandForecastProductionWorkbenchPath, "utf8");
  const scheduleWorkbenchSource = await readFile(personnelScheduleProductionWorkbenchPath, "utf8");
  const actualLogWorkbenchSource = await readFile(actualLogProductionWorkbenchPath, "utf8");
  const demandWorkbenchBody = demandWorkbenchSource.slice(
    demandWorkbenchSource.indexOf("export function DemandForecastProductionWorkbench"),
    demandWorkbenchSource.indexOf("export function DemandForecastProductionDetail"),
  );
  const scheduleWorkbenchBody = scheduleWorkbenchSource.slice(
    scheduleWorkbenchSource.indexOf("export function PersonnelScheduleProductionWorkbench"),
    scheduleWorkbenchSource.indexOf("export function PersonnelScheduleProductionDetail"),
  );
  const actualLogWorkbenchBody = actualLogWorkbenchSource.slice(
    actualLogWorkbenchSource.indexOf("export function ActualLogProductionWorkbench"),
    actualLogWorkbenchSource.indexOf("export function ActualLogProcessingDetail"),
  );

  assert.equal(
    batchListPanelSource.includes("buildImportUploadWorkspaceHref"),
    false,
    "generic import batch ledger should not own a CSV upload entry",
  );
  assert.equal(
    batchListPanelSource.includes("上传 CSV"),
    false,
    "generic import batch ledger should not expose a generic upload button",
  );
  assert.equal(
    demandPageSource.includes("DemandForecastProductionPageActions"),
    true,
    "demand forecast import action should be mounted in AppShell actions",
  );
  assert.equal(
    demandPageSource.includes("<DemandForecastImportDialog"),
    true,
    "demand forecast import should open a page-local Dialog",
  );
  assert.equal(
    demandWorkbenchSource.includes('buildImportUploadWorkspaceHref({ fileType: "demand_forecast" })'),
    false,
    "demand forecast action should not jump to the standalone upload workspace",
  );
  assert.equal(
    schedulePageSource.includes("PersonnelScheduleProductionPageActions"),
    true,
    "personnel schedule import action should be mounted in AppShell actions",
  );
  assert.equal(
    schedulePageSource.includes("<PersonnelScheduleImportDialog"),
    true,
    "personnel schedule import should open a page-local Dialog",
  );
  assert.equal(
    scheduleWorkbenchSource.includes('buildImportUploadWorkspaceHref({ fileType: "personnel_schedule" })'),
    false,
    "personnel schedule action should not jump to the standalone upload workspace",
  );
  assert.equal(
    actualLogPageSource.includes("ActualLogProductionPageActions"),
    true,
    "actual log import actions should be mounted in AppShell actions",
  );
  assert.equal(
    demandWorkbenchBody.includes("导入预测"),
    false,
    "demand forecast workbench content should not own the import action",
  );
  assert.equal(
    scheduleWorkbenchBody.includes("导入排班"),
    false,
    "schedule workbench content should not own the import action",
  );
  assert.equal(
    actualLogWorkbenchBody.includes("导入登录日志"),
    false,
    "actual log workbench content should not own login-log import action",
  );
  assert.equal(
    actualLogWorkbenchBody.includes("导入状态日志"),
    false,
    "actual log workbench content should not own status-log import action",
  );
});

test("demand forecast import dialog uses the strict step-by-step upload flow", async () => {
  const dialogSource = await readFile(demandForecastImportDialogPath, "utf8");
  const actionSource = await readFile(dataQualityActionsPath, "utf8");

  assert.equal(dialogSource.includes("DialogContent"), true);
  assert.equal(dialogSource.includes("AlertTitle"), true);
  assert.equal(dialogSource.includes("useState<DemandForecastImportDialogStepKey>"), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "upload"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "mapping"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "result"}'), true);
  assert.equal(dialogSource.includes('name="file_type"'), true);
  assert.equal(dialogSource.includes('value={dialog.fileType}'), true);
  assert.equal(dialogSource.includes('name="result_redirect_to"'), true);
  assert.equal(
    actionSource.includes('resultTarget === "/demand-plans/production?import_dialog=1"'),
    true,
    "upload action should return demand forecast results to the page-local Dialog",
  );
});

test("personnel schedule import dialog uses the strict step-by-step upload flow", async () => {
  const dialogSource = await readFile(personnelScheduleImportDialogPath, "utf8");
  const actionSource = await readFile(dataQualityActionsPath, "utf8");

  assert.equal(dialogSource.includes("DialogContent"), true);
  assert.equal(dialogSource.includes("AlertTitle"), true);
  assert.equal(dialogSource.includes("useState<PersonnelScheduleImportDialogStepKey>"), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "upload"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "mapping"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "result"}'), true);
  assert.equal(dialogSource.includes('name="file_type"'), true);
  assert.equal(dialogSource.includes('value={dialog.fileType}'), true);
  assert.equal(dialogSource.includes('name="result_redirect_to"'), true);
  assert.equal(
    actionSource.includes('resultTarget === "/schedule-plans/production?import_dialog=1"'),
    true,
    "upload action should return personnel schedule results to the page-local Dialog",
  );
});

test("actual log import dialog uses the strict step-by-step upload flow", async () => {
  const pageSource = await readFile(actualLogProductionPagePath, "utf8");
  const workbenchSource = await readFile(actualLogProductionWorkbenchPath, "utf8");
  const dialogSource = await readFile(actualLogImportDialogPath, "utf8");
  const actionSource = await readFile(dataQualityActionsPath, "utf8");

  assert.equal(pageSource.includes("<ActualLogImportDialog"), true);
  assert.equal(
    workbenchSource.includes('buildImportUploadWorkspaceHref({ fileType: "login_log" })'),
    false,
    "actual log page actions should not link login logs to the standalone upload workspace",
  );
  assert.equal(
    workbenchSource.includes('buildImportUploadWorkspaceHref({ fileType: "status_log" })'),
    false,
    "actual log page actions should not link status logs to the standalone upload workspace",
  );
  assert.equal(dialogSource.includes("DialogContent"), true);
  assert.equal(dialogSource.includes("AlertTitle"), true);
  assert.equal(dialogSource.includes("useState<ActualLogImportDialogStepKey>"), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "upload"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "mapping"}'), true);
  assert.equal(dialogSource.includes('hidden={activeStep !== "result"}'), true);
  assert.equal(dialogSource.includes('name="file_type"'), true);
  assert.equal(dialogSource.includes('value={dialog.fileType}'), true);
  assert.equal(dialogSource.includes('name="result_redirect_to"'), true);
  assert.equal(
    actionSource.includes('resultTarget === "/actual-logs/production?import_dialog=1&log_type=login"'),
    true,
    "upload action should return login-log results to the page-local Dialog",
  );
  assert.equal(
    actionSource.includes('resultTarget === "/actual-logs/production?import_dialog=1&log_type=status"'),
    true,
    "upload action should return status-log results to the page-local Dialog",
  );
});
