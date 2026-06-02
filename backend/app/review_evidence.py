from backend.app.models import ReviewCaseDetail, ReviewEvidenceInput
from backend.app.review_persistence import ReviewPersistenceRepository


def write_review_evidence(
    case_id: str,
    evidence: ReviewEvidenceInput,
    repository: ReviewPersistenceRepository,
) -> ReviewCaseDetail:
    if evidence.case_id != case_id:
        raise ValueError("case_id mismatch between path and evidence payload")

    existing = repository.get_review_case(case_id)
    if existing is None:
        raise ValueError(f"review case does not exist: {case_id}")
    if existing.closure is not None or existing.case.status == "closed":
        raise ValueError(f"review case {case_id} is already closed")

    repository.add_evidence(evidence)
    stored = repository.get_review_case(case_id)
    if stored is None:
        raise RuntimeError("review case evidence detail could not be read back")
    return stored
