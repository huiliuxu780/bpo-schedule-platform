# User Stories

本文件记录由原始需求拆分出来的用户故事、最小交付单元、依赖关系和验收标准。

## Schema

```yaml
- id: US001
  requirement_ids:
    - R001
  module: "模块名称"
  role: "用户角色"
  story: "作为某类用户，我希望完成某个动作，以便获得某个业务价值。"
  task_type: "product"
  priority: "P0"
  acceptance:
    - "验收标准 1"
    - "验收标准 2"
  dependencies: []
  status: "draft"
```

## DAG Rules

- 每条用户故事必须关联至少一条原始需求。
- `dependencies` 只能引用已经存在的用户故事、决策或口径确认项。
- 若发现循环依赖，相关故事必须标记为 `blocked`。
- 涉及结算公式、状态码、权限、导出、批量操作或真实数据来源时，必须先生成 PM 确认问题。

## Stories

### US569-US571 - 数据质量分组步骤 owner/人员负载摘要

```yaml
stories:
  - id: US569
    requirement_ids: [R594, R595]
    task_ids: [F395]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到分组步骤按 owner 和人员汇总的负载摘要，以便判断先协调哪个责任人。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US570
    requirement_ids: [R596]
    task_ids: [F395]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望 owner/人员负载摘要展示 owner、步骤数、影响人员、代表问题和查看入口，以便继续只读追溯。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US571
    requirement_ids: [R597]
    task_ids: [Q113]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望分组步骤 owner/人员负载摘要完成后做收口验证，确认页面展示、模型测试和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量分组模型提供分组步骤 owner/人员负载摘要，基于分组步骤影响对象聚合。"
  - "数据质量总览页展示分组步骤 owner/人员负载摘要卡片，包含 owner、步骤数、影响人员、代表问题、入口和暂缓能力。"
  - "没有分组步骤时展示空状态，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality-groups.test.mjs`、`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US566-US568 - 数据质量分组步骤影响对象摘要

```yaml
stories:
  - id: US566
    requirement_ids: [R590, R591]
    task_ids: [F394]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到分组复核步骤的影响对象摘要，以便知道每个步骤要先看哪个问题、人员和对象。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US567
    requirement_ids: [R592]
    task_ids: [F394]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望影响对象摘要展示步骤、代表问题、影响人员、影响对象、质量详情入口和人员履约入口，以便继续只读追溯。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US568
    requirement_ids: [R593]
    task_ids: [Q112]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望分组复核步骤影响对象摘要完成后做收口验证，确认页面展示、模型测试和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量分组模型提供分组步骤影响对象摘要，基于分组复核顺序和代表问题聚合。"
  - "数据质量总览页展示分组步骤影响对象摘要卡片，包含步骤、代表问题、人员、影响对象、质量详情入口、人员履约入口和暂缓能力。"
  - "没有分组步骤时展示空状态，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality-groups.test.mjs`、`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US563-US565 - 数据质量分组复核顺序摘要

```yaml
stories:
  - id: US563
    requirement_ids: [R586, R587]
    task_ids: [F393]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到质量分组复核顺序，以便先处理影响履约异常最多的分组。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US564
    requirement_ids: [R588]
    task_ids: [F393]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望复核顺序展示步骤、owner、代表问题、影响异常、影响人员、阻断行和查看入口，以便按顺序只读追溯。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US565
    requirement_ids: [R589]
    task_ids: [Q111]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望质量分组复核顺序完成后做收口验证，确认页面展示、模型测试和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量分组模型提供分组复核顺序摘要，基于分组异常影响覆盖排序。"
  - "数据质量总览页展示质量分组复核顺序卡片，包含步骤、owner、代表问题、影响异常、影响人员、阻断行、入口和暂缓能力。"
  - "没有分组异常影响时展示空状态，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality-groups.test.mjs`、`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US560-US562 - 数据质量分组异常影响覆盖摘要

```yaml
stories:
  - id: US560
    requirement_ids: [R582, R583]
    task_ids: [F392]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到质量分组对履约异常的影响覆盖，以便知道哪些分组正在影响最多异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US561
    requirement_ids: [R584]
    task_ids: [F392]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望分组影响覆盖展示分组、风险、owner、影响异常、影响人员、阻断行、代表问题和入口，以便继续只读追溯。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US562
    requirement_ids: [R585]
    task_ids: [Q110]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望质量分组异常影响覆盖完成后做收口验证，确认页面展示、模型测试和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量分组模型提供分组异常影响覆盖摘要，包含影响分组、影响异常、影响人员、阻断行、代表问题、字段、模板、分组入口和暂缓能力。"
  - "数据质量总览页展示质量分组异常影响覆盖卡片。"
  - "没有分组异常影响时展示空状态，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality-groups.test.mjs`、`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US557-US559 - 数据质量复核建议质量分组摘要

```yaml
stories:
  - id: US557
    requirement_ids: [R578, R579]
    task_ids: [F391]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到复核建议关联的质量分组，以便判断建议问题是否已经进入原因分组。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US558
    requirement_ids: [R580]
    task_ids: [F391]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望质量分组摘要展示分组、风险、owner、字段、模板和分组入口，以便继续只读复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US559
    requirement_ids: [R581]
    task_ids: [Q109]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望复核建议质量分组摘要完成后做收口验证，确认页面展示、模型测试和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量分组模型提供复核建议质量分组摘要，包含建议问题、匹配分组、未分组、分组问题、风险、owner、字段、模板、分组入口和暂缓能力。"
  - "数据质量总览页展示复核建议质量分组卡片。"
  - "没有建议问题或分组匹配时展示空状态，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality-groups.test.mjs`、`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US554-US556 - 数据质量复核建议导入批次影响摘要

```yaml
stories:
  - id: US554
    requirement_ids: [R574, R575]
    task_ids: [F390]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到复核建议关联的导入批次影响，以便知道建议问题来自哪个批次和失败行。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US555
    requirement_ids: [R576]
    task_ids: [F390]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望导入批次影响摘要展示批次数、失败行、影响对象、匹配字段和批次入口，以便继续只读追溯。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US556
    requirement_ids: [R577]
    task_ids: [Q108]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望复核建议导入批次影响摘要完成后做收口验证，确认页面展示、模型测试和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供复核建议导入批次影响摘要，包含建议问题、批次数、失败行、影响对象、匹配字段、批次入口和暂缓能力。"
  - "数据质量总览页展示复核建议导入批次影响卡片。"
  - "没有建议问题或批次影响时展示空状态，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US551-US553 - 数据质量缺口下一轮复核建议摘要

```yaml
stories:
  - id: US551
    requirement_ids: [R570, R571]
    task_ids: [F389]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到缺口下一轮复核建议，以便把 owner/来源压力转成可读的查看顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US552
    requirement_ids: [R572]
    task_ids: [F389]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望建议摘要展示建议标题、建议步骤、首要 owner、首要来源和代表问题入口，以便继续只读复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US553
    requirement_ids: [R573]
    task_ids: [Q107]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望缺口下一轮复核建议完成后做收口验证，确认页面展示、模型测试和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供缺口下一轮复核建议摘要，包含建议标题、建议步骤、首要 owner、首要来源、代表问题、查看入口和暂缓能力。"
  - "数据质量总览页展示缺口下一轮复核建议卡片。"
  - "没有缺口压力时展示无建议项，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US548-US550 - 数据质量缺口 owner/来源压力摘要

```yaml
stories:
  - id: US548
    requirement_ids: [R566, R567]
    task_ids: [F388]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到未覆盖缺口的责任人与来源压力，以便先判断由谁复核、先看哪个数据源。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US549
    requirement_ids: [R568]
    task_ids: [F388]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望压力摘要展示 owner、来源、影响异常、影响人员和首要缺口入口，以便安排下一步只读复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US550
    requirement_ids: [R569]
    task_ids: [Q106]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望 owner/来源压力摘要完成后做收口验证，确认页面展示、模型测试和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供缺口 owner/来源压力摘要，包含缺口问题数、影响异常数、影响人员数、首要 owner、首要来源、压力项和暂缓能力。"
  - "数据质量总览页展示缺口 owner/来源压力摘要卡片。"
  - "没有缺口时展示无压力项，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US545-US547 - 数据质量复核覆盖缺口摘要

```yaml
stories:
  - id: US545
    requirement_ids: [R562, R563]
    task_ids: [F387]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到复核覆盖缺口摘要，以便知道当前路径还没有覆盖哪些影响异常的问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US546
    requirement_ids: [R564]
    task_ids: [F387]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望缺口摘要展示未覆盖问题、字段、人员和查看入口，以便继续安排复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US547
    requirement_ids: [R565]
    task_ids: [Q105]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望复核覆盖缺口摘要完成后做收口验证，确认只读缺口、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供复核覆盖缺口摘要，包含总影响问题、已覆盖问题、未覆盖问题、首要缺口、缺口字段、缺口人员、查看入口和暂缓能力。"
  - "数据质量总览页展示复核覆盖缺口摘要卡片。"
  - "没有缺口时展示全部覆盖，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US542-US544 - 数据质量复核路径顺序

```yaml
stories:
  - id: US542
    requirement_ids: [R558, R559]
    task_ids: [F386]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到复核路径顺序，以便按问题、字段、日期、人员和原因依次查看。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US543
    requirement_ids: [R560]
    task_ids: [F386]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望每个路径步骤都有查看入口、理由和影响范围，以便快速判断先看哪里。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US544
    requirement_ids: [R561]
    task_ids: [Q104]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望复核路径顺序完成后做收口验证，确认只读路径、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供复核路径顺序，包含步骤类型、标题、查看入口、理由、影响异常数、影响人员数、路径总览和暂缓能力。"
  - "数据质量总览页展示复核路径顺序卡片。"
  - "没有路径影响时展示无复核路径，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US539-US541 - 数据质量复核优先级说明

```yaml
stories:
  - id: US539
    requirement_ids: [R554, R555]
    task_ids: [F385]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到复核优先级说明，以便理解为什么某个问题、字段、日期或人员需要先看。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US540
    requirement_ids: [R556]
    task_ids: [F385]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望优先级说明串联字段、日期、人员和原因摘要，以便形成可读的复核顺序理由。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US541
    requirement_ids: [R557]
    task_ids: [Q103]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望复核优先级说明完成后做收口验证，确认只读说明、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供复核优先级说明，包含优先级标题、排序理由、首要字段、首要日期、首要人员、代表问题、下一查看入口和暂缓能力。"
  - "数据质量总览页展示复核优先级说明卡片。"
  - "没有复核影响时展示无优先级说明，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US536-US538 - 数据质量字段影响交叉摘要

```yaml
stories:
  - id: US536
    requirement_ids: [R550, R551]
    task_ids: [F384]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到来源字段的交叉影响摘要，以便识别哪些字段同时影响日期、人员和履约异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US537
    requirement_ids: [R552]
    task_ids: [F384]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望字段摘要展示代表问题、影响日期、影响人员、影响异常和查看入口，以便按字段安排复核顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US538
    requirement_ids: [R553]
    task_ids: [Q102]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望字段交叉影响摘要完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供字段交叉影响摘要，包含来源字段、来源、代表原因、代表问题、影响日期数、影响人员数、影响异常数、首要查看入口和暂缓能力。"
  - "数据质量总览页展示字段影响交叉摘要卡片。"
  - "没有字段影响时展示无字段影响，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US533-US535 - 数据质量履约日期查看顺序

```yaml
stories:
  - id: US533
    requirement_ids: [R546, R547]
    task_ids: [F383]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到受影响履约日期的查看顺序，以便先进入影响最大的日期核对异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US534
    requirement_ids: [R548]
    task_ids: [F383]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望日期查看顺序展示代表问题、影响人员、影响异常和履约入口，以便按日期安排复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US535
    requirement_ids: [R549]
    task_ids: [Q101]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望数据质量履约日期查看顺序完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供履约日期查看顺序，包含业务日期、影响人员数、影响异常数、代表原因、代表问题、履约入口和暂缓能力。"
  - "数据质量总览页展示履约日期查看顺序卡片。"
  - "没有受影响日期时展示无日期影响，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US530-US532 - 数据质量人员履约查看顺序

```yaml
stories:
  - id: US530
    requirement_ids: [R542, R543]
    task_ids: [F382]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到受影响人员的查看顺序，以便从原因汇总快速进入个人履约核对。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US531
    requirement_ids: [R544]
    task_ids: [F382]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望人员查看顺序展示代表原因、代表问题、影响异常和个人履约入口，以便按影响优先级逐个查看。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US532
    requirement_ids: [R545]
    task_ids: [Q100]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望数据质量人员查看顺序完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供人员履约查看顺序，包含员工、影响原因数、影响异常数、代表原因、代表问题、个人履约入口和暂缓能力。"
  - "数据质量总览页展示人员履约查看顺序卡片。"
  - "没有受影响人员时展示无人员影响，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US527-US529 - 数据质量异常影响原因汇总

```yaml
stories:
  - id: US527
    requirement_ids: [R538, R539]
    task_ids: [F381]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到影响履约异常的数据质量原因汇总，以便优先识别最大问题类型。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US528
    requirement_ids: [R540]
    task_ids: [F381]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望原因汇总展示错误码、字段、来源、影响异常、影响人员、阻断行和代表问题，以便快速进入详情查看。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US529
    requirement_ids: [R541]
    task_ids: [Q099]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望数据质量异常影响原因汇总完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供异常影响原因汇总，包含错误码、字段、来源、影响异常、影响人员、阻断行、代表问题、首要查看入口和暂缓能力。"
  - "数据质量总览页展示异常影响原因汇总卡片。"
  - "没有异常影响原因时展示无异常影响，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US524-US526 - 数据质量详情异常影响拆解

```yaml
stories:
  - id: US524
    requirement_ids: [R534, R535]
    task_ids: [F380]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量详情看到单个质量问题影响了哪些履约异常和人员，以便从问题详情直接判断下一步查看顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US525
    requirement_ids: [R536]
    task_ids: [F380]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望异常影响拆解展示首要异常、影响对象、人员入口和暂缓能力，以便避免误以为可以直接修复或关闭异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US526
    requirement_ids: [R537]
    task_ids: [Q098]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望数据质量详情异常影响拆解完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供单问题异常影响拆解，包含影响异常数、影响人员、首要异常、影响对象、首要查看入口和暂缓能力。"
  - "数据质量详情页展示影响异常拆解卡片。"
  - "没有异常影响时展示无异常影响，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US521-US523 - 数据质量影响异常 Top 聚合

```yaml
stories:
  - id: US521
    requirement_ids: [R530, R531]
    task_ids: [F379]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量总览看到影响异常 Top 问题，以便优先查看影响最多履约异常的数据问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US522
    requirement_ids: [R532]
    task_ids: [F379]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望 Top 聚合展示影响异常数、影响人员、阻断行和查看入口，以便快速定位应先看的质量问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US523
    requirement_ids: [R533]
    task_ids: [Q097]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望数据质量影响异常 Top 聚合完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供影响异常 Top 聚合，包含影响异常数、影响人员、阻断行、首要查看入口和暂缓能力。"
  - "数据质量总览页展示影响异常 Top 卡片。"
  - "没有影响异常时展示无影响异常，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US518-US520 - 周度闭环准备趋势原因拆解

```yaml
stories:
  - id: US518
    requirement_ids: [R526, R527]
    task_ids: [F378]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在闭环准备趋势里看到每天变好或变差的原因，以便判断本周哪些天的闭环准备正在改善或恶化。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US519
    requirement_ids: [R528]
    task_ids: [F378]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望趋势原因能拆分材料、主管判断和数据核对阻塞，以便知道下一步该看哪类证据。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US520
    requirement_ids: [R529]
    task_ids: [Q096]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度闭环趋势原因拆解完成后做收口验证，确认只读展示、页面 smoke 和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "闭环准备趋势模型提供每日原因拆解，包含方向原因、主阻塞、阻塞拆分和下一查看提示。"
  - "小组周视图闭环准备趋势卡片展示原因拆解，不新增路由。"
  - "没有阻塞时展示稳定或暂无待闭环异常，不误导为提交、关闭异常、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US515-US517 - 数据质量影响导入批次反向聚合

```yaml
stories:
  - id: US515
    requirement_ids: [R522, R523]
    task_ids: [F377]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望在数据质量详情看到影响导入批次，以便从质量问题反查相关批次和失败字段。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US516
    requirement_ids: [R524]
    task_ids: [F377]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望影响导入批次展示批次数、失败行、匹配字段、影响对象和批次入口，以便快速定位需要查看的导入批次。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US517
    requirement_ids: [R525]
    task_ids: [Q095]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望质量问题到导入批次反向聚合完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量模型提供影响导入批次聚合，包含批次数、失败行、匹配字段、影响对象、批次入口和查看建议。"
  - "数据质量详情页展示影响导入批次卡片。"
  - "没有匹配批次时展示无影响批次，不误导为修复、提交、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/data-quality.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US512-US514 - 导入批次复核结论预览

```yaml
stories:
  - id: US512
    requirement_ids: [R518, R519]
    task_ids: [F376]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望在导入批次详情看到复核结论预览，以便把修正材料转成可阅读的建议结论。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US513
    requirement_ids: [R520]
    task_ids: [F376]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望复核结论预览展示建议结论、证据摘要、风险提示和下一查看点，以便复核前快速对齐口径。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US514
    requirement_ids: [R521]
    task_ids: [Q094]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望复核结论预览完成后做收口验证，确认只读结论、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "导入批次模型提供复核结论预览，包含建议结论、结论置信度、证据摘要、风险提示、下一查看点和暂缓能力。"
  - "导入批次详情页在修正材料预览后展示复核结论预览。"
  - "没有失败行时展示无复核结论准备，不误导为提交、补证据、关闭异常、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/import-batch-history.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US509-US511 - 导入批次修正材料预览

```yaml
stories:
  - id: US509
    requirement_ids: [R514, R515]
    task_ids: [F375]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望在导入批次详情看到修正材料预览，以便把字段、失败行和质量问题整理成复核前材料包。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US510
    requirement_ids: [R516]
    task_ids: [F375]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望修正材料预览展示材料摘要、字段材料、失败行样本、相关质量问题和暂缓能力，以便快速准备沟通材料。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US511
    requirement_ids: [R517]
    task_ids: [Q093]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望修正材料预览完成后做收口验证，确认只读材料、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "导入批次模型提供修正材料预览，包含材料摘要、字段材料、失败行样本、相关质量问题、建议沟通口径和暂缓能力。"
  - "导入批次详情页在修正准备摘要后展示修正材料预览。"
  - "没有失败行时展示无材料准备，不误导为处理、修复、提交、补证据、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/import-batch-history.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US506-US508 - 导入批次修正准备摘要

```yaml
stories:
  - id: US506
    requirement_ids: [R510, R511]
    task_ids: [F374]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望在导入批次详情看到修正准备摘要，以便把失败原因和质量影响转成查看优先级。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US507
    requirement_ids: [R512]
    task_ids: [F374]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望修正准备摘要展示首要字段、需确认对象、风险提示和建议查看顺序，以便准备复核材料。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US508
    requirement_ids: [R513]
    task_ids: [Q092]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望修正准备摘要完成后做收口验证，确认只读摘要、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "导入批次模型提供修正准备摘要，包含准备等级、首要字段、需确认对象、风险提示、建议查看顺序和只读边界提示。"
  - "导入批次详情页在质量影响聚合后展示修正准备摘要。"
  - "没有失败行时展示无修正准备，不误导为处理、修复、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/import-batch-history.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US503-US505 - 导入失败原因质量影响聚合

```yaml
stories:
  - id: US503
    requirement_ids: [R506, R507]
    task_ids: [F373]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望在导入批次详情看到失败原因关联的数据质量影响，以便知道哪些质量问题需要优先查看。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US504
    requirement_ids: [R508]
    task_ids: [F373]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望质量影响聚合能展示字段覆盖、影响对象和查看顺序，以便把失败原因转成质量问题定位路径。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US505
    requirement_ids: [R509]
    task_ids: [Q091]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望质量影响聚合完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "导入批次模型提供质量影响聚合，包含关联质量问题数、未关联失败原因数、字段覆盖、影响对象、首要质量问题和查看顺序。"
  - "导入批次详情页在失败原因汇总后展示质量影响聚合，并保留相关质量问题详情入口。"
  - "没有关联质量问题时展示无关联质量影响，不误导为处理、修复、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/import-batch-history.test.mjs`、页面 smoke 和 `bash scripts/check.sh` 通过。"
```

### US500-US502 - 导入失败原因汇总

```yaml
stories:
  - id: US500
    requirement_ids: [R502, R503]
    task_ids: [F372]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望在导入批次详情顶部看到失败原因汇总，以便先判断主要失败字段和错误码。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US501
    requirement_ids: [R504]
    task_ids: [F372]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望失败原因汇总能给出影响对象和修正提示，以便知道先修哪些字段。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US502
    requirement_ids: [R505]
    task_ids: [Q090]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望失败原因汇总完成后做收口验证，确认只读聚合、页面展示和 no-action 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "导入批次模型提供失败原因汇总，包含失败原因数、失败行数、首要原因、字段、错误码、代表行、影响对象和修正提示。"
  - "导入批次详情页在失败行明细前展示失败原因汇总。"
  - "没有失败行时展示无失败原因，不误导为处理、修复、审批、导出或批量能力。"
  - "本组不新增后端接口、依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`node --test scripts/tests/import-batch-history.test.mjs`、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US497-US499 - 导入批次列表接入本地结果

