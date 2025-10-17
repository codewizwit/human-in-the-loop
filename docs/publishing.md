# Publishing Guide

Complete guide to publishing new versions of the `@human-in-the-loop/cli` package to npm.

## Overview

The Human-in-the-Loop CLI uses an automated publishing workflow that:

- Triggers on version bumps in `src/cli/package.json`
- Runs comprehensive validation and testing
- Publishes to npm registry
- Creates GitHub releases automatically
- Generates release notes from commit history

## Quick Start

### 1. Prepare Your Release

Before bumping the version, run the pre-release validation script:

```bash
pnpm publish:prepare
```

This will check:

- ✅ Version format (semver)
- ✅ Version is higher than published version
- ✅ Git working directory is clean
- ✅ All tests pass (lint, typecheck, build, unit tests)
- ✅ Required files exist

If all checks pass, you'll see a summary with next steps.

### 2. Bump the Version

Edit `src/cli/package.json` and update the version:

```json
{
  "name": "@human-in-the-loop/cli",
  "version": "1.0.12"
}
```

**Semantic Versioning:**

- `MAJOR.MINOR.PATCH` (e.g., `1.0.12`)
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### 3. Commit and Push

```bash
git add src/cli/package.json
git commit -m "chore: bump version to 1.0.12"
git push origin main
```

### 4. Automated Publishing

Once pushed to `main`, GitHub Actions will:

1. **Check Version Change** - Compare with previous commit
2. **Run All Tests** - Lint, typecheck, build, unit tests, regression tests
3. **Publish to npm** - If all tests pass
4. **Create Git Tag** - `v1.0.12`
5. **Create GitHub Release** - With auto-generated release notes

## Validation Steps

### Pre-Release Checklist

Before bumping the version, ensure:

- [ ] All changes are committed and pushed
- [ ] Branch is up to date with `main`
- [ ] All PR checks have passed
- [ ] Feature is tested and working
- [ ] Documentation is updated
- [ ] Regression tests pass: `pnpm test:regression`
- [ ] Dry run succeeds: `pnpm publish:dry-run`

### What Gets Published

The following files are included in the npm package:

```
@human-in-the-loop/cli/
├── main.js              # CLI entry point (with shebang)
├── package.json         # Package metadata
├── README.md            # Documentation
└── lib/                 # Toolkit modules
    ├── commands/        # CLI commands
    ├── utils/           # Utilities
    └── ...
```

See `src/cli/package.json` "files" field for complete list.

## CI/CD Workflow

### Workflow Trigger

The publish workflow triggers on:

```yaml
on:
  push:
    branches: [main]
    paths:
      - 'src/cli/package.json'
```

Only version changes in `src/cli/package.json` on the `main` branch trigger publishing.

### Jobs

#### 1. check-version

Compares version in current commit vs. previous commit:

```bash
CURRENT_VERSION=$(cat src/cli/package.json | grep '"version"' | awk -F'"' '{print $4}')
PREVIOUS_VERSION=$(git checkout HEAD~1 && cat src/cli/package.json | grep '"version"' | awk -F'"' '{print $4}')

if [ "$CURRENT_VERSION" != "$PREVIOUS_VERSION" ]; then
  echo "changed=true"
fi
```

If version hasn't changed, workflow exits early.

#### 2. test

Runs only if version changed:

- Linting: `pnpm lint`
- Type checking: `pnpm typecheck`
- Build: `pnpm build`
- Unit tests: `pnpm test`
- CLI regression tests (version, help, search, doctor commands)

#### 3. publish

Runs only if all tests pass:

1. **Publish to npm**:

   ```bash
   cd dist/src/cli && npm publish
   ```

2. **Create Git tag**:

   ```bash
   git tag -a "v1.0.12" -m "Release v1.0.12"
   git push origin "v1.0.12"
   ```

3. **Generate release notes**:

   - Extracts commits since last tag
   - Formats as markdown with installation instructions
   - Links to npm package page

4. **Create GitHub release**:
   - Tag: `v1.0.12`
   - Title: `v1.0.12`
   - Body: Auto-generated release notes
   - Not a draft or prerelease

## Manual Publishing (Fallback)

If automated publishing fails, you can publish manually:

### Prerequisites

1. **npm authentication**:

   ```bash
   npm login
   ```

2. **Build the CLI**:
   ```bash
   pnpm build
   ```

### Publish

```bash
cd dist/src/cli
npm publish
```

### Create GitHub Release

```bash
VERSION="1.0.12"
git tag -a "v$VERSION" -m "Release v$VERSION"
git push origin "v$VERSION"

gh release create "v$VERSION" \
  --title "v$VERSION" \
  --notes "Manual release for v$VERSION"
```

## Version History

| Version | Date       | Changes                                        |
| ------- | ---------- | ---------------------------------------------- |
| 1.0.11  | 2025-XX-XX | Added `hit contribute` command with validation |
| 1.0.10  | 2025-XX-XX | Fixed shebang issues for global install        |
| 1.0.0   | 2025-XX-XX | Initial release                                |

## Troubleshooting

### Version Already Published

**Error**: `❌ Version 1.0.11 is already published`

**Fix**: Bump to a higher version (1.0.12)

### Tests Failing

**Error**: Workflow fails during test job

**Fix**:

1. Run locally: `pnpm validate`
2. Fix errors
3. Commit and push fix
4. Bump version again

### npm Authentication Failed

**Error**: `401 Unauthorized - PUT https://registry.npmjs.org/@human-in-the-loop/cli`

**Fix**: Check that `NPM_TOKEN` secret is set in GitHub repository settings:

- Go to Settings > Secrets and variables > Actions
- Ensure `NPM_TOKEN` exists and is valid
- Generate new token at https://www.npmjs.com/settings/tokens

### Git Tag Already Exists

**Error**: `fatal: tag 'v1.0.12' already exists`

**Fix**: Delete the tag locally and remotely:

```bash
git tag -d v1.0.12
git push origin :refs/tags/v1.0.12
```

Then re-run the workflow.

## Rollback

If you need to unpublish a version:

### Unpublish (within 72 hours)

```bash
npm unpublish @human-in-the-loop/cli@1.0.12
```

**Warning**: This is permanent and can only be done within 72 hours of publish.

### Deprecate (safer)

```bash
npm deprecate @human-in-the-loop/cli@1.0.12 "This version has been deprecated. Please use 1.0.13 instead."
```

This warns users without removing the package.

## Security

### npm Token Management

- **Never commit** `NPM_TOKEN` to the repository
- Token is stored as GitHub secret: `${{ secrets.NPM_TOKEN }}`
- Token requires **publish** permission for `@human-in-the-loop` scope
- Rotate token regularly (every 90 days recommended)

### Package Provenance

The workflow uses npm provenance to verify package authenticity:

```yaml
permissions:
  contents: write
  id-token: write
```

This creates a verifiable link between the published package and the GitHub repository.

## Scripts Reference

| Script            | Command                                    | Purpose                        |
| ----------------- | ------------------------------------------ | ------------------------------ |
| `publish:prepare` | `./scripts/publish/prepare-release.sh`     | Validate release readiness     |
| `publish:dry-run` | `cd dist/src/cli && npm publish --dry-run` | Test publish without uploading |
| `test:regression` | `./scripts/test-cli-regression.sh`         | Run CLI E2E tests              |

## Related Documentation

- [CLI Reference](./cli-reference.md) - Complete CLI command documentation
- [Contributing Guidelines](./contributing-guidelines.md) - How to contribute
- [Governance Model](./governance-model.md) - Review and release process

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
