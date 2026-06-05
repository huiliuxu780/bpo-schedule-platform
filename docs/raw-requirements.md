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

### R849 - 主数据非客服人员动作收口

```yaml
id: R849
module: "主数据维护 / 页面动作"
description: "客服人员列表的页面级动作已经进入 Header actions，但组织、职场、供应商、技能等非客服人员主数据列表内容区仍保留 `导入主数据` 旧快捷入口。这会把未确认的导入方式继续暴露在列表内容里。需要先移除这些内容区动作，保持非客服人员主数据页只读列表边界，后续导入入口按业务对象单独设计。"
source: "PM approved continuing after IM148 on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM149 已完成：非客服人员主数据列表内容区不再显示 `导入主数据` 或跳转独立上传工作区；客服人员已确认的新建/批量导入继续在 Header actions；本轮未新增 CRUD、导入弹窗、后端、schema/migration、依赖或权限/审批/导出/批量等能力。"
```

### R850 - 导入入口业务归位

```yaml
id: R850
module: "业务导入 / 入口归属"
description: "PM 明确导入不应该继续表现为一个通用导入中心主入口。人员导入应在人员列表，排班导入在排班业务页，预测导入在需求预测业务页，登录/状态日志导入在日志业务页。当前 `/data-quality` 仍显示通用 `上传 CSV` 主按钮，预测、排班、日志页面的导入按钮也塞在内容卡片里并跳向通用上传工作区。需要先收口入口归属，把通用上传页降级为内部兼容路由。"
source: "PM approved continuing after IM149 on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM150 已完成：data-quality 作为导入批次台账不再提供通用 `上传 CSV` 主按钮；预测、排班、登录/状态日志页面级导入动作进入 Header actions 并暂时复用现有预选文件类型上传路由；真正的业务 step-by-step 导入弹窗留给后续复用任务。"
```

### R851 - data-quality 结果页抽象降级

```yaml
id: R851
module: "结果链路 / 页面层级"
description: "PM 明确不接受把导入、版本、对比、复核都包装成一个 `质量中心` 或 `导入中心` 大模块。Sidebar 已经隐藏 data-quality 类一级入口，但业务版本、对比运行、复核案例等结果类页面的 Breadcrumb 仍把 `导入批次` 当作父级模块。需要短期保留兼容路由，同时降低可见模块抽象：批次处理页仍归批次，结果类页面直接呈现自身页面身份，不再表现为导入批次父模块下的子页。"
source: "PM approved continuing after IM150 on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM151 已完成：业务版本列表、对比运行详情、复核案例列表和复核案例详情不再把 `导入批次` 作为 Breadcrumb 父级；批次处理、上传和模板页面继续保留兼容路由和批次上下文；未改结果查询、后端 route、schema/migration、依赖或权限/审批/导出/批量等能力。"
```

### R848 - 旧全局搜索 API 清理

```yaml
id: R848
module: "全局页面结构 / Header"
description: "IM144 已经从 SiteHeader 视觉上移除无意义全局搜索，但 AppShell/SiteHeader 接口和大量页面传参仍保留 searchPlaceholder，后续开发会误以为 Header 仍应该承载全局搜索。需要删除这个旧 API 和页面传参，只保留真正属于列表内容区的业务筛选。"
source: "PM approved continuing after IM147 on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM148 已完成：AppShell/SiteHeader 不再声明、默认或透传 searchPlaceholder；app/components 源码中的旧传参已清理，业务列表内筛选框保留在内容区；不新增 Header 搜索，不改路由、导入弹窗、后端、schema/migration、依赖或权限/审批/导出/批量等能力。"
```

### R845 - 导航信息架构收口

```yaml
id: R845
module: "全局导航 / 计划与排班"
description: "PM 复核后确认，当前 Sidebar 仍把 `预测生产`、`排班生产` 作为一级导航项暴露，这是把实现路径伪装成业务模块。需要先把一级导航收口到业务对象入口，让需求预测和排班相关生产版本继续由各自业务入口高亮承载。"
source: "PM confirmed IM145 execution after UI/product-structure audit on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM145 已完成：Sidebar 不再把 `预测生产`、`排班生产` 暴露为独立导航项；`需求计划` 与 `排班计划` 通过 prefix active 覆盖各自 `/production` 子路由；本轮未改生产页标题、返回按钮、模型文案、导入弹窗、业务路由或后端能力。"
```

### R846 - 生产文案与返回链路清理

```yaml
id: R846
module: "全局文案 / 计划与排班"
description: "PM 复核后确认，虽然 Sidebar 已移除 `预测生产`、`排班生产` 独立入口，但生产概念仍残留在页面标题、返回按钮、台账标题和模型提示中。需要把这些实现路径文案改回业务对象视角，让预测、排班、登录/状态日志继续从对应业务入口承载。"
source: "PM confirmed after IM145 on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM146 已完成：预测、排班、登录/状态日志生产子路由保持兼容，但可见标题、列表标题、返回按钮、缺批次/阻塞/就绪文案改为业务对象视角；本轮未改重复 H1、旧搜索 API、导入弹窗、业务路由、后端 route、schema/migration、依赖、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
```

### R847 - Header/Breadcrumb 与内容区标题统一

```yaml
id: R847
module: "全局页面结构 / Breadcrumb"
description: "PM 复核后指出页面不能在 Header/Breadcrumb 里写一遍，又在内容区同名 H1 再写一遍。需要让列表、详情、新建、编辑页统一由 AppShell/SiteHeader 承载 Breadcrumb 和页面身份，内容区只保留筛选、工具栏、表格、详情分组或业务记录标题。"
source: "PM feedback after IM146 on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM147 已完成：需求计划、排班计划、预测/排班/日志兼容页和 data-quality 兼容页统一传入 breadcrumbItems，内容区同名 H1 已删除或降级；旧 searchPlaceholder API 留给 IM148，不改路由、导入弹窗、后端、schema/migration、依赖或权限/审批/导出/批量等能力。"
```

### R781 - 独立 CSV 上传工作区

```yaml
id: R781
module: "导入中心"
description: "CSV 上传表单现在主要挂在批次处理详情里的导入与模板 tab，用户需要先进入某个已有批次才能看到上传入口。需要新增独立上传工作区，让导入管理员可以从数据质量列表、模板详情或模板管理直接发起上传，并支持 templateId 预选。"
source: "After IM080 and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已新增 /data-quality/uploads/new 独立上传工作区；数据质量列表页提供上传入口，模板详情页在无来源批次时可携带 templateId 进入独立上传页，上传页复用现有 CSV 上传 action、模板 API 和上传表单，并用 tab 区分上传与模板视图；未新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R782 - 独立上传结果回流

```yaml
id: R782
module: "导入中心"
description: "独立 CSV 上传工作区已经建立，但现有 upload action 成功或失败后仍统一回到数据质量列表页。需要让独立上传页提交后回到上传工作区自身，展示成功/失败反馈和新批次处理入口，避免用户上传后还要回列表中查找批次。"
source: "After IM081 and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成独立上传结果回流；独立上传页提交后通过受控返回目标回到 /data-quality/uploads/new，成功/失败反馈保留在上传工作区，成功和可回看失败批次入口直达二级批次处理页；批次详情页上传表单不设置该返回目标，保持原语境；未新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R783 - 单批次导入应用写入入口

```yaml
id: R783
module: "导入中心"
description: "独立上传、失败行修正、模板预选、准备度和批次详情已经打通，但准备度 ready 后仍只能看状态，不能在批次详情页把单个批次应用到对应业务数据。需要在二级批次处理详情页提供受控的单批次应用入口，复用现有 apply API，并在应用后留在当前批次处理语境。"
source: "After IM082 and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成单批次详情页受控应用入口；ready 且未应用批次可调用现有 apply API，阻塞/已应用/准备度未知状态不展示写入按钮，成功/失败后回到当前批次详情页显示反馈；未新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R784 - 批次应用成功结果卡片和下一步入口

```yaml
id: R784
module: "导入中心"
description: "单批次应用入口已经可把 ready 批次写入业务数据，但应用成功后页面仍以通用反馈为主，主管还不能一眼确认生成了哪个业务版本、当前写入到了哪类业务数据、下一步应进入哪个结果链路。需要在二级批次处理详情页把应用成功结果收口成可读结果卡片，并给出明确下一步入口。"
source: "After IM083 and PM confirmed downstream result chain planning on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成二级批次处理详情页的应用成功结果卡片和下一步入口；已应用批次会展示应用目标、生成版本状态和当前可见写入状态，并提供进入版本记录或下游结果追踪的链接；未应用、应用失败、readiness 阻塞或应用摘要缺失时不误报为已生成业务版本；不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R785 - 已应用批次版本结果定位链路

```yaml
id: R785
module: "导入中心"
description: "批次应用成功后即使知道已经生成业务版本，主管仍缺少从当前批次直接进入对应版本上下文的稳定链路，难以继续查看该版本已经产生的对比结果、复核案例或空态。需要补齐从已应用批次进入对应版本详情或结果列表的定位链路。"
source: "After R784 planning confirmation on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成从已应用批次进入对应版本结果上下文的定位链路；支持的排班/预测/状态版本会匹配现有 comparison run 并提供直达入口，结果追踪区新增版本定位上下文，主数据或版本缺失场景保持明确空态/阻塞态；不新增后端接口、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R786 - 版本结果页本地比对计算受控入口

```yaml
id: R786
module: "导入中心"
description: "已应用批次和版本结果链路打通后，主管还需要在版本结果语境里受控地发起一次本地对比计算，避免回退到 API 或其他页面拼接上下文。需要在版本结果页提供受控计算入口，并把计算结果继续带回当前版本结果语境。"
source: "After R785 planning confirmation on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成版本结果页本地比对计算受控入口；结果追踪的版本定位区会在 comparison_type 和来源版本明确时展示 `发起一次本地比对`，提交后将成功/失败反馈带回当前版本语境，并提供进入新 comparison run 详情或结果列表的入口；主数据、版本缺失或上下文不足场景保持阻塞态且不展示写入按钮；复用现有 comparison calculate API 和结果查询能力，不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算、自动排班或收费因子。"
```

### R787 - 业务版本工作台只读台账页

```yaml
id: R787
module: "导入中心"
description: "导入批次应用、结果卡片、版本定位和本地比对入口都已经形成链路，但用户仍缺少一个跨批次、跨数据域的统一版本台账，难以快速确认主数据、排班、预测、登录/状态日志当前各自落在哪个版本、来自哪个批次、现在处于什么阻塞状态。需要在 data-quality 下新增只读业务版本工作台。"
source: "After IM086 and PM confirmed /data-quality/versions direction on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成 /data-quality/versions 只读业务版本台账页和基础导航入口；页面按主数据、人员排班、需求预测、登录/状态日志四类业务域汇总当前版本、来源批次、当前可见时间、阻塞摘要和基础下一步入口，并在数据质量侧边导航新增入口；复用现有 import-batch list API 与前端模型聚合，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R788 - 业务版本工作台稳定跳转链路

```yaml
id: R788
module: "导入中心"
description: "版本工作台第一页建立后，用户还需要从当前版本行稳定进入对应批次详情、结果追踪和已存在的 comparison run，避免再次回到列表手动检索。需要补齐版本工作台到真实页面的稳定跳转链路。"
source: "After R787 planning confirmation on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成版本工作台稳定跳转链路；当前版本行继续保留批次详情主入口，并在已应用且上下文足够明确时补齐结果追踪或 comparison run 次入口；上下文不足的行不再暴露误导性深链。实现复用现有批次列表、comparison run 查询和前端模型定位能力，不新增写入动作、后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R789 - 业务版本工作台下游影响摘要

```yaml
id: R789
module: "导入中心"
description: "版本工作台能看到当前版本和来源批次后，运营负责人还需要一眼知道这个版本已经影响了多少 comparison run、review case，以及当前为什么仍然阻塞。需要在版本工作台补齐下游影响摘要。"
source: "After R788 planning confirmation on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成版本工作台下游影响摘要；/data-quality/versions 现为当前版本行补充 comparison run / review case 只读计数或阻塞解释，并对无版本、无批次、无直接结果链路场景给出明确空态；实现复用现有 comparison runs、review cases 和前端版本定位能力，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R790 - 本地比对触发后的最新运行回看卡片

