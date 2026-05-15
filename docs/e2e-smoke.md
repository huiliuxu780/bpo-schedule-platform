# E2E Smoke

## R004

R004 adds a minimal browser-level core path E2E baseline for local acceptance. It does not add business features, UI changes, backend business changes, database work, real integrations, auth, permissions, approval, export, or a full E2E test platform.

## Coverage

The smoke covers one browser-level local review path:

1. `/dashboard` renders the dashboard baseline.
2. `/demand-plans` renders demand plans.
3. `/schedule-plans` renders schedule plans.
4. A schedule plan row opens plan detail.
5. Plan detail opens scoped risk review.
6. Risk review returns to the same plan detail path.
7. Plan detail opens scoped shift details.
8. Shift details returns to the same plan detail path.
9. Plan detail opens scoped unavailability.
10. Browser history returns from unavailability to the same plan detail path.

## Start Demo

Start the local demo first:

```bash
BPO_API_PORT=8010 BPO_WEB_PORT=3015 bash scripts/start-demo.sh
```

Default addresses are still documented in `docs/local-demo.md`.

## Run Smoke

In another terminal:

```bash
BPO_API_BASE_URL=http://127.0.0.1:8010 BPO_WEB_URL=http://localhost:3015 bash scripts/smoke-demo.sh
```

## Run E2E

With the demo running:

```bash
BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke
```

By default the local smoke uses the installed Google Chrome channel. To use a bundled Playwright browser instead, install the browser first and override the channel:

```bash
npx playwright install chromium
PLAYWRIGHT_CHANNEL=chromium BPO_WEB_URL=http://localhost:3015 npm run e2e:smoke
```

The full E2E command is:

```bash
npm run e2e
```

## Environment Variables

- `BPO_WEB_URL`: frontend URL used by Playwright, default `http://localhost:3000`.
- `BPO_API_PORT`: backend port used by `scripts/start-demo.sh`, default `8000`.
- `BPO_WEB_PORT`: frontend port used by `scripts/start-demo.sh`, default `3000`.
- `BPO_API_BASE_URL`: backend URL used by `scripts/smoke-demo.sh`, default `http://127.0.0.1:8000`.
- `PLAYWRIGHT_CHANNEL`: browser channel used by Playwright, default `chrome`.

## Common Failures

- Demo is not running: start `scripts/start-demo.sh` before E2E.
- Port mismatch: use the same `BPO_WEB_PORT` and `BPO_WEB_URL`.
- Browser missing: install Google Chrome or run `npx playwright install chromium` and set `PLAYWRIGHT_CHANNEL=chromium`.
- Page copy or navigation changed: update the smoke selectors only after confirming product behavior is still correct.

## Not Covered

- Full approval, export, batch operation, auth, permission, or database flows.
- Cross-browser matrix.
- Visual regression.
- Exhaustive table sorting/filtering coverage.
- Unavailability page's own return link to plan detail; current smoke uses browser history for that return because the page-level link does not carry `planId`.
