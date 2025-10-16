# NPM Publishing Guide

Guide for publishing `@human-in-the-loop/cli` to npm.

## Prerequisites

### 1. Create npm Account

1. Go to https://www.npmjs.com/signup
2. Create an account
3. Verify your email address
4. (Optional) Set up 2FA for security: https://www.npmjs.com/settings/~/tfa

### 2. Configure npm Locally

```bash
# Login to npm
npm login

# Verify login
npm whoami

# Should output your npm username
```

### 3. Organization Setup (Optional but Recommended)

If you want to publish under `@human-in-the-loop` scope:

1. Create an npm organization: https://www.npmjs.com/org/create
2. Name it `human-in-the-loop`
3. Choose free (public packages) or paid (private packages)

**Note:** The package name `@human-in-the-loop/cli` requires the `human-in-the-loop` organization to exist.

## Pre-Publishing Checklist

### 1. Version Check

Ensure version in `src/cli/package.json` follows [semver](https://semver.org/):

```json
{
  "version": "1.0.0" // MAJOR.MINOR.PATCH
}
```

**Version Guidelines:**

- `MAJOR` - Breaking changes
- `MINOR` - New features (backward compatible)
- `PATCH` - Bug fixes (backward compatible)

### 2. Build the Package

```bash
# Clean build
pnpm nx reset
pnpm build

# Verify build output
ls -la dist/src/cli/
```

**Expected files:**

- `main.js` - CLI entry point
- `package.json` - Package metadata
- `src/` - Source modules
- `README.md` - Documentation
- `LICENSE` - MIT license

### 3. Test Locally

Test the CLI before publishing:

```bash
# Navigate to build directory
cd dist/src/cli

# Install dependencies (already done by build)
# pnpm install

# Test the CLI
node main.js --help
node main.js search
node main.js doctor

# Test as installed package (optional)
npm link
hit --help
npm unlink
```

### 4. Quality Checks

Run all quality checks:

```bash
# From project root
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm check-links
```

All checks must pass before publishing.

## Publishing Process

### First-Time Publish

```bash
# Navigate to build directory
cd dist/src/cli

# Verify package contents
npm pack --dry-run

# This shows what will be included in the package
# Review the output carefully

# Publish to npm (public package)
npm publish --access public

# For scoped packages, you MUST use --access public
# or configure in package.json:
# "publishConfig": { "access": "public" }
```

**Expected output:**

```
+ @human-in-the-loop/cli@1.0.0
```

### Verify Publication

```bash
# Check on npm
npm view @human-in-the-loop/cli

# Test installation
npm install -g @human-in-the-loop/cli

# Test CLI
hit --version
hit search

# Clean up test
npm uninstall -g @human-in-the-loop/cli
```

## Updating the Package

### 1. Update Version

In `src/cli/package.json`:

```bash
# For patches (bug fixes)
npm version patch  # 1.0.0 -> 1.0.1

# For minor (new features)
npm version minor  # 1.0.0 -> 1.1.0

# For major (breaking changes)
npm version major  # 1.0.0 -> 2.0.0
```

### 2. Update Changelog

Create/update `CHANGELOG.md` in `src/cli/`:

```markdown
# Changelog

## [1.0.1] - 2025-01-15

### Fixed

- Fixed scanner not finding nested prompts
- Corrected help text formatting

### Changed

- Updated command name from `hitl` to `hit`
```

### 3. Commit Changes

```bash
git add src/cli/package.json CHANGELOG.md
git commit -m "chore(cli): bump version to 1.0.1"
git push
```

### 4. Rebuild and Publish

```bash
# Clean build
pnpm nx reset
pnpm build

# Publish update
cd dist/src/cli
npm publish
```

## Publishing Checklist

Use this checklist before every publish:

- [ ] Version number updated in `src/cli/package.json`
- [ ] CHANGELOG.md updated with changes
- [ ] All tests passing (`pnpm test`)
- [ ] Linting passing (`pnpm lint`)
- [ ] Type checking passing (`pnpm typecheck`)
- [ ] Build successful (`pnpm build`)
- [ ] Tested CLI locally (`node dist/src/cli/main.js --help`)
- [ ] README.md up to date
- [ ] No secrets or credentials in code
- [ ] Git committed and pushed
- [ ] `npm pack --dry-run` reviewed
- [ ] Logged into npm (`npm whoami`)

## Troubleshooting

### Error: 403 Forbidden

```
npm ERR! code E403
npm ERR! 403 Forbidden - PUT https://registry.npmjs.org/@human-in-the-loop%2fcli
```

**Solutions:**

1. Check you're logged in: `npm whoami`
2. Verify organization exists: `@human-in-the-loop`
3. Use `--access public` flag for scoped packages
4. Ensure you have publish permissions

### Error: Package name already exists

```
npm ERR! code E409
npm ERR! 409 Conflict - PUT https://registry.npmjs.org/@human-in-the-loop%2fcli
```

**Solutions:**

1. Choose a different package name in `package.json`
2. Or claim the existing package if you own it

### Error: Version already published

```
npm ERR! code E403
npm ERR! You cannot publish over the previously published versions
```

**Solution:**
Update the version number in `package.json`:

```bash
npm version patch
```

### Error: Missing README

```
npm WARN package.json No README data
```

**Solution:**
Ensure `README.md` exists in `src/cli/` and is included in build.

## Best Practices

### 1. Use npm Tags

Tag releases for different channels:

```bash
# Latest stable (default)
npm publish --tag latest

# Beta release
npm publish --tag beta

# Alpha release
npm publish --tag alpha
```

Users install with:

```bash
npm install @human-in-the-loop/cli@beta
```

### 2. Deprecate Old Versions

If a version has critical bugs:

```bash
npm deprecate @human-in-the-loop/cli@1.0.0 "Critical bug - upgrade to 1.0.1"
```

### 3. Unpublish Policy

**WARNING:** Unpublishing is discouraged and restricted:

- Can only unpublish within 72 hours
- Affects all users
- Version number cannot be reused

```bash
# Only if absolutely necessary
npm unpublish @human-in-the-loop/cli@1.0.0
```

### 4. Automate Publishing

Create a GitHub Action for automated publishing:

`.github/workflows/publish-cli.yml`:

```yaml
name: Publish CLI to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install
      - run: pnpm build

      - name: Publish to npm
        working-directory: dist/src/cli
        run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Setup:**

1. Create npm access token: https://www.npmjs.com/settings/~/tokens
2. Add to GitHub secrets as `NPM_TOKEN`
3. Create GitHub release to trigger publish

## Security

### 1. Enable 2FA

Required for publishing:

```bash
# Enable 2FA on npm website
# Settings > Two-Factor Authentication
```

### 2. Use Automation Tokens

For CI/CD:

- Use automation tokens (not your personal token)
- Set appropriate scopes (publish only)
- Rotate tokens regularly

### 3. Audit Dependencies

Before publishing:

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix
```

## Support

- npm Documentation: https://docs.npmjs.com/
- npm Support: https://www.npmjs.com/support
- Package Status: https://www.npmjs.com/package/@human-in-the-loop/cli

---

## Quick Reference

```bash
# Login
npm login

# Build
pnpm build

# Test package contents
cd dist/src/cli && npm pack --dry-run

# Publish
npm publish --access public

# Verify
npm view @human-in-the-loop/cli

# Install globally to test
npm install -g @human-in-the-loop/cli
```