```yaml
id: R790
module: "导入中心"
description: "在版本结果页发起一次本地比对后，用户虽然能收到成功提示，但还缺少一个稳定的当前页回看卡片，无法快速确认这次运行到底生成了什么规模的结果。需要在结果追踪语境里补一张最新运行结果卡片。"
source: "After R789 completion and PM confirmed the next callback chain on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成结果追踪中的最新运行回看卡片；本地比对成功回跳后，结果追踪会在当前版本语境展示最新一次运行结果卡片，并在运行暂未回显时给出明确阻塞态；复用现有 comparison run 列表与成功回跳 query 参数，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R791 - comparison run detail 作为完整结果回看主页

```yaml
id: R791
module: "导入中心"
description: "当前结果追踪页适合做触发反馈和最近一次运行定位，但完整结果阅读仍应落在 comparison run detail。需要把最新运行回看链路稳定导向 comparison run detail，并在该页强化它作为完整结果回看主页的语义。"
source: "After R790 planning confirmation on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成 comparison run detail 的完整结果回看主页强化；页面现在明确展示完整结果回看主页、当前版本语境、来源版本、业务日和只读下一步检查方式；复用现有 comparison run detail 查询与页面结构，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R792 - comparison run detail 到来源批次与版本台账的回跳闭环

```yaml
id: R792
module: "导入中心"
description: "当用户进入 comparison run detail 看完整结果后，还需要能稳定回到来源批次的结果追踪或版本工作台，否则这条链仍然是单向的。需要补 comparison run detail 的回跳闭环。"
source: "After R791 planning confirmation on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成 comparison run detail 到来源批次结果追踪和版本工作台的回跳闭环；页面会用现有 import batch list 按版本 ID 保守定位来源批次，能定位时提供真实回跳，不能定位时展示阻塞态并保留版本工作台入口；不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R780 - 字段映射模板上传预选链路

```yaml
id: R780
module: "导入中心"
description: "字段映射模板已经可以新增、维护和停用，但模板详情页与 CSV 上传工具之间仍是割裂的。需要让导入管理员从模板详情页直接带着该模板进入批次上传工具，并在上传表单中默认选中该模板。"
source: "After IM079 and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成字段映射模板上传预选链路；批次详情的模板维护入口会携带来源 batchId，模板详情页对启用模板展示用此模板上传入口，批次上传工具读取 templateId 并默认选中可用模板；复用现有上传表单和 template_id 上传能力，不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R762 - 复核案例关闭写入入口

```yaml
id: R762
module: "导入中心"
description: "复核案例详情页已经能展示证据、结论和关闭状态链路，但主管仍不能对证据和结论齐全的 open 案例形成真实关闭记录。现有 closure API 对已存在案例会直接返回 existing detail，无法关闭当前 open 案例。需要修正为可对现有 open 案例写入 closure，并在详情页提供受控关闭入口。"
source: "After IM061 evidence/conclusion chain and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成 existing open case 的受控 closure 写入和复核案例详情页关闭入口；页面只在证据和结论齐全且未关闭时展示提交按钮，已关闭、读取失败或材料缺失时只展示阻塞原因；不新增 schema/migration，不新增依赖，不接真实外部接口，不做证据补录、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R763 - 复核案例证据补录写入入口

```yaml
id: R763
module: "导入中心"
description: "复核案例详情页已经能关闭证据和结论齐全的 open 案例，但材料不足时仍不能补充证据。需要先提供受控证据补录写入入口，让主管能对未关闭案例新增 evidence，再进入后续关闭。"
source: "After IM062 controlled closure entry and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成本地 evidence 写入 API 和详情页受控提交入口；open case 可补充一条证据，closed case 或 case_id 不匹配会阻塞；不新增 schema/migration，不新增依赖，不接真实外部接口，不做结论新增、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R764 - 复核案例结论补充写入入口

```yaml
id: R764
module: "导入中心"
description: "复核案例详情页已经能补充证据，但证据齐全后仍不能补充复核结论，导致关闭前处理链路不完整。需要提供受控结论补充写入入口，让主管能对未关闭案例新增 conclusion，再进入后续关闭。"
source: "After IM063 controlled evidence entry and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "split"
status: "done"
notes: "本轮已完成本地 conclusion 写入 API 和详情页受控提交入口；open case 可补充一条结论，closed case、case_id 不匹配或重复 conclusion_id 会阻塞；不新增 schema/migration，不新增依赖，不接真实外部接口，不做审批、导出、批量、权限、生产公式、结算或收费因子。"
```

## Requirements

### R697-R700 - Q127 数据库基础 QA 收口

```yaml
requirements:
  - id: R697
    description: "数据库基础需要一次 QA 收口，确认 DB002-DB008 的 Alembic head 能创建所有基础表。"
  - id: R698
    description: "数据库基础需要一次最小端到端持久化验证，覆盖 import、master data、schedule、forecast、actual、comparison 和 review closure 链路。"
  - id: R699
    description: "QA 收口需要生成可追溯结论，明确已完成、未完成和仍禁止混入的范围。"
  - id: R700
    description: "Q127 不应修改产品行为、数据库 schema、repository 实现、权限、审批、导出、批量、生产公式、结算或收费因子。"
source: "DB008 review closure foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "只做 QA 验证、测试和追溯；不改生产实现、不接真实外部接口、不新增依赖。"
```

### R693-R696 - DB008 复核闭环记录持久化基础

```yaml
requirements:
  - id: R693
    description: "系统需要持久化主管复核 case，并引用 DB007 的 forecast-vs-schedule 或 schedule-vs-actual 对比结果。"
  - id: R694
    description: "系统需要持久化复核证据记录，包括证据类型、证据位置、提交人、提交时间和备注。"
  - id: R695
    description: "系统需要持久化复核结论和关闭记录，保留结论类型、风险等级、处理人、关闭状态和关闭备注。"
  - id: R696
    description: "DB008 不应扩展到审批流、权限、批量关闭、导出、真实外部证据服务、生产状态码、结算或收费因子。"
source: "DB007 comparison result foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "只做复核闭环记录持久化基础；不接真实外部接口、不新增依赖、不改前端、不做审批权限。"
```

### R689-R692 - DB007 对比结果持久化基础

```yaml
requirements:
  - id: R689
    description: "系统需要持久化 forecast-vs-schedule 对比结果，保留 forecast version、schedule version 和来源 interval/detail 引用。"
  - id: R690
    description: "系统需要持久化 schedule-vs-actual 对比结果，保留 schedule version、actual import version 和来源 schedule/status 引用。"
  - id: R691
    description: "对比结果持久化需要支持结果状态、差异数值和可复跑 run 标识，方便后续异常引擎读取。"
  - id: R692
    description: "DB007 不应扩展到真实计算调度、异常复核写入、审批、权限、导出、批量、生产公式、结算或收费因子。"
source: "DB006 actual log foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "只做对比结果持久化基础；不接真实外部接口、不新增依赖、不改前端、不做异常闭环动作。"
```

### R685-R688 - DB006 登录/状态日志持久化基础

```yaml
requirements:
  - id: R685
    module: "生产持久化"
    description: "登录日志需要落库登录、登出事件，并关联 DB002 导入版本和 DB003 主数据员工。"
  - id: R686
    module: "生产持久化"
    description: "状态日志需要落库状态区间，支持跨天切分、业务日和时区校验。"
  - id: R687
    module: "生产持久化"
    description: "状态日志需要状态字典映射，将外部状态码映射为内部状态分类。"
  - id: R688
    module: "生产持久化"
    description: "DB006 不应扩展到排班对比、预测对比、异常复核、权限、审批、导出、批量或生产公式。"
source: "DB005 demand forecast foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只授权登录/状态日志持久化基础：login events, logout events, status intervals, business-day normalization, timezone checks, and status dictionary mapping."
```

### R681-R684 - DB005 需求预测持久化基础

```yaml
requirements:
  - id: R681
    module: "生产持久化"
    description: "需求预测需要落库预测版本，并关联 DB002 导入版本。"
  - id: R682
    module: "生产持久化"
    description: "需求预测需要按日期、0.5h 时段、职场、项目、技能和等级保存预测人数。"
  - id: R683
    module: "生产持久化"
    description: "需求预测需要校验主数据职场、项目和技能引用，并记录版本变更来源。"
  - id: R684
    module: "生产持久化"
    description: "DB005 不应扩展到登录状态、对比计算、异常复核、权限、审批、导出、批量或生产公式。"
source: "DB004 personnel schedule foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只授权需求预测持久化基础：forecast versions, forecast interval rows, workplace/project/skill/level demand alignment, import source references, and version change tracking."
```

### R677-R680 - DB004 人员级排班持久化基础

```yaml
requirements:
  - id: R677
    module: "生产持久化"
    description: "人员级排班需要先落库排班版本和人员排班明细，并关联 DB002 导入版本。"
  - id: R678
    module: "生产持久化"
    description: "人员排班明细需要引用主数据员工、项目、职场和技能，并校验引用存在、未冻结且有效。"
  - id: R679
    module: "生产持久化"
    description: "人员排班需要引用班次类型，并把排班明细展开为 0.5h 区间记录。"
  - id: R680
    module: "生产持久化"
    description: "DB004 不应扩展到需求预测、登录状态、对比计算、异常复核、权限、审批、导出、批量或生产公式。"
source: "DB003 master data foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只授权人员级排班持久化基础：schedule versions, personnel schedule details, shift types, half-hour expansion, and import/master-data reference checks."
```

### R673-R676 - DB003 主数据持久化基础

```yaml
requirements:
  - id: R673
    module: "生产持久化"
    description: "主数据需要先落库坐席、职场、供应商、项目和技能，作为后续人员排班、预测对齐和日志对比的引用基础。"
  - id: R674
    module: "生产持久化"
    description: "主数据绑定关系需要记录坐席与供应商、职场、项目、技能之间的有效关系，并支持有效期校验。"
  - id: R675
    module: "生产持久化"
    description: "主数据需要支持冻结状态，冻结或不存在的引用不能被绑定关系误用。"
  - id: R676
    module: "生产持久化"
    description: "DB003 不应扩展到人员排班、预测、登录状态、异常复核、权限、审批、导出、批量或生产公式。"
source: "DB002 database foundation follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只授权主数据持久化基础：employees, suppliers, workplaces, projects, skills, bindings, effective dates, freeze status, and reference checks."
```

### R669-R672 - DB002 导入持久化基础前置确认

```yaml
requirements:
  - id: R669
    module: "生产持久化"
    description: "DB002 开始前必须确认数据库引擎和本地运行方式，避免在未知环境下创建连接和 migration。"
  - id: R670
    module: "生产持久化"
    description: "DB002 开始前必须确认是否允许修改 package/lockfile 以引入数据库、ORM 或 migration 依赖。"
  - id: R671
    module: "生产持久化"
    description: "DB002 开始前必须确认 migration 工具和测试数据库方案，确保导入批次持久化可验证。"
  - id: R672
    module: "生产持久化"
    description: "DB002 的首批实现范围限定为导入批次、导入行结果、失败行明细和导入生成版本记录。"
source: "DB001 database Gate follow-up on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "PM 已确认 PostgreSQL、SQLAlchemy、Alembic、依赖变更和本地隔离测试库口径；DB002 已按该范围实现导入批次、行结果、失败行明细和导入生成版本记录持久化。"
```

### R665-R668 - 数据库 Gate 规划与首批落库拆解

