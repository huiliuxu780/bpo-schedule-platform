# 月班表 Draft/Published 持久化产品契约 v0.1

## 1. 文档定位

本文定义月班表从系统生成草稿、排班师人工修正、保存草稿、排定发布、未来生效、撤回、修订到下游可见的产品契约。

本文只授权产品契约、领域对象字段草案、状态机、验收用例和 Harness 追踪更新；不授权数据库表、ORM、migration、API、权限审批、通知、导出、批量、Excel 导入、预测模型、标准人力或自动排班实现。

## 2. 已确认产品决策

| 决策项 | 第一版口径 |
| --- | --- |
| 版本模型 | 一个 `RosterVersion` 做状态流转，草稿、待生效发布版、当前发布版和历史发布版同源 |
| 版本范围 | 一个 `RosterVersion` 只属于一个 `project + workplace + team + rosterMonth` |
| Active draft | 同范围同月份只允许一个 active draft |
| Current published | 同范围同月份只允许一个 current published |
| Scheduled published | 同范围同月份只允许一个 scheduled_published |
| 发布后修改 | 已发布版本不可直接改，只能创建 revision draft |
| Revision 来源 | 修订草稿默认从 current published 复制创建 |
| 未来生效 | 发布支持 `effectiveAt`，按职场时区解释，默认目标月 1 日 00:00 |
| 下游可见 | draft 只给排班师；scheduled_published 作为 upcoming 对小组长/一线可见 |
| 自动生效 | 到 `effectiveAt` 后系统自动把 scheduled_published 切为 current |
| 失败处理 | 生效失败保留旧 current，新版本进入 `activation_failed` |
| 保存策略 | 第一版手动保存草稿，前端本地编辑不自动入库 |
| 发布校验 | 硬错误阻断发布；软风险允许发布但必须留痕 |
| 撤回 | scheduled_published 或 current published 可撤回，撤回后回到上一 current |
| 审计 | 记录版本生命周期事件、格子级 change log 和发布派生快照 |

## 3. 状态机

### 3.1 RosterVersion 状态

| 状态 | 含义 | 可编辑 | 下游默认可见 | 退出条件 |
| --- | --- | --- | --- | --- |
| `draft` | 排班师可编辑草稿 | 是，需持有编辑锁 | 否 | 保存、作废、排定发布 |
| `scheduled_published` | 已发布承诺，等待未来生效 | 否 | 是，作为 upcoming | 自动生效、撤回、生效失败 |
| `published` | 当前生效发布版 | 否 | 是，作为 current | 被新版本替代、撤回 |
| `superseded` | 被新发布版替代的历史发布版 | 否 | 历史可查 | 无 |
| `voided` | 作废草稿或撤回发布版 | 否 | 默认不进入班表视图 | 历史可查，可复制成新 draft |
| `activation_failed` | 到点自动生效失败 | 否 | 异常清单可见，不作为 current/upcoming | 重试成功、撤回 |

### 3.2 主要流转

```text
system_generate -> draft
draft -> draft (save)
draft -> voided (void draft)
draft -> scheduled_published (publish with future effectiveAt)
draft -> published (publish with immediate effectiveAt)
scheduled_published -> published (automatic activation success)
scheduled_published -> activation_failed (automatic activation failure)
activation_failed -> published (manual retry activation success)
scheduled_published -> voided (withdraw before activation)
published -> superseded (new version becomes current)
published -> voided (withdraw current, previous current restored)
published -> draft (create revision draft, source remains immutable)
```

### 3.3 生效时间规则

1. `effectiveAt` 精确到分钟。
2. `effectiveAt` 不能早于当前时间。
3. `effectiveAt` 默认目标月 1 日 00:00。
4. `effectiveAt` 可早于目标月开始，用于提前切换；不得晚于目标月结束。
5. `effectiveAt` 按职场时区解释，并保存职场时区和标准时间戳。
6. 如果目标月已开始且该范围/月没有 current published，首次发布默认立即生效。
7. 如果目标月已开始且无 current，排班师仍选择未来时间，系统必须提示当前窗口无生效班表。

## 4. 领域对象字段草案

字段草案用于产品和领域建模，不等同于数据库表设计。

### 4.1 RosterVersion

