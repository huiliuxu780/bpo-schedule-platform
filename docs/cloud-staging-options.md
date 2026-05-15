# Cloud Staging Options

## R006

R006 selects a cloud staging path for the current Local Acceptance Candidate. It does not deploy, buy services, create cloud resources, change code, change tests, or introduce database work.

## Current Baseline

- Local demo starts through `bash scripts/start-demo.sh`.
- Local smoke passes through `bash scripts/smoke-demo.sh`.
- Core path E2E passes through `npm run e2e:smoke`.
- Full project check passes through `bash scripts/check.sh`.
- The project has no production database, auth, permission, approval, export, batch operation, settlement, or charge-factor scope.

## Options

| Option | Fit | Needs | Pros | Cons | Complexity | Cost Risk | Match | Current Stage Fit |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Vercel frontend + Render/Railway/Fly.io backend | Fast public demo with managed services | Two services, frontend env for backend URL, backend health URL | Fast setup, simple frontend preview, easy sharing | Cross-service env/CORS/logging decisions, two deployment surfaces | Medium | Low to medium | Good for Next.js + FastAPI demo | Recommended first path |
| Single VPS | One-machine control for frontend and backend | VPS, Node 22, Python 3.12, process manager, reverse proxy | Full control, one host, simple network topology | More ops work, patching, process supervision, TLS setup | Medium to high | Medium | Good when infrastructure control matters | Backup path, not first |
| Enterprise internal server / intranet test machine | Internal-only validation | Internal host, network access, runtime install, firewall rules | Fits corporate security, no public exposure | Slower coordination, environment access and logs may be constrained | Medium | Low if server exists | Good for private stakeholder review | Good if an internal host is already available |
| Docker Compose on local/server | Repeatable runtime packaging | Dockerfiles or compose files, image build path, port/env plan | Reproducible, portable, closer to deployment discipline | Adds container maintenance before cloud path is chosen | Medium | Low | Useful later for VPS/internal server | Not first unless server requires Docker |

## Recommendation

### First Choice

Use `Vercel frontend + Render/Railway/Fly.io backend` for the first cloud staging attempt.

Reason:

- The current product needs a quick shareable test URL more than production infrastructure.
- Next.js frontend and FastAPI backend can be deployed as two small managed services.
- Existing local checks already separate frontend URL, backend URL, health, smoke, and E2E.
- No database is required, so managed service setup stays small.

### Backup

Use a single VPS if managed backend hosting creates friction around startup commands, runtime versions, or logs.

### Not Recommended Now

- Do not start with Kubernetes, production CI/CD, database provisioning, auth, permission, approval, export, batch operation, settlement, charge-factor, or production formula work.
- Do not start with a full Docker migration unless the chosen host requires it.
- Do not buy or configure services in R006; use this document to drive R007.

## R007 Draft: Implement Selected Cloud Staging

R007 should implement the chosen staging path after PM confirms the platform.

### Resources To Create

- One frontend service for Next.js.
- One backend service for FastAPI.
- One remote backend health URL.
- One remote frontend URL.
- Optional staging log access.

### Environment Variables

| Variable | Purpose |
| --- | --- |
| `BPO_WEB_URL` | Remote frontend URL for smoke/E2E checks |
| `BPO_API_BASE_URL` | Remote backend base URL for smoke checks |
| Frontend backend base URL | Platform-specific variable used by the frontend if required |
| `PLAYWRIGHT_CHANNEL` | Local browser channel for remote E2E validation |

### Deployment Order

1. Deploy backend with Python 3.12.
2. Verify remote `/health`.
3. Deploy frontend with Node.js 22.
4. Configure frontend to use the backend URL if needed.
5. Run remote smoke.
6. Run remote core path E2E.
7. Record remote URLs and blockers.

### Verification

```bash
BPO_API_BASE_URL=<remote-backend-url> BPO_WEB_URL=<remote-frontend-url> bash scripts/smoke-demo.sh
BPO_WEB_URL=<remote-frontend-url> npm run e2e:smoke
bash scripts/check.sh
```

### Rollback

- Revert to the previous deployment on the selected hosting platform.
- Keep the local acceptance path as the fallback verification baseline.
- If remote smoke fails, do not mark the project Cloud Staging Ready.

### Success Standard

- Remote frontend URL is reachable.
- Remote backend `/health` returns `status: ok`.
- Remote smoke passes.
- Remote core path E2E passes.
- No database or production workflow scope is introduced.
