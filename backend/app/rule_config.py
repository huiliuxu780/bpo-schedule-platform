"""Structured rule configuration with scope and effective period.

Categories follow CORN WFM V2.0 chapter 8.3: scheduling / attendance / publish.
Rules support global / dept / team scopes plus effective dates. The formal
thresholds are still open questions in chapter 16, so built-in defaults are
returned with an explicit ``default_source`` annotation until the business
configures real values.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import String, select
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker
from sqlalchemy.types import JSON

from backend.app.import_persistence import Base, build_engine
from backend.app.models import (
    RuleCategory,
    RuleConfigListResponse,
    RuleConfigPutRequest,
    RuleConfigRecord,
)

# CORN WFM V2.0 第16章：迟到、早退、小休、就餐、班间休息等正式阈值待确认。
# 以下内置默认值仅为工程占位，default_source 会显式标注来源。
BUILT_IN_DEFAULT_SOURCE = (
    "built_in_default（CORN WFM V2.0 第16章阈值未确认，工程默认值，待业务正式定稿）"
)
USER_CONFIGURED_SOURCE = "user_configured"

BUILT_IN_DEFAULT_RULES: dict[RuleCategory, dict[str, float | bool | str]] = {
    "scheduling": {
        "max_hours_per_day": 8,
        "max_consecutive_days": 6,
        "min_rest_between_shifts_minutes": 660,
        "night_shift_max_days_per_month": 8,
    },
    "attendance": {
        "late_threshold_minutes": 5,
        "early_leave_threshold_minutes": 5,
        "single_break_max_minutes": 15,
        "cumulative_break_max_minutes": 40,
        "meal_duration_minutes": 60,
        "min_attendance_hours": 4,
    },
    "publish": {
        "error_blocks_publish": True,
        "warning_requires_confirmation": True,
        "coverage_gap_requires_reason": True,
        "adjustment_takes_effect": "next_publish",
    },
}


class SchedulingRuleConfigEntity(Base):
    __tablename__ = "scheduling_rule_configs"

    rule_id: Mapped[str] = mapped_column(String(200), primary_key=True)
    category: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    scope_type: Mapped[str] = mapped_column(String(20), nullable=False)
    scope_id: Mapped[str | None] = mapped_column(String(80), nullable=True)
    fields_json: Mapped[dict] = mapped_column(JSON, nullable=False, default=dict)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    default_source: Mapped[str] = mapped_column(String(255), nullable=False)
    updated_at: Mapped[str] = mapped_column(String(40), nullable=False)


class RuleConfigRepository:
    def __init__(self, database_url: str | None = None):
        self.engine = build_engine(database_url)
        self.session_factory = sessionmaker(
            bind=self.engine,
            autoflush=False,
            expire_on_commit=False,
            future=True,
        )

    def init_schema(self) -> None:
        Base.metadata.create_all(self.engine)

    def list_rules(self, category: RuleCategory) -> list[RuleConfigRecord]:
        with self.session_factory() as session:
            entities = list(
                session.scalars(
                    select(SchedulingRuleConfigEntity)
                    .where(SchedulingRuleConfigEntity.category == category)
                    .order_by(
                        SchedulingRuleConfigEntity.scope_type,
                        SchedulingRuleConfigEntity.scope_id,
                    )
                )
            )
        return [_record(entity) for entity in entities]

    def upsert_rule(
        self,
        category: RuleCategory,
        request: RuleConfigPutRequest,
    ) -> RuleConfigRecord:
        if request.effective_to < request.effective_from:
            raise ValueError("INVALID_EFFECTIVE_PERIOD: 生效日期范围无效")
        if not request.fields:
            raise ValueError("RULE_FIELDS_REQUIRED: 规则字段不能为空")
        if request.scope_type != "global" and not request.scope_id:
            raise ValueError("RULE_SCOPE_REQUIRED: 部门/班组范围必须提供 scope_id")

        rule_id = f"rule-{category}-{request.scope_type}-{request.scope_id or 'all'}"
        now = _now_iso()
        with self.session_factory.begin() as session:
            session.merge(
                SchedulingRuleConfigEntity(
                    rule_id=rule_id,
                    category=category,
                    scope_type=request.scope_type,
                    scope_id=request.scope_id,
                    fields_json=dict(request.fields),
                    effective_from=request.effective_from,
                    effective_to=request.effective_to,
                    default_source=USER_CONFIGURED_SOURCE,
                    updated_at=now,
                )
            )
            session.flush()
            stored = session.get(SchedulingRuleConfigEntity, rule_id)
            assert stored is not None
            return _record(stored)

    def resolve_rule_fields(self, category: RuleCategory) -> dict[str, float | bool | str]:
        """Merge stored global rules over built-in defaults.

        Phase 1 validation only needs the global caliber; dept/team rules stay
        stored for the future scope-aware engine.
        """
        fields: dict[str, float | bool | str] = dict(
            BUILT_IN_DEFAULT_RULES.get(category, {})
        )
        for rule in self.list_rules(category):
            if rule.scope_type == "global":
                fields.update(rule.fields)
        return fields


def get_rule_config_list(
    repository: RuleConfigRepository,
    category: RuleCategory,
) -> RuleConfigListResponse:
    stored = repository.list_rules(category)
    if stored:
        return RuleConfigListResponse(category=category, items=stored)
    return RuleConfigListResponse(
        category=category,
        items=[
            RuleConfigRecord(
                rule_id=f"built-in-{category}",
                category=category,
                scope_type="global",
                scope_id=None,
                fields=dict(BUILT_IN_DEFAULT_RULES[category]),
                effective_from="1970-01-01",
                effective_to="9999-12-31",
                default_source=BUILT_IN_DEFAULT_SOURCE,
                updated_at="",
            )
        ],
    )


def _record(entity: SchedulingRuleConfigEntity) -> RuleConfigRecord:
    return RuleConfigRecord(
        rule_id=entity.rule_id,
        category=entity.category,
        scope_type=entity.scope_type,
        scope_id=entity.scope_id,
        fields=dict(entity.fields_json or {}),
        effective_from=entity.effective_from,
        effective_to=entity.effective_to,
        default_source=entity.default_source,
        updated_at=entity.updated_at,
    )


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()