| 字段 | 说明 |
| --- | --- |
| `rosterVersionId` | 月班表版本 ID |
| `projectId` | 项目 |
| `workplaceId` | 职场 |
| `teamId` | 小组 |
| `rosterMonth` | 目标月份，例如 `2026-08` |
| `versionNo` | 同范围同月份递增业务版本号，例如 `V1`、`V2` |
| `status` | `draft`、`scheduled_published`、`published`、`superseded`、`voided`、`activation_failed` |
| `isCurrent` | 是否为该范围/月当前生效发布版 |
| `effectiveAt` | 生效时间 |
| `effectiveTimezone` | 职场时区，例如 `Asia/Shanghai` |
| `sourceVersionId` | 版本来源 |
| `sourceType` | `system_generated`、`revision_from_published`、`regenerated_from_draft`、`copied_from_voided` |
| `createdBy` / `createdAt` | 创建人和时间 |
| `savedBy` / `savedAt` | 最近保存人和时间 |
| `publishedBy` / `publishedAt` | 发布人和时间 |
| `publishNote` | 发布说明，发布和撤回必填 |
| `withdrawnBy` / `withdrawnAt` | 撤回人和时间 |
| `withdrawNote` | 撤回说明 |
| `lockOwner` / `lockExpiresAt` | 编辑锁持有人和到期时间 |
| `hardErrorCount` | 当前硬错误数量 |
| `softRiskCount` | 当前软风险数量 |
| `changeSummary` | 发布前差异摘要 |
| `publishedSnapshotId` | 发布时派生快照 ID |

### 4.2 RosterCell

| 字段 | 说明 |
| --- | --- |
| `rosterCellId` | 稳定格子 ID |
| `rosterVersionId` | 所属版本 |
| `employeeId` | 员工 |
| `businessDate` | 业务日期 |
| `sequence` | 同员工同日多记录序号 |
| `assignmentKind` | `shift`、`annotation`、`rest`、`unassigned` |
| `shiftCode` | 班种代码 |
| `annotationCode` | 标注代码 |
| `sourceCellId` | 来源格子 ID，用于版本 lineage 和 diff |
| `sourceType` | `generated`、`manual_edit`、`copied_from_published`、`conflict_kept` |
| `manualNote` | 人工调整说明 |
| `lastEditedBy` / `lastEditedAt` | 最近编辑人和时间 |
| `validationState` | `valid`、`blocked`、`warning` |

`rosterCellId` 的产品定位粒度是 `version + employee + businessDate + sequence`。同一员工同一天允许多条记录，每条记录都可被未来请假、换班、异常修复申请引用。

### 4.3 RosterVersionEvent

| 字段 | 说明 |
| --- | --- |
| `eventId` | 事件 ID |
| `rosterVersionId` | 关联版本 |
| `eventType` | 生命周期事件类型 |
| `actorType` | `user` 或 `system` |
| `actorId` | 操作者；系统事件记录系统标识 |
| `occurredAt` | 发生时间 |
| `fromStatus` / `toStatus` | 前后状态 |
| `reason` | 原因或说明 |
| `metadata` | 校验结果、失败原因、重试次数等 |

第一版至少记录：生成草稿、保存草稿、作废草稿、发布/排定生效、自动生效成功、自动生效失败、重试生效、撤回发布、创建修订草稿。

### 4.4 RosterCellChangeLog

| 字段 | 说明 |
| --- | --- |
| `changeLogId` | 变更记录 ID |
| `rosterVersionId` | 关联版本 |
| `rosterCellId` | 关联格子 |
| `changeType` | `create`、`update_shift`、`update_annotation`、`delete`、`restore_generated` |
| `beforeValue` / `afterValue` | 变更前后值 |
| `changedBy` / `changedAt` | 操作者和时间 |
| `changeReason` | 调整原因 |

保存草稿时应保存整个月人员级班表快照，并保留格子级 change log。change log 用于审计，不要求每次前端本地编辑都立即入库。

### 4.5 PublishedRosterSnapshot

| 字段 | 说明 |
| --- | --- |
| `publishedSnapshotId` | 快照 ID |
| `rosterVersionId` | 发布版本 |
| `shiftCountSummary` | 发布时班次数摘要 |
| `halfHourCoverageSummary` | 发布时半小时覆盖摘要 |
| `softRiskSummary` | 发布时软风险摘要 |
| `diffSummary` | 发布前差异摘要 |
| `createdAt` | 快照生成时间 |

发布时必须固化班次数、半小时覆盖、软风险摘要和差异摘要。历史审计以发布时快照为准，后续重新计算只作为校验。

## 5. 草稿生成、保存与重新生成

### 5.1 生成草稿