```yaml
stories:
  - id: US497
    requirement_ids: [R498, R499]
    task_ids: [B013]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望导入批次列表能看到当前服务进程内刚上传的 CSV 批次，以便不用只靠详情链接追踪导入结果。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US498
    requirement_ids: [R500]
    task_ids: [F371]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望导入批次列表优先展示本地接口返回的导入批次，并在接口不可用时保留现有样例列表，以便本地演示链路稳定。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US499
    requirement_ids: [R501]
    task_ids: [Q089]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望导入批次列表接入本地结果后做收口验证，确认只读列表、fallback 和 no-database 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "GET /api/v1/import-batches 返回当前进程内 CSV 导入批次列表，按 uploaded_at 倒序。"
  - "导入批次页优先展示接口返回的批次，并保留现有 fallback 样例列表。"
  - "接口不可用时导入批次页仍能展示 fallback 样例列表。"
  - "本组不新增依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`python -m unittest discover -s backend/tests -v`、`node --test scripts/tests/import-batch-history.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US494-US496 - 状态日志 CSV 本地导入纵切

```yaml
stories:
  - id: US494
    requirement_ids: [R494, R495]
    task_ids: [B012]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望上传状态日志 CSV 并看到解析批次、成功行和失败行，以便把状态明细纳入本地履约闭环。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US495
    requirement_ids: [R496]
    task_ids: [F370]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望在导入批次页面选择状态日志 CSV 并进入批次结果，以便完成前端到本地后端的导入操作。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US496
    requirement_ids: [R497]
    task_ids: [Q088]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望状态日志 CSV 导入纵切完成后做收口验证，确认本地上传、解析、失败行和 no-database 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "POST /api/v1/import-batches/status-log 接收状态日志 CSV 文本并返回批次结果。"
  - "后端记录成功行、失败行、错误码、失败行号、字段名、原值和错误信息。"
  - "导入批次页面提供状态日志 CSV 上传入口，提交后进入批次详情。"
  - "本组不新增依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析、生产状态字典、自动排班或生产公式。"
  - "`python -m unittest discover -s backend/tests -v`、`node --test scripts/tests/import-batch-history.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US491-US493 - 登录日志 CSV 本地导入纵切

```yaml
stories:
  - id: US491
    requirement_ids: [R490, R491]
    task_ids: [B011]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望上传登录日志 CSV 并看到解析批次、成功行和失败行，以便把实际登录数据纳入真实闭环。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US492
    requirement_ids: [R492]
    task_ids: [F369]
    module: "导入批次"
    role: "现场主管"
    story: "作为现场主管，我希望在导入批次页面选择登录日志 CSV 并进入批次结果，以便完成前端到本地后端的导入操作。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US493
    requirement_ids: [R493]
    task_ids: [Q087]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望登录日志 CSV 导入纵切完成后做收口验证，确认本地上传、解析、失败行和 no-database 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "POST /api/v1/import-batches/login-log 接收登录日志 CSV 文本并返回批次结果。"
  - "后端记录成功行、失败行、错误码、失败行号、字段名、原值和错误信息。"
  - "导入批次页面提供登录日志 CSV 上传入口，提交后进入批次详情。"
  - "本组不新增依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析或生产公式。"
  - "`python -m unittest discover -s backend/tests -v`、`node --test scripts/tests/import-batch-history.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US488-US490 - 人员级排班 CSV 本地导入纵切

```yaml
stories:
  - id: US488
    requirement_ids: [R486, R487]
    task_ids: [B010]
    module: "导入批次"
    role: "排班运营"
    story: "作为排班运营，我希望上传人员级排班 CSV 并看到解析批次、成功行和失败行，以便把人员排班导入纳入真实闭环。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US489
    requirement_ids: [R488]
    task_ids: [F368]
    module: "导入批次"
    role: "排班运营"
    story: "作为排班运营，我希望在导入批次页面选择人员级排班 CSV 并进入批次结果，以便完成前端到本地后端的导入操作。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US490
    requirement_ids: [R489]
    task_ids: [Q086]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望人员级排班 CSV 导入纵切完成后做收口验证，确认本地上传、解析、失败行和 no-database 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "POST /api/v1/import-batches/personnel-schedule 接收人员级排班 CSV 文本并返回批次结果。"
  - "后端记录成功行、失败行、错误码、失败行号、字段名、原值和错误信息。"
  - "导入批次页面提供人员级排班 CSV 上传入口，提交后进入批次详情。"
  - "本组不新增依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析或生产公式。"
  - "`python -m unittest discover -s backend/tests -v`、`node --test scripts/tests/import-batch-history.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US485-US487 - 需求预测 CSV 本地导入纵切

```yaml
stories:
  - id: US485
    requirement_ids: [R482, R483]
    task_ids: [B009]
    module: "导入批次"
    role: "数据管理员"
    story: "作为数据管理员，我希望上传需求预测 CSV 并看到解析批次、成功行和失败行，以便开始真实导入闭环的第一步。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US486
    requirement_ids: [R484]
    task_ids: [F367]
    module: "导入批次"
    role: "数据管理员"
    story: "作为数据管理员，我希望在导入批次页面选择 CSV 文件并进入批次结果，以便完成前端到本地后端的导入操作。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US487
    requirement_ids: [R485]
    task_ids: [Q085]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望需求预测 CSV 导入纵切完成后做收口验证，确认本地上传、解析、失败行和 no-database 边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "POST /api/v1/import-batches/demand-forecast 接收需求预测 CSV 文本并返回批次结果。"
  - "后端记录成功行、失败行、错误码、失败行号、字段名、原值和错误信息。"
  - "导入批次页面提供需求预测 CSV 上传入口，提交后进入批次详情。"
  - "本组不新增依赖、数据库、ORM、migration、真实外部接口、权限、审批、导出、批量、Excel xlsx 解析或生产公式。"
  - "`python -m unittest discover -s backend/tests -v`、`node --test scripts/tests/import-batch-history.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US482-US484 - 周度查看边界核查

```yaml
stories:
  - id: US482
    requirement_ids: [R478, R479]
    task_ids: [F365]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到周度查看边界核查，以便区分当前看板依据和仍需另行确认的生产能力。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US483
    requirement_ids: [R480]
    task_ids: [F366]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度查看边界核查只表达查看和解释口径，以便不误导为复核写入、补充证据、审批发布、报表权限、外部接入或生产数据留存能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US484
    requirement_ids: [R481]
    task_ids: [Q084]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度查看边界核查批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组周视图展示周度查看边界核查。"
  - "汇总展示覆盖看板数、边界事项数、开放风险、升级压力、首要边界、关联看板和边界原因。"
  - "页面只提供查看和解释入口，不出现复核写入、补充证据、审批发布、报表权限、外部接入或生产数据留存能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US479-US481 - 周度闭环收口摘要

```yaml
stories:
  - id: US479
    requirement_ids: [R474, R475]
    task_ids: [F363]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到周度闭环收口摘要，以便识别哪些天、证据缺口和判断风险仍阻塞异常闭环。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US480
    requirement_ids: [R476]
    task_ids: [F364]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度闭环收口摘要只表达查看和解释口径，以便不误导为真实关闭异常、提交、保存、审批、导出或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US481
    requirement_ids: [R477]
    task_ids: [Q083]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度闭环收口摘要批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组周视图展示周度闭环收口摘要。"
  - "汇总展示可推进日、未就绪日、待补材料、待主管判断、开放风险、关键收口项和下钻建议。"
  - "页面只提供查看和解释入口，不出现真实关闭异常、提交、保存、审批、导出、批量或状态写入能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US476-US478 - 周度复核对比摘要

```yaml
stories:
  - id: US476
    requirement_ids: [R470, R471]
    task_ids: [F361]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到周度复核对比摘要，以便把来源、责任、质量和闭环准备放在同一视角判断。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US477
    requirement_ids: [R472]
    task_ids: [F362]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度复核对比摘要只表达查看和解释口径，以便不误导为真实修复、提交、保存、审批、导出或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US478
    requirement_ids: [R473]
    task_ids: [Q082]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度复核对比摘要批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组周视图展示周度复核对比摘要。"
  - "汇总展示对比维度、升级压力、未就绪日、开放风险、关键对比项、影响说明和下钻建议。"
  - "页面只提供查看和解释入口，不出现真实修复、提交、保存、审批、导出、批量或状态写入能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US473-US475 - 周度来源压力汇总

```yaml
stories:
  - id: US473
    requirement_ids: [R466, R467]
    task_ids: [F359]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到周度来源压力，以便识别本周哪些异常轨道来源正在形成最多升级和闭环阻塞。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US474
    requirement_ids: [R468]
    task_ids: [F360]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度来源压力只表达查看和解释口径，以便不误导为真实修复、提交、保存、审批、导出或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US475
    requirement_ids: [R469]
    task_ids: [Q081]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度来源压力批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组周视图展示周度来源压力。"
  - "汇总展示来源轨道、异常数、高优数、升级数、阻塞证据数、影响人员、影响日期、影响时长和下钻建议。"
  - "页面只提供查看和解释入口，不出现真实修复、提交、保存、审批、导出、批量或状态写入能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US470-US472 - 周度责任压力汇总

```yaml
stories:
  - id: US470
    requirement_ids: [R462, R463]
    task_ids: [F357]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到周度责任压力，以便识别本周哪些负责角色承接最多异常和升级压力。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US471
    requirement_ids: [R464]
    task_ids: [F358]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度责任压力只表达查看和解释口径，以便不误导为真实派单、提交、保存、审批、导出或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US472
    requirement_ids: [R465]
    task_ids: [Q080]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度责任压力批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组周视图展示周度责任压力。"
  - "汇总展示负责角色、异常数、高优数、升级数、阻塞证据数、影响人员、影响日期、影响时长和下钻建议。"
  - "页面只提供查看和解释入口，不出现真实派单、提交、保存、审批、导出、批量或状态写入能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US467-US469 - 周度质量影响汇总

```yaml
stories:
  - id: US467
    requirement_ids: [R458, R459]
    task_ids: [F355]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到周度质量影响汇总，以便先识别本周哪些数据质量问题正在影响异常复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US468
    requirement_ids: [R460]
    task_ids: [F356]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度质量影响汇总只表达查看和解释口径，以便不误导为真实修复、提交、保存、审批、导出或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US469
    requirement_ids: [R461]
    task_ids: [Q079]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度质量影响汇总批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组周视图展示周度质量影响汇总。"
  - "汇总展示影响异常数、影响人员、影响日期、影响时长、严重度、阻塞证据、下钻路径和业务原因。"
  - "页面只提供查看和解释入口，不出现真实修复、提交、保存、审批、导出、批量、派单或状态写入能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US464-US466 - 数据质量影响排序细化

```yaml
stories:
  - id: US464
    requirement_ids: [R454, R455]
    task_ids: [F353]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组当日异常面板看到数据质量影响排序，以便先处理对异常闭环影响最大的质量问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US465
    requirement_ids: [R456]
    task_ids: [F354]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望数据质量影响排序只表达查看和解释口径，以便不误导为真实修复、提交、保存、审批、导出或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US466
    requirement_ids: [R457]
    task_ids: [Q078]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望数据质量影响排序批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板展示数据质量影响排序。"
  - "排序展示影响分、严重度、阻塞证据、影响人员、影响异常数、业务原因和建议查看路径。"
  - "页面只提供查看和解释入口，不出现真实修复、提交、保存、审批、导出、批量、派单或状态写入能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US461-US463 - 主管闭环复核摘要

```yaml
stories:
  - id: US461
    requirement_ids: [R450, R451]
    task_ids: [F351]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组当日异常面板看到闭环复核摘要，以便快速判断当前异常是否可闭环或还需复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US462
    requirement_ids: [R452]
    task_ids: [F352]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望闭环复核摘要只表达查看和解释口径，以便不误导为真实提交、保存、关闭异常、审批或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US463
    requirement_ids: [R453]
    task_ids: [Q077]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望闭环复核摘要批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板展示闭环复核摘要。"
  - "摘要展示可闭环、待复核、阻塞数量、首个复核对象、建议结论、证据摘要、风险摘要和下一步。"
  - "页面只提供查看和解释入口，不出现真实提交、保存、关闭异常、审批、导出、批量、派单或状态写入能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US458-US460 - 周度决策摘要

```yaml
stories:
  - id: US458
    requirement_ids: [R446, R447]
    task_ids: [F349]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到周度决策摘要，以便在进入复核队列前先理解本周建议优先判断什么。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US459
    requirement_ids: [R448]
    task_ids: [F350]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度决策摘要只表达查看和解释口径，以便不误导为真实提交、保存、审批或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US460
    requirement_ids: [R449]
    task_ids: [Q076]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度决策摘要批次做收口，确认模型、页面顺序、浏览器 smoke、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组周视图展示周度决策摘要。"
  - "摘要展示建议判断、信心、证据摘要、开放风险、下一查看点和来源依据。"
  - "页面只提供查看和解释入口，不出现真实提交、保存、审批、导出、批量、派单或状态写入能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US454-US457 - 闭环风险解释

```yaml
stories:
  - id: US454
    requirement_ids: [R442, R443]
    task_ids: [F346]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组当日异常面板看到闭环风险解释，以便快速理解当前异常为什么还不能闭环。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US455
    requirement_ids: [R443]
    task_ids: [F347]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望闭环风险解释展示不能闭环原因、业务影响、待补证据、负责角色和下一查看步骤，以便判断先补哪类材料。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US456
    requirement_ids: [R444]
    task_ids: [F348]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望闭环风险解释只表达查看和解释口径，以便不误导为真实提交、保存、审批或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US457
    requirement_ids: [R445]
    task_ids: [Q075]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望闭环风险解释批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板展示闭环风险解释。"
  - "解释展示不能闭环原因、业务影响、待补证据、负责角色、下一查看步骤和风险项。"
  - "解释不提供通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US450-US453 - 主管决策摘要

```yaml
stories:
  - id: US450
    requirement_ids: [R438, R439]
    task_ids: [F343]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组当日异常面板看到主管决策摘要，以便快速读懂当前异常可形成哪些判断口径。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US451
    requirement_ids: [R439]
    task_ids: [F344]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望决策摘要展示建议判断、可信度、证据引用、开放风险和下一复核点，以便稳定组织复核讨论。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US452
    requirement_ids: [R440]
    task_ids: [F345]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望主管决策摘要只表达查看和建议口径，以便不误导为真实提交、保存、审批或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US453
    requirement_ids: [R441]
    task_ids: [Q074]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管决策摘要批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板展示主管决策摘要。"
  - "摘要展示建议判断、可信度、证据引用、开放风险、下一复核点和摘要项。"
  - "摘要不提供通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US446-US449 - 处理准备叙事

```yaml
stories:
  - id: US446
    requirement_ids: [R434, R435]
    task_ids: [F340]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组当日异常面板看到处理准备叙事，以便快速读懂当前异常闭环前还缺什么。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US447
    requirement_ids: [R435]
    task_ids: [F341]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望处理准备叙事展示主线说明、前置条件、阻塞原因、证据状态和下一查看点，以便稳定组织线下复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US448
    requirement_ids: [R436]
    task_ids: [F342]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望处理准备叙事只表达查看和准备口径，以便不误导为真实提交、保存、派单、审批或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US449
    requirement_ids: [R437]
    task_ids: [Q073]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望处理准备叙事批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板展示处理准备叙事。"
  - "叙事展示主线说明、前置条件、阻塞原因、证据状态、影响范围和下一查看点。"
  - "叙事不提供通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US442-US445 - 主管优先级总览

```yaml
stories:
  - id: US442
    requirement_ids: [R430, R431]
    task_ids: [F337]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组当日异常面板看到主管优先级总览，以便快速判断当前先看哪类异常和哪位员工。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US443
    requirement_ids: [R431]
    task_ids: [F338]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望优先级总览展示首要查看对象、优先原因、影响时长、阻塞压力、升级压力和查看顺序，以便稳定安排当天复核节奏。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US444
    requirement_ids: [R432]
    task_ids: [F339]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望主管优先级总览只表达查看和排序建议，以便不误导为真实派单、处理、审批或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US445
    requirement_ids: [R433]
    task_ids: [Q072]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管优先级总览批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板展示主管优先级总览。"
  - "总览展示首要查看对象、优先原因、影响时长、闭环阻塞、升级压力、影响范围和查看顺序。"
  - "总览不提供通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US438-US441 - 异常影响范围优先级汇总

```yaml
stories:
  - id: US438
    requirement_ids: [R426, R427]
    task_ids: [F334]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组当日异常面板看到异常影响范围优先级，以便先查看影响对象和对比口径更大的异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US439
    requirement_ids: [R427]
    task_ids: [F335]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望影响范围优先级展示影响对象、影响对比、影响时长、闭环阻塞和代表异常，以便判断优先核对顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US440
    requirement_ids: [R428]
    task_ids: [F336]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望影响范围优先级只表达查看和排序口径，以便不误导为真实派单、处理、审批或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US441
    requirement_ids: [R429]
    task_ids: [Q071]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望影响范围优先级批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板展示异常影响范围优先级。"
  - "优先级展示优先异常、影响对象、影响对比、影响时长、闭环阻塞、排序说明和代表异常。"
  - "优先级不提供通知、派单、提交、保存、审批、导出、批量、自动排班、真实处理或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US434-US437 - 数据质量到履约异常反向聚合

```yaml
stories:
  - id: US434
    requirement_ids: [R422, R423]
    task_ids: [F331]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组当日异常面板看到数据质量问题影响了哪些异常，以便先处理影响面最大的质量问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US435
    requirement_ids: [R423]
    task_ids: [F332]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望质量影响聚合展示异常数、影响人员、影响时长、代表异常和质量详情入口，以便快速判断核对顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US436
    requirement_ids: [R424]
    task_ids: [F333]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望质量影响聚合只表达查看和定位口径，以便不误导为真实修复、写入、派单或批量处理能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US437
    requirement_ids: [R425]
    task_ids: [Q070]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望质量影响聚合批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板展示质量影响异常聚合。"
  - "聚合展示主要质量问题、异常数、影响人员、影响时长、代表异常、原因和质量详情入口。"
  - "聚合不提供通知、派单、提交、保存、审批、导出、批量、自动排班、真实修复或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US430-US433 - 复核结论预览

```yaml
stories:
  - id: US430
    requirement_ids: [R418, R419]
    task_ids: [F328]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在选中异常后看到复核结论预览，以便在提交任何处理前先读懂建议结论、证据和风险。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US431
    requirement_ids: [R419]
    task_ids: [F329]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望结论预览包含证据摘要、开放风险、可信度和下一回看点，以便判断是否具备闭环条件。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US432
    requirement_ids: [R420]
    task_ids: [F330]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望复核结论预览只表达查看和建议口径，以便不误导为真实结论提交、保存、审批或状态写入。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US433
    requirement_ids: [R421]
    task_ids: [Q069]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望复核结论预览批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板在选中异常后展示复核结论预览。"
  - "预览展示建议结论、证据摘要、开放风险、可信度、来源引用和下一回看点。"
  - "预览不提供通知、派单、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US426-US429 - 周度闭环准备趋势

```yaml
stories:
  - id: US426
    requirement_ids: [R414, R415]
    task_ids: [F325]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到周度闭环准备趋势，以便判断本周哪些天的闭环准备度正在变好或变差。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US427
    requirement_ids: [R415]
    task_ids: [F326]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望趋势说明包含主要阻塞原因和下一优先回看日期，以便从周视角进入对应小组日期继续查看。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US428
    requirement_ids: [R416]
    task_ids: [F327]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度闭环准备趋势只表达查看和判断口径，以便不误导为提交、保存、审批、派单或状态写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US429
    requirement_ids: [R417]
    task_ids: [Q068]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度闭环准备趋势批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "团队下钻后的小组周视图展示周度闭环准备趋势。"
  - "趋势展示每日可闭环项、阻塞项、趋势方向、主要阻塞原因和下一优先回看日期。"
  - "下钻进入对应小组日期矩阵并保留日期上下文。"
  - "页面不出现通知、派单、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US422-US425 - 团队级证据缺口分布

```yaml
stories:
  - id: US422
    requirement_ids: [R410, R411]
    task_ids: [F322]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到团队级证据缺口分布，以便判断本周闭环证据主要缺在哪类材料或判断。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US423
    requirement_ids: [R411]
    task_ids: [F323]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望证据缺口分布展示代表人员和建议下钻项，以便快速回到小组日期矩阵补看证据来源。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US424
    requirement_ids: [R412]
    task_ids: [F324]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望团队级证据缺口分布只表达查看和定位，以便不误导为线上通知、派单、审批或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US425
    requirement_ids: [R413]
    task_ids: [Q067]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望团队级证据缺口分布批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "团队下钻后的小组周视图展示证据缺口分布。"
  - "分布展示证据缺口项数、涉及人员数、主要缺口类型、负责角色、代表人员和建议下钻项。"
  - "下钻进入对应小组日期矩阵并保留异常上下文。"
  - "页面不出现通知、派单、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US418-US421 - 周度主管交接摘要

```yaml
stories:
  - id: US418
    requirement_ids: [R406, R407]
    task_ids: [F319]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到本周交接摘要，以便知道本周哪些异常需要交接给哪个角色。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US419
    requirement_ids: [R407]
    task_ids: [F320]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望交接摘要展示开放问题、升级项、下一触点和下钻入口，以便快速回到小组日期矩阵查看证据。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US420
    requirement_ids: [R408]
    task_ids: [F321]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望周度交接摘要只表达查看和交接准备，以便不误导为线上通知、派单、审批或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US421
    requirement_ids: [R409]
    task_ids: [Q066]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望周度主管交接摘要批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "团队下钻后的小组周视图展示本周交接摘要。"
  - "摘要展示交接项、开放问题、升级项、主要交接对象、下一触点和异常下钻入口。"
  - "下钻进入对应小组日期矩阵并保留选中异常上下文。"
  - "页面不出现通知、派单、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US414-US417 - 闭环证据下钻解释

```yaml
stories:
  - id: US414
    requirement_ids: [R402, R403]
    task_ids: [F316]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在闭环准备度里看到阻塞项对应的证据解释，以便知道每个未闭环原因具体缺什么。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US415
    requirement_ids: [R403]
    task_ids: [F317]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望证据项能进入已有个人单日三轨详情，以便回看排班、登录和状态证据。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US416
    requirement_ids: [R404]
    task_ids: [F318]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望证据下钻解释只用于查看和定位，以便不误导为线上处理、审批或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US417
    requirement_ids: [R405]
    task_ids: [Q065]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望闭环证据下钻解释批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组当日异常面板的闭环准备度展示阻塞项下的证据项。"
  - "证据项展示人员、负责角色、当前状态、已有证据来源和下一查看位置。"
  - "证据项可进入现有个人单日三轨详情，并保留团队、小组、日期和异常上下文。"
  - "页面不出现通知、派单、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US410-US413 - 主管本周复核队列

