# Publishing Guide

How to publish new versions of `@human-in-the-loop/cli` to npm.

## Quick Start

```bash
# 1. Validate release
pnpm publish:prepare

# 2. Bump version in src/cli/package.json
# Use semver: MAJOR.MINOR.PATCH (e.g., 1.0.12)

# 3. Commit and push
git add src/cli/package.json
git commit -m "chore: bump to 1.0.12"
git push origin main

# 4. CI auto-publishes and creates GitHub release
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
