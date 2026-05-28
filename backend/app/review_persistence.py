from datetime import datetime, timezone

from sqlalchemy import ForeignKey, String, UniqueConstraint, select
from sqlalchemy.orm import Mapped, Session, mapped_column, sessionmaker

from backend.app.comparison_persistence import (
    ForecastScheduleComparisonResultEntity,
    ScheduleActualComparisonResultEntity,
)
from backend.app.import_persistence import Base, build_engine
from backend.app.models import (
    ReviewCaseCreateRequest,
    ReviewCaseDetail,
    ReviewCaseRecord,
    ReviewClosureInput,
    ReviewClosureRecord,
    ReviewConclusionInput,
    ReviewConclusionRecord,
    ReviewEvidenceInput,
    ReviewEvidenceRecord,
    ReviewSourceResultType,
)


class ReviewCaseEntity(Base):
    __tablename__ = "review_cases"

    case_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    source_result_type: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    source_result_id: Mapped[int] = mapped_column(nullable=False, index=True)
    business_date: Mapped[str] = mapped_column(String(20), nullable=False)
    owner_id: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    severity: Mapped[str] = mapped_column(String(40), nullable=False)
    status: Mapped[str] = mapped_column(String(40), nullable=False)
    created_at: Mapped[str] = mapped_column(String(40), nullable=False)


class ReviewEvidenceEntity(Base):
    __tablename__ = "review_evidence"

    evidence_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    case_id: Mapped[str] = mapped_column(
        ForeignKey("review_cases.case_id"),
        nullable=False,
        index=True,
    )
    evidence_type: Mapped[str] = mapped_column(String(80), nullable=False)
    evidence_uri: Mapped[str] = mapped_column(String(500), nullable=False)
    submitted_by: Mapped[str] = mapped_column(String(120), nullable=False)
    submitted_at: Mapped[str] = mapped_column(String(40), nullable=False)
    note: Mapped[str | None] = mapped_column(String(1000), nullable=True)


class ReviewConclusionEntity(Base):
    __tablename__ = "review_conclusions"

    conclusion_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    case_id: Mapped[str] = mapped_column(
        ForeignKey("review_cases.case_id"),
        nullable=False,
        index=True,
    )
    conclusion_type: Mapped[str] = mapped_column(String(80), nullable=False)
    risk_level: Mapped[str] = mapped_column(String(40), nullable=False)
    conclusion_text: Mapped[str] = mapped_column(String(1000), nullable=False)
    decided_by: Mapped[str] = mapped_column(String(120), nullable=False)
    decided_at: Mapped[str] = mapped_column(String(40), nullable=False)


class ReviewClosureEntity(Base):
    __tablename__ = "review_closures"
    __table_args__ = (UniqueConstraint("case_id", name="uq_review_closures_case_id"),)

    closure_id: Mapped[str] = mapped_column(String(120), primary_key=True)
    case_id: Mapped[str] = mapped_column(
        ForeignKey("review_cases.case_id"),
        nullable=False,
        index=True,
    )
    closure_status: Mapped[str] = mapped_column(String(40), nullable=False)
    closed_by: Mapped[str] = mapped_column(String(120), nullable=False)
    closed_at: Mapped[str] = mapped_column(String(40), nullable=False)
    closure_note: Mapped[str | None] = mapped_column(String(1000), nullable=True)


