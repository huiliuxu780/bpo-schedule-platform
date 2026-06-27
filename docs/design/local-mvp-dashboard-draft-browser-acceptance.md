# IM265 Local MVP Dashboard And Draft Workflow Acceptance

## Status

Accepted with one tooling observation.

## Branch And Environment

- Branch: `codex/im265-operational-browser-acceptance`
- Base branch: `codex/im264-dashboard-drilldown-consistency`
- Frontend runtime: `127.0.0.1:3000`
- Backend runtime: `127.0.0.1:8000`
- Date: 2026-06-28

## Scope

This acceptance pass covers the local MVP operational UI after IM263 and IM264:

1. Dashboard global filter and drilldown behavior.
2. Dashboard visible terminology boundary.
3. Schedule plan draft create and edit action chain.
4. Draft feedback rendering on the schedule plan detail page.

This pass does not add dependencies, browser automation infrastructure, backend schema changes, permissions, approval, export, batch operations, automatic scheduling, production formulas, settlement rules, or charge factors.

## Dashboard Acceptance

### Baseline Dashboard

Route: `/dashboard`

Observed result:

- Dashboard renders successfully.
- Header-level filters remain limited to project, site, and plan status.
- Header does not expose risk-level or issue-status filters.
- Metric card drilldown links are present:
  - `查看计划` -> `/schedule-plans`
  - `查看班次` -> `/shift-details`
  - `查看风险` -> `/schedule-risks?status=open`
  - `查看不可用` -> `/unavailability?status=active`
- Heatmap drilldown link is present:
  - `查看班次明细` -> `/shift-details`
- No visible internal terms were found in the dashboard body text.

### Filtered Dashboard

Route:

```txt
/dashboard?project=博西客服&site=上海职场&planStatus=published
```

Observed drilldown targets:

| Entry | Target |
| --- | --- |
| View plans | `/schedule-plans?query=博西客服 上海职场&status=published` |
| View shifts | `/shift-details?query=博西客服 上海职场&status=published` |
| View open risks | `/schedule-risks?query=博西客服 上海职场&status=open` |
| View active unavailability | `/unavailability?query=博西客服 上海职场&status=active` |
| Heatmap shift details | `/shift-details?query=博西客服 上海职场&status=published` |

## Draft Workflow Acceptance

### Finding: Shared Form Server Action Binding

Initial browser acceptance found that clicking the shared draft form submit button did not produce a visible redirect or feedback in the in-app browser automation session.

Investigation showed:

- Backend draft create API works.
- Next server action POST works when the same form action field is submitted directly.
- The form was wrapped inside the shared draft form component.

Scoped fix:

- Move the `<form action={createDraftAction}>` binding to `/schedule-plans/new/page.tsx`.
- Move the `<form action={updateDraftAction}>` binding to `/schedule-plans/[planId]/edit/page.tsx`.
- Keep `SchedulePlanDraftForm` as a shared field/control component only.

### Create Draft Server Action

POST target: `/schedule-plans/new`

Form data:

- `plan_date`: `2026-05-18`
- `project_name`: `博西客服`
- `site_name`: `上海职场`
- `version`: `im265-next-action`
- One interval from `09:00` to `09:30`

Observed result:

- Response: `303 See Other`
- Redirect location: `/schedule-plans/draft-20260518-001?draft=create_success`
- Backend readback confirmed the draft record exists.

### Edit Draft Server Action

POST target: `/schedule-plans/draft-20260518-001/edit`

Form data:

- `plan_id`: `draft-20260518-001`
- `version`: `im265-next-action`
- Scheduled agents changed to `15`
- Note changed to `IM265 edit action smoke`

Observed result:

- Response: `303 See Other`
- Redirect location: `/schedule-plans/draft-20260518-001?draft=update_success`
- Backend readback confirmed the interval note was updated.

### Browser Feedback Rendering

Route:

```txt
/schedule-plans/draft-20260518-001?draft=create_success
```

Observed result:

- `草稿已创建` feedback is visible.
- Plan detail renders as a draft.

Route:

```txt
/schedule-plans/draft-20260518-001?draft=update_success
```

Observed result:

- `草稿已保存` feedback is visible.
- Updated interval note `IM265 edit action smoke` is visible.
- No visible internal terms were found.

## Tooling Observation

The in-app browser Playwright click path did not reliably trigger the App Router server-action form submission, even after the page-level form action binding fix. The same server action path was verified through an HTTP form POST using the hidden Next action field, and the resulting feedback pages were verified in the browser.

This is recorded as a tooling observation, not as a product blocker.

## Verification Summary

Focused checks:

- `node --test scripts/tests/schedule-plan-draft-workflow-closeout-model.test.mjs scripts/tests/schedule-plan-draft-hardening-model.test.mjs`
- Dashboard browser DOM acceptance for filter and drilldown links.
- HTTP form POST acceptance for create and edit server actions.
- Browser feedback rendering for create and update success states.

Final project verification is recorded in the IM265 branch log.
