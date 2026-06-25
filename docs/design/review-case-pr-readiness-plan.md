# Review Case PR Readiness Plan

## 1. Decision

Use a split PR strategy before continuing new product development.

The current `codex/im237-harness-review-case-integration` branch is too large for a single routine review:

- 82 commits
- 290 changed files
- 6 logical phases
- frontend recovery, model split, Harness hygiene, review-case processing path, integration baseline, and acceptance closeout mixed together

The recommended path is to split review into three stacked PRs, then continue product development from the accepted baseline.

## 2. Recommended Stack

```text
main
  <- PR-1: Frontend health + model refactor + test split
      <- PR-2: Harness hygiene + review-case processing path
          <- PR-3: Review-case acceptance block
```

### PR-1: Frontend health + model refactor + test split

Scope:

- frontend health recovery
- loading/error/breadcrumb/action-placement cleanup
- production model split
- import-center and product-structure test gate split
- SimpleTable/MainTableShell extraction work

Approximate IM range:

- IM172-IM235

Reviewer focus:

- no product behavior drift from model extraction
- no package/lockfile changes
- test-split files are mechanical and covered by the full gate
- frontend health fixes do not introduce new backend or persistence scope

### PR-2: Harness hygiene + review-case processing path

Scope:

- Harness state hygiene and reusable Harness template
- review-case processing path UI/model baseline
- integration baseline for the review-case branch

Approximate IM range:

- IM236-IM238

Reviewer focus:

- Harness/current-state rules remain compact and executable
- no Gate/PM/Harness/Codex language leaks into product UI
- review-case processing path remains local MVP and operator-facing

### PR-3: Review-case acceptance block

Scope:

- four-stage review-case seed matrix
- live runtime smoke records for read paths
- write-action smoke records for evidence, conclusion, and closure
- decision not to add Playwright/E2E dependency in the current QA gate
- manual browser walkthrough evidence
- acceptance closeout

Approximate IM range:

- IM239-IM245

Reviewer focus:

- local MVP acceptance evidence is not presented as production readiness
- `.local/*.db` files are not PR artifacts
- no new package, lockfile, runtime automation, schema/migration, auth, permission, approval, export, batch operation, formula, settlement, or charge-factor scope

## 3. Why Not One PR

A single PR is possible, but it is not recommended.

Risks:

- reviewer must reason across unrelated categories: refactor, tests, Harness, product UI, backend seed, and QA evidence
- review comments become hard to route to the right logical phase
- revert granularity is poor
- follow-on development would continue stacking on an already broad branch

If a single PR is used anyway, the PR body must include a commit-range review guide matching the three sections above.

## 4. Split Execution Boundary

Actual PR split work should be a separate Git-operations task.

Allowed strategy:

1. Create PR-1 branch from current `origin/main`.
2. Cherry-pick the IM172-IM235 commit range.
3. Run `BPO_NODE22_BIN=/opt/homebrew/opt/node@22/bin bash scripts/check.sh`.
4. Push PR-1.
5. Create PR-2 branch from PR-1.
6. Cherry-pick IM236-IM238.
7. Run the full gate and push PR-2.
8. Create PR-3 branch from PR-2.
9. Cherry-pick IM239-IM245.
10. Run the full gate and push PR-3.

Hard stops:

- cherry-pick conflict touches product code outside the target PR scope
- commit ranges are ambiguous
- full gate fails after any PR branch is built
- package/lockfile changes appear unexpectedly
- `.local/**`, `.qoder/**`, or generated runtime artifacts become staged

## 5. Next Product Slice After PR Strategy

The next product development candidate should be:

```text
Comparison Run -> Review Case association chain
```

Why:

- it is adjacent to the completed review-case acceptance block
- it improves the data-quality closed loop
- it has lower risk than batch operations
- it is likely frontend-first and can avoid new schema/API work if existing fields are sufficient

Minimum future acceptance:

- comparison run detail shows a review-case link when an association exists
- review case detail links back to the source comparison run
- no-association state remains quiet and does not fabricate an error or placeholder action
- existing review-case list source filters remain consistent
- focused model tests and final full gate pass

Deferred candidates:

- review-case batch operations: deferred because batch operation capability is an explicit stop condition
- import batch row-level review-case trace: deferred because it likely needs backend query/API design

## 6. Recommended Qoder Packets For The Split Task

### Packet A: Commit Range Map

Read-only.

Produce exact commit ranges for PR-1, PR-2, and PR-3. Do not modify files, create branches, cherry-pick, commit, push, or start runtime.

Output:

- first and last commit for each PR
- files touched by each range
- obvious overlap/conflict risks
- proposed PR base/head names

### Packet B: Dry-Run Split Risk Review

Read-only.

Review whether the three proposed PR ranges can be cherry-picked in order without mixing forbidden files into the wrong PR.

Output:

- likely conflict files
- files that appear in multiple PR ranges
- suggested stop conditions
- whether the split should be performed by Codex directly or left as a single segmented PR

### Packet C: Codex Split Execution

Codex-owned after PM confirmation.

If PM confirms, Codex performs the actual branch/cherry-pick/push flow, owns final verification, and opens or prepares the PRs.
