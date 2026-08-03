# Example Dispatch Packet - F001 Frontend

This is a sample dispatch packet. It is not an instruction to start a subagent.

```yaml
task_id: "F001"
task_name: "BPO WFM Dashboard static frontend scaffold"
workflow: "frontend"
objective: "Implement or review a bounded static dashboard component within the confirmed F001 scope."
required_skills:
  - "shadcn"
  - "superpowers:test-driven-development"
  - "superpowers:verification-before-completion"
input_files:
  - "AGENTS.md"
  - "docs/PROJECT_STATE.md"
  - "tasks/backlog.yaml"
  - "docs/raw-requirements.md"
  - "docs/user-stories.md"
  - "docs/prompts/file_ownership_matrix.md"
  - "docs/prompts/frontend_agent_prompts.md"
allowed_files:
  - "components/section-cards.tsx"
  - "components/ui/card.tsx"
forbidden_files:
  - "backend/**"
  - "package.json"
  - "package-lock.json"
  - "pnpm-lock.yaml"
  - "yarn.lock"
  - "app/dashboard/data.ts"
stop_conditions:
  - "需要新增依赖"
  - "需要修改 package 或 lockfile"
  - "需要改变业务指标公式、状态码、结算公式或收费因子"
  - "需要接入真实 API、后端、数据库、权限、导出或批量操作"
  - "需要写入 allowed_files 以外的文件"
acceptance:
  - "仅调整 F001 静态 dashboard 已确认范围内的组件。"
  - "遵循 shadcn/ui Card composition 和 semantic tokens。"
  - "不新增业务能力。"
verification:
  - "git diff --check"
  - "bash scripts/check.sh"
return_format: "docs/prompts/README.md Required Return Format"
```
