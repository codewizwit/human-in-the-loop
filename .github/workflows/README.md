# GitHub Actions Workflows

This directory contains the CI/CD workflows for the Human-in-the-Loop project. Our workflow strategy separates continuous integration (on push) from pull request validation to avoid duplicate runs while maintaining fast feedback loops.

---

## Workflow Strategy

### Philosophy

- **`push` triggers** = "I'm actively developing" → Fast feedback on code quality
- **`pull_request` triggers** = "I'm ready for review" → Comprehensive validation before merge
- **Clear separation** = No duplicate jobs, efficient resource usage

---

## Workflows Overview

### 🔄 Continuous Integration (`ci.yml`)

**Purpose:** Validate code quality on every push to main and feature branches

**Triggers:**
- Push to `main`, `feature/**`, `bugfix/**`, `hotfix/**`

**Jobs:**
- **Lint** (calls `lint.yml`) - ESLint + Prettier formatting
- **Test** (calls `test.yml`) - Unit tests with coverage
- **Build** - Nx build of CLI package

**When it runs:**
- Every push to feature branches → Immediate feedback
- Every push to main → Post-merge validation

---

### ✅ Pull Request Validation (`pr-validation.yml`)

**Purpose:** Comprehensive quality gate before code can be merged

**Triggers:**
- Pull requests to `main`

**Jobs:**
- **Lint & Format** (calls `lint.yml`)
- **Test** (calls `test.yml`)
- **Build** - Type checking + build validation
- **Security Checks**
  - `pnpm audit` for dependency vulnerabilities
  - TruffleHog for secrets scanning
- **Documentation Checks**
  - TypeDoc comments on all exported functions
  - No inline `//` comments in source files (except test files)
  - README.md in all new feature directories
  - Usage sections in toolkit READMEs
- **Contribution Validation**
  - Prompt YAML schema validation (id, version, author, license, examples)
  - Secrets scanning

**When it runs:**
- Only when a PR is opened/updated to main
- More comprehensive than CI to ensure merge quality

---

### 🔗 Check Documentation Links (`check-links.yml`)

**Purpose:** Ensure all documentation links are valid

**Triggers:**
- Push to `main` only
- Weekly schedule (Mondays at 9am UTC)

**Jobs:**
- Check all markdown links in docs/
- Validate internal links between files
- Check external links (weekly to catch link rot)

**When it runs:**
- After merge to main → Catch broken links from PRs
- Weekly → Detect external link breakage

**Why not on PRs:** Avoids duplicate runs (PR validation covers docs quality)

---

### 🏷️ Auto Label PRs (`label-pr.yml`)

**Purpose:** Automatically label PRs based on changed files

**Triggers:**
- Pull request opened/synchronized/reopened

**Jobs:**
- Apply labels using `.github/labeler.yml` config

**Labels:**
- `prompt`, `agent`, `context-pack`, `cli`, `docs`, `test`, etc.

---

### 🔧 Reusable Workflows

These workflows are called by other workflows, not triggered directly:

#### `lint.yml` (workflow_call)
- Runs ESLint
- Checks Prettier formatting
- Called by: `ci.yml`, `pr-validation.yml`

#### `test.yml` (workflow_call)
- Runs unit tests
- Generates coverage reports
- Uploads to Codecov
- Called by: `ci.yml`, `pr-validation.yml`

#### `setup-node.yml` (workflow_call)
- Reusable Node.js setup
- Configures pnpm, caching, dependencies

---

## Workflow Execution Flow

### On Feature Branch Push

```
Developer pushes to feature/my-feature
  ↓
ci.yml triggers
  ├── Lint (via lint.yml)
  ├── Test (via test.yml)
  └── Build
```

**Result:** Fast feedback on code quality while developing

---

### On Pull Request to Main

```
Developer opens PR to main
  ↓
pr-validation.yml triggers
  ├── Lint & Format (via lint.yml)
  ├── Test (via test.yml)
  ├── Build + Type Check
  ├── Security Checks
  ├── Documentation Validation
  └── Contribution Validation
  ↓
label-pr.yml triggers
  └── Auto-apply labels
```

**Result:** Comprehensive validation before merge, no duplication with CI

---

### On Push to Main

```
PR merged to main
  ↓
ci.yml triggers (post-merge validation)
  ├── Lint
  ├── Test
  └── Build
  ↓
check-links.yml triggers
  └── Validate all documentation links
```

**Result:** Ensure main branch stays healthy, catch any broken links

---

## Why This Strategy?

### ❌ Old Problem (Before Deduplication)

```
Developer opens PR to main
  ↓
ci.yml runs (on pull_request)
  ├── Lint
  ├── Test
  └── Build
  ↓
pr-validation.yml runs (on pull_request)
  ├── Lint  ← DUPLICATE
  ├── Test  ← DUPLICATE
  ├── Build ← DUPLICATE
  └── ...other checks
```

**Result:** Lint, Test, Build ran **2x on every PR** = wasted CI minutes

### ✅ New Solution (After Deduplication)

```
ci.yml: Only on push (not pull_request)
pr-validation.yml: Only on pull_request (not push)
```

**Result:** Each job runs exactly once when needed

---

## Adding New Workflows

### Guidelines

1. **Choose the right trigger:**
   - Development feedback → Use `push` trigger in `ci.yml`
   - PR quality gate → Use `pull_request` trigger in `pr-validation.yml`
   - Post-merge validation → Use `push` to `main` only
   - Scheduled tasks → Use `schedule` cron

2. **Avoid duplication:**
   - Check if another workflow already covers your use case
   - Don't add both `push` and `pull_request` for the same job
   - Use reusable workflows (`workflow_call`) to avoid code duplication

3. **Name clearly:**
   - Use descriptive workflow names
   - Match filename to workflow purpose

4. **Document here:**
   - Add overview to this README
   - Explain when it runs and why
   - Update the execution flow diagrams

---

## Troubleshooting

### Why didn't my workflow run?

**Check the trigger conditions:**
- Does your branch match the pattern? (`feature/**`, not `feat/**`)
- Are you pushing to the right branch? (main vs feature)
- Is it a draft PR? (some workflows skip drafts)

### Why is my job running twice?

**Check for duplicate triggers:**
- Look for both `push` and `pull_request` on the same branches
- Check if multiple workflows define the same job
- Review this README's execution flow diagrams

### How do I test workflow changes?

**Best practices:**
1. Create a feature branch: `feature/workflow-updates`
2. Push changes → `ci.yml` runs
3. Open PR → `pr-validation.yml` runs
4. Check Actions tab for results
5. Iterate until green ✅

---

## Quick Reference

| Workflow | Trigger | Main Purpose |
|----------|---------|--------------|
| `ci.yml` | `push` to main/feature/* | Fast feedback during development |
| `pr-validation.yml` | `pull_request` to main | Comprehensive PR quality gate |
| `check-links.yml` | `push` to main, weekly cron | Validate documentation links |
| `label-pr.yml` | `pull_request` events | Auto-label PRs by file changes |
| `lint.yml` | `workflow_call` | Reusable linting workflow |
| `test.yml` | `workflow_call` | Reusable testing workflow |

---

## Maintenance

**Last Updated:** 2025-10-15
**Maintained By:** codewizwit
**Review Cadence:** Update when adding new workflows or changing trigger strategy

**Changelog:**
- 2025-10-15: Removed duplicate triggers (ci.yml + pr-validation.yml deduplication)
- 2025-10-15: Created this README to document workflow strategy

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
