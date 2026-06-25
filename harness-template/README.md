# Lightweight Harness Template

This directory contains a reusable, project-neutral Harness bootstrap.

Use it from this repository:

```bash
bash harness-template/scripts/init-harness.sh /path/to/target-project target-project-name
```

Generated projects get:

- current state files under `docs/current/**`
- registry indexes under `docs/registry/**`
- quality/workflow rules under `docs/quality/**`
- state and check scripts under `scripts/**`

The template copies Harness mechanics only. It does not copy product history,
business data, application code, dependency files, or project-specific backlog
entries.
