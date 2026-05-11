# Subagent Prompt Contract

## Purpose

This folder defines prompt contracts for future subagent work in `bpo-schedule-platform`.

The contracts are documentation/control-layer only. They do not authorize subagent execution, new frontend implementation, backend implementation, dependency installation, package changes, new mock data, real API integration, or database work.

## Execution Rule

Subagents may be used only when all conditions are true:

- The PM has confirmed the Gate Plan.
- The user explicitly allows subagents, delegation, or parallel agent work for the task.
- The work is split into independent tasks with non-overlapping write scopes.
- Each subagent receives a bounded prompt with inputs, allowed files, forbidden files, stop conditions, and required output format.
- The main Codex worker remains responsible for integration, verification, logs, and final Done Report.

## Prompt Files

- `pm_agent_prompts.md`: raw requirements, user stories, DAG, ambiguity questions.
- `uiux_agent_prompts.md`: page structure, component plan, interaction states, design constraints.
- `frontend_agent_prompts.md`: frontend implementation plan or scoped frontend execution.
- `backend_agent_prompts.md`: backend API/model implementation plan or scoped backend execution.
- `qa_agent_prompts.md`: test plan, acceptance matrix, verification risks.
- `doc_agent_prompts.md`: traceability, task log, decision log, audit report.
- `implementer_prompt.md`: generic implementation worker prompt.
- `spec_reviewer_prompt.md`: reviewer prompt for scope and spec compliance.
- `code_quality_reviewer_prompt.md`: reviewer prompt for maintainability, tests, and risks.
- `file_ownership_matrix.md`: default write/read ownership by subagent role.
- `examples/frontend_dispatch_f001.md`: sample frontend dispatch packet for F001.
- `examples/reviewer_dispatch.md`: sample read-only reviewer dispatch packet.

## Local Skill Assignment

Use the local shadcn skill at `/Users/mac/.codex/skills/shadcn/SKILL.md` for shadcn-specific frontend work.

Primary users:

- UI/UX Agent
- Frontend Agent
- Implementer
- Code Quality Reviewer

Secondary/reference user:

- QA Agent, only for UI acceptance checks

Not default users:

- PM Agent
- Backend Agent
- Doc Agent

The shadcn skill applies to component selection, shadcn CLI checks, component docs, registries, composition rules, semantic tokens, dark/light theme behavior, and avoiding custom UI when a shadcn component exists.

The shadcn skill does not authorize `npx shadcn@latest add`, preset changes, package changes, dependency installation, component overwrites, or registry changes unless the confirmed Gate explicitly allows those actions.

## Required Dispatch Packet

Every subagent dispatch must include:

```yaml
task_id: "H004"
task_name: "任务名称"
workflow: "harness | planning | frontend | backend | qa | docs"
objective: "本次子任务目标"
input_files:
  - "AGENTS.md"
  - "docs/PROJECT_STATE.md"
allowed_files:
  - "docs/prompts/**"
forbidden_files:
  - "package.json"
  - "package-lock.json"
  - "pnpm-lock.yaml"
  - "yarn.lock"
stop_conditions:
  - "需要修改业务指标、状态码、结算公式或收费因子"
  - "需要新增依赖"
acceptance:
  - "可验证的验收标准"
verification:
  - "git diff --check"
required_skills:
  - "shadcn"
```

Before dispatch, the Main Worker must check `docs/prompts/file_ownership_matrix.md` and confirm that write scopes do not overlap.

## Required Return Format

Every subagent must return:

```json
{
  "status": "DONE | DONE_WITH_CONCERNS | NEEDS_CONTEXT | BLOCKED",
  "summary": ["完成了什么"],
  "changed_files": ["path/to/file.md"],
  "tests_run": [
    {
      "command": "git diff --check",
      "result": "passed"
    }
  ],
  "risks": ["仍需主控注意的风险"],
  "questions": ["需要 PM 或主控确认的问题"],
  "next_steps": ["建议下一步"]
}
```

## Status Rules

- `DONE`: 完成子任务，未发现需要主控介入的问题。
- `DONE_WITH_CONCERNS`: 完成子任务，但发现范围、质量或验证风险。
- `NEEDS_CONTEXT`: 缺少必要上下文，不能继续。
- `BLOCKED`: 触发停止条件，必须交还主控或 PM。

## Universal Stop Conditions

All subagents must stop when the task requires:

- business code outside the confirmed scope
- dependency installation
- package or lockfile changes
- real API, backend, database, permission, export, approval, or batch-operation capability
- business metric, status-code, settlement-formula, or charge-factor changes
- lab archive import or migration
- write access outside `allowed_files`
- cleanup or deletion of unrelated dirty/untracked files

## Review Chain

For implementation work, the main Codex worker should use this chain:

```txt
Implementer -> Spec Reviewer -> Code Quality Reviewer -> Main Worker Integration -> Verification -> Done Report
```

The reviewer agents should not modify files. They return findings only.
