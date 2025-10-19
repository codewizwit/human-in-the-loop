# Release Process

This repository uses **manual releases** triggered through GitHub Actions.

---

## 📋 How It Works

1. **Create a PR with conventional commits:**

   - `feat:` New feature (bumps **minor** version: 1.1.0 → 1.2.0)
   - `fix:` Bug fix (bumps **patch** version: 1.1.0 → 1.1.1)
   - `BREAKING CHANGE:` Breaking change (bumps **major** version: 1.1.0 → 2.0.0)
   - `chore:`, `docs:`, `refactor:`, etc. (no version bump)

2. **Merge PR to main**

3. **Manually trigger release from GitHub UI:**

   - Go to **Actions** → **Release and Publish**
   - Click **Run workflow**
   - Choose version bump type:
     - **Empty** - Auto-detect from conventional commits (recommended)
     - **patch** - Force patch bump (1.1.0 → 1.1.1)
     - **minor** - Force minor bump (1.1.0 → 1.2.0)
     - **major** - Force major bump (1.1.0 → 2.0.0)
   - Click **Run workflow**

4. **GitHub Actions automatically:**
   - ✅ Runs tests and type checking
   - ✅ Bumps version using standard-version
   - ✅ Updates `CHANGELOG.md`
   - ✅ Builds the package
   - ✅ Publishes to npm with provenance
   - ✅ Creates GitHub release with changelog
   - ✅ Pushes version commit + tag back to main

---

## 💡 Tips

- **Use conventional commit format** for automatic version detection
- **Test before releasing** - CI runs automatically on PRs
- **Manual control** - Only release when you're ready, not on every merge
- **Flexibility** - Override conventional commits with manual version type if needed
- **Check the workflow status**: [Actions](https://github.com/codewizwit/human-in-the-loop/actions/workflows/publish-npm.yml)

---

## 🔧 Manual Testing (Pre-Publish)

If you need to test the package locally before merging:

```bash
# Build the package
pnpm build

# Test the CLI locally
cd dist/src/cli
npm link

# Run the CLI
hit --help

# Unlink when done
npm unlink -g @human-in-the-loop/cli
```

---

## 🚀 Workflow Details

**File:** `.github/workflows/publish-npm.yml`

**Triggers:** Push to `main` branch

**Steps:**

1. Check if commit is already a release (skip if yes)
2. Install dependencies
3. Run linting, type checking, tests, and build
4. Run `standard-version` to bump version
5. Push version commit + tag
6. Publish to npm with OIDC provenance
7. Create GitHub release

**Environment:** `production` (for npm trusted publisher)

---

## 📦 Release Artifacts

Each release creates:

- **Git tag** (e.g., `v1.2.0`)
- **GitHub Release** with changelog
- **npm Package** at https://www.npmjs.com/package/@human-in-the-loop/cli
- **Provenance Statement** at https://search.sigstore.dev

---

## 🔗 Resources

- [Conventional Commits](https://www.conventionalcommits.org)
- [standard-version](https://github.com/conventional-changelog/standard-version)
- [npm Trusted Publishers](https://docs.npmjs.com/generating-provenance-statements)
- [Latest Releases](https://github.com/codewizwit/human-in-the-loop/releases)

---

## 🛠️ Troubleshooting

### How do I trigger a release?

Releases are now **manual**:

1. Go to [Actions](https://github.com/codewizwit/human-in-the-loop/actions/workflows/publish-npm.yml)
2. Click "Run workflow"
3. Select version bump type (or leave empty for auto-detection)
4. Click "Run workflow"

### Version didn't bump as expected

When using **auto-detection** (empty version type):

- `feat:` commits bump **minor** version (1.1.0 → 1.2.0)
- `fix:` commits bump **patch** version (1.1.0 → 1.1.1)
- `BREAKING CHANGE:` in commit body bumps **major** version (1.1.0 → 2.0.0)
- Other types (`chore:`, `docs:`, `refactor:`) are ignored

**Solution:** Use manual version type if auto-detection isn't working as expected.

### Publish failed

Check the [workflow logs](https://github.com/codewizwit/human-in-the-loop/actions) for:

- Test failures (fix code and re-run workflow)
- Build errors (fix build and re-run workflow)
- npm authentication issues (check NPM_TOKEN secret)
- Permission errors (check GitHub repo settings)

---

**Human-in-the-Loop by codewizwit**
Build with care. Ship with purpose.
