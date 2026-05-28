from backend.app.models import ReviewCaseDetail, ReviewClosureWriteRequest
from backend.app.review_persistence import ReviewPersistenceRepository


def write_review_closure(
    request: ReviewClosureWriteRequest,
    repository: ReviewPersistenceRepository,
) -> ReviewCaseDetail:
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
