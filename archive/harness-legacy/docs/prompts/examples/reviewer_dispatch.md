# Example Dispatch Packet - Reviewer

This is a sample reviewer dispatch packet. It is not an instruction to start a subagent.

```yaml
task_id: "F001"
task_name: "Review BPO WFM Dashboard static frontend scaffold"
workflow: "review"
objective: "Review whether the implementation matches the confirmed Gate and follows shadcn/frontend quality rules."
required_skills:
  - "shadcn"
input_files:
  - "AGENTS.md"
  - "docs/PROJECT_STATE.md"
  - "tasks/backlog.yaml"
  - "docs/raw-requirements.md"
  - "docs/user-stories.md"
  - "docs/prompts/spec_reviewer_prompt.md"
  - "docs/prompts/code_quality_reviewer_prompt.md"
  - "docs/prompts/file_ownership_matrix.md"
diff_source:
  - "git diff"
allowed_files: []
forbidden_files:
  - "**/*"
stop_conditions:
  - "需要修改文件"
  - "无法判断是否符合 Gate"
acceptance:
  - "输出 findings，不修改文件。"
  - "检查是否越过 F001 静态 prototype 范围。"
  - "检查 shadcn composition、semantic tokens、dark/light theme 和手写 UI 反模式。"
verification:
  - "read-only review"
return_format: "docs/prompts/spec_reviewer_prompt.md or docs/prompts/code_quality_reviewer_prompt.md Output Format"
```
