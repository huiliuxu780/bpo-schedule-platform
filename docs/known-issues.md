# Known Issues

当前列表记录不阻塞本地验收、但需要后续处理的问题。

| ID | 问题 | 级别 | 是否阻塞本地验收 | 建议处理阶段 |
| --- | --- | --- | --- | --- |
| KI-001 | `unavailability` detail 的返回计划详情链接未携带 `planId`，当前 E2E 使用 browser history 返回。F001 已修复，页面内返回链接现在可回到对应 plan detail。 | P1 resolved | 否 | 已在 F001 关闭 |
| KI-002 | 云测试环境尚未配置，当前只有本地验收能力。R006 已选择推荐方案，但尚未实施。 | P0 for cloud staging | 否 | R007 云测试环境实施 |
| KI-003 | `docs/registry/TRACE_INDEX.yaml` 已超过 warning budget，但未超过 strict fail。 | P2 | 否 | 后续 trace 瘦身或归档窗口 |