```yaml
stories:
  - id: US410
    requirement_ids: [R398, R399]
    task_ids: [F313]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组周视图看到本周复核队列，以便先处理风险最高的小组日期组合。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US411
    requirement_ids: [R399]
    task_ids: [F314]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望本周复核队列展示最高优先级项、建议先看对象和复核原因，以便从团队视角快速下钻。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US412
    requirement_ids: [R400]
    task_ids: [F315]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望本周复核队列只表达查看顺序和下钻线索，以便不误导为线上派单、通知或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US413
    requirement_ids: [R401]
    task_ids: [Q064]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管本周复核队列批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "团队下钻后的小组周视图展示本周复核队列。"
  - "队列展示摘要、最高优先级项、小组、日期、优先级、缺口人数、异常人数、建议先看对象和复核原因。"
  - "队列项可下钻到对应小组日期矩阵，但不出现通知、派单、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US402-US405 - 本周延续关注

```yaml
stories:
  - id: US402
    requirement_ids: [R390]
    task_ids: [F307]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵看到本周延续关注，以便判断当天未闭环风险在本周后续日期是否还会延续。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US403
    requirement_ids: [R391]
    task_ids: [F308]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望本周延续关注包含后续日期、缺口人数、异常人数、延续原因、建议回看对象和查看顺序，以便安排本周后续查看优先级。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US404
    requirement_ids: [R392]
    task_ids: [F309]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望本周延续关注只表达查看和排序口径，以便不误导为已经具备线上流转或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US405
    requirement_ids: [R393]
    task_ids: [Q062]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望本周延续关注批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵右侧展示本周延续关注。"
  - "延续关注展示后续日期、缺口人数、异常人数、延续原因、建议回看对象和查看顺序。"
  - "页面不出现通知、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US398-US401 - 小组风险原因拆分

```yaml
stories:
  - id: US398
    requirement_ids: [R386]
    task_ids: [F304]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵看到当天风险原因拆分，以便判断风险主要来自登录到岗、状态安排还是数据核对。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US399
    requirement_ids: [R387]
    task_ids: [F305]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望风险原因拆分包含原因名称、异常项数、涉及人数、影响时长、占比、代表异常和主管关注点，以便快速判断优先复核方向。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US400
    requirement_ids: [R388]
    task_ids: [F306]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望小组风险原因拆分只表达查看和判断口径，以便不误导为已经具备线上流转或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US401
    requirement_ids: [R389]
    task_ids: [Q061]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望小组风险原因拆分批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵右侧展示风险原因拆分。"
  - "原因拆分展示原因名称、异常项数、涉及人数、影响时长、占比、代表异常和主管关注点。"
  - "页面不出现通知、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US394-US397 - 次日关注清单

```yaml
stories:
  - id: US394
    requirement_ids: [R382]
    task_ids: [F301]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在选中异常后看到次日关注清单，以便把今日未闭环异常转成明天优先查看对象。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US395
    requirement_ids: [R383]
    task_ids: [F302]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望次日关注清单包含日期、员工、优先级、责任角色、来源异常、关注原因和查看顺序，以便快速安排次日复核。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US396
    requirement_ids: [R384]
    task_ids: [F303]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望次日关注清单只表达查看顺序，以便不误导为已经具备线上流转或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US397
    requirement_ids: [R385]
    task_ids: [Q060]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望次日关注清单批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "选中异常后展示次日关注清单。"
  - "清单展示次日日期、关注说明、员工、优先级、责任角色、来源异常、关注原因和查看顺序。"
  - "清单不出现通知、提交、保存、审批、导出、批量、自动排班或写入动作。"
  - "`node --test scripts/tests/person-timeline.test.mjs`、文案审计、浏览器 smoke 和 `bash scripts/check.sh` 通过。"
```

### US390-US393 - 异常责任人负载对比

```yaml
stories:
  - id: US390
    requirement_ids: [R378]
    task_ids: [F298]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在选中异常后看到责任人负载对比，以便判断当前异常是否应由当前角色优先处理。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US391
    requirement_ids: [R379]
    task_ids: [F299]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望模型返回选中异常责任人、该责任人负载、最高负载责任人、负载差异和建议处理顺序，以便安排当天查看顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US392
    requirement_ids: [R380]
    task_ids: [F300]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望责任人负载对比只表达查看和排序口径，以便不误导为已经具备线上流转或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US393
    requirement_ids: [R381]
    task_ids: [Q059]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望异常责任人负载对比批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "选中异常后展示责任人负载对比。"
  - "模型返回选中责任人、最高负载责任人、负载差异和建议处理顺序。"
  - "页面不出现通知、提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US386-US389 - 团队周风险分布

```yaml
stories:
  - id: US386
    requirement_ids: [R374]
    task_ids: [F295]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在团队周视图看到本周风险分布，以便先判断哪一天和哪个团队最需要下钻。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US387
    requirement_ids: [R375]
    task_ids: [F296]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望模型返回风险最高日、风险分布、主要风险原因、建议下钻日期和团队周排名，以便快速决定处理顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US388
    requirement_ids: [R376]
    task_ids: [F297]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望团队周风险分布只表达查看和排序口径，以便不误导为已经具备线上流转或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US389
    requirement_ids: [R377]
    task_ids: [Q058]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望团队周风险分布批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "团队周视图展示团队周风险分布。"
  - "模型返回风险最高日、风险分布点、主要风险原因、建议下钻日期和团队周排名。"
  - "页面不出现通知、提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US382-US385 - 主管异常对比

```yaml
stories:
  - id: US382
    requirement_ids: [R370]
    task_ids: [F292]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在异常详情中看到当前异常和队列中相邻异常的对比，以便判断为什么先处理当前异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US383
    requirement_ids: [R371]
    task_ids: [F293]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望模型返回异常排名、优先原因、对比异常、主要差异和下一关注说明，以便复核队列排序是否合理。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US384
    requirement_ids: [R372]
    task_ids: [F294]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望异常对比只表达查看和排序口径，以便不误导为已经具备线上流转或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US385
    requirement_ids: [R373]
    task_ids: [Q057]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管异常对比批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常详情展示主管异常对比。"
  - "模型返回当前异常排名、优先原因、对比异常、主要差异和下一关注说明。"
  - "页面不出现通知、提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US378-US381 - 团队日风险趋势

```yaml
stories:
  - id: US378
    requirement_ids: [R366]
    task_ids: [F289]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵中看到团队日风险趋势，以便判断当前小组近几天风险是否正在变糟。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US379
    requirement_ids: [R367]
    task_ids: [F290]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望模型返回趋势方向、最高风险日、当前日对比和趋势点，以便定位哪天风险最高、今天相比前一日变化多少。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US380
    requirement_ids: [R368]
    task_ids: [F291]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望风险趋势只表达查看和排序口径，以便不误导为已经具备线上流转或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US381
    requirement_ids: [R369]
    task_ids: [Q056]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望团队日风险趋势批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵展示团队日风险趋势。"
  - "模型返回趋势方向、最高风险日、当前日对比、趋势点和下一关注点。"
  - "页面不出现通知、提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US374-US377 - 主管跟进时间线

```yaml
stories:
  - id: US374
    requirement_ids: [R362]
    task_ids: [F286]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在异常详情中看到跟进时间线，以便知道这条异常已经跟进到哪里、当前卡点是什么。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US375
    requirement_ids: [R363]
    task_ids: [F287]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列模型返回识别、已跟进、当前卡点和下一复核节点，以便按时间顺序复盘异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US376
    requirement_ids: [R364]
    task_ids: [F288]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望跟进时间线只表达查看口径，以便不误导为已经具备线上流转或写入能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US377
    requirement_ids: [R365]
    task_ids: [Q055]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管跟进时间线批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常详情展示主管跟进时间线。"
  - "模型返回识别、已跟进、当前卡点和下一复核节点。"
  - "页面不出现通知、提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US370-US373 - 主管异常沟通上下文

```yaml
stories:
  - id: US370
    requirement_ids: [R358]
    task_ids: [F283]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在异常详情中看到沟通上下文，以便知道该和谁确认、先说什么、引用哪些证据。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US371
    requirement_ids: [R359]
    task_ids: [F284]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列模型返回沟通对象、沟通目的、关键说明、证据和待确认问题，以便减少重复追问。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US372
    requirement_ids: [R360]
    task_ids: [F285]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望沟通上下文只表达查看口径，以便不误导为已经具备线上通知、处理或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US373
    requirement_ids: [R361]
    task_ids: [Q054]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管异常沟通上下文批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常详情展示沟通上下文。"
  - "模型返回沟通对象、沟通目的、关键说明、引用证据、待确认问题和下一沟通点。"
  - "页面不出现通知、提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US366-US369 - 团队日风险摘要

```yaml
stories:
  - id: US366
    requirement_ids: [R354]
    task_ids: [F280]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵看到当日风险摘要，以便快速判断今天是否需要优先查看异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US367
    requirement_ids: [R355]
    task_ids: [F281]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组矩阵模型汇总风险等级、主要风险、下一优先查看和风险信号，以便先看最影响履约的问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US368
    requirement_ids: [R356]
    task_ids: [F282]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望当日风险摘要只表达查看和排序口径，以便不误导为已经具备线上处理或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US369
    requirement_ids: [R357]
    task_ids: [Q053]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望团队日风险摘要批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵展示当日风险摘要。"
  - "模型返回风险等级、主要风险、下一优先查看和风险信号。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US362-US365 - 主管交接概览

```yaml
stories:
  - id: US362
    requirement_ids: [R350]
    task_ids: [F277]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵看到交接概览，以便快速判断当天哪些异常需要交给谁继续跟进。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US363
    requirement_ids: [R351]
    task_ids: [F278]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组矩阵模型按交接对象聚合异常、待核对问题和下一触点，以便安排交接重点。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US364
    requirement_ids: [R352]
    task_ids: [F279]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望交接概览只表达查看和提醒口径，以便不误导为已经具备线上处理或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US365
    requirement_ids: [R353]
    task_ids: [Q052]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管交接概览批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵展示主管交接概览。"
  - "模型返回待交接项、待核对问题、建议升级、主要接收人、下一优先交接和接收人分布。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US358-US361 - 异常来源聚合

```yaml
stories:
  - id: US358
    requirement_ids: [R346]
    task_ids: [F274]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵看到异常来源聚合，以便判断当天主要问题来自排班、登录还是状态。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US359
    requirement_ids: [R347]
    task_ids: [F275]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组矩阵模型返回主要来源、来源分布和来源风险，以便先核对最关键的数据或业务源。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US360
    requirement_ids: [R348]
    task_ids: [F276]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望异常来源聚合只表达查看和排序口径，以便不误导为已经具备处理提交或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US361
    requirement_ids: [R349]
    task_ids: [Q051]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望异常来源聚合批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵展示异常来源聚合。"
  - "模型返回主要来源、来源分布、影响时长、高优先、超时关注和建议升级数量。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US354-US357 - 主管日工作量汇总

```yaml
stories:
  - id: US354
    requirement_ids: [R342]
    task_ids: [F271]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵看到当天工作量汇总，以便先判断待关注异常和超时压力。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US355
    requirement_ids: [R343]
    task_ids: [F272]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组矩阵模型返回角色负载和下一优先查看项，以便安排先看哪类问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US356
    requirement_ids: [R344]
    task_ids: [F273]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望主管日工作量只表达查看和排序口径，以便不误导为已经具备处理提交或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US357
    requirement_ids: [R345]
    task_ids: [Q050]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管日工作量汇总批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵展示主管日工作量汇总。"
  - "模型返回待关注项、建议升级项、超时关注项、最高负载角色、角色负载和下一优先查看项。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US350-US353 - 异常超时与优先级升级

```yaml
stories:
  - id: US350
    requirement_ids: [R338]
    task_ids: [F268]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列展示等待时长和超时等级，以便优先处理已经拖久的履约问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US351
    requirement_ids: [R339]
    task_ids: [F269]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列模型返回升级提示和下一复核窗口，以便判断是否需要拉高关注角色。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US352
    requirement_ids: [R340]
    task_ids: [F270]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望异常超时与升级只表达查看和排序口径，以便不误导为已经具备处理提交或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US353
    requirement_ids: [R341]
    task_ids: [Q049]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望异常超时与优先级升级批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常队列当前项展示识别时间、等待时长、超时等级、升级原因和下一复核窗口。"
  - "异常队列摘要展示超时关注项和建议升级项数量。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US346-US349 - 异常证据关联数据质量

```yaml
stories:
  - id: US346
    requirement_ids: [R334]
    task_ids: [F265]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常证据能关联到已有数据质量问题，以便判断异常是否需要先做数据核对。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US347
    requirement_ids: [R335]
    task_ids: [F266]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列模型返回数据质量问题、匹配记录、核对字段和关联原因，以便在同一口径下解释数据风险。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US348
    requirement_ids: [R336]
    task_ids: [F267]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望异常到数据质量的关联只作为查看链路，以便不误导为已经具备数据修复或处理动作。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US349
    requirement_ids: [R337]
    task_ids: [Q048]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望异常证据关联数据质量批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常队列当前项展示关联数据质量问题。"
  - "异常队列模型返回关联问题、匹配记录、核对字段、关联原因和详情链接。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US342-US345 - 小组复核负载汇总

```yaml
stories:
  - id: US342
    requirement_ids: [R330]
    task_ids: [F262]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵看到复核负载汇总，以便先判断当天问题主要压在哪类处理口径上。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US343
    requirement_ids: [R331]
    task_ids: [F263]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组矩阵模型返回最高负载分组、待主管判断数量和下一优先处理建议，以便不只看单个异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US344
    requirement_ids: [R332]
    task_ids: [F264]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望复核负载汇总只表达查看和排序口径，以便不误导为已经具备处理提交或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US345
    requirement_ids: [R333]
    task_ids: [Q047]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望小组复核负载汇总批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵展示复核负载汇总。"
  - "小组矩阵模型返回总待复核、处理分组负载、最高负载分组和下一优先处理建议。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US338-US341 - 个人详情复核口径同步

```yaml
stories:
  - id: US338
    requirement_ids: [R326]
    task_ids: [F259]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望从异常队列进入个人单日三轨详情时仍能看到处理分组、复核清单和当前判断，以便下钻后不丢失处理语境。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US339
    requirement_ids: [R327]
    task_ids: [F260]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望个人日视图模型提供与异常队列一致的复核上下文，以便列表和个人详情使用同一口径。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US340
    requirement_ids: [R328]
    task_ids: [F261]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望个人详情复核口径只作为查看信息，以便不误导为已经具备处理提交或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US341
    requirement_ids: [R329]
    task_ids: [Q046]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望个人详情复核口径同步批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "个人单日三轨详情在带异常上下文时展示处理分组、复核清单和当前判断。"
  - "个人日视图模型返回与异常队列一致的复核上下文。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US334-US337 - 主管异常队列分组

```yaml
stories:
  - id: US334
    requirement_ids: [R322]
    task_ids: [F256]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列按需补材料、待主管判断和需数据核对分组，以便先处理最需要现场补充的信息。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US335
    requirement_ids: [R323]
    task_ids: [F257]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列模型返回每个异常的处理分组和分组数量，以便判断当天处理负载。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US336
    requirement_ids: [R324]
    task_ids: [F258]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望处理分组只作为筛选和查看能力，以便不误导为已经具备处理提交或审批能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US337
    requirement_ids: [R325]
    task_ids: [Q045]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管异常队列分组批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵异常侧栏展示主管处理分组筛选。"
  - "异常队列模型返回每个异常的处理分组，摘要返回需补材料、待主管判断、需数据核对数量。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US330-US333 - 主管异常复核清单

```yaml
stories:
  - id: US330
    requirement_ids: [R318]
    task_ids: [F253]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员单日矩阵异常侧栏展示复核清单，以便知道当前还差哪些材料。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US331
    requirement_ids: [R319]
    task_ids: [F254]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列模型返回每个复核项的状态、责任角色和判断影响，以便统一异常复核口径。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US332
    requirement_ids: [R320]
    task_ids: [F255]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望复核清单只作为业务查看信息，以便不误导为已经具备提交、审批或持久化能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US333
    requirement_ids: [R321]
    task_ids: [Q044]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管异常复核清单批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵异常侧栏展示复核清单。"
  - "异常队列模型返回清单项、状态、责任角色、判断影响和当前判断。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US326-US329 - 主管异常处理结论建议

```yaml
stories:
  - id: US326
    requirement_ids: [R314]
    task_ids: [F250]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员单日矩阵异常侧栏展示处理结论建议，以便根据证据快速判断下一步跟进。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US327
    requirement_ids: [R315]
    task_ids: [F251]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列模型给出建议结论、需核材料、沟通对象、负责角色和下一复核点，以便统一现场处理口径。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US328
    requirement_ids: [R316]
    task_ids: [F252]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望处理结论建议只作为业务查看信息，以便不误导为已经具备提交、审批或持久化能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US329
    requirement_ids: [R317]
    task_ids: [Q043]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管异常处理结论建议批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵异常侧栏展示处理结论建议。"
  - "异常队列模型返回建议结论、需核材料、沟通对象、负责角色、下一复核点和未闭环风险。"
  - "页面不出现提交、保存、审批、导出、批量或状态写入入口。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US322-US325 - 个人三轨排班来源反查

```yaml
stories:
  - id: US322
    requirement_ids: [R310]
    task_ids: [F247]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望个人单日三轨详情展示排班草稿来源，以便从个人履约问题反查排班计划和人员排班明细。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US323
    requirement_ids: [R311]
    task_ids: [F248]
    module: "履约日历"
    role: "排班运营"
    story: "作为排班运营，我希望个人排班来源展示班次窗口、技能、排班明细编号和计划入口，以便核对该人员当日排班依据。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US324
    requirement_ids: [R312]
    task_ids: [F249]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望个人排班来源展示相关 0.5h 时段的汇总人数、明细人数和差异，以便定位需核对时段。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US325
    requirement_ids: [R313]
    task_ids: [Q042]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望个人三轨排班来源反查批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "个人单日三轨详情页展示排班草稿来源卡。"
  - "来源卡展示计划入口、草稿入口、班次窗口、技能、排班明细编号和需核对时段。"
  - "需核对时段展示汇总人数、明细人数和差异。"
  - "产品 UI 不新增内部执行词、审批、导出、批量或处理提交入口。"
  - "`node --test scripts/tests/personnel-schedule-details.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US318-US321 - 排班草稿履约日历下钻

```yaml
stories:
  - id: US318
    requirement_ids: [R306]
    task_ids: [F244]
    module: "排班计划"
    role: "排班运营"
    story: "作为排班运营，我希望在排班草稿联动核对中点击关联人员进入个人单日三轨详情，以便从排班明细继续核对登录和状态。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US319
    requirement_ids: [R307]
    task_ids: [F245]
    module: "排班计划"
    role: "现场主管"
    story: "作为现场主管，我希望人员排班时段追溯模型带有稳定的履约日历链接，以便所有使用该模型的页面都能进入同一解释页。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US320
    requirement_ids: [R308]
    task_ids: [F246]
    module: "排班计划"
    role: "PM"
    story: "作为 PM，我希望排班草稿下钻入口保持业务语言，以便页面不暴露内部执行或项目管理口径。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US321
    requirement_ids: [R309]
    task_ids: [Q041]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望排班草稿履约日历下钻批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "人员排班时段追溯模型为每个关联人员提供 `timelineHref`。"
  - "排班草稿编辑页中关联人员可点击进入对应个人单日三轨详情，并保留日期、团队和小组上下文。"
  - "产品 UI 不新增内部执行词、审批、导出、批量或处理提交入口。"
  - "`node --test scripts/tests/personnel-schedule-details.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US314-US317 - 排班草稿人员明细联动

```yaml
stories:
  - id: US314
    requirement_ids: [R302]
    task_ids: [F241]
    module: "排班计划"
    role: "排班运营"
    story: "作为排班运营，我希望在排班草稿中看到每个 0.5h 时段关联的人员明细，以便确认汇总人数背后有可追溯人员。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US315
    requirement_ids: [R303]
    task_ids: [F242]
    module: "排班计划"
    role: "排班运营"
    story: "作为排班运营，我希望草稿能标出 0.5h 汇总人数和人员明细人数差异，以便优先核对不一致时段。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US316
    requirement_ids: [R304]
    task_ids: [F243]
    module: "排班计划"
    role: "现场主管"
    story: "作为现场主管，我希望在草稿页看到关联人员数和需核对时段数，以便快速判断排班明细是否支撑当天履约。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US317
    requirement_ids: [R305]
    task_ids: [Q040]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望排班草稿人员明细联动批次做收口，确认模型、页面、文案和边界均可验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "排班草稿编辑页展示人员级排班联动区域，按 0.5h 时段展示汇总人数、明细人数、差异和关联人员。"
  - "联动模型能根据计划时段和人员展开结果计算需核对时段数。"
  - "产品 UI 不出现 PRD、Gate、任务编号、内部执行状态、数据接入状态、审批、导出或批量处理入口。"
  - "`node --test scripts/tests/personnel-schedule-details.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```


### US310-US313 - 产品语义清理

```yaml
stories:
  - id: US310
    requirement_ids: [R298]
    task_ids: [F238]
    module: "业务界面收口"
    role: "业务用户"
    story: "作为业务用户，我希望产品页面不出现本地 MVP、任务编号、后续扩展或只读处理记录等内部过程词，以便界面只表达业务能力。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US311
    requirement_ids: [R299]
    task_ids: [F239]
    module: "业务界面收口"
    role: "业务用户"
    story: "作为业务用户，我希望侧边栏和页面指标不出现 P0/P1、新、示例等项目管理或样例口径，以便入口可信。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US312
    requirement_ids: [R300]
    task_ids: [F240]
    module: "排班计划"
    role: "排班运营"
    story: "作为排班运营，我希望排班草稿新建和编辑页面使用业务语言说明可做什么，而不是解释当前没做什么。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US313
    requirement_ids: [R301]
    task_ids: [Q039]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望产品语义清理完成后验证 UI 不暴露内部过程词或假功能解释。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "产品 UI 不出现本地 MVP、任务编号、后续扩展、只读处理记录、P0/P1、新、示例异常等过程词。"
  - "排班草稿页面用业务语言说明草稿维护能力。"
  - "侧边栏仅展示业务入口和业务状态标签。"
  - "`node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US306-US309 - 主管跟进汇总只读视图