```yaml
requirements:
  - id: R665
    module: "生产持久化"
    description: "PM 已确认进入数据库 Gate，需要先明确数据库落库边界、禁止混入的生产能力和首批可执行范围。"
  - id: R666
    module: "生产持久化"
    description: "数据库 Gate 需要先按业务依赖顺序拆分：导入批次、失败行、版本记录、主数据、人员排班、预测、登录状态、异常、复核记录。"
  - id: R667
    module: "生产持久化"
    description: "首批落库建议从导入批次、成功/失败行和版本记录开始，因为后续主数据、排班、预测、登录状态和异常都依赖导入来源。"
  - id: R668
    module: "质量与交付"
    description: "数据库 Gate 规划需要有明确验收方式：本轮只交付文档、Harness 任务和实施计划，不创建数据库连接、ORM、migration、schema 或生产配置。"
source: "PM confirmed database Gate after local supervisor handling-record chain on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本组只做数据库 Gate 规划和执行拆解，不实施数据库持久化；下一步 DB002 开始前必须再次确认具体数据库环境、依赖和 migration 策略。"
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

### R701 - 真实导入中心 CSV 上传 API 第一刀

```yaml
id: R701
module: "导入中心"
description: "数据库底座合入 main 后，系统需要第一条真实 CSV 上传解析纵切：API 接收 CSV 内容、应用字段映射、生成导入批次、行级成功/失败结果和 import version，以便后续主数据、排班、预测、登录日志和状态日志可以从真实文件内容进入持久化链路。"
source: "PM requested merge main then continue with subagent development on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做无新增依赖的 text/csv 原始请求体上传和本地持久化 API；不做 multipart/Excel、外部 CORN/HR/WFM 接入、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
```

### R702 - 主数据导入应用到 DB003 repository

```yaml
id: R702
module: "导入中心"
description: "CSV 上传批次已经能生成行级结果和 import version 后，系统需要把 master_data 批次中的成功行应用到 DB003 主数据 repository，生成员工、职场、供应商、项目、技能和绑定关系的可维护基础数据。"
source: "PM confirmed continuing import-center production flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只应用已持久化的 master_data CSV 成功行；不新增 schema/migration，不做 CRUD UI，不做权限、审批、导出、批量、外部集成、生产公式、结算或收费因子。"
```

### R703 - 人员排班导入应用到 DB004 repository

```yaml
id: R703
module: "导入中心"
description: "主数据导入应用完成后，系统需要把 personnel_schedule 批次中的成功行应用到 DB004 人员排班 repository，生成排班版本、班次类型、人员排班明细和 0.5h 展开区间。"
source: "PM continued import-center production flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只应用已持久化的 personnel_schedule CSV 成功行；不新增 schema/migration，不做排班维护 UI、发布/冻结、权限、审批、导出、批量调班、外部集成、自动排班、生产公式、结算或收费因子。"
```

### R704 - 需求预测导入应用到 DB005 repository

```yaml
id: R704
module: "导入中心"
description: "人员排班导入应用完成后，系统需要把 demand_forecast 批次中的成功行应用到 DB005 需求预测 repository，生成 forecast version、0.5h forecast intervals 和版本变更记录。"
source: "PM continued import-center production flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只应用已持久化的 demand_forecast CSV 成功行；不新增 schema/migration，不做预测算法、预测 UI、权限、审批、导出、批量、外部集成、自动排班、生产公式、结算或收费因子。"
```

### R705 - 登录/状态日志导入应用到 DB006 repository

```yaml
id: R705
module: "导入中心"
description: "需求预测导入应用完成后，系统需要把 login_log 与 status_log 批次中的成功行应用到 DB006 实际日志 repository，生成登录/登出事件、状态字典和状态区间，为后续排班 vs 实际对比提供生产雏形输入。"
source: "PM continued import-center production flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只应用已持久化的 login_log/status_log CSV 成功行；不新增 schema/migration，不做 CORN/HR/WFM 外部接入、状态码生产规则、权限、审批、导出、批量、自动排班、生产公式、结算或收费因子。"
```

### R706 - 对比计算触发到 DB007 repository

```yaml
id: R706
module: "对比计算"
description: "导入中心已经能把预测、排班和实际日志应用到各自 repository 后，系统需要一个本地可复跑的对比计算入口，把 forecast vs schedule 和 schedule vs actual 计算结果写入 DB007 comparison repository。"
source: "PM continued production-usefulness flow on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做本地计算触发和 DB007 结果写入；不新增 schema/migration，不做外部 CORN/HR/WFM 接入，不做生产状态码/公式定版、权限、审批、导出、批量、自动排班、结算或收费因子。"
```

### R707 - 复核闭环写入到 DB008 repository

```yaml
id: R707
module: "复核闭环"
description: "对比计算已经能生成 DB007 异常结果后，系统需要一个本地复核闭环写入 API，把主管复核 case、证据、结论和关闭记录写入 DB008 repository，形成可追溯处理记录。"
source: "PM approved continuing with IM007 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做本地 DB008 写入纵切；不新增 schema/migration，不做审批流、权限、批量关闭、导出、外部证据服务、生产公式、结算或收费因子。"
```

### R708 - 持久化结果查询 API 收口

```yaml
id: R708
module: "结果查询"
description: "对比计算和复核闭环已经能写入 DB007/DB008 后，系统需要只读 API 按 run_id/case_id 读回已持久化详情，支撑后续页面或接口消费真实闭环结果。"
source: "PM approved continuing with IM008 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做本地只读查询 API；不新增 schema/migration，不做模板持久化、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R709 - 持久化结果列表筛选 API 第一刀

```yaml
id: R709
module: "结果查询"
description: "单条持久化结果已经能按 id 读回后，系统需要列表和基础筛选能力，让主管可以按业务日、类型、状态、owner 等维度找到 DB007 对比 run 和 DB008 复核 case。"
source: "PM approved continuing with IM009 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做本地只读列表筛选 API；不新增 schema/migration，不做分页、前端、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R710 - 计算与复核写入幂等重跑保护第一刀

```yaml
id: R710
module: "结果写入"
description: "对比计算和复核闭环已经具备写入、单查和列表后，需要先保护重复请求：相同 run_id 的计算、相同 case_id 的复核写入应直接返回已有结果，避免重复点击造成重复写入或错误噪音。"
source: "PM approved starting IM010 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 comparison calculate 与 review closure write 的天然业务键幂等；不新增 schema/migration，不做导入 apply 重跑、幂等表、任务队列、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R711 - 主数据导入应用幂等重跑保护第一刀

```yaml
id: R711
module: "导入中心"
description: "主数据导入应用已经能把 master_data 成功行写入 DB003 后，需要先保护同一批次重复应用：已应用批次应直接返回已有应用摘要，避免重复写入逻辑和操作噪音。"
source: "PM approved continuing with IM011 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 master_data apply 幂等；不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R712 - 人员排班导入应用幂等重跑保护第一刀

```yaml
id: R712
module: "导入中心"
description: "人员排班导入应用已经能把 personnel_schedule 成功行写入 DB004 后，需要保护同一批次重复应用：已应用批次应直接返回已有应用摘要，避免重复写 schedule version、shift type、schedule detail 和 0.5h interval。"
source: "PM approved continuing with IM012 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 personnel_schedule apply 幂等；不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R713 - 需求预测导入应用幂等重跑保护第一刀

```yaml
id: R713
module: "导入中心"
description: "需求预测导入应用已经能把 demand_forecast 成功行写入 DB005 后，需要保护同一批次重复应用：已应用批次应直接返回已有应用摘要，避免重复写 forecast version、forecast interval 和 forecast change。"
source: "PM approved continuing with IM013 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 demand_forecast apply 幂等；不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R714 - 实际日志导入应用幂等重跑保护第一刀

```yaml
id: R714
module: "导入中心"
description: "实际日志导入应用已经能把 login_log 和 status_log 成功行写入 DB006 后，需要保护同一批次重复应用：已应用批次应直接返回已有应用摘要，避免重复写 login event、status dictionary 和 status interval。"
source: "PM approved continuing with IM014 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做 login_log/status_log apply 幂等；不新增 schema/migration，不做其他导入类型幂等、幂等表、任务队列、前端、权限、审批、导出、批量、生产状态码规则、结算或收费因子。"
```

### R715 - 导入批次应用结果查询摘要第一刀

```yaml
id: R715
module: "导入中心"
description: "导入应用链路已经能写入并具备幂等后，系统需要一个只读查询入口，按 batch_id 返回当前批次是否已应用、对应应用目标、导入版本和可判断的落库记录数，支撑后续页面展示真实应用状态。"
source: "PM approved continuing after IM014 on 2026-05-28"
submitted_at: "2026-05-28"
version: "1.0"
status: "split"
notes: "本轮只做只读应用摘要 API；不新增 schema/migration，不做模板持久化、字段映射 CRUD、前端、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R716 - 字段映射模板持久化第一刀

```yaml
id: R716
module: "导入中心"
description: "导入中心已经支持一次性 field_mapping JSON 上传，但真实导入流程需要保存并复用字段映射模板，避免每次上传都手工传完整映射。"
source: "PM approved IM016 field-mapping template persistence on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做字段映射模板持久化、只读列表/单查和 upload-csv 按 template_id 复用；不做前端、Excel/multipart、外部集成、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R717 - 导入失败行修正第一刀

```yaml
id: R717
module: "导入中心"
description: "导入中心已经能记录失败行和复用字段映射模板后，需要先支持单行失败数据修正，让数据管理员把错误行修正为可应用的成功行，而不是只能重新上传整批文件。"
source: "PM requested continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做 failed row 单行原地修正和批次计数重算；不新增 schema/migration，不做修正历史表、前端、批量修正、自动 apply、Excel/multipart、权限、审批、导出、外部集成、生产公式、结算或收费因子。"
```

### R718 - 导入批次列表与应用状态查询第一刀

```yaml
id: R718
module: "导入中心"
description: "导入中心已经具备上传、模板复用、失败行修正和单批次应用摘要后，需要一个批次列表查询入口，让数据管理员按批次查看上传结果、版本数量和是否已应用，支撑导入中心进入真实可用的日常查看闭环。"
source: "PM approved continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做只读批次列表和状态聚合；不新增 schema/migration，不做前端、分页、导出、批量、权限、审批、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R719 - 字段映射模板更新与停用第一刀

```yaml
id: R719
module: "导入中心"
description: "字段映射模板已经可以创建、列表、单查并被 upload-csv 复用后，需要支持修正模板名称/字段映射以及停用错误模板，避免数据管理员只能新建模板或继续误用旧模板。"
source: "PM approved continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做字段映射模板更新和软停用；不新增 schema/migration，不做前端、物理删除、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R720 - 导入批次应用前就绪校验第一刀

```yaml
id: R720
module: "导入中心"
description: "导入中心已经具备上传、失败行修正、批次状态列表、模板维护和应用摘要后，需要一个应用前只读就绪校验，明确哪些批次可以应用，哪些批次因为失败行、无成功行、缺导入版本或已应用而不应继续执行。"
source: "PM requested push then continue import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做应用前只读就绪判断；不新增 schema/migration，不做自动 apply、前端、深度主数据校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R721 - 导入批次应用前行级字段预检第一刀

```yaml
id: R721
module: "导入中心"
description: "导入中心已经具备批次级 apply-readiness 判断后，需要在应用前进一步暴露成功行的字段级阻塞原因，避免缺少标准字段的成功行进入 apply 时才失败。"
source: "PM requested continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做应用前只读行级字段预检；不新增 schema/migration，不做自动 apply、前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R722 - 导入应用前 readiness 安全闸第一刀

```yaml
id: R722
module: "导入中心"
description: "导入中心已经能只读判断批次 apply-readiness 后，需要让导入应用接口在写入业务仓储前复用该判断，阻止失败行、缺版本或字段缺口数据进入业务表。"
source: "PM requested continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做 apply 前 readiness 安全闸；保留已应用批次的 already_applied 幂等返回；不新增 schema/migration，不做前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R723 - 人员排班与实际日志应用前 readiness 安全闸第一刀

