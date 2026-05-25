# 周度来源压力计划

## 范围

- 在现有履约日历小组周视图增加“周度来源压力”只读卡片。
- 基于本地异常队列聚合来源轨道、异常数、高优数、升级数、阻塞证据、影响人员、影响日期、影响时长和下钻建议。
- 不新增页面、导航、依赖、后端、数据库、真实接口、权限、审批、导出、批量、真实处理或状态写入能力。

## 执行

1. 先在 `scripts/tests/person-timeline.test.mjs` 增加模型和页面顺序断言，观察红灯。
2. 在 `lib/person-timeline.ts` 增加 `weeklySourcePressureSummary` 聚合和类型。
3. 在 `app/person-timeline/page.tsx` 增加小组周视图侧栏卡片，位置在周度责任压力之后、本周复核队列之前。
4. 同步 current、trace、task log、audit、branch log。
5. 运行目标测试、产品文案/导航审计、lint、typecheck、浏览器 smoke、state check、diff check 和最终 check。

## 验收

- 小组周视图显示“周度来源压力”。
- 登录轨道与状态轨道能按升级、高优、异常数和影响时长排序。
- 卡片只提供查看和解释入口，不出现真实提交、保存、修复、审批、导出、批量或状态写入能力。
