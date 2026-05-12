# Backend

This backend is the B001 MVP vertical for `bpo-schedule-platform`.

## Scope

Included:

- FastAPI application
- Read-only schedule plan list endpoint
- Read-only schedule plan detail endpoint
- Local seed data
- Standard-library unittest coverage

Excluded:

- Database persistence
- Authentication and permissions
- Real Excel import
- Real CORN integration
- Create, edit, publish, approval, export, or batch operations
- Production status-code finalization
- Settlement formulas and charge factors

## Endpoints

```txt
GET /api/v1/schedule-plans
GET /api/v1/schedule-plans/{plan_id}
POST /api/v1/schedule-plans/drafts
PUT /api/v1/schedule-plans/{plan_id}/draft
```

## Run Tests

Use a Python 3.12 interpreter for all backend commands below.

```bash
<python-3.12> -m unittest discover -s backend/tests -v
```

## Run Locally

Install backend dependencies in a confirmed dependency setup environment:

```bash
<python-3.12> -m pip install -r backend/requirements.txt
```

Start the API:

```bash
<python-3.12> -m uvicorn backend.app.main:app --reload
```

Or start the first frontend + backend vertical together from the project root:

```bash
bash scripts/dev.sh
```
