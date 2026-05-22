# Raw Requirements

本文件记录 PM 输入的原始需求。原始需求不等同于开发任务，必须先经过用户故事拆分、依赖检查和 Gate Plan。

## Schema

```yaml
- id: R001
  module: "模块名称"
  description: "PM 原始需求描述"
  source: "PM / 访谈 / 文档 / 会议"
  submitted_at: "YYYY-MM-DD"
  version: "1.0"
  status: "draft"
  notes: "补充说明"
```

## Requirements

### R338-R341 - 异常超时与优先级升级

```yaml
requirements:
  - id: R338
    module: "履约日历"
    description: "小组成员单日矩阵中的异常队列需要展示等待时长和超时等级，帮助现场主管识别已拖久的异常。"
  - id: R339
    module: "履约日历"
    description: "异常队列模型需要返回升级提示，包括识别时间、等待时长、超时等级、升级原因、关注角色和下一复核窗口。"
  - id: R340
    module: "履约日历"
    description: "异常超时与升级仅作为查看和排序口径，不提供提交、保存、审批、导出、批量或状态写入能力。"
  - id: R341
    module: "质量与交付"
    description: "异常超时与优先级升级完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM confirmed continued supervisor-oriented development on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端查看链路、排序口径和模型测试；不新增页面、导航、数据库、真实接口、权限、提交、保存、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R334-R337 - 异常证据关联数据质量

```yaml
requirements:
  - id: R334
    module: "履约日历"
    description: "小组成员单日矩阵中的异常证据需要关联已有数据质量问题，帮助现场主管判断是否需要先核对数据。"
  - id: R335
    module: "履约日历"
    description: "异常队列模型需要返回关联数据质量问题、匹配记录、核对字段、关联原因和详情链接。"
  - id: R336
    module: "履约日历"
    description: "异常到数据质量的关联仅作为查看链路，不提供数据修复、提交、保存、审批、导出、批量或状态写入能力。"
  - id: R337
    module: "质量与交付"
    description: "异常证据关联数据质量完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM approved next supervisor-oriented slice on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端查看链路和模型测试；复用现有数据质量问题，不新增页面、导航、数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R330-R333 - 小组复核负载汇总

```yaml
requirements:
  - id: R330
    module: "履约日历"
    description: "小组成员单日矩阵需要展示复核负载汇总，帮助现场主管判断当天异常主要集中在哪类处理口径。"
  - id: R331
    module: "履约日历"
    description: "小组矩阵模型需要返回复核负载摘要，包括总待复核、待主管判断、需补材料、需数据核对、最高负载分组和下一优先处理建议。"
  - id: R332
    module: "履约日历"
    description: "复核负载汇总仅作为查看和排序口径，不提供提交、保存、审批、导出、批量或状态写入能力。"
  - id: R333
    module: "质量与交付"
    description: "小组复核负载汇总完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM requested continued supervisor-oriented business development on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端查看链路和模型测试；不新增页面、导航、数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R326-R329 - 个人详情复核口径同步

```yaml
requirements:
  - id: R326
    module: "履约日历"
    description: "个人单日三轨详情需要在从异常队列下钻时展示同一异常的处理分组、复核清单和当前判断。"
  - id: R327
    module: "履约日历"
    description: "个人日视图模型需要提供与异常队列一致的复核上下文，包含异常键、处理分组、复核清单和当前判断。"
  - id: R328
    module: "履约日历"
    description: "个人详情复核口径仅作为查看信息，不提供提交、保存、审批、导出、批量或状态写入能力。"
  - id: R329
    module: "质量与交付"
    description: "个人详情复核口径同步完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM requested continued business function development on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端查看链路和模型测试；不新增页面、导航、数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R322-R325 - 主管异常队列分组

```yaml
requirements:
  - id: R322
    module: "履约日历"
    description: "小组成员单日矩阵异常侧栏需要按主管处理分组展示异常队列，帮助主管先看需补材料、待主管判断和需数据核对的事项。"
  - id: R323
    module: "履约日历"
    description: "异常队列模型需要为每个异常提供主管处理分组，并在队列摘要中统计各分组数量。"
  - id: R324
    module: "履约日历"
    description: "主管处理分组筛选需要复用现有履约日历页面和 URL 参数，不新增页面、导航、提交、保存、审批、导出、批量或状态写入能力。"
  - id: R325
    module: "质量与交付"
    description: "主管异常队列分组完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM requested continued business function development on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端查看链路和模型测试；不新增页面、导航、数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R318-R321 - 主管异常复核清单

```yaml
requirements:
  - id: R318
    module: "履约日历"
    description: "小组成员单日矩阵异常侧栏需要展示主管复核清单，让主管看到哪些材料已齐、哪些材料仍需补充。"
  - id: R319
    module: "履约日历"
    description: "异常队列模型需要为每个异常生成复核清单字段，包含清单项、状态、责任角色和判断影响。"
  - id: R320
    module: "履约日历"
    description: "复核清单需要给出当前业务判断，不提供提交、保存、审批、导出、批量或状态写入能力。"
  - id: R321
    module: "质量与交付"
    description: "主管异常复核清单完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM requested continued business function development on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端查看链路和模型测试；不新增页面、导航、数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R314-R317 - 主管异常处理结论建议

```yaml
requirements:
  - id: R314
    module: "履约日历"
    description: "小组成员单日矩阵异常侧栏需要展示处理结论建议，让主管看到建议结论、需核材料和风险提示。"
  - id: R315
    module: "履约日历"
    description: "异常队列模型需要为每个异常生成处理结论建议字段，包含建议结论、需核材料、沟通对象、负责角色、下一复核点和未闭环风险。"
  - id: R316
    module: "履约日历"
    description: "处理结论建议需要保留业务查看口径，不提供提交、保存、审批、导出、批量或状态写入能力。"
  - id: R317
    module: "质量与交付"
    description: "主管异常处理结论建议完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM requested continued business function development on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端查看链路和模型测试；不新增页面、导航、数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R310-R313 - 个人三轨排班来源反查

```yaml
requirements:
  - id: R310
    module: "履约日历"
    description: "个人单日三轨详情需要展示排班草稿来源，让主管能从个人履约问题反查对应排班计划和人员排班明细。"
  - id: R311
    module: "履约日历"
    description: "个人排班来源需要展示班次窗口、技能、排班明细编号和对应计划入口。"
  - id: R312
    module: "履约日历"
    description: "个人排班来源需要展示该人员相关 0.5h 时段的汇总人数、明细人数和差异，帮助定位需核对时段。"
  - id: R313
    module: "质量与交付"
    description: "个人三轨排班来源反查完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM requested continued business function development on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端查看链路和模型测试；不新增页面、导航、数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R306-R309 - 排班草稿履约日历下钻

```yaml
requirements:
  - id: R306
    module: "排班计划"
    description: "排班草稿人员联动中的关联人员需要能下钻到履约日历个人单日三轨详情，方便从排班差异继续核对登录和状态。"
  - id: R307
    module: "排班计划"
    description: "人员排班时段追溯模型需要为每个关联人员提供稳定的履约日历个人详情链接。"
  - id: R308
    module: "排班计划"
    description: "排班草稿人员联动页面的人员入口需要使用业务文案和普通下钻交互，不暴露内部执行口径。"
  - id: R309
    module: "质量与交付"
    description: "排班草稿履约日历下钻完成后需要 QA 收口，确认模型测试、页面 smoke、文案审计和 no-action 边界。"
source: "PM requested continued business function development on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端下钻链接和模型测试；不新增页面、导航、数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R302-R305 - 排班草稿人员明细联动

```yaml
requirements:
  - id: R302
    module: "排班计划"
    description: "排班草稿编辑页需要展示人员级排班明细与 0.5h 汇总的联动关系，让排班运营能看到每个时段已排人数背后的关联人员。"
  - id: R303
    module: "排班计划"
    description: "排班草稿需要按 0.5h 时段核对汇总已排人数和人员明细人数，标出人数不一致的时段。"
  - id: R304
    module: "排班计划"
    description: "排班草稿需要提供人员明细联动摘要，展示关联人员数和需核对时段数。"
  - id: R305
    module: "质量与交付"
    description: "排班草稿人员明细联动完成后需要 QA 收口，确认模型测试、页面文案、no-database/no-approval/no-export 边界和标准检查。"
source: "PM requested continuous development of remaining business functions on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端排班草稿核对能力和模型测试；不新增数据库、真实接口、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R298-R301 - 产品语义清理

```yaml
requirements:
  - id: R298
    module: "业务界面收口"
    description: "产品页面需要清理本地 MVP、任务编号、后续扩展、只读处理记录等内部过程词。"
  - id: R299
    module: "业务界面收口"
    description: "侧边栏和页面标签需要清理 P0/P1、新、示例等项目管理或样例口径。"
  - id: R300
    module: "排班计划"
    description: "排班草稿新建和编辑页面需要改为业务语言，避免把当前实现边界写进产品 UI。"
  - id: R301
    module: "质量与交付"
    description: "产品语义清理完成后需要 QA 收口，确认产品 UI 不暴露内部过程词或假功能解释。"
source: "PM requested rapid cleanup of unfinished or fake-function product semantics on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只清理现有产品 UI 文案和回归测试；不新增页面，不实现真实上传、审批、导出、批量、数据库、权限、真实接口、自动排班、生产公式、结算或收费因子。"
```

### R294-R297 - 主管跟进汇总只读视图

```yaml
requirements:
  - id: R294
    module: "履约日历"
    description: "异常队列当前项需要展示主管跟进状态，说明跟进人、跟进状态、下一核对时间和当前重点。"
  - id: R295
    module: "履约日历"
    description: "异常队列当前项需要展示跟进缺口清单，说明还缺哪些说明、记录和复核结论。"
  - id: R296
    module: "履约日历"
    description: "异常队列当前项需要展示小组跟进汇总，说明同组待跟进数量、高优先项和当前异常在队列中的位置。"
  - id: R297
    module: "质量与交付"
    description: "主管跟进汇总只读视图完成后需要 QA 收口，确认跟进状态、缺口清单、小组汇总和业务文案可验证。"
source: "PM requested continuing supervisor-oriented business closure on 2026-05-22"
submitted_at: "2026-05-22"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示和模型测试；不实现处理提交、审批、权限、导出、批量、数据库、真实接口、自动排班、生产公式、结算或收费因子。"
```

