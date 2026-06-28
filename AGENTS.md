# AGENTS.md

## Project Identity

- Project name: `bpo-schedule-platform`
- Current stage: frontend dashboard scaffold + local scheduling-plan MVP vertical
- Current development mode: Story Runner first, Gate Plan controlled, auto local commit after green check, push only after PM confirmation
- Goal: provide an auditable Harness while iterating on a PM-confirmed BPO WFM dashboard scaffold and local scheduling-plan MVP vertical.

## Project Root

- The project root is `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform/`.
- Codex must use this directory as the working directory for this clean project.

## Language Policy

This project uses a dual-language policy.

### Code-facing Language: English

Use English for file names, folder names, variable names, function names, class names, component names, type/interface names, API names, route names, branch names, commit messages, test names, and technical comments when comments are necessary.

Do not use Chinese pinyin for code identifiers.

### PM-facing Language: Chinese

Use Chinese for Gate Plan, Done Report, PRD explanation, PM confirmation questions, acceptance guides, branch-log summaries, product decisions, and business-facing UI copy.

### Machine-readable Files

For JSON/YAML/structured files, use English keys. Business-facing values may use Chinese.

Do not translate existing code identifiers, route names, file paths, package names, CLI commands, or API field names unless the PM explicitly asks.

## Harness Entry

Before every non-trivial task, Codex must read the default current-state set:

1. `AGENTS.md`
2. `docs/current/PROJECT_CONTEXT.md`
3. `docs/current/STORY_QUEUE.yaml`
4. `docs/current/ACTIVE_TASKS.yaml`
5. `docs/current/BLOCKERS.md`
6. `docs/quality/GATE_REGISTRY.md`
7. `docs/current/ROADMAP.md`
8. `docs/current/TASK_BOARD.md`
9. `docs/current/GAP_MATRIX.md`
10. Current task files

Legacy files such as `tasks/backlog.yaml`, `docs/user-stories.md`, `docs/raw-requirements.md`, `docs/audit-report.md`, `docs/task-log.md`, and `docs/dev/branch-log.md` are not default startup context after the current layer exists.

If the user gives only a task ID and it is not present in `docs/current/ACTIVE_TASKS.yaml`, Codex may use `docs/registry/TRACE_INDEX.yaml` and then the specific legacy file that contains the task.

During the current-layer transition, tasks that modify Harness history or traceability may still update the legacy files required by the active Gate.

## State Governance

Detailed state governance rules live in `docs/quality/STATE_MANAGEMENT.md`.

Hard rules:

- Default to reading `docs/current/**`, not archive or legacy history.
- Archive files are historical reference only and are not executable queues.
- `docs/current/**` and `docs/registry/**` follow a single-writer rule: only the main Worker may write them.
- Subagents may review or recommend state changes, but must not directly write current or registry files.
- `docs/registry/TRACE_INDEX.yaml` stores IDs, paths, and relationships only; it must not store `status`.
- Run `bash scripts/check-state.sh` when current or registry state changes.

History-On-Demand is allowed only when current state is insufficient, the user asks for history, the task depends on a historical decision, documents conflict, or the task is audit, review, rollback, incident investigation, migration, or state repair.

State Repair Mode triggers when current queue and active tasks disagree, registry paths are missing, archive migration is partially complete, or `check-state` blocks normal execution. In State Repair Mode, modify only `docs/current/**`, `docs/registry/**`, and necessary archive index pointers; do not modify business code, package/lockfiles, dependencies, database, integrations, auth, permissions, approval, export, batch, production formulas, settlement rules, or charge factors.

## Codex Plan Boundary

Codex Plan is not a source of truth.

- Codex Plan is a temporary execution view for the current session only.
- Codex Plan must be derived from `docs/current/STORY_QUEUE.yaml` and `docs/current/ACTIVE_TASKS.yaml` when current Harness state is available.
- If Codex Plan differs from Harness state, Harness state wins.
- Codex Plan must not decide project status, readiness, completion, archive state, allowed files, stop conditions, commit evidence, or verification evidence.
- Project state must be persisted through Harness files, registry indexes, audit records, branch logs, task logs, commits, and Done Reports.

## Standard Workflow

Detailed branch, worktree, integration, exception, and audit runbook: `docs/quality/GIT_BRANCH_WORKFLOW.md`.

### Rule Priority

1. `AGENTS.md` current execution rules.
2. Per-task `allowed_files`, `forbidden_files`, and `stop_conditions` in `tasks/backlog.yaml`.
3. Workflow gates in `docs/quality/GATE_REGISTRY.md`.
4. When rules conflict, the more specific task-level rule wins over the generic workflow rule.

### Execution Flow

Every non-trivial task must follow this order:

1. Read the Harness entry files and task context.
2. Output a Chinese Gate Plan.
3. Stop for PM confirmation when the task requires confirmation or triggers a hard stop condition.
4. Work on a task branch, never directly on `main`.
5. Modify only confirmed in-scope files.
6. Run focused verification during implementation, then run final `bash scripts/check.sh` before completion.
7. Update traceability logs and audit evidence.
8. Run final verification after log/audit updates.
9. Commit the verified completed scope locally.
10. Output a Chinese Done Report.
11. At stage, module block, or coherent feature-set completion, ask PM whether to push.