class ReviewPersistenceRepository:
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

    def create_review_case(self, request: ReviewCaseCreateRequest) -> ReviewCaseDetail:
        with self.session_factory.begin() as session:
            if session.get(ReviewCaseEntity, request.case_id) is not None:
                raise ValueError(f"review case already exists: {request.case_id}")
            self._validate_source_result(session, request)
            session.add(
                ReviewCaseEntity(
                    case_id=request.case_id,
                    source_result_type=request.source_result_type,
                    source_result_id=request.source_result_id,
                    business_date=request.business_date,
                    owner_id=request.owner_id,
                    severity=request.severity,
                    status=request.status,
                    created_at=_now_iso(),
                )
            )

        stored = self.get_review_case(request.case_id)
        if stored is None:
            raise RuntimeError("created review case could not be read back")
        return stored

    def add_evidence(self, request: ReviewEvidenceInput) -> ReviewEvidenceRecord:
        created_at = _now_iso()
        with self.session_factory.begin() as session:
            self._validate_case_exists(session, request.case_id)
            if session.get(ReviewEvidenceEntity, request.evidence_id) is not None:
                raise ValueError(f"review evidence already exists: {request.evidence_id}")
            entity = ReviewEvidenceEntity(
                evidence_id=request.evidence_id,
                case_id=request.case_id,
                evidence_type=request.evidence_type,
                evidence_uri=request.evidence_uri,
                submitted_by=request.submitted_by,
                submitted_at=created_at,
                note=request.note,
            )
            session.add(entity)

        stored = self._get_evidence(request.evidence_id)
        if stored is None:
            raise RuntimeError("created review evidence could not be read back")
        return stored

    def add_conclusion(self, request: ReviewConclusionInput) -> ReviewConclusionRecord:
        created_at = _now_iso()
        with self.session_factory.begin() as session:
            self._validate_case_exists(session, request.case_id)
            if session.get(ReviewConclusionEntity, request.conclusion_id) is not None:
                raise ValueError(
                    f"review conclusion already exists: {request.conclusion_id}"
                )
            entity = ReviewConclusionEntity(
                conclusion_id=request.conclusion_id,
                case_id=request.case_id,
                conclusion_type=request.conclusion_type,
                risk_level=request.risk_level,
                conclusion_text=request.conclusion_text,
                decided_by=request.decided_by,
                decided_at=created_at,
            )
            session.add(entity)

        stored = self._get_conclusion(request.conclusion_id)
        if stored is None:
            raise RuntimeError("created review conclusion could not be read back")
        return stored

    def close_case(self, request: ReviewClosureInput) -> ReviewClosureRecord:
        created_at = _now_iso()
        with self.session_factory.begin() as session:
            self._validate_case_exists(session, request.case_id)
            existing_for_case = session.scalar(
                select(ReviewClosureEntity).where(
                    ReviewClosureEntity.case_id == request.case_id
                )
            )
            if existing_for_case is not None:
                raise ValueError(f"review case {request.case_id} is already closed")
            if session.get(ReviewClosureEntity, request.closure_id) is not None:
                raise ValueError(f"review closure already exists: {request.closure_id}")
            entity = ReviewClosureEntity(
                closure_id=request.closure_id,
                case_id=request.case_id,
                closure_status=request.closure_status,
                closed_by=request.closed_by,
                closed_at=created_at,
                closure_note=request.closure_note,
            )
            session.add(entity)

        stored = self._get_closure(request.closure_id)
        if stored is None:
            raise RuntimeError("created review closure could not be read back")
        return stored

    def get_review_case(self, case_id: str) -> ReviewCaseDetail | None:
        with self.session_factory() as session:
            case = session.get(ReviewCaseEntity, case_id)
            if case is None:
                return None
            evidence = list(
                session.scalars(
                    select(ReviewEvidenceEntity)
                    .where(ReviewEvidenceEntity.case_id == case_id)
                    .order_by(ReviewEvidenceEntity.submitted_at, ReviewEvidenceEntity.evidence_id)
                )
            )
            conclusions = list(
                session.scalars(
                    select(ReviewConclusionEntity)
                    .where(ReviewConclusionEntity.case_id == case_id)
                    .order_by(
                        ReviewConclusionEntity.decided_at,
                        ReviewConclusionEntity.conclusion_id,
                    )
                )
            )
            closure = session.scalar(
                select(ReviewClosureEntity).where(ReviewClosureEntity.case_id == case_id)
            )

        return ReviewCaseDetail(
            case=_case_record(case),
            evidence=[_evidence_record(row) for row in evidence],
            conclusions=[_conclusion_record(row) for row in conclusions],
            closure=_closure_record(closure) if closure is not None else None,
        )

    def list_review_cases(
        self,
        business_date: str | None = None,
        owner_id: str | None = None,
        status: str | None = None,
        severity: str | None = None,
        source_result_type: ReviewSourceResultType | None = None,
    ) -> list[ReviewCaseRecord]:
        statement = select(ReviewCaseEntity)
        if business_date is not None:
            statement = statement.where(ReviewCaseEntity.business_date == business_date)
        if owner_id is not None:
            statement = statement.where(ReviewCaseEntity.owner_id == owner_id)
        if status is not None:
            statement = statement.where(ReviewCaseEntity.status == status)
        if severity is not None:
            statement = statement.where(ReviewCaseEntity.severity == severity)
        if source_result_type is not None:
            statement = statement.where(
                ReviewCaseEntity.source_result_type == source_result_type
            )
        statement = statement.order_by(
            ReviewCaseEntity.business_date,
            ReviewCaseEntity.case_id,
        )
        with self.session_factory() as session:
            return [_case_record(row) for row in session.scalars(statement)]

    def _validate_source_result(
        self,
        session: Session,
        request: ReviewCaseCreateRequest,
    ) -> None:
        if request.source_result_type == "forecast_schedule":
            source = session.get(
                ForecastScheduleComparisonResultEntity,
                request.source_result_id,
            )
        else:
            source = session.get(
                ScheduleActualComparisonResultEntity,
                request.source_result_id,
            )
        if source is None:
            raise ValueError(
                f"{request.source_result_type} source_result_id "
                f"{request.source_result_id} does not exist"
            )
        if source.business_date != request.business_date:
            raise ValueError(
                f"{request.source_result_type} source_result_id "
                f"{request.source_result_id} does not match review case business_date"
            )

    def _validate_case_exists(self, session: Session, case_id: str) -> None:
        if session.get(ReviewCaseEntity, case_id) is None:
            raise ValueError(f"review case {case_id} does not exist")

    def _get_evidence(self, evidence_id: str) -> ReviewEvidenceRecord | None:
        with self.session_factory() as session:
            entity = session.get(ReviewEvidenceEntity, evidence_id)
            return _evidence_record(entity) if entity is not None else None

    def _get_conclusion(self, conclusion_id: str) -> ReviewConclusionRecord | None:
        with self.session_factory() as session:
            entity = session.get(ReviewConclusionEntity, conclusion_id)
            return _conclusion_record(entity) if entity is not None else None

    def _get_closure(self, closure_id: str) -> ReviewClosureRecord | None:
        with self.session_factory() as session:
            entity = session.get(ReviewClosureEntity, closure_id)
            return _closure_record(entity) if entity is not None else None