### R290-R293 - 数据质量修复前置只读视图

```yaml
requirements:
  - id: R290
    module: "履约日历"
    description: "异常队列当前项需要展示数据质量修复前置判断，说明是否需要数据管理员介入、原因和优先级。"
  - id: R291
    module: "履约日历"
    description: "异常队列当前项需要展示修复准备材料，列出需要准备的记录、字段和说明材料。"
  - id: R292
    module: "履约日历"
    description: "异常队列当前项需要展示影响范围摘要，说明数据问题影响个人、班次、当日矩阵或后续对比。"
  - id: R293
    module: "质量与交付"
    description: "数据质量修复前置只读视图完成后需要 QA 收口，确认判断、准备材料、影响范围和业务文案可验证。"
source: "PM requested continuing production-MVP local business closure on 2026-05-21"
submitted_at: "2026-05-21"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示和模型测试；不实现真实修复提交、审批、权限、导出、批量、数据库、真实接口、自动排班、生产公式、结算或收费因子。"
```

### R286-R289 - 主管异常交接只读闭环

```yaml
requirements:
  - id: R286
    module: "履约日历"
    description: "异常队列当前项需要展示处理结果归类，帮助主管判断问题属于到岗核对、状态核对还是数据核对。"
  - id: R287
    module: "履约日历"
    description: "异常队列当前项需要展示主管交接摘要，说明交接对象、摘要和待核对问题。"
  - id: R288
    module: "履约日历"
    description: "异常队列当前项需要展示数据核对前置提示，列出相关记录和字段，不做真实修复。"
  - id: R289
    module: "质量与交付"
    description: "主管异常交接只读闭环完成后需要 QA 收口，确认归类、交接、数据核对提示和业务文案可验证。"
source: "PM requested continuing supervisor-oriented business closure on 2026-05-21"
submitted_at: "2026-05-21"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示和模型测试；不实现处理提交、审批、权限、导出、批量、数据库、真实接口、自动排班、生产公式、结算或收费因子。"
```

### R245-R280 - 连续大模块业务迭代池

```yaml
requirements:
  - {id: R245, module: "业务界面收口", description: "经营总览只展示履约、供需、异常和质量风险业务指标，不混入内部执行信息。"}
  - {id: R246, module: "业务界面收口", description: "侧边栏只保留业务入口，移除内部执行、验收、准备和 Gate 类入口。"}
  - {id: R247, module: "业务界面收口", description: "产品 UI 需要全量审计并清理 PRD、Gate、Story、验收清单、待实现、准备等内部词。"}
  - {id: R248, module: "业务界面收口", description: "经营总览指标需要下钻到履约日历、异常中心和数据质量业务链路。"}
  - {id: R249, module: "业务界面收口", description: "经营总览需要展示今日和本周履约风险摘要。"}
  - {id: R250, module: "业务界面收口", description: "业务界面收口批次完成后需要 QA 收口，确认产品 UI 只保留业务语言。"}
  - {id: R251, module: "履约日历", description: "小组周视图需要展示风险摘要侧栏，帮助主管判断哪组、哪天、哪人风险最高。"}
  - {id: R252, module: "履约日历", description: "小组成员周矩阵需要展示本周待看清单，承接缺口和异常视图。"}
  - {id: R253, module: "履约日历", description: "小组异常队列需要展示三轨证据卡，列出命中的排班、登录、状态事件和时间段。"}
  - {id: R254, module: "履约日历", description: "小组异常队列需要展示排序依据，说明为什么当前异常优先处理。"}
  - {id: R255, module: "履约日历", description: "个人单日详情需要保留从异常队列进入时的返回上下文。"}
  - {id: R256, module: "履约日历", description: "履约日历主管处理链路批次完成后需要 QA 收口。"}
  - {id: R257, module: "排班计划", description: "排班计划详情需要展示人员级排班明细。"}
  - {id: R258, module: "排班计划", description: "人员级排班明细需要展示员工、供应商、职场、项目、技能、班次和异常标记。"}
  - {id: R259, module: "排班计划", description: "0.5h 时段汇总需要能追溯到对应人员列表。"}
  - {id: R260, module: "排班计划", description: "人员级排班明细需要能跳到员工当天履约时间轴。"}
  - {id: R261, module: "排班计划", description: "排班缺口需要展示涉及的具体人员和班次。"}
  - {id: R262, module: "排班计划", description: "人员级排班与 0.5h 汇总追溯批次完成后需要 QA 收口。"}
  - {id: R263, module: "需求预测", description: "需求预测需要按职场、项目、时段、技能组和等级展示。"}
  - {id: R264, module: "需求预测", description: "预测 vs 排班对比需要展示缺口和超排。"}
  - {id: R265, module: "需求预测", description: "预测 vs 排班对比需要展示无匹配技能组异常。"}
  - {id: R266, module: "需求预测", description: "供需对比需要能下钻到排班人员明细。"}
  - {id: R267, module: "需求预测", description: "预测版本和排班版本需要在只读对齐视图中展示。"}
  - {id: R268, module: "需求预测", description: "需求预测与排班对齐批次完成后需要 QA 收口。"}
  - {id: R269, module: "数据质量", description: "导入批次详情需要能跳转到相关数据质量问题。"}
  - {id: R270, module: "数据质量", description: "数据质量详情需要展示来源模板、字段、原值、错误码和影响对象。"}
  - {id: R271, module: "数据质量", description: "数据质量问题需要按业务原因分组。"}
  - {id: R272, module: "数据质量", description: "质量问题需要展示影响的排班、预测、登录或状态链路。"}
  - {id: R273, module: "数据质量", description: "导入批次需要展示失败行的业务影响摘要。"}
  - {id: R274, module: "数据质量", description: "导入批次与数据质量追溯批次完成后需要 QA 收口。"}
  - {id: R275, module: "主数据", description: "主数据关系页需要按员工展示供应商、职场、项目和技能绑定。"}
  - {id: R276, module: "主数据", description: "主数据关系页需要支持从异常员工反查绑定关系。"}
  - {id: R277, module: "主数据", description: "班次类型需要展示休息、饭点和计入口径。"}
  - {id: R278, module: "主数据", description: "主数据缺失异常需要能跳转到对应关系视图。"}
  - {id: R279, module: "主数据", description: "主数据关系需要展示有效期和状态。"}
  - {id: R280, module: "主数据", description: "主数据关系闭环批次完成后需要 QA 收口。"}
source: "PM confirmed continuous large module iteration on 2026-05-21"
submitted_at: "2026-05-21"
version: "1.0"
status: "planned"
notes: "这些需求组成后续执行池，不直接进入 current/active；每批执行前再按 3-5 个故事进入当前队列。全部保持本地前端或本地模型边界，不实现数据库、真实接口、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
```

### R282-R285 - 主管异常处理只读闭环

```yaml
requirements:
  - id: R282
    module: "履约日历"
    description: "小组成员单日矩阵需要展示主管处理建议分层，区分优先核对项、需补充信息和下一步沟通对象。"
  - id: R283
    module: "履约日历"
    description: "异常队列当前项需要展示三轨证据汇总，帮助主管快速判断异常来自排班、登录还是状态。"
  - id: R284
    module: "履约日历"
    description: "异常队列当前项需要展示只读处理记录，用于说明当前样例中已经记录的跟进过程，不执行真实提交。"
  - id: R285
    module: "质量与交付"
    description: "主管异常处理只读闭环完成后需要 QA 收口，确认处理建议、证据汇总、只读记录和 no-submit 边界可验证。"
source: "PM requested continuing supervisor-oriented business closure on 2026-05-21"
submitted_at: "2026-05-21"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示和模型测试；不实现处理提交、审批、权限、导出、批量、数据库、真实接口、自动排班、生产公式、结算或收费因子。"
```

### R281 - 大模块迭代池状态修复

```yaml
requirements:
  - id: R281
    module: "Harness"
    description: "开始连续大模块迭代前，需要修复旧批次 ready/done 状态漂移，并登记 36 个规划故事池但不把它们一次性放入 current/active。"
source: "PM confirmed one-time authorization for large module iteration on 2026-05-21"
submitted_at: "2026-05-21"
version: "1.0"
status: "split"
notes: "本项只做 Harness/state-hygiene 文档修复和规划登记，不改产品代码。"
```

### R242-R244 - 小组异常队列处理光标

```yaml
requirements:
  - id: R242
    module: "履约日历"
    description: "小组成员单日矩阵的异常队列需要展示当前选中异常在筛选队列中的位置，帮助主管知道处理进度。"
  - id: R243
    module: "履约日历"
    description: "小组异常队列需要支持在当前筛选结果中上一项、下一项查看，便于主管逐项核对。"
  - id: R244
    module: "履约日历"
    description: "当筛选结果没有待关注异常时，页面需要给出业务空态，不显示内部执行或开发过程语言。"
source: "PM requested continuous supervisor handling flow on 2026-05-21"
submitted_at: "2026-05-21"
version: "1.0"
status: "split"
notes: "本组只增强现有小组单日矩阵的显示型处理路径；不新增页面路由或左侧入口，不新增依赖，不实现数据库、权限、审批、处理提交、导出、批量、真实接口、自动排班或生产公式。"
```

### R239-R241 - 小组异常矩阵定位

```yaml
requirements:
  - id: R239
    module: "履约日历"
    description: "小组成员单日矩阵需要把选中异常定位到具体成员行，减少主管在矩阵里重新查找人员的成本。"
  - id: R240
    module: "履约日历"
    description: "选中异常需要高亮相关排班、登录、状态轨道切片，帮助主管直接看到异常证据来源。"
  - id: R241
    module: "履约日历"
    description: "矩阵定位需要跟随异常队列筛选和选中项变化，不新增处理、审批或提交动作。"
source: "PM requested continuous supervisor handling flow on 2026-05-21"
submitted_at: "2026-05-21"
version: "1.0"
status: "split"
notes: "本组只增强现有小组单日矩阵的查看定位；不新增页面路由或左侧入口，不新增依赖，不实现数据库、权限、审批、处理提交、导出、批量、真实接口、自动排班或生产公式。"
```