### Branch And Worktree Rules

- Direct development on `main` is forbidden.
- Default task branch: `codex/<task-id>-<short-name>`.
- Before creating a task branch, sync `main` from `origin/main` with fast-forward only and record `base_main_commit`.
- A single module block may continue multiple ready stories on one branch when scope, risk, and allowed files stay consistent.
- Cross-module work, high-risk work, dependency/package changes, real integrations, database, auth, permissions, approval, export, batch operations, production status/formula/settlement/charge-factor changes, or clearly different allowed files require a new branch and Gate.
- Use `git worktree` only for 2+ independent ready tasks with non-overlapping write scopes and independent verification paths.
- If the workspace is dirty and the current task cannot be safely separated, mark the task blocked and do not commit a done state.

### Verified Commit And Push Policy

PM confirmed on 2026-05-12 that completed verified work should be committed locally.

- Every completed task that passes final `bash scripts/check.sh` must be committed to the local Git repository.
- Commit messages must be clear English.
- Commits must include only the intended files for the current task scope.
- Remote push is never automatic. Ask PM before pushing after a stage, module block, or coherent feature set is complete.

Do not auto-commit when:

- final `bash scripts/check.sh` fails
- unrelated changes cannot be safely separated
- scope is ambiguous or expanded beyond the Gate Plan
- hard stop conditions require PM confirmation
- local commit fails

### Stop Conditions

Hard stop conditions require PM confirmation:

- new dependencies
- package or lockfile changes
- real external data sources or integrations
- database persistence
- database connection setup, ORM, migration, schema design, or production persistence configuration
- authentication or permission boundaries
- approval, export, or batch-operation capabilities
- production status codes, formulas, settlement rules, or charge factors
- destructive or ambiguous Git/file operations
- failed final verification

Soft ambiguity such as minor UI copy or local acceptance wording can be resolved with explicit assumptions inside the current story when it does not change scope or risk.

## Story Runner Mode

Story Runner Mode is the default execution model for confirmed product-development chains when PM asks to "开始", "继续", "自动走完", "按用户故事开发", "挨个开发完测试完提交完", or equivalent continuous delivery.

Story Runner must:

- treat user stories as the primary execution unit
- execute only from ready entries in `docs/current/STORY_QUEUE.yaml` with matching tasks in `docs/current/ACTIVE_TASKS.yaml`
- convert new goals into raw requirements and the smallest useful user stories before implementation
- run implementation, final verification, traceability updates, local commit, and Done Report for each completed scope
- continue to the next ready story after a green gate unless a stop condition is reached
- keep small UI feedback and acceptance corrections inside the current story when they do not expand scope
- avoid guessing the next task when the ready queue is empty
- run `bash scripts/check-state.sh` after current or registry state changes
- refresh `docs/current/ROADMAP.md`, `docs/current/TASK_BOARD.md`, and `docs/current/GAP_MATRIX.md` when task direction, executable candidates, blocked topics, or feature reality changes
- sync the Roadmap / Task Board / GAP Matrix summary to the PM Feishu Base when Feishu write access is available and the write preview is confirmed

Bounded subagents may be used in Story Runner Mode only for independent, non-overlapping write scopes. The main Codex worker remains responsible for dispatch design, diff review, final verification, traceability, commits, and Done Report. Outside Story Runner Mode, subagents require explicit PM/user permission and a confirmed Gate.

## Roadmap, Task Board, GAP Matrix, And Feishu Sync

The current PM-facing governance board is:

- `docs/current/ROADMAP.md`
- `docs/current/TASK_BOARD.md`
- `docs/current/GAP_MATRIX.md`

These files explain where the project is going, which demand/story/task candidates exist, which items are executable or blocked, and which product surfaces are true local functions, visual/static functions, missing, or blocked production capabilities.

The PM-visible Feishu Base is:

- `https://bsh-group.feishu.cn/base/SfHQbFp2iayfiCsMypccBz7Knwb?table=tblo03qLQkgtNoYa&view=vewGvE45jR`

Every non-trivial task must either:

- update the three governance files and sync a concise summary to Feishu, or
- state in the Done Report that Roadmap / Task Board / GAP Matrix were reviewed and unchanged.

Feishu write safety:

- Read the target Base schema before writing.
- Preview planned field and record changes before mutating Feishu.
- If Feishu is unavailable, blocked by permission, or awaiting PM confirmation, keep the repo files authoritative and report the sync status in the Done Report.
- Do not let Feishu replace the repo source of truth; Feishu is the PM-visible mirror.

## Qoder / Subagent Task Splitting Rules

When Codex delegates work to Qoder or another bounded worker, Codex must keep ownership of scope, branch safety, final verification, traceability, commit, and push.

Every delegated task prompt must include:

