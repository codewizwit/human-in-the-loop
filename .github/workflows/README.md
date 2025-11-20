# GitHub Actions Workflows

This directory contains the CI/CD workflows for the Human-in-the-Loop project using **composite actions** for maintainability and **single-job PR validation** for efficiency.

---

## Architecture

### Composite Actions (`.github/actions/`)

Reusable steps that can be called from any workflow:

- **`setup-node-pnpm/`** - Setup Node.js, pnpm, and install dependencies
- **`lint/`** - Run ESLint and Prettier format checks
- **`test/`** - Run test suite with optional coverage
- **`build/`** - Build CLI and run type checking
- **`check-links/`** - Validate documentation links
- **`update-tree/`** - Regenerate repository structure tree in README.md

### Workflows

- **`pr-validation.yml`** - Single comprehensive PR validation job
- **`publish-npm.yml`** - Release and publish to npm
- **`label-pr.yml`** - Auto-label PRs based on changed files

---

## Workflows Overview

### ✅ Pull Request Validation (`pr-validation.yml`)

**Purpose:** Comprehensive quality gate before code can be merged

**Triggers:**

- Pull requests to `main`

**Steps:**

1. **Setup** - Checkout code and setup Node.js/pnpm
2. **Lint** - ESLint + Prettier formatting checks
3. **Test** - Unit tests with coverage
4. **Build** - Type checking + build validation
5. **Check Links** - Validate documentation links
6. **Update Tree** - Regenerate repository structure in README.md
7. **Tree Check** - Ensure tree is up to date (fails if `pnpm tree` needed)
8. **Security Audit** - `pnpm audit` for vulnerabilities
9. **Secrets Scan** - TruffleHog for exposed secrets
10. **TypeDoc Comments** - Ensure all exported functions have TypeDoc
11. **Inline Comments** - No `//` comments in source files
12. **README Validation** - All new features have proper READMEs
13. **YAML Validation** - Prompt YAML schema validation
14. **Upload Coverage** - Send coverage to Codecov

**Benefits:**

- ✅ Single job = faster execution with shared setup
- ✅ Clear validation order (fails fast on lint/test)
- ✅ Composite actions = easy to maintain
- ✅ No duplication = runs once per PR

---

### 🏷️ Auto Label PRs (`label-pr.yml`)

**Purpose:** Automatically label PRs based on changed files

**Triggers:**

- Pull request opened/synchronized/reopened

**Labels:**

- `prompt`, `agent`, `context-pack`, `cli`, `docs`, `test`, etc.

---

### 📦 Release and Publish (`publish-npm.yml`)

**Purpose:** Version bump, build, and publish to npm

**Triggers:**

- Manual workflow dispatch

**Steps:**

1. Run tests (lint, typecheck, test)
2. Bump version (conventional commits or manual)
3. Build with new version
4. Push version bump and tags
5. Publish to npm with provenance
6. Create GitHub release

---

## Composite Actions Benefits

### Before (Reusable Workflows)

```yaml
# pr-validation.yml had multiple jobs calling workflows
jobs:
  lint:
    uses: ./.github/workflows/lint.yml # Separate job
  test:
    uses: ./.github/workflows/test.yml # Separate job
  build:
    runs-on: ubuntu-latest # Inline job
    steps:
      - checkout
      - setup pnpm
      - setup node
      - install deps
      - build
```

**Problems:**

- Multiple jobs = slower execution (separate runners)
- Each job reinstalls dependencies
- Complex dependency management (needs: [lint, test])

### After (Composite Actions)

```yaml
# pr-validation.yml has ONE job with composite actions
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - checkout
      - uses: ./.github/actions/setup-node-pnpm
      - uses: ./.github/actions/lint
      - uses: ./.github/actions/test
      - uses: ./.github/actions/build
      - uses: ./.github/actions/check-links
```

**Benefits:**

- ✅ Single job = faster (shared runner, shared cache)
- ✅ Install dependencies once
- ✅ Sequential execution = fails fast
- ✅ Easy to maintain (edit action, affects all workflows)
- ✅ Consistent setup across all workflows

---

## Adding New Validations

### Add as Composite Action (Recommended)

If the check is reusable and simple:

1. Create `.github/actions/my-check/action.yml`
2. Add steps with `shell: bash`
3. Use in `pr-validation.yml`

Example:

```yaml
# .github/actions/my-check/action.yml
name: My Check
description: Validate something

runs:
  using: composite
  steps:
    - name: Run check
      shell: bash
      run: ./scripts/my-check.sh
```

### Add as Inline Step

If the check is PR-specific or complex:

1. Add step directly in `pr-validation.yml`
2. No need for separate action

---

## Workflow Execution Flow

### On Pull Request to Main

```
Developer opens PR to main
  ↓
pr-validation.yml triggers (SINGLE JOB)
  ├── Checkout code
  ├── Setup Node.js with pnpm (composite action)
  ├── Lint (composite action)
  ├── Test (composite action)
  ├── Build (composite action)
  ├── Check Links (composite action)
  ├── Security audit
  ├── Secrets scan
  ├── Documentation checks
  └── Upload coverage
  ↓
label-pr.yml triggers
  └── Auto-apply labels
```

**Result:** Fast, comprehensive validation in single job

---

## Quick Reference

| Workflow            | Trigger             | Main Purpose                  | Type                |
| ------------------- | ------------------- | ----------------------------- | ------------------- |
| `pr-validation.yml` | `pull_request`      | Comprehensive PR quality gate | Workflow (1 job)    |
| `check-links.yml`   | `push`, `cron`      | Validate documentation links  | Workflow + Reusable |
| `publish-npm.yml`   | `workflow_dispatch` | Release and publish to npm    | Workflow            |
| `label-pr.yml`      | `pull_request`      | Auto-label PRs                | Workflow            |

| Composite Action   | Purpose                       | Used In                 |
| ------------------ | ----------------------------- | ----------------------- |
| `setup-node-pnpm/` | Setup Node.js, pnpm, deps     | All workflows           |
| `lint/`            | ESLint + Prettier checks      | `pr-validation.yml`     |
| `test/`            | Run tests with coverage       | `pr-validation.yml`     |
| `build/`           | Build + typecheck             | `pr-validation.yml`     |
| `check-links/`     | Documentation link validation | `pr-validation.yml`     |
| `update-tree/`     | Regenerate repo tree in README| `pr-validation.yml`     |

---

## Troubleshooting

### Why didn't my workflow run?

**Check the trigger conditions:**

- Pull requests target `main` branch
- Not a draft PR (unless configured to run on drafts)

### How do I test workflow changes?

**Best practices:**

1. Create feature branch: `feature/workflow-updates`
2. Make changes to workflow or composite actions
3. Open PR → `pr-validation.yml` runs
4. Check Actions tab for results
5. Iterate until green ✅

### How do I update a composite action?

1. Edit `.github/actions/{action-name}/action.yml`
2. Changes automatically apply to all workflows using it
3. Test in a PR to see the effect

---

## Maintenance

**Last Updated:** 2025-11-19
**Maintained By:** codewizwit
**Review Cadence:** Update when adding new workflows or composite actions

**Recent Changes:**

- 2025-11-19: Migrated to composite actions architecture
  - Removed `ci.yml`, `lint.yml`, `test.yml` reusable workflows
  - Created 5 composite actions for reusable steps
  - Simplified `pr-validation.yml` to single job
  - Added link checking to PR validation
- 2025-10-15: Removed duplicate triggers (ci.yml + pr-validation.yml deduplication)
- 2025-10-15: Created this README to document workflow strategy

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