```yaml
id: R723
module: "导入中心"
description: "master_data 和 demand_forecast apply 已经具备写入前 readiness 安全闸后，需要把同样口径补到 personnel_schedule 和 login/status-log apply，形成四类导入应用的一致安全拦截。"
source: "PM requested continuing import-center production usability on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做 personnel_schedule 与 login/status-log apply 前 readiness 安全闸；保留已应用批次的 already_applied 幂等返回；不新增 schema/migration，不做前端、深度主数据引用校验、批量、权限、审批、导出、外部集成、Excel/multipart、生产公式、结算或收费因子。"
```

### R724 - 导入中心前端 API 接入第一刀

```yaml
id: R724
module: "导入中心"
description: "导入中心后端已经具备批次列表、应用摘要、readiness 和 apply 安全闸后，需要先让前端导入中心页面读取真实本地 API，而不是继续停留在缺页或静态展示状态。"
source: "PM requested continuing production usability and visibility on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端只读 API 接入、导航入口和加载/空/错误状态；不新增依赖，不做上传写入、apply 写操作、后端、schema/migration、权限、审批、导出、批量、外部集成、生产公式、结算或收费因子。"
```

### R725 - 导入中心 CSV 上传表单第一刀

```yaml
id: R725
module: "导入中心"
description: "导入中心前端已经能读取真实批次和 readiness 后，需要先接入现有 CSV 上传 API，让数据管理员可以从页面选择本地 CSV 文件并生成导入批次。"
source: "PM requested continuing production usability after IM024 on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端 CSV 文件读取、Next server action 请求组合和现有 upload-csv API 调用；不新增依赖，不做 Excel/multipart、apply 写操作、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R726 - 导入中心失败行列表与单行修正 UI 第一刀

```yaml
id: R726
module: "导入中心"
description: "导入中心前端已经能上传 CSV 并读取批次/readiness 后，需要把失败行明细和现有单行修正 API 接到页面上，让数据管理员可以直接看到失败原因并提交一行修正。"
source: "PM requested continuing production usability after IM025 on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端失败行列表、修正请求组合和现有 row correction API 调用；不新增依赖，不做批量修正、apply 写按钮、后端、schema/migration、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
```

### R727 - 导入中心字段映射模板选择第一刀

```yaml
id: R727
module: "导入中心"
description: "导入中心前端已经能上传 CSV 和修正失败行后，需要在上传时复用现有字段映射模板，让数据管理员不用每次手填 field_mapping JSON，也能继续保留手填路径作为模板缺失或 API 异常时的兜底。"
source: "PM requested continuing import-center production usability after IM026 on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端读取字段映射模板、上传表单选择 template_id 和手填 JSON 兜底；不新增依赖，不做模板 CRUD UI、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R728 - 导入中心批次明细 drilldown 第一刀

```yaml
id: R728
module: "导入中心"
description: "导入中心前端已经能读取批次、上传 CSV、修正失败行并选择字段映射模板后，需要对选中批次展示更完整的只读明细，让数据管理员能直接查看版本、全部行结果和标准字段预览，减少只看汇总和失败行时的排查断点。"
source: "PM requested continuing import-center production usability after IM027 on 2026-05-29"
submitted_at: "2026-05-29"
version: "1.0"
status: "split"
notes: "本轮只做前端 persisted detail 只读 drilldown；不新增依赖，不做后端、schema/migration、apply 写按钮、批量修正、模板 CRUD、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
```

### R729 - 导入中心失败行修正结果反馈打磨

```yaml
id: R729
module: "导入中心"
description: "导入中心前端已经能展示失败行并提交单行修正后，需要把修正成功、修正失败、剩余失败行和下一步处理提示做成主管/数据管理员可读的结果摘要，减少修正后不知道是否还要继续处理的断点。"
source: "PM requested continuing import-center production usability after IM028 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端修正结果摘要和模型 helper；不新增依赖，不做后端、schema/migration、批量修正、apply 写按钮、模板 CRUD、审批、导出、权限、外部集成、生产公式、结算或收费因子。"
```

### R730 - 导入中心字段映射模板只读管理可见性

```yaml
id: R730
module: "导入中心"
description: "导入中心前端已经能选择字段映射模板上传 CSV 后，需要把模板库存、启用状态、覆盖文件类型和映射字段摘要展示出来，让数据管理员知道当前可复用模板是否覆盖后续导入工作。"
source: "PM requested continuing import-center production usability after IM029 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端只读模板管理可见性；不新增依赖，不做模板新增/编辑/停用按钮、后端、schema/migration、审批、导出、权限、批量、外部集成、生产公式、结算或收费因子。"
```

### R731 - 导入中心上传前模板适配提示

```yaml
id: R731
module: "导入中心"
description: "导入中心前端已经能选择模板并查看模板库存后，需要在上传前提示不同文件类型的模板匹配情况、推荐模板和无模板兜底路径，避免数据管理员上传前不知道该选哪个模板。"
source: "PM requested continuing import-center production usability after IM030 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端上传前模板适配提示和 data-quality 可见性修复；不新增依赖，不做后端、schema/migration、模板 CRUD、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R732 - 导入中心应用前行动建议

```yaml
id: R732
module: "导入中心"
description: "导入中心前端已经能读取准备度、失败行、行级阻塞和版本状态后，需要把这些状态转成应用前行动建议，让数据管理员知道下一步应先修正、补字段、复核版本还是查看已应用结果。"
source: "PM requested continuing import-center production usability after IM031 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端只读行动建议和模型 helper；不新增依赖，不做 apply 写按钮、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R733 - 导入中心异常态处理建议

```yaml
id: R733
module: "导入中心"
description: "导入中心前端已经能上传、读取批次、读取模板、查看准备度和应用前建议后，需要把批次 API、准备度 API、模板 API、暂无批次、暂无模板这些前置异常收敛成同一组处理建议，减少数据管理员在多个区域之间排查的断点。"
source: "PM requested continuing import-center production usability after IM032 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端只读异常态处理建议和模型 helper；不新增依赖，不做 apply 写按钮、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R734 - 导入中心上传结果批次入口

```yaml
id: R734
module: "导入中心"
description: "导入中心前端已经能上传 CSV 并回到数据质量页后，需要把上传成功或失败的结果转成明确批次入口和下一步提示，让数据管理员能直接跳到接入批次、失败行、批次明细和应用准备度，而不是只看到一个状态徽标。"
source: "PM requested continuing import-center production usability after IM033 on 2026-05-31"
submitted_at: "2026-05-31"
version: "1.0"
status: "split"
notes: "本轮只做前端上传结果导航提示和模型 helper；不新增依赖，不做 apply 写按钮、后端、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R735 - 导入中心接入批次筛选

```yaml
id: R735
module: "导入中心"
description: "导入中心前端已经能展示接入批次、上传结果、失败行和应用准备度后，需要在接入批次列表上提供文件类型、处理状态、应用状态和关键词筛选，让数据管理员能快速定位上传历史中的失败批次、未应用批次或特定上传人/文件。"
source: "PM requested continuing import-center production usability after IM034 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端本地批次筛选和模型 helper；不新增依赖，不做后端查询参数、schema/migration、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R736 - 导入中心选中批次处理导览

```yaml
id: R736
module: "导入中心"
description: "导入中心前端已经能筛选接入批次、查看批次明细、失败行和应用准备度后，需要在选中批次后给出只读处理导览，并提供到批次明细、失败行修正和应用准备度的快速定位，减少数据管理员在同一页内寻找下一步的断点。"
source: "PM requested continuing import-center production usability after IM035 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读批次处理导览、锚点定位和模型 helper；不新增依赖，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R737 - 导入中心应用状态概览

```yaml
id: R737
module: "导入中心"
description: "导入中心前端已经能查看选中批次、应用准备度和批次处理导览后，需要把应用状态、应用目标、导入版本和已应用记录数汇总成只读概览，让数据管理员不用在批次列表和准备度详情之间来回拼状态。"
source: "PM requested continuing import-center production usability after IM036 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读应用状态概览和模型 helper；不新增依赖，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R738 - 导入中心批次明细可读性增强

```yaml
id: R738
module: "导入中心"
description: "导入中心已经能展示批次明细、全部行结果和应用状态后，需要让批次明细先给出处理摘要、下一步建议，并在行表中直接暴露错误字段，减少数据管理员从 JSON 预览和错误码中反推问题的成本。"
source: "PM requested continuing import-center production usability after IM037 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读批次明细可读性增强和模型 helper；不新增依赖，不做后端、schema/migration、apply 写按钮、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R739 - 导入中心数据质量到履约异常追踪可见性

```yaml
id: R739
module: "导入中心"
description: "导入中心已经能展示批次明细、错误字段和应用状态后，需要把当前批次的数据质量问题映射成会影响的履约异常判断范围，让数据管理员知道失败行、警告行或版本缺口会阻塞哪些后续异常闭环。"
source: "PM requested continuing import-center production usability after IM038 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读质量到异常影响追踪和模型 helper；不新增依赖，不做后端、schema/migration、真实异常查询、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R740 - 导入中心应用结果到下游结果导航

```yaml
id: R740
module: "导入中心"
description: "导入中心已经能展示应用状态、批次明细和数据质量到履约异常的影响追踪后，需要把已应用或未应用批次转成下游对比结果、复核案例和前置修正的只读导航，让数据管理员知道导入完成后该继续追踪哪里。"
source: "PM requested continuing import-center production usability after IM039 and requested installing shadcn skills before continued frontend development on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "split"
notes: "本轮只做前端只读下游结果导航和模型 helper；不新增依赖，不做后端、schema/migration、真实异常查询、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R741 - 数据质量页信息架构重构

```yaml
id: R741
module: "导入中心"
description: "数据质量页已经承载导入、模板、批次、准备度、应用状态、下游导航、批次明细和失败行修正后，页面变成纵向堆叠的长页面。需要把展示层级重构为批次工作台、状态检查器和分层详情，提升生产工具可读性。"
source: "PM criticized the long single-page layout and requested starting a UI/product structure correction on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端信息架构和组件边界重构；不新增依赖，不新增业务能力，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R742 - 数据质量页下游结果列表可见性

```yaml
id: R742
module: "导入中心"
description: "数据质量页已经有下游结果导航和分层详情后，需要把选中批次业务日关联的对比结果与复核案例列表直接展示出来，让数据管理员不用只点 API 链接，也能在页面内判断下游业务闭环是否已有结果。"
source: "PM requested continuing import-center production usability after IM041A on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端只读结果列表可见性和模型 helper；复用已有 comparison-runs/review-cases 列表 API，不新增依赖，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R743 - 数据质量批次处理详情页拆分

```yaml
id: R743
module: "导入中心"
description: "数据质量页仍然把批次定位、状态摘要、批次明细、失败行修正、结果追踪和导入模板放在同一个长页面里。需要把具体查看和处理拆到单独批次处理详情页，让列表页只负责找批次和进入详情。"
source: "PM challenged long single-page data-quality layout and requested separate detail page on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端路由和信息架构拆分；复用已有组件和本地 API 客户端口径，不新增依赖，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R744 - 数据质量批次二级详情导航修正

```yaml
id: R744
module: "导入中心"
description: "数据质量批次处理页拆分后，列表页仍保留状态检查器，且详情路径像三级页面，返回列表不够顺滑。需要把状态检查器完全移入批次详情页，并把具体处理页调整为 `/data-quality/[batchId]` 二级页面。"
source: "PM feedback that detail page is not a second-level page, returning to the list is not smooth, and status checker should not live on the list page on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端路由、页面层级和导航修正；保留旧详情路径兼容跳转，不新增依赖，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R745 - 数据质量批次详情单列处理流重设计

```yaml
id: R745
module: "导入中心"
description: "数据质量批次详情页改成二级页面后，状态检查器和分层详情仍以左右分栏呈现，导致核心处理区域被压窄、层级概念不业务化。需要重设计为单列处理流程：顶部批次信息、处理总览、全宽批次处理工作区。"
source: "PM rejected the left-right split detail layout and requested redesign on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做前端页面布局和业务文案重构；使用现有 shadcn Card/Tabs/Badge/Button，不新增依赖，不做后端、schema/migration、真实外部接口、复核写入、审批、导出、批量、权限、外部集成、生产公式、结算或收费因子。"
```