- **Branch requirement**: base branch, target branch, whether to create or switch branches, and whether editing the current branch is allowed.
- **Stop condition**: stop and report instead of editing if the branch, base, or dirty worktree state is unclear.
- **Task boundary**: the product capability being implemented, allowed files, forbidden files, and explicit non-goals.
- **Granularity rule**: do not split below a user-visible or reviewable capability. Prefer one medium-sized capability packet over many tiny mechanical packets when files and verification path overlap.
- **Verification requirement**: run focused checks that prove the delegated scope, plus `git diff --check`; do not claim full project readiness.
- **Git boundary**: Qoder must not commit, push, modify `docs/current/**`, modify `docs/registry/**`, install dependencies, or change package/lockfiles unless a task explicitly permits it.
- **Return format**: changed files, behavior summary, focused verification results, known risks, and confirmation that no forbidden files were touched.

Codex must review the actual diff after Qoder returns. Agent reports are advisory; they are not completion evidence.

## Stage Completion Planning

When Codex completes a stage, module block, or coherent feature set, the final Done Report must include this Chinese forward plan:

1. 本阶段完成了什么
2. 验证是否通过
3. 当前还剩什么
4. 推荐下一阶段做哪 2-3 个
5. 为什么推荐这个顺序
6. 哪些事情暂时不建议做
7. 如果 PM 不反对，默认从推荐第 1 项继续开发

Recommendations must reflect dependency order, business value, implementation risk, and the current stop conditions. Push remains PM-controlled.

## Default Scope Constraints

Unless the current user instruction explicitly allows it, Codex must not:

- develop business features
- create frontend pages
- create backend services or databases
- create database connections, ORM models, migrations, schema files, or production persistence config
- connect real APIs
- add mock business data
- install dependencies
- modify `package.json` or lockfiles
- import from archived or external legacy code
- create production permissions, approval, export, or batch-operation capabilities
- change business metrics, status codes, settlement formulas, or charge factors

## Project Stage Rule

The project started as a clean Harness workspace, but `F001` is now the confirmed exception that allows a static frontend dashboard scaffold.

The confirmed F001 scope allows:

- frontend package files
- shadcn/ui-style dashboard UI files
- local static mock data for the dashboard prototype
- dark / light theme support
- BPO WFM navigation and content replacement

Outside confirmed tasks such as F001, any future product work must first enter the backlog, pass the appropriate Gate Plan, and receive PM confirmation when required.

## Lightweight Harness Workflow

This project uses a documentation-first Lightweight Harness. Detailed workflow and prompt contracts live in:

- `docs/harness/lightweight-harness.md`
- `docs/raw-requirements.md`
- `docs/user-stories.md`
- `docs/prompts/`

Required flow:

```txt
raw requirement -> user story -> DAG / dependency check -> Gate Plan -> branch -> scoped execution -> final check -> traceability/audit -> local commit -> Done Report -> PM push decision when applicable
```

Task progress and decisions must be traceable through:

- `docs/task-log.md`
- `docs/decision-log.md`
- `docs/audit-report.md`
- `docs/dev/branch-log.md`

## Product And Frontend Rules

This project is a BPO Workforce Management / BPO 人力计划与履约管理平台.

Future frontend work must follow `docs/quality/FRONTEND_RULES.md`. Summary:

- build a professional shadcn/ui-based B2B SaaS admin console
- use official shadcn dashboard examples, dashboard-01, New York style, and dark/light theme behavior as the baseline
- do not hand-roll UI when a shadcn/ui component exists
- use semantic theme tokens instead of custom color systems
- keep dark/light mode mandatory
- use a professional two-level sidebar with first-level icons and text-first secondary items
- keep dashboard pages split into established components such as `AppSidebar`, `SiteHeader`, `SectionCards`, chart/table components, and supporting panels

These frontend rules do not authorize new frontend implementation outside a confirmed Gate.

## Archive Boundary

The previous project workspace has been archived outside this clean root as:

- `/Users/mac/Documents/Codex/01_Projects/bpo-schedule-platform-lab/`

The lab archive is reference material only. Codex must not import from it, wire it into build/lint/check flows, or copy large modules into active source without a confirmed migration task.

## Verification Requirement

- Use a two-tier verification model:
  - **Focused verification** during implementation or Qoder review: run the smallest relevant tests, typecheck/lint when touched scope requires it, and `git diff --check`.
  - **Final verification** before reporting a task complete or making a local commit: run `bash scripts/check.sh` after traceability/audit updates.
- Do not rerun the full 600+ Node/backend suite after every tiny edit if a focused command proves the current edit. Save the full gate for coherent task completion and commit readiness.
- Documentation-only changes also require final verification, but may use focused checks first while editing.
- If check fails, the Done Report must explain the failure and recommended next action.

## Documentation Rules

- Task progress must update `docs/dev/branch-log.md`.
- Important scope decisions must update `docs/current/PROJECT_CONTEXT.md` and `docs/registry/DECISION_INDEX.yaml` when they affect current execution state or decision lookup.
- Legacy `docs/PROJECT_STATE.md` is History-On-Demand after the current layer exists; update it only when the active Gate explicitly requires legacy traceability.
- Done Reports should follow `docs/quality/DONE_REPORT_TEMPLATE.md`.
