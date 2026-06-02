from backend.app.models import ReviewCaseDetail, ReviewConclusionInput
from backend.app.review_persistence import ReviewPersistenceRepository


def write_review_conclusion(
    case_id: str,
    conclusion: ReviewConclusionInput,
    repository: ReviewPersistenceRepository,
) -> ReviewCaseDetail:
    if conclusion.case_id != case_id:
        raise ValueError("case_id mismatch between path and conclusion payload")

    existing = repository.get_review_case(case_id)
    if existing is None:
        raise ValueError(f"review case does not exist: {case_id}")
    if existing.closure is not None or existing.case.status == "closed":
        raise ValueError(f"review case {case_id} is already closed")

    repository.add_conclusion(conclusion)
    stored = repository.get_review_case(case_id)
    if stored is None:
        raise RuntimeError("review case conclusion detail could not be read back")
    return stored