### R236-R238 - 小组异常队列汇总与筛选

```yaml
requirements:
  - id: R236
    module: "履约日历"
    description: "小组成员单日矩阵需要展示当天异常队列的汇总指标，帮助主管先判断问题构成。"
  - id: R237
    module: "履约日历"
    description: "小组异常队列需要支持按高优先级、登录缺口、状态不一致进行显示筛选。"
  - id: R238
    module: "履约日历"
    description: "筛选后当前异常解释需要跟随筛选队列变化，并保留个人详情入口。"
source: "PM requested continuous closeout of supervisor handling flow on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组只增强现有小组单日矩阵右侧面板；筛选只影响显示和下钻，不实现审批、处理提交、数据库、权限、导出、批量、真实接口、自动排班或生产公式。"
```

### R233-R235 - 小组异常优先队列

```yaml
requirements:
  - id: R233
    module: "履约日历"
    description: "小组成员单日矩阵需要汇总当天全部成员异常，形成主管可扫描的待关注异常队列。"
  - id: R234
    module: "履约日历"
    description: "待关注异常队列需要按业务风险排序，优先展示高优先级、影响时长更长的异常。"
  - id: R235
    module: "履约日历"
    description: "待关注异常队列需要能切换当前异常解释，并保留进入个人单日详情的入口。"
source: "PM requested continuous closeout of supervisor handling flow on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组只增强现有小组单日矩阵右侧面板；不新增页面路由或左侧入口，不新增依赖，不实现数据库、权限、审批、处理提交、导出、批量、真实接口、自动排班或生产公式。"
```

### R230-R232 - 小组异常解释侧栏

```yaml
requirements:
  - id: R230
    module: "履约日历"
    description: "小组成员单日矩阵需要能直接取得成员当天异常解释，避免主管必须先进入个人页才能理解异常证据。"
  - id: R231
    module: "履约日历"
    description: "小组成员单日矩阵需要提供异常解释侧栏，展示选中异常的时间段、类型、涉及轨道、影响时长、证据说明、建议主管动作和优先级。"
  - id: R232
    module: "履约日历"
    description: "小组成员单日矩阵的异常标记需要能选中侧栏解释，并保留进入个人单日详情的入口。"
source: "PM requested continuous closeout of supervisor handling flow on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组偏向主管现场处理，只在现有小组单日矩阵内展示异常解释；不新增页面路由或左侧入口，不新增依赖，不实现数据库、权限、审批、处理提交、导出、批量、真实接口、自动排班或生产公式。"
```

### R227-R229 - 履约异常解释卡

```yaml
requirements:
  - id: R227
    module: "履约日历"
    description: "个人单日详情需要提供异常解释数据结构，使异常落到员工、日期、时间段、涉及轨道、影响时长和优先级。"
  - id: R228
    module: "履约日历"
    description: "个人单日三轨详情下方需要展示异常解释卡，用业务语言说明证据和建议主管动作。"
  - id: R229
    module: "履约日历"
    description: "小组成员单日矩阵中的异常标记进入个人单日详情后，需要能看到对应日期的异常解释列表。"
source: "PM selected inline personal-day exception explanation card option on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组偏向主管现场处理，只做异常解释和判断辅助；不新增页面路由或左侧入口，不新增依赖，不实现数据库、权限、审批、处理提交、导出、批量、真实接口、自动排班或生产公式。"
```

### R224-R226 - 履约日历风险摘要和视图焦点

```yaml
requirements:
  - id: R224
    module: "履约日历"
    description: "小组成员周矩阵需要提供风险摘要，展示风险成员数、最高缺口成员、最高异常成员和最高缺口日期。"
  - id: R225
    module: "履约日历"
    description: "小组成员周矩阵需要提供视图焦点切换，使主管能在全部、缺口和异常视角之间切换。"
  - id: R226
    module: "履约日历"
    description: "小组成员周矩阵在不同视图焦点下需要强化对应风险单元格，避免一周矩阵信息过密时难以扫描。"
source: "PM requested continuous multi-task fulfillment calendar development on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组只增强现有履约日历矩阵的查看和扫描能力，不新增页面路由或左侧入口，不新增依赖，不实现数据库、权限、审批、导出、批量、真实接口、自动排班或生产公式。"
```

### R221-R223 - 履约日历小组成员周矩阵收口

```yaml
requirements:
  - id: R221
    module: "履约日历"
    description: "个人周日历需要根据来源正确返回：从小组成员周矩阵进入时返回周矩阵，从小组成员单日矩阵进入时返回单日矩阵。"
  - id: R222
    module: "履约日历"
    description: "小组成员周矩阵需要提供按日期查看全组当天的入口，使主管能从周视角进入某天的小组成员单日矩阵。"
  - id: R223
    module: "履约日历"
    description: "小组成员周矩阵需要展示小组级业务摘要，包含成员数、计划人天、登录人天、缺口工时和异常数，并保持风险优先排序。"
source: "PM requested continuous multi-task fulfillment calendar development on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组只收口履约日历现有链路，不新增左侧入口，不新增依赖，不实现正式小组管理、数据库、权限、审批、导出、批量、真实接口、自动排班或生产公式。"
```

### R220 - 履约日历小组成员周矩阵

```yaml
id: R220
module: "履约日历"
description: "履约日历需要在小组周视图和小组成员单日矩阵之间增加小组成员周矩阵，使主管先看到小组内每个成员一周每天的排班、登录、缺口和异常，再下钻到某人某天详情。"
source: "PM confirmed continuing fulfillment calendar business function on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本需求复用现有 `/person-timeline` 路由，不新增左侧入口，不新增依赖，不实现正式小组管理、数据库、权限、审批、导出、批量、真实接口、自动排班或生产公式。"
```

### R219 - 履约日历个人周日历层

```yaml
id: R219
module: "履约日历"
description: "履约日历需要在小组成员矩阵和个人单日三轨详情之间增加个人周日历层，使主管先看到某员工一周履约分布，再进入某一天的排班、登录、状态三轨详情。"
source: "PM confirmed continuing fulfillment calendar business function on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本需求复用现有 `/person-timeline/[employeeId]` 路由，不新增左侧入口，不新增依赖，不实现正式个人管理、数据库、权限、审批、导出、批量、真实接口、自动排班或生产公式。"
```

### R217 - 排班计划挂载人员级排班明细

```yaml
id: R217
module: "排班计划"
description: "排班计划详情不能只停留在 0.5h 汇总，需要展示人员级排班明细，并支持从人员明细进入个人当天时间轴。"
source: "PM confirmed business function on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本需求只在现有排班计划详情上挂载本地人员级明细，不新增页面，不实现自动排班、真实导入、数据库、权限、审批、导出、批量或生产公式。"
```

### R216 - 全量清理产品 UI 内部口径并重做人员时间轴

```yaml
id: R216
module: "产品体验"
description: "全量审查现有产品页面，移除内部执行、验收、Gate、只读演示、暂不实现、无真实等非业务用户口径；人员时间轴必须按个人日历和单日甘特式轨道呈现。"
source: "PM escalation on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本需求不新增页面，不新增依赖，不改后端；修复现有页面的产品语义和人员时间轴信息架构。后续新增页面必须先确认 UI 或由 PM 提供设计稿。"
```

### R215 - 经营总览移除数据接入状态遗留