1. 同范围同月份没有 active draft 时，排班师可生成草稿。
2. 如果已有 active draft，系统默认进入该草稿继续编辑。
3. 重新生成草稿必须明确作废当前草稿或在当前草稿内触发 regenerate。
4. regenerate 默认保留人工调整；新生成结果与人工调整冲突时进入待确认冲突清单。
5. 草稿创建时冻结基础数据快照：员工、团队、班种定义、生成输入和职场时区。
6. 后续基础数据变化不静默改草稿，只在打开、保存、发布前提示并要求确认。

### 5.2 保存草稿

1. 第一版为手动保存；前端本地编辑不自动入库。
2. 保存草稿允许存在硬错误，但该草稿标记为 blocked draft，不能发布。
3. 保存整个月人员级班表快照和格子级 change log。
4. 保存草稿不强制填写发布说明。
5. 离开页面前如果存在未保存编辑，应提示排班师。

### 5.3 作废草稿

1. active draft 可作废为 `voided`。
2. voided draft 不可编辑、不可发布、不可恢复。
3. voided draft 保留只读快照和审计事件。
4. 排班师可从 voided draft 复制创建新 draft，新的 draft 必须有新的版本 ID 和 lineage。

## 6. 编辑锁

1. 打开草稿可查看；进入编辑需要获得编辑锁。
2. 同一 active draft 第一版只允许一个排班师持有编辑锁。
3. 编辑锁默认 30 分钟，可续租。
4. 持锁人保存、发布、离开或手动退出编辑时释放锁。
5. 超时自动释放。
6. 管理员或排班负责人可强制释放锁。
7. 其他用户只读查看，并看到持锁人和锁到期时间。

本文只定义产品语义，不规定锁的技术实现。

## 7. 发布、未来生效与下游可见

### 7.1 发布前

发布前必须完成：

1. 无硬错误。
2. 发布说明必填。
3. 展示发布前差异摘要。
4. 展示软风险摘要。
5. 如果已有 scheduled_published，必须先撤回它，才能发布新的 scheduled_published。
6. 如果 scheduled_published 存在，仍允许创建和保存 revision draft，但不能发布覆盖它。

### 7.2 发布动作

1. 排班师自己发布；第一版不做审批。
2. 如果 `effectiveAt <= now`，发布后立即成为 current published。
3. 如果 `effectiveAt > now`，版本进入 `scheduled_published`。
4. scheduled_published 已经是发布承诺，不允许直接编辑。
5. scheduled_published 如需修改，必须先撤回，再创建新 revision draft。

### 7.3 下游读取

| 场景 | 读取口径 |
| --- | --- |
| 排班师编辑 | 读取 active draft |
| 小组长/一线看当前业务日期 | 读取已生效 current published |
| 小组长/一线看未来业务日期 | 可读取 upcoming scheduled_published，并标注生效时间 |
| scheduled_published 被撤回 | 不再默认作为 upcoming 显示，版本历史保留撤回记录 |
| activation_failed | 不作为 current/upcoming，进入异常清单 |

下游默认只看有效 current/upcoming，不看 draft。draft 预览给小组长或一线属于后续权限/协同能力，不在本契约实现。

## 8. 自动生效、失败与撤回

### 8.1 自动生效

1. scheduled_published 到 `effectiveAt` 后由系统自动生效。
2. 自动生效成功时，该版本变为 `published` 且 `isCurrent=true`。
3. 原 current published 变为 `superseded`。
4. 系统写入自动生效事件。

本文只定义系统必须按职场时区和 `effectiveAt` 生效，不规定 cron、queue 或 background job 技术方案。

### 8.2 生效失败

1. 生效失败时，旧 current 保持不变。
2. 待生效版本进入 `activation_failed`。
3. 系统记录失败原因和失败事件。
4. 排班师可手动重试生效或撤回。
5. 重试成功后切为 current published；重试失败继续留在 `activation_failed`。

### 8.3 撤回

1. scheduled_published 生效前可撤回。
2. current published 可撤回。
3. 撤回必须填写撤回说明。
4. 撤回后当前口径回到上一 published 版本。
5. 被撤回版本进入 `voided`，默认不作为 current/upcoming 展示。
6. 小组长/一线默认看到恢复后的 current；版本历史显示撤回事实。

## 9. 校验规则

### 9.1 硬错误

以下硬错误阻断发布：

1. 无效班种。
2. 员工不存在、冻结或离职。
3. 员工不属于草稿快照中的项目、职场或小组。
4. 同员工同日 shift 工作时间重叠。
5. 缺少必需业务日期或员工行。
6. 未确认的重新生成冲突。
7. active draft 基础数据快照已失效且未确认。

Forecast 缺口和 Actual 偏差不是硬错误。