```yaml
stories:
  - id: US306
    requirement_ids: [R294]
    task_ids: [F235]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示主管跟进状态，以便知道谁在跟、当前卡在哪里、下一次什么时候核对。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US307
    requirement_ids: [R295]
    task_ids: [F236]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示跟进缺口清单，以便知道还缺哪些说明、记录和复核结论。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US308
    requirement_ids: [R296]
    task_ids: [F237]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示小组跟进汇总，以便判断同组待跟进规模和当前项位置。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US309
    requirement_ids: [R297]
    task_ids: [Q038]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管跟进汇总只读视图完成后验证跟进状态、缺口清单、小组汇总和业务文案。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常当前项展示跟进人、跟进状态、下一核对时间和当前重点。"
  - "跟进缺口清单展示缺少的说明、记录和复核结论。"
  - "小组跟进汇总展示队列位置、同组待跟进数量和高优先数量。"
  - "页面不出现处理提交、审批、批量、数据库或真实写回能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US302-US305 - 数据质量修复前置只读视图

```yaml
stories:
  - id: US302
    requirement_ids: [R290]
    task_ids: [F232]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示数据质量修复前置判断，以便知道是否需要数据管理员介入。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US303
    requirement_ids: [R291]
    task_ids: [F233]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示修复准备材料，以便交接前知道需要哪些记录、字段和说明。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US304
    requirement_ids: [R292]
    task_ids: [F234]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示影响范围摘要，以便判断这个数据问题影响个人、班次还是后续对比。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US305
    requirement_ids: [R293]
    task_ids: [Q037]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望数据质量修复前置只读视图完成后验证判断、准备材料、影响范围和业务文案。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常当前项展示是否需要数据管理员介入、介入原因和修复优先级。"
  - "修复准备材料展示记录、字段和说明材料。"
  - "影响范围摘要展示影响对象、影响链路和排除边界。"
  - "页面不出现修复提交、审批、批量、数据库或真实写回能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US298-US301 - 主管异常交接只读闭环