def _case_record(entity: ReviewCaseEntity) -> ReviewCaseRecord:
    return ReviewCaseRecord(
        case_id=entity.case_id,
        source_result_type=entity.source_result_type,
        source_result_id=entity.source_result_id,
        business_date=entity.business_date,
        owner_id=entity.owner_id,
        severity=entity.severity,
        status=entity.status,
        created_at=entity.created_at,
    )


def _evidence_record(entity: ReviewEvidenceEntity) -> ReviewEvidenceRecord:
    return ReviewEvidenceRecord(
        evidence_id=entity.evidence_id,
        case_id=entity.case_id,
        evidence_type=entity.evidence_type,
        evidence_uri=entity.evidence_uri,
        submitted_by=entity.submitted_by,
        submitted_at=entity.submitted_at,
        note=entity.note,
    )


def _conclusion_record(entity: ReviewConclusionEntity) -> ReviewConclusionRecord:
    return ReviewConclusionRecord(
        conclusion_id=entity.conclusion_id,
        case_id=entity.case_id,
        conclusion_type=entity.conclusion_type,
        risk_level=entity.risk_level,
        conclusion_text=entity.conclusion_text,
        decided_by=entity.decided_by,
        decided_at=entity.decided_at,
    )


def _closure_record(entity: ReviewClosureEntity) -> ReviewClosureRecord:
    return ReviewClosureRecord(
        closure_id=entity.closure_id,
        case_id=entity.case_id,
        closure_status=entity.closure_status,
        closed_by=entity.closed_by,
        closed_at=entity.closed_at,
        closure_note=entity.closure_note,
    )


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()
