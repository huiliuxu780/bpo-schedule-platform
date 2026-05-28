# Current Blockers

## Active Blockers

### DB002 导入批次持久化基础

- blocker_id: `BLK-DB002-001`
- status: `active`
- task_id: `DB002`
- reason: `等待 PM 确认数据库引擎、依赖/package 变更授权、migration 工具和测试数据库方案。`
- required_confirmation:
  - `数据库引擎：建议 PostgreSQL。`
  - `依赖授权：是否允许修改 package/lockfile 或 Python dependency 文件。`
  - `ORM/migration：建议 SQLAlchemy + Alembic。`
  - `测试数据库：本地 PostgreSQL 测试库或容器化测试库。`

## Standing Constraints

- No database work until PM confirms a database Gate and environment.
- No real external data integration.
- No approval, export, batch operation, auth, permission, production formula, settlement, or charge-factor work.
- No archive execution.
