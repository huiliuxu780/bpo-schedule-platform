# Roadmap

## 1. 本地验收版必须完成

1. 补 `scripts/start-demo.sh` 或正式把 `scripts/dev.sh` 定为 demo 启动入口。
2. 补本地 demo health check：前端 200、后端 `/api/v1/schedule-plans` 可访问。
3. 补核心路径 smoke/e2e：`/schedule-plans -> detail -> risks/shift/unavailability -> back`。
4. 整理一份短 known issues，明确无数据库、无真实集成、无审批/导出/批量。
5. 将当前 ahead 4 的产品提交和本次盘点文档处理到明确分支状态。

## 2. 测试环境发布前必须完成

1. 新增测试环境部署 runbook：Node 22、Python 3.12、install、build、start、env、health check。
2. 明确 `BPO_API_BASE_URL` 和前后端部署拓扑。
3. 在真实机器或 CI runner 上验证 uvicorn 可监听并返回 API。
4. 建立发布前命令顺序：install -> check -> build -> start -> smoke。
5. 压缩/窗口化 Harness 索引和长日志，避免测试发布前读错入口。

## 3. 云部署后再做

1. 数据库持久化、ORM、迁移和 schema。
2. 认证、权限、用户与审计。
3. 真实 Excel/CORN/外部系统集成。
4. 审批、发布、导出、批量调班。
5. 生产风险公式、状态码、结算规则、收费因子。
