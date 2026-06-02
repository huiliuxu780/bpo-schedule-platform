from backend.app.models import ReviewCaseDetail, ReviewClosureWriteRequest
from backend.app.review_persistence import ReviewPersistenceRepository


def write_review_closure(
    request: ReviewClosureWriteRequest,
    repository: ReviewPersistenceRepository,
) -> ReviewCaseDetail:
    existing = repository.get_review_case(request.case.case_id)
    if existing is not None:
        if existing.closure is not None or request.closure is None:
            return existing

        repository.close_case(request.closure)
        stored_existing = repository.get_review_case(request.case.case_id)
        if stored_existing is None:
            raise RuntimeError("created review closure detail could not be read back")
        return stored_existing

    repository.create_review_case(request.case)
    for evidence in request.evidence:
        repository.add_evidence(evidence)
    for conclusion in request.conclusions:
        repository.add_conclusion(conclusion)
    if request.closure is not None:
        repository.close_case(request.closure)

    stored = repository.get_review_case(request.case.case_id)
    if stored is None:
        raise RuntimeError("created review closure detail could not be read back")
    return stored
