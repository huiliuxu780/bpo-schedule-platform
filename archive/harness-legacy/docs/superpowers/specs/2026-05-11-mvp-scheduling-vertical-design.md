# MVP Scheduling Vertical Design

## 目标

本设计将 `bpo-schedule-platform` 从静态 dashboard scaffold 推进到正式系统建设的第一条前后端纵切。

第一条纵切确定为：排班计划列表、排班计划详情、Python + FastAPI 只读接口、本地种子数据和基础验证闭环。

## 背景

当前项目已经完成：

- F001 静态 BPO WFM dashboard scaffold
- H006 开发前 Harness 收口
- H007 Node.js 22 开发环境与交付验证固化

当前项目还没有：

- backend 工程
- FastAPI 接口
- 数据库
- 认证
- 真实 Excel 导入
- 真实 CORN 集成
- 生产权限、审批、导出或批量能力

## 方案选择

### 方案 A：前端继续静态 mock

优点是最快看到页面，但无法验证真实系统边界。

缺点是继续积累前端假数据，后续接后端时容易返工。

### 方案 B：先搭完整后端基础

优点是工程基础更完整。

缺点是短期业务反馈少，容易在数据库、认证、权限上提前扩大范围。

### 方案 C：前后端一条纵切

优点是能同时验证前端页面、后端接口、数据契约和交付流程。

缺点是需要更严格控制范围，避免把编辑、发布、审批、导出和真实集成一起带进来。

推荐并采用方案 C。

## 第一条纵切范围

### 包含

- 排班计划列表
- 排班计划详情
- FastAPI 只读接口
- 本地种子数据
- 前端 API client
- 接口错误展示
- 基础验证命令

### 不包含

- 新增排班计划
- 编辑排班计划
- 发布排班计划
- 审批流
- 批量操作
- 导出
- 认证和权限
- 数据库
- 真实 Excel 导入
- 真实 CORN API
- 智能排班算法
- 结算公式

## 用户角色

### 排班人员

查看排班计划列表和详情，识别日期、职场、项目和时段缺口。

### 运营负责人

查看覆盖率和缺口风险，判断哪些计划需要优先复核。

### 前端应用

通过 API client 读取 FastAPI 数据，而不是继续直接使用组件内 mock。

### 后端服务

从本地种子数据返回稳定的计划列表和详情响应。

## 数据模型草案

### SchedulePlanSummary

```ts
type SchedulePlanSummary = {
  id: string
  plan_date: string
  project_name: string
  site_name: string
  version: string
  status: "draft" | "review_ready" | "published"
  forecast_agents: number
  scheduled_agents: number
  gap_agents: number
  coverage_rate: number
  updated_at: string
}
```

### SchedulePlanDetail

```ts
type SchedulePlanDetail = {
  summary: SchedulePlanSummary
  intervals: SchedulePlanInterval[]
}
```

### SchedulePlanInterval

```ts
type SchedulePlanInterval = {
  interval_start: string
  interval_end: string
  forecast_agents: number
  scheduled_agents: number
  gap_agents: number
  coverage_rate: number
  note: string
}
```

## API 草案

### GET /api/v1/schedule-plans

返回排班计划列表。

成功响应：

```json
{
  "items": [
    {
      "id": "plan-20260511-shanghai-bosch-v1",
      "plan_date": "2026-05-11",
      "project_name": "博西客服",
      "site_name": "上海职场",
      "version": "v1",
      "status": "review_ready",
      "forecast_agents": 128,
      "scheduled_agents": 121,
      "gap_agents": 7,
      "coverage_rate": 0.945,
      "updated_at": "2026-05-11T09:30:00+08:00"
    }
  ]
}
```

### GET /api/v1/schedule-plans/{plan_id}

返回单个排班计划详情。

失败响应：

```json
{
  "error": {
    "code": "SCHEDULE_PLAN_NOT_FOUND",
    "message": "排班计划不存在"
  }
}
```

## MVP 口径边界

计划状态暂定为：

- `draft`
- `review_ready`
- `published`

覆盖率暂按以下公式展示：

```txt
coverage_rate = scheduled_agents / forecast_agents
```

当 `forecast_agents` 为 0 时，`coverage_rate` 展示为 1，避免除零错误。

这些口径只用于第一条纵切展示，不代表生产最终状态码、排班拟合度、排班遵守率或结算规则。

## 后续任务拆分

### M001

需求拆分与第一条纵切设计。只改文档，不写业务代码。

### B001

创建 Python + FastAPI 后端基础，提供只读排班计划列表和详情接口。

### F005

创建排班计划前端列表和详情入口，并通过 API client 读取 B001 接口。

### Q001

验证第一条纵切，包括前端构建、后端测试、接口契约和 Harness check。

## 风险与阻塞

### 状态码风险

`draft`、`review_ready`、`published` 只是 MVP 展示状态。生产状态码必须后续单独确认。

### 公式风险

`coverage_rate = scheduled_agents / forecast_agents` 只解决第一条纵切展示，不覆盖排班拟合度、排班遵守率、异常工时或可结算工时。

### 范围膨胀风险

第一条纵切不做新增、编辑、发布、审批、导出、批量操作、认证、数据库或真实集成。

## 验收

- Raw requirements 新增 `R003-R010`。
- User stories 新增 `US006-US016`。
- Backlog 新增 `M001`、`B001`、`F005`、`Q001`。
- 第一条纵切范围固定为排班计划。
- `git diff --check` 通过。
- `bash scripts/check.sh` 通过。
