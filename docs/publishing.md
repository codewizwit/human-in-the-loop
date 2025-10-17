# Publishing Guide

How to publish new versions of `@human-in-the-loop/cli` to npm.

## Setup (One-time)

Configure npm trusted publisher for secure OIDC authentication:

1. Go to https://www.npmjs.com/package/@human-in-the-loop/cli/access
2. Click "Publishing access" → "Configure trusted publisher"
3. Add GitHub Actions:
   - **Provider**: GitHub
   - **Repository**: `codewizwit/human-in-the-loop`
   - **Workflow**: `publish-npm.yml`
   - **Environment**: (leave blank)

No npm tokens needed! Workflow authenticates via OIDC.

## Quick Start

```bash
# 1. Make your changes with conventional commits
pnpm commit  # Interactive commit helper (enforces conventional format)

# 2. When ready to release
pnpm release  # Auto-bumps version based on commits + creates changelog

# 3. Push to trigger automated publish
git push --follow-tags origin main  # CI auto-publishes
```

## Version Bumping (Automatic)

Version is determined by commit messages (conventional commits):

- `fix:` → **patch** (1.0.10 → 1.0.11)
- `feat:` → **minor** (1.0.10 → 1.1.0)
- `feat!:` or `BREAKING CHANGE:` → **major** (1.0.10 → 2.0.0)

Example:

```bash
pnpm commit
# Select: feat
# Enter: add hit contribute command
# Creates: "feat: add hit contribute command"

pnpm release
# Auto-bumps to 1.1.0 (minor)
# Creates CHANGELOG.md
# Commits version bump
# Creates git tag v1.1.0

git push --follow-tags origin main
# Workflow publishes v1.1.0 to npm
```

## What Happens

When you push a version bump to `main`:

1. **Version Check** - Detects change in `src/cli/package.json`
2. **Tests** - Runs lint, typecheck, build, unit tests
3. **Publish** - Publishes to npm registry
4. **Release** - Creates Git tag and GitHub release with changelog

## Scripts

| Command                | Purpose                         |
| ---------------------- | ------------------------------- |
| `pnpm publish:prepare` | Validate before bumping version |
| `pnpm publish:dry-run` | Test package contents           |
| `pnpm test:regression` | Run CLI E2E tests               |

## Troubleshooting

**Version already published**: Bump to higher version

**Tests failing**: Run `pnpm validate` locally, fix errors, try again

**npm auth failed**: Check `NPM_TOKEN` secret in GitHub repo settings

**Tag exists**: Delete tag: `git tag -d v1.0.12 && git push origin :refs/tags/v1.0.12`

## Manual Publish (Fallback)

```bash
pnpm build
cd dist/src/cli
npm publish

# Create release
gh release create "v1.0.12" --title "v1.0.12" --notes "Release notes"
```

## Rollback

```bash
# Deprecate (recommended)
npm deprecate @human-in-the-loop/cli@1.0.12 "Use 1.0.13 instead"

# Unpublish (within 72 hours only)
npm unpublish @human-in-the-loop/cli@1.0.12
```

---

See [CLI Reference](./cli-reference.md) | [Contributing](./contributing-guidelines.md)
