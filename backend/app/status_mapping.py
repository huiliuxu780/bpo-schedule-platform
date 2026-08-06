"""Status → business activity mappings (CORN WFM V2.0 chapter 8.4).

Maps the raw triple ``status / sub_status / status_cd`` to a business
activity and carries the boolean switches that drive attendance, working-hour,
coverage, rest and punctuality calibers. This extends the existing
``actual_status_dictionary`` caliber, which only maps a single external code.
"""

from __future__ import annotations

from sqlalchemy import Boolean, String, select
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker

from backend.app.import_persistence import Base, build_engine
from backend.app.models import (
    StatusMappingListResponse,
    StatusMappingPutRequest,
    StatusMappingRecord,
)


class StatusActivityMappingEntity(Base):
    __tablename__ = "status_activity_mappings"

    status: Mapped[str] = mapped_column(String(80), primary_key=True)
    sub_status: Mapped[str] = mapped_column(String(80), primary_key=True)
    status_cd: Mapped[str] = mapped_column(String(80), primary_key=True)
    activity_code: Mapped[str] = mapped_column(String(80), nullable=False)
    activity_name: Mapped[str] = mapped_column(String(255), nullable=False)
    counts_attendance: Mapped[bool] = mapped_column(Boolean, nullable=False)
    counts_valid_hours: Mapped[bool] = mapped_column(Boolean, nullable=False)
    counts_production_hours: Mapped[bool] = mapped_column(Boolean, nullable=False)
    counts_coverage: Mapped[bool] = mapped_column(Boolean, nullable=False)
    counts_rest: Mapped[bool] = mapped_column(Boolean, nullable=False)
    counts_punctuality: Mapped[bool] = mapped_column(Boolean, nullable=False)


class StatusMappingRepository:
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

    def list_mappings(self) -> StatusMappingListResponse:
        with self.session_factory() as session:
            entities = list(
                session.scalars(
                    select(StatusActivityMappingEntity).order_by(
                        StatusActivityMappingEntity.status,
                        StatusActivityMappingEntity.sub_status,
                        StatusActivityMappingEntity.status_cd,
                    )
                )
            )
        return StatusMappingListResponse(
            items=[_record(entity) for entity in entities]
        )

    def upsert_mappings(
        self, request: StatusMappingPutRequest
    ) -> StatusMappingListResponse:
        with self.session_factory.begin() as session:
            for item in request.items:
                session.merge(
                    StatusActivityMappingEntity(
                        status=item.status,
                        sub_status=item.sub_status,
                        status_cd=item.status_cd,
                        activity_code=item.activity_code,
                        activity_name=item.activity_name,
                        counts_attendance=item.counts_attendance,
                        counts_valid_hours=item.counts_valid_hours,
                        counts_production_hours=item.counts_production_hours,
                        counts_coverage=item.counts_coverage,
                        counts_rest=item.counts_rest,
                        counts_punctuality=item.counts_punctuality,
                    )
                )
        return self.list_mappings()


def _record(entity: StatusActivityMappingEntity) -> StatusMappingRecord:
    return StatusMappingRecord(
        status=entity.status,
        sub_status=entity.sub_status,
        status_cd=entity.status_cd,
        activity_code=entity.activity_code,
        activity_name=entity.activity_name,
        counts_attendance=bool(entity.counts_attendance),
        counts_valid_hours=bool(entity.counts_valid_hours),
        counts_production_hours=bool(entity.counts_production_hours),
        counts_coverage=bool(entity.counts_coverage),
        counts_rest=bool(entity.counts_rest),
        counts_punctuality=bool(entity.counts_punctuality),
    )
