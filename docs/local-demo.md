# Local Demo

## R003

R003 adds the local demo startup entry and health check for the local acceptance version. It does not add business features, UI changes, Docker, database work, real integrations, auth, permissions, approval, export, or complete E2E coverage.

## Start Demo

Run the local demo from the project root:

```bash
bash scripts/start-demo.sh
```

The script checks Node.js 22, checks a Python 3.12 backend runtime with required backend dev dependencies, starts FastAPI, starts Next.js, and prints the local addresses.

Default addresses:

```txt
Frontend: http://localhost:3000
Backend:  http://127.0.0.1:8000
Health:   http://127.0.0.1:8000/health
```

Useful overrides:

```bash
BPO_API_PORT=8010 BPO_WEB_PORT=3015 bash scripts/start-demo.sh
```

## Health Check

Backend health endpoint:

```txt
GET /health
```

Expected response:

```json
{
  "project": "bpo-schedule-platform",
  "status": "ok"
}
```

## Smoke

With the demo running, verify backend health and frontend reachability:

```bash
bash scripts/smoke-demo.sh
```

Optional overrides:

```bash
BPO_API_BASE_URL=http://127.0.0.1:8010 BPO_WEB_URL=http://localhost:3015 bash scripts/smoke-demo.sh
```

## Common Failures

- Node.js is not version 22: install Homebrew `node@22` or set `BPO_NODE22_BIN`.
- Python is not version 3.12: set `BPO_BACKEND_PYTHON` or `BPO_PYTHON312_BIN`.
- Backend dependencies are missing: install `backend/requirements.txt` in the selected Python environment.
- Smoke fails with connection refused: run `bash scripts/start-demo.sh` first and wait for both servers to finish starting.

## E2E Baseline

With the demo running, run the core browser smoke:

```bash
BPO_WEB_URL=http://localhost:3000 npm run e2e:smoke
```

For temporary ports:

```bash
BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke
```

Details are in `docs/e2e-smoke.md`.