### R746 - 字段映射模板适配详情

```yaml
id: R746
module: "导入中心"
description: "批次详情页的导入与模板区域仍主要展示模板库存，缺少按当前批次文件类型判断模板是否匹配、推荐哪个模板、覆盖哪些标准字段、缺哪些关键字段的业务化说明。需要在详情页内补充只读模板适配详情。"
source: "PM asked to continue production-usability work after batch detail page redesign on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读模板适配和字段映射详情展示；不新增模板 CRUD 写入，不新增依赖，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R747 - 应用准备度问题分组

```yaml
id: R747
module: "导入中心"
description: "批次详情页的状态检查仍把 blockers、row_blockers、版本和应用状态分散展示，主管难以判断先处理哪类问题。需要把应用准备度阻塞按失败行、行级必填字段、版本/应用状态和其他批次阻塞分组，并给出下一步。"
source: "Current recommendation after IM046 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读问题分组；不新增应用写入按钮、不做批量处理、审批、导出、权限、后端、schema/migration、真实外部接口、生产公式、结算或收费因子。"
```

### R748 - 批次详情下游结果追踪 drilldown

```yaml
id: R748
module: "导入中心"
description: "批次详情页已经能展示对比结果和复核案例列表，但还缺少对当前批次是否已经进入下游闭环、应该先看哪个结果、阻塞在哪里的判断。需要在结果追踪页签补充只读 drilldown 判断。"
source: "Current recommendation after IM047 and PM requested continuing development on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读下游结果 drilldown；不新增依赖，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R749 - 数据质量到异常反向聚合 drilldown

```yaml
id: R749
module: "导入中心"
description: "批次详情页已经能看到下游结果判断，但还缺少从异常影响反推导入质量问题的聚合视角。需要把失败/警告行按错误字段和错误原因分组，并关联当前业务日已有对比结果与复核案例，提示先处理影响候选最大的质量问题。"
source: "Current recommendation after IM048 and PM requested continuing development on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读质量影响聚合；不新增依赖，不做后端、schema/migration、复核写入、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R750 - shadcn/ui 自动化验证链路

```yaml
id: R750
module: "Harness"
description: "前端开发必须把 shadcn/ui 规则并入自动化验证链路，避免后续继续手写不符合 shadcn 约束的布局、颜色和半径样式。"
source: "PM requested merging shadcn skill checks into automated verification on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮只做本地验证脚本和 check.sh 集成；不新增依赖，不调用远程 shadcn CLI 作为硬依赖，不修改产品 UI、后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R751 - 复核结论预览只读 drilldown

```yaml
id: R751
module: "导入中心"
description: "批次详情页已有下游结果、质量影响和复核案例列表，但主管仍缺少可直接阅读的复核结论草案。需要在结果追踪页签补充只读结论预览，汇总建议结论、关键证据和残余风险。"
source: "PM agreed to continue with read-only review conclusion preview after IM050 on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读复核结论预览；不新增复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R752 - 复核证据缺口只读 drilldown

```yaml
id: R752
module: "导入中心"
description: "批次详情页已经能生成复核结论预览，但主管仍缺少证据缺口视角，无法快速判断哪些未关闭复核案例缺少证据、缺口由谁处理、会影响哪些质量问题。需要在结果追踪页签补充只读证据缺口 drilldown。"
source: "PM asked to continue after IM051 and prior Done Report recommended review evidence gap drilldown on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读证据缺口展示；不新增证据补录、复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R753 - 复核案例工作台二级页

```yaml
id: R753
module: "导入中心"
description: "批次详情页已经加入复核结论和证据缺口，但复核案例仍夹在详情页结果追踪中，容易继续形成超长单页。需要把复核案例查看和处理定位拆成独立二级工作台，支持筛选、分组和从批次详情页跳转。"
source: "PM agreed to split review-case detail and handling into a separate second-level page on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读复核案例工作台；不新增证据补录、复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R754 - 质量问题到复核案例聚焦

```yaml
id: R754
module: "导入中心"
description: "复核案例已经拆到二级工作台，但批次详情里的质量影响聚合还只能提示回看复核案例，缺少直接跳转并聚焦相关复核案例的入口。需要让每个质量问题组生成到复核案例工作台的只读聚焦链接。"
source: "Current recommendation after IM053 and PM asked to continue on 2026-06-01"
submitted_at: "2026-06-01"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读跳转聚焦；质量问题组可跳到复核案例二级工作台并带入业务日、未关闭状态、来源类型和关键词焦点；不新增证据补录、复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R755 - 复核案例详情页

```yaml
id: R755
module: "导入中心"
description: "复核案例工作台已经拆成二级页，但单个复核案例仍缺少独立详情页。需要从列表进入只读详情，集中展示案例摘要、来源结果、质量问题焦点、证据缺口和下一步建议，避免把处理信息继续塞回列表页。"
source: "Current recommendation after IM054 and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读详情页和复核案例列表入口；详情页展示摘要、来源、质量焦点、证据缺口、证据/结论记录和只读处理边界；不新增证据补录、复核关闭写入，不做后端、schema/migration、真实外部接口、审批、导出、批量、权限、生产公式、结算或收费因子。"
```

### R756 - 复核案例详情正常态数据准备

```yaml
id: R756
module: "导入中心"
description: "复核案例详情页已经拆成二级页，但当前本地数据库没有复核案例记录，页面只能展示 API 404 错误态。需要一个受控的本地 smoke 数据准备能力，复用现有 DB007/DB008 repository 和 schema 生成一条可查看的 CASE-QUERY-001，便于验收真实读取链路。"
source: "After IM055 page smoke found current backend has no review case data and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成本地 smoke 数据准备 helper 和测试；`seed_review_case_demo()` 可生成 `CASE-QUERY-001`、来源对比结果、证据和结论，重复执行返回已存在案例；不新增 schema/migration，不新增依赖，不接真实外部接口，不做权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R757 - 复核案例来源结果上下文

```yaml
id: R757
module: "导入中心"
description: "复核案例详情页已经能展示正常态数据，但来源结果仍只显示编号和类型，主管无法判断案例来自哪个业务日、时段、职场、项目、技能和差异指标。需要在详情 API 和页面中补齐只读来源结果上下文。"
source: "After IM056 normal-state smoke and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成现有 DB007/DB008 来源结果读取和前端只读展示；`ReviewCaseDetail` 返回 `source_result`，详情页展示来源结果明细；不新增 schema/migration，不新增依赖，不接真实外部接口，不做权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R758 - 复核案例来源链路反查

```yaml
id: R758
module: "导入中心"
description: "复核案例详情页已经能展示来源结果上下文，但主管仍无法继续判断该结果来自哪次对比计算、哪些版本以及关联哪个导入批次。需要在详情 API 和页面里补充只读来源链路反查。"
source: "After IM057 source result context and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成只读来源链路上下文；`ReviewCaseDetail` 返回 `source_trace`，详情页展示计算运行、版本和导入批次；不新增 schema/migration，不新增依赖，不接真实外部接口，不做证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R759 - 复核案例来源运行详情入口

```yaml
id: R759
module: "导入中心"
description: "复核案例详情页已经能展示来源运行、版本和导入批次，但运行 ID 仍不能进入可读的前端详情页，只能通过 API JSON 查看。需要从来源链路进入只读对比运行详情页，展示运行摘要和结果列表。"
source: "After IM058 source trace context and PM agreed to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读运行详情入口；复核案例来源链路可进入 `/data-quality/comparison-runs/[runId]`，运行详情页展示摘要、来源版本、结果明细和处理边界；不新增 schema/migration，不新增依赖，不接真实外部接口，不做计算触发、证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R760 - 对比运行关联复核案例定位

```yaml
id: R760
module: "导入中心"
description: "对比运行详情页已经能展示运行摘要和结果列表，但主管仍需要继续判断哪些结果已经形成复核案例，并从结果进入具体复核详情和证据查看。需要在运行详情页增加只读关联复核案例定位。"
source: "After IM059 comparison-run detail page and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读关联定位；运行详情页按当前运行结果匹配复核案例，并提供复核详情前端入口；复用已有 comparison-run detail 和 review-cases list API，不新增 schema/migration，不新增依赖，不接真实外部接口，不做计算触发、证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R761 - 复核案例证据结论链路

```yaml
id: R761
module: "导入中心"
description: "复核案例详情页已经能展示来源结果、来源链路、证据表和结论表，但主管仍需要先看到证据、结论、关闭状态的处理材料链路。需要新增只读证据与结论链路，避免只靠分散表格判断准备度。"
source: "After IM060 linked review-case positioning and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读链路展示；复核案例详情页新增 `证据与结论链路`，按时间展示 evidence、conclusions 和 closure，并把页面主体调整为单列分层；不新增 schema/migration，不新增依赖，不接真实外部接口，不做证据补录、复核关闭、权限、审批、导出、批量、生产公式、结算或收费因子。"
```

### R765 - 复核案例处理时间线

```yaml
id: R765
module: "导入中心"
description: "复核案例详情页已经具备证据补录、结论补充和关闭入口，但主管仍需要一个按处理顺序组织的时间线，快速判断当前案例经历了哪些动作、由谁处理、下一步是什么，而不是在多个区块之间来回拼接。"
source: "After IM064 conclusion supplement entry and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读处理时间线；复核案例详情页新增 `处理时间线`，按时间聚合 evidence、conclusions 和 closure，展示阶段、处理人、时间、说明、当前阶段和下一步建议；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R766 - 复核案例处理阶段筛选

```yaml
id: R766
module: "导入中心"
description: "复核详情页已经具备证据、结论、关闭和时间线，但主管回到复核列表时仍无法按处理阶段安排工作。需要在复核案例工作台按缺证据、缺结论、可关闭和已关闭筛选案例。"
source: "After IM065 processing timeline and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读处理阶段筛选；复核案例工作台新增 processingStage 参数和处理阶段筛选，阶段由现有 review-case detail API 的 evidence、conclusions 和 closure 记录派生，列表展示阶段、材料计数和阶段分组；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R767 - 复核 Owner 阶段负载矩阵

```yaml
id: R767
module: "导入中心"
description: "复核案例工作台已经能按处理阶段筛选案例，但主管仍无法快速判断不同 owner 手上分别有多少缺证据、缺结论、可关闭或已关闭案例。需要新增只读 owner × 处理阶段负载矩阵，并支持从矩阵进入对应过滤列表。"
source: "After IM066 processing-stage filters and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读 owner 阶段负载矩阵；复核案例工作台按 owner 聚合缺证据、缺结论、可关闭、已关闭和阶段未知数量，并提供 ownerId + processingStage 过滤入口；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R768 - 复核详情同 Owner 处理上下文

```yaml
id: R768
module: "导入中心"
description: "复核案例工作台已经能按 owner 和处理阶段看到负载矩阵，但主管进入单个案例详情后仍需要回到列表才能判断同一 owner 的其他待处理案例。需要在详情页增加只读同 owner 处理上下文，展示同 owner 的其他案例、处理阶段和详情入口。"
source: "After IM067 owner-stage matrix and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读同 owner 处理上下文；复核案例详情页展示同 owner 同业务日的其他案例、阶段、证据/结论状态、风险和详情入口，并提供 owner 列表及首要阶段入口；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R769 - 复核详情同 Owner 待处理导航

```yaml
id: R769
module: "导入中心"
description: "复核案例详情页已经能展示同 owner 的其他案例，但主管仍需要回到列表或表格逐条切换。需要在详情页增加只读同 owner 待处理导航，支持从当前案例进入上一条/下一条待处理案例，已关闭案例则引导进入首条待处理。"
source: "After IM068 owner context and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读同 owner 待处理导航；复核案例详情页基于现有列表和阶段快照派生同 owner 同业务日待处理序列，展示当前位置、上一条/下一条入口，当前案例已关闭时引导进入首条待处理；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R770 - 复核工作台同 Owner 首条待处理入口

