# 周度闭环收口摘要计划

## 范围

- 在现有履约日历小组周视图增加“周度闭环收口摘要”只读卡片。
- 基于本地闭环准备趋势、证据缺口分布和周度决策摘要做收口聚合。
- 不新增页面、导航、依赖、后端、数据库、真实接口、权限、审批、导出、批量、真实关闭或状态写入能力。

## 执行

1. 先在 `scripts/tests/person-timeline.test.mjs` 增加模型和页面顺序断言，观察红灯。
2. 在 `lib/person-timeline.ts` 增加 `weeklyClosureCloseoutSummary` 类型和聚合。
3. 在 `app/person-timeline/page.tsx` 增加小组周视图侧栏卡片，位置在周度复核对比摘要之后、本周复核队列之前。
4. 同步 current、trace、task log、audit、branch log。
5. 运行目标测试、产品文案/导航审计、lint、typecheck、浏览器 smoke、state check、diff check 和最终 check。

## 验收

- 小组周视图显示“周度闭环收口摘要”。
- 卡片展示可推进日、未就绪日、待补材料、待主管判断、开放风险、关键收口项和下钻建议。
- 卡片只提供查看和解释入口，不出现真实关闭异常、提交、保存、审批、导出、批量或状态写入能力。