```yaml
stories:
  - id: US298
    requirement_ids: [R286]
    task_ids: [F229]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示处理结果归类，以便判断问题属于到岗、状态还是数据核对。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US299
    requirement_ids: [R287]
    task_ids: [F230]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示交接摘要，以便把问题交给合适角色继续核对。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US300
    requirement_ids: [R288]
    task_ids: [F231]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示数据核对前置提示，以便知道要看哪些记录和字段。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US301
    requirement_ids: [R289]
    task_ids: [Q036]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管异常交接只读闭环完成后验证归类、交接、数据核对提示和业务文案。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常当前项展示处理结果归类、归类原因、负责角色和复核重点。"
  - "交接摘要展示交接对象、摘要、待核对问题和下一次触点。"
  - "数据核对提示展示相关记录和字段，不出现审批、提交、批量、真实修复或写回能力。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US257-US292 - 连续大模块业务迭代池

```yaml
stories:
  - {id: US257, requirement_ids: [R245], task_ids: [F196], module: "业务界面收口", role: "运营负责人", story: "作为运营负责人，我希望经营总览只展示履约、供需、异常和质量风险业务指标，以便首页不混入内部执行信息。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US258, requirement_ids: [R246], task_ids: [F197], module: "业务界面收口", role: "业务用户", story: "作为业务用户，我希望侧边栏只保留真实业务入口，以便不看到内部执行、验收、准备或 Gate 类入口。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US259, requirement_ids: [R247], task_ids: [F198], module: "业务界面收口", role: "PM", story: "作为 PM，我希望产品 UI 全量审计内部过程词，以便避免再次把项目管理内容做成业务页面。", task_type: "qa", priority: "P0", status: "done"}
  - {id: US260, requirement_ids: [R248], task_ids: [F199], module: "业务界面收口", role: "运营负责人", story: "作为运营负责人，我希望经营总览指标能下钻到履约日历、异常中心和数据质量，以便从汇总进入业务处理链路。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US261, requirement_ids: [R249], task_ids: [F200], module: "业务界面收口", role: "运营负责人", story: "作为运营负责人，我希望经营总览展示今日和本周履约风险摘要，以便快速判断当前风险。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US262, requirement_ids: [R250], task_ids: [Q029], module: "质量与交付", role: "QA", story: "作为 QA，我希望业务界面收口批次完成后验证页面、导航和文案都只保留业务语言。", task_type: "qa", priority: "P1", status: "done"}
  - {id: US263, requirement_ids: [R251], task_ids: [F201], module: "履约日历", role: "现场主管", story: "作为现场主管，我希望小组周视图展示风险摘要侧栏，以便判断哪组、哪天、哪人风险最高。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US264, requirement_ids: [R252], task_ids: [F202], module: "履约日历", role: "现场主管", story: "作为现场主管，我希望小组成员周矩阵展示本周待看清单，以便按缺口和异常连续处理。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US265, requirement_ids: [R253], task_ids: [F203], module: "履约日历", role: "现场主管", story: "作为现场主管，我希望异常队列展示三轨证据卡，以便直接看到命中的排班、登录、状态事件。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US266, requirement_ids: [R254], task_ids: [F204], module: "履约日历", role: "现场主管", story: "作为现场主管，我希望异常队列展示排序依据，以便理解为什么当前异常优先处理。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US267, requirement_ids: [R255], task_ids: [F205], module: "履约日历", role: "现场主管", story: "作为现场主管，我希望个人单日详情保留异常队列返回上下文，以便看完个人证据后回到原队列位置。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US268, requirement_ids: [R256], task_ids: [Q030], module: "质量与交付", role: "QA", story: "作为 QA，我希望履约日历主管处理链路批次完成后验证下钻、队列、定位和业务文案。", task_type: "qa", priority: "P1", status: "done"}
  - {id: US269, requirement_ids: [R257], task_ids: [F206], module: "排班计划", role: "排班运营", story: "作为排班运营，我希望排班计划详情展示人员级排班明细，以便从计划看到具体员工。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US270, requirement_ids: [R258], task_ids: [F207], module: "排班计划", role: "排班运营", story: "作为排班运营，我希望人员排班明细展示员工、供应商、职场、项目、技能、班次和异常标记，以便判断问题来源。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US271, requirement_ids: [R259], task_ids: [F208], module: "排班计划", role: "排班运营", story: "作为排班运营，我希望 0.5h 时段汇总能追溯到人员列表，以便从汇总定位具体人。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US272, requirement_ids: [R260], task_ids: [F209], module: "排班计划", role: "排班运营", story: "作为排班运营，我希望人员排班明细能跳到员工当天履约时间轴，以便继续查看登录和状态。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US273, requirement_ids: [R261], task_ids: [F210], module: "排班计划", role: "排班运营", story: "作为排班运营，我希望排班缺口展示涉及的具体人员和班次，以便判断补班方向。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US274, requirement_ids: [R262], task_ids: [Q031], module: "质量与交付", role: "QA", story: "作为 QA，我希望人员级排班与 0.5h 汇总追溯批次完成后验证明细、汇总和下钻链路。", task_type: "qa", priority: "P1", status: "done"}
  - {id: US275, requirement_ids: [R263], task_ids: [F211], module: "需求预测", role: "排班运营", story: "作为排班运营，我希望需求预测按职场、项目、时段、技能组和等级展示，以便判断需求结构。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US276, requirement_ids: [R264], task_ids: [F212], module: "需求预测", role: "排班运营", story: "作为排班运营，我希望预测 vs 排班对比展示缺口和超排，以便优先复核供需异常。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US277, requirement_ids: [R265], task_ids: [F213], module: "需求预测", role: "排班运营", story: "作为排班运营，我希望预测 vs 排班对比展示无匹配技能组异常，以便定位技能供给问题。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US278, requirement_ids: [R266], task_ids: [F214], module: "需求预测", role: "排班运营", story: "作为排班运营，我希望供需对比能下钻到排班人员明细，以便从缺口追到具体人员。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US279, requirement_ids: [R267], task_ids: [F215], module: "需求预测", role: "排班运营", story: "作为排班运营，我希望预测版本和排班版本在对齐视图中展示，以便知道对比依据。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US280, requirement_ids: [R268], task_ids: [Q032], module: "质量与交付", role: "QA", story: "作为 QA，我希望预测排班对齐批次完成后验证供需指标、版本说明和下钻链路。", task_type: "qa", priority: "P1", status: "done"}
  - {id: US281, requirement_ids: [R269], task_ids: [F216], module: "数据质量", role: "数据管理员", story: "作为数据管理员，我希望导入批次详情能跳转到相关数据质量问题，以便追溯失败原因。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US282, requirement_ids: [R270], task_ids: [F217], module: "数据质量", role: "数据管理员", story: "作为数据管理员，我希望数据质量详情展示来源模板、字段、原值、错误码和影响对象，以便判断修复优先级。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US283, requirement_ids: [R271], task_ids: [F218], module: "数据质量", role: "数据管理员", story: "作为数据管理员，我希望数据质量问题按业务原因分组，以便先处理影响核心对比的问题。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US284, requirement_ids: [R272], task_ids: [F219], module: "数据质量", role: "数据管理员", story: "作为数据管理员，我希望质量问题展示影响的排班、预测、登录或状态链路，以便看懂业务后果。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US285, requirement_ids: [R273], task_ids: [F220], module: "数据质量", role: "数据管理员", story: "作为数据管理员，我希望导入批次展示失败行的业务影响摘要，以便判断是否影响当天履约。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US286, requirement_ids: [R274], task_ids: [Q033], module: "质量与交付", role: "QA", story: "作为 QA，我希望导入批次与数据质量追溯批次完成后验证批次、失败行、质量问题和影响对象链路。", task_type: "qa", priority: "P1", status: "done"}
  - {id: US287, requirement_ids: [R275], task_ids: [F221], module: "主数据", role: "数据管理员", story: "作为数据管理员，我希望主数据关系页按员工展示供应商、职场、项目和技能绑定，以便定位人员归属。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US288, requirement_ids: [R276], task_ids: [F222], module: "主数据", role: "现场主管", story: "作为现场主管，我希望能从异常员工反查主数据绑定关系，以便判断异常是否来自绑定缺失。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US289, requirement_ids: [R277], task_ids: [F223], module: "主数据", role: "排班运营", story: "作为排班运营，我希望班次类型展示休息、饭点和计入口径，以便理解班次如何影响排班人数。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US290, requirement_ids: [R278], task_ids: [F224], module: "主数据", role: "数据管理员", story: "作为数据管理员，我希望主数据缺失异常能跳转到对应关系视图，以便快速定位缺失字段。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US291, requirement_ids: [R279], task_ids: [F225], module: "主数据", role: "数据管理员", story: "作为数据管理员，我希望主数据关系展示有效期和状态，以便判断绑定是否仍有效。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US292, requirement_ids: [R280], task_ids: [Q034], module: "质量与交付", role: "QA", story: "作为 QA，我希望主数据关系闭环批次完成后验证绑定、异常反查、有效期和业务文案。", task_type: "qa", priority: "P1", status: "done"}
acceptance:
  - "36 个故事只作为后续规划池，不写入 current/active。"
  - "每个业务批次执行前再选择 3-5 个故事进入 current/active。"
  - "所有故事保持本地前端或本地模型边界，不实现数据库、真实接口、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
```

### US294-US297 - 主管异常处理只读闭环

```yaml
stories:
  - id: US294
    requirement_ids: [R282]
    task_ids: [F226]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示处理建议分层，以便知道优先核对什么、补什么信息、找谁沟通。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US295
    requirement_ids: [R283]
    task_ids: [F227]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示三轨证据汇总，以便快速判断问题来自排班、登录还是状态。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US296
    requirement_ids: [R284]
    task_ids: [F228]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望当前异常展示只读处理记录，以便知道样例里已经记录了哪些跟进过程。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US297
    requirement_ids: [R285]
    task_ids: [Q035]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望主管异常处理只读闭环完成后验证建议、证据、记录和 no-submit 边界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "处理建议只做只读展示，不出现提交、审批、批量或真实写入能力。"
  - "三轨证据汇总能说明排班、登录、状态分别命中的事件。"
  - "只读处理记录展示记录人、时间、结论和后续关注点。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US293 - 大模块迭代池状态修复

```yaml
stories:
  - id: US293
    requirement_ids: [R281]
    task_ids: [H031]
    module: "Harness"
    role: "PM"
    story: "作为 PM，我希望开始连续大模块迭代前先修复旧批次状态漂移并登记规划池，以便后续 Story Runner 不误执行旧任务。"
    task_type: "harness"
    priority: "P0"
    status: "done"
acceptance:
  - "US137-US146 和 F085-F093/Q020 的状态与 PROJECT_CONTEXT 完成记录一致。"
  - "36 个后续故事登记为 planned，不进入 current/active。"
  - "TRACE_INDEX 只登记 ID、路径和关系，不写生命周期状态。"
```

### US254-US256 - 小组异常队列处理光标

```yaml
stories:
  - id: US254
    requirement_ids: [R242]
    task_ids: [F193]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常面板显示当前异常在队列中的处理进度，以便知道还剩多少项需要核对。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US255
    requirement_ids: [R243]
    task_ids: [F194]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望能在当前筛选的异常队列中上一项和下一项切换，以便逐项处理当天问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US256
    requirement_ids: [R244]
    task_ids: [F195]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望筛选结果为空时看到业务空态，以便确认当前口径下没有待关注异常。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
acceptance:
  - "异常队列光标能返回当前选中项、当前位置、总数、上一项和下一项。"
  - "小组成员单日矩阵右侧面板展示处理进度。"
  - "上一项/下一项切换保留当前团队、小组、日期和筛选口径。"
  - "筛选结果为空时显示业务空态，不出现内部过程词。"
  - "不做审批、处理提交、权限、数据库、真实接口、导出、批量、自动排班或生产公式。"
  - "不新增页面路由、不新增左侧入口。"
```

### US251-US253 - 小组异常矩阵定位

```yaml
stories:
  - id: US251
    requirement_ids: [R239]
    task_ids: [F190]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望选中异常后矩阵能高亮对应成员行，以便立即定位到具体人员。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US252
    requirement_ids: [R240]
    task_ids: [F191]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望选中异常后相关排班、登录、状态轨道切片被高亮，以便直接看到证据来源。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US253
    requirement_ids: [R241]
    task_ids: [F192]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望矩阵定位能跟随异常队列筛选和选中项变化，以便连续查看不同异常。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
acceptance:
  - "异常队列项暴露可定位的轨道事件 ID。"
  - "小组成员单日矩阵高亮当前选中异常对应成员行。"
  - "小组成员单日矩阵高亮当前选中异常涉及的轨道切片。"
  - "切换异常队列筛选或异常项后，高亮位置同步变化。"
  - "不做审批、处理提交、权限、数据库、真实接口、导出、批量、自动排班或生产公式。"
  - "不新增页面路由、不新增左侧入口，产品 UI 不出现内部过程词。"
```

### US248-US250 - 小组异常队列汇总与筛选

```yaml
stories:
  - id: US248
    requirement_ids: [R236]
    task_ids: [F187]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组异常队列先显示异常构成汇总，以便判断当天问题主要来自哪里。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US249
    requirement_ids: [R237]
    task_ids: [F188]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望能按高优先级、登录缺口、状态不一致筛选异常队列，以便快速聚焦。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US250
    requirement_ids: [R238]
    task_ids: [F189]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望筛选后当前异常解释自动跟随筛选结果，并继续能进入个人详情。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵模型暴露异常队列汇总。"
  - "右侧面板显示异常总数、高优先级数、登录缺口数、状态不一致数和总影响时长。"
  - "右侧面板支持全部、高优先级、登录缺口、状态不一致显示筛选。"
  - "筛选后队列和当前异常解释同步变化，并保留个人详情入口。"
  - "不做审批、处理提交、权限、数据库、真实接口、导出、批量、自动排班或生产公式。"
  - "不新增页面路由、不新增左侧入口，产品 UI 不出现内部过程词。"
```

### US245-US247 - 小组异常优先队列

```yaml
stories:
  - id: US245
    requirement_ids: [R233]
    task_ids: [F184]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员单日矩阵右侧能汇总当天全部异常，以便先扫描需要关注的人和时段。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US246
    requirement_ids: [R234]
    task_ids: [F185]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望异常队列按优先级和影响时长排序，以便先处理风险更高的履约问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US247
    requirement_ids: [R235]
    task_ids: [F186]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望点击异常队列项能切换当前异常解释，并继续下钻到个人详情。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵模型暴露当天全部异常队列。"
  - "异常队列按优先级、影响时长和员工号稳定排序。"
  - "右侧面板显示待关注异常队列，选中项高亮，并同步当前异常解释。"
  - "队列和详情均保留进入个人单日详情的入口。"
  - "不做审批、处理提交、权限、数据库、真实接口、导出、批量、自动排班或生产公式。"
  - "不新增页面路由、不新增左侧入口，产品 UI 不出现内部过程词。"
```

### US242-US244 - 小组异常解释侧栏

```yaml
stories:
  - id: US242
    requirement_ids: [R230]
    task_ids: [F181]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员单日矩阵能直接提供成员异常解释，以便在小组视角先判断异常证据。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US243
    requirement_ids: [R231]
    task_ids: [F182]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员单日矩阵右侧展示选中异常解释，以便不用离开小组页面也能判断处理顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US244
    requirement_ids: [R232]
    task_ids: [F183]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望点击小组矩阵里的异常标记能更新侧栏，并保留进入个人单日详情的入口。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵模型暴露每个成员当天异常解释。"
  - "小组成员单日矩阵展示异常解释侧栏，包含时间段、异常类型、涉及轨道、影响时长、证据说明、建议主管动作和优先级。"
  - "异常标记能选中侧栏解释，并提供进入个人单日详情的入口。"
  - "不做审批、处理提交、权限、数据库、真实接口、导出、批量、自动排班或生产公式。"
  - "不新增页面路由、不新增左侧入口，产品 UI 不出现内部过程词。"
```

### US239-US241 - 履约异常解释卡

```yaml
stories:
  - id: US239
    requirement_ids: [R227]
    task_ids: [F178]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望个人单日详情能列出当天异常解释，以便知道每个异常落在哪个人、哪天、哪个时段和哪条轨道。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US240
    requirement_ids: [R228]
    task_ids: [F179]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望个人单日三轨下方展示异常解释卡，以便用证据说明和建议动作快速判断现场处理顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US241
    requirement_ids: [R229]
    task_ids: [F180]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望从小组成员单日矩阵点击异常后进入个人详情并看到对应日期异常解释，以便从小组扫描自然下钻到个人判断。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
acceptance:
  - "个人单日详情暴露异常解释列表，每条包含异常类型、时间段、涉及轨道、影响时长、证据说明、建议主管动作和优先级。"
  - "异常解释卡展示在个人单日三轨时间轴下方，不新增页面路由或左侧入口。"
  - "小组成员单日矩阵异常标记进入个人单日详情后，个人页显示对应日期异常解释。"
  - "不做审批、处理提交、权限、数据库、真实接口、导出、批量、自动排班或生产公式。"
  - "产品 UI 不出现 PRD、Gate、Story、验收清单、待实现、暂不实现等内部过程词。"
```

### US236-US238 - 履约日历风险摘要和视图焦点

```yaml
stories:
  - id: US236
    requirement_ids: [R224]
    task_ids: [F175]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员周矩阵有风险摘要，以便先知道本组最需要处理的成员和日期。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US237
    requirement_ids: [R225]
    task_ids: [F176]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员周矩阵可以在全部、缺口、异常视角之间切换，以便按当前处理目标扫描。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US238
    requirement_ids: [R226]
    task_ids: [F177]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望缺口或异常视角能强化对应风险单元格，以便一眼定位重点日期。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员周矩阵展示风险成员数、最高缺口成员、最高异常成员和最高缺口日期。"
  - "小组成员周矩阵支持全部、看缺口、看异常三个视图焦点。"
  - "缺口视角强化缺口单元格，异常视角强化异常单元格。"
  - "不新增左侧入口、不新增页面路由、不新增依赖、不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US233-US235 - 履约日历小组成员周矩阵收口

```yaml
stories:
  - id: US233
    requirement_ids: [R221]
    task_ids: [F172]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望个人周日历能按来源返回小组成员周矩阵或单日矩阵，以便下钻后能回到正确上下文。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US234
    requirement_ids: [R222]
    task_ids: [F173]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员周矩阵的日期表头能进入该小组当天单日矩阵，以便从周视角快速切到某天全组明细。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US235
    requirement_ids: [R223]
    task_ids: [F174]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望小组成员周矩阵展示小组级业务摘要并按风险排序，以便优先处理缺口和异常更高的成员。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
acceptance:
  - "个人周日历从小组成员周矩阵进入时，返回到 `/person-timeline?team=...&group=...`。"
  - "个人周日历从小组成员单日矩阵进入时，返回到 `/person-timeline?team=...&group=...&date=...`。"
  - "小组成员周矩阵表头日期可进入该小组当天单日矩阵。"
  - "小组成员周矩阵展示成员数、计划人天、登录人天、缺口工时和异常数。"
  - "不新增左侧入口、不新增依赖、不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US232 - 履约日历小组成员周矩阵

```yaml
id: US232
requirement_ids:
  - R220
task_ids:
  - F171
module: "履约日历"
role: "现场主管"
story: "作为现场主管，我希望从小组周视图进入小组成员周矩阵，按成员和日期查看一周排班、登录、缺口和异常，以便先判断小组内哪几个人哪几天有问题。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "`/person-timeline?team=...&group=...` 展示小组成员周矩阵。"
  - "`/person-timeline?team=...&group=...&date=...` 继续展示小组成员单日矩阵。"
  - "小组成员周矩阵按员工为行、周一到周日为列，每格展示排班、登录、缺口和异常。"
  - "点击员工姓名进入个人周日历，点击某天格子进入个人单日三轨详情。"
  - "不新增左侧入口、不新增依赖、不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "F170"
status: "done"
```

### US231 - 履约日历个人周日历层

```yaml
id: US231
requirement_ids:
  - R219
task_ids:
  - F170
module: "履约日历"
role: "现场主管"
story: "作为现场主管，我希望从小组成员矩阵先进入某员工的个人周日历，再选择某一天查看三轨详情，以便先判断这个人的一周履约分布，再定位具体日期异常。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "小组成员矩阵点击员工姓名进入个人周日历，不直接跳到单日详情。"
  - "个人周日历展示一周七天、每天排班工时、登录工时、异常数和缺口提示。"
  - "个人周日历点击某天进入个人单日三轨详情。"
  - "异常标记仍可从小组矩阵直达个人单日三轨详情。"
  - "不新增左侧入口、不新增依赖、不改后端、数据库、真实接口、权限、审批、导出、批量、自动排班或生产公式。"
  - "`node --test scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "F169"
status: "done"
```

### US229 - 排班计划挂载人员级排班明细

```yaml
id: US229
requirement_ids:
  - R217
task_ids:
  - F168
module: "排班计划"
role: "排班运营"
story: "作为排班运营，我希望在排班计划详情里看到人员级排班明细，并能跳到个人当天时间轴，以便从时段汇总追溯到具体人员。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划详情展示人员级排班明细，包含员工、供应商、职场、班次、开始结束、技能组、等级和异常标记。"
  - "人员明细展示对应的 0.5h 展开时段。"
  - "人员明细提供进入 `/person-timeline/[employeeId]?date=YYYY-MM-DD` 的链接。"
  - "不新增页面，不新增依赖，不改后端、数据库、真实导入、权限、审批、导出、批量、自动排班或生产公式。"
  - "`node --test scripts/tests/personnel-schedule-details.test.mjs` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "F167"
status: "done"
```

### US228 - 全量清理产品 UI 内部口径并重做人员时间轴

```yaml
id: US228
requirement_ids:
  - R216
task_ids:
  - F167
module: "产品体验"
role: "运营负责人"
story: "作为运营负责人，我希望产品页面只展示业务语言，并且人员时间轴按个人日历和某天三条横向轨道查看，以便能直接用于排班履约分析。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "全量产品页面不出现暂不实现动作、待开发动作、本地只读、只读演示、无真实、PRD、验收、Gate、No Database 等内部执行口径。"
  - "不新增页面；只修正已有页面和已有入口。"
  - "人员时间轴列表页呈现员工日历入口。"
  - "人员时间轴详情页呈现某员工某一天的排班、登录、状态三条横向甘特式时间轴。"
  - "`node --test scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/person-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "F166"
status: "done"
```

### US227 - 经营总览移除数据接入状态遗留

```yaml
id: US227
requirement_ids:
  - R215
task_ids:
  - F166
module: "运营工作台"
role: "运营负责人"
story: "作为运营负责人，我希望经营总览和侧边栏只出现业务功能，不再展示数据接入状态、数据版本或 PRD/验收/准备/缺口/治理页面，以便产品界面不混入执行记录。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "`/dashboard` 不 import 或渲染 `DataSyncStatus`。"
  - "`/dashboard` 主页面不出现“数据接入状态”或“数据版本”。"
  - "侧边栏不出现生产雏形、总进度、生产缺口、数据底座准备、预测实际对齐、异常识别准备、治理边界准备或验收清单。"
  - "`app/production-mvp/**` 内部规划页面路由被删除，业务链接改回真实业务页面。"
  - "数据接入组件和专门页面不被删除或改坏。"
  - "`node --test scripts/tests/dashboard-business-only.test.mjs scripts/tests/product-navigation-business-only.test.mjs` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "F145"
status: "done"
```

### US001 - 运营负责人查看 Dashboard 总览

```yaml
id: US001
requirement_ids:
  - R001
  - R002
module: "运营工作台"
role: "运营负责人"
story: "作为运营负责人，我希望在首页查看预测需求、BPO 排班、实际有效工时和异常工时概览，以便快速判断当日履约风险。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "首页展示四个 shadcn Card 风格指标卡。"
  - "业务文案使用中文。"
  - "支持 light/dark theme。"
dependencies:
  - "F001"
status: "done"
```

### US073-US082 - Dashboard 本地 parity 连续增强

```yaml
stories:
  - id: US073
    requirement_ids: [R061]
    story: "作为运营负责人，我希望 dashboard 异常明细表支持本地状态与严重度筛选。"
    status: "done"
  - id: US074
    requirement_ids: [R062]
    story: "作为运营负责人，我希望 dashboard 异常明细表显示筛选摘要并可一键重置。"
    status: "done"
  - id: US075
    requirement_ids: [R063]
    story: "作为运营负责人，我希望 dashboard 异常明细表显示分页范围并支持首页/末页。"
    status: "done"
  - id: US076
    requirement_ids: [R064]
    story: "作为项目执行者，我希望 dashboard 数据接入状态模型有本地测试覆盖。"
    status: "done"
  - id: US077
    requirement_ids: [R065]
    story: "作为运营负责人，我希望 dashboard 数据接入状态使用 TanStack Table 展示。"
    status: "done"
  - id: US078
    requirement_ids: [R066]
    story: "作为运营负责人，我希望 dashboard 数据接入状态支持本地状态筛选和摘要。"
    status: "done"
  - id: US079
    requirement_ids: [R067]
    story: "作为项目执行者，我希望 dashboard 热力图缺口统计有本地测试覆盖。"
    status: "done"
  - id: US080
    requirement_ids: [R068]
    story: "作为运营负责人，我希望 dashboard 热力图显示缺口总览、严重时段和峰值缺口。"
    status: "done"
  - id: US081
    requirement_ids: [R069]
    story: "作为运营负责人，我希望 dashboard 热力图格子有更清晰的可访问标签和聚焦状态。"
    status: "done"
  - id: US082
    requirement_ids: [R070]
    story: "作为 QA，我希望 F032-F040 dashboard 连续开发块完成后有验收收口。"
    status: "done"
acceptance:
  - "只做本地展示层增强，不新增依赖、不改后端契约、不接数据库。"
  - "不启用真实同步、审批、导出、批量、权限或生产公式。"
  - "`bash scripts/check.sh` 通过。"
```

### US002 - 运营查看履约趋势与时段缺口

```yaml
id: US002
requirement_ids:
  - R001
  - R002
module: "履约监控"
role: "运营负责人"
story: "作为运营负责人，我希望查看排班实现率、排班拟合度、排班遵守率趋势和时段缺口热力图，以便识别履约波动。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "趋势图展示排班实现率、排班拟合度、排班遵守率。"
  - "热力图展示按日期和时段聚合的缺口。"
  - "F001 中的 Recharts 仅作为 shadcn chart structure 的静态 prototype 例外。"
dependencies:
  - "US001"
  - "D005"
status: "done"
```

### US003 - 运营复核异常工时列表

```yaml
id: US003
requirement_ids:
  - R001
module: "异常管理"
role: "运营专员"
story: "作为运营专员，我希望查看异常工时列表、严重程度、状态和影响工时，以便进行后续复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "异常表格展示异常编号、类型、项目、团队、时段、人数、影响工时、严重程度和状态。"
  - "支持搜索、状态 badge、分页和行操作。"
  - "不提供真实审批、导出、批量处理或结算确认能力。"
dependencies:
  - "US001"
status: "done"
```

### US004 - 运营查看数据同步状态

```yaml
id: US004
requirement_ids:
  - R001
module: "数据与集成"
role: "运营负责人"
story: "作为运营负责人，我希望查看 CORN 登录数据、CORN 状态日志、BPO 排班数据和预测需求数据的同步状态，以便识别数据接入风险。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "展示数据源、批次、同步状态和同步时间。"
  - "仅展示静态 mock 状态，不接入真实 API。"
dependencies:
  - "US001"
status: "done"
```

### US005 - 用户切换 light/dark 主题

```yaml
id: US005
requirement_ids:
  - R002
module: "前端体验"
role: "平台用户"
story: "作为平台用户，我希望在 light 和 dark theme 之间切换，以便在不同使用环境下保持可读性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "提供 ThemeToggle。"
  - "核心 dashboard 区域在 light/dark theme 下均可读。"
  - "优先使用 shadcn / Tailwind semantic tokens。"
dependencies:
  - "US001"
status: "done"
```

### US006 - PM 确认 MVP 第一条纵切范围

```yaml
id: US006
requirement_ids:
  - R003
module: "MVP 范围"
role: "PM"
story: "作为 PM，我希望先确认第一条前后端纵切范围，以便团队在正式开发前知道第一批只做排班计划列表、详情、FastAPI 只读接口和本地种子数据。"
task_type: "product"
priority: "P0"
acceptance:
  - "第一条纵切明确为排班计划。"
  - "明确本阶段不做新增、编辑、发布、审批、导出、批量操作、认证、数据库或真实集成。"
  - "明确后续实现拆为 B001、F005 和 Q001。"
dependencies:
  - "H007"
status: "done"
```

### US007 - 排班人员查看排班计划列表

```yaml
id: US007
requirement_ids:
  - R003
  - R005
module: "计划与排班"
role: "排班人员"
story: "作为排班人员，我希望查看排班计划列表，以便按日期、项目、职场、版本、状态和缺口风险找到需要处理的计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表展示计划编号、日期、项目、职场、版本、状态、预测人数、已排人数、缺口人数和更新时间。"
  - "列表支持按关键词搜索计划编号、项目或职场。"
  - "状态展示仅使用 draft、review_ready、published 三个 MVP 展示状态。"
dependencies:
  - "US006"
  - "US010"
status: "done"
```

### US008 - 排班人员打开排班计划详情

```yaml
id: US008
requirement_ids:
  - R003
  - R006
module: "计划与排班"
role: "排班人员"
story: "作为排班人员，我希望打开单个排班计划详情，以便查看计划摘要、时段明细、缺口和备注。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "详情展示计划基础信息、版本、状态、覆盖率和缺口汇总。"
  - "详情展示 0.5h 时段级预测人数、已排人数、缺口人数和备注。"
  - "详情仅只读展示，不提供人员级编辑、拖拽、发布或审批操作。"
dependencies:
  - "US007"
  - "US011"
status: "done"
```

### US009 - 运营负责人查看排班覆盖风险

```yaml
id: US009
requirement_ids:
  - R005
  - R006
  - R009
module: "计划与排班"
role: "运营负责人"
story: "作为运营负责人，我希望在计划列表和详情中看到覆盖率、缺口人数和风险标记，以便判断哪天或哪个职场需要优先复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表和详情均展示 forecast_agents、scheduled_agents、gap_agents 和 coverage_rate。"
  - "coverage_rate 在 MVP 中按 scheduled_agents / forecast_agents 展示。"
  - "当 gap_agents 大于 0 时展示风险标记，但不触发真实告警、审批或通知。"
dependencies:
  - "US007"
  - "US008"
status: "done"
```

### US010 - 后端提供排班计划列表接口

```yaml
id: US010
requirement_ids:
  - R007
  - R008
module: "后端服务"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 排班计划列表接口，以便从后端读取本地种子数据并渲染计划列表。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-plans。"
  - "响应包含 items 数组，每项包含 id、plan_date、project_name、site_name、version、status、forecast_agents、scheduled_agents、gap_agents、coverage_rate、updated_at。"
  - "接口从本地种子数据读取，不接数据库、认证或真实外部系统。"
dependencies:
  - "US006"
status: "done"
```

### US011 - 后端提供排班计划详情接口

```yaml
id: US011
requirement_ids:
  - R007
  - R008
module: "后端服务"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 排班计划详情接口，以便读取单个计划的摘要和 0.5h 时段明细。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-plans/{plan_id}。"
  - "响应包含 summary 和 intervals。"
  - "intervals 每项包含 interval_start、interval_end、forecast_agents、scheduled_agents、gap_agents、coverage_rate、note。"
  - "当 plan_id 不存在时返回 404 和 machine-readable error code。"
dependencies:
  - "US010"
status: "done"
```

### US012 - 前端从 FastAPI 读取排班计划数据

```yaml
id: US012
requirement_ids:
  - R007
  - R008
module: "接口契约"
role: "前端应用"
story: "作为前端应用，我希望使用统一 API client 读取排班计划列表和详情，以便后续从静态 mock 过渡到后端数据。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "前端使用集中封装的 API client 调用排班接口。"
  - "接口失败时展示可读错误状态。"
  - "不把 FastAPI URL 和字段映射散落在多个组件里。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US013 - 后端本地种子数据表达预测需求

```yaml
id: US013
requirement_ids:
  - R004
  - R007
module: "博西预测需求"
role: "后端服务"
story: "作为后端服务，我希望用本地种子数据表达预测需求，以便第一条纵切能在不接真实 Excel 的情况下展示计划输入。"
task_type: "backend"
priority: "P0"
acceptance:
  - "种子数据包含日期、项目、职场、0.5h 时段和预测人数。"
  - "种子数据与排班计划详情中的 intervals 可追溯。"
  - "不实现上传、解析 Excel 或外部预测系统接入。"
dependencies:
  - "US006"
status: "done"
```

### US014 - 后端本地种子数据表达排班计划

```yaml
id: US014
requirement_ids:
  - R005
  - R006
  - R007
module: "计划与排班"
role: "后端服务"
story: "作为后端服务，我希望用本地种子数据表达排班计划，以便列表和详情接口能返回稳定、可验收的数据。"
task_type: "backend"
priority: "P0"
acceptance:
  - "种子数据包含至少 3 个排班计划。"
  - "每个计划包含至少 8 个 0.5h 时段明细。"
  - "字段使用 English keys，业务展示值可使用中文。"
dependencies:
  - "US013"
status: "done"
```

### US015 - PM 确认 MVP 状态与公式展示口径

```yaml
id: US015
requirement_ids:
  - R009
module: "业务口径"
role: "PM"
story: "作为 PM，我希望确认第一条纵切中的状态和公式只是 MVP 展示口径，以便不把它误认为生产最终规则。"
task_type: "product"
priority: "P0"
acceptance:
  - "计划状态暂定为 draft、review_ready、published。"
  - "coverage_rate 暂按 scheduled_agents / forecast_agents 展示。"
  - "结算公式、排班拟合度、排班遵守率和生产状态码不在第一条纵切中固化。"
dependencies:
  - "US006"
status: "done"
```

### US016 - QA 验证第一条纵切交付

```yaml
id: US016
requirement_ids:
  - R010
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望验证第一条纵切的前端、后端、接口契约和 Harness check，以便确认它可以作为正式开发基线。"
task_type: "qa"
priority: "P0"
acceptance:
  - "前端 lint、typecheck、build 通过。"
  - "后端测试通过。"
  - "接口返回字段满足 user stories 中的契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US007"
  - "US008"
  - "US010"
  - "US011"
  - "US012"
status: "done"
```

### US017 - 后端创建排班计划草稿

```yaml
id: US017
requirement_ids:
  - R011
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望调用 FastAPI 创建排班计划草稿，以便本地 MVP 可以生成 draft 状态的计划并返回计算后的摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 POST /api/v1/schedule-plans/drafts。"
  - "请求包含 plan_date、project_name、site_name、version 和 intervals。"
  - "服务端计算 forecast_agents、scheduled_agents、gap_agents、coverage_rate 和 updated_at。"
  - "新建计划状态固定为 draft。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US018 - 后端更新排班计划草稿

```yaml
id: US018
requirement_ids:
  - R011
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望更新 draft 状态的排班计划，以便本地 MVP 可以调整 0.5h 时段并重新计算摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 PUT /api/v1/schedule-plans/{plan_id}/draft。"
  - "仅允许更新 status 为 draft 的计划。"
  - "更新后重新计算 forecast_agents、scheduled_agents、gap_agents 和 coverage_rate。"
  - "当计划不存在时返回 404。"
  - "当计划不是 draft 时返回 409 和 machine-readable error code。"
  - "不实现发布、审批、导出、批量操作、权限或数据库持久化。"
dependencies:
  - "US017"
status: "done"
```

### US019 - 前端创建排班计划草稿

```yaml
id: US019
requirement_ids:
  - R012
  - R011
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从排班计划列表进入新建草稿页面并提交草稿，以便快速创建本地 MVP 排班计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划列表提供新建草稿入口。"
  - "新建页面包含日期、项目、职场、版本和核心 0.5h 时段输入。"
  - "提交时通过 Next server action 调用 B002 创建草稿接口。"
  - "创建成功后跳转到新草稿详情。"
  - "不实现完整编辑器、发布、审批、导出、批量操作、权限或数据库持久化。"
dependencies:
  - "US017"
status: "done"
```

### US020 - 前端更新排班计划草稿

```yaml
id: US020
requirement_ids:
  - R013
  - R011
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从 draft 计划详情进入编辑页面并保存草稿，以便调整本地 MVP 排班计划的时段信息。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "draft 计划详情页展示编辑草稿入口。"
  - "非 draft 计划不展示编辑入口。"
  - "编辑页预填计划信息和现有 0.5h 时段。"
  - "提交时通过 Next server action 调用 B002 PUT 草稿更新接口。"
  - "保存成功后跳转回计划详情页。"
  - "不实现发布、审批、导出、批量操作、权限、数据库持久化或人员级排班。"
dependencies:
  - "US018"
  - "US019"
status: "done"
```

### US021 - Codex 按用户故事连续交付

```yaml
id: US021
requirement_ids:
  - R014
module: "Harness 流程"
role: "PM"
story: "作为 PM，我希望 Codex 从 goal 拆出最小用户故事后，能够按依赖顺序自动开发、测试、提交，并在安全时启动 subagent 并行处理，以便项目快速进入连续交付节奏。"
task_type: "docs"
priority: "P0"
acceptance:
  - "AGENTS.md 定义 Story Runner Mode。"
  - "Story Runner Mode 明确用户故事是默认执行单位，UI 细节反馈归入当前 story。"
  - "Story Runner Mode 允许在写入范围不冲突时默认启动 bounded subagents。"
  - "docs/harness/lightweight-harness.md 和 docs/prompts/README.md 同步该规则。"
  - "已完成用户故事状态与 backlog/task-log/audit 状态对齐。"
dependencies:
  - "H009"
status: "done"
```

### US022 - 后端排班计划列表筛选

```yaml
id: US022
requirement_ids:
  - R015
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 排班计划列表支持 status 和 query 查询参数，以便列表页可以按状态和关键词读取计划摘要。"
task_type: "backend"
priority: "P0"
acceptance:
  - "GET /api/v1/schedule-plans 支持 status 查询参数。"
  - "GET /api/v1/schedule-plans 支持 query 查询参数，覆盖编号、日期、项目、职场、版本和状态。"
  - "后端 unittest 覆盖按状态筛选和按关键词筛选。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US023 - 前端排班计划列表筛选

```yaml
id: US023
requirement_ids:
  - R015
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划列表按关键词搜索并切换草稿、待复核、已发布状态，以便快速找到要处理的计划。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "列表页读取 URL query 和 status 参数。"
  - "页面提供关键词搜索框、状态切换和清空筛选。"
  - "筛选后指标卡和表格基于当前结果重新汇总。"
  - "表格保留排序能力并展示空结果状态。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US022"
status: "done"
```

### US024 - 后端班次明细列表

```yaml
id: US024
requirement_ids:
  - R016
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供班次明细列表接口，以便页面可以按 0.5h 时段读取计划、预测、已排、缺口和备注。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/shift-details。"
  - "返回字段包含 plan_id、plan_date、project_name、site_name、version、status、interval_start、interval_end、forecast_agents、scheduled_agents、gap_agents、coverage_rate 和 note。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖明细字段和关键词筛选。"
  - "不接数据库、认证、真实 Excel、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US025 - 前端班次明细页面

```yaml
id: US025
requirement_ids:
  - R016
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开班次明细页面并按关键词或状态筛选，以便定位具体时段缺口。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏班次明细进入真实页面。"
  - "页面展示班次数量、缺口班次、最大缺口和整体覆盖率。"
  - "页面展示 0.5h 明细表并可跳回对应排班计划。"
  - "页面支持关键词、状态和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US024"
status: "done"
```

### US026 - 后端需求计划列表

```yaml
id: US026
requirement_ids:
  - R017
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供预测需求列表接口，以便页面可以读取日期、时段、职场和预测人数。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/demand-plans。"
  - "返回字段包含 demand_id、plan_date、project_name、site_name、interval_start、interval_end、forecast_agents、source 和 status。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖字段契约和关键词筛选。"
  - "不接真实 Excel、数据库、认证、真实 CORN 或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US027 - 前端需求计划页面

```yaml
id: US027
requirement_ids:
  - R017
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开需求计划页面查看预测需求并按关键词搜索，以便快速定位某个日期、职场或时段的需求输入。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏需求计划进入真实页面。"
  - "页面展示需求时段、预测人次、覆盖职场和峰值需求。"
  - "页面展示预测需求表。"
  - "页面支持关键词搜索和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US026"
status: "done"
```

### US028 - 后端不可用记录列表

```yaml
id: US028
requirement_ids:
  - R018
  - R008
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供不可用记录列表接口，以便页面可以读取人员、团队、时段、原因、状态和影响时段。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/unavailability。"
  - "返回字段包含 unavailability_id、staff_name、team_name、project_name、site_name、unavailable_date、start_time、end_time、reason、status、affected_intervals 和 note。"
  - "支持 status 和 query 查询参数。"
  - "后端 unittest 覆盖字段契约、状态筛选和关键词筛选。"
  - "不接数据库、认证、人事系统、真实请假审批或外部系统。"
dependencies:
  - "US010"
  - "US011"
status: "done"
```

### US029 - 前端不可用管理页面

```yaml
id: US029
requirement_ids:
  - R018
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望打开不可用管理页面并按关键词或状态筛选，以便快速识别可能影响排班覆盖的不可用时段。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "侧边栏不可用管理进入真实页面。"
  - "页面展示不可用记录、生效中、影响时段和涉及团队。"
  - "页面展示不可用记录表并可跳转到班次明细。"
  - "页面支持关键词、状态和清空筛选。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US028"
status: "done"
```

### US030 - 后端排班风险提示列表

```yaml
id: US030
requirement_ids:
  - R019
  - R015
  - R018
module: "计划与排班"
role: "前端应用"
story: "作为前端应用，我希望 FastAPI 提供排班风险提示列表，将时段缺口和生效中不可用记录合并为本地风险提示，以便排班计划页展示优先复核项。"
task_type: "backend"
priority: "P0"
acceptance:
  - "提供 GET /api/v1/schedule-risks。"
  - "返回字段包含 risk_id、plan_id、plan_date、project_name、site_name、interval_start、interval_end、risk_level、gap_agents、affected_unavailability、reason 和 recommendation。"
  - "高风险包含同一日期、项目、职场、时段下同时存在缺口和生效中不可用记录的情况。"
  - "支持 query 查询参数。"
  - "后端 unittest 覆盖字段契约、高风险合并和关键词筛选。"
dependencies:
  - "US022"
  - "US028"
status: "done"
```

### US031 - 前端排班风险提示区

```yaml
id: US031
requirement_ids:
  - R019
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划页看到风险提示区，按风险等级查看缺口和不可用影响，并能跳转到班次明细继续处理。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划页展示排班风险提示区。"
  - "风险提示区展示风险等级、日期、时段、项目、职场、缺口、不可用、原因和建议。"
  - "风险提示区高风险数量清晰可见。"
  - "风险行可以跳转到班次明细。"
  - "不新增依赖、不修改 package 或 lockfile。"
dependencies:
  - "US030"
status: "done"
```

### US032 - shadcn dashboard-01 视觉差距审计

```yaml
id: US032
requirement_ids:
  - R020
module: "前端设计"
role: "PM"
story: "作为 PM，我希望先对当前前端和 shadcn dashboard-01 复刻规格做差距审计，以便确认哪些差异必须改、哪些差异可以接受。"
task_type: "frontend-audit"
priority: "P0"
acceptance:
  - "阅读项目当前 components、app 页面、global CSS、components.json 和 shadcn 相关配置。"
  - "基于 spec 检查 token、字体、圆角、sidebar/header 尺寸、card 尺寸、chart/table 结构、响应式行为和 light/dark 模式。"
  - "输出差距清单，按 P0/P1/P2 标注。"
  - "明确哪些差距需要新增依赖或 package/lockfile 变更。"
  - "不直接改 UI，不安装依赖。"
dependencies:
  - "F012"
status: "done"
```

### US033 - shadcn dashboard-01 视觉对齐实施

```yaml
id: US033
requirement_ids:
  - R020
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望当前 BPO WFM 后台页面在保留业务数据、接口和路由的前提下，对齐 shadcn dashboard-01 的 token、尺寸、组件结构和响应式质感，以便界面更专业稳定。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "保留现有业务字段、接口、路由和中文业务文案。"
  - "按 spec 对齐 light/dark token、字体、圆角、sidebar/header、metric cards、chart/table 和响应式行为。"
  - "优先使用 shadcn token，不硬编码颜色。"
  - "浏览器验证 1440x900 深色、1440x900 浅色、1314px、移动端。"
  - "列出与官方 dashboard-01 仍存在的差异。"
dependencies:
  - "US032"
status: "done"
```

### US034 - shadcn 依赖与组件接入收口

```yaml
id: US034
requirement_ids:
  - R021
module: "前端设计"
role: "前端应用"
story: "作为前端应用，我希望已确认的 shadcn dashboard parity 依赖和组件先被纳入受控工程范围并通过验证，以便后续表格交互、Drawer 和 Tabler 图标迁移可以在稳定基线上继续。"
task_type: "frontend-scaffold"
priority: "P0"
acceptance:
  - "package.json 和 package-lock.json 记录 PM 已确认的依赖变更。"
  - "新增 shadcn UI 组件文件和 hooks/use-mobile.ts 纳入受控范围。"
  - "修复 use-mobile.ts 当前 lint 失败。"
  - "核对 Button、Input、Separator 上游替换不会破坏现有表单、筛选、导航和主题行为。"
  - "不开发新的业务页面或业务能力。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US033"
status: "done"
```

### US035 - Harness Gate 体系审计反馈修复

```yaml
id: US035
requirement_ids:
  - R022
module: "Harness"
role: "PM"
story: "作为 PM，我希望 Gate Registry、AGENTS 阶段名、audit-report 口径和 Story Runner 队列入口与当前项目真实范围一致，以便后续执行者不会误判 Gate 标准和下一步起点。"
task_type: "harness"
priority: "P0"
acceptance:
  - "GATE_REGISTRY.md 建立 required_workflow 到 Gate 的映射矩阵。"
  - "AGENTS.md 的 Current stage 与 PROJECT_STATE 当前范围一致。"
  - "audit-report 中旧 clean-Harness 结论被标记为历史审计快照，不再与当前结论并列。"
  - "backlog 至少有一条 `ready` 状态任务作为 Story Runner 下一步入口。"
  - "不修改业务实现、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US034"
status: "done"
```

### US036 - 前端风险明细钻取入口

```yaml
id: US036
requirement_ids:
  - R019
  - R023
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从排班计划页的风险提示进入风险明细，以便查看风险项关联的计划、时段缺口、不可用影响和人工复核建议。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "风险提示行提供稳定的明细入口。"
  - "明细展示风险等级、计划、日期、时段、项目、职场、缺口、不可用影响、原因和建议。"
  - "明细可继续跳转到排班计划详情、班次明细或不可用记录相关视图。"
  - "复用现有本地 MVP 数据契约，不新增真实数据源。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不提供审批、批量调班、自动排班或生产公式能力。"
dependencies:
  - "US031"
  - "US034"
status: "done"
```

### US037 - 前端不可用影响定位

```yaml
id: US037
requirement_ids:
  - R018
  - R019
  - R024
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望从不可用记录进入影响定位，以便查看该不可用时段影响了哪些班次、缺口和风险提示。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "不可用记录行提供稳定的影响定位入口。"
  - "影响定位页展示人员、团队、项目、职场、日期、不可用时段、原因和状态。"
  - "影响定位页展示与不可用时间重叠的班次明细。"
  - "影响定位页展示与不可用时间重叠的风险提示。"
  - "页面可跳转到排班计划详情、班次明细、风险明细和不可用列表。"
  - "复用现有本地 MVP 数据契约，不新增真实数据源。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不提供审批、批量调班、自动排班或生产公式能力。"
dependencies:
  - "US029"
  - "US036"
status: "done"
```

### US038 - 风险提示表局部 table parity 迁移

```yaml
id: US038
requirement_ids:
  - R020
  - R021
  - R025
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划页的风险提示表先迁移到 TanStack Table 局部实现，以便后续逐步接近 shadcn dashboard table 交互。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "新增局部 ScheduleRiskTable 组件。"
  - "风险提示表由 TanStack Table 管理列和排序。"
  - "保留风险等级、日期、时段、项目、职场、缺口、不可用、原因、建议和明细/班次动作。"
  - "不新增依赖、不修改 package 或 lockfile。"
  - "不启用批量选择、拖拽排序、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US036"
  - "US037"
status: "done"
```

### US039 - 开发服务器原生运行时硬化

```yaml
id: US039
requirement_ids:
  - R026
module: "Harness"
role: "前端开发者"
story: "作为前端开发者，我希望 `npm run dev` 和 `scripts/dev.sh` 在本机总是通过受控 Node.js 22 与受检原生包链路启动，以便不会再因为默认 Node 或 native addon 签名/缺失问题把错误拖到运行时 500。"
task_type: "harness"
priority: "P0"
acceptance:
  - "`npm run dev` 收口到项目受控开发入口，而不是裸 `next dev`。"
  - "开发入口会在启动前验证 `lightningcss` 和 Next.js compiler 原生包可加载。"
  - "开发入口与 build 统一使用 webpack 链路。"
  - "回归测试覆盖支持运行时成功和默认 Codex Node 失败可识别两类场景。"
  - "不新增依赖、不修改 lockfile、不改业务代码或后端契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US035"
status: "done"
```

### US040 - Python 3.12 开发运行时固化

```yaml
id: US040
requirement_ids:
  - R027
module: "Harness"
role: "前后端开发者"
story: "作为前后端开发者，我希望 backend dev/check 入口只接受 Python 3.12，并在启动前明确验证版本和依赖，以便不同 PATH 或系统 Python 不会悄悄改变项目运行时。"
task_type: "harness"
priority: "P0"
acceptance:
  - "项目根目录提供 `.python-version` 并声明 Python 3.12。"
  - "backend runtime 验证会拒绝系统 Python 3.9 等不受支持版本。"
  - "回归测试覆盖支持运行时成功、系统 Python 失败可识别两类场景。"
  - "README、setup、project state 和 backend README 明确 Python 3.12 约束。"
  - "不新增依赖、不修改业务代码或后端契约。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US039"
status: "done"
```

### US041 - Harness 标准化分支与验证工作流

```yaml
id: US041
requirement_ids:
  - R028
module: "Harness"
role: "PM"
story: "作为 PM，我希望 Codex 在每个任务中使用可审计的分支、worktree、验证、提交、集成和 push 确认流程，同时让 AGENTS.md 保持短版入口，以便后续开发既能连续推进又能控制风险。"
task_type: "harness"
priority: "P0"
acceptance:
  - "AGENTS.md 保留规则优先级、入口、分支红线、stop condition、Story Runner 和 push 控制等短版原则。"
  - "docs/quality/GIT_BRANCH_WORKFLOW.md 提供命令级 runbook。"
  - "docs/quality/FRONTEND_RULES.md 承接详细前端规则，避免 AGENTS.md 继续膨胀。"
  - "GATE_REGISTRY.md 映射分支、scope diff、最终验证和本地提交证据要求。"
  - "DONE_REPORT_TEMPLATE.md 增加分支、提交、集成和 push 决策证据字段。"
  - "H017 的 task-log、branch-log、decision-log 和 audit-report 留痕完整。"
  - "不修改业务实现、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US035"
status: "done"
```

### US042 - No Database MVP Mode 固化

```yaml
id: US042
requirement_ids:
  - R029
module: "MVP 范围"
role: "PM"
story: "作为 PM，我希望项目在功能开发完毕前明确保持 No Database MVP Mode，以便当前没有数据库环境时仍能继续验证本地业务链路。"
task_type: "harness"
priority: "P0"
acceptance:
  - "Project State、Gate Registry、Decision Log 和追踪日志明确 no-database 边界。"
  - "任何数据库连接、ORM、migration、schema、持久化配置或真实数据接入都被列为 hard stop。"
  - "允许继续使用本地接口、种子数据、进程内存和前端 fallback 完成本地 MVP 验证。"
  - "不修改 backend、package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US041"
status: "done"
```

### US043 - 本地 MVP 功能闭环入口

```yaml
id: US043
requirement_ids:
  - R030
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划页看到本地 MVP 链路入口，以便从需求计划、排班计划、风险明细、不可用影响和班次明细之间连续复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划页展示本地 MVP 链路面板。"
  - "链路面板可跳转到需求计划、排班计划、风险明细、不可用管理和班次明细。"
  - "链路面板明确当前为 No Database 本地 MVP。"
  - "不新增后端接口、不新增 mock 数据、不修改 package 或 lockfile。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US042"
  - "US036"
  - "US037"
status: "done"
```

### US044 - 排班计划主表 table parity 局部迁移

```yaml
id: US044
requirement_ids:
  - R031
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划主表也使用 TanStack Table 管理列和排序，以便逐步接近 shadcn dashboard table 的实现方式。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "排班计划主表由 TanStack Table 管理列、行模型和排序。"
  - "保留日期、项目、职场、状态、缺口、覆盖率、版本、预测、已排和查看动作。"
  - "排序仍为展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US038"
  - "US043"
status: "done"
```

### US045 - 本地 MVP 验收审计

```yaml
id: US045
requirement_ids:
  - R032
module: "质量与交付"
role: "PM"
story: "作为 PM，我希望在本轮 no-database、功能闭环和 table parity 后看到一轮验收审计，以便确认下一步仍应围绕本地 MVP 而不是数据库展开。"
task_type: "qa"
priority: "P0"
acceptance:
  - "审计报告记录 No Database MVP Mode、功能闭环入口和 table parity 迁移结果。"
  - "明确当前仍不包含数据库、真实集成、权限、审批、导出、批量和生产口径。"
  - "记录最终 `bash scripts/check.sh` 验证结果。"
  - "给出下一阶段建议。"
dependencies:
  - "US042"
  - "US043"
  - "US044"
status: "done"
```

### US046 - 排班计划详情复核链路补强

```yaml
id: US046
requirement_ids:
  - R033
module: "计划与排班"
role: "运营排班人员"
story: "作为运营排班人员，我希望在排班计划详情页直接看到班次、风险和不可用的复核入口与本地计数，以便更快完成同一计划的人工复核。"
task_type: "frontend"
priority: "P0"
acceptance:
  - "排班计划详情页新增复核链路面板。"
  - "面板展示缺口时段、关联风险和生效中不可用的本地计数。"
  - "面板可跳转到班次明细、风险提示和不可用管理相关视图。"
  - "复用现有本地 MVP 契约，不新增后端接口、真实数据源、数据库或依赖。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US043"
  - "US045"
status: "done"
```

### US047 - 班次明细 table parity 第二条迁移

```yaml
id: US047
requirement_ids:
  - R034
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望班次明细页也使用 TanStack Table 管理列和排序，以便继续靠近 shadcn dashboard table 的展示体验。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "班次明细页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时段、项目、职场、状态、预测、已排、缺口、覆盖率、备注和计划动作。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US046"
  - "US044"
status: "done"
```

### US048 - 不可用记录 table parity 第三条迁移

```yaml
id: US048
requirement_ids:
  - R035
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用记录页也使用 TanStack Table 管理列和排序，以便本地 MVP 的主要列表都收口到一致的 table parity 体验。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用记录页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时间、人员、团队、项目、职场、原因、状态、影响时段、备注和影响/班次动作。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US047"
status: "done"
```

### US049 - F021-F023 本地链路 QA 验收收口

```yaml
id: US049
requirement_ids:
  - R036
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F021-F023 进行一次集中验收，确认复核链路和两条 table parity 在 no-database 模式下可验证、可追溯、可持续交付。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "验证排班计划详情可见复核链路入口和关键计数。"
  - "验证班次明细和不可用记录均由独立 TanStack Table 组件渲染并保留既有动作入口。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US046"
  - "US047"
  - "US048"
status: "done"
```

### US050 - 需求计划 table parity 第四条迁移

```yaml
id: US050
requirement_ids:
  - R037
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望需求计划页也使用 TanStack Table 管理列和排序，以便本地 MVP 的主要表格保持一致交互节奏。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "需求计划页由独立的 TanStack Table 组件渲染。"
  - "保留日期、时段、项目、职场、预测人数、来源、状态字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US048"
status: "done"
```

### US051 - F024 单故事 QA 验收收口

```yaml
id: US051
requirement_ids:
  - R038
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F024 做单故事验收收口，确认需求计划 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "验证需求计划页面由独立 TanStack Table 组件渲染且关键字段仍保留。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US050"
status: "done"
```

### US052 - 排班计划详情时段表 table parity 第五条迁移

```yaml
id: US052
requirement_ids:
  - R039
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望排班计划详情页的 0.5h 时段表也使用 TanStack Table 管理列和排序，以保持主要表格一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "排班计划详情时段表由独立 TanStack Table 组件渲染。"
  - "保留开始、结束、预测、已排、缺口、覆盖率、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US050"
status: "done"
```

### US053 - F025 单故事 QA 验收收口

```yaml
id: US053
requirement_ids:
  - R040
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F025 做单故事验收收口，确认排班计划详情时段表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "排班计划详情页 0.5h 时段表由独立 TanStack Table 组件渲染。"
  - "时段表字段保留：开始、结束、预测、已排、缺口、覆盖率、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US052"
status: "done"
```

### US054 - 风险明细受影响班次表 table parity 第六条迁移

```yaml
id: US054
requirement_ids:
  - R041
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望风险明细页的受影响班次表也使用 TanStack Table 管理列和排序，以继续收口关键详情视图的一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "风险明细页受影响班次表由独立 TanStack Table 组件渲染。"
  - "保留计划、状态、时段、预测、已排、缺口、覆盖率、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US052"
status: "done"
```

### US055 - F026 单故事 QA 验收收口

```yaml
id: US055
requirement_ids:
  - R042
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F026 做单故事验收收口，确认风险明细受影响班次表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细页受影响班次表由独立 TanStack Table 组件渲染。"
  - "受影响班次表字段保留：计划、状态、时段、预测、已排、缺口、覆盖率、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US054"
status: "done"
```

### US056 - 风险明细不可用影响表 table parity 第七条迁移

```yaml
id: US056
requirement_ids:
  - R043
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望风险明细页的不可用影响表也使用 TanStack Table 管理列和排序，以统一详情页的表格交互。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "风险明细页不可用影响表由独立 TanStack Table 组件渲染。"
  - "保留人员、团队、时间、原因、状态、影响时段、备注字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US054"
status: "done"
```

### US057 - F027 单故事 QA 验收收口

```yaml
id: US057
requirement_ids:
  - R044
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F027 做单故事验收收口，确认风险明细不可用影响表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细页不可用影响表由独立 TanStack Table 组件渲染。"
  - "不可用影响表字段保留：人员、团队、时间、原因、状态、影响时段、备注。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US056"
status: "done"
```

### US058 - 不可用影响详情受影响班次表 table parity 第八条迁移

```yaml
id: US058
requirement_ids:
  - R045
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用影响详情页的受影响班次表也使用 TanStack Table 管理列和排序，以继续收口详情视图的一致性。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用影响详情页受影响班次表由独立 TanStack Table 组件渲染。"
  - "保留计划、时段、状态、预测、已排、缺口、覆盖率、备注和动作字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US056"
status: "done"
```

### US059 - F028 单故事 QA 验收收口

```yaml
id: US059
requirement_ids:
  - R046
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F028 做单故事验收收口，确认不可用影响详情受影响班次表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "不可用影响详情页受影响班次表由独立 TanStack Table 组件渲染。"
  - "受影响班次表字段保留：计划、时段、状态、预测、已排、缺口、覆盖率、备注和动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US058"
status: "done"
```

### US060 - 不可用影响详情关联风险表 table parity 第九条迁移

```yaml
id: US060
requirement_ids:
  - R047
module: "前端设计"
role: "运营排班人员"
story: "作为运营排班人员，我希望不可用影响详情页的关联风险表也使用 TanStack Table 管理列和排序，以完成这组详情页 parity 闭环。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "不可用影响详情页关联风险表由独立 TanStack Table 组件渲染。"
  - "保留风险、时段、缺口、不可用、原因、建议和动作字段。"
  - "排序保持展示层行为，不改变后端契约或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US058"
status: "done"
```

### US061 - F029 单故事 QA 验收收口

```yaml
id: US061
requirement_ids:
  - R048
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F029 做单故事验收收口，确认不可用影响详情关联风险表 parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "不可用影响详情页关联风险表由独立 TanStack Table 组件渲染。"
  - "关联风险表字段保留：风险、时段、缺口、不可用、原因、建议和动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US060"
status: "done"
```

### US062 - 详情页 table parity 连续开发块 QA 总收口

```yaml
id: US062
requirement_ids:
  - R049
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望在 F026-F029 完成后，对风险明细和不可用影响详情这组详情页 table parity 做一次总收口，确认连续开发块可验证、可追溯、可持续交付。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "风险明细两张表与不可用影响详情两张表均已迁移为独立 TanStack Table 组件。"
  - "相关详情页动作入口保持可用，未引入审批、导出、批量调班或生产动作。"
  - "更新审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US055"
  - "US057"
  - "US059"
  - "US061"
status: "done"
```

### US063 - Harness 状态治理 v3 第一轮落地

```yaml
id: US063
requirement_ids:
  - R051
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望默认启动上下文从大 backlog/user stories 切到 current 状态层，并能通过 registry 和 check-state 发现状态漂移，以便后续开发不再依赖读取超大历史文件。"
task_type: "harness"
priority: "P1"
acceptance:
  - "新增 `docs/current/PROJECT_CONTEXT.md`、`docs/current/STORY_QUEUE.yaml`、`docs/current/ACTIVE_TASKS.yaml` 和 `docs/current/BLOCKERS.md`。"
  - "新增 `docs/registry/TRACE_INDEX.yaml` 和 `docs/registry/DECISION_INDEX.yaml`，且 `TRACE_INDEX.yaml` 不记录 status。"
  - "新增 `scripts/check-state.sh`，默认 warning-only，并支持 `--repair-scope` 和 `--strict`。"
  - "AGENTS、Lightweight Harness、Gate Registry、Done Report Template 和 Project State 已对齐 current/registry/archive、History-On-Demand、archive 不可执行、single writer 和 State Repair Mode。"
  - "不迁移大量 done 历史，不改业务代码，不改 package/lockfile，不接数据库。"
  - "`bash scripts/check-state.sh` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US062"
status: "done"
```

### US064 - check-state 标准验证链路接入

```yaml
id: US064
requirement_ids:
  - R052
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望标准检查能自动暴露 current/registry 状态漂移，并用回归测试证明 warning-only 不会让普通任务自锁。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 运行 `bash scripts/check-state.sh`。"
  - "新增 `scripts/tests/check-state.test.mjs`，覆盖一致状态、warning-only 不自锁、strict 缺 active task 失败、TRACE_INDEX lifecycle state 失败。"
  - "`scripts/check-state.sh` 支持测试通过 `BPO_STATE_ROOT` 注入临时状态根目录。"
  - "不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US063"
status: "done"
```

### US065 - current queue 真实任务冒烟

```yaml
id: US065
requirement_ids:
  - R053
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望用 current queue 执行一条真实治理小任务，验证下一轮任务可以从 current 层启动而不是读取大 backlog。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`docs/current/STORY_QUEUE.yaml` 曾提供 ready story，`docs/current/ACTIVE_TASKS.yaml` 曾提供匹配 active task。"
  - "`bash scripts/check-state.sh --strict` 在 current entry 存在时通过。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "TRACE_INDEX 记录 US065/H024 的历史定位，但不记录 lifecycle state。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US064"
status: "done"
```

### US066 - current done history 不变量检查

```yaml
id: US066
requirement_ids:
  - R054
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 state check 能发现 current 文件中的 done 历史，避免 current 层重新膨胀成历史日志。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`STORY_QUEUE.yaml` 出现 `status: done` 时 warning-only mode 告警，strict mode 失败。"
  - "`ACTIVE_TASKS.yaml` 出现 `status: done` 时 strict mode 失败。"
  - "state-check 回归测试覆盖 done story/task in current。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US065"
status: "done"
```

### US067 - check-state strict 默认阻断

```yaml
id: US067
requirement_ids:
  - R055
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望普通任务的标准检查默认阻断状态漂移，同时 state-repair 任务仍有明确旁路。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 默认运行 `bash scripts/check-state.sh --strict`。"
  - "`BPO_STATE_CHECK_MODE=repair-scope bash scripts/check.sh` 可用于 State Repair Mode。"
  - "`BPO_STATE_CHECK_MODE=warning bash scripts/check.sh` 可用于临时诊断。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US066"
status: "done"
```

### US068 - TRACE_INDEX current_files 路径校验

```yaml
id: US068
requirement_ids:
  - R056
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 check-state 校验 TRACE_INDEX 的 current_files 路径，避免 registry 指向缺失 current 文件。"
task_type: "harness"
priority: "P1"
acceptance:
  - "`TRACE_INDEX.yaml` 的 `current_files` 路径会被 check-state 校验。"
  - "重复 registry 路径不会产生重复输出。"
  - "回归测试覆盖 missing current_files path strict 失败。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`node --test scripts/tests/check-state.test.mjs`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US067"
status: "done"
```

### US069 - Codex Plan 面板边界规则

```yaml
id: US069
requirement_ids:
  - R057
module: "Harness"
role: "项目执行者"
story: "作为项目执行者，我希望 Codex Plan 面板只作为当前会话投影视图，避免它被误用成项目状态源。"
task_type: "harness"
priority: "P1"
acceptance:
  - "AGENTS.md 明确 Codex Plan is not a source of truth。"
  - "STATE_MANAGEMENT.md 明确 Plan 必须从 Harness current queue 派生。"
  - "当 Codex Plan 与 Harness state 冲突时，Harness state wins。"
  - "任务完成后 current queue 清空，不保留 done 历史。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
dependencies:
  - "US068"
status: "done"
```

### US070 - Dashboard 异常明细表 TanStack Table parity

```yaml
id: US070
requirement_ids:
  - R058
module: "前端设计"
role: "运营负责人"
story: "作为运营负责人，我希望 dashboard 的 BPO 异常明细表也使用 TanStack Table 管理排序和分页，以便首页表格与其他 MVP 表格保持一致。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "Dashboard 异常明细表由 TanStack Table 管理列、排序和分页。"
  - "保留异常编号、异常类型、团队、人数、影响工时、严重度、状态、项目、班次时间和操作字段。"
  - "搜索、排序和分页仍为本地展示行为，不改变数据来源或业务口径。"
  - "不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US069"
status: "done"
```

### US071 - Dashboard 异常明细表本地列显示与分页控制

```yaml
id: US071
requirement_ids:
  - R059
module: "前端设计"
role: "运营负责人"
story: "作为运营负责人，我希望 dashboard 异常明细表的列控制和分页大小是可用的本地交互，以便快速聚焦异常字段。"
task_type: "frontend"
priority: "P1"
acceptance:
  - "列控制按钮可打开本地列显示开关。"
  - "分页大小可在本地切换，并保持当前筛选结果下的页码有效。"
  - "交互只改变本地表格展示，不触发真实动作或后端写入。"
  - "`bash scripts/check.sh` 通过。"
dependencies:
  - "US070"
status: "done"
```

### US072 - F030-F031 dashboard table parity QA 收口

```yaml
id: US072
requirement_ids:
  - R060
module: "质量与交付"
role: "QA"
story: "作为 QA，我希望对 F030-F031 做验收收口，确认 dashboard table parity 在 no-database 边界内可验证、可追溯。"
task_type: "qa"
priority: "P1"
acceptance:
  - "`bash scripts/check.sh` 通过。"
  - "Dashboard 异常明细表使用 TanStack Table 管理排序和分页。"
  - "列显示与分页大小控制可用，且未引入审批、导出、批量或生产动作。"
  - "完成审计、任务日志、项目状态、分支日志和 backlog 追溯。"
dependencies:
  - "US071"
status: "done"
```

### US083-US102 - 排班/风险/不可用表格本地 parity 连续增强

```yaml
stories:
  - {id: US083, requirement_ids: [R071], task_ids: [F041], status: done, story: "排班计划表需要本地筛选与统计模型测试。"}
  - {id: US084, requirement_ids: [R072], task_ids: [F042], status: done, story: "排班计划表需要本地摘要条。"}
  - {id: US085, requirement_ids: [R073], task_ids: [F043], status: done, story: "排班计划表需要本地查询、状态和缺口筛选。"}
  - {id: US086, requirement_ids: [R074], task_ids: [F044], status: done, story: "排班计划表需要重置筛选和空结果提示。"}
  - {id: US087, requirement_ids: [R075], task_ids: [F045], status: done, story: "排班计划表需要本地分页范围与翻页控制。"}
  - {id: US088, requirement_ids: [R076], task_ids: [F046], status: done, story: "排班计划表需要本地列显示控制。"}
  - {id: US089, requirement_ids: [R077], task_ids: [F047], status: done, story: "风险提示表需要本地筛选与统计模型测试。"}
  - {id: US090, requirement_ids: [R078], task_ids: [F048], status: done, story: "风险提示表需要本地摘要条。"}
  - {id: US091, requirement_ids: [R079], task_ids: [F049], status: done, story: "风险提示表需要风险等级筛选。"}
  - {id: US092, requirement_ids: [R080], task_ids: [F050], status: done, story: "风险提示表需要本地搜索。"}
  - {id: US093, requirement_ids: [R081], task_ids: [F051], status: done, story: "风险提示表需要本地分页范围与翻页控制。"}
  - {id: US094, requirement_ids: [R082], task_ids: [F052], status: done, story: "风险提示表需要重置筛选和空结果提示。"}
  - {id: US095, requirement_ids: [R083], task_ids: [F053], status: done, story: "不可用表需要本地筛选与统计模型测试。"}
  - {id: US096, requirement_ids: [R084], task_ids: [F054], status: done, story: "不可用表需要本地摘要条。"}
  - {id: US097, requirement_ids: [R085], task_ids: [F055], status: done, story: "不可用表需要状态筛选。"}
  - {id: US098, requirement_ids: [R086], task_ids: [F056], status: done, story: "不可用表需要本地搜索。"}
  - {id: US099, requirement_ids: [R087], task_ids: [F057], status: done, story: "不可用表需要本地分页范围与翻页控制。"}
  - {id: US100, requirement_ids: [R088], task_ids: [F058], status: done, story: "不可用表需要重置筛选和空结果提示。"}
  - {id: US101, requirement_ids: [R089], task_ids: [F059], status: done, story: "不可用表需要本地列显示控制。"}
  - {id: US102, requirement_ids: [R090], task_ids: [Q014], status: done, story: "F041-F059 完成后需要 QA 收口。"}
acceptance:
  - "三张本地表格均有筛选摘要、重置、分页范围和空结果提示。"
  - "排班计划表与不可用表具备列显示控制。"
  - "本地筛选和统计模型有回归测试覆盖。"
  - "不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量、权限或生产公式。"
```

### US103-US108 - 生产雏形第一批需求

```yaml
stories:
  - id: US103
    requirement_ids: [R091]
    task_ids: [H030]
    module: "Harness"
    role: "PM"
    story: "作为 PM，我希望把生产雏形大 PRD 拆成第一批可执行需求和 current ready queue，以便后续开发不再停留在大文档层。"
    task_type: "harness"
    priority: "P0"
    status: "done"
  - id: US104
    requirement_ids: [R092]
    task_ids: [B006]
    module: "主数据"
    role: "数据管理员"
    story: "作为数据管理员，我希望先有主数据导入合同，明确坐席、职场、供应商、项目、绑定关系和班次类型的字段、主键、校验、批次和失败行口径。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US105
    requirement_ids: [R093]
    task_ids: [B007]
    module: "排班"
    role: "排班运营"
    story: "作为排班运营，我希望人员级排班合同能明确员工、日期、职场、供应商、班次、休息/饭点和 0.5h 展开结果，以便后续排班导入和时段汇总可以对齐。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US106
    requirement_ids: [R094, R095]
    task_ids: [B008]
    module: "预测与实际对比"
    role: "现场主管"
    story: "作为现场主管，我希望需求预测、人员排班、登录日志和状态日志有统一对比口径，以便识别缺口、未登录、迟到、早退和非有效产能。"
    task_type: "backend-mvp"
    priority: "P0"
    status: "done"
  - id: US107
    requirement_ids: [R096]
    task_ids: [F060]
    module: "异常闭环"
    role: "运营负责人"
    story: "作为运营负责人，我希望异常识别和复核结果有统一字段和展示入口，以便把异常归因到排班、人员、主数据、导入、预测或状态源问题。"
    task_type: "frontend"
    priority: "P1"
    status: "planned"
  - id: US108
    requirement_ids: [R092, R093, R094, R095, R096]
    task_ids: [Q015]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对生产雏形第一批本地合同和展示入口做验收收口，确认 no-database 边界、PRD 追溯和验收口径一致。"
    task_type: "qa"
    priority: "P1"
    status: "planned"
acceptance:
  - "第一批 ready stories 必须有匹配 active task。"
  - "第一批只允许本地合同、seed/process-memory 或前端展示层；不接数据库、不接真实外部数据。"
  - "生产权限、审批、导出、批量、自动排班、生产公式、结算规则和收费因子继续作为后续能力。"
  - "`bash scripts/check-state.sh --strict`、`git diff --check` 和 `bash scripts/check.sh` 通过。"
```

### US109-US112 - 生产雏形合同前端演示入口

```yaml
stories:
  - id: US109
    requirement_ids: [R097]
    task_ids: [F061]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望前端有生产雏形合同客户端和模型测试，能汇总三类合同覆盖范围，以便确认后续页面展示不是硬编码猜测。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US110
    requirement_ids: [R098]
    task_ids: [F062]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望有一个生产雏形合同页，集中查看主数据、人员排班、预测/登录/状态对比合同和暂不实现边界。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US111
    requirement_ids: [R099]
    task_ids: [F063]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入生产雏形合同页，以便本地验收时不用记住 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US112
    requirement_ids: [R100]
    task_ids: [Q016]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对生产雏形合同演示入口做验收收口，确认页面可构建、导航可达、边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "页面展示来自本地合同客户端和 fallback，不接真实外部数据。"
  - "页面明确 no-database、无真实导入、无权限审批导出批量、无生产公式。"
  - "侧边栏有生产雏形入口并能高亮。"
  - "`node --experimental-strip-types --test scripts/tests/production-mvp-contracts.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US113-US116 - 异常复核只读入口

```yaml
stories:
  - id: US113
    requirement_ids: [R101]
    task_ids: [F064]
    module: "异常闭环"
    role: "运营负责人"
    story: "作为运营负责人，我希望前端有异常复核本地模型和测试，能统计异常数量、待复核数量、严重度、归因和负责人，以便页面不是硬编码堆文案。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US114
    requirement_ids: [R102]
    task_ids: [F065]
    module: "异常闭环"
    role: "现场主管"
    story: "作为现场主管，我希望有一个异常复核只读页，集中查看异常清单、来源、归因、复核建议和暂不处理边界。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US115
    requirement_ids: [R103]
    task_ids: [F066]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏异常复核入口进入新的只读页，以便本地验收时不用从 dashboard 间接查找。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US116
    requirement_ids: [R104]
    task_ids: [Q017]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对异常复核只读入口做验收收口，确认页面可构建、导航可达、边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "页面展示来自本地异常复核模型和 fallback，不接真实外部数据。"
  - "页面明确不做复核提交、审批、权限、导出、批量、真实异常计算或生产公式。"
  - "侧边栏异常复核入口能进入新页面并高亮。"
  - "`node --experimental-strip-types --test scripts/tests/anomaly-review.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US117-US126 - 导入合同 drilldown 与数据质量中心

```yaml
stories:
  - id: US117
    requirement_ids: [R105]
    task_ids: [F067]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形合同有可复用 drilldown 模型和测试，以便总览页的入口能追溯到真实本地合同字段。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US118
    requirement_ids: [R106]
    task_ids: [F068]
    module: "主数据"
    role: "数据管理员"
    story: "作为数据管理员，我希望进入主数据导入合同详情，查看对象、字段、主键、外键和质量错误码。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US119
    requirement_ids: [R107]
    task_ids: [F069]
    module: "排班"
    role: "排班运营"
    story: "作为排班运营，我希望进入人员级排班合同详情，查看人员明细字段和 0.5h 展开口径。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US120
    requirement_ids: [R108]
    task_ids: [F070]
    module: "履约对比"
    role: "现场主管"
    story: "作为现场主管，我希望进入履约对比合同详情，查看预测、排班、登录和状态如何对齐并产生异常规则。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US121
    requirement_ids: [R109]
    task_ids: [F071]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总览页直接提供三个合同 drilldown 入口，以便验收时不需要记 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US122
    requirement_ids: [R110]
    task_ids: [F072]
    module: "数据质量"
    role: "数据管理员"
    story: "作为数据管理员，我希望数据质量问题有本地模型和测试，以便后续导入失败、异常识别和主数据问题能统一展示。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US123
    requirement_ids: [R111]
    task_ids: [F073]
    module: "数据质量"
    role: "数据管理员"
    story: "作为数据管理员，我希望有数据质量中心只读页，查看问题总量、未解决问题、来源分布和列表。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US124
    requirement_ids: [R112]
    task_ids: [F074]
    module: "数据质量"
    role: "现场主管"
    story: "作为现场主管，我希望能打开单个数据质量问题详情，查看错误码、字段、原值、建议处理和暂不实现动作。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US125
    requirement_ids: [R113]
    task_ids: [F075]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏数据质量入口进入新的只读中心，以便本地验收路径清晰。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US126
    requirement_ids: [R114]
    task_ids: [Q018]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对导入合同 drilldown 与数据质量中心做验收收口，确认页面、导航、测试和边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "导入合同 drilldown 展示来自本地生产雏形合同模型，不接真实外部导入。"
  - "数据质量中心展示来自本地 fallback 模型，不接数据库或真实接口。"
  - "页面明确无真实修复、无审批、无权限、无导出、无批量、无生产公式。"
  - "`node --experimental-strip-types --test scripts/tests/import-drilldown.test.mjs`、`node --experimental-strip-types --test scripts/tests/data-quality.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US127-US136 - 人员时间轴、需求预测合同和主数据关系

```yaml
stories:
  - {id: US127, requirement_ids: [R115], task_ids: [F076], module: "人员时间轴", role: "现场主管", story: "作为现场主管，我希望人员级双时间轴有本地模型和测试，以便能对齐排班、登录、状态和异常。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US128, requirement_ids: [R116], task_ids: [F077], module: "人员时间轴", role: "现场主管", story: "作为现场主管，我希望有人员时间轴总览只读页，查看每个员工的计划时长、登录时长、状态时长和异常数量。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US129, requirement_ids: [R117], task_ids: [F078], module: "人员时间轴", role: "现场主管", story: "作为现场主管，我希望进入单个员工时间轴详情，查看排班、登录和状态事件的对齐情况。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US130, requirement_ids: [R118], task_ids: [F079], module: "导航", role: "PM", story: "作为 PM，我希望侧边栏能直接进入人员时间轴，以便验收人员级对齐能力。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US131, requirement_ids: [R119], task_ids: [F080], module: "需求预测", role: "排班运营", story: "作为排班运营，我希望需求预测导入合同有本地模型和测试，明确 0.5h 时段、技能组和等级字段。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US132, requirement_ids: [R120], task_ids: [F081], module: "需求预测", role: "排班运营", story: "作为排班运营，我希望进入需求预测导入合同页，查看字段、主键、校验规则和暂不实现范围。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US133, requirement_ids: [R121], task_ids: [F082], module: "生产雏形", role: "PM", story: "作为 PM，我希望生产雏形总览页直接提供需求预测合同入口，以便预测需求可以独立验收。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US134, requirement_ids: [R122], task_ids: [F083], module: "主数据", role: "数据管理员", story: "作为数据管理员，我希望主数据关系有本地模型和测试，确认坐席、供应商、职场、项目、绑定和班次类型的依赖。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US135, requirement_ids: [R123], task_ids: [F084], module: "主数据", role: "数据管理员", story: "作为数据管理员，我希望有主数据关系只读页和入口，以便验收主数据如何支撑排班和履约对比。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US136, requirement_ids: [R124], task_ids: [Q019], module: "质量与交付", role: "QA", story: "作为 QA，我希望对人员时间轴、需求预测合同和主数据关系做验收收口，确认页面、导航、测试和边界未越界。", task_type: "qa", priority: "P1", status: "done"}
acceptance:
  - "人员时间轴展示来自本地 fallback 模型，不接真实登录或状态系统。"
  - "需求预测合同展示本地导入字段和校验规则，不执行真实导入。"
  - "主数据关系展示本地关系图谱，不执行主数据 CRUD 或冻结解冻。"
  - "页面明确无真实修复、无审批、无权限、无导出、无批量、无生产公式。"
  - "`node --experimental-strip-types --test scripts/tests/person-timeline.test.mjs`、`node --experimental-strip-types --test scripts/tests/demand-forecast-contract.test.mjs`、`node --experimental-strip-types --test scripts/tests/master-data-relations.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US137-US146 - 班次类型、导入模板和异常来源 drilldown

```yaml
stories:
  - {id: US137, requirement_ids: [R125], task_ids: [F085], module: "班次类型", role: "排班运营", story: "作为排班运营，我希望班次类型有本地模型和测试，以便确认人员级排班如何引用班次代码、休息和饭点。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US138, requirement_ids: [R126], task_ids: [F086], module: "班次类型", role: "排班运营", story: "作为排班运营，我希望有班次类型只读页，查看班次字段、适用项目、时长和暂不实现边界。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US139, requirement_ids: [R127], task_ids: [F087], module: "导航", role: "PM", story: "作为 PM，我希望侧边栏能直接进入班次类型，以便本地验收时不需要记 URL。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US140, requirement_ids: [R128], task_ids: [F088], module: "导入模板", role: "数据管理员", story: "作为数据管理员，我希望导入模板有本地模型和测试，以便确认第一期到底要上传哪些表。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US141, requirement_ids: [R129], task_ids: [F089], module: "导入模板", role: "数据管理员", story: "作为数据管理员，我希望有导入模板只读页，查看每张模板的字段、主键、校验和暂不实现动作。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US142, requirement_ids: [R130], task_ids: [F090], module: "导航", role: "PM", story: "作为 PM，我希望侧边栏能直接进入导入模板，以便验收上传/导入准备口径。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US143, requirement_ids: [R131], task_ids: [F091], module: "异常闭环", role: "现场主管", story: "作为现场主管，我希望异常来源有本地模型和测试，以便知道每类异常来自哪些输入和对齐键。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US144, requirement_ids: [R132], task_ids: [F092], module: "异常闭环", role: "现场主管", story: "作为现场主管，我希望有异常来源总览页，按来源查看触发条件、追溯键和处理边界。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US145, requirement_ids: [R133], task_ids: [F093], module: "异常闭环", role: "PM", story: "作为 PM，我希望能从异常复核页进入异常来源详情，查看来源解释和暂不实现范围。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US146, requirement_ids: [R134], task_ids: [Q020], module: "质量与交付", role: "QA", story: "作为 QA，我希望对班次类型、导入模板和异常来源做验收收口，确认页面、导航、测试和边界未越界。", task_type: "qa", priority: "P1", status: "done"}
acceptance:
  - "班次类型展示来自本地模型，不执行班次规则计算、排班生成或主数据 CRUD。"
  - "导入模板展示本地字段和校验口径，不执行真实上传、导入、批量或修复。"
  - "异常来源展示本地解释和追溯键，不执行真实异常计算、复核提交、审批或权限。"
  - "`node --experimental-strip-types --test scripts/tests/shift-type-catalog.test.mjs`、`node --experimental-strip-types --test scripts/tests/import-template-guide.test.mjs`、`node --experimental-strip-types --test scripts/tests/anomaly-source-drilldown.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US147-US156 - 导入批次、字段映射和复核时间线

```yaml
stories:
  - {id: US147, requirement_ids: [R135], task_ids: [F094], module: "导入批次", role: "数据管理员", story: "作为数据管理员，我希望导入批次历史有本地模型和测试，以便查看批次状态、成功/失败行和错误分布。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US148, requirement_ids: [R136], task_ids: [F095], module: "导入批次", role: "数据管理员", story: "作为数据管理员，我希望有导入批次历史只读页，查看上传/导入结果如何被追溯。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US149, requirement_ids: [R137], task_ids: [F096], module: "导航", role: "PM", story: "作为 PM，我希望侧边栏能直接进入导入批次历史，以便本地验收时不用记 URL。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US150, requirement_ids: [R138], task_ids: [F097], module: "字段映射", role: "数据管理员", story: "作为数据管理员，我希望字段映射预览有本地模型和测试，以便确认模板字段如何映射到生产雏形对象。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US151, requirement_ids: [R139], task_ids: [F098], module: "字段映射", role: "数据管理员", story: "作为数据管理员，我希望有字段映射预览只读页，查看源字段、目标字段、转换说明和校验状态。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US152, requirement_ids: [R140], task_ids: [F099], module: "导航", role: "PM", story: "作为 PM，我希望侧边栏字段映射入口进入预览页，以便验收导入准备口径。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US153, requirement_ids: [R141], task_ids: [F100], module: "异常闭环", role: "现场主管", story: "作为现场主管，我希望异常复核状态时间线有本地模型和测试，以便理解异常闭环状态流。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US154, requirement_ids: [R142], task_ids: [F101], module: "异常闭环", role: "现场主管", story: "作为现场主管，我希望有异常复核状态时间线只读页，查看异常从识别到关闭的状态解释。", task_type: "frontend", priority: "P0", status: "done"}
  - {id: US155, requirement_ids: [R143], task_ids: [F102], module: "异常闭环", role: "PM", story: "作为 PM，我希望异常复核页能进入状态时间线，以便从复核总览查看闭环解释。", task_type: "frontend", priority: "P1", status: "done"}
  - {id: US156, requirement_ids: [R144], task_ids: [Q021], module: "质量与交付", role: "QA", story: "作为 QA，我希望对导入批次、字段映射和复核时间线做验收收口，确认页面、导航、测试和边界未越界。", task_type: "qa", priority: "P1", status: "done"}
acceptance:
  - "导入批次展示来自本地模型，不执行真实上传、导入、批量或失败行写库。"
  - "字段映射展示本地预览，不执行保存、转换、权限或审批。"
  - "复核时间线展示本地状态解释，不执行真实复核提交、审批、权限或生产公式。"
  - "`node --experimental-strip-types --test scripts/tests/import-batch-history.test.mjs`、`node --experimental-strip-types --test scripts/tests/field-mapping-preview.test.mjs`、`node --experimental-strip-types --test scripts/tests/review-status-timeline.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US157-US166 - 数据质量分组、导入问题钻取和生产雏形验收清单

```yaml
stories:
  - id: US157
    requirement_ids: [R145]
    task_ids: [F103]
    module: "数据质量"
    role: "数据管理员"
    story: "作为数据管理员，我希望数据质量问题可按业务原因分组，以便从导入批次快速定位一类问题的影响面。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US158
    requirement_ids: [R146]
    task_ids: [F104]
    module: "数据质量"
    role: "数据管理员"
    story: "作为数据管理员，我希望有数据质量分组总览页，查看每组问题数量、风险等级和责任角色。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US159
    requirement_ids: [R147]
    task_ids: [F105]
    module: "数据质量"
    role: "数据管理员"
    story: "作为数据管理员，我希望进入单个质量分组详情，查看关联问题、来源模板和处理边界。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US160
    requirement_ids: [R148]
    task_ids: [F106]
    module: "数据质量"
    role: "PM"
    story: "作为 PM，我希望数据质量中心能进入分组视图，以便按业务原因验收问题定位能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US161
    requirement_ids: [R149]
    task_ids: [F107]
    module: "导入批次"
    role: "数据管理员"
    story: "作为数据管理员，我希望导入批次详情中的质量问题可以钻取到数据质量详情，以便追溯失败行原因。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US162
    requirement_ids: [R150]
    task_ids: [F108]
    module: "生产雏形"
    role: "QA"
    story: "作为 QA，我希望生产雏形验收清单有本地模型和测试，以便确认第一阶段可导入、可查看、可对比、可定位异常。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US163
    requirement_ids: [R151]
    task_ids: [F109]
    module: "生产雏形"
    role: "QA"
    story: "作为 QA，我希望有生产雏形验收清单只读页，按业务主线查看已覆盖、部分覆盖和暂缓能力。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US164
    requirement_ids: [R152]
    task_ids: [F110]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总览页提供验收清单入口，以便从生产雏形合同直接进入阶段验收。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US165
    requirement_ids: [R153]
    task_ids: [F111]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入生产雏形验收清单，以便本地验收时不需要记 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US166
    requirement_ids: [R154]
    task_ids: [Q022]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对数据质量分组、导入批次钻取和生产雏形验收清单做收口，确认页面、导航、测试和边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量分组展示来自本地模型，不执行真实修复、审批、权限、导出或批量。"
  - "导入批次详情能从质量问题 ID 链接到数据质量详情。"
  - "生产雏形验收清单覆盖第一阶段业务主线，并明确暂缓能力。"
  - "`node --experimental-strip-types --test scripts/tests/data-quality-groups.test.mjs`、`node --experimental-strip-types --test scripts/tests/production-mvp-acceptance.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US167-US176 - 质量反查、验收缺口 drilldown 和生产雏形总进度

```yaml
stories:
  - id: US167
    requirement_ids: [R155]
    task_ids: [F112]
    module: "数据质量"
    role: "数据管理员"
    story: "作为数据管理员，我希望单个质量问题能反查所属分组，以便从问题详情回到业务原因视角。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US168
    requirement_ids: [R156]
    task_ids: [F113]
    module: "数据质量"
    role: "数据管理员"
    story: "作为数据管理员，我希望数据质量详情页展示所属分组和分组入口，以便定位同类问题。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US169
    requirement_ids: [R157]
    task_ids: [F114]
    module: "数据质量"
    role: "PM"
    story: "作为 PM，我希望数据质量中心能显示分组覆盖摘要，以便知道问题清单是否已被业务原因覆盖。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US170
    requirement_ids: [R158]
    task_ids: [F115]
    module: "生产雏形"
    role: "QA"
    story: "作为 QA，我希望验收清单支持单项 lookup 和缺口摘要，以便从总览进入具体业务主线。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US171
    requirement_ids: [R159]
    task_ids: [F116]
    module: "生产雏形"
    role: "QA"
    story: "作为 QA，我希望进入验收清单单项详情，查看验收证据、暂缓能力和后续开发缺口。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US172
    requirement_ids: [R160]
    task_ids: [F117]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望验收清单总览的每项都能跳到详情页，以便逐条验收。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US173
    requirement_ids: [R161]
    task_ids: [F118]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总进度有本地模型和测试，以便集中查看已完成入口和仍缺能力。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US174
    requirement_ids: [R162]
    task_ids: [F119]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望有生产雏形总进度只读页，并能从生产雏形总览进入。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US175
    requirement_ids: [R163]
    task_ids: [F120]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入生产雏形总进度，以便连续验收不需要记 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US176
    requirement_ids: [R164]
    task_ids: [Q023]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对质量问题反查分组、验收单项详情和生产雏形总进度做收口，确认页面、导航、测试和边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据质量详情能展示所属分组，并可跳回分组详情。"
  - "验收清单总览能进入单项详情，详情展示证据页、暂缓能力和后续缺口。"
  - "生产雏形总进度集中展示已完成本地入口和仍缺生产能力。"
  - "`node --experimental-strip-types --test scripts/tests/data-quality-group-links.test.mjs`、`node --experimental-strip-types --test scripts/tests/production-mvp-progress.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US197-US206 - 预测版本与实际日志对齐准备

```yaml
stories:
  - id: US197
    requirement_ids: [R185]
    task_ids: [F139]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望预测版本与实际日志对齐有本地模型和测试，以便把第二批对齐准备拆成可验收步骤。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US198
    requirement_ids: [R186]
    task_ids: [F140]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望有预测与实际对齐准备总览页，查看预测版本、登录日志、状态日志和对比基准的准备顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US199
    requirement_ids: [R187]
    task_ids: [F141]
    module: "生产雏形"
    role: "数据管理员"
    story: "作为数据管理员，我希望进入单个对齐准备步骤，查看输入、输出、依赖、验收口径和暂缓能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US200
    requirement_ids: [R188]
    task_ids: [F142]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望需求预测验收详情能进入对齐准备步骤，以便确认预测版本和调整记录前置条件。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US201
    requirement_ids: [R189]
    task_ids: [F143]
    module: "生产雏形"
    role: "现场主管"
    story: "作为现场主管，我希望登录/状态验收详情能进入对齐准备步骤，以便确认实际日志接入和状态映射边界。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US202
    requirement_ids: [R190]
    task_ids: [F144]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望差异对比验收详情能进入对齐准备步骤，以便从异常识别回到预测、排班、登录和状态的基准条件。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US203
    requirement_ids: [R191]
    task_ids: [F145]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望缺口路线图第二批能进入对齐准备页，以便从路线图继续推进下一批。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US204
    requirement_ids: [R192]
    task_ids: [F146]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总览和总进度能进入对齐准备页，以便从总览视角进入第二批准备。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US205
    requirement_ids: [R193]
    task_ids: [F147]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入预测与实际对齐准备页，以便连续验收不用记 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US206
    requirement_ids: [R194]
    task_ids: [Q026]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望预测与实际对齐准备批次做收口，确认页面、导航、测试和 no-integration 边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "预测与实际对齐准备模型只定义准备步骤，不接真实预测、登录或状态接口。"
  - "总览和步骤详情能说明输入、输出、依赖、验收口径、证据页和暂缓能力。"
  - "需求预测、登录/状态、差异对比验收详情、缺口路线图、生产雏形总览、总进度和侧边栏能进入对齐准备页。"
  - "`node --experimental-strip-types --test scripts/tests/production-mvp-alignment-readiness.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US187-US196 - 数据导入与主数据闭环准备

```yaml
stories:
  - id: US187
    requirement_ids: [R175]
    task_ids: [F130]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望数据底座准备有本地模型和测试，以便把上传/导入、字段映射和主数据闭环拆成可验收准备步骤。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US188
    requirement_ids: [R176]
    task_ids: [F131]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望有数据底座准备总览页，查看第一批数据闭环准备事项、顺序和硬边界。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US189
    requirement_ids: [R177]
    task_ids: [F132]
    module: "生产雏形"
    role: "数据管理员"
    story: "作为数据管理员，我希望进入单个数据底座准备步骤，查看输入、输出、依赖、验收口径和暂缓能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US190
    requirement_ids: [R178]
    task_ids: [F133]
    module: "生产雏形"
    role: "数据管理员"
    story: "作为数据管理员，我希望上传/导入验收详情能进入数据底座准备步骤，以便从验收项进入下一批准备范围。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US191
    requirement_ids: [R179]
    task_ids: [F134]
    module: "生产雏形"
    role: "数据管理员"
    story: "作为数据管理员，我希望主数据验收详情能进入数据底座准备步骤，以便确认坐席、职场、供应商和绑定关系的闭环前置条件。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US192
    requirement_ids: [R180]
    task_ids: [F135]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望缺口路线图的推荐下一批能进入数据底座准备页，以便从路线图进入执行准备视角。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US193
    requirement_ids: [R181]
    task_ids: [F136]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总览页能进入数据底座准备页，以便从合同总览进入第一批数据闭环准备。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US194
    requirement_ids: [R182]
    task_ids: [F137]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总进度页能进入数据底座准备页，以便从进度视图进入推荐下一批。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US195
    requirement_ids: [R183]
    task_ids: [F138]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入数据底座准备页，以便连续验收不用记 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US196
    requirement_ids: [R184]
    task_ids: [Q025]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望数据底座准备批次做收口，确认页面、导航、测试和 no-database 边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "数据底座准备模型只定义后续准备步骤，不执行真实上传、导入、CRUD、冻结解冻或写库。"
  - "总览和步骤详情能说明输入、输出、依赖、验收口径、证据页和暂缓能力。"
  - "上传/导入验收详情、主数据验收详情、缺口路线图、生产雏形总览、总进度和侧边栏能进入数据底座准备页。"
  - "`node --experimental-strip-types --test scripts/tests/production-mvp-data-foundation.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US177-US186 - 缺口优先级和后续批次路线图

```yaml
stories:
  - id: US177
    requirement_ids: [R165]
    task_ids: [F121]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形缺口有优先级模型和测试，以便把仍缺能力按业务价值和风险排序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US178
    requirement_ids: [R166]
    task_ids: [F122]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望有生产雏形缺口总览页，查看每个缺口的优先级、原因和验收入口。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US179
    requirement_ids: [R167]
    task_ids: [F123]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望进入单个缺口详情，查看业务目的、后续验收口径和暂不实现边界。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US180
    requirement_ids: [R168]
    task_ids: [F124]
    module: "生产雏形"
    role: "QA"
    story: "作为 QA，我希望验收清单详情能跳到相关缺口，以便从验收问题进入后续开发线索。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US181
    requirement_ids: [R169]
    task_ids: [F125]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总进度能挂载缺口总览入口，以便从进度页进入后续拆批视角。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US182
    requirement_ids: [R170]
    task_ids: [F126]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望后续开发批次建议有本地模型和测试，以便把缺口组织成可执行顺序。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US183
    requirement_ids: [R171]
    task_ids: [F127]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望缺口路线图展示推荐批次、依赖和暂不建议事项。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US184
    requirement_ids: [R172]
    task_ids: [F128]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入生产雏形缺口总览，以便连续验收不需要记 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US185
    requirement_ids: [R173]
    task_ids: [F129]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总览页挂载缺口总览入口，以便从合同总览进入后续开发视角。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US186
    requirement_ids: [R174]
    task_ids: [Q024]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望对缺口优先级、缺口详情和后续批次路线图做收口，确认页面、导航、测试和边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "缺口总览和详情来自本地模型，不创建真实工单或生产任务。"
  - "验收清单详情和总进度页能进入相关缺口。"
  - "缺口路线图展示推荐批次、依赖和暂不建议事项。"
  - "`node --experimental-strip-types --test scripts/tests/production-mvp-gap-roadmap.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US207-US216 - 异常识别与复核准备

```yaml
stories:
  - id: US207
    requirement_ids: [R195]
    task_ids: [F148]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望异常识别与复核准备有本地模型和测试，以便把异常类型、触发条件、归因字段和复核状态拆成可验收准备步骤。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US208
    requirement_ids: [R196]
    task_ids: [F149]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望有异常识别与复核准备总览页，查看各类异常准备事项、推荐顺序和硬边界。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US209
    requirement_ids: [R197]
    task_ids: [F150]
    module: "生产雏形"
    role: "运营专员"
    story: "作为运营专员，我希望进入单个异常准备步骤，查看输入、输出、触发口径、复核字段、证据页和暂缓能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US210
    requirement_ids: [R198]
    task_ids: [F151]
    module: "生产雏形"
    role: "QA"
    story: "作为 QA，我希望异常识别验收详情能进入异常识别与复核准备步骤，以便从验收项进入后续开发线索。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US211
    requirement_ids: [R199]
    task_ids: [F152]
    module: "异常闭环"
    role: "运营专员"
    story: "作为运营专员，我希望异常复核总览页能进入异常识别与复核准备页，以便从当前复核演示进入生产雏形准备口径。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US212
    requirement_ids: [R200]
    task_ids: [F153]
    module: "异常闭环"
    role: "运营专员"
    story: "作为运营专员，我希望异常来源页能进入异常识别与复核准备页，以便理解来源链路如何支撑异常归因。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US213
    requirement_ids: [R201]
    task_ids: [F154]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望缺口路线图第三批能进入异常识别与复核准备页，以便从路线图继续推进下一批。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US214
    requirement_ids: [R202]
    task_ids: [F155]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总览和总进度能进入异常识别与复核准备页，以便从总览视角进入第三批准备。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US215
    requirement_ids: [R203]
    task_ids: [F156]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入异常识别与复核准备页，以便连续验收不用记 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US216
    requirement_ids: [R204]
    task_ids: [Q027]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望异常识别与复核准备批次做收口，确认页面、导航、测试和 no-approval/no-formula 边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "异常识别与复核准备模型只定义准备步骤，不执行真实规则识别、复核提交、审批或生产公式。"
  - "总览和步骤详情能说明异常类型、触发口径、复核字段、证据页和暂缓能力。"
  - "异常识别验收详情、异常复核总览、异常来源页、缺口路线图、生产雏形总览、总进度和侧边栏能进入准备页。"
  - "`node --experimental-strip-types --test scripts/tests/production-mvp-anomaly-triage-readiness.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US406-US409 - 异常闭环准备度摘要

```yaml
stories:
  - id: US406
    requirement_ids: [R394, R395]
    task_ids: [F310]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望在小组成员单日矩阵看到异常闭环准备度摘要，以便先判断哪些异常还缺材料、主管判断或数据核对。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US407
    requirement_ids: [R395]
    task_ids: [F311]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望闭环准备度摘要能指出下一候选异常和阻塞原因，以便按业务优先级补齐闭环前置条件。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US408
    requirement_ids: [R396]
    task_ids: [F312]
    module: "履约日历"
    role: "PM"
    story: "作为 PM，我希望闭环准备度保持只读查看口径，以便不误导为真实提交、审批、导出、批量或自动处理能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US409
    requirement_ids: [R397]
    task_ids: [Q063]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望异常闭环准备度摘要批次完成收口，确认模型、页面和 no-action 边界均通过验证。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "小组成员单日矩阵侧栏展示闭环准备度摘要。"
  - "摘要包含可闭环、未就绪、待补材料、待主管判断、待数据核对、下一候选异常和阻塞原因。"
  - "页面不出现提交、保存、审批、导出、批量、自动处理或内部项目管理口径。"
  - "`node --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs scripts/tests/product-navigation-business-only.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US230 - 履约日历团队小组个人下钻

```yaml
stories:
  - id: US230
    requirement_ids: [R218]
    task_ids: [F169]
    module: "履约日历"
    role: "现场主管"
    story: "作为现场主管，我希望从履约日历查看团队周履约、小组周履约和小组成员单日三轨矩阵，以便定位具体人员、日期和时段的排班、登录、状态不一致。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
acceptance:
  - "`/person-timeline` 首屏标题为履约日历，并展示团队周视图、本周概览和业务筛选口径。"
  - "团队周视图可以下钻到小组周视图，小组某天可以下钻到成员单日矩阵。"
  - "成员矩阵默认按人员展示排班、登录、状态三条横向子轨，并能进入个人单日三轨详情。"
  - "产品 UI 不出现 PRD、Gate、验收清单、暂不实现、准备状态、数据接入状态等内部执行口径。"
  - "`node --experimental-strip-types --test scripts/tests/person-timeline.test.mjs scripts/tests/product-ui-copy-audit.test.mjs` 和 `bash scripts/check.sh` 通过。"
```

### US217-US226 - 发布冻结与权限审计边界准备

```yaml
stories:
  - id: US217
    requirement_ids: [R205]
    task_ids: [F157]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望发布冻结与权限审计边界准备有本地模型和测试，以便把发布态、冻结解冻、权限边界、审计留痕和导出批量暂缓拆成可验收准备步骤。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US218
    requirement_ids: [R206]
    task_ids: [F158]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望有发布冻结与权限审计边界准备总览页，查看治理边界准备事项、推荐顺序和硬停条件。"
    task_type: "frontend"
    priority: "P0"
    status: "done"
  - id: US219
    requirement_ids: [R207]
    task_ids: [F159]
    module: "生产雏形"
    role: "运营负责人"
    story: "作为运营负责人，我希望进入单个治理准备步骤，查看输入、输出、触发条件、控制字段、证据页和暂缓能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US220
    requirement_ids: [R208]
    task_ids: [F160]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望排班发布审批缺口详情能进入治理边界准备步骤，以便从缺口进入发布态和冻结口径准备。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US221
    requirement_ids: [R209]
    task_ids: [F161]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望权限审计缺口详情能进入治理边界准备步骤，以便清楚权限、审计、导出和批量硬边界。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US222
    requirement_ids: [R210]
    task_ids: [F162]
    module: "生产雏形"
    role: "QA"
    story: "作为 QA，我希望人员排班和主数据验收详情能进入治理边界准备页，以便确认发布、冻结和有效期能力仍是后续 Gate。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US223
    requirement_ids: [R211]
    task_ids: [F163]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望缺口路线图第三批能进入发布冻结与权限审计边界准备页，以便从路线图继续推进治理边界。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US224
    requirement_ids: [R212]
    task_ids: [F164]
    module: "生产雏形"
    role: "PM"
    story: "作为 PM，我希望生产雏形总览和总进度能进入治理边界准备页，以便从总览视角进入后续治理能力。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US225
    requirement_ids: [R213]
    task_ids: [F165]
    module: "导航"
    role: "PM"
    story: "作为 PM，我希望侧边栏能直接进入发布冻结与权限审计边界准备页，以便连续验收不用记 URL。"
    task_type: "frontend"
    priority: "P1"
    status: "done"
  - id: US226
    requirement_ids: [R214]
    task_ids: [Q028]
    module: "质量与交付"
    role: "QA"
    story: "作为 QA，我希望发布冻结与权限审计边界准备批次做收口，确认页面、导航、测试和 no-approval/no-permission/no-export 边界未越界。"
    task_type: "qa"
    priority: "P1"
    status: "done"
acceptance:
  - "治理准备模型只定义准备步骤，不执行真实发布、审批、权限、审计写入、导出或批量。"
  - "总览和步骤详情能说明触发条件、控制字段、证据页、暂缓能力和硬停边界。"
  - "发布审批缺口、权限审计缺口、人员排班验收、主数据验收、缺口路线图、生产雏形总览、总进度和侧边栏能进入准备页。"
  - "`node --experimental-strip-types --test scripts/tests/production-mvp-governance-readiness.test.mjs` 和 `bash scripts/check.sh` 通过。"
```