```yaml
id: R770
module: "导入中心"
description: "复核案例详情页已经支持同 owner 上下条待处理导航，但主管在复核工作台列表页仍需要先点某个具体案例才能进入连续处理链路。需要在列表页增加只读同 owner 首条待处理入口，按 owner 展示当前筛选结果中的待处理数量、首条阶段和详情入口。"
source: "After IM069 owner pending navigation and PM asked to continue business features on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成前端只读入口；复核案例工作台基于当前筛选结果和阶段快照派生 owner 首条待处理，展示待处理数量、首条阶段、详情入口和 owner 列表入口；不新增 API、schema/migration、依赖、写入动作、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R771 - 复核详情处理动作区整合

```yaml
id: R771
module: "导入中心"
description: "复核详情页已经具备补证据、补结论和关闭入口，但三个动作面板仍分散在长详情流中，主管需要滚动拼接当前该做什么。需要把现有三个受控动作入口整合成一个处理动作区，突出当前推荐动作、材料状态和可提交入口。"
source: "PM agreed to continue business features after IM070 on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成复核详情页处理动作区整合；页面用统一动作区展示当前推荐动作、材料状态和三个处理 tab，复用已有 evidence、conclusion、closure 本地 API；不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R772 - 复核动作提交反馈统一化

```yaml
id: R772
module: "导入中心"
description: "复核详情页已经把补证据、补结论和关闭入口整合到处理动作区，但提交后仍只依赖 URL 参数表达 success/failed。需要在处理动作区顶部统一展示提交结果、影响动作和下一步建议。"
source: "After IM071 action deck and PM asked to continue on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成复核动作提交反馈统一化；复核详情页解析现有 evidence、conclusion、closure searchParams，在处理动作区顶部展示动作名称、写入结果和下一步建议；不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R773 - 复核提交后的续办导航

```yaml
id: R773
module: "导入中心"
description: "复核动作区已经能展示提交成功或失败反馈，但主管提交后仍需要在页面下方或列表页重新寻找下一条待处理案例。需要在提交反馈旁边展示续办导航，优先进入同 owner 下一条待处理案例，并保留返回复核列表入口。"
source: "After IM072 action feedback and PM asked to continue development on 2026-06-02"
submitted_at: "2026-06-02"
version: "1.0"
status: "done"
notes: "本轮已完成复核提交后的续办导航；复核详情页在提交反馈出现时复用现有同 owner 待处理序列，展示下一条待处理案例入口和同 owner 列表返回入口；不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R774 - 复核提交失败后的重试定位

```yaml
id: R774
module: "导入中心"
description: "复核动作提交失败时，主管现在能看到失败反馈，但仍需要自己判断应该回到补证据、补结论还是关闭案例入口重试。需要在失败反馈出现时自动定位对应处理 tab，并展示明确的重试提示。"
source: "After IM073 continuation navigation and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成复核提交失败后的重试定位；复核详情页在失败反馈出现时自动打开对应处理 tab，并展示明确重试提示；不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R775 - 复核提交成功后的当前案例优先续办

```yaml
id: R775
module: "导入中心"
description: "复核动作提交成功后，当前续办导航会直接强调同 owner 下一条待处理案例；但如果当前案例补证据后仍缺结论，主管更应该继续当前案例下一步。需要在提交成功后识别当前案例是否仍在待处理序列中，并优先给出当前案例续办入口。"
source: "After IM074 retry targeting and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成复核提交成功后的当前案例优先续办；当前案例仍在待处理序列时，续办入口优先指向当前案例下一步，当前案例已关闭或不在待处理序列时再进入同 owner 下一条；复用现有 review-case list 数据和阶段快照，不新增 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R776 - 复核关闭成功后的队列交接提示

```yaml
id: R776
module: "导入中心"
description: "复核关闭提交成功后，续办导航虽然能进入同 owner 下一条待处理案例，但文案没有明确告诉主管当前案例已关闭、当前操作正在进入队列交接。需要在关闭成功且存在下一条待处理时，明确展示关闭后的交接状态和下一条处理入口。"
source: "After IM075 current-case continuation priority and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成复核关闭成功后的队列交接提示；关闭成功且存在同 owner 下一条待处理时，续办导航明确展示当前案例已关闭，并将主入口标为关闭后处理下一条；复用现有 review-case list 数据和阶段快照，不新增 API、schema/migration、依赖、页面路由、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R777 - 复核续办返回列表保留未关闭焦点

```yaml
id: R777
module: "导入中心"
description: "复核详情页的续办导航可以回到同 Owner 列表，但当前列表入口只带业务日和 owner，未明确限定未关闭案例。主管从关闭成功或处理成功回列表时，应继续停留在未关闭处理队列，避免已关闭案例混入连续处理视图。"
source: "After IM076 closure handoff and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成复核续办返回列表保留未关闭焦点；同 Owner 待处理导航和提交后续办导航的返回列表入口会带上 status=open，避免已关闭案例混入连续处理队列；复用现有 review-case list filters，不新增 API、schema/migration、依赖、页面路由、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R778 - 字段映射模板维护详情页

```yaml
id: R778
module: "导入中心"
description: "字段映射模板已经可以被上传流程读取和复用，但前端目前主要是只读展示，模板修正和停用需要依赖后端 API 或测试入口。需要把模板维护放到独立二级页面，支持查看、更新和停用，避免继续堆在批次详情长页里。"
source: "After IM077 and PM asked to continue with real business functionality on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成字段映射模板维护详情页；新增 /data-quality/field-mapping-templates/[templateId] 二级页，展示模板详情、字段映射明细、模板更新表单和停用入口，并从模板卡片进入维护页；复用现有模板 PATCH 和 deactivate API，不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R779 - 字段映射模板新增页

```yaml
id: R779
module: "导入中心"
description: "字段映射模板现在可以维护和停用，但新增模板仍没有前端入口。需要提供独立新增页，把常用 CSV 表头映射保存为后续上传可复用的模板。"
source: "After IM078 and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "本轮已完成字段映射模板新增页；新增 /data-quality/field-mapping-templates/new，提交后调用现有 create template API 并跳转模板详情页，模板管理区新增进入新增页的入口；不新增后端 route、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、生产公式、结算或收费因子。"
```

### R793 - 版本工作台本地比对候选入口

```yaml
id: R793
module: "导入中心"
description: "当前已经具备本地 comparison calculate 能力和结果查询页面，但业务版本工作台还没有清晰告诉用户某个版本能发起哪类单次比对。需要先在版本工作台按版本行展示本地比对候选入口，并把用户带回已有结果追踪/触发语境。"
source: "After IM092 completion and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM093 已完成：业务版本工作台按版本行展示本地比对候选/阻塞态，明确对比口径、来源版本组合、业务日和触发前下一步；不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R794 - 版本工作台单次本地比对提交

```yaml
id: R794
module: "导入中心"
description: "版本工作台展示本地比对候选后，用户仍需要进入其他页面才能提交计算。需要在版本工作台对已满足来源版本条件的单个版本提供受控单次提交入口，复用现有本地 calculate 能力。"
source: "After R793 planning on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM094 已完成：版本工作台可对完整来源版本组合提交一次本地 comparison calculate，并在当前页展示生成或复用运行的反馈；不做批量计算、自动排班、审批、权限、导出、真实外部接口、生产公式、结算或收费因子。"
```

### R795 - 版本工作台计算后结果回看

```yaml
id: R795
module: "导入中心"
description: "版本工作台提交单次本地比对后，用户需要在当前工作台看到这次提交产生或复用的运行，并能稳定进入 comparison run detail 或结果列表回看。需要补计算提交后的回看卡片和结果入口。"
source: "After R794 planning on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM095 已完成：版本工作台提交本地比对后可显示结果回看卡片，运行已回显时展示口径、结果规模和关键差异，未回显时保持阻塞态；复用现有 comparison run detail、结果列表和版本工作台，不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R796 - 主数据维护工作台只读入口

```yaml
id: R796
module: "主数据维护"
description: "导入中心已经能把主数据批次应用到业务数据，但运营人员还缺一个稳定入口查看坐席、职场、供应商、项目、技能和绑定关系的当前维护范围。需要先建立主数据维护工作台的只读入口和实体分组，不直接进入新增、冻结或引用写入。"
source: "After IM095 completion and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM096 已完成：新增系统管理下的主数据维护只读工作台，按坐席、职场、供应商、项目、技能和绑定关系展示维护范围、来源批次/版本、阻塞原因和后续入口状态；不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R797 - 主数据实体详情与引用校验说明

```yaml
id: R797
module: "主数据维护"
description: "主数据维护工作台需要让用户进入单个实体或绑定关系的详情，查看有效期、冻结状态、来源批次和引用影响，避免维护前不知道哪些排班、预测或日志会受影响。"
source: "After R796 planning on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM097 已完成：从主数据维护工作台进入实体/绑定关系详情页，展示来源批次/版本、有效期和冻结状态空态、引用影响摘要，并在缺少引用明细时明确不伪造数量；写入动作、真实引用阻断、批量处理和权限仍不进入。"
```

### R798 - 主数据受控维护动作规划

```yaml
id: R798
module: "主数据维护"
description: "在主数据只读工作台和详情链路清楚后，再评估新增、编辑、冻结、有效期调整等受控维护动作，并明确每个动作的引用校验、失败反馈和审计边界。"
source: "After R797 planning on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM098 已完成：主数据详情页展示新增、编辑、冻结、有效期调整的受控动作安全壳，包含单实体范围、引用校验前置和失败边界；动作按钮保持暂不提交，不接后端/schema/migration、权限、审批、导出、批量、结算或生产公式。"
```

### R799 - 人员排班生产工作台只读入口