```yaml
id: R215
module: "运营工作台"
description: "经营总览和产品导航必须保持业务功能语义，不得继续展示数据接入状态、数据版本或把 PRD/验收/准备/缺口/治理记录开发成产品页面。"
source: "PM escalation on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本需求是产品语义回归修复；移除 `/dashboard` 上的接入证据展示，删除 `/production-mvp/**` 这类内部规划页面路由，并把仍有价值的入口改回真实业务页面；不删除数据接入组件本身，不改 `/demo-imports`，不接真实数据源。"
```

### R001 - BPO WFM Dashboard 静态首页

```yaml
id: R001
module: "运营工作台"
description: "基于 shadcn 官方 dashboard-01 结构，实现 BPO Workforce Management 静态首页，用于展示排班履约、异常工时、趋势、热力图和数据同步状态。"
source: "PM confirmed F001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "仅限静态前端 prototype；不接入后端、真实 Excel、真实 CORN API、权限系统、登录认证、数据库、导出、审批或智能排班算法。"
```

### R002 - shadcn 风格与主题约束

```yaml
id: R002
module: "前端体验"
description: "Dashboard 需遵循 shadcn/ui v4 dashboard examples、dashboard-01 block、New York style 和 dark/light theme system。"
source: "PM confirmed frontend direction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "F001 允许按官方 shadcn chart structure 使用 Recharts；正式图表层未来需单独 Gate。"
```

### R003 - 正式 MVP 第一条前后端纵切

```yaml
id: R003
module: "MVP 范围"
description: "正式系统搭建采用前后端一条纵切方式启动，第一条纵切确定为排班计划列表、排班计划详情、FastAPI 只读接口和本地种子数据。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只定义 MVP 第一条纵切范围，不直接授权后端工程创建、依赖安装、数据库接入或真实数据接入；这些需要后续 B001/F005 Gate。"
```

### R004 - 预测需求作为排班计划输入

```yaml
id: R004
module: "博西预测需求"
description: "排班计划纵切需要展示预测需求作为计划输入，包括日期、职场、业务线、0.5h 时段和预测所需人数。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "MVP 阶段使用本地种子数据表达预测需求，不接真实 Excel、真实预测系统或上传导入。"
```

### R005 - BPO 排班计划列表

```yaml
id: R005
module: "计划与排班"
description: "运营排班人员需要查看排班计划列表，按日期、项目、职场、版本、状态、覆盖人数和缺口风险识别需要处理的计划。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "MVP 第一条纵切只做只读列表；新增、编辑、发布、审批和批量操作不在第一条纵切内。"
```

### R006 - BPO 排班计划详情

```yaml
id: R006
module: "计划与排班"
description: "运营排班人员需要打开单个排班计划详情，查看 0.5h 时段级预测需求、已排人数、缺口、覆盖率和备注。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "详情页仅展示只读计划明细和基础汇总，不做拖拽排班、人员级编辑或智能排班算法。"
```

### R007 - FastAPI 后端只读接口

```yaml
id: R007
module: "后端服务"
description: "第一条纵切需要 Python + FastAPI 提供排班计划列表和详情只读接口，供前端从本地种子数据读取。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "B001 才能创建 backend 工程、依赖和接口；M001 只定义接口边界。数据库、认证和真实集成不在第一条纵切内。"
```

### R008 - 前后端接口契约

```yaml
id: R008
module: "接口契约"
description: "第一条纵切需要明确前端与 FastAPI 后端之间的字段契约，包括计划摘要、计划详情、时段明细和错误响应。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "接口字段使用 English keys；业务展示值可使用中文。错误响应先采用最小只读查询错误，不定义生产级权限或审计错误码。"
```

### R009 - MVP 阶段状态与公式边界

```yaml
id: R009
module: "业务口径"
description: "第一条纵切需要明确哪些状态、指标和公式只是 MVP 展示口径，哪些必须在后续 Gate 中由 PM 再确认。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "计划状态建议先限于 draft、review_ready、published 三个展示状态；排班覆盖率建议为 scheduled_agents / forecast_agents。该建议用于 M001 设计，不代表生产最终口径。"
```

### R010 - 第一条纵切验证与交付

```yaml
id: R010
module: "质量与交付"
description: "第一条纵切需要具备可验证交付标准，包括前端构建、后端测试、接口契约检查、Harness check 和 Done Report。"
source: "PM confirmed M001"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "Q001 后续定义具体验证命令；M001 只定义验收方向，不引入测试依赖。"
```

### R011 - 本地排班计划草稿创建与更新

```yaml
id: R011
module: "计划与排班"
description: "运营排班人员需要在本地 MVP 中创建排班计划草稿，并在草稿状态下更新 0.5h 时段的预测人数、已排人数和备注，以便系统从只读查看推进到受控编辑闭环。"
source: "PM continuous delivery instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只允许本地内存数据和 draft 草稿更新；不接数据库、认证、真实 Excel、真实 CORN、发布、审批、导出、批量操作或生产公式。"
```

### R012 - 前端排班计划草稿创建入口

```yaml
id: R012
module: "计划与排班"
description: "运营排班人员需要在排班计划列表中进入新建草稿页面，填写计划信息和核心 0.5h 时段后创建 draft 排班计划。"
source: "PM continuous delivery instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "F006 只做最小创建入口，通过 Next server action 调用 B002；不做完整编辑器、发布、审批、导出、批量、数据库或权限。"
```

### R013 - 前端排班计划草稿更新入口

```yaml
id: R013
module: "计划与排班"
description: "运营排班人员需要从 draft 排班计划详情进入编辑页面，更新计划信息和 0.5h 时段后保存草稿。"
source: "PM continuous delivery instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "F007 只允许编辑 draft 状态计划，通过 Next server action 调用 B002 PUT；不做发布、审批、导出、批量、权限、数据库或人员级排班。"
```

### R014 - Story Runner 连续用户故事交付流程

```yaml
id: R014
module: "Harness 流程"
description: "PM 期望 Codex 按 goal 拆出最小用户故事后，能够自动按依赖顺序开发、测试、提交，并在写入范围不冲突时启动 subagent 并行处理，而不是频繁把小 UI 反馈切成独立任务。"
source: "PM harness optimization feedback"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "该需求优化执行流程，不授权新增依赖、真实数据、数据库、认证、权限、审批、导出、批量或生产公式。"
```

### R015 - 排班计划列表筛选

```yaml
id: R015
module: "计划与排班"
description: "运营排班人员需要在排班计划列表中按关键词和计划状态筛选，以便快速定位草稿、待复核或已发布计划。"
source: "PM continuous development instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只做本地 FastAPI 列表查询和前端 URL 筛选；不做权限、审批、发布、批量、数据库、真实 Excel、真实 CORN 或生产状态口径变更。"
```

### R016 - 班次明细查看

```yaml
id: R016
module: "计划与排班"
description: "运营排班人员需要从计划与排班中查看 0.5h 班次明细，包含计划、日期、时段、预测人数、已排人数、缺口、覆盖率和备注。"
source: "PM continuous development instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只做本地只读明细查看和筛选；不做人员级排班、拖拽排班、审批、发布、批量、数据库、真实 Excel 或真实 CORN。"
```

### R017 - 需求计划查看

```yaml
id: R017
module: "计划与排班"
description: "运营排班人员需要查看预测需求计划，按日期、项目、职场和 0.5h 时段了解预测人数，作为排班计划输入。"
source: "PM continuous development instruction"
submitted_at: "2026-05-11"
version: "1.0"
status: "split"
notes: "本需求只做本地只读预测需求查看和搜索；不做真实 Excel 导入、字段映射、数据库、审批、发布、批量或生产预测算法。"
```

### R018 - 不可用管理查看

```yaml
id: R018
module: "计划与排班"
description: "运营排班人员需要查看人员不可用时段，按人员、团队、项目、职场、原因和状态定位不可用对排班覆盖的影响。"
source: "PM continuous development instruction"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做本地只读不可用记录查看和筛选；不做人事系统接入、真实请假审批、数据库、权限、批量导入、排班自动冲突计算或生产状态口径。"
```

### R019 - 排班风险提示

```yaml
id: R019
module: "计划与排班"
description: "运营排班人员需要在排班计划中看到由时段缺口和生效中不可用记录共同形成的风险提示，以便优先复核高风险班次。"
source: "PM accepted recommended next stage"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做本地 MVP 风险提示和跳转查看；风险等级为展示口径，不代表生产风控公式。不做自动排班、真实审批、数据库、权限、批量调班或生产状态口径。"
```

### R020 - shadcn dashboard-01 前端视觉对齐

```yaml
id: R020
module: "前端设计"
description: "PM 要求将 `shadcn-dashboard-01-replica-spec.md` 插入项目需求，后续前端改造必须以 shadcn dashboard-01 measured values 为基准，优先对齐设计 token、组件结构、响应式行为、浅色/深色主题和浏览器验收场景。"
source: "/Users/mac/Documents/Codex/2026-05-10/computeruse-https-ui-shadcn-com/docs/design/shadcn-dashboard-01-replica-spec.md"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求本轮只插入需求和执行队列，不直接实施 UI。正式实施前必须先做差距审计；如追求 1:1 复刻，可能触发 Geist 字体、Tabler icons、shadcn 组件补齐、浏览器截图验证和 package/lockfile 变更，需要单独 Gate。"
```

### R021 - shadcn 依赖与组件接入收口

```yaml
id: R021
module: "前端设计"
description: "PM 已允许将已安装的 Tabler icons、TanStack Table、DnD、Drawer、Select、Tabs、Dropdown、ToggleGroup、Chart 等 shadcn dashboard-01 parity 依赖和生成组件纳入项目，并先完成接入收口与验证。"
source: "PM confirmation after F014"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只收口已确认的 package/lockfile、shadcn UI 组件和 lint/compatibility 修复；不开发新业务功能，不接入真实数据、数据库、认证、权限、审批、导出、批量操作，不固化生产公式、状态码、结算口径或收费因子。"
```

### R022 - Harness Gate 体系审计反馈修复

```yaml
id: R022
module: "Harness"
description: "审计反馈指出 Gate Registry 与 backlog required_workflow 脱节、AGENTS 阶段名滞后、audit-report 当前/历史口径混写、Story Runner 缺少 ready 队列入口，需要进行文档型修复。"
source: "PM audit feedback"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只修复 Harness 文档、Gate 映射、审计口径和下一步队列可观测性；不开发业务代码，不改 package/lockfile，不接入真实数据、数据库、认证、权限、审批、导出、批量操作或生产公式。"
```

### R023 - 风险明细钻取

```yaml
id: R023
module: "计划与排班"
description: "运营排班人员需要从排班风险提示进入风险明细，查看同一风险项关联的计划、时段缺口、不可用记录和建议动作，以便继续人工复核。"
source: "F015 Done Report recommended next stage"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求作为下一轮 Story Runner ready 入口预置；实现时应优先复用本地 `schedule-risks`、`schedule-plans`、`shift-details`、`unavailability` 数据，不做真实人事/CORN 集成、数据库、审批、批量调班、生产风险公式或状态码定稿。"
```

### R024 - 不可用影响定位

```yaml
id: R024
module: "计划与排班"
description: "运营排班人员需要从不可用记录定位其影响的班次和关联风险，以便判断是否需要人工复核排班覆盖。"
source: "PM requested development mainline after push"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做本地只读影响定位和跳转；不做人事/CORN 真实集成、数据库、权限、审批、导出、批量调班、自动排班、生产状态码、生产公式、结算规则或收费因子。"
```

### R025 - table parity 局部迁移

```yaml
id: R025
module: "前端设计"
description: "在已接入 TanStack Table 和 shadcn 组件的前提下，先选择一个低风险表格做局部迁移，提升官方 dashboard table parity，但不启用批量、拖拽、审批、导出或生产动作。"
source: "PM requested development mainline after push"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做展示层局部迁移；不新增依赖，不修改 package/lockfile，不改变业务字段、生产状态码、公式、结算规则或收费因子。"
```

### R026 - 开发服务器原生运行时硬化

```yaml
id: R026
module: "Harness"
description: "项目级修复开发服务器在本机原生包签名或缺失场景下返回 500 的问题，要求将前端开发入口收口到受控 Node.js 22 运行时、统一 dev/build 编译链，并在启动前显式预检 Next.js 与 lightningcss 原生包加载。"
source: "PM requested project-level repair on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只修复本地开发运行时、入口脚本、验证和文档说明；不新增依赖，不修改 lockfile，不改业务代码、后端契约、真实数据、数据库、认证、权限、审批、导出、批量能力或生产口径。"
```

### R027 - Python 3.12 开发运行时固化

```yaml
id: R027
module: "Harness"
description: "项目开发期固定使用 Python 3.12，并将 backend dev/check 入口从“任意可导入依赖的 Python”收口到受支持版本，避免换机器或 PATH 顺序变化导致后端运行时漂移。"
source: "PM requested runtime pinning on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只固化 Python 开发版本、验证脚本和文档说明；不新增依赖，不修改业务代码、后端契约、数据库、认证、权限、审批、导出、批量能力或生产口径。"
```

### R028 - 标准化分支与验证工作流

```yaml
id: R028
module: "Harness"
description: "PM 要求将取任务、分支/worktree、开发、验证、提交、集成、push 确认、异常处理和审计证据补齐为标准化工作流，同时避免 AGENTS.md 继续膨胀。"
source: "PM workflow governance confirmation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做 Harness 文档和审计模板治理；不修改业务代码，不新增依赖，不修改 package/lockfile，不接入真实数据、数据库、认证、权限、审批、导出、批量操作或生产公式。"
```

### R029 - No Database MVP Mode

```yaml
id: R029
module: "MVP 范围"
description: "PM 明确要求在功能开发完毕前先不要接数据库，因为当前没有数据库环境；MVP 阶段必须继续使用本地接口、种子数据、进程内存和前端 fallback 完成业务链路验证。"
source: "PM instruction 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求固化 no-database 边界：不创建数据库连接、ORM、migration、schema、持久化配置或真实数据接入；后续任何数据库相关工作必须另开 Gate 并等待 PM 明确确认。"
```

### R030 - 本地 MVP 功能闭环入口

```yaml
id: R030
module: "计划与排班"
description: "PM 要求先回到业务开发主线，在不接数据库的前提下完成本地 MVP 功能闭环，让风险明细、不可用影响、班次明细和需求计划形成可导航链路。"
source: "PM instruction 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只允许前端展示层和导航闭环，不新增后端接口、不新增依赖、不接数据库、不做真实数据、审批、导出、批量调班或生产公式。"
```

### R031 - 排班计划主表 table parity 局部迁移

```yaml
id: R031
module: "前端设计"
description: "在风险提示表已完成 TanStack Table 局部迁移后，继续选择排班计划主表做局部 table parity 展示迁移。"
source: "PM instruction 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只迁移展示层排序和列渲染，不启用批量选择、拖拽、导出、审批、批量调班、生产状态码或结算口径。"
```

### R032 - 本地 MVP 验收审计

```yaml
id: R032
module: "质量与交付"
description: "完成 no-database 边界、本地 MVP 功能闭环和 table parity 局部迁移后，做一轮 MVP 验收审计，明确当前通过项、剩余项和暂不建议项。"
source: "PM instruction 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只做验收审计和验证记录；不新增业务能力、不接数据库、不修改依赖或 package/lockfile。"
```

### R033 - 排班计划详情复核链路补强

```yaml
id: R033
module: "计划与排班"
description: "在不接数据库的前提下，排班计划详情页需要直接给出班次、风险和不可用的复核入口，并展示本地关联计数，减少人工来回跳转。"
source: "PM continue mainline after no-database integration"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只复用现有本地 schedule-plans、schedule-risks、shift-details、unavailability 契约；不新增后端接口、真实数据、数据库、审批、导出、批量调班或生产公式。"
```

### R034 - 班次明细 table parity 第二条迁移

```yaml
id: R034
module: "前端设计"
description: "在风险提示表和排班计划主表之后，继续把班次明细页迁移到 TanStack Table，实现第二条展示层 table parity。"
source: "PM continue mainline after no-database integration"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只迁移展示层列和排序，不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R035 - 不可用记录 table parity 第三条迁移

```yaml
id: R035
module: "前端设计"
description: "在班次明细页完成 TanStack Table 迁移后，继续把不可用记录页迁移到同一展示层 table parity 模式。"
source: "Mainline follow-up after F021/F022"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "本需求只迁移展示层列和排序，不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R036 - F021-F023 本地链路 QA 验收收口

```yaml
id: R036
module: "质量与交付"
description: "在 F021、F022、F023 完成后，执行一条 qa 验收故事，对计划详情复核链路、班次明细 table parity、不可用记录 table parity 进行集中收口验证。"
source: "PM instruction"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R037 - 需求计划 table parity 第四条迁移

```yaml
id: R037
module: "前端设计"
description: "在不可用记录 table parity 完成后，把需求计划页迁移到同一 TanStack Table 展示层 parity 模式，作为下一条前端一致性目标。"
source: "PM instruction"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R038 - F024 单故事 QA 验收收口

```yaml
id: R038
module: "质量与交付"
description: "在 F024 完成后执行一条 qa 验收故事，确认需求计划 table parity 的展示与追溯收口。"
source: "PM instruction"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R039 - 排班计划详情时段表 table parity 第五条迁移

```yaml
id: R039
module: "前端设计"
description: "在需求计划页完成 parity 后，把排班计划详情中的 0.5h 时段明细表迁移到独立 TanStack Table 组件。"
source: "Story Runner accelerated decomposition"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R040 - F025 单故事 QA 验收收口

```yaml
id: R040
module: "质量与交付"
description: "在 F025 完成后执行一条 qa 验收故事，确认排班计划详情时段表 parity 的展示与追溯收口。"
source: "Story Runner accelerated decomposition"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R041 - 风险明细受影响班次表 table parity 第六条迁移

```yaml
id: R041
module: "前端设计"
description: "在排班计划详情时段表完成 parity 后，继续把风险明细页中的受影响班次表迁移到独立 TanStack Table 组件。"
source: "Story Runner accelerated decomposition"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R042 - F026 单故事 QA 验收收口

```yaml
id: R042
module: "质量与交付"
description: "在 F026 完成后执行一条 qa 验收故事，确认风险明细受影响班次表 parity 的展示与追溯收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R043 - 风险明细不可用影响表 table parity 第七条迁移

```yaml
id: R043
module: "前端设计"
description: "在风险明细受影响班次表完成 parity 后，继续把风险明细页中的不可用影响表迁移到独立 TanStack Table 组件。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R044 - F027 单故事 QA 验收收口

```yaml
id: R044
module: "质量与交付"
description: "在 F027 完成后执行一条 qa 验收故事，确认风险明细不可用影响表 parity 的展示与追溯收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R045 - 不可用影响详情受影响班次表 table parity 第八条迁移

```yaml
id: R045
module: "前端设计"
description: "在风险明细两张详情表完成 parity 后，继续把不可用影响详情页中的受影响班次表迁移到独立 TanStack Table 组件。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R046 - F028 单故事 QA 验收收口

```yaml
id: R046
module: "质量与交付"
description: "在 F028 完成后执行一条 qa 验收故事，确认不可用影响详情受影响班次表 parity 的展示与追溯收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R047 - 不可用影响详情关联风险表 table parity 第九条迁移

```yaml
id: R047
module: "前端设计"
description: "在不可用影响详情受影响班次表完成 parity 后，继续把不可用影响详情页中的关联风险表迁移到独立 TanStack Table 组件。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "仅迁移展示层列与排序；不启用批量选择、拖拽、审批、导出、批量调班或生产动作。"
```

### R048 - F029 单故事 QA 验收收口

```yaml
id: R048
module: "质量与交付"
description: "在 F029 完成后执行一条 qa 验收故事，确认不可用影响详情关联风险表 parity 的展示与追溯收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R049 - 详情页 table parity 连续开发块 QA 总收口

```yaml
id: R049
module: "质量与交付"
description: "在 F026-F029 完成后，对风险明细和不可用影响详情两页的四张明细表做一次连续开发块 QA 总收口。"
source: "Story Runner queue consolidation"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做验收验证和审计记录，不新增业务能力、不改依赖、不改后端契约、不接数据库或真实数据。"
```

### R050 - Harness current/archive 双层状态治理试点

```yaml
id: R050
module: "Harness"
description: "为降低开发期上下文负担并提升状态一致性，项目需要从现有大文件驱动方式升级为 v2 双层状态治理：先建立 current 层做小范围试点，再加入 registry 与 state check，最后按阶段归档历史。"
source: "PM supplied compensation-fix proposal v2 on 2026-05-12"
submitted_at: "2026-05-12"
version: "2.0"
status: "split"
notes: "该需求暂不直接全量迁移 backlog、stories、audit；先以一个真实 ready story 试点 current 层。设计约束包括：1) 只迁移最小闭环，不全量拆历史；2) `STORY_QUEUE.yaml`、`ACTIVE_TASKS.yaml`、`TRACE_INDEX.yaml`、`PROJECT_CONTEXT.md` 之间必须满足状态一致性不变量；3) 增加 `scripts/check-state.sh` 作为自动状态检查；4) 每次归档必须按事务顺序执行并支持 blocked/回滚；5) 历史查询必须受预算限制，禁止全量打开 archive；6) 第一阶段保留旧大文件作为可回退过渡层；7) 试点验收必须证明 Agent 可只靠 current 层完成一次真实任务并通过 `check-state` 与 `bash scripts/check.sh`；8) 推荐拆为三阶段：A 只建 `docs/current/*`，B 加 `docs/registry/*` 与 state check，C 再按月或按块归档 done 历史。"
```

### R051 - Harness 状态治理 v3 第一轮落地

```yaml
id: R051
module: "Harness"
description: "按 PM 确认的 v3 方案落地第一轮状态治理：冻结 current/registry/archive 原则，新增 current 层、registry 层、warning-only state check、State Repair Mode、History-On-Demand Rule，并把默认读取集从大文件切到 current 层。"
source: "PM supplied state-governance proposal v3 on 2026-05-12"
submitted_at: "2026-05-12"
version: "3.0"
status: "split"
notes: "第一轮只做治理文件、current/registry 入口和状态检查，不迁移大量 done 历史、不改业务代码、不改依赖、不接数据库。旧大文件暂保留为历史来源和过渡期追溯。"
```

### R052 - check-state 标准验证链路接入

```yaml
id: R052
module: "Harness"
description: "在状态治理 v3 第一轮后，把 check-state 接入标准 `bash scripts/check.sh` 的 warning-only 路径，并补充无依赖回归测试，证明状态漂移能被发现且不会导致普通任务自锁。"
source: "PM requested continued governance on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只改 Harness 脚本、测试和治理追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R053 - current queue 真实任务冒烟

```yaml
id: R053
module: "Harness"
description: "用 docs/current/STORY_QUEUE.yaml 和 docs/current/ACTIVE_TASKS.yaml 执行一条真实治理小任务，验证 current queue 能作为默认启动入口，并在任务完成后不保留 done 历史。"
source: "State governance continuation on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只做 current queue 冒烟和治理记录；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R054 - current done history 不变量检查

```yaml
id: R054
module: "Harness"
description: "补强 check-state，明确 current story/task 文件不能保留 done 历史，并用回归测试覆盖 warning-only 与 strict 行为。"
source: "State governance continuation on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只改状态检查、回归测试和治理追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R055 - check-state strict 默认阻断

```yaml
id: R055
module: "Harness"
description: "在 current queue 冒烟和 done-history 不变量跑稳后，将标准 `bash scripts/check.sh` 的 state check 从 warning-only 升级为 strict 默认阻断，并保留 state-repair 和 warning-only 显式旁路。"
source: "State governance continuation on 2026-05-12"
submitted_at: "2026-05-12"
version: "1.0"
status: "split"
notes: "只改标准检查入口和治理追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R056 - TRACE_INDEX current_files 路径校验

```yaml
id: R056
module: "Harness"
description: "补强 check-state，对 TRACE_INDEX.yaml 的 current_files 路径进行存在性校验，并对重复 registry path 输出去重。"
source: "State governance continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改状态检查、回归测试和治理追溯；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R057 - Codex Plan 面板边界规则

```yaml
id: R057
module: "Harness"
description: "明确 Codex Plan/进度面板只是当前会话投影视图，不是项目状态源；真实状态必须以 Harness current queue、active tasks 和 registry 为准。"
source: "PM supplied Codex Plan boundary rule on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只改治理规则和追溯记录；不改业务代码、不改依赖、不改 package/lockfile、不接数据库。"
```

### R058 - Dashboard 异常明细表 TanStack Table parity

```yaml
id: R058
module: "前端设计"
description: "Dashboard 首页的 BPO 异常明细表仍是手写排序和分页，需要迁移到 TanStack Table，以便与当前主链路表格 parity 保持一致。"
source: "Story Runner continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做 dashboard 本地静态异常表展示层迁移；不新增依赖、不改后端契约、不接数据库、不启用审批、导出、批量或生产动作。"
```

### R059 - Dashboard 异常明细表本地列显示与分页控制

```yaml
id: R059
module: "前端设计"
description: "Dashboard 异常明细表的列控制目前是占位按钮，需要补成本地列显示开关和分页大小控制，形成可用但不连接生产动作的 table parity 交互。"
source: "Story Runner continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做本地 UI 状态控制；不新增依赖、不改数据来源、不接数据库、不做导出、批量选择、拖拽或生产动作。"
```

### R060 - F030-F031 dashboard table parity QA 收口

```yaml
id: R060
module: "质量与交付"
description: "F030 和 F031 完成后，对 dashboard 异常明细表 parity 做一轮 QA 验收，确认迁移、交互、边界和追溯均可验证。"
source: "Story Runner continuation on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "只做验收验证和追溯更新；不新增业务能力、不改依赖、不改后端契约、不接数据库。"
```

### R061-R070 - Dashboard 本地 parity 连续增强

```yaml
requirements:
  - id: R061
    description: "Dashboard 异常明细表需要本地状态与严重度筛选。"
  - id: R062
    description: "Dashboard 异常明细表需要筛选摘要和一键重置。"
  - id: R063
    description: "Dashboard 异常明细表需要分页范围、首页和末页控制。"
  - id: R064
    description: "Dashboard 数据接入状态需要模型测试覆盖本地筛选和状态统计。"
  - id: R065
    description: "Dashboard 数据接入状态需要迁移为 TanStack Table 展示层 parity。"
  - id: R066
    description: "Dashboard 数据接入状态需要本地状态筛选和摘要，不触发真实同步。"
  - id: R067
    description: "Dashboard 热力图需要模型测试覆盖缺口统计、严重时段和峰值缺口。"
  - id: R068
    description: "Dashboard 热力图需要显示本地缺口摘要。"
  - id: R069
    description: "Dashboard 热力图格子需要更明确的可访问标签和键盘聚焦样式。"
  - id: R070
    description: "F032-F040 完成后需要 QA 收口。"
source: "PM requested 10-task continuous development on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "本组只做 dashboard 本地展示层增强；不新增依赖、不改后端契约、不接数据库、不做真实同步、审批、导出、批量或生产公式。"
```

### R071-R090 - 排班/风险/不可用表格本地 parity 连续增强

```yaml
requirements:
  - {id: R071, description: "排班计划表需要本地筛选与统计模型测试。"}
  - {id: R072, description: "排班计划表需要本地摘要条。"}
  - {id: R073, description: "排班计划表需要本地查询、状态和缺口筛选。"}
  - {id: R074, description: "排班计划表需要重置筛选和空结果提示。"}
  - {id: R075, description: "排班计划表需要本地分页范围与翻页控制。"}
  - {id: R076, description: "排班计划表需要本地列显示控制。"}
  - {id: R077, description: "风险提示表需要本地筛选与统计模型测试。"}
  - {id: R078, description: "风险提示表需要本地摘要条。"}
  - {id: R079, description: "风险提示表需要风险等级筛选。"}
  - {id: R080, description: "风险提示表需要本地搜索。"}
  - {id: R081, description: "风险提示表需要本地分页范围与翻页控制。"}
  - {id: R082, description: "风险提示表需要重置筛选和空结果提示。"}
  - {id: R083, description: "不可用表需要本地筛选与统计模型测试。"}
  - {id: R084, description: "不可用表需要本地摘要条。"}
  - {id: R085, description: "不可用表需要状态筛选。"}
  - {id: R086, description: "不可用表需要本地搜索。"}
  - {id: R087, description: "不可用表需要本地分页范围与翻页控制。"}
  - {id: R088, description: "不可用表需要重置筛选和空结果提示。"}
  - {id: R089, description: "不可用表需要本地列显示控制。"}
  - {id: R090, description: "F041-F059 完成后需要 QA 收口。"}
source: "PM requested 20-task continuous development on 2026-05-13"
submitted_at: "2026-05-13"
version: "1.0"
status: "split"
notes: "本组只做本地前端表格展示层 parity；不新增依赖、不改后端契约、不接数据库、不做审批、导出、批量、权限或生产公式。"
```

### R091-R096 - 生产雏形第一批需求安排

```yaml
requirements:
  - id: R091
    module: "生产雏形"
    description: "把 `docs/production-mvp-prd.md` 中的第一阶段范围拆成可执行的第一批 raw requirements、user stories、backlog tasks 和 current ready queue。"
  - id: R092
    module: "主数据"
    description: "生产雏形需要主数据导入合同，覆盖坐席、职场、供应商、项目、绑定关系和班次类型的字段、主键、校验、批次和失败行口径。"
  - id: R093
    module: "排班"
    description: "生产雏形需要人员级排班数据合同，并明确如何展开为 0.5h 时段汇总。"
  - id: R094
    module: "需求预测"
    description: "生产雏形需要独立需求预测导入合同，按日期、职场、项目、时段、技能组和等级对齐排班。"
  - id: R095
    module: "登录与状态"
    description: "生产雏形需要登录日志、状态日志和人员级排班的对比口径，支持未登录、迟到、早退、非有效产能等异常识别。"
  - id: R096
    module: "异常闭环"
    description: "生产雏形需要异常识别与复核闭环口径，定义异常类型、归因、复核结果、审计字段和后续处理状态。"
source: "Production MVP PRD approved by PM on 2026-05-18"
submitted_at: "2026-05-18"
version: "1.0"
status: "split"
notes: "本组只安排生产雏形第一批需求。后续实现仍必须保持 no-database/local MVP 边界；不授权数据库、真实外部集成、权限、审批、导出、批量、自动排班、生产公式、结算规则或收费因子。"
```

### R097-R100 - 生产雏形合同前端演示入口

```yaml
requirements:
  - id: R097
    module: "生产雏形"
    description: "前端需要本地合同客户端和模型测试，能汇总主数据、人员级排班、履约对比三个生产雏形合同。"
  - id: R098
    module: "生产雏形"
    description: "新增生产雏形合同页，用于展示第一批合同覆盖范围、数据来源、异常口径和 no-database 边界。"
  - id: R099
    module: "导航"
    description: "侧边栏需要一个生产雏形入口，方便 PM 从本地演示页直接查看合同覆盖情况。"
  - id: R100
    module: "质量与交付"
    description: "对生产雏形合同前端演示入口做 QA 收口，确认页面、导航、测试和边界追溯均可验证。"
source: "PM requested multiple continued production MVP tasks on 2026-05-18"
submitted_at: "2026-05-18"
version: "1.0"
status: "split"
notes: "本组只做前端本地演示入口和合同摘要，不做真实导入、真实计算、数据库、权限、审批、导出、批量或生产公式。"
```

### R101-R104 - 异常复核只读入口

```yaml
requirements:
  - id: R101
    module: "异常闭环"
    description: "前端需要本地异常复核模型和测试，能按异常状态、严重度、归因、负责人统计第一阶段异常。"
  - id: R102
    module: "异常闭环"
    description: "新增异常复核只读页，用于展示异常列表、复核口径、归因分布和本地 no-action 边界。"
  - id: R103
    module: "导航"
    description: "侧边栏需要将异常复核入口指向新的只读页，方便 PM 从履约监控直接验收异常闭环方向。"
  - id: R104
    module: "质量与交付"
    description: "对异常复核只读入口做 QA 收口，确认页面、导航、模型测试和边界追溯均可验证。"
source: "PM said start after production MVP contract demo recommendation on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读入口和模型摘要，不实现真实异常计算、复核提交、审批、权限、导出、批量或生产公式。"
```

### R105-R114 - 导入合同 drilldown 与数据质量中心

```yaml
requirements:
  - id: R105
    module: "生产雏形"
    description: "生产雏形合同页需要可复用的导入合同 drilldown 模型和测试，把主数据、人员排班、履约对比拆成可点击、可验收的合同块。"
  - id: R106
    module: "主数据"
    description: "主数据导入合同需要独立只读 drilldown 页，展示对象、主键、字段、必填、外键、质量错误码和暂不实现边界。"
  - id: R107
    module: "排班"
    description: "人员级排班合同需要独立只读 drilldown 页，展示人员排班字段、必填、校验规则和 0.5h 展开结果。"
  - id: R108
    module: "履约对比"
    description: "预测、排班、登录和状态对比合同需要独立只读 drilldown 页，展示来源、对齐键、人员级追溯键和异常规则。"
  - id: R109
    module: "生产雏形"
    description: "生产雏形总览页需要挂载三个 drilldown 入口，方便 PM 从总览进入具体合同验收。"
  - id: R110
    module: "数据质量"
    description: "数据质量中心需要本地问题模型和测试，覆盖缺字段、重复主键、外键缺失、时间范围、状态重叠和主数据缺失等导入问题。"
  - id: R111
    module: "数据质量"
    description: "数据质量中心需要只读列表页，展示问题摘要、来源分布、未解决问题和 no-action 边界。"
  - id: R112
    module: "数据质量"
    description: "数据质量问题需要只读详情页，展示字段、错误码、来源对象、建议处理和暂不实现动作。"
  - id: R113
    module: "导航"
    description: "侧边栏数据质量入口需要指向数据质量中心，方便本地验收时直接进入。"
  - id: R114
    module: "质量与交付"
    description: "导入合同 drilldown 与数据质量中心完成后需要 QA 收口，确认模型测试、页面、导航、current 清理和 no-database 边界均可验证。"
source: "PM requested 10-task continuous development on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实导入、数据库、权限、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R115-R124 - 人员时间轴、需求预测合同和主数据关系

```yaml
requirements:
  - id: R115
    module: "人员时间轴"
    description: "生产雏形需要人员级双时间轴本地模型和测试，能并列展示人员排班、登录会话、状态日志和异常标记。"
  - id: R116
    module: "人员时间轴"
    description: "需要人员时间轴总览只读页，按员工展示计划时长、登录时长、状态时长和异常数量。"
  - id: R117
    module: "人员时间轴"
    description: "需要人员时间轴详情页，展示单个员工的排班、登录和状态事件，并说明 no-action 边界。"
  - id: R118
    module: "导航"
    description: "侧边栏需要人员时间轴入口，方便从履约监控直接验收人员级对齐。"
  - id: R119
    module: "需求预测"
    description: "需要独立需求预测导入合同模型和测试，覆盖 0.5h 时段、职场、项目、技能组、等级和预测人数。"
  - id: R120
    module: "需求预测"
    description: "需要需求预测导入合同只读 drilldown 页，展示字段、主键、校验规则和暂不实现范围。"
  - id: R121
    module: "生产雏形"
    description: "生产雏形总览页需要挂载需求预测合同入口，使预测需求不再只隐藏在履约对比合同中。"
  - id: R122
    module: "主数据"
    description: "需要主数据关系本地模型和测试，展示坐席、供应商、职场、项目、绑定关系和班次类型之间的依赖。"
  - id: R123
    module: "主数据"
    description: "需要主数据关系只读页和导航入口，用于验收绑定关系如何支撑排班、预测和履约对比。"
  - id: R124
    module: "质量与交付"
    description: "人员时间轴、需求预测合同和主数据关系完成后需要 QA 收口，确认模型测试、页面、导航、current 清理和 no-database 边界均可验证。"
source: "PM requested continued production MVP development on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实导入、数据库、权限、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R125-R134 - 班次类型、导入模板和异常来源 drilldown

```yaml
requirements:
  - {id: R125, module: "班次类型", description: "生产雏形需要班次类型本地模型和测试，展示班次代码、时长、休息/饭点、适用项目和状态。"}
  - {id: R126, module: "班次类型", description: "需要班次类型只读页，用于验收人员级排班如何引用班次类型。"}
  - {id: R127, module: "导航", description: "侧边栏需要班次类型入口，方便从计划与排班直接验收。"}
  - {id: R128, module: "导入模板", description: "生产雏形需要导入模板本地模型和测试，覆盖主数据、人员排班、需求预测、登录日志和状态日志模板。"}
  - {id: R129, module: "导入模板", description: "需要导入模板只读页，展示模板字段、主键、校验和暂不实现动作。"}
  - {id: R130, module: "导航", description: "侧边栏需要导入模板入口，方便本地验收上传/导入准备情况。"}
  - {id: R131, module: "异常闭环", description: "生产雏形需要异常来源 drilldown 本地模型和测试，按预测排班、排班登录、排班状态、主数据和数据质量拆解。"}
  - {id: R132, module: "异常闭环", description: "需要异常来源总览页，展示每类来源的触发条件、输入对象、追溯键和暂不实现边界。"}
  - {id: R133, module: "异常闭环", description: "需要异常来源详情页，并从异常复核页挂载入口，方便 PM 查看来源解释。"}
  - {id: R134, module: "质量与交付", description: "班次类型、导入模板和异常来源完成后需要 QA 收口，确认模型测试、页面、导航、current 清理和 no-database 边界均可验证。"}
source: "PM requested continued production MVP development on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实导入、数据库、主数据 CRUD、班次规则计算、权限、审批、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R135-R144 - 导入批次、字段映射和复核时间线

```yaml
requirements:
  - {id: R135, module: "导入批次", description: "生产雏形需要导入批次历史本地模型和测试，展示批次、来源模板、状态、成功/失败行、错误分布和影响对象。"}
  - {id: R136, module: "导入批次", description: "需要导入批次历史只读页，用于验收上传/导入结果如何被查看和追溯。"}
  - {id: R137, module: "导航", description: "侧边栏需要导入批次入口，方便本地验收导入历史。"}
  - {id: R138, module: "字段映射", description: "生产雏形需要字段映射预览本地模型和测试，展示源字段、目标字段、必填、转换说明和校验状态。"}
  - {id: R139, module: "字段映射", description: "需要字段映射预览只读页，用于验收模板字段如何映射到生产雏形对象。"}
  - {id: R140, module: "导航", description: "侧边栏字段映射入口需要指向字段映射预览页。"}
  - {id: R141, module: "异常闭环", description: "生产雏形需要异常复核状态时间线本地模型和测试，展示异常从识别、分派、复核到关闭的本地状态流。"}
  - {id: R142, module: "异常闭环", description: "需要异常复核状态时间线只读页，用于验收异常闭环状态解释。"}
  - {id: R143, module: "异常闭环", description: "异常复核页需要挂载状态时间线入口，方便 PM 从复核总览进入闭环解释。"}
  - {id: R144, module: "质量与交付", description: "导入批次、字段映射和复核时间线完成后需要 QA 收口，确认模型测试、页面、导航、current 清理和 no-database 边界均可验证。"}
source: "PM requested continued production MVP development on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实上传/导入、字段映射保存、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R145-R154 - 数据质量分组、导入问题钻取和生产雏形验收清单

```yaml
requirements:
  - id: R145
    module: "数据质量"
    description: "生产雏形需要数据质量分组本地模型和测试，按缺失必填、时间有效性、主数据引用和排班准备度聚合同类问题。"
  - id: R146
    module: "数据质量"
    description: "需要数据质量分组总览只读页，展示每组问题数量、风险等级、责任角色和暂不实现动作。"
  - id: R147
    module: "数据质量"
    description: "需要数据质量分组详情页，展示关联问题、来源模板、追溯键和处理边界。"
  - id: R148
    module: "数据质量"
    description: "数据质量中心需要挂载分组视图入口，方便从问题清单进入业务原因分组。"
  - id: R149
    module: "导入批次"
    description: "导入批次详情需要把质量问题 ID 变成可钻取链接，进入数据质量详情页追溯失败原因。"
  - id: R150
    module: "生产雏形"
    description: "生产雏形需要验收清单本地模型和测试，覆盖上传/导入、主数据、人员排班、需求预测、登录/状态、差异对比和异常识别。"
  - id: R151
    module: "生产雏形"
    description: "需要生产雏形验收清单只读页，按业务主线展示已覆盖、部分覆盖和暂缓能力。"
  - id: R152
    module: "生产雏形"
    description: "生产雏形总览页需要验收清单入口，使阶段验收不只依赖合同块。"
  - id: R153
    module: "导航"
    description: "侧边栏需要生产雏形验收清单入口，方便本地验收时直接进入。"
  - id: R154
    module: "质量与交付"
    description: "数据质量分组、导入问题钻取和生产雏形验收清单完成后需要 QA 收口，确认测试、页面、导航、current 清理和 no-database 边界均可验证。"
source: "PM requested continued production MVP development on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实上传、真实导入、真实修复、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R205-R214 - 发布冻结与权限审计边界准备

```yaml
requirements:
  - id: R205
    module: "生产雏形"
    description: "生产雏形需要发布冻结与权限审计边界准备本地模型和测试，把排班发布、冻结解冻、权限边界、审计留痕、导出批量暂缓拆成可验收准备步骤。"
  - id: R206
    module: "生产雏形"
    description: "需要发布冻结与权限审计边界准备总览页，展示发布态、冻结、权限、审计和导出批量边界的推荐顺序。"
  - id: R207
    module: "生产雏形"
    description: "需要发布冻结与权限审计边界准备步骤详情页，展示单个治理准备项的输入、输出、触发条件、控制字段、证据页和暂缓能力。"
  - id: R208
    module: "生产雏形"
    description: "排班发布审批缺口详情需要进入治理边界准备步骤，承接发布态和冻结口径的后续开发线索。"
  - id: R209
    module: "生产雏形"
    description: "权限审计缺口详情需要进入治理边界准备步骤，说明权限、审计、导出和批量能力的硬边界。"
  - id: R210
    module: "生产雏形"
    description: "验收清单中的人员排班和主数据详情需要进入治理边界准备步骤，说明发布、冻结和主数据有效期边界。"
  - id: R211
    module: "生产雏形"
    description: "缺口路线图第三批需要进入发布冻结与权限审计边界准备页，帮助从路线图继续推进治理边界。"
  - id: R212
    module: "生产雏形"
    description: "生产雏形总览和总进度需要挂载发布冻结与权限审计边界准备入口，帮助从总览视角进入治理边界准备。"
  - id: R213
    module: "导航"
    description: "侧边栏需要发布冻结与权限审计边界准备入口，方便本地连续验收。"
  - id: R214
    module: "质量与交付"
    description: "发布冻结与权限审计边界准备批次完成后需要 QA 收口，确认测试、页面、导航、current 清理和 no-approval/no-permission/no-export 边界均可验证。"
source: "PM requested continued production MVP development on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实发布、审批、权限体系、审计写入、导出、批量、数据库、自动排班、生产公式、结算规则或 charge factor。"
```

### R195-R204 - 异常识别与复核准备

```yaml
requirements:
  - id: R195
    module: "生产雏形"
    description: "生产雏形需要异常识别与复核准备本地模型和测试，把异常类型、触发条件、归因字段和复核状态拆成可验收准备步骤。"
  - id: R196
    module: "生产雏形"
    description: "需要异常识别与复核准备总览页，展示预测缺口、排班缺口、未登录、迟到早退、状态异常和主数据绑定异常的准备顺序。"
  - id: R197
    module: "生产雏形"
    description: "需要异常识别与复核准备步骤详情页，展示单个异常准备项的输入、输出、触发口径、复核字段、证据页和暂缓能力。"
  - id: R198
    module: "生产雏形"
    description: "异常识别验收详情需要进入异常识别与复核准备步骤，承接异常类型和复核闭环的后续开发线索。"
  - id: R199
    module: "异常闭环"
    description: "异常复核总览页需要挂载异常识别与复核准备入口，帮助从当前复核演示进入生产雏形准备口径。"
  - id: R200
    module: "异常闭环"
    description: "异常来源页需要挂载异常识别与复核准备入口，说明来源链路如何支撑异常归因。"
  - id: R201
    module: "生产雏形"
    description: "缺口路线图第三批需要进入异常识别与复核准备页，帮助从路线图继续推进下一批。"
  - id: R202
    module: "生产雏形"
    description: "生产雏形总览和总进度需要挂载异常识别与复核准备入口，帮助从总览视角进入第三批准备。"
  - id: R203
    module: "导航"
    description: "侧边栏需要异常识别与复核准备入口，方便本地连续验收。"
  - id: R204
    module: "质量与交付"
    description: "异常识别与复核准备批次完成后需要 QA 收口，确认测试、页面、导航、current 清理和 no-approval/no-formula 边界均可验证。"
source: "PM requested continued production MVP development on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实规则引擎、真实复核提交、状态码生产映射、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R185-R194 - 预测版本与实际日志对齐准备

```yaml
requirements:
  - id: R185
    module: "生产雏形"
    description: "生产雏形需要预测版本与实际日志对齐准备本地模型和测试，把预测版本、登录日志、状态日志和对比基准拆成可验收准备步骤。"
  - id: R186
    module: "生产雏形"
    description: "需要预测与实际对齐准备总览页，展示预测版本、登录日志、状态日志和对比基准的推荐顺序、依赖和硬边界。"
  - id: R187
    module: "生产雏形"
    description: "需要预测与实际对齐准备步骤详情页，展示单个步骤的输入、输出、依赖、验收口径、证据页和暂缓能力。"
  - id: R188
    module: "生产雏形"
    description: "需求预测验收详情需要进入对齐准备步骤，承接预测版本和调整记录前置条件。"
  - id: R189
    module: "生产雏形"
    description: "登录/状态验收详情需要进入对齐准备步骤，说明真实日志接入和状态映射边界。"
  - id: R190
    module: "生产雏形"
    description: "差异对比验收详情需要进入对齐准备步骤，说明预测、排班、登录和状态对比基准条件。"
  - id: R191
    module: "生产雏形"
    description: "缺口路线图第二批需要进入预测与实际对齐准备页，帮助从路线图继续推进下一批。"
  - id: R192
    module: "生产雏形"
    description: "生产雏形总览和总进度需要挂载预测与实际对齐准备入口，帮助从总览视图进入第二批准备。"
  - id: R193
    module: "导航"
    description: "侧边栏需要预测与实际对齐准备入口，方便本地连续验收。"
  - id: R194
    module: "质量与交付"
    description: "预测与实际对齐准备批次完成后需要 QA 收口，确认测试、页面、导航、current 清理和 no-integration 边界均可验证。"
source: "PM requested continued production MVP development on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实预测导入、真实登录/状态接口、状态码生产映射、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R175-R184 - 数据导入与主数据闭环准备

```yaml
requirements:
  - id: R175
    module: "生产雏形"
    description: "生产雏形需要数据底座准备本地模型和测试，把上传/导入、字段映射和主数据闭环拆成可验收准备步骤。"
  - id: R176
    module: "生产雏形"
    description: "需要数据底座准备总览页，展示第一批数据闭环准备事项、推荐顺序、依赖和硬边界。"
  - id: R177
    module: "生产雏形"
    description: "需要数据底座准备步骤详情页，展示单个步骤的输入、输出、依赖、验收口径、证据页和暂缓能力。"
  - id: R178
    module: "生产雏形"
    description: "上传/导入验收详情需要进入数据底座准备步骤，承接下一批数据导入准备范围。"
  - id: R179
    module: "生产雏形"
    description: "主数据验收详情需要进入数据底座准备步骤，说明坐席、职场、供应商和绑定关系闭环前置条件。"
  - id: R180
    module: "生产雏形"
    description: "缺口路线图的推荐下一批需要进入数据底座准备页，帮助从缺口优先级进入执行准备视角。"
  - id: R181
    module: "生产雏形"
    description: "生产雏形总览页需要挂载数据底座准备入口，帮助从合同总览进入第一批数据闭环准备。"
  - id: R182
    module: "生产雏形"
    description: "生产雏形总进度页需要挂载数据底座准备入口，帮助从进度视图进入推荐下一批。"
  - id: R183
    module: "导航"
    description: "侧边栏需要数据底座准备入口，方便本地连续验收。"
  - id: R184
    module: "质量与交付"
    description: "数据底座准备批次完成后需要 QA 收口，确认测试、页面、导航、current 清理和 no-database 边界均可验证。"
source: "PM approved continuing the recommended production MVP roadmap batch on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实上传/导入、字段映射保存、主数据 CRUD、冻结解冻、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R218 - 履约日历团队小组个人下钻

```yaml
requirements:
  - id: R218
    module: "履约日历"
    description: "人员时间轴需要升级为履约日历业务入口，支持从团队周履约下钻到小组周履约、小组成员单日三轨矩阵和个人单日三轨详情。团队第一版按职场+项目映射，小组第一版按供应商映射，不新增正式组织架构、数据库、权限、审批、导出、批量或自动排班能力。"
source: "PM approved fulfillment calendar UI design and requested implementation on 2026-05-20"
submitted_at: "2026-05-20"
version: "1.0"
status: "split"
notes: "本组只做本地前端业务查看链路和本地样例聚合；不实现正式团队/小组主数据管理，不接真实外部数据源，不引入数据库、权限、审批、导出、批量、自动排班或生产公式。"
```

### R165-R174 - 缺口优先级和后续批次路线图

```yaml
requirements:
  - id: R165
    module: "生产雏形"
    description: "生产雏形需要缺口优先级本地模型和测试，按业务价值、依赖和实现风险整理仍缺能力。"
  - id: R166
    module: "生产雏形"
    description: "需要生产雏形缺口总览页，展示缺口优先级、业务原因、关联验收项和暂不实现边界。"
  - id: R167
    module: "生产雏形"
    description: "需要生产雏形缺口详情页，展示单个缺口的业务目的、后续验收口径、依赖和暂缓能力。"
  - id: R168
    module: "生产雏形"
    description: "验收清单详情页需要挂载相关缺口入口，使验收问题可进入后续开发线索。"
  - id: R169
    module: "生产雏形"
    description: "生产雏形总进度页需要挂载缺口总览入口，使进度页能进入后续拆批视角。"
  - id: R170
    module: "生产雏形"
    description: "生产雏形需要后续开发批次建议本地模型和测试，把缺口组织成推荐开发顺序。"
  - id: R171
    module: "生产雏形"
    description: "需要缺口路线图只读页面，展示推荐批次、依赖、包含缺口和暂不建议事项。"
  - id: R172
    module: "导航"
    description: "侧边栏需要生产雏形缺口总览入口，方便本地连续验收。"
  - id: R173
    module: "生产雏形"
    description: "生产雏形总览页需要挂载缺口总览入口，方便从合同总览进入后续开发视角。"
  - id: R174
    module: "质量与交付"
    description: "缺口优先级、缺口详情和后续批次路线图完成后需要 QA 收口，确认测试、页面、导航、current 清理和 no-database 边界均可验证。"
source: "PM requested continued production MVP development on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不创建真实缺口工单，不实现真实上传/导入、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```

### R155-R164 - 质量反查、验收缺口 drilldown 和生产雏形总进度

```yaml
requirements:
  - id: R155
    module: "数据质量"
    description: "生产雏形需要单个质量问题反查所属分组的本地模型和测试，保证问题详情能回到业务原因分组。"
  - id: R156
    module: "数据质量"
    description: "数据质量详情页需要展示所属质量分组、分组风险和分组入口。"
  - id: R157
    module: "数据质量"
    description: "数据质量中心需要展示分组覆盖摘要，说明问题清单是否已被业务原因覆盖。"
  - id: R158
    module: "生产雏形"
    description: "生产雏形验收清单需要支持单项 lookup、缺口摘要和后续开发能力列表。"
  - id: R159
    module: "生产雏形"
    description: "需要验收清单单项详情页，展示验收证据、暂缓能力和后续开发缺口。"
  - id: R160
    module: "生产雏形"
    description: "验收清单总览页每个业务主线需要能跳到对应详情页。"
  - id: R161
    module: "生产雏形"
    description: "生产雏形需要总进度本地模型和测试，集中查看已完成本地入口、部分覆盖能力和仍缺生产能力。"
  - id: R162
    module: "生产雏形"
    description: "需要生产雏形总进度只读页，并从生产雏形总览页挂载入口。"
  - id: R163
    module: "导航"
    description: "侧边栏需要生产雏形总进度入口，方便本地连续验收。"
  - id: R164
    module: "质量与交付"
    description: "质量问题反查分组、验收单项详情和生产雏形总进度完成后需要 QA 收口，确认测试、页面、导航、current 清理和 no-database 边界均可验证。"
source: "PM requested continued production MVP development on 2026-05-19"
submitted_at: "2026-05-19"
version: "1.0"
status: "split"
notes: "本组只做本地前端只读展示层和模型测试；不实现真实上传、真实导入、真实修复、数据库、审批、权限、导出、批量、自动排班、生产公式、结算规则或 charge factor。"
```
