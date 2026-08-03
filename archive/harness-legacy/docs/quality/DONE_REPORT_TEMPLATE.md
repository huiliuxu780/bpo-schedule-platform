# Done Report Template

所有 Done Report 必须使用中文输出。

## Done Report

### 改了什么

-

### 改了哪些文件

-

### 验证结果

- `git diff --check`：
- `bash scripts/check.sh`：
- 其他：

### 范围确认

- 是否修改业务代码：
- 是否修改数据结构：
- 是否新增依赖：
- 是否修改 package / lockfile：
- 是否接入真实 API：
- 是否修改 Archive / Lab：

### 状态治理

- 是否查询历史：
- 查询了哪些历史文件：
- 查询原因：
- 是否更新 `docs/current/**`：
- 是否更新 `docs/registry/**`：
- 是否归档：
- `bash scripts/check-state.sh`：
- `bash scripts/check-state.sh --repair-scope`：

### 人工验收方式

1.
2.
3.

### 遗留问题

-

### 下一步建议

1. 本阶段完成了什么：
2. 验证是否通过：
3. 当前还剩什么：
4. 推荐下一阶段做哪 2-3 个：
5. 为什么推荐这个顺序：
6. 哪些事情暂时不建议做：
7. 如果 PM 不反对，默认从推荐第 1 项继续开发：

### Git 提交状态

- task_id：
- story_ids：
- branch_name：
- base_main_commit：
- remote_status：
- allowed_files_check：
- scope_diff_check：
- check_result：
- local_commit_sha：
- integration_status：
- integration_method：
- integration_commit_sha：
- merge_to_main_commit：
- push_decision：
- blocked_reason：
- commit message：
- 是否建议 push：