```yaml
id: R799
module: "人员排班生产"
description: "主数据维护链路已经形成只读工作台、详情和动作边界。下一步需要把人员级排班导入后的生产视图接起来，让运营人员在计划与排班下看到排班版本、来源批次、应用状态、0.5h 展开结果状态和阻塞原因。第一刀只做只读工作台入口，不进入发布、冻结或写入。"
source: "After IM098 completion and PM asked to continue on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM099 已完成：新增计划与排班下的 `/schedule-plans/production` 只读排班生产工作台，展示来源批次、业务版本、应用状态、0.5h 展开状态、阻塞原因和 IM100/IM101 后续边界；不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R800 - 人员排班版本详情与 0.5h 展开结果

```yaml
id: R800
module: "人员排班生产"
description: "人员排班生产工作台需要进入单个排班版本详情，查看班次引用、人员维度、业务日范围和 0.5h 展开结果，以便确认导入后排班能否用于履约比对。"
source: "After R799 planning on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM100 已完成：新增 `/schedule-plans/production/[batchId]` 排班版本详情页，从工作台进入后展示来源批次/版本、业务日、班次引用口径、人员范围不伪造说明和 0.5h 展开状态；不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
```

### R801 - 人员排班发布冻结边界安全壳

```yaml
id: R801
module: "人员排班生产"
description: "在人员排班版本和 0.5h 展开结果可见后，再展示发布、冻结或取消发布这类生产动作需要满足的校验条件和失败边界，避免用户误以为当前已经能改变生产口径。"
source: "After R800 planning on 2026-06-03"
submitted_at: "2026-06-03"
version: "1.0"
status: "done"
notes: "IM101 已完成：排班版本详情页展示发布、冻结、取消发布三类边界安全壳，包含来源版本、0.5h 展开、引用校验和失败边界，按钮保持禁用且不提交真实生产状态变化；不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
```

### R802 - 需求预测生产工作台只读入口

```yaml
id: R802
module: "需求预测生产"
description: "人员排班生产链路已形成工作台、详情和发布/冻结边界。下一步需要把需求预测导入后的生产视图接起来，让计划人员在计划与排班下看到预测版本、来源批次、应用状态、技能组/等级/时段对齐状态和阻塞原因。第一刀只做只读工作台入口，不进入预测变更、公式或写入。"
source: "After IM101 completion and PM agreed to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM102 已完成：新增 `/demand-plans/production` 只读需求预测生产工作台，展示预测版本、来源批次、应用状态、技能组/等级/时段对齐状态、阻塞原因和 IM103/IM104 后续边界；不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、真实外部接口、自动排班、生产公式、结算或收费因子。"
```

### R803 - 需求预测版本详情与对齐结果

```yaml
id: R803
module: "需求预测生产"
description: "需求预测生产工作台需要进入单个预测版本详情，查看业务日范围、技能组、等级、时段粒度和对齐结果，以便确认预测能否用于排班比对。"
source: "After R802 planning on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM103 已完成：从 `/demand-plans/production` 进入 `/demand-plans/production/[batchId]` 预测版本详情页，展示来源批次/版本、业务日、技能组/等级/时段对齐边界、预测明细不伪造说明和阻塞状态；不新增后端 API、schema/migration、依赖、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
```

### R804 - 需求预测变更追踪边界安全壳

```yaml
id: R804
module: "需求预测生产"
description: "在预测版本详情和对齐结果可见后，再展示预测变更追踪需要满足的来源、对齐和影响校验条件，避免用户误以为当前已经能修改预测或改变生产口径。"
source: "After R803 planning on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM104 已完成：预测版本详情页展示变更追踪边界安全壳，包含来源版本、技能组/等级/0.5h 时段、下游影响和失败边界校验；动作按钮禁用，不接真实写入、公式、审批、导出、批量、权限或生产状态变化。"
```

### R805 - 登录/状态日志生产工作台只读入口

```yaml
id: R805
module: "登录/状态日志生产"
description: "在数据与集成下建立登录/状态日志生产工作台，先让用户看到登录日志和状态日志来源批次、应用版本、业务日、时区和跨天处理边界。"
source: "PM approved actual-log production enhancement on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM105 已完成：新增 `/actual-logs/production` 只读工作台，展示登录/状态日志来源批次、业务版本、应用状态、业务日范围、时区和跨天处理边界；不改状态字典、不重算实际工时、不触发排班 vs 实际比对。"
```

### R806 - 登录/状态日志处理解释详情

```yaml
id: R806
module: "登录/状态日志生产"
description: "从日志生产工作台进入单批次处理解释页，展示跨天切分、业务日归属、Asia/Shanghai 时区校验和状态区间处理边界。"
source: "After R805 planning on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM106 已完成：新增 `/actual-logs/production/[batchId]` 只读处理解释页，展示业务日归属、Asia/Shanghai 时区校验、跨天状态区间切分、状态字典/状态区间/登录事件明细，以及缺少逐行明细时的不造假空态。"
```

### R807 - 状态字典与异常解释安全壳

```yaml
id: R807
module: "登录/状态日志生产"
description: "在处理解释可见后展示状态字典配置、未知状态、时区错误、跨天异常和冻结员工引用的解释边界，动作保持安全壳。"
source: "After R806 planning on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM107 已完成：处理解释页新增状态字典与异常解释安全壳，展示状态字典、未知状态、时区错误、跨天异常和冻结员工引用边界；动作按钮禁用，不提交状态字典变更或生产规则变更。"
```

### R808 - 主数据坐席单实体维护 API 基础

```yaml
id: R808
module: "主数据维护"
description: "主数据详情页已有新增、编辑、冻结、有效期调整的动作安全壳。下一步需要先补最小后端写入基础，从坐席单实体开始，复用现有 master_data_employees 表和主数据仓库，不新增 schema/migration。"
source: "After IM107 completion and PM agreed to start master-data CRUD on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM108 已完成：新增坐席单实体 create/edit/freeze/effective_period 后端维护入口，复用 master_data_employees 和既有仓库，不新增 schema/migration；错误码覆盖缺失批次、缺失坐席、重复创建、缺字段和无效有效期。"
```

### R809 - 主数据坐席维护前端受控提交

```yaml
id: R809
module: "主数据维护"
description: "坐席单实体维护 API 可用后，需要在 `/master-data/agents` 详情页把新增、编辑、冻结、有效期调整从禁用安全壳升级为受控提交表单，并展示成功/失败反馈。"
source: "After R808 planning on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM109 已完成：`/master-data/agents` 详情页新增坐席 create/edit/freeze/effective_period 受控提交表单，通过 server action 调用 IM108 API，并展示成功/失败反馈；其他主数据对象仍保持只读安全壳。"
```

### R810 - 主数据维护扩展到其他对象与绑定关系

```yaml
id: R810
module: "主数据维护"
description: "坐席维护闭环验证后，再将同一维护能力扩展到职场、供应商、项目、技能和绑定关系，并补绑定关系引用校验解释。"
source: "After R809 planning on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM110 已完成：后端新增职场、供应商、项目、技能单实体维护与绑定关系维护入口；前端在对应详情页开放受控提交表单，绑定关系提交校验坐席、供应商、职场、项目和技能引用，并保持冻结动作禁用；未新增 schema/migration、权限、审批、导出、批量或生产公式。"
```

### R811 - 人员排班版本详情只读 API

```yaml
id: R811
module: "人员排班生产"
description: "人员排班生产详情页已有来源版本和发布/冻结安全壳，但缺少后端只读详情 API 来返回排班明细和 0.5h 展开区间。下一步需要先补只读 API，让前端后续能展示真实排班版本详情，而不是继续显示不伪造明细的空态。"
source: "After IM110 completion and PM agreed to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM111 已完成：新增人员排班生产版本详情只读 API，可按 batch_id 返回来源批次、schedule_version_id、业务日期范围、排班明细和 0.5h 展开区间；不新增 schema/migration，不做前端接入、发布、冻结、取消发布、审批、导出、批量、权限、自动排班、生产公式、结算或收费因子。"
```

### R812 - 人员排班生产详情前端接入真实 API

```yaml
id: R812
module: "人员排班生产"
description: "人员排班生产详情 API 已可返回排班明细和 0.5h 展开区间，下一步需要让 `/schedule-plans/production/[batchId]` 读取该只读 API，替换原先不伪造明细的占位状态。"
source: "After IM111 completion and PM asked to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM112 已完成：`/schedule-plans/production/[batchId]` 调用 IM111 只读 API，展示真实 schedule_version_id、排班明细和 0.5h 展开区间；保留未应用/缺 API 的明确阻塞空态，不新增后端、schema/migration、依赖或生产写入。"
```

### R813 - 人员排班详情行级引用解释

```yaml
id: R813
module: "人员排班生产"
description: "排班详情页已展示真实排班明细和 0.5h 展开区间，但每行引用是否完整、缺少哪些引用、是否阻塞后续动作还不够清楚。下一步需要在前端只读表中补行级引用完整性和阻塞解释。"
source: "After IM112 completion and PM asked to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM113 已完成：排班明细行和 0.5h 展开区间行展示引用完整/缺失状态，并在缺坐席、职场、供应商、项目、技能或班次类型时给出行级阻塞说明；未新增后端、schema/migration、依赖或生产写入。"
```

### R814 - 需求预测版本详情只读 API

```yaml
id: R814
module: "需求预测生产"
description: "需求预测生产详情页已有来源版本和变更追踪安全壳，但缺少后端只读详情 API 来返回真实预测版本、0.5h 预测区间和变更记录。下一步需要先补只读 API，让前端后续能展示批次应用后生成的预测结果，而不是继续停留在不伪造明细的空态。"
source: "After IM113 completion and PM asked to push then continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM114 已完成：新增需求预测生产详情只读 API，按 batch_id 返回来源批次、forecast_version_id、业务日期范围、0.5h 预测区间和版本变更记录；不做前端接入、schema/migration、依赖或生产写入。"
```

### R815 - 需求预测生产详情前端接入真实 API

```yaml
id: R815
module: "需求预测生产"
description: "需求预测生产详情只读 API 已可返回预测区间和变更记录，下一步需要让 `/demand-plans/production/[batchId]` 读取该 API，替换原先不伪造明细的占位状态。"
source: "After IM114 completion and PM asked to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM115 已完成：`/demand-plans/production/[batchId]` 接入 IM114 API，展示真实 forecast_version_id、0.5h 预测区间和版本变更记录；不做后端、schema/migration、依赖或生产写入。"
```

### R816 - 需求预测详情行级对齐和阻塞解释

```yaml
id: R816
module: "需求预测生产"
description: "预测详情页已经展示真实 0.5h 预测区间，但每行的职场、项目、技能、等级、时段和需求值是否完整还不够清楚。下一步需要补行级对齐完整性和阻塞说明。"
source: "After IM115 completion and PM asked to push and continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM116 已完成：预测区间行展示职场、项目、技能、等级、时段和需求值完整性，完整行显示无阻塞，缺字段或需求值异常时显示行级阻塞说明；不做后端、schema/migration、依赖或生产写入。"
```

### R817 - 生产详情进入本地比对入口

```yaml
id: R817
module: "本地比对计算"
description: "人员排班和需求预测生产详情页已经能展示真实版本明细，但用户还需要从生产版本上下文清楚进入已有业务版本工作台，继续确认成对版本并发起受控本地比对。"
source: "After IM116 completion and PM asked to push and continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM117 已完成：排班生产详情和预测生产详情新增本地比对入口卡片，按业务日和版本域跳转已有业务版本工作台；不新增后端、schema/migration、依赖、提交动作或生产写入。"
```

### R818 - 业务版本工作台 applied 入口兼容

```yaml
id: R818
module: "本地比对计算"
description: "IM117 生产详情入口会以 `status=applied` 进入业务版本工作台，但工作台原筛选只识别 ready/blocked/empty，导致已应用版本入口被筛为空。需要让 applied 入口等价定位已形成版本，并继续暴露同业务日预测 vs 排班直接提交候选。"
source: "After IM117 completion and PM asked to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM118 已完成：业务版本工作台将 `status=applied` 作为 ready 入口别名处理，生产详情跳转不会筛空；同业务日已应用预测和排班版本可直接形成 forecast_vs_schedule 受控提交请求。"
```

### R819 - 登录日志版本结果链路一致性

```yaml
id: R819
module: "本地比对计算"
description: "业务版本工作台和批次应用结果链路已经支持状态日志版本匹配排班实际结果，但登录日志同属 actual_logs 应用目标，候选提交支持却缺少直接结果定位和复核入口一致性。需要把 login_log 已应用版本纳入 schedule_vs_actual 结果匹配。"
source: "After IM118 completion and PM asked to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM119 已完成：login_log 已应用版本现在与 status_log 一样支持直接版本结果定位、schedule_vs_actual 运行匹配和复核案例入口；actual_logs 中文展示统一为 登录/状态日志。"
```

### R820 - 排班实际结果来源解释

```yaml
id: R820
module: "本地比对计算"
description: "登录/状态日志版本已经能进入 schedule_vs_actual 结果链路，但对比运行详情页还缺少面向排班实际口径的来源解释，用户不容易确认排班版本、实际日志版本、业务日和迟到指标之间的关系。"
source: "After IM119 push and PM asked to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM120 已完成：对比运行详情页新增来源解释和来源完整性提示，预测排班和排班实际分别说明来源版本、业务日区间和关键差异口径；缺版本时不伪造来源。"
```

### R821 - 对比运行详情工作区分层

```yaml
id: R821
module: "本地比对计算"
description: "对比运行详情页已经承载总览、来源链路、结果明细、关联复核和处理边界，但这些内容仍堆在一个长页里，用户难以判断当前应该看哪一块。需要把既有内容拆成明确的二级工作区入口。"
source: "PM feedback on 2026-06-04: 你还是把功能都写在一个长页里面"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM121 已完成：对比运行详情页改为总览、来源链路、结果明细、复核案例、处理边界五个工作区 tab，默认展示总览，不新增写入或业务能力。"
```

### R822 - 复核案例详情工作区分层

```yaml
id: R822
module: "复核案例处理"
description: "复核案例详情页承载来源结果、来源链路、证据缺口、证据链、处理时间线、受控动作、证据表、结论表、同 owner 导航和处理边界，内容继续堆在一个长页里会让处理人员难以定位当前任务。需要把既有内容拆成明确的工作区入口。"
source: "Continuation after PM feedback on 2026-06-04: 你还是把功能都写在一个长页里面"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM122 已完成：复核案例详情页改为总览、来源链路、证据结论、处理动作、Owner 导航、处理边界六个工作区 tab，默认展示总览，不新增写入或业务能力。"
```

### R823 - 登录状态日志处理详情工作区分层

```yaml
id: R823
module: "登录/状态日志生产"
description: "登录/状态日志处理详情页已经承载来源概览、时区校验、业务日归属、跨天切分、状态字典、异常解释、逐行明细和禁用边界动作，内容继续堆在一个长页里会让处理人员难以定位当前任务。需要把既有内容拆成明确的工作区入口。"
source: "Continuation after PM confirmation on 2026-06-04 for long-page cleanup"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM123 已完成：登录/状态日志处理详情页改为总览、时区与业务日、字典与异常、逐行明细、处理边界五个工作区 tab，默认展示总览，不新增写入或业务能力。"
```

### R824 - 人员排班生产详情工作区分层

```yaml
id: R824
module: "人员排班生产"
description: "人员排班生产详情页已经承载来源批次、业务版本、应用状态、班次引用、人员范围、0.5h 展开明细、本地比对入口和发布冻结边界，但内容继续堆在一个长页里会让排班人员难以定位当前任务。需要把既有内容拆成明确的工作区入口。"
source: "Continuation after IM123 push and PM asked to continue subsequent requirements on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM124 已完成：人员排班生产详情页改为总览、来源与版本、真实明细、本地比对、发布冻结边界五个工作区 tab，默认展示总览，不新增写入或业务能力。"
```

### R825 - 需求预测生产详情工作区分层

```yaml
id: R825
module: "需求预测生产"
description: "需求预测生产详情页已经承载来源批次、预测版本、技能组/等级/时段对齐、0.5h 预测区间、版本变更记录、本地比对入口和变更追踪边界，但内容继续堆在一个长页里会让计划人员难以定位当前任务。需要把既有内容拆成明确的工作区入口。"
source: "Continuation after IM124 push and PM asked to continue subsequent requirements on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM125 已完成：需求预测生产详情页改为总览、来源与对齐、预测明细、本地比对、变更边界五个工作区 tab，默认展示总览，不新增写入或业务能力。"
```

### R826 - 主数据维护详情工作区分层

```yaml
id: R826
module: "主数据维护"
description: "主数据维护详情页已经承载来源版本、维护对象、引用影响、受控动作和提交表单，但这些内容继续堆在一个长页里会让维护人员难以定位当前要看来源、看影响还是提交单对象动作。需要把既有内容拆成明确的工作区入口。"
source: "Continuation after IM125 push and PM asked to continue and push on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM126 已完成：主数据维护详情页改为总览、来源与引用、受控动作、提交表单、维护边界五个工作区 tab，默认展示总览，不新增写入或业务能力。"
```

### R827 - 导入批次明细二级工作区分层

```yaml
id: R827
module: "导入中心"
description: "导入批次详情页外层已经有批次处理 tab，但批次明细面板内部仍把总览指标、处理摘要、履约异常追踪、版本记录和全部行结果堆在一个长面板里。需要把批次明细内部也拆成明确的二级工作区入口。"
source: "Continuation after IM126 push and PM asked to continue and push on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM127 已完成：导入批次明细面板改为总览、处理摘要、异常追踪、版本记录、行结果五个二级 tab，默认展示总览，不新增写入或业务能力。"
```

### R828 - 字段映射模板详情工作区分层

```yaml
id: R828
module: "导入中心"
description: "字段映射模板详情页已经承载模板身份、维护表单、字段映射明细和停用边界，但这些内容继续堆在详情页里会让操作员难以区分当前是在查看、编辑字段还是处理维护边界。需要把既有模板详情内容拆成明确的工作区入口。"
source: "Continuation after IM127 push and PM agreed to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM128 已完成：字段映射模板详情页改为总览、维护表单、字段明细、维护边界四个 tab，默认展示总览，不新增写入或业务能力。"
```

### R829 - 字段映射模板管理面板工作区分层

```yaml
id: R829
module: "导入中心"
description: "字段映射模板管理面板已经承载模板库存指标、当前批次模板适配建议、模板列表和字段映射明细，但内容仍堆在一个长 Card 内。需要把模板管理面板拆成明确的工作区入口。"
source: "Continuation after IM128 push and PM asked to continue on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM129 已完成：字段映射模板管理面板改为总览、模板适配、模板列表三个 tab，默认展示总览，不新增写入或业务能力。"
```

### R830 - 产品结构纠偏：经营总览和导航收敛

```yaml
id: R830
module: "产品结构"
description: "经营总览中出现了数据接入状态，侧边栏也暴露了多个没有真实闭环或当前明确暂不做的占位入口，导致业务首页和导航混入工程接入状态、权限、结算、智能排班等臆想能力。需要先收敛可见结构，避免继续误导后续开发。"
source: "PM challenged master-data understanding, imaginary navigation entries, and dashboard data ingestion status on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM130 已完成：经营总览移除数据接入状态面板，侧边栏移除纯占位和暂不做能力入口，并增加回归测试防止重新暴露。"
```

### R831 - 人员主数据组织层级、人员类型和多技能模型

```yaml
id: R831
module: "主数据维护"
description: "人员主数据不能只记录姓名和状态。PM 确认现阶段人员类型为自有员工、外包员工，后续预留实习、兼职；人员需要归属组织层级，例如 CC/CCO/集中退换小组，并可归属南京职场；一个人可以拥有多个技能，技能本身需要区分在线技能组、热线技能组、工单技能组。需要先扩展本地主数据模型和导入应用底座。"
source: "PM clarified personnel master data fields and hierarchy on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM131 已完成：新增组织层级、人员类型、人员组织/职场字段、技能类型、人员多技能关系和对应迁移/导入解析测试。"
```

### R832 - 人员主数据列表真实展示

```yaml
id: R832
module: "主数据维护"
description: "人员主数据导入应用后，维护人员需要在人员列表中看到真实员工记录，而不是只看到维护动作壳。列表至少要展示姓名、状态、人员类型、组织路径、职场和技能组类别，以便确认上传表格和应用结果是否形成可维护的人员主数据。"
source: "PM clarified personnel master data list expectation and asked to continue after IM131 push on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM132 已完成：新增只读人员列表 API，并在 /master-data/agents 总览中展示真实人员、组织路径、职场和技能组类别。"
```

### R833 - 单个人员核心字段编辑

```yaml
id: R833
module: "主数据维护"
description: "人员列表已经能展示真实员工，但单人编辑表单仍只能改姓名和状态，不能按 PM 明确口径维护人员类型、所属组织和职场。需要把这些核心字段补进受控单人编辑链路。"
source: "PM clarified single-person maintenance expectation and approved continuing after IM132 push on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM133 已完成：单人新增/编辑表单和 server action payload 已支持人员类型、组织 ID、职场 ID；后端回归覆盖编辑这些字段。"
```

### R834 - 单个人员多技能维护

```yaml
id: R834
module: "主数据维护"
description: "人员列表已经能展示一个人的多个技能，但维护人员还不能在单个人员维护里修正技能集合。需要提供受控的单人技能维护入口，让维护人员按技能 ID 列表覆盖某个员工当前技能集合，同时复用既有技能引用校验和有效期校验。"
source: "PM approved continuing after IM133 push on 2026-06-04"
submitted_at: "2026-06-04"
version: "1.0"
status: "done"
notes: "IM134 已完成：新增单员工技能集合 replace API、server action，并将 /master-data/agents 纠正为客服人员管理列表；新建、编辑、技能维护走子页面，冻结走弹窗。"
```

### R835 - 人员管理列表 UI 细节纠偏

```yaml
id: R835
module: "主数据维护"
description: "人员管理列表已经拆成列表、子页面和冻结弹窗，但筛选下拉框、表格行内操作按钮和按钮文字密度仍不协调。需要集中检查并修正这些 UI 细节，避免 B 端列表页显得粗糙或继续暴露内部规划文字。"
source: "PM requested dropdown and row button/detail-size inspection on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM135 已完成：人员筛选下拉统一为 32px 高并让弹层宽度对齐触发器；表格行内编辑/冻结/更多操作统一为小尺寸操作，并移除内部“待拆分”文案。"
```

### R841 - 职场详情页承载运营主体

```yaml
id: R841
module: "主数据维护"
description: "PM 确认职场是地点对象，职场下的自有团队和供应商团队不应作为独立导航或二级实体暴露，而应收敛到具体职场的详情页。需要在职场列表进入单个职场详情，并在详情中只读展示该职场下的运营主体来源。"
source: "PM clarified workplace operating subjects belong in workplace detail on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM141 已完成：/master-data/sites 列表新增详情入口，/master-data/sites/[workplaceId] 展示职场信息和该职场下的运营主体；不恢复独立职场运营主体或绑定关系导航。"
```

### R842 - 供应商详情页承载服务职场

```yaml
id: R842
module: "主数据维护"
description: "供应商不应只停留在列表行。维护人员需要从供应商列表进入单个供应商详情，查看供应商基础信息，以及该供应商当前服务哪些职场。合同、结算比例和最低人力属于后续独立任务，现阶段只保留只读边界，不提前实现。"
source: "PM approved continuing supplier detail after workplace detail on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM142 已完成：/master-data/vendors 列表新增详情入口，/master-data/vendors/[vendorId] 展示供应商信息和服务职场；不实现合同、结算比例或最低人力。"
```

### R843 - 客服人员列表内批量导入大弹窗

```yaml
id: R843
module: "主数据维护"
description: "PM 明确导入动作应从具体业务列表发起，人员导入应放在客服人员列表，而不是让用户先进入独立上传工作区。需要在客服人员列表页提供批量导入大弹窗，弹窗内分为上传文件、字段映射和导入结果三步；完整批次详情、失败行修正、准备度和应用处理仍留在批次详情页。"
source: "PM corrected import UX and approved the agent-list dialog design on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM143 已完成：/master-data/agents 的批量导入入口改为列表内大弹窗，弹窗内分上传文件、字段映射和导入结果三步；完整批次详情、失败行修正、准备度和应用处理仍进入批次详情页。"
```

### R844 - 全局 UI 组件规范与客服人员导入弹窗纠偏

```yaml
id: R844
module: "主数据维护 / 全局布局"
description: "PM 用 Product Design 与 shadcn 规范复核后确认，当前全局侧边栏仍是手写 aside，页面缺少统一 Breadcrumb，反馈提示没有统一使用 Alert，客服人员导入弹窗也需要改成严格 step-by-step Dialog。需要在不新增业务菜单、不扩展排班/预测/日志导入的前提下，统一这些 UI 基础规范。"
source: "PM supplied Product Design + shadcn review conclusions and approved execution on 2026-06-05"
submitted_at: "2026-06-05"
version: "1.0"
status: "done"
notes: "IM144 已完成：全局 AppShell/AppSidebar/SiteHeader 改用 shadcn Sidebar、Collapsible、SidebarTrigger、Breadcrumb；SiteHeader 改为单行导航结构，Breadcrumb 包含当前页，不再额外渲染第二行视觉 H1；SiteHeader 去掉无意义全局搜索、固定月份和通知占位并提供页面级 actions 插槽；Sidebar footer 使用 shadcn Avatar 和本地参考头像 /shadcn-avatar.jpg，并提供本地用户菜单、明暗主题切换和登出入口，登出不接真实 auth；主数据列表、详情、新建、编辑、技能维护页由 SiteHeader 唯一承载页面标题和返回路径，内容区不再重复返回按钮、H1 和页面级说明；客服人员列表按筛选卡片、列表操作栏、表格排序，查询/重置固定在筛选卡片右下，新建/批量导入进入 Header 右侧，列表操作栏只保留已选/批量动作；客服人员导入改为 shadcn Dialog step-by-step，并用 hidden 保持文件 input 挂载；反馈与导入结果摘要改用 Alert。"
```
