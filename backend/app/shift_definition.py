"""Versioned shift definitions (CORN WFM V2.0 chapter 13.2).

Shift codes are templates; changing a shift always appends a new version and
never rewrites history, so published schedules keep pointing at the shift
revision they were built from. Supports split shifts, cross-day shifts and
night shifts attributed to their start date.
"""

from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import Boolean, String, select
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker
from sqlalchemy.types import JSON

from backend.app.coverage_calculation import (
    parse_time_to_minutes,
)
from backend.app.import_persistence import Base, build_engine
from backend.app.models import (
    ShiftActivitySegment,
    ShiftDefinitionCreateRequest,
    ShiftDefinitionListResponse,
    ShiftDefinitionRecord,
)


class ShiftDefinitionEntity(Base):
    __tablename__ = "shift_definitions"

    shift_definition_id: Mapped[str] = mapped_column(String(200), primary_key=True)
    shift_code: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    version_number: Mapped[int] = mapped_column(nullable=False)
    shift_name: Mapped[str] = mapped_column(String(255), nullable=False)
    effective_from: Mapped[str] = mapped_column(String(20), nullable=False)
    effective_to: Mapped[str] = mapped_column(String(20), nullable=False)
    segments_json: Mapped[list] = mapped_column(JSON, nullable=False, default=list)
    is_cross_day: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    night_attribution: Mapped[str] = mapped_column(
        String(20), nullable=False, default="start_date"
    )
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active")
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)


class ShiftDefinitionRepository:
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

    def create_shift_version(
        self, request: ShiftDefinitionCreateRequest
    ) -> ShiftDefinitionRecord:
        """Append a new version for the shift code (history is never rewritten)."""
        _validate_shift_request(request)
        with self.session_factory.begin() as session:
            latest = session.scalars(
                select(ShiftDefinitionEntity)
                .where(ShiftDefinitionEntity.shift_code == request.shift_code)
                .order_by(ShiftDefinitionEntity.version_number.desc())
            ).first()
            version_number = 1 if latest is None else latest.version_number + 1
            if latest is not None:
                # 旧版本归档保留，不覆写历史（13.2）
                latest.status = "archived"
            record = ShiftDefinitionRecord(
                shift_definition_id=f"{request.shift_code}-V{version_number}",
                shift_code=request.shift_code,
                version_number=version_number,
                shift_name=request.shift_name,
                effective_from=request.effective_from,
                effective_to=request.effective_to,
                segments=list(request.segments),
                is_cross_day=request.is_cross_day,
                night_attribution=request.night_attribution,
                status="active",
                created_at=_now_iso(),
            )
            session.add(
                ShiftDefinitionEntity(
                    shift_definition_id=record.shift_definition_id,
                    shift_code=request.shift_code,
                    version_number=version_number,
                    shift_name=request.shift_name,
                    effective_from=request.effective_from,
                    effective_to=request.effective_to,
                    segments_json=[
                        segment.model_dump() for segment in request.segments
                    ],
                    is_cross_day=request.is_cross_day,
                    night_attribution=request.night_attribution,
                    status="active",
                    created_at=record.created_at,
                )
            )
        return record

    def list_shift_definitions(
        self, shift_code: str | None = None
    ) -> ShiftDefinitionListResponse:
        with self.session_factory() as session:
            query = select(ShiftDefinitionEntity).order_by(
                ShiftDefinitionEntity.shift_code,
                ShiftDefinitionEntity.version_number,
            )
            if shift_code is not None:
                query = query.where(ShiftDefinitionEntity.shift_code == shift_code)
            entities = list(session.scalars(query))
        return ShiftDefinitionListResponse(
            items=[_record(entity) for entity in entities]
        )

    def get_shift_definition(
        self, shift_definition_id: str
    ) -> ShiftDefinitionRecord | None:
        with self.session_factory() as session:
            entity = session.get(ShiftDefinitionEntity, shift_definition_id)
            if entity is None:
                return None
            return _record(entity)


def _record(entity: ShiftDefinitionEntity) -> ShiftDefinitionRecord:
    return ShiftDefinitionRecord(
        shift_definition_id=entity.shift_definition_id,
        shift_code=entity.shift_code,
        version_number=entity.version_number,
        shift_name=entity.shift_name,
        effective_from=entity.effective_from,
        effective_to=entity.effective_to,
        segments=[
            ShiftActivitySegment(**segment) for segment in (entity.segments_json or [])
        ],
        is_cross_day=bool(entity.is_cross_day),
        night_attribution=entity.night_attribution,
        status=entity.status,
        created_at=entity.created_at,
    )


def _validate_shift_request(request: ShiftDefinitionCreateRequest) -> None:
    if not request.shift_code:
        raise ValueError("SHIFT_CODE_REQUIRED: 班次码不能为空")
    if request.effective_to < request.effective_from:
        raise ValueError("INVALID_EFFECTIVE_PERIOD: 生效日期范围无效")
    if not request.segments:
        raise ValueError("SHIFT_SEGMENTS_REQUIRED: 班次至少需要一个活动分段")
    has_work = False
    for segment in request.segments:
        # 解析时间并校验格式；跨日模板允许结束时间早于开始时间
        parse_time_to_minutes(segment.start_time)
        parse_time_to_minutes(segment.end_time)
        if segment.start_time == segment.end_time:
            raise ValueError("SHIFT_SEGMENT_INVALID: 分段起止时间不能相同")
        if segment.activity_type == "work":
            has_work = True
    if not has_work:
        raise ValueError("SHIFT_WORK_SEGMENT_REQUIRED: 班次必须包含至少一个工作分段")


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()