### 9.2 软风险

软风险允许发布，但必须进入发布记录：

1. Forecast shortage 或 surplus。
2. Actual mismatch。
3. 待排人员数量。
4. 无覆盖半小时数量。
5. 人工调整格子数量。
6. 已过滤标注或备注异常数量。

### 9.3 发布前差异摘要

发布前差异摘要至少包含三类：

| 类别 | 字段 |
| --- | --- |
| 版本差异 | 新增格子数、删除格子数、班种变化数、人员变化数、人工调整格子数 |
| 覆盖差异 | 半小时覆盖变化峰值、受影响日期数、受影响 slot 数 |
| 风险差异 | Forecast 缺口变化数、Actual mismatch 变化数、硬错误数、软风险数 |

差异基准优先选择同范围/月 current published；如果本次是替换待生效版本，则对比 scheduled_published；如果没有已发布版本，则对比空班表。

## 10. 申请流预留边界

请假、换班、调班、异常修复申请第一版只预留引用关系，不实现申请流。

后续申请应能引用：

1. `rosterVersionId`
2. `rosterCellId`
3. `employeeId`
4. `businessDate`
5. `sequence`
6. current published 或 upcoming scheduled_published 的可见状态

本契约不定义审批状态机、不定义权限、不定义申请表、不定义通知。

## 11. 不做项

本契约不做：

1. 数据库表、ORM、migration、repository 或 API 实现。
2. 权限、审批、供应商隔离、角色授权。
3. 站内通知、飞书、短信、邮件或其他外部通知。
4. 导出、批量操作。
5. Excel 上传/导入实现。
6. 预测模型、标准人力模型。
7. 自动排班、自动推荐、自动补班。
8. 生产公式、结算规则、收费因子。
9. 外部 CORN、HR、WFM 或第三方系统集成。

## 12. 验收用例

| 用例 | Given | When | Then |
| --- | --- | --- | --- |
| 首次生成草稿 | 同范围/月无 active draft | 排班师生成草稿 | 创建 `draft`，冻结基础数据快照 |
| 已有草稿 | 同范围/月已有 active draft | 排班师进入页面 | 默认继续编辑该 draft，不新建并行 draft |
| 保存 blocked draft | 草稿存在硬错误 | 排班师保存 | 保存成功，标记 blocked，发布入口不可用 |
| 发布硬错误阻断 | 草稿有无效班种或时间重叠 | 排班师发布 | 发布失败，提示硬错误 |
| 软风险发布 | 草稿无硬错误但有 Forecast 缺口 | 排班师发布 | 允许发布，发布记录保存软风险摘要 |
| 未来生效 | 排班师设置未来 `effectiveAt` | 发布草稿 | 版本进入 `scheduled_published`，下游 upcoming 可见 |
| 到点生效 | scheduled_published 到 `effectiveAt` | 系统触发生效 | 新版本变 current，旧 current 变 superseded |
| 生效失败 | 系统自动生效失败 | 记录失败 | 旧 current 保留，新版本进入 activation_failed |
| 重试生效 | activation_failed 存在 | 排班师重试 | 成功后变 current，失败则保留 activation_failed |
| 撤回待生效 | scheduled_published 未到点 | 排班师撤回并填原因 | 版本变 voided，不再作为 upcoming 展示 |
| 撤回 current | current published 发现错误 | 排班师撤回并填原因 | 当前口径回到上一 published，撤回版本进入 voided |
| 创建修订草稿 | current published 存在 | 排班师创建 revision draft | 新 draft 从 current copied，记录 `sourceVersionId` |
| 重新生成保留人工调整 | active draft 有人工调整 | 排班师重新生成 | 保留人工调整，冲突进入待确认 |
| 编辑锁 | A 持有编辑锁 | B 打开同一 draft | B 只读并看到锁持有人和到期时间 |
| voided draft | 草稿已作废 | 排班师查看 | 只读可查，不可恢复，可复制为新 draft |

## 13. 推荐下一步实现切片

1. 先写 backend pure-domain 状态机和校验模型：`RosterVersion`、`RosterCell`、`RosterVersionEvent`、硬错误/软风险、发布差异摘要。
2. 再写本地数据库持久化 slice：保存整月快照、change log、published snapshot、编辑锁。
3. 再接前端 workbench 的保存草稿、发布/排定生效、撤回和版本历史入口。

不建议下一步直接做审批、权限、通知、导出批量、Excel 导入、预测模型、标准人力或自动排班，因为这些都依赖本契约中的版本、格子 ID、状态机和审计事件稳定。
